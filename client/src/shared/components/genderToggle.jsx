import React from 'react';
import { Venus, Mars } from 'lucide-react';

export default function GenderToggleSignupDialog({ genderForm, setGenderForm, darkMode = false }) {
  const containerClass = `flex w-full rounded-lg overflow-hidden border transition-colors duration-300 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`;

  const maleButtonClass = `flex-1 p-2 text-center transition-all duration-300 ${
    genderForm === 'male' ? (darkMode ? 'bg-blue-600 text-white shadow-inner' : 'bg-blue-500 text-white shadow-inner') : darkMode ? 'bg-gray-700 text-blue-400 hover:bg-gray-600' : 'bg-white text-blue-500 hover:bg-blue-50'
  }`;

  const femaleButtonClass = `flex-1 p-2 text-center transition-all duration-300 ${
    genderForm === 'female' ? (darkMode ? 'bg-pink-600 text-white shadow-inner' : 'bg-pink-500 text-white shadow-inner') : darkMode ? 'bg-gray-700 text-pink-400 hover:bg-gray-600' : 'bg-white text-pink-500 hover:bg-pink-50'
  }`;

  const maleIconClass = `w-6 h-6 m-auto transition-colors duration-300 ${genderForm === 'male' ? 'text-white' : darkMode ? 'text-blue-400' : 'text-blue-500'}`;

  const femaleIconClass = `w-6 h-6 m-auto transition-colors duration-300 ${genderForm === 'female' ? 'text-white' : darkMode ? 'text-pink-400' : 'text-pink-500'}`;

  return (
    <div className={containerClass}>
      <button type="button" onClick={() => setGenderForm('male')} className={maleButtonClass}>
        <Mars className={maleIconClass} />
        <span className="sr-only">Male</span>
      </button>

      <button type="button" onClick={() => setGenderForm('female')} className={femaleButtonClass}>
        <Venus className={femaleIconClass} />
        <span className="sr-only">Female</span>
      </button>
    </div>
  );
}
