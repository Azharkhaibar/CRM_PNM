import React, { useMemo, useState } from 'react';
import { Download, Plus, Check, X, Trash2, Edit3, Search } from 'lucide-react';
import { TextField, TextAreaField, NumberField, YearInput, QuarterSelect, ReadOnlyField } from './components/kpmr-investasi/input';
import { exportKPMRInvestasiToExcel } from './utils/kpmr/exportExcelKpmr';

/** Struktur form per section */
const EMPTY_FORM = {
  year: new Date().getFullYear(),
  quarter: 'Q1',

  // Aspek
  aspekNo: 'Aspek 1',
  aspekTitle: 'Tata Kelola Risiko',
  aspekBobot: 30,

  // Section
  sectionNo: '1',
  sectionTitle: 'Bagaimana perumusan tingkat risiko yang akan diambil (risk appetite) dan toleransi risiko (risk tolerance) terkait risiko investasi?',
  sectionSkor: '',

  // Isi level 1..5
  level1: '',
  level2: '',
  level3: '',
  level4: '',
  level5: '',

  evidence: '',
};

export default function KPMR() {
  // Periode + tools
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewQuarter, setViewQuarter] = useState('Q1');
  const [query, setQuery] = useState('');

  // Data
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ ...EMPTY_FORM, year: viewYear, quarter: viewQuarter });
  const [editingIndex, setEditingIndex] = useState(null);

  const handleChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const filtered = useMemo(() => {
    return rows
      .filter((r) => r.year === viewYear && r.quarter === viewQuarter)
      .filter((r) => `${r.aspekNo} ${r.aspekTitle} ${r.sectionNo} ${r.sectionTitle} ${r.evidence} ${r.level1} ${r.level2} ${r.level3} ${r.level4} ${r.level5}`.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => {
        const aA = `${a.aspekNo}`.localeCompare(`${b.aspekNo}`, undefined, { numeric: true });
        if (aA !== 0) return aA;
        return `${a.sectionNo}`.localeCompare(`${b.sectionNo}`, undefined, { numeric: true });
      });
  }, [rows, viewYear, viewQuarter, query]);

  // Group by Aspek
  const groups = useMemo(() => {
    const g = new Map();
    for (const r of filtered) {
      const k = `${r.aspekNo}|${r.aspekTitle}|${r.aspekBobot}`;
      if (!g.has(k)) g.set(k, []);
      g.get(k).push(r);
    }
    return Array.from(g.entries()).map(([k, items]) => {
      const [aspekNo, aspekTitle, aspekBobot] = k.split('|');
      return {
        aspekNo,
        aspekTitle,
        aspekBobot: Number(aspekBobot),
        items,
      };
    });
  }, [filtered]);

  const resetForm = () =>
    setForm((prev) => ({
      ...EMPTY_FORM,
      year: viewYear,
      quarter: viewQuarter,
      aspekNo: prev.aspekNo,
      aspekTitle: prev.aspekTitle,
      aspekBobot: prev.aspekBobot,
    }));

  const addRow = () => {
    setRows((r) => [...r, { ...form }]);
    resetForm();
  };

  const startEdit = (idx) => {
    setEditingIndex(idx);
    setForm({ ...filtered[idx] });
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    // cari index asli di rows (bukan filtered) supaya aman
    const target = filtered[editingIndex];
    const id = rows.findIndex((x) => x.year === target.year && x.quarter === target.quarter && x.aspekNo === target.aspekNo && x.sectionNo === target.sectionNo && x.sectionTitle === target.sectionTitle);
    const updated = [...rows];
    if (id !== -1) updated[id] = { ...form };
    setRows(updated);
    setEditingIndex(null);
    resetForm();
  };

  const removeRow = (idx) => {
    const target = filtered[idx];
    const id = rows.findIndex((x) => x.year === target.year && x.quarter === target.quarter && x.aspekNo === target.aspekNo && x.sectionNo === target.sectionNo && x.sectionTitle === target.sectionTitle);
    if (id !== -1) {
      setRows((r) => r.filter((_, i) => i !== id));
      if (editingIndex === idx) {
        setEditingIndex(null);
        resetForm();
      }
    }
  };

  const exportExcel = () =>
    exportKPMRInvestasiToExcel({
      year: viewYear,
      quarter: viewQuarter,
      rows: filtered,
    });

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Header tools - Modern Design */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg text-white p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">KPMR – Investasi</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <YearInput
              value={viewYear}
              onChange={(v) => {
                setViewYear(v);
                setForm((f) => ({ ...f, year: v }));
              }}
              className="bg-white/10 border-white/20 text-white placeholder-white/70"
            />
            <QuarterSelect
              value={viewQuarter}
              onChange={(v) => {
                setViewQuarter(v);
                setForm((f) => ({ ...f, quarter: v }));
              }}
              className="bg-white/10 border-white/20 text-white"
            />

            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari aspek/section/evidence…"
                className="pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/70 w-64 backdrop-blur-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
            </div>

            <button onClick={exportExcel} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-white text-blue-600 font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl">
              <Download className="w-5 h-5" />
              Export {viewYear}-{viewQuarter}
            </button>
          </div>
        </div>
      </header>

      {/* FORM - Modern Design */}
      <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Form KPMR – Investasi</h2>
            </div>
            <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
              <span className="text-sm font-medium text-gray-600">Periode: </span>
              <span className="text-sm font-bold text-blue-600">
                {form.year}-{form.quarter}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* KIRI – Meta Aspek & Section */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField label="Aspek (No)" value={form.aspekNo} onChange={(value) => handleChange('aspekNo', value)} placeholder="Masukkan nomor aspek" />

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    Bobot Aspek
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      className="w-full rounded-xl border border-gray-300 pl-4 pr-12 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      value={form.aspekBobot}
                      onChange={(e) => handleChange('aspekBobot', e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                      min="0"
                      max="100"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">%</span>
                  </div>
                </div>
              </div>

              <TextField label="Judul Aspek" value={form.aspekTitle} onChange={(value) => handleChange('aspekTitle', value)} placeholder="Masukkan judul aspek" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextField label="No Section" value={form.sectionNo} onChange={(value) => handleChange('sectionNo', value)} placeholder="Nomor section" />

                <NumberField label="Skor Section" value={form.sectionSkor} onChange={(value) => handleChange('sectionSkor', value)} min={0} max={5} placeholder="0" />

                <ReadOnlyField
                  label="Skor Average"
                  value={(() => {
                    const sameAspek = filtered.filter((r) => r.aspekNo === form.aspekNo && r.aspekTitle === form.aspekTitle);
                    const nums = sameAspek.map((r) => (r.sectionSkor === '' ? null : Number(r.sectionSkor))).filter((v) => v != null && !isNaN(v));
                    return nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2) : '';
                  })()}
                />
              </div>

              <TextAreaField label="Pertanyaan Section" value={form.sectionTitle} onChange={(value) => handleChange('sectionTitle', value)} placeholder="Masukkan pertanyaan section" />

              <TextAreaField label="Evidence" value={form.evidence} onChange={(value) => handleChange('evidence', value)} placeholder="Masukkan evidence yang diperlukan" />
            </div>

            {/* KANAN – 5 Level (kartu modern) */}
            <div className="space-y-4">
              {[
                { level: 1, title: 'Strong', color: 'from-green-500 to-emerald-600', bg: 'bg-green-50', border: 'border-green-200' },
                { level: 2, title: 'Satisfactory', color: 'from-lime-500 to-green-500', bg: 'bg-lime-50', border: 'border-lime-200' },
                { level: 3, title: 'Fair', color: 'from-yellow-500 to-amber-500', bg: 'bg-yellow-50', border: 'border-yellow-200' },
                { level: 4, title: 'Marginal', color: 'from-orange-500 to-red-500', bg: 'bg-orange-50', border: 'border-orange-200' },
                { level: 5, title: 'Unsatisfactory', color: 'from-red-500 to-rose-600', bg: 'bg-red-50', border: 'border-red-200' },
              ].map((item) => (
                <div key={item.level} className={`rounded-2xl border-2 ${item.border} ${item.bg} overflow-hidden transition-all duration-200 hover:shadow-md`}>
                  <div className={`bg-gradient-to-r ${item.color} px-4 py-3`}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{item.level}</span>
                      </div>
                      <span className="text-white font-semibold text-sm">{item.title}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <TextAreaField value={form[`level${item.level}`]} onChange={(value) => handleChange(`level${item.level}`, value)} placeholder={`Deskripsi level ${item.title}...`} className="mb-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tombol Simpan */}
          <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
            <button
              onClick={addRow}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <Check className="w-5 h-5" />
              Simpan Data
            </button>
          </div>
        </div>
      </section>

      {/* TABEL HASIL - Responsive Design */}
      <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              Data KPMR – Investasi ({viewYear}-{viewQuarter})
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <th className="border border-blue-500 px-4 py-3 text-left font-semibold text-sm" colSpan={2}>
                  KUALITAS PENERAPAN MANAJEMEN RISIKO
                </th>
                <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm w-20" rowSpan={2}>
                  Skor
                </th>
                <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm w-32" rowSpan={2}>
                  1 (Strong)
                </th>
                <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm w-32" rowSpan={2}>
                  2 (Satisfactory)
                </th>
                <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm w-32" rowSpan={2}>
                  3 (Fair)
                </th>
                <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm w-32" rowSpan={2}>
                  4 (Marginal)
                </th>
                <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm w-36" rowSpan={2}>
                  5 (Unsatisfactory)
                </th>
                <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm w-48" rowSpan={2}>
                  Evidence
                </th>
              </tr>
              <tr className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm w-16">No</th>
                <th className="border border-blue-500 px-4 py-3 text-center font-semibold text-sm">Pertanyaan / Indikator</th>
              </tr>
            </thead>

            <tbody>
              {groups.length === 0 ? (
                <tr>
                  <td className="border border-gray-200 px-4 py-8 text-center text-gray-500" colSpan={9}>
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                      <span className="text-lg font-medium text-gray-400">Belum ada data</span>
                    </div>
                  </td>
                </tr>
              ) : (
                groups.map((g, gi) => {
                  const vals = g.items.map((it) => (it.sectionSkor === '' ? null : Number(it.sectionSkor))).filter((v) => v != null && !isNaN(v));
                  const skorAspek = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : '';

                  return (
                    <React.Fragment key={gi}>
                      {/* BARIS ASPEK */}
                      <tr className="bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-colors duration-150">
                        <td className="border border-gray-200 px-4 py-3 font-semibold text-gray-800" colSpan={2}>
                          <div className="flex items-center gap-2">
                            <span>
                              {g.aspekNo} : {g.aspekTitle}
                            </span>
                            <span className="text-sm text-gray-600 font-normal">(Bobot: {g.aspekBobot}%)</span>
                          </div>
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-center font-bold text-gray-800 bg-green-100">{skorAspek}</td>
                        <td className="border border-gray-200 px-4 py-3" colSpan={5}></td>
                        <td className="border border-gray-200 px-4 py-3"></td>
                      </tr>

                      {/* BARIS SECTION */}
                      {g.items.map((r, idx) => {
                        const filteredIndex = filtered.findIndex((x) => x.year === r.year && x.quarter === r.quarter && x.aspekNo === r.aspekNo && x.sectionNo === r.sectionNo && x.sectionTitle === r.sectionTitle);
                        return (
                          <tr key={`${gi}-${idx}`} className="hover:bg-blue-50 transition-colors duration-150 group">
                            <td className="border border-gray-200 px-4 py-3 text-center font-medium text-gray-700">{r.sectionNo}</td>
                            <td className="border border-gray-200 px-4 py-3 whitespace-pre-wrap text-gray-600 text-sm">{r.sectionTitle}</td>
                            <td className="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-800">{r.sectionSkor}</td>
                            <td className="border border-gray-200 px-4 py-3 whitespace-pre-wrap text-xs text-gray-600 max-w-32 truncate">{r.level1}</td>
                            <td className="border border-gray-200 px-4 py-3 whitespace-pre-wrap text-xs text-gray-600 max-w-32 truncate">{r.level2}</td>
                            <td className="border border-gray-200 px-4 py-3 whitespace-pre-wrap text-xs text-gray-600 max-w-32 truncate">{r.level3}</td>
                            <td className="border border-gray-200 px-4 py-3 whitespace-pre-wrap text-xs text-gray-600 max-w-32 truncate">{r.level4}</td>
                            <td className="border border-gray-200 px-4 py-3 whitespace-pre-wrap text-xs text-gray-600 max-w-32 truncate">{r.level5}</td>
                            <td className="border border-gray-200 px-4 py-3">
                              <div className="flex items-center justify-between gap-3">
                                <span className="flex-1 text-xs text-gray-600 whitespace-pre-wrap max-w-48 truncate">{r.evidence}</span>
                                <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <button
                                    onClick={() => startEdit(filteredIndex)}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-150 text-xs font-medium"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => removeRow(filteredIndex)}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-150 text-xs font-medium"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    Hapus
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
