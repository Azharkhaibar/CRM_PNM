// src/features/Dashboard/pages/RiskProfile/pages/pasar/components/Inputs.jsx

// Year Input Component
export const YearInput = ({ value, onChange, min = 2000, max = 2100, ...props }) => {
  const years = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <select value={value} onChange={(e) => onChange(parseInt(e.target.value))} className="px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" {...props}>
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  );
};

// Quarter Select Component
export const QuarterSelect = ({ value, onChange, ...props }) => {
  const quarters = [
    { value: 'Q1', label: 'Q1' },
    { value: 'Q2', label: 'Q2' },
    { value: 'Q3', label: 'Q3' },
    { value: 'Q4', label: 'Q4' },
  ];

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" {...props}>
      {quarters.map((q) => (
        <option key={q.value} value={q.value}>
          {q.label}
        </option>
      ))}
    </select>
  );
};
