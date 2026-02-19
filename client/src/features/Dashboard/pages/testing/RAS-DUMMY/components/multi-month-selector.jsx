import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
// import { MONTH_OPTIONS } from '../utils/rasConstant.js';
import { MONTH_OPTIONS } from '../utils/rasContants';
export default function MultiMonthSelector({ selectedMonths, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMonth = (monthValue) => {
    let newSelection;
    if (selectedMonths.includes(monthValue)) {
      if (selectedMonths.length === 1) return;
      newSelection = selectedMonths.filter((m) => m !== monthValue);
    } else {
      newSelection = [...selectedMonths, monthValue];
    }
    newSelection.sort((a, b) => a - b);
    onChange(newSelection);
  };

  const selectedLabels = selectedMonths.map((m) => MONTH_OPTIONS[m].label);
  const displayText = selectedLabels.length > 2 ? `${selectedLabels.length} Bulan Dipilih` : selectedLabels.join(', ');

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-48 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm h-[46px]"
      >
        <span className="truncate">{displayText}</span>
        <ChevronDown size={16} className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-56 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-80 overflow-y-auto animate-fade-in">
          <div className="p-2 space-y-1">
            {MONTH_OPTIONS.map((option) => {
              const isSelected = selectedMonths.includes(option.value);
              return (
                <div
                  key={option.value}
                  onClick={() => toggleMonth(option.value)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm
                    ${isSelected ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}
                  `}
                >
                  <span>{option.label}</span>
                  {isSelected && <Check size={16} className="text-blue-600" />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
