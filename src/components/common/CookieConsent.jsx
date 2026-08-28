import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('tm_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('tm_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-16 md:bottom-6 left-4 right-4 md:left-8 md:max-w-md z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xl text-slate-800 text-xs leading-relaxed flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
            <ShieldCheck size={18} />
            <span>KVKK & Çerez Bildirimi</span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-slate-700"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-slate-600">
          Sitemizde kullanıcı deneyiminizi geliştirmek ve kurumsal teklif taleplerinizi güvenle işleyebilmek için KVKK mevzuatına uygun çerezler kullanılmaktadır. Detaylar için{' '}
          <Link to="/yasal/cerez" className="text-amber-700 underline font-semibold hover:text-amber-800">
            Çerez Politikası
          </Link>'nı inceleyebilirsiniz.
        </p>

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={handleAccept}
            className="px-4 py-2 rounded-xl gold-gradient-bg text-slate-950 font-bold text-xs shadow-sm hover:scale-105 transition"
          >
            Kabul Ediyorum
          </button>
        </div>
      </div>
    </div>
  );
}
