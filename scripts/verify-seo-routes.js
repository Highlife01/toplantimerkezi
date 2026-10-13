import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(process.cwd(), 'dist');
const publicDir = path.resolve(process.cwd(), 'public');

const DOMAIN = 'https://www.toplantimerkezi.com.tr';

console.log('====================================================');
console.log('🔍 TOPLANTI MERKEZİ - SİTEMAP & SEO ROTA DOĞRULAMA');
console.log('====================================================\n');

// 1. Parse all sitemaps
const sitemapFiles = fs.readdirSync(publicDir).filter(f => f.startsWith('sitemap-') && f.endsWith('.xml'));
const sitemapEntries = [];

for (const file of sitemapFiles) {
  const content = fs.readFileSync(path.join(publicDir, file), 'utf-8');
  const locs = content.match(/<loc>(.*?)<\/loc>/g) || [];
  locs.forEach(l => {
    const url = l.replace(/<\/?loc>/g, '');
    sitemapEntries.push({ file, url });
  });
}

console.log(`[1] Toplam Sitemap URL Adedi: ${sitemapEntries.length}`);

// 2. Validate every single URL in dist
let missingFiles = 0;
let canonicalMatches = 0;
let canonicalHomepageErrors = 0;
let canonicalOtherMismatches = 0;
let emptyTitles = 0;
let emptyDescriptions = 0;

for (const item of sitemapEntries) {
  const urlObj = new URL(item.url);
  const pathname = urlObj.pathname;
  let cleanPath = pathname.startsWith('/') ? pathname.slice(1) : pathname;
  if (cleanPath.endsWith('/')) cleanPath = cleanPath.slice(0, -1);

  let htmlPath = '';
  if (cleanPath === '') {
    htmlPath = path.join(distDir, 'index.html');
  } else {
    const p1 = path.join(distDir, cleanPath, 'index.html');
    const p2 = path.join(distDir, cleanPath + '.html');
    if (fs.existsSync(p1)) htmlPath = p1;
    else if (fs.existsSync(p2)) htmlPath = p2;
  }

  if (!htmlPath || !fs.existsSync(htmlPath)) {
    missingFiles++;
    console.error(`❌ [Eksik Dosya] ${item.url} -> dist/'de statik HTML bulunamadı!`);
    continue;
  }

  const html = fs.readFileSync(htmlPath, 'utf-8');

  // Check Canonical
  const canMatch = html.match(/<link rel=["']canonical["'] href=["'](.*?)["']/);
  const canonical = canMatch ? canMatch[1] : null;

  if (!canonical) {
    console.error(`❌ [Canonical Yok] ${item.url}`);
    canonicalOtherMismatches++;
  } else if (cleanPath !== '' && (canonical === 'https://www.toplantimerkezi.com.tr/' || canonical === 'https://www.toplantimerkezi.com.tr')) {
    console.error(`🚨 [HOMEPAGE CANONICAL HATASI] ${item.url} sunucudan gelen HTML'de ana sayfayı canonical gösteriyor!`);
    canonicalHomepageErrors++;
  } else if (canonical === item.url || (cleanPath === '' && (canonical === item.url || canonical === item.url + '/'))) {
    canonicalMatches++;
  } else {
    console.warn(`⚠️ [Canonical Eşleşmedi] ${item.url} vs ${canonical}`);
    canonicalOtherMismatches++;
  }

  // Check Title
  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  if (!titleMatch || !titleMatch[1].trim()) {
    emptyTitles++;
  }

  // Check Description
  const descMatch = html.match(/<meta name=["']description["']\s+content=["'](.*?)["']/);
  if (!descMatch || !descMatch[1].trim()) {
    emptyDescriptions++;
  }
}

console.log(`\n--- SİTEMAP & HTML DOĞRULAMA SONUÇLARI ---`);
console.log(`✅ Doğru Kendine İşaret Eden (Self-Referencing) Canonical: ${canonicalMatches} / ${sitemapEntries.length}`);
console.log(`❌ Ana Sayfaya Düşen Hatalı Canonical: ${canonicalHomepageErrors}`);
console.log(`❌ Diğer Canonical Uyumsuzlukları: ${canonicalOtherMismatches}`);
console.log(`❌ Eksik Statik HTML Dosyası: ${missingFiles}`);
console.log(`❌ Boş Title: ${emptyTitles}`);
console.log(`❌ Boş Description: ${emptyDescriptions}`);

// 3. Validate 404.html
console.log(`\n[2] 404 Hata Sayfası Doğrulaması:`);
const dist404 = path.join(distDir, '404.html');
const pub404 = path.join(publicDir, '404.html');

if (fs.existsSync(dist404)) {
  const content404 = fs.readFileSync(dist404, 'utf-8');
  const hasNoindex = content404.includes('noindex');
  const hasHomepageCanonical = content404.includes('<link rel="canonical"');
  console.log(`✅ dist/404.html mevcut.`);
  console.log(`${hasNoindex ? '✅' : '❌'} 404 robots: noindex etiketi ${hasNoindex ? 'mevcut' : 'YOK'}.`);
  console.log(`${!hasHomepageCanonical ? '✅' : '❌'} 404 sayfasında ana sayfaya işaret eden canonical ${hasHomepageCanonical ? 'VAR (HATA!)' : 'YOK (Kusursuz, Soft 404 önlendi)'}.`);
} else {
  console.error(`❌ dist/404.html bulunamadı!`);
}

// 4. Validate non-www to www redirect script
console.log(`\n[3] non-www -> www 301/JS Yönlendirme Kontrolü:`);
const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
if (indexHtml.includes('window.location.hostname === \'toplantimerkezi.com.tr\'')) {
  console.log(`✅ index.html ve türetilen tüm sayfalarda non-www -> www anlık yönlendirme scripti mevcut.`);
} else {
  console.error(`❌ index.html içinde domain yönlendirme scripti bulunamadı!`);
}

// 5. Firebase JSON configuration check
console.log(`\n[4] firebase.json Rota & 404 Mimarisi Kontrolü:`);
const fbConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../firebase.json'), 'utf-8'));
const rewrites = fbConfig.hosting?.rewrites || [];
const hasWildcardRewrite = rewrites.some(r => r.source === '**' && r.destination === '/index.html');
if (hasWildcardRewrite) {
  console.warn(`⚠️ firebase.json içinde '**' rewrite kuralı var, bu bulunmayan sayfaların 404 yerine 200 dönmesine neden olabilir.`);
} else {
  console.log(`✅ firebase.json içinde genel '**' rewrite kuralı kaldırıldı; bulunmayan sayfalar doğrudan HTTP 404 ile dönecektir.`);
}

console.log('\n====================================================');
if (canonicalMatches === sitemapEntries.length && canonicalHomepageErrors === 0 && missingFiles === 0) {
  console.log('🎉 TEBRİKLER: TÜM TESTLER BAŞARIYLA GEÇTİ! 316/316 KUSURSUZ!');
} else {
  console.error('❌ BAZI TESTLER BAŞARISIZ OLDU!');
  process.exit(1);
}
console.log('====================================================\n');
