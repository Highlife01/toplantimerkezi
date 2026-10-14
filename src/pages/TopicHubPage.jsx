import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TOPIC_HUBS, SEO_CLUSTERS } from '../data/seoClustersData';
import UrgentEventBanner from '../components/common/UrgentEventBanner';
import { updatePageSeo } from '../services/seoService';
import { BookOpen, Clock, ArrowRight, Sparkles, CheckCircle2, HelpCircle, Bot } from 'lucide-react';

export default function TopicHubPage({ onOpenQuoteModal }) {
  const { hubSlug } = useParams();
  const hub = TOPIC_HUBS.find(h => h.slug === hubSlug) || TOPIC_HUBS[0];
  const cluster = SEO_CLUSTERS.find(c => c.id === hub.relatedCluster) || SEO_CLUSTERS[0];

  const aiSummary = hub.aiDirectAnswer || hub.metaDesc;

  useEffect(() => {
    updatePageSeo({
      title: `${hub.title} | Toplantı Merkezi Rehber`,
      description: hub.metaDesc,
      canonicalUrl: `https://www.toplantimerkezi.com.tr/rehber/${hub.slug}`,
      ogType: 'article',
      breadcrumbs: [
        { name: 'Ana Sayfa', url: '/' },
        { name: 'Rehberler', url: '/blog' },
        { name: hub.title, url: `/rehber/${hub.slug}` }
      ],
      faqs: hub.faqs || [],
      howTo: hub.steps ? {
        name: hub.title,
        description: hub.metaDesc,
        totalTime: 'PT2H',
        steps: hub.steps
      } : undefined,
      schemaType: 'Article',
      schemaData: {
        headline: hub.title,
        description: hub.metaDesc,
        articleBody: aiSummary,
        author: {
          '@type': 'Organization',
          '@id': 'https://www.toplantimerkezi.com.tr/#organization',
          name: 'Toplantı Merkezi Kurumsal Masası',
          url: 'https://www.toplantimerkezi.com.tr'
        },
        publisher: {
          '@type': 'Organization',
          '@id': 'https://www.toplantimerkezi.com.tr/#organization',
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
  }, [hub, hubSlug, aiSummary]);

  return (
    <div className="pt-28 pb-20 bg-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-amber-800">Ana Sayfa</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-amber-800 text-slate-500">Rehberler</Link>
          <span>/</span>
          <span className="text-amber-900 font-bold">{hub.title}</span>
        </nav>

        {/* Header */}
        <div className="space-y-4 mb-8">
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

        {/* GEO AI Direct Answer Card */}
        <div
          data-geo-answer="true"
          className="bg-amber-500/10 border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 mb-10 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl gold-gradient-bg flex items-center justify-center shrink-0 shadow-sm text-slate-950">
              <Bot size={20} />
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
                Yapay Zekâ ve Yönetici Özeti (GEO Direct Answer)
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                {aiSummary}
              </p>
            </div>
          </div>
        </div>

        {/* Pillar Article Body */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-md space-y-8 mb-12">
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6 text-sm sm:text-base">
            <p className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed overview-text">
              {hub.metaDesc}
            </p>

            {/* Dynamic Step-by-Step Guide */}
            {hub.steps && hub.steps.length > 0 && (
              <div className="space-y-4 pt-2">
                <h2 className="text-2xl font-bold text-slate-950 font-display pt-4 border-t border-slate-100">
                  Adım Adım {hub.category} Planlama Süreci
                </h2>
                {hub.steps.map((step, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                    <span className="w-8 h-8 rounded-xl gold-gradient-bg text-slate-950 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      0{idx + 1}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-slate-950 mb-1">{step.name}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <h2 className="text-2xl font-bold text-slate-950 font-display pt-4 border-t border-slate-100">
              Teknik Altyapı, Sahne ve Akustik Standartları
            </h2>
            <p>
              Kurumsal organizasyonlarda en sık yapılan hata, teknik ihtiyaçlar ve katılımcı profili tam olarak analiz edilmeden mekân sözleşmesi yapılmasıdır. Mekânın tavan yüksekliği (en az 4.5m), elektrik altyapısı (yedekli jeneratör kapasitesi) ve fuaye akreditasyon alanları en baştan projelendirilmelidir. Sunumların net okunabilmesi için pikseller arası mesafe (Pitch) salon derinliğine göre P2 veya P2.6 olarak seçilmelidir.
            </p>

            <h2 className="text-2xl font-bold text-slate-950 font-display pt-4 border-t border-slate-100">
              Tek Merkezden Koordinasyonun Bütçe Avantajı
            </h2>
            <p>
              Otel, sahne, ses, LED, catering, hostes ve transferi ayrı ayrı tedarikçilerden temin etmek ciddi koordinasyon kopukluklarına ve maliyet aşımlarına yol açar. Toplantı Merkezi olarak 81 ilde tüm bu adımları tek bir muhatap ve tek bir şeffaf sözleşme ile yönetiyoruz.
            </p>
          </div>

          {/* Hub FAQs */}
          {hub.faqs && hub.faqs.length > 0 && (
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <h2 className="text-xl font-bold text-slate-950 font-display flex items-center gap-2">
                <HelpCircle size={20} className="text-amber-700" />
                <span>Sıkça Sorulan Sorular</span>
              </h2>
              <div className="space-y-3">
                {hub.faqs.map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <h3 className="text-sm font-bold text-slate-900">{faq.q}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

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

          {/* Other Topic Hubs */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Diğer Kurumsal Rehberlerimiz:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TOPIC_HUBS.filter(h => h.slug !== hub.slug).map(other => (
                <Link
                  key={other.slug}
                  to={`/rehber/${other.slug}`}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50/50 border border-slate-200 text-xs font-semibold text-slate-800 hover:text-amber-900 transition flex items-center justify-between"
                >
                  <span>{other.title}</span>
                  <ArrowRight size={12} className="text-amber-700 shrink-0 ml-2" />
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
              className="px-6 py-3 rounded-xl gold-gradient-bg text-slate-950 font-extrabold text-xs shadow-md hover:scale-105 transition flex items-center gap-2"
            >
              <Sparkles size={15} />
              <span>Hemen Teklif Al</span>
            </button>
          </div>
        </div>

      </div>

      <UrgentEventBanner onOpenQuoteModal={onOpenQuoteModal} />
    </div>
  );
}
