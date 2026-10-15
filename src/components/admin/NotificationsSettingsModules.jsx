import React, { useEffect, useState } from 'react';
import {
  Bell,
  Shield,
  Send,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Lock,
  Users,
  Database,
  Download,
  History,
  Save,
  Plus,
  Activity
} from 'lucide-react';
import { notificationService, DEFAULT_NOTIFICATION_CONFIG } from '../../services/notificationService';
import { storageService, ROLE_DEFINITIONS } from '../../services/storageService';

export function NotificationsModule({
  userProfile,
  rolePerms,
  onNotify
}) {
  const isSuperAdmin = userProfile?.role === 'superadmin';
  const [config, setConfig] = useState(DEFAULT_NOTIFICATION_CONFIG);
  const [secrets, setSecrets] = useState({
    webhookUrl: '',
    webhookSigningSecret: '',
    telegramBotToken: '',
    whatsappAccessToken: ''
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [retryingId, setRetryingId] = useState(null);

  const loadNotificationData = async () => {
    setLoading(true);
    try {
      const [{ config: cfg, secrets: sec }, logList] = await Promise.all([
        notificationService.fetchNotificationSettings(isSuperAdmin),
        notificationService.fetchNotificationLogs(50)
      ]);
      setConfig(cfg);
      if (isSuperAdmin && sec) {
        setSecrets({
          webhookUrl: sec.webhookUrl || '',
          webhookSigningSecret: sec.webhookSigningSecret || '',
          telegramBotToken: sec.telegramBotToken || '',
          whatsappAccessToken: sec.whatsappAccessToken || ''
        });
      }
      setLogs(logList);
    } catch (err) {
      onNotify('error', err?.message || 'Bildirim ayarları yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotificationData();
  }, [isSuperAdmin]);

  const handleSaveNotifications = async (e) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      onNotify('error', 'Bildirim kanalları ve API sırları yalnızca Süperadmin tarafından değiştirilebilir.');
      return;
    }
    setSaving(true);
    try {
      await notificationService.saveNotificationSettings(
        config,
        secrets,
        userProfile?.email || 'superadmin'
      );
      await storageService.logAuditAction({
        action: 'notification_config_updated',
        module: 'notifications',
        entityId: 'config',
        details: `Webhook: ${config.webhookEnabled}, Telegram: ${config.telegramEnabled}, WhatsApp: ${config.whatsappApiEnabled}`,
        actor: userProfile
      });
      onNotify('success', 'Bildirim kanalları ve güvenli sırlar sunucuya kaydedildi.');
      await loadNotificationData();
    } catch (err) {
      onNotify('error', err?.message || 'Bildirim ayarları kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  };

  const handleExplicitTest = async () => {
    if (!isSuperAdmin) {
      onNotify('error', 'Açık yönetici test gönderimi yalnızca Süperadmin yetkisiyle çalıştırılabilir.');
      return;
    }
    setTesting(true);
    try {
      const res = await notificationService.sendExplicitAdminTest(userProfile?.email || 'superadmin');
      await loadNotificationData();
      if (res.dispatched) {
        onNotify('success', 'Açık yönetici test bildirimi aktif kanallara gönderildi.');
      } else {
        onNotify(
          'error',
          res.reason || 'Gönderim başarısız oldu. Lütfen kanal durumunu ve günlük tablosunu kontrol edin.'
        );
      }
    } catch (err) {
      onNotify('error', err?.message || 'Test gönderimi hatası.');
    } finally {
      setTesting(false);
    }
  };

  const handleRetryLog = async (logItem) => {
    if (!rolePerms?.canWriteLeads) return;
    setRetryingId(logItem.id);
    try {
      await notificationService.retryNotificationLog(logItem, userProfile?.email || 'admin');
      await loadNotificationData();
      onNotify('success', `${logItem.id} bildirimi yeniden denendi.`);
    } catch (err) {
      onNotify('error', err?.message || 'Yeniden deneme hatası.');
    } finally {
      setRetryingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Kanal & Olay Yapılandırması */}
      <form
        onSubmit={handleSaveNotifications}
        className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Çok Kanallı Bildirim & Güvenli Webhook Merkezi
            </h3>
            <p className="text-xs text-slate-500">
              Tüm kanallar varsayılan olarak kapalıdır. Doğrulanmış alıcı ve güvenli HTTPS hedefi olmadan mesaj gönderilmez.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isSuperAdmin && (
              <>
                <button
                  type="button"
                  disabled={testing}
                  onClick={handleExplicitTest}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-900 text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-amber-600" />
                  {testing ? 'Test Gönderiliyor...' : 'Açık Yönetici Test Gönderimi'}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5 text-amber-400" />
                  {saving ? 'Kaydediliyor...' : 'Yapılandırmayı Kaydet'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tetiklenecek Olaylar */}
        <div>
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-3">
            1. Bildirim Tetikleyici Olaylar (Mükerrer Gönderim Korumalı)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {[
              { key: 'new_lead', label: 'Yeni Kurumsal Talep Geldiğinde' },
              { key: 'proposal_sent', label: 'Resmi Teklif Yayınlandığında (Rev.X)' },
              { key: 'customer_approved', label: 'Müşteri Onayı / Revizyon Yanıtında' }
            ].map((ev) => (
              <label
                key={ev.key}
                className="flex items-center gap-2.5 p-3.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer font-bold text-slate-800"
              >
                <input
                  type="checkbox"
                  disabled={!isSuperAdmin}
                  checked={Boolean(config.events?.[ev.key])}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      events: { ...config.events, [ev.key]: e.target.checked }
                    })
                  }
                />
                {ev.label}
              </label>
            ))}
          </div>
        </div>

        {/* 3 Kanal Ayarı */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
          {/* Güvenli HTTPS Webhook */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900">Güvenli HTTPS Webhook</span>
              <input
                type="checkbox"
                disabled={!isSuperAdmin}
                checked={Boolean(config.webhookEnabled)}
                onChange={(e) => setConfig({ ...config, webhookEnabled: e.target.checked })}
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Doğrulanmış Alıcı / Sistem Etiketi
              </label>
              <input
                type="text"
                disabled={!isSuperAdmin}
                value={config.webhookRecipientLabel || ''}
                onChange={(e) =>
                  setConfig({ ...config, webhookRecipientLabel: e.target.value })
                }
                placeholder="Örn: Kurumsal Slack / ERP Webhook"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                HTTPS Webhook URL (SSRF Korumalı — Yalnızca 443)
              </label>
              <input
                type="url"
                disabled={!isSuperAdmin}
                value={secrets.webhookUrl}
                onChange={(e) => setSecrets({ ...secrets, webhookUrl: e.target.value })}
                placeholder={isSuperAdmin ? 'https://hooks...' : '•••••••• (Süperadmin Sır Alanı)'}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono"
              />
            </div>
          </div>

          {/* Telegram Bot API */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900">Telegram Resmi Bot API</span>
              <input
                type="checkbox"
                disabled={!isSuperAdmin}
                checked={Boolean(config.telegramEnabled)}
                onChange={(e) => setConfig({ ...config, telegramEnabled: e.target.checked })}
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Doğrulanmış Telegram Chat ID
              </label>
              <input
                type="text"
                disabled={!isSuperAdmin}
                value={config.telegramChatId || ''}
                onChange={(e) => setConfig({ ...config, telegramChatId: e.target.value })}
                placeholder="-100..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Telegram Bot Token (Sunucu Sırrı)
              </label>
              <input
                type="password"
                disabled={!isSuperAdmin}
                value={secrets.telegramBotToken}
                onChange={(e) => setSecrets({ ...secrets, telegramBotToken: e.target.value })}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono"
              />
            </div>
          </div>

          {/* WhatsApp Cloud API */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900">Resmi WhatsApp Cloud API</span>
              <input
                type="checkbox"
                disabled={!isSuperAdmin}
                checked={Boolean(config.whatsappApiEnabled)}
                onChange={(e) =>
                  setConfig({ ...config, whatsappApiEnabled: e.target.checked })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number ID</label>
                <input
                  type="text"
                  disabled={!isSuperAdmin}
                  value={config.whatsappPhoneNumberId || ''}
                  onChange={(e) =>
                    setConfig({ ...config, whatsappPhoneNumberId: e.target.value })
                  }
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Alıcı Telefon</label>
                <input
                  type="text"
                  disabled={!isSuperAdmin}
                  value={config.whatsappRecipientPhone || ''}
                  onChange={(e) =>
                    setConfig({ ...config, whatsappRecipientPhone: e.target.value })
                  }
                  placeholder="90532..."
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Meta Graph Access Token (Sunucu Sırrı)
              </label>
              <input
                type="password"
                disabled={!isSuperAdmin}
                value={secrets.whatsappAccessToken}
                onChange={(e) =>
                  setSecrets({ ...secrets, whatsappAccessToken: e.target.value })
                }
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono"
              />
            </div>
          </div>
        </div>
      </form>

      {/* Bildirim Gönderim Günlüğü & Tekrar Deneme Tablosu */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">
              Bildirim Gönderim Günlüğü, Hata & Tekrar Deneme Kayıtları ({logs.length})
            </h4>
            <p className="text-[11px] text-slate-500">
              Her olay için idempotency anahtarı ile mükerrer bildirimler engellenir.
            </p>
          </div>
          <button
            type="button"
            onClick={loadNotificationData}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-bold inline-flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Yenile
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Günlükler yükleniyor...</div>
        ) : logs.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500">
            Henüz kaydedilmiş bir bildirim gönderim kaydı bulunmuyor.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase">
                  <th className="py-2.5 px-4">Zaman</th>
                  <th className="py-2.5 px-4">Olay & Talep</th>
                  <th className="py-2.5 px-4">Kanal & Alıcı</th>
                  <th className="py-2.5 px-4">Durum / HTTP</th>
                  <th className="py-2.5 px-4">Tekrar Sayısı</th>
                  <th className="py-2.5 px-4">Hata Detayı</th>
                  <th className="py-2.5 px-4 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 text-slate-600">
                      {log.dispatchedAt
                        ? new Date(log.dispatchedAt).toLocaleString('tr-TR')
                        : '-'}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="font-bold text-slate-900">{log.eventType}</span>
                      <div className="font-mono text-[10px] text-slate-500">
                        {log.leadId} ({log.versionKey})
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="uppercase font-bold text-slate-800">{log.channel}</span>
                      <div className="text-[10px] text-slate-500">{log.recipientMasked}</div>
                    </td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.status === 'sent'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {log.status === 'sent' ? 'BAŞARILI' : 'HATA'}
                        {log.httpStatus ? ` (HTTP ${log.httpStatus})` : ''}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-700">
                      {log.retryCount || 0}
                    </td>
                    <td className="py-2.5 px-4 text-rose-600 max-w-xs truncate">
                      {log.errorMessage || '-'}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      {log.status !== 'sent' && rolePerms?.canWriteLeads && (
                        <button
                          type="button"
                          disabled={retryingId === log.id}
                          onClick={() => handleRetryLog(log)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-bold"
                        >
                          {retryingId === log.id ? 'Deneniyor...' : 'Tekrar Dene'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export function SettingsModule({
  settings = {},
  leads = [],
  suppliers = [],
  venues = [],
  userProfile,
  rolePerms,
  connectionState,
  onProbeConnection,
  onSettingsMutated,
  onNotify
}) {
  const isSuperAdmin = userProfile?.role === 'superadmin';
  const [form, setForm] = useState({ ...settings });
  const [tmUsers, setTmUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [newUserForm, setNewUserForm] = useState({
    uid: '',
    email: '',
    name: '',
    role: 'sales'
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingUser, setSavingUser] = useState(false);

  const loadUsersAndLogs = async () => {
    const [uList, aLogs] = await Promise.all([
      storageService.fetchTmUsers(),
      storageService.fetchAuditLogs(60)
    ]);
    setTmUsers(uList);
    setAuditLogs(aLogs);
  };

  useEffect(() => {
    setForm({ ...settings });
  }, [settings]);

  useEffect(() => {
    loadUsersAndLogs();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      onNotify('error', 'Sistem ayarları yalnızca Süperadmin tarafından güncellenebilir.');
      return;
    }
    setSavingSettings(true);
    try {
      await storageService.saveSettings(form, userProfile);
      if (onSettingsMutated) onSettingsMutated();
      onNotify('success', 'Kurumsal sistem ayarları Firestore üzerine kaydedildi.');
    } catch (err) {
      onNotify('error', err?.message || 'Ayarlar kaydedilemedi.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveUserRole = async (e) => {
    e.preventDefault();
    if (!isSuperAdmin) return;
    setSavingUser(true);
    try {
      await storageService.saveTmUser(newUserForm.uid.trim(), newUserForm, userProfile);
      setNewUserForm({ uid: '', email: '', name: '', role: 'sales' });
      await loadUsersAndLogs();
      onNotify('success', 'Kullanıcı rol ve yetki kaydı güncellendi.');
    } catch (err) {
      onNotify('error', err?.message || 'Kullanıcı kaydedilemedi.');
    } finally {
      setSavingUser(false);
    }
  };

  const handleExportDataJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      exportedBy: userProfile?.email,
      counts: {
        leads: leads.length,
        suppliers: suppliers.length,
        venues: venues.length
      },
      leads,
      suppliers,
      venues
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Toplanti_Merkezi_CRM_Yedek_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    storageService.logAuditAction({
      action: 'data_exported_json',
      module: 'settings',
      entityId: 'backup',
      details: `${leads.length} talep, ${suppliers.length} tedarikçi dışa aktarıldı.`,
      actor: userProfile
    });
    onNotify('success', 'Gerçek veritabanı kaydı JSON formatında güvenli olarak dışa aktarıldı.');
  };

  return (
    <div className="space-y-6">
      {/* Gerçek Firestore Bağlantı Doğrulama & Senkronizasyon Kartı */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
              Gerçek Sunucu Bağlantı & Senkronizasyon Durumu
            </span>
          </div>
          <div className="text-sm font-bold">
            Durum:{' '}
            {connectionState?.connected ? (
              <span className="text-emerald-400">
                Doğrulanmış Firestore Sunucu Bağlantısı ({connectionState.latencyMs ?? '-'} ms)
              </span>
            ) : (
              <span className="text-rose-400">
                Bağlantı Hatası: {connectionState?.error || 'Sunucuya ulaşılamıyor'}
              </span>
            )}
          </div>
          <div className="text-xs text-slate-300">
            Son Başarılı Senkronizasyon:{' '}
            {connectionState?.checkedAt
              ? new Date(connectionState.checkedAt).toLocaleString('tr-TR')
              : '-'}{' '}
            • Aktif Kullanıcı: <strong>{userProfile?.email}</strong> ({ROLE_DEFINITIONS[userProfile?.role]?.label || userProfile?.role})
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onProbeConnection}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Bağlantıyı Şimdi Test Et
          </button>
          <button
            type="button"
            onClick={handleExportDataJson}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold inline-flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Güvenli Veri Dışa Aktar (JSON)
          </button>
        </div>
      </div>

      {/* Kurumsal İletişim & İkincil PIN Ayarları */}
      <form
        onSubmit={handleSaveSettings}
        className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs"
      >
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Kurumsal Antet, İletişim ve Güvenlik Yapılandırması
            </h3>
            <p className="text-[11px] text-slate-500">
              Üretim ortamında sahte veri yükleme (Demo Seed) ve toplu veri sıfırlama kontrolleri kalıcı olarak kaldırılmıştır.
            </p>
          </div>
          {isSuperAdmin && (
            <button
              type="submit"
              disabled={savingSettings}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold inline-flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5 text-amber-400" />
              {savingSettings ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Resmi Şirket Unvanı (PDF Anteti)</label>
            <input
              type="text"
              disabled={!isSuperAdmin}
              value={form.companyName || ''}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Kurumsal Telefon</label>
            <input
              type="text"
              disabled={!isSuperAdmin}
              value={form.phone || ''}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Resmi E-Posta</label>
            <input
              type="email"
              disabled={!isSuperAdmin}
              value={form.email || ''}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Merkez Adresi</label>
            <input
              type="text"
              disabled={!isSuperAdmin}
              value={form.address || ''}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 w-full cursor-pointer">
              <input
                type="checkbox"
                disabled={!isSuperAdmin}
                checked={Boolean(form.requireSecondaryPin)}
                onChange={(e) =>
                  setForm({ ...form, requireSecondaryPin: e.target.checked })
                }
              />
              Firebase Auth Sonrası Ek İkincil PIN Koruması İste
            </label>
          </div>
        </div>
      </form>

      {/* Rol Tabanlı Erişim (RBAC) Kullanıcı Yönetimi */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">
            Rol Tabanlı Erişim Kontrolü (RBAC — tm_users)
          </h3>
          <p className="text-[11px] text-slate-500">
            Roller: <strong>Süperadmin</strong> (Tam Yetki), <strong>Satış</strong> (CRM + Maliyet/PDF), <strong>Operasyon</strong> (CRM + Tedarikçi/Mekân), <strong>Yalnızca Görüntüleme</strong> (Salt Okunur).
          </p>
        </div>

        {isSuperAdmin && (
          <form
            onSubmit={handleSaveUserRole}
            className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200"
          >
            <div>
              <label className="block font-bold text-slate-700 mb-1">Firebase Auth UID *</label>
              <input
                type="text"
                required
                value={newUserForm.uid}
                onChange={(e) => setNewUserForm({ ...newUserForm, uid: e.target.value })}
                placeholder="Kullanıcı UID"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">E-Posta *</label>
              <input
                type="email"
                required
                value={newUserForm.email}
                onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                placeholder="ad@toplantimerkezi.com.tr"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ad Soyad / Unvan</label>
              <input
                type="text"
                value={newUserForm.name}
                onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                placeholder="Yetkili Adı"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Yetki Rolü *</label>
              <select
                value={newUserForm.role}
                onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold bg-white"
              >
                {Object.values(ROLE_DEFINITIONS).map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={savingUser}
                className="w-full py-2 px-4 rounded-lg bg-slate-900 text-white font-bold"
              >
                {savingUser ? 'Kaydediliyor...' : 'Rol Ata / Güncelle'}
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase">
                <th className="py-2.5 px-4">UID</th>
                <th className="py-2.5 px-4">E-Posta & İsim</th>
                <th className="py-2.5 px-4">Atanan Rol</th>
                <th className="py-2.5 px-4">Durum</th>
                <th className="py-2.5 px-4">Son Güncelleme</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {tmUsers.map((u) => (
                <tr key={u.uid}>
                  <td className="py-2.5 px-4 font-mono text-[11px] text-slate-600">{u.uid}</td>
                  <td className="py-2.5 px-4">
                    <div className="font-bold text-slate-900">{u.email}</div>
                    <div className="text-[11px] text-slate-500">{u.name}</div>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-400 font-bold text-[10px]">
                      {ROLE_DEFINITIONS[u.role]?.label || u.role}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-bold text-emerald-700">
                    {u.isActive !== false ? 'Aktif' : 'Pasif'}
                  </td>
                  <td className="py-2.5 px-4 text-slate-500">
                    {u.updatedAt ? new Date(u.updatedAt).toLocaleString('tr-TR') : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* İşlem Geçmişi (Değiştirilemez Audit Logs) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <History className="w-4 h-4 text-slate-600" />
              Sistem İşlem Geçmişi (Değiştirilemez Denetim Günlüğü — {auditLogs.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={loadUsersAndLogs}
            className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 font-bold"
          >
            Yenile
          </button>
        </div>
        <div className="max-h-72 overflow-y-auto divide-y divide-slate-200">
          {auditLogs.length === 0 ? (
            <div className="p-6 text-center text-slate-500">Henüz işlem kaydı yok.</div>
          ) : (
            auditLogs.map((log) => (
              <div
                key={log.id}
                className="py-2.5 px-4 flex flex-wrap items-center justify-between gap-2 hover:bg-slate-50"
              >
                <div>
                  <span className="font-mono font-bold text-slate-900 mr-2">[{log.module}]</span>
                  <span className="font-bold text-slate-800">{log.action}</span>
                  <span className="text-slate-600 ml-2">— {log.details}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {log.userEmail} •{' '}
                  {log.createdAt ? new Date(log.createdAt).toLocaleString('tr-TR') : ''}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
