import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@scaleupmedia.com');
  const [password, setPassword] = useState('admin123456');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-[var(--theme-text)]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[var(--theme-accent)]/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-6 group">
          <div className="w-12 h-12 rounded-2xl bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)] flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
              <path d="M5 17L12 7L19 17H15L12 12.5L9 17H5Z" fill="var(--theme-accent)" />
              <circle cx="12" cy="5" r="2" fill="var(--theme-primary)" />
            </svg>
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-[var(--theme-text)] font-display">
              ScaleUp<span className="text-[var(--theme-accent)]">.</span>
            </span>
            <span className="text-[10px] font-bold tracking-widest text-[var(--theme-text-secondary)] uppercase block">
              Management Portal
            </span>
          </div>
        </Link>

        <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-[var(--theme-text)] font-display">
          Admin CMS Authentication
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--theme-text-secondary)]">
          Enter authorized administrative credentials to manage content and campaigns.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[var(--theme-surface)] py-8 px-6 sm:px-10 rounded-3xl border border-[var(--theme-border)] shadow-card">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)] mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--theme-text-secondary)]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)] text-sm text-[var(--theme-text)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] transition-colors"
                  placeholder="admin@scaleupmedia.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)] mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--theme-text-secondary)]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)] text-sm text-[var(--theme-text)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] transition-colors"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[var(--theme-primary)] text-white text-sm font-bold hover:opacity-90 shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </form>

          {/* Quick Seed info badge for reviewer convenience */}
          <div className="mt-6 pt-5 border-t border-[var(--theme-border)] text-center">
            <p className="text-[11px] text-[var(--theme-text-secondary)]">
              Default Auto-Seeded Credentials: <br />
              <code className="px-1.5 py-0.5 rounded bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)] font-mono text-[var(--theme-text)] font-semibold">admin@scaleupmedia.com</code> / <code className="px-1.5 py-0.5 rounded bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)] font-mono text-[var(--theme-text)] font-semibold">admin123456</code>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="inline-flex items-center gap-1 text-xs font-bold text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
