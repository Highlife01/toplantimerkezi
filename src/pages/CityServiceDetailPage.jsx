import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ALL_81_CITIES, PROMINENT_CITIES } from '../data/citiesData';
import { ORGANIZATIONS } from '../data/organizationsData';
import SectionTitle from '../components/common/SectionTitle';
import UrgentEventBanner from '../components/common/UrgentEventBanner';
import { updatePageSeo } from '../services/seoService';
import { MapPin, Building, Users, CheckCircle2, ArrowRight, Sparkles, Phone, ShieldCheck } from 'lucide-react';

export default function CityServiceDetailPage({ onOpenQuoteModal }) {
  const { sehirSlug, hizmetSlug } = useParams();

  const city = PROMINENT_CITIES.find(c => c.slug === sehirSlug) || 
               ALL_81_CITIES.find(c => c.slug === sehirSlug);

  const org = ORGANIZATIONS.find(o => o.slug === hizmetSlug);

  useEffect(() => {
    if (city && org) {
      updatePageSeo({
        title: `${city.name} ${org.title} Organizasyonu | Toplantı Merkezi`,
        description: `${city.name} ilinde profesyonel ${org.title.toLowerCase()} organizasyonu. Mekân seçimi, sahne, LED ekran, ses-ışık ve catering hizmetleri tek merkezden yönetilir.`,
        canonicalUrl: `https://www.toplantimerkezi.com.tr/sehirler/${city.slug}/${org.slug}`,
        schemaType: 'Service',
        schemaData: {
          serviceType: `${city.name} ${org.title}`,
          provider: {
            '@type': 'Organization',
            name: 'Toplantı Merkezi'
          },
          areaServed: city.name,
          description: `${city.name} bölgesinde ${org.title} kurumsal organizasyon ve toplantı yönetimi.`
        }
      });
      window.scrollTo(0, 0);
    }
  }, [city, org, sehirSlug, hizmetSlug]);

  if (!city || !org) {
    return (
      <div className="min-h-screen pt-36 pb-20 text-center px-4 bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-900 font-display">Sayfa Bulunamadı</h2>
        <p className="text-sm text-slate-600 mt-2">Aradığınız şehir ve organizasyon kombinasyonu bulunamadı.</p>
        <Link to="/sehirler" className="mt-6 inline-block px-6 py-3 rounded-xl gold-gradient-bg text-slate-950 font-bold text-xs">
          Şehirlere Dön
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
          <Link to="/sehirler" className="hover:text-amber-700">Şehirler</Link>
          <span>/</span>
          <Link to={`/sehirler/${city.slug}`} className="hover:text-amber-700">{city.name}</Link>
          <span>/</span>
          <span className="text-amber-800 font-bold">{org.title}</span>
        </div>

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden min-h-[380px] flex items-end p-6 sm:p-10 md:p-12 mb-12 shadow-xl border border-slate-200">
          <img
            src={org.heroImage}
            alt={`${city.name} ${org.title}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-400/40 text-amber-400 text-xs font-bold shadow-md">
              <MapPin size={13} />
              <span>{city.name} Yerel Operasyon Gücü</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-display">
              {city.name} {org.title} Organizasyonu
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light">
              {city.name} ilindeki tüm oteller, kongre salonları ve açık alanlarda {org.title.toLowerCase()} süreçlerinizi tek merkezden profesyonelce koordine ediyoruz.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenQuoteModal({ initialOrgType: org.title, initialCity: city.name })}
                className="px-6 py-3 rounded-xl gold-gradient-bg text-slate-950 font-extrabold text-xs sm:text-sm shadow-md hover:scale-105 transition flex items-center gap-2"
              >
                <Sparkles size={16} />
                <span>{city.name} {org.title} Teklifi Al</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          <div className="lg:col-span-8 space-y-10">
            
            {/* Services included */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                {city.name} {org.title} İçin Neler Sağlıyoruz?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {city.name} bölgesinde düzenleyeceğiniz {org.title.toLowerCase()} için tüm teknik ve saha modülleri hazır:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
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

            {/* Why Toplanti Merkezi in this City */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
              <h2 className="text-xl font-bold text-slate-900 font-display">
                {city.name} İlinde Neden Tek Merkezden Yönetim?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Farklı şehirlerde organizasyon düzenleyen kurumsal şirketlerin karşılaştığı en büyük sorun, yerel tedarikçilerin koordinasyonsuzluğu ve bütçe sapmalarıdır. Toplantı Merkezi olarak {city.name} ilindeki yerleşik teknik ortaklarımız ve saha denetçilerimiz ile kurumsal riskleri sıfıra indiriyoruz.
              </p>
            </div>

          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-400/40 shadow-xl space-y-6 sticky top-28">
              <div className="space-y-2">
                <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">Hızlı Bütçe Çalışması</div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  {city.name} {org.title} Fiyat Teklifi
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Katılımcı sayınızı ve tercih ettiğiniz tarihi girin; size özel maliyetlendirilmiş kurumsal teklif dosyanızı 2 saatte iletelim.
                </p>
              </div>

              <button
                onClick={() => onOpenQuoteModal({ initialOrgType: org.title, initialCity: city.name })}
                className="w-full py-4 rounded-2xl gold-gradient-bg text-slate-950 font-extrabold text-sm shadow-md hover:scale-105 transition flex items-center justify-center gap-2"
              >
                <Sparkles size={16} />
                <span>Teklif Formunu Doldur</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      <UrgentEventBanner onOpenQuoteModal={onOpenQuoteModal} />
    </div>
  );
}
