import { 
  db, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  isFirebaseInitialized 
} from './firebase';
import { notificationService } from './notificationService';
import { INITIAL_SUPPLIERS } from '../data/suppliersData';
import { VENUES } from '../data/venuesData';
import { PROJECTS } from '../data/projectsData';
import { BLOG_POSTS } from '../data/blogData';

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
  'Organizasyon Gerçekleşti',
  'Tamamlandı'
];

export const INITIAL_LEADS = [
  {
    id: 'TLP-2026-0891',
    createdAt: '2026-08-28T14:30:00Z',
    company: 'Koçak Otomotiv & Sanayi A.Ş.',
    contactName: 'Serdar Koçak',
    title: 'Genel Müdür Yardımcısı',
    phone: '+90 532 987 65 43',
    email: 'serdar.kocak@kocakoto.com.tr',
    organizationType: 'Bayi Toplantısı',
    city: 'Antalya',
    district: 'Belek',
    venueNeeded: true,
    targetDate: '2026-10-15',
    endDate: '2026-10-18',
    isMultiDay: true,
    attendees: 650,
    budgetRange: '500.000 – 1.000.000 TL',
    stage: 'Teklif Gönderildi',
    notes: '2027 yeni model lansmanı yapılacak, kavisli dev LED ekran ve gala gecesi için sanatçı orkestra talebi var.',
    requirements: ['Mekân', 'Catering', 'Sahne', 'Ses', 'Işık', 'LED ekran', 'Host/Hostes', 'Fotoğraf', 'Video', 'Sanatçı'],
    costBreakdown: {
      venue: 240000,
      catering: 260000,
      stage: 85000,
      led: 65000,
      soundLight: 70000,
      staff: 35000,
      other: 25000
    },
    quotedPrice: 960000,
    vatRate: 20,
    validityDays: 15,
    proposalNotes: 'Fiyatlarımıza tüm teknik reji, canlı yayın ve gala gecesi sanatçı riderı dahildir.'
  },
  {
    id: 'TLP-2026-0892',
    createdAt: '2026-08-28T16:15:00Z',
    company: 'Avrasya Lojistik ve Dağıtım Ltd.',
    contactName: 'Elif Şimşek',
    title: 'İnsan Kaynakları Direktörü',
    phone: '+90 533 456 78 90',
    email: 'elif.simsek@avrasyalojistik.com',
    organizationType: 'Kurumsal Piknik',
    city: 'Kocaeli',
    district: 'Kartepe / Sapanca Hattı',
    venueNeeded: true,
    targetDate: '2026-09-26',
    endDate: '2026-09-26',
    isMultiDay: false,
    attendees: 1800,
    budgetRange: '250.000 – 500.000 TL',
    stage: 'Maliyetlendirme',
    notes: 'Çalışanlar ve aileleri için barbekü istasyonları, şişme oyun alanları ve takım turnuvaları planlanıyor.',
    requirements: ['Mekân', 'Catering', 'Ses', 'Işık', 'Güvenlik', 'Sağlık ekibi', 'Host/Hostes'],
    costBreakdown: {
      venue: 80000,
      catering: 180000,
      stage: 30000,
      led: 0,
      soundLight: 40000,
      staff: 30000,
      other: 20000
    },
    quotedPrice: 480000,
    vatRate: 20,
    validityDays: 10,
    proposalNotes: '2 tam donanımlı ambulans ve 10 özel güvenlik görevlisi dahildir.'
  },
  {
    id: 'TLP-2026-0893',
    createdAt: '2026-08-29T09:00:00Z',
    company: 'Doğu Akdeniz İhracatçılar Birliği',
    contactName: 'Av. Kemal Ertekin',
    title: 'Genel Sekreter',
    phone: '+90 530 123 45 67',
    email: 'kemal.ertekin@daib.org.tr',
    organizationType: 'Kamu & Protokol',
    city: 'Adana',
    district: 'Seyhan',
    venueNeeded: false,
    targetDate: '2026-11-05',
    endDate: '2026-11-06',
    isMultiDay: true,
    attendees: 400,
    budgetRange: '250.000 – 500.000 TL',
    stage: 'Yeni Talep',
    notes: 'Bakanlık düzeyinde protokol katılımı olacaktır. Kürsü, protokol koltukları ve akreditasyon sistemi talep ediliyor.',
    requirements: ['Sahne', 'Ses', 'Işık', 'LED ekran', 'Host/Hostes', 'Fotoğraf', 'Video', 'Simultane tercüme'],
    costBreakdown: {
      venue: 0,
      catering: 80000,
      stage: 50000,
      led: 45000,
      soundLight: 40000,
      staff: 25000,
      other: 15000
    },
    quotedPrice: 350000,
    vatRate: 20,
    validityDays: 30,
    proposalNotes: 'Protokol düzeni ve canlı yayın altyapısı fiyata dahildir.'
  },
  {
    id: 'TLP-2026-0894',
    createdAt: '2026-08-29T01:45:00Z',
    company: 'Nexus Bilişim ve Finansal Yazılımlar',
    contactName: 'Mert Aksoy',
    title: 'Pazarlama Direktörü',
    phone: '+90 535 777 88 99',
    email: 'mert.aksoy@nexustech.io',
    organizationType: 'Lansman',
    city: 'İstanbul',
    district: 'Beşiktaş',
    venueNeeded: true,
    targetDate: '2026-10-30',
    endDate: '2026-10-30',
    isMultiDay: false,
    attendees: 500,
    budgetRange: '500.000 – 1.000.000 TL',
    stage: 'İhtiyaç Analizi',
    notes: 'Global fintech ürün lansmanı, 3D mapping ve lazer şovu eşliğinde Boğaz hattında bir davet salonu isteniyor.',
    requirements: ['Mekân', 'Catering', 'Sahne', 'Ses', 'Işık', 'LED ekran', 'Branding', 'Host/Hostes', 'Fotoğraf', 'Video'],
    costBreakdown: {
      venue: 180000,
      catering: 150000,
      stage: 90000,
      led: 80000,
      soundLight: 60000,
      staff: 25000,
      other: 35000
    },
    quotedPrice: 780000,
    vatRate: 20,
    validityDays: 14,
    proposalNotes: '3D Mapping ve VIP kokteyl ikramları dahildir.'
  }
];

export const INITIAL_SETTINGS = {
  companyName: 'Toplantı Merkezi Kurumsal Organizasyon A.Ş.',
  brandTitle: 'Toplantı Merkezi',
  domain: 'www.toplantimerkezi.com.tr',
  slogan: "Türkiye'nin Her Yerinde, Tek Merkezden Organizasyon.",
  subSlogan: "Toplantıdan organizasyona, tüm süreç tek merkezden.",
  phone: '+90 850 308 00 00',
  whatsappPhone: '+90 532 055 09 45',
  whatsappDisplay: '0532 055 09 45',
  email: 'info@toplantimerkezi.com.tr',
  address: 'Büyükdere Cad. No:199 Levent / Maslak Plaza, Levent, Beşiktaş, İstanbul (81 İlde Operasyon Gücü)',
  googleAnalyticsId: 'G-TOPLANTIMERKEZI',
  gtmId: 'GTM-TM81TR',
  metaPixelId: 'PIXEL-78901234',
  adminPin: '1234',
  // Çok Kanallı Bildirim Entegrasyonları
  emailNotificationsEnabled: true,
  webhookUrl: '',
  emailApiKey: '',
  smsNotificationsEnabled: true,
  smsWebhookUrl: '',
  whatsappWebhookUrl: ''
};

// Safe storage access (Client Cache for zero flicker & offline resilience)
const getItem = (key, defaultVal) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch (e) {
    console.warn(`Error reading ${key} from storage:`, e);
    return defaultVal;
  }
};

const setItem = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    window.dispatchEvent(new Event('tm_storage_updated'));
  } catch (e) {
    console.warn(`Error saving ${key} to storage:`, e);
  }
};

export const storageService = {
  // Bağlantı durumu
  isCloudConnected: () => isFirebaseInitialized && !!db,

  // ==========================================
  // 1. LEADS (TEKLİF TALEPLERİ)
  // ==========================================
  getLeads: () => getItem('tm_leads', INITIAL_LEADS),
  saveLeads: (leads) => setItem('tm_leads', leads),

  /**
   * Firestore'dan tüm talepleri asenkron çeker ve yerel önbelleği günceller
   */
  fetchLeadsFromCloud: async () => {
    if (!db) return storageService.getLeads();
    try {
      const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const cloudLeads = snapshot.docs.map(docSnap => ({
          ...docSnap.data(),
          firebaseDocId: docSnap.id
        }));
        storageService.saveLeads(cloudLeads);
        return cloudLeads;
      }
    } catch (err) {
      console.warn('[Firestore] fetchLeadsFromCloud uyarısı:', err);
    }
    return storageService.getLeads();
  },

  /**
   * Gerçek Zamanlı Talepler Aboneliği (Realtime Firestore Listener)
   */
  subscribeToLeads: (callback) => {
    // İlk render için önbellekteki veriyi hemen ver
    callback(storageService.getLeads());

    if (!db) return () => {};

    try {
      const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const cloudLeads = snapshot.docs.map(docSnap => ({
            ...docSnap.data(),
            firebaseDocId: docSnap.id
          }));
          storageService.saveLeads(cloudLeads);
          callback(cloudLeads);
        }
      }, (err) => {
        console.warn('[Firestore Realtime] Leads subscription error:', err);
      });
      return unsubscribe;
    } catch (e) {
      console.warn('[Firestore Realtime] Subscription error:', e);
      return () => {};
    }
  },

  /**
   * Yeni teklif talebi ekler (Firestore + LocalStorage + Çok Kanallı Bildirim)
   */
  addLead: async (leadData) => {
    const leads = storageService.getLeads();
    const newId = `TLP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newLead = {
      id: newId,
      createdAt: new Date().toISOString(),
      stage: 'Yeni Talep',
      costBreakdown: {
        venue: 0,
        catering: 0,
        stage: 0,
        led: 0,
        soundLight: 0,
        staff: 0,
        other: 0
      },
      quotedPrice: 0,
      vatRate: 20,
      validityDays: 15,
      ...leadData
    };

    // 1. Önbelleğe anında yaz (Anlık UI tepkisi)
    leads.unshift(newLead);
    storageService.saveLeads(leads);

    // 2. Firestore'a asenkron yaz
    if (db) {
      try {
        await setDoc(doc(db, 'leads', newId), {
          ...newLead,
          serverTimestamp: serverTimestamp()
        });
        console.log(`[Firestore] Lead "${newId}" buluta kaydedildi.`);
      } catch (err) {
        console.warn('[Firestore] Lead kaydetme uyarısı:', err);
      }
    }

    // 3. Çok Kanallı Bildirim Tetikle (E-Posta, SMS, WhatsApp)
    try {
      const settings = storageService.getSettings();
      notificationService.dispatchNewQuoteNotifications(newLead, settings);
    } catch (notifErr) {
      console.warn('[Notification Error]:', notifErr);
    }

    return newLead;
  },

  /**
   * Teklif talebini günceller (Aşama, Maliyet, PDF Verileri)
   */
  updateLead: async (id, updates) => {
    const leads = storageService.getLeads();
    const index = leads.findIndex(l => l.id === id);
    let updatedLead = null;

    if (index !== -1) {
      leads[index] = { ...leads[index], ...updates, updatedAt: new Date().toISOString() };
      storageService.saveLeads(leads);
      updatedLead = leads[index];
    }

    // Firestore'da güncelle
    if (db) {
      try {
        await updateDoc(doc(db, 'leads', id), {
          ...updates,
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        // Doküman yoksa setDoc ile oluştur
        try {
          if (updatedLead) {
            await setDoc(doc(db, 'leads', id), updatedLead);
          }
        } catch (e) {
          console.warn('[Firestore] Lead update error:', e);
        }
      }
    }

    return updatedLead;
  },

  /**
   * Talebi siler
   */
  deleteLead: async (id) => {
    const leads = storageService.getLeads().filter(l => l.id !== id);
    storageService.saveLeads(leads);

    if (db) {
      try {
        await deleteDoc(doc(db, 'leads', id));
      } catch (err) {
        console.warn('[Firestore] Lead silme uyarısı:', err);
      }
    }
  },

  /**
   * Teklif Kodu veya Telefon ile canlı talep arama
   */
  findLeadByIdOrPhone: async (codeOrPhone) => {
    const term = (codeOrPhone || '').trim().toUpperCase();
    if (!term) return null;

    // Önce yerel önbellekte ara
    const leads = storageService.getLeads();
    const localMatch = leads.find(l => 
      l.id.toUpperCase() === term || 
      l.id.replace(/[^0-9]/g, '') === term.replace(/[^0-9]/g, '') ||
      l.phone.replace(/[^0-9]/g, '').includes(term.replace(/[^0-9]/g, ''))
    );

    if (localMatch) return localMatch;

    // Firestore'da ara
    if (db) {
      try {
        const qById = query(collection(db, 'leads'), where('id', '==', term));
        const snapshot = await getDocs(qById);
        if (!snapshot.empty) {
          return snapshot.docs[0].data();
        }
      } catch (err) {
        console.warn('[Firestore] findLead query error:', err);
      }
    }

    return null;
  },

  // Maliyet & Kârlılık Hesabı
  calculateLeadFinancials: (lead) => {
    const cb = lead.costBreakdown || {};
    const totalCost = (Number(cb.venue) || 0) +
      (Number(cb.catering) || 0) +
      (Number(cb.stage) || 0) +
      (Number(cb.led) || 0) +
      (Number(cb.soundLight) || 0) +
      (Number(cb.staff) || 0) +
      (Number(cb.other) || 0);

    const quoted = Number(lead.quotedPrice) || 0;
    const grossProfit = quoted - totalCost;
    const margin = quoted > 0 ? ((grossProfit / quoted) * 100) : 0;
    const vat = quoted * ((lead.vatRate || 20) / 100);
    const grandTotal = quoted + vat;

    return {
      totalCost,
      quotedPrice: quoted,
      grossProfit,
      marginPercent: Math.round(margin * 10) / 10,
      vatAmount: vat,
      grandTotal
    };
  },

  // ==========================================
  // 2. TEDARİKÇİLER (SUPPLIERS)
  // ==========================================
  getSuppliers: () => getItem('tm_suppliers', INITIAL_SUPPLIERS),
  saveSuppliers: (suppliers) => setItem('tm_suppliers', suppliers),
  
  addSupplier: async (supplier) => {
    const list = storageService.getSuppliers();
    const newId = `sup-${Date.now()}`;
    const newSup = { id: newId, completedJobs: 0, ...supplier };
    list.unshift(newSup);
    storageService.saveSuppliers(list);

    if (db) {
      try {
        await setDoc(doc(db, 'suppliers', newId), newSup);
      } catch (e) {
        console.warn('[Firestore] Supplier add error:', e);
      }
    }
    return newSup;
  },

  updateSupplier: async (id, updates) => {
    const list = storageService.getSuppliers();
    const idx = list.findIndex(s => s.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      storageService.saveSuppliers(list);

      if (db) {
        try {
          await updateDoc(doc(db, 'suppliers', id), updates);
        } catch (e) {
          console.warn('[Firestore] Supplier update error:', e);
        }
      }
      return list[idx];
    }
    return null;
  },

  deleteSupplier: async (id) => {
    const list = storageService.getSuppliers().filter(s => s.id !== id);
    storageService.saveSuppliers(list);
    if (db) {
      try {
        await deleteDoc(doc(db, 'suppliers', id));
      } catch (e) {
        console.warn('[Firestore] Supplier delete error:', e);
      }
    }
  },

  // ==========================================
  // 3. STATİK & CMS VERİLERİ (MEKÂNLAR, PROJELER, BLOG)
  // ==========================================
  getVenues: () => getItem('tm_venues', VENUES),
  saveVenues: (venues) => setItem('tm_venues', venues),

  getProjects: () => getItem('tm_projects', PROJECTS),
  saveProjects: (projects) => setItem('tm_projects', projects),

  getBlogPosts: () => getItem('tm_blogs', BLOG_POSTS),
  saveBlogPosts: (posts) => setItem('tm_blogs', posts),

  // ==========================================
  // 4. SİSTEM VE ENTEGRASYON AYARLARI (SETTINGS)
  // ==========================================
  getSettings: () => {
    const saved = getItem('tm_settings', INITIAL_SETTINGS);
    let needsUpdate = false;
    if (saved && (saved.email === 'teklif@toplantimerkezi.com.tr' || saved.email === 'kurumsal@toplantimerkezi.com.tr')) {
      saved.email = 'info@toplantimerkezi.com.tr';
      needsUpdate = true;
    }
    if (saved && (!saved.domain || saved.domain !== 'www.toplantimerkezi.com.tr')) {
      saved.domain = 'www.toplantimerkezi.com.tr';
      needsUpdate = true;
    }
    if (needsUpdate) {
      setItem('tm_settings', saved);
    }
    return saved;
  },
  saveSettings: async (settings) => {
    setItem('tm_settings', settings);
    if (db) {
      try {
        await setDoc(doc(db, 'settings', 'general_config'), settings);
      } catch (e) {
        console.warn('[Firestore] Settings save error:', e);
      }
    }
  },

  // ==========================================
  // 5. PROGRAMMATIC SEO SAYFALARI
  // ==========================================
  getSeoPages: () => getItem('tm_seo_pages', [
    { slug: 'bayi-toplantisi-organizasyonu', title: 'Bayi Toplantısı Organizasyonu | Türkiye Geneli', h1: 'Profesyonel Bayi Toplantısı Organizasyonu', metaDesc: 'Bayi toplantısı organizasyonu: Mekân seçimi, dev LED ekran, sahne tasarımı, gala gecesi, sanatçı ve ödül töreni.', isIndexed: true, focusTopic: 'Bayi Toplantısı', searchIntent: 'Transactional', author: 'Toplantı Merkezi Kurumsal Masası', lastUpdated: '2026-08-29' },
    { slug: 'sirket-toplantisi-organizasyonu', title: 'Şirket Toplantısı Organizasyonu | Toplantı Merkezi', h1: 'Şirket Toplantısı Organizasyonu', metaDesc: 'Kurumsal şirket toplantısı organizasyonları için 5 yıldızlı otel salonları, teknik reji ve simultane tercüme.', isIndexed: true, focusTopic: 'Şirket Toplantısı', searchIntent: 'Transactional', author: 'Toplantı Merkezi Kurumsal Masası', lastUpdated: '2026-08-29' },
    { slug: 'kurumsal-piknik-organizasyonu', title: 'Kurumsal Piknik & Şirket Pikniği Organizasyonu | Toplantı Merkezi', h1: 'Kurumsal Piknik ve Şirket Pikniği Organizasyonu', metaDesc: 'Şirket pikniği ve kurumsal aile günü: Barbekü catering, şişme oyun parkurları, sunucu, DJ ve takım oyunları.', isIndexed: true, focusTopic: 'Kurumsal Piknik', searchIntent: 'Transactional', author: 'Toplantı Merkezi Kurumsal Masası', lastUpdated: '2026-08-29' },
    { slug: 'kongre-organizasyonu', title: 'Kongre Organizasyonu Firması | Türkiye Geneli | Toplantı Merkezi', h1: 'Profesyonel Kongre Organizasyonu (PCO)', metaDesc: 'Tıp, bilim ve sektör kongreleri için salon planlama, simultane çeviri ve sponsorluk alanı yönetimi.', isIndexed: true, focusTopic: 'Kongre Organizasyonu', searchIntent: 'Transactional', author: 'Toplantı Merkezi Kurumsal Masası', lastUpdated: '2026-08-29' },
    { slug: 'kamu-organizasyonu', title: 'Kamu Organizasyonu & Resmî Protokol Yönetimi | Toplantı Merkezi', h1: 'Kamu ve Resmî Protokol Organizasyonları', metaDesc: 'Kamu kurumları ve belediyeler için devlet protokol kurallarına tam uyumlu organizasyon yönetimi.', isIndexed: true, focusTopic: 'Kamu & Protokol', searchIntent: 'Transactional', author: 'Toplantı Merkezi Kurumsal Masası', lastUpdated: '2026-08-29' }
  ]),
  saveSeoPages: (pages) => setItem('tm_seo_pages', pages),
  updateSeoPage: async (slug, updates) => {
    const pages = storageService.getSeoPages();
    const idx = pages.findIndex(p => p.slug === slug);
    let updatedPage = null;
    if (idx !== -1) {
      pages[idx] = { ...pages[idx], ...updates, lastUpdated: new Date().toISOString().split('T')[0] };
      updatedPage = pages[idx];
    } else {
      updatedPage = { slug, lastUpdated: new Date().toISOString().split('T')[0], ...updates };
      pages.push(updatedPage);
    }
    storageService.saveSeoPages(pages);

    if (db) {
      try {
        await setDoc(doc(db, 'seo_pages', slug), updatedPage);
      } catch (e) {
        console.warn('[Firestore] SEO page save error:', e);
      }
    }
  },

  // ==========================================
  // 6. 301 / 302 YÖNLENDİRMELER (REDIRECTS)
  // ==========================================
  getRedirects: () => getItem('tm_redirects', [
    { id: 'red-1', oldUrl: '/bayi-toplantilari', newUrl: '/bayi-toplantisi-organizasyonu', type: 301, active: true },
    { id: 'red-2', oldUrl: '/sirket-etkinligi', newUrl: '/sirket-toplantisi-organizasyonu', type: 301, active: true },
    { id: 'red-3', oldUrl: '/piknik-organizasyonu', newUrl: '/kurumsal-piknik-organizasyonu', type: 301, active: true }
  ]),
  saveRedirects: (redirects) => setItem('tm_redirects', redirects),
  addRedirect: async (oldUrl, newUrl, type = 301) => {
    const list = storageService.getRedirects();
    const newId = `red-${Date.now()}`;
    const newRed = { id: newId, oldUrl, newUrl, type: Number(type), active: true, createdAt: new Date().toISOString() };
    list.unshift(newRed);
    storageService.saveRedirects(list);

    if (db) {
      try {
        await setDoc(doc(db, 'redirects', newId), newRed);
      } catch (e) {
        console.warn('[Firestore] Redirect add error:', e);
      }
    }
    return newRed;
  },
  deleteRedirect: async (id) => {
    const list = storageService.getRedirects().filter(r => r.id !== id);
    storageService.saveRedirects(list);

    if (db) {
      try {
        await deleteDoc(doc(db, 'redirects', id));
      } catch (e) {
        console.warn('[Firestore] Redirect delete error:', e);
      }
    }
  },

  // ==========================================
  // 7. TEK TIKLA FIRESTORE VERİ AKTARIMI (BULUT SEED & SYNC)
  // ==========================================
  seedFirestoreData: async () => {
    if (!db) {
      throw new Error('Firebase Firestore bağlantısı aktif değil.');
    }

    let insertedLeads = 0;
    let insertedSuppliers = 0;

    // 1. Leads aktar
    const leads = storageService.getLeads();
    for (const lead of leads) {
      await setDoc(doc(db, 'leads', lead.id), lead);
      insertedLeads++;
    }

    // 2. Suppliers aktar
    const suppliers = storageService.getSuppliers();
    for (const sup of suppliers) {
      await setDoc(doc(db, 'suppliers', sup.id), sup);
      insertedSuppliers++;
    }

    // 3. Settings aktar
    const settings = storageService.getSettings();
    await setDoc(doc(db, 'settings', 'general_config'), settings);

    console.log(`[Firestore Seed] Başarıyla aktarıldı: ${insertedLeads} Lead, ${insertedSuppliers} Tedarikçi, Ayarlar.`);
    return { insertedLeads, insertedSuppliers };
  }
};
