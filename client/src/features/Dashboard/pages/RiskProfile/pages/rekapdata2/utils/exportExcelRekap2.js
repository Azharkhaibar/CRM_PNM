// client/src/features/Dashboard/pages/RiskProfile/pages/rekapdata2/utils/exportExcelRekap2.js
import * as XLSX from 'xlsx-js-style';

// === Warna & style helper ===
const hexToARGB = (hex) => {
  const h = hex.replace('#', '').toUpperCase();
  const full =
    h.length === 3
      ? h
          .split('')
          .map((x) => x + x)
          .join('')
      : h;
  return 'FF' + full;
};

const borderThin = {
  top: { style: 'thin', color: { rgb: 'FFBFBFBF' } },
  bottom: { style: 'thin', color: { rgb: 'FFBFBFBF' } },
  left: { style: 'thin', color: { rgb: 'FFBFBFBF' } },
  right: { style: 'thin', color: { rgb: 'FFBFBFBF' } },
};

const headerStyle = (bg, fg = '#FFFFFF') => ({
  fill: { patternType: 'solid', fgColor: { rgb: hexToARGB(bg) } },
  font: { bold: true, color: { rgb: hexToARGB(fg) } },
  alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
  border: borderThin,
});

const bodyStyle = {
  alignment: { vertical: 'center', wrapText: true },
  border: borderThin,
};

const setStyle = (ws, r, c, style) => {
  const addr = XLSX.utils.encode_cell({ r, c });
  if (!ws[addr]) ws[addr] = { t: 's', v: '' };
  ws[addr].s = { ...(ws[addr].s || {}), ...style };
};

const COLORS = {
  headerDarkBlue: '#1f4e79',
  blueFill: '#cfe2f3',
  blueFillLight: '#e6f4ff',
  white: '#ffffff',
  BORDER: 'D1D5DB', // Light Gray Border
  
  // Matrix Rating Colors matching the UI (1 to 5)
  SCORE_1: '2E7D32', // Green
  SCORE_2: '92D050', // Light Green
  SCORE_3: 'FFFF00', // Yellow
  SCORE_4: 'FFC000', // Orange
  SCORE_5: 'FF0000', // Red
  NO_DATA: 'E5E7EB'  // Light Gray
};

const QUARTER_LABEL = {
  Q1: 'MAR',
  Q2: 'JUN',
  Q3: 'SEP',
  Q4: 'DES',
};

const getStyleForScore = (scoreVal) => {
  const score = Math.round(Number(scoreVal));
  if (!score || isNaN(score) || score < 1 || score > 5) {
    return {
      fill: { patternType: 'solid', fgColor: { rgb: hexToARGB(COLORS.NO_DATA) } },
      font: { color: { rgb: hexToARGB('9CA3AF') }, bold: true }
    };
  }

  let color = COLORS.NO_DATA;
  let fgColor = 'FFFFFF';
  
  if (score === 1) { color = COLORS.SCORE_1; fgColor = 'FFFFFF'; }
  else if (score === 2) { color = COLORS.SCORE_2; fgColor = '000000'; }
  else if (score === 3) { color = COLORS.SCORE_3; fgColor = '000000'; }
  else if (score === 4) { color = COLORS.SCORE_4; fgColor = '000000'; }
  else if (score >= 5) { color = COLORS.SCORE_5; fgColor = 'FFFFFF'; }

  return {
    fill: { patternType: 'solid', fgColor: { rgb: hexToARGB(color) } },
    font: { color: { rgb: hexToARGB(fgColor) }, bold: true }
  };
};

/**
 * Helper: Parse value to clean Number for Excel
 */
const toNumberValue = (val) => {
  if (val === '' || val == null) return '';
  if (typeof val === 'number') {
    return isNaN(val) ? '' : val;
  }

  let strVal = String(val).trim();
  if (strVal.indexOf(',') !== -1 && strVal.lastIndexOf(',') > strVal.lastIndexOf('.')) {
    strVal = strVal.replace(/\./g, '').replace(',', '.');
  } else {
    strVal = strVal.replace(/,/g, '');
  }

  const num = parseFloat(strVal);
  return isNaN(num) ? '' : num;
};

/**
 * Helper untuk extract data dengan aman dari berbagai struktur
 */
const extractValue = (obj, keys) => {
  if (!obj) return '';
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
      return obj[key];
    }
    const lowerKey = key.toLowerCase();
    const matchKey = Object.keys(obj).find((k) => k.toLowerCase() === lowerKey);
    if (matchKey && obj[matchKey] !== undefined && obj[matchKey] !== null && obj[matchKey] !== '') {
      return obj[matchKey];
    }
  }
  return '';
};

/**
 * Get the format code string for Excel cells
 */
const getExcelFormatCode = (isPercent, formatOptions) => {
  const { hasilFormat, pemisahFormat } = formatOptions || { hasilFormat: 'smart', pemisahFormat: 'indonesia' };
  
  if (isPercent) {
    if (hasilFormat === 'integer') return '0%';
    if (hasilFormat === '4decimal') return '0.0000%';
    return '0.00%'; // smart
  } else {
    const separator = pemisahFormat === 'indonesia' ? '#,##' : '';
    if (hasilFormat === 'integer') return `${separator}0`;
    if (hasilFormat === '4decimal') return `${separator}0.0000`;
    return `${separator}0.####`; // smart
  }
};

/**
 * Main entry point for exporting Rekap Data 2 to Excel
 */
export function exportRekap2ToExcel({
  viewMode,
  activeTab,
  year,
  quarter,
  dashboardData,
  visibleGroups = [],
  annualGroups = [],
  filters,
  formatOptions = { hasilFormat: 'smart', pemisahFormat: 'indonesia' }
}) {
  const wb = XLSX.utils.book_new();
  const filePrefix = 'REKAP-DATA-2';

  // ==========================================
    // EXPORT DASHBOARD SUMMARY & RISK MATRIX
    // ==========================================
    const rows = dashboardData?.rows || [];
    const skorProfil = dashboardData?.skorProfil || {};

    const monthMap = { Q1: 'Mar', Q2: 'Jun', Q3: 'Sep', Q4: 'Des' };
    const periodStr = `${monthMap[quarter] || quarter}-${String(year).slice(2)}`;

    const scoreToLevel = (score) => {
      const num = Number(score);
      if (isNaN(num) || num <= 0) return null;
      if (num < 1.5) return 1;
      if (num < 2.5) return 2;
      if (num < 3.5) return 3;
      if (num < 4.5) return 4;
      return 5;
    };

    const kpmrLabel = (level) => {
      if (!level || level === 0) return '-';
      if (level === 1) return 'Strong';
      if (level === 2) return 'Satisfactory';
      if (level === 3) return 'Fair';
      if (level === 4) return 'Marginal';
      return 'Unsatisfactory';
    };

    const RISK_LABEL = {
      1: 'Low',
      2: 'Low to Moderate',
      3: 'Moderate',
      4: 'Moderate to High',
      5: 'High',
    };

    const validInherent = scoreToLevel(skorProfil.inherent);
    const validKpmr = scoreToLevel(skorProfil.kpmr);

    const getRowVal = (name, key) => {
      const r = rows.find(item => item.label === name);
      return r ? (r[key] || '-') : '-';
    };

    // Initial AOA Data structure matching side-by-side design
    const wsData = [
      ['LAPORAN REKAP DATA 2 (PROFIL RISIKO)', '', '', '', '', '', '', '', '', '', ''],
      [`Periode: Tahun ${year} - Triwulan ${QUARTER_LABEL[quarter] || quarter}`, '', '', '', '', '', '', '', '', '', ''],
      [], // Empty row (r = 2)
      ['Risk Profile Summary', '', '', '', '', 'RISK MATRIX (Inherent Risk vs KPMR)', '', '', '', '', ''], // r = 3
      ['Jenis Risiko', 'Inherent Risk', 'KPMR', 'Net Risk', '', periodStr, '', '', '', '', ''], // r = 4
      ['Investasi', getRowVal('Investasi', 'inherent'), getRowVal('Investasi', 'kpmr'), getRowVal('Investasi', 'net'), '', 'Risiko Inheren', 'Kualitas Penerapan Manajemen Risiko (KPMR)', '', '', '', ''], // r = 5
      ['Pasar', getRowVal('Pasar', 'inherent'), getRowVal('Pasar', 'kpmr'), getRowVal('Pasar', 'net'), '', '', 'Strong (1)', 'Satisfactory (2)', 'Fair (3)', 'Marginal (4)', 'Unsatisfactory (5)'], // r = 6
      ['Likuiditas', getRowVal('Likuiditas', 'inherent'), getRowVal('Likuiditas', 'kpmr'), getRowVal('Likuiditas', 'net'), '', 'Low (1)', '', '', '', '', ''], // r = 7
      ['Operasional', getRowVal('Operasional', 'inherent'), getRowVal('Operasional', 'kpmr'), getRowVal('Operasional', 'net'), '', 'Low to Moderate (2)', '', '', '', '', ''], // r = 8
      ['Hukum', getRowVal('Hukum', 'inherent'), getRowVal('Hukum', 'kpmr'), getRowVal('Hukum', 'net'), '', 'Moderate (3)', '', '', '', '', ''], // r = 9
      ['Stratejik', getRowVal('Stratejik', 'inherent'), getRowVal('Stratejik', 'kpmr'), getRowVal('Stratejik', 'net'), '', 'Moderate to High (4)', '', '', '', '', ''], // r = 10
      ['Kepatuhan', getRowVal('Kepatuhan', 'inherent'), getRowVal('Kepatuhan', 'kpmr'), getRowVal('Kepatuhan', 'net'), '', 'High (5)', '', '', '', '', ''], // r = 11
      ['Reputasi', getRowVal('Reputasi', 'inherent'), getRowVal('Reputasi', 'kpmr'), getRowVal('Reputasi', 'net'), '', `Posisi risiko saat ini (Inherent: ${skorProfil.inherent || '-'}, KPMR: ${skorProfil.kpmr || '-'})`, '', '', '', '', ''], // r = 12
      ['Skor Profil Risiko', skorProfil.inherent || '-', skorProfil.kpmr || '-', skorProfil.net || '-', '', '', '', '', '', '', ''], // r = 13
      [], // Empty spacing row (r = 14)
      ['Summary Profile Risiko', '', '', '', '', '', '', '', '', '', ''], // r = 15
      ['Inherent Risk', skorProfil.inherent || '-', RISK_LABEL[scoreToLevel(skorProfil.inherent)] || '-', '', '', '', '', '', '', '', ''], // r = 16
      ['KPMR', skorProfil.kpmr || '-', kpmrLabel(scoreToLevel(skorProfil.kpmr)) || '-', '', '', '', '', '', '', '', ''], // r = 17
      ['Net Risk', skorProfil.net || '-', RISK_LABEL[scoreToLevel(skorProfil.net)] || '-', '', '', '', '', '', '', '', ''] // r = 18
    ];

    const matrixValues = {
      '1,1': 1, '1,2': 1, '1,3': 2, '1,4': 3, '1,5': 3,
      '2,1': 1, '2,2': 2, '2,3': 2, '2,4': 3, '2,5': 4,
      '3,1': 2, '3,2': 2, '3,3': 3, '3,4': 4, '3,5': 4,
      '4,1': 2, '4,2': 3, '4,3': 4, '4,4': 4, '4,5': 5,
      '5,1': 3, '5,2': 3, '5,3': 4, '5,4': 5, '5,5': 5,
    };

    // Populate matrix values
    for (let inherentRowVal = 1; inherentRowVal <= 5; inherentRowVal++) {
      const rowIndex = 6 + inherentRowVal; // Row 7 is Low (1), up to Row 11 High (5)
      for (let kpmrColVal = 1; kpmrColVal <= 5; kpmrColVal++) {
        const colIndex = 5 + kpmrColVal; // Col 6 (G) is Strong (1), up to Col 10 Unsatisfactory (5)
        const val = matrixValues[`${inherentRowVal},${kpmrColVal}`];
        const isActive = (validInherent === inherentRowVal && validKpmr === kpmrColVal);
        wsData[rowIndex][colIndex] = isActive ? `● ${val}` : val;
      }
    }

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Define all merges
    ws['!merges'] = [
      // Title info merges
      { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } },
      // Risk Profile Summary title merge
      { s: { r: 3, c: 0 }, e: { r: 3, c: 3 } },
      // Risk Matrix title merge
      { s: { r: 3, c: 5 }, e: { r: 3, c: 10 } },
      // Risk Matrix Period merge (Brown Bar)
      { s: { r: 4, c: 5 }, e: { r: 4, c: 10 } },
      // Inherent Risk matrix side-header merge (vertical)
      { s: { r: 5, c: 5 }, e: { r: 6, c: 5 } },
      // KPMR matrix top-header merge (horizontal)
      { s: { r: 5, c: 6 }, e: { r: 5, c: 10 } },
      // Matrix footer position description merge
      { s: { r: 12, c: 5 }, e: { r: 12, c: 10 } },
      // Summary Cards header merge
      { s: { r: 15, c: 0 }, e: { r: 15, c: 2 } }
    ];

    // Colors mapping
    const matrixCellColors = {
      1: '2E7D32', // Green
      2: '92D050', // Light Green
      3: 'FFFF00', // Yellow
      4: 'FFC000', // Orange
      5: 'FF0000', // Red
    };

    const borderMediumBlack = {
      top: { style: 'medium', color: { rgb: '000000' } },
      bottom: { style: 'medium', color: { rgb: '000000' } },
      left: { style: 'medium', color: { rgb: '000000' } },
      right: { style: 'medium', color: { rgb: '000000' } }
    };

    const borderActiveMediumBlack = {
      top: { style: 'double', color: { rgb: '000000' } },
      bottom: { style: 'double', color: { rgb: '000000' } },
      left: { style: 'double', color: { rgb: '000000' } },
      right: { style: 'double', color: { rgb: '000000' } }
    };

    const borderThinObj = {
      top: { style: 'thin', color: { rgb: COLORS.BORDER } },
      bottom: { style: 'thin', color: { rgb: COLORS.BORDER } },
      left: { style: 'thin', color: { rgb: COLORS.BORDER } },
      right: { style: 'thin', color: { rgb: COLORS.BORDER } }
    };

    const totalRows = wsData.length;

    // Apply styles to cells
    for (let r = 0; r < totalRows; r++) {
      for (let c = 0; c < 11; c++) {
        const cellRef = XLSX.utils.encode_cell({ r, c });
        const cell = ws[cellRef];
        if (!cell) continue;

        // Default cell layout styles
        cell.s = cell.s || {};

        // Sheet Header Info
        if (r === 0) {
          cell.s = {
            font: { bold: true, size: 14, color: { rgb: '1F4E79' } },
            alignment: { horizontal: 'left' }
          };
          continue;
        }
        if (r === 1) {
          cell.s = {
            font: { italic: true, size: 10, color: { rgb: '4B5563' } },
            alignment: { horizontal: 'left' }
          };
          continue;
        }
        if (r === 2) continue;

        // Left Table Header Title / Matrix Title
        if (r === 3) {
          if (c >= 0 && c <= 3) {
            cell.s = {
              fill: { patternType: 'solid', fgColor: { rgb: '1E3A8A' } },
              font: { color: { rgb: 'FFFFFF' }, bold: true },
              alignment: { horizontal: 'center', vertical: 'center' }
            };
          } else if (c >= 5 && c <= 10) {
            cell.s = {
              fill: { patternType: 'solid', fgColor: { rgb: '1E3A8A' } },
              font: { color: { rgb: 'FFFFFF' }, bold: true },
              alignment: { horizontal: 'center', vertical: 'center' }
            };
          }
          continue;
        }

        // Left Table Columns Headers / Matrix Period Header
        if (r === 4) {
          if (c >= 0 && c <= 3) {
            cell.s = {
              fill: { patternType: 'solid', fgColor: { rgb: '1F4E79' } },
              font: { color: { rgb: 'FFFFFF' }, bold: true },
              alignment: { horizontal: 'center', vertical: 'center' },
              border: borderThinObj
            };
          } else if (c >= 5 && c <= 10) {
            cell.s = {
              fill: { patternType: 'solid', fgColor: { rgb: '7A2A2A' } },
              font: { color: { rgb: 'FFFFFF' }, bold: true },
              alignment: { horizontal: 'center', vertical: 'center' },
              border: borderMediumBlack
            };
          }
          continue;
        }

        // Matrix Header Rows (r = 5, 6)
        if (r === 5 && c >= 5 && c <= 10) {
          cell.s = {
            fill: { patternType: 'solid', fgColor: { rgb: '0070C0' } },
            font: { color: { rgb: 'FFFFFF' }, bold: true },
            alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
            border: borderMediumBlack
          };
          continue;
        }
        if (r === 6 && c >= 5 && c <= 10) {
          const bg = c === 5 ? '0070C0' : 'F2F2F2';
          const fg = c === 5 ? 'FFFFFF' : '000000';
          cell.s = {
            fill: { patternType: 'solid', fgColor: { rgb: bg } },
            font: { color: { rgb: fg }, bold: true },
            alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
            border: borderMediumBlack
          };
          continue;
        }

        // Left Table Rows (r >= 5 && r <= 12)
        if (c >= 0 && c <= 3 && r >= 5 && r <= 12) {
          const isAlt = (r - 5) % 2 === 1;
          const defaultBg = isAlt ? 'F9FAFB' : 'FFFFFF';
          
          cell.s = {
            fill: { patternType: 'solid', fgColor: { rgb: hexToARGB(defaultBg) } },
            alignment: { vertical: 'center' },
            border: borderThinObj
          };

          if (c === 0) {
            cell.s.alignment.horizontal = 'left';
            cell.s.font = { bold: true };
          } else {
            const val = cell.v;
            cell.s = {
              ...getStyleForScore(val),
              alignment: { horizontal: 'center', vertical: 'center' },
              border: borderThinObj
            };
            if (typeof cell.v === 'number') {
              cell.t = 'n';
              cell.z = '0'; // Integer format as in UI
            }
          }
        }

        // Left Table Footer Row (r === 13)
        if (r === 13 && c >= 0 && c <= 3) {
          if (c === 0) {
            cell.s = {
              fill: { patternType: 'solid', fgColor: { rgb: hexToARGB('E26C09') } }, // Classic Orange Fill
              font: { color: { rgb: 'FFFFFFFF' }, bold: true },
              alignment: { horizontal: 'left', vertical: 'center' },
              border: borderThinObj
            };
          } else {
            const val = c === 1 ? skorProfil.inherent : (c === 2 ? skorProfil.kpmr : skorProfil.net);
            cell.s = {
              ...getStyleForScore(val),
              alignment: { horizontal: 'center', vertical: 'center' },
              border: borderThinObj
            };
            if (typeof cell.v === 'number') {
              cell.t = 'n';
              cell.z = '0'; // Integer format as in UI
            }
          }
        }

        // Matrix Data Rows (r >= 7 && r <= 11)
        if (r >= 7 && r <= 11 && c >= 5 && c <= 10) {
          if (c === 5) {
            // Row Label ("Low (1)", etc.)
            cell.s = {
              fill: { patternType: 'solid', fgColor: { rgb: 'D9D9D9' } },
              font: { color: { rgb: '000000' }, bold: true },
              alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
              border: borderMediumBlack
            };
          } else {
            // Matrix Numeric cells
            const strVal = cell.v.toString();
            const isActive = strVal.includes('●');
            const rating = parseInt(strVal.replace('● ', ''));
            const bgColor = matrixCellColors[rating] || 'FFFFFF';
            const fgColor = (rating === 1 || rating === 5) ? 'FFFFFF' : '000000';

            cell.s = {
              fill: { patternType: 'solid', fgColor: { rgb: hexToARGB(bgColor) } },
              font: { color: { rgb: hexToARGB(fgColor) }, bold: true, size: isActive ? 12 : 11 },
              alignment: { horizontal: 'center', vertical: 'center' },
              border: isActive ? borderActiveMediumBlack : borderMediumBlack
            };
          }
        }

        // Matrix Position description footer row (r === 12, cols F-K)
        if (r === 12 && c >= 5 && c <= 10) {
          cell.s = {
            font: { bold: true, color: { rgb: '1E3A8A' }, size: 10 },
            alignment: { horizontal: 'left', vertical: 'center' }
          };
        }

        // Summary Profile Risiko Title Row (r === 15)
        if (r === 15 && c >= 0 && c <= 2) {
          cell.s = {
            fill: { patternType: 'solid', fgColor: { rgb: '1E3A8A' } },
            font: { color: { rgb: 'FFFFFF' }, bold: true },
            alignment: { horizontal: 'left', vertical: 'center' }
          };
        }

        // Summary Cards Rows (r >= 16 && r <= 18)
        if (r >= 16 && r <= 18 && c >= 0 && c <= 2) {
          cell.s = {
            alignment: { vertical: 'center' },
            border: borderThinObj
          };

          if (c === 0) {
            cell.s.font = { bold: true };
            cell.s.alignment.horizontal = 'left';
          } else if (c === 1) {
            cell.s.alignment.horizontal = 'center';
            if (typeof cell.v === 'number') {
              cell.t = 'n';
              cell.z = '0.00';
            }
          } else if (c === 2) {
            const scoreVal = wsData[r][1];
            cell.s = {
              ...getStyleForScore(scoreVal),
              alignment: { horizontal: 'center', vertical: 'center' },
              border: borderThinObj
            };
          }
        }
      }
    }

    // Set Column Widths
    ws['!cols'] = [
      { wch: 22 }, // Col A: Jenis Risiko
      { wch: 15 }, // Col B: Inherent
      { wch: 15 }, // Col C: KPMR
      { wch: 15 }, // Col D: Net Risk
      { wch: 4 },  // Col E: Spacer
      { wch: 22 }, // Col F: Risiko Inheren labels
      { wch: 14 }, // Col G: Strong (1)
      { wch: 14 }, // Col H: Satisfactory (2)
      { wch: 14 }, // Col I: Fair (3)
      { wch: 14 }, // Col J: Marginal (4)
      { wch: 14 }  // Col K: Unsatisfactory (5)
    ];

    // Set Row Heights for spacing and alignment (making the matrix cells look like the UI)
    ws['!rows'] = [
      { hpt: 26 }, // Row 0: Title
      { hpt: 18 }, // Row 1: Subtitle
      { hpt: 10 }, // Row 2: Spacer
      { hpt: 24 }, // Row 3: Section Headers
      { hpt: 24 }, // Row 4: Column Headers / Period brown bar
      { hpt: 20 }, // Row 5: Column Headers / KPMR Headers
      { hpt: 22 }, // Row 6: Investasi / Column Labels
      { hpt: 35 }, // Row 7: Pasar / Matrix Row 1
      { hpt: 35 }, // Row 8: Likuiditas / Matrix Row 2
      { hpt: 35 }, // Row 9: Operasional / Matrix Row 3
      { hpt: 35 }, // Row 10: Hukum / Matrix Row 4
      { hpt: 35 }, // Row 11: Stratejik / Matrix Row 5
      { hpt: 25 }, // Row 12: Kepatuhan / Matrix Position Description
      { hpt: 22 }, // Row 13: Reputasi
      { hpt: 22 }, // Row 14: Skor Profil Risiko
      { hpt: 15 }, // Row 15: Spacer
      { hpt: 24 }, // Row 16: Summary Profile Risiko Title
      { hpt: 22 }, // Row 17: Inherent Risk
      { hpt: 22 }, // Row 18: KPMR
      { hpt: 22 }, // Row 19: Net Risk
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Rekap Data 2');
    XLSX.writeFile(wb, `${filePrefix}-DASHBOARD-${quarter}-${year}.xlsx`);
}
