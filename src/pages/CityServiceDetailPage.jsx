import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ALL_81_CITIES, PROMINENT_CITIES, getCityGeo } from '../data/citiesData';
import { ORGANIZATIONS } from '../data/organizationsData';
import { SERVICES } from '../data/servicesData';
import { SEO_CLUSTERS } from '../data/seoClustersData';
import SectionTitle from '../components/common/SectionTitle';
import UrgentEventBanner from '../components/common/UrgentEventBanner';
import { updatePageSeo } from '../services/seoService';
import { 
  MapPin, Building, Users, CheckCircle2, ArrowRight, 
  Sparkles, Phone, ShieldCheck, Bot, HelpCircle, ChevronDown, ChevronUp, Layers
} from 'lucide-react';

export default function CityServiceDetailPage({ onOpenQuoteModal }) {
  const { sehirSlug, hizmetSlug } = useParams();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const city = PROMINENT_CITIES.find(c => c.slug === sehirSlug) || 
               ALL_81_CITIES.find(c => c.slug === sehirSlug);

  const cityGeo = city ? getCityGeo(city.slug) : null;

  // Flexible Multi-Entity Resolution: Organizations, Services, or SEO Clusters
  let entity = null;

  if (hizmetSlug) {
    // 1. Try ORGANIZATIONS
    const org = ORGANIZATIONS.find(o => o.slug === hizmetSlug);
    if (org) {
      entity = {
        title: org.title,
        slug: org.slug,
        type: 'organization',
        heroImage: org.heroImage,
        shortDesc: org.shortDesc,
        overview: org.overview,
        subServices: org.subServices.map(s => ({ name: s.name, desc: s.desc })),
        faqs: org.faqs
      };
    } else {
      // 2. Try SERVICES (Technical modules)
      const service = SERVICES.find(s => s.slug === hizmetSlug);
      if (service) {
        entity = {
          title: service.title,
          slug: service.slug,
          type: 'service',
          heroImage: service.image,
          shortDesc: service.shortDesc,
          overview: `${city ? city.name : ''} ilinde ${service.title.toLowerCase()} gereksinimleriniz için profesyonel ekipman parkurumuz, uzman ses/görüntü teknisyenlerimiz ve anahtar teslim kurulumumuzla hizmet veriyoruz.`,
          subServices: service.details.map(d => ({ name: d, desc: `${city ? city.name : ''} bölgesinde eksiksiz teknik uygulama.` })),
          faqs: null
        };
      } else {
        // 3. Try SEO_CLUSTERS
        for (const cluster of SEO_CLUSTERS) {
          const page = cluster.pages.find(p => p.slug === hizmetSlug);
          if (page) {
            entity = {
              title: page.title,
              slug: page.slug,
              type: 'cluster',
              heroImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80',
              shortDesc: page.metaDesc,
              overview: page.aiDirectAnswer,
              subServices: (page.subTypes || []).map(st => ({ name: st, desc: `${city ? city.name : ''} için uçtan uca kurumsal organizasyon planlaması.` })),
              faqs: page.faqs
            };
            break;
          }
        }
      }
    }
  }

  const pageFaqs = city && entity ? (entity.faqs || [
    {
      q: `${city.name} ilinde ${entity.title.toLowerCase()} için salon ve mekân seçimi nasıl yapılır?`,
      a: `${city.name} bölgesinde ${entity.title.toLowerCase()} düzenlenirken katılımcı sayısı, tavan yüksekliği, teknik reji gereksinimleri ve ulaşım kolaylığı gözetilerek 5 yıldızlı oteller ve kongre salonları arasından en uygun 3 opsiyon sunulur.`
    },
    {
      q: `${city.name} ${entity.title.toLowerCase()} operasyonunda teknik ekipman kim tarafından kurulur?`,
      a: `Toplantı Merkezi'nin ${city.name} ve çevre illerde konuşlu teknik reji ekipleri etkinlikten saatler önce tüm sahne, ses, ışık ve görüntü sistemlerini kurarak prova almaktadır.`
    },
    {
      q: `${city.name} ${entity.title.toLowerCase()} bütçe teklifi ne kadar sürede iletilir?`,
      a: `İhtiyaç detaylarınızı ve kişi sayınızı bildirdikten sonra 2 saat içinde ${city.name} operasyon masamız resmi ve şeffaf kalem maliyet dosyanızı iletir.`
    }
  ]) : [];

  const aiDirectAnswer = city && entity 
    ? `${city.name} ${entity.title.toLowerCase()} organizasyonu; bölgedeki 5 yıldızlı oteller, kongre salonları ve açık alanlarda katılımcı kayıt, 3D sahne tasarımı, profesyonel ses-ışık sistemleri, dev LED ekran prodüksiyonu, VIP karşılama ve catering süreçlerinin tek merkezden yönetilmesidir. Toplantı Merkezi, ${city.name} ilinde tek sözleşme ve sıfır bütçe sapması garantisiyle anahtar teslim kurumsal çözümler sunar.`
    : '';

  useEffect(() => {
    if (city && entity) {
      updatePageSeo({
        title: `${city.name} ${entity.title}`,
        description: `${city.name} ilinde profesyonel ${entity.title.toLowerCase()}. Mekân seçimi, sahne, LED ekran, ses-ışık ve catering hizmetleri tek merkezden yönetilir. 81 ilde kurumsal operasyon güvencesi.`,
        canonicalUrl: `https://www.toplantimerkezi.com.tr/sehirler/${city.slug}/${entity.slug}`,
        geo: cityGeo,
        breadcrumbs: [
          { name: 'Ana Sayfa', url: '/' },
          { name: 'Şehirler', url: '/sehirler' },
          { name: city.name, url: `/sehirler/${city.slug}` },
          { name: entity.title, url: `/sehirler/${city.slug}/${entity.slug}` }
        ],
        faqs: pageFaqs,
        schemaType: 'Service',
        schemaData: {
          serviceType: `${city.name} ${entity.title}`,
          name: `${city.name} ${entity.title} - Toplantı Merkezi`,
          provider: {
            '@type': 'Organization',
            name: 'Toplantı Merkezi',
            url: 'https://www.toplantimerkezi.com.tr',
            telephone: '+90 850 308 00 00'
          },
          areaServed: {
            '@type': 'AdministrativeArea',
            name: `${city.name}, Türkiye`,
            geo: cityGeo ? {
              '@type': 'GeoCoordinates',
              latitude: cityGeo.lat,
              longitude: cityGeo.lng
            } : undefined
          },
          description: aiDirectAnswer
        }
      });
      window.scrollTo(0, 0);
    }
  }, [city, entity, sehirSlug, hizmetSlug, cityGeo]);

  if (!city || !entity) {
    return (
      <div className="min-h-screen pt-36 pb-20 text-center px-4 bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-900 font-display">Sayfa Bulunamadı</h2>
        <p className="text-sm text-slate-600 mt-2">Aradığınız şehir ve organizasyon kombinasyonu bulunamadı.</p>
        <Link to="/sehirler" className="mt-6 inline-block px-6 py-3 rounded-xl gold-gradient-bg text-slate-950 font-bold text-xs">
          Şehirlere Dön
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
          <Link to="/sehirler" className="hover:text-amber-700">Şehirler</Link>
          <span>/</span>
          <Link to={`/sehirler/${city.slug}`} className="hover:text-amber-700">{city.name}</Link>
          <span>/</span>
          <span className="text-amber-800 font-bold">{entity.title}</span>
        </div>

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden min-h-[380px] flex items-end p-6 sm:p-10 md:p-12 mb-8 shadow-xl border border-slate-200">
          <img
            src={entity.heroImage}
            alt={`${city.name} ${entity.title}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-400/40 text-amber-400 text-xs font-bold shadow-md">
              <MapPin size={13} />
              <span>{city.name} Yerel Operasyon Gücü</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-display">
              {city.name} {entity.title} Organizasyonu
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light">
              {city.name} ilindeki tüm oteller, kongre salonları ve açık alanlarda {entity.title.toLowerCase()} süreçlerinizi tek merkezden profesyonelce koordine ediyoruz.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenQuoteModal({ initialOrgType: entity.title, initialCity: city.name })}
                className="px-6 py-3 rounded-xl gold-gradient-bg text-slate-950 font-extrabold text-xs sm:text-sm shadow-md hover:scale-105 transition flex items-center gap-2"
              >
                <Sparkles size={16} />
                <span>{city.name} {entity.title} Teklifi Al</span>
              </button>
            </div>
          </div>
        </div>

        {/* Generative Engine Optimization (GEO) AI Direct Answer Card */}
        <div 
          data-geo-answer="true"
          className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-300 shadow-md mb-12 relative overflow-hidden"
        >
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-100/60 rounded-full blur-2xl pointer-events-none"></div>
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
                  {city.name} • {entity.title}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {aiDirectAnswer}
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          <div className="lg:col-span-8 space-y-10">
            
            {/* Services included */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                {city.name} {entity.title} İçin Neler Sağlıyoruz?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {city.name} bölgesinde düzenleyeceğiniz {entity.title.toLowerCase()} için tüm teknik ve saha modülleri anahtar teslim hazırlanır:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {entity.subServices.map((sub, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <CheckCircle2 size={16} className="text-amber-600 shrink-0" />
                      <span>{sub.name}</span>
                    </div>
                    <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                      {sub.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Toplanti Merkezi in this City */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
              <h2 className="text-xl font-bold text-slate-900 font-display">
                {city.name} İlinde Neden Tek Merkezden Yönetim?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Farklı şehirlerde organizasyon düzenleyen kurumsal şirketlerin karşılaştığı en büyük sorun, yerel tedarikçilerin koordinasyonsuzluğu ve bütçe sapmalarıdır. Toplantı Merkezi olarak {city.name} ilindeki yerleşik teknik ortaklarımız ve saha denetçilerimiz ile kurumsal riskleri sıfıra indiriyoruz.
              </p>
            </div>

            {/* Localized FAQ Section */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
                <HelpCircle size={16} />
                <span>{city.name} {entity.title} SSS</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Sıkça Sorulan Sorular
              </h2>

              <div className="space-y-3 pt-2">
                {pageFaqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div 
                      key={index}
                      className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-slate-50"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
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

            {/* Other Organizations in this City */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
              <h3 className="text-base font-bold text-slate-900 font-display">
                {city.name} İlindeki Diğer Kurumsal Çözümler:
              </h3>
              <div className="flex flex-wrap gap-2">
                {ORGANIZATIONS.filter(o => o.slug !== entity.slug).map(otherOrg => (
                  <Link
                    key={otherOrg.slug}
                    to={`/sehirler/${city.slug}/${otherOrg.slug}`}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 text-xs font-semibold transition"
                  >
                    {city.name} {otherOrg.title}
                  </Link>
                ))}
              </div>
            </div>

          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-400/40 shadow-xl space-y-6 sticky top-28">
              <div className="space-y-2">
                <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">Hızlı Bütçe Çalışması</div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  {city.name} {entity.title} Fiyat Teklifi
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Katılımcı sayınızı ve tercih ettiğiniz tarihi girin; size özel maliyetlendirilmiş kurumsal teklif dosyanızı 2 saatte iletelim.
                </p>
              </div>

              <div className="space-y-2 p-3.5 rounded-xl bg-amber-50 text-xs text-slate-700 border border-amber-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                  <span>2 Saatte Resmi PDF Teklif</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                  <span>3D Salon Simülasyonu</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                  <span>Yerleşik Ekip ile Sıfır Bütçe Sapması</span>
                </div>
              </div>

              <button
                onClick={() => onOpenQuoteModal({ initialOrgType: entity.title, initialCity: city.name })}
                className="w-full py-4 rounded-2xl gold-gradient-bg text-slate-950 font-extrabold text-sm shadow-md hover:scale-105 transition flex items-center justify-center gap-2"
              >
                <Sparkles size={16} />
                <span>Teklif Formunu Doldur</span>
              </button>

              <div className="pt-3 border-t border-slate-100 text-center">
                <Link
                  to={`/sehirler/${city.slug}`}
                  className="text-xs text-slate-500 hover:text-amber-800 font-semibold"
                >
                  ← {city.name} Şehir Rehberine Dön
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>

      <UrgentEventBanner onOpenQuoteModal={onOpenQuoteModal} />
    </div>
  );
}
