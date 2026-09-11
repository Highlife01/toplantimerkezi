import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ALL_81_CITIES, PROMINENT_CITIES, getCityGeo } from '../data/citiesData';
import { ORGANIZATIONS } from '../data/organizationsData';
import { VENUES } from '../data/venuesData';
import SectionTitle from '../components/common/SectionTitle';
import UrgentEventBanner from '../components/common/UrgentEventBanner';
import { updatePageSeo } from '../services/seoService';
import { 
  MapPin, Building, Plane, Users, CheckCircle2, 
  ArrowRight, Sparkles, Phone, MessageSquare, Star, ShieldCheck
} from 'lucide-react';

export default function CityDetailPage({ onOpenQuoteModal }) {
  const { sehirSlug } = useParams();
  
  // Find in prominent or all cities
  const city = PROMINENT_CITIES.find(c => c.slug === sehirSlug) || 
               ALL_81_CITIES.find(c => c.slug === sehirSlug);

  const cityGeo = city ? getCityGeo(city.slug) : null;

  const cityVenues = VENUES.filter(v => 
    city && v.city.toLowerCase() === city.name.toLowerCase()
  );

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
        schemaType: 'LocalBusiness',
        schemaData: {
          name: `Toplantı Merkezi ${city.name} Kurumsal Organizasyon`,
          telephone: '+90 850 308 00 00',
          email: 'info@toplantimerkezi.com.tr',
          url: `https://www.toplantimerkezi.com.tr/sehirler/${city.slug}`,
          priceRange: '₺₺₺₺',
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
            name: city.name
          },
          description: `${city.name} ilinde kurumsal toplantı, bayi toplantısı, kongre ve etkinlik yönetimi.`
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
        <div className="relative rounded-3xl overflow-hidden min-h-[400px] flex items-end p-6 sm:p-10 md:p-12 mb-12 shadow-xl border border-slate-200">
          <img
            src={city.image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'}
            alt={city.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-400/40 text-amber-400 text-xs font-bold shadow-md">
              <span>Plaka: {city.plate} • {city.region} Bölgesi</span>
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
                <span>{city.name} İçin Teklif Al</span>
              </button>
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
                    {city.transport || 'Havalimanı ve şehirlerarası transfer bağlantıları.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                    <Users size={18} />
                    <span>Konaklama & Kapasite</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {city.capacityOverview || '5 yıldızlı oteller ve kurumsal toplantı salonları.'}
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
              <h2 className="text-xl font-bold text-slate-900 font-display">
                {city.name} İçin Kurumsal Organizasyon Sayfaları
              </h2>
              <p className="text-xs text-slate-600">
                {city.name} ilinde gerçekleştireceğiniz organizasyon türüne özel detaylı planlama rehberi ve teklif modülleri:
              </p>

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
                  {city.name} genelindeki salon, otel, ses, LED ve personel gereksinimleriniz için anahtar teslim bütçe çalışması sunalım.
                </p>
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
