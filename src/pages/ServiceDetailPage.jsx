import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SERVICES } from '../data/servicesData';
import { PROMINENT_CITIES } from '../data/citiesData';
import SectionTitle from '../components/common/SectionTitle';
import UrgentEventBanner from '../components/common/UrgentEventBanner';
import { updatePageSeo } from '../services/seoService';
import { 
  Building2, Layers, Volume2, Tv, Utensils, QrCode, Users, 
  Camera, Headphones, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, Shield,
  Bot, HelpCircle, ChevronDown, ChevronUp, MapPin
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
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const service = SERVICES.find(s => s.slug === slug);
  const Icon = service ? (iconMap[service.icon] || Building2) : Building2;

  const aiDirectAnswer = service
    ? `${service.title} hizmeti; kurumsal toplantı, bayi zirvesi, kongre, lansman ve resmi protokol organizasyonlarında ${service.shortDesc.toLowerCase()} Toplantı Merkezi, Türkiye'nin 81 ilinde yerleşik ekipman parkuru, yedekli reji altyapısı ve sertifikalı teknik operatör kadrosuyla ${(service.details || []).slice(0, 3).join(', ').toLowerCase()} çözümlerini tek sözleşme altında anahtar teslim sunar.`
    : '';

  const serviceFaqs = service ? [
    {
      q: `${service.title} hizmeti Türkiye'nin 81 ilinde nasıl sağlanıyor?`,
      a: `Toplantı Merkezi'nin İstanbul, Ankara, İzmir, Antalya ve Adana başta olmak üzere 81 ildeki yerleşik teknik depoları ve yerel operasyon ekipleri sayesinde ekstra nakliye maliyeti oluşmadan kurumsal standartta ${service.title.toLowerCase()} hizmeti verilir.`
    },
    {
      q: `${service.title} kapsamında hangi donanım ve standartlar yer alıyor?`,
      a: `Bu hizmet modülümüzde ${(service.details || []).join(', ')} standart olarak yer almakta olup katılımcı sayısına ve salon mimarisine göre özel projelendirilmektedir.`
    },
    {
      q: `Etkinlik sırasında teknik arıza veya kesinti riskine karşı nasıl önlem alınıyor?`,
      a: `Kritik kurumsal toplantı ve canlı yayınlarda tüm ses, görüntü, reji ve enerji altyapımız yedekli (redundant) olarak kurulur. Etkinlik boyunca kıdemli teknik süpervizörlerimiz reji masasında görev başındadır.`
    },
    {
      q: `${service.title} için fiyat teklifi ne kadar sürede hazırlanır?`,
      a: `Etkinlik şehri, tarihi ve katılımcı sayınızı iletmenizin ardından 2 saat içinde detaylı teknik ekipman listesi (rider) ve kalem bazlı resmi bütçe teklifiniz tarafınıza sunulur.`
    }
  ] : [];

  useEffect(() => {
    if (service) {
      updatePageSeo({
        title: `${service.title} | 81 İlde Kurumsal Teknik Hizmetler`,
        description: `${service.shortDesc} 81 ilde profesyonel teknik ekipman, uzman operatör ve anahtar teslim kurumsal hizmet.`,
        canonicalUrl: `https://www.toplantimerkezi.com.tr/hizmetler/${service.slug}`,
        ogImage: service.image,
        ogImageAlt: `${service.title} - Toplantı Merkezi`,
        breadcrumbs: [
          { name: 'Ana Sayfa', url: '/' },
          { name: 'Hizmetler', url: '/hizmetler' },
          { name: service.title, url: `/hizmetler/${service.slug}` }
        ],
        faqs: serviceFaqs,
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
          description: aiDirectAnswer
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
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-md mb-8 flex flex-col md:flex-row items-center gap-8">
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
              {service.shortDesc}
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

        {/* Generative Engine Optimization (GEO) AI Direct Answer Block */}
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
                  Teknik Modül Özeti
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
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Teknik Donanım ve Hizmet Standartlarımız
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {(service.details || []).map((hl, i) => (
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

            {/* City Links for this Service */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
                  <MapPin size={20} className="text-amber-700" />
                  <span>81 İlde Yerel {service.title} Operasyonu</span>
                </h2>
                <Link to="/sehirler" className="text-xs font-bold text-amber-800 hover:underline">
                  Tüm 81 İli Gör →
                </Link>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bölgesel ekipman depolarımızla öne çıkan MICE ve kongre şehirlerimizde {service.title.toLowerCase()} çözümleri:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                {PROMINENT_CITIES.slice(0, 9).map(city => (
                  <Link
                    key={city.slug}
                    to={`/sehirler/${city.slug}/${service.slug}`}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-xs font-bold text-slate-800 hover:text-amber-900 transition flex items-center justify-between group"
                  >
                    <span className="truncate">{city.name} {service.title}</span>
                    <ArrowRight size={12} className="text-slate-400 group-hover:text-amber-700 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
                <HelpCircle size={16} />
                <span>{service.title} Sıkça Sorulan Sorular</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Teknik Süreç ve Merak Edilenler
              </h2>
              <div className="space-y-3">
                {serviceFaqs.map((faq, idx) => {
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
