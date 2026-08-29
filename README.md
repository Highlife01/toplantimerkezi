# 🏛️ Toplantı Merkezi – Türkiye Geneli Kurumsal Organizasyon Platformu & CRM

[![Live Demo](https://img.shields.io/badge/Canl%C4%B1%20Yay%C4%B1n-toplantimerkezi.web.app-amber?style=for-the-badge&logo=firebase)](https://toplantimerkezi.web.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Highlife01%2Ftoplantimerkezi-blue?style=for-the-badge&logo=github)](https://github.com/Highlife01/toplantimerkezi)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

**Toplantı Merkezi** ([www.toplantimerkezi.com.tr](https://www.toplantimerkezi.com.tr)), Türkiye'nin 81 ilinde büyük ve orta ölçekli şirketler, holdingler, kamu kurumları, belediyeler, odalar ve dernekler için anahtar teslim kurumsal organizasyon ve toplantı yönetimi hizmeti sunan B2B web platformu ve entegre CRM yönetim masasıdır.

---

## 🌟 Öne Çıkan Özellikler

### 1. 🎨 Ultra-Premium Açık Renk Kurumsal Tasarım (Executive Light Theme)
- Saf beyaz paneller (`#FFFFFF`), ferah kurumsal slate tonları (`#F8FAFC`, `#F1F5F9`) ve yüksek kontrastlı derin lacivert/siyah tipografi (`#0F172A`).
- Parlak lüks altın sarısı / bronz gradyan vurgular (`#D4AF37`, `#B89225`) ve zümrüt yeşili operasyonel rozetler.
- Sayfa değişimlerinde otomatik başa kaydırma (`ScrollToTop`) ile akıcı çoklu sayfa kullanıcı deneyimi.

### 2. 🎯 Master SEO, GEO & AI Search (Semantic Entity) Mimarisi
- **5 Uzmanlık Kümesi & Money Page Sayfaları**:
  - `/toplanti-organizasyonu` & `/sirket-toplantisi-organizasyonu`
  - `/bayi-toplantisi-organizasyonu` *(14 bölümlük derin mimari, 8 soruluk FAQ, maliyet rehberi ve hızlı teklif hunisi)*
  - `/kongre-organizasyonu` & `/konferans-organizasyonu`
  - `/kurumsal-piknik-organizasyonu` & `/kurumsal-organizasyon`
  - `/kamu-organizasyonu` & `/protokol-organizasyonu`
- **Topic Hub Kılavuzları**: `/rehber/bayi-toplantisi-rehberi`, `/rehber/kurumsal-organizasyon-rehberi` vb.
- **Yapay Zekâ (AI Search / GEO)**: ChatGPT, Gemini, Copilot ve Perplexity gibi yapay zekâ cevap sistemlerinin doğrudan bilgi çekebileceği **40–80 kelimelik net ve doğrudan cevap blokları** (`aiDirectAnswer`).
- **Coğrafi Konum (GEO) & Schema.org**: `geo.region (TR)`, `geo.position`, `ICBM` etiketleri ve JSON-LD yapılandırılmış verileri.
- **Sitemap İndeksi**: `public/sitemap.xml` master indeksi altında 7 alt XML sitemap.

### 3. 🗺️ 81 İl Şehir Rehberi & Dinamik Şehir+Hizmet Sayfaları
- Faz 1 öncelikli büyükşehirler ve Türkiye'nin 81 ilinin tamamını içeren interaktif Türkiye haritası ve dizini.
- **Antalya Özel Kümesi**: `/antalya/bayi-toplantisi`, `/antalya/bayi-toplantisi-otelleri`, `/antalya/toplanti-otelleri` vb.
- **Ankara Kamu Kümesi**: `/ankara/kamu-organizasyonu`, `/ankara/protokol-organizasyonu` vb.
- Dinamik kombinasyon rotaları (Örn: `/adana/bayi-toplantisi`, `/mersin/kurumsal-piknik`).

### 4. ⚡ 7 Adımlı Hızlı Teklif Sihirbazı (`/teklif-al`)
- Organizasyon türü, şehir, tarih/gün sayısı, katılımcı adedi, teknik modül seçimleri (LED, ses/ışık, sahne, catering, hostes vb.) ve bütçe aralığı seçimi.
- Anında CRM'e kayıt, referans talep kodu üretimi, konfeti kutlaması ve tek tıkla resmi teklif başlatma.

### 5. 💼 Güvenli Yönetim & CRM Masası (`/admin`)
- **Giriş**: PIN korumalı güvenli erişim (Varsayılan PIN: `1234`).
- **Canlı Analitik Dashboard**: Toplam lead adedi, bekleyen teklifler, onaylanan işler, toplam teklif hacmi (TL), tahmini brüt kâr (TL) ve kâr marjı (%).
- **11 Aşamalı Kanban Pipeline**:
  `Yeni Talep` → `İlk Görüşme` → `İhtiyaç Analizi` → `Mekân Araştırması` → `Maliyetlendirme` → `Teklif Hazırlanıyor` → `Teklif Gönderildi` → `Revizyon` → `Onaylandı` → `Operasyon Hazırlığı` → `Organizasyon Gerçekleşti` → `Tamamlandı`.
- **Maliyetlendirme & Kârlılık Motoru**: Mekân, Catering, Sahne, LED, Ses/Işık, Personel ve Lojistik giderlerinin girilmesiyle canlı brüt kâr ve marj (%) hesabı.
- **Resmi PDF Teklif Çıktısı (`generateProposalPdf`)**: Tek tıkla antetli, logo, kalem tablosu, KDV ve ödeme koşullarını içeren kurumsal PDF belgesi üretimi.
- **Programmatic SEO Masası**: Sayfa bazında Title, Meta Desc, H1, Intent ve Index kontrolü.
- **301/302 URL Yönlendirme Yöneticisi**: URL yönlendirme yönetimi.
- **Tedarikçi Ağı CMS**: 81 ildeki 15+ kategorideki tedarikçi veritabanı.

---

## 💻 Teknoloji Yığını

| Alan | Teknoloji | Açıklama |
|---|---|---|
| **Frontend Çatısı** | React 19 + Vite | Yüksek performanslı ve modüler modern web mimarisi |
| **Stil & Tasarım** | Tailwind CSS v4 + PostCSS | Özel executive light renk paleti ve glassmorphism |
| **İkonlar** | Lucide React | Modern kurumsal arayüz ikon seti |
| **PDF Motoru** | jsPDF + html2canvas | Antetli resmi kurumsal teklif belgesi üretimi |
| **Kutlama Efekti** | canvas-confetti | Teklif tamamlandığında mikro etkileşim |
| **Durum Yönetimi** | Reactive LocalStorage | Sayfa yenilenmeden sekmeler arası canlı CRM senkronizasyonu |
| **SEO & Analitik** | GA4 / GTM / Schema.org | B2B lead ve dönüşüm takibi |
| **Hosting & Dağıtım** | Firebase Hosting | Küresel CDN ve SPA yönlendirmesi |

---

## 📁 Proje Klasör Yapısı

```
toplantimerkezi/
├── public/
│   ├── robots.txt               # Arama motoru kuralları
│   ├── sitemap.xml              # Master sitemap index
│   ├── sitemap-pages.xml        # Kurumsal & rehber sayfaları
│   ├── sitemap-services.xml     # Money page & hizmet sayfaları
│   ├── sitemap-cities.xml       # 81 İl şehir sayfaları
│   ├── sitemap-locations.xml    # Şehir + Hizmet sayfaları
│   ├── sitemap-venues.xml       # Mekân sayfaları
│   ├── sitemap-projects.xml     # Proje & Case Study sayfaları
│   └── sitemap-blog.xml         # Blog makaleleri
├── src/
│   ├── components/
│   │   ├── common/              # Navbar, Footer, SectionTitle, ScrollToTop, WhatsApp, CookieConsent
│   │   ├── home/                # Hero, ProcessSteps, OrganizationGrid, ServicesSlider, TurkeyMap, Venues, WhyUs, Projects, Blog
│   │   └── quote/               # 7-Step QuoteWizardForm, QuoteWizardModal
│   ├── data/
│   │   ├── organizationsData.js # 9 B2B Kurumsal organizasyon verisi
│   │   ├── servicesData.js      # 10 Teknik modül hizmet verisi
│   │   ├── citiesData.js        # 81 İl tam listesi ve MICE merkezleri
│   │   ├── venuesData.js        # Kongre otelleri ve salon veritabanı
│   │   ├── projectsData.js      # Gerçekleşen referans proje case studies
│   │   ├── blogData.js          # SEO makaleleri ve rehberler
│   │   ├── suppliersData.js     # 81 İl tedarikçi satın alma ağı
│   │   └── seoClustersData.js   # 5 Master topic kümesi ve Topic Hubs
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ClusterMoneyPage.jsx # Universal Money Page (14 Bölüm, FAQ, AI Box)
│   │   ├── TopicHubPage.jsx     # Topic Hub Rehberleri
│   │   ├── OrganizationsPage.jsx & OrganizationDetailPage.jsx
│   │   ├── ServicesPage.jsx & ServiceDetailPage.jsx
│   │   ├── CitiesPage.jsx, CityDetailPage.jsx & CityServiceDetailPage.jsx
│   │   ├── VenuesPage.jsx
│   │   ├── ProjectsPage.jsx & ProjectDetailPage.jsx
│   │   ├── CorporatePage.jsx
│   │   ├── QuotePage.jsx
│   │   ├── BlogPage.jsx & BlogDetailPage.jsx
│   │   ├── ContactPage.jsx
│   │   ├── LegalPage.jsx
│   │   └── AdminPage.jsx        # Güvenli CRM, Pipeline & SEO Masası
│   ├── services/
│   │   ├── seoService.js        # Dinamik meta, canonical ve Schema.org JSON-LD
│   │   ├── analyticsService.js  # GA4 / GTM event dağıtıcı
│   │   ├── storageService.js    # Reaktif veri motoru ve finansal hesaplama
│   │   └── pdfService.js        # Resmi PDF teklif oluşturucu
│   ├── App.jsx                  # Master çoklu sayfa rütelendirmesi
│   ├── main.jsx
│   └── index.css                # Executive light tema ve tasarım tokenları
├── firebase.json                # Firebase SPA yönlendirme yapılandırması
├── .firebaserc                  # Firebase hedef ayarları
├── AGENTS.md                    # Geliştirici ve ajan rehberi
└── README.md                    # Proje dokümantasyonu
```

---

## 🚀 Kurulum ve Yerel Çalıştırma

### Gereksinimler
- Node.js (v18+)
- npm veya yarn

### Adımlar

1. **Depoyu klonlayın**:
```bash
git clone https://github.com/Highlife01/toplantimerkezi.git
cd toplantimerkezi
```

2. **Bağımlılıkları yükleyin**:
```bash
npm install
```

3. **Geliştirme sunucusunu başlatın**:
```bash
npm run dev
```
Uygulama `http://localhost:5173/` adresinde çalışacaktır.

4. **Üretim için derleyin**:
```bash
npm run build
```

5. **Firebase Hosting'e Canlıya Alın**:
```bash
npx firebase deploy --only hosting:toplantimerkezi
```

---

## 🔐 Yönetici Girişi
- **Yönetim Paneli URL'si**: `/admin`
- **Varsayılan PIN**: `1234` *(Panel içerisindeki "Site Ayarları" sekmesinden kolayca değiştirilebilir)*

---

## 📞 İletişim & Kurumsal Bilgiler

- **Marka**: Toplantı Merkezi
- **Web**: [www.toplantimerkezi.com.tr](https://www.toplantimerkezi.com.tr)
- **Canlı Yayın**: [https://toplantimerkezi.web.app](https://toplantimerkezi.web.app)
- **Çağrı Merkezi**: 0850 308 74 20
- **E-posta**: kurumsal@toplantimerkezi.com.tr

---
*© 2026 Toplantı Merkezi. Tüm hakları saklıdır. Türkiye'nin Her Yerinde, Tek Merkezden Organizasyon.*
