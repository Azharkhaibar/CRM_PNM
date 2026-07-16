import * as XLSX from 'xlsx-js-style';

/**
 * Export Rekap Data 2 OJK to Excel
 * 
 * @param {Object} params
 * @param {Array} params.tableData
 * @param {Object} params.footerDisplay
 * @param {number} params.year
 * @param {number|string} params.quarter
 */
export function exportRekap2ToExcel({ tableData = [], footerDisplay, year, quarter }) {
  const wb = XLSX.utils.book_new();

  // Color Palette
  const COLORS = {
    HEADER_BG: '1F4E79', // Dark Blue
    HEADER_FG: 'FFFFFF', // White
    ROW_ALT_BG: 'F9FAFB', // Very Light Gray for Zebra
    BORDER: 'D1D5DB', // Light Gray Border
    FOOTER_BG: '1E3A8A', // Deep Blue
    FOOTER_FG: 'FFFFFF', // White
    
    // Matrix Rating Colors matching the UI (1 to 5)
    SCORE_1: '2ECC71', // Green (Low / Strong)
    SCORE_2: 'A3E635', // Light Green (Low to Moderate / Satisfactory)
    SCORE_3: 'FACC15', // Yellow (Moderate / Fair)
    SCORE_4: 'F97316', // Orange (Moderate to High / Marginal)
    SCORE_5: 'FF0000', // Red (High / Unsatisfactory)
    NO_DATA: 'E5E7EB'  // Light Gray for empty "-"
  };

  const RISK_MATRIX = [
    [1, 1, 2, 3, 3],
    [1, 2, 2, 3, 4],
    [2, 2, 3, 4, 4],
    [2, 3, 4, 4, 5],
    [3, 3, 4, 5, 5],
  ];

  const borderThin = {
    top: { style: 'thin', color: { rgb: COLORS.BORDER } },
    bottom: { style: 'thin', color: { rgb: COLORS.BORDER } },
    left: { style: 'thin', color: { rgb: COLORS.BORDER } },
    right: { style: 'thin', color: { rgb: COLORS.BORDER } }
  };

  const borderBlack = {
    top: { style: 'thin', color: { rgb: '000000' } },
    bottom: { style: 'thin', color: { rgb: '000000' } },
    left: { style: 'thin', color: { rgb: '000000' } },
    right: { style: 'thin', color: { rgb: '000000' } }
  };

  const getStyleForScore = (indicator) => {
    if (!indicator) {
      return {
        fill: { patternType: 'solid', fgColor: { rgb: COLORS.NO_DATA } },
        font: { color: { rgb: '9CA3AF' }, bold: true }
      };
    }

    const score = Math.round(indicator.score);
    let color = COLORS.NO_DATA;
    let fgColor = 'FFFFFF';
    
    if (score === 1) { color = COLORS.SCORE_1; fgColor = 'FFFFFF'; }
    else if (score === 2) { color = COLORS.SCORE_2; fgColor = '000000'; }
    else if (score === 3) { color = COLORS.SCORE_3; fgColor = '000000'; }
    else if (score === 4) { color = COLORS.SCORE_4; fgColor = '000000'; }
    else if (score >= 5) { color = COLORS.SCORE_5; fgColor = 'FFFFFF'; }

    return {
      fill: { patternType: 'solid', fgColor: { rgb: color } },
      font: { color: { rgb: fgColor }, bold: true }
    };
  };

  const getMatrixCellStyle = (rating, isActive) => {
    const colors = {
      1: COLORS.SCORE_1,
      2: COLORS.SCORE_2,
      3: COLORS.SCORE_3,
      4: COLORS.SCORE_4,
      5: COLORS.SCORE_5
    };
    const bg = colors[rating] || 'FFFFFF';
    const fg = (rating === 1 || rating === 5) ? 'FFFFFF' : '000000';

    const borderActive = {
      top: { style: 'double', color: { rgb: '000000' } },
      bottom: { style: 'double', color: { rgb: '000000' } },
      left: { style: 'double', color: { rgb: '000000' } },
      right: { style: 'double', color: { rgb: '000000' } }
    };

    return {
      fill: { patternType: 'solid', fgColor: { rgb: bg } },
      font: { color: { rgb: fg }, bold: true, size: isActive ? 12 : 10 },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: isActive ? borderActive : borderBlack
    };
  };

  const validInherent = footerDisplay.hasData ? footerDisplay.inherentScoreForMatrix : null;
  const validKpmr = footerDisplay.hasData ? footerDisplay.kpmrScoreForMatrix : null;

  const getMatrixCell = (inherentVal, kpmrVal) => {
    const val = RISK_MATRIX[inherentVal - 1][kpmrVal - 1];
    const isActive = (validInherent === inherentVal && validKpmr === kpmrVal);
    return isActive ? `● ${val}` : val;
  };

  // 1. Prepare AOA Data
  const wsData = [
    // Info Rows
    ['LAPORAN REKAP DATA 2 OJK', '', '', '', '', '', '', '', '', '', ''],
    [`Periode: Tahun ${year} - Triwulan Q${quarter}`, '', '', '', '', '', '', '', '', '', ''],
    [], // Empty row (r = 2)
    // Row 3: Section Headers
    ['Risk Profile Summary', '', '', '', '', 'Table Matrix Inherent Dan KPMR', '', '', '', '', ''],
    // Row 4: Column Headers
    ['Jenis Risiko', 'Inherent Risk', 'KPMR', 'Net Risk', '', '', '', '', '', '', '']
  ];

  const maxRows = Math.max(5 + tableData.length, 13);
  
  for (let r = 5; r <= maxRows; r++) {
    const row = [];
    
    // Left side: columns A-D (indices 0 to 3)
    if (r < 5 + tableData.length) {
      const item = tableData[r - 5];
      row[0] = item.nama;
      row[1] = item.hasInherent ? item.inherentIndicator?.score : '-';
      row[2] = item.hasKpmr ? item.kpmrIndicator?.score : '-';
      row[3] = (item.hasInherent && item.hasKpmr) ? item.matrixIndicator?.score : '-';
    } else if (r === 5 + tableData.length) {
      row[0] = 'Skor Profil Risiko';
      row[1] = footerDisplay.hasData && footerDisplay.inherentIndicator ? footerDisplay.inherentIndicator.score : '-';
      row[2] = footerDisplay.hasData && footerDisplay.kpmrIndicator ? footerDisplay.kpmrIndicator.score : '-';
      row[3] = footerDisplay.hasData && footerDisplay.matrixIndicator ? footerDisplay.matrixIndicator.score : '-';
    } else {
      row[0] = '';
      row[1] = '';
      row[2] = '';
      row[3] = '';
    }

    // Spacer column E (index 4)
    row[4] = '';

    // Right side: columns F-K (indices 5 to 10)
    if (r === 5) {
      row[5] = 'Inherent Risiko';
      row[6] = 'Kualitas Penerapan Manajemen Risiko (KPMR)';
      row[7] = '';
      row[8] = '';
      row[9] = '';
      row[10] = '';
    } else if (r === 6) {
      row[5] = '';
      row[6] = 'Strong (1)';
      row[7] = 'Satisfactory (2)';
      row[8] = 'Fair (3)';
      row[9] = 'Marginal (4)';
      row[10] = 'Unsatisfactory (5)';
    } else if (r >= 7 && r <= 11) {
      const inherentVal = r - 6; // 1 to 5
      const labels = {
        1: 'Low (1)',
        2: 'Low to Moderate (2)',
        3: 'Moderate (3)',
        4: 'Moderate to High (4)',
        5: 'High (5)'
      };
      row[5] = labels[inherentVal];
      row[6] = getMatrixCell(inherentVal, 1);
      row[7] = getMatrixCell(inherentVal, 2);
      row[8] = getMatrixCell(inherentVal, 3);
      row[9] = getMatrixCell(inherentVal, 4);
      row[10] = getMatrixCell(inherentVal, 5);
    } else if (r === 12) {
      row[5] = `Posisi risiko saat ini (Inherent: ${footerDisplay.hasData ? footerDisplay.inherentScoreForMatrix : '-'}, KPMR: ${footerDisplay.hasData ? footerDisplay.kpmrScoreForMatrix : '-'})`;
      row[6] = '';
      row[7] = '';
      row[8] = '';
      row[9] = '';
      row[10] = '';
    } else if (r === 13) {
      row[5] = `Hasil Matriks: ${footerDisplay.hasData && footerDisplay.matrixIndicator ? `${footerDisplay.matrixIndicator.label} (${footerDisplay.matrixDisplay.toFixed(1)})` : '-'}`;
      row[6] = '';
      row[7] = '';
      row[8] = '';
      row[9] = '';
      row[10] = '';
    } else {
      row[5] = '';
      row[6] = '';
      row[7] = '';
      row[8] = '';
      row[9] = '';
      row[10] = '';
    }

    wsData.push(row);
  }

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // 2. Set Merges
  ws['!merges'] = [
    // Info title merges
    { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } },
    // Section headers merges
    { s: { r: 3, c: 0 }, e: { r: 3, c: 3 } }, // Left title (A4 to D4)
    { s: { r: 3, c: 5 }, e: { r: 3, c: 10 } }, // Right title (F4 to K4)
    // Matrix header merges
    { s: { r: 5, c: 5 }, e: { r: 6, c: 5 } }, // Vertical header (F6 to F7)
    { s: { r: 5, c: 6 }, e: { r: 5, c: 10 } }, // Horizontal header (G6 to K6)
    // Matrix footer merges
    { s: { r: 12, c: 5 }, e: { r: 12, c: 10 } }, // Posisi status (F13 to K13)
    { s: { r: 13, c: 5 }, e: { r: 13, c: 10 } }  // Hasil Matriks status (F14 to K14)
  ];

  // 3. Set Styles
  const totalRows = wsData.length;

  for (let r = 0; r < totalRows; r++) {
    for (let c = 0; c < 11; c++) {
      const cellRef = XLSX.utils.encode_cell({ r, c });
      
      // Title styling
      if (r === 0) {
        if (ws[cellRef]) {
          ws[cellRef].s = {
            font: { bold: true, size: 16, color: { rgb: '1F4E79' } },
            alignment: { horizontal: 'left' }
          };
        }
        continue;
      }
      if (r === 1) {
        if (ws[cellRef]) {
          ws[cellRef].s = {
            font: { italic: true, size: 11, color: { rgb: '4B5563' } },
            alignment: { horizontal: 'left' }
          };
        }
        continue;
      }
      if (r === 2) continue; // Skip empty row

      const cell = ws[cellRef];
      if (!cell) continue;

      cell.s = cell.s || {};

      // Row 3: Section Headers styling
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

      // Left side: columns A-D (c = 0..3)
      if (c >= 0 && c <= 3) {
        // Left header styling
        if (r === 4) {
          cell.s = {
            fill: { patternType: 'solid', fgColor: { rgb: COLORS.HEADER_BG } },
            font: { color: { rgb: COLORS.HEADER_FG }, bold: true },
            alignment: { horizontal: 'center', vertical: 'center' },
            border: borderThin
          };
          continue;
        }

        // Left footer styling
        if (r === 5 + tableData.length) {
          if (c === 0) {
            cell.s = {
              fill: { patternType: 'solid', fgColor: { rgb: COLORS.FOOTER_BG } },
              font: { color: { rgb: COLORS.FOOTER_FG }, bold: true },
              alignment: { horizontal: 'left', vertical: 'center' },
              border: borderThin
            };
          } else {
            const footerIndicator = c === 1 ? footerDisplay.inherentIndicator : (c === 2 ? footerDisplay.kpmrIndicator : footerDisplay.matrixIndicator);
            cell.s = {
              ...getStyleForScore(footerDisplay.hasData ? footerIndicator : null),
              alignment: { horizontal: 'center', vertical: 'center' },
              border: borderThin
            };
          }
          continue;
        }

        // Left data rows styling
        if (r >= 5 && r < 5 + tableData.length) {
          const isAltRow = (r - 5) % 2 === 1;
          const defaultBg = isAltRow ? COLORS.ROW_ALT_BG : 'FFFFFF';
          const item = tableData[r - 5];

          cell.s = {
            fill: { patternType: 'solid', fgColor: { rgb: defaultBg } },
            alignment: { vertical: 'center' },
            border: borderThin
          };

          if (c === 0) {
            cell.s.alignment.horizontal = 'left';
            cell.s.font = { bold: true };
          } else {
            const indicator = c === 1 ? item.inherentIndicator : (c === 2 ? item.kpmrIndicator : item.matrixIndicator);
            const hasScore = c === 1 ? item.hasInherent : (c === 2 ? item.hasKpmr : (item.hasInherent && item.hasKpmr));
            cell.s = {
              ...getStyleForScore(hasScore ? indicator : null),
              alignment: { horizontal: 'center', vertical: 'center' },
              border: borderThin
            };
          }
        }
      }

      // Spacer column E (c === 4)
      if (c === 4) continue;

      // Right side: columns F-K (c = 5..10)
      if (c >= 5 && c <= 10) {
        // Vertical header or Horizontal header main row (r === 5)
        if (r === 5) {
          cell.s = {
            fill: { patternType: 'solid', fgColor: { rgb: '1E3A8A' } },
            font: { color: { rgb: 'FFFFFF' }, bold: true },
            alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
            border: borderBlack
          };
          continue;
        }

        // Columns headers row (r === 6)
        if (r === 6) {
          const isF = c === 5;
          cell.s = {
            fill: { patternType: 'solid', fgColor: { rgb: isF ? '1E3A8A' : 'F2F2F2' } },
            font: { color: { rgb: isF ? 'FFFFFF' : '000000' }, bold: true, size: 9 },
            alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
            border: borderBlack
          };
          continue;
        }

        // Matrix rows (r >= 7 && r <= 11)
        if (r >= 7 && r <= 11) {
          if (c === 5) {
            // Row label
            cell.s = {
              fill: { patternType: 'solid', fgColor: { rgb: '1E3A8A' } },
              font: { color: { rgb: 'FFFFFF' }, bold: true, size: 9 },
              alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
              border: borderBlack
            };
          } else {
            // Matrix numeric cells
            const strVal = cell.v.toString();
            const isActive = strVal.includes('●');
            const rating = parseInt(strVal.replace('● ', ''));
            
            cell.s = getMatrixCellStyle(rating, isActive);
          }
          continue;
        }

        // Matrix status row 1 (r === 12)
        if (r === 12) {
          cell.s = {
            font: { bold: true, color: { rgb: '1E3A8A' }, size: 10 },
            alignment: { horizontal: 'left', vertical: 'center' }
          };
          continue;
        }

        // Matrix status row 2 (r === 13)
        if (r === 13) {
          cell.s = {
            font: { bold: true, color: { rgb: '1E3A8A' }, size: 10 },
            alignment: { horizontal: 'left', vertical: 'center' }
          };
          continue;
        }
      }
    }
  }

  // 4. Set Column Widths
  ws['!cols'] = [
    { wch: 32 }, // Col A: Jenis Risiko
    { wch: 18 }, // Col B: Inherent Risk
    { wch: 18 }, // Col C: KPMR
    { wch: 18 }, // Col D: Net Risk
    { wch: 4 },  // Col E: Spacer
    { wch: 22 }, // Col F: Inherent Risiko / row labels
    { wch: 15 }, // Col G: Strong (1)
    { wch: 15 }, // Col H: Satisfactory (2)
    { wch: 15 }, // Col I: Fair (3)
    { wch: 15 }, // Col J: Marginal (4)
    { wch: 15 }  // Col K: Unsatisfactory (5)
  ];

  // 5. Set Row Heights
  const rowHeights = [];
  rowHeights[0] = { hpt: 26 };
  rowHeights[1] = { hpt: 18 };
  rowHeights[2] = { hpt: 10 };
  rowHeights[3] = { hpt: 24 };
  rowHeights[4] = { hpt: 24 };
  rowHeights[5] = { hpt: 20 };
  rowHeights[6] = { hpt: 22 };
  rowHeights[7] = { hpt: 35 };
  rowHeights[8] = { hpt: 35 };
  rowHeights[9] = { hpt: 35 };
  rowHeights[10] = { hpt: 35 };
  rowHeights[11] = { hpt: 35 };
  rowHeights[12] = { hpt: 25 };
  rowHeights[13] = { hpt: 25 };

  for (let r = 14; r <= maxRows; r++) {
    rowHeights[r] = { hpt: 22 };
  }
  ws['!rows'] = rowHeights;

  // Append sheet and write
  XLSX.utils.book_append_sheet(wb, ws, 'Rekap Data 2');
  XLSX.writeFile(wb, `OJK_REKAP_DATA_2_${year}_Q${quarter}.xlsx`);
}
