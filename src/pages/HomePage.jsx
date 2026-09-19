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
import DestinationCompareSection from '../components/home/DestinationCompareSection';
import BudgetCalculatorSection from '../components/home/BudgetCalculatorSection';
import { updatePageSeo } from '../services/seoService';

export default function HomePage({ onOpenQuoteModal }) {
  useEffect(() => {
    const homeFaqs = [
      {
        q: 'Toplantı Merkezi hangi kurumsal organizasyon türlerinde hizmet vermektedir?',
        a: 'Toplantı Merkezi; B2B bayi toplantısı, şirket toplantısı, kongre ve konferans, kurumsal piknik, lansman ve kamu protokol organizasyonlarını tek merkezden, anahtar teslim olarak 81 ilde yönetir.'
      },
      {
        q: 'Kurumsal organizasyon için ne kadar sürede bütçe teklifi alabilirim?',
        a: 'Platformumuz üzerinden talebinizi ilettikten sonra 2 saat içinde detaylı salon alternatifleri, 3D sahne tasarımı ve kalem maliyet dökümünü içeren resmi PDF teklif dosyanız iletilir.'
      },
      {
        q: 'Türkiye\'nin 81 ilinde yerel operasyon garantiniz var mı?',
        a: 'Evet. İstanbul, Ankara, İzmir, Antalya, Adana, Bursa başta olmak üzere 81 ilin tamamında yerleşik teknik ortaklarımız, bölge yöneticilerimiz ve anlaşmalı kongre otellerimizle hizmet sunuyoruz.'
      },
      {
        q: 'Düğün veya bireysel etkinlik organize ediyor musunuz?',
        a: 'Hayır. Toplantı Merkezi yalnızca kurumsal şirketler, holdingler, yetkili satıcı ağları ve kamu kurumlarına yönelik B2B organizasyonlar düzenler.'
      }
    ];

    updatePageSeo({
      title: "Türkiye'nin Her Yerinde Kurumsal Organizasyon Çözümleri",
      description: "Bayi toplantılarından şirket organizasyonlarına, kamu toplantılarından kurumsal pikniklere kadar tüm süreci profesyonel ekibimizle planlıyor, koordine ediyor ve yönetiyoruz. 81 ilde tek merkezden kurumsal hizmet.",
      canonicalUrl: "https://www.toplantimerkezi.com.tr/",
      faqs: homeFaqs,
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
      <BudgetCalculatorSection onOpenQuoteModal={onOpenQuoteModal} />
      <TurkeyMapSection onOpenQuoteModal={onOpenQuoteModal} />
      <DestinationCompareSection onOpenQuoteModal={onOpenQuoteModal} />
      <FeaturedVenues onOpenQuoteModal={onOpenQuoteModal} />
      <WhyUsSection onOpenQuoteModal={onOpenQuoteModal} />
      <UrgentEventBanner onOpenQuoteModal={onOpenQuoteModal} />
      <ProjectsShowcase onOpenQuoteModal={onOpenQuoteModal} />
      <BlogPreview />
    </div>
  );
}
