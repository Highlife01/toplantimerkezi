import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ALL_81_CITIES, PROMINENT_CITIES, getCityGeo } from '../data/citiesData';
import { ORGANIZATIONS } from '../data/organizationsData';
import { SERVICES } from '../data/servicesData';
import { VENUES } from '../data/venuesData';
import SectionTitle from '../components/common/SectionTitle';
import UrgentEventBanner from '../components/common/UrgentEventBanner';
import { updatePageSeo } from '../services/seoService';
import { 
  MapPin, Building, Plane, Users, CheckCircle2, 
  ArrowRight, Sparkles, Phone, MessageSquare, Star, ShieldCheck,
  Bot, HelpCircle, ChevronDown, ChevronUp, Layers, Calendar
} from 'lucide-react';

export default function CityDetailPage({ onOpenQuoteModal }) {
  const { sehirSlug } = useParams();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  
  // Find in prominent or all cities
  const city = PROMINENT_CITIES.find(c => c.slug === sehirSlug) || 
               ALL_81_CITIES.find(c => c.slug === sehirSlug);

  const cityGeo = city ? getCityGeo(city.slug) : null;

  const cityVenues = VENUES.filter(v => 
    city && v.city.toLowerCase() === city.name.toLowerCase()
  );

  const cityFaqs = city ? [
    {
      q: `${city.name} genelinde bayi ve şirket toplantısı için en uygun salon nasıl seçilir?`,
      a: `${city.name} ilinde toplantı salonu belirlenirken katılımcı sayısı, tavan yüksekliği (en az 4.5m), kolonsuz salon mimarisi, havalimanı ve otoyol transfer süreleri analiz edilir. Toplantı Merkezi, ${city.name} bölgesindeki 5 yıldızlı oteller ve kongre merkezleri arasından bütçenize en uygun 3 alternatif salonu 2 saat içinde detaylı olarak sunar.`
    },
    {
      q: `${city.name} organizasyonlarında sahne, LED ekran ve ses-ışık tedariki nasıl yapılır?`,
      a: `Toplantı Merkezi'nin ${city.name} ve çevre illerdeki yerleşik teknik depoları ve reji ekipleri sayesinde, şehirlerarası ekstra nakliye maliyeti oluşmadan yüksek çözünürlüklü LED ekranlar, line-array ses sistemleri ve özel 3D sahne tasarımları anahtar teslim kurulur.`
    },
    {
      q: `${city.name} dışından gelecek misafirlerin havalimanı ve VIP transferi yönetiliyor mu?`,
      a: `Evet. ${city.transport ? city.transport.split('.')[0] : city.name + ' havalimanı ve istasyon'} karşılama noktalarında görevli profesyonel hostes kadromuz ve VIP transfer filomuz ile konuklarınız karşılanır ve doğrudan otel/kongre merkezine ulaştırılır.`
    },
    {
      q: `${city.name} kurumsal organizasyonu için resmi teklif süreci ne kadar sürer?`,
      a: `Web sitemizdeki hızlı teklif formundan veya 0850 308 00 00 çağrı merkezimizden talebinizi iletmenizin ardından, ${city.name} operasyon masamız 2 saat içinde detaylı kalem maliyet tablosu ve 3D yerleşim planını içeren resmi kurumsal teklif dosyasını iletir.`
    }
  ] : [];

  const aiDirectAnswer = city ? `${city.name} kurumsal organizasyon ve toplantı yönetimi; bölgedeki 5 yıldızlı kongre otelleri, balo salonları ve etkinlik alanlarında bayi toplantısı, şirket vizyon oturumları, kongre, seminer ve kurumsal pikniklerin uçtan uca koordine edilmesidir. Toplantı Merkezi; salon tahsisinden 3D sahne tasarımına, dev LED ekranlardan ses-ışık sistemlerine, simultane tercümeden havalimanı VIP transferine kadar tüm süreci ${city.name} ilinde tek sözleşme ve yerel operasyon gücüyle anahtar teslim yönetir.` : '';

  useEffect(() => {
    if (city) {
      updatePageSeo({
        title: `${city.name} Toplantı ve Organizasyon Şirketi`,
        description: `${city.name} genelinde bayi toplantısı, kongre, seminer, kurumsal piknik ve şirket etkinlikleri için profesyonel sahne, teknik ekipman ve mekân yönetimi. 81 ilde tek merkezden hizmet.`,
        canonicalUrl: `https://www.toplantimerkezi.com.tr/sehirler/${city.slug}`,
        geo: cityGeo,
        breadcrumbs: [
          { name: 'Ana Sayfa', url: '/' },
          { name: 'Şehirler', url: '/sehirler' },
          { name: city.name, url: `/sehirler/${city.slug}` }
        ],
        faqs: cityFaqs,
        schemaType: 'LocalBusiness',
        schemaData: {
          name: `Toplantı Merkezi ${city.name} Kurumsal Organizasyon Masası`,
          telephone: '+90 850 308 00 00',
          email: 'info@toplantimerkezi.com.tr',
          url: `https://www.toplantimerkezi.com.tr/sehirler/${city.slug}`,
          priceRange: '₺₺₺₺',
          currenciesAccepted: 'TRY',
          paymentAccepted: 'Corporate Bank Transfer, Invoice',
          address: {
            '@type': 'PostalAddress',
            addressLocality: city.name,
            addressRegion: city.region || 'Türkiye',
            addressCountry: 'TR'
          },
          geo: cityGeo ? {
            '@type': 'GeoCoordinates',
            latitude: cityGeo.lat,
            longitude: cityGeo.lng
          } : undefined,
          areaServed: {
            '@type': 'AdministrativeArea',
            name: `${city.name}, Türkiye`
          },
          description: aiDirectAnswer
        }
      });
      window.scrollTo(0, 0);
    }
  }, [city, sehirSlug, cityGeo]);

  if (!city) {
    return (
      <div className="min-h-screen pt-36 pb-20 text-center px-4 bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-900 font-display">Şehir Bulunamadı</h2>
        <p className="text-sm text-slate-600 mt-2">Aradığınız şehir sayfası mevcut değil.</p>
        <Link to="/sehirler" className="mt-6 inline-block px-6 py-3 rounded-xl gold-gradient-bg text-slate-950 font-bold text-xs">
          Tüm Şehirleri Gör
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
          <Link to="/sehirler" className="hover:text-amber-700">Şehirler (81 İl)</Link>
          <span>/</span>
          <span className="text-amber-800 font-bold">{city.name}</span>
        </div>

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden min-h-[400px] flex items-end p-6 sm:p-10 md:p-12 mb-8 shadow-xl border border-slate-200">
          <img
            src={city.image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'}
            alt={`${city.name} Kurumsal Toplantı ve Organizasyon`}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-400/40 text-amber-400 text-xs font-bold shadow-md">
              <MapPin size={13} />
              <span>Plaka: {city.plate} • {city.region} Bölgesi MICE Hattı</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-display">
              {city.name} Kurumsal Organizasyon & Toplantı Çözümleri
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light">
              {city.overview || `${city.name} ilinde bayi toplantısı, şirket organizasyonu, kongre ve tüm kurumsal etkinliklerinizi yerel uzmanlığımız ve tek merkez gücümüzle yönetiyoruz.`}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenQuoteModal({ initialCity: city.name })}
                className="px-6 py-3 rounded-xl gold-gradient-bg text-slate-950 font-extrabold text-xs sm:text-sm shadow-md hover:scale-105 transition flex items-center gap-2"
              >
                <Sparkles size={16} />
                <span>{city.name} İçin 2 Saatte Teklif Al</span>
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
                  {city.name} MICE Özeti
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
          
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Regional Intelligence Cards */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                {city.name} Organizasyon Altyapısı & Lojistik Olanakları
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                    <Plane size={18} />
                    <span>Ulaşım & Havalimanı</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {city.transport || 'Havalimanı, YHT ve otoyol transfer bağlantıları.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                    <Users size={18} />
                    <span>Konaklama & Kapasite</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {city.capacityOverview || '5 yıldızlı zincir oteller ve kurumsal kongre salonları.'}
                  </p>
                </div>
              </div>

              {city.regionalPerks && (
                <div className="pt-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    {city.name} İlinde Organizasyon Düzenlemenin Avantajları:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {city.regionalPerks.map((perk, i) => (
                      <div key={i} className="p-3 rounded-xl bg-amber-50 text-amber-950 text-xs font-medium border border-amber-200 flex items-center gap-2">
                        <CheckCircle2 size={15} className="text-amber-600 shrink-0" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* City + Organization Dynamic SEO Matrix Links */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-display">
                    {city.name} İçin Kurumsal Organizasyon Sayfaları
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    {city.name} ilinde gerçekleştireceğiniz kurumsal etkinlik türüne özel planlama ve teklif modülleri:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {ORGANIZATIONS.map(org => (
                  <Link
                    key={org.slug}
                    to={`/sehirler/${city.slug}/${org.slug}`}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 transition flex flex-col justify-between group"
                  >
                    <div className="font-bold text-xs text-slate-900 group-hover:text-amber-800 transition">
                      {city.name} {org.title}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between group-hover:text-amber-700 font-semibold">
                      <span>Detayları Gör</span>
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* City Technical Modules Matrix Links */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-display">
                    {city.name} Teknik Prodüksiyon & Ekipman Hizmetleri
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    {city.name} ilinde yerleşik reji, sahne ve ses-ışık sistemleri:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {SERVICES.slice(0, 6).map(srv => (
                  <Link
                    key={srv.slug}
                    to={`/sehirler/${city.slug}/${srv.slug}`}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 transition flex flex-col justify-between group"
                  >
                    <div className="font-bold text-xs text-slate-900 group-hover:text-amber-800 transition">
                      {city.name} {srv.title}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between group-hover:text-amber-700 font-semibold">
                      <span>Modülü İncele</span>
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* City Venues (If available in database) */}
            {cityVenues.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
                <h2 className="text-xl font-bold text-slate-900 font-display">
                  {city.name} Öne Çıkan Toplantı & Kongre Mekânları
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cityVenues.map(v => (
                    <div key={v.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{v.name}</span>
                        <span className="text-amber-700 font-bold">{v.capacity} Kişi</span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2">{v.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Localized FAQ Accordion (GEO / Generative Engine Rich Snippet) */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
                <HelpCircle size={16} />
                <span>{city.name} Kurumsal Sıkça Sorulan Sorular</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-display">
                {city.name} Organizasyon Süreci Hakkında Merak Edilenler
              </h2>

              <div className="space-y-3 pt-2">
                {cityFaqs.map((faq, index) => {
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

          </div>

          {/* Right Sticky Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-400/40 shadow-xl space-y-6 sticky top-28">
              <div className="space-y-2">
                <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">{city.name} Operasyon Masası</div>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  {city.name} İçin Hemen Teklif Alın
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {city.name} genelindeki salon, otel, ses, LED ve personel gereksinimleriniz için 2 saat içinde anahtar teslim bütçe çalışması sunalım.
                </p>
              </div>

              <div className="space-y-2.5 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>Tek Sözleşme, Tek Muhatap Güvencesi</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>3D Salon Simülasyonu & Sahne Tasarımı</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>Yerleşik Depo ile Sıfır Ekstra Nakliye</span>
                </div>
              </div>

              <button
                onClick={() => onOpenQuoteModal({ initialCity: city.name })}
                className="w-full py-4 rounded-2xl gold-gradient-bg text-slate-950 font-extrabold text-sm shadow-md hover:scale-105 transition flex items-center justify-center gap-2"
              >
                <Sparkles size={16} />
                <span>{city.name} Teklif Formunu Başlat</span>
              </button>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Komşu & Bölge Şehirleri:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_81_CITIES.filter(c => c.region === city.region && c.slug !== city.slug).slice(0, 6).map(neighbor => (
                    <Link
                      key={neighbor.slug}
                      to={`/sehirler/${neighbor.slug}`}
                      className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 font-medium border border-slate-200 transition"
                    >
                      {neighbor.name}
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
