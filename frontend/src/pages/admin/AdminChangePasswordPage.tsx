import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

export const AdminChangePasswordPage: React.FC = () => {
  const { admin, clearMustChangePassword, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.newPassword !== form.confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    if (form.newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (form.currentPassword === form.newPassword) {
      setError('New password must be different from the current password.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });

      if (res.success) {
        setSuccess(true);
        clearMustChangePassword();
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/admin', { replace: true });
        }, 2000);
      } else {
        setError(res.message || 'Failed to change password. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (pwd: string): { label: string; color: string; width: string } => {
    if (pwd.length === 0) return { label: '', color: '', width: '0%' };
    if (pwd.length < 6) return { label: 'Too Short', color: 'bg-red-500', width: '20%' };
    if (pwd.length < 8) return { label: 'Weak', color: 'bg-orange-500', width: '40%' };
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNum = /[0-9]/.test(pwd);
    const hasSpecial = /[^a-zA-Z0-9]/.test(pwd);
    const score = [hasUpper, hasLower, hasNum, hasSpecial].filter(Boolean).length;
    if (score <= 2) return { label: 'Fair', color: 'bg-yellow-500', width: '55%' };
    if (score === 3) return { label: 'Good', color: 'bg-blue-500', width: '75%' };
    return { label: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const strength = passwordStrength(form.newPassword);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--theme-bg)' }}
    >
      {/* Background glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'var(--theme-primary)', opacity: 0.06 }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg"
            style={{ background: 'var(--theme-primary)' }}
          >
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1
            className="text-2xl sm:text-3xl font-black mb-2"
            style={{ color: 'var(--theme-text)', fontFamily: 'Outfit, sans-serif' }}
          >
            Set Your Password
          </h1>
          <p style={{ color: 'var(--theme-text-secondary)' }} className="text-sm">
            {admin?.email ? (
              <>Logged in as <span style={{ color: 'var(--theme-accent)' }}>{admin.email}</span></>
            ) : (
              'You must set a new password before accessing the dashboard.'
            )}
          </p>
          <div
            className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border"
            style={{
              background: 'rgba(234, 179, 8, 0.1)',
              borderColor: 'rgba(234, 179, 8, 0.3)',
              color: '#ca8a04',
            }}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Password change required to continue</span>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl border p-6 sm:p-8 shadow-2xl"
          style={{ background: 'var(--theme-card)', borderColor: 'var(--theme-card-border)' }}
        >
          {success ? (
            <div className="text-center py-6">
              <div
                className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
                style={{ background: 'rgba(34, 197, 94, 0.1)' }}
              >
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h2
                className="text-xl font-bold mb-2"
                style={{ color: 'var(--theme-text)' }}
              >
                Password Changed!
              </h2>
              <p style={{ color: 'var(--theme-text-secondary)' }} className="text-sm">
                Redirecting to dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Current Password */}
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: 'var(--theme-text-secondary)' }}
                >
                  Current Password (Temporary)
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: 'var(--theme-text-secondary)' }}
                  />
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type={showCurrent ? 'text' : 'password'}
                    value={form.currentPassword}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border text-sm outline-none transition-all"
                    style={{
                      background: 'var(--theme-surface)',
                      borderColor: 'var(--theme-border)',
                      color: 'var(--theme-text)',
                    }}
                    placeholder="Enter your temporary password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--theme-text-secondary)' }}
                    tabIndex={-1}
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: 'var(--theme-text-secondary)' }}
                >
                  New Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: 'var(--theme-text-secondary)' }}
                  />
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showNew ? 'text' : 'password'}
                    value={form.newPassword}
                    onChange={handleChange}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border text-sm outline-none transition-all"
                    style={{
                      background: 'var(--theme-surface)',
                      borderColor: 'var(--theme-border)',
                      color: 'var(--theme-text)',
                    }}
                    placeholder="Minimum 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--theme-text-secondary)' }}
                    tabIndex={-1}
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Strength indicator */}
                {form.newPassword.length > 0 && (
                  <div className="mt-2">
                    <div
                      className="h-1 rounded-full overflow-hidden"
                      style={{ background: 'var(--theme-border)' }}
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                        style={{ width: strength.width }}
                      />
                    </div>
                    <p
                      className="text-xs mt-1"
                      style={{ color: 'var(--theme-text-secondary)' }}
                    >
                      Strength: <span className="font-semibold">{strength.label}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: 'var(--theme-text-secondary)' }}
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: 'var(--theme-text-secondary)' }}
                  />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border text-sm outline-none transition-all"
                    style={{
                      background: 'var(--theme-surface)',
                      borderColor: form.confirmPassword && form.confirmPassword !== form.newPassword
                        ? 'rgba(239,68,68,0.5)'
                        : 'var(--theme-border)',
                      color: 'var(--theme-text)',
                    }}
                    placeholder="Repeat new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--theme-text-secondary)' }}
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm border"
                  style={{
                    background: 'rgba(239,68,68,0.1)',
                    borderColor: 'rgba(239,68,68,0.3)',
                    color: '#ef4444',
                  }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !form.currentPassword || !form.newPassword || !form.confirmPassword}
                className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'var(--theme-primary)',
                  color: 'white',
                }}
              >
                {loading ? 'Changing Password...' : 'Set New Password & Continue'}
              </button>

              {/* Logout option */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={logout}
                  className="text-xs underline underline-offset-2"
                  style={{ color: 'var(--theme-text-secondary)' }}
                >
                  Log out and start over
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
