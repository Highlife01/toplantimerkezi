import React from 'react';

export default function SectionTitle({
  badge,
  title,
  subtitle,
  center = true,
  className = ''
}) {
  return (
    <div className={`mb-12 ${center ? 'text-center' : 'text-left'} ${className}`}>
      {badge && (
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-3.5 border border-amber-500/30 bg-amber-500/10 text-amber-700 ${center ? 'mx-auto' : ''}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping"></span>
          <span>{badge}</span>
        </div>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 font-display">
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-base md:text-lg text-slate-600 max-w-3xl leading-relaxed font-normal ${center ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
