import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../components/common/SectionTitle';
import UrgentEventBanner from '../components/common/UrgentEventBanner';
import { updatePageSeo } from '../services/seoService';
import { 
  Building2, ShieldCheck, Award, Users, Globe, 
  Target, Sparkles, CheckCircle2, ArrowRight 
} from 'lucide-react';

export default function CorporatePage({ onOpenQuoteModal }) {
  useEffect(() => {
    updatePageSeo({
      title: 'Kurumsal | Hakkımızda ve Kalite Standartlarımız | Toplantı Merkezi',
      description: 'Türkiye genelinde 81 ilde B2B kurumsal organizasyon ve toplantı yönetimi hizmeti veren Toplantı Merkezi hakkında kurumsal bilgiler ve kalite taahhütlerimiz.',
      canonicalUrl: 'https://www.toplantimerkezi.com.tr/kurumsal'
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
          <span className="text-amber-800 font-bold">Kurumsal</span>
        </div>

        <SectionTitle
          badge="Hakkımızda & Kurumsal Kimlik"
          title="Türkiye'nin Her Yerinde, Tek Merkezden Organizasyon"
          subtitle="Toplantıdan organizasyona, kurumsal şirketlerin ve kurumların tüm etkinlik süreçlerini tek elden ve sıfır risk disipliniyle yönetiyoruz."
        />

        {/* Story Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md mb-16 space-y-6">
          <div className="max-w-3xl space-y-4">
            <h3 className="text-2xl font-bold text-slate-900 font-display">
              B2B ve Kurumsal Organizasyonların Güvenilir Çözüm Ortağı
            </h3>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-normal">
              Toplantı Merkezi, bireysel organizasyonlar yerine yalnızca büyük ve orta ölçekli şirketlerin, holdinglerin, kamu kurumlarının, belediyelerin, bankaların ve bayilik sistemlerinin etkinlik ihtiyaçlarına odaklanmış profesyonel bir organizasyon yönetim platformudur.
            </p>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-normal">
              İstanbul, Ankara, İzmir, Antalya, Adana başta olmak üzere Türkiye'nin 81 ilindeki yerleşik teknik donanım ortaklarımız, 5 yıldızlı anlaşmalı otellerimiz ve kıdemli saha direktörlerimizle müşterilerimize tek sözleşme, tek muhatap ve şeffaf maliyet garantisi sunuyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-3xl font-extrabold text-amber-700 font-display">81 İl</div>
              <div className="text-xs text-slate-600 font-bold mt-1">Eşzamanlı Operasyon Gücü</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-3xl font-extrabold text-slate-900 font-display">500+</div>
              <div className="text-xs text-slate-600 font-bold mt-1">Yönetilen Kurumsal Proje</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-3xl font-extrabold text-emerald-600 font-display">%99.4</div>
              <div className="text-xs text-slate-600 font-bold mt-1">B2B Müşteri Memnuniyeti</div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center mb-2">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-display">Misyonumuz</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Şirketlerin ve kamu kurumlarının Türkiye'nin hangi ilinde olursa olsun zaman, bütçe ve operasyonel risk kaygısı taşımadan dünya standartlarında etkinlikler gerçekleştirmelerini sağlamak.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center mb-2">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-display">Vizyonumuz</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Türkiye'nin en kapsamlı, teknolojik ve güvenilir kurumsal organizasyon ağı olarak B2B etkinlik sektöründe şeffaflık ve mükemmeliyet standardını belirleyen lider marka olmak.
            </p>
          </div>
        </div>

        {/* Target Audience List */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md mb-16 space-y-6">
          <h3 className="text-xl font-bold text-slate-900 font-display text-center">
            Hizmet Verdiğimiz Başlıca Kurumsal Müşteri Grupları
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
            {[
              'Holdingler & Grup Şirketleri',
              'Büyük & Orta Ölçekli Şirketler',
              'Bayilik Ağı Olan Markalar',
              'Fabrikalar & Sanayi Kuruluşları',
              'Kamu Kurumları & Bakanlıklar',
              'Büyükşehir & İlçe Belediyeleri',
              'Ticaret Odaları & Borsalar',
              'Dernekler, Vakıflar & STK’lar',
              'Bankalar & Finans Kuruluşları',
              'Otomotiv & Yan Sanayi',
              'Sigorta & Reasürans',
              'İlaç, Sağlık & Biyoteknoloji',
              'Yazılım & Teknoloji Firmaları',
              'Eğitim & Üniversiteler'
            ].map((sector, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2">
                <CheckCircle2 size={15} className="text-amber-600 shrink-0" />
                <span>{sector}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <UrgentEventBanner onOpenQuoteModal={onOpenQuoteModal} />
    </div>
  );
}
