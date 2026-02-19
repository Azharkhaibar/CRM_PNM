import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Download, Search, ShieldAlert, Plus, Check, X, Info, 
  Upload, Calendar, BarChart3, Layers, LayoutList, Trash2, ChevronDown, ChevronUp, RotateCcw, AlertTriangle
} from 'lucide-react';

import RasMonthlyTable from '../components/ras-monthly-table.jsx';
import RasYearlyTable from '../components/ras-yearly-table.jsx';
import RasForm from '../components/ras-form.jsx';
import TindakLanjut from '../components/tindak-lanjut.jsx';
import RiskAttitude from '../components/risk-attitude.jsx'; 
import MultiMonthSelector from '../components/multi-month-selector.jsx';
// Import fungsi export
// import { exportRasMonthly, exportRasYearly } from './utils/exportExcel.js';
import { exportRasMonthly, exportRasYearly } from '../utils/export-excel.js'; 
import { parseExcelFile } from '../utils/import-excel.js';
import { MONTH_OPTIONS } from '../utils/rasContants.js';

const getCurrentYear = () => new Date().getFullYear();
const getCurrentMonthIndex = () => new Date().getMonth();

const MOCK_RAS_DATA = [];

const YearInput = ({ selectedYear, onChange }) => {
  return (
    <div className="flex items-center bg-white rounded-xl border border-gray-300 px-3 py-2 shadow-sm h-[46px] w-[140px]">
      <input 
        type="number" 
        value={selectedYear}
        onChange={(e) => onChange(parseInt(e.target.value) || '')}
        className="w-full text-sm font-medium text-black bg-transparent outline-none border-none p-0 focus:ring-0"
        min="2000"
        max="2100"
      />
    </div>
  );
};

export default function RasPage() {
  const [viewYear, setViewYear] = useState(getCurrentYear());
  const [selectedMonths, setSelectedMonths] = useState([getCurrentMonthIndex()]); 
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('monthly');
  const [showForm, setShowForm] = useState(false);
  const [showRiskInfo, setShowRiskInfo] = useState(false); 
  const [editingData, setEditingData] = useState(null);
  const fileInputRef = useRef(null);

  const [showNumDenom, setShowNumDenom] = useState(true);
  const [showDetailColumns, setShowDetailColumns] = useState(true);

  const [showFollowUp, setShowFollowUp] = useState(false);
  const [followUpData, setFollowUpData] = useState(null);

  const [dataList, setDataList] = useState(() => {
    try {
      const savedData = localStorage.getItem('RAS_DATA');
      return savedData ? JSON.parse(savedData) : [];
    } catch (e) {
      console.error("Gagal load dari localStorage", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('RAS_DATA', JSON.stringify(dataList));
  }, [dataList]);

  const filteredData = useMemo(() => {
    return dataList.filter(item => {
      const itemYear = item.year || 2025; 
      if (itemYear !== viewYear) return false;

      const matchSearch = 
        (item.parameter?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (item.riskCategory?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [dataList, searchQuery, viewYear]);

  const uniqueCategories = useMemo(() => {
    return [...new Set(filteredData.map(item => item.riskCategory))];
  }, [filteredData]);

  // --- SAVE HANDLER (LOGIC UPDATE: UNIQUE & SMART LINKING) ---
  const handleSave = (formData) => {
    const currentYear = viewYear;
    const normalizedParamName = formData.parameter.trim();
    
    // 1. CEK DUPLIKASI (Hanya di tahun yang sama)
    const isDuplicate = dataList.some(item => {
      if (item.year !== currentYear) return false;
      if (editingData && item.id === editingData.id) return false; // Abaikan diri sendiri saat edit
      return item.parameter.trim().toLowerCase() === normalizedParamName.toLowerCase();
    });

    if (isDuplicate) {
      alert(`Gagal Simpan: Parameter "${normalizedParamName}" sudah ada di tahun ${currentYear}.`);
      return; 
    }

    let newDataList = [...dataList];
    const category = formData.riskCategory;

    // 2. TENTUKAN GROUP ID (SMART LINKING)
    // Jika user edit, pakai groupId lama.
    // Jika user create baru: Cek apakah nama ini pernah ada di tahun lalu? Jika ya, ambil groupId-nya.
    let targetGroupId = formData.groupId;

    if (!editingData && !targetGroupId) {
       // Cari parameter dengan nama SAMA persis di seluruh database (tahun berapapun)
       // Ambil yang paling baru dibuat
       const existingHistory = dataList
          .filter(d => d.parameter.trim().toLowerCase() === normalizedParamName.toLowerCase())
          .sort((a, b) => b.year - a.year); // Sort tahun terbaru

       if (existingHistory.length > 0) {
          targetGroupId = existingHistory[0].groupId;
          // Opsional: Beritahu user link ditemukan (bisa dihapus jika terlalu berisik)
          // console.log("Smart Link: Menggunakan GroupID lama untuk", normalizedParamName);
       } else {
          // Benar-benar baru
          targetGroupId = `GID-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
       }
    }

    if (editingData) {
      // --- MODE EDIT ---
      newDataList = newDataList.map(item => 
        item.id === editingData.id 
          ? { 
              ...formData, 
              id: item.id, 
              year: item.year, 
              groupId: item.groupId, // Keep existing ID
              no: formData.no 
            } 
          : item
      );
    } else {
      // --- MODE CREATE ---
      let targetNo;
      const sameContextItems = newDataList.filter(d => d.year === currentYear && d.riskCategory === category);
      
      if (!formData.no || String(formData.no).trim() === '') {
        const maxNo = sameContextItems.reduce((max, item) => {
            const num = parseInt(item.no);
            return !isNaN(num) && num > max ? num : max;
        }, 0);
        targetNo = maxNo + 1;
      } else {
        targetNo = formData.no; 
      }

      const newItem = { 
        ...formData, 
        id: Date.now(), 
        year: currentYear,
        no: targetNo,
        groupId: targetGroupId // Gunakan Smart ID atau New ID
      };
      
      newDataList.push(newItem);
    }

    setDataList(newDataList);
    setShowForm(false);
    setEditingData(null);
  };

  const handleResetData = () => {
    if (window.confirm("PERINGATAN: Apakah Anda yakin ingin menghapus SELURUH data? Tindakan ini tidak dapat dibatalkan.")) {
      localStorage.removeItem('RAS_DATA');
      setDataList([]);
      alert("Data berhasil direset bersih.");
    }
  };

  const handleInlineUpdate = (id, field, value) => {
    setDataList(prevList => prevList.map(item => {
        if (item.id === id) {
            return { ...item, [field]: value };
        }
        return item;
    }));
  };

  const handleCellClick = (item) => {
    setFollowUpData(item);
    setShowFollowUp(true);
  };

  const handleSaveFollowUp = (id, followUpResult) => {
    const newDataList = dataList.map(item => {
        if (item.id === id) {
            return { ...item, tindakLanjut: followUpResult };
        }
        return item;
    });
    setDataList(newDataList);
    alert("Data Tindak Lanjut Berhasil Disimpan!");
  };
  
  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus data ini?')) {
      const filtered = dataList.filter(item => item.id !== id);
      setDataList(filtered);
    }
  };

  const handleEdit = (item) => {
    setEditingData(item);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExport = () => {
    if (activeTab === 'monthly') {
      exportRasMonthly(filteredData, viewYear, selectedMonths);
    } else {
      exportRasYearly(filteredData, viewYear, dataList);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const importedData = await parseExcelFile(file);
      const mergedList = [...dataList, ...importedData.map(d => ({ ...d, year: viewYear, id: Date.now() + Math.random(), groupId: `GID-IMP-${Date.now()}-${Math.random()}` }))];
      setDataList(mergedList);
      alert("Import berhasil.");
    } catch (error) {
      alert("Gagal import: " + error.message);
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6 mx-auto pb-12">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg text-white p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Risk Appetite Statement</h1>
              <p className="text-blue-100 text-sm">Monitoring Profil Risiko & RAS</p>
            </div>
          </div>

          <div className="flex bg-white/10 p-1 rounded-xl backdrop-blur-sm border border-white/10">
            <button
              onClick={() => setActiveTab('monthly')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'monthly' 
                  ? 'bg-white text-blue-700 shadow-sm' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Calendar size={16} />
              RAS (Bulan)
            </button>
            <button
              onClick={() => setActiveTab('yearly')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'yearly' 
                  ? 'bg-white text-blue-700 shadow-sm' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <BarChart3 size={16} />
              RAS (Tahun)
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-6">
          <YearInput selectedYear={viewYear} onChange={setViewYear} />
          
          {activeTab === 'monthly' && (
            <MultiMonthSelector selectedMonths={selectedMonths} onChange={setSelectedMonths} />
          )}
          
          <div className="relative group ml-auto">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari parameter..."
              className="pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/70 w-48 focus:w-64 transition-all h-[46px]"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
          </div>

          <div className="flex gap-2">
            <button onClick={handleResetData} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-red-500/80 text-white font-semibold hover:bg-red-600 transition-all shadow-lg h-[46px] border border-red-400/50" title="Reset Data">
              <Trash2 className="w-5 h-5" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button onClick={handleExport} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-white text-blue-600 font-semibold hover:bg-gray-100 transition-all shadow-lg h-[46px]">
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Export {activeTab === 'monthly' ? 'Bulanan' : 'Tahunan'}</span>
            </button>

            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".xlsx, .xls" className="hidden" />
            <button onClick={handleImportClick} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-green-500 text-white font-semibold hover:bg-green-600 transition-all shadow-lg h-[46px]">
              <Upload className="w-5 h-5" />
              <span className="hidden sm:inline">Import</span>
            </button>
          </div>
        </div>
      </header>

      {/* --- CONTENT BASED ON TAB --- */}
      
      {activeTab === 'monthly' ? (
        <div className="animate-fade-in">
          <div className="flex flex-col gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6">
            {/* Header Monthly */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3 text-sm w-full sm:w-auto">
                <span className="text-gray-500">Periode:</span>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-100">
                    {viewYear}
                </span>
                <span className="text-gray-300">|</span>
                <span className="font-bold text-gray-800">{filteredData.length} Data</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button onClick={() => setShowRiskInfo(!showRiskInfo)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-sm border transition-all text-sm font-medium ${showRiskInfo ? 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-2 ring-indigo-100' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                    {showRiskInfo ? <ChevronUp size={18} /> : <Info size={18} />}
                    <span className="hidden sm:inline">{showRiskInfo ? 'Tutup Info' : 'Info Sikap'}</span>
                  </button>

                  {!showForm && (
                    <button onClick={() => { setEditingData(null); setShowForm(true); }} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-blue-700 font-semibold text-sm transition-transform active:scale-95">
                    <Plus size={18} /> <span className="hidden sm:inline">Tambah Data</span><span className="sm:hidden">Tambah</span>
                    </button>
                  )}
                </div>
            </div>

            {showRiskInfo && (
                <div className="animate-fade-in-up mt-4 bg-gray-50 rounded-xl border border-indigo-100 p-4 shadow-inner">
                    <RiskAttitude />
                </div>
            )}

             <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-gray-100 mt-3">
               <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tampilan:</div>
               <button onClick={() => setShowNumDenom(!showNumDenom)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${showNumDenom ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                  {showNumDenom ? <Layers size={14} /> : <Layers size={14} className="opacity-50" />} {showNumDenom ? 'Sembunyikan Pembilang/Penyebut' : 'Tampilkan Pembilang/Penyebut'}
               </button>
               <button onClick={() => setShowDetailColumns(!showDetailColumns)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${showDetailColumns ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                  {showDetailColumns ? <LayoutList size={14} /> : <LayoutList size={14} className="opacity-50" />} {showDetailColumns ? 'Sembunyikan Detail' : 'Tampilkan Detail'}
               </button>
             </div>
          </div>

          {showForm && (
            <div className="animate-fade-in-down mb-8">
              <RasForm existingCategories={uniqueCategories} onSubmit={handleSave} onCancel={() => { setShowForm(false); setEditingData(null); }} initialData={editingData} allData={dataList} />
            </div>
          )}

          <section className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8">
            <div className="p-1">
              <RasMonthlyTable rows={filteredData} year={viewYear} selectedMonths={selectedMonths} onEdit={handleEdit} onDelete={handleDelete} onCellClick={handleCellClick} showNumDenom={showNumDenom} showDetailColumns={showDetailColumns} />
            </div>
          </section>

          <TindakLanjutModal isOpen={showFollowUp} onClose={() => setShowFollowUp(false)} data={followUpData} onSave={handleSaveFollowUp} />
        </div>
      ) : (
        <div className="animate-fade-in">
          {/* SOLUSI KEBINGUNGAN VIEW YEAR: Alert Banner Khusus Tahunan */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 shadow-sm flex items-start gap-3">
             <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
               <AlertTriangle size={20} />
             </div>
             <div>
               <h3 className="text-orange-900 font-bold text-sm">Mode Perencanaan RAS Tahunan</h3>
               <p className="text-orange-800 text-xs mt-1">
                 Anda sedang melihat dan merencanakan target untuk Tahun <b>{viewYear}</b>. 
                 Data historis dan statistik diambil dari realisasi Tahun <b>{viewYear-1}</b> dan <b>{viewYear-2}</b>.
               </p>
             </div>
          </div>

          <div className="flex items-center gap-3 text-sm bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6">
            <span className="text-gray-500">Target Tahun:</span>
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
              {viewYear}
            </span>
            <span className="text-gray-400 italic ml-auto text-xs">
              *Statistik dihitung berdasarkan data historis yang tersedia (Group ID / Nama Parameter sama)
            </span>
          </div>

          <section className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="p-1">
              <RasYearlyTable rows={filteredData} allData={dataList} year={viewYear} onUpdate={handleInlineUpdate} />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}