import React, { useMemo, useState, useEffect } from "react";
import Header from "../../components/header/Header";
import { useHeaderStore } from "../../store/headerStore";
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
  Circle,
} from "lucide-react";
import { loadInherent, loadKpmr, loadDerived } from "../../utils/storage/riskStorageNilai";
import { computeDerived } from "../../utils/compute/computeDerived";

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
  { label: "Low", value: "low", color: "#4F6228", min: 0, max: 1.49, score: 1 },
  { label: "Low To Moderate", value: "lowToModerate", color: "#92D050", min: 1.50, max: 2.49, score: 2 },
  { label: "Moderate", value: "moderate", color: "#FFFF00", min: 2.50, max: 3.49, score: 3 },
  { label: "Moderate To High", value: "moderateToHigh", color: "#FFC000", min: 3.50, max: 4.49, score: 4 },
  { label: "High", value: "high", color: "#FF0000", min: 4.50, max: 5, score: 5 },
];

const KPMR_RISK_INDICATORS = [
  { label: "Strong", value: "strong", color: "#4F6228", min: 0, max: 1.49, score: 1 },
  { label: "Satisfactory", value: "satisfactory", color: "#92D050", min: 1.50, max: 2.49, score: 2 },
  { label: "Fair", value: "fair", color: "#FFFF00", min: 2.50, max: 3.49, score: 3 },
  { label: "Marginal", value: "marginal", color: "#FFC000", min: 3.50, max: 4.49, score: 4 },
  { label: "Unsatisfactory", value: "unsatisfactory", color: "#FF0000", min: 4.50, max: 5, score: 5 },
];

const RISK_MATRIX = [
  [1, 1, 2, 3, 3],
  [1, 2, 2, 3, 4],
  [2, 2, 3, 4, 4],
  [2, 3, 4, 4, 5],
  [3, 3, 4, 5, 5],
];

const getRankFromValue = (value) => {
  if (value === null || value === undefined) return 0;
  if (isNaN(value)) return 0;
  const numValue = Number(value);
  if (numValue === 0) return 0;
  if (numValue <= 1.49) return 1;
  if (numValue <= 2.49) return 2;
  if (numValue <= 3.49) return 3;
  if (numValue <= 4.49) return 4;
  return 5;
};

const getNetRiskFromMatrixService = (inherent, kpmr) => {
  const i = getRankFromValue(inherent) - 1;
  const k = getRankFromValue(kpmr) - 1;
  if (i < 0 || k < 0) return 0;
  const score = RISK_MATRIX[i][k];
  switch (score) {
    case 1: return 0.75;
    case 2: return 2;
    case 3: return 3;
    case 4: return 4;
    case 5: return 4.75;
    default: return 0;
  }
};

const getDataForQuarter = (year, quarter) => {
  return CATEGORIES.map((category) => {
    let inherent = 0;
    let kpmr = 0;
    try {
      const derived = loadDerived({
        categoryId: category.id,
        year: year.toString(),
        quarter: quarter.toLowerCase(),
      });
      inherent = Number(derived?.summary ?? 0);
      const rows = loadKpmr({
        categoryId: category.id,
        year: year.toString(),
      });
      if (Array.isArray(rows)) {
        let total = 0;
        let count = 0;
        rows.forEach((a) => {
          a.pertanyaanList?.forEach((p) => {
            const v = Number(p.skor?.[quarter.toLowerCase()] ?? p.skor?.[quarter.toUpperCase()]);
            if (!isNaN(v)) {
              total += v;
              count++;
            }
          });
        });
        if (count) kpmr = total / count;
      }
    } catch {}
    const netRisk = Number(getNetRiskFromMatrixService(inherent, kpmr).toFixed(2));
    return {
      categoryName: category.label,
      inherent: Number(inherent.toFixed(2)),
      inherentRank: getRankFromValue(inherent),
      kpmr: Number(kpmr.toFixed(2)),
      kpmrRank: getRankFromValue(kpmr),
      netRisk: netRisk,
      netRiskRank: getRankFromValue(netRisk),
    };
  });
};

const getAverage = (rows, key) => {
  const valid = rows.filter(r => r[key] > 0);
  if (!valid.length) return 0;
  const sum = valid.reduce((a, b) => a + b[key], 0);
  return Number((sum / valid.length).toFixed(2));
};

const getAverageRank = (averageValue) => getRankFromValue(averageValue);

const getExportDataForXLSX = (year) => {
  const quarters = ["Q1", "Q2", "Q3", "Q4"];
  const result = {};
  quarters.forEach((q) => {
    const data = getDataForQuarter(year, q);
    const inherentAvg = getAverage(data, "inherent");
    const kpmrAvg = getAverage(data, "kpmr");
    const netRiskFromMatrix = getNetRiskFromMatrix(inherentAvg, kpmrAvg, true, true);
    result[q] = {
      rows: data,
      averages: {
        inherent: inherentAvg,
        inherentRank: getAverageRank(inherentAvg),
        kpmr: kpmrAvg,
        kpmrRank: getAverageRank(kpmrAvg),
        netRisk: netRiskFromMatrix,
        netRiskRank: getAverageRank(netRiskFromMatrix),
      },
    };
  });
  return { year, quarters: result };
};

const BORDER = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};

const center = { vertical: "middle", horizontal: "center" };

const styleHeaderBlue = (cell) => {
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F3A5F" } };
  cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
  cell.alignment = center;
  cell.border = BORDER;
};

const styleRiskText = (cell) => {
  cell.border = BORDER;
  cell.alignment = { vertical: "middle", horizontal: "left" };
  cell.font = { bold: true }; 
};

const styleNumber = (cell) => {
  cell.border = BORDER;
  cell.alignment = center;
  cell.font = { bold: true };
};

const styleScoreLabel = (cell) => {
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "1F3A5F" } };
  cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
  cell.alignment = center;
  cell.border = BORDER;
};

const getRiskColor = (v) => {
  if (!v) return "FFD9D9D9";
  if (v <= 1.49) return "FF4F6228";
  if (v <= 2.49) return "FF92D050";
  if (v <= 3.49) return "FFFFFF00";
  if (v <= 4.49) return "FFFFC000";
  return "FFFF0000";
};

const getContrastTextColor = (bgColorArgb) => {
  const hex = bgColorArgb.slice(2);
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "FF000000" : "FFFFFFFF";
};

const styleRiskCell = (cell, value) => {
  styleNumber(cell);
  const bgColor = getRiskColor(value);
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };
  cell.font = { bold: true, color: { argb: getContrastTextColor(bgColor) } };
};

const getDisplayValue = (row, type, useRank = true) => {
  if (useRank) {
    switch (type) {
      case 'inherent': return row.inherentRank === "data tidak ditemukan" ? "data tidak ditemukan" : row.inherentRank;
      case 'kpmr': return row.kpmrRank === "data tidak ditemukan" ? "data tidak ditemukan" : row.kpmrRank;
      case 'netRisk': return row.netRiskRank === "data tidak ditemukan" ? "data tidak ditemukan" : row.netRiskRank;
      default: return row[type];
    }
  }
  return row[type];
};

const createMatrixTable = (ws, startRow, startCol, quarter, month, year, averages) => {
  let row = startRow;
  ws.mergeCells(row, startCol, row, startCol + 5);
  const titleCell = ws.getCell(row, startCol);
  titleCell.value = `${month} - ${year}`;
  titleCell.font = { bold: true, size: 12, color: { argb: "FF000000" } };
  titleCell.alignment = center;
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE6E6E6" } };
  titleCell.border = BORDER;
  row++;

  const matrixData = [
    [1, 1, 2, 3, 3],
    [1, 2, 2, 3, 4],
    [2, 2, 3, 4, 4],
    [2, 3, 4, 4, 5],
    [3, 3, 4, 5, 5]
  ];
  const inherentLabels = ["Low (1)", "Low to Moderate (2)", "Moderate (3)", "Moderate to High (4)", "High (5)"];
  const kpmrLabels = ["Strong (1)", "Satisfactory (2)", "Fair (3)", "Marginal (4)", "Unsatisfactory (5)"];

  ws.getCell(row, startCol).border = BORDER;
  for (let i = 0; i < kpmrLabels.length; i++) {
    const cell = ws.getCell(row, startCol + i + 1);
    cell.value = kpmrLabels[i];
    cell.font = { bold: true };
    cell.alignment = center;
    cell.border = BORDER;
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD9E1F2" } };
  }
  row++;

  for (let i = 0; i < matrixData.length; i++) {
    const labelCell = ws.getCell(row, startCol);
    labelCell.value = inherentLabels[i];
    labelCell.font = { bold: true };
    labelCell.alignment = center;
    labelCell.border = BORDER;
    labelCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD9E1F2" } };
    for (let j = 0; j < matrixData[i].length; j++) {
      const cell = ws.getCell(row, startCol + j + 1);
      cell.value = matrixData[i][j];
      cell.alignment = center;
      cell.border = BORDER;
      const bgColor = getRiskColor(matrixData[i][j]);
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };
      cell.font = { color: { argb: getContrastTextColor(bgColor) } };
    }
    row++;
  }

  const inherentIndex = (averages.inherentRank && averages.inherentRank !== "data tidak ditemukan")
    ? averages.inherentRank - 1
    : Math.round(averages.inherent) - 1;
  const kpmrIndex = (averages.kpmrRank && averages.kpmrRank !== "data tidak ditemukan")
    ? averages.kpmrRank - 1
    : Math.round(averages.kpmr) - 1;

  if (inherentIndex >= 0 && inherentIndex < 5 && kpmrIndex >= 0 && kpmrIndex < 5) {
    const markerRow = startRow + 2 + inherentIndex;
    const markerCol = startCol + 1 + kpmrIndex;
    const markerCell = ws.getCell(markerRow, markerCol);
    const matrixValue = matrixData[inherentIndex][kpmrIndex];
    const circledNumbers = { 1: '①', 2: '②', 3: '③', 4: '④', 5: '⑤' };
    markerCell.value = circledNumbers[matrixValue];
    markerCell.font = { bold: true, size: 11, color: { argb: "FF000000" } };
    markerCell.alignment = center;

    const inherentText = averages.inherentRank !== "data tidak ditemukan"
      ? `Rank: ${averages.inherentRank}`
      : `Inherent Risk: ${averages.inherent.toFixed(2)}`;
    const kpmrText = averages.kpmrRank !== "data tidak ditemukan"
      ? `Rank: ${averages.kpmrRank}`
      : `KPMR: ${averages.kpmr.toFixed(2)}`;
    const netRiskText = averages.netRiskRank !== "data tidak ditemukan"
      ? `Rank: ${averages.netRiskRank}`
      : `Net Risk: ${averages.netRisk.toFixed(2)}`;
    markerCell.note = `Posisi berdasarkan:\n${inherentText}\n${kpmrText}\n${netRiskText}`;
  }
  return row;
};

// Fungsi baru untuk tabel penilaian
const createPenilaianTable = (ws, startRow, startCol, quarterData) => {
  const { inherentRank, kpmrRank, netRiskRank } = quarterData;

  // Header
  ws.mergeCells(startRow, startCol, startRow, startCol);
  ws.mergeCells(startRow, startCol + 1, startRow, startCol + 1);
  ws.mergeCells(startRow, startCol + 2, startRow, startCol + 3);

  const cell1 = ws.getCell(startRow, startCol);
  cell1.value = "Penilaian";
  styleHeaderBlue(cell1);

  const cell2 = ws.getCell(startRow, startCol + 1);
  cell2.value = "Peringkat Komposit";
  styleHeaderBlue(cell2);

  const cell3 = ws.getCell(startRow, startCol + 2);
  cell3.value = "Deskripsi";
  styleHeaderBlue(cell3);
  for (let c = startCol + 2; c <= startCol + 3; c++) {
    const cell = ws.getCell(startRow, c);
    cell.border = BORDER;
    cell.alignment = center;
  }

  // Data baris
  const rows = [
    { label: "Risiko Inherent", rank: inherentRank, descMap: INHERENT_RISK_INDICATORS },
    { label: "KPMR", rank: kpmrRank, descMap: KPMR_RISK_INDICATORS },
    { label: "Risiko Korporasi", rank: netRiskRank, descMap: INHERENT_RISK_INDICATORS },
  ];

  rows.forEach((row, idx) => {
    const currentRow = startRow + 1 + idx;

    // Kolom label
    const labelCell = ws.getCell(currentRow, startCol);
    labelCell.value = row.label;
    labelCell.border = BORDER;
    labelCell.alignment = { vertical: "middle", horizontal: "left" };
    labelCell.font = { bold: true }; 

    // Kolom peringkat (angka)
    const rankCell = ws.getCell(currentRow, startCol + 1);
    rankCell.value = row.rank || 0;
    styleRiskCell(rankCell, row.rank);

    // Kolom deskripsi (merge 2 kolom)
    ws.mergeCells(currentRow, startCol + 2, currentRow, startCol + 3);
    const descCell = ws.getCell(currentRow, startCol + 2);
    let description = "";
    if (row.rank === 0 || row.rank === undefined || row.rank === null) {
      description = "Data Tidak Tersedia";
    } else {
      const indicator = row.descMap.find(d => d.score === row.rank);
      description = indicator ? indicator.label : "Data Tidak Tersedia";
    }
    descCell.value = description;
    descCell.border = BORDER;
    descCell.alignment = center;
    
    // Tambahkan background warna sesuai rank
    const bgColor = getRiskColor(row.rank);
    descCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };
    descCell.font = {
  bold: true,
  size: 11,
  color: { argb: getContrastTextColor(bgColor) }
};
  });
};

const exportRekapData2 = async (year, useRank = true) => {
  const raw = getExportDataForXLSX(year);
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet(`Rekap ${year}`);
  ws.properties.defaultRowHeight = 20;

  ws.mergeCells(1, 1, 1, 21);
  const titleCell = ws.getCell(1, 1);
  titleCell.value = `Laporan Komposit Tahun ${year}`;
  titleCell.font = { bold: true, size: 16 };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFF" }};
  titleCell.border = BORDER;

  const quarters = [
    { key: "Q1", month: "Maret", startCol: 2 },
    { key: "Q2", month: "Juni", startCol: 7 },
    { key: "Q3", month: "September", startCol: 12 },
    { key: "Q4", month: "Desember", startCol: 17 },
  ];

  quarters.forEach((q) => {
    const endCol = q.key === 'Q4' ? q.startCol + 4 : q.startCol + 3;
    ws.mergeCells(3, q.startCol, 3, endCol);
    const cell = ws.getCell(3, q.startCol);
    cell.value = `${q.month} - ${year}`;
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.alignment = center;
    cell.border = BORDER;
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "1F3A5F" } };
  });

  const headers = ["Risiko", "Inherent Risk", "KPMR", "Net Risk"];
  quarters.forEach((q) => {
    headers.forEach((h, idx) => {
      const cell = ws.getCell(4, q.startCol + idx);
      cell.value = h;
      styleHeaderBlue(cell);
    });
  });

  const rowCount = raw.quarters.Q1.rows.length;
  for (let i = 0; i < rowCount; i++) {
    const currentRow = 5 + i;
    quarters.forEach((q) => {
      const rowData = raw.quarters[q.key].rows[i];
      ws.getCell(currentRow, q.startCol).value = rowData.categoryName;
      styleRiskText(ws.getCell(currentRow, q.startCol));

      const inherentVal = getDisplayValue(rowData, 'inherent', useRank);
      const inherentStyleVal = rowData.inherent;
      const inherentCell = ws.getCell(currentRow, q.startCol + 1);
      inherentCell.value = inherentVal;
      styleRiskCell(inherentCell, inherentStyleVal);

      const kpmrVal = getDisplayValue(rowData, 'kpmr', useRank);
      const kpmrStyleVal = rowData.kpmr;
      const kpmrCell = ws.getCell(currentRow, q.startCol + 2);
      kpmrCell.value = kpmrVal;
      styleRiskCell(kpmrCell, kpmrStyleVal);

      const netRiskVal = getDisplayValue(rowData, 'netRisk', useRank);
      const netRiskStyleVal = rowData.netRisk;
      const netRiskCell = ws.getCell(currentRow, q.startCol + 3);
      netRiskCell.value = netRiskVal;
      styleRiskCell(netRiskCell, netRiskStyleVal);
    });
  }

  const avgRow = 5 + rowCount;
  quarters.forEach((q) => {
    const avgData = raw.quarters[q.key].averages;
    const labelCell = ws.getCell(avgRow, q.startCol);
    labelCell.value = "Skor Profil Risiko";
    styleScoreLabel(labelCell);

    const inherentAvg = useRank ? avgData.inherentRank : avgData.inherent;
    const inherentAvgCell = ws.getCell(avgRow, q.startCol + 1);
    inherentAvgCell.value = inherentAvg;
    styleRiskCell(inherentAvgCell, avgData.inherent);

    const kpmrAvg = useRank ? avgData.kpmrRank : avgData.kpmr;
    const kpmrAvgCell = ws.getCell(avgRow, q.startCol + 2);
    kpmrAvgCell.value = kpmrAvg;
    styleRiskCell(kpmrAvgCell, avgData.kpmr);

    const netRiskAvg = useRank ? avgData.netRiskRank : avgData.netRisk;
    const netRiskAvgCell = ws.getCell(avgRow, q.startCol + 3);
    netRiskAvgCell.value = netRiskAvg;
    styleRiskCell(netRiskAvgCell, avgData.netRisk);
  });

  // Tambahkan tabel penilaian untuk setiap quarter, satu baris kosong setelah baris "Skor Profil Risiko"
  const penilaianRow = avgRow + 2; // baris kosong + 1
  quarters.forEach((q) => {
    const avgData = raw.quarters[q.key].averages;
    createPenilaianTable(ws, penilaianRow, q.startCol, {
      inherentRank: avgData.inherentRank,
      kpmrRank: avgData.kpmrRank,
      netRiskRank: avgData.netRiskRank,
    });
  });

  ws.columns = [
    { width: 5 }, { width: 26 }, { width: 20 }, { width: 15 }, { width: 15 },
    { width: 2 }, { width: 26 }, { width: 20 }, { width: 15 }, { width: 15 },
    { width: 2 }, { width: 26 }, { width: 20 }, { width: 15 }, { width: 15 },
    { width: 2 }, { width: 26 }, { width: 20 }, { width: 15 }, { width: 15 },
    { width: 2 }
  ];

  const wsMatrix = wb.addWorksheet(`Matriks ${year}`);
  wsMatrix.properties.defaultRowHeight = 20;
  for (let i = 2; i <= 8; i++) wsMatrix.getRow(i).height = 30;
  for (let i = 13; i <= 18; i++) wsMatrix.getRow(i).height = 30;

  let currentRow = 2;
  const q1EndRow = createMatrixTable(wsMatrix, currentRow, 2, "Q1", "Maret", year, useRank ? raw.quarters.Q1.averages : raw.quarters.Q1.averages);
  const q2EndRow = createMatrixTable(wsMatrix, currentRow, 10, "Q2", "Juni", year, useRank ? raw.quarters.Q2.averages : raw.quarters.Q2.averages);
  currentRow = Math.max(q1EndRow, q2EndRow) + 3;
  createMatrixTable(wsMatrix, currentRow, 2, "Q3", "September", year, useRank ? raw.quarters.Q3.averages : raw.quarters.Q3.averages);
  createMatrixTable(wsMatrix, currentRow, 10, "Q4", "Desember", year, useRank ? raw.quarters.Q4.averages : raw.quarters.Q4.averages);

  wsMatrix.columns = [
    { width: 2 }, { width: 20 }, { width: 16 }, { width: 16 }, { width: 16 }, { width: 16 }, { width: 16 },
    { width: 1 }, { width: 1 }, { width: 20 }, { width: 16 }, { width: 16 }, { width: 16 }, { width: 16 }, { width: 16 }
  ];

  const buffer = await wb.xlsx.writeBuffer();
  const fileName = `RekapData2_${year}.xlsx`;
  saveAs(new Blob([buffer]), fileName);
};

const getIndicatorColor = (number) => {
  switch(number) {
    case 0: return "bg-gray-400";
    case 1: return "bg-[#4F6228] text-white";
    case 2: return "bg-[#92D050]";
    case 3: return "bg-[#FFFF00]";
    case 4: return "bg-[#FFC000]";
    case 5: return "bg-[#FF0000] text-white";
    default: return "bg-gray-500";
  }
};

const getIndicatorNumberForCard = (score, isDataAvailable = true) => {
  if (!isDataAvailable) return 0;
  if (score === undefined || score === null || isNaN(score)) return 0;
  if (score === 0) return 0;
  if (score > 0 && score <= 1.49) return 1;
  if (score > 1.49 && score <= 2.49) return 2;
  if (score > 2.49 && score <= 3.49) return 3;
  if (score > 3.49 && score <= 4.49) return 4;
  if (score > 4.49 && score <= 5) return 5;
  return 0;
};

const getScoreFromValue = (value) => {
  if (value === undefined || value === null || isNaN(value)) return 0;
  if (value === 0) return 0;
  if (value > 0 && value <= 1.49) return 1;
  if (value > 1.49 && value <= 2.49) return 2;
  if (value > 2.49 && value <= 3.49) return 3;
  if (value > 3.49 && value <= 4.49) return 4;
  if (value > 4.49 && value <= 5) return 5;
  return 0;
};

const getNetRiskIndicator = (value, hasInherentData, hasKpmrData) => {
  if (!hasInherentData && !hasKpmrData) {
    return { label: "Data tidak Ditemukan", color: "#9CA3AF", value: 0, score: 0, isNoData: true, isPartialData: false };
  }
  if ((hasInherentData && !hasKpmrData) || (!hasInherentData && hasKpmrData)) {
    return { label: "Data belum Lengkap", color: "#D1D5DB", value: 0, score: 0, isNoData: false, isPartialData: true };
  }
  if (value === undefined || value === null || isNaN(value) || value === 0) {
    return { label: "Low", color: "#4F6228", value: 0, score: 1, isNoData: false, isPartialData: false };
  }
  if (value >= 0 && value <= 1.49) return { label: "Low", color: "#4F6228", value, score: 1, isNoData: false, isPartialData: false };
  if (value > 1.49 && value <= 2.49) return { label: "Low to Moderate", color: "#92D050", value, score: 2, isNoData: false, isPartialData: false };
  if (value > 2.49 && value <= 3.49) return { label: "Moderate", color: "#FFFF00", value, score: 3, isNoData: false, isPartialData: false };
  if (value > 3.49 && value <= 4.49) return { label: "Moderate to High", color: "#FFC000", value, score: 4, isNoData: false, isPartialData: false };
  if (value > 4.49 && value <= 5) return { label: "High", color: "#FF0000", value, score: 5, isNoData: false, isPartialData: false };
  return { label: "Data belum Lengkap", color: "#D1D5DB", value: 0, score: 0, isNoData: false, isPartialData: true };
};

const getRiskIndicator = (score, type = "inherent", hasData = true) => {
  if (!hasData || score === undefined || score === null || score === 0) {
    return { label: "Data tidak Ditemukan", value: "no-data", color: "#9CA3AF", min: 0, max: 0, score: 0, isNoData: true, isPartialData: false };
  }
  const indicators = type === "kpmr" ? KPMR_RISK_INDICATORS : INHERENT_RISK_INDICATORS;
  const hasValidData = hasData && score > 0;
  if (!hasValidData) {
    return { label: "Data tidak Ditemukan", value: "no-data", color: "#9CA3AF", min: 0, max: 0, score: 0, isNoData: true, isPartialData: false };
  }
  for (const indicator of indicators) {
    if (score >= indicator.min && score <= indicator.max) {
      return { ...indicator, value: score, isNoData: false, isPartialData: false };
    }
  }
  const defaultIndicator = type === "kpmr" ? KPMR_RISK_INDICATORS[KPMR_RISK_INDICATORS.length - 1] : INHERENT_RISK_INDICATORS[INHERENT_RISK_INDICATORS.length - 1];
  return { ...defaultIndicator, value: score, isNoData: false, isPartialData: false };
};

const getNetRiskFromMatrix = (inherentValue, kpmrValue, hasInherentData, hasKpmrData) => {
  if (!hasInherentData && !hasKpmrData) return 0;
  if ((hasInherentData && !hasKpmrData) || (!hasInherentData && hasKpmrData)) return 0;
  const inherentScore = getScoreFromValue(inherentValue);
  const kpmrScore = getScoreFromValue(kpmrValue);
  if (inherentScore === 0 || kpmrScore === 0) return 0;
  const inherentIndex = inherentScore - 1;
  const kpmrIndex = kpmrScore - 1;
  if (inherentIndex >= 0 && inherentIndex < RISK_MATRIX.length && kpmrIndex >= 0 && kpmrIndex < RISK_MATRIX[0].length) {
    const matrixScore = RISK_MATRIX[inherentIndex][kpmrIndex];
    switch(matrixScore) {
      case 1: return 0.75;
      case 2: return 2.0;
      case 3: return 3.0;
      case 4: return 4.0;
      case 5: return 4.75;
      default: return 0;
    }
  }
  return 0;
};

function normalizeItemWithDerived(item, param) {
  if (!item) return null;
  const judul = item?.judul || {};
  return {
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
    derived: computeDerived(item, param),
  };
}

function normalizeInherentRowsWithDerived(rows) {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((r) => {
      if (!r) return null;
      return {
        ...r,
        id: r.id || crypto.randomUUID(),
        bobot: Number(r.bobot ?? 0),
        kategori: r.kategori || { model: "", prinsip: "", jenis: "", underlying: [] },
        nilaiList: Array.isArray(r.nilaiList)
          ? r.nilaiList.map((item) => (item ? normalizeItemWithDerived(item, r) : null)).filter(Boolean)
          : [],
        indicatorList: []
      };
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
        let inherentSummary = 0;
        let hasInherentData = false;

        const derivedData = loadDerived({
          categoryId: category.id,
          year,
          quarter: activeQuarter,
        });

        if (derivedData && typeof derivedData.summary === 'number' && derivedData.summary > 0) {
          inherentSummary = derivedData.summary;
          hasInherentData = true;
        } else {
          try {
            const rows = loadInherent({
              categoryId: category.id,
              year,
              quarter: activeQuarter,
            });
            if (Array.isArray(rows) && rows.length > 0) {
              const normalizedRows = normalizeInherentRowsWithDerived(rows);
              const manualSummary = calculateInherentSummary(normalizedRows);
              if (manualSummary > 0) {
                inherentSummary = manualSummary;
                hasInherentData = true;
              }
            }
          } catch (e) {}
        }

        const kpmrRows = loadKpmr({ categoryId: category.id, year });
        let kpmrSummary = 0;
        let hasKpmrData = false;

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
                hasKpmrData = true;
              }
            });
          });
          if (count > 0) kpmrSummary = total / count;
        }

        data.push({
          id: category.id,
          nama: category.label,
          Icon: category.Icon,
          inherentSummary,
          kpmrSummary,
          hasInherentData,
          hasKpmrData,
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

export default function RekapData2() {
  const { search, year, activeQuarter } = useHeaderStore();
  const summaryPerHalaman = useGlobalSummaryAdapter();
  const [isExporting, setIsExporting] = useState(false);

  const filteredData = useMemo(() => {
    if (!search) return summaryPerHalaman;
    const s = search.toLowerCase();
    return summaryPerHalaman.filter((h) => h.nama.toLowerCase().includes(s));
  }, [search, summaryPerHalaman]);

  const tableData = useMemo(() => {
    return filteredData.map((item) => {
      const inherentSummary = item.inherentSummary || 0;
      const kpmrSummary = item.kpmrSummary || 0;
      const hasInherentData = item.hasInherentData;
      const hasKpmrData = item.hasKpmrData;

      const inherentIndicator = getRiskIndicator(inherentSummary, "inherent", hasInherentData);
      const kpmrIndicator = getRiskIndicator(kpmrSummary, "kpmr", hasKpmrData);
      const netRiskValue = getNetRiskFromMatrix(inherentSummary, kpmrSummary, hasInherentData, hasKpmrData);
      const netRiskIndicator = getNetRiskIndicator(netRiskValue, hasInherentData, hasKpmrData);

      return {
        ...item,
        inherentSummary,
        kpmrSummary,
        inherentIndicator,
        kpmrIndicator,
        netRiskValue,
        netRiskIndicator,
      };
    });
  }, [filteredData]);

  const peringkatKomposit = useMemo(() => {
    if (summaryPerHalaman.length === 0) {
      return {
        inherentAvg: 0, kpmrAvg: 0, netRiskAvg: 0,
        inherentCount: 0, kpmrCount: 0, netRiskCount: 0,
        totalInherentData: 0, totalKpmrData: 0,
      };
    }
    let totalInherent = 0, totalKpmr = 0, totalNetRisk = 0;
    let inherentCount = 0, kpmrCount = 0, netRiskCount = 0;
    let totalInherentData = 0, totalKpmrData = 0;

    summaryPerHalaman.forEach((item) => {
      const inherentSummary = item.inherentSummary || 0;
      const kpmrSummary = item.kpmrSummary || 0;
      const hasInherentData = item.hasInherentData;
      const hasKpmrData = item.hasKpmrData;
      const netRiskValue = getNetRiskFromMatrix(inherentSummary, kpmrSummary, hasInherentData, hasKpmrData);

      if (hasInherentData && inherentSummary > 0) { totalInherent += inherentSummary; inherentCount++; }
      if (hasInherentData) totalInherentData++;
      if (hasKpmrData && kpmrSummary > 0) { totalKpmr += kpmrSummary; kpmrCount++; }
      if (hasKpmrData) totalKpmrData++;
      if (netRiskValue > 0 && hasInherentData && hasKpmrData) { totalNetRisk += netRiskValue; netRiskCount++; }
    });

    return {
      inherentAvg: inherentCount > 0 ? totalInherent / inherentCount : 0,
      kpmrAvg: kpmrCount > 0 ? totalKpmr / kpmrCount : 0,
      netRiskAvg: netRiskCount > 0 ? totalNetRisk / netRiskCount : 0,
      inherentCount, kpmrCount, netRiskCount,
      totalInherentData, totalKpmrData,
    };
  }, [summaryPerHalaman]);

  const footerDisplay = useMemo(() => {
    const inherentAvg = peringkatKomposit.inherentAvg;
    const kpmrAvg = peringkatKomposit.kpmrAvg;
    const netRiskAvg = peringkatKomposit.netRiskAvg;
    const hasInherentData = peringkatKomposit.totalInherentData > 0;
    const hasKpmrData = peringkatKomposit.totalKpmrData > 0;

    const inherentIndicator = getRiskIndicator(inherentAvg, "inherent", hasInherentData && inherentAvg > 0);
    const kpmrIndicator = getRiskIndicator(kpmrAvg, "kpmr", hasKpmrData && kpmrAvg > 0);
    const netRiskFromMatrix = getNetRiskFromMatrix(inherentAvg, kpmrAvg, hasInherentData, hasKpmrData);
    const netRiskIndicator = getNetRiskIndicator(netRiskFromMatrix, hasInherentData, hasKpmrData);
    const inherentScoreForMatrix = inherentAvg > 0 ? getScoreFromValue(inherentAvg) : 0;
    const kpmrScoreForMatrix = kpmrAvg > 0 ? getScoreFromValue(kpmrAvg) : 0;

    return {
      inherentAvg, kpmrAvg, netRiskAvg: netRiskFromMatrix,
      inherentIndicator, kpmrIndicator, netRiskIndicator,
      inherentScoreForMatrix, kpmrScoreForMatrix,
      hasInherentData, hasKpmrData,
      hasNetRiskData: netRiskFromMatrix > 0,
    };
  }, [peringkatKomposit]);

  const handleExportToExcel = async () => {
    try {
      setIsExporting(true);
      await exportRekapData2(year);
    } catch (error) {
      alert(`Terjadi kesalahan saat export:\n\n${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const IndicatorCell = ({ indicator, size = "normal" }) => {
    const safeIndicator = indicator || getRiskIndicator(0, "inherent", false);
    const textClass = size === "small" ? "text-sm" : "text-base";
    const paddingClass = size === "small" ? "px-3 py-2" : "px-4 py-2.5";
    const value = typeof safeIndicator.value === 'number' ? safeIndicator.value : 0;
    let displayText = "";
    if (safeIndicator.isPartialData) displayText = "Data belum Lengkap";
    else if (safeIndicator.isNoData) displayText = "Data tidak Ditemukan";
    else if (value > 0) displayText = getScoreFromValue(value);
    else displayText = "0";

    const isDarkColor = ["#4F6228", "#FF0000"].includes(safeIndicator.color);
    const textColorClass = isDarkColor ? "text-white" : "text-black";

    return (
      <div className="w-full flex flex-col items-center justify-center">
        <div
          className={`rounded-full ${paddingClass} font-bold ${textClass} w-full flex items-center justify-center whitespace-nowrap min-h-[40px] text-center ${textColorClass}`}
          style={{ backgroundColor: safeIndicator.color }}
        >
          {displayText}
        </div>
      </div>
    );
  };

  const FooterIndicatorCell = ({ indicator, size = "normal" }) => {
    const safeIndicator = indicator || getRiskIndicator(0, "inherent", false);
    const textClass = size === "small" ? "text-sm" : "text-base";
    const paddingClass = size === "small" ? "px-3 py-2" : "px-4 py-2.5";
    const value = typeof safeIndicator.value === 'number' ? safeIndicator.value : 0;
    let displayText = "";
    if (safeIndicator.isPartialData) displayText = "Data belum Lengkap";
    else if (safeIndicator.isNoData) displayText = "Data tidak Ditemukan";
    else if (value > 0) displayText = getScoreFromValue(value);
    else displayText = "0";

    const isDarkColor = ["#4F6228", "#FF0000"].includes(safeIndicator.color);
    const textColorClass = isDarkColor ? "text-white" : "text-black";

    return (
      <div className="w-full flex flex-col items-center justify-center">
        <div
          className={`rounded-full ${paddingClass} font-bold ${textClass} w-full flex items-center justify-center whitespace-nowrap min-h-[40px] text-center ${textColorClass}`}
          style={{ backgroundColor: safeIndicator.color }}
        >
          {displayText}
        </div>
      </div>
    );
  };

  const RiskMatrix = ({ inherentScore, kpmrScore, hasInherentData, hasKpmrData }) => {
    const inherentIndex = inherentScore - 1;
    const kpmrIndex = kpmrScore - 1;
    const showPosition = hasInherentData && hasKpmrData;

    return (
      <div className="bg-white rounded-lg shadow border p-4 h-full">
        <div className="text-center mb-2">
          <h3 className="font-bold text-gray-700 text-lg">Tabel Peringkat Risiko</h3>
        </div>
        <div>
          <h1 className="text-center">Kualitas Penerapan Manajemen Risiko</h1>
          <div className="flex mb-4">
            <div style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}>
              <h1 className="text-center">Inherent Risiko</h1>
            </div>
            <table className="w-full border-collapse table-fixed">
              <colgroup>
                <col style={{ width: "23%" }} /><col style={{ width: "23%" }} /><col style={{ width: "23%" }} />
                <col style={{ width: "23%" }} /><col style={{ width: "23%" }} /><col style={{ width: "23%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th className="border border-black p-2 bg-blue-800 text-sm font-medium w-16"></th>
                  <th className="border border-black p-2 bg-blue-800 text-white text-center text-sm font-medium">Strong<br/>(1)</th>
                  <th className="border border-black p-2 bg-blue-800 text-white text-center text-[13px] font-bold">Satisfactory<br/>(2)</th>
                  <th className="border border-black p-2 bg-blue-800 text-white text-center text-sm font-medium">Fair<br/>(3)</th>
                  <th className="border border-black p-2 bg-blue-800 text-white text-center text-sm font-medium">Marginal<br/>(4)</th>
                  <th className="border border-black py-2 bg-blue-800 text-white text-center text-[12px] font-bold">Unsatisfactory<br/>(5)</th>
                </tr>
              </thead>
              <tbody>
                {RISK_MATRIX.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="border border-black h-[90px] bg-blue-800 text-white font-medium text-center text-sm">
                      <div className="w-full">
                        {rowIndex === 0 && "Low (1)"}
                        {rowIndex === 1 && "Low to Moderate (2)"}
                        {rowIndex === 2 && "Moderate (3)"}
                        {rowIndex === 3 && "Moderate to High (4)"}
                        {rowIndex === 4 && "High (5)"}
                      </div>
                    </td>
                    {row.map((cell, cellIndex) => {
                      const isActive = showPosition && rowIndex === inherentIndex && cellIndex === kpmrIndex;
                      let cellValue;
                      switch(cell) {
                        case 1: cellValue = 0.75; break;
                        case 2: cellValue = 2.0; break;
                        case 3: cellValue = 3.0; break;
                        case 4: cellValue = 4.0; break;
                        case 5: cellValue = 4.75; break;
                        default: cellValue = 3.0;
                      }
                      const cellIndicator = getNetRiskIndicator(cellValue, true, true);
                      const isDark = ["#4F6228", "#FF0000"].includes(cellIndicator.color);
                      const textColor = isDark ? "text-white" : "text-black";
                      return (
                        <td
                          key={cellIndex}
                          className={`border border-black p-3 text-center font-bold text-lg relative ${isActive ? 'ring-2 ring-blue-500 ring-offset-1' : ''} ${textColor}`}
                          style={{ backgroundColor: cellIndicator.color }}
                        >
                          {cell}
                          {isActive && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-15 h-15 rounded-full border-4 border-black bg-transparent"></div>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="space-y-2">
          {showPosition ? (
            <>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center">
                  <Circle className="h-5 w-5 stroke-4"/>
                </div>
                <span className="text-base font-semibold text-gray-950">
                  Posisi risiko saat ini (Inherent: {inherentScore}, KPMR: {kpmrScore})
                </span>
              </div>
              <div className="text-lg ml-7 font-semibold text-gray-950">
                <span className="font-semibold">Hasil Matriks:</span> {footerDisplay.netRiskIndicator.label} ({footerDisplay.netRiskAvg.toFixed(1)})
              </div>
            </>
          ) : (
            <div className="text-lg font-semibold text-gray-950 text-center p-4 bg-gray-100 rounded-lg">
              Data tidak cukup untuk menampilkan posisi risiko
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen p-4">
      <Header title="Rekap Data 2" onExportClick={handleExportToExcel} isExporting={isExporting} />
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 mt-6">
        <div className="lg:col-span-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-blue-700 text-white">
              <div className="grid grid-cols-12 p-4 font-bold text-lg">
                <div className="col-span-3 flex items-center gap-2"><span>JENIS RISIKO</span></div>
                <div className="col-span-3 text-center">INHERENT</div>
                <div className="col-span-3 text-center">KPMR</div>
                <div className="col-span-3 text-center">NET RISK</div>
              </div>
            </div>
            <div className="divide-y max-h-[550px] overflow-y-auto">
              {tableData.map((item) => (
                <div key={item.id} className="grid grid-cols-12 p-3 gap-1 hover:bg-gray-50 transition-colors">
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      {item.Icon ? <item.Icon className="w-5 h-5 text-blue-600" /> : <FileText className="w-5 h-5 text-blue-600" />}
                    </div>
                    <span className="font-bold text-gray-800 text-lg">{item.nama}</span>
                  </div>
                  <div className="col-span-3 flex items-center justify-center"><IndicatorCell indicator={item.inherentIndicator} /></div>
                  <div className="col-span-3 flex items-center justify-center"><IndicatorCell indicator={item.kpmrIndicator} /></div>
                  <div className="col-span-3 flex items-center justify-center"><IndicatorCell indicator={item.netRiskIndicator} /></div>
                </div>
              ))}
            </div>
            <div className="bg-blue-900 border-t">
              <div className="grid grid-cols-12 p-3 gap-9 text-white font-bold">
                <div className="col-span-3 text-white flex items-center ml-5 text-lg">Skor Profil Risiko</div>
                <div className="col-span-3 -ml-3 -mr-2 flex items-center justify-center"><FooterIndicatorCell indicator={footerDisplay.inherentIndicator} /></div>
                <div className="col-span-3 -ml-6 mr-1 flex items-center justify-center"><FooterIndicatorCell indicator={footerDisplay.kpmrIndicator} /></div>
                <div className="col-span-3 -ml-9 mr-4 flex items-center justify-center"><FooterIndicatorCell indicator={footerDisplay.netRiskIndicator} /></div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-4">
          <RiskMatrix
            inherentScore={footerDisplay.inherentScoreForMatrix}
            kpmrScore={footerDisplay.kpmrScoreForMatrix}
            hasInherentData={footerDisplay.hasInherentData}
            hasKpmrData={footerDisplay.hasKpmrData}
          />
        </div>
      </div>
      <div className="mt-6 gap-3 w-full grid grid-cols-5">
        <div className="bg-white col-span-1 shadow-md border border-gray-300 p-6 rounded-xl flex items-center gap-5">
          <div className={`w-20 h-20 rounded-lg flex items-center justify-center shadow ${getIndicatorColor(getIndicatorNumberForCard(footerDisplay?.inherentAvg || 0, footerDisplay?.hasInherentData))}`}>
            <span className="text-2xl font-bold text-black">{getIndicatorNumberForCard(footerDisplay?.inherentAvg || 0, footerDisplay?.hasInherentData)}</span>
          </div>
          <div className="flex-1 text-center">
            <p className="text-lg font-semibold border-b border-black inline-block px-3 pb-1">INHERENT : {(Number(footerDisplay?.inherentAvg) || 0).toFixed(2)}</p>
            <p className="text-lg font-bold mt-1">{footerDisplay?.hasInherentData && footerDisplay?.inherentAvg > 0 ? footerDisplay?.inherentIndicator?.label : "Data Tidak Ditemukan"}</p>
            <p className="text-sm text-gray-500 mt-1">{peringkatKomposit.totalInherentData} data dari total 13 data</p>
          </div>
        </div>
        <div className="bg-white col-span-1 shadow-md border border-gray-300 p-6 rounded-xl flex items-center gap-5">
          <div className={`w-20 h-20 rounded-lg flex items-center justify-center shadow ${getIndicatorColor(getIndicatorNumberForCard(footerDisplay?.kpmrAvg || 0, footerDisplay?.hasKpmrData))}`}>
            <span className="text-2xl font-bold text-black">{getIndicatorNumberForCard(footerDisplay?.kpmrAvg || 0, footerDisplay?.hasKpmrData)}</span>
          </div>
          <div className="flex-1 text-center">
            <p className="text-lg font-semibold border-b border-black inline-block px-3 pb-1">KPMR : {(Number(footerDisplay?.kpmrAvg) || 0).toFixed(2)}</p>
            <p className="text-lg font-bold mt-1">{footerDisplay?.hasKpmrData && footerDisplay?.kpmrAvg > 0 ? footerDisplay?.kpmrIndicator?.label : "Data Tidak Ditemukan"}</p>
            <p className="text-sm text-gray-500 mt-1">{peringkatKomposit.totalKpmrData} data dari total 13 data</p>
          </div>
        </div>
        <div className="bg-white col-span-1 shadow-md border border-gray-300 p-6 rounded-xl flex items-center gap-5">
          <div className={`w-20 h-20 rounded-lg flex items-center justify-center shadow ${getIndicatorColor(getIndicatorNumberForCard(footerDisplay?.netRiskAvg || 0, footerDisplay?.hasNetRiskData))}`}>
            <span className="text-2xl font-bold text-black">{getIndicatorNumberForCard(footerDisplay?.netRiskAvg || 0, footerDisplay?.hasNetRiskData)}</span>
          </div>
          <div className="flex-1 text-center">
            <p className="text-lg font-semibold border-b border-black inline-block px-3 pb-1">NET RISK: {(Number(footerDisplay?.netRiskAvg) || 0).toFixed(2)}</p>
            <p className="text-lg font-bold mt-1">{footerDisplay?.hasNetRiskData && footerDisplay?.netRiskAvg > 0 ? footerDisplay?.netRiskIndicator?.label : "Data Tidak Ditemukan"}</p>
            <p className="text-sm text-gray-500 mt-1">{peringkatKomposit.netRiskCount} data dari total 13 data</p>
          </div>
        </div>
        <div className="rounded-lg border col-span-2 border-gray-200 bg-white p-4">
          <div className="flex flex-col gap-3">
            <span className="text-base font-semibold text-gray-950">RISK INDIKATOR</span>
            <div className="flex flex-wrap items-center gap-3">
              {INHERENT_RISK_INDICATORS.map((i, idx) => (
                <div key={idx} className="flex items-center uppercase gap-2 text-sm font-semibold">
                  <span className="w-5 h-5 rounded border" style={{ backgroundColor: i.color }} />
                  <span className="text-gray-950">{i.label}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-8">
              {KPMR_RISK_INDICATORS.map((i, idx) => (
                <div key={idx} className="flex items-center uppercase gap-2 text-sm font-semibold">
                  <span className="w-5 h-5 rounded border" style={{ backgroundColor: i.color }} />
                  <span className="text-gray-950">{i.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}