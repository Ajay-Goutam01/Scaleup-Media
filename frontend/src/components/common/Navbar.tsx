import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  ArrowUpRight,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';

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

  // Detect page scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Lock body scroll while mobile menu is open
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
        elem.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  };

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        ${scrolled
          ? 'py-2 glass-nav shadow-md'
          : 'py-2.5 sm:py-3 bg-transparent'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 sm:gap-5 lg:gap-8">

          {/* =========================================================
              BRAND LOGO
          ========================================================= */}

          <div
            className="
              flex-none
              flex
              items-center
              justify-start
              min-w-[110px]
              sm:min-w-[150px]
              md:min-w-[190px]
              lg:min-w-[240px]
              max-w-[140px]
              sm:max-w-[200px]
              md:max-w-[260px]
              lg:max-w-[320px]
              h-[48px]
              sm:h-[56px]
              md:h-[68px]
              lg:h-[76px]
            "
          >
            <Link
              to="/"
              className="
                flex
                items-center
                justify-start
                w-full
                h-full
                group
              "
              aria-label={branding?.brandName || 'ScaleUp Media'}
            >
              {branding?.logoUrl ? (
                <img
                  src={getOptimizedImageUrl(branding.logoUrl, {
                    trim: true,
                    quality: 95,
                  })}
                  alt={branding.brandName || 'ScaleUp Media'}
                  className="
                    h-[42px]
                    sm:h-[50px]
                    md:h-[60px]
                    lg:h-[68px]
                    w-auto
                    max-w-full
                    object-contain
                    object-left
                    block
                    transition-transform
                    duration-300
                    group-hover:scale-105
                  "
                  loading="eager"
                  decoding="async"
                />
              ) : (
                <>
                  {/* Fallback Logo Icon */}
                  <div
                    className="
                      h-11 w-11
                      sm:h-13 sm:w-13
                      md:h-15 md:w-15
                      rounded-2xl
                      bg-[var(--theme-surface-secondary)]
                      border
                      border-[var(--theme-border)]
                      flex
                      items-center
                      justify-center
                      text-[var(--theme-accent)]
                      shadow-md
                      group-hover:scale-105
                      transition-transform
                      duration-300
                      shrink-0
                    "
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="
                        w-7 h-7
                        sm:w-8 sm:h-8
                        md:w-9 md:h-9
                      "
                      aria-hidden="true"
                    >
                      <path
                        d="M5 17L12 7L19 17H15L12 12.5L9 17H5Z"
                        fill="var(--theme-accent)"
                      />
                      <circle
                        cx="12"
                        cy="5"
                        r="2"
                        fill="var(--theme-primary)"
                      />
                    </svg>
                  </div>

                  {/* Fallback Brand Name */}
                  <div className="flex flex-col justify-center ml-2.5 sm:ml-3.5">
                    <span
                      className="
                        text-2xl
                        sm:text-3xl
                        md:text-4xl
                        font-black
                        tracking-tight
                        text-[var(--theme-text)]
                        font-display
                        block
                        leading-none
                      "
                    >
                      {branding?.brandName
                        ? branding.brandName.replace(' Media', '')
                        : 'ScaleUp'}
                      <span className="text-[var(--theme-accent)]">.</span>
                    </span>

                    <span
                      className="
                        text-[10px]
                        sm:text-[12px]
                        font-black
                        tracking-[0.25em]
                        text-[var(--theme-text-secondary)]
                        uppercase
                        block
                        mt-1
                      "
                    >
                      {branding?.brandName &&
                        branding.brandName.includes(' ')
                        ? branding.brandName
                          .split(' ')
                          .slice(1)
                          .join(' ')
                        : 'MEDIA'}
                    </span>
                  </div>
                </>
              )}
            </Link>
          </div>

          {/* =========================================================
              DESKTOP NAVIGATION
          ========================================================= */}

          <nav
            className="
              hidden
              lg:flex
              items-center
              gap-1
              bg-[var(--theme-surface)]/80
              backdrop-blur-md
              px-4
              py-1.5
              rounded-full
              border
              border-[var(--theme-border)]
              shadow-sm
            "
          >
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
                className="
                  px-3.5
                  py-1.5
                  text-sm
                  font-semibold
                  text-[var(--theme-text-secondary)]
                  hover:text-[var(--theme-text)]
                  rounded-full
                  hover:bg-[var(--theme-surface-secondary)]
                  transition-all
                  duration-200
                  whitespace-nowrap
                "
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* =========================================================
              DESKTOP ACTIONS
          ========================================================= */}

          <div className="hidden sm:flex items-center gap-2.5 lg:gap-3 shrink-0">

            {/* Theme Switcher */}
            <ThemeSwitcher />

            {/* CMS Panel - only authenticated users */}
            {isAuthenticated && (
              <Link
                to="/admin"
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  px-3.5
                  py-2
                  rounded-full
                  text-xs
                  font-bold
                  bg-[var(--theme-surface-secondary)]
                  border
                  border-[var(--theme-border)]
                  text-[var(--theme-text)]
                  hover:border-[var(--theme-accent)]
                  transition-colors
                  shadow-sm
                  touch-target
                  whitespace-nowrap
                "
              >
                <ShieldCheck
                  className="w-3.5 h-3.5 text-[var(--theme-accent)]"
                />

                CMS Panel
              </Link>
            )}

            {/* Start Project */}
            <a
              href={getWhatsAppUrl(
                "Hi ScaleUp Media, I'd like to start a project with your team!"
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex
                items-center
                gap-2
                px-5
                py-2.5
                rounded-full
                text-sm
                font-bold
                bg-[var(--theme-primary)]
                text-white
                hover:opacity-90
                transition-all
                duration-300
                shadow-md
                hover:shadow-lg
                hover:scale-[1.02]
                active:scale-[0.98]
                group
                touch-target
                whitespace-nowrap
              "
            >
              <span>Start a Project</span>

              <ArrowUpRight
                className="
                  w-4 h-4
                  text-white
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                  transition-transform
                "
              />
            </a>
          </div>

          {/* =========================================================
              MOBILE ACTIONS
          ========================================================= */}

          <div className="flex sm:hidden items-center gap-2 shrink-0">

            {/* Mobile Theme Switcher */}
            <ThemeSwitcher />

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="
                p-2.5
                rounded-xl
                bg-[var(--theme-surface)]
                border
                border-[var(--theme-border)]
                text-[var(--theme-text)]
                hover:bg-[var(--theme-surface-secondary)]
                transition-colors
                touch-target
                shrink-0
              "
              aria-label={
                mobileMenuOpen
                  ? 'Close Navigation Menu'
                  : 'Open Navigation Menu'
              }
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================
          MOBILE FULL SCREEN DRAWER
      ========================================================= */}

      {mobileMenuOpen && (
        <div
          ref={menuRef}
          className="
            lg:hidden
            fixed
            inset-x-0
            top-[68px]
            bottom-0
            bg-[var(--theme-surface)]/98
            backdrop-blur-2xl
            border-b
            border-[var(--theme-border)]
            px-5
            sm:px-6
            py-5
            sm:py-6
            shadow-2xl
            transition-all
            duration-300
            animate-in
            fade-in
            slide-in-from-top-4
            flex
            flex-col
            justify-between
            overflow-y-auto
          "
        >
          {/* Mobile Navigation Links */}
          <div className="flex flex-col gap-1.5">

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
                className="
                  text-lg
                  font-bold
                  text-[var(--theme-text)]
                  hover:text-[var(--theme-accent)]
                  py-3
                  px-3
                  rounded-xl
                  hover:bg-[var(--theme-surface-secondary)]
                  border-b
                  border-[var(--theme-border)]/50
                  transition-colors
                  touch-target
                  justify-start
                "
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Mobile Bottom Actions */}
          <div className="pt-6 pb-4 flex flex-col gap-3">

            {/* Start Project */}
            <a
              href={getWhatsAppUrl(
                "Hi ScaleUp Media, let's start a project!"
              )}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="
                w-full
                inline-flex
                items-center
                justify-center
                gap-2
                py-4
                rounded-2xl
                bg-[var(--theme-primary)]
                text-white
                font-bold
                text-base
                text-center
                shadow-lg
                touch-target
              "
            >
              <MessageCircle className="w-5 h-5" />

              <span>Start a Project →</span>
            </a>

            {/* CMS Dashboard */}
            {isAuthenticated && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="
                  w-full
                  text-center
                  py-3
                  text-xs
                  font-bold
                  text-[var(--theme-text-secondary)]
                  hover:text-[var(--theme-text)]
                  rounded-xl
                  bg-[var(--theme-surface-secondary)]
                  border
                  border-[var(--theme-border)]
                  touch-target
                "
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