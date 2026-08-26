import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { HeroSection } from '../sections/HeroSection';
import { RealitySection } from '../sections/RealitySection';
import { ServicesStackSection } from '../sections/ServicesStackSection';
import { WhyScaleUpSection } from '../sections/WhyScaleUpSection';
import { SelectedProjectsSection } from '../sections/SelectedProjectsSection';
import { ClientReviewsSection } from '../sections/ClientReviewsSection';
import { ReviewSubmissionSection } from '../sections/ReviewSubmissionSection';
import { OurProcessSection } from '../sections/OurProcessSection';
import { ScaleUpPromiseSection } from '../sections/ScaleUpPromiseSection';
import { FinalCTASection } from '../sections/FinalCTASection';
import { FounderSection } from '../sections/FounderSection';
import { Footer } from '../components/common/Footer';
import { FloatingWhatsApp } from '../components/common/FloatingWhatsApp';
import { useSettings } from '../context/SettingsContext';

export const HomePage: React.FC = () => {
  const { sections } = useSettings();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Navbar />

      <main className="flex-grow">
        {sections?.hero !== false && <HeroSection />}
        {sections?.reality !== false && <RealitySection />}
        {sections?.services !== false && <ServicesStackSection />}
        {sections?.whyScaleUp !== false && <WhyScaleUpSection />}
        {sections?.projects !== false && <SelectedProjectsSection />}
        {sections?.testimonials !== false && <ClientReviewsSection />}
        {/* Review Submission always shown when testimonials section is on */}
        {sections?.testimonials !== false && <ReviewSubmissionSection />}
        {sections?.process !== false && <OurProcessSection />}
        {sections?.promise !== false && <ScaleUpPromiseSection />}
        {sections?.cta !== false && <FinalCTASection />}
        <FounderSection />
      </main>

      {sections?.footer !== false && <Footer />}
      <FloatingWhatsApp />
    </div>
  );
};
