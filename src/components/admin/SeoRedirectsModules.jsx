import React, { useMemo, useState } from 'react';
import {
  Globe,
  Search,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  ExternalLink,
  RefreshCw,
  ArrowRightLeft,
  Plus,
  Trash2,
  X,
  ShieldAlert
} from 'lucide-react';
import { storageService } from '../../services/storageService';

export function SeoManagerModule({
  seoPages = [],
  userProfile,
  rolePerms,
  onSeoMutated,
  onNotify
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Tümü');
  const [onlyIssues, setOnlyIssues] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [verifyingPath, setVerifyingPath] = useState(null);
  const [liveCheckResult, setLiveCheckResult] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const seoIssues = useMemo(
    () => storageService.validateSeoRegistry(seoPages),
    [seoPages]
  );

  const issueMap = useMemo(() => {
    const map = {};
    seoIssues.forEach((item) => {
      map[item.path] = item.issues;
    });
    return map;
  }, [seoIssues]);

  const categories = useMemo(() => {
    const set = new Set(seoPages.map((p) => p.category).filter(Boolean));
    return ['Tümü', ...Array.from(set)];
  }, [seoPages]);

  const filteredPages = useMemo(() => {
    return seoPages.filter((p) => {
      if (categoryFilter !== 'Tümü' && p.category !== categoryFilter) return false;
      if (onlyIssues && !issueMap[p.path]) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          (p.path || '').toLowerCase().includes(q) ||
          (p.title || '').toLowerCase().includes(q) ||
          (p.h1 || '').toLowerCase().includes(q) ||
          (p.metaDesc || '').toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [seoPages, categoryFilter, onlyIssues, issueMap, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredPages.length / pageSize));
  const paginated = filteredPages.slice((page - 1) * pageSize, page * pageSize);

  const handleSaveSeoPage = async (e) => {
    e.preventDefault();
    if (!editingPage || !rolePerms?.canManageSeoRedirects) return;
    setSaving(true);
    try {
      await storageService.updateSeoPage(
        editingPage,
        {
          title: editingPage.title,
          h1: editingPage.h1,
          metaDesc: editingPage.metaDesc,
          searchIntent: editingPage.searchIntent,
          canonicalUrl: editingPage.canonicalUrl,
          isIndexed: editingPage.isIndexed
        },
        userProfile
      );
      setEditingPage(null);
      if (onSeoMutated) onSeoMutated();
      onNotify(
        'success',
        `${editingPage.path} SEO kayıtları güncellendi. Çalışma zamanı (seoService) ve prerender build çıktısına senkronize edildi.`
      );
    } catch (err) {
      onNotify('error', err?.message || 'SEO kaydı güncellenemedi.');
    } finally {
      setSaving(false);
    }
  };

  // Yayımlanan HTML'de canonical, başlık, meta ve robots değerlerini canlı doğrular
  const handleVerifyPublishedHtml = async (routeItem) => {
    setVerifyingPath(routeItem.path);
    try {
      const targetUrl = `${window.location.origin}${routeItem.path}`;
      const res = await fetch(targetUrl, { cache: 'no-store' });
      const htmlText = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');

      const liveTitle = doc.querySelector('title')?.textContent?.trim() || '';
      const liveDesc =
        doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || '';
      const liveRobots =
        doc.querySelector('meta[name="robots"]')?.getAttribute('content')?.trim() || '';
      const liveCanonical =
        doc.querySelector('link[rel="canonical"]')?.getAttribute('href')?.trim() || '';
      const liveH1 = doc.querySelector('h1')?.textContent?.trim() || '';

      setLiveCheckResult({
        path: routeItem.path,
        httpStatus: res.status,
        expectedCanonical: routeItem.canonicalUrl,
        liveCanonical,
        liveTitle,
        liveDesc,
        liveRobots,
        liveH1,
        canonicalValid:
          liveCanonical.startsWith('https://www.toplantimerkezi.com.tr') &&
          (routeItem.path === '/' ||
            liveCanonical !== 'https://www.toplantimerkezi.com.tr/')
      });
    } catch (err) {
      onNotify('error', `Canlı HTML doğrulaması başarısız: ${err?.message || 'Bağlantı hatası'}`);
    } finally {
      setVerifyingPath(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Üst SEO Denetim & Filtre Barı */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[220px] flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="URL yolu, Title, H1 veya Meta Description ara..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-slate-50"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'Tümü' ? 'Tüm Rota Kümeleri' : cat}
              </option>
            ))}
          </select>

          <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              checked={onlyIssues}
              onChange={(e) => {
                setOnlyIssues(e.target.checked);
                setPage(1);
              }}
              className="rounded border-slate-300"
            />
            Yalnızca SEO Uyarısı Olanları Göster ({seoIssues.length})
          </label>
        </div>

        <div className="text-xs font-bold text-slate-600">
          Toplam Gerçek Rota: <span className="text-slate-900">{seoPages.length}</span>
        </div>
      </div>

      {/* Canlı HTML Doğrulama Sonucu */}
      {liveCheckResult && (
        <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-md flex flex-wrap items-start justify-between gap-4 text-xs">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                HTTP {liveCheckResult.httpStatus}
              </span>
              <span className="font-mono font-bold text-amber-400">
                Canlı HTML Denetimi: {liveCheckResult.path}
              </span>
            </div>
            <div>
              <strong>Canlı Title:</strong> {liveCheckResult.liveTitle || '-'}
            </div>
            <div>
              <strong>Canlı Canonical:</strong>{' '}
              <span className="font-mono text-emerald-300">{liveCheckResult.liveCanonical || '-'}</span>
            </div>
            <div>
              <strong>Canlı Meta Robots:</strong> {liveCheckResult.liveRobots || 'index, follow'} •{' '}
              <strong>Canlı H1:</strong> {liveCheckResult.liveH1 || 'SPA / Prerender H1'}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLiveCheckResult(null)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SEO Rota Tablosu */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase">
                <th className="py-3 px-4">Rota & Küme</th>
                <th className="py-3 px-4">Title & Meta Description</th>
                <th className="py-3 px-4">H1 & Intent</th>
                <th className="py-3 px-4">Canonical & Index</th>
                <th className="py-3 px-4">Denetim</th>
                <th className="py-3 px-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginated.map((item) => {
                const issues = issueMap[item.path] || [];
                return (
                  <tr key={item.path} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900">{item.path}</div>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                        {item.category}
                      </span>
                      {item.hasCloudOverride && (
                        <span className="ml-1 inline-block px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                          Özel Kayıt
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 max-w-md">
                      <div className="font-bold text-slate-900 line-clamp-1">{item.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                        {item.metaDesc}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 line-clamp-1">{item.h1}</div>
                      <span className="text-[10px] font-bold text-slate-500">
                        Intent: {item.searchIntent}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono text-[10px] text-slate-600 truncate max-w-[220px]">
                        {item.canonicalUrl}
                      </div>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.isIndexed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {item.isIndexed ? 'INDEX (Sitemap Dahil)' : 'NOINDEX (Sitemap Hariç)'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {issues.length === 0 ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Doğrulandı
                        </span>
                      ) : (
                        <div className="space-y-1">
                          {issues.map((iss, idx) => (
                            <div
                              key={idx}
                              className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1"
                            >
                              <AlertTriangle className="w-3 h-3 shrink-0" />
                              {iss.message}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={verifyingPath === item.path}
                          onClick={() => handleVerifyPublishedHtml(item)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-[11px]"
                        >
                          {verifyingPath === item.path ? 'Kontrol...' : 'HTML Doğrula'}
                        </button>
                        {rolePerms?.canManageSeoRedirects && (
                          <button
                            type="button"
                            onClick={() => setEditingPage({ ...item })}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] inline-flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            Düzenle
                          </button>
                        )}
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
              Sayfa {page} / {totalPages}
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
      </div>

      {/* SEO Düzenleme Modalı */}
      {editingPage && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <span className="font-mono font-bold text-amber-600">{editingPage.path}</span>
                <h3 className="text-base font-extrabold text-slate-900">
                  Programmatic SEO Sayfa Yapılandırması
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingPage(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSeoPage} className="space-y-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Sayfa Başlığı (Title) *
                </label>
                <input
                  type="text"
                  required
                  value={editingPage.title || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ana Başlık (H1) *</label>
                <input
                  type="text"
                  required
                  value={editingPage.h1 || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, h1: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Meta Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingPage.metaDesc || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, metaDesc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Search Intent</label>
                  <select
                    value={editingPage.searchIntent || 'Transactional'}
                    onChange={(e) =>
                      setEditingPage({ ...editingPage, searchIntent: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  >
                    <option value="Transactional">Transactional</option>
                    <option value="Commercial Investigation">Commercial Investigation</option>
                    <option value="Local Transactional">Local Transactional</option>
                    <option value="Informational">Informational</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Index / Noindex Durumu
                  </label>
                  <select
                    value={editingPage.isIndexed ? 'index' : 'noindex'}
                    onChange={(e) =>
                      setEditingPage({
                        ...editingPage,
                        isIndexed: e.target.value === 'index'
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  >
                    <option value="index">INDEX, FOLLOW (Sitemap Dahil)</option>
                    <option value="noindex">NOINDEX, NOFOLLOW (Sitemap Hariç)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Canonical URL (https://www.toplantimerkezi.com.tr ile başlamalıdır) *
                </label>
                <input
                  type="url"
                  required
                  value={editingPage.canonicalUrl || ''}
                  onChange={(e) =>
                    setEditingPage({ ...editingPage, canonicalUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingPage(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-bold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold"
                >
                  {saving ? 'Kaydediliyor...' : 'SEO Ayarlarını Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function RedirectsModule({
  redirects = [],
  userProfile,
  rolePerms,
  onRedirectsMutated,
  onNotify
}) {
  const [form, setForm] = useState({
    oldUrl: '',
    newUrl: '',
    type: 301,
    active: true,
    description: '',
    externalConfirmed: false
  });
  const [needsExternalConfirm, setNeedsExternalConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testingId, setTestingId] = useState(null);
  const [liveRedirectCheck, setLiveRedirectCheck] = useState(null);

  const handleAddRedirect = async (e) => {
    e.preventDefault();
    if (!rolePerms?.canManageSeoRedirects) return;

    const validation = storageService.validateRedirectRule(form, redirects);
    if (!validation.valid) {
      if (validation.requiresExternalConfirmation) {
        setNeedsExternalConfirm(true);
      }
      onNotify('error', validation.error);
      return;
    }

    setSaving(true);
    try {
      await storageService.addRedirect(form, redirects, userProfile);
      setForm({
        oldUrl: '',
        newUrl: '',
        type: 301,
        active: true,
        description: '',
        externalConfirmed: false
      });
      setNeedsExternalConfirm(false);
      if (onRedirectsMutated) onRedirectsMutated();
      onNotify(
        'success',
        'Yönlendirme kuralı doğrulandı ve kaydedildi. Hosting dağıtımında firebase.json kurallarına otomatik işlenir.'
      );
    } catch (err) {
      onNotify('error', err?.message || 'Yönlendirme eklenemedi.');
    } finally {
      setSaving(false);
    }
  };

  // Canlı HTTP durum kodunu ve hedefini doğrular
  const handleVerifyLiveRedirect = async (rule) => {
    setTestingId(rule.id);
    try {
      const testUrl = `${window.location.origin}${rule.oldUrl}`;
      const res = await fetch(testUrl, { redirect: 'manual', cache: 'no-store' });
      const finalRes = await fetch(testUrl, { redirect: 'follow', cache: 'no-store' });
      const finalPath = finalRes.url.replace(window.location.origin, '');

      const isServerRedirected =
        res.type === 'opaqueredirect' ||
        res.status === 301 ||
        res.status === 302 ||
        finalPath === rule.newUrl;

      const checkRecord = {
        oldUrl: rule.oldUrl,
        expectedTarget: rule.newUrl,
        expectedType: rule.type,
        observedFinalUrl: finalRes.url,
        observedStatus: res.status || (isServerRedirected ? rule.type : finalRes.status),
        isServerLive: isServerRedirected
      };
      setLiveRedirectCheck(checkRecord);

      if (!rule.isSystem && rolePerms?.canManageSeoRedirects) {
        await storageService.updateRedirect(
          rule.id,
          {
            lastVerifiedAt: new Date().toISOString(),
            lastHttpStatus: checkRecord.observedStatus,
            lastLocationHeader: finalPath,
            deploymentStatus: isServerRedirected ? 'deployed_live' : 'saved_in_db'
          },
          userProfile
        );
        if (onRedirectsMutated) onRedirectsMutated();
      }
    } catch (err) {
      onNotify('error', `Canlı yönlendirme testi hatası: ${err?.message || 'Bağlantı hatası'}`);
    } finally {
      setTestingId(null);
    }
  };

  const handleDeleteRedirect = async (rule) => {
    if (rule.isSystem) {
      onNotify('error', 'Temel sistem yönlendirmesi silinemez.');
      return;
    }
    try {
      await storageService.deleteRedirect(rule.id, userProfile);
      if (onRedirectsMutated) onRedirectsMutated();
      onNotify('success', `${rule.oldUrl} yönlendirme kuralı silindi.`);
    } catch (err) {
      onNotify('error', err?.message || 'Silinemedi.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Yeni Yönlendirme Ekleme Formu */}
      {rolePerms?.canManageSeoRedirects && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-extrabold text-slate-900 mb-1">
            Yeni 301 / 302 Yönlendirme Kuralı Ekle (Döngü & Çakışma Korumalı)
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Kendine yönlendirme, döngüsel zincir (A → B → A) ve kritik sistem rotaları otomatik engellenir.
          </p>

          <form onSubmit={handleAddRedirect} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kaynak Yol (Source) *</label>
                <input
                  type="text"
                  required
                  value={form.oldUrl}
                  onChange={(e) => setForm({ ...form, oldUrl: e.target.value })}
                  placeholder="/eski-sayfa-adresi"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Hedef URL (Target) *</label>
                <input
                  type="text"
                  required
                  value={form.newUrl}
                  onChange={(e) => setForm({ ...form, newUrl: e.target.value })}
                  placeholder="/bayi-toplantisi-organizasyonu"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tür (301 / 302)</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                >
                  <option value={301}>301 — Kalıcı Yönlendirme</option>
                  <option value={302}>302 — Geçici Yönlendirme</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Açıklama</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Neden yönlendirildi?"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold inline-flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  {saving ? 'Ekleniyor...' : 'Kuralı Kaydet'}
                </button>
              </div>
            </div>

            {needsExternalConfirm && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 flex items-center gap-2 text-xs text-amber-900 font-bold">
                <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.externalConfirmed}
                    onChange={(e) =>
                      setForm({ ...form, externalConfirmed: e.target.checked })
                    }
                  />
                  Dış Alan Adı (External Domain) Yönlendirmesini Açıkça Onaylıyorum
                </label>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Canlı HTTP Test Sonucu */}
      {liveRedirectCheck && (
        <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-md flex items-center justify-between gap-4 text-xs">
          <div>
            <span className="font-mono font-bold text-amber-400">
              Canlı HTTP Yönlendirme Testi: {liveRedirectCheck.oldUrl}
            </span>
            <div className="mt-1">
              Beklenen Hedef: <strong>{liveRedirectCheck.expectedTarget}</strong> ({liveRedirectCheck.expectedType}) • Gözlemlenen Son URL:{' '}
              <strong className="text-emerald-400">{liveRedirectCheck.observedFinalUrl}</strong>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLiveRedirectCheck(null)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Yönlendirme Kuralları Tablosu */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase">
                <th className="py-3 px-4">Kaynak Yol</th>
                <th className="py-3 px-4">Hedef URL</th>
                <th className="py-3 px-4">Tür & Aktiflik</th>
                <th className="py-3 px-4">Dağıtım Durumu (DB vs Canlı Hosting)</th>
                <th className="py-3 px-4">Açıklama</th>
                <th className="py-3 px-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {redirects.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{r.oldUrl}</td>
                  <td className="py-3 px-4 font-mono text-emerald-700 font-bold">{r.newUrl}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-400 font-bold text-[10px]">
                      {r.type}
                    </span>
                    <span className="ml-2 text-[11px] font-semibold text-slate-600">
                      {r.active !== false ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {r.deploymentStatus === 'deployed_live' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" /> Canlı Hosting Katmanında Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                        Veritabanına Kaydedildi (Hosting Senkronizasyonu Bekliyor)
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{r.description || '-'}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={testingId === r.id}
                        onClick={() => handleVerifyLiveRedirect(r)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 font-semibold text-[11px]"
                      >
                        {testingId === r.id ? 'Test...' : 'Canlı HTTP Doğrula'}
                      </button>
                      {!r.isSystem && rolePerms?.canManageSeoRedirects && (
                        <button
                          type="button"
                          onClick={() => handleDeleteRedirect(r)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
