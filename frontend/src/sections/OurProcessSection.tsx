import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Lightbulb, Compass, Palette, Rocket, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const processSteps = [
  {
    step: '01',
    title: 'Understand',
    desc: 'We understand your business, audience and goals through a deep discovery audit.',
    icon: Lightbulb,
    tags: ['Audience Analysis', 'Competitor Gap', 'Brand Positioning'],
  },
  {
    step: '02',
    title: 'Strategize',
    desc: 'We create a customized, high-converting roadmap and creative angle strategy.',
    icon: Compass,
    tags: ['Hook Ideation', 'Channel Selection', 'Budget Allocation'],
  },
  {
    step: '03',
    title: 'Create',
    desc: 'We build content, creatives and campaigns engineered to command attention.',
    icon: Palette,
    tags: ['Cinematic Video', 'UGC & AI Ads', 'High-Converting Copy'],
  },
  {
    step: '04',
    title: 'Execute',
    desc: 'We bring the strategy to life across high-impact digital channels and optimize daily.',
    icon: Rocket,
    tags: ['Meta Ads Launch', 'ROAS Optimization', 'Real-time Analytics'],
  },
];

export const OurProcessSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const stepsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate vertical filling line
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { height: '0%' },
          {
            height: '100%',
            ease: 'none',
            scrollTrigger: {
              trigger: stepsContainerRef.current,
              start: 'top 70%',
              end: 'bottom 70%',
              scrub: 0.5,
            },
          }
        );
      }

      // Step cards progressive activation
      const stepElements = gsap.utils.toArray<HTMLElement>('.process-step-item');
      stepElements.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0.3, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              end: 'top 45%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="py-20 sm:py-24 lg:py-32 bg-[var(--theme-bg)] relative overflow-hidden max-w-full"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--theme-primary)]/10 border border-[var(--theme-primary)]/20 text-[var(--theme-accent)] text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>How We Work</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--theme-text)] font-display tracking-tight">
            OUR PROCESS
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-[var(--theme-text-secondary)]">
            A predictable 4-phase execution framework designed to deliver continuous growth.
          </p>
        </div>

        {/* Vertical Timeline container */}
        <div ref={stepsContainerRef} className="relative max-w-4xl mx-auto">
          {/* Background Track Line */}
          <div className="absolute left-5 sm:left-6 md:left-1/2 top-4 bottom-4 w-1 bg-[var(--theme-border)] -translate-x-1/2 rounded-full" />

          {/* Animated Glow Line Fill */}
          <div
            ref={lineRef}
            className="absolute left-5 sm:left-6 md:left-1/2 top-4 w-1 bg-gradient-to-b from-[var(--theme-primary)] via-[var(--theme-accent)] to-[var(--theme-primary)] -translate-x-1/2 rounded-full shadow-glow"
            style={{ height: '0%' }}
          />

          {/* Steps */}
          <div className="space-y-10 sm:space-y-12 md:space-y-20">
            {processSteps.map((step, idx) => {
              const isEven = idx % 2 === 1;
              const Icon = step.icon;

              return (
                <div
                  key={step.step}
                  className={`process-step-item relative flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8 ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Step Card Content */}
                  <div
                    className={`w-full md:w-[45%] pl-12 sm:pl-14 md:pl-0 ${
                      isEven ? 'md:text-left' : 'md:text-right'
                    }`}
                  >
                    <div className="p-6 sm:p-8 rounded-3xl bg-[var(--theme-card)] border border-[var(--theme-card-border)] shadow-card hover:shadow-card-hover transition-all duration-300 space-y-3 sm:space-y-4">
                      <div
                        className={`flex items-center gap-3 ${
                          isEven ? 'md:justify-start' : 'md:justify-end'
                        }`}
                      >
                        <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-[var(--theme-accent)] px-2.5 py-1 rounded-full bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)]">
                          Phase {step.step}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-[var(--theme-text)] font-display">
                        {step.title}
                      </h3>

                      <p className="text-sm text-[var(--theme-text-secondary)] leading-relaxed font-normal">
                        {step.desc}
                      </p>

                      <div
                        className={`flex flex-wrap gap-1.5 sm:gap-2 pt-1 sm:pt-2 ${
                          isEven ? 'md:justify-start' : 'md:justify-end'
                        }`}
                      >
                        {step.tags.map((t, i) => (
                          <span
                            key={i}
                            className="text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[var(--theme-surface-secondary)] text-[var(--theme-text-secondary)] border border-[var(--theme-border)]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Central Node Badge */}
                  <div className="absolute left-5 sm:left-6 md:left-1/2 -translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[var(--theme-surface-secondary)] text-[var(--theme-accent)] border-2 border-[var(--theme-border)] shadow-xl flex items-center justify-center font-black font-display text-xs sm:text-sm z-10">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>

                  {/* Empty placeholder for desktop balance */}
                  <div className="hidden md:block w-[45%]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
