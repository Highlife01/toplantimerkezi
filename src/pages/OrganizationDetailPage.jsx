import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ORGANIZATIONS } from '../data/organizationsData';
import SectionTitle from '../components/common/SectionTitle';
import UrgentEventBanner from '../components/common/UrgentEventBanner';
import { updatePageSeo } from '../services/seoService';
import { 
  Building2, Users, Calendar, CheckCircle2, ChevronRight, 
  HelpCircle, ArrowRight, Sparkles, Phone, MessageSquare, ShieldCheck, Clock
} from 'lucide-react';

export default function OrganizationDetailPage({ onOpenQuoteModal }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const org = ORGANIZATIONS.find(o => o.slug === slug);

  useEffect(() => {
    if (org) {
      updatePageSeo({
        title: `${org.title} Organizasyonu`,
        description: `${org.shortDesc} 81 ilde profesyonel planlama, sahne, teknik ekipman ve mekân yönetimiyle tek merkezden kurumsal hizmet.`,
        canonicalUrl: `https://www.toplantimerkezi.com.tr/organizasyonlar/${org.slug}`,
        breadcrumbs: [
          { name: 'Ana Sayfa', url: '/' },
          { name: 'Organizasyonlar', url: '/organizasyonlar' },
          { name: org.title, url: `/organizasyonlar/${org.slug}` }
        ],
        faqs: org.faqs || undefined,
        schemaType: 'Service',
        schemaData: {
          serviceType: org.title,
          name: `${org.title} - Toplantı Merkezi`,
          provider: {
            '@type': 'Organization',
            name: 'Toplantı Merkezi',
            url: 'https://www.toplantimerkezi.com.tr',
            telephone: '+90 532 055 09 45'
          },
          areaServed: {
            '@type': 'Country',
            name: 'Turkey'
          },
          description: org.overview || org.shortDesc
        }
      });
      window.scrollTo(0, 0);
    }
  }, [org, slug]);

  if (!org) {
    return (
      <div className="min-h-screen pt-36 pb-20 text-center px-4 bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-900 font-display">Organizasyon Türü Bulunamadı</h2>
        <p className="text-sm text-slate-600 mt-2">Aradığınız kurumsal organizasyon kategorisi mevcut değil.</p>
        <Link to="/organizasyonlar" className="mt-6 inline-block px-6 py-3 rounded-xl gold-gradient-bg text-slate-950 font-bold text-xs">
          Tüm Organizasyonları Gör
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-amber-700">Ana Sayfa</Link>
          <span>/</span>
          <Link to="/organizasyonlar" className="hover:text-amber-700">Kurumsal Organizasyonlar</Link>
          <span>/</span>
          <span className="text-amber-800 font-bold">{org.title}</span>
        </div>

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden min-h-[420px] flex items-end p-6 sm:p-10 md:p-12 mb-12 shadow-xl border border-slate-200">
          <img
            src={org.heroImage}
            alt={org.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-400/40 text-amber-400 text-xs font-bold shadow-md">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span>81 İlde Profesyonel B2B Çözüm</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-display leading-tight">
              {org.title} Organizasyonu
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light">
              {org.longDesc}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenQuoteModal({ initialOrgType: org.title })}
                className="px-6 py-3 rounded-xl gold-gradient-bg text-slate-950 font-extrabold text-xs sm:text-sm shadow-md hover:scale-105 transition flex items-center gap-2"
              >
                <Sparkles size={16} />
                <span>Bu Organizasyon İçin Teklif Al</span>
              </button>

              <Link
                to="/iletisim"
                className="px-5 py-3 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-xs sm:text-sm border border-white/30 transition"
              >
                Uzmanla Görüş
              </Link>
            </div>
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Left Main Content */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Sub-Services Details */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                {org.title} Kapsamındaki Teknik & Operasyonel Hizmetler
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tüm operasyon süreci tek muhatap üzerinden yürütülür; sahne, ses, LED, konaklama, transfer ve saha personeli entegre olarak yönetilir.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {org.subServices.map((sub, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <CheckCircle2 size={16} className="text-amber-600 shrink-0" />
                      <span>{sub.name}</span>
                    </div>
                    <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                      {sub.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow Process */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                {org.title} Organizasyonu Nasıl Yönetilir?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Aksaklık riskini sıfıra indiren adım adım operasyon akışımız:
              </p>

              <div className="space-y-4 pt-2">
                {org.workflow.map((wf, i) => (
                  <div key={i} className="flex gap-4 items-start p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="w-8 h-8 rounded-xl gold-gradient-bg text-slate-950 font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 mb-1">{wf.step}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{wf.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Sectors */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
              <h2 className="text-lg font-bold text-slate-900 font-display">
                Bu Organizasyon Kimler İçin İdealdir?
              </h2>
              <div className="flex flex-wrap gap-2 pt-1">
                {org.targetSectors.map((sector, i) => (
                  <span key={i} className="px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
                    {sector}
                  </span>
                ))}
              </div>
            </div>

            {/* FAQs Accordion / List */}
            {org.faqs && org.faqs.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display flex items-center gap-2">
                  <HelpCircle size={22} className="text-amber-600" />
                  <span>Sıkça Sorulan Sorular</span>
                </h2>

                <div className="space-y-4">
                  {org.faqs.map((faq, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <h3 className="text-sm font-bold text-slate-900">
                        {faq.q}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Sticky Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Quote Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-400/40 shadow-xl space-y-6 sticky top-28">
              <div className="space-y-2">
                <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">Hemen Başlayın</div>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  Kurumsal Teklif Dosyanızı Hazırlayalım
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Şehir, katılımcı sayısı ve beklentilerinizi seçin; 2 saat içinde detaylı maliyet tablonuzu sunalım.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>81 İl Mekân & Salon Seçenekleri</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Anahtar Teslim Sahne & LED Sistemleri</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Tek Muhatap & Şeffaf Bütçeleme</span>
                </div>
              </div>

              <button
                onClick={() => onOpenQuoteModal({ initialOrgType: org.title })}
                className="w-full py-4 rounded-2xl gold-gradient-bg text-slate-950 font-extrabold text-sm shadow-md hover:scale-105 transition flex items-center justify-center gap-2"
              >
                <Sparkles size={16} />
                <span>Teklif Formunu Başlat</span>
              </button>

              {/* Other Organizations Fast Switch */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Diğer Kurumsal Organizasyonlar:
                </h4>
                <div className="space-y-1.5">
                  {ORGANIZATIONS.filter(o => o.slug !== org.slug).slice(0, 5).map(other => (
                    <Link
                      key={other.slug}
                      to={`/organizasyonlar/${other.slug}`}
                      className="block p-2 rounded-xl text-xs text-slate-600 hover:text-slate-950 hover:bg-slate-50 font-medium transition"
                    >
                      • {other.title}
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
