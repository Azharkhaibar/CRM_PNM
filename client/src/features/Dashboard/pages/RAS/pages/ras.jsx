import React, { useState, useMemo, useEffect } from 'react';
import { Download, Search, ShieldAlert, Plus, Save, RotateCcw } from 'lucide-react';
import RasTable from '../components/data-table-ras';
import RasForm from '../components/form-ras';
// --- Utils Sederhana untuk Waktu (Bisa ambil dari utils yang ada jika mau) ---
const getCurrentYear = () => new Date().getFullYear();
const getCurrentQuarter = () => {
  const month = new Date().getMonth() + 1;
  if (month <= 3) return 'Q1';
  if (month <= 6) return 'Q2';
  if (month <= 9) return 'Q3';
  return 'Q4';
};

const MOCK_RAS_DATA = [
  {
    id: 1,
    riskCategory: 'Investasi',
    no: 1,
    parameter: 'Maks. Outstanding Emiten Non-Investment Grade terhadap Total Aset',
    rkapTarget: 'N/A',
    dataTypeExplanation: 'Nilai % di akhir bulan periode',
    rasLimit: '0.05',
    riskStance: 'Strategis',
    statement: 'Selera Risiko Investasi berada pada level Strategis merupakan dampak dari upaya Perusahaan untuk mencapai pertumbuhan dan inovasi yang lebih besar dalam jangka panjang...',
    notes: 'RKAP 2025',
    unitType: 'PERCENTAGE',
    manualQuarterValue: '0',
    hasNumeratorDenominator: false,
  },
  {
    id: 2,
    riskCategory: 'Pasar',
    no: 2,
    parameter: 'Maks. Unrealized Loss Dibandingkan Total Aset',
    rkapTarget: 'N/A',
    dataTypeExplanation: 'Nilai % di akhir bulan periode',
    rasLimit: '-0.05',
    riskStance: 'Strategis',
    statement: 'Selera Risiko Pasar berada pada level Strategis mengikuti kewajiban Perusahaan dalam memastikan kecukupan AUM produk dalam upaya meningkatkan pangsa pasar dan kepatuhan...',
    notes: 'Maks 3 Year',
    unitType: 'PERCENTAGE',
    manualQuarterValue: '-0.02',
    hasNumeratorDenominator: true,
    numeratorLabel: 'Unrealized Loss',
    numeratorValue: -7483,
    denominatorLabel: 'Total Aset',
    denominatorValue: 258964,
  },
  {
    id: 3,
    riskCategory: 'Likuiditas',
    no: 3,
    parameter: 'Min. Current Ratio',
    rkapTarget: '39X',
    dataTypeExplanation: 'Nilai % di akhir bulan periode',
    rasLimit: '6X',
    riskStance: 'Moderat',
    statement: 'Selera Risiko Likuiditas berada pada level Moderat sebagai dampak pinjaman yang diterima Perusahaan dalam rangka penerbitan produk baru untuk meningkatkan AUM...',
    notes: '1.1x Treshold POJK',
    unitType: 'X',
    manualQuarterValue: '68X',
    hasNumeratorDenominator: true,
    numeratorLabel: 'Aset Lancar',
    numeratorValue: 1500,
    denominatorLabel: 'Kewajiban Lancar',
    denominatorValue: 3254,
  },
  {
    id: 4,
    riskCategory: 'Operasional Non IT',
    no: 4,
    parameter: 'Maks. Kerugian Operasional terhadap Pendapatan Operasional',
    rkapTarget: '0',
    dataTypeExplanation: 'Jumlah akumulasi selama periode berjalan',
    rasLimit: '0,20%',
    riskStance: 'Tidak Toleran',
    statement: 'Selera Risiko Operasional- Non IT berada pada level Tidak Toleran Perusahaan tidak mentolerir terjadinya kasus hukum pada kegiatan usahanya...',
    notes: 'AVG 3 Year +1 STDev',
    unitType: 'PERCENTAGE',
    manualQuarterValue: '0',
    hasNumeratorDenominator: false,
  },
];

const YearInput = ({ value, onChange }) => (
  <select value={value} onChange={(e) => onChange(Number(e.target.value))} className="rounded-xl border border-gray-300 px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-black font-medium">
    {[2023, 2024, 2025, 2026].map((y) => (
      <option key={y} value={y}>
        {y}
      </option>
    ))}
  </select>
);

const QuarterSelect = ({ value, onChange }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-xl border border-gray-300 px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-black font-medium">
    {['Q1', 'Q2', 'Q3', 'Q4'].map((q) => (
      <option key={q} value={q}>
        {q}
      </option>
    ))}
  </select>
);

// Fallback form data kosong
const rasFallbackEmpty = (year, quarter) => ({
  year,
  quarter,
  riskCategory: '',
  no: '',
  parameter: '',
  rkapTarget: '',
  dataTypeExplanation: '',
  rasLimit: '',
  riskStance: 'Moderat',
  statement: '',
  notes: '',
  actualValue: '',
});

export default function Ras() {
  // State
  const [viewYear, setViewYear] = useState(getCurrentYear());
  const [viewQuarter, setViewQuarter] = useState(getCurrentQuarter());
  const [searchQuery, setSearchQuery] = useState('');

  // Data State (Mocking DB)
  const [dataList, setDataList] = useState(MOCK_RAS_DATA);
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState(null);

  // Filter Data
  const filteredData = useMemo(() => {
    return dataList.filter((item) => {
      // Filter sederhana berdasarkan search query
      const matchSearch =
        item.parameter.toLowerCase().includes(searchQuery.toLowerCase()) || item.riskCategory.toLowerCase().includes(searchQuery.toLowerCase()) || (item.statement && item.statement.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSearch;
    });
  }, [dataList, searchQuery]);

  // Mendapatkan list kategori unik untuk dropdown di form
  const uniqueCategories = useMemo(() => {
    return [...new Set(dataList.map((item) => item.riskCategory))];
  }, [dataList]);

  // CRUD Handlers
  const handleSave = (formData) => {
    let newDataList = [...dataList];

    if (editingData) {
      // Logic Update: Cari ID yang sama dan ganti datanya
      newDataList = newDataList.map((item) => (item.id === editingData.id ? { ...formData, id: item.id } : item));
    } else {
      // Logic Create:
      // 1. Buat ID baru
      const newItem = { ...formData, id: Date.now() };

      // 2. Cari posisi insert agar tetap grouping per kategori
      // (Kita cari index terakhir dari kategori yang sama)
      const lastIndexInCategory = newDataList.findLastIndex((d) => d.riskCategory === formData.riskCategory);

      let insertIndex;
      if (lastIndexInCategory !== -1) {
        insertIndex = lastIndexInCategory + 1;
      } else {
        // Kategori baru, taruh paling bawah
        insertIndex = newDataList.length;
      }

      // 3. Masukkan item
      newDataList.splice(insertIndex, 0, newItem);
    }

    // --- RE-INDEXING (Penomoran Otomatis 1, 2, 3...) ---
    // Kita urutkan ulang berdasarkan urutan kategori, lalu beri nomor urut
    const groups = {};
    const categoriesOrder = [];

    // Grouping
    newDataList.forEach((item) => {
      if (!groups[item.riskCategory]) {
        groups[item.riskCategory] = [];
        categoriesOrder.push(item.riskCategory);
      }
      groups[item.riskCategory].push(item);
    });

    // Flattening & Numbering
    let reindexedList = [];
    let counter = 1;

    categoriesOrder.forEach((cat) => {
      const items = groups[cat];
      items.forEach((item) => {
        reindexedList.push({ ...item, no: counter++ });
      });
    });

    setDataList(reindexedList);
    setShowForm(false);
    setEditingData(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus data ini?')) {
      const filtered = dataList.filter((item) => item.id !== id);

      // Re-index setelah delete
      const reindexed = filtered.map((item, index) => ({
        ...item,
        no: index + 1,
      }));

      setDataList(reindexed);
    }
  };

  const handleEdit = (item) => {
    setEditingData(item);
    setShowForm(true);
    // Scroll ke atas agar form terlihat
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExport = () => {
    alert('Fitur export belum diimplementasikan.');
  };

  // --- RENDER ---
  return (
    <div className="space-y-6 mx-auto pb-12">
      {/* 1. HEADER & FILTER */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg text-white p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Risk Appetite Statement</h1>
            <p className="text-blue-100 text-sm">Monitoring Profil Risiko & RAS</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <YearInput value={viewYear} onChange={setViewYear} />
          <QuarterSelect value={viewQuarter} onChange={setViewQuarter} />
          <div className="relative group">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari parameter..."
              className="pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/70 w-48 focus:w-64 transition-all backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
          </div>
          <button onClick={handleExport} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-white text-blue-600 font-semibold hover:bg-gray-100 transition-all shadow-lg">
            <Download className="w-5 h-5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </header>

      {/* 2. SUMMARY & BUTTON ADD */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-500">Periode Tampil:</span>
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-100">
            {viewYear} - {viewQuarter}
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">Total Data:</span>
          <span className="font-bold text-gray-800">{filteredData.length}</span>
        </div>

        {!showForm && (
          <button
            onClick={() => {
              setEditingData(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-blue-700 transition-all transform active:scale-95 text-sm font-semibold"
          >
            <Plus size={18} /> Tambah Data
          </button>
        )}
      </div>

      {/* 3. FORM SECTION (Conditional Rendering) */}
      {showForm && (
        <div className="animate-fade-in-down">
          <RasForm
            existingCategories={uniqueCategories}
            onSubmit={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingData(null);
            }}
            initialData={editingData}
          />
        </div>
      )}

      {/* 4. TABLE SECTION (Selalu Muncul di Bawah Form) */}
      <section className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-1">
          {/* Mengirimkan props yang dibutuhkan oleh RasTable baru */}
          <RasTable rows={filteredData} year={viewYear} quarter={viewQuarter} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </section>
    </div>
  );
}
