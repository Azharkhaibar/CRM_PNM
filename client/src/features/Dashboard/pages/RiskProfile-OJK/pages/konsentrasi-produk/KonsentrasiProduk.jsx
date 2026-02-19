import React, { useEffect, useState, useRef, useCallback } from "react";
import Header from "../../components/header/Header";
import InherentPage from "./inherent/InherentPage";
import KpmrPage from "./kpmr/KpmrPage";
import { useHeaderStore } from "../../store/headerStore";
import {
  loadInherent,
  saveInherent,
  loadKpmr,
  saveKpmr,
  saveDerived,
  notifyRiskUpdated,
} from "../../utils/storage/riskStorageNilai";
import { computeDerived } from "@/features/Dashboard/pages/RiskProfile-OJK/utils/compute/computeDerived";
import { normalizeInherentRows } from "../../utils/normalize/normalizeInherentRows";
import { normalizeKpmrRows } from "../../utils/normalize/normalizeKpmrRows";
import * as ExcelJS from 'exceljs';

// Komponen tab untuk navigasi antara inherent dan KPMR
function RiskTabs({ value, onChange }) {
  return (
    <div className="mb-6 border-b border-gray-200">
      <nav className="flex space-x-8">
        <button
          onClick={() => onChange("inherent")}
          className={`
            py-3 px-1 border-b-2 font-medium text-sm transition-colors
            ${
              value === "inherent"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
            }
          `}
        >
          INHERENT
        </button>
        <button
          onClick={() => onChange("kpmr")}
          className={`
            py-3 px-1 border-b-2 font-medium text-sm transition-colors
            ${
              value === "kpmr"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
            }
          `}
        >
          KUALITAS PENERAPAN MANAJEMEN RISIKO
        </button>
      </nav>
    </div>
  );
}

// Membuat signature unik untuk mendeteksi perubahan data inherent
function getInherentSignature(rows = []) {
  return JSON.stringify(
    rows.map((p) => ({
      id: p.id,
      nomor: p.nomor,
      judul: p.judul,
      bobot: p.bobot,
      kategori: p.kategori,
      nilai: (p.nilaiList || []).map((n) => ({
        id: n.id,
        nomor: n.nomor,
        bobot: n.bobot,
        kodeEmiten: n.kodeEmiten,
        kepemilikan: n.kepemilikan,
        keterangan: n.keterangan,
        riskindikator: n.riskindikator,
        judul: n.judul,
      })),
    }))
  );
}

// Menghitung snapshot dari data inherent untuk disimpan sebagai derived
function computeInherentSnapshot(rows = []) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return {
      summary: 0,
      meta: { formula: "No data" },
    };
  }

  let totalWeighted = 0;

  rows.forEach((param) => {
    if (!Array.isArray(param.nilaiList)) return;

    param.nilaiList.forEach((nilai) => {
      const derived = computeDerived(nilai, param);
      if (Number.isFinite(derived?.weighted)) {
        totalWeighted += derived.weighted;
      }
    });
  });

  return {
    summary: Number(totalWeighted.toFixed(2)),
    meta: {
      formula: "SUM(all derived.weighted)",
    },
  };
}

// ==================== FUNGSI EXPORT INHERENT ====================
async function exportInherentToExcel({ rows = [], year, quarter, categoryLabel = "KonsentrasiProduk" }) {
  if (!Array.isArray(rows) || rows.length === 0) {
    alert("Tidak ada data inherent untuk diekspor");
    return;
  }

  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Risk Profile System';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet(`4. Inherent ${categoryLabel}`, {
      views: [{ showGridLines: true }]
    });

    // Set kolom widths
    worksheet.columns = [
      { width: 5 },    // 1. No Parameter
      { width: 7 },    // 2. Bobot Parameter
      { width: 26 },   // 3. Parameter
      { width: 5 },    // 4. No Nilai (ID Indikator)
      { width: 30 },   // 5. ID Indikator (nilai text)
      { width: 7 },    // 6. Bobot Nilai
      { width: 15 },   // 7. Kode Emiten
      { width: 15 },   // 8. % Kepemilikan (baru)
      { width: 15 },   // 9. Low
      { width: 15 },   // 10. Low To Moderate
      { width: 15 },   // 11. Moderate
      { width: 15 },   // 12. Moderate To High
      { width: 15 },   // 13. High
      { width: 15 },   // 14. Hasil
      { width: 15 },   // 15. Peringkat
      { width: 15 },   // 16. Weighted
      { width: 25 },   // 17. Keterangan
    ];

    // Judul
    const titleRow = worksheet.addRow([`Risk Profile OJK - ${categoryLabel}`]);
    titleRow.font = { size: 16, bold: true };
    worksheet.mergeCells('A1:Q1');

    const yearQuarterRow = worksheet.addRow([`Tahun: ${year} | Quarter: ${quarter.toUpperCase()} | Tanggal Export: ${new Date().toLocaleDateString('id-ID')}`]);
    yearQuarterRow.font = { size: 12, italic: true };
    worksheet.mergeCells('A2:Q2');

    worksheet.addRow([]);

    // Header tabel
    const headerRow = worksheet.addRow([
      'No', 'Bobot', 'Parameter', 'No', 'ID Indikator', 'Bobot', 'Kode Emiten', '% Kepemilikan',
      'Low', 'Low To Moderate', 'Moderate', 'Moderate To High', 'High',
      'Hasil', 'Peringkat', 'Weighted', 'Keterangan'
    ]);

    // Style header
    headerRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

      // Warna background
      if (colNumber <= 3) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003366' } };
      } else if (colNumber >= 9 && colNumber <= 13) {
        const colors = [
          'FF4F6228', // Low
          'FF92D050', // Low To Moderate
          'FFFFFF00', // Moderate
          'FFF97316', // Moderate To High
          'FFFF0000'  // High
        ];
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors[colNumber - 9] } };
        if (colNumber === 13) cell.font.color = { argb: 'FFFFFFFF' }; // High
        else if (colNumber === 9) cell.font.color = { argb: 'FFFFFFFF' }; // Low
        else cell.font.color = { argb: 'FF000000' };
      } else if (colNumber >= 14 && colNumber <= 16) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000033' } };
        cell.font.color = { argb: 'FFFFFFFF' };
      } else {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003366' } };
        cell.font.color = { argb: 'FFFFFFFF' };
      }

      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
      };
    });

    // Format persentase
    const formatPercent = (val) => {
      if (val === null || val === undefined || val === "") return "-";
      const n = Number(val);
      if (Number.isNaN(n)) return String(val);
      const percent = Math.abs(n) <= 1 ? n * 100 : n;
      const rounded = Math.abs(percent - Math.round(percent)) < 1e-9
        ? Math.round(percent)
        : percent.toFixed(2);
      return `${rounded}%`;
    };

    // Warna background peringkat
    const getRankBgColor = (peringkat) => {
      const rankBgMap = {
        1: '4F6228',
        2: '92D050',
        3: 'FFFF00',
        4: 'F97316',
        5: 'FF0000'
      };
      return rankBgMap[peringkat] || 'FFFFFF';
    };

    // Warna background summary
    const getSummaryBgColor = (total) => {
      if (!Number.isFinite(total)) return 'FFFFFF';
      if (total <= 1) return '4F6228';
      if (total <= 2) return '92D050';
      if (total <= 3) return 'FFFF00';
      if (total <= 4) return 'F97316';
      return 'FF0000';
    };

    let globalTotalWeighted = 0;
    let currentRow = 5;
    const mergeRanges = [];

    rows.forEach((param, pi) => {
      const nilaiList = Array.isArray(param.nilaiList) ? param.nilaiList : [];

      if (nilaiList.length === 0) {
        worksheet.addRow([
          param.nomor || "-",
          formatPercent(param.bobot),
          param.judul || "-",
          "", "", "", "", "", "", "", "", "", "", "", "", "", "Belum ada nilai"
        ]);
        const row = worksheet.getRow(currentRow);
        row.eachCell((cell, colNumber) => {
          if (colNumber <= 3) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F5FA' } };
          }
          cell.alignment = { wrapText: true, vertical: 'middle' };
          cell.border = {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } }
          };
        });
        currentRow++;
        return;
      }

      // Hitung jumlah baris untuk parameter ini (berdasarkan tipe judul)
      const totalRowsForParam = nilaiList.reduce((total, nilai) => {
        const j = nilai.judul || { type: "Tanpa Faktor" };
        if (j.type === "Satu Faktor") return total + 2;
        if (j.type === "Dua Faktor") return total + 3;
        return total + 1;
      }, 0);

      const paramStartRow = currentRow;

      nilaiList.forEach((nilai, ni) => {
        const derived = computeDerived(nilai, param);
        const { hasilDisplay, hasilRows, peringkat, weightedDisplay, weighted } = derived;

        if (Number.isFinite(weighted)) {
          globalTotalWeighted += weighted;
        }

        const j = nilai.judul || { type: "Tanpa Faktor" };
        let rowsForThisNilai = 1;
        if (j.type === "Satu Faktor") rowsForThisNilai = 2;
        if (j.type === "Dua Faktor") rowsForThisNilai = 3;

        const nilaiStart = currentRow;

        for (let subIndex = 0; subIndex < rowsForThisNilai; subIndex++) {
          const isFirstRowOfNilai = subIndex === 0;
          const isMainRow = subIndex === 0;

          let nilaiText = "-";
          let hasilText = "-";

          if (j.type === "Tanpa Faktor" || subIndex === 0) {
            nilaiText = j.text ?? "-";
            hasilText = hasilDisplay || "-";
          } else if (j.type === "Satu Faktor" && subIndex === 1) {
            nilaiText = j.pembilang ?? "-";
            hasilText = hasilRows?.[1] ?? "-";
          } else if (j.type === "Dua Faktor") {
            if (subIndex === 1) {
              nilaiText = j.pembilang ?? "-";
              hasilText = hasilRows?.[1] ?? "-";
            } else if (subIndex === 2) {
              nilaiText = j.penyebut ?? "-";
              hasilText = hasilRows?.[2] ?? "-";
            }
          }

          const rowData = [];

          // Kolom parameter (hanya di baris pertama parameter)
          if (currentRow === paramStartRow) {
            rowData.push(
              param.nomor || "-",
              formatPercent(param.bobot),
              param.judul || "-"
            );
          } else {
            rowData.push("", "", "");
          }

          // Kolom nomor nilai (ID Indikator) – hanya di baris utama
          if (isMainRow) {
            rowData.push(nilai.nomor ?? "-");
          } else {
            rowData.push("");
          }

          // Kolom ID Indikator (nilai text)
          rowData.push(nilaiText);

          // Kolom bobot nilai (hanya di baris utama)
          if (isMainRow) {
            rowData.push(formatPercent(nilai.bobot));
          } else {
            rowData.push("");
          }

          // Kolom Kode Emiten (hanya di baris utama)
          if (isMainRow) {
            rowData.push(nilai.kodeEmiten ?? "-");
          } else {
            rowData.push("");
          }

          // Kolom % Kepemilikan (hanya di baris utama)
          if (isMainRow) {
            // asumsikan nilai.kepemilikan sudah dalam bentuk persen atau angka
            rowData.push(nilai.kepemilikan ? formatPercent(nilai.kepemilikan) : "-");
          } else {
            rowData.push("");
          }

          // Kolom risk indicator (hanya di baris utama)
          const riskIndicators = ["low", "lowToModerate", "moderate", "moderateToHigh", "high"];
          riskIndicators.forEach(rk => {
            rowData.push(isMainRow ? (nilai.riskindikator?.[rk] ?? "-") : "");
          });

          // Kolom hasil (selalu diisi)
          rowData.push(hasilText);

          // Kolom peringkat, weighted, keterangan (hanya di baris pertama nilai)
          if (isFirstRowOfNilai) {
            rowData.push(Number.isFinite(peringkat) ? peringkat : "-");
            rowData.push(weightedDisplay || "");
            rowData.push(nilai.keterangan ?? "");
          } else {
            rowData.push("", "", "");
          }

          const row = worksheet.addRow(rowData);
          const rowIndex = currentRow;

          // Set tinggi baris
          if (isMainRow) row.height = 45;
          else row.height = 25;

          // Styling per cell
          row.eachCell((cell, colNumber) => {
            cell.border = {
              top: { style: 'thin', color: { argb: 'FF000000' } },
              left: { style: 'thin', color: { argb: 'FF000000' } },
              bottom: { style: 'thin', color: { argb: 'FF000000' } },
              right: { style: 'thin', color: { argb: 'FF000000' } }
            };
            cell.alignment = { vertical: 'middle', wrapText: true };
            if ([1,2,4,6,8,9,10,11,12,13,14,15,16].includes(colNumber)) {
              cell.alignment.horizontal = 'center';
            }

            // Warna background
            if (colNumber <= 3) {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F5FA' } };
            } else if (colNumber === 4) {
              if (isMainRow) {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F5FA' } };
              } else {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
              }
            } else if (colNumber === 5) {
              if (isMainRow) {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F5FA' } };
                cell.font = { bold: true };
              } else {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
                cell.font = { bold: false };
              }
            } else if (colNumber === 6 || colNumber === 7 || colNumber === 8) {
              if (isMainRow) {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F5FA' } };
              } else {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
              }
            } else if (colNumber >= 9 && colNumber <= 13) {
              if (isMainRow) {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9EAD3' } };
              } else {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
              }
            } else if (colNumber === 14) {
              if (isMainRow) {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
                cell.font = { bold: true };
              } else {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9EAD3' } };
                cell.font = { bold: false };
              }
            } else if (colNumber === 15) {
              if (isFirstRowOfNilai && Number.isFinite(peringkat)) {
                const bgColor = getRankBgColor(peringkat);
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
                cell.font = {
                  bold: true,
                  color: { argb: peringkat === 1 || peringkat === 5 ? 'FFFFFFFF' : 'FF000000' }
                };
                cell.alignment.horizontal = 'center';
              }
            } else if (colNumber === 16) {
              if (isFirstRowOfNilai) {
                cell.alignment.horizontal = 'center';
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
              }
            } else if (colNumber === 17) {
              if (isFirstRowOfNilai) {
                cell.alignment.horizontal = 'left';
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
              }
            }
          });

          currentRow++;
        }

        const nilaiEnd = currentRow - 1;

        // Merge cells untuk peringkat, weighted, keterangan (selalu merge)
        mergeRanges.push({ start: nilaiStart, end: nilaiEnd, col: 15 }); // Peringkat
        mergeRanges.push({ start: nilaiStart, end: nilaiEnd, col: 16 }); // Weighted
        mergeRanges.push({ start: nilaiStart, end: nilaiEnd, col: 17 }); // Keterangan

        // Untuk No Nilai (kolom 4) hanya merge jika tanpa faktor
        if (rowsForThisNilai === 1) {
          mergeRanges.push({ start: nilaiStart, end: nilaiEnd, col: 4 });
        }
      });

      // Merge parameter (No, Bobot, Parameter) jika lebih dari satu baris
      if (totalRowsForParam > 1) {
        mergeRanges.push({ start: paramStartRow, end: paramStartRow + totalRowsForParam - 1, col: 1 });
        mergeRanges.push({ start: paramStartRow, end: paramStartRow + totalRowsForParam - 1, col: 2 });
        mergeRanges.push({ start: paramStartRow, end: paramStartRow + totalRowsForParam - 1, col: 3 });
      }
    });

    // Apply merge
    mergeRanges.forEach(range => {
      if (range.start !== range.end) {
        const startCell = `${String.fromCharCode(64 + range.col)}${range.start}`;
        const endCell = `${String.fromCharCode(64 + range.col)}${range.end}`;
        worksheet.mergeCells(`${startCell}:${endCell}`);
        if (range.col !== 17) {
          const cell = worksheet.getCell(startCell);
          cell.alignment = { ...cell.alignment, horizontal: 'center', vertical: 'middle' };
        }
      }
    });

    // Baris summary
    const summaryBgColor = getSummaryBgColor(globalTotalWeighted);
    const summaryRowData = [
      '', '', '', '', '', '', '', '', '', '', '', '', '',
      'Summary', '', globalTotalWeighted.toFixed(2), ''
    ];
    const summaryRow = worksheet.addRow(summaryRowData);
    summaryRow.eachCell((cell, colNumber) => {
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
      };
      if (colNumber === 14 || colNumber === 15) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003366' } };
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      } else if (colNumber === 16) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: summaryBgColor } };
        cell.font = {
          bold: true,
          color: { argb: summaryBgColor === '4F6228' || summaryBgColor === 'FF0000' ? 'FFFFFFFF' : 'FF000000' }
        };
      }
    });

    // Download file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RiskProfile_${categoryLabel}_Inherent_${year}_${quarter}`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
    console.log('Export inherent berhasil!');
  } catch (error) {
    console.error('Error exporting inherent to Excel:', error);
    alert('Gagal mengexport data inherent ke Excel. Error: ' + error.message);
  }
}

// ==================== FUNGSI EXPORT KPMR ====================
async function exportKpmrToExcel({ rows = [], year, quarter, categoryLabel = "KonsentrasiProduk", selectedQuarters = ["Q1", "Q2", "Q3", "Q4"] }) {
  if (!Array.isArray(rows) || rows.length === 0) {
    alert("Tidak ada data KPMR untuk diekspor");
    return;
  }

  try {
    const normalizedRows = rows.map(row => ({
      ...row,
      pertanyaanList: Array.isArray(row.pertanyaanList) ? row.pertanyaanList : [],
    }));

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Risk Profile System';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet(`4. KPMR ${categoryLabel}`, {
      views: [{ showGridLines: true }]
    });

    const quarterCount = selectedQuarters.length;
    const hasSelectedQuarters = quarterCount > 0;

    // Kolom widths
    const columnWidths = [
      { width: 6 }, // A (tidak dipakai)
      { width: 6 }, // B: No. Pertanyaan
      { width: 30 }, // C: Pertanyaan judul
    ];
    for (let i = 0; i < quarterCount; i++) columnWidths.push({ width: 6 }); // D-G: Skor
    for (let i = 0; i < 5; i++) columnWidths.push({ width: 30 }); // H-L: Description Level
    columnWidths.push({ width: 30 }); // M: Evidence
    columnWidths.push({ width: 0 });  // N: blank
    worksheet.columns = columnWidths;

    // Judul
    const titleRow = worksheet.addRow([`Risk Profile OJK - ${categoryLabel} - Kualitas Penerapan Manajemen Risiko`]);
    titleRow.font = { size: 16, bold: true };
    worksheet.mergeCells('A1:N1');

    const yearQuarterRow = worksheet.addRow([`Tahun: ${year} | Quarter: ${quarter.toUpperCase()} | Tanggal Export: ${new Date().toLocaleDateString('id-ID')}`]);
    yearQuarterRow.font = { size: 12, italic: true };
    worksheet.mergeCells('A2:N2');

    worksheet.addRow([]); // baris kosong

    // Fungsi warna skor
    const getSkorBgColor = (skor) => {
      const num = Number(skor);
      if (num >= 4.5) return { bg: "FFFF0000", text: "FFFFFFFF" };
      if (num >= 3.5) return { bg: "FFFFC000", text: "FF000000" };
      if (num >= 2.5) return { bg: "FFFFFF00", text: "FF000000" };
      if (num >= 1.5) return { bg: "FF92D050", text: "FF000000" };
      if (num > 0)    return { bg: "FF4F6228", text: "FFFFFFFF" };
      return { bg: "FFF3F4F6", text: "FF000000" };
    };

    // Rata-rata per quarter per aspek
    const getQuarterAvg = (aspek, quarter) => {
      const list = aspek.pertanyaanList || [];
      if (list.length === 0) return "-";
      const skorValues = list
        .map((q) => {
          const skorValue = q.skor?.[quarter] || q.skor?.[quarter.toLowerCase()];
          if (skorValue !== "" && skorValue !== undefined && skorValue !== null) {
            const num = Number(skorValue);
            if (num >= 1 && num <= 5) return num;
          }
          return null;
        })
        .filter(v => v !== null);
      if (skorValues.length === 0) return "-";
      const avg = skorValues.reduce((a, b) => a + b, 0) / skorValues.length;
      return avg.toFixed(2);
    };

    // Summary global
    const calculateGlobalSummary = () => {
      const summary = { Q1: [], Q2: [], Q3: [], Q4: [] };
      normalizedRows.forEach((aspek) => {
        ["Q1", "Q2", "Q3", "Q4"].forEach((q) => {
          const avg = getQuarterAvg(aspek, q);
          if (avg !== "-") summary[q].push(Number(avg));
        });
      });
      const result = {};
      selectedQuarters.forEach((q) => {
        if (summary[q].length === 0) result[q] = "-";
        else result[q] = (summary[q].reduce((a, b) => a + b, 0) / summary[q].length).toFixed(2);
      });
      return result;
    };
    const globalSummary = calculateGlobalSummary();

    let currentRow = 4; // mulai setelah judul

    // Header 1 (baris 4)
    const headerRow2 = worksheet.getRow(currentRow);
    headerRow2.getCell(2).value = "Kualitas penerapan manajemen risiko";
    worksheet.mergeCells(`B${currentRow}:C${currentRow}`);
    selectedQuarters.forEach((quarter, idx) => {
      headerRow2.getCell(4 + idx).value = `Skor ${quarter}`;
    });
    headerRow2.getCell(8).value = "";
    worksheet.mergeCells(`H${currentRow}:L${currentRow}`);
    headerRow2.getCell(13).value = "";
    headerRow2.eachCell((cell, colNumber) => {
      if (colNumber >= 2 && colNumber <= 13) {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF000000' } },
          left: { style: 'thin', color: { argb: 'FF000000' } },
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
          right: { style: 'thin', color: { argb: 'FF000000' } }
        };
      }
    });
    currentRow++;

    // Loop aspek
    normalizedRows.forEach((aspek) => {
      const list = aspek.pertanyaanList || [];

      // Header aspek
      const aspekRow = worksheet.getRow(currentRow);
      aspekRow.getCell(2).value = `Aspek ${aspek.nomor || "-"} : ${aspek.judul || "-"} (Bobot: ${aspek.bobot || "0"}%)`;
      worksheet.mergeCells(`B${currentRow}:C${currentRow}`);
      selectedQuarters.forEach((quarter, idx) => {
        const avg = getQuarterAvg(aspek, quarter);
        const col = 4 + idx;
        aspekRow.getCell(col).value = avg !== "-" ? Number(avg) : "-";
        if (avg !== "-") {
          const color = getSkorBgColor(avg);
          aspekRow.getCell(col).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color.bg } };
          aspekRow.getCell(col).font = { bold: true, color: { argb: color.text } };
        }
      });
      const indicatorTitles = ["1 (Strong)", "2 (Satisfactory)", "3 (Fair)", "4 (Marginal)", "5 (Unsatisfactory)"];
      indicatorTitles.forEach((title, idx) => {
        aspekRow.getCell(8 + idx).value = title;
      });
      aspekRow.getCell(13).value = "Evidence";

      aspekRow.height = 30;
      aspekRow.eachCell((cell, colNumber) => {
        if (colNumber >= 2 && colNumber <= 13) {
          cell.font = { ...cell.font, bold: true, size: 11 };
          cell.alignment = { vertical: 'middle', horizontal: colNumber === 2 ? 'left' : 'center', wrapText: true };
          if (colNumber === 2 || colNumber === 3) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
            cell.font.color = { argb: 'FF000000' };
          } else if (colNumber >= 4 && colNumber <= 7) {
            if (cell.value === "-") {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
              cell.font.color = { argb: 'FF000000' };
            }
          } else if (colNumber >= 8 && colNumber <= 12) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
            cell.font.color = { argb: 'FFFFFFFF' };
          } else if (colNumber === 13) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } };
            cell.font.color = { argb: 'FFFFFFFF' };
          }
          cell.border = {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } }
          };
        }
      });
      currentRow++;

      if (list.length === 0) {
        const emptyRow = worksheet.getRow(currentRow);
        emptyRow.getCell(2).value = "Belum ada pertanyaan";
        worksheet.mergeCells(`B${currentRow}:M${currentRow}`);
        emptyRow.eachCell((cell, colNumber) => {
          if (colNumber >= 2 && colNumber <= 13) {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.font = { italic: true, color: { argb: 'FF6B7280' } };
            cell.border = {
              top: { style: 'thin', color: { argb: 'FF000000' } },
              left: { style: 'thin', color: { argb: 'FF000000' } },
              bottom: { style: 'thin', color: { argb: 'FF000000' } },
              right: { style: 'thin', color: { argb: 'FF000000' } }
            };
          }
        });
        currentRow++;
      } else {
        list.forEach((pertanyaan, qi) => {
          const pertanyaanRow = worksheet.getRow(currentRow);
          pertanyaanRow.getCell(2).value = pertanyaan.nomor || (qi + 1);
          pertanyaanRow.getCell(3).value = pertanyaan.pertanyaan || "-";
          selectedQuarters.forEach((quarter, idx) => {
            const col = 4 + idx;
            const skorValue = pertanyaan.skor?.[quarter] || pertanyaan.skor?.[quarter.toLowerCase()];
            const hasSkor = skorValue !== "" && skorValue !== undefined && skorValue !== null;
            pertanyaanRow.getCell(col).value = hasSkor ? skorValue : "-";
            if (hasSkor) {
              pertanyaanRow.getCell(col).font = { color: { argb: 'FF000000' } };
            }
          });
          const descKeys = ["strong", "satisfactory", "fair", "marginal", "unsatisfactory"];
          descKeys.forEach((key, idx) => {
            pertanyaanRow.getCell(8 + idx).value = pertanyaan.indicator?.[key] || "-";
          });
          pertanyaanRow.getCell(13).value = pertanyaan.evidence || "-";

          pertanyaanRow.height = 75;

          pertanyaanRow.eachCell((cell, colNumber) => {
            if (colNumber >= 2 && colNumber <= 13) {
              cell.alignment = {
                vertical: 'middle',
                horizontal: (colNumber === 3 || colNumber >= 8) ? 'left' : 'center',
                wrapText: true
              };
              cell.border = {
                top: { style: 'thin', color: { argb: 'FF000000' } },
                left: { style: 'thin', color: { argb: 'FF000000' } },
                bottom: { style: 'thin', color: { argb: 'FF000000' } },
                right: { style: 'thin', color: { argb: 'FF000000' } }
              };
              if (colNumber === 2 || colNumber === 3) {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: qi % 2 === 0 ? 'FFFFFFFF' : 'FFF8FAFC' } };
              }
            }
          });
          currentRow++;
        });
      }
    });

    // Baris summary
    if (hasSelectedQuarters) {
      const summaryRow = worksheet.getRow(currentRow);
      summaryRow.getCell(2).value = "Summary";
      worksheet.mergeCells(`B${currentRow}:C${currentRow}`);
      selectedQuarters.forEach((quarter, idx) => {
        const col = 4 + idx;
        const value = globalSummary[quarter];
        const hasValue = value !== "-";
        summaryRow.getCell(col).value = hasValue ? Number(value) : "-";
        if (hasValue) {
          const color = getSkorBgColor(value);
          summaryRow.getCell(col).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color.bg } };
          summaryRow.getCell(col).font = { bold: true, color: { argb: color.text } };
        }
      });
      summaryRow.eachCell((cell, colNumber) => {
        if (colNumber >= 2 && colNumber <= 13) {
          if (colNumber === 2 || colNumber === 3) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } };
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
          }
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.border = {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } }
          };
        }
      });
      currentRow++;
    }

    // Download file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RiskProfile_${categoryLabel}_KPMR_${year}_${quarter}`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
    console.log('Export KPMR berhasil!');
  } catch (error) {
    console.error('Error exporting KPMR to Excel:', error);
    alert('Gagal mengexport data KPMR ke Excel. Error: ' + error.message);
  }
}

export default function KonsentrasiProduk() {
  const {
    year,
    activeQuarter,
    search,
    exportRequestId,
    resetExport,
  } = useHeaderStore();

  const CATEGORY_ID = "konsentrasi-produk";

  const [activeTab, setActiveTab] = useState("inherent");
  const [inherentRows, setInherentRows] = useState([]);
  const [kpmrRows, setKpmrRows] = useState([]);
  const [isDataReady, setIsDataReady] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [lastSavedSignature, setLastSavedSignature] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const didMountRef = useRef(false);
  const initialRowsRef = useRef([]);
  const saveTimeoutRef = useRef(null);

  // Menyimpan data inherent dengan debouncing dan signature checking
  const saveInherentData = useCallback(() => {
    if (!isDataReady || !initialLoadDone || inherentRows.length === 0) {
      return false;
    }

    const currentSignature = getInherentSignature(inherentRows);
    if (currentSignature === lastSavedSignature && !isSaving) {
      return true;
    }

    setIsSaving(true);
    try {
      saveInherent({
        categoryId: CATEGORY_ID,
        year,
        quarter: activeQuarter,
        rows: inherentRows,
      });

      const derivedValues = inherentRows.flatMap(param =>
        (param.nilaiList || []).map(nilai => computeDerived(nilai, param))
      );
      const snapshot = computeInherentSnapshot(inherentRows);

      saveDerived({
        categoryId: CATEGORY_ID,
        year,
        quarter: activeQuarter,
        snapshot,
        values: derivedValues,
      });

      notifyRiskUpdated();
      setLastSavedSignature(currentSignature);
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [inherentRows, isDataReady, year, activeQuarter, initialLoadDone, lastSavedSignature, isSaving]);

  // Debounced save effect untuk inherent data
  useEffect(() => {
    if (!isDataReady || !initialLoadDone) return;
    if (activeTab !== "inherent") return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      const currentSignature = getInherentSignature(inherentRows);
      if (currentSignature !== lastSavedSignature) {
        saveInherentData();
      }
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [inherentRows, activeTab, isDataReady, initialLoadDone, lastSavedSignature, saveInherentData]);

  // Expose save function ke window object untuk external trigger
  useEffect(() => {
    if (activeTab === "inherent") {
      window.saveInherentData = () => {
        if (isSaving) return false;
        return saveInherentData();
      };
    }
    return () => {
      delete window.saveInherentData;
    };
  }, [saveInherentData, activeTab, isSaving]);

  // Load data saat tahun atau quarter berubah
  useEffect(() => {
    setIsDataReady(false);
    setInitialLoadDone(false);

    const inh = loadInherent({
      categoryId: CATEGORY_ID,
      year,
      quarter: activeQuarter,
    });

    const kpmr = loadKpmr({
      categoryId: CATEGORY_ID,
      year,
    });

    const normalizedInh = inh && inh.length > 0 ? normalizeInherentRows(inh) : [];
    initialRowsRef.current = normalizedInh;
    setLastSavedSignature(getInherentSignature(normalizedInh));
    setInherentRows(normalizedInh);
    setKpmrRows(kpmr && kpmr.length > 0 ? normalizeKpmrRows(kpmr) : []);

    setIsDataReady(true);
    setInitialLoadDone(true);
  }, [year, activeQuarter]);

  // Handle beforeunload untuk mencegah kehilangan data yang belum disimpan
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      const handleBeforeUnload = (e) => {
        if (activeTab === "inherent" && inherentRows.length > 0) {
          const currentSignature = getInherentSignature(inherentRows);
          if (currentSignature !== lastSavedSignature) {
            e.preventDefault();
            e.returnValue = "Ada perubahan yang belum disimpan. Yakin ingin keluar?";
            saveInherentData();
            return e.returnValue;
          }
        }
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [activeTab, inherentRows, lastSavedSignature, saveInherentData]);

  // Handler export dari header
  const handleExportToExcel = useCallback(async () => {
    if (activeTab === "inherent") {
      await exportInherentToExcel({
        rows: inherentRows,
        year,
        quarter: activeQuarter,
        categoryLabel: "Konsentrasi Produk",
      });
    } else if (activeTab === "kpmr") {
      await exportKpmrToExcel({
        rows: kpmrRows,
        year,
        quarter: activeQuarter,
        categoryLabel: "Konsentrasi Produk",
        selectedQuarters: ["Q1", "Q2", "Q3", "Q4"]
      });
    }
  }, [activeTab, inherentRows, kpmrRows, year, activeQuarter]);

  // Handle export request dari header (trigger via store)
  useEffect(() => {
    if (!exportRequestId || !isDataReady) return;
    handleExportToExcel();
    resetExport();
  }, [exportRequestId, isDataReady, handleExportToExcel, resetExport]);

  // Handler perubahan tab
  const handleTabChange = useCallback((tab) => {
    if (activeTab === "inherent" && inherentRows.length > 0) {
      const currentSignature = getInherentSignature(inherentRows);
      if (currentSignature !== lastSavedSignature) {
        // Optional: konfirmasi
      }
    }
    setActiveTab(tab);
  }, [activeTab, inherentRows, lastSavedSignature]);

  // Expose save KPMR function ke window object
  useEffect(() => {
    if (activeTab === "kpmr") {
      window.saveKpmrData = () => {
        try {
          saveKpmr({
            categoryId: CATEGORY_ID,
            year,
            rows: kpmrRows,
          });
          return true;
        } catch (error) {
          console.error("Gagal menyimpan KPMR:", error);
          return false;
        }
      };
    }
    return () => {
      delete window.saveKpmrData;
    };
  }, [kpmrRows, year, activeTab]);

  // Immediate save untuk KPMR
  const saveKpmrDataImmediate = useCallback((rowsToSave = null) => {
    const rows = rowsToSave || kpmrRows;
    try {
      saveKpmr({
        categoryId: CATEGORY_ID,
        year,
        rows,
      });
      return true;
    } catch (error) {
      console.error("Gagal menyimpan KPMR:", error);
      return false;
    }
  }, [kpmrRows, year]);

  // Immediate save untuk inherent
  const saveInherentDataImmediate = useCallback((rowsToSave = null) => {
    const rows = rowsToSave || inherentRows;
    if (!isDataReady || !initialLoadDone) {
      console.log('Cannot save: data not ready');
      return false;
    }

    setIsSaving(true);
    try {
      saveInherent({
        categoryId: CATEGORY_ID,
        year,
        quarter: activeQuarter,
        rows,
      });

      const derivedValues = rows.flatMap(param =>
        (param.nilaiList || []).map(nilai => computeDerived(nilai, param))
      );
      const snapshot = computeInherentSnapshot(rows);

      saveDerived({
        categoryId: CATEGORY_ID,
        year,
        quarter: activeQuarter,
        snapshot,
        values: derivedValues,
      });

      notifyRiskUpdated();
      setLastSavedSignature(getInherentSignature(rows));
      return true;
    } catch (error) {
      console.error("Save failed:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [isDataReady, year, activeQuarter, initialLoadDone, inherentRows]);

  useEffect(() => {
    if (activeTab === "inherent") {
      window.saveInherentData = () => {
        if (isSaving) return false;
        return saveInherentDataImmediate();
      };
    }
    return () => {
      delete window.saveInherentData;
    };
  }, [saveInherentDataImmediate, activeTab, isSaving]);

  return (
    <div className="w-full space-y-4">
      <Header
        title="Risk Profile – Konsentrasi Produk"
        onExportClick={handleExportToExcel}
        categoryId={CATEGORY_ID}
        activeTab={activeTab}
      />

      <RiskTabs value={activeTab} onChange={handleTabChange} />

      <div className="w-full">
        {activeTab === "inherent" && (
          <InherentPage
            rows={inherentRows}
            setRows={setInherentRows}
            search={search}
            active
            onSaveData={saveInherentDataImmediate}
          />
        )}
        {activeTab === "kpmr" && (
          <KpmrPage
            rows={kpmrRows}
            setRows={setKpmrRows}
            search={search}
            onSaveData={saveKpmrDataImmediate}
          />
        )}
      </div>
    </div>
  );
}