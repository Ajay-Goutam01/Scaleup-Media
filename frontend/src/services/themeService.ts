import { ThemeSettings } from '../types';
import { themeApi } from '../api/theme';

export type ThemePresetKey = 'light' | 'scaleup-navy' | 'midnight';

export interface ThemeTokens {
  preset: ThemePresetKey;
  name: string;
  tagline: string;
  background: string;
  surface: string;
  surfaceSecondary: string;
  card: string;
  cardBorder: string;
  text: string;
  textSecondary: string;
  primary: string;
  accent: string;
  accentSecondary: string;
  border: string;
  navbar: string;
  footer: string;
  buttonText: string;
  shadow: string;
}

export const THEME_PRESETS: Record<ThemePresetKey, ThemeTokens> = {
  'light': {
    preset: 'light',
    name: 'LIGHT',
    tagline: 'Clean & Bright Agency Style',
    background: '#F7F9FC',
    surface: '#FFFFFF',
    surfaceSecondary: '#F1F5F9',
    card: '#FFFFFF',
    cardBorder: '#DCE3EA',
    text: '#07111F',
    textSecondary: '#334155',
    primary: '#2563EB',
    accent: '#0284C7',
    accentSecondary: '#2563EB',
    border: '#DCE3EA',
    navbar: 'rgba(247, 249, 252, 0.92)',
    footer: '#F1F5F9',
    buttonText: '#FFFFFF',
    shadow: '0 4px 20px -2px rgba(0, 0, 0, 0.06)',
  },
  'scaleup-navy': {
    preset: 'scaleup-navy',
    name: 'SCALEUP NAVY',
    tagline: 'Signature Deep Navy Identity',
    background: '#07111F',
    surface: '#0D1B2A',
    surfaceSecondary: '#10253A',
    card: '#0D1B2A',
    cardBorder: 'rgba(255, 255, 255, 0.12)',
    text: '#FFFFFF',
    textSecondary: '#94A3B8',
    primary: '#2563EB',
    accent: '#08BDF5',
    accentSecondary: '#08BDF5',
    border: 'rgba(255, 255, 255, 0.12)',
    navbar: 'rgba(7, 17, 31, 0.92)',
    footer: '#07111F',
    buttonText: '#FFFFFF',
    shadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  },
  'midnight': {
    preset: 'midnight',
    name: 'MIDNIGHT',
    tagline: 'Cinematic Charcoal & Violet',
    background: '#050608',
    surface: '#0D1015',
    surfaceSecondary: '#151A22',
    card: '#0D1015',
    cardBorder: 'rgba(255, 255, 255, 0.10)',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    primary: '#7C8CFF',
    accent: '#22D3EE',
    accentSecondary: '#7C8CFF',
    border: 'rgba(255, 255, 255, 0.10)',
    navbar: 'rgba(5, 6, 8, 0.92)',
    footer: '#050608',
    buttonText: '#FFFFFF',
    shadow: '0 8px 32px 0 rgba(0, 0, 0, 0.60)',
  },
};

const LOCAL_STORAGE_KEY = 'scaleup_visitor_theme';

export const themeService = {
  /**
   * Normalize preset name
   */
  normalizePreset(preset?: string): ThemePresetKey {
    if (!preset) return 'scaleup-navy';
    if (preset === 'navy') return 'scaleup-navy';
    if (preset === 'light' || preset === 'midnight' || preset === 'scaleup-navy') {
      return preset;
    }
    return 'scaleup-navy';
  },

  /**
   * Get visitor's local override if set
   */
  getVisitorTheme(): ThemePresetKey | null {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored && (stored === 'light' || stored === 'scaleup-navy' || stored === 'midnight')) {
        return stored as ThemePresetKey;
      }
    } catch {}
    return null;
  },

  /**
   * Set visitor's local override
   */
  setVisitorTheme(preset: ThemePresetKey): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, preset);
    } catch {}
  },

  /**
   * Clear visitor's local override (reset to admin default)
   */
  clearVisitorTheme(): void {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {}
  },

  /**
   * Convert ThemeSettings to complete tokens
   */
  resolveTokens(settings?: ThemeSettings | null, overridePreset?: ThemePresetKey | null): ThemeTokens {
    const presetKey = overridePreset || this.normalizePreset(settings?.preset);
    const base = THEME_PRESETS[presetKey] || THEME_PRESETS['scaleup-navy'];

    // If customization is enabled in settings and matches the active preset
    if (settings?.customizationEnabled && settings?.preset === presetKey) {
      return {
        ...base,
        background: settings.backgroundColor || base.background,
        surface: settings.surfaceColor || base.surface,
        surfaceSecondary: settings.surfaceSecondaryColor || base.surfaceSecondary,
        primary: settings.primaryColor || base.primary,
        accent: settings.accentColor || base.accent,
        accentSecondary: settings.accentSecondaryColor || base.accentSecondary,
        text: settings.textColor || base.text,
        textSecondary: settings.secondaryTextColor || base.textSecondary,
        border: settings.borderColor || base.border,
        card: settings.surfaceColor || base.card,
        cardBorder: settings.borderColor || base.cardBorder,
      };
    }

    return base;
  },

  /**
   * Apply CSS variables and data-theme to documentElement
   */
  applyToDOM(tokens: ThemeTokens): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    // Set data attribute for theme-specific styling hooks
    root.setAttribute('data-theme', tokens.preset);

    // Standard --theme-* variables
    root.style.setProperty('--theme-bg', tokens.background);
    root.style.setProperty('--theme-background', tokens.background);
    root.style.setProperty('--theme-surface', tokens.surface);
    root.style.setProperty('--theme-surface-secondary', tokens.surfaceSecondary);
    root.style.setProperty('--theme-card', tokens.card);
    root.style.setProperty('--theme-card-border', tokens.cardBorder);
    root.style.setProperty('--theme-text', tokens.text);
    root.style.setProperty('--theme-text-secondary', tokens.textSecondary);
    root.style.setProperty('--theme-primary', tokens.primary);
    root.style.setProperty('--theme-accent', tokens.accent);
    root.style.setProperty('--theme-accent-secondary', tokens.accentSecondary);
    root.style.setProperty('--theme-border', tokens.border);
    root.style.setProperty('--theme-navbar', tokens.navbar);
    root.style.setProperty('--theme-footer', tokens.footer);
    root.style.setProperty('--theme-button-text', tokens.buttonText);
    root.style.setProperty('--theme-shadow', tokens.shadow);

    // Backward-compat aliases
    root.style.setProperty('--color-bg', tokens.background);
    root.style.setProperty('--color-surface', tokens.surface);
    root.style.setProperty('--color-surface-2', tokens.surfaceSecondary);
    root.style.setProperty('--color-text', tokens.text);
    root.style.setProperty('--color-text-2', tokens.textSecondary);
    root.style.setProperty('--color-accent', tokens.accent);
    root.style.setProperty('--color-accent-2', tokens.accentSecondary);
    root.style.setProperty('--color-border', tokens.border);
    root.style.setProperty('--color-primary', tokens.primary);
    root.style.setProperty('--bg-main', tokens.background);
    root.style.setProperty('--text-primary', tokens.text);
    root.style.setProperty('--text-secondary', tokens.textSecondary);
    root.style.setProperty('--accent-cyan', tokens.accent);
    root.style.setProperty('--brand-blue', tokens.primary);
    root.style.setProperty('--border-subtle', tokens.border);
  },

  /**
   * Fetch from backend API
   */
  async fetchTheme(): Promise<ThemeSettings | null> {
    try {
      const res = await themeApi.get();
      if (res.success && res.data) {
        return res.data;
      }
    } catch (err) {
      console.warn('[themeService] Could not fetch theme:', err);
    }
    return null;
  },

  /**
   * Save theme to backend DB
   */
  async saveTheme(preset: ThemePresetKey, customColors?: Partial<ThemeSettings>): Promise<ThemeSettings | null> {
    const payload: any = { preset };
    if (customColors && Object.keys(customColors).length > 0) {
      payload.customizationEnabled = true;
      payload.customColors = customColors;
    }
    const res = await themeApi.update(payload);
    if (res.success && res.data) {
      return res.data;
    }
    return null;
  },

  /**
   * Reset theme to pure preset default
   */
  async resetTheme(preset: ThemePresetKey): Promise<ThemeSettings | null> {
    const res = await themeApi.update({ preset, reset: true });
    if (res.success && res.data) {
      return res.data;
    }
    return null;
  },
};
