import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  MessageSquareQuote,
  Sliders,
  FileText,
  PhoneCall,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Palette,
  Star,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  subtitle,
  action,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin, logout } = useAuth();
  const { branding } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Projects CMS', path: '/admin/projects', icon: FolderKanban },
    { name: 'Services CMS', path: '/admin/services', icon: Briefcase },
    { name: 'Testimonials CMS', path: '/admin/testimonials', icon: MessageSquareQuote },
    { name: 'Reviews Queue', path: '/admin/reviews', icon: Star },
    { name: 'Website Content', path: '/admin/content', icon: FileText },
    { name: 'Section ON/OFF', path: '/admin/sections', icon: Sliders },
    { name: 'Contact & WhatsApp', path: '/admin/contact', icon: PhoneCall },
    { name: 'Appearance & Branding', path: '/admin/appearance', icon: Palette },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] flex">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[var(--theme-surface)] border-r border-[var(--theme-border)] text-[var(--theme-text)] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div>
          <div className="p-6 border-b border-[var(--theme-border)] flex items-center justify-between">
            <Link to="/" target="_blank" className="flex items-center gap-2.5 h-12">
              {branding?.logoUrl ? (
                <img
                  src={branding.logoUrl}
                  alt={branding.brandName || 'ScaleUp Media'}
                  className="h-full w-auto max-w-[190px] object-contain object-left block"
                />
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)] flex items-center justify-center text-[var(--theme-accent)] shadow-sm">
                    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
                      <path d="M5 17L12 7L19 17H15L12 12.5L9 17H5Z" fill="var(--theme-accent)" />
                      <circle cx="12" cy="5" r="2" fill="var(--theme-primary)" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xl font-black tracking-tight text-[var(--theme-text)] font-display">
                      {branding?.brandName ? branding.brandName.replace(' Media', '') : 'ScaleUp'}<span className="text-[var(--theme-accent)]">.</span>
                    </span>
                    <span className="text-[9px] font-bold tracking-widest text-[var(--theme-accent)] uppercase block">
                      Admin CMS
                    </span>
                  </div>
                </>
              )}
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2.5 rounded-xl bg-[var(--theme-surface-secondary)] text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] touch-target"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all touch-target justify-start ${
                    isActive
                      ? 'bg-[var(--theme-primary)] text-white shadow-md'
                      : 'text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] hover:bg-[var(--theme-surface-secondary)]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile & quick live link */}
        <div className="p-4 border-t border-[var(--theme-border)] space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[var(--theme-surface-secondary)] hover:border-[var(--theme-accent)] border border-[var(--theme-border)] text-xs font-bold text-[var(--theme-text)] transition-colors touch-target"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
              <span>View Public Website</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-[var(--theme-text-secondary)]" />
          </Link>

          <div className="flex items-center justify-between px-2 pt-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[var(--theme-primary)]/20 text-[var(--theme-accent)] flex items-center justify-center font-bold text-xs">
                {admin?.name?.charAt(0) || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-[var(--theme-text)] truncate">{admin?.name || 'Administrator'}</p>
                <p className="text-[10px] text-[var(--theme-text-secondary)] truncate">{admin?.email || 'admin@scaleupmedia.com'}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-[var(--theme-surface-secondary)] hover:bg-rose-500 hover:text-white text-[var(--theme-text-secondary)] transition-colors touch-target"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Header */}
        <header className="h-20 bg-[var(--theme-surface)] border-b border-[var(--theme-border)] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-[var(--theme-surface-secondary)] text-[var(--theme-text)] touch-target"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[var(--theme-text)] font-display">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs sm:text-sm text-[var(--theme-text-secondary)] font-medium">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {action}
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
