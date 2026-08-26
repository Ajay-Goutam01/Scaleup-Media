import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrendingUp, Sparkles, Zap, Target, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const HeroGrowthVisual: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardMatrixRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);
  const centralPrismRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const cardMatrix = cardMatrixRef.current;
    if (!container || !cardMatrix) return;

    const isTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.innerWidth < 768;

    // Mouse Parallax 3D tilt on desktop
    const handleMouseMove = (e: MouseEvent) => {
      if (isTouch) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(cardMatrix, {
        rotateY: x * 18,
        rotateX: -y * 18,
        duration: 0.8,
        ease: 'power2.out',
      });

      if (card1Ref.current) {
        gsap.to(card1Ref.current, {
          x: x * 25,
          y: y * 25,
          duration: 1.1,
          ease: 'power2.out',
        });
      }
      if (card2Ref.current) {
        gsap.to(card2Ref.current, {
          x: -x * 25,
          y: -y * 25,
          duration: 1.3,
          ease: 'power2.out',
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(cardMatrix, {
        rotateY: 6,
        rotateX: 8,
        duration: 1.2,
        ease: 'power3.out',
      });
      [card1Ref.current, card2Ref.current, card3Ref.current, card4Ref.current].forEach((card) => {
        if (card) {
          gsap.to(card, { x: 0, y: 0, duration: 1.2, ease: 'power3.out' });
        }
      });
    };

    if (!isTouch) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    // Initial Entrance Animation
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardMatrix,
        { opacity: 0, scale: 0.9, rotateX: 16, rotateY: -10 },
        { opacity: 1, scale: 1, rotateX: 8, rotateY: 6, duration: 1.4, ease: 'power3.out', delay: 0.1 }
      );

      // ScrollTrigger reaction (subtle)
      gsap.to(cardMatrix, {
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
        rotateX: -10,
        rotateY: 15,
        scale: 0.88,
        y: 60,
        opacity: 0.5,
      });
    }, container);

    return () => {
      if (!isTouch) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-full h-[400px] sm:h-[480px] lg:h-[540px] flex items-center justify-center perspective-1000 select-none overflow-hidden sm:overflow-visible"
    >
      {/* Ambient background glow ring */}
      <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-[var(--theme-accent)]/20 to-[var(--theme-primary)]/20 blur-3xl pointer-events-none -z-10 animate-pulse-slow" />

      {/* Main 3D Matrix Container */}
      <div
        ref={cardMatrixRef}
        className="relative w-full max-w-[420px] sm:max-w-[460px] h-[340px] sm:h-[400px] transform-style-3d mx-auto"
        style={{
          transform: 'rotateX(8deg) rotateY(6deg)',
          transition: 'transform 0.15s ease-out',
        }}
      >
        {/* Layer 1: Central Growth Vector Chart Panel */}
        <div
          ref={centralPrismRef}
          className="absolute inset-0 rounded-3xl bg-[var(--theme-surface)]/90 backdrop-blur-xl border border-[var(--theme-border)] shadow-2xl p-5 sm:p-6 flex flex-col justify-between overflow-hidden"
          style={{ transform: 'translateZ(0px)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--theme-border)] pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)] flex items-center justify-center text-[var(--theme-accent)] shadow-md">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--theme-text-secondary)]">ScaleUp Engine</p>
                <h4 className="text-sm sm:text-base font-bold text-[var(--theme-text)] font-display">Performance Trajectory</h4>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-accent)] border border-[var(--theme-primary)]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent)] animate-ping" />
              Live Impact
            </span>
          </div>

          {/* SVG Kinetic Growth Graph */}
          <div className="relative w-full h-32 sm:h-36 my-auto flex items-end">
            <div className="absolute inset-0 flex flex-col justify-between opacity-15 pointer-events-none">
              <div className="border-b border-[var(--theme-border)]" />
              <div className="border-b border-[var(--theme-border)]" />
              <div className="border-b border-[var(--theme-border)]" />
            </div>

            <svg viewBox="0 0 400 130" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="growthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--theme-primary)" />
                  <stop offset="60%" stopColor="var(--theme-accent)" />
                  <stop offset="100%" stopColor="var(--theme-accent)" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--theme-accent)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--theme-accent)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Shaded Area */}
              <path
                d="M 10 110 Q 90 105 150 75 T 280 40 T 390 15 L 390 125 L 10 125 Z"
                fill="url(#areaGradient)"
              />

              {/* Dynamic Growth Line */}
              <path
                d="M 10 110 Q 90 105 150 75 T 280 40 T 390 15"
                fill="none"
                stroke="url(#growthGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Nodes */}
              <circle cx="10" cy="110" r="4.5" fill="var(--theme-primary)" />
              <circle cx="150" cy="75" r="4.5" fill="var(--theme-primary)" />
              <circle cx="280" cy="40" r="5" fill="var(--theme-accent)" />
              <circle cx="390" cy="15" r="6" fill="var(--theme-accent)" className="animate-ping" />
              <circle cx="390" cy="15" r="4" fill="var(--theme-text)" />
            </svg>
          </div>

          {/* Footer Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--theme-border)] text-center">
            <div className="p-2 rounded-xl bg-[var(--theme-surface-secondary)]">
              <p className="text-[10px] text-[var(--theme-text-secondary)] uppercase font-bold">ROAS</p>
              <p className="text-sm font-extrabold text-[var(--theme-text)]">4.8x</p>
            </div>
            <div className="p-2 rounded-xl bg-[var(--theme-surface-secondary)]">
              <p className="text-[10px] text-[var(--theme-text-secondary)] uppercase font-bold">Reach</p>
              <p className="text-sm font-extrabold text-[var(--theme-text)]">8.9M+</p>
            </div>
            <div className="p-2 rounded-xl bg-[var(--theme-surface-secondary)]">
              <p className="text-[10px] text-[var(--theme-text-secondary)] uppercase font-bold">Conversion</p>
              <p className="text-sm font-extrabold text-[var(--theme-accent)]">+380%</p>
            </div>
          </div>
        </div>

        {/* Layer 2: Floating Card Top-Right (Strategy Badge) */}
        <div
          ref={card1Ref}
          className="hidden sm:flex absolute -top-6 -right-4 p-3 rounded-2xl bg-[var(--theme-surface)]/95 backdrop-blur-md border border-[var(--theme-border)] shadow-xl items-center gap-2.5 z-20 hover:scale-105 transition-transform"
          style={{ transform: 'translateZ(40px)' }}
        >
          <div className="w-9 h-9 rounded-xl bg-[var(--theme-primary)]/15 text-[var(--theme-accent)] flex items-center justify-center font-bold">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--theme-text-secondary)]">High Velocity</p>
            <p className="text-xs font-bold text-[var(--theme-text)]">Creative Video Ads</p>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-[var(--theme-text-secondary)] ml-1" />
        </div>

        {/* Layer 3: Floating Card Bottom-Left (Targeting Badge) */}
        <div
          ref={card2Ref}
          className="hidden sm:flex absolute -bottom-6 -left-4 p-3 rounded-2xl bg-[var(--theme-surface)] text-[var(--theme-text)] shadow-2xl border border-[var(--theme-border)] items-center gap-2.5 z-20 hover:scale-105 transition-transform"
          style={{ transform: 'translateZ(50px)' }}
        >
          <div className="w-9 h-9 rounded-xl bg-[var(--theme-primary)] text-white flex items-center justify-center font-bold shadow-md">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--theme-text-secondary)]">Algorithm Ready</p>
            <p className="text-xs font-bold text-[var(--theme-text)]">Targeted Meta Scaling</p>
          </div>
        </div>
      </div>
    </div>
  );
};
