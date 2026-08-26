import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ThemeSettings } from '../types';
import { themeService, ThemePresetKey, ThemeTokens, THEME_PRESETS } from '../services/themeService';

interface ThemeContextType {
  currentPreset: ThemePresetKey;
  tokens: ThemeTokens;
  dbTheme: ThemeSettings | null;
  isVisitorOverride: boolean;
  previewPreset: ThemePresetKey | null;
  setPreview: (preset: ThemePresetKey | null) => void;
  setVisitorTheme: (preset: ThemePresetKey) => void;
  clearVisitorTheme: () => void;
  applyAndSaveAdminTheme: (preset: ThemePresetKey, customColors?: Partial<ThemeSettings>) => Promise<boolean>;
  resetAdminTheme: (preset: ThemePresetKey) => Promise<boolean>;
  refreshTheme: () => Promise<void>;
  presets: typeof THEME_PRESETS;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dbTheme, setDbTheme] = useState<ThemeSettings | null>(null);
  const [visitorTheme, setVisitorThemeState] = useState<ThemePresetKey | null>(() => themeService.getVisitorTheme());
  const [previewPreset, setPreviewPreset] = useState<ThemePresetKey | null>(null);

  // Determine active preset based on priority:
  // 1. previewPreset (if admin is previewing)
  // 2. visitorTheme (localStorage)
  // 3. dbTheme (backend database default)
  // 4. 'scaleup-navy' (default fallback)
  const activePreset: ThemePresetKey = useMemo(() => {
    if (previewPreset) return previewPreset;
    if (visitorTheme) return visitorTheme;
    if (dbTheme?.preset) return themeService.normalizePreset(dbTheme.preset);
    return 'scaleup-navy';
  }, [previewPreset, visitorTheme, dbTheme]);

  // Compute full resolved tokens
  const tokens: ThemeTokens = useMemo(() => {
    return themeService.resolveTokens(dbTheme, previewPreset || visitorTheme || null);
  }, [dbTheme, previewPreset, visitorTheme]);

  // Apply CSS variables whenever tokens change
  useEffect(() => {
    themeService.applyToDOM(tokens);
  }, [tokens]);

  // Initial load of db theme
  const loadDbTheme = useCallback(async () => {
    const data = await themeService.fetchTheme();
    if (data) {
      setDbTheme(data);
    }
  }, []);

  useEffect(() => {
    loadDbTheme();
  }, [loadDbTheme]);

  // Public visitor switcher
  const setVisitorTheme = useCallback((preset: ThemePresetKey) => {
    themeService.setVisitorTheme(preset);
    setVisitorThemeState(preset);
    setPreviewPreset(null);
  }, []);

  const clearVisitorTheme = useCallback(() => {
    themeService.clearVisitorTheme();
    setVisitorThemeState(null);
    setPreviewPreset(null);
  }, []);

  // Admin preview
  const setPreview = useCallback((preset: ThemePresetKey | null) => {
    setPreviewPreset(preset);
  }, []);

  // Admin save to DB
  const applyAndSaveAdminTheme = useCallback(async (preset: ThemePresetKey, customColors?: Partial<ThemeSettings>): Promise<boolean> => {
    const saved = await themeService.saveTheme(preset, customColors);
    if (saved) {
      setDbTheme(saved);
      // Clear visitor override on admin save so everyone sees the new default
      themeService.clearVisitorTheme();
      setVisitorThemeState(null);
      setPreviewPreset(null);
      return true;
    }
    return false;
  }, []);

  // Admin reset
  const resetAdminTheme = useCallback(async (preset: ThemePresetKey): Promise<boolean> => {
    const reset = await themeService.resetTheme(preset);
    if (reset) {
      setDbTheme(reset);
      themeService.clearVisitorTheme();
      setVisitorThemeState(null);
      setPreviewPreset(null);
      return true;
    }
    return false;
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        currentPreset: activePreset,
        tokens,
        dbTheme,
        isVisitorOverride: !!visitorTheme,
        previewPreset,
        setPreview,
        setVisitorTheme,
        clearVisitorTheme,
        applyAndSaveAdminTheme,
        resetAdminTheme,
        refreshTheme: loadDbTheme,
        presets: THEME_PRESETS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
