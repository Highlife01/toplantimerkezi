import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../services/storageService';
import SectionTitle from '../components/common/SectionTitle';
import UrgentEventBanner from '../components/common/UrgentEventBanner';
import { updatePageSeo } from '../services/seoService';
import { Phone, Mail, MapPin, MessageSquare, Clock, ShieldCheck, Building2 } from 'lucide-react';

export default function ContactPage({ onOpenQuoteModal }) {
  const settings = storageService.getSettings();

  useEffect(() => {
    updatePageSeo({
      title: 'İletişim & Kurumsal Merkez | Toplantı Merkezi',
      description: 'Toplantı Merkezi genel merkez iletişim bilgileri, 81 il kurumsal operasyon masası telefon ve WhatsApp hatları.',
      canonicalUrl: 'https://www.toplantimerkezi.com.tr/iletisim'
    });
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-28 pb-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-8">
          <Link to="/" className="hover:text-amber-700">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-amber-800 font-bold">İletişim</span>
        </div>

        <SectionTitle
          badge="Kurumsal İletişim Masası"
          title="Bizimle İletişime Geçin"
          subtitle="Türkiye genelindeki tüm kurumsal organizasyon ve toplantı talepleriniz için uzman ekibimiz bir telefon uzağınızda."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Left Direct Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Phone */}
            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md hover:shadow-xl hover:border-amber-400/50 transition-all flex items-start gap-4 group block"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                <Phone size={22} />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Çağrı Merkezi & Operasyon</span>
                <h3 className="text-xl font-bold text-slate-900 font-display group-hover:text-amber-700 transition mt-0.5">
                  {settings.phone}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Hafta içi & Hafta sonu: 08:30 – 21:00</p>
              </div>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${settings.whatsappPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Merhaba Toplantı Merkezi, kurumsal organizasyonumuz için teklif almak istiyoruz.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md hover:shadow-xl hover:border-emerald-400/50 transition-all flex items-start gap-4 group block"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                <MessageSquare size={22} />
              </div>
              <div>
                <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider block">WhatsApp Hızlı Teklif Hattı</span>
                <h3 className="text-xl font-bold text-slate-900 font-display group-hover:text-emerald-700 transition mt-0.5">
                  {settings.whatsappPhone}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Ortalama yanıt süresi: ~5 dakika</p>
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${settings.email}`}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md hover:shadow-xl hover:border-amber-400/50 transition-all flex items-start gap-4 group block"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                <Mail size={22} />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Kurumsal E-posta</span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display group-hover:text-blue-700 transition mt-0.5">
                  {settings.email}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Resmi şartname ve ihale dosyaları için</p>
              </div>
            </a>

            {/* Address */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center shrink-0">
                <MapPin size={22} />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Genel Merkez Adresi</span>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  {settings.address}
                </p>
                <span className="text-xs text-slate-500 mt-1 block">81 İl Yerel Operasyon Ağı</span>
              </div>
            </div>

          </div>

          {/* Right Direct Message Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-md space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-display">
                Doğrudan Mesaj Gönderin
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Etkinlik danışmanlarımız talebiniz doğrultusunda aynı gün içinde dönüş yapacaktır.
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); alert('Mesajınız başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğiz.'); }} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Adınız Soyadınız *</label>
                  <input
                    type="text"
                    required
                    placeholder="Adınız Soyadınız"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Firma / Kurum Adı *</label>
                  <input
                    type="text"
                    required
                    placeholder="Firma Adı"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Telefon Numaranız *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0532 000 00 00"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">E-posta Adresiniz *</label>
                  <input
                    type="email"
                    required
                    placeholder="ad@sirket.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Mesajınız / Organizasyon Detayları</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Planlanan etkinlik tarihi, katılımcı sayısı ve özel taleplerinizi yazabilirsiniz..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl gold-gradient-bg text-slate-950 font-extrabold text-sm shadow-md hover:scale-102 transition"
              >
                Mesajı Gönder
              </button>
            </form>
          </div>

        </div>

      </div>

      <UrgentEventBanner onOpenQuoteModal={onOpenQuoteModal} />
    </div>
  );
}
