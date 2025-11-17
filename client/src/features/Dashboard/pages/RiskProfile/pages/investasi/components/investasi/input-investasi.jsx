import React from 'react';

function FieldWrap({ label, className = '', children, hint }) {
  return (
    <label className={`block ${className}`}>
      <div className="mb-1 text-sm text-gray-700 font-semibold">{label}</div>
      {children}
      {hint && <div className="mt-1 text-xs text-gray-400">{hint}</div>}
    </label>
  );
}

export function TextField({ label, value, onChange, placeholder, className = '' }) {
  return (
    <FieldWrap label={label} className={className}>
      <input
        className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </FieldWrap>
  );
}

export function TextAreaField({ label, value, onChange, placeholder, className = '' }) {
  return (
    <FieldWrap label={label} className={className}>
      <textarea
        className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white min-h-[80px] shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </FieldWrap>
  );
}

export function NumberField({ label, value, onChange, min, max, className = '' }) {
  return (
    <FieldWrap label={label} className={className}>
      <input
        type="number"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200"
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === '' ? '' : Number(v));
        }}
      />
    </FieldWrap>
  );
}

export function ReadOnlyField({ label, value, hint, className = '' }) {
  return (
    <FieldWrap label={label} hint={hint} className={className}>
      <input className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100 text-gray-700 shadow-inner" value={value} readOnly />
    </FieldWrap>
  );
}

export function QuarterSelect({ label = 'Triwulan', value, onChange, className = '' }) {
  return (
    <FieldWrap label={label} className={className}>
      <select className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="Q1">Q1 (Jan–Mar)</option>
        <option value="Q2">Q2 (Apr–Jun)</option>
        <option value="Q3">Q3 (Jul–Sep)</option>
        <option value="Q4">Q4 (Okt–Des)</option>
      </select>
    </FieldWrap>
  );
}

export function YearInput({ label = 'Tahun', value, onChange, className = '' }) {
  return (
    <FieldWrap label={label} className={className}>
      <input
        type="number"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </FieldWrap>
  );
}

export function RiskField({ label, value, onChange, color = '#93D24D', textColor = '#111827', placeholder, className = '' }) {
  return (
    <div className={`${className} rounded-lg overflow-hidden shadow-md`}>
      <div
        style={{
          background: color,
          color: textColor,
          fontWeight: 700,
          fontSize: 16,
          textAlign: 'center',
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {label}
      </div>

      <div style={{ height: 3, background: '#0f1a0f' }} />

      <div style={{ padding: 6, background: '#E9F7E6' }}>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            height: 40,
            borderRadius: 8,
            textAlign: 'center',
            fontWeight: 700,
            fontSize: 16,
            color: '#0f1a0f',
            border: 'none',
            outline: 'none',
            background: '#E9F7E6',
          }}
        />
      </div>
    </div>
  );
}
