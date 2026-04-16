// ===================== Export Function for Pasar Table =====================
const CalculationMode = {
  RASIO: 'RASIO',
  NILAI_TUNGGAL: 'NILAI_TUNGGAL',
  TEKS: 'TEKS',
};

const roundInt = (v) => {
  if (v === '' || v == null) return '';
  const n = Number(v);
  if (isNaN(n)) return v;
  return Math.round(n);
};

const fmtNumber = (v) => {
  if (v === '' || v == null) return '';
  const n = Number(v);
  if (isNaN(n)) return String(v);
  return new Intl.NumberFormat('en-US').format(n);
};

const transformIndicatorToFrontend = (indikator = {}) => ({
  id: indikator.id,
  subNo: indikator.subNo || '',
  indikator: indikator.indikator || '',
  bobotIndikator: indikator.bobotIndikator || 0,
  sumberRisiko: indikator.sumberRisiko || '',
  dampak: indikator.dampak || '',
  pembilangLabel: indikator.pembilangLabel || '',
  pembilangValue: indikator.pembilangValue,
  penyebutLabel: indikator.penyebutLabel || '',
  penyebutValue: indikator.penyebutValue,
  peringkat: indikator.peringkat || 1,
  weighted: indikator.weighted || '',
  hasil: indikator.hasil,
  hasilText: indikator.hasilText || '',
  isPercent: Boolean(indikator.isPercent),
  mode: indikator.mode || CalculationMode.RASIO,
  low: indikator.low || '',
  lowToModerate: indikator.lowToModerate || '',
  moderate: indikator.moderate || '',
  moderateToHigh: indikator.moderateToHigh || '',
  high: indikator.high || '',
});

export const exportPasarToExcel = async ({ year, quarter, sections = [], filename = `Pasar_${year}_${quarter}` }) => {
  try {
    if (!sections || sections.length === 0) {
      throw new Error('Tidak ada data untuk diexport');
    }

    const XLSX = await import('xlsx-js-style');
    const wb = XLSX.utils.book_new();

    const COLORS = {
      HEADER: '4472C4',
      HEADER_LOW: 'C6E0B4',
      HEADER_LOW_TO_MODERATE: 'BDD7EE',
      HEADER_MODERATE: 'FFE699',
      HEADER_MODERATE_TO_HIGH: 'F4B084',
      HEADER_HIGH: 'C00000',
      SECTION_BG: 'D9E1F2',
      INDICATOR_BG: 'FFFFFF',
      FACTOR_BG: 'F2F2F2',
      HASIL: 'D9D9D9',
      NILAI_BG: 'E2EFDA',
      SUMMARY_BG: '305496',
      TOTAL_BG: 'C6E0B4',
    };

    const wsData = [];

    wsData.push(['No', 'Bobot', 'Parameter atau Indikator', '', '', 'Bobot Indikator', 'Sumber Risiko', 'Dampak', 'Low', 'Low to Moderate', 'Moderate', 'Moderate to High', 'High', 'Hasil', 'Peringkat', 'Weighted', 'Aksi']);
    wsData.push(['', '', 'Section', 'Sub No', 'Indikator', '', '', '', '', '', '', '', '', '', '', '', '']);

    let totalWeighted = 0;

    sections.forEach((section) => {
      const indicators = section.indicators || [];

      indicators.forEach((indicator, idx) => {
        const firstOfSection = idx === 0;
        const transformed = transformIndicatorToFrontend(indicator);

        let hasilDisplay = '';
        if (transformed.mode === CalculationMode.TEKS) {
          hasilDisplay = transformed.hasilText || '';
        } else if (transformed.hasil !== '' && transformed.hasil != null && !isNaN(Number(transformed.hasil))) {
          if (transformed.isPercent) {
            hasilDisplay = Math.round(Number(transformed.hasil) * 100) + '%';
          } else {
            hasilDisplay = roundInt(transformed.hasil);
          }
        }

        const weightedVal = Number(transformed.weighted) || 0;
        const weightedDisplay = !isNaN(weightedVal) ? weightedVal.toFixed(2) : '';
        totalWeighted += weightedVal;

        wsData.push([
          firstOfSection ? section.no : '',
          firstOfSection ? `${section.bobotSection}%` : '',
          firstOfSection ? section.parameter : '',
          transformed.subNo,
          transformed.indikator,
          `${transformed.bobotIndikator}%`,
          transformed.sumberRisiko,
          transformed.dampak,
          transformed.low,
          transformed.lowToModerate,
          transformed.moderate,
          transformed.moderateToHigh,
          transformed.high,
          hasilDisplay,
          transformed.peringkat,
          weightedDisplay,
          '',
        ]);

        if (transformed.mode !== CalculationMode.TEKS) {
          wsData.push(['', '', '', '', `${transformed.penyebutLabel || ''}`, '', '', '', '', '', '', '', '', roundInt(transformed.penyebutValue), '', '', '']);

          if (transformed.mode === CalculationMode.RASIO) {
            wsData.push(['', '', '', '', `${transformed.pembilangLabel || ''}`, '', '', '', '', '', '', '', '', roundInt(transformed.pembilangValue), '', '', '']);
          }
        }
      });
    });

    wsData.push(['', '', '', '', '', '', '', '', '', '', '', '', 'Summary', '', totalWeighted.toFixed(2), '']);

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    ws['!cols'] = [{ wch: 5 }, { wch: 8 }, { wch: 30 }, { wch: 10 }, { wch: 40 }, { wch: 12 }, { wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 10 }];

    ws['!merges'] = [
      XLSX.utils.decode_range('A1:A2'),
      XLSX.utils.decode_range('B1:B2'),
      XLSX.utils.decode_range('C1:E1'),
      XLSX.utils.decode_range('F1:F2'),
      XLSX.utils.decode_range('G1:G2'),
      XLSX.utils.decode_range('H1:H2'),
      XLSX.utils.decode_range('I1:I2'),
      XLSX.utils.decode_range('J1:J2'),
      XLSX.utils.decode_range('K1:K2'),
      XLSX.utils.decode_range('L1:L2'),
      XLSX.utils.decode_range('M1:M2'),
      XLSX.utils.decode_range('N1:N2'),
      XLSX.utils.decode_range('O1:O2'),
      XLSX.utils.decode_range('P1:P2'),
      XLSX.utils.decode_range('Q1:Q2'),
    ];

    const applyStyle = (cell, style) => {
      if (!ws[cell]) return;
      if (!ws[cell].s) ws[cell].s = {};
      Object.assign(ws[cell].s, style);
    };

    for (let r = 0; r <= 1; r++) {
      for (let c = 0; c < 17; c++) {
        const addr = XLSX.utils.encode_cell({ r, c });
        if (!ws[addr]) continue;

        let bgColor = COLORS.HEADER;
        let textColor = 'FFFFFF';

        if (r === 0) {
          if (c === 8) {
            bgColor = COLORS.HEADER_LOW;
            textColor = '000000';
          } else if (c === 9) {
            bgColor = COLORS.HEADER_LOW_TO_MODERATE;
            textColor = '000000';
          } else if (c === 10) {
            bgColor = COLORS.HEADER_MODERATE;
            textColor = '000000';
          } else if (c === 11) {
            bgColor = COLORS.HEADER_MODERATE_TO_HIGH;
            textColor = '000000';
          } else if (c === 12) {
            bgColor = COLORS.HEADER_HIGH;
            textColor = 'FFFFFF';
          }
        }

        ws[addr].s = {
          font: { bold: true, color: { rgb: textColor } },
          fill: { fgColor: { rgb: bgColor } },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } },
        };
      }
    }

    let currentRow = 2;

    sections.forEach((section) => {
      const indicators = section.indicators || [];

      indicators.forEach((indicator, idx) => {
        const transformed = transformIndicatorToFrontend(indicator);
        const isFirstInSection = idx === 0;
        const peringkat = transformed.peringkat || 1;

        for (let c = 0; c < 17; c++) {
          const cell = XLSX.utils.encode_cell({ r: currentRow, c });
          applyStyle(cell, {
            fill: { fgColor: { rgb: COLORS.INDICATOR_BG } },
            border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } },
          });
        }

        if (isFirstInSection) {
          for (let c = 0; c < 3; c++) {
            const cell = XLSX.utils.encode_cell({ r: currentRow, c });
            applyStyle(cell, { fill: { fgColor: { rgb: COLORS.SECTION_BG } }, font: { bold: true } });
          }
        }

        const hasilPeringkatStyles = { 13: COLORS.HASIL, 14: COLORS.HASIL, 15: COLORS.HASIL };

        Object.entries(hasilPeringkatStyles).forEach(([col, color]) => {
          const colNum = parseInt(col);
          const cell = XLSX.utils.encode_cell({ r: currentRow, c: colNum });

          if (colNum === 14) {
            let ratingColor = COLORS.HASIL;
            let textColor = '000000';
            if (peringkat === 1) ratingColor = COLORS.HEADER_LOW;
            else if (peringkat === 2) ratingColor = COLORS.HEADER_LOW_TO_MODERATE;
            else if (peringkat === 3) ratingColor = COLORS.HEADER_MODERATE;
            else if (peringkat === 4) {
              ratingColor = COLORS.HEADER_MODERATE_TO_HIGH;
              textColor = '000000';
            } else if (peringkat >= 5) {
              ratingColor = COLORS.HEADER_HIGH;
              textColor = 'FFFFFF';
            }
            applyStyle(cell, { fill: { fgColor: { rgb: ratingColor } }, font: { bold: true, color: { rgb: textColor } }, alignment: { horizontal: 'center', vertical: 'center' } });
          } else {
            applyStyle(cell, { fill: { fgColor: { rgb: color } }, alignment: { horizontal: 'center', vertical: 'center' }, font: { color: { rgb: '000000' } } });
          }
        });

        for (let c = 0; c < 17; c++) {
          const cell = XLSX.utils.encode_cell({ r: currentRow, c });
          applyStyle(cell, { font: { color: { rgb: '000000' } } });
        }

        currentRow++;

        if (transformed.mode !== CalculationMode.TEKS) {
          for (let c = 0; c < 17; c++) {
            const cell = XLSX.utils.encode_cell({ r: currentRow, c });
            applyStyle(cell, {
              fill: { fgColor: { rgb: COLORS.FACTOR_BG } },
              border: { top: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } },
            });
          }

          const hasilCellPenyebut = XLSX.utils.encode_cell({ r: currentRow, c: 13 });
          if (ws[hasilCellPenyebut]?.v) {
            applyStyle(hasilCellPenyebut, { fill: { fgColor: { rgb: COLORS.NILAI_BG } }, alignment: { horizontal: 'right' } });
          }
          currentRow++;

          if (transformed.mode === CalculationMode.RASIO) {
            for (let c = 0; c < 17; c++) {
              const cell = XLSX.utils.encode_cell({ r: currentRow, c });
              applyStyle(cell, {
                fill: { fgColor: { rgb: COLORS.FACTOR_BG } },
                border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } },
              });
            }

            const hasilCellPembilang = XLSX.utils.encode_cell({ r: currentRow, c: 13 });
            if (ws[hasilCellPembilang]?.v) {
              applyStyle(hasilCellPembilang, { fill: { fgColor: { rgb: COLORS.NILAI_BG } }, alignment: { horizontal: 'right' } });
            }
            currentRow++;
          }
        }
      });
    });

    const footerRow = wsData.length - 1;
    const summaryCell = XLSX.utils.encode_cell({ r: footerRow, c: 12 });
    if (ws[summaryCell]) {
      ws[summaryCell].s = {
        fill: { fgColor: { rgb: COLORS.SUMMARY_BG } },
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } },
      };
    }

    const totalCell = XLSX.utils.encode_cell({ r: footerRow, c: 14 });
    if (ws[totalCell]) {
      ws[totalCell].s = {
        fill: { fgColor: { rgb: COLORS.TOTAL_BG } },
        font: { bold: true },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } },
      };
    }

    const summaryData = [[`LAPORAN RISIKO PASAR BANK`], [`Periode: ${year} ${quarter}`], [''], ['No', 'Section', 'Bobot Section', 'Jumlah Indikator', 'Total Weighted']];

    sections.forEach((section) => {
      const totalWeightedSection = (section.indicators || []).reduce((sum, ind) => sum + (Number(ind.weighted) || 0), 0);
      summaryData.push([section.no, section.parameter, `${section.bobotSection}%`, (section.indicators || []).length, totalWeightedSection.toFixed(2)]);
    });

    summaryData.push(['', '', 'TOTAL:', '', totalWeighted.toFixed(2)]);

    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);

    wsSummary['!cols'] = [{ wch: 5 }, { wch: 30 }, { wch: 12 }, { wch: 15 }, { wch: 15 }];
    wsSummary['!merges'] = [XLSX.utils.decode_range('A1:E1'), XLSX.utils.decode_range('A2:E2')];

    for (let r = 0; r < summaryData.length; r++) {
      for (let c = 0; c < 5; c++) {
        const addr = XLSX.utils.encode_cell({ r, c });
        if (!wsSummary[addr]) continue;

        if (r === 0) {
          wsSummary[addr].s = { font: { bold: true, size: 16, color: { rgb: '1F4E79' } }, alignment: { horizontal: 'center' } };
        } else if (r === 1) {
          wsSummary[addr].s = { font: { bold: true, size: 12 }, alignment: { horizontal: 'center' } };
        } else if (r === 3) {
          wsSummary[addr].s = {
            font: { bold: true, color: { rgb: 'FFFFFF' } },
            fill: { fgColor: { rgb: COLORS.HEADER } },
            alignment: { horizontal: 'center', vertical: 'center' },
            border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } },
          };
        } else if (r >= 4 && r < summaryData.length - 1) {
          const bgColor = r % 2 === 0 ? 'F2F2F2' : 'FFFFFF';
          wsSummary[addr].s = {
            fill: { fgColor: { rgb: bgColor } },
            border: { left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } } },
            alignment: { horizontal: c === 0 ? 'center' : 'left' },
          };
        } else if (r === summaryData.length - 1 && c === 4) {
          wsSummary[addr].s = { font: { bold: true }, fill: { fgColor: { rgb: COLORS.TOTAL_BG } }, alignment: { horizontal: 'center' } };
        }
      }
    }

    XLSX.utils.book_append_sheet(wb, ws, 'Data Pasar');
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan');

    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
    const exportFilename = `${filename}_${dateStr}.xlsx`;

    XLSX.writeFile(wb, exportFilename);
    console.log(`✅ Export berhasil: ${exportFilename}`);
    return exportFilename;
  } catch (error) {
    console.error('❌ Error exporting data:', error);
    throw error;
  }
};
