export const updatePageSeo = ({
  title,
  description,
  canonicalUrl,
  ogImage,
  keywords,
  schemaJson
}) => {
  if (typeof document === 'undefined') return;

  const defaultTitle = "Toplantı Merkezi | Türkiye'nin Her Yerinde Kurumsal Organizasyon Çözümleri";
  const defaultDesc = "Bayi toplantılarından şirket organizasyonlarına, kamu toplantılarından kurumsal pikniklere kadar tüm süreci profesyonel ekibimizle planlıyor, koordine ediyor ve yönetiyoruz. 81 ilde tek merkezden hizmet.";
  
  // 1. Document Title
  document.title = title ? `${title} | Toplantı Merkezi` : defaultTitle;

  // 2. Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', description || defaultDesc);

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

  // 4. Canonical
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', canonicalUrl || window.location.href);

  // 5. OpenGraph
  const ogTags = [
    { property: 'og:title', content: title || defaultTitle },
    { property: 'og:description', content: description || defaultDesc },
    { property: 'og:url', content: canonicalUrl || window.location.href },
    { property: 'og:image', content: ogImage || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80' }
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

  // 6. Schema.org JSON-LD
  const existingDynamicSchema = document.getElementById('dynamic-schema-json');
  if (existingDynamicSchema) {
    existingDynamicSchema.remove();
  }

  if (schemaJson) {
    const script = document.createElement('script');
    script.id = 'dynamic-schema-json';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schemaJson);
    document.head.appendChild(script);
  }
};
