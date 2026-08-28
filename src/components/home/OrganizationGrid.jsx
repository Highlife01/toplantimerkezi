import React from 'react';
import { Link } from 'react-router-dom';
import { ORGANIZATIONS } from '../../data/organizationsData';
import SectionTitle from '../common/SectionTitle';
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

export default function OrganizationGrid({ onOpenQuoteModal }) {
  return (
    <section className="py-24 relative subtle-grid-bg bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          badge="B2B & Kurumsal Faaliyet Alanları"
          title="Kurumsal Organizasyon Çözümlerimiz"
          subtitle="Holdinglerden kamu kurumlarına, bayi ağlarından global markalara kadar her ölçekte toplantı ve etkinliği uçtan uca yönetiyoruz."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ORGANIZATIONS.map((org) => (
            <div
              key={org.slug}
              className="bg-white rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 group border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-400/60"
            >
              {/* Image & Badge */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={org.heroImage}
                  alt={org.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                
                {org.badge && (
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-amber-400/40 text-amber-400 text-xs font-bold shadow-md">
                    {org.badge}
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-700 transition font-display mb-2">
                    {org.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {org.shortDesc}
                  </p>

                  {/* Subservice Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {org.subServices.slice(0, 4).map((sub, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {sub.name}
                      </span>
                    ))}
                    {org.subServices.length > 4 && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
                        +{org.subServices.length - 4} Modül
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <Link
                    to={`/organizasyonlar/${org.slug}`}
                    className="text-xs font-bold text-slate-700 hover:text-amber-700 flex items-center gap-1.5 transition"
                  >
                    <span>Detayları İncele</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition text-amber-600" />
                  </Link>

                  <button
                    onClick={onOpenQuoteModal}
                    className="px-4 py-2 rounded-xl gold-gradient-bg text-slate-950 font-bold text-xs shadow-xs hover:shadow-md transition flex items-center gap-1"
                  >
                    <Sparkles size={13} />
                    <span>Teklif Al</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
