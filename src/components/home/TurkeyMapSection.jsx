import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PROMINENT_CITIES, ALL_81_CITIES } from '../../data/citiesData';
import SectionTitle from '../common/SectionTitle';
import { MapPin, Building, Plane, Users, ArrowRight, Search, Sparkles } from 'lucide-react';

export default function TurkeyMapSection({ onOpenQuoteModal }) {
  const [selectedCity, setSelectedCity] = useState(PROMINENT_CITIES[0]); // default Istanbul
  const [searchQuery, setSearchQuery] = useState('');

  const filtered81 = ALL_81_CITIES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.plate.includes(searchQuery) ||
    c.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="py-24 bg-slate-100/80 border-t border-slate-200 relative subtle-grid-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          badge="Türkiye Geneli Hizmet Ağı"
          title="81 İlde Organizasyon Gücü"
          subtitle="İstanbul'dan Adana'ya, Antalya'dan Ankara'ya; Türkiye'nin her noktasında kurumsal organizasyon ihtiyaçlarınıza çözüm üretiyoruz."
        />

        {/* Focus Cities Quick Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-5xl mx-auto">
          {PROMINENT_CITIES.map(city => {
            const isSelected = selectedCity.slug === city.slug;
            return (
              <button
                key={city.slug}
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                  isSelected
                    ? 'gold-gradient-bg text-slate-950 shadow-md scale-105'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-amber-400 hover:text-slate-950 shadow-xs'
                }`}
              >
                <span className="text-[10px] text-slate-400 font-mono">({city.plate})</span>
                <span>{city.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected City Interactive Showcase Box */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Image & Tag */}
            <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-[420px]">
              <img
                src={selectedCity.image}
                alt={selectedCity.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              
              <div className="absolute top-5 left-5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-400/50 text-amber-400 text-xs font-bold shadow-lg">
                Plaka: {selectedCity.plate} • {selectedCity.region} Bölgesi
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  {selectedCity.badge}
                </span>
                <h3 className="text-3xl font-extrabold text-white font-display">
                  {selectedCity.name}
                </h3>
                <p className="text-xs text-slate-200 mt-1 font-light">
                  {selectedCity.tagline}
                </p>
              </div>
            </div>

            {/* Right Detailed Regional Intelligence */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedCity.overview}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 text-amber-700 text-xs font-bold mb-1">
                      <Plane size={16} />
                      <span>Ulaşım & Lojistik</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-tight">
                      {selectedCity.transport}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 text-amber-700 text-xs font-bold mb-1">
                      <Users size={16} />
                      <span>Mekân & Kapasite</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-tight">
                      {selectedCity.capacityOverview}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {selectedCity.name} İçin Önerilen Kurumsal Organizasyonlar:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCity.recommendedEvents.map((ev, i) => (
                      <span
                        key={i}
                        className="text-xs font-semibold px-3 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200"
                      >
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons for City */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <Link
                  to={`/sehirler/${selectedCity.slug}`}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900 hover:text-amber-700 transition"
                >
                  <span>{selectedCity.name} Organizasyon Olanakları ve SEO Rehberi</span>
                  <ArrowRight size={15} className="text-amber-600" />
                </Link>

                <button
                  onClick={onOpenQuoteModal}
                  className="px-5 py-2.5 rounded-xl gold-gradient-bg text-slate-950 font-bold text-xs shadow-sm hover:shadow-md transition"
                >
                  Bu Şehirde Teklif Al
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* 81 Provinces Quick Directory Search & "Tüm Şehirleri Gör" CTA */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h4 className="text-lg font-bold text-slate-900 font-display">
                81 İl Tam Liste & Bölgesel Arama
              </h4>
              <p className="text-xs text-slate-500">
                Türkiye'nin her ilindeki kurumsal toplantı ve etkinlik altyapısına anında ulaşın.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="İl veya plaka ara (Örn: Adana, 01)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2 max-h-48 overflow-y-auto pr-1">
            {filtered81.slice(0, 36).map(c => (
              <Link
                key={c.slug}
                to={`/sehirler/${c.slug}`}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50/50 text-slate-700 hover:text-amber-900 text-xs text-center border border-slate-200 hover:border-amber-300 transition"
              >
                <span className="text-[10px] text-slate-400 block font-mono font-bold">{c.plate}</span>
                <span className="font-semibold truncate block">{c.name}</span>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center pt-4 border-t border-slate-100">
            <Link
              to="/sehirler"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gold-gradient-bg text-slate-950 font-extrabold text-xs sm:text-sm shadow-md hover:scale-105 transition"
            >
              <span>Tüm Şehirleri Gör (81 İl Rehberi)</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
