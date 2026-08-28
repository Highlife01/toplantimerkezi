import React from 'react';
import { storageService } from '../../services/storageService';
import { Clock, Phone, Sparkles, ArrowRight } from 'lucide-react';

export default function UrgentEventBanner({ onOpenQuoteModal }) {
  const settings = storageService.getSettings();

  return (
    <section className="py-14 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-y border-amber-500/30 text-white relative overflow-hidden">
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Clock size={14} className="animate-pulse" />
              <span>Hızlı Operasyon & Acil Organizasyon Desteği</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white font-display">
              Yaklaşan Bir Organizasyonunuz mu Var?
            </h3>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl font-light">
              Tarihi yaklaşmış toplantı, lansman veya etkinlikleriniz için 81 ildeki hazır teknik ekibimiz ve geniş mekân ağımızla dakikalar içinde aksiyon alıyoruz.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenQuoteModal}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl gold-gradient-bg text-slate-950 font-extrabold text-sm shadow-md hover:scale-105 transition"
            >
              <Sparkles size={18} />
              <span>Hemen Teklif Al</span>
              <ArrowRight size={16} />
            </button>

            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition"
            >
              <Phone size={16} className="text-brand-gold" />
              <span>{settings.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
