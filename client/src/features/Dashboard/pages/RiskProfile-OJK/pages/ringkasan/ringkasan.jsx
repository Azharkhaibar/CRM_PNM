import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/header/Header";
import { useHeaderStore } from "../../store/headerStore";
import { Button } from "@/components/ui/button";
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
  RefreshCcw,
} from "lucide-react";
import { loadInherent } from "../../utils/storage/riskStorageNilai";
import { computeDerived } from "@/features/Dashboard/pages/RiskProfile-OJK/utils/compute/computeDerived";

// ==================== KONSTANTA ====================
const CATEGORIES = [
  { id: "pasar-produk", label: "Pasar Produk", code: "PSR", Icon: StoreIcon },
  { id: "likuiditas-produk", label: "Likuiditas Produk", code: "LKD", Icon: HandCoins },
  { id: "kredit-produk", label: "Kredit Produk", code: "KRD", Icon: BanknoteArrowUp },
  { id: "konsentrasi-produk", label: "Konsentrasi Produk", code: "KTS", Icon: BrainCircuit },
  { id: "operasional-regulatory", label: "Operasional", code: "OPS", Icon: Cog },
  { id: "hukum-regulatory", label: "Hukum", code: "HKM", Icon: Scale },
  { id: "kepatuhan-regulatory", label: "Kepatuhan", code: "KTH", Icon: ClipboardCheck },
  { id: "reputasi-regulatory", label: "Reputasi", code: "RTS", Icon: CircleStar },
  { id: "strategis-regulatory", label: "Strategis", code: "STG", Icon: BrainCog },
  { id: "investasi-regulatory", label: "Investasi", code: "INV", Icon: Handshake },
  { id: "rentabilitas-regulatory", label: "Rentabilitas", code: "RNT", Icon: TrendingUpDown },
  { id: "permodalan-regulatory", label: "Permodalan", code: "PMDL", Icon: Sprout },
  { id: "tatakelola-regulatory", label: "Tata Kelola", code: "TKL", Icon: Earth },
];

const KATEGORI_OPTIONS = {
  model: [
    { value: "", label: "Semua Model" },
    { value: "tanpa_model", label: "Tanpa Model" },
    { value: "open_end", label: "Open-End" },
    { value: "terstruktur", label: "Terstruktur" },
  ],
  prinsip: [
    { value: "", label: "Semua Prinsip" },
    { value: "syariah", label: "Syariah" },
    { value: "konvensional", label: "Konvensional" },
  ],
  jenis: [
    { value: "", label: "Semua Jenis" },
    { value: "pasar_uang", label: "Pasar Uang" },
    { value: "pendapatan_tetap", label: "Pendapatan Tetap" },
    { value: "campuran", label: "Campuran" },
    { value: "saham", label: "Saham" },
    { value: "indeks", label: "Indeks" },
    { value: "etf", label: "ETF" },
  ],
  underlying: [
    { value: "", label: "Semua Underlying" },
    { value: "obligasi", label: "Obligasi" },
    { value: "indeks", label: "Indeks" },
    { value: "etf", label: "ETF" },
    { value: "eba", label: "EBA" },
    { value: "dinfra", label: "DINFRA" },
  ],
};

// Label untuk setiap kuartal (dari helper export)
const QUARTER_LABELS = {
  q1: 'Maret',
  q2: 'Juni',
  q3: 'September',
  q4: 'Desember'
};

// ==================== FUNGSI UNTUK TAMPILAN (sudah ada) ====================

// Fungsi untuk mendapatkan warna berdasarkan risk level (untuk Tailwind)
const getRiskColor = (level) => {
  if (level >= 0 && level < 2) return "bg-[#4F6228] text-white";
  if (level >= 2 && level < 3) return "bg-[#92D050] text-black";
  if (level >= 3 && level < 4) return "bg-[#FFFF00] text-black";
  if (level >= 4 && level < 5) return "bg-[#FFC000] text-black";
  if (level >= 5) return "bg-[#FF0000] text-white";
  return "bg-gray-200 text-gray-700";
};

// Fungsi untuk mendapatkan risk indicator (sama untuk tampilan dan export)
const getRiskIndicator = (level) => {
  if (level >= 0 && level < 2) return "Low";
  if (level >= 2 && level < 3) return "Low To Moderate";
  if (level >= 3 && level < 4) return "Moderate";
  if (level >= 4 && level < 5) return "Moderate To High";
  if (level >= 5) return "High";
  return "N/A";
};

// Fungsi untuk format angka (digunakan tampilan dan export)
const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === 'string') return value;
  const num = Number(value);
  if (isNaN(num)) return "-";
  const hasDecimal = num % 1 !== 0;
  return hasDecimal ? num.toFixed(2) : num.toString();
};

// Fungsi untuk format persen
const formatPercent = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  const num = Number(value);
  if (isNaN(num)) return "-";
  return `${num}%`;
};

// Fungsi untuk menghitung total weighted (tampilan)
const calculateTotalWeighted = (data) => {
  if (!Array.isArray(data)) return 0;
  let totalWeighted = 0;
  let count = 0;
  data.forEach((param) => {
    if (param && param.nilaiList && Array.isArray(param.nilaiList)) {
      param.nilaiList.forEach((item) => {
        if (item && item.derived && item.derived.weighted !== undefined && !isNaN(item.derived.weighted)) {
          totalWeighted += item.derived.weighted;
          count++;
        }
      });
    }
  });
  return count > 0 ? totalWeighted / count : 0;
};

// Normalisasi data untuk tampilan
const normalizeAndComputeDerived = (rows) => {
  if (!Array.isArray(rows)) return [];
  return rows.map((param) => {
    if (!param) return null;
    const normalizedParam = {
      ...param,
      id: param.id || crypto.randomUUID(),
      bobot: Number(param.bobot) || 0,
      kategori: param.kategori || { model: "", prinsip: "", jenis: "", underlying: [] },
    };
    if (!normalizedParam.kategori || typeof normalizedParam.kategori !== 'object') {
      normalizedParam.kategori = { model: "", prinsip: "", jenis: "", underlying: [] };
    }
    if (!normalizedParam.kategori.model) normalizedParam.kategori.model = "";
    if (!Array.isArray(normalizedParam.kategori.underlying)) normalizedParam.kategori.underlying = [];

    if (Array.isArray(param.nilaiList)) {
      normalizedParam.nilaiList = param.nilaiList.map((item) => {
        if (!item) return null;
        const judul = item?.judul || {};
        const normalizedItem = {
          ...item,
          id: item?.id || crypto.randomUUID(),
          bobot: Number(item?.bobot) || 0,
          portofolio: item?.portofolio || 0,
          judul: {
            ...judul,
            text: judul?.text || judul?.label || "",
            pembilang: judul?.pembilang || "",
            penyebut: judul?.penyebut || "",
            type: judul?.type || "Tanpa Faktor",
            value: judul?.value !== undefined ? judul.value : judul?.valuePembilang,
            valuePembilang: judul?.valuePembilang !== undefined ? judul.valuePembilang : "",
            valuePenyebut: judul?.valuePenyebut !== undefined ? judul.valuePenyebut : "",
          },
        };
        normalizedItem.derived = computeDerived(normalizedItem, normalizedParam);
        return normalizedItem;
      }).filter(Boolean);
    } else {
      normalizedParam.nilaiList = [];
    }
    return normalizedParam;
  }).filter(Boolean);
};

// ==================== FUNGSI UNTUK EXPORT (dari helper) ====================

// --- serviceExportRingkasan.js ---

// Fungsi mendapatkan kode kategori (untuk export)
const getCategoryCode = (categoryId) => {
  const categoryMap = {
    "pasar-produk": "PSR",
    "likuiditas-produk": "LKD",
    "kredit-produk": "KRD",
    "konsentrasi-produk": "KTS",
    "operasional-regulatory": "OPS",
    "hukum-regulatory": "HKM",
    "kepatuhan-regulatory": "KTH",
    "reputasi-regulatory": "RTS",
    "strategis-regulatory": "STG",
    "investasi-regulatory": "INV",
    "rentabilitas-regulatory": "RNT",
    "permodalan-regulatory": "PMDL",
    "tatakelola-regulatory": "TKL"
  };
  return categoryMap[categoryId] || "UNK";
};

// Fungsi mendapatkan warna untuk Excel (versi export, mengembalikan objek {bg, text})
const getRiskColorExport = (level) => {
  const indicator = getRiskIndicator(level);
  let bg = "#CCCCCC";
  let text = "#000000";
  if (indicator === "Low") {
    bg = "#4F6228";
    text = "#FFFFFF";
  } else if (indicator === "Low To Moderate") {
    bg = "#92D050";
  } else if (indicator === "Moderate") {
    bg = "#FFFF00";
  } else if (indicator === "Moderate To High") {
    bg = "#FFC000";
  } else if (indicator === "High") {
    bg = "#FF0000";
    text = "#FFFFFF";
  }
  return { bg, text };
};

// Filter data berdasarkan kategoriFilter (sama dengan yang di komponen, tapi kita salin untuk export)
const filterDataByKategori = (rows, kategoriFilter) => {
  if (!Array.isArray(rows)) return [];
  return rows.filter((row) => {
    if (!row || !row.kategori) return false;
    const kategori = row.kategori;
    let shouldInclude = true;

    if (kategoriFilter.model && kategoriFilter.model !== "" && kategori.model !== kategoriFilter.model) {
      shouldInclude = false;
    }
    if (shouldInclude && kategoriFilter.prinsip && kategoriFilter.prinsip !== "" && kategori.model !== "tanpa_model") {
      if (kategori.prinsip !== kategoriFilter.prinsip) shouldInclude = false;
    }
    if (shouldInclude && kategoriFilter.jenis && kategoriFilter.jenis !== "") {
      if (kategori.model === "open_end") {
        if (kategori.jenis !== kategoriFilter.jenis) shouldInclude = false;
      } else {
        shouldInclude = false;
      }
    }
    if (shouldInclude && Array.isArray(kategoriFilter.underlying) && kategoriFilter.underlying.length > 0) {
      if (kategori.model === "terstruktur") {
        const paramUnderlying = Array.isArray(kategori.underlying) ? kategori.underlying : [];
        const hasOverlap = kategoriFilter.underlying.some(value => paramUnderlying.includes(value));
        if (!hasOverlap) shouldInclude = false;
      } else {
        shouldInclude = false;
      }
    }
    return shouldInclude;
  });
};

// Format data untuk ekspor ringkasan (single quarter)
const formatRingkasanData = (rows, category, quarter) => {
  if (!Array.isArray(rows)) return [];
  const exportRows = [];
  let counter = 1;

  for (const row of rows) {
    if (!row || !row.id) continue;
    const parameterName = row.judul || "Parameter";
    const parameterBobot = row.bobot || 0;
    const parameterNumber = row.nomor || "1";
    const itemList = Array.isArray(row.nilaiList) ? row.nilaiList : [];

    if (itemList.length === 0) {
      exportRows.push({
        no: counter++,
        jenisRisiko: `Risiko ${category.label}`,
        bobotParameter: parameterBobot,
        parameter: parameterName,
        indeks: `R.${category.code || getCategoryCode(category.id)}.${parameterNumber}`,
        indikatorInheren: "",
        bobotNilai: "",
        hasilAssessment: "",
        riskLevel: "",
        riskIndicator: "",
        rowType: "empty",
        categoryId: category.id,
        quarter,
        jenisGroupKey: `${category.id}_${parameterNumber}`,
        parameterGroupKey: `${category.id}_${parameterNumber}`
      });
      continue;
    }

    for (const item of itemList) {
      if (!item || !item.id) continue;
      const derived = computeDerived(item, row);
      const hasilAssessment = derived.hasilDisplay !== undefined ? derived.hasilDisplay : (derived.weighted !== undefined ? derived.weighted : 0);
      const riskLevel = derived.riskLevel !== undefined ? derived.riskLevel : (derived.weighted !== undefined ? derived.weighted : 0);
      const riskIndicator = getRiskIndicator(riskLevel);
      const indikatorInheren = item?.judul?.text || "-";
      const nilaiNomor = item?.nomor || parameterNumber;

      exportRows.push({
        no: counter++,
        jenisRisiko: `Risiko ${category.label}`,
        bobotParameter: parameterBobot,
        parameter: parameterName,
        indeks: `R.${category.code || getCategoryCode(category.id)}.${nilaiNomor}`,
        indikatorInheren: indikatorInheren,
        bobotNilai: item.bobot || 0,
        hasilAssessment: formatNumber(hasilAssessment),
        riskLevel: formatNumber(riskLevel),
        riskIndicator: riskIndicator,
        rowType: "data",
        categoryId: category.id,
        quarter,
        riskColor: getRiskColorExport(riskLevel), // pakai versi export
        jenisGroupKey: `${category.id}`,
        parameterGroupKey: `${category.id}_${parameterNumber}`
      });
    }
  }
  return exportRows;
};

// Fungsi utama mengambil data untuk export per kuartal
const getDataForExportRingkasan = async (selectedCategories, kategoriFilter, year, quarter) => {
  try {
    if (!selectedCategories || selectedCategories.length === 0) throw new Error("Tidak ada kategori yang dipilih");
    if (!year) throw new Error("Tahun tidak valid");
    if (!quarter) throw new Error("Quarter tidak valid");

    const allData = [];
    for (const category of selectedCategories) {
      try {
        const rows = loadInherent({ categoryId: category.id, year, quarter });
        const filteredRows = filterDataByKategori(rows, kategoriFilter);
        const categoryData = {
          categoryId: category.id,
          categoryLabel: category.label,
          categoryCode: category.code || getCategoryCode(category.id),
          year,
          quarter,
          data: formatRingkasanData(filteredRows, category, quarter)
        };
        allData.push(categoryData);
      } catch (error) {
        console.warn(`Error loading data for ${category.id}:`, error);
        continue;
      }
    }
    return allData;
  } catch (error) {
    console.error("Error in getDataForExportRingkasan:", error);
    throw error;
  }
};

// Fungsi mengambil data untuk export tahunan
const getDataForExportRingkasanTahunan = async (selectedCategories, kategoriFilter, year, allQuarters) => {
  try {
    if (!selectedCategories || selectedCategories.length === 0) throw new Error("Tidak ada kategori yang dipilih");
    if (!year) throw new Error("Tahun tidak valid");
    if (!allQuarters || allQuarters.length === 0) throw new Error("Quarters tidak valid");

    const result = { quarters: {} };
    for (const quarter of allQuarters) {
      const quarterData = await getDataForExportRingkasan(selectedCategories, kategoriFilter, year, quarter);
      if (quarterData && quarterData.length > 0) {
        result.quarters[quarter] = quarterData;
      }
    }
    return result;
  } catch (error) {
    console.error("Error in getDataForExportRingkasanTahunan:", error);
    throw error;
  }
};

// Validasi data ringkasan
const validateRingkasanData = (exportData) => {
  const errors = [];
  if (!exportData || exportData.length === 0) {
    errors.push("Tidak ada data yang ditemukan untuk diekspor");
    return { isValid: false, errors };
  }
  let hasData = false;
  for (const categoryData of exportData) {
    if (categoryData.data && categoryData.data.length > 0) {
      hasData = true;
      break;
    }
  }
  if (!hasData) errors.push("Tidak ada data yang ditemukan di semua kategori");
  return { isValid: errors.length === 0, errors };
};

// --- exportRingkasan.js ---

// Helper untuk mendapatkan kunci parameter dari indeks
const getParameterKeyFromIndeks = (indeks) => {
  if (!indeks) return '';
  const parts = indeks.split('.');
  if (parts.length <= 3) return indeks;
  return parts.slice(0, -1).join('.');
};

// Nama file export
const getExportFileNameRingkasan = (selectedCategories, year, quarter = null, isTahunan = false) => {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0];
  if (isTahunan) {
    return `Ringkasan_Risiko_Tahun_${year}_${dateStr}.xlsx`;
  } else {
    return `Ringkasan_Risiko_${quarter?.toUpperCase()}_${year}_${dateStr}.xlsx`;
  }
};

// Styles untuk Excel
const createStyles = () => ({
  mainHeaderStyle: {
    font: { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '1F497D' } },
    alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
    border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
  },
  riskHeaderStyle: {
    font: { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '404040' } },
    alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
    border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
  },
  noStyle: {
    font: { name: 'Arial', size: 12, bold: true },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DAEEF3' } },
    alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
    border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
  },
  kategoriStyle: {
    font: { name: 'Arial', size: 12, bold: true },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DAEEF3' } },
    alignment: { vertical: 'middle', horizontal: 'left', wrapText: true },
    border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
  },
  bobotParameterStyle: {
    font: { name: 'Arial', size: 12, bold: true },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DAEEF3' } },
    alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
    border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
  },
  parameterStyle: {
    font: { name: 'Arial', size: 12, bold: true },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DAEEF3' } },
    alignment: { vertical: 'middle', horizontal: 'left', wrapText: true },
    border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
  },
  dataStyle: {
    font: { name: 'Arial', size: 12 },
    alignment: { vertical: 'middle', wrapText: true },
    border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
  },
  getRiskCellStyle: (riskColor) => {
    let bg = 'CCCCCC';
    let text = '000000';
    if (riskColor && typeof riskColor === 'object') {
      if (riskColor.bg) bg = riskColor.bg.replace('#', '');
      if (riskColor.text) text = riskColor.text.replace('#', '');
    }
    return {
      font: { name: 'Arial', size: 12, bold: true, color: { argb: text } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } },
      alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
      border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    };
  },
  numberStyle: {
    font: { name: 'Arial', size: 12 },
    alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DAEEF3' } },
    border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
  },
  indikatorStyle: {
    font: { name: 'Arial', size: 12 },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DAEEF3' } },
    alignment: { vertical: 'middle', horizontal: 'left', wrapText: true },
    border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
  },
  bobotNilaiStyle: {
    font: { name: 'Arial', size: 12 },
    alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
    border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
  }
});

// Buat worksheet untuk satu quarter
const createRingkasanWorksheet = async (workbook, exportData, quarter, year) => {
  const worksheet = workbook.addWorksheet(`Ringkasan ${quarter?.toUpperCase()}`);
  const styles = createStyles();

  const titleCell = worksheet.getCell('A1');
  titleCell.value = `RINGKASAN PROFIL RISIKO ${quarter?.toUpperCase()} ${year}`;
  titleCell.style = { font: { name: 'Arial', size: 14, bold: true }, alignment: { vertical: 'middle', horizontal: 'center' } };
  worksheet.mergeCells('A1:K1');

  const headerRow = worksheet.getRow(2);
  const headers = ['No', 'Jenis Risiko', 'Bobot Parameter', 'Parameter', 'Indeks', 'Indikator/Risiko Inheren', 'Bobot Nilai', 'Hasil', 'Risk Level', 'Risk Indicator'];
  headers.forEach((h, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = h;
    cell.style = i < 6 ? styles.mainHeaderStyle : styles.riskHeaderStyle;
  });

  let currentRow = 3;
  let categoryNumber = 1;
  const sortedCategories = CATEGORIES.filter(cat => exportData.some(data => data.categoryId === cat.id));

  for (const category of sortedCategories) {
    const categoryData = exportData.find(data => data.categoryId === category.id);
    if (!categoryData) continue;
    const categoryLabel = `Risiko ${categoryData.categoryLabel}`;
    const categoryStartRow = currentRow;

    const parameterGroups = {};
    for (const row of categoryData.data) {
      const paramKey = `${categoryData.categoryId}__${getParameterKeyFromIndeks(row.indeks)}`;
      if (!parameterGroups[paramKey]) parameterGroups[paramKey] = [];
      parameterGroups[paramKey].push(row);
    }

    let totalJudulNilaiInCategory = 0;
    for (const [paramKey, paramRows] of Object.entries(parameterGroups)) {
      const paramStartRow = currentRow;
      const jumlahJudulNilai = paramRows.length;

      paramRows.forEach((row, idx) => {
        const wsRow = worksheet.getRow(currentRow);
        if (idx === 0) {
          wsRow.getCell(1).value = categoryNumber;
          wsRow.getCell(1).style = styles.noStyle;
          wsRow.getCell(2).value = categoryLabel;
          wsRow.getCell(2).style = styles.kategoriStyle;
          wsRow.getCell(3).value = row.bobotParameter ? `${row.bobotParameter}%` : '-';
          wsRow.getCell(3).style = styles.bobotParameterStyle;
          wsRow.getCell(4).value = row.parameter || 'Parameter';
          wsRow.getCell(4).style = styles.parameterStyle;
        }
        wsRow.getCell(5).value = row.indeks || '-';
        wsRow.getCell(5).style = styles.numberStyle;
        wsRow.getCell(6).value = row.indikatorInheren || '-';
        wsRow.getCell(6).style = styles.indikatorStyle;
        wsRow.getCell(7).value = row.bobotNilai ? `${row.bobotNilai}%` : '-';
        wsRow.getCell(7).style = styles.numberStyle;
        wsRow.getCell(8).value = row.hasilAssessment || '-';
        wsRow.getCell(8).style = styles.numberStyle;
        wsRow.getCell(9).value = row.riskLevel || '-';
        wsRow.getCell(9).style = styles.getRiskCellStyle(row.riskColor || 'CCCCCC');
        wsRow.getCell(10).value = row.riskIndicator || '-';
        wsRow.getCell(10).style = styles.getRiskCellStyle(row.riskColor || 'CCCCCC');
        currentRow++;
      });

      const paramEndRow = currentRow - 1;
      totalJudulNilaiInCategory += jumlahJudulNilai;
      if (jumlahJudulNilai > 1) {
        try {
          worksheet.mergeCells(`D${paramStartRow}:D${paramEndRow}`);
          worksheet.mergeCells(`C${paramStartRow}:C${paramEndRow}`);
        } catch (error) {
          console.warn(`Merge error: ${error.message}`);
        }
      }
    }

    const categoryEndRow = currentRow - 1;
    if (totalJudulNilaiInCategory > 1) {
      try {
        worksheet.mergeCells(`A${categoryStartRow}:A${categoryEndRow}`);
        worksheet.mergeCells(`B${categoryStartRow}:B${categoryEndRow}`);
      } catch (error) {
        console.warn(`Merge kategori error: ${error.message}`);
      }
    }
    categoryNumber++;
  }

  for (let i = 3; i < currentRow; i++) worksheet.getRow(i).height = 30;
  worksheet.columns = [
    { width: 8 }, { width: 25 }, { width: 15 }, { width: 35 }, { width: 15 },
    { width: 60 }, { width: 15 }, { width: 20 }, { width: 15 }, { width: 20 }
  ];
  worksheet.views = [{ state: "frozen", ySplit: 2 }];
  return worksheet;
};

// Buat worksheet untuk tahunan
const createRingkasanTahunanWorksheet = async (workbook, dataPerQuarter, year) => {
  const worksheet = workbook.addWorksheet(`Ringkasan Tahunan ${year}`);
  const styles = createStyles();
  const quarters = ['q1', 'q2', 'q3', 'q4'];
  const totalCols = 6 + 4 * 4;

  const titleCell = worksheet.getCell('A1');
  titleCell.value = `RINGKASAN PROFIL RISIKO ${year}`;
  titleCell.style = { font: { name: 'Arial', size: 14, bold: true }, alignment: { vertical: 'middle', horizontal: 'center' } };
  worksheet.mergeCells(1, 1, 1, totalCols);
  worksheet.getRow(2).commit();
  worksheet.getRow(3).commit();

  const headerRow4 = worksheet.getRow(4);
  const staticHeaders = ['No', 'Jenis Risiko', 'Bobot Parameter', 'Parameter', 'Indeks', 'Indikator/Risiko Inheren'];
  staticHeaders.forEach((text, i) => {
    const cell = headerRow4.getCell(i + 1);
    cell.value = text;
    cell.style = styles.mainHeaderStyle;
  });

  let startCol = 7;
  quarters.forEach((q) => {
    const label = `${QUARTER_LABELS[q]} - ${year}`;
    const cell = headerRow4.getCell(startCol);
    cell.value = label;
    cell.style = styles.mainHeaderStyle;
    worksheet.mergeCells(4, startCol, 4, startCol + 3);
    startCol += 4;
  });

  const headerRow5 = worksheet.getRow(5);
  for (let i = 1; i <= 6; i++) headerRow5.getCell(i).style = { border: styles.mainHeaderStyle.border };
  const subHeaders = ['Bobot Nilai', 'Hasil', 'Risk Level', 'Risk Indicator'];
  startCol = 7;
  quarters.forEach(() => {
    subHeaders.forEach((text, j) => {
      const cell = headerRow5.getCell(startCol + j);
      cell.value = text;
      cell.style = styles.riskHeaderStyle;
    });
    startCol += 4;
  });
  for (let col = 1; col <= 6; col++) worksheet.mergeCells(4, col, 5, col);

  const quarterMaps = { q1: new Map(), q2: new Map(), q3: new Map(), q4: new Map() };
  quarters.forEach(q => {
    const qData = dataPerQuarter.quarters[q] || [];
    qData.forEach(catData => {
      catData.data.forEach(row => {
        quarterMaps[q].set(row.indeks, row);
      });
    });
  });

  const allRowsByIndex = new Map();
  const categoryGroups = {};
  quarters.forEach(q => {
    const qData = dataPerQuarter.quarters[q] || [];
    qData.forEach(catData => {
      const catId = catData.categoryId;
      if (!categoryGroups[catId]) categoryGroups[catId] = { parameters: {} };
      catData.data.forEach(row => {
        const idx = row.indeks;
        const fullParamKey = `${catId}__${getParameterKeyFromIndeks(idx)}`;
        if (!allRowsByIndex.has(idx)) {
          allRowsByIndex.set(idx, {
            categoryId: catId,
            categoryLabel: catData.categoryLabel,
            originalParameter: row.parameter || 'Parameter',
            parameterKey: fullParamKey,
            bobotParameter: row.bobotParameter,
            indeks: idx,
            indikatorInheren: row.indikatorInheren,
          });
        }
        if (!categoryGroups[catId].parameters[fullParamKey]) categoryGroups[catId].parameters[fullParamKey] = [];
        if (!categoryGroups[catId].parameters[fullParamKey].includes(idx)) {
          categoryGroups[catId].parameters[fullParamKey].push(idx);
        }
      });
    });
  });

  const masterRows = [];
  for (const catDef of CATEGORIES) {
    const group = categoryGroups[catDef.id];
    if (!group) continue;
    for (const fullParamKey of Object.keys(group.parameters)) {
      for (const idx of group.parameters[fullParamKey]) {
        const row = allRowsByIndex.get(idx);
        if (row) masterRows.push(row);
      }
    }
  }

  let currentRow = 6;
  let lastCategoryId = null;
  let categoryStartRow = null;
  let lastParamKey = null;
  let parameterStartRow = null;

  for (let i = 0; i < masterRows.length; i++) {
    const rowData = masterRows[i];
    const wsRow = worksheet.getRow(currentRow);
    const currentCategoryId = rowData.categoryId;
    const currentParamKey = rowData.parameterKey;

    if (currentCategoryId !== lastCategoryId) {
      if (lastParamKey && parameterStartRow && currentRow - 1 > parameterStartRow) {
        try { worksheet.mergeCells(`C${parameterStartRow}:C${currentRow-1}`); } catch (e) {}
        try { worksheet.mergeCells(`D${parameterStartRow}:D${currentRow-1}`); } catch (e) {}
      }
      if (lastCategoryId && categoryStartRow && currentRow - 1 > categoryStartRow) {
        try { worksheet.mergeCells(`A${categoryStartRow}:A${currentRow-1}`); } catch (e) {}
        try { worksheet.mergeCells(`B${categoryStartRow}:B${currentRow-1}`); } catch (e) {}
      }
      categoryStartRow = currentRow;
      lastCategoryId = currentCategoryId;
      lastParamKey = null;
      parameterStartRow = null;
    }

    if (currentParamKey !== lastParamKey) {
      if (lastParamKey && parameterStartRow && currentRow - 1 > parameterStartRow) {
        try { worksheet.mergeCells(`C${parameterStartRow}:C${currentRow-1}`); } catch (e) {}
        try { worksheet.mergeCells(`D${parameterStartRow}:D${currentRow-1}`); } catch (e) {}
      }
      parameterStartRow = currentRow;
      lastParamKey = currentParamKey;
    }

    if (i === 0 || masterRows[i-1].categoryId !== currentCategoryId) {
      const categoryNumber = CATEGORIES.findIndex(c => c.id === currentCategoryId) + 1;
      wsRow.getCell(1).value = categoryNumber;
      wsRow.getCell(1).style = styles.noStyle;
    } else {
      wsRow.getCell(1).style = { border: styles.noStyle.border };
    }

    if (i === 0 || masterRows[i-1].categoryId !== currentCategoryId) {
      wsRow.getCell(2).value = `Risiko ${rowData.categoryLabel}`;
      wsRow.getCell(2).style = styles.kategoriStyle;
    } else {
      wsRow.getCell(2).style = { border: styles.kategoriStyle.border };
    }

    if (currentParamKey !== (i>0 ? masterRows[i-1].parameterKey : null)) {
      wsRow.getCell(3).value = rowData.bobotParameter ? `${rowData.bobotParameter}%` : '-';
      wsRow.getCell(3).style = styles.bobotParameterStyle;
    } else {
      wsRow.getCell(3).style = { border: styles.bobotParameterStyle.border };
    }

    if (currentParamKey !== (i>0 ? masterRows[i-1].parameterKey : null)) {
      wsRow.getCell(4).value = rowData.originalParameter;
      wsRow.getCell(4).style = styles.parameterStyle;
    } else {
      wsRow.getCell(4).style = { border: styles.parameterStyle.border };
    }

    wsRow.getCell(5).value = rowData.indeks || '-';
    wsRow.getCell(5).style = styles.numberStyle;
    wsRow.getCell(6).value = rowData.indikatorInheren || '-';
    wsRow.getCell(6).style = styles.indikatorStyle;

    let col = 7;
    quarters.forEach((q) => {
      const qRow = quarterMaps[q].get(rowData.indeks);
      const bobotCell = wsRow.getCell(col);
      bobotCell.value = qRow && qRow.bobotNilai ? `${qRow.bobotNilai}%` : '-';
      bobotCell.style = styles.numberStyle;
      const hasilCell = wsRow.getCell(col + 1);
      hasilCell.value = qRow && qRow.hasilAssessment ? qRow.hasilAssessment : '-';
      hasilCell.style = styles.numberStyle;
      const riskLevelCell = wsRow.getCell(col + 2);
      riskLevelCell.value = qRow && qRow.riskLevel ? qRow.riskLevel : '-';
      riskLevelCell.style = qRow ? styles.getRiskCellStyle(qRow.riskColor || 'CCCCCC') : { border: styles.numberStyle.border };
      const riskIndicatorCell = wsRow.getCell(col + 3);
      riskIndicatorCell.value = qRow && qRow.riskIndicator ? qRow.riskIndicator : '-';
      riskIndicatorCell.style = qRow ? styles.getRiskCellStyle(qRow.riskColor || 'CCCCCC') : { border: styles.numberStyle.border };
      col += 4;
    });

    currentRow++;
  }

  if (lastParamKey && parameterStartRow && currentRow - 1 > parameterStartRow) {
    try { worksheet.mergeCells(`C${parameterStartRow}:C${currentRow-1}`); } catch (e) {}
    try { worksheet.mergeCells(`D${parameterStartRow}:D${currentRow-1}`); } catch (e) {}
  }
  if (lastCategoryId && categoryStartRow && currentRow - 1 > categoryStartRow) {
    try { worksheet.mergeCells(`A${categoryStartRow}:A${currentRow-1}`); } catch (e) {}
    try { worksheet.mergeCells(`B${categoryStartRow}:B${currentRow-1}`); } catch (e) {}
  }

  for (let i = 6; i < currentRow; i++) worksheet.getRow(i).height = 30;
  worksheet.columns = [
    { width: 8 }, { width: 25 }, { width: 15 }, { width: 35 }, { width: 15 }, { width: 60 },
    { width: 15 }, { width: 20 }, { width: 15 }, { width: 20 },
    { width: 15 }, { width: 20 }, { width: 15 }, { width: 20 },
    { width: 15 }, { width: 20 }, { width: 15 }, { width: 20 },
    { width: 15 }, { width: 20 }, { width: 15 }, { width: 20 }
  ];
  worksheet.views = [{ state: "frozen", ySplit: 5 }];
  return worksheet;
};

const downloadRingkasanExcel = async (options) => {
  try {
    const { year, selectedPages = [], kategoriFilter = {}, searchTerm = '', quarter = null, isTahunan = false, allQuarters = ['q1', 'q2', 'q3', 'q4'] } = options;
    if (!year) throw new Error("Tahun belum dipilih");
    if (!selectedPages || selectedPages.length === 0) throw new Error("Tidak ada kategori yang dipilih");

    const ExcelJS = await import('exceljs');
    const selectedCategories = CATEGORIES.filter(cat => selectedPages.includes(cat.id)).map(cat => ({ id: cat.id, label: cat.label, code: cat.code }));
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Risk Assessment System';
    workbook.lastModifiedBy = 'Risk Assessment System';
    workbook.created = new Date();
    workbook.modified = new Date();

    // Deklarasi variabel di luar blok
    let dataPerQuarter;
    let exportData;

    if (isTahunan) {
      dataPerQuarter = await getDataForExportRingkasanTahunan(selectedCategories, kategoriFilter, year, allQuarters);
      let hasAnyData = false;
      for (const quarterKey of allQuarters) {
        const quarterData = dataPerQuarter.quarters[quarterKey];
        if (quarterData && quarterData.length > 0) {
          for (const cat of quarterData) {
            if (!cat.categoryId || !Array.isArray(cat.data)) {
              throw new Error(`Data tidak valid untuk ${quarterKey}: kategori ${cat.categoryId || 'unknown'} tidak memiliki properti data yang benar`);
            }
          }
          hasAnyData = true;
        }
      }
      if (!hasAnyData) throw new Error("Tidak ada data untuk diekspor di semua quarter");
      await createRingkasanTahunanWorksheet(workbook, dataPerQuarter, year);
    } else {
      const activeQuarter = quarter || 'q1';
      exportData = await getDataForExportRingkasan(selectedCategories, kategoriFilter, year, activeQuarter);
      for (const cat of exportData) {
        if (!cat.categoryId || !Array.isArray(cat.data)) {
          throw new Error(`Data tidak valid: kategori ${cat.categoryId || 'unknown'} tidak memiliki properti data yang benar`);
        }
      }
      await createRingkasanWorksheet(workbook, exportData, activeQuarter, year);
    }

    const fileName = getExportFileNameRingkasan(selectedCategories, year, quarter, isTahunan);
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);

    return {
      success: true,
      filename: fileName,
      totalCategories: selectedCategories.length,
      totalRows: isTahunan
        ? Object.values(dataPerQuarter.quarters).flat().flatMap(cat => cat.data).length
        : exportData.reduce((sum, cat) => sum + cat.data.length, 0),
      isTahunan,
      quarter,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error dalam downloadRingkasanExcel:', error);
    return { success: false, error: error.message, timestamp: new Date().toISOString() };
  }
};

const downloadRingkasanExcelWithProgress = async (options, onProgress) => {
  try {
    const { year, selectedPages = [], kategoriFilter = {}, searchTerm = '', quarter = null, isTahunan = false, allQuarters = ['q1', 'q2', 'q3', 'q4'] } = options;
    if (!year) throw new Error("Tahun belum dipilih");
    if (!selectedPages || selectedPages.length === 0) throw new Error("Tidak ada kategori yang dipilih");

    if (onProgress) onProgress({ status: 'start', message: 'Memulai export...', progress: 0 });

    const ExcelJS = await import('exceljs');
    const selectedCategories = CATEGORIES.filter(cat => selectedPages.includes(cat.id)).map(cat => ({ id: cat.id, label: cat.label, code: cat.code }));

    if (onProgress) onProgress({ status: 'loading', message: 'Mengambil data...', progress: 10 });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Risk Assessment System';
    workbook.lastModifiedBy = 'Risk Assessment System';
    workbook.created = new Date();
    workbook.modified = new Date();

    let dataPerQuarter;
    let exportData;

    if (isTahunan) {
      if (onProgress) onProgress({ status: 'loading', message: 'Mengambil data tahunan...', progress: 20 });
      dataPerQuarter = await getDataForExportRingkasanTahunan(selectedCategories, kategoriFilter, year, allQuarters);
      for (const quarterKey of allQuarters) {
        const qData = dataPerQuarter.quarters[quarterKey];
        if (qData && qData.length > 0) {
          for (const cat of qData) {
            if (!cat.categoryId || !Array.isArray(cat.data)) {
              throw new Error(`Data tidak valid untuk ${quarterKey}: kategori ${cat.categoryId || 'unknown'} tidak memiliki properti data yang benar`);
            }
          }
        }
      }
      if (onProgress) onProgress({ status: 'processing', message: 'Membuat workbook...', progress: 60 });
      await createRingkasanTahunanWorksheet(workbook, dataPerQuarter, year);
    } else {
      const activeQuarter = quarter || 'q1';
      if (onProgress) onProgress({ status: 'loading', message: `Mengambil data ${activeQuarter.toUpperCase()}...`, progress: 20 });
      exportData = await getDataForExportRingkasan(selectedCategories, kategoriFilter, year, activeQuarter);
      for (const cat of exportData) {
        if (!cat.categoryId || !Array.isArray(cat.data)) {
          throw new Error(`Data tidak valid: kategori ${cat.categoryId || 'unknown'} tidak memiliki properti data yang benar`);
        }
      }
      if (onProgress) onProgress({ status: 'processing', message: 'Membuat workbook...', progress: 60 });
      await createRingkasanWorksheet(workbook, exportData, activeQuarter, year);
    }

    if (onProgress) onProgress({ status: 'writing', message: 'Menyimpan file...', progress: 90 });

    const fileName = getExportFileNameRingkasan(selectedCategories, year, quarter, isTahunan);
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    if (onProgress) onProgress({ status: 'complete', message: 'File siap diunduh', progress: 100 });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);

    return { success: true, filename: fileName, isTahunan, quarter, timestamp: new Date().toISOString() };
  } catch (error) {
    console.error('Error dalam downloadRingkasanExcelWithProgress:', error);
    if (onProgress) onProgress({ status: 'error', message: `Error: ${error.message}`, progress: 0 });
    return { success: false, error: error.message, timestamp: new Date().toISOString() };
  }
};

// Debug data
const debugRingkasanData = async (options) => {
  try {
    const { year, selectedPages = [], kategoriFilter = {}, quarter = null, isTahunan = false, allQuarters = ['q1', 'q2', 'q3', 'q4'] } = options;
    if (!year) throw new Error("Tahun belum dipilih");
    if (!selectedPages || selectedPages.length === 0) throw new Error("Tidak ada kategori yang dipilih");

    const selectedCategories = CATEGORIES.filter(cat => selectedPages.includes(cat.id)).map(cat => ({ id: cat.id, label: cat.label, code: cat.code }));
    const debugInfo = {
      options: { year, selectedPages, selectedCategories: selectedCategories.map(c => ({ id: c.id, label: c.label })), kategoriFilter, quarter, isTahunan, allQuarters },
      timestamp: new Date().toISOString()
    };

    if (isTahunan) {
      const dataPerQuarter = await getDataForExportRingkasanTahunan(selectedCategories, kategoriFilter, year, allQuarters);
      debugInfo.quarterDetails = {};
      debugInfo.summary = { totalCategories: selectedCategories.length, totalRowsOverall: 0 };
      for (const q of allQuarters) {
        const qData = dataPerQuarter.quarters[q] || [];
        const totalRows = qData.reduce((sum, cat) => sum + (cat.data?.length || 0), 0);
        debugInfo.quarterDetails[q] = {
          exists: !!dataPerQuarter.quarters[q],
          categoryCount: qData.length,
          totalRows,
          sampleData: qData.length > 0 && qData[0].data?.length > 0 ? qData[0].data.slice(0, 2) : null
        };
        debugInfo.summary.totalRowsOverall += totalRows;
      }
    } else {
      const activeQuarter = quarter || 'q1';
      const exportData = await getDataForExportRingkasan(selectedCategories, kategoriFilter, year, activeQuarter);
      debugInfo.exportData = exportData;
      debugInfo.summary = {
        totalCategories: exportData.length,
        totalRows: exportData.reduce((sum, cat) => sum + (cat.data?.length || 0), 0),
        categoriesWithData: exportData.filter(cat => cat.data?.length > 0).length
      };
    }
    return debugInfo;
  } catch (error) {
    console.error('Error dalam debugRingkasanData:', error);
    return { success: false, error: error.message, timestamp: new Date().toISOString() };
  }
};

// Statistik export
const getExportStatistics = async (options) => {
  try {
    const debugInfo = await debugRingkasanData(options);
    if (debugInfo.success === false) return { success: false, error: debugInfo.error };
    const stats = {
      totalCategories: debugInfo.summary?.totalCategories || 0,
      totalRows: debugInfo.summary?.totalRowsOverall || debugInfo.summary?.totalRows || 0,
      estimatedFileSize: formatBytes((debugInfo.summary?.totalRowsOverall || debugInfo.summary?.totalRows || 0) * 500)
    };
    return { success: true, stats, debugInfo };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Wrapper untuk kompatibilitas
const exportRingkasanSimple = (selectedPages, kategoriFilter, year, quarter = 'q1') => {
  return downloadRingkasanExcel({ year, selectedPages, kategoriFilter, quarter, isTahunan: false });
};

const exportRingkasanTahunan = (selectedPages, kategoriFilter, year) => {
  return downloadRingkasanExcel({ year, selectedPages, kategoriFilter, isTahunan: true });
};

// ==================== KOMPONEN FILTER ====================
function KategoriFilter({ filter, setFilter }) {
  const [showUnderlyingDropdown, setShowUnderlyingDropdown] = useState(false);
  const underlyingDropdownRef = useRef(null);

  const handleFilterChange = (key, value) => {
    setFilter(prev => {
      const newFilter = { ...prev, [key]: value };
      if (key === "model") {
        if (value === "tanpa_model") {
          return { ...newFilter, prinsip: "", jenis: "", underlying: [] };
        }
        return { ...newFilter, jenis: "", underlying: [] };
      }
      return newFilter;
    });
  };

  const handleUnderlyingToggle = (value) => {
    setFilter(prev => {
      const current = Array.isArray(prev.underlying) ? prev.underlying : [];
      const newUnderlying = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, underlying: newUnderlying };
    });
  };

  const getUnderlyingDisplayText = () => {
    if (!filter.underlying || filter.underlying.length === 0) return "Semua Underlying";
    const labels = filter.underlying.map(value => KATEGORI_OPTIONS.underlying.find(o => o.value === value)?.label || value);
    return labels.join(", ");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (underlyingDropdownRef.current && !underlyingDropdownRef.current.contains(event.target)) {
        setShowUnderlyingDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-blue-50 p-4 rounded-lg border border-blue-200">
      <h3 className="font-semibold text-2xl tracking-wide mb-3 text-blue-800">Filter Kategori</h3>
      <div className="grid grid-cols-7 gap-4">
        <div className="col-span-2">
          <label className="block text-base ml-2 font-semibold tracking-wide text-gray-700 mb-1">Model Produk</label>
          <select className="w-full border border-gray-950 rounded-md px-3 py-2 text-base bg-white" value={filter.model} onChange={(e) => handleFilterChange("model", e.target.value)}>
            {KATEGORI_OPTIONS.model.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        {filter.model !== "tanpa_model" && (
          <div className="col-span-2">
            <label className="block text-base ml-2 font-semibold tracking-wide text-gray-700 mb-1">Prinsip</label>
            <select className="w-full border border-gray-950 rounded-md px-3 py-2 text-base bg-white" value={filter.prinsip} onChange={(e) => handleFilterChange("prinsip", e.target.value)}>
              {KATEGORI_OPTIONS.prinsip.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        )}
        {filter.model === "open_end" && (
          <div className="col-span-2">
            <label className="block text-base ml-2 tracking-wide font-semibold text-gray-700 mb-1">Jenis Reksa Dana</label>
            <select className="w-full border border-gray-950 rounded-md px-3 py-2 text-base bg-white" value={filter.jenis} onChange={(e) => handleFilterChange("jenis", e.target.value)}>
              {KATEGORI_OPTIONS.jenis.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        )}
        {filter.model === "terstruktur" && (
          <div className="col-span-2 relative" ref={underlyingDropdownRef}>
            <label className="block text-base ml-2 font-semibold tracking-wide text-gray-700 mb-1">Aset Dasar</label>
            <button type="button" className="w-full border border-gray-950 rounded-md px-3 py-1.5 text-base bg-white text-left flex justify-between items-center" onClick={() => setShowUnderlyingDropdown(!showUnderlyingDropdown)}>
              <span className="truncate">{getUnderlyingDisplayText()}</span>
              <span className="ml-2">▾</span>
            </button>
            {showUnderlyingDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                <div className="p-2 border-b">
                  <button type="button" className="w-full text-left px-2 py-1 text-base text-blue-800 hover:bg-blue-50 rounded" onClick={() => { setFilter(prev => ({ ...prev, underlying: [] })); setShowUnderlyingDropdown(false); }}>
                    Select All
                  </button>
                </div>
                {KATEGORI_OPTIONS.underlying.filter(opt => opt.value !== "").map((opt) => {
                  const isSelected = filter.underlying?.includes(opt.value);
                  return (
                    <div key={opt.value} className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 cursor-pointer" onClick={() => handleUnderlyingToggle(opt.value)}>
                      <input type="checkbox" className="accent-blue-800" checked={isSelected} onChange={(e) => { e.stopPropagation(); handleUnderlyingToggle(opt.value); }} />
                      <span className="text-sm">{opt.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        <div className="flex items-end">
          <button type="button" className="px-4 py-2 flex items-center bg-blue-800 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors" onClick={() => setFilter({ model: "", prinsip: "", jenis: "", underlying: [] })}>
            <RefreshCcw className="h-4 w-4 mr-2"/>Reset Filter
          </button>
        </div>
      </div>
      {(filter.model || (filter.model !== "tanpa_model" && filter.prinsip) || filter.jenis || (Array.isArray(filter.underlying) && filter.underlying.length > 0 && filter.model === "terstruktur")) && (
        <div className="mt-3 text-base font-semibold text-gray-800">
          Filter aktif :<br/>
          {[
            filter.model && `Model: ${KATEGORI_OPTIONS.model.find(o => o.value === filter.model)?.label}`,
            filter.prinsip && filter.model !== "tanpa_model" && `Prinsip: ${KATEGORI_OPTIONS.prinsip.find(o => o.value === filter.prinsip)?.label}`,
            filter.jenis && `Jenis: ${KATEGORI_OPTIONS.jenis.find(o => o.value === filter.jenis)?.label}`,
            Array.isArray(filter.underlying) && filter.underlying.length > 0 && filter.model === "terstruktur" && `Underlying: ${filter.underlying.map(v => KATEGORI_OPTIONS.underlying.find(o => o.value === v)?.label || v).join(", ")}`,
          ].filter(Boolean).join(", ")}
        </div>
      )}
    </div>
  );
}

// ==================== KOMPONEN UTAMA ====================
export default function Ringkasan() {
  const { year, activeQuarter, search } = useHeaderStore();
  const [selectedPages, setSelectedPages] = useState(() => CATEGORIES.map(category => category.id));
  const [kategoriFilter, setKategoriFilter] = useState({ model: "", prinsip: "", jenis: "", underlying: [] });
  const [summaryData, setSummaryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const kategoriScrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Scroll handling (sama seperti aslinya)
  useEffect(() => {
    const container = kategoriScrollRef.current;
    if (!container) return;
    const handleWheel = (e) => {
      const rect = container.getBoundingClientRect();
      const isInside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (isInside && container.scrollWidth > container.clientWidth) {
        e.preventDefault();
        container.scrollLeft += e.deltaY * 2;
      }
    };
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - kategoriScrollRef.current.offsetLeft);
    setScrollLeft(kategoriScrollRef.current.scrollLeft);
    kategoriScrollRef.current.style.cursor = 'grabbing';
    kategoriScrollRef.current.style.userSelect = 'none';
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !kategoriScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - kategoriScrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    kategoriScrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (kategoriScrollRef.current) {
      kategoriScrollRef.current.style.cursor = 'grab';
      kategoriScrollRef.current.style.removeProperty('user-select');
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  // Fungsi kontrol kategori
  const selectAllPages = () => setSelectedPages(CATEGORIES.map(c => c.id));
  const deselectAllPages = () => setSelectedPages([]);
  const toggleAllPages = () => {
    if (selectedPages.length === CATEGORIES.length) deselectAllPages();
    else selectAllPages();
  };
  const togglePage = (id) => {
    setSelectedPages(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // Load data
  useEffect(() => {
    const loadSummaryData = async () => {
      if (selectedPages.length === 0) {
        setSummaryData([]);
        return;
      }
      setIsLoading(true);
      const data = [];
      selectedPages.forEach((categoryId, pageIndex) => {
        try {
          let rows = loadInherent({ categoryId, year, quarter: activeQuarter });
          rows = normalizeAndComputeDerived(rows);
          if (!Array.isArray(rows) || rows.length === 0) {
            data.push({ no: pageIndex + 1, categoryId, categoryLabel: CATEGORIES.find(c => c.id === categoryId)?.label || categoryId, categoryCode: CATEGORIES.find(c => c.id === categoryId)?.code || "UNK", rows: [], totalWeighted: 0, hasData: false });
            return;
          }
          const filteredRows = rows.filter((param) => {
            const kategori = param.kategori || {};
            let shouldInclude = true;
            if (kategoriFilter.model && kategori.model !== kategoriFilter.model) shouldInclude = false;
            if (shouldInclude && kategoriFilter.prinsip && kategori.model !== "tanpa_model") {
              if (kategori.prinsip !== kategoriFilter.prinsip) shouldInclude = false;
            }
            if (shouldInclude && kategoriFilter.jenis && kategori.model === "open_end") {
              if (kategori.jenis !== kategoriFilter.jenis) shouldInclude = false;
            }
            if (shouldInclude && Array.isArray(kategoriFilter.underlying) && kategoriFilter.underlying.length > 0) {
              if (kategori.model === "terstruktur") {
                const paramUnderlying = Array.isArray(kategori.underlying) ? kategori.underlying : [];
                const hasOverlap = kategoriFilter.underlying.some(value => paramUnderlying.includes(value));
                if (!hasOverlap) shouldInclude = false;
              } else if (kategori.model !== "tanpa_model") {
                shouldInclude = false;
              }
            }
            return shouldInclude;
          });
          const totalWeighted = calculateTotalWeighted(filteredRows);
          data.push({ no: pageIndex + 1, categoryId, categoryLabel: CATEGORIES.find(c => c.id === categoryId)?.label || categoryId, categoryCode: CATEGORIES.find(c => c.id === categoryId)?.code || "UNK", rows: filteredRows, totalWeighted, hasData: filteredRows.length > 0 });
        } catch (error) {
          console.error(`Error loading data for ${categoryId}:`, error);
          data.push({ no: pageIndex + 1, categoryId, categoryLabel: CATEGORIES.find(c => c.id === categoryId)?.label || categoryId, categoryCode: CATEGORIES.find(c => c.id === categoryId)?.code || "UNK", rows: [], totalWeighted: 0, hasData: false, error: error.message });
        }
      });
      setSummaryData(data);
      setIsLoading(false);
    };
    loadSummaryData();
  }, [selectedPages, year, activeQuarter, kategoriFilter]);

  const handleExportToExcel = async () => {
    if (!year) {
      alert("Tahun belum dipilih");
      return;
    }
    try {
      const exportOptions = {
        year,
        selectedPages,
        kategoriFilter,
        searchTerm: search,
        quarter: activeQuarter,
        isTahunan: true, // Sesuai permintaan: export tahunan
        allQuarters: ['q1', 'q2', 'q3', 'q4']
      };
      const result = await downloadRingkasanExcel(exportOptions);
      if (!result.success) throw new Error(result.error || "Gagal export Excel");
    } catch (err) {
      console.error("EXPORT RINGKASAN ERROR:", err);
      alert(err?.message || "Gagal export Excel Ringkasan");
    }
  };

  // Render data rows (fungsi dari komponen asli)
  const renderDataRows = () => {
    if (isLoading) {
      return (
        <tr><td colSpan={11} className="border border-gray-950 px-4 py-8 text-center">
          <div className="flex justify-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div><span className="ml-3">Memuat data...</span></div>
        </td></tr>
      );
    }
    if (selectedPages.length === 0) {
      return <tr><td colSpan={11} className="border border-gray-950 px-2 py-4 text-center text-gray-500">Pilih kategori halaman untuk menampilkan data ringkasan</td></tr>;
    }
    const allRows = [];
    const searchLower = search.toLowerCase().trim();
    summaryData.forEach((pageData, pageIndex) => {
      const { no, categoryLabel, categoryCode, rows } = pageData;
      if (!Array.isArray(rows) || rows.length === 0) {
        allRows.push(<tr key={`${categoryCode}-no-data`}><td colSpan={11} className="border border-gray-950 px-2 py-4 text-center text-gray-500"><div className="flex items-center justify-center text-red-500"><svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Data tidak ditemukan untuk Risiko {categoryLabel}</div></td></tr>);
        return;
      }
      let totalRowSpanForPage = 0;
      let hasSearchResults = false;
      rows.forEach((param) => {
        if (param.nilaiList && Array.isArray(param.nilaiList) && param.nilaiList.length > 0) {
          const parameterName = param.judul || "Parameter";
          const parameterNumber = param.nomor || "1";
          if (searchLower) {
            param.nilaiList.forEach(item => {
              const indikatorInheren = item?.judul?.text || "-";
              const nilaiNomor = item?.nomor || parameterNumber;
              const indeks = `R.${categoryCode}.${nilaiNomor}`;
              if (indikatorInheren.toLowerCase().includes(searchLower) || parameterName.toLowerCase().includes(searchLower) || categoryLabel.toLowerCase().includes(searchLower) || indeks.toLowerCase().includes(searchLower)) {
                hasSearchResults = true;
                totalRowSpanForPage++;
              }
            });
          } else {
            totalRowSpanForPage += param.nilaiList.length;
            hasSearchResults = true;
          }
        } else {
          totalRowSpanForPage += 1;
          hasSearchResults = true;
        }
      });
      if (searchLower && !hasSearchResults) return;
      let isFirstRowInPage = true;
      rows.forEach((param, paramIndex) => {
        const parameterName = param.judul || "Parameter";
        const parameterNumber = param.nomor || (paramIndex + 1).toString();
        if (!param.nilaiList || !Array.isArray(param.nilaiList) || param.nilaiList.length === 0) {
          const indeks = `R.${categoryCode}.${parameterNumber}`;
          const shouldDisplay = !searchLower || parameterName.toLowerCase().includes(searchLower) || categoryLabel.toLowerCase().includes(searchLower) || indeks.toLowerCase().includes(searchLower);
          if (!shouldDisplay) return;
          allRows.push(
            <tr key={`${categoryCode}-${paramIndex}-empty`}>
              {isFirstRowInPage && <td rowSpan={totalRowSpanForPage} className="border border-gray-950 px-2 py-2 text-center text-base bg-[#E8F5FA] align-top">{no}</td>}
              {isFirstRowInPage && <td rowSpan={totalRowSpanForPage} className="border border-gray-950 px-2 py-2 text-base bg-[#E8F5FA] align-top">Risiko {categoryLabel}</td>}
              <td className="border border-gray-950 px-2 py-2 text-center text-base bg-[#E8F5FA]">{formatPercent(param.bobot)}</td>
              <td className="border border-gray-950 px-2 py-2 text-base bg-[#E8F5FA]">{parameterName}</td>
              <td className="border border-gray-950 px-2 py-2 text-center text-base font-mono bg-[#E8F5FA]">{indeks}</td>
              <td className="border border-gray-950 px-2 py-2 text-center text-base bg-[#E8F5FA]">-</td>
              <td className="border border-gray-950 px-2 py-2 text-center text-base">-</td>
              <td className="border border-gray-950 px-2 py-2 text-center text-base">-</td>
              <td className="border border-gray-950 px-2 py-2 text-center text-base">-</td>
              <td className="border border-gray-950 px-2 py-2 text-center text-base">-</td>
            </tr>
          );
          isFirstRowInPage = false;
          return;
        }
        let itemAddedInParam = false;
        param.nilaiList.forEach((item, itemIndex) => {
          const derived = item?.derived || {};
          const hasilAssessment = derived.hasilDisplay !== undefined ? derived.hasilDisplay : (derived.weighted !== undefined ? derived.weighted : 0);
          const riskLevel = derived.peringkat !== undefined && derived.peringkat !== null ? derived.peringkat : 0;
          const riskIndicator = getRiskIndicator(riskLevel);
          const riskColor = getRiskColor(riskLevel);
          const indikatorInheren = item?.judul?.text || "-";
          const nilaiNomor = item?.nomor || parameterNumber;
          const indeks = `R.${categoryCode}.${nilaiNomor}`;
          if (searchLower) {
            if (!indikatorInheren.toLowerCase().includes(searchLower) && !parameterName.toLowerCase().includes(searchLower) && !categoryLabel.toLowerCase().includes(searchLower) && !indeks.toLowerCase().includes(searchLower)) return;
          }
          allRows.push(
            <tr key={`${categoryCode}-${paramIndex}-${itemIndex}`}>
              {isFirstRowInPage && itemIndex === 0 && <td rowSpan={totalRowSpanForPage} className="border border-gray-950 px-2 py-2 text-base text-center bg-[#E8F5FA] align-middle">{no}</td>}
              {isFirstRowInPage && itemIndex === 0 && <td rowSpan={totalRowSpanForPage} className="border border-gray-950 text-base px-2 py-2 bg-[#E8F5FA] align-middle">Risiko {categoryLabel}</td>}
              {itemIndex === 0 && <td rowSpan={param.nilaiList.length} className="border border-gray-950 text-base px-2 py-2 text-center bg-[#E8F5FA] align-middle">{formatPercent(param.bobot)}</td>}
              {itemIndex === 0 && <td rowSpan={param.nilaiList.length} className="border border-gray-950 text-base px-2 py-2 bg-[#E8F5FA] align-middle">{parameterName}</td>}
              <td className="border border-gray-950 text-base px-2 py-2 text-center font-mono bg-[#E8F5FA]">{indeks}</td>
              <td className="border border-gray-950 text-base px-2 py-2 bg-[#E8F5FA] break-words max-w-[500px]">{indikatorInheren}</td>
              <td className="border border-gray-950 text-base px-2 py-2 text-center">{formatPercent(item.bobot)}</td>
              <td className="border border-gray-950 text-base px-2 py-2 text-center font-bold">{formatNumber(hasilAssessment)}</td>
              <td className={`border border-gray-950 text-base px-2 py-2 text-center font-bold ${riskColor}`}>{formatNumber(riskLevel)}</td>
              <td className={`border border-gray-950 text-base px-2 py-2 text-center font-bold ${riskColor}`}>{riskIndicator}</td>
            </tr>
          );
          itemAddedInParam = true;
        });
        if (itemAddedInParam) isFirstRowInPage = false;
      });
    });
    if (allRows.length === 0) {
      return (
        <tr><td colSpan={11} className="border border-gray-950 px-2 py-4 text-center text-gray-500">
          <div className="flex items-center justify-center text-red-500">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {searchLower ? `Tidak ditemukan data untuk pencarian: "${search}"` : "Data tidak ditemukan untuk kategori yang dipilih"}
          </div>
        </td></tr>
      );
    }
    return allRows;
  };

  return (
    <div className="space-y-4">
      <Header title="Ringkasan" onExportClick={handleExportToExcel} />
      <div className="bg-white rounded-lg p-4 shadow space-y-4">
        {/* CATEGORY SELECTION */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-2xl tracking-wider">Kategori Halaman</h3>
            <div className="flex gap-2">
              <button onClick={toggleAllPages} className="px-3 py-1.5 text-xs bg-sky-700 text-white rounded-md hover:bg-sky-900 transition-colors">
                {selectedPages.length === CATEGORIES.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-lg">
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map((c) => {
                const Icon = c.Icon;
                const active = selectedPages.includes(c.id);
                return (
                  <Button key={c.id} onClick={() => togglePage(c.id)} className={active ? "bg-blue-900 text-white flex-shrink-0 hover:bg-gray-300 hover:text-black" : "bg-white text-black flex-shrink-0 hover:bg-blue-900 hover:text-white"}>
                    <Icon className="w-4 h-4 mr-2" />{c.label}
                  </Button>
                );
              })}
            </div>
          </div>
          <div className="mt-2 text-md font-medium ml-2 text-gray-600">{selectedPages.length} dari {CATEGORIES.length} kategori terpilih</div>
        </div>

        {/* KATEGORI FILTER */}
        {selectedPages.length > 0 && <KategoriFilter filter={kategoriFilter} setFilter={setKategoriFilter} />}

        {/* SUMMARY TABLE */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-950 text-sm">
            <thead className="[&>tr>th]:sticky [&>tr>th]:top-0">
              <tr>
                <th rowSpan={3} className="border border-gray-950 text-lg px-2 py-2 bg-blue-800 text-white min-w-[50px] max-w-[80px]">No</th>
                <th rowSpan={3} className="border border-gray-950 text-lg px-2 py-2 bg-blue-800 text-white min-w-[110px] max-w-[150px]">Jenis Resiko</th>
                <th rowSpan={3} className="border border-gray-950 text-lg px-2 py-2 bg-blue-800 text-white min-w-[30px] max-w-[120px]">Bobot</th>
                <th rowSpan={3} className="border border-gray-950 text-lg px-2 py-2 bg-blue-800 text-white min-w-[250px] max-w-[200px]">Parameter</th>
                <th rowSpan={3} className="border border-gray-950 text-lg px-2 py-2 bg-blue-800 text-white min-w-[100px] max-w-[200px]">Indeks</th>
                <th rowSpan={3} className="border border-gray-950 text-lg px-2 py-2 bg-blue-800 text-white min-w-[250px] max-w-[250px]">Indikator/Risiko Inheren</th>
                <th colSpan={4} className="border border-gray-950 text-base px-2 py-2 bg-slate-800 text-white">Hasil Risk Assessment</th>
              </tr>
              <tr>
                <th colSpan={4} className="border border-gray-950 text-base px-2 py-2 bg-slate-800 text-white">Active Quarter {activeQuarter?.toUpperCase()}</th>
              </tr>
              <tr>
                <th className="border border-gray-950 text-base px-2 py-2 bg-slate-800 text-white min-w-[40px] max-w-[150px]">Bobot</th>
                <th className="border border-gray-950 text-base px-2 py-2 bg-slate-800 text-white min-w-[80px] max-w-[180px]">Hasil Assessment</th>
                <th className="border border-gray-950 text-base px-2 py-2 bg-slate-800 text-white min-w-[80px] max-w-[150px]">Risk Level</th>
                <th className="border border-gray-950 text-base px-2 py-2 bg-slate-800 text-white min-w-[80px] max-w-[250px]">Risk Indicator</th>
              </tr>
            </thead>
            <tbody>{renderDataRows()}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}