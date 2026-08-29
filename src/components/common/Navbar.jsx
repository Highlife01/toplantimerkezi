import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ORGANIZATIONS } from '../../data/organizationsData';
import { SERVICES } from '../../data/servicesData';
import { PROMINENT_CITIES } from '../../data/citiesData';
import { storageService } from '../../services/storageService';
import { 
  Building2, Phone, MessageSquare, ChevronDown, Menu, X, 
  Sparkles, CalendarCheck, ShieldCheck, MapPin, Award, ArrowRight, Lock
} from 'lucide-react';

export default function Navbar({ onOpenQuoteModal }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const settings = storageService.getSettings();

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
            <span className="text-slate-400">Tek Merkezden Operasyon & B2B Etkinlik Yönetimi</span>
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
          ? 'glass-nav py-3 shadow-lg bg-white/95' 
          : 'bg-white/90 backdrop-blur-md py-4 border-b border-slate-200/80 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl gold-gradient-bg flex items-center justify-center shadow-md group-hover:scale-105 transition">
              <Building2 className="text-slate-950" size={24} />
            </div>
            <div>
              <span className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 font-display block leading-none">
                TOPLANTI <span className="text-amber-600">MERKEZİ</span>
              </span>
              <span className="text-[10px] tracking-wider uppercase text-slate-500 font-bold block mt-1">
                Kurumsal Organizasyon & Etkinlik
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-1 text-sm font-semibold text-slate-700">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-lg hover:text-amber-600 transition ${location.pathname === '/' ? 'text-amber-600 font-bold' : ''}`}
            >
              Ana Sayfa
            </Link>

            {/* Organizations Mega Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveDropdown('orgs')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:text-amber-600 transition">
                <span>Kurumsal Organizasyonlar</span>
                <ChevronDown size={14} className="group-hover:rotate-180 transition duration-200" />
              </button>

              {activeDropdown === 'orgs' && (
                <div className="absolute top-full left-0 w-[580px] bg-white border border-slate-200 rounded-2xl p-5 shadow-2xl grid grid-cols-2 gap-3 mt-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  {ORGANIZATIONS.map(org => (
                    <Link
                      key={org.slug}
                      to={`/organizasyonlar/${org.slug}`}
                      className="p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition flex flex-col group/item"
                    >
                      <div className="font-bold text-sm text-slate-900 group-hover/item:text-amber-600 transition flex items-center justify-between">
                        <span>{org.title}</span>
                        <ArrowRight size={13} className="opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition text-amber-600" />
                      </div>
                      <div className="text-xs text-slate-500 mt-1 line-clamp-1">
                        {org.shortDesc}
                      </div>
                    </Link>
                  ))}
                  <div className="col-span-2 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                    <Link to="/organizasyonlar" className="text-amber-600 hover:underline font-bold">
                      Tüm Kurumsal Organizasyonları İncele →
                    </Link>
                    <span className="text-slate-400">81 İlde Hizmet</span>
                  </div>
                </div>
              )}
            </div>

            {/* Services Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveDropdown('services')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:text-amber-600 transition">
                <span>Hizmetlerimiz</span>
                <ChevronDown size={14} className="group-hover:rotate-180 transition duration-200" />
              </button>

              {activeDropdown === 'services' && (
                <div className="absolute top-full left-0 w-[440px] bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl grid grid-cols-2 gap-2 mt-1 animate-in fade-in slide-in-from-top-2 duration-200">
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
                </div>
              )}
            </div>

            <Link 
              to="/sehirler" 
              className={`px-3 py-2 rounded-lg hover:text-amber-600 transition ${location.pathname.startsWith('/sehirler') ? 'text-amber-600 font-bold' : ''}`}
            >
              Şehirler (81 İl)
            </Link>

            <Link 
              to="/mekanlar" 
              className={`px-3 py-2 rounded-lg hover:text-amber-600 transition ${location.pathname === '/mekanlar' ? 'text-amber-600 font-bold' : ''}`}
            >
              Mekânlar
            </Link>

            <Link 
              to="/projeler" 
              className={`px-3 py-2 rounded-lg hover:text-amber-600 transition ${location.pathname === '/projeler' ? 'text-amber-600 font-bold' : ''}`}
            >
              Projelerimiz
            </Link>

            <Link 
              to="/kurumsal" 
              className={`px-3 py-2 rounded-lg hover:text-amber-600 transition ${location.pathname === '/kurumsal' ? 'text-amber-600 font-bold' : ''}`}
            >
              Kurumsal
            </Link>

            <Link 
              to="/blog" 
              className={`px-3 py-2 rounded-lg hover:text-amber-600 transition ${location.pathname.startsWith('/blog') ? 'text-amber-600 font-bold' : ''}`}
            >
              Rehber & Blog
            </Link>

            <Link 
              to="/iletisim" 
              className={`px-3 py-2 rounded-lg hover:text-amber-600 transition ${location.pathname === '/iletisim' ? 'text-amber-600 font-bold' : ''}`}
            >
              İletişim
            </Link>
          </div>

          {/* Right Action CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenQuoteModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl gold-gradient-bg text-slate-950 font-extrabold text-xs sm:text-sm tracking-wide shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles size={16} className="text-slate-950" />
              <span>ORGANİZASYON PLANLA</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-950 focus:outline-none"
              aria-label="Menü"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-4 pb-6 pt-2 border-t border-slate-200 bg-white rounded-2xl p-4 shadow-2xl max-h-[80vh] overflow-y-auto animate-in fade-in duration-200">
            <div className="flex flex-col gap-2 text-sm font-semibold text-slate-800">
              <Link to="/" className="p-3 rounded-xl hover:bg-slate-50">Ana Sayfa</Link>
              <Link to="/organizasyonlar" className="p-3 rounded-xl hover:bg-slate-50 text-amber-600 font-bold">
                Kurumsal Organizasyonlar (9 Hizmet)
              </Link>
              <Link to="/hizmetler" className="p-3 rounded-xl hover:bg-slate-50">
                Teknik Hizmetlerimiz (10+ Modül)
              </Link>
              <Link to="/sehirler" className="p-3 rounded-xl hover:bg-slate-50">
                81 İl Şehir Sistemi
              </Link>
              <Link to="/mekanlar" className="p-3 rounded-xl hover:bg-slate-50">
                Mekân Bul (Filtreli Arama)
              </Link>
              <Link to="/projeler" className="p-3 rounded-xl hover:bg-slate-50">
                Projelerimiz & Case Studies
              </Link>
              <Link to="/kurumsal" className="p-3 rounded-xl hover:bg-slate-50">
                Kurumsal
              </Link>
              <Link to="/blog" className="p-3 rounded-xl hover:bg-slate-50">
                Rehber & Blog
              </Link>
              <Link to="/iletisim" className="p-3 rounded-xl hover:bg-slate-50">
                İletişim
              </Link>
              <Link to="/teklif-takip" className="p-3 rounded-xl bg-amber-50 text-amber-900 font-bold flex items-center justify-between border border-amber-200">
                <span>Teklif & Talep Durumu Sorgula</span>
                <CalendarCheck size={14} />
              </Link>
              <Link to="/admin" className="p-3 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-between">
                <span>Yönetim / CRM Paneli</span>
                <Lock size={14} />
              </Link>

              <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col gap-2">
                <a
                  href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white font-bold"
                >
                  <Phone size={16} className="text-brand-gold" />
                  <span>{settings.phone}</span>
                </a>
                <a
                  href={`https://wa.me/${settings.whatsappPhone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  <MessageSquare size={16} />
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
