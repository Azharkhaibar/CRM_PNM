// ===================== Export Function for Likuiditas Table =====================
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

// Formatter angka
const fmtNumber = (v) => {
  if (v === '' || v == null) return '';
  const n = Number(v);
  if (isNaN(n)) return String(v);
  return new Intl.NumberFormat('en-US').format(n);
};

// Normalisasi indikator dari backend → frontend/export
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

export const exportLikuiditasToExcel = async ({ year, quarter, sections = [], filename = `Likuiditas_${year}_${quarter}` }) => {
  try {
    // Validasi data
    if (!sections || sections.length === 0) {
      throw new Error('Tidak ada data untuk diexport');
    }

    // Gunakan xlsx-js-style yang mendukung styling
    const XLSX = await import('xlsx-js-style');

    // Buat workbook baru
    const wb = XLSX.utils.book_new();

    // ===================== PALET WARNA SESUAI FILE EXCEL YANG DIBERIKAN =====================
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

    // Data untuk sheet utama (format sesuai preview table)
    const wsData = [];

    // ===== HEADER =====
    wsData.push(['No', 'Bobot', 'Parameter atau Indikator', '', '', 'Bobot Indikator', 'Sumber Risiko', 'Dampak', 'Low', 'Low to Moderate', 'Moderate', 'Moderate to High', 'High', 'Hasil', 'Peringkat', 'Weighted', 'Aksi']);
    wsData.push(['', '', 'Section', 'Sub No', 'Indikator', '', '', '', '', '', '', '', '', '', '', '', '']);

    // ===== BODY DATA =====
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

    // ===== FOOTER =====
    wsData.push(['', '', '', '', '', '', '', '', '', '', '', '', 'Summary', '', totalWeighted.toFixed(2), '']);

    // ===== BUAT WORKSHEET =====
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // ===== MENGATUR LEBAR KOLOM =====
    ws['!cols'] = [
      { wch: 5 }, // A
      { wch: 8 }, // B
      { wch: 30 }, // C
      { wch: 10 }, // D
      { wch: 40 }, // E
      { wch: 12 }, // F
      { wch: 25 }, // G
      { wch: 30 }, // H
      { wch: 15 }, // I
      { wch: 20 }, // J
      { wch: 15 }, // K
      { wch: 20 }, // L
      { wch: 15 }, // M
      { wch: 12 }, // N
      { wch: 10 }, // O
      { wch: 12 }, // P
      { wch: 10 }, // Q
    ];

    // 2. Merge cells untuk header
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

    // 4. HEADER STYLING
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
          font: {
            bold: true,
            color: { rgb: textColor },
          },
          fill: {
            fgColor: { rgb: bgColor },
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center',
          },
          border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } },
          },
        };
      }
    }

    // 5. BODY STYLING
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
            border: {
              top: { style: 'thin', color: { rgb: '000000' } },
              bottom: { style: 'thin', color: { rgb: '000000' } },
              left: { style: 'thin', color: { rgb: '000000' } },
              right: { style: 'thin', color: { rgb: '000000' } },
            },
          });
        }

        if (isFirstInSection) {
          for (let c = 0; c < 3; c++) {
            const cell = XLSX.utils.encode_cell({ r: currentRow, c });
            applyStyle(cell, {
              fill: { fgColor: { rgb: COLORS.SECTION_BG } },
              font: { bold: true },
            });
          }
        }

        const hasilPeringkatStyles = {
          13: COLORS.HASIL,
          14: COLORS.HASIL,
          15: COLORS.HASIL,
        };

        Object.entries(hasilPeringkatStyles).forEach(([col, color]) => {
          const colNum = parseInt(col);
          const cell = XLSX.utils.encode_cell({ r: currentRow, c: colNum });

          if (colNum === 14) {
            let ratingColor = COLORS.HASIL;
            let textColor = '000000';

            if (peringkat === 1) {
              ratingColor = COLORS.HEADER_LOW;
            } else if (peringkat === 2) {
              ratingColor = COLORS.HEADER_LOW_TO_MODERATE;
            } else if (peringkat === 3) {
              ratingColor = COLORS.HEADER_MODERATE;
            } else if (peringkat === 4) {
              ratingColor = COLORS.HEADER_MODERATE_TO_HIGH;
              textColor = '000000';
            } else if (peringkat >= 5) {
              ratingColor = COLORS.HEADER_HIGH;
              textColor = 'FFFFFF';
            }

            applyStyle(cell, {
              fill: { fgColor: { rgb: ratingColor } },
              font: {
                bold: true,
                color: { rgb: textColor },
              },
              alignment: {
                horizontal: 'center',
                vertical: 'center',
              },
            });
          } else {
            applyStyle(cell, {
              fill: { fgColor: { rgb: color } },
              alignment: {
                horizontal: 'center',
                vertical: 'center',
              },
            });

            applyStyle(cell, {
              font: { color: { rgb: '000000' } },
            });
          }
        });

        for (let c = 0; c < 17; c++) {
          const cell = XLSX.utils.encode_cell({ r: currentRow, c });
          applyStyle(cell, {
            font: { color: { rgb: '000000' } },
          });
        }

        currentRow++;

        if (transformed.mode !== CalculationMode.TEKS) {
          for (let c = 0; c < 17; c++) {
            const cell = XLSX.utils.encode_cell({ r: currentRow, c });
            applyStyle(cell, {
              fill: { fgColor: { rgb: COLORS.FACTOR_BG } },
              border: {
                top: { style: 'thin', color: { rgb: '000000' } },
                left: { style: 'thin', color: { rgb: '000000' } },
                right: { style: 'thin', color: { rgb: '000000' } },
              },
            });
          }

          const hasilCellPenyebut = XLSX.utils.encode_cell({ r: currentRow, c: 13 });
          if (ws[hasilCellPenyebut]?.v) {
            applyStyle(hasilCellPenyebut, {
              fill: { fgColor: { rgb: COLORS.NILAI_BG } },
              alignment: { horizontal: 'right' },
            });
          }

          currentRow++;

          if (transformed.mode === CalculationMode.RASIO) {
            for (let c = 0; c < 17; c++) {
              const cell = XLSX.utils.encode_cell({ r: currentRow, c });
              applyStyle(cell, {
                fill: { fgColor: { rgb: COLORS.FACTOR_BG } },
                border: {
                  top: { style: 'thin', color: { rgb: '000000' } },
                  bottom: { style: 'thin', color: { rgb: '000000' } },
                  left: { style: 'thin', color: { rgb: '000000' } },
                  right: { style: 'thin', color: { rgb: '000000' } },
                },
              });
            }

            const hasilCellPembilang = XLSX.utils.encode_cell({ r: currentRow, c: 13 });
            if (ws[hasilCellPembilang]?.v) {
              applyStyle(hasilCellPembilang, {
                fill: { fgColor: { rgb: COLORS.NILAI_BG } },
                alignment: { horizontal: 'right' },
              });
            }

            currentRow++;
          } else {
            const prevRow = currentRow - 1;
            for (let c = 0; c < 17; c++) {
              const cell = XLSX.utils.encode_cell({ r: prevRow, c });
              if (ws[cell]) {
                if (!ws[cell].s) ws[cell].s = {};
                if (!ws[cell].s.border) ws[cell].s.border = {};
                ws[cell].s.border.bottom = { style: 'thin', color: { rgb: '000000' } };
              }
            }
          }
        } else {
          const indicatorRow = currentRow - 1;
          for (let c = 0; c < 17; c++) {
            const cell = XLSX.utils.encode_cell({ r: indicatorRow, c });
            if (ws[cell] && ws[cell].s && ws[cell].s.border) {
              ws[cell].s.border.bottom = { style: 'thin', color: { rgb: '000000' } };
            }
          }
        }
      });
    });

    for (let r = 2; r < wsData.length - 1; r++) {
      const row = wsData[r];
      const nextRow = wsData[r + 1];

      const isNextRowEmpty = nextRow && nextRow[0] === '' && nextRow[1] === '' && nextRow[2] === '';

      if (row[0] !== '' && isNextRowEmpty) {
        for (let c = 0; c < 17; c++) {
          const cell = XLSX.utils.encode_cell({ r, c });
          if (ws[cell] && ws[cell].s && ws[cell].s.border) {
            delete ws[cell].s.border.bottom;
          }
        }
      }
    }

    // 6. FOOTER STYLING
    const footerRow = wsData.length - 1;

    const summaryCell = XLSX.utils.encode_cell({ r: footerRow, c: 12 });
    if (ws[summaryCell]) {
      ws[summaryCell].s = {
        fill: { fgColor: { rgb: COLORS.SUMMARY_BG } },
        font: {
          bold: true,
          color: { rgb: 'FFFFFF' },
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
        },
        border: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } },
        },
      };
    }

    const totalCell = XLSX.utils.encode_cell({ r: footerRow, c: 14 });
    if (ws[totalCell]) {
      ws[totalCell].s = {
        fill: { fgColor: { rgb: COLORS.TOTAL_BG } },
        font: { bold: true },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
        },
        border: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } },
        },
      };
    }

    // ===================== SHEET RINGKASAN =====================
    const summaryData = [['LAPORAN RISIKO LIKUIDITAS BANK'], [`Periode: ${year} ${quarter}`], [''], ['No', 'Section', 'Bobot Section', 'Jumlah Indikator', 'Total Weighted']];

    sections.forEach((section) => {
      const totalWeightedSection = (section.indicators || []).reduce((sum, ind) => {
        return sum + (Number(ind.weighted) || 0);
      }, 0);

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
          wsSummary[addr].s = {
            font: { bold: true, size: 16, color: { rgb: '1F4E79' } },
            alignment: { horizontal: 'center' },
          };
        } else if (r === 1) {
          wsSummary[addr].s = {
            font: { bold: true, size: 12 },
            alignment: { horizontal: 'center' },
          };
        } else if (r === 3) {
          wsSummary[addr].s = {
            font: { bold: true, color: { rgb: 'FFFFFF' } },
            fill: { fgColor: { rgb: COLORS.HEADER } },
            alignment: { horizontal: 'center', vertical: 'center' },
            border: {
              top: { style: 'thin', color: { rgb: '000000' } },
              bottom: { style: 'thin', color: { rgb: '000000' } },
              left: { style: 'thin', color: { rgb: '000000' } },
              right: { style: 'thin', color: { rgb: '000000' } },
            },
          };
        } else if (r >= 4 && r < summaryData.length - 1) {
          const bgColor = r % 2 === 0 ? 'F2F2F2' : 'FFFFFF';
          wsSummary[addr].s = {
            fill: { fgColor: { rgb: bgColor } },
            border: {
              left: { style: 'thin', color: { rgb: '000000' } },
              right: { style: 'thin', color: { rgb: '000000' } },
              bottom: { style: 'thin', color: { rgb: '000000' } },
            },
            alignment: {
              horizontal: c === 0 ? 'center' : 'left',
            },
          };
        } else if (r === summaryData.length - 1) {
          if (c === 2) {
            wsSummary[addr].s = {
              font: { bold: true },
              alignment: { horizontal: 'right' },
            };
          } else if (c === 4) {
            wsSummary[addr].s = {
              font: { bold: true },
              fill: { fgColor: { rgb: COLORS.TOTAL_BG } },
              alignment: { horizontal: 'center' },
            };
          }
        }
      }
    }

    // ===== SIMPAN KE FILE =====
    XLSX.utils.book_append_sheet(wb, ws, 'Data Likuiditas');
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
