export const DEFAULT_SEO_CONFIG = {
  domain: 'https://www.toplantimerkezi.com.tr',
  siteName: 'Toplantı Merkezi',
  legalName: 'Toplantı Merkezi Kurumsal Organizasyon A.Ş.',
  defaultTitle: 'Toplantı Merkezi | Kurumsal Organizasyon & Toplantı Çözümleri',
  defaultDesc: 'Bayi toplantılarından şirket organizasyonlarına, kamu toplantılarından kurumsal pikniklere kadar tüm süreci profesyonel ekibimizle planlıyor, koordine ediyor ve yönetiyoruz. 81 ilde tek merkezden hizmet.',
  defaultOgImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
  defaultKeywords: 'toplantı organizasyonu, bayi toplantısı, bayi toplantısı organizasyonu, şirket toplantısı, kurumsal organizasyon, kurumsal etkinlik, kongre organizasyonu, kurumsal piknik, şirket pikniği, lansman organizasyonu, kamu organizasyonu, protokol organizasyonu, 81 il organizasyon, MICE Türkiye',
  geo: {
    region: 'TR-34',
    placename: 'Levent, Beşiktaş, İstanbul, Türkiye',
    position: '41.0778;29.0125',
    icbm: '41.0778, 29.0125',
    lat: 41.0778,
    lng: 29.0125
  }
};

/**
 * Sayfa SEO, GEO (Generative Engine Optimization & Coğrafi Konum) ve Yapılandırılmış Veri (JSON-LD) Yöneticisi
 */
export const updatePageSeo = ({
  title,
  description,
  canonicalUrl,
  ogImage,
  ogImageAlt,
  ogType = 'website',
  publishedTime,
  modifiedTime,
  keywords,
  schemaJson,
  schemaType,
  schemaData,
  breadcrumbs,
  faqs,
  howTo,
  itemList,
  geo,
  speakableSelectors = ['h1', '[data-geo-answer="true"]', 'p.overview-text'],
  robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
}) => {
  if (typeof document === 'undefined') return;

  const isNoIndex = robots.includes('noindex');

  const resolvedCanonical = canonicalUrl || (
    typeof window !== 'undefined'
      ? `${DEFAULT_SEO_CONFIG.domain}${window.location.pathname === '/' ? '/' : window.location.pathname.replace(/\/$/, '')}`
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
    if (!content) return;
    let el = document.querySelector(`meta[${nameAttr}="${nameVal}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(nameAttr, nameVal);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // Primary Meta Tags
  setMeta('name', 'title', finalTitle);
  setMeta('name', 'description', finalDesc);
  setMeta('name', 'keywords', finalKeywords);
  setMeta('name', 'robots', robots);
  setMeta('name', 'googlebot', robots);
  setMeta('name', 'bingbot', robots);
  setMeta('name', 'author', DEFAULT_SEO_CONFIG.legalName);
  setMeta('name', 'rating', 'General');
  setMeta('name', 'revisit-after', '7 days');

  // Dublin Core & AI Citation Semantic Metadata (GEO)
  setMeta('name', 'dc.title', finalTitle);
  setMeta('name', 'dc.description', finalDesc);
  setMeta('name', 'dc.publisher', DEFAULT_SEO_CONFIG.legalName);
  setMeta('name', 'dc.language', 'tr');
  setMeta('name', 'citation_title', finalTitle);
  setMeta('name', 'citation_author', DEFAULT_SEO_CONFIG.siteName);
  setMeta('name', 'citation_publisher', DEFAULT_SEO_CONFIG.legalName);
  setMeta('name', 'citation_public_url', resolvedCanonical);
  setMeta('name', 'citation_language', 'tr');

  // 3. Canonical & Hreflang Links
  const setLinkTag = (rel, href, extraAttrs = {}) => {
    const selectorParts = [`link[rel="${rel}"]`];
    Object.entries(extraAttrs).forEach(([k, v]) => {
      selectorParts.push(`[${k}="${v}"]`);
    });
    const selector = selectorParts.join('');
    let linkEl = document.querySelector(selector);
    if (isNoIndex) {
      if (linkEl) linkEl.remove();
      return;
    }
    if (!linkEl) {
      linkEl = document.createElement('link');
      linkEl.setAttribute('rel', rel);
      Object.entries(extraAttrs).forEach(([k, v]) => linkEl.setAttribute(k, v));
      document.head.appendChild(linkEl);
    }
    linkEl.setAttribute('href', href);
  };

  setLinkTag('canonical', resolvedCanonical);
  setLinkTag('alternate', resolvedCanonical, { hreflang: 'tr-TR' });
  setLinkTag('alternate', resolvedCanonical, { hreflang: 'x-default' });

  // 4. OpenGraph & Social Tags
  setMeta('property', 'og:type', ogType);
  setMeta('property', 'og:locale', 'tr_TR');
  setMeta('property', 'og:site_name', DEFAULT_SEO_CONFIG.siteName);
  setMeta('property', 'og:url', resolvedCanonical);
  setMeta('property', 'og:title', finalTitle);
  setMeta('property', 'og:description', finalDesc);
  setMeta('property', 'og:image', finalOgImage);
  setMeta('property', 'og:image:width', '1200');
  setMeta('property', 'og:image:height', '630');
  setMeta('property', 'og:image:alt', ogImageAlt || finalTitle);

  if (ogType === 'article') {
    if (publishedTime) setMeta('property', 'article:published_time', publishedTime);
    if (modifiedTime) setMeta('property', 'article:modified_time', modifiedTime);
    setMeta('property', 'article:publisher', DEFAULT_SEO_CONFIG.domain);
  }

  // 5. Twitter Card Tags
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', finalTitle);
  setMeta('name', 'twitter:description', finalDesc);
  setMeta('name', 'twitter:image', finalOgImage);
  setMeta('name', 'twitter:image:alt', ogImageAlt || finalTitle);
  setMeta('name', 'twitter:url', resolvedCanonical);

  // 6. GEO & Coğrafi Konum Metadata
  const currentGeo = geo || DEFAULT_SEO_CONFIG.geo;
  const geoRegion = currentGeo.region || DEFAULT_SEO_CONFIG.geo.region;
  const geoPlacename = currentGeo.placename || DEFAULT_SEO_CONFIG.geo.placename;
  const geoPosition = currentGeo.position || DEFAULT_SEO_CONFIG.geo.position;
  const geoIcbm = currentGeo.icbm || DEFAULT_SEO_CONFIG.geo.icbm;

  setMeta('name', 'geo.region', geoRegion);
  setMeta('name', 'geo.placename', geoPlacename);
  setMeta('name', 'geo.position', geoPosition);
  setMeta('name', 'ICBM', geoIcbm);
  setMeta('name', 'geo.country', 'TR');
  setMeta('name', 'target_country', 'tr');
  setMeta('name', 'coverage', geo ? geoPlacename : 'Turkey (81 Provinces)');
  setMeta('name', 'dc.coverage', geo ? geoPlacename : 'Turkey');

  // 7. Dynamic JSON-LD Structured Data
  document.querySelectorAll('script[data-dynamic-seo="true"]').forEach(el => el.remove());

  if (isNoIndex) return;

  const schemasToInject = [];

  // A) WebPage Entity Schema with SpeakableSpecification (AI Voice & GEO)
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': schemaType === 'CollectionPage' || schemaType === 'ContactPage' || schemaType === 'AboutPage' ? schemaType : 'WebPage',
    '@id': `${resolvedCanonical}#webpage`,
    url: resolvedCanonical,
    name: finalTitle,
    description: finalDesc,
    inLanguage: 'tr-TR',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${DEFAULT_SEO_CONFIG.domain}/#website`,
      name: DEFAULT_SEO_CONFIG.siteName,
      url: DEFAULT_SEO_CONFIG.domain
    },
    about: {
      '@type': 'Organization',
      '@id': `${DEFAULT_SEO_CONFIG.domain}/#organization`,
      name: DEFAULT_SEO_CONFIG.siteName
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: finalOgImage
    }
  };

  if (speakableSelectors && speakableSelectors.length > 0) {
    webPageSchema.speakable = {
      '@type': 'SpeakableSpecification',
      cssSelector: speakableSelectors
    };
  }

  schemasToInject.push(webPageSchema);

  // B) Main Page Domain Schema (Service, LocalBusiness, BlogPosting, Article, etc.)
  if (schemaJson) {
    schemasToInject.push(schemaJson);
  } else if (schemaType && schemaData) {
    let enrichedSchemaData = { ...schemaData };

    if (schemaType === 'LocalBusiness' || schemaType === 'ProfessionalService') {
      enrichedSchemaData = {
        '@context': 'https://schema.org',
        '@type': ['LocalBusiness', 'ProfessionalService'],
        '@id': `${resolvedCanonical}#localbusiness`,
        image: finalOgImage,
        priceRange: '₺₺₺₺',
        currenciesAccepted: 'TRY',
        paymentAccepted: 'Corporate Bank Transfer, Invoice',
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '08:30',
            closes: '19:30'
          }
        ],
        hasMap: currentGeo.lat && currentGeo.lng
          ? `https://maps.google.com/?q=${currentGeo.lat},${currentGeo.lng}`
          : 'https://maps.google.com/?q=41.0778,29.0125',
        parentOrganization: {
          '@type': 'Organization',
          '@id': `${DEFAULT_SEO_CONFIG.domain}/#organization`,
          name: DEFAULT_SEO_CONFIG.siteName,
          url: DEFAULT_SEO_CONFIG.domain
        },
        ...schemaData
      };
    } else if (schemaType === 'Service') {
      enrichedSchemaData = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${resolvedCanonical}#service`,
        provider: {
          '@type': 'Organization',
          '@id': `${DEFAULT_SEO_CONFIG.domain}/#organization`,
          name: DEFAULT_SEO_CONFIG.siteName,
          url: DEFAULT_SEO_CONFIG.domain,
          telephone: '+90 532 055 09 45'
        },
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'TRY',
          price: '0',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            priceCurrency: 'TRY',
            name: 'Kurumsal Özel Teklif (2 Saatte Resmi Bütçe)'
          }
        },
        termsOfService: `${DEFAULT_SEO_CONFIG.domain}/yasal/kullanim`,
        ...schemaData
      };
    } else if (!['CollectionPage', 'ContactPage', 'AboutPage'].includes(schemaType)) {
      enrichedSchemaData = {
        '@context': 'https://schema.org',
        '@type': schemaType,
        ...schemaData
      };
    } else {
      enrichedSchemaData = null;
    }

    if (enrichedSchemaData) {
      if (speakableSelectors && speakableSelectors.length > 0 && !enrichedSchemaData.speakable) {
        enrichedSchemaData.speakable = {
          '@type': 'SpeakableSpecification',
          cssSelector: speakableSelectors
        };
      }
      schemasToInject.push(enrichedSchemaData);
    }
  }

  // C) Breadcrumbs Schema
  if (Array.isArray(breadcrumbs) && breadcrumbs.length > 0) {
    schemasToInject.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': `${resolvedCanonical}#breadcrumb`,
      itemListElement: breadcrumbs.map((b, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: b.name,
        item: b.url.startsWith('http') ? b.url : `${DEFAULT_SEO_CONFIG.domain}${b.url.startsWith('/') ? '' : '/'}${b.url}`
      }))
    });
  }

  // D) FAQPage Schema
  if (Array.isArray(faqs) && faqs.length > 0) {
    const validFaqs = faqs.filter(f => (f.q || f.question) && (f.a || f.answer));
    if (validFaqs.length > 0) {
      schemasToInject.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': `${resolvedCanonical}#faq`,
        mainEntity: validFaqs.map(f => ({
          '@type': 'Question',
          name: f.q || f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a || f.answer
          }
        }))
      });
    }
  }

  // E) HowTo Schema (Adım Adım Planlama & Operasyon Süreci)
  if (howTo && Array.isArray(howTo.steps) && howTo.steps.length > 0) {
    schemasToInject.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      '@id': `${resolvedCanonical}#howto`,
      name: howTo.name || `${finalTitle} Planlama Süreci`,
      description: howTo.description || finalDesc,
      totalTime: howTo.totalTime || 'PT2H',
      step: howTo.steps.map((s, idx) => ({
        '@type': 'HowToStep',
        position: idx + 1,
        name: s.name || s.title || `Adım ${idx + 1}`,
        text: s.text || s.desc || ''
      }))
    });
  }

  // F) ItemList Schema (Katalog ve Liste Sayfaları İçin)
  if (Array.isArray(itemList) && itemList.length > 0) {
    schemasToInject.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${resolvedCanonical}#itemlist`,
      name: finalTitle,
      numberOfItems: itemList.length,
      itemListElement: itemList.map((item, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: item.name,
        description: item.description || undefined,
        url: item.url
          ? (item.url.startsWith('http') ? item.url : `${DEFAULT_SEO_CONFIG.domain}${item.url.startsWith('/') ? '' : '/'}${item.url}`)
          : undefined
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
