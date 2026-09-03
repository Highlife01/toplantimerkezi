export const DEFAULT_SEO_CONFIG = {
  domain: 'https://www.toplantimerkezi.com.tr',
  defaultTitle: "Toplantı Merkezi | Türkiye'nin Her Yerinde Kurumsal Organizasyon Çözümleri",
  defaultDesc: "Bayi toplantılarından şirket organizasyonlarına, kamu toplantılarından kurumsal pikniklere kadar tüm süreci profesyonel ekibimizle planlıyor, koordine ediyor ve yönetiyoruz. 81 ilde tek merkezden hizmet.",
  defaultOgImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
  geo: {
    region: 'TR-34',
    placename: 'Levent, Beşiktaş, İstanbul, Türkiye',
    position: '41.0778;29.0125',
    icbm: '41.0778, 29.0125'
  }
};

export const updatePageSeo = ({
  title,
  description,
  canonicalUrl,
  ogImage,
  keywords,
  schemaJson,
  schemaType,
  schemaData,
  geo
}) => {
  if (typeof document === 'undefined') return;

  const resolvedCanonical = canonicalUrl || (
    typeof window !== 'undefined'
      ? `${DEFAULT_SEO_CONFIG.domain}${window.location.pathname}`
      : DEFAULT_SEO_CONFIG.domain
  );

  // 1. Document Title
  document.title = title ? `${title} | Toplantı Merkezi` : DEFAULT_SEO_CONFIG.defaultTitle;

  // 2. Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', description || DEFAULT_SEO_CONFIG.defaultDesc);

  // 3. Meta Keywords
  if (keywords) {
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);
  }

  // 4. Canonical Link
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', resolvedCanonical);

  // 5. OpenGraph & Twitter Tags
  const ogTags = [
    { property: 'og:title', content: title || DEFAULT_SEO_CONFIG.defaultTitle },
    { property: 'og:description', content: description || DEFAULT_SEO_CONFIG.defaultDesc },
    { property: 'og:url', content: resolvedCanonical },
    { property: 'og:image', content: ogImage || DEFAULT_SEO_CONFIG.defaultOgImage }
  ];

  ogTags.forEach(({ property, content }) => {
    let tag = document.querySelector(`meta[property="${property}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('property', property);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  });

  // 6. Geo-Targeting Metadata
  const currentGeo = geo || DEFAULT_SEO_CONFIG.geo;
  const geoMappings = [
    { name: 'geo.region', content: currentGeo.region || DEFAULT_SEO_CONFIG.geo.region },
    { name: 'geo.placename', content: currentGeo.placename || DEFAULT_SEO_CONFIG.geo.placename },
    { name: 'geo.position', content: currentGeo.position || DEFAULT_SEO_CONFIG.geo.position },
    { name: 'ICBM', content: currentGeo.icbm || DEFAULT_SEO_CONFIG.geo.icbm }
  ];

  geoMappings.forEach(({ name, content }) => {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  });

  // 7. Dynamic Schema.org JSON-LD Injection
  const existingDynamicSchema = document.getElementById('dynamic-schema-json');
  if (existingDynamicSchema) {
    existingDynamicSchema.remove();
  }

  const finalSchema = schemaJson || (schemaType && schemaData ? {
    '@context': 'https://schema.org',
    '@type': schemaType,
    ...schemaData
  } : null);

  if (finalSchema) {
    const script = document.createElement('script');
    script.id = 'dynamic-schema-json';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(finalSchema);
    document.head.appendChild(script);
  }
};
