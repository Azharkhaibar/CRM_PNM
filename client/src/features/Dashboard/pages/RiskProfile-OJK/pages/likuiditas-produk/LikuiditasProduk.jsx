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
import * as ExcelJS from "exceljs";

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

// ==================== FUNGSI EXPORT INHERENT KE EXCEL (TANPA KOLOM % DALAM PORTOFOLIO) ====================
async function exportInherentToExcel({
  rows = [],
  year,
  quarter,
  categoryLabel = "LikuiditasProduk",
}) {
  if (!Array.isArray(rows) || rows.length === 0) {
    alert("Tidak ada data inherent untuk diekspor");
    return;
  }

  try {
    // Buat workbook baru
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Risk Profile System";
    workbook.created = new Date();

    // Tambahkan worksheet
    const worksheet = workbook.addWorksheet(`2. Inherent ${categoryLabel}`, {
      views: [{ showGridLines: true }],
    });

    // Set kolom widths (15 kolom, tanpa % Dalam Portofolio)
    worksheet.columns = [
      { width: 5 }, // 1. No Parameter
      { width: 7 }, // 2. Bobot Parameter
      { width: 26 }, // 3. Parameter
      { width: 5 }, // 4. No Nilai
      { width: 30 }, // 5. Nilai
      { width: 7 }, // 6. Bobot Nilai
      { width: 15 }, // 7. Low
      { width: 15 }, // 8. Low To Moderate
      { width: 15 }, // 9. Moderate
      { width: 15 }, // 10. Moderate To High
      { width: 15 }, // 11. High
      { width: 15 }, // 12. Hasil
      { width: 15 }, // 13. Peringkat
      { width: 15 }, // 14. Weighted
      { width: 25 }, // 15. Keterangan
    ];

    // Tambahkan judul
    const titleRow = worksheet.addRow([`Risk Profile OJK - ${categoryLabel}`]);
    titleRow.font = { size: 16, bold: true };
    worksheet.mergeCells("A1:O1");

    const yearQuarterRow = worksheet.addRow([
      `Tahun: ${year} | Quarter: ${quarter.toUpperCase()} | Tanggal Export: ${new Date().toLocaleDateString(
        "id-ID"
      )}`,
    ]);
    yearQuarterRow.font = { size: 12, italic: true };
    worksheet.mergeCells("A2:O2");

    // Baris kosong
    worksheet.addRow([]);

    // Header tabel (15 kolom)
    const headerRow = worksheet.addRow([
      "No",
      "Bobot",
      "Parameter",
      "No",
      "Nilai",
      "Bobot",
      "Low",
      "Low To Moderate",
      "Moderate",
      "Moderate To High",
      "High",
      "Hasil",
      "Peringkat",
      "Weighted",
      "Keterangan",
    ]);

    // Style untuk header
    headerRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
      cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };

      // Background warna berdasarkan kolom
      if (colNumber <= 3) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF003366" }, // Biru tua untuk header parameter
        };
      } else if (colNumber >= 7 && colNumber <= 11) {
        // Warna untuk kolom risk indicator (sekarang kolom 7-11)
        const colors = [
          "FF4F6228", // Low
          "FF92D050", // Low To Moderate
          "FFFFFF00", // Moderate
          "FFF97316", // Moderate To High
          "FFFF0000", // High
        ];
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: colors[colNumber - 7] },
        };

        // Set font color untuk kontras
        if (colNumber === 11) {
          // High - merah
          cell.font.color = { argb: "FFFFFFFF" };
        } else if (colNumber === 7) {
          // Low - hijau tua
          cell.font.color = { argb: "FFFFFFFF" };
        } else {
          cell.font.color = { argb: "FF000000" };
        }
      } else if (colNumber >= 12 && colNumber <= 14) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF000033" }, // Biru sangat tua untuk hasil
        };
        cell.font.color = { argb: "FFFFFFFF" };
      } else {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF003366" },
        };
        cell.font.color = { argb: "FFFFFFFF" };
      }

      cell.border = {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
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

    // Fungsi untuk menentukan warna background berdasarkan peringkat
    const getRankBgColor = (peringkat) => {
      const rankBgMap = {
        1: "4F6228",
        2: "92D050",
        3: "FFFF00",
        4: "F97316",
        5: "FF0000",
      };
      return rankBgMap[peringkat] || "FFFFFF";
    };

    // Fungsi untuk menentukan warna background summary
    const getSummaryBgColor = (total) => {
      if (!Number.isFinite(total)) return "FFFFFF";

      if (total <= 1) return "4F6228";
      if (total <= 2) return "92D050";
      if (total <= 3) return "FFFF00";
      if (total <= 4) return "F97316";
      return "FF0000";
    };

    // Tambahkan data baris
    let globalTotalWeighted = 0;
    let currentRow = 5; // Start dari row 5 (setelah header)
    const mergeRanges = [];

    rows.forEach((param) => {
      const nilaiList = Array.isArray(param.nilaiList) ? param.nilaiList : [];

      if (nilaiList.length === 0) {
        // Baris kosong untuk parameter tanpa nilai
        const emptyRow = [
          param.nomor || "-",
          formatPercent(param.bobot),
          param.judul || "-",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "Belum ada nilai untuk parameter ini",
        ];

        worksheet.addRow(emptyRow);

        const row = worksheet.getRow(currentRow);
        row.eachCell((cell, colNumber) => {
          if (colNumber <= 3) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFE8F5FA" },
            };
          }
          cell.alignment = { wrapText: true, vertical: "middle" };
          cell.border = {
            top: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
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

      nilaiList.forEach((nilai) => {
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

          // KOLOM % DALAM PORTOFOLIO TELAH DIHAPUS

          // Kolom risk indicator (hanya di baris pertama nilai)
          const riskIndicators = [
            "low",
            "lowToModerate",
            "moderate",
            "moderateToHigh",
            "high",
          ];
          riskIndicators.forEach((rk) => {
            rowData.push(isMainRow ? nilai.riskindikator?.[rk] ?? "-" : "");
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

          // SET TINGGI BARIS
          if (isMainRow) {
            row.height = 45;
          } else {
            row.height = 25;
          }

          // Apply styles
          row.eachCell((cell, colNumber) => {
            cell.border = {
              top: { style: "thin", color: { argb: "FF000000" } },
              left: { style: "thin", color: { argb: "FF000000" } },
              bottom: { style: "thin", color: { argb: "FF000000" } },
              right: { style: "thin", color: { argb: "FF000000" } },
            };

            cell.alignment = { vertical: "middle", wrapText: true };

            if ([1, 2, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14].includes(colNumber)) {
              cell.alignment.horizontal = "center";
            }

            // Background colors
            if (colNumber <= 3) {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFE8F5FA" },
              };
            } else if (colNumber === 4) {
              if (isMainRow) {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFE8F5FA" },
                };
              } else {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFFFFFFF" },
                };
              }
            } else if (colNumber === 5) {
              if (isMainRow) {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFE8F5FA" },
                };
                cell.font = { bold: true };
              } else {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFFFFFFF" },
                };
              }
            } else if (colNumber === 6) {
              if (isMainRow) {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFE8F5FA" },
                };
              } else {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFFFFFFF" },
                };
              }
            } else if (colNumber >= 7 && colNumber <= 11) {
              if (isMainRow) {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFD9EAD3" },
                };
              } else {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFFFFFFF" },
                };
              }
            } else if (colNumber === 12) {
              cell.alignment.horizontal = "center";
              if (isMainRow) {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFFFFFFF" },
                };
                cell.font = { bold: true };
              } else {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFD9EAD3" },
                };
              }
            } else if (colNumber === 13) {
              if (isFirstRowOfNilai && Number.isFinite(peringkat)) {
                const bgColor = getRankBgColor(peringkat);
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: bgColor },
                };
                cell.font = {
                  bold: true,
                  color: {
                    argb:
                      peringkat === 1 || peringkat === 5
                        ? "FFFFFFFF"
                        : "FF000000",
                  },
                };
                cell.alignment.horizontal = "center";
              }
            } else if (colNumber === 14) {
              if (isFirstRowOfNilai) {
                cell.alignment.horizontal = "center";
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFFFFFFF" },
                };
              }
            } else if (colNumber === 15) {
              if (isFirstRowOfNilai) {
                cell.alignment.horizontal = "left";
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFFFFFFF" },
                };
              }
            }
          });

          currentRow++;
        }

        const nilaiEnd = currentRow - 1;

        if (rowsForThisNilai === 1) {
          mergeRanges.push({ start: nilaiStart, end: nilaiEnd, col: 4 }); // nomor nilai
          mergeRanges.push({ start: nilaiStart, end: nilaiEnd, col: 13 }); // peringkat
          mergeRanges.push({ start: nilaiStart, end: nilaiEnd, col: 14 }); // weighted
          mergeRanges.push({ start: nilaiStart, end: nilaiEnd, col: 15 }); // keterangan
        } else {
          mergeRanges.push({ start: nilaiStart, end: nilaiEnd, col: 13 }); // peringkat
          mergeRanges.push({ start: nilaiStart, end: nilaiEnd, col: 14 }); // weighted
          mergeRanges.push({ start: nilaiStart, end: nilaiEnd, col: 15 }); // keterangan
        }
      });

      // Merge cells untuk parameter
      if (totalRowsForParam > 1) {
        mergeRanges.push({ start: paramStartRow, end: paramStartRow + totalRowsForParam - 1, col: 1 });
        mergeRanges.push({ start: paramStartRow, end: paramStartRow + totalRowsForParam - 1, col: 2 });
        mergeRanges.push({ start: paramStartRow, end: paramStartRow + totalRowsForParam - 1, col: 3 });
      }
    });

    // Apply merge
    mergeRanges.forEach((range) => {
      if (range.start !== range.end) {
        const startCell = `${String.fromCharCode(64 + range.col)}${range.start}`;
        const endCell = `${String.fromCharCode(64 + range.col)}${range.end}`;
        worksheet.mergeCells(`${startCell}:${endCell}`);

        if (range.col !== 15) {
          const cell = worksheet.getCell(startCell);
          cell.alignment = {
            ...cell.alignment,
            horizontal: "center",
            vertical: "middle",
          };
        }
      }
    });

    // Baris summary (15 kolom)
    const summaryBgColor = getSummaryBgColor(globalTotalWeighted);
    const summaryRowData = [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Summary",
      "",
      globalTotalWeighted.toFixed(2),
      "",
    ];

    const summaryRow = worksheet.addRow(summaryRowData);

    summaryRow.eachCell((cell, colNumber) => {
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
      };

      if (colNumber === 12 || colNumber === 13) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF003366" },
        };
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      } else if (colNumber === 14) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: summaryBgColor },
        };
        cell.font = {
          bold: true,
          color: {
            argb:
              summaryBgColor === "4F6228" || summaryBgColor === "FF0000"
                ? "FFFFFFFF"
                : "FF000000",
          },
        };
      }
    });

    // Generate file Excel
    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `RiskProfile_${categoryLabel}_Inherent_${year}_${quarter}`;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);

    console.log("Export inherent sukses!");
  } catch (error) {
    console.error("Error exporting inherent to Excel:", error);
    alert("Gagal mengexport data inherent ke Excel. Silakan coba lagi.\nError: " + error.message);
  }
}

// ==================== FUNGSI EXPORT KPMR KE EXCEL (SAMA PERSIS DENGAN PasarProduk) ====================
async function exportKpmrToExcel({
  rows = [],
  year,
  quarter,
  categoryLabel = "LikuiditasProduk",
  selectedQuarters = ["Q1", "Q2", "Q3", "Q4"],
}) {
  if (!Array.isArray(rows) || rows.length === 0) {
    alert("Tidak ada data KPMR untuk diekspor");
    return;
  }

  try {
    // Normalize rows terlebih dahulu
    const normalizedRows = rows.map((row) => ({
      ...row,
      pertanyaanList: Array.isArray(row.pertanyaanList) ? row.pertanyaanList : [],
    }));

    // Buat workbook baru
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Risk Profile System";
    workbook.created = new Date();

    // Tambahkan worksheet
    const worksheet = workbook.addWorksheet(`2. KPMR ${categoryLabel}`, {
      views: [{ showGridLines: true }],
    });

    // Hitung jumlah kolom berdasarkan quarter yang dipilih
    const quarterCount = selectedQuarters.length;
    const hasSelectedQuarters = quarterCount > 0;

    // Set kolom widths sesuai permintaan
    const columnWidths = [
      { width: 6 }, // Kolom A (tidak dipakai)
      { width: 6 }, // Kolom B: No. Pertanyaan
      { width: 30 }, // Kolom C: Pertanyaan judul
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
    const titleRow = worksheet.addRow([
      `Risk Profile OJK - ${categoryLabel} - Kualitas Penerapan Manajemen Risiko`,
    ]);
    titleRow.font = { size: 16, bold: true };
    worksheet.mergeCells("A1:N1");

    // Baris 2: Informasi tahun, quarter, dan tanggal export
    const yearQuarterRow = worksheet.addRow([
      `Tahun: ${year} | Quarter: ${quarter.toUpperCase()} | Tanggal Export: ${new Date().toLocaleDateString(
        "id-ID"
      )}`,
    ]);
    yearQuarterRow.font = { size: 12, italic: true };
    worksheet.mergeCells("A2:N2");

    // Baris 3: Baris kosong
    worksheet.addRow([]);

    // Fungsi untuk menentukan warna background berdasarkan skor
    const getSkorBgColor = (skor) => {
      const num = Number(skor);

      if (num >= 4.5) return { bg: "FFFF0000", text: "FFFFFFFF" }; // High
      if (num >= 3.5) return { bg: "FFFFC000", text: "FF000000" };
      if (num >= 2.5) return { bg: "FFFFFF00", text: "FF000000" };
      if (num >= 1.5) return { bg: "FF92D050", text: "FF000000" };
      if (num > 0) return { bg: "FF4F6228", text: "FFFFFFFF" }; // Low

      return { bg: "FFF3F4F6", text: "FF000000" };
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
      if (colNumber >= 2 && colNumber <= 13) {
        // Hanya kolom B-M yang diisi
        cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
        cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };

        // Background warna untuk header
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF1E40AF" }, // Blue-900
        };

        cell.border = {
          top: { style: "thin", color: { argb: "FF000000" } },
          left: { style: "thin", color: { argb: "FF000000" } },
          bottom: { style: "thin", color: { argb: "FF000000" } },
          right: { style: "thin", color: { argb: "FF000000" } },
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
      aspekRow.getCell(2).value = `Aspek ${aspek.nomor || "-"} : ${
        aspek.judul || "-"
      } (Bobot: ${aspek.bobot || "0"}%)`;
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
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: color.bg },
          };

          aspekRow.getCell(col).font = {
            ...aspekRow.getCell(col).font,
            bold: true,
            color: { argb: color.text },
          };
        }
      });

      aspekRow.height = 30;

      // 3. Kolom H-L - Indicator titles untuk setiap ASPEK
      const indicatorTitles = [
        "1 (Strong)",
        "2 (Satisfactory)",
        "3 (Fair)",
        "4 (Marginal)",
        "5 (Unsatisfactory)",
      ];
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
            size: 11,
          };

          cell.alignment = {
            vertical: "middle",
            horizontal: colNumber === 2 ? "left" : "center",
            wrapText: true,
          };

          // Background untuk baris header aspek
          if (colNumber === 2 || colNumber === 3) {
            // Kolom B-C (Aspek)
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFF1F5F9" }, // Gray-100
            };
            cell.font.color = { argb: "FF000000" };
          } else if (colNumber >= 4 && colNumber <= 7) {
            // Kolom D-G (Skor Quarter)
            if (cell.value === "-") {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFF1F5F9" },
              };
              cell.font.color = { argb: "FF000000" };
            }
          } else if (colNumber >= 8 && colNumber <= 12) {
            // Kolom H-L (Description Level Header)
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FF0F172A" }, // Blue-950
            };
            cell.font.color = { argb: "FFFFFFFF" };
          } else if (colNumber === 13) {
            // Kolom M (Evidence Header)
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FF1E40AF" }, // Blue-900
            };
            cell.font.color = { argb: "FFFFFFFF" };
          }

          cell.border = {
            top: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
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
            cell.alignment = { horizontal: "center", vertical: "middle" };
            cell.font = { italic: true, color: { argb: "FF6B7280" } };
            cell.border = {
              top: { style: "thin", color: { argb: "FF000000" } },
              left: { style: "thin", color: { argb: "FF000000" } },
              bottom: { style: "thin", color: { argb: "FF000000" } },
              right: { style: "thin", color: { argb: "FF000000" } },
            };
          }
        });
        currentRow++;
      } else {
        list.forEach((pertanyaan, qi) => {
          const pertanyaanRow = worksheet.getRow(currentRow);

          // 1. no.pertanyaan - Kolom B (lebar 6)
          pertanyaanRow.getCell(2).value = pertanyaan.nomor || qi + 1;

          // 2. Pertanyaan.judul - Kolom C (lebar 30)
          pertanyaanRow.getCell(3).value = pertanyaan.pertanyaan || "-";

          // 3-6. skorPertanyaan Q1-Q4 - Kolom D, E, F, G (TIDAK PAKE BACKGROUND)
          selectedQuarters.forEach((quarter, qIndex) => {
            const col = 4 + qIndex; // D=4, E=5, F=6, G=7
            const skorValue =
              pertanyaan.skor?.[quarter] || pertanyaan.skor?.[quarter.toLowerCase()];
            const hasSkor = skorValue !== "" && skorValue !== undefined && skorValue !== null;

            pertanyaanRow.getCell(col).value = hasSkor ? skorValue : "-";

            // TIDAK PAKAI BACKGROUND INDICATOR - hanya font warna hitam
            if (hasSkor) {
              pertanyaanRow.getCell(col).font = {
                color: { argb: "FF000000" }, // Hitam saja, tanpa background
              };
            }
          });

          // Description Level values - Kolom H-L
          const descriptionKeys = [
            "strong",
            "satisfactory",
            "fair",
            "marginal",
            "unsatisfactory",
          ];
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
                vertical: "middle",
                horizontal:
                  colNumber === 3 || (colNumber >= 8 && colNumber <= 13) ? "left" : "center",
                wrapText: true,
              };

              cell.border = {
                top: { style: "thin", color: { argb: "FF000000" } },
                left: { style: "thin", color: { argb: "FF000000" } },
                bottom: { style: "thin", color: { argb: "FF000000" } },
                right: { style: "thin", color: { argb: "FF000000" } },
              };

              // Alternating row colors untuk kolom B dan C
              if (colNumber === 2 || colNumber === 3) {
                if (qi % 2 === 0) {
                  cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFFFFFFF" },
                  };
                } else {
                  cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFF8FAFC" },
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
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: color.bg },
          };

          summaryRow.getCell(col).font = {
            bold: true,
            color: { argb: color.text },
          };
        }
      });

      // Style untuk baris summary
      summaryRow.eachCell((cell, colNumber) => {
        if (colNumber >= 2 && colNumber <= 13) {
          if (colNumber === 2 || colNumber === 3) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FF1E40AF" }, // Blue-900
            };
            cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
          }

          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.border = {
            top: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
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
        }
        // Untuk baris pertanyaan, tinggi sudah diatur di atas menjadi 75
        // Untuk baris lainnya, tetap 30
      }
    }

    // Generate file Excel
    const buffer = await workbook.xlsx.writeBuffer();

    // Download file
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `RiskProfile_${categoryLabel}_KPMR_${year}_${quarter}`;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);

    console.log("Export KPMR successful!");
  } catch (error) {
    console.error("Error exporting KPMR to Excel:", error);
    alert("Gagal mengexport data KPMR ke Excel. Silakan coba lagi.\nError: " + error.message);
  }
}

// ==================== KOMPONEN UTAMA ====================
export default function LikuiditasProduk() {
  const { year, activeQuarter, search, exportRequestId, resetExport } = useHeaderStore();

  const CATEGORY_ID = "likuiditas-produk";

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

      const derivedValues = inherentRows.flatMap((param) =>
        (param.nilaiList || []).map((nilai) => computeDerived(nilai, param))
      );

      const snapshot = computeInherentSnapshot(inherentRows);

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

  const handleExportToExcel = useCallback(async () => {
    if (activeTab === "inherent") {
      await exportInherentToExcel({
        rows: inherentRows,
        year,
        quarter: activeQuarter,
        categoryLabel: "Likuiditas Produk",
      });
    } else if (activeTab === "kpmr") {
      await exportKpmrToExcel({
        rows: kpmrRows,
        year,
        quarter: activeQuarter,
        categoryLabel: "Likuiditas Produk",
        selectedQuarters: ["Q1", "Q2", "Q3", "Q4"],
      });
    }
  }, [activeTab, inherentRows, kpmrRows, year, activeQuarter]);

  useEffect(() => {
    if (!exportRequestId || !isDataReady) return;

    handleExportToExcel();

    resetExport();
  }, [exportRequestId, isDataReady, handleExportToExcel, resetExport]);

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

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [activeTab, inherentRows, lastSavedSignature, saveInherentData]);

  // Handler untuk perubahan tab
  const handleTabChange = useCallback(
    (tab) => {
      if (activeTab === "inherent" && inherentRows.length > 0) {
        const currentSignature = getInherentSignature(inherentRows);
        if (currentSignature !== lastSavedSignature) {
          // Bisa tambahkan konfirmasi jika perlu
        }
      }

      setActiveTab(tab);
    },
    [activeTab, inherentRows, lastSavedSignature]
  );

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

  // Immediate save function untuk KPMR data
  const saveKpmrDataImmediate = useCallback(
    (rowsToSave = null) => {
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
    },
    [kpmrRows, year]
  );

  // Immediate save function untuk inherent data
  const saveInherentDataImmediate = useCallback(
    (rowsToSave = null) => {
      const rows = rowsToSave || inherentRows;

      if (!isDataReady || !initialLoadDone) {
        console.log("Cannot save: data not ready");
        return false;
      }

      console.log("=== SAVING INHERENT DATA ===");
      console.log("Category:", CATEGORY_ID);
      console.log("Year:", year);
      console.log("Quarter:", activeQuarter);
      console.log("Rows count:", rows.length);

      const snapshot = computeInherentSnapshot(rows);
      console.log("Computed snapshot:", snapshot);

      setIsSaving(true);

      try {
        saveInherent({
          categoryId: CATEGORY_ID,
          year,
          quarter: activeQuarter,
          rows: rows,
        });

        console.log("Saved inherent data to localStorage");

        const derivedValues = rows.flatMap((param) =>
          (param.nilaiList || []).map((nilai) => computeDerived(nilai, param))
        );

        console.log("Derived values count:", derivedValues.length);

        saveDerived({
          categoryId: CATEGORY_ID,
          year,
          quarter: activeQuarter,
          snapshot: snapshot,
          values: derivedValues,
        });

        console.log("Saved derived data to localStorage");

        const derivedKey = `derived:${CATEGORY_ID}:${year}:${activeQuarter}`;
        console.log("Derived storage key:", derivedKey);
        console.log("Stored data:", JSON.parse(localStorage.getItem(derivedKey) || "{}"));

        notifyRiskUpdated();
        setLastSavedSignature(getInherentSignature(rows));

        return true;
      } catch (error) {
        console.error("Save failed:", error);
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [isDataReady, year, activeQuarter, initialLoadDone, inherentRows]
  );

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
      <Header title="Risk Profile – Likuiditas Produk" onExportClick={handleExportToExcel} />

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