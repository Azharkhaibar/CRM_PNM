import React, { useState, useMemo } from 'react';
import { Download, Search } from 'lucide-react';
import { YearInput, QuarterSelect } from './components/inputs.jsx';

// Import komponen yang dipisah
import { PNM_BRAND, fmtNumber } from './constant/constant.jsx';
import PasarTab from './tabs/pasartabs.jsx';
import KPMRTab from './tabs/kpmrpasartab.jsx';

export default function Pasar() {
  const [activeTab, setActiveTab] = useState('pasar');
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewQuarter, setViewQuarter] = useState('Q1');
  const [query, setQuery] = useState('');

  // Render
  return (
    <div className="p-6">
      {/* HERO */}
      <div className={`relative rounded-2xl  mb-6 shadow-sm ${PNM_BRAND.gradient} `}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_0%,white,transparent_40%),radial-gradient(circle_at_80%_100%,white,transparent_35%)]" />
        <div className="relative px-6 py-7 sm:px-8 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">Risk Form – Pasar</h1>
          <p className="mt-1 text-white/90 text-sm">Form Pasar & KPMR dalam 1 halaman.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('pasar')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'pasar' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'}`}
          >
            Pasar
          </button>

          <button
            onClick={() => setActiveTab('kpmr')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'kpmr' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'}`}
          >
            KPMR Pasar
          </button>
        </nav>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 w-full mx-auto">
        {activeTab === 'pasar' && <PasarTab viewYear={viewYear} setViewYear={setViewYear} viewQuarter={viewQuarter} setViewQuarter={setViewQuarter} query={query} setQuery={setQuery} />}

        {activeTab === 'kpmr' && <KPMRTab viewYear={viewYear} setViewYear={setViewYear} viewQuarter={viewQuarter} setViewQuarter={setViewQuarter} query={query} setQuery={setQuery} />}
      </div>
    </div>
  );
}
