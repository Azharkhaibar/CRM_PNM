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
        portofolio: n.portofolio,
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

// Fungsi untuk export data inherent ke Excel
async function exportInherentToExcel({ rows = [], year, quarter, categoryLabel = "PasarProduk" }) {
  if (!Array.isArray(rows) || rows.length === 0) {
    alert("Tidak ada data inherent untuk diekspor");
    return;
  }

  try {
    // Buat workbook baru
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Risk Profile System';
    workbook.created = new Date();
    
    // Tambahkan worksheet
    const worksheet = workbook.addWorksheet(`1. Inherent ${categoryLabel}`, {
      views: [{ showGridLines: true }]
    });

    // Set kolom widths sesuai permintaan
    worksheet.columns = [
      { width: 5 },    // 1. No Parameter
      { width: 7 },    // 2. Bobot Parameter
      { width: 26 },   // 3. Parameter
      { width: 5 },    // 4. No Nilai
      { width: 30 },   // 5. Nilai
      { width: 7 },    // 6. Bobot Nilai
      { width: 25 },   // 7. % Dalam Portofolio
      { width: 15 },   // 8. Low
      { width: 15 },   // 9. Low To Moderate
      { width: 15 },   // 10. Moderate
      { width: 15 },   // 11. Moderate To High
      { width: 15 },   // 12. High
      { width: 15 },   // 13. Hasil (Lebar 15 sesuai permintaan)
      { width: 15 },   // 14. Peringkat (Lebar 15 sesuai permintaan)
      { width: 15 },   // 15. Weighted (Lebar 15 sesuai permintaan)
      { width: 25 },   // 16. Keterangan
    ];

    // Tambahkan judul
    const titleRow = worksheet.addRow([`Risk Profile OJK - ${categoryLabel}`]);
    titleRow.font = { size: 16, bold: true };
    worksheet.mergeCells('A1:P1');
    
    const yearQuarterRow = worksheet.addRow([`Tahun: ${year} | Quarter: ${quarter.toUpperCase()} | Tanggal Export: ${new Date().toLocaleDateString('id-ID')}`]);
    yearQuarterRow.font = { size: 12, italic: true };
    worksheet.mergeCells('A2:P2');
    
    // Baris kosong
    worksheet.addRow([]);

    // Header tabel
    const headerRow = worksheet.addRow([
      'No', 'Bobot', 'Parameter', 'No', 'Nilai', 'Bobot', '% Dalam Portofolio',
      'Low', 'Low To Moderate', 'Moderate', 'Moderate To High', 'High',
      'Hasil', 'Peringkat', 'Weighted', 'Keterangan'
    ]);

    // Style untuk header
    headerRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      
      // Background warna berdasarkan kolom
      if (colNumber <= 3) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF003366' } // Biru tua untuk header parameter
        };
      } else if (colNumber >= 8 && colNumber <= 12) {
        // Warna untuk kolom risk indicator
        const colors = [
          'FF4F6228', // Low
          'FF92D050', // Low To Moderate
          'FFFFFF00', // Moderate
          'FFF97316', // Moderate To High
          'FFFF0000'  // High
        ];
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: colors[colNumber - 8] }
        };
        
        // Set font color untuk kontras
        if (colNumber === 12) { // High - merah
          cell.font.color = { argb: 'FFFFFFFF' };
        } else if (colNumber === 8) { // Low - hijau tua
          cell.font.color = { argb: 'FFFFFFFF' };
        } else {
          cell.font.color = { argb: 'FF000000' };
        }
      } else if (colNumber >= 13 && colNumber <= 15) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF000033' } // Biru sangat tua untuk hasil
        };
        cell.font.color = { argb: 'FFFFFFFF' };
      } else {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF003366' }
        };
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

      const rounded =
        Math.abs(percent - Math.round(percent)) < 1e-9
          ? Math.round(percent)
          : percent.toFixed(2);

      return `${rounded}%`;
    };

    // Fungsi untuk menentukan warna background berdasarkan nilai
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

    // Fungsi untuk menentukan warna background summary
    const getSummaryBgColor = (total) => {
      if (!Number.isFinite(total)) return 'FFFFFF';

      if (total <= 1) return '4F6228';
      if (total <= 2) return '92D050';
      if (total <= 3) return 'FFFF00';
      if (total <= 4) return 'F97316';
      return 'FF0000';
    };

    // Tambahkan data baris
    let globalTotalWeighted = 0;
    let currentRow = 5; // Start dari row 5 (setelah header)

    // Objek untuk tracking merge cells
    const mergeRanges = [];

    rows.forEach((param, pi) => {
      const nilaiList = Array.isArray(param.nilaiList) ? param.nilaiList : [];

      if (nilaiList.length === 0) {
        // Baris kosong untuk parameter tanpa nilai
        const emptyRow = [
          param.nomor || "-",
          formatPercent(param.bobot),
          param.judul || "-",
          "", "", "", "", "", "", "", "", "", "", "", "", "Belum ada nilai untuk parameter ini"
        ];

        worksheet.addRow(emptyRow);
        
        // Apply styles untuk baris kosong
        const row = worksheet.getRow(currentRow);
        row.eachCell((cell, colNumber) => {
          if (colNumber <= 3) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFE8F5FA' }
            };
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

      // Hitung total baris untuk parameter ini
      const totalRowsForParam = nilaiList.reduce((total, nilai) => {
        const j = nilai.judul || { type: "Tanpa Faktor" };
        if (j.type === "Satu Faktor") return total + 2;
        if (j.type === "Dua Faktor") return total + 3;
        return total + 1;
      }, 0);

      const paramStartRow = currentRow;
      let nilaiStartRow = currentRow;

      nilaiList.forEach((nilai, ni) => {
        const derived = computeDerived(nilai, param);
        const { hasilDisplay, hasilRows, peringkat, weightedDisplay, weighted } = derived;
        
        // Hitung weighted untuk global total
        if (Number.isFinite(weighted)) {
          globalTotalWeighted += weighted;
        }

        const j = nilai.judul || { type: "Tanpa Faktor" };
        
        let rowsForThisNilai = 1;
        if (j.type === "Satu Faktor") rowsForThisNilai = 2;
        if (j.type === "Dua Faktor") rowsForThisNilai = 3;

        const nilaiStart = currentRow;

        // Simpan row untuk No Nilai
        const noNilaiRow = currentRow;

        for (let subIndex = 0; subIndex < rowsForThisNilai; subIndex++) {
          const isFirstRowOfNilai = subIndex === 0;
          const isMainRow = subIndex === 0; // Baris utama (judul nilai)
          
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

          // Kolom parameter (hanya muncul di baris pertama parameter)
          if (currentRow === paramStartRow) {
            rowData.push(
              param.nomor || "-",
              formatPercent(param.bobot),
              param.judul || "-"
            );
          } else {
            rowData.push("", "", "");
          }

          // Kolom nomor nilai (HANYA di baris judul nilai)
          if (isMainRow) {
            rowData.push(nilai.nomor ?? "-");
          } else {
            // Baris pembilang/penyebut: No Nilai KOSONG (tidak di-merge)
            rowData.push("");
          }

          // Kolom nilai teks
          rowData.push(nilaiText);

          // Kolom bobot nilai (hanya di baris pertama nilai)
          if (isMainRow) {
            rowData.push(formatPercent(nilai.bobot));
          } else {
            rowData.push("");
          }

          // Kolom portofolio (hanya di baris pertama nilai)
          if (isMainRow) {
            rowData.push(nilai.portofolio ?? "-");
          } else {
            rowData.push("");
          }

          // Kolom risk indicator (hanya di baris pertama nilai)
          const riskIndicators = ["low", "lowToModerate", "moderate", "moderateToHigh", "high"];
          riskIndicators.forEach(rk => {
            rowData.push(isMainRow ? (nilai.riskindikator?.[rk] ?? "-") : "");
          });

          // Kolom hasil (selalu diisi)
          rowData.push(hasilText);

          // Kolom peringkat (hanya di baris pertama nilai)
          if (isFirstRowOfNilai) {
            rowData.push(Number.isFinite(peringkat) ? peringkat : "-");
            rowData.push(weightedDisplay || "");
            rowData.push(nilai.keterangan ?? "");
          } else {
            rowData.push("", "", "");
          }

          // Tambahkan baris
          const row = worksheet.addRow(rowData);
          const rowIndex = currentRow;

          // SET TINGGI BARIS SESUAI PERMINTAAN
          if (isMainRow) {
            // Baris utama (judul nilai): tinggi 45
            row.height = 45;
          } else {
            // Baris pembilang/penyebut: tinggi 25
            row.height = 25;
          }

          // Apply styles
          row.eachCell((cell, colNumber) => {
            // Set border untuk semua sel
            cell.border = {
              top: { style: 'thin', color: { argb: 'FF000000' } },
              left: { style: 'thin', color: { argb: 'FF000000' } },
              bottom: { style: 'thin', color: { argb: 'FF000000' } },
              right: { style: 'thin', color: { argb: 'FF000000' } }
            };

            // Alignment umum
            cell.alignment = { vertical: 'middle', wrapText: true };

            // Alignment khusus per kolom
            if ([1, 2, 4, 6, 8, 9, 10, 11, 12, 13, 14, 15].includes(colNumber)) {
              cell.alignment.horizontal = 'center';
            }

            // Background colors
            if (colNumber <= 3) {
              // Kolom parameter - selalu #E8F5FA
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE8F5FA' }
              };
            } else if (colNumber === 4) {
              // Kolom nomor nilai
              if (isMainRow) {
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FFE8F5FA' }
                };
              } else {
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FFFFFFFF' }
                };
              }
            } else if (colNumber === 5) {
              // Kolom nilai
              if (isMainRow) {
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FFE8F5FA' }
                };
                cell.font = { bold: true };
              } else {
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FFFFFFFF' }
                };
                cell.font = { bold: false };
              }
            } else if (colNumber === 6 || colNumber === 7) {
              // Kolom bobot nilai dan portofolio
              if (isMainRow) {
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FFE8F5FA' }
                };
              } else {
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FFFFFFFF' }
                };
              }
            } else if (colNumber >= 8 && colNumber <= 12) {
              // Kolom risk indicator
              if (isMainRow) {
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FFD9EAD3' } // Light green
                };
              } else {
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FFFFFFFF' }
                };
              }
            } else if (colNumber === 13) {
              // Kolom hasil - text center
              cell.alignment.horizontal = 'center';
              if (isMainRow) {
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FFFFFFFF' } // Putih untuk baris utama hasil
                };
                cell.font = { bold: true };
              } else {
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FFD9EAD3' } // Light green untuk baris faktor
                };
                cell.font = { bold: false };
              }
            } else if (colNumber === 14) {
              // Kolom peringkat
              if (isFirstRowOfNilai && Number.isFinite(peringkat)) {
                const bgColor = getRankBgColor(peringkat);
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: bgColor }
                };
                cell.font = { 
                  bold: true,
                  color: { argb: peringkat === 1 || peringkat === 5 ? 'FFFFFFFF' : 'FF000000' }
                };
                cell.alignment.horizontal = 'center';
              }
            } else if (colNumber === 15) {
              // Kolom weighted
              if (isFirstRowOfNilai) {
                cell.alignment.horizontal = 'center';
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FFFFFFFF' }
                };
              }
            } else if (colNumber === 16) {
              // Kolom keterangan
              if (isFirstRowOfNilai) {
                cell.alignment.horizontal = 'left';
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FFFFFFFF' }
                };
              }
            }
          });

          currentRow++;
        }

        const nilaiEnd = currentRow - 1;

        // PERUBAHAN PENTING: Hanya merge No Nilai, Peringkat, Weighted, Keterangan jika hanya ada 1 baris (Tanpa Faktor)
        if (rowsForThisNilai === 1) {
          // Untuk Tanpa Faktor: merge vertikal seperti biasa
          mergeRanges.push({
            start: nilaiStart,
            end: nilaiEnd,
            col: 4, // Kolom D (No Nilai)
            peringkat: peringkat,
            weighted: weightedDisplay
          });
          
          mergeRanges.push({
            start: nilaiStart,
            end: nilaiEnd,
            col: 14 // Kolom N (Peringkat)
          });
          
          mergeRanges.push({
            start: nilaiStart,
            end: nilaiEnd,
            col: 15 // Kolom O (Weighted)
          });
          
          mergeRanges.push({
            start: nilaiStart,
            end: nilaiEnd,
            col: 16 // Kolom P (Keterangan)
          });
        } else {
          // Untuk Satu Faktor dan Dua Faktor: TIDAK merge No Nilai, hanya merge Peringkat, Weighted, Keterangan
          mergeRanges.push({
            start: nilaiStart,
            end: nilaiEnd,
            col: 14 // Kolom N (Peringkat)
          });
          
          mergeRanges.push({
            start: nilaiStart,
            end: nilaiEnd,
            col: 15 // Kolom O (Weighted)
          });
          
          mergeRanges.push({
            start: nilaiStart,
            end: nilaiEnd,
            col: 16 // Kolom P (Keterangan)
          });
          
          // No Nilai TIDAK di-merge, hanya ada di baris judul nilai
        }

        nilaiStartRow = currentRow;
      });

      // Merge cells untuk parameter (No, Bobot, Parameter)
      if (totalRowsForParam > 1) {
        mergeRanges.push({
          start: paramStartRow,
          end: paramStartRow + totalRowsForParam - 1,
          col: 1 // Kolom A (No)
        });
        
        mergeRanges.push({
          start: paramStartRow,
          end: paramStartRow + totalRowsForParam - 1,
          col: 2 // Kolom B (Bobot)
        });
        
        mergeRanges.push({
          start: paramStartRow,
          end: paramStartRow + totalRowsForParam - 1,
          col: 3 // Kolom C (Parameter)
        });
      }
    });

    // Apply merge cells setelah semua data ditambahkan
    mergeRanges.forEach(range => {
      if (range.start !== range.end) {
        const startCell = `${String.fromCharCode(64 + range.col)}${range.start}`;
        const endCell = `${String.fromCharCode(64 + range.col)}${range.end}`;
        worksheet.mergeCells(`${startCell}:${endCell}`);
        
        // Center alignment untuk kolom yang di-merge (kecuali keterangan)
        if (range.col !== 16) {
          const cell = worksheet.getCell(startCell);
          cell.alignment = { 
            ...cell.alignment, 
            horizontal: 'center',
            vertical: 'middle'
          };
          
          // Jika ini kolom peringkat dan ada nilai peringkat, set warna background
          if (range.col === 14 && range.peringkat !== undefined && Number.isFinite(range.peringkat)) {
            const bgColor = getRankBgColor(range.peringkat);
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: bgColor }
            };
            cell.font = { 
              bold: true,
              color: { argb: range.peringkat === 1 || range.peringkat === 5 ? 'FFFFFFFF' : 'FF000000' }
            };
          }
        }
      }
    });

    // Tambahkan baris summary
    const summaryBgColor = getSummaryBgColor(globalTotalWeighted);
    const summaryRowData = [
      '', '', '', '', '', '', '', '', '', '', '', '',
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

      if (colNumber === 13 || colNumber === 14) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF003366' }
        };
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      } else if (colNumber === 15) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: summaryBgColor }
        };
        cell.font = { 
          bold: true, 
          color: { argb: summaryBgColor === '4F6228' || summaryBgColor === 'FF0000' ? 'FFFFFFFF' : 'FF000000' } 
        };
      }
    });

    // Generate file Excel
    const buffer = await workbook.xlsx.writeBuffer();
    
    // Download file
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RiskProfile_${categoryLabel}_Inherent_${year}_${quarter}`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);

    console.log('Export successful!');
    
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    alert('Gagal mengexport data ke Excel. Silakan coba lagi.\nError: ' + error.message);
  }
}

// Fungsi untuk export data KPMR ke Excel
async function exportKpmrToExcel({ 
  rows = [], 
  year, 
  quarter, 
  categoryLabel = "PasarProduk",
  selectedQuarters = ["Q1", "Q2", "Q3", "Q4"] 
}) {
  if (!Array.isArray(rows) || rows.length === 0) {
    alert("Tidak ada data KPMR untuk diekspor");
    return;
  }

  try {
    // Normalize rows terlebih dahulu
    const normalizedRows = rows.map(row => ({
      ...row,
      pertanyaanList: Array.isArray(row.pertanyaanList) ? row.pertanyaanList : [],
    }));

    // Buat workbook baru
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Risk Profile System';
    workbook.created = new Date();
    
    // Tambahkan worksheet
    const worksheet = workbook.addWorksheet(`1. KPMR ${categoryLabel}`, {
      views: [{ showGridLines: true }]
    });

    // Hitung jumlah kolom berdasarkan quarter yang dipilih
    const quarterCount = selectedQuarters.length;
    const hasSelectedQuarters = quarterCount > 0;
    
    // Set kolom widths sesuai permintaan
    const columnWidths = [
      { width: 6 },    // Kolom A (tidak dipakai)
      { width: 6 },    // Kolom B: No. Pertanyaan
      { width: 30 },   // Kolom C: Pertanyaan judul
    ];
    
    // Tambahkan kolom untuk setiap quarter yang dipilih (lebar 6)
    for (let i = 0; i < quarterCount; i++) {
      columnWidths.push({ width: 6 }); // Kolom D-G: Skor Q1-Q4
    }
    
    // Tambahkan kolom Description Level (5 kolom dengan lebar 30)
    for (let i = 0; i < 5; i++) {
      columnWidths.push({ width: 30 }); // Kolom H-L: Description Level
    }
    
    // Tambahkan kolom Evidence (lebar 30)
    columnWidths.push({ width: 30 }); // Kolom M: Evidence
    columnWidths.push({ width: 0 }); // Kolom N: Blank
    
    worksheet.columns = columnWidths;

    // **TAMBAHKAN JUDUL SAMA SEPERTI DI exportInherentToExcel**
    // Baris 1: Judul utama
    const titleRow = worksheet.addRow([`Risk Profile OJK - ${categoryLabel} - Kualitas Penerapan Manajemen Risiko`]);
    titleRow.font = { size: 16, bold: true };
    worksheet.mergeCells('A1:N1');
    
    // Baris 2: Informasi tahun, quarter, dan tanggal export
    const yearQuarterRow = worksheet.addRow([`Tahun: ${year} | Quarter: ${quarter.toUpperCase()} | Tanggal Export: ${new Date().toLocaleDateString('id-ID')}`]);
    yearQuarterRow.font = { size: 12, italic: true };
    worksheet.mergeCells('A2:N2');
    
    // Baris 3: Baris kosong
    worksheet.addRow([]);

    // Fungsi untuk menentukan warna background berdasarkan skor
const getSkorBgColor = (skor) => {
  const num = Number(skor);

  if (num >= 4.5) return { bg: "FFFF0000", text: "FFFFFFFF" }; // High
  if (num >= 3.5) return { bg: "FFFFC000", text: "FF000000" };
  if (num >= 2.5) return { bg: "FFFFFF00", text: "FF000000" };
  if (num >= 1.5) return { bg: "FF92D050", text: "FF000000" };
  if (num > 0)    return { bg: "FF4F6228", text: "FFFFFFFF" }; // Low

  return { bg: "FFF3F4F6", text: "FF000000" };
};


    // Fungsi untuk menentukan warna teks berdasarkan skor
    const getSkorTextColor = (skor) => {
      const num = Number(skor);
      if (num >= 2.5 && num < 3.5) return "FF000000"; // Hitam untuk yellow background
      if (num >= 1.5 && num < 2.5) return "FF000000"; // Hitam untuk lime background
      return "FFFFFFFF"; // Putih untuk background lainnya
    };

    // Fungsi untuk menghitung rata-rata per quarter untuk suatu aspek
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
        .filter((v) => v !== null);

      if (skorValues.length === 0) return "-";

      const avg = skorValues.reduce((a, b) => a + b, 0) / skorValues.length;
      return avg.toFixed(2);
    };

    // Fungsi untuk menghitung summary global
    const calculateGlobalSummary = () => {
      const summary = { Q1: [], Q2: [], Q3: [], Q4: [] };

      normalizedRows.forEach((aspek) => {
        ["Q1", "Q2", "Q3", "Q4"].forEach((quarter) => {
          const avg = getQuarterAvg(aspek, quarter);
          if (avg !== "-") {
            summary[quarter].push(Number(avg));
          }
        });
      });

      const result = {};
      selectedQuarters.forEach((quarter) => {
        if (summary[quarter].length === 0) {
          result[quarter] = "-";
        } else {
          const total = summary[quarter].reduce((a, b) => a + b, 0);
          result[quarter] = (total / summary[quarter].length).toFixed(2);
        }
      });

      return result;
    };

    const globalSummary = calculateGlobalSummary();

    // **START DI BARIS 4 (setelah judul dan baris kosong)**
    let currentRow = 4;

    // Header 1 - Baris 4
    const headerRow2 = worksheet.getRow(currentRow);
    
    // 1. Kualitas penerapan manajemen risiko - Kolom B4, merge 2 cell (B4:C4), lebar 35
    headerRow2.getCell(2).value = "Kualitas penerapan manajemen risiko";
    worksheet.mergeCells(`B${currentRow}:C${currentRow}`);
    
    // 2. Skor Q1-Q4 - Kolom D4:G4 dengan lebar masing-masing 6
    selectedQuarters.forEach((quarter, index) => {
      const col = 4 + index; // D=4, E=5, F=6, G=7
      headerRow2.getCell(col).value = `Skor ${quarter}`;
    });
    
    // 3. Description Level - Kolom H4, merge 5 kolom (H4:L4)
    headerRow2.getCell(8).value = "";
    worksheet.mergeCells(`H${currentRow}:L${currentRow}`);
    
    // 4. Evidence - Kolom M4
    headerRow2.getCell(13).value = "";

    // Style untuk Header 1 (Baris 4)
    headerRow2.eachCell((cell, colNumber) => {
      if (colNumber >= 2 && colNumber <= 13) { // Hanya kolom B-M yang diisi
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        
        // Background warna untuk header
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF1E40AF' } // Blue-900
        };
        
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF000000' } },
          left: { style: 'thin', color: { argb: 'FF000000' } },
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
          right: { style: 'thin', color: { argb: 'FF000000' } }
        };
      }
    });

    currentRow++; // Pindah ke baris 5

    // LANGSUNG KE DATA ASPEK - TIDAK ADA BARIS KOSONG ANTARA HEADER DAN ASPEK
    // Fungsi untuk membuat header per aspek
    const createAspekHeader = (rowNumber, aspek) => {
      const aspekRow = worksheet.getRow(rowNumber);
      
      // 1. `Aspek ${aspek.nomor} : ${aspek.judul} (Bobot: ${aspek.bobot}%)`
      // Kolom B, merge 2 cell (B:C), lebar 45
      aspekRow.getCell(2).value = `Aspek ${aspek.nomor || "-"} : ${aspek.judul || "-"} (Bobot: ${aspek.bobot || "0"}%)`;
      worksheet.mergeCells(`B${rowNumber}:C${rowNumber}`);
      
      // 2. GetQuarterAvg per quarter - Kolom D, E, F, G
      selectedQuarters.forEach((quarter, qIndex) => {
        const avg = getQuarterAvg(aspek, quarter);
        const col = 4 + qIndex; // D=4, E=5, F=6, G=7
        aspekRow.getCell(col).value = avg !== "-" ? Number(avg) : "-";
        
        // Set warna background berdasarkan skor
        if (avg !== "-") {
          const color = getSkorBgColor(avg);
          
          aspekRow.getCell(col).fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: color.bg }
};

aspekRow.getCell(col).font = {
  ...aspekRow.getCell(col).font,
  bold: true,
  color: { argb: color.text }
};
        }
      });

      aspekRow.height = 30 ;
      
      // 3. Kolom H-L - Indicator titles untuk setiap ASPEK
      const indicatorTitles = ["1 (Strong)", "2 (Satisfactory)", "3 (Fair)", "4 (Marginal)", "5 (Unsatisfactory)"];
      indicatorTitles.forEach((title, index) => {
        const col = 8 + index; // H=8, I=9, J=10, K=11, L=12
        aspekRow.getCell(col).value = title;
      });
      
      // 4. Evidence - Kolom M
      aspekRow.getCell(13).value = "Evidence";

      // Style untuk baris header aspek
      aspekRow.eachCell((cell, colNumber) => {
        if (colNumber >= 2 && colNumber <= 13) {
          cell.font = {
  ...cell.font,
  bold: true,
  size: 11
};

          cell.alignment = { 
            vertical: 'middle', 
            horizontal: colNumber === 2 ? 'left' : 'center', 
            wrapText: true 
          };
          
          // Background untuk baris header aspek
          if (colNumber === 2 || colNumber === 3) {
            // Kolom B-C (Aspek)
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFF1F5F9' } // Gray-100
            };
            cell.font.color = { argb: 'FF000000' };
          } else if (colNumber >= 4 && colNumber <= 7) {
            // Kolom D-G (Skor Quarter)
            if (cell.value === "-") {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFF1F5F9' }
              };
              cell.font.color = { argb: 'FF000000' };
            }
          } else if (colNumber >= 8 && colNumber <= 12) {
            // Kolom H-L (Description Level Header)
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF0F172A' } // Blue-950
            };
            cell.font.color = { argb: 'FFFFFFFF' };
          } else if (colNumber === 13) {
            // Kolom M (Evidence Header)
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF1E40AF' } // Blue-900
            };
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
    };

    normalizedRows.forEach((aspek, ai) => {
      const list = aspek.pertanyaanList || [];
      
      // Baris header aspek - LANGSUNG SETELAH HEADER GLOBAL
      createAspekHeader(currentRow, aspek);
      currentRow++;

      // Tambahkan pertanyaan
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
          
          // 1. no.pertanyaan - Kolom B (lebar 6)
          pertanyaanRow.getCell(2).value = pertanyaan.nomor || (qi + 1);
          
          // 2. Pertanyaan.judul - Kolom C (lebar 30)
          pertanyaanRow.getCell(3).value = pertanyaan.pertanyaan || "-";
          
          // 3-6. skorPertanyaan Q1-Q4 - Kolom D, E, F, G (TIDAK PAKE BACKGROUND)
          selectedQuarters.forEach((quarter, qIndex) => {
            const col = 4 + qIndex; // D=4, E=5, F=6, G=7
            const skorValue = pertanyaan.skor?.[quarter] || pertanyaan.skor?.[quarter.toLowerCase()];
            const hasSkor = skorValue !== "" && skorValue !== undefined && skorValue !== null;
            
            pertanyaanRow.getCell(col).value = hasSkor ? skorValue : "-";
            
            // TIDAK PAKAI BACKGROUND INDICATOR - hanya font warna hitam
            if (hasSkor) {
              pertanyaanRow.getCell(col).font = {
                color: { argb: 'FF000000' } // Hitam saja, tanpa background
              };
            }
          });
          
          // Description Level values - Kolom H-L
          const descriptionKeys = ["strong", "satisfactory", "fair", "marginal", "unsatisfactory"];
          descriptionKeys.forEach((key, index) => {
            const col = 8 + index; // H=8, I=9, J=10, K=11, L=12
            pertanyaanRow.getCell(col).value = pertanyaan.indicator?.[key] || "-";
          });
          
          // Evidence - Kolom M
          pertanyaanRow.getCell(13).value = pertanyaan.evidence || "-";

          // **SET TINGGI BARIS PERTANYAAN MENJADI 75**
          pertanyaanRow.height = 75;

          // Style untuk baris pertanyaan
          pertanyaanRow.eachCell((cell, colNumber) => {
            if (colNumber >= 2 && colNumber <= 13) {
              cell.alignment = { 
                vertical: 'middle', 
                horizontal: (colNumber === 3 || colNumber >= 8 && colNumber <= 13) ? 'left' : 'center',
                wrapText: true 
              };
              
              cell.border = {
                top: { style: 'thin', color: { argb: 'FF000000' } },
                left: { style: 'thin', color: { argb: 'FF000000' } },
                bottom: { style: 'thin', color: { argb: 'FF000000' } },
                right: { style: 'thin', color: { argb: 'FF000000' } }
              };
              
              // Alternating row colors untuk kolom B dan C
              if (colNumber === 2 || colNumber === 3) {
                if (qi % 2 === 0) {
                  cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFFFFF' }
                  };
                } else {
                  cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFF8FAFC' }
                  };
                }
              }
            }
          });

          currentRow++;
        });
      }
    });

    // Tambahkan baris summary
    if (hasSelectedQuarters) {
      // TIDAK ADA BARIS KOSONG SEBELUM SUMMARY - langsung tambahkan summary
      const summaryRow = worksheet.getRow(currentRow);
      
      summaryRow.getCell(2).value = "Summary";
      worksheet.mergeCells(`B${currentRow}:C${currentRow}`);
      
      selectedQuarters.forEach((quarter, index) => {
        const col = 4 + index; // D=4, E=5, F=6, G=7
        const value = globalSummary[quarter];
        const hasValue = value !== "-";
        
        summaryRow.getCell(col).value = hasValue ? Number(value) : "-";
        
        if (hasValue) {
          const color = getSkorBgColor(value);

summaryRow.getCell(col).fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: color.bg }
};

summaryRow.getCell(col).font = {
  bold: true,
  color: { argb: color.text }
};
        }
      });
      
      // Style untuk baris summary
      summaryRow.eachCell((cell, colNumber) => {
        if (colNumber >= 2 && colNumber <= 13) {
          if (colNumber === 2 || colNumber === 3) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF1E40AF' } // Blue-900
            };
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

    // Set row heights untuk semua baris
    for (let i = 1; i <= currentRow; i++) {
      const row = worksheet.getRow(i);
      if (row) {
        if (i === 1) {
          row.height = 30; // Judul utama
        } else if (i === 2) {
          row.height = 25; // Informasi tahun/quarter
        } else if (i === 3) {
          row.height = 10; // Baris kosong - tinggi kecil
        } else if (i === 4) {
          row.height = 30; // Header utama
        } else if (i === 5) {
          // Baris header aspek pertama
          // Tinggi akan diatur oleh createAspekHeader
        }
        // Untuk baris pertanyaan, tinggi sudah diatur di atas menjadi 75
        // Untuk baris lainnya, tetap 30
      }
    }

    // Generate file Excel
    const buffer = await workbook.xlsx.writeBuffer();
    
    // Download file
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RiskProfile_${categoryLabel}_KPMR_${year}_${quarter}`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);

    console.log('Export KPMR successful!');
    
  } catch (error) {
    console.error('Error exporting KPMR to Excel:', error);
    alert('Gagal mengexport data KPMR ke Excel. Silakan coba lagi.\nError: ' + error.message);
  }
}

// Fungsi untuk import data inherent dari Excel
async function importInherentFromExcel(file) {
  if (!file) throw new Error("Tidak ada file");

  const buffer = await file.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const ws = workbook.worksheets[0];
  if (!ws) throw new Error("Sheet tidak ditemukan");

  // cari header
  let headerRow = 0;
  for (let i = 1; i <= 10; i++) {
    if (ws.getRow(i).getCell(1).value === "No") {
      headerRow = i;
      break;
    }
  }
  if (!headerRow) throw new Error("Header tidak ditemukan");

  const imported = [];
  let currentParam = null;
  let currentNilai = null;

  for (let r = headerRow + 1; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);

    const paramNo = row.getCell(1).value;
    const paramBobot = row.getCell(2).value;
    const paramJudul = row.getCell(3).value;

    const nilaiNo = row.getCell(4).value;
    const nilaiText = row.getCell(5).value;
    const nilaiBobot = row.getCell(6).value;
    const portofolio = row.getCell(7).value;

    // Baca cell hasil + formula (jika ada)
    const rawCell = row.getCell(13).value;
    let hasil = null;
    let formula = undefined;

    if (rawCell && typeof rawCell === "object" && rawCell.formula) {
      hasil = rawCell.result;
      formula = rawCell.formula;
    } else {
      hasil = rawCell;
    }

    const keterangan = row.getCell(16).value;
    const riskindikator = {
      low: row.getCell(8).value,
      lowToModerate: row.getCell(9).value,
      moderate: row.getCell(10).value,
      moderateToHigh: row.getCell(11).value,
      high: row.getCell(12).value,
    };

    const noFilled = nilaiNo !== null && nilaiNo !== "";
    const rowEmpty = !paramNo && !nilaiNo && !nilaiText;
    if (rowEmpty) continue;

    // ---------- PARAMETER BARU + NILAI BARU ----------
    if (paramNo && noFilled) {
      if (!currentParam || currentParam.nomor !== paramNo) {
        currentParam = {
          id: crypto.randomUUID(),
          nomor: paramNo,
          bobot: paramBobot,
          judul: paramJudul,
          nilaiList: [],
        };
        imported.push(currentParam);
      }

      currentNilai = {
        id: crypto.randomUUID(),
        nomor: nilaiNo,
        bobot: nilaiBobot,
        portofolio,
        keterangan,
        riskindikator,
        judul: {
          text: nilaiText,
          type: "Tanpa Faktor",
          value: hasil ?? null,
          // ✅ Hanya set formula jika ada (truthy), biarkan undefined jika tidak
          formula: formula || undefined,
          percent: false,
        },
      };

      currentParam.nilaiList.push(currentNilai);
      continue;
    }

    // ---------- CHILD ROW (pembilang / penyebut) ----------
    if (!noFilled && nilaiText && currentNilai) {
      // pembilang
      if (!currentNilai.judul.pembilang) {
        currentNilai.judul.type = "Satu Faktor";
        currentNilai.judul.pembilang = nilaiText;
        currentNilai.judul.valuePembilang = hasil ?? null;
        // ❌ TIDAK ADA OVERWRITE FORMULA
      }
      // penyebut
      else if (!currentNilai.judul.penyebut) {
        currentNilai.judul.type = "Dua Faktor";
        currentNilai.judul.penyebut = nilaiText;
        currentNilai.judul.valuePenyebut = hasil ?? null;
      }
    }
  }

  const normalized = normalizeInherentRows(imported);
  return {
    success: true,
    data: normalized,
    stats: {
      totalParams: normalized.length,
      totalNilai: normalized.reduce((t, p) => t + (p.nilaiList?.length || 0), 0),
    },
  };
}

// Komponen untuk handle import
function ImportModal({ isOpen, onClose, onImportSuccess, year, quarter, categoryLabel }) {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const fileInputRef = useRef(null);

  // Reset semua state saat modal ditutup
  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setPreviewData(null);
      setShowConfirmModal(false);
      setShowPreviewModal(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setPreviewData(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePreview = async () => {
    if (!file) {
      setError('Silakan pilih file terlebih dahulu');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await importInherentFromExcel(file);
      
      if (result.success) {
        setPreviewData(result);
        setShowPreviewModal(true);
      }
    } catch (err) {
      setError(`Gagal membaca file: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

const handleImport = (importedData) => {
  setRows(importedData)     // replace
  onSaveData?.(importedData)
}


  const confirmImport = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);

    try {
      if (onImportSuccess) {
        await onImportSuccess(previewData.data);
      }
      
      // Tampilkan notifikasi sukses
      setNotificationMessage('Data berhasil diimpor!');
      setShowSuccessNotification(true);
      
      // Reset form dan tutup modal setelah delay
      setTimeout(() => {
        setShowSuccessNotification(false);
        onClose();
      }, 2000);
      
    } catch (err) {
      setError(`Gagal mengimpor data: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal utama */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Import Data Inherent
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Import data inherent untuk {categoryLabel}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Tahun: {year} | Quarter: {quarter.toUpperCase()}
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {file ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-800 truncate max-w-xs">{file.name}</p>
                      <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-600 mb-2">Drag & drop file Excel atau</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-input"
                  />
                  <label
                    htmlFor="file-input"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    Pilih File
                  </label>
                  <p className="text-xs text-gray-500 mt-3">
                    Hanya file Excel (.xlsx, .xls) yang didukung
                  </p>
                </>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {previewData && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                <p className="font-medium">File siap diimpor!</p>
                <p className="text-sm mt-1">
                  Parameter: {previewData.stats.totalParams} | Nilai: {previewData.stats.totalNilai}
                </p>
              </div>
            )}

            <div className="flex flex-col space-y-3 pt-4">
              {file && !previewData && (
                <button
                  onClick={handlePreview}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    'Preview Data'
                  )}
                </button>
              )}

              {previewData && (
                <button
                  onClick={() => handleImport(previewData.data)}
                  disabled={isLoading}
                  className="bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Mengimpor...
                    </>
                  ) : (
                    'Import Data'
                  )}
                </button>
              )}

              <button
                onClick={onClose}
                className="border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-700 mb-2">Petunjuk:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Gunakan template dari fitur Export</li>
                <li>• Pastikan format file sesuai template</li>
                <li>• Data yang ada akan digantikan</li>
                <li>• Baris "Summary" akan diabaikan</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Preview */}
      {showPreviewModal && previewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Preview Data
            </h3>
            
            <div className="mb-6 space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-700">Detail Data:</p>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Parameter:</span>
                    <span className="font-medium">{previewData.stats.totalParams}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Nilai:</span>
                    <span className="font-medium">{previewData.stats.totalNilai}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600">
                Data akan diimpor ke <strong>{quarter.toUpperCase()} {year}</strong>
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Kembali
              </button>
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  setShowConfirmModal(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Lanjutkan Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi */}
      {showConfirmModal && previewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Konfirmasi Import
              </h3>
              <p className="text-gray-600">
                Apakah Anda yakin ingin mengimpor data?
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 font-medium">Perhatian:</p>
              <ul className="text-sm text-red-600 mt-1 space-y-1">
                <li>• Data akan diimpor ke {quarter.toUpperCase()} {year}</li>
                <li>• Data yang ada akan digantikan</li>
                <li>• Tindakan ini tidak dapat dibatalkan</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="font-medium text-gray-700 mb-2">Detail Import:</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Parameter</p>
                  <p className="font-medium">{previewData.stats.totalParams}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nilai</p>
                  <p className="font-medium">{previewData.stats.totalNilai}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tahun</p>
                  <p className="font-medium">{year}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Quarter</p>
                  <p className="font-medium">{quarter.toUpperCase()}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={confirmImport}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Ya, Import Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifikasi Sukses */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 z-[70] animate-fade-in">
          <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium">{notificationMessage}</p>
              <p className="text-sm">Data telah berhasil diimpor ke sistem.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function PasarProduk() {
  const {
    year,
    activeQuarter,
    search,
    exportRequestId,
    resetExport,
  } = useHeaderStore();

  const CATEGORY_ID = "pasar-produk";

  const [activeTab, setActiveTab] = useState("inherent");
  const [inherentRows, setInherentRows] = useState([]);
  const [kpmrRows, setKpmrRows] = useState([]);
  const [isDataReady, setIsDataReady] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [lastSavedSignature, setLastSavedSignature] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false); // State untuk modal import

  const didMountRef = useRef(false);
  const initialRowsRef = useRef([]);
  const saveTimeoutRef = useRef(null);

  // Handler untuk import (akan dipanggil dari Header)
  const handleImport = () => {
    if (activeTab === "inherent") {
      setShowImportModal(true);
    } else {
      alert('Fitur import untuk KPMR akan segera tersedia!');
    }
  };

  // Handler ketika import berhasil
const handleImportSuccess = async (importedData) => {
  try {
    setInherentRows(importedData)

    const success = saveInherentDataImmediate(importedData)
    if (!success) alert('Data berhasil diimpor tetapi gagal disimpan.')

    setShowImportModal(false)
  } catch (error) {
    console.error(error)
  }
}


  const handleExportToExcel = useCallback(async () => {
    if (activeTab === "inherent") {
      await exportInherentToExcel({
        rows: inherentRows,
        year,
        quarter: activeQuarter,
        categoryLabel: "Pasar Produk",
      });
    } else if (activeTab === "kpmr") {
      await exportKpmrToExcel({
        rows: kpmrRows,
        year,
        quarter: activeQuarter,
        categoryLabel: "Pasar Produk",
        selectedQuarters: ["Q1", "Q2", "Q3", "Q4"]
      });
    }
  }, [activeTab, inherentRows, kpmrRows, year, activeQuarter]);

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
      
      // Fix: Gunakan CATEGORY_ID yang benar
      saveDerived({
        categoryId: CATEGORY_ID,
        year,
        quarter: activeQuarter,
        snapshot: snapshot,
        values: derivedValues,
      });

      notifyRiskUpdated();
      
      setLastSavedSignature(currentSignature);
      
      return true;
    } catch (error) {
      console.error("Error saving inherent:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [inherentRows, isDataReady, year, activeQuarter, initialLoadDone, lastSavedSignature, isSaving, CATEGORY_ID]);

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
        if (isSaving) {
          return false;
        }
        
        const success = saveInherentData();
        return success;
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

  // Handle export request dari header
  useEffect(() => {
    if (!exportRequestId || !isDataReady) return;

    if (activeTab === "inherent") {
      handleExportToExcel();
    }

    resetExport();
  }, [
    exportRequestId,
    isDataReady,
    activeTab,
    resetExport,
    handleExportToExcel
  ]);

  // Handler untuk perubahan tab dengan pengecekan perubahan data
  const handleTabChange = useCallback((tab) => {
    if (activeTab === "inherent" && inherentRows.length > 0) {
      const currentSignature = getInherentSignature(inherentRows);
      if (currentSignature !== lastSavedSignature) {
        // Optional: Tambahkan konfirmasi di sini jika diperlukan
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
  }, [kpmrRows, year, activeTab, CATEGORY_ID]);

  // Immediate save function untuk KPMR data
  const saveKpmrDataImmediate = useCallback((rowsToSave = null) => {
    const rows = rowsToSave || kpmrRows;
    
    try {
      saveKpmr({
        categoryId: CATEGORY_ID,
        year,
        rows: rows,
      });
      return true;
    } catch (error) {
      console.error("Gagal menyimpan KPMR:", error);
      return false;
    }
  }, [kpmrRows, year, CATEGORY_ID]);

  // Immediate save function untuk inherent data dengan snapshot calculation
  const saveInherentDataImmediate = useCallback((rowsToSave = null) => {
    const rows = rowsToSave || inherentRows;
    
    if (!isDataReady || !initialLoadDone) {
      console.log('Cannot save: data not ready');
      return false;
    }

    console.log('=== SAVING INHERENT DATA ===');
    console.log('Category:', CATEGORY_ID);
    console.log('Year:', year);
    console.log('Quarter:', activeQuarter);
    console.log('Rows count:', rows.length);
    
    const snapshot = computeInherentSnapshot(rows);
    console.log('Computed snapshot:', snapshot);
    
    setIsSaving(true);
    
    try {
      saveInherent({
        categoryId: CATEGORY_ID,
        year,
        quarter: activeQuarter,
        rows: rows,
      });

      console.log('Saved inherent data to localStorage');
      
      const derivedValues = rows.flatMap(param => 
        (param.nilaiList || []).map(nilai => computeDerived(nilai, param))
      );
      
      console.log('Derived values count:', derivedValues.length);
      
      saveDerived({
        categoryId: CATEGORY_ID,
        year,
        quarter: activeQuarter,
        snapshot: snapshot,
        values: derivedValues,
      });

      console.log('Saved derived data to localStorage');
      
      // DEBUG: Tampilkan key yang digunakan
      const derivedKey = `derived:${CATEGORY_ID}:${year}:${activeQuarter}`;
      console.log('Derived storage key:', derivedKey);
      
      notifyRiskUpdated();
      setLastSavedSignature(getInherentSignature(rows));
      
      return true;
    } catch (error) {
      console.error("Save failed:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [isDataReady, year, activeQuarter, initialLoadDone, inherentRows, CATEGORY_ID]);

  useEffect(() => {
    if (activeTab === "inherent") {
      window.saveInherentData = () => {
        if (isSaving) {
          console.log("Already saving, skipping...");
          return false;
        }
        
        const success = saveInherentDataImmediate();
        return success;
      };
    }
    
    return () => {
      delete window.saveInherentData;
    };
  }, [saveInherentDataImmediate, activeTab, isSaving]);

  return (
    <div className="w-full space-y-4">
      {/* Pass handleImport ke Header */}
      <Header 
        title="Risk Profile – Pasar Produk" 
        onExportClick={handleExportToExcel}
        categoryId={CATEGORY_ID}   
        activeTab={activeTab}       
      />

      {/* Modal import */}
      {activeTab === "inherent" && (
        <ImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImportSuccess={handleImportSuccess}
          year={year}
          quarter={activeQuarter}
          categoryLabel="Pasar Produk"
        />
      )}

      <RiskTabs
        value={activeTab}
        onChange={handleTabChange}
      />

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