import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { INDUSTRIES } from '../data/industryData';
import SectionTitle from '../components/common/SectionTitle';
import UrgentEventBanner from '../components/common/UrgentEventBanner';
import { updatePageSeo } from '../services/seoService';
import { 
  Building2, CheckCircle2, ArrowRight, Sparkles, 
  MapPin, Users, Award, ShieldCheck, Factory, 
  Car, Activity, Landmark, Cpu, Layers, Bot, HelpCircle, ChevronDown, ChevronUp
} from 'lucide-react';

export default function IndustryDetailPage({ onOpenQuoteModal }) {
  const { slug } = useParams();
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const industry = INDUSTRIES.find(i => i.slug === slug) || INDUSTRIES[0];

  const aiDirectAnswer = `${industry.title} organizasyon çözümleri; ${industry.targetAudience.toLowerCase()} kitlesine yönelik ${industry.subtitle.toLowerCase()} süreçlerinin sektörel teknik kriterlere tam uyumlu şekilde yönetilmesidir. Toplantı Merkezi; ${industry.recommendedDestinations.join(', ')} başta olmak üzere 81 ilde ${industry.features.map(f => f.title.toLowerCase()).join(', ')} modüllerini tek sözleşme ve sıfır operasyonel riskle anahtar teslim hayata geçirir.`;

  const industryFaqs = [
    {
      q: `${industry.title} organizasyonlarında hangi özel teknik kriterler sağlanıyor?`,
      a: `${industry.title} etkinliklerinde ${(industry.keyNeeds || []).join('; ')} gibi kritik sektörel standartlar Toplantı Merkezi saha mühendisleri tarafından eksiksiz projelendirilir.`
    },
    {
      q: `${industry.title} için hangi şehir ve mekânlar önerilmektedir?`,
      a: `Katılımcı profili (${industry.targetAudience}) ve lojistik erişim dikkate alındığında ${industry.recommendedDestinations.join(', ')} destinasyonlarındaki 5 yıldızlı kongre otelleri ve ihtisas merkezleri öncelikli olarak önerilmektedir.`
    },
    {
      q: `${industry.title} etkinlik teklifi ne kadar sürede hazırlanır?`,
      a: `Etkinlik tarihi, tahmini katılımcı sayısı ve teknik beklentilerinizi iletmenizin ardından 2 saat içinde sektöre özel 3 alternatif mekân ve kalem bazlı resmi bütçe tablosu sunulur.`
    }
  ];

  useEffect(() => {
    updatePageSeo({
      title: industry.seoTitle,
      description: industry.metaDesc,
      canonicalUrl: `https://www.toplantimerkezi.com.tr/sektorler/${industry.slug}`,
      ogImage: industry.bannerImage,
      ogImageAlt: industry.title,
      breadcrumbs: [
        { name: 'Ana Sayfa', url: '/' },
        { name: 'Sektörler', url: '/sektorler/otomotiv-ve-mobilite' },
        { name: industry.title, url: `/sektorler/${industry.slug}` }
      ],
      faqs: industryFaqs,
      schemaType: 'Service',
      schemaData: {
        serviceType: `${industry.title} Organizasyon Çözümleri`,
        name: `${industry.title} - Toplantı Merkezi`,
        provider: {
          '@type': 'Organization',
          name: 'Toplantı Merkezi',
          url: 'https://www.toplantimerkezi.com.tr',
          telephone: '+90 532 055 09 45'
        },
        description: aiDirectAnswer,
        areaServed: {
          '@type': 'Country',
          name: 'Turkey'
        }
      }
    });
    window.scrollTo(0, 0);
  }, [industry, slug]);

  return (
    <div className="pt-28 pb-20 bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-amber-800 font-medium">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-slate-400">Sektörel Çözümler</span>
          <span>/</span>
          <span className="text-amber-900 font-bold">{industry.title}</span>
        </div>

        {/* Hero Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 md:p-16 border border-slate-200 shadow-xl mb-8 relative overflow-hidden">
          <div className="max-w-3xl space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-950 text-xs font-bold shadow-2xs">
              <Sparkles size={14} className="text-amber-700" />
              <span>Sektöre Özel B2B Standartları</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-950 font-display leading-[1.15]">
              {industry.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
              {industry.subtitle}
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              {industry.metaDesc}
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onOpenQuoteModal({ initialOrgType: industry.title })}
                className="px-7 py-4 rounded-2xl gold-gradient-bg text-slate-950 font-extrabold text-sm sm:text-base shadow-md hover:scale-105 transition flex items-center gap-2"
              >
                <Sparkles size={18} />
                <span>Sektörel Teklif Alın</span>
                <ArrowRight size={18} />
              </button>

              <div className="text-xs text-slate-700 font-bold bg-slate-100 px-4 py-3 rounded-xl border border-slate-200">
                Hedef Kitle: {industry.targetAudience}
              </div>
            </div>
          </div>
        </div>

        {/* GEO AI Direct Answer Card */}
        <div
          data-geo-answer="true"
          className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-300 shadow-md mb-12 relative overflow-hidden"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl gold-gradient-bg flex items-center justify-center shrink-0 shadow-sm text-slate-950">
              <Bot size={20} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
                  Yapay Zekâ ve Arama Motoru Doğrudan Yanıtı (AI Summary)
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                  Sektörel MICE Standartları
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {aiDirectAnswer}
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          <div className="lg:col-span-8 space-y-8">
            
            {/* Sektörel Kritik İhtiyaçlar */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
              <h2 className="text-xl font-bold text-slate-950 font-display">
                {industry.title} İçin Kritik Operasyonel Kriterler
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Her sektörün toplantı ve etkinlik ihtiyaçları farklıdır. Toplantı Merkezi olarak teknik ve lojistik altyapımızı sektörünüzün hassasiyetlerine göre yapılandırıyoruz:
              </p>
              <div className="space-y-3 pt-2">
                {industry.keyNeeds.map((need, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-amber-700 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">{need}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Özellikler Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {industry.features.map((feat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <h3 className="text-base font-bold text-slate-950 font-display">{feat.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>

            {/* Sector FAQs */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
                <HelpCircle size={16} />
                <span>{industry.title} Sıkça Sorulan Sorular</span>
              </div>
              <h2 className="text-xl font-bold text-slate-950 font-display">
                Sektörel Organizasyon Süreci Hakkında Merak Edilenler
              </h2>
              <div className="space-y-3">
                {industryFaqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 hover:text-amber-800 transition"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp size={18} className="text-amber-700 shrink-0" />
                        ) : (
                          <ChevronDown size={18} className="text-slate-400 shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-amber-500/60 shadow-xl space-y-6 sticky top-28">
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider block">Önerilen Destinasyonlar</span>
                <h3 className="text-lg font-bold text-slate-950 font-display">
                  {industry.title} İçin En İdeal Şehirler
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                {industry.recommendedDestinations.map((dest, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-800 flex items-center gap-2">
                    <MapPin size={15} className="text-amber-700 shrink-0" />
                    <span>{dest}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onOpenQuoteModal({ initialOrgType: industry.title })}
                className="w-full py-4 rounded-2xl gold-gradient-bg text-slate-950 font-extrabold text-sm shadow-md hover:scale-105 transition flex items-center justify-center gap-2"
              >
                <Sparkles size={18} />
                <span>Teklif Talebini Başlat</span>
              </button>

              {/* Other Industries */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Diğer Sektörler:
                </h4>
                <div className="space-y-1">
                  {INDUSTRIES.filter(ind => ind.slug !== industry.slug).map(ind => (
                    <Link
                      key={ind.slug}
                      to={`/sektorler/${ind.slug}`}
                      className="block p-2 rounded-xl text-xs text-slate-700 hover:text-amber-900 hover:bg-amber-50 font-medium transition"
                    >
                      • {ind.title}
                    </Link>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      <UrgentEventBanner onOpenQuoteModal={onOpenQuoteModal} />
    </div>
  );
}
