import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ORGANIZATIONS } from '../data/organizationsData';
import SectionTitle from '../components/common/SectionTitle';
import UrgentEventBanner from '../components/common/UrgentEventBanner';
import { updatePageSeo } from '../services/seoService';
import { ArrowRight, CheckCircle2, Sparkles, Building2 } from 'lucide-react';

export default function OrganizationsPage({ onOpenQuoteModal }) {
  useEffect(() => {
    updatePageSeo({
      title: 'Kurumsal Organizasyonlar | B2B Etkinlik ve Toplantı Çözümleri',
      description: 'Bayi toplantısı, kongre, konferans, kurumsal piknik, lansman, gala gecesi ve personel etkinlikleri için Türkiye genelinde anahtar teslim B2B organizasyon yönetimi.',
      canonicalUrl: 'https://www.toplantimerkezi.com.tr/organizasyonlar'
    });
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-28 pb-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-8">
          <Link to="/" className="hover:text-amber-700">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-amber-800 font-bold">Kurumsal Organizasyonlar</span>
        </div>

        <SectionTitle
          badge="B2B & Kurumsal Faaliyet Alanları"
          title="Kurumsal Organizasyon Hizmetlerimiz"
          subtitle="Şirketlerin, holdinglerin, kamu kurumlarının ve markaların tüm toplantı ve etkinlik ihtiyaçlarını profesyonelce planlıyor ve yönetiyoruz."
        />

        <div className="space-y-12">
          {ORGANIZATIONS.map((org, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={org.slug}
                id={org.slug}
                className={`bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200 shadow-md hover:shadow-xl hover:border-amber-400/50 transition-all flex flex-col lg:flex-row gap-8 items-center ${
                  isEven ? '' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Image Section */}
                <div className="w-full lg:w-1/2 relative rounded-2xl overflow-hidden min-h-[300px] lg:min-h-[380px] shadow-lg">
                  <img
                    src={org.heroImage}
                    alt={org.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  
                  {org.badge && (
                    <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-slate-900/90 border border-amber-400/40 text-amber-400 text-xs font-bold shadow-md">
                      {org.badge}
                    </div>
                  )}

                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                      {org.idealFor}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                      {org.title}
                    </h3>
                  </div>
                </div>

                {/* Content Section */}
                <div className="w-full lg:w-1/2 flex flex-col justify-between space-y-6">
                  <div>
                    <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                      {org.longDesc}
                    </p>

                    {/* Sub-services */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Kapsamdaki Operasyonel Hizmetler:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {org.subServices.map((sub, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-700 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                            <CheckCircle2 size={15} className="text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-slate-900 block font-bold">{sub.name}</strong>
                              <span className="text-slate-500">{sub.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <Link
                      to={`/organizasyonlar/${org.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 hover:text-amber-700 transition"
                    >
                      <span>Organizasyon Rehberi & SSS</span>
                      <ArrowRight size={16} className="text-amber-600" />
                    </Link>

                    <button
                      onClick={() => onOpenQuoteModal({ initialOrgType: org.title })}
                      className="px-6 py-3 rounded-xl gold-gradient-bg text-slate-950 font-extrabold text-xs sm:text-sm shadow-md hover:scale-105 transition flex items-center gap-1.5"
                    >
                      <Sparkles size={15} />
                      <span>Bu Organizasyon İçin Teklif Al</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

      <div className="mt-20">
        <UrgentEventBanner onOpenQuoteModal={onOpenQuoteModal} />
      </div>
    </div>
  );
}
