// PeringkatKomposit.jsx
import React, { useMemo, useState, useEffect } from "react";
import Header from "../../components/header/Header";
import { useHeaderStore } from "../../store/headerStore";
import { Input } from "@/components/ui/input";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  StoreIcon,
  HandCoins,
  BanknoteArrowUp,
  BrainCircuit,
  Scale,
  Cog,
  ClipboardCheck,
  CircleStar,
  BrainCog,
  Handshake,
  Sprout,
  TrendingUpDown,
  Earth,
  FileText,
} from "lucide-react";
import {
  loadKpmr,
  loadDerived,
  loadInherent,
} from "../../utils/storage/riskStorageNilai";
import { computeDerived } from "../../utils/compute/computeDerived";

// ==================== KONSTANTA GLOBAL ====================
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

const INHERENT_RISK_INDICATORS = [
  { label: "Low", value: "low", color: "#4F6228", text: "#FFFFFF", min: 0, max: 1.49, score: 1 },
  { label: "Low To Moderate", value: "lowToModerate", color: "#92D050", text: "#000000", min: 1.50, max: 2.49, score: 2 },
  { label: "Moderate", value: "moderate", color: "#FFFF00", text: "#000000", min: 2.50, max: 3.49, score: 3 },
  { label: "Moderate To High", value: "moderateToHigh", color: "#FFC000", text: "#000000", min: 3.50, max: 4.49, score: 4 },
  { label: "High", value: "high", color: "#FF0000", text: "#FFFFFF", min: 4.50, max: Infinity, score: 5 },
];

const KPMR_RISK_INDICATORS = [
  { label: "Strong", value: "strong", color: "#4F6228", text: "#FFFFFF", min: 0, max: 1.49, score: 1 },
  { label: "Satisfactory", value: "satisfactory", color: "#92D050", text: "#000000", min: 1.50, max: 2.49, score: 2 },
  { label: "Fair", value: "fair", color: "#FFFF00", text: "#000000", min: 2.50, max: 3.49, score: 3 },
  { label: "Marginal", value: "marginal", color: "#FFC000", text: "#000000", min: 3.50, max: 4.49, score: 4 },
  { label: "Unsatisfactory", value: "unsatisfactory", text: "#FFFFFF", color: "#FF0000", min: 4.50, max: Infinity, score: 5 },
];

// ==================== FUNGSI HELPERS ====================
const truncateToTwoDecimals = (num) => {
  if (num === undefined || num === null || isNaN(num)) return 0;
  return Math.floor(num * 100) / 100;
};

const formatTwoDecimalsTruncate = (num) => {
  return truncateToTwoDecimals(num).toFixed(2);
};

const checkDataAvailability = (inherentSummary, kpmrSummary) => {
  const hasInherent = inherentSummary !== undefined && inherentSummary !== null && inherentSummary > 0;
  const hasKpmr = kpmrSummary !== undefined && kpmrSummary !== null && kpmrSummary > 0;
  if (!hasInherent && !hasKpmr) return "no-data";
  if ((hasInherent && !hasKpmr) || (!hasInherent && hasKpmr)) return "partial-data";
  return "complete-data";
};

const getRiskIndicator = (score, type = "inherent", hasData = true) => {
  if (!hasData) {
    return {
      label: "Data Tidak Ditemukan",
      value: "no-data",
      color: "#6B7280",
      text: "#FFFFFF",
      score: 0,
      hasData: false
    };
  }
  if (score === undefined || score === null) {
    return type === "kpmr"
      ? { ...KPMR_RISK_INDICATORS[KPMR_RISK_INDICATORS.length - 1], hasData: true }
      : { ...INHERENT_RISK_INDICATORS[INHERENT_RISK_INDICATORS.length - 1], hasData: true };
  }
  const indicators = type === "kpmr" ? KPMR_RISK_INDICATORS : INHERENT_RISK_INDICATORS;
  const truncatedScore = truncateToTwoDecimals(score);
  for (const indicator of indicators) {
    if (truncatedScore >= indicator.min && truncatedScore <= indicator.max) {
      return { ...indicator, hasData: true };
    }
  }
  return type === "kpmr"
    ? { ...KPMR_RISK_INDICATORS[KPMR_RISK_INDICATORS.length - 1], hasData: true }
    : { ...INHERENT_RISK_INDICATORS[INHERENT_RISK_INDICATORS.length - 1], hasData: true };
};

const defaultBhz = (id) =>
  id === "operasional-regulatory" || id === "strategis-regulatory" ? 20 : 10;

// ==================== FUNGSI NORMALISASI INHERENT ====================
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

// ==================== FUNGSI PENGAMBILAN DATA UNTUK EXPORT ====================
function getDataForQuarter(year, quarter, bhzOverrides = {}) {
  const rows = [];

  CATEGORIES.forEach((cat) => {
    // INHERENT
    let inherent = 0;
    let hasInherentData = false;
    try {
      const derived = loadDerived({
        categoryId: cat.id,
        year: year.toString(),
        quarter: quarter.toLowerCase(),
      });
      inherent = Number(derived?.summary ?? 0);
      hasInherentData = inherent > 0;
    } catch (error) {
      console.warn(`Error loading inherent for ${cat.id}:`, error);
    }

    // KPMR
    let kpmr = 0;
    let hasKpmrData = false;
    try {
      const kpmrRows = loadKpmr({
        categoryId: cat.id,
        year: year.toString(),
      });
      if (Array.isArray(kpmrRows)) {
        let total = 0, count = 0;
        kpmrRows.forEach((a) => {
          a.pertanyaanList?.forEach((p) => {
            const v = Number(p.skor?.[quarter.toLowerCase()] ?? p.skor?.[quarter.toUpperCase()]);
            if (!isNaN(v)) {
              total += v;
              count++;
            }
          });
        });
        if (count) {
          kpmr = total / count;
          hasKpmrData = kpmr > 0;
        }
      }
    } catch (error) {
      console.warn(`Error loading KPMR for ${cat.id}:`, error);
    }

    const bhz = bhzOverrides[cat.id] ?? defaultBhz(cat.id);
    const inherentSkor = truncateToTwoDecimals(inherent);
    const kpmrSkor = truncateToTwoDecimals(kpmr);
    const inherentNilai = truncateToTwoDecimals(inherentSkor * (bhz / 100));
    const kpmrNilai = truncateToTwoDecimals(kpmrSkor * (bhz / 100));
    const inherentIndicator = getRiskIndicator(inherentSkor, "inherent", hasInherentData);
    const kpmrIndicator = getRiskIndicator(kpmrSkor, "kpmr", hasKpmrData);
    const dataStatus = checkDataAvailability(inherent, kpmr);

    rows.push({
      id: cat.id,
      nama: cat.label,
      bhz,
      inherentSkor,
      kpmrSkor,
      inherentNilai,
      kpmrNilai,
      inherentIndicator,
      kpmrIndicator,
      hasInherentData,
      hasKpmrData,
      dataStatus,
    });
  });

  // FOOTER per quarter (hanya data yang ada)
  const totalBhz = rows.reduce((s, r) => s + r.bhz, 0);
  const inherentDataItems = rows.filter(item => item.hasInherentData);
  const kpmrDataItems = rows.filter(item => item.hasKpmrData);

  let avgInherentNilai = 0, avgKpmrNilai = 0;
  if (inherentDataItems.length > 0) {
    const totalInherentNilai = inherentDataItems.reduce((s, r) => s + r.inherentNilai, 0);
    avgInherentNilai = truncateToTwoDecimals(totalInherentNilai / inherentDataItems.length);
  }
  if (kpmrDataItems.length > 0) {
    const totalKpmrNilai = kpmrDataItems.reduce((s, r) => s + r.kpmrNilai, 0);
    avgKpmrNilai = truncateToTwoDecimals(totalKpmrNilai / kpmrDataItems.length);
  }

  const inherentIndicator = getRiskIndicator(avgInherentNilai, "inherent", inherentDataItems.length > 0);
  const kpmrIndicator = getRiskIndicator(avgKpmrNilai, "kpmr", kpmrDataItems.length > 0);

  return {
    rows,
    footer: {
      totalBhz,
      avgInherentNilai,
      avgKpmrNilai,
      inherentIndicator,
      kpmrIndicator,
      inherentDataCount: inherentDataItems.length,
      kpmrDataCount: kpmrDataItems.length,
      totalCategories: rows.length,
      hasInherentData: inherentDataItems.length > 0,
      hasKpmrData: kpmrDataItems.length > 0,
    },
  };
}

function getKompositDataTahunan({ year, bhzOverrides = {} }) {
  const quarters = ["Q1", "Q2", "Q3", "Q4"];
  const result = { year, quarters: {} };
  quarters.forEach((quarter) => {
    result.quarters[quarter] = getDataForQuarter(year, quarter, bhzOverrides);
  });
  return result;
}

// ==================== FUNGSI EXPORT EXCEL ====================
const borderAll = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};
const center = { vertical: "middle", horizontal: "center" };

const setCell = (cell, value, opts = {}) => {
  cell.value = value;
  cell.border = borderAll;
  cell.alignment = center;
  if (opts.bold) cell.font = { bold: true };
  if (opts.bg) {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: opts.bg.replace("#", "") },
    };
  }
  if (opts.color) {
    cell.font = { ...(cell.font || {}), color: { argb: opts.color.replace("#", "") } };
  }
  if (opts.fontSize) cell.font = { ...(cell.font || {}), size: opts.fontSize };
};

async function exportKompositExcel({ year, bhzOverrides }) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Komposit Tahunan");

  // Column widths (4 tabel × 5 kolom + spacer)
  ws.columns = [
    { width: 3 },   // A: spacer
    { width: 26 },  // B: Kategori Maret
    { width: 10 },  // C: BHZ Maret
    { width: 22 },  // D: Peringkat Maret
    { width: 12 },  // E: Skor Maret
    { width: 14 },  // F: Nilai Maret
    { width: 5 },   // G: spacer
    { width: 26 },  // H: Kategori Juni
    { width: 10 },  // I: BHZ Juni
    { width: 22 },  // J: Peringkat Juni
    { width: 12 },  // K: Skor Juni
    { width: 14 },  // L: Nilai Juni
    { width: 5 },   // M: spacer
    { width: 26 },  // N: Kategori September
    { width: 10 },  // O: BHZ September
    { width: 22 },  // P: Peringkat September
    { width: 12 },  // Q: Skor September
    { width: 14 },  // R: Nilai September
    { width: 5 },   // S: spacer
    { width: 26 },  // T: Kategori Desember
    { width: 10 },  // U: BHZ Desember
    { width: 22 },  // V: Peringkat Desember
    { width: 12 },  // W: Skor Desember
    { width: 14 },  // X: Nilai Desember
  ];

  const quarters = ["Maret", "Juni", "September", "Desember"];
  const quarterKeys = { Maret: "Q1", Juni: "Q2", September: "Q3", Desember: "Q4" };
  const tahunanData = getKompositDataTahunan({ year, bhzOverrides });

  const quarterData = {};
  quarters.forEach(q => {
    const key = quarterKeys[q];
    quarterData[q] = tahunanData.quarters[key] || {
      rows: [],
      footer: {
        totalBhz: 0,
        avgInherentNilai: 0,
        avgKpmrNilai: 0,
        inherentIndicator: { label: "N/A", color: "#FFFFFF", text: "#000000" },
        kpmrIndicator: { label: "N/A", color: "#FFFFFF", text: "#000000" }
      }
    };
  });

  // Title utama
  ws.mergeCells("B1:X1");
  setCell(ws.getCell("B1"), `LAPORAN KOMPOSIT TAHUNAN ${year}`, {
    bold: true,
    fontSize: 16,
  });

  // Header setiap quarter
  const quarterHeaders = [
    { start: "B3", end: "F3", title: `${quarters[0]} - ${year}` },
    { start: "H3", end: "L3", title: `${quarters[1]} - ${year}` },
    { start: "N3", end: "R3", title: `${quarters[2]} - ${year}` },
    { start: "T3", end: "X3", title: `${quarters[3]} - ${year}` },
  ];
  quarterHeaders.forEach(header => {
    ws.mergeCells(`${header.start}:${header.end}`);
    setCell(ws.getCell(header.start), header.title, { bold: true, bg: "1D3566", fontSize: 12, color:"FFFFFFFF"});
  });

  // ========== TABEL INHERENT ==========
  const inherentHeaderRow = 5;
  const inherentHeaders = [
    { col: "B", title: "Tabel Inherent" },
    { col: "H", title: "Tabel Inherent" },
    { col: "N", title: "Tabel Inherent" },
    { col: "T", title: "Tabel Inherent" },
  ];
  inherentHeaders.forEach(header => {
    const endCol = String.fromCharCode(header.col.charCodeAt(0) + 4);
    ws.mergeCells(`${header.col}${inherentHeaderRow}:${endCol}${inherentHeaderRow}`);
    setCell(ws.getCell(`${header.col}${inherentHeaderRow}`), header.title, { bold: true, bg: "1F497D" ,color:"FFFFFFFF"   });
  });

  const inherentColumnHeaders = 6;
  const columnTitles = ["Kategori", "BHZ (%)", "Peringkat", "Skor", "Nilai"];
  quarterHeaders.forEach((quarterHeader, qIndex) => {
    const startCol = quarterHeader.start.charAt(0);
    columnTitles.forEach((title, colIndex) => {
      const col = String.fromCharCode(startCol.charCodeAt(0) + colIndex);
      setCell(ws.getCell(`${col}${inherentColumnHeaders}`), title, { bold: true, bg: "1D3566", color:"FFFFFFFF" });
    });
  });

  const startDataRow = 7;
  const firstQuarterWithData = quarters.find(q => quarterData[q].rows.length > 0);
  const categories = firstQuarterWithData ? quarterData[firstQuarterWithData].rows : [];

  if (categories.length > 0) {
    categories.forEach((category, rowIndex) => {
      const currentRow = startDataRow + rowIndex;
      quarterHeaders.forEach((quarterHeader, qIndex) => {
        const startCol = quarterHeader.start.charAt(0);
        const quarter = quarters[qIndex];
        const data = quarterData[quarter]?.rows?.[rowIndex];
        if (data) {
          setCell(ws.getCell(`${startCol}${currentRow}`), data.nama);
          setCell(ws.getCell(`${String.fromCharCode(startCol.charCodeAt(0) + 1)}${currentRow}`), data.bhz);
          // Sel Peringkat dengan warna latar dan teks sesuai indikator
          setCell(ws.getCell(`${String.fromCharCode(startCol.charCodeAt(0) + 2)}${currentRow}`),
            data.inherentIndicator?.label || "N/A",
            {
              bg: data.inherentIndicator?.color || "FFFFFF",
              color: data.inherentIndicator?.text || "#000000",
            bold :true,
            size : 12,
            }
          );
          setCell(ws.getCell(`${String.fromCharCode(startCol.charCodeAt(0) + 3)}${currentRow}`), data.inherentSkor);
          setCell(ws.getCell(`${String.fromCharCode(startCol.charCodeAt(0) + 4)}${currentRow}`), data.inherentNilai);
        } else {
          setCell(ws.getCell(`${startCol}${currentRow}`), "N/A");
          setCell(ws.getCell(`${String.fromCharCode(startCol.charCodeAt(0) + 1)}${currentRow}`), 0);
          setCell(ws.getCell(`${String.fromCharCode(startCol.charCodeAt(0) + 2)}${currentRow}`), "N/A", { bg: "FFFFFF" });
          setCell(ws.getCell(`${String.fromCharCode(startCol.charCodeAt(0) + 3)}${currentRow}`), 0);
          setCell(ws.getCell(`${String.fromCharCode(startCol.charCodeAt(0) + 4)}${currentRow}`), 0);
        }
      });
    });

    // Footer INHERENT
    const inherentFooterRow = startDataRow + categories.length;
    quarterHeaders.forEach((quarterHeader, qIndex) => {
      const startCol = quarterHeader.start.charAt(0);
      const footer = quarterData[quarters[qIndex]]?.footer;
      if (footer) {
        const colD = String.fromCharCode(startCol.charCodeAt(0) + 2);
        const colE = String.fromCharCode(startCol.charCodeAt(0) + 3);
        ws.mergeCells(`${colD}${inherentFooterRow}:${colE}${inherentFooterRow}`);
        setCell(ws.getCell(`${startCol}${inherentFooterRow}`), "Peringkat Komposit", { bold: true, bg: "002060", color: "FFFFFF" });
        setCell(ws.getCell(`${String.fromCharCode(startCol.charCodeAt(0) + 1)}${inherentFooterRow}`), footer.totalBhz, { bold: true, bg: "002060", color:"FFFFFFFF" });
        setCell(ws.getCell(`${colD}${inherentFooterRow}`),
          footer.inherentIndicator?.label || "N/A",
          {
            bg: footer.inherentIndicator?.color || "FFFFFF",
            color: footer.inherentIndicator?.text || "#000000",
            bold :true,
            size : 12,
          }
        );
        setCell(ws.getCell(`${String.fromCharCode(startCol.charCodeAt(0) + 4)}${inherentFooterRow}`), footer.avgInherentNilai, { bold: true, bg: "002060", color:"FFFFFFFF" });
        ws.getRow(inherentFooterRow).height = 30;
      }
    });

    const spacerRow = inherentFooterRow + 1;
    ws.getRow(spacerRow).height = 20;

    // ========== TABEL KPMR ==========
    const kpmrStartRow = spacerRow + 1;
    const kpmrHeaderRow = kpmrStartRow;
    const kpmrHeaders = [
      { col: "B", title: "Tabel KPMR" },
      { col: "H", title: "Tabel KPMR" },
      { col: "N", title: "Tabel KPMR" },
      { col: "T", title: "Tabel KPMR" },
    ];
    kpmrHeaders.forEach(header => {
      const endCol = String.fromCharCode(header.col.charCodeAt(0) + 4);
      ws.mergeCells(`${header.col}${kpmrHeaderRow}:${endCol}${kpmrHeaderRow}`);
      setCell(ws.getCell(`${header.col}${kpmrHeaderRow}`), header.title, { bold: true, bg: "1F497D" ,color:"FFFFFFFF"   });
    });

    const kpmrColumnHeaders = kpmrStartRow + 1;
    quarterHeaders.forEach((quarterHeader, qIndex) => {
      const startCol = quarterHeader.start.charAt(0);
      columnTitles.forEach((title, colIndex) => {
        const col = String.fromCharCode(startCol.charCodeAt(0) + colIndex);
        setCell(ws.getCell(`${col}${kpmrColumnHeaders}`), title, { bold: true, bg: "1D3566", color:"FFFFFFFF" });
      });
    });

    const kpmrStartDataRow = kpmrColumnHeaders + 1;
    categories.forEach((category, rowIndex) => {
      const currentRow = kpmrStartDataRow + rowIndex;
      quarterHeaders.forEach((quarterHeader, qIndex) => {
        const startCol = quarterHeader.start.charAt(0);
        const quarter = quarters[qIndex];
        const data = quarterData[quarter]?.rows?.[rowIndex];
        if (data) {
          setCell(ws.getCell(`${startCol}${currentRow}`), data.nama);
          setCell(ws.getCell(`${String.fromCharCode(startCol.charCodeAt(0) + 1)}${currentRow}`), data.bhz);
          // Sel Peringkat KPMR dengan warna latar dan teks sesuai indikator
          setCell(ws.getCell(`${String.fromCharCode(startCol.charCodeAt(0) + 2)}${currentRow}`),
            data.kpmrIndicator?.label || "N/A",
            {
              bg: data.kpmrIndicator?.color || "FFFFFF",
              color: data.kpmrIndicator?.text || "#000000",
            bold :true,
            size : 12,
            }
          );
          setCell(ws.getCell(`${String.fromCharCode(startCol.charCodeAt(0) + 3)}${currentRow}`), data.kpmrSkor);
          setCell(ws.getCell(`${String.fromCharCode(startCol.charCodeAt(0) + 4)}${currentRow}`), data.kpmrNilai);
        } else {
          setCell(ws.getCell(`${startCol}${currentRow}`), "N/A");
          setCell(ws.getCell(`${String.fromCharCode(startCol.charCodeAt(0) + 1)}${currentRow}`), 0);
          setCell(ws.getCell(`${String.fromCharCode(startCol.charCodeAt(0) + 2)}${currentRow}`), "N/A", { bg: "FFFFFF" });
          setCell(ws.getCell(`${String.fromCharCode(startCol.charCodeAt(0) + 3)}${currentRow}`), 0);
          setCell(ws.getCell(`${String.fromCharCode(startCol.charCodeAt(0) + 4)}${currentRow}`), 0);
        }
      });
    });

    const kpmrFooterRow = kpmrStartDataRow + categories.length;
    quarterHeaders.forEach((quarterHeader, qIndex) => {
      const startCol = quarterHeader.start.charAt(0);
      const footer = quarterData[quarters[qIndex]]?.footer;
      if (footer) {
        const colD = String.fromCharCode(startCol.charCodeAt(0) + 2);
        const colE = String.fromCharCode(startCol.charCodeAt(0) + 3);
        ws.mergeCells(`${colD}${kpmrFooterRow}:${colE}${kpmrFooterRow}`);
        setCell(ws.getCell(`${startCol}${kpmrFooterRow}`), "Peringkat Komposit", { bold: true, bg: "002060", color: "FFFFFF" });
        setCell(ws.getCell(`${String.fromCharCode(startCol.charCodeAt(0) + 1)}${kpmrFooterRow}`), footer.totalBhz, { bold: true, bg: "002060", color:"FFFFFFFF" });
        setCell(ws.getCell(`${colD}${kpmrFooterRow}`),
          footer.kpmrIndicator?.label || "N/A",
          {
            bg: footer.kpmrIndicator?.color || "FFFFFF",
            color: footer.kpmrIndicator?.text || "#000000",
            bold :true,
            size : 12,
          }
        );
        setCell(ws.getCell(`${String.fromCharCode(startCol.charCodeAt(0) + 4)}${kpmrFooterRow}`), footer.avgKpmrNilai, { bold: true, bg: "002060", color:"FFFFFFFF" });
        ws.getRow(kpmrFooterRow).height = 30;
      }
    });
  } else {
    ws.mergeCells("B6:X6");
    setCell(ws.getCell("B6"), "Tidak ada data komposit untuk tahun ini", { bold: true, fontSize: 14 });
  }

  const buf = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buf]), `Komposit_Tahunan_${year}.xlsx`);
}

// ==================== KOMPONEN UTAMA ====================
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
        const inherentSummaryTruncated = truncateToTwoDecimals(inherentSummary);

        // KPMR
        const kpmrRows = loadKpmr({ categoryId: category.id, year });
        let kpmrSummary = 0;
        if (Array.isArray(kpmrRows) && kpmrRows.length > 0) {
          let total = 0, count = 0;
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
        const kpmrSummaryTruncated = truncateToTwoDecimals(kpmrSummary);

        data.push({
          id: category.id,
          nama: category.label,
          Icon: category.Icon,
          inherentSummary: inherentSummaryTruncated,
          kpmrSummary: kpmrSummaryTruncated,
          hasInherentData: inherentSummaryTruncated > 0,
          hasKpmrData: kpmrSummaryTruncated > 0,
          dataStatus: checkDataAvailability(inherentSummaryTruncated, kpmrSummaryTruncated)
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

export default function PeringkatKomposit() {
  const { search, year, activeQuarter } = useHeaderStore();
  const summaryPerHalaman = useGlobalSummaryAdapter();

  const [bhzValues, setBhzValues] = useState(() => {
    const defaults = {};
    CATEGORIES.forEach((category) => {
      defaults[category.id] = defaultBhz(category.id);
    });
    return defaults;
  });

  const filteredData = useMemo(() => {
    if (!search) return summaryPerHalaman;
    const s = search.toLowerCase();
    return summaryPerHalaman.filter((h) => h.nama.toLowerCase().includes(s));
  }, [search, summaryPerHalaman]);

  const tableData = useMemo(() => {
    return filteredData.map((item) => {
      const bvt = 100;
      const bhz = bhzValues[item.id] ?? defaultBhz(item.id);
      const inherentSummary = item.inherentSummary || 0;
      const kpmrSummary = item.kpmrSummary || 0;
      const inherentSkor = truncateToTwoDecimals(inherentSummary * (bvt / 100));
      const kpmrSkor = truncateToTwoDecimals(kpmrSummary);
      const inherentNilai = truncateToTwoDecimals(inherentSkor * (bhz / 100));
      const kpmrNilai = truncateToTwoDecimals(kpmrSkor * (bhz / 100));
      const inherentIndicator = getRiskIndicator(inherentSkor, "inherent", item.hasInherentData);
      const kpmrIndicator = getRiskIndicator(kpmrSkor, "kpmr", item.hasKpmrData);
      return {
        ...item,
        bvt,
        bhz,
        inherentSummary,
        kpmrSummary,
        inherentSkor,
        kpmrSkor,
        inherentNilai,
        kpmrNilai,
        inherentIndicator,
        kpmrIndicator,
      };
    });
  }, [filteredData, bhzValues]);

  const footerData = useMemo(() => {
    const inherentDataItems = tableData.filter(item => item.hasInherentData);
    const kpmrDataItems = tableData.filter(item => item.hasKpmrData);
    const totalBhz = tableData.reduce((sum, item) => sum + item.bhz, 0);
    let avgInherentNilai = 0, avgKpmrNilai = 0;
    if (inherentDataItems.length > 0) {
      const totalInherentNilai = inherentDataItems.reduce((sum, item) => sum + item.inherentNilai, 0);
      avgInherentNilai = truncateToTwoDecimals(totalInherentNilai / inherentDataItems.length);
    }
    if (kpmrDataItems.length > 0) {
      const totalKpmrNilai = kpmrDataItems.reduce((sum, item) => sum + item.kpmrNilai, 0);
      avgKpmrNilai = truncateToTwoDecimals(totalKpmrNilai / kpmrDataItems.length);
    }
    const IndicatoravgInherentNilai = getRiskIndicator(avgInherentNilai, "inherent", inherentDataItems.length > 0);
    const IndicatoravgkpmrNilai = getRiskIndicator(avgKpmrNilai, "kpmr", kpmrDataItems.length > 0);
    return {
      totalBhz,
      avgInherentNilai,
      avgKpmrNilai,
      IndicatoravgInherentNilai,
      IndicatoravgkpmrNilai,
      inherentDataCount: inherentDataItems.length,
      kpmrDataCount: kpmrDataItems.length,
      totalCategories: tableData.length,
      hasInherentData: inherentDataItems.length > 0,
      hasKpmrData: kpmrDataItems.length > 0,
      inherentIndicator: IndicatoravgInherentNilai,
      kpmrIndicator: IndicatoravgkpmrNilai,
    };
  }, [tableData]);

  const handleExportToExcel = async () => {
    try {
      await exportKompositExcel({ year, bhzOverrides: bhzValues });
      console.log("Export Excel Tahunan sukses");
    } catch (err) {
      console.error("EXPORT ERROR:", err);
      alert(err?.message || "Gagal export Excel Tahunan");
    }
  };

  const handleBhzChange = (id, value) => {
    setBhzValues(prev => ({ ...prev, [id]: Math.min(100, Math.max(0, Number(value) || 0)) }));
  };

  const IndicatorCell = ({ indicator, whiteText = false, showLabel = true }) => {
    const safeIndicator = indicator || getRiskIndicator(0, "inherent", false);
    return (
      <div
        className="rounded-full px-3 py-2 font-bold text-sm w-full flex items-center justify-center whitespace-nowrap min-h-[40px]"
        style={{ backgroundColor: safeIndicator.color, color: safeIndicator.text || (safeIndicator.hasData ? '#000000' : '#FFFFFF') }}
      >
        {safeIndicator.label}
      </div>
    );
  };

  const ScoreCell = ({ value, hasData = true, whiteText = false }) => {
    if (!hasData) return <div className={`font-semibold text-center ${whiteText ? 'text-white' : 'text-gray-500'}`}>0.00</div>;
    const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
    return <div className={`font-semibold text-center ${whiteText ? 'text-white' : 'text-gray-800'}`}>{formatTwoDecimalsTruncate(safeValue)}</div>;
  };

  const FooterIndicatorCell = ({ indicator, value, hasData, whiteText = false }) => {
    if (!hasData) {
      return (
        <div className="w-full flex flex-col items-center justify-center space-y-1">
          <div className="rounded-full px-3 py-2 font-bold text-sm w-full flex items-center justify-center whitespace-nowrap min-h-[40px] text-white" style={{ backgroundColor: '#6B7280' }}>
            Data Tidak Ditemukan
          </div>
        </div>
      );
    }
    const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
    const safeIndicator = indicator || getRiskIndicator(safeValue, "inherent", true);
    return (
      <div className="w-full flex flex-col items-center justify-center space-y-1">
        <IndicatorCell indicator={safeIndicator} whiteText={whiteText} />
      </div>
    );
  };

  const FooterAvgCell = ({ value, hasData, dataCount, totalCount, whiteText = false }) => {
    if (!hasData) return <div className={`font-bold text-lg ${whiteText ? 'text-white' : 'text-gray-800'}`}>0.00</div>;
    return <div className={`font-bold text-lg ${whiteText ? 'text-white' : 'text-gray-800'}`}>{formatTwoDecimalsTruncate(value)}</div>;
  };

  return (
    <div className="w-full min-h-screen p-4">
      <Header title="Komposit" onExportClick={handleExportToExcel} />

      <div className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header tabel (sama seperti asli) */}
        <div className="sticky top-0 z-10 bg-blue-700 text-white">
          <div className="grid grid-cols-16 p-4 font-bold text-lg relative">
            <div className="absolute left-[calc((4/16)*100%)] top-0 bottom-0 w-[2px] bg-white/50 z-20"></div>
            <div className="col-span-4 flex items-center justify-center border-blue-500">
              <div className="flex gap-2 uppercase items-center"><span>Jenis Risiko</span></div>
            </div>
            <div className="absolute left-[calc((5.9/16)*100%)] top-0 bottom-0 w-[2px] bg-white/50 z-20"></div>
            <div className="col-span-2 flex items-center justify-center border-blue-500"><span>BHz</span></div>
            <div className="col-span-5 flex items-center justify-center border-blue-500"><span>INHERENT</span></div>
            <div className="absolute left-[calc((10.8/16)*100%)] top-0 bottom-0 w-[2px] bg-white/50 z-20"></div>
            <div className="col-span-5 flex items-center justify-center"><span>KUALITAS PENERAPAN MANAJEMEN RISIKO</span></div>
          </div>
          <div className="sticky top-[64px] z-9 grid grid-cols-16 p-2 text-sm bg-blue-700 relative">
            <div className="absolute left-[calc((4/16)*100%)] top-0 bottom-0 w-[2px] bg-white/50 z-20"></div>
            <div className="col-span-4"></div>
            <div className="absolute left-[calc((5.9/16)*100%)] top-0 bottom-0 w-[2px] bg-white/50 z-20"></div>
            <div className="col-span-2"></div>
            <div className="col-span-3 text-center border-blue-400">Indicator</div>
            <div className="absolute left-[calc((9/16)*100%)] top-0 bottom-0 w-[2px] bg-white/50 z-20"></div>
            <div className="col-span-1 text-center border-blue-400">Skor</div>
            <div className="absolute left-[calc((10/16)*100%)] top-0 bottom-0 w-[2px] bg-white/50 z-20"></div>
            <div className="col-span-1 text-center mr-7 border-blue-400">Nilai</div>
            <div className="absolute left-[calc((10.8/16)*100%)] top-0 bottom-0 w-[2px] bg-white/50 z-20"></div>
            <div className="col-span-3 text-center">Indicator</div>
            <div className="absolute left-[calc((14/16)*100%)] top-0 bottom-0 w-[3px] bg-white/50 z-20"></div>
            <div className="col-span-1 text-center border-blue-400">Skor</div>
            <div className="absolute left-[calc((15/16)*100%)] top-0 bottom-0 w-[2px] bg-white/50 z-20"></div>
            <div className="col-span-1 text-center">Nilai</div>
          </div>
        </div>

        {/* Body tabel */}
        <div className="max-h-[calc(80vh-280px)] overflow-y-auto">
          <div className="divide-y relative">
            <div className="absolute left-[calc((4.04/16)*100%)] top-0 bottom-0 w-[2px] bg-gray-300 z-10"></div>
            {tableData.map((item) => (
              <div key={item.id} className="grid grid-cols-16 p-3 hover:bg-gray-50 transition-colors items-center relative">
                <div className="col-span-4 flex items-center gap-4 pl-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    {item.Icon ? <item.Icon className="w-5 h-5 text-blue-600" /> : <FileText className="w-5 h-5 text-blue-600" />}
                  </div>
                  <span className="font-bold text-gray-800">{item.nama}</span>
                </div>
                <div className="absolute left-[calc((5.96/16)*100%)] top-0 bottom-0 w-[2px] bg-gray-300 z-10"></div>
                <div className="col-span-2 flex items-center justify-center">
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={item.bhz}
                      onChange={(e) => handleBhzChange(item.id, e.target.value)}
                      className="w-16 text-center bg-white border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                    <span className="absolute right-2 top-1.5 text-gray-500 text-sm">%</span>
                  </div>
                </div>
                <div className="absolute left-[calc((10.9/16)*100%)] top-0 bottom-0 w-[2px] bg-gray-300 z-10"></div>
                <div className="col-span-3 flex items-center justify-center px-1">
                  <IndicatorCell indicator={item.inherentIndicator} />
                </div>
                <div className="col-span-1 ml-5 flex items-center justify-center">
                  <ScoreCell value={item.inherentSkor} hasData={item.hasInherentData} />
                </div>
                <div className="col-span-1 flex items-center justify-center">
                  <ScoreCell value={item.inherentNilai} hasData={item.hasInherentData} />
                </div>
                <div className="col-span-3 flex items-center justify-center px-1">
                  <IndicatorCell indicator={item.kpmrIndicator} />
                </div>
                <div className="col-span-1 ml-10 flex items-center justify-center">
                  <ScoreCell value={item.kpmrSkor} hasData={item.hasKpmrData} />
                </div>
                <div className="col-span-1 ml-10 flex items-center justify-center">
                  <ScoreCell value={item.kpmrNilai} hasData={item.hasKpmrData} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer tabel */}
        <div className="sticky bottom-0 z-10 bg-blue-900 border-t relative">
          <div className="grid grid-cols-16 p-3 text-white font-bold items-center">
            <div className="col-span-4 text-white flex items-center justify-center pl-4 text-lg">Peringkat Komposit</div>
            <div className="absolute left-[calc((4/16)*100%)] top-0 bottom-0 w-[2px] bg-white/50 z-20"></div>
            <div className="col-span-2 text-center text-lg">{footerData.totalBhz}%</div>
            <div className="absolute left-[calc((5.9/16)*100%)] top-0 bottom-0 w-[2px] bg-white/50 z-20"></div>
            <div className="col-span-3 -ml-0.5 mr-4 flex items-center justify-center">
              <FooterIndicatorCell indicator={footerData.IndicatoravgInherentNilai} value={footerData.avgInherentNilai} hasData={footerData.hasInherentData} whiteText={true} />
            </div>
            <div className="col-span-1 mr-4 flex items-center justify-end"><h4 className="text-white">Avg Nilai :</h4></div>
            <div className="col-span-1 flex mr-5 items-center justify-center">
              <FooterAvgCell value={footerData.avgInherentNilai} hasData={footerData.hasInherentData} dataCount={footerData.inherentDataCount} totalCount={footerData.totalCategories} whiteText={true} />
            </div>
            <div className="absolute left-[calc((10.8/16)*100%)] top-0 bottom-0 w-[2px] bg-white/50 z-20"></div>
            <div className="col-span-3 mr-4 -ml-2 flex items-center justify-center">
              <FooterIndicatorCell indicator={footerData.IndicatoravgkpmrNilai} value={footerData.avgKpmrNilai} hasData={footerData.hasKpmrData} whiteText={true} />
            </div>
            <div className="col-span-1 mr-2 flex items-center justify-end"><h4 className="text-white">Avg Nilai :</h4></div>
            <div className="col-span-1 flex items-center justify-center">
              <FooterAvgCell value={footerData.avgKpmrNilai} hasData={footerData.hasKpmrData} dataCount={footerData.kpmrDataCount} totalCount={footerData.totalCategories} whiteText={true} />
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
              <div key={idx} className="flex items-center gap-2 text-base font-semibold">
                <span className="w-5 h-5 rounded border" style={{ backgroundColor: i.color }} />
                <span className="text-gray-950">{i.label}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <span className="text-base font-semibold text-gray-950">KPMR :</span>
            {KPMR_RISK_INDICATORS.map((i, idx) => (
              <div key={idx} className="flex items-center gap-2 text-base font-semibold">
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