import React, { useState, useRef } from 'react';
import { Star, Upload, User, Building2, Mail, MessageSquare, CheckCircle, Loader2, X } from 'lucide-react';
import { reviewsApi } from '../api/reviews';

export const ReviewSubmissionSection: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    review: '',
    rating: 0,
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters.';
    if (!form.review.trim() || form.review.trim().length < 20) errs.review = 'Review must be at least 20 characters.';
    if (form.review.trim().length > 1500) errs.review = 'Review cannot exceed 1500 characters.';
    if (form.rating < 1) errs.rating = 'Please select a star rating.';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Please enter a valid email.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name.trim());
      formData.append('company', form.company.trim());
      formData.append('email', form.email.trim());
      formData.append('review', form.review.trim());
      formData.append('rating', String(form.rating));
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      const res = await reviewsApi.submit(formData);
      if (res.success) {
        setSubmitted(true);
      } else {
        setErrors({ general: res.message || 'Something went wrong. Please try again.' });
      }
    } catch (err: any) {
      setErrors({ general: err.message || 'Failed to submit. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section id="share-review" className="py-20 sm:py-24 bg-[var(--theme-surface)] max-w-full">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--theme-text)] font-display mb-3">Thank You!</h2>
          <p className="text-[var(--theme-text-secondary)] text-base sm:text-lg mb-2">
            Your review has been submitted successfully.
          </p>
          <p className="text-xs sm:text-sm text-[var(--theme-text-secondary)]">
            It will appear on our website after a quick review by our team. We appreciate you sharing your experience!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="share-review" className="py-20 sm:py-24 bg-[var(--theme-surface)] max-w-full">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--theme-primary)]/10 border border-[var(--theme-primary)]/20 text-[var(--theme-accent)] text-xs font-bold uppercase tracking-wider mb-4 sm:mb-5">
            <Star className="w-3.5 h-3.5" />
            <span>Client Reviews</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[var(--theme-text)] font-display tracking-tight mb-3">
            SHARE YOUR EXPERIENCE
          </h2>
          <p className="text-[var(--theme-text-secondary)] text-sm sm:text-base md:text-lg max-w-xl mx-auto font-normal leading-relaxed">
            Worked with us? We'd love to hear about your experience. Your review helps other businesses make the right decision.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-[var(--theme-surface-secondary)] rounded-3xl border border-[var(--theme-border)] p-5 sm:p-8 space-y-5 sm:space-y-6 shadow-card"
        >
          {errors.general && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold">
              <X className="w-4 h-4 shrink-0" />
              {errors.general}
            </div>
          )}

          {/* Star Rating */}
          <div>
            <label className="text-xs font-bold text-[var(--theme-text-secondary)] uppercase tracking-wider block mb-3">
              Your Rating <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center gap-1.5 sm:gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setForm({ ...form, rating: star })}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="p-1 transition-transform hover:scale-110 active:scale-95 touch-target"
                  aria-label={`Rate ${star} star`}
                >
                  <Star
                    className={`w-7 h-7 sm:w-9 sm:h-9 transition-colors ${
                      star <= (hoveredStar || form.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-[var(--theme-border)] fill-transparent'
                    }`}
                  />
                </button>
              ))}
              {form.rating > 0 && (
                <span className="text-xs sm:text-sm text-[var(--theme-text-secondary)] self-center ml-2 font-semibold">
                  {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][form.rating]}
                </span>
              )}
            </div>
            {errors.rating && <p className="text-red-400 text-xs mt-1.5">{errors.rating}</p>}
          </div>

          {/* Name & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="text-xs font-bold text-[var(--theme-text-secondary)] uppercase tracking-wider block mb-2">
                Your Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--theme-text-secondary)]/50" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Rajesh Sharma"
                  className="w-full pl-10 pr-4 py-3 sm:py-3.5 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] text-[var(--theme-text)] placeholder:text-[var(--theme-text-secondary)]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-transparent transition-all touch-target"
                />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--theme-text-secondary)] uppercase tracking-wider block mb-2">
                Company / Business
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--theme-text-secondary)]/50" />
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Your Business Name"
                  className="w-full pl-10 pr-4 py-3 sm:py-3.5 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] text-[var(--theme-text)] placeholder:text-[var(--theme-text-secondary)]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-transparent transition-all touch-target"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-bold text-[var(--theme-text-secondary)] uppercase tracking-wider block mb-2">
              Email <span className="text-[var(--theme-text-secondary)]/60 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--theme-text-secondary)]/50" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full pl-10 pr-4 py-3 sm:py-3.5 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] text-[var(--theme-text)] placeholder:text-[var(--theme-text-secondary)]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-transparent transition-all touch-target"
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
          </div>

          {/* Review Text */}
          <div>
            <label className="text-xs font-bold text-[var(--theme-text-secondary)] uppercase tracking-wider block mb-2">
              Your Review <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-[var(--theme-text-secondary)]/50" />
              <textarea
                value={form.review}
                onChange={(e) => setForm({ ...form, review: e.target.value })}
                placeholder="Share your honest experience working with ScaleUp Media..."
                rows={4}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] text-[var(--theme-text)] placeholder:text-[var(--theme-text-secondary)]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-transparent transition-all resize-none font-normal"
              />
            </div>
            <div className="flex items-center justify-between mt-1">
              {errors.review ? (
                <p className="text-red-400 text-xs">{errors.review}</p>
              ) : (
                <span />
              )}
              <span className={`text-xs font-medium ${form.review.length > 1400 ? 'text-red-400' : 'text-[var(--theme-text-secondary)]/60'}`}>
                {form.review.length}/1500
              </span>
            </div>
          </div>

          {/* Profile Photo (optional) */}
          <div>
            <label className="text-xs font-bold text-[var(--theme-text-secondary)] uppercase tracking-wider block mb-2">
              Profile Photo <span className="text-[var(--theme-text-secondary)]/60 font-normal">(optional)</span>
            </label>
            <div className="flex items-center gap-4">
              {profilePreview ? (
                <div className="relative w-14 h-14 shrink-0">
                  <img src={profilePreview} alt="Profile" className="w-14 h-14 rounded-2xl object-cover border border-[var(--theme-border)]" />
                  <button
                    type="button"
                    onClick={() => { setProfileImage(null); setProfilePreview(''); }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-14 h-14 rounded-2xl border-2 border-dashed border-[var(--theme-border)] flex items-center justify-center cursor-pointer hover:border-[var(--theme-accent)] transition-colors shrink-0 bg-[var(--theme-surface)]"
                >
                  <Upload className="w-5 h-5 text-[var(--theme-text-secondary)]/50" />
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              <div>
                <p className="text-sm text-[var(--theme-text)] font-semibold">
                  {profilePreview ? 'Photo selected' : 'Upload your photo'}
                </p>
                <p className="text-xs text-[var(--theme-text-secondary)] mt-0.5">JPG, PNG or WebP · Max 5MB</p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-[var(--theme-primary)] text-white font-bold text-base hover:opacity-90 transition-all disabled:opacity-60 shadow-lg touch-target"
          >
            {submitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
            ) : (
              <><Star className="w-5 h-5" /> Submit Your Review</>
            )}
          </button>

          <p className="text-center text-xs text-[var(--theme-text-secondary)]">
            Reviews are moderated before appearing on the website. We respect your privacy.
          </p>
        </form>
      </div>
    </section>
  );
};
