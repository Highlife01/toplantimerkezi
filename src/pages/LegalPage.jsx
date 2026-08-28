import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SectionTitle from '../components/common/SectionTitle';
import { updatePageSeo } from '../services/seoService';
import { ShieldCheck, FileText, Lock, Cookie } from 'lucide-react';

export default function LegalPage() {
  const { type } = useParams();
  const currentType = type || 'kvkk';

  useEffect(() => {
    updatePageSeo({
      title: 'Yasal Bilgilendirme & KVKK Politikası | Toplantı Merkezi',
      description: 'Toplantı Merkezi KVKK aydınlatma metni, gizlilik politikası, çerez politikası ve kullanım koşulları.',
      canonicalUrl: `https://www.toplantimerkezi.com.tr/yasal/${currentType}`
    });
    window.scrollTo(0, 0);
  }, [currentType]);

  return (
    <div className="pt-28 pb-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-8">
          <Link to="/" className="hover:text-amber-700">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-amber-800 font-bold">Yasal Bilgilendirme</span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm text-xs font-bold">
          {[
            { id: 'kvkk', label: 'KVKK Aydınlatma Metni', icon: ShieldCheck },
            { id: 'gizlilik', label: 'Gizlilik Politikası', icon: Lock },
            { id: 'cerez', label: 'Çerez (Cookie) Politikası', icon: Cookie },
            { id: 'kullanim', label: 'Kullanım Koşulları', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const active = currentType === tab.id;
            return (
              <Link
                key={tab.id}
                to={`/yasal/${tab.id}`}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition ${
                  active 
                    ? 'gold-gradient-bg text-slate-950 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Content Box */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-md text-slate-700 text-sm leading-relaxed space-y-6">
          {currentType === 'kvkk' && (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-slate-900 font-display">
                6698 Sayılı KVKK Kapsamında Aydınlatma Metni
              </h1>
              <p>
                Toplantı Merkezi Kurumsal Organizasyon A.Ş. (“Toplantı Merkezi”) olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca veri sorumlusu sıfatıyla, kurumsal müşterilerimize, temsilcilerine ve ziyaretçilerimize ait kişisel verilerin güvenliğini en üst düzeyde sağlamaktayız.
              </p>
              <h3 className="text-base font-bold text-slate-900 pt-2">1. İşlenen Kişisel Veriler ve İşleme Amaçları</h3>
              <p>
                Web sitemizdeki teklif formları, WhatsApp hattı ve çağrı merkezi üzerinden toplanan ad, soyad, firma adı, ünvan, kurumsal telefon ve e-posta verileri; kurumsal organizasyon ve etkinlik fiyat tekliflerinin hazırlanması, müşteri ilişkileri yönetimi (CRM) ve sözleşme süreçlerinin yürütülmesi amacıyla işlenmektedir.
              </p>
              <h3 className="text-base font-bold text-slate-900 pt-2">2. Kişisel Verilerin Aktarımı</h3>
              <p>
                Kişisel verileriniz, kanunen yetkili kamu kurumları ve organizasyonun ifası için zorunlu olan anlaşmalı otel, konaklama ve yetkili taşımacılık acentaları dışında hiçbir üçüncü tarafla ticari amaçla paylaşılmaz.
              </p>
            </div>
          )}

          {currentType === 'gizlilik' && (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-slate-900 font-display">Gizlilik Politikası</h1>
              <p>
                Toplantı Merkezi, kullanıcılarının ve iş ortaklarının gizlilik haklarına azami saygıyı gösterir. Web sitemiz üzerinden ilettiğiniz kurumsal bütçe, katılımcı sayısı ve etkinlik konsept bilgileri ticari sır kapsamında gizli tutulmaktadır.
              </p>
            </div>
          )}

          {currentType === 'cerez' && (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-slate-900 font-display">Çerez (Cookie) Politikası</h1>
              <p>
                Web sitemizde gezinme deneyiminizi optimize etmek, dil tercihlerinizi hatırlamak ve sayfa performans analizlerini gerçekleştirmek amacıyla zorunlu ve analitik çerezler kullanılmaktadır. Tarayıcı ayarlarınız üzerinden çerez tercihlerinizi dilediğiniz zaman değiştirebilirsiniz.
              </p>
            </div>
          )}

          {currentType === 'kullanim' && (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-slate-900 font-display">Kullanım Koşulları</h1>
              <p>
                www.toplantimerkezi.com.tr adresinde yer alan tüm görsel, metin, marka ve tasarım öğeleri telif haklarıyla korunmaktadır. Yazılı izin olmaksızın kısmen veya tamamen kopyalanamaz veya çoğaltılamaz.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
