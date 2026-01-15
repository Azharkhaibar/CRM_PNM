import React, { useMemo } from 'react';
import { Pencil, Trash2, FileText, List, ListX } from 'lucide-react';
import { formatRasDisplayValue, calculateRasValue, getMonthName } from '../utils/rasUtils.js';

const fmtNumber = (num) => {
  if (num === '' || num == null) return '-';
  const n = parseFloat(num);
  if (isNaN(n)) return num;
  return n.toLocaleString('id-ID');
};

const parseNumericValue = (str) => {
  if (typeof str === 'number') return str;
  if (!str) return null;
  const cleanStr = str.toString().replace(/[^0-9,.-]/g, '').replace(',', '.'); 
  const val = parseFloat(cleanStr);
  return isNaN(val) ? null : val;
};

export default function RasMonthlyTable({ 
  rows, year, selectedMonths, onEdit, onDelete, onCellClick, 
  showNumDenom = true, showDetailColumns = true 
}) {
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

  const getStanceBadgeColor = (stance) => {
    const s = String(stance).toLowerCase();
    if (s.includes('tidak toleran')) return 'bg-red-500 text-white border-[#FF0000]';
    if (s.includes('konservatif')) return 'bg-[#FFFF00] text-black border-[#FFFF00]';
    if (s.includes('moderat')) return 'bg-[#92D050] text-black border-[#92D050]';
    if (s.includes('strategis')) return 'bg-[#3C7D22] text-white border-[#3C7D22]';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getValueForMonth = (item, mIdx) => {
    const monthData = item.monthlyValues?.[mIdx];
    if (!monthData) return { final: null, display: '-' };
    const rawValue = calculateRasValue(monthData.num, monthData.den, item.unitType, monthData.man);
    let displayValue = '-';
    if (rawValue !== null) {
        displayValue = formatRasDisplayValue(rawValue, item.unitType);
    }
    return { ...monthData, final: rawValue, display: displayValue };
  };

  const getCellStyleAndHandler = (actualVal, limitStr, item) => {
    const baseStyle = "px-3 py-3 text-center font-bold align-top border border-gray-400 cursor-default";
    const limit = parseNumericValue(limitStr);
    const actual = actualVal; 
    if (actual === null || limit === null) {
        return { className: `${baseStyle} text-blue-800 bg-blue-50`, onClick: undefined };
    }
    // Logic: Realisasi < Limit = Merah (Sesuai request)
    if (actual < limit) {
      const alertStyle = `${baseStyle} text-[#FF0000] bg-[#FFEEEE] border-[#FF0000] border-dashed border-2 cursor-pointer hover:bg-red-100 transition-colors relative`;
      return {
        className: alertStyle,
        onClick: () => {
             const displayLimit = formatRasDisplayValue(limit, item.unitType);
             const displayActual = formatRasDisplayValue(actual, item.unitType);
             onCellClick({ ...item, limitDisplay: displayLimit, actualDisplay: displayActual });
        }
      };
    }
    return { className: `${baseStyle} text-blue-800 bg-blue-50`, onClick: undefined };
  };

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden border border-gray-200">
      <div className="flex-1 overflow-x-auto w-full max-w-[calc(100vw-2rem)] lg:max-w-[calc(100vw-20rem)] h-[600px]">
        <table className="w-full min-w-[2000px] text-sm text-left border-collapse separate border-spacing-0">
          <thead className="bg-[#1f4e79] text-white">
            <tr>
              <th rowSpan={2} className="py-3 px-4 border border-black text-center align-middle w-32 bg-[#1f4e79]">Risiko</th>
              
              <th rowSpan={2} className="py-3 px-2 border border-black text-center align-middle w-12 bg-[#1f4e79]">No</th>
              
              <th rowSpan={2} className="py-3 px-4 border border-black text-center align-middle min-w-[200px] bg-[#1f4e79] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)]">Parameter</th>
              
              <th rowSpan={2} className="py-3 px-2 border border-black text-center align-middle w-24">RKAP<br/>{year}</th>
              
              {showDetailColumns && (
                <th rowSpan={2} className="py-3 px-2 border border-black text-center align-middle w-32">Penjelasan<br/>Tipe Data</th>
              )}

              <th colSpan={showDetailColumns ? 3 : 2} className="py-2 px-2 border border-black text-center bg-[#163a5c]">RAS {year}</th>
              
              {showDetailColumns && (
                <th rowSpan={2} className="py-3 px-4 border border-black text-center align-middle w-40">Keterangan</th>
              )}

              {selectedMonths.map(mIdx => (
                <th key={mIdx} rowSpan={2} className="py-3 px-4 border border-black text-center align-middle w-28 bg-[#163a5c]">{getMonthName(mIdx)}</th>
              ))}
              <th rowSpan={2} className="py-3 px-2 border border-black text-center align-middle w-24">Aksi</th>
            </tr>
            <tr>
                {/* Sub-Header */}
                {showDetailColumns && (
                    <>
                        <th className="py-2 px-2 border border-black text-center text-xs w-24">Limit</th>
                        <th className="py-2 px-2 border border-black text-center text-xs min-w-28">Sikap Thd Risiko</th>
                        <th className="py-2 px-2 border border-black text-center text-xs min-w-5">Statement</th>
                    </>
                )}
                {!showDetailColumns && (
                  <>
                    <th className="py-2 px-2 border border-black text-center text-xs w-24">Limit</th>
                    <th className="py-2 px-2 border border-black text-center text-xs min-w-28">Sikap Thd Risiko</th>
                  </>
                )}
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {Object.keys(groupedData).length === 0 ? (
              <tr><td colSpan={100} className="p-8 text-center text-gray-500 bg-gray-50"><FileText className="inline w-6 h-6 mr-2"/>Belum ada data.</td></tr>
            ) : (
              Object.entries(groupedData).map(([category, items], gi) => {
                const totalRows = items.reduce((acc, it) => acc + 1 + (showNumDenom && it.hasNumeratorDenominator ? 2 : 0), 0);
                return (
                  <React.Fragment key={gi}>
                    {items.map((item, idx) => {
                      const isFirst = idx === 0;
                      const hasCalc = item.hasNumeratorDenominator;
                      const itemSpan = (showNumDenom && hasCalc) ? 3 : 1;
                      return (
                        <React.Fragment key={item.id}>
                          <tr className="hover:bg-blue-50/50">
                            
                            {isFirst && (
                              <td 
                                rowSpan={totalRows} 
                                className="px-4 py-3 font-bold align-top bg-white border border-gray-400 text-gray-900"
                              >
                                {category}
                              </td>
                            )}
                            
                            <td rowSpan={itemSpan} className="px-2 py-3 text-center align-top border border-gray-400 bg-[#d9eefb]">{item.no}</td>
                            
                            <td className="px-4 py-3 align-top border border-gray-400 font-medium bg-[#d9eefb]">{item.parameter}</td>
                            
                            
                            <td className="px-2 py-3 text-center align-top border border-gray-400 text-xs">{formatRasDisplayValue(item.rkapTarget, item.unitType) || '-'}</td>
                            
                            {showDetailColumns && <td className="px-2 py-3 text-xs align-top border border-gray-400 italic text-gray-600">{item.dataTypeExplanation}</td>}
                            
                            <td className="px-2 py-3 text-center font-bold text-red-600 align-top border border-gray-400">{formatRasDisplayValue(item.rasLimit, item.unitType)}</td>
                            <td className="px-2 py-3 text-center align-top border border-gray-400"><span className={`px-2 py-1 rounded text-[10px] font-bold border ${getStanceBadgeColor(item.riskStance)}`}>{item.riskStance}</span></td>
                            
                            {showDetailColumns && (
                                <>
                                    <td className="px-3 py-3 text-xs align-top border border-gray-400 text-justify">{item.statement}</td>
                                    <td rowSpan={itemSpan} className="px-2 py-3 text-xs align-top border border-gray-400 text-gray-600">{item.notes}</td>
                                </>
                            )}

                            {selectedMonths.map(mIdx => {
                                const val = getValueForMonth(item, mIdx);
                                const { className, onClick } = getCellStyleAndHandler(val.final, item.rasLimit, item);
                                return <td key={mIdx} className={className} onClick={onClick} title={onClick ? "Klik untuk Tindak Lanjut" : ""}>{val.display}{onClick && <div className="text-[10px] text-red-500 font-normal mt-1">(Klik)</div>}</td>;
                            })}
                            
                            <td rowSpan={itemSpan} className="px-2 py-3 text-center align-middle border border-gray-400">
                              <div className="flex flex-col items-center gap-2">
                                <button onClick={() => onEdit(item)} className="p-2 text-yellow-600 hover:bg-yellow-100 rounded border border-yellow-200"><Pencil size={14} /></button>
                                <button onClick={() => onDelete(item.id)} className="p-2 text-red-600 hover:bg-red-100 rounded border border-red-200"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                          
                          {/* BARIS DETAIL PEMBILANG/PENYEBUT */}
                          {showNumDenom && hasCalc && (
                            <>
                              <tr className="bg-indigo-50/50 text-xs text-gray-600">
                                {/* Karena Risiko & No RowSpan, cell ini menempati posisi Parameter */}
                                <td className="px-4 py-2 border border-gray-400 border-t-0 pl-8 italic border-l-0 bg-indigo-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">{(item.numeratorLabel || 'Pembilang')}</td>
                                <td colSpan={showDetailColumns ? 2 : 3} className="border border-gray-400 bg-gray-100/50"></td> {/* Spacer RKAP & Detail */}
                                {showDetailColumns && <td colSpan={3} className="border border-gray-400 bg-gray-100/50"></td>}
                                {selectedMonths.map(mIdx => <td key={mIdx} className="px-3 py-2 text-center border border-gray-400 font-mono bg-[#c6d9a7]">{fmtNumber(getValueForMonth(item, mIdx).num)}</td>)}
                              </tr>
                              <tr className="bg-indigo-50/50 text-xs text-gray-600">
                                {/* Karena Risiko & No RowSpan, cell ini menempati posisi Parameter */}
                                <td className="px-4 py-2 border border-gray-400 border-t-0 pl-8 italic border-l-0 bg-indigo-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">{(item.denominatorLabel || 'Penyebut')}</td>
                                <td colSpan={showDetailColumns ? 2 : 3} className="border border-gray-400 bg-gray-100/50"></td>
                                {showDetailColumns && <td colSpan={3} className="border border-gray-400 bg-gray-100/50"></td>}
                                {selectedMonths.map(mIdx => <td key={mIdx} className="px-3 py-2 text-center border border-gray-400 font-mono bg-[#c6d9a7]">{fmtNumber(getValueForMonth(item, mIdx).den)}</td>)}
                              </tr>
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
    </div>
  );
}