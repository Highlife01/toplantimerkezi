import React from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../common/SectionTitle';
import { ClipboardList, Compass, FileCheck, Layers, Award, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    title: 'Talebinizi Alıyoruz',
    desc: 'Organizasyonunuzun kapsamını, katılımcı profilini, hedeflenen tarihi ve beklentilerinizi ayrıntılarıyla dinleyip analiz ediyoruz.',
    icon: ClipboardList,
    accent: 'from-amber-500/20 to-amber-500/5'
  },
  {
    num: '02',
    title: 'Planlıyoruz',
    desc: '81 ildeki mekân alternatiflerini, teknik donanımı, sahne ve görsel konsepti, lojistik akışı ve bütçe optimizasyonunu kurguluyoruz.',
    icon: Compass,
    accent: 'from-blue-500/20 to-indigo-500/5'
  },
  {
    num: '03',
    title: 'Teklif Sunuyoruz',
    desc: 'İhtiyaçlarınıza özel, kalem kalem şeffaf maliyetlendirilmiş ve 3D konsept görselleştirmeli profesyonel kurumsal teklifimizi sunuyoruz.',
    icon: FileCheck,
    accent: 'from-emerald-500/20 to-teal-500/5'
  },
  {
    num: '04',
    title: 'Organizasyonu Yönetiyoruz',
    desc: 'Otel, sahne, LED, ses, catering ve hostes gibi tüm tedarikçi ve saha operasyonlarını tek merkezden profesyonelce koordine ediyoruz.',
    icon: Layers,
    accent: 'from-purple-500/20 to-pink-500/5'
  },
  {
    num: '05',
    title: 'Etkinliği Gerçekleştiriyoruz',
    desc: 'Planlanan organizasyonu deneyimli saha direktörlerimiz ve teknik süpervizörlerimizle sıfır aksaklık ve yüksek memnuniyetle hayata geçiriyoruz.',
    icon: Award,
    accent: 'from-amber-600/25 to-yellow-600/10'
  }
];

export default function ProcessSteps({ onOpenQuoteModal }) {
  return (
    <section className="py-20 bg-slate-100/70 border-y border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          badge="Kusursuz Süreç Yönetimi"
          title="Nasıl Çalışıyoruz?"
          subtitle="Talepten sahneye kadar 5 aşamalı profesyonel operasyon disiplinimiz ile kurumsal riskleri sıfıra indiriyoruz."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 relative">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.num}
                className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-amber-400/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl font-extrabold text-slate-300 group-hover:text-amber-600 transition font-display">
                      {step.num}
                    </span>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.accent} border border-slate-200 flex items-center justify-center group-hover:scale-110 transition shadow-xs`}>
                      <Icon size={22} className="text-amber-700" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 font-display">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 group-hover:text-amber-700 font-bold">
                  <span>Aşama {step.num}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onOpenQuoteModal}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl gold-gradient-bg text-slate-950 font-bold text-sm shadow-md hover:scale-105 transition"
          >
            <span>Hemen İlk Adımı Atın & Teklif Alın</span>
            <ArrowRight size={16} />
          </button>

          <Link
            to="/kurumsal"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-xs hover:border-amber-400 transition"
          >
            <span>Kurumsal Standartlarımız</span>
            <ArrowRight size={16} className="text-amber-600" />
          </Link>
        </div>

      </div>
    </section>
  );
}
