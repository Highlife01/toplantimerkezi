import React, { useMemo, useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Filter,
  ArrowRight,
  Calculator,
  Calendar,
  MapPin,
  Users,
  Eye,
  Plus,
  Layers
} from 'lucide-react';
import {
  storageService,
  PIPELINE_STAGES,
  OUTCOME_STATUSES
} from '../../services/storageService';

const APPROVED_STAGES = ['Onaylandı', 'Operasyon Hazırlığı', 'Tamamlandı'];
const PENDING_QUOTE_STAGES = [
  'Yeni Talep',
  'İlk Görüşme',
  'İhtiyaç Analizi',
  'Mekân Araştırması',
  'Maliyetlendirme',
  'Teklif Hazırlanıyor',
  'Teklif Gönderildi',
  'Revizyon'
];

export function formatCurrencyTL(val) {
  const num = Number(val) || 0;
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0
  }).format(num);
}

export default function DashboardModule({
  leads = [],
  rolePerms,
  onSelectLeadForDetail,
  onSelectLeadForCostCalc,
  onOpenNewLeadModal,
  onSwitchTab
}) {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [stageFilter, setStageFilter] = useState('Tümü');
  const [outcomeFilter, setOutcomeFilter] = useState('active');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (outcomeFilter !== 'all' && (lead.outcomeStatus || 'active') !== outcomeFilter) {
        return false;
      }
      if (stageFilter !== 'Tümü' && lead.stage !== stageFilter) {
        return false;
      }
      const createdDate = (lead.createdAt || '').split('T')[0];
      if (dateFrom && createdDate && createdDate < dateFrom) {
        return false;
      }
      if (dateTo && createdDate && createdDate > dateTo) {
        return false;
      }
      return true;
    });
  }, [leads, dateFrom, dateTo, stageFilter, outcomeFilter]);

  const metrics = useMemo(() => {
    const totalCount = filteredLeads.length;
    const pendingLeads = filteredLeads.filter(
      (l) => (l.outcomeStatus || 'active') === 'active' && PENDING_QUOTE_STAGES.includes(l.stage)
    );
    const approvedLeads = filteredLeads.filter(
      (l) => (l.outcomeStatus || 'active') === 'active' && APPROVED_STAGES.includes(l.stage)
    );

    // Aynı teklifin revizyonlarını tekrar tekrar toplamaz; calculateLeadFinancials yalnızca geçerli son versiyonu esas alır
    let quotedSaleExclVat = 0;
    let quotedVatAmount = 0;
    let quotedCostExclVat = 0;
    let quotedCalculableSale = 0;
    let quotedCalculableProfit = 0;
    let quotedMissingCostCount = 0;
    let quotedPricedCount = 0;

    let approvedSaleExclVat = 0;
    let approvedVatAmount = 0;
    let approvedCostExclVat = 0;
    let approvedCalculableSale = 0;
    let approvedCalculableProfit = 0;
    let approvedMissingCostCount = 0;

    filteredLeads.forEach((lead) => {
      if ((lead.outcomeStatus || 'active') !== 'active') return;
      const fin = storageService.calculateLeadFinancials(lead);
      const isApproved = APPROVED_STAGES.includes(lead.stage);

      if (fin.netSaleExclVat > 0) {
        quotedPricedCount++;
        quotedSaleExclVat += fin.netSaleExclVat;
        quotedVatAmount += fin.vatAmount;
      }
      if (fin.totalCostExclVat > 0) {
        quotedCostExclVat += fin.totalCostExclVat;
      }
      if (fin.hasMissingCosts) {
        quotedMissingCostCount++;
      }
      if (fin.isProfitCalculable && fin.grossProfitExclVat !== null) {
        quotedCalculableSale += fin.netSaleExclVat;
        quotedCalculableProfit += fin.grossProfitExclVat;
      }

      if (isApproved) {
        approvedSaleExclVat += fin.netSaleExclVat;
        approvedVatAmount += fin.vatAmount;
        approvedCostExclVat += fin.totalCostExclVat;
        if (fin.hasMissingCosts) {
          approvedMissingCostCount++;
        }
        if (fin.isProfitCalculable && fin.grossProfitExclVat !== null) {
          approvedCalculableSale += fin.netSaleExclVat;
          approvedCalculableProfit += fin.grossProfitExclVat;
        }
      }
    });

    const weightedQuotedMargin =
      quotedCalculableSale > 0
        ? `%${((quotedCalculableProfit / quotedCalculableSale) * 100).toFixed(1)}`
        : 'Hesaplanamıyor';

    const weightedApprovedMargin =
      approvedCalculableSale > 0
        ? `%${((approvedCalculableProfit / approvedCalculableSale) * 100).toFixed(1)}`
        : 'Hesaplanamıyor';

    return {
      totalCount,
      pendingCount: pendingLeads.length,
      approvedCount: approvedLeads.length,
      quotedPricedCount,
      quotedSaleExclVat,
      quotedVatAmount,
      quotedCostExclVat,
      quotedCalculableProfit,
      quotedMissingCostCount,
      weightedQuotedMargin,
      approvedSaleExclVat,
      approvedVatAmount,
      approvedCostExclVat,
      approvedCalculableProfit,
      approvedMissingCostCount,
      weightedApprovedMargin
    };
  }, [filteredLeads]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const paginatedLeads = filteredLeads.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      {/* Filtre Çubuğu */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Başlangıç Tarihi
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Bitiş Tarihi
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Pipeline Aşaması
            </label>
            <select
              value={stageFilter}
              onChange={(e) => {
                setStageFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-none"
            >
              <option value="Tümü">Tüm Aşamalar (11 Aşama)</option>
              {PIPELINE_STAGES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Sonuç Durumu
            </label>
            <select
              value={outcomeFilter}
              onChange={(e) => {
                setOutcomeFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-none"
            >
              <option value="active">Aktif Süreçteki Kayıtlar</option>
              <option value="all">Tümü (Aktif + Kaybedilen/İptal/Arşiv)</option>
              {OUTCOME_STATUSES.filter((o) => o.id !== 'active').map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          {(dateFrom || dateTo || stageFilter !== 'Tümü' || outcomeFilter !== 'active') && (
            <button
              type="button"
              onClick={() => {
                setDateFrom('');
                setDateTo('');
                setStageFilter('Tümü');
                setOutcomeFilter('active');
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Filtreyi Sıfırla
            </button>
          )}
        </div>

        {rolePerms?.canWriteLeads && (
          <button
            type="button"
            onClick={onOpenNewLeadModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            Yeni Kurumsal Talep Ekle
          </button>
        )}
      </div>

      {/* Operasyonel & Finansal 7 Ana Kart */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Toplam Gelen Talep */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              1. Toplam Gelen Talep
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{metrics.totalCount}</div>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
            <strong>Kapsam:</strong> Seçili tarih ve durum filtresindeki gerçek Firestore talep kayıtları.
          </p>
        </div>

        {/* 2. Bekleyen Teklifler */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              2. Bekleyen Teklifler
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{metrics.pendingCount}</div>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
            <strong>Kapsam:</strong> Aktif süreçte olup &ldquo;Yeni Talep&rdquo; ile &ldquo;Revizyon&rdquo; arasındaki 8 aşamada bekleyen işler.
          </p>
        </div>

        {/* 3. Onaylanan Organizasyonlar */}
        <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              3. Onaylanan Organizasyonlar
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">{metrics.approvedCount}</div>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
            <strong>Kapsam:</strong> &ldquo;Onaylandı&rdquo;, &ldquo;Operasyon Hazırlığı&rdquo; ve &ldquo;Tamamlandı&rdquo; aşamasındaki kesinleşmiş işler.
          </p>
        </div>

        {/* 4. Toplam Teklif Hacmi (KDV Hariç) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              4. Toplam Teklif Hacmi (KDV Hariç)
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {formatCurrencyTL(metrics.quotedSaleExclVat)}
          </div>
          <div className="text-[11px] font-semibold text-slate-500 mt-1">
            + KDV: {formatCurrencyTL(metrics.quotedVatAmount)} | KDV Dahil:{' '}
            {formatCurrencyTL(metrics.quotedSaleExclVat + metrics.quotedVatAmount)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
            <strong>Kapsam:</strong> Fiyatlandırılmış ({metrics.quotedPricedCount} kayıt) tekliflerin yalnızca <strong>geçerli son versiyon</strong> toplamı (Gerçekleşmiş gelir değildir).
          </p>
        </div>
      </div>

      {/* Finansal Ayrım: Teklif Edilen vs Onaylanan (Kesinleşen) İşler & Maliyet/Brüt Kâr/Marj */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 5. Net Maliyet (KDV Hariç) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              5. Net Maliyet (KDV Hariç)
            </span>
            <Calculator className="w-4 h-4 text-slate-500" />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Tüm Teklifler Maliyeti</div>
              <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                {formatCurrencyTL(metrics.quotedCostExclVat)}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <div className="text-[10px] font-bold text-emerald-700 uppercase">Onaylanan İşler Maliyeti</div>
              <div className="text-lg font-extrabold text-emerald-800 mt-0.5">
                {formatCurrencyTL(metrics.approvedCostExclVat)}
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
            <strong>Kapsam:</strong> 7 standart + ek hizmet kalemlerinin KDV hariç tedarikçi alış maliyetleri toplamı.
          </p>
        </div>

        {/* 6. Brüt Kâr (TL - KDV Hariç) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              6. Brüt Kâr (Satış − Maliyet)
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Potansiyel (Teklif) Kârı</div>
              <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                {formatCurrencyTL(metrics.quotedCalculableProfit)}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <div className="text-[10px] font-bold text-emerald-700 uppercase">Onaylanan İşler Brüt Kârı</div>
              <div className="text-lg font-extrabold text-emerald-800 mt-0.5">
                {formatCurrencyTL(metrics.approvedCalculableProfit)}
              </div>
            </div>
          </div>
          {metrics.quotedMissingCostCount > 0 ? (
            <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-amber-700 font-semibold bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {metrics.quotedMissingCostCount} kayıtta maliyet kalemi eksik olduğu için yanıltıcı kâr üretilmemiştir.
            </div>
          ) : (
            <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
              <strong>Kural:</strong> Eksik maliyetli kalemler sıfır maliyet kabul edilmez; yalnızca maliyeti doğrulanmış kalemler dahil edilir.
            </p>
          )}
        </div>

        {/* 7. Ağırlıklı Ortalama Kâr Marjı (%) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              7. Ağırlıklı Ortalama Kâr Marjı (%)
            </span>
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Teklif Edilen Marj</div>
              <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                {metrics.weightedQuotedMargin}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <div className="text-[10px] font-bold text-emerald-700 uppercase">Onaylanan İşler Marjı</div>
              <div className="text-lg font-extrabold text-emerald-800 mt-0.5">
                {metrics.weightedApprovedMargin}
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
            <strong>Formül:</strong> Toplam Brüt Kâr / Toplam KDV Hariç Satış × 100. Satış 0 TL ise &ldquo;Hesaplanamıyor&rdquo; gösterilir.
          </p>
        </div>
      </div>

      {/* Onaylanan İşler Kesinleşen Ciro Özeti Bandı */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Onaylanan İşler Finansal Özeti (Teklif Hacminden Ayrı)
          </span>
          <h3 className="text-base font-bold mt-1">
            Kesinleşen Satış Tutarı (KDV Hariç): {formatCurrencyTL(metrics.approvedSaleExclVat)}
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Hesaplanan KDV: {formatCurrencyTL(metrics.approvedVatAmount)} • Genel Toplam (KDV Dahil):{' '}
            {formatCurrencyTL(metrics.approvedSaleExclVat + metrics.approvedVatAmount)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSwitchTab('pipeline')}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5"
          >
            CRM Pipeline&apos;a Git
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 8. Son Talepler Tablosu */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Son Kurumsal Talepler ({filteredLeads.length} Kayıt)
            </h2>
            <p className="text-xs text-slate-500">
              Web formlarından ve CRM üzerinden kaydedilen gerçek Firestore talepleri (Yalnızca son teklif versiyonu esas alınır).
            </p>
          </div>
        </div>

        {filteredLeads.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Kayıtlı Kurumsal Talep Bulunmuyor</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Seçili filtre kriterlerine uygun gerçek talep kaydı bulunamadı. Yeni bir kurumsal talep ekleyebilir veya web formlarından gelen talepleri bekleyebilirsiniz.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Kod & Versiyon</th>
                    <th className="py-3 px-4">Firma & Yetkili</th>
                    <th className="py-3 px-4">Organizasyon & İl</th>
                    <th className="py-3 px-4">Aşama & Sonuç</th>
                    <th className="py-3 px-4 text-right">Satış (KDV Hariç)</th>
                    <th className="py-3 px-4 text-right">Maliyet</th>
                    <th className="py-3 px-4 text-right">Brüt Kâr / Marj</th>
                    <th className="py-3 px-4 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {paginatedLeads.map((lead) => {
                    const fin = storageService.calculateLeadFinancials(lead);
                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          <div>{lead.id}</div>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-sans font-semibold">
                            {fin.revisionLabelUsed}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{lead.company}</div>
                          <div className="text-slate-500 text-[11px]">
                            {lead.contactName} • {lead.phone}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800">{lead.organizationType}</div>
                          <div className="text-slate-500 text-[11px] flex items-center gap-2 mt-0.5">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {lead.city}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Users className="w-3 h-3" /> {lead.attendees} Kişi
                            </span>
                            {lead.targetDate && (
                              <span className="inline-flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {lead.targetDate}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              APPROVED_STAGES.includes(lead.stage)
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {lead.stage}
                          </span>
                          {lead.outcomeStatus && lead.outcomeStatus !== 'active' && (
                            <div className="mt-1 text-[10px] font-bold text-rose-600 uppercase">
                              Sonuç: {OUTCOME_STATUSES.find((o) => o.id === lead.outcomeStatus)?.label || lead.outcomeStatus}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                          {fin.netSaleExclVat > 0 ? formatCurrencyTL(fin.netSaleExclVat) : 'Fiyatlandırılmadı'}
                          {fin.vatAmount > 0 && (
                            <div className="text-[10px] font-normal text-slate-500">
                              +KDV: {formatCurrencyTL(fin.vatAmount)}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right font-semibold text-slate-700">
                          {fin.totalCostExclVat > 0 ? formatCurrencyTL(fin.totalCostExclVat) : 'Girilmedi'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {fin.isProfitCalculable ? (
                            <>
                              <div className="font-bold text-emerald-700">
                                {formatCurrencyTL(fin.grossProfitExclVat)}
                              </div>
                              <div className="text-[11px] font-semibold text-slate-600">
                                {fin.marginDisplay}
                              </div>
                            </>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-semibold">
                              {fin.marginDisplay}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => onSelectLeadForDetail(lead)}
                              className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-[11px] inline-flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Detay
                            </button>
                            <button
                              type="button"
                              onClick={() => onSelectLeadForCostCalc(lead)}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] inline-flex items-center gap-1"
                            >
                              <Calculator className="w-3.5 h-3.5" />
                              Maliyet/Teklif
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span>
                  Sayfa {page} / {totalPages} (Toplam {filteredLeads.length} talep)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 disabled:opacity-40 font-semibold"
                  >
                    Önceki
                  </button>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 disabled:opacity-40 font-semibold"
                  >
                    Sonraki
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
