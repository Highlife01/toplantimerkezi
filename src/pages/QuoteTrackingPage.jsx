import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { storageService, PIPELINE_STAGES } from '../services/storageService';
import { generateProposalPdf, formatCurrencyTR } from '../services/pdfService';
import UrgentEventBanner from '../components/common/UrgentEventBanner';
import { updatePageSeo } from '../services/seoService';
import {
  Search, CheckCircle2, Clock, FileText, Download,
  Building2, Calendar, Users, MapPin, ShieldCheck,
  AlertCircle, ArrowRight, MessageSquare, KeyRound, Send, RefreshCw
} from 'lucide-react';

export default function QuoteTrackingPage({ onOpenQuoteModal }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCode = queryParams.get('kod') || '';
  const initialToken = queryParams.get('token') || '';

  const [searchCode, setSearchCode] = useState(initialCode);
  const [accessToken, setAccessToken] = useState(initialToken);
  const [matchedProposal, setMatchedProposal] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Müşteri Yanıt (Onay / Revizyon) State
  const [responseNote, setResponseNote] = useState('');
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);

  useEffect(() => {
    // Müşteri özel teklif takip sayfası arama motorlarına kapatılır (noindex)
    updatePageSeo({
      title: 'Güvenli Teklif & Talep Takip Portalı | Toplantı Merkezi',
      description: 'Toplantı Merkezi kurumsal teklif referans numaranız ve güvenlik erişim anahtarınız ile teklif özetinizi inceleyin.',
      canonicalUrl: 'https://www.toplantimerkezi.com.tr/teklif-takip',
      noindex: true
    });
    window.scrollTo(0, 0);

    if (initialCode && initialToken) {
      handleSearch(initialCode, initialToken);
    }
  }, [initialCode, initialToken]);

  const handleSearch = async (codeOverride, tokenOverride) => {
    const code = String(codeOverride ?? searchCode).trim().toUpperCase();
    const token = String(tokenOverride ?? accessToken).trim();

    setErrorMessage('');
    setResponseMessage(null);

    if (!code || !token) {
      setHasSearched(true);
      setMatchedProposal(null);
      setErrorMessage(
        'Güvenlik politikası gereği yalnızca tahmin edilebilir teklif numarası ile sorgulama yapılamaz. Lütfen hem Teklif Referans Kodunuzu (TLP-...) hem de Güvenlik Erişim Anahtarınızı giriniz.'
      );
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const found = await storageService.fetchPublicProposalSecure(code, token);
      if (!found) {
        setMatchedProposal(null);
        setErrorMessage('Girilen referans kodu ve güvenlik anahtarı eşleşmedi veya bağlantı süresi sona erdi.');
      } else {
        setMatchedProposal(found);
      }
    } catch (err) {
      setMatchedProposal(null);
      setErrorMessage(err?.message || 'Teklif bilgileri doğrulanırken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomerResponse = async (statusType) => {
    if (!matchedProposal || isSubmittingResponse) return;
    if (statusType === 'revision_requested' && !responseNote.trim()) {
      setResponseMessage({
        type: 'error',
        text: 'Revizyon talebi gönderirken lütfen revize edilmesini istediğiniz detayları not alanına yazınız.'
      });
      return;
    }

    setIsSubmittingResponse(true);
    setResponseMessage(null);
    try {
      const updated = await storageService.submitCustomerProposalResponse({
        leadId: matchedProposal.leadId,
        accessToken: matchedProposal.accessToken || accessToken.trim(),
        status: statusType,
        note: responseNote.trim()
      });
      setMatchedProposal(updated);
      setResponseNote('');
      setResponseMessage({
        type: 'success',
        text: statusType === 'approved'
          ? `Teklifin ${updated.currentRevisionLabel} (v${updated.currentVersion}) versiyonu için kurumsal onay mutabakatınız sunucuya kaydedildi. Bu işlem bir ödeme tahsilatı değildir; sözleşme ve faturalandırma için operasyon ekibimiz sizinle iletişime geçecektir.`
          : `Teklifin ${updated.currentRevisionLabel} (v${updated.currentVersion}) versiyonu için revizyon talebiniz operasyon masamıza iletildi.`
      });
    } catch (err) {
      setResponseMessage({
        type: 'error',
        text: err?.message || 'Yanıtınız kaydedilirken bir sorun oluştu.'
      });
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  const getStageIndex = (stageName) => {
    const idx = PIPELINE_STAGES.indexOf(stageName);
    return idx !== -1 ? idx : 0;
  };

  return (
    <div className="pt-28 pb-20 bg-slate-50 text-slate-900 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-8">
          <Link to="/" className="hover:text-amber-800 font-medium">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-amber-900 font-bold">Güvenli Teklif & Talep Takip Portalı</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold shadow-2xs">
            <ShieldCheck size={14} className="text-amber-700" />
            <span>Kriptografik Erişim Korumalı B2B Müşteri Portalı</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-display">
            Kurumsal Teklif İnceleme & Onay Masası
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Başvurunuz sonrasında size iletilen <strong className="text-slate-900 font-mono">TLP Referans Kodu</strong> ve <strong className="text-slate-900 font-mono">Güvenlik Erişim Anahtarı</strong> ile resmi teklif özetinizi inceleyebilir, PDF olarak indirebilir veya onay/revizyon yanıtınızı iletebilirsiniz.
          </p>
        </div>

        {/* Secure Verification Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-300 shadow-lg mb-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  1. Teklif Referans Kodu *
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    required
                    placeholder="Örn: TLP-2026-XXXXXX"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-950 font-mono font-bold placeholder-slate-400 focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="md:col-span-5">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  2. Güvenlik Erişim Anahtarı (Token) *
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    required
                    placeholder="Size iletilen 20 haneli erişim anahtarı"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-950 font-mono font-bold placeholder-slate-400 focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="md:col-span-2 flex items-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-2xl gold-gradient-bg text-slate-950 font-extrabold text-xs sm:text-sm shadow-md hover:scale-102 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isLoading ? <RefreshCw size={15} className="animate-spin" /> : <ArrowRight size={15} />}
                  <span>{isLoading ? 'Doğrulanıyor' : 'Görüntüle'}</span>
                </button>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1">
              <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
              <span>
                KVKK ve ticari gizlilik gereği teklif özetlerine yalnızca süreli ve kriptografik erişim anahtarıyla ulaşılabilir.
              </span>
            </div>
          </form>
        </div>

        {/* Search Results */}
        {hasSearched && !isLoading && (
          <div>
            {matchedProposal ? (
              <div className="bg-white rounded-3xl border border-slate-300 shadow-xl overflow-hidden mb-12 space-y-0">

                {/* Top Banner */}
                <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400 px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
                        {matchedProposal.leadId}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-300 px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
                        {matchedProposal.currentVersion > 0
                          ? `Versiyon: v${matchedProposal.currentVersion} (${matchedProposal.currentRevisionLabel})`
                          : 'Ön Değerlendirme & Bütçe Hazırlığı'}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold font-display text-white pt-1">{matchedProposal.company}</h2>
                    <p className="text-xs text-slate-300">
                      Yetkili: {matchedProposal.contactName} ({matchedProposal.title || 'Yetkili'})
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <span className="text-[11px] text-slate-400 block uppercase tracking-wider">Güncel Süreç Durumu</span>
                    <span className="inline-block mt-1 px-4 py-1.5 rounded-full text-xs font-extrabold bg-amber-400 text-slate-950 shadow-md">
                      {matchedProposal.publicStatusLabel || matchedProposal.stage}
                    </span>
                    {matchedProposal.validUntil && matchedProposal.currentVersion > 0 && (
                      <span className="block text-[11px] text-slate-400 mt-1.5">
                        Teklif Geçerlilik Tarihi: <strong className="text-slate-200">{matchedProposal.validUntil}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* 11-Stage Grouped Progress */}
                <div className="p-6 sm:p-8 border-b border-slate-200 bg-slate-50/60">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
                    11 Aşamalı Kurumsal Operasyon Takibi (Güncel Aşama: {matchedProposal.stage})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { title: '1. Talep & Analiz', stages: ['Yeni Talep', 'İlk Görüşme', 'İhtiyaç Analizi'] },
                      { title: '2. Mekân & Bütçe', stages: ['Mekân Araştırması', 'Maliyetlendirme', 'Teklif Hazırlanıyor'] },
                      { title: '3. Teklif & Revizyon', stages: ['Teklif Gönderildi', 'Revizyon'] },
                      { title: '4. Onay & Operasyon', stages: ['Onaylandı', 'Operasyon Hazırlığı', 'Tamamlandı'] }
                    ].map((group, idx) => {
                      const currentIdx = getStageIndex(matchedProposal.stage);
                      const isCompleted = group.stages.some(s => PIPELINE_STAGES.indexOf(s) <= currentIdx);
                      const isCurrent = group.stages.includes(matchedProposal.stage);
                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-2xl border text-center space-y-1.5 ${
                            isCurrent
                              ? 'bg-amber-50 border-amber-400 shadow-sm'
                              : isCompleted
                              ? 'bg-white border-slate-300'
                              : 'bg-slate-100/70 border-slate-200 opacity-60'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-full mx-auto flex items-center justify-center font-bold text-xs ${
                            isCurrent
                              ? 'gold-gradient-bg text-slate-950'
                              : isCompleted
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-300 text-slate-700'
                          }`}>
                            {isCompleted ? <CheckCircle2 size={14} /> : idx + 1}
                          </div>
                          <div className="text-xs font-bold text-slate-950">{group.title}</div>
                          <div className="text-[11px] text-slate-600 font-medium">
                            {isCurrent ? matchedProposal.stage : isCompleted ? 'Tamamlandı' : 'Sırada'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Organization Summary */}
                <div className="p-6 sm:p-8 space-y-8">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 font-semibold block mb-1">Organizasyon Türü</span>
                      <strong className="text-slate-950 font-bold">{matchedProposal.organizationType}</strong>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 font-semibold block mb-1">Lokasyon / Mekân</span>
                      <strong className="text-slate-950 font-bold">
                        {matchedProposal.city}
                        {matchedProposal.district ? ` / ${matchedProposal.district}` : ''}
                        {matchedProposal.linkedVenueName ? ` (${matchedProposal.linkedVenueName})` : ''}
                      </strong>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 font-semibold block mb-1">Planlanan Tarih</span>
                      <strong className="text-slate-950 font-bold">
                        {matchedProposal.targetDate || 'Belirleniyor'}
                        {matchedProposal.isMultiDay && matchedProposal.endDate ? ` – ${matchedProposal.endDate}` : ''}
                      </strong>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 font-semibold block mb-1">Katılımcı Sayısı</span>
                      <strong className="text-slate-950 font-bold">{matchedProposal.attendees} Kişi</strong>
                    </div>
                  </div>

                  {/* Published Proposal Table & Totals (Customer-Safe ONLY) */}
                  {matchedProposal.currentVersion > 0 && Array.isArray(matchedProposal.customerLineItems) && matchedProposal.customerLineItems.length > 0 ? (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                        <div>
                          <h3 className="text-lg font-bold text-slate-950 font-display">
                            Resmi Teklif Kalemleri ({matchedProposal.currentRevisionLabel})
                          </h3>
                          <p className="text-xs text-slate-500">
                            Satış tutarları KDV hariç olarak listelenmiş olup KDV ayrıca eklenmiştir.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => generateProposalPdf(matchedProposal)}
                          className="px-5 py-2.5 rounded-xl gold-gradient-bg text-slate-950 font-extrabold text-xs shadow-md hover:scale-102 transition flex items-center gap-2 self-start sm:self-auto"
                        >
                          <Download size={15} />
                          <span>Resmi A4 Teklif PDF İndir ({matchedProposal.currentRevisionLabel})</span>
                        </button>
                      </div>

                      <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-slate-900 text-white uppercase tracking-wider text-[11px]">
                              <th className="p-3.5 font-bold">No</th>
                              <th className="p-3.5 font-bold">Hizmet Kalemi & Açıklama</th>
                              <th className="p-3.5 font-bold">Miktar / Birim</th>
                              <th className="p-3.5 font-bold text-right">Birim Fiyat (KDV H.)</th>
                              <th className="p-3.5 font-bold text-right">KDV</th>
                              <th className="p-3.5 font-bold text-right">Toplam (KDV Hariç)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {matchedProposal.customerLineItems.map((item, i) => (
                              <tr key={i} className="hover:bg-slate-50">
                                <td className="p-3.5 font-mono font-bold text-slate-600">{item.no}</td>
                                <td className="p-3.5">
                                  <div className="font-bold text-slate-950">{item.category}</div>
                                  <div className="text-slate-600 text-[11px]">{item.description}</div>
                                </td>
                                <td className="p-3.5 font-semibold text-slate-800">{item.quantity} {item.unit}</td>
                                <td className="p-3.5 text-right font-mono text-slate-800">{formatCurrencyTR(item.unitSalePriceExclVat)}</td>
                                <td className="p-3.5 text-right font-mono text-slate-600">%{item.vatRate}</td>
                                <td className="p-3.5 text-right font-mono font-bold text-slate-950">{formatCurrencyTR(item.salePriceExclVat)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Financial Summary & Scope */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-7 space-y-3 text-xs">
                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                            <span className="font-bold text-slate-900 block mb-1">Dahil Olan Hizmet Kapsamı:</span>
                            <p className="text-slate-600 leading-relaxed">{matchedProposal.includedScope}</p>
                          </div>
                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                            <span className="font-bold text-slate-900 block mb-1">Kapsam Dışı Hizmetler:</span>
                            <p className="text-slate-600 leading-relaxed">{matchedProposal.excludedScope}</p>
                          </div>
                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                            <span className="font-bold text-slate-900 block mb-1">Ödeme Planı & Geçerlilik Şartları:</span>
                            <p className="text-slate-600 leading-relaxed">{matchedProposal.paymentPlan} — {matchedProposal.terms}</p>
                          </div>
                        </div>

                        <div className="lg:col-span-5 bg-amber-50/70 border border-amber-300 rounded-2xl p-5 space-y-3 text-xs self-start">
                          <h4 className="font-bold text-sm text-slate-950 border-b border-amber-200 pb-2">
                            Teklif Finansal Özeti
                          </h4>
                          {matchedProposal.discountExclVat > 0 && (
                            <>
                              <div className="flex justify-between text-slate-700">
                                <span>Ara Toplam (KDV Hariç):</span>
                                <span className="font-mono font-semibold">{formatCurrencyTR(matchedProposal.grossSaleExclVat)}</span>
                              </div>
                              <div className="flex justify-between text-amber-900">
                                <span>Kurumsal İskonto (KDV Hariç):</span>
                                <span className="font-mono font-bold">-{formatCurrencyTR(matchedProposal.discountExclVat)}</span>
                              </div>
                            </>
                          )}
                          <div className="flex justify-between text-slate-900 font-bold">
                            <span>Net Toplam (KDV Hariç):</span>
                            <span className="font-mono">{formatCurrencyTR(matchedProposal.netSaleExclVat)}</span>
                          </div>
                          <div className="flex justify-between text-slate-700">
                            <span>Hesaplanan KDV Tutarı:</span>
                            <span className="font-mono font-semibold">{formatCurrencyTR(matchedProposal.vatAmount)}</span>
                          </div>
                          <div className="pt-2 border-t border-amber-300 flex justify-between items-center text-sm font-extrabold text-slate-950">
                            <span>GENEL TOPLAM (KDV Dahil):</span>
                            <span className="font-mono text-base text-amber-900">{formatCurrencyTR(matchedProposal.grandTotalInclVat)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Customer Approval / Revision Response Box */}
                      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-300 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h4 className="text-base font-bold text-slate-950 font-display">
                              Müşteri Teklif Yanıtı & Kurumsal Mutabakat ({matchedProposal.currentRevisionLabel})
                            </h4>
                            <p className="text-xs text-slate-600">
                              Bu işlem sunulan teklif versiyonuna ilişkin resmi mutabakat veya revizyon talebinizi kaydeder; online ödeme tahsilatı değildir.
                            </p>
                          </div>
                          {matchedProposal.customerResponse?.status && matchedProposal.customerResponse.status !== 'pending' && (
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              matchedProposal.customerResponse.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}>
                              {matchedProposal.customerResponse.status === 'approved'
                                ? `Onaylandı (${matchedProposal.customerResponse.revisionLabel || 'v' + matchedProposal.customerResponse.versionNumber})`
                                : `Revizyon İstendi (${matchedProposal.customerResponse.revisionLabel || 'v' + matchedProposal.customerResponse.versionNumber})`}
                            </span>
                          )}
                        </div>

                        {responseMessage && (
                          <div className={`p-4 rounded-xl text-xs font-medium border ${
                            responseMessage.type === 'success'
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                              : 'bg-rose-50 border-rose-300 text-rose-900'
                          }`}>
                            {responseMessage.text}
                          </div>
                        )}

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Onay Notunuz veya Revizyon Talebi Detaylarınız:
                          </label>
                          <textarea
                            rows="2"
                            value={responseNote}
                            onChange={(e) => setResponseNote(e.target.value)}
                            placeholder="Varsa revize edilmesini istediğiniz kalemleri veya sözleşme öncesi notunuzu buraya yazabilirsiniz..."
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-600"
                          ></textarea>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            disabled={isSubmittingResponse}
                            onClick={() => handleCustomerResponse('approved')}
                            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition flex items-center gap-2 disabled:opacity-50"
                          >
                            <CheckCircle2 size={15} />
                            <span>Teklifi Onayla ({matchedProposal.currentRevisionLabel} Mutabakatı)</span>
                          </button>

                          <button
                            type="button"
                            disabled={isSubmittingResponse}
                            onClick={() => handleCustomerResponse('revision_requested')}
                            className="px-5 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 font-bold text-xs transition flex items-center gap-2 disabled:opacity-50"
                          >
                            <Send size={14} />
                            <span>Revizyon Talep Et</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 text-center space-y-2">
                      <Clock size={28} className="text-amber-700 mx-auto" />
                      <h4 className="font-bold text-sm text-slate-950">
                        Resmi Fiyat Teklifiniz Hazırlanıyor
                      </h4>
                      <p className="text-xs text-slate-600 max-w-xl mx-auto">
                        Talebiniz şu anda <strong>{matchedProposal.stage}</strong> aşamasındadır. Operasyon ve bütçe ekibimiz kalem bazlı resmi teklif versiyonunuzu (Rev.0) yayınladığında bu ekrandan tüm kalemleri inceleyebilir ve A4 PDF olarak indirebilirsiniz.
                      </p>
                    </div>
                  )}

                  {/* Support Footer */}
                  <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-slate-600">
                      <span className="font-bold text-slate-900 block">Kurumsal Operasyon Masası:</span>
                      Toplantı Merkezi Kurumsal Organizasyon A.Ş. (+90 532 055 09 45)
                    </div>

                    <a
                      href={`https://wa.me/905320550945?text=${encodeURIComponent(`Merhaba Toplantı Merkezi, ${matchedProposal.leadId} numaralı teklifimiz hakkında görüşmek istiyorum.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5"
                    >
                      <MessageSquare size={15} />
                      <span>WhatsApp Koordinasyon Hattı</span>
                    </a>
                  </div>

                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-3xl border border-rose-200 text-center space-y-4 shadow-md mb-12">
                <AlertCircle size={40} className="text-rose-500 mx-auto" />
                <h3 className="text-lg font-bold text-slate-950 font-display">
                  Teklif Özeti Görüntülenemedi
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                  {errorMessage || 'Lütfen size iletilen Teklif Referans Kodunu ve 20 haneli Güvenlik Erişim Anahtarını kontrol ederek tekrar deneyiniz.'}
                </p>
              </div>
            )}
          </div>
        )}

      </div>

      <UrgentEventBanner onOpenQuoteModal={onOpenQuoteModal} />
    </div>
  );
}
