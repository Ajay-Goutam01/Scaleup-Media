import mongoose, { Document, Schema } from 'mongoose';

export interface IBranding extends Document {
  brandName: string;
  tagline: string;
  logoUrl: string;
  logoFileId: string;
  faviconUrl: string;
  faviconFileId: string;
  updatedAt: Date;
}

const BrandingSchema = new Schema<IBranding>(
  {
    brandName: {
      type: String,
      default: 'ScaleUp Media',
      trim: true,
    },
    tagline: {
      type: String,
      default: 'GROWTH. STRATEGY. IMPACT.',
      trim: true,
    },
    logoUrl: {
      type: String,
      default: '',
    },
    logoFileId: {
      type: String,
      default: '',
    },
    faviconUrl: {
      type: String,
      default: '',
    },
    faviconFileId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Branding = mongoose.model<IBranding>('Branding', BrandingSchema);
