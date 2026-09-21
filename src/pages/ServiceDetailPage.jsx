import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SERVICES } from '../data/servicesData';
import SectionTitle from '../components/common/SectionTitle';
import UrgentEventBanner from '../components/common/UrgentEventBanner';
import { updatePageSeo } from '../services/seoService';
import { 
  Building2, Layers, Volume2, Tv, Utensils, QrCode, Users, 
  Camera, Headphones, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, Shield
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

export default function ServiceDetailPage({ onOpenQuoteModal }) {
  const { slug } = useParams();
  const service = SERVICES.find(s => s.slug === slug);
  const Icon = service ? (iconMap[service.icon] || Building2) : Building2;

  useEffect(() => {
    if (service) {
      updatePageSeo({
        title: `${service.title}`,
        description: `${service.shortDesc} 81 ilde profesyonel teknik ekipman, uzman operatör ve anahtar teslim kurumsal hizmet.`,
        canonicalUrl: `https://www.toplantimerkezi.com.tr/hizmetler/${service.slug}`,
        breadcrumbs: [
          { name: 'Ana Sayfa', url: '/' },
          { name: 'Hizmetler', url: '/hizmetler' },
          { name: service.title, url: `/hizmetler/${service.slug}` }
        ],
        schemaType: 'Service',
        schemaData: {
          serviceType: service.title,
          name: `${service.title} - Toplantı Merkezi`,
          provider: {
            '@type': 'Organization',
            name: 'Toplantı Merkezi',
            url: 'https://www.toplantimerkezi.com.tr',
            telephone: '+90 532 055 09 45'
          },
          areaServed: {
            '@type': 'Country',
            name: 'Turkey'
          },
          description: service.longDesc || service.shortDesc
        }
      });
      window.scrollTo(0, 0);
    }
  }, [service, slug]);

  if (!service) {
    return (
      <div className="min-h-screen pt-36 pb-20 text-center px-4 bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-900 font-display">Hizmet Bulunamadı</h2>
        <p className="text-sm text-slate-600 mt-2">Aradığınız teknik hizmet sayfası mevcut değil.</p>
        <Link to="/hizmetler" className="mt-6 inline-block px-6 py-3 rounded-xl gold-gradient-bg text-slate-950 font-bold text-xs">
          Tüm Hizmetleri Gör
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-amber-700">Ana Sayfa</Link>
          <span>/</span>
          <Link to="/hizmetler" className="hover:text-amber-700">Hizmetlerimiz</Link>
          <span>/</span>
          <span className="text-amber-800 font-bold">{service.title}</span>
        </div>

        {/* Hero Header */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-md mb-12 flex flex-col md:flex-row items-center gap-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700 shrink-0 shadow-sm">
            <Icon size={44} />
          </div>

          <div className="space-y-3 flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
              <span>81 İlde Kurumsal Teknik Destek</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
              {service.title}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-3xl font-light">
              {service.longDesc}
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => onOpenQuoteModal({ initialOrgType: service.title })}
              className="px-6 py-3.5 rounded-xl gold-gradient-bg text-slate-950 font-extrabold text-sm shadow-md hover:scale-105 transition flex items-center gap-2"
            >
              <Sparkles size={16} />
              <span>Teklif Al</span>
            </button>
          </div>
        </div>

        {/* 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Teknik Donanım ve Hizmet Standartlarımız
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {service.highlights.map((hl, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-amber-600 shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Neden Toplantı Merkezi ile Çalışmalısınız?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tüm teknik ekipmanlarımız periyodik olarak kalibre edilmekte, sahada görev yapan ses, ışık, reji ve sahne teknisyenlerimiz Türkiye'nin en deneyimli kurumsal profesyonellerinden oluşmaktadır. Yedekli sistem mimarimiz ile canlı yayın veya kritik sunumlarda kesinti riskini sıfıra indiriyoruz.
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-400/40 shadow-xl space-y-6 sticky top-28">
              <div className="space-y-2">
                <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">Hemen Fiyat Alın</div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  {service.title} İçin Teklif Alın
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Şehir ve etkinlik tarihinizi belirtin; ihtiyacınıza en uygun donanım ve ekip bütçesini 2 saat içinde iletelim.
                </p>
              </div>

              <button
                onClick={() => onOpenQuoteModal({ initialOrgType: service.title })}
                className="w-full py-3.5 rounded-xl gold-gradient-bg text-slate-950 font-extrabold text-sm shadow-md hover:scale-105 transition flex items-center justify-center gap-2"
              >
                <Sparkles size={16} />
                <span>Teklif Formunu Başlat</span>
              </button>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Diğer Hizmetlerimiz:
                </h4>
                {SERVICES.filter(s => s.slug !== service.slug).slice(0, 5).map(other => (
                  <Link
                    key={other.slug}
                    to={`/hizmetler/${other.slug}`}
                    className="block p-2 rounded-xl text-xs text-slate-600 hover:text-slate-950 hover:bg-slate-50 font-medium transition"
                  >
                    • {other.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      <UrgentEventBanner onOpenQuoteModal={onOpenQuoteModal} />
    </div>
  );
}
