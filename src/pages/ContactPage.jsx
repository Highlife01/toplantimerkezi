import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../services/storageService';
import SectionTitle from '../components/common/SectionTitle';
import UrgentEventBanner from '../components/common/UrgentEventBanner';
import { updatePageSeo } from '../services/seoService';
import { Phone, Mail, MapPin, MessageSquare, Clock, ShieldCheck, Building2, CheckCircle2, Bot, AlertCircle } from 'lucide-react';

export default function ContactPage({ onOpenQuoteModal }) {
  const settings = storageService.getSettings();
  const [formData, setFormData] = useState({
    contactName: '',
    company: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [submitStatus, setSubmitStatus] = useState({ state: 'idle', trackingId: '', error: '' });

  useEffect(() => {
    updatePageSeo({
      title: 'İletişim & Kurumsal Merkez | 81 İl Operasyon Masası',
      description: 'Toplantı Merkezi genel merkez iletişim bilgileri, 81 il kurumsal operasyon masası telefon ve WhatsApp hatları. 7/24 kurumsal destek.',
      canonicalUrl: 'https://www.toplantimerkezi.com.tr/iletisim',
      breadcrumbs: [
        { name: 'Ana Sayfa', url: '/' },
        { name: 'İletişim', url: '/iletisim' }
      ],
      schemaType: 'ContactPage',
      schemaData: {
        name: 'Toplantı Merkezi İletişim',
        description: 'Kurumsal toplantı ve etkinlik yönetimi iletişim masası.',
        url: 'https://www.toplantimerkezi.com.tr/iletisim',
        mainEntity: {
          '@type': 'Organization',
          name: 'Toplantı Merkezi',
          telephone: '+90 532 055 09 45',
          email: 'info@toplantimerkezi.com.tr',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Büyükdere Cad. No:199 Levent / Maslak Plaza',
            addressLocality: 'Levent, Beşiktaş',
            addressRegion: 'İstanbul',
            postalCode: '34394',
            addressCountry: 'TR'
          }
        }
      }
    });
    window.scrollTo(0, 0);
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ state: 'submitting', trackingId: '', error: '' });
    try {
      const created = await storageService.addLead({
        contactName: formData.contactName.trim(),
        company: formData.company.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        notes: formData.notes.trim(),
        organizationType: 'Kurumsal İletişim Talebi',
        city: 'İstanbul',
        attendees: 100,
        budgetRange: 'Belirtilmedi'
      });
      setSubmitStatus({
        state: 'success',
        trackingId: created?.id || '',
        accessToken: created?.accessToken || '',
        error: ''
      });
      setFormData({ contactName: '', company: '', phone: '', email: '', notes: '' });
    } catch (err) {
      setSubmitStatus({
        state: 'error',
        trackingId: '',
        accessToken: '',
        error: err?.message || 'Talebiniz iletilirken bir sorun oluştu. Lütfen doğrudan 0532 055 09 45 hattımızdan bize ulaşın.'
      });
    }
  };

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

        {/* GEO Direct Answer Summary */}
        <div
          data-geo-answer="true"
          className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-300 shadow-md mb-12 flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-2xl gold-gradient-bg flex items-center justify-center shrink-0 shadow-sm text-slate-950">
            <Bot size={20} />
          </div>
          <div className="space-y-1.5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900 block">
              Kurumsal Merkez & 81 İl Koordinasyon Bilgileri
            </span>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Toplantı Merkezi Genel Merkezi; Büyükdere Cad. No:199 Levent / Beşiktaş, İstanbul adresinde yer almakta olup 0532 055 09 45 kurumsal çağrı merkezi, WhatsApp hızlı teklif hattı ve info@toplantimerkezi.com.tr resmi e-posta kanalı üzerinden Türkiye’nin 81 ilindeki B2B toplantı, bayi zirvesi, kongre ve kurumsal etkinlik taleplerine 2 saat içinde resmi teklif yanıtı sağlar.
            </p>
          </div>
        </div>

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

            {submitStatus.state === 'success' && (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <span>Mesajınız ve kurumsal talebiniz başarıyla kaydedildi!</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Operasyon masamız en kısa sürede sizinle iletişime geçecektir.
                  {submitStatus.trackingId && (
                    <>
                      {' '}Talep Kodunuz: <strong className="font-mono">{submitStatus.trackingId}</strong>
                      {submitStatus.accessToken && (
                        <> | Güvenlik Anahtarı: <strong className="font-mono select-all">{submitStatus.accessToken}</strong></>
                      )}
                      {' '}—{' '}
                      <Link
                        to={`/teklif-takip?kod=${encodeURIComponent(submitStatus.trackingId)}&token=${encodeURIComponent(submitStatus.accessToken || '')}`}
                        className="underline font-bold"
                      >
                        Güvenli Takip Portalı
                      </Link>
                    </>
                  )}
                </p>
              </div>
            )}

            {submitStatus.state === 'error' && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-2.5 text-xs">
                <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                <span>{submitStatus.error}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Adınız Soyadınız *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="Adınız Soyadınız"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Firma / Kurum Adı *</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
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
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0532 000 00 00"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">E-posta Adresiniz *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Planlanan etkinlik tarihi, katılımcı sayısı ve özel taleplerinizi yazabilirsiniz..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitStatus.state === 'submitting'}
                className="w-full py-3.5 rounded-xl gold-gradient-bg text-slate-950 font-extrabold text-sm shadow-md hover:scale-102 transition disabled:opacity-60"
              >
                {submitStatus.state === 'submitting' ? 'Gönderiliyor...' : 'Mesajı Gönder'}
              </button>
            </form>
          </div>

        </div>

      </div>

      <UrgentEventBanner onOpenQuoteModal={onOpenQuoteModal} />
    </div>
  );
}
