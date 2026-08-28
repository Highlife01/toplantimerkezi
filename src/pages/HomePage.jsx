import React, { useEffect } from 'react';
import Hero from '../components/home/Hero';
import ProcessSteps from '../components/home/ProcessSteps';
import OrganizationGrid from '../components/home/OrganizationGrid';
import ServicesSlider from '../components/home/ServicesSlider';
import TurkeyMapSection from '../components/home/TurkeyMapSection';
import FeaturedVenues from '../components/home/FeaturedVenues';
import WhyUsSection from '../components/home/WhyUsSection';
import UrgentEventBanner from '../components/common/UrgentEventBanner';
import ProjectsShowcase from '../components/home/ProjectsShowcase';
import BlogPreview from '../components/home/BlogPreview';
import { updatePageSeo } from '../services/seoService';

export default function HomePage({ onOpenQuoteModal }) {
  useEffect(() => {
    updatePageSeo({
      title: "Türkiye'nin Her Yerinde Kurumsal Organizasyon Çözümleri",
      description: "Bayi toplantılarından şirket organizasyonlarına, kamu toplantılarından kurumsal pikniklere kadar tüm süreci profesyonel ekibimizle planlıyor, koordine ediyor ve yönetiyoruz. 81 ilde tek merkezden kurumsal hizmet.",
      canonicalUrl: "https://www.toplantimerkezi.com.tr/",
      schemaJson: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Toplantı Merkezi",
        "url": "https://www.toplantimerkezi.com.tr",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.toplantimerkezi.com.tr/mekanlar?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    });
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full">
      <Hero onOpenQuoteModal={onOpenQuoteModal} />
      <ProcessSteps onOpenQuoteModal={onOpenQuoteModal} />
      <OrganizationGrid onOpenQuoteModal={onOpenQuoteModal} />
      <ServicesSlider />
      <TurkeyMapSection onOpenQuoteModal={onOpenQuoteModal} />
      <FeaturedVenues onOpenQuoteModal={onOpenQuoteModal} />
      <WhyUsSection onOpenQuoteModal={onOpenQuoteModal} />
      <UrgentEventBanner onOpenQuoteModal={onOpenQuoteModal} />
      <ProjectsShowcase onOpenQuoteModal={onOpenQuoteModal} />
      <BlogPreview />
    </div>
  );
}
