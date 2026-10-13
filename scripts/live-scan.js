import https from 'https';

const HOST = 'toplantimerkezi.web.app';

function fetchUrl(pathname) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: HOST,
      port: 443,
      path: pathname,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', err => reject(err));
    req.end();
  });
}

async function runLiveTest() {
  console.log(`🌐 Canlı Yayın Testi (${HOST})...\n`);

  const testUrls = [
    '/',
    '/bayi-toplantisi-organizasyonu',
    '/sehirler/istanbul',
    '/sehirler/istanbul/lansman-organizasyonu',
    '/sehirler/ankara/ses-isik',
    '/sehirler/mersin/bayi-toplantisi',
    '/projeler/ulusal-otomotiv-bayi-zirvesi',
    '/yasal/kvkk',
    '/blog/bayi-toplantisi-nasil-organize-edilir',
    '/kesinlikle-olmayan-url-test-404'
  ];

  for (const path of testUrls) {
    try {
      const res = await fetchUrl(path);
      const canMatch = res.body.match(/<link rel=["']canonical["'] href=["'](.*?)["']/);
      const titleMatch = res.body.match(/<title>(.*?)<\/title>/);
      const canonical = canMatch ? canMatch[1] : '(YOK)';
      const title = titleMatch ? titleMatch[1] : '(YOK)';

      console.log(`URL: ${path}`);
      console.log(`  -> HTTP Status: ${res.status}`);
      console.log(`  -> Title: ${title}`);
      console.log(`  -> Canonical: ${canonical}`);

      if (path === '/kesinlikle-olmayan-url-test-404') {
        if (res.status === 404) {
          console.log(`  ✅ [BAŞARILI] Bulunmayan sayfa HTTP 404 döndü!`);
        } else {
          console.error(`  ❌ [HATA] Bulunmayan sayfa 404 yerine ${res.status} döndü!`);
        }
      } else {
        if (res.status === 200) {
          if (canonical.includes(path.replace(/^\//, '')) || (path === '/' && canonical.endsWith('/'))) {
            console.log(`  ✅ [BAŞARILI] HTTP 200 ve Kendine İşaret Eden Canonical.`);
          } else {
            console.error(`  ❌ [HATA] Canonical homepage'e mi düşüyor? Canonical: ${canonical}`);
          }
        } else {
          console.error(`  ❌ [HATA] HTTP 200 yerine ${res.status} döndü!`);
        }
      }
      console.log('');
    } catch (err) {
      console.error(`Hata (${path}):`, err.message);
    }
  }
}

runLiveTest();
