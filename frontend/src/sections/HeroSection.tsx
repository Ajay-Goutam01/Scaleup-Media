import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';
import { HeroGrowthVisual } from '../components/3d/HeroGrowthVisual';
import { useSettings } from '../context/SettingsContext';

export const HeroSection: React.FC = () => {
  const { content, getWhatsAppUrl } = useSettings();
  const heroRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);

  const heading = content?.heroHeading || 'WE BUILD BRANDS THAT GET NOTICED.';
  const description =
    content?.heroDescription ||
    'Strategy, creative content and performance marketing designed to help businesses grow.';
  const primaryBtn = content?.heroPrimaryBtn || 'Start a Project →';
  const secondaryBtn = content?.heroSecondaryBtn || 'View Our Work →';

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.1 }
      )
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.4'
        )
        .fromTo(
          descRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.5'
        )
        .fromTo(
          ctaGroupRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.4'
        )
        .fromTo(
          badgesRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.4'
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-[88vh] pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28 overflow-hidden flex items-center bg-[var(--theme-bg)] max-w-full"
    >
      {/* Ambient background decoration */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[400px] sm:h-[500px] bg-gradient-to-b from-[var(--theme-accent)]/15 via-[var(--theme-primary)]/10 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="absolute -top-24 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-[var(--theme-accent)]/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Kinetic Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-left">
            {/* Agency Pill Badge */}
            <div ref={labelRef} className="inline-flex items-center gap-2">
              <div className="px-3.5 sm:px-4 py-1.5 rounded-full bg-[var(--theme-surface)]/90 border border-[var(--theme-border)] backdrop-blur-md shadow-sm flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--theme-accent)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--theme-accent)]"></span>
                </span>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[var(--theme-text)]">
                  Growth • Strategy • Impact
                </span>
              </div>
            </div>

            {/* Main Headline */}
            <h1
              ref={headlineRef}
              className="hero-headline text-[var(--theme-text)] font-display"
            >
              {heading.includes('BRANDS') ? (
                <>
                  WE BUILD <span className="text-gradient">BRANDS</span> THAT GET{' '}
                  <span className="underline decoration-[var(--theme-accent)] decoration-4 underline-offset-8">
                    NOTICED.
                  </span>
                </>
              ) : (
                heading
              )}
            </h1>

            {/* Supporting Copy */}
            <p
              ref={descRef}
              className="text-base sm:text-lg md:text-xl text-[var(--theme-text-secondary)] max-w-xl leading-relaxed font-normal"
            >
              {description}
            </p>

            {/* Action Buttons (with 44px+ touch targets) */}
            <div
              ref={ctaGroupRef}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 pt-2"
            >
              <a
                href={getWhatsAppUrl("Hi ScaleUp Media! I'm interested in starting a project with your agency.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm sm:text-base font-bold bg-[var(--theme-primary)] text-white hover:opacity-90 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group touch-target"
              >
                <span>{primaryBtn}</span>
                <ArrowUpRight className="w-5 h-5 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <a
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm sm:text-base font-bold bg-[var(--theme-surface)] text-[var(--theme-text)] border border-[var(--theme-border)] hover:bg-[var(--theme-surface-secondary)] shadow-sm transition-all duration-300 touch-target"
              >
                <span>{secondaryBtn}</span>
              </a>
            </div>

            {/* Quick Proof Badges */}
            <div
              ref={badgesRef}
              className="pt-2 sm:pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-semibold text-[var(--theme-text-secondary)]"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--theme-accent)] shrink-0" />
                <span>Multi-Hook Viral Reels</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--theme-accent)] shrink-0" />
                <span>Meta Ads ROAS Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--theme-accent)] shrink-0" />
                <span>High-Conversion Web Platforms</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Pure CSS/SVG Kinetic Growth Matrix */}
          <div className="lg:col-span-5 flex items-center justify-center w-full overflow-hidden sm:overflow-visible">
            <HeroGrowthVisual />
          </div>
        </div>
      </div>
    </section>
  );
};
