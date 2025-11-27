import React, { useState, useMemo } from "react";
import { Download, Trash2, Edit3, Search, Plus, ChevronDown } from "lucide-react";

// ==== Komponen & Utils Investasi ====
import DataTable from "../../../components/DataTable";
import { RiskField, YearInput, QuarterSelect } from "../../../components/Inputs";
import { getCurrentQuarter, getCurrentYear } from "../utils/time";
import { computeWeighted, makeEmptyRow } from "../utils/calc";
import { exportInvestasiToExcel } from "../utils/exportExcel";

// ==== Utils Export KPMR ====
import { exportKPMRInvestasiToExcel } from "../utils/exportExcelKPMR";

// ===================== Brand =====================
const PNM_BRAND = {
  primary: "#0068B3",
  primarySoft: "#E6F1FA",
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

  // Level 1..5
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
  low: "x ≤ 1%",
  lowToModerate: "1% < x ≤ 2%",
  moderate: "2% < x ≤ 3%",
  moderateToHigh: "3% < x ≤ 4%",
  high: "x > 4%",
  numeratorLabel: "",
  numeratorValue: "",
  denominatorLabel: "",
  denominatorValue: "",
  mode: "RASIO", // RASIO atau NILAI_TUNGGAL
  formula: "",
  isPercent: false,
  hasil: "",
  peringkat: 1,
  weighted: "",
  keterangan: "",
});

// ===== helper number =====
const fmtNumber = (v) => {
  if (v === "" || v == null) return "";
  const n = Number(String(v).replace(/,/g, ""));
  if (isNaN(n)) return String(v);
  return new Intl.NumberFormat("en-US").format(n);
};

const parseNum = (v) => {
  if (v == null || v === "") return 0;
  const s = String(v).replace(/,/g, "").trim();
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
};

const computeInvestasiHasil = (row) => {
  const mode = row.mode || "RASIO";
  const pemb = parseNum(row.numeratorValue);
  const peny = parseNum(row.denominatorValue);

  // rumus custom
  if (row.formula && row.formula.trim() !== "") {
    try {
      const expr = row.formula
        .replace(/\bpemb\b/g, "pemb")
        .replace(/\bpeny\b/g, "peny");
      const fn = new Function("pemb", "peny", `return (${expr});`);
      const res = fn(pemb, peny);
      if (!isFinite(res) || isNaN(res)) return "";
      return Number(res);
    } catch (e) {
      console.warn("Invalid formula (Investasi):", row.formula, e);
      return "";
    }
  }

  if (mode === "NILAI_TUNGGAL") {
    if (peny === 0) return "";
    return Number(peny);
  }

  if (peny === 0) return "";
  const result = pemb / peny;
  if (!isFinite(result) || isNaN(result)) return "";
  return Number(result);
};

const computeWeightedLocal = (bobotSection, bobotIndikator, peringkat) => {
  const s = Number(bobotSection || 0);
  const b = Number(bobotIndikator || 0);
  const p = Number(peringkat || 0);
  const res = (s * b * p) / 10000; // hasil angka, bukan persen string
  if (!isFinite(res) || isNaN(res)) return 0;
  return res;
};

export default function Investasi() {
  // ====== Tabs ======
  const [activeTab, setActiveTab] = useState("investasi");

  // ====== Periode + search ======
  const [viewYear, setViewYear] = useState(
    getCurrentYear ? getCurrentYear() : new Date().getFullYear()
  );
  const [viewQuarter, setViewQuarter] = useState(
    getCurrentQuarter ? getCurrentQuarter() : "Q1"
  );
  const [query, setQuery] = useState("");

  // ---------------------------------------------------------------------------
  //                              TAB INVESTASI
  // ---------------------------------------------------------------------------

  // ----- SECTION LIST -----
  const [INVESTASI_sections, setINVESTASI_sections] = useState([
    {
      id: "s-1",
      no: "1",
      bobotSection: 100,
      parameter: "Kualitas Pengelolaan Risiko Investasi",
    },
  ]);

  const [INVESTASI_sectionForm, setINVESTASI_sectionForm] = useState({
    id: "s-1",
    no: "1",
    bobotSection: 100,
    sectionLabel: "Kualitas Pengelolaan Risiko Investasi",
  });

  function INVESTASI_selectSection(id) {
    const s = INVESTASI_sections.find((x) => x.id === id);
    if (s) {
      setINVESTASI_sectionForm({
        id: s.id,
        no: s.no,
        bobotSection: s.bobotSection,
        sectionLabel: s.parameter,
      });
    }
  }

  function INVESTASI_addSection() {
    const id = `s-${Date.now()}`;
    const s = {
      id,
      no: INVESTASI_sectionForm.no || "",
      bobotSection: Number(INVESTASI_sectionForm.bobotSection || 0),
      parameter: INVESTASI_sectionForm.sectionLabel || "",
    };
    setINVESTASI_sections((prev) => [...prev, s]);
    setINVESTASI_sectionForm({
      id: s.id,
      no: s.no,
      bobotSection: s.bobotSection,
      sectionLabel: s.parameter,
    });
  }

  function INVESTASI_saveSection() {
    if (!INVESTASI_sectionForm.id) return;
    setINVESTASI_sections((prev) =>
      prev.map((s) =>
        s.id === INVESTASI_sectionForm.id
          ? {
            ...s,
            no: INVESTASI_sectionForm.no,
            bobotSection: Number(INVESTASI_sectionForm.bobotSection || 0),
            parameter: INVESTASI_sectionForm.sectionLabel,
          }
          : s
      )
    );
  }

  function INVESTASI_removeSection(id) {
    setINVESTASI_sections((prev) => prev.filter((s) => s.id !== id));
    setINVESTASI_sectionForm({
      id: "",
      no: "",
      bobotSection: 0,
      sectionLabel: "",
    });
  }

  // ----- ROW & FORM -----
  const invMakeRow = () =>
    typeof makeEmptyRow === "function"
      ? {
        ...makeEmptyRow(),
        year: viewYear,
        quarter: viewQuarter,
        mode: "RASIO",
        formula: "",
        isPercent: false,
        low: "x ≤ 1%",
        lowToModerate: "1% < x ≤ 2%",
        moderate: "2% < x ≤ 3%",
        moderateToHigh: "3% < x ≤ 4%",
        high: "x > 4%",
      }
      : invFallbackEmpty(viewYear, viewQuarter);

  const [INVESTASI_rows, setINVESTASI_rows] = useState([]);
  const [INVESTASI_form, setINVESTASI_form] = useState(invMakeRow());
  const [INVESTASI_editingRow, setINVESTASI_editingRow] = useState(null);

  // helper (kalau nanti mau dipakai id unik)
  const makeRowKey = (r) =>
    `${r.year}|${r.quarter}|${r.no}|${r.subNo}|${r.sectionLabel}|${r.indikator}`;
  const [INVESTASI_editingKey, setINVESTASI_editingKey] = useState(null);

  const INVESTASI_filtered = useMemo(() => {
    return INVESTASI_rows
      .filter((r) => r.year === viewYear && r.quarter === viewQuarter)
      .filter((r) =>
        `${r.no} ${r.subNo} ${r.sectionLabel} ${r.indikator} ${r.keterangan} ${r.sumberRisiko} ${r.dampak}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
      .sort((a, b) =>
        `${a.subNo}`.localeCompare(`${b.subNo}`, undefined, { numeric: true })
      );
  }, [INVESTASI_rows, viewYear, viewQuarter, query]);

  const INVESTASI_totalWeighted = useMemo(
    () =>
      INVESTASI_filtered.reduce(
        (sum, r) => sum + (Number(r.weighted || 0) || 0),
        0
      ),
    [INVESTASI_filtered]
  );

  const INVESTASI_resetForm = () => {
    setINVESTASI_form(invMakeRow());
    setINVESTASI_editingRow(null);
  };

  const buildBaseRow = () => {
    const peringkatNum =
      INVESTASI_form.peringkat === "" || INVESTASI_form.peringkat == null
        ? 0
        : Number(INVESTASI_form.peringkat);

    return {
      ...INVESTASI_form,
      no: INVESTASI_sectionForm.no,
      sectionLabel: INVESTASI_sectionForm.sectionLabel,
      bobotSection: INVESTASI_sectionForm.bobotSection,
      peringkat: peringkatNum,
      numeratorLabel:
        INVESTASI_form.mode === "NILAI_TUNGGAL"
          ? ""
          : INVESTASI_form.numeratorLabel,
      numeratorValue:
        INVESTASI_form.mode === "NILAI_TUNGGAL"
          ? ""
          : INVESTASI_form.numeratorValue,
    };
  };

  const INVESTASI_addRow = () => {
    const baseRow = buildBaseRow();
    const rawHasil = computeInvestasiHasil(baseRow);

    const weightedAuto =
      typeof computeWeighted === "function"
        ? computeWeighted(
          baseRow.bobotSection,
          baseRow.bobotIndikator,
          baseRow.peringkat
        )
        : computeWeightedLocal(
          baseRow.bobotSection,
          baseRow.bobotIndikator,
          baseRow.peringkat
        );

    const newRow = {
      ...baseRow,
      hasil: rawHasil === "" || rawHasil == null ? 0 : rawHasil,
      weighted:
        baseRow.weighted === "" || baseRow.weighted == null
          ? weightedAuto
          : baseRow.weighted,
    };

    setINVESTASI_rows((r) => [...r, newRow]);
    INVESTASI_resetForm();
  };

  const INVESTASI_startEdit = (row) => {
    if (!row) return;

    setINVESTASI_editingRow(row);

    setINVESTASI_form({
      ...row,
      mode: row.mode || "RASIO",
      formula: row.formula || "",
      isPercent: !!row.isPercent,
    });

    setINVESTASI_sectionForm({
      id: "",
      no: row.no || "",
      bobotSection: row.bobotSection ?? 0,
      sectionLabel: row.sectionLabel || "",
    });
  };

  const INVESTASI_saveEdit = () => {
    if (!INVESTASI_editingRow) return;

    const baseRow = buildBaseRow();
    const rawHasil = computeInvestasiHasil(baseRow);

    const weightedAuto =
      typeof computeWeighted === "function"
        ? computeWeighted(
          baseRow.bobotSection,
          baseRow.bobotIndikator,
          baseRow.peringkat
        )
        : computeWeightedLocal(
          baseRow.bobotSection,
          baseRow.bobotIndikator,
          baseRow.peringkat
        );

    setINVESTASI_rows((prev) =>
      prev.map((r) =>
        r === INVESTASI_editingRow
          ? {
            ...baseRow,
            hasil: rawHasil === "" || rawHasil == null ? 0 : rawHasil,
            weighted:
              baseRow.weighted === "" || baseRow.weighted == null
                ? weightedAuto
                : baseRow.weighted,
          }
          : r
      )
    );

    INVESTASI_resetForm();
  };

  const INVESTASI_removeRow = (row) => {
    if (!row) return;
    setINVESTASI_rows((arr) => arr.filter((r) => r !== row));
    if (INVESTASI_editingRow === row) INVESTASI_resetForm();
  };

  const INVESTASI_exportExcel = () =>
    exportInvestasiToExcel
      ? exportInvestasiToExcel(INVESTASI_filtered, viewYear, viewQuarter)
      : null;

  // ---------------------------------------------------------------------------
  //                              TAB K P M R
  // ---------------------------------------------------------------------------
  const [KPMR_rows, setKPMR_rows] = useState([]);
  const [KPMR_form, setKPMR_form] = useState({
    ...KPMR_EMPTY_FORM,
    year: viewYear,
    quarter: viewQuarter,
  });
  const [KPMR_editingIndex, setKPMR_editingIndex] = useState(null);

  const KPMR_handleChange = (k, v) =>
    setKPMR_form((f) => ({ ...f, [k]: v }));

  const KPMR_filtered = useMemo(
    () =>
      KPMR_rows
        .filter((r) => r.year === viewYear && r.quarter === viewQuarter)
        .filter((r) =>
          `${r.aspekNo} ${r.aspekTitle} ${r.sectionNo} ${r.sectionTitle} ${r.evidence} ${r.level1} ${r.level2} ${r.level3} ${r.level4} ${r.level5}`
            .toLowerCase()
            .includes(query.toLowerCase())
        )
        .sort((a, b) => {
          const aA = `${a.aspekNo}`.localeCompare(`${b.aspekNo}`, undefined, {
            numeric: true,
          });
          if (aA !== 0) return aA;
          return `${a.sectionNo}`.localeCompare(`${b.sectionNo}`, undefined, {
            numeric: true,
          });
        }),
    [KPMR_rows, viewYear, viewQuarter, query]
  );

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
    <div className="p-6 overflow-x-hidden">
      {/* HERO / TITLE */}
      <div
        className={`relative rounded-2xl overflow-hidden mb-6 shadow-sm ${PNM_BRAND.gradient}`}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_0%,white,transparent_40%),radial-gradient(circle_at_80%_100%,white,transparent_35%)]" />
        <div className="relative px-6 py-7 sm:px-8 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
            Risk Form – Investasi
          </h1>
          <p className="mt-1 text-white/90 text-sm">
            Input laporan lebih cepat, rapi, dan konsisten.
          </p>
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
          >
            Investasi
          </button>

          <button
            onClick={() => setActiveTab("kpmr")}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "kpmr"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
              }`}
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
              <h2 className="text-xl sm:text-2xl font-semibold">
                Form – Investasi
              </h2>
              <div className="flex items-end gap-4">
                {/* tahun + triwulan */}
                <div className="hidden md:flex items-end gap-4">
                  <div className="flex flex-col gap-1">
                    <YearInput
                      value={viewYear}
                      onChange={(v) => {
                        setViewYear(v);
                        setINVESTASI_form((f) => ({ ...f, year: v }));
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <QuarterSelect
                      value={viewQuarter}
                      onChange={(v) => {
                        setViewQuarter(v);
                        setINVESTASI_form((f) => ({ ...f, quarter: v }));
                      }}
                    />
                  </div>
                </div>

                {/* search + export */}
                <div className="flex items-end gap-2">
                  <div className="relative">
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Cari no/sub/indikator/keterangan…"
                      className="pl-9 pr-3 py-2 rounded-xl border w-64"
                    />
                    <Search
                      size={16}
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>

                  <button
                    onClick={INVESTASI_exportExcel}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border bg-gray-900 text-white hover:bg-black"
                  >
                    <Download size={18} /> Export {viewYear}-{viewQuarter}
                  </button>
                </div>
              </div>
            </header>

            {/* ===== FORM SECTION + INDIKATOR ===== */}
            <div className="relative rounded-2xl overflow-hidden mb-6 shadow-sm bg-gradient-to-r from-[#0076C6]/90 via-[#00A3DA]/90 to-[#33C2B5]/90">
              {/* SECTION HEADER */}
              <div className="rounded-2xl border-2 border-gray-300 p-4 shadow-sm mb-6">
                <h2 className="text-white font-semibold text-lg sm:text-xl mb-4">
                  Form Section – Investasi
                </h2>

                <div className="flex items-end gap-4 mb-4">
                  {/* No Sec */}
                  <div className="flex flex-col">
                    <label className="text-xs text-white font-medium mb-1">
                      No Sec
                    </label>
                    <input
                      className="w-20 h-10 px-3 rounded-lg border-2 border-gray-300 text-center font-medium bg-white"
                      value={INVESTASI_sectionForm.no}
                      onChange={(e) =>
                        setINVESTASI_sectionForm((f) => ({
                          ...f,
                          no: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Bobot Sec */}
                  <div className="flex flex-col">
                    <label className="text-xs text-white font-medium mb-1">
                      Bobot Sec
                    </label>
                    <input
                      type="number"
                      className="w-28 h-10 px-3 rounded-lg border-2 border-gray-300 text-center font-medium bg-white"
                      value={INVESTASI_sectionForm.bobotSection ?? ""}
                      onChange={(e) =>
                        setINVESTASI_sectionForm((f) => ({
                          ...f,
                          bobotSection: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Section */}
                  <div className="flex-1 flex flex-col">
                    <label className="text-xs text-white font-medium mb-1">
                      Section
                    </label>
                    <input
                      className="w-full h-10 px-4 rounded-lg border-2 border-gray-300 font-medium bg-white"
                      value={INVESTASI_sectionForm.sectionLabel}
                      onChange={(e) =>
                        setINVESTASI_sectionForm((f) => ({
                          ...f,
                          sectionLabel: e.target.value,
                        }))
                      }
                      placeholder="Uraian section risiko investasi"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 self-end">
                    <button
                      className="w-10 h-10 rounded-lg bg-green-500 hover:bg-green-600 text-white flex items-center justify-center"
                      onClick={INVESTASI_addSection}
                      title="Tambah Section"
                    >
                      <Plus size={20} />
                    </button>
                    <button
                      className="w-10 h-10 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white flex items-center justify-center"
                      onClick={INVESTASI_saveSection}
                      title="Edit Section"
                    >
                      <Edit3 size={20} />
                    </button>
                    <button
                      className="w-10 h-10 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
                      onClick={() =>
                        INVESTASI_sectionForm.id &&
                        INVESTASI_removeSection(INVESTASI_sectionForm.id)
                      }
                      title="Hapus Section"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Dropdown daftar section */}
                <div className="relative">
                  <label className="text-xs text-white font-medium mb-1 block">
                    Section
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 font-medium appearance-none bg-white cursor-pointer pr-10"
                    value={INVESTASI_sectionForm.id || ""}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      if (selectedId) INVESTASI_selectSection(selectedId);
                    }}
                  >
                    <option value="">-- Pilih Section --</option>
                    {INVESTASI_sections.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.no} - {s.parameter}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-9 pointer-events-none text-gray-400"
                    size={20}
                  />
                </div>
              </div>

              {/* ===== FORM INDIKATOR ===== */}
              <div className="rounded-xl border-2 border-gray-300 shadow-sm p-6 mb-6">
                {/* Sub No + Indikator + Bobot */}
                <div className="grid grid-cols-12 gap-4 mb-4">
                  <div className="col-span-3">
                    <label className="text-sm font-medium mb-2 block text-white">
                      Sub No
                    </label>
                    <input
                      className="w-full rounded-lg border-2 border-gray-300 px-3 py-3 text-sm bg-white"
                      value={INVESTASI_form.subNo}
                      onChange={(e) =>
                        setINVESTASI_form((f) => ({ ...f, subNo: e.target.value }))
                      }
                      placeholder="1.1"
                    />
                  </div>
                  <div className="col-span-6">
                    <label className="text-sm font-medium mb-2 block text-white">
                      Indikator
                    </label>
                    <input
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                      value={INVESTASI_form.indikator}
                      onChange={(e) =>
                        setINVESTASI_form((f) => ({
                          ...f,
                          indikator: e.target.value,
                        }))
                      }
                      placeholder="Nama indikator investasi…"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="text-sm font-medium mb-2 block text-white">
                      Bobot Indikator (%)
                    </label>
                    <input
                      type="number"
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm text-right bg-white"
                      value={INVESTASI_form.bobotIndikator ?? ""}
                      onChange={(e) =>
                        setINVESTASI_form((f) => ({
                          ...f,
                          bobotIndikator: e.target.value,
                        }))
                      }
                      placeholder="50"
                    />
                  </div>
                </div>

                {/* Metode Perhitungan + Rumus + Persen */}
                <div className="grid grid-cols-12 gap-4 mb-4">
                  <div className="col-span-4">
                    <label className="text-sm font-medium mb-2 block text-white">
                      Metode Perhitungan
                    </label>
                    <select
                      className="w-full rounded-lg border-2 border-gray-300 px-3 py-3 text-sm bg-white"
                      value={INVESTASI_form.mode || "RASIO"}
                      onChange={(e) => {
                        const v = e.target.value;
                        setINVESTASI_form((f) => ({
                          ...f,
                          mode: v,
                          ...(v === "NILAI_TUNGGAL"
                            ? { numeratorLabel: "", numeratorValue: "" }
                            : {}),
                        }));
                      }}
                    >
                      <option value="RASIO">Rasio (Pembilang / Penyebut)</option>
                      <option value="NILAI_TUNGGAL">
                        Nilai tunggal (hanya penyebut)
                      </option>
                    </select>
                  </div>

                  <div className="col-span-8">
                    <label className="text-sm font-medium mb-2 block text-white">
                      Rumus perhitungan (opsional — kosong = pakai default)
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="text"
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                        placeholder={
                          INVESTASI_form.mode === "RASIO"
                            ? "Contoh default: pemb / peny — atau rumus custom (pemb, peny)"
                            : "Contoh default: peny — atau rumus custom (peny / 1000)"
                        }
                        value={INVESTASI_form.formula || ""}
                        onChange={(e) =>
                          setINVESTASI_form((f) => ({
                            ...f,
                            formula: e.target.value,
                          }))
                        }
                      />

                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={INVESTASI_form.isPercent || false}
                          onChange={(e) =>
                            setINVESTASI_form((f) => ({
                              ...f,
                              isPercent: e.target.checked,
                            }))
                          }
                          className="w-6 h-6 rounded-full border-2 border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="w-12 h-12 flex items-center justify-center rounded-lg border-2 border-gray-300 bg-gray-100 text-lg font-bold">
                          %
                        </div>
                      </label>
                    </div>
                    <div className="text-xs text-white/80 mt-2">
                      Aktifkan checkbox untuk mengubah hasil menjadi persentase
                      (hasil × 100). Weighted tetap angka (bukan persen).
                    </div>
                  </div>
                </div>

                {/* Faktor Pembilang (hanya RASIO) */}
                {INVESTASI_form.mode !== "NILAI_TUNGGAL" && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block text-white">
                        Faktor Pembilang
                      </label>
                      <input
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                        value={INVESTASI_form.numeratorLabel}
                        onChange={(e) =>
                          setINVESTASI_form((f) => ({
                            ...f,
                            numeratorLabel: e.target.value,
                          }))
                        }
                        placeholder="Misal: Total Outstanding (OS) Non-Investment Grade"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block text-white">
                        Nilai Pembilang
                      </label>
                      <input
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                        value={INVESTASI_form.numeratorValue ?? ""}
                        onChange={(e) =>
                          setINVESTASI_form((f) => ({
                            ...f,
                            numeratorValue: e.target.value,
                          }))
                        }
                        placeholder="250"
                      />
                    </div>
                  </div>
                )}

                {/* Faktor Penyebut */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-white">
                      Faktor Penyebut
                    </label>
                    <input
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                      value={INVESTASI_form.denominatorLabel}
                      onChange={(e) =>
                        setINVESTASI_form((f) => ({
                          ...f,
                          denominatorLabel: e.target.value,
                        }))
                      }
                      placeholder={
                        INVESTASI_form.mode === "RASIO"
                          ? "Total Asset (Jutaan)"
                          : "Jumlah kejadian, jumlah kasus, dll."
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-white">
                      Nilai Penyebut
                    </label>
                    <input
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                      value={INVESTASI_form.denominatorValue ?? ""}
                      onChange={(e) =>
                        setINVESTASI_form((f) => ({
                          ...f,
                          denominatorValue: e.target.value,
                        }))
                      }
                      placeholder={INVESTASI_form.mode === "RASIO" ? "10000" : "5"}
                    />
                  </div>
                </div>

                {/* Sumber Risiko & Dampak */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-white">
                      Sumber Risiko
                    </label>
                    <textarea
                      rows={4}
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm resize-none bg-white"
                      value={INVESTASI_form.sumberRisiko}
                      onChange={(e) =>
                        setINVESTASI_form((f) => ({
                          ...f,
                          sumberRisiko: e.target.value,
                        }))
                      }
                      placeholder="Contoh: kelemahan proses, human error, kegagalan sistem, dsb."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-white">
                      Dampak
                    </label>
                    <textarea
                      rows={4}
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm resize-none bg-white"
                      value={INVESTASI_form.dampak}
                      onChange={(e) =>
                        setINVESTASI_form((f) => ({ ...f, dampak: e.target.value }))
                      }
                      placeholder="Contoh: kerugian finansial, penurunan layanan, risiko hukum, dsb."
                    />
                  </div>
                </div>

                {/* Hasil Preview, Peringkat, Weighted, Keterangan */}
                <div className="grid grid-cols-12 gap-4 mb-4">
                  <div className="col-span-6 flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium block text-white h-10 flex items-end">
                        Hasil Preview{" "}
                        {INVESTASI_form.mode === "RASIO"
                          ? " (Pembilang / Penyebut)"
                          : " (Nilai Penyebut)"}
                      </label>
                      <input
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-gray-50"
                        value={(() => {
                          const raw = computeInvestasiHasil(buildBaseRow());
                          if (raw === "" || raw == null) return "";
                          if (INVESTASI_form.isPercent) {
                            const pct = Number(raw) * 100;
                            if (!isFinite(pct) || isNaN(pct)) return "";
                            return `${pct.toFixed(2)}%`;
                          }
                          if (INVESTASI_form.mode === "NILAI_TUNGGAL") {
                            return fmtNumber(raw);
                          }
                          return Number(raw).toFixed(4);
                        })()}
                        readOnly
                      />
                    </div>

                    <div className="flex-1">
                      <label className="text-sm font-medium block text-white h-10 flex items-end">
                        Peringkat (1 – 5)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                        value={INVESTASI_form.peringkat ?? ""}
                        onChange={(e) =>
                          setINVESTASI_form((f) => ({
                            ...f,
                            peringkat:
                              e.target.value === "" ? "" : e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="flex-1">
                      <label className="text-sm font-medium block text-white h-10 flex items-end">
                        Weighted (auto)
                      </label>
                      <input
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-gray-50"
                        value={(() => {
                          const peringkatNum =
                            INVESTASI_form.peringkat === "" ||
                              INVESTASI_form.peringkat == null
                              ? 0
                              : Number(INVESTASI_form.peringkat);
                          const res =
                            typeof computeWeighted === "function"
                              ? computeWeighted(
                                INVESTASI_sectionForm.bobotSection,
                                INVESTASI_form.bobotIndikator,
                                peringkatNum
                              )
                              : computeWeightedLocal(
                                INVESTASI_sectionForm.bobotSection,
                                INVESTASI_form.bobotIndikator,
                                peringkatNum
                              );
                          return isNaN(res) ? "" : res.toFixed(2);
                        })()}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="col-span-6">
                    <div className="mt-4 grid grid-cols-5 gap-3">
                      <RiskField
                        className="w-full"
                        label="Low"
                        value={INVESTASI_form.low}
                        onChange={(v) =>
                          setINVESTASI_form((f) => ({
                            ...f,
                            low: v,
                          }))
                        }
                        color="#C6E0B4"
                        textColor="#000000"
                        placeholder="x ≤ 1%"
                      />

                      <RiskField
                        className="w-full"
                        label="Low to Moderate"
                        value={INVESTASI_form.lowToModerate}
                        onChange={(v) =>
                          setINVESTASI_form((f) => ({
                            ...f,
                            lowToModerate: v,
                          }))
                        }
                        color="#DDEBF7"
                        textColor="#000000"
                        placeholder="1% < x ≤ 2%"
                      />

                      <RiskField
                        className="w-full"
                        label="Moderate"
                        value={INVESTASI_form.moderate}
                        onChange={(v) =>
                          setINVESTASI_form((f) => ({
                            ...f,
                            moderate: v,
                          }))
                        }
                        color="#FFF2CC"
                        textColor="#000000"
                        placeholder="2% < x ≤ 3%"
                      />

                      <RiskField
                        className="w-full"
                        label="Moderate to High"
                        value={INVESTASI_form.moderateToHigh}
                        onChange={(v) =>
                          setINVESTASI_form((f) => ({
                            ...f,
                            moderateToHigh: v,
                          }))
                        }
                        color="#FFE699"
                        textColor="#000000"
                        placeholder="3% < x ≤ 4%"
                      />

                      <RiskField
                        className="w-full"
                        label="High"
                        value={INVESTASI_form.high}
                        onChange={(v) =>
                          setINVESTASI_form((f) => ({
                            ...f,
                            high: v,
                          }))
                        }
                        color="#F8CBAD"
                        textColor="#000000"
                        placeholder="x > 4%"
                      />
                    </div>
                  </div>
                </div>

                <label className="text-sm font-medium block text-white h-10 flex items-end">
                  Keterangan
                </label>
                <textarea
                  rows={3}
                  className="w-[705px] rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                  value={INVESTASI_form.keterangan}
                  onChange={(e) =>
                    setINVESTASI_form((f) => ({
                      ...f,
                      keterangan: e.target.value,
                    }))
                  }
                />

                {/* Tombol Tambah / Simpan */}
                <div className="mt-6 flex justify-end">
                  {!INVESTASI_editingRow ? (
                    <button
                      onClick={INVESTASI_addRow}
                      className="px-8 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold"
                    >
                      + Tambah
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={INVESTASI_saveEdit}
                        className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                      >
                        Simpan
                      </button>
                      <button
                        onClick={INVESTASI_resetForm}
                        className="px-8 py-3 rounded-lg border-2 border-gray-300 hover:bg-gray-50 font-semibold"
                      >
                        Batal
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <section className="mt-4">
              <div className="bg-white rounded-2xl shadow overflow-hidden">
                <div className="relative h-[350px]">
                  <div className="absolute inset-0 overflow-auto">
                    <DataTable
                      rows={INVESTASI_filtered}
                      totalWeighted={INVESTASI_totalWeighted}
                      viewYear={viewYear}
                      viewQuarter={viewQuarter}
                      startEdit={INVESTASI_startEdit}
                      removeRow={INVESTASI_removeRow}
                    />
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ================= TAB: KPMR ================= */}
        {activeTab === "kpmr" && (
          <div className="space-y-6">
            {/* Header */}
            <header className="rounded-xl shadow-sm">
              <div className="px-4 py-4 flex items-center justify-between gap-3">
                <h1 className="text-2xl font-bold">KPMR – Investasi</h1>

                <div className="flex items-center gap-2">
                  <div>
                    <input
                      type="number"
                      value={viewYear}
                      onChange={(e) => {
                        const v = Number(
                          e.target.value || new Date().getFullYear()
                        );
                        setViewYear(v);
                        setKPMR_form((f) => ({ ...f, year: v }));
                      }}
                      className="w-20 rounded-xl px-3 py-2 border"
                    />
                  </div>

                  <div>
                    <select
                      value={viewQuarter}
                      onChange={(e) => {
                        const v = e.target.value;
                        setViewQuarter(v);
                        setKPMR_form((f) => ({ ...f, quarter: v }));
                      }}
                      className="rounded-xl px-3 py-2 border"
                    >
                      <option>Q1</option>
                      <option>Q2</option>
                      <option>Q3</option>
                      <option>Q4</option>
                    </select>
                  </div>

                  <div className="relative">
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Cari aspek/section/evidence…"
                      className="pl-9 pr-3 py-2 rounded-xl border w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
                      aria-label="Cari data KPMR"
                    />
                    <Search
                      size={16}
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>

                  <button
                    onClick={KPMR_exportExcel}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border bg-gray-900 text-white hover:bg-black"
                  >
                    <Download size={18} /> Export {viewYear}-{viewQuarter}
                  </button>
                </div>
              </div>
            </header>

            {/* FORM KPMR */}
            <section
              className={`rounded-2xl border shadow p-4 ${PNM_BRAND.gradient} text-white`}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold drop-shadow">
                  Form KPMR – Investasi
                </h2>
                <div className="text-sm text-white/90">
                  Periode:{" "}
                  <span className="font-semibold">
                    {KPMR_form.year}-{KPMR_form.quarter}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* kiri */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <div className="mb-1 text-[13px] text-white/90 font-medium">
                        Aspek (No)
                      </div>
                      <input
                        className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/40"
                        value={KPMR_form.aspekNo}
                        onChange={(e) =>
                          KPMR_handleChange("aspekNo", e.target.value)
                        }
                      />
                    </label>

                    <label className="block">
                      <div className="mb-1 text-[13px] text-white/90 font-medium">
                        Bobot Aspek
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          className="w-full rounded-xl pl-3 pr-10 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/40"
                          value={KPMR_form.aspekBobot}
                          onChange={(e) =>
                            KPMR_handleChange(
                              "aspekBobot",
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value)
                            )
                          }
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                          %
                        </span>
                      </div>
                    </label>
                  </div>

                  <label className="block">
                    <div className="mb-1 text-[13px] text-white/90 font-medium">
                      Judul Aspek
                    </div>
                    <input
                      className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/40"
                      value={KPMR_form.aspekTitle}
                      onChange={(e) =>
                        KPMR_handleChange("aspekTitle", e.target.value)
                      }
                    />
                  </label>

                  <div className="grid grid-cols-3 gap-3">
                    <label className="block">
                      <div className="mb-1 text-[13px] text-white/90 font-medium">
                        No Section
                      </div>
                      <input
                        className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/40"
                        value={KPMR_form.sectionNo}
                        onChange={(e) =>
                          KPMR_handleChange("sectionNo", e.target.value)
                        }
                      />
                    </label>

                    <label className="block">
                      <div className="mb-1 text-[13px] text-white/90 font-medium">
                        Skor Section
                      </div>
                      <input
                        type="number"
                        className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/40"
                        value={KPMR_form.sectionSkor}
                        onChange={(e) =>
                          KPMR_handleChange(
                            "sectionSkor",
                            e.target.value === ""
                              ? ""
                              : Number(e.target.value)
                          )
                        }
                      />
                    </label>

                    <label className="block">
                      <div className="mb-1 text-[13px] text-white/90 font-medium">
                        Skor Average
                      </div>
                      <input
                        className="w-full rounded-xl px-3 py-2 bg-white/70 text-gray-900"
                        value={(() => {
                          const sameAspek = KPMR_filtered.filter(
                            (r) =>
                              r.aspekNo === KPMR_form.aspekNo &&
                              r.aspekTitle === KPMR_form.aspekTitle
                          );
                          const nums = sameAspek
                            .map((r) =>
                              r.sectionSkor === ""
                                ? null
                                : Number(r.sectionSkor)
                            )
                            .filter((v) => v != null && !isNaN(v));
                          return nums.length
                            ? (
                              nums.reduce((a, b) => a + b, 0) /
                              nums.length
                            ).toFixed(2)
                            : "";
                        })()}
                        readOnly
                      />
                    </label>
                  </div>

                  <label className="block">
                    <div className="mb-1 text-[13px] text-white/90 font-medium">
                      Pertanyaan Section
                    </div>
                    <textarea
                      className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 min-h-[64px] focus:outline-none focus:ring-2 focus:ring-white/40"
                      value={KPMR_form.sectionTitle}
                      onChange={(e) =>
                        KPMR_handleChange("sectionTitle", e.target.value)
                      }
                    />
                  </label>

                  <label className="block">
                    <div className="mb-1 text-[13px] text-white/90 font-medium">
                      Evidence
                    </div>
                    <textarea
                      className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 min-h-[56px] focus:outline-none focus:ring-2 focus:ring-white/40"
                      value={KPMR_form.evidence}
                      onChange={(e) =>
                        KPMR_handleChange("evidence", e.target.value)
                      }
                    />
                  </label>
                </div>

                {/* kanan: 5 level */}
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <div
                      key={v}
                      className="rounded-xl shadow-sm bg-white/95 backdrop-blur"
                    >
                      <div className="px-3 pt-3 text-[13px] font-semibold text-gray-800">
                        {v}.{" "}
                        {
                          [
                            "Strong",
                            "Satisfactory",
                            "Fair",
                            "Marginal",
                            "Unsatisfactory",
                          ][v - 1]
                        }
                      </div>
                      <div className="p-3">
                        <textarea
                          className="w-full rounded-lg px-3 py-2 bg-white min-h-[56px] focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-gray-900"
                          value={KPMR_form[`level${v}`]}
                          onChange={(e) =>
                            KPMR_handleChange(`level${v}`, e.target.value)
                          }
                          placeholder={`Deskripsi ${v} (${[
                              "Strong",
                              "Satisfactory",
                              "Fair",
                              "Marginal",
                              "Unsatisfactory",
                            ][v - 1]
                            })…`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* tombol */}
              <div className="flex justify-end gap-2 mt-4">
                {KPMR_editingIndex === null ? (
                  <button
                    onClick={KPMR_addRow}
                    className="bg-white/90 text-gray-900 font-semibold px-5 py-2 rounded-lg shadow mt-7"
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
                      onClick={() => {
                        setKPMR_editingIndex(null);
                        KPMR_resetForm();
                      }}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border bg-transparent hover:bg-white/10"
                    >
                      Batal
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* tabel hasil KPMR */}
            <section className="bg-white rounded-2xl shadow overflow-hidden">
              <div className="px-4 py-3 bg-gray-100 border-b">
                <div className="font-semibold">
                  Data KPMR – Investasi ({viewYear}-{viewQuarter})
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-[1400px] text-sm border border-gray-300 border-collapse">
                  <thead>
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
                      <th
                        className="border px-3 py-2 text-center w-[260px]"
                        rowSpan={2}
                      >
                        Evidence
                      </th>
                    </tr>
                    <tr className="bg-[#1f4e79] text-white">
                      <th className="border px-3 py-2 w-20">No</th>
                      <th className="border px-3 py-2">
                        Pertanyaan / Indikator
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {KPMR_groups.length === 0 ? (
                      <tr>
                        <td
                          className="border px-3 py-6 text-center text-gray-500"
                          colSpan={9}
                        >
                          Belum ada data
                        </td>
                      </tr>
                    ) : (
                      KPMR_groups.map((g, gi) => {
                        const vals = g.items
                          .map((it) =>
                            it.sectionSkor === ""
                              ? null
                              : Number(it.sectionSkor)
                          )
                          .filter((v) => v != null && !isNaN(v));
                        const skorAspek = vals.length
                          ? (
                            vals.reduce((a, b) => a + b, 0) / vals.length
                          ).toFixed(2)
                          : "";

                        return (
                          <React.Fragment key={gi}>
                            {/* baris aspek */}
                            <tr className="bg-[#e9f5e1]">
                              <td
                                className="border px-3 py-2 font-semibold"
                                colSpan={2}
                              >
                                {g.aspekNo} : {g.aspekTitle}{" "}
                                <span className="text-gray-600">
                                  (Bobot: {g.aspekBobot}%)
                                </span>
                              </td>
                              <td
                                className="border px-3 py-2 text-center font-bold"
                                style={{ backgroundColor: "#93d150" }}
                              >
                                {skorAspek}
                              </td>
                              <td
                                className="border px-3 py-2"
                                colSpan={5}
                              ></td>
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
                                <tr
                                  key={`${gi}-${idx}`}
                                  className="align-top hover:bg-gray-50"
                                >
                                  <td className="border px-2 py-2 text-center">
                                    {r.sectionNo}
                                  </td>
                                  <td className="border px-2 py-2 whitespace-pre-wrap">
                                    {r.sectionTitle}
                                  </td>
                                  <td className="border px-2 py-2 text-center">
                                    {r.sectionSkor}
                                  </td>
                                  <td className="border px-2 py-2 whitespace-pre-wrap">
                                    {r.level1}
                                  </td>
                                  <td className="border px-2 py-2 whitespace-pre-wrap">
                                    {r.level2}
                                  </td>
                                  <td className="border px-2 py-2 whitespace-pre-wrap">
                                    {r.level3}
                                  </td>
                                  <td className="border px-2 py-2 whitespace-pre-wrap">
                                    {r.level4}
                                  </td>
                                  <td className="border px-2 py-2 whitespace-pre-wrap">
                                    {r.level5}
                                  </td>
                                  <td className="border px-2 py-2 whitespace-pre-wrap">
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="flex-1">
                                        {r.evidence || "-"}
                                      </span>
                                      <div className="flex gap-2 shrink-0">
                                        <button
                                          onClick={() =>
                                            KPMR_startEdit(filteredIndex)
                                          }
                                          className="inline-flex items-center gap-1 px-2 py-1 rounded border hover:bg-gray-50"
                                          title="Edit baris ini"
                                        >
                                          <Edit3 size={14} /> Edit
                                        </button>
                                        <button
                                          onClick={() =>
                                            KPMR_removeRow(filteredIndex)
                                          }
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
                      <td
                        className="border px-3 py-2 text-center font-bold"
                        style={{ backgroundColor: "#93d150" }}
                      >
                        {(() => {
                          if (!KPMR_groups || KPMR_groups.length === 0)
                            return "";
                          const perAspek = KPMR_groups
                            .map((g) => {
                              const vals = g.items
                                .map((it) =>
                                  it.sectionSkor === ""
                                    ? null
                                    : Number(it.sectionSkor)
                                )
                                .filter(
                                  (v) => v != null && !isNaN(v)
                                );
                              return vals.length
                                ? vals.reduce((a, b) => a + b, 0) /
                                vals.length
                                : null;
                            })
                            .filter((v) => v != null && !isNaN(v));
                          return perAspek.length
                            ? (
                              perAspek.reduce((a, b) => a + b, 0) /
                              perAspek.length
                            ).toFixed(2)
                            : "";
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
