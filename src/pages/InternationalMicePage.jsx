import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  Sparkles,
  ArrowRight,
  Building2,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  Phone,
  Calendar,
  Users,
  Layers,
  Headphones,
  Award,
  Send,
  Copy,
  ExternalLink,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import {
  SUPPORTED_LANGUAGES,
  LANGUAGE_MAP,
  I18N_CONTENT
} from '../data/i18nData';
import { ALL_81_CITIES } from '../data/citiesData';
import { storageService } from '../services/storageService';
import { updatePageSeo } from '../services/seoService';

export default function InternationalMicePage({ langCode = 'en', onOpenQuoteModal }) {
  const langInfo = LANGUAGE_MAP[langCode] || LANGUAGE_MAP.en;
  const content = I18N_CONTENT[langInfo.code] || I18N_CONTENT.en;
  const isRtl = langInfo.dir === 'rtl';
  const settings = storageService.getSettings();

  const [formState, setFormState] = useState({
    company: '',
    contactName: '',
    email: '',
    phone: '',
    organizationType: content.solutions?.[0]?.title || 'International B2B Conference',
    city: 'İstanbul',
    attendees: 150,
    targetDate: '',
    budgetRange: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submittedLead, setSubmittedLead] = useState(null);
  const [copiedToken, setCopiedToken] = useState(false);

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      organizationType: content.solutions?.[0]?.title || prev.organizationType
    }));
    setSubmitError('');
  }, [langInfo.code]);

  useEffect(() => {
    const canonicalUrl = `https://www.toplantimerkezi.com.tr${langInfo.path}`;
    updatePageSeo({
      title: content.metaTitle,
      description: content.metaDesc,
      canonicalUrl,
      keywords: langInfo.seoKeywords,
      faqs: content.faqs || [],
      language: langInfo.code,
      schemaJson: {
        '@context': 'https://schema.org',
        '@type': 'EventVenue',
        name: `Toplantı Merkezi — ${langInfo.nativeName} B2B MICE Desk`,
        url: canonicalUrl,
        description: content.metaDesc,
        inLanguage: langInfo.hreflang || langInfo.code,
        availableLanguage: SUPPORTED_LANGUAGES.map((l) => l.hreflang),
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Büyükdere Cad. No:199 Levent',
          addressLocality: 'Beşiktaş',
          addressRegion: 'İstanbul',
          addressCountry: 'TR'
        }
      }
    });
    window.scrollTo(0, 0);
  }, [langInfo.code, content.metaTitle, content.metaDesc, langInfo.path]);

  const handleSubmitRfp = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);
    try {
      const created = await storageService.addLead({
        company: formState.company,
        contactName: formState.contactName,
        email: formState.email,
        phone: formState.phone,
        organizationType: `[${langInfo.code.toUpperCase()}] ${formState.organizationType}`,
        city: formState.city || 'İstanbul',
        attendees: Number(formState.attendees) || 100,
        targetDate: formState.targetDate,
        budgetRange: formState.budgetRange || 'International RFP',
        notes: `[Dil/Bölge: ${langInfo.name} (${langInfo.nativeName} - ${langInfo.code.toUpperCase()})] ${formState.notes || ''}`.trim(),
        language: langInfo.code,
        languageName: langInfo.name
      });
      setSubmittedLead(created);
    } catch (err) {
      setSubmitError(err?.message || 'Submission failed. Please check required fields.');
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToRfpForm = () => {
    const el = document.getElementById('international-rfp-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onOpenQuoteModal) {
      onOpenQuoteModal();
    }
  };

  const handleCopyTrackingLink = () => {
    if (!submittedLead) return;
    const url = `${window.location.origin}/teklif-takip?kod=${encodeURIComponent(submittedLead.id)}&token=${encodeURIComponent(submittedLead.accessToken)}`;
    navigator.clipboard?.writeText(url);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2500);
  };

  return (
    <div dir={langInfo.dir || 'ltr'} className="w-full pt-24 pb-20 bg-slate-50">
      {/* 15-Language Global Switcher Ribbon */}
      <div className="bg-slate-900 border-b border-slate-800 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <Globe size={15} />
              <span>{content.hero?.intlDeskTitle || 'Global B2B MICE Desks (15 Languages):'}</span>
            </div>
            <div className="text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 font-semibold">
                ★ {langInfo.flag} {langInfo.nativeName} ({langInfo.regionLabel})
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {SUPPORTED_LANGUAGES.map((l) => {
              const active = l.code === langInfo.code;
              return (
                <Link
                  key={l.code}
                  to={l.path}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 border ${
                    active
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-sm'
                      : 'bg-slate-800/90 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-amber-500/60'
                  }`}
                >
                  <span>{l.flag}</span>
                  <span>{l.nativeName}</span>
                  {l.isRecommended && (
                    <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${active ? 'bg-slate-950 text-amber-300' : 'bg-amber-500/20 text-amber-300'}`}>
                      MICE+
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-14 lg:py-20 bg-gradient-to-b from-white via-slate-50 to-white border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm font-bold shadow-2xs">
              <span>{langInfo.flag}</span>
              <span>{content.hero?.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 font-display leading-tight">
              {content.hero?.titleLine1}{' '}
              <span className="gold-gradient-text">{content.hero?.titleHighlight}</span>{' '}
              {content.hero?.titleLine2}
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              {content.hero?.subtitle}
            </p>

            {langInfo.isRecommended && langInfo.recommendationReason && (
              <div className="max-w-2xl mx-auto px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold">
                <strong className="text-emerald-800">B2B MICE Stratejik Pazar Masası ({langInfo.name}):</strong>{' '}
                {langInfo.recommendationReason}
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={scrollToRfpForm}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl gold-gradient-bg text-slate-950 font-extrabold text-base shadow-md hover:scale-105 transition"
              >
                <Sparkles size={18} />
                <span>{content.hero?.primaryCta}</span>
                <ArrowRight size={18} className={isRtl ? 'rotate-180' : ''} />
              </button>

              <a
                href={`https://wa.me/${settings.whatsappPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`[${langInfo.nativeName} MICE Desk] Hello Toplantı Merkezi, we would like to request an official B2B event proposal in Türkiye.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-sm transition"
              >
                <MessageSquare size={18} />
                <span>{content.nav?.whatsappQuote || 'WhatsApp MICE Desk'}</span>
              </a>

              <Link
                to="/mekanlar"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 transition"
              >
                <Building2 size={17} className="text-amber-600" />
                <span>{content.hero?.secondaryCta}</span>
              </Link>
            </div>

            {/* Key Metrics */}
            <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {(content.metrics || []).map((m, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 font-display">{m.value}</div>
                  <div className="text-xs text-slate-600 font-semibold mt-1">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Direct Answer & Executive Summary (GEO) */}
      {content.aiDirectAnswer && (
        <section className="py-10 bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              data-geo-answer="true"
              className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 text-white shadow-xl border border-amber-500/30"
            >
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <ShieldCheck size={16} />
                <span>Executive B2B MICE Overview ({langInfo.nativeName})</span>
              </div>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal overview-text">
                {content.aiDirectAnswer}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 6 Core B2B Event Solutions */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            {content.solutionsTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            {content.solutionsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(content.solutions || []).map((sol, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-extrabold text-sm mb-4">
                  0{idx + 1}
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 font-display mb-2">
                  {sol.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {sol.desc}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    setFormState((prev) => ({ ...prev, organizationType: sol.title }));
                    scrollToRfpForm();
                  }}
                  className="text-xs font-extrabold text-amber-700 hover:text-amber-900 flex items-center gap-1"
                >
                  <span>{content.nav?.getQuote || 'Request Proposal'}</span>
                  <ArrowRight size={13} className={isRtl ? 'rotate-180' : ''} />
                </button>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                  B2B Turnkey
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Production & Simultaneous Interpretation */}
      <section className="py-14 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              {content.servicesTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {(content.services || []).map((srv, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition"
              >
                <div className="w-9 h-9 rounded-lg gold-gradient-bg text-slate-950 flex items-center justify-center mb-3 shadow-xs">
                  {idx === 0 ? <Building2 size={18} /> : idx === 1 ? <Layers size={18} /> : idx === 2 ? <Headphones size={18} /> : <Award size={18} />}
                </div>
                <h3 className="text-base font-extrabold text-slate-900 font-display mb-1.5">
                  {srv.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {srv.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top MICE Destinations in Türkiye */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              {content.destinationsTitle}
            </h2>
          </div>
          <Link
            to="/sehirler"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-700 hover:text-amber-900"
          >
            <MapPin size={14} />
            <span>{content.nav?.cities || '81 Cities Directory'} →</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {(content.destinations || []).map((dest, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 mb-2.5">
                  {dest.tag}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 font-display mb-1.5">
                  {dest.city}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {dest.desc}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100">
                <Link
                  to="/mekanlar"
                  className="text-xs font-bold text-slate-800 hover:text-amber-700 flex items-center gap-1"
                >
                  <span>{content.nav?.venues || 'Venues & Hotels'}</span>
                  <ArrowRight size={12} className={isRtl ? 'rotate-180' : ''} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Embedded Live Firestore International RFP Form */}
      <section id="international-rfp-section" className="py-14 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-bold mb-3">
                <span>{langInfo.flag}</span>
                <span>{content.form?.badge}</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                {content.form?.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                {content.form?.subtitle}
              </p>
            </div>

            {submittedLead ? (
              <div className="p-6 sm:p-8 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-center space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={26} />
                </div>
                <h3 className="text-xl font-extrabold text-white font-display">
                  {content.form?.successTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
                  {content.form?.successDesc}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                      RFP Reference Code
                    </div>
                    <div className="text-base font-extrabold text-amber-400 font-mono mt-0.5">
                      {submittedLead.id}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                      Security Access Token
                    </div>
                    <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5 break-all">
                      {submittedLead.accessToken}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Link
                    to={`/teklif-takip?kod=${encodeURIComponent(submittedLead.id)}&token=${encodeURIComponent(submittedLead.accessToken)}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gold-gradient-bg text-slate-950 font-extrabold text-xs sm:text-sm shadow-md"
                  >
                    <ExternalLink size={16} />
                    <span>{content.form?.trackBtn}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleCopyTrackingLink}
                    className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
                  >
                    <Copy size={14} />
                    <span>{copiedToken ? 'Copied!' : 'Copy Secure Link'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitRfp} className="space-y-4">
                {submitError && (
                  <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0 text-red-400" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {content.form?.company}
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.company}
                      onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                      placeholder="e.g. Global Pharma Holding GmbH"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {content.form?.contactName}
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.contactName}
                      onChange={(e) => setFormState({ ...formState, contactName: e.target.value })}
                      placeholder="Full Name & Title"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {content.form?.email}
                    </label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="name@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {content.form?.phone}
                    </label>
                    <input
                      type="tel"
                      required
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      placeholder="+49 / +44 / +971 / +90 ..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {content.form?.orgType}
                    </label>
                    <select
                      value={formState.organizationType}
                      onChange={(e) => setFormState({ ...formState, organizationType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                    >
                      {(content.solutions || []).map((s, idx) => (
                        <option key={idx} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {content.form?.city}
                    </label>
                    <select
                      value={formState.city}
                      onChange={(e) => setFormState({ ...formState, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                    >
                      {ALL_81_CITIES.map((c) => (
                        <option key={c.slug} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {content.form?.attendees}
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="50000"
                      value={formState.attendees}
                      onChange={(e) => setFormState({ ...formState, attendees: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {content.form?.targetDate}
                    </label>
                    <input
                      type="date"
                      value={formState.targetDate}
                      onChange={(e) => setFormState({ ...formState, targetDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {content.form?.budget}
                    </label>
                    <input
                      type="text"
                      value={formState.budgetRange}
                      onChange={(e) => setFormState({ ...formState, budgetRange: e.target.value })}
                      placeholder="e.g. 80,000 EUR - 150,000 EUR"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {content.form?.notes}
                  </label>
                  <textarea
                    rows={3}
                    value={formState.notes}
                    onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                    placeholder="Hotel category, ballroom layout, LED screen, simultaneous interpretation, airport transfer details..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-2xl gold-gradient-bg text-slate-950 font-extrabold text-sm sm:text-base shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send size={17} />
                  <span>{submitting ? content.form?.submitting : content.form?.submitBtn}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {Array.isArray(content.faqs) && content.faqs.length > 0 && (
        <section className="py-14 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <HelpCircle size={20} className="text-amber-600" />
            <h2 className="text-2xl font-extrabold text-slate-900 font-display">
              FAQ — {langInfo.nativeName} B2B MICE Desk
            </h2>
          </div>
          <div className="space-y-4">
            {content.faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mb-2">
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
