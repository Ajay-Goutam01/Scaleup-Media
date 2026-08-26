import React, { useState, useEffect } from 'react';
import {
  Sliders,
  CheckCircle,
  Eye,
  EyeOff,
  Sparkles,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { sectionsApi } from '../../api/sections';
import { SectionSettings } from '../../types';
import { useSettings } from '../../context/SettingsContext';

interface SectionItem {
  key: keyof Omit<SectionSettings, '_id' | 'createdAt' | 'updatedAt'>;
  title: string;
  desc: string;
  category: 'Core' | 'Conversion' | 'Utility';
}

const sectionList: SectionItem[] = [
  {
    key: 'hero',
    title: 'Hero Section',
    desc: 'Main visual headline, line-by-line reveal, CTAs, and pure CSS 3D dynamic growth matrix.',
    category: 'Core',
  },
  {
    key: 'reality',
    title: 'Reality / Problem Diagnostic',
    desc: 'The market shift diagnostics, competitor comparison and dramatic attention statement.',
    category: 'Core',
  },
  {
    key: 'services',
    title: 'Services (GSAP 3D Stacked Cards)',
    desc: 'The 6 interactive service cards with pinned scroll layer physics.',
    category: 'Core',
  },
  {
    key: 'whyScaleUp',
    title: 'Why ScaleUp (5 Strategic Pillars)',
    desc: 'Strategy, Content, Creative, Advertising, Execution progressive reveal blocks.',
    category: 'Core',
  },
  {
    key: 'projects',
    title: 'Selected Projects Showcase',
    desc: 'Portfolio showcase cards, category filters, and interactive case study modal.',
    category: 'Core',
  },
  {
    key: 'testimonials',
    title: 'Client Reviews (Continuous Marquee)',
    desc: 'Two-row bidirectional infinite moving review marquees with ratings and avatars.',
    category: 'Core',
  },
  {
    key: 'process',
    title: 'Our Process (Vertical Timeline)',
    desc: 'The 4-step vertical glowing roadmap with scroll position tracking.',
    category: 'Conversion',
  },
  {
    key: 'promise',
    title: 'ScaleUp Promise Manifesto',
    desc: 'Agency belief statement and individual animated punch words ATTENTION. TRUST. GROWTH.',
    category: 'Conversion',
  },
  {
    key: 'cta',
    title: 'Final Call to Action Banner',
    desc: 'High-conversion growth banner triggering dynamic WhatsApp redirect.',
    category: 'Conversion',
  },
  {
    key: 'footer',
    title: 'Website Footer',
    desc: 'Agency footer with dynamic contact info, founder link, socials, and copyright.',
    category: 'Utility',
  },
  {
    key: 'floatingWhatsApp',
    title: 'Floating WhatsApp Quick Action Button',
    desc: 'Pulsing floating button in bottom-right corner for 1-click WhatsApp conversations.',
    category: 'Utility',
  },
];

export const AdminSectionsPage: React.FC = () => {
  const [sections, setSections] = useState<SectionSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { refreshSettings } = useSettings();

  const loadSections = async () => {
    try {
      setLoading(true);
      const res = await sectionsApi.get();
      if (res.success && res.data) {
        setSections(res.data);
      }
    } catch (err) {
      console.error('Failed to load section settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSections();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggle = async (key: keyof SectionSettings) => {
    if (!sections) return;

    const currentVal = sections[key] !== false;
    const newVal = !currentVal;

    const updated = {
      ...sections,
      [key]: newVal,
    };

    setSections(updated);

    try {
      setSaving(true);
      await sectionsApi.update({ [key]: newVal });
      await refreshSettings();
      showToast(`Section "${key}" is now ${newVal ? 'ENABLED (Visible)' : 'DISABLED (Hidden)'}.`);
    } catch (err: any) {
      alert('Failed to update section setting: ' + err.message);
      loadSections(); // revert
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Website Section Visibility Control"
      subtitle="Real-time ON/OFF switches for all homepage sections. Disabled sections disappear instantly from the public site."
    >
      {toastMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-sm font-bold flex items-center gap-3 animate-in fade-in shadow-md">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Info Callout */}
      <div className="mb-8 p-6 rounded-3xl bg-[var(--theme-surface)] text-[var(--theme-text)] border border-[var(--theme-border)] shadow-xl flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-[var(--theme-primary)] text-white flex items-center justify-center shrink-0 font-bold">
          <Sliders className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-base font-bold font-display text-[var(--theme-text)]">Dynamic Zero-Code Page Composition</h4>
          <p className="text-xs sm:text-sm text-[var(--theme-text-secondary)] mt-1 leading-relaxed">
            Flip any switch below to toggle that section on the live website. Changes persist immediately in the MongoDB database and update visitors in real-time.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-4 border-[var(--theme-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[var(--theme-text-secondary)] mt-3">Loading section controls...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sectionList.map((sec) => {
            const isEnabled = sections ? (sections as any)[sec.key] !== false : true;

            return (
              <div
                key={sec.key}
                className={`p-6 rounded-3xl border transition-all duration-300 flex items-center justify-between gap-4 ${
                  isEnabled
                    ? 'bg-[var(--theme-surface)] border-[var(--theme-border)] shadow-card'
                    : 'bg-[var(--theme-surface-secondary)] border-[var(--theme-border)] opacity-75'
                }`}
              >
                <div className="space-y-1 max-w-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                      }`}
                    />
                    <h4 className="text-base font-bold text-[var(--theme-text)] font-display">
                      {sec.title}
                    </h4>
                  </div>
                  <p className="text-xs text-secondary leading-relaxed">
                    {sec.desc}
                  </p>
                </div>

                {/* Toggle Switch */}
                <button
                  type="button"
                  onClick={() => handleToggle(sec.key as keyof SectionSettings)}
                  disabled={saving}
                  className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
                    isEnabled ? 'bg-[#08BDF5]' : 'bg-slate-300'
                  }`}
                  aria-label={`Toggle ${sec.title}`}
                >
                  <span
                    className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out ${
                      isEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
};
