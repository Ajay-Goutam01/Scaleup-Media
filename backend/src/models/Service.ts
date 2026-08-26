import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  serviceNumber: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  icon: string;
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    serviceNumber: {
      type: String,
      required: [true, 'Service number is required (e.g. 01, 02)'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
    },
    tagline: {
      type: String,
      required: [true, 'Service tagline is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    icon: {
      type: String,
      default: 'Sparkles',
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Service = mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
