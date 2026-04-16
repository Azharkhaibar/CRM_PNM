origin file kpmr holding 

import React, { useState, useEffect, useMemo } from "react";
import { Download, Trash2, Edit3, Search, ChevronDown } from "lucide-react";

// ===================== Constants =====================
const PNM_BRAND = {
  primary: "#0068B3",
  primarySoft: "#E6F1FA",
  gradient: "bg-gradient-to-r from-[#0076C6]/90 via-[#00A3DA]/90 to-[#33C2B5]/90",
};

// localStorage keys
const KPMR_ASPEK_LS = "kpmr_investasi_aspek_v1";
const KPMR_PERTANYAAN_LS = "kpmr_investasi_pertanyaan_v1";
const KPMR_DEFINITIONS_LS = "kpmr_investasi_definitions_v1";
const KPMR_SCORES_LS = "kpmr_investasi_scores_v1";

const KPMR_EMPTY_FORM = {
  year: new Date().getFullYear(),
  quarter: "Q1",
  aspekNo: "Aspek 1",
  aspekTitle: "Tata Kelola Risiko",
  aspekBobot: 30,
  sectionNo: "1",
  sectionTitle: "Bagaimana perumusan tingkat risiko yang akan diambil (risk appetite) dan toleransi risiko (risk tolerance) terkait risiko investasi?",
  sectionSkor: "",
  level1: "",
  level2: "",
  level3: "",
  level4: "",
  level5: "",
  evidence: "",
};

const QUARTER_ORDER = ["Q1", "Q2", "Q3", "Q4"];
const QUARTER_LABEL = {
  Q1: "MAR",
  Q2: "JUN",
  Q3: "SEP",
  Q4: "DES",
};

// ===================== Helper Functions =====================
const getCurrentYear = () => new Date().getFullYear();
const getCurrentQuarter = () => {
  const month = new Date().getMonth();
  if (month < 3) return "Q1";
  if (month < 6) return "Q2";
  if (month < 9) return "Q3";
  return "Q4";
};

// Load functions
const loadKPMRAspects = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KPMR_ASPEK_LS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Gagal parse KPMR Aspek dari localStorage", e);
    return [];
  }
};

const loadKPMRQuestions = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KPMR_PERTANYAAN_LS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Gagal parse KPMR Pertanyaan dari localStorage", e);
    return [];
  }
};

const loadKPMRDefinitions = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KPMR_DEFINITIONS_LS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Gagal parse KPMR Definitions dari localStorage", e);
    return [];
  }
};

const loadKPMRScores = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KPMR_SCORES_LS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Gagal parse KPMR Scores dari localStorage", e);
    return [];
  }
};

// ===================== Main Component =====================
export default function KPMRInvestasi() {
  // ===== State =====
  const [viewYear, setViewYear] = useState(getCurrentYear());
  const [query, setQuery] = useState("");
  const [showKPMRForm, setShowKPMRForm] = useState(false);
  const [KPMR_aspects, setKPMR_aspects] = useState(loadKPMRAspects);
  const [KPMR_questions, setKPMR_questions] = useState(loadKPMRQuestions);
  const [KPMR_definitions, setKPMR_definitions] = useState(loadKPMRDefinitions);
  const [KPMR_scores, setKPMR_scores] = useState(loadKPMRScores);
  const [KPMR_editingIndex, setKPMR_editingIndex] = useState(null);
  const [KPMR_isAddingNewAspect, setKPMR_isAddingNewAspect] = useState(false);
  const [KPMR_isAddingNewQuestion, setKPMR_isAddingNewQuestion] = useState(false);
  const [selectedQuarters, setSelectedQuarters] = useState([]);

  const [KPMR_form, setKPMR_form] = useState({
    ...KPMR_EMPTY_FORM,
    year: viewYear,
    quarter: "Q1",
  });

  // ===== Effects =====
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(KPMR_ASPEK_LS, JSON.stringify(KPMR_aspects));
    } catch (e) {
      console.warn("Gagal simpan KPMR Aspek ke localStorage", e);
    }
  }, [KPMR_aspects]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(KPMR_PERTANYAAN_LS, JSON.stringify(KPMR_questions));
    } catch (e) {
      console.warn("Gagal simpan KPMR Pertanyaan ke localStorage", e);
    }
  }, [KPMR_questions]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(KPMR_DEFINITIONS_LS, JSON.stringify(KPMR_definitions));
    } catch (e) {
      console.warn("Gagal simpan KPMR Definitions ke localStorage", e);
    }
  }, [KPMR_definitions]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(KPMR_SCORES_LS, JSON.stringify(KPMR_scores));
      window.dispatchEvent(new CustomEvent('investasiKPMR:changed', {
        detail: { year: viewYear }
      }));
    } catch (e) {
      console.warn("Gagal simpan KPMR Scores ke localStorage", e);
    }
  }, [KPMR_scores]);

  useEffect(() => {
    setKPMR_form((f) => ({
      ...f,
      year: viewYear,
    }));
  }, [viewYear]);

  // ===== Helper Functions =====
  const toggleQuarter = (q) => {
    setSelectedQuarters((prev) =>
      prev.includes(q)
        ? prev.filter((x) => x !== q)
        : [...prev, q]
    );
  };

  const shouldShowQuarter = (quarter) => {
    return selectedQuarters.length === 0 || selectedQuarters.includes(quarter);
  };

  const handleAspectChange = (value) => {
    if (value === "new") {
      setKPMR_isAddingNewAspect(true);
      setKPMR_form(prev => ({
        ...prev,
        aspekNo: "",
        aspekTitle: "",
        aspekBobot: "",
        sectionNo: "",
        sectionTitle: "",
      }));
    } else {
      setKPMR_isAddingNewAspect(false);
      const aspect = KPMR_aspects.find(a => a.id === value);
      if (aspect) {
        setKPMR_form(prev => ({
          ...prev,
          aspekNo: aspect.aspekNo,
          aspekTitle: aspect.aspekTitle,
          aspekBobot: aspect.aspekBobot,
          sectionNo: "",
          sectionTitle: "",
        }));
        setKPMR_isAddingNewQuestion(false);
      }
    }
  };

  const handleQuestionChange = (value) => {
    if (value === "new") {
      setKPMR_isAddingNewQuestion(true);
      setKPMR_form(prev => ({
        ...prev,
        sectionNo: "",
        sectionTitle: "",
        level1: "",
        level2: "",
        level3: "",
        level4: "",
        level5: "",
        evidence: "",
        sectionSkor: "",
      }));
    } else {
      setKPMR_isAddingNewQuestion(false);
      const question = KPMR_questions.find(q => q.id === value);
      if (question) {
        const existingDef = KPMR_definitions.find(d =>
          d.year === KPMR_form.year &&
          d.aspekNo === KPMR_form.aspekNo &&
          d.sectionNo === question.sectionNo &&
          d.sectionTitle === question.sectionTitle
        );

        setKPMR_form(prev => ({
          ...prev,
          sectionNo: question.sectionNo,
          sectionTitle: question.sectionTitle,
          level1: existingDef?.level1 || "",
          level2: existingDef?.level2 || "",
          level3: existingDef?.level3 || "",
          level4: existingDef?.level4 || "",
          level5: existingDef?.level5 || "",
          evidence: existingDef?.evidence || "",
          sectionSkor: "",
        }));
      }
    }
  };

  const KPMR_handleChange = (k, v) =>
    setKPMR_form((f) => ({ ...f, [k]: v }));

  const saveNewAspectIfNeeded = () => {
    if (KPMR_isAddingNewAspect && KPMR_form.aspekNo && KPMR_form.aspekTitle && KPMR_form.aspekBobot) {
      const newAspect = {
        id: `aspect-${Date.now()}`,
        aspekNo: KPMR_form.aspekNo,
        aspekTitle: KPMR_form.aspekTitle,
        aspekBobot: Number(KPMR_form.aspekBobot),
      };
      setKPMR_aspects(prev => [...prev, newAspect]);
      return true;
    }
    return false;
  };

  const saveNewQuestionIfNeeded = () => {
    if (KPMR_isAddingNewQuestion && KPMR_form.aspekNo && KPMR_form.sectionNo && KPMR_form.sectionTitle) {
      const newQuestion = {
        id: `question-${Date.now()}`,
        aspekNo: KPMR_form.aspekNo,
        sectionNo: KPMR_form.sectionNo,
        sectionTitle: KPMR_form.sectionTitle,
      };
      setKPMR_questions(prev => [...prev, newQuestion]);
      return true;
    }
    return false;
  };

  const KPMR_resetForm = () =>
    setKPMR_form((prev) => ({
      ...KPMR_EMPTY_FORM,
      year: viewYear,
      quarter: "Q1",
      aspekNo: prev.aspekNo,
      aspekTitle: prev.aspekTitle,
      aspekBobot: prev.aspekBobot,
    }));

  const KPMR_addRow = () => {
    saveNewAspectIfNeeded();
    saveNewQuestionIfNeeded();

    const existingDefIndex = KPMR_definitions.findIndex(d =>
      d.year === KPMR_form.year &&
      d.aspekNo === KPMR_form.aspekNo &&
      d.sectionNo === KPMR_form.sectionNo
    );

    let definitionId;

    if (existingDefIndex >= 0) {
      definitionId = KPMR_definitions[existingDefIndex].id;
      setKPMR_definitions(prev => {
        const updated = [...prev];
        updated[existingDefIndex] = {
          ...updated[existingDefIndex],
          aspekTitle: KPMR_form.aspekTitle,
          aspekBobot: KPMR_form.aspekBobot,
          sectionTitle: KPMR_form.sectionTitle,
          level1: KPMR_form.level1 || updated[existingDefIndex].level1 || "",
          level2: KPMR_form.level2 || updated[existingDefIndex].level2 || "",
          level3: KPMR_form.level3 || updated[existingDefIndex].level3 || "",
          level4: KPMR_form.level4 || updated[existingDefIndex].level4 || "",
          level5: KPMR_form.level5 || updated[existingDefIndex].level5 || "",
          evidence: KPMR_form.evidence || updated[existingDefIndex].evidence || "",
        };
        return updated;
      });
    } else {
      const newDefinition = {
        id: `def-${Date.now()}`,
        year: KPMR_form.year,
        aspekNo: KPMR_form.aspekNo,
        aspekTitle: KPMR_form.aspekTitle,
        aspekBobot: KPMR_form.aspekBobot,
        sectionNo: KPMR_form.sectionNo,
        sectionTitle: KPMR_form.sectionTitle,
        level1: KPMR_form.level1 || "",
        level2: KPMR_form.level2 || "",
        level3: KPMR_form.level3 || "",
        level4: KPMR_form.level4 || "",
        level5: KPMR_form.level5 || "",
        evidence: KPMR_form.evidence || "",
      };
      setKPMR_definitions(prev => [...prev, newDefinition]);
      definitionId = newDefinition.id;
    }

    const existingScoreIndex = KPMR_scores.findIndex(s =>
      s.definitionId === definitionId &&
      s.year === KPMR_form.year &&
      s.quarter === KPMR_form.quarter
    );

    if (existingScoreIndex >= 0) {
      setKPMR_scores(prev => {
        const updated = [...prev];
        updated[existingScoreIndex] = {
          ...updated[existingScoreIndex],
          sectionSkor: KPMR_form.sectionSkor,
        };
        return updated;
      });
    } else {
      const newScore = {
        id: `score-${Date.now()}`,
        definitionId: definitionId,
        year: KPMR_form.year,
        quarter: KPMR_form.quarter,
        sectionSkor: KPMR_form.sectionSkor,
      };
      setKPMR_scores(prev => [...prev, newScore]);
    }

    setKPMR_editingIndex(null);
    KPMR_resetForm();
    setShowKPMRForm(false);
    setKPMR_isAddingNewAspect(false);
    setKPMR_isAddingNewQuestion(false);
  };

  const KPMR_startEdit = (target) => {
    const { definitionId, year, quarter } = target;

    const definition = KPMR_definitions.find(d => d.id === definitionId);
    const score = KPMR_scores.find(s =>
      s.definitionId === definitionId &&
      s.year === year &&
      s.quarter === quarter
    );

    setKPMR_form({
      ...KPMR_EMPTY_FORM,
      year,
      quarter,
      aspekNo: definition?.aspekNo || "",
      aspekTitle: definition?.aspekTitle || "",
      aspekBobot: definition?.aspekBobot || 0,
      sectionNo: definition?.sectionNo || "",
      sectionTitle: definition?.sectionTitle || "",
      level1: definition?.level1 || "",
      level2: definition?.level2 || "",
      level3: definition?.level3 || "",
      level4: definition?.level4 || "",
      level5: definition?.level5 || "",
      evidence: definition?.evidence || "",
      sectionSkor: score?.sectionSkor || "",
    });

    setShowKPMRForm(true);
    setKPMR_isAddingNewAspect(false);
    setKPMR_isAddingNewQuestion(false);
  };

  const KPMR_saveEdit = () => {
    const definition = KPMR_definitions.find(d =>
      d.year === KPMR_form.year &&
      d.aspekNo === KPMR_form.aspekNo &&
      d.sectionNo === KPMR_form.sectionNo &&
      d.sectionTitle === KPMR_form.sectionTitle
    );

    if (!definition) return;

    setKPMR_definitions(prev => {
      const index = prev.findIndex(d => d.id === definition.id);
      if (index === -1) return prev;

      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        aspekTitle: KPMR_form.aspekTitle,
        aspekBobot: KPMR_form.aspekBobot,
        sectionTitle: KPMR_form.sectionTitle,
        level1: KPMR_form.level1 || updated[index].level1 || "",
        level2: KPMR_form.level2 || updated[index].level2 || "",
        level3: KPMR_form.level3 || updated[index].level3 || "",
        level4: KPMR_form.level4 || updated[index].level4 || "",
        level5: KPMR_form.level5 || updated[index].level5 || "",
        evidence: KPMR_form.evidence || updated[index].evidence || "",
      };
      return updated;
    });

    const existingScoreIndex = KPMR_scores.findIndex(s =>
      s.definitionId === definition.id &&
      s.year === KPMR_form.year &&
      s.quarter === KPMR_form.quarter
    );

    if (existingScoreIndex >= 0) {
      setKPMR_scores(prev => {
        const updated = [...prev];
        updated[existingScoreIndex] = {
          ...updated[existingScoreIndex],
          sectionSkor: KPMR_form.sectionSkor,
        };
        return updated;
      });
    } else {
      const newScore = {
        id: `score-${Date.now()}`,
        definitionId: definition.id,
        year: KPMR_form.year,
        quarter: KPMR_form.quarter,
        sectionSkor: KPMR_form.sectionSkor,
      };
      setKPMR_scores(prev => [...prev, newScore]);
    }

    setKPMR_editingIndex(null);
    KPMR_resetForm();
    setShowKPMRForm(false);
    setKPMR_isAddingNewAspect(false);
    setKPMR_isAddingNewQuestion(false);
  };

  const KPMR_removeRow = (target) => {
    const { definitionId, year, quarter } = target;

    setKPMR_scores(prev =>
      prev.filter(s =>
        !(
          s.definitionId === definitionId &&
          s.year === year &&
          s.quarter === quarter
        )
      )
    );

    const remainingScores = KPMR_scores.filter(s =>
      s.definitionId === definitionId &&
      s.year === year
    );

    if (remainingScores.length === 0) {
      setKPMR_definitions(prev =>
        prev.filter(d => d.id !== definitionId)
      );
    }

    setShowKPMRForm(false);
    setKPMR_editingIndex(null);
    KPMR_resetForm();
    setKPMR_isAddingNewAspect(false);
    setKPMR_isAddingNewQuestion(false);
  };

  const KPMR_exportExcel = () => {
    // Implement your Excel export logic here
    console.log("Export KPMR Investasi for year:", viewYear);
  };

  // ===== Group Data for Table =====
  const KPMR_groups = useMemo(() => {
    const yearDefinitions = KPMR_definitions.filter(d => d.year === viewYear);
    const aspectMap = new Map();

    for (const def of yearDefinitions) {
      const aspectKey = `${def.aspekNo}|${def.aspekTitle}|${def.aspekBobot}`;

      if (!aspectMap.has(aspectKey)) {
        aspectMap.set(aspectKey, {
          aspekNo: def.aspekNo,
          aspekTitle: def.aspekTitle,
          aspekBobot: def.aspekBobot,
          sections: new Map()
        });
      }

      const sectionKey = `${def.sectionNo}|${def.sectionTitle}`;
      if (!aspectMap.get(aspectKey).sections.has(sectionKey)) {
        aspectMap.get(aspectKey).sections.set(sectionKey, {
          sectionNo: def.sectionNo,
          sectionTitle: def.sectionTitle,
          definitionId: def.id,
          quarters: {}
        });
      }

      const defScores = KPMR_scores.filter(s =>
        s.definitionId === def.id &&
        s.year === viewYear
      );

      for (const score of defScores) {
        aspectMap.get(aspectKey).sections.get(sectionKey).quarters[score.quarter] = {
          definitionId: def.id,
          year: def.year,
          quarter: score.quarter,
          sectionSkor: score.sectionSkor,
          aspekNo: def.aspekNo,
          aspekTitle: def.aspekTitle,
          aspekBobot: def.aspekBobot,
          sectionNo: def.sectionNo,
          sectionTitle: def.sectionTitle,
          level1: def.level1,
          level2: def.level2,
          level3: def.level3,
          level4: def.level4,
          level5: def.level5,
          evidence: def.evidence,
        };
      }
    }

    return Array.from(aspectMap.values()).map(aspect => ({
      ...aspect,
      sections: Array.from(aspect.sections.values())
    }));
  }, [KPMR_definitions, KPMR_scores, viewYear]);

  // ===== Render =====
  return (
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
                  const v = Number(e.target.value || getCurrentYear());
                  setViewYear(v);
                  setKPMR_form((f) => ({ ...f, year: v }));
                }}
                className="w-20 rounded-xl px-3 py-2 border"
              />
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
              onClick={() => setShowKPMRForm(true)}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 font-semibold"
            >
              + Tambah Data
            </button>

            <button
              onClick={KPMR_exportExcel}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border bg-gray-900 text-white hover:bg-black"
            >
              <Download size={18} /> Export {viewYear}
            </button>
          </div>
        </div>
      </header>

      {/* Form KPMR */}
      {showKPMRForm && (
        <section
          className={`rounded-2xl border shadow p-4 ${PNM_BRAND.gradient} text-white`}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold drop-shadow">
              Form KPMR – Investasi
            </h2>
            <div className="flex items-center gap-3">
              <div className="text-sm text-white/90">
                Periode:{" "}
                <span className="font-semibold">
                  {KPMR_form.year}-{KPMR_form.quarter}
                </span>
              </div>
              <button
                onClick={() => {
                  setShowKPMRForm(false);
                  setKPMR_isAddingNewAspect(false);
                  setKPMR_isAddingNewQuestion(false);
                  KPMR_resetForm();
                }}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold"
                title="Tutup Form"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left Column */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <div className="mb-1 text-[13px] text-white/90 font-medium">
                    Aspek (No)
                  </div>
                  <select
                    className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/40"
                    value={KPMR_isAddingNewAspect ? "new" : (KPMR_aspects.find(a => a.aspekNo === KPMR_form.aspekNo && a.aspekTitle === KPMR_form.aspekTitle)?.id || "")}
                    onChange={(e) => handleAspectChange(e.target.value)}
                  >
                    <option value="">-- Pilih Aspek --</option>
                    {KPMR_aspects.map((aspect) => (
                      <option key={aspect.id} value={aspect.id}>
                        {aspect.aspekNo} - {aspect.aspekTitle}
                      </option>
                    ))}
                    <option value="new">+ Tambah Aspek Baru</option>
                  </select>
                </label>

                {KPMR_isAddingNewAspect ? (
                  <>
                    <label className="block">
                      <div className="mb-1 text-[13px] text-white/90 font-medium">
                        Aspek No
                      </div>
                      <input
                        className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/40"
                        value={KPMR_form.aspekNo}
                        onChange={(e) =>
                          KPMR_handleChange("aspekNo", e.target.value)
                        }
                      />
                    </label>

                    <label className="block col-span-2">
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
                  </>
                ) : (
                  <label className="block">
                    <div className="mb-1 text-[13px] text-white/90 font-medium">
                      Bobot Aspek
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full rounded-xl pl-3 pr-10 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/40"
                        value={KPMR_form.aspekBobot || (KPMR_aspects.find(a => a.aspekNo === KPMR_form.aspekNo && a.aspekTitle === KPMR_form.aspekTitle)?.aspekBobot || "")}
                        readOnly
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                        %
                      </span>
                    </div>
                  </label>
                )}
              </div>

              <label className="block">
                <div className="mb-1 text-[13px] text-white/90 font-medium">
                  Pertanyaan Section
                </div>
                <select
                  className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/40"
                  value={KPMR_isAddingNewQuestion ? "new" : (KPMR_questions.find(q => q.aspekNo === KPMR_form.aspekNo && q.sectionNo === KPMR_form.sectionNo && q.sectionTitle === KPMR_form.sectionTitle)?.id || "")}
                  onChange={(e) => handleQuestionChange(e.target.value)}
                  disabled={!KPMR_form.aspekNo}
                >
                  <option value="">-- Pilih Pertanyaan --</option>
                  {KPMR_questions
                    .filter(q => q.aspekNo === KPMR_form.aspekNo)
                    .map((question) => (
                      <option key={question.id} value={question.id}>
                        {question.sectionNo} - {question.sectionTitle}
                      </option>
                    ))}
                  <option value="new">+ Tambah Pertanyaan</option>
                </select>
              </label>

              {KPMR_isAddingNewQuestion && (
                <>
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
                      Judul Pertanyaan
                    </div>
                    <textarea
                      className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 min-h-[64px] focus:outline-none focus:ring-2 focus:ring-white/40"
                      value={KPMR_form.sectionTitle}
                      onChange={(e) =>
                        KPMR_handleChange("sectionTitle", e.target.value)
                      }
                    />
                  </label>
                </>
              )}

              {!KPMR_isAddingNewQuestion && (
                <>
                  <label className="block">
                    <div className="mb-1 text-[13px] text-white/90 font-medium">
                      No Section
                    </div>
                    <input
                      className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/40"
                      value={KPMR_form.sectionNo}
                      readOnly
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <div className="mb-1 text-[13px] text-white/90 font-medium">
                        Pilih Triwulan (Input Skor)
                      </div>
                      <select
                        className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/40"
                        value={KPMR_form.quarter}
                        onChange={(e) => {
                          const selectedQuarter = e.target.value;

                          const def = KPMR_definitions.find(d =>
                            d.year === KPMR_form.year &&
                            d.aspekNo === KPMR_form.aspekNo &&
                            d.sectionNo === KPMR_form.sectionNo &&
                            d.sectionTitle === KPMR_form.sectionTitle
                          );

                          if (def) {
                            const score = KPMR_scores.find(s =>
                              s.definitionId === def.id &&
                              s.year === KPMR_form.year &&
                              s.quarter === selectedQuarter
                            );

                            setKPMR_form(prev => ({
                              ...prev,
                              quarter: selectedQuarter,
                              sectionSkor: score?.sectionSkor || "",
                              level1: def.level1 || prev.level1 || "",
                              level2: def.level2 || prev.level2 || "",
                              level3: def.level3 || prev.level3 || "",
                              level4: def.level4 || prev.level4 || "",
                              level5: def.level5 || prev.level5 || "",
                              evidence: def.evidence || prev.evidence || "",
                            }));
                          } else {
                            setKPMR_form(prev => ({
                              ...prev,
                              quarter: selectedQuarter,
                              sectionSkor: "",
                            }));
                          }
                        }}
                      >
                        <option value="Q1">Q1</option>
                        <option value="Q2">Q2</option>
                        <option value="Q3">Q3</option>
                        <option value="Q4">Q4</option>
                      </select>
                    </label>

                    <label className="block">
                      <div className="mb-1 text-[13px] text-white/90 font-medium">
                        Skor {KPMR_form.quarter}
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
                        placeholder="Masukkan skor"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <div className="mb-1 text-[13px] text-white/90 font-medium">
                        Pilih Triwulan (Avg)
                      </div>
                      <select
                        className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/40"
                        value={KPMR_form.quarter}
                        onChange={(e) => {
                          KPMR_handleChange("quarter", e.target.value);
                        }}
                      >
                        <option value="Q1">Q1</option>
                        <option value="Q2">Q2</option>
                        <option value="Q3">Q3</option>
                        <option value="Q4">Q4</option>
                      </select>
                    </label>

                    <label className="block">
                      <div className="mb-1 text-[13px] text-white/90 font-medium">
                        Avg Skor {KPMR_form.quarter}
                      </div>
                      <input
                        className="w-full rounded-xl px-3 py-2 bg-white/70 text-gray-900"
                        value={(() => {
                          const quarterScores = KPMR_scores.filter(s =>
                            s.year === KPMR_form.year &&
                            s.quarter === KPMR_form.quarter &&
                            s.sectionSkor !== "" &&
                            s.sectionSkor != null
                          );

                          if (!quarterScores.length) return "";

                          const nums = quarterScores.map(s => Number(s.sectionSkor)).filter(n => !isNaN(n));
                          return nums.length
                            ? (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2)
                            : "";
                        })()}
                        readOnly
                      />
                    </label>
                  </div>
                </>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-xs text-blue-800 font-medium mb-2">
                  ℹ️ <strong>KPMR BERDASARKAN TAHUN</strong>
                </div>
                <div className="text-xs text-blue-700 space-y-1">
                  <div>• <strong>Year-Level</strong> (Disimpan sekali untuk {viewYear}): Aspek, Section, Level 1-5, Evidence</div>
                  <div>• <strong>Quarter-Level</strong> (Disimpan per triwulan): Skor saja</div>
                  <div>• <strong>Pilih Triwulan</strong> di dropdown untuk mengisi skor triwulan tersebut</div>
                  <div className="text-blue-600 italic mt-1">Level & Evidence otomatis berlaku untuk Q1, Q2, Q3, Q4 di tahun {viewYear}</div>

                  {KPMR_form.aspekNo && KPMR_form.sectionNo && (
                    <div className="mt-2 pt-2 border-t border-blue-300">
                      {(() => {
                        const existingDef = KPMR_definitions.find(d =>
                          d.year === KPMR_form.year &&
                          d.aspekNo === KPMR_form.aspekNo &&
                          d.sectionNo === KPMR_form.sectionNo &&
                          d.sectionTitle === KPMR_form.sectionTitle
                        );

                        const hasData = existingDef && (
                          existingDef.level1 || existingDef.level2 ||
                          existingDef.level3 || existingDef.level4 ||
                          existingDef.level5 || existingDef.evidence
                        );

                        return hasData ? (
                          <div className="text-green-700 font-semibold">
                            ✓ Data Level & Evidence sudah tersimpan untuk tahun {viewYear}
                          </div>
                        ) : (
                          <div className="text-orange-700 font-semibold">
                            ⚠ Belum ada data Level & Evidence untuk tahun {viewYear} - Silakan isi di bawah
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>

              <label className="block">
                <div className="mb-1 text-[13px] text-white/90 font-medium">
                  Evidence (Year-Level: berlaku untuk semua triwulan di tahun {viewYear})
                </div>
                <textarea
                  className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 min-h-[56px] focus:outline-none focus:ring-2 focus:ring-white/40"
                  value={KPMR_form.evidence}
                  onChange={(e) =>
                    KPMR_handleChange("evidence", e.target.value)
                  }
                  placeholder="Masukkan bukti/dokumen pendukung..."
                />
              </label>
            </div>

            {/* Right Column - 5 Levels */}
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

          {/* Buttons */}
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
                    setShowKPMRForm(false);
                    setKPMR_isAddingNewAspect(false);
                    setKPMR_isAddingNewQuestion(false);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border bg-transparent hover:bg-white/10"
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Table KPMR */}
      <section className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="px-4 py-3 bg-gray-100 border-b">
          <div className="font-semibold">
            Data KPMR – Investasi ({viewYear}{" "}
            {selectedQuarters.length > 0
              ? `- Triwulan: ${selectedQuarters.join(", ")}`
              : "- Semua Triwulan"})
          </div>
        </div>

        {/* Quarter Filter */}
        <div className="px-4 mt-4 mb-4">
          <div className="relative rounded-2xl bg-white/75 backdrop-blur-md border border-white/40 shadow-[0_10px_28px_rgba(0,0,0,0.10)] p-5 max-w-2xl">
            <div className="absolute inset-x-0 top-0 h-px bg-white/70 rounded-t-2xl" />

            <div className="text-sm font-semibold text-gray-700 mb-4">
              Filter Triwulan (opsional)
            </div>

            <div className="flex flex-wrap gap-6">
              {QUARTER_ORDER.map((q) => {
                const checked = selectedQuarters.includes(q);

                return (
                  <label
                    key={q}
                    className="flex items-center gap-3 text-sm font-medium text-gray-800 cursor-pointer select-none"
                  >
                    <span
                      className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                        ${checked ? "border-blue-500" : "border-blue-400"}
                      `}
                    >
                      {checked && (
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      )}
                    </span>

                    <input
                      type="checkbox"
                      className="hidden"
                      checked={checked}
                      onChange={() => toggleQuarter(q)}
                    />

                    <span>
                      {QUARTER_LABEL[q]} ({q})
                    </span>
                  </label>
                );
              })}
            </div>

            {selectedQuarters.length > 0 && (
              <div className="mt-4 text-xs text-gray-500">
                Menampilkan: {selectedQuarters.join(", ")}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="relative h-[420px]">
          <div className="absolute inset-0 overflow-x-auto overflow-y-auto">
            <table className="min-w-[1600px] text-sm border border-gray-300 border-collapse">
              <thead>
                <tr className="bg-[#1f4e79] text-white">
                  <th className="border px-3 py-2 text-left" colSpan={2} rowSpan={2}>
                    KUALITAS PENERAPAN MANAJEMEN RISIKO
                  </th>

                  {QUARTER_ORDER.filter((q) => shouldShowQuarter(q)).map((q) => (
                    <th
                      key={q}
                      className="border px-3 py-2 text-center w-20"
                      rowSpan={2}
                    >
                      {QUARTER_LABEL[q]} ({q})
                    </th>
                  ))}

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
                <tr className="hidden"></tr>
              </thead>

              <tbody>
                {KPMR_groups.length === 0 ? (
                  <tr>
                    <td
                      className="border px-3 py-6 text-center text-gray-500"
                      colSpan={11}
                    >
                      Belum ada data
                    </td>
                  </tr>
                ) : (
                  KPMR_groups.map((g, gi) => {
                    const calculateAspectAvg = (quarter) => {
                      const allSectionScores = g.sections
                        .map(section => section.quarters[quarter])
                        .filter(data => data && data.sectionSkor !== "" && data.sectionSkor != null)
                        .map(data => Number(data.sectionSkor));

                      return allSectionScores.length
                        ? (allSectionScores.reduce((a, b) => a + b, 0) / allSectionScores.length).toFixed(2)
                        : "-";
                    };

                    const quarterAspectAverages = {
                      Q1: calculateAspectAvg("Q1"),
                      Q2: calculateAspectAvg("Q2"),
                      Q3: calculateAspectAvg("Q3"),
                      Q4: calculateAspectAvg("Q4"),
                    };

                    return (
                      <React.Fragment key={gi}>
                        {/* Aspect row */}
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
                          {QUARTER_ORDER.filter((q) => shouldShowQuarter(q)).map((q) => (
                            <td
                              key={q}
                              className="border px-3 py-2 text-center font-bold"
                              style={{ backgroundColor: "#93d150" }}
                            >
                              {quarterAspectAverages[q]}
                            </td>
                          ))}
                          <td
                            className="border px-3 py-2"
                            colSpan={5}
                          ></td>
                          <td className="border px-3 py-2"></td>
                        </tr>

                        {/* Section rows */}
                        {g.sections.map((section, idx) => {
                          const quarterData = {
                            Q1: section.quarters["Q1"] || {},
                            Q2: section.quarters["Q2"] || {},
                            Q3: section.quarters["Q3"] || {},
                            Q4: section.quarters["Q4"] || {},
                          };
                          const definition = KPMR_definitions.find(d => d.id === section.definitionId);
                          const yearLevelData = {
                            level1: definition?.level1 || "",
                            level2: definition?.level2 || "",
                            level3: definition?.level3 || "",
                            level4: definition?.level4 || "",
                            level5: definition?.level5 || "",
                            evidence: definition?.evidence || "",
                          };

                          const activeQuarterData = section.quarters[viewQuarter] ||
                            Object.values(section.quarters)[0] || {};

                          return (
                            <tr
                              key={`${gi}-${idx}`}
                              className="align-top hover:bg-gray-50"
                            >
                              <td className="border px-2 py-2 text-center">
                                {section.sectionNo}
                              </td>
                              <td className="border px-2 py-2 whitespace-pre-wrap">
                                {section.sectionTitle}
                              </td>
                              {QUARTER_ORDER.filter((q) => shouldShowQuarter(q)).map((q) => {
                                const data = quarterData[q];
                                return (
                                  <td key={q} className="border px-2 py-2 text-center">
                                    {data.sectionSkor || "-"}
                                  </td>
                                );
                              })}
                              <td className="border px-2 py-2 whitespace-pre-wrap">
                                {yearLevelData.level1 || ""}
                              </td>
                              <td className="border px-2 py-2 whitespace-pre-wrap">
                                {yearLevelData.level2 || ""}
                              </td>
                              <td className="border px-2 py-2 whitespace-pre-wrap">
                                {yearLevelData.level3 || ""}
                              </td>
                              <td className="border px-2 py-2 whitespace-pre-wrap">
                                {yearLevelData.level4 || ""}
                              </td>
                              <td className="border px-2 py-2 whitespace-pre-wrap">
                                {yearLevelData.level5 || ""}
                              </td>
                              <td className="border px-2 py-2 whitespace-pre-wrap">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="flex-1">
                                    {yearLevelData.evidence || "-"}
                                  </span>
                                  <div className="flex gap-2 shrink-0">
                                    <button
                                      onClick={() => {
                                        const targetQuarter = activeQuarterData.quarter || Object.keys(section.quarters)[0];
                                        KPMR_startEdit({
                                          definitionId: section.definitionId,
                                          year: viewYear,
                                          quarter: targetQuarter
                                        });
                                      }}
                                      className="inline-flex items-center gap-1 px-2 py-1 rounded border hover:bg-gray-50"
                                      title="Edit baris ini"
                                    >
                                      <Edit3 size={14} /> Edit
                                    </button>
                                    <button
                                      onClick={() => {
                                        const targetQuarter = activeQuarterData.quarter || Object.keys(section.quarters)[0];
                                        KPMR_removeRow({
                                          definitionId: section.definitionId,
                                          year: viewYear,
                                          quarter: targetQuarter
                                        });
                                      }}
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

                {/* Total Average Row */}
                <tr className="bg-[#c9daf8] font-semibold">
                  <td colSpan={2} className="border px-3 py-2"></td>
                  {QUARTER_ORDER.filter((q) => shouldShowQuarter(q)).map((q) => {
                    const calculateOverallAvg = (quarter) => {
                      if (!KPMR_groups || KPMR_groups.length === 0) return "-";

                      const aspectAverages = KPMR_groups.map(g => {
                        const allSectionScores = g.sections
                          .map(section => section.quarters[quarter])
                          .filter(data => data && data.sectionSkor !== "" && data.sectionSkor != null)
                          .map(data => Number(data.sectionSkor));

                        return allSectionScores.length
                          ? allSectionScores.reduce((a, b) => a + b, 0) / allSectionScores.length
                          : null;
                      }).filter(val => val != null);

                      return aspectAverages.length
                        ? (aspectAverages.reduce((a, b) => a + b, 0) / aspectAverages.length).toFixed(2)
                        : "-";
                    };

                    return (
                      <td
                        key={q}
                        className="border px-3 py-2 text-center font-bold"
                        style={{ backgroundColor: "#93d150" }}
                      >
                        {calculateOverallAvg(q)}
                      </td>
                    );
                  })}
                  <td colSpan={6} className="border px-3 py-2"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}