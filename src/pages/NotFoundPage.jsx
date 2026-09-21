import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { updatePageSeo } from '../services/seoService';
import { 
  Compass, Home, ArrowRight, Building2, 
  MapPin, Phone, MessageSquare, Sparkles, Search 
} from 'lucide-react';

export default function NotFoundPage({ onOpenQuoteModal }) {
  useEffect(() => {
    updatePageSeo({
      title: 'Sayfa Bulunamadı (404) | Toplantı Merkezi',
      description: 'Aradığınız sayfa taşınmış, adı değiştirilmiş veya geçici olarak kullanım dışı olabilir. 81 ilde kurumsal toplantı ve organizasyon çözümlerimiz için ana sayfayı ziyaret edebilirsiniz.',
      robots: 'noindex, follow'
    });
    window.scrollTo(0, 0);
  }, []);

  const popularRoutes = [
    { title: 'Bayi Toplantısı Organizasyonu', path: '/bayi-toplantisi-organizasyonu', tag: 'En Çok Tercih Edilen' },
    { title: 'Şirket Toplantısı Organizasyonu', path: '/sirket-toplantisi-organizasyonu', tag: 'Kurumsal' },
    { title: 'Kongre & Konferans Yönetimi', path: '/kongre-organizasyonu', tag: 'MICE' },
    { title: 'Kurumsal Piknik & Etkinlik', path: '/kurumsal-piknik-organizasyonu', tag: 'Açık Hava' },
    { title: 'Kamu & Protokol Organizasyonu', path: '/kamu-organizasyonu', tag: 'Resmi' },
    { title: '81 İl Şehir Rehberi', path: '/sehirler', tag: 'Türkiye Geneli' }
  ];

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-[85vh] flex items-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* 404 Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 text-xs font-bold uppercase tracking-wider mb-6">
          <Compass size={14} className="text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Hata Kodu 404 • Sayfa Bulunamadı</span>
        </div>

        {/* Big 404 Heading */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-slate-900 font-display tracking-tight mb-4">
          4<span className="text-amber-600">0</span>4
        </h1>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 font-display mb-3">
          Aradığınız Sayfa Mevcut Değil veya Taşınmış Olabilir
        </h2>

        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed mb-8">
          Ulaşmaya çalıştığınız bağlantı güncellenmiş veya yazım hatası yapılmış olabilir. 
          Aşağıdaki popüler bağlantılardan devam edebilir veya doğrudan kurumsal temsilcimizle iletişime geçebilirsiniz.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl gold-gradient-bg text-slate-950 font-bold text-sm shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
          >
            <Home size={16} />
            <span>Ana Sayfaya Dön</span>
          </Link>

          {onOpenQuoteModal && (
            <button
              onClick={() => onOpenQuoteModal()}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition transform hover:-translate-y-0.5 shadow-md"
            >
              <Sparkles size={16} className="text-amber-400" />
              <span>Hızlı Teklif Al (2 Saat)</span>
            </button>
          )}

          <a
            href="tel:+905320550945"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100 transition"
          >
            <Phone size={16} className="text-amber-600" />
            <span>0532 055 09 45</span>
          </a>
        </div>

        {/* Popular Links Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm text-left">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
            <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
              <Building2 size={16} className="text-amber-600" />
              <span>Popüler Organizasyon Çözümleri</span>
            </h3>
            <span className="text-xs text-slate-400">Hızlı Erişim</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {popularRoutes.map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                className="group flex flex-col justify-between p-3.5 rounded-xl border border-slate-100 hover:border-amber-300 hover:bg-amber-50/30 transition"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>{item.tag}</span>
                  <ArrowRight size={12} className="text-slate-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition" />
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-amber-700 transition">
                  {item.title}
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
