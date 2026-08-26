import React from 'react';
import { ArrowUpRight, MessageCircle, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const FinalCTASection: React.FC = () => {
  const { content, getWhatsAppUrl } = useSettings();

  const heading = content?.ctaHeading || 'READY TO SCALE YOUR BRAND?';
  const description =
    content?.ctaDescription ||
    "Let's turn your digital presence into something people remember.";
  const buttonText = content?.ctaButtonText || 'START YOUR GROWTH JOURNEY →';

  return (
    <section className="py-20 sm:py-24 lg:py-32 bg-[var(--theme-bg)] relative overflow-hidden max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[32px] sm:rounded-[40px] bg-[var(--theme-surface-secondary)] text-[var(--theme-text)] p-8 sm:p-14 lg:p-20 shadow-2xl border border-[var(--theme-border)] overflow-hidden text-center">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-[var(--theme-accent)]/20 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-[var(--theme-primary)]/20 blur-[120px] pointer-events-none" />

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(var(--theme-accent)_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6 sm:space-y-8">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--theme-surface)]/90 backdrop-blur-md border border-[var(--theme-border)] text-[var(--theme-accent)] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Agency Engagement</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-display tracking-tight text-[var(--theme-text)] leading-tight">
              {heading}
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-[var(--theme-text-secondary)] max-w-2xl mx-auto font-normal leading-relaxed">
              {description}
            </p>

            {/* Action Buttons (44px+ touch targets) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a
                href={getWhatsAppUrl("Hi ScaleUp Media! I'm ready to scale my brand. Let's discuss strategy.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-full text-sm sm:text-base font-extrabold bg-[var(--theme-primary)] text-white hover:opacity-90 transition-all duration-300 shadow-glow hover:scale-105 active:scale-95 group touch-target"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>{buttonText}</span>
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            {/* Trust markers */}
            <div className="pt-6 sm:pt-8 border-t border-[var(--theme-border)] flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-semibold text-[var(--theme-text-secondary)]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--theme-accent)] shrink-0" />
                <span>Zero Long-Term Lock-in</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[var(--theme-accent)] shrink-0" />
                <span>Fast 48h Campaign Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--theme-accent)] shrink-0" />
                <span>Dedicated Creative Director</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
