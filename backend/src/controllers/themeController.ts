import { Request, Response } from 'express';
import { store } from '../services/store';

export interface ThemePresetConfig {
  preset: 'light' | 'scaleup-navy' | 'midnight';
  name: string;
  backgroundColor: string;
  surfaceColor: string;
  surfaceSecondaryColor: string;
  primaryColor: string;
  accentColor: string;
  accentSecondaryColor: string;
  textColor: string;
  secondaryTextColor: string;
  borderColor: string;
}

export const THEME_PRESETS: Record<string, ThemePresetConfig> = {
  'light': {
    preset: 'light',
    name: 'LIGHT',
    backgroundColor: '#F7F9FC',
    surfaceColor: '#FFFFFF',
    surfaceSecondaryColor: '#F1F5F9',
    primaryColor: '#2563EB',
    accentColor: '#08BDF5',
    accentSecondaryColor: '#2563EB',
    textColor: '#07111F',
    secondaryTextColor: '#667085',
    borderColor: '#DCE3EA',
  },
  'scaleup-navy': {
    preset: 'scaleup-navy',
    name: 'SCALEUP NAVY',
    backgroundColor: '#07111F',
    surfaceColor: '#0D1B2A',
    surfaceSecondaryColor: '#10253A',
    primaryColor: '#2563EB',
    accentColor: '#08BDF5',
    accentSecondaryColor: '#08BDF5',
    textColor: '#FFFFFF',
    secondaryTextColor: '#AAB8C8',
    borderColor: 'rgba(255,255,255,0.10)',
  },
  'navy': {
    preset: 'scaleup-navy',
    name: 'SCALEUP NAVY',
    backgroundColor: '#07111F',
    surfaceColor: '#0D1B2A',
    surfaceSecondaryColor: '#10253A',
    primaryColor: '#2563EB',
    accentColor: '#08BDF5',
    accentSecondaryColor: '#08BDF5',
    textColor: '#FFFFFF',
    secondaryTextColor: '#AAB8C8',
    borderColor: 'rgba(255,255,255,0.10)',
  },
  'midnight': {
    preset: 'midnight',
    name: 'MIDNIGHT',
    backgroundColor: '#050608',
    surfaceColor: '#0D1015',
    surfaceSecondaryColor: '#151A22',
    primaryColor: '#7C8CFF',
    accentColor: '#22D3EE',
    accentSecondaryColor: '#7C8CFF',
    textColor: '#F8FAFC',
    secondaryTextColor: '#98A2B3',
    borderColor: 'rgba(255,255,255,0.08)',
  },
};

/**
 * GET /api/theme — Public
 */
export const getTheme = async (req: Request, res: Response): Promise<void> => {
  try {
    const theme = await store.getThemeSettings();
    res.status(200).json({ success: true, data: theme });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch theme.', error: error.message });
  }
};

/**
 * PUT /api/theme — Admin: apply theme preset or custom overrides
 */
export const updateTheme = async (req: Request, res: Response): Promise<void> => {
  try {
    const { preset, reset, customizationEnabled, customColors } = req.body;

    let targetPreset = preset || 'scaleup-navy';
    if (targetPreset === 'navy') targetPreset = 'scaleup-navy';

    if (!THEME_PRESETS[targetPreset]) {
      res.status(400).json({
        success: false,
        message: `Invalid preset "${targetPreset}". Allowed: light, scaleup-navy, midnight`,
      });
      return;
    }

    const basePreset = THEME_PRESETS[targetPreset];
    let updates: any = {
      ...basePreset,
      preset: basePreset.preset,
      customizationEnabled: false,
    };

    // If custom colors provided and not a reset
    if (!reset && customizationEnabled && customColors) {
      updates.customizationEnabled = true;
      const allowedKeys = [
        'backgroundColor', 'surfaceColor', 'surfaceSecondaryColor',
        'primaryColor', 'accentColor', 'accentSecondaryColor',
        'textColor', 'secondaryTextColor', 'borderColor',
      ];
      for (const key of allowedKeys) {
        if (customColors[key] !== undefined && typeof customColors[key] === 'string' && customColors[key].trim()) {
          updates[key] = customColors[key].trim();
        }
      }
    }

    const updated = await store.updateThemeSettings(updates);
    res.status(200).json({ success: true, message: `Theme applied: ${basePreset.name}`, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update theme.', error: error.message });
  }
};
