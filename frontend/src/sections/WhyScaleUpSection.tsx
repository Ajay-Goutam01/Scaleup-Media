import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Compass, Sparkles, Palette, Target, Zap, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { WhyScaleUpItem } from '../types';

gsap.registerPlugin(ScrollTrigger);

const blockIcons = [Compass, Sparkles, Palette, Target, Zap];

export const WhyScaleUpSection: React.FC = () => {
  const { content } = useSettings();
  const sectionRef = useRef<HTMLElement>(null);
  const blocksRef = useRef<HTMLDivElement>(null);

  const heading = content?.whyScaleUpHeading || 'NOT JUST MARKETING. WE BUILD DIGITAL GROWTH.';
  const subtitle =
    content?.whyScaleUpSubtitle ||
    'A disciplined 5-pillar growth system designed to capture market attention and turn it into scalable revenue.';
  const items = content?.whyScaleUpItems || [
    { number: '01', title: 'Strategy', desc: 'Know what to do.' },
    { number: '02', title: 'Content', desc: 'Get attention.' },
    { number: '03', title: 'Creative', desc: 'Build a memorable brand.' },
    { number: '04', title: 'Advertising', desc: 'Reach the right people.' },
    { number: '05', title: 'Execution', desc: 'Turn ideas into action.' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (blocksRef.current) {
        gsap.fromTo(
          blocksRef.current.children,
          { opacity: 0, y: 35, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: blocksRef.current,
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
      id="why-scaleup"
      ref={sectionRef}
      className="py-20 sm:py-24 lg:py-32 bg-[var(--theme-surface)] border-b border-[var(--theme-border)] relative overflow-hidden max-w-full"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl space-y-3 sm:space-y-4 mb-12 sm:mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--theme-primary)]/10 border border-[var(--theme-primary)]/20 text-[var(--theme-accent)] text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>The ScaleUp Growth Engine</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--theme-text)] font-display tracking-tight leading-[1.12]">
            {heading}
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-[var(--theme-text-secondary)] leading-relaxed font-normal">
            {subtitle}
          </p>
        </div>

        {/* 5 Animated Strategy Blocks */}
        <div
          ref={blocksRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6"
        >
          {items.map((item: WhyScaleUpItem, index: number) => {
            const Icon = blockIcons[index % blockIcons.length];
            return (
              <div
                key={index}
                className="group relative p-6 sm:p-7 rounded-3xl bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)] hover:border-[var(--theme-accent)] hover:shadow-card transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <span className="text-2xl sm:text-3xl font-black text-[var(--theme-text-secondary)]/40 font-display group-hover:text-[var(--theme-accent)] transition-colors">
                      {item.number}
                    </span>
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[var(--theme-surface)] border border-[var(--theme-border)] flex items-center justify-center text-[var(--theme-accent)] group-hover:bg-[var(--theme-primary)] group-hover:text-white transition-all shadow-subtle">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-[var(--theme-text)] font-display mb-2 group-hover:text-[var(--theme-accent)] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm font-medium text-[var(--theme-text-secondary)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 sm:mt-8 pt-4 border-t border-[var(--theme-border)] flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[var(--theme-accent)] uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent)]" />
                  <span>Pillar {item.number}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
