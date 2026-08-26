import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, MessageCircle, ShieldCheck } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import { ThemeSwitcher } from './ThemeSwitcher';
import { getOptimizedImageUrl } from '../../utils/imageKit';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getWhatsAppUrl, branding } = useSettings();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '/#hero' },
    { name: 'Services', href: '/#services' },
    { name: 'Work', href: '/#work' },
    { name: 'Why Us', href: '/#why-scaleup' },
    { name: 'Process', href: '/#process' },
    { name: 'Promise', href: '/#promise' },
    { name: 'Contact', href: '/#contact' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith('/#')) {
      const elementId = href.replace('/#', '');
      const elem = document.getElementById(elementId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'py-3 glass-nav shadow-md'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            {branding?.logoUrl ? (
              <img
                src={getOptimizedImageUrl(branding.logoUrl, { width: 450, quality: 95 })}
                alt={branding.brandName || 'ScaleUp Media'}
                className="h-10 sm:h-12 md:h-14 w-auto max-w-[190px] sm:max-w-[240px] md:max-w-[280px] object-contain object-left transition-transform group-hover:scale-105"
                loading="eager"
              />
            ) : (
              <>
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)] flex items-center justify-center text-[var(--theme-accent)] shadow-md group-hover:scale-105 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 sm:w-7 sm:h-7">
                    <path
                      d="M5 17L12 7L19 17H15L12 12.5L9 17H5Z"
                      fill="var(--theme-accent)"
                    />
                    <circle cx="12" cy="5" r="2" fill="var(--theme-primary)" />
                  </svg>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--theme-text)] font-display block leading-none">
                    {branding?.brandName ? branding.brandName.replace(' Media', '') : 'ScaleUp'}<span className="text-[var(--theme-accent)]">.</span>
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[var(--theme-text-secondary)] uppercase block mt-0.5">
                    {branding?.brandName && branding.brandName.includes(' ') ? branding.brandName.split(' ').slice(1).join(' ') : 'Media'}
                  </span>
                </div>
              </>
            )}
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[var(--theme-surface)]/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-[var(--theme-border)] shadow-sm">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault();
                    handleLinkClick(link.href);
                  }
                }}
                className="px-3.5 py-1.5 text-sm font-semibold text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] rounded-full hover:bg-[var(--theme-surface-secondary)] transition-all duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action & Theme Switcher */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Public Theme Switcher */}
            <ThemeSwitcher />

            {isAuthenticated && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)] text-[var(--theme-text)] hover:border-[var(--theme-accent)] transition-colors shadow-sm touch-target"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
                CMS Panel
              </Link>
            )}

            <a
              href={getWhatsAppUrl("Hi ScaleUp Media, I'd like to start a project with your team!")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-[var(--theme-primary)] text-white hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] group touch-target"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile Menu Button + Theme toggle on mobile */}
          <div className="flex sm:hidden items-center gap-2">
            <ThemeSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] text-[var(--theme-text)] hover:bg-[var(--theme-surface-secondary)] transition-colors touch-target"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Full Screen Animated Drawer */}
      {mobileMenuOpen && (
        <div
          ref={menuRef}
          className="lg:hidden fixed inset-x-0 top-[62px] bottom-0 bg-[var(--theme-surface)]/98 backdrop-blur-2xl border-b border-[var(--theme-border)] px-6 py-6 shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-top-4 flex flex-col justify-between overflow-y-auto"
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault();
                  }
                  handleLinkClick(link.href);
                }}
                className="text-lg font-bold text-[var(--theme-text)] hover:text-[var(--theme-accent)] py-3 px-3 rounded-xl hover:bg-[var(--theme-surface-secondary)] border-b border-[var(--theme-border)]/50 transition-colors touch-target justify-start"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-6 pb-4 flex flex-col gap-3">
            <a
              href={getWhatsAppUrl("Hi ScaleUp Media, let's start a project!")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-2xl bg-[var(--theme-primary)] text-white font-bold text-base text-center shadow-lg touch-target"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Start a Project →</span>
            </a>

            {isAuthenticated && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 text-xs font-bold text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] rounded-xl bg-[var(--theme-surface-secondary)] border border-[var(--theme-border)] touch-target"
              >
                CMS Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
