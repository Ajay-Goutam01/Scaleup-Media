import mongoose, { Document, Schema } from 'mongoose';

export interface ISectionSettings extends Document {
  hero: boolean;
  reality: boolean;
  services: boolean;
  whyScaleUp: boolean;
  projects: boolean;
  testimonials: boolean;
  process: boolean;
  promise: boolean;
  cta: boolean;
  footer: boolean;
  floatingWhatsApp: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SectionSettingsSchema = new Schema<ISectionSettings>(
  {
    hero: { type: Boolean, default: true },
    reality: { type: Boolean, default: true },
    services: { type: Boolean, default: true },
    whyScaleUp: { type: Boolean, default: true },
    projects: { type: Boolean, default: true },
    testimonials: { type: Boolean, default: true },
    process: { type: Boolean, default: true },
    promise: { type: Boolean, default: true },
    cta: { type: Boolean, default: true },
    footer: { type: Boolean, default: true },
    floatingWhatsApp: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const SectionSettings = mongoose.models.SectionSettings || mongoose.model<ISectionSettings>('SectionSettings', SectionSettingsSchema);
