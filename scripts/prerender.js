import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { ALL_81_CITIES, PROMINENT_CITIES, getCityGeo } from '../src/data/citiesData.js';
import { ORGANIZATIONS } from '../src/data/organizationsData.js';
import { SERVICES } from '../src/data/servicesData.js';
import { INDUSTRIES } from '../src/data/industryData.js';
import { PROJECTS } from '../src/data/projectsData.js';
import { BLOG_POSTS } from '../src/data/blogData.js';
import { SEO_CLUSTERS, TOPIC_HUBS } from '../src/data/seoClustersData.js';
import { SUPPORTED_LANGUAGES, I18N_CONTENT } from '../src/data/i18nData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');
const publicDir = path.resolve(__dirname, '../public');

const DOMAIN = 'https://www.toplantimerkezi.com.tr';

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

if (!fs.existsSync(distDir)) {
  console.error('[Prerender] dist/ directory not found! Run "vite build" first.');
  process.exit(1);
}

const baseTemplate = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

/**
 * Escapes HTML characters safely
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generates an SEO & GEO-optimized HTML document for a specific route
 */
function buildHtml({
  route,
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  h1,
  aiDirectAnswer,
  bodyContent = '',
  breadcrumbs = [],
  faqs = [],
  howTo = null,
  geo = null,
  schemas = [],
  lang = 'tr',
  hreflangCode = 'tr-TR',
  ogLocale = 'tr_TR',
  dir = 'ltr',
  includeGlobalHreflang = false,
  is404 = false,
  noIndex = false
}) {
  const normRoute = route === '/' ? '/' : `${route.startsWith('/') ? '' : '/'}${route}`.replace(/\/+$/, '');
  const ov = !is404 ? cloudSeoOverrides[normRoute] : null;

  if (ov) {
    if (ov.title) title = ov.title;
    if (ov.metaDesc) description = ov.metaDesc;
    if (ov.h1) h1 = ov.h1;
    if (ov.canonicalUrl) canonicalUrl = ov.canonicalUrl;
    if (ov.isIndexed === false) noIndex = true;
  }

  if (normRoute === '/admin' || normRoute === '/teklif-takip') {
    noIndex = true;
  }

  let fullCanonical = canonicalUrl || `${DOMAIN}${normRoute === '/' ? '/' : normRoute}`;
  if (!fullCanonical.startsWith('http')) {
    fullCanonical = `${DOMAIN}${fullCanonical.startsWith('/') ? '' : '/'}${fullCanonical}`;
  }
  // Alt sayfalara yanlışlıkla ana sayfa canonical URL'si uygulanmasını engelle
  if (normRoute !== '/' && (fullCanonical === DOMAIN || fullCanonical === `${DOMAIN}/`)) {
    fullCanonical = `${DOMAIN}${normRoute}`;
  }

  const finalTitle = title.includes('Toplantı Merkezi') ? title : `${title} | Toplantı Merkezi`;
  const finalOgImage = ogImage || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80';
  const finalKeywords = keywords || 'toplantı organizasyonu, bayi toplantısı, şirket toplantısı, kurumsal etkinlik, kongre organizasyonu, kurumsal piknik, 81 il organizasyon, 15 dilde simultane tercüme, ingilizce rusça almanca italyanca ispanyolca çince hintçe arapça farsça fransızca azerbaycanca japonca korece felemenkçe kongre organizasyonu';

  let html = baseTemplate;

  // 0. Set <html lang="..." dir="...">
  html = html.replace(/<html[^>]*>/i, `<html lang="${escapeHtml(lang)}" dir="${escapeHtml(dir)}">`);

  // 1. Replace Title
  html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(finalTitle)}</title>`);
  html = html.replace(/<meta name="title" content=".*?" \/>/s, `<meta name="title" content="${escapeHtml(finalTitle)}" />`);

  // 2. Replace Meta Description
  html = html.replace(/<meta name="description"\s+content=".*?" \/>/s, `<meta name="description" content="${escapeHtml(description)}" />`);

  // 3. Replace Keywords
  html = html.replace(/<meta name="keywords"\s+content=".*?" \/>/s, `<meta name="keywords" content="${escapeHtml(finalKeywords)}" />`);

  // 4. Canonical, Hreflang & Robots Management
  if (is404 || noIndex) {
    html = html.replace(/<link rel="canonical".*?\/>\s*/g, '');
    html = html.replace(/<link rel="alternate" hreflang=".*?".*?\/>\s*/g, '');
    const robotsDirective = is404 ? 'noindex, follow' : 'noindex, nofollow';
    html = html.replace(/<meta name="robots" content=".*?" \/>/s, `<meta name="robots" content="${robotsDirective}" />`);
    html = html.replace(/<meta name="googlebot" content=".*?" \/>/s, `<meta name="googlebot" content="${robotsDirective}" />`);
  } else {
    if (html.includes('<link rel="canonical"')) {
      html = html.replace(/<link rel="canonical" href=".*?" \/>/s, `<link rel="canonical" href="${fullCanonical}" />`);
    } else {
      html = html.replace('</head>', `  <link rel="canonical" href="${fullCanonical}" />\n</head>`);
    }

    if (includeGlobalHreflang || normRoute === '/') {
      // Remove existing alternate hreflang tags and inject all 15 languages + x-default
      html = html.replace(/<link rel="alternate" hreflang=".*?".*?\/>\s*/g, '');
      const hreflangTags = SUPPORTED_LANGUAGES.map(l => {
        const hrefUrl = l.code === 'tr' ? `${DOMAIN}/` : `${DOMAIN}/${l.code}`;
        return l.hreflang !== l.code
          ? `  <link rel="alternate" hreflang="${l.hreflang}" href="${hrefUrl}" />\n  <link rel="alternate" hreflang="${l.code}" href="${hrefUrl}" />`
          : `  <link rel="alternate" hreflang="${l.hreflang}" href="${hrefUrl}" />`;
      });
      hreflangTags.push(`  <link rel="alternate" hreflang="x-default" href="${DOMAIN}/" />`);
      html = html.replace('</head>', `${hreflangTags.join('\n')}\n</head>`);
    } else {
      html = html.replace(/<link rel="alternate" hreflang="tr-TR" href=".*?" \/>/s, `<link rel="alternate" hreflang="tr-TR" href="${fullCanonical}" />`);
      html = html.replace(/<link rel="alternate" hreflang="x-default" href=".*?" \/>/s, `<link rel="alternate" hreflang="x-default" href="${fullCanonical}" />`);
    }
  }

  // 5. Replace OpenGraph & Twitter Tags (supports both name="twitter:*" and property="twitter:*")
  html = html.replace(/<meta property="og:locale" content=".*?" \/>/s, `<meta property="og:locale" content="${escapeHtml(ogLocale || 'tr_TR')}" />`);
  html = html.replace(/<meta property="og:url" content=".*?" \/>/s, `<meta property="og:url" content="${fullCanonical}" />`);
  html = html.replace(/<meta property="og:title" content=".*?" \/>/s, `<meta property="og:title" content="${escapeHtml(finalTitle)}" />`);
  html = html.replace(/<meta property="og:description"\s+content=".*?" \/>/s, `<meta property="og:description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<meta property="og:image" content=".*?" \/>/s, `<meta property="og:image" content="${finalOgImage}" />`);
  html = html.replace(/<meta property="og:image:alt" content=".*?" \/>/s, `<meta property="og:image:alt" content="${escapeHtml(h1 || finalTitle)}" />`);

  html = html.replace(/<meta (?:name|property)="twitter:url" content=".*?" \/>/s, `<meta name="twitter:url" content="${fullCanonical}" />`);
  html = html.replace(/<meta (?:name|property)="twitter:title" content=".*?" \/>/s, `<meta name="twitter:title" content="${escapeHtml(finalTitle)}" />`);
  html = html.replace(/<meta (?:name|property)="twitter:description"\s+content=".*?" \/>/s, `<meta name="twitter:description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<meta (?:name|property)="twitter:image" content=".*?" \/>/s, `<meta name="twitter:image" content="${finalOgImage}" />`);

  // 5b. Replace Dynamic GEO Meta Tags (ISO-3166-2:TR & GPS Coordinates)
  if (geo && geo.region && geo.placename && geo.position && geo.icbm) {
    html = html.replace(/<meta name="geo\.region" content=".*?" \/>/s, `<meta name="geo.region" content="${escapeHtml(geo.region)}" />`);
    html = html.replace(/<meta name="geo\.placename" content=".*?" \/>/s, `<meta name="geo.placename" content="${escapeHtml(geo.placename)}" />`);
    html = html.replace(/<meta name="geo\.position" content=".*?" \/>/s, `<meta name="geo.position" content="${escapeHtml(geo.position)}" />`);
    html = html.replace(/<meta name="ICBM" content=".*?" \/>/s, `<meta name="ICBM" content="${escapeHtml(geo.icbm)}" />`);
    html = html.replace(/<meta name="coverage" content=".*?" \/>/s, `<meta name="coverage" content="${escapeHtml(geo.placename)}" />`);
    html = html.replace(/<meta name="dc\.coverage" content=".*?" \/>/s, `<meta name="dc.coverage" content="${escapeHtml(geo.placename)}" />`);
  }

  // 6. Build Rich Schemas (JSON-LD) & AI Citation Tags
  if (!is404 && !noIndex) {
    const citationMeta = [
      `  <meta name="citation_title" content="${escapeHtml(finalTitle)}" />`,
      `  <meta name="citation_author" content="Toplantı Merkezi Kurumsal Operasyon Masası" />`,
      `  <meta name="citation_publisher" content="Toplantı Merkezi" />`,
      `  <meta name="citation_language" content="${escapeHtml(lang)}" />`,
      `  <meta name="citation_public_url" content="${fullCanonical}" />`
    ].join('\n');

    const fullSchemas = [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${fullCanonical}#webpage`,
        url: fullCanonical,
        name: finalTitle,
        description,
        inLanguage: hreflangCode || 'tr-TR',
        isPartOf: { '@id': `${DOMAIN}/#website` },
        about: { '@id': `${DOMAIN}/#organization` },
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['h1', '[data-geo-answer="true"]', 'main p']
        }
      },
      ...schemas
    ];

    // Breadcrumbs Schema
    if (breadcrumbs.length > 0) {
      const bcItems = [{ name: 'Ana Sayfa', url: '/' }, ...breadcrumbs];
      fullSchemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: bcItems.map((b, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: b.name,
          item: b.url.startsWith('http') ? b.url : `${DOMAIN}${b.url.startsWith('/') ? '' : '/'}${b.url === '/' ? '' : b.url}`
        }))
      });
    }

    // HowTo Schema
    if (howTo && Array.isArray(howTo.steps) && howTo.steps.length > 0) {
      fullSchemas.push({
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: howTo.name || finalTitle,
        description: howTo.description || description,
        step: howTo.steps.map((s, idx) => ({
          '@type': 'HowToStep',
          position: idx + 1,
          name: s.name || s.title,
          text: s.text || s.desc
        }))
      });
    }

    // FAQPage Schema
    if (faqs.length > 0) {
      fullSchemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
          '@type': 'Question',
          name: f.q || f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a || f.answer
          }
        }))
      });
    }

    const schemaTags = fullSchemas.map(s => `  <script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n  </script>`).join('\n');
    html = html.replace('</head>', `${citationMeta}\n${schemaTags}\n</head>`);
  }

  // 7. Semantic HTML Pre-rendered Shell inside <div id="root">
  const breadcrumbsHtml = breadcrumbs.length > 0
    ? `<nav aria-label="Breadcrumb" class="py-3 px-4 max-w-7xl mx-auto text-xs text-slate-500 flex items-center space-x-2">
        <a href="/" class="hover:text-amber-600">Ana Sayfa</a>
        ${breadcrumbs.map((b, i) => `<span>/</span>${i === breadcrumbs.length - 1 ? `<span class="text-slate-800 font-semibold">${escapeHtml(b.name)}</span>` : `<a href="${b.url}" class="hover:text-amber-600">${escapeHtml(b.name)}</a>`}`).join('')}
      </nav>`
    : '';

  const aiBoxHtml = aiDirectAnswer
    ? `<div class="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-6 my-6 shadow-sm">
        <div class="flex items-center space-x-2 text-amber-900 font-bold text-sm mb-2">
          <span class="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
          <span>Hızlı Bilgi & Tanım</span>
        </div>
        <p class="text-slate-800 text-sm md:text-base leading-relaxed" data-geo-answer="true">${escapeHtml(aiDirectAnswer)}</p>
      </div>`
    : '';

  const faqsHtml = faqs.length > 0
    ? `<section class="my-10">
        <h2 class="text-2xl font-bold font-display text-slate-900 mb-6">Sıkça Sorulan Sorular</h2>
        <div class="space-y-4">
          ${faqs.map(f => `
            <div class="border border-slate-200 rounded-xl p-5 bg-white shadow-sm">
              <h3 class="font-semibold text-slate-900 text-base mb-2">${escapeHtml(f.q || f.question)}</h3>
              <p class="text-slate-600 text-sm leading-relaxed">${escapeHtml(f.a || f.answer)}</p>
            </div>
          `).join('')}
        </div>
      </section>`
    : '';

  const prerenderedBody = `
    <header class="bg-slate-900 text-white border-b border-slate-800 py-4 px-6">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" class="text-xl font-bold font-display text-white tracking-tight flex items-center space-x-2">
          <span class="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow">TM</span>
          <span>Toplantı Merkezi</span>
        </a>
        <nav class="hidden md:flex items-center space-x-6 text-sm text-slate-300">
          <a href="/bayi-toplantisi-organizasyonu" class="hover:text-amber-400">Bayi Toplantısı</a>
          <a href="/toplanti-organizasyonu" class="hover:text-amber-400">Toplantı</a>
          <a href="/kongre-organizasyonu" class="hover:text-amber-400">Kongre</a>
          <a href="/kurumsal-piknik-organizasyonu" class="hover:text-amber-400">Kurumsal Piknik</a>
          <a href="/kamu-organizasyonu" class="hover:text-amber-400">Kamu & Protokol</a>
          <a href="/sehirler" class="hover:text-amber-400">81 İl</a>
          <a href="/mekanlar" class="hover:text-amber-400">15 Dil MICE Arama</a>
          <a href="/teklif-al" class="bg-amber-500 text-slate-950 px-4 py-2 rounded-xl font-bold hover:bg-amber-400">Hızlı Teklif</a>
        </nav>
      </div>
    </header>

    ${breadcrumbsHtml}

    <main class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="text-3xl md:text-5xl font-extrabold font-display text-slate-950 tracking-tight mb-4">${escapeHtml(h1 || title)}</h1>
      <p class="text-base md:text-lg text-slate-600 leading-relaxed max-w-4xl mb-6">${escapeHtml(description)}</p>

      ${aiBoxHtml}
      ${bodyContent}
      ${faqsHtml}

      <div class="mt-12 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-8 md:p-12 shadow-xl text-center">
        <h2 class="text-2xl md:text-3xl font-bold font-display mb-3">Kurumsal Organizasyonunuz İçin Teklif Alın</h2>
        <p class="text-slate-300 text-sm md:text-base max-w-2xl mx-auto mb-6">
          81 ilde ve 15 dilde anahtar teslim kongre, bayi toplantısı, sahne, LED ekran ve salon çözümleri için 2 saat içinde detaylı bütçenizi hazırlayalım.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-4">
          <a href="/teklif-al" class="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-3.5 rounded-2xl shadow-lg transition">Hızlı Teklif Al</a>
          <a href="tel:+905320550945" class="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3.5 rounded-2xl border border-slate-700 transition">0532 055 09 45</a>
        </div>
      </div>
    </main>

    <footer class="bg-slate-950 text-slate-400 border-t border-slate-800 py-12 px-6 mt-16 text-sm">
      <div class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        <div>
          <div class="font-bold text-white mb-3">Organizasyonlar</div>
          <ul class="space-y-2 text-xs">
            <li><a href="/bayi-toplantisi-organizasyonu" class="hover:text-amber-400">Bayi Toplantısı</a></li>
            <li><a href="/toplanti-organizasyonu" class="hover:text-amber-400">Şirket Toplantısı</a></li>
            <li><a href="/kongre-organizasyonu" class="hover:text-amber-400">Kongre & Konferans</a></li>
            <li><a href="/kurumsal-piknik-organizasyonu" class="hover:text-amber-400">Kurumsal Piknik</a></li>
            <li><a href="/kamu-organizasyonu" class="hover:text-amber-400">Kamu Protokol</a></li>
          </ul>
        </div>
        <div>
          <div class="font-bold text-white mb-3">Teknik Hizmetler</div>
          <ul class="space-y-2 text-xs">
            <li><a href="/hizmetler/ses-isik" class="hover:text-amber-400">Ses & Işık Sistemleri</a></li>
            <li><a href="/hizmetler/sahne-dekor" class="hover:text-amber-400">Sahne & Dekorasyon</a></li>
            <li><a href="/hizmetler/led-ekran-goruntu" class="hover:text-amber-400">LED Ekran & Reji</a></li>
            <li><a href="/hizmetler/mekan-planlama" class="hover:text-amber-400">Mekân Planlama</a></li>
            <li><a href="/hizmetler/catering" class="hover:text-amber-400">Catering & Menü</a></li>
          </ul>
        </div>
        <div>
          <div class="font-bold text-white mb-3">Öne Çıkan Şehirler</div>
          <ul class="space-y-2 text-xs">
            <li><a href="/sehirler/istanbul" class="hover:text-amber-400">İstanbul Toplantı Salonları</a></li>
            <li><a href="/sehirler/ankara" class="hover:text-amber-400">Ankara Protokol Salonları</a></li>
            <li><a href="/sehirler/antalya" class="hover:text-amber-400">Antalya Kongre Otelleri</a></li>
            <li><a href="/sehirler/izmir" class="hover:text-amber-400">İzmir Etkinlik Alanları</a></li>
            <li><a href="/sehirler/bursa" class="hover:text-amber-400">Bursa Kurumsal Organizasyon</a></li>
          </ul>
        </div>
        <div>
          <div class="font-bold text-white mb-3">Kurumsal & İletişim</div>
          <ul class="space-y-2 text-xs">
            <li><a href="/kurumsal" class="hover:text-amber-400">Hakkımızda</a></li>
            <li><a href="/projeler" class="hover:text-amber-400">Referans Projeler</a></li>
            <li><a href="/blog" class="hover:text-amber-400">Bilgi Merkezi & Rehber</a></li>
            <li><a href="/iletisim" class="hover:text-amber-400">İletişim & Ofisler</a></li>
            <li><a href="/yasal/kvkk" class="hover:text-amber-400">KVKK Aydınlatma Metni</a></li>
          </ul>
        </div>
      </div>
      <div class="max-w-7xl mx-auto pt-6 border-t border-slate-800 mb-6">
        <div class="text-xs font-bold text-slate-300 mb-3">🌐 Uluslararası B2B MICE & Kongre Portalları (15 Dil):</div>
        <div class="flex flex-wrap gap-2 text-xs">
          ${SUPPORTED_LANGUAGES.map(l => `<a href="${l.path}" class="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400">${escapeHtml(l.flag)} ${escapeHtml(l.name)} (${escapeHtml(l.nativeName)})</a>`).join('')}
        </div>
      </div>
      <div class="max-w-7xl mx-auto pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
        &copy; 2026 Toplantı Merkezi Kurumsal Organizasyon A.Ş. Tüm hakları saklıdır.
      </div>
    </footer>
  `;

  // Inject semantic HTML inside <div id="root">
  html = html.replace('<div id="root"></div>', `<div id="root">${prerenderedBody}</div>`);

  return html;
}

/**
 * Writes an HTML string to dist/{route}/index.html
 */
function writePage(route, htmlContent) {
  let cleanRoute = route.startsWith('/') ? route.slice(1) : route;
  if (cleanRoute.endsWith('/')) cleanRoute = cleanRoute.slice(0, -1);

  let targetDir = distDir;
  if (cleanRoute.length > 0) {
    targetDir = path.join(distDir, cleanRoute);
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetPath = path.join(targetDir, 'index.html');
  fs.writeFileSync(targetPath, htmlContent, 'utf-8');
}

/**
 * Writes an exact raw file to dist/{filename} and public/{filename}
 */
function writeRawFile(filename, htmlContent) {
  const distPath = path.join(distDir, filename);
  fs.writeFileSync(distPath, htmlContent, 'utf-8');

  try {
    const pubPath = path.join(publicDir, filename);
    fs.writeFileSync(pubPath, htmlContent, 'utf-8');
  } catch (e) {}
}

/**
 * Main Execution
 */
async function runPrerender() {
  console.log('[Prerender] Starting SEO static snapshot pre-rendering...');
  let pageCount = 0;

  // 1. Homepage (/)
  const homeFaqs = [
    {
      q: 'Toplantı Merkezi hangi kurumsal organizasyon türlerinde hizmet vermektedir?',
      a: 'Toplantı Merkezi; B2B bayi toplantısı, şirket toplantısı, kongre ve konferans, kurumsal piknik, lansman ve kamu protokol organizasyonlarını tek merkezden, anahtar teslim olarak 81 ilde yönetir.'
    },
    {
      q: 'Kurumsal organizasyon için ne kadar sürede bütçe teklifi alabilirim?',
      a: 'Platformumuz üzerinden talebinizi ilettikten sonra 2 saat içinde detaylı salon alternatifleri, 3D sahne tasarımı ve kalem maliyet dökümünü içeren resmi PDF teklif dosyanız iletilir.'
    },
    {
      q: 'Türkiye\'nin 81 ilinde yerel operasyon garantiniz var mı?',
      a: 'Evet. İstanbul, Ankara, İzmir, Antalya, Adana, Bursa başta olmak üzere 81 ilin tamamında yerleşik teknik ortaklarımız, bölge yöneticilerimiz ve anlaşmalı kongre otellerimizle hizmet sunuyoruz.'
    },
    {
      q: 'Düğün veya bireysel etkinlik organize ediyor musunuz?',
      a: 'Hayır. Toplantı Merkezi yalnızca kurumsal şirketler, holdingler, yetkili satıcı ağları ve kamu kurumlarına yönelik B2B organizasyonlar düzenler.'
    }
  ];

  const homeHtml = buildHtml({
    route: '/',
    title: 'Toplantı Merkezi | Kurumsal Organizasyon & Toplantı Çözümleri',
    description: 'Bayi toplantılarından şirket organizasyonlarına, kamu toplantılarından kurumsal pikniklere kadar tüm süreci profesyonel ekibimizle planlıyor, koordine ediyor ve yönetiyoruz. 81 ilde tek merkezden kurumsal hizmet.',
    canonicalUrl: `${DOMAIN}/`,
    h1: "Türkiye'nin Her Yerinde Kurumsal Organizasyon Çözümleri",
    aiDirectAnswer: 'Toplantı Merkezi; Türkiye\'nin 81 ilinde B2B şirket toplantıları, bayi buluşmaları, kongreler, kurumsal piknikler ve protokol törenlerini tek sözleşme ve tek merkezden koordine eden kurumsal etkinlik yönetim platformudur.',
    bodyContent: `
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        <div class="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
          <div class="text-amber-600 font-bold text-lg mb-2">81 İl Yerel Operasyon</div>
          <p class="text-slate-600 text-sm">İstanbul\'dan Kars\'a, Antalya\'dan Samsun\'a tüm illerde yerleşik teknik ekipler ve anlaşmalı kongre otelleri.</p>
        </div>
        <div class="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
          <div class="text-amber-600 font-bold text-lg mb-2">2 Saatte Resmî Teklif</div>
          <p class="text-slate-600 text-sm">Mekân, LED ekran, ses-ışık, sahne ve catering maliyetlerini içeren şeffaf A4 PDF teklif dosyası.</p>
        </div>
        <div class="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
          <div class="text-amber-600 font-bold text-lg mb-2">Sıfır Hata Güvencesi</div>
          <p class="text-slate-600 text-sm">Yedekli teknik reji masası, simultane çeviri altyapısı ve deneyimli protokol direktörleri.</p>
        </div>
      </section>

      <section class="my-10">
        <h2 class="text-2xl font-bold font-display text-slate-900 mb-6">Kurumsal Organizasyon Alanlarımız</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a href="/bayi-toplantisi-organizasyonu" class="p-5 border border-slate-200 rounded-2xl hover:border-amber-500 hover:shadow-md transition bg-white block">
            <h3 class="font-bold text-slate-900 text-lg mb-1">Bayi Toplantısı Organizasyonu</h3>
            <p class="text-slate-600 text-xs">Yetkili satıcı ağları, ürün lansmanları ve gala geceleri için anahtar teslim yönetim.</p>
          </a>
          <a href="/toplanti-organizasyonu" class="p-5 border border-slate-200 rounded-2xl hover:border-amber-500 hover:shadow-md transition bg-white block">
            <h3 class="font-bold text-slate-900 text-lg mb-1">Şirket Toplantısı Organizasyonu</h3>
            <p class="text-slate-600 text-xs">Yönetim kurulu, yıllık değerlendirme ve satış strateji toplantıları.</p>
          </a>
          <a href="/kongre-organizasyonu" class="p-5 border border-slate-200 rounded-2xl hover:border-amber-500 hover:shadow-md transition bg-white block">
            <h3 class="font-bold text-slate-900 text-lg mb-1">Kongre & Konferans Yönetimi</h3>
            <p class="text-slate-600 text-xs">Tıp, bilim, sektörel zirveler ve çok salonlu PCO organizasyonları.</p>
          </a>
          <a href="/kurumsal-piknik-organizasyonu" class="p-5 border border-slate-200 rounded-2xl hover:border-amber-500 hover:shadow-md transition bg-white block">
            <h3 class="font-bold text-slate-900 text-lg mb-1">Kurumsal Piknik & Şirket Pikniği</h3>
            <p class="text-slate-600 text-xs">Personel aile günleri, barbekü, takım oyunları ve açık hava eğlenceleri.</p>
          </a>
          <a href="/kamu-organizasyonu" class="p-5 border border-slate-200 rounded-2xl hover:border-amber-500 hover:shadow-md transition bg-white block">
            <h3 class="font-bold text-slate-900 text-lg mb-1">Kamu & Protokol Organizasyonu</h3>
            <p class="text-slate-600 text-xs">Bakanlıklar, valilikler, açılış törenleri ve devlet protokolüne tam uyum.</p>
          </a>
          <a href="/sehirler" class="p-5 border border-slate-200 rounded-2xl hover:border-amber-500 hover:shadow-md transition bg-white block">
            <h3 class="font-bold text-slate-900 text-lg mb-1">81 İl MICE Şehir Rehberi</h3>
            <p class="text-slate-600 text-xs">Türkiye\'nin 81 ilindeki toplantı otelleri ve salon kapasiteleri.</p>
          </a>
        </div>
      </section>
    `,
    faqs: homeFaqs
  });
  writePage('/', homeHtml);
  pageCount++;

  // 2. SEO Cluster Money Pages
  const addedClusterSlugs = new Set();
  SEO_CLUSTERS.forEach(cluster => {
    cluster.pages.forEach(page => {
      addedClusterSlugs.add(page.slug);
      const clusterHtml = buildHtml({
        route: `/${page.slug}`,
        title: page.seoTitle || `${page.title} | Toplantı Merkezi`,
        description: page.metaDesc,
        canonicalUrl: `${DOMAIN}/${page.slug}`,
        h1: page.h1 || page.title,
        aiDirectAnswer: page.aiDirectAnswer,
        breadcrumbs: [
          { name: cluster.name, url: `/${cluster.primarySlug}` },
          { name: page.title, url: `/${page.slug}` }
        ],
        bodyContent: `
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <div class="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
              <div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Hedef Katılımcı</div>
              <div class="text-lg font-bold text-slate-900">${escapeHtml(page.targetAttendees || '50 – 2.000 Kişi')}</div>
            </div>
            <div class="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
              <div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Operasyon Kapsamı</div>
              <div class="text-lg font-bold text-slate-900">81 İl Anahtar Teslim</div>
            </div>
            <div class="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
              <div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Hizmet Modeli</div>
              <div class="text-lg font-bold text-slate-900">Tek Muhatap & Tek Sözleşme</div>
            </div>
          </div>

          ${page.subTypes && page.subTypes.length > 0 ? `
            <section class="my-8">
              <h2 class="text-xl font-bold font-display text-slate-900 mb-4">Hizmet ve Alt Kategori Seçenekleri</h2>
              <div class="flex flex-wrap gap-2">
                ${page.subTypes.map(st => `<span class="bg-white border border-slate-200 text-slate-800 text-xs md:text-sm font-medium px-4 py-2 rounded-xl shadow-sm">${escapeHtml(st)}</span>`).join('')}
              </div>
            </section>
          ` : ''}
        `,
        faqs: [
          {
            q: `${page.title} için salon ve mekân seçimi nasıl yapılır?`,
            a: `Katılımcı sayısı, sahne ebatları, salonun tavan yüksekliği ve havalimanı transfer süreleri incelenerek kurumunuza en uygun 3 salon opsiyonu detaylı bütçeleriyle sunulur.`
          },
          {
            q: `${page.title} kapsamında hangi teknik ekipmanlar sağlanır?`,
            a: `Line array profesyonel ses sistemleri, kablosuz mikrofonlar, yüksek çözünürlüklü dev LED ekranlar, podyum, sunum rejisi ve ambians aydınlatması anahtar teslim kurulur.`
          },
          {
            q: `Organizasyon bütçesi ne kadar sürede hazırlanır?`,
            a: `Platformumuz üzerinden ilettiğiniz taleplere istinaden uzman proje direktörlerimiz 2 saat içerisinde kalem dökümlü resmi teklif dosyasını hazırlar.`
          }
        ],
        schemas: [
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: page.title,
            description: page.metaDesc,
            provider: {
              '@type': 'Organization',
              name: 'Toplantı Merkezi',
              url: DOMAIN
            }
          }
        ]
      });
      writePage(`/${page.slug}`, clusterHtml);
      pageCount++;
    });
  });

  // 3. 81 Cities Pages (/sehirler/${slug} + direct alias /${slug})
  ALL_81_CITIES.forEach(city => {
    const prominent = PROMINENT_CITIES.find(p => p.slug === city.slug) || {};
    const cityGeo = getCityGeo(city.slug);
    const overview = prominent.overview || `${city.name} ilinde bayi toplantısı, şirket toplantısı, kurumsal etkinlik ve kongre organizasyonları için profesyonel salon ve teknik altyapı çözümleri sunuyoruz.`;
    const aiAnswer = `${city.name} kurumsal organizasyon ve toplantı yönetimi; bölgedeki 5 yıldızlı kongre otelleri, balo salonları ve etkinlik alanlarında bayi toplantısı, şirket vizyon oturumları, kongre, seminer ve kurumsal pikniklerin uçtan uca koordine edilmesidir. Toplantı Merkezi; salon tahsisinden 3D sahne tasarımına, dev LED ekranlardan ses-ışık sistemlerine, simultane tercümeden havalimanı VIP transferine kadar tüm süreci ${city.name} ilinde tek sözleşme ve yerel operasyon gücüyle anahtar teslim yönetir.`;

    const cityHtml = buildHtml({
      route: `/sehirler/${city.slug}`,
      title: `${city.name} Kurumsal Toplantı & Organizasyon Çözümleri | Toplantı Merkezi`,
      description: `${city.name} toplantı salonları, kongre otelleri, bayi toplantısı ve kurumsal etkinlik yönetimi. 81 ilde tek merkezden yerel operasyon güvencesi.`,
      canonicalUrl: `${DOMAIN}/sehirler/${city.slug}`,
      ogImage: prominent.image,
      geo: cityGeo,
      h1: `${city.name} Kurumsal Toplantı ve Organizasyon Çözümleri`,
      aiDirectAnswer: aiAnswer,
      breadcrumbs: [
        { name: 'Şehirler', url: '/sehirler' },
        { name: city.name, url: `/sehirler/${city.slug}` }
      ],
      bodyContent: `
        <div class="border border-slate-200 rounded-2xl p-6 bg-white my-6 shadow-sm">
          <h2 class="text-xl font-bold font-display text-slate-900 mb-2">${escapeHtml(city.name)} MICE & Organizasyon Kapasitesi</h2>
          <p class="text-slate-600 text-sm leading-relaxed mb-4">${escapeHtml(overview)}</p>
          ${prominent.transport ? `<p class="text-slate-500 text-xs mb-2"><strong>Ulaşım:</strong> ${escapeHtml(prominent.transport)}</p>` : ''}
          ${prominent.capacityOverview ? `<p class="text-slate-500 text-xs"><strong>Kapasite:</strong> ${escapeHtml(prominent.capacityOverview)}</p>` : ''}
        </div>
      `,
      faqs: [
        {
          q: `${city.name} ilinde kaç kişilik organizasyonlar düzenlenebilir?`,
          a: `${city.name} ilindeki anlaşmalı otel ve salonlarda 20 kişilik yönetim toplantılarından 5.000 kişilik büyük bayi ve kongre toplantılarına kadar tüm ölçeklerde hizmet verilmektedir.`
        },
        {
          q: `${city.name} operasyonlarında teknik ekip yerel mi sağlanıyor?`,
          a: `Evet, Toplantı Merkezi ${city.name} bölgesinde yerleşik profesyonel teknik ortakları ve süpervizörleriyle sıfır hata prensibiyle çalışır.`
        }
      ],
      schemas: [
        {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: `Toplantı Merkezi ${city.name} Kurumsal Organizasyon Masası`,
          telephone: '+90 532 055 09 45',
          email: 'info@toplantimerkezi.com.tr',
          url: `${DOMAIN}/sehirler/${city.slug}`,
          priceRange: '₺₺₺₺',
          address: {
            '@type': 'PostalAddress',
            addressLocality: city.name,
            addressRegion: city.region || 'Türkiye',
            addressCountry: 'TR'
          },
          geo: cityGeo ? {
            '@type': 'GeoCoordinates',
            latitude: cityGeo.lat,
            longitude: cityGeo.lng
          } : undefined,
          areaServed: {
            '@type': 'AdministrativeArea',
            name: `${city.name}, Türkiye`
          },
          description: aiAnswer
        }
      ]
    });
    writePage(`/sehirler/${city.slug}`, cityHtml);
    // Direct root alias e.g. /istanbul -> canonical /sehirler/istanbul
    writePage(`/${city.slug}`, cityHtml);
    pageCount++;
  });

  // 4. All 81 Cities x All 9 Organizations & Top 6 Technical Services
  const focusCitiesSet = new Set([
    'istanbul', 'ankara', 'antalya', 'izmir', 'adana',
    'mersin', 'bursa', 'kocaeli', 'gaziantep', 'konya',
    'kayseri', 'mugla', 'eskisehir', 'samsun', 'trabzon'
  ]);
  const topServicesList = SERVICES.slice(0, 6);

  ALL_81_CITIES.forEach(city => {
    const cityGeo = getCityGeo(city.slug);
    const isFocusCity = focusCitiesSet.has(city.slug);

    // A) City x 9 Organizations
    ORGANIZATIONS.forEach(org => {
      const route = `/sehirler/${city.slug}/${org.slug}`;
      const orgFullTitle = org.title.endsWith('Organizasyonu') ? org.title : `${org.title} Organizasyonu`;
      const title = `${city.name} ${orgFullTitle} | Toplantı Merkezi`;
      const desc = `${city.name} ilinde profesyonel ${orgFullTitle.toLowerCase()}: Salon seçimi, dev LED ekran, profesyonel ses-ışık, sahne ve catering tek merkezden yönetilir.`;
      const aiAnswer = `${city.name} ${orgFullTitle.toLowerCase()}; bölgedeki 5 yıldızlı oteller, kongre salonları ve açık alanlarda katılımcı kayıt, 3D sahne tasarımı, profesyonel ses-ışık sistemleri, dev LED ekran prodüksiyonu, VIP karşılama ve catering süreçlerinin tek merkezden yönetilmesidir. Toplantı Merkezi, ${city.name} ilinde tek sözleşme ve sıfır bütçe sapması garantisiyle anahtar teslim kurumsal çözümler sunar.`;

      const html = buildHtml({
        route,
        title,
        description: desc,
        canonicalUrl: `${DOMAIN}${route}`,
        ogImage: org.heroImage,
        geo: cityGeo,
        h1: `${city.name} ${orgFullTitle}`,
        aiDirectAnswer: aiAnswer,
        breadcrumbs: [
          { name: 'Şehirler', url: '/sehirler' },
          { name: city.name, url: `/sehirler/${city.slug}` },
          { name: org.title, url: route }
        ],
        bodyContent: `
          <div class="border border-slate-200 rounded-2xl p-6 bg-white my-6 shadow-sm">
            <h2 class="text-xl font-bold font-display text-slate-900 mb-3">${escapeHtml(city.name)} Bölgesinde ${escapeHtml(org.title)} Yönetimi</h2>
            <p class="text-slate-600 text-sm leading-relaxed mb-4">
              Toplantı Merkezi; ${escapeHtml(city.name)} lokasyonunda kurumunuzun hedeflerine uygun balo salonları, kongre otelleri ve etkinlik alanlarını analiz ederek anahtar teslim operasyon sağlar.
            </p>
          </div>
        `,
        faqs: [
          {
            q: `${city.name} ${org.title} için salon seçimi nasıl yapılır?`,
            a: `${city.name} genelindeki 5 yıldızlı oteller ve kongre merkezleri; katılımcı sayısı, tavan yüksekliği, teknik altyapı ve transfer süreleri dikkate alınarak filtrelenir ve 3 alternatif bütçelendirilir.`
          },
          {
            q: `${city.name} operasyonunda teknik ekipman kim tarafından kurulur?`,
            a: `Toplantı Merkezi'nin ${city.name} bölgesinde yerleşik profesyonel teknik reji ekipleri sahne, LED ekran, ses ve ışık sistemlerini sıfır hata prensibiyle kurar ve yönetir.`
          }
        ],
        schemas: [
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: `${city.name} ${org.title}`,
            description: aiAnswer,
            provider: {
              '@type': 'Organization',
              name: 'Toplantı Merkezi',
              url: DOMAIN
            },
            areaServed: {
              '@type': 'AdministrativeArea',
              name: `${city.name}, Türkiye`,
              geo: cityGeo ? {
                '@type': 'GeoCoordinates',
                latitude: cityGeo.lat,
                longitude: cityGeo.lng
              } : undefined
            }
          }
        ]
      });
      writePage(route, html);
      if (isFocusCity) {
        writePage(`/${city.slug}/${org.slug}`, html);
      }
      pageCount++;
    });

    // B) City x Top 6 Technical Services
    topServicesList.forEach(srv => {
      const route = `/sehirler/${city.slug}/${srv.slug}`;
      const title = `${city.name} ${srv.title} Kiralama & Kurulum | Toplantı Merkezi`;
      const desc = `${city.name} ilinde ${srv.shortDesc.toLowerCase()} Kongre otelleri ve toplantı salonlarında anahtar teslim profesyonel teknik prodüksiyon ve canlı reji hizmeti.`;
      const aiAnswer = `${city.name} genelinde ${srv.title.toLowerCase()} hizmetleri; bölgedeki 5 yıldızlı oteller, kongre salonları ve kurumsal etkinlik alanlarında uzman teknik ekip ve anahtar teslim kurulum garantisiyle sağlanır.`;

      const html = buildHtml({
        route,
        title,
        description: desc,
        canonicalUrl: `${DOMAIN}${route}`,
        ogImage: srv.image,
        geo: cityGeo,
        h1: `${city.name} ${srv.title} Çözümleri`,
        aiDirectAnswer: aiAnswer,
        breadcrumbs: [
          { name: 'Şehirler', url: '/sehirler' },
          { name: city.name, url: `/sehirler/${city.slug}` },
          { name: srv.title, url: route }
        ],
        bodyContent: `
          <div class="border border-slate-200 rounded-2xl p-6 bg-white my-6 shadow-sm">
            <h2 class="text-xl font-bold font-display text-slate-900 mb-3">${escapeHtml(city.name)} ${escapeHtml(srv.title)} Hizmet Standardı</h2>
            <p class="text-slate-600 text-sm leading-relaxed mb-4">
              Toplantı Merkezi; ${escapeHtml(city.name)} lokasyonunda gerçekleştirilecek kurumsal toplantı, kongre ve bayi buluşmaları için son teknoloji ekipman parkuru ve deneyimli teknik şef kadrosuyla kusursuz altyapı kurar.
            </p>
          </div>
        `,
        faqs: [
          {
            q: `${city.name} için ${srv.title.toLowerCase()} kurulum süresi ne kadardır?`,
            a: `Salon tahsis saatine göre etkinlikten en az 4 saat önce tüm sistemler kurulur, ses ve görüntü provaları tamamlanarak anahtar teslim teslim edilir.`
          },
          {
            q: `${city.name} lokasyonuna özel bütçe teklifi nasıl alınır?`,
            a: `Hızlı teklif formumuzdan salon adı, katılımcı sayısı ve etkinlik tarihinizi ileterek 2 saat içinde detaylı kalem maliyet dökümünü içeren resmi PDF teklifinizi alabilirsiniz.`
          }
        ],
        schemas: [
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: `${city.name} ${srv.title}`,
            description: aiAnswer,
            provider: {
              '@type': 'Organization',
              name: 'Toplantı Merkezi',
              url: DOMAIN
            },
            areaServed: {
              '@type': 'AdministrativeArea',
              name: `${city.name}, Türkiye`,
              geo: cityGeo ? {
                '@type': 'GeoCoordinates',
                latitude: cityGeo.lat,
                longitude: cityGeo.lng
              } : undefined
            }
          }
        ]
      });
      writePage(route, html);
      if (isFocusCity) {
        writePage(`/${city.slug}/${srv.slug}`, html);
      }
      pageCount++;
    });

    // C) Focus Cities x Primary Cluster Slugs (e.g., /antalya/bayi-toplantisi-organizasyonu, /ankara/kamu-organizasyonu)
    if (isFocusCity) {
      SEO_CLUSTERS.forEach(cluster => {
        const primaryPage = cluster.pages[0];
        if (!primaryPage) return;
        const route = `/sehirler/${city.slug}/${primaryPage.slug}`;
        const html = buildHtml({
          route,
          title: `${city.name} ${primaryPage.title} | Toplantı Merkezi`,
          description: `${city.name} ilinde profesyonel ${primaryPage.title.toLowerCase()}: 5 yıldızlı kongre otelleri, 3D sahne, LED ekran, ses-ışık ve VIP transfer yönetimi.`,
          canonicalUrl: `${DOMAIN}${route}`,
          geo: cityGeo,
          h1: `${city.name} ${primaryPage.title}`,
          aiDirectAnswer: `${city.name} ${primaryPage.title.toLowerCase()}; ${primaryPage.aiDirectAnswer}`,
          breadcrumbs: [
            { name: 'Şehirler', url: '/sehirler' },
            { name: city.name, url: `/sehirler/${city.slug}` },
            { name: primaryPage.title, url: route }
          ]
        });
        writePage(route, html);
        writePage(`/${city.slug}/${primaryPage.slug}`, html);
        pageCount++;
      });
    }
  });

  // 6. 9 Organizations Catalog Details (/organizasyonlar/${slug})
  ORGANIZATIONS.forEach(org => {
    const orgHtml = buildHtml({
      route: `/organizasyonlar/${org.slug}`,
      title: `${org.title} | Toplantı Merkezi`,
      description: org.shortDesc || org.overview,
      canonicalUrl: `${DOMAIN}/organizasyonlar/${org.slug}`,
      ogImage: org.heroImage,
      h1: org.title,
      aiDirectAnswer: org.overview,
      howTo: org.workflow ? {
        name: `${org.title} Nasıl Planlanır?`,
        description: org.shortDesc,
        steps: org.workflow.map(w => ({ name: w.step, text: w.desc }))
      } : null,
      breadcrumbs: [
        { name: 'Organizasyonlar', url: '/organizasyonlar' },
        { name: org.title, url: `/organizasyonlar/${org.slug}` }
      ],
      bodyContent: `
        <div class="my-6">
          <p class="text-slate-700 text-base leading-relaxed mb-6">${escapeHtml(org.overview)}</p>
          ${org.subServices && org.subServices.length > 0 ? `
            <h2 class="text-2xl font-bold font-display text-slate-900 mb-4">Hizmet Kapsamı ve Modülleri</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${org.subServices.map(s => `
                <div class="border border-slate-200 rounded-xl p-4 bg-white">
                  <div class="font-bold text-slate-900 text-sm mb-1">${escapeHtml(s.name)}</div>
                  <div class="text-slate-600 text-xs">${escapeHtml(s.desc)}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `,
      faqs: org.faqs || []
    });
    writePage(`/organizasyonlar/${org.slug}`, orgHtml);
    pageCount++;
  });

  // 7. 10 Services Details (/hizmetler/${slug})
  SERVICES.forEach(service => {
    const srvHtml = buildHtml({
      route: `/hizmetler/${service.slug}`,
      title: `${service.title} Hizmeti | Toplantı Merkezi`,
      description: service.shortDesc,
      canonicalUrl: `${DOMAIN}/hizmetler/${service.slug}`,
      ogImage: service.image,
      h1: `${service.title} Çözümleri`,
      aiDirectAnswer: `${service.title}; kurumsal organizasyon ve toplantılarda profesyonel standartlarda ekipman, kurulum, teknik reji ve canlı operasyon desteği sağlayan uzmanlık modülüdür.`,
      breadcrumbs: [
        { name: 'Hizmetler', url: '/hizmetler' },
        { name: service.title, url: `/hizmetler/${service.slug}` }
      ],
      bodyContent: `
        <div class="border border-slate-200 rounded-2xl p-6 bg-white my-6">
          <p class="text-slate-700 text-sm leading-relaxed mb-4">${escapeHtml(service.shortDesc)}</p>
          ${service.details && service.details.length > 0 ? `
            <h2 class="text-lg font-bold font-display text-slate-900 mb-3">Teknik Özellikler ve Ekipman Standardı</h2>
            <ul class="list-disc list-inside space-y-1 text-slate-600 text-sm">
              ${service.details.map(d => `<li>${escapeHtml(d)}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      `
    });
    writePage(`/hizmetler/${service.slug}`, srvHtml);
    pageCount++;
  });

  // 8. 5 Industry Details (/sektorler/${slug})
  INDUSTRIES.forEach(ind => {
    const indHtml = buildHtml({
      route: `/sektorler/${ind.slug}`,
      title: ind.seoTitle || `${ind.title} Organizasyon Çözümleri | Toplantı Merkezi`,
      description: ind.metaDesc,
      canonicalUrl: `${DOMAIN}/sektorler/${ind.slug}`,
      ogImage: ind.bannerImage,
      h1: ind.title,
      aiDirectAnswer: ind.subtitle,
      breadcrumbs: [
        { name: 'Sektörler', url: '/organizasyonlar' },
        { name: ind.title, url: `/sektorler/${ind.slug}` }
      ],
      bodyContent: `
        <div class="border border-slate-200 rounded-2xl p-6 bg-white my-6">
          <h2 class="text-xl font-bold font-display text-slate-900 mb-3">Sektörel İhtiyaçlar ve Çözümler</h2>
          <p class="text-slate-600 text-sm mb-4"><strong>Hedef Kitle:</strong> ${escapeHtml(ind.targetAudience || 'Kurumsal Paydaşlar')}</p>
          ${ind.keyNeeds && ind.keyNeeds.length > 0 ? `
            <div class="mb-4">
              <div class="font-bold text-slate-900 text-sm mb-2">Öncelikli Kriterler:</div>
              <ul class="list-disc list-inside space-y-1 text-slate-600 text-xs">
                ${ind.keyNeeds.map(k => `<li>${escapeHtml(k)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      `
    });
    writePage(`/sektorler/${ind.slug}`, indHtml);
    pageCount++;
  });

  // 9. 4 Project Case Studies (/projeler/${slug})
  PROJECTS.forEach(project => {
    const projectHtml = buildHtml({
      route: `/projeler/${project.slug}`,
      title: `${project.title} | Case Study | Toplantı Merkezi`,
      description: `${project.city} lokasyonunda ${project.attendees} kişilik ${project.title} kurumsal organizasyonu. Sahne tasarımı, teknik prodüksiyon ve operasyon yönetimi detayları.`,
      canonicalUrl: `${DOMAIN}/projeler/${project.slug}`,
      h1: project.title,
      ogImage: project.image,
      aiDirectAnswer: `${project.title}; ${project.city} lokasyonunda ${project.attendees} katılımcıyla hayata geçirilen, anahtar teslim sahne, LED ekran, ses-ışık sistemleri ve kusursuz saha yönetimini kapsayan kurumsal case study çalışmamızdır.`,
      breadcrumbs: [
        { name: 'Projelerimiz', url: '/projeler' },
        { name: project.title, url: `/projeler/${project.slug}` }
      ],
      bodyContent: `
        <div class="border border-slate-200 rounded-2xl p-6 sm:p-8 bg-white my-6 shadow-sm">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 pb-6 border-b border-slate-100 text-center">
            <div class="p-3 bg-slate-50 rounded-xl">
              <div class="text-xs text-slate-500 mb-1">Şehir</div>
              <div class="font-bold text-slate-900 text-sm">${escapeHtml(project.city)}</div>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl">
              <div class="text-xs text-slate-500 mb-1">Katılımcı</div>
              <div class="font-bold text-slate-900 text-sm">${escapeHtml(project.attendees)} Kişi</div>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl">
              <div class="text-xs text-slate-500 mb-1">Mekân</div>
              <div class="font-bold text-slate-900 text-sm">${escapeHtml(project.venue || 'Kongre Oteli')}</div>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl">
              <div class="text-xs text-slate-500 mb-1">Süre</div>
              <div class="font-bold text-slate-900 text-sm">${escapeHtml(project.duration || '2 Gün')}</div>
            </div>
          </div>

          <h2 class="text-xl font-bold font-display text-slate-900 mb-3">Proje Kapsamı ve Uygulanan Çözümler</h2>
          <p class="text-slate-700 text-sm leading-relaxed mb-6">${escapeHtml(project.summary || project.scope)}</p>
        </div>
      `,
      schemas: [
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: project.title,
          description: `${project.city} lokasyonunda ${project.attendees} kişilik ${project.title} organizasyonu.`,
          image: project.image,
          author: {
            '@type': 'Organization',
            name: 'Toplantı Merkezi'
          },
          publisher: {
            '@type': 'Organization',
            name: 'Toplantı Merkezi',
            url: DOMAIN
          }
        }
      ]
    });
    writePage(`/projeler/${project.slug}`, projectHtml);
    pageCount++;
  });

  // 10. Blog Posts (/blog/${slug})
  BLOG_POSTS.forEach(post => {
    const postHtml = buildHtml({
      route: `/blog/${post.slug}`,
      title: `${post.title} | Toplantı Merkezi Blog`,
      description: post.summary,
      canonicalUrl: `${DOMAIN}/blog/${post.slug}`,
      h1: post.title,
      ogImage: post.image,
      aiDirectAnswer: post.summary,
      breadcrumbs: [
        { name: 'Blog & Bilgi Merkezi', url: '/blog' },
        { name: post.title, url: `/blog/${post.slug}` }
      ],
      bodyContent: `
        <div class="bg-white border border-slate-200 rounded-2xl p-8 my-6">
          <div class="text-xs text-slate-400 mb-4">${escapeHtml(post.date)} • ${escapeHtml(post.readTime || '5 dk okuma')} • ${escapeHtml(post.category || 'Rehber')}</div>
          <div class="prose max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line">${escapeHtml(post.content || post.summary)}</div>
        </div>
      `,
      schemas: [
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.summary,
          image: post.image,
          datePublished: post.dateIso || '2026-03-15',
          dateModified: post.dateModifiedIso || post.dateIso || '2026-09-01',
          author: {
            '@type': 'Organization',
            name: 'Toplantı Merkezi'
          },
          publisher: {
            '@type': 'Organization',
            name: 'Toplantı Merkezi',
            url: DOMAIN
          }
        }
      ]
    });
    writePage(`/blog/${post.slug}`, postHtml);
    pageCount++;
  });

  // 11. Topic Hub Guides (/rehber/${slug})
  TOPIC_HUBS.forEach(hub => {
    const hubHtml = buildHtml({
      route: `/rehber/${hub.slug}`,
      title: `${hub.title} | Toplantı Merkezi Rehber`,
      description: hub.metaDesc,
      canonicalUrl: `${DOMAIN}/rehber/${hub.slug}`,
      h1: hub.title,
      aiDirectAnswer: hub.aiDirectAnswer || hub.metaDesc,
      howTo: hub.steps ? {
        name: hub.title,
        description: hub.metaDesc,
        steps: hub.steps
      } : null,
      faqs: hub.faqs || [],
      breadcrumbs: [
        { name: 'Rehberler', url: '/blog' },
        { name: hub.title, url: `/rehber/${hub.slug}` }
      ],
      bodyContent: `
        <div class="bg-white border border-slate-200 rounded-2xl p-8 my-6">
          <h2 class="text-xl font-bold font-display text-slate-900 mb-3">Rehber Özeti ve Öne Çıkanlar</h2>
          <p class="text-slate-600 text-sm leading-relaxed mb-6">${escapeHtml(hub.metaDesc)}</p>
          <div class="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium">
            Bu rehber kurumsal firmaların bütçe sapması yaşamadan, doğru lokasyon ve teknik altyapıyı seçmelerine yardımcı olmak amacıyla hazırlanmıştır.
          </div>
        </div>
      `
    });
    writePage(`/rehber/${hub.slug}`, hubHtml);
    pageCount++;
  });

  // 12. Standard Core Pages
  const standardPages = [
    { route: '/kurumsal', title: 'Hakkımızda & Kurumsal Standartlar', desc: 'Toplantı Merkezi: Türkiye genelinde 81 ilde tek merkezden kurumsal organizasyon ve toplantı yönetimi.' },
    { route: '/organizasyonlar', title: 'Kurumsal Organizasyon Kataloğu', desc: 'Bayi toplantısı, kongre, kurumsal piknik, lansman ve gala organizasyonları.' },
    { route: '/hizmetler', title: 'Teknik Hizmetler & Prodüksiyon Modülleri', desc: 'Ses-ışık, dev LED ekran, sahne dekor, mekân planlama ve catering çözümleri.' },
    { route: '/sehirler', title: '81 İl MICE ve Toplantı Rehberi', desc: 'Türkiye\'nin 81 ilindeki kongre otelleri ve toplantı salonları kataloğu.' },
    { route: '/mekanlar', title: 'Toplantı ve Kongre Salonu Arama Motoru', desc: 'Kapasite, tavan yüksekliği ve teknik özelliklere göre toplantı salonu filtreleme.' },
    { route: '/projeler', title: 'Gerçekleşen Kurumsal Projeler ve Referanslar', desc: 'Holdingler ve kurumsal şirketler için hayata geçirilen başarılı organizasyonlar.' },
    { route: '/blog', title: 'Kurumsal Organizasyon Bilgi Merkezi & Blog', desc: 'Bayi toplantısı rehberleri, maliyet tabloları ve kurumsal etkinlik planlama ipuçları.' },
    { route: '/teklif-al', title: '7 Adımda Kurumsal Organizasyon Teklifi Al', desc: 'Talebinizi iletin, 2 saat içinde salon alternatifleri ve kalem maliyetli resmi PDF teklifinizi alın.' },
    { route: '/teklif-takip', title: 'Canlı Teklif ve Talep Takip Portalı', desc: 'Başvuru kodunuz ile organizasyon talebinizin aşamalarını canlı takip edin.' },
    { route: '/iletisim', title: 'İletişim & Kurumsal Operasyon Ofisi', desc: 'Toplantı Merkezi çağrı merkezi, Levent operasyon ofisi ve kurumsal iletişim bilgileri.' },
    { route: '/admin', title: 'Yönetim Masası & Operasyon CRM', desc: 'Toplantı Merkezi kurumsal operasyon masası, teklif yönetimi ve tedarikçi ağı kontrol paneli.', noIndex: true }
  ];

  standardPages.forEach(p => {
    const html = buildHtml({
      route: p.route,
      title: `${p.title} | Toplantı Merkezi`,
      description: p.desc,
      canonicalUrl: `${DOMAIN}${p.route}`,
      h1: p.title,
      noIndex: p.noIndex || false,
      breadcrumbs: [
        { name: p.title, url: p.route }
      ]
    });
    writePage(p.route, html);
    pageCount++;
  });

  // 13. Legal Pages (/yasal/kvkk, /yasal/gizlilik, /yasal/cerez, /yasal/kullanim, /yasal)
  const legalPages = [
    {
      slug: 'kvkk',
      title: 'KVKK Aydınlatma Metni | Toplantı Merkezi',
      desc: 'Toplantı Merkezi Kişisel Verilerin Korunması Kanunu (KVKK) aydınlatma metni, veri işleme politikası ve haklarınız.',
      h1: 'Kişisel Verilerin Korunması ve Aydınlatma Metni',
      content: `
        <h2 class="text-xl font-bold font-display text-slate-900 mb-3">1. Veri Sorumlusu</h2>
        <p class="text-slate-700 text-sm leading-relaxed mb-4">6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca Toplantı Merkezi Kurumsal Organizasyon A.Ş. veri sorumlusu sıfatıyla hareket etmektedir.</p>
        <h2 class="text-xl font-bold font-display text-slate-900 mb-3">2. İşlenen Veriler ve Amaç</h2>
        <p class="text-slate-700 text-sm leading-relaxed mb-4">Teklif formları, iletişim kanalları ve organizasyon talepleri kapsamında toplanan ad, soyad, kurumsal e-posta, telefon ve kurum bilgileri yalnızca organizasyon planlama ve resmi teklif iletimi amacıyla işlenir.</p>
      `
    },
    {
      slug: 'gizlilik',
      title: 'Gizlilik Politikası | Toplantı Merkezi',
      desc: 'Toplantı Merkezi kurumsal gizlilik politikası, müşteri ve kurumsal verilerin korunması ve gizlilik standartlarımız.',
      h1: 'Kurumsal Gizlilik Politikası',
      content: `
        <h2 class="text-xl font-bold font-display text-slate-900 mb-3">Kurumsal Bilgi Güvenliği Taahhüdü</h2>
        <p class="text-slate-700 text-sm leading-relaxed mb-4">Toplantı Merkezi; holdingler, kurumsal firmalar ve kamu kurumları ile yürütülen tüm organizasyon süreçlerinde ticari sır, bütçe ve katılımcı listelerini sıkı gizlilik protokolleri (NDA) çerçevesinde korur.</p>
      `
    },
    {
      slug: 'cerez',
      title: 'Çerez (Cookie) Politikası | Toplantı Merkezi',
      desc: 'Toplantı Merkezi web sitesinde kullanılan çerez türleri, kullanım amaçları ve çerez yönetim kılavuzu.',
      h1: 'Çerez (Cookie) Kullanım Politikası',
      content: `
        <h2 class="text-xl font-bold font-display text-slate-900 mb-3">Çerez Türleri ve Kullanımı</h2>
        <p class="text-slate-700 text-sm leading-relaxed mb-4">Sitemizde yalnızca platformun düzgün çalışması için zorunlu olan teknik çerezler ile performans analizine yönelik anonim analitik çerezler kullanılmaktadır.</p>
      `
    },
    {
      slug: 'kullanim',
      title: 'Kullanım Koşulları | Toplantı Merkezi',
      desc: 'Toplantı Merkezi web sitesi, teklif platformu ve kurumsal organizasyon talep formları kullanım şartları.',
      h1: 'Web Sitesi Kullanım Koşulları',
      content: `
        <h2 class="text-xl font-bold font-display text-slate-900 mb-3">Hizmet Şartları ve Sorumluluk Reddi</h2>
        <p class="text-slate-700 text-sm leading-relaxed mb-4">Web sitemizde yer alan görsel, metin ve teklif hesaplama araçları Toplantı Merkezi mülkiyetindedir. Formlar aracılığıyla iletilen talepler ön teklif niteliğinde olup kesin sözleşme karşılıklı onay sonrasında düzenlenir.</p>
      `
    }
  ];

  legalPages.forEach(lp => {
    const html = buildHtml({
      route: `/yasal/${lp.slug}`,
      title: lp.title,
      description: lp.desc,
      canonicalUrl: `${DOMAIN}/yasal/${lp.slug}`,
      h1: lp.h1,
      breadcrumbs: [
        { name: 'Yasal Bilgilendirme', url: '/yasal/kvkk' },
        { name: lp.h1, url: `/yasal/${lp.slug}` }
      ],
      bodyContent: `
        <div class="border border-slate-200 rounded-2xl p-6 sm:p-8 bg-white my-6 shadow-sm">
          ${lp.content}
        </div>
      `
    });
    writePage(`/yasal/${lp.slug}`, html);
    pageCount++;
  });

  // Base /yasal route (mirrors kvkk with canonical to kvkk)
  const yasalBaseHtml = buildHtml({
    route: '/yasal',
    title: 'Yasal Bilgilendirme & KVKK Politikası | Toplantı Merkezi',
    description: 'Toplantı Merkezi KVKK aydınlatma metni, gizlilik politikası, çerez politikası ve kullanım koşulları.',
    canonicalUrl: `${DOMAIN}/yasal/kvkk`,
    h1: 'Yasal Bilgilendirme ve Kurumsal Politikalar',
    breadcrumbs: [
      { name: 'Yasal Bilgilendirme', url: '/yasal/kvkk' }
    ],
    bodyContent: `
      <div class="border border-slate-200 rounded-2xl p-6 sm:p-8 bg-white my-6 shadow-sm">
        <p class="text-slate-700 text-sm leading-relaxed mb-4">Lütfen incelemek istediğiniz yasal belgeyi seçiniz:</p>
        <ul class="space-y-2 text-sm text-amber-700 font-semibold">
          <li><a href="/yasal/kvkk" class="hover:underline">&rarr; KVKK Aydınlatma Metni</a></li>
          <li><a href="/yasal/gizlilik" class="hover:underline">&rarr; Gizlilik Politikası</a></li>
          <li><a href="/yasal/cerez" class="hover:underline">&rarr; Çerez Politikası</a></li>
          <li><a href="/yasal/kullanim" class="hover:underline">&rarr; Kullanım Koşulları</a></li>
        </ul>
      </div>
    `
  });
  writePage('/yasal', yasalBaseHtml);
  pageCount++;

  // 13b. 14 International Multi-Language B2B MICE Portals (/en, /ru, /de, /it, /es, /zh, /hi, /ar, /fa, /fr, /az, /ja, /ko, /nl)
  SUPPORTED_LANGUAGES.forEach(langMeta => {
    if (langMeta.code === 'tr') return;
    const content = I18N_CONTENT[langMeta.code];
    if (!content) return;

    const route = `/${langMeta.code}`;
    const fullH1 = `${content.hero.titleLine1} ${content.hero.titleHighlight}`;

    const langHtml = buildHtml({
      route,
      title: content.metaTitle,
      description: content.metaDesc,
      canonicalUrl: `${DOMAIN}${route}`,
      h1: fullH1,
      aiDirectAnswer: content.aiDirectAnswer,
      lang: langMeta.code,
      hreflangCode: langMeta.hreflang,
      dir: langMeta.dir || 'ltr',
      includeGlobalHreflang: true,
      breadcrumbs: [
        { name: `${langMeta.flag} ${langMeta.nativeName} (${langMeta.trName})`, url: route }
      ],
      faqs: content.faqs || [],
      bodyContent: `
        <section class="my-8">
          <div class="flex flex-wrap gap-2 mb-6">
            ${SUPPORTED_LANGUAGES.map(l => `
              <a href="${l.path}" class="px-3 py-1.5 rounded-xl border text-xs font-bold ${l.code === langMeta.code ? 'bg-slate-900 text-amber-400 border-slate-900' : 'bg-white text-slate-700 border-slate-200'}">
                ${escapeHtml(l.flag)} ${escapeHtml(l.nativeName)}
              </a>
            `).join('')}
          </div>

          <h2 class="text-2xl font-bold font-display text-slate-900 mb-4">${escapeHtml(content.solutionsTitle)}</h2>
          <p class="text-slate-600 text-sm mb-6">${escapeHtml(content.solutionsSubtitle)}</p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            ${(content.solutions || []).map(item => `
              <a href="${item.link}" class="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm block hover:border-amber-500">
                <h3 class="font-bold text-slate-900 text-base mb-2">${escapeHtml(item.title)}</h3>
                <p class="text-slate-600 text-xs leading-relaxed">${escapeHtml(item.desc)}</p>
              </a>
            `).join('')}
          </div>

          <h2 class="text-2xl font-bold font-display text-slate-900 mb-4">${escapeHtml(content.techTitle)}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            ${(content.techItems || []).map(t => `
              <div class="border border-slate-200 rounded-2xl p-5 bg-slate-50">
                <h3 class="font-bold text-slate-900 text-sm mb-1">${escapeHtml(t.title)}</h3>
                <p class="text-slate-600 text-xs leading-relaxed">${escapeHtml(t.desc)}</p>
              </div>
            `).join('')}
          </div>

          <h2 class="text-2xl font-bold font-display text-slate-900 mb-4">${escapeHtml(content.destinationsTitle)}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            ${(content.destinations || []).map(dest => `
              <a href="/sehirler/${dest.slug}" class="border border-slate-200 rounded-2xl p-4 bg-white block">
                <div class="font-bold text-slate-900 text-sm mb-1">${escapeHtml(dest.city)}</div>
                <div class="text-amber-700 text-xs font-semibold mb-1">${escapeHtml(dest.tag)}</div>
                <p class="text-slate-600 text-xs">${escapeHtml(dest.desc)}</p>
              </a>
            `).join('')}
          </div>
        </section>
      `,
      schemas: [
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: content.metaTitle,
          description: content.aiDirectAnswer,
          inLanguage: langMeta.hreflang,
          provider: {
            '@type': 'Organization',
            name: 'Toplantı Merkezi',
            url: DOMAIN,
            availableLanguage: SUPPORTED_LANGUAGES.map(l => l.hreflang)
          },
          areaServed: {
            '@type': 'Country',
            name: 'Türkiye'
          }
        }
      ]
    });

    writePage(route, langHtml);
    pageCount++;
  });

  // 14. 404 Not Found Page (dist/404.html & public/404.html)
  const html404 = buildHtml({
    route: '/404.html',
    title: 'Sayfa Bulunamadı (404) | Toplantı Merkezi',
    description: 'Aradığınız sayfa taşınmış, adı değiştirilmiş veya geçici olarak kullanım dışı olabilir. 81 ilde kurumsal toplantı ve organizasyon çözümlerimiz için ana sayfayı ziyaret edebilirsiniz.',
    h1: 'Aradığınız Sayfa Mevcut Değil veya Taşınmış Olabilir',
    is404: true,
    noIndex: true,
    bodyContent: `
      <div class="text-center py-12">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 text-xs font-bold uppercase tracking-wider mb-6">
          <span>Hata Kodu 404 • Sayfa Bulunamadı</span>
        </div>
        <div class="text-7xl md:text-9xl font-black text-slate-900 font-display tracking-tight mb-4">
          4<span class="text-amber-500">0</span>4
        </div>
        <p class="text-slate-600 text-base max-w-xl mx-auto mb-8">
          Ulaşmaya çalıştığınız bağlantı güncellenmiş veya yazım hatası yapılmış olabilir. Aşağıdaki popüler bağlantılardan devam edebilir veya doğrudan kurumsal temsilcimizle iletişime geçebilirsiniz.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-3 mb-10">
          <a href="/" class="px-6 py-3.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm shadow hover:bg-amber-400 transition">Ana Sayfaya Dön</a>
          <a href="/teklif-al" class="px-6 py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition">Hızlı Teklif Al</a>
          <a href="tel:+905320550945" class="px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100 transition">0532 055 09 45</a>
        </div>
        <div class="bg-white rounded-2xl p-6 border border-slate-200 text-left max-w-3xl mx-auto">
          <div class="font-bold text-slate-900 text-sm mb-3">Popüler Kurumsal Organizasyon Çözümleri:</div>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            <a href="/bayi-toplantisi-organizasyonu" class="p-2.5 rounded-lg border border-slate-100 hover:bg-amber-50 hover:text-amber-900 transition font-medium block">Bayi Toplantısı</a>
            <a href="/toplanti-organizasyonu" class="p-2.5 rounded-lg border border-slate-100 hover:bg-amber-50 hover:text-amber-900 transition font-medium block">Şirket Toplantısı</a>
            <a href="/kongre-organizasyonu" class="p-2.5 rounded-lg border border-slate-100 hover:bg-amber-50 hover:text-amber-900 transition font-medium block">Kongre & Konferans</a>
            <a href="/kurumsal-piknik-organizasyonu" class="p-2.5 rounded-lg border border-slate-100 hover:bg-amber-50 hover:text-amber-900 transition font-medium block">Kurumsal Piknik</a>
            <a href="/kamu-organizasyonu" class="p-2.5 rounded-lg border border-slate-100 hover:bg-amber-50 hover:text-amber-900 transition font-medium block">Kamu & Protokol</a>
            <a href="/sehirler" class="p-2.5 rounded-lg border border-slate-100 hover:bg-amber-50 hover:text-amber-900 transition font-medium block">81 İl Rehberi</a>
          </div>
        </div>
      </div>
    `
  });
  writeRawFile('404.html', html404);

  console.log(`[Prerender] Successfully generated ${pageCount} static HTML pages + 404.html in dist/!`);
}

runPrerender().catch(err => {
  console.error('[Prerender] Error during pre-rendering:', err);
  process.exit(1);
});
