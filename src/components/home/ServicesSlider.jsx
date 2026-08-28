import React from 'react';
import { Link } from 'react-router-dom';
import { SERVICES } from '../../data/servicesData';
import SectionTitle from '../common/SectionTitle';
import { 
  Building2, Layers, Volume2, Tv, Utensils, QrCode, Users, 
  Camera, Headphones, ShieldCheck, ArrowRight 
} from 'lucide-react';

const iconMap = {
  Building2,
  Layers,
  Volume2,
  Tv,
  Utensils,
  QrCode,
  Users,
  Camera,
  Headphones,
  ShieldCheck
};

export default function ServicesSlider() {
  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          badge="Modüler Operasyonel Güç"
          title="Teknik & Saha Hizmetlerimiz"
          subtitle="Organizasyonunuzun gereksinim duyduğu tüm teknik donanım, sahne, reji, ikram ve personel ihtiyaçlarını tek merkezden sağlıyoruz."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {SERVICES.map((srv) => {
            const Icon = iconMap[srv.icon] || Building2;
            return (
              <Link
                key={srv.slug}
                to={`/hizmetler/${srv.slug}`}
                className="bg-white p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 group border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-400/50"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 mb-4 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300 shadow-xs">
                    <Icon size={22} />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition font-display mb-1.5">
                    {srv.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {srv.shortDesc}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 group-hover:text-amber-700">
                  <span>İncele</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* View all button */}
        <div className="mt-12 text-center">
          <Link
            to="/hizmetler"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-300 shadow-sm hover:border-amber-400 transition"
          >
            <span>Tüm Hizmet & Teknik Detayları Görüntüle</span>
            <ArrowRight size={14} className="text-amber-600" />
          </Link>
        </div>

      </div>
    </section>
  );
}
