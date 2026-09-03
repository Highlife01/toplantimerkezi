# 🏛️ Toplantı Merkezi – Türkiye Geneli Kurumsal Organizasyon Platformu & CRM

[![Live Site](https://img.shields.io/badge/Canl%C4%B1%20Site-www.toplantimerkezi.com.tr-D4AF37?style=for-the-badge&logo=google-chrome)](https://www.toplantimerkezi.com.tr)
[![Firebase Hosting](https://img.shields.io/badge/Firebase%20Hosting-toplantimerkezi.web.app-FFCA28?style=for-the-badge&logo=firebase)](https://toplantimerkezi.web.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Highlife01%2Ftoplantimerkezi-blue?style=for-the-badge&logo=github)](https://github.com/Highlife01/toplantimerkezi)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

> **"Türkiye'nin Her Yerinde, Tek Merkezden Organizasyon."**  
> *Toplantıdan organizasyona, tüm süreç tek merkezden.*

**Toplantı Merkezi** ([www.toplantimerkezi.com.tr](https://www.toplantimerkezi.com.tr)), Türkiye'nin 81 ilinde holdingler, kurumsal şirketler, kamu kurumları, bakanlıklar, belediyeler, ticaret ve sanayi odaları ile birlikler için anahtar teslim B2B kurumsal organizasyon, bayi toplantısı, kongre, seminer ve kurumsal etkinlik çözümleri sunan yeni nesil dijital operasyon platformu ve entegre CRM yönetim masasıdır.

---

## 📌 Proje Genel Bakış & Kimlik Kartı

| Alan | Bilgi |
|---|---|
| **Marka Adı** | **Toplantı Merkezi** |
| **Resmi Web Sitesi** | [https://www.toplantimerkezi.com.tr](https://www.toplantimerkezi.com.tr) |
| **Firebase Canlı Yayın** | [https://toplantimerkezi.web.app](https://toplantimerkezi.web.app) (Site / Target: `toplantimerkezi`) |
| **GitHub Deposu** | [https://github.com/Highlife01/toplantimerkezi](https://github.com/Highlife01/toplantimerkezi) |
| **Kurumsal E-posta** | [info@toplantimerkezi.com.tr](mailto:info@toplantimerkezi.com.tr) |
| **Çağrı Merkezi** | +90 850 308 00 00 |
| **WhatsApp Operasyon Hattı** | +90 532 055 09 45 |
| **Merkez Adres** | Büyükdere Cad. No:199 Levent / Maslak Plaza, Levent, 34394 Beşiktaş / İstanbul |
| **GEO Koordinatları** | `41.0778, 29.0125` (`TR-34`, Levent / Beşiktaş / İstanbul) |
| **Google Doğrulama Kodu** | `g6AYC4crAOPoDIpqDZsZgZ4lryOuL3Jf7du_Nkp7cxQ` |
| **Faaliyet Alanı** | Yalnızca **B2B ve Kurumsal Organizasyonlar** (Bireysel tüketici etkinlikleri yapılmaz) |

---

## 🌟 Öne Çıkan Özellikler ve Modüller

### 1. 🎨 Ultra-Premium Executive Light Tasarım Sistemi
- **Zemin & Atmosfer**: Saf beyaz paneller (`#FFFFFF`), kurumsal slate zemin tonları (`#F8FAFC`, `#F1F5F9`) ve yüksek kontrastlı derin lacivert/siyah metinler (`#0F172A`).
- **Lüks Vurgular**: Parlak altın sarısı / bronz gradyanlar (`#D4AF37`, `#B89225`), zümrüt yeşili operasyonel durum rozetleri (`#059669`).
- **Tipografi**: *Plus Jakarta Sans* ve başlıklarda *Playfair Display* ile kurumsal holding kimliği.
- **Akıcı UX**: `react-router-dom` ile sayfa değişimlerinde otomatik `ScrollToTop` desteği ve sıfır sıçrama.

### 2. 🔍 SEO, GEO & AI Search (Semantic Entity) Motoru
- **5 Master SEO Topic Kümesi & Money Page Mimarisi**:
  1. **Toplantı Kümesi**: `/toplanti-organizasyonu`, `/sirket-toplantisi-organizasyonu`, `/kurumsal-toplanti`, `/yonetim-toplantisi`, `/satis-toplantisi`...
  2. **Bayi Kümesi (Primary Money Page)**: `/bayi-toplantisi-organizasyonu` *(14 özel derin bölüm, 8 soruluk detaylı FAQ akordeonu, AI doğrudan cevap kutusu ve hızlı teklif hunisi)*, `/bayi-toplantisi`, `/bayi-toplantisi-otelleri`...
  3. **Kongre & Konferans Kümesi**: `/kongre-organizasyonu`, `/konferans-organizasyonu`, `/sempozyum-organizasyonu`, `/zirve-organizasyonu`...
  4. **Kurumsal Etkinlik & Piknik**: `/kurumsal-piknik-organizasyonu`, `/kurumsal-etkinlik`, `/sirket-piknigi`, `/team-building`, `/lansman-organizasyonu`...
  5. **Kamu & Protokol Kümesi**: `/kamu-organizasyonu`, `/protokol-organizasyonu`, `/resmi-toren-organizasyonu`, `/temel-atma-toreni`...
- **AI Search & LLM Entegrasyonu**: ChatGPT, Gemini, Perplexity ve Copilot gibi yapay zekâ sistemlerinin doğrudan yanıt üretmesini sağlayan **40–80 kelimelik semantik doğrudan cevap blokları** (`aiDirectAnswer`).
- **GEO Hedefleme & Konum Meta Verileri**: `geo.region (TR-34)`, `geo.placename (Levent, Beşiktaş, İstanbul, Türkiye)`, `geo.position (41.0778;29.0125)` ve `ICBM` etiketleri.
- **Dinamik Schema.org (JSON-LD)**: `Organization`, `LocalBusiness`, `Service`, `Article`, `BlogPosting`, `BreadcrumbList`, `PostalAddress` ve `GeoCoordinates` yapılandırılmış verileri.
- **Site Haritası İndeksi**: `public/sitemap.xml` master indeksi altında 7 alt XML sitemap (`sitemap-pages.xml`, `sitemap-services.xml`, `sitemap-cities.xml`, `sitemap-locations.xml`, `sitemap-venues.xml`, `sitemap-projects.xml`, `sitemap-blog.xml`).

### 3. 🗺️ 81 İl Şehir Rehberi & Dinamik Şehir+Hizmet Ağı
- Türkiye'nin 81 ilini kapsayan interaktif harita ve dizin altyapısı (`/sehirler`).
- **Bölgesel Odak Kümeleri**:
  - **Antalya Kümesi**: `/antalya/bayi-toplantisi`, `/antalya/bayi-toplantisi-otelleri`, `/antalya/toplanti-otelleri`
  - **Ankara Kamu Kümesi**: `/ankara/kamu-organizasyonu`, `/ankara/protokol-organizasyonu`
  - **Dinamik Rotalar**: `/:sehirSlug/:hizmetSlug` veya `/sehirler/:sehirSlug/:hizmetSlug` (Örn: `/adana/bayi-toplantisi`, `/izmir/kongre-organizasyonu`).

### 4. ⚡ 7 Adımlı İnteraktif Teklif Sihirbazı (`/teklif-al`)
- **Adımlar**: Organizasyon türü → İl seçimi → Tarih & Süre → Katılımcı sayısı → Teknik modüller (LED, Sahne, Ses/Işık, Catering, Çeviri, Hostes vb.) → Bütçe aralığı → İletişim bilgileri.
- **Anında CRM Kaydı**: Otomatik talep numarası (`TM-XXXX`), konfeti kutlaması ve teklif takip portalına yönlendirme.

### 5. 💼 Executive CRM & Yönetim Masası (`/admin`)
- **Giriş Koruması**: PIN doğrulama (Varsayılan PIN: `1234`).
- **Executive Dashboard**: Toplam talep, bekleyen teklifler, onaylanan operasyonlar, toplam teklif hacmi (TL), net brüt kâr (TL) ve kâr marjı (%) göstergeleri.
- **11 Aşamalı Kanban Pipeline**:
  `Yeni Talep` → `İlk Görüşme` → `İhtiyaç Analizi` → `Mekân Araştırması` → `Maliyetlendirme` → `Teklif Hazırlanıyor` → `Teklif Gönderildi` → `Revizyon` → `Onaylandı` → `Operasyon Hazırlığı` → `Organizasyon Gerçekleşti` → `Tamamlandı`.
- **Maliyetlendirme & Kârlılık Motoru**: Mekân, Catering, Sahne, LED, Ses/Işık, Personel ve Lojistik maliyet kalemleri girilerek otomatik brüt kâr, kâr marjı ve KDV hesaplaması.
- **Resmi PDF Teklif Üreticisi (`pdfService.js`)**: Tek tıkla antetli, kurumsal formatta, detaylı kalem tablolu ve KDV dahil A4 teklif belgesi üretimi.
- **Programmatic SEO Masası**: Title, Meta Description, H1, Arama Niyeti (Intent) ve Index durumlarının anlık yönetimi.
- **Tedarikçi Ağı CMS**: 81 ilde kategorize edilmiş tedarikçi veri tabanı ve satın alma yönetimi.

---

## 💻 Teknoloji Yığını

| Katman | Teknoloji | Açıklama |
|---|---|---|
| **Frontend Kütüphanesi** | React 19 (`react`, `react-dom`) | Yüksek performanslı bileşen mimarisi |
| **Derleyici & Build Aracı** | Vite 6 / Rolldown | Ultra hızlı HMR ve optimize edilmiş üretim derlemesi |
| **Yönlendirme (Router)** | React Router DOM v7 | Çoklu sayfa SPA mimarisi ve dinamik rotalama |
| **Stil & CSS** | Tailwind CSS v4 | Yeni nesil CSS motoru, özel executive tokenlar |
| **İkon Kütüphanesi** | Lucide React | Kurumsal hafif SVG ikon seti |
| **PDF Motoru** | jsPDF + html2canvas | Antetli resmi kurumsal teklif belgesi üretimi |
| **Mikro Animasyonlar** | canvas-confetti | Teklif tamamlama mikro etkileşimleri |
| **Durum Yönetimi** | Reactive Storage Engine | Sekmeler arası canlı veri eşitlemesi & Firestore entegrasyonu |
| **Hosting & CDN** | Firebase Hosting | Küresel CDN, SSL, HTTP/2 ve SPA yönlendirmeleri |

---

## 📁 Proje Dizin Mimarisi

```
d:\web_siteleri\toplantimerkezi\
├── public/
│   ├── pwa-192x192.svg          # PWA simgeleri
│   ├── pwa-512x512.svg
│   ├── robots.txt               # Arama motoru direktifleri
│   ├── sitemap.xml              # Master sitemap indeksi
│   ├── sitemap-pages.xml        # Kurumsal & sabit sayfalar
│   ├── sitemap-services.xml     # 10 Hizmet & Para sayfaları
│   ├── sitemap-cities.xml       # 81 İl rehber sayfaları
│   ├── sitemap-locations.xml    # Şehir + Hizmet dinamik sayfaları
│   ├── sitemap-venues.xml       # Mekân ve otel salonu sayfaları
│   ├── sitemap-projects.xml     # Case study & proje sayfaları
│   └── sitemap-blog.xml         # Blog makaleleri
├── src/
│   ├── components/
│   │   ├── common/              # Navbar, Footer, SectionTitle, ScrollToTop, WhatsApp, CookieConsent
│   │   ├── home/                # Hero, ProcessSteps, OrganizationGrid, ServicesSlider, TurkeyMap, Venues, WhyUs, Projects, Blog
│   │   └── quote/               # 7-Step QuoteWizardForm, QuoteWizardModal
│   ├── data/
│   │   ├── organizationsData.js # 9 B2B Kurumsal organizasyon tipi
│   │   ├── servicesData.js      # 10 Teknik modül hizmet kataloğu
│   │   ├── citiesData.js        # 81 İl tam listesi ve MICE odak merkezleri
│   │   ├── venuesData.js        # Öne çıkan kongre otelleri ve salonlar
│   │   ├── projectsData.js      # Başarıyla tamamlanan kurumsal projeler
│   │   ├── blogData.js          # Bilgi merkezi rehber makaleleri
│   │   ├── suppliersData.js     # 81 İl tedarikçi satın alma ağı
│   │   └── seoClustersData.js   # 5 Master topic kümesi ve rehber rotaları
│   ├── pages/
│   │   ├── HomePage.jsx                 # Ana sayfa
│   │   ├── ClusterMoneyPage.jsx         # 14 Bölümlük evrensel money page şablonu
│   │   ├── TopicHubPage.jsx             # Kapsamlı topic rehberleri
│   │   ├── OrganizationsPage.jsx        # B2B Organizasyon kataloğu
│   │   ├── OrganizationDetailPage.jsx   # Organizasyon detay sayfası
│   │   ├── ServicesPage.jsx             # Hizmetler kataloğu
│   │   ├── ServiceDetailPage.jsx        # Hizmet detay sayfası
│   │   ├── CitiesPage.jsx               # 81 İl haritası ve dizini
│   │   ├── CityDetailPage.jsx           # İl detay rehberi
│   │   ├── CityServiceDetailPage.jsx    # İl + Hizmet kombine SEO sayfası
│   │   ├── VenuesPage.jsx               # Toplantı ve kongre salonları
│   │   ├── ProjectsPage.jsx             # Case study ve referanslar
│   │   ├── ProjectDetailPage.jsx        # Proje detay sayfası
│   │   ├── CorporatePage.jsx            # Kurumsal / Hakkımızda
│   │   ├── QuotePage.jsx                # Teklif alma sayfası
│   │   ├── QuoteTrackingPage.jsx        # Teklif sorgulama ve takip sayfası
│   │   ├── BlogPage.jsx                 # Blog indeksi
│   │   ├── BlogDetailPage.jsx           # Blog içerik sayfası
│   │   ├── ContactPage.jsx              # İletişim sayfası
│   │   ├── LegalPage.jsx                # KVKK, Gizlilik, Çerez, Kullanım Şartları
│   │   └── AdminPage.jsx                # Executive CRM Masası & Kanban
│   ├── services/
│   │   ├── seoService.js        # Dinamik SEO, Canonical, GEO ve JSON-LD şemaları
│   │   ├── analyticsService.js  # GA4 / GTM / Meta Pixel olay yöneticisi
│   │   ├── storageService.js    # Reaktif veri deposu ve finans motoru
│   │   ├── notificationService.js # Çok kanallı teklif bildirimleri
│   │   └── pdfService.js        # Resmi antetli kurumsal PDF teklif oluşturucu
│   ├── App.jsx                  # Master rota yapılandırması
│   ├── main.jsx                 # Uygulama giriş noktası
│   └── index.css                # Tailwind CSS v4 ve özel stil tanımları
├── firebase.json                # Firebase Hosting kuralları ve target ayarları
├── .firebaserc                  # Firebase proje hedefleri
├── AGENTS.md                    # Yapay zekâ ve geliştirici operasyon kuralları
├── package.json                 # Proje bağımlılıkları ve betikleri
├── vite.config.js               # Vite konfigürasyonu
└── README.md                    # Proje ana dokümantasyonu
```

---

## 🛠️ Kurulum ve Geliştirme

### Ön Gereksinimler
- **Node.js**: v18.0 veya üzeri
- **npm**: v9.0 veya üzeri
- **Firebase CLI**: `npm install -g firebase-tools` *(Dağıtım için)*

### 1. Depoyu İndirme ve Bağımlılıkları Yükleme
```bash
git clone https://github.com/Highlife01/toplantimerkezi.git
cd toplantimerkezi
npm install
```

### 2. Yerel Geliştirme Sunucusunu Başlatma
```bash
npm run dev
```
Uygulama yerel olarak `http://localhost:5173` adresinde açılır.

### 3. Üretim Derlemesi (Build)
```bash
npm run build
```
Çıktılar `dist/` klasörüne optimize edilmiş ve sıkıştırılmış olarak üretilir.

### 4. Firebase Hosting Dağıtımı (Deploy)
```bash
npx firebase deploy --only hosting:toplantimerkezi
```

### 5. Değişiklikleri GitHub'a Gönderme (Push)
```bash
git add .
git commit -m "feat: updates"
git push origin main
```

---

## 🔐 Yönetici Masası (CRM Masası)

- **Erişim Adresi**: `/admin` (Örn: `https://www.toplantimerkezi.com.tr/admin`)
- **Varsayılan Erişim PIN Kodu**: `1234` *(Panel içerisindeki "Site Ayarları" sekmesinden değiştirilebilir)*
- **Yönetilen Süreçler**:
  - Gelen teklif talepleri ve iletişim kayıtları
  - 11 Aşamalı görsel Kanban müşteri pipeline'ı
  - Maliyetlendirme, brüt kâr ve KDV hesaplama
  - Antetli kurumsal PDF teklif belgesi indirme
  - Programmatic SEO meta başlık ve indeks kontrolleri
  - Tedarikçi satın alma veri tabanı

---

## 📞 Kurumsal İletişim Bilgileri

- **Firma**: Toplantı Merkezi Kurumsal Organizasyon A.Ş.
- **Web Sitesi**: [www.toplantimerkezi.com.tr](https://www.toplantimerkezi.com.tr)
- **Canlı Yayın**: [https://toplantimerkezi.web.app](https://toplantimerkezi.web.app)
- **Çağrı Merkezi**: +90 850 308 00 00
- **E-posta**: [info@toplantimerkezi.com.tr](mailto:info@toplantimerkezi.com.tr)
- **WhatsApp**: +90 532 055 09 45
- **Merkez Adres**: Büyükdere Cad. No:199 Levent / Maslak Plaza, Levent, Beşiktaş, 34394 İstanbul

---

*© 2026 Toplantı Merkezi. Tüm hakları saklıdır. Türkiye'nin Her Yerinde, Tek Merkezden Organizasyon.*
