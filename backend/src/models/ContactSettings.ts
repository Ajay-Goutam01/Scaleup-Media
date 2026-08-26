import mongoose, { Document, Schema } from 'mongoose';

export interface IContactSettings extends Document {
  phone: string;
  whatsAppNumber: string;
  defaultWhatsAppMessage: string;
  email: string;
  instagram: string;
  founderInstagram: string;
  facebook: string;
  linkedin: string;
  youtube: string;
  address: string;
  // Founder / Footer Profile fields
  founderName: string;
  founderBio: string;
  founderPhotoUrl: string;
  founderPhotoFileId: string;
  founderLinkedin: string;
  founderFacebook: string;
  founderYoutube: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSettingsSchema = new Schema<IContactSettings>(
  {
    phone: {
      type: String,
      default: '6268523635',
    },
    whatsAppNumber: {
      type: String,
      default: '6268523635',
    },
    defaultWhatsAppMessage: {
      type: String,
      default: "Hi ScaleUp Media, I'm interested in scaling my brand. Let's discuss a project!",
    },
    email: {
      type: String,
      default: 'shivamconnect65@gmail.com',
    },
    instagram: {
      type: String,
      default: '@scaleup.media.io',
    },
    founderInstagram: {
      type: String,
      default: '@shivamxbizz',
    },
    facebook: {
      type: String,
      default: 'https://facebook.com',
    },
    linkedin: {
      type: String,
      default: 'https://linkedin.com',
    },
    youtube: {
      type: String,
      default: 'https://youtube.com',
    },
    address: {
      type: String,
      default: 'India / Global Digital Agency',
    },
    founderName: {
      type: String,
      default: 'Shivam',
    },
    founderBio: {
      type: String,
      default:
        'Building brands through smart business strategy, creative marketing and high-impact content. From shooting and editing to paid advertising, we turn ideas into digital growth.',
    },
    founderPhotoUrl: {
      type: String,
      default: '',
    },
    founderPhotoFileId: {
      type: String,
      default: '',
    },
    founderLinkedin: {
      type: String,
      default: '',
    },
    founderFacebook: {
      type: String,
      default: '',
    },
    founderYoutube: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const ContactSettings = mongoose.models.ContactSettings || mongoose.model<IContactSettings>('ContactSettings', ContactSettingsSchema);
