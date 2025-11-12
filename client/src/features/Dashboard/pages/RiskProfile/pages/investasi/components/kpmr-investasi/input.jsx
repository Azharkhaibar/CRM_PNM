import React from 'react';

// 🔹 Wrapper umum untuk field (label + children + hint)
function FieldWrap({ label, hint, className = '', children }) {
  return (
    <label className={`block space-y-1 ${className}`}>
      {label && <div className="text-sm font-medium text-gray-600">{label}</div>}
      {children}
      {hint && <div className="text-xs text-gray-400">{hint}</div>}
    </label>
  );
}

// 🔹 Input dasar (bisa dipakai ulang)
function BaseInput({ type = 'text', value, onChange, placeholder, readOnly = false, min, max }) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      readOnly={readOnly}
      min={min}
      max={max}
      onChange={(e) => onChange(type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
      className={`w-full rounded-lg border border-gray-300 px-3 py-2 bg-white 
        focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition 
        ${readOnly ? 'text-gray-700 bg-gray-50' : ''}`}
    />
  );
}

// 🔹 Text Field
export function TextField(props) {
  const { label, hint, className, ...inputProps } = props;
  return (
    <FieldWrap label={label} hint={hint} className={className}>
      <BaseInput {...inputProps} />
    </FieldWrap>
  );
}

// 🔹 Text Area
export function TextAreaField({ label, value, onChange, className = '', hint }) {
  return (
    <FieldWrap label={label} hint={hint} className={className}>
      <textarea
        className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white min-h-[80px] 
                   focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </FieldWrap>
  );
}

// 🔹 Number Field
export function NumberField({ label, value, onChange, min, max, className = '', hint }) {
  return (
    <FieldWrap label={label} hint={hint} className={className}>
      <BaseInput type="number" value={value} onChange={onChange} min={min} max={max} />
    </FieldWrap>
  );
}

// 🔹 Read Only Field
export function ReadOnlyField({ label, value, hint, className = '' }) {
  return (
    <FieldWrap label={label} hint={hint} className={className}>
      <BaseInput value={value} readOnly />
    </FieldWrap>
  );
}

// 🔹 Select (Quarter)
export function QuarterSelect({ label = 'Triwulan', value, onChange, className }) {
  const options = [
    { value: 'Q1', label: 'Q1 (Jan–Mar)' },
    { value: 'Q2', label: 'Q2 (Apr–Jun)' },
    { value: 'Q3', label: 'Q3 (Jul–Sep)' },
    { value: 'Q4', label: 'Q4 (Okt–Des)' },
  ];

  return (
    <FieldWrap label={label} className={className}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white 
                   focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrap>
  );
}

// 🔹 Year Input
export function YearInput({ label = 'Tahun', value, onChange, className }) {
  return (
    <FieldWrap label={label} className={className}>
      <BaseInput type="number" value={value} onChange={(v) => onChange(Number(v))} />
    </FieldWrap>
  );
}

// 🔹 RiskField (2-layer style)
export function RiskField({ label, value, onChange, color = '#93D24D', textColor = '#111827', placeholder, className = '' }) {
  return (
    <div className={`border-2 border-[#0f1a0f] rounded-2xl overflow-hidden shadow-inner ${className}`} style={{ background: '#E9F7E6' }}>
      {/* Header */}
      <div className="flex items-center justify-center font-bold text-[16px] h-[44px] px-3 truncate" style={{ background: color, color: textColor }}>
        {label}
      </div>

      {/* Divider */}
      <div className="h-1 bg-[#0f1a0f]" />

      {/* Input */}
      <div className="p-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-[44px] text-center font-semibold text-[16px] bg-[#E9F7E6] 
                     border-none outline-none rounded-lg"
        />
      </div>
    </div>
  );
}
