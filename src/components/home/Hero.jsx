import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, MapPin, Award, Users, CheckCircle2, Building, Play } from 'lucide-react';

export default function Hero({ onOpenQuoteModal }) {
  return (
    <section className="relative min-h-[85vh] lg:min-h-[95vh] flex items-center justify-center pt-28 pb-16 overflow-hidden subtle-grid-bg bg-gradient-to-b from-slate-50 via-white to-slate-50">
      
      {/* Background Soft Glows */}
      <div className="hero-glow top-10 -left-20 animate-pulse-glow"></div>
      <div className="hero-glow bottom-0 -right-20 animate-pulse-glow" style={{ animationDelay: '3s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          
          {/* Trust Badge Top */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-amber-400/40 text-amber-800 text-xs sm:text-sm font-bold tracking-wide shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping"></span>
            <span>81 İlde Organizasyon Çözümleri • Tek Merkezden Yönetim • Kurumsal Hizmet</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 font-display leading-[1.1]">
            Türkiye'nin Her Yerinde <br />
            <span className="gold-gradient-text">Kurumsal Organizasyon</span> Çözümleri
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
            Bayi toplantılarından şirket organizasyonlarına, kamu toplantılarından kurumsal pikniklere kadar tüm süreci profesyonel ekibimizle planlıyor, koordine ediyor ve yönetiyoruz.
          </p>

          {/* Dual CTAs */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenQuoteModal}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl gold-gradient-bg text-slate-950 font-extrabold text-base shadow-md hover:scale-105 active:scale-95 transition-all group"
            >
              <Sparkles size={20} className="group-hover:rotate-12 transition" />
              <span>Organizasyon Planla</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
            </button>

            <button
              onClick={onOpenQuoteModal}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-300 shadow-sm hover:border-amber-400 transition-all"
            >
              <span>Hızlı Teklif Al</span>
            </button>
          </div>

          {/* Key Value Metrics & Proof */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-panel p-4 rounded-2xl text-center border-slate-200 shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 font-display">81 İl</div>
              <div className="text-xs text-slate-500 font-semibold mt-1">Eşzamanlı Operasyon Gücü</div>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center border-slate-200 shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">500+</div>
              <div className="text-xs text-slate-500 font-semibold mt-1">Başarılı Kurumsal Etkinlik</div>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center border-slate-200 shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 font-display">250K+</div>
              <div className="text-xs text-slate-500 font-semibold mt-1">Ağırlanan Katılımcı</div>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center border-slate-200 shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-display">%99.4</div>
              <div className="text-xs text-slate-500 font-semibold mt-1">B2B Memnuniyet Skoru</div>
            </div>
          </div>

          {/* Quick Target Sector Badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className="text-slate-700 font-bold">Hedef Sektörler:</span>
            {['Holdingler', 'Otomotiv', 'Bankacılık & Finans', 'Kamu Kurumları', 'Belediyeler', 'Fabrikalar & Sanayi', 'Teknoloji', 'STK & Odalar'].map((s, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-medium shadow-xs">
                {s}
              </span>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
