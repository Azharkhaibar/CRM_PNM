import { saveAs } from 'file-saver';
import { calculateRasValue, formatRasDisplayValue, getMonthName } from './rasUtils.js';
import ExcelJS from 'exceljs'; 

// --- HELPER: Formatting Data ---
const getFormattedValue = (val, unit) => {
  if (val === null || val === undefined || val === '') return '-';
  return formatRasDisplayValue(val, unit);
};

// --- HELPER: Get Historical Data ---
const getHistoricalItem = (allData, currentItem, targetYear) => {
  if (!allData) return null;
  if (currentItem.groupId) {
      const found = allData.find(d => d.year === targetYear && d.groupId === currentItem.groupId);
      if (found) return found;
  }
  return allData.find(d => 
    d.year === targetYear && 
    d.riskCategory === currentItem.riskCategory && 
    d.no === currentItem.no
  );
};

// --- HELPER: Calculate Stats ---
const calculateStats = (allData, currentItem, currentYear) => {
    const yearsToCheck = [currentYear - 3, currentYear - 2, currentYear - 1];
    let allValues = [];

    yearsToCheck.forEach(y => {
      const histItem = getHistoricalItem(allData, currentItem, y);
      if (histItem && histItem.monthlyValues) {
        Object.values(histItem.monthlyValues).forEach(mVal => {
          const val = calculateRasValue(mVal.num, mVal.den, histItem.unitType, mVal.man);
          if (val !== null && val !== undefined && val !== '') {
            allValues.push(parseFloat(val));
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
        const squareDiffs = allValues.map(v => Math.pow(v - avg, 2));
        const sumSquareDiff = squareDiffs.reduce((a, b) => a + b, 0);
        stdev = Math.sqrt(sumSquareDiff / (N - 1));
    }

    return { 
        avg, stdev, min, max, 
        avg_min_1sd: avg - stdev, 
        avg_plus_1sd: avg + stdev, 
        avg_plus_2sd: avg + (2 * stdev), 
        avg_plus_3sd: avg + (3 * stdev) 
    };
};

// --- STYLE GENERATORS ---
const getFontMain = (isBold = false, isItalic = false, colorHex = 'FF000000') => ({
    name: 'Aptos Narrow',
    size: 11,
    bold: isBold,
    italic: isItalic,
    color: { argb: colorHex }
});

const getFontHeader = (colorHex = 'FF000000', size = 16) => ({
    name: 'Aptos Narrow',
    size: size,
    bold: true,
    color: { argb: colorHex }
});

const getFill = (colorHex) => ({
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: colorHex }
});

const COLORS = {
    // Colors for Monthly
    HEADER_MAIN: 'FFFFC000',
    HEADER_RKAP: 'FF002060',
    HEADER_MONTH: 'FFC0E6F5',
    CELL_GENERAL: 'FFDAE9F8',
    CELL_TARGET: 'FFF1A983',
    CELL_NOTES: 'FF83CCEB',
    CELL_ALERT: 'FFFBE2D5',
    
    // Colors for Yearly (New Logic)
    YEARLY_TITLE_BG: 'FF0070C0', // Blue Title
    YEARLY_RKAP_HEADER: 'FFFFFF00', // Yellow
    YEARLY_RAS_HEADER: 'FFFFC000', // Orange
    YEARLY_RAS_SUB: 'FF66CCFF', // Light Blue
    YEARLY_STAT_BG: 'FFDDEBF7', // Very Light Blue
    YEARLY_STAT_SUB_BG: 'FFE2EFDA', // Very Light Green
    
    YEARLY_CELL_N: 'FFFFFFFF', // White (Year n)
    YEARLY_CELL_N_PLUS_1: 'FF99FFCC', // Light Green (Year n+1)

    CELL_WHITE: 'FFFFFFFF',
    TEXT_BLACK: 'FF000000',
    TEXT_WHITE: 'FFFFFFFF'
};

const BORDER_ALL = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
const ALIGN_CENTER = { horizontal: 'center', vertical: 'middle', wrapText: true };
const ALIGN_LEFT = { horizontal: 'left', vertical: 'middle', wrapText: true };

const STANCE_CONFIG = {
    'Strategis': { bg: 'FF3C7D22', fontColor: COLORS.TEXT_WHITE, bold: true },
    'Moderat': { bg: 'FF92D050', fontColor: COLORS.TEXT_BLACK, bold: true },
    'Konservatif': { bg: 'FFFFFF00', fontColor: COLORS.TEXT_BLACK, bold: true },
    'Tidak Toleran': { bg: 'FFFF0000', fontColor: COLORS.TEXT_WHITE, bold: true }
};

// ==========================================
// EXPORT 1: RAS BULANAN (MONTHLY)
// ==========================================
export const exportRasMonthly = async (rows, year, selectedMonths) => {
  if (!rows || rows.length === 0) return alert("Tidak ada data untuk diexport");

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('RAS Bulanan', { views: [{ state: 'normal' }] });

  // 1. SETUP COLUMNS
  const columns = [
    { key: 'risk', width: 25 },
    { key: 'no', width: 8 },
    { key: 'param', width: 50, style: { alignment: { wrapText: true, vertical: 'middle', horizontal: 'left' } } },
    { key: 'rkap', width: 20 },
    { key: 'dataType', width: 25, outlineLevel: 1 }, 
    { key: 'limit', width: 20 },
    { key: 'stance', width: 25 },
    { key: 'statement', width: 60, outlineLevel: 1, style: { alignment: { wrapText: true, vertical: 'middle', horizontal: 'left' } } },
    { key: 'notes', width: 35, outlineLevel: 1 }
  ];
  selectedMonths.forEach(mIdx => {
      columns.push({ key: `m_${mIdx}`, width: 20 });
  });
  sheet.columns = columns;

  // 2. BUILD HEADERS
  const row1 = sheet.getRow(1);
  const row2 = sheet.getRow(2);
  row1.height = 20.30;
  row2.height = 38.20;

  // Values
  sheet.getCell('A1').value = 'Risiko';
  sheet.getCell('B1').value = 'No';
  sheet.getCell('C1').value = 'Parameter';
  sheet.getCell('D1').value = `RKAP ${year}`;
  sheet.getCell('E1').value = 'Penjelasan Tipe Data';
  sheet.getCell('F1').value = `RAS ${year}`;
  sheet.getCell('I1').value = 'Keterangan';
  sheet.getCell('F2').value = 'Limit';
  sheet.getCell('G2').value = 'Sikap Thd Risiko';
  sheet.getCell('H2').value = 'Statement';

  selectedMonths.forEach((mIdx, i) => {
      sheet.getCell(1, 10 + i).value = getMonthName(mIdx);
  });

  // Header Merges
  sheet.mergeCells('A1:A2');
  sheet.mergeCells('B1:B2');
  sheet.mergeCells('C1:C2');
  sheet.mergeCells('D1:D2');
  sheet.mergeCells('E1:E2');
  sheet.mergeCells('F1:H1');
  sheet.mergeCells('I1:I2');
  selectedMonths.forEach((_, i) => {
      const colIdx = 10 + i;
      sheet.mergeCells(1, colIdx, 2, colIdx); 
  });

  // Header Styles
  const totalCols = 9 + selectedMonths.length;
  for (let r = 1; r <= 2; r++) {
      for (let c = 1; c <= totalCols; c++) {
          const cell = sheet.getCell(r, c);
          cell.border = BORDER_ALL;
          cell.alignment = ALIGN_CENTER;
          if (c === 4) { 
              cell.fill = getFill(COLORS.HEADER_RKAP);
              cell.font = getFontHeader(COLORS.TEXT_WHITE);
          } else if (c >= 10) { 
              cell.fill = getFill(COLORS.HEADER_MONTH);
              cell.font = getFontHeader(COLORS.TEXT_BLACK);
          } else {
              cell.fill = getFill(COLORS.HEADER_MAIN);
              cell.font = getFontHeader(COLORS.TEXT_BLACK);
          }
      }
  }

  // 3. DATA ROWS
  // SORTING: Updated to sort ONLY by No
  const sortedRows = [...rows].sort((a, b) => {
      const noA = a.no ? Number(a.no) : Number.MAX_SAFE_INTEGER;
      const noB = b.no ? Number(b.no) : Number.MAX_SAFE_INTEGER;
      return noA - noB;
  });

  for (let i = 0; i < sortedRows.length; i++) {
    const item = sortedRows[i];
    
    // --- ROW DATA GENERATION ---
    const rowValues = [];
    rowValues[1] = item.riskCategory; 
    rowValues[2] = item.no;
    rowValues[3] = item.parameter;
    rowValues[4] = getFormattedValue(item.rkapTarget, item.unitType);
    rowValues[5] = item.dataTypeExplanation;
    rowValues[6] = getFormattedValue(item.rasLimit, item.unitType);
    rowValues[7] = item.riskStance;
    rowValues[8] = item.statement;
    rowValues[9] = item.notes;

    selectedMonths.forEach((mIdx, monthI) => {
        const mVal = item.monthlyValues?.[mIdx];
        const val = calculateRasValue(mVal?.num, mVal?.den, item.unitType, mVal?.man);
        rowValues[10 + monthI] = getFormattedValue(val, item.unitType);
    });

    const mainRow = sheet.addRow(rowValues);
    const mainRowNum = mainRow.number;

    // --- MAIN ROW STYLING ---
    mainRow.eachCell({ includeEmpty: true }, (cell, colNum) => {
        cell.font = getFontMain(false, false); 
        cell.border = BORDER_ALL;
        
        // Alignment
        if (colNum === 3 || colNum === 8) {
             cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
        } else {
             cell.alignment = ALIGN_CENTER;
        }

        // Colors
        if (colNum === 4 || colNum === 6) cell.fill = getFill(COLORS.CELL_TARGET);
        else if (colNum === 9) cell.fill = getFill(COLORS.CELL_NOTES);
        else if (colNum === 7) { 
            const conf = STANCE_CONFIG[item.riskStance];
            if (conf) {
                cell.fill = getFill(conf.bg);
                cell.font = getFontMain(conf.bold, false, conf.fontColor);
            } else cell.fill = getFill(COLORS.CELL_GENERAL);
        } else if (colNum >= 10) { 
            const mIdx = selectedMonths[colNum - 10];
            const mVal = item.monthlyValues?.[mIdx];
            const rawVal = calculateRasValue(mVal?.num, mVal?.den, item.unitType, mVal?.man);
            const limitVal = parseFloat(item.rasLimit);
            cell.fill = getFill(COLORS.CELL_GENERAL);
            if (rawVal !== null && !isNaN(rawVal) && !isNaN(limitVal)) {
                if (limitVal > rawVal) cell.fill = getFill(COLORS.CELL_ALERT);
            }
        } else {
            cell.fill = getFill(COLORS.CELL_GENERAL);
        }
    });

    if (rowValues[1]) mainRow.getCell(1).font = getFontMain(true, false); // Bold Risk

    // --- SUB ROWS HANDLING ---
    if (item.hasNumeratorDenominator) {
        const numRowValues = [];
        numRowValues[3] = `${item.numeratorLabel || ''}`; 
        const denRowValues = [];
        denRowValues[3] = `${item.denominatorLabel || ''}`; 

        selectedMonths.forEach((mIdx, monthI) => {
            const mVal = item.monthlyValues?.[mIdx];
            numRowValues[10 + monthI] = mVal?.num || '-';
            denRowValues[10 + monthI] = mVal?.den || '-';
        });

        const numRow = sheet.addRow(numRowValues);
        const denRow = sheet.addRow(denRowValues);
        
        // Style Sub Rows
        [numRow, denRow].forEach(r => {
            r.outlineLevel = 1;
            r.hidden = true;
            r.eachCell({ includeEmpty: true }, (cell, colNum) => {
                cell.border = BORDER_ALL;
                cell.font = getFontMain(false, true); // Italic
                
                if (colNum === 3) {
                    cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 2 };
                } else {
                    cell.alignment = ALIGN_CENTER;
                }
                
                if (colNum === 3 || colNum >= 10) cell.fill = getFill(COLORS.CELL_WHITE);
            });
        });

        // Simple Vertical Merge for Labels
        const colsToMerge = [2, 4, 5, 6, 7, 8, 9];
        colsToMerge.forEach(c => {
            const colChar = sheet.getColumn(c).letter;
            sheet.mergeCells(`${colChar}${mainRowNum}:${colChar}${denRow.number}`);
        });
    }
  }

  sheet.properties.outlineProperties = { summaryBelow: false, summaryRight: true };
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `RAS_Bulanan_${year}.xlsx`);
};

// ==========================================
// EXPORT 2: RAS TAHUNAN (YEARLY) - REVISED
// ==========================================
export const exportRasYearly = async (rows, year, allData) => {
  if (!rows || rows.length === 0) return alert("Tidak ada data untuk diexport");

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('RAS Tahunan', { views: [{ state: 'normal' }] }); 

  // --- 1. SETUP COLUMNS & WIDTHS ---
  const columns = [
    { key: 'risk', width: 25 },
    { key: 'no', width: 8 },
    { key: 'statement', width: 50, style: { alignment: { wrapText: true, horizontal: 'left', vertical: 'middle' } } },
    { key: 'formulasi', width: 40 },
    { key: 'dataType', width: 20 },
    
    // History X-2
    { key: `rkap_${year-2}`, width: 15 },
    { key: `ras_${year-2}`, width: 15 },
    // History X-1
    { key: `rkap_${year-1}`, width: 15 },
    { key: `ras_${year-1}`, width: 15 },

    // Stats
    { key: 'avg', width: 12, outlineLevel: 1, hidden: true },
    { key: 'stdev', width: 12, outlineLevel: 1, hidden: true },
    { key: 'avg_min1', width: 12, outlineLevel: 1, hidden: true },
    { key: 'avg_plus1', width: 12, outlineLevel: 1, hidden: true },
    { key: 'avg_plus2', width: 12, outlineLevel: 1, hidden: true },
    { key: 'avg_plus3', width: 12, outlineLevel: 1, hidden: true },
    { key: 'min', width: 12, outlineLevel: 1, hidden: true },
    { key: 'max', width: 12, outlineLevel: 1, hidden: true },

    // Current Year
    { key: `rkap_${year}`, width: 15 },
    { key: `ras_${year}`, width: 15 },
  ];

  sheet.columns = columns;

  // --- 2. BUILD HEADER (TITLE & COLUMNS) ---
  // Row 1 & 2: Titles
  const titleRow1 = sheet.getRow(1);
  titleRow1.height = 24.80;
  sheet.mergeCells('A1:S1'); // Merge across all columns roughly
  const titleCell1 = sheet.getCell('A1');
  titleCell1.value = 'RISK APPETITE STATEMENT (RAS)';
  titleCell1.fill = getFill(COLORS.YEARLY_TITLE_BG);
  titleCell1.font = getFontHeader(COLORS.TEXT_WHITE, 18);
  titleCell1.alignment = ALIGN_CENTER;

  const titleRow2 = sheet.getRow(2);
  titleRow2.height = 30.00;
  sheet.mergeCells('A2:S2');
  const titleCell2 = sheet.getCell('A2');
  titleCell2.value = `PT PNM INVESTMENT MANAGEMENT - ${year}`;
  titleCell2.fill = getFill(COLORS.YEARLY_TITLE_BG);
  titleCell2.font = getFontHeader(COLORS.TEXT_WHITE, 16);
  titleCell2.alignment = ALIGN_CENTER;

  // Row 3: Column Headers (Starts at index 3)
  const headerRow = sheet.getRow(3);
  headerRow.height = 40; // Default header height

  const headerValues = [
      'Jenis Risiko', 'No', 'Statement', 'Formulasi', 'Tipe Data',
      `RKAP ${year-2}`, `RAS ${year-2}`, // F, G
      `RKAP ${year-1}`, `RAS ${year-1}`, // H, I
      'AVG 3Y', 'STDEV', 'AVG-1SD', 'AVG+1SD', 'AVG+2SD', 'AVG+3SD', 'MIN', 'MAX', // J-Q
      `RKAP ${year}`, `RAS ${year}` // R, S
  ];
  
  // Assign values manually due to exceljs quirks with getRow and array
  headerValues.forEach((val, idx) => {
      const colIdx = idx + 1;
      const cell = sheet.getCell(3, colIdx);
      cell.value = val;
      cell.border = BORDER_ALL;
      cell.alignment = ALIGN_CENTER;
      cell.font = getFontHeader(COLORS.TEXT_BLACK, 12); // Slightly smaller header for table

      // Color Logic for Headers
      if (val.includes('RKAP')) {
          cell.fill = getFill(COLORS.YEARLY_RKAP_HEADER); // Yellow
      } else if (val.includes('RAS')) {
          cell.fill = getFill(COLORS.YEARLY_RAS_HEADER); // Orange
      } else if (['AVG', 'STDEV', 'MIN', 'MAX'].some(k => val.includes(k))) {
          cell.fill = getFill(COLORS.YEARLY_STAT_BG); // Light Blue Stat
      } else {
          cell.fill = getFill(COLORS.YEARLY_TITLE_BG); // Blue for General
          cell.font = getFontHeader(COLORS.TEXT_WHITE, 12);
      }
  });

  // --- 3. DATA ROWS ---
  // SORTING: By No Only
  const sortedRows = [...rows].sort((a, b) => {
      const noA = a.no ? Number(a.no) : Number.MAX_SAFE_INTEGER;
      const noB = b.no ? Number(b.no) : Number.MAX_SAFE_INTEGER;
      return noA - noB;
  });

  sortedRows.forEach((item, index) => {
    const histYear2 = getHistoricalItem(allData, item, year - 2);
    const histYear1 = getHistoricalItem(allData, item, year - 1);
    const stats = calculateStats(allData, item, year);

    const rowValues = [];
    rowValues[1] = item.riskCategory;
    rowValues[2] = item.no;
    rowValues[3] = item.parameter; // Statement = Parameter
    rowValues[4] = item.formulasi || '-';
    rowValues[5] = item.dataTypeExplanation;
    
    // History
    rowValues[6] = getFormattedValue(histYear2?.rkapTarget, item.unitType);
    rowValues[7] = getFormattedValue(histYear2?.rasLimit, item.unitType);
    rowValues[8] = getFormattedValue(histYear1?.rkapTarget, item.unitType);
    rowValues[9] = getFormattedValue(histYear1?.rasLimit, item.unitType);
    
    // Stats
    rowValues[10] = stats ? getFormattedValue(stats.avg, item.unitType) : '-';
    rowValues[11] = stats ? getFormattedValue(stats.stdev, item.unitType) : '-';
    rowValues[12] = stats ? getFormattedValue(stats.avg_min_1sd, item.unitType) : '-';
    rowValues[13] = stats ? getFormattedValue(stats.avg_plus_1sd, item.unitType) : '-';
    rowValues[14] = stats ? getFormattedValue(stats.avg_plus_2sd, item.unitType) : '-';
    rowValues[15] = stats ? getFormattedValue(stats.avg_plus_3sd, item.unitType) : '-';
    rowValues[16] = stats ? getFormattedValue(stats.min, item.unitType) : '-';
    rowValues[17] = stats ? getFormattedValue(stats.max, item.unitType) : '-';
    
    // Current
    rowValues[18] = getFormattedValue(item.rkapTarget, item.unitType);
    rowValues[19] = getFormattedValue(item.rasLimit, item.unitType);

    const mainRow = sheet.addRow(rowValues);
    
    // Logic Alternate Color based on Year [n] logic from user request is vague
    // "cell isi [n] warna putih, cell isi [n+1] warna #99FFCC"
    // I interpret this as Columns related to [n] vs [n+1], but likely refers to History Years?
    // Let's apply specific background logic requested.
    
    // Base Color for Main Row
    const baseColor = COLORS.YEARLY_CELL_N; // White default

    mainRow.eachCell({ includeEmpty: true }, (cell, colNum) => {
        cell.font = getFontMain(false, false);
        cell.border = BORDER_ALL;
        
        // Alignment
        if (colNum === 3) { // Statement / Param
             cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
        } else {
             cell.alignment = ALIGN_CENTER;
        }

        // Coloring Logic
        // History X-2 (Year n) -> White?
        // History X-1 (Year n+1) -> Green?
        // Let's assume X-2 is n (2023), X-1 is n+1 (2024)
        if (colNum === 6 || colNum === 7) { // X-2
             cell.fill = getFill(COLORS.YEARLY_CELL_N);
        } else if (colNum === 8 || colNum === 9) { // X-1
             cell.fill = getFill(COLORS.YEARLY_CELL_N_PLUS_1); // Green
        } else if (colNum >= 10 && colNum <= 17) { // Stats
             cell.fill = getFill(COLORS.YEARLY_STAT_BG); // Light Blue
        } else if (colNum === 19) { // RAS Current
             cell.fill = getFill(COLORS.YEARLY_RAS_SUB); // Light Blue for RAS content
        } else {
             cell.fill = getFill(baseColor);
        }
    });

    // Sub Rows
    if (item.hasNumeratorDenominator) {
        const numRowValues = [];
        numRowValues[3] = `${item.numeratorLabel || ''}`;
        const denRowValues = [];
        denRowValues[3] = `${item.denominatorLabel || ''}`;

        const numRow = sheet.addRow(numRowValues);
        const denRow = sheet.addRow(denRowValues);

        [numRow, denRow].forEach(r => {
            r.outlineLevel = 1;
            r.hidden = true;
            r.eachCell({ includeEmpty: true }, (cell, colNum) => {
                cell.border = BORDER_ALL;
                cell.font = getFontMain(false, true);
                
                if (colNum === 3) {
                    cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 2 };
                } else {
                    cell.alignment = ALIGN_CENTER;
                }

                // Stats coloring for sub rows
                if (colNum >= 10 && colNum <= 17) {
                    cell.fill = getFill(COLORS.YEARLY_STAT_SUB_BG); // Greenish for stats sub
                } else {
                    cell.fill = getFill(COLORS.CELL_WHITE);
                }
            });
        });
        
        // Merge Main Columns
        // Merge: Risk, No, Formulasi, DataType, History, Current
        const colsToMerge = [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
        colsToMerge.forEach(c => {
            const colChar = sheet.getColumn(c).letter;
            sheet.mergeCells(`${colChar}${mainRow.number}:${colChar}${denRow.number}`);
        });
    }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `RAS_Tahunan_${year}.xlsx`);
};

// ==========================================
// EXPORT 3: Tindak Lanjut
// ==========================================

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
    headerRow.eachCell((cell) => { cell.border = BORDER_ALL; });

    const startRow = 2;
    worksheet.addRow([data.riskCategory, data.parameter, 'Risk Owner Unit', 'Korektif', formData.korektifOwner || '-', formData.statusKorektifOwner, formData.targetKorektifOwner]);
    worksheet.addRow(['', '', '', 'Antisipasi', formData.antisipasiOwner || '-', formData.statusAntisipasiOwner, formData.targetAntisipasiOwner]);
    worksheet.addRow(['', '', 'Risk Supporting Unit', 'Korektif', formData.korektifSupport || '-', formData.statusKorektifSupport, formData.targetKorektifSupport]);
    worksheet.addRow(['', '', '', 'Antisipasi', formData.antisipasiSupport || '-', formData.statusAntisipasiSupport, formData.targetAntisipasiSupport]);

    worksheet.mergeCells(`A${startRow}:A${startRow+3}`);
    worksheet.mergeCells(`B${startRow}:B${startRow+3}`);
    worksheet.mergeCells(`C${startRow}:C${startRow+1}`);
    worksheet.mergeCells(`C${startRow+2}:C${startRow+3}`);

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
    worksheet.getCell(`C${startRow+2}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEBFFEB' } }; 

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Tindak_Lanjut_${data?.riskCategory}.xlsx`);
};  