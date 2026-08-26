export interface Project {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  client: string;
  category: string;
  shortDescription?: string;
  description: string;
  thumbnail: string;
  gallery: string[];
  videoUrl?: string;
  externalUrl?: string;
  results?: string;
  featured: boolean;
  active: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Service {
  _id: string;
  id?: string;
  serviceNumber: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  icon: string;
  active: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Testimonial {
  _id: string;
  id?: string;
  clientName: string;
  company: string;
  review: string;
  profileImage: string;
  rating: number;
  marqueeRow: number; // 1 = Right to Left, 2 = Left to Right
  active: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RealityPoint {
  title: string;
  desc: string;
}

export interface WhyScaleUpItem {
  number: string;
  title: string;
  desc: string;
}

export interface WebsiteContent {
  _id?: string;
  heroHeading: string;
  heroDescription: string;
  heroPrimaryBtn: string;
  heroSecondaryBtn: string;
  realityHeading: string;
  realityDescription: string;
  realityPoints: RealityPoint[];
  realityStatement: string;
  whyScaleUpHeading: string;
  whyScaleUpSubtitle: string;
  whyScaleUpItems: WhyScaleUpItem[];
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
}

export interface SectionSettings {
  _id?: string;
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
}

export interface ContactSettings {
  _id?: string;
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
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  featuredProjects: number;
  totalServices: number;
  activeServices: number;
  totalTestimonials: number;
  activeTestimonials: number;
  activeSectionsCount: number;
  pendingReviews: number;
}

export interface Review {
  _id: string;
  id?: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface Branding {
  _id?: string;
  brandName: string;
  tagline: string;
  logoUrl: string;
  logoFileId: string;
  faviconUrl: string;
  faviconFileId: string;
}

export interface ThemeSettings {
  _id?: string;
  preset: 'light' | 'scaleup-navy' | 'midnight' | 'navy';
  backgroundColor: string;
  surfaceColor: string;
  surfaceSecondaryColor: string;
  primaryColor: string;
  accentColor: string;
  accentSecondaryColor: string;
  textColor: string;
  secondaryTextColor: string;
  borderColor: string;
  customizationEnabled?: boolean;
}

