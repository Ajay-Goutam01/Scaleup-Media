import React, { useState, useEffect, useRef } from 'react';
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
  User,
  Upload,
  Trash2,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { contactApi } from '../../api/contact';
import { ContactSettings } from '../../types';
import { useSettings } from '../../context/SettingsContext';

export const AdminContactPage: React.FC = () => {
  const [formData, setFormData] = useState<Partial<ContactSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { refreshSettings, getWhatsAppUrl } = useSettings();

  const loadContact = async () => {
    try {
      setLoading(true);
      const res = await contactApi.get();
      if (res.success && res.data) {
        setFormData(res.data);
        if (res.data.founderPhotoUrl) {
          setPhotoPreview(res.data.founderPhotoUrl);
        }
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

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadPhoto = async () => {
    if (!photoFile) return;
    try {
      setUploadingPhoto(true);
      const res = await contactApi.uploadFounderPhoto(photoFile);
      if (res.success && res.data) {
        setFormData(res.data);
        setPhotoPreview(res.data.founderPhotoUrl || '');
        setPhotoFile(null);
        await refreshSettings();
        showToast('Founder photo uploaded to ImageKit successfully!');
      } else {
        throw new Error(res.message || 'Upload failed');
      }
    } catch (err: any) {
      alert('Failed to upload founder photo: ' + (err.message || 'Server error'));
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      setUploadingPhoto(true);
      const res = await contactApi.removeFounderPhoto();
      if (res.success && res.data) {
        setFormData(res.data);
        setPhotoPreview('');
        setPhotoFile(null);
        if (photoInputRef.current) photoInputRef.current.value = '';
        await refreshSettings();
        showToast('Founder photo removed.');
      } else {
        throw new Error(res.message || 'Failed to remove photo');
      }
    } catch (err: any) {
      alert('Failed to remove founder photo: ' + (err.message || 'Server error'));
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      // Auto-upload selected photo if user hasn't clicked upload yet
      let finalData = { ...formData };
      if (photoFile) {
        try {
          const uploadRes = await contactApi.uploadFounderPhoto(photoFile);
          if (uploadRes.success && uploadRes.data) {
            finalData = { ...finalData, ...uploadRes.data };
            setPhotoFile(null);
          }
        } catch (uploadErr) {
          console.warn('Auto photo upload failed during save:', uploadErr);
        }
      }

      await contactApi.update(finalData);
      await refreshSettings();
      showToast('Contact, WhatsApp & Founder profile saved successfully!');
    } catch (err: any) {
      alert('Failed to save settings: ' + (err.message || 'Server error'));
    } finally {
      setSaving(false);
    }
  };

  const founderInitial = (formData.founderName || 'S').charAt(0).toUpperCase();

  return (
    <AdminLayout
      title="Contact, WhatsApp & Founder Profile CMS"
      subtitle="Configure direct client touchpoints, WhatsApp numbers, social channels, and public footer founder bio."
      action={
        <button
          onClick={handleSave}
          disabled={saving || uploadingPhoto}
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
          {/* Section 1: Founder / Footer Profile */}
          <div className="p-8 rounded-3xl bg-white border border-[#DCE3EA] shadow-card space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#DCE3EA]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary font-display">Founder / Footer Profile</h3>
                  <p className="text-xs text-secondary">
                    Displayed dynamically in the public website footer leadership card.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent px-3 py-1 rounded-full bg-blue-50 border border-blue-200">
                Footer Card
              </span>
            </div>

            {/* Founder Photo Upload Area */}
            <div>
              <label className="block text-xs font-bold uppercase text-secondary mb-2.5">
                Founder Photo (ImageKit Integration)
              </label>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-5 rounded-2xl bg-[#F7F9FC] border border-[#DCE3EA]">
                {/* Photo Preview */}
                <div className="relative shrink-0">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Founder preview"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-blue-100 border-2 border-white flex items-center justify-center text-blue-600 font-extrabold text-2xl shadow-md font-display">
                      {founderInitial}
                    </div>
                  )}
                </div>

                {/* Upload / Actions */}
                <div className="space-y-3 flex-1">
                  <input
                    type="file"
                    ref={photoInputRef}
                    onChange={handlePhotoSelect}
                    accept="image/png,image/jpeg,image/webp,image/jpg"
                    className="hidden"
                  />

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      disabled={uploadingPhoto}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#DCE3EA] text-xs font-bold text-primary hover:bg-[#F1F5F9] shadow-sm transition-colors"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-accent" />
                      <span>{photoPreview ? 'Select New Photo' : 'Select Photo'}</span>
                    </button>

                    {photoFile && (
                      <button
                        type="button"
                        onClick={handleUploadPhoto}
                        disabled={uploadingPhoto}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm transition-colors"
                      >
                        {uploadingPhoto ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>{uploadingPhoto ? 'Uploading to ImageKit...' : 'Upload Now'}</span>
                      </button>
                    )}

                    {photoPreview && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        disabled={uploadingPhoto}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-100 shadow-sm transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-secondary">
                    PNG, JPG, or WEBP. Uploaded securely to ImageKit and saved in MongoDB.
                  </p>
                </div>
              </div>
            </div>

            {/* Founder Identity Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                  Founder Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.founderName ?? 'Shivam'}
                  onChange={(e) => setFormData({ ...formData, founderName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Shivam"
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
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="@shivamxbizz"
                />
              </div>
            </div>

            {/* Founder Bio */}
            <div>
              <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                Founder Bio / Introduction (2–3 Lines) *
              </label>
              <textarea
                rows={3}
                required
                value={
                  formData.founderBio ??
                  'Building brands through smart business strategy, creative marketing and high-impact content. From shooting and editing to paid advertising, we turn ideas into digital growth.'
                }
                onChange={(e) => setFormData({ ...formData, founderBio: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-sm text-primary font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Building brands through smart business strategy, creative marketing and high-impact content..."
              />
              <span className="text-[11px] text-secondary mt-1 block">
                Concise professional statement that highlights strategy, creativity, and execution.
              </span>
            </div>

            {/* Founder Social Channels */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold uppercase text-secondary">
                Founder Social Channels (Optional — Leave empty to hide)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-secondary mb-1">
                    <Linkedin className="w-3.5 h-3.5 text-blue-600" />
                    <span>LinkedIn URL</span>
                  </div>
                  <input
                    type="url"
                    value={formData.founderLinkedin || formData.linkedin || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        founderLinkedin: e.target.value,
                        linkedin: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-xs text-primary"
                    placeholder="https://linkedin.com/in/shivam"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-secondary mb-1">
                    <Facebook className="w-3.5 h-3.5 text-blue-500" />
                    <span>Facebook URL</span>
                  </div>
                  <input
                    type="url"
                    value={formData.founderFacebook || formData.facebook || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        founderFacebook: e.target.value,
                        facebook: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-xs text-primary"
                    placeholder="https://facebook.com/shivam"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-secondary mb-1">
                    <Youtube className="w-3.5 h-3.5 text-red-500" />
                    <span>YouTube URL</span>
                  </div>
                  <input
                    type="url"
                    value={formData.founderYoutube || formData.youtube || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        founderYoutube: e.target.value,
                        youtube: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-[#F7F9FC] border border-[#DCE3EA] text-xs text-primary"
                    placeholder="https://youtube.com/@shivam"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: WhatsApp Direct Integration */}
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

          {/* Section 3: Agency Email & Social Handles */}
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

            <div>
              <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
                Official Agency Instagram Handle *
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
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving || uploadingPhoto}
              className="px-8 py-3.5 rounded-2xl bg-[#07111F] text-white text-sm font-bold hover:bg-primary-hover shadow-xl transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Contact & Founder Settings'}
            </button>
          </div>
        </form>
      )}
    </AdminLayout>
  );
};
