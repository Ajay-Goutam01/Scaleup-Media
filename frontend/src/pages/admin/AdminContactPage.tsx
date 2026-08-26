import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle,
  Phone,
  MessageCircle,
  Mail,
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { contactApi } from '../../api/contact';
import { ContactSettings } from '../../types';
import { useSettings } from '../../context/SettingsContext';

export const AdminContactPage: React.FC = () => {
  const [formData, setFormData] = useState<Partial<ContactSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { refreshSettings, getWhatsAppUrl } = useSettings();

  const loadContact = async () => {
    try {
      setLoading(true);
      const res = await contactApi.get();
      if (res.success && res.data) {
        setFormData(res.data);
      }
    } catch (err) {
      console.error('Failed to load contact settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContact();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await contactApi.update(formData);
      await refreshSettings();
      showToast('Contact & WhatsApp settings updated successfully!');
    } catch (err: any) {
      alert('Failed to save contact settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Contact, WhatsApp & Social Links CMS"
      subtitle="Configure direct client touchpoints, dynamic WhatsApp numbers and default prefilled messages."
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
          <span>Save Settings</span>
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
          <p className="text-xs text-secondary mt-3">Loading settings...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
          {/* WhatsApp Direct Integration */}
          <div className="p-8 rounded-3xl bg-[var(--theme-surface)] border border-[var(--theme-border)] shadow-card space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--theme-border)]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--theme-text)] font-display">WhatsApp Automation Engine</h3>
                  <p className="text-xs text-[var(--theme-text-secondary)]">Powers all CTA buttons and direct chat redirects</p>
                </div>
              </div>

              {/* Preview Button */}
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20"
              >
                <span>Test Live Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[var(--theme-text-secondary)] mb-1.5">
                  WhatsApp Number (with or without country code) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.whatsAppNumber || ''}
                  onChange={(e) => setFormData({ ...formData, whatsAppNumber: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)] text-sm text-[var(--theme-text)] font-bold focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
                  placeholder="6268523635"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[var(--theme-text-secondary)] mb-1.5">
                  Direct Calling Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-bold"
                  placeholder="6268523635"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                Default Prefilled WhatsApp Message *
              </label>
              <textarea
                rows={3}
                required
                value={formData.defaultWhatsAppMessage || ''}
                onChange={(e) => setFormData({ ...formData, defaultWhatsAppMessage: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-medium"
                placeholder="Hi ScaleUp Media, I'm interested in scaling my brand. Let's discuss a project!"
              />
            </div>
          </div>

          {/* Agency Email & Social Handles */}
          <div className="p-8 rounded-3xl bg-white border border-[#DCE3EA] shadow-card space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#DCE3EA]">
              <span className="w-3 h-3 rounded-full bg-[#07111F]" />
              <h3 className="text-lg font-bold text-primary font-display">Agency Email &amp; Social Channels</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-medium"
                  placeholder="shivamconnect65@gmail.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                  Physical / HQ Address
                </label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-medium"
                  placeholder="India / Global Digital Operations"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                  Instagram Handle *
                </label>
                <input
                  type="text"
                  required
                  value={formData.instagram || ''}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-bold"
                  placeholder="@scaleup.media.io"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                  Founder Instagram Handle *
                </label>
                <input
                  type="text"
                  required
                  value={formData.founderInstagram || ''}
                  onChange={(e) => setFormData({ ...formData, founderInstagram: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-bold"
                  placeholder="@shivamxbizz"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={formData.linkedin || ''}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-xs text-primary"
                  placeholder="https://linkedin.com/company/scaleupmedia"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={formData.facebook || ''}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-xs text-primary"
                  placeholder="https://facebook.com/scaleupmedia"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                  YouTube URL
                </label>
                <input
                  type="url"
                  value={formData.youtube || ''}
                  onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-xs text-primary"
                  placeholder="https://youtube.com/@scaleupmedia"
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
              {saving ? 'Saving...' : 'Save Contact & Social Settings'}
            </button>
          </div>
        </form>
      )}
    </AdminLayout>
  );
};
