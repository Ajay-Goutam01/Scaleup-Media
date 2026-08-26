import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Video,
  Sparkles,
  Palette,
  Target,
  Share2,
  Globe,
  ArrowUpRight,
  Layers,
  CheckCircle,
} from 'lucide-react';
import { servicesApi } from '../api/services';
import { Service } from '../types';
import { useSettings } from '../context/SettingsContext';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, any> = {
  Video,
  Sparkles,
  Palette,
  Target,
  Share2,
  Globe,
};

export const ServicesStackSection: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { getWhatsAppUrl } = useSettings();

  const containerRef = useRef<HTMLDivElement>(null);
  const cardsWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await servicesApi.getAll({ public: true });
        if (res.success && res.data && res.data.length > 0) {
          setServices(res.data);
        } else {
          // Fallback initial 6 services
          setServices([
            {
              _id: '1',
              serviceNumber: '01',
              title: 'Creative Reel / Ad',
              tagline: 'Turn attention into action.',
              description:
                'High-impact reels and video advertisements designed to make your brand stand out, connect with your audience and drive action.',
              tags: ['Promotional Reels', 'Product Videos', 'Short-form Ads', 'Campaign Videos'],
              icon: 'Video',
              active: true,
              order: 1,
            },
            {
              _id: '2',
              serviceNumber: '02',
              title: 'UGC & AI Video Ads',
              tagline: 'Authentic content. Smarter production.',
              description:
                'UGC-style and AI-powered video ads designed to make your brand feel relatable, modern and memorable.',
              tags: ['UGC Creator Ads', 'AI Voice & Visuals', 'Hook Testing', 'TikTok & IG Ads'],
              icon: 'Sparkles',
              active: true,
              order: 2,
            },
            {
              _id: '3',
              serviceNumber: '03',
              title: 'Creative Graphics',
              tagline: 'Make your brand impossible to ignore.',
              description:
                'Scroll-stopping social media creatives, promotional designs and visual content built to make your brand look professional and premium.',
              tags: ['Social Creatives', 'Posters & Banners', 'Brand Identity', 'Marketing Assets'],
              icon: 'Palette',
              active: true,
              order: 3,
            },
            {
              _id: '4',
              serviceNumber: '04',
              title: 'Meta Ads',
              tagline: 'Reach the right people. Drive real results.',
              description:
                'Strategic advertising campaigns designed to reach your ideal audience and turn attention into business opportunities.',
              tags: ['Lead Generation', 'Local Awareness', 'WhatsApp Leads', 'ROAS Optimization'],
              icon: 'Target',
              active: true,
              order: 4,
            },
            {
              _id: '5',
              serviceNumber: '05',
              title: 'Social Media Management',
              tagline: 'Your brand. Always active. Always growing.',
              description:
                'Consistent content, creative planning and professional social media management to build a stronger presence across social platforms.',
              tags: ['Content Planning', 'Community Management', 'Growth Strategy', 'Analytics'],
              icon: 'Share2',
              active: true,
              order: 5,
            },
            {
              _id: '6',
              serviceNumber: '06',
              title: 'Website Development',
              tagline: 'Build your digital home.',
              description:
                'Modern, responsive and mobile-friendly websites designed to strengthen your online presence and help your business look more professional online.',
              tags: ['Custom Web Design', 'High Conversion Landing Pages', 'Mobile-First', 'Speed & SEO'],
              icon: 'Globe',
              active: true,
              order: 6,
            },
          ]);
        }
      } catch (err: any) {
        console.warn('Could not fetch services, using fallback:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // GSAP Responsive ScrollTrigger via matchMedia
  useEffect(() => {
    if (!cardsWrapperRef.current || services.length === 0) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      // Desktop Pinned 3D Stacked Card Animation
      // Scope selector to the wrapper ref to avoid stale elements after route navigation
      const cards = gsap.utils.toArray<HTMLElement>('.service-stack-card', cardsWrapperRef.current);
      if (cards.length <= 1) return;

      const totalScroll = cards.length * 360;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${totalScroll}`,
          pin: true,
          scrub: 0.3,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Set initial desktop positions
      cards.forEach((card, index) => {
        if (index === 0) {
          gsap.set(card, { zIndex: 10, scale: 1, opacity: 1, y: 0, rotateX: 0 });
        } else {
          gsap.set(card, {
            zIndex: 10 + index,
            y: '105%',
            scale: 0.95,
            opacity: 0,
            rotateX: -6,
          });
        }
      });

      // Transitions
      cards.forEach((card, index) => {
        if (index < cards.length - 1) {
          const nextCard = cards[index + 1];

          tl.to(
            card,
            {
              scale: 0.88,
              y: -18,
              opacity: 0.2,
              rotateX: 8,
              duration: 1,
              ease: 'power2.inOut',
            },
            `step-${index}`
          );

          tl.to(
            nextCard,
            {
              y: '0%',
              scale: 1,
              opacity: 1,
              rotateX: 0,
              duration: 1,
              ease: 'power2.inOut',
            },
            `step-${index}`
          );
        }
      });
    });

    mm.add('(max-width: 767px)', () => {
      // Mobile: Natural fluid scroll reveal without pinning traps
      // Scope selector to wrapper ref
      const cards = gsap.utils.toArray<HTMLElement>('.service-stack-card', cardsWrapperRef.current);
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0.2, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              end: 'top 50%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    });

    return () => mm.revert();
  }, [services]);

  return (
    <section
      id="services"
      ref={containerRef}
      className="relative min-h-screen py-20 sm:py-24 lg:py-0 bg-[var(--theme-bg)] flex flex-col justify-center overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 lg:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--theme-primary)]/10 border border-[var(--theme-primary)]/20 text-[var(--theme-accent)] text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>What We Do</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--theme-text)] font-display tracking-tight">
            OUR SERVICES
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-[var(--theme-text-secondary)]">
            Six ways we help your brand get seen, trusted and chosen.
          </p>
        </div>

        {/* Cards Stage: Responsive on mobile vs 3D Pinned on Desktop */}
        <div
          ref={cardsWrapperRef}
          className="relative w-full max-w-4xl mx-auto flex flex-col md:block gap-6 md:gap-0 md:h-[480px] lg:h-[460px] md:perspective-2000"
        >
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Sparkles;

            return (
              <div
                key={service._id || index}
                className="service-stack-card relative md:absolute inset-0 rounded-3xl bg-[var(--theme-card)] border border-[var(--theme-card-border)] shadow-2xl p-6 sm:p-8 md:p-10 flex flex-col justify-between md:transform-style-3d will-change-transform"
                style={{
                  transformOrigin: 'center bottom',
                }}
              >
                {/* Card Top: Number, Title, Tagline */}
                <div>
                  <div className="flex items-center justify-between border-b border-[var(--theme-border)] pb-5 mb-5">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)] text-[var(--theme-accent)] flex items-center justify-center shadow-md shrink-0">
                        <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
                      </div>
                      <div>
                        <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-[var(--theme-accent)] block">
                          SERVICE {service.serviceNumber}
                        </span>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[var(--theme-text)] font-display">
                          {service.title}
                        </h3>
                      </div>
                    </div>

                    <div className="hidden sm:block text-right">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)] px-3 py-1 rounded-full bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)]">
                        ScaleUp Media
                      </span>
                    </div>
                  </div>

                  {/* Tagline & Description */}
                  <div className="space-y-2 sm:space-y-3">
                    <h4 className="text-base sm:text-lg font-bold text-[var(--theme-accent)]">
                      “{service.tagline}”
                    </h4>
                    <p className="text-sm sm:text-base text-[var(--theme-text-secondary)] leading-relaxed max-w-2xl font-normal">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Card Bottom: Tags & Action */}
                <div className="mt-6 pt-5 border-t border-[var(--theme-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Tags Pill List */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    {service.tags.map((tag: string, tIdx: number) => (
                      <span
                        key={tIdx}
                        className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-full bg-[var(--theme-surface-secondary)] text-[var(--theme-text)] border border-[var(--theme-border)]"
                      >
                        <CheckCircle className="w-3 h-3 text-[var(--theme-accent)] shrink-0" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>

                  {/* Dynamic WhatsApp Inquire Button (min 44px touch target) */}
                  <a
                    href={getWhatsAppUrl(
                      `Hi ScaleUp Media! I want to inquire about your ${service.title} service (${service.tagline}).`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold bg-[var(--theme-primary)] text-white hover:opacity-90 transition-all shadow-md shrink-0 touch-target"
                  >
                    <span>Inquire Service</span>
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
