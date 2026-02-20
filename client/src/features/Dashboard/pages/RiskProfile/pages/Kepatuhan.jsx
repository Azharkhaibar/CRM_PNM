import React, { useState, useMemo, useEffect, useRef } from "react";
import { Download, Trash2, Edit3, Search, Plus, ChevronDown } from "lucide-react";
import { calculatePeringkat, calculatePeringkatFromText, isNumericRiskLevels } from "../utils/riskCalculator";

// ==== Komponen & Utils Investasi ====
import DataTable from "../../../components/DataTable";
import { RiskField, YearInput, QuarterSelect } from "../../../components/Inputs";
import { getCurrentQuarter, getCurrentYear } from "../utils/time";
import { computeWeighted, makeEmptyRow } from "../utils/calc";
import { exportInvestasiToExcel } from "../utils/exportExcel";

// ==== Utils Export KPMR ====
import { exportKPMRInvestasiToExcel } from "../utils/exportExcelKPMR";

// ==== Period Inheritance Utils ====
import {
  cloneFromPreviousPeriod,
  undoClone,
} from "../utils/periodInheritance";

// ==== Section Inheritance Utils ====
import {
  getSectionsForPeriod,
  addSectionToPeriod,
  updateSectionInPeriod,
  deleteSectionFromPeriod,
  autoCloneSectionsIfNeeded,
  migrateSectionsV1ToV2,
  isInheritedSection,
} from "../utils/sectionInheritance";

// ===================== Brand =====================
const PNM_BRAND = {
  primary: "#0068B3",
  primarySoft: "#E6F1FA",
  gradient: "bg-gradient-to-r from-[#0076C6]/90 via-[#00A3DA]/90 to-[#33C2B5]/90",
};

const KEPATUHAN_SECTIONS_LS = "kepatuhan_sections_v2";
const KEPATUHAN_SECTIONS_LS_V1 = "kepatuhan_sections_v1";
const KPMR_KEPATUHAN_LS = "kpmr_kepatuhan_rows_v1";
const KPMR_ASPEK_LS = "kpmr_kepatuhan_aspek_v1";
const KPMR_PERTANYAAN_LS = "kpmr_kepatuhan_pertanyaan_v1";
const KPMR_TEMPLATE_LS = "kpmr_kepatuhan_template_v1";

// Year-Level Definitions: Shared across ALL quarters within the same year
const KPMR_DEFINITIONS_LS = "kpmr_kepatuhan_definitions_v1";

// Quarter-Level Scores: sectionSkor per quarter, linked by definitionId
const KPMR_SCORES_LS = "kpmr_kepatuhan_scores_v1";

// ===================== KPMR: Template form per section =====================

// Load template
const loadKPMRTemplates = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KPMR_TEMPLATE_LS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Gagal parse KPMR Template dari localStorage", e);
    return [];
  }
};

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
    "Bagaimana perumusan tingkat risiko yang akan diambil (risk appetite) dan toleransi risiko (risk tolerance) terkait risiko kepatuhan?",
  sectionSkor: "",

  // Level 1..5
  level1: "",
  level2: "",
  level3: "",
  level4: "",
  level5: "",

  evidence: "",
};

// ===================== Kepatuhan: fallback empty row =====================
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
  mode: "RASIO", // RASIO, NILAI_TUNGGAL, atau TEKS
  formula: "",
  isPercent: false,
  hasil: "",
  hasilText: "", // For TEKS mode
  peringkat: 1,
  weighted: "",
  keterangan: "",
});

/**
 * Flexible number parser - supports multiple input formats
 * - Supports Indonesian format: 1.000,50 (thousand separator = dot, decimal = comma)
 * - Supports US format: 1,000.50 (thousand separator = comma, decimal = dot)
 * - Supports minus at start or end: -100 or 100-
 * - Supports percent: 10% or -10%
 * - Returns number for calculation
 */
const parseNum = (v) => {
  if (v == null || v === "") return 0;

  let s = String(v).trim();
  
  // Handle minus sign (start or end)
  let isNegative = false;
  if (s.startsWith('-')) {
    isNegative = true;
    s = s.substring(1);
  } else if (s.endsWith('-')) {
    isNegative = true;
    s = s.slice(0, -1);
  }
  
  // Handle percentage
  const isPercent = s.includes('%');
  if (isPercent) {
    s = s.replace(/%/g, '');
  }
  
  s = s.trim();
  if (s === '') return 0;
  
  // Detect format based on last separator position
  // If last separator is comma -> Indonesian format (1.000,50)
  // If last separator is dot -> US format (1,000.50)
  const lastComma = s.lastIndexOf(',');
  const lastDot = s.lastIndexOf('.');
  
  let num;
  if (lastComma > lastDot && lastComma !== -1) {
    // Indonesian format: comma is decimal separator
    // Remove all dots (thousand separators), replace comma with dot
    const cleaned = s.replace(/\./g, '').replace(',', '.');
    num = parseFloat(cleaned);
  } else if (lastDot > lastComma && lastDot !== -1) {
    // US format: dot is decimal separator
    // Remove all commas (thousand separators)
    const cleaned = s.replace(/,/g, '');
    num = parseFloat(cleaned);
  } else {
    // No decimal separator, treat as integer
    // Remove all dots and commas (they would be thousand separators)
    const cleaned = s.replace(/[.,]/g, '');
    num = parseFloat(cleaned);
  }
  
  if (isNaN(num)) return 0;
  
  // Apply negative sign
  if (isNegative) num = -Math.abs(num);
  
  // Apply percentage
  if (isPercent) num = num / 100;
  
  return num;
};

// Alias for backward compatibility
const parseNumForCalc = parseNum;

/**
 * Format number for display (Indonesian format)
 * - Thousand separator: dot (1.000.000)
 * - Decimal separator: comma (0,50)
 * - Preserves minus sign
 * - Preserves % symbol
 */
const fmtNumber = (v) => {
  if (v === "" || v == null) return "";

  const s = String(v).trim();

  // If value contains %, handle specially
  if (s.includes('%')) {
    const numPart = s.replace(/%/g, '').trim();
    const num = parseNum(numPart);
    if (isNaN(num)) return s; // Return as-is if can't parse
    // Format the number part, then add % back
    const formatted = new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 10
    }).format(num);
    return formatted + '%';
  }

  // Parse using our flexible parser
  const num = parseNum(s);
  
  if (isNaN(num)) return "";
  
  // Format with Indonesian locale
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 10
  }).format(num);
};

// Format value for display (preserves % symbol, backward compatibility)
const formatDisplayValue = (v) => {
  return fmtNumber(v);
};

/**
 * Format integer dengan titik sebagai pemisah ribuan (format ID)
 * TIDAK menggunakan Intl.NumberFormat (tidak konsisten antar browser/OS)
 * Contoh: 5230 → "5.230", -1000000 → "-1.000.000"
 */
const formatIntWithDots = (intVal) => {
  const isNeg = intVal < 0;
  const s = String(Math.abs(Math.trunc(intVal)));
  let result = '';
  for (let i = 0; i < s.length; i++) {
    if (i > 0 && (s.length - i) % 3 === 0) result += '.';
    result += s[i];
  }
  return (isNeg ? '-' : '') + result;
};

/**
 * Smart format untuk input onBlur - preserve trailing zero & comma
 * TIDAK menggunakan Intl.NumberFormat agar konsisten di semua browser/OS.
 *
 * Contoh:
 *   "-5230"     → "-5.230"       ✓ titik sebagai thousand sep
 *   "-5230,0"   → "-5.230,0"     ✓ trailing zero dipertahankan
 *   "-5230,"    → "-5.230,"      ✓ trailing comma dipertahankan (masih mengetik)
 *   "1234,00"   → "1.234,00"     ✓ trailing double zero
 *   "1.000,50"  → "1.000,50"     ✓ sudah terformat, tidak berubah
 *   "10%"       → "10%"          ✓ persen dipertahankan
 *   "-50%"      → "-50%"         ✓ persen negatif
 *   "-"         → "-"            ✓ tanda minus saja, biarkan
 */
const fmtNumberSmart = (rawStr) => {
  if (!rawStr || !rawStr.trim()) return '';

  const s = rawStr.trim();

  // Biarkan as-is jika hanya separator atau minus
  if (s === '-' || s === ',' || s === '.') return s;

  // ── Handle persen (%) ──────────────────────────────────────
  if (s.includes('%')) {
    const withoutPct = s.replace('%', '').trim();
    const isNegPct = withoutPct.startsWith('-') || withoutPct.endsWith('-');
    const cleanPct = withoutPct.replace(/-/g, '').trim();

    const lastC = cleanPct.lastIndexOf(',');
    const lastD = cleanPct.lastIndexOf('.');

    let intRaw, decStr;
    if (lastC > lastD && lastC !== -1) {
      intRaw = cleanPct.slice(0, lastC).replace(/[.,]/g, '');
      decStr = cleanPct.slice(lastC + 1);
    } else if (lastD > lastC && lastD !== -1) {
      intRaw = cleanPct.slice(0, lastD).replace(/[.,]/g, '');
      decStr = cleanPct.slice(lastD + 1);
    } else {
      intRaw = cleanPct.replace(/[.,]/g, '');
      decStr = null;
    }

    const intNum = parseInt(intRaw || '0', 10);
    const intFormatted = formatIntWithDots(isNegPct ? -intNum : intNum);
    return decStr !== null
      ? `${intFormatted},${decStr}%`
      : `${intFormatted}%`;
  }

  // ── Trailing comma/dot: user masih mengetik desimal ────────
  if (s.endsWith(',') || s.endsWith('.')) {
    const numPart = s.slice(0, -1);
    if (!numPart || numPart === '-') return s;
    const num = parseNum(numPart);
    if (!isFinite(num)) return s;
    return formatIntWithDots(Math.trunc(num)) + ',';
  }

  // ── Deteksi & pisahkan bagian desimal ─────────────────────
  const lastCommaIdx = s.lastIndexOf(',');
  const lastDotIdx = s.lastIndexOf('.');

  let decimalStr = null;
  if (lastCommaIdx > lastDotIdx && lastCommaIdx > 0) {
    // Indonesian format: koma = decimal separator
    decimalStr = s.slice(lastCommaIdx + 1); // preserve as-is (trailing zeros!)
  } else if (lastDotIdx > lastCommaIdx && lastDotIdx > 0) {
    // US format: dot = decimal separator
    decimalStr = s.slice(lastDotIdx + 1);
  }

  // Parse nilai penuh → ambil bagian integer saja untuk format
  const num = parseNum(s);
  if (!isFinite(num)) return s;

  const intPart = Math.trunc(num); // integer part (with sign)
  const intFormatted = formatIntWithDots(intPart);

  return decimalStr !== null
    ? `${intFormatted},${decimalStr}`
    : intFormatted;
};


const computeKepatuhanHasil = (row) => {
  const modeRaw = row.mode || "RASIO";
  const mode = modeRaw === "KUALITATIF" ? "TEKS" : (modeRaw === "NILAI_TUNGGAL_PENY" ? "NILAI_TUNGGAL" : modeRaw);

  // TEKS mode - return empty string for numeric calculation
  if (mode === "TEKS") {
    return "";
  }

  const pemb = parseNumForCalc(row.numeratorValue);
  const peny = parseNumForCalc(row.denominatorValue);

  // Custom formula
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
      console.warn("Invalid formula:", row.formula, e);
      return "";
    }
  }

  // NILAI_TUNGGAL mode
  if (mode === "NILAI_TUNGGAL") {
    const raw = row.denominatorValue;
    if (raw === "" || raw == null) return "";
    const val = parseNumForCalc(raw);
    if (!isFinite(val) || isNaN(val)) return "";
    return Number(val);
  }

  // RASIO mode (default)
  if (peny === 0) return "";
  const result = pemb / peny;
  if (!isFinite(result) || isNaN(result)) return "";
  return Number(result);
};

const computeWeightedLocal = (bobotSection, bobotIndikator, peringkat) => {
  const s = Number(bobotSection || 0);
  const b = Number(bobotIndikator || 0);
  const p = Number(peringkat || 0);
  const res = (s * b * p) / 10000;
  if (!isFinite(res) || isNaN(res)) return 0;
  return res;
};

const loadKepatuhanRows = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("kepatuhanRows");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Recalculate weighted values to fix old data precision
    return parsed.map(row => ({
      ...row,
      weighted: computeWeightedLocal(row.bobotSection, row.bobotIndikator, row.peringkat)
    }));
  } catch (e) {
    console.warn("Gagal parse kepatuhanRows dari localStorage", e);
    return [];
  }
};

// helper (id unik per baris, juga dipakai RekapData)
const makeRowKey = (r) => {
  const key = `${r.source || "KEPATUHAN"}|${r.year}|${r.quarter}|${r.no ?? ""}|${r.subNo ?? ""}|${r.sectionLabel ?? ""}|${r.indikator ?? ""}`;

  return key;
};

export default function Kepatuhan() {
  // ====== Tabs ======
  const [activeTab, setActiveTab] = useState("kepatuhan");

  // ====== Periode + search ======
  const [viewYear, setViewYear] = useState(
    getCurrentYear ? getCurrentYear() : new Date().getFullYear()
  );
  const [viewQuarter, setViewQuarter] = useState(
    getCurrentQuarter ? getCurrentQuarter() : "Q1"
  );
  const [query, setQuery] = useState("");

  const [showKepatuhanForm, setShowKepatuhanForm] = useState(false);

  // ---------------------------------------------------------------------------
  //                              TAB KEPATUHAN
  // ---------------------------------------------------------------------------

  // ----- SECTION LIST -----
  const [KEPATUHAN_sections, setKEPATUHAN_sections] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      // Try loading v2 first
      const rawV2 = localStorage.getItem(KEPATUHAN_SECTIONS_LS);
      if (rawV2) {
        return JSON.parse(rawV2);
      }

      // Try migrating from v1
      const rawV1 = localStorage.getItem(KEPATUHAN_SECTIONS_LS_V1);
      if (rawV1) {
        const v1Sections = JSON.parse(rawV1);
        const currentYear = getCurrentYear ? getCurrentYear() : new Date().getFullYear();
        const currentQuarter = getCurrentQuarter ? getCurrentQuarter() : "Q1";

        // Migrate to v2 format
        const v2Sections = v1Sections.map(s => ({
          ...s,
          year: currentYear,
          quarter: currentQuarter,
          inheritedFrom: null,
          isVirtual: false
        }));

        // Backup v1 and save v2
        localStorage.setItem(KEPATUHAN_SECTIONS_LS_V1 + "_backup", rawV1);
        localStorage.setItem(KEPATUHAN_SECTIONS_LS, JSON.stringify(v2Sections));

        return v2Sections;
      }

      return [];
    } catch {
      return [];
    }
  });

  const [KEPATUHAN_sectionForm, setKEPATUHAN_sectionForm] = useState({
    id: "",
    no: "",
    bobotSection: 0,
    sectionLabel: "",
  });

  // Track inheritance info for rows
  const [inheritInfo, setInheritInfo] = useState(null);

  // Track editing modes
  const [isAddingNewSection, setIsAddingNewSection] = useState(false);
  const [isEditingSection, setIsEditingSection] = useState(false);
  const [newlyAddedSections, setNewlyAddedSections] = useState(new Set());

  //
  const currentPeriodSections = useMemo(() => {
    return getSectionsForPeriod(viewYear, viewQuarter, KEPATUHAN_sections);
  }, [viewYear, viewQuarter, KEPATUHAN_sections]);

  function KEPATUHAN_selectSection(id) {
    const s = currentPeriodSections.find((x) => x.id === id);
    if (s) {
      setKEPATUHAN_sectionForm({
        id: s.id,
        no: s.no,
        bobotSection: s.bobotSection,
        sectionLabel: s.parameter,
      });
      setIsAddingNewSection(false);
      setIsEditingSection(false);

    }
  }

  function KEPATUHAN_addSection() {
    const sectionData = {
      no: KEPATUHAN_sectionForm.no || "",
      bobotSection: Number(KEPATUHAN_sectionForm.bobotSection || 0),
      parameter: KEPATUHAN_sectionForm.sectionLabel || "",
    };

    setKEPATUHAN_sections((prev) => {
      const newSections = addSectionToPeriod(viewYear, viewQuarter, sectionData, prev);
      localStorage.setItem(KEPATUHAN_SECTIONS_LS, JSON.stringify(newSections));

      // Track the newly added section
      const addedSection = newSections.find(s =>
        s.no === sectionData.no &&
        s.parameter === sectionData.parameter &&
        s.year === viewYear &&
        s.quarter === viewQuarter &&
        !s.inheritedFrom
      );
      if (addedSection) {
        setNewlyAddedSections(prev => new Set([...prev, addedSection.id]));
      }

      return newSections;
    });

    // Update form with the newly added section
    setKEPATUHAN_sectionForm({
      id: "", // Will be set after state update
      no: sectionData.no,
      bobotSection: sectionData.bobotSection,
      sectionLabel: sectionData.parameter,
    });

    setIsAddingNewSection(false);
    setIsEditingSection(false);

  }

  function KEPATUHAN_saveSection() {
    if (!KEPATUHAN_sectionForm.id) return;

    setKEPATUHAN_sections((prev) => {
      const newSections = updateSectionInPeriod(
        KEPATUHAN_sectionForm.id,
        viewYear,
        viewQuarter,
        {
          no: KEPATUHAN_sectionForm.no,
          bobotSection: Number(KEPATUHAN_sectionForm.bobotSection || 0),
          parameter: KEPATUHAN_sectionForm.sectionLabel,
        },
        prev
      );
      localStorage.setItem(KEPATUHAN_SECTIONS_LS, JSON.stringify(newSections));
      return newSections;
    });

    setIsAddingNewSection(false);
    setIsEditingSection(false);

  }

  function KEPATUHAN_removeSection(id) {
    const sectionToDelete = currentPeriodSections.find((s) => s.id === id);

    if (!sectionToDelete) {
      console.warn('[KEPATUHAN_removeSection] Section not found:', id);
      return;
    }

    // Remove from newlyAddedSections if present
    setNewlyAddedSections(prev => {
      const newSet = new Set(prev);
      newSet.delete(sectionToDelete.id);
      return newSet;
    });

    // Remove the section
    setKEPATUHAN_sections((prev) => {
      const newSections = deleteSectionFromPeriod(id, viewYear, viewQuarter, prev);
      localStorage.setItem(KEPATUHAN_SECTIONS_LS, JSON.stringify(newSections));
      return newSections;
    });

    // Cascade delete: Remove all rows belonging to this section
    setKEPATUHAN_rows((prev) => {
      const filteredRows = prev.filter((r) => {
        const isFromDeletedSection =
          r.no === sectionToDelete.no &&
          r.sectionLabel === sectionToDelete.parameter &&
          Number(r.year) === Number(viewYear) &&
          r.quarter === viewQuarter;
        return !isFromDeletedSection;
      });
      return filteredRows;
    });

    // Reset the form
    setKEPATUHAN_sectionForm({
      id: "",
      no: "",
      bobotSection: 0,
      sectionLabel: "",
    });

    setIsAddingNewSection(false);
    setIsEditingSection(false);

  }

  // ===== PERSIST SECTION KE localStorage =====
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(
        KEPATUHAN_SECTIONS_LS,
        JSON.stringify(KEPATUHAN_sections)
      );
    } catch (e) {
      console.warn("Gagal simpan kepatuhan sections", e);
    }
  }, [KEPATUHAN_sections]);

  // ===== AUTO-CLONE SECTIONS ON PERIOD CHANGE =====
  useEffect(() => {
    if (typeof window === "undefined") return;

    const updatedSections = autoCloneSectionsIfNeeded(viewYear, viewQuarter, KEPATUHAN_sections);

    // Hanya update jika ada perubahan (clone terjadi)
    if (updatedSections.length !== KEPATUHAN_sections.length) {
      setKEPATUHAN_sections(updatedSections);
      localStorage.setItem(KEPATUHAN_SECTIONS_LS, JSON.stringify(updatedSections));

    }
  }, [viewYear, viewQuarter]);

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

  // 1) semua baris indikator kepatuhan (multi tahun & quarter)
  const [KEPATUHAN_rows, setKEPATUHAN_rows] = useState(loadKepatuhanRows);

  // 2) form indikator yang sedang diisi
  const [KEPATUHAN_form, setKEPATUHAN_form] = useState(invMakeRow());

  // 3) baris yang sedang di-edit (kalau null berarti mode tambah)
  const [KEPATUHAN_editingRow, setKEPATUHAN_editingRow] = useState(null);

  // State untuk raw input values (untuk flexible typing - support minus, thousand separators)
  const [rawNumeratorInput, setRawNumeratorInput] = useState("");
  const [rawDenominatorInput, setRawDenominatorInput] = useState("");

  // Ref untuk mencegah infinite loop di AUTO-RECALCULATE WEIGHTED
  const isProcessingWeighted = useRef(false);
  const isProcessingRekapChange = useRef(false);
  const latestRowsStrRef = useRef("");

  useEffect(() => {
    try {
      latestRowsStrRef.current = JSON.stringify(KEPATUHAN_rows);
    } catch {
      latestRowsStrRef.current = "";
    }
  }, [KEPATUHAN_rows]);

  // ============================================================
  // AUTO-CLONE ROWS ON PERIOD CHANGE
  // ============================================================
  useEffect(() => {
    const result = cloneFromPreviousPeriod({
      rows: KEPATUHAN_rows,
      targetYear: viewYear,
      targetQuarter: viewQuarter,
      sourceLabel: "KEPATUHAN",
    });

    if (result.cloned) {
      setKEPATUHAN_rows(result.rows);
      setInheritInfo({
        from: result.from,
        count: result.count,
      });

    } else {
      setInheritInfo(null);
    }
  }, [viewYear, viewQuarter]);

  // Handle undo inheritance
  const handleUndoInheritance = () => {
    if (!inheritInfo) return;

    const cleaned = undoClone({
      rows: KEPATUHAN_rows,
      year: viewYear,
      quarter: viewQuarter,
      inheritedFrom: inheritInfo.from,
    });

    setKEPATUHAN_rows(cleaned);
    setInheritInfo(null);

  };

  // ============================================================
  // AUTO-CALCULATE PERINGKAT (RASIO/NILAI_TUNGGAL mode)
  // ============================================================
  useEffect(() => {
    // Skip untuk TEKS mode - di-handle terpisah
    if (KEPATUHAN_form?.mode === "TEKS") return;

    if (!KEPATUHAN_form || !KEPATUHAN_sectionForm) return;

    try {
      const baseRow = {
        ...KEPATUHAN_form,
        no: KEPATUHAN_sectionForm.no || "",
        sectionLabel: KEPATUHAN_sectionForm.sectionLabel || "",
        bobotSection: KEPATUHAN_sectionForm.bobotSection || 0,
      };

      const hasilNum = computeKepatuhanHasil(baseRow);

      if (hasilNum !== "" && hasilNum != null) {
        const newPeringkat = calculatePeringkat(
          hasilNum,
          {
            low: KEPATUHAN_form.low || "",
            lowToModerate: KEPATUHAN_form.lowToModerate || "",
            moderate: KEPATUHAN_form.moderate || "",
            moderateToHigh: KEPATUHAN_form.moderateToHigh || "",
            high: KEPATUHAN_form.high || "",
          },
          KEPATUHAN_form.isPercent || false
        );

        if (KEPATUHAN_form.peringkat !== newPeringkat) {
          setKEPATUHAN_form(prev => ({ ...prev, peringkat: newPeringkat }));
        }
      }
    } catch (err) {
      // Silent fail for peringkat calculation
    }
  }, [
    KEPATUHAN_form?.low,
    KEPATUHAN_form?.lowToModerate,
    KEPATUHAN_form?.moderate,
    KEPATUHAN_form?.moderateToHigh,
    KEPATUHAN_form?.high,
    KEPATUHAN_form?.numeratorValue,
    KEPATUHAN_form?.denominatorValue,
    KEPATUHAN_form?.formula,
    KEPATUHAN_form?.isPercent,
    KEPATUHAN_form?.mode,
    KEPATUHAN_sectionForm?.bobotSection,
  ]);

  // ============================================================
  // AUTO-CALCULATE PERINGKAT untuk TEKS MODE (KUALITATIF)
  // DUAL SYSTEM: Text matching OR Numeric comparison
  // ============================================================
  useEffect(() => {
    // Hanya untuk TEKS mode
    if (KEPATUHAN_form?.mode !== "TEKS") return;

    if (!KEPATUHAN_form) return;

    try {
      const riskLevels = {
        low: KEPATUHAN_form.low || "",
        lowToModerate: KEPATUHAN_form.lowToModerate || "",
        moderate: KEPATUHAN_form.moderate || "",
        moderateToHigh: KEPATUHAN_form.moderateToHigh || "",
        high: KEPATUHAN_form.high || "",
      };

      let newPeringkat = 0;

      // DETEKSI: Gunakan numeric atau text calculation?
      if (isNumericRiskLevels(riskLevels)) {
        // Numeric comparison - gunakan calculatePeringkat
        // Parse hasilText sebagai number
        const hasilNum = parseFloat(KEPATUHAN_form.hasilText);
        if (!isNaN(hasilNum)) {
          newPeringkat = calculatePeringkat(
            hasilNum, // Gunakan nilai asli, calculatePeringkat akan handle konversi
            riskLevels,
            true // isPercent = true
          );
        }

              } else {
        // Text matching - gunakan calculatePeringkatFromText
        newPeringkat = calculatePeringkatFromText(
          KEPATUHAN_form.hasilText || "",
          riskLevels
        );

              }

      if (KEPATUHAN_form.peringkat !== newPeringkat) {
        setKEPATUHAN_form(prev => ({ ...prev, peringkat: newPeringkat }));
      }
    } catch (err) {
      console.warn('[KEPATUHAN] TEKS peringkat calculation failed:', err);
    }
  }, [
    KEPATUHAN_form?.mode,
    KEPATUHAN_form?.hasilText,
    KEPATUHAN_form?.low,
    KEPATUHAN_form?.lowToModerate,
    KEPATUHAN_form?.moderate,
    KEPATUHAN_form?.moderateToHigh,
    KEPATUHAN_form?.high,
  ]);

  
  // ============================================================
  // AUTO-RECALCULATE WEIGHTED saat peringkat berubah
  // ============================================================
  useEffect(() => {
    // ✅ FIX: Skip jika sedang processing dari RekapData
    if (!KEPATUHAN_rows?.length || isProcessingWeighted.current || isProcessingRekapChange.current) {
      return;
    }

    let hasChanges = false;

    const updatedRows = KEPATUHAN_rows.map(row => {
      // Hitung weighted yang seharusnya
      const calculatedWeighted = computeWeightedLocal(
        row.bobotSection,
        row.bobotIndikator,
        row.peringkat
      );

      // Bandingkan dengan weighted yang tersimpan
      const currentWeighted = Number(row.weighted) || 0;

      // Jika berbeda, update row
      if (Math.abs(calculatedWeighted - currentWeighted) > 0.001) {
        hasChanges = true;
        return {
          ...row,
          weighted: calculatedWeighted
        };
      }

      return row;
    });

    // Hanya update jika ada perubahan (hindari infinite loop)
    if (hasChanges) {
      console.log('[KEPATUHAN] 🔄 Auto-recalculating weighted values');
      isProcessingWeighted.current = true;
      setKEPATUHAN_rows(updatedRows);

      // ✅ FIX: Save TANPA dispatch event
      try {
        localStorage.setItem("kepatuhanRows", JSON.stringify(updatedRows));
      } catch (e) {
        console.warn('[KEPATUHAN] Failed to save auto-recalculated weighted', e);
      }

      // Reset flag setelah state update
      setTimeout(() => {
        isProcessingWeighted.current = false;
      }, 200);
    }
  }, [KEPATUHAN_rows.map(r => `${r.no}-${r.subNo}-${r.peringkat}-${r.bobotIndikator}`).join(',')]);

  // --- sinkronkan semua baris ke localStorage (supaya tidak hilang) ---
  useEffect(() => {
    // ✅ FIX: Skip jika sedang processing dari RekapData atau auto-recalculate
    if (typeof window === "undefined" || isProcessingRekapChange.current || isProcessingWeighted.current) {
      return;
    }

    try {
      localStorage.setItem("kepatuhanRows", JSON.stringify(KEPATUHAN_rows));
      // Notify RekapData/Rekap1 without re-triggering Kepatuhan sync
      window.dispatchEvent(
        new CustomEvent("kepatuhanRows:changed", { detail: { origin: "KEPATUHAN" } })
      );
    } catch (e) {
      console.warn("Gagal simpan kepatuhanRows ke localStorage", e);
    }
  }, [KEPATUHAN_rows]);

  // --- bentuk data ringkas untuk RekapData & simpan ke localStorage ---
  // ============================================================
  // SIMPAN DATA RINGKAS UNTUK REKAP1.JSX (KEPATUHAN)
  // ============================================================
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Map ALL data from KEPATUHAN_rows, not just filtered by viewYear/viewQuarter
    // This ensures we save data for ALL periods, not just the current view
    const rekapRows = KEPATUHAN_rows.map((r, idx) => ({
      // id stabil
      id: makeRowKey(r),

      // periode
      year: r.year,
      quarter: r.quarter,

      // identitas risk form
      riskFormId: "kepatuhan",
      riskFormLabel: "Kepatuhan",

      // SECTION
      sectionNo: r.no || "",
      sectionLabel: r.sectionLabel || "",
      bobotSection: Number(r.bobotSection || 0),

      // INDIKATOR
      subNo: r.subNo || "",
      indikator: r.indikator || "",
      bobotIndikator: Number(r.bobotIndikator || 0),

      // PERHITUNGAN
      pembilangLabel: r.numeratorLabel || "",
      pembilangValue: r.numeratorValue || "",
      penyebutLabel: r.denominatorLabel || "",
      penyebutValue: r.denominatorValue || "",

      mode: r.mode || "RASIO",
      formula: r.formula || "",
      isPercent: !!r.isPercent,

      // HASIL & RISIKO
      hasil:
        r.mode === "TEKS"
          ? ""
          : (r.hasil !== "" && r.hasil != null
            ? Number(r.hasil)
            : computeKepatuhanHasil(r)),

      hasilText: r.mode === "TEKS" ? (r.hasilText || "") : "",

      peringkat:
        r.peringkat !== "" && r.peringkat != null
          ? Number(r.peringkat)
          : 0,

      weighted:
        r.weighted !== "" && r.weighted != null
          ? Number(r.weighted)
          : 0,

      keterangan: r.keterangan || "",
    }));

    // Group by year/quarter to avoid duplicates within each period
    const periodMap = new Map();
    rekapRows.forEach(row => {
      const key = `${row.year}|${row.quarter}`;
      if (!periodMap.has(key)) {
        periodMap.set(key, []);
      }
      periodMap.get(key).push(row);
    });

    // Flatten grouped data
    const uniqueRows = Array.from(periodMap.values()).flat();

    try {
      // Save all data
      localStorage.setItem("rekap_kepatuhan", JSON.stringify(uniqueRows));
    } catch (e) {
      console.warn("Gagal simpan rekap_kepatuhan", e);
    }
  }, [KEPATUHAN_rows]);

  // Run once on mount to sync any existing data
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if rekap_kepatuhan already exists and is up to date
    const existingRekap = localStorage.getItem("rekap_kepatuhan");
    const existingRekapData = existingRekap ? JSON.parse(existingRekap) : [];

    // Get all unique periods from KEPATUHAN_rows
    const periodsInRows = new Set(KEPATUHAN_rows.map(r => `${r.year}|${r.quarter}`));
    const periodsInRekap = new Set(existingRekapData.map(r => `${r.year}|${r.quarter}`));

    // If periods don't match, save to sync
    const needsSync = periodsInRows.size !== periodsInRekap.size ||
      ![...periodsInRows].every(p => periodsInRekap.has(p));

    if (needsSync && KEPATUHAN_rows.length > 0) {

      // Re-use the same mapping logic
      const rekapRows = KEPATUHAN_rows.map((r) => ({
        id: makeRowKey(r),
        year: r.year,
        quarter: r.quarter,
        riskFormId: "kepatuhan",
        riskFormLabel: "Kepatuhan",
        sectionNo: r.no || "",
        sectionLabel: r.sectionLabel || "",
        bobotSection: Number(r.bobotSection || 0),
        subNo: r.subNo || "",
        indikator: r.indikator || "",
        bobotIndikator: Number(r.bobotIndikator || 0),
        pembilangLabel: r.numeratorLabel || "",
        pembilangValue: r.numeratorValue || "",
        penyebutLabel: r.denominatorLabel || "",
        penyebutValue: r.denominatorValue || "",
        mode: r.mode || "RASIO",
        formula: r.formula || "",
        isPercent: !!r.isPercent,
        hasil: r.mode === "TEKS" ? "" : (r.hasil !== "" && r.hasil != null ? Number(r.hasil) : computeKepatuhanHasil(r)),
        hasilText: r.mode === "TEKS" ? (r.hasilText || "") : "",
        peringkat: r.peringkat !== "" && r.peringkat != null ? Number(r.peringkat) : 0,
        weighted: r.weighted !== "" && r.weighted != null ? Number(r.weighted) : 0,
        keterangan: r.keterangan || "",
      }));

      const periodMap = new Map();
      rekapRows.forEach(row => {
        const key = `${row.year}|${row.quarter}`;
        if (!periodMap.has(key)) periodMap.set(key, []);
        periodMap.get(key).push(row);
      });
      const uniqueRows = Array.from(periodMap.values()).flat();

      localStorage.setItem("rekap_kepatuhan", JSON.stringify(uniqueRows));

    }
  }, []); // Run once on mount

 
  
  // ============================================================
  // LISTEN FOR REKAPDATA CHANGES (Bidirectional Sync)
  // ============================================================
  useEffect(() => {
    // ✅ FIX: Tambahkan flag untuk prevent circular updates
    let isUpdating = false;
    let debounceTimer = null;

    const handleRowsChange = (e) => {
      // Ignore self-notifications (we already updated local state)
      if (e?.detail?.origin === "KEPATUHAN") {
        return;
      }

      // ✅ CRITICAL: Prevent circular updates
      if (isProcessingRekapChange.current || isUpdating) {
        console.log('[KEPATUHAN] ⏭️ Skipping handleRowsChange (already processing)');
        return;
      }

      // ✅ FIX: Debounce untuk prevent multiple rapid calls
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      debounceTimer = setTimeout(() => {
        console.log('[KEPATUHAN] 🔄 Processing kepatuhanRows:changed event');

        isProcessingRekapChange.current = true;
        isUpdating = true;

        try {
          // Reload rows dari localStorage
          const rows = loadKepatuhanRows();

          // ✅ FIX: Cek apakah data sudah sama (prevent unnecessary updates)
          const currentRowsStr = latestRowsStrRef.current || JSON.stringify(KEPATUHAN_rows);
          const newRowsStr = JSON.stringify(rows);

          if (currentRowsStr === newRowsStr) {
            console.log('[KEPATUHAN] ⏭️ Data unchanged, skipping recalculation');
            isProcessingRekapChange.current = false;
            isUpdating = false;
            return;
          }

          // Auto-recalculate peringkat dan weighted untuk semua rows
          const recalculated = rows.map(row => {
            // Skip jika tidak ada data untuk recalculate
            const hasHasil = row.hasil !== "" && row.hasil != null;
            if (!row.numeratorValue && !row.denominatorValue && !row.hasilText && !hasHasil) {
              return row;
            }

            let newPeringkat = row.peringkat;

            // Recalculate peringkat berdasarkan mode
            if (row.mode === 'TEKS') {
              const riskLevels = {
                low: row.low || "",
                lowToModerate: row.lowToModerate || "",
                moderate: row.moderate || "",
                moderateToHigh: row.moderateToHigh || "",
                high: row.high || "",
              };

              newPeringkat = isNumericRiskLevels(riskLevels)
                ? calculatePeringkat(parseFloat(row.hasilText || 0), riskLevels, true)
                : calculatePeringkatFromText(row.hasilText || "", riskLevels);

            } else {
              // RASIO/NILAI_TUNGGAL mode: hitung hasil dulu
              // Prefer saved `hasil` (import) if present; fallback to recompute from values
              let hasilNum = "";
              if (row.hasil !== "" && row.hasil != null && Number.isFinite(Number(row.hasil))) {
                hasilNum = Number(row.hasil);
              } else {
                hasilNum = computeKepatuhanHasil(row);
              }

              if (hasilNum !== "" && hasilNum != null) {
                newPeringkat = calculatePeringkat(
                  hasilNum,
                  {
                    low: row.low || "",
                    lowToModerate: row.lowToModerate || "",
                    moderate: row.moderate || "",
                    moderateToHigh: row.moderateToHigh || "",
                    high: row.high || "",
                  },
                  row.isPercent || false
                );
              }
            }

            // Recalculate weighted
            const newWeighted = computeWeightedLocal(
              row.bobotSection,
              row.bobotIndikator,
              newPeringkat
            );

            // Log jika ada perubahan
            if (row.peringkat !== newPeringkat || Math.abs((row.weighted || 0) - newWeighted) > 0.001) {
              console.log(`[KEPATUHAN] 📊 Recalculated ${row.indikator}: Peringkat ${row.peringkat} → ${newPeringkat}, Weighted ${row.weighted?.toFixed(2)} → ${newWeighted.toFixed(2)}`);
            }

            return {
              ...row,
              // normalize isPercent from risk level strings
              isPercent: Object.values({
                low: row.low || "",
                lowToModerate: row.lowToModerate || "",
                moderate: row.moderate || "",
                moderateToHigh: row.moderateToHigh || "",
                high: row.high || "",
              }).some(v => String(v || "").includes("%")),
              peringkat: newPeringkat,
              weighted: newWeighted
            };
          });

          // ✅ CRITICAL: Cek apakah ada perubahan sebelum save (prevent unnecessary writes)
          const hasChanges = recalculated.some((row, idx) => {
            const old = rows[idx];
            return row.peringkat !== old?.peringkat ||
              Math.abs((row.weighted || 0) - (old?.weighted || 0)) > 0.001;
          });

          if (!hasChanges) {
            console.log('[KEPATUHAN] ⏭️ No changes after recalculation, skipping save');
            setKEPATUHAN_rows(rows); // Update UI dengan data dari localStorage
            isProcessingRekapChange.current = false;
            isUpdating = false;
            return;
          }

          // Update state dengan data yang sudah di-recalculate
          setKEPATUHAN_rows(recalculated);

          // ✅ FIX: Simpan TANPA dispatch event untuk prevent loop
          try {
            localStorage.setItem("kepatuhanRows", JSON.stringify(recalculated));
            console.log('[KEPATUHAN] ✅ Recalculation complete, saved to localStorage (NO EVENT DISPATCH)');
          } catch (e) {
            console.warn('[KEPATUHAN] Failed to save recalculated rows', e);
          }

        } catch (error) {
          console.error('[KEPATUHAN] Error in handleRowsChange:', error);
        } finally {
          // ✅ FIX: Reset flags dengan delay
          setTimeout(() => {
            isProcessingRekapChange.current = false;
            isUpdating = false;
          }, 200);
        }
      }, 100); // Debounce 100ms
    };

    const handleSectionsChange = (e) => {
      console.log('[KEPATUHAN] 🔄 Received kepatuhanSections:changed event');

      // Reload sections from localStorage
      const raw = localStorage.getItem(KEPATUHAN_SECTIONS_LS);
      if (raw) {
        try {
          setKEPATUHAN_sections(JSON.parse(raw));
        } catch (e) {
          console.warn('[KEPATUHAN] Failed to parse sections from localStorage', e);
        }
      }
    };

    // Handler khusus untuk row update dari RekapData
    const handleRowUpdate = (e) => {
      console.log('[KEPATUHAN] 🎯 Received kepatuhanRow:update event', e.detail);

      // Trigger reload & recalculation (akan di-debounce)
      handleRowsChange(e);
    };

    window.addEventListener("kepatuhanRows:changed", handleRowsChange);
    window.addEventListener("kepatuhanSections:changed", handleSectionsChange);
    window.addEventListener("kepatuhanRow:update", handleRowUpdate);

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      window.removeEventListener("kepatuhanRows:changed", handleRowsChange);
      window.removeEventListener("kepatuhanSections:changed", handleSectionsChange);
      window.removeEventListener("kepatuhanRow:update", handleRowUpdate);
    };
  }, []); // ✅ PENTING: Empty dependency array

  // ============================================================
  // ONE-TIME RECALC ON MOUNT
  // Ensures imported Kepatuhan rows (edited in RekapData export)
  // get peringkat/weighted recalculated even if this page was not
  // mounted when the import event fired.
  // ============================================================
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const rows = loadKepatuhanRows();
      if (!Array.isArray(rows) || rows.length === 0) return;

      const recalculated = rows.map((row) => {
        const hasHasil = row.hasil !== "" && row.hasil != null;
        if (!row.numeratorValue && !row.denominatorValue && !row.hasilText && !hasHasil) {
          return row;
        }

        let newPeringkat = row.peringkat;

        if (row.mode === "TEKS" || row.mode === "KUALITATIF") {
          const riskLevels = {
            low: row.low || "",
            lowToModerate: row.lowToModerate || "",
            moderate: row.moderate || "",
            moderateToHigh: row.moderateToHigh || "",
            high: row.high || "",
          };

          newPeringkat = isNumericRiskLevels(riskLevels)
            ? calculatePeringkat(parseFloat(row.hasilText || 0), riskLevels, true)
            : calculatePeringkatFromText(row.hasilText || "", riskLevels);
        } else {
          const riskLevels = {
            low: row.low || "",
            lowToModerate: row.lowToModerate || "",
            moderate: row.moderate || "",
            moderateToHigh: row.moderateToHigh || "",
            high: row.high || "",
          };

          const inferredIsPercent = Object.values(riskLevels).some(v => String(v || "").includes("%"));

          let hasilNum = "";
          if (row.hasil !== "" && row.hasil != null && Number.isFinite(Number(row.hasil))) {
            hasilNum = Number(row.hasil);
          } else {
            hasilNum = computeKepatuhanHasil(row);
          }

          if (hasilNum !== "" && hasilNum != null) {
            newPeringkat = calculatePeringkat(hasilNum, riskLevels, inferredIsPercent);
          }
        }

        const newWeighted = computeWeightedLocal(
          row.bobotSection,
          row.bobotIndikator,
          newPeringkat
        );

        return {
          ...row,
          isPercent: Object.values({
            low: row.low || "",
            lowToModerate: row.lowToModerate || "",
            moderate: row.moderate || "",
            moderateToHigh: row.moderateToHigh || "",
            high: row.high || "",
          }).some(v => String(v || "").includes("%")),
          peringkat: newPeringkat,
          weighted: newWeighted,
        };
      });

      const changed = recalculated.some((r, idx) => {
        const old = rows[idx];
        return (
          r.peringkat !== old?.peringkat ||
          Math.abs((r.weighted || 0) - (old?.weighted || 0)) > 0.001
        );
      });

      if (changed) {
        setKEPATUHAN_rows(recalculated);
        try {
          localStorage.setItem("kepatuhanRows", JSON.stringify(recalculated));
        } catch (e) {
          console.warn("[KEPATUHAN] Failed to save recalculated rows on mount", e);
        }
      }
    } catch (e) {
      // silent
    }
  }, []);

  const KEPATUHAN_filtered = useMemo(() => {
    return KEPATUHAN_rows
      .filter((r) => r.year === viewYear && r.quarter === viewQuarter)
      .filter((r) =>
        `${r.no} ${r.subNo} ${r.sectionLabel} ${r.indikator} ${r.keterangan} ${r.sumberRisiko} ${r.dampak}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
      .sort((a, b) =>
        `${a.subNo}`.localeCompare(`${b.subNo}`, undefined, { numeric: true })
      );
  }, [KEPATUHAN_rows, viewYear, viewQuarter, query]);

  const KEPATUHAN_totalWeighted = useMemo(
    () =>
      KEPATUHAN_filtered.reduce(
        (sum, r) => sum + (Number(r.weighted || 0) || 0),
        0
      ),
    [KEPATUHAN_filtered]
  );

  const KEPATUHAN_resetForm = () => {
    setKEPATUHAN_form(invMakeRow());
    setKEPATUHAN_editingRow(null);
    setRawNumeratorInput("");
    setRawDenominatorInput("");
  };

  const buildBaseRow = () => {
    const peringkatNum =
      KEPATUHAN_form.peringkat === "" || KEPATUHAN_form.peringkat == null
        ? 0
        : Number(KEPATUHAN_form.peringkat);

    return {
      ...KEPATUHAN_form,
      no: KEPATUHAN_sectionForm.no,
      sectionLabel: KEPATUHAN_sectionForm.sectionLabel,
      bobotSection: KEPATUHAN_sectionForm.bobotSection,
      peringkat: peringkatNum,
      numeratorLabel:
        KEPATUHAN_form.mode === "NILAI_TUNGGAL" || KEPATUHAN_form.mode === "TEKS"
          ? ""
          : KEPATUHAN_form.numeratorLabel,
      numeratorValue:
        KEPATUHAN_form.mode === "NILAI_TUNGGAL" || KEPATUHAN_form.mode === "TEKS"
          ? ""
          : KEPATUHAN_form.numeratorValue,
    };
  };

  const KEPATUHAN_addRow = () => {
    const baseRow = buildBaseRow();
    const rawHasil = computeKepatuhanHasil(baseRow);

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
      year: viewYear,
      quarter: viewQuarter,
      source: "KEPATUHAN",
      isFinal: true,
      inheritedFrom: null,
      inheritedAt: null,
      hasil: baseRow.mode === "TEKS" ? "" : (rawHasil === "" || rawHasil == null ? 0 : rawHasil),
      hasilText: baseRow.mode === "TEKS" ? (baseRow.hasilText || "") : "",
      weighted: weightedAuto,
    };

    const newRowKey = makeRowKey({ ...newRow, source: "KEPATUHAN" });

    setKEPATUHAN_rows((prev) => {
      const isDuplicate = prev.some(r =>
        makeRowKey({ ...r, source: "KEPATUHAN" }) === newRowKey
      );

      if (isDuplicate) {
        console.warn('[KEPATUHAN_addRow] DUPLICATE DETECTED! Row already exists:', newRowKey);
        alert('Data dengan kombinasi Year/Quarter/No/SubNo/Section/Indikator yang sama sudah ada!');
        return prev;
      }

      return [...prev, newRow];
    });

    // ✅ Hapus baris duplikat setKEPATUHAN_rows
    KEPATUHAN_resetForm();
    setShowKepatuhanForm(false);
  };

  const KEPATUHAN_startEdit = (row) => {
    if (!row) return;
    setShowKepatuhanForm(true);

    setKEPATUHAN_editingRow(row);

    setKEPATUHAN_form({
      ...row,
      mode: row.mode || "RASIO",
      formula: row.formula || "",
      isPercent: !!row.isPercent,
    });

    // Set raw inputs untuk flexible editing (support minus, thousand separators)
    setRawNumeratorInput(row.numeratorValue || "");
    setRawDenominatorInput(row.denominatorValue || "");

    setKEPATUHAN_sectionForm({
      id: "",
      no: row.no || "",
      bobotSection: row.bobotSection ?? 0,
      sectionLabel: row.sectionLabel || "",
    });
  };

  const KEPATUHAN_saveEdit = () => {
    if (!KEPATUHAN_editingRow) return;

    const baseRow = buildBaseRow();
    const rawHasil = computeKepatuhanHasil(baseRow);

    // ✅ TAMBAHKAN: Hitung peringkat fresh dari nilai terbaru
    const newPeringkat = calculatePeringkat(
      rawHasil,
      {
        low: baseRow.low || "",
        lowToModerate: baseRow.lowToModerate || "",
        moderate: baseRow.moderate || "",
        moderateToHigh: baseRow.moderateToHigh || "",
        high: baseRow.high || "",
      },
      baseRow.isPercent || false
    );

    const weightedAuto =
      typeof computeWeighted === "function"
        ? computeWeighted(
          baseRow.bobotSection,
          baseRow.bobotIndikator,
          newPeringkat
        )
        : computeWeightedLocal(
          baseRow.bobotSection,
          baseRow.bobotIndikator,
          newPeringkat
        );

    setKEPATUHAN_rows((prev) =>
      prev.map((r) =>
        r === KEPATUHAN_editingRow
          ? {
            ...baseRow,
            // ✅ PERTAHANKAN year dan quarter yang asli
            year: KEPATUHAN_editingRow.year,
            quarter: KEPATUHAN_editingRow.quarter,
            source: "KEPATUHAN",
            isFinal: true,
            inheritedFrom: null,
            inheritedAt: null,
            hasil: baseRow.mode === "TEKS" ? "" : (rawHasil === "" || rawHasil == null ? 0 : rawHasil),
            hasilText: baseRow.mode === "TEKS" ? (baseRow.hasilText || "") : "",
            peringkat: newPeringkat,  // ✅ TAMBAHKAN: Simpan peringkat yang fresh
            weighted: weightedAuto,
          }
          : r
      )
    );

    KEPATUHAN_resetForm();
    setShowKepatuhanForm(false);

  };

  const KEPATUHAN_removeRow = (row) => {
    if (!row) return;
    setKEPATUHAN_rows((arr) => arr.filter((r) => r !== row));
    if (KEPATUHAN_editingRow === row) KEPATUHAN_resetForm();
  };

  const KEPATUHAN_exportExcel = () =>
    exportInvestasiToExcel
      ? exportInvestasiToExcel(KEPATUHAN_filtered, viewYear, viewQuarter)
      : null;

  // ---------------------------------------------------------------------------
  //                              TAB K P M R
  // ---------------------------------------------------------------------------
  const loadKPMRRows = () => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(KPMR_KEPATUHAN_LS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn("Gagal parse KPMR Kepatuhan dari localStorage", e);
      return [];
    }
  };

  // Load aspects from localStorage
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

  // Load questions from localStorage
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

  // ============================================================
  // KPMR LOADING FUNCTIONS: Year-Level and Quarter-Level Separation
  // ============================================================

  // Load year-level definitions (aspek, section, level 1-5, evidence)
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

  // Load quarter-level scores (sectionSkor only, linked by definitionId)
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

  const [KPMR_rows, setKPMR_rows] = useState(loadKPMRRows);
  const [KPMR_aspects, setKPMR_aspects] = useState(loadKPMRAspects);
  const [KPMR_questions, setKPMR_questions] = useState(loadKPMRQuestions);

  // ============================================================
  // KPMR STATE VARIABLES: Year-Level and Quarter-Level Separation
  // ============================================================
  // Year-Level: Definitions contain aspek, section, level 1-5, evidence (shared across quarters)
  const [KPMR_definitions, setKPMR_definitions] = useState(loadKPMRDefinitions);
  // Quarter-Level: Scores contain only sectionSkor per quarter, linked by definitionId
  const [KPMR_scores, setKPMR_scores] = useState(loadKPMRScores);
  // Legacy: Keep old rows for backward compatibility
  const [showKPMRForm, setShowKPMRForm] = useState(false);

  // Save aspects to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(KPMR_ASPEK_LS, JSON.stringify(KPMR_aspects));
    } catch (e) {
      console.warn("Gagal simpan KPMR Aspek ke localStorage", e);
    }
  }, [KPMR_aspects]);

  // Save questions to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(KPMR_PERTANYAAN_LS, JSON.stringify(KPMR_questions));
    } catch (e) {
      console.warn("Gagal simpan KPMR Pertanyaan ke localStorage", e);
    }
  }, [KPMR_questions]);

  // ============================================================
  // KPMR PERSIST EFFECTS: Year-Level and Quarter-Level Separation
  // ============================================================

  // Persist year-level definitions
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(KPMR_DEFINITIONS_LS, JSON.stringify(KPMR_definitions));
    } catch (e) {
      console.warn("Gagal simpan KPMR Definitions ke localStorage", e);
    }
  }, [KPMR_definitions]);

  // Persist quarter-level scores
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(KPMR_SCORES_LS, JSON.stringify(KPMR_scores));

      // Dispatch event untuk trigger Rekap1 refresh
      window.dispatchEvent(new CustomEvent('kepatuhanKPMR:changed', {
        detail: { year: viewYear, quarter: viewQuarter }
      }));

    } catch (e) {
      console.warn("Gagal simpan KPMR Scores ke localStorage", e);
    }
  }, [KPMR_scores]); // Hanya depend pada KPMR_scores, bukan viewYear/viewQuarter

  // Legacy: Persist old combined rows (for backward compatibility)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(
        KPMR_KEPATUHAN_LS,
        JSON.stringify(KPMR_rows)
      );
    } catch (e) {
      console.warn("Gagal simpan KPMR Kepatuhan ke localStorage", e);
    }
  }, [KPMR_rows]);

  // ============================================================
  // FORM SYNC WITH VIEW CHANGES: YEAR-BASED ONLY
  // ============================================================
  // When viewYear changes, update form year
  // Quarter is NOT synced anymore - it's controlled by form's dropdown only
  useEffect(() => {
    setKPMR_form((f) => ({
      ...f,
      year: viewYear,
      // quarter is NOT updated - it's controlled by the form's dropdown
    }));
  }, [viewYear]);

  const [KPMR_form, setKPMR_form] = useState({
    ...KPMR_EMPTY_FORM,
    year: viewYear,
    quarter: "Q1", // Default to Q1, but user can change via dropdown
  });
  const [KPMR_editingIndex, setKPMR_editingIndex] = useState(null);
  const [KPMR_isAddingNewAspect, setKPMR_isAddingNewAspect] = useState(false);
  const [KPMR_isAddingNewQuestion, setKPMR_isAddingNewQuestion] = useState(false);

  // ===== Quarter Filter State for KPMR Table =====
  const QUARTER_ORDER = ["Q1", "Q2", "Q3", "Q4"];
  const QUARTER_LABEL = {
    Q1: "MAR",
    Q2: "JUN",
    Q3: "SEP",
    Q4: "DES",
  };
  const [selectedQuarters, setSelectedQuarters] = useState([]);

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

  // Handle aspect selection
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
        // Reset question form when aspect changes
        setKPMR_isAddingNewQuestion(false);
      }
    }
  };

  // Handle question selection
  // Handle question selection
  const handleQuestionChange = (value) => {
    if (value === "new") {
      setKPMR_isAddingNewQuestion(true);
      setKPMR_form(prev => ({
        ...prev,
        sectionNo: "",
        sectionTitle: "",
        // Reset level & evidence untuk pertanyaan baru
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
        // ✅ FIX: Load existing definition data (level & evidence) dari database
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
          // ✅ LOAD data level & evidence yang sudah ada (kalau ada)
          level1: existingDef?.level1 || "",
          level2: existingDef?.level2 || "",
          level3: existingDef?.level3 || "",
          level4: existingDef?.level4 || "",
          level5: existingDef?.level5 || "",
          evidence: existingDef?.evidence || "",
          // Reset skor (nanti user pilih quarter mana yang mau diisi)
          sectionSkor: "",
        }));
      }
    }
  };

  // Save new aspect when adding a KPMR row
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

  // Save new question when adding a KPMR row
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

  const KPMR_handleChange = (k, v) =>
    setKPMR_form((f) => ({ ...f, [k]: v }));

  // ============================================================
  // KPMR_filtered: YEAR-BASED Filtering (No Quarter Filter)
  // ============================================================
  // IMPORTANT: KPMR is YEAR-BASED, not quarter-based
  // - Rows are filtered by YEAR ONLY
  // - Quarter selector does NOT affect row visibility
  // - Quarter selector ONLY controls which score is being edited/viewed in the form
  const KPMR_filtered = useMemo(
    () => {
      // Get all definitions for the selected year (year-level data)
      const yearDefinitions = KPMR_definitions.filter(d => d.year === viewYear);

      // Join definitions with their scores to create flattened view for filtering
      const joined = yearDefinitions
        .map(def => {
          // Get all scores for this definition
          const defScores = KPMR_scores.filter(s =>
            s.definitionId === def.id &&
            s.year === viewYear
          );

          // Return combined data (one entry per quarter that has a score)
          return defScores.map(score => ({
            definitionId: def.id,
            year: def.year,
            quarter: score.quarter,
            aspekNo: def.aspekNo,
            aspekTitle: def.aspekTitle,
            aspekBobot: def.aspekBobot,
            sectionNo: def.sectionNo,
            sectionTitle: def.sectionTitle,
            sectionSkor: score.sectionSkor,
            // Year-Level: level1-5 and evidence for filtering
            level1: def.level1,
            level2: def.level2,
            level3: def.level3,
            level4: def.level4,
            level5: def.level5,
            evidence: def.evidence,
          }));
        })
        .flat();

      // Apply search filter (year-level fields only)
      return joined
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
    },
    [KPMR_definitions, KPMR_scores, viewYear, query]
  );

  // ============================================================
  // KPMR_groups: Join Definitions with Scores for Table Rendering
  // ============================================================
  // Groups data by aspect and section, with all quarters shown
  // Year-level data (level1-5, evidence) is stored once and referenced by all quarters
  //
  // CRITICAL: This function ensures scores appear in the correct table columns
  // - Scores are mapped by quarter: section.quarters["Q1"], section.quarters["Q2"], etc.
  // - When score.quarter = "Q3", it's mapped to section.quarters["Q3"]
  // - Table renders: q3Data.sectionSkor displays in "Skor Q3" column ✓
  const KPMR_groups = useMemo(() => {
    // Filter definitions for the selected year (YEAR-BASED, not quarter-based)
    const yearDefinitions = KPMR_definitions.filter(d => d.year === viewYear);

    // Group by aspect
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
          definitionId: def.id, // Store definitionId for year-level data access
          quarters: {} // Will be populated with scores: { "Q1": {...}, "Q2": {...}, "Q3": {...}, "Q4": {...} }
        });
      }

      // Find scores for this definition and add to quarters
      // This is where the quarter-based mapping happens
      const defScores = KPMR_scores.filter(s =>
        s.definitionId === def.id &&
        s.year === viewYear
      );

      for (const score of defScores) {
        // CRITICAL: Map score to its quarter key
        // score.quarter = "Q1" → section.quarters["Q1"] = { sectionSkor: ... }
        // score.quarter = "Q3" → section.quarters["Q3"] = { sectionSkor: ... }
        // This ensures the score appears in the correct table column
        aspectMap.get(aspectKey).sections.get(sectionKey).quarters[score.quarter] = {
          definitionId: def.id,
          year: def.year,
          quarter: score.quarter,
          sectionSkor: score.sectionSkor,
          // Include year-level data for each quarter (for rendering convenience)
          aspekNo: def.aspekNo,
          aspekTitle: def.aspekTitle,
          aspekBobot: def.aspekBobot,
          sectionNo: def.sectionNo,
          sectionTitle: def.sectionTitle,
          // Year-Level: level1-5 and evidence (same across all quarters)
          level1: def.level1,
          level2: def.level2,
          level3: def.level3,
          level4: def.level4,
          level5: def.level5,
          evidence: def.evidence,
        };
      }
    }

    // Convert to array for rendering
    return Array.from(aspectMap.values()).map(aspect => ({
      ...aspect,
      sections: Array.from(aspect.sections.values())
    }));
  }, [KPMR_definitions, KPMR_scores, viewYear]);

  // ============================================================
  // NOTE: KPMR_averageByQuarter removed
  // ============================================================
  // Average is now calculated IN THE FORM (per-quarter basis)
  // The form has its own quarter dropdown for avg calculation
  // No global average display since quarter selector was removed from header

  // ============================================================
  // KPMR_resetForm: Reset Form to Initial State
  // ============================================================
  const KPMR_resetForm = () =>
    setKPMR_form((prev) => ({
      ...KPMR_EMPTY_FORM,
      year: viewYear,
      quarter: "Q1", // Default to Q1, user can change via dropdown
      aspekNo: prev.aspekNo,
      aspekTitle: prev.aspekTitle,
      aspekBobot: prev.aspekBobot,
    }));

  const KPMR_addRow = () => {
    // Save new aspect and question if needed
    saveNewAspectIfNeeded();
    saveNewQuestionIfNeeded();

    // ------------------------------------------------------------
    // STEP 1: Handle Year-Level Definition (aspek, section, level 1-5, evidence)
    // ------------------------------------------------------------
    // ✅ FIX: Cari definition yang sudah ada berdasarkan year + aspekNo + sectionNo
    // Kalau sudah ada, UPDATE level & evidence-nya
    // Kalau belum ada, CREATE definition baru
    const existingDefIndex = KPMR_definitions.findIndex(d =>
      d.year === KPMR_form.year &&
      d.aspekNo === KPMR_form.aspekNo &&
      d.sectionNo === KPMR_form.sectionNo
    );

    let definitionId;

    if (existingDefIndex >= 0) {
      // ✅ UPDATE existing definition: PRESERVE data yang sudah ada
      definitionId = KPMR_definitions[existingDefIndex].id;
      setKPMR_definitions(prev => {
        const updated = [...prev];
        updated[existingDefIndex] = {
          ...updated[existingDefIndex],
          // Update metadata (bisa berubah)
          aspekTitle: KPMR_form.aspekTitle,
          aspekBobot: KPMR_form.aspekBobot,
          sectionTitle: KPMR_form.sectionTitle,
          // ✅ CRITICAL FIX: Preserve existing level & evidence jika form kosong
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
      // ✅ CREATE new definition for this year
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
      // UPDATE existing score for this quarter
      setKPMR_scores(prev => {
        const updated = [...prev];
        updated[existingScoreIndex] = {
          ...updated[existingScoreIndex],
          sectionSkor: KPMR_form.sectionSkor,
        };
        return updated;
      });
    } else {
      // CREATE new score for this quarter
      // This score will appear in the table column corresponding to its quarter
      const newScore = {
        id: `score-${Date.now()}`,
        definitionId: definitionId,
        year: KPMR_form.year,
        quarter: KPMR_form.quarter, // "Q1", "Q2", "Q3", or "Q4" from form dropdown
        // Quarter-Level: Only sectionSkor varies per quarter
        sectionSkor: KPMR_form.sectionSkor,
      };
      setKPMR_scores(prev => [...prev, newScore]);
    }

    // Reset and close form
    setKPMR_editingIndex(null);
    KPMR_resetForm();
    setShowKPMRForm(false);
    setKPMR_isAddingNewAspect(false);
    setKPMR_isAddingNewQuestion(false);
  };

  const KPMR_startEdit = (target) => {
    const { definitionId, year, quarter } = target;

    // Load YEAR-LEVEL data from definitions
    const definition = KPMR_definitions.find(d => d.id === definitionId);

    // Load QUARTER-LEVEL score from scores
    const score = KPMR_scores.find(s =>
      s.definitionId === definitionId &&
      s.year === year &&
      s.quarter === quarter
    );

    // Populate form with both year-level and quarter-level data
    setKPMR_form({
      ...KPMR_EMPTY_FORM,
      year,
      quarter,
      // Year-Level from definition
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
      // Quarter-Level from score
      sectionSkor: score?.sectionSkor || "",
    });

    setShowKPMRForm(true);
    setKPMR_isAddingNewAspect(false);
    setKPMR_isAddingNewQuestion(false);
  };

  const KPMR_saveEdit = () => {
    // ============================================================
    // KPMR_saveEdit: YEAR-BASED Form Handling
    // ============================================================
    // Find the definition being edited (from form's current year/section data)
    const definition = KPMR_definitions.find(d =>
      d.year === KPMR_form.year &&
      d.aspekNo === KPMR_form.aspekNo &&
      d.sectionNo === KPMR_form.sectionNo &&
      d.sectionTitle === KPMR_form.sectionTitle
    );

    if (!definition) return;

    // ------------------------------------------------------------
    // STEP 1: Update Year-Level Definition
    // ------------------------------------------------------------
    setKPMR_definitions(prev => {
      const index = prev.findIndex(d => d.id === definition.id);
      if (index === -1) return prev;

      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        aspekTitle: KPMR_form.aspekTitle,
        aspekBobot: KPMR_form.aspekBobot,
        sectionTitle: KPMR_form.sectionTitle,
        // ✅ FIX: Preserve ALL level & evidence jika form kosong
        level1: KPMR_form.level1 || updated[index].level1 || "",
        level2: KPMR_form.level2 || updated[index].level2 || "",
        level3: KPMR_form.level3 || updated[index].level3 || "",
        level4: KPMR_form.level4 || updated[index].level4 || "",
        level5: KPMR_form.level5 || updated[index].level5 || "",
        evidence: KPMR_form.evidence || updated[index].evidence || "",
      };
      return updated;
    });

    // ------------------------------------------------------------
    // STEP 2: Update or Create Quarter-Level Score
    // ------------------------------------------------------------
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
    // ============================================================
    // KPMR_removeRow: Remove Score and Optionally Definition
    // ============================================================
    const { definitionId, year, quarter } = target;

    // Remove ONLY the selected quarter's score
    setKPMR_scores(prev =>
      prev.filter(s =>
        !(
          s.definitionId === definitionId &&
          s.year === year &&
          s.quarter === quarter
        )
      )
    );

    // Check if any scores remain for this definition in the same year
    const remainingScores = KPMR_scores.filter(s =>
      s.definitionId === definitionId &&
      s.year === year
    );

    // If no scores remain, remove the definition too
    if (remainingScores.length === 0) {
      setKPMR_definitions(prev =>
        prev.filter(d => d.id !== definitionId)
      );
    }

    // Reset form if it was open
    setShowKPMRForm(false);
    setKPMR_editingIndex(null);
    KPMR_resetForm();
    setKPMR_isAddingNewAspect(false);
    setKPMR_isAddingNewQuestion(false);
  };

  // ============================================================
  // KPMR_exportExcel: Export Data for Selected Year
  // ============================================================
  // Export all data for the selected year (all quarters)
  // No quarter filter since KPMR is YEAR-BASED
  const KPMR_exportExcel = () =>
    exportKPMRInvestasiToExcel({
      year: viewYear,
      quarter: undefined, // No quarter filter - export all quarters
      rows: KPMR_filtered,
    });


  // ================================ RENDER ===================================
  return (
    // 1. WRAPPER UTAMA: Menggunakan min-h-screen seperti Pasar.jsx
    <div className="p-6 bg-[#f3f6f8] min-h-screen">

      {/* HERO / TITLE */}
      <div
        className={`relative rounded-2xl overflow-hidden mb-6 shadow-sm ${PNM_BRAND.gradient}`}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_0%,white,transparent_40%),radial-gradient(circle_at_80%_100%,white,transparent_35%)]" />
        <div className="relative px-6 py-7 sm:px-8 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
            Risk Form – Kepatuhan
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
            onClick={() => setActiveTab("kepatuhan")}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "kepatuhan"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
              }`}
          >
            Kepatuhan
          </button>

          <button
            onClick={() => setActiveTab("kpmr")}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "kpmr"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
              }`}
          >
            KPMR Kepatuhan
          </button>
        </nav>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        {/* ================= TAB: KEPATUHAN ================= */}
        {activeTab === "kepatuhan" && (
          <>
            <header className="px-4 py-4 flex items-center justify-between gap-3">
              <h2 className="text-xl sm:text-2xl font-semibold">
                Form – Kepatuhan
              </h2>
              <div className="flex items-end gap-4">
                {/* tahun + triwulan */}
                <div className="hidden md:flex items-end gap-4">
                  <div className="flex flex-col gap-1">
                    <YearInput
                      value={viewYear}
                      onChange={(v) => {
                        setViewYear(v);
                        setKEPATUHAN_form((f) => ({ ...f, year: v }));
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <QuarterSelect
                      value={viewQuarter}
                      onChange={(v) => {
                        setViewQuarter(v);
                        setKEPATUHAN_form((f) => ({ ...f, quarter: v }));
                      }}
                    />
                  </div>
                </div>

                {/* search + export */}
                <div className="flex items-end gap-2">
                  {/* Button Tambah Data */}
                  <button
                    onClick={() => setShowKepatuhanForm(true)}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 font-semibold"
                  >
                    + Tambah Data
                  </button>

                  <button
                    onClick={KEPATUHAN_exportExcel}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border bg-gray-900 text-white hover:bg-black"
                  >
                    <Download size={18} /> Export {viewYear}-{viewQuarter}
                  </button>
                </div>
              </div>
            </header>

            {/* ===== INHERITANCE NOTIFICATION BANNER ===== */}
            {inheritInfo && (
              <div className="mb-4 rounded-lg bg-yellow-50 border border-yellow-300 px-4 py-3 text-sm flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <strong>Data Di-clone Otomatis</strong>
                  </div>
                  <p className="text-gray-700">
                    Data untuk <strong>{viewYear}-{viewQuarter}</strong> telah di-clone otomatis dari{" "}
                    <strong>{inheritInfo.from}</strong> ({inheritInfo.count} baris data).
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Baris dengan badge <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">Di-clone</span> adalah hasil clone.
                  </p>
                </div>
                <button
                  onClick={handleUndoInheritance}
                  className="px-3 py-1.5 rounded border bg-white hover:bg-gray-50 text-sm font-medium whitespace-nowrap shadow-sm"
                >
                  Undo Clone
                </button>
              </div>
            )}

            {/* ===== FORM SECTION + INDIKATOR ===== */}
            {showKepatuhanForm && (
              <div className="relative rounded-2xl overflow-hidden mb-6 shadow-sm bg-gradient-to-r from-[#0076C6]/90 via-[#00A3DA]/90 to-[#33C2B5]/90">
                {/* SECTION HEADER */}
                <div className="rounded-2xl border-2 border-gray-300 p-4 shadow-sm mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-white font-semibold text-lg sm:text-xl">
                      Form Section – Kepatuhan
                    </h2>

                    <button
                      onClick={() => setShowKepatuhanForm(false)}
                      className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold"
                      title="Tutup Form"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex items-end gap-4 mb-4">
                    {/* No Sec */}
                    <div className="flex flex-col">
                      <label className="text-xs text-white font-medium mb-1">
                        No Sec
                      </label>
                      <input
                        disabled={!isAddingNewSection && !isEditingSection}
                        className="w-20 h-10 px-3 rounded-lg border-2 border-gray-300 text-center font-medium bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                        value={KEPATUHAN_sectionForm.no}
                        onChange={(e) =>
                          setKEPATUHAN_sectionForm((f) => ({
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
                        disabled={!isAddingNewSection && !isEditingSection}
                        type="number"
                        className="w-28 h-10 px-3 rounded-lg border-2 border-gray-300 text-center font-medium bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                        value={KEPATUHAN_sectionForm.bobotSection ?? ""}
                        onChange={(e) =>
                          setKEPATUHAN_sectionForm((f) => ({
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
                        disabled={!isAddingNewSection && !isEditingSection}
                        className="w-full h-10 px-4 rounded-lg border-2 border-gray-300 font-medium bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                        value={KEPATUHAN_sectionForm.sectionLabel}
                        onChange={(e) =>
                          setKEPATUHAN_sectionForm((f) => ({
                            ...f,
                            sectionLabel: e.target.value,
                          }))
                        }
                        placeholder="Uraian section risiko kepatuhan"
                      />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 self-end">
                      {isAddingNewSection || isEditingSection ? (
                        <>
                          <button
                            className="w-10 h-10 rounded-lg bg-green-500 hover:bg-green-600 text-white flex items-center justify-center"
                            onClick={KEPATUHAN_addSection}
                            title="Simpan Section"
                          >
                            <Plus size={20} />
                          </button>
                          <button
                            className="w-10 h-10 rounded-lg bg-gray-400 hover:bg-gray-500 text-white flex items-center justify-center"
                            onClick={() => {
                              setIsAddingNewSection(false);
                              setIsEditingSection(false);
                              setKEPATUHAN_sectionForm({
                                id: "",
                                no: "",
                                bobotSection: 0,
                                sectionLabel: "",
                              });
                            }}
                            title="Batal"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="w-10 h-10 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white flex items-center justify-center"
                            onClick={() => setIsEditingSection(true)}
                            title="Edit Section"
                            disabled={!KEPATUHAN_sectionForm.id}
                          >
                            <Edit3 size={20} />
                          </button>
                          <button
                            className="w-10 h-10 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
                            onClick={() =>
                              KEPATUHAN_sectionForm.id &&
                              KEPATUHAN_removeSection(KEPATUHAN_sectionForm.id)
                            }
                            title="Hapus Section"
                            disabled={!KEPATUHAN_sectionForm.id}
                          >
                            <Trash2 size={20} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Dropdown daftar section */}
                  <div className="relative">
                    <label className="text-xs text-white font-medium mb-1 block">
                      Section
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 font-medium appearance-none bg-white cursor-pointer pr-10"
                      value={isAddingNewSection ? "ADD_NEW_SECTION" : (KEPATUHAN_sectionForm.id || "")}
                      onChange={(e) => {
                        const val = e.target.value;

                        if (val === "ADD_NEW_SECTION") {
                          setIsAddingNewSection(true);
                          setIsEditingSection(true);
                          setKEPATUHAN_sectionForm({
                            id: "",
                            no: "",
                            bobotSection: 0,
                            sectionLabel: "",
                          });
                          return;
                        }

                        if (val) {
                          setIsAddingNewSection(false);
                          setIsEditingSection(false);
                          KEPATUHAN_selectSection(val);
                        }
                      }}
                    >
                      <option value="">-- Pilih Section --</option>
                      {currentPeriodSections.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.no} - {s.parameter}
                          {isInheritedSection(s) && ' 🔄'}
                          {s.isVirtual && ' (Virtual)'}
                        </option>
                      ))}
                      <option value="ADD_NEW_SECTION" style={{ color: '#0068B3', fontWeight: '600' }}>
                        + Tambah Section Baru
                      </option>
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
                    <div className="col-span-2">
                      <label className="text-sm font-medium mb-2 block text-white">
                        Sub No
                      </label>
                      <input
                        className="w-full rounded-lg border-2 border-gray-300 px-3 py-3 text-sm bg-white"
                        value={KEPATUHAN_form.subNo}
                        onChange={(e) =>
                          setKEPATUHAN_form((f) => ({ ...f, subNo: e.target.value }))
                        }
                        placeholder="1.1"
                      />
                    </div>
                    <div className="col-span-7">
                      <label className="text-sm font-medium mb-2 block text-white">
                        Indikator
                      </label>
                      <input
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                        value={KEPATUHAN_form.indikator}
                        onChange={(e) =>
                          setKEPATUHAN_form((f) => ({
                            ...f,
                            indikator: e.target.value,
                          }))
                        }
                        placeholder="Nama indikator kepatuhan…"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="text-sm font-medium mb-2 block text-white">
                        Bobot Indikator (%)
                      </label>
                      <input
                        type="number"
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm text-right bg-white"
                        value={KEPATUHAN_form.bobotIndikator ?? ""}
                        onChange={(e) =>
                          setKEPATUHAN_form((f) => ({
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
                        value={KEPATUHAN_form.mode || "RASIO"}
                        onChange={(e) => {
                          const v = e.target.value;
                          setKEPATUHAN_form((f) => ({
                            ...f,
                            mode: v,
                            ...(v === "NILAI_TUNGGAL" || v === "TEKS"
                              ? { numeratorLabel: "", numeratorValue: "" }
                              : {}),
                            ...(v === "TEKS"
                              ? {
                                denominatorLabel: "",
                                denominatorValue: "",
                                formula: "",
                                isPercent: false,
                                hasil: ""
                              }
                              : {}),
                          }));
                        }}
                      >
                        <option value="RASIO">Rasio (Pembilang / Penyebut)</option>
                        <option value="NILAI_TUNGGAL">
                          Nilai tunggal (hanya penyebut)
                        </option>
                        <option value="TEKS">
                          Kualitatif (hasil berupa teks)
                        </option>
                      </select>
                    </div>

                    <div className="col-span-8">
                      {KEPATUHAN_form.mode === "TEKS" ? (
                        <>
                          <label className="text-sm font-medium mb-2 block text-white">
                            Hasil (Teks) – akan muncul di kolom "Hasil"
                          </label>
                          <input
                            className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                            value={KEPATUHAN_form.hasilText || ""}
                            onChange={(e) =>
                              setKEPATUHAN_form((f) => ({
                                ...f,
                                hasilText: e.target.value,
                              }))
                            }
                            placeholder="Contoh: sedang, 100, baik, 50, dll (bisa teks atau angka)"
                          />
                        </>
                      ) : (
                        <>
                          <label className="text-sm font-medium mb-2 block text-white">
                            Rumus perhitungan (opsional — kosong = pakai default)
                          </label>
                          <div className="flex items-center gap-4">
                            <input
                              type="text"
                              className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                              placeholder={
                                KEPATUHAN_form.mode === "RASIO"
                                  ? "Contoh default: pemb / peny — atau rumus custom (pemb, peny)"
                                  : "Contoh default: peny — atau rumus custom (peny / 1000)"
                              }
                              value={KEPATUHAN_form.formula || ""}
                              onChange={(e) =>
                                setKEPATUHAN_form((f) => ({
                                  ...f,
                                  formula: e.target.value,
                                }))
                              }
                            />

                            <label className="flex items-center gap-2 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={KEPATUHAN_form.isPercent || false}
                                onChange={(e) =>
                                  setKEPATUHAN_form((f) => ({
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
                        </>
                      )}
                    </div>
                  </div>

                  {/* Faktor Pembilang (hanya RASIO) */}
                  {KEPATUHAN_form.mode === "RASIO" && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block text-white">
                          Faktor Pembilang
                        </label>
                        <input
                          className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                          value={KEPATUHAN_form.numeratorLabel}
                          onChange={(e) =>
                            setKEPATUHAN_form((f) => ({
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
                          value={rawNumeratorInput}
                          onChange={(e) => {
                            const val = e.target.value;
                            setRawNumeratorInput(val);
                            setKEPATUHAN_form((f) => ({
                              ...f,
                              numeratorValue: val,
                            }));
                          }}
                          onBlur={(e) => {
                            const val = e.target.value;
                            // Jangan format jika user masih mengetik (trailing separator)
                            if (!val || val.endsWith(',') || val.endsWith('.') || val === '-') {
                              return;
                            }
                            // Format hanya angka yang sudah "complete"
                            const formatted = fmtNumberSmart(val);
                            if (formatted && formatted !== val) {
                              setRawNumeratorInput(formatted);
                              setKEPATUHAN_form(f => ({...f, numeratorValue: formatted}));
                            }
                          }}
                          placeholder="Contoh: -1000, 1.000, 1.000,50, 10%"
                        />
                      </div>
                    </div>
                  )}

                  {/* Faktor Penyebut (non TEKS) */}
                  {KEPATUHAN_form.mode !== "TEKS" && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block text-white">
                          Faktor Penyebut
                        </label>
                        <input
                          className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                          value={KEPATUHAN_form.denominatorLabel}
                          onChange={(e) =>
                            setKEPATUHAN_form((f) => ({
                              ...f,
                              denominatorLabel: e.target.value,
                            }))
                          }
                          placeholder={
                            KEPATUHAN_form.mode === "RASIO"
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
                          value={rawDenominatorInput}
                          onChange={(e) => {
                            const val = e.target.value;
                            setRawDenominatorInput(val);
                            setKEPATUHAN_form((f) => ({
                              ...f,
                              denominatorValue: val,
                            }));
                          }}
                          onBlur={(e) => {
                            const val = e.target.value;
                            // Jangan format jika user masih mengetik (trailing separator)
                            if (!val || val.endsWith(',') || val.endsWith('.') || val === '-') {
                              return;
                            }
                            // Format hanya angka yang sudah "complete"
                            const formatted = fmtNumberSmart(val);
                            if (formatted && formatted !== val) {
                              setRawDenominatorInput(formatted);
                              setKEPATUHAN_form(f => ({...f, denominatorValue: formatted}));
                            }
                          }}
                          placeholder={KEPATUHAN_form.mode === "RASIO" ? "Contoh: -1000, 1.000, 1.000,50, 10%" : "Contoh: -1000, 1.000, 1.000,50, 10%"}
                        />
                      </div>
                    </div>
                  )}

                  {/* Sumber Risiko, Dampak, Peringkat + Risk Levels */}
                  <div className="mt-6 rounded-2xl border-2 border-white/70 bg-white/5 p-4">
                    <div className="grid grid-cols-12 gap-4">
                      {/* KIRI: sumber risiko, dampak, peringkat/weighted/preview */}
                      <div className="col-span-6 space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block text-white">
                            Sumber Risiko
                          </label>
                          <textarea
                            rows={4}
                            className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm resize-none bg-white"
                            value={KEPATUHAN_form.sumberRisiko}
                            onChange={(e) =>
                              setKEPATUHAN_form((f) => ({
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
                            value={KEPATUHAN_form.dampak}
                            onChange={(e) =>
                              setKEPATUHAN_form((f) => ({ ...f, dampak: e.target.value }))
                            }
                            placeholder="Contoh: kerugian finansial, penurunan layanan, risiko hukum, dsb."
                          />
                        </div>

                        {/* baris: Peringkat, Weighted, Preview value */}
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block text-white">
                              Peringkat (Auto)
                            </label>
                            <input
                              type="number"
                              className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-gray-100 font-bold text-center"
                              value={KEPATUHAN_form.peringkat ?? ""}
                              readOnly
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium mb-2 block text-white">
                              Weighted (auto)
                            </label>
                            <input
                              className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-gray-50"
                              value={(() => {
                                const peringkatNum =
                                  KEPATUHAN_form.peringkat === "" ||
                                    KEPATUHAN_form.peringkat == null
                                    ? 0
                                    : Number(KEPATUHAN_form.peringkat);

                                const bobotSecNum = Number(KEPATUHAN_sectionForm.bobotSection || 0);
                                const bobotIndNum = Number(KEPATUHAN_form.bobotIndikator || 0);

                                const res =
                                  typeof computeWeighted === "function"
                                    ? computeWeighted(bobotSecNum, bobotIndNum, peringkatNum)
                                    : computeWeightedLocal(bobotSecNum, bobotIndNum, peringkatNum);

                                const num = Number(res);
                                if (!isFinite(num) || isNaN(num)) return "";
                                return num.toFixed(2);
                              })()}
                              readOnly
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium mb-2 block text-white">
                              Hasil Preview (Rasio)
                            </label>
                            <input
                              className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-gray-50"
                              value={(() => {
                                if (KEPATUHAN_form.mode === "TEKS") {
                                  return KEPATUHAN_form.hasilText || "";
                                }
                                const raw = computeKepatuhanHasil(buildBaseRow());
                                if (raw === "" || raw == null) return "";
                                if (KEPATUHAN_form.isPercent) {
                                  const pct = Number(raw) * 100;
                                  if (!isFinite(pct) || isNaN(pct)) return "";
                                  return `${pct.toFixed(2)}%`;
                                }
                                if (KEPATUHAN_form.mode === "NILAI_TUNGGAL") {
                                  return fmtNumber(raw);
                                }
                                return Number(raw).toFixed(4);
                              })()}
                              readOnly
                            />
                          </div>
                        </div>

                        {/* KETERANGAN - MASUK KE DALAM WRAPPER, SISI KIRI */}
                        <div>
                          <label className="text-sm font-medium mb-2 block text-white">
                            Keterangan
                          </label>
                          <textarea
                            rows={3}
                            className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white"
                            value={KEPATUHAN_form.keterangan}
                            onChange={(e) =>
                              setKEPATUHAN_form((f) => ({
                                ...f,
                                keterangan: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>  {/* tutup col-span-6 KIRI */}

                      {/* KANAN: Risk level (Low s/d High) vertikal */}
                      <div className="col-span-6 grid grid-cols-1 gap-3 items-stretch">
                        <RiskField
                          className="w-full"
                          label="Low"
                          value={KEPATUHAN_form.low}
                          onChange={(v) =>
                            setKEPATUHAN_form((f) => ({
                              ...f,
                              low: v,
                            }))
                          }
                          color="#4A5A2C"
                          textColor="#ffffff"
                          placeholder={KEPATUHAN_form.mode === "TEKS" ? "Contoh: Baik, Aman, Tes" : "x ≤ 1%"}
                        />

                        <RiskField
                          className="w-full"
                          label="Low to Moderate"
                          value={KEPATUHAN_form.lowToModerate}
                          onChange={(v) =>
                            setKEPATUHAN_form((f) => ({
                              ...f,
                              lowToModerate: v,
                            }))
                          }
                          color="#A6D86C"
                          textColor="#0B2545"
                          placeholder={KEPATUHAN_form.mode === "TEKS" ? "Contoh: Cukup Baik" : "1% < x ≤ 2%"}
                        />

                        <RiskField
                          className="w-full"
                          label="Moderate"
                          value={KEPATUHAN_form.moderate}
                          onChange={(v) =>
                            setKEPATUHAN_form((f) => ({
                              ...f,
                              moderate: v,
                            }))
                          }
                          color="#FFFF00"
                          textColor="#4B3A00"
                          placeholder={KEPATUHAN_form.mode === "TEKS" ? "Contoh: Sedang, Normal" : "2% < x ≤ 3%"}
                        />

                        <RiskField
                          className="w-full"
                          label="Moderate to High"
                          value={KEPATUHAN_form.moderateToHigh}
                          onChange={(v) =>
                            setKEPATUHAN_form((f) => ({
                              ...f,
                              moderateToHigh: v,
                            }))
                          }
                          color="#FAD2A7"
                          textColor="#5A2E00"
                          placeholder={KEPATUHAN_form.mode === "TEKS" ? "Contoh: Cukup Tinggi" : "3% < x ≤ 4%"}
                        />

                        <RiskField
                          className="w-full"
                          label="High"
                          value={KEPATUHAN_form.high}
                          onChange={(v) =>
                            setKEPATUHAN_form((f) => ({
                              ...f,
                              high: v,
                            }))
                          }
                          color="#E57373"
                          textColor="#FFFFFF"
                          placeholder={KEPATUHAN_form.mode === "TEKS" ? "Contoh: Buruk, Berbahaya, Tinggi" : "x > 4%"}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tombol Tambah / Simpan */}
                  <div className="mt-6 flex justify-end">
                    {!KEPATUHAN_editingRow ? (
                      <button
                        onClick={KEPATUHAN_addRow}
                        className="px-8 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold"
                      >
                        + Tambah
                      </button>
                    ) : (
                      <div className="flex gap-3">
                        <button
                          onClick={KEPATUHAN_saveEdit}
                          className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                        >
                          Simpan
                        </button>
                        <button
                          onClick={KEPATUHAN_resetForm}
                          className="px-8 py-3 rounded-lg border-2 border-gray-300 hover:bg-gray-50 font-semibold"
                        >
                          Batal
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 2. AREA TABEL: MENGGUNAKAN POLA PASAR.JSX */}
            <section className="mt-4">
              <div className="bg-white rounded-2xl shadow overflow-hidden border border-gray-200">

                {/* KEY LOGIC: Fixed Height 350px, scroll hanya di sini */}
                <div className="relative h-[350px]">
                  <div className="absolute inset-0 overflow-x-auto overflow-y-auto">
                    <DataTable
                      rows={KEPATUHAN_filtered}
                      totalWeighted={KEPATUHAN_totalWeighted}
                      viewYear={viewYear}
                      viewQuarter={viewQuarter}
                      startEdit={KEPATUHAN_startEdit}
                      removeRow={KEPATUHAN_removeRow}
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
                <h1 className="text-2xl font-bold">KPMR – Kepatuhan</h1>

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

                  {/* ============================================================
                      HEADER FILTER: YEAR-BASED ONLY
                  ============================================================ */}
                  {/* IMPORTANT: KPMR is YEAR-BASED
                      - Quarter selector REMOVED from header
                      - Quarter selection belongs ONLY in the form (for score input)
                      - Quarter does NOT filter data at page level
                  */}

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

                  {/* Button Tambah Data */}
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

            {/* FORM KPMR */}
            {showKPMRForm && (
              <section
                className={`rounded-2xl border shadow p-4 ${PNM_BRAND.gradient} text-white`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold drop-shadow">
                    Form KPMR – Kepatuhan
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
                  {/* kiri */}
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

                        {/* ============================================================
                            SCORE INPUT: Quarter Dropdown + Score Field
                        ============================================================ */}
                        {/* IMPORTANT: KPMR is YEAR-BASED
                            - Quarter dropdown selects which quarter's score is being edited
                            - Changing quarter does NOT affect year-level fields (aspek, section, level, evidence)
                            - Score is saved per quarter: (year + definitionId + quarter)
                            - When Q3 is selected and saved, it MUST appear in "Skor Q3" column
                        */}
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

                                // Cari definition (data year-level)
                                const def = KPMR_definitions.find(d =>
                                  d.year === KPMR_form.year &&
                                  d.aspekNo === KPMR_form.aspekNo &&
                                  d.sectionNo === KPMR_form.sectionNo &&
                                  d.sectionTitle === KPMR_form.sectionTitle
                                );

                                if (def) {
                                  // Cari skor untuk quarter baru
                                  const score = KPMR_scores.find(s =>
                                    s.definitionId === def.id &&
                                    s.year === KPMR_form.year &&
                                    s.quarter === selectedQuarter
                                  );

                                  // ✅ UPDATE form: prioritas dari def, baru dari prev
                                  setKPMR_form(prev => ({
                                    ...prev,
                                    quarter: selectedQuarter,
                                    sectionSkor: score?.sectionSkor || "",
                                    // ✅ PRIORITAS: Load dari definition dulu, baru dari prev
                                    level1: def.level1 || prev.level1 || "",
                                    level2: def.level2 || prev.level2 || "",
                                    level3: def.level3 || prev.level3 || "",
                                    level4: def.level4 || prev.level4 || "",
                                    level5: def.level5 || prev.level5 || "",
                                    evidence: def.evidence || prev.evidence || "",
                                  }));
                                } else {
                                  // Kalau belum ada definition, cuma ganti quarter & reset skor
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

                        {/* ============================================================
                            AVERAGE SCORE: PER-QUARTER (NOT YEARLY)
                        ============================================================ */}
                        {/* IMPORTANT: Avg is PER-QUARTER, not yearly average
                            - Avg Q1 = average of ALL Q1 scores in current year
                            - Avg Q2 = average of ALL Q2 scores in current year
                            - Avg field has its own quarter dropdown
                            - Avg changes when quarter dropdown changes
                        */}
                        <div className="grid grid-cols-2 gap-3">
                          <label className="block">
                            <div className="mb-1 text-[13px] text-white/90 font-medium">
                              Pilih Triwulan (Avg)
                            </div>
                            <select
                              className="w-full rounded-xl px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/40"
                              value={KPMR_form.quarter}
                              onChange={(e) => {
                                // Just update a local state for avg display, not form.quarter
                                // We'll use form.quarter for simplicity
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
                                // ============================================================
                                // PER-QUARTER AVERAGE CALCULATION
                                // ============================================================
                                // Avg is calculated for the SELECTED quarter only
                                // Avg Q1 = average of ALL Q1 scores in current year (for current aspek)
                                // Avg Q2 = average of ALL Q2 scores in current year (for current aspek)

                                // Get all scores for the selected quarter in the current year
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

                    {/* ============================================================
                        YEAR-LEVEL FIELDS INFO: Shared Across All Quarters
                    ============================================================ */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="text-xs text-blue-800 font-medium mb-2">
                        ℹ️ <strong>KPMR BERDASARKAN TAHUN</strong>
                      </div>
                      <div className="text-xs text-blue-700 space-y-1">
                        <div>• <strong>Year-Level</strong> (Disimpan sekali untuk {viewYear}): Aspek, Section, Level 1-5, Evidence</div>
                        <div>• <strong>Quarter-Level</strong> (Disimpan per triwulan): Skor saja</div>
                        <div>• <strong>Pilih Triwulan</strong> di dropdown untuk mengisi skor triwulan tersebut</div>
                        <div className="text-blue-600 italic mt-1">Level & Evidence otomatis berlaku untuk Q1, Q2, Q3, Q4 di tahun {viewYear}</div>

                        {/* ✅ Status: Apakah data level & evidence sudah ada? */}
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

            {/* tabel hasil KPMR */}
            <section className="bg-white rounded-2xl shadow overflow-hidden">
              <div className="px-4 py-3 bg-gray-100 border-b">
                <div className="font-semibold">
                  Data KPMR – Kepatuhan ({viewYear}{" "}
                  {selectedQuarters.length > 0
                    ? `- Triwulan: ${selectedQuarters.join(", ")}`
                    : "- Semua Triwulan"})
                </div>
              </div>

              {/* Filter Triwulan KPMR */}
              <div className="px-4 mt-4 mb-4">
                <div className="
                  relative
                  rounded-2xl
                  bg-white/75
                  backdrop-blur-md
                  border border-white/40
                  shadow-[0_10px_28px_rgba(0,0,0,0.10)]
                  p-5
                  max-w-2xl
                ">
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
                          className="
                            flex items-center gap-3
                            text-sm font-medium text-gray-800
                            cursor-pointer
                            select-none
                          "
                        >
                          <span
                            className={`
                              w-5 h-5
                              rounded-full
                              border-2
                              flex items-center justify-center
                              transition-all
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

              <div className="relative h-[420px]">
                <div className="absolute inset-0 overflow-x-auto overflow-y-auto">
                  <table className="min-w-[1600px] text-sm border border-gray-300 border-collapse">
                    <thead>
                      <tr className="bg-[#1f4e79] text-white">
                        {/* kiri */}
                        <th className="border px-3 py-2 text-left" colSpan={2} rowSpan={2}>
                          KUALITAS PENERAPAN MANAJEMEN RISIKO
                        </th>

                        {/* skor per quarter — filtered by selection */}
                        {QUARTER_ORDER.filter((q) => shouldShowQuarter(q)).map((q) => (
                          <th
                            key={q}
                            className="border px-3 py-2 text-center w-20"
                            rowSpan={2}
                          >
                            {QUARTER_LABEL[q]} ({q})
                          </th>
                        ))}

                        {/* level */}
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

                      {/* BARIS KE-2 TIDAK BOLEH ADA SEL TAMBAHAN */}
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
                          // Calculate aspect averages per quarter
                          const calculateAspectAvg = (quarter) => {
                            const allSectionScores = g.sections
                              .map(section => section.quarters[quarter])
                              .filter(data => data && data.sectionSkor !== "" && data.sectionSkor != null)
                              .map(data => Number(data.sectionSkor));

                            return allSectionScores.length
                              ? (allSectionScores.reduce((a, b) => a + b, 0) / allSectionScores.length).toFixed(2)
                              : "-";
                          };

                          // Calculate all aspect averages
                          const quarterAspectAverages = {
                            Q1: calculateAspectAvg("Q1"),
                            Q2: calculateAspectAvg("Q2"),
                            Q3: calculateAspectAvg("Q3"),
                            Q4: calculateAspectAvg("Q4"),
                          };

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
                                {/* Aspect averages - filtered by selection */}
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

                              {/* baris section */}
                              {g.sections.map((section, idx) => {
                                // ============================================================
                                // TABLE RENDERING: Display Year-Level and Quarter-Level Data
                                // ============================================================
                                // IMPORTANT: KPMR is YEAR-BASED
                                // - Rows appear based on YEAR ONLY (not quarter)
                                // - Quarter selector does NOT affect row visibility
                                // - Level/Evidence are year-level (shared across all quarters)
                                //
                                // CRITICAL: Score column mapping
                                // - section.quarters["Q1"] contains score for Q1
                                // - section.quarters["Q2"] contains score for Q2
                                // - section.quarters["Q3"] contains score for Q3
                                // - section.quarters["Q4"] contains score for Q4
                                // - Each displays in its respective "Skor Q1/Q2/Q3/Q4" column

                                // Quarter-Level Scores: sectionSkor varies per quarter
                                const quarterData = {
                                  Q1: section.quarters["Q1"] || {},
                                  Q2: section.quarters["Q2"] || {},
                                  Q3: section.quarters["Q3"] || {},
                                  Q4: section.quarters["Q4"] || {},
                                };

                                // Year-Level Data: Get definition directly for level1-5 and evidence
                                // These are SHARED across all quarters within the same year
                                // Even if a quarter has no score yet, level/evidence should still display
                                const definition = KPMR_definitions.find(d => d.id === section.definitionId);
                                const yearLevelData = {
                                  level1: definition?.level1 || "",
                                  level2: definition?.level2 || "",
                                  level3: definition?.level3 || "",
                                  level4: definition?.level4 || "",
                                  level5: definition?.level5 || "",
                                  evidence: definition?.evidence || "",
                                };

                                // For edit/delete actions, use any quarter's data (prefer viewQuarter, then first available)
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
                                    {/* Quarter score columns - filtered by selection */}
                                    {QUARTER_ORDER.filter((q) => shouldShowQuarter(q)).map((q) => {
                                      const data = quarterData[q];
                                      return (
                                        <td key={q} className="border px-2 py-2 text-center">
                                          {data.sectionSkor || "-"}
                                        </td>
                                      );
                                    })}
                                    {/* Year-Level: Use yearLevelData for level1-5 and evidence */}
                                    {/* These display even when no quarter score exists */}
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

                      {/* BARIS RATA-RATA TOTAL */}
                      {/* BARIS RATA-RATA TOTAL */}
                      <tr className="bg-[#c9daf8] font-semibold">
                        <td colSpan={2} className="border px-3 py-2"></td>

                        {/* Quarter totals - filtered by selection */}
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
        )}
      </div>
    </div>
  );
}
