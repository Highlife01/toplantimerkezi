import React, { useEffect, useMemo, useState } from 'react';
import {
  Calculator,
  Plus,
  Trash2,
  FileDown,
  Send,
  Save,
  AlertCircle,
  CheckCircle2,
  History,
  Copy,
  ExternalLink,
  Percent
} from 'lucide-react';
import {
  storageService,
  buildInitialCostItems,
  calculateSalePriceFromTargetMargin
} from '../../services/storageService';
import { pdfService } from '../../services/pdfService';
import { formatCurrencyTL } from './DashboardModule';

export default function CostCalcModule({
  leads = [],
  suppliers = [],
  venues = [],
  settings = {},
  selectedLeadId,
  onSelectLeadId,
  userProfile,
  rolePerms,
  onLeadsMutated,
  onNotify
}) {
  const activeLead = useMemo(() => {
    if (!leads.length) return null;
    return leads.find((l) => l.id === selectedLeadId) || leads[0];
  }, [leads, selectedLeadId]);

  const [costItems, setCostItems] = useState([]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [validityDays, setValidityDays] = useState(15);
  const [globalTargetMargin, setGlobalTargetMargin] = useState('25');
  const [linkedVenueId, setLinkedVenueId] = useState('');
  const [includedScope, setIncludedScope] = useState('');
  const [excludedScope, setExcludedScope] = useState('');
  const [paymentPlan, setPaymentPlan] = useState('');
  const [terms, setTerms] = useState('');
  const [marginError, setMarginError] = useState('');
  const [savingDraft, setSavingDraft] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  useEffect(() => {
    if (!activeLead) {
      setCostItems([]);
      return;
    }
    setCostItems(buildInitialCostItems(activeLead));
    setDiscountAmount(Number(activeLead.discountAmount) || 0);
    setValidityDays(Number(activeLead.validityDays) || 15);
    setLinkedVenueId(activeLead.linkedVenueId || '');
    setIncludedScope(
      activeLead.includedScope ||
        'Teklif tablosunda belirtilen tüm mekân, sahne, LED ekran, ses/ışık, catering ve teknik operasyon kalemleri dahildir.'
    );
    setExcludedScope(
      activeLead.excludedScope ||
        'Tabloda açıkça belirtilmeyen kişisel harcamalar, ekstra sanatçı/konaklama talepleri ve resmi harçlar kapsam dışıdır.'
    );
    setPaymentPlan(
      activeLead.paymentPlan ||
        '%50 sözleşme onayında avans, %50 organizasyon tamamlandığında fatura karşılığı kurumsal banka havalesi/EFT.'
    );
    setTerms(
      activeLead.terms ||
        `Bu teklif düzenlenme tarihinden itibaren ${activeLead.validityDays || 15} gün süreyle geçerlidir. Salon ve teknik ekipman müsaitliği kesin onay anındaki duruma bağlıdır.`
    );
    setMarginError('');
  }, [activeLead?.id, activeLead?.recordVersion]);

  const draftFinancials = useMemo(() => {
    if (!activeLead) return null;
    return storageService.calculateLeadFinancials(
      {
        ...activeLead,
        costItems,
        discountAmount
      },
      { useEditorItems: true }
    );
  }, [activeLead, costItems, discountAmount]);

  const updateLineItem = (index, field, value) => {
    setMarginError('');
    setCostItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;
        const updated = { ...item, [field]: value };

        if (field === 'supplierId') {
          const sup = suppliers.find((s) => s.id === value);
          updated.supplierName = sup ? sup.company : '';
        }

        const qty = Math.max(0, Number(updated.quantity) || 0);
        const uCost = Math.max(0, Number(updated.unitCost) || 0);
        updated.totalCost = Math.round(qty * uCost * 100) / 100;

        return updated;
      })
    );
  };

  const applyMarginToItem = (index) => {
    const item = costItems[index];
    if (!item) return;
    const totalCost = Math.round((Number(item.quantity) || 0) * (Number(item.unitCost) || 0) * 100) / 100;
    const check = calculateSalePriceFromTargetMargin(totalCost, item.targetMargin);
    if (!check.valid) {
      setMarginError(check.error);
      onNotify('error', check.error);
      return;
    }
    setMarginError('');
    setCostItems((prev) =>
      prev.map((it, idx) =>
        idx === index ? { ...it, totalCost, salePrice: check.salePrice } : it
      )
    );
  };

  const applyGlobalTargetMargin = () => {
    const check = calculateSalePriceFromTargetMargin(100, globalTargetMargin);
    if (!check.valid) {
      setMarginError(check.error);
      onNotify('error', check.error);
      return;
    }
    const targetM = Number(globalTargetMargin);
    setMarginError('');
    setCostItems((prev) =>
      prev.map((item) => {
        const qty = Math.max(0, Number(item.quantity) || 0);
        const uCost = Math.max(0, Number(item.unitCost) || 0);
        const totalCost = Math.round(qty * uCost * 100) / 100;
        if (totalCost <= 0) {
          return { ...item, targetMargin: targetM };
        }
        const res = calculateSalePriceFromTargetMargin(totalCost, targetM);
        return {
          ...item,
          totalCost,
          targetMargin: targetM,
          salePrice: res.valid ? res.salePrice : item.salePrice
        };
      })
    );
    onNotify(
      'success',
      `Maliyeti girilmiş tüm kalemlere %${targetM} hedef marj formülü [Satış = Maliyet / (1 - Marj)] uygulandı.`
    );
  };

  const handleAddCustomCostItem = () => {
    setCostItems((prev) => [
      ...prev,
      {
        id: `ci-custom-${Date.now()}`,
        category: 'Ek Hizmet Kalemi',
        description: 'Özel Prodüksiyon / Ek Organizasyon Hizmeti',
        supplierId: '',
        supplierName: '',
        quantity: 1,
        unit: 'Paket',
        unitCost: 0,
        totalCost: 0,
        targetMargin: 25,
        salePrice: 0,
        vatRate: 20,
        zeroCostConfirmed: false
      }
    ]);
  };

  const handleRemoveCostItem = (index) => {
    if (costItems.length <= 1) {
      onNotify('error', 'Teklifte en az 1 hizmet kalemi bulunmalıdır.');
      return;
    }
    setCostItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveDraft = async () => {
    if (!activeLead || !rolePerms?.canManagePricing) {
      onNotify('error', 'Maliyet ve fiyatlandırma kaydetme yetkiniz bulunmuyor.');
      return;
    }
    setSavingDraft(true);
    try {
      const matchedVenue = venues.find((v) => v.id === linkedVenueId);
      await storageService.updateLead(
        activeLead.id,
        {
          costItems,
          discountAmount: Math.max(0, Number(discountAmount) || 0),
          validityDays: Math.max(1, Number(validityDays) || 15),
          linkedVenueId,
          linkedVenueName: matchedVenue ? matchedVenue.name : activeLead.linkedVenueName || '',
          includedScope,
          excludedScope,
          paymentPlan,
          terms,
          quotedPrice: draftFinancials?.netSaleExclVat || 0
        },
        {
          actor: userProfile,
          expectedRecordVersion: activeLead.recordVersion
        }
      );
      if (onLeadsMutated) onLeadsMutated();
      onNotify('success', 'Maliyet kalemleri ve teklif taslağı Firestore üzerine kaydedildi.');
    } catch (err) {
      onNotify('error', err?.message || 'Taslak kaydedilemedi.');
    } finally {
      setSavingDraft(false);
    }
  };

  const handlePublishImmutableVersion = async () => {
    if (!activeLead || !rolePerms?.canManagePricing) {
      onNotify('error', 'Teklif versiyonu yayınlama yetkiniz bulunmuyor.');
      return;
    }
    if (!draftFinancials || draftFinancials.netSaleExclVat <= 0) {
      onNotify(
        'error',
        'Resmi teklif versiyonu yayınlamak için en az bir kalemde KDV hariç satış tutarı 0 TL üzerinde olmalıdır.'
      );
      return;
    }
    setPublishing(true);
    try {
      const matchedVenue = venues.find((v) => v.id === linkedVenueId);
      if (linkedVenueId !== activeLead.linkedVenueId) {
        await storageService.updateLead(
          activeLead.id,
          {
            linkedVenueId,
            linkedVenueName: matchedVenue ? matchedVenue.name : ''
          },
          { actor: userProfile }
        );
      }

      const { publishedSnapshot } = await storageService.publishProposalVersion(
        activeLead.id,
        {
          costItems,
          discountAmount: Math.max(0, Number(discountAmount) || 0),
          validityDays: Math.max(1, Number(validityDays) || 15),
          includedScope,
          excludedScope,
          paymentPlan,
          terms
        },
        userProfile
      );
      if (onLeadsMutated) onLeadsMutated();
      onNotify(
        'success',
        `${publishedSnapshot.revisionLabel} (Versiyon ${publishedSnapshot.versionNumber}) değişmez kayıt olarak yayınlandı ve müşteri takip bağlantısı güncellendi.`
      );
    } catch (err) {
      onNotify('error', err?.message || 'Versiyon yayınlanamadı.');
    } finally {
      setPublishing(false);
    }
  };

  const handleDownloadPdf = async (versionSnapshot = null) => {
    if (!activeLead) return;
    setGeneratingPdf(true);
    try {
      const matchedVenue = venues.find((v) => v.id === linkedVenueId);
      const leadForPdf = {
        ...activeLead,
        linkedVenueName: matchedVenue ? matchedVenue.name : activeLead.linkedVenueName || '',
        costItems,
        discountAmount,
        validityDays,
        includedScope,
        excludedScope,
        paymentPlan,
        terms
      };
      await pdfService.generateProposalPdf(leadForPdf, settings, {
        versionSnapshot,
        saveToFile: true
      });
      onNotify(
        'success',
        `A4 Kurumsal Teklif PDF belgesi (${
          versionSnapshot ? versionSnapshot.revisionLabel : activeLead.currentRevisionLabel || 'Taslak'
        }) indirildi. İç maliyetler ve marj gizlendi.`
      );
    } catch (err) {
      onNotify('error', `PDF üretimi sırasında hata: ${err?.message || 'Bilinmeyen hata'}`);
    } finally {
      setGeneratingPdf(false);
    }
  };

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
        <Calculator className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-slate-900">
          Maliyetlendirilecek Kurumsal Talep Bulunmuyor
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
          Önce CRM Pipeline veya Dashboard üzerinden gerçek bir kurumsal talep oluşturun.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Üst Talep Seçici & Hızlı Hedef Marj Çubuğu */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-end gap-4 flex-1 min-w-[280px]">
          <div className="min-w-[280px] flex-1 max-w-md">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Maliyetlendirilen Kurumsal Talep Seçimi
            </label>
            <select
              value={activeLead?.id || ''}
              onChange={(e) => onSelectLeadId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-extrabold text-slate-900 bg-slate-50"
            >
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.id} — {l.company} ({l.organizationType} / {l.city} / {l.attendees} Kişi) [
                  {l.currentRevisionLabel || 'Taslak'}]
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-[220px]">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Bağlı Mekân / Salon
            </label>
            <select
              value={linkedVenueId}
              onChange={(e) => setLinkedVenueId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-slate-50"
            >
              <option value="">Mekân Bağlanmadı</option>
              {venues.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.city})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Toplu Hedef Kâr Marjı (%)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="99.9"
                value={globalTargetMargin}
                onChange={(e) => setGlobalTargetMargin(e.target.value)}
                className="w-28 px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
              />
            </div>
            <button
              type="button"
              disabled={!rolePerms?.canManagePricing}
              onClick={applyGlobalTargetMargin}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center gap-1.5 disabled:opacity-40"
            >
              <Percent className="w-3.5 h-3.5 text-amber-400" />
              Maliyetten Satış Hesapla
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {rolePerms?.canManagePricing && (
            <>
              <button
                type="button"
                disabled={savingDraft}
                onClick={handleSaveDraft}
                className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                {savingDraft ? 'Kaydediliyor...' : 'Taslağı Kaydet'}
              </button>
              <button
                type="button"
                disabled={publishing}
                onClick={handlePublishImmutableVersion}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-4 h-4" />
                {publishing
                  ? 'Yayınlanıyor...'
                  : `Resmi Teklif Yayınla (Rev.${activeLead?.currentVersion || 0})`}
              </button>
            </>
          )}
          <button
            type="button"
            disabled={generatingPdf}
            onClick={() => handleDownloadPdf(null)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold inline-flex items-center gap-1.5 shadow-sm"
          >
            <FileDown className="w-4 h-4" />
            {generatingPdf ? 'PDF Üretiliyor...' : 'A4 Kurumsal PDF İndir'}
          </button>
        </div>
      </div>

      {marginError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3.5 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          {marginError}
        </div>
      )}

      {/* Maliyet Kalemleri Tablosu (7 Standart + Ek Kalemler) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Maliyetlendirme & Satış Kalemleri Tablosu (KDV Hariç Esaslı)
            </h3>
            <p className="text-[11px] text-slate-500">
              Formül: <strong>Satış Tutarı = Toplam Maliyet / (1 − Hedef Marj / 100)</strong>. İç maliyetler, tedarikçi isimleri ve marjlar müşteri PDF çıktısında kesinlikle gizlenir.
            </p>
          </div>
          {rolePerms?.canManagePricing && (
            <button
              type="button"
              onClick={handleAddCustomCostItem}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Ek Maliyet Kalemi Ekle
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase">
                <th className="py-2.5 px-3">Kategori</th>
                <th className="py-2.5 px-3 min-w-[200px]">Hizmet Açıklaması (PDF&apos;de Görünür)</th>
                <th className="py-2.5 px-3 min-w-[160px]">Tedarikçi (Gizli)</th>
                <th className="py-2.5 px-3 w-20">Miktar</th>
                <th className="py-2.5 px-3 w-24">Birim</th>
                <th className="py-2.5 px-3 w-32 text-right">Birim Maliyet (TL)</th>
                <th className="py-2.5 px-3 w-32 text-right">Toplam Maliyet</th>
                <th className="py-2.5 px-3 w-32 text-center">Hedef Marj (%)</th>
                <th className="py-2.5 px-3 w-36 text-right">Satış Tutarı (KDV Hariç)</th>
                <th className="py-2.5 px-3 w-20 text-center">KDV %</th>
                <th className="py-2.5 px-3 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {costItems.map((item, idx) => {
                const rowCost = Math.round((Number(item.quantity) || 0) * (Number(item.unitCost) || 0) * 100) / 100;
                const rowSale = Math.max(0, Number(item.salePrice) || 0);
                const rowMissingCost = rowSale > 0 && rowCost <= 0 && !item.zeroCostConfirmed;

                return (
                  <tr key={item.id || idx} className={rowMissingCost ? 'bg-amber-50/40' : 'hover:bg-slate-50/60'}>
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        disabled={!rolePerms?.canManagePricing}
                        value={item.category || ''}
                        onChange={(e) => updateLineItem(idx, 'category', e.target.value)}
                        className="w-28 px-2 py-1.5 rounded-lg border border-slate-200 font-bold text-slate-900 bg-white text-xs"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        disabled={!rolePerms?.canManagePricing}
                        value={item.description || ''}
                        onChange={(e) => updateLineItem(idx, 'description', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-800 bg-white text-xs"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <select
                        disabled={!rolePerms?.canManagePricing}
                        value={item.supplierId || ''}
                        onChange={(e) => updateLineItem(idx, 'supplierId', e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-white text-[11px]"
                      >
                        <option value="">Tedarikçi Seçilmedi</option>
                        {suppliers
                          .filter((s) => s.isActive !== false || s.id === item.supplierId)
                          .map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.company} ({s.city})
                            </option>
                          ))}
                      </select>
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        disabled={!rolePerms?.canManagePricing}
                        value={item.quantity}
                        onChange={(e) => updateLineItem(idx, 'quantity', e.target.value)}
                        className="w-16 px-2 py-1.5 rounded-lg border border-slate-200 text-center font-semibold bg-white"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        disabled={!rolePerms?.canManagePricing}
                        value={item.unit || 'Paket'}
                        onChange={(e) => updateLineItem(idx, 'unit', e.target.value)}
                        className="w-20 px-2 py-1.5 rounded-lg border border-slate-200 text-center bg-white"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <input
                        type="number"
                        min="0"
                        step="100"
                        disabled={!rolePerms?.canManagePricing}
                        value={item.unitCost}
                        onChange={(e) => updateLineItem(idx, 'unitCost', e.target.value)}
                        className="w-28 px-2 py-1.5 rounded-lg border border-slate-200 text-right font-semibold bg-white"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                      {formatCurrencyTL(rowCost)}
                      {rowMissingCost && (
                        <div className="text-[10px] text-amber-700 font-semibold">
                          Maliyet Girilmedi!
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="99.9"
                          step="0.5"
                          disabled={!rolePerms?.canManagePricing}
                          value={item.targetMargin ?? 25}
                          onChange={(e) => updateLineItem(idx, 'targetMargin', e.target.value)}
                          className="w-16 px-1.5 py-1.5 rounded-lg border border-slate-200 text-center font-semibold bg-white"
                        />
                        <button
                          type="button"
                          disabled={!rolePerms?.canManagePricing}
                          onClick={() => applyMarginToItem(idx)}
                          title="Satış = Maliyet / (1 - Marj) Uygula"
                          className="px-2 py-1.5 rounded-lg bg-slate-900 text-amber-400 text-[10px] font-bold hover:bg-slate-800"
                        >
                          Uygula
                        </button>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <input
                        type="number"
                        min="0"
                        step="100"
                        disabled={!rolePerms?.canManagePricing}
                        value={item.salePrice}
                        onChange={(e) => updateLineItem(idx, 'salePrice', e.target.value)}
                        className="w-32 px-2 py-1.5 rounded-lg border border-amber-300 text-right font-extrabold text-slate-900 bg-amber-50/40"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <select
                        disabled={!rolePerms?.canManagePricing}
                        value={item.vatRate !== undefined ? item.vatRate : 20}
                        onChange={(e) => updateLineItem(idx, 'vatRate', Number(e.target.value))}
                        className="px-1.5 py-1.5 rounded-lg border border-slate-200 font-semibold bg-white"
                      >
                        <option value={20}>%20</option>
                        <option value={10}>%10</option>
                        <option value={1}>%1</option>
                        <option value={0}>%0</option>
                      </select>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {rolePerms?.canManagePricing && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCostItem(idx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Kalemi Kaldır"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Finansal Özet, İndirimSonrası Marj ve Kapsam / Şartlar */}
      {draftFinancials && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol 2 Sütun: Kapsam, Ödeme Planı ve Şartlar */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">
              Resmi Teklif Kapsamı, Ödeme Planı ve Geçerlilik Şartları (PDF Çıktısı)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Teklife Dahil Olan Hizmetler
                </label>
                <textarea
                  rows={3}
                  value={includedScope}
                  onChange={(e) => setIncludedScope(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kapsam Dışı Hizmetler
                </label>
                <textarea
                  rows={3}
                  value={excludedScope}
                  onChange={(e) => setExcludedScope(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kurumsal Ödeme Planı
                </label>
                <textarea
                  rows={2}
                  value={paymentPlan}
                  onChange={(e) => setPaymentPlan(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Teklif Şartları & Geçerlilik Notu
                </label>
                <textarea
                  rows={2}
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>

            {/* Yayınlanmış Değişmez (Immutable) Teklif Versiyonları Geçmişi */}
            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 mb-2.5">
                <History className="w-4 h-4 text-slate-600" />
                Yayınlanmış Resmi Teklif Versiyonları (Değişmez Kayıtlar — {(activeLead?.proposals || []).length} Adet)
              </h4>
              {(activeLead?.proposals || []).length === 0 ? (
                <p className="text-xs text-slate-500">
                  Henüz yayınlanmış bir resmi teklif versiyonu bulunmuyor. &ldquo;Resmi Teklif Yayınla&rdquo; butonuna bastığınızda Rev.0 oluşturulur.
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {(activeLead.proposals || []).map((ver) => (
                    <div
                      key={ver.versionNumber}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-400 mr-2">
                          {ver.revisionLabel} (v{ver.versionNumber})
                        </span>
                        <span className="font-bold text-slate-900">
                          Net Satış (KDV Hariç): {formatCurrencyTL(ver.financials?.netSaleExclVat)}
                        </span>
                        <span className="text-slate-500 ml-2">
                          • KDV Dahil: {formatCurrencyTL(ver.financials?.grandTotalInclVat)}
                        </span>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Yayınlayan: {ver.publishedByEmail} • Tarih:{' '}
                          {ver.publishedAt ? new Date(ver.publishedAt).toLocaleString('tr-TR') : '-'} • Geçerlilik:{' '}
                          {ver.validUntil}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownloadPdf(ver)}
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 font-bold text-[11px] inline-flex items-center gap-1"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        {ver.revisionLabel} PDF İndir
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sağ Sütun: Canlı Finansal Özet & Kârlılık Analizi */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Finansal Doğrulama Motoru
                </span>
                <h3 className="text-base font-extrabold">Maliyet, KDV & Kârlılık Özeti</h3>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-xs font-mono font-bold">
                {activeLead?.currentRevisionLabel || 'Taslak'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Kurumsal İskonto (KDV Hariç TL)
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Teklif Geçerlilik Süresi (Gün)
                </label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={validityDays}
                  onChange={(e) => setValidityDays(Math.max(1, Number(e.target.value) || 15))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-bold"
                />
              </div>
            </div>

            <div className="space-y-2.5 text-xs pt-2 border-t border-slate-800">
              <div className="flex justify-between text-slate-300">
                <span>Toplam İç Maliyet (KDV Hariç):</span>
                <span className="font-bold text-white">
                  {formatCurrencyTL(draftFinancials.totalCostExclVat)}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Brüt Satış Toplamı (KDV Hariç):</span>
                <span className="font-bold text-white">
                  {formatCurrencyTL(draftFinancials.grossSaleExclVat)}
                </span>
              </div>
              {draftFinancials.discountExclVat > 0 && (
                <div className="flex justify-between text-amber-400">
                  <span>Kurumsal İskonto (−):</span>
                  <span className="font-bold">
                    −{formatCurrencyTL(draftFinancials.discountExclVat)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-slate-800">
                <span>Net Satış Tutarı (KDV Hariç):</span>
                <span className="text-amber-400">
                  {formatCurrencyTL(draftFinancials.netSaleExclVat)}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Hesaplanan KDV Tutarı:</span>
                <span className="font-semibold">
                  {formatCurrencyTL(draftFinancials.vatAmount)}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-emerald-400 pt-2 border-t border-slate-800">
                <span>Genel Toplam (KDV Dahil):</span>
                <span>{formatCurrencyTL(draftFinancials.grandTotalInclVat)}</span>
              </div>
            </div>

            {/* İndirim Sonrası Yeniden Hesaplanan Brüt Kâr & Marj */}
            <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase">
                İndirim Sonrası Net Kârlılık Analizi (Yalnızca İç Yönetim)
              </div>
              {draftFinancials.isProfitCalculable ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300">Brüt Kâr (Net Satış − Maliyet):</span>
                    <span
                      className={`text-sm font-extrabold ${
                        draftFinancials.grossProfitExclVat >= 0
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {formatCurrencyTL(draftFinancials.grossProfitExclVat)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300">Gerçekleşen Kâr Marjı (%):</span>
                    <span className="text-sm font-extrabold text-amber-400">
                      {draftFinancials.marginDisplay}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-xs text-amber-300 font-semibold flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    {draftFinancials.hasMissingCosts
                      ? 'Satış fiyatı girilmiş ancak maliyeti 0 TL bırakılmış kalemler var. Eksik maliyet sıfır kabul edilerek yanıltıcı kâr üretilmez.'
                      : 'Satış ve maliyet tutarları girildiğinde brüt kâr ve marj otomatik hesaplanır.'}
                  </span>
                </div>
              )}
            </div>

            {activeLead?.accessToken && (
              <div className="pt-2 border-t border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                  Müşteri Güvenli Takip Portalı
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const url = `${window.location.origin}/teklif-takip?kod=${activeLead.id}&token=${activeLead.accessToken}`;
                      navigator.clipboard?.writeText(url);
                      onNotify('success', 'Müşteri güvenli teklif takip bağlantısı kopyalandı.');
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold inline-flex items-center justify-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Güvenli Bağlantıyı Kopyala
                  </button>
                  <a
                    href={`/teklif-takip?kod=${activeLead.id}&token=${activeLead.accessToken}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold inline-flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Aç
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
