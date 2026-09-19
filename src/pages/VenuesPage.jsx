import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { VENUES } from '../data/venuesData';
import { ALL_81_CITIES } from '../data/citiesData';
import SectionTitle from '../components/common/SectionTitle';
import UrgentEventBanner from '../components/common/UrgentEventBanner';
import { updatePageSeo } from '../services/seoService';
import {
  Building, MapPin, Users, Filter, Search,
  Sparkles, ArrowRight, Star, CheckCircle2, ChevronDown
} from 'lucide-react';

export default function VenuesPage({ onOpenQuoteModal }) {
  // SearchAction uyumu: /mekanlar?q=... sorgusunu arama alanına aktar
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [selectedCity, setSelectedCity] = useState('Tümü');
  const [selectedType, setSelectedType] = useState('Tümü');
  const [capacityFilter, setCapacityFilter] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    updatePageSeo({
      title: 'Toplantı ve Kongre Mekânları | Türkiye Geneli Salon Arama Motoru',
      description: '5 yıldızlı kongre otelleri, bağımsız toplantı salonları ve açık hava etkinlik alanları. Filtreli mekân arama ve anında kurumsal teklif alma.',
      canonicalUrl: 'https://www.toplantimerkezi.com.tr/mekanlar'
    });
    window.scrollTo(0, 0);
  }, []);

  const venueTypes = ['Tümü', 'Kongre Merkezi', 'Otel', 'Davet Alanı', 'Açık Hava / Piknik'];
  const popularCities = ['Tümü', 'İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Adana', 'Bursa', 'Mersin', 'Gaziantep', 'Kayseri', 'Kocaeli'];

  const filteredVenues = VENUES.filter(venue => {
    const matchCity = selectedCity === 'Tümü' || venue.city.toLowerCase() === selectedCity.toLowerCase();
    const matchType = selectedType === 'Tümü' || venue.venueType === selectedType;
    const matchSearch = searchQuery === '' ||
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.district.toLowerCase().includes(searchQuery.toLowerCase());

    let matchCap = true;
    if (capacityFilter === '100-500') matchCap = venue.capacity >= 100 && venue.capacity <= 500;
    else if (capacityFilter === '500-1500') matchCap = venue.capacity > 500 && venue.capacity <= 1500;
    else if (capacityFilter === '1500+') matchCap = venue.capacity > 1500;

    return matchCity && matchType && matchSearch && matchCap;
  });

  return (
    <div className="pt-28 pb-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-8">
          <Link to="/" className="hover:text-amber-700">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-amber-800 font-bold">Mekânlar & Salonlar</span>
        </div>

        <SectionTitle
          badge="Mekân Portföyü & Salon Seçimi"
          title="Toplantı & Kongre Mekânları Arama Motoru"
          subtitle="Türkiye genelinde 5 yıldızlı kongre otelleri, prestijli bağımsız salonlar ve doğa içi kurumsal etkinlik alanlarını filtreleyip karşılaştırın."
        />

        {/* Filter Bar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md mb-10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Search Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Mekân / Bölge Ara</label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="text"
                  placeholder="Mekân adı veya ilçe..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-600 focus:bg-white"
                />
              </div>
            </div>

            {/* City Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Şehir</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white font-medium"
              >
                {popularCities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Venue Type Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Mekân Tipi</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white font-medium"
              >
                {venueTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Capacity Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Kapasite</label>
              <select
                value={capacityFilter}
                onChange={(e) => setCapacityFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white font-medium"
              >
                <option value="Tümü">Tüm Kapasiteler</option>
                <option value="100-500">100 – 500 Kişi</option>
                <option value="500-1500">500 – 1.500 Kişi</option>
                <option value="1500+">1.500 Kişi ve Üzeri</option>
              </select>
            </div>

          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>Toplam <strong className="text-slate-900 font-bold">{filteredVenues.length}</strong> mekan listeleniyor</span>
            {(selectedCity !== 'Tümü' || selectedType !== 'Tümü' || capacityFilter !== 'Tümü' || searchQuery !== '') && (
              <button
                onClick={() => {
                  setSelectedCity('Tümü');
                  setSelectedType('Tümü');
                  setCapacityFilter('Tümü');
                  setSearchQuery('');
                }}
                className="text-amber-700 font-bold hover:underline"
              >
                Filtreleri Temizle
              </button>
            )}
          </div>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map(venue => (
            <div
              key={venue.id}
              className="bg-white rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-400/60 group"
            >
              {/* Image & Capacity Badge */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-amber-400/40 text-amber-400 text-xs font-bold flex items-center gap-1.5 shadow-md">
                  <MapPin size={12} />
                  <span>{venue.city} / {venue.district}</span>
                </div>

                <div className="absolute bottom-3 right-4 px-3 py-1 rounded-lg bg-white/95 border border-slate-200 text-slate-900 text-xs font-bold flex items-center gap-1 shadow-sm">
                  <Users size={13} className="text-amber-600" />
                  <span>Maks. {venue.capacity.toLocaleString('tr-TR')} Kişi</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <span className="text-amber-700 font-bold">{venue.venueType}</span>
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star size={13} className="fill-current" />
                      {venue.rating}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition font-display mb-2">
                    {venue.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">
                    {venue.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-500 border-t border-slate-100 pt-3">
                    <div className="flex items-center justify-between">
                      <span>Salon Sayısı:</span>
                      <span className="text-slate-900 font-semibold">{venue.salonCount} Salon</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Otopark:</span>
                      <span className="text-slate-900 font-semibold">{venue.parking}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Teknik Altyapı:</span>
                      <span className="text-amber-700 font-semibold">{venue.technicalGear[0]}, {venue.technicalGear[1]}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenQuoteModal({ initialCity: venue.city })}
                    className="w-full py-2.5 rounded-xl gold-gradient-bg text-slate-950 font-bold text-xs shadow-xs hover:shadow-md transition text-center"
                  >
                    Bu Mekân İçin Teklif Al
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      <div className="mt-20">
        <UrgentEventBanner onOpenQuoteModal={onOpenQuoteModal} />
      </div>
    </div>
  );
}
