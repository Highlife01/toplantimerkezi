import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cacheFile = path.resolve(__dirname, '.cloud-seo-cache.json');
const firebaseJsonPath = path.resolve(__dirname, '../firebase.json');

const PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID || 'adanahizlisatis';
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

function parseFirestoreValue(valObj) {
  if (!valObj || typeof valObj !== 'object') return null;
  if ('stringValue' in valObj) return valObj.stringValue;
  if ('booleanValue' in valObj) return Boolean(valObj.booleanValue);
  if ('integerValue' in valObj) return Number(valObj.integerValue);
  if ('doubleValue' in valObj) return Number(valObj.doubleValue);
  if ('nullValue' in valObj) return null;
  if ('arrayValue' in valObj) {
    return (valObj.arrayValue.values || []).map(parseFirestoreValue);
  }
  if ('mapValue' in valObj) {
    return parseFirestoreFields(valObj.mapValue.fields || {});
  }
  return null;
}

function parseFirestoreFields(fields = {}) {
  const out = {};
  for (const [k, v] of Object.entries(fields)) {
    out[k] = parseFirestoreValue(v);
  }
  return out;
}

async function fetchCollection(collectionName) {
  try {
    const res = await fetch(`${FIRESTORE_BASE}/${collectionName}?pageSize=300`);
    if (!res.ok) return [];
    const data = await res.json();
    const docs = data.documents || [];
    return docs.map((d) => {
      const id = d.name.split('/').pop();
      return {
        id,
        ...parseFirestoreFields(d.fields || {})
      };
    });
  } catch (err) {
    console.warn(`[CloudSync] Warning fetching ${collectionName}:`, err.message);
    return [];
  }
}

async function runSync() {
  console.log('[CloudSync] Synchronizing Firestore seo_pages & redirects with build pipeline...');
  const [seoDocs, redirectDocs] = await Promise.all([
    fetchCollection('seo_pages'),
    fetchCollection('redirects')
  ]);

  const seoOverrides = {};
  for (const doc of seoDocs) {
    const routePath =
      doc.path || (doc.slug === '' ? '/' : `/${String(doc.slug || doc.id).replace(/^\/+/, '')}`);
    seoOverrides[routePath] = doc;
  }

  const activeRedirects = redirectDocs.filter(
    (r) => r.active !== false && r.oldUrl && r.newUrl && r.oldUrl !== r.newUrl
  );

  fs.writeFileSync(
    cacheFile,
    JSON.stringify(
      {
        syncedAt: new Date().toISOString(),
        seoOverrides,
        redirects: activeRedirects
      },
      null,
      2
    ),
    'utf-8'
  );

  // firebase.json sunucu katmanı yönlendirmelerini ve noindex başlıklarını senkronize et
  if (fs.existsSync(firebaseJsonPath)) {
    const fbConfig = JSON.parse(fs.readFileSync(firebaseJsonPath, 'utf-8'));
    if (fbConfig.hosting) {
      // 1. /teklif-takip ve /admin noindex başlıklarını garanti altına al
      const headers = Array.isArray(fbConfig.hosting.headers) ? fbConfig.hosting.headers : [];
      const ensureNoIndexHeader = (sourcePattern) => {
        if (!headers.some((h) => h.source === sourcePattern)) {
          headers.push({
            source: sourcePattern,
            headers: [
              {
                key: 'X-Robots-Tag',
                value: 'noindex, nofollow'
              }
            ]
          });
        }
      };
      ensureNoIndexHeader('/admin');
      ensureNoIndexHeader('/admin/**');
      ensureNoIndexHeader('/teklif-takip');
      ensureNoIndexHeader('/teklif-takip/**');
      fbConfig.hosting.headers = headers;

      // 2. Temel sistem yönlendirmelerini koru + Firestore redirects kurallarını sunucu katmanına uygula
      const baseRedirects = [
        { source: '/sitemap', destination: '/sitemap.xml', type: 301 },
        { source: '/sitemap/', destination: '/sitemap.xml', type: 301 },
        { source: '/sitemap.xml/', destination: '/sitemap.xml', type: 301 },
        { source: '/yasal', destination: '/yasal/kvkk', type: 301 },
        { source: '/yasal/', destination: '/yasal/kvkk', type: 301 },
        {
          source: '/hizmetler/catering-coffee-break',
          destination: '/hizmetler/kurumsal-catering-ikram',
          type: 301
        }
      ];

      const redirectMap = new Map();
      baseRedirects.forEach((r) => redirectMap.set(r.source, r));

      activeRedirects.forEach((r) => {
        const src = String(r.oldUrl).trim();
        const dst = String(r.newUrl).trim();
        const code = Number(r.type) === 302 ? 302 : 301;
        if (src.startsWith('/') && src !== '/' && dst && src !== dst) {
          redirectMap.set(src, {
            source: src,
            destination: dst,
            type: code
          });
        }
      });

      fbConfig.hosting.redirects = Array.from(redirectMap.values());
      fs.writeFileSync(firebaseJsonPath, JSON.stringify(fbConfig, null, 2) + '\n', 'utf-8');
    }
  }

  console.log(
    `[CloudSync] Synced ${Object.keys(seoOverrides).length} SEO overrides and ${activeRedirects.length} cloud redirects.`
  );
}

runSync();
