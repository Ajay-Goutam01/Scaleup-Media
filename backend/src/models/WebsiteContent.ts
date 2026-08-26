import mongoose, { Document, Schema } from 'mongoose';

export interface IWebsiteContent extends Document {
  heroHeading: string;
  heroDescription: string;
  heroPrimaryBtn: string;
  heroSecondaryBtn: string;
  realityHeading: string;
  realityDescription: string;
  realityPoints: Array<{ title: string; desc: string }>;
  realityStatement: string;
  whyScaleUpHeading: string;
  whyScaleUpSubtitle: string;
  whyScaleUpItems: Array<{ number: string; title: string; desc: string }>;
  promiseLabel: string;
  promiseHeading: string;
  promiseText1: string;
  promiseText2: string;
  promiseStatement: string;
  promiseWords: string[];
  ctaHeading: string;
  ctaDescription: string;
  ctaButtonText: string;
  footerTagline: string;
  createdAt: Date;
  updatedAt: Date;
}

const WebsiteContentSchema = new Schema<IWebsiteContent>(
  {
    heroHeading: {
      type: String,
      default: 'WE BUILD BRANDS THAT GET NOTICED.',
    },
    heroDescription: {
      type: String,
      default: 'Strategy, creative content and performance marketing designed to help businesses grow.',
    },
    heroPrimaryBtn: {
      type: String,
      default: 'Start a Project →',
    },
    heroSecondaryBtn: {
      type: String,
      default: 'View Our Work →',
    },
    realityHeading: {
      type: String,
      default: 'YOUR CUSTOMERS ARE ALREADY ONLINE.',
    },
    realityDescription: {
      type: String,
      default: 'They are discovering businesses on Instagram, comparing brands, searching online and deciding who to trust.',
    },
    realityPoints: {
      type: [
        {
          title: String,
          desc: String,
        },
      ],
      default: [
        { title: 'Low online visibility', desc: 'Lost in the digital noise without a strategic positioning footprint.' },
        { title: 'Inconsistent content', desc: 'Irregular posting schedule eroding brand credibility and algorithm favor.' },
        { title: 'Weak digital presence', desc: 'Unoptimized touchpoints failing to build trust with modern buyers.' },
        { title: 'Poor branding', desc: 'Outdated visuals failing to command premium pricing or brand authority.' },
        { title: 'Competitors getting more attention', desc: 'Rivals seizing market share through aggressive creative execution.' },
      ],
    },
    realityStatement: {
      type: String,
      default: 'IF YOUR BUSINESS IS NOT VISIBLE, SOMEONE ELSE WILL BE.',
    },
    whyScaleUpHeading: {
      type: String,
      default: 'NOT JUST MARKETING. WE BUILD DIGITAL GROWTH.',
    },
    whyScaleUpSubtitle: {
      type: String,
      default: 'A systematic 5-pillar approach to capturing attention and translating it into scalable revenue.',
    },
    whyScaleUpItems: {
      type: [
        {
          number: String,
          title: String,
          desc: String,
        },
      ],
      default: [
        { number: '01', title: 'Strategy', desc: 'Know what to do.' },
        { number: '02', title: 'Content', desc: 'Get attention.' },
        { number: '03', title: 'Creative', desc: 'Build a memorable brand.' },
        { number: '04', title: 'Advertising', desc: 'Reach the right people.' },
        { number: '05', title: 'Execution', desc: 'Turn ideas into action.' },
      ],
    },
    promiseLabel: {
      type: String,
      default: 'THE SCALEUP PROMISE',
    },
    promiseHeading: {
      type: String,
      default: 'YOUR GROWTH IS THE GOAL.',
    },
    promiseText1: {
      type: String,
      default: "We don't believe in random posting.",
    },
    promiseText2: {
      type: String,
      default: "We don't believe in vanity metrics.",
    },
    promiseStatement: {
      type: String,
      default: 'We believe in strategy, creativity and consistent execution.',
    },
    promiseWords: {
      type: [String],
      default: ['ATTENTION.', 'TRUST.', 'GROWTH.'],
    },
    ctaHeading: {
      type: String,
      default: 'READY TO SCALE YOUR BRAND?',
    },
    ctaDescription: {
      type: String,
      default: "Let's turn your digital presence into something people remember.",
    },
    ctaButtonText: {
      type: String,
      default: 'START YOUR GROWTH JOURNEY →',
    },
    footerTagline: {
      type: String,
      default: 'GROWTH. STRATEGY. IMPACT.',
    },
  },
  {
    timestamps: true,
  }
);

export const WebsiteContent = mongoose.models.WebsiteContent || mongoose.model<IWebsiteContent>('WebsiteContent', WebsiteContentSchema);
