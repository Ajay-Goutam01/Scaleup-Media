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
  Shield,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-[var(--theme-border)]">
          {/* Col 1 & 2: Brand statement */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              {branding?.logoUrl ? (
                <img
                  src={branding.logoUrl}
                  alt={branding.brandName || 'ScaleUp Media'}
                  className="h-11 w-auto object-contain transition-transform group-hover:scale-105"
                />
              ) : (
                <>
                  <div className="w-11 h-11 rounded-2xl bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)] flex items-center justify-center text-[var(--theme-accent)] group-hover:scale-105 transition-transform">
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                      <path d="M5 17L12 7L19 17H15L12 12.5L9 17H5Z" fill="var(--theme-accent)" />
                      <circle cx="12" cy="5" r="2" fill="var(--theme-primary)" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-2xl font-black tracking-tight text-[var(--theme-text)] font-display">
                      {branding?.brandName ? branding.brandName.replace(' Media', '') : 'ScaleUp'}<span className="text-[var(--theme-accent)]">.</span>
                    </span>
                    <span className="text-xs font-bold tracking-widest text-[var(--theme-text-secondary)] uppercase block">
                      {branding?.brandName && branding.brandName.includes(' ') ? branding.brandName.split(' ').slice(1).join(' ') : 'Media'}
                    </span>
                  </div>
                </>
              )}
            </Link>

            <p className="text-base text-[var(--theme-text-secondary)] max-w-sm leading-relaxed">
              We engineer hyper-engaging creative assets, high-ROAS advertising funnels, and modern digital platforms that transform attention into measurable business growth.
            </p>

            <div className="inline-block px-4 py-2 rounded-xl bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)] backdrop-blur-md">
              <span className="text-xs font-bold tracking-widest text-[var(--theme-accent)] uppercase font-display">
                {tagline}
              </span>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="text-sm font-bold tracking-wider text-[var(--theme-text)] uppercase mb-5 font-display">
              Explore
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Services', href: '/#services' },
                { name: 'Selected Work', href: '/#work' },
                { name: 'Why ScaleUp', href: '/#why-scaleup' },
                { name: 'Our Process', href: '/#process' },
                { name: 'ScaleUp Promise', href: '/#promise' },
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

          {/* Col 4: Official Contact Settings */}
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

          {/* Col 5: Founder & Social Channels */}
          <div>
            <h4 className="text-sm font-bold tracking-wider text-[var(--theme-text)] uppercase mb-5 font-display">
              Leadership
            </h4>
            <div className="p-4 rounded-2xl bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)] space-y-3">
              <div>
                <p className="text-[11px] uppercase font-bold text-[var(--theme-text-secondary)] tracking-wider">
                  Founder
                </p>
                <a
                  href={`https://instagram.com/${cleanFounder}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-[var(--theme-accent)] hover:underline inline-flex items-center gap-1 mt-0.5"
                >
                  <span>{founderInstagram}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Social Channels */}
              <div className="flex items-center gap-2 pt-2 border-t border-[var(--theme-border)]">
                {contact?.linkedin && (
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-[var(--theme-surface)] text-[var(--theme-text-secondary)] hover:text-[var(--theme-accent)] hover:bg-[var(--theme-surface-secondary)] transition-colors border border-[var(--theme-border)]"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {contact?.facebook && (
                  <a
                    href={contact.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-[var(--theme-surface)] text-[var(--theme-text-secondary)] hover:text-[var(--theme-accent)] hover:bg-[var(--theme-surface-secondary)] transition-colors border border-[var(--theme-border)]"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {contact?.youtube && (
                  <a
                    href={contact.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-[var(--theme-surface)] text-[var(--theme-text-secondary)] hover:text-[var(--theme-accent)] hover:bg-[var(--theme-surface-secondary)] transition-colors border border-[var(--theme-border)]"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--theme-text-secondary)]">
          <p>© {currentYear} ScaleUp Media. All rights reserved. Precision Built for Modern Digital Growth.</p>
          <div className="flex items-center gap-6">
            <Link to="/admin/login" className="hover:text-[var(--theme-accent)] flex items-center gap-1 transition-colors">
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Access</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
