import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import QuoteWizardForm from '../components/quote/QuoteWizardForm';
import SectionTitle from '../components/common/SectionTitle';
import UrgentEventBanner from '../components/common/UrgentEventBanner';
import { updatePageSeo } from '../services/seoService';
import { Sparkles, ShieldCheck, Clock, CheckCircle2, Phone } from 'lucide-react';

export default function QuotePage() {
  useEffect(() => {
    updatePageSeo({
      title: 'Kurumsal Organizasyon Teklifi Al | 7 Adımda Hızlı Teklif Modülü',
      description: 'Bayi toplantısı, kongre, seminer, lansman ve kurumsal piknik organizasyonlarınız için 81 ilde geçerli resmi fiyat teklifi alın.',
      canonicalUrl: 'https://www.toplantimerkezi.com.tr/teklif-al'
    });
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-28 pb-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-8">
          <Link to="/" className="hover:text-amber-700">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-amber-800 font-bold">Teklif Al</span>
        </div>

        <SectionTitle
          badge="Hızlı Bütçe & Planlama Masası"
          title="Kurumsal Organizasyon Fiyat Teklifi Alın"
          subtitle="7 kısa adımda organizasyon detaylarınızı girin; 81 ildeki mekân ve teknik çözümlerimizle 2 saat içinde detaylı resmi teklifinizi iletelim."
        />

        {/* Wizard Card Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-slate-200 shadow-xl mb-14">
          <QuoteWizardForm />
        </div>

        {/* Trust Points */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16 text-center">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <Clock size={20} className="text-amber-600 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-slate-900 mb-1">2 Saatte Geri Dönüş</h4>
            <p className="text-xs text-slate-500">Talebiniz mesai saatleri içinde anında incelenir.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <ShieldCheck size={20} className="text-amber-600 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-slate-900 mb-1">Şeffaf Maliyet Garantisi</h4>
            <p className="text-xs text-slate-500">Sürpriz ek giderler olmadan denetlenebilir bütçe.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <CheckCircle2 size={20} className="text-amber-600 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-slate-900 mb-1">Tek Merkezden Yönetim</h4>
            <p className="text-xs text-slate-500">Mekân, sahne, ses ve personel tek muhatapta.</p>
          </div>
        </div>

      </div>

      <UrgentEventBanner />
    </div>
  );
}
