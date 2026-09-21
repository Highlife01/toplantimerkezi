import React, { useState } from 'react';
import { ALL_81_CITIES } from '../../data/citiesData';
import { storageService } from '../../services/storageService';
import { generateProposalPdf } from '../../services/pdfService';
import { analytics } from '../../services/analyticsService';
import confetti from 'canvas-confetti';
import {
  Building, Calendar, Users, CheckCircle2, ChevronRight, ChevronLeft,
  Sparkles, FileText, Send, Phone, MessageSquare, AlertCircle, Clock, Shield, X
} from 'lucide-react';

const ORG_TYPES = [
  { id: 'Bayi Toplantısı', label: 'Bayi Toplantısı', icon: '🏢', desc: 'Yetkili satıcı & distribütör buluşmaları' },
  { id: 'Şirket Toplantısı', label: 'Şirket Toplantısı', icon: '📊', desc: 'Yönetim, strateji & yıl sonu toplantıları' },
  { id: 'Kamu & Protokol', label: 'Kamu & Protokol', icon: '🏛️', desc: 'Bakanlık, belediye & resmi törenler' },
  { id: 'Kongre & Konferans', label: 'Kongre & Konferans', icon: '🎤', desc: 'Ulusal/uluslararası sektörel zirveler' },
  { id: 'Eğitim & Seminer', label: 'Eğitim & Seminer', icon: '🎓', desc: 'Akademi, sertifika & atölyeler' },
  { id: 'Kurumsal Piknik', label: 'Kurumsal Piknik', icon: '🌳', desc: 'Aile günü, barbekü & takım oyunları' },
  { id: 'Lansman', label: 'Lansman Organizasyonu', icon: '🚀', desc: 'Ürün, marka & fabrika açılışları' },
  { id: 'Gala & Ödül Gecesi', label: 'Gala & Ödül Gecesi', icon: '🏆', desc: 'Kırmızı halı, sanatçı & plaket töreni' },
  { id: 'Personel & Motivasyon', label: 'Personel Etkinliği', icon: '🎯', desc: 'Team building & motivasyon buluşmaları' },
  { id: 'Diğer', label: 'Özel / Diğer Etkinlik', icon: '✨', desc: 'Kurumsal özel organizasyon talepleri' }
];

const REQUIREMENTS_LIST = [
  { id: 'Mekân', label: 'Mekân / Salon Tahsisi' },
  { id: 'Catering', label: 'Catering & İkramlar' },
  { id: 'Sahne', label: 'Sahne Tasarımı & Podyum' },
  { id: 'Ses', label: 'Profesyonel Ses Sistemi' },
  { id: 'Işık', label: 'Robot Işık & Aydınlatma' },
  { id: 'LED ekran', label: 'Dev LED Ekran & Reji' },
  { id: 'Dekorasyon', label: 'Kurumsal Dekor & Masa Düzeni' },
  { id: 'Host/Hostes', label: 'Host & Hostes Personeli' },
  { id: 'Fotoğraf', label: 'Profesyonel Fotoğraf Çekimi' },
  { id: 'Video', label: '4K Video & Drone Aftermovie' },
  { id: 'Güvenlik', label: 'Özel Güvenlik Ekibi' },
  { id: 'Sağlık ekibi', label: 'Doktorlu Acil Ambulans' },
  { id: 'Simultane tercüme', label: 'Simültane Çeviri & Kabin' },
  { id: 'Sanatçı', label: 'Sanatçı / Canlı Orkestra' },
  { id: 'Sunucu', label: 'Kurumsal Profesyonel Sunucu' },
  { id: 'Branding', label: 'Kurumsal Branding & Yaka Kartları' }
];

const BUDGET_OPTIONS = [
  '100.000 TL altı',
  '100.000 – 250.000 TL',
  '250.000 – 500.000 TL',
  '500.000 – 1.000.000 TL',
  '1.000.000 TL+',
  'Bütçe henüz belirlenmedi'
];

export default function QuoteWizardForm({ initialOrgType = '', initialCity = '', onSuccess }) {
  const [step, setStep] = useState(1);
  const [submittedLead, setSubmittedLead] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [formData, setFormData] = useState({
    organizationType: initialOrgType || 'Bayi Toplantısı',
    city: initialCity || 'İstanbul',
    district: '',
    venueStatus: 'Öneri İstiyorum',
    targetDate: '',
    isMultiDay: false,
    endDate: '',
    startTime: '09:00',
    endTime: '18:00',
    attendees: 250,
    requirements: ['Mekân', 'Catering', 'Sahne', 'Ses', 'Işık', 'LED ekran', 'Host/Hostes'],
    needAccommodationTransfer: false,
    budgetRange: '250.000 – 500.000 TL',
    company: '',
    contactName: '',
    title: '',
    phone: '',
    email: '',
    notes: '',
    kvkkConsent: true
  });

  const updateField = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleRequirement = (reqId) => {
    setFormData(prev => {
      const exists = prev.requirements.includes(reqId);
      return {
        ...prev,
        requirements: exists
          ? prev.requirements.filter(r => r !== reqId)
          : [...prev.requirements, reqId]
      };
    });
  };

  const nextStep = () => {
    if (step === 7) {
      if (!formData.company.trim() || !formData.contactName.trim() || !formData.phone.trim()) {
        alert('Lütfen Firma Adı, Ad Soyad ve Telefon alanlarını doldurunuz.');
        return;
      }
      if (!formData.kvkkConsent) {
        alert('Lütfen KVKK Aydınlatma Metnini onaylayınız.');
        return;
      }
      handleSubmit();
      return;
    }
    setStep(s => Math.min(s + 1, 7));
  };

  const prevStep = () => {
    setStep(s => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const newLead = await storageService.addLead({
        company: formData.company,
        contactName: formData.contactName,
        title: formData.title || 'Yetkili',
        phone: formData.phone,
        email: formData.email,
        organizationType: formData.organizationType,
        city: formData.city,
        district: formData.district,
        venueNeeded: formData.venueStatus !== 'Mekânımız Var',
        targetDate: formData.targetDate || new Date().toISOString().split('T')[0],
        endDate: formData.isMultiDay ? formData.endDate : formData.targetDate,
        isMultiDay: formData.isMultiDay,
        attendees: Number(formData.attendees) || 100,
        budgetRange: formData.budgetRange,
        notes: `${formData.notes ? formData.notes + ' | ' : ''}Mekân Durumu: ${formData.venueStatus}${formData.needAccommodationTransfer ? ' | Konaklama/Transfer talebi var.' : ''}`,
        requirements: formData.requirements,
        quotedPrice: formData.budgetRange.includes('1.000.000') ? 1200000 : formData.budgetRange.includes('500.000') ? 650000 : 350000
      });

      analytics.generateLead(newLead.id, newLead.company, newLead.city, newLead.organizationType);
      analytics.quoteFormComplete(newLead.id, newLead.organizationType, newLead.city, newLead.attendees, newLead.budgetRange);

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.log(e);
      }

      setSubmittedLead(newLead);
      if (onSuccess) onSuccess(newLead);
    } catch (err) {
      console.error('Teklif oluşturma hatası:', err);
      analytics.formError('submit', err.message || 'Bilinmeyen hata');
      setSubmitError(err.message || 'Teklif talebiniz gönderilirken bir sorun oluştu. Lütfen tekrar deneyin veya bizi arayın: 0532 055 09 45');
    } finally {
      setIsSubmitting(false);
    }
  };

  const settings = storageService.getSettings();

  if (submittedLead) {
    return (
      <div className="text-center py-8 px-4 max-w-xl mx-auto text-slate-800">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-300 flex items-center justify-center mx-auto mb-6 shadow-sm animate-bounce">
          <CheckCircle2 size={42} />
        </div>
        <span className="inline-block px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-xs font-bold mb-3">
          BAŞVURU NO: {submittedLead.id}
        </span>
        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-display">
          Teklif Talebiniz Başarıyla Alındı!
        </h3>
        <p className="mt-3 text-slate-600 text-sm md:text-base leading-relaxed">
          Sayın <strong className="text-slate-900">{submittedLead.contactName}</strong>,
          <strong className="text-amber-700"> {submittedLead.company}</strong> adına ilettiğiniz
          <strong className="text-slate-900"> {submittedLead.organizationType}</strong> organizasyonu talebiniz uzman koordinatörlerimize iletildi.
        </p>

        <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs md:text-sm text-slate-700 space-y-2.5 shadow-sm">
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Şehir / Lokasyon:</span>
            <span className="font-bold text-slate-900">{submittedLead.city} {submittedLead.district ? `(${submittedLead.district})` : ''}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Katılımcı Sayısı:</span>
            <span className="font-bold text-slate-900">{submittedLead.attendees} Kişi</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Seçilen Hizmetler:</span>
            <span className="font-bold text-amber-700">{submittedLead.requirements?.length} Kalem Seçildi</span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-slate-500">Geri Dönüş Süresi:</span>
            <span className="font-bold text-emerald-600">En Geç 2 Saat İçinde</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => generateProposalPdf(submittedLead)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold border border-slate-300 shadow-sm transition"
          >
            <FileText size={18} className="text-amber-600" />
            <span>Örnek Teklif PDF'i İndir</span>
          </button>
          <a
            href={`https://wa.me/${settings.whatsappPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Merhaba Toplantı Merkezi, ${submittedLead.id} numaralı ${submittedLead.organizationType} teklif talebimiz hakkında hızlı görüşmek istiyorum.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md transition"
          >
            <MessageSquare size={18} />
            <span>WhatsApp ile İletişime Geç</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-slate-800">
      {/* Step Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
          <span>Adım {step} / 7: {
            step === 1 ? 'Organizasyon Türü' :
              step === 2 ? 'Lokasyon & Mekân' :
                step === 3 ? 'Tarih & Zaman' :
                  step === 4 ? 'Katılımcı Sayısı' :
                    step === 5 ? 'Hizmet İhtiyaçları' :
                      step === 6 ? 'Tahmini Bütçe' : 'Firma Bilgileri'
          }</span>
          <span className="text-amber-700 font-bold">%{Math.round((step / 7) * 100)}</span>
        </div>
        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full gold-gradient-bg transition-all duration-300 rounded-full"
            style={{ width: `${(step / 7) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Contents */}
      <div className="min-h-[360px]">

        {/* STEP 1: Organizasyon Türü */}
        {step === 1 && (
          <div>
            <h4 className="text-xl font-bold text-slate-900 mb-1 font-display">Ne tür bir organizasyon düzenlemek istiyorsunuz?</h4>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">Şirketiniz veya kurumunuz için en uygun organizasyon kategorisini seçiniz.</p>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {ORG_TYPES.map(item => {
                const selected = formData.organizationType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => updateField('organizationType', item.id)}
                    className={`text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${selected
                      ? 'bg-amber-500/10 border-amber-500 text-slate-900 shadow-sm font-bold'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-100/70'
                      }`}
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div>
                      <div className="font-bold text-sm text-slate-900 mb-1">{item.label}</div>
                      <div className="text-xs text-slate-500 leading-tight line-clamp-2">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Lokasyon */}
        {step === 2 && (
          <div>
            <h4 className="text-xl font-bold text-slate-900 mb-1 font-display">Organizasyon nerede gerçekleşecek?</h4>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">81 ilde hizmet veriyoruz. Hedef şehrinizi ve mekân durumunuzu belirtiniz.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Şehir Seçimi (81 İl)</label>
                <select
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-semibold focus:outline-none focus:border-amber-600 focus:bg-white"
                >
                  {ALL_81_CITIES.map(c => (
                    <option key={c.slug} value={c.name}>{c.plate} - {c.name} ({c.region})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">İlçe / Bölge (Opsiyonel)</label>
                <input
                  type="text"
                  placeholder="Örn: Maslak, Çankaya, Belek, Seyhan..."
                  value={formData.district}
                  onChange={(e) => updateField('district', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-600 focus:bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Mekân Durumu</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'Öneri İstiyorum', label: 'Mekân Önerisi İstiyorum', icon: '✨' },
                    { id: 'Mekânımız Var', label: 'Mekânımız Belli', icon: '🏢' },
                    { id: 'Firma Kendi Sahası', label: 'Şirket/Fabrika İçi', icon: '🏭' }
                  ].map(v => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => updateField('venueStatus', v.id)}
                      className={`p-3 text-center rounded-xl border text-xs font-bold transition ${formData.venueStatus === v.id
                        ? 'bg-amber-500/10 border-amber-600 text-amber-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                    >
                      <div className="text-lg mb-1">{v.icon}</div>
                      <div>{v.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Tarih & Saat */}
        {step === 3 && (
          <div>
            <h4 className="text-xl font-bold text-slate-900 mb-1 font-display">Organizasyon tarihi ve zaman planı nedir?</h4>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">Planlanan takvimi belirleyiniz. Tarih net değilse tahmini bir ay/gün seçebilirsiniz.</p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  id="multiDayCheck"
                  checked={formData.isMultiDay}
                  onChange={(e) => updateField('isMultiDay', e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="multiDayCheck" className="text-xs sm:text-sm font-bold text-slate-800 cursor-pointer">
                  Organizasyon birden fazla gün sürecek (Konaklamalı / Çok Günlü)
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {formData.isMultiDay ? 'Başlangıç Tarihi' : 'Organizasyon Tarihi'}
                  </label>
                  <input
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => updateField('targetDate', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white text-sm"
                  />
                </div>

                {formData.isMultiDay && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Bitiş Tarihi</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => updateField('endDate', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white text-sm"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Başlangıç Saati</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => updateField('startTime', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Bitiş Saati</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => updateField('endTime', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Katılımcı Sayısı */}
        {step === 4 && (
          <div>
            <h4 className="text-xl font-bold text-slate-900 mb-1 font-display">Tahmini katılımcı sayısı kaç kişi?</h4>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">Mekân kapasitesi ve catering planlaması için kişi sayısını seçiniz.</p>

            <div className="space-y-6">
              <div className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-4xl font-extrabold text-amber-700 font-display mb-1">
                  {formData.attendees} <span className="text-xl font-medium text-slate-600">Kişi</span>
                </div>
                <div className="text-xs text-slate-500 font-medium">Tahmini Kurumsal Katılımcı</div>
              </div>

              {/* Ready chips */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[50, 100, 250, 500, 1000, 2500].map(cnt => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => updateField('attendees', cnt)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition ${Number(formData.attendees) === cnt
                      ? 'gold-gradient-bg text-slate-950 border-amber-500 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                  >
                    {cnt} Kişi
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Veya Net Sayı Giriniz:</label>
                <input
                  type="number"
                  min="10"
                  max="50000"
                  value={formData.attendees}
                  onChange={(e) => updateField('attendees', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: İhtiyaçlar Checkbox */}
        {step === 5 && (
          <div>
            <h4 className="text-xl font-bold text-slate-900 mb-1 font-display">Hangi teknik ve operasyonel hizmetlere ihtiyacınız var?</h4>
            <p className="text-xs sm:text-sm text-slate-500 mb-4">İhtiyaç duyduğunuz tüm kalemleri işaretleyiniz. Tüm süreç tek merkezden yönetilecektir.</p>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 max-h-[260px] overflow-y-auto pr-1">
              {REQUIREMENTS_LIST.map(req => {
                const selected = formData.requirements.includes(req.id);
                return (
                  <button
                    key={req.id}
                    type="button"
                    onClick={() => toggleRequirement(req.id)}
                    className={`text-left p-3 rounded-xl border transition-all text-xs font-semibold flex items-center justify-between gap-2 ${selected
                      ? 'bg-amber-500/10 border-amber-600 text-slate-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                  >
                    <span>{req.label}</span>
                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${selected ? 'bg-amber-600 border-amber-600 text-white' : 'border-slate-300 bg-white'}`}>
                      {selected && <CheckCircle2 size={12} className="stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Travel / Transfer modular section */}
            <div className="mt-4 p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
              <input
                type="checkbox"
                id="accTransCheck"
                checked={formData.needAccommodationTransfer}
                onChange={(e) => updateField('needAccommodationTransfer', e.target.checked)}
                className="w-5 h-5 mt-0.5 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="accTransCheck" className="text-xs text-blue-900 cursor-pointer">
                <strong className="text-blue-950 block mb-0.5">Konaklama, Uçak & VIP Transfer Hizmeti Talebi</strong>
                Mevzuata uygun olarak yetkili seyahat acentası çözüm ortaklarımız ile otel konaklama ve havalimanı VIP transfer operasyonu da teklife dahil edilsin.
              </label>
            </div>
          </div>
        )}

        {/* STEP 6: Bütçe */}
        {step === 6 && (
          <div>
            <h4 className="text-xl font-bold text-slate-900 mb-1 font-display">Organizasyon için öngörülen bütçe aralığı nedir?</h4>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">Maliyet optimizasyonu ve size en uygun mekân/teknik konsepti önerebilmemiz için seçiniz.</p>

            <div className="space-y-2.5">
              {BUDGET_OPTIONS.map(bOpt => {
                const selected = formData.budgetRange === bOpt;
                return (
                  <button
                    key={bOpt}
                    type="button"
                    onClick={() => updateField('budgetRange', bOpt)}
                    className={`w-full text-left p-4 rounded-xl border font-bold text-sm transition flex items-center justify-between ${selected
                      ? 'bg-amber-500/10 border-amber-600 text-slate-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                  >
                    <span>{bOpt}</span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selected ? 'border-amber-600 bg-amber-600' : 'border-slate-300 bg-white'}`}>
                      {selected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 7: Firma Bilgileri & Gönder */}
        {step === 7 && (
          <div>
            <h4 className="text-xl font-bold text-slate-900 mb-1 font-display">Teklifin iletileceği firma & yetkili bilgileri</h4>
            <p className="text-xs sm:text-sm text-slate-500 mb-5">Resmi teklif dosyanız ve bütçe çalışmanız bu iletişim bilgileri üzerinden tarafınıza ulaştırılacaktır.</p>

            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Firma / Kurum Adı *</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Anadolu Holding A.Ş."
                    value={formData.company}
                    onChange={(e) => updateField('company', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-600 focus:bg-white text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Yetkili Ad Soyad *</label>
                  <input
                    type="text"
                    required
                    placeholder="Adınız ve Soyadınız"
                    value={formData.contactName}
                    onChange={(e) => updateField('contactName', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-600 focus:bg-white text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Göreviniz / Ünvan</label>
                  <input
                    type="text"
                    placeholder="Örn: Satış Direktörü"
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-600 focus:bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Telefon Numarası *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0532 000 00 00"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-600 focus:bg-white text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">E-posta Adresi *</label>
                  <input
                    type="email"
                    required
                    placeholder="ad@sirket.com"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-600 focus:bg-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Organizasyon Hakkında Özel Not / Beklentiler</label>
                <textarea
                  rows="2"
                  placeholder="Etkinlik teması, sahne beklentisi veya özel sanatçı/teknik taleplerinizi belirtebilirsiniz..."
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-600 focus:bg-white text-sm"
                ></textarea>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="kvkkCheck"
                  checked={formData.kvkkConsent}
                  onChange={(e) => updateField('kvkkConsent', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="kvkkCheck" className="text-xs text-slate-600 cursor-pointer">
                  KVKK Aydınlatma Metni'ni okudum, kurumsal teklif hazırlanması amacıyla verilerimin işlenmesini onaylıyorum.
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submit Error Banner (H5 düzeltmesi - kullanıcıya görünür geri bildirim) */}
      {submitError && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" />
          <div>
            <p className="font-bold">Talep Gönderilemedi</p>
            <p className="mt-0.5 text-red-700">{submitError}</p>
          </div>
          <button
            type="button"
            onClick={() => setSubmitError('')}
            className="ml-auto shrink-0 text-red-400 hover:text-red-600 transition"
            aria-label="Hata mesajını kapat"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Action Navigation Buttons */}
      <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition"
          >
            <ChevronLeft size={16} />
            <span>Geri</span>
          </button>
        ) : (
          <div></div>
        )}

        <button
          type="button"
          onClick={nextStep}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-7 py-3 rounded-xl gold-gradient-bg text-slate-950 font-extrabold text-sm shadow-md hover:scale-105 transition"
        >
          {isSubmitting ? (
            <span>Gönderiliyor...</span>
          ) : step === 7 ? (
            <>
              <span>TEKLİF TALEBİNİ GÖNDER</span>
              <Send size={16} />
            </>
          ) : (
            <>
              <span>Devam Et</span>
              <ChevronRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
