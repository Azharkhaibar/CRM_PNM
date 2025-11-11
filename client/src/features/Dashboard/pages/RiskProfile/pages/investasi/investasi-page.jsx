import React, { useState, useMemo } from 'react';
import { Download, Check, X, Trash2, Edit3, Search } from 'lucide-react';

// ==== KOMponen & Utils Investasi (yang SUDAH ada di project kamu) ====
import FormSection from '../../../components/Form';
import DataTable from '../../../components/DataTable';
import { YearInput, QuarterSelect } from '../../../components/Inputs';
import { getCurrentQuarter, getCurrentYear } from '../utils/time';
import { computeWeighted, makeEmptyRow } from '../utils/calc';
import { exportInvestasiToExcel } from '../utils/exportExcel';

// ==== Utils Export KPMR (sudah kamu pakai) ====
import { exportKPMRInvestasiToExcel } from '../utils/exportExcelKPMR';

// ===================== KPMR: Template form per section =====================
const KPMR_EMPTY_FORM = {
  year: getCurrentYear ? getCurrentYear() : new Date().getFullYear(),
  quarter: getCurrentQuarter ? getCurrentQuarter() : 'Q1',

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

// ===================== Investasi: fallback empty row =====================
// Jika utils/makeEmptyRow belum tersedia, gunakan fallback lokal
const invFallbackEmpty = (year, quarter) => ({
  year,
  quarter,
  no: '1',
  subNo: '1.1',
  sectionLabel: '',
  indikator: '',
  bobotSection: 0,
  bobotIndikator: 0,
  sumberRisiko: '',
  dampak: '',
  low: '',
  lowToModerate: '',
  moderate: '',
  moderateToHigh: '',
  high: '',
  numeratorLabel: '',
  numeratorValue: '',
  denominatorLabel: '',
  denominatorValue: '',
  hasil: '',
  peringkat: 1,
  weighted: '',
  keterangan: '',
});

export default function Investasi() {
  // ====== Tabs ======
  const [activeTab, setActiveTab] = useState('investasi');

  // ====== Periode + search (dipakai dua tab, tapi state-nya tidak sharing data) ======
  const [viewYear, setViewYear] = useState(getCurrentYear ? getCurrentYear() : new Date().getFullYear());
  const [viewQuarter, setViewQuarter] = useState(getCurrentQuarter ? getCurrentQuarter() : 'Q1');
  const [query, setQuery] = useState('');

  // ---------------------------------------------------------------------------
  //                              TAB INVESTASI
  // ---------------------------------------------------------------------------

  // State data Investasi (MANDIRI, tidak bercampur KPMR)
  const invMakeRow = () => (typeof makeEmptyRow === 'function' ? { ...makeEmptyRow(), year: viewYear, quarter: viewQuarter } : invFallbackEmpty(viewYear, viewQuarter));
  const [INVESTASI_rows, setINVESTASI_rows] = useState([]);
  const [INVESTASI_form, setINVESTASI_form] = useState(invMakeRow());
  const [INVESTASI_editingIndex, setINVESTASI_editingIndex] = useState(null);

  // Filter periode + pencarian untuk tabel Investasi
  const INVESTASI_filtered = useMemo(() => {
    return INVESTASI_rows.filter((r) => r.year === viewYear && r.quarter === viewQuarter)
      .filter((r) => `${r.no} ${r.subNo} ${r.sectionLabel} ${r.indikator} ${r.keterangan} ${r.sumberRisiko} ${r.dampak}`.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => `${a.subNo}`.localeCompare(`${b.subNo}`, undefined, { numeric: true }));
  }, [INVESTASI_rows, viewYear, viewQuarter, query]);

  // Total weighted untuk summary Investasi (kalau DataTable kamu butuh)
  const INVESTASI_totalWeighted = useMemo(() => {
    return INVESTASI_filtered.reduce((sum, r) => sum + (Number(r.weighted || 0) || 0), 0);
  }, [INVESTASI_filtered]);

  // CRUD Investasi
  const INVESTASI_resetForm = () => {
    setINVESTASI_form(invMakeRow());
    setINVESTASI_editingIndex(null);
  };

  const INVESTASI_addRow = () => {
    const num = Number(INVESTASI_form.numeratorValue || 0);
    const den = Number(INVESTASI_form.denominatorValue || 0);
    const hasil = den ? +(num / den).toFixed(4) : 0;
    const weightedAuto = computeWeighted ? computeWeighted(INVESTASI_form.bobotSection, INVESTASI_form.bobotIndikator, INVESTASI_form.peringkat) : 0;
    const newRow = {
      ...INVESTASI_form,
      hasil: INVESTASI_form.hasil === '' ? hasil : INVESTASI_form.hasil,
      weighted: INVESTASI_form.weighted === '' ? weightedAuto : INVESTASI_form.weighted,
    };
    setINVESTASI_rows((r) => [...r, newRow]);
    INVESTASI_resetForm();
  };

  const INVESTASI_startEdit = (idx) => {
    setINVESTASI_editingIndex(idx);
    setINVESTASI_form({ ...INVESTASI_filtered[idx] });
  };

  const INVESTASI_saveEdit = () => {
    if (INVESTASI_editingIndex === null) return;
    const target = INVESTASI_filtered[INVESTASI_editingIndex];
    const id = INVESTASI_rows.findIndex((x) => x.year === target.year && x.quarter === target.quarter && x.no === target.no && x.subNo === target.subNo && x.sectionLabel === target.sectionLabel && x.indikator === target.indikator);
    if (id !== -1) {
      const num = Number(INVESTASI_form.numeratorValue || 0);
      const den = Number(INVESTASI_form.denominatorValue || 0);
      const hasil = den ? +(num / den).toFixed(4) : 0;
      const weightedAuto = computeWeighted ? computeWeighted(INVESTASI_form.bobotSection, INVESTASI_form.bobotIndikator, INVESTASI_form.peringkat) : 0;
      const updated = [...INVESTASI_rows];
      updated[id] = {
        ...INVESTASI_form,
        hasil: INVESTASI_form.hasil === '' ? hasil : INVESTASI_form.hasil,
        weighted: INVESTASI_form.weighted === '' ? weightedAuto : INVESTASI_form.weighted,
      };
      setINVESTASI_rows(updated);
    }
    INVESTASI_resetForm();
  };

  const INVESTASI_removeRow = (idx) => {
    const target = INVESTASI_filtered[idx];
    const id = INVESTASI_rows.findIndex((x) => x.year === target.year && x.quarter === target.quarter && x.no === target.no && x.subNo === target.subNo && x.sectionLabel === target.sectionLabel && x.indikator === target.indikator);
    if (id !== -1) setINVESTASI_rows((arr) => arr.filter((_, i) => i !== id));
    if (INVESTASI_editingIndex === idx) INVESTASI_resetForm();
  };

  const INVESTASI_exportExcel = () => (exportInvestasiToExcel ? exportInvestasiToExcel(INVESTASI_filtered, viewYear, viewQuarter) : null);

  // ---------------------------------------------------------------------------
  //                              TAB K P M R
  // ---------------------------------------------------------------------------
  const [KPMR_rows, setKPMR_rows] = useState([]);
  const [KPMR_form, setKPMR_form] = useState({ ...KPMR_EMPTY_FORM, year: viewYear, quarter: viewQuarter });
  const [KPMR_editingIndex, setKPMR_editingIndex] = useState(null);

  const KPMR_handleChange = (k, v) => setKPMR_form((f) => ({ ...f, [k]: v }));

  const KPMR_filtered = useMemo(() => {
    return KPMR_rows.filter((r) => r.year === viewYear && r.quarter === viewQuarter)
      .filter((r) => `${r.aspekNo} ${r.aspekTitle} ${r.sectionNo} ${r.sectionTitle} ${r.evidence} ${r.level1} ${r.level2} ${r.level3} ${r.level4} ${r.level5}`.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => {
        const aA = `${a.aspekNo}`.localeCompare(`${b.aspekNo}`, undefined, { numeric: true });
        if (aA !== 0) return aA;
        return `${a.sectionNo}`.localeCompare(`${b.sectionNo}`, undefined, { numeric: true });
      });
  }, [KPMR_rows, viewYear, viewQuarter, query]);

  const KPMR_groups = useMemo(() => {
    const g = new Map();
    for (const r of KPMR_filtered) {
      const k = `${r.aspekNo}|${r.aspekTitle}|${r.aspekBobot}`;
      if (!g.has(k)) g.set(k, []);
      g.get(k).push(r);
    }
    return Array.from(g.entries()).map(([k, items]) => {
      const [aspekNo, aspekTitle, aspekBobot] = k.split('|');
      return { aspekNo, aspekTitle, aspekBobot: Number(aspekBobot), items };
    });
  }, [KPMR_filtered]);

  const KPMR_resetForm = () =>
    setKPMR_form((prev) => ({
      ...KPMR_EMPTY_FORM,
      year: viewYear,
      quarter: viewQuarter,
      aspekNo: prev.aspekNo,
      aspekTitle: prev.aspekTitle,
      aspekBobot: prev.aspekBobot,
    }));

  const KPMR_addRow = () => {
    setKPMR_rows((r) => [...r, { ...KPMR_form }]);
    setKPMR_editingIndex(null);
    KPMR_resetForm();
  };

  const KPMR_startEdit = (idx) => {
    setKPMR_editingIndex(idx);
    setKPMR_form({ ...KPMR_filtered[idx] });
  };

  const KPMR_saveEdit = () => {
    if (KPMR_editingIndex === null) return;
    const target = KPMR_filtered[KPMR_editingIndex];
    const id = KPMR_rows.findIndex((x) => x.year === target.year && x.quarter === target.quarter && x.aspekNo === target.aspekNo && x.sectionNo === target.sectionNo && x.sectionTitle === target.sectionTitle);
    if (id !== -1) {
      const updated = [...KPMR_rows];
      updated[id] = { ...KPMR_form };
      setKPMR_rows(updated);
    }
    setKPMR_editingIndex(null);
    KPMR_resetForm();
  };

  const KPMR_removeRow = (idx) => {
    const target = KPMR_filtered[idx];
    const id = KPMR_rows.findIndex((x) => x.year === target.year && x.quarter === target.quarter && x.aspekNo === target.aspekNo && x.sectionNo === target.sectionNo && x.sectionTitle === target.sectionTitle);
    if (id !== -1) setKPMR_rows((arr) => arr.filter((_, i) => i !== id));
    if (KPMR_editingIndex === idx) {
      setKPMR_editingIndex(null);
      KPMR_resetForm();
    }
  };

  const KPMR_exportExcel = () =>
    exportKPMRInvestasiToExcel({
      year: viewYear,
      quarter: viewQuarter,
      rows: KPMR_filtered,
    });

  // ================================ RENDER ===================================
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Risk Form - Investasi</h1>

      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('investasi')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'investasi' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Investasi
          </button>

          <button
            onClick={() => setActiveTab('kpmr')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'kpmr' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            KPMR Investasi
          </button>
        </nav>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* ================= TAB: INVESTASI ================= */}
        {activeTab === 'investasi' && (
          <>
            <header className="px-4 py-4 flex items-center justify-between gap-3">
              <h2 className="text-xl sm:text-2xl font-semibold">Form – Investasi</h2>
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2">
                  <YearInput
                    value={viewYear}
                    onChange={(v) => {
                      setViewYear(v);
                      // sinkron juga form investasi agar periodenya ikut
                      setINVESTASI_form((f) => ({ ...f, year: v }));
                    }}
                  />
                  <QuarterSelect
                    value={viewQuarter}
                    onChange={(v) => {
                      setViewQuarter(v);
                      setINVESTASI_form((f) => ({ ...f, quarter: v }));
                    }}
                  />
                </div>
                <div className="relative">
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari no/sub/indikator/keterangan…" className="pl-9 pr-3 py-2 rounded-xl border w-64" />
                  <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <button onClick={INVESTASI_exportExcel} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border bg-gray-900 text-white hover:bg-black">
                  <Download size={18} /> Export {viewYear}-{viewQuarter}
                </button>
              </div>
            </header>

            {/* FORM INVESTASI (komponenmu yang sudah ada) */}
            <FormSection form={INVESTASI_form} setForm={setINVESTASI_form} onAdd={INVESTASI_addRow} onSave={INVESTASI_saveEdit} onReset={INVESTASI_resetForm} editing={INVESTASI_editingIndex !== null} />

            {/* Filter periode info */}
            <section className="bg-white rounded-2xl shadow p-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="font-medium">Tampilkan Periode:</div>
                <YearInput value={viewYear} onChange={setViewYear} />
                <QuarterSelect value={viewQuarter} onChange={setViewQuarter} />
                <div className="text-sm text-gray-500">
                  Hanya baris {viewYear}-{viewQuarter} yang ditampilkan.
                </div>
              </div>
            </section>

            {/* TABEL INVESTASI (komponenmu yang sudah ada) */}
            <DataTable rows={INVESTASI_filtered} totalWeighted={INVESTASI_totalWeighted} viewYear={viewYear} viewQuarter={viewQuarter} startEdit={INVESTASI_startEdit} removeRow={INVESTASI_removeRow} />
          </>
        )}

        {/* ================= TAB: KPMR ================= */}
        {activeTab === 'kpmr' && (
          <div className="space-y-6">

            <header className="bg-white rounded-xl border shadow-sm">
              <div className="px-4 py-4 flex items-center justify-between gap-3">
                <h1 className="text-2xl font-bold">KPMR – Investasi</h1>

                <div className="flex items-center gap-2">
                  <YearInput
                    value={viewYear}
                    onChange={(v) => {
                      setViewYear(v);
                      setKPMR_form((f) => ({ ...f, year: v }));
                    }}
                  />
                  <QuarterSelect
                    value={viewQuarter}
                    onChange={(v) => {
                      setViewQuarter(v);
                      setKPMR_form((f) => ({ ...f, quarter: v }));
                    }}
                  />

                  <div className="relative">
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari aspek/section/evidence…" className="pl-9 pr-3 py-2 rounded-xl border w-64" />
                    <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>

                  <button onClick={KPMR_exportExcel} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border bg-gray-900 text-white hover:bg-black">
                    <Download size={18} /> Export {viewYear}-{viewQuarter}
                  </button>
                </div>
              </div>
            </header>
            {/* -------------------------------------------------------------------------------------- */}
            {/* ===== FORM (UI KPMR) ===== */}
            <section className="rounded-xl border shadow p-4 bg-[#DBDBDB]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Form KPMR – Investasi</h2>
                <div className="text-sm text-gray-500">
                  Periode:{' '}
                  <span className="font-medium">
                    {KPMR_form.year}-{KPMR_form.quarter}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* KIRI – Meta Aspek & Section */}
                <div className="space-y-3">
                  {/* Aspek (No) & Bobot */}
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <div className="mb-1 text-sm text-gray-600 font-medium">Aspek (No)</div>
                      <input className="w-full rounded-xl border px-3 py-2 bg-white" value={KPMR_form.aspekNo} onChange={(e) => KPMR_handleChange('aspekNo', e.target.value)} />
                    </label>

                    <label className="block">
                      <div className="mb-1 text-sm text-gray-600 font-medium">Bobot Aspek</div>
                      <div className="relative">
                        <input
                          type="number"
                          className="w-full rounded-xl border pl-3 pr-10 py-2 bg-white"
                          value={KPMR_form.aspekBobot}
                          onChange={(e) => KPMR_handleChange('aspekBobot', e.target.value === '' ? '' : Number(e.target.value))}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                      </div>
                    </label>
                  </div>

                  {/* Judul Aspek */}
                  <label className="block">
                    <div className="mb-1 text-sm text-gray-600 font-medium">Judul Aspek</div>
                    <input className="w-full rounded-xl border px-3 py-2 bg-white" value={KPMR_form.aspekTitle} onChange={(e) => KPMR_handleChange('aspekTitle', e.target.value)} />
                  </label>

                  {/* No Section, Skor Section, Skor Average */}
                  <div className="grid grid-cols-3 gap-3">
                    <label className="block">
                      <div className="mb-1 text-sm text-gray-600 font-medium">No Section</div>
                      <input className="w-full rounded-xl border px-3 py-2 bg-white" value={KPMR_form.sectionNo} onChange={(e) => KPMR_handleChange('sectionNo', e.target.value)} />
                    </label>

                    <label className="block">
                      <div className="mb-1 text-sm text-gray-600 font-medium">Skor Section</div>
                      <input type="number" className="w-full rounded-xl border px-3 py-2 bg-white" value={KPMR_form.sectionSkor} onChange={(e) => KPMR_handleChange('sectionSkor', e.target.value === '' ? '' : Number(e.target.value))} />
                    </label>

                    <label className="block">
                      <div className="mb-1 text-sm text-gray-600 font-medium">Skor Average</div>
                      <input
                        className="w-full rounded-xl border px-3 py-2 bg-gray-50"
                        value={(() => {
                          const sameAspek = KPMR_filtered.filter((r) => r.aspekNo === KPMR_form.aspekNo && r.aspekTitle === KPMR_form.aspekTitle);
                          const nums = sameAspek.map((r) => (r.sectionSkor === '' ? null : Number(r.sectionSkor))).filter((v) => v != null && !isNaN(v));
                          return nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2) : '';
                        })()}
                        readOnly
                      />
                    </label>
                  </div>

                  {/* Pertanyaan Section */}
                  <label className="block">
                    <div className="mb-1 text-sm text-gray-600 font-medium">Pertanyaan Section</div>
                    <textarea className="w-full rounded-xl border px-3 py-2 bg-white min-h-[64px]" value={KPMR_form.sectionTitle} onChange={(e) => KPMR_handleChange('sectionTitle', e.target.value)} />
                  </label>

                  {/* Evidence */}
                  <label className="block">
                    <div className="mb-1 text-sm text-gray-600 font-medium">Evidence</div>
                    <textarea className="w-full rounded-xl border px-3 py-2 bg-white min-h-[56px]" value={KPMR_form.evidence} onChange={(e) => KPMR_handleChange('evidence', e.target.value)} />
                  </label>
                </div>

                {/* KANAN – 5 Level (kartu kecil) */}
                <div className="space-y-3">
                  {/* 1 */}
                  <div className="rounded-xl border shadow-sm bg-white">
                    <div className="px-3 pt-3 text-[13px] font-semibold">1. Strong</div>
                    <div className="p-3">
                      <textarea className="w-full rounded-lg border px-3 py-2 bg-white min-h-[56px]" value={KPMR_form.level1} onChange={(e) => KPMR_handleChange('level1', e.target.value)} placeholder="Deskripsi 1 (Strong)…" />
                    </div>
                  </div>

                  {/* 2 */}
                  <div className="rounded-xl border shadow-sm bg-white">
                    <div className="px-3 pt-3 text-[13px] font-semibold">2. Satisfactory</div>
                    <div className="p-3">
                      <textarea className="w-full rounded-lg border px-3 py-2 bg-white min-h-[56px]" value={KPMR_form.level2} onChange={(e) => KPMR_handleChange('level2', e.target.value)} placeholder="Deskripsi 2 (Satisfactory)…" />
                    </div>
                  </div>

                  {/* 3 */}
                  <div className="rounded-xl border shadow-sm bg-white">
                    <div className="px-3 pt-3 text-[13px] font-semibold">3. Fair</div>
                    <div className="p-3">
                      <textarea className="w-full rounded-lg border px-3 py-2 bg-white min-h-[56px]" value={KPMR_form.level3} onChange={(e) => KPMR_handleChange('level3', e.target.value)} placeholder="Deskripsi 3 (Fair)…" />
                    </div>
                  </div>

                  {/* 4 */}
                  <div className="rounded-xl border shadow-sm bg-white">
                    <div className="px-3 pt-3 text-[13px] font-semibold">4. Marginal</div>
                    <div className="p-3">
                      <textarea className="w-full rounded-lg border px-3 py-2 bg-white min-h-[56px]" value={KPMR_form.level4} onChange={(e) => KPMR_handleChange('level4', e.target.value)} placeholder="Deskripsi 4 (Marginal)…" />
                    </div>
                  </div>

                  {/* 5 */}
                  <div className="rounded-xl border shadow-sm bg-white">
                    <div className="px-3 pt-3 text-[13px] font-semibold">5. Unsatisfactory</div>
                    <div className="p-3">
                      <textarea className="w-full rounded-lg border px-3 py-2 bg-white min-h-[56px]" value={KPMR_form.level5} onChange={(e) => KPMR_handleChange('level5', e.target.value)} placeholder="Deskripsi 5 (Unsatisfactory)…" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tombol kanan bawah */}
              <div className="flex justify-end gap-2 mt-4">
                {KPMR_editingIndex === null ? (
                  <button onClick={KPMR_addRow} className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded-lg shadow mt-7">
                    Simpan
                  </button>
                ) : (
                  <div className="flex gap-2 mt-7">
                    <button onClick={KPMR_saveEdit} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-blue-600 text-white hover:bg-blue-700">
                      Simpan
                    </button>
                    <button
                      onClick={() => {
                        setKPMR_editingIndex(null);
                        KPMR_resetForm();
                      }}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border hover:bg-gray-50"
                    >
                      Batal
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* ----------------------------------------------------------------- */}

            {/* TABEL HASIL */}
            <section className="bg-white rounded-xl shadow overflow-hidden">
              <div className="px-4 py-3 bg-gray-100 border-b">
                <div className="font-semibold">
                  Data KPMR – Investasi ({viewYear}-{viewQuarter})
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-[1400px] text-sm border border-gray-300 border-collapse">
                  <thead>
                    {/* BARIS 1 */}
                    <tr className="bg-[#1f4e79] text-white">
                      <th className="border px-3 py-2 text-left" colSpan={2}>
                        KUALITAS PENERAPAN MANAJEMEN RISIKO
                      </th>
                      <th className="border px-3 py-2 text-center w-24" rowSpan={2}>
                        Skor
                      </th>
                      <th className="border px-3 py-2 text-center w-40" rowSpan={2}>
                        1 (Strong)
                      </th>
                      <th className="border px-3 py-2 text-center w-40" rowSpan={2}>
                        2 (Satisfactory)
                      </th>
                      <th className="border px-3 py-2 text-center w-40" rowSpan={2}>
                        3 (Fair)
                      </th>
                      <th className="border px-3 py-2 text-center w-40" rowSpan={2}>
                        4 (Marginal)
                      </th>
                      <th className="border px-3 py-2 text-center w-44" rowSpan={2}>
                        5 (Unsatisfactory)
                      </th>
                      <th className="border px-3 py-2 text-center w-[260px]" rowSpan={2}>
                        Evidence
                      </th>
                    </tr>
                    {/* BARIS 2 */}
                    <tr className="bg-[#1f4e79] text-white">
                      <th className="border px-3 py-2 w-20">No</th>
                      <th className="border px-3 py-2">Pertanyaan / Indikator</th>
                    </tr>
                  </thead>

                  <tbody>
                    {KPMR_groups.length === 0 ? (
                      <tr>
                        <td className="border px-3 py-6 text-center text-gray-500" colSpan={9}>
                          Belum ada data
                        </td>
                      </tr>
                    ) : (
                      KPMR_groups.map((g, gi) => {
                        const vals = g.items.map((it) => (it.sectionSkor === '' ? null : Number(it.sectionSkor))).filter((v) => v != null && !isNaN(v));
                        const skorAspek = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : '';

                        return (
                          <React.Fragment key={gi}>
                            {/* baris aspek */}
                            <tr className="bg-[#e9f5e1]">
                              <td className="border px-3 py-2 font-semibold" colSpan={2}>
                                {g.aspekNo} : {g.aspekTitle} <span className="text-gray-600">(Bobot: {g.aspekBobot}%)</span>
                              </td>
                              <td className="border px-3 py-2 text-center font-bold" style={{ backgroundColor: '#93d150' }}>
                                {skorAspek}
                              </td>
                              <td className="border px-3 py-2" colSpan={5}></td>
                              <td className="border px-3 py-2"></td>
                            </tr>

                            {/* baris section */}
                            {g.items.map((r, idx) => {
                              const filteredIndex = KPMR_filtered.findIndex((x) => x.year === r.year && x.quarter === r.quarter && x.aspekNo === r.aspekNo && x.sectionNo === r.sectionNo && x.sectionTitle === r.sectionTitle);
                              return (
                                <tr key={`${gi}-${idx}`} className="align-top hover:bg-gray-50">
                                  <td className="border px-2 py-2 text-center">{r.sectionNo}</td>
                                  <td className="border px-2 py-2 whitespace-pre-wrap">{r.sectionTitle}</td>
                                  <td className="border px-2 py-2 text-center">{r.sectionSkor}</td>
                                  <td className="border px-2 py-2 whitespace-pre-wrap">{r.level1}</td>
                                  <td className="border px-2 py-2 whitespace-pre-wrap">{r.level2}</td>
                                  <td className="border px-2 py-2 whitespace-pre-wrap">{r.level3}</td>
                                  <td className="border px-2 py-2 whitespace-pre-wrap">{r.level4}</td>
                                  <td className="border px-2 py-2 whitespace-pre-wrap">{r.level5}</td>
                                  <td className="border px-2 py-2 whitespace-pre-wrap">
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="flex-1" />
                                      <div className="flex gap-2 shrink-0">
                                        <button onClick={() => KPMR_startEdit(filteredIndex)} className="inline-flex items-center gap-1 px-2 py-1 rounded border hover:bg-gray-50" title="Edit baris ini">
                                          <Edit3 size={14} /> Edit
                                        </button>
                                        <button onClick={() => KPMR_removeRow(filteredIndex)} className="inline-flex items-center gap-1 px-2 py-1 rounded border hover:bg-red-50 text-red-600" title="Hapus baris ini">
                                          <Trash2 size={14} /> Hapus
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

                    {/* BARIS RATA-RATA TOTAL SEMUA ASPEK (tanpa teks di kiri) */}
                    <tr className="bg-[#c9daf8] font-semibold">
                      {/* kosongkan kiri */}
                      <td colSpan={2} className="border px-3 py-2"></td>
                      {/* hanya angka rata-rata di kolom skor */}
                      <td className="border px-3 py-2 text-center font-bold" style={{ backgroundColor: '#93d150' }}>
                        {(() => {
                          if (!KPMR_groups || KPMR_groups.length === 0) return '';
                          const perAspek = KPMR_groups.map((g) => {
                            const vals = g.items.map((it) => (it.sectionSkor === '' ? null : Number(it.sectionSkor))).filter((v) => v != null && !isNaN(v));
                            return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
                          }).filter((v) => v != null && !isNaN(v));
                          return perAspek.length ? (perAspek.reduce((a, b) => a + b, 0) / perAspek.length).toFixed(2) : '';
                        })()}
                      </td>
                      {/* kosongkan kolom deskripsi */}
                      <td colSpan={6} className="border px-3 py-2"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
