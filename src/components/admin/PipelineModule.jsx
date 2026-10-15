import React, { useMemo, useState } from 'react';
import {
  LayoutGrid,
  List,
  Search,
  Plus,
  MapPin,
  Users,
  Calendar,
  Phone,
  Mail,
  Building2,
  UserCheck,
  Clock,
  Calculator,
  Eye,
  Trash2,
  CheckCircle2,
  X,
  History,
  ExternalLink,
  Copy
} from 'lucide-react';
import {
  storageService,
  PIPELINE_STAGES,
  OUTCOME_STATUSES
} from '../../services/storageService';
import { ALL_81_CITIES } from '../../data/citiesData';
import { ORGANIZATIONS } from '../../data/organizationsData';
import { formatCurrencyTL } from './DashboardModule';

export default function PipelineModule({
  leads = [],
  venues = [],
  userProfile,
  rolePerms,
  onLeadsMutated,
  onSelectLeadForCostCalc,
  onNotify,
  onRequestConfirm,
  externalSelectedLead,
  onClearExternalSelectedLead,
  externalNewLeadOpen,
  onCloseExternalNewLead
}) {
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('Tümü');
  const [outcomeFilter, setOutcomeFilter] = useState('active');
  const [draggedLeadId, setDraggedLeadId] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);
  const [updatingLeadId, setUpdatingLeadId] = useState(null);

  const [selectedLead, setSelectedLead] = useState(null);
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [savingNewLead, setSavingNewLead] = useState(false);
  const [savingDetail, setSavingDetail] = useState(false);

  const activeLeadModal = externalSelectedLead || selectedLead;
  const isNewModalOpen = externalNewLeadOpen || showNewLeadModal;

  const [newLeadForm, setNewLeadForm] = useState({
    company: '',
    contactName: '',
    title: 'Kurumsal İletişim / Satınalma Yetkilisi',
    phone: '',
    email: '',
    organizationType: ORGANIZATIONS?.[0]?.title || 'Bayi Toplantısı Organizasyonu',
    city: 'İstanbul',
    district: '',
    targetDate: '',
    attendees: 100,
    budgetRange: 'Belirtilmedi',
    assignedTo: userProfile?.name || userProfile?.email || '',
    followUpDate: '',
    linkedVenueId: '',
    notes: ''
  });

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (outcomeFilter !== 'all' && (lead.outcomeStatus || 'active') !== outcomeFilter) {
        return false;
      }
      if (cityFilter !== 'Tümü' && lead.city !== cityFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          (lead.id || '').toLowerCase().includes(q) ||
          (lead.company || '').toLowerCase().includes(q) ||
          (lead.contactName || '').toLowerCase().includes(q) ||
          (lead.phone || '').toLowerCase().includes(q) ||
          (lead.organizationType || '').toLowerCase().includes(q) ||
          (lead.city || '').toLowerCase().includes(q) ||
          (lead.assignedTo || '').toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [leads, outcomeFilter, cityFilter, searchQuery]);

  // Sunucu kaydı ve hata durumunda geri alma (Rollback) destekli aşama güncelleme
  const handleStageTransition = async (lead, nextStage, nextOutcome = null, transitionNote = '') => {
    if (!rolePerms?.canWriteLeads) {
      onNotify('error', 'Yetki Sınırı: Görüntüleme rolü ile aşama değişikliği yapılamaz.');
      return;
    }
    const targetStage = nextStage || lead.stage;
    const targetOutcome = nextOutcome || lead.outcomeStatus || 'active';
    if (targetStage === lead.stage && targetOutcome === (lead.outcomeStatus || 'active')) {
      return;
    }

    setUpdatingLeadId(lead.id);
    try {
      const updated = await storageService.updateLead(
        lead.id,
        {
          stage: targetStage,
          outcomeStatus: targetOutcome,
          stageChangeNote: transitionNote
        },
        {
          actor: userProfile,
          expectedRecordVersion: lead.recordVersion
        }
      );
      if (activeLeadModal && activeLeadModal.id === lead.id) {
        setSelectedLead(updated);
      }
      if (onLeadsMutated) onLeadsMutated();
      onNotify(
        'success',
        `${lead.company} (${lead.id}) durumu "${targetStage}" olarak sunucuya kaydedildi.`
      );
    } catch (err) {
      // Hata durumunda arayüz otomatik olarak Firestore'daki mevcut gerçek durumda kalır (Rollback)
      if (onLeadsMutated) onLeadsMutated();
      onNotify(
        'error',
        `Aşama kaydı başarısız oldu, önceki duruma döndürüldü: ${err?.message || 'Sunucu hatası'}`
      );
    } finally {
      setUpdatingLeadId(null);
      setDraggedLeadId(null);
      setDragOverStage(null);
    }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    if (!rolePerms?.canWriteLeads) {
      onNotify('error', 'Yeni talep oluşturma yetkiniz bulunmuyor.');
      return;
    }
    setSavingNewLead(true);
    try {
      const matchedVenue = venues.find((v) => v.id === newLeadForm.linkedVenueId);
      const created = await storageService.addLead(
        {
          ...newLeadForm,
          attendees: Math.max(1, Number(newLeadForm.attendees) || 1),
          linkedVenueName: matchedVenue ? matchedVenue.name : ''
        },
        { bypassRateLimit: true, actor: userProfile }
      );
      setShowNewLeadModal(false);
      if (onCloseExternalNewLead) onCloseExternalNewLead();
      setNewLeadForm({
        company: '',
        contactName: '',
        title: 'Kurumsal İletişim / Satınalma Yetkilisi',
        phone: '',
        email: '',
        organizationType: ORGANIZATIONS?.[0]?.title || 'Bayi Toplantısı Organizasyonu',
        city: 'İstanbul',
        district: '',
        targetDate: '',
        attendees: 100,
        budgetRange: 'Belirtilmedi',
        assignedTo: userProfile?.name || userProfile?.email || '',
        followUpDate: '',
        linkedVenueId: '',
        notes: ''
      });
      if (onLeadsMutated) onLeadsMutated();
      onNotify('success', `${created.company} (${created.id}) talebi oluşturuldu.`);
    } catch (err) {
      onNotify('error', err?.message || 'Talep kaydedilemedi.');
    } finally {
      setSavingNewLead(false);
    }
  };

  const handleSaveLeadDetails = async (e) => {
    e.preventDefault();
    if (!activeLeadModal || !rolePerms?.canWriteLeads) return;
    setSavingDetail(true);
    try {
      const matchedVenue = venues.find((v) => v.id === activeLeadModal.linkedVenueId);
      const updated = await storageService.updateLead(
        activeLeadModal.id,
        {
          company: activeLeadModal.company,
          contactName: activeLeadModal.contactName,
          title: activeLeadModal.title,
          phone: activeLeadModal.phone,
          email: activeLeadModal.email,
          organizationType: activeLeadModal.organizationType,
          city: activeLeadModal.city,
          district: activeLeadModal.district,
          targetDate: activeLeadModal.targetDate,
          attendees: Math.max(1, Number(activeLeadModal.attendees) || 1),
          budgetRange: activeLeadModal.budgetRange,
          assignedTo: activeLeadModal.assignedTo,
          followUpDate: activeLeadModal.followUpDate,
          linkedVenueId: activeLeadModal.linkedVenueId || '',
          linkedVenueName: matchedVenue ? matchedVenue.name : activeLeadModal.linkedVenueName || '',
          notes: activeLeadModal.notes,
          stage: activeLeadModal.stage,
          outcomeStatus: activeLeadModal.outcomeStatus || 'active',
          outcomeReason: activeLeadModal.outcomeReason || ''
        },
        {
          actor: userProfile,
          expectedRecordVersion: activeLeadModal.recordVersion
        }
      );
      setSelectedLead(updated);
      if (onLeadsMutated) onLeadsMutated();
      onNotify('success', `${updated.id} talep detayları güncellendi.`);
    } catch (err) {
      onNotify('error', err?.message || 'Güncelleme başarısız oldu.');
    } finally {
      setSavingDetail(false);
    }
  };

  const handleDeleteLead = (lead) => {
    if (!rolePerms?.canDeleteLeads) {
      onNotify(
        'error',
        'Silme işlemi yalnızca Süperadmin yetkisiyle yapılabilir. Kaydı "Arşivlendi" veya "İptal Edildi" durumuna alabilirsiniz.'
      );
      return;
    }
    onRequestConfirm({
      title: 'Kurumsal Talebi Kalıcı Olarak Sil',
      message: `${lead.company} (${lead.id}) kaydını silmek istediğinize emin misiniz? Normal operasyonlarda silmek yerine sonuç durumunu "Arşivlendi" veya "Kaybedildi" olarak işaretlemeniz önerilir.`,
      confirmLabel: 'Kalıcı Olarak Sil',
      onConfirm: async () => {
        try {
          await storageService.deleteLead(lead.id, userProfile);
          if (activeLeadModal?.id === lead.id) {
            setSelectedLead(null);
            if (onClearExternalSelectedLead) onClearExternalSelectedLead();
          }
          if (onLeadsMutated) onLeadsMutated();
          onNotify('success', `${lead.id} kaydı silindi.`);
        } catch (err) {
          onNotify('error', err?.message || 'Silme hatası.');
        }
      }
    });
  };

  const closeDetailModal = () => {
    setSelectedLead(null);
    if (onClearExternalSelectedLead) onClearExternalSelectedLead();
  };

  const updateModalField = (field, value) => {
    const base = activeLeadModal || {};
    const next = { ...base, [field]: value };
    setSelectedLead(next);
  };

  return (
    <div className="space-y-5">
      {/* Üst Kontrol ve Filtre Barı */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kod, firma, yetkili, telefon veya sorumlu ara..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-slate-50"
          >
            <option value="Tümü">81 İl (Tümü)</option>
            {ALL_81_CITIES.map((c) => (
              <option key={c.slug} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-slate-50"
          >
            <option value="active">Aktif Süreçteki Talepler (11 Aşama)</option>
            <option value="all">Tüm Sonuçlar (Aktif + Kaybedilen/İptal/Arşiv)</option>
            {OUTCOME_STATUSES.filter((o) => o.id !== 'active').map((o) => (
              <option key={o.id} value={o.id}>
                Sonuç: {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl border border-slate-200 p-1 bg-slate-100">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              11 Aşama Kanban
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Tablo Görünümü
            </button>
          </div>

          {rolePerms?.canWriteLeads && (
            <button
              type="button"
              onClick={() => setShowNewLeadModal(true)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              Yeni Talep
            </button>
          )}
        </div>
      </div>

      {/* Görünüm 1: 11 Aşamalı Kanban */}
      {viewMode === 'kanban' ? (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {PIPELINE_STAGES.map((stage, idx) => {
              const stageLeads = filteredLeads.filter((l) => l.stage === stage);
              const isDropTarget = dragOverStage === stage;

              return (
                <div
                  key={stage}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (dragOverStage !== stage) setDragOverStage(stage);
                  }}
                  onDragLeave={() => {
                    if (dragOverStage === stage) setDragOverStage(null);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const leadId = e.dataTransfer.getData('text/plain') || draggedLeadId;
                    const found = leads.find((l) => l.id === leadId);
                    if (found && found.stage !== stage) {
                      handleStageTransition(found, stage);
                    }
                    setDragOverStage(null);
                    setDraggedLeadId(null);
                  }}
                  className={`w-72 shrink-0 rounded-2xl border p-3.5 flex flex-col max-h-[72vh] transition-colors ${
                    isDropTarget
                      ? 'bg-amber-50/70 border-amber-400'
                      : 'bg-slate-100/90 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-amber-400 text-[10px] font-extrabold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h3 className="text-xs font-extrabold text-slate-900">{stage}</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[11px] font-bold text-slate-700">
                      {stageLeads.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
                    {stageLeads.length === 0 ? (
                      <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center text-[11px] text-slate-400">
                        Bu aşamada kayıt yok
                      </div>
                    ) : (
                      stageLeads.map((lead) => {
                        const fin = storageService.calculateLeadFinancials(lead);
                        const isUpdating = updatingLeadId === lead.id;

                        return (
                          <div
                            key={lead.id}
                            draggable={Boolean(rolePerms?.canWriteLeads && !isUpdating)}
                            onDragStart={(e) => {
                              setDraggedLeadId(lead.id);
                              e.dataTransfer.setData('text/plain', lead.id);
                            }}
                            onDragEnd={() => {
                              setDraggedLeadId(null);
                              setDragOverStage(null);
                            }}
                            className={`bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${
                              isUpdating ? 'opacity-60 pointer-events-none' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <span className="font-mono text-[10px] font-bold text-slate-500">
                                {lead.id}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                                {fin.revisionLabelUsed}
                              </span>
                            </div>

                            <div className="font-bold text-xs text-slate-900 line-clamp-1">
                              {lead.company}
                            </div>
                            <div className="text-[11px] text-slate-600 mt-0.5">
                              {lead.contactName} • {lead.phone}
                            </div>

                            <div className="mt-2 pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-600">
                              <div className="font-semibold text-slate-800 line-clamp-1">
                                {lead.organizationType}
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-400" /> {lead.city}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <Users className="w-3 h-3 text-slate-400" /> {lead.attendees} Kişi
                                </span>
                              </div>
                              {lead.assignedTo && (
                                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                  <UserCheck className="w-3 h-3 text-emerald-600" />
                                  Sorumlu: {lead.assignedTo}
                                </div>
                              )}
                              {lead.followUpDate && (
                                <div className="text-[10px] text-amber-700 font-semibold flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Takip: {lead.followUpDate}
                                </div>
                              )}
                            </div>

                            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                              <div className="text-xs font-extrabold text-slate-900">
                                {fin.netSaleExclVat > 0
                                  ? formatCurrencyTL(fin.netSaleExclVat)
                                  : 'Fiyat Yok'}
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => setSelectedLead(lead)}
                                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700"
                                  title="Detay & Düzenle"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onSelectLeadForCostCalc(lead)}
                                  className="p-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950"
                                  title="Maliyetlendirme & PDF Teklif"
                                >
                                  <Calculator className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Görünüm 2: Tablo Görünümü */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {filteredLeads.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-500">
              Filtreye uygun kurumsal talep kaydı bulunamadı.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                    <th className="py-3 px-4">Kod</th>
                    <th className="py-3 px-4">Firma & İletişim</th>
                    <th className="py-3 px-4">Organizasyon / İl / Tarih</th>
                    <th className="py-3 px-4">Sorumlu & Takip</th>
                    <th className="py-3 px-4">11 Aşama Durumu</th>
                    <th className="py-3 px-4">Sonuç Alanı</th>
                    <th className="py-3 px-4 text-right">Satış (KDV Hariç)</th>
                    <th className="py-3 px-4 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredLeads.map((lead) => {
                    const fin = storageService.calculateLeadFinancials(lead);
                    return (
                      <tr key={lead.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {lead.id}
                          <div className="text-[10px] font-sans text-slate-500">
                            {fin.revisionLabelUsed}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{lead.company}</div>
                          <div className="text-slate-500 text-[11px]">
                            {lead.contactName} • {lead.phone}
                          </div>
                          {lead.email && (
                            <div className="text-slate-400 text-[10px]">{lead.email}</div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">{lead.organizationType}</div>
                          <div className="text-[11px] text-slate-500">
                            {lead.city} • {lead.attendees} Kişi • {lead.targetDate || 'Tarih Belirsiz'}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Bütçe: {lead.budgetRange || 'Belirtilmedi'}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-800">
                            {lead.assignedTo || 'Atanmadı'}
                          </div>
                          <div className="text-[11px] text-amber-700">
                            Takip: {lead.followUpDate || '-'}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            disabled={!rolePerms?.canWriteLeads || updatingLeadId === lead.id}
                            value={lead.stage}
                            onChange={(e) => handleStageTransition(lead, e.target.value)}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white text-slate-900"
                          >
                            {PIPELINE_STAGES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            disabled={!rolePerms?.canWriteLeads || updatingLeadId === lead.id}
                            value={lead.outcomeStatus || 'active'}
                            onChange={(e) =>
                              handleStageTransition(lead, lead.stage, e.target.value)
                            }
                            className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white text-slate-800"
                          >
                            {OUTCOME_STATUSES.map((o) => (
                              <option key={o.id} value={o.id}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-slate-900">
                          {fin.netSaleExclVat > 0 ? formatCurrencyTL(fin.netSaleExclVat) : '-'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedLead(lead)}
                              className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 font-semibold"
                            >
                              Detay
                            </button>
                            <button
                              type="button"
                              onClick={() => onSelectLeadForCostCalc(lead)}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
                            >
                              Maliyet
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Talep Detay, Düzenleme ve Aşama Geçmişi Modalı */}
      {activeLeadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded bg-slate-900 text-amber-400">
                    {activeLeadModal.id}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                    {activeLeadModal.currentRevisionLabel || 'Taslak'}
                  </span>
                </div>
                <h2 className="text-base font-extrabold text-slate-900 mt-1">
                  {activeLeadModal.company} — Kurumsal Talep Kartı
                </h2>
              </div>
              <button
                type="button"
                onClick={closeDetailModal}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLeadDetails} className="p-6 space-y-6">
              {/* Müşteri Güvenli Teklif Takip Bağlantısı */}
              {activeLeadModal.accessToken && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-bold text-slate-700 uppercase">
                      Müşteri Güvenli Teklif Takip Bağlantısı (Token Korumalı)
                    </div>
                    <div className="text-xs font-mono text-slate-600 mt-0.5 break-all">
                      {`${window.location.origin}/teklif-takip?kod=${activeLeadModal.id}&token=${activeLeadModal.accessToken}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const url = `${window.location.origin}/teklif-takip?kod=${activeLeadModal.id}&token=${activeLeadModal.accessToken}`;
                        navigator.clipboard?.writeText(url);
                        onNotify('success', 'Güvenli müşteri takip bağlantısı panoya kopyalandı.');
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-bold inline-flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Bağlantıyı Kopyala
                    </button>
                    <a
                      href={`/teklif-takip?kod=${activeLeadModal.id}&token=${activeLeadModal.accessToken}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold inline-flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Önizle
                    </a>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Firma Adı *</label>
                  <input
                    type="text"
                    required
                    value={activeLeadModal.company || ''}
                    onChange={(e) => updateModalField('company', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Yetkili Kişi *</label>
                  <input
                    type="text"
                    required
                    value={activeLeadModal.contactName || ''}
                    onChange={(e) => updateModalField('contactName', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unvan</label>
                  <input
                    type="text"
                    value={activeLeadModal.title || ''}
                    onChange={(e) => updateModalField('title', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Telefon *</label>
                  <input
                    type="text"
                    required
                    value={activeLeadModal.phone || ''}
                    onChange={(e) => updateModalField('phone', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">E-Posta</label>
                  <input
                    type="email"
                    value={activeLeadModal.email || ''}
                    onChange={(e) => updateModalField('email', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Organizasyon Türü</label>
                  <input
                    type="text"
                    value={activeLeadModal.organizationType || ''}
                    onChange={(e) => updateModalField('organizationType', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Şehir (81 İl)</label>
                  <select
                    value={activeLeadModal.city || 'İstanbul'}
                    onChange={(e) => updateModalField('city', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  >
                    {ALL_81_CITIES.map((c) => (
                      <option key={c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Etkinlik Tarihi</label>
                  <input
                    type="date"
                    value={activeLeadModal.targetDate || ''}
                    onChange={(e) => updateModalField('targetDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Katılımcı Sayısı</label>
                  <input
                    type="number"
                    min="1"
                    value={activeLeadModal.attendees || 1}
                    onChange={(e) => updateModalField('attendees', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Müşteri Bütçe Aralığı</label>
                  <input
                    type="text"
                    value={activeLeadModal.budgetRange || ''}
                    onChange={(e) => updateModalField('budgetRange', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sorumlu Personel</label>
                  <input
                    type="text"
                    value={activeLeadModal.assignedTo || ''}
                    onChange={(e) => updateModalField('assignedTo', e.target.value)}
                    placeholder="Örn: Satış Direktörü"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Takip Tarihi</label>
                  <input
                    type="date"
                    value={activeLeadModal.followUpDate || ''}
                    onChange={(e) => updateModalField('followUpDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ana 11 CRM Aşaması
                  </label>
                  <select
                    value={activeLeadModal.stage || 'Yeni Talep'}
                    onChange={(e) => updateModalField('stage', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  >
                    {PIPELINE_STAGES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bağımsız Sonuç Alanı
                  </label>
                  <select
                    value={activeLeadModal.outcomeStatus || 'active'}
                    onChange={(e) => updateModalField('outcomeStatus', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  >
                    {OUTCOME_STATUSES.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bağlı Mekân / Kongre Merkezi
                  </label>
                  <select
                    value={activeLeadModal.linkedVenueId || ''}
                    onChange={(e) => updateModalField('linkedVenueId', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  >
                    <option value="">Mekân Seçilmedi</option>
                    {venues.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.city})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Operasyonel & Yönetici Notları (Müşteri PDF&apos;inde Gizlenir)
                </label>
                <textarea
                  rows={3}
                  value={activeLeadModal.notes || ''}
                  onChange={(e) => updateModalField('notes', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              {/* Aşama Geçmişi (Audit / Stage History) */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 mb-3">
                  <History className="w-4 h-4 text-slate-600" />
                  Aşama ve Durum Değişiklik Geçmişi ({(activeLeadModal.stageHistory || []).length})
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto text-[11px]">
                  {(activeLeadModal.stageHistory || []).map((h, i) => (
                    <div
                      key={i}
                      className="bg-white p-2.5 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-2"
                    >
                      <div>
                        <span className="font-bold text-slate-800">
                          {h.fromStage ? `${h.fromStage} → ${h.toStage}` : h.toStage}
                        </span>
                        {h.fromOutcome !== h.toOutcome && (
                          <span className="ml-2 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                            Sonuç: {h.toOutcome}
                          </span>
                        )}
                        {h.note && <span className="text-slate-500 ml-2">({h.note})</span>}
                      </div>
                      <div className="text-slate-500">
                        {h.changedByEmail || h.changedByName} •{' '}
                        {h.timestamp ? new Date(h.timestamp).toLocaleString('tr-TR') : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  {rolePerms?.canDeleteLeads && (
                    <button
                      type="button"
                      onClick={() => handleDeleteLead(activeLeadModal)}
                      className="px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold inline-flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Kaydı Sil
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const target = activeLeadModal;
                      closeDetailModal();
                      onSelectLeadForCostCalc(target);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    Maliyetlendirme & PDF Teklife Geç
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={closeDetailModal}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
                  >
                    Kapat
                  </button>
                  {rolePerms?.canWriteLeads && (
                    <button
                      type="submit"
                      disabled={savingDetail}
                      className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold disabled:opacity-50"
                    >
                      {savingDetail ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Yeni Kurumsal Talep Ekleme Modalı */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Yeni Kurumsal Talep Oluştur
                </h3>
                <p className="text-xs text-slate-500">
                  Kayıt doğrudan gerçek Firestore veritabanına eklenir (Sahte başlangıç fiyatı atanmaz).
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowNewLeadModal(false);
                  if (onCloseExternalNewLead) onCloseExternalNewLead();
                }}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Firma Adı *</label>
                  <input
                    type="text"
                    required
                    value={newLeadForm.company}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, company: e.target.value })}
                    placeholder="Örn: Anadolu Kurumsal Holding A.Ş."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Yetkili Kişi *</label>
                  <input
                    type="text"
                    required
                    value={newLeadForm.contactName}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, contactName: e.target.value })}
                    placeholder="Ad Soyad"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Telefon *</label>
                  <input
                    type="text"
                    required
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    placeholder="0532 ..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kurumsal E-Posta</label>
                  <input
                    type="email"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    placeholder="yetkili@firma.com.tr"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Organizasyon Türü</label>
                  <input
                    type="text"
                    value={newLeadForm.organizationType}
                    onChange={(e) =>
                      setNewLeadForm({ ...newLeadForm, organizationType: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">İl (81 İl)</label>
                  <select
                    value={newLeadForm.city}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  >
                    {ALL_81_CITIES.map((c) => (
                      <option key={c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hedef Tarih</label>
                  <input
                    type="date"
                    value={newLeadForm.targetDate}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, targetDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Katılımcı Sayısı</label>
                  <input
                    type="number"
                    min="1"
                    value={newLeadForm.attendees}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, attendees: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bütçe Aralığı</label>
                  <input
                    type="text"
                    value={newLeadForm.budgetRange}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, budgetRange: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sorumlu Personel</label>
                  <input
                    type="text"
                    value={newLeadForm.assignedTo}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Takip Tarihi</label>
                  <input
                    type="date"
                    value={newLeadForm.followUpDate}
                    onChange={(e) =>
                      setNewLeadForm({ ...newLeadForm, followUpDate: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mekân Bağlantısı</label>
                  <select
                    value={newLeadForm.linkedVenueId}
                    onChange={(e) =>
                      setNewLeadForm({ ...newLeadForm, linkedVenueId: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  >
                    <option value="">Henüz Seçilmedi</option>
                    {venues.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.city})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notlar</label>
                <textarea
                  rows={2}
                  value={newLeadForm.notes}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewLeadModal(false);
                    if (onCloseExternalNewLead) onCloseExternalNewLead();
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={savingNewLead}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold disabled:opacity-50"
                >
                  {savingNewLead ? 'Kaydediliyor...' : 'Talebi Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
