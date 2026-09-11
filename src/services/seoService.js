export const DEFAULT_SEO_CONFIG = {
  domain: 'https://www.toplantimerkezi.com.tr',
  siteName: 'Toplantı Merkezi',
  defaultTitle: "Toplantı Merkezi | Türkiye'nin Her Yerinde Kurumsal Organizasyon Çözümleri",
  defaultDesc: "Bayi toplantılarından şirket organizasyonlarına, kamu toplantılarından kurumsal pikniklere kadar tüm süreci profesyonel ekibimizle planlıyor, koordine ediyor ve yönetiyoruz. 81 ilde tek merkezden hizmet.",
  defaultOgImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
  defaultKeywords: "toplantı organizasyonu, bayi toplantısı, şirket toplantısı, kurumsal etkinlik, kongre organizasyonu, kurumsal piknik, lansman organizasyonu, 81 il organizasyon",
  geo: {
    region: 'TR-34',
    placename: 'Levent, Beşiktaş, İstanbul, Türkiye',
    position: '41.0778;29.0125',
    icbm: '41.0778, 29.0125'
  }
};

/**
 * Sayfa SEO, GEO ve Yapılandırılmış Veri (JSON-LD) Yöneticisi
 */
export const updatePageSeo = ({
  title,
  description,
  canonicalUrl,
  ogImage,
  keywords,
  schemaJson,
  schemaType,
  schemaData,
  breadcrumbs,
  faqs,
  geo,
  robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
}) => {
  if (typeof document === 'undefined') return;

  const resolvedCanonical = canonicalUrl || (
    typeof window !== 'undefined'
      ? `${DEFAULT_SEO_CONFIG.domain}${window.location.pathname}`
      : DEFAULT_SEO_CONFIG.domain
  );

  const finalTitle = title 
    ? (title.includes('Toplantı Merkezi') ? title : `${title} | Toplantı Merkezi`) 
    : DEFAULT_SEO_CONFIG.defaultTitle;
  const finalDesc = description || DEFAULT_SEO_CONFIG.defaultDesc;
  const finalOgImage = ogImage || DEFAULT_SEO_CONFIG.defaultOgImage;
  const finalKeywords = keywords || DEFAULT_SEO_CONFIG.defaultKeywords;

  // 1. Document Title
  document.title = finalTitle;

  // 2. Meta Tag Helper
  const setMeta = (nameAttr, nameVal, content) => {
    let el = document.querySelector(`meta[${nameAttr}="${nameVal}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(nameAttr, nameVal);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // Primary Meta Tags
  setMeta('name', 'description', finalDesc);
  setMeta('name', 'keywords', finalKeywords);
  setMeta('name', 'robots', robots);
  setMeta('name', 'author', 'Toplantı Merkezi Kurumsal Organizasyon A.Ş.');

  // 3. Canonical Link
  let canonicalEl = document.querySelector('link[rel="canonical"]');
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', resolvedCanonical);

  // 4. OpenGraph & Social Tags
  setMeta('property', 'og:type', 'website');
  setMeta('property', 'og:locale', 'tr_TR');
  setMeta('property', 'og:site_name', DEFAULT_SEO_CONFIG.siteName);
  setMeta('property', 'og:url', resolvedCanonical);
  setMeta('property', 'og:title', finalTitle);
  setMeta('property', 'og:description', finalDesc);
  setMeta('property', 'og:image', finalOgImage);

  // 5. Twitter Card Tags
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', finalTitle);
  setMeta('name', 'twitter:description', finalDesc);
  setMeta('name', 'twitter:image', finalOgImage);
  setMeta('name', 'twitter:url', resolvedCanonical);

  // 6. GEO & Coğrafi Konum Metadata
  const currentGeo = geo || DEFAULT_SEO_CONFIG.geo;
  setMeta('name', 'geo.region', currentGeo.region || DEFAULT_SEO_CONFIG.geo.region);
  setMeta('name', 'geo.placename', currentGeo.placename || DEFAULT_SEO_CONFIG.geo.placename);
  setMeta('name', 'geo.position', currentGeo.position || DEFAULT_SEO_CONFIG.geo.position);
  setMeta('name', 'ICBM', currentGeo.icbm || DEFAULT_SEO_CONFIG.geo.icbm);
  setMeta('name', 'target_country', 'tr');
  setMeta('name', 'coverage', currentGeo.placename || 'Turkey');

  // 7. Dynamic JSON-LD Structured Data
  // Remove existing dynamic schemas
  document.querySelectorAll('script[data-dynamic-seo="true"]').forEach(el => el.remove());

  const schemasToInject = [];

  // A) Main Page Schema (Service, LocalBusiness, Organization vb.)
  if (schemaJson) {
    schemasToInject.push(schemaJson);
  } else if (schemaType && schemaData) {
    schemasToInject.push({
      '@context': 'https://schema.org',
      '@type': schemaType,
      ...schemaData
    });
  }

  // B) Breadcrumbs Schema
  if (Array.isArray(breadcrumbs) && breadcrumbs.length > 0) {
    schemasToInject.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((b, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: b.name,
        item: b.url.startsWith('http') ? b.url : `${DEFAULT_SEO_CONFIG.domain}${b.url.startsWith('/') ? '' : '/'}${b.url}`
      }))
    });
  }

  // C) FAQPage Schema
  if (Array.isArray(faqs) && faqs.length > 0) {
    schemasToInject.push({
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

  // Inject each schema
  schemasToInject.forEach((schemaObj, index) => {
    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-dynamic-seo', 'true');
    script.setAttribute('data-schema-idx', String(index));
    script.textContent = JSON.stringify(schemaObj);
    document.head.appendChild(script);
  });
};
