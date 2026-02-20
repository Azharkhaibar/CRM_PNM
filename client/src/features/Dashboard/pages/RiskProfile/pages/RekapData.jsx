// RekapData.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Download, Search, ChevronDown, Upload } from "lucide-react";
import { calculatePeringkat, calculatePeringkatFromText, isNumericRiskLevels } from "../utils/riskCalculator";
import { exportRekapDataToExcel } from "../utils/exportRekapData";
import { importRekapDataFromExcel } from "../utils/importRekapData";

// ===================== Brand =====================

const FONT_CLASS = "font-['Plus_Jakarta_Sans',system-ui,sans-serif]";



const PNM_BRAND = {
  primary: "#0068B3",
  primarySoft: "#E6F1FA",
  gradient: "bg-gradient-to-r from-[#0076C6]/90 via-[#00A3DA]/90 to-[#33C2B5]/90",
};

// ===== Constants =====
const INVESTASI_LS = "investasiRows";
const PASAR_LS = "pasarRows";
const REKAP_LIKUIDITAS_LS = "rekap_likuiditas"; // Kita akan membaca dari sini

// ===== Operasional localStorage key =====
const OPERASIONAL_SECTIONS_LS = "operasional_sections_v1";
const HUKUM_SECTIONS_LS = "hukum_sections_v2";
const STRATEJIK_SECTIONS_LS = "stratejik_sections_v2";
const KEPATUHAN_SECTIONS_LS = "kepatuhan_sections_v2";
const REPUTASI_SECTIONS_LS = "reputasi_sections_v2";

// ===== Helper Functions =====
// Format angka untuk display (dengan pemisah ribuan)
const fmtNumber = (v) => {
  if (v === "" || v == null) return "";
  const cleaned = String(v).replace(/\./g, "").replace(/,/g, ".");
  const num = parseFloat(cleaned);
  if (isNaN(num)) return "";
  return new Intl.NumberFormat("id-ID").format(num);
};

// Format angka untuk input field - return as-is untuk avoid reformat confusion
// User bisa mengetik dalam format apapun (Indonesia atau internasional)
const fmtInputNumber = (v) => {
  if (v === "" || v == null) return "";
  return String(v).trim();
};

// Replace existing parseNum with this robust normalizer
const parseNum = (v) => {
  if (v == null || v === "") return NaN;
  // normalize spaces & NBSP
  let s = String(v).trim().replace(/\u00A0/g, "");
  // remove percent sign for parsing (we treat percent separately)
  s = s.replace(/%/g, "");
  if (!s) return NaN;
  if (!isNaN(s)) return parseFloat(s);
  // If both comma and dot exist, try to detect thousand vs decimal
  const hasComma = s.indexOf(",") !== -1;
  const hasDot = s.indexOf(".") !== -1;
  if (hasComma && hasDot) {
    // assume last separator is decimal, remove thousands
    if (s.lastIndexOf(",") > s.lastIndexOf(".")) {
      s = s.replace(/\./g, "");
      s = s.replace(/,/g, ".");
    } else {
      s = s.replace(/,/g, "");
    }
  } else if (hasComma && !hasDot) {
    // Indonesian format like "1.234,56" or simple "123,45"
    // treat comma as decimal
    s = s.replace(/\./g, "");
    s = s.replace(/,/g, ".");
  } else {
    // only dot or no separator; remove commas if any
    s = s.replace(/,/g, "");
  }

  s = s.replace(/\s+/g, "");
  const n = parseFloat(s);
  return Number.isNaN(n) ? NaN : n;
};

// Parse number for calculation - handles percentages by dividing by 100
const parseNumForCalc = (v) => {
  if (v == null || v === "") return 0;

  let s = String(v).trim();

  // Handle percentage values (e.g., "-17%", "6%", "6.00%")
  const isPercent = s.includes('%');
  if (isPercent) {
    s = s.replace(/%/g, '');
  }

  // buang titik ribuan, ubah koma jadi titik desimal
  s = s.replace(/\./g, "").replace(/,/g, ".").trim();
  let n = parseFloat(s);

  if (isNaN(n)) return 0;

  // Convert percentage to decimal if % was present
  if (isPercent) {
    n = n / 100;
  }

  return n;
};

// ===== Helper functions for accurate rowSpan calculation =====
// Calculate how many rows an indicator will span based on its mode
const calculateRowSpan = (indicators, mode) => {
  if (mode === "TEKS") return 1;
  if (mode === "NILAI_TUNGGAL" || mode === "NILAI_TUNGGAL_PENY") return 2;
  return 3; // RASIO
};

// Calculate total rows for a source (sum of all indicators' row spans)
const calculateTotalRowsForSource = (indicators) => {
  return indicators.reduce((sum, ind) => {
    const mode = ind.mainRow?.mode ?? "RASIO";
    return sum + calculateRowSpan([ind], mode);
  }, 0);
};

// Calculate total rows for a section (sum of all indicators' row spans in that section)
const calculateTotalRowsForSection = (indicators) => {
  return indicators.reduce((sum, ind) => {
    const mode = ind.mainRow?.mode ?? "RASIO";
    return sum + calculateRowSpan([ind], mode);
  }, 0);
};


const loadFromLocal = (key) => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn(`Gagal baca ${key} dari localStorage`, e);
    return [];
  }
};

// Helper untuk memuat investasiRows dengan auto-recalculate peringkat untuk TEKS mode
const loadInvestasiRowsWithPeringkat = () => {
  const rows = loadFromLocal(INVESTASI_LS);
  // Recalculate peringkat untuk TEKS mode entries
  return rows.map(row => {
    if (row.mode !== 'TEKS') return row;

    const riskLevels = {
      low: row.low || "",
      lowToModerate: row.lowToModerate || "",
      moderate: row.moderate || "",
      moderateToHigh: row.moderateToHigh || "",
      high: row.high || "",
    };

    const newPeringkat = calculatePeringkatFromText(
      row.hasilText || "",
      riskLevels
    );

    // Hanya update jika peringkat berubah atau kosong
    if (row.peringkat !== newPeringkat || !row.peringkat) {
      return { ...row, peringkat: newPeringkat };
    }

    return row;
  });
};

// Helper untuk memuat kepatuhanRows dengan auto-recalculate peringkat untuk TEKS mode
const loadKepatuhanRowsWithPeringkat = () => {
  const rows = loadFromLocal("kepatuhanRows");

  // Recalculate peringkat untuk TEKS mode entries
  return rows.map(row => {
    if (row.mode !== 'TEKS') return row;

    const riskLevels = {
      low: row.low || "",
      lowToModerate: row.lowToModerate || "",
      moderate: row.moderate || "",
      moderateToHigh: row.moderateToHigh || "",
      high: row.high || "",
    };

    const newPeringkat = calculatePeringkatFromText(
      row.hasilText || "",
      riskLevels
    );

    // Hanya update jika peringkat berubah atau kosong
    if (row.peringkat !== newPeringkat || !row.peringkat) {
      return { ...row, peringkat: newPeringkat };
    }

    return row;
  });
};

// Helper untuk memuat reputasiRows dengan auto-recalculate peringkat untuk TEKS mode
const loadReputasiRowsWithPeringkat = () => {
  const rows = loadFromLocal("reputasiRows");

  // Recalculate peringkat untuk TEKS mode entries
  return rows.map(row => {
    if (row.mode !== 'TEKS') return row;

    const riskLevels = {
      low: row.low || "",
      lowToModerate: row.lowToModerate || "",
      moderate: row.moderate || "",
      moderateToHigh: row.moderateToHigh || "",
      high: row.high || "",
    };

    const newPeringkat = calculatePeringkatFromText(
      row.hasilText || "",
      riskLevels
    );

    // Hanya update jika peringkat berubah atau kosong
    if (row.peringkat !== newPeringkat || !row.peringkat) {
      return { ...row, peringkat: newPeringkat };
    }

    return row;
  });
};

// PERUBAHAN: Fungsi untuk memuat hukumRows dengan auto-recalculate peringkat
const loadHukumRowsWithPeringkat = () => {
  const rows = loadFromLocal("hukumRows");

  // Recalculate peringkat untuk TEKS mode entries
  return rows.map(row => {
    if (row.mode !== 'TEKS') return row;

    const riskLevels = {
      low: row.low || "",
      lowToModerate: row.lowToModerate || "",
      moderate: row.moderate || "",
      moderateToHigh: row.moderateToHigh || "",
      high: row.high || "",
    };

    const newPeringkat = calculatePeringkatFromText(
      row.hasilText || "",
      riskLevels
    );

    // Hanya update jika peringkat berubah atau kosong
    if (row.peringkat !== newPeringkat || !row.peringkat) {
      return { ...row, peringkat: newPeringkat };
    }

    return row;
  });
};

// PERUBAHAN: Fungsi untuk memuat operasionalRows dengan auto-recalculate peringkat
const loadOperasionalRowsWithPeringkat = () => {
  const rows = loadFromLocal("operasionalRows");
  // Recalculate peringkat untuk TEKS mode entries
  return rows.map(row => {
    if (row.mode !== 'TEKS') return row;

    const riskLevels = {
      low: row.low || "",
      lowToModerate: row.lowToModerate || "",
      moderate: row.moderate || "",
      moderateToHigh: row.moderateToHigh || "",
      high: row.high || "",
    };

    const newPeringkat = calculatePeringkatFromText(
      row.hasilText || "",
      riskLevels
    );

    // Hanya update jika peringkat berubah atau kosong
    if (row.peringkat !== newPeringkat || !row.peringkat) {
      return { ...row, peringkat: newPeringkat };
    }

    return row;
  });
};

// PERUBAHAN: Fungsi untuk muat operasional (sections)
const loadOperasionalSections = () => {
  if (typeof window === "undefined") return [];
  try {
    // prefer bridge (lebih cepat kalau komponen Operasional masih mounted)
    if (window.__REKAP_DATA && window.__REKAP_DATA.operasional && typeof window.__REKAP_DATA.operasional.getSections === "function") {
      return window.__REKAP_DATA.operasional.getSections();
    }
    const raw = localStorage.getItem(OPERASIONAL_SECTIONS_LS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Gagal baca operasional sections", e);
    return [];
  }
};


const loadHukumSections = () => {
  if (typeof window === "undefined") return [];

  try {
    // Try bridge first (fast path if Hukum page has been visited)
    if (
      window.__REKAP_DATA?.hukum?.getSections &&
      typeof window.__REKAP_DATA.hukum.getSections === "function"
    ) {
      return window.__REKAP_DATA.hukum.getSections();
    }

    // Fallback: Load sections and rows separately, then sync locally
    // This allows RekapData to work even when visited directly (without Hukum page)
    const rawSections = localStorage.getItem(HUKUM_SECTIONS_LS);
    const sections = rawSections ? JSON.parse(rawSections) : [];

    const rawRows = localStorage.getItem("hukumRows");
    const rows = rawRows ? JSON.parse(rawRows) : [];

    // Sync rows into sections.indicators (mirroring the bridge logic from Hukum.jsx)
    const sectionsWithIndicators = sections.map(section => {
      // Match rows to this section by year, quarter, no, and parameter/sectionLabel
      const sectionRows = rows.filter(row =>
        row.year === section.year &&
        row.quarter === section.quarter &&
        String(row.no) === String(section.no) &&
        (row.sectionLabel === section.parameter || row.sectionLabel === section.sectionLabel)
      );

      return {
        ...section,
        indicators: sectionRows.map(row => ({
          id: row.id || `${row.year}-${row.quarter}-${row.no}-${row.subNo}-${row.indikator}`,
          subNo: row.subNo,
          indikator: row.indikator,
          bobotIndikator: row.bobotIndikator,
          sumberRisiko: row.sumberRisiko,
          dampak: row.dampak,
          mode: row.mode || "RASIO",
          formula: row.formula || "",
          isPercent: !!row.isPercent,
          // Risk levels (for TEKS mode)
          low: row.low,
          lowToModerate: row.lowToModerate,
          moderate: row.moderate,
          moderateToHigh: row.moderateToHigh,
          high: row.high,
          // Field name mapping
          pembilangLabel: row.numeratorLabel || row.pembilangLabel || "",
          pembilangValue: row.numeratorValue || row.pembilangValue || "",
          numeratorValue: row.numeratorValue || row.pembilangValue || "",
          penyebutLabel: row.denominatorLabel || row.penyebutLabel || "",
          penyebutValue: row.denominatorValue || row.penyebutValue || "",
          denominatorValue: row.denominatorValue || row.penyebutValue || "",
          hasil: row.hasil || "",
          hasilText: row.hasilText || "",
          peringkat: row.peringkat || "",
          weighted: row.weighted || "",
          keterangan: row.keterangan || "",
          year: row.year,
          quarter: row.quarter,
        }))
      };
    });

    // Also handle nested structure (year -> quarter -> sections) if present
    if (!Array.isArray(sections) && typeof sections === "object" && Object.keys(sections).length > 0) {
      const flattened = [];

      Object.entries(sections).forEach(([year, byQuarter]) => {
        Object.entries(byQuarter).forEach(([quarter, sectionList]) => {
          (sectionList || []).forEach((section) => {
            const sectionRows = rows.filter(row =>
              row.year === year &&
              row.quarter === quarter &&
              String(row.no) === String(section.no) &&
              (row.sectionLabel === section.parameter || row.sectionLabel === section.sectionLabel)
            );

            flattened.push({
              ...section,
              indicators: sectionRows.map(row => ({
                id: row.id || `${row.year}-${row.quarter}-${row.no}-${row.subNo}-${row.indikator}`,
                subNo: row.subNo,
                indikator: row.indikator,
                bobotIndikator: row.bobotIndikator,
                sumberRisiko: row.sumberRisiko,
                dampak: row.dampak,
                mode: row.mode || "RASIO",
                formula: row.formula || "",
                isPercent: !!row.isPercent,
                low: row.low,
                lowToModerate: row.lowToModerate,
                moderate: row.moderate,
                moderateToHigh: row.moderateToHigh,
                high: row.high,
                pembilangLabel: row.numeratorLabel || row.pembilangLabel || "",
                pembilangValue: row.numeratorValue || row.pembilangValue || "",
                numeratorValue: row.numeratorValue || row.pembilangValue || "",
                penyebutLabel: row.denominatorLabel || row.penyebutLabel || "",
                penyebutValue: row.denominatorValue || row.penyebutValue || "",
                denominatorValue: row.denominatorValue || row.penyebutValue || "",
                hasil: row.hasil || "",
                hasilText: row.hasilText || "",
                peringkat: row.peringkat || "",
                weighted: row.weighted || "",
                keterangan: row.keterangan || "",
                year: row.year,
                quarter: row.quarter,
              }))
            });
          });
        });
      });

      return flattened;
    }

    return sectionsWithIndicators;
  } catch (e) {
    console.warn("Gagal baca hukum sections", e);
    return [];
  }
};


const loadStratejikSections = () => {
  if (typeof window === "undefined") return [];

  try {
    if (
      window.__REKAP_DATA?.stratejik?.getSections &&
      typeof window.__REKAP_DATA.stratejik.getSections === "function"
    ) {
      return window.__REKAP_DATA.stratejik.getSections();
    }

    const raw = localStorage.getItem(STRATEJIK_SECTIONS_LS);
    const data = raw ? JSON.parse(raw) : {};

    if (!Array.isArray(data) && typeof data === "object") {
      const flattened = [];

      Object.entries(data).forEach(([year, byQuarter]) => {
        Object.entries(byQuarter).forEach(([quarter, sections]) => {
          (sections || []).forEach((section) => {
            flattened.push({
              ...section,
              indicators: (section.indicators || []).map((it) => ({
                ...it,
                year,
                quarter,
              })),
            });
          });
        });
      });

      return flattened;
    }

    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn("Gagal baca stratejik sections", e);
    return [];
  }
};


// ===== Helper untuk load stratejikRows dengan auto-recalculate peringkat =====
const loadStratejikRowsWithPeringkat = () => {
  const rows = loadFromLocal("stratejikRows"); // Ganti dari INVESTASI_LS ke "stratejikRows"
  // Recalculate peringkat untuk TEKS mode entries
  return rows.map(row => {
    if (row.mode !== 'TEKS') return row;

    const riskLevels = {
      low: row.low || "",
      lowToModerate: row.lowToModerate || "",
      moderate: row.moderate || "",
      moderateToHigh: row.moderateToHigh || "",
      high: row.high || "",
    };

    const newPeringkat = calculatePeringkatFromText(
      row.hasilText || "",
      riskLevels
    );

    // Hanya update jika peringkat berubah atau kosong
    if (row.peringkat !== newPeringkat || !row.peringkat) {
      return { ...row, peringkat: newPeringkat };
    }

    return row;
  });
};

const loadKepatuhanSections = () => {
  if (typeof window === "undefined") return [];
  try {
    // prefer bridge (lebih cepat kalau komponen Kepatuhan masih mounted)
    if (window.__REKAP_DATA && window.__REKAP_DATA.kepatuhan && typeof window.__REKAP_DATA.kepatuhan.getSections === "function") {
      return window.__REKAP_DATA.kepatuhan.getSections();
    }

    // fallback: direct localStorage read
    const raw = localStorage.getItem(KEPATUHAN_SECTIONS_LS);
    const data = raw ? JSON.parse(raw) : [];

    // 🔹 PENTING: Normalize data - tambahkan year/quarter untuk backward compatibility
    const normalized = (Array.isArray(data) ? data : []).map(section => ({
      ...section,
      // Jika section tidak punya year/quarter, jangan berikan default
      // Biarkan undefined agar bisa difilter nanti
      indicators: (section.indicators || []).map(ind => ({
        ...ind,
        // Propagate year/quarter dari section ke indicator
        year: ind.year ?? section.year,
        quarter: ind.quarter ?? section.quarter,
      }))
    }));

    return normalized;
  } catch (e) {
    console.warn("Gagal baca kepatuhan sections", e);
    return [];
  }
};

const loadReputasiSections = () => {
  if (typeof window === "undefined") return [];
  try {
    // prefer bridge (lebih cepat kalau komponen Reputasi masih mounted)
    if (window.__REKAP_DATA && window.__REKAP_DATA.reputasi && typeof window.__REKAP_DATA.reputasi.getSections === "function") {
      return window.__REKAP_DATA.reputasi.getSections();
    }

    // fallback: direct localStorage read
    const raw = localStorage.getItem(REPUTASI_SECTIONS_LS);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn("Gagal baca reputasi sections", e);
    return [];
  }
};

const computeHasilFromValues = (row) => {
  const mode = row.mode || "RASIO";

  // Ambil nilai dengan prioritas yang benar
  const pembRaw = row.numeratorValue ?? row.pembilangValue ?? row.pembilang ?? row.numerator ?? "";
  const penyRaw = row.denominatorValue ?? row.penyebutValue ?? row.penyebut ?? row.denominator ?? "";



  // Cek jika nilai kosong
  if ((pembRaw === "" || pembRaw == null) && (penyRaw === "" || penyRaw == null)) {
    return "";
  }

  // Jika hanya satu nilai yang ada (mode nilai tunggal)
  if (mode === "NILAI_TUNGGAL" || mode === "NILAI_TUNGGAL_PENY") {
    const raw = penyRaw || pembRaw;
    if (raw === "" || raw == null) {
      return "";
    }
    const val = parseNum(raw);
    return Number.isFinite(val) ? Number(val) : "";
  }

  // Untuk mode RASIO
  const pemb = parseNumForCalc(pembRaw);
  const peny = parseNumForCalc(penyRaw);



  if (!isFinite(pemb) || !isFinite(peny)) {
    console.warn('[computeHasilFromValues] Invalid numbers:', { pemb, peny });
    return "";
  }

  if (peny === 0) {
    console.warn('[computeHasilFromValues] Division by zero');
    return "";
  }

  // Custom formula handling - sama seperti di Investasi.jsx
  if (row.formula && row.formula.trim() !== "") {
    try {
      const expr = row.formula
        .replace(/\bpemb\b/g, "pemb")
        .replace(/\bpeny\b/g, "peny");
      const fn = new Function("pemb", "peny", `return (${expr});`);
      const res = fn(pemb, peny);
      if (!isFinite(res) || isNaN(res)) {
        console.warn('[computeHasilFromValues] Custom formula invalid result:', res);
        return "";
      }
      return Number(res);
    } catch (e) {
      console.warn('[computeHasilFromValues] Invalid formula:', row.formula, e);
      // Fallback ke default calculation
    }
  }

  const result = pemb / peny;

  if (!isFinite(result) || Number.isNaN(result)) {
    console.warn('[computeHasilFromValues] Invalid result:', result);
    return "";
  }

  return Number(result);
};

const makeRowKey = (r) =>
  `${r.source || "INVESTASI"}|${r.year}|${r.quarter}|${r.no ?? ""}|${r.subNo ?? ""}|${r.sectionLabel ?? ""}|${r.indikator ?? ""}`;


// 🔹 IMPROVED: Tambahkan hash untuk uniqueness
const makeStableKey = (source, sectionName, indikatorLabel, no, subNo, rowIndex = "") => {
  // Clean special characters
  const cleanSection = String(sectionName || "").replace(/[|]/g, "-").replace(/\s+/g, "_").slice(0, 30);
  const cleanIndikator = String(indikatorLabel || "").replace(/[|]/g, "-").replace(/\s+/g, "_").slice(0, 30);
  const cleanNo = String(no || "none");
  const cleanSubNo = String(subNo || "none");

  // 🔹 TAMBAHKAN rowIndex untuk uniqueness jika ada duplicate
  const suffix = rowIndex !== "" ? `-${rowIndex}` : "";

  return `${source}-${cleanNo}-${cleanSubNo}-${cleanSection}-${cleanIndikator}${suffix}`;
};

// ===== UI Components =====
const YearSelect = ({ value, onChange }) => (
  <input
    type="number"
    className="w-24 rounded-xl px-3 py-2 border text-sm"
    value={value}
    onChange={(e) => onChange(Number(e.target.value || new Date().getFullYear()))}
  />
);

const QuarterSelect = ({ value, onChange }) => (
  <select className="rounded-xl px-3 py-2 border text-sm" value={value} onChange={(e) => onChange(e.target.value)}>
    <option value="Q1">Q1 (Jan–Mar)</option>
    <option value="Q2">Q2 (Apr–Jun)</option>
    <option value="Q3">Q3 (Jul–Sep)</option>
    <option value="Q4">Q4 (Okt–Des)</option>
  </select>
);

// ===== MAIN COMPONENT =====
// Risk Form Sources
const RISK_SOURCES = [
  "INVESTASI",
  "PASAR",
  "LIKUIDITAS",
  "OPERASIONAL",
  "HUKUM",
  "STRATEJIK",
  "KEPATUHAN",
  "REPUTASI",
];

export default function RekapData() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [quarter, setQuarter] = useState("Q4");
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("triwulan");
  const [selectedSources, setSelectedSources] = useState(RISK_SOURCES);
  const [sectionFilterOpen, setSectionFilterOpen] = useState(false);
  const [selectedSections, setSelectedSections] = useState({});
  const [lastImportTime, setLastImportTime] = useState(0);
  const fileInputRef = useRef(null);

  // State untuk Export Format Dialog
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormatOptions, setExportFormatOptions] = useState(() => {
    const saved = localStorage.getItem('rekapDataExportFormat');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { hasilFormat: 'smart', pemisahFormat: 'indonesia' };
      }
    }
    return { hasilFormat: 'smart', pemisahFormat: 'indonesia' };
  });

  const handleExportFormatChange = (field, value) => {
    const updated = { ...exportFormatOptions, [field]: value };
    setExportFormatOptions(updated);
    localStorage.setItem('rekapDataExportFormat', JSON.stringify(updated));
  };

  // FIXED: Urutan sumber yang sama dengan sidebar untuk konsistensi UI
  const SOURCE_ORDER = [
    "INVESTASI",
    "PASAR",
    "LIKUIDITAS",
    "OPERASIONAL",
    "HUKUM",
    "STRATEJIK",
    "KEPATUHAN",
    "REPUTASI",
  ];

  // Helper untuk toggle source selection
  const toggleSource = (src) => {
    setSelectedSources((prev) =>
      prev.includes(src)
        ? prev.filter((s) => s !== src)
        : [...prev, src]
    );
  };

  /**
   * selectedSections:
   * {
   *   INVESTASI: ["Section A", "Section B"],
   *   PASAR: ["Volatilitas Pasar"],
   * }
   */
  const toggleSection = (source, sectionName) => {
    setSelectedSections((prev) => {
      const current = prev[source] || [];
      const next = current.includes(sectionName)
        ? current.filter((s) => s !== sectionName)
        : [...current, sectionName];

      const updated = { ...prev, [source]: next };
      if (updated[source].length === 0) {
        delete updated[source];
      }
      return updated;
    });
  };

  const toggleQuarter = (q) => {
    setSelectedQuarters((prev) =>
      prev.includes(q)
        ? prev.filter((x) => x !== q)
        : [...prev, q]
    );
  };


  // State untuk 3 sumber data
  const [investasiRows, setInvestasiRows] = useState(() => loadInvestasiRowsWithPeringkat());
  const [pasarRows, setPasarRows] = useState(() => loadFromLocal(PASAR_LS));
  // PERUBAHAN: Inisialisasi state likuiditasRows sekarang membaca dari sumber yang benar
  const [likuiditasRows, setLikuiditasRows] = useState(() => loadFromLocal("likuiditasRows"));

  // PERUBAHAN: State operasional rows (flat structure seperti investasi)
  const [operasionalRows, setOperasionalRows] = useState(() => loadOperasionalRowsWithPeringkat());


  // PERUBAHAN: State operasional (sections + indicators)
  const [operasionalSections, setOperasionalSections] = useState(() => loadOperasionalSections());
  const [hukumSections, setHukumSections] = useState(() => loadHukumSections());
  // ===== State untuk HUKUM (flat rows like Investasi) =====
  const [hukumRows, setHukumRows] = useState(() => loadHukumRowsWithPeringkat());
  // ===== State untuk STRATEJIK =====
  const [stratejikRows, setStratejikRows] = useState(() => loadStratejikRowsWithPeringkat());

  // ===== State untuk KEPATUHAN (flat rows like Investasi) =====
  const [kepatuhanRows, setKepatuhanRows] = useState(() => loadKepatuhanRowsWithPeringkat());

  // ===== State untuk REPUTASI (flat rows like Investasi) =====
  const [reputasiRows, setReputasiRows] = useState(() => loadReputasiRowsWithPeringkat());


  const [stratejikSections, setStratejikSections] = useState(() => loadStratejikSections());
  const [kepatuhanSections, setKepatuhanSections] = useState(() => loadKepatuhanSections());
  const [reputasiSections, setReputasiSections] = useState(() => loadReputasiSections());
  // Filter triwulan untuk mode Tahunan
  const [selectedQuarters, setSelectedQuarters] = useState([]);


  // reload saat year/quarter berubah (RekapData hanya baca ketika periode berubah)
  useEffect(() => {
    setOperasionalSections(loadOperasionalSections());
    setHukumSections(loadHukumSections());
    setHukumRows(loadHukumRowsWithPeringkat());
    setStratejikSections(loadStratejikSections());
    setKepatuhanSections(loadKepatuhanSections());
    setReputasiSections(loadReputasiSections());
    setReputasiRows(loadReputasiRowsWithPeringkat());
  }, [year, quarter]);

  // FIX: Cleanup duplicate rows from localStorage on mount
  useEffect(() => {
    const cleanupDuplicates = (key, setState) => {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return;

        const data = JSON.parse(raw);
        if (!Array.isArray(data) || data.length === 0) return;

        // Remove duplicates - keep one per (source, sectionLabel, indikator, year, quarter)
        const seen = new Map();
        data.forEach(row => {
          const key = `${row.source}-${row.sectionLabel}-${row.indikator}-${row.year}-${row.quarter}`;

          if (seen.has(key)) {
            const existing = seen.get(key);
            // Calculate completeness score
            const existingScore = (existing.numeratorValue || existing.pembilangValue ? 2 : 0) +
              (existing.denominatorValue || existing.penyebutValue ? 1 : 0);
            const currentScore = (row.numeratorValue || row.pembilangValue ? 2 : 0) +
              (row.denominatorValue || row.penyebutValue ? 1 : 0);

            // Keep the one with higher score
            if (currentScore > existingScore) {
              seen.set(key, row);
            }
          } else {
            seen.set(key, row);
          }
        });

        const cleaned = Array.from(seen.values());
        if (cleaned.length < data.length) {
          console.log(`[CLEANUP ${key}] Removed ${data.length - cleaned.length} duplicates. Before: ${data.length}, After: ${cleaned.length}`);
          localStorage.setItem(key, JSON.stringify(cleaned));
          if (setState) setState(cleaned);
        }
      } catch (e) {
        console.warn(`[CLEANUP] Error cleaning ${key}:`, e);
      }
    };

    // Cleanup all row arrays
    cleanupDuplicates('investasiRows', setInvestasiRows);
    cleanupDuplicates('pasarRows', setPasarRows);
    cleanupDuplicates('likuiditasRows', setLikuiditasRows);
    cleanupDuplicates('operasionalRows', setOperasionalRows);
    cleanupDuplicates('hukumRows', setHukumRows);
    cleanupDuplicates('stratejikRows', setStratejikRows);
    cleanupDuplicates('kepatuhanRows', setKepatuhanRows);
    cleanupDuplicates('reputasiRows', setReputasiRows);
  }, []); // Run once on mount

  // listen storage + custom event
  useEffect(() => {
    const storageHandler = (e) => {
      if (!e) return;
      if (e.key === OPERASIONAL_SECTIONS_LS) {
        setOperasionalSections(loadOperasionalSections());
      }
    };
    const customHandler = (ev) => {
      try {
        setOperasionalSections(Array.isArray(ev.detail) ? ev.detail : loadOperasionalSections());
      } catch {
        setOperasionalSections(loadOperasionalSections());
      }
    };

    window.addEventListener("storage", storageHandler);
    window.addEventListener("operasionalSections:changed", customHandler);

    return () => {
      window.removeEventListener("storage", storageHandler);
      window.removeEventListener("operasionalSections:changed", customHandler);
    };
  }, []);

  // ===== Persist investasiRows =====
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(INVESTASI_LS, JSON.stringify(investasiRows));
    } catch (e) {
      console.warn("Gagal simpan investasiRows", e);
    }
  }, [investasiRows]);

  // ===== Persist hukumRows =====
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("hukumRows", JSON.stringify(hukumRows));
    } catch (e) {
      console.warn("Gagal simpan hukumRows", e);
    }
  }, [hukumRows]);

  // ===== Persist kepatuhanRows =====
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("kepatuhanRows", JSON.stringify(kepatuhanRows));
    } catch (e) {
      console.warn("Gagal simpan kepatuhanRows", e);
    }
  }, [kepatuhanRows]);

  // ===== Persist pasarRows =====
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(PASAR_LS, JSON.stringify(pasarRows));
      window.dispatchEvent(new CustomEvent("pasarRows:changed", { detail: pasarRows }));
    } catch (e) {
      console.warn("Gagal persist pasarRows", e);
    }
  }, [pasarRows]);


  // PERUBAHAN: useEffect untuk memuat ulang data likuiditas saat year/quarter berubah
  useEffect(() => {
    setLikuiditasRows(loadFromLocal("likuiditasRows"));
  }, [year, quarter]);

  // PERUBAHAN: muat ulang operasionalSections saat periode berubah (opsional)
  useEffect(() => {
    setOperasionalSections(loadOperasionalSections());
    setHukumSections(loadHukumSections());
    setStratejikSections(loadStratejikSections());
    setKepatuhanSections(loadKepatuhanSections());
  }, [year, quarter]);

  // ===== Listen to storage changes (other tabs) =====
  useEffect(() => {
    const handler = (e) => {
      if (!e) return;
      if (e.key === INVESTASI_LS) setInvestasiRows(loadInvestasiRowsWithPeringkat());
      if (e.key === PASAR_LS) setPasarRows(loadFromLocal(PASAR_LS));
      // PERUBAHAN: Saat storage event untuk likuiditas terjadi, muat ulang dari sumber yang benar
      if (e.key === "likuiditasRows") setLikuiditasRows(loadFromLocal("likuiditasRows"));
      // PERUBAHAN: Saat operasionalRows changed externally (flat structure)
      if (e.key === "operasionalRows") setOperasionalRows(loadOperasionalRowsWithPeringkat());
      // PERUBAHAN: Saat operasional changed externally (sections structure)
      if (e.key === OPERASIONAL_SECTIONS_LS) setOperasionalSections(loadOperasionalSections());
      if (e.key === HUKUM_SECTIONS_LS) setHukumSections(loadHukumSections());
      if (e.key === "hukumRows") setHukumRows(loadHukumRowsWithPeringkat());
      if (e.key === STRATEJIK_SECTIONS_LS) setStratejikSections(loadStratejikSections());
      if (e.key === "stratejikRows") setStratejikRows(loadStratejikRowsWithPeringkat());
      if (e.key === KEPATUHAN_SECTIONS_LS) setKepatuhanSections(loadKepatuhanSections());
      if (e.key === REPUTASI_SECTIONS_LS) setReputasiSections(loadReputasiSections());
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [year, quarter]);

  // PERUBAHAN: Listen to custom events for pasar (already present) and react to operasional custom events if emitted
  useEffect(() => {
    const onPasarChanged = (ev) => {
      try {
        if (ev && ev.detail) setPasarRows(Array.isArray(ev.detail) ? ev.detail : loadFromLocal(PASAR_LS));
        else setPasarRows(loadFromLocal(PASAR_LS));
      } catch (e) {
        setPasarRows(loadFromLocal(PASAR_LS));
      }
    };


    const onLikuiditasChanged = (ev) => {
      try {
        if (ev && ev.detail) {
          setLikuiditasRows(Array.isArray(ev.detail) ? ev.detail : loadFromLocal("likuiditasRows"));
        } else {
          setLikuiditasRows(loadFromLocal("likuiditasRows"));
        }
      } catch (e) {
        setLikuiditasRows(loadFromLocal("likuiditasRows"));
      }
    };


    const onOperasionalRowsChanged = (ev) => {
      try {
        if (ev && ev.detail) setOperasionalRows(Array.isArray(ev.detail) ? ev.detail : loadOperasionalRowsWithPeringkat());
        else setOperasionalRows(loadOperasionalRowsWithPeringkat());
      } catch (e) {
        setOperasionalRows(loadOperasionalRowsWithPeringkat());
      }
    };

    const onOperasionalChanged = (ev) => {
      try {
        if (ev && ev.detail) setOperasionalSections(Array.isArray(ev.detail) ? ev.detail : loadOperasionalSections());
        else setOperasionalSections(loadOperasionalSections());
      } catch (e) {
        setOperasionalSections(loadOperasionalSections());
      }
    };

    const onHukumChanged = (ev) => {
      try {
        if (ev && ev.detail) setHukumSections(Array.isArray(ev.detail) ? ev.detail : loadHukumSections());
        else setHukumSections(loadHukumSections());
      } catch (e) {
        setHukumSections(loadHukumSections());
      }
    };

    const onHukumRowsChanged = (ev) => {
      try {
        setHukumRows(loadHukumRowsWithPeringkat());
      } catch (e) {
        console.warn('[REKAPDATA] Failed to update hukumRows:', e);
        setHukumRows(loadHukumRowsWithPeringkat());
      }
    };

    // Event listener untuk STRATEJIK
    const onStratejikRowsChanged = (ev) => {
      try {
        if (ev && ev.detail) {
          setStratejikRows(loadStratejikRowsWithPeringkat()); // Gunakan loader khusus
        } else {
          setStratejikRows(loadStratejikRowsWithPeringkat());
        }
      } catch (e) {
        console.warn('[REKAPDATA] Failed to update stratejikRows:', e);
        setStratejikRows(loadStratejikRowsWithPeringkat());
      }
    };

    window.addEventListener("stratejikRows:changed", onStratejikRowsChanged);

    const onStratejikChanged = (ev) => {
      try {
        if (ev && ev.detail) setStratejikSections(Array.isArray(ev.detail) ? ev.detail : loadStratejikSections());
        else setStratejikSections(loadStratejikSections());
      } catch (e) {
        setStratejikSections(loadStratejikSections());
      }
    };

    const onKepatuhanChanged = (ev) => {
      try {
        if (ev && ev.detail) setKepatuhanSections(Array.isArray(ev.detail) ? ev.detail : loadKepatuhanSections());
        else setKepatuhanSections(loadKepatuhanSections());
      } catch (e) {
        setKepatuhanSections(loadKepatuhanSections());
      }
    };

    const onKepatuhanRowsChanged = (ev) => {
      try {
        setKepatuhanRows(loadKepatuhanRowsWithPeringkat());
      } catch (e) {
        console.warn('[REKAPDATA] Failed to update kepatuhanRows:', e);
        setKepatuhanRows(loadKepatuhanRowsWithPeringkat());
      }
    };

    const onReputasiChanged = (ev) => {
      try {
        if (ev && ev.detail) setReputasiSections(Array.isArray(ev.detail) ? ev.detail : loadReputasiSections());
        else setReputasiSections(loadReputasiSections());
      } catch (e) {
        setReputasiSections(loadReputasiSections());
      }
    };

    const onReputasiRowsChanged = (ev) => {
      try {
        setReputasiRows(loadReputasiRowsWithPeringkat());
      } catch (e) {
        console.warn('[REKAPDATA] Failed to update reputasiRows:', e);
        setReputasiRows(loadReputasiRowsWithPeringkat());
      }
    };

    window.addEventListener("pasarRows:changed", onPasarChanged);
    window.addEventListener("likuiditasRows:changed", onLikuiditasChanged);
    window.addEventListener("operasionalRows:changed", onOperasionalRowsChanged);
    window.addEventListener("operasionalSections:changed", onOperasionalChanged);
    window.addEventListener("hukumSections:changed", onHukumChanged);
    window.addEventListener("hukumRows:changed", onHukumRowsChanged);
    window.addEventListener("stratejikSections:changed", onStratejikChanged);
    window.addEventListener("kepatuhanSections:changed", onKepatuhanChanged);
    window.addEventListener("kepatuhanRows:changed", onKepatuhanRowsChanged);
    window.addEventListener("reputasiSections:changed", onReputasiChanged);
    window.addEventListener("reputasiRows:changed", onReputasiRowsChanged);

    return () => {
      window.removeEventListener("pasarRows:changed", onPasarChanged);
      window.removeEventListener("likuiditasRows:changed", onLikuiditasChanged);
      window.removeEventListener("operasionalRows:changed", onOperasionalRowsChanged);
      window.removeEventListener("operasionalSections:changed", onOperasionalChanged);
      window.removeEventListener("hukumSections:changed", onHukumChanged);
      window.removeEventListener("hukumRows:changed", onHukumRowsChanged);
      window.removeEventListener("stratejikSections:changed", onStratejikChanged);
      window.removeEventListener("kepatuhanSections:changed", onKepatuhanChanged);
      window.removeEventListener("kepatuhanRows:changed", onKepatuhanRowsChanged);
      window.removeEventListener("reputasiSections:changed", onReputasiChanged);
      window.removeEventListener("reputasiRows:changed", onReputasiRowsChanged);
    };
  }, []);

  function normalizeHasilDisplay(hasilRaw, isPercent) {
    if (hasilRaw === "" || hasilRaw == null) {
      return "";
    }

    const num = Number(hasilRaw);
    if (!Number.isFinite(num) || Number.isNaN(num)) {
      return "";
    }

    if (isPercent) {
      // Jika hasilRaw sudah dalam bentuk decimal (0.0346), convert ke percent
      return `${(num * 100).toFixed(2)}%`;
    }

    // Use direct formatting to avoid dot removal bug in fmtNumber
    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4
    }).format(num);
  }

  // ===== Periode Label =====
  const periodeLabel = useMemo(() => {
    const qMap = { Q1: "MAR", Q2: "JUN", Q3: "SEP", Q4: "DES" };
    return `${qMap[quarter] || ""} ${year}`;
  }, [year, quarter]);

  // ===== Constants untuk Tahunan =====
  const QUARTER_ORDER = ["Q1", "Q2", "Q3", "Q4"];
  const QUARTER_LABEL = {
    Q1: "MAR",
    Q2: "JUN",
    Q3: "SEP",
    Q4: "DES",
  };

  // ===== Combined Groups =====
  const combinedGroups = useMemo(() => {
    const normalize = (r, source) => {

      const getLabel = (label) => {
        if (!label || label === "" || label === "-") return "-";
        return label;
      };


      const result = {
        source,
        year: r.year ?? year,
        quarter: r.quarter ?? quarter,
        no: r.no ?? "",
        subNo: r.subNo ?? "",
        sectionLabel: r.sectionLabel ?? r.parameter ?? "—",
        indikator: r.indikator ?? "—",
        numeratorLabel: getLabel(r.numeratorLabel ?? r.pembilangLabel ?? ""),
        numeratorValue:
          r.numeratorValue ?? r.pembilangValue ?? r.pembilang ?? "",
        denominatorLabel: getLabel(r.denominatorLabel ?? r.penyebutLabel ?? ""),
        denominatorValue:
          r.denominatorValue ?? r.penyebutValue ?? r.penyebut ?? "",
        isPercent: !!r.isPercent,
        mode: r.mode ?? "RASIO",
        formula: r.formula ?? "",
        hasil: r.hasil ?? r.result ?? "",
        hasilText: r.hasilText ?? "",

        // Metadata fields for preservation during export/import
        bobotSection: r.bobotSection ?? "",
        bobotIndikator: r.bobotIndikator ?? "",
        sumberRisiko: r.sumberRisiko ?? "",
        dampak: r.dampak ?? "",
        low: r.low ?? "",
        lowToModerate: r.lowToModerate ?? "",
        moderate: r.moderate ?? "",
        moderateToHigh: r.moderateToHigh ?? "",
        high: r.high ?? "",
        keterangan: r.keterangan ?? "",
        peringkat: r.peringkat ?? 0,
        weighted: r.weighted ?? 0,

        raw: r,
      };

      return result;
    };

    let list = [
      ...investasiRows.map((r) => normalize(r, "INVESTASI")),
      ...pasarRows.map((r) => normalize(r, "PASAR")),
      ...likuiditasRows.map((r) => normalize(r, "LIKUIDITAS")),
      ...operasionalRows.map((r) => normalize(r, "OPERASIONAL")),
      ...hukumRows.map((r) => normalize(r, "HUKUM")),
      ...stratejikRows.map((r) => normalize(r, "STRATEJIK")),
      ...kepatuhanRows.map((r) => normalize(r, "KEPATUHAN")),
      ...reputasiRows.map((r) => normalize(r, "REPUTASI")),
    ];

    list = list.filter((row) => row.year === year && row.quarter === quarter);

    // FIX: Remove duplicates - keep only the one with most complete data (non-empty pembilang/penyebut)
    const seen = new Map();
    list = list.filter((row) => {
      const key = `${row.source}-${row.sectionLabel}-${row.indikator}`;
      if (seen.has(key)) {
        const existing = seen.get(key);
        // Calculate "completeness score" based on non-empty values
        const existingScore = (existing.numeratorValue ? 2 : 0) + (existing.denominatorValue ? 1 : 0);
        const currentScore = (row.numeratorValue ? 2 : 0) + (row.denominatorValue ? 1 : 0);

        // Keep the one with higher score (more complete data)
        if (currentScore > existingScore) {
          seen.set(key, row);
          return true; // Replace existing with this one
        }
        return false; // Skip this duplicate
      }
      seen.set(key, row);
      return true;
    });

    // Convert Map values back to array
    list = Array.from(seen.values());

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (r) =>
          (r.sectionLabel || "").toLowerCase().includes(q) ||
          (r.indikator || "").toLowerCase().includes(q) ||
          (r.numeratorLabel || "").toLowerCase().includes(q) ||
          (r.denominatorLabel || "").toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      if (a.source !== b.source) return a.source.localeCompare(b.source);
      const n = String(a.no || "").localeCompare(String(b.no || ""), undefined, { numeric: true });
      if (n !== 0) return n;
      return String(a.subNo || "").localeCompare(String(b.subNo || ""), undefined, { numeric: true });
    });

    return list.map((row) => ({
      id: makeRowKey({ ...row, source: row.source }),
      source: row.source,
      no: row.no,
      sectionName: row.sectionLabel,
      indikatorLabel: row.indikator,
      mainRow: row,
    }));
  }, [investasiRows, pasarRows, likuiditasRows, operasionalRows, operasionalSections, hukumRows, hukumSections, stratejikRows, stratejikSections, kepatuhanRows, kepatuhanSections, reputasiRows, reputasiSections, year, quarter, query, lastImportTime]);

  // ===== Annual Groups (untuk mode Tahunan) =====
  const annualGroups = useMemo(() => {
    // Fungsi untuk mendapatkan semua data untuk semua triwulan di tahun yang dipilih
    const normalizeAll = (r, source) => {

      const getLabel = (label) => {
        if (!label || label === "" || label === "-") return "-";
        return label;
      };


      const result = {
        source,
        year: r.year ?? year,
        quarter: r.quarter ?? quarter,
        no: r.no ?? "",
        subNo: r.subNo ?? "",
        sectionLabel: r.sectionLabel ?? r.parameter ?? "—",
        indikator: r.indikator ?? "—",
        numeratorLabel: getLabel(r.numeratorLabel ?? r.pembilangLabel ?? ""),
        numeratorValue:
          r.numeratorValue ?? r.pembilangValue ?? r.pembilang ?? "",
        denominatorLabel: getLabel(r.denominatorLabel ?? r.penyebutLabel ?? ""),
        denominatorValue:
          r.denominatorValue ?? r.penyebutValue ?? r.penyebut ?? "",
        isPercent: !!r.isPercent,
        mode: r.mode ?? "RASIO",
        formula: r.formula ?? "",
        hasil: r.hasil ?? r.result ?? "",
        hasilText: r.hasilText ?? "",
        raw: r,
      };

      return result;
    };

    // flatten operasionalSections -> indicators
    const operasionalFlattened = (Array.isArray(operasionalSections) ? operasionalSections : []).flatMap((s) => {
      const indicators = Array.isArray(s.indicators) ? s.indicators : [];
      return indicators.map((it) =>
        normalizeAll(
          {
            year: it.year,
            quarter: it.quarter,
            no: s.no,
            subNo: it.subNo,
            sectionLabel: s.parameter ?? s.sectionTitle ?? "",
            indikator: it.indikator ?? "",
            pembilangLabel: it.pembilangLabel ?? "",
            pembilangValue: it.pembilangValue ?? "",
            penyebutLabel: it.penyebutLabel ?? "",
            penyebutValue: it.penyebutValue ?? "",
            isPercent: it.isPercent,
            mode: it.mode,
            formula: it.formula,
            _sectionId: s.id,
            _indicatorId: it.id,
          },
          "OPERASIONAL"
        )
      );
    });

    const hukumFlattened = (Array.isArray(hukumSections) ? hukumSections : []).flatMap((s) => {
      const indicators = Array.isArray(s.indicators) ? s.indicators : [];
      return indicators.map((it) =>
        normalizeAll(
          {
            year: it.year ?? year,
            quarter: it.quarter ?? quarter,
            no: s.no,
            subNo: it.subNo,
            sectionLabel: s.parameter ?? "",
            indikator: it.indikator ?? "",
            pembilangLabel: it.pembilangLabel ?? it.pembilang ?? "",
            pembilangValue: it.pembilangValue ?? it.numeratorValue ?? "",
            penyebutLabel: it.penyebutLabel ?? it.penyebut ?? "",
            penyebutValue: it.penyebutValue ?? it.denominatorValue ?? "",
            isPercent: !!it.isPercent,
            mode: it.mode || "RASIO",
            formula: it.formula || "",
            hasil: it.hasil ?? it.result ?? "",
            hasilText: it.hasilText ?? "",
            peringkat: it.peringkat ?? "",
          },
          "HUKUM"
        )
      );
    });

    // Kumpulkan semua data untuk tahun yang dipilih
    // Kumpulkan semua data untuk tahun yang dipilih
    let allData = [
      ...investasiRows.map((r) => normalizeAll(r, "INVESTASI")),
      ...pasarRows.map((r) => normalizeAll(r, "PASAR")),
      ...likuiditasRows.map((r) => normalizeAll(r, "LIKUIDITAS")),
      ...operasionalRows.map((r) => normalizeAll(r, "OPERASIONAL")),
      ...hukumRows.map((r) => normalizeAll(r, "HUKUM")),
      ...stratejikRows.map((r) => normalizeAll(r, "STRATEJIK")),
      ...kepatuhanRows.map((r) => normalizeAll(r, "KEPATUHAN")),
      ...reputasiRows.map((r) => normalizeAll(r, "REPUTASI")),
    ];

    // Filter hanya data untuk tahun yang dipilih
    allData = allData.filter((row) => row.year === year);

    // Kelompokkan berdasarkan indikator unik
    const indicatorMap = {};

    allData.forEach((row) => {
      // Buat key unik untuk indikator: source + sectionName + indikatorLabel + no + subNo
      const key = `${row.source}|${row.sectionLabel}|${row.indikator}|${row.no}|${row.subNo}`;

      if (!indicatorMap[key]) {
        indicatorMap[key] = {
          source: row.source,
          sectionName: row.sectionLabel,
          indikatorLabel: row.indikator,
          no: row.no,
          subNo: row.subNo,
          quarters: {} // {Q1: {...}, Q2: {...}, ...}
        };
      }

      // Tambahkan data untuk quarter ini
      indicatorMap[key].quarters[row.quarter] = row;
    });

    // Konversi ke array dan filter berdasarkan selectedSources dan selectedSections
    let result = Object.values(indicatorMap);

    // Filter berdasarkan selectedSources
    result = result.filter((item) => selectedSources.includes(item.source));

    // Filter berdasarkan selectedSections
    result = result.filter((item) => {
      const selected = selectedSections[item.source];
      if (!selected || selected.length === 0) return true;
      return selected.includes(item.sectionName);
    });

    // Urutkan berdasarkan source lalu nomor
    result.sort((a, b) => {
      if (a.source !== b.source) {
        const aIndex = SOURCE_ORDER.indexOf(a.source);
        const bIndex = SOURCE_ORDER.indexOf(b.source);
        return aIndex - bIndex;
      }

      // Urutkan berdasarkan no dan subNo
      const aNo = String(a.no || "");
      const bNo = String(b.no || "");
      const noCompare = aNo.localeCompare(bNo, undefined, { numeric: true });
      if (noCompare !== 0) return noCompare;

      const aSubNo = String(a.subNo || "");
      const bSubNo = String(b.subNo || "");
      return aSubNo.localeCompare(bSubNo, undefined, { numeric: true });
    });

    return result;
  }, [
    investasiRows,
    pasarRows,
    likuiditasRows,
    operasionalRows,
    operasionalSections,
    hukumRows,
    hukumSections,
    stratejikRows,
    stratejikSections,
    kepatuhanRows,
    kepatuhanSections,
    reputasiSections,
    year,
    selectedSources,
    selectedSections
  ]);

  // ===== Visible Groups (filtered by selected sources and sections) =====
  const visibleGroups = useMemo(() => {
    return combinedGroups
      .filter((g) => selectedSources.includes(g.source))
      .filter((g) => {
        const selected = selectedSections[g.source];
        if (!selected || selected.length === 0) return true;
        return selected.includes(g.sectionName);
      })
      .filter((g) => {
        // Filter hanya data yang isFinal: true (data asli user, bukan auto-clone)
        // Jika isFinal undefined, anggap true untuk backward compatibility
        const isFinal = g.mainRow?.isFinal;
        return isFinal === undefined || isFinal === true;
      });
  }, [combinedGroups, selectedSources, selectedSections]);

  // ===== Section Options by Source =====
  const sectionOptionsBySource = useMemo(() => {
    const map = {};
    combinedGroups.forEach((g) => {
      if (!selectedSources.includes(g.source)) return;
      map[g.source] = map[g.source] || new Set();
      map[g.source].add(g.sectionName);
    });
    return Object.fromEntries(
      Object.entries(map).map(([k, v]) => [k, Array.from(v)])
    );
  }, [combinedGroups, selectedSources]);

  // ===== Handle Change Value (Edit Inline) =====
  // GANTI SELURUH FUNGSI handleChangeValue mulai dari baris ~450
  const handleChangeValue = (rowKey, field, raw) => {
    // Define yearStr and quarterStr from state
    const yearStr = String(year);
    const quarterStr = String(quarter);

    // Parse rowKey to get all parts
    const parts = rowKey.split("|");
    const [src] = parts;
    const noStr = parts[3] ?? "";
    const subNoStr = parts[4] ?? "";

    const isPasar = src === "PASAR";
    const isLikuiditas = src === "LIKUIDITAS";
    const isOperasional = src === "OPERASIONAL";
    const isHukum = src === "HUKUM";
    const isStratejik = src === "STRATEJIK";
    const isKepatuhan = src === "KEPATUHAN";
    const isReputasi = src === "REPUTASI";

    // For KEPATUHAN, we need to determine if it's from flat rows or nested sections
    // Check if the rowKey format indicates flat structure (has year/quarter in the key)
    const isKepatuhanFlat = isKepatuhan && kepatuhanRows.some(r =>
      makeRowKey({ ...r, source: "KEPATUHAN" }) === rowKey
    );

    // For REPUTASI, we need to determine if it's from flat rows or nested sections
    const isReputasiFlat = isReputasi && reputasiRows.some(r =>
      makeRowKey({ ...r, source: "REPUTASI" }) === rowKey
    );

    // For HUKUM, we need to determine if it's from flat rows or nested sections
    const isHukumFlat = isHukum && hukumRows.some(r =>
      makeRowKey({ ...r, source: "HUKUM" }) === rowKey
    );

    // Use setKepatuhanRows for flat structure, setKepatuhanSections for nested
    const setter = isPasar ? setPasarRows :
      isLikuiditas ? setLikuiditasRows :
        isOperasional ? setOperasionalRows :
          isHukumFlat ? setHukumRows :
            isHukum ? setHukumSections :
              isStratejik ? setStratejikSections :
                isKepatuhanFlat ? setKepatuhanRows :
                  isKepatuhan ? setKepatuhanSections :
                    isReputasiFlat ? setReputasiRows :
                      isReputasi ? setReputasiSections :
                        setInvestasiRows;

    if (isHukum) {
      const parts = rowKey.split("|");
      const parsed = {
        year: parts[1] ?? "",
        quarter: parts[2] ?? "",
        no: parts[3] ?? "",
        subNo: parts[4] ?? "",
        sectionLabel: parts[5] ?? "",
        indikator: parts[6] ?? "",
      };

      setter((prevSections) => {
        const next = (prevSections || []).map((s) => {
          const matchSection =
            String(s.no ?? "") === String(parsed.no) ||
            (s.parameter ?? "") === parsed.sectionLabel;

          if (!matchSection) return s;

          const nextIndicators = (s.indicators || []).map((it) => {
            const matchIndicator =
              String(it.subNo ?? "") === String(parsed.subNo) &&
              (
                String(it.indikator ?? "") === String(parsed.indikator) ||
                parsed.indikator === "" ||
                (it.indikator || "").includes(parsed.indikator)
              );

            if (!matchIndicator) return it;

            const updated = { ...it };

            if (field === "numeratorValue" || field === "pembilangValue") {
              updated.numeratorValue = raw;
              updated.pembilangValue = raw;
            } else if (field === "denominatorValue" || field === "penyebutValue") {
              updated.denominatorValue = raw;
              updated.penyebutValue = raw;
            } else {
              updated[field] = raw;
            }

            updated.year = updated.year ?? year;
            updated.quarter = updated.quarter ?? quarter;

            try {
              const hasilBaru = computeHasilFromValues({
                ...updated,
                numeratorValue: updated.numeratorValue ?? updated.pembilangValue,
                denominatorValue: updated.denominatorValue ?? updated.penyebutValue,
                pembilangValue: updated.pembilangValue ?? updated.numeratorValue,
                penyebutValue: updated.penyebutValue ?? updated.denominatorValue,
                formula: updated.formula,
                mode: updated.mode,
              });
              updated.hasil =
                hasilBaru === "" || hasilBaru == null ? "" : hasilBaru;

              updated.peringkat = calculatePeringkat(hasilBaru, {
                low: updated.low,
                lowToModerate: updated.lowToModerate,
                moderate: updated.moderate,
                moderateToHigh: updated.moderateToHigh,
                high: updated.high,
              });
            } catch (e) {
              updated.hasil = updated.hasil ?? "";
            }

            return updated;
          });

          return { ...s, indicators: nextIndicators };
        });

        try {
          localStorage.setItem(HUKUM_SECTIONS_LS, JSON.stringify(next));
          window.dispatchEvent(
            new CustomEvent("hukumSections:changed", { detail: next })
          );
          window.dispatchEvent(
            new CustomEvent("hukumIndicator:update", {
              detail: {
                key: rowKey,
                field,
                value: raw,
              },
            })
          );
        } catch (e) {
          console.warn("Gagal persist hukumSections dari RekapData", e);
        }

        return next;
      });
      return;
    }

    // Dalam handleChangeValue di bagian STRATEJIK - sederhana seperti Investasi
    if (isStratejik) {
      setStratejikRows((prevRows) => {
        const updatedRows = prevRows.map((row) => {
          const rowKeyForComparison = `STRATEJIK|${row.year}|${row.quarter}|${row.no}|${row.subNo}|${row.sectionLabel}|${row.indikator}`;

          if (rowKeyForComparison === rowKey) {
            const updated = { ...row };

            // Update field dengan alias support
            if (field === "numeratorValue" || field === "pembilangValue") {
              updated.numeratorValue = raw;
              updated.pembilangValue = raw;
            } else if (field === "denominatorValue" || field === "penyebutValue") {
              updated.denominatorValue = raw;
              updated.penyebutValue = raw;
            } else {
              updated[field] = raw;
            }

            // Recalculate hasil dan peringkat
            if (field === 'numeratorValue' || field === 'denominatorValue' || field === 'formula') {
              const hasilBaru = computeHasilFromValues({
                numeratorValue: updated.numeratorValue ?? updated.pembilangValue ?? "",
                denominatorValue: updated.denominatorValue ?? updated.penyebutValue ?? "",
                pembilangValue: updated.pembilangValue ?? updated.numeratorValue ?? "",
                penyebutValue: updated.penyebutValue ?? updated.denominatorValue ?? "",
                formula: updated.formula ?? "",
                mode: updated.mode ?? "RASIO",
              });

              updated.hasil = hasilBaru === "" ? "" : hasilBaru;

              if (updated.mode !== "TEKS") {
                updated.peringkat = calculatePeringkat(hasilBaru, {
                  low: updated.low,
                  lowToModerate: updated.lowToModerate,
                  moderate: updated.moderate,
                  moderateToHigh: updated.moderateToHigh,
                  high: updated.high,
                }, updated.isPercent || false, updated.mode || 'RASIO');
              }
            }

            return updated;
          }

          return row;
        });

        // ✅ FIX: Simpan SETELAH semua update selesai
        try {
          localStorage.setItem("stratejikRows", JSON.stringify(updatedRows));

          // ✅ CRITICAL: Dispatch event DENGAN data lengkap
          const updatedRow = updatedRows.find(row => {
            const rowKeyForComparison = `STRATEJIK|${row.year}|${row.quarter}|${row.no}|${row.subNo}|${row.sectionLabel}|${row.indikator}`;
            return rowKeyForComparison === rowKey;
          });

          if (updatedRow) {
            window.dispatchEvent(new CustomEvent("stratejikRows:updateFromRekap", {
              detail: {
                rowKey,
                field,
                value: raw,
                hasil: updatedRow.hasil,
                peringkat: updatedRow.peringkat
              }
            }));
          }
        } catch (e) {
          console.error("[REKAPDATA] STRATEJIK persist error:", e);
        }

        return updatedRows;
      });

      return;
    }

    // KEPATUHAN: Only handle nested structure here (kepatuhanSections)
    // Flat structure (kepatuhanRows) will fall through to default handler
    if (isKepatuhan && !isKepatuhanFlat) {
      const parts = rowKey.split("|");
      const parsed = {
        year: parts[1] ?? "",
        quarter: parts[2] ?? "",
        no: parts[3] ?? "",
        subNo: parts[4] ?? "",
        sectionLabel: parts[5] ?? "",
        indikator: parts[6] ?? "",
      };

      setter((prevSections) => {
        const next = (prevSections || []).map((s) => {
          const matchSection =
            String(s.no ?? "") === String(parsed.no) ||
            (s.parameter ?? s.sectionTitle ?? "") === parsed.sectionLabel;

          if (!matchSection) return s;

          const nextIndicators = (s.indicators || []).map((indicator) => {
            const matchIndicator =
              String(indicator.year ?? "") === String(parsed.year) &&
              String(indicator.quarter ?? "") === String(parsed.quarter) &&
              String(indicator.subNo ?? "") === String(parsed.subNo) &&
              (
                String(indicator.indikator ?? "") === String(parsed.indikator) ||
                parsed.indikator === "" ||
                (indicator.indikator || "").includes(parsed.indikator)
              );

            if (!matchIndicator) return indicator;

            const updated = { ...indicator };

            if (field === "numeratorValue" || field === "pembilangValue") {
              updated.numeratorValue = raw;
              updated.pembilangValue = raw;
            } else if (field === "denominatorValue" || field === "penyebutValue") {
              updated.denominatorValue = raw;
              updated.penyebutValue = raw;
            } else {
              updated[field] = raw;
            }

            const dataForCalc = {
              numeratorValue: updated.numeratorValue ?? updated.pembilangValue ?? "",
              denominatorValue: updated.denominatorValue ?? updated.penyebutValue ?? "",
              pembilangValue: updated.pembilangValue ?? updated.numeratorValue ?? "",
              penyebutValue: updated.penyebutValue ?? updated.denominatorValue ?? "",
              formula: updated.formula ?? "",
              mode: updated.mode ?? "RASIO",
              isPercent: true,
            };

            try {
              const hasilBaru = computeHasilFromValues(dataForCalc);

              updated.hasil = hasilBaru === "" || hasilBaru == null ? "" : hasilBaru;
              updated.isPercent = true;

              updated.peringkat = calculatePeringkat(
                hasilBaru,
                {
                  low: updated.low,
                  lowToModerate: updated.lowToModerate,
                  moderate: updated.moderate,
                  moderateToHigh: updated.moderateToHigh,
                  high: updated.high,
                },
                true
              );

            } catch (e) {
              console.error('[KEPATUHAN] Calculation error:', e);
              updated.hasil = updated.hasil ?? "";
            }

            return updated;
          });

          return { ...s, indicators: nextIndicators };
        });

        try {
          localStorage.setItem(KEPATUHAN_SECTIONS_LS, JSON.stringify(next));
          window.dispatchEvent(new CustomEvent("kepatuhanSections:changed", { detail: next }));
          window.dispatchEvent(new CustomEvent("kepatuhanIndicator:update", {
            detail: { key: rowKey, field, value: raw }
          }));

        } catch (e) {
          console.error("[KEPATUHAN] Persist error:", e);
        }

        return next;
      });

      return;
    }

    // REPUTASI: Only handle nested structure here (reputasiSections)
    // Flat structure (reputasiRows) will fall through to default handler
    if (isReputasi && !isReputasiFlat) {
      const parts = rowKey.split("|");
      const parsed = {
        year: parts[1] ?? "",
        quarter: parts[2] ?? "",
        no: parts[3] ?? "",
        subNo: parts[4] ?? "",
        sectionLabel: parts[5] ?? "",
        indikator: parts[6] ?? "",
      };

      setter((prevSections) => {
        const next = (prevSections || []).map((s) => {
          const matchSection =
            String(s.no ?? "") === String(parsed.no) ||
            (s.parameter ?? s.sectionTitle ?? "") === parsed.sectionLabel;

          if (!matchSection) return s;

          const nextIndicators = (s.indicators || []).map((it) => {
            const matchIndicator =
              String(it.year ?? "") === String(parsed.year) &&
              String(it.quarter ?? "") === String(parsed.quarter) &&
              String(it.subNo ?? "") === String(parsed.subNo) &&
              (
                String(it.indikator ?? "") === String(parsed.indikator) ||
                parsed.indikator === "" ||
                (it.indikator || "").includes(parsed.indikator)
              );

            if (!matchIndicator) return it;

            const updated = { ...it };

            if (field === "numeratorValue" || field === "pembilangValue") {
              updated.numeratorValue = raw;
              updated.pembilangValue = raw;
            } else if (field === "denominatorValue" || field === "penyebutValue") {
              updated.denominatorValue = raw;
              updated.penyebutValue = raw;
            } else {
              updated[field] = raw;
            }

            updated.year = updated.year ?? it.year;
            updated.quarter = updated.quarter ?? it.quarter;

            const dataForCalc = {
              numeratorValue: updated.numeratorValue ?? updated.pembilangValue ?? "",
              denominatorValue: updated.denominatorValue ?? updated.penyebutValue ?? "",
              pembilangValue: updated.pembilangValue ?? updated.numeratorValue ?? "",
              penyebutValue: updated.penyebutValue ?? updated.denominatorValue ?? "",
              formula: updated.formula ?? "",
              mode: updated.mode ?? "RASIO",
              isPercent: updated.isPercent ?? false,
            };

            try {
              const hasilBaru = computeHasilFromValues(dataForCalc);

              updated.hasil = hasilBaru === "" || hasilBaru == null ? "" : hasilBaru;

              updated.peringkat = calculatePeringkat(
                hasilBaru,
                {
                  low: updated.low,
                  lowToModerate: updated.lowToModerate,
                  moderate: updated.moderate,
                  moderateToHigh: updated.moderateToHigh,
                  high: updated.high,
                },
                updated.isPercent ?? false
              );

            } catch (e) {
              console.error('[REPUTASI] Calculation error:', e);
              updated.hasil = updated.hasil ?? "";
            }

            return updated;
          });

          return { ...s, indicators: nextIndicators };
        });

        try {
          localStorage.setItem(REPUTASI_SECTIONS_LS, JSON.stringify(next));
          window.dispatchEvent(
            new CustomEvent("reputasiSections:changed", { detail: next })
          );
          window.dispatchEvent(
            new CustomEvent("reputasiIndicator:update", {
              detail: {
                key: rowKey,
                field,
                value: raw,
              },
            })
          );

        } catch (e) {
          console.warn("Gagal persist reputasiSections dari RekapData", e);
        }

        return next;
      });
      return;
    }

    // ✅ FIX: Non-operasional sources dengan risk levels preserved
    setter((prev) => {
      const next = prev.map((r) => {
        const candidateKey = makeRowKey({
          ...r,
          source: isPasar ? "PASAR" : isLikuiditas ? "LIKUIDITAS" : isOperasional ? "OPERASIONAL" : isKepatuhan ? "KEPATUHAN" : isReputasi ? "REPUTASI" : "INVESTASI",
        });

        if (candidateKey !== rowKey) return r;

        // ✅ FIX: PRESERVE ALL FIELDS including risk levels
        const updatedRow = {
          ...r,  // ← CRITICAL: Keep ALL existing fields
          [field]: raw
        };

        if (field === "numeratorValue") {
          updatedRow.pembilangValue = raw;
        }
        if (field === "denominatorValue") {
          updatedRow.penyebutValue = raw;
        }

        // Handle hasilText untuk TEKS mode
        if (field === "hasilText" && updatedRow.mode === "TEKS") {
          try {
            const riskLevels = {
              low: updatedRow.low || "",
              lowToModerate: updatedRow.lowToModerate || "",
              moderate: updatedRow.moderate || "",
              moderateToHigh: updatedRow.moderateToHigh || "",
              high: updatedRow.high || "",
            };

            let newPeringkat = 0;

            if (isNumericRiskLevels(riskLevels)) {
              const hasilNum = parseFloat(raw);
              if (!isNaN(hasilNum)) {
                newPeringkat = calculatePeringkat(
                  hasilNum / 100,
                  riskLevels,
                  true
                );
              }
            } else {
              newPeringkat = calculatePeringkatFromText(raw, riskLevels);
            }

            updatedRow.peringkat = newPeringkat;
          } catch (err) {
            console.warn('[REKAPDATA] TEKS peringkat calculation failed:', err);
          }
        }

        const hasilBaru = computeHasilFromValues({
          ...updatedRow,
          numeratorValue: updatedRow.numeratorValue ?? updatedRow.pembilangValue,
          denominatorValue: updatedRow.denominatorValue ?? updatedRow.penyebutValue,
          pembilangValue: updatedRow.pembilangValue ?? updatedRow.numeratorValue,
          penyebutValue: updatedRow.penyebutValue ?? updatedRow.denominatorValue,
          formula: updatedRow.formula,
          mode: updatedRow.mode,
        });

        // ✅ Hitung peringkat dengan risk levels yang PRESERVED
        const newPeringkat = updatedRow.mode === "TEKS"
          ? updatedRow.peringkat
          : calculatePeringkat(hasilBaru, {
            low: updatedRow.low || "",
            lowToModerate: updatedRow.lowToModerate || "",
            moderate: updatedRow.moderate || "",
            moderateToHigh: updatedRow.moderateToHigh || "",
            high: updatedRow.high || "",
          }, updatedRow.isPercent || false);

        return {
          ...updatedRow,
          hasil: hasilBaru === "" || hasilBaru == null ? "" : hasilBaru,
          peringkat: newPeringkat,
        };
      });

      try {
        if (isPasar) {
          localStorage.setItem(PASAR_LS, JSON.stringify(next));
          window.dispatchEvent(new CustomEvent("pasarRows:changed", { detail: next }));
        } else if (isLikuiditas) {
          localStorage.setItem("likuiditasRows", JSON.stringify(next));
          localStorage.setItem(REKAP_LIKUIDITAS_LS, JSON.stringify(next));

          window.dispatchEvent(new CustomEvent("likuiditasRows:changed", { detail: next }));

          const updatedItem = next.find(nr =>
            makeRowKey({ ...nr, source: "LIKUIDITAS" }) === rowKey ||
            (nr.id && rowKey.includes(nr.id))
          );

          window.dispatchEvent(new CustomEvent("likuiditasRows:update", {
            detail: {
              itemId: updatedItem?.id ?? null,
              key: rowKey,
              field,
              value: raw,
            }
          }));

        } else if (isOperasional) {
          localStorage.setItem("operasionalRows", JSON.stringify(next));
          window.dispatchEvent(new CustomEvent("operasionalRows:changed", { detail: next }));
          window.dispatchEvent(new CustomEvent("operasionalRow:update", {
            detail: { key: rowKey, field, value: raw }
          }));
        } else if (isHukum) {
          localStorage.setItem("hukumRows", JSON.stringify(next));
          window.dispatchEvent(new CustomEvent("hukumRows:changed", { detail: next }));
          window.dispatchEvent(new CustomEvent("hukumRow:update", {
            detail: { key: rowKey, field, value: raw }
          }));
        } else if (isKepatuhan) {
          localStorage.setItem("kepatuhanRows", JSON.stringify(next));
          window.dispatchEvent(new CustomEvent("kepatuhanRows:changed", { detail: next }));
          window.dispatchEvent(new CustomEvent("kepatuhanRow:update", {
            detail: { key: rowKey, field, value: raw }
          }));
        } else if (isReputasi) {
          localStorage.setItem("reputasiRows", JSON.stringify(next));
          window.dispatchEvent(new CustomEvent("reputasiRows:changed", { detail: next }));
          window.dispatchEvent(new CustomEvent("reputasiRow:update", {
            detail: { key: rowKey, field, value: raw }
          }));
        } else {
          localStorage.setItem(INVESTASI_LS, JSON.stringify(next));
          window.dispatchEvent(new CustomEvent("investasiRows:changed", { detail: next }));
          window.dispatchEvent(new CustomEvent("investasiRow:update", {
            detail: { key: rowKey, field, value: raw }
          }));
        }
      } catch (e) {
        console.warn("Gagal persist perubahan row:", e);
      }
      return next;
    });
  };

  // ===== Export Handler =====
  const handleExport = () => {
    // Buka dialog, bukan langsung export
    setExportDialogOpen(true);
  };

  const handleExportConfirm = () => {
    // Use appropriate data based on mode
    let dataToExport;
    if (activeTab === "tahunan") {
      // Tahunan mode: use annualGroups which has quarters property
      dataToExport = annualGroups;
    } else {
      // Triwulan mode: use visibleGroups but add quarters property from mainRow
      dataToExport = visibleGroups.map(g => {
        // Build quarters object from mainRow
        const quarters = {};
        if (g.mainRow) {
          quarters[g.mainRow.quarter] = g.mainRow;
        }
        return {
          ...g,
          quarters,
          mainRow: g.mainRow || {},
          // Extract mode from mainRow so export can determine row structure
          mode: g.mainRow?.mode || "RASIO"
        };
      });
    }

    exportRekapDataToExcel(
      dataToExport,
      year,
      quarter,
      activeTab,
      exportFormatOptions,
      selectedQuarters
    );
    setExportDialogOpen(false);
  };

  const handleExportCancel = () => {
    setExportDialogOpen(false);
  };

  // ===== Import Handler =====
  const [importing, setImporting] = useState(false);

  // Helper function to log import details in a readable format
  const logImportDetails = (updates, year, quarter) => {
    console.log('%c=== MERGED DATA FOR STORAGE ===', 'color: #0068B3; font-weight: bold; font-size: 14px');
    console.log(`📅 Target: ${year} - ${quarter}`);
    console.log(`⏰ Timestamp: ${new Date().toLocaleString()}`);

    // Log each category with formatted details
    const categories = [
      { name: 'INVESTASI', rows: updates.investasiRows },
      { name: 'PASAR', rows: updates.pasarRows },
      { name: 'LIKUIDITAS', rows: updates.likuiditasRows },
      { name: 'OPERASIONAL', rows: updates.operasionalRows },
      { name: 'HUKUM', rows: updates.hukumRows },
      { name: 'STRATEJIK', rows: updates.stratejikRows },
      { name: 'KEPATUHAN', rows: updates.kepatuhanRows },
      { name: 'REPUTASI', rows: updates.reputasiRows },
    ];

    categories.forEach(cat => {
      if (cat.rows.length > 0) {
        console.groupCollapsed(`📊 ${cat.name} (${cat.rows.length} rows)`);
        cat.rows.forEach((row, idx) => {
          const logEntry = {
            '': `[${idx + 1}] ${row.indikator}`,
            section: row.sectionLabel,
            hasil: typeof row.hasil === 'number' ? (row.isPercent ? `${(row.hasil * 100).toFixed(2)}%` : row.hasil.toFixed(2)) : row.hasil,
            peringkat: row.peringkat,
            mode: row.mode,
            pembilang: row.numeratorValue ?? '-',
            penyebut: row.denominatorValue ?? '-',
          };
          console.table(logEntry);
        });
        console.groupEnd();
      }
    });

    // Log nested sections separately
    const sectionCategories = [
      { name: 'HUKUM (sections)', sections: updates.hukumSections },
      { name: 'OPERASIONAL (sections)', sections: updates.operasionalSections },
      { name: 'STRATEJIK (sections)', sections: updates.stratejikSections },
      { name: 'KEPATUHAN (sections)', sections: updates.kepatuhanSections },
      { name: 'REPUTASI (sections)', sections: updates.reputasiSections },
    ];

    sectionCategories.forEach(cat => {
      if (cat.sections.length > 0) {
        console.groupCollapsed(`🗂️ ${cat.name} (${cat.sections.length} sections)`);
        cat.sections.forEach((section, idx) => {
          console.log(`[${idx + 1}] ${section.parameter}`, {
            year: section.year,
            quarter: section.quarter,
            indicatorsCount: section.indicators?.length || 0,
            indicators: section.indicators?.map(ind => ({
              name: ind.indikator,
              hasil: ind.hasil,
              peringkat: ind.peringkat,
            }))
          });
        });
        console.groupEnd();
      }
    });

    console.log('%c=== DATA READY FOR STORAGE ===', 'color: #10B981; font-weight: bold; font-size: 14px');
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);

    try {
      // Import data dari Excel
      const updates = await importRekapDataFromExcel(file, visibleGroups, year, quarter);

      console.log('%c=== IMPORT STRATEGY: REPLACE MODE ===', 'color: #F59E0B; font-weight: bold; font-size: 14px');
      console.log('📅 Target Period:', { year, quarter });
      console.log('🔄 Strategy: Replace all data for this period');

      // STRATEGY: REPLACE semua data untuk periode ini, bukan merge
      const replaceDataForPeriod = (key, newData, setState, eventName) => {
        if (newData.length === 0) {
          console.log(`⏭️ [${key}] No new data, skipping`);
          return 0;
        }

        try {
          // 1. Load existing data
          const raw = localStorage.getItem(key);
          const existingData = raw ? JSON.parse(raw) : [];

          // 2. Remove OLD data for this period
          const otherPeriods = existingData.filter(row =>
            !(row.year === year && row.quarter === quarter)
          );

          // ✅ ENHANCED: Log sample new data untuk verify
          if (newData.length > 0) {
            console.log(`[${key}] Sample new data (first row):`, {
              source: newData[0].source,
              indikator: newData[0].indikator,
              bobotSection: newData[0].bobotSection || '(empty)',
              bobotIndikator: newData[0].bobotIndikator || '(empty)',
              sumberRisiko: newData[0].sumberRisiko ? 'HAS_DATA' : 'EMPTY',
              dampak: newData[0].dampak ? 'HAS_DATA' : 'EMPTY',
            });
          }

          // 3. Add NEW data for this period
          const finalData = [...otherPeriods, ...newData];

          // 4. Deduplicate (just in case)
          const dedupMap = new Map();
          finalData.forEach(row => {
            const dedupKey = `${row.source}-${row.sectionLabel}-${row.indikator}-${row.year}-${row.quarter}`;
            dedupMap.set(dedupKey, row); // Last one wins
          });
          const deduped = Array.from(dedupMap.values());

          // 5. Save
          localStorage.setItem(key, JSON.stringify(deduped));
          setState(deduped);
          window.dispatchEvent(new CustomEvent(eventName, { detail: deduped }));

          console.log(`✅ [${key}] Replaced ${existingData.length - otherPeriods.length} old rows with ${newData.length} new rows (Total: ${deduped.length})`);
          return newData.length;

        } catch (e) {
          console.error(`❌ [${key}] Error:`, e);
          return 0;
        }
      };

      let totalImported = 0;

      // Replace data untuk flat rows
      totalImported += replaceDataForPeriod(INVESTASI_LS, updates.investasiRows, setInvestasiRows, "investasiRows:changed");
      totalImported += replaceDataForPeriod(PASAR_LS, updates.pasarRows, setPasarRows, "pasarRows:changed");
      totalImported += replaceDataForPeriod("likuiditasRows", updates.likuiditasRows, setLikuiditasRows, "likuiditasRows:changed");
      totalImported += replaceDataForPeriod("operasionalRows", updates.operasionalRows, setOperasionalRows, "operasionalRows:changed");
      totalImported += replaceDataForPeriod("hukumRows", updates.hukumRows, setHukumRows, "hukumRows:changed");
      totalImported += replaceDataForPeriod("stratejikRows", updates.stratejikRows, setStratejikRows, "stratejikRows:changed");
      totalImported += replaceDataForPeriod("kepatuhanRows", updates.kepatuhanRows, setKepatuhanRows, "kepatuhanRows:changed");
      totalImported += replaceDataForPeriod("reputasiRows", updates.reputasiRows, setReputasiRows, "reputasiRows:changed");

      // Replace data untuk nested sections
      const replaceSectionsForPeriod = (key, newSections, setState, eventName) => {
        if (newSections.length === 0) {
          console.log(`⏭️ [${key}] No new sections, skipping`);
          return 0;
        }

        try {
          const raw = localStorage.getItem(key);
          const existingSections = raw ? JSON.parse(raw) : [];

          // Remove old sections for this period
          const otherPeriods = existingSections.filter(section =>
            !(section.year === year && section.quarter === quarter)
          );

          // Add new sections
          const finalSections = [...otherPeriods, ...newSections];

          localStorage.setItem(key, JSON.stringify(finalSections));
          setState(finalSections);
          window.dispatchEvent(new CustomEvent(eventName, { detail: finalSections }));

          console.log(`✅ [${key}] Replaced ${existingSections.length - otherPeriods.length} old sections with ${newSections.length} new sections`);
          return newSections.length;

        } catch (e) {
          console.error(`❌ [${key}] Error:`, e);
          return 0;
        }
      };

      totalImported += replaceSectionsForPeriod(HUKUM_SECTIONS_LS, updates.hukumSections, setHukumSections, "hukumSections:changed");
      totalImported += replaceSectionsForPeriod(OPERASIONAL_SECTIONS_LS, updates.operasionalSections, setOperasionalSections, "operasionalSections:changed");
      totalImported += replaceSectionsForPeriod(STRATEJIK_SECTIONS_LS, updates.stratejikSections, setStratejikSections, "stratejikSections:changed");
      totalImported += replaceSectionsForPeriod(KEPATUHAN_SECTIONS_LS, updates.kepatuhanSections, setKepatuhanSections, "kepatuhanSections:changed");
      totalImported += replaceSectionsForPeriod(REPUTASI_SECTIONS_LS, updates.reputasiSections, setReputasiSections, "reputasiSections:changed");

      console.log('%c=== IMPORT COMPLETE ===', 'color: #10B981; font-weight: bold; font-size: 14px');
      console.log(`✅ Total items imported: ${totalImported}`);

      // Alert dengan hasil
      const alertMsg = `✅ Berhasil mengimpor data untuk ${quarter} ${year}:\n\n` +
        `• ${updates.investasiRows.length} indikator Investasi\n` +
        `• ${updates.pasarRows.length} indikator Pasar\n` +
        `• ${updates.likuiditasRows.length} indikator Likuiditas\n` +
        `• ${updates.operasionalRows.length} indikator Operasional\n` +
        `• ${updates.hukumRows.length} indikator Hukum\n` +
        `• ${updates.stratejikRows.length} indikator Stratejik\n` +
        `• ${updates.kepatuhanRows.length} indikator Kepatuhan\n` +
        `• ${updates.reputasiRows.length} indikator Reputasi\n\n` +
        `Data lama untuk periode ini telah digantikan.`;

      alert(alertMsg);

      // Force re-render
      setLastImportTime(Date.now());

    } catch (error) {
      console.error("Import error:", error);
      alert(`❌ Error: ${error.message || "Gagal mengimpor file Excel. Pastikan format file benar."}`);
    } finally {
      setImporting(false);
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  // ===== Fungsi renderTahunanTable untuk mode Tahunan =====

  const renderTahunanTable = () => {
    if (annualGroups.length === 0) {
      return (
        <div className="p-6 text-center text-gray-500">
          Tidak ada data untuk sumber dan section yang dipilih pada tahun {year}.
        </div>
      );
    }

    const bySource = {};
    annualGroups.forEach((item) => {
      bySource[item.source] = bySource[item.source] || [];
      bySource[item.source].push(item);
    });

    const sourcesOrder = SOURCE_ORDER.filter(
      (s) => bySource[s] && bySource[s].length
    );

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-[#1f4e79] text-white px-2 py-2 w-20 text-base font-semibold"></th>
              <th
                className="border border-gray-300 bg-[#1f4e79] text-white px-2 py-2 text-center text-base font-semibold"
                colSpan={2}
              >
                Parameter atau Indikator
              </th>

              {QUARTER_ORDER
                .filter(
                  (q) =>
                    selectedQuarters.length === 0 ||
                    selectedQuarters.includes(q)
                )
                .map((q) => (
                  <th
                    key={q}
                    className="border border-gray-300 bg-[#1f4e79] text-white px-2 py-2 text-center w-40 text-base font-semibold"
                  >
                    {QUARTER_LABEL[q]} {year}
                  </th>
                ))}
            </tr>
          </thead>

          <tbody>
            {sourcesOrder.flatMap((source) => {
              const indicators = bySource[source];
              const totalRowsForSource = indicators.length * 3;
              let firstForSource = true;

              return indicators.flatMap((indicator, indicatorIndex) => {  // ← TAMBAHKAN indicatorIndex
                const isFirst = firstForSource;
                firstForSource = false;

                // 🔹 GUNAKAN makeStableKey dengan index untuk uniqueness
                const stableKey = makeStableKey(
                  source,
                  indicator.sectionName,
                  indicator.indikatorLabel,
                  indicator.no,
                  indicator.subNo,
                  indicatorIndex  // ← PASS INDEX
                );

                return [
                  // BARIS HASIL
                  <tr key={`${stableKey}-hasil`} className="bg-[#cfe2f3]">
                    {isFirst && (
                      <td
                        rowSpan={totalRowsForSource}
                        className="border border-gray-300 px-2 py-2 align-middle text-center font-bold text-base bg-[#e6f4ff]"
                        style={{
                          writingMode: "vertical-rl",
                          transform: "rotate(180deg)",
                          letterSpacing: "0.18em",
                          width: 80,
                          minWidth: 80,
                        }}
                      >
                        {source}
                      </td>
                    )}

                    <td
                      rowSpan={3}
                      className="border border-gray-300 px-2 py-2 align-middle text-left bg-[#e6f4ff]"
                      style={{ width: '300px', maxWidth: '300px' }}
                    >
                      <div className="text-base font-semibold text-gray-900 leading-tight">
                        {indicator.sectionName}
                      </div>
                    </td>

                    <td className="border border-gray-300 px-4 py-3">
                      <div className="text-base font-bold text-gray-700 leading-relaxed">
                        {indicator.indikatorLabel}
                      </div>
                    </td>

                    {QUARTER_ORDER
                      .filter(
                        (q) =>
                          selectedQuarters.length === 0 ||
                          selectedQuarters.includes(q)
                      )
                      .map((q) => {
                        const d = indicator.quarters[q];
                        return (
                          <td
                            key={`${stableKey}-hasil-${q}`}
                            className="border border-gray-300 px-4 py-3 text-right bg-[#e6f4ff]"
                          >
                            {d
                              ? d.isPercent
                                ? `${(Number(d.hasil) * 100).toFixed(2)}%`
                                : fmtNumber(d.hasil)
                              : "-"}
                          </td>
                        );
                      })}
                  </tr>,

                  // BARIS PEMBILANG
                  <tr key={`${stableKey}-pembilang`} className="bg-white">
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                      {indicator.quarters.Q1?.numeratorLabel || "Pembilang"}
                    </td>

                    {QUARTER_ORDER
                      .filter(
                        (q) =>
                          selectedQuarters.length === 0 ||
                          selectedQuarters.includes(q)
                      )
                      .map((q) => {
                        const d = indicator.quarters[q];
                        return (
                          <td
                            key={`${stableKey}-num-${q}`}
                            className="border border-gray-300 px-3 py-2 text-right"
                          >
                            {d?.numeratorValue != null
                              ? fmtNumber(d.numeratorValue)
                              : "-"}
                          </td>
                        );
                      })}
                  </tr>,

                  // BARIS PENYEBUT
                  <tr key={`${stableKey}-penyebut`} className="bg-white">
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                      {indicator.quarters.Q1?.denominatorLabel || "Penyebut"}
                    </td>

                    {QUARTER_ORDER
                      .filter(
                        (q) =>
                          selectedQuarters.length === 0 ||
                          selectedQuarters.includes(q)
                      )
                      .map((q) => {
                        const d = indicator.quarters[q];
                        return (
                          <td
                            key={`${stableKey}-den-${q}`}
                            className="border border-gray-300 px-3 py-2 text-right"
                          >
                            {d?.denominatorValue != null
                              ? fmtNumber(d.denominatorValue)
                              : "-"}
                          </td>
                        );
                      })}
                  </tr>,
                ];
              });
            })}
          </tbody>
        </table>
      </div>
    );
  };


  // FIX: Pindahkan useEffect ini sebelum return statement (melanggar aturan React Hook)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sectionFilterOpen && !e.target.closest('.section-dropdown-container')) {
        setSectionFilterOpen(false);
      }
    };

    if (sectionFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sectionFilterOpen]);

  // ===== RENDER =====
  return (
    <div className="p-6 bg-[#f3f6f8] min-h-screen font-['Plus_Jakarta_Sans',system-ui,sans-serif]">
      {/* HERO */}
      <div className={`relative rounded-2xl overflow-hidden mb-6 shadow-sm ${PNM_BRAND.gradient}`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_0%,white,transparent_40%),radial-gradient(circle_at_80%_100%,white,transparent_35%)]" />
        <div className="relative px-6 py-7 sm:px-8 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">Rekap Data</h1>
          <p className="mt-1 text-white/90 text-sm">Rekap Data Profil Risiko</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("triwulan")}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "triwulan"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
              }`}
          >
            Triwulan
          </button>

          <button
            onClick={() => setActiveTab("tahunan")}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "tahunan"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
              }`}
          >
            Tahunan
          </button>
        </nav>
      </div>

      {activeTab === "triwulan" && (
        <header className="px-4 py-4 flex items-center justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-semibold">Rekap Data</h2>
          <div className="flex items-end gap-4">
            {/* tahun + triwulan */}
            <div className="hidden md:flex items-end gap-4">
              {/* Tahun */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600 font-medium">Tahun</label>
                <YearSelect value={year} onChange={setYear} />
              </div>

              {/* Triwulan */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600 font-medium">Triwulan</label>
                <QuarterSelect value={quarter} onChange={setQuarter} />
              </div>
            </div>

            {/* search + export */}
            <div className="flex items-end gap-2">
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari section / indikator…"
                  className="pl-9 pr-3 py-2 rounded-xl border w-64"
                />
                <Search
                  size={16}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border bg-gray-900 text-white hover:bg-black"
                disabled={importing}
              >
                <Download size={18} /> Export {year}-{quarter}
              </button>
              <button
                onClick={handleImportClick}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50"
                disabled={importing}
              >
                <Upload size={18} /> {importing ? "Mengimpor..." : "Import Excel"}
              </button>
              <button
                onClick={() => {
                  // Cleanup all sources
                  const cleanupAll = () => {
                    const sources = ['investasiRows', 'pasarRows', 'likuiditasRows', 'operasionalRows',
                                     'hukumRows', 'stratejikRows', 'kepatuhanRows', 'reputasiRows'];
                    let totalRemoved = 0;

                    sources.forEach(key => {
                      try {
                        const raw = localStorage.getItem(key);
                        if (!raw) return;

                        const data = JSON.parse(raw);
                        if (!Array.isArray(data)) return;

                        const seen = new Map();
                        data.forEach(row => {
                          const uniqueKey = `${row.source}-${row.sectionLabel}-${row.indikator}-${row.year}-${row.quarter}`;
                          if (!seen.has(uniqueKey)) {
                            seen.set(uniqueKey, row);
                          }
                        });

                        const cleaned = Array.from(seen.values());
                        if (cleaned.length < data.length) {
                          console.log(`[CLEANUP ${key}] Removed ${data.length - cleaned.length} duplicates`);
                          localStorage.setItem(key, JSON.stringify(cleaned));
                          totalRemoved += data.length - cleaned.length;
                        }
                      } catch (e) {
                        console.warn(`[CLEANUP] Error cleaning ${key}:`, e);
                      }
                    });

                    // Trigger state updates to reflect cleaned data
                    setInvestasiRows(loadInvestasiRowsWithPeringkat());
                    setPasarRows(loadFromLocal(PASAR_LS));
                    setLikuiditasRows(loadFromLocal("likuiditasRows"));
                    setOperasionalRows(loadOperasionalRowsWithPeringkat());
                    setHukumRows(loadHukumRowsWithPeringkat());
                    setStratejikRows(loadStratejikRowsWithPeringkat());
                    setKepatuhanRows(loadKepatuhanRowsWithPeringkat());
                    setReputasiRows(loadReputasiRowsWithPeringkat());

                    return totalRemoved;
                  };

                  if (confirm('Hapus semua data duplikat dari localStorage? Data yang lebih lengkap akan dipertahankan.')) {
                    const removed = cleanupAll();
                    alert(`✅ Cleanup selesai! ${removed} duplikat dihapus.`);
                  }
                }}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border border-orange-600 text-orange-600 hover:bg-orange-50"
                title="Hapus data duplikat dari localStorage"
              >
                🧹 Clean Duplicates
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleImportFile}
                style={{ display: "none" }}
              />
            </div>
          </div>
        </header>
      )}

      {activeTab === "tahunan" && (
        <header className="px-4 py-4 flex items-center justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-semibold">Rekap Data Tahunan</h2>
          <div className="flex items-end gap-4">
            {/* tahun */}
            <div className="hidden md:flex items-end gap-4">
              {/* Tahun */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600 font-medium">Tahun</label>
                <YearSelect value={year} onChange={setYear} />
              </div>
            </div>

            {/* search + export */}
            <div className="flex items-end gap-2">
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari section / indikator…"
                  className="pl-9 pr-3 py-2 rounded-xl border w-64"
                />
                <Search
                  size={16}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border bg-gray-900 text-white hover:bg-black"
                disabled={importing}
              >
                <Download size={18} /> Export {year}
              </button>
              <button
                onClick={handleImportClick}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50"
                disabled={importing}
              >
                <Upload size={18} /> {importing ? "Mengimpor..." : "Import Excel"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleImportFile}
                style={{ display: "none" }}
              />
            </div>
          </div>
        </header>
      )}

      {activeTab === "triwulan" ? (
        <section className="bg-white rounded-2xl shadow-sm overflow-visible">
          {/* Multi-Select Pill Tabs */}
          <div className="px-4 py-4">
            <div
              className="
      rounded-2xl
      border border-white/30
      bg-white/70
      backdrop-blur-md
      shadow-[0_8px_24px_rgba(0,0,0,0.08)]
      relative
    "
            >
              {/* subtle glass highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-white/70 rounded-t-2xl" />

              <div className="px-5 py-4 flex flex-col gap-3">
                {/* Title */}
                <div className="font-semibold text-sm text-gray-800">
                  REKAP DATA PROFIL RISIKO ({periodeLabel})
                </div>

                {/* Pill Tabs (TIDAK DIUBAH LOGIC & WARNA) */}
                <div className="flex flex-wrap gap-3">
                  {RISK_SOURCES.map((src) => {
                    const isActive = selectedSources.includes(src);
                    return (
                      <button
                        key={src}
                        onClick={() => toggleSource(src)}
                        className={`
                px-6 h-11
                rounded-full
                text-base font-semibold
                transition-all duration-200
                shadow-sm
                ${isActive
                            ? "bg-blue-600 text-white"
                            : `
      bg-white
      text-gray-700
      border border-gray-300
      hover:bg-gray-50
      hover:border-gray-400
    `
                          }

              `}
                        style={{ minWidth: 120 }}
                      >
                        {src.charAt(0).toUpperCase() + src.slice(1).toLowerCase()}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>


          {/* Enterprise-grade Filter Section - No Label, Professional Dashboard Control */}
          <div className="px-4 mt-6 mb-4">
            <div className="relative section-dropdown-container max-w-sm">
              <button
                onClick={() => setSectionFilterOpen((v) => !v)}
                className="w-full sm:w-80 flex items-center justify-between rounded-xl px-4 py-2 bg-gray-50 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <span>Filter section (opsional)</span>
                <ChevronDown size={16} />
              </button>

              {sectionFilterOpen && (
                <div className="absolute top-full left-0 mt-2 w-full sm:w-[420px] rounded-xl border bg-white shadow-lg p-4 max-h-[320px] overflow-y-auto z-40">
                  {/* List checkbox section (grouped by source) - FIXED: Urutan sama dengan sidebar */}
                  {SOURCE_ORDER.map((source) => {
                    const sections = sectionOptionsBySource[source];
                    if (!sections || sections.length === 0) return null;

                    return (
                      <div key={source}>
                        <div className="text-xs font-semibold text-gray-500 mb-2 uppercase">
                          {source}
                        </div>
                        <div className="space-y-1">
                          {sections.map((sec) => {
                            const checked =
                              selectedSections[source]?.includes(sec) ?? false;

                            return (
                              <label
                                key={sec}
                                className="flex items-start gap-2 text-sm hover:bg-gray-50 px-2 py-1 rounded-md"
                              >
                                <input
                                  type="checkbox"
                                  className="mt-0.5"
                                  checked={checked}
                                  onChange={() =>
                                    toggleSection(source, sec)
                                  }
                                />
                                <span>{sec}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {/* Footer actions (Reset / Terapkan) - clean minimal design */}
                  <div className="pt-3 mt-3 border-t flex justify-end gap-2">
                    <button
                      className="text-sm text-gray-500 hover:text-gray-700"
                      onClick={() => setSelectedSections({})}
                    >
                      Reset
                    </button>
                    <button
                      className="text-sm font-semibold text-blue-600"
                      onClick={() => setSectionFilterOpen(false)}
                    >
                      Terapkan
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-gray-300 bg-[#1f4e79] text-white px-2 py-2 w-20 text-base font-semibold"></th>
                  <th className="border border-gray-300 bg-[#1f4e79] text-white px-2 py-2 text-center text-base font-semibold" colSpan={2}>
                    Parameter atau Indikator
                  </th>
                  <th className="border border-gray-300 bg-[#1f4e79] text-white px-2 py-2 text-center w-44 text-base font-semibold">{periodeLabel}</th>
                </tr>
              </thead>

              <tbody>
                {visibleGroups.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="border px-4 py-8 text-center text-gray-500">
                      {selectedSources.length === 0
                        ? "Pilih minimal satu jenis risiko untuk ditampilkan."
                        : Object.values(selectedSections).every(arr => !arr || arr.length === 0)
                          ? "Pilih minimal satu section untuk ditampilkan."
                          : "Tidak ada data untuk sumber dan section yang dipilih."
                      }
                    </td>
                  </tr>
                ) : (
                  (() => {
                    // Group by source first
                    const bySource = {};
                    visibleGroups.forEach((g) => {
                      bySource[g.source] = bySource[g.source] || [];
                      bySource[g.source].push(g);
                    });

                    const sourcesOrder = SOURCE_ORDER.filter((s) => bySource[s] && bySource[s].length);

                    // Track rendered cells globally to avoid duplicate rendering
                    const renderedSourceCells = new Set();
                    const renderedSectionCells = new Set();

                    return sourcesOrder.flatMap((source, sourceIdx) => {
                      const indicators = bySource[source];

                      // ✅ GROUP by section (sectionName)
                      const bySection = {};
                      indicators.forEach(ind => {
                        const sectionKey = ind.sectionName;
                        if (!bySection[sectionKey]) {
                          bySection[sectionKey] = [];
                        }
                        bySection[sectionKey].push(ind);
                      });

                      // Calculate total rows for this source using helper function
                      const totalRowsForSource = calculateTotalRowsForSource(indicators);

                      // Track if this is the first row for this source
                      let isFirstRowInSource = true;

                      // Iterate sections, lalu indicators di dalamnya
                      return Object.entries(bySection).flatMap(([sectionName, sectionIndicators], sectionIdx) => {
                        // Calculate total rows for this section using helper function
                        const rowsInSection = calculateTotalRowsForSection(sectionIndicators);

                        // Track if this is the first row for this section
                        let isFirstRowInSection = true;

                        return sectionIndicators.flatMap((g, indicatorIndex) => {
                          const r = g.mainRow || {};
                          const mode = r.mode ?? "RASIO";

                          const hasilRaw = r.hasil ?? r.result ?? r.value ?? "";
                          const hasilDisplay = normalizeHasilDisplay(hasilRaw, r.isPercent);
                          const rowKey = makeRowKey({ ...r, source });

                          // Stable key includes year & quarter for force re-render when period changes
                          const stableKey = `${source}-${sectionName}-${g.indikatorLabel}-${indicatorIndex}-${year}-${quarter}`;

                          // Track whether to render source/section cells
                          const shouldRenderSource = isFirstRowInSource && !renderedSourceCells.has(source);
                          const shouldRenderSection = isFirstRowInSection && !renderedSectionCells.has(`${source}-${sectionName}`);

                          if (shouldRenderSource) {
                            renderedSourceCells.add(source);
                          }
                          if (shouldRenderSection) {
                            renderedSectionCells.add(`${source}-${sectionName}`);
                          }

                          // Mark as not first anymore for next iteration
                          const currentIsFirstSource = isFirstRowInSource;
                          const currentIsFirstSection = isFirstRowInSection;
                          isFirstRowInSource = false;
                          isFirstRowInSection = false;

                          const rows = [
                            // Main row (Hasil)
                            <tr key={`${stableKey}-hasil`} className="bg-[#cfe2f3]">
                              {/* Source column - only render once per source */}
                              {currentIsFirstSource && (
                                <td
                                  rowSpan={totalRowsForSource}
                                  className="border border-gray-300 px-2 py-2 align-middle text-center font-bold text-base bg-[#e6f4ff]"
                                  style={{
                                    writingMode: "vertical-rl",
                                    textOrientation: "mixed",
                                    letterSpacing: "0.18em",
                                    transform: "rotate(180deg)",
                                    width: 80,
                                    minWidth: 80,
                                  }}
                                >
                                  {source}
                                </td>
                              )}

                              {/* Section column - only render once per section */}
                              {currentIsFirstSection && (
                                <td
                                  rowSpan={rowsInSection}
                                  className="border border-gray-300 px-2 py-2 align-middle text-left bg-[#e6f4ff]"
                                  style={{ width: '300px', maxWidth: '300px' }}
                                >
                                  <div className="text-base font-semibold text-gray-900 leading-tight">
                                    {sectionName}
                                  </div>
                                </td>
                              )}

                              {/* Indikator column */}
                              <td className="border border-gray-300 px-4 py-3 align-top">
                                <div className="text-base font-bold text-gray-700 leading-relaxed">
                                  {g.indikatorLabel}
                                </div>
                              </td>

                              {/* Hasil column */}
                              <td className="border border-gray-300 px-4 py-3 text-right">
                                {mode === "TEKS" ? (
                                  <input
                                    className="w-full text-right border rounded-md px-2 py-1 text-sm bg-white"
                                    value={r.hasilText ?? ""}
                                    onChange={(e) => handleChangeValue(rowKey, "hasilText", e.target.value)}
                                    placeholder="Masukkan teks atau angka..."
                                  />
                                ) : (
                                  <span className="text-sm font-medium text-gray-900">
                                    {hasilDisplay || (r.isPercent ? "0,00%" : "0,00")}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ];

                          // Pembilang row (hanya RASIO)
                          if (mode === "RASIO") {
                            rows.push(
                              <tr key={`${stableKey}-pembilang`} className="bg-white">
                                <td className="border border-gray-300 px-4 py-2">
                                  <span className="text-sm text-gray-600">
                                    {r.numeratorLabel || r.pembilangLabel || "Pembilang"}
                                  </span>
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-right bg-white">
                                  <input
                                    className="w-full text-right border rounded-md px-2 py-1 text-sm bg-white"
                                    value={fmtInputNumber(r.numeratorValue ?? r.pembilangValue ?? "")}
                                    onChange={(e) => handleChangeValue(rowKey, "numeratorValue", e.target.value)}
                                    placeholder="0"
                                  />
                                </td>
                              </tr>
                            );
                          }

                          // Penyebut row (non-TEKS)
                          if (mode !== "TEKS") {
                            rows.push(
                              <tr key={`${stableKey}-penyebut`} className="bg-white">
                                <td className="border border-gray-300 px-4 py-2">
                                  <span className="text-sm text-gray-600">
                                    {r.denominatorLabel || r.penyebutLabel || "Penyebut"}
                                  </span>
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-right bg-white">
                                  <input
                                    className="w-full text-right border rounded-md px-2 py-1 text-sm bg-white"
                                    value={fmtInputNumber(r.denominatorValue ?? r.penyebutValue ?? "")}
                                    onChange={(e) => handleChangeValue(rowKey, "denominatorValue", e.target.value)}
                                    placeholder="0"
                                  />
                                </td>
                              </tr>
                            );
                          }

                          return rows;
                        });
                      });
                    });
                  })()
                )}
              </tbody>
            </table>
          </div>
        </section>
      ) : activeTab === "tahunan" ? (
        <section className="bg-white rounded-2xl shadow-sm overflow-visible">
          {/* Multi-Select Pill Tabs untuk Tahunan */}
          <div className="px-4 py-4">
            <div
              className="
      rounded-2xl
      border border-white/30
      bg-white/70
      backdrop-blur-md
      shadow-[0_8px_24px_rgba(0,0,0,0.08)]
      relative
    "
            >
              {/* subtle glass highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-white/70 rounded-t-2xl" />

              <div className="px-5 py-4 flex flex-col gap-3">
                {/* Title */}
                <div className="font-semibold text-sm text-gray-800">
                  REKAP DATA PROFIL RISIKO ({periodeLabel})
                </div>

                {/* Pill Tabs (TIDAK DIUBAH LOGIC & WARNA) */}
                <div className="flex flex-wrap gap-3">
                  {RISK_SOURCES.map((src) => {
                    const isActive = selectedSources.includes(src);
                    return (
                      <button
                        key={src}
                        onClick={() => toggleSource(src)}
                        className={`
                px-6 h-11
                rounded-full
                text-base font-semibold
                transition-all duration-200
                shadow-sm
                ${isActive
                            ? "bg-blue-600 text-white"
                            : `
      bg-white
      text-gray-700
      border border-gray-300
      hover:bg-gray-50
      hover:border-gray-400
    `
                          }

              `}
                        style={{ minWidth: 120 }}
                      >
                        {src.charAt(0).toUpperCase() + src.slice(1).toLowerCase()}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>


          {/* Enterprise-grade Filter Section untuk Tahunan */}
          {/* Filter Triwulan (Tahunan) */}
          {/* Filter Triwulan (Tahunan) - Glass UI */}
          <div className="px-4 mt-6 mb-6">
            <div
              className="
      relative
      rounded-2xl
      bg-white/75
      backdrop-blur-md
      border border-white/40
      shadow-[0_10px_28px_rgba(0,0,0,0.10)]
      p-5
      max-w-2xl
    "
            >
              {/* glass highlight */}
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
                      {/* custom round checkbox */}
                      <span
                        className={`
                w-5 h-5
                rounded-full
                border-2
                flex items-center justify-center
                transition-all
                ${checked
                            ? "border-blue-500"
                            : "border-blue-400"
                          }
              `}
                      >
                        {checked && (
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        )}
                      </span>

                      {/* HIDDEN checkbox (logic tetap jalan) */}
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

          {/* Tabel Tahunan */}
          {renderTahunanTable()}
        </section>
      ) : (
        <section className="bg-white rounded-2xl shadow overflow-hidden border">
          <div className="text-gray-500 italic p-6">
            Rekap Tahunan belum diaktifkan.
          </div>
        </section>
      )}

      {/* Export Format Dialog */}
      {exportDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Export Excel - Pilih Format</h2>

            {/* Format Hasil */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Format Hasil:</label>
              <div className="space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="hasilFormat"
                    value="smart"
                    checked={exportFormatOptions.hasilFormat === 'smart'}
                    onChange={(e) => handleExportFormatChange('hasilFormat', e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <span className="font-semibold">Smart Auto (0, 5, 0.5)</span>
                    <span className="text-blue-600 text-xs block ml-4">- RECOMMENDED</span>
                    <p className="text-sm text-gray-600 mt-1">
                      Integer tanpa desimal, float dengan desimal asli
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="hasilFormat"
                    value="4decimal"
                    checked={exportFormatOptions.hasilFormat === '4decimal'}
                    onChange={(e) => handleExportFormatChange('hasilFormat', e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <span className="font-semibold">Selalu 4 Desimal (0.0000, 5.0000)</span>
                    <p className="text-sm text-gray-600 mt-1">
                      Paksa tampil 4 digit desimal untuk konsistensi
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="hasilFormat"
                    value="integer"
                    checked={exportFormatOptions.hasilFormat === 'integer'}
                    onChange={(e) => handleExportFormatChange('hasilFormat', e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <span className="font-semibold">Tanpa Desimal (0, 5, 100)</span>
                    <p className="text-sm text-gray-600 mt-1">
                      Bulatkan ke integer terdekat
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Format Pemisah */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Format Pemisah:</label>
              <div className="space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="pemisahFormat"
                    value="indonesia"
                    checked={exportFormatOptions.pemisahFormat === 'indonesia'}
                    onChange={(e) => handleExportFormatChange('pemisahFormat', e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <span className="font-semibold">Indonesia (1.000.000)</span>
                    <span className="text-blue-600 text-xs block ml-4">- DEFAULT</span>
                    <p className="text-sm text-gray-600 mt-1">
                      Pemisah ribuan dengan titik
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="pemisahFormat"
                    value="standar"
                    checked={exportFormatOptions.pemisahFormat === 'standar'}
                    onChange={(e) => handleExportFormatChange('pemisahFormat', e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <span className="font-semibold">Standar (1000000)</span>
                    <p className="text-sm text-gray-600 mt-1">
                      Tanpa pemisah ribuan
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleExportCancel}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleExportConfirm}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium"
              >
                Export Excel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}