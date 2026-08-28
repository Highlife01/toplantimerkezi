import React from 'react';
import SectionTitle from '../common/SectionTitle';
import { 
  Globe, Workflow, ShieldCheck, UserCheck, Network, 
  Calculator, Zap, TrendingUp, CheckCircle2, ArrowRight 
} from 'lucide-react';

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
  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          badge="Kurumsal Güven & Standartlar"
          title="Neden Toplantı Merkezi?"
          subtitle="Şirketlerin, holdinglerin ve kamu kurumlarının organizasyon risklerini sıfıra indiren kurumsal kurallarımız ve değerlerimiz."
        />

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

          <button
            onClick={onOpenQuoteModal}
            className="shrink-0 px-8 py-3.5 rounded-xl gold-gradient-bg text-slate-950 font-extrabold text-sm shadow-md hover:scale-105 transition"
          >
            Kurumsal Teklif Al
          </button>
        </div>

      </div>
    </section>
  );
}
