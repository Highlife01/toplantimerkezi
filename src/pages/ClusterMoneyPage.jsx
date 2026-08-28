import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { SEO_CLUSTERS } from '../data/seoClustersData';
import { PROMINENT_CITIES } from '../data/citiesData';
import SectionTitle from '../components/common/SectionTitle';
import UrgentEventBanner from '../components/common/UrgentEventBanner';
import { updatePageSeo } from '../services/seoService';
import { analytics } from '../services/analyticsService';
import { 
  Sparkles, CheckCircle2, MapPin, Users, Calendar, 
  HelpCircle, ArrowRight, ShieldCheck, DollarSign, 
  Layers, Tv, Volume2, Utensils, Award, Clock, ChevronRight
} from 'lucide-react';

export default function ClusterMoneyPage({ onOpenQuoteModal }) {
  const { pageSlug } = useParams();
  const location = useLocation();
  const rawPath = location.pathname.replace(/^\/|\/$/g, '');

  // Find page across all 5 clusters
  let matchedPage = null;
  let matchedCluster = null;

  for (const cluster of SEO_CLUSTERS) {
    const found = cluster.pages.find(p => p.slug === pageSlug || p.slug === rawPath);
    if (found) {
      matchedPage = found;
      matchedCluster = cluster;
      break;
    }
  }

  // Fallback to primary if not explicitly matching
  if (!matchedPage) {
    matchedCluster = SEO_CLUSTERS[0];
    matchedPage = matchedCluster.pages[0];
  }

  useEffect(() => {
    updatePageSeo({
      title: matchedPage.seoTitle,
      description: matchedPage.metaDesc,
      canonicalUrl: `https://www.toplantimerkezi.com.tr/${matchedPage.slug}`,
      schemaType: 'Service',
      schemaData: {
        serviceType: matchedPage.title,
        provider: {
          '@type': 'Organization',
          name: 'Toplantı Merkezi'
        },
        description: matchedPage.aiDirectAnswer,
        areaServed: 'Turkey'
      }
    });
    analytics.serviceView(matchedPage.slug, matchedPage.title);
    window.scrollTo(0, 0);
  }, [matchedPage]);

  // Is this the primary Bayi Toplantısı Money Page?
  const isBayiPage = matchedPage.slug.includes('bayi-toplantisi');
  const isSirketPage = matchedPage.slug.includes('sirket-toplantisi');
  const isPiknikPage = matchedPage.slug.includes('piknik');

  return (
    <div className="pt-28 pb-20 bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-amber-800 font-medium">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-slate-400">{matchedCluster.name}</span>
          <span>/</span>
          <span className="text-amber-900 font-bold">{matchedPage.title}</span>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 md:p-16 border border-slate-200 shadow-xl mb-12 relative overflow-hidden">
          <div className="max-w-3xl space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping"></span>
              <span>81 İlde Türkiye Geneli Kurumsal Çözüm • Tek Merkezden Yönetim</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-950 font-display leading-[1.15]">
              {matchedPage.h1}
            </h1>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              {matchedPage.metaDesc}
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  analytics.quoteFormStart(matchedPage.title, 'Türkiye Geneli');
                  onOpenQuoteModal({ initialOrgType: matchedPage.title });
                }}
                className="px-7 py-4 rounded-2xl gold-gradient-bg text-slate-950 font-extrabold text-sm sm:text-base shadow-md hover:scale-105 transition flex items-center gap-2"
              >
                <Sparkles size={18} />
                <span>Teklif Alın & Planlayalım</span>
                <ArrowRight size={18} />
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-600 font-bold bg-slate-100 px-4 py-3 rounded-xl border border-slate-200">
                <Users size={16} className="text-amber-700" />
                <span>Hedef Katılımcı: {matchedPage.targetAttendees}</span>
              </div>
            </div>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none hidden lg:block"></div>
        </div>

        {/* AI DIRECT ANSWER BLOCK (Entity Optimized for ChatGPT, Gemini, Copilot, Perplexity) */}
        <div className="bg-amber-500/10 border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 mb-12 shadow-sm">
          <div className="flex items-center gap-2.5 text-xs font-extrabold text-amber-900 uppercase tracking-wider mb-2">
            <Sparkles size={16} className="text-amber-700" />
            <span>AI Doğrudan Bilgi Bloğu (Semantic Entity Definition)</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-950 font-display mb-2">
            {matchedPage.title} Nedir ve Nasıl Yönetilir?
          </h2>
          <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
            {matchedPage.aiDirectAnswer}
          </p>
        </div>

        {/* 2-Column Main Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Main 14 Section Money Content */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Detailed Sub-Types */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
              <h2 className="text-xl font-bold text-slate-950 font-display">
                {matchedPage.title} Kapsamında Yönettiğimiz Formatlar
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {matchedPage.subTypes.map((sub, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-amber-700 shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-slate-900">{sub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bayi Specific 14 Section Deep Dive */}
            {isBayiPage && (
              <div className="space-y-8">
                
                {/* 01. Planlama */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
                  <h2 className="text-xl font-bold text-slate-950 font-display">
                    Bayi Toplantısı Nasıl Planlanır? (Adım Adım Operasyon)
                  </h2>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Başarılı bir bayi toplantısı planlaması, etkinliğin gerçekleşeceği tarihten en az 2–4 ay önce başlatılmalıdır. İlk adımda katılımcı sayısı, konaklama ihtiyacı ve hedef lokasyon (Antalya, İstanbul, Kıbrıs veya bölgesel merkezler) netleştirilir.
                  </p>
                  <div className="space-y-2.5 pt-2">
                    {[
                      '01. İhtiyaç Analizi ve Bütçe Çerçevesinin Çıkarılması',
                      '02. Kolonsuz ve Yüksek Tavanlı 5 Yıldızlı Kongre Oteli Rezervasyonu',
                      '03. 3D Sahne, Dev LED Ekran ve Podyum Tasarımı',
                      '04. Uçak, VIP Havalimanı Karşılama ve Ring Transfer Lojistiği',
                      '05. Gündüz Toplantı Oturumları ve İnteraktif Sunum Akışı',
                      '06. Akşam Gala Yemeği, Ünlü Sanatçı ve Plaket/Ödül Töreni'
                    ].map((step, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800">
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 02. Mekan Secimi */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
                  <h2 className="text-xl font-bold text-slate-950 font-display">
                    Bayi Toplantısı İçin Mekân & Otel Seçim Kriterleri
                  </h2>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Bayi toplantılarında salonun mimari yapısı kritik önemdedir. Sahneye araç veya makine çıkarılacaksa kapı giriş ölçüleri ve yük asansörleri denetlenir. Kolonsuz salonlar ve ferah fuaye alanları tercih edilir.
                  </p>
                </div>

                {/* 03. Maliyet Hesabi */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
                  <h2 className="text-xl font-bold text-slate-950 font-display">
                    Bayi Toplantısı Maliyeti Neye Göre Belirlenir?
                  </h2>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Bayi toplantısı bütçesi temel olarak 7 ana maliyet kaleminden oluşur: Otel konaklama/salon kirası, catering & banket menüleri, sahne & dekor, LED ekran & reji, profesyonel ses & ışık sistemleri, transfer/uçak biletleri ve sanatçı/sunucu kaşeleri. Toplantı Merkezi olarak tüm bu kalemleri şeffaf bütçe tablosunda sunuyoruz.
                  </p>
                </div>

                {/* 04. Tercih Edilen Sehirler */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
                  <h2 className="text-xl font-bold text-slate-950 font-display">
                    Bayi Toplantısı İçin En Çok Tercih Edilen Şehirler
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {[
                      { city: 'Antalya (Belek/Kundu)', desc: 'Her şey dahil kongre otelleri' },
                      { city: 'İstanbul', desc: 'Uluslararası ulaşım ve prestij' },
                      { city: 'İzmir & Çeşme', desc: 'Ege sahili ve konsept oteller' },
                      { city: 'Kıbrıs', desc: 'Geniş kapasiteli gala salonları' }
                    ].map((dest, i) => (
                      <div key={i} className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                        <div className="font-bold text-xs text-amber-950">{dest.city}</div>
                        <div className="text-[11px] text-amber-800 mt-1">{dest.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Comprehensive FAQ Section */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-950 font-display flex items-center gap-2">
                <HelpCircle size={22} className="text-amber-700" />
                <span>Sıkça Sorulan Sorular (SSS)</span>
              </h2>

              <div className="space-y-4">
                {(isBayiPage ? [
                  { q: 'Bayi toplantısı nasıl organize edilir?', a: 'Öncelikle katılımcı sayısı, tarih ve konaklama tercihi belirlenir. Ardından otel salonu opsiyonlanır, sahne ve LED ekran tasarımı tamamlanır, ulaşım-transfer planlaması yapılır ve gala gecesi sanatçı/ödül programı kurgulanır.' },
                  { q: 'Bayi toplantısı kaç gün sürer?', a: 'Kurumsal bayi toplantıları genellikle 2 gün 1 gece veya 3 gün 2 gece konaklamalı olarak düzenlenir. Gündüz iş ve strateji oturumları, akşam ise gala gecesi yapılır.' },
                  { q: 'Bayi toplantısı için hangi şehirler tercih edilir?', a: 'Antalya (Belek, Kundu, Kemer), İstanbul, İzmir (Çeşme), Bodrum ve Kıbrıs en çok tercih edilen destinasyonlardır.' },
                  { q: 'Bayi toplantısı maliyeti ne kadar?', a: 'Maliyet kişi sayısı, otel sınıfı (5 yıldız), sahne prodüksiyonunun büyüklüğü ve sanatçı tercihine göre değişir. Toplantı Merkezi şeffaf kalem kalem bütçe sunar.' },
                  { q: '100 kişilik bayi toplantısı nasıl planlanır?', a: '100 kişilik gruplar için 150-200 m² kolonsuz salon, P2.6 yüksek çözünürlüklü LED ekran, profesyonel ses sistemi ve VIP akşam yemeği idealdir.' },
                  { q: '500 kişilik bayi toplantısı nasıl organize edilir?', a: '500 kişi için en az 600-800 m² ana salon, 3-4 adet workshop odası, fuaye kayıt masaları, çift LED ekran reji ve geniş gala sahnesi planlanır.' },
                  { q: 'Bayi toplantısı için otel nasıl seçilir?', a: 'Havalimanına yakınlık, salon tavan yüksekliği (min. 4.5m), kolonsuz mimari, oda kalitesi ve teknik altyapı kapasitesine göre seçilir.' },
                  { q: 'Bayi toplantısı için ne kadar önce planlama yapılmalıdır?', a: 'En iyi otel ve salon opsiyonlarını uygun fiyatla garantilemek için en az 2 ila 4 ay öncesinden planlamaya başlanması önerilir.' }
                ] : [
                  { q: `${matchedPage.title} için nasıl teklif alabilirim?`, a: 'Sayfamızdaki hızlı teklif formunu doldurarak veya 850’li çağrı merkezimiz üzerinden 2 saat içinde detaylı maliyet tablosu alabilirsiniz.' },
                  { q: 'Türkiye genelinde hangi illerde hizmet veriyorsunuz?', a: 'İstanbul, Ankara, İzmir, Antalya, Adana, Bursa dahil 81 ilin tamamında yerel teknik ortaklarımızla hizmet sunuyoruz.' },
                  { q: 'Teklif sürecinde sahne ve 3D tasarım desteği veriliyor mu?', a: 'Evet, kurumsal etkinlikleriniz için 3D salon ve sahne görselleştirmesi teklif dosyanıza dahil olarak hazırlanır.' }
                ]).map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <h3 className="text-sm font-bold text-slate-900">{faq.q}</h3>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sticky Conversion Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-amber-500/60 shadow-xl space-y-6 sticky top-28">
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider block">Hemen Fiyat Alın</span>
                <h3 className="text-xl font-bold text-slate-950 font-display">
                  {matchedPage.title} Bütçesi Hesaplayalım
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Şehir ve kişi sayınızı girin; 2 saat içinde otel, sahne, LED ve catering dahil resmi teklifinizi iletelim.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 size={15} className="text-emerald-700" />
                  <span>81 İlde Geçerli Sabit Fiyat Garantisi</span>
                </div>
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 size={15} className="text-emerald-700" />
                  <span>Tek Sözleşme & Şeffaf Bütçeleme</span>
                </div>
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 size={15} className="text-emerald-700" />
                  <span>2 Saatte Resmi PDF Teklif Çıktısı</span>
                </div>
              </div>

              <button
                onClick={() => {
                  analytics.quoteFormStart(matchedPage.title, 'Sidebar');
                  onOpenQuoteModal({ initialOrgType: matchedPage.title });
                }}
                className="w-full py-4 rounded-2xl gold-gradient-bg text-slate-950 font-extrabold text-sm shadow-md hover:scale-105 transition flex items-center justify-center gap-2"
              >
                <Sparkles size={18} />
                <span>Teklif Formunu Başlat</span>
              </button>

              {/* Related Pages in this Cluster */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  İlgili Sayfalar & Modüller:
                </h4>
                <div className="space-y-1">
                  {matchedCluster.pages.filter(p => p.slug !== matchedPage.slug).map(p => (
                    <Link
                      key={p.slug}
                      to={`/${p.slug}`}
                      className="block p-2 rounded-xl text-xs text-slate-700 hover:text-amber-900 hover:bg-amber-50/50 font-medium transition"
                    >
                      • {p.title}
                    </Link>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      <UrgentEventBanner onOpenQuoteModal={onOpenQuoteModal} />
    </div>
  );
}
