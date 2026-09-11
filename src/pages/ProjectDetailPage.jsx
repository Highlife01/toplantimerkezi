import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PROJECTS } from '../data/projectsData';
import UrgentEventBanner from '../components/common/UrgentEventBanner';
import { updatePageSeo } from '../services/seoService';
import { MapPin, Users, Calendar, CheckCircle2, ArrowRight, Sparkles, Building2 } from 'lucide-react';

export default function ProjectDetailPage({ onOpenQuoteModal }) {
  const { slug } = useParams();
  const project = PROJECTS.find(p => p.slug === slug);

  useEffect(() => {
    if (project) {
      updatePageSeo({
        title: `${project.title} | Case Study`,
        description: `${project.title} projesinin detayları, ${project.city} lokasyonunda ${project.attendees} kişilik kurumsal organizasyon başarı kriterleri ve sahne/teknik yönetimi.`,
        canonicalUrl: `https://www.toplantimerkezi.com.tr/projeler/${project.slug}`,
        breadcrumbs: [
          { name: 'Ana Sayfa', url: '/' },
          { name: 'Projelerimiz', url: '/projeler' },
          { name: project.title, url: `/projeler/${project.slug}` }
        ],
        schemaType: 'Article',
        schemaData: {
          headline: project.title,
          description: `${project.city} lokasyonunda ${project.attendees} kişilik ${project.title} organizasyonu.`,
          image: project.image,
          author: {
            '@type': 'Organization',
            name: 'Toplantı Merkezi',
            url: 'https://www.toplantimerkezi.com.tr'
          }
        }
      });
      window.scrollTo(0, 0);
    }
  }, [project, slug]);

  if (!project) {
    return (
      <div className="min-h-screen pt-36 pb-20 text-center px-4 bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-900 font-display">Proje Bulunamadı</h2>
        <p className="text-sm text-slate-600 mt-2">Aradığınız case study sayfası mevcut değil.</p>
        <Link to="/projeler" className="mt-6 inline-block px-6 py-3 rounded-xl gold-gradient-bg text-slate-950 font-bold text-xs">
          Tüm Projeleri Gör
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
          <Link to="/projeler" className="hover:text-amber-700">Projelerimiz</Link>
          <span>/</span>
          <span className="text-amber-800 font-bold">{project.title}</span>
        </div>

        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden min-h-[420px] flex items-end p-6 sm:p-10 md:p-12 mb-12 shadow-xl border border-slate-200">
          <img
            src={project.image}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-slate-900/90 border border-amber-400/40 text-amber-400 text-xs font-bold shadow-md">
                {project.category}
              </span>
              <span className="px-3.5 py-1 rounded-full bg-slate-900/90 text-slate-300 text-xs font-medium border border-slate-700">
                {project.clientType}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-display">
              {project.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
                <MapPin size={14} className="text-amber-400" />
                {project.city} / {project.venue}
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
                <Users size={14} className="text-amber-400" />
                {project.attendees.toLocaleString('tr-TR')} Katılımcı
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
                <Calendar size={14} className="text-amber-400" />
                {project.date}
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          <div className="lg:col-span-8 space-y-8">
            
            {/* Scope */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
              <h2 className="text-xl font-bold text-slate-900 font-display">Projenin Kapsamı ve Hedefleri</h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {project.scope}
              </p>
            </div>

            {/* Results */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
              <h2 className="text-xl font-bold text-slate-900 font-display">Elde Edilen Başarı Kriterleri</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {project.results.map((res, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">{res}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Provided Services */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
              <h2 className="text-xl font-bold text-slate-900 font-display">Uygulanan Hizmet Kalemleri</h2>
              <div className="flex flex-wrap gap-2 pt-1">
                {project.servicesProvided.map((srv, i) => (
                  <span key={i} className="px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
                    {srv}
                  </span>
                ))}
              </div>
            </div>

          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-400/40 shadow-xl space-y-6 sticky top-28">
              <div className="space-y-2">
                <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">Benzer Bir Organizasyon</div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  Sizin Şirketiniz İçin de Planlayalım
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Benzer bir toplantı veya lansman organizasyonu için ihtiyaçlarınızı belirtin; aynı operasyonel disiplinle teklifinizi hazırlayalım.
                </p>
              </div>

              <button
                onClick={() => onOpenQuoteModal({ initialOrgType: project.category, initialCity: project.city })}
                className="w-full py-3.5 rounded-xl gold-gradient-bg text-slate-950 font-extrabold text-sm shadow-md hover:scale-105 transition flex items-center justify-center gap-2"
              >
                <Sparkles size={16} />
                <span>Teklif Talebi Oluştur</span>
              </button>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Diğer Başarı Hikayeleri:
                </h4>
                {PROJECTS.filter(p => p.slug !== project.slug).slice(0, 3).map(other => (
                  <Link
                    key={other.slug}
                    to={`/projeler/${other.slug}`}
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

      <UrgentEventBanner onOpenQuoteModal={onOpenQuoteModal} />
    </div>
  );
}
