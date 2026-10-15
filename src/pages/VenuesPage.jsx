import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { VENUES } from '../data/venuesData';
import {
  SUPPORTED_LANGUAGES,
  matchLanguageFromQuery,
  searchMultiLanguageCatalog,
  normalizeMultiLangText
} from '../data/i18nData';
import SectionTitle from '../components/common/SectionTitle';
import UrgentEventBanner from '../components/common/UrgentEventBanner';
import { updatePageSeo } from '../services/seoService';
import {
  Building, MapPin, Users, Filter, Search,
  Sparkles, ArrowRight, Star, CheckCircle2, ChevronDown, Bot, Globe, Languages
} from 'lucide-react';

// Çok dilli şehir ve mekân terim eşleştirme sözlüğü (15 dilde arama desteği)
const MULTILANG_VENUE_TERMS = {
  istanbul: ['istanbul', 'стамбул', 'إسطنبول', 'استانبول', '伊斯坦布尔', 'इस्तांबुल', 'イスタンブール', '이스탄불', 'estambul'],
  antalya: ['antalya', 'анталья', 'анталия', 'أنطاليا', 'آنتالیا', '安塔利亚', 'अंताल्या', 'アンタルヤ', '안탈리아', 'belek', 'lara', 'kundu'],
  ankara: ['ankara', 'анкара', 'أنقرة', 'آنکارا', '安卡拉', 'अंकारा', 'アンカラ', '앙카라'],
  izmir: ['izmir', 'измир', 'إزمير', 'ازمیر', '伊兹密尔', 'इज़मिर', 'イズミル', '이즈미르', 'çeşme', 'cesme'],
  congress: ['kongre', 'congress', 'conference', 'конгресс', 'конференция', 'kongress', 'congresso', 'congreso', '会议', 'सम्मेलन', 'مؤتمر', 'همایش', 'كنفرانس', 'congrès', 'konqres', '会議', '컨퍼런스', 'congres'],
  hotel: ['otel', 'hotel', 'resort', 'отель', 'курорт', 'albergo', '酒店', 'होटल', 'فندق', 'هتل', 'hôtel', 'ホテル', '호텔']
};

export default function VenuesPage({ onOpenQuoteModal }) {
  // SearchAction uyumu: /mekanlar?q=... ve /mekanlar?lang=... sorgularını arama alanına aktar
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialLang = searchParams.get('lang') || 'Tümü';

  const [selectedCity, setSelectedCity] = useState('Tümü');
  const [selectedType, setSelectedType] = useState('Tümü');
  const [capacityFilter, setCapacityFilter] = useState('Tümü');
  const [selectedLang, setSelectedLang] = useState(initialLang);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    const qParam = searchParams.get('q');
    const lParam = searchParams.get('lang');
    if (qParam !== null) setSearchQuery(qParam);
    if (lParam !== null) setSelectedLang(lParam);
  }, [searchParams]);

  useEffect(() => {
    updatePageSeo({
      title: 'Toplantı ve Kongre Mekânları | 15 Dilde Salon & MICE Arama Motoru',
      description: '5 yıldızlı kongre otelleri, bağımsız toplantı salonları ve 15 dilde simultane tercüme altyapılı MICE etkinlik alanları. Dile, şehre ve kapasiteye göre filtreleyin.',
      canonicalUrl: 'https://www.toplantimerkezi.com.tr/mekanlar',
      keywords: 'toplantı salonları, kongre otelleri, 15 dilde simultane tercüme salonları, MICE venues Turkey, ingilizce rusça arapça almanca çince farsça hintçe kongre salonu arama',
      breadcrumbs: [
        { name: 'Ana Sayfa', url: '/' },
        { name: 'Mekânlar & 15 Dil MICE Arama Motoru', url: '/mekanlar' }
      ],
      itemList: VENUES.slice(0, 12).map(v => ({
        name: `${v.name} (${v.city})`,
        url: `/mekanlar?q=${encodeURIComponent(v.name)}`,
        description: `${v.city} / ${v.district} - Maks. ${v.capacity} Kişilik ${v.venueType}. ${v.description}`
      }))
    });
    window.scrollTo(0, 0);
  }, []);

  const venueTypes = ['Tümü', 'Kongre Merkezi', 'Otel', 'Davet Alanı', 'Açık Hava / Piknik'];
  const popularCities = ['Tümü', 'İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Adana', 'Bursa', 'Mersin', 'Gaziantep', 'Kayseri', 'Kocaeli'];

  // Kullanıcının yazdığı sorgudan eşleşen dilleri bul (Örn: "rusça", "arapça", "hindistanca", "english", "中文", "العربية")
  const matchedLanguagesFromQuery = useMemo(() => {
    const byQuery = matchLanguageFromQuery(searchQuery);
    if (selectedLang !== 'Tümü') {
      const explicitLang = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang);
      if (explicitLang && !byQuery.some((b) => b.code === explicitLang.code)) {
        return [explicitLang, ...byQuery];
      }
    }
    return byQuery;
  }, [searchQuery, selectedLang]);

  // Çok dilli MICE katalog sonuçları (15 dilde çözümler, simultane tercüme ve destinasyonlar)
  const multiLangResults = useMemo(() => {
    if (!searchQuery.trim() && selectedLang === 'Tümü') return null;
    return searchMultiLanguageCatalog(
      searchQuery,
      selectedLang === 'Tümü' ? 'all' : selectedLang
    );
  }, [searchQuery, selectedLang]);

  const filteredVenues = useMemo(() => {
    const qNorm = normalizeMultiLangText(searchQuery);
    const isLanguageOnlySearch = matchedLanguagesFromQuery.length > 0 && matchedLanguagesFromQuery.some(l =>
      normalizeMultiLangText(l.name) === qNorm ||
      normalizeMultiLangText(l.nativeName) === qNorm ||
      (l.searchAliases || []).some(a => normalizeMultiLangText(a) === qNorm)
    );

    return VENUES.filter(venue => {
      const matchCity = selectedCity === 'Tümü' || venue.city.toLowerCase() === selectedCity.toLowerCase();
      const matchType = selectedType === 'Tümü' || venue.venueType === selectedType;

      // Kapasite filtresi
      let matchCap = true;
      if (capacityFilter === '100-500') matchCap = venue.capacity >= 100 && venue.capacity <= 500;
      else if (capacityFilter === '500-1500') matchCap = venue.capacity > 500 && venue.capacity <= 1500;
      else if (capacityFilter === '1500+') matchCap = venue.capacity > 1500;

      // Dil filtresi: Tüm 5 yıldızlı kongre merkezleri ve MICE otelleri 15 dil ISO 4043 simultane tercüme kabin desteğine sahiptir
      const supportedVenueLangs = venue.supportedLanguages || SUPPORTED_LANGUAGES.map(l => l.code);
      const matchLang = selectedLang === 'Tümü' || supportedVenueLangs.includes(selectedLang);

      if (!qNorm || isLanguageOnlySearch) {
        return matchCity && matchType && matchCap && matchLang;
      }

      // Çok dilli şehir/terim eşleşmesi
      const venueCityNorm = normalizeMultiLangText(venue.city);
      let multiLangCityHit = false;
      Object.entries(MULTILANG_VENUE_TERMS).forEach(([key, synonyms]) => {
        if (synonyms.some(s => qNorm.includes(s))) {
          if (key === 'congress' && (venue.venueType === 'Kongre Merkezi' || venue.venueType === 'Otel')) {
            multiLangCityHit = true;
          } else if (key === 'hotel' && venue.venueType === 'Otel') {
            multiLangCityHit = true;
          } else if (venueCityNorm.includes(key)) {
            multiLangCityHit = true;
          }
        }
      });

      const directTextHit =
        normalizeMultiLangText(venue.name).includes(qNorm) ||
        venueCityNorm.includes(qNorm) ||
        normalizeMultiLangText(venue.district).includes(qNorm) ||
        normalizeMultiLangText(venue.description).includes(qNorm) ||
        (venue.technicalGear || []).some(g => normalizeMultiLangText(g).includes(qNorm));

      return matchCity && matchType && matchCap && matchLang && (directTextHit || multiLangCityHit || matchedLanguagesFromQuery.length > 0);
    });
  }, [selectedCity, selectedType, capacityFilter, selectedLang, searchQuery, matchedLanguagesFromQuery]);

  const handleLanguageChipClick = (code) => {
    const nextLang = selectedLang === code ? 'Tümü' : code;
    setSelectedLang(nextLang);
    const nextParams = new URLSearchParams(searchParams);
    if (nextLang === 'Tümü') nextParams.delete('lang');
    else nextParams.set('lang', nextLang);
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <div className="pt-28 pb-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-8">
          <Link to="/" className="hover:text-amber-700">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-amber-800 font-bold">Mekânlar & 15 Dilli MICE Arama Motoru</span>
        </div>

        <SectionTitle
          badge="Mekân Portföyü & 15 Dilde MICE Arama Motoru"
          title="Toplantı, Kongre & 15 Dilde MICE Arama Motoru"
          subtitle="5 yıldızlı kongre otellerini, toplantı salonlarını ve 15 dildeki (İngilizce, Rusça, Almanca, İtalyanca, İspanyolca, Çince, Hintçe/Hindistanca, Arapça, Farsça, Fransızca, Azerbaycanca, Japonca, Korece, Felemenkçe ve Türkçe) uluslararası organizasyon çözümlerini arayın."
        />

        {/* GEO AI Direct Answer Card */}
        <div
          data-geo-answer="true"
          className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-300 shadow-md mb-8 flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-2xl gold-gradient-bg flex items-center justify-center shrink-0 shadow-sm text-slate-950">
            <Bot size={20} />
          </div>
          <div className="space-y-1.5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900 block">
              Yapay Zekâ ve Çok Dilli Arama Motoru Doğrudan Yanıtı (AI Summary)
            </span>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Toplantı Merkezi Mekân ve Çok Dilli MICE Arama Motoru; İstanbul, Antalya, Ankara, İzmir ve Adana başta olmak üzere 81 ilde 100 kişiden 5.000+ kişiye kadar kongre merkezlerini ve 15 dilde (Türkçe, İngilizce, Rusça, Almanca, İtalyanca, İspanyolca, Çince, Hintçe, Arapça, Farsça, Fransızca, Azerbaycanca, Japonca, Korece, Felemenkçe) ISO 4043 simultane tercüme altyapısına sahip uluslararası B2B etkinlik çözümlerini tek ekranda filtreleyerek 2 saatte karşılaştırmalı resmi PDF teklif sunar.
            </p>
          </div>
        </div>

        {/* 15 Dil Hızlı Arama & Filtre Çubuğu */}
        <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-lg mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-400">
              <Languages size={16} />
              <span>15 Dilde Arama & Simultane Tercüme Filtresi (Dile Göre Ara veya Portal Aç)</span>
            </div>
            <span className="text-[11px] text-slate-400">
              Arama kutusuna &ldquo;Rusça&rdquo;, &ldquo;Arapça&rdquo;, &ldquo;Hindistanca&rdquo;, &ldquo;Çince&rdquo;, &ldquo;English&rdquo;, &ldquo;Русский&rdquo;, &ldquo;العربية&rdquo; yazabilirsiniz
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleLanguageChipClick('Tümü')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                selectedLang === 'Tümü'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                  : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:border-amber-500/50 hover:text-white'
              }`}
            >
              🌐 Tüm 15 Dil
            </button>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageChipClick(lang.code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border flex items-center gap-1.5 ${
                  selectedLang === lang.code
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                    : 'bg-slate-800/90 text-slate-200 border-slate-700 hover:border-amber-500/50 hover:text-white'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
                <span className="text-[10px] opacity-75">({lang.nativeName})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md mb-10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

            {/* Search Input (Supports 15 Languages & Venue Names) */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mekân, Şehir veya Dil Ara (15 Dil Destekli)
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="text"
                  placeholder="Örn: Rusça, Arapça, Hindistanca, English, Русский, العربية, Antalya, Kongre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-600 focus:bg-white"
                />
              </div>
            </div>

            {/* City Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Şehir</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white font-medium"
              >
                {popularCities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Venue Type Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Mekân Tipi</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white font-medium"
              >
                {venueTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Language / Simultaneous Interpretation Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Organizasyon & Tercüme Dili
              </label>
              <select
                value={selectedLang}
                onChange={(e) => handleLanguageChipClick(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white font-medium"
              >
                <option value="Tümü">Tüm Diller (15 Dil)</option>
                {SUPPORTED_LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.name} — {l.nativeName}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span>Toplam <strong className="text-slate-900 font-bold">{filteredVenues.length}</strong> kurumsal mekân listeleniyor</span>
              {selectedLang !== 'Tümü' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold">
                  <Globe size={12} />
                  Aktif Dil Filtresi: {SUPPORTED_LANGUAGES.find(l => l.code === selectedLang)?.name} ({SUPPORTED_LANGUAGES.find(l => l.code === selectedLang)?.nativeName})
                </span>
              )}
            </div>
            {(selectedCity !== 'Tümü' || selectedType !== 'Tümü' || capacityFilter !== 'Tümü' || selectedLang !== 'Tümü' || searchQuery !== '') && (
              <button
                onClick={() => {
                  setSelectedCity('Tümü');
                  setSelectedType('Tümü');
                  setCapacityFilter('Tümü');
                  setSelectedLang('Tümü');
                  setSearchQuery('');
                  setSearchParams({}, { replace: true });
                }}
                className="text-amber-700 font-bold hover:underline"
              >
                Tüm Filtreleri Temizle
              </button>
            )}
          </div>
        </div>

        {/* Eşleşen Uluslararası Dil Portalları ve Çok Dilli Çözümler (Arama veya Dil Seçildiğinde Gösterilir) */}
        {(matchedLanguagesFromQuery.length > 0 || (multiLangResults && (multiLangResults.solutions.length > 0 || multiLangResults.services.length > 0))) && (
          <div className="mb-12 space-y-6">
            {matchedLanguagesFromQuery.length > 0 && (
              <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/40 shadow-xl">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-extrabold uppercase tracking-wider mb-3">
                  <Globe size={16} />
                  <span>Eşleşen Uluslararası B2B MICE & Kongre Dil Portalları</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matchedLanguagesFromQuery.map((lang) => (
                    <div
                      key={lang.code}
                      className="bg-slate-800/90 border border-slate-700 hover:border-amber-400 rounded-2xl p-5 flex flex-col justify-between transition"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-2xl">{lang.flag}</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold">
                            {lang.code.toUpperCase()} • {lang.dir === 'rtl' ? 'RTL' : 'LTR'}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white mb-1">
                          {lang.name} — {lang.nativeName}
                        </h3>
                        <p className="text-xs text-slate-300 mb-3">{lang.regionLabel}</p>
                        {lang.recommendationReason && (
                          <p className="text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 mb-3">
                            ★ {lang.recommendationReason}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-700/80">
                        <Link
                          to={lang.path}
                          className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs text-center transition flex items-center justify-center gap-1"
                        >
                          <span>{lang.nativeName} Portalını Aç</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {multiLangResults && multiLangResults.solutions.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-extrabold text-slate-900 font-display flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-600" />
                    <span>Çok Dilli B2B Organizasyon & Kongre Çözümleri ({multiLangResults.solutions.length} Sonuç)</span>
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {multiLangResults.solutions.slice(0, 6).map((sol) => (
                    <Link
                      key={sol.id}
                      to={sol.path}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-amber-500 hover:shadow-md transition bg-slate-50/70 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-bold text-amber-800 mb-1.5">
                          <span>{sol.langFlag} {sol.langName} ({sol.langNative})</span>
                          <span className="text-slate-400">{sol.path}</span>
                        </div>
                        <div className="font-bold text-slate-900 text-sm mb-1">{sol.title}</div>
                        <p className="text-xs text-slate-600 line-clamp-2">{sol.description}</p>
                      </div>
                      <div className="mt-3 text-xs font-bold text-amber-700 flex items-center gap-1">
                        <span>İlgili Dil Portalında İncele</span>
                        <ArrowRight size={12} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map(venue => (
            <div
              key={venue.id}
              className="bg-white rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-400/60 group"
            >
              {/* Image & Capacity Badge */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-amber-400/40 text-amber-400 text-xs font-bold flex items-center gap-1.5 shadow-md">
                  <MapPin size={12} />
                  <span>{venue.city} / {venue.district}</span>
                </div>

                <div className="absolute bottom-3 right-4 px-3 py-1 rounded-lg bg-white/95 border border-slate-200 text-slate-900 text-xs font-bold flex items-center gap-1 shadow-sm">
                  <Users size={13} className="text-amber-600" />
                  <span>Maks. {venue.capacity.toLocaleString('tr-TR')} Kişi</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <span className="text-amber-700 font-bold">{venue.venueType}</span>
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star size={13} className="fill-current" />
                      {venue.rating}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition font-display mb-2">
                    {venue.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">
                    {venue.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-500 border-t border-slate-100 pt-3">
                    <div className="flex items-center justify-between">
                      <span>Salon Sayısı:</span>
                      <span className="text-slate-900 font-semibold">{venue.salonCount} Salon</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Otopark:</span>
                      <span className="text-slate-900 font-semibold">{venue.parking}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Teknik Altyapı:</span>
                      <span className="text-amber-700 font-semibold">{venue.technicalGear[0]}, {venue.technicalGear[1]}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Simultane Tercüme:</span>
                      <span className="text-emerald-700 font-semibold">15 Dil ISO 4043 Kabin</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenQuoteModal({ initialCity: venue.city })}
                    className="w-full py-2.5 rounded-xl gold-gradient-bg text-slate-950 font-bold text-xs shadow-xs hover:shadow-md transition text-center"
                  >
                    Bu Mekân İçin Teklif Al
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

