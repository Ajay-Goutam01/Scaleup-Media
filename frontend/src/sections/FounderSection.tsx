import React from 'react';
import { Instagram, Linkedin, Facebook, Youtube, Sparkles, ExternalLink } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { getOptimizedImageUrl } from '../utils/imageKit';

export const FounderSection: React.FC = () => {
  const { contact } = useSettings();

  const founderName = contact?.founderName || 'Shivam';
  const founderBio =
    contact?.founderBio ||
    'Building brands through smart business strategy, creative marketing and high-impact content. From shooting and editing to paid advertising, we turn ideas into digital growth.';
  const founderPhoto = contact?.founderPhotoUrl;
  const founderInstagram = contact?.founderInstagram || '@shivamxbizz';
  const cleanFounderInsta = founderInstagram.replace('@', '');

  const founderLinkedin = contact?.founderLinkedin || contact?.linkedin;
  const founderFacebook = contact?.founderFacebook || contact?.facebook;
  const founderYoutube = contact?.founderYoutube || contact?.youtube;

  const founderInitial = founderName.charAt(0).toUpperCase();

  return (
    <section
      id="founder"
      className="py-16 sm:py-20 lg:py-24 bg-[var(--theme-surface)] relative border-t border-[var(--theme-border)] overflow-hidden max-w-full"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[300px] sm:h-[400px] bg-gradient-to-tr from-[var(--theme-accent)]/10 via-[var(--theme-primary)]/5 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Section Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)] text-[var(--theme-accent)] text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Founder &amp; Leadership</span>
        </div>

        {/* Founder Card */}
        <div className="flex flex-col items-center space-y-5 sm:space-y-6">
          {/* Founder Photo Container */}
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[var(--theme-accent)] to-[var(--theme-primary)] rounded-[28px] blur-sm opacity-30 group-hover:opacity-60 transition duration-500" />

            {founderPhoto ? (
              <img
                src={getOptimizedImageUrl(founderPhoto, { width: 350, height: 350, quality: 95 })}
                alt={`${founderName} - Founder`}
                className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-3xl object-cover border-2 border-[var(--theme-border)] shadow-xl bg-[var(--theme-surface-secondary)]"
                loading="lazy"
              />
            ) : (
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-3xl bg-[var(--theme-surface-secondary)] border-2 border-[var(--theme-border)] flex items-center justify-center text-[var(--theme-accent)] font-extrabold text-3xl sm:text-4xl shadow-xl font-display">
                {founderInitial}
              </div>
            )}
          </div>

          {/* Identity: Label & Name */}
          <div className="space-y-1">
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-[var(--theme-accent)] block">
              FOUNDER
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--theme-text)] font-display tracking-tight">
              {founderName}
            </h3>
          </div>

          {/* Bio (2-3 lines, fully visible, non-clipped on mobile) */}
          <p className="text-sm sm:text-base md:text-lg text-[var(--theme-text-secondary)] max-w-2xl mx-auto leading-relaxed font-normal px-2">
            “{founderBio}”
          </p>

          {/* Founder Social Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {founderInstagram && (
              <a
                href={`https://instagram.com/${cleanFounderInsta}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--theme-surface-secondary)] hover:bg-[var(--theme-border)] border border-[var(--theme-border)] text-xs sm:text-sm font-bold text-[var(--theme-text)] hover:text-[var(--theme-accent)] transition-all shadow-sm touch-target"
                aria-label={`Founder Instagram ${founderInstagram}`}
              >
                <Instagram className="w-4 h-4 text-pink-500 shrink-0" />
                <span>{founderInstagram.startsWith('@') ? founderInstagram : `@${founderInstagram}`}</span>
                <ExternalLink className="w-3 h-3 text-[var(--theme-text-secondary)]" />
              </a>
            )}

            {founderLinkedin && (
              <a
                href={founderLinkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--theme-surface-secondary)] hover:bg-[var(--theme-border)] border border-[var(--theme-border)] text-xs sm:text-sm font-bold text-[var(--theme-text)] hover:text-[var(--theme-accent)] transition-all shadow-sm touch-target"
                aria-label="Founder LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4 text-blue-500 shrink-0" />
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 text-[var(--theme-text-secondary)]" />
              </a>
            )}

            {founderFacebook && (
              <a
                href={founderFacebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--theme-surface-secondary)] hover:bg-[var(--theme-border)] border border-[var(--theme-border)] text-xs sm:text-sm font-bold text-[var(--theme-text)] hover:text-[var(--theme-accent)] transition-all shadow-sm touch-target"
                aria-label="Founder Facebook Profile"
              >
                <Facebook className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Facebook</span>
                <ExternalLink className="w-3 h-3 text-[var(--theme-text-secondary)]" />
              </a>
            )}

            {founderYoutube && (
              <a
                href={founderYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--theme-surface-secondary)] hover:bg-[var(--theme-border)] border border-[var(--theme-border)] text-xs sm:text-sm font-bold text-[var(--theme-text)] hover:text-[var(--theme-accent)] transition-all shadow-sm touch-target"
                aria-label="Founder YouTube Channel"
              >
                <Youtube className="w-4 h-4 text-red-500 shrink-0" />
                <span>YouTube</span>
                <ExternalLink className="w-3 h-3 text-[var(--theme-text-secondary)]" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
