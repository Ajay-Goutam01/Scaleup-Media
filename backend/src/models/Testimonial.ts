import mongoose, { Document, Schema } from 'mongoose';

export interface ITestimonial extends Document {
  clientName: string;
  company: string;
  review: string;
  profileImage: string;
  rating: number;
  marqueeRow: number; // 1 = Right to Left, 2 = Left to Right
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company/Brand name is required'],
      trim: true,
    },
    review: {
      type: String,
      required: [true, 'Review text is required'],
    },
    profileImage: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    marqueeRow: {
      type: Number,
      default: 1,
      enum: [1, 2],
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

export const Testimonial = mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
