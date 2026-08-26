import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  slug: string;
  client: string;
  category: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  gallery: string[];
  videoUrl?: string;
  externalUrl?: string;
  results?: string;
  featured: boolean;
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    client: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Project category is required'],
      trim: true,
      default: 'Digital Growth',
    },
    shortDescription: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
    },
    thumbnail: {
      type: String,
      required: [true, 'Thumbnail image URL is required'],
    },
    gallery: {
      type: [String],
      default: [],
    },
    videoUrl: {
      type: String,
      trim: true,
    },
    externalUrl: {
      type: String,
      trim: true,
    },
    results: {
      type: String,
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
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

ProjectSchema.pre('save', function (next) {
  if (!this.slug || this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000);
  }
  next();
});

export const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
