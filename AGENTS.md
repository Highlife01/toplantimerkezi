# AGENTS.md – Toplantı Merkezi Developer & Agent Guide

Bu belge, **Toplantı Merkezi** ([www.toplantimerkezi.com.tr](https://www.toplantimerkezi.com.tr)) projesinde çalışacak yapay zekâ asistanları (AI Agents), geliştiriciler ve teknik ekipler için operasyonel kuralları, mimari standartları ve sistem haritasını içerir.

---

## 📌 1. Proje Özeti & Temel Kurallar

- **Marka**: Toplantı Merkezi
- **Domain**: [https://www.toplantimerkezi.com.tr](https://www.toplantimerkezi.com.tr)
- **Slogan**: *Türkiye'nin Her Yerinde, Tek Merkezden Organizasyon.*
- **Alt Slogan**: *Toplantıdan organizasyona, tüm süreç tek merkezden.*
- **Faaliyet Alanı**: Yalnızca **B2B ve kurumsal organizasyonlar** (Holdingler, büyük/orta ölçekli şirketler, kamu kurumları, belediyeler, odalar, bankalar, otomotiv, sanayi vb.). Bireysel tüketici etkinlikleri (düğün, kına vb.) kesinlikle yapılmaz.
- **Kısıtlama / Kalite Kuralı**: Asla sahte referans, sahte müşteri yorumu, sahte ödül veya thin content üretilmez. Bütün veriler gerçek kurumsal operasyon mantığına uygun olmalıdır.
- **Çalışma Dizini**: Yalnızca `d:\web_siteleri\toplantimerkezi` klasörü içerisinde çalışılır.

---

## 🎨 2. Tasarım & UI Standartları (Executive Light Theme)

- **Tasarım Dili**: Yüksek prestijli, kurumsal ve ferah **Açık Renk (Light Theme)**.
- **Zeminler**: Saf beyaz (`#FFFFFF`), kurumsal slate (`#F8FAFC`, `#F1F5F9`).
- **Tipografi**: Yüksek kontrastlı derin siyah/lacivert (`#0F172A`, `#1E293B`, `#080E1E`). Fontlar: *Plus Jakarta Sans* ve başlıklarda *Playfair Display*.
- **Vurgu Renkleri**: Parlak lüks altın sarısı / bronz gradyanlar (`#D4AF37`, `#B89225`, `#996515`) ve zümrüt yeşili operasyon rozetleri (`#059669`).
- **Glassmorphism**: Beyaz zemin üzerinde zarif mikro sınırlar (`border-slate-200` / `border-slate-300`) ve yumuşak gölgeler (`shadow-sm`, `shadow-xl`).

---

## 🗺️ 3. Sayfa Mimarisi & Rotalama (`src/App.jsx`)

Uygulama `react-router-dom` ile tam çoklu sayfa mimarisi ve sayfa değişimlerinde otomatik `ScrollToTop` desteğiyle çalışır:

### 3.1. 5 Temel SEO Topic Kümesi & Money Page Rotaları
1. **Toplantı Kümesi**:
   - `/toplanti-organizasyonu`
   - `/sirket-toplantisi-organizasyonu`
   - `/sirket-toplantisi`, `/kurumsal-toplanti`, `/yonetim-toplantisi`, `/satis-toplantisi`, `/motivasyon-toplantisi`, `/yil-sonu-toplantisi`, `/strateji-toplantisi`, `/donem-toplantisi`
2. **Bayi Kümesi (Primary Money Page)**:
   - `/bayi-toplantisi-organizasyonu` (14 özel bölüm, 8 soruluk FAQ, AI doğrudan cevap bloğu)
   - `/bayi-toplantisi`, `/bayi-bulusmasi`, `/bayi-lansmani`, `/bayi-egitimi`, `/bayi-motivasyon-toplantisi`, `/bayi-toplantisi-otelleri`
3. **Kongre & Konferans Kümesi**:
   - `/kongre-organizasyonu`, `/konferans-organizasyonu`, `/sempozyum-organizasyonu`, `/zirve-organizasyonu`, `/calistay-organizasyonu`, `/panel-organizasyonu`, `/seminer-organizasyonu`, `/egitim-organizasyonu`
4. **Kurumsal Etkinlik & Piknik**:
   - `/kurumsal-piknik-organizasyonu`, `/kurumsal-organizasyon`, `/kurumsal-etkinlik`, `/kurumsal-piknik`, `/sirket-piknigi`, `/personel-etkinligi`, `/aile-gunu-organizasyonu`, `/team-building`, `/gala-organizasyonu`, `/odul-toreni`, `/lansman-organizasyonu`, `/acilis-organizasyonu`, `/roadshow-organizasyonu`
5. **Kamu & Protokol Kümesi**:
   - `/kamu-organizasyonu`, `/protokol-organizasyonu`, `/resmi-toren-organizasyonu`, `/kamu-toplantisi`, `/acilis-toreni`, `/temel-atma-toreni`

### 3.2. Topic Hub Rehberleri
- `/rehber/bayi-toplantisi-rehberi`
- `/rehber/kurumsal-organizasyon-rehberi`
- `/rehber/kongre-organizasyonu-rehberi`
- `/rehber/kurumsal-piknik-rehberi`
- `/rehber/toplanti-organizasyonu-rehberi`

### 3.3. Kurumsal, Şehir ve Katalog Rotaları
- `/` – Ana Sayfa (Hero, Canlı Metrikler, 5 Adımda Süreç, 9 B2B Organizasyon, 10 Hizmet, 81 İl Haritası, Öne Çıkan Mekânlar, Neden Biz, Projeler, Blog)
- `/organizasyonlar` & `/organizasyonlar/:slug` – 9 B2B organizasyon kataloğu ve detayları
- `/hizmetler` & `/hizmetler/:slug` – 10 Teknik modül kataloğu ve detayları
- `/sehirler` & `/sehirler/:sehirSlug` – 81 İl şehir rehberi ve odak MICE merkezleri
- `/sehirler/:sehirSlug/:hizmetSlug` & `/:sehirSlug/:hizmetSlug` – Dinamik Şehir + Hizmet SEO sayfaları (Örn: `/antalya/bayi-toplantisi`, `/ankara/kamu-organizasyonu`)
- `/mekanlar` – Filtreli toplantı ve kongre salonu arama motoru
- `/projeler` & `/projeler/:slug` – Case studies ve başarı hikayeleri
- `/kurumsal` – Hakkımızda, misyon, vizyon, kalite standartları
- `/teklif-al` – 7 Adımlı interaktif hızlı teklif portalı
- `/blog` & `/blog/:slug` – Bilgi merkezi ve makaleler
- `/iletisim` – Çağrı merkezi, WhatsApp, iletişim formu
- `/yasal/:type` – KVKK, Gizlilik, Çerez, Kullanım Koşulları
- `/admin` – Güvenli Yönetim & CRM Masası (Giriş PIN: `1234`)

---

## 🔍 4. SEO, GEO & AI Search Sistemi

1. **AI Search & Semantic Entity**: ChatGPT, Gemini, Copilot ve Perplexity gibi yapay zekâ cevap sistemleri için her money page'de 40–80 kelimelik `aiDirectAnswer` bloğu bulunur.
2. **Coğrafi Konum (GEO)**: `index.html` ve `seoService.js` üzerinde `geo.region (TR)`, `geo.placename`, `geo.position (39.9334;32.8597)` ve `ICBM` etiketleri tanımlıdır.
3. **Yapılandırılmış Veri (JSON-LD)**: `Organization`, `LocalBusiness`, `Service`, `Article`, `BreadcrumbList`, `GeoCoordinates` şemaları dinamik olarak enjekte edilir.
4. **Sitemap İndeksi**: `public/sitemap.xml` master indeksi altında 7 alt sitemap (`sitemap-pages.xml`, `sitemap-services.xml`, `sitemap-cities.xml`, `sitemap-locations.xml`, `sitemap-venues.xml`, `sitemap-projects.xml`, `sitemap-blog.xml`) yer alır.
5. **GA4 / GTM Event Takip Motoru (`src/services/analyticsService.js`)**: `generate_lead`, `quote_form_start`, `quote_form_complete`, `phone_click`, `whatsapp_click`, `venue_view`, `service_view`, `city_page_view` eventlerini tetikler.

---

## 💼 5. CRM & Yönetim Masası (`/admin`)

- **Giriş Koruması**: PIN doğrulama (Varsayılan PIN: `1234`, ayarlardan değiştirilebilir).
- **Executive Dashboard**: Toplam lead adedi, bekleyen teklifler, onaylanan işler, toplam teklif hacmi (TL), brüt kâr (TL) ve kâr marjı (%) göstergeleri.
- **11 Aşamalı Kanban Pipeline**:
  `Yeni Talep` → `İlk Görüşme` → `İhtiyaç Analizi` → `Mekân Araştırması` → `Maliyetlendirme` → `Teklif Hazırlanıyor` → `Teklif Gönderildi` → `Revizyon` → `Onaylandı` → `Operasyon Hazırlığı` → `Organizasyon Gerçekleşti` → `Tamamlandı`.
- **Maliyetlendirme & Kârlılık Motoru**: Mekân, Catering, Sahne, LED, Ses/Işık, Personel ve Lojistik maliyetleri girilerek otomatik brüt kâr ve marj (%) hesabı.
- **Resmi PDF Teklif Üreticisi (`src/services/pdfService.js`)**: Tek tıkla antetli, kalem tablolu, KDV dahil A4 formatında kurumsal teklif belgesi üretir.
- **Programmatic SEO Masası**: Sayfa bazında Title, Meta Description, H1, Intent, Canonical ve Index durumu yönetimi.
- **301/302 Redirect Manager**: URL yönlendirme yönetimi.
- **Tedarikçi Ağı Veritabanı**: 81 ildeki tedarikçilerin yönetimi, fiyat seviyesi ve puanlaması.

---

## 🛠️ 6. Geliştirme, Derleme & Dağıtım

```bash
# Bağımlılıkları yükleme
npm install

# Yerel geliştirme sunucusu
npm run dev

# Üretim derlemesi (dist/)
npm run build

# Firebase Hosting Dağıtımı
npx firebase deploy --only hosting:toplantimerkezi

# GitHub Güncelleme
git add .
git commit -m "feat: updates"
git push origin main
```

- **Canlı Yayın**: [https://toplantimerkezi.web.app](https://toplantimerkezi.web.app)
- **GitHub Deposu**: [https://github.com/Highlife01/toplantimerkezi](https://github.com/Highlife01/toplantimerkezi)
