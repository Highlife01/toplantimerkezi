import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PROJECTS } from '../data/projectsData';
import SectionTitle from '../components/common/SectionTitle';
import UrgentEventBanner from '../components/common/UrgentEventBanner';
import { updatePageSeo } from '../services/seoService';
import { MapPin, Users, Calendar, ArrowRight, Award, CheckCircle2, Sparkles } from 'lucide-react';

export default function ProjectsPage({ onOpenQuoteModal }) {
  useEffect(() => {
    updatePageSeo({
      title: 'Kurumsal Projelerimiz ve Case Studies | Toplantı Merkezi',
      description: 'Otomotiv, holding, kamu ve finans sektöründen markalar için Türkiye genelinde gerçekleştirdiğimiz başarı hikayeleri, bayi toplantıları ve kurumsal organizasyonlar.',
      canonicalUrl: 'https://www.toplantimerkezi.com.tr/projeler'
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
          <span className="text-amber-800 font-bold">Projelerimiz & Case Studies</span>
        </div>

        <SectionTitle
          badge="Referans Başarı Hikayeleri"
          title="Gerçekleşen Kurumsal Organizasyonlarımız"
          subtitle="Holdinglerden kamu kurumlarına, otomotivden teknolojiye kadar geniş bir yelpazede hayata geçirdiğimiz anahtar teslim operasyonlar."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROJECTS.map(project => (
            <div
              key={project.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-400/50 transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                
                <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-amber-400/40 text-amber-400 text-xs font-bold shadow-md">
                  {project.category}
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <span className="flex items-center gap-1 bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-700 font-medium">
                    <MapPin size={12} className="text-amber-400" />
                    {project.city}
                  </span>
                  <span className="flex items-center gap-1 bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-700 font-medium">
                    <Users size={12} className="text-amber-400" />
                    {project.attendees.toLocaleString('tr-TR')} Katılımcı
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
                    {project.clientType}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-700 transition font-display mb-3">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {project.summary}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="text-xs font-bold text-slate-700 mb-1">Öne Çıkan Başarı Kriterleri:</div>
                    {project.results.map((res, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
                        <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />
                        <span>{res}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/projeler/${project.slug}`}
                    className="text-xs font-bold text-slate-900 hover:text-amber-700 flex items-center gap-1 transition"
                  >
                    <span>Vaka Analizi & Fotoğraflar</span>
                    <ArrowRight size={14} className="text-amber-600" />
                  </Link>

                  <button
                    onClick={() => onOpenQuoteModal({ initialOrgType: project.category, initialCity: project.city })}
                    className="px-4 py-2 rounded-xl gold-gradient-bg text-slate-950 font-bold text-xs shadow-xs hover:shadow-md transition"
                  >
                    Benzer Proje Teklifi Al
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      <div className="mt-20">
        <UrgentEventBanner onOpenQuoteModal={onOpenQuoteModal} />
      </div>
    </div>
  );
}
