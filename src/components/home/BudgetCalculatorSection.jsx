import React, { useState } from 'react';
import { 
  Calculator, Sparkles, ArrowRight, CheckCircle2, 
  Building2, Users, Calendar, MapPin, Layers, Tv, 
  Volume2, Utensils, Award, ShieldCheck, DollarSign
} from 'lucide-react';
import SectionTitle from '../common/SectionTitle';

const ORG_TYPES = [
  { id: 'Bayi Toplantısı', label: 'Bayi Toplantısı', multiplier: 1.4, defaultDays: 2 },
  { id: 'Şirket Toplantısı', label: 'Şirket Toplantısı', multiplier: 1.0, defaultDays: 1 },
  { id: 'Kurumsal Piknik', label: 'Kurumsal Piknik', multiplier: 0.8, defaultDays: 1 },
  { id: 'Kongre & Konferans', label: 'Kongre & Konferans', multiplier: 1.5, defaultDays: 2 },
  { id: 'Kamu & Protokol', label: 'Kamu & Protokol', multiplier: 1.1, defaultDays: 1 },
  { id: 'Gala & Ödül Gecesi', label: 'Gala & Ödül Gecesi', multiplier: 1.6, defaultDays: 1 }
];

const CITIES = [
  { id: 'Antalya', name: 'Antalya (Kongre Otelleri)', baseFactor: 1.2 },
  { id: 'İstanbul', name: 'İstanbul', baseFactor: 1.3 },
  { id: 'Ankara', name: 'Ankara', baseFactor: 1.0 },
  { id: 'İzmir', name: 'İzmir / Çeşme', baseFactor: 1.1 },
  { id: 'Kocaeli', name: 'Kocaeli / Sapanca', baseFactor: 0.95 },
  { id: 'Bursa', name: 'Bursa', baseFactor: 0.95 },
  { id: 'Diğer 81 İl', name: 'Diğer 81 İl', baseFactor: 0.9 }
];

const ATTENDEES_OPTIONS = [
  { label: '50 Kişi', value: 50 },
  { label: '100 Kişi', value: 100 },
  { label: '250 Kişi', value: 250 },
  { label: '500 Kişi', value: 500 },
  { label: '1.000 Kişi', value: 1000 },
  { label: '2.500+ Kişi', value: 2500 }
];

export default function BudgetCalculatorSection({ onOpenQuoteModal }) {
  const [selectedOrg, setSelectedOrg] = useState(ORG_TYPES[0]);
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [attendees, setAttendees] = useState(250);
  const [isMultiDay, setIsMultiDay] = useState(true);
  
  // Technical toggles
  const [hasLed, setHasLed] = useState(true);
  const [hasSoundLight, setHasSoundLight] = useState(true);
  const [hasStage, setHasStage] = useState(true);
  const [hasCatering, setHasCatering] = useState(true);
  const [hasArtist, setHasArtist] = useState(false);
  const [hasHostess, setHasHostess] = useState(true);

  // Dynamic Cost Calculation Algorithm
  const calculateEstimate = () => {
    const personCount = attendees;
    const cityFactor = selectedCity.baseFactor;
    const orgFactor = selectedOrg.multiplier;
    const dayFactor = isMultiDay ? 1.8 : 1.0;

    // Base per person venue/accommodation + food cost
    let perPersonCost = (isMultiDay ? 3200 : 950) * cityFactor * orgFactor;
    let venueTotal = Math.round((perPersonCost * personCount * (hasCatering ? 1 : 0.4)) / 1000) * 1000;

    // Technical items
    let ledCost = hasLed ? (personCount > 300 ? 75000 : 45000) : 0;
    let soundCost = hasSoundLight ? (personCount > 300 ? 65000 : 35000) : 0;
    let stageCost = hasStage ? (personCount > 300 ? 80000 : 40000) : 0;
    let artistCost = hasArtist ? 150000 : 0;
    let hostessCost = hasHostess ? Math.max(15000, personCount * 45) : 0;

    let techTotal = ledCost + soundCost + stageCost + artistCost + hostessCost;
    let grandTotalMin = Math.round((venueTotal + techTotal) * 0.9 / 5000) * 5000;
    let grandTotalMax = Math.round((venueTotal + techTotal) * 1.15 / 5000) * 5000;

    return {
      venueTotal,
      techTotal,
      grandTotalMin,
      grandTotalMax,
      perPersonAvg: Math.round(grandTotalMin / personCount)
    };
  };

  const est = calculateEstimate();

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-y border-slate-200" id="butce-hesaplayici">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          badge="İnteraktif Bütçe Motoru"
          title="Kurumsal Etkinlik & Toplantı Bütçenizi Hesaplayın"
          subtitle="Organizasyon türünü, katılımcı sayısını ve teknik modülleri seçin; 81 il pazar standartlarında anında tahmini maliyet aralığını görün."
          center={true}
        />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Form (8 Cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-300 shadow-lg space-y-6">
            
            {/* 1. Org Type */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                1. Organizasyon Türü
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {ORG_TYPES.map(org => {
                  const active = selectedOrg.id === org.id;
                  return (
                    <button
                      key={org.id}
                      type="button"
                      onClick={() => {
                        setSelectedOrg(org);
                        setIsMultiDay(org.defaultDays > 1);
                      }}
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition ${
                        active 
                          ? 'gold-gradient-bg text-slate-950 border-amber-400 shadow-sm' 
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {org.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. City & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  2. Hedef Şehir / Destinasyon
                </label>
                <select
                  value={selectedCity.id}
                  onChange={(e) => {
                    const found = CITIES.find(c => c.id === e.target.value);
                    if (found) setSelectedCity(found);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 focus:outline-none focus:border-amber-600"
                >
                  {CITIES.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Konaklama & Süre
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMultiDay(false)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold text-center transition ${
                      !isMultiDay 
                        ? 'gold-gradient-bg text-slate-950 border-amber-400 shadow-xs' 
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    Gündüz (Günübirlik)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMultiDay(true)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold text-center transition ${
                      isMultiDay 
                        ? 'gold-gradient-bg text-slate-950 border-amber-400 shadow-xs' 
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    Konaklamalı (2-3 Gün)
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Attendees Slider / Buttons */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  3. Katılımcı Sayısı: <span className="text-amber-800 font-extrabold font-mono text-sm">{attendees} Kişi</span>
                </label>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {ATTENDEES_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setAttendees(opt.value)}
                    className={`py-2 rounded-xl border text-xs font-bold transition ${
                      attendees === opt.value 
                        ? 'bg-slate-950 text-amber-400 border-slate-950 shadow-xs' 
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Technical Modules Checklist */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                4. Dahil Edilecek Teknik & Prodüksiyon Modülleri
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                {[
                  { label: 'P2.6 Dev LED Ekran', state: hasLed, setter: setHasLed, icon: Tv },
                  { label: 'Akustik Ses & Işık', state: hasSoundLight, setter: setHasSoundLight, icon: Volume2 },
                  { label: '3D Sahne & Podyum', state: hasStage, setter: setHasStage, icon: Layers },
                  { label: 'Gala / Banket Catering', state: hasCatering, setter: setHasCatering, icon: Utensils },
                  { label: 'Sanatçı / Orkestra', state: hasArtist, setter: setHasArtist, icon: Award },
                  { label: 'Host/Hostes & Karşılama', state: hasHostess, setter: setHasHostess, icon: Users }
                ].map((mod, i) => {
                  const Icon = mod.icon;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => mod.setter(!mod.state)}
                      className={`p-3 rounded-xl border flex items-center gap-2 text-left font-semibold transition ${
                        mod.state 
                          ? 'bg-amber-50/80 border-amber-300 text-amber-950 font-bold' 
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <CheckCircle2 size={15} className={mod.state ? 'text-amber-700 shrink-0' : 'text-slate-300 shrink-0'} />
                      <span className="truncate">{mod.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Live Estimate Result Card (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 sticky top-28">
            <div className="space-y-1 border-b border-slate-800 pb-4">
              <span className="text-[11px] font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} />
                <span>Tahmini Kurumsal Bütçe Aralığı</span>
              </span>
              <h3 className="text-xl font-bold font-display text-white">
                {selectedOrg.label} • {selectedCity.name}
              </h3>
              <p className="text-xs text-slate-400">
                {attendees} Katılımcı • {isMultiDay ? 'Konaklamalı Paket' : 'Günübirlik Oturum'}
              </p>
            </div>

            {/* Price Big Display */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-center space-y-1">
              <div className="text-xs text-slate-400 font-medium">Toplam Tahmini Bütçe (KDV Hariç)</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tracking-tight">
                {est.grandTotalMin.toLocaleString('tr-TR')} – {est.grandTotalMax.toLocaleString('tr-TR')} TL
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold pt-1">
                Kişi Başı Ortalama: ~{est.perPersonAvg.toLocaleString('tr-TR')} TL
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Mekân, Salon & İkram:</span>
                <span className="font-mono font-bold text-slate-200">~{est.venueTotal.toLocaleString('tr-TR')} TL</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Teknik, Sahne, LED & Prodüksiyon:</span>
                <span className="font-mono font-bold text-slate-200">~{est.techTotal.toLocaleString('tr-TR')} TL</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Proje Yönetimi & Saha Koordinasyonu:</span>
                <span className="font-bold text-emerald-400">Dahil</span>
              </div>
            </div>

            {/* Value Guarantees */}
            <div className="space-y-1.5 text-[11px] text-slate-300 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span>Tek sözleşme & şeffaf kalem bütçeleme</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span>2 saat içinde resmi bağlayıcı teklif dosyası</span>
              </div>
            </div>

            {/* Convert CTA */}
            <button
              onClick={() => onOpenQuoteModal({ 
                initialOrgType: selectedOrg.id, 
                initialCity: selectedCity.id 
              })}
              className="w-full py-4 rounded-2xl gold-gradient-bg text-slate-950 font-extrabold text-sm shadow-md hover:scale-102 transition flex items-center justify-center gap-2"
            >
              <Sparkles size={18} />
              <span>Bu Bütçe İçin Resmi Teklif İste</span>
              <ArrowRight size={16} />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
