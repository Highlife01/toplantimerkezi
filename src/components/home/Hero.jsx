import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, MapPin, Award, Users, CheckCircle2, Building, Calendar, Compass, Search, Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES, matchLanguageFromQuery, searchMultiLanguageCatalog } from '../../data/i18nData';

export default function Hero({ onOpenQuoteModal }) {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');
  const [selectedHeroLang, setSelectedHeroLang] = useState('all');

  const QUICK_PAGES = [
    { to: '/bayi-toplantisi-organizasyonu', label: 'Bayi Toplantısı', tag: 'Öne Çıkan' },
    { to: '/toplanti-organizasyonu', label: 'Şirket Toplantısı', tag: 'B2B' },
    { to: '/kongre-organizasyonu', label: 'Kongre & Zirve', tag: 'MICE' },
    { to: '/kurumsal-piknik-organizasyonu', label: 'Kurumsal Piknik', tag: 'Açık Hava' },
    { to: '/kamu-organizasyonu', label: 'Kamu & Protokol', tag: 'Resmi' },
    { to: '/sehirler', label: '81 İl Rehberi', tag: 'Türkiye Geneli' }
  ];

  const liveSearchResults = useMemo(() => {
    const q = heroSearch.trim();
    if (!q && selectedHeroLang === 'all') return null;
    const matchedLangs = matchLanguageFromQuery(q);
    const catalog = searchMultiLanguageCatalog(q, selectedHeroLang);
    return {
      matchedLangs,
      languagePortals: catalog.languagePortals.slice(0, 6),
      solutions: catalog.solutions.slice(0, 4),
      destinations: catalog.destinations.slice(0, 4)
    };
  }, [heroSearch, selectedHeroLang]);

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    const q = heroSearch.trim();
    const matched = matchLanguageFromQuery(q);
    if (matched.length === 1 && q.length <= 15) {
      navigate(matched[0].path);
      return;
    }
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (selectedHeroLang !== 'all') params.set('lang', selectedHeroLang);
    navigate(`/mekanlar${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <section className="relative min-h-[85vh] lg:min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden subtle-grid-bg bg-gradient-to-b from-slate-50 via-white to-slate-50">
      
      {/* Background Soft Glows */}
      <div className="hero-glow top-10 -left-20 animate-pulse-glow"></div>
      <div className="hero-glow bottom-0 -right-20 animate-pulse-glow" style={{ animationDelay: '3s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          
          {/* Trust Badge Top */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-amber-400/50 text-amber-900 text-xs sm:text-sm font-bold tracking-wide shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping"></span>
            <span>81 İlde Organizasyon Çözümleri • Tek Merkezden Yönetim • 15 Dilde B2B MICE Portalı</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 font-display leading-[1.1]">
            Türkiye'nin Her Yerinde <br />
            <span className="gold-gradient-text">Kurumsal Organizasyon</span> Çözümleri
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
            Bayi toplantılarından şirket organizasyonlarına, uluslararası kongrelerden kurumsal pikniklere kadar tüm süreci 81 ilde ve 15 dilde tek merkezden planlıyor, koordine ediyor ve yönetiyoruz.
          </p>

          {/* 15 Dilde Akıllı Arama Motoru (Dillerle, Organizasyonla veya Şehirle Arama) */}
          <div className="max-w-3xl mx-auto pt-1 relative text-left">
            <form
              onSubmit={handleHeroSearchSubmit}
              className="bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-300 shadow-lg flex flex-col sm:flex-row items-stretch sm:items-center gap-2 focus-within:border-amber-500 transition"
            >
              <div className="relative flex-1 flex items-center">
                <Search size={18} className="text-amber-600 ml-3 shrink-0" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="15 dilde veya Türkçe arayın: Rusça, Arapça, Hindistanca, Çince, English, Русский, العربية, Kongre, Antalya..."
                  aria-label="15 dilde kurumsal organizasyon, dil veya mekân ara"
                  className="w-full px-3 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedHeroLang}
                  onChange={(e) => setSelectedHeroLang(e.target.value)}
                  aria-label="Arama Dili Seçin"
                  className="bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="all">🌐 Tüm 15 Dil</option>
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.name} ({l.nativeName})
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl gold-gradient-bg text-slate-950 font-extrabold text-xs sm:text-sm shadow-xs hover:shadow-md transition shrink-0 flex items-center gap-1.5"
                >
                  <span>Ara</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </form>

            {/* Live Multi-Language Search Results Dropdown */}
            {liveSearchResults && (liveSearchResults.languagePortals.length > 0 || liveSearchResults.solutions.length > 0) && (
              <div className="mt-2 bg-white rounded-2xl border border-amber-300 shadow-2xl p-4 space-y-4 z-30 relative">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                    <Globe size={14} />
                    15 Dilli MICE & Kongre Arama Sonuçları
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setHeroSearch('');
                      setSelectedHeroLang('all');
                    }}
                    className="text-[11px] font-bold text-slate-400 hover:text-slate-700"
                  >
                    Kapat ✕
                  </button>
                </div>

                {liveSearchResults.languagePortals.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase mb-2">
                      Eşleşen Dil Portalları ({liveSearchResults.languagePortals.length}):
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {liveSearchResults.languagePortals.map((lp) => (
                        <Link
                          key={lp.code}
                          to={lp.path}
                          className="p-2.5 rounded-xl border border-slate-200 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/50 transition flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-lg shrink-0">{lp.flag}</span>
                            <div className="truncate">
                              <div className="text-xs font-bold text-slate-900 truncate">
                                {lp.name} ({lp.nativeName})
                              </div>
                              <div className="text-[10px] text-slate-500 truncate">{lp.regionLabel}</div>
                            </div>
                          </div>
                          <ArrowRight size={13} className="text-amber-700 shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {liveSearchResults.solutions.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase mb-2">
                      Çok Dilli Organizasyon & Kongre Çözümleri:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {liveSearchResults.solutions.map((sol) => (
                        <Link
                          key={sol.id}
                          to={sol.path}
                          className="p-2.5 rounded-xl border border-slate-200 hover:border-amber-400 bg-white transition block"
                        >
                          <div className="text-[10px] font-bold text-amber-800 mb-0.5">
                            {sol.langFlag} {sol.langName} • {sol.langNative}
                          </div>
                          <div className="text-xs font-bold text-slate-900 line-clamp-1">{sol.title}</div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">{sol.description}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dual Multi-Page CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onOpenQuoteModal}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl gold-gradient-bg text-slate-950 font-extrabold text-base shadow-md hover:scale-105 active:scale-95 transition-all group"
            >
              <Sparkles size={19} className="group-hover:rotate-12 transition" />
              <span>Organizasyon Planla</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
            </button>

            <Link
              to="/organizasyonlar"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-300 shadow-xs hover:border-amber-500 hover:text-amber-800 transition-all"
            >
              <Compass size={18} className="text-amber-600" />
              <span>Kurumsal Çözümleri İncele</span>
            </Link>
          </div>

          {/* Direct Multi-Page Quick Access Pills */}
          <div className="pt-4 max-w-3xl mx-auto">
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2.5">
              Hızlı Sayfa Geçişleri & Tematik Kümeler:
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {QUICK_PAGES.map((qp, idx) => (
                <Link
                  key={idx}
                  to={qp.to}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-amber-50/70 border border-slate-200 hover:border-amber-400 text-slate-800 hover:text-amber-900 text-xs font-semibold shadow-2xs transition flex items-center gap-1.5 group"
                >
                  <span>{qp.label}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 group-hover:bg-amber-100 text-slate-500 group-hover:text-amber-800 font-medium">
                    {qp.tag}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Key Value Metrics & Proof */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-4xl mx-auto">
            <Link to="/sehirler" className="glass-panel p-3.5 rounded-2xl text-center border-slate-200 shadow-xs hover:border-amber-400 transition group">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 font-display group-hover:scale-105 transition">81 İl</div>
              <div className="text-xs text-slate-500 font-semibold mt-0.5">Eşzamanlı Operasyon Gücü</div>
            </Link>
            <Link to="/projeler" className="glass-panel p-3.5 rounded-2xl text-center border-slate-200 shadow-xs hover:border-amber-400 transition group">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display group-hover:scale-105 transition">500+</div>
              <div className="text-xs text-slate-500 font-semibold mt-0.5">Başarılı Kurumsal Etkinlik</div>
            </Link>
            <div className="glass-panel p-3.5 rounded-2xl text-center border-slate-200 shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 font-display">250K+</div>
              <div className="text-xs text-slate-500 font-semibold mt-0.5">Ağırlanan Katılımcı</div>
            </div>
            <div className="glass-panel p-3.5 rounded-2xl text-center border-slate-200 shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-display">15 Dil</div>
              <div className="text-xs text-slate-500 font-semibold mt-0.5">Uluslararası MICE & Tercüme</div>
            </div>
          </div>

          {/* Quick Target Sector Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500">
            <span className="text-slate-700 font-bold">Sektörel Çözümler:</span>
            {[
              { name: 'Otomotiv', to: '/sektorler/otomotiv-ve-mobilite' },
              { name: 'İlaç & Sağlık', to: '/sektorler/ilac-ve-saglik' },
              { name: 'Sanayi & Üretim', to: '/sektorler/sanayi-ve-uretim' },
              { name: 'Bankacılık & Finans', to: '/sektorler/bankacilik-ve-finans' },
              { name: 'Teknoloji', to: '/sektorler/teknoloji-ve-yazilim' }
            ].map((s, idx) => (
              <Link 
                key={idx} 
                to={s.to}
                className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-amber-400 hover:text-amber-800 font-medium shadow-2xs transition"
              >
                {s.name}
              </Link>
            ))}
          </div>

          {/* 15-Language International MICE & Congress Desks */}
          <div className="pt-4 border-t border-slate-200/80 max-w-4xl mx-auto">
            <div className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-2">
              🌐 Uluslararası B2B MICE & Kongre Masaları (15 Dil):
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {SUPPORTED_LANGUAGES.filter((l) => l.code !== 'tr').map((lang) => (
                <Link
                  key={lang.code}
                  to={lang.path}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-400 text-slate-800 hover:text-amber-900 text-xs font-semibold shadow-2xs transition flex items-center gap-1.5"
                  title={`${lang.name} (${lang.regionLabel})`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                  <span className="text-[10px] text-slate-400">({lang.nativeName})</span>
                  {lang.isRecommended && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                      MICE+
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

