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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

const DOMAIN = 'https://www.toplantimerkezi.com.tr';
const TODAY = new Date().toISOString().split('T')[0];

const formatUrlEntry = (loc, priority = '0.8', changefreq = 'weekly', lastmod = TODAY) => {
  return `  <url>
    <loc>${DOMAIN}${loc.startsWith('/') ? '' : '/'}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
};

const wrapUrlSet = (entries) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;
};

// 1. sitemap-pages.xml (Kurumsal & Ana Sayfalar & Topic Hub Rehberleri)
const generatePagesSitemap = () => {
  const entries = [
    formatUrlEntry('/', '1.0', 'daily'),
    formatUrlEntry('/kurumsal', '0.8', 'monthly'),
    formatUrlEntry('/teklif-al', '0.95', 'weekly'),
    formatUrlEntry('/teklif-takip', '0.85', 'daily'),
    formatUrlEntry('/organizasyonlar', '0.9', 'weekly'),
    formatUrlEntry('/hizmetler', '0.9', 'weekly'),
    formatUrlEntry('/sehirler', '0.9', 'weekly'),
    formatUrlEntry('/mekanlar', '0.9', 'daily'),
    formatUrlEntry('/projeler', '0.85', 'weekly'),
    formatUrlEntry('/blog', '0.85', 'daily'),
    formatUrlEntry('/iletisim', '0.8', 'monthly')
  ];

  // Topic Hub Rehberleri
  TOPIC_HUBS.forEach(hub => {
    entries.push(formatUrlEntry(`/rehber/${hub.slug}`, '0.85', 'weekly'));
  });

  // Yasal Sayfalar
  const legalPages = ['kvkk', 'gizlilik', 'cerez', 'kullanim'];
  legalPages.forEach(p => {
    entries.push(formatUrlEntry(`/yasal/${p}`, '0.4', 'yearly'));
  });

  return wrapUrlSet(entries);
};

// 2. sitemap-services.xml (5 Topic Cluster Money Pages, 9 Organizasyon, 10 Hizmet, 5 Sektör)
const generateServicesSitemap = () => {
  const entries = [];
  const addedSlugs = new Set();

  // A) 5 SEO Cluster Money Pages
  SEO_CLUSTERS.forEach(cluster => {
    cluster.pages.forEach(page => {
      if (!addedSlugs.has(page.slug)) {
        addedSlugs.add(page.slug);
        const priority = page.slug === 'bayi-toplantisi-organizasyonu' ? '1.0' : '0.95';
        entries.push(formatUrlEntry(`/${page.slug}`, priority, 'weekly'));
      }
    });
  });

  // Ekstra Cluster Rotaları (App.jsx içinde route olarak tanımlı olup cluster pages dizisinde olmayanlar)
  const additionalClusterSlugs = [
    'sirket-toplantisi', 'motivasyon-toplantisi', 'strateji-toplantisi', 'donem-toplantisi',
    'bayi-bulusmasi', 'bayi-egitimi', 'bayi-motivasyon-toplantisi',
    'sempozyum-organizasyonu', 'zirve-organizasyonu', 'panel-organizasyonu', 'seminer-organizasyonu', 'egitim-organizasyonu',
    'kurumsal-organizasyon', 'kurumsal-etkinlik', 'kurumsal-piknik', 'sirket-piknigi', 'personel-etkinligi',
    'aile-gunu-organizasyonu', 'team-building', 'gala-organizasyonu', 'odul-toreni', 'lansman-organizasyonu',
    'acilis-organizasyonu', 'roadshow-organizasyonu',
    'protokol-organizasyonu', 'resmi-toren-organizasyonu', 'kamu-toplantisi', 'acilis-toreni', 'temel-atma-toreni'
  ];

  additionalClusterSlugs.forEach(slug => {
    if (!addedSlugs.has(slug)) {
      addedSlugs.add(slug);
      entries.push(formatUrlEntry(`/${slug}`, '0.9', 'weekly'));
    }
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

// 4. sitemap-locations.xml (Öncelikli Şehirler x Organizasyon ve Teknik Hizmet Kombinasyonları)
const generateLocationsSitemap = () => {
  const entries = [];
  const focusCities = [
    'istanbul', 'ankara', 'antalya', 'izmir', 'adana',
    'mersin', 'bursa', 'kocaeli', 'gaziantep', 'konya',
    'kayseri', 'mugla', 'eskisehir', 'samsun', 'trabzon'
  ];

  const popularOrgs = [
    'bayi-toplantisi',
    'sirket-toplantilari',
    'kongre-konferans',
    'kurumsal-piknik',
    'kamu-protokol-organizasyonlari',
    'lansman-organizasyonu',
    'gala-odul-geceleri'
  ];

  const topServices = [
    'ses-isik',
    'sahne-dekor',
    'led-ekran-goruntu',
    'mekan-planlama',
    'catering'
  ];

  // A) Focus Cities x Popular Organizations
  focusCities.forEach(citySlug => {
    popularOrgs.forEach(orgSlug => {
      const priority = ['istanbul', 'ankara', 'antalya'].includes(citySlug) ? '0.9' : '0.85';
      entries.push(formatUrlEntry(`/sehirler/${citySlug}/${orgSlug}`, priority, 'weekly'));
    });
  });

  // B) Top MICE Hubs x High-Intent Technical Services
  const topHubs = ['istanbul', 'ankara', 'antalya', 'izmir', 'adana', 'bursa'];
  topHubs.forEach(citySlug => {
    topServices.forEach(srvSlug => {
      entries.push(formatUrlEntry(`/sehirler/${citySlug}/${srvSlug}`, '0.85', 'weekly'));
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
