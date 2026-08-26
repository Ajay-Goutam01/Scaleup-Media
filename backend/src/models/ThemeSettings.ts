import mongoose, { Document, Schema } from 'mongoose';

export interface IThemeSettings extends Document {
  preset: 'light' | 'scaleup-navy' | 'midnight';
  backgroundColor: string;
  surfaceColor: string;
  surfaceSecondaryColor: string;
  primaryColor: string;
  accentColor: string;
  accentSecondaryColor: string;
  textColor: string;
  secondaryTextColor: string;
  borderColor: string;
  customizationEnabled: boolean;
  updatedAt: Date;
}

const ThemeSettingsSchema = new Schema<IThemeSettings>(
  {
    preset: {
      type: String,
      default: 'scaleup-navy',
      enum: ['light', 'scaleup-navy', 'midnight', 'navy'],
    },
    backgroundColor: {
      type: String,
      default: '#07111F',
    },
    surfaceColor: {
      type: String,
      default: '#0D1B2A',
    },
    surfaceSecondaryColor: {
      type: String,
      default: '#10253A',
    },
    primaryColor: {
      type: String,
      default: '#2563EB',
    },
    accentColor: {
      type: String,
      default: '#08BDF5',
    },
    accentSecondaryColor: {
      type: String,
      default: '#08BDF5',
    },
    textColor: {
      type: String,
      default: '#FFFFFF',
    },
    secondaryTextColor: {
      type: String,
      default: '#AAB8C8',
    },
    borderColor: {
      type: String,
      default: 'rgba(255,255,255,0.10)',
    },
    customizationEnabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const ThemeSettings = mongoose.model<IThemeSettings>('ThemeSettings', ThemeSettingsSchema);
