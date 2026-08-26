import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  mustChangePassword: boolean;
  lastPasswordChangedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: {
      type: String,
      required: [true, 'Admin name is required'],
      trim: true,
      default: 'ScaleUp Admin',
    },
    email: {
      type: String,
      required: [true, 'Admin email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Admin password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      default: 'superadmin',
      enum: ['superadmin', 'editor'],
    },
    mustChangePassword: {
      type: Boolean,
      default: false,
    },
    lastPasswordChangedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.lastPasswordChangedAt = new Date();
  next();
});

AdminSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const Admin = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
