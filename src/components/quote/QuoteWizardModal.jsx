import React, { useEffect } from 'react';
import QuoteWizardForm from './QuoteWizardForm';
import { X, Sparkles } from 'lucide-react';

export default function QuoteWizardModal({ isOpen, onClose, initialOrgType, initialCity }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl z-10 my-auto text-slate-900">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-extrabold font-display text-slate-900">
                Kurumsal Organizasyon Planla
              </h3>
              <p className="text-xs text-slate-500">
                Türkiye Geneli 81 İlde Profesyonel Hızlı Teklif Alın
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <QuoteWizardForm 
          initialOrgType={initialOrgType} 
          initialCity={initialCity} 
          onSuccess={() => {}} 
        />
      </div>
    </div>
  );
}
