import React, { useEffect, useMemo, useState } from 'react';
import {
  LayoutDashboard,
  Kanban,
  Calculator,
  Truck,
  Building2,
  Globe,
  ArrowRightLeft,
  Bell,
  Settings,
  LogOut,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Lock,
  Mail,
  KeyRound,
  Activity,
  X
} from 'lucide-react';
import {
  auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from '../services/firebase';
import {
  storageService,
  ROLE_DEFINITIONS
} from '../services/storageService';
import { updatePageMeta } from '../services/seoService';
import { VENUES } from '../data/venuesData';

import DashboardModule from '../components/admin/DashboardModule';
import PipelineModule from '../components/admin/PipelineModule';
import CostCalcModule from '../components/admin/CostCalcModule';
import { SuppliersModule, VenuesModule } from '../components/admin/SuppliersVenuesModules';
import { SeoManagerModule, RedirectsModule } from '../components/admin/SeoRedirectsModules';
import { NotificationsModule, SettingsModule } from '../components/admin/NotificationsSettingsModules';

const ADMIN_MODULES = [
  { id: 'dashboard', label: '1. Executive Dashboard', icon: LayoutDashboard },
  { id: 'pipeline', label: '2. 11 Aşama CRM Pipeline', icon: Kanban },
  { id: 'costCalc', label: '3. Maliyetlendirme & PDF Teklif', icon: Calculator },
  { id: 'suppliers', label: '4. 81 İl Tedarikçi Veritabanı', icon: Truck },
  { id: 'venues', label: '5. Mekân ve Oteller', icon: Building2 },
  { id: 'seoManager', label: '6. Programmatic SEO Masası', icon: Globe },
  { id: 'redirects', label: '7. Redirect Yöneticisi', icon: ArrowRightLeft },
  { id: 'notifications', label: '8. Bildirim ve Webhook', icon: Bell },
  { id: 'settings', label: '9. Sistem ve Bulut Ayarları', icon: Settings }
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Kimlik Doğrulama & RBAC Durumu
  const [authChecking, setAuthChecking] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [authError, setAuthError] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // İsteğe Bağlı Ek İkincil PIN Kontrolü (Yalnızca Firebase Auth sonrası ek adım olarak)
  const [secondaryPinVerified, setSecondaryPinVerified] = useState(false);
  const [secondaryPinInput, setSecondaryPinInput] = useState('');

  // Gerçek Sunucu Bağlantı & Veri Durumu
  const [connectionState, setConnectionState] = useState({
    connected: false,
    latencyMs: null,
    checkedAt: null,
    error: null
  });
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [syncError, setSyncError] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);

  // 9 Modülün Gerçek Firestore Veri Koleksiyonları
  const [leads, setLeads] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [venues, setVenues] = useState(VENUES);
  const [seoPages, setSeoPages] = useState([]);
  const [redirects, setRedirects] = useState([]);
  const [settings, setSettings] = useState(storageService.getSettings());

  // Modüller Arası Seçim Durumu
  const [selectedLeadForCostId, setSelectedLeadForCostId] = useState('');
  const [externalPipelineLead, setExternalPipelineLead] = useState(null);
  const [externalNewLeadOpen, setExternalNewLeadOpen] = useState(false);

  // Bildirim (Toast) ve Onay Modalı (Tarayıcı alert/confirm yerine)
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message, id: Date.now() });
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  // Yönetim paneli kesin olarak noindex olarak işaretlenir
  useEffect(() => {
    updatePageMeta({
      title: 'Kurumsal Yönetim & CRM Masası | Toplantı Merkezi',
      description: 'Toplantı Merkezi yetkili kurumsal operasyon ve CRM yönetim paneli.',
      canonicalPath: '/admin',
      noindex: true
    });
  }, []);

  const probeServerConnection = async () => {
    const status = await storageService.verifyConnection();
    setConnectionState(status);
    return status;
  };

  const loadAllCloudCollections = async () => {
    setDataLoading(true);
    setSyncError(null);
    try {
      const [
        connStatus,
        cloudSuppliers,
        cloudVenues,
        cloudSeo,
        cloudRedirects,
        cloudSettings
      ] = await Promise.all([
        storageService.verifyConnection(),
        storageService.fetchSuppliersFromCloud(),
        storageService.fetchVenuesFromCloud(),
        storageService.fetchSeoPagesFromCloud(),
        storageService.fetchRedirectsFromCloud(),
        storageService.fetchSettingsFromCloud()
      ]);

      setConnectionState(connStatus);
      setSuppliers(cloudSuppliers);

      // Doğrulanmış temel kongre merkezleri ile Firestore'daki ek/güncel mekânları birleştir
      const mergedVenuesMap = new Map();
      VENUES.forEach((v) => mergedVenuesMap.set(v.id, v));
      cloudVenues.forEach((v) => mergedVenuesMap.set(v.id, v));
      setVenues(Array.from(mergedVenuesMap.values()));

      setSeoPages(cloudSeo);
      setRedirects(cloudRedirects);
      setSettings(cloudSettings);
      setLastSyncedAt(new Date().toISOString());
    } catch (err) {
      setSyncError(err?.message || 'Veri senkronizasyon hatası');
    } finally {
      setDataLoading(false);
    }
  };

  // Firebase Auth Oturum Dinleyicisi
  useEffect(() => {
    if (!auth) {
      setAuthChecking(false);
      setAuthError('Firebase Authentication servisi başlatılamadı.');
      return;
    }
    const unsub = onAuthStateChanged(auth, async (user) => {
      setAuthChecking(true);
      setAuthError('');
      if (!user) {
        setFirebaseUser(null);
        setUserProfile(null);
        setLeads([]);
        setAuthChecking(false);
        return;
      }
      setFirebaseUser(user);
      try {
        const resolved = await storageService.resolveCurrentUserRole(user);
        if (!resolved || !resolved.isActive || resolved.role === 'disabled') {
          setUserProfile(null);
          setAuthError(
            'Bu kullanıcı hesabının kurumsal yönetim paneli erişim yetkisi (tm_users) tanımlı değil veya pasifleştirilmiş.'
          );
        } else {
          setUserProfile(resolved);
          await loadAllCloudCollections();
        }
      } catch (err) {
        setAuthError(err?.message || 'Kullanıcı yetki profili doğrulanamadı.');
      } finally {
        setAuthChecking(false);
      }
    });
    return () => unsub();
  }, []);

  // Gerçek Zamanlı Firestore Leads Dinleyicisi
  useEffect(() => {
    if (!userProfile) return;
    const unsub = storageService.subscribeToLeads(
      (cloudLeads, meta) => {
        setLeads(cloudLeads);
        if (cloudLeads.length > 0 && !selectedLeadForCostId) {
          setSelectedLeadForCostId(cloudLeads[0].id);
        }
        if (meta?.syncedAt) {
          setLastSyncedAt(meta.syncedAt);
        }
        setSyncError(null);
      },
      (err) => {
        setSyncError(err?.message || 'Gerçek zamanlı talep akışı bağlantı hatası.');
      }
    );
    return () => unsub();
  }, [userProfile?.uid]);

  const rolePerms = useMemo(() => {
    if (!userProfile?.role) return ROLE_DEFINITIONS.viewer;
    return ROLE_DEFINITIONS[userProfile.role] || ROLE_DEFINITIONS.viewer;
  }, [userProfile]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);
    } catch (err) {
      setAuthError(
        'Giriş başarısız: E-posta veya parola hatalı ya da yetkisiz erişim denemesi.'
      );
    } finally {
      setLoggingIn(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!loginEmail.trim()) {
      setAuthError('Parola sıfırlama bağlantısı için önce kurumsal e-posta adresinizi girin.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, loginEmail.trim());
      showToast('success', 'Parola sıfırlama bağlantısı e-posta adresinize gönderildi.');
    } catch (err) {
      setAuthError(err?.message || 'Parola sıfırlama e-postası gönderilemedi.');
    }
  };

  const handleLogout = async () => {
    try {
      await storageService.logAuditAction({
        action: 'user_logout',
        module: 'auth',
        entityId: userProfile?.uid || '-',
        details: 'Yönetim panelinden güvenli çıkış yapıldı.',
        actor: userProfile
      });
      await signOut(auth);
      setSecondaryPinVerified(false);
    } catch {
      // ignore
    }
  };

  // 1. Yükleniyor Durumu
  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center max-w-sm w-full">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-3" />
          <h2 className="text-sm font-extrabold text-slate-900">
            Firebase Kimlik & Yetki Doğrulanıyor...
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Gerçek sunucu oturumu ve rol sınırları kontrol ediliyor.
          </p>
        </div>
      </div>
    );
  }

  // 2. Firebase Authentication Giriş Ekranı (Ortak PIN tek başına giriş sağlamaz!)
  if (!firebaseUser || !userProfile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-md w-full p-8">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
            Kurumsal Güvenlik & RBAC Katmanı
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 mt-1">
            Toplantı Merkezi Yönetim Masası
          </h1>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Erişim yalnızca doğrulanmış Firebase Authentication kurumsal hesapları ve Firestore Security Rules rol yetkisi ile sağlanır.
          </p>

          {authError && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kurumsal E-Posta Adresi
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="yonetim@toplantimerkezi.com.tr"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Parola
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shadow-md transition-all disabled:opacity-50"
            >
              {loggingIn ? 'Kimlik Doğrulanıyor...' : 'Güvenli Oturum Aç'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handlePasswordReset}
              className="font-bold text-slate-600 hover:text-slate-900"
            >
              Parolamı Sıfırla
            </button>
            {firebaseUser && (
              <button
                type="button"
                onClick={handleLogout}
                className="font-bold text-rose-600 hover:text-rose-700"
              >
                Farklı Hesapla Giriş Yap
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. İsteğe Bağlı Ek İkincil PIN Kontrolü (Yalnızca Ayarlardan Aktif Edilmişse)
  if (settings?.requireSecondaryPin && !secondaryPinVerified) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-sm w-full p-7 text-center">
          <Lock className="w-8 h-8 text-amber-600 mx-auto mb-3" />
          <h2 className="text-base font-extrabold text-slate-900">
            İkincil Operasyon PIN Doğrulaması
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {userProfile.email} oturumu doğrulandı. Devam etmek için ikincil güvenlik PIN kodunu girin.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (secondaryPinInput === (settings.adminPin || '1234')) {
                setSecondaryPinVerified(true);
              } else {
                showToast('error', 'Hatalı ikincil PIN kodu.');
              }
            }}
            className="mt-4 space-y-3"
          >
            <input
              type="password"
              value={secondaryPinInput}
              onChange={(e) => setSecondaryPinInput(e.target.value)}
              placeholder="••••"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-center text-base font-mono tracking-widest"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
            >
              Doğrula
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 4. Ana Yönetim Masası
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16">
      {/* Bildirim Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md bg-slate-900 text-white px-4 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs">
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span className="font-semibold flex-1">{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="p-1 rounded hover:bg-white/10"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Özel Onay Modalı */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6">
            <h3 className="text-base font-extrabold text-slate-900">{confirmDialog.title}</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {confirmDialog.message}
            </p>
            <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={async () => {
                  const fn = confirmDialog.onConfirm;
                  setConfirmDialog(null);
                  if (fn) await fn();
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                {confirmDialog.confirmLabel || 'Onayla'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Üst Kurumsal Başlık & Gerçek Sunucu Bağlantı Durumu */}
      <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-extrabold flex items-center justify-center text-sm shadow">
              TM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold tracking-tight">
                  Toplantı Merkezi — Kurumsal CRM & Operasyon Masası
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                  {rolePerms.label}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-3 mt-0.5">
                <span className="inline-flex items-center gap-1">
                  <Activity
                    className={`w-3.5 h-3.5 ${
                      connectionState.connected ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  />
                  {connectionState.connected
                    ? `Firestore Doğrulandı (${connectionState.latencyMs ?? '-'} ms)`
                    : `Bağlantı Sorunu: ${connectionState.error || 'Kontrol ediliyor'}`}
                </span>
                {lastSyncedAt && (
                  <span>
                    • Son Senkronizasyon: {new Date(lastSyncedAt).toLocaleTimeString('tr-TR')}
                  </span>
                )}
                {syncError && (
                  <span className="text-rose-400 font-bold">• Hata: {syncError}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              disabled={dataLoading}
              onClick={loadAllCloudCollections}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold inline-flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${dataLoading ? 'animate-spin' : ''}`} />
              Verileri Yenile
            </button>
            <div className="hidden sm:block text-right text-xs px-2">
              <div className="font-bold text-white">{userProfile.email}</div>
              <div className="text-[10px] text-slate-400">{rolePerms.label}</div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold inline-flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Çıkış
            </button>
          </div>
        </div>

        {/* 9 Modül Navigasyon Sekmeleri */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 overflow-x-auto border-t border-slate-800/80">
          <nav className="flex items-center gap-1 py-2 min-w-max">
            {ADMIN_MODULES.map((mod) => {
              const Icon = mod.icon;
              const isActive = activeTab === mod.id;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => setActiveTab(mod.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {mod.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Modül İçerik Alanı */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardModule
            leads={leads}
            rolePerms={rolePerms}
            onSelectLeadForDetail={(lead) => {
              setExternalPipelineLead(lead);
              setActiveTab('pipeline');
            }}
            onSelectLeadForCostCalc={(lead) => {
              setSelectedLeadForCostId(lead.id);
              setActiveTab('costCalc');
            }}
            onOpenNewLeadModal={() => {
              setExternalNewLeadOpen(true);
              setActiveTab('pipeline');
            }}
            onSwitchTab={(tabId) => setActiveTab(tabId)}
          />
        )}

        {activeTab === 'pipeline' && (
          <PipelineModule
            leads={leads}
            venues={venues}
            userProfile={userProfile}
            rolePerms={rolePerms}
            onLeadsMutated={loadAllCloudCollections}
            onSelectLeadForCostCalc={(lead) => {
              setSelectedLeadForCostId(lead.id);
              setActiveTab('costCalc');
            }}
            onNotify={showToast}
            onRequestConfirm={(cfg) => setConfirmDialog(cfg)}
            externalSelectedLead={externalPipelineLead}
            onClearExternalSelectedLead={() => setExternalPipelineLead(null)}
            externalNewLeadOpen={externalNewLeadOpen}
            onCloseExternalNewLead={() => setExternalNewLeadOpen(false)}
          />
        )}

        {activeTab === 'costCalc' && (
          <CostCalcModule
            leads={leads}
            suppliers={suppliers}
            venues={venues}
            settings={settings}
            selectedLeadId={selectedLeadForCostId}
            onSelectLeadId={setSelectedLeadForCostId}
            userProfile={userProfile}
            rolePerms={rolePerms}
            onLeadsMutated={loadAllCloudCollections}
            onNotify={showToast}
          />
        )}

        {activeTab === 'suppliers' && (
          <SuppliersModule
            suppliers={suppliers}
            leads={leads}
            userProfile={userProfile}
            rolePerms={rolePerms}
            onSuppliersMutated={loadAllCloudCollections}
            onNotify={showToast}
          />
        )}

        {activeTab === 'venues' && (
          <VenuesModule
            venues={venues}
            leads={leads}
            userProfile={userProfile}
            rolePerms={rolePerms}
            onVenuesMutated={loadAllCloudCollections}
            onNotify={showToast}
          />
        )}

        {activeTab === 'seoManager' && (
          <SeoManagerModule
            seoPages={seoPages}
            userProfile={userProfile}
            rolePerms={rolePerms}
            onSeoMutated={loadAllCloudCollections}
            onNotify={showToast}
          />
        )}

        {activeTab === 'redirects' && (
          <RedirectsModule
            redirects={redirects}
            userProfile={userProfile}
            rolePerms={rolePerms}
            onRedirectsMutated={loadAllCloudCollections}
            onNotify={showToast}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationsModule
            userProfile={userProfile}
            rolePerms={rolePerms}
            onNotify={showToast}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsModule
            settings={settings}
            leads={leads}
            suppliers={suppliers}
            venues={venues}
            userProfile={userProfile}
            rolePerms={rolePerms}
            connectionState={connectionState}
            onProbeConnection={probeServerConnection}
            onSettingsMutated={loadAllCloudCollections}
            onNotify={showToast}
          />
        )}
      </main>
    </div>
  );
}
