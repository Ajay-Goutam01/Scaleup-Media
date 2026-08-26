import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AlertCircle, EyeOff, Shuffle, ShieldAlert, Sparkles, TrendingDown } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { RealityPoint } from '../types';

gsap.registerPlugin(ScrollTrigger);

export const RealitySection: React.FC = () => {
  const { content } = useSettings();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);

  const heading = content?.realityHeading || 'YOUR CUSTOMERS ARE ALREADY ONLINE.';
  const description =
    content?.realityDescription ||
    'They are discovering businesses on Instagram, comparing brands, searching online and deciding who to trust.';
  const statement =
    content?.realityStatement || 'IF YOUR BUSINESS IS NOT VISIBLE, SOMEONE ELSE WILL BE.';
  const points = content?.realityPoints || [
    { title: 'Low online visibility', desc: 'Lost in the digital noise without a strategic positioning footprint.' },
    { title: 'Inconsistent content', desc: 'Irregular posting schedule eroding brand credibility and algorithm favor.' },
    { title: 'Weak digital presence', desc: 'Unoptimized touchpoints failing to build trust with modern buyers.' },
    { title: 'Poor branding', desc: 'Outdated visuals failing to command premium pricing or brand authority.' },
    { title: 'Competitors getting more attention', desc: 'Rivals seizing market share through aggressive creative execution.' },
  ];

  const icons = [EyeOff, Shuffle, ShieldAlert, Sparkles, TrendingDown];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate problem cards in on scroll
      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      // Animate bottom bold statement
      if (statementRef.current) {
        gsap.fromTo(
          statementRef.current,
          { opacity: 0, scale: 0.98, y: 25 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: statementRef.current,
              start: 'top 85%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="reality"
      ref={sectionRef}
      className="py-20 sm:py-24 lg:py-32 bg-[var(--theme-surface)] relative border-y border-[var(--theme-border)] overflow-hidden max-w-full"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 sm:space-y-4 mb-12 sm:mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Market Reality Check</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--theme-text)] font-display tracking-tight leading-[1.15]">
            {heading}
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-[var(--theme-text-secondary)] leading-relaxed font-normal">
            {description}
          </p>
        </div>

        {/* 5 Problem Diagnostics Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-16 sm:mb-20"
        >
          {points.map((point: RealityPoint, index: number) => {
            const Icon = icons[index % icons.length];
            return (
              <div
                key={index}
                className="group relative p-6 sm:p-7 rounded-3xl bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)] hover:border-rose-400/40 hover:shadow-card transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[var(--theme-surface)] border border-[var(--theme-border)] flex items-center justify-center text-rose-400 group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-subtle">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-rose-400 uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">
                      Problem 0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[var(--theme-text)] font-display mb-2 group-hover:text-rose-400 transition-colors">
                    {point.title}
                  </h3>

                  <p className="text-sm text-[var(--theme-text-secondary)] leading-relaxed font-normal">
                    {point.desc}
                  </p>
                </div>

                <div className="mt-5 sm:mt-6 pt-4 border-t border-[var(--theme-border)] flex items-center gap-2 text-xs font-semibold text-rose-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>Direct Revenue Leak</span>
                </div>
              </div>
            );
          })}

          {/* 6th Card: The ScaleUp Shift */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[var(--theme-primary)] to-[var(--theme-accent)] text-white flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white mb-4 sm:mb-5">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white/90 uppercase tracking-wider block mb-2">
                The ScaleUp Solution
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-display text-white mb-2">
                Predictable Attention &amp; Growth
              </h3>
              <p className="text-sm text-white/90 leading-relaxed font-normal">
                We replace random guessing with systematic creative sprints, data-backed ad targeting, and authority branding.
              </p>
            </div>
            <div className="mt-5 sm:mt-6 pt-4 border-t border-white/20 text-xs font-bold text-white uppercase tracking-wider">
              100% Growth Oriented
            </div>
          </div>
        </div>

        {/* Bottom Dramatic Scroll Statement */}
        <div
          ref={statementRef}
          className="p-6 sm:p-12 lg:p-16 rounded-3xl bg-[var(--theme-surface-secondary)] text-[var(--theme-text)] text-center relative overflow-hidden shadow-2xl border border-[var(--theme-border)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(var(--theme-accent)_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
          <div className="relative z-10 max-w-4xl mx-auto space-y-3 sm:space-y-4">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[var(--theme-accent)] font-display block">
              The Fundamental Law of Digital Attention
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black font-display tracking-tight text-[var(--theme-text)] leading-tight">
              {statement}
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-[var(--theme-text-secondary)] pt-2 max-w-2xl mx-auto font-normal leading-relaxed">
              Every day your brand remains stagnant, proactive competitors are capturing your prospective clients. Let’s change that now.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
