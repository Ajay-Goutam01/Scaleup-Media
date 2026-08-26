import React from 'react';
import { Link } from 'react-router-dom';
import {
  Instagram,
  Mail,
  Phone,
  MessageCircle,
  Linkedin,
  Facebook,
  Youtube,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { getOptimizedImageUrl } from '../../utils/imageKit';

export const Footer: React.FC = () => {
  const { contact, content, branding, getWhatsAppUrl } = useSettings();

  const currentYear = new Date().getFullYear();

  const email = contact?.email || 'shivamconnect65@gmail.com';
  const phone = contact?.phone || '6268523635';
  const instagram = contact?.instagram || '@scaleup.media.io';
  const founderInstagram = contact?.founderInstagram || '@shivamxbizz';
  const tagline = content?.footerTagline || 'GROWTH. STRATEGY. IMPACT.';

  const cleanInsta = instagram.replace('@', '');
  const cleanFounder = founderInstagram.replace('@', '');

  return (
    <footer id="contact" className="bg-[var(--theme-footer)] text-[var(--theme-text)] pt-20 pb-12 border-t border-[var(--theme-border)] relative overflow-hidden">
      {/* Ambient lighting glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[var(--theme-primary)]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-[var(--theme-accent)]/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-16 border-b border-[var(--theme-border)]">
          {/* Col 1 & 2: Brand statement & Logo */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group h-12 sm:h-16 md:h-20">
              {branding?.logoUrl ? (
                <img
                  src={getOptimizedImageUrl(branding.logoUrl, { width: 600, quality: 95 })}
                  alt={branding.brandName || 'ScaleUp Media'}
                  className="h-full w-auto max-w-[240px] sm:max-w-[300px] md:max-w-[340px] object-contain object-left block transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <>
                  <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)] flex items-center justify-center text-[var(--theme-accent)] group-hover:scale-105 transition-transform shadow-md">
                    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 sm:w-9 sm:h-9">
                      <path d="M5 17L12 7L19 17H15L12 12.5L9 17H5Z" fill="var(--theme-accent)" />
                      <circle cx="12" cy="5" r="2" fill="var(--theme-primary)" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--theme-text)] font-display">
                      {branding?.brandName ? branding.brandName.replace(' Media', '') : 'ScaleUp'}<span className="text-[var(--theme-accent)]">.</span>
                    </span>
                    <span className="text-xs font-bold tracking-widest text-[var(--theme-text-secondary)] uppercase block">
                      {branding?.brandName && branding.brandName.includes(' ') ? branding.brandName.split(' ').slice(1).join(' ') : 'Media'}
                    </span>
                  </div>
                </>
              )}
            </Link>

            <p className="text-sm sm:text-base text-[var(--theme-text-secondary)] max-w-sm leading-relaxed">
              We engineer hyper-engaging creative assets, high-ROAS advertising funnels, and modern digital platforms that transform attention into measurable business growth.
            </p>

            <div className="inline-block px-4 py-2 rounded-xl bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)] backdrop-blur-md">
              <span className="text-xs font-bold tracking-widest text-[var(--theme-accent)] uppercase font-display">
                {tagline}
              </span>
            </div>
          </div>

          {/* Col 3: Navigation Links */}
          <div>
            <h4 className="text-sm font-bold tracking-wider text-[var(--theme-text)] uppercase mb-5 font-display">
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Services', href: '/#services' },
                { name: 'Selected Work', href: '/#work' },
                { name: 'Why ScaleUp', href: '/#why-scaleup' },
                { name: 'Our Process', href: '/#process' },
                { name: 'ScaleUp Promise', href: '/#promise' },
                { name: 'About Founder', href: '/#founder' },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-accent)] transition-colors flex items-center gap-1 group"
                  >
                    <span>{item.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[var(--theme-accent)]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Capabilities */}
          <div>
            <h4 className="text-sm font-bold tracking-wider text-[var(--theme-text)] uppercase mb-5 font-display">
              Capabilities
            </h4>
            <ul className="space-y-2.5 text-sm text-[var(--theme-text-secondary)]">
              <li className="hover:text-[var(--theme-text)] transition-colors">Short-Form Video Production</li>
              <li className="hover:text-[var(--theme-text)] transition-colors">Performance Meta &amp; Google Ads</li>
              <li className="hover:text-[var(--theme-text)] transition-colors">Brand Identity &amp; Creative Strategy</li>
              <li className="hover:text-[var(--theme-text)] transition-colors">High-Converting Digital Assets</li>
              <li className="hover:text-[var(--theme-text)] transition-colors">Social Growth &amp; Content Engine</li>
            </ul>
          </div>

          {/* Col 5: Official Contact Info */}
          <div>
            <h4 className="text-sm font-bold tracking-wider text-[var(--theme-text)] uppercase mb-5 font-display">
              Connect Directly
            </h4>
            <ul className="space-y-3.5">
              <li>
                <a
                  href={`mailto:${email}`}
                  className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] flex items-center gap-2.5 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)] flex items-center justify-center text-[var(--theme-accent)] group-hover:bg-[var(--theme-primary)] group-hover:text-white transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="truncate">{email}</span>
                </a>
              </li>

              <li>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] flex items-center gap-2.5 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)] flex items-center justify-center text-[var(--theme-accent)] group-hover:bg-[var(--theme-primary)] group-hover:text-white transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <span>+91 {phone}</span>
                </a>
              </li>

              <li>
                <a
                  href={`https://instagram.com/${cleanInsta}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] flex items-center gap-2.5 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)] flex items-center justify-center text-[var(--theme-accent)] group-hover:bg-[var(--theme-primary)] group-hover:text-white transition-colors">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <span>{instagram}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--theme-text-secondary)]">
          <p>© {currentYear} ScaleUp Media. All rights reserved. Precision Built for Modern Digital Growth.</p>
        </div>

        {/* Developer Credit — Absolute Bottom Element */}
        <div className="mt-8 pt-6 border-t border-[var(--theme-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--theme-text-secondary)]">
          <div className="flex items-center gap-2 text-center sm:text-left flex-wrap justify-center sm:justify-start">
            <span className="font-medium text-[var(--theme-text-secondary)]">Crafted & Developed by</span>
            <span className="font-bold text-[var(--theme-text)] tracking-wide">
              Ajay Goutam
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <a
              href="mailto:goutamajay308@gmail.com"
              className="inline-flex items-center gap-1.5 font-medium text-[var(--theme-text-secondary)] hover:text-[var(--theme-accent)] transition-colors group"
              aria-label="Email Developer Ajay Goutam"
            >
              <Mail className="w-3.5 h-3.5 text-[var(--theme-accent)] group-hover:scale-110 transition-transform" />
              <span>goutamajay308@gmail.com</span>
            </a>

            <a
              href="tel:+918827479058"
              className="inline-flex items-center gap-1.5 font-medium text-[var(--theme-text-secondary)] hover:text-[var(--theme-accent)] transition-colors group"
              aria-label="Call Developer Ajay Goutam"
            >
              <Phone className="w-3.5 h-3.5 text-[var(--theme-accent)] group-hover:scale-110 transition-transform" />
              <span>+91 8827479058</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
