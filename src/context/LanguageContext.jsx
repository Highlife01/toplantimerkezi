import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  SUPPORTED_LANGUAGES,
  INTERNATIONAL_LANG_CODES,
  LANGUAGE_MAP,
  I18N_CONTENT
} from '../data/i18nData';
import { getNavExtra } from '../data/navI18n';

const LanguageContext = createContext(null);

export function detectLangFromPathname(pathname = '/') {
  const clean = String(pathname || '/').replace(/^\/+|\/+$/g, '');
  const firstSegment = clean.split('/')[0]?.toLowerCase();
  if (firstSegment && INTERNATIONAL_LANG_CODES.includes(firstSegment)) {
    return firstSegment;
  }
  return null;
}

export function LanguageProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const urlLang = detectLangFromPathname(location.pathname);
  const [selectedLang, setSelectedLang] = useState(urlLang || 'tr');

  // URL'de dil kodu varsa (/en, /ru, /ar vb.) aktif dili senkronize et
  const activeLang = urlLang || selectedLang || 'tr';
  const langInfo = LANGUAGE_MAP[activeLang] || LANGUAGE_MAP.tr;
  const isRtl = langInfo.dir === 'rtl';

  useEffect(() => {
    if (urlLang && urlLang !== selectedLang) {
      setSelectedLang(urlLang);
    } else if (location.pathname === '/' && selectedLang !== 'tr' && urlLang === null) {
      // Kullanıcı doğrudan "/" ana sayfasına geçtiyse Türkçe göster
      setSelectedLang('tr');
    }
  }, [location.pathname, urlLang]);

  // HTML lang ve dir (LTR / RTL) özniteliklerini gerçek zamanlı güncelle
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', langInfo.code);
      document.documentElement.setAttribute('dir', langInfo.dir || 'ltr');
    }
  }, [langInfo.code, langInfo.dir]);

  const switchLanguage = (langCode, options = { navigateToPortal: true }) => {
    const target = LANGUAGE_MAP[langCode] || LANGUAGE_MAP.tr;
    setSelectedLang(target.code);

    if (options?.navigateToPortal !== false) {
      if (target.code === 'tr') {
        navigate('/');
      } else {
        navigate(target.path);
      }
    }
  };

  const value = useMemo(() => {
    const content = I18N_CONTENT[activeLang] || I18N_CONTENT.en || I18N_CONTENT.tr;
    const nav = { ...I18N_CONTENT.tr.nav, ...(content.nav || {}), ...getNavExtra(activeLang) };
    const hero = { ...I18N_CONTENT.tr.hero, ...(content.hero || {}) };

    return {
      currentLang: activeLang,
      langInfo,
      isRtl,
      content,
      nav,
      hero,
      supportedLanguages: SUPPORTED_LANGUAGES,
      switchLanguage
    };
  }, [activeLang, langInfo, isRtl]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      currentLang: 'tr',
      langInfo: LANGUAGE_MAP.tr,
      isRtl: false,
      content: I18N_CONTENT.tr,
      nav: { ...I18N_CONTENT.tr.nav, ...getNavExtra('tr') },
      hero: I18N_CONTENT.tr.hero,
      supportedLanguages: SUPPORTED_LANGUAGES,
      switchLanguage: () => {}
    };
  }
  return ctx;
}
