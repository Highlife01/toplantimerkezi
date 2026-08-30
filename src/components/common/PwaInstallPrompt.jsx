import React, { useState, useEffect } from 'react';
import { Download, X, Sparkles, Smartphone, Check } from 'lucide-react';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. Zaten yüklü mü kontrol et (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    // 2. Daha önce kapatıldıysa 7 gün boyunca tekrar gösterme
    const dismissedTime = localStorage.getItem('tm_pwa_dismissed');
    if (dismissedTime) {
      const daysSinceDismiss = (Date.now() - Number(dismissedTime)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismiss < 7) {
        return;
      }
    }

    // 3. beforeinstallprompt olayını yakala
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Kullanıcı sayfayı biraz gezindikten sonra zarifçe göster (4 saniye gecikmeli)
      setTimeout(() => {
        setShowPrompt(true);
      }, 4000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. Başarıyla yüklendiğinde
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      console.log('[PWA] Toplantı Merkezi başarıyla ana ekrana yüklendi.');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] Kullanıcı tercihi: ${outcome}`);

    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('tm_pwa_dismissed', Date.now().toString());
  };

  if (!showPrompt || isInstalled) return null;

  return (
    <aside aria-label="Uygulama Yükleme" className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-40 animate-in slide-in-from-bottom-5 duration-500">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-amber-500/40 rounded-2xl p-4 shadow-2xl text-white flex items-start gap-3.5 relative overflow-hidden">
        
        {/* Subtle Gold Accent Background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10"></div>

        {/* Icon */}
        <div className="w-12 h-12 rounded-xl gold-gradient-bg flex-shrink-0 flex items-center justify-center text-slate-950 font-bold shadow-md">
          <Smartphone size={22} className="animate-pulse" />
        </div>

        {/* Content */}
        <div className="flex-grow pr-6 space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-extrabold text-white font-display">
              Toplantı Merkezi App
            </span>
            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
              PWA
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            Teklif hazırlama, canlı talep takibi ve hızlı operasyon iletişimi için ana ekranınıza ekleyin.
          </p>

          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg gold-gradient-bg text-slate-950 text-xs font-bold shadow-md hover:scale-102 transition"
            >
              <Download size={13} />
              <span>Uygulamayı Ekle</span>
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs font-medium transition"
            >
              Daha Sonra
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-slate-400 hover:text-white transition p-1"
          aria-label="Kapat"
        >
          <X size={15} />
        </button>

      </div>
    </aside>
  );
}
