import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ORGANIZATIONS } from '../../data/organizationsData';
import { SERVICES } from '../../data/servicesData';
import { storageService } from '../../services/storageService';
import { 
  Building2, Phone, MessageSquare, ChevronDown, Menu, X, 
  Sparkles, CalendarCheck, MapPin, Award, ArrowRight, Lock, BookOpen, Compass
} from 'lucide-react';

export default function Navbar({ onOpenQuoteModal }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const settings = storageService.getSettings();

  const TOPIC_GUIDES = [
    { slug: 'bayi-toplantisi-rehberi', title: 'Bayi Toplantısı Rehberi', tag: 'Money Hub' },
    { slug: 'toplanti-organizasyonu-rehberi', title: 'Toplantı Yönetim Rehberi', tag: 'Rehber' },
    { slug: 'kongre-organizasyonu-rehberi', title: 'Kongre & Konferans Rehberi', tag: 'MICE' },
    { slug: 'kurumsal-piknik-rehberi', title: 'Kurumsal Piknik Rehberi', tag: 'Outdoor' },
    { slug: 'kurumsal-organizasyon-rehberi', title: 'Kurumsal Etkinlik Rehberi', tag: 'B2B' }
  ];

  const POPULAR_CLUSTERS = [
    { path: '/bayi-toplantisi-organizasyonu', title: 'Bayi Toplantısı' },
    { path: '/toplanti-organizasyonu', title: 'Şirket Toplantısı' },
    { path: '/kongre-organizasyonu', title: 'Kongre & Zirve' },
    { path: '/kurumsal-piknik-organizasyonu', title: 'Kurumsal Piknik' },
    { path: '/kamu-organizasyonu', title: 'Kamu & Protokol' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300">
      {/* Top Corporate Strip */}
      <div className="hidden lg:block bg-slate-900 border-b border-slate-800 text-xs text-slate-300 py-2 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-brand-gold font-medium">
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-ping"></span>
              Türkiye'nin 81 İlinde Kurumsal Organizasyon Çözümleri
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400">Tek Merkezden Operasyon & B2B Etkinlik Portalı</span>
          </div>

          <div className="flex items-center gap-6">
            <a 
              href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} 
              className="flex items-center gap-2 text-slate-200 hover:text-brand-gold transition font-semibold"
            >
              <Phone size={13} className="text-brand-gold" />
              <span>{settings.phone}</span>
            </a>
            <span className="text-slate-700">|</span>
            <a 
              href={`https://wa.me/${settings.whatsappPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Merhaba Toplantı Merkezi, kurumsal organizasyonumuz için hızlı teklif almak istiyoruz.')}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition font-medium"
            >
              <MessageSquare size={13} />
              <span>WhatsApp Teklif</span>
            </a>
            <span className="text-slate-700">|</span>
            <Link 
              to="/teklif-takip" 
              className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition font-bold"
            >
              <CalendarCheck size={13} />
              <span>Teklif Takip</span>
            </Link>
            <span className="text-slate-700">|</span>
            <Link 
              to="/admin" 
              className="flex items-center gap-1 text-slate-400 hover:text-white transition text-xs"
            >
              <Lock size={12} />
              <span>CRM Giriş</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className={`transition-all duration-300 px-4 sm:px-6 lg:px-8 ${
        isScrolled 
          ? 'glass-nav py-2.5 shadow-lg bg-white/95' 
          : 'bg-white/95 backdrop-blur-md py-3.5 border-b border-slate-200/80 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl gold-gradient-bg flex items-center justify-center shadow-md group-hover:scale-105 transition">
              <Building2 className="text-slate-950" size={22} />
            </div>
            <div>
              <span className="text-lg md:text-xl font-extrabold tracking-tight text-slate-900 font-display block leading-none">
                TOPLANTI <span className="text-amber-600">MERKEZİ</span>
              </span>
              <span className="text-[9px] tracking-wider uppercase text-slate-500 font-bold block mt-0.5">
                Kurumsal Organizasyon Portalı
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Multi-Page Architecture) */}
          <div className="hidden xl:flex items-center gap-0.5 text-xs font-semibold text-slate-700">
            <Link 
              to="/" 
              className={`px-2.5 py-2 rounded-lg hover:text-amber-600 transition ${isActive('/') && location.pathname === '/' ? 'text-amber-600 font-bold bg-amber-50/50' : ''}`}
            >
              Ana Sayfa
            </Link>

            {/* Organizations Mega Dropdown (Click to /organizasyonlar, Hover to see all) */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveDropdown('orgs')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center">
                <Link
                  to="/organizasyonlar"
                  className={`px-2.5 py-2 rounded-l-lg hover:text-amber-600 transition ${isActive('/organizasyonlar') ? 'text-amber-600 font-bold bg-amber-50/50' : ''}`}
                >
                  Organizasyonlar
                </Link>
                <button 
                  onClick={() => setActiveDropdown(activeDropdown === 'orgs' ? null : 'orgs')}
                  className="pr-2 py-2 text-slate-500 hover:text-amber-600"
                  aria-label="Organizasyon Alt Menüsü"
                >
                  <ChevronDown size={12} className="group-hover:rotate-180 transition duration-200" />
                </button>
              </div>

              {activeDropdown === 'orgs' && (
                <div className="absolute top-full left-0 w-[620px] bg-white border border-slate-200 rounded-2xl p-5 shadow-2xl mt-1 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  {/* Top Popular Cluster Money Pages */}
                  <div className="pb-3 mb-3 border-b border-slate-100">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-2">
                      Öne Çıkan Kurumsal Çözümler (Money Pages):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_CLUSTERS.map(c => (
                        <Link
                          key={c.path}
                          to={c.path}
                          className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 transition"
                        >
                          {c.title}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* 9 B2B Catalogs */}
                  <div className="grid grid-cols-2 gap-2">
                    {ORGANIZATIONS.map(org => (
                      <Link
                        key={org.slug}
                        to={`/organizasyonlar/${org.slug}`}
                        className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition flex flex-col group/item"
                      >
                        <div className="font-bold text-xs text-slate-900 group-hover/item:text-amber-600 transition flex items-center justify-between">
                          <span>{org.title}</span>
                          <ArrowRight size={12} className="opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition text-amber-600" />
                        </div>
                        <span className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {org.shortDesc}
                        </span>
                      </Link>
                    ))}
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                    <Link to="/organizasyonlar" className="text-amber-700 hover:underline font-bold flex items-center gap-1">
                      <span>Tüm Organizasyon Kataloğunu Görüntüle</span>
                      <ArrowRight size={13} />
                    </Link>
                    <span className="text-[11px] text-slate-400">81 İlde Anahtar Teslim</span>
                  </div>
                </div>
              )}
            </div>

            {/* Services Dropdown (Click to /hizmetler, Hover to see 10 modules) */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveDropdown('services')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center">
                <Link
                  to="/hizmetler"
                  className={`px-2.5 py-2 rounded-l-lg hover:text-amber-600 transition ${isActive('/hizmetler') ? 'text-amber-600 font-bold bg-amber-50/50' : ''}`}
                >
                  Hizmetler
                </Link>
                <button 
                  onClick={() => setActiveDropdown(activeDropdown === 'services' ? null : 'services')}
                  className="pr-2 py-2 text-slate-500 hover:text-amber-600"
                  aria-label="Hizmetler Alt Menüsü"
                >
                  <ChevronDown size={12} className="group-hover:rotate-180 transition duration-200" />
                </button>
              </div>

              {activeDropdown === 'services' && (
                <div className="absolute top-full left-0 w-[440px] bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl grid grid-cols-2 gap-2 mt-1 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  {SERVICES.map(srv => (
                    <Link
                      key={srv.slug}
                      to={`/hizmetler/${srv.slug}`}
                      className="p-2.5 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-700 hover:text-amber-600 transition flex items-center justify-between group/srv"
                    >
                      <span>{srv.title}</span>
                      <ArrowRight size={12} className="opacity-0 group-hover/srv:opacity-100 text-amber-600 transition" />
                    </Link>
                  ))}
                  <div className="col-span-2 pt-2.5 mt-1 border-t border-slate-100 text-center">
                    <Link to="/hizmetler" className="text-xs text-amber-700 font-bold hover:underline">
                      Tüm Teknik Hizmetler & Donanımlar →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 81 Cities */}
            <Link 
              to="/sehirler" 
              className={`px-2.5 py-2 rounded-lg hover:text-amber-600 transition ${isActive('/sehirler') ? 'text-amber-600 font-bold bg-amber-50/50' : ''}`}
            >
              Şehirler (81 İl)
            </Link>

            {/* Venues */}
            <Link 
              to="/mekanlar" 
              className={`px-2.5 py-2 rounded-lg hover:text-amber-600 transition ${isActive('/mekanlar') ? 'text-amber-600 font-bold bg-amber-50/50' : ''}`}
            >
              Mekânlar
            </Link>

            {/* Projects */}
            <Link 
              to="/projeler" 
              className={`px-2.5 py-2 rounded-lg hover:text-amber-600 transition ${isActive('/projeler') ? 'text-amber-600 font-bold bg-amber-50/50' : ''}`}
            >
              Projeler
            </Link>

            {/* Guides & Blog Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveDropdown('blog')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center">
                <Link
                  to="/blog"
                  className={`px-2.5 py-2 rounded-l-lg hover:text-amber-600 transition ${isActive('/blog') || isActive('/rehber') ? 'text-amber-600 font-bold bg-amber-50/50' : ''}`}
                >
                  Rehberler
                </Link>
                <button 
                  onClick={() => setActiveDropdown(activeDropdown === 'blog' ? null : 'blog')}
                  className="pr-2 py-2 text-slate-500 hover:text-amber-600"
                  aria-label="Rehberler Alt Menüsü"
                >
                  <ChevronDown size={12} className="group-hover:rotate-180 transition duration-200" />
                </button>
              </div>

              {activeDropdown === 'blog' && (
                <div className="absolute top-full right-0 w-[360px] bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl space-y-1.5 mt-1 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block px-2 mb-1">
                    Topic Hub Rehberleri:
                  </span>
                  {TOPIC_GUIDES.map(g => (
                    <Link
                      key={g.slug}
                      to={`/rehber/${g.slug}`}
                      className="p-2 rounded-xl hover:bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-800 hover:text-amber-700 transition"
                    >
                      <span>{g.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                        {g.tag}
                      </span>
                    </Link>
                  ))}
                  <div className="pt-2 border-t border-slate-100 text-center">
                    <Link to="/blog" className="text-xs text-amber-700 font-bold hover:underline">
                      Tüm Makaleler & İpuçları (Blog) →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Corporate */}
            <Link 
              to="/kurumsal" 
              className={`px-2.5 py-2 rounded-lg hover:text-amber-600 transition ${isActive('/kurumsal') ? 'text-amber-600 font-bold bg-amber-50/50' : ''}`}
            >
              Kurumsal
            </Link>

            {/* Contact */}
            <Link 
              to="/iletisim" 
              className={`px-2.5 py-2 rounded-lg hover:text-amber-600 transition ${isActive('/iletisim') ? 'text-amber-600 font-bold bg-amber-50/50' : ''}`}
            >
              İletişim
            </Link>
          </div>

          {/* Right Action CTA (Multi-Page Dedicated Quote Page or Wizard Modal) */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/teklif-al"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-slate-800 font-bold text-xs hover:border-amber-500 hover:bg-amber-50/50 transition"
            >
              <span>Hızlı Teklif</span>
            </Link>

            <button
              onClick={onOpenQuoteModal}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl gold-gradient-bg text-slate-950 font-extrabold text-xs tracking-wide shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles size={15} className="text-slate-950" />
              <span>PLANLAMA BAŞLAT</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-950 focus:outline-none"
              aria-label="Menü"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer (Multi-Page Categories) */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-3 pb-6 pt-2 border-t border-slate-200 bg-white rounded-2xl p-4 shadow-2xl max-h-[82vh] overflow-y-auto animate-in fade-in duration-200">
            <div className="flex flex-col gap-1 text-xs font-semibold text-slate-800">
              
              <Link to="/" className="p-2.5 rounded-xl hover:bg-slate-50 font-bold">
                🏠 Ana Sayfa
              </Link>
              
              <div className="pt-2 pb-1 border-t border-slate-100">
                <span className="text-[10px] font-extrabold text-amber-800 uppercase px-2">Kurumsal Çözümler:</span>
              </div>
              <Link to="/organizasyonlar" className="p-2.5 rounded-xl hover:bg-slate-50 text-amber-700 font-bold flex items-center justify-between">
                <span>9 B2B Organizasyon Kataloğu</span>
                <ArrowRight size={13} />
              </Link>
              <Link to="/hizmetler" className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between">
                <span>10 Teknik Hizmet Modülü</span>
                <ArrowRight size={13} />
              </Link>
              <Link to="/bayi-toplantisi-organizasyonu" className="p-2.5 rounded-xl bg-amber-50 text-amber-900 font-bold flex items-center justify-between">
                <span>Bayi Toplantısı Çözüm Masası</span>
                <span className="text-[10px] px-2 py-0.5 bg-amber-200 rounded font-bold">Özel</span>
              </Link>

              <div className="pt-2 pb-1 border-t border-slate-100">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase px-2">Keşif & Rehberler:</span>
              </div>
              <Link to="/sehirler" className="p-2.5 rounded-xl hover:bg-slate-50">
                📍 81 İl Şehir Sistemi
              </Link>
              <Link to="/mekanlar" className="p-2.5 rounded-xl hover:bg-slate-50">
                🏛️ Toplantı & Kongre Mekânları
              </Link>
              <Link to="/projeler" className="p-2.5 rounded-xl hover:bg-slate-50">
                ⭐ Projelerimiz & Case Studies
              </Link>
              <Link to="/blog" className="p-2.5 rounded-xl hover:bg-slate-50">
                📚 Rehberler & Blog
              </Link>

              <div className="pt-2 pb-1 border-t border-slate-100">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase px-2">Kurumsal:</span>
              </div>
              <Link to="/kurumsal" className="p-2.5 rounded-xl hover:bg-slate-50">
                Hakkımızda & Kalite Standartları
              </Link>
              <Link to="/iletisim" className="p-2.5 rounded-xl hover:bg-slate-50">
                İletişim & Lokasyon Masası
              </Link>
              <Link to="/teklif-al" className="p-2.5 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-between">
                <span>Online Teklif Formu</span>
                <ArrowRight size={13} className="text-amber-400" />
              </Link>
              <Link to="/teklif-takip" className="p-2.5 rounded-xl bg-amber-50 text-amber-900 font-bold flex items-center justify-between border border-amber-200">
                <span>Teklif & Talep Durumu Sorgula</span>
                <CalendarCheck size={14} />
              </Link>

              <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col gap-2">
                <a
                  href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                >
                  <Phone size={14} className="text-brand-gold" />
                  <span>{settings.phone}</span>
                </a>
                <a
                  href={`https://wa.me/${settings.whatsappPhone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  <MessageSquare size={14} />
                  <span>WhatsApp'tan Teklif Al</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
