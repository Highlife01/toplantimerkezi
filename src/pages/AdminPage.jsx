import React, { useState, useEffect } from 'react';
import { storageService, PIPELINE_STAGES } from '../services/storageService';
import { generateProposalPdf } from '../services/pdfService';
import { notificationService } from '../services/notificationService';
import {
  Building2, Users, DollarSign, TrendingUp, Calendar,
  MapPin, Phone, Mail, FileText, CheckCircle2, Clock,
  Search, Plus, Edit2, Trash2, Shield, Lock, Download,
  Settings, Layers, Tv, Volume2, Utensils, Star, ArrowRight,
  Filter, ChevronRight, X, AlertCircle, Sparkles, RefreshCw,
  Globe, Link as LinkIcon, Compass, Activity, Bell, Send, Database, MessageSquare
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | pipeline | costCalc | suppliers | venues | seoManager | redirects | notifications | settings

  // Data state
  const [leads, setLeads] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [venues, setVenues] = useState([]);
  const [seoPages, setSeoPages] = useState([]);
  const [redirects, setRedirects] = useState([]);
  const [settings, setSettings] = useState(storageService.getSettings());
  const [isCloudConnected, setIsCloudConnected] = useState(storageService.isCloudConnected());
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSendingTestNotif, setIsSendingTestNotif] = useState(false);
  const [testNotifResult, setTestNotifResult] = useState(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(0);
  const [loginError, setLoginError] = useState('');

  // Modals & Selection
  const [selectedLead, setSelectedLead] = useState(null);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [newRedirect, setNewRedirect] = useState({ oldUrl: '', newUrl: '', type: 301 });
  const [pipelineSearch, setPipelineSearch] = useState('');
  const [pipelineStageFilter, setPipelineStageFilter] = useState('Tümü');

  useEffect(() => {
    const auth = sessionStorage.getItem('tm_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    loadData();

    // Gerçek Zamanlı Firestore Dinleyicisi
    const unsubscribeLeads = storageService.subscribeToLeads((cloudLeads) => {
      setLeads(cloudLeads);
    });

    const handleStorageUpdate = () => loadData();
    window.addEventListener('tm_storage_updated', handleStorageUpdate);
    return () => {
      unsubscribeLeads();
      window.removeEventListener('tm_storage_updated', handleStorageUpdate);
    };
  }, []);

  const loadData = () => {
    setLeads(storageService.getLeads());
    setSuppliers(storageService.getSuppliers());
    setVenues(storageService.getVenues());
    setSeoPages(storageService.getSeoPages());
    setRedirects(storageService.getRedirects());
    setSettings(storageService.getSettings());
    setIsCloudConnected(storageService.isCloudConnected());
  };

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    if (Date.now() < lockoutUntil) {
      const remainingSeconds = Math.ceil((lockoutUntil - Date.now()) / 1000);
      setLoginError(`Güvenlik nedeniyle giriş kilitli. Lütfen ${remainingSeconds} saniye bekleyin.`);
      return;
    }

    const currentPin = settings?.adminPin || '1234';
    if (pinInput && pinInput === currentPin) {
      setIsAuthenticated(true);
      sessionStorage.setItem('tm_admin_auth', 'true');
      setFailedAttempts(0);
      setLoginError('');
      setPinInput('');
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= 5) {
        setLockoutUntil(Date.now() + 60000);
        setLoginError('5 kez hatalı PIN girildi. Sistem 60 saniye süreyle kilitlendi.');
      } else {
        setLoginError(`Hatalı Yönetici PIN Kodu! (Kalan deneme hakkı: ${5 - newAttempts})`);
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('tm_admin_auth');
  };

  const handleStageChange = async (leadId, newStage) => {
    await storageService.updateLead(leadId, { stage: newStage });
    loadData();
  };

  const handleUpdateFinancials = async (leadId, costBreakdown, quotedPrice, vatRate) => {
    await storageService.updateLead(leadId, {
      costBreakdown,
      quotedPrice: Number(quotedPrice) || 0,
      vatRate: Number(vatRate) || 20
    });
    loadData();
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => ({
        ...prev,
        costBreakdown,
        quotedPrice: Number(quotedPrice) || 0,
        vatRate: Number(vatRate) || 20
      }));
    }
  };

  const handleSeedFirestore = async () => {
    if (!window.confirm('Mevcut tüm demo teklifleri, tedarikçileri ve ayarları Firebase Firestore bulut veritabanına aktarmak istiyor musunuz?')) return;
    setIsSeeding(true);
    try {
      const res = await storageService.seedFirestoreData();
      alert(`Buluta başarıyla aktarıldı: ${res.insertedLeads} Teklif Talebi, ${res.insertedSuppliers} Tedarikçi.`);
      loadData();
    } catch (err) {
      alert(`Bulut aktarım hatası: ${err.message}`);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleSendTestNotification = async () => {
    setIsSendingTestNotif(true);
    setTestNotifResult(null);
    try {
      const res = await notificationService.sendTestNotification(settings);
      setTestNotifResult(res);
    } catch (err) {
      setTestNotifResult({ error: err.message });
    } finally {
      setIsSendingTestNotif(false);
    }
  };

  const totalLeadsCount = leads.length;
  const newLeadsCount = leads.filter(l => l.stage === 'Yeni Talep').length;
  const pendingQuoteCount = leads.filter(l => l.stage === 'Maliyetlendirme' || l.stage === 'Teklif Hazırlanıyor').length;
  const quotedCount = leads.filter(l => l.stage === 'Teklif Gönderildi' || l.stage === 'Revizyon').length;
  const approvedCount = leads.filter(l => l.stage === 'Onaylandı' || l.stage === 'Operasyon Hazırlığı' || l.stage === 'Organizasyon Gerçekleşti' || l.stage === 'Tamamlandı').length;

  let totalPipelineVolume = 0;
  let totalCostVolume = 0;
  leads.forEach(l => {
    const fin = storageService.calculateLeadFinancials(l);
    totalPipelineVolume += fin.quotedPrice;
    totalCostVolume += fin.totalCost;
  });

  const totalGrossProfit = totalPipelineVolume - totalCostVolume;
  const overallMargin = totalPipelineVolume > 0 ? ((totalGrossProfit / totalPipelineVolume) * 100).toFixed(1) : 0;

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center px-4 subtle-grid-bg bg-slate-50">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-slate-300 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl gold-gradient-bg flex items-center justify-center mx-auto text-slate-950 shadow-md">
            <Lock size={30} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-950 font-display">
              Toplantı Merkezi CRM Giriş
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Kurumsal Yönetim, SEO & Operasyon Masası
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 text-center animate-shake">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-left text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Yönetici PIN Kodu
              </label>
              <input
                type="password"
                maxLength="8"
                placeholder="••••••"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                disabled={Date.now() < lockoutUntil}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-center text-xl tracking-widest text-slate-950 focus:outline-none focus:border-amber-600 font-mono font-bold disabled:opacity-50 disabled:bg-slate-100"
              />
            </div>

            <button
              type="submit"
              disabled={Date.now() < lockoutUntil}
              className="w-full py-3.5 rounded-xl gold-gradient-bg text-slate-950 font-extrabold text-sm shadow-md hover:scale-102 transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              Güvenli Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 text-slate-900">

      {/* Admin Topbar */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-16 z-30 px-4 sm:px-6 lg:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gold-gradient-bg flex items-center justify-center text-slate-950 font-bold shadow-md">
              <Building2 size={18} />
            </div>
            <div>
              <span className="font-bold text-white text-sm font-display block leading-none">
                Yönetim & CRM Masası
              </span>
              <span className={`text-[10px] font-semibold flex items-center gap-1 mt-0.5 ${isCloudConnected ? 'text-emerald-400' : 'text-amber-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isCloudConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                {isCloudConnected ? 'Firebase Firestore Canlı Senkronizasyon (81 İl)' : 'Çevrimdışı / Hibrit Önbellek Modu'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold overflow-x-auto max-w-full">
            {[
              { id: 'dashboard', label: 'Dashboard & Analitik', icon: TrendingUp },
              { id: 'pipeline', label: 'CRM Pipeline (11 Aşama)', icon: Layers },
              { id: 'costCalc', label: 'Maliyet & Teklif', icon: DollarSign },
              { id: 'seoManager', label: 'Programmatic SEO', icon: Globe },
              { id: 'redirects', label: '301 Yönlendirmeler', icon: LinkIcon },
              { id: 'suppliers', label: 'Tedarikçi Ağı', icon: Users },
              { id: 'venues', label: 'Mekânlar (CMS)', icon: Building2 },
              { id: 'notifications', label: 'Bildirimler & Entegrasyon', icon: Bell },
              { id: 'settings', label: 'Site Ayarları', icon: Settings }
            ].map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${active
                      ? 'gold-gradient-bg text-slate-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-900/60 hover:text-red-200 text-slate-300 text-xs font-semibold transition"
            >
              Çıkış
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-300">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-600 font-bold">Toplam Talep / Lead</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center">
                    <FileText size={16} />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-950 font-display">
                  {totalLeadsCount} <span className="text-xs font-normal text-emerald-700 ml-1">(+{newLeadsCount} Yeni)</span>
                </div>
                <div className="text-[11px] text-slate-600 mt-2">
                  Bekleyen Teklif: <strong className="text-amber-800 font-bold">{pendingQuoteCount}</strong>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-600 font-bold">Toplam Teklif Hacmi</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
                    <DollarSign size={16} />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-800 font-display truncate">
                  {totalPipelineVolume.toLocaleString('tr-TR')} TL
                </div>
                <div className="text-[11px] text-slate-600 mt-2">
                  Teklif Verilen: <strong className="text-slate-950 font-bold">{quotedCount} Proje</strong>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-600 font-bold">Tahmini Brüt Kâr</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                    <TrendingUp size={16} />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-display truncate">
                  {totalGrossProfit.toLocaleString('tr-TR')} TL
                </div>
                <div className="text-[11px] text-slate-600 mt-2">
                  Ortalama Kâr Marjı: <strong className="text-emerald-800 font-bold">%{overallMargin}</strong>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-600 font-bold">Onaylanan & Yaklaşan</span>
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-800 flex items-center justify-center">
                    <CheckCircle2 size={16} />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-950 font-display">
                  {approvedCount} <span className="text-xs font-normal text-slate-600">Organizasyon</span>
                </div>
                <div className="text-[11px] text-slate-600 mt-2">
                  Operasyon Hazırlığında: <strong className="text-amber-800 font-bold">Aktif</strong>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-300 shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950 font-display">Son Gelen Teklif Talepleri</h3>
                    <p className="text-xs text-slate-600">Web sitesinden anında CRM'e düşen müşteri başvuruları</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('pipeline')}
                    className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1"
                  >
                    <span>Pipeline Görünümü</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-600 uppercase tracking-wider">
                        <th className="pb-3 font-bold">Talep No</th>
                        <th className="pb-3 font-bold">Firma / Yetkili</th>
                        <th className="pb-3 font-bold">Organizasyon</th>
                        <th className="pb-3 font-bold">Şehir</th>
                        <th className="pb-3 font-bold">Katılımcı</th>
                        <th className="pb-3 font-bold">Aşama</th>
                        <th className="pb-3 font-bold text-right">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {leads.slice(0, 6).map(lead => (
                        <tr key={lead.id} className="hover:bg-slate-50 transition">
                          <td className="py-3.5 font-mono text-amber-800 font-bold">{lead.id}</td>
                          <td className="py-3.5">
                            <div className="font-bold text-slate-950">{lead.company}</div>
                            <div className="text-[11px] text-slate-600">{lead.contactName} ({lead.phone})</div>
                          </td>
                          <td className="py-3.5 font-semibold text-slate-900">{lead.organizationType}</td>
                          <td className="py-3.5 text-slate-700">{lead.city}</td>
                          <td className="py-3.5 text-slate-950 font-bold">{lead.attendees} Kişi</td>
                          <td className="py-3.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${lead.stage === 'Yeni Talep' ? 'bg-red-50 text-red-800 border border-red-200' :
                                lead.stage === 'Teklif Gönderildi' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                                  lead.stage === 'Onaylandı' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                                    'bg-amber-50 text-amber-900 border border-amber-200'
                              }`}>
                              {lead.stage}
                            </span>
                          </td>
                          <td className="py-3.5 text-right space-x-1.5">
                            <button
                              onClick={() => { setSelectedLead(lead); setActiveTab('costCalc'); }}
                              className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-[11px] border border-amber-300"
                            >
                              Maliyet / Teklif
                            </button>
                            <button
                              onClick={() => generateProposalPdf(lead)}
                              title="PDF Teklif İndir"
                              className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                            >
                              <Download size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-300 shadow-md space-y-4">
                  <h4 className="text-sm font-bold text-slate-950 font-display">Aşamalara Göre Dağılım</h4>
                  <div className="space-y-2">
                    {PIPELINE_STAGES.slice(0, 7).map(stg => {
                      const count = leads.filter(l => l.stage === stg).length;
                      return (
                        <div key={stg} className="flex items-center justify-between text-xs">
                          <span className="text-slate-700 font-semibold">{stg}</span>
                          <span className="font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-950 border border-slate-200">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 p-6 rounded-3xl border border-amber-300 shadow-sm space-y-3">
                  <h4 className="text-sm font-bold text-amber-950 font-display flex items-center gap-1.5">
                    <Sparkles size={16} className="text-amber-800" />
                    <span>Hızlı Operasyon & PDF</span>
                  </h4>
                  <p className="text-xs text-amber-950 leading-relaxed font-medium">
                    Müşteri taleplerinin maliyetlerini girerek tek tıkla kurumsal PDF teklif belgesi üretebilir, WhatsApp veya e-posta üzerinden doğrudan paylaşabilirsiniz.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: PIPELINE */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6 animate-in fade-in duration-300">

            <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="text"
                  placeholder="Firma, yetkili veya şehir ara..."
                  value={pipelineSearch}
                  onChange={(e) => setPipelineSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-600 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
                <span className="text-xs text-slate-600 font-bold">Aşama Filtresi:</span>
                <select
                  value={pipelineStageFilter}
                  onChange={(e) => setPipelineStageFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-amber-600 font-bold"
                >
                  <option value="Tümü">Tüm Aşamalar (11 Aşama)</option>
                  {PIPELINE_STAGES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto pb-6">
              <div className="flex gap-4 min-w-[1600px]">
                {PIPELINE_STAGES.map(stageName => {
                  const stageLeads = leads.filter(l => {
                    const matchStage = l.stage === stageName;
                    const matchSearch = pipelineSearch === '' ||
                      l.company.toLowerCase().includes(pipelineSearch.toLowerCase()) ||
                      l.contactName.toLowerCase().includes(pipelineSearch.toLowerCase()) ||
                      l.city.toLowerCase().includes(pipelineSearch.toLowerCase());
                    return matchStage && matchSearch;
                  });

                  return (
                    <div
                      key={stageName}
                      className="w-80 flex-shrink-0 bg-slate-100/90 border border-slate-300 rounded-2xl p-4 flex flex-col max-h-[75vh]"
                    >
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                        <span className="font-bold text-xs text-slate-950 font-display truncate">
                          {stageName}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white text-amber-800 font-bold text-[11px] border border-slate-300 shadow-xs">
                          {stageLeads.length}
                        </span>
                      </div>

                      <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                        {stageLeads.map(lead => {
                          const fin = storageService.calculateLeadFinancials(lead);
                          return (
                            <div
                              key={lead.id}
                              className="bg-white p-4 rounded-xl border border-slate-300 hover:border-amber-500 shadow-sm transition cursor-pointer space-y-2.5"
                              onClick={() => setSelectedLead(lead)}
                            >
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-mono text-amber-800 font-bold">{lead.id}</span>
                                <span className="text-slate-600 font-semibold">{lead.city}</span>
                              </div>

                              <div className="font-bold text-sm text-slate-950 leading-tight">
                                {lead.company}
                              </div>

                              <div className="text-xs text-slate-700">
                                {lead.organizationType} • <strong className="text-slate-950">{lead.attendees} Kişi</strong>
                              </div>

                              {fin.quotedPrice > 0 && (
                                <div className="text-xs font-bold text-amber-800 pt-1 border-t border-slate-100 flex justify-between">
                                  <span>Teklif:</span>
                                  <span>{fin.quotedPrice.toLocaleString('tr-TR')} TL</span>
                                </div>
                              )}

                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between" onClick={e => e.stopPropagation()}>
                                <select
                                  value={lead.stage}
                                  onChange={(e) => handleStageChange(lead.id, e.target.value)}
                                  className="bg-slate-50 border border-slate-300 text-[10px] rounded px-1.5 py-1 text-slate-900 focus:outline-none focus:border-amber-600 font-medium"
                                >
                                  {PIPELINE_STAGES.map(st => (
                                    <option key={st} value={st}>{st}</option>
                                  ))}
                                </select>

                                <button
                                  onClick={() => generateProposalPdf(lead)}
                                  title="PDF Teklif"
                                  className="p-1 text-slate-600 hover:text-amber-800"
                                >
                                  <Download size={13} />
                                </button>
                              </div>
                            </div>
                          );
                        })}

                        {stageLeads.length === 0 && (
                          <div className="text-center py-8 text-xs text-slate-500">
                            Bu aşamada talep yok
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: COST & PROPOSAL CALCULATOR */}
        {activeTab === 'costCalc' && (
          <div className="space-y-8 animate-in fade-in duration-300">

            <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-950 font-display">Organizasyon Maliyet & Kâr Hesaplama Modülü</h3>
                <p className="text-xs text-slate-600">Kalem kalem tedarik maliyetlerini girin, müşteri teklifini ve brüt kâr marjını otomatik hesaplayın.</p>
              </div>

              <div className="w-full sm:w-80">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Hesaplanacak Talebi Seçin:</label>
                <select
                  value={selectedLead ? selectedLead.id : ''}
                  onChange={(e) => {
                    const found = leads.find(l => l.id === e.target.value);
                    if (found) setSelectedLead(found);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-600 font-bold"
                >
                  {leads.map(l => (
                    <option key={l.id} value={l.id}>{l.id} - {l.company} ({l.organizationType})</option>
                  ))}
                </select>
              </div>
            </div>

            {selectedLead ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-300 shadow-md space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                    <div>
                      <h4 className="text-xl font-bold text-slate-950 font-display">{selectedLead.company}</h4>
                      <p className="text-xs text-slate-600">
                        {selectedLead.organizationType} • {selectedLead.city} • {selectedLead.attendees} Kişi
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded-full text-xs font-bold font-mono">
                      {selectedLead.id}
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Maliyet Kalemleri Girişi (TL):
                    </h5>

                    {[
                      { key: 'venue', label: '01. Mekân & Salon Kiralama', icon: Building2 },
                      { key: 'catering', label: '02. Catering & İkram Hizmetleri', icon: Utensils },
                      { key: 'stage', label: '03. Sahne, Podyum & Dekor', icon: Layers },
                      { key: 'led', label: '04. LED Ekran & Görüntü Rejisi', icon: Tv },
                      { key: 'soundLight', label: '05. Profesyonel Ses & Işık', icon: Volume2 },
                      { key: 'staff', label: '06. Host/Hostes, Güvenlik & Personel', icon: Users },
                      { key: 'other', label: '07. Lojistik, Prodüksiyon & Diğer', icon: Sparkles }
                    ].map(item => {
                      const val = selectedLead.costBreakdown?.[item.key] || 0;
                      return (
                        <div key={item.key} className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-300">
                          <div className="flex items-center gap-2.5 text-xs font-bold text-slate-900">
                            <item.icon size={16} className="text-amber-700 shrink-0" />
                            <span>{item.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              value={val}
                              onChange={(e) => {
                                const newCb = { ...(selectedLead.costBreakdown || {}), [item.key]: Number(e.target.value) || 0 };
                                handleUpdateFinancials(selectedLead.id, newCb, selectedLead.quotedPrice, selectedLead.vatRate);
                              }}
                              className="w-36 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-right text-xs text-slate-950 focus:outline-none focus:border-amber-600 font-mono font-bold"
                            />
                            <span className="text-xs text-slate-600 font-bold">TL</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-slate-200 space-y-4">
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-400 flex items-center justify-between gap-4">
                      <div>
                        <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider">
                          Müşteriye Verilecek Fiyat Teklifi (TL)
                        </label>
                        <span className="text-[11px] text-amber-800 font-medium">Hizmet bedeli toplamı</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={selectedLead.quotedPrice || 0}
                          onChange={(e) => {
                            handleUpdateFinancials(selectedLead.id, selectedLead.costBreakdown, e.target.value, selectedLead.vatRate);
                          }}
                          className="w-48 bg-white border border-amber-600 rounded-xl px-4 py-2 text-right text-base text-slate-950 font-extrabold focus:outline-none font-mono"
                        />
                        <span className="text-sm font-bold text-amber-950">TL</span>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="lg:col-span-5 space-y-6">
                  {(() => {
                    const fin = storageService.calculateLeadFinancials(selectedLead);
                    return (
                      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-300 shadow-md space-y-6">
                        <h4 className="text-lg font-bold text-slate-950 font-display flex items-center gap-2">
                          <DollarSign size={20} className="text-amber-700" />
                          <span>Otomatik Kârlılık Hesabı</span>
                        </h4>

                        <div className="space-y-3 text-xs sm:text-sm">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                            <span className="text-slate-600 font-medium">Toplam Tedarik Maliyeti:</span>
                            <span className="font-mono font-bold text-red-700">{fin.totalCost.toLocaleString('tr-TR')} TL</span>
                          </div>

                          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                            <span className="text-slate-600 font-medium">Müşteri Teklif Tutarı:</span>
                            <span className="font-mono font-bold text-slate-950">{fin.quotedPrice.toLocaleString('tr-TR')} TL</span>
                          </div>

                          <div className="flex items-center justify-between pb-2 border-b border-slate-200 bg-emerald-50 p-2.5 rounded-xl border border-emerald-300">
                            <span className="text-emerald-950 font-bold">Brüt Kâr:</span>
                            <span className="font-mono font-extrabold text-emerald-800 text-base">{fin.grossProfit.toLocaleString('tr-TR')} TL</span>
                          </div>

                          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                            <span className="text-slate-600 font-medium">Kâr Marjı (%):</span>
                            <span className="font-mono font-bold text-amber-800">%{fin.marginPercent}</span>
                          </div>

                          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                            <span className="text-slate-600 font-medium">KDV Tutarı (%{selectedLead.vatRate || 20}):</span>
                            <span className="font-mono text-slate-700 font-bold">{fin.vatAmount.toLocaleString('tr-TR')} TL</span>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <span className="text-sm font-bold text-slate-950">Genel Toplam (KDV Dahil):</span>
                            <span className="font-mono font-extrabold text-amber-800 text-lg">{fin.grandTotal.toLocaleString('tr-TR')} TL</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-200 space-y-3">
                          <button
                            onClick={() => generateProposalPdf(selectedLead)}
                            className="w-full py-3.5 rounded-xl gold-gradient-bg text-slate-950 font-extrabold text-sm shadow-md hover:scale-102 transition flex items-center justify-center gap-2"
                          >
                            <Download size={18} />
                            <span>Resmi PDF Teklifi Oluştur & İndir</span>
                          </button>

                          <a
                            href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Sayın ${selectedLead.contactName}, ${selectedLead.company} adına talep ettiğiniz ${selectedLead.organizationType} organizasyonu fiyat teklifimiz hazırlanmıştır. Toplantı Merkezi teklif takip kodunuz: ${selectedLead.id}. https://www.toplantimerkezi.com.tr/teklif-takip?kod=${selectedLead.id}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-2"
                          >
                            <span>WhatsApp ile Müşteriye Takip Linki Gönder</span>
                          </a>

                          <div className="pt-2">
                            <span className="text-[11px] font-bold text-slate-700 block mb-1.5">Yerel Tedarikçi Satın Alma (RFQ):</span>
                            <div className="space-y-1.5">
                              {suppliers.slice(0, 3).map(sup => (
                                <a
                                  key={sup.id}
                                  href={`https://wa.me/${sup.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Sayın ${sup.company}, Toplantı Merkezi adına ${selectedLead.city}'de ${selectedLead.targetDate || 'yakın tarihte'} planlanan ${selectedLead.attendees} kişilik ${selectedLead.organizationType} organizasyonu için ${sup.category} kapsamındaki fiyat ve müsaitlik teklifinizi rica ederiz.`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-semibold flex items-center justify-between border border-slate-300 transition"
                                >
                                  <span>{sup.company} ({sup.category})</span>
                                  <span className="text-emerald-700 font-bold">RFQ Gönder →</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })()}
                </div>

              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl p-8 border border-slate-300">
                <FileText size={48} className="text-slate-400 mx-auto mb-3" />
                <p className="text-sm text-slate-600 font-medium">Lütfen maliyetini hesaplamak istediğiniz talebi yukarıdan seçiniz.</p>
              </div>
            )}

          </div>
        )}

        {/* TAB 4: PROGRAMMATIC SEO MANAGER (Requirements #10 & #28) */}
        {activeTab === 'seoManager' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-950 font-display">Programmatic SEO & Kalite Kontrol Masası</h3>
                <p className="text-xs text-slate-600">Her SEO sayfası için Title, Meta Description, H1, Search Intent, Canonical ve Index kontrolü.</p>
              </div>
            </div>

            <div className="space-y-4">
              {seoPages.map(page => (
                <div key={page.slug} className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div>
                      <span className="font-mono text-xs font-bold text-amber-800">/{page.slug}</span>
                      <h4 className="font-bold text-base text-slate-950 mt-0.5">{page.h1}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                        {page.searchIntent}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${page.isIndexed ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                        {page.isIndexed ? 'INDEX' : 'NOINDEX'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">SEO Title:</label>
                      <input
                        type="text"
                        value={page.title}
                        onChange={(e) => {
                          storageService.updateSeoPage(page.slug, { title: e.target.value });
                          loadData();
                        }}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-950"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Focus Topic / Arama Kümesi:</label>
                      <input
                        type="text"
                        value={page.focusTopic}
                        onChange={(e) => {
                          storageService.updateSeoPage(page.slug, { focusTopic: e.target.value });
                          loadData();
                        }}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-950"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="block text-slate-700 font-bold mb-1">Meta Description:</label>
                    <textarea
                      rows="2"
                      value={page.metaDesc}
                      onChange={(e) => {
                        storageService.updateSeoPage(page.slug, { metaDesc: e.target.value });
                        loadData();
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-950"
                    ></textarea>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: 301 REDIRECT MANAGER (Requirement #30) */}
        {activeTab === 'redirects' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-950 font-display">301 / 302 URL Yönlendirme Yöneticisi</h3>
                <p className="text-xs text-slate-600">Eski veya değişen URL'leri kalıcı 301 yönlendirmesiyle yeni hedefe aktarın.</p>
              </div>
            </div>

            {/* Add New Redirect Form */}
            <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm space-y-4">
              <h4 className="font-bold text-sm text-slate-950">Yeni Yönlendirme Ekle</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Eski URL (Kaynak)</label>
                  <input
                    type="text"
                    placeholder="/eski-sayfa"
                    value={newRedirect.oldUrl}
                    onChange={(e) => setNewRedirect({ ...newRedirect, oldUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-950 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Yeni URL (Hedef)</label>
                  <input
                    type="text"
                    placeholder="/yeni-sayfa"
                    value={newRedirect.newUrl}
                    onChange={(e) => setNewRedirect({ ...newRedirect, newUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-950 font-mono"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <select
                    value={newRedirect.type}
                    onChange={(e) => setNewRedirect({ ...newRedirect, type: Number(e.target.value) })}
                    className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-950 font-bold"
                  >
                    <option value={301}>301 (Kalıcı)</option>
                    <option value={302}>302 (Geçici)</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newRedirect.oldUrl.trim() || !newRedirect.newUrl.trim()) {
                        alert('Lütfen kaynak ve hedef URL giriniz.');
                        return;
                      }
                      storageService.addRedirect(newRedirect.oldUrl, newRedirect.newUrl, newRedirect.type);
                      setNewRedirect({ oldUrl: '', newUrl: '', type: 301 });
                      loadData();
                    }}
                    className="px-5 py-2 rounded-xl gold-gradient-bg text-slate-950 font-bold text-xs shadow-sm"
                  >
                    Ekle
                  </button>
                </div>
              </div>
            </div>

            {/* List of Redirects */}
            <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 uppercase tracking-wider bg-slate-50">
                    <th className="p-3.5 font-bold">Kaynak (Eski URL)</th>
                    <th className="p-3.5 font-bold">Hedef (Yeni URL)</th>
                    <th className="p-3.5 font-bold">Tür</th>
                    <th className="p-3.5 font-bold text-right">Sil</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {redirects.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-mono text-slate-800 font-bold">{r.oldUrl}</td>
                      <td className="p-3.5 font-mono text-emerald-800 font-bold">{r.newUrl}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-800 border border-slate-200">
                          {r.type}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => { storageService.deleteRedirect(r.id); loadData(); }}
                          className="text-slate-400 hover:text-red-600 p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: SUPPLIERS */}
        {activeTab === 'suppliers' && (
          <div className="space-y-6 animate-in fade-in duration-300">

            <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-950 font-display">Tedarikçi Ağı & Satın Alma Veritabanı</h3>
                <p className="text-xs text-slate-600">81 ildeki anlaşmalı LED, ses/ışık, sahne, catering, tercüme ve personel tedarikçileri</p>
              </div>

              <button
                onClick={() => {
                  setEditingSupplier({
                    company: '',
                    city: 'İstanbul',
                    contactName: 'Teknik Koordinasyon',
                    phone: '',
                    email: '',
                    category: 'LED ekran firmaları',
                    priceTier: 'A+ Kurumsal',
                    rating: 5.0,
                    notes: ''
                  });
                  setIsSupplierModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl gold-gradient-bg text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5"
              >
                <Plus size={16} />
                <span>Yeni Tedarikçi Ekle</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suppliers.map(sup => (
                <div key={sup.id} className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="px-2.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300 font-bold">
                        {sup.category}
                      </span>
                      <span className="flex items-center gap-1 text-amber-600 font-bold">
                        <Star size={13} className="fill-current" /> {sup.rating}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-950 font-display mb-1">{sup.company}</h4>
                    <div className="text-xs text-slate-600 mb-3">{sup.city} • Birim: {sup.contactName}</div>

                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed font-medium">
                      {sup.notes || 'Özel not girilmedi.'}
                    </p>

                    <div className="mt-3 space-y-1 text-xs text-slate-700">
                      <div>Tel: <strong className="text-slate-950">{sup.phone}</strong></div>
                      <div>E-posta: <strong className="text-slate-950">{sup.email}</strong></div>
                      <div>Fiyat Seviyesi: <strong className="text-amber-800 font-bold">{sup.priceTier}</strong></div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">Tamamlanan İş: {sup.completedJobs || 0}</span>
                    <button
                      onClick={() => {
                        storageService.deleteSupplier(sup.id);
                        loadData();
                      }}
                      className="text-slate-400 hover:text-red-600 text-xs p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 7: VENUES CMS */}
        {activeTab === 'venues' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-950 font-display">Mekân Yönetim Sistemi (CMS)</h3>
                <p className="text-xs text-slate-600">Web sitesinde sergilenen kongre otelleri ve toplantı salonları ({venues.length} Mekân Kayıtlı)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.map(v => (
                <div key={v.id} className="bg-white rounded-2xl overflow-hidden border border-slate-300 shadow-sm">
                  <div className="h-40 relative">
                    <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded bg-slate-950/90 text-amber-400 text-xs font-bold">
                      {v.city}
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="font-bold text-sm text-slate-950">{v.name}</h4>
                    <p className="text-xs text-slate-600 font-semibold">{v.venueType} • Kapasite: {v.capacity} Kişi</p>
                    <div className="text-[11px] text-slate-500 truncate">Teknik: {v.technicalGear?.join(', ')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: BİLDİRİMLER & ÇOK KANALLI ENTEGRASYON */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white border border-slate-300 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
                    <Bell className="text-amber-600" size={22} />
                    <span>Çok Kanallı Bildirim & Webhook Merkezi</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Teklif talebi geldiğinde müşteriye ve operasyon ekibine anlık otomatik bildirim gönderimi.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSendTestNotification}
                  disabled={isSendingTestNotif}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl gold-gradient-bg text-slate-950 font-bold text-xs shadow-md hover:scale-102 transition disabled:opacity-50"
                >
                  <Send size={15} />
                  <span>{isSendingTestNotif ? 'Gönderiliyor...' : 'Simüle Test Bildirimi Gönder'}</span>
                </button>
              </div>

              {testNotifResult && (
                <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  <span className="font-bold block mb-1">Test Bildirimi Çıktısı:</span>
                  <pre className="overflow-x-auto text-[11px] font-mono bg-white p-3 rounded-xl border border-amber-200">
                    {JSON.stringify(testNotifResult, null, 2)}
                  </pre>
                </div>
              )}

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 1. E-Posta Entegrasyonu */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                      <Mail size={18} className="text-amber-600" />
                      <span>E-Posta Bildirimleri</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.emailNotificationsEnabled !== false}
                        onChange={(e) => setSettings({ ...settings, emailNotificationsEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Yeni teklif talebi geldiğinde hem operasyon ekibine hem müşteriye takip linkiyle e-posta gönderir.
                  </p>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">E-Posta Webhook URL (Zapier / Make / Resend)</label>
                    <input
                      type="url"
                      placeholder="https://hook.eu1.make.com/... veya Cloud Function"
                      value={settings.webhookUrl || ''}
                      onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* 2. SMS Entegrasyonu */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                      <MessageSquare size={18} className="text-emerald-600" />
                      <span>SMS Bildirimleri</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.smsNotificationsEnabled !== false}
                        onChange={(e) => setSettings({ ...settings, smsNotificationsEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Müşteriye teklif alındığında takip kodu ve linkini içeren anlık SMS iletir (Netgsm, Twilio uyumlu).
                  </p>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">SMS Gateway Webhook URL</label>
                    <input
                      type="url"
                      placeholder="https://api.netgsm.com.tr/... veya Webhook"
                      value={settings.smsWebhookUrl || ''}
                      onChange={(e) => setSettings({ ...settings, smsWebhookUrl: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* 3. WhatsApp Entegrasyonu */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                      <Phone size={18} className="text-green-600" />
                      <span>WhatsApp Operasyon Hattı</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Aktif</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Müşterinin tek tıkla başvuru özetiyle koordinatöre bağlanmasını sağlayan kurumsal WhatsApp deep-link.
                  </p>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">WhatsApp Operasyon Numarası</label>
                    <input
                      type="text"
                      value={settings.whatsappPhone || ''}
                      onChange={(e) => setSettings({ ...settings, whatsappPhone: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-xs font-mono font-bold"
                    />
                  </div>
                </div>

              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={async () => {
                    await storageService.saveSettings(settings);
                    alert('Bildirim ayarları başarıyla kaydedildi!');
                  }}
                  className="px-6 py-3 rounded-xl gold-gradient-bg text-slate-950 font-bold text-xs shadow-md"
                >
                  Bildirim Ayarlarını Kaydet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl bg-white p-8 rounded-3xl border border-slate-300 shadow-md space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="text-xl font-bold text-slate-950 font-display">Platform & İletişim Ayarları</h3>
              <p className="text-xs text-slate-600">Web sitesi üzerindeki WhatsApp numarası, analitik kodları ve kurumsal iletişim bilgileri.</p>
            </div>

            {/* Bulut Veri Tabanı Senkronizasyon Kutusu */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Database size={16} className="text-amber-700" />
                  <span>Firebase Firestore Bulut Veritabanı</span>
                </span>
                <p className="text-xs text-slate-600 mt-0.5">
                  Statik demo verilerini ve teklif havuzunu tek tıkla Firestore bulut koleksiyonlarına aktarır.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSeedFirestore}
                disabled={isSeeding}
                className="px-4 py-2.5 rounded-xl bg-slate-950 text-amber-400 font-bold text-xs shadow-sm hover:bg-slate-900 transition flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
              >
                <RefreshCw size={14} className={isSeeding ? 'animate-spin' : ''} />
                <span>{isSeeding ? 'Aktarılıyor...' : 'Buluta Aktar (Seed & Sync)'}</span>
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5">Resmi Web Sitesi Domaini</label>
                <input
                  type="text"
                  value={settings.domain || 'www.toplantimerkezi.com.tr'}
                  onChange={(e) => setSettings({ ...settings, domain: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-950 focus:outline-none focus:border-amber-600 font-semibold"
                  placeholder="www.toplantimerkezi.com.tr"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5">Çağrı Merkezi Telefonu</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-950 focus:outline-none focus:border-amber-600 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5">WhatsApp İletişim Hattı</label>
                  <input
                    type="text"
                    value={settings.whatsappPhone}
                    onChange={(e) => setSettings({ ...settings, whatsappPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-950 focus:outline-none focus:border-amber-600 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5">Kurumsal E-Posta</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-950 focus:outline-none focus:border-amber-600 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5">Yönetici Giriş PIN Kodu</label>
                  <input
                    type="text"
                    value={settings.adminPin}
                    onChange={(e) => setSettings({ ...settings, adminPin: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-950 focus:outline-none focus:border-amber-600 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5">Firma Adresi</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-950 focus:outline-none focus:border-amber-600 font-semibold"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5">Google Analytics 4 ID</label>
                  <input
                    type="text"
                    value={settings.googleAnalyticsId}
                    onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-950 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5">Google Tag Manager ID</label>
                  <input
                    type="text"
                    value={settings.gtmId}
                    onChange={(e) => setSettings({ ...settings, gtmId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-950 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5">Meta (Facebook) Pixel ID</label>
                  <input
                    type="text"
                    value={settings.metaPixelId}
                    onChange={(e) => setSettings({ ...settings, metaPixelId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-950 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={async () => {
                    await storageService.saveSettings(settings);
                    alert('Ayarlar başarıyla kaydedildi!');
                  }}
                  className="px-6 py-3 rounded-xl gold-gradient-bg text-slate-950 font-bold text-xs shadow-md"
                >
                  Ayarları Kaydet
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Supplier Modal */}
      {isSupplierModalOpen && editingSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white border border-slate-300 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-slate-950 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="text-lg font-bold font-display">Yeni Tedarikçi Ekle</h4>
              <button onClick={() => setIsSupplierModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-800 font-bold mb-1">Firma Adı *</label>
                <input
                  type="text"
                  value={editingSupplier.company}
                  onChange={(e) => setEditingSupplier({ ...editingSupplier, company: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-950 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">Kategori</label>
                  <select
                    value={editingSupplier.category}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-950 font-semibold"
                  >
                    {[
                      'Oteller', 'Toplantı salonları', 'Catering firmaları', 'Ses/ışık firmaları',
                      'LED ekran firmaları', 'Sahne firmaları', 'Dekorasyon', 'Fotoğraf/video',
                      'Host/hostes', 'Güvenlik', 'Sağlık', 'Sanatçı', 'Sunucu', 'Tercüman'
                    ].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-800 font-bold mb-1">Şehir</label>
                  <input
                    type="text"
                    value={editingSupplier.city}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">Yetkili / Birim</label>
                  <input
                    type="text"
                    value={editingSupplier.contactName}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, contactName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-950"
                  />
                </div>
                <div>
                  <label className="block text-slate-800 font-bold mb-1">Telefon</label>
                  <input
                    type="text"
                    value={editingSupplier.phone}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-950"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Notlar & Kapasite Bilgisi</label>
                <textarea
                  rows="2"
                  value={editingSupplier.notes}
                  onChange={(e) => setEditingSupplier({ ...editingSupplier, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-950"
                ></textarea>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSupplierModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  İptal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!editingSupplier.company.trim()) {
                      alert('Lütfen firma adı giriniz.');
                      return;
                    }
                    storageService.addSupplier(editingSupplier);
                    setIsSupplierModalOpen(false);
                    loadData();
                  }}
                  className="px-5 py-2 rounded-xl gold-gradient-bg text-slate-950 text-xs font-bold shadow-md"
                >
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
