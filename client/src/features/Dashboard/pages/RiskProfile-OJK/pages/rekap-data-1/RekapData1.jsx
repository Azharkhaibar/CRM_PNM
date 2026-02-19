import React, { useMemo, useState, useEffect } from "react";
import Header from "../../components/header/Header";
import { useHeaderStore } from "../../store/headerStore";
import { Input } from "@/components/ui/input";
import {
  StoreIcon,
  HandCoins,
  BanknoteArrowUp,
  BrainCircuit,
  Cog,
  Scale,
  ClipboardCheck,
  CircleStar,
  BrainCog,
  Handshake,
  Sprout,
  TrendingUpDown,
  Earth,
  FileText,
} from "lucide-react";
import { loadInherent, loadKpmr, loadDerived } from "../../utils/storage/riskStorageNilai";
import { computeDerived } from "../../utils/compute/computeDerived";

// ========== IMPORT UNTUK EXPORT EXCEL ==========
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// =====================================================
//   INDIKATOR RISIKO (GLOBAL)
// =====================================================

const RANK_COLOR_MAP = {
  1: { bg: "4F6228", text: "FFFFFF" },
  2: { bg: "92D050", text: "000000" },
  3: { bg: "FFFF00", text: "000000" },
  4: { bg: "FFC000", text: "000000" },
  5: { bg: "FF0000", text: "FFFFFF" },
};

// INHERENT Risk Indicators - dengan score property
const INHERENT_RISK_INDICATORS = [
  { label: "Low", value: "low", color: "#4F6228", text: "#FFFFFF", min: 0, max: 1.49, score: 1 },
  { label: "Low To Moderate", value: "lowToModerate", color: "#92D050", text: "#000000", min: 1.50, max: 2.49, score: 2 },
  { label: "Moderate", value: "moderate", color: "#FFFF00", text: "#000000", min: 2.50, max: 3.49, score: 3 },
  { label: "Moderate To High", value: "moderateToHigh", color: "#FFC000", text: "#000000", min: 3.50, max: 4.49, score: 4 },
  { label: "High", value: "high", color: "#FF0000", text: "#FFFFFF", min: 4.50, max: Infinity, score: 5 },
];

// KPMR Risk Indicators - dengan score property
const KPMR_RISK_INDICATORS = [
  { label: "Strong", value: "strong", color: "#4F6228", text: "#FFFFFF", min: 0, max: 1.49, score: 1 },
  { label: "Satisfactory", value: "satisfactory", color: "#92D050", text: "#000000", min: 1.50, max: 2.49, score: 2 },
  { label: "Fair", value: "fair", color: "#FFFF00", text: "#000000", min: 2.50, max: 3.49, score: 3 },
  { label: "Marginal", value: "marginal", color: "#FFC000", text: "#000000", min: 3.50, max: 4.49, score: 4 },
  { label: "Unsatisfactory", value: "unsatisfactory", color: "#FF0000", text: "#FFFFFF", min: 4.50, max: Infinity, score: 5 },
];

const PTK_INDICATORS = [
  { label: "Peringkat 1", value: "peringkat1", color: "#4F6228", text: "#FFFFFF", min: 0, max: 1.49, score: 1 },
  { label: "Peringkat 2", value: "peringkat2", color: "#92D050", text: "#000000", min: 1.50, max: 2.49, score: 2 },
  { label: "Peringkat 3", value: "peringkat3", color: "#FFFF00", text: "#000000", min: 2.50, max: 3.49, score: 3 },
  { label: "Peringkat 4", value: "peringkat4", color: "#FFC000", text: "#000000", min: 3.50, max: 4.49, score: 4 },
  { label: "Peringkat 5", value: "peringkat5", color: "#FF0000", text: "#FFFFFF", min: 4.50, max: Infinity, score: 5 },
];

// =====================================================
//   MASTER DATA KATEGORI (dengan ikon)
// =====================================================
const CATEGORIES = [
  { id: "pasar-produk", label: "Pasar Produk", Icon: StoreIcon },
  { id: "likuiditas-produk", label: "Likuiditas Produk", Icon: HandCoins },
  { id: "kredit-produk", label: "Kredit Produk", Icon: BanknoteArrowUp },
  { id: "konsentrasi-produk", label: "Konsentrasi Produk", Icon: BrainCircuit },
  { id: "operasional-regulatory", label: "Operasional", Icon: Cog },
  { id: "hukum-regulatory", label: "Hukum", Icon: Scale },
  { id: "kepatuhan-regulatory", label: "Kepatuhan", Icon: ClipboardCheck },
  { id: "reputasi-regulatory", label: "Reputasi", Icon: CircleStar },
  { id: "strategis-regulatory", label: "Strategis", Icon: BrainCog },
  { id: "investasi-regulatory", label: "Investasi", Icon: Handshake },
  { id: "rentabilitas-regulatory", label: "Rentabilitas", Icon: TrendingUpDown },
  { id: "permodalan-regulatory", label: "Permodalan", Icon: Sprout },
  { id: "tatakelola-regulatory", label: "Tata Kelola", Icon: Earth },
];

// =====================================================
//   FUNGSI-FUNGSI UNTUK EKSPOR EXCEL
// =====================================================

const truncateToTwoDecimals = (num) => {
  const numValue = typeof num === 'number' ? num : parseFloat(num) || 0;
  return Math.floor(numValue * 100) / 100;
};

const defaultBhz = (id) =>
  id === "operasional-regulatory" || id === "strategis-regulatory" ? 20 : 10;

function getRekapData1ForQuarter(year, quarter, bhzOverrides = {}) {
  const rows = [];

  let inherentFooter = 0;
  let kpmrFooter = 0;

  let categoriesWithInherentData = 0;
  let categoriesWithKpmrData = 0;

  CATEGORIES.forEach((cat) => {
    let inherentSummary = 0;
    const derived = loadDerived({
      categoryId: cat.id,
      year: year.toString(),
      quarter: quarter.toLowerCase(),
    });

    if (typeof derived?.summary === "number") {
      inherentSummary = truncateToTwoDecimals(derived.summary);
    }

    let kpmrSummary = 0;
    let kpmrSkor = 0;

    try {
      const kpmrRows = loadKpmr({
        categoryId: cat.id,
        year: year,
      });

      if (Array.isArray(kpmrRows) && kpmrRows.length > 0) {
        let total = 0;
        let count = 0;

        kpmrRows.forEach((aspek) => {
          aspek.pertanyaanList?.forEach((p) => {
            const v = p.skor?.[quarter.toLowerCase()] ?? p.skor?.[quarter.toUpperCase()];
            const n = Number(v);
            if (!isNaN(n) && n >= 1 && n <= 5) {
              total += n;
              count++;
            }
          });
        });

        if (count > 0) {
          kpmrSummary = truncateToTwoDecimals(total / count);
          kpmrSkor = kpmrSummary;
        }
      }
    } catch (error) {
      console.error(`[EXPORT] Error loading KPMR for ${cat.id}:`, error);
    }

    const bhz = bhzOverrides[cat.id] ?? defaultBhz(cat.id);
    const weight = bhz / 100;
    const bvt = 100;
    const inherentSkor = truncateToTwoDecimals(inherentSummary * (bvt / 100));

    const hasInherent = inherentSkor > 0;
    const hasKpmr = kpmrSkor > 0;

    if (hasInherent) {
      inherentFooter += inherentSkor * weight;
      categoriesWithInherentData++;
    }

    if (hasKpmr) {
      kpmrFooter += kpmrSkor * weight;
      categoriesWithKpmrData++;
    }

    rows.push({
      id: cat.id,
      nama: cat.label,
      bhz,
      inherentSummary,
      kpmrSummary,
      inherentSkor,
      kpmrSkor,
      inherentValueForFooter: truncateToTwoDecimals(inherentSkor * weight),
      kpmrValueForFooter: truncateToTwoDecimals(kpmrSkor * weight),
      hasInherentData: hasInherent,
      hasKpmrData: hasKpmr,
    });
  });

  inherentFooter = truncateToTwoDecimals(inherentFooter);
  kpmrFooter = truncateToTwoDecimals(kpmrFooter);
  const ptkFooter = truncateToTwoDecimals((inherentFooter + kpmrFooter) / 2);

  return {
    rows,
    footer: {
      inherentDisplay: inherentFooter,
      kpmrDisplay: kpmrFooter,
      ptkDisplay: ptkFooter,
      hasInherentData: categoriesWithInherentData > 0,
      hasKpmrData: categoriesWithKpmrData > 0,
      hasCompleteData:
        categoriesWithInherentData > 0 && categoriesWithKpmrData > 0,
      hasPartialData:
        (categoriesWithInherentData > 0 && categoriesWithKpmrData === 0) ||
        (categoriesWithInherentData === 0 && categoriesWithKpmrData > 0),
      hasNoData:
        categoriesWithInherentData === 0 && categoriesWithKpmrData === 0,
    },
  };
}

function getRekapData1Tahunan({ year, bhzOverrides = {} }) {
  const quarters = ["Q1", "Q2", "Q3", "Q4"];
  const result = { year, quarters: {} };
  quarters.forEach((q) => {
    result.quarters[q] = getRekapData1ForQuarter(year, q, bhzOverrides);
  });
  return result;
}

// ========== Helper Ekspor ==========
const borderAll = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};

const center = {
  vertical: "middle",
  horizontal: "center",
};

const fill = (hex) => ({
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: hex.replace("#", "") },
});

const whiteBold = {
  bold: true,
  color: { argb: "FFFFFF" },
};

const num = (n) => Number(n || 0).toFixed(2);

const getRiskIndicatorExport = (score, type = "inherent") => {
  const indicators = type === "kpmr" ? KPMR_RISK_INDICATORS : 
                    type === "ptk" ? PTK_INDICATORS : 
                    INHERENT_RISK_INDICATORS;
  if (score === undefined || score === null || isNaN(score)) {
    return indicators[indicators.length - 1];
  }
  for (const indicator of indicators) {
    if (score >= indicator.min && score <= indicator.max) {
      return indicator;
    }
  }
  return indicators[indicators.length - 1];
};

const calculateKompositSkor = (inherentSkor, kpmrSkor, hasInherent, hasKpmr) => {
  if (hasInherent && hasKpmr) {
    return (inherentSkor + kpmrSkor) / 2;
  } else if (hasInherent) {
    return inherentSkor;
  } else if (hasKpmr) {
    return kpmrSkor;
  }
  return 0;
};

const getDataStatusLabel = (hasInherent, hasKpmr) => {
  if (!hasInherent && !hasKpmr) {
    return "Data Tidak Ditemukan";
  } else if ((hasInherent && !hasKpmr) || (!hasInherent && hasKpmr)) {
    return "Data Belum Lengkap";
  }
  return null;
};

const getQuarterLabel = (quarter) => {
  const map = {
    q1: "Maret",
    q2: "Juni",
    q3: "September",
    q4: "Desember",
  };
  return map[String(quarter).toLowerCase()] || quarter;
};

const createSingleSheet = (wb, tahunanData, year) => {
  const ws = wb.addWorksheet(`Rekap Data 1 - ${year}`);
  
  // Urutan quarter dan kolom awal
  const quarters = ["Q1", "Q2", "Q3", "Q4"];
  const startCols = [1, 11, 21, 31]; // A=1, K=11, U=21, AE=31
  const colWidths = [26, 10, 10, 20, 10, 20, 10, 20, 10]; // lebar kolom per blok

  // Set lebar kolom untuk semua kolom yang akan dipakai (hingga kolom 39)
  for (let i = 1; i <= 39; i++) {
    const col = ws.getColumn(i);
    const posInBlock = (i - 1) % 10; // 0-8 = data, 9 = pemisah
    col.width = posInBlock < 9 ? colWidths[posInBlock] : 2;
  }

  // ---- Judul besar di baris 1 (A1:AM1) ----
  ws.mergeCells(1, 1, 1, 39);
  const titleBig = ws.getCell(1, 1);
  titleBig.value = `Rekap Data 1 Tahun ${year}`;
  titleBig.font = { name: 'Arial', size: 16, bold: true };
  titleBig.alignment = center;
  titleBig.height = 25;

  quarters.forEach((quarter, idx) => {
    const startCol = startCols[idx];
    const quarterData = tahunanData.quarters[quarter];
    if (!quarterData) return;

    const { rows, footer } = quarterData;
    let r = 3; // baris awal setiap blok: baris 2 (karena baris 1 sudah judul besar)

    // ---- Title kuartal (baris 2) ----
    ws.mergeCells(r, startCol, r, startCol + 8);
    const title = ws.getCell(r, startCol);
    title.value = `${getQuarterLabel(quarter)} - ${year}`;
    title.fill = fill("2F5B84");
    title.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
    title.alignment = center;
    r++; // pindah ke baris 3 (header baris pertama)

    // ---- Header baris 1 (baris 3) ----
    const headerColor = "1F497D";
    const setHeader = (row, colOffset, text, color = headerColor, colSpan = 1) => {
      if (colSpan > 1) {
        ws.mergeCells(row, startCol + colOffset, row, startCol + colOffset + colSpan - 1);
      }
      const c = ws.getCell(row, startCol + colOffset);
      c.value = text;
      c.fill = fill(color);
      c.font = whiteBold;
      c.alignment = center;
      c.border = borderAll;
    };

    setHeader(r, 0, "Jenis Risiko", headerColor, 1);
    setHeader(r, 1, "BVt", headerColor, 1);
    setHeader(r, 2, "BHz", headerColor, 1);
    setHeader(r, 3, "Inherent", headerColor, 2);
    setHeader(r, 5, "KPMR", headerColor, 2);
    setHeader(r, 7, "Peringkat Tingkat Risiko", headerColor, 2);

    // Merge vertikal untuk kolom 1,2,3 (Jenis Risiko, BVt, BHz) agar mencakup baris 3 dan 4
    ws.mergeCells(r, startCol + 0, r + 1, startCol + 0);
    ws.mergeCells(r, startCol + 1, r + 1, startCol + 1);
    ws.mergeCells(r, startCol + 2, r + 1, startCol + 2);

    r++; // pindah ke baris 4 (header baris kedua)

    // ---- Header baris 2 (baris 4) ----
    setHeader(r, 3, "Indicator", headerColor, 1);
    setHeader(r, 4, "summary", headerColor, 1);
    setHeader(r, 5, "Indicator", headerColor, 1);
    setHeader(r, 6, "summary", headerColor, 1);
    setHeader(r, 7, "Indicator", headerColor, 1);
    setHeader(r, 8, "summary", headerColor, 1);

    r++; // pindah ke baris 5 (data dimulai)

    // ---- Data rows ----
    rows.forEach((item) => {
      const row = ws.getRow(r);

      const inherentIndicator = getRiskIndicatorExport(item.inherentSkor, "inherent");
      const kpmrIndicator = getRiskIndicatorExport(item.kpmrSkor, "kpmr");
      
      const kompositSkor = calculateKompositSkor(
        item.inherentSkor, 
        item.kpmrSkor, 
        item.hasInherentData, 
        item.hasKpmrData
      );
      const kompositIndicator = getRiskIndicatorExport(kompositSkor, "inherent");
      
      const dataStatusLabel = getDataStatusLabel(item.hasInherentData, item.hasKpmrData);

      row.getCell(startCol + 0).value = item.nama;
      row.getCell(startCol + 1).value = `${100}%`;
      row.getCell(startCol + 2).value = `${item.bhz}%`;

      row.getCell(startCol + 3).value = item.hasInherentData ? inherentIndicator.label : dataStatusLabel;
      row.getCell(startCol + 4).value = num(item.inherentSkor);

      row.getCell(startCol + 5).value = item.hasKpmrData ? kpmrIndicator.label : dataStatusLabel;
      row.getCell(startCol + 6).value = num(item.kpmrSkor);

      if (dataStatusLabel) {
        row.getCell(startCol + 7).value = dataStatusLabel;
      } else {
        row.getCell(startCol + 7).value = kompositIndicator.label;
      }
      row.getCell(startCol + 8).value = num(kompositSkor);

      // Terapkan border dan alignment untuk semua sel dalam rentang blok
      for (let c = 0; c < 9; c++) {
        const cell = row.getCell(startCol + c);
        cell.border = borderAll;
        cell.alignment = center;
      }

      // Warna indikator
      if (item.hasInherentData) {
        const cell = row.getCell(startCol + 3);
        cell.fill = fill(inherentIndicator.color);
        cell.font = { bold: true, color: { argb: inherentIndicator.text.replace("#", "") } };
      } else {
        row.getCell(startCol + 3).fill = fill("9CA3AF");
      }

      if (item.hasKpmrData) {
        const cellK = row.getCell(startCol + 5);
        cellK.fill = fill(kpmrIndicator.color);
        cellK.font = { bold: true, color: { argb: kpmrIndicator.text.replace("#", "") } };
      } else {
        row.getCell(startCol + 5).fill = fill("9CA3AF");
      }

      if (!dataStatusLabel) {
        const cellP = row.getCell(startCol + 7);
        cellP.fill = fill(kompositIndicator.color);
        cellP.font = { bold: true, color: { argb: kompositIndicator.text.replace("#", "") } };
      } else {
        row.getCell(startCol + 7).fill = dataStatusLabel === "Data Belum Lengkap" ? 
          fill("E5E7EB") : fill("9CA3AF");
      }

      r++;
    });

    // ---- Footer ----
    ws.getRow(r).height = 30;
    const f = ws.getRow(r);

    const inherentIndicator = getRiskIndicatorExport(footer.inherentDisplay, "inherent");
    const kpmrIndicator = getRiskIndicatorExport(footer.kpmrDisplay, "kpmr");
    const ptkIndicator = getRiskIndicatorExport(footer.ptkDisplay, "ptk");

    let inherentLabel = inherentIndicator.label;
    let kpmrLabel = kpmrIndicator.label;
    let ptkLabel = ptkIndicator.label;

    if (!footer.hasInherentData) {
      inherentLabel = "Data Tidak Ditemukan";
    }
    
    if (!footer.hasKpmrData) {
      kpmrLabel = "Data Tidak Ditemukan";
    }
    
    if (footer.hasNoData) {
      ptkLabel = "Data Tidak Ditemukan";
    } else if (footer.hasPartialData) {
      ptkLabel = "Data Belum Lengkap";
    }

    const totalBhz = rows.reduce((sum, r) => sum + Number(r.bhz || 0), 0);

    f.getCell(startCol + 0).value = "Peringkat Komposit";
    f.getCell(startCol + 1).value = "100%    ";
    f.getCell(startCol + 2).value = `${totalBhz}%`;
    f.getCell(startCol + 3).value = inherentLabel;
    f.getCell(startCol + 4).value = num(footer.inherentDisplay);
    f.getCell(startCol + 5).value = kpmrLabel;
    f.getCell(startCol + 6).value = num(footer.kpmrDisplay);
    f.getCell(startCol + 7).value = ptkLabel;
    f.getCell(startCol + 8).value = num(footer.ptkDisplay);

    for (let c = 0; c < 9; c++) {
      const cell = f.getCell(startCol + c);
      cell.border = borderAll;
      cell.font = { bold: true };
      cell.alignment = center;
    }

    // Set background untuk kolom tertentu (0,1,2,4,6,8) dengan warna #214465
    const footerSpecialColumns = [0, 1, 2, 4, 6, 8];
    footerSpecialColumns.forEach(colOffset => {
      const cell = f.getCell(startCol + colOffset);
      cell.fill = fill("214465");
      cell.font = { bold: true, color: { argb: "FFFFFF" } };
    });

    // Warna footer untuk kolom indikator (3,5,7)
    const f4 = f.getCell(startCol + 3);
    if (footer.hasInherentData) {
      f4.fill = fill(inherentIndicator.color);
      f4.font = { bold: true, color: { argb: inherentIndicator.text.replace("#", "") } };
    } else {
      f4.fill = fill("9CA3AF");
      f4.font = { bold: true, color: { argb: "FFFFFF" } };
    }

    const f6 = f.getCell(startCol + 5);
    if (footer.hasKpmrData) {
      f6.fill = fill(kpmrIndicator.color);
      f6.font = { bold: true, color: { argb: kpmrIndicator.text.replace("#", "") } };
    } else {
      f6.fill = fill("9CA3AF");
      f6.font = { bold: true, color: { argb: "FFFFFF" } };
    }

    const f8 = f.getCell(startCol + 7);
    if (footer.hasNoData) {
      f8.fill = fill("9CA3AF");
      f8.font = { bold: true, color: { argb: "FFFFFF" } };
    } else if (footer.hasPartialData) {
      f8.fill = fill("E5E7EB");
      f8.font = { bold: true, color: { argb: "000000" } };
    } else {
      f8.fill = fill(ptkIndicator.color);
      f8.font = { bold: true, color: { argb: ptkIndicator.text.replace("#", "") } };
    }

    // Kosongkan kolom pemisah (startCol + 9) jika bukan blok terakhir, mulai dari baris 2 (agar tidak timpa judul besar)
    if (idx < quarters.length - 1) {
      for (let row = 2; row <= r; row++) {
        const cell = ws.getRow(row).getCell(startCol + 9);
        cell.value = "";
        cell.border = undefined;
        cell.fill = undefined;
      }
    }
  });

  return ws;
};

async function exportRekapData1Tahunan({ year, bhzOverrides = {} }) {
  const tahunanData = getRekapData1Tahunan({ year, bhzOverrides });
  const wb = new ExcelJS.Workbook();
  
  // Buat satu sheet dengan semua quarter
  createSingleSheet(wb, tahunanData, year);

  const buf = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buf]), `RekapData1_Tahunan_${year}.xlsx`);
}

// =====================================================
//   FUNGSI-FUNGSI UNTUK KOMPONEN UI
// =====================================================

const formatTwoDecimalsTruncate = (num) => {
  return truncateToTwoDecimals(num).toFixed(2);
};

const checkDataAvailability = (inherentSummary, kpmrSummary) => {
  const hasInherent = inherentSummary !== undefined && inherentSummary !== null && inherentSummary > 0;
  const hasKpmr = kpmrSummary !== undefined && kpmrSummary !== null && kpmrSummary > 0;
  
  if (!hasInherent && !hasKpmr) {
    return "no-data";
  } else if ((hasInherent && !hasKpmr) || (!hasInherent && hasKpmr)) {
    return "partial-data";
  }
  return "complete-data";
};

const getIndicatorNumber = (score, isDataAvailable = true) => {
  if (!isDataAvailable) return 0;
  if (score === undefined || score === null || isNaN(score)) return 5;
  const truncatedScore = truncateToTwoDecimals(score);
  if (truncatedScore >= 0 && truncatedScore <= 1.49) return 1;
  if (truncatedScore >= 1.5 && truncatedScore <= 2.49) return 2;   
  if (truncatedScore >= 2.5 && truncatedScore <= 3.49) return 3;   
  if (truncatedScore >= 3.5 && truncatedScore <= 4.49) return 4;   
  return 5;
};

const getIndicatorClass = (score) => {
  const c = RANK_COLOR_MAP[score];
  if (!c) return "bg-gray-400 text-white";
  return `bg-[#${c.bg}] text-${c.text === "FFFFFF" ? "white" : "black"}`;
};

const getPtkIndicator = (score) => {
  if (score === undefined || score === null || isNaN(score)) {
    return { ...PTK_INDICATORS[PTK_INDICATORS.length - 1], score: 5 };
  }
  const truncatedScore = truncateToTwoDecimals(score);
  const boundedScore = Math.min(truncatedScore, 5);
  for (const indicator of PTK_INDICATORS) {
    if (boundedScore >= indicator.min && boundedScore <= indicator.max) {
      return { ...indicator, score: indicator.score };
    }
  }
  return { ...PTK_INDICATORS[PTK_INDICATORS.length - 1], score: 5 };
};

const getRiskIndicator = (score, type = "inherent") => {
  if (score === undefined || score === null) {
    return type === "kpmr" 
      ? { ...KPMR_RISK_INDICATORS[KPMR_RISK_INDICATORS.length - 1], score: 5 } 
      : { ...INHERENT_RISK_INDICATORS[INHERENT_RISK_INDICATORS.length - 1], score: 5 };
  }
  const indicators = type === "kpmr" ? KPMR_RISK_INDICATORS : INHERENT_RISK_INDICATORS;
  const truncatedScore = truncateToTwoDecimals(score);
  for (const indicator of indicators) {
    if (truncatedScore >= indicator.min && truncatedScore <= indicator.max) {
      return { ...indicator, score: indicator.score || 5 };
    }
  }
  return type === "kpmr" 
    ? { ...KPMR_RISK_INDICATORS[KPMR_RISK_INDICATORS.length - 1], score: 5 } 
    : { ...INHERENT_RISK_INDICATORS[INHERENT_RISK_INDICATORS.length - 1], score: 5 };
};

// === FUNGSI PEMBANTU UNTUK NORMALISASI & MENGHITUNG SUMMARY ===
function normalizeItemWithDerived(item, param) {
  if (!item) return null;
  const judul = item?.judul || {};
  const normalizedItem = {
    ...item,
    id: item?.id ?? crypto.randomUUID(),
    bobot: Number(item?.bobot ?? 0),
    judul: {
      ...judul,
      text: judul?.text ?? judul?.label ?? "",
      pembilang: judul?.pembilang ?? "",
      penyebut: judul?.penyebut ?? "",
      type: judul?.type || "",
      value: judul?.value ?? judul?.valuePembilang ?? "",
      valuePembilang: judul?.valuePembilang ?? "",
      valuePenyebut: judul?.valuePenyebut ?? "",
    },
    riskindikator: item?.riskindikator ?? judul?.riskindikator ?? "",
    targetrisiko: item?.targetrisiko ?? judul?.targetrisiko ?? "",
    riskkategori: item?.riskkategori ?? judul?.riskkategori ?? "",
  };
  normalizedItem.derived = computeDerived(normalizedItem, param);
  return normalizedItem;
}

function normalizeInherentRowsWithDerived(rows) {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((r) => {
      if (!r) return null;
      const hasNilaiList = Array.isArray(r.nilaiList);
      const normalizedRow = {
        ...r,
        id: r.id || crypto.randomUUID(),
        bobot: Number(r.bobot ?? 0),
        kategori: r.kategori || { model: "", prinsip: "", jenis: "", underlying: [] },
        nilaiList: hasNilaiList
          ? r.nilaiList.map((item) => (item ? normalizeItemWithDerived(item, r) : null)).filter(Boolean)
          : [],
        indicatorList: []
      };
      return normalizedRow;
    })
    .filter(Boolean);
}

function calculateInherentSummary(rows) {
  let totalWeighted = 0;
  let count = 0;
  rows.forEach(param => {
    if (param.nilaiList && Array.isArray(param.nilaiList)) {
      param.nilaiList.forEach(item => {
        if (item.derived && typeof item.derived.weighted === 'number' && !isNaN(item.derived.weighted)) {
          totalWeighted += item.derived.weighted;
          count++;
        }
      });
    }
  });
  return count > 0 ? totalWeighted / count : 0;
}

function useGlobalSummaryAdapter() {
  const { year, activeQuarter } = useHeaderStore();
  const [summaryData, setSummaryData] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      const data = [];

      CATEGORIES.forEach((category) => {
        // INHERENT
        let inherentSummary = 0;
        const derivedData = loadDerived({
          categoryId: category.id,
          year,
          quarter: activeQuarter,
        });

        if (derivedData && typeof derivedData.summary === 'number' && derivedData.summary > 0) {
          inherentSummary = derivedData.summary;
        } else {
          try {
            const rows = loadInherent({
              categoryId: category.id,
              year,
              quarter: activeQuarter,
            });
            if (Array.isArray(rows) && rows.length > 0) {
              const normalizedRows = normalizeInherentRowsWithDerived(rows);
              inherentSummary = calculateInherentSummary(normalizedRows);
            }
          } catch (e) {
            console.error(`Error calculating inherent summary for ${category.id}:`, e);
          }
        }

        // KPMR
        const kpmrRows = loadKpmr({
          categoryId: category.id,
          year,
        });

        let kpmrSummary = 0;
        if (Array.isArray(kpmrRows) && kpmrRows.length > 0) {
          let total = 0;
          let count = 0;
          kpmrRows.forEach((aspek) => {
            aspek.pertanyaanList?.forEach((p) => {
              const v = p.skor?.[activeQuarter] ?? p.skor?.[activeQuarter.toUpperCase()];
              const num = Number(v);
              if (!isNaN(num) && num >= 1 && num <= 5) {
                total += num;
                count++;
              }
            });
          });
          if (count > 0) kpmrSummary = total / count;
        }

        data.push({
          id: category.id,
          nama: category.label,
          Icon: category.Icon,
          inherentSummary: truncateToTwoDecimals(inherentSummary),
          kpmrSummary: truncateToTwoDecimals(kpmrSummary),
        });
      });

      setSummaryData(data);
    };

    fetchData();

    const handleUpdate = () => fetchData();
    window.addEventListener("risk-data-updated", handleUpdate);
    return () => window.removeEventListener("risk-data-updated", handleUpdate);
  }, [year, activeQuarter]);

  return summaryData;
}

// =====================================================
//   KOMPONEN UTAMA REKAP DATA 1
// =====================================================
export default function RekapData1() {
  const { search, year, activeQuarter: quarter } = useHeaderStore();
  const summaryPerHalaman = useGlobalSummaryAdapter();

  const [bhzValues, setBhzValues] = useState(() => {
    const defaults = {};
    CATEGORIES.forEach((category) => {
      if (category.id === "operasional-regulatory" || category.id === "strategis-regulatory") {
        defaults[category.id] = 20;
      } else {
        defaults[category.id] = 10; 
      }
    });
    return defaults;
  });

  const filteredData = useMemo(() => {
    if (!search) return summaryPerHalaman;
    const s = search.toLowerCase();
    return summaryPerHalaman.filter((h) =>
      h.nama.toLowerCase().includes(s)
    );
  }, [search, summaryPerHalaman]);

  const tableData = useMemo(() => {
    return filteredData.map((item) => {
      const bvt = 100; 
      let bhz;
      if (bhzValues[item.id] !== undefined) {
        bhz = bhzValues[item.id];
      } else {
        bhz = (item.id === "operasional-regulatory" || item.id === "strategis-regulatory") ? 20 : 10;
      }
      
      const inherentSummary = item.inherentSummary || 0; 
      const kpmrSummary = item.kpmrSummary || 0; 
      
      const inherentSkor = truncateToTwoDecimals(inherentSummary * (bvt / 100));
      const kpmrSkor = truncateToTwoDecimals(kpmrSummary);
      
      const dataStatus = checkDataAvailability(inherentSummary, kpmrSummary);
      
      let kompositSkor = 0;
      if (dataStatus === "complete-data") {
        kompositSkor = truncateToTwoDecimals((inherentSkor + kpmrSkor) / 2);
      } else if (dataStatus === "partial-data") {
        kompositSkor = inherentSummary > 0 ? inherentSkor : kpmrSkor;
      }
      
      const inherentValueForFooter = truncateToTwoDecimals(inherentSkor * (bhz / 100));
      const kpmrValueForFooter = truncateToTwoDecimals(kpmrSkor * (bhz / 100));
      
      const inherentIndicator = getRiskIndicator(inherentSkor, "inherent");
      const kpmrIndicator = getRiskIndicator(kpmrSkor, "kpmr");
      const kompositIndicator = getRiskIndicator(kompositSkor, "inherent");
      
      return {
        ...item,
        bvt,
        bhz,
        inherentSummary,    
        kpmrSummary,      
        inherentSkor,       
        kpmrSkor,        
        kompositSkor,      
        inherentValueForFooter,
        kpmrValueForFooter,     
        inherentIndicator,
        kpmrIndicator,
        kompositIndicator,
        dataStatus,
      };
    });
  }, [filteredData, bhzValues]);

  const handleExportToExcel = async () => {
    if (!year) {
      alert("Tahun belum dipilih");
      return;
    }

    try {
      await exportRekapData1Tahunan({
        year,
        bhzOverrides: bhzValues,
      });
      console.log("Export Excel Tahunan sukses");
    } catch (err) {
      console.error("EXPORT TAHUNAN ERROR:", err);
      alert(err?.message || "Gagal export Excel Tahunan");
    }
  };

  const peringkatKomposit = useMemo(() => {
    if (summaryPerHalaman.length === 0) {
      return {
        inherentValue: 0,
        kpmrValue: 0,
        ptkValue: 0,
        hasInherentData: false,
        hasKpmrData: false,
        hasCompleteData: false,
        hasPartialData: false,
        hasNoData: true,
        categoriesWithInherentData: 0,
        categoriesWithKpmrData: 0,
      };
    }

    let inherentFooter = 0;
    let kpmrFooter = 0;
    let categoriesWithInherentData = 0;
    let categoriesWithKpmrData = 0;

    summaryPerHalaman.forEach((item) => {
      const bhz =
        bhzValues[item.id] ??
        (item.id === "operasional-regulatory" ||
        item.id === "strategis-regulatory"
          ? 20
          : 10);

      const weight = bhz / 100;
      const inherentSkor = item.inherentSummary || 0;
      const kpmrSkor = item.kpmrSummary || 0;

      if (inherentSkor > 0) {
        inherentFooter += inherentSkor * weight;
        categoriesWithInherentData++;
      }

      if (kpmrSkor > 0) {
        kpmrFooter += kpmrSkor * weight;
        categoriesWithKpmrData++;
      }
    });

    inherentFooter = truncateToTwoDecimals(inherentFooter);
    kpmrFooter = truncateToTwoDecimals(kpmrFooter);
    const ptkFooter = truncateToTwoDecimals((inherentFooter + kpmrFooter) / 2);

    return {
      inherentValue: inherentFooter,
      kpmrValue: kpmrFooter,
      ptkValue: ptkFooter,
      hasInherentData: categoriesWithInherentData > 0,
      hasKpmrData: categoriesWithKpmrData > 0,
      hasCompleteData: categoriesWithInherentData > 0 && categoriesWithKpmrData > 0,
      hasPartialData: (categoriesWithInherentData > 0 && categoriesWithKpmrData === 0) ||
                      (categoriesWithInherentData === 0 && categoriesWithKpmrData > 0),
      hasNoData: categoriesWithInherentData === 0 && categoriesWithKpmrData === 0,
      categoriesWithInherentData,
      categoriesWithKpmrData,
    };
  }, [summaryPerHalaman, bhzValues]);

  const footerDisplay = useMemo(() => {
    const inherentDisplay = peringkatKomposit.inherentValue;
    const kpmrDisplay = peringkatKomposit.kpmrValue;
    const ptkDisplay = peringkatKomposit.ptkValue;

    const ptkIndicator = getPtkIndicator(ptkDisplay);

    return {
      inherentDisplay,
      kpmrDisplay,
      ptkDisplay,
      inherentIndicator: getRiskIndicator(inherentDisplay, "inherent"),
      kpmrIndicator: getRiskIndicator(kpmrDisplay, "kpmr"),
      ptkIndicator,
      hasInherentData: peringkatKomposit.hasInherentData,
      hasKpmrData: peringkatKomposit.hasKpmrData,
      hasCompleteData: peringkatKomposit.hasCompleteData,
      hasPartialData: peringkatKomposit.hasPartialData,
      hasNoData: peringkatKomposit.hasNoData,
      categoriesWithInherentData: peringkatKomposit.categoriesWithInherentData,
      categoriesWithKpmrData: peringkatKomposit.categoriesWithKpmrData,
    };
  }, [peringkatKomposit]);

  const handleBhzChange = (id, value) => {
    setBhzValues(prev => ({
      ...prev,
      [id]: Math.min(100, Math.max(0, Number(value) || 0))
    }));
  };

  // Komponen internal untuk sel tabel
  const ScoreCell = ({ value, indicator, hasData = true, type = "inherent" }) => {
    const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
    
    if (!hasData) {
      return (
        <div className="w-full flex mx-0.5 flex-col items-center justify-center space-y-1">
          <div className="text-lg font-bold text-gray-800">0.00</div>
          <div className="rounded-full px-3 py-2 font-bold text-md w-full flex items-center justify-center whitespace-nowrap min-h-[40px] bg-gray-400 text-white">
            Data Tidak Ditemukan
          </div>
        </div>
      );
    }
    
    const safeIndicator = indicator || getRiskIndicator(safeValue, type);
    const indicatorClass = getIndicatorClass(safeIndicator.score);
    
    return (
      <div className="w-full flex mx-0.5 flex-col items-center justify-center space-y-1">
        <div className="text-lg font-bold text-gray-800">
          {formatTwoDecimalsTruncate(safeValue)}
        </div>
        <div 
          className={`rounded-full px-3 py-2 font-bold text-md w-full flex items-center justify-center whitespace-nowrap min-h-[40px] ${indicatorClass}`}
        >
          {safeIndicator.label}
        </div>
      </div>
    );
  };

  const FooterScoreCell = ({ value, indicator, whiteText = false, hasData = true, type = "inherent" }) => {
    const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
    
    if (!hasData) {
      return (
        <div className="w-full flex flex-col items-center justify-center space-y-1">
          <div className={`text-lg font-bold ${whiteText ? 'text-white' : 'text-gray-800'}`}>0.00</div>
          <div className="rounded-full px-4 py-2.5 font-bold text-base w-full flex items-center justify-center whitespace-nowrap min-h-[40px] bg-gray-400 text-white">
            Data Tidak Ditemukan
          </div>
        </div>
      );
    }
    
    const safeIndicator = indicator || getRiskIndicator(safeValue, type);
    const indicatorClass = getIndicatorClass(safeIndicator.score);
    
    return (
      <div className="w-full flex flex-col items-center justify-center space-y-1">
        <div className={`text-lg font-bold ${whiteText ? 'text-white' : 'text-gray-800'}`}>
          {formatTwoDecimalsTruncate(safeValue)}
        </div>
        <div 
          className={`rounded-full px-4 py-2.5 font-bold text-base w-full flex items-center justify-center whitespace-nowrap min-h-[40px] ${indicatorClass}`}
        >
          {safeIndicator.label}
        </div>
      </div>
    );
  };

  const PtkFooterCell = ({ value, indicator, whiteText = false, hasData = true, isPartial = false }) => {
    const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
    
    if (!hasData) {
      return (
        <div className="w-full flex flex-col items-center justify-center space-y-1">
          <div className={`text-lg font-bold ${whiteText ? 'text-white' : 'text-gray-800'}`}>0.0</div>
          <div className="rounded-full px-4 py-2.5 font-bold text-base w-full flex items-center justify-center whitespace-nowrap min-h-[40px] bg-gray-400 text-white">
            Data Tidak Ditemukan
          </div>
        </div>
      );
    }
    
    if (isPartial) {
      return (
        <div className="w-full flex flex-col items-center justify-center space-y-1">
          <div className={`text-lg font-bold ${whiteText ? 'text-white' : 'text-gray-800'}`}>
            {formatTwoDecimalsTruncate(safeValue)}
          </div>
          <div className="rounded-full px-4 py-2.5 font-bold text-base w-full flex items-center justify-center whitespace-nowrap min-h-[40px] bg-gray-200 text-gray-700">
            Data Belum Lengkap
          </div>
        </div>
      );
    }
    
    const ptkIndicator = getPtkIndicator(safeValue);
    const indicatorClass = getIndicatorClass(ptkIndicator.score);
    
    return (
      <div className="w-full flex flex-col items-center justify-center space-y-1">
        <div className={`text-lg font-bold ${whiteText ? 'text-white' : 'text-gray-800'}`}>
          {formatTwoDecimalsTruncate(safeValue)}
        </div>
        <div 
          className={`rounded-full px-4 py-2.5 font-bold text-base w-full flex items-center justify-center whitespace-nowrap min-h-[40px] ${indicatorClass}`}
        >
          {ptkIndicator.label}
        </div>
      </div>
    );
  };

  const KompositScoreCell = ({ inherentValue, kpmrValue, inherentIndicator, kpmrIndicator, dataStatus }) => {
    const safeInherentValue = typeof inherentValue === 'number' && !isNaN(inherentValue) ? inherentValue : 0;
    const safeKpmrValue = typeof kpmrValue === 'number' && !isNaN(kpmrValue) ? kpmrValue : 0;
    
    if (dataStatus === "no-data") {
      return (
        <div className="w-full flex mx-0.5 flex-col items-center justify-center space-y-1">
          <div className="text-lg font-bold text-gray-800">0.00</div>
          <div className="rounded-full px-3 py-2 font-bold text-md w-full flex items-center justify-center whitespace-nowrap min-h-[40px] bg-gray-400 text-white">
            Data Tidak Ditemukan
          </div>
        </div>
      );
    }
    
    if (dataStatus === "partial-data") {
      const availableValue = inherentValue > 0 ? inherentValue : kpmrValue;
      return (
        <div className="w-full flex mx-0.5 flex-col items-center justify-center space-y-1">
          <div className="text-lg font-bold text-gray-800">
            {formatTwoDecimalsTruncate(availableValue)}
          </div>
          <div className="rounded-full px-3 py-2 font-bold text-md w-full flex items-center justify-center whitespace-nowrap min-h-[40px] bg-gray-200 text-gray-700">
            Data Belum Lengkap
          </div>
        </div>
      );
    }
    
    const kompositValue = truncateToTwoDecimals((safeInherentValue + safeKpmrValue) / 2);
    const kompositIndicator = getRiskIndicator(kompositValue, "inherent");
    const indicatorClass = getIndicatorClass(kompositIndicator.score);
    
    return (
      <div className="w-full flex mx-0.5 flex-col items-center justify-center space-y-1">
        <div className="text-lg font-bold text-gray-800">
          {formatTwoDecimalsTruncate(kompositValue)}
        </div>
        <div 
          className={`rounded-full px-3 py-2 font-bold text-md w-full flex items-center justify-center whitespace-nowrap min-h-[40px] ${indicatorClass}`}
        >
          {kompositIndicator.label}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen p-4">
      <Header title="Rekap Data 1" onExportClick={handleExportToExcel}/>

      {/* Tiga kartu ringkasan */}
      <div className="mt-4 gap-4 w-full flex">
        {/* CARD 1 */}
        <div className="bg-white shadow-md border border-gray-300 w-[50%] p-6 rounded-xl flex items-center gap-5">
          <div className={`w-20 h-20 rounded-lg flex items-center justify-center shadow ${getIndicatorClass(getIndicatorNumber(footerDisplay?.inherentDisplay || 0, footerDisplay?.hasInherentData))}`}>
            <span className="text-2xl font-bold">
              {getIndicatorNumber(footerDisplay?.inherentDisplay || 0, footerDisplay?.hasInherentData)}
            </span>
          </div>
          <div className="flex-1 text-center">
            <p className="text-lg font-semibold border-b border-black inline-block px-3 pb-1">
              Komposit Inherent : {" "}
              {formatTwoDecimalsTruncate(Number(footerDisplay?.inherentDisplay) || 0)}
            </p>
            <p className="text-lg font-bold mt-1">
              {footerDisplay?.hasInherentData ? footerDisplay?.inherentIndicator?.label : "Data Tidak Ditemukan"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {footerDisplay?.categoriesWithInherentData} data dari total 13 data
            </p>
          </div>
        </div>

        {/* CARD 2 */}
        <div className="bg-white shadow-md border border-gray-300 w-[50%] p-6 rounded-xl flex items-center gap-5">
          <div className={`w-20 h-20 rounded-lg flex items-center justify-center shadow ${getIndicatorClass(getIndicatorNumber(footerDisplay?.kpmrDisplay || 0, footerDisplay?.hasKpmrData))}`}>
            <span className="text-2xl font-bold">
              {getIndicatorNumber(footerDisplay?.kpmrDisplay || 0, footerDisplay?.hasKpmrData)}
            </span>
          </div>
          <div className="flex-1 text-center">
            <p className="text-lg font-semibold border-b border-black inline-block px-3 pb-1">
              KPMR Komposit : {" "}
              {formatTwoDecimalsTruncate(Number(footerDisplay?.kpmrDisplay) || 0)}
            </p>
            <p className="text-lg font-bold mt-1">
              {footerDisplay?.hasKpmrData ? footerDisplay?.kpmrIndicator?.label : "Data Tidak Ditemukan"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {footerDisplay?.categoriesWithKpmrData} data dari total 13 data
            </p>
          </div>
        </div>

        {/* CARD 3 */}
        {(() => {
          let card3Class = "";
          let card3Number = 0;
          if (footerDisplay?.hasNoData) {
            card3Class = "bg-gray-400 text-white";
            card3Number = 0;
          } else if (footerDisplay?.hasPartialData) {
            card3Class = "bg-gray-200 text-gray-700";
            card3Number = 0;
          } else {
            card3Class = getIndicatorClass(footerDisplay?.ptkIndicator?.score || 5);
            card3Number = footerDisplay?.ptkIndicator?.score || 5;
          }
          return (
            <div className="bg-white shadow-md border border-gray-300 w-[50%] p-6 rounded-xl flex items-center gap-5">
              <div className={`w-20 h-20 rounded-lg flex items-center justify-center shadow ${card3Class}`}>
                <span className="text-2xl font-bold">{card3Number}</span>
              </div>
              <div className="flex-1 text-center">
                <p className="text-lg font-semibold border-b border-black inline-block px-3 pb-1">
                  Komposit : {" "}
                  {formatTwoDecimalsTruncate(Number(footerDisplay?.ptkDisplay) || 0)}
                </p>
                <p className="text-lg font-bold mt-1">
                  {footerDisplay?.hasNoData ? "Data Tidak Ditemukan" : 
                   footerDisplay?.hasPartialData ? "Data Belum Lengkap" : 
                   (footerDisplay?.ptkIndicator?.label || "Peringkat 5")}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {footerDisplay?.hasCompleteData ? "Data lengkap" : 
                   footerDisplay?.hasPartialData ? "Data parsial" : 
                   "Tidak ada data"}
                </p>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Tabel */}
      <div className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Tabel */}
        <div className="bg-blue-700 text-white">
          <div className="grid grid-cols-12 p-4 font-bold text-lg">
            <div className="col-span-2 ml-13 flex items-center gap-2">
              <span>JENIS RISIKO</span>
            </div>
            <div className="col-span-2 mr-3 text-center">BVt</div>
            <div className="col-span-2 mr-4 text-center">BHz</div>
            <div className="col-span-2 mr-5 text-center">INHERENT</div>
            <div className="col-span-2 mr-6 text-center">KPMR</div>
            <div className="col-span-2 mr-10 text-center">Peringkat Tingkat Komposit</div>
          </div>
        </div>

        {/* Body Tabel */}
        <div className="divide-y max-h-[450px] overflow-y-auto">
          {tableData.map((item) => {
            const hasInherentData = item.inherentSummary > 0;
            const hasKpmrData = item.kpmrSummary > 0;
            const dataStatus = checkDataAvailability(item.inherentSummary, item.kpmrSummary);
            
            return (
              <div key={item.id} className="grid grid-cols-12 p-4 hover:bg-gray-50 transition-colors">
                {/* Jenis Risiko dengan Icon */}
                <div className="col-span-2 flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    {item.Icon ? (
                      <item.Icon className="w-5 h-5 text-blue-600" />
                    ) : (
                      <FileText className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <span className="font-bold text-lg tracking-wide text-gray-800">{item.nama}</span>
                </div>

                {/* BVt (Fixed) */}
                <div className="col-span-2 flex items-center justify-center">
                  <div className="bg-gray-100 rounded-lg px-4 py-2 font-semibold text-gray-700 min-w-[80px] text-center">
                    {item.bvt}%
                  </div>
                </div>

                {/* BHz (Editable) */}
                <div className="col-span-2 flex items-center justify-center">
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={item.bhz}
                      onChange={(e) => handleBhzChange(item.id, e.target.value)}
                      className="w-24 text-center bg-white border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="absolute right-3 top-2 text-gray-500">%</span>
                  </div>
                </div>

                {/* Inherent */}
                <div className="col-span-2 flex items-center justify-center">
                  <ScoreCell 
                    value={item.inherentSkor} 
                    indicator={item.inherentIndicator}
                    hasData={hasInherentData}
                    type="inherent"
                  />
                </div>

                {/* KPMR */}
                <div className="col-span-2 flex items-center justify-center">
                  <ScoreCell 
                    value={item.kpmrSkor} 
                    indicator={item.kpmrIndicator}
                    hasData={hasKpmrData}
                    type="kpmr"
                  />
                </div>

                {/* Peringkat Tingkat Komposit */}
                <div className="col-span-2 flex items-center justify-center">
                  <KompositScoreCell 
                    inherentValue={item.inherentSkor}
                    kpmrValue={item.kpmrSkor}
                    inherentIndicator={item.inherentIndicator}
                    kpmrIndicator={item.kpmrIndicator}
                    dataStatus={dataStatus}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Tabel */}
        <div className="bg-blue-900 border-t">
          <div className="grid grid-cols-12 p-4 text-white font-bold">
            <div className="col-span-2"></div>
            <div className="col-span-2 text-white flex tracking-wider items-center text-2xl">
              Peringkat Komposit
            </div>
            <div className="col-span-1 text-center text-gray-500 flex items-center justify-center"></div>
            <div className="col-span-1 text-center text-gray-500 flex items-center justify-center"></div>
            
            {/* Inherent Footer */}
            <div className="col-span-2 mr-4 -ml-1 flex items-center justify-center">
              <FooterScoreCell 
                value={footerDisplay.inherentDisplay} 
                indicator={footerDisplay.inherentIndicator}
                whiteText={true}
                hasData={footerDisplay.hasInherentData}
                type="inherent"
              />
            </div>
            
            {/* KPMR Footer */}
            <div className="col-span-2 mr-4 -ml-2 flex items-center justify-center">
              <FooterScoreCell 
                value={footerDisplay.kpmrDisplay} 
                indicator={footerDisplay.kpmrIndicator}
                whiteText={true}
                hasData={footerDisplay.hasKpmrData}
                type="kpmr"
              />
            </div>
            
            {/* PTK Footer */}
            <div className="col-span-2 mr-4 -ml-3 flex items-center justify-center">
              <PtkFooterCell 
                value={footerDisplay.ptkDisplay} 
                indicator={footerDisplay.ptkIndicator}
                whiteText={true}
                hasData={footerDisplay.hasInherentData || footerDisplay.hasKpmrData}
                isPartial={footerDisplay.hasPartialData}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-3">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-base font-semibold text-gray-950">INHERENT :</span>
            {INHERENT_RISK_INDICATORS.map((i, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-base font-semibold">
                <span className="w-5 h-5 rounded border" style={{ backgroundColor: i.color }} />
                <span className="text-gray-950">{i.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <span className="text-base font-semibold text-gray-950">KPMR :</span>
            {KPMR_RISK_INDICATORS.map((i, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-base font-semibold">
                <span className="w-5 h-5 rounded border" style={{ backgroundColor: i.color }} />
                <span className="text-gray-950">{i.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className="text-base font-semibold text-gray-950">PERINGKAT TINGKAT KOMPOSIT :</span>
            {PTK_INDICATORS.map((i, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-base font-semibold">
                <span className="w-5 h-5 rounded border" style={{ backgroundColor: i.color }} />
                <span className="text-gray-950">{i.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}