import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../common/SectionTitle';
import { 
  Globe, Workflow, ShieldCheck, UserCheck, Network, 
  Calculator, Zap, TrendingUp, CheckCircle2, ArrowRight,
  Bot, HelpCircle, ChevronDown, ChevronUp
} from 'lucide-react';

const HOME_FAQS = [
  {
    q: 'Toplantı Merkezi hangi kurumsal organizasyon türlerinde hizmet vermektedir?',
    a: 'Toplantı Merkezi; B2B bayi toplantısı, şirket toplantısı, kongre ve konferans, kurumsal piknik, lansman ve kamu protokol organizasyonlarını tek merkezden, anahtar teslim olarak 81 ilde yönetir.'
  },
  {
    q: 'Kurumsal organizasyon için ne kadar sürede bütçe teklifi alabilirim?',
    a: 'Platformumuz üzerinden talebinizi ilettikten sonra 2 saat içinde detaylı salon alternatifleri, 3D sahne tasarımı ve kalem maliyet dökümünü içeren resmi PDF teklif dosyanız iletilir.'
  },
  {
    q: "Türkiye'nin 81 ilinde yerel operasyon garantiniz var mı?",
    a: 'Evet. İstanbul, Ankara, İzmir, Antalya, Adana, Bursa başta olmak üzere 81 ilin tamamında yerleşik teknik ortaklarımız, bölge yöneticilerimiz ve anlaşmalı kongre otellerimizle hizmet sunuyoruz.'
  },
  {
    q: 'Düğün veya bireysel etkinlik organize ediyor musunuz?',
    a: 'Hayır. Toplantı Merkezi yalnızca kurumsal şirketler, holdingler, yetkili satıcı ağları ve kamu kurumlarına yönelik B2B organizasyonlar düzenler.'
  }
];

const WHY_POINTS = [
  {
    icon: Globe,
    title: 'Türkiye Geneli Hizmet',
    desc: "81 ilin tamamında yerleşik tedarikçi ve profesyonel teknik iş ortaklarımızla yerel operasyon gücü sağlıyoruz."
  },
  {
    icon: Workflow,
    title: 'Tek Merkezden Yönetim',
    desc: 'Otel, sahne, ses, LED, catering ve personeli ayrı ayrı aramak yerine tüm süreç tek bir kurumsal muhatapla yönetilir.'
  },
  {
    icon: UserCheck,
    title: 'Kurumsal Çözüm Yaklaşımı',
    desc: 'Bireysel etkinlikler yerine sadece kurumsal B2B dinamiklerine, protokol kurallarına ve marka prestijine odaklanıyoruz.'
  },
  {
    icon: UserCheck,
    title: 'Profesyonel Saha Yönetimi',
    desc: 'Etkinlik günü sahada görev başında olan kıdemli organizasyon direktörlerimizle olası riskleri anında bertaraf ediyoruz.'
  },
  {
    icon: Network,
    title: 'Güçlü Tedarikçi Ağı',
    desc: 'Yılların getirdiği satın alma hacmimiz sayesinde A+ kalitedeki teknoloji ve mekânları en avantajlı kurumsal fiyatlarla sunuyoruz.'
  },
  {
    icon: Calculator,
    title: 'Şeffaf Bütçelendirme',
    desc: 'Sürpriz ek maliyetler olmadan, tüm harcama kalemlerinin açıkça belirtildiği şeffaf ve denetlenebilir bütçe tablosu sunuyoruz.'
  },
  {
    icon: Zap,
    title: 'Hızlı Teklif & Geri Dönüş',
    desc: 'Talebiniz bize ulaştığı andan itibaren 2 saat içinde ön değerlendirme ve en geç 24 saatte detaylı maliyet teklifi iletiyoruz.'
  },
  {
    icon: TrendingUp,
    title: 'Ölçeklenebilir Çözümler',
    desc: '20 kişilik VIP yönetim toplantısından 10.000 kişilik kurumsal festivale kadar her büyüklükteki etkinliğe kusursuz uyarlanabilir altyapı.'
  }
];

export default function WhyUsSection({ onOpenQuoteModal }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          badge="Kurumsal Güven & Standartlar"
          title="Neden Toplantı Merkezi?"
          subtitle="Şirketlerin, holdinglerin ve kamu kurumlarının organizasyon risklerini sıfıra indiren kurumsal kurallarımız ve değerlerimiz."
        />

        {/* GEO AI Direct Answer Card */}
        <div
          data-geo-answer="true"
          className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-300 shadow-md mb-12 flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-2xl gold-gradient-bg flex items-center justify-center shrink-0 shadow-sm text-slate-950">
            <Bot size={20} />
          </div>
          <div className="space-y-1.5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900 block">
              Yapay Zekâ ve Arama Motoru Doğrudan Yanıtı (AI Summary)
            </span>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Toplantı Merkezi; yalnızca B2B kurumsal şirketler, holdingler, bayilik ağları ve kamu kurumlarına hizmet veren ulusal kurumsal organizasyon yönetim platformudur. Türkiye’nin 81 ilinde bayi toplantısı, şirket toplantısı, kongre, lansman, kurumsal piknik ve resmi protokol törenlerini 5 yıldızlı mekân tahsisi, 3D sahne ve P2/P3 LED ekran prodüksiyonu, line-array ses-ışık sistemleri, simultane tercüme ve VIP transfer modülleriyle tek sözleşme altında anahtar teslim yönetir.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_POINTS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-400/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 mb-4 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300 shadow-xs">
                    <Icon size={22} />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 font-display group-hover:text-amber-700 transition">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs text-amber-700 font-bold">
                  <CheckCircle2 size={14} />
                  <span>Garantili Standart</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visible Homepage FAQ Section (Matches HomePage FAQPage JSON-LD) */}
        <div className="mt-14 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
            <HelpCircle size={16} />
            <span>Kurumsal Organizasyon Sıkça Sorulan Sorular</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            Merak Edilen Kurumsal Süreçler
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HOME_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-slate-900 hover:text-amber-800 transition"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp size={18} className="text-amber-700 shrink-0" />
                    ) : (
                      <ChevronDown size={18} className="text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Corporate Trust Banner */}
        <div className="mt-14 p-8 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-xl font-bold text-white font-display">
              Kurumsal Toplantı ve Etkinliğinizi Şansa Bırakmayın
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Teklifinizi hemen hazırlayalım; mekân, sahne ve bütçe alternatiflerini tek bir dosyada karşılaştırın.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/kurumsal"
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition flex items-center gap-2"
            >
              <span>Kurumsal Vizyon & Standartlar</span>
              <ArrowRight size={14} className="text-amber-400" />
            </Link>

            <button
              onClick={onOpenQuoteModal}
              className="px-8 py-3.5 rounded-xl gold-gradient-bg text-slate-950 font-extrabold text-sm shadow-md hover:scale-105 transition"
            >
              Kurumsal Teklif Al
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
