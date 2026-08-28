import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { VENUES } from '../../data/venuesData';
import SectionTitle from '../common/SectionTitle';
import { Building, MapPin, Users, Sparkles, ArrowRight, Check, Star } from 'lucide-react';

export default function FeaturedVenues({ onOpenQuoteModal }) {
  const [selectedType, setSelectedType] = useState('Tümü');

  const filteredVenues = selectedType === 'Tümü' 
    ? VENUES.slice(0, 6) 
    : VENUES.filter(v => v.venueType === selectedType).slice(0, 6);

  const venueTypes = ['Tümü', 'Kongre Merkezi', 'Otel', 'Davet Alanı', 'Açık Hava / Piknik'];

  return (
    <section className="py-24 bg-white border-t border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          badge="Gelişmiş Mekân Portföyü"
          title="Öne Çıkan Toplantı & Kongre Mekânları"
          subtitle="Türkiye'nin en prestijli 5 yıldızlı kongre otelleri, bağımsız kültür merkezleri ve doğa içi açık hava etkinlik alanları."
        />

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {venueTypes.map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                selectedType === t
                  ? 'gold-gradient-bg text-slate-950 shadow-md'
                  : 'bg-slate-50 border border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Venue Cards Grid */}
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

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={onOpenQuoteModal}
                    className="w-full py-2.5 rounded-xl gold-gradient-bg text-slate-950 font-bold text-xs shadow-xs hover:shadow-md transition text-center"
                  >
                    Bu Mekân İçin Teklif Al
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Explore All Venues */}
        <div className="mt-12 text-center">
          <Link
            to="/mekanlar"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition"
          >
            <span>Tüm Mekânları Filtrele & Keşfet (Mekân Bul Arama Motoru)</span>
            <ArrowRight size={16} className="text-brand-gold" />
          </Link>
        </div>

      </div>
    </section>
  );
}
