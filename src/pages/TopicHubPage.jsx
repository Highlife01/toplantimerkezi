import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TOPIC_HUBS, SEO_CLUSTERS } from '../data/seoClustersData';
import SectionTitle from '../components/common/SectionTitle';
import UrgentEventBanner from '../components/common/UrgentEventBanner';
import { updatePageSeo } from '../services/seoService';
import { BookOpen, Clock, Tag, ArrowRight, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function TopicHubPage({ onOpenQuoteModal }) {
  const { hubSlug } = useParams();
  const hub = TOPIC_HUBS.find(h => h.slug === hubSlug) || TOPIC_HUBS[0];
  const cluster = SEO_CLUSTERS.find(c => c.id === hub.relatedCluster) || SEO_CLUSTERS[0];

  useEffect(() => {
    updatePageSeo({
      title: `${hub.title} | Toplantı Merkezi Rehber`,
      description: hub.metaDesc,
      canonicalUrl: `https://www.toplantimerkezi.com.tr/rehber/${hub.slug}`,
      breadcrumbs: [
        { name: 'Ana Sayfa', url: '/' },
        { name: 'Rehberler', url: '/rehber/bayi-toplantisi-rehberi' },
        { name: hub.title, url: `/rehber/${hub.slug}` }
      ],
      schemaType: 'Article',
      schemaData: {
        headline: hub.title,
        description: hub.metaDesc,
        author: {
          '@type': 'Organization',
          name: 'Toplantı Merkezi Kurumsal Masası',
          url: 'https://www.toplantimerkezi.com.tr'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Toplantı Merkezi',
          logo: {
            '@type': 'ImageObject',
            url: 'https://www.toplantimerkezi.com.tr/pwa-192x192.svg'
          }
        },
        mainEntityOfPage: `https://www.toplantimerkezi.com.tr/rehber/${hub.slug}`
      }
    });
    window.scrollTo(0, 0);
  }, [hub, hubSlug]);

  return (
    <div className="pt-28 pb-20 bg-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-amber-800">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-slate-400">Rehberler</span>
          <span>/</span>
          <span className="text-amber-900 font-bold">{hub.title}</span>
        </div>

        {/* Header */}
        <div className="space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold">
            <BookOpen size={13} />
            <span>{hub.category} Topic Hub Rehberi</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-950 font-display leading-tight">
            {hub.title}
          </h1>

          <div className="flex items-center gap-3 text-xs text-slate-500 pt-2 border-b border-slate-200 pb-4">
            <span className="flex items-center gap-1">
              <Clock size={13} className="text-amber-700" />
              {hub.readingTime}
            </span>
            <span>•</span>
            <span className="text-slate-700 font-semibold">Toplantı Merkezi B2B Editoryal Ekibi</span>
          </div>
        </div>

        {/* Pillar Article Body */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-md space-y-8 mb-12">
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6 text-sm sm:text-base">
            <p className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed">
              {hub.metaDesc}
            </p>

            <h2 className="text-2xl font-bold text-slate-950 font-display pt-4 border-t border-slate-100">
              1. İhtiyaç Analizi ve Bütçe Çerçevesi
            </h2>
            <p>
              Kurumsal organizasyonlarda en sık yapılan hata, teknik ihtiyaçlar ve katılımcı profili tam olarak analiz edilmeden mekân sözleşmesi yapılmasıdır. Mekânın tavan yüksekliği, elektrik altyapısı (kaç kW jeneratör gerektiği) ve fuaye akreditasyon alanları en baştan projelendirilmelidir.
            </p>

            <h2 className="text-2xl font-bold text-slate-950 font-display pt-4 border-t border-slate-100">
              2. Sahne, Dev LED Ekran ve Akustik Ses Tasarımı
            </h2>
            <p>
              Sunumların net okunabilmesi için pikseller arası mesafe (Pitch) salon derinliğine göre P2.6 veya P3.9 olarak seçilmelidir. Konuşmacıların sahnede rahat hareket edebilmesi için telsiz yaka mikrofonları ve yedekli reji masaları kurulmalıdır.
            </p>

            <h2 className="text-2xl font-bold text-slate-950 font-display pt-4 border-t border-slate-100">
              3. Tek Merkezden Koordinasyonun Önemi
            </h2>
            <p>
              Otel, sahne, ses, LED, catering, hostes ve transferi ayrı ayrı tedarikçilerden temin etmek ciddi koordinasyon kopukluklarına ve maliyet aşımlarına yol açar. Toplantı Merkezi olarak tüm bu adımları tek bir muhatap ve tek bir şeffaf sözleşme ile yönetiyoruz.
            </p>
          </div>

          {/* Connected Money Pages in this Hub Cluster */}
          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-300 space-y-4">
            <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wider">
              Bu Konuyla İlgili Hizmet & Teklif Sayfalarımız:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cluster.pages.map(page => (
                <Link
                  key={page.slug}
                  to={`/${page.slug}`}
                  className="p-3 bg-white rounded-xl border border-amber-200 hover:border-amber-400 text-xs font-bold text-slate-900 hover:text-amber-900 transition flex items-center justify-between shadow-2xs"
                >
                  <span>{page.title}</span>
                  <ArrowRight size={13} className="text-amber-700" />
                </Link>
              ))}
            </div>
          </div>

          {/* Hub Call to Action */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm text-slate-900">Organizasyonunuz İçin Teklif Alın</h4>
              <p className="text-xs text-slate-500">2 saat içinde resmi fiyat tablonuzu iletelim.</p>
            </div>
            <button
              onClick={() => onOpenQuoteModal({ initialOrgType: hub.category })}
              className="px-6 py-3 rounded-xl gold-gradient-bg text-slate-950 font-extrabold text-xs shadow-md hover:scale-105 transition"
            >
              Hemen Teklif Al
            </button>
          </div>
        </div>

      </div>

      <UrgentEventBanner onOpenQuoteModal={onOpenQuoteModal} />
    </div>
  );
}
