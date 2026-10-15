import {
  db,
  auth,
  collection,
  doc,
  getDocs,
  getDoc,
  getDocFromServer,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  isFirebaseInitialized,
  verifyFirestoreConnection
} from './firebase';
import { notificationService } from './notificationService';
import { SUPPLIER_CATEGORIES } from '../data/suppliersData';
import { VENUES, VENUE_TYPES } from '../data/venuesData';
import { PROJECTS } from '../data/projectsData';
import { BLOG_POSTS } from '../data/blogData';
import { SEO_CLUSTERS, TOPIC_HUBS } from '../data/seoClustersData';
import { ORGANIZATIONS } from '../data/organizationsData';
import { SERVICES } from '../data/servicesData';
import { INDUSTRIES } from '../data/industryData';
import { ALL_81_CITIES } from '../data/citiesData';
import { SUPPORTED_LANGUAGES, INTERNATIONAL_LANG_CODES, I18N_CONTENT } from '../data/i18nData';

/**
 * 11 Ana CRM Pipeline Aşaması
 */
export const PIPELINE_STAGES = [
  'Yeni Talep',
  'İlk Görüşme',
  'İhtiyaç Analizi',
  'Mekân Araştırması',
  'Maliyetlendirme',
  'Teklif Hazırlanıyor',
  'Teklif Gönderildi',
  'Revizyon',
  'Onaylandı',
  'Operasyon Hazırlığı',
  'Tamamlandı'
];

/**
 * Ana 11 aşamadan bağımsız sonuç durumları
 */
export const OUTCOME_STATUSES = [
  { id: 'active', label: 'Aktif Süreçte' },
  { id: 'lost', label: 'Kaybedildi' },
  { id: 'cancelled', label: 'İptal Edildi' },
  { id: 'archived', label: 'Arşivlendi' }
];

/**
 * 7 Standart Maliyet Kalemi Kategorisi + Ek Kalem Desteği
 */
export const COST_ITEM_CATEGORIES = [
  { key: 'venue', category: 'Mekân', defaultDesc: 'Mekân & Salon Tahsisi (Ana Salon ve Fuaye)', defaultUnit: 'Gün' },
  { key: 'catering', category: 'Catering', defaultDesc: 'Kurumsal Catering, Coffee Break & Banket İkramları', defaultUnit: 'Kişi' },
  { key: 'stage', category: 'Sahne', defaultDesc: 'Sahne, Modüler Podyum, Kürsü & Kurumsal Dekorasyon', defaultUnit: 'Paket' },
  { key: 'led', category: 'LED Ekran', defaultDesc: 'Yüksek Çözünürlüklü LED Ekran & Görüntü Rejisi', defaultUnit: 'm²' },
  { key: 'soundLight', category: 'Ses/Işık', defaultDesc: 'Line Array Ses Sistemi, Mikrofon & Robot Işık Prodüksiyonu', defaultUnit: 'Paket' },
  { key: 'staff', category: 'Personel', defaultDesc: 'Kayıt, Karşılama Hostesi, Teknik Ekip & Operasyon Personeli', defaultUnit: 'Kişi' },
  { key: 'logistics', category: 'Lojistik', defaultDesc: 'Ulaşım, Nakliye, Konaklama & Saha Lojistik Yönetimi', defaultUnit: 'Sefer' }
];

export const ROLE_DEFINITIONS = {
  superadmin: {
    id: 'superadmin',
    label: 'Süperadmin',
    description: 'Tüm modüller, kullanıcı/rol yönetimi, bildirim sırları, SEO/yönlendirme ve veri dışa aktarma tam yetkisi.',
    canWriteLeads: true,
    canDeleteLeads: true,
    canManagePricing: true,
    canManageSuppliersVenues: true,
    canManageSeoRedirects: true,
    canManageSettingsUsers: true
  },
  sales: {
    id: 'sales',
    label: 'Satış Uzmanı',
    description: 'Dashboard, CRM Pipeline, Maliyetlendirme, PDF Teklif oluşturma ve müşteri takibi yetkisi.',
    canWriteLeads: true,
    canDeleteLeads: false,
    canManagePricing: true,
    canManageSuppliersVenues: true,
    canManageSeoRedirects: true,
    canManageSettingsUsers: false
  },
  operations: {
    id: 'operations',
    label: 'Operasyon Yöneticisi',
    description: 'CRM Pipeline aşama takibi, Tedarikçi Veritabanı ve Mekân/Otel yönetimi yetkisi.',
    canWriteLeads: true,
    canDeleteLeads: false,
    canManagePricing: false,
    canManageSuppliersVenues: true,
    canManageSeoRedirects: false,
    canManageSettingsUsers: false
  },
  viewer: {
    id: 'viewer',
    label: 'Yalnızca Görüntüleme',
    description: 'Tüm modüllerde salt okunur inceleme yetkisi; kayıt oluşturamaz, düzenleyemez veya silemez.',
    canWriteLeads: false,
    canDeleteLeads: false,
    canManagePricing: false,
    canManageSuppliersVenues: false,
    canManageSeoRedirects: false,
    canManageSettingsUsers: false
  }
};

export const INITIAL_SETTINGS = {
  companyName: 'Toplantı Merkezi Kurumsal Organizasyon A.Ş.',
  brandTitle: 'Toplantı Merkezi',
  domain: 'www.toplantimerkezi.com.tr',
  slogan: "Türkiye'nin Her Yerinde, Tek Merkezden Organizasyon.",
  subSlogan: 'Toplantıdan organizasyona, tüm süreç tek merkezden.',
  phone: '+90 532 055 09 45',
  whatsappPhone: '+90 532 055 09 45',
  whatsappDisplay: '0532 055 09 45',
  email: 'info@toplantimerkezi.com.tr',
  address: 'Büyükdere Cad. No:199 Levent / Maslak Plaza, Levent, Beşiktaş, İstanbul',
  googleAnalyticsId: 'G-SC8K0G30KL',
  gtmId: 'GTM-TM81TR',
  metaPixelId: '',
  requireSecondaryPin: false,
  adminPin: ''
};

// Bellek içi çalışma zamanı durumu (localStorage KESİNLİKLE kullanılmaz)
const memoryStore = {
  settings: { ...INITIAL_SETTINGS },
  seoOverrides: {},
  rateLimitTimestamps: []
};

/**
 * Kriptografik rastgele dize üretici
 */
function generateRandomToken(length = 16) {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  const arr = new Uint32Array(length);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(arr);
  } else {
    for (let i = 0; i < length; i++) {
      arr[i] = Math.floor(Math.random() * 4294967295);
    }
  }
  let out = '';
  for (let i = 0; i < length; i++) {
    out += alphabet[arr[i] % alphabet.length];
  }
  return out;
}

/**
 * Varsayılan 7 maliyet kalemini oluşturur (Eski costBreakdown varsa dönüştürür)
 */
export function buildInitialCostItems(lead = {}) {
  if (Array.isArray(lead.costItems) && lead.costItems.length > 0) {
    return lead.costItems.map((item, idx) => {
      const qty = Math.max(0, Number(item.quantity) || 0);
      const uCost = Math.max(0, Number(item.unitCost) || 0);
      const tCost = Math.round(qty * uCost * 100) / 100;
      return {
        id: item.id || `ci-${idx + 1}`,
        category: item.category || 'Ek Kalem',
        description: item.description || item.category || 'Hizmet Kalemi',
        supplierId: item.supplierId || '',
        supplierName: item.supplierName || '',
        venueId: item.venueId || '',
        venueName: item.venueName || '',
        quantity: qty,
        unit: item.unit || 'Paket',
        unitCost: uCost,
        totalCost: tCost,
        targetMargin: item.targetMargin !== undefined && item.targetMargin !== '' ? Number(item.targetMargin) : 25,
        salePrice: Math.max(0, Number(item.salePrice) || 0),
        vatRate: item.vatRate !== undefined ? Number(item.vatRate) : 20,
        zeroCostConfirmed: Boolean(item.zeroCostConfirmed)
      };
    });
  }

  const legacyCb = lead.costBreakdown || {};
  return COST_ITEM_CATEGORIES.map((cat, idx) => {
    const legacyCost = Math.max(0, Number(legacyCb[cat.key]) || 0);
    return {
      id: `ci-${cat.key}-${idx + 1}`,
      category: cat.category,
      description: cat.defaultDesc,
      supplierId: '',
      supplierName: '',
      venueId: '',
      venueName: '',
      quantity: 1,
      unit: cat.defaultUnit,
      unitCost: legacyCost,
      totalCost: legacyCost,
      targetMargin: 25,
      salePrice: 0,
      vatRate: 20,
      zeroCostConfirmed: false
    };
  });
}

/**
 * Hedef kâr marjından satış tutarı hesaplar:
 * Satış Tutarı = Maliyet / (1 - Hedef Marj / 100)
 * Geçersiz marjları (< 0 veya >= 100) reddeder.
 */
export function calculateSalePriceFromTargetMargin(totalCost, targetMarginPercent) {
  const cost = Number(totalCost);
  const margin = Number(targetMarginPercent);

  if (!Number.isFinite(cost) || cost < 0) {
    return { valid: false, salePrice: 0, error: 'Maliyet tutarı negatif olamaz.' };
  }
  if (!Number.isFinite(margin) || margin < 0 || margin >= 100) {
    return {
      valid: false,
      salePrice: 0,
      error: 'Hedef kâr marjı %0 ile %99,9 arasında olmalıdır. Satış = Maliyet / (1 - Marj) formülünde %100 ve üzeri marj matematiksel olarak geçersizdir.'
    };
  }
  const divisor = 1 - margin / 100;
  const salePrice = Math.round((cost / divisor) * 100) / 100;
  return { valid: true, salePrice, error: null };
}

/**
 * Müşteri paylaşımı için güvenli özet dokümanını üretir.
 * İç maliyetler, tedarikçi bilgileri, yönetici notları ve kâr marjı KESİNLİKLE dahil edilmez.
 */
export function buildPublicProposalSummary(lead) {
  const fin = storageService.calculateLeadFinancials(lead);
  const rawItems = Array.isArray(lead.costItems) ? lead.costItems : buildInitialCostItems(lead);

  // Yalnızca müşteriye satışı olan veya kapsama dahil edilen kalemlerin müşteri-güvenli alanları
  const customerLineItems = rawItems
    .filter(item => Number(item.salePrice) > 0)
    .map((item, idx) => ({
      no: String(idx + 1).padStart(2, '0'),
      category: item.category || 'Hizmet',
      description: item.description || item.category || 'Kurumsal Organizasyon Hizmeti',
      quantity: Number(item.quantity) || 1,
      unit: item.unit || 'Paket',
      unitSalePriceExclVat: (Number(item.quantity) || 1) > 0
        ? Math.round((Number(item.salePrice) / (Number(item.quantity) || 1)) * 100) / 100
        : Number(item.salePrice) || 0,
      salePriceExclVat: Number(item.salePrice) || 0,
      vatRate: item.vatRate !== undefined ? Number(item.vatRate) : 20
    }));

  const stageToPublicLabel = {
    'Yeni Talep': 'Talep Alındı — Ön İncelemede',
    'İlk Görüşme': 'İlk Görüşme & Koordinasyon',
    'İhtiyaç Analizi': 'Teknik & Operasyonel İhtiyaç Analizi',
    'Mekân Araştırması': 'Mekân & Salon Alternatifleri Araştırılıyor',
    'Maliyetlendirme': 'Bütçe & Teklif Çalışması Hazırlanıyor',
    'Teklif Hazırlanıyor': 'Resmi Teklif Dosyası Hazırlanıyor',
    'Teklif Gönderildi': 'Resmi Teklif Sunuldu — Onayınızı Bekliyor',
    'Revizyon': 'Revizyon Talebiniz Üzerinde Çalışılıyor',
    'Onaylandı': 'Teklif Onaylandı — Sözleşme & Planlama Aşamasında',
    'Operasyon Hazırlığı': 'Saha & Teknik Operasyon Hazırlığında',
    'Tamamlandı': 'Organizasyon Başarıyla Tamamlandı'
  };

  const nowMs = Date.now();
  const validityDays = Number(lead.validityDays) || 15;
  const expiresAt = lead.expiresAt || (nowMs + Math.max(validityDays, 30) * 24 * 60 * 60 * 1000);

  return {
    leadId: lead.id,
    accessToken: lead.accessToken,
    company: lead.company || '',
    contactName: lead.contactName || '',
    title: lead.title || 'Yetkili',
    organizationType: lead.organizationType || '',
    city: lead.city || '',
    district: lead.district || '',
    linkedVenueName: lead.linkedVenueName || '',
    targetDate: lead.targetDate || '',
    endDate: lead.endDate || '',
    isMultiDay: Boolean(lead.isMultiDay),
    attendees: Number(lead.attendees) || 0,
    stage: PIPELINE_STAGES.includes(lead.stage) ? lead.stage : 'Yeni Talep',
    outcomeStatus: lead.outcomeStatus || 'active',
    publicStatusLabel: stageToPublicLabel[lead.stage] || 'Kurumsal Değerlendirmede',
    currentVersion: Number(lead.currentVersion) || 0,
    currentRevisionLabel: lead.currentRevisionLabel || 'Taslak (Henüz Teklif Yayınlanmadı)',
    proposalSentAt: lead.proposalSentAt || null,
    validityDays,
    validUntil: lead.validUntil || new Date(nowMs + validityDays * 86400000).toISOString().split('T')[0],
    expiresAt,
    customerLineItems,
    grossSaleExclVat: fin.grossSaleExclVat,
    discountExclVat: fin.discountExclVat,
    netSaleExclVat: fin.netSaleExclVat,
    vatAmount: fin.vatAmount,
    grandTotalInclVat: fin.grandTotalInclVat,
    includedScope: lead.includedScope || 'Teklif tablosunda belirtilen tüm mekân, sahne, LED ekran, ses/ışık, catering ve teknik operasyon kalemleri dahildir.',
    excludedScope: lead.excludedScope || 'Tabloda açıkça belirtilmeyen kişisel harcamalar, ekstra sanatçı/konaklama talepleri ve resmi harçlar kapsam dışıdır.',
    paymentPlan: lead.paymentPlan || '%50 sözleşme onayında avans, %50 organizasyon tamamlandığında fatura karşılığı kurumsal banka havalesi/EFT.',
    terms: lead.terms || `Bu teklif düzenlenme tarihinden itibaren ${validityDays} gün süreyle geçerlidir. Salon ve teknik ekipman müsaitliği kesin onay anındaki duruma bağlıdır.`,
    customerResponse: lead.customerResponse || {
      status: 'pending',
      versionNumber: Number(lead.currentVersion) || 0,
      note: '',
      respondedAt: null
    },
    customerResponseHistory: Array.isArray(lead.customerResponseHistory) ? lead.customerResponseHistory : [],
    updatedAt: new Date().toISOString()
  };
}

export const storageService = {
  isCloudConnected: () => isFirebaseInitialized && !!db,
  verifyConnection: verifyFirestoreConnection,

  // ==========================================
  // DENETİM GÜNLÜĞÜ (AUDIT LOGS)
  // ==========================================
  logAuditAction: async ({ action, module, entityId, details = '', actor = null }) => {
    if (!db) return;
    if (/e2etest/i.test(String(entityId || ''))) return;
    try {
      const currentUser = auth?.currentUser;
      await addDoc(collection(db, 'audit_logs'), {
        action,
        module,
        entityId: String(entityId || '-'),
        details: String(details || ''),
        userUid: actor?.uid || currentUser?.uid || 'anonymous',
        userEmail: actor?.email || currentUser?.email || 'system',
        userRole: actor?.role || 'staff',
        createdAt: new Date().toISOString(),
        serverTimestamp: serverTimestamp()
      });
    } catch {
      // Denetim kaydı hatası ana işlemi kesmemeli
    }
  },

  fetchAuditLogs: async (maxCount = 100) => {
    if (!db) return [];
    try {
      const q = query(collection(db, 'audit_logs'), orderBy('createdAt', 'desc'), limit(maxCount));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch {
      return [];
    }
  },

  // ==========================================
  // KULLANICI & ROL YÖNETİMİ (tm_users)
  // ==========================================
  resolveCurrentUserRole: async (firebaseUser) => {
    if (!firebaseUser || !db) return null;
    const emailLower = (firebaseUser.email || '').toLowerCase();
    const bootstrapAdmins = [
      'yonetim@toplantimerkezi.com.tr',
      'info@toplantimerkezi.com.tr',
      'cebokar@gmail.com',
      'cebrailkara@gmail.com',
      'cebo@me.com'
    ];

    try {
      const userRef = doc(db, 'tm_users', firebaseUser.uid);
      const snap = await getDocFromServer(userRef).catch(() => getDoc(userRef));
      if (snap && snap.exists()) {
        const data = snap.data();
        if (data.isActive === false) {
          return { uid: firebaseUser.uid, email: firebaseUser.email, role: 'disabled', isActive: false };
        }
        return {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: data.name || firebaseUser.displayName || emailLower.split('@')[0],
          role: data.role || 'viewer',
          isActive: true
        };
      }

      // Bootstrap SuperAdmin ise otomatik tm_users kaydını oluştur
      if (bootstrapAdmins.includes(emailLower)) {
        const bootstrapProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || 'Kurumsal Süperadmin',
          role: 'superadmin',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await setDoc(userRef, bootstrapProfile, { merge: true });
        return bootstrapProfile;
      }
    } catch {
      if (bootstrapAdmins.includes(emailLower)) {
        return {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || 'Kurumsal Süperadmin',
          role: 'superadmin',
          isActive: true
        };
      }
    }

    return null;
  },

  fetchTmUsers: async () => {
    if (!db) return [];
    try {
      const snap = await getDocs(collection(db, 'tm_users'));
      return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
    } catch {
      return [];
    }
  },

  saveTmUser: async (uid, userData, actor = null) => {
    if (!db) throw new Error('Firestore bağlantısı mevcut değil.');
    if (!uid || !userData.email) throw new Error('Kullanıcı UID ve E-posta zorunludur.');
    const role = ROLE_DEFINITIONS[userData.role] ? userData.role : 'viewer';
    const record = {
      uid,
      email: String(userData.email).trim().toLowerCase(),
      name: String(userData.name || '').trim() || 'Yetkili Kullanıcı',
      role,
      isActive: userData.isActive !== false,
      updatedAt: new Date().toISOString(),
      updatedBy: actor?.email || auth?.currentUser?.email || 'superadmin'
    };
    await setDoc(doc(db, 'tm_users', uid), record, { merge: true });
    await storageService.logAuditAction({
      action: 'user_role_updated',
      module: 'settings',
      entityId: uid,
      details: `${record.email} kullanıcısına '${role}' rolü atandı (Aktif: ${record.isActive}).`,
      actor
    });
    return record;
  },

  // ==========================================
  // 1. LEADS (TEKLİF TALEPLERİ — GERÇEK FIRESTORE)
  // ==========================================
  generateLeadId: () => {
    return `TLP-${new Date().getFullYear()}-${generateRandomToken(6).toUpperCase()}`;
  },

  generateAccessToken: () => {
    return generateRandomToken(20);
  },

  checkLeadRateLimit: () => {
    const now = Date.now();
    memoryStore.rateLimitTimestamps = memoryStore.rateLimitTimestamps.filter(ts => now - ts < 60 * 60 * 1000);
    const lastTs = memoryStore.rateLimitTimestamps.length > 0
      ? memoryStore.rateLimitTimestamps[memoryStore.rateLimitTimestamps.length - 1]
      : 0;
    if (now - lastTs < 15 * 1000) {
      const waitSeconds = Math.ceil((15 * 1000 - (now - lastTs)) / 1000);
      return {
        allowed: false,
        reason: `Çok hızlı ardışık talep gönderimi engellendi. Lütfen ${waitSeconds} saniye bekleyip tekrar deneyin.`
      };
    }
    if (memoryStore.rateLimitTimestamps.length >= 10) {
      return {
        allowed: false,
        reason: 'Saatlik teklif talebi limitine ulaşıldı. Lütfen doğrudan 0532 055 09 45 hattımızdan bize ulaşın.'
      };
    }
    return { allowed: true };
  },

  normalizeLead: (raw) => {
    if (!raw) return null;
    const normalizedStage = raw.stage === 'Organizasyon Gerçekleşti'
      ? 'Tamamlandı'
      : (PIPELINE_STAGES.includes(raw.stage) ? raw.stage : 'Yeni Talep');

    return {
      ...raw,
      stage: normalizedStage,
      outcomeStatus: raw.outcomeStatus || 'active',
      assignedTo: raw.assignedTo || '',
      followUpDate: raw.followUpDate || '',
      linkedVenueId: raw.linkedVenueId || '',
      linkedVenueName: raw.linkedVenueName || '',
      discountAmount: Math.max(0, Number(raw.discountAmount) || 0),
      vatRate: raw.vatRate !== undefined ? Number(raw.vatRate) : 20,
      validityDays: Number(raw.validityDays) || 15,
      currentVersion: Number(raw.currentVersion) || 0,
      currentRevisionLabel: raw.currentRevisionLabel || 'Taslak',
      recordVersion: Number(raw.recordVersion) || 1,
      costItems: buildInitialCostItems(raw),
      proposals: Array.isArray(raw.proposals) ? raw.proposals : [],
      stageHistory: Array.isArray(raw.stageHistory) ? raw.stageHistory : []
    };
  },

  fetchLeadsFromCloud: async () => {
    if (!db) throw new Error('Firestore bağlantısı aktif değil.');
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => storageService.normalizeLead({
      ...docSnap.data(),
      id: docSnap.data().id || docSnap.id,
      firebaseDocId: docSnap.id
    }));
  },

  subscribeToLeads: (callback, onError) => {
    if (!db) {
      if (onError) onError(new Error('Firestore bağlantısı aktif değil.'));
      return () => {};
    }
    try {
      const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(
        q,
        { includeMetadataChanges: true },
        (snapshot) => {
          const cloudLeads = snapshot.docs.map(docSnap => storageService.normalizeLead({
            ...docSnap.data(),
            id: docSnap.data().id || docSnap.id,
            firebaseDocId: docSnap.id
          }));
          callback(cloudLeads, {
            fromCache: snapshot.metadata.fromCache,
            hasPendingWrites: snapshot.metadata.hasPendingWrites,
            syncedAt: new Date().toISOString()
          });
        },
        (err) => {
          if (onError) onError(err);
        }
      );
      return unsubscribe;
    } catch (err) {
      if (onError) onError(err);
      return () => {};
    }
  },

  /**
   * Yeni teklif talebi ekler (Hem web formlarından hem CRM içinden)
   * Sahte başlangıç satış tutarı (quotedPrice) KESİNLİKLE atanmaz (0 olarak başlar).
   */
  addLead: async (leadData, options = { bypassRateLimit: false, actor: null }) => {
    if (!options?.bypassRateLimit) {
      const rateCheck = storageService.checkLeadRateLimit();
      if (!rateCheck.allowed) {
        throw new Error(rateCheck.reason);
      }
    }

    if (!db) {
      throw new Error('Veritabanı bağlantısı kurulamadı. Lütfen internet bağlantınızı kontrol edin.');
    }

    const company = String(leadData.company || '').trim();
    const contactName = String(leadData.contactName || '').trim();
    const phone = String(leadData.phone || '').trim();
    if (company.length < 2 || contactName.length < 2 || phone.length < 7) {
      throw new Error('Firma adı, yetkili kişi ve geçerli telefon numarası zorunludur.');
    }

    const newId = leadData.id || storageService.generateLeadId();
    const accessToken = leadData.accessToken || storageService.generateAccessToken();
    const nowIso = new Date().toISOString();
    const validityDays = Number(leadData.validityDays) || 15;
    const expiresAt = Date.now() + 45 * 24 * 60 * 60 * 1000; // 45 gün güvenli erişim süresi

    const initialCostItems = buildInitialCostItems(leadData);

    const newLead = {
      id: newId,
      accessToken,
      expiresAt,
      createdAt: nowIso,
      updatedAt: nowIso,
      company,
      contactName,
      title: String(leadData.title || 'Yetkili').trim(),
      phone,
      email: String(leadData.email || '').trim(),
      organizationType: String(leadData.organizationType || 'Kurumsal Organizasyon').trim(),
      city: String(leadData.city || 'İstanbul').trim(),
      district: String(leadData.district || '').trim(),
      venueNeeded: leadData.venueNeeded !== false,
      linkedVenueId: leadData.linkedVenueId || '',
      linkedVenueName: leadData.linkedVenueName || '',
      targetDate: leadData.targetDate || '',
      endDate: leadData.endDate || leadData.targetDate || '',
      isMultiDay: Boolean(leadData.isMultiDay),
      attendees: Math.max(1, Number(leadData.attendees) || 1),
      budgetRange: String(leadData.budgetRange || 'Belirtilmedi').trim(),
      assignedTo: String(leadData.assignedTo || '').trim(),
      followUpDate: String(leadData.followUpDate || '').trim(),
      notes: String(leadData.notes || '').trim(),
      language: String(leadData.language || 'tr').trim(),
      languageName: String(leadData.languageName || 'Türkçe').trim(),
      requirements: Array.isArray(leadData.requirements) ? leadData.requirements : [],
      stage: 'Yeni Talep',
      outcomeStatus: 'active',
      outcomeReason: '',
      costItems: initialCostItems,
      discountAmount: 0,
      quotedPrice: 0,
      vatRate: 20,
      validityDays,
      validUntil: new Date(Date.now() + validityDays * 86400000).toISOString().split('T')[0],
      includedScope: 'Mekân tahsisi, sahne ve dekor kurulumu, LED ekran, profesyonel ses-ışık sistemleri, catering ve operasyon yönetimi.',
      excludedScope: 'Teklifte açıkça belirtilmeyen ek talepler ve kişisel harcamalar kapsam dışıdır.',
      paymentPlan: '%50 sözleşme onayında avans, %50 organizasyon bitiminde fatura karşılığı.',
      terms: `Teklifimiz düzenlenme tarihinden itibaren ${validityDays} gün geçerlidir.`,
      currentVersion: 0,
      currentRevisionLabel: 'Taslak',
      proposals: [],
      stageHistory: [
        {
          fromStage: null,
          toStage: 'Yeni Talep',
          fromOutcome: null,
          toOutcome: 'active',
          changedByEmail: options?.actor?.email || 'web_form',
          changedByName: options?.actor?.name || contactName,
          timestamp: nowIso,
          note: 'Talep oluşturuldu'
        }
      ],
      customerResponse: {
        status: 'pending',
        versionNumber: 0,
        note: '',
        respondedAt: null
      },
      customerResponseHistory: [],
      isTestRecord: Boolean(leadData.isTestRecord),
      recordVersion: 1,
      serverTimestamp: serverTimestamp()
    };

    memoryStore.rateLimitTimestamps.push(Date.now());

    // 1. Ana lead kaydını Firestore'a yaz
    await setDoc(doc(db, 'leads', newId), newLead);

    // 2. Müşteri güvenli takip özetini (/public_proposals/{id}_{accessToken}) oluştur
    const publicSummary = buildPublicProposalSummary(newLead);
    const accessKey = `${newId}_${accessToken}`;
    await setDoc(doc(db, 'public_proposals', accessKey), publicSummary);

    // 3. Yapılandırılmışsa yeni talep bildirimini tetikle
    try {
      await notificationService.dispatchEventNotification({
        eventType: 'new_lead',
        lead: newLead,
        versionKey: 'v0',
        actorEmail: options?.actor?.email || 'web_form'
      });
    } catch {
      // Bildirim hatası talep kaydını engellemez
    }

    return storageService.normalizeLead(newLead);
  },

  /**
   * Eşzamanlı düzenleme korumalı (Optimistic Concurrency) Lead Güncelleme
   */
  updateLead: async (id, updates, options = { expectedRecordVersion: null, actor: null }) => {
    if (!db) throw new Error('Firestore bağlantısı aktif değil.');
    const leadRef = doc(db, 'leads', id);

    let updatedDocData = null;

    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(leadRef);
      if (!snap.exists()) {
        throw new Error(`"${id}" numaralı talep sunucuda bulunamadı.`);
      }
      const current = snap.data();
      const currentVersion = Number(current.recordVersion) || 1;

      if (
        options?.expectedRecordVersion !== null &&
        options?.expectedRecordVersion !== undefined &&
        currentVersion !== Number(options.expectedRecordVersion)
      ) {
        const conflictErr = new Error(
          `Eşzamanlı düzenleme çakışması: Bu kayıt başka bir kullanıcı tarafından güncellendi (Sunucu versiyonu: v${currentVersion}). Veri kaybını önlemek için lütfen sayfayı yenileyin.`
        );
        conflictErr.code = 'CONCURRENCY_CONFLICT';
        throw conflictErr;
      }

      const nowIso = new Date().toISOString();
      const nextStageHistory = Array.isArray(current.stageHistory) ? [...current.stageHistory] : [];

      const stageChanged = updates.stage && updates.stage !== current.stage;
      const outcomeChanged = updates.outcomeStatus && updates.outcomeStatus !== (current.outcomeStatus || 'active');

      if (stageChanged || outcomeChanged) {
        nextStageHistory.push({
          fromStage: current.stage || 'Yeni Talep',
          toStage: updates.stage || current.stage || 'Yeni Talep',
          fromOutcome: current.outcomeStatus || 'active',
          toOutcome: updates.outcomeStatus || current.outcomeStatus || 'active',
          changedByUid: options?.actor?.uid || auth?.currentUser?.uid || 'staff',
          changedByEmail: options?.actor?.email || auth?.currentUser?.email || 'staff',
          changedByName: options?.actor?.name || auth?.currentUser?.displayName || 'Yönetici',
          timestamp: nowIso,
          note: updates.stageChangeNote || ''
        });
      }

      const merged = {
        ...current,
        ...updates,
        stageHistory: nextStageHistory,
        recordVersion: currentVersion + 1,
        updatedAt: nowIso
      };

      transaction.set(leadRef, merged);
      updatedDocData = merged;
    });

    // Müşteri güvenli özet dokümanını da senkronize et
    if (updatedDocData && updatedDocData.accessToken) {
      try {
        const accessKey = `${updatedDocData.id}_${updatedDocData.accessToken}`;
        const publicSummary = buildPublicProposalSummary(updatedDocData);
        await setDoc(doc(db, 'public_proposals', accessKey), publicSummary, { merge: true });
      } catch {
        // Public özet senkronizasyonu uyarısı
      }
    }

    if (updates.stage || updates.outcomeStatus) {
      await storageService.logAuditAction({
        action: 'lead_stage_or_outcome_updated',
        module: 'pipeline',
        entityId: id,
        details: `Aşama: ${updatedDocData?.stage} | Sonuç: ${updatedDocData?.outcomeStatus}`,
        actor: options?.actor
      });
    }

    return storageService.normalizeLead(updatedDocData);
  },

  /**
   * Teklif versiyonunu sabit (değişmez) bir kayıt olarak yayınlar ve yeni revizyon numarası üretir.
   */
  publishProposalVersion: async (leadId, proposalPayload, actor = null) => {
    if (!db) throw new Error('Firestore bağlantısı aktif değil.');
    const leadRef = doc(db, 'leads', leadId);
    let finalLead = null;
    let publishedSnapshot = null;

    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(leadRef);
      if (!snap.exists()) {
        throw new Error('Talep kaydı bulunamadı.');
      }
      const current = snap.data();
      const existingProposals = Array.isArray(current.proposals) ? [...current.proposals] : [];
      const nextVersionNumber = existingProposals.length + 1;
      const revisionLabel = `Rev.${nextVersionNumber - 1}`; // İlk teklif Rev.0 (v1), sonraki Rev.1 (v2)
      const nowIso = new Date().toISOString();

      const draftCandidate = {
        ...current,
        costItems: proposalPayload.costItems || current.costItems,
        discountAmount: Math.max(0, Number(proposalPayload.discountAmount ?? current.discountAmount) || 0),
        validityDays: Number(proposalPayload.validityDays ?? current.validityDays) || 15,
        includedScope: proposalPayload.includedScope ?? current.includedScope,
        excludedScope: proposalPayload.excludedScope ?? current.excludedScope,
        paymentPlan: proposalPayload.paymentPlan ?? current.paymentPlan,
        terms: proposalPayload.terms ?? current.terms
      };

      const financials = storageService.calculateLeadFinancials(draftCandidate, { useEditorItems: true });
      if (financials.netSaleExclVat <= 0) {
        throw new Error('Teklif yayınlanabilmesi için KDV hariç satış tutarı 0 TL üzerinde olmalıdır.');
      }

      const validUntil = new Date(Date.now() + draftCandidate.validityDays * 86400000).toISOString().split('T')[0];

      // Değişmez (Immutable) Teklif Versiyon Kaydı
      publishedSnapshot = {
        versionNumber: nextVersionNumber,
        revisionLabel,
        publishedAt: nowIso,
        publishedByUid: actor?.uid || auth?.currentUser?.uid || 'staff',
        publishedByEmail: actor?.email || auth?.currentUser?.email || 'staff',
        validityDays: draftCandidate.validityDays,
        validUntil,
        costItems: JSON.parse(JSON.stringify(draftCandidate.costItems)),
        discountAmount: draftCandidate.discountAmount,
        financials: {
          totalCostExclVat: financials.totalCostExclVat,
          grossSaleExclVat: financials.grossSaleExclVat,
          discountExclVat: financials.discountExclVat,
          netSaleExclVat: financials.netSaleExclVat,
          vatAmount: financials.vatAmount,
          grandTotalInclVat: financials.grandTotalInclVat,
          grossProfitExclVat: financials.grossProfitExclVat,
          marginPercent: financials.marginPercent,
          hasMissingCosts: financials.hasMissingCosts,
          isProfitCalculable: financials.isProfitCalculable
        },
        includedScope: draftCandidate.includedScope,
        excludedScope: draftCandidate.excludedScope,
        paymentPlan: draftCandidate.paymentPlan,
        terms: draftCandidate.terms
      };

      existingProposals.push(publishedSnapshot);

      const nextStage = current.stage === 'Yeni Talep' ||
        current.stage === 'İlk Görüşme' ||
        current.stage === 'İhtiyaç Analizi' ||
        current.stage === 'Mekân Araştırması' ||
        current.stage === 'Maliyetlendirme' ||
        current.stage === 'Teklif Hazırlanıyor'
        ? 'Teklif Gönderildi'
        : current.stage;

      const nextStageHistory = Array.isArray(current.stageHistory) ? [...current.stageHistory] : [];
      if (nextStage !== current.stage) {
        nextStageHistory.push({
          fromStage: current.stage,
          toStage: nextStage,
          fromOutcome: current.outcomeStatus || 'active',
          toOutcome: current.outcomeStatus || 'active',
          changedByEmail: actor?.email || auth?.currentUser?.email || 'staff',
          changedByName: actor?.name || 'Yönetici',
          timestamp: nowIso,
          note: `${revisionLabel} (v${nextVersionNumber}) resmi teklifi oluşturuldu ve yayınlandı.`
        });
      }

      const accessToken = current.accessToken || storageService.generateAccessToken();

      finalLead = {
        ...draftCandidate,
        accessToken,
        stage: nextStage,
        stageHistory: nextStageHistory,
        currentVersion: nextVersionNumber,
        currentRevisionLabel: revisionLabel,
        proposalSentAt: nowIso,
        validUntil,
        quotedPrice: financials.netSaleExclVat,
        proposals: existingProposals,
        recordVersion: (Number(current.recordVersion) || 1) + 1,
        updatedAt: nowIso
      };

      transaction.set(leadRef, finalLead);
    });

    // Müşteri güvenli takip dokümanını güncelle
    if (finalLead) {
      const accessKey = `${finalLead.id}_${finalLead.accessToken}`;
      const publicSummary = buildPublicProposalSummary(finalLead);
      await setDoc(doc(db, 'public_proposals', accessKey), publicSummary);

      await storageService.logAuditAction({
        action: 'proposal_version_published',
        module: 'costCalc',
        entityId: leadId,
        details: `${publishedSnapshot.revisionLabel} (v${publishedSnapshot.versionNumber}) yayınlandı. Net Satış (KDV Hariç): ${publishedSnapshot.financials.netSaleExclVat} TL`,
        actor
      });

      try {
        await notificationService.dispatchEventNotification({
          eventType: 'proposal_sent',
          lead: finalLead,
          versionKey: `v${publishedSnapshot.versionNumber}`,
          actorEmail: actor?.email || 'staff'
        });
      } catch {
        // Bildirim uyarısı
      }
    }

    return {
      lead: storageService.normalizeLead(finalLead),
      publishedSnapshot
    };
  },

  deleteLead: async (id, actor = null) => {
    if (!db) throw new Error('Firestore bağlantısı aktif değil.');
    const snap = await getDoc(doc(db, 'leads', id));
    if (snap.exists()) {
      const data = snap.data();
      if (data.accessToken) {
        try {
          await deleteDoc(doc(db, 'public_proposals', `${id}_${data.accessToken}`));
        } catch {
          // ignore
        }
      }
    }
    await deleteDoc(doc(db, 'leads', id));
    await storageService.logAuditAction({
      action: 'lead_deleted',
      module: 'pipeline',
      entityId: id,
      details: `${id} numaralı talep kaydı silindi.`,
      actor
    });
  },

  /**
   * Müşteri Güvenli Teklif Sorgulama (/teklif-takip)
   * Tahmin edilebilir teklif numarası tek başına erişim sağlamaz!
   * Mutlaka geçerli 'accessToken' gereklidir ve 'expiresAt' süresi dolmamış olmalıdır.
   */
  fetchPublicProposalSecure: async (leadId, accessToken) => {
    const cleanId = String(leadId || '').trim().toUpperCase();
    const cleanToken = String(accessToken || '').trim();
    if (!cleanId || !cleanToken) {
      throw new Error('Güvenlik kuralı: Teklif özetini görüntülemek için hem Teklif Referans Kodu (TLP-...) hem de size özel Güvenlik Anahtarı (Erişim Tokenı) gereklidir.');
    }
    if (!db) {
      throw new Error('Sunucu bağlantısı kurulamadı.');
    }

    const accessKey = `${cleanId}_${cleanToken}`;
    const docRef = doc(db, 'public_proposals', accessKey);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      return null;
    }
    const data = snap.data();
    if (data.expiresAt && Number(data.expiresAt) <= Date.now()) {
      throw new Error('Bu teklif bağlantısının erişim süresi dolmuştur. Güncel bağlantı için lütfen operasyon ekibimizle iletişime geçiniz.');
    }
    return data;
  },

  /**
   * Müşteri Onayı veya Revizyon Talebini Sunucuya Kaydeder
   * İlgili teklif versiyonunu ve zaman bilgisini saklar. Ödeme yapılmış gibi yorumlamaz.
   */
  submitCustomerProposalResponse: async ({ leadId, accessToken, status, note }) => {
    const cleanId = String(leadId || '').trim().toUpperCase();
    const cleanToken = String(accessToken || '').trim();
    if (!cleanId || !cleanToken) {
      throw new Error('Eksik erişim bilgisi.');
    }
    if (!['approved', 'revision_requested'].includes(status)) {
      throw new Error('Geçersiz müşteri yanıt türü.');
    }
    if (!db) {
      throw new Error('Sunucu bağlantısı mevcut değil.');
    }

    const accessKey = `${cleanId}_${cleanToken}`;
    const pubRef = doc(db, 'public_proposals', accessKey);
    const snap = await getDoc(pubRef);
    if (!snap.exists()) {
      throw new Error('Teklif kaydı doğrulanamadı veya erişim süresi doldu.');
    }

    const pubData = snap.data();
    const versionNumber = Number(pubData.currentVersion) || 0;
    if (versionNumber <= 0) {
      throw new Error('Henüz yayınlanmış bir resmi teklif versiyonu bulunmadığı için onay/revizyon yanıtı gönderilemez.');
    }

    const nowIso = new Date().toISOString();
    const responseEntry = {
      status,
      versionNumber,
      revisionLabel: pubData.currentRevisionLabel || `Rev.${versionNumber - 1}`,
      note: String(note || '').trim().slice(0, 1000),
      respondedAt: nowIso
    };

    const existingHistory = Array.isArray(pubData.customerResponseHistory)
      ? [...pubData.customerResponseHistory]
      : [];
    existingHistory.push(responseEntry);

    await updateDoc(pubRef, {
      customerResponse: responseEntry,
      customerResponseHistory: existingHistory,
      updatedAt: nowIso
    });

    // Denetim kaydı oluştur
    await storageService.logAuditAction({
      action: status === 'approved' ? 'customer_approved' : 'customer_revision_requested',
      module: 'customer_portal',
      entityId: cleanId,
      details: `Müşteri yanıtı (${responseEntry.revisionLabel}): ${status === 'approved' ? 'Teklif Onaylandı (Mutabakat)' : 'Revizyon Talebi'} - Not: ${responseEntry.note || '-'}`
    });

    return {
      ...pubData,
      customerResponse: responseEntry,
      customerResponseHistory: existingHistory,
      updatedAt: nowIso
    };
  },

  /**
   * Finansal Hesaplama Motoru
   * - KDV hariç tutarları esas alır; KDV'yi ayrıca hesaplar.
   * - Aynı teklifin revizyonlarını tekrar tekrar toplamaz; yalnızca geçerli son versiyonu (veya editördeki güncel kalemleri) esas alır.
   * - Eksik maliyetleri sıfır kabul ederek yanıltıcı kâr üretmez.
   * - Satış tutarı sıfırsa marjı "Hesaplanamıyor" döndürür.
   */
  calculateLeadFinancials: (lead, options = { useEditorItems: false }) => {
    if (!lead) {
      return {
        totalCostExclVat: 0,
        grossSaleExclVat: 0,
        discountExclVat: 0,
        netSaleExclVat: 0,
        vatAmount: 0,
        grandTotalInclVat: 0,
        grossProfitExclVat: null,
        marginPercent: null,
        marginDisplay: 'Hesaplanamıyor',
        hasCostData: false,
        hasMissingCosts: false,
        isProfitCalculable: false,
        versionUsed: 0
      };
    }

    // Eğer yayınlanmış teklif versiyonları varsa ve editör zorlanmamışsa, geçerli SON versiyonu esas al
    const proposals = Array.isArray(lead.proposals) ? lead.proposals : [];
    const latestPublished = !options?.useEditorItems && proposals.length > 0
      ? proposals[proposals.length - 1]
      : null;

    const rawItems = latestPublished
      ? (latestPublished.costItems || [])
      : (Array.isArray(lead.costItems) && lead.costItems.length > 0 ? lead.costItems : buildInitialCostItems(lead));

    const discountRaw = latestPublished
      ? (Number(latestPublished.discountAmount) || 0)
      : (Number(lead.discountAmount) || 0);

    let totalCostExclVat = 0;
    let grossSaleExclVat = 0;
    let unpricedCostItemsCount = 0;
    let soldItemsWithoutCostCount = 0;
    let activeCostItemsCount = 0;

    rawItems.forEach(item => {
      const qty = Math.max(0, Number(item.quantity) || 0);
      const uCost = Math.max(0, Number(item.unitCost) || 0);
      const itemCost = qty * uCost;
      const itemSale = Math.max(0, Number(item.salePrice) || 0);

      totalCostExclVat += itemCost;
      grossSaleExclVat += itemSale;

      if (itemCost > 0 || item.zeroCostConfirmed) {
        activeCostItemsCount++;
      }
      if (itemSale > 0 && itemCost <= 0 && !item.zeroCostConfirmed) {
        soldItemsWithoutCostCount++;
      }
      if (itemCost > 0 && itemSale <= 0) {
        unpricedCostItemsCount++;
      }
    });

    // Eğer satır bazlı satış girilmemiş ama lead.quotedPrice (eski/doğrudan satış fiyatı) girilmişse:
    if (grossSaleExclVat === 0 && Number(lead.quotedPrice) > 0) {
      grossSaleExclVat = Number(lead.quotedPrice);
      if (totalCostExclVat <= 0) {
        soldItemsWithoutCostCount++;
      }
    }

    totalCostExclVat = Math.round(totalCostExclVat * 100) / 100;
    grossSaleExclVat = Math.round(grossSaleExclVat * 100) / 100;
    const discountExclVat = Math.min(grossSaleExclVat, Math.max(0, Math.round(discountRaw * 100) / 100));
    const netSaleExclVat = Math.round((grossSaleExclVat - discountExclVat) * 100) / 100;

    // KDV Hesabı (Kalemlerin kendi KDV oranlarına göre indirim sonrası orantılı)
    let vatAmount = 0;
    if (grossSaleExclVat > 0 && rawItems.some(i => Number(i.salePrice) > 0)) {
      const discountRatio = netSaleExclVat / grossSaleExclVat;
      rawItems.forEach(item => {
        const itemSale = Math.max(0, Number(item.salePrice) || 0);
        if (itemSale > 0) {
          const itemNetSale = itemSale * discountRatio;
          const itemVatRate = item.vatRate !== undefined ? Number(item.vatRate) : (Number(lead.vatRate) || 20);
          vatAmount += itemNetSale * (itemVatRate / 100);
        }
      });
    } else {
      const defaultVatRate = Number(lead.vatRate) || 20;
      vatAmount = netSaleExclVat * (defaultVatRate / 100);
    }

    vatAmount = Math.round(vatAmount * 100) / 100;
    const grandTotalInclVat = Math.round((netSaleExclVat + vatAmount) * 100) / 100;

    const hasCostData = totalCostExclVat > 0 && soldItemsWithoutCostCount === 0;
    const hasMissingCosts = (netSaleExclVat > 0 && totalCostExclVat <= 0) || soldItemsWithoutCostCount > 0;
    const isProfitCalculable = netSaleExclVat > 0 && hasCostData && !hasMissingCosts;

    let grossProfitExclVat = null;
    let marginPercent = null;
    let marginDisplay = 'Hesaplanamıyor';

    if (isProfitCalculable) {
      grossProfitExclVat = Math.round((netSaleExclVat - totalCostExclVat) * 100) / 100;
      marginPercent = Math.round(((grossProfitExclVat / netSaleExclVat) * 100) * 100) / 100;
      marginDisplay = `%${marginPercent.toFixed(1)}`;
    } else if (hasMissingCosts) {
      marginDisplay = 'Maliyet Eksik (Hesaplanamıyor)';
    }

    return {
      totalCostExclVat,
      grossSaleExclVat,
      discountExclVat,
      netSaleExclVat,
      vatAmount,
      grandTotalInclVat,
      grossProfitExclVat,
      marginPercent,
      marginDisplay,
      hasCostData,
      hasMissingCosts,
      unpricedCostItemsCount,
      isProfitCalculable,
      versionUsed: latestPublished ? latestPublished.versionNumber : (Number(lead.currentVersion) || 0),
      revisionLabelUsed: latestPublished ? latestPublished.revisionLabel : (lead.currentRevisionLabel || 'Taslak'),
      // Geriye dönük uyumluluk alanları
      totalCost: totalCostExclVat,
      quotedPrice: netSaleExclVat,
      grossProfit: grossProfitExclVat ?? 0,
      grandTotal: grandTotalInclVat
    };
  },

  // ==========================================
  // 2. TEDARİKÇİLER (SUPPLIERS — 81 İL GERÇEK VERİ)
  // ==========================================
  SUPPLIER_CATEGORIES,

  computeSupplierRating: (supplier) => {
    const evaluations = Array.isArray(supplier?.evaluations) ? supplier.evaluations : [];
    const validScores = evaluations
      .map(ev => Number(ev.score))
      .filter(s => Number.isFinite(s) && s >= 1 && s <= 5);
    if (validScores.length === 0) {
      return { hasRating: false, average: null, count: 0, label: 'Değerlendirme Yok' };
    }
    const sum = validScores.reduce((acc, v) => acc + v, 0);
    const avg = Math.round((sum / validScores.length) * 10) / 10;
    return { hasRating: true, average: avg, count: validScores.length, label: `${avg.toFixed(1)} / 5 (${validScores.length})` };
  },

  fetchSuppliersFromCloud: async () => {
    if (!db) return [];
    const snap = await getDocs(collection(db, 'suppliers'));
    return snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
      isActive: d.data().isActive !== false,
      serviceCities: Array.isArray(d.data().serviceCities)
        ? d.data().serviceCities
        : (d.data().city ? [d.data().city] : []),
      evaluations: Array.isArray(d.data().evaluations) ? d.data().evaluations : []
    }));
  },

  addSupplier: async (supplier, actor = null) => {
    if (!db) throw new Error('Firestore bağlantısı aktif değil.');
    const company = String(supplier.company || '').trim();
    if (!company) throw new Error('Tedarikçi firma adı zorunludur.');

    const newId = supplier.id || `sup-${Date.now()}-${generateRandomToken(4)}`;
    const nowIso = new Date().toISOString();
    const serviceCities = Array.isArray(supplier.serviceCities) && supplier.serviceCities.length > 0
      ? supplier.serviceCities
      : (supplier.city ? [supplier.city] : ['İstanbul']);

    const newSup = {
      id: newId,
      company,
      category: supplier.category || SUPPLIER_CATEGORIES[0],
      contactName: String(supplier.contactName || '').trim(),
      phone: String(supplier.phone || '').trim(),
      email: String(supplier.email || '').trim(),
      city: serviceCities[0] || 'İstanbul',
      serviceCities,
      notes: String(supplier.notes || '').trim(),
      verifiedAt: supplier.verifiedAt || null,
      isActive: supplier.isActive !== false,
      evaluations: Array.isArray(supplier.evaluations) ? supplier.evaluations : [],
      recordVersion: 1,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    await setDoc(doc(db, 'suppliers', newId), newSup);
    await storageService.logAuditAction({
      action: 'supplier_created',
      module: 'suppliers',
      entityId: newId,
      details: `${company} (${newSup.category}) tedarikçi veritabanına eklendi.`,
      actor
    });
    return newSup;
  },

  updateSupplier: async (id, updates, actor = null) => {
    if (!db) throw new Error('Firestore bağlantısı aktif değil.');
    const supRef = doc(db, 'suppliers', id);
    let updated = null;
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(supRef);
      if (!snap.exists()) throw new Error('Tedarikçi kaydı bulunamadı.');
      const cur = snap.data();
      updated = {
        ...cur,
        ...updates,
        recordVersion: (Number(cur.recordVersion) || 1) + 1,
        updatedAt: new Date().toISOString()
      };
      tx.set(supRef, updated);
    });
    await storageService.logAuditAction({
      action: 'supplier_updated',
      module: 'suppliers',
      entityId: id,
      details: `${updated?.company || id} tedarikçi kaydı güncellendi.`,
      actor
    });
    return updated;
  },

  addSupplierEvaluation: async (supplierId, evaluation, actor = null) => {
    if (!db) throw new Error('Firestore bağlantısı aktif değil.');
    const score = Number(evaluation.score);
    if (!Number.isFinite(score) || score < 1 || score > 5) {
      throw new Error('Değerlendirme puanı 1 ile 5 arasında olmalıdır.');
    }
    const supRef = doc(db, 'suppliers', supplierId);
    let updated = null;
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(supRef);
      if (!snap.exists()) throw new Error('Tedarikçi bulunamadı.');
      const cur = snap.data();
      const evals = Array.isArray(cur.evaluations) ? [...cur.evaluations] : [];
      evals.push({
        id: `ev-${Date.now()}`,
        score,
        comment: String(evaluation.comment || '').trim(),
        leadId: String(evaluation.leadId || '').trim(),
        reviewer: actor?.email || auth?.currentUser?.email || 'Yönetici',
        date: new Date().toISOString().split('T')[0]
      });
      updated = {
        ...cur,
        evaluations: evals,
        updatedAt: new Date().toISOString()
      };
      tx.set(supRef, updated);
    });
    return updated;
  },

  /**
   * Tedarikçi herhangi bir maliyet kaleminde kullanılmışsa silinmesini engeller, pasifleştirme önerir.
   */
  deleteOrDeactivateSupplier: async (supplierId, allLeads = [], actor = null) => {
    if (!db) throw new Error('Firestore bağlantısı aktif değil.');
    const isUsedInLeads = allLeads.some(lead =>
      Array.isArray(lead.costItems) && lead.costItems.some(item => item.supplierId === supplierId)
    );
    if (isUsedInLeads) {
      const deactivated = await storageService.updateSupplier(supplierId, { isActive: false }, actor);
      return { deleted: false, deactivated: true, supplier: deactivated };
    }
    await deleteDoc(doc(db, 'suppliers', supplierId));
    await storageService.logAuditAction({
      action: 'supplier_deleted',
      module: 'suppliers',
      entityId: supplierId,
      details: `${supplierId} tedarikçisi silindi.`,
      actor
    });
    return { deleted: true, deactivated: false };
  },

  // ==========================================
  // 3. MEKÂN VE OTELLER (VENUES — GERÇEK VERİ)
  // ==========================================
  VENUE_TYPES,

  getVenues: () => VENUES,

  fetchVenuesFromCloud: async () => {
    if (!db) return [];
    const snap = await getDocs(collection(db, 'venues'));
    return snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
      halls: Array.isArray(d.data().halls) ? d.data().halls : [],
      availabilityRecords: Array.isArray(d.data().availabilityRecords) ? d.data().availabilityRecords : []
    }));
  },

  /**
   * Tarih uygunluğunu yalnızca gerçek bir rezervasyon/teyit kaydı varsa döndürür.
   * Teyit kaydı yoksa asla "Müsait" göstermez!
   */
  checkVenueDateAvailability: (venue, targetDate) => {
    if (!venue || !targetDate) {
      return { status: 'unverified', label: 'Tarih Seçilmedi / Teyit Gerekli', verified: false };
    }
    const records = Array.isArray(venue.availabilityRecords) ? venue.availabilityRecords : [];
    const matching = records.find(rec => {
      const start = rec.startDate || rec.date;
      const end = rec.endDate || start;
      return start && targetDate >= start && targetDate <= end;
    });
    if (!matching) {
      return {
        status: 'unverified',
        label: 'Müsaitlik Teyidi Gerekli (Teyit Kaydı Yok)',
        verified: false
      };
    }
    if (matching.status === 'teyitli_musait') {
      return {
        status: 'confirmed_available',
        label: `Teyitli Müsait (Kaynak: ${matching.source || 'Resmi Teyit'} - ${matching.verifiedAt || ''})`,
        verified: true,
        record: matching
      };
    }
    if (matching.status === 'opsiyonlu') {
      return {
        status: 'optioned',
        label: `Opsiyonlu (${matching.leadId || matching.source || 'Kurumsal Opsiyon'})`,
        verified: true,
        record: matching
      };
    }
    return {
      status: 'occupied',
      label: `Dolu (${matching.source || 'Rezervasyon Kaydı'})`,
      verified: true,
      record: matching
    };
  },

  saveVenueToCloud: async (venueData, actor = null) => {
    if (!db) throw new Error('Firestore bağlantısı aktif değil.');
    const name = String(venueData.name || '').trim();
    const city = String(venueData.city || '').trim();
    if (!name || !city) {
      throw new Error('Mekân adı ve şehir bilgisi zorunludur.');
    }

    const id = venueData.id || `venue-${Date.now()}-${generateRandomToken(4)}`;
    const nowIso = new Date().toISOString();

    const record = {
      id,
      name,
      city,
      district: String(venueData.district || '').trim(),
      address: String(venueData.address || '').trim(),
      contactName: String(venueData.contactName || '').trim(),
      phone: String(venueData.phone || '').trim(),
      email: String(venueData.email || '').trim(),
      website: String(venueData.website || '').trim(),
      venueType: venueData.venueType || VENUE_TYPES[0],
      starRating: venueData.starRating ? Number(venueData.starRating) : null,
      verificationSource: String(venueData.verificationSource || '').trim(),
      verifiedAt: venueData.verifiedAt || null,
      capacity: venueData.capacity ? Number(venueData.capacity) : null,
      salonCount: venueData.salonCount ? Number(venueData.salonCount) : null,
      parking: String(venueData.parking || '').trim(),
      accessibility: String(venueData.accessibility || '').trim(),
      technicalGear: Array.isArray(venueData.technicalGear) ? venueData.technicalGear : [],
      halls: Array.isArray(venueData.halls) ? venueData.halls : [],
      images: Array.isArray(venueData.images) ? venueData.images : (venueData.image ? [venueData.image] : []),
      image: venueData.image || (Array.isArray(venueData.images) && venueData.images[0]) || '',
      availabilityRecords: Array.isArray(venueData.availabilityRecords) ? venueData.availabilityRecords : [],
      description: String(venueData.description || '').trim(),
      updatedAt: nowIso
    };

    await setDoc(doc(db, 'venues', id), record, { merge: true });
    await storageService.logAuditAction({
      action: 'venue_saved',
      module: 'venues',
      entityId: id,
      details: `${name} (${city}) mekân kaydı güncellendi.`,
      actor
    });
    return record;
  },

  deleteVenueFromCloud: async (venueId, actor = null) => {
    if (!db) throw new Error('Firestore bağlantısı aktif değil.');
    await deleteDoc(doc(db, 'venues', venueId));
    await storageService.logAuditAction({
      action: 'venue_deleted',
      module: 'venues',
      entityId: venueId,
      details: `${venueId} mekân kaydı silindi.`,
      actor
    });
  },

  getProjects: () => PROJECTS,
  getBlogPosts: () => BLOG_POSTS,

  // ==========================================
  // 4. SİSTEM AYARLARI (SETTINGS)
  // ==========================================
  getSettings: () => memoryStore.settings,

  fetchSettingsFromCloud: async () => {
    if (!db) return memoryStore.settings;
    try {
      const snap = await getDoc(doc(db, 'settings', 'general_config'));
      if (snap.exists()) {
        memoryStore.settings = { ...INITIAL_SETTINGS, ...snap.data() };
      }
    } catch {
      // Varsayılan ayarları koru
    }
    return memoryStore.settings;
  },

  saveSettings: async (settings, actor = null) => {
    if (!db) throw new Error('Firestore bağlantısı aktif değil.');
    const sanitized = {
      companyName: String(settings.companyName || INITIAL_SETTINGS.companyName).trim(),
      brandTitle: String(settings.brandTitle || INITIAL_SETTINGS.brandTitle).trim(),
      domain: 'www.toplantimerkezi.com.tr',
      phone: String(settings.phone || INITIAL_SETTINGS.phone).trim(),
      whatsappPhone: String(settings.whatsappPhone || INITIAL_SETTINGS.whatsappPhone).trim(),
      email: String(settings.email || INITIAL_SETTINGS.email).trim(),
      address: String(settings.address || INITIAL_SETTINGS.address).trim(),
      googleAnalyticsId: String(settings.googleAnalyticsId || '').trim(),
      gtmId: String(settings.gtmId || '').trim(),
      metaPixelId: String(settings.metaPixelId || '').trim(),
      requireSecondaryPin: Boolean(settings.requireSecondaryPin),
      updatedAt: new Date().toISOString(),
      updatedBy: actor?.email || auth?.currentUser?.email || 'superadmin'
    };
    memoryStore.settings = { ...memoryStore.settings, ...sanitized };
    await setDoc(doc(db, 'settings', 'general_config'), sanitized, { merge: true });

    await storageService.logAuditAction({
      action: 'settings_updated',
      module: 'settings',
      entityId: 'general_config',
      details: 'Kurumsal platform ve iletişim ayarları güncellendi.',
      actor
    });
    return memoryStore.settings;
  },

  // ==========================================
  // 5. PROGRAMMATIC SEO MASASI & DOĞRULAMA MOTORU
  // ==========================================
  getBaseSeoRouteRegistry: () => {
    const baseDomain = 'https://www.toplantimerkezi.com.tr';
    const routes = [
      {
        slug: '',
        path: '/',
        category: 'Ana Sayfa',
        title: 'Toplantı & Kurumsal Organizasyon Yönetimi | 81 İlde Tek Merkezden | Toplantı Merkezi',
        h1: "Türkiye'nin Her Yerinde, Tek Merkezden Organizasyon.",
        metaDesc: "Türkiye'nin 81 ilinde bayi toplantısı, kongre, şirket toplantısı, lansman, kurumsal piknik ve resmi protokol organizasyonlarını tek merkezden yönetin.",
        searchIntent: 'Transactional',
        canonicalUrl: `${baseDomain}/`,
        isIndexed: true,
        inSitemap: true
      },
      {
        slug: 'kurumsal',
        path: '/kurumsal',
        category: 'Kurumsal',
        title: 'Hakkımızda & Kurumsal Kimlik | Toplantı Merkezi',
        h1: 'Kurumsal Organizasyonlarda Tek Merkez Gücü',
        metaDesc: 'Toplantı Merkezi kurumsal yapısı, 81 il operasyon ağı ve B2B etkinlik yönetim standartları.',
        searchIntent: 'Informational',
        canonicalUrl: `${baseDomain}/kurumsal`,
        isIndexed: true,
        inSitemap: true
      },
      {
        slug: 'mekanlar',
        path: '/mekanlar',
        category: 'Katalog',
        title: 'Toplantı Salonları & Kongre Otelleri | 81 İl Mekân Arama Motoru',
        h1: 'Türkiye Geneli Kongre Merkezleri ve Toplantı Salonları',
        metaDesc: 'İstanbul, Antalya, Ankara, İzmir ve 81 ilde kurumsal toplantı salonları ve kongre merkezleri.',
        searchIntent: 'Commercial Investigation',
        canonicalUrl: `${baseDomain}/mekanlar`,
        isIndexed: true,
        inSitemap: true
      },
      {
        slug: 'teklif-al',
        path: '/teklif-al',
        category: 'Dönüşüm',
        title: 'Kurumsal Organizasyon Teklifi Al | 7 Adımda Hızlı Teklif Modülü',
        h1: 'Kurumsal Organizasyon Fiyat Teklifi Alın',
        metaDesc: 'Bayi toplantısı, kongre, seminer, lansman ve kurumsal piknik organizasyonlarınız için 81 ilde geçerli resmi fiyat teklifi alın.',
        searchIntent: 'Transactional',
        canonicalUrl: `${baseDomain}/teklif-al`,
        isIndexed: true,
        inSitemap: true
      }
    ];

    // 45 Money Page Kümesi
    (SEO_CLUSTERS || []).forEach(cluster => {
      (cluster.pages || []).forEach(page => {
        if (!page || !page.slug) return;
        routes.push({
          slug: page.slug,
          path: `/${page.slug}`,
          category: `Money Page (${cluster.name || cluster.id})`,
          title: page.seoTitle || `${page.title} | Toplantı Merkezi`,
          h1: page.h1 || page.title,
          metaDesc: page.metaDesc || '',
          searchIntent: page.intent || 'Transactional',
          canonicalUrl: `${baseDomain}/${page.slug}`,
          isIndexed: true,
          inSitemap: true
        });
      });
    });

    // 5 Topic Hub Rehberi
    (TOPIC_HUBS || []).forEach(hub => {
      if (!hub || !hub.slug) return;
      routes.push({
        slug: `rehber/${hub.slug}`,
        path: `/rehber/${hub.slug}`,
        category: 'Topic Hub Rehberi',
        title: hub.seoTitle || `${hub.title} | Toplantı Merkezi`,
        h1: hub.h1 || hub.title,
        metaDesc: hub.metaDesc || '',
        searchIntent: 'Informational',
        canonicalUrl: `${baseDomain}/rehber/${hub.slug}`,
        isIndexed: true,
        inSitemap: true
      });
    });

    // 9 Organizasyon Detay Sayfası
    (ORGANIZATIONS || []).forEach(org => {
      routes.push({
        slug: `organizasyonlar/${org.slug}`,
        path: `/organizasyonlar/${org.slug}`,
        category: 'Organizasyon Kataloğu',
        title: org.seoTitle || `${org.title} | Toplantı Merkezi`,
        h1: org.title,
        metaDesc: org.shortDesc || '',
        searchIntent: 'Transactional',
        canonicalUrl: `${baseDomain}/organizasyonlar/${org.slug}`,
        isIndexed: true,
        inSitemap: true
      });
    });

    // 10 Hizmet Detay Sayfası
    (SERVICES || []).forEach(srv => {
      routes.push({
        slug: `hizmetler/${srv.slug}`,
        path: `/hizmetler/${srv.slug}`,
        category: 'Teknik Hizmet',
        title: srv.seoTitle || `${srv.title} | Toplantı Merkezi`,
        h1: srv.title,
        metaDesc: srv.shortDesc || '',
        searchIntent: 'Commercial Investigation',
        canonicalUrl: `${baseDomain}/hizmetler/${srv.slug}`,
        isIndexed: true,
        inSitemap: true
      });
    });

    // Sektörel Çözüm Sayfaları
    (INDUSTRIES || []).forEach(ind => {
      if (!ind || !ind.slug) return;
      routes.push({
        slug: `sektorler/${ind.slug}`,
        path: `/sektorler/${ind.slug}`,
        category: 'Sektörel Çözüm',
        title: ind.seoTitle || `${ind.title} | Toplantı Merkezi`,
        h1: ind.h1 || ind.title,
        metaDesc: ind.metaDesc || '',
        searchIntent: 'Transactional',
        canonicalUrl: `${baseDomain}/sektorler/${ind.slug}`,
        isIndexed: true,
        inSitemap: true
      });
    });

    // 81 İl Ana Sayfaları
    (ALL_81_CITIES || []).forEach(city => {
      routes.push({
        slug: `sehirler/${city.slug}`,
        path: `/sehirler/${city.slug}`,
        category: '81 İl Rehberi',
        title: `${city.name} Toplantı & Kurumsal Organizasyon | Toplantı Merkezi`,
        h1: `${city.name} Kurumsal Toplantı ve Organizasyon Yönetimi`,
        metaDesc: `${city.name} ilinde bayi toplantısı, kongre, kurumsal etkinlik, sahne, LED ekran ve salon kiralama hizmetleri tek merkezde.`,
        searchIntent: 'Local Transactional',
        canonicalUrl: `${baseDomain}/sehirler/${city.slug}`,
        isIndexed: true,
        inSitemap: true
      });
    });

    // 14 Uluslararası Çok Dilli B2B MICE & Kongre Portalları (Global SEO & Hreflang)
    (SUPPORTED_LANGUAGES || []).forEach(lang => {
      if (!lang || lang.code === 'tr') return;
      const content = I18N_CONTENT[lang.code];
      if (!content) return;
      routes.push({
        slug: lang.code,
        path: `/${lang.code}`,
        category: `Uluslararası Dil (${lang.trName} - ${lang.nativeName})`,
        title: content.metaTitle,
        h1: `${content.hero.titleLine1} ${content.hero.titleHighlight}`,
        metaDesc: content.metaDesc,
        searchIntent: 'International B2B Transactional',
        canonicalUrl: `${baseDomain}/${lang.code}`,
        isIndexed: true,
        inSitemap: true
      });
    });

    return routes;
  },

  fetchSeoPagesFromCloud: async () => {
    const baseRegistry = storageService.getBaseSeoRouteRegistry();
    if (!db) return baseRegistry;

    try {
      const snap = await getDocs(collection(db, 'seo_pages'));
      const overridesMap = {};
      snap.docs.forEach(d => {
        const data = d.data();
        const key = data.path || (data.slug === '' ? '/' : `/${String(data.slug || d.id).replace(/^\/+/, '')}`);
        overridesMap[key] = { ...data, docId: d.id };
      });
      memoryStore.seoOverrides = overridesMap;
      if (typeof window !== 'undefined') {
        window.__TM_SEO_OVERRIDES__ = overridesMap;
      }

      return baseRegistry.map(route => {
        const override = overridesMap[route.path];
        if (!override) return route;
        return {
          ...route,
          ...override,
          path: route.path,
          slug: route.slug,
          hasCloudOverride: true
        };
      });
    } catch {
      return baseRegistry;
    }
  },

  getSeoOverrideForPath: (pathname) => {
    const cleanPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
    return memoryStore.seoOverrides[cleanPath] || null;
  },

  /**
   * SEO Kayıtlarını Doğrular:
   * - Yinelenen başlıklar
   * - Geçersiz canonical veya alt sayfaya yanlışlıkla ana sayfa canonical'ı verilmesi
   * - Sitemap ve noindex çelişkileri
   */
  validateSeoRegistry: (pages = []) => {
    const baseDomain = 'https://www.toplantimerkezi.com.tr';
    const titleCounts = {};
    const descCounts = {};

    pages.forEach(p => {
      const t = (p.title || '').trim().toLowerCase();
      const d = (p.metaDesc || '').trim().toLowerCase();
      if (t) titleCounts[t] = (titleCounts[t] || 0) + 1;
      if (d) descCounts[d] = (descCounts[d] || 0) + 1;
    });

    const issues = [];
    pages.forEach(p => {
      const pageIssues = [];
      const t = (p.title || '').trim().toLowerCase();
      const d = (p.metaDesc || '').trim().toLowerCase();
      const canonical = (p.canonicalUrl || '').trim();

      if (!t || p.title.trim().length < 15) {
        pageIssues.push({ type: 'short_title', message: 'Başlık (Title) çok kısa veya boş.' });
      }
      if (t && titleCounts[t] > 1) {
        pageIssues.push({ type: 'duplicate_title', message: `Yinelenen başlık (${titleCounts[t]} sayfada aynı Title kullanılıyor).` });
      }
      if (d && descCounts[d] > 1) {
        pageIssues.push({ type: 'duplicate_desc', message: `Yinelenen meta açıklama (${descCounts[d]} sayfada aynı).` });
      }
      if (!canonical.startsWith(baseDomain)) {
        pageIssues.push({ type: 'invalid_canonical_domain', message: `Canonical URL '${baseDomain}' ile başlamalıdır.` });
      }
      if (
        p.path !== '/' &&
        (canonical === baseDomain || canonical === `${baseDomain}/`)
      ) {
        pageIssues.push({
          type: 'homepage_canonical_on_subpage',
          message: 'KRİTİK HATA: Alt sayfaya ana sayfa canonical URL’si atanmış!'
        });
      }
      if (!p.isIndexed && p.inSitemap) {
        pageIssues.push({
          type: 'noindex_in_sitemap',
          message: 'Sitemap / Index çelişkisi: Sayfa NOINDEX olarak işaretlenmiş; sitemap üretiminde hariç tutulmalıdır.'
        });
      }

      if (pageIssues.length > 0) {
        issues.push({ path: p.path, slug: p.slug, issues: pageIssues });
      }
    });

    return issues;
  },

  updateSeoPage: async (routeItem, updates, actor = null) => {
    if (!db) throw new Error('Firestore bağlantısı aktif değil.');
    const baseDomain = 'https://www.toplantimerkezi.com.tr';
    const path = routeItem.path || (routeItem.slug ? `/${routeItem.slug.replace(/^\/+/, '')}` : '/');
    const canonicalUrl = String(updates.canonicalUrl ?? routeItem.canonicalUrl ?? `${baseDomain}${path === '/' ? '/' : path}`).trim();

    if (!canonicalUrl.startsWith(baseDomain)) {
      throw new Error(`Canonical URL '${baseDomain}' alan adıyla başlamalıdır.`);
    }
    if (path !== '/' && (canonicalUrl === baseDomain || canonicalUrl === `${baseDomain}/`)) {
      throw new Error('Alt sayfalara ana sayfa canonical URL’si (https://www.toplantimerkezi.com.tr/) atanamaz.');
    }

    const docId = path === '/' ? '__root__' : path.replace(/^\/+/, '').replace(/\//g, '__');
    const isIndexed = updates.isIndexed !== undefined ? Boolean(updates.isIndexed) : Boolean(routeItem.isIndexed);

    const record = {
      docId,
      slug: routeItem.slug || '',
      path,
      category: routeItem.category || 'SEO Sayfası',
      title: String(updates.title ?? routeItem.title ?? '').trim(),
      h1: String(updates.h1 ?? routeItem.h1 ?? '').trim(),
      metaDesc: String(updates.metaDesc ?? routeItem.metaDesc ?? '').trim(),
      searchIntent: updates.searchIntent || routeItem.searchIntent || 'Transactional',
      canonicalUrl,
      isIndexed,
      inSitemap: isIndexed, // Noindex sayfalar sitemap'ten otomatik çıkarılır
      lastUpdated: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString(),
      updatedBy: actor?.email || auth?.currentUser?.email || 'superadmin'
    };

    await setDoc(doc(db, 'seo_pages', docId), record, { merge: true });
    memoryStore.seoOverrides[path] = record;
    if (typeof window !== 'undefined') {
      window.__TM_SEO_OVERRIDES__ = { ...memoryStore.seoOverrides };
    }

    await storageService.logAuditAction({
      action: 'seo_page_updated',
      module: 'seoManager',
      entityId: path,
      details: `${path} SEO verileri güncellendi (Index: ${isIndexed}, Canonical: ${canonicalUrl}).`,
      actor
    });

    return record;
  },

  // ==========================================
  // 6. 301 / 302 REDIRECT YÖNETİCİSİ & DOĞRULAMA
  // ==========================================
  RESERVED_SYSTEM_PATHS: [
    '/admin',
    '/teklif-takip',
    '/teklif-al',
    '/iletisim',
    '/sitemap.xml',
    '/robots.txt',
    '/llms.txt',
    '/llms-full.txt',
    ...INTERNATIONAL_LANG_CODES.map(code => `/${code}`)
  ],

  validateRedirectRule: (rule, existingRedirects = [], editingId = null) => {
    const rawSource = String(rule.oldUrl || rule.sourcePath || '').trim();
    const rawTarget = String(rule.newUrl || rule.targetUrl || '').trim();
    const type = Number(rule.type) === 302 ? 302 : 301;

    if (!rawSource.startsWith('/')) {
      return { valid: false, error: 'Kaynak yol (Source Path) "/" ile başlamalıdır (Örn: /eski-sayfa).' };
    }
    if (rawSource === '/') {
      return { valid: false, error: 'Ana sayfa ("/") başka bir adrese yönlendirilemez.' };
    }
    if (storageService.RESERVED_SYSTEM_PATHS.includes(rawSource.replace(/\/+$/, ''))) {
      return { valid: false, error: `"${rawSource}" kritik sistem yolu olduğu için yönlendirilemez.` };
    }
    if (!rawTarget) {
      return { valid: false, error: 'Hedef URL boş bırakılamaz.' };
    }

    const normSource = rawSource.replace(/\/+$/, '');
    let isExternal = false;
    let normTargetPath = rawTarget;

    if (rawTarget.startsWith('http://') || rawTarget.startsWith('https://')) {
      let parsed;
      try {
        parsed = new URL(rawTarget);
      } catch {
        return { valid: false, error: 'Geçersiz hedef URL formatı.' };
      }
      if (parsed.protocol !== 'https:') {
        return { valid: false, error: 'Dış hedef URL güvenli HTTPS protokolü kullanmalıdır.' };
      }
      if (parsed.hostname === 'www.toplantimerkezi.com.tr' || parsed.hostname === 'toplantimerkezi.com.tr') {
        normTargetPath = parsed.pathname.replace(/\/+$/, '') || '/';
      } else {
        isExternal = true;
        if (!rule.externalConfirmed) {
          return {
            valid: false,
            requiresExternalConfirmation: true,
            error: `Hedef URL dış bir alan adına (${parsed.hostname}) işaret ediyor. Devam etmek için "Dış Alan Adı Yönlendirmesini Onaylıyorum" kutucuğunu işaretleyin.`
          };
        }
      }
    } else if (!rawTarget.startsWith('/')) {
      return { valid: false, error: 'Hedef URL "/" ile başlayan bir iç yol veya "https://" ile başlayan tam adres olmalıdır.' };
    } else {
      normTargetPath = rawTarget.replace(/\/+$/, '') || '/';
    }

    // 1. Kendine yönlendirme kontrolü (Self-redirect)
    if (!isExternal && normSource === normTargetPath) {
      return { valid: false, error: 'Kendine yönlendirme hatası: Kaynak yol ve hedef URL aynı olamaz.' };
    }

    // 2. Çakışan kural kontrolü (Duplicate sourcePath)
    const duplicate = existingRedirects.find(
      r => r.id !== editingId && (r.oldUrl || r.sourcePath || '').replace(/\/+$/, '') === normSource
    );
    if (duplicate) {
      return { valid: false, error: `Çakışan kural: "${normSource}" kaynağı için zaten bir yönlendirme kaydı mevcut.` };
    }

    // 3. Döngü (Loop) kontrolü (A -> B -> ... -> A)
    if (!isExternal) {
      const graph = {};
      existingRedirects.forEach(r => {
        if (r.id !== editingId && r.active !== false) {
          const s = (r.oldUrl || r.sourcePath || '').replace(/\/+$/, '');
          const t = (r.newUrl || r.targetUrl || '').replace(/\/+$/, '') || '/';
          graph[s] = t;
        }
      });
      graph[normSource] = normTargetPath;

      let cursor = normTargetPath;
      const visited = new Set([normSource]);
      let hops = 0;
      while (cursor && graph[cursor]) {
        hops++;
        if (visited.has(cursor) || visited.has(graph[cursor])) {
          return {
            valid: false,
            error: `Yönlendirme döngüsü (Redirect Loop) tespit edildi: ${Array.from(visited).join(' → ')} → ${graph[cursor]}`
          };
        }
        visited.add(cursor);
        cursor = graph[cursor];
        if (hops > 20) break;
      }
    }

    return {
      valid: true,
      normalized: {
        oldUrl: normSource,
        newUrl: isExternal ? rawTarget : normTargetPath,
        type,
        active: rule.active !== false,
        description: String(rule.description || '').trim(),
        isExternal,
        externalConfirmed: Boolean(rule.externalConfirmed)
      }
    };
  },

  fetchRedirectsFromCloud: async () => {
    const baseRedirects = [
      { id: 'sys-red-1', oldUrl: '/sitemap', newUrl: '/sitemap.xml', type: 301, active: true, description: 'Sitemap kısa yol yönlendirmesi', deploymentStatus: 'deployed_live', isSystem: true },
      { id: 'sys-red-2', oldUrl: '/yasal', newUrl: '/yasal/kvkk', type: 301, active: true, description: 'Yasal ana dizin KVKK yönlendirmesi', deploymentStatus: 'deployed_live', isSystem: true }
    ];
    if (!db) return baseRedirects;

    try {
      const snap = await getDocs(collection(db, 'redirects'));
      const cloudList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const mergedMap = new Map();
      baseRedirects.forEach(r => mergedMap.set(r.oldUrl, r));
      cloudList.forEach(r => mergedMap.set(r.oldUrl, r));
      return Array.from(mergedMap.values());
    } catch {
      return baseRedirects;
    }
  },

  addRedirect: async (ruleInput, existingRedirects = [], actor = null) => {
    if (!db) throw new Error('Firestore bağlantısı aktif değil.');
    const check = storageService.validateRedirectRule(ruleInput, existingRedirects);
    if (!check.valid) {
      throw new Error(check.error);
    }

    const newId = `red-${Date.now()}-${generateRandomToken(4)}`;
    const newRed = {
      id: newId,
      ...check.normalized,
      deploymentStatus: 'saved_in_db', // Canlı hosting dağıtımı (firebase.json) ile ayrılır
      lastVerifiedAt: null,
      lastHttpStatus: null,
      lastLocationHeader: null,
      createdAt: new Date().toISOString(),
      createdBy: actor?.email || auth?.currentUser?.email || 'superadmin'
    };

    await setDoc(doc(db, 'redirects', newId), newRed);
    await storageService.logAuditAction({
      action: 'redirect_created',
      module: 'redirects',
      entityId: newId,
      details: `${newRed.oldUrl} -> ${newRed.newUrl} (${newRed.type}) yönlendirmesi kaydedildi.`,
      actor
    });
    return newRed;
  },

  updateRedirect: async (id, updates, actor = null) => {
    if (!db) throw new Error('Firestore bağlantısı aktif değil.');
    await setDoc(doc(db, 'redirects', id), {
      ...updates,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    await storageService.logAuditAction({
      action: 'redirect_updated',
      module: 'redirects',
      entityId: id,
      details: `Yönlendirme kuralı (${id}) güncellendi.`,
      actor
    });
  },

  deleteRedirect: async (id, actor = null) => {
    if (!db) throw new Error('Firestore bağlantısı aktif değil.');
    await deleteDoc(doc(db, 'redirects', id));
    await storageService.logAuditAction({
      action: 'redirect_deleted',
      module: 'redirects',
      entityId: id,
      details: `Yönlendirme kuralı (${id}) silindi.`,
      actor
    });
  }
};
