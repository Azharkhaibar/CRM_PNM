import React, { useState, useMemo, useEffect } from 'react';
import { Download, Search, ShieldAlert, Plus, Save, RotateCcw } from 'lucide-react';
import FormRAS from './components/form-ras';
import DataTableRAS from './components/datatable-ras';

// --- Utils Sederhana untuk Waktu (Bisa ambil dari utils yang ada jika mau) ---
const getCurrentYear = () => new Date().getFullYear();
const getCurrentQuarter = () => {
  const month = new Date().getMonth() + 1;
  if (month <= 3) return 'Q1';
  if (month <= 6) return 'Q2';
  if (month <= 9) return 'Q3';
  return 'Q4';
};

// --- Mock Data Awal (Berdasarkan CSV Anda) ---
const MOCK_RAS_DATA = [
  {
    id: 1,
    year: 2025,
    quarter: 'Q2',
    riskCategory: 'Investasi',
    no: 1,
    parameter: 'Maks. Outstanding Emiten Non-Investment Grade terhadap Total Aset',
    rkapTarget: 'N/A',
    dataTypeExplanation: 'Nilai % di akhir bulan periode',
    rasLimit: '0.05',
    riskStance: 'Strategis',
    statement: 'Selera Risiko Investasi berada pada level Strategis merupakan dampak dari upaya Perusahaan...',
    notes: 'RKAP 2025',
    actualValue: '0'
  },
  {
    id: 2,
    year: 2025,
    quarter: 'Q2',
    riskCategory: 'Pasar',
    no: 2,
    parameter: 'Maks. Unrealized Loss Dibandingkan Total Aset',
    rkapTarget: 'N/A',
    dataTypeExplanation: 'Nilai % di akhir bulan periode',
    rasLimit: '-0.05',
    riskStance: 'Strategis',
    statement: 'Selera Risiko Pasar berada pada level Strategis mengikuti kewajiban Perusahaan...',
    notes: 'Maks 3 Year',
    actualValue: '-0.0289'
  },
  {
    id: 3,
    year: 2025,
    quarter: 'Q2',
    riskCategory: 'Likuiditas',
    no: 3,
    parameter: 'Min. Current Ratio',
    rkapTarget: '39X',
    dataTypeExplanation: 'Nilai % di akhir bulan periode',
    rasLimit: '6X',
    riskStance: 'Moderat',
    statement: 'Selera Risiko Likuiditas berada pada level Moderat sebagai dampak pinjaman...',
    notes: '1.1x Treshold POJK',
    actualValue: '68X'
  },
  {
    id: 4,
    year: 2025,
    quarter: 'Q2',
    riskCategory: 'Operasional Non IT',
    no: 4,
    parameter: 'Maks. Kerugian Operasional terhadap Pendapatan Operasional',
    rkapTarget: '0',
    dataTypeExplanation: 'Jumlah akumulasi selama periode berjalan',
    rasLimit: '0,20%',
    riskStance: 'Tidak Toleran',
    statement: 'Selera Risiko Operasional- Non IT berada pada level Tidak Toleran...',
    notes: 'AVG 3 Year +1 STDev',
    actualValue: '0'
  }
];

const YearInput = ({ value, onChange }) => (
  <select value={value} onChange={(e) => onChange(Number(e.target.value))} className="rounded-xl border border-gray-300 px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium">
    {[2023, 2024, 2025, 2026].map((y) => (
      <option key={y} value={y}>{y}</option>
    ))}
  </select>
);

const QuarterSelect = ({ value, onChange }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-xl border border-gray-300 px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium">
    {['Q1', 'Q2', 'Q3', 'Q4'].map((q) => (
      <option key={q} value={q}>{q}</option>
    ))}
  </select>
);

// Fallback form data kosong
const rasFallbackEmpty = (year, quarter) => ({
  year,
  quarter,
  riskCategory: 'Investasi',
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

export default function RASPage() {
  // State
  const [viewYear, setViewYear] = useState(getCurrentYear());
  const [viewQuarter, setViewQuarter] = useState(getCurrentQuarter());
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Data State (Mocking DB)
  const [dataList, setDataList] = useState(MOCK_RAS_DATA);
  const [form, setForm] = useState(rasFallbackEmpty(viewYear, viewQuarter));
  const [editingId, setEditingId] = useState(null);

  // Filter Data
  const filteredData = useMemo(() => {
    return dataList.filter(item => {
      const matchPeriod = item.year === viewYear; // Bisa tambah filter quarter jika perlu
      const matchQuery = 
        item.parameter.toLowerCase().includes(query.toLowerCase()) || 
        item.riskCategory.toLowerCase().includes(query.toLowerCase()) ||
        item.statement.toLowerCase().includes(query.toLowerCase());
      return matchPeriod && matchQuery;
    }).sort((a, b) => a.no - b.no);
  }, [dataList, viewYear, query]);

  // CRUD Handlers (Mock)
  const handleAdd = async (newData) => {
    setLoading(true);
    setTimeout(() => {
      const newEntry = { ...newData, id: Date.now(), year: viewYear, quarter: viewQuarter };
      setDataList(prev => [...prev, newEntry]);
      handleReset();
      setLoading(false);
      alert('Data RAS berhasil ditambahkan!');
    }, 500);
  };

  const handleUpdate = async (updatedData) => {
    if (!editingId) return;
    setLoading(true);
    setTimeout(() => {
      setDataList(prev => prev.map(item => item.id === editingId ? { ...updatedData, id: editingId } : item));
      handleReset();
      setLoading(false);
      alert('Data RAS berhasil diperbarui!');
    }, 500);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Hapus data parameter: ${item.parameter}?`)) {
      setDataList(prev => prev.filter(d => d.id !== item.id));
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
    // Scroll to top implementation if needed
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setForm(rasFallbackEmpty(viewYear, viewQuarter));
    setEditingId(null);
  };

  const handleExport = () => {
    alert('Fitur export ke Excel akan diimplementasikan di sini.');
  };

  return (
    <div className="space-y-6 mx-auto">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg text-white p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Risk Appetite Statement</h1>
            <p className="text-blue-100 text-sm">Monitoring dan penetapan selera risiko perusahaan</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <YearInput value={viewYear} onChange={setViewYear} />
          <QuarterSelect value={viewQuarter} onChange={setViewQuarter} />
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari parameter / statement..."
              className="pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/70 w-64 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
          </div>
          <button onClick={handleExport} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-white text-blue-600 font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </header>

      {/* Form Section */}
      <FormRAS 
        form={form} 
        setForm={setForm} 
        onAdd={handleAdd} 
        onSave={handleUpdate} 
        onReset={handleReset} 
        editing={editingId !== null} 
        loading={loading}
      />

      {/* Data Table Section */}
      <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Periode Data:</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold">{viewYear} - {viewQuarter}</span>
          </div>
          <div className="text-sm text-gray-500">Total Parameter: {filteredData.length}</div>
        </div>
        
        <DataTableRAS 
          rows={filteredData} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      </section>
    </div>
  );
}