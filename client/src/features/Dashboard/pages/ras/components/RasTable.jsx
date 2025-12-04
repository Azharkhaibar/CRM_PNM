import React, { useState, useMemo, useEffect } from 'react';
import { Pencil, Trash2, FileText } from 'lucide-react';
import { calculateRasValue, getQuarterMonthName } from '../utils/rasUtils';

const fmtNumber = (v) => {
    if (v === "" || v == null) return "";
    const n = Number(String(v).replace(/,/g, ""));
    if (isNaN(n)) return String(v);
    return new Intl.NumberFormat("en-US").format(n);
};

// helper untuk buang nol belakang
const trimZeros = (str) => str.replace(/\.?0+$/, "");

export default function RasTable({
  rows,
  year,
  quarter,
  onEdit,
  onDelete 
}) {
  
  const currentMonthName = getQuarterMonthName(quarter);

  // --- 1. LOGIKA GROUPING DATA ---
  // Mengelompokkan data berdasarkan 'riskCategory' agar kita bisa menghitung rowSpan
  const groupedData = useMemo(() => {
    if (!rows) return {};
    
    // Urutkan dulu berdasarkan No agar rapi
    const sortedRows = [...rows].sort((a, b) => (a.no || 0) - (b.no || 0));

    const groups = {};
    sortedRows.forEach(item => {
      const category = item.riskCategory || 'Uncategorized';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
    });
    return groups;
  }, [rows]);

  // if (!rows || rows.length === 0) {
  //   return (
  //     <div className="p-8 text-center text-gray-500 bg-gray-50">
  //       <div className="inline-flex p-4 bg-white rounded-full mb-3 shadow-sm">
  //         <FileText className="w-6 h-6 text-gray-400" />
  //       </div>
  //       <p>Belum ada data RAS yang tersedia.</p>
  //     </div>
  //   );
  // }

  const getStanceBadgeColor = (stance) => {
  const s = stance?.toLowerCase() || '';
  if (s.includes('tidak toleran')) return 'bg-red-100 text-red-700 border-red-200';
  if (s.includes('konservatif')) return 'bg-amber-100 text-amber-700 border-amber-200';
  if (s.includes('moderat')) return 'bg-blue-100 text-blue-700 border-blue-200';
  if (s.includes('strategis')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-300">
      <table className="w-full min-w-[1400px] text-left border-collapse text-sm">
        <thead className="bg-[#1f4e79] text-white">
          <tr>
            {/* Header Baris 1 */}
            <th rowSpan={2} className="py-3 px-4 border border-gray-400 font-semibold w-32 align-middle text-center">Risiko</th>
            <th rowSpan={2} className="py-3 px-2 border border-gray-400 font-semibold w-12 align-middle text-center">No</th>
            <th rowSpan={2} className="py-3 px-4 border border-gray-400 font-semibold min-w-[250px] align-middle">Parameter</th>
            <th rowSpan={2} className="py-3 px-2 border border-gray-400 font-semibold w-24 align-middle text-center">RKAP<br/>Des {year}</th>
            <th rowSpan={2} className="py-3 px-2 border border-gray-400 font-semibold w-32 align-middle text-center">Penjelasan Tipe Data</th>
            
            {/* Group Header RAS */}
            <th colSpan={3} className="py-2 px-2 border border-gray-400 font-semibold text-center bg-[#163a5c]">RAS {year}</th>
            
            <th rowSpan={2} className="py-3 px-4 border border-gray-400 font-semibold w-40 align-middle text-center">Keterangan</th>
            <th rowSpan={2} className="py-3 px-4 border border-gray-400 font-semibold w-32 align-middle text-center">
              {currentMonthName}<br/>({quarter})
            </th>
            <th rowSpan={2} className="py-3 px-2 border border-gray-400 font-semibold w-20 align-middle text-center">Aksi</th>
          </tr>
          <tr>
            {/* Header Baris 2 (Anak dari RAS) */}
            <th className="py-2 px-2 border border-gray-400 font-medium w-24 text-center text-xs">Limit</th>
            <th className="py-2 px-2 border border-gray-400 font-medium w-32 text-center text-xs">Sikap Thd Risiko</th>
            <th className="py-2 px-2 border border-gray-400 font-medium min-w-[200px] text-center text-xs">Statement</th>
          </tr>
        </thead>

        <tbody className="text-gray-700">
          {Object.keys(groupedData).length === 0 ? (
            <tr>
              <td colSpan={12} className="p-8 text-center text-gray-500 bg-gray-50 border border-gray-300">
                <div className="inline-flex p-3 bg-white rounded-full mb-2 shadow-sm border border-gray-200">
                  <FileText className="w-6 h-6 text-gray-400" />
                </div>
                <p>Belum ada data RAS yang tersedia.</p>
              </td>
            </tr>
          ) : (
            // --- 2. LOOPING KATEGORI (GROUP) ---
            Object.entries(groupedData).map(([category, items], groupIndex) => {
              
              // Hitung total baris untuk rowSpan kategori:
              // Setiap item = 1 baris utama + (2 baris tambahan jika ada pembilang/penyebut)
              const totalGroupRows = items.reduce((acc, item) => {
                return acc + 1 + (item.hasNumeratorDenominator ? 2 : 0);
              }, 0);

              return (
                <React.Fragment key={category + groupIndex}>
                  {items.map((item, itemIndex) => {
                    const isFirstItemInGroup = itemIndex === 0;
                    const hasCalc = item.hasNumeratorDenominator;
                    // Jika ada kalkulasi, item ini butuh 3 baris, jika tidak 1 baris
                    const itemRowSpan = hasCalc ? 3 : 1; 

                    // Hitung value utama (hasil bagi atau manual)
                    const finalValue = calculateRasValue(
                        item.numeratorValue, 
                        item.denominatorValue, 
                        item.unitType, 
                        item.manualQuarterValue
                    );

                    return (
                      <React.Fragment key={item.id}>
                        {/* === BARIS 1: DATA UTAMA === */}
                        <tr className="hover:bg-blue-50 transition-colors">
                          
                          {/* Kolom Risiko (Hanya muncul di item pertama grup) */}
                          {isFirstItemInGroup && (
                            <td 
                              rowSpan={totalGroupRows} 
                              className="px-4 py-3 font-bold align-top bg-gray-50 border border-gray-300"
                            >
                              {category}
                            </td>
                          )}

                          {/* Kolom No (Span 3 baris jika ada calc) */}
                          <td rowSpan={itemRowSpan} className="px-2 py-3 text-center align-top border border-gray-300">
                            {item.no}
                          </td>

                          {/* Parameter Utama */}
                          <td className="px-4 py-3 align-top border border-gray-300 font-medium">
                            {item.parameter}
                          </td>

                          <td className="px-2 py-3 text-center align-top border border-gray-300 text-xs">
                            {item.rkapTarget || 'N/A'}
                          </td>
                          
                          <td className="px-2 py-3 text-xs align-top border border-gray-300 italic">
                            {item.dataTypeExplanation}
                          </td>

                          <td className="px-2 py-3 text-center font-bold text-red-600 align-top border border-gray-300">
                            {item.rasLimit}
                          </td>

                          <td className="px-2 py-3 text-center align-top border border-gray-300">
                            <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold border ${getStanceBadgeColor(item.riskStance)}`}>
                              {item.riskStance}
                            </span>
                          </td>

                          <td className="px-3 py-3 text-xs align-top border border-gray-300 text-justify leading-relaxed min-w-[200px]">
                            {item.statement}
                          </td>

                          {/* Keterangan & Value (Span 3 baris jika ada calc? Tidak, sesuai request value pembilang/penyebut di bawah) */}
                          {/* Revisi: Keterangan biasanya merge cell ke bawah atau tidak? 
                              Di excel "Keterangan" ada di sebelah Statement. 
                              Kita buat standard 1 baris saja, baris bawahnya kosong/merge untuk kerapian.
                              Mari kita buat Keterangan rowSpan agar rapi. 
                          */}
                          <td rowSpan={itemRowSpan} className="px-2 py-3 text-xs align-top border border-gray-300">
                            {item.notes}
                          </td>

                          {/* Value Realisasi (Hasil Akhir) */}
                          <td className="px-3 py-3 text-center font-bold text-blue-800 align-top border border-gray-300 bg-blue-50/50">
                            {finalValue}
                          </td>

                          {/* Aksi (Span ke bawah agar tombol ada di tengah blok) */}
                          <td rowSpan={itemRowSpan} className="px-2 py-3 text-center align-middle border border-gray-300">
                            <div className="flex flex-col items-center gap-2">
                              <button onClick={() => onEdit(item)} className="p-2 text-yellow-600 hover:bg-yellow-50 rounded border border-yellow-200 shadow-sm" title="Edit">
                                <Pencil size={14} />
                              </button>
                              <button onClick={() => onDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded border border-red-200 shadow-sm" title="Hapus">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* === BARIS 2: PEMBILANG (Jika ada) === */}
                        {hasCalc && (
                          <tr className="bg-gray-50/30 text-xs text-gray-600">
                            {/* Risiko (Merged) */}
                            {/* No (Merged) */}
                            
                            {/* Parameter -> Label Pembilang */}
                            <td className="px-4 py-2 border border-gray-300 border-t-0 pl-8 italic">
                              {item.numeratorLabel || '(Pembilang)'}
                            </td>

                            {/* Kolom tengah kosong/merged */}
                            <td className="border border-gray-300 bg-gray-100/50"></td> {/* RKAP */}
                            <td className="border border-gray-300 bg-gray-100/50"></td> {/* Tipe Data */}
                            <td className="border border-gray-300 bg-gray-100/50"></td> {/* Limit */}
                            <td className="border border-gray-300 bg-gray-100/50"></td> {/* Sikap */}
                            <td className="border border-gray-300 bg-gray-100/50"></td> {/* Statement */}
                            {/* Keterangan (Merged) */}

                            {/* Value Pembilang */}
                            <td className="px-3 py-2 text-center border border-gray-300 font-mono text-gray-700">
                              {fmtNumber(item.numeratorValue)}
                            </td>
                            {/* Aksi (Merged) */}
                          </tr>
                        )}

                        {/* === BARIS 3: PENYEBUT (Jika ada) === */}
                        {hasCalc && (
                          <tr className="bg-gray-50/30 text-xs text-gray-600 border-b-2 border-gray-300">
                            {/* Risiko (Merged) */}
                            {/* No (Merged) */}

                            {/* Parameter -> Label Penyebut */}
                            <td className="px-4 py-2 border border-gray-300 border-t-0 pl-8 italic">
                              {item.denominatorLabel || '(Penyebut)'}
                            </td>

                            {/* Kolom tengah kosong/merged */}
                            <td className="border border-gray-300 bg-gray-100/50"></td>
                            <td className="border border-gray-300 bg-gray-100/50"></td>
                            <td className="border border-gray-300 bg-gray-100/50"></td>
                            <td className="border border-gray-300 bg-gray-100/50"></td>
                            <td className="border border-gray-300 bg-gray-100/50"></td>
                            {/* Keterangan (Merged) */}

                            {/* Value Penyebut */}
                            <td className="px-3 py-2 text-center border border-gray-300 font-mono text-gray-700">
                              {fmtNumber(item.denominatorValue)}
                            </td>
                            {/* Aksi (Merged) */}
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}