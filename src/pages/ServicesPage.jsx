import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SERVICES } from '../data/servicesData';
import SectionTitle from '../components/common/SectionTitle';
import UrgentEventBanner from '../components/common/UrgentEventBanner';
import { updatePageSeo } from '../services/seoService';
import { 
  Building2, Layers, Volume2, Tv, Utensils, QrCode, Users, 
  Camera, Headphones, ShieldCheck, ArrowRight, Sparkles, CheckCircle2
} from 'lucide-react';

const iconMap = {
  Building2,
  Layers,
  Volume2,
  Tv,
  Utensils,
  QrCode,
  Users,
  Camera,
  Headphones,
  ShieldCheck
};

export default function ServicesPage({ onOpenQuoteModal }) {
  useEffect(() => {
    updatePageSeo({
      title: 'Hizmetlerimiz | Sahne, LED, Ses-Işık, Catering ve Teknik Yönetim',
      description: 'Mekân planlama, sahne tasarımı, profesyonel ses ve ışık sistemleri, dev LED ekranlar, simultane tercüme ve kurumsal catering hizmetleri 81 ilde tek merkezden sağlanır.',
      canonicalUrl: 'https://www.toplantimerkezi.com.tr/hizmetler'
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
          <span className="text-amber-800 font-bold">Hizmetlerimiz</span>
        </div>

        <SectionTitle
          badge="Modüler & Entegre Çözümler"
          title="Teknik ve Operasyonel Hizmetlerimiz"
          subtitle="Ayrı ayrı onlarca tedarikçi ile vakit kaybetmeyin; ihtiyacınız olan tüm donanım ve saha hizmetlerini tek sözleşmeyle güvence altına alın."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES.map((srv) => {
            const Icon = iconMap[srv.icon] || Building2;
            return (
              <div
                key={srv.slug}
                id={srv.slug}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md hover:shadow-xl hover:border-amber-400/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm">
                      <Icon size={26} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-700 transition font-display">
                        {srv.title}
                      </h3>
                      <span className="text-xs text-slate-500 font-semibold">81 İlde Yerleşik Altyapı</span>
                    </div>
                  </div>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                    {srv.longDesc}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-2 mb-6">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Hizmet Standartları & Donanım:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {srv.highlights.map((hl, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-700 p-2 rounded-xl bg-slate-50 border border-slate-200">
                          <CheckCircle2 size={14} className="text-amber-600 shrink-0" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <Link
                    to={`/hizmetler/${srv.slug}`}
                    className="text-xs font-bold text-slate-900 hover:text-amber-700 flex items-center gap-1 transition"
                  >
                    <span>Teknik Özellikler</span>
                    <ArrowRight size={14} className="text-amber-600" />
                  </Link>

                  <button
                    onClick={() => onOpenQuoteModal({ initialOrgType: srv.title })}
                    className="px-4 py-2 rounded-xl gold-gradient-bg text-slate-950 font-bold text-xs shadow-xs hover:shadow-md transition flex items-center gap-1"
                  >
                    <Sparkles size={13} />
                    <span>Teklif Al</span>
                  </button>
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
