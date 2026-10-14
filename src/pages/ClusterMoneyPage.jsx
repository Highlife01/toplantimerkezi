import React, { useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { SEO_CLUSTERS, TOPIC_HUBS } from '../data/seoClustersData';
import { PROMINENT_CITIES } from '../data/citiesData';
import UrgentEventBanner from '../components/common/UrgentEventBanner';
import { updatePageSeo } from '../services/seoService';
import { analytics } from '../services/analyticsService';
import { 
  Sparkles, CheckCircle2, MapPin, Users, 
  HelpCircle, ArrowRight, BookOpen
} from 'lucide-react';

const CLUSTER_OPERATIONAL_GUIDES = {
  bayi: {
    cityServiceSlug: 'bayi-toplantisi',
    planningTitle: 'Bayi Toplantısı Nasıl Planlanır? (Adım Adım Operasyon)',
    planningIntro: 'Başarılı bir bayi toplantısı planlaması, etkinliğin gerçekleşeceği tarihten en az 2–4 ay önce başlatılmalıdır. İlk adımda katılımcı sayısı, konaklama ihtiyacı ve hedef lokasyon (Antalya, İstanbul, İzmir veya bölgesel merkezler) netleştirilir.',
    steps: [
      { name: 'İhtiyaç Analizi ve Bütçe Çerçevesinin Çıkarılması', text: 'Bayi sayısı, oda dağılımı (single/double) ve hedef destinasyon belirlenerek kalem bazlı bütçe simülasyonu hazırlanır.' },
      { name: 'Kolonsuz ve Yüksek Tavanlı 5 Yıldızlı Kongre Oteli Rezervasyonu', text: 'Tavan yüksekliği en az 4.5m olan kolonsuz ana salon, B2B fuaye alanı ve workshop odaları tahsis edilir.' },
      { name: '3D Sahne, Dev LED Ekran ve Podyum Tasarımı', text: 'P2.6 yüksek kontrastlı LED ekranlar, Watchout reji, sahne podyumu ve fuaye B2B stantları 3D olarak modellenir.' },
      { name: 'Uçak, VIP Havalimanı Karşılama ve Ring Transfer Lojistiği', text: '81 ilden gelen bayilerin uçuş koordinasyonu, havalimanı karşılama deskleri ve otele VIP transferi yönetilir.' },
      { name: 'Gündüz Toplantı Oturumları ve İnteraktif Sunum Akışı', text: 'Vizyon sunumları, yeni ürün lansmanları, konuşmacı prompter/timer yönetimi ve B2B sipariş masaları koordine edilir.' },
      { name: 'Akşam Gala Yemeği, Ünlü Sanatçı ve Plaket/Ödül Töreni', text: 'Kırmızı halı, özel banket menüsü, kıdem/ciro ödül töreni ve A sınıfı sanatçı/orkestra sahne şovu gerçekleştirilir.' }
    ],
    venueCriteria: 'Bayi toplantılarında salonun mimari yapısı kritik önemdedir. Sahneye araç veya makine çıkarılacaksa kapı giriş ölçüleri (min. 3.5m) ve yük asansörleri denetlenir. Kolonsuz salonlar ve geniş fuaye alanları tercih edilir.',
    costFactors: 'Bayi toplantısı bütçesi temel olarak 7 ana maliyet kaleminden oluşur: Otel konaklama/salon kirası, catering & banket menüleri, sahne & dekor, LED ekran & reji, profesyonel ses & ışık sistemleri, transfer/uçak biletleri ve sanatçı/sunucu kaşeleri. Toplantı Merkezi olarak tüm bu kalemleri şeffaf bütçe tablosunda sunuyoruz.',
    faqs: [
      { q: 'Bayi toplantısı nasıl organize edilir?', a: 'Öncelikle katılımcı sayısı, tarih ve konaklama tercihi belirlenir. Ardından otel salonu opsiyonlanır, sahne ve LED ekran tasarımı tamamlanır, ulaşım-transfer planlaması yapılır ve gala gecesi sanatçı/ödül programı kurgulanır.' },
      { q: 'Bayi toplantısı kaç gün sürer?', a: 'Kurumsal bayi toplantıları genellikle 2 gün 1 gece veya 3 gün 2 gece konaklamalı olarak düzenlenir. Gündüz iş ve strateji oturumları, akşam ise gala gecesi yapılır.' },
      { q: 'Bayi toplantısı için hangi şehirler tercih edilir?', a: 'Antalya (Belek, Kundu, Kemer), İstanbul, İzmir (Çeşme), Bursa, Adana ve Muğla (Bodrum) en çok tercih edilen destinasyonlardır.' },
      { q: 'Bayi toplantısı maliyeti ne kadar?', a: 'Maliyet kişi sayısı, otel sınıfı (5 yıldız), sahne prodüksiyonunun büyüklüğü ve sanatçı tercihine göre değişir. Toplantı Merkezi 2 saat içinde şeffaf kalem kalem bütçe sunar.' },
      { q: '100 kişilik bayi toplantısı nasıl planlanır?', a: '100 kişilik gruplar için 150-200 m² kolonsuz salon, P2.6 yüksek çözünürlüklü LED ekran, profesyonel ses sistemi ve VIP akşam yemeği idealdir.' },
      { q: '500 kişilik bayi toplantısı nasıl organize edilir?', a: '500 kişi için en az 600-800 m² ana salon, 3-4 adet workshop odası, fuaye kayıt masaları, çift LED ekran reji ve geniş gala sahnesi planlanır.' },
      { q: 'Bayi toplantısı için otel nasıl seçilir?', a: 'Havalimanına yakınlık, salon tavan yüksekliği (min. 4.5m), kolonsuz mimari, oda kalitesi ve teknik altyapı kapasitesine göre seçilir.' },
      { q: 'Bayi toplantısı için ne kadar önce planlama yapılmalıdır?', a: 'En iyi otel ve salon opsiyonlarını uygun fiyatla garantilemek için en az 2 ila 4 ay öncesinden planlamaya başlanması önerilir.' }
    ]
  },
  toplanti: {
    cityServiceSlug: 'sirket-toplantilari',
    planningTitle: 'Kurumsal Şirket ve Yönetim Toplantısı Nasıl Planlanır?',
    planningIntro: 'Verimli ve sıfır aksaklıklı bir şirket toplantısı için salon akustiği, sunum teknolojileri ve zaman yönetimi mühendislik disipliniyle kurgulanmalıdır.',
    steps: [
      { name: 'Toplantı Amacı, Katılımcı Sayısı ve Oturma Düzeni Analizi', text: 'Katılımcı etkileşimine göre U-düzeni, sınıf düzeni, yuvarlak masa (kabare) veya tiyatro oturma planı belirlenir.' },
      { name: 'Akustik Yalıtımlı 5 Yıldızlı Otel veya Toplantı Salonu Tahsisi', text: 'Ulaşımı kolay, gün ışığı alan veya tam karartma yapılabilen, yüksek tavanlı kurumsal toplantı salonları opsiyonlanır.' },
      { name: 'P2 LED Ekran, Ses Sistemi ve Delege Mikrofon Kurulumu', text: 'Tablo ve grafiklerin net okunmasını sağlayan LED ekranlar, kürsü/yaka mikrofonları ve konuşmacı timer ekranları kurulur.' },
      { name: 'Kayıt, Coffee Break, Öğle Yemeği ve Saha Moderasyonu', text: 'QR kodlu yaka kartı karşılama, taze barista coffee break molaları ve kurumsal öğle yemeği dakika dakika yönetilir.' }
    ],
    venueCriteria: 'Şirket ve yönetim toplantılarında salonun ses yalıtımı, yedekli simetrik fiber internet (Wi-Fi) kapasitesi, havalandırma debisi ve fuaye ikram alanı genişliği en kritik seçim kriterleridir.',
    costFactors: 'Toplantı bütçesi; yarım gün veya tam gün salon kullanım paketi (kişi başı coffee break ve öğle yemeği dahil), LED ekran m² boyutu, ses-ışık sistemi, simultane tercüme ve konaklama/transfer kalemlerine göre şeffaf olarak hesaplanır.',
    faqs: [
      { q: 'Şirket toplantısı için projeksiyon mu yoksa LED ekran mı tercih edilmeli?', a: 'Salon ışıklarını kapatmadan keskin kontrast elde etmek ve konuşmacının aydınlıkta kalmasını sağlamak için P2/P2.6 LED ekranlar kurumsal toplantılarda standart olarak tercih edilir.' },
      { q: 'Yönetim kurulu toplantılarında gizlilik nasıl sağlanır?', a: 'Ses yalıtımlı VIP boardroom salonlar, şifreli yerel sunum ağı, frekans korumalı dijital delege mikrofonları ve NDA imzalı teknik ekip ile tam bilgi güvenliği sağlanır.' },
      { q: 'Hibrit (yüz yüze + online) şirket toplantısı altyapısı kuruyor musunuz?', a: 'Evet; 4K PTZ kameralar, dijital ses mikseri ve canlı yayın reji masamızla Zoom, Teams veya özel kapalı devre platformlara çift yönlü kesintisiz bağlantı sağlıyoruz.' }
    ]
  },
  kongre: {
    cityServiceSlug: 'kongre-konferans',
    planningTitle: 'PCO Standartlarında Kongre ve Konferans Nasıl Yönetilir?',
    planningIntro: 'Ulusal ve uluslararası kongreler, zirveler ve sempozyumlar; çoklu paralel salonların, yüzlerce konuşmacının ve sponsorluk alanlarının milimetrik senkronizasyonunu gerektirir.',
    steps: [
      { name: 'Kongre Takvimi, Ana Salon ve Paralel Komisyon Salonları Planı', text: 'Bilimsel veya sektörel oturum sayısına göre ana oditoryum ve paralel breakout salonlarının kapasite eşleştirmesi yapılır.' },
      { name: 'Dijital Kayıt, QR Akreditasyon ve Speaker Ready Room Kurulumu', text: 'Hızlı yaka kartı baskı deskleri, turnike geçiş kontrolü ve tüm salonlara ağ üzerinden bağlı sunum kontrol odası kurulur.' },
      { name: 'ISO Standartlarında Simultane Tercüme ve Çoklu Salon Rejisi', text: 'Ses yalıtımlı tercüman kabinleri, kızılötesi kulaklık dağıtımı, e-poster kioskları ve canlı yayın reji masaları devreye alınır.' },
      { name: 'Sponsorluk Fuayesi, Stant İnşası ve Gala/Kokteyl Operasyonu', text: 'Sponsor firmaların stant kurulumları, B2B networking alanları, açılış kokteyli ve kongre gala yemeği uçtan uca yönetilir.' }
    ],
    venueCriteria: 'Kongre ve zirve mekânlarında ana salonun yanı sıra en az 4–10 adet paralel toplantı odası, geniş stant/fuaye alanı, yüksek elektrik yük kapasitesi ve binlerce kişiyi aynı anda ağırlayabilecek banket mutfağı bulunmalıdır.',
    costFactors: 'Kongre maliyetleri; salon tahsis süresi, paralel salon sayısı, simultane çeviri dili adedi, kayıt/akreditasyon yazılımı, basılı/dijital materyaller, stant kurulumları ve katılımcı yemek paketlerine göre kalem kalem bütçelenir.',
    faqs: [
      { q: 'Çok salonlu kongrelerde konuşmacı sunumları nasıl yönetilir?', a: 'Speaker Ready Room (Sunum Kontrol Merkezi) sistemiyle tüm konuşmacıların sunumları oturumdan önce teslim alınır, kontrol edilir ve yerel ağ üzerinden ilgili salonun kürsüsüne otomatik aktarılır.' },
      { q: 'Uluslararası konferanslarda simultane tercüme hizmeti nasıl verilir?', a: 'ISO 4043 standartlarında ses yalıtımlı kabinler, yeminli konferans tercümanları ve dijital kızılötesi kulaklık alıcıları ile aynı anda 16 dile kadar çeviri sağlanır.' },
      { q: 'Kongre sponsorluk stantlarını ve fuaye alanını kuruyor musunuz?', a: 'Evet; 3D fuaye yerleşim planı, modüler veya özel ahşap sponsor stantları, alınlık baskıları ve stant elektrik/LED ekran kurulumlarını anahtar teslim yapıyoruz.' }
    ]
  },
  etkinlik: {
    cityServiceSlug: 'kurumsal-piknik',
    planningTitle: 'Kurumsal Etkinlik, Piknik ve Gala Süreci Nasıl Kurgulanır?',
    planningIntro: 'yüzlerce veya binlerce çalışanı ve ailelerini bir araya getiren kurumsal piknik, aile günü, lansman ve gala gecelerinde saha lojistiği ve İSG tedbirleri en kritik başarı faktörüdür.',
    steps: [
      { name: 'Konsept Tasarım ve Kapasiteye Uygun Alan/Salon Tahsisi', text: 'Katılımcı sayısına göre özel mesire/festival alanı, fabrika sahası veya 5 yıldızlı balo salonu tahsis edilerek yerleşim krokisi çizilir.' },
      { name: 'Kuyruksuz Catering, Barbekü İstasyonları veya Banket Menüsü', text: 'Açık havada her 200 kişiye bir barbekü/sokak lezzeti adası; kapalı galalarda ise VIP servisli kurumsal banket menüsü planlanır.' },
      { name: 'Sahne, Konser/DJ, Oyun Parkurları ve Teknik Prodüksiyon', text: 'Festival sahnesi, line-array ses kuleleri, şişme oyun parkurları, moderatörlü takım yarışmaları ve sanatçı performansı kurulur.' },
      { name: 'Ulaşım, Yedekli Jeneratör, Güvenlik ve Ambulans Yönetimi', text: 'Personel servis araçları, sessiz jeneratörler, mobil VIP WC üniteleri, özel güvenlik ve doktorlu acil yardım ambulansı sahada hazır tutulur.' }
    ],
    venueCriteria: 'Açık hava piknik ve festival alanlarında otopark kapasitesi, ağaçlık gölge oranı, düz çim zemin ve rüzgar/yağmur B-planı çadır altyapısı; gala ve lansmanlarda ise yüksek tavan ve sahne görüş açısı aranır.',
    costFactors: 'Etkinlik bütçesi; kişi başı ikram/barbekü menüsü, alan tahsis bedeli, şişme oyun ve aktivite parkuru sayısı, sahne-ses-LED büyüklüğü, sanatçı/sunucu kaşesi ve jeneratör/ambulans/transfer kalemlerinden oluşur.',
    faqs: [
      { q: 'Kalabalık şirket pikniklerinde yemek kuyruğu nasıl önlenir?', a: 'Katılımcı sayısına göre alanda simetrik dağıtılmış çoklu barbekü ve içecek istasyonları kurulur; 5.000 kişilik pikniklerde dahi sıcak yemek servisi 15 dakika içinde tamamlanır.' },
      { q: 'Fabrika sahası içinde açılış, lansman veya aile günü yapılabilir mi?', a: 'Evet; fabrika bahçesi veya üretim hangarlarını podyum zemin kaplama, dev pagoda çadırlar, akustik ses ve LED ekranlarla 5 yıldızlı etkinlik alanına dönüştürüyoruz.' },
      { q: 'Kurumsal piknik ve açık hava etkinliklerinde sağlık ve güvenlik önlemleri nelerdir?', a: 'Etkinlik boyunca tam teşekküllü acil yardım ambulansı, nöbetçi hekim/paramedik, 5188 sayılı kanuna uygun özel güvenlik ekibi ve oyun parkuru gözetmenleri görev yapar.' }
    ]
  },
  kamu: {
    cityServiceSlug: 'kamu-protokol-organizasyonlari',
    planningTitle: 'Kamu ve Resmî Protokol Törenleri Nasıl Yönetilir?',
    planningIntro: 'Bakanlıklar, valilikler, belediyeler, odalar ve borsalar için düzenlenen resmi törenlerde devlet protokol kurallarına ve güvenlik mevzuatına %100 uyum esastır.',
    steps: [
      { name: 'Protokol Hiyerarşisi, Oturma Düzeni ve Güvenlik Planlaması', text: 'Devlet protokol listesine göre numaralı koltuk yerleşimi, VIP dinlenme salonu, giriş-çıkış koridorları ve güvenlik bariyerleri planlanır.' },
      { name: 'İklimlendirmeli Protokol Çadırı, Sahne ve Bayrak Düzeni', text: 'Türk Bayrağı Kanunu ve protokol tüzüğüne uygun bayrak/flama sıralaması, protokol tribünü, resmi kürsü ve LED ekranlar kurulur.' },
      { name: 'Canlı Yayın Frekans Dağıtımı (Multibox) ve Basın Tribünü', text: 'Ulusal ve yerel basın kameraları için yükseltilmiş basın platformu, ses multibox dağıtıcıları ve kesintisiz uydu/fiber yayın altyapısı sağlanır.' },
      { name: 'Kurdele Kesimi, Senkronize Buton Töreni ve Resmi Takdim', text: 'Protokol sunucusu anonsları, temel atma buton mekanizması veya açılış kurdele merasimi saniye saniye provalı olarak icra edilir.' }
    ],
    venueCriteria: 'Kamu ve protokol organizasyonlarında tören alanının güvenlik çemberine uygunluğu, makam araçları yanaşma ve tahliye koridoru, helikopter pisti veya ana arter bağlantısı ve yedekli enerji altyapısı denetlenir.',
    costFactors: 'Protokol organizasyonu bütçesi; protokol ve halk çadırı m² alanı, zemin podyum ve halı kaplama, LED ekran ve ses kuleleri, multibox/canlı yayın rejisi, bariyer ve akreditasyon sistemlerine göre resmi şartnameye uygun hazırlanır.',
    faqs: [
      { q: 'Devlet protokolü oturma düzeni ve hitap sırası kim tarafından planlanır?', a: 'Toplantı Merkezi’nin kamu ve mülki idare protokolünde deneyimli saha direktörleri, ilgili kurumun protokol müdürlüğüyle koordineli olarak tüm oturma krokisini ve anons akışını hazırlar.' },
      { q: 'Şantiye veya açık arazide temel atma ve açılış töreni nasıl kurulur?', a: 'Ham şantiye zemini çelik konstrüksiyon podyum ve protokol halısıyla kaplanır; iklimlendirmeli kubbeli çadırlar, senkronize temel atma butonu, LED ekranlar ve mobil VIP WC/jeneratör sistemleri anahtar teslim kurulur.' },
      { q: 'Kamu kurumları ve odalar için resmi ihale/şartname formatında teklif veriyor musunuz?', a: 'Evet; tüm teknik ekipman ve hizmet kalemlerimizi kamu satınalma ve doğrudan temin/ihale şartnamelerine uygun teknik birim ölçülerle 2 saat içinde resmi teklif olarak sunuyoruz.' }
    ]
  }
};

export default function ClusterMoneyPage({ onOpenQuoteModal }) {
  const { pageSlug } = useParams();
  const location = useLocation();
  const rawPath = location.pathname.replace(/^\/|\/$/g, '');

  // Find page across all 5 clusters
  let matchedPage = null;
  let matchedCluster = null;

  for (const cluster of SEO_CLUSTERS) {
    const found = cluster.pages.find(p => p.slug === pageSlug || p.slug === rawPath);
    if (found) {
      matchedPage = found;
      matchedCluster = cluster;
      break;
    }
  }

  // Fallback to primary if not explicitly matching
  if (!matchedPage) {
    matchedCluster = SEO_CLUSTERS[0];
    matchedPage = matchedCluster.pages[0];
  }

  const clusterGuide = CLUSTER_OPERATIONAL_GUIDES[matchedCluster.id] || CLUSTER_OPERATIONAL_GUIDES.toplanti;
  const relatedHub = TOPIC_HUBS.find(h => h.relatedCluster === matchedCluster.id) || TOPIC_HUBS[0];
  const pageFaqs = matchedPage.faqs || clusterGuide.faqs;

  useEffect(() => {
    updatePageSeo({
      title: matchedPage.seoTitle || `${matchedPage.title} | Toplantı Merkezi`,
      description: matchedPage.metaDesc,
      canonicalUrl: `https://www.toplantimerkezi.com.tr/${matchedPage.slug}`,
      breadcrumbs: [
        { name: 'Ana Sayfa', url: '/' },
        { name: matchedCluster.name, url: `/${matchedCluster.primarySlug}` },
        { name: matchedPage.title, url: `/${matchedPage.slug}` }
      ],
      faqs: pageFaqs,
      howTo: {
        name: `${matchedPage.title} Nasıl Planlanır?`,
        description: clusterGuide.planningIntro,
        totalTime: 'PT2H',
        steps: clusterGuide.steps
      },
      schemaType: 'Service',
      schemaData: {
        serviceType: matchedPage.title,
        name: `${matchedPage.title} - Toplantı Merkezi`,
        category: matchedCluster.name,
        provider: {
          '@type': 'Organization',
          '@id': 'https://www.toplantimerkezi.com.tr/#organization',
          name: 'Toplantı Merkezi',
          url: 'https://www.toplantimerkezi.com.tr',
          telephone: '+90 532 055 09 45'
        },
        description: matchedPage.aiDirectAnswer,
        areaServed: {
          '@type': 'Country',
          name: 'Turkey'
        },
        audience: {
          '@type': 'BusinessAudience',
          audienceType: 'B2B Kurumsal Şirketler, Holdingler, Bayi Ağları ve Kamu Kurumları'
        }
      }
    });
    analytics.serviceView(matchedPage.slug, matchedPage.title);
    window.scrollTo(0, 0);
  }, [matchedPage, matchedCluster, clusterGuide, pageFaqs]);

  return (
    <div className="pt-28 pb-20 bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-amber-800 font-medium">Ana Sayfa</Link>
          <span>/</span>
          <Link to={`/${matchedCluster.primarySlug}`} className="hover:text-amber-800 text-slate-500">{matchedCluster.name}</Link>
          <span>/</span>
          <span className="text-amber-900 font-bold">{matchedPage.title}</span>
        </nav>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 md:p-16 border border-slate-200 shadow-xl mb-12 relative overflow-hidden">
          <div className="max-w-3xl space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping"></span>
              <span>81 İlde Türkiye Geneli Kurumsal Çözüm • Tek Merkezden Yönetim</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-950 font-display leading-[1.15]">
              {matchedPage.h1}
            </h1>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal overview-text">
              {matchedPage.metaDesc}
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  analytics.quoteFormStart(matchedPage.title, 'Türkiye Geneli');
                  onOpenQuoteModal({ initialOrgType: matchedPage.title });
                }}
                className="px-7 py-4 rounded-2xl gold-gradient-bg text-slate-950 font-extrabold text-sm sm:text-base shadow-md hover:scale-105 transition flex items-center gap-2"
              >
                <Sparkles size={18} />
                <span>Teklif Alın & Planlayalım</span>
                <ArrowRight size={18} />
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-600 font-bold bg-slate-100 px-4 py-3 rounded-xl border border-slate-200">
                <Users size={16} className="text-amber-700" />
                <span>Hedef Katılımcı: {matchedPage.targetAttendees}</span>
              </div>
            </div>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none hidden lg:block"></div>
        </div>

        {/* AI DIRECT ANSWER BLOCK (Entity Optimized for ChatGPT, Gemini, Copilot, Perplexity) */}
        <div
          data-geo-answer="true"
          className="bg-amber-500/10 border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 mb-12 shadow-sm"
        >
          <div className="flex items-center gap-2.5 text-xs font-extrabold text-amber-900 uppercase tracking-wider mb-2">
            <Sparkles size={16} className="text-amber-700" />
            <span>AI Doğrudan Bilgi Bloğu (Semantic Entity Definition)</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-950 font-display mb-2">
            {matchedPage.title} Nedir ve Nasıl Yönetilir?
          </h2>
          <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
            {matchedPage.aiDirectAnswer}
          </p>
        </div>

        {/* 2-Column Main Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Main Money Content */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Detailed Sub-Types */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
              <h2 className="text-xl font-bold text-slate-950 font-display">
                {matchedPage.title} Kapsamında Yönettiğimiz Formatlar
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {matchedPage.subTypes.map((sub, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-amber-700 shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-slate-900">{sub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 01. Step-by-Step Operational Planning */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
              <h2 className="text-xl font-bold text-slate-950 font-display">
                {clusterGuide.planningTitle}
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {clusterGuide.planningIntro}
              </p>
              <div className="space-y-3 pt-2">
                {clusterGuide.steps.map((step, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
                    <span className="w-7 h-7 rounded-xl gold-gradient-bg text-slate-950 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      0{idx + 1}
                    </span>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">{step.name}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 02. Venue & Technical Selection Criteria */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
              <h2 className="text-xl font-bold text-slate-950 font-display">
                {matchedPage.title} İçin Mekân & Teknik Seçim Kriterleri
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {clusterGuide.venueCriteria}
              </p>
            </div>

            {/* 03. Cost & Budgeting Factors */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
              <h2 className="text-xl font-bold text-slate-950 font-display">
                {matchedPage.title} Maliyeti Neye Göre Belirlenir?
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {clusterGuide.costFactors}
              </p>
            </div>

            {/* 04. City + Service Dynamic SEO Internal Linking Matrix */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-950 font-display">
                    81 İlde {matchedPage.title} Operasyon Merkezlerimiz
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Yerel teknik depo, anlaşmalı kongre otelleri ve saha direktörlerimizle öne çıkan MICE şehirlerimiz:
                  </p>
                </div>
                <Link to="/sehirler" className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1">
                  <span>81 İlin Tamamı</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-2">
                {PROMINENT_CITIES.slice(0, 12).map(city => (
                  <Link
                    key={city.slug}
                    to={`/sehirler/${city.slug}/${clusterGuide.cityServiceSlug}`}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <MapPin size={13} className="text-amber-700 shrink-0" />
                      <span className="font-bold text-xs text-slate-900 group-hover:text-amber-950 truncate">
                        {city.name}
                      </span>
                    </div>
                    <ArrowRight size={12} className="text-slate-400 group-hover:text-amber-700 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Comprehensive FAQ Section */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-950 font-display flex items-center gap-2">
                <HelpCircle size={22} className="text-amber-700" />
                <span>{matchedPage.title} Sıkça Sorulan Sorular (SSS)</span>
              </h2>

              <div className="space-y-4">
                {pageFaqs.map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <h3 className="text-sm font-bold text-slate-900">{faq.q}</h3>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sticky Conversion Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-amber-500/60 shadow-xl space-y-6 sticky top-28">
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider block">Hemen Fiyat Alın</span>
                <h3 className="text-xl font-bold text-slate-950 font-display">
                  {matchedPage.title} Bütçesi Hesaplayalım
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Şehir ve kişi sayınızı girin; 2 saat içinde otel, sahne, LED ve catering dahil resmi teklifinizi iletelim.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 size={15} className="text-emerald-700" />
                  <span>81 İlde Geçerli Sabit Fiyat Garantisi</span>
                </div>
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 size={15} className="text-emerald-700" />
                  <span>Tek Sözleşme & Şeffaf Bütçeleme</span>
                </div>
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 size={15} className="text-emerald-700" />
                  <span>2 Saatte Resmi PDF Teklif Çıktısı</span>
                </div>
              </div>

              <button
                onClick={() => {
                  analytics.quoteFormStart(matchedPage.title, 'Sidebar');
                  onOpenQuoteModal({ initialOrgType: matchedPage.title });
                }}
                className="w-full py-4 rounded-2xl gold-gradient-bg text-slate-950 font-extrabold text-sm shadow-md hover:scale-105 transition flex items-center justify-center gap-2"
              >
                <Sparkles size={18} />
                <span>Teklif Formunu Başlat</span>
              </button>

              {/* Topic Hub Guide Link */}
              {relatedHub && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-amber-900 uppercase tracking-wider">
                    <BookOpen size={13} />
                    <span>Kapsamlı Planlama Kılavuzu</span>
                  </div>
                  <Link
                    to={`/rehber/${relatedHub.slug}`}
                    className="block text-xs font-bold text-slate-900 hover:text-amber-800 transition leading-snug"
                  >
                    {relatedHub.title} &rarr;
                  </Link>
                </div>
              )}

              {/* Related Pages in this Cluster */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  İlgili Sayfalar & Modüller:
                </h4>
                <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                  {matchedCluster.pages.filter(p => p.slug !== matchedPage.slug).map(p => (
                    <Link
                      key={p.slug}
                      to={`/${p.slug}`}
                      className="block p-2 rounded-xl text-xs text-slate-700 hover:text-amber-900 hover:bg-amber-50/50 font-medium transition"
                    >
                      • {p.title}
                    </Link>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      <UrgentEventBanner onOpenQuoteModal={onOpenQuoteModal} />
    </div>
  );
}
