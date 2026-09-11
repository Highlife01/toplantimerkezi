import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, MapPin, Award, Users, CheckCircle2, Building, Calendar, Compass } from 'lucide-react';

export default function Hero({ onOpenQuoteModal }) {
  const QUICK_PAGES = [
    { to: '/bayi-toplantisi-organizasyonu', label: 'Bayi Toplantısı', tag: 'Öne Çıkan' },
    { to: '/toplanti-organizasyonu', label: 'Şirket Toplantısı', tag: 'B2B' },
    { to: '/kongre-organizasyonu', label: 'Kongre & Zirve', tag: 'MICE' },
    { to: '/kurumsal-piknik-organizasyonu', label: 'Kurumsal Piknik', tag: 'Açık Hava' },
    { to: '/kamu-organizasyonu', label: 'Kamu & Protokol', tag: 'Resmi' },
    { to: '/sehirler', label: '81 İl Rehberi', tag: 'Türkiye Geneli' }
  ];

  return (
    <section className="relative min-h-[85vh] lg:min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden subtle-grid-bg bg-gradient-to-b from-slate-50 via-white to-slate-50">
      
      {/* Background Soft Glows */}
      <div className="hero-glow top-10 -left-20 animate-pulse-glow"></div>
      <div className="hero-glow bottom-0 -right-20 animate-pulse-glow" style={{ animationDelay: '3s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          
          {/* Trust Badge Top */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-amber-400/50 text-amber-900 text-xs sm:text-sm font-bold tracking-wide shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping"></span>
            <span>81 İlde Organizasyon Çözümleri • Tek Merkezden Yönetim • Kurumsal Hizmet Portalı</span>
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

          {/* Dual Multi-Page CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onOpenQuoteModal}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl gold-gradient-bg text-slate-950 font-extrabold text-base shadow-md hover:scale-105 active:scale-95 transition-all group"
            >
              <Sparkles size={19} className="group-hover:rotate-12 transition" />
              <span>Organizasyon Planla</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
            </button>

            <Link
              to="/organizasyonlar"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-300 shadow-xs hover:border-amber-500 hover:text-amber-800 transition-all"
            >
              <Compass size={18} className="text-amber-600" />
              <span>Kurumsal Çözümleri İncele</span>
            </Link>
          </div>

          {/* Direct Multi-Page Quick Access Pills */}
          <div className="pt-4 max-w-3xl mx-auto">
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2.5">
              Hızlı Sayfa Geçişleri & Tematik Kümeler:
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {QUICK_PAGES.map((qp, idx) => (
                <Link
                  key={idx}
                  to={qp.to}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-amber-50/70 border border-slate-200 hover:border-amber-400 text-slate-800 hover:text-amber-900 text-xs font-semibold shadow-2xs transition flex items-center gap-1.5 group"
                >
                  <span>{qp.label}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 group-hover:bg-amber-100 text-slate-500 group-hover:text-amber-800 font-medium">
                    {qp.tag}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Key Value Metrics & Proof */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-4xl mx-auto">
            <Link to="/sehirler" className="glass-panel p-3.5 rounded-2xl text-center border-slate-200 shadow-xs hover:border-amber-400 transition group">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 font-display group-hover:scale-105 transition">81 İl</div>
              <div className="text-xs text-slate-500 font-semibold mt-0.5">Eşzamanlı Operasyon Gücü</div>
            </Link>
            <Link to="/projeler" className="glass-panel p-3.5 rounded-2xl text-center border-slate-200 shadow-xs hover:border-amber-400 transition group">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display group-hover:scale-105 transition">500+</div>
              <div className="text-xs text-slate-500 font-semibold mt-0.5">Başarılı Kurumsal Etkinlik</div>
            </Link>
            <div className="glass-panel p-3.5 rounded-2xl text-center border-slate-200 shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 font-display">250K+</div>
              <div className="text-xs text-slate-500 font-semibold mt-0.5">Ağırlanan Katılımcı</div>
            </div>
            <div className="glass-panel p-3.5 rounded-2xl text-center border-slate-200 shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-display">%99.4</div>
              <div className="text-xs text-slate-500 font-semibold mt-0.5">B2B Memnuniyet Skoru</div>
            </div>
          </div>

          {/* Quick Target Sector Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500">
            <span className="text-slate-700 font-bold">Sektörel Çözümler:</span>
            {[
              { name: 'Otomotiv', to: '/sektorler/otomotiv-ve-mobilite' },
              { name: 'İlaç & Sağlık', to: '/sektorler/ilac-ve-saglik' },
              { name: 'Sanayi & Üretim', to: '/sektorler/sanayi-ve-uretim' },
              { name: 'Bankacılık & Finans', to: '/sektorler/bankacilik-ve-finans' },
              { name: 'Teknoloji', to: '/sektorler/teknoloji-ve-yazilim' }
            ].map((s, idx) => (
              <Link 
                key={idx} 
                to={s.to}
                className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-amber-400 hover:text-amber-800 font-medium shadow-2xs transition"
              >
                {s.name}
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
