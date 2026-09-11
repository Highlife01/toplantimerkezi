import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ALL_81_CITIES, PROMINENT_CITIES } from '../data/citiesData';
import SectionTitle from '../components/common/SectionTitle';
import UrgentEventBanner from '../components/common/UrgentEventBanner';
import { updatePageSeo } from '../services/seoService';
import { MapPin, Search, Plane, Users, Building, ArrowRight, Sparkles } from 'lucide-react';

const REGIONS = ['Tümü', 'Marmara', 'İç Anadolu', 'Ege', 'Akdeniz', 'Güneydoğu Anadolu', 'Karadeniz', 'Doğu Anadolu'];

export default function CitiesPage({ onOpenQuoteModal }) {
  const [selectedRegion, setSelectedRegion] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    updatePageSeo({
      title: '81 İlde Organizasyon ve Toplantı Çözümleri',
      description: 'İstanbul, Ankara, İzmir, Antalya, Adana ve Türkiye\'nin 81 ilinde profesyonel kongre, toplantı ve etkinlik yönetimi tek merkezden sağlanır. 81 il yerel koordinasyon masası.',
      canonicalUrl: 'https://www.toplantimerkezi.com.tr/sehirler',
      breadcrumbs: [
        { name: 'Ana Sayfa', url: '/' },
        { name: 'Şehirler', url: '/sehirler' }
      ],
      schemaType: 'CollectionPage',
      schemaData: {
        name: 'Toplantı Merkezi 81 İl Şehir Rehberi',
        description: 'Türkiye genelinde 81 ilde kurumsal toplantı, bayi toplantısı ve etkinlik lokasyonları.',
        url: 'https://www.toplantimerkezi.com.tr/sehirler'
      }
    });
    window.scrollTo(0, 0);
  }, []);

  const filteredCities = ALL_81_CITIES.filter(c => {
    const matchesRegion = selectedRegion === 'Tümü' || c.region === selectedRegion;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.plate.includes(searchQuery);
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="pt-28 pb-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-8">
          <Link to="/" className="hover:text-amber-700">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-amber-800 font-bold">81 İl Şehir Sistemi</span>
        </div>

        <SectionTitle
          badge="Türkiye Geneli Organizasyon Haritası"
          title="81 İlde Kusursuz Etkinlik ve Toplantı Yönetimi"
          subtitle="Hangi şehirde olursanız olun; yerel tedarikçilerimiz, kongre otellerimiz ve saha direktörlerimizle tek merkezden hizmet veriyoruz."
        />

        {/* Prominent Hubs Showcase Cards */}
        <div className="mb-14">
          <h3 className="text-lg font-bold text-slate-900 font-display mb-6">
            Öne Çıkan MICE ve Kongre Merkezleri (15 Odak Şehir)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROMINENT_CITIES.slice(0, 6).map(city => (
              <div
                key={city.slug}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl hover:border-amber-400/50 transition-all flex flex-col justify-between group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                  
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/90 border border-amber-400/40 text-amber-400 text-xs font-bold">
                    {city.plate} • {city.region}
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-xs text-amber-400 font-bold block">{city.badge}</span>
                    <h4 className="text-2xl font-extrabold text-white font-display">{city.name}</h4>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {city.overview}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-500 border-t border-slate-100 pt-3">
                    <div>Mekân: <strong className="text-slate-800">{city.venueTypes[0]}</strong></div>
                    <div>Ulaşım: <strong className="text-slate-800">{city.transport.split(',')[0]}</strong></div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={`/sehirler/${city.slug}`}
                      className="text-xs font-bold text-slate-900 hover:text-amber-700 flex items-center gap-1 transition"
                    >
                      <span>Şehir Rehberi & Mekânlar</span>
                      <ArrowRight size={13} className="text-amber-600" />
                    </Link>

                    <button
                      onClick={() => onOpenQuoteModal({ initialCity: city.name })}
                      className="px-3.5 py-1.5 rounded-lg gold-gradient-bg text-slate-950 font-bold text-xs shadow-xs"
                    >
                      Teklif Al
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 81 Provinces Complete Explorer with Filter */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-display">
                81 İl Tam Liste & Şehir Rehberi
              </h3>
              <p className="text-xs text-slate-500">
                Şehir detay sayfalarından yerel otel, salon ve teknik olanaklara ulaşabilirsiniz.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Şehir adı veya plaka ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Region Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 pb-2 border-b border-slate-100">
            {REGIONS.map(reg => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedRegion === reg
                    ? 'gold-gradient-bg text-slate-950 shadow-sm'
                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          {/* Cities Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredCities.map(city => (
              <Link
                key={city.slug}
                to={`/sehirler/${city.slug}`}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 transition flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-amber-700 font-bold">{city.plate}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{city.region}</span>
                </div>
                <div className="font-bold text-sm text-slate-900 group-hover:text-amber-800 transition">
                  {city.name}
                </div>
                <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1 group-hover:text-amber-700 font-semibold">
                  <span>Organizasyon İncele</span>
                  <ArrowRight size={11} className="group-hover:translate-x-1 transition" />
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

      <div className="mt-20">
        <UrgentEventBanner onOpenQuoteModal={onOpenQuoteModal} />
      </div>
    </div>
  );
}
