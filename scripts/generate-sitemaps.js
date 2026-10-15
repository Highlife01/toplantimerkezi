import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { ALL_81_CITIES } from '../src/data/citiesData.js';
import { ORGANIZATIONS } from '../src/data/organizationsData.js';
import { SERVICES } from '../src/data/servicesData.js';
import { INDUSTRIES } from '../src/data/industryData.js';
import { PROJECTS } from '../src/data/projectsData.js';
import { BLOG_POSTS } from '../src/data/blogData.js';
import { SEO_CLUSTERS, TOPIC_HUBS } from '../src/data/seoClustersData.js';
import { SUPPORTED_LANGUAGES } from '../src/data/i18nData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

const DOMAIN = 'https://www.toplantimerkezi.com.tr';
const TODAY = new Date().toISOString().split('T')[0];

let cloudSeoOverrides = {};
const cachePath = path.resolve(__dirname, '.cloud-seo-cache.json');
if (fs.existsSync(cachePath)) {
  try {
    const parsed = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
    cloudSeoOverrides = parsed.seoOverrides || {};
  } catch {
    cloudSeoOverrides = {};
  }
}

const isRouteIndexed = (loc) => {
  const norm = loc === '/' ? '/' : `${loc.startsWith('/') ? '' : '/'}${loc}`.replace(/\/+$/, '');
  if (norm === '/admin' || norm === '/teklif-takip') return false;
  const ov = cloudSeoOverrides[norm];
  if (ov && ov.isIndexed === false) return false;
  return true;
};

const HREFLANG_ALTERNATE_BLOCK = [
  ...SUPPORTED_LANGUAGES.map((l) => {
    const hrefUrl = l.code === 'tr' ? `${DOMAIN}/` : `${DOMAIN}/${l.code}`;
    return `    <xhtml:link rel="alternate" hreflang="${l.hreflang}" href="${hrefUrl}" />`;
  }),
  `    <xhtml:link rel="alternate" hreflang="x-default" href="${DOMAIN}/" />`
].join('\n');

const formatUrlEntry = (loc, priority = '0.8', changefreq = 'weekly', lastmod = TODAY, includeHreflang = false) => {
  if (!isRouteIndexed(loc)) return null;
  const hreflangXml = includeHreflang ? `\n${HREFLANG_ALTERNATE_BLOCK}` : '';
  return `  <url>
    <loc>${DOMAIN}${loc.startsWith('/') ? '' : '/'}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${hreflangXml}
  </url>`;
};

const wrapUrlSet = (entries, withXhtmlNs = false) => {
  const validEntries = entries.filter(Boolean);
  const nsAttr = withXhtmlNs
    ? 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml"'
    : 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset ${nsAttr}>
${validEntries.join('\n')}
</urlset>
`;
};

// 1. sitemap-pages.xml (Kurumsal & Ana Sayfalar, 15 Dil Uluslararası MICE Portalları & Topic Hub Rehberleri — /admin ve /teklif-takip noindex olduğu için hariçtir)
const generatePagesSitemap = () => {
  const entries = [
    formatUrlEntry('/', '1.0', 'daily', TODAY, true),
    formatUrlEntry('/kurumsal', '0.8', 'monthly'),
    formatUrlEntry('/teklif-al', '0.95', 'weekly'),
    formatUrlEntry('/organizasyonlar', '0.9', 'weekly'),
    formatUrlEntry('/hizmetler', '0.9', 'weekly'),
    formatUrlEntry('/sehirler', '0.9', 'weekly'),
    formatUrlEntry('/mekanlar', '0.9', 'daily'),
    formatUrlEntry('/projeler', '0.85', 'weekly'),
    formatUrlEntry('/blog', '0.85', 'daily'),
    formatUrlEntry('/iletisim', '0.8', 'monthly')
  ];

  // 14 Uluslararası Çok Dilli B2B MICE & Kongre Portalları (/en, /ru, /de, /it, /es, /zh, /hi, /ar, /fa, /fr, /az, /ja, /ko, /nl)
  SUPPORTED_LANGUAGES.forEach(lang => {
    if (lang.code !== 'tr') {
      entries.push(formatUrlEntry(`/${lang.code}`, '0.95', 'weekly', TODAY, true));
    }
  });

  // Topic Hub Rehberleri
  TOPIC_HUBS.forEach(hub => {
    entries.push(formatUrlEntry(`/rehber/${hub.slug}`, '0.85', 'weekly'));
  });

  // Yasal Sayfalar
  const legalPages = ['kvkk', 'gizlilik', 'cerez', 'kullanim'];
  legalPages.forEach(p => {
    entries.push(formatUrlEntry(`/yasal/${p}`, '0.4', 'yearly'));
  });

  return wrapUrlSet(entries, true);
};

// 2. sitemap-services.xml (5 Topic Cluster Money Pages, 9 Organizasyon, 10 Hizmet, 5 Sektör)
const generateServicesSitemap = () => {
  const entries = [];
  const addedSlugs = new Set();

  // A) 5 SEO Cluster Money Pages (All 45 routes)
  SEO_CLUSTERS.forEach(cluster => {
    cluster.pages.forEach(page => {
      if (!addedSlugs.has(page.slug)) {
        addedSlugs.add(page.slug);
        const priority = page.slug === 'bayi-toplantisi-organizasyonu' ? '1.0' : '0.95';
        entries.push(formatUrlEntry(`/${page.slug}`, priority, 'weekly'));
      }
    });
  });

  // B) 9 Organizasyon Katalog Detay Sayfası
  ORGANIZATIONS.forEach(org => {
    entries.push(formatUrlEntry(`/organizasyonlar/${org.slug}`, '0.9', 'weekly'));
  });

  // C) 10 Teknik Hizmet Detay Sayfası
  SERVICES.forEach(service => {
    entries.push(formatUrlEntry(`/hizmetler/${service.slug}`, '0.85', 'weekly'));
  });

  // D) 5 Sektörel Çözüm Sayfası
  INDUSTRIES.forEach(ind => {
    entries.push(formatUrlEntry(`/sektorler/${ind.slug}`, '0.9', 'weekly'));
  });

  return wrapUrlSet(entries);
};

// 3. sitemap-cities.xml (81 İlin Tamamı)
const generateCitiesSitemap = () => {
  const entries = [];

  // 81 İlin tamamı /sehirler/{slug}
  ALL_81_CITIES.forEach(city => {
    const priority = ['istanbul', 'ankara', 'antalya', 'izmir'].includes(city.slug) ? '0.95' : '0.85';
    entries.push(formatUrlEntry(`/sehirler/${city.slug}`, priority, 'weekly'));
  });

  return wrapUrlSet(entries);
};

// 4. sitemap-locations.xml (Öncelikli Şehirler x 9 Organizasyon ve 6 Teknik Hizmet Kombinasyonları)
const generateLocationsSitemap = () => {
  const entries = [];
  const focusCities = [
    'istanbul', 'ankara', 'antalya', 'izmir', 'adana',
    'mersin', 'bursa', 'kocaeli', 'gaziantep', 'konya',
    'kayseri', 'mugla', 'eskisehir', 'samsun', 'trabzon'
  ];

  // A) 15 Focus Cities x All 9 Organizations (135 URLs)
  focusCities.forEach(citySlug => {
    ORGANIZATIONS.forEach(org => {
      const priority = ['istanbul', 'ankara', 'antalya', 'izmir'].includes(citySlug) ? '0.9' : '0.85';
      entries.push(formatUrlEntry(`/sehirler/${citySlug}/${org.slug}`, priority, 'weekly'));
    });
  });

  // B) 15 Focus Cities x Top 6 Technical Services (90 URLs)
  const topServices = SERVICES.slice(0, 6);
  focusCities.forEach(citySlug => {
    topServices.forEach(srv => {
      const priority = ['istanbul', 'ankara', 'antalya', 'izmir'].includes(citySlug) ? '0.88' : '0.82';
      entries.push(formatUrlEntry(`/sehirler/${citySlug}/${srv.slug}`, priority, 'weekly'));
    });
  });

  return wrapUrlSet(entries);
};

// 5. sitemap-projects.xml (Gerçek Case Study Projeleri)
const generateProjectsSitemap = () => {
  const entries = [
    formatUrlEntry('/projeler', '0.85', 'weekly')
  ];

  PROJECTS.forEach(project => {
    entries.push(formatUrlEntry(`/projeler/${project.slug}`, '0.8', 'monthly'));
  });

  return wrapUrlSet(entries);
};

// 6. sitemap-blog.xml (Gerçek Blog ve Rehber Makaleleri)
const generateBlogSitemap = () => {
  const entries = [
    formatUrlEntry('/blog', '0.85', 'daily')
  ];

  BLOG_POSTS.forEach(post => {
    // Gerçek yayın/güncelleme tarihine göre lastmod
    const lastmod = post.dateModifiedIso || post.dateIso || TODAY;
    entries.push(formatUrlEntry(`/blog/${post.slug}`, '0.8', 'monthly', lastmod));
  });

  return wrapUrlSet(entries);
};

// 7. sitemap-venues.xml (Mekân Arama Motoru)
const generateVenuesSitemap = () => {
  const entries = [
    formatUrlEntry('/mekanlar', '0.9', 'daily')
  ];

  return wrapUrlSet(entries);
};

// 8. sitemap.xml (Master Index)
const generateMasterSitemap = () => {
  const sitemaps = [
    'sitemap-pages.xml',
    'sitemap-services.xml',
    'sitemap-cities.xml',
    'sitemap-locations.xml',
    'sitemap-venues.xml',
    'sitemap-projects.xml',
    'sitemap-blog.xml'
  ];

  const entries = sitemaps.map(file => `  <sitemap>
    <loc>${DOMAIN}/${file}</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>`);

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</sitemapindex>
`;
};

// Write All Sitemaps to /public
const run = () => {
  console.log(`[Sitemap Generator] Generating sitemaps for ${DOMAIN} (Date: ${TODAY})...`);

  const files = {
    'sitemap-pages.xml': generatePagesSitemap(),
    'sitemap-services.xml': generateServicesSitemap(),
    'sitemap-cities.xml': generateCitiesSitemap(),
    'sitemap-locations.xml': generateLocationsSitemap(),
    'sitemap-projects.xml': generateProjectsSitemap(),
    'sitemap-blog.xml': generateBlogSitemap(),
    'sitemap-venues.xml': generateVenuesSitemap(),
    'sitemap.xml': generateMasterSitemap()
  };

  Object.entries(files).forEach(([filename, content]) => {
    const filePath = path.join(publicDir, filename);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ ${filename} written successfully (${content.split('\n').length} lines).`);
  });

  console.log('[Sitemap Generator] All sitemaps updated successfully!');
};

run();
