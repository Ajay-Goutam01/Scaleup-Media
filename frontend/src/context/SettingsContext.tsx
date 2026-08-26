import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { sectionsApi } from '../api/sections';
import { contentApi } from '../api/content';
import { contactApi } from '../api/contact';
import { brandingApi } from '../api/branding';
import { themeApi } from '../api/theme';
import { SectionSettings, WebsiteContent, ContactSettings, Branding, ThemeSettings } from '../types';

interface SettingsContextType {
  sections: SectionSettings | null;
  content: WebsiteContent | null;
  contact: ContactSettings | null;
  branding: Branding | null;
  theme: ThemeSettings | null;
  isLoading: boolean;
  getWhatsAppUrl: (customMessage?: string) => string;
  refreshSettings: () => Promise<void>;
  refreshBranding: () => Promise<void>;
  refreshTheme: () => Promise<void>;
}

const defaultSections: SectionSettings = {
  hero: true,
  reality: true,
  services: true,
  whyScaleUp: true,
  projects: true,
  testimonials: true,
  process: true,
  promise: true,
  cta: true,
  footer: true,
  floatingWhatsApp: true,
};

const defaultContact: ContactSettings = {
  phone: '6268523635',
  whatsAppNumber: '6268523635',
  defaultWhatsAppMessage:
    "Hi ScaleUp Media, I'm interested in scaling my brand with your growth & creative services. Let's talk!",
  email: 'shivamconnect65@gmail.com',
  instagram: '@scaleup.media.io',
  founderInstagram: '@shivamxbizz',
  facebook: 'https://facebook.com/scaleupmedia',
  linkedin: 'https://linkedin.com/company/scaleupmedia',
  youtube: 'https://youtube.com/@scaleupmedia',
  address: 'India / Global Digital Agency',
};

const defaultContent: WebsiteContent = {
  heroHeading: 'WE BUILD BRANDS THAT GET NOTICED.',
  heroDescription:
    'Strategy, creative content and performance marketing designed to help businesses grow.',
  heroPrimaryBtn: 'Start a Project →',
  heroSecondaryBtn: 'View Our Work →',
  realityHeading: 'YOUR CUSTOMERS ARE ALREADY ONLINE.',
  realityDescription:
    'They are discovering businesses on Instagram, comparing brands, searching online and deciding who to trust.',
  realityPoints: [
    { title: 'Low online visibility', desc: 'Lost in the digital noise without a strategic positioning footprint.' },
    { title: 'Inconsistent content', desc: 'Irregular posting schedule eroding brand credibility and algorithm favor.' },
    { title: 'Weak digital presence', desc: 'Unoptimized touchpoints failing to build trust with modern buyers.' },
    { title: 'Poor branding', desc: 'Outdated visuals failing to command premium pricing or brand authority.' },
    { title: 'Competitors getting more attention', desc: 'Rivals seizing market share through aggressive creative execution.' },
  ],
  realityStatement: 'IF YOUR BUSINESS IS NOT VISIBLE, SOMEONE ELSE WILL BE.',
  whyScaleUpHeading: 'NOT JUST MARKETING. WE BUILD DIGITAL GROWTH.',
  whyScaleUpSubtitle:
    'A disciplined, data-informed creative system designed to turn passive scrollers into long-term brand advocates.',
  whyScaleUpItems: [
    { number: '01', title: 'Strategy', desc: 'Know what to do.' },
    { number: '02', title: 'Content', desc: 'Get attention.' },
    { number: '03', title: 'Creative', desc: 'Build a memorable brand.' },
    { number: '04', title: 'Advertising', desc: 'Reach the right people.' },
    { number: '05', title: 'Execution', desc: 'Turn ideas into action.' },
  ],
  promiseLabel: 'THE SCALEUP PROMISE',
  promiseHeading: 'YOUR GROWTH IS THE GOAL.',
  promiseText1: "We don't believe in random posting.",
  promiseText2: "We don't believe in vanity metrics.",
  promiseStatement: 'We believe in strategy, creativity and consistent execution.',
  promiseWords: ['ATTENTION.', 'TRUST.', 'GROWTH.'],
  ctaHeading: 'READY TO SCALE YOUR BRAND?',
  ctaDescription: "Let's turn your digital presence into something people remember.",
  ctaButtonText: 'START YOUR GROWTH JOURNEY →',
  footerTagline: 'GROWTH. STRATEGY. IMPACT.',
};

const defaultBranding: Branding = {
  brandName: 'ScaleUp Media',
  tagline: 'GROWTH. STRATEGY. IMPACT.',
  logoUrl: '',
  logoFileId: '',
  faviconUrl: '',
  faviconFileId: '',
};

const defaultTheme: ThemeSettings = {
  preset: 'navy',
  backgroundColor: '#07111F',
  surfaceColor: '#0D1B2A',
  surfaceSecondaryColor: '#10253A',
  primaryColor: '#FFFFFF',
  accentColor: '#2563EB',
  accentSecondaryColor: '#08BDF5',
  textColor: '#FFFFFF',
  secondaryTextColor: '#AAB8C8',
  borderColor: 'rgba(255,255,255,0.10)',
};

/**
 * Apply favicon dynamically
 */
const applyFavicon = (faviconUrl: string) => {
  if (!faviconUrl) return;
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = faviconUrl;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sections, setSections] = useState<SectionSettings | null>(defaultSections);
  const [content, setContent] = useState<WebsiteContent | null>(defaultContent);
  const [contact, setContact] = useState<ContactSettings | null>(defaultContact);
  const [branding, setBranding] = useState<Branding | null>(defaultBranding);
  const [theme, setTheme] = useState<ThemeSettings | null>(defaultTheme);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Apply branding defaults immediately on mount (prevents favicon flash)
  useEffect(() => {
    // Favicon will be applied when branding loads from API
  }, []);

  const fetchAllSettings = useCallback(async () => {
    try {
      const [secRes, conRes, cntRes, brandRes, themeRes] = await Promise.allSettled([
        sectionsApi.get(),
        contentApi.get(),
        contactApi.get(),
        brandingApi.get(),
        themeApi.get(),
      ]);

      if (secRes.status === 'fulfilled' && secRes.value.success && secRes.value.data) {
        setSections(secRes.value.data);
      }
      if (conRes.status === 'fulfilled' && conRes.value.success && conRes.value.data) {
        setContent(conRes.value.data);
      }
      if (cntRes.status === 'fulfilled' && cntRes.value.success && cntRes.value.data) {
        setContact(cntRes.value.data);
      }
      if (brandRes.status === 'fulfilled' && brandRes.value.success && brandRes.value.data) {
        const b = brandRes.value.data;
        setBranding(b);
        if (b.faviconUrl) applyFavicon(b.faviconUrl);
      }
      if (themeRes.status === 'fulfilled' && themeRes.value.success && themeRes.value.data) {
        const t = themeRes.value.data;
        setTheme(t);
        // NOTE: Theme CSS variables are managed exclusively by ThemeContext/themeService.
        // Do NOT call applyTheme here.
      }
    } catch (err) {
      console.warn('Could not fetch remote settings, using fallback defaults:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllSettings();
  }, [fetchAllSettings]);

  const refreshBranding = useCallback(async () => {
    try {
      const res = await brandingApi.get();
      if (res.success && res.data) {
        setBranding(res.data);
        if (res.data.faviconUrl) applyFavicon(res.data.faviconUrl);
      }
    } catch (err) {
      console.warn('Could not refresh branding:', err);
    }
  }, []);

  const refreshTheme = useCallback(async () => {
    try {
      const res = await themeApi.get();
      if (res.success && res.data) {
        setTheme(res.data);
        // NOTE: Theme CSS variables are managed exclusively by ThemeContext/themeService.
      }
    } catch (err) {
      console.warn('Could not refresh theme:', err);
    }
  }, []);

  const getWhatsAppUrl = useCallback(
    (customMessage?: string) => {
      const rawNumber = contact?.whatsAppNumber || '6268523635';
      const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
      const message = customMessage || contact?.defaultWhatsAppMessage || "Hi ScaleUp Media, let's talk!";
      return `https://wa.me/${cleanNumber.startsWith('91') ? cleanNumber : `91${cleanNumber}`}?text=${encodeURIComponent(message)}`;
    },
    [contact]
  );

  return (
    <SettingsContext.Provider
      value={{
        sections,
        content,
        contact,
        branding,
        theme,
        isLoading,
        getWhatsAppUrl,
        refreshSettings: fetchAllSettings,
        refreshBranding,
        refreshTheme,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
