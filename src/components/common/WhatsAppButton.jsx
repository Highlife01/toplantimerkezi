import React from 'react';
import { storageService } from '../../services/storageService';
import { MessageSquare } from 'lucide-react';

export default function WhatsAppButton() {
  const settings = storageService.getSettings();
  const whatsappUrl = `https://wa.me/${settings.whatsappPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Merhaba Toplantı Merkezi, kurumsal organizasyonumuz için bilgi ve teklif almak istiyoruz.")}`;

  return (
    <div className="fixed bottom-20 md:bottom-8 right-5 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp'tan Teklif Al"
        className="flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-4 py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 group border border-emerald-400/30"
      >
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <MessageSquare size={18} className="fill-current text-white" />
        </div>
        <span className="text-xs sm:text-sm tracking-wide hidden sm:inline pr-1">
          WhatsApp'tan Teklif Al
        </span>
      </a>
    </div>
  );
}
