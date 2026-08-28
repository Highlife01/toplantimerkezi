import React from 'react';
import { Link } from 'react-router-dom';
import { ORGANIZATIONS } from '../../data/organizationsData';
import { SERVICES } from '../../data/servicesData';
import { PROMINENT_CITIES, ALL_81_CITIES } from '../../data/citiesData';
import { storageService } from '../../services/storageService';
import { 
  Building2, Phone, Mail, MapPin, MessageSquare, 
  ShieldCheck, ArrowRight, Sparkles, Lock 
} from 'lucide-react';

export default function Footer({ onOpenQuoteModal }) {
  const settings = storageService.getSettings();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 pt-16 pb-12 text-xs relative overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Brand & Slogan */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl gold-gradient-bg flex items-center justify-center text-slate-950 font-bold shadow-md">
                <Building2 size={22} />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white font-display block leading-none">
                  TOPLANTI <span className="text-amber-400">MERKEZİ</span>
                </span>
                <span className="text-[10px] tracking-wider uppercase text-slate-400 font-bold block mt-1">
                  Kurumsal Organizasyon & Etkinlik
                </span>
              </div>
            </Link>

            <p className="text-slate-300 text-sm leading-relaxed max-w-sm font-light">
              <strong>Toplantı Merkezi</strong>, Türkiye genelinde büyük ve orta ölçekli şirketlerin, holdinglerin, kamu kurumlarının ve markaların tüm toplantı, kongre, lansman ve kurumsal organizasyon süreçlerini tek merkezden yöneten B2B organizasyon platformudur.
            </p>

            <div className="pt-2 flex flex-col gap-2 text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-amber-400 shrink-0" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-amber-400 shrink-0" />
                <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white font-semibold">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-amber-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white">
                  {settings.email}
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Kurumsal Organizasyonlar */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display border-l-2 border-amber-400 pl-2.5">
              Organizasyonlar
            </h4>
            <ul className="space-y-2">
              {ORGANIZATIONS.slice(0, 7).map(org => (
                <li key={org.slug}>
                  <Link 
                    to={`/organizasyonlar/${org.slug}`}
                    className="hover:text-amber-400 transition block hover:translate-x-1 duration-200"
                  >
                    {org.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/organizasyonlar" className="text-amber-400 font-bold hover:underline">
                  Tüm Organizasyonlar (9 Hizmet) →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Teknik Hizmetler */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display border-l-2 border-amber-400 pl-2.5">
              Teknik Hizmetler
            </h4>
            <ul className="space-y-2">
              {SERVICES.slice(0, 7).map(srv => (
                <li key={srv.slug}>
                  <Link 
                    to={`/hizmetler/${srv.slug}`}
                    className="hover:text-amber-400 transition block hover:translate-x-1 duration-200"
                  >
                    {srv.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/hizmetler" className="text-amber-400 font-bold hover:underline">
                  Tüm Hizmetler (10 Modül) →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Hızlı Erişim & Kurumsal */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display border-l-2 border-amber-400 pl-2.5">
              Kurumsal & Destek
            </h4>
            <ul className="space-y-2">
              <li><Link to="/kurumsal" className="hover:text-amber-400 transition">Hakkımızda</Link></li>
              <li><Link to="/mekanlar" className="hover:text-amber-400 transition">Toplantı Mekânları</Link></li>
              <li><Link to="/projeler" className="hover:text-amber-400 transition">Projelerimiz & Referanslar</Link></li>
              <li><Link to="/blog" className="hover:text-amber-400 transition">Rehber & Bilgi Merkezi</Link></li>
              <li><Link to="/iletisim" className="hover:text-amber-400 transition">İletişim</Link></li>
              <li>
                <button 
                  onClick={onOpenQuoteModal}
                  className="text-amber-400 font-bold hover:underline text-left"
                >
                  Fiyat Teklifi Al
                </button>
              </li>
              <li className="pt-2">
                <Link to="/admin" className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
                  <Lock size={11} />
                  <span>Yönetici & CRM Masası</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* 81 Provinces SEO Matrix Quick Strip */}
        <div className="py-8 border-b border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Türkiye Geneli 81 İl Şehir Sistemi (MICE & Toplantı Lokasyonları):
            </span>
            <Link to="/sehirler" className="text-xs text-amber-400 hover:underline font-bold">
              Tüm Şehirleri İncele →
            </Link>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-slate-400">
            {ALL_81_CITIES.map(city => (
              <Link 
                key={city.slug} 
                to={`/sehirler/${city.slug}`} 
                className="hover:text-amber-400 transition"
              >
                {city.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} <strong>Toplantı Merkezi</strong> (www.toplantimerkezi.com.tr) - Tüm Hakları Saklıdır.
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link to="/yasal/kvkk" className="hover:text-slate-300 transition">KVKK Aydınlatma Metni</Link>
            <span>•</span>
            <Link to="/yasal/gizlilik" className="hover:text-slate-300 transition">Gizlilik Politikası</Link>
            <span>•</span>
            <Link to="/yasal/cerez" className="hover:text-slate-300 transition">Çerez Politikası</Link>
            <span>•</span>
            <Link to="/yasal/kullanim" className="hover:text-slate-300 transition">Kullanım Koşulları</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
