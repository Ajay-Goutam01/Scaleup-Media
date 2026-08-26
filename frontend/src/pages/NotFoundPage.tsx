import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--theme-bg)] flex flex-col justify-between text-[var(--theme-text)]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-32 px-4 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-[var(--theme-surface-secondary)] text-[var(--theme-accent)] border border-[var(--theme-border)] flex items-center justify-center mx-auto shadow-xl">
            <Compass className="w-8 h-8" />
          </div>

          <h1 className="text-6xl font-black text-[var(--theme-text)] font-display">404</h1>
          <h2 className="text-2xl font-bold text-[var(--theme-text)] font-display">Page Not Found</h2>
          <p className="text-sm text-[var(--theme-text-secondary)] leading-relaxed">
            The page you are trying to reach does not exist or has been relocated in our digital architecture.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--theme-primary)] text-white text-sm font-bold shadow-lg hover:opacity-90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};
