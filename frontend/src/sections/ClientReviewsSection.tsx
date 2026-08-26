import React, { useState, useEffect } from 'react';
import { Star, MessageSquareQuote } from 'lucide-react';
import { reviewsApi } from '../api/reviews';
import { testimonialsApi } from '../api/testimonials';
import { Testimonial, Review } from '../types';

export const ClientReviewsSection: React.FC = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReviewsAndTestimonials = async () => {
      try {
        setLoading(true);

        const [reviewsRes, testimonialsRes] = await Promise.allSettled([
          reviewsApi.getPublic(),
          testimonialsApi.getAll({ public: true }),
        ]);

        const merged: Testimonial[] = [];

        // 1. Add approved public reviews
        if (reviewsRes.status === 'fulfilled' && reviewsRes.value.success && reviewsRes.value.data) {
          reviewsRes.value.data.forEach((r: Review, idx: number) => {
            merged.push({
              _id: r._id,
              clientName: r.name,
              company: r.company || 'Verified Client',
              review: r.review,
              profileImage: r.profileImageUrl || '',
              rating: r.rating || 5,
              marqueeRow: (r.marqueeRow || (idx % 2 === 0 ? 1 : 2)) as 1 | 2,
              active: true,
              order: idx,
            });
          });
        }

        // 2. Add CMS testimonials
        if (testimonialsRes.status === 'fulfilled' && testimonialsRes.value.success && testimonialsRes.value.data) {
          testimonialsRes.value.data.forEach((t: Testimonial) => {
            merged.push(t);
          });
        }

        if (merged.length > 0) {
          setItems(merged);
        } else {
          // Fallback testimonials
          setItems([
            {
              _id: '1',
              clientName: 'Rahul Verma',
              company: 'Founder, Apex Retail',
              review:
                'ScaleUp Media transformed our customer acquisition completely. Their video ads delivered 4.6x ROAS in the first 30 days alone.',
              profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
              rating: 5,
              marqueeRow: 1,
              active: true,
              order: 1,
            },
            {
              _id: '2',
              clientName: 'Sneha Kapoor',
              company: 'Marketing Lead, GlowAura',
              review:
                'The level of creative strategy and speed of execution is unmatched. Our brand looks 10x more premium on Instagram now.',
              profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop',
              rating: 5,
              marqueeRow: 1,
              active: true,
              order: 2,
            },
            {
              _id: '3',
              clientName: 'Ankit Mehta',
              company: 'Director, UrbanSpace Real Estate',
              review:
                'Direct high-intent WhatsApp leads increased by 320% after launching their custom targeted Meta Ads campaign.',
              profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
              rating: 5,
              marqueeRow: 1,
              active: true,
              order: 3,
            },
            {
              _id: '4',
              clientName: 'Pooja Sharma',
              company: 'Co-Founder, FitPulse',
              review:
                'Their UGC and AI video hooks stopped our audience from scrolling. We scaled our subscriber base faster than ever.',
              profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
              rating: 5,
              marqueeRow: 2,
              active: true,
              order: 4,
            },
            {
              _id: '5',
              clientName: 'Vikram Singh',
              company: 'CEO, ZestLogistics',
              review:
                'Clear communication, transparent results, and outstanding design. ScaleUp Media feels like an in-house elite marketing department.',
              profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop',
              rating: 5,
              marqueeRow: 2,
              active: true,
              order: 5,
            },
            {
              _id: '6',
              clientName: 'Meera Nair',
              company: 'Managing Partner, Zenith Hospitality',
              review:
                'From high-impact video ads to full website development, ScaleUp Media elevated our brand from unknown to industry benchmark.',
              profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop',
              rating: 5,
              marqueeRow: 2,
              active: true,
              order: 6,
            },
          ]);
        }
      } catch (err) {
        console.warn('Reviews load notice:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewsAndTestimonials();
  }, []);

  const row1 = items.filter((t) => t.marqueeRow === 1);
  const row2 = items.filter((t) => t.marqueeRow === 2);

  const finalRow1 = row1.length > 0 ? row1 : items.slice(0, Math.ceil(items.length / 2));
  const finalRow2 = row2.length > 0 ? row2 : items.slice(Math.ceil(items.length / 2));

  const renderCard = (t: Testimonial, idx: number) => (
    <div
      key={`${t._id}-${idx}`}
      className="w-[280px] sm:w-[350px] md:w-[390px] shrink-0 p-5 sm:p-7 rounded-3xl bg-[var(--theme-card)] border border-[var(--theme-card-border)] shadow-card hover:shadow-card-hover transition-all duration-300 mx-2 sm:mx-3 flex flex-col justify-between"
    >
      <div>
        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-3 sm:mb-4 text-amber-400">
          {Array.from({ length: t.rating || 5 }).map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400" />
          ))}
        </div>

        {/* Review Body */}
        <p className="text-sm sm:text-base text-[var(--theme-text)] leading-relaxed mb-5 sm:mb-6 font-normal">
          “{t.review}”
        </p>
      </div>

      {/* Client Profile */}
      <div className="flex items-center gap-3 pt-4 border-t border-[var(--theme-border)]">
        <img
          src={
            t.profileImage ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop'
          }
          alt={t.clientName}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-[var(--theme-border)]"
          loading="lazy"
        />
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-[var(--theme-text)] font-display">{t.clientName}</h4>
          <p className="text-[11px] sm:text-xs text-[var(--theme-text-secondary)] font-medium">{t.company}</p>
        </div>
      </div>
    </div>
  );

  return (
    <section
      id="testimonials"
      className="py-20 sm:py-24 bg-[var(--theme-surface)] border-y border-[var(--theme-border)] overflow-hidden relative max-w-full"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--theme-primary)]/10 border border-[var(--theme-primary)]/20 text-[var(--theme-accent)] text-xs font-bold uppercase tracking-wider mb-3">
          <MessageSquareQuote className="w-3.5 h-3.5" />
          <span>Real Client Experiences</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--theme-text)] font-display tracking-tight">
          WHAT OUR CLIENTS SAY
        </h2>
      </div>

      {/* Marquee Row 1: Right to Left */}
      <div className="relative w-full overflow-hidden mb-4 sm:mb-6">
        <div className="animate-marquee-left pause-hover">
          {finalRow1.concat(finalRow1).map((t, idx) => renderCard(t, idx))}
        </div>
      </div>

      {/* Marquee Row 2: Left to Right */}
      <div className="relative w-full overflow-hidden">
        <div className="animate-marquee-right pause-hover">
          {finalRow2.concat(finalRow2).map((t, idx) => renderCard(t, idx))}
        </div>
      </div>
    </section>
  );
};
