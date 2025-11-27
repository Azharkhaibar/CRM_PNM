  import React, { useState, useMemo } from "react";
  import { Download, Trash2, Edit3, Search, Plus, ChevronDown } from "lucide-react";
  import { RiskField, YearInput, QuarterSelect } from "../../../components/Inputs.jsx"; // tetap pakai komponenmu
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
    const n = Number(v);
    if (isNaN(n)) return String(v);
    return new Intl.NumberFormat("en-US").format(n);
  };

  const fmtPercentFromDecimal = (v) => {
    if (v === "" || v == null || isNaN(Number(v))) return "";
    return (Number(v) * 100).toFixed(2) + "%";
  };

  const emptyIndicator = {
    id: null,
    indikator: "",
    bobotIndikator: 0,
    sumberRisiko: "",
    dampak: "",
    pembilangLabel: "",
    pembilangValue: "",
    penyebutLabel: "",
    penyebutValue: "",
    low: "",
    lowToModerate: "",
    moderate: "",
    moderateToHigh: "",
    high: "",
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
    aspekTitle: "Tata Kelola Risiko",
    aspekBobot: 30,
    sectionNo: "1",
    sectionTitle:
      "Bagaimana perumusan tingkat risiko yang akan diambil (risk appetite) dan toleransi risiko (risk tolerance) terkait risiko pasar?",
    sectionSkor: "",
    level1: "",
    level2: "",
    level3: "",
    level4: "",
    level5: "",
    evidence: "",
  };

  export default function Pasar() {
    const [activeTab, setActiveTab] = useState("pasar");

    // periode & search (dipakai di kedua tab)
    const [viewYear, setViewYear] = useState(new Date().getFullYear());
    const [viewQuarter, setViewQuarter] = useState("Q1");
    const [query, setQuery] = useState("");

    // -------------------- PASAR (indikator) --------------------
    const [sections, setSections] = useState([
      {
        id: "s-1",
        no: "2.1",
        bobotSection: 40,
        parameter: "Volume dan Komposisi Portfolio Asset dan liabilitas yang terekspos risiko pasar",
        indicators: [
          {
            id: "i-1",
            indikator: "Frekuensi pencairan dengan nilai pencairan > 100 Milyar/nasabah dalam waktu singkat",
            bobotIndikator: 50,
            sumberRisiko: "Jumlah nasabah yang melakukan pencairan >100 Milyar/transaksi",
            dampak: "Penurunan laba berjalan atau penurunan kepercayaan pemegang saham dan stakeholder lainnya",
            pembilangLabel: "Jumlah nasabah yang melakukan pencairan >100 Milyar/transaksi",
            pembilangValue: "4000",
            penyebutLabel: "Jumlah nasabah yang melakukan pencairan >100 Milyar/transaksi",
            penyebutValue: "4000",
            low: "x ≤ 1%",
            lowToModerate: "1% < x ≤ 2%",
            moderate: "2% < x ≤ 3%",
            moderateToHigh: "3% < x ≤ 4%",
            high: "x > 4%",
            peringkat: 1,
            weighted: 20,
            hasil: 1,
            keterangan: "Loading",
          },
        ],
      },
    ]);

    const [sectionForm, setSectionForm] = useState({
      id: "s-1",
      no: "2.1",
      bobotSection: 40,
      parameter: "Volume dan Komposisi Portfolio Asset dan liabilitas yang terekspos risiko pasar",
    });

    const [indicatorForm, setIndicatorForm] = useState({ ...emptyIndicator });

    const filteredSections = useMemo(() => {
      if (!query.trim()) return sections;
      const q = query.toLowerCase();
      return sections
        .map((s) => {
          const matched = s.indicators.filter((it) => {
            return (
              `${it.indikator} ${it.pembilangLabel} ${it.penyebutLabel} ${it.sumberRisiko} ${it.dampak} ${it.keterangan}`.toLowerCase().includes(q)
            );
          });
          if (s.parameter.toLowerCase().includes(q) || matched.length > 0) {
            return { ...s, indicators: matched.length ? matched : s.indicators };
          }
          return null;
        })
        .filter(Boolean);
    }, [sections, query]);

    const totalWeighted = useMemo(() => {
      return sections.reduce((sum, s) => sum + s.indicators.reduce((ss, it) => ss + (Number(it.weighted) || 0), 0), 0);
    }, [sections]);

    const avgHasilPercent = useMemo(() => {
      const vals = [];
      for (const s of sections) {
        for (const it of s.indicators) {
          const hasilNum = typeof it.hasil === "number" ? it.hasil : Number(it.hasil);
          if (!isNaN(hasilNum) && hasilNum !== 0) {
            vals.push(hasilNum);
          }
        }
      }
      if (!vals.length) return "";
      return ((vals.reduce((a, b) => a + b, 0) / vals.length) * 100).toFixed(2) + "%";
    }, [sections]);

    function selectSection(id) {
      const s = sections.find((x) => x.id === id);
      if (s) setSectionForm({ id: s.id, no: s.no, bobotSection: s.bobotSection, parameter: s.parameter });
    }

    function addSection() {
      const id = `s-${Date.now()}`;
      const s = {
        id,
        no: sectionForm.no || "",
        bobotSection: Number(sectionForm.bobotSection || 0),
        parameter: sectionForm.parameter || "",
        indicators: []
      };
      setSections((p) => [...p, s]);
      setSectionForm({ id: s.id, no: s.no, bobotSection: s.bobotSection, parameter: s.parameter });
    }

    function saveSection() {
      if (!sectionForm.id) return;
      setSections((p) =>
        p.map((s) =>
          s.id === sectionForm.id
            ? { ...s, no: sectionForm.no, bobotSection: Number(sectionForm.bobotSection || 0), parameter: sectionForm.parameter }
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

    function computeHasil(ind) {
      const num = Number(ind.pembilangValue || 0);
      const den = Number(ind.penyebutValue || 0);
      if (!den) return "";
      const result = num / den;
      if (!isFinite(result) || isNaN(result)) return "";
      return Number(result.toFixed(6));
    }

    function computeWeightedAuto(ind, sectionBobot) {
      const sectionB = Number(sectionBobot || 0);
      const bobotInd = Number(ind.bobotIndikator || 0);
      const peringkat = Number(ind.peringkat || 0);
      // note: earlier formula in your project: Weighted = Bobot Section × Bobot Indikator × Peringkat ÷ 10000
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
      const it = { ...indicatorForm, id: `i-${Date.now()}` };
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
      setSectionForm((f) => ({ ...f, id: s.id, no: s.no, bobotSection: s.bobotSection, parameter: s.parameter }));
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
                    weighted: computeWeightedAuto(indicatorForm, s.bobotSection)
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
            : { ...s, indicators: s.indicators.filter((it) => it.id !== indicatorId) }
        )
      );
    }

    const rowsPerIndicator = 3;

    // -------------------- KPMR PASAR --------------------
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

    // -------------------- EXPORT HELPERS --------------------
    // Build rows compatible with investasi exporter
    function buildExportRowsFromSections(sectionsArr) {
      const rows = [];
      for (const s of sectionsArr) {
        const sectionNo = s.no || "";
        const bobotSection = s.bobotSection || 0;
        const parameter = s.parameter || "";
        if (!s.indicators || s.indicators.length === 0) {
          // ...
        } else {
          s.indicators.forEach((it, idx) => {
            rows.push({
              year: viewYear,
              quarter: viewQuarter,
              no: sectionNo,
              // ❌ sebelumnya:
              // subNo: `${sectionNo}-${idx + 1}`,
              // ✅ ganti jadi kosong supaya tidak dipakai:
              subNo: "",
              sectionLabel: parameter,
              indikator: it.indikator || "",
              bobotSection,
              bobotIndikator: it.bobotIndikator ?? "",
              sumberRisiko: it.sumberRisiko ?? "",
              dampak: it.dampak ?? "",
              pembilangLabel: it.pembilangLabel ?? "",
              pembilangValue: it.pembilangValue ?? "",
              penyebutLabel: it.penyebutLabel ?? "",
              penyebutValue: it.penyebutValue ?? "",
              hasil: it.hasil ?? "",
              peringkat: it.peringkat ?? "",
              weighted: it.weighted ?? "",
              keterangan: it.keterangan ?? "",
            });
          });
        }
      }
      return rows;
    }


    // handlers that call your exporter
    function handleExportPasar() {
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
      if (typeof exportKPMRInvestasiToExcel === "function") {
        exportKPMRInvestasiToExcel({
          year: viewYear,
          quarter: viewQuarter,
          rows: KPMR_filtered, // pakai data yang sudah difilter & disort
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
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">Risk Form – Pasar</h1>
            <p className="mt-1 text-white/90 text-sm">Form Pasar & KPMR dalam 1 halaman.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("pasar")}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "pasar"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
                }`}
            >
              Pasar
            </button>

            <button
              onClick={() => setActiveTab("kpmr")}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "kpmr"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
                }`}
            >
              KPMR Pasar
            </button>
          </nav>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          {/* ---------- TAB PASAR: indikator form + table ---------- */}
          {activeTab === "pasar" && (
            <>
              <header className="px-4 py-4 flex items-center justify-between gap-3">
                <h2 className="text-xl sm:text-2xl font-semibold">Form – Pasar</h2>
                <div className="flex items-center gap-3">
                  {/* tahun + triwulan */}
                  <div className="hidden md:flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <label className="sr-only">Tahun</label>
                      <YearInput
                        value={viewYear}
                        onChange={(v) => {
                          setViewYear(v);
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="sr-only">Triwulan</label>
                      <QuarterSelect
                        value={viewQuarter}
                        onChange={(v) => {
                          setViewQuarter(v);
                        }}
                      />
                    </div>
                  </div>

                  {/* group search + export: slight vertical shift */}
                  <div className="flex items-center gap-2 transform -translate-y-1">
                    <div className="relative">
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Cari no/sub/indikator/keterangan…"
                        className="pl-9 pr-3 py-2 rounded-xl border w-64"
                      />
                      <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>

                    <button
                      onClick={handleExportPasar}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border bg-gray-900 text-white hover:bg-black"
                    >
                      <Download size={18} /> Export {viewYear}-{viewQuarter}
                    </button>
                  </div>
                </div>
              </header>

              {/* top toolbar with section */}
              <div className="relative rounded-2xl overflow-hidden mb-6 shadow-sm bg-gradient-to-r from-[#0076C6]/90 via-[#00A3DA]/90 to-[#33C2B5]/90">
                <div className="rounded-2xl border-2 border-gray-300 p-4        shadow-sm mb-6">
                  <h2 class="text-white font-semibold text-lg sm:text-xl mb-6">Form Pasar</h2>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-white font-medium">No Sec</div>
                      <input
                        className="w-20 px-3 py-2 rounded-lg border-2 border-gray-300 text-center font-medium bg-white"
                        value={sectionForm.no}
                        onChange={(e) => setSectionForm((f) => ({ ...f, no: e.target.value }))}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-xs text-white font-medium">Bobot Par</div>
                      <input
                        type="number"
                        className="w-24 px-3 py-2 rounded-lg border-2 border-gray-300 text-center font-medium bg-white"
                        value={sectionForm.bobotSection ?? ""}
                        onChange={(e) => setSectionForm((f) => ({ ...f, bobotSection: e.target.value }))}
                      />
                    </div>

                    <div className="flex-1">
                      <div className="text-xs text-white font-medium mb-1">Section</div>
                      <input
                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 font-medium bg-white"
                        value={sectionForm.parameter}
                        onChange={(e) => setSectionForm((f) => ({ ...f, parameter: e.target.value }))}
                        placeholder="Volume dan Komposisi Portofolio Asset dan liabilitas yang terekspos risiko pasar"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-5">
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
                        if (selectedId) {
                          selectSection(selectedId);
                        }
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

                {/* main body: indicator form */}
                <div className="rounded-xl border-2 border-gray-300 shadow-sm p-6 mb-6">
                  {/* Indikator & Bobot Par Row */}
                  <div className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-9">
                      <label className="text-sm font-medium mb-2 block text-white">Indikator</label>
                      <input
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                        value={indicatorForm.indikator}
                        onChange={(e) => setIndicatorField("indikator", e.target.value)}
                        placeholder="Frekuensi pencairan dengan nilai pencairan > 100 Milyar/nasabah dalam waktu singkat..."
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="text-sm font-medium mb-2 block text-right text-white">Bobot Par</label>
                      <input
                        type="number"
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm text-right bg-white"
                        value={indicatorForm.bobotIndikator ?? ""}
                        onChange={(e) => setIndicatorField("bobotIndikator", e.target.value)}
                        placeholder="50%"
                      />
                    </div>
                  </div>

                  {/* Faktor Penyebut & Value Row */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block text-white">Faktor Penyebut</label>
                      <input
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                        value={indicatorForm.penyebutLabel}
                        onChange={(e) => setIndicatorField("penyebutLabel", e.target.value)}
                        placeholder="Jumlah nasabah yang melakukan pencairan >100 Milyar/transaksi"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block text-white">Value Penyebut</label>
                      <input
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                        value={indicatorForm.penyebutValue ?? ""}
                        onChange={(e) => setIndicatorField("penyebutValue", e.target.value)}
                        placeholder="Rp 4000"
                      />
                    </div>
                  </div>

                  {/* Faktor Pembilang & Value Row */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block text-white">Faktor Pembilang</label>
                      <input
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                        value={indicatorForm.pembilangLabel}
                        onChange={(e) => setIndicatorField("pembilangLabel", e.target.value)}
                        placeholder="Jumlah nasabah yang melakukan pencairan >100 Milyar/transaksi"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block text-white">Value Pembilang</label>
                      <input
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                        value={indicatorForm.pembilangValue ?? ""}
                        onChange={(e) => setIndicatorField("pembilangValue", e.target.value)}
                        placeholder="Rp 4000"
                      />
                    </div>
                  </div>

                  {/* Sumber Resiko & Dampak Row */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block text-white">Sumber Resiko</label>
                      <textarea
                        rows={4}
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm resize-none bg-white"
                        value={indicatorForm.sumberRisiko}
                        onChange={(e) => setIndicatorField("sumberRisiko", e.target.value)}
                        placeholder="1. Kelolaan dalam pemilihan aset portofolio,atau
                        2. Penurunan rating emiten setelah menjadi aset portofolio..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block text-white">Dampak</label>
                      <textarea
                        rows={4}
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm resize-none bg-white"
                        value={indicatorForm.dampak}
                        onChange={(e) => setIndicatorField("dampak", e.target.value)}
                        placeholder="Penurunan laba berjalan atau penurunan kepercayaan pemegang saham dan stakeholder lainnya"
                      />
                    </div>
                  </div>

                  {/* Bottom Section: Hasil Preview, Peringkat, Weighted, Legend & Button */}
                  <div className="grid grid-cols-12 gap-4">
                    {/* Left side: Preview boxes */}
                    <div className="col-span-6 flex gap-4">
                      <div className="flex-1">
                        <label className="text-sm font-medium mb-2 block text-white">Hasil Preview</label>
                        <input
                          className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-gray-50"
                          value={indicatorForm.penyebutValue
                            ? `${((Number(indicatorForm.pembilangValue || 0) / Number(indicatorForm.penyebutValue || 1)) * 100).toFixed(2)}%`
                            : ""}
                          readOnly
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-sm font-medium mb-2 block text-white">Peringkat (1 - 5)</label>
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
                        <label className="text-sm font-medium mb-2 block text-white">Weighted(auto)</label>
                        <input
                          className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-gray-50"
                          value={sectionForm.id
                            ? computeWeightedAuto(indicatorForm, Number(sectionForm.bobotSection || 0)).toFixed(2)
                            : ""}
                          readOnly
                        />
                      </div>
                    </div>

                    {/* Right side: Legend */}
                    <div className="col-span-6 grid grid-cols-5 gap-3 items-stretch">
                      <RiskField
                        className="w-full"
                        label="Low"
                        value={indicatorForm.low}
                        onChange={(v) => setIndicatorField("low", v)}
                        color="#B7E1A1"
                        textColor="#0B3D2E"
                        placeholder="x ≤ 1%"
                      />
                      <RiskField
                        className="w-full"
                        label="Low to Moderate"
                        value={indicatorForm.lowToModerate}
                        onChange={(v) => setIndicatorField("lowToModerate", v)}
                        color="#CFE0FF"
                        textColor="#0B2545"
                        placeholder="1% < x ≤ 2%"
                      />
                      <RiskField
                        className="w-full"
                        label="Moderate"
                        value={indicatorForm.moderate}
                        onChange={(v) => setIndicatorField("moderate", v)}
                        color="#FFEEAD"
                        textColor="#4B3A00"
                        placeholder="2% < x ≤ 3%"
                      />
                      <RiskField
                        className="w-full"
                        label="Moderate to High"
                        value={indicatorForm.moderateToHigh}
                        onChange={(v) => setIndicatorField("moderateToHigh", v)}
                        color="#FAD2A7"
                        textColor="#5A2E00"
                        placeholder="3% < x ≤ 4%"
                      />
                      <RiskField
                        className="w-full"
                        label="High"
                        value={indicatorForm.high}
                        onChange={(v) => setIndicatorField("high", v)}
                        color="#E57373"
                        textColor="#FFFFFF"
                        placeholder="x > 4%"
                      />
                    </div>
                  </div>

                  {/* Keterangan */}
                  <div className="mt-4">
                    <label className="text-sm font-medium mb-2 block text-white">Keterangan</label>
                    <input
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                      value={indicatorForm.keterangan}
                      onChange={(e) => setIndicatorField("keterangan", e.target.value)}
                      placeholder="Loading"
                    />
                  </div>
                </div>

                {/* Add/Save Button */}
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

              {/* table area */}
              <div className="rounded-xl border bg-white shadow-sm overflow-auto">
                <table className="min-w-[1400px] text-sm border border-gray-300 border-collapse">
                  <thead>
                    <tr className="bg-[#1f4e79] text-white">
                      <th className="border px-3 py-2 text-left" style={{ width: 60 }}>No</th>
                      <th className="border px-3 py-2 text-left" style={{ width: 80 }}>Bobot</th>
                      <th className="border px-3 py-2 text-left" style={{ width: 340 }}>Parameter / Section</th>
                      <th className="border px-3 py-2 text-left" style={{ width: 360 }}>Indikator & Pembilang/Penyebut</th>
                      <th className="border px-3 py-2 text-center" style={{ width: 90 }}>Bobot Indikator</th>
                      <th className="border px-3 py-2 text-left" style={{ width: 220 }}>Sumber Risiko</th>
                      <th className="border px-3 py-2 text-left" style={{ width: 240 }}>Dampak</th>
                      <th className="px-3 py-2 bg-[#b7d7a8] text-left text-black">Low</th>
                      <th className="px-3 py-2 bg-[#c9daf8] text-left text-black">Low to Moderate</th>
                      <th className="px-3 py-2 bg-[#fff2cc] text-left text-black">Moderate</th>
                      <th className="px-3 py-2 bg-[#f9cb9c] text-left text-black">Moderate to High</th>
                      <th className="px-3 py-2 bg-[#e06666] text-left">High</th>
                      <th className="px-3 py-2 bg-[#2e75b6] text-left" style={{ width: 100 }}>Hasil</th>
                      <th className="px-3 py-2 bg-[#385723] text-left" style={{ width: 70 }}>Peringkat</th>
                      <th className="px-3 py-2 bg-[#d9d9d9] text-left text-black" style={{ width: 90 }}>Weighted</th>
                      <th className="px-3 py-2 bg-[#1f4e79] text-left" style={{ width: 220 }}>Keterangan</th>
                      <th className="border px-3 py-2 text-center" style={{ width: 80 }}>Aksi</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredSections.length === 0 ? (
                      <tr>
                        <td className="border px-3 py-6 text-center text-gray-500" colSpan={17}>
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
                              <td className="border px-3 py-3 text-center">{s.no}</td>
                              <td className="border px-3 py-3 text-center">{s.bobotSection}%</td>
                              <td className="border px-3 py-3">{s.parameter}</td>
                              <td className="border px-3 py-3 text-center" colSpan={14}>
                                Belum ada indikator
                              </td>
                            </tr>
                          );
                        }

                        return (
                          <React.Fragment key={s.id}>
                            {inds.map((it, idx) => {
                              const firstOfSection = idx === 0;
                              const hasilPercent = (typeof it.hasil === "number" || (typeof it.hasil === "string" && it.hasil !== "")) && it.hasil != null && !isNaN(Number(it.hasil))
                                ? (Number(it.hasil) * 100).toFixed(2) + "%"
                                : (typeof it.hasil === "number" ? String(it.hasil) : (it.hasil ? String(it.hasil) : ""));
                              const weightedDisplay = (typeof it.weighted === "number" || (typeof it.weighted === "string" && it.weighted !== "")) && it.weighted != null
                                ? Number(it.weighted).toFixed(2)
                                : "";

                              return (
                                <React.Fragment key={it.id}>
                                  <tr>
                                    {firstOfSection && (
                                      <>
                                        <td
                                          rowSpan={inds.length * rowsPerIndicator}
                                          className="border px-3 py-3 align-top bg-[#e9f5e1] text-center font-semibold"
                                        >
                                          {s.no}
                                        </td>
                                        <td
                                          rowSpan={inds.length * rowsPerIndicator}
                                          className="border px-3 py-3 align-top bg-[#e9f5e1] text-center"                                  >
                                          {s.bobotSection}%
                                        </td>
                                        <td
                                          rowSpan={inds.length * rowsPerIndicator}
                                          className="border px-3 py-3 align-top bg-[#e9f5e1]"
                                        >
                                          {s.parameter}
                                        </td>
                                      </>
                                    )}

                                    <td className="border px-3 py-3 align-top">
                                      <div className="font-medium">{it.indikator}</div>
                                    </td>
                                    <td className="border px-3 py-3 text-center align-top">
                                      {it.bobotIndikator}%
                                    </td>
                                    <td className="border px-3 py-3 align-top">{it.sumberRisiko}</td>
                                    <td className="border px-3 py-3 align-top">{it.dampak}</td>

                                    <td className="border px-3 py-3 text-center">{it.low}</td>
                                    <td className="border px-3 py-3 text-center">{it.lowToModerate}</td>
                                    <td className="border px-3 py-3 text-center">{it.moderate}</td>
                                    <td className="border px-3 py-3 text-center">{it.moderateToHigh}</td>
                                    <td className="border px-3 py-3 text-center">{it.high}</td>

                                    <td className="border px-3 py-3 text-right">{hasilPercent}</td>

                                    <td className="border px-3 py-3 text-center">
                                      <div style={{ minWidth: 36, minHeight: 24 }} className="inline-block rounded bg-yellow-300 px-2">
                                        {it.peringkat}
                                      </div>
                                    </td>

                                    <td className="border px-3 py-3 text-right">{weightedDisplay}</td>
                                    <td className="border px-3 py-3">{it.keterangan}</td>

                                    <td className="border px-3 py-3 text-center">
                                      <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => editIndicator(s.id, it.id)} className="px-2 py-1 rounded border">
                                          <Edit3 size={14} />
                                        </button>
                                        <button onClick={() => removeIndicator(s.id, it.id)} className="px-2 py-1 rounded border text-red-600">
                                          <Trash2 size={14} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>

                                  {/* Pembilang row */}
                                  <tr className="bg-white">
                                    <td className="border px-3 py-2">
                                      <div className="text-sm text-gray-700 mt-1">
                                        {it.pembilangLabel || "-"}
                                      </div>
                                    </td>
                                    <td className="border px-3 py-2" colSpan={8}></td>
                                    <td className="border px-3 py-2 bg-[#c6d9a7] text-right">
                                      {it.pembilangValue ? fmtNumber(it.pembilangValue) : ""}
                                    </td>
                                    <td className="border px-3 py-2" colSpan={4}></td>
                                  </tr>

                                  {/* Penyebut row */}
                                  <tr className="bg-white">
                                    <td className="border px-3 py-2">
                                      <div className="text-sm text-gray-700 mt-1">
                                        {it.penyebutLabel || "-"}
                                      </div>
                                    </td>
                                    <td className="border px-3 py-2" colSpan={8}></td>
                                    <td className="border px-3 py-2 bg-[#c6d9a7] text-right">
                                      {it.penyebutValue ? fmtNumber(it.penyebutValue) : ""}
                                    </td>
                                    <td className="border px-3 py-2" colSpan={4}></td>
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
                      <td className="border border-gray-400" colSpan={12}></td>
                      <td className="border border-gray-400 text-white font-semibold text-center bg-[#0b3861]" colSpan={2}>
                        Summary
                      </td>
                      <td className="border border-gray-400 text-white font-semibold text-center bg-[#8fce00]">
                        {totalWeighted.toFixed(2)}
                      </td>
                      <td className="border border-gray-400" colSpan={2}></td>
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
                  <h1 className="text-2xl font-bold">KPMR – Pasar</h1>

                  <div className="flex items-center gap-2">
                    <div>
                      <input
                        type="number"
                        value={viewYear}
                        onChange={(e) => {
                          const v = Number(e.target.value || new Date().getFullYear());
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
                      <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
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
              <section className={`rounded-2xl border shadow p-4 ${PNM_BRAND.gradient} text-white`}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold drop-shadow">Form KPMR – Pasar</h2>
                  <div className="text-sm text-white/90">
                    Periode: <span className="font-semibold">{KPMR_form.year}-{KPMR_form.quarter}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* kiri */}
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

                  {/* kanan: 5 level */}
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
                        onClick={() => { setKPMR_editingIndex(null); KPMR_resetForm(); }}
                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border bg-transparent hover:bg-white/10"
                      >
                        Batal
                      </button>
                    </div>
                  )}
                </div>
              </section>

              {/* tabel hasil KPMR (sama seperti sebelumnya) */}
              <section className="bg-white rounded-2xl shadow overflow-hidden">
                <div className="px-4 py-3 bg-gray-100 border-b">
                  <div className="font-semibold">Data KPMR – Pasar ({viewYear}-{viewQuarter})</div>
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
                                        <span className="flex-1">{r.evidence || "-"}</span>
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
