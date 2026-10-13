import fs from 'fs';
import path from 'path';
import https from 'https';

const HOST = 'toplantimerkezi.web.app';
const publicDir = path.resolve(process.cwd(), 'public');

// Parse all sitemaps
const sitemapFiles = fs.readdirSync(publicDir).filter(f => f.startsWith('sitemap-') && f.endsWith('.xml'));
const allUrls = [];

for (const file of sitemapFiles) {
  const content = fs.readFileSync(path.join(publicDir, file), 'utf-8');
  const locs = content.match(/<loc>(.*?)<\/loc>/g) || [];
  locs.forEach(l => {
    const url = l.replace(/<\/?loc>/g, '');
    allUrls.push({ file, url });
  });
}

console.log(`📡 SİTEMAP CANLI TARAMA MOTORU BAŞLATILDI`);
console.log(`🌐 Hedef Host: ${HOST}`);
console.log(`📋 Toplam Denetlenecek URL: ${allUrls.length}\n`);

function fetchUrl(pathname) {
  return new Promise((resolve) => {
    const options = {
      hostname: HOST,
      port: 443,
      path: pathname,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ToplantiMerkezi-SEO-Validator/2.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: data
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        status: 0,
        error: err.message
      });
    });

    req.end();
  });
}

async function run() {
  let successCount = 0;
  let homepageCanonicalCount = 0;
  let wrongCanonicalCount = 0;
  let non200Count = 0;

  const BATCH_SIZE = 12;

  for (let i = 0; i < allUrls.length; i += BATCH_SIZE) {
    const batch = allUrls.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(async (item) => {
      const urlObj = new URL(item.url);
      const pathname = urlObj.pathname;
      const res = await fetchUrl(pathname);

      if (res.status !== 200) {
        non200Count++;
        console.error(`❌ [Status ${res.status}] ${item.url}`);
        return;
      }

      const canMatch = res.body.match(/<link rel=["']canonical["'] href=["'](.*?)["']/);
      const canonical = canMatch ? canMatch[1] : '';

      const isHome = pathname === '/' || pathname === '';
      if (!isHome && (canonical === 'https://www.toplantimerkezi.com.tr/' || canonical === 'https://www.toplantimerkezi.com.tr')) {
        homepageCanonicalCount++;
        console.error(`🚨 [HOMEPAGE FALLBACK] ${item.url} -> ${canonical}`);
      } else if (canonical === item.url || (isHome && (canonical === item.url || canonical === item.url + '/'))) {
        successCount++;
      } else {
        wrongCanonicalCount++;
        console.warn(`⚠️ [CANONICAL MISMATCH] ${item.url} -> ${canonical}`);
      }
    }));

    process.stdout.write(`\rİlerleme: ${Math.min(i + BATCH_SIZE, allUrls.length)} / ${allUrls.length} denetlendi...`);
  }

  console.log('\n\n====================================================');
  console.log('🏁 CANLI TARAMA VE DOĞRULAMA RAPORU:');
  console.log('====================================================');
  console.log(`✅ Doğrulanan Kusursuz Canonical: ${successCount} / ${allUrls.length}`);
  console.log(`❌ Ana Sayfaya Düşen Canonical (Eski Hata): ${homepageCanonicalCount}`);
  console.log(`❌ Canonical Eşleşmeyen: ${wrongCanonicalCount}`);
  console.log(`❌ 200 Harici Dönen (404/500): ${non200Count}`);
  console.log('====================================================');

  if (successCount === allUrls.length && homepageCanonicalCount === 0 && non200Count === 0) {
    console.log('🎉 SONUÇ: TÜM 316 SİTEMAP URL\'Sİ CANLI SUNUCUDA %100 BAŞARIYLA DOĞRULANDI!');
  } else {
    process.exit(1);
  }
}

run();
