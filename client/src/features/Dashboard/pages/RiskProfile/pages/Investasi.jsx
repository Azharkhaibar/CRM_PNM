import React, { useState, useMemo } from "react";
import { Download, Check, X, Trash2, Edit3, Search } from "lucide-react";

// ==== KOMponen & Utils Investasi (yang SUDAH ada di project kamu) ====
import FormSection from "../../../components/Form";
import DataTable from "../../../components/DataTable";
import { YearInput, QuarterSelect } from "../../../components/Inputs";
import { getCurrentQuarter, getCurrentYear } from "../utils/time";
import { computeWeighted, makeEmptyRow } from "../utils/calc";
import { exportInvestasiToExcel } from "../utils/exportExcel";

// ==== Utils Export KPMR (sudah kamu pakai) ====
import { exportKPMRInvestasiToExcel } from "../utils/exportExcelKPMR";

// ===================== Brand =====================
// Sesuaikan warna brand PNM di sini bila perlu
const PNM_BRAND = {
  primary: "#0068B3", // fallback biru PNM (silakan ganti sesuai guideline)
  primarySoft: "#E6F1FA", // tint lembut
  gradient: "bg-gradient-to-r from-[#0076C6]/90 via-[#00A3DA]/90 to-[#33C2B5]/90",
};

// ===================== KPMR: Template form per section =====================
const KPMR_EMPTY_FORM = {
  year: getCurrentYear ? getCurrentYear() : new Date().getFullYear(),
  quarter: getCurrentQuarter ? getCurrentQuarter() : "Q1",

  // Aspek
  aspekNo: "Aspek 1",
  aspekTitle: "Tata Kelola Risiko",
  aspekBobot: 30,

  // Section
  sectionNo: "1",
  sectionTitle:
    "Bagaimana perumusan tingkat risiko yang akan diambil (risk appetite) dan toleransi risiko (risk tolerance) terkait risiko investasi?",
  sectionSkor: "",

  // Isi level 1..5
  level1: "",
  level2: "",
  level3: "",
  level4: "",
  level5: "",

  evidence: "",
};

// ===================== Investasi: fallback empty row =====================
const invFallbackEmpty = (year, quarter) => ({
  year,
  quarter,
  no: "1",
  subNo: "1.1",
  sectionLabel: "",
  indikator: "",
  bobotSection: 0,
  bobotIndikator: 0,
  sumberRisiko: "",
  dampak: "",
  low: "",
  lowToModerate: "",
  moderate: "",
  moderateToHigh: "",
  high: "",
  numeratorLabel: "",
  numeratorValue: "",
  denominatorLabel: "",
  denominatorValue: "",
  hasil: "",
  peringkat: 1,
  weighted: "",
  keterangan: "",
});

export default function Investasi() {
  // ====== Tabs ======
  const [activeTab, setActiveTab] = useState("investasi");

  // ====== Periode + search ======
  const [viewYear, setViewYear] = useState(getCurrentYear ? getCurrentYear() : new Date().getFullYear());
  const [viewQuarter, setViewQuarter] = useState(getCurrentQuarter ? getCurrentQuarter() : "Q1");
  const [query, setQuery] = useState("");

  // ---------------------------------------------------------------------------
  //                              TAB INVESTASI
  // ---------------------------------------------------------------------------
  const invMakeRow = () =>
    typeof makeEmptyRow === "function"
      ? { ...makeEmptyRow(), year: viewYear, quarter: viewQuarter }
      : invFallbackEmpty(viewYear, viewQuarter);

  const [INVESTASI_rows, setINVESTASI_rows] = useState([]);
  const [INVESTASI_form, setINVESTASI_form] = useState(invMakeRow());
  const [INVESTASI_editingIndex, setINVESTASI_editingIndex] = useState(null);

  const INVESTASI_filtered = useMemo(() => {
    return INVESTASI_rows
      .filter((r) => r.year === viewYear && r.quarter === viewQuarter)
      .filter((r) =>
        `${r.no} ${r.subNo} ${r.sectionLabel} ${r.indikator} ${r.keterangan} ${r.sumberRisiko} ${r.dampak}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
      .sort((a, b) => `${a.subNo}`.localeCompare(`${b.subNo}`, undefined, { numeric: true }));
  }, [INVESTASI_rows, viewYear, viewQuarter, query]);

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
    const weightedAuto = computeWeighted
      ? computeWeighted(INVESTASI_form.bobotSection, INVESTASI_form.bobotIndikator, INVESTASI_form.peringkat)
      : 0;
    const newRow = {
      ...INVESTASI_form,
      hasil: INVESTASI_form.hasil === "" ? hasil : INVESTASI_form.hasil,
      weighted: INVESTASI_form.weighted === "" ? weightedAuto : INVESTASI_form.weighted,
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
    const id = INVESTASI_rows.findIndex(
      (x) =>
        x.year === target.year &&
        x.quarter === target.quarter &&
        x.no === target.no &&
        x.subNo === target.subNo &&
        x.sectionLabel === target.sectionLabel &&
        x.indikator === target.indikator
    );
    if (id !== -1) {
      const num = Number(INVESTASI_form.numeratorValue || 0);
      const den = Number(INVESTASI_form.denominatorValue || 0);
      const hasil = den ? +(num / den).toFixed(4) : 0;
      const weightedAuto = computeWeighted
        ? computeWeighted(INVESTASI_form.bobotSection, INVESTASI_form.bobotIndikator, INVESTASI_form.peringkat)
        : 0;
      const updated = [...INVESTASI_rows];
      updated[id] = {
        ...INVESTASI_form,
        hasil: INVESTASI_form.hasil === "" ? hasil : INVESTASI_form.hasil,
        weighted: INVESTASI_form.weighted === "" ? weightedAuto : INVESTASI_form.weighted,
      };
      setINVESTASI_rows(updated);
    }
    INVESTASI_resetForm();
  };

  const INVESTASI_removeRow = (idx) => {
    const target = INVESTASI_filtered[idx];
    const id = INVESTASI_rows.findIndex(
      (x) =>
        x.year === target.year &&
        x.quarter === target.quarter &&
        x.no === target.no &&
        x.subNo === target.subNo &&
        x.sectionLabel === target.sectionLabel &&
        x.indikator === target.indikator
    );
    if (id !== -1) setINVESTASI_rows((arr) => arr.filter((_, i) => i !== id));
    if (INVESTASI_editingIndex === idx) INVESTASI_resetForm();
  };

  const INVESTASI_exportExcel = () =>
    exportInvestasiToExcel ? exportInvestasiToExcel(INVESTASI_filtered, viewYear, viewQuarter) : null;

  // ---------------------------------------------------------------------------
  //                              TAB K P M R
  // ---------------------------------------------------------------------------
  const [KPMR_rows, setKPMR_rows] = useState([]);
  const [KPMR_form, setKPMR_form] = useState({ ...KPMR_EMPTY_FORM, year: viewYear, quarter: viewQuarter });
  const [KPMR_editingIndex, setKPMR_editingIndex] = useState(null);

  const KPMR_handleChange = (k, v) => setKPMR_form((f) => ({ ...f, [k]: v }));

  const KPMR_filtered = useMemo(() => {
    return KPMR_rows
      .filter((r) => r.year === viewYear && r.quarter === viewQuarter)
      .filter((r) =>
        `${r.aspekNo} ${r.aspekTitle} ${r.sectionNo} ${r.sectionTitle} ${r.evidence} ${r.level1} ${r.level2} ${r.level3} ${r.level4} ${r.level5}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
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
      const [aspekNo, aspekTitle, aspekBobot] = k.split("|");
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
    const id = KPMR_rows.findIndex(
      (x) =>
        x.year === target.year &&
        x.quarter === target.quarter &&
        x.aspekNo === target.aspekNo &&
        x.sectionNo === target.sectionNo &&
        x.sectionTitle === target.sectionTitle
    );
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
    const id = KPMR_rows.findIndex(
      (x) =>
        x.year === target.year &&
        x.quarter === target.quarter &&
        x.aspekNo === target.aspekNo &&
        x.sectionNo === target.sectionNo &&
        x.sectionTitle === target.sectionTitle
    );
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
      {/* HERO / TITLE */}
      <div className={`relative rounded-2xl overflow-hidden mb-6 shadow-sm ${PNM_BRAND.gradient}`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_0%,white,transparent_40%),radial-gradient(circle_at_80%_100%,white,transparent_35%)]" />
        <div className="relative px-6 py-7 sm:px-8 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">Risk Form – Investasi</h1>
          <p className="mt-1 text-white/90 text-sm">Input laporan lebih cepat, rapi, dan konsisten.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("investasi")}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "investasi"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
              }`}
            title="Form indikator & perhitungan bobot"
          >
            Investasi
          </button>

          <button
            onClick={() => setActiveTab("kpmr")}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "kpmr"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
              }`}
            title="Form KPMR – penilaian kualitas penerapan MR"
          >
            KPMR Investasi
          </button>
        </nav>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        {/* ================= TAB: INVESTASI ================= */}
        {activeTab === "investasi" && (
          <>
            <header className="px-4 py-4 flex items-center justify-between gap-3">
              <h2 className="text-xl sm:text-2xl font-semibold">Form – Investasi</h2>
              <div className="flex items-center gap-3">
                {/* tahun + triwulan (tetap sejajar) */}
                <div className="hidden md:flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label className="sr-only">Tahun</label>
                    <YearInput
                      value={viewYear}
                      onChange={(v) => {
                        setViewYear(v);
                        setINVESTASI_form((f) => ({ ...f, year: v }));
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="sr-only">Triwulan</label>
                    <QuarterSelect
                      value={viewQuarter}
                      onChange={(v) => {
                        setViewQuarter(v);
                        setINVESTASI_form((f) => ({ ...f, quarter: v }));
                      }}
                    />
                  </div>
                </div>

                {/* group search + export: sedikit dinaikkan agar sejajar dengan input di kiri */}
                <div className="flex items-center gap-2 transform -translate-y-1">
                  {/* search */}
                  <div className="relative">
                    <input
                      value={query} 
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Cari no/sub/indikator/keterangan…"
                      className="pl-9 pr-3 py-2 rounded-xl border w-64"
                    />
                    <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>

                  {/* export button */}
                  <button
                    onClick={INVESTASI_exportExcel}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border bg-gray-900 text-white hover:bg-black"
                  >
                    <Download size={18} /> Export {viewYear}-{viewQuarter}
                  </button>
                </div>
              </div>
            </header>

            {/* FORM INVESTASI */}
            <div className="">
              <FormSection
                form={INVESTASI_form}
                setForm={setINVESTASI_form}
                onAdd={INVESTASI_addRow}
                onSave={INVESTASI_saveEdit}
                onReset={INVESTASI_resetForm}
                editing={INVESTASI_editingIndex !== null}
                title="Form Investasi"
              />
              {/* Hint bar */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mt-3">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border">
                  <span className="i-lucide-sparkles" />
                  Tip: gunakan <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded">Tab</kbd> untuk pindah input, <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded">Enter</kbd> untuk simpan cepat.
                </div>
              </div>
            </div>

            {/* Filter periode info */}
            <section className="bg-white rounded-2xl shadow p-4 mt-4 border">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="font-medium">Tampilkan Periode:</div>
                <YearInput value={viewYear} onChange={setViewYear} />
                <QuarterSelect value={viewQuarter} onChange={setViewQuarter} />
                <div className="text-sm text-gray-500">Hanya baris {viewYear}-{viewQuarter} yang ditampilkan.</div>
                <div className="ml-auto text-sm font-semibold">Total Weighted: {Number(INVESTASI_totalWeighted || 0).toFixed(4)}</div>
              </div>
            </section>

            {/* TABEL INVESTASI */}
            <div className="mt-4">
              <DataTable
                rows={INVESTASI_filtered}
                totalWeighted={INVESTASI_totalWeighted}
                viewYear={viewYear}
                viewQuarter={viewQuarter}
                startEdit={INVESTASI_startEdit}
                removeRow={INVESTASI_removeRow}
              />
            </div>
          </>
        )}

        {/* ================= TAB: KPMR ================= */}
        {activeTab === "kpmr" && (
          <div className="space-y-6">
            {/* Header tools */}
            <header className="rounded-xl shadow-sm">
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
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Cari aspek/section/evidence…"
                      className="pl-9 pr-3 py-2 rounded-xl border w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
                      aria-label="Cari data KPMR"
                    />
                    <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>

                  <button
                    onClick={KPMR_exportExcel}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border bg-gray-900 text-white hover:bg-black"
                    title={`Export ${viewYear}-${viewQuarter}`}
                  >
                    <Download size={18} /> Export {viewYear}-{viewQuarter}
                  </button>
                </div>
              </div>
            </header>

            {/* ===== FORM (UI KPMR) ===== */}
            {/* Perubahan UTAMA sesuai request: bg abu-abu -> menyesuaikan warna PNM */}
            <section className={`rounded-2xl border shadow p-4 ${PNM_BRAND.gradient} text-white`}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold drop-shadow">Form KPMR – Investasi</h2>
                <div className="text-sm text-white/90">
                  Periode: <span className="font-semibold">{KPMR_form.year}-{KPMR_form.quarter}</span>
                </div>
              </div>

              {/* Card konten di atas background brand */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* KIRI – Meta Aspek & Section */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <div className="mb-1 text-[13px] text-white/90 font-medium">Aspek (No)</div>
                      <input
                        className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/40"
                        value={KPMR_form.aspekNo}
                        onChange={(e) => KPMR_handleChange("aspekNo", e.target.value)}
                      />
                    </label>

                    <label className="block">
                      <div className="mb-1 text-[13px] text-white/90 font-medium">Bobot Aspek</div>
                      <div className="relative">
                        <input
                          type="number"
                          className="w-full rounded-xl pl-3 pr-10 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/40"
                          value={KPMR_form.aspekBobot}
                          onChange={(e) => KPMR_handleChange("aspekBobot", e.target.value === "" ? "" : Number(e.target.value))}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                      </div>
                    </label>
                  </div>

                  <label className="block">
                    <div className="mb-1 text-[13px] text-white/90 font-medium">Judul Aspek</div>
                    <input
                      className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/40"
                      value={KPMR_form.aspekTitle}
                      onChange={(e) => KPMR_handleChange("aspekTitle", e.target.value)}
                    />
                  </label>

                  <div className="grid grid-cols-3 gap-3">
                    <label className="block">
                      <div className="mb-1 text-[13px] text-white/90 font-medium">No Section</div>
                      <input
                        className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/40"
                        value={KPMR_form.sectionNo}
                        onChange={(e) => KPMR_handleChange("sectionNo", e.target.value)}
                      />
                    </label>

                    <label className="block">
                      <div className="mb-1 text-[13px] text-white/90 font-medium">Skor Section</div>
                      <input
                        type="number"
                        className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/40"
                        value={KPMR_form.sectionSkor}
                        onChange={(e) => KPMR_handleChange("sectionSkor", e.target.value === "" ? "" : Number(e.target.value))}
                      />
                    </label>

                    <label className="block">
                      <div className="mb-1 text-[13px] text-white/90 font-medium">Skor Average</div>
                      <input
                        className="w-full rounded-xl px-3 py-2 bg-white/70 text-gray-900"
                        value={(() => {
                          const sameAspek = KPMR_filtered.filter(
                            (r) => r.aspekNo === KPMR_form.aspekNo && r.aspekTitle === KPMR_form.aspekTitle
                          );
                          const nums = sameAspek
                            .map((r) => (r.sectionSkor === "" ? null : Number(r.sectionSkor)))
                            .filter((v) => v != null && !isNaN(v));
                          return nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2) : "";
                        })()}
                        readOnly
                      />
                    </label>
                  </div>

                  <label className="block">
                    <div className="mb-1 text-[13px] text-white/90 font-medium">Pertanyaan Section</div>
                    <textarea
                      className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 min-h-[64px] focus:outline-none focus:ring-2 focus:ring-white/40"
                      value={KPMR_form.sectionTitle}
                      onChange={(e) => KPMR_handleChange("sectionTitle", e.target.value)}
                    />
                  </label>

                  <label className="block">
                    <div className="mb-1 text-[13px] text-white/90 font-medium">Evidence</div>
                    <textarea
                      className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 min-h-[56px] focus:outline-none focus:ring-2 focus:ring-white/40"
                      value={KPMR_form.evidence}
                      onChange={(e) => KPMR_handleChange("evidence", e.target.value)}
                    />
                  </label>
                </div>

                {/* KANAN – 5 Level */}
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <div key={v} className="rounded-xl shadow-sm bg-white/95 backdrop-blur">
                      <div className="px-3 pt-3 text-[13px] font-semibold text-gray-800">
                        {v}. {['Strong', 'Satisfactory', 'Fair', 'Marginal', 'Unsatisfactory'][v - 1]}
                      </div>
                      <div className="p-3">
                        <textarea
                          className="w-full rounded-lg px-3 py-2 bg-white min-h-[56px] focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-gray-900"
                          value={KPMR_form[`level${v}`]}
                          onChange={(e) => KPMR_handleChange(`level${v}`, e.target.value)}
                          placeholder={`Deskripsi ${v} (${['Strong', 'Satisfactory', 'Fair', 'Marginal', 'Unsatisfactory'][v - 1]})…`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tombol kanan bawah */}
              <div className="flex justify-end gap-2 mt-4">
                {KPMR_editingIndex === null ? (
                  <button
                    onClick={KPMR_addRow}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded-lg shadow mt-7"
                  >
                    Simpan
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={KPMR_saveEdit}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-white text-gray-900 hover:bg-gray-100"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => { setKPMR_editingIndex(null); KPMR_resetForm(); }}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border bg-transparent hover:bg-white/10"
                    >
                      Batal
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* TABEL HASIL */}
            <section className="bg-white rounded-2xl shadow overflow-hidden">
              <div className="px-4 py-3 bg-gray-100 border-b">
                <div className="font-semibold">Data KPMR – Investasi ({viewYear}-{viewQuarter})</div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-[1400px] text-sm border border-gray-300 border-collapse">
                  <thead>
                    <tr className="bg-[#1f4e79] text-white">
                      <th className="border px-3 py-2 text-left" colSpan={2}>KUALITAS PENERAPAN MANAJEMEN RISIKO</th>
                      <th className="border px-3 py-2 text-center w-24" rowSpan={2}>Skor</th>
                      <th className="border px-3 py-2 text-center w-40" rowSpan={2}>1 (Strong)</th>
                      <th className="border px-3 py-2 text-center w-40" rowSpan={2}>2 (Satisfactory)</th>
                      <th className="border px-3 py-2 text-center w-40" rowSpan={2}>3 (Fair)</th>
                      <th className="border px-3 py-2 text-center w-40" rowSpan={2}>4 (Marginal)</th>
                      <th className="border px-3 py-2 text-center w-44" rowSpan={2}>5 (Unsatisfactory)</th>
                      <th className="border px-3 py-2 text-center w-[260px]" rowSpan={2}>Evidence</th>
                    </tr>
                    <tr className="bg-[#1f4e79] text-white">
                      <th className="border px-3 py-2 w-20">No</th>
                      <th className="border px-3 py-2">Pertanyaan / Indikator</th>
                    </tr>
                  </thead>

                  <tbody>
                    {KPMR_groups.length === 0 ? (
                      <tr>
                        <td className="border px-3 py-6 text-center text-gray-500" colSpan={9}>Belum ada data</td>
                      </tr>
                    ) : (
                      KPMR_groups.map((g, gi) => {
                        const vals = g.items
                          .map((it) => (it.sectionSkor === "" ? null : Number(it.sectionSkor)))
                          .filter((v) => v != null && !isNaN(v));
                        const skorAspek = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : "";

                        return (
                          <React.Fragment key={gi}>
                            {/* baris aspek */}
                            <tr className="bg-[#e9f5e1]">
                              <td className="border px-3 py-2 font-semibold" colSpan={2}>
                                {g.aspekNo} : {g.aspekTitle} <span className="text-gray-600">(Bobot: {g.aspekBobot}%)</span>
                              </td>
                              <td className="border px-3 py-2 text-center font-bold" style={{ backgroundColor: "#93d150" }}>
                                {skorAspek}
                              </td>
                              <td className="border px-3 py-2" colSpan={5}></td>
                              <td className="border px-3 py-2"></td>
                            </tr>

                            {/* baris section */}
                            {g.items.map((r, idx) => {
                              const filteredIndex = KPMR_filtered.findIndex(
                                (x) =>
                                  x.year === r.year &&
                                  x.quarter === r.quarter &&
                                  x.aspekNo === r.aspekNo &&
                                  x.sectionNo === r.sectionNo &&
                                  x.sectionTitle === r.sectionTitle
                              );
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
                                        <button
                                          onClick={() => KPMR_startEdit(filteredIndex)}
                                          className="inline-flex items-center gap-1 px-2 py-1 rounded border hover:bg-gray-50"
                                          title="Edit baris ini"
                                        >
                                          <Edit3 size={14} /> Edit
                                        </button>
                                        <button
                                          onClick={() => KPMR_removeRow(filteredIndex)}
                                          className="inline-flex items-center gap-1 px-2 py-1 rounded border hover:bg-red-50 text-red-600"
                                          title="Hapus baris ini"
                                        >
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

                    {/* BARIS RATA-RATA TOTAL */}
                    <tr className="bg-[#c9daf8] font-semibold">
                      <td colSpan={2} className="border px-3 py-2"></td>
                      <td className="border px-3 py-2 text-center font-bold" style={{ backgroundColor: "#93d150" }}>
                        {(() => {
                          if (!KPMR_groups || KPMR_groups.length === 0) return "";
                          const perAspek = KPMR_groups
                            .map((g) => {
                              const vals = g.items
                                .map((it) => (it.sectionSkor === "" ? null : Number(it.sectionSkor)))
                                .filter((v) => v != null && !isNaN(v));
                              return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
                            })
                            .filter((v) => v != null && !isNaN(v));
                          return perAspek.length ? (perAspek.reduce((a, b) => a + b, 0) / perAspek.length).toFixed(2) : "";
                        })()}
                      </td>
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
