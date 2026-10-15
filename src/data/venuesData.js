/**
 * Toplantı Merkezi Doğrulanmış Kamusal Kongre & Fuar Merkezleri Referans Kataloğu
 * Kural: Uydurma otel isimleri, sahte puanlar veya doğrulanmamış kapasite/fiyat verileri kullanılmaz.
 * Yönetim panelinde (/admin) mekânlar doğrudan Firestore 'venues' koleksiyonundan yönetilir.
 */
export const VENUE_TYPES = [
  'Kongre Merkezi',
  '5 Yıldızlı Otel',
  '4 Yıldızlı Otel',
  'Balo & Davet Salonu',
  'Fuar & Sergi Merkezi',
  'Açık Etkinlik & Piknik Alanı',
  'Üniversite & Kamu Oditoryumu'
];

export const VENUES = [
  {
    id: 'v-icec-istanbul',
    name: 'İstanbul Lütfi Kırdar Uluslararası Kongre ve Sergi Sarayı (ICEC)',
    city: 'İstanbul',
    district: 'Şişli / Harbiye',
    address: 'Harbiye Mah. Darülbedai Cad. No:4, 34367 Şişli / İstanbul',
    venueType: 'Kongre Merkezi',
    starRating: null,
    verificationSource: 'ICEC Resmi Teknik Şartname & Salon Planı',
    verifiedAt: '2026-09-01',
    spaceType: 'Kapalı Alan',
    capacity: 2000,
    salonCount: 27,
    parking: '1.000 Araç (Yeraltı Otoparkı)',
    catering: 'Boğaziçi Borsa Restoran & Kurumsal Banket Mutfağı',
    technicalGear: ['Anadolu Oditoryumu Akustik Sistem', 'Simultane Tercüme Kabinleri', 'Yük Asansörü & Truss Askı Noktaları'],
    accessibility: 'Tam engelli erişimi, asansör, rampa ve geniş fuaye girişleri',
    halls: [
      { hallName: 'Anadolu Oditoryumu', areaSqm: 2100, ceilingHeight: '12m', theater: 2000, classroom: null, gala: null, uShape: null, cocktail: null },
      { hallName: 'Rumeli Üst Salon', areaSqm: 2100, ceilingHeight: '7.5m', theater: 1800, classroom: 1000, gala: 1300, uShape: null, cocktail: 2200 }
    ],
    layouts: ['Oditoryum (2.000)', 'Tiyatro (1.800)', 'Banket (1.300)', 'Sınıf (1.000)'],
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    availabilityRecords: [],
    description: 'İstanbul Kongre Vadisi merkezinde yer alan, Anadolu Oditoryumu ve Rumeli Salonu ile uluslararası zirveler, tıp kongreleri ve kurumsal lansmanlara ev sahipliği yapan resmi kongre sarayı.'
  },
  {
    id: 'v-halic-istanbul',
    name: 'Haliç Kongre Merkezi',
    city: 'İstanbul',
    district: 'Beyoğlu / Sütlüce',
    address: 'Sütlüce Mah. İmrahor Cad. No:82, 34445 Beyoğlu / İstanbul',
    venueType: 'Kongre Merkezi',
    starRating: null,
    verificationSource: 'Haliç Kongre Merkezi Resmi Salon Kapasite Tablosu',
    verifiedAt: '2026-09-01',
    spaceType: 'Hibrit (Açık + Kapalı)',
    capacity: 3004,
    salonCount: 5,
    parking: '1.400 Araç',
    catering: 'Kurumsal Banket & Açık Hava İskele İkram Altyapısı',
    technicalGear: ['3.004 Kişilik Haliç Oditoryumu', 'Simultane Kabinler', 'Kıyı Fuaye & Açık Alan Sahne Altyapısı'],
    accessibility: 'Engelli erişimine tam uygun, hemzemin rıhtım ve asansör erişimi',
    halls: [
      { hallName: 'Haliç Salonu (Oditoryum)', areaSqm: 3150, ceilingHeight: '14m', theater: 3004, classroom: null, gala: null, uShape: null, cocktail: null },
      { hallName: 'Sadabad Salonu', areaSqm: 1412, ceilingHeight: '8m', theater: 1200, classroom: 750, gala: 850, uShape: null, cocktail: 1400 }
    ],
    layouts: ['Oditoryum (3.004)', 'Tiyatro (1.200)', 'Banket (850)', 'Sınıf (750)'],
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    availabilityRecords: [],
    description: 'Haliç kıyısında 102.000 m² alan üzerinde kurulu, 3.004 kişilik ana oditoryumu ve açık hava rıhtım fuayesiyle büyük ölçekli bayi buluşmaları ve zirveler için doğrulanmış kongre kompleksi.'
  },
  {
    id: 'v-congresium-ankara',
    name: 'ATO Congresium Kongre ve Sergi Merkezi',
    city: 'Ankara',
    district: 'Çankaya / Söğütözü',
    address: 'Söğütözü Cad. No:1/A, 06510 Çankaya / Ankara',
    venueType: 'Kongre Merkezi',
    starRating: null,
    verificationSource: 'ATO Congresium Resmi Teknik Dokümantasyonu',
    verifiedAt: '2026-09-01',
    spaceType: 'Kapalı Alan',
    capacity: 3107,
    salonCount: 15,
    parking: '900 Araç',
    catering: 'Protokol ve Kongre Banket Servisi',
    technicalGear: ['3.107 Kişilik Oditoryum', '10.000 m² Sergi ve Fuar Alanı', 'VIP Protokol Girişi'],
    accessibility: 'Tam engelli erişimi, protokol asansörleri ve tır yanaşma kapısı',
    halls: [
      { hallName: 'Zelve Oditoryumu', areaSqm: 3200, ceilingHeight: '15m', theater: 3107, classroom: null, gala: null, uShape: null, cocktail: null },
      { hallName: 'Angora Balo Salonu', areaSqm: 1560, ceilingHeight: '7.5m', theater: 1500, classroom: 900, gala: 1100, uShape: null, cocktail: 1600 }
    ],
    layouts: ['Oditoryum (3.107)', 'Tiyatro (1.500)', 'Banket (1.100)', 'Sınıf (900)'],
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    availabilityRecords: [],
    description: 'Başkent Ankara’da kamu zirveleri, uluslararası kongreler ve genel kurullar için 3.107 kişilik oditoryum ve 10.000 m² fuar alanına sahip kongre merkezi.'
  },
  {
    id: 'v-merinos-bursa',
    name: 'Bursa Merinos Atatürk Kongre ve Kültür Merkezi (AKKM)',
    city: 'Bursa',
    district: 'Osmangazi',
    address: 'Merinos Parkı İçi, Osmangazi / Bursa',
    venueType: 'Kongre Merkezi',
    starRating: null,
    verificationSource: 'Bursa Büyükşehir Belediyesi Merinos AKKM Resmi Verileri',
    verifiedAt: '2026-09-01',
    spaceType: 'Kapalı Alan',
    capacity: 1633,
    salonCount: 12,
    parking: '1.100 Araç',
    catering: 'Fuaye ve Banket İkram Alanları',
    technicalGear: ['Osmangazi Oditoryumu (1.633 Kişi)', 'Orhangazi Salonu (813 Kişi)', 'Simultane Çeviri Odaları'],
    accessibility: 'Tam engelli erişimi ve kapalı otopark bağlantısı',
    halls: [
      { hallName: 'Osmangazi Salonu', areaSqm: 1850, ceilingHeight: '14m', theater: 1633, classroom: null, gala: null, uShape: null, cocktail: null },
      { hallName: 'Orhangazi Salonu', areaSqm: 950, ceilingHeight: '10m', theater: 813, classroom: null, gala: null, uShape: null, cocktail: null }
    ],
    layouts: ['Oditoryum (1.633)', 'Oditoryum 2 (813)'],
    image: 'https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    availabilityRecords: [],
    description: 'Güney Marmara sanayi ve otomotiv zirvelerinin merkezi olan, 1.633 ve 813 kişilik iki büyük oditoryuma sahip resmi kongre kompleksi.'
  },
  {
    id: 'v-skm-konya',
    name: 'Selçuklu Kongre Merkezi (SKM)',
    city: 'Konya',
    district: 'Selçuklu',
    address: 'Horozluhan Mah. Yeni İstanbul Cad. No:62, Selçuklu / Konya',
    venueType: 'Kongre Merkezi',
    starRating: null,
    verificationSource: 'Selçuklu Kongre Merkezi Resmi Salon Rehberi',
    verifiedAt: '2026-09-01',
    spaceType: 'Kapalı Alan',
    capacity: 2000,
    salonCount: 18,
    parking: '1.200 Araç',
    catering: 'Balo Salonu Banket & Fuaye İkram Mutfağı',
    technicalGear: ['Anadolu Oditoryumu (2.000 Kişi)', 'Konya Balo Salonu', 'Simultane ve Reji Odaları'],
    accessibility: 'Tam engelli erişimi, geniş fuaye ve asansör altyapısı',
    halls: [
      { hallName: 'Anadolu Oditoryumu', areaSqm: 2200, ceilingHeight: '14m', theater: 2000, classroom: null, gala: null, uShape: null, cocktail: null },
      { hallName: 'Konya Balo Salonu', areaSqm: 1350, ceilingHeight: '8m', theater: 1200, classroom: 750, gala: 900, uShape: null, cocktail: 1400 }
    ],
    layouts: ['Oditoryum (2.000)', 'Tiyatro (1.200)', 'Banket (900)', 'Sınıf (750)'],
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    availabilityRecords: [],
    description: 'İç Anadolu’nun en kapsamlı modern kongre merkezi; 2.000 kişilik oditoryumu ve bölünebilir balo salonlarıyla ulusal kongre ve bayi toplantılarına hizmet verir.'
  },
  {
    id: 'v-cam-piramit-antalya',
    name: 'Antalya Cam Piramit Sabancı Kongre ve Fuar Merkezi',
    city: 'Antalya',
    district: 'Muratpaşa',
    address: 'Sakıp Sabancı Bulvarı, Atatürk Kültür Parkı İçi, Muratpaşa / Antalya',
    venueType: 'Kongre Merkezi',
    starRating: null,
    verificationSource: 'Antalya Büyükşehir Belediyesi Kongre Merkezi Verileri',
    verifiedAt: '2026-09-01',
    spaceType: 'Hibrit (Açık + Kapalı)',
    capacity: 2400,
    salonCount: 5,
    parking: '600 Araç',
    catering: 'Kurumsal Catering & Açık Alan İkram Altyapısı',
    technicalGear: ['Toros Salonu (2.400 Kişi)', 'Kral Yolu Açık Etkinlik Alanı', 'Simultane Sistem'],
    accessibility: 'Hemzemin giriş ve engelli erişimine uygun',
    halls: [
      { hallName: 'Toros Salonu', areaSqm: 2800, ceilingHeight: '22m', theater: 2400, classroom: 1200, gala: 1500, uShape: null, cocktail: 3000 }
    ],
    layouts: ['Tiyatro (2.400)', 'Banket (1.500)', 'Sınıf (1.200)'],
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    availabilityRecords: [],
    description: 'Antalya merkezde 2.400 kişilik kolonsuz ana salonu ve geniş açık etkinlik alanlarıyla ulusal kongre, fuar ve bayi lansmanlarına ev sahipliği yapan merkez.'
  }
];
