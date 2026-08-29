import React, { useState } from 'react';
import { 
  Compass, MapPin, CheckCircle2, Star, ArrowRight, 
  Sparkles, Hotel, Plane, Calendar, DollarSign, Award
} from 'lucide-react';
import SectionTitle from '../common/SectionTitle';

const DESTINATIONS = [
  {
    id: 'antalya',
    name: 'Antalya (Belek / Kundu)',
    badge: 'Bayi Toplantılarının 1 Numarası',
    bestFor: 'Bayi Toplantıları, Ürün Lansmanları, Büyük Kongreler',
    concept: '5 Yıldızlı Her Şey Dahil Kongre Otelleri',
    airportDistance: 'Havalimanına 15–25 Dakika',
    salonCapacity: '100 – 3.000 Kişi (Kolonsuz)',
    bestMonths: 'Eylül – Mayıs (12 Ay Operasyon)',
    budgetScore: '⭐⭐⭐⭐⭐ (Yüksek Fiyat/Performans)',
    description: 'Yüksek kişi sayılı konaklamalı bayi toplantılarında yeme-içme ve salon kirası tek her şey dahil pakette toplandığı için en ekonomik ve prestijli çözümdür.'
  },
  {
    id: 'istanbul',
    name: 'İstanbul (Boğaz / Levent)',
    badge: 'Uluslararası Zirve & Finans Merkezi',
    bestFor: 'Lansmanlar, Strateji Zirveleri, Gala Geceleri, Basın Buluşmaları',
    concept: '5 Yıldızlı Balo Salonları & Tarihi Mekânlar',
    airportDistance: 'İGA / Sabiha Gökçen Bağlantılı',
    salonCapacity: '50 – 5.000 Kişi',
    bestMonths: 'Tüm Yıl Boyunca',
    budgetScore: '⭐⭐⭐⭐ (Executive Prestij)',
    description: 'Yurt dışından konuşmacı veya üst düzey yönetim kurulu üyelerinin katıldığı, ulusal basının takip ettiği prestijli lansman ve zirveler için idealdir.'
  },
  {
    id: 'kibris',
    name: 'Kıbrıs (Girne / Bafra)',
    badge: 'Gala & Sanatçılı Bayi Buluşmaları',
    bestFor: 'Yıl Sonu Bayi Galaları, Ödül Törenleri, Motivasyon Zirveleri',
    concept: 'Ultra Her Şey Dahil Gala Tesisleri',
    airportDistance: 'Ercan Havalimanı (Vizesiz/Pasaportsuz Giriş)',
    salonCapacity: '200 – 2.500 Kişi',
    bestMonths: 'Ekim – Nisan',
    budgetScore: '⭐⭐⭐⭐ (Yüksek Motivasyon)',
    description: 'Türkiye geneli bayileri ödüllendirmek ve ünlü sanatçılı gala geceleri düzenlemek için en popüler vizesiz yurt dışı deneyimi sunar.'
  },
  {
    id: 'izmir',
    name: 'İzmir & Çeşme',
    badge: 'Ege Motivasyon & Yönetim Buluşması',
    bestFor: 'Satış Toplantıları, Yönetim Kampları, Bahar Buluşmaları',
    concept: 'Termal & Resort Kongre Tesisleri',
    airportDistance: 'Adnan Menderes Havalimanı (30 Dk)',
    salonCapacity: '50 – 1.000 Kişi',
    bestMonths: 'Nisan – Haziran & Eylül – Kasım',
    budgetScore: '⭐⭐⭐⭐ (Ferah Atmosfer)',
    description: 'Bahar aylarında satış ekiplerinin motivasyonunu artırmak ve deniz havasında strateji toplantıları yapmak için tercih edilir.'
  },
  {
    id: 'ankara',
    name: 'Ankara (Çankaya / Söğütözü)',
    badge: 'Kamu & Protokol Başkenti',
    bestFor: 'Bakanlık Şuraları, Protokol Törenleri, Çalıştaylar, Oda Genel Kurulları',
    concept: 'Protokol Standartlı 5 Yıldızlı Oteller & Oditoryumlar',
    airportDistance: 'Esenboğa Havalimanı',
    salonCapacity: '100 – 2.000 Kişi',
    bestMonths: 'Eylül – Haziran',
    budgetScore: '⭐⭐⭐⭐ (Resmî Güvence)',
    description: 'Devlet erkanı, bürokratlar ve sivil toplum kuruluşlarının katıldığı resmî protokol kurallarına uygun toplantıların merkezidir.'
  }
];

export default function DestinationCompareSection({ onOpenQuoteModal }) {
  const [selectedDest, setSelectedDest] = useState(DESTINATIONS[0]);

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          badge="MICE Destinasyon Rehberi"
          title="Organizasyonunuz İçin En Doğru Şehir Hangisi?"
          subtitle="Bayi toplantısı, kongre veya gala geceniz için Türkiye'nin önde gelen MICE merkezlerinin konsept, kapasite ve bütçe avantajlarını kıyaslayın."
          center={true}
        />

        {/* Tab Pills */}
        <div className="mt-10 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 max-w-full">
          {DESTINATIONS.map(dest => {
            const active = selectedDest.id === dest.id;
            return (
              <button
                key={dest.id}
                onClick={() => setSelectedDest(dest)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  active 
                    ? 'gold-gradient-bg text-slate-950 shadow-md scale-105' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <MapPin size={15} className={active ? 'text-slate-950' : 'text-amber-700'} />
                <span>{dest.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Destination Card */}
        <div className="mt-8 bg-slate-50 border border-slate-300 rounded-3xl p-6 sm:p-10 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold">
              <Sparkles size={13} className="text-amber-700" />
              <span>{selectedDest.badge}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
              {selectedDest.name} Organizasyon Avantajları
            </h3>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
              {selectedDest.description}
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-500 font-semibold block mb-1">🎯 En Uygun Etkinlikler:</span>
                <strong className="text-slate-900">{selectedDest.bestFor}</strong>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-500 font-semibold block mb-1">🏨 Otel & Konsept Yapısı:</span>
                <strong className="text-slate-900">{selectedDest.concept}</strong>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-500 font-semibold block mb-1">👥 Salon Kapasitesi:</span>
                <strong className="text-slate-900">{selectedDest.salonCapacity}</strong>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-500 font-semibold block mb-1">✈️ Ulaşım / Havalimanı:</span>
                <strong className="text-slate-900">{selectedDest.airportDistance}</strong>
              </div>
            </div>
          </div>

          {/* Quick CTA Box */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-300 shadow-md space-y-5 text-center sm:text-left">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">Destinasyon Masası</span>
              <h4 className="text-lg font-bold text-slate-950 font-display">
                {selectedDest.name} İçin Teklif Hazırlayalım
              </h4>
              <p className="text-xs text-slate-600">
                Otel anlaşmalarımız, havalimanı transferi ve teknik reji dahil 2 saat içinde resmi fiyat tablonuzu iletelim.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 font-bold flex items-center justify-between">
              <span>Bütçe Verimliliği:</span>
              <span>{selectedDest.budgetScore}</span>
            </div>

            <button
              onClick={() => onOpenQuoteModal({ initialCity: selectedDest.name.split(' ')[0] })}
              className="w-full py-4 rounded-2xl gold-gradient-bg text-slate-950 font-extrabold text-xs sm:text-sm shadow-md hover:scale-102 transition flex items-center justify-center gap-2"
            >
              <Sparkles size={16} />
              <span>{selectedDest.name.split(' ')[0]} İçin Teklif Al</span>
              <ArrowRight size={16} />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
