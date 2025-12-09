import React from 'react';

export const RiskField = ({ label, value, onChange, color, textColor = '#111827', placeholder, className = '' }) => {
  const handleChange = (e) => {
    onChange && onChange(e.target.value);
  };

  const handleInput = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className={className}>
      <div
        style={{
          border: '2px solid #0f1a0f',
          borderRadius: 14,
          overflow: 'hidden',
          background: '#E9F7E6',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 44 + 4 + 44,
        }}
      >
        <div
          style={{
            background: color || '#93D24D',
            color: textColor === '#111827' ? '#111' : textColor,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 16,
            padding: '0 12px',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={label}
        >
          {label}
        </div>

        <div style={{ height: 4, background: '#0f1a0f', flex: '0 0 auto' }} />

        <div style={{ padding: 8, flex: '1 0 auto' }}>
          <textarea
            value={value}
            onChange={handleChange}
            onInput={handleInput}
            placeholder={placeholder}
            rows={2}
            style={{
              width: '100%',
              minHeight: 44,
              textAlign: 'center',
              fontWeight: 700,
              fontSize: 16,
              color: '#0f1a0f',
              background: '#E9F7E6',
              border: 'none',
              outline: 'none',
              borderRadius: 10,
              resize: 'none',
              overflow: 'hidden',
              whiteSpace: 'pre-wrap',
            }}
          />
        </div>
      </div>
    </div>
  );
};
