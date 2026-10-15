import React, { useMemo, useState } from 'react';
import {
  Truck,
  Building2,
  Plus,
  Search,
  Star,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Power,
  Trash2,
  X,
  ShieldCheck,
  Users
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { SUPPLIER_CATEGORIES } from '../../data/suppliersData';
import { VENUE_TYPES } from '../../data/venuesData';
import { ALL_81_CITIES } from '../../data/citiesData';

export function SuppliersModule({
  suppliers = [],
  leads = [],
  userProfile,
  rolePerms,
  onSuppliersMutated,
  onNotify
}) {
  const [cityFilter, setCityFilter] = useState('Tümü');
  const [categoryFilter, setCategoryFilter] = useState('Tümü');
  const [statusFilter, setStatusFilter] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [evalModalSupplier, setEvalModalSupplier] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    company: '',
    category: SUPPLIER_CATEGORIES[0],
    contactName: '',
    phone: '',
    email: '',
    city: 'İstanbul',
    extraCities: '',
    verifiedAt: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [evalForm, setEvalForm] = useState({
    score: 5,
    leadId: '',
    comment: ''
  });

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      if (statusFilter === 'active' && s.isActive === false) return false;
      if (statusFilter === 'inactive' && s.isActive !== false) return false;
      if (categoryFilter !== 'Tümü' && s.category !== categoryFilter) return false;
      if (cityFilter !== 'Tümü') {
        const cities = Array.isArray(s.serviceCities) ? s.serviceCities : [s.city];
        if (!cities.includes(cityFilter) && s.city !== cityFilter) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          (s.company || '').toLowerCase().includes(q) ||
          (s.contactName || '').toLowerCase().includes(q) ||
          (s.category || '').toLowerCase().includes(q) ||
          (s.city || '').toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [suppliers, statusFilter, categoryFilter, cityFilter, searchQuery]);

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    if (!rolePerms?.canManageSuppliersVenues) {
      onNotify('error', 'Tedarikçi ekleme yetkiniz bulunmuyor.');
      return;
    }
    setSaving(true);
    try {
      const extraList = form.extraCities
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);
      const serviceCities = Array.from(new Set([form.city, ...extraList]));
      const created = await storageService.addSupplier(
        {
          company: form.company,
          category: form.category,
          contactName: form.contactName,
          phone: form.phone,
          email: form.email,
          city: form.city,
          serviceCities,
          verifiedAt: form.verifiedAt || null,
          notes: form.notes
        },
        userProfile
      );
      setShowAddModal(false);
      setForm({
        company: '',
        category: SUPPLIER_CATEGORIES[0],
        contactName: '',
        phone: '',
        email: '',
        city: 'İstanbul',
        extraCities: '',
        verifiedAt: new Date().toISOString().split('T')[0],
        notes: ''
      });
      if (onSuppliersMutated) onSuppliersMutated();
      onNotify('success', `${created.company} gerçek tedarikçi veritabanına kaydedildi.`);
    } catch (err) {
      onNotify('error', err?.message || 'Tedarikçi kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddEvaluation = async (e) => {
    e.preventDefault();
    if (!evalModalSupplier || !rolePerms?.canManageSuppliersVenues) return;
    setSaving(true);
    try {
      await storageService.addSupplierEvaluation(
        evalModalSupplier.id,
        evalForm,
        userProfile
      );
      setEvalModalSupplier(null);
      setEvalForm({ score: 5, leadId: '', comment: '' });
      if (onSuppliersMutated) onSuppliersMutated();
      onNotify('success', 'Tedarikçi operasyon değerlendirmesi kaydedildi ve puan güncellendi.');
    } catch (err) {
      onNotify('error', err?.message || 'Değerlendirme eklenemedi.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (sup) => {
    if (!rolePerms?.canManageSuppliersVenues) return;
    try {
      await storageService.updateSupplier(
        sup.id,
        { isActive: sup.isActive === false },
        userProfile
      );
      if (onSuppliersMutated) onSuppliersMutated();
      onNotify(
        'success',
        `${sup.company} durumu ${sup.isActive === false ? 'Aktif' : 'Pasif'} olarak güncellendi.`
      );
    } catch (err) {
      onNotify('error', err?.message || 'Güncellenemedi.');
    }
  };

  const handleDeleteOrDeactivate = async (sup) => {
    if (!rolePerms?.canManageSuppliersVenues) return;
    try {
      const res = await storageService.deleteOrDeactivateSupplier(
        sup.id,
        leads,
        userProfile
      );
      if (onSuppliersMutated) onSuppliersMutated();
      if (res.deactivated) {
        onNotify(
          'info',
          `${sup.company} bir maliyet kalemine bağlı olduğu için silinmedi; veri bütünlüğü için pasifleştirildi.`
        );
      } else {
        onNotify('success', `${sup.company} kaydı silindi.`);
      }
    } catch (err) {
      onNotify('error', err?.message || 'İşlem başarısız.');
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[220px] flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tedarikçi firma, yetkili veya kategori ara..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50"
            />
          </div>

          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-slate-50"
          >
            <option value="Tümü">81 İl Filtresi (Tümü)</option>
            {ALL_81_CITIES.map((c) => (
              <option key={c.slug} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-slate-50"
          >
            <option value="Tümü">Tüm Kategoriler</option>
            {SUPPLIER_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-slate-50"
          >
            <option value="active">Aktif Tedarikçiler</option>
            <option value="inactive">Pasif Tedarikçiler</option>
            <option value="all">Tümü</option>
          </select>
        </div>

        {rolePerms?.canManageSuppliersVenues && (
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            Doğrulanmış Tedarikçi Ekle
          </button>
        )}
      </div>

      {filteredSuppliers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <Truck className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900">
            Seçili Kriterlerde Kayıtlı Tedarikçi Bulunmuyor
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            İlleri doldurmak amacıyla sahte veya örnek tedarikçi üretilmez. Yalnızca doğrulanmış kurumsal çözüm ortaklarını ekleyebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSuppliers.map((sup) => {
            const ratingInfo = storageService.computeSupplierRating(sup);
            const linkedLeadsCount = leads.filter(
              (l) =>
                Array.isArray(l.costItems) &&
                l.costItems.some((ci) => ci.supplierId === sup.id)
            ).length;

            return (
              <div
                key={sup.id}
                className={`bg-white rounded-2xl border p-5 shadow-sm flex flex-col justify-between ${
                  sup.isActive === false ? 'border-slate-200 opacity-70' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {sup.category}
                      </span>
                      <h3 className="text-sm font-extrabold text-slate-900 mt-1.5">
                        {sup.company}
                      </h3>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        sup.isActive === false
                          ? 'bg-slate-200 text-slate-600'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {sup.isActive === false ? 'Pasif' : 'Aktif'}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <div>
                      <strong>Yetkili:</strong> {sup.contactName || '-'}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> {sup.phone || '-'}
                      </span>
                      {sup.email && (
                        <span className="inline-flex items-center gap-1 truncate">
                          <Mail className="w-3.5 h-3.5 text-slate-400" /> {sup.email}
                        </span>
                      )}
                    </div>
                    <div className="flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Hizmet İlleri:</strong>{' '}
                        {Array.isArray(sup.serviceCities) && sup.serviceCities.length > 0
                          ? sup.serviceCities.join(', ')
                          : sup.city}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Doğrulanma Tarihi: {sup.verifiedAt || 'Belirtilmedi'}
                    </div>
                    {sup.notes && (
                      <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-2">
                        {sup.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      {ratingInfo.label}
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold">
                      Bağlı Teklif Kalemi: {linkedLeadsCount}
                    </span>
                  </div>

                  {rolePerms?.canManageSuppliersVenues && (
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setEvalModalSupplier(sup)}
                        className="flex-1 py-1.5 px-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold"
                      >
                        + Değerlendirme Kaydet
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(sup)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                        title={sup.isActive === false ? 'Aktifleştir' : 'Pasifleştir'}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteOrDeactivate(sup)}
                        className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600"
                        title="Sil veya Kullanımdaysa Pasifleştir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tedarikçi Ekleme Modalı */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-base font-extrabold text-slate-900">
                Yeni Doğrulanmış Tedarikçi Ekle
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddSupplier} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Firma Unvanı *</label>
                <input
                  type="text"
                  required
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  >
                    {SUPPLIER_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Merkez İl (81 İl)</label>
                  <select
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  >
                    {ALL_81_CITIES.map((c) => (
                      <option key={c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Hizmet Verilen Ek İller (Virgülle ayırın)
                </label>
                <input
                  type="text"
                  value={form.extraCities}
                  onChange={(e) => setForm({ ...form, extraCities: e.target.value })}
                  placeholder="Örn: Ankara, Antalya, Bursa"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Yetkili Kişi</label>
                  <input
                    type="text"
                    value={form.contactName}
                    onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telefon</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">E-Posta</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Doğrulanma Tarihi</label>
                  <input
                    type="date"
                    value={form.verifiedAt}
                    onChange={(e) => setForm({ ...form, verifiedAt: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Operasyon Notları</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-bold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold"
                >
                  {saving ? 'Kaydediliyor...' : 'Tedarikçiyi Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tedarikçi Değerlendirme Modalı */}
      {evalModalSupplier && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 text-xs">
            <h3 className="text-sm font-extrabold text-slate-900 mb-1">
              {evalModalSupplier.company} — Performans Değerlendirmesi
            </h3>
            <p className="text-slate-500 mb-4">
              Tedarikçi puanları yalnızca kaydedilmiş gerçek değerlendirmelerin ortalamasından hesaplanır.
            </p>
            <form onSubmit={handleAddEvaluation} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Puan (1 - 5) *</label>
                <select
                  value={evalForm.score}
                  onChange={(e) => setEvalForm({ ...evalForm, score: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                >
                  <option value={5}>5 / 5 — Kusursuz Operasyon</option>
                  <option value={4}>4 / 5 — Başarılı</option>
                  <option value={3}>3 / 5 — Orta / Geliştirilmeli</option>
                  <option value={2}>2 / 5 — Aksaklık Yaşandı</option>
                  <option value={1}>1 / 5 — Yetersiz</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">İlgili Talep / Proje</label>
                <select
                  value={evalForm.leadId}
                  onChange={(e) => setEvalForm({ ...evalForm, leadId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                >
                  <option value="">Genel Değerlendirme</option>
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.id} — {l.company}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Değerlendirme Notu *</label>
                <textarea
                  required
                  rows={3}
                  value={evalForm.comment}
                  onChange={(e) => setEvalForm({ ...evalForm, comment: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEvalModalSupplier(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-bold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold"
                >
                  Değerlendirmeyi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function VenuesModule({
  venues = [],
  leads = [],
  userProfile,
  rolePerms,
  onVenuesMutated,
  onNotify
}) {
  const [cityFilter, setCityFilter] = useState('Tümü');
  const [checkDate, setCheckDate] = useState('');
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [availabilityModalVenue, setAvailabilityModalVenue] = useState(null);
  const [saving, setSaving] = useState(false);

  const [venueForm, setVenueForm] = useState({
    name: '',
    city: 'İstanbul',
    district: '',
    address: '',
    venueType: VENUE_TYPES[0],
    starRating: '',
    verificationSource: 'Resmi Kurum / Tesis Teknik Şartnamesi',
    verifiedAt: new Date().toISOString().split('T')[0],
    contactName: '',
    phone: '',
    email: '',
    capacity: '',
    salonCount: '',
    accessibility: 'Engelli erişimine uygun asansör, rampa ve fuaye alanı',
    technicalGearText: 'Ana Sahne, Fuaye Alanı, Yük Asansörü, Jeneratör',
    hallName: 'Ana Kongre Salonu',
    hallTheater: '',
    hallBanquet: '',
    hallClassroom: '',
    image: ''
  });

  const [availForm, setAvailForm] = useState({
    date: new Date().toISOString().split('T')[0],
    status: 'teyitli_musait',
    source: 'Tesis Satış Ofisi Yazılı Teyidi',
    leadId: ''
  });

  const filteredVenues = useMemo(() => {
    return venues.filter((v) => {
      if (cityFilter !== 'Tümü' && v.city !== cityFilter) return false;
      return true;
    });
  }, [venues, cityFilter]);

  const handleSaveVenue = async (e) => {
    e.preventDefault();
    if (!rolePerms?.canManageSuppliersVenues) return;
    setSaving(true);
    try {
      const halls = venueForm.hallName
        ? [
            {
              name: venueForm.hallName,
              theater: venueForm.hallTheater ? Number(venueForm.hallTheater) : null,
              banquet: venueForm.hallBanquet ? Number(venueForm.hallBanquet) : null,
              classroom: venueForm.hallClassroom ? Number(venueForm.hallClassroom) : null
            }
          ]
        : [];
      await storageService.saveVenueToCloud(
        {
          name: venueForm.name,
          city: venueForm.city,
          district: venueForm.district,
          address: venueForm.address,
          venueType: venueForm.venueType,
          starRating: venueForm.starRating ? Number(venueForm.starRating) : null,
          verificationSource: venueForm.verificationSource,
          verifiedAt: venueForm.verifiedAt,
          contactName: venueForm.contactName,
          phone: venueForm.phone,
          email: venueForm.email,
          capacity: venueForm.capacity ? Number(venueForm.capacity) : null,
          salonCount: venueForm.salonCount ? Number(venueForm.salonCount) : null,
          accessibility: venueForm.accessibility,
          technicalGear: venueForm.technicalGearText
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          halls,
          image: venueForm.image
        },
        userProfile
      );
      setShowVenueModal(false);
      if (onVenuesMutated) onVenuesMutated();
      onNotify('success', 'Doğrulanmış mekân/kongre merkezi kaydı Firestore üzerine eklendi.');
    } catch (err) {
      onNotify('error', err?.message || 'Mekân kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAvailabilityRecord = async (e) => {
    e.preventDefault();
    if (!availabilityModalVenue || !rolePerms?.canManageSuppliersVenues) return;
    setSaving(true);
    try {
      const existing = Array.isArray(availabilityModalVenue.availabilityRecords)
        ? [...availabilityModalVenue.availabilityRecords]
        : [];
      const filtered = existing.filter((r) => (r.startDate || r.date) !== availForm.date);
      filtered.push({
        date: availForm.date,
        startDate: availForm.date,
        endDate: availForm.date,
        status: availForm.status,
        source: availForm.source,
        leadId: availForm.leadId,
        verifiedAt: new Date().toISOString().split('T')[0],
        verifiedBy: userProfile?.email || 'Yönetici'
      });

      await storageService.saveVenueToCloud(
        {
          ...availabilityModalVenue,
          availabilityRecords: filtered
        },
        userProfile
      );
      setAvailabilityModalVenue(null);
      if (onVenuesMutated) onVenuesMutated();
      onNotify('success', `${availForm.date} tarihi için resmi müsaitlik/opsiyon teyit kaydı işlendi.`);
    } catch (err) {
      onNotify('error', err?.message || 'Müsaitlik kaydı eklenemedi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-slate-50"
          >
            <option value="Tümü">Tüm Şehirler (81 İl)</option>
            {ALL_81_CITIES.map((c) => (
              <option key={c.slug} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-700">Tarih Müsaitlik Sorgula:</span>
            <input
              type="date"
              value={checkDate}
              onChange={(e) => setCheckDate(e.target.value)}
              className="px-2 py-1 rounded-lg border border-slate-300 text-xs bg-white"
            />
          </div>
        </div>

        {rolePerms?.canManageSuppliersVenues && (
          <button
            type="button"
            onClick={() => setShowVenueModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            Doğrulanmış Mekân / Otel Ekle
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredVenues.map((venue) => {
          const avail = storageService.checkVenueDateAvailability(venue, checkDate);
          const linkedLeads = leads.filter(
            (l) => l.linkedVenueId === venue.id || l.linkedVenueName === venue.name
          );

          return (
            <div
              key={venue.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {venue.venueType || 'Kongre Merkezi'}
                      </span>
                      {venue.starRating && (
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                          {venue.starRating} Yıldız (Doğrulanmış)
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1.5">
                      {venue.name}
                    </h3>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      {venue.district ? `${venue.district}, ${venue.city}` : venue.city}
                      {venue.address ? ` — ${venue.address}` : ''}
                    </div>
                  </div>
                </div>

                {/* Müsaitlik Durumu (Teyit Kaydı Yoksa Asla "Müsait" Göstermez) */}
                <div
                  className={`mt-3 p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                    avail.status === 'confirmed_available'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : avail.status === 'occupied'
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : 'bg-amber-50/70 border-amber-200 text-amber-900'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>
                      {checkDate ? `${checkDate}: ` : ''}
                      {avail.label}
                    </span>
                  </div>
                  {rolePerms?.canManageSuppliersVenues && (
                    <button
                      type="button"
                      onClick={() => setAvailabilityModalVenue(venue)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-800 text-[11px] font-bold shrink-0 hover:bg-slate-50"
                    >
                      Teyit Kaydı Gir
                    </button>
                  )}
                </div>

                {/* Kapasite & Salonlar (Bilinmiyorsa Uydurulmaz) */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">
                      Maksimum Kapasite
                    </span>
                    <span className="font-extrabold text-slate-900">
                      {venue.capacity ? `${venue.capacity} Kişi` : 'Kapasite Teyidi Gerekli'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">
                      Doğrulama Kaynağı
                    </span>
                    <span className="font-semibold text-slate-800 text-[11px]">
                      {venue.verificationSource || 'Resmi Kurum Kaydı'} ({venue.verifiedAt || '-'})
                    </span>
                  </div>
                </div>

                {Array.isArray(venue.halls) && venue.halls.length > 0 && (
                  <div className="mt-3">
                    <div className="text-[11px] font-bold text-slate-700 mb-1.5">
                      Salonlar & Oturma Düzeni Kapasiteleri:
                    </div>
                    <div className="space-y-1.5">
                      {venue.halls.map((h, i) => (
                        <div
                          key={i}
                          className="text-[11px] bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-2"
                        >
                          <span className="font-bold text-slate-900">{h.name}</span>
                          <span className="text-slate-600">
                            Tiyatro: <strong>{h.theater ?? 'Belirtilmedi'}</strong> • Banket:{' '}
                            <strong>{h.banquet ?? 'Belirtilmedi'}</strong> • Sınıf:{' '}
                            <strong>{h.classroom ?? 'Belirtilmedi'}</strong>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {venue.accessibility && (
                  <div className="mt-2.5 text-[11px] text-slate-600">
                    <strong>Erişilebilirlik:</strong> {venue.accessibility}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>
                  <strong>Bağlı Talepler / Teklifler:</strong>{' '}
                  {linkedLeads.length > 0
                    ? linkedLeads.map((l) => `${l.id} (${l.company})`).join(', ')
                    : 'Henüz bağlı talep yok'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Yeni Mekân Ekleme Modalı */}
      {showVenueModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-base font-extrabold text-slate-900">
                Doğrulanmış Mekân / Kongre Oteli Ekle
              </h3>
              <button
                type="button"
                onClick={() => setShowVenueModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveVenue} className="space-y-3.5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mekân / Otel Adı *</label>
                  <input
                    type="text"
                    required
                    value={venueForm.name}
                    onChange={(e) => setVenueForm({ ...venueForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mekân Türü</label>
                  <select
                    value={venueForm.venueType}
                    onChange={(e) => setVenueForm({ ...venueForm, venueType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  >
                    {VENUE_TYPES.map((vt) => (
                      <option key={vt} value={vt}>
                        {vt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Şehir (81 İl) *</label>
                  <select
                    value={venueForm.city}
                    onChange={(e) => setVenueForm({ ...venueForm, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  >
                    {ALL_81_CITIES.map((c) => (
                      <option key={c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">İlçe</label>
                  <input
                    type="text"
                    value={venueForm.district}
                    onChange={(e) => setVenueForm({ ...venueForm, district: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Otel Yıldız Bilgisi (Yalnızca Doğrulanmışsa)
                  </label>
                  <select
                    value={venueForm.starRating}
                    onChange={(e) => setVenueForm({ ...venueForm, starRating: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  >
                    <option value="">Kongre Merkezi / Yıldız Yok</option>
                    <option value="5">5 Yıldızlı Kongre Oteli</option>
                    <option value="4">4 Yıldızlı Kurumsal Otel</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Doğrulama Kaynağı *
                  </label>
                  <input
                    type="text"
                    required
                    value={venueForm.verificationSource}
                    onChange={(e) =>
                      setVenueForm({ ...venueForm, verificationSource: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Ana Salon Kapasitesi (Bilinmiyorsa boş bırakın)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={venueForm.capacity}
                    onChange={(e) => setVenueForm({ ...venueForm, capacity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Toplam Salon Sayısı</label>
                  <input
                    type="number"
                    min="0"
                    value={venueForm.salonCount}
                    onChange={(e) => setVenueForm({ ...venueForm, salonCount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Salon Adı</label>
                  <input
                    type="text"
                    value={venueForm.hallName}
                    onChange={(e) => setVenueForm({ ...venueForm, hallName: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tiyatro Düzeni</label>
                  <input
                    type="number"
                    value={venueForm.hallTheater}
                    onChange={(e) => setVenueForm({ ...venueForm, hallTheater: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Banket Düzeni</label>
                  <input
                    type="number"
                    value={venueForm.hallBanquet}
                    onChange={(e) => setVenueForm({ ...venueForm, hallBanquet: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sınıf Düzeni</label>
                  <input
                    type="number"
                    value={venueForm.hallClassroom}
                    onChange={(e) => setVenueForm({ ...venueForm, hallClassroom: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowVenueModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-bold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold"
                >
                  {saving ? 'Kaydediliyor...' : 'Mekânı Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tarih Müsaitlik Teyit Kaydı Modalı */}
      {availabilityModalVenue && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 text-xs">
            <h3 className="text-sm font-extrabold text-slate-900 mb-1">
              {availabilityModalVenue.name} — Tarih Müsaitlik Teyidi
            </h3>
            <p className="text-slate-500 mb-4">
              Gerçek bir rezervasyon veya tesis teyidi olmadan hiçbir tarih &ldquo;Müsait&rdquo; gösterilmez.
            </p>
            <form onSubmit={handleAddAvailabilityRecord} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tarih *</label>
                <input
                  type="date"
                  required
                  value={availForm.date}
                  onChange={(e) => setAvailForm({ ...availForm, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Teyit Durumu *</label>
                <select
                  value={availForm.status}
                  onChange={(e) => setAvailForm({ ...availForm, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                >
                  <option value="teyitli_musait">Teyitli Müsait (Yazılı Salon Teyidi Var)</option>
                  <option value="opsiyonlu">Kurumsal Opsiyonlu</option>
                  <option value="dolu">Dolu (Başka Etkinlik / Rezervasyon)</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Teyit Kaynağı / Belge Notu *
                </label>
                <input
                  type="text"
                  required
                  value={availForm.source}
                  onChange={(e) => setAvailForm({ ...availForm, source: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAvailabilityModalVenue(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-bold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold"
                >
                  Teyit Kaydını İşle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
