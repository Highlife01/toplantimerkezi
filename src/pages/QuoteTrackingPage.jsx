import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { storageService, PIPELINE_STAGES } from '../services/storageService';
import { generateProposalPdf } from '../services/pdfService';
import SectionTitle from '../components/common/SectionTitle';
import UrgentEventBanner from '../components/common/UrgentEventBanner';
import { updatePageSeo } from '../services/seoService';
import { 
  Search, CheckCircle2, Clock, FileText, Download, 
  Building2, Phone, Calendar, Users, MapPin, Sparkles, 
  AlertCircle, ShieldCheck, ArrowRight, MessageSquare
} from 'lucide-react';

export default function QuoteTrackingPage({ onOpenQuoteModal }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCode = queryParams.get('kod') || '';

  const [searchCode, setSearchCode] = useState(initialCode);
  const [matchedLead, setMatchedLead] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    updatePageSeo({
      title: 'Teklif & Talep Durumu Sorgulama | Toplantı Merkezi',
      description: 'Toplantı Merkezi teklif referans numaranız (TLP-2026-XXXX) ile kurumsal organizasyon talebinizin aşamasını canlı takip edin.',
      canonicalUrl: 'https://www.toplantimerkezi.com.tr/teklif-takip'
    });
    window.scrollTo(0, 0);

    if (initialCode) {
      handleSearch(initialCode);
    }
  }, [initialCode]);

  const handleSearch = (codeToSearch) => {
    const term = (codeToSearch || searchCode).trim().toUpperCase();
    if (!term) return;

    setHasSearched(true);
    const leads = storageService.getLeads();
    
    // Match by exact ID or phone number
    const found = leads.find(l => 
      l.id.toUpperCase() === term || 
      l.id.replace(/[^0-9]/g, '') === term.replace(/[^0-9]/g, '') ||
      l.phone.replace(/[^0-9]/g, '').includes(term.replace(/[^0-9]/g, ''))
    );

    setMatchedLead(found || null);
  };

  // Helper to determine stage index in the 11 stages
  const getStageIndex = (stageName) => {
    const idx = PIPELINE_STAGES.indexOf(stageName);
    return idx !== -1 ? idx : 0;
  };

  return (
    <div className="pt-28 pb-20 bg-slate-50 text-slate-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-8">
          <Link to="/" className="hover:text-amber-800 font-medium">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-amber-900 font-bold">Teklif & Talep Takip Portalı</span>
        </div>

        {/* Section Header */}
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold shadow-2xs">
            <Clock size={13} className="text-amber-700" />
            <span>Canlı B2B Talep Takip Sistemi</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-display">
            Teklif Durumu Sorgulama Masası
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Talebinizin ihtiyaç analizi, mekân opsiyonları, maliyetlendirme ve resmi teklif aşamasını <strong className="text-slate-900 font-mono font-bold">TLP referans kodunuz</strong> ile anlık görüntüleyin.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-300 shadow-lg mb-10">
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Talep Referans Kodu veya Telefon Numarası
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Örn: TLP-2026-0891 veya 0532..."
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-11 pr-4 py-3.5 text-sm sm:text-base text-slate-950 font-mono font-bold placeholder-slate-400 focus:outline-none focus:border-amber-600"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3.5 rounded-2xl gold-gradient-bg text-slate-950 font-extrabold text-sm shadow-md hover:scale-102 transition flex items-center justify-center gap-2 shrink-0"
              >
                <span>Durumu Sorgula</span>
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
              <span>💡 Örnek Deneme Kodları:</span>
              <button
                type="button"
                onClick={() => { setSearchCode('TLP-2026-0891'); handleSearch('TLP-2026-0891'); }}
                className="font-mono text-amber-800 font-bold underline hover:text-amber-950"
              >
                TLP-2026-0891
              </button>
              <span>veya</span>
              <button
                type="button"
                onClick={() => { setSearchCode('TLP-2026-0892'); handleSearch('TLP-2026-0892'); }}
                className="font-mono text-amber-800 font-bold underline hover:text-amber-950"
              >
                TLP-2026-0892
              </button>
            </div>
          </form>
        </div>

        {/* Result Area */}
        {hasSearched && (
          <div>
            {matchedLead ? (
              <div className="bg-white rounded-3xl border border-slate-300 shadow-xl overflow-hidden mb-12 animate-in fade-in duration-300">
                
                {/* Result Top Header */}
                <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-amber-400 px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
                      {matchedLead.id}
                    </span>
                    <h2 className="text-2xl font-bold font-display text-white pt-2">{matchedLead.company}</h2>
                    <p className="text-xs text-slate-300">Yetkili: {matchedLead.contactName} ({matchedLead.title || 'Yetkili'})</p>
                  </div>

                  <div className="text-right sm:text-right">
                    <span className="text-[11px] text-slate-400 block uppercase tracking-wider">Güncel Aşama</span>
                    <span className="inline-block mt-1 px-4 py-1.5 rounded-full text-xs font-extrabold bg-amber-400 text-slate-950 shadow-md">
                      {matchedLead.stage}
                    </span>
                  </div>
                </div>

                {/* Progress Stepper */}
                <div className="p-6 sm:p-8 border-b border-slate-200 bg-slate-50/50">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-6">
                    Operasyonel Süreç Çizelgesi:
                  </h3>

                  <div className="relative">
                    {/* Stepper Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { title: '1. Talep Alındı', stages: ['Yeni Talep', 'İlk Görüşme'] },
                        { title: '2. İhtiyaç & Mekân', stages: ['İhtiyaç Analizi', 'Mekân Araştırması'] },
                        { title: '3. Maliyet & Teklif', stages: ['Maliyetlendirme', 'Teklif Hazırlanıyor', 'Teklif Gönderildi', 'Revizyon'] },
                        { title: '4. Onay & Operasyon', stages: ['Onaylandı', 'Operasyon Hazırlığı', 'Organizasyon Gerçekleşti', 'Tamamlandı'] }
                      ].map((stepGroup, idx) => {
                        const currentIdx = getStageIndex(matchedLead.stage);
                        const isCompleted = stepGroup.stages.some(s => PIPELINE_STAGES.indexOf(s) <= currentIdx);
                        const isCurrent = stepGroup.stages.includes(matchedLead.stage);

                        return (
                          <div 
                            key={idx} 
                            className={`p-4 rounded-2xl border text-center space-y-2 transition ${
                              isCurrent 
                                ? 'bg-amber-50 border-amber-400 shadow-md' 
                                : isCompleted 
                                ? 'bg-white border-slate-300' 
                                : 'bg-slate-100/70 border-slate-200 opacity-60'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-bold text-xs ${
                              isCurrent 
                                ? 'gold-gradient-bg text-slate-950 ring-4 ring-amber-200' 
                                : isCompleted 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-slate-300 text-slate-700'
                            }`}>
                              {isCompleted ? <CheckCircle2 size={16} /> : idx + 1}
                            </div>
                            <div className="text-xs font-bold text-slate-950">{stepGroup.title}</div>
                            <div className="text-[10px] text-slate-600 font-medium">
                              {isCurrent ? `👉 ${matchedLead.stage}` : isCompleted ? 'Tamamlandı' : 'Sırada'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Event Details Grid */}
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 font-semibold block mb-1">Organizasyon Türü</span>
                      <strong className="text-slate-950 font-bold">{matchedLead.organizationType}</strong>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 font-semibold block mb-1">Lokasyon / Şehir</span>
                      <strong className="text-slate-950 font-bold">{matchedLead.city} {matchedLead.district ? `(${matchedLead.district})` : ''}</strong>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 font-semibold block mb-1">Planlanan Tarih</span>
                      <strong className="text-slate-950 font-bold">{matchedLead.targetDate || 'Belirleniyor'}</strong>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 font-semibold block mb-1">Katılımcı Sayısı</span>
                      <strong className="text-slate-950 font-bold">{matchedLead.attendees} Kişi</strong>
                    </div>
                  </div>

                  {/* Actions & PDF Download */}
                  <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-slate-600">
                      <span className="font-bold text-slate-900 block">Atanan Proje Direktörlüğü:</span>
                      Toplantı Merkezi B2B Operasyon Masası (0850 308 74 20)
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => generateProposalPdf(matchedLead)}
                        className="flex-1 sm:flex-initial px-5 py-3 rounded-xl gold-gradient-bg text-slate-950 font-extrabold text-xs shadow-md hover:scale-102 transition flex items-center justify-center gap-2"
                      >
                        <Download size={15} />
                        <span>Resmi Teklif PDF İndir</span>
                      </button>

                      <a
                        href="https://wa.me/908503087420"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
                      >
                        <MessageSquare size={15} />
                        <span>WhatsApp Destek</span>
                      </a>
                    </div>
                  </div>

                </div>

              </div>
            ) : (
              <div className="bg-white p-8 rounded-3xl border border-red-200 text-center space-y-4 shadow-md mb-12">
                <AlertCircle size={40} className="text-red-500 mx-auto" />
                <h3 className="text-lg font-bold text-slate-950 font-display">
                  "{searchCode}" Koduna Ait Kayıt Bulunamadı
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Lütfen 7 adımlı teklif sihirbazını doldurduktan sonra size verilen referans kodunu (Örn: TLP-2026-0891) veya telefon numaranızı kontrol ederek tekrar deneyiniz.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => onOpenQuoteModal({})}
                    className="px-6 py-2.5 rounded-xl gold-gradient-bg text-slate-950 font-bold text-xs shadow-md"
                  >
                    Yeni Teklif Talebi Oluştur
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      <UrgentEventBanner onOpenQuoteModal={onOpenQuoteModal} />
    </div>
  );
}
