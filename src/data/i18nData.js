/**
 * Toplantı Merkezi — 15 Dilli Global B2B MICE & Kurumsal Organizasyon Veri Katmanı
 *
 * Kullanıcı Tarafından İstenen 10 Dil:
 * 1. tr - Türkçe (Ana Dil)
 * 2. en - İngilizce (English)
 * 3. ru - Rusça (Русский)
 * 4. de - Almanca (Deutsch)
 * 5. it - İtalyanca (Italiano)
 * 6. es - İspanyolca (Español)
 * 7. zh - Çince (中文 - 简体)
 * 8. hi - Hintçe / Hindistanca (हिन्दी)
 * 9. ar - Arapça (العربية - RTL)
 * 10. fa - Farsça (فارسی - RTL)
 *
 * B2B MICE Stratejik Öneri Olarak Eklenen 5 Dil:
 * 11. fr - Fransızca (Français — Uluslararası Tıp Kongreleri, AB & Diplomasi Zirveleri)
 * 12. az - Azerbaycanca (Azərbaycan dili — Bakü-İstanbul-Antalya Enerji, Finans & Holding Zirveleri)
 * 13. ja - Japonca (日本語 — Türkiye'deki Japon Otomotiv, Sanayi & Teknoloji Yatırımları)
 * 14. ko - Korece (한국어 — Türkiye'deki Güney Kore Otomotiv, Elektronik & Altyapı Zirveleri)
 * 15. nl - Felemenkçe (Nederlands — Benelüks Finans, Lojistik ve Doğrudan Yabancı Yatırım Etkinlikleri)
 */

export const SUPPORTED_LANGUAGES = [
  {
    code: 'tr',
    hreflang: 'tr-TR',
    ogLocale: 'tr_TR',
    name: 'Türkçe',
    trName: 'Türkçe',
    nativeName: 'Türkçe',
    flag: '🇹🇷',
    dir: 'ltr',
    path: '/',
    regionLabel: 'Türkiye (81 İl Merkez Operasyon)',
    isRecommended: false,
    searchAliases: ['türkçe', 'turkce', 'turkish', 'tr', 'türkiye', '81 il', 'kurumsal organizasyon', 'bayi toplantısı', 'kongre'],
    seoKeywords: 'toplantı organizasyonu, bayi toplantısı organizasyonu, kurumsal organizasyon, kongre organizasyonu, şirket toplantısı, kurumsal piknik, kamu protokol organizasyonu, 81 il organizasyon, simultane tercüme'
  },
  {
    code: 'en',
    hreflang: 'en',
    ogLocale: 'en_US',
    name: 'İngilizce',
    trName: 'İngilizce',
    nativeName: 'English',
    flag: '🇬🇧',
    dir: 'ltr',
    path: '/en',
    regionLabel: 'Global / UK / USA / EMEA',
    isRecommended: false,
    searchAliases: ['ingilizce', 'english', 'en', 'uk', 'usa', 'international mice', 'corporate events turkey', 'dealer meeting', 'congress pco', 'simultaneous interpretation'],
    seoKeywords: 'B2B corporate event management Turkey, MICE agency Istanbul Antalya Ankara, dealer meeting organization Turkey, PCO congress organizer Türkiye, simultaneous interpretation Turkey, ingilizce kongre organizasyonu'
  },
  {
    code: 'ru',
    hreflang: 'ru-RU',
    ogLocale: 'ru_RU',
    name: 'Rusça',
    trName: 'Rusça',
    nativeName: 'Русский',
    flag: '🇷🇺',
    dir: 'ltr',
    path: '/ru',
    regionLabel: 'CIS & Eurasia MICE Desk',
    isRecommended: false,
    searchAliases: ['rusça', 'rusca', 'russian', 'русский', 'ru', 'корпоративные мероприятия', 'дилерская конференция', 'конгресс в турции', 'анталия', 'стамбул', 'синхронный перевод'],
    seoKeywords: 'организация корпоративных мероприятий в Турции, MICE агентство Турция Стамбул Анталия, дилерские конференции в Турции, конгрессы и форумы Турция, rusça kongre ve bayi toplantısı organizasyonu'
  },
  {
    code: 'de',
    hreflang: 'de-DE',
    ogLocale: 'de_DE',
    name: 'Almanca',
    trName: 'Almanca',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    dir: 'ltr',
    path: '/de',
    regionLabel: 'DACH (Deutschland, Österreich, Schweiz)',
    isRecommended: false,
    searchAliases: ['almanca', 'german', 'deutsch', 'de', 'dach', 'firmenveranstaltungen türkei', 'händlertagung', 'kongressorganisation', 'dolmetscher'],
    seoKeywords: 'B2B Eventagentur Türkei, Kongressorganisation Istanbul Antalya, Händlertagung Türkei, MICE Agentur Türkei, Simultanübersetzung Deutsch Türkisch, almanca kongre ve toplantı organizasyonu'
  },
  {
    code: 'it',
    hreflang: 'it-IT',
    ogLocale: 'it_IT',
    name: 'İtalyanca',
    trName: 'İtalyanca',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    dir: 'ltr',
    path: '/it',
    regionLabel: 'Italia & Mediterraneo',
    isRecommended: false,
    searchAliases: ['italyanca', 'italian', 'italiano', 'it', 'eventi aziendali turchia', 'congressi istanbul antalya', 'convention aziendali', 'interpretariato'],
    seoKeywords: 'organizzazione eventi aziendali Turchia, agenzia MICE Istanbul Antalya, congressi e convention Turchia, meeting dealer Turchia, italyanca kurumsal toplantı ve kongre organizasyonu'
  },
  {
    code: 'es',
    hreflang: 'es-ES',
    ogLocale: 'es_ES',
    name: 'İspanyolca',
    trName: 'İspanyolca',
    nativeName: 'Español',
    flag: '🇪🇸',
    dir: 'ltr',
    path: '/es',
    regionLabel: 'España & Latinoamérica',
    isRecommended: false,
    searchAliases: ['ispanyolca', 'spanish', 'español', 'espanol', 'es', 'eventos corporativos turquía', 'congresos estambul antalya', 'convenciones', 'traducción simultánea'],
    seoKeywords: 'organización de eventos corporativos en Turquía, agencia MICE Estambul Antalya, congresos y convenciones Turquía, reuniones de distribuidores Turquía, ispanyolca kongre organizasyonu'
  },
  {
    code: 'zh',
    hreflang: 'zh-CN',
    ogLocale: 'zh_CN',
    name: 'Çince',
    trName: 'Çince',
    nativeName: '中文',
    flag: '🇨🇳',
    dir: 'ltr',
    path: '/zh',
    regionLabel: 'Greater China & APAC MICE',
    isRecommended: false,
    searchAliases: ['çince', 'cince', 'chinese', '中文', '汉语', 'zh', '土耳其会奖旅游', '土耳其商务会议', '伊斯坦布尔会议', '经销商大会', '同声传译'],
    seoKeywords: '土耳其企业活动策划, 土耳其MICE会奖公司, 伊斯坦布尔安塔利亚会议展览, 土耳其经销商大会与新车发布会, 中土同声传译, çince kurumsal toplantı ve lansman organizasyonu'
  },
  {
    code: 'hi',
    hreflang: 'hi-IN',
    ogLocale: 'hi_IN',
    name: 'Hintçe (Hindistanca)',
    trName: 'Hintçe (Hindistanca)',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    dir: 'ltr',
    path: '/hi',
    regionLabel: 'India Corporate & Incentive Desk',
    isRecommended: false,
    searchAliases: ['hintçe', 'hintce', 'hindistanca', 'hindi', 'indian', 'हिन्दी', 'हिंदी', 'hi', 'कॉर्पोरेट इवेंट तुर्की', 'डीलर मीटिंग', 'इस्तांबुल अंताल्या कॉन्फ्रेंस'],
    seoKeywords: 'तुर्की में कॉर्पोरेट इवेंट और MICE एजेंसी, इस्तांबुल अंताल्या डीलर मीटिंग और कॉन्फ्रेंस, भारतीय कॉर्पोरेट इवेंट तुर्की, hintçe hindistanca kurumsal toplantı ve kongre organizasyonu'
  },
  {
    code: 'ar',
    hreflang: 'ar-SA',
    ogLocale: 'ar_SA',
    name: 'Arapça',
    trName: 'Arapça',
    nativeName: 'العربية',
    flag: '🇸🇦',
    dir: 'rtl',
    path: '/ar',
    regionLabel: 'GCC & MENA Executive Desk',
    isRecommended: false,
    searchAliases: ['arapça', 'arapca', 'arabic', 'العربية', 'عربي', 'ar', 'تنظيم المؤتمرات في تركيا', 'اجتماعات الشركات إسطنبول أنطاليا', 'فعاليات الشركات', 'ترجمة فورية'],
    seoKeywords: 'تنظيم المؤتمرات والفعاليات للشركات في تركيا, شركة MICE في إسطنبول وأنطاليا وأنقرة, اجتماعات الوكلاء والموزعين في تركيا, الترجمة الفورية العربية التركية, arapça kongre ve bayi toplantısı organizasyonu'
  },
  {
    code: 'fa',
    hreflang: 'fa-IR',
    ogLocale: 'fa_IR',
    name: 'Farsça',
    trName: 'Farsça',
    nativeName: 'فارسی',
    flag: '🇮🇷',
    dir: 'rtl',
    path: '/fa',
    regionLabel: 'Regional Trade & Dealer Summits',
    isRecommended: false,
    searchAliases: ['farsça', 'farsca', 'persian', 'farsi', 'فارسی', 'fa', 'برگزاری همایش در ترکیه', 'سمینار و کنفرانس استانبول آنتالیا', 'گردهمایی نمایندگان', 'ترجمه همزمان'],
    seoKeywords: 'برگزاری همایش و سمینارهای سازمانی در ترکیه, شرکت خدمات MICE در استانبول و آنتالیا, گردهمایی نمایندگان و کنفرانس های تجاری در ترکیه, farsça kurumsal toplantı ve kongre organizasyonu'
  },
  // Stratejik B2B MICE Önerilerimiz
  {
    code: 'fr',
    hreflang: 'fr-FR',
    ogLocale: 'fr_FR',
    name: 'Fransızca',
    trName: 'Fransızca',
    nativeName: 'Français',
    flag: '🇫🇷',
    dir: 'ltr',
    path: '/fr',
    regionLabel: 'France, Belgique, Suisse & Francophonie',
    isRecommended: true,
    recommendationReason: 'Uluslararası tıp kongreleri, AB kurumsal zirveleri ve diplomatik protokol organizasyonlarının resmi dili.',
    searchAliases: ['fransızca', 'fransizca', 'french', 'français', 'francais', 'fr', 'agence événementielle turquie', 'congrès istanbul antalya', 'séminaire entreprise'],
    seoKeywords: 'agence événementielle B2B Turquie, organisation de congrès Istanbul Antalya, séminaire et convention entreprise Turquie, agence MICE Turquie, fransızca kongre ve protokol organizasyonu'
  },
  {
    code: 'az',
    hreflang: 'az-AZ',
    ogLocale: 'az_AZ',
    name: 'Azerbaycanca',
    trName: 'Azerbaycanca',
    nativeName: 'Azərbaycan',
    flag: '🇦🇿',
    dir: 'ltr',
    path: '/az',
    regionLabel: 'Azərbaycan & Türk Dövlətləri MICE',
    isRecommended: true,
    recommendationReason: 'İstanbul ve Antalya’da düzenlenen Azerbaycan-Türkiye enerji, bankacılık ve holding bayi zirveleri için en yoğun B2B pazar.',
    searchAliases: ['azerbaycanca', 'azerice', 'azerbaijani', 'azərbaycan', 'azerbaycan', 'az', 'korporativ tədbirlər türkiyə', 'diler toplantısı antalya istanbul', 'konqres təşkili'],
    seoKeywords: 'Türkiyədə korporativ tədbirlərin və konqreslərin təşkili, İstanbul və Antalyada diler toplantısı, MICE agentliyi Türkiyə, azerbaycanca kurumsal toplantı ve zirve organizasyonu'
  },
  {
    code: 'ja',
    hreflang: 'ja-JP',
    ogLocale: 'ja_JP',
    name: 'Japonca',
    trName: 'Japonca',
    nativeName: '日本語',
    flag: '🇯🇵',
    dir: 'ltr',
    path: '/ja',
    regionLabel: 'Japan Automotive & Industrial Desk',
    isRecommended: true,
    recommendationReason: 'Türkiye’de üretim ve bölge merkezi bulunan Japon otomotiv, ilaç ve sanayi devlerinin EMEA bayi ve strateji toplantıları için.',
    searchAliases: ['japonca', 'japanese', '日本語', 'ja', 'トルコ法人イベント', 'イスタンブール会議', 'MICEトルコ', '同時通訳'],
    seoKeywords: 'トルコB2B法人イベント・MICE運営, イスタンブール・アンタルヤ国際会議・代理店総会, 日土同時通訳・VIPプロトコル, japonca kurumsal toplantı ve fabrika açılış organizasyonu'
  },
  {
    code: 'ko',
    hreflang: 'ko-KR',
    ogLocale: 'ko_KR',
    name: 'Korece',
    trName: 'Korece',
    nativeName: '한국어',
    flag: '🇰🇷',
    dir: 'ltr',
    path: '/ko',
    regionLabel: 'Korea Tech & Automotive MICE Desk',
    isRecommended: true,
    recommendationReason: 'Türkiye’deki Güney Koreli otomotiv, elektronik ve altyapı yatırımcılarının bayi lansmanları ve zirveleri için.',
    searchAliases: ['korece', 'korean', '한국어', 'ko', '튀르키예 기업 행사', '이스탄불 컨퍼런스', '터키 MICE', '동시통역'],
    seoKeywords: '튀르키예 B2B 기업 행사 및 MICE 대행사, 이스탄불 안탈리아 딜러 컨퍼런스 및 신제품 런칭, 한국어 동시통역 지원, korece kurumsal toplantı ve lansman organizasyonu'
  },
  {
    code: 'nl',
    hreflang: 'nl-NL',
    ogLocale: 'nl_NL',
    name: 'Felemenkçe',
    trName: 'Felemenkçe',
    nativeName: 'Nederlands',
    flag: '🇳🇱',
    dir: 'ltr',
    path: '/nl',
    regionLabel: 'Benelux (Nederland & België) Desk',
    isRecommended: true,
    recommendationReason: 'Türkiye’ye en yüksek doğrudan yabancı yatırım (FDI) yapan Hollanda ve Belçika merkezli kurumsal şirketlerin toplantıları için.',
    searchAliases: ['felemenkçe', 'felemenkce', 'hollandaca', 'dutch', 'nederlands', 'nl', 'zakelijke evenementen turkije', 'congres istanbul antalya', 'mice turkije'],
    seoKeywords: 'B2B evenementenbureau Turkije, congresorganisatie Istanbul Antalya, zakelijke bijeenkomsten en handelsmissies Turkije, felemenkçe hollandaca kurumsal toplantı organizasyonu'
  }
];

export const INTERNATIONAL_LANG_CODES = SUPPORTED_LANGUAGES
  .filter((l) => l.code !== 'tr')
  .map((l) => l.code);

export const LANGUAGE_MAP = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((l) => [l.code, l])
);

/**
 * Her dil için tam kapsamlı Kurumsal B2B MICE İçeriği, Navigasyon, SEO ve Teklif Formu Çevirileri
 */
export const I18N_CONTENT = {
  tr: {
    metaTitle: 'Toplantı & Kurumsal Organizasyon Yönetimi | 81 İlde Tek Merkezden | Toplantı Merkezi',
    metaDesc: "Türkiye'nin 81 ilinde bayi toplantısı, kongre, şirket toplantısı, lansman, kurumsal piknik ve resmi protokol organizasyonlarını tek merkezden yönetin.",
    nav: {
      topBanner: "Türkiye'nin 81 İlinde Kurumsal Organizasyon Çözümleri",
      topSub: 'Tek Merkezden Operasyon & 15 Dilde B2B MICE Portalı',
      home: 'Ana Sayfa',
      organizations: 'Organizasyonlar',
      services: 'Hizmetler',
      cities: '81 İl',
      venues: 'Mekânlar',
      guides: 'Rehberler',
      projects: 'Projeler',
      corporate: 'Kurumsal',
      contact: 'İletişim',
      quoteTracking: 'Teklif Takip',
      crmLogin: 'CRM Giriş',
      getQuote: 'Teklif Al',
      whatsappQuote: 'WhatsApp Teklif',
      langSelectorLabel: 'Dil / Ülke Seçimi'
    },
    hero: {
      badge: '81 İlde Organizasyon Çözümleri • Tek Merkezden Yönetim • 15 Dilde Uluslararası MICE Masası',
      titleLine1: "Türkiye'nin Her Yerinde",
      titleHighlight: 'Kurumsal Organizasyon',
      titleLine2: 'Çözümleri',
      subtitle: 'Bayi toplantılarından uluslararası kongrelere, kamu protokol törenlerinden kurumsal pikniklere kadar tüm süreci 81 ilde tek merkezden planlıyor, koordine ediyor ve yönetiyoruz.',
      primaryCta: 'Organizasyon Planla',
      secondaryCta: 'Kurumsal Çözümleri İncele',
      intlDeskTitle: 'Uluslararası MICE & Kongre Masaları (15 Dil):'
    }
  },

  en: {
    metaTitle: 'B2B Corporate Event Management & MICE Agency in Türkiye (All 81 Provinces) | Toplantı Merkezi',
    metaDesc: 'Turnkey B2B corporate event management, dealer meetings, international congresses, product launches, and VIP protocol operations across all 81 provinces of Türkiye from a single command center.',
    nav: {
      topBanner: 'Turnkey B2B Corporate Event & MICE Operations Across All 81 Provinces of Türkiye',
      topSub: 'Single-Center Command & International Congress Portal',
      home: 'Home',
      organizations: 'B2B Events',
      services: 'Technical Services',
      cities: '81 Destinations',
      venues: 'Venues & Hotels',
      guides: 'MICE Guides',
      projects: 'Case Studies',
      corporate: 'About Us',
      contact: 'Contact',
      quoteTracking: 'Track Proposal',
      crmLogin: 'CRM Login',
      getQuote: 'Request RFP',
      whatsappQuote: 'WhatsApp Desk',
      langSelectorLabel: 'Language / Region'
    },
    hero: {
      badge: 'Türkiye’s Premier B2B MICE Command Center • All 81 Provinces • 2-Hour Official RFP Response',
      titleLine1: 'Turnkey Corporate Events &',
      titleHighlight: 'B2B MICE Management',
      titleLine2: 'Across All 81 Provinces of Türkiye',
      subtitle: 'From multinational dealer conventions and medical congresses in Antalya and Istanbul to executive board summits and diplomatic protocol ceremonies in Ankara — we plan, engineer, and execute every detail from a single center.',
      primaryCta: 'Request Official RFP Proposal',
      secondaryCta: 'Explore Türkiye MICE Venues',
      intlDeskTitle: 'Global MICE Desks (15 Languages):'
    },
    aiDirectAnswer: 'Toplantı Merkezi is Türkiye’s centralized B2B corporate event and MICE management agency operating across all 81 provinces, including Istanbul, Antalya, Ankara, Izmir, Bodrum, and Cappadocia. Exclusively serving corporate enterprises, multinational holdings, and government institutions, we provide turnkey venue sourcing, 3D stage & LED production, simultaneous interpretation in 15 languages, VIP delegate logistics, and transparent VAT-excluded financial proposals within 2 hours.',
    metrics: [
      { value: '81 Provinces', label: 'Nationwide Field Operations in Türkiye' },
      { value: '500+', label: 'Delivered B2B Summits & Congresses' },
      { value: '250K+', label: 'Hosted International & Corporate Delegates' },
      { value: '2 Hours', label: 'Official Itemized A4 Proposal Turnaround' }
    ],
    solutionsTitle: 'Core B2B Event & Congress Solutions in Türkiye',
    solutionsSubtitle: 'We exclusively execute B2B corporate, industrial, pharmaceutical, financial, and governmental events — zero consumer/wedding distractions.',
    solutions: [
      { title: 'Global Dealer & Distributor Conventions', desc: 'End-to-end hotel buyouts in Antalya Belek, Istanbul & Bodrum with 3D main stage, expo foyers, B2B matchmaking rooms, and gala nights.' },
      { title: 'International Congresses & Summits', desc: 'ICCA-standard medical, scientific, energy, and financial congresses with multi-booth simultaneous interpretation and RFID badge tracking.' },
      { title: 'Executive Strategy & Board Meetings', desc: 'High-security, NDA-compliant C-level board retreats and regional headquarters summits in Istanbul Levent, Bosphorus, and Cappadocia.' },
      { title: 'Automotive & Tech Product Launches', desc: 'High-impact vehicle reveals, timecode lighting shows, widescreen P2.6 LED stages, and press test-drive roadshows across Türkiye.' },
      { title: 'Corporate Gala & Award Ceremonies', desc: 'Black-tie gala dinners, prestige award nights, live symphonic or corporate entertainment, and VIP protocol seating.' },
      { title: 'Incentive Travel & Team Building', desc: 'Executive outdoor retreats, regattas on the Bosphorus, Cappadocia hot-air balloon charters, and structured B2B team workshops.' }
    ],
    servicesTitle: 'In-House Technical Production & MICE Infrastructure',
    services: [
      { title: '5-Star Congress Hotel & Venue Sourcing', desc: 'Direct corporate contracting with 500+ convention centers and 5-star MICE hotels across Istanbul, Antalya, Ankara, Izmir, and 81 cities.' },
      { title: '3D Stage, Scenic & P2.6 LED Engineering', desc: 'Custom modular stages, curved widescreen LED walls, watchout media servers, and redundant line-array sound systems.' },
      { title: 'Simultaneous Interpretation (15 Languages)', desc: 'ISO-certified soundproof booths, Bosch infrared receivers, and accredited conference interpreters for global delegations.' },
      { title: 'VIP Aviation, Transfer & Delegate Logistics', desc: 'Airport fast-track, dedicated fleet transfers, rooming-list management, and 24/7 multilingual hospitality desks.' }
    ],
    destinationsTitle: 'Top MICE Destinations in Türkiye',
    destinations: [
      { city: 'Istanbul', tag: 'Global Financial & Congress Hub', desc: 'Bosphorus luxury hotels, Haliç & Lütfi Kırdar Congress Centers, Levent business district — ideal for EMEA summits.' },
      { city: 'Antalya (Belek & Lara)', tag: 'Resort MICE & Dealer Capital', desc: 'All-inclusive 5-star convention resorts with 2,000 to 5,000-seat pillarless ballrooms and private expo centers.' },
      { city: 'Ankara', tag: 'Diplomatic, Public & Defense Hub', desc: 'Official state protocol venues, ministry conferences, defense industry summits, and chamber of commerce assemblies.' },
      { city: 'Izmir & Bodrum & Cappadocia', tag: 'Executive Retreats & Incentives', desc: 'Aegean coastal luxury resorts and Cappadocia heritage venues for C-level retreats and international incentive groups.' }
    ],
    form: {
      badge: 'Direct International MICE Desk • 2-Hour Response',
      title: 'Request an Official B2B Event Proposal (RFP)',
      subtitle: 'Your request is routed directly to our Senior International MICE Directors and recorded in our live CRM with an itemized VAT-excluded A4 PDF quotation.',
      company: 'Company / Organization Name *',
      contactName: 'Full Name & Job Title *',
      email: 'Corporate Email Address *',
      phone: 'Phone / WhatsApp Number (with country code) *',
      orgType: 'Event Type',
      city: 'Preferred Destination in Türkiye',
      attendees: 'Estimated Delegates',
      targetDate: 'Target Event Date',
      budget: 'Estimated Budget Range (EUR / USD / TRY)',
      notes: 'Technical Requirements, Accommodation & Interpretation Notes',
      submitBtn: 'Submit Official RFP & Get Tracking Code',
      submitting: 'Transmitting to MICE Command Desk...',
      successTitle: 'Your Official RFP Has Been Registered!',
      successDesc: 'Your request is now active in our CRM pipeline. Save your reference code and security token below to track your itemized PDF proposal online:',
      trackBtn: 'Open Secure Proposal Tracker'
    },
    faqs: [
      {
        q: 'How quickly can Toplantı Merkezi deliver an itemized RFP budget for an international event in Türkiye?',
        a: 'Within 2 business hours of receiving your brief, our MICE desk prepares venue comparisons, ballroom capacity charts, technical AV/LED specifications, and a transparent VAT-excluded A4 PDF proposal.'
      },
      {
        q: 'Do you provide simultaneous interpretation and multilingual staff on-site?',
        a: 'Yes. We provide ISO-compliant interpretation booths, infrared receivers, and certified conference interpreters across all 15 supported languages (English, Russian, German, Italian, Spanish, Chinese, Hindi, Arabic, Persian, French, Azerbaijani, Japanese, Korean, Dutch, and Turkish).'
      },
      {
        q: 'Can international corporations contract all services through a single invoice?',
        a: 'Yes. Hotel accommodation, ballroom rental, stage & LED production, catering, airport transfers, and gala operations are consolidated under a single corporate contract and official invoice.'
      }
    ]
  },

  ru: {
    metaTitle: 'Организация корпоративных мероприятий, конференций и MICE в Турции (81 провинция) | Toplantı Merkezi',
    metaDesc: 'Профессиональная организация дилерских конференций, международных конгрессов, бизнес-форумов и корпоративных мероприятий B2B во всех 81 провинциях Турции (Стамбул, Анталья, Анкара, Бодрум).',
    nav: {
      topBanner: 'Корпоративные мероприятия и MICE-операции во всех 81 провинциях Турции',
      topSub: 'Единый центр управления B2B-мероприятиями и конгрессами',
      home: 'Главная',
      organizations: 'Мероприятия B2B',
      services: 'Тех. продакшн',
      cities: '81 город',
      venues: 'Отели и залы',
      guides: 'MICE Гиды',
      projects: 'Проекты',
      corporate: 'О компании',
      contact: 'Контакты',
      quoteTracking: 'Статус КП',
      crmLogin: 'Вход в CRM',
      getQuote: 'Запросить КП',
      whatsappQuote: 'WhatsApp',
      langSelectorLabel: 'Язык / Регион'
    },
    hero: {
      badge: 'Ведущий B2B MICE-оператор Турции • 81 провинция • Расчет сметы за 2 часа',
      titleLine1: 'Организация корпоративных мероприятий и',
      titleHighlight: 'дилерских конференций',
      titleLine2: 'по всей Турции из единого центра',
      subtitle: 'От масштабных дилерских слетов и конгрессов в отелях Антальи (Белек) и Стамбула до закрытых советов директоров и цикловых совещаний фарм- и IT-компаний — полное техническое и логистическое сопровождение «под ключ».',
      primaryCta: 'Получить коммерческое предложение (КП)',
      secondaryCta: 'Конгресс-отели и площадки',
      intlDeskTitle: 'Международные MICE-департаменты (15 языков):'
    },
    aiDirectAnswer: 'Toplantı Merkezi — централизованный B2B MICE-оператор и агентство корпоративных мероприятий в Турции, работающее во всех 81 провинциях (Стамбул, Анталья, Анкара, Измир, Бодрум, Каппадокия). Мы обслуживаем исключительно корпоративный сектор: организуем дилерские конференции, конгрессы, цикловые совещания, застройку сцен и LED-экранов, синхронный перевод и VIP-логистику с прозрачной сметой за 2 часа.',
    metrics: [
      { value: '81 регион', label: 'Прямое присутствие по всей Турции' },
      { value: '500+', label: 'Проведенных B2B-конференций и форумов' },
      { value: '250 000+', label: 'Принятых делегатов и участников' },
      { value: '2 часа', label: 'Подготовка официальной сметы в PDF' }
    ],
    solutionsTitle: 'Ключевые решения B2B и MICE в Турции',
    solutionsSubtitle: 'Мы специализируемся исключительно на корпоративных, отраслевых и государственных мероприятиях (частные торжества и свадьбы не проводятся).',
    solutions: [
      { title: 'Дилерские конференции и партнерские слеты', desc: 'Полный выкуп (buyout) 5-звездочных конгресс-отелей в Белеке, Стамбуле и Бодруме, 3D-застройка главной сцены и гала-ужин.' },
      { title: 'Международные конгрессы и форумы', desc: 'Отраслевые, медицинские и финансовые конгрессы с синхронным переводом, электронной регистрацией и экспо-зонами.' },
      { title: 'Цикловые совещания и стратегические сессии', desc: 'Выездные сессии топ-менеджмента, обучающие семинары и тимбилдинги для международных корпораций.' },
      { title: 'Презентации продуктов и авто-лончи', desc: 'Премьеры автомобилей, шоу с таймкодом, широкоформатные LED-экраны P2.6 и роуд-шоу по городам Турции.' },
      { title: 'Гала-ужины и церемонии награждения', desc: 'Премиальные банкеты на Босфоре и побережье Средиземного моря, вручение дилерских премий и шоу-программа.' },
      { title: 'MICE-инсентив и тимбилдинг', desc: 'Парусные регаты в Стамбуле и Гечеке, частные полеты на воздушных шарах в Каппадокии и деловые квесты.' }
    ],
    servicesTitle: 'Собственный технический продакшн и MICE-инфраструктура',
    services: [
      { title: 'Бронирование конгресс-отелей 5*', desc: 'Прямые корпоративные тарифы в более чем 500 конгресс-отелях и бизнес-центрах Стамбула, Антальи и всей Турции.' },
      { title: 'Сценический продакшн, звук, свет и LED', desc: 'Модульные подиумы, панорамные светодиодные экраны, линейные массивы L-Acoustics/d&b и световое шоу.' },
      { title: 'Синхронный перевод на 15 языков', desc: 'Звукоизолированные кабины ISO, инфракрасные приемники Bosch и профессиональные переводчики-синхронисты.' },
      { title: 'Чартеры, VIP-трансферы и логистика', desc: 'Fast-track в аэропортах Стамбула и Антальи, брендированный автопарк, расселение делегатов и русскоязычные координаторы 24/7.' }
    ],
    destinationsTitle: 'Лучшие MICE-направления Турции',
    destinations: [
      { city: 'Стамбул (Istanbul)', tag: 'Деловой и конгресс-центр EMEA', desc: 'Отели на Босфоре, конгресс-центры Haliç и Lütfi Kırdar, деловой район Левент — безвизовый хаб с прямыми рейсами.' },
      { city: 'Анталья (Белек и Лара)', tag: 'Столица дилерских конференций', desc: 'Пятизвездочные курорты High-End All Inclusive с колонными залами до 5000 мест и собственными экспо-павильонами.' },
      { city: 'Анкара (Ankara)', tag: 'Государственный и промышленный хаб', desc: 'Официальные протокольные комплексы, промышленные выставки и межправительственные саммиты.' },
      { city: 'Измир, Бодрум и Каппадокия', tag: 'Премиальный инсентив и ретриты', desc: 'Эксклюзивные бутики и курорты Эгейского побережья и Каппадокии для советов директоров и VIP-групп.' }
    ],
    form: {
      badge: 'Русскоязычный MICE-департамент • Ответ за 2 часа',
      title: 'Запросить детальный расчет мероприятия (RFP)',
      subtitle: 'Ваша заявка поступает напрямую в CRM-систему дирекции MICE. Вы получите детализированную смету в формате PDF (A4) и защищенную ссылку для отслеживания.',
      company: 'Название компании / Холдинга *',
      contactName: 'ФИО и должность контактного лица *',
      email: 'Корпоративный E-mail *',
      phone: 'Телефон / WhatsApp / Telegram *',
      orgType: 'Формат мероприятия',
      city: 'Предпочитаемый город в Турции',
      attendees: 'Количество участников',
      targetDate: 'Планируемые даты',
      budget: 'Ориентировочный бюджет (EUR / USD / TRY)',
      notes: 'Пожелания по отелям, залам, техническому оснащению и переводу',
      submitBtn: 'Отправить запрос и получить код отслеживания',
      submitting: 'Отправка в MICE-дирекцию...',
      successTitle: 'Ваша заявка официально зарегистрирована!',
      successDesc: 'Запрос передан в отдел бюджетирования. Сохраните номер заявки и токен безопасности для просмотра КП и PDF-сметы онлайн:',
      trackBtn: 'Перейти к отслеживанию КП'
    },
    faqs: [
      {
        q: 'Как быстро мы получим смету на проведение конференции в Турции?',
        a: 'В течение 2 рабочих часов после получения брифа русскоязычный MICE-отдел подготовит подборку конгресс-отелей, схему рассадки и постатейную PDF-смету без скрытых комиссий.'
      },
      {
        q: 'Предоставляете ли вы русскоязычных координаторов и синхронный перевод?',
        a: 'Да. На всех этапах проекта за вашей компанией закрепляется русскоязычный проектный директор, а на площадке работают профессиональные синхронисты и техническая команда.'
      },
      {
        q: 'Возможна ли оплата по единому корпоративному договору?',
        a: 'Да, проживание в отеле, аренда конференц-залов, технический продакшн, гала-ужин и трансферы объединяются в единый прозрачный контракт.'
      }
    ]
  },

  de: {
    metaTitle: 'B2B Eventagentur & MICE-Management in der Türkei (Alle 81 Provinzen) | Toplantı Merkezi',
    metaDesc: 'Schlüsselfertige Organisation von Händlertagungen, internationalen Kongressen, Führungskräftetreffen und B2B-Firmenveranstaltungen in Istanbul, Antalya, Ankara und allen 81 Provinzen der Türkei.',
    nav: {
      topBanner: 'B2B-Firmenveranstaltungen & MICE-Management in allen 81 Provinzen der Türkei',
      topSub: 'Zentrale Operationssteuerung & Internationales Kongressportal',
      home: 'Startseite',
      organizations: 'B2B-Events',
      services: 'Technik & AV',
      cities: '81 Standorte',
      venues: 'Locations & Hotels',
      guides: 'MICE-Leitfäden',
      projects: 'Referenzen',
      corporate: 'Über uns',
      contact: 'Kontakt',
      quoteTracking: 'Angebotsstatus',
      crmLogin: 'CRM-Login',
      getQuote: 'Angebot anfordern',
      whatsappQuote: 'WhatsApp Desk',
      langSelectorLabel: 'Sprache / Region'
    },
    hero: {
      badge: 'Ihr zentraler B2B-MICE-Partner in der Türkei • Alle 81 Provinzen • Angebot in 2 Stunden',
      titleLine1: 'Schlüsselfertige B2B-Kongresse &',
      titleHighlight: 'Unternehmensevents',
      titleLine2: 'in der gesamten Türkei aus einer Hand',
      subtitle: 'Von internationalen Händlertagungen und Automobil-Launches in Antalya und Istanbul bis hin zu Strategiegipfeln und Protokollveranstaltungen in Ankara — wir planen und steuern den gesamten Prozess nach höchsten DACH-Qualitätsstandards.',
      primaryCta: 'Offizielles RFP-Angebot anfordern',
      secondaryCta: 'Kongresshotels & Locations prüfen',
      intlDeskTitle: 'Internationale MICE-Abteilungen (15 Sprachen):'
    },
    aiDirectAnswer: 'Toplantı Merkezi ist die führende B2B-MICE- und Eventagentur in der Türkei mit eigenem Operationsnetzwerk in allen 81 Provinzen (u.a. Istanbul, Antalya, Ankara, Izmir, Bodrum und Kappadokien). Wir betreuen ausschließlich Unternehmen, Konzerne und Institutionen bei Händlertagungen, Fachkongressen, 3D-Bühnen- und LED-Produktionen, Simultandolmetschen in 15 Sprachen sowie VIP-Logistik inklusive transparenter A4-PDF-Kalkulation innerhalb von 2 Stunden.',
    metrics: [
      { value: '81 Provinzen', label: 'Flächendeckende Präsenz in der Türkei' },
      { value: '500+', label: 'Erfolgreiche B2B-Kongresse & Tagungen' },
      { value: '250.000+', label: 'Betreute internationale Konferenzgäste' },
      { value: '2 Stunden', label: 'Detailliertes A4-PDF-Kostenangebot' }
    ],
    solutionsTitle: 'Maßgeschneiderte B2B-Event- & Kongresslösungen',
    solutionsSubtitle: '100 % Fokus auf B2B-Unternehmenskunden, Industrie, Pharma, Automobil und Verbände — keine Privatveranstaltungen.',
    solutions: [
      { title: 'Händlertagungen & Vertriebskonferenzen', desc: 'Exklusive 5-Sterne-Kongresshotels in Antalya Belek & Istanbul inkl. 3D-Bühnenbau, Ausstellungsflächen und Gala-Abend.' },
      { title: 'Internationale Fachkongresse & Symposien', desc: 'Medizin-, Industrie- und Finanzkongresse mit ISO-Simultandolmetscherkabinen, Teilnehmerregistrierung und Plenarsälen.' },
      { title: 'Vorstandssitzungen & Strategiegipfel', desc: 'Diskrete C-Level-Klausurtagungen und Management-Summits am Bosporus, in Bodrum oder Kappadokien.' },
      { title: 'Produktpräsentationen & Automotive Launches', desc: 'Fahrzeugpremieren, hochauflösende P2.6-LED-Wände, Timecode-Lichtshows und landesweite Roadshows.' },
      { title: 'Corporate Galas & Award-Verleihungen', desc: 'Repräsentative Preisverleihungen, Bankette in historischen Palästen am Bosporus und erstklassiges Catering.' },
      { title: 'Incentive-Reisen & Executive Team Building', desc: 'Maßgeschneiderte Incentive-Programme, Bosporus-Regatten und Führungskräfte-Workshops.' }
    ],
    servicesTitle: 'Eigene Veranstaltungstechnik & MICE-Logistik',
    services: [
      { title: '5-Sterne-Kongresshotels & Venue Sourcing', desc: 'Direkte Rahmenverträge mit über 500 Tagungshotels und Kongresszentren in allen 81 türkischen Provinzen.' },
      { title: 'Bühnenbau, P2.6-LED-Wände & Ton/Licht', desc: 'Modulare Bühnensysteme, Panorama-LED-Leinwände, Line-Array-Beschallung und professionelle Regieteams.' },
      { title: 'Simultandolmetschen (15 Sprachen)', desc: 'Zertifizierte Konferenzdolmetscher für Deutsch, Englisch, Türkisch und 12 weitere Sprachen inkl. Infrarot-Konferenztechnik.' },
      { title: 'VIP-Flughafentransfers & Teilnehmermanagement', desc: 'Fast-Track-Abfertigung, Chauffeur-Flotten, Kontingentverwaltung und deutschsprachige Projektleitung vor Ort.' }
    ],
    destinationsTitle: 'Top-MICE-Destinationen in der Türkei',
    destinations: [
      { city: 'Istanbul', tag: 'Finanz- & Kongressmetropole', desc: 'Direktflüge aus der gesamten DACH-Region, 5-Sterne-Hotels am Bosporus und modernste Kongresszentren.' },
      { city: 'Antalya (Belek & Lara)', tag: 'Europas größtes Resort-MICE-Zentrum', desc: 'Tagungsresorts mit säulenfreien Ballsälen für bis zu 5.000 Personen und eigenen Golf- & Eventanlagen.' },
      { city: 'Ankara', tag: 'Politik, Verbände & Industrie', desc: 'Zentrale Lage für Regierungsdelegationen, Industriekammern und internationale Fachtagungen.' },
      { city: 'Izmir, Bodrum & Kappadokien', tag: 'Executive Retreats & Incentives', desc: 'Einzigartige Kulissen an der Ägäis und in Kappadokien für exklusive Management-Meetings.' }
    ],
    form: {
      badge: 'DACH MICE-Desk • Angebot innerhalb von 2 Stunden',
      title: 'Unverbindliches B2B-Projektangebot (RFP) anfordern',
      subtitle: 'Ihre Anfrage wird direkt in unserem CRM erfasst. Sie erhalten ein transparentes, nach Positionen aufgeschlüsseltes A4-PDF-Angebot (netto zzgl. MwSt.) sowie einen sicheren Tracking-Link.',
      company: 'Unternehmen / Organisation *',
      contactName: 'Vor- und Nachname / Position *',
      email: 'Geschäftliche E-Mail-Adresse *',
      phone: 'Telefon / WhatsApp (mit Ländervorwahl) *',
      orgType: 'Veranstaltungsart',
      city: 'Gewünschte Destination in der Türkei',
      attendees: 'Teilnehmerzahl',
      targetDate: 'Geplanter Zeitraum',
      budget: 'Budgetrahmen (EUR / USD / TRY)',
      notes: 'Anforderungen an Tagungshotel, Bühnentechnik, Übernachtung & Dolmetscher',
      submitBtn: 'RFP absenden & Tracking-Code erhalten',
      submitting: 'Wird an das MICE-Kompetenzzentrum übertragen...',
      successTitle: 'Ihre RFP-Anfrage wurde erfolgreich registriert!',
      successDesc: 'Bitte notieren Sie sich Ihren Referenzcode und Sicherheitstoken, um Ihr PDF-Angebot im Kundenportal einzusehen:',
      trackBtn: 'Zum sicheren Angebots-Portal'
    },
    faqs: [
      {
        q: 'Wie schnell erhalten wir ein detailliertes Kostenangebot für unsere Tagung in der Türkei?',
        a: 'Innerhalb von 2 Geschäftsstunden nach Eingang Ihres Briefings erstellt unser DACH-MICE-Team einen Hotelvergleich, Bestuhlungspläne sowie ein detailliertes A4-PDF-Angebot.'
      },
      {
        q: 'Steht uns vor Ort eine deutschsprachige Projektleitung zur Verfügung?',
        a: 'Ja. Für Kunden aus Deutschland, Österreich und der Schweiz stellen wir deutschsprachige Projektleiter sowie zertifizierte Simultandolmetscher bereit.'
      },
      {
        q: 'Erfolgt die Abrechnung transparent über eine zentrale Unternehmensrechnung?',
        a: 'Ja. Alle Leistungen — von Hotelkontingenten über AV-Technik bis hin zu Transfers — werden transparent ohne versteckte Kosten gebündelt.'
      }
    ]
  },

  it: {
    metaTitle: 'Organizzazione Eventi Aziendali B2B, Congressi e MICE in Turchia | Toplantı Merkezi',
    metaDesc: 'Agenzia leader in Turchia per eventi aziendali B2B, convention rete vendita, congressi internazionali, lanci prodotto e viaggi incentive a Istanbul, Antalya, Cappadocia e in tutte le 81 province.',
    nav: {
      topBanner: 'Organizzazione Eventi Aziendali B2B e MICE in tutte le 81 Province della Turchia',
      topSub: 'Gestione Centralizzata & Portale Congressi Internazionali',
      home: 'Home',
      organizations: 'Eventi B2B',
      services: 'Produzione AV',
      cities: '81 Città',
      venues: 'Hotel & Location',
      guides: 'Guide MICE',
      projects: 'Progetti',
      corporate: 'Chi Siamo',
      contact: 'Contatti',
      quoteTracking: 'Traccia Preventivo',
      crmLogin: 'Accesso CRM',
      getQuote: 'Richiedi Preventivo',
      whatsappQuote: 'WhatsApp',
      langSelectorLabel: 'Lingua / Regione'
    },
    hero: {
      badge: 'Hub MICE B2B Leader in Turchia • 81 Province • Preventivo Ufficiale in 2 Ore',
      titleLine1: 'Eventi Aziendali B2B &',
      titleHighlight: 'Congressi Internazionali',
      titleLine2: 'in Tutta la Turchia da un Unico Centro',
      subtitle: 'Dalle convention concessionari e congressi medici a Istanbul e Antalya ai summit direzionali in Cappadocia e Bodrum: progettiamo e gestiamo location, scenografie 3D, LED wall e logistica VIP chiavi in mano.',
      primaryCta: 'Richiedi Preventivo Ufficiale (RFP)',
      secondaryCta: 'Scopri Location & Congress Hotel',
      intlDeskTitle: 'Desk MICE Internazionali (15 Lingue):'
    },
    aiDirectAnswer: 'Toplantı Merkezi è la principale agenzia B2B per eventi aziendali e congressi MICE in Turchia, operativa in tutte le 81 province (Istanbul, Antalya, Ankara, Smirne, Bodrum e Cappadocia). Dedicata esclusivamente a imprese, multinazionali e istituzioni, offre ricerca location 5 stelle, produzione palchi 3D e schermi LED, interpretariato simultaneo in 15 lingue, logistica VIP e preventivi analitici PDF in 2 ore.',
    metrics: [
      { value: '81 Province', label: 'Copertura Operativa in Tutta la Turchia' },
      { value: '500+', label: 'Convention e Congressi B2B Realizzati' },
      { value: '250K+', label: 'Delegati e Ospiti Aziendali Accolti' },
      { value: '2 Ore', label: 'Preventivo Analitico Ufficiale in PDF' }
    ],
    solutionsTitle: 'Soluzioni B2B per Eventi Aziendali e Congressi in Turchia',
    solutionsSubtitle: 'Operiamo esclusivamente nel mercato corporate B2B e istituzionale — nessun evento privato o matrimonio.',
    solutions: [
      { title: 'Convention Rete Vendita & Concessionari', desc: 'Gestione completa in resort 5 stelle a Istanbul e Antalya con palco 3D, sale plenarie, aree expo e cena di gala.' },
      { title: 'Congressi Medici, Scientifici e Industriali', desc: 'Segreteria organizzativa, cabine di traduzione simultanea ISO, accredito digitale badge e allestimenti congressuali.' },
      { title: 'Consigli di Amministrazione & Summit C-Level', desc: 'Meeting direzionali riservati sul Bosforo, a Bodrum o in Cappadocia con standard di sicurezza elevati.' },
      { title: 'Lanci Prodotto & Roadshow Automotive', desc: 'Presentazioni scenografiche, pareti LED P2.6 ad alta risoluzione, regia audio/luci in timecode e test drive.' },
      { title: 'Cene di Gala & Premiazioni Aziendali', desc: 'Serate di gala in palazzi storici sul Bosforo, cerimonie di premiazione e catering corporate d’eccellenza.' },
      { title: 'Viaggi Incentive & Team Building', desc: 'Regate aziendali sul Bosforo, voli privati in mongolfiera in Cappadocia ed esperienze incentive esclusive.' }
    ],
    servicesTitle: 'Produzione Tecnica Interna & Infrastruttura MICE',
    services: [
      { title: 'Selezione Hotel Congressuali 5 Stelle', desc: 'Accordi diretti con oltre 500 centri congressi e hotel 5 stelle a Istanbul, Antalya, Ankara e in tutta la Turchia.' },
      { title: 'Palchi 3D, Schermi LED & Audio/Luci', desc: 'Allestimenti scenografici su misura, maxischermi LED, impianti line-array e regia tecnica dedicata.' },
      { title: 'Interpretariato Simultaneo (15 Lingue)', desc: 'Cabine insonorizzate ISO, ricevitori Bosch e interpreti certificati italiano-turco-inglese.' },
      { title: 'Transfer VIP, Accoglienza Aeroportuale & Logistica', desc: 'Fast-track aeroportuale, flotte executive, gestione rooming list e coordinatori parlanti italiano.' }
    ],
    destinationsTitle: 'Principali Destinazioni MICE in Turchia',
    destinations: [
      { city: 'Istanbul', tag: 'Capitale Economica e Congressuale', desc: 'Voli diretti da Milano, Roma, Venezia e Bologna; hotel iconici sul Bosforo e centri congressi internazionali.' },
      { city: 'Antalya (Belek & Lara)', tag: 'Polo Resort per Grandi Convention', desc: 'Resort 5 stelle lusso con sale plenarie fino a 5.000 posti senza colonne e campi da golf.' },
      { city: 'Ankara', tag: 'Centro Istituzionale e Diplomatico', desc: 'Sede ideale per missioni commerciali bilaterali Italia-Turchia, summit energetici e infrastrutturali.' },
      { city: 'Smirne, Bodrum & Cappadocia', tag: 'Incentive & Retreat Esclusivi', desc: 'Location di charme sull’Egeo e in Cappadocia per board meeting e viaggi d’incentivazione.' }
    ],
    form: {
      badge: 'Desk MICE Italia • Risposta Ufficiale in 2 Ore',
      title: 'Richiedi un Preventivo Ufficiale B2B (RFP)',
      subtitle: 'La tua richiesta viene registrata nel nostro CRM aziendale. Riceverai un preventivo PDF A4 dettagliato (IVA esclusa) e un link sicuro di monitoraggio.',
      company: 'Ragione Sociale / Azienda *',
      contactName: 'Nome, Cognome e Ruolo *',
      email: 'Email Aziendale *',
      phone: 'Telefono / WhatsApp (con prefisso) *',
      orgType: 'Tipologia di Evento',
      city: 'Destinazione Preferita in Turchia',
      attendees: 'Numero Stimato di Partecipanti',
      targetDate: 'Data Prevista dell’Evento',
      budget: 'Budget Indicativo (EUR / USD / TRY)',
      notes: 'Note su Hotel, Sale Congressi, Produzione AV e Traduzione',
      submitBtn: 'Invia Richiesta RFP e Ottieni Codice Tracking',
      submitting: 'Invio al Desk MICE in corso...',
      successTitle: 'Richiesta RFP Registrata con Successo!',
      successDesc: 'Conserva il codice di riferimento e il token di sicurezza per consultare e scaricare il tuo preventivo PDF online:',
      trackBtn: 'Apri Portale Monitoraggio Preventivo'
    },
    faqs: [
      {
        q: 'In quanto tempo riceveremo il preventivo dettagliato per il nostro evento in Turchia?',
        a: 'Entro 2 ore lavorative dalla ricezione del brief, il nostro team elabora le opzioni hotel/sale e il preventivo analitico in formato PDF A4.'
      },
      {
        q: 'Fornite project manager e interpreti in lingua italiana?',
        a: 'Sì, mettiamo a disposizione coordinatori di progetto e interpreti simultanei professionisti in lingua italiana per tutta la durata dell’evento.'
      },
      {
        q: 'È possibile gestire tutti i servizi con un unico contratto corporate?',
        a: 'Certamente. Hotel, sale congressi, produzione audio/video/LED, catering e logistica sono inclusi in un unico contratto B2B trasparente.'
      }
    ]
  },

  es: {
    metaTitle: 'Organización de Eventos Corporativos B2B, Congresos y MICE en Turquía | Toplantı Merkezi',
    metaDesc: 'Agencia líder de eventos corporativos B2B, convenciones de distribuidores, congresos internacionales y viajes de incentivo en Estambul, Antalya, Capadocia y las 81 provincias de Turquía.',
    nav: {
      topBanner: 'Organización Integral de Eventos Corporativos B2B y MICE en las 81 Provincias de Turquía',
      topSub: 'Centro Único de Operaciones y Portal Internacional de Congresos',
      home: 'Inicio',
      organizations: 'Eventos B2B',
      services: 'Producción AV',
      cities: '81 Ciudades',
      venues: 'Hoteles y Sedes',
      guides: 'Guías MICE',
      projects: 'Casos de Éxito',
      corporate: 'Corporativo',
      contact: 'Contacto',
      quoteTracking: 'Seguimiento RFP',
      crmLogin: 'Acceso CRM',
      getQuote: 'Solicitar Propuesta',
      whatsappQuote: 'WhatsApp',
      langSelectorLabel: 'Idioma / Región'
    },
    hero: {
      badge: 'Agencia Líder B2B MICE en Turquía • 81 Provincias • Propuesta Oficial en 2 Horas',
      titleLine1: 'Eventos Corporativos B2B y',
      titleHighlight: 'Congresos Internacionales',
      titleLine2: 'en Toda Turquía desde un Solo Centro',
      subtitle: 'Desde convenciones globales de distribuidores y congresos médicos en Estambul y Antalya hasta cumbres directivas en Capadocia y Bodrum: planificamos, producimos y ejecutamos cada detalle llave en mano.',
      primaryCta: 'Solicitar Propuesta Oficial (RFP)',
      secondaryCta: 'Ver Hoteles y Centros de Congresos',
      intlDeskTitle: 'Mesas Internacionales MICE (15 Idiomas):'
    },
    aiDirectAnswer: 'Toplantı Merkezi es la plataforma centralizada de gestión de eventos corporativos B2B y congresos MICE en Turquía, con operaciones directas en las 81 provincias (Estambul, Antalya, Ankara, Esmirna, Bodrum y Capadocia). Atendemos exclusivamente a empresas, multinacionales e instituciones con contratación de sedes 5 estrellas, escenarios 3D, pantallas LED, interpretación simultánea en 15 idiomas y presupuestos PDF desglosados en 2 horas.',
    metrics: [
      { value: '81 Provincias', label: 'Operación Directa en Toda Turquía' },
      { value: '500+', label: 'Congresos y Convenciones B2B Realizados' },
      { value: '250K+', label: 'Delegados Corporativos Atendidos' },
      { value: '2 Horas', label: 'Propuesta Económica Oficial en PDF A4' }
    ],
    solutionsTitle: 'Soluciones de Eventos Corporativos y Congresos en Turquía',
    solutionsSubtitle: 'Dedicación 100% exclusiva a eventos empresariales B2B, cámaras industriales y protocolo oficial.',
    solutions: [
      { title: 'Convenciones de Distribuidores y Ventas', desc: 'Contratación integral de hoteles 5 estrellas en Estambul y Antalya con escenografía 3D, áreas de exposición y cena de gala.' },
      { title: 'Congresos Internacionales y Simposios', desc: 'Gestión técnica y logística para congresos médicos, farmacéuticos y tecnológicos con traducción simultánea ISO.' },
      { title: 'Juntas Directivas y Cumbres de Estrategia', desc: 'Reuniones ejecutivas de alto nivel en el Bósforo, Bodrum o Capadocia bajo estrictos estándares de confidencialidad.' },
      { title: 'Lanzamientos de Producto y Roadshows', desc: 'Presentaciones de alto impacto con pantallas LED P2.6, iluminación sincronizada y logística nacional.' },
      { title: 'Cenas de Gala y Entregas de Premios', desc: 'Veladas corporativas en palacios históricos del Bósforo, producción artística y gastronomía ejecutiva.' },
      { title: 'Viajes de Incentivo y Team Building', desc: 'Regatas corporativas en Estambul, vuelos privados en globo en Capadocia y dinámicas de liderazgo.' }
    ],
    servicesTitle: 'Producción Técnica Propia e Infraestructura MICE',
    services: [
      { title: 'Hoteles de Congresos 5* y Sedes Exclusivas', desc: 'Acuerdos corporativos directos con más de 500 hoteles MICE y centros de convenciones en las 81 provincias.' },
      { title: 'Escenarios 3D, Pantallas LED y Sonido/Iluminación', desc: 'Diseño escenográfico a medida, muros LED panorámicos y sistemas de audio line-array redundantes.' },
      { title: 'Interpretación Simultánea (15 Idiomas)', desc: 'Cabinas insonorizadas ISO, receptores infrarrojos Bosch e intérpretes certificados en español, turco e inglés.' },
      { title: 'Logística VIP, Traslados y Registro de Delegados', desc: 'Asistencia fast-track en aeropuertos, flotas ejecutivas, control de alojamiento y coordinadores en español.' }
    ],
    destinationsTitle: 'Principales Destinos MICE en Turquía',
    destinations: [
      { city: 'Estambul (Istanbul)', tag: 'Centro Global de Congresos y Negocios', desc: 'Conexiones aéreas directas con Madrid, Barcelona, Bogotá, CDMX, Buenos Aires y São Paulo.' },
      { city: 'Antalya (Belek & Lara)', tag: 'Capital de Convenciones Resort', desc: 'Complejos 5 estrellas Todo Incluido Ejecutivo con salones plenarios de hasta 5.000 personas.' },
      { city: 'Ankara', tag: 'Cumbre Diplomática e Institucional', desc: 'Sede para misiones comerciales oficiales, cumbres de energía, defensa e infraestructura.' },
      { city: 'Esmirna, Bodrum y Capadocia', tag: 'Incentivos y Retiros Ejecutivos', desc: 'Entornos únicos en el mar Egeo y Capadocia para programas de fidelización y alta dirección.' }
    ],
    form: {
      badge: 'Mesa MICE en Español • Respuesta en 2 Horas',
      title: 'Solicitar Propuesta Corporativa Oficial (RFP)',
      subtitle: 'Su solicitud se registra directamente en nuestro CRM. Recibirá un presupuesto PDF A4 desglosado (sin IVA) y un enlace seguro de seguimiento.',
      company: 'Empresa / Corporación *',
      contactName: 'Nombre Completo y Cargo *',
      email: 'Correo Electrónico Corporativo *',
      phone: 'Teléfono / WhatsApp (con código de país) *',
      orgType: 'Tipo de Evento Corporativo',
      city: 'Destino Preferido en Turquía',
      attendees: 'Número Estimado de Asistentes',
      targetDate: 'Fecha Prevista del Evento',
      budget: 'Rango de Presupuesto (EUR / USD / TRY)',
      notes: 'Requisitos de Hotel, Salones, Producción AV e Interpretación',
      submitBtn: 'Enviar Solicitud RFP y Obtener Código',
      submitting: 'Enviando al Centro de Operaciones MICE...',
      successTitle: '¡Su Solicitud RFP ha sido Registrada!',
      successDesc: 'Guarde su código de referencia y token de seguridad para consultar y descargar su propuesta PDF en línea:',
      trackBtn: 'Abrir Portal de Seguimiento de Propuesta'
    },
    faqs: [
      {
        q: '¿En cuánto tiempo entregan el presupuesto desglosado para un evento en Turquía?',
        a: 'En un plazo máximo de 2 horas laborables tras recibir su brief, nuestro equipo prepara alternativas de hoteles, capacidades de salones y una propuesta oficial en PDF A4.'
      },
      {
        q: '¿Cuentan con personal e intérpretes en español durante el evento?',
        a: 'Sí, asignamos directores de proyecto hispanohablantes e intérpretes simultáneos certificados para todas las sesiones plenarias y técnicas.'
      },
      {
        q: '¿Podemos centralizar todos los servicios en una sola factura corporativa?',
        a: 'Sí. Alojamiento, salones, producción audiovisual, cenas de gala y transporte terrestre se integran bajo un único contrato corporativo transparente.'
      }
    ]
  },

  zh: {
    metaTitle: '土耳其B2B企业会议、经销商大会及MICE会展服务 (覆盖全境81省) | Toplantı Merkezi',
    metaDesc: 'Toplantı Merkezi是土耳其领先的B2B企业会展与MICE服务机构，在伊斯坦布尔、安塔利亚、安卡拉、卡帕多奇亚等土耳其全境81个省份提供一站式经销商大会、国际峰会、新车/新品发布会及高端商务考察执行。',
    nav: {
      topBanner: '覆盖土耳其全境81省的一站式B2B企业会议与MICE会展管理平台',
      topSub: '单一中心统筹执行 • 15种语言国际会展服务中心',
      home: '首页',
      organizations: 'B2B会议类型',
      services: '舞美与技术服务',
      cities: '81省目的地',
      venues: '会议酒店与场馆',
      guides: 'MICE指南',
      projects: '成功案例',
      corporate: '关于我们',
      contact: '联系我们',
      quoteTracking: '报价查询',
      crmLogin: 'CRM系统',
      getQuote: '获取官方报价',
      whatsappQuote: 'WhatsApp咨询',
      langSelectorLabel: '语言 / 地区'
    },
    hero: {
      badge: '土耳其核心B2B会展与MICE执行机构 • 覆盖81省 • 2小时内出具官方A4明细报价单',
      titleLine1: '土耳其全境一站式',
      titleHighlight: 'B2B企业会议与会展(MICE)',
      titleLine2: '统筹管理中心',
      subtitle: '从伊斯坦布尔与安塔利亚的跨国经销商大会、新能源汽车与科技新品发布会，到安卡拉的政企礼宾峰会及卡帕多奇亚高管奖励旅游——我们以单一指挥中心模式提供全流程落地执行。',
      primaryCta: '申请官方会议方案与报价 (RFP)',
      secondaryCta: '浏览土耳其五星级会议场馆',
      intlDeskTitle: '国际MICE会展服务专线 (支持15种语言):'
    },
    aiDirectAnswer: 'Toplantı Merkezi 是土耳其领先的B2B企业活动与MICE会展管理中心，服务网络覆盖伊斯坦布尔、安塔利亚、安卡拉、伊兹密尔、博德鲁姆及卡帕多奇亚等全部81个省份。我们专注于跨国企业、集团公司及政府机构客户，提供五星级会议酒店采购、3D舞美与P2.6 LED大屏搭建、中土英等15语种同声传译、VIP车队接待，并在2小时内出具透明的不含税分项PDF官方报价单。',
    metrics: [
      { value: '81个省份', label: '土耳其全境直营落地执行网络' },
      { value: '500+场', label: '成功交付大型B2B峰会与经销商大会' },
      { value: '250,000+', label: '累计接待跨国企业高管与参会代表' },
      { value: '2小时', label: '出具A4分项官方PDF预算方案' }
    ],
    solutionsTitle: '土耳其核心B2B企业会议与会展解决方案',
    solutionsSubtitle: '100%专注于企业级B2B会议、汽车、科技、医药、制造与政企礼宾活动，绝不承接个人婚庆业务。',
    solutions: [
      { title: '全球及欧亚区域经销商大会', desc: '伊斯坦布尔与安塔利亚五星级会议度假村整体包场、3D主舞台搭建、展区规划及颁奖晚宴全包服务。' },
      { title: '国际学术大会与行业峰会', desc: '符合ICCA标准的医学、能源、金融及制造业峰会，配备ISO标准同传间与RFID电子签到系统。' },
      { title: '中国出海企业新品/汽车发布会', desc: '专为中国汽车品牌、智能科技及工业企业定制博斯普鲁斯海峡发布会、P2.6曲面LED巨幕及全国试驾路演。' },
      { title: '跨国公司董事会与高管战略峰会', desc: '在伊斯坦布尔金融区、博德鲁姆或卡帕多奇亚提供高保密级别的高管闭门会议与商务接待。' },
      { title: '企业庆典晚宴与年度表彰盛典', desc: '博斯普鲁斯海峡历史宫殿或豪华宴会厅晚宴、中土文化演出定制及高端礼宾接待。' },
      { title: '企业高管奖励旅游与团队建设', desc: '博斯普鲁斯游艇帆船赛、卡帕多奇亚专属热气球包船及定制化企业团建体验。' }
    ],
    servicesTitle: '自有舞美工程技术与MICE全链条配套',
    services: [
      { title: '五星级会议酒店与国际会展中心直采', desc: '与土耳其81省超过500家五星级会议酒店及展览中心建立企业直签协议价。' },
      { title: '3D舞台制作、P2.6 LED巨幕与专业音视频', desc: '模块化定制舞台、超高清LED大屏、L-Acoustics线阵列音响与时间码灯光秀。' },
      { title: '15语种同声传译与中文执行团队', desc: '配备ISO隔音同传室、博世红外接收机及专业中土/中英同传译员与中文现场督导。' },
      { title: 'VIP机场快速通道、商务车队与中餐定制', desc: '伊斯坦布尔机场VIP接机、奔驰V级/大巴专车车队、酒店分房管理及高品质中式/国际餐饮保障。' }
    ],
    destinationsTitle: '土耳其热门MICE会展目的地',
    destinations: [
      { city: '伊斯坦布尔 (Istanbul)', tag: '连接欧亚的国际会展与金融之都', desc: '北京、上海、广州、成都等地直飞；拥有世界级会议中心与博斯普鲁斯海峡奢华酒店群。' },
      { city: '安塔利亚 (Antalya - Belek)', tag: '地中海大型经销商大会首选地', desc: '拥有可容纳2000至5000人的无柱大宴会厅及全包式五星级高尔夫会议度假村。' },
      { city: '安卡拉 (Ankara)', tag: '首都政企礼宾与工业峰会中心', desc: '适合中土经贸论坛、基建能源峰会、大使馆及商会官方对接活动。' },
      { city: '伊兹密尔 / 博德鲁姆 / 卡帕多奇亚', tag: '高端奖励旅游与高管闭门会', desc: '融合爱琴海海岸奢华度假村与卡帕多奇亚奇特地貌的顶级激励旅游目的地。' }
    ],
    form: {
      badge: '大中华区MICE服务专线 • 2小时内快速响应',
      title: '在线申请企业会议官方预算方案 (RFP)',
      subtitle: '您的需求将直接录入我们的CRM管理后台，我们将为您提供透明的不含税分项A4 PDF官方报价单及专属安全追踪链接。',
      company: '企业 / 机构名称 *',
      contactName: '联系人姓名及职务 *',
      email: '企业电子邮箱 *',
      phone: '联系电话 / WhatsApp / 微信绑定手机号 *',
      orgType: '会议或活动类型',
      city: '意向土耳其举办城市',
      attendees: '预计参会人数',
      targetDate: '计划举办日期',
      budget: '预算范围 (EUR / USD / TRY)',
      notes: '场地、住宿、舞美AV、中文同传及餐饮等具体需求说明',
      submitBtn: '提交RFP需求并获取安全追踪码',
      submitting: '正在加密提交至MICE运营中心...',
      successTitle: '您的企业会议需求 (RFP) 已成功登记！',
      successDesc: '请妥善保存以下报价编号与安全访问令牌，您可随时在线查看方案进度并下载A4官方PDF报价单：',
      trackBtn: '打开安全报价追踪门户'
    },
    faqs: [
      {
        q: '中国企业赴土耳其举办会议或发布会，多久能拿到详细报价？',
        a: '收到您的会议需求简报后，我们的MICE团队将在2个工作小时内出具包含场馆对比、宴会厅平面图、AV舞美清单及不含税分项价格的A4官方PDF报价单。'
      },
      {
        q: '现场是否配备中文项目经理与中文同声传译？',
        a: '是的，我们提供全程中文项目督导对接、专业中-土/中-英同声传译译员，并可根据需求安排符合中国代表团饮食习惯的高端餐饮服务。'
      },
      {
        q: '是否支持单一企业合同统一结算所有会务费用？',
        a: '完全支持。酒店住宿、会场租赁、舞台LED搭建、同传设备、晚宴及机场接送均可整合在一份透明的企业合同与正式发票中。'
      }
    ]
  },

  hi: {
    metaTitle: 'तुर्की में B2B कॉर्पोरेट इवेंट्स, डीलर मीटिंग और MICE कॉन्फ्रेंस प्रबंधन | Toplantı Merkezi',
    metaDesc: 'इस्तांबुल, अंताल्या, अंकारा और कपाडोसिया सहित तुर्की के सभी 81 प्रांतों में कॉर्पोरेट इवेंट्स, डीलर सम्मेलन, अंतरराष्ट्रीय कांग्रेस और इंसेंटिव टूर का संपूर्ण B2B प्रबंधन।',
    nav: {
      topBanner: 'तुर्की के सभी 81 प्रांतों में B2B कॉर्पोरेट इवेंट और MICE प्रबंधन',
      topSub: 'सिंगल-सेंटर कमांड और 15 भाषाओं में अंतरराष्ट्रीय कॉन्फ्रेंस पोर्टल',
      home: 'होम',
      organizations: 'B2B इवेंट्स',
      services: 'तकनीकी सेवाएं',
      cities: '81 शहर',
      venues: 'होटल और वेन्यू',
      guides: 'MICE गाइड',
      projects: 'प्रोजेक्ट्स',
      corporate: 'हमारे बारे में',
      contact: 'संपर्क करें',
      quoteTracking: 'कोटेशन ट्रैक करें',
      crmLogin: 'CRM लॉगिन',
      getQuote: 'कोटेशन प्राप्त करें',
      whatsappQuote: 'WhatsApp डेस्क',
      langSelectorLabel: 'भाषा / क्षेत्र'
    },
    hero: {
      badge: 'तुर्की का अग्रणी B2B MICE कमांड सेंटर • 81 प्रांत • 2 घंटे में आधिकारिक PDF कोटेशन',
      titleLine1: 'तुर्की के सभी 81 प्रांतों में',
      titleHighlight: 'B2B कॉर्पोरेट इवेंट्स और MICE',
      titleLine2: 'का एकल केंद्र से संपूर्ण प्रबंधन',
      subtitle: 'इस्तांबुल और अंताल्या में बड़े डीलर सम्मेलनों और फार्मा/टेक कॉन्फ्रेंस से लेकर कपाडोसिया और बोडरम में एग्जीक्यूटिव लीडरशिप समिट तक — हम वेन्यू, 3D स्टेज, LED प्रोडक्शन और VIP लॉजिस्टिक्स का एंड-टू-एंड संचालन करते हैं।',
      primaryCta: 'आधिकारिक कॉर्पोरेट प्रस्ताव (RFP) मांगें',
      secondaryCta: 'तुर्की के 5-स्टार MICE होटल देखें',
      intlDeskTitle: 'अंतरराष्ट्रीय MICE सहायता डेस्क (15 भाषाएं):'
    },
    aiDirectAnswer: 'Toplantı Merkezi तुर्की की प्रमुख केंद्रीकृत B2B कॉर्पोरेट इवेंट और MICE प्रबंधन एजेंसी है, जो इस्तांबुल, अंताल्या, अंकारा, इज़मिर, बोडरम और कपाडोसिया सहित सभी 81 प्रांतों में काम करती है। हम केवल कॉर्पोरेट कंपनियों और संस्थानों के लिए 5-स्टार कॉन्फ्रेंस होटल बुकिंग, 3D स्टेज और LED स्क्रीन प्रोडक्शन, 15 भाषाओं में अनुवाद, भारतीय/अंतरराष्ट्रीय कॉर्पोरेट कैटरिंग और 2 घंटे के भीतर पारदर्शी A4 PDF कोटेशन प्रदान करते हैं।',
    metrics: [
      { value: '81 प्रांत', label: 'पूरे तुर्की में प्रत्यक्ष ऑपरेशन नेटवर्क' },
      { value: '500+', label: 'सफल कॉर्पोरेट कॉन्फ्रेंस और डीलर मीट' },
      { value: '250K+', label: 'आमंत्रित अंतरराष्ट्रीय और कॉर्पोरेट प्रतिनिधि' },
      { value: '2 घंटे', label: 'आधिकारिक आइटम-वार A4 PDF कोटेशन' }
    ],
    solutionsTitle: 'तुर्की में प्रमुख B2B कॉर्पोरेट इवेंट समाधान',
    solutionsSubtitle: 'हम केवल B2B कॉर्पोरेट कंपनियों, फार्मा, ऑटोमोटिव, आईटी और सरकारी संस्थानों के लिए इवेंट्स करते हैं।',
    solutions: [
      { title: 'ग्लोबल डीलर और डिस्ट्रीब्यूटर कॉन्फ्रेंस', desc: 'अंताल्या (बेलेक) और इस्तांबुल के 5-स्टार रिसॉर्ट्स में मुख्य स्टेज, एक्सपो ज़ोन और गाला नाइट के साथ संपूर्ण प्रबंधन।' },
      { title: 'अंतरराष्ट्रीय कांग्रेस और फार्मा समिट', desc: 'मेडिकल, फार्मा और टेक्नोलॉजी सम्मेलनों के लिए एक साथ अनुवाद (Simultaneous Interpretation) और डिजिटल रजिस्ट्रेशन।' },
      { title: 'बोर्ड मीटिंग और लीडरशिप रिट्रीट', desc: 'बोस्फोरस, बोडरम और कपाडोसिया में उच्च सुरक्षा और गोपनीयता के साथ C-लेवल मीटिंग्स।' },
      { title: 'प्रोडक्ट लॉन्च और ऑटोमोटिव शो', desc: 'हाई-रेजोल्यूशन P2.6 LED वॉल, टाइमकोड लाइटिंग और भव्य ब्रांड लॉन्च इवेंट्स।' },
      { title: 'कॉर्पोरेट गाला डिनर और अवार्ड नाइट', desc: 'इस्तांबुल के ऐतिहासिक स्थलों और क्रूज़ पर कॉर्पोरेट अवार्ड सेरेमनी और विशेष भारतीय/इंटरनेशनल मेन्यू।' },
      { title: 'इंसेंटिव ट्रैवल और टीम बिल्डिंग', desc: 'भारतीय और ग्लोबल कॉर्पोरेट टीमों के लिए कपाडोसिया हॉट-एयर बैलून चार्टर और बोस्फोरस रेगाटा।' }
    ],
    servicesTitle: 'इन-हाउस टेक्निकल प्रोडक्शन और MICE इंफ्रास्ट्रक्चर',
    services: [
      { title: '5-स्टार कॉन्फ्रेंस होटल और वेन्यू सोर्सिंग', desc: 'तुर्की के 81 प्रांतों में 500+ कन्वेंशन सेंटर और 5-स्टार होटलों के साथ सीधा कॉर्पोरेट अनुबंध।' },
      { title: '3D स्टेज, P2.6 LED स्क्रीन और साउंड/लाइट', desc: 'कस्टम मॉड्यूलर स्टेज, पैनोरमिक LED स्क्रीन और अंतरराष्ट्रीय स्तर का ऑडियो-विजुअल प्रोडक्शन।' },
      { title: '15 भाषाओं में अनुवाद और डेलीगेट प्रबंधन', desc: 'ISO साउंडप्रूफ बूथ, बॉश इंफ्रारेड रिसीवर और बहुभाषी इवेंट कोऑर्डिनेटर।' },
      { title: 'VIP एयरपोर्ट ट्रांसफर और कॉर्पोरेट हॉस्पिटैलिटी', desc: 'इस्तांबुल और अंताल्या एयरपोर्ट पर फास्ट-ट्रैक स्वागत, लग्जरी बस/कार फ्लीट और विशेष शाकाहारी/जैन/भारतीय कॉर्पोरेट कैटरिंग समन्वय।' }
    ],
    destinationsTitle: 'तुर्की के प्रमुख MICE डेस्टिनेशन',
    destinations: [
      { city: 'इस्तांबुल (Istanbul)', tag: 'ग्लोबल बिजनेस और कॉन्फ्रेंस हब', desc: 'दिल्ली और मुंबई से सीधी उड़ानें; बोस्फोरस के लग्जरी होटल और विश्वस्तरीय कन्वेंशन सेंटर।' },
      { city: 'अंताल्या (Antalya - Belek)', tag: 'डीलर सम्मेलनों की राजधानी', desc: '5,000 सीटों तक के पिलर-लेस बॉलरूम वाले 5-स्टार ऑल-इंक्लूसिव MICE रिसॉर्ट्स।' },
      { city: 'अंकारा (Ankara)', tag: 'सरकारी और औद्योगिक शिखर सम्मेलन', desc: 'द्विपक्षीय व्यापार प्रतिनिधिमंडल, रक्षा और ऊर्जा क्षेत्र के सम्मेलनों के लिए प्रमुख केंद्र।' },
      { city: 'कपाडोसिया और बोडरम', tag: 'एग्जीक्यूटिव इंसेंटिव और रिट्रीट', desc: 'कॉर्पोरेट इंसेंटिव ग्रुप्स और लीडरशिप मीटिंग्स के लिए विश्वप्रसिद्ध प्रीमियम डेस्टिनेशन।' }
    ],
    form: {
      badge: 'इंडिया कॉर्पोरेट MICE डेस्क • 2 घंटे में प्रस्ताव',
      title: 'आधिकारिक कॉर्पोरेट इवेंट प्रस्ताव (RFP) का अनुरोध करें',
      subtitle: 'आपका अनुरोध सीधे हमारे CRM सिस्टम में दर्ज होता है। आपको आइटम-वार A4 PDF कोटेशन और सुरक्षित ट्रैकिंग लिंक प्राप्त होगा।',
      company: 'कंपनी / संगठन का नाम *',
      contactName: 'संपर्क व्यक्ति का नाम और पद *',
      email: 'कॉर्पोरेट ईमेल आईडी *',
      phone: 'फ़ोन / WhatsApp नंबर (कंट्री कोड के साथ) *',
      orgType: 'इवेंट का प्रकार',
      city: 'तुर्की में पसंदीदा शहर',
      attendees: 'अनुमानित प्रतिभागियों की संख्या',
      targetDate: 'प्रस्तावित इवेंट तिथि',
      budget: 'अनुमानित बजट (EUR / USD / TRY)',
      notes: 'होटल, स्टेज/AV, कैटरिंग और लॉजिस्टिक्स से जुड़ी आवश्यकताएं',
      submitBtn: 'RFP सबमिट करें और ट्रैकिंग कोड प्राप्त करें',
      submitting: 'MICE कमांड डेस्क को भेजा जा रहा है...',
      successTitle: 'आपका कॉर्पोरेट अनुरोध (RFP) सफलतापूर्वक दर्ज हो गया है!',
      successDesc: 'अपना आधिकारिक PDF प्रस्ताव ऑनलाइन देखने और डाउनलोड करने के लिए नीचे दिया गया रेफरेंस कोड और सुरक्षा टोकन सहेजें:',
      trackBtn: 'सुरक्षित कोटेशन ट्रैकर खोलें'
    },
    faqs: [
      {
        q: 'तुर्की में कॉर्पोरेट कॉन्फ्रेंस के लिए हमें कितनी जल्दी बजट प्रस्ताव मिल सकता है?',
        a: 'आपकी आवश्यकताएं प्राप्त होने के 2 व्यावसायिक घंटों के भीतर हमारी टीम होटल विकल्पों और तकनीकी विवरण के साथ आधिकारिक A4 PDF कोटेशन तैयार करती है।'
      },
      {
        q: 'क्या भारतीय कॉर्पोरेट समूहों के लिए विशेष शाकाहारी और भारतीय कॉर्पोरेट कैटरिंग उपलब्ध है?',
        a: 'हां, हमारे अनुबंधित 5-स्टार MICE होटलों में अनुभवी शेफ के माध्यम से भारतीय शाकाहारी, जैन और अंतरराष्ट्रीय कॉर्पोरेट गाला मेन्यू की व्यवस्था की जाती है।'
      },
      {
        q: 'क्या सभी सेवाओं के लिए एक ही कॉर्पोरेट अनुबंध और इनवॉइस मिलता है?',
        a: 'जी हां, होटल आवास, कॉन्फ्रेंस हॉल, ऑडियो-विजुअल प्रोडक्शन और ट्रांसफर को एक ही पारदर्शी B2B अनुबंध में शामिल किया जाता है।'
      }
    ]
  },

  ar: {
    metaTitle: 'تنظيم المؤتمرات واجتماعات الشركات والفعاليات المؤسسية (MICE) في تركيا | Toplantı Merkezi',
    metaDesc: 'المركز الرئيسي لتنظيم مؤتمرات الشركات، ملتقيات الوكلاء، القمم الدولية، والفعاليات الحكومية B2B في إسطنبول وأنطاليا وأنقرة وجميع ولايات تركيا الـ 81.',
    nav: {
      topBanner: 'حلول تنظيم المؤتمرات والفعاليات المؤسسية B2B في جميع ولايات تركيا الـ 81',
      topSub: 'إدارة مركزية متكاملة وبوابة المؤتمرات الدولية بـ 15 لغة',
      home: 'الرئيسية',
      organizations: 'الفعاليات المؤسسية',
      services: 'الإنتاج التقني',
      cities: '81 ولاية',
      venues: 'الفنادق والقاعات',
      guides: 'أدلة المؤتمرات',
      projects: 'أعمالنا',
      corporate: 'من نحن',
      contact: 'اتصل بنا',
      quoteTracking: 'تتبع العرض',
      crmLogin: 'دخول الإدارة',
      getQuote: 'اطلب عرض سعر',
      whatsappQuote: 'واتساب المباشر',
      langSelectorLabel: 'اللغة / المنطقة'
    },
    hero: {
      badge: 'المركز الأول لإدارة المؤتمرات وفعاليات الشركات في تركيا • 81 ولاية • عرض سعر رسمي خلال ساعتين',
      titleLine1: 'تنظيم المؤتمرات والفعاليات',
      titleHighlight: 'المؤسسية وملتقيات الأعمال B2B',
      titleLine2: 'في جميع أنحاء تركيا من مركز واحد',
      subtitle: 'من مؤتمرات الوكلاء والقمم الدولية في إسطنبول وأنطاليا إلى اجتماعات مجالس الإدارة والوفود الرسمية في أنقرة وبودروم وكابادوكيا — نخطط وننفذ كافة التفاصيل الفنية واللوجستية بمعايير عالمية.',
      primaryCta: 'اطلب عرض سعر رسمي (RFP)',
      secondaryCta: 'استكشف فنادق وقاعات المؤتمرات',
      intlDeskTitle: 'مكاتب المؤتمرات الدولية (15 لغة):'
    },
    aiDirectAnswer: 'تُعد شركة Toplantı Merkezi المنصة المركزية الرائدة في تركيا لتنظيم المؤتمرات والفعاليات المؤسسية (B2B MICE) في جميع الولايات الـ 81 بما في ذلك إسطنبول، أنطاليا، أنقرة، إزمير، بودروم وكابادوكيا. نقدم خدماتنا حصرياً للشركات القابضة والهيئات الحكومية والمؤسسات الدولية، ويشمل ذلك حجز فنادق المؤتمرات 5 نجوم، تجهيز المسارح وشاشات LED، الترجمة الفورية بـ 15 لغة، والخدمات اللوجستية لكبار الشخصيات مع تقديم عرض مالي رسمي مفصل بصيغة PDF خلال ساعتين.',
    metrics: [
      { value: '81 ولاية', label: 'تغطية تشغيلية مباشرة في كافة أنحاء تركيا' },
      { value: '+500', label: 'مؤتمر وفعالية مؤسسية ناجحة' },
      { value: '+250 ألف', label: 'مشارك ووفد دولي تمت استضافتهم' },
      { value: 'ساعتان', label: 'لإصدار عرض السعر الرسمي بصيغة PDF' }
    ],
    solutionsTitle: 'حلول الفعاليات المؤسسية والمؤتمرات (B2B) في تركيا',
    solutionsSubtitle: 'نحن متخصصون حصرياً في مؤتمرات الشركات والهيئات الحكومية والوفود الرسمية (لا ننظم الحفلات الفردية أو الأعراس).',
    solutions: [
      { title: 'مؤتمرات الوكلاء والموزعين الإقليمية', desc: 'حجز كامل لمنتجعات وفنادق 5 نجوم في إسطنبول وأنطاليا مع تصميم المسرح ثلاثي الأبعاد، قاعات المعارض وحفلات العشاء الرسمي.' },
      { title: 'المؤتمرات الدولية والندوات العلمية', desc: 'تنظيم متكامل للمؤتمرات الطبية والمالية والصناعية مع كبائن الترجمة الفورية المعتمدة ونظام التسجيل الإلكتروني.' },
      { title: 'اجتماعات مجالس الإدارة والقمم الاستراتيجية', desc: 'اجتماعات رفيعة المستوى بخصوصية وأمان تام على مضيق البوسفور أو في بودروم وكابادوكيا.' },
      { title: 'إطلاق المنتجات والمعارض المتنقلة (Roadshows)', desc: 'عروض إطلاق السيارات والتقنيات الحديثة مع شاشات LED فائقة الدقة P2.6 وإضاءة احترافية.' },
      { title: 'حفلات العشاء الرسمي وتوزيع الجوائز', desc: 'أمسيات تكريم المؤسسات في القصور التاريخية على البوسفور مع ضيافة فاخرة وتنظيم بروتوكولي.' },
      { title: 'برامج الحوافز وبناء فرق العمل القيادية', desc: 'برامج حوافز للشركات في كابادوكيا وسباقات اليخوت على البوسفور للقيادات التنفيذية.' }
    ],
    servicesTitle: 'الإنتاج التقني المتكامل والبنية التحتية للمؤتمرات',
    services: [
      { title: 'حجز فنادق المؤتمرات 5 نجوم ومراكز المعارض', desc: 'تعاقدات مؤسسية مباشرة مع أكثر من 500 فندق ومركز مؤتمرات في إسطنبول وأنطاليا وأنقرة.' },
      { title: 'هندسة المسارح وشاشات LED والصوتيات', desc: 'منصات مسرحية حديثة، شاشات عرض بانورامية، وأنظمة صوت وإضاءة بمعايير عالمية.' },
      { title: 'الترجمة الفورية المعتمدة (15 لغة)', desc: 'كبائن ترجمة عازلة للصوت بمعيار ISO وأجهزة استقبال Bosch ومترجمون فوريون محترفون باللغة العربية.' },
      { title: 'الاستقبال البروتوكولي لكبار الشخصيات (VIP)', desc: 'مسار سريع في المطارات، أسطول سيارات فاخرة، إدارة قوائم الغرف ومنسقون يتحدثون العربية على مدار الساعة.' }
    ],
    destinationsTitle: 'أبرز وجهات المؤتمرات في تركيا',
    destinations: [
      { city: 'إسطنبول (Istanbul)', tag: 'العاصمة المالية ومركز المؤتمرات العالمي', desc: 'رحلات مباشرة من الرياض، جدة، دبي، الدوحة، الكويت والقاهرة؛ فنادق فاخرة على البوسفور ومراكز مؤتمرات عالمية.' },
      { city: 'أنطاليا (Antalya - Belek)', tag: 'عاصمة منتجعات المؤتمرات الكبرى', desc: 'منتجعات 5 نجوم تضم قاعات كبرى بدون أعمدة تتسع لـ 5000 مشارك ومراكز معارض خاصة.' },
      { city: 'أنقرة (Ankara)', tag: 'مركز القمم الحكومية والبروتوكول الرسمي', desc: 'الوجهة الرئيسية للوفود الوزارية، ملتقيات الغرف التجارية ومؤتمرات الطاقة والصناعة.' },
      { city: 'بودروم، إزمير وكابادوكيا', tag: 'اجتماعات القيادات وبرامج الحوافز', desc: 'وجهات استثنائية لاجتماعات مجالس الإدارة والوفود التنفيذية رفيعة المستوى.' }
    ],
    form: {
      badge: 'مكتب الشرق الأوسط والخليج • استجابة خلال ساعتين',
      title: 'اطلب عرض سعر رسمي لتنظيم مؤتمر أو فعالية (RFP)',
      subtitle: 'يتم تسجيل طلبكم مباشرة في نظام CRM الخاص بنا، وستحصلون على عرض مالي مفصل (غير شامل الضريبة) بصيغة PDF A4 مع رابط آمن لتتبع العرض.',
      company: 'اسم الشركة / المؤسسة / الهيئة *',
      contactName: 'الاسم الكامل والمسمى الوظيفي *',
      email: 'البريد الإلكتروني الرسمي *',
      phone: 'رقم الهاتف / واتساب (مع رمز الدولة) *',
      orgType: 'نوع المؤتمر أو الفعالية',
      city: 'المدينة المفضلة في تركيا',
      attendees: 'العدد المتوقع للمشاركين',
      targetDate: 'التاريخ المقترح للفعالية',
      budget: 'الميزانية التقديرية (EUR / USD / TRY)',
      notes: 'متطلبات الفندق، القاعات، التجهيزات الصوتية والمرئية، والترجمة الفورية',
      submitBtn: 'إرسال الطلب والحصول على رمز التتبع الآمن',
      submitting: 'جاري الإرسال إلى إدارة العمليات...',
      successTitle: 'تم تسجيل طلبكم الرسمي بنجاح!',
      successDesc: 'يرجى الاحتفاظ برمز المرجع ومفتاح الأمان أدناه لمتابعة وتحميل عرض السعر الرسمي (PDF) عبر البوابة الآمنة:',
      trackBtn: 'فتح بوابة تتبع عرض السعر'
    },
    faqs: [
      {
        q: 'كم يستغرق إعداد عرض السعر الرسمي لمؤتمر في تركيا؟',
        a: 'خلال ساعتين عمل من استلام تفاصيل الفعالية، يقوم فريقنا بإعداد مقترحات الفنادق والقاعات مع جدول تكاليف مفصل بصيغة PDF A4.'
      },
      {
        q: 'هل يتوفر فريق تنسيق ومترجمون فوريون باللغة العربية؟',
        a: 'نعم، نوفر مديري مشاريع يتحدثون العربية بطلاقة بالإضافة إلى مترجمين فوريين معتمدين لكافة الجلسات الحوارية واللقاءات الثنائية.'
      },
      {
        q: 'هل يمكن التعاقد على كافة الخدمات ضمن عقد مؤسسي واحد؟',
        a: 'بالتأكيد، يتم دمج حجوزات الفنادق، القاعات، التجهيزات الفنية، الضيافة والتنقلات في عقد رسمي واحد وفاتورة ضريبية شفافة.'
      }
    ]
  },

  fa: {
    metaTitle: 'برگزاری همایش‌های شرکتی، کنگره‌های بین‌المللی و رویدادهای B2B در ترکیه | Toplantı Merkezi',
    metaDesc: 'مرکز تخصصی برنامه‌ریزی و اجرای همایش‌های نمایندگان فروش، کنفرانس‌های بین‌المللی، رونمایی محصول و رویدادهای شرکتی B2B در استانبول، آنتالیا، آنکارا و سراسر ۸۱ استان ترکیه.',
    nav: {
      topBanner: 'مدیریت یکپارچه همایش‌ها و رویدادهای شرکتی B2B در سراسر ۸۱ استان ترکیه',
      topSub: 'فرماندهی متمرکز عملیات و پورتال کنگره‌های بین‌المللی به ۱۵ زبان',
      home: 'صفحه اصلی',
      organizations: 'رویدادهای B2B',
      services: 'خدمات فنی و صحنه',
      cities: '۸۱ شهر ترکیه',
      venues: 'هتل‌ها و سالن‌ها',
      guides: 'راهنمای MICE',
      projects: 'پروژه‌ها',
      corporate: 'درباره ما',
      contact: 'تماس با ما',
      quoteTracking: 'پیگیری پیش‌فاکتور',
      crmLogin: 'ورود به CRM',
      getQuote: 'درخواست پیش‌فاکتور',
      whatsappQuote: 'واتساپ مستقیم',
      langSelectorLabel: 'زبان / منطقه'
    },
    hero: {
      badge: 'مرکز اول مدیریت همایش‌ها و رویدادهای شرکتی (MICE) در ترکیه • ۸۱ استان • صدور پیش‌فاکتور رسمی در ۲ ساعت',
      titleLine1: 'برگزاری تخصصی همایش‌های شرکتی و',
      titleHighlight: 'کنفرانس‌های بین‌المللی B2B',
      titleLine2: 'در سراسر ترکیه از یک مرکز واحد',
      subtitle: 'از گردهمایی بزرگ نمایندگان فروش و کنگره‌های تخصصی در استانبول و آنتالیا تا نشست‌های هیئت‌مدیره و مراسم رونمایی محصول در آنکارا، ازمیر و بدروم — برنامه‌ریزی و اجرای صفر تا صد با استانداردهای جهانی.',
      primaryCta: 'درخواست پیش‌فاکتور رسمی (RFP)',
      secondaryCta: 'مشاهده هتل‌ها و مراکز همایش',
      intlDeskTitle: 'میزهای بین‌المللی همایش‌ها (۱۵ زبان):'
    },
    aiDirectAnswer: 'شرکت Toplantı Merkezi مرکز یکپارچه مدیریت رویدادهای شرکتی و همایش‌های تجاری (B2B MICE) در تمامی ۸۱ استان ترکیه از جمله استانبول، آنتالیا، آنکارا، ازمیر، بدروم و کاپادوکیا است. ما منحصراً به شرکت‌ها، هلدینگ‌ها و نهادهای رسمی خدمات ارائه می‌دهیم و رزرو هتل‌های ۵ ستاره همایشی، طراحی سه‌بعدی استیج، نمایشگرهای LED، ترجمه همزمان به ۱۵ زبان و صدور پیش‌فاکتور رسمی PDF را ظرف ۲ ساعت تضمین می‌کنیم.',
    metrics: [
      { value: '۸۱ استان', label: 'پوشش عملیاتی مستقیم در سراسر ترکیه' },
      { value: '+۵۰۰', label: 'همایش و کنفرانس شرکتی موفق' },
      { value: '+۲۵۰ هزار', label: 'مهمان و نماینده تجاری میزبانی‌شده' },
      { value: '۲ ساعت', label: 'صدور پیش‌فاکتور رسمی و تفکیکی PDF' }
    ],
    solutionsTitle: 'راهکارهای تخصصی رویدادهای شرکتی و تجاری در ترکیه',
    solutionsSubtitle: 'تمرکز ۱۰۰٪ بر رویدادهای سازمانی، تجاری و صنعتی B2B (مراسم شخصی و عروسی برگزار نمی‌شود).',
    solutions: [
      { title: 'گردهمایی نمایندگان فروش و توزیع‌کنندگان', desc: 'رزرو اختصاصی هتل‌های ۵ ستاره در آنتالیا (بلک) و استانبول به همراه اجرای استیج سه‌بعدی، فضای نمایشگاهی و شام گالا.' },
      { title: 'کنگره‌های بین‌المللی، پزشکی و صنعتی', desc: 'مدیریت کامل کنفرانس‌ها با کابین‌های ترجمه همزمان استاندارد ISO و سیستم ثبت‌نام دیجیتال.' },
      { title: 'نشست‌های هیئت‌مدیره و اجلاس استراتژیک', desc: 'برگزاری جلسات مدیریتی سطح بالا در هتل‌های تنگه بسفر، بدروم و کاپادوکیا با تشریفات کامل.' },
      { title: 'مراسم رونمایی محصول و نمایشگاه‌های تخصصی', desc: 'اجرای نمایشگرهای عظیم LED P2.6، نورپردازی حرفه‌ای و دکوراسیون اختصاصی برند.' },
      { title: 'شام گالا و مراسم اهدای تندیس و جوایز', desc: 'برگزاری شب‌های تقدیر از مدیران و نمایندگان برتر در کاخ‌ها و سالن‌های مجلل استانبول و آنتالیا.' },
      { title: 'سفرهای انگیزشی (Incentive) و تیم‌سازی', desc: 'برنامه‌های اختصاصی مدیریتی، پرواز با بالن در کاپادوکیا و مسابقات قایقرانی در بسفر.' }
    ],
    servicesTitle: 'تجهیزات فنی، استیج و زیرساخت کامل MICE',
    services: [
      { title: 'تأمین هتل‌های ۵ ستاره و مراکز کنگره', desc: 'قرارداد مستقیم شرکتی با بیش از ۵۰۰ هتل ۵ ستاره و مرکز همایش در استانبول، آنتالیا و سراسر ترکیه.' },
      { title: 'طراحی استیج، وال LED و سیستم صوت و نور', desc: 'اجرای سن مدولار، تلویزیون‌های شهری فوق‌پهن و سیستم‌های صوتی Line Array.' },
      { title: 'ترجمه همزمان به ۱۵ زبان زنده دنیا', desc: 'مترجمان همزمان حرفه‌ای فارسی-ترکی-انگلیسی همراه با تجهیزات گیرنده مادون قرمز Bosch.' },
      { title: 'ترانسفر VIP فرودگاهی و اسکان مهمانان', desc: 'استقبال CIP فرودگاهی، ناوگان خودروهای تشریفاتی و هماهنگ‌کنندگان مسلط به زبان فارسی.' }
    ],
    destinationsTitle: 'قطب‌های اصلی برگزاری همایش در ترکیه',
    destinations: [
      { city: 'استانبول (Istanbul)', tag: 'قطب مالی و کنگره‌های بین‌المللی', desc: 'پروازهای مستقیم روزانه، هتل‌های ۵ ستاره بسفر و مراکز همایش بین‌المللی خلیج و لطفی کردار.' },
      { city: 'آنتالیا (Antalya - Belek)', tag: 'پایتخت همایش‌های بزرگ نمایندگان', desc: 'ریزورت‌های ۵ ستاره All-Inclusive با سالن‌های بدون ستون تا ظرفیت ۵۰۰۰ نفر.' },
      { city: 'آنکارا و ازمیر', tag: 'مرکز نشست‌های تجاری و صنعتی', desc: 'مناسب برای هیئت‌های تجاری، اتاق‌های بازرگانی و کنفرانس‌های صنعتی.' },
      { city: 'بدروم و کاپادوکیا', tag: 'نشست‌های ویژه مدیران ارشد', desc: 'مقاصد لوکس برای جلسات استراتژیک هیئت‌مدیره و تورهای انگیزشی شرکتی.' }
    ],
    form: {
      badge: 'میز ویژه همایش‌های فارسی‌زبان • پاسخ در ۲ ساعت',
      title: 'درخواست پیش‌فاکتور رسمی برگزاری همایش (RFP)',
      subtitle: 'درخواست شما مستقیماً در سامانه CRM ثبت شده و پیش‌فاکتور تفکیکی رسمی در قالب PDF A4 به همراه لینک امن پیگیری ارائه می‌گردد.',
      company: 'نام شرکت / هلدینگ / سازمان *',
      contactName: 'نام و نام خانوادگی و سمت *',
      email: 'ایمیل سازمانی *',
      phone: 'شماره تماس / واتساپ (با کد کشور) *',
      orgType: 'نوع رویداد یا همایش',
      city: 'شهر مورد نظر در ترکیه',
      attendees: 'تعداد تقریبی شرکت‌کنندگان',
      targetDate: 'تاریخ پیشنهادی برگزاری',
      budget: 'محدوده بودجه (EUR / USD / TRY)',
      notes: 'توضیحات درباره هتل، سالن، تجهیزات صوتی تصویری و ترجمه همزمان',
      submitBtn: 'ثبت درخواست RFP و دریافت کد پیگیری امن',
      submitting: 'در حال ارسال به مرکز عملیات MICE...',
      successTitle: 'درخواست پیش‌فاکتور شما با موفقیت ثبت شد!',
      successDesc: 'لطفاً کد پیگیری و توکن امنیتی زیر را جهت مشاهده وضعیت و دانلود فایل PDF پیش‌فاکتور ذخیره فرمایید:',
      trackBtn: 'ورود به پورتال پیگیری پیش‌فاکتور'
    },
    faqs: [
      {
        q: 'پیش‌فاکتور رسمی برگزاری همایش در ترکیه چه مدت پس از درخواست ارسال می‌شود؟',
        a: 'حداکثر ظرف ۲ ساعت کاری پس از دریافت اطلاعات، گزینه‌های هتل و سالن به همراه پیش‌فاکتور تفکیکی در قالب PDF A4 آماده و ارسال می‌شود.'
      },
      {
        q: 'آیا مدیر پروژه و مترجم همزمان فارسی‌زبان در محل رویداد حضور دارد؟',
        a: 'بله، هماهنگ‌کنندگان مسلط به زبان فارسی و مترجمان همزمان رسمی در تمام مراحل همایش همراه تیم شما خواهند بود.'
      },
      {
        q: 'آیا تمامی خدمات در قالب یک قرارداد رسمی واحد ارائه می‌شود؟',
        a: 'بله، اسکان هتل، اجاره سالن، تجهیزات استیج و LED، پذیرایی گالا و ترانسفر فرودگاهی در یک قرارداد شفاف سازمانی تجمیع می‌گردد.'
      }
    ]
  },

  // ============================================================================
  // STRATEJİK ÖNERİ DİLLERİ (FR, AZ, JA, KO, NL)
  // ============================================================================
  fr: {
    metaTitle: 'Agence Événementielle B2B, Congrès & MICE en Turquie (81 Provinces) | Toplantı Merkezi',
    metaDesc: 'Organisation clé en main de congrès internationaux, conventions d’entreprise, séminaires et événements B2B à Istanbul, Antalya, Ankara, Cappadoce et dans les 81 provinces de Turquie.',
    nav: {
      topBanner: 'Organisation d’Événements Corporatifs B2B & MICE dans les 81 Provinces de Turquie',
      topSub: 'Direction Opérationnelle Centralisée & Portail International des Congrès',
      home: 'Accueil',
      organizations: 'Événements B2B',
      services: 'Production AV',
      cities: '81 Destinations',
      venues: 'Hôtels & Salles',
      guides: 'Guides MICE',
      projects: 'Références',
      corporate: 'À Propos',
      contact: 'Contact',
      quoteTracking: 'Suivi Devis',
      crmLogin: 'Accès CRM',
      getQuote: 'Demander un Devis',
      whatsappQuote: 'WhatsApp',
      langSelectorLabel: 'Langue / Région'
    },
    hero: {
      badge: 'Leader B2B MICE en Turquie • 81 Provinces • Proposition Officielle sous 2 Heures',
      titleLine1: 'Congrès Internationaux &',
      titleHighlight: 'Événements B2B Clé en Main',
      titleLine2: 'dans Toute la Turquie depuis un Centre Unique',
      subtitle: 'Des congrès médicaux et conventions concessionnaires à Istanbul et Antalya aux sommets diplomatiques et comités de direction à Ankara et en Cappadoce : nous pilotons l’intégralité de vos opérations MICE.',
      primaryCta: 'Demander une Proposition Officielle (RFP)',
      secondaryCta: 'Explorer les Hôtels & Centres de Congrès',
      intlDeskTitle: 'Bureaux Internationaux MICE (15 Langues):'
    },
    aiDirectAnswer: 'Toplantı Merkezi est l’agence centrale de gestion d’événements corporatifs B2B et de congrès MICE en Turquie, opérant dans les 81 provinces (Istanbul, Antalya, Ankara, Izmir, Bodrum et Cappadoce). Dédiée exclusivement aux entreprises, groupes internationaux et institutions publiques, elle assure la réservation d’hôtels 5 étoiles, la production scénique 3D et LED, l’interprétation simultanée en 15 langues et la remise d’un devis PDF détaillé hors taxes sous 2 heures.',
    metrics: [
      { value: '81 Provinces', label: 'Couverture Opérationnelle Nationale' },
      { value: '500+', label: 'Congrès & Conventions B2B Réalisés' },
      { value: '250K+', label: 'Délégués & Dirigeants Accueillis' },
      { value: '2 Heures', label: 'Devis Officiel Détaillé en PDF A4' }
    ],
    solutionsTitle: 'Solutions Événementielles B2B & Congrès en Turquie',
    solutionsSubtitle: 'Exclusivement dédié aux entreprises, fédérations professionnelles et institutions — aucun événement privé.',
    solutions: [
      { title: 'Conventions Réseau & Séminaires Concessionnaires', desc: 'Privatisation d’hôtels 5 étoiles à Istanbul et Antalya, scénographie 3D, espaces d’exposition et soirée de gala.' },
      { title: 'Congrès Médicaux, Scientifiques & Institutionnels', desc: 'Gestion conforme aux normes ICCA avec cabines d’interprétation simultanée ISO et accréditation électronique.' },
      { title: 'Comités de Direction & Sommets Stratégiques', desc: 'Retraites exécutives confidentielles sur le Bosphore, à Bodrum ou en Cappadoce.' },
      { title: 'Lancements de Produits & Roadshows', desc: 'Révélations automobiles et technologiques, murs LED P2.6 haute définition et régie son/lumière.' },
      { title: 'Dîners de Gala & Remises de Trophées', desc: 'Soirées de prestige dans les palais historiques du Bosphore et gastronomie exécutive.' },
      { title: 'Voyages Incentive & Team Building', desc: 'Régates privées sur le Bosphore, vols en montgolfière en Cappadoce et ateliers de cohésion.' }
    ],
    servicesTitle: 'Production Technique Intégrée & Logistique MICE',
    services: [
      { title: 'Hôtels de Congrès 5* & Centres de Conventions', desc: 'Accords directs avec plus de 500 établissements MICE à Istanbul, Antalya, Ankara et dans toute la Turquie.' },
      { title: 'Scénographie 3D, Murs LED & Ingénierie AV', desc: 'Scènes modulaires, écrans LED panoramiques et systèmes audio line-array redondants.' },
      { title: 'Interprétation Simultanée (15 Langues)', desc: 'Cabines ISO, récepteurs infrarouges Bosch et interprètes de conférence certifiés français-turc-anglais.' },
      { title: 'Transferts VIP, Accueil Aéroport & Hébergement', desc: 'Coupe-file aéroportuaire, flotte exécutive, gestion du rooming-list et coordinateurs francophones.' }
    ],
    destinationsTitle: 'Destinations MICE Majeures en Turquie',
    destinations: [
      { city: 'Istanbul', tag: 'Carrefour Mondial des Congrès', desc: 'Vols directs depuis Paris, Lyon, Nice, Genève, Bruxelles et Montréal ; hôtels sur le Bosphore et centres de congrès.' },
      { city: 'Antalya (Belek & Lara)', tag: 'Capitale Resort des Conventions', desc: 'Complexes 5 étoiles avec salles plénières sans colonnes jusqu’à 5 000 places.' },
      { city: 'Ankara', tag: 'Pôle Diplomatique & Institutionnel', desc: 'Sommet d’État, forums économiques bilatéraux et conférences industrielles.' },
      { city: 'Izmir, Bodrum & Cappadoce', tag: 'Incentives & Retraites Exécutives', desc: 'Cadres d’exception sur la mer Égée et en Cappadoce pour vos comités de direction.' }
    ],
    form: {
      badge: 'Bureau MICE Francophone • Réponse sous 2 Heures',
      title: 'Demander une Proposition Officielle (RFP)',
      subtitle: 'Votre demande est enregistrée dans notre CRM. Vous recevrez un devis PDF A4 détaillé (HT) ainsi qu’un lien de suivi sécurisé.',
      company: 'Société / Organisation *',
      contactName: 'Nom Complet & Fonction *',
      email: 'E-mail Professionnel *',
      phone: 'Téléphone / WhatsApp (avec indicatif) *',
      orgType: 'Type d’Événement',
      city: 'Destination Souhaitée en Turquie',
      attendees: 'Nombre Estimé de Participants',
      targetDate: 'Date Prévue de l’Événement',
      budget: 'Budget Estimatif (EUR / USD / TRY)',
      notes: 'Besoins en Hôtellerie, Salles, Production AV et Interprétation',
      submitBtn: 'Envoyer la Demande RFP & Obtenir le Code',
      submitting: 'Transmission au Bureau MICE...',
      successTitle: 'Votre Demande RFP est Enregistrée !',
      successDesc: 'Conservez votre code de référence et votre jeton de sécurité pour consulter et télécharger votre devis PDF en ligne :',
      trackBtn: 'Ouvrir le Portail de Suivi du Devis'
    },
    faqs: [
      {
        q: 'Sous quel délai recevons-nous un devis détaillé pour un congrès en Turquie ?',
        a: 'Dans un délai de 2 heures ouvrées après réception de votre cahier des charges, notre équipe francophone prépare les options d’hôtels et un devis officiel PDF A4.'
      },
      {
        q: 'Disposez-vous de chefs de projet et d’interprètes francophones sur place ?',
        a: 'Oui, nous affectons des directeurs de projet francophones ainsi que des interprètes de conférence certifiés.'
      },
      {
        q: 'Pouvons-nous regrouper toutes les prestations sur une facture unique ?',
        a: 'Oui, l’hébergement, la location des salles, la technique AV, la restauration et les transferts sont consolidés dans un contrat B2B unique.'
      }
    ]
  },

  az: {
    metaTitle: 'Türkiyədə Korporativ Tədbirlər, Diler Toplantıları və Konqres Təşkili (81 Vilayət) | Toplantı Merkezi',
    metaDesc: 'İstanbul, Antalya, Ankara, Bodrum və Türkiyənin bütün 81 vilayətində diler toplantıları, beynəlxalq konqreslər, şirkət zirvələri və rəsmi protokol tədbirlərinin tək mərkəzdən idarə edilməsi.',
    nav: {
      topBanner: 'Türkiyənin 81 Vilayətində Korporativ Tədbir və MICE Həlləri',
      topSub: 'Tək Mərkəzdən Əməliyyat və Azərbaycan-Türkiyə B2B Konqres Portalı',
      home: 'Ana Səhifə',
      organizations: 'B2B Tədbirlər',
      services: 'Texniki Xidmətlər',
      cities: '81 Şəhər',
      venues: 'Otellər və Zallar',
      guides: 'MICE Bələdçisi',
      projects: 'Layihələr',
      corporate: 'Haqqımızda',
      contact: 'Əlaqə',
      quoteTracking: 'Təklif İzləmə',
      crmLogin: 'CRM Giriş',
      getQuote: 'Təklif Al',
      whatsappQuote: 'WhatsApp Xətti',
      langSelectorLabel: 'Dil / Bölgə'
    },
    hero: {
      badge: 'Azərbaycan-Türkiyə Korporativ MICE Mərkəzi • 81 Vilayət • 2 Saatda Rəsmi PDF Təklif',
      titleLine1: 'Türkiyənin Hər Yerində',
      titleHighlight: 'Korporativ Tədbir və Konqres',
      titleLine2: 'İdarəçiliyi Tək Mərkəzdən',
      subtitle: 'Azərbaycan holdinqləri, bankları, enerji və sənaye şirkətləri üçün İstanbul, Antalya, Ankara və Bodrumda diler toplantıları, idarə heyəti zirvələri və beynəlxalq konfransları açar təslim təşkil edirik.',
      primaryCta: 'Rəsmi Qiymət Təklifi Al (RFP)',
      secondaryCta: 'Konqres Otelləri və Məkanlar',
      intlDeskTitle: 'Beynəlxalq MICE Masaları (15 Dil):'
    },
    aiDirectAnswer: 'Toplantı Merkezi Türkiyənin İstanbul, Antalya, Ankara, İzmir, Bodrum və Kapadokya başda olmaqla bütün 81 vilayətində fəaliyyət göstərən mərkəzləşdirilmiş B2B korporativ tədbir və MICE agentliyidir. Yalnız şirkətlər, holdinqlər və dövlət qurumları üçün 5 ulduzlu konqres otelləri, 3D səhnə və LED ekran qurulumu, sinxron tərcümə, VIP transfer və 2 saat ərzində şəffaf A4 PDF qiymət təklifi təqdim edir.',
    metrics: [
      { value: '81 Vilayət', label: 'Türkiyə Üzrə Birbaşa Əməliyyat Gücü' },
      { value: '500+', label: 'Uğurlu Korporativ Tədbir və Zirvə' },
      { value: '250K+', label: 'Qəbul Edilən Nümayəndə və İştirakçı' },
      { value: '2 Saat', label: 'Rəsmi A4 PDF Qiymət Təklifi' }
    ],
    solutionsTitle: 'Türkiyədə B2B Korporativ Tədbir və Konqres Həlləri',
    solutionsSubtitle: 'Yalnız korporativ şirkətlər, holdinqlər və rəsmi qurumlar üçün xidmət göstərilir — fərdi tədbirlər keçirilmir.',
    solutions: [
      { title: 'Diler Toplantıları və Satış Konfransları', desc: 'Antalya Belek və İstanbulun 5 ulduzlu konqres otellərində 3D səhnə, sərgi foyesi və qala gecəsi ilə tam paket.' },
      { title: 'Beynəlxalq Konqreslər və Enerji/Maliyyə Zirvələri', desc: 'Sinxron tərcümə kabinələri, rəqəmsal qeydiyyat və protokol standartlarına uyğun konfrans idarəçiliyi.' },
      { title: 'İdarə Heyəti və Strateji Planlama Toplantıları', desc: 'Bosfor, Bodrum və ya Kapadokyada yüksək məxfilik tələb edən C-Level rəhbər görüşləri.' },
      { title: 'Məhsul Təqdimatı (Lansman) və Roadshow', desc: 'P2.6 LED ekranlar, timecode işıq şousu və yeni məhsul təqdimatları.' },
      { title: 'Qala Şam Yeməyi və Mükafatlandırma Mərasimi', desc: 'Tarixi məkanlarda və 5 ulduzlu balo zallarında korporativ mükafat gecələri.' },
      { title: 'Motivasiya Səfərləri və Team Building', desc: 'Kapadokya şar turları, Bosfor yaxta reqatası və komanda ruhunu gücləndirən proqramlar.' }
    ],
    servicesTitle: 'Texniki Prodakşn və MICE İnfrastrukturu',
    services: [
      { title: '5 Ulduzlu Konqres Otelləri və Məkan Seçimi', desc: 'Türkiyənin 81 vilayətində 500+ konqres oteli və mərkəzi ilə birbaşa korporativ müqavilə qiymətləri.' },
      { title: '3D Səhnə, LED Ekran və Səs/İşıq Sistemləri', desc: 'Modulyar səhnə, genişformatlı LED ekranlar və peşəkar reji komandası.' },
      { title: '15 Dildə Sinxron Tərcümə və Qeydiyyat', desc: 'ISO standartlı kabinələr, Bosch qəbulediciləri və peşəkar tərcüməçilər.' },
      { title: 'VIP Hava Limanı Transferi və Yerləşdirmə', desc: 'Bakı-İstanbul / Bakı-Antalya uçuşlarına uyğun VIP qarşılama, avtobus/mersedes parkı və otaq bölgüsü.' }
    ],
    destinationsTitle: 'Türkiyənin Əsas MICE Mərkəzləri',
    destinations: [
      { city: 'İstanbul', tag: 'Beynəlxalq Maliyyə və Konqres Mərkəzi', desc: 'Bakı, Gəncə və Naxçıvandan birbaşa uçuşlar; Bosfor otelləri və konqres mərkəzləri.' },
      { city: 'Antalya (Belek & Lara)', tag: 'Diler Toplantılarının Paytaxtı', desc: '5.000 nəfərlik sütunsuz zallara malik 5 ulduzlu High-End All Inclusive otellər.' },
      { city: 'Ankara', tag: 'Rəsmi Protokol və Dövlət Zirvələri', desc: 'İkitərəfli rəsmi görüşlər, nazirlik və sənaye palataları tədbirləri üçün mərkəz.' },
      { city: 'İzmir, Bodrum və Kapadokya', tag: 'Rəhbər Zirvələri və İnsetiv', desc: 'İdarə heyəti toplantıları və VIP qonaqlar üçün eksklüziv məkanlar.' }
    ],
    form: {
      badge: 'Azərbaycan Korporativ MICE Masası • 2 Saatda Cavab',
      title: 'Rəsmi Korporativ Qiymət Təklifi Alın (RFP)',
      subtitle: 'Sorğunuz birbaşa CRM sistemimizə düşür. Sizə ƏDV xaric detallı A4 PDF təklif sənədi və təhlükəsiz izləmə keçidi təqdim olunur.',
      company: 'Şirkət / Holdinq / Qurum Adı *',
      contactName: 'Əlaqədar Şəxsin Adı, Soyadı və Vəzifəsi *',
      email: 'Korporativ E-poçt Ünvanı *',
      phone: 'Telefon / WhatsApp Nömrəsi *',
      orgType: 'Tədbirin Növü',
      city: 'Türkiyədə Seçilən Şəhər',
      attendees: 'Təxmini İştirakçı Sayı',
      targetDate: 'Planlaşdırılan Tarix',
      budget: 'Təxmini Büdcə Aralığı (EUR / USD / AZN / TRY)',
      notes: 'Otel, Zal, Texniki Avadanlıq və Transfer Qeydləriniz',
      submitBtn: 'Sorğunu Göndər və İzləmə Kodu Al',
      submitting: 'MICE Əməliyyat Mərkəzinə Göndərilir...',
      successTitle: 'Sorğunuz Rəsmi Olaraq Qeydiyyata Alındı!',
      successDesc: 'Rəsmi PDF təklifinizi onlayn izləmək və yükləmək üçün aşağıdakı referans kodunu və təhlükəsizlik açarını saxlayın:',
      trackBtn: 'Təhlükəsiz Təklif İzləmə Portalını Aç'
    },
    faqs: [
      {
        q: 'Türkiyədə keçiriləcək korporativ tədbir üçün qiymət təklifi nə qədər müddətə hazırlanır?',
        a: 'Müraciətiniz daxil olduqdan sonra 2 iş saatı ərzində otel alternativləri və detallı xərc cədvəlini əhatə edən rəsmi A4 PDF təklif təqdim edilir.'
      },
      {
        q: 'Azərbaycan şirkətləri üçün rəsmi müqavilə və bank köçürməsi ilə ödəniş mümkündürmü?',
        a: 'Bəli, bütün otel, zal, texniki qurulum və transfer xidmətləri tək bir rəsmi korporativ müqavilə və hesab-faktura ilə rəsmiləşdirilir.'
      },
      {
        q: 'Bakıdan gələn nümayəndə heyətləri üçün VIP qarşılama və transfer təşkil edirsinizmi?',
        a: 'Bəli, İstanbul, Antalya və digər hava limanlarında VIP qarşılama, özəl nəqliyyat parkı və 24/7 koordinator dəstəyi təmin edirik.'
      }
    ]
  },

  ja: {
    metaTitle: 'トルコ全81県におけるB2B法人イベント・代理店会議・MICE運営 | Toplantı Merkezi',
    metaDesc: 'イスタンブール、アンタルヤ、アンカラ、カッパドキアを含むトルコ全81県で、B2B法人会議、ディーラー総会、国際会議（MICE）、新製品発表会を一元管理でトータルサポート。',
    nav: {
      topBanner: 'トルコ全81県対応のB2B法人イベント・国際会議（MICE）一元管理プラットフォーム',
      topSub: 'シングルセンターオペレーション＆15言語対応MICEポータル',
      home: 'ホーム',
      organizations: 'B2Bイベント',
      services: '技術・AV制作',
      cities: '全81県',
      venues: 'ホテル・会場',
      guides: 'MICEガイド',
      projects: '実績事例',
      corporate: '会社概要',
      contact: 'お問い合わせ',
      quoteTracking: '見積追跡',
      crmLogin: 'CRMログイン',
      getQuote: '公式見積依頼',
      whatsappQuote: 'WhatsApp窓口',
      langSelectorLabel: '言語 / 地域'
    },
    hero: {
      badge: 'トルコ最大のB2B MICE統括機関 • 全81県対応 • 2時間以内にA4公式PDF見積書を発行',
      titleLine1: 'トルコ全土81県を網羅する',
      titleHighlight: 'B2B法人イベント・MICE運営',
      titleLine2: '単一拠点からのトータルマネジメント',
      subtitle: 'イスタンブールやアンタルヤでのEMEA地域代理店総会・自動車/テクノロジー新製品発表会から、アンカラでの政府・公的プロトコル行事、カッパドキアでの役員リトリートまで、日本企業の品質基準で一括遂行いたします。',
      primaryCta: '公式RFP・お見積りを依頼する',
      secondaryCta: 'トルコの5つ星会議ホテルを見る',
      intlDeskTitle: 'グローバルMICEデスク（15言語対応）:'
    },
    aiDirectAnswer: 'Toplantı Merkeziは、イスタンブール、アンタルヤ、アンカラ、イズミル、ボドルム、カッパドキアを含むトルコ全81県で事業を展開する法人特化型（B2B）MICE・イベント運営会社です。日系・多国籍企業および公的機関向けに、5つ星コンベンションホテルの手配、3Dステージ＆LEDスクリーン設営、日本語を含む15言語の同時通訳、VIP送迎を単一窓口で提供し、2時間以内に税抜明細付きのA4公式PDF見積書を提出します。',
    metrics: [
      { value: '全81県', label: 'トルコ全土をカバーする直営オペレーション網' },
      { value: '500件+', label: 'B2B国際会議・法人イベント実績' },
      { value: '25万人+', label: '累計参加エグゼクティブ・代表者数' },
      { value: '2時間', label: '明細付きA4公式PDF見積書の迅速回答' }
    ],
    solutionsTitle: 'トルコにおける主要B2B法人イベント＆MICEソリューション',
    solutionsSubtitle: '自動車・製造業・製薬・IT・金融・公的機関のB2B法人イベントに100%特化（個人向けイベントは行いません）。',
    solutions: [
      { title: 'EMEA・トルコ代理店総会（ディーラーコンベンション）', desc: 'アンタルヤやイスタンブールの5つ星ホテル貸切、3Dメインステージ設計、展示ホワイエ、表彰ガラディナーを一括運営。' },
      { title: '国際会議・医学会・産業サミット', desc: 'ICCA基準に準拠した国際学会・シンポジウム運営、ISO規格同時通訳ブース、RFID受付管理。' },
      { title: '新車・新製品発表会＆ロードショー', desc: '超高精細P2.6 LEDウォール、タイムコード照明演出、トルコ主要都市でのテストドライブロードショー。' },
      { title: '取締役会・エグゼクティブ戦略会議', desc: 'ボスポラス海峡、ボドルム、カッパドキアでの高機密・高セキュリティな経営陣オフサイトミーティング。' },
      { title: '周年記念式典・ガラディナー・表彰式', desc: '歴史的宮殿や高級ホテルボールルームでの式典運営、VIPプロトコル対応。' },
      { title: 'インセンティブ旅行＆チームビルディング', desc: 'ボスポラス海峡ヨットレガッタ、カッパドキア貸切熱気球など法人向け特別プログラム。' }
    ],
    servicesTitle: '自社テクニカルプロダクション＆MICEインフラ',
    services: [
      { title: '5つ星コンベンションホテル・会場手配', desc: 'トルコ全81県の500以上の会議センター・5つ星MICEホテルと法人直接契約。' },
      { title: '3Dステージ造作・P2.6 LED・音響照明エンジニアリング', desc: 'パノラマLEDスクリーン、ラインアレイ音響、バックアップ電源を備えた万全の施工。' },
      { title: '15言語対応の同時通訳（日本語・トルコ語・英語）', desc: 'ISO防音ブース、Bosch赤外線レシーバー、専門会議通訳者の手配。' },
      { title: 'VIP空港ファストトラック・専用車フリート・宿泊管理', desc: 'イスタンブール空港でのVIP送迎、専用バス・セダン手配、分刻みのスケジュール管理。' }
    ],
    destinationsTitle: 'トルコの主要MICE開催都市',
    destinations: [
      { city: 'イスタンブール (Istanbul)', tag: '欧州・中東・アジアを結ぶ国際会議都市', desc: '東京（羽田・成田）および関西からの直行便。ボスポラス海峡沿いの最高級ホテルと大型国際会議場。' },
      { city: 'アンタルヤ (Antalya - Belek)', tag: '大型リゾートコンベンションの拠点', desc: '最大5,000名収容の無柱ボールルームを備えた5つ星オールインクルーシブMICEリゾート。' },
      { city: 'アンカラ・イズミル・ブルサ', tag: '政府機関・自動車・製造業の拠点', desc: '日系製造業・自動車工場が集積するマルマラ・エーゲ海地域や首都アンカラでの公式行事。' },
      { city: 'カッパドキア＆ボドルム', tag: 'エグゼクティブ・リトリート＆報奨旅行', desc: '世界遺産カッパドキアやエーゲ海リゾートでのVIPインセンティブプログラム。' }
    ],
    form: {
      badge: '日本企業向けMICEデスク • 2時間以内に回答',
      title: '公式お見積り・企画提案（RFP）リクエスト',
      subtitle: 'ご依頼内容は即座に当社のCRMに登録され、税抜明細付きのA4公式PDF見積書とセキュアな追跡リンクを発行いたします。',
      company: '貴社名 / 団体名 *',
      contactName: 'ご担当者様氏名・役職 *',
      email: '法人メールアドレス *',
      phone: '電話番号 / WhatsApp（国番号含む） *',
      orgType: 'イベント種別',
      city: 'ご希望の開催都市',
      attendees: '予定参加者数',
      targetDate: '開催予定時期',
      budget: 'ご予算規模 (EUR / USD / JPY / TRY)',
      notes: 'ホテル、会議室、AV機材、日本語通訳、送迎などのご要望',
      submitBtn: 'RFPを送信して追跡コードを取得する',
      submitting: 'MICE統括本部へ送信中...',
      successTitle: '公式RFPリクエストが正常に登録されました！',
      successDesc: 'オンラインでPDF見積書を確認・ダウンロードするため、以下の参照コードとセキュリティトークンを保管してください：',
      trackBtn: 'セキュア見積追跡ポータルを開く'
    },
    faqs: [
      {
        q: 'トルコでの法人イベントの見積書はどのくらいで届きますか？',
        a: '要件をお送りいただいてから2営業時間以内に、会場候補の比較表と項目別明細を記載したA4公式PDF見積書を提出いたします。'
      },
      {
        q: '日本語通訳や日本企業の品質基準に対応した運営は可能ですか？',
        a: 'はい。同時通訳ブース・日本語会議通訳者の手配から、緻密な進行台本・リハーサル管理まで徹底サポートいたします。'
      },
      {
        q: 'ホテル、会場、機材、送迎を一括の法人契約・請求書にまとめられますか？',
        a: 'はい、すべてのMICE関連手配を単一の透明な法人契約および公式請求書に統合可能です。'
      }
    ]
  },

  ko: {
    metaTitle: '튀르키예 B2B 기업 행사, 딜러 컨퍼런스 및 MICE 통합 운영 (81개 전 주) | Toplantı Merkezi',
    metaDesc: '이스탄불, 안탈리아, 앙카라, 카파도키아 등 튀르키예 81개 모든 주에서 B2B 기업 회의, 딜러 컨벤션, 국제 학술대회, 신차/신제품 런칭쇼를 단일 센터에서 턴키로 운영합니다.',
    nav: {
      topBanner: '튀르키예 81개 전 지역 B2B 기업 행사 및 MICE 통합 운영 플랫폼',
      topSub: '단일 컨트롤 타워 & 15개 국어 글로벌 컨그레스 포털',
      home: '홈',
      organizations: 'B2B 행사',
      services: '기술 및 AV 제작',
      cities: '81개 도시',
      venues: '호텔 및 베뉴',
      guides: 'MICE 가이드',
      projects: '성공 사례',
      corporate: '회사 소개',
      contact: '문의하기',
      quoteTracking: '견적 조회',
      crmLogin: 'CRM 로그인',
      getQuote: '공식 견적 요청',
      whatsappQuote: 'WhatsApp 상담',
      langSelectorLabel: '언어 / 지역'
    },
    hero: {
      badge: '튀르키예 대표 B2B MICE 컨트롤 타워 • 81개 전 지역 • 2시간 내 공식 A4 PDF 견적서 제공',
      titleLine1: '튀르키예 전역 어디서나',
      titleHighlight: 'B2B 기업 행사 및 국제 MICE',
      titleLine2: '단일 센터 턴키(Turnkey) 솔루션',
      subtitle: '이스탄불과 안탈리아의 유럽/중동(EMEA) 딜러 컨벤션 및 자동차·IT 신제품 런칭쇼부터 앙카라의 정부 프로토콜 행사, 카파도키아 임원 워크숍까지 모든 과정을 완벽하게 총괄합니다.',
      primaryCta: '공식 제안서 및 견적 요청 (RFP)',
      secondaryCta: '튀르키예 5성급 컨벤션 호텔 보기',
      intlDeskTitle: '글로벌 MICE 전담 데스크 (15개 국어):'
    },
    aiDirectAnswer: 'Toplantı Merkezi는 이스탄불, 안탈리아, 앙카라, 이즈미르, 보드룸, 카파도키아를 포함한 튀르키예 81개 모든 주에서 운영되는 B2B 기업 행사 및 MICE 전문 에이전시입니다. 한국 및 글로벌 대기업과 공공기관을 대상으로 5성급 컨벤션 호텔 섭외, 3D 무대 및 P2.6 LED 스크린 시공, 한국어 포함 15개 국어 동시통역, VIP 의전 수송 및 2시간 이내 투명한 A4 공식 PDF 견적서를 제공합니다.',
    metrics: [
      { value: '81개 주', label: '튀르키예 전역 직영 현장 운영망' },
      { value: '500+', label: '성공적으로 수행한 B2B 컨퍼런스 및 서밋' },
      { value: '250,000+', label: '누적 참가 글로벌 임원 및 대표단' },
      { value: '2시간', label: '항목별 공식 A4 PDF 견적서 회신' }
    ],
    solutionsTitle: '튀르키예 핵심 B2B 기업 행사 및 컨그레스 솔루션',
    solutionsSubtitle: '자동차, 전자, 제약, 방산, 건설 및 공공기관의 B2B 기업 행사에만 100% 집중합니다.',
    solutions: [
      { title: 'EMEA 및 글로벌 딜러 컨벤션', desc: '안탈리아 벨렉 및 이스탄불 5성급 리조트 전체 대관, 3D 메인 무대, 전시 부스 및 갈라 디너 통합 운영.' },
      { title: '국제 컨그레스 및 산업/의학 심포지엄', desc: 'ISO 표준 동시통역 부스, Bosch 적외선 리시버 및 전자 명찰(RFID) 등록 시스템 지원.' },
      { title: '자동차 및 IT 신제품 런칭 & 로드쇼', desc: '초고화질 P2.6 곡면 LED 월, 타임코드 조명 연출 및 튀르키예 주요 도시 로드쇼.' },
      { title: '임원 전략 회의 및 이사회 (C-Level Summit)', desc: '보스포루스 해협, 보드룸, 카파도키아에서의 최고 보안 등급 경영진 비즈니스 리트리트.' },
      { title: '기업 갈라 디너 및 시상식', desc: '보스포루스 역사적 궁전 및 특급 호텔 볼룸에서의 시상식, 만찬 및 공연 연출.' },
      { title: '인센티브 투어 및 팀 빌딩', desc: '카파도키아 전용 열기구 투어, 보스포루스 프라이빗 요트 레가타 및 맞춤형 팀워크 프로그램.' }
    ],
    servicesTitle: '자체 기술 프로덕션 및 MICE 인프라',
    services: [
      { title: '5성급 컨벤션 호텔 및 베뉴 직계약', desc: '튀르키예 81개 주 500개 이상의 컨벤션 센터 및 5성급 MICE 호텔과 기업 직계약 요금 제공.' },
      { title: '3D 무대 제작, P2.6 LED 및 음향/조명 엔지니어링', desc: '모듈형 커스텀 무대, 대형 파노라마 LED 스크린 및 라인 어레이 음향 시스템.' },
      { title: '15개 국어 동시통역 (한국어-튀르키예어-영어)', desc: 'ISO 방음 통역 부스 및 전문 국제회의 통역사 배치.' },
      { title: 'VIP 공항 패스트트랙, 전용 차량 및 한식/케이터링 조율', desc: '이스탄불/안탈리아 공항 VIP 의전, 전용 벤츠 스프린터/대형 버스 및 한식 맞춤 케이터링 지원.' }
    ],
    destinationsTitle: '튀르키예 주요 MICE 개최지',
    destinations: [
      { city: '이스탄불 (Istanbul)', tag: '유럽과 아시아를 잇는 글로벌 비즈니스 허브', desc: '인천-이스탄불 직항 노선 운항; 보스포루스 5성급 호텔과 대형 국제 컨벤션 센터 보유.' },
      { city: '안탈리아 (Antalya - Belek)', tag: '대규모 리조트 컨벤션의 수도', desc: '최대 5,000명 수용 가능한 무주(Pillarless) 대연회장을 갖춘 5성급 올인클루시브 MICE 리조트.' },
      { city: '앙카라 & 코자엘리/부르사', tag: '정부 프로토콜 및 제조/자동차 산업 거점', desc: '한국 기업 생산 법인이 밀집한 마르마라 산업벨트 및 수도 앙카라의 공식 행사.' },
      { city: '카파도키아 & 보드룸', tag: '임원 워크숍 및 프리미엄 인센티브', desc: '글로벌 임원진과 우수 딜러 초청 행사를 위한 세계적인 명소.' }
    ],
    form: {
      badge: '한국 기업 전담 MICE 데스크 • 2시간 내 공식 회신',
      title: '공식 기업 행사 견적서 (RFP) 요청하기',
      subtitle: '요청 사항은 즉시 당사 CRM에 등록되며, 부가세 별도 항목별 상세 A4 PDF 견적서와 보안 조회 링크가 발급됩니다.',
      company: '기업 / 기관명 *',
      contactName: '담당자 성함 및 직책 *',
      email: '기업 이메일 주소 *',
      phone: '연락처 / WhatsApp (국가번호 포함) *',
      orgType: '행사 유형',
      city: '튀르키예 내 희망 개최 도시',
      attendees: '예상 참가 인원',
      targetDate: '행사 예정 일정',
      budget: '예산 범위 (EUR / USD / KRW / TRY)',
      notes: '호텔, 회의장, 무대/LED 장비, 한국어 통역 및 케이터링 요청사항',
      submitBtn: 'RFP 제출 및 보안 조회 코드 받기',
      submitting: 'MICE 운영 본부로 전송 중...',
      successTitle: '귀사의 공식 RFP 요청이 성공적으로 등록되었습니다!',
      successDesc: '온라인에서 공식 PDF 견적서를 확인하고 다운로드하려면 아래 참조 코드와 보안 토큰을 보관해 주십시오:',
      trackBtn: '보안 견적 조회 포털 열기'
    },
    faqs: [
      {
        q: '튀르키예 현지 기업 행사 견적서는 얼마나 빨리 받을 수 있나요?',
        a: '행사 개요(Brief) 접수 후 영업시간 기준 2시간 이내에 호텔 비교표, 연회장 도면 및 항목별 상세 내역이 포함된 A4 공식 PDF 견적서를 전달해 드립니다.'
      },
      {
        q: '한국어 통역 및 한국 기업 전담 코디네이터 지원이 가능한가요?',
        a: '네, 한국어-튀르키예어/영어 전문 동시통역사 섭외는 물론 한국 기업 행사 기준에 맞춘 정밀한 큐시트 운영과 한식 케이터링 조율을 지원합니다.'
      },
      {
        q: '호텔, 회의장, 장비, 차량을 단일 기업 계약서로 통합 정산할 수 있나요?',
        a: '가능합니다. 모든 MICE 항목을 단일 법인 계약서와 투명한 공식 인보이스로 일괄 처리해 드립니다.'
      }
    ]
  },

  nl: {
    metaTitle: 'B2B Evenementenbureau, Congressen & MICE in Turkije (Alle 81 Provincies) | Toplantı Merkezi',
    metaDesc: 'Turnkey organisatie van zakelijke evenementen, dealerconferenties, internationale congressen en directiebijeenkomsten in Istanbul, Antalya, Ankara en alle 81 provincies van Turkije.',
    nav: {
      topBanner: 'Zakelijke B2B Evenementen & MICE-Operaties in alle 81 Provincies van Turkije',
      topSub: 'Centrale Regie & Internationaal Congresportaal in 15 Talen',
      home: 'Home',
      organizations: 'B2B Events',
      services: 'AV & Techniek',
      cities: '81 Steden',
      venues: 'Hotels & Locaties',
      guides: 'MICE Gidsen',
      projects: 'Cases',
      corporate: 'Over Ons',
      contact: 'Contact',
      quoteTracking: 'Offerte Volgen',
      crmLogin: 'CRM Login',
      getQuote: 'Offerte Aanvragen',
      whatsappQuote: 'WhatsApp Desk',
      langSelectorLabel: 'Taal / Regio'
    },
    hero: {
      badge: 'Dé Centrale B2B MICE-Partner in Turkije • 81 Provincies • Officiële PDF-Offerte binnen 2 Uur',
      titleLine1: 'Zakelijke Evenementen &',
      titleHighlight: 'Internationale MICE-Regie',
      titleLine2: 'in Heel Turkije vanuit Één Centrum',
      subtitle: 'Van internationale dealerconferenties en productlanceringen in Istanbul en Antalya tot directieretraites en handelsmissies in Ankara, Izmir en Cappadocië — wij plannen en produceren elk detail turnkey.',
      primaryCta: 'Officiële RFP-Offerte Aanvragen',
      secondaryCta: 'Bekijk 5-Sterren Congreshotels',
      intlDeskTitle: 'Internationale MICE-Desks (15 Talen):'
    },
    aiDirectAnswer: 'Toplantı Merkezi is het centrale B2B-evenementen- en MICE-bureau in Turkije met directe operaties in alle 81 provincies, waaronder Istanbul, Antalya, Ankara, Izmir, Bodrum en Cappadocië. Wij werken uitsluitend voor zakelijke ondernemingen, multinationals en overheidsinstellingen en leveren 5-sterren congreshotels, 3D-podium- en LED-productie, simultaanvertaling in 15 talen en binnen 2 uur een gespecificeerde A4 PDF-offerte exclusief btw.',
    metrics: [
      { value: '81 Provincies', label: 'Landelijke Dekking in Heel Turkije' },
      { value: '500+', label: 'Geleverde B2B Congressen & Summits' },
      { value: '250K+', label: 'Ontvangen Zakelijke Deelnemers' },
      { value: '2 Uur', label: 'Gespecificeerde A4 PDF-Offerte' }
    ],
    solutionsTitle: 'Kernoplossingen voor Zakelijke Evenementen & Congressen',
    solutionsSubtitle: '100% focus op B2B-bedrijven, multinationals en handelsmissies — geen consumentenevenementen.',
    solutions: [
      { title: 'Dealerconferenties & Partnerbijeenkomsten', desc: 'Volledige buy-out van 5-sterren congreshotels in Antalya en Istanbul inclusief 3D-hoofdpodium, beursvloer en galadiner.' },
      { title: 'Internationale Congressen & Symposia', desc: 'Medische, financiële en industriële congressen met ISO-tolkcabines en digitale bezoekersregistratie.' },
      { title: 'Directiebijeenkomsten & Strategie Summits', desc: 'Vertrouwelijke C-level bijeenkomsten aan de Bosporus, in Bodrum of Cappadocië.' },
      { title: 'Productlanceringen & Roadshows', desc: 'Spectaculaire onthullingen met haarscherpe P2.6 LED-walls, timecode-lichtshows en landelijke logistiek.' },
      { title: 'Zakelijke Galadiners & Award Shows', desc: 'Exclusieve diners in historische paleizen aan de Bosporus met hoogwaardige zakelijke catering.' },
      { title: 'Incentive Reizen & Executive Team Building', desc: 'Zeilregatta’s op de Bosporus, privé-ballonvaarten in Cappadocië en leiderschapsprogramma’s.' }
    ],
    servicesTitle: 'Eigen Technische Productie & MICE-Infrastructuur',
    services: [
      { title: '5-Sterren Congreshotels & Venue Sourcing', desc: 'Directe zakelijke contracten met meer dan 500 congrescentra en 5-sterrenhotels in alle 81 provincies.' },
      { title: '3D-Podiumbouw, LED-Walls & AV-Techniek', desc: 'Modulaire podia, panoramische LED-schermen en professionele licht- en geluidsregie.' },
      { title: 'Simultaanvertaling (15 Talen)', desc: 'Geluidsdichte ISO-cabines, Bosch-ontvangers en gecertificeerde congrestolken.' },
      { title: 'VIP Luchthavenvervoer & Deelnemerslogistiek', desc: 'Fast-track op Istanbul en Antalya Airport, executive wagenpark en kamerlijstbeheer.' }
    ],
    destinationsTitle: 'Top MICE-Bestemmingen in Turkije',
    destinations: [
      { city: 'Istanbul', tag: 'Wereldwijde Congres- & Zakenmetropool', desc: 'Rechtstreekse vluchten vanaf Amsterdam Schiphol, Rotterdam, Eindhoven en Brussel.' },
      { city: 'Antalya (Belek & Lara)', tag: 'Resort MICE & Congreshoofdstad', desc: '5-sterrenresorts met pilaarvrije balzalen tot 5.000 personen en eigen expocentra.' },
      { city: 'Ankara & Izmir', tag: 'Handelsmissies, Industrie & Logistiek', desc: 'Strategische hubs voor Nederlands-Turkse en Belgisch-Turkse handelsdelegaties.' },
      { city: 'Bodrum & Cappadocië', tag: 'Executive Retreats & Incentives', desc: 'Unieke locaties aan de Egeïsche kust en in Cappadocië voor directieteams.' }
    ],
    form: {
      badge: 'Benelux MICE-Desk • Binnen 2 Uur Voorstel',
      title: 'Vraag een Officiële Zakelijke Offerte Aan (RFP)',
      subtitle: 'Uw aanvraag wordt direct geregistreerd in ons CRM. U ontvangt een gespecificeerde A4 PDF-offerte (excl. btw) en een beveiligde trackinglink.',
      company: 'Bedrijfsnaam / Organisatie *',
      contactName: 'Volledige Naam & Functie *',
      email: 'Zakelijk E-mailadres *',
      phone: 'Telefoon / WhatsApp (met landcode) *',
      orgType: 'Type Evenement',
      city: 'Gewenste Bestemming in Turkije',
      attendees: 'Geschat Aantal Deelnemers',
      targetDate: 'Gewenste Datum / Periode',
      budget: 'Indicatieve Budgetrange (EUR / USD / TRY)',
      notes: 'Wensen omtrent Hotel, Congreszaal, AV-Techniek en Vertaling',
      submitBtn: 'RFP Verzenden & Trackingcode Ontvangen',
      submitting: 'Wordt verzonden naar de MICE-Desk...',
      successTitle: 'Uw RFP-Aanvraag is Geregistreerd!',
      successDesc: 'Bewaar uw referentiecode en beveiligingstoken om uw officiële PDF-offerte online in te zien en te downloaden:',
      trackBtn: 'Open Beveiligd Offerteportaal'
    },
    faqs: [
      {
        q: 'Hoe snel ontvangen wij een gespecificeerde offerte voor ons congres in Turkije?',
        a: 'Binnen 2 werkuren na ontvangst van uw briefing stelt onze MICE-desk een hotelvergelijking, zaalcapaciteiten en een officiële A4 PDF-offerte op.'
      },
      {
        q: 'Kunnen alle diensten via één zakelijke overeenkomst en factuur worden afgerekend?',
        a: 'Ja, hotelovernachtingen, zaalhuur, AV-productie, galadiners en transfers worden gebundeld in één transparant B2B-contract.'
      },
      {
        q: 'Verzorgen jullie ook simultaanvertaling en begeleiding op locatie?',
        a: 'Ja, wij leveren ISO-gecertificeerde tolkcabines, tolken in 15 talen en ervaren internationale projectmanagers op locatie.'
      }
    ]
  }
};

/**
 * Sorgu metnini Türkçe/Yabancı karakter duyarlı küçük harfe çevirir
 */
export function normalizeMultiLangText(str = '') {
  return String(str)
    .toLocaleLowerCase('tr-TR')
    .trim();
}

/**
 * Arama sorgusunun hangi dillerle eşleştiğini tespit eder (Örn: "rusça", "hindistanca", "العربية", "中文", "deutsch")
 */
export function matchLanguageFromQuery(rawQuery = '') {
  const q = normalizeMultiLangText(rawQuery);
  if (q.length < 2) return [];
  return SUPPORTED_LANGUAGES.filter((lang) => {
    if (normalizeMultiLangText(lang.code) === q) return true;
    const tokens = [lang.name, lang.trName, lang.nativeName, ...(lang.searchAliases || [])]
      .filter(Boolean)
      .map((s) => normalizeMultiLangText(s))
      .filter((s) => s.length >= 2);
    return tokens.some((tok) => {
      if (tok === q) return true;
      // Tek kelimelik ad/takma adlarda önek eşleşmesi (örn. "rus" -> "rusça"); çok kelimeli ifadelerde yalnızca ifade başı
      if (q.length >= 3 && tok.startsWith(q)) return true;
      // Sorgu, ad/takma adı tam olarak içeriyorsa (örn. "rusça kongre" -> "rusça")
      if (tok.length >= 3 && !tok.includes(' ') && q.split(/\s+/).includes(tok)) return true;
      return false;
    });
  });
}

/**
 * 15 Dilli Global B2B MICE Arama Motoru
 * Hem dil adına göre ("İngilizce", "Rusça", "Arapça", "Farsça", "Hindistanca", "Çince", "Almanca" vb.)
 * hem de 15 dilin kendi alfabesindeki organizasyon/şehir/hizmet terimlerine göre arama yapar.
 */
export function searchMultiLanguageCatalog(rawQuery = '', selectedLangCode = 'all') {
  const q = normalizeMultiLangText(rawQuery);
  const targetLangs =
    selectedLangCode && selectedLangCode !== 'all'
      ? SUPPORTED_LANGUAGES.filter((l) => l.code === selectedLangCode)
      : SUPPORTED_LANGUAGES;

  const languagePortals = [];
  const solutions = [];
  const services = [];
  const destinations = [];

  targetLangs.forEach((lang) => {
    const content = I18N_CONTENT[lang.code] || {};
    const langMatchHaystack = normalizeMultiLangText(
      [
        lang.code,
        lang.name,
        lang.trName,
        lang.nativeName,
        lang.regionLabel,
        lang.seoKeywords,
        content.metaTitle,
        content.metaDesc,
        ...(lang.searchAliases || [])
      ].join(' ')
    );

    const isDirectLangMatch = !q || langMatchHaystack.includes(q);

    if (isDirectLangMatch) {
      languagePortals.push({
        type: 'language_portal',
        code: lang.code,
        flag: lang.flag,
        name: lang.name,
        nativeName: lang.nativeName,
        regionLabel: lang.regionLabel,
        dir: lang.dir,
        path: lang.path,
        isRecommended: lang.isRecommended,
        title: content.metaTitle || `${lang.name} (${lang.nativeName}) Kurumsal MICE Portalı`,
        description: content.metaDesc || lang.regionLabel
      });
    }

    // 1. B2B Solutions in this language
    const solList = content.solutions || [];
    solList.forEach((sol, idx) => {
      const solHaystack = normalizeMultiLangText(
        `${sol.title} ${sol.desc} ${lang.name} ${lang.nativeName} ${(lang.searchAliases || []).join(' ')}`
      );
      if (!q || solHaystack.includes(q) || isDirectLangMatch) {
        solutions.push({
          id: `${lang.code}-sol-${idx}`,
          type: 'solution',
          langCode: lang.code,
          langFlag: lang.flag,
          langName: lang.name,
          langNative: lang.nativeName,
          title: sol.title,
          description: sol.desc,
          path: sol.link || lang.path
        });
      }
    });

    // 2. Technical & Simultaneous Interpretation Services in this language
    const srvList = content.techItems || content.services || [];
    srvList.forEach((srv, idx) => {
      const srvHaystack = normalizeMultiLangText(
        `${srv.title} ${srv.desc} ${lang.name} ${lang.nativeName} ${(lang.searchAliases || []).join(' ')}`
      );
      if (!q || srvHaystack.includes(q)) {
        services.push({
          id: `${lang.code}-srv-${idx}`,
          type: 'service',
          langCode: lang.code,
          langFlag: lang.flag,
          langName: lang.name,
          langNative: lang.nativeName,
          title: srv.title,
          description: srv.desc,
          path: lang.path
        });
      }
    });

    // 3. MICE Destinations in this language
    const destList = content.destinations || [];
    destList.forEach((dest, idx) => {
      const destHaystack = normalizeMultiLangText(
        `${dest.city} ${dest.tag} ${dest.desc} ${lang.name} ${lang.nativeName}`
      );
      if (!q || destHaystack.includes(q)) {
        destinations.push({
          id: `${lang.code}-dest-${idx}`,
          type: 'destination',
          langCode: lang.code,
          langFlag: lang.flag,
          langName: lang.name,
          langNative: lang.nativeName,
          title: `${dest.city} — ${dest.tag}`,
          description: dest.desc,
          path: dest.slug ? `/sehirler/${dest.slug}` : lang.path,
          portalPath: lang.path
        });
      }
    });
  });

  return {
    languagePortals,
    solutions: solutions.slice(0, 24),
    services: services.slice(0, 18),
    destinations: destinations.slice(0, 16)
  };
}

