// src/features/Dashboard/pages/RiskProfile/pages/Operational.jsx
import React, { useState, useMemo } from "react";
import {
  Download,
  Trash2,
  Edit3,
  Search,
  Plus,
  ChevronDown,
} from "lucide-react";
import {
  YearInput,
  QuarterSelect,
} from "../../../components/Inputs.jsx";

// SAMA seperti Likuiditas.jsx
import { exportKPMRPasarToExcel } from "../utils/exportExcelKPMR_Pasar";
import { exportKPMRInvestasiToExcel } from "../utils/exportExcelKPMR";

// ===================== Brand =====================
const PNM_BRAND = {
  primary: "#0068B3",
  primarySoft: "#E6F1FA",
  gradient: "bg-gradient-to-r from-[#0076C6]/90 via-[#00A3DA]/90 to-[#33C2B5]/90",
};

// formatters
const fmtNumber = (v) => {
  if (v === "" || v == null) return "";
  const n = Number(String(v).replace(/,/g, ""));
  if (isNaN(n)) return String(v);
  return new Intl.NumberFormat("en-US").format(n);
};

const emptyIndicator = {
  id: null,
  subNo: "",
  indikator: "",
  // mode perhitungan: "RASIO" atau "NILAI_TUNGGAL"
  mode: "RASIO",
  // optional custom formula as string
  formula: "",
  // apakah tampil sebagai persen di UI
  isPercent: false,
  bobotIndikator: 0,
  sumberRisiko: "",
  dampak: "",
  pembilangLabel: "",
  pembilangValue: "",
  penyebutLabel: "",
  penyebutValue: "",
  peringkat: 1,
  weighted: "",
  hasil: "",
  keterangan: "",
};

// KPMR template
const KPMR_EMPTY_FORM = {
  year: new Date().getFullYear(),
  quarter: "Q1",
  aspekNo: "Aspek 1",
  aspekTitle: "Tata Kelola Risiko Operasional",
  aspekBobot: 30,
  sectionNo: "1",
  sectionTitle: "Bagaimana penerapan manajemen risiko operasional?",
  sectionSkor: "",
  level1: "",
  level2: "",
  level3: "",
  level4: "",
  level5: "",
  evidence: "",
};

export default function Operasional() {
  const [activeTab, setActiveTab] = useState("operasional");

  // periode & search (dipakai di kedua tab)
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewQuarter, setViewQuarter] = useState("Q1");
  const [query, setQuery] = useState("");

  // -------------------- OPERASIONAL (indikator) --------------------
  const [sections, setSections] = useState([
    {
      id: "s-1",
      no: "4.1",
      bobotSection: 100,
      parameter: "Kualitas Pengelolaan Risiko Operasional",
      indicators: [
        {
          id: "i-1",
          subNo: "4.1.1",
          indikator: "Jumlah kejadian fraud internal",
          mode: "NILAI_TUNGGAL",
          bobotIndikator: 50,
          sumberRisiko: "Kelemahan pengendalian internal, kurangnya pemisahan fungsi.",
          dampak: "Kerugian finansial dan reputasi perusahaan.",
          pembilangLabel: "",
          pembilangValue: "",
          penyebutLabel: "Jumlah kejadian fraud (kasus)",
          penyebutValue: "5",
          peringkat: 2,
          weighted: 10,
          hasil: 5,
          keterangan: "Data per triwulan",
          formula: "",
          isPercent: false,
        },
        {
          id: "i-2",
          subNo: "4.1.2",
          indikator: "Rasio kerugian operasional terhadap pendapatan",
          mode: "RASIO",
          bobotIndikator: 50,
          sumberRisiko: "Proses bisnis yang tidak terdokumentasi dengan baik.",
          dampak: "Meningkatnya biaya operasional dan penurunan profitabilitas.",
          pembilangLabel: "Kerugian operasional (juta rupiah)",
          pembilangValue: "250",
          penyebutLabel: "Pendapatan operasional (juta rupiah)",
          penyebutValue: "10000",
          peringkat: 1,
          weighted: 5,
          hasil: 0.025,
          keterangan: "Rasio rendah, masih aman.",
          formula: "",
          isPercent: false,
        },
      ],
    },
  ]);

  const [sectionForm, setSectionForm] = useState({
    id: "s-1",
    no: "4.1",
    bobotSection: 100,
    parameter: "Kualitas Pengelolaan Risiko Operasional",
  });

  const [indicatorForm, setIndicatorForm] = useState({ ...emptyIndicator });

  const filteredSections = useMemo(() => {
    if (!query.trim()) return sections;
    const q = query.toLowerCase();
    return sections
      .map((s) => {
        const matched = s.indicators.filter((it) => {
          return `${it.subNo} ${it.indikator} ${it.pembilangLabel} ${it.penyebutLabel} ${it.sumberRisiko} ${it.dampak} ${it.keterangan}`
            .toLowerCase()
            .includes(q);
        });
        if (s.parameter.toLowerCase().includes(q) || matched.length > 0) {
          return { ...s, indicators: matched.length ? matched : s.indicators };
        }
        return null;
      })
      .filter(Boolean);
  }, [sections, query]);

  const totalWeighted = useMemo(() => {
    return sections.reduce(
      (sum, s) =>
        sum +
        s.indicators.reduce((ss, it) => ss + (Number(it.weighted) || 0), 0),
      0
    );
  }, [sections]);

  function selectSection(id) {
    const s = sections.find((x) => x.id === id);
    if (s) {
      setSectionForm({
        id: s.id,
        no: s.no,
        bobotSection: s.bobotSection,
        parameter: s.parameter,
      });
    }
  }

  function addSection() {
    const id = `s-${Date.now()}`;
    const s = {
      id,
      no: sectionForm.no || "",
      bobotSection: Number(sectionForm.bobotSection || 0),
      parameter: sectionForm.parameter || "",
      indicators: [],
    };
    setSections((p) => [...p, s]);
    setSectionForm({
      id: s.id,
      no: s.no,
      bobotSection: s.bobotSection,
      parameter: s.parameter,
    });
  }

  function saveSection() {
    if (!sectionForm.id) return;
    setSections((p) =>
      p.map((s) =>
        s.id === sectionForm.id
          ? {
            ...s,
            no: sectionForm.no,
            bobotSection: Number(sectionForm.bobotSection || 0),
            parameter: sectionForm.parameter,
          }
          : s
      )
    );
  }

  function removeSection(id) {
    setSections((p) => p.filter((s) => s.id !== id));
    setSectionForm({ id: "", no: "", bobotSection: 0, parameter: "" });
  }

  function setIndicatorField(k, v) {
    setIndicatorForm((p) => ({ ...p, [k]: v }));
  }

  // helper: parse angka dari input (menerima "5,232" atau "5232" atau  "1.23")
  function parseNum(v) {
    if (v == null || v === "") return 0;
    const s = String(v).replace(/,/g, "").trim();
    const n = parseFloat(s);
    return isNaN(n) ? 0 : n;
  }

  // ind: indicator object, bisa punya field `formula` (opsional)
  // formula allowed: expression using variables pemb and peny
  function computeHasil(ind) {
    const mode = ind.mode || "RASIO";
    const pemb = parseNum(ind.pembilangValue);
    const peny = parseNum(ind.penyebutValue);

    // custom formula
    if (ind.formula && typeof ind.formula === "string" && ind.formula.trim() !== "") {
      try {
        const expr = ind.formula
          .replace(/\bpemb\b/g, "pemb")
          .replace(/\bpeny\b/g, "peny");
        // minimal safety: allow digits, whitespace, operators, pemb, peny, parentheses, dot
        if (!/^[\d\.\+\-\*\/\(\)\spenbmycubrEPBSajklnt,_%]+$/.test(expr) && !/pemb|peny/.test(expr)) {
          // but we won't block if it contains pemb/peny - keep minimal
        }
        // Evaluate
        const fn = new Function("pemb", "peny", `return (${expr});`);
        const res = fn(pemb, peny);
        if (!isFinite(res) || isNaN(res)) return "";
        return Number(res);
      } catch (err) {
        console.warn("Invalid formula:", ind.formula, err);
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
  }

  function computeWeightedAuto(ind, sectionBobot) {
    const sectionB = Number(sectionBobot || 0);
    const bobotInd = Number(ind.bobotIndikator || 0);
    const peringkat = Number(ind.peringkat || 0);
    const res = (sectionB * bobotInd * peringkat) / 10000;
    if (!isFinite(res) || isNaN(res)) return 0;
    return res;
  }

  function addIndicator() {
    if (!sectionForm.id) {
      alert("Pilih atau buat section dulu.");
      return;
    }
    const sIdx = sections.findIndex((s) => s.id === sectionForm.id);
    if (sIdx === -1) {
      alert("Section tidak ditemukan.");
      return;
    }
    const it = {
      ...indicatorForm,
      id: `i-${Date.now()}`,
    };
    it.hasil = computeHasil(it);
    it.weighted = computeWeightedAuto(it, sections[sIdx].bobotSection);
    setSections((p) =>
      p.map((s) =>
        s.id === sectionForm.id
          ? { ...s, indicators: [...s.indicators, it] }
          : s
      )
    );
    setIndicatorForm({ ...emptyIndicator });
  }

  function editIndicator(sectionId, indicatorId) {
    const s = sections.find((x) => x.id === sectionId);
    if (!s) return;
    const it = s.indicators.find((x) => x.id === indicatorId);
    if (!it) return;
    setIndicatorForm({ ...it });
    setSectionForm((f) => ({
      ...f,
      id: s.id,
      no: s.no,
      bobotSection: s.bobotSection,
      parameter: s.parameter,
    }));
  }

  function saveIndicatorEdit() {
    if (!indicatorForm.id || !sectionForm.id) return;
    setSections((p) =>
      p.map((s) =>
        s.id !== sectionForm.id
          ? s
          : {
            ...s,
            indicators: s.indicators.map((it) =>
              it.id === indicatorForm.id
                ? {
                  ...indicatorForm,
                  hasil: computeHasil(indicatorForm),
                  weighted: computeWeightedAuto(indicatorForm, s.bobotSection),
                }
                : it
            ),
          }
      )
    );
    setIndicatorForm({ ...emptyIndicator });
  }

  function removeIndicator(sectionId, indicatorId) {
    setSections((p) =>
      p.map((s) =>
        s.id !== sectionId
          ? s
          : {
            ...s,
            indicators: s.indicators.filter((it) => it.id !== indicatorId),
          }
      )
    );
  }

  // total baris per indikator (untuk rowSpan section)
  function rowsPerIndicator(ind) {
    return 1 + (ind.mode === "RASIO" ? 2 : 1);
  }

  // -------------------- KPMR OPERASIONAL --------------------
  const [KPMR_rows, setKPMR_rows] = useState([]);
  const [KPMR_form, setKPMR_form] = useState({
    ...KPMR_EMPTY_FORM,
    year: viewYear,
    quarter: viewQuarter,
  });
  const [KPMR_editingIndex, setKPMR_editingIndex] = useState(null);

  const KPMR_handleChange = (k, v) =>
    setKPMR_form((f) => ({ ...f, [k]: v }));

  const KPMR_filtered = useMemo(() => {
    return KPMR_rows
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
      return {
        aspekNo,
        aspekTitle,
        aspekBobot: Number(aspekBobot),
        items,
      };
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

  // -------------------- EXPORT HELPERS --------------------
  function handleExportOperasionalIndikator() {
    const selectedSection =
      sections.find((s) => s.id === sectionForm.id) || sections[0];

    if (!selectedSection) {
      alert("Belum ada section untuk diexport.");
      return;
    }

    const rows = selectedSection.indicators || [];
    if (!rows.length) {
      alert("Section ini belum punya indikator untuk diexport.");
      return;
    }

    // gunakan util yang sama dengan Likuiditas (Pasar)
    exportKPMRPasarToExcel({
      year: viewYear,
      quarter: viewQuarter,
      sectionNo: selectedSection.no,
      sectionLabel: selectedSection.parameter,
      bobotSection: selectedSection.bobotSection,
      rows,
    });
  }

  function handleExportKPMR() {
    // sama seperti halaman lain
    if (typeof exportKPMRInvestasiToExcel === "function") {
      exportKPMRInvestasiToExcel({
        year: viewYear,
        quarter: viewQuarter,
        rows: KPMR_filtered,
      });
    } else {
      alert("Fungsi exportKPMRInvestasiToExcel tidak ditemukan.");
    }
  }

  // -------------------- RENDER --------------------
  return (
    <div className="p-6 bg-[#f3f6f8] min-h-screen">
      {/* HERO */}
      <div className={`relative rounded-2xl overflow-hidden mb-6 shadow-sm ${PNM_BRAND.gradient}`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_0%,white,transparent_40%),radial-gradient(circle_at_80%_100%,white,transparent_35%)]" />
        <div className="relative px-6 py-7 sm:px-8 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
            Risk Form – Operasional
          </h1>
          <p className="mt-1 text-white/90 text-sm">
            Form Risiko Operasional &amp; KPMR dalam 1 halaman.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("operasional")}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "operasional"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
              }`}
          >
            Operasional
          </button>

          <button
            onClick={() => setActiveTab("kpmr")}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "kpmr"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
              }`}
          >
            KPMR Operasional
          </button>
        </nav>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        {/* ---------- TAB OPERASIONAL ---------- */}
        {activeTab === "operasional" && (
          <>
            <header className="px-4 py-4 flex items-center justify-between gap-3">
              <h2 className="text-xl sm:text-2xl font-semibold">
                Form – Risiko Operasional
              </h2>
              <div className="flex items-end gap-4">
                {/* tahun + triwulan */}
                <div className="hidden md:flex items-end gap-4">

                  {/* Tahun */}
                  <div className="flex flex-col gap-1">
                    <YearInput
                      value={viewYear}
                      onChange={(v) => setViewYear(v)}
                    />
                  </div>

                  {/* Triwulan */}
                  <div className="flex flex-col gap-1">
                    <QuarterSelect
                      value={viewQuarter}
                      onChange={(v) => setViewQuarter(v)}
                    />
                  </div>
                </div>

                {/* search + export */}
                <div className="flex items-end gap-2">
                  <div className="relative">
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Cari no/sub/indikator…"
                      className="pl-9 pr-3 py-2 rounded-xl border w-64"
                    />
                    <Search
                      size={16}
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>

                  <button
                    onClick={handleExportOperasionalIndikator}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border bg-gray-900 text-white hover:bg-black"
                  >
                    <Download size={18} /> Export {viewYear}-{viewQuarter}
                  </button>
                </div>
              </div>
            </header>

            {/* Section form */}
            <div className="relative rounded-2xl overflow-hidden mb-6 shadow-sm bg-gradient-to-r from-[#0076C6]/90 via-[#00A3DA]/90 to-[#33C2B5]/90">
              <div className="rounded-2xl border-2 border-gray-300 p-4 shadow-sm mb-6">
                <h2 className="text-white font-semibold text-lg sm:text-xl mb-6">
                  Form Section – Operasional
                </h2>

                {/* Row with No Sec | Bobot Sec | Section | Buttons */}
                <div className="flex items-end gap-4 mb-4">
                  {/* No Sec */}
                  <div className="flex flex-col">
                    <label className="text-xs text-white font-medium mb-1">No Sec</label>
                    <input
                      className="w-20 h-10 px-3 rounded-lg border-2 border-gray-300 text-center font-medium bg-white"
                      value={sectionForm.no}
                      onChange={(e) =>
                        setSectionForm((f) => ({ ...f, no: e.target.value }))
                      }
                    />
                  </div>

                  {/* Bobot Sec */}
                  <div className="flex flex-col">
                    <label className="text-xs text-white font-medium mb-1">Bobot Sec</label>
                    <input
                      type="number"
                      className="w-28 h-10 px-3 rounded-lg border-2 border-gray-300 text-center font-medium bg-white"
                      value={sectionForm.bobotSection ?? ""}
                      onChange={(e) =>
                        setSectionForm((f) => ({ ...f, bobotSection: e.target.value }))
                      }
                    />
                  </div>

                  {/* Section */}
                  <div className="flex-1 flex flex-col">
                    <label className="text-xs text-white font-medium mb-1">Section</label>
                    <input
                      className="w-full h-10 px-4 rounded-lg border-2 border-gray-300 font-medium bg-white"
                      value={sectionForm.parameter}
                      onChange={(e) =>
                        setSectionForm((f) => ({ ...f, parameter: e.target.value }))
                      }
                      placeholder="Uraian section risiko operasional"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 self-end">
                    <button
                      className="w-10 h-10 rounded-lg bg-green-500 hover:bg-green-600 text-white flex items-center justify-center"
                      onClick={addSection}
                      title="Tambah Section"
                    >
                      <Plus size={20} />
                    </button>
                    <button
                      className="w-10 h-10 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white flex items-center justify-center"
                      onClick={saveSection}
                      title="Edit Section"
                    >
                      <Edit3 size={20} />
                    </button>
                    <button
                      className="w-10 h-10 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
                      onClick={() => sectionForm.id && removeSection(sectionForm.id)}
                      title="Hapus Section"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Section Dropdown */}
                <div className="relative">
                  <label className="text-xs text-white font-medium mb-1 block">Section</label>
                  <select
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 font-medium appearance-none bg-white cursor-pointer pr-10"
                    value={sectionForm.id || ""}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      if (selectedId) selectSection(selectedId);
                    }}
                  >
                    <option value="">-- Pilih Section --</option>
                    {sections.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.no} - {s.parameter}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-9 pointer-events-none text-gray-400" size={20} />
                </div>
              </div>


              {/* Indicator form */}
              <div className="rounded-xl border-2 border-gray-300 shadow-sm p-6 mb-6">
                {/* Sub No + Indikator + Bobot */}
                <div className="grid grid-cols-12 gap-4 mb-4">
                  <div className="col-span-3">
                    <label className="text-sm font-medium mb-2 block text-white">
                      Sub No
                    </label>
                    <input
                      className="w-full rounded-lg border-2 border-gray-300 px-3 py-3 text-sm bg-white"
                      value={indicatorForm.subNo}
                      onChange={(e) =>
                        setIndicatorField("subNo", e.target.value)
                      }
                      placeholder="4.1.1"
                    />
                  </div>
                  <div className="col-span-6">
                    <label className="text-sm font-medium mb-2 block text-white">
                      Indikator
                    </label>
                    <input
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                      value={indicatorForm.indikator}
                      onChange={(e) =>
                        setIndicatorField("indikator", e.target.value)
                      }
                      placeholder="Nama indikator operasional…"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="text-sm font-medium mb-2 block text-white">
                      Bobot Indikator (%)
                    </label>
                    <input
                      type="number"
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm text-right bg-white"
                      value={indicatorForm.bobotIndikator ?? ""}
                      onChange={(e) =>
                        setIndicatorField("bobotIndikator", e.target.value)
                      }
                      placeholder="50"
                    />
                  </div>
                </div>

                {/* Mode Perhitungan + Formula (FORM BARU DI SAMPING) */}
                <div className="grid grid-cols-12 gap-4 mb-4">
                  {/* Select metode */}
                  <div className="col-span-4">
                    <label className="text-sm font-medium mb-2 block text-white">
                      Metode Perhitungan
                    </label>
                    <select
                      className="w-full rounded-lg border-2 border-gray-300 px-3 py-3 text-sm bg-white"
                      value={indicatorForm.mode}
                      onChange={(e) =>
                        setIndicatorField("mode", e.target.value)
                      }
                    >
                      <option value="RASIO">
                        Rasio (Pembilang / Penyebut)
                      </option>
                      <option value="NILAI_TUNGGAL">
                        Nilai tunggal (hanya penyebut)
                      </option>
                    </select>
                  </div>

                  {/* FORM RUMUS DI SAMPING */}
                  <div className="col-span-8">
                    <label className="text-sm font-medium mb-2 block text-white">
                      Rumus perhitungan (opsional — kosong = pakai default)
                    </label>

                    <div className="flex items-center gap-4">
                      {/* INPUT RUMUS */}
                      <input
                        type="text"
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                        placeholder={
                          indicatorForm.mode === "RASIO"
                            ? "Contoh default: pemb / peny  — atau rumus custom (pemb, peny)"
                            : "Contoh default: peny  — atau rumus custom (peny / 1000)"
                        }
                        value={indicatorForm.formula || ""}
                        onChange={(e) => setIndicatorField("formula", e.target.value)}
                      />

                      {/* CHECKBOX PERSEN */}
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={indicatorForm.isPercent || false}
                          onChange={(e) =>
                            setIndicatorField("isPercent", e.target.checked)
                          }
                          className="w-6 h-6 rounded-full border-2 border-gray-300 
                   text-blue-600 focus:ring-blue-500"
                        />

                        {/* KOTAK PERSEN (READONLY) */}
                        <div
                          className="w-12 h-12 flex items-center justify-center rounded-lg 
                   border-2 border-gray-300 bg-gray-100 text-lg font-bold"
                        >
                          %
                        </div>
                      </label>
                    </div>

                    <div className="text-xs text-white/80 mt-2">
                      Aktifkan checkbox untuk mengubah hasil menjadi persentase
                      (hasil × 100).
                    </div>
                  </div>
                </div>

                {/* Pembilang (hanya untuk RASIO) */}
                {indicatorForm.mode === "RASIO" && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block text-white">
                        Faktor Pembilang
                      </label>
                      <input
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                        value={indicatorForm.pembilangLabel}
                        onChange={(e) =>
                          setIndicatorField("pembilangLabel", e.target.value)
                        }
                        placeholder="Kerugian operasional (juta rupiah)"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block text-white">
                        Nilai Pembilang
                      </label>
                      <input
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                        value={indicatorForm.pembilangValue ?? ""}
                        onChange={(e) =>
                          setIndicatorField("pembilangValue", e.target.value)
                        }
                        placeholder="250"
                      />
                    </div>
                  </div>
                )}

                {/* Penyebut (selalu ada) */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-white">
                      Faktor Penyebut
                    </label>
                    <input
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                      value={indicatorForm.penyebutLabel}
                      onChange={(e) =>
                        setIndicatorField("penyebutLabel", e.target.value)
                      }
                      placeholder={
                        indicatorForm.mode === "RASIO"
                          ? "Pendapatan operasional (juta rupiah)"
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
                      value={indicatorForm.penyebutValue ?? ""}
                      onChange={(e) =>
                        setIndicatorField("penyebutValue", e.target.value)
                      }
                      placeholder={indicatorForm.mode === "RASIO" ? "10000" : "5"}
                    />
                  </div>
                </div>

                {/* Sumber risiko & dampak */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-white">
                      Sumber Risiko
                    </label>
                    <textarea
                      rows={4}
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm resize-none bg-white"
                      value={indicatorForm.sumberRisiko}
                      onChange={(e) =>
                        setIndicatorField("sumberRisiko", e.target.value)
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
                      value={indicatorForm.dampak}
                      onChange={(e) =>
                        setIndicatorField("dampak", e.target.value)
                      }
                      placeholder="Contoh: kerugian finansial, penurunan layanan, risiko hukum, dsb."
                    />
                  </div>
                </div>

                {/* Preview + peringkat + weighted + keterangan */}
                {/* Bottom Section: Hasil Preview, Peringkat, Weighted, Keterangan */}
                <div className="grid grid-cols-12 gap-4">
                  {/* Kiri: hasil preview, peringkat, weighted */}
                  <div className="col-span-6 flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium block text-white h-10 flex items-end">
                        Hasil Preview
                        {indicatorForm.mode === "RASIO"
                          ? " (Pembilang / Penyebut)"
                          : " (Nilai Penyebut)"}
                      </label>
                      <input
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-gray-50"
                        value={(() => {
                          const raw = computeHasil(indicatorForm);
                          if (raw === "" || raw == null) return "";
                          // jika checkbox persen aktif: tampilkan percent (raw * 100)
                          if (indicatorForm.isPercent) {
                            const pct = Number(raw) * 100;
                            if (!isFinite(pct) || isNaN(pct)) return "";
                            return `${pct.toFixed(2)}%`;
                          }
                          // formatting default:
                          if (indicatorForm.mode === "NILAI_TUNGGAL") {
                            return fmtNumber(raw);
                          }
                          return Number(raw).toFixed(4);
                        })()}
                        readOnly
                      />
                    </div>

                    <div className="flex-1">
                      <label className="text-sm font-medium block text-white h-10 flex items-end">
                        Peringkat (1 - 5)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                        value={indicatorForm.peringkat ?? ""}
                        onChange={(e) => setIndicatorField("peringkat", e.target.value)}
                      />
                    </div>

                    <div className="flex-1">
                      <label className="text-sm font-medium block text-white h-10 flex items-end">
                        Weighted (auto)
                      </label>
                      <input
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-gray-50"
                        value={
                          sectionForm.id
                            ? computeWeightedAuto(
                              indicatorForm,
                              Number(sectionForm.bobotSection || 0)
                            ).toFixed(2)
                            : ""
                        }
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Add / Save */}
              <div className="mt-6 flex justify-end">
                {!indicatorForm.id ? (
                  <button
                    onClick={addIndicator}
                    className="px-8 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold"
                  >
                    + Tambah
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={saveIndicatorEdit}
                      className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => setIndicatorForm({ ...emptyIndicator })}
                      className="px-8 py-3 rounded-lg border-2 border-gray-300 hover:bg-gray-50 font-semibold"
                    >
                      Batal
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* TABLE AREA */}
            <div className="rounded-xl border bg-white shadow-sm overflow-auto">
              <table className="min-w-[1300px] text-sm border border-gray-300 border-collapse">
                <thead>
                  <tr className="bg-[#1f4e79] text-white">
                    <th
                      className="border border-black px-3 py-2 text-left"
                      rowSpan={2}
                      style={{ width: 60 }}
                    >
                      No
                    </th>
                    <th
                      className="border border-black px-3 py-2 text-left"
                      rowSpan={2}
                      style={{ width: 80 }}
                    >
                      Bobot
                    </th>

                    {/* Group: Parameter atau Indikator */}
                    <th className="border border-black px-3 py-2 text-left" colSpan={3}>
                      Parameter atau Indikator
                    </th>

                    <th
                      className="border border-black px-3 py-2 text-center"
                      rowSpan={2}
                      style={{ width: 90 }}
                    >
                      Bobot Indikator
                    </th>
                    <th
                      className="border border-black px-3 py-2 text-left"
                      rowSpan={2}
                      style={{ width: 220 }}
                    >
                      Sumber Risiko
                    </th>
                    <th
                      className="border border-black px-3 py-2 text-left"
                      rowSpan={2}
                      style={{ width: 240 }}
                    >
                      Dampak
                    </th>
                    <th
                      className="border border-black px-3 py-2 bg-[#2e75b6]"
                      rowSpan={2}
                      style={{ width: 100 }}
                    >
                      Hasil
                    </th>
                    <th
                      className="border border-black px-3 py-2 bg-[#2e75b6]"
                      rowSpan={2}
                      style={{ width: 80 }}
                    >
                      Peringkat
                    </th>
                    <th
                      className="border border-black px-3 py-2 bg-[#2e75b6]"
                      rowSpan={2}
                      style={{ width: 90 }}
                    >
                      Weighted
                    </th>
                    <th
                      className="border border-black px-3 py-2 text-center"
                      rowSpan={2}
                      style={{ width: 80 }}
                    >
                      Aksi
                    </th>
                  </tr>

                  {/* sub header untuk group "Parameter atau Indikator" */}
                  <tr className="bg-[#1f4e79] text-white">
                    <th
                      className="border border-black px-3 py-2 text-left"
                      style={{ width: 260 }}
                    >
                      Section
                    </th>
                    <th
                      className="border border-black px-3 py-2 text-left"
                      style={{ width: 70 }}
                    >
                      Sub No
                    </th>
                    <th
                      className="border border-black px-3 py-2 text-left"
                      style={{ width: 260 }}
                    >
                      Indikator
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredSections.length === 0 ? (
                    <tr>
                      <td
                        className="border px-3 py-6 text-center text-gray-500"
                        colSpan={12}
                      >
                        Belum ada data
                      </td>
                    </tr>
                  ) : (
                    filteredSections.map((s) => {
                      if (!s) return null;
                      const inds = s.indicators || [];
                      if (!inds.length) {
                        return (
                          <tr key={s.id} className="bg-[#e9f5e1]">
                            <td className="border px-3 py-3 text-center">
                              {s.no}
                            </td>
                            <td className="border px-3 py-3 text-center">
                              {s.bobotSection}%
                            </td>
                            <td className="border px-3 py-3" colSpan={10}>
                              {s.parameter} – Belum ada indikator
                            </td>
                          </tr>
                        );
                      }

                      // total baris yang dipakai section ini:
                      // mode RASIO -> 3 baris (utama + pembilang + penyebut)
                      // mode NILAI_TUNGGAL -> 2 baris (utama + penyebut)
                      const sectionRowSpan = inds.reduce(
                        (acc, it) => acc + (it.mode === "RASIO" ? 3 : 2),
                        0
                      );

                      return (
                        <React.Fragment key={s.id}>
                          {inds.map((it, idx) => {
                            const firstOfSection = idx === 0;

                            const hasilDisplay = (() => {
                              // compute raw hasil if stored; fallback computeHasil
                              const raw = it.hasil === "" || it.hasil == null ? computeHasil(it) : it.hasil;
                              if (raw === "" || raw == null) return "";
                              const num = Number(raw);
                              if (!isFinite(num) || isNaN(num)) return String(raw);

                              // jika persen di-flag tampilkan *100 + %
                              if (it.isPercent) {
                                const pct = num * 100;
                                return `${pct.toFixed(2)}%`;
                              }

                              // format tergantung mode
                              if (it.mode === "RASIO") {
                                return num.toFixed(4);
                              } else {
                                return fmtNumber(num);
                              }
                            })();

                            const weightedDisplay =
                              typeof it.weighted === "number" ||
                                (typeof it.weighted === "string" &&
                                  it.weighted !== "" &&
                                  !isNaN(Number(it.weighted)))
                                ? Number(it.weighted).toFixed(2)
                                : "";

                            return (
                              <React.Fragment key={it.id}>
                                {/* BARIS UTAMA INDIKATOR */}
                                <tr>
                                  {firstOfSection && (
                                    <>
                                      <td
                                        rowSpan={sectionRowSpan}
                                        className="border px-3 py-3 align-top bg-[#d9eefb] text-center font-semibold"
                                      >
                                        {s.no}
                                      </td>
                                      <td
                                        rowSpan={sectionRowSpan}
                                        className="border px-3 py-3 align-top bg-[#d9eefb] text-center"
                                      >
                                        {s.bobotSection}% 
                                      </td>
                                      <td
                                        rowSpan={sectionRowSpan}
                                        className="border px-3 py-3 align-top bg-[#d9eefb]"
                                      >
                                        {s.parameter}
                                      </td>
                                    </>
                                  )}

                                  {/* Sub No & Indikator */}
                                  <td className="border px-3 py-3 text-center align-top bg-[#d9eefb]">
                                    {it.subNo}
                                  </td>
                                  <td className="border px-3 py-3 align-top bg-[#d9eefb]">
                                    <div className="font-medium">{it.indikator}</div>
                                  </td>

                                  {/* Bobot indikator */}
                                  <td className="border px-3 py-3 text-center align-top bg-[#d9eefb]">
                                    {it.bobotIndikator}%
                                  </td>

                                  <td className="border px-3 py-3 align-top bg-[#d9eefb]">
                                    {it.sumberRisiko}
                                  </td>
                                  <td className="border px-3 py-3 align-top bg-[#d9eefb]">
                                    {it.dampak}
                                  </td>

                                  {/* Hasil: untuk RASIO berisi rasio (atau persen jika dipilih),
                            untuk NILAI_TUNGGAL dibiarkan kosong (nilai tampil di baris penyebut hijau) */}
                                  <td className="border px-3 py-3 text-right">
                                    {hasilDisplay}
                                  </td>

                                  <td className="border px-3 py-3 text-center">
                                    <div
                                      style={{ minWidth: 36, minHeight: 24 }}
                                      className="inline-block rounded bg-yellow-300 px-2"
                                    >
                                      {it.peringkat}
                                    </div>
                                  </td>

                                  <td className="border px-3 py-3 text-right">
                                    {weightedDisplay}
                                  </td>

                                  <td className="border px-3 py-3 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                      <button
                                        onClick={() => editIndicator(s.id, it.id)}
                                        className="px-2 py-1 rounded border"
                                      >
                                        <Edit3 size={14} />
                                      </button>
                                      <button
                                        onClick={() => removeIndicator(s.id, it.id)}
                                        className="px-2 py-1 rounded border text-red-600"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>

                                {/* BARIS PEMBILANG – hanya kalau mode RASIO */}
                                {it.mode === "RASIO" && (
                                  <tr className="bg-white">
                                    {/* Sub No kosong */}
                                    <td className="border px-3 py-2 text-center"></td>

                                    {/* Label pembilang di kolom indikator */}
                                    <td className="border px-3 py-2">
                                      <div className="text-sm text-gray-700 mt-1">
                                        {it.pembilangLabel || "-"}
                                      </div>
                                    </td>

                                    {/* Bobot indikator kosong */}
                                    <td className="border px-3 py-2 text-center"></td>

                                    {/* Sumber + Dampak dikosongkan */}
                                    <td
                                      className="border px-3 py-2"
                                      colSpan={2}
                                    ></td>

                                    {/* Nilai pembilang di kolom Hasil, warna hijau */}
                                    <td className="border px-3 py-2 bg-[#c6d9a7] text-right">
                                      {it.pembilangValue
                                        ? fmtNumber(it.pembilangValue)
                                        : ""}
                                    </td>

                                    {/* Peringkat + Weighted + Aksi kosong */}
                                    <td
                                      className="border px-3 py-2"
                                      colSpan={3}
                                    ></td>
                                  </tr>
                                )}

                                {/* BARIS PENYEBUT – selalu ada */}
                                <tr className="bg-white">
                                  <td className="border px-3 py-2 text-center"></td>
                                  <td className="border px-3 py-2">
                                    <div className="text-sm text-gray-700 mt-1">
                                      {it.penyebutLabel || "-"}
                                    </div>
                                  </td>
                                  <td className="border px-3 py-2 text-center"></td>
                                  <td
                                    className="border px-3 py-2"
                                    colSpan={2}
                                  ></td>

                                  {/* Nilai penyebut di kolom Hasil, hijau */}
                                  <td className="border px-3 py-2 bg-[#c6d9a7] text-right">
                                    {it.penyebutValue ? fmtNumber(it.penyebutValue) : ""}
                                  </td>

                                  <td
                                    className="border px-3 py-2"
                                    colSpan={3}
                                  ></td>
                                </tr>
                              </React.Fragment>
                            );
                          })}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>

                <tfoot>
                  <tr>
                    {/* No–Dampak dikosongkan (8 kolom pertama) */}
                    <td className="border border-gray-400" colSpan={8}></td>

                    {/* Summary di bawah Hasil + Peringkat */}
                    <td
                      className="border border-gray-400 text-white font-semibold text-center bg-[#0b3861]"
                      colSpan={2}
                    >
                      Summary
                    </td>

                    {/* Total weighted di kolom Weighted */}
                    <td className="border border-gray-400 text-white font-semibold text-center bg-[#8fce00]">
                      {totalWeighted.toFixed(2)}
                    </td>

                    {/* kolom Aksi kosong */}
                    <td className="border border-gray-400"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        )}

        {/* ---------- TAB KPMR ---------- */}
        {activeTab === "kpmr" && (
          <div className="space-y-6">
            {/* Header */}
            <header className="rounded-xl shadow-sm">
              <div className="px-4 py-4 flex items-center justify-between gap-3">
                <h1 className="text-2xl font-bold">KPMR – Operasional</h1>

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
                    onClick={handleExportKPMR}
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
                  Form KPMR – Operasional
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
                              r.sectionSkor === "" ? null : Number(r.sectionSkor)
                            )
                            .filter((v) => v != null && !isNaN(v));
                          return nums.length
                            ? (
                              nums.reduce((a, b) => a + b, 0) / nums.length
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
                          ["Strong", "Satisfactory", "Fair", "Marginal", "Unsatisfactory"][
                          v - 1
                          ]
                        }
                      </div>
                      <div className="p-3">
                        <textarea
                          className="w-full rounded-lg px-3 py-2 bg.white min-h-[56px] focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-gray-900"
                          value={KPMR_form[`level${v}`]}
                          onChange={(e) =>
                            KPMR_handleChange(`level${v}`, e.target.value)
                          }
                          placeholder={`Deskripsi ${v} (${["Strong", "Satisfactory", "Fair", "Marginal", "Unsatisfactory"][v - 1]
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
                    className="bg-white/90 text-gray-900 font-semibold px-5 py-2 rounded-lg shadow mt-2"
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
                  Data KPMR – Operasional ({viewYear}-{viewQuarter})
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-[1400px] text-sm border border-gray-300 border-collapse">
                  <thead>
                    <tr className="bg-[#1f4e79] text-white">
                      <th className="border px-3 py-2 text-left" colSpan={2}>
                        KUALITAS PENERAPAN MANAJEMEN RISIKO
                      </th>
                      <th
                        className="border px-3 py-2 text-center w-24"
                        rowSpan={2}
                      >
                        Skor
                      </th>
                      <th
                        className="border px-3 py-2 text-center w-40"
                        rowSpan={2}
                      >
                        1 (Strong)
                      </th>
                      <th
                        className="border px-3 py-2 text-center w-40"
                        rowSpan={2}
                      >
                        2 (Satisfactory)
                      </th>
                      <th
                        className="border px-3 py-2 text-center w-40"
                        rowSpan={2}
                      >
                        3 (Fair)
                      </th>
                      <th
                        className="border px-3 py-2 text-center w-40"
                        rowSpan={2}
                      >
                        4 (Marginal)
                      </th>
                      <th
                        className="border px-3 py-2 text-center w-44"
                        rowSpan={2}
                      >
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
                            it.sectionSkor === "" ? null : Number(it.sectionSkor)
                          )
                          .filter((v) => v != null && !isNaN(v));
                        const skorAspek = vals.length
                          ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2)
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
