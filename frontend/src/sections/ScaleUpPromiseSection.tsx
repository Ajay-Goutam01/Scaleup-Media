import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

gsap.registerPlugin(ScrollTrigger);

export const ScaleUpPromiseSection: React.FC = () => {
  const { content } = useSettings();
  const sectionRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);

  const label = content?.promiseLabel || 'THE SCALEUP PROMISE';
  const heading = content?.promiseHeading || 'YOUR GROWTH IS THE GOAL.';
  const text1 = content?.promiseText1 || "We don't believe in random posting.";
  const text2 = content?.promiseText2 || "We don't believe in vanity metrics.";
  const statement =
    content?.promiseStatement || 'We believe in strategy, creativity and consistent execution.';
  const words = content?.promiseWords || ['ATTENTION.', 'TRUST.', 'GROWTH.'];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (wordsRef.current) {
        gsap.fromTo(
          wordsRef.current.children,
          { opacity: 0, scale: 0.9, y: 25 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: wordsRef.current,
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
      id="promise"
      ref={sectionRef}
      className="py-20 sm:py-24 lg:py-32 bg-[var(--theme-surface)] border-b border-[var(--theme-border)] relative overflow-hidden max-w-full"
    >
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[600px] h-[300px] bg-[var(--theme-accent)]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-10 sm:space-y-12">
        {/* Label & Heading */}
        <div className="space-y-3 sm:space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--theme-primary)]/10 border border-[var(--theme-primary)]/20 text-[var(--theme-accent)] text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>{label}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--theme-text)] font-display tracking-tight">
            {heading}
          </h2>
        </div>

        {/* Belief Statements */}
        <div className="space-y-3 sm:space-y-4 max-w-2xl mx-auto">
          <p className="text-base sm:text-lg md:text-xl text-[var(--theme-text-secondary)] line-through decoration-rose-400 decoration-2">
            {text1}
          </p>
          <p className="text-base sm:text-lg md:text-xl text-[var(--theme-text-secondary)] line-through decoration-rose-400 decoration-2">
            {text2}
          </p>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--theme-text)] pt-2">
            {statement}
          </p>
        </div>

        {/* Three Bold Kinetic Words */}
        <div
          ref={wordsRef}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8 max-w-4xl mx-auto"
        >
          {words.map((word: string, idx: number) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-3xl bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)] hover:border-[var(--theme-accent)] hover:shadow-card transition-all duration-300 group"
            >
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black font-display text-[var(--theme-text)] group-hover:text-[var(--theme-accent)] transition-colors block leading-tight">
                {word}
              </span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[var(--theme-text-secondary)] mt-2 block">
                Pillar {idx + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
