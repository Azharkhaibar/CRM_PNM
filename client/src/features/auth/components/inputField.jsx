import React from 'react';
import { useDarkMode } from '../../../shared/components/Darkmodecontext';

const InputField = ({ label, type, value, onChange, required = true }) => {
  const { darkMode } = useDarkMode(); 

  const labelClass = `block text-sm font-bold mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`;

  const inputClass = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
  }`;

  return (
    <div className="mb-4">
      <label className={labelClass}>{label}</label>
      <input type={type} value={value} onChange={onChange} className={inputClass} required={required} placeholder={`Enter your ${label.toLowerCase()}`} />
    </div>
  );
};

export default InputField;
