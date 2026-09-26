import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { ALL_81_CITIES, PROMINENT_CITIES } from '../src/data/citiesData.js';
import { ORGANIZATIONS } from '../src/data/organizationsData.js';
import { SERVICES } from '../src/data/servicesData.js';
import { INDUSTRIES } from '../src/data/industryData.js';
import { PROJECTS } from '../src/data/projectsData.js';
import { BLOG_POSTS } from '../src/data/blogData.js';
import { SEO_CLUSTERS, TOPIC_HUBS } from '../src/data/seoClustersData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

const DOMAIN = 'https://www.toplantimerkezi.com.tr';

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
 * Generates an SEO-optimized HTML document for a specific route
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
  schemas = []
}) {
  const fullCanonical = canonicalUrl || `${DOMAIN}${route.startsWith('/') ? '' : '/'}${route}`;
  const finalTitle = title.includes('Toplantı Merkezi') ? title : `${title} | Toplantı Merkezi`;
  const finalOgImage = ogImage || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80';
  const finalKeywords = keywords || 'toplantı organizasyonu, bayi toplantısı, şirket toplantısı, kurumsal etkinlik, kongre organizasyonu, kurumsal piknik, 81 il organizasyon';

  let html = baseTemplate;

  // 1. Replace Title
  html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(finalTitle)}</title>`);
  html = html.replace(/<meta name="title" content=".*?" \/>/s, `<meta name="title" content="${escapeHtml(finalTitle)}" />`);

  // 2. Replace Meta Description
  html = html.replace(/<meta name="description"\s+content=".*?" \/>/s, `<meta name="description" content="${escapeHtml(description)}" />`);

  // 3. Replace Keywords
  html = html.replace(/<meta name="keywords"\s+content=".*?" \/>/s, `<meta name="keywords" content="${escapeHtml(finalKeywords)}" />`);

  // 4. Replace or Set Canonical Tag
  if (html.includes('<link rel="canonical"')) {
    html = html.replace(/<link rel="canonical" href=".*?" \/>/s, `<link rel="canonical" href="${fullCanonical}" />`);
  } else {
    html = html.replace('</head>', `  <link rel="canonical" href="${fullCanonical}" />\n</head>`);
  }

  // 5. Replace OpenGraph & Twitter Tags
  html = html.replace(/<meta property="og:url" content=".*?" \/>/s, `<meta property="og:url" content="${fullCanonical}" />`);
  html = html.replace(/<meta property="og:title" content=".*?" \/>/s, `<meta property="og:title" content="${escapeHtml(finalTitle)}" />`);
  html = html.replace(/<meta property="og:description"\s+content=".*?" \/>/s, `<meta property="og:description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<meta property="twitter:url" content=".*?" \/>/s, `<meta property="twitter:url" content="${fullCanonical}" />`);
  html = html.replace(/<meta property="twitter:title" content=".*?" \/>/s, `<meta property="twitter:title" content="${escapeHtml(finalTitle)}" />`);
  html = html.replace(/<meta property="twitter:description"\s+content=".*?" \/>/s, `<meta property="twitter:description" content="${escapeHtml(description)}" />`);

  // 6. Build Rich Schemas (JSON-LD)
  const fullSchemas = [...schemas];

  // Breadcrumbs Schema
  if (breadcrumbs.length > 0) {
    fullSchemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((b, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: b.name,
        item: b.url.startsWith('http') ? b.url : `${DOMAIN}${b.url.startsWith('/') ? '' : '/'}${b.url}`
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
  if (schemaTags) {
    html = html.replace('</head>', `${schemaTags}\n</head>`);
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
          81 ilde anahtar teslim kongre, bayi toplantısı, sahne, LED ekran ve salon çözümleri için 2 saat içinde detaylı bütçenizi hazırlayalım.
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

  // Additional Cluster Routes defined in App.jsx
  const additionalClusterSlugs = [
    { slug: 'sirket-toplantisi', title: 'Şirket Toplantısı', parent: 'toplanti-organizasyonu' },
    { slug: 'motivasyon-toplantisi', title: 'Motivasyon Toplantısı', parent: 'toplanti-organizasyonu' },
    { slug: 'strateji-toplantisi', title: 'Strateji Toplantısı', parent: 'toplanti-organizasyonu' },
    { slug: 'donem-toplantisi', title: 'Dönem Toplantısı', parent: 'toplanti-organizasyonu' },
    { slug: 'bayi-bulusmasi', title: 'Bayi Buluşması', parent: 'bayi-toplantisi-organizasyonu' },
    { slug: 'bayi-egitimi', title: 'Bayi Eğitimi', parent: 'bayi-toplantisi-organizasyonu' },
    { slug: 'bayi-motivasyon-toplantisi', title: 'Bayi Motivasyon Toplantısı', parent: 'bayi-toplantisi-organizasyonu' },
    { slug: 'sempozyum-organizasyonu', title: 'Sempozyum Organizasyonu', parent: 'kongre-organizasyonu' },
    { slug: 'zirve-organizasyonu', title: 'Zirve Organizasyonu', parent: 'kongre-organizasyonu' },
    { slug: 'panel-organizasyonu', title: 'Panel Organizasyonu', parent: 'kongre-organizasyonu' },
    { slug: 'seminer-organizasyonu', title: 'Seminer Organizasyonu', parent: 'kongre-organizasyonu' },
    { slug: 'egitim-organizasyonu', title: 'Kurumsal Eğitim Organizasyonu', parent: 'kongre-organizasyonu' },
    { slug: 'kurumsal-organizasyon', title: 'Kurumsal Organizasyon', parent: 'kurumsal-piknik-organizasyonu' },
    { slug: 'kurumsal-etkinlik', title: 'Kurumsal Etkinlik Yönetimi', parent: 'kurumsal-piknik-organizasyonu' },
    { slug: 'kurumsal-piknik', title: 'Kurumsal Piknik', parent: 'kurumsal-piknik-organizasyonu' },
    { slug: 'sirket-piknigi', title: 'Şirket Pikniği', parent: 'kurumsal-piknik-organizasyonu' },
    { slug: 'personel-etkinligi', title: 'Personel Etkinliği', parent: 'kurumsal-piknik-organizasyonu' },
    { slug: 'aile-gunu-organizasyonu', title: 'Aile Günü Organizasyonu', parent: 'kurumsal-piknik-organizasyonu' },
    { slug: 'team-building', title: 'Takım Çalışması & Team Building', parent: 'kurumsal-piknik-organizasyonu' },
    { slug: 'odul-toreni', title: 'Kurumsal Ödül Töreni', parent: 'kurumsal-piknik-organizasyonu' },
    { slug: 'acilis-organizasyonu', title: 'Açılış Organizasyonu', parent: 'kurumsal-piknik-organizasyonu' },
    { slug: 'roadshow-organizasyonu', title: 'Roadshow Organizasyonu', parent: 'kurumsal-piknik-organizasyonu' },
    { slug: 'resmi-toren-organizasyonu', title: 'Resmî Tören Organizasyonu', parent: 'kamu-organizasyonu' },
    { slug: 'kamu-toplantisi', title: 'Kamu Toplantısı Yönetimi', parent: 'kamu-organizasyonu' },
    { slug: 'acilis-toreni', title: 'Açılış Töreni Yönetimi', parent: 'kamu-organizasyonu' },
    { slug: 'temel-atma-toreni', title: 'Temel Atma Töreni Organizasyonu', parent: 'kamu-organizasyonu' }
  ];

  additionalClusterSlugs.forEach(item => {
    if (!addedClusterSlugs.has(item.slug)) {
      addedClusterSlugs.add(item.slug);
      const html = buildHtml({
        route: `/${item.slug}`,
        title: `${item.title} Organizasyonu | Toplantı Merkezi`,
        description: `Türkiye genelinde 81 ilde profesyonel ${item.title.toLowerCase()} çözümleri: Mekân, ses-ışık, LED ekran, reji ve ikram yönetimi.`,
        canonicalUrl: `${DOMAIN}/${item.slug}`,
        h1: `${item.title} Çözümleri`,
        aiDirectAnswer: `${item.title}; şirket ve kurumların kurumsal hedeflerini gerçekleştirmek üzere düzenledikleri, profesyonel salon seçimi, teknik reji, karşılama ve ikram hizmetleri içeren B2B etkinliktir.`,
        breadcrumbs: [
          { name: 'Organizasyonlar', url: `/${item.parent}` },
          { name: item.title, url: `/${item.slug}` }
        ]
      });
      writePage(`/${item.slug}`, html);
      pageCount++;
    }
  });

  // 3. 81 Cities Pages (/sehirler/${slug})
  ALL_81_CITIES.forEach(city => {
    const prominent = PROMINENT_CITIES.find(p => p.slug === city.slug) || {};
    const overview = prominent.overview || `${city.name} ilinde bayi toplantısı, şirket toplantısı, kurumsal etkinlik ve kongre organizasyonları için profesyonel salon ve teknik altyapı çözümleri sunuyoruz.`;
    const cityHtml = buildHtml({
      route: `/sehirler/${city.slug}`,
      title: `${city.name} Kurumsal Toplantı & Organizasyon Çözümleri | Toplantı Merkezi`,
      description: `${city.name} toplantı salonları, kongre otelleri, bayi toplantısı ve kurumsal etkinlik yönetimi. 81 ilde tek merkezden yerel operasyon güvencesi.`,
      canonicalUrl: `${DOMAIN}/sehirler/${city.slug}`,
      h1: `${city.name} Kurumsal Toplantı ve Organizasyon Çözümleri`,
      aiDirectAnswer: `${city.name} genelinde kurumsal organizasyonlar; şehirdeki 5 yıldızlı kongre otelleri, toplantı salonları ve açık hava tesislerinde LED ekran, ses-ışık, reji, transfer ve catering hizmetleri tek merkezden koordine edilerek gerçekleştirilir.`,
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
      ]
    });
    writePage(`/sehirler/${city.slug}`, cityHtml);
    pageCount++;
  });

  // 4. Focus Cities x Popular Organizations (/sehirler/${citySlug}/${orgSlug})
  const focusCities = ['istanbul', 'ankara', 'antalya', 'izmir', 'adana', 'bursa', 'kocaeli', 'gaziantep', 'konya', 'kayseri', 'mugla', 'eskisehir', 'samsun', 'trabzon'];
  const popularOrgs = [
    { slug: 'bayi-toplantisi', title: 'Bayi Toplantısı' },
    { slug: 'sirket-toplantilari', title: 'Şirket Toplantısı' },
    { slug: 'kongre-konferans', title: 'Kongre & Konferans' },
    { slug: 'kurumsal-piknik', title: 'Kurumsal Piknik' },
    { slug: 'kamu-protokol-organizasyonlari', title: 'Kamu & Protokol' }
  ];

  focusCities.forEach(cSlug => {
    const city = ALL_81_CITIES.find(c => c.slug === cSlug);
    if (!city) return;
    popularOrgs.forEach(org => {
      const route = `/sehirler/${cSlug}/${org.slug}`;
      const title = `${city.name} ${org.title} Organizasyonu | Toplantı Merkezi`;
      const desc = `${city.name} ilinde profesyonel ${org.title.toLowerCase()} organizasyonu: Salon seçimi, dev LED ekran, profesyonel ses-ışık, sahne ve catering tek merkezden yönetilir.`;
      const html = buildHtml({
        route,
        title,
        description: desc,
        canonicalUrl: `${DOMAIN}${route}`,
        h1: `${city.name} ${org.title} Organizasyonu`,
        aiDirectAnswer: `${city.name} ${org.title.toLowerCase()} organizasyonu; katılımcı sayısına göre en uygun otel ve salonların belirlenmesi, 3D sahne tasarımı, teknik ekipman ve saha yönetimini kapsayan anahtar teslim kurumsal hizmettir.`,
        breadcrumbs: [
          { name: 'Şehirler', url: '/sehirler' },
          { name: city.name, url: `/sehirler/${cSlug}` },
          { name: org.title, url: route }
        ]
      });
      writePage(route, html);
      pageCount++;
    });
  });

  // 5. 9 Organizations Catalog Details (/organizasyonlar/${slug})
  ORGANIZATIONS.forEach(org => {
    const orgHtml = buildHtml({
      route: `/organizasyonlar/${org.slug}`,
      title: `${org.title} | Toplantı Merkezi`,
      description: org.shortDesc || org.overview,
      canonicalUrl: `${DOMAIN}/organizasyonlar/${org.slug}`,
      h1: org.title,
      aiDirectAnswer: org.overview,
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

  // 6. 10 Services Details (/hizmetler/${slug})
  SERVICES.forEach(service => {
    const srvHtml = buildHtml({
      route: `/hizmetler/${service.slug}`,
      title: `${service.title} Hizmeti | Toplantı Merkezi`,
      description: service.shortDesc,
      canonicalUrl: `${DOMAIN}/hizmetler/${service.slug}`,
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

  // 7. Industry Details (/sektorler/${slug})
  INDUSTRIES.forEach(ind => {
    const indHtml = buildHtml({
      route: `/sektorler/${ind.slug}`,
      title: ind.seoTitle || `${ind.title} Organizasyon Çözümleri | Toplantı Merkezi`,
      description: ind.metaDesc,
      canonicalUrl: `${DOMAIN}/sektorler/${ind.slug}`,
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

  // 8. Blog Posts (/blog/${slug})
  BLOG_POSTS.forEach(post => {
    const postHtml = buildHtml({
      route: `/blog/${post.slug}`,
      title: `${post.title} | Toplantı Merkezi Blog`,
      description: post.summary,
      canonicalUrl: `${DOMAIN}/blog/${post.slug}`,
      h1: post.title,
      ogImage: post.image,
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

  // 9. Topic Hub Guides (/rehber/${slug})
  TOPIC_HUBS.forEach(hub => {
    const hubHtml = buildHtml({
      route: `/rehber/${hub.slug}`,
      title: `${hub.title} | Toplantı Merkezi Rehber`,
      description: hub.metaDesc,
      canonicalUrl: `${DOMAIN}/rehber/${hub.slug}`,
      h1: hub.title,
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

  // 10. Standard Core Pages
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
    { route: '/iletisim', title: 'İletişim & Kurumsal Operasyon Ofisi', desc: 'Toplantı Merkezi çağrı merkezi, Levent operasyon ofisi ve kurumsal iletişim bilgileri.' }
  ];

  standardPages.forEach(p => {
    const html = buildHtml({
      route: p.route,
      title: `${p.title} | Toplantı Merkezi`,
      description: p.desc,
      canonicalUrl: `${DOMAIN}${p.route}`,
      h1: p.title,
      breadcrumbs: [
        { name: p.title, url: p.route }
      ]
    });
    writePage(p.route, html);
    pageCount++;
  });

  console.log(`[Prerender] Successfully generated ${pageCount} static HTML pages in dist/!`);
}

runPrerender().catch(err => {
  console.error('[Prerender] Error during pre-rendering:', err);
  process.exit(1);
});
