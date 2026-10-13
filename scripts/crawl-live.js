import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

const DOMAIN = 'https://www.toplantimerkezi.com.tr';

async function crawl() {
  console.log('====================================================');
  console.log('🚀 TOPLANTI MERKEZİ - CANLI SUNUCU CRAWL & DOĞRULAMA');
  console.log('====================================================\n');

  // 1. Gather all sitemap URLs
  const sitemapFiles = fs.readdirSync(publicDir).filter(f => f.startsWith('sitemap-') && f.endsWith('.xml'));
  const urls = [];

  for (const file of sitemapFiles) {
    const content = fs.readFileSync(path.join(publicDir, file), 'utf-8');
    const locs = content.match(/<loc>(.*?)<\/loc>/g) || [];
    locs.forEach(l => {
      const u = l.replace(/<\/?loc>/g, '');
      urls.push({ file, url: u });
    });
  }

  console.log(`[1] Toplam Taranacak Canlı URL: ${urls.length}\n`);

  let successCount = 0;
  let canonicalHomepageFails = 0;
  let otherCanonicalFails = 0;
  let statusFails = 0;
  const errors = [];

  const BATCH_SIZE = 12;
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async item => {
        try {
          const res = await fetch(item.url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; ToplantiMerkeziSeoBot/1.0)'
            }
          });

          if (res.status !== 200) {
            statusFails++;
            errors.push(`[HTTP ${res.status}] ${item.url}`);
            return;
          }

          const html = await res.text();
          const match = html.match(/<link rel=["']canonical["'] href=["'](.*?)["']/);
          const canonical = match ? match[1] : null;

          const urlObj = new URL(item.url);
          const isHome = urlObj.pathname === '/' || urlObj.pathname === '';

          if (!canonical) {
            otherCanonicalFails++;
            errors.push(`[Canonical Yok] ${item.url}`);
          } else if (!isHome && (canonical === `${DOMAIN}/` || canonical === DOMAIN)) {
            canonicalHomepageFails++;
            errors.push(`[HOMEPAGE CANONICAL HATASI] ${item.url} -> ${canonical}`);
          } else if (canonical === item.url || (isHome && (canonical === item.url || canonical === `${item.url}/`))) {
            successCount++;
          } else {
            otherCanonicalFails++;
            errors.push(`[Canonical Uyumsuz] ${item.url} -> ${canonical}`);
          }
        } catch (err) {
          statusFails++;
          errors.push(`[Bağlantı Hatası] ${item.url}: ${err.message}`);
        }
      })
    );
    process.stdout.write(`\rİlerleme: ${Math.min(i + BATCH_SIZE, urls.length)} / ${urls.length} tarandı...`);
  }

  console.log('\n\n--- CANLI SİTEMAP DOĞRULAMA RAPORU ---');
  console.log(`✅ Kusursuz 200 OK & Kendine İşaret Eden Canonical: ${successCount} / ${urls.length}`);
  console.log(`❌ Hatalı Ana Sayfa Canonical Dönenler: ${canonicalHomepageFails}`);
  console.log(`❌ Diğer Canonical Uyumsuzlukları: ${otherCanonicalFails}`);
  console.log(`❌ 200 Dışında Status Verenler: ${statusFails}`);

  if (errors.length > 0) {
    console.log('\nHatalı URL Listesi (İlk 15):');
    errors.slice(0, 15).forEach(e => console.log('  ' + e));
  }

  // 2. Test 404 behavior on non-existent URLs
  console.log('\n[2] Bulunmayan URL 404 Testi:');
  const test404Urls = [
    `${DOMAIN}/bu-sayfa-kesinlikle-yok-404-test`,
    `${DOMAIN}/sehirler/mars-gezegeni/bayi-toplantisi`,
    `${DOMAIN}/hizmetler/olmayan-teknik-hizmet-999`
  ];

  for (const testUrl of test404Urls) {
    try {
      const res = await fetch(testUrl);
      console.log(`  ${testUrl} -> HTTP ${res.status} ${res.status === 404 ? '✅ (Başarılı: 404 döndü)' : '❌ (Hata: 404 dönmedi!)'}`);
    } catch (err) {
      console.error(`  ${testUrl} -> Bağlantı hatası: ${err.message}`);
    }
  }

  // 3. Test non-www to www 301 redirects
  console.log('\n[3] non-www -> www 301 Yönlendirme Testi:');
  const nonWwwUrls = [
    'https://toplantimerkezi.com.tr/',
    'https://toplantimerkezi.com.tr/bayi-toplantisi-organizasyonu',
    'https://toplantimerkezi.com.tr/sehirler/istanbul/bayi-toplantisi'
  ];

  for (const nUrl of nonWwwUrls) {
    try {
      const res = await fetch(nUrl, { redirect: 'manual' });
      const location = res.headers.get('location');
      const expected = nUrl.replace('https://toplantimerkezi.com.tr', 'https://www.toplantimerkezi.com.tr');
      const is301 = res.status === 301 || res.status === 308 || res.status === 302;
      const isCorrectDest = location === expected || location === expected.replace(/\/$/, '');
      console.log(`  ${nUrl} -> Status: ${res.status}, Location: ${location} ${is301 && isCorrectDest ? '✅ (Başarılı: 301 www\'ye yönlendi)' : '❌'}`);
    } catch (err) {
      console.error(`  ${nUrl} -> Hata: ${err.message}`);
    }
  }

  console.log('\n====================================================');
  if (successCount === urls.length && canonicalHomepageFails === 0 && otherCanonicalFails === 0 && statusFails === 0) {
    console.log('🎉 TEBRİKLER: CANLI TESTLERİN TAMAMI %100 BAŞARILI!');
  } else {
    console.log('⚠️ DİKKAT: Bazı testler başarısız oldu, lütfen hataları inceleyin.');
  }
  console.log('====================================================\n');
}

crawl();
