import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, FileText, Sparkles, RefreshCw } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { contentApi } from '../../api/content';
import { WebsiteContent } from '../../types';
import { useSettings } from '../../context/SettingsContext';

export const AdminContentPage: React.FC = () => {
  const [formData, setFormData] = useState<Partial<WebsiteContent>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { refreshSettings } = useSettings();

  const loadContent = async () => {
    try {
      setLoading(true);
      const res = await contentApi.get();
      if (res.success && res.data) {
        setFormData(res.data);
      }
    } catch (err) {
      console.error('Failed to load website content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await contentApi.update(formData);
      await refreshSettings();
      showToast('Website content updated successfully!');
    } catch (err: any) {
      alert('Failed to update content: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Website Content CMS"
      subtitle="Edit headlines, body paragraphs, and button copy dynamically across all homepage sections."
      action={
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#07111F] text-white text-xs font-bold hover:bg-primary-hover shadow-sm disabled:opacity-50"
        >
          {saving ? (
            <RefreshCw className="w-4 h-4 text-accent animate-spin" />
          ) : (
            <Save className="w-4 h-4 text-accent" />
          )}
          <span>Save All Changes</span>
        </button>
      }
    >
      {toastMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm font-bold flex items-center gap-3 animate-in fade-in shadow-md">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-secondary mt-3">Loading content copy...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
          {/* Section 1: Hero Content */}
          <div className="p-8 rounded-3xl bg-[var(--theme-surface)] border border-[var(--theme-border)] shadow-card space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--theme-border)]">
              <span className="w-3 h-3 rounded-full bg-[var(--theme-accent)]" />
              <h3 className="text-lg font-bold text-[var(--theme-text)] font-display">Hero Section Copy</h3>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[var(--theme-text-secondary)] mb-1.5">
                Main Hero Headline
              </label>
              <input
                type="text"
                value={formData.heroHeading || ''}
                onChange={(e) => setFormData({ ...formData, heroHeading: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)] text-sm text-[var(--theme-text)] font-bold focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[var(--theme-text-secondary)] mb-1.5">
                Hero Subtitle / Description
              </label>
              <textarea
                rows={2}
                value={formData.heroDescription || ''}
                onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)] text-sm text-[var(--theme-text)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[var(--theme-text-secondary)] mb-1.5">
                  Primary Button Text
                </label>
                <input
                  type="text"
                  value={formData.heroPrimaryBtn || ''}
                  onChange={(e) => setFormData({ ...formData, heroPrimaryBtn: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)] text-sm font-semibold text-[var(--theme-text)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[var(--theme-text-secondary)] mb-1.5">
                  Secondary Button Text
                </label>
                <input
                  type="text"
                  value={formData.heroSecondaryBtn || ''}
                  onChange={(e) => setFormData({ ...formData, heroSecondaryBtn: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)] text-sm font-semibold text-[var(--theme-text)]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Reality / Market Diagnostic */}
          <div className="p-8 rounded-3xl bg-white border border-[#DCE3EA] shadow-card space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#DCE3EA]">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <h3 className="text-lg font-bold text-primary font-display">Reality Section Copy</h3>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                Reality Heading
              </label>
              <input
                type="text"
                value={formData.realityHeading || ''}
                onChange={(e) => setFormData({ ...formData, realityHeading: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                Reality Subtitle
              </label>
              <textarea
                rows={2}
                value={formData.realityDescription || ''}
                onChange={(e) => setFormData({ ...formData, realityDescription: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                Bottom Statement (Large Typography)
              </label>
              <input
                type="text"
                value={formData.realityStatement || ''}
                onChange={(e) => setFormData({ ...formData, realityStatement: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-bold"
              />
            </div>
          </div>

          {/* Section 3: Why ScaleUp Copy */}
          <div className="p-8 rounded-3xl bg-white border border-[#DCE3EA] shadow-card space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#DCE3EA]">
              <span className="w-3 h-3 rounded-full bg-brandBlue" />
              <h3 className="text-lg font-bold text-primary font-display">Why ScaleUp Section Copy</h3>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                Why ScaleUp Heading
              </label>
              <input
                type="text"
                value={formData.whyScaleUpHeading || ''}
                onChange={(e) => setFormData({ ...formData, whyScaleUpHeading: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                Why ScaleUp Subtitle
              </label>
              <input
                type="text"
                value={formData.whyScaleUpSubtitle || ''}
                onChange={(e) => setFormData({ ...formData, whyScaleUpSubtitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-medium"
              />
            </div>
          </div>

          {/* Section 4: ScaleUp Promise */}
          <div className="p-8 rounded-3xl bg-white border border-[#DCE3EA] shadow-card space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#DCE3EA]">
              <span className="w-3 h-3 rounded-full bg-accent" />
              <h3 className="text-lg font-bold text-primary font-display">ScaleUp Promise Manifesto</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                  Label
                </label>
                <input
                  type="text"
                  value={formData.promiseLabel || ''}
                  onChange={(e) => setFormData({ ...formData, promiseLabel: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                  Heading
                </label>
                <input
                  type="text"
                  value={formData.promiseHeading || ''}
                  onChange={(e) => setFormData({ ...formData, promiseHeading: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                Strong Belief Statement
              </label>
              <input
                type="text"
                value={formData.promiseStatement || ''}
                onChange={(e) => setFormData({ ...formData, promiseStatement: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-medium"
              />
            </div>
          </div>

          {/* Section 5: CTA & Footer */}
          <div className="p-8 rounded-3xl bg-white border border-[#DCE3EA] shadow-card space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#DCE3EA]">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <h3 className="text-lg font-bold text-primary font-display">CTA Banner &amp; Footer</h3>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                CTA Heading
              </label>
              <input
                type="text"
                value={formData.ctaHeading || ''}
                onChange={(e) => setFormData({ ...formData, ctaHeading: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                CTA Description
              </label>
              <input
                type="text"
                value={formData.ctaDescription || ''}
                onChange={(e) => setFormData({ ...formData, ctaDescription: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                  CTA Button Label
                </label>
                <input
                  type="text"
                  value={formData.ctaButtonText || ''}
                  onChange={(e) => setFormData({ ...formData, ctaButtonText: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                  Footer Tagline
                </label>
                <input
                  type="text"
                  value={formData.footerTagline || ''}
                  onChange={(e) => setFormData({ ...formData, footerTagline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-semibold"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 rounded-2xl bg-[#07111F] text-white text-sm font-bold hover:bg-primary-hover shadow-xl transition-all"
            >
              {saving ? 'Saving...' : 'Save All Content Updates'}
            </button>
          </div>
        </form>
      )}
    </AdminLayout>
  );
};
