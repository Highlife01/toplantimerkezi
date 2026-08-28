import React from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { Phone, MessageSquare, Sparkles, Search } from 'lucide-react';

export default function MobileActionBar({ onOpenQuoteModal }) {
  const settings = storageService.getSettings();
  const whatsappUrl = `https://wa.me/${settings.whatsappPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Merhaba Toplantı Merkezi, hızlı teklif almak istiyorum.")}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200 px-3 py-2.5 shadow-2xl">
      <div className="grid grid-cols-3 gap-2">
        {/* Ara */}
        <a
          href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
          className="flex flex-col items-center justify-center py-1.5 px-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 active:scale-95 transition"
        >
          <Phone size={18} className="text-amber-700 mb-0.5" />
          <span className="text-[11px] font-bold">Hemen Ara</span>
        </a>

        {/* WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1.5 px-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-700 active:scale-95 transition"
        >
          <MessageSquare size={18} className="mb-0.5 text-emerald-600" />
          <span className="text-[11px] font-bold">WhatsApp</span>
        </a>

        {/* Teklif Al */}
        <button
          type="button"
          onClick={onOpenQuoteModal}
          className="flex flex-col items-center justify-center py-1.5 px-2 rounded-xl gold-gradient-bg text-slate-950 font-extrabold shadow-sm active:scale-95 transition"
        >
          <Sparkles size={18} className="mb-0.5 text-slate-950" />
          <span className="text-[11px]">Teklif Al</span>
        </button>
      </div>
    </div>
  );
}
