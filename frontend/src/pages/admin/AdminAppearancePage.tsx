import React, { useState, useEffect, useRef } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { brandingApi } from '../../api/branding';
import { useSettings } from '../../context/SettingsContext';
import { useTheme } from '../../context/ThemeContext';
import { ThemePresetKey, THEME_PRESETS, ThemeTokens } from '../../services/themeService';
import {
  Upload,
  Trash2,
  Palette,
  Image,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Globe,
  Tag,
  Eye,
  RotateCcw,
  Sparkles,
  Sun,
  Moon,
  Anchor,
  Check,
} from 'lucide-react';

export const AdminAppearancePage: React.FC = () => {
  const { branding, refreshBranding } = useSettings();
  const {
    currentPreset,
    dbTheme,
    previewPreset,
    setPreview,
    applyAndSaveAdminTheme,
    resetAdminTheme,
    tokens,
  } = useTheme();

  // Branding state
  const [brandForm, setBrandForm] = useState({ brandName: '', tagline: '' });
  const [logoPreview, setLogoPreview] = useState('');
  const [faviconPreview, setFaviconPreview] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  // Theme selection state in admin
  const [selectedPreset, setSelectedPreset] = useState<ThemePresetKey>(currentPreset);
  const [savingTheme, setSavingTheme] = useState(false);
  const [savingBranding, setSavingBranding] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (branding) {
      setBrandForm({
        brandName: branding.brandName || 'ScaleUp Media',
        tagline: branding.tagline || 'GROWTH. STRATEGY. IMPACT.',
      });
      setLogoPreview(branding.logoUrl || '');
      setFaviconPreview(branding.faviconUrl || '');
    }
  }, [branding]);

  useEffect(() => {
    if (dbTheme?.preset) {
      setSelectedPreset((dbTheme.preset === 'navy' ? 'scaleup-navy' : dbTheme.preset) as ThemePresetKey);
    }
  }, [dbTheme]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleFaviconSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFaviconFile(file);
      setFaviconPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveBranding = async () => {
    setSavingBranding(true);
    try {
      await brandingApi.update(brandForm);

      if (logoFile) {
        const res = await brandingApi.uploadLogo(logoFile);
        if (!res.success) throw new Error(res.message || 'Logo upload failed');
        setLogoFile(null);
      }

      if (faviconFile) {
        const res = await brandingApi.uploadFavicon(faviconFile);
        if (!res.success) throw new Error(res.message || 'Favicon upload failed');
        setFaviconFile(null);
      }

      await refreshBranding();
      showMessage('success', 'Branding updated successfully!');
    } catch (err: any) {
      showMessage('error', err.message || 'Failed to save branding');
    } finally {
      setSavingBranding(false);
    }
  };

  const handleRemoveLogo = async () => {
    setSavingBranding(true);
    try {
      await brandingApi.removeLogo();
      setLogoPreview('');
      setLogoFile(null);
      await refreshBranding();
      showMessage('success', 'Logo removed.');
    } catch (err: any) {
      showMessage('error', err.message || 'Failed to remove logo');
    } finally {
      setSavingBranding(false);
    }
  };

  const handleRemoveFavicon = async () => {
    setSavingBranding(true);
    try {
      await brandingApi.removeFavicon();
      setFaviconPreview('');
      setFaviconFile(null);
      await refreshBranding();
      showMessage('success', 'Favicon removed.');
    } catch (err: any) {
      showMessage('error', err.message || 'Failed to remove favicon');
    } finally {
      setSavingBranding(false);
    }
  };

  // Preview theme locally
  const handlePreview = (presetKey: ThemePresetKey) => {
    setSelectedPreset(presetKey);
    setPreview(presetKey);
    showMessage('success', `Previewing "${THEME_PRESETS[presetKey].name}" theme`);
  };

  // Apply & save to DB
  const handleApplyTheme = async () => {
    setSavingTheme(true);
    try {
      const success = await applyAndSaveAdminTheme(selectedPreset);
      if (success) {
        showMessage('success', `Theme applied and saved: ${THEME_PRESETS[selectedPreset].name}`);
      } else {
        throw new Error('Failed to save theme to database');
      }
    } catch (err: any) {
      showMessage('error', err.message || 'Failed to apply theme');
    } finally {
      setSavingTheme(false);
    }
  };

  // Reset to default pure preset
  const handleResetTheme = async () => {
    setSavingTheme(true);
    try {
      const success = await resetAdminTheme(selectedPreset);
      if (success) {
        showMessage('success', `Reset ${THEME_PRESETS[selectedPreset].name} to default values.`);
      }
    } catch (err: any) {
      showMessage('error', err.message || 'Failed to reset theme');
    } finally {
      setSavingTheme(false);
    }
  };

  const themeCards: { key: ThemePresetKey; icon: any; badge: string; desc: string }[] = [
    {
      key: 'light',
      icon: Sun,
      badge: 'Clean & Bright',
      desc: 'White surfaces, crisp dark typography, and modern blue accents.',
    },
    {
      key: 'scaleup-navy',
      icon: Anchor,
      badge: 'Brand Default',
      desc: 'ScaleUp Media signature deep navy, electric blue & cyan glow.',
    },
    {
      key: 'midnight',
      icon: Moon,
      badge: 'Dark & Cinematic',
      desc: 'Near-black charcoal surfaces with vibrant violet and cyan accents.',
    },
  ];

  const activeSavedPreset = (dbTheme?.preset === 'navy' ? 'scaleup-navy' : dbTheme?.preset) || 'scaleup-navy';

  return (
    <AdminLayout
      title="Appearance & Branding"
      subtitle="Choose your website theme, logo, favicon and brand identity"
    >
      {/* Toast Notification */}
      {message && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold transition-all animate-in fade-in slide-in-from-top-3 ${
            message.type === 'success'
              ? 'bg-emerald-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}

      <div className="space-y-10">
        {/* ════════════════════════════════════════════════════════════
            THEME SELECTION SECTION
        ════════════════════════════════════════════════════════════ */}
        <section className="bg-[var(--theme-surface)] rounded-3xl border border-[var(--theme-border)] p-6 sm:p-8 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[var(--theme-border)]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-accent)] text-xs font-bold uppercase tracking-wider mb-2">
                <Palette className="w-3.5 h-3.5" />
                <span>Theme System</span>
              </div>
              <h2 className="text-2xl font-black text-[var(--theme-text)] font-display tracking-tight">
                CHOOSE YOUR THEME
              </h2>
              <p className="text-xs sm:text-sm text-[var(--theme-text-secondary)] mt-1">
                Select one cohesive theme preset. Exactly one active theme controls the entire website & admin.
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => handlePreview(selectedPreset)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface-secondary)] text-[var(--theme-text)] text-xs font-bold hover:border-[var(--theme-accent)] transition-all shadow-sm"
              >
                <Eye className="w-4 h-4 text-[var(--theme-accent)]" />
                <span>Preview</span>
              </button>

              <button
                type="button"
                onClick={handleResetTheme}
                disabled={savingTheme}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface-secondary)] text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] text-xs font-bold transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={handleApplyTheme}
                disabled={savingTheme}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--theme-primary)] text-white text-xs font-bold hover:opacity-90 transition-all shadow-md disabled:opacity-60"
              >
                {savingTheme ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Apply Theme</span>
              </button>
            </div>
          </div>

          {/* Three Large Selectable Theme Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {themeCards.map(({ key, icon: Icon, badge, desc }) => {
              const presetTokens = THEME_PRESETS[key];
              const isSelected = selectedPreset === key;
              const isSavedActive = activeSavedPreset === key;

              return (
                <div
                  key={key}
                  onClick={() => {
                    setSelectedPreset(key);
                    handlePreview(key);
                  }}
                  className={`cursor-pointer rounded-3xl border-2 p-6 transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'border-[var(--theme-primary)] ring-4 ring-[var(--theme-primary)]/20 shadow-xl scale-[1.02]'
                      : 'border-[var(--theme-border)] hover:border-[var(--theme-accent)]/50 bg-[var(--theme-surface-secondary)]'
                  }`}
                  style={{
                    backgroundColor: presetTokens.background,
                    color: presetTokens.text,
                  }}
                >
                  {/* Active / Selected Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border"
                      style={{
                        backgroundColor: presetTokens.surfaceSecondary,
                        color: presetTokens.accent,
                        borderColor: presetTokens.border,
                      }}
                    >
                      {badge}
                    </span>

                    {isSavedActive ? (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black tracking-wider uppercase shadow-sm">
                        <Check className="w-3 h-3" /> ACTIVE
                      </span>
                    ) : isSelected ? (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500 text-white text-[10px] font-black tracking-wider uppercase">
                        <Eye className="w-3 h-3" /> PREVIEWING
                      </span>
                    ) : null}
                  </div>

                  {/* Header & Swatch preview */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center border shadow-sm"
                        style={{
                          backgroundColor: presetTokens.surface,
                          borderColor: presetTokens.border,
                          color: presetTokens.accent,
                        }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3
                          className="text-lg font-black font-display tracking-tight"
                          style={{ color: presetTokens.text }}
                        >
                          {presetTokens.name}
                        </h3>
                        <p
                          className="text-xs font-medium opacity-70"
                          style={{ color: presetTokens.textSecondary }}
                        >
                          {presetTokens.tagline}
                        </p>
                      </div>
                    </div>

                    <p
                      className="text-xs leading-relaxed mt-3"
                      style={{ color: presetTokens.textSecondary }}
                    >
                      {desc}
                    </p>
                  </div>

                  {/* Mini Palette Swatch */}
                  <div
                    className="p-3 rounded-2xl border flex items-center justify-between gap-2"
                    style={{
                      backgroundColor: presetTokens.surface,
                      borderColor: presetTokens.border,
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-5 h-5 rounded-lg border border-black/15 shadow-sm"
                        title="Background"
                        style={{ backgroundColor: presetTokens.background }}
                      />
                      <div
                        className="w-5 h-5 rounded-lg border border-black/15 shadow-sm"
                        title="Surface"
                        style={{ backgroundColor: presetTokens.surface }}
                      />
                      <div
                        className="w-5 h-5 rounded-lg border border-black/15 shadow-sm"
                        title="Primary"
                        style={{ backgroundColor: presetTokens.primary }}
                      />
                      <div
                        className="w-5 h-5 rounded-lg border border-black/15 shadow-sm"
                        title="Accent"
                        style={{ backgroundColor: presetTokens.accent }}
                      />
                    </div>

                    <span
                      className="text-xs font-bold underline"
                      style={{ color: presetTokens.primary }}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Mini Preview Panel */}
          <div className="p-6 rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-surface-secondary)]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)] mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--theme-accent)]" />
              <span>Live Theme Component Preview ({THEME_PRESETS[selectedPreset].name})</span>
            </h4>

            <div
              className="p-6 rounded-2xl border transition-all duration-300 space-y-4"
              style={{
                backgroundColor: THEME_PRESETS[selectedPreset].background,
                borderColor: THEME_PRESETS[selectedPreset].border,
                color: THEME_PRESETS[selectedPreset].text,
              }}
            >
              {/* Sample Nav Bar */}
              <div
                className="px-4 py-2.5 rounded-full border flex items-center justify-between shadow-sm"
                style={{
                  backgroundColor: THEME_PRESETS[selectedPreset].surface,
                  borderColor: THEME_PRESETS[selectedPreset].border,
                }}
              >
                <span
                  className="font-black text-sm font-display tracking-tight"
                  style={{ color: THEME_PRESETS[selectedPreset].text }}
                >
                  ScaleUp<span style={{ color: THEME_PRESETS[selectedPreset].accent }}>.</span>
                </span>

                <div
                  className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: THEME_PRESETS[selectedPreset].primary }}
                >
                  Start Project →
                </div>
              </div>

              {/* Sample Card */}
              <div
                className="p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                style={{
                  backgroundColor: THEME_PRESETS[selectedPreset].card,
                  borderColor: THEME_PRESETS[selectedPreset].cardBorder,
                }}
              >
                <div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: THEME_PRESETS[selectedPreset].accent }}
                  >
                    SAMPLE SERVICE CARD
                  </span>
                  <h5
                    className="text-base font-bold mt-0.5"
                    style={{ color: THEME_PRESETS[selectedPreset].text }}
                  >
                    High-Converting Creative Ads
                  </h5>
                  <p
                    className="text-xs mt-1"
                    style={{ color: THEME_PRESETS[selectedPreset].textSecondary }}
                  >
                    Hyper-targeted visual advertising built to turn passive attention into scalable revenue.
                  </p>
                </div>

                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white shrink-0 self-start sm:self-auto"
                  style={{ backgroundColor: THEME_PRESETS[selectedPreset].primary }}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            BRANDING & LOGO MANAGEMENT
        ════════════════════════════════════════════════════════════ */}
        <section className="bg-[var(--theme-surface)] rounded-3xl border border-[var(--theme-border)] p-6 sm:p-8 shadow-card">
          <div className="mb-6 pb-6 border-b border-[var(--theme-border)]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-accent)] text-xs font-bold uppercase tracking-wider mb-2">
              <Globe className="w-3.5 h-3.5" />
              <span>Brand Assets</span>
            </div>
            <h2 className="text-2xl font-black text-[var(--theme-text)] font-display tracking-tight">
              BRAND IDENTITY & LOGO
            </h2>
            <p className="text-xs sm:text-sm text-[var(--theme-text-secondary)] mt-1">
              Upload your official agency logo and browser favicon. These reflect automatically across the website.
            </p>
          </div>

          <div className="space-y-6">
            {/* Logo Upload Card */}
            <div className="bg-[var(--theme-surface-secondary)] rounded-2xl border border-[var(--theme-border)] p-6">
              <h3 className="text-sm font-bold text-[var(--theme-text)] mb-1 flex items-center gap-2">
                <Image className="w-4 h-4 text-[var(--theme-accent)]" /> Site Logo
              </h3>
              <p className="text-xs text-[var(--theme-text-secondary)] mb-4">
                Displayed in the public Navbar, Footer, and Admin sidebar. PNG, SVG, or WebP format.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="w-40 h-20 rounded-2xl border-2 border-dashed border-[var(--theme-border)] flex items-center justify-center bg-[var(--theme-surface)] overflow-hidden shrink-0">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="max-h-16 max-w-full object-contain p-2" />
                  ) : (
                    <div className="text-center">
                      <Image className="w-6 h-6 text-[var(--theme-text-secondary)]/50 mx-auto mb-1" />
                      <span className="text-[10px] text-[var(--theme-text-secondary)]">No custom logo</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--theme-primary)] text-white text-xs font-bold hover:opacity-90 transition-all shadow-sm"
                  >
                    <Upload className="w-4 h-4" />
                    {logoPreview ? 'Replace Logo' : 'Upload Logo'}
                  </button>
                  {logoPreview && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold hover:bg-red-500/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove Logo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Favicon Upload Card */}
            <div className="bg-[var(--theme-surface-secondary)] rounded-2xl border border-[var(--theme-border)] p-6">
              <h3 className="text-sm font-bold text-[var(--theme-text)] mb-1 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[var(--theme-accent)]" /> Browser Favicon
              </h3>
              <p className="text-xs text-[var(--theme-text-secondary)] mb-4">
                Icon for browser tabs. Recommended size: 32×32 or 64×64 (.ico, .png, .svg).
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-[var(--theme-border)] flex items-center justify-center bg-[var(--theme-surface)] overflow-hidden shrink-0">
                  {faviconPreview ? (
                    <img src={faviconPreview} alt="Favicon preview" className="w-8 h-8 object-contain" />
                  ) : (
                    <div className="text-center">
                      <span className="text-xl">🌐</span>
                      <span className="text-[10px] text-[var(--theme-text-secondary)] block mt-1">Default</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <input
                    ref={faviconInputRef}
                    type="file"
                    accept="image/*,.ico"
                    onChange={handleFaviconSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => faviconInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--theme-primary)] text-white text-xs font-bold hover:opacity-90 transition-all shadow-sm"
                  >
                    <Upload className="w-4 h-4" />
                    {faviconPreview ? 'Replace Favicon' : 'Upload Favicon'}
                  </button>
                  {faviconPreview && (
                    <button
                      type="button"
                      onClick={handleRemoveFavicon}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold hover:bg-red-500/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove Favicon
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Brand Name & Tagline */}
            <div className="bg-[var(--theme-surface-secondary)] rounded-2xl border border-[var(--theme-border)] p-6">
              <h3 className="text-sm font-bold text-[var(--theme-text)] mb-4">Brand Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-[var(--theme-text-secondary)] uppercase tracking-wider block mb-2">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={brandForm.brandName}
                    onChange={(e) => setBrandForm({ ...brandForm, brandName: e.target.value })}
                    placeholder="ScaleUp Media"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] text-sm text-[var(--theme-text)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--theme-text-secondary)] uppercase tracking-wider block mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={brandForm.tagline}
                    onChange={(e) => setBrandForm({ ...brandForm, tagline: e.target.value })}
                    placeholder="GROWTH. STRATEGY. IMPACT."
                    className="w-full px-4 py-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] text-sm text-[var(--theme-text)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveBranding}
              disabled={savingBranding}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[var(--theme-primary)] text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-60 shadow-lg"
            >
              {savingBranding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {savingBranding ? 'Saving Branding...' : 'Save Branding Changes'}
            </button>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminAppearancePage;
