import React, { useMemo, useState } from 'react';
import { FileText, Eye, EyeOff, List, ListX } from 'lucide-react';
import { calculateRasValue, formatRasDisplayValue } from '../utils/rasUtils.js';

export default function RasYearlyTable({ rows, allData, year, onUpdate }) {
  const [showStats, setShowStats] = useState(false);  
  const [showNumDen, setShowNumDen] = useState(false); 

  const yearMinus2 = year - 2; 
  const yearMinus1 = year - 1; 
  const currentYear = year;

  // --- UPDATED: HAPUS KETERGANTUNGAN PADA 'NO' ---
  const getHistoricalItem = (currentItem, targetYear) => {
    if (!allData) return null;
    
    // 1. Prioritas Utama: Group ID (Akurat)
    if (currentItem.groupId) {
        const foundByGroup = allData.find(d => d.year === targetYear && d.groupId === currentItem.groupId);
        if (foundByGroup) return foundByGroup;
    }

    // 2. Fallback: Nama Parameter Sama & Kategori Sama (Abaikan No)
    // Ini berguna jika user membuat manual dengan nama yang sama persis
    return allData.find(d => 
      d.year === targetYear && 
      d.riskCategory === currentItem.riskCategory &&
      d.parameter.trim().toLowerCase() === currentItem.parameter.trim().toLowerCase()
    );
  };

  // --- UPDATED: MIXED UNIT NORMALIZATION LOGIC ---
  const calculateStats = (currentItem) => {
    const yearsToCheck = [year - 3, year - 2, year - 1];
    let allValues = [];

    yearsToCheck.forEach(y => {
      const histItem = getHistoricalItem(currentItem, y);
      
      if (histItem && histItem.monthlyValues) {
        Object.values(histItem.monthlyValues).forEach(mVal => {
          // Ambil nilai raw (sudah *100 jika Persen)
          let val = calculateRasValue(mVal.num, mVal.den, histItem.unitType, mVal.man);
          
          if (val !== null && val !== undefined && val !== '') {
            val = parseFloat(val);

            // --- LOGIKA NORMALISASI MIXED UNIT ---
            // Skenario: Current Unit vs Historical Unit beda
            
            // Case 1: Sekarang Multiplier (X), Dulu Persen (%)
            // Data dulu misal 12 (artinya 12%), harus jadi 0.12 agar setara X
            if (currentItem.unitType === 'X' && histItem.unitType === 'PERCENTAGE') {
                val = val / 100;
            }
            
            // Case 2: Sekarang Persen (%), Dulu Multiplier (X)
            // Data dulu misal 0.12 (artinya 0.12X), harus jadi 12 agar setara %
            else if (currentItem.unitType === 'PERCENTAGE' && histItem.unitType === 'X') {
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
        const squareDiffs = allValues.map(v => Math.pow(v - avg, 2));
        const sumSquareDiff = squareDiffs.reduce((a, b) => a + b, 0);
        stdev = Math.sqrt(sumSquareDiff / (N - 1));
    }

    return {
      n: N,
      avg: avg,
      stdev: stdev,
      min: min,
      max: max,
      avg_min_1sd: avg - stdev,
      avg_plus_1sd: avg + stdev,
      avg_plus_2sd: avg + (2 * stdev),
      avg_plus_3sd: avg + (3 * stdev),
    };
  };

   const getUnitLabel = (unitType) => {
    switch (unitType) {
      case 'PERCENTAGE': return '%';
      case 'HOUR': return 'Jam';
      case 'X': return 'X';
      default: return ''; 
    }
  };

  const groupedData = useMemo(() => {
    if (!rows) return {};
    const sortedRows = [...rows].sort((a, b) => (Number(a.no) || 0) - (Number(b.no) || 0));

    const groups = {};
    sortedRows.forEach(item => {
      const cat = item.riskCategory || 'Lainnya';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [rows]);

  return (
    <section className="bg-white rounded-2xl shadow overflow-hidden border border-gray-200 flex flex-col w-full h-full">
      <div className="p-3 bg-gray-50 border-b border-gray-200 flex justify-end gap-3">
        <button onClick={() => setShowNumDen(!showNumDen)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${showNumDen ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}>
          {showNumDen ? <ListX size={14}/> : <List size={14}/>} {showNumDen ? 'Sembunyikan Pembilang & Penyebut' : 'Tampilkan Pembilang & Penyebut'}
        </button>
        <button onClick={() => setShowStats(!showStats)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${showStats ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}>
          {showStats ? <EyeOff size={14}/> : <Eye size={14}/>} {showStats ? 'Sembunyikan Statistik & History' : 'Tampilkan Statistik & History'}
        </button>
      </div>

      <div className="flex-1 w-full overflow-x-auto max-w-[calc(100vw-2rem)] lg:max-w-[calc(100vw-20rem)]">
        <table className="w-full min-w-[1400px] text-sm text-left border-collapse separate border-spacing-0">
          <thead className="bg-[#1f4e79] text-white">
            <tr>
              <th rowSpan={2} className="py-3 px-4 border border-black text-center align-middle font-semibold w-24">JENIS RISIKO</th>
              <th rowSpan={2} className="py-3 px-2 border border-black text-center align-middle font-semibold w-10">NO</th>
              <th rowSpan={2} className="py-3 px-4 border border-black text-center align-middle font-semibold min-w-[200px]">STATEMENT</th>
              <th rowSpan={2} className="py-3 px-4 border border-black text-center align-middle font-semibold w-40">FORMULASI</th>
              <th rowSpan={2} className="py-3 px-4 border border-black text-center align-middle font-semibold w-32">TIPE DATA</th>

              <th colSpan={2} className="py-2 px-2 border border-black text-center font-semibold bg-[#163a5c]">{yearMinus2}</th>
              <th colSpan={2} className="py-2 px-2 border border-black text-center font-semibold bg-[#163a5c]">{yearMinus1}</th>

              {showStats && (
                <th colSpan={8} className="py-2 px-2 border border-black text-center font-semibold bg-[#548235]">Statistik Realisasi ({year - 3} - {year - 1})</th>
              )}

              <th colSpan={2} className="py-2 px-2 border border-black text-center font-semibold bg-[#2e75b6]">{currentYear}</th>
            </tr>
            <tr className="bg-[#1f4e79] text-white text-xs">
              <th className="py-2 px-2 border border-black text-center w-20">RKAP</th><th className="py-2 px-2 border border-black text-center w-20">RAS</th>
              <th className="py-2 px-2 border border-black text-center w-20">RKAP</th><th className="py-2 px-2 border border-black text-center w-20">RAS</th>
              {showStats && (
                <><th className="py-2 px-2 border border-black text-center w-20 bg-[#548235]">AVG 3Y</th><th className="py-2 px-2 border border-black text-center w-20 bg-[#548235]">STDEV</th><th className="py-2 px-2 border border-black text-center w-20 bg-[#548235]">AVG-1SD</th><th className="py-2 px-2 border border-black text-center w-20 bg-[#548235]">AVG+1SD</th><th className="py-2 px-2 border border-black text-center w-20 bg-[#548235]">AVG+2SD</th><th className="py-2 px-2 border border-black text-center w-20 bg-[#548235]">AVG+3SD</th><th className="py-2 px-2 border border-black text-center w-20 bg-[#548235]">MIN</th><th className="py-2 px-2 border border-black text-center w-20 bg-[#548235]">MAX</th></>
              )}
              <th className="py-2 px-2 border border-black text-center w-20 bg-[#2e75b6]">RKAP</th><th className="py-2 px-2 border border-black text-center w-20 bg-[#2e75b6]">RAS</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {Object.keys(groupedData).length === 0 ? (
              <tr><td colSpan={showStats ? 19 : 11} className="p-8 text-center text-gray-500 bg-gray-50"><div className="inline-flex p-3 bg-white rounded-full mb-2 shadow-sm border border-gray-200"><FileText className="w-6 h-6 text-gray-400" /></div><p>Belum ada data RAS Tahunan untuk periode ini.</p></td></tr>
            ) : (
              Object.entries(groupedData).map(([category, items], gi) => {
                const totalRows = items.reduce((acc, it) => acc + 1 + (showNumDen && it.hasNumeratorDenominator ? 2 : 0), 0);
                return (
                  <React.Fragment key={gi}>
                    {items.map((item, idx) => {
                      const isFirst = idx === 0;
                      const hasCalc = item.hasNumeratorDenominator;
                      const itemSpan = (showNumDen && hasCalc) ? 3 : 1;
                      const dataYearMinus2 = getHistoricalItem(item, yearMinus2);
                      const dataYearMinus1 = getHistoricalItem(item, yearMinus1);
                      const stats = showStats ? calculateStats(item) : null;
                      const unitType = item.unitType;

                      return (
                        <React.Fragment key={item.id}>
                          <tr className="hover:bg-blue-50/50 transition-colors border-b border-gray-300">
                            {isFirst && <td rowSpan={totalRows} className="px-4 py-3 font-bold align-top bg-white border border-gray-400 text-gray-900">{category}</td>}
                            <td rowSpan={itemSpan} className="px-2 py-3 text-center align-top border border-gray-400 bg-[#d9eefb]">{item.no}</td>
                            <td className="px-3 py-3 text-sm align-top border border-gray-400 bg-[#d9eefb] text-justify min-w-[250px] font-medium">{item.parameter}</td>
                            <td rowSpan={itemSpan} className="px-1 py-1 align-top border border-gray-400 bg-white"><textarea value={item.formulasi || ''} onChange={(e) => onUpdate(item.id, 'formulasi', e.target.value)} className="w-full h-full min-h-[60px] bg-transparent text-xs italic focus:outline-none focus:bg-gray-50 focus:ring-1 focus:ring-blue-300 rounded p-1 resize-none" placeholder="N/A"/></td>
                            <td rowSpan={itemSpan} className="px-2 py-3 text-xs text-center align-top border border-gray-400">{item.dataTypeExplanation}</td>
                            <td rowSpan={itemSpan} className="px-2 py-3 text-center text-xs align-top border border-gray-400">{formatRasDisplayValue(dataYearMinus2?.rkapTarget, item.unitType)}</td>
                            <td rowSpan={itemSpan} className="px-2 py-3 text-center text-xs align-top border border-gray-400">{formatRasDisplayValue(dataYearMinus2?.rasLimit, item.unitType)}</td>
                            <td rowSpan={itemSpan} className="px-2 py-3 text-center text-xs align-top border border-gray-400">{formatRasDisplayValue(dataYearMinus1?.rkapTarget, item.unitType)}</td>
                            <td rowSpan={itemSpan} className="px-2 py-3 text-center text-xs align-top border border-gray-400">{formatRasDisplayValue(dataYearMinus1?.rasLimit, item.unitType)}</td>
                            {showStats && (
                              <>
                                <td rowSpan={itemSpan} className="px-2 py-3 text-center text-xs align-top border border-gray-400 bg-green-50">{stats ? formatRasDisplayValue(stats.avg, unitType) : '-'}</td>
                                <td rowSpan={itemSpan} className="px-2 py-3 text-center text-xs align-top border border-gray-400 bg-green-50">{stats ? formatRasDisplayValue(stats.stdev, unitType) : '-'}</td>
                                <td rowSpan={itemSpan} className="px-2 py-3 text-center text-xs align-top border border-gray-400 bg-green-50">{stats ? formatRasDisplayValue(stats.avg_min_1sd, unitType) : '-'}</td>
                                <td rowSpan={itemSpan} className="px-2 py-3 text-center text-xs align-top border border-gray-400 bg-green-50">{stats ? formatRasDisplayValue(stats.avg_plus_1sd, unitType) : '-'}</td>
                                <td rowSpan={itemSpan} className="px-2 py-3 text-center text-xs align-top border border-gray-400 bg-green-50">{stats ? formatRasDisplayValue(stats.avg_plus_2sd, unitType) : '-'}</td>
                                <td rowSpan={itemSpan} className="px-2 py-3 text-center text-xs align-top border border-gray-400 bg-green-50">{stats ? formatRasDisplayValue(stats.avg_plus_3sd, unitType) : '-'}</td>
                                <td rowSpan={itemSpan} className="px-2 py-3 text-center text-xs align-top border border-gray-400 bg-green-50">{stats ? formatRasDisplayValue(stats.min, unitType) : '-'}</td>
                                <td rowSpan={itemSpan} className="px-2 py-3 text-center text-xs align-top border border-gray-400 bg-green-50">{stats ? formatRasDisplayValue(stats.max, unitType) : '-'}</td>
                              </>
                            )}
                            <td rowSpan={itemSpan} className="px-1 py-1 text-center align-top border border-gray-400 bg-blue-50"><div className="flex items-center gap-1 w-full h-full"><input type="text" value={item.rkapTarget || ''} onChange={(e) => onUpdate(item.id, 'rkapTarget', e.target.value)} className="w-full h-full bg-transparent text-center text-xs font-semibold text-blue-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-400 rounded px-1 py-2" placeholder="N/A"/></div></td>
                            <td rowSpan={itemSpan} className="px-1 py-1 text-center align-top border border-gray-400 bg-blue-50"><div className="flex items-center gap-1 w-full h-full"><input type="text" value={item.rasLimit || ''} onChange={(e) => onUpdate(item.id, 'rasLimit', e.target.value)} className="w-full h-full bg-transparent text-center text-xs font-bold text-red-600 focus:outline-none focus:bg-white focus:ring-2 focus:ring-red-400 rounded px-1 py-2" placeholder="N/A"/></div></td>
                          </tr>
                          {showNumDen && hasCalc && (
                            <>
                              <tr className="bg-indigo-50/50 text-xs text-gray-600"><td className="px-4 py-2 border border-gray-400 italic text-black bg-indigo-50">{item.numeratorLabel}</td></tr>
                              <tr className="bg-indigo-50/50 text-xs text-gray-600"><td className="px-4 py-2 border border-gray-400 italic text-black bg-indigo-50">{item.denominatorLabel}</td></tr>
                            </>
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
    </section>
  );
}