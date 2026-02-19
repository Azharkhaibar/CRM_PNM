import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
// import { calculateRasValue, formatRasDisplayValue, getMonthName } from './rasUtils.js';
import { calculateRasValue, formatRasDisplayValue, getMonthName } from './ras-utils';
// import ExcelJS from 'exceljs';
import ExcelJS from 'exceljs';
const getFormattedValue = (val, unit) => {
  if (val === null || val === undefined || val === '') return '-';
  return formatRasDisplayValue(val, unit);
};

// --- UPDATED: Hapus Ketergantungan NO ---
const getHistoricalItem = (allData, currentItem, targetYear) => {
  if (!allData) return null;

  if (currentItem.groupId) {
    const found = allData.find((d) => d.year === targetYear && d.groupId === currentItem.groupId);
    if (found) return found;
  }

  // Fallback ke Parameter Name + Category jika groupId gagal/tidak ada
  return allData.find((d) => d.year === targetYear && d.riskCategory === currentItem.riskCategory && d.parameter.trim().toLowerCase() === currentItem.parameter.trim().toLowerCase());
};

// --- UPDATED: Calculate Stats dengan NORMALISASI ---
const calculateStats = (allData, currentItem, currentYear) => {
  const yearsToCheck = [currentYear - 3, currentYear - 2, currentYear - 1];
  let allValues = [];

  yearsToCheck.forEach((y) => {
    const histItem = getHistoricalItem(allData, currentItem, y);
    if (histItem && histItem.monthlyValues) {
      Object.values(histItem.monthlyValues).forEach((mVal) => {
        let val = calculateRasValue(mVal.num, mVal.den, histItem.unitType, mVal.man);

        if (val !== null && val !== undefined && val !== '') {
          val = parseFloat(val);

          // --- NORMALISASI UNIT ---
          if (currentItem.unitType === 'X' && histItem.unitType === 'PERCENTAGE') {
            val = val / 100;
          } else if (currentItem.unitType === 'PERCENTAGE' && histItem.unitType === 'X') {
            val = val * 100;
          }

          allValues.push(val);
        }
      });
    }
  });

  const N = allValues.length;
  if (N === 0) return null;

  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const sum = allValues.reduce((a, b) => a + b, 0);
  const avg = sum / N;

  let stdev = 0;
  if (N > 1) {
    const squareDiffs = allValues.map((v) => Math.pow(v - avg, 2));
    const sumSquareDiff = squareDiffs.reduce((a, b) => a + b, 0);
    stdev = Math.sqrt(sumSquareDiff / (N - 1));
  }

  return {
    avg,
    stdev,
    min,
    max,
    avg_min_1sd: avg - stdev,
    avg_plus_1sd: avg + stdev,
    avg_plus_2sd: avg + 2 * stdev,
    avg_plus_3sd: avg + 3 * stdev,
  };
};

const HEADER_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E79' } };
const HEADER_FONT = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
const BORDER_ALL = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
const ALIGN_CENTER = { horizontal: 'center', vertical: 'middle', wrapText: true };

export const exportRasMonthly = async (rows, year, selectedMonths) => {
  if (!rows || rows.length === 0) return alert('Tidak ada data untuk diexport');

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('RAS Bulanan');

  const columns = [
    { header: 'Risiko', key: 'risk', width: 25 },
    { header: 'No', key: 'no', width: 8, style: { alignment: { horizontal: 'center' } } },
    { header: 'Parameter', key: 'param', width: 50 },
    { header: `RKAP ${year}`, key: 'rkap', width: 15, style: { alignment: { horizontal: 'center' } } },
    { header: 'Penjelasan Tipe Data', key: 'dataType', width: 25, outlineLevel: 1, hidden: true },
    { header: 'Limit RAS', key: 'limit', width: 15, style: { font: { color: { argb: 'FFFF0000' }, bold: true }, alignment: { horizontal: 'center' } } },
    { header: 'Sikap Risiko', key: 'stance', width: 20, style: { alignment: { horizontal: 'center' } } },
    { header: 'Statement', key: 'statement', width: 40, outlineLevel: 1, hidden: true },
    { header: 'Keterangan', key: 'notes', width: 30, outlineLevel: 1, hidden: true },
  ];

  selectedMonths.forEach((mIdx) => {
    columns.push({
      header: getMonthName(mIdx),
      key: `m_${mIdx}`,
      width: 18,
      style: { alignment: { horizontal: 'center' } },
    });
  });

  sheet.columns = columns;

  const headerRow = sheet.getRow(1);
  headerRow.height = 30;
  headerRow.eachCell((cell) => {
    cell.fill = HEADER_FILL;
    cell.font = HEADER_FONT;
    cell.alignment = ALIGN_CENTER;
    cell.border = BORDER_ALL;
  });

  const sortedRows = [...rows].sort((a, b) => (Number(a.no) || 0) - (Number(b.no) || 0));
  let lastCategory = '';

  sortedRows.forEach((item) => {
    const rowValues = {
      risk: item.riskCategory !== lastCategory ? item.riskCategory : '',
      no: item.no,
      param: item.parameter,
      rkap: getFormattedValue(item.rkapTarget, item.unitType),
      dataType: item.dataTypeExplanation,
      limit: getFormattedValue(item.rasLimit, item.unitType),
      stance: item.riskStance,
      statement: item.statement,
      notes: item.notes,
    };

    selectedMonths.forEach((mIdx) => {
      const mVal = item.monthlyValues?.[mIdx];
      const val = calculateRasValue(mVal?.num, mVal?.den, item.unitType, mVal?.man);
      rowValues[`m_${mIdx}`] = getFormattedValue(val, item.unitType);
    });

    const mainRow = sheet.addRow(rowValues);
    mainRow.alignment = { vertical: 'top', wrapText: true };
    mainRow.eachCell((cell) => {
      cell.border = BORDER_ALL;
    });
    if (rowValues.risk) mainRow.getCell(1).font = { bold: true };

    if (item.hasNumeratorDenominator) {
      const numRow = sheet.addRow({ risk: '', no: '', param: `(Pembilang) ${item.numeratorLabel || ''}` });
      const denRow = sheet.addRow({ risk: '', no: '', param: `(Penyebut) ${item.denominatorLabel || ''}` });

      [numRow, denRow].forEach((r) => {
        r.outlineLevel = 1;
        r.hidden = true;
        r.font = { italic: true, color: { argb: 'FF666666' } };
        r.getCell(3).alignment = { indent: 2 };
        r.eachCell((cell) => {
          cell.border = BORDER_ALL;
        });
        selectedMonths.forEach((_, i) => {
          r.getCell(10 + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
        });
      });
      selectedMonths.forEach((mIdx, i) => {
        const mVal = item.monthlyValues?.[mIdx];
        numRow.getCell(10 + i).value = mVal?.num || '-';
        denRow.getCell(10 + i).value = mVal?.den || '-';
      });
    }
    lastCategory = item.riskCategory;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `RAS_Bulanan_${year}.xlsx`);
};

export const exportRasYearly = async (rows, year, allData) => {
  if (!rows || rows.length === 0) return alert('Tidak ada data untuk diexport');

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('RAS Tahunan');

  const columns = [
    { header: 'Jenis Risiko', key: 'risk', width: 25 },
    { header: 'No', key: 'no', width: 8, style: { alignment: { horizontal: 'center' } } },
    { header: 'Statement', key: 'statement', width: 50 },
    { header: 'Formulasi', key: 'formulasi', width: 40 },
    { header: 'Tipe Data', key: 'dataType', width: 20 },
    { header: `RKAP ${year - 2}`, key: `rkap_${year - 2}`, width: 15, style: { alignment: { horizontal: 'center' } } },
    { header: `RAS ${year - 2}`, key: `ras_${year - 2}`, width: 15, style: { alignment: { horizontal: 'center' } } },
    { header: `RKAP ${year - 1}`, key: `rkap_${year - 1}`, width: 15, style: { alignment: { horizontal: 'center' } } },
    { header: `RAS ${year - 1}`, key: `ras_${year - 1}`, width: 15, style: { alignment: { horizontal: 'center' } } },
    { header: 'AVG 3Y', key: 'avg', width: 12, outlineLevel: 1, hidden: true, style: { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDDEBF7' } } } },
    { header: 'STDEV', key: 'stdev', width: 12, outlineLevel: 1, hidden: true, style: { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDDEBF7' } } } },
    { header: 'AVG-1SD', key: 'avg_min1', width: 12, outlineLevel: 1, hidden: true, style: { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDDEBF7' } } } },
    { header: 'AVG+1SD', key: 'avg_plus1', width: 12, outlineLevel: 1, hidden: true, style: { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDDEBF7' } } } },
    { header: 'AVG+2SD', key: 'avg_plus2', width: 12, outlineLevel: 1, hidden: true, style: { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDDEBF7' } } } },
    { header: 'AVG+3SD', key: 'avg_plus3', width: 12, outlineLevel: 1, hidden: true, style: { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDDEBF7' } } } },
    { header: 'MIN', key: 'min', width: 12, outlineLevel: 1, hidden: true, style: { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDDEBF7' } } } },
    { header: 'MAX', key: 'max', width: 12, outlineLevel: 1, hidden: true, style: { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDDEBF7' } } } },
    { header: `RKAP ${year}`, key: `rkap_${year}`, width: 15, style: { font: { color: { argb: 'FF0000FF' }, bold: true }, alignment: { horizontal: 'center' } } },
    { header: `RAS ${year}`, key: `ras_${year}`, width: 15, style: { font: { color: { argb: 'FFFF0000' }, bold: true }, alignment: { horizontal: 'center' } } },
  ];

  sheet.columns = columns;
  const headerRow = sheet.getRow(1);
  headerRow.height = 30;
  headerRow.eachCell((cell) => {
    cell.fill = HEADER_FILL;
    cell.font = HEADER_FONT;
    cell.alignment = ALIGN_CENTER;
    cell.border = BORDER_ALL;
  });

  const sortedRows = [...rows].sort((a, b) => (Number(a.no) || 0) - (Number(b.no) || 0));
  let lastCategory = '';

  sortedRows.forEach((item) => {
    const histYear2 = getHistoricalItem(allData, item, year - 2);
    const histYear1 = getHistoricalItem(allData, item, year - 1);
    const stats = calculateStats(allData, item, year);

    const rowValues = {
      risk: item.riskCategory !== lastCategory ? item.riskCategory : '',
      no: item.no,
      statement: item.parameter,
      formulasi: item.formulasi || item.statement || '-',
      dataType: item.dataTypeExplanation,
      [`rkap_${year - 2}`]: getFormattedValue(histYear2?.rkapTarget, item.unitType),
      [`ras_${year - 2}`]: getFormattedValue(histYear2?.rasLimit, item.unitType),
      [`rkap_${year - 1}`]: getFormattedValue(histYear1?.rkapTarget, item.unitType),
      [`ras_${year - 1}`]: getFormattedValue(histYear1?.rasLimit, item.unitType),
      avg: stats ? getFormattedValue(stats.avg, item.unitType) : '-',
      stdev: stats ? getFormattedValue(stats.stdev, item.unitType) : '-',
      avg_min1: stats ? getFormattedValue(stats.avg_min_1sd, item.unitType) : '-',
      avg_plus1: stats ? getFormattedValue(stats.avg_plus_1sd, item.unitType) : '-',
      avg_plus2: stats ? getFormattedValue(stats.avg_plus_2sd, item.unitType) : '-',
      avg_plus3: stats ? getFormattedValue(stats.avg_plus_3sd, item.unitType) : '-',
      min: stats ? getFormattedValue(stats.min, item.unitType) : '-',
      max: stats ? getFormattedValue(stats.max, item.unitType) : '-',
      [`rkap_${year}`]: getFormattedValue(item.rkapTarget, item.unitType),
      [`ras_${year}`]: getFormattedValue(item.rasLimit, item.unitType),
    };

    const mainRow = sheet.addRow(rowValues);
    mainRow.alignment = { vertical: 'top', wrapText: true };
    mainRow.eachCell((cell) => {
      cell.border = BORDER_ALL;
    });
    if (rowValues.risk) mainRow.getCell(1).font = { bold: true };

    if (item.hasNumeratorDenominator) {
      const numRow = sheet.addRow({ risk: '', no: '', statement: `(Pembilang) ${item.numeratorLabel || ''}` });
      const denRow = sheet.addRow({ risk: '', no: '', statement: `(Penyebut) ${item.denominatorLabel || ''}` });
      [numRow, denRow].forEach((r) => {
        r.outlineLevel = 1;
        r.hidden = true;
        r.font = { italic: true, color: { argb: 'FF666666' } };
        r.getCell(3).alignment = { indent: 2 };
        r.eachCell((cell) => {
          cell.border = BORDER_ALL;
        });
      });
    }
    lastCategory = item.riskCategory;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `RAS_Tahunan_${year}.xlsx`);
};

export const exportTindakLanjut = async (item) => {
  if (!item) return;
  const data = item;
  const formData = data.tindakLanjut || {};

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Tindak Lanjut');

  worksheet.columns = [
    { header: 'Jenis Risiko', key: 'risk', width: 25 },
    { header: 'Parameter', key: 'param', width: 45 },
    { header: 'Unit', key: 'unit', width: 25 },
    { header: '', key: 'type', width: 15 },
    { header: 'Korektif / Antisipasi', key: 'desc', width: 50 },
    { header: 'Status', key: 'status', width: 20 },
    { header: 'Target', key: 'target', width: 20 },
  ];

  const headerRow = worksheet.getRow(1);
  headerRow.values = ['Jenis Risiko', 'Parameter', 'Unit', '', 'Korektif / Antisipasi', 'Status', 'Target'];
  headerRow.font = { name: 'Calibri', bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E79' } };
  headerRow.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  headerRow.eachCell((cell) => {
    cell.border = BORDER_ALL;
  });

  const startRow = 2;
  worksheet.addRow([data.riskCategory, data.parameter, 'Risk Owner Unit', 'Korektif', formData.korektifOwner || '-', formData.statusKorektifOwner, formData.targetKorektifOwner]);
  worksheet.addRow(['', '', '', 'Antisipasi', formData.antisipasiOwner || '-', formData.statusAntisipasiOwner, formData.targetAntisipasiOwner]);
  worksheet.addRow(['', '', 'Risk Supporting Unit', 'Korektif', formData.korektifSupport || '-', formData.statusKorektifSupport, formData.targetKorektifSupport]);
  worksheet.addRow(['', '', '', 'Antisipasi', formData.antisipasiSupport || '-', formData.statusAntisipasiSupport, formData.targetAntisipasiSupport]);

  worksheet.mergeCells(`A${startRow}:A${startRow + 3}`);
  worksheet.mergeCells(`B${startRow}:B${startRow + 3}`);
  worksheet.mergeCells(`C${startRow}:C${startRow + 1}`);
  worksheet.mergeCells(`C${startRow + 2}:C${startRow + 3}`);

  for (let r = startRow; r <= startRow + 3; r++) {
    const row = worksheet.getRow(r);
    row.font = { name: 'Calibri', size: 11 };
    row.alignment = { vertical: 'middle', wrapText: true };
    row.eachCell((cell, colNum) => {
      cell.border = BORDER_ALL;
      if (colNum === 1 || colNum === 2 || colNum === 3 || colNum === 4 || colNum === 6 || colNum === 7) {
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      } else {
        cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
      }
    });
  }
  worksheet.getCell(`C${startRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEBF8FF' } };
  worksheet.getCell(`C${startRow + 2}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEBFFEB' } };

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `Tindak_Lanjut_${data?.riskCategory}.xlsx`);
};
