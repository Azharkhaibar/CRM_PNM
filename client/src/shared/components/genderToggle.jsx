import React from 'react';
import { Venus, Mars } from 'lucide-react';

export default function GenderToggleSignupDialog({ genderForm, setGenderForm }) {
  return (
    <div className="flex w-full rounded-lg overflow-hidden border border-gray-300">
      <button type="button" onClick={() => setGenderForm('male')} className={`flex-1 p-2 text-center transition-colors ${genderForm === 'male' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}>
        <Mars className={`w-6 h-6 m-auto ${genderForm === 'male' ? 'text-white' : 'text-blue-500'}`} />
      </button>


      <button type="button" onClick={() => setGenderForm('female')} className={`flex-1 p-2 text-center transition-colors ${genderForm === 'female' ? 'bg-pink-500 text-white' : 'bg-white text-pink-500'}`}>
        <Venus className={`w-6 h-6 m-auto ${genderForm === 'female' ? 'text-white' : 'text-pink-500'}`} />
      </button>
    </div>
  );
}
