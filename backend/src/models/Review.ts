import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  name: string;
  company: string;
  email?: string;
  review: string;
  rating: number;
  profileImageUrl?: string;
  profileImageFileId?: string;
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
  marqueeRow: 1 | 2;
  order: number;
  submittedIp?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    company: {
      type: String,
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    review: {
      type: String,
      required: [true, 'Review text is required'],
      trim: true,
      maxlength: [1500, 'Review cannot exceed 1500 characters'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    profileImageUrl: {
      type: String,
      default: '',
    },
    profileImageFileId: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'unpublished'],
      default: 'pending',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    marqueeRow: {
      type: Number,
      enum: [1, 2],
      default: 1,
    },
    order: {
      type: Number,
      default: 0,
    },
    submittedIp: {
      type: String,
      select: false, // never expose IP in public queries
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast public query
ReviewSchema.index({ status: 1, marqueeRow: 1, order: 1 });

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
