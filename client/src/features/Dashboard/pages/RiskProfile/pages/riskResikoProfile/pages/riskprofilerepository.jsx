// src/features/Dashboard/pages/RiskProfile/pages/Repository/RiskProfileRepository.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Download, Search, Filter, RefreshCw, CheckCircle, XCircle, Eye, FileText, AlertCircle, BarChart3, Loader2, Trash2, Edit3, Maximize2, Minimize2, ChevronUp, ChevronDown } from 'lucide-react';
import { YearInput, QuarterSelect } from '../components/Inputs';
import { useRiskProfileRepository, useModuleRepository } from '../hooks/riskprofilerepository.hook';

// Urutan yang diminta: investasi, pasar, likuiditas, operasional, hukum, strategik, kepatuhan, reputasi
const MODULE_ORDER = ['INVESTASI', 'PASAR', 'LIKUIDITAS', 'OPERASIONAL', 'HUKUM', 'STRATEGIK', 'KEPATUHAN', 'REPUTASI'];

// Warna untuk tiap module sesuai urutan
const MODULE_COLORS = {
  INVESTASI: '#33C2B5',
  PASAR: '#795548',
  LIKUIDITAS: '#FF6B6B',
  OPERASIONAL: '#FFA726',
  HUKUM: '#607D8B',
  STRATEGIK: '#9C27B0',
  KEPATUHAN: '#0068B3',
  REPUTASI: '#00A3DA',
};

const MODULE_NAMES = {
  INVESTASI: 'Investasi',
  PASAR: 'Pasar',
  LIKUIDITAS: 'Likuiditas',
  OPERASIONAL: 'Operasional',
  HUKUM: 'Hukum',
  STRATEGIK: 'Strategik',
  KEPATUHAN: 'Kepatuhan',
  REPUTASI: 'Reputasi',
};

// Helper untuk format angka
const fmtNumber = (v) => {
  if (v === '' || v == null) return '';
  const n = Number(v);
  if (isNaN(n)) return String(v);
  return new Intl.NumberFormat('en-US').format(n);
};

// Helper untuk format angka dengan toFixed yang aman
const safeToFixed = (value, decimals = 2) => {
  if (value == null || value === '' || isNaN(Number(value))) {
    return '0.00';
  }
  const num = Number(value);
  if (typeof num !== 'number' || isNaN(num)) {
    return '0.00';
  }
  return num.toFixed(decimals);
};

// Helper untuk format hasil - SAMA SEPERTI LIKUIDITASTABS
const formatHasil = (indicator) => {
  if (!indicator) return '';

  if (indicator.mode === 'TEKS') {
    return indicator.hasilText || '';
  }

  if (indicator.hasil !== '' && indicator.hasil != null && !isNaN(Number(indicator.hasil))) {
    const numHasil = Number(indicator.hasil);
    if (indicator.isPercent) {
      return safeToFixed(numHasil * 100, 2) + '%';
    } else {
      return safeToFixed(numHasil, 4);
    }
  }

  return '';
};

// Helper untuk format weighted
const formatWeighted = (weighted) => {
  if (weighted == null || weighted === '' || isNaN(Number(weighted))) {
    return '';
  }
  return safeToFixed(weighted, 2);
};

// Komponen Badge untuk Module
const ModuleBadge = ({ module }) => {
  const color = MODULE_COLORS[module] || '#6B7280';
  const name = MODULE_NAMES[module] || module;

  return (
    <span className="px-2 py-1 rounded-full text-xs font-medium text-white inline-flex items-center" style={{ backgroundColor: color }}>
      {name}
    </span>
  );
};

// Komponen Modal Filter
const FilterModal = ({ isOpen, onClose, selectedModules, onToggleModule, onSelectAll, onClearAll }) => {
  if (!isOpen) return null;

  const allSelected = selectedModules.length === MODULE_ORDER.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Filter Modul</h3>
              <p className="text-sm text-gray-500 mt-1">Pilih modul yang ingin ditampilkan</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <button onClick={onSelectAll} className="flex-1 px-4 py-2.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                <span className="text-lg">✓</span>
                Pilih Semua
              </button>
              <button onClick={onClearAll} className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                <span className="text-lg">✕</span>
                Hapus Semua
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {MODULE_ORDER.map((key) => (
                <button key={key} onClick={() => onToggleModule(key)} className="w-full flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedModules.includes(key) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                      {selectedModules.includes(key) && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className="font-medium text-gray-900">{MODULE_NAMES[key]}</span>
                  </div>
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: MODULE_COLORS[key] }} />
                </button>
              ))}
            </div>

            <div className="text-sm text-gray-600">
              {selectedModules.length} dari {MODULE_ORDER.length} modul dipilih
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button onClick={onClose} className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Terapkan Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Komponen Empty State - DIUBAH untuk menerima onToggleAllExpand
const EmptyState = ({ searchQuery, selectedModules, year, quarter, onResetFilters, onExpandFirst }) => {
  const hasFilters = searchQuery.trim() || selectedModules.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <FileText className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{hasFilters ? 'Data tidak ditemukan' : 'Belum ada data'}</h3>
      <p className="text-gray-600 max-w-sm mx-auto mb-6">{hasFilters ? 'Tidak ada data yang sesuai dengan filter atau pencarian Anda.' : `Tidak ada data tersedia untuk periode ${year} ${quarter}.`}</p>
      <div className="flex justify-center gap-3">
        {hasFilters && (
          <button onClick={onResetFilters} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            Reset Filter
          </button>
        )}
        {onExpandFirst && (
          <button onClick={onExpandFirst} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Maximize2 size={16} />
            Preview Data Pertama
          </button>
        )}
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Refresh Halaman
        </button>
      </div>
    </div>
  );
};

// Komponen Tabel untuk Setiap Modul - DIUBAH untuk menerima props expand
const ModuleTable = ({ moduleName, moduleData, year, quarter, onViewIndicator, isExpanded = false, onToggleExpand }) => {
  // PERBAIKAN: Ekstrak semua section unik dari data, termasuk yang tidak punya indikator
  const sections = useMemo(() => {
    console.log('=== DEBUG MODULE DATA ===', moduleName, moduleData); // DEBUG

    const sectionsMap = {};

    moduleData.forEach((item) => {
      // PERBAIKAN: Gunakan NO sebagai key untuk grouping, bukan sectionId
      // Karena section dengan no yang sama adalah section yang sama
      const sectionKey = `${item.no}`; // <-- PERUBAHAN PENTING!

      if (!sectionsMap[sectionKey]) {
        sectionsMap[sectionKey] = {
          id: sectionKey,
          module: item.moduleType,
          sectionId: item.sectionId,
          no: item.no,
          bobotSection: item.bobotSection,
          parameter: item.parameter,
          sectionDescription: item.sectionDescription,
          sectionLabel: item.sectionLabel, // <-- TAMBAHKAN INI
          indicators: [],
        };
      }
      sectionsMap[sectionKey].indicators.push(item);
    });

    // Debug: Tampilkan sections yang ditemukan
    console.log('=== DEBUG SECTIONS FOUND ===', Object.values(sectionsMap));

    // Urutkan sections berdasarkan no (numerical sorting)
    return Object.values(sectionsMap).sort((a, b) => {
      // Convert "2.1" to 2.1 untuk sorting yang benar
      const parseNo = (no) => {
        if (!no) return 0;
        const parts = no.split('.').map((part) => {
          const num = parseInt(part, 10);
          return isNaN(num) ? 0 : num;
        });
        return parts.reduce((acc, part, index) => {
          return acc + part / Math.pow(10, index);
        }, 0);
      };
      return parseNo(a.no) - parseNo(b.no);
    });
  }, [moduleData, moduleName]);

  // PERBAIKAN: Hitung total weighted hanya dari section yang punya indikator
  const totalWeighted = useMemo(() => {
    return sections.reduce((total, section) => {
      const sectionTotal = section.indicators.reduce((sum, ind) => {
        return sum + (Number(ind.weighted) || 0);
      }, 0);
      return total + sectionTotal;
    }, 0);
  }, [sections]);

  // Hitung rata-rata peringkat
  const averageRating = useMemo(() => {
    if (!moduleData.length) return 0;
    const sum = moduleData.reduce((total, item) => total + (Number(item.peringkat) || 0), 0);
    return sum / moduleData.length;
  }, [moduleData]);

  // PERBAIKAN: Count section yang punya indikator dan total section
  const sectionsWithIndicators = sections.filter((s) => s.indicators.length > 0);
  const totalSections = sections.length;

  return (
    <div className="mb-8 animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Tombol Expand/Collapse dengan Chevron */}
          <button
            onClick={onToggleExpand}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isExpanded ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            title={isExpanded ? 'Collapse Table' : 'Expand Table'}
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          <div className="w-8 h-8 rounded flex items-center justify-center text-white" style={{ backgroundColor: MODULE_COLORS[moduleName] }}>
            {moduleName.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{MODULE_NAMES[moduleName]}</h3>
            <p className="text-sm text-gray-600">
              Periode: {year} {quarter} • {moduleData.length} indikator • {totalSections} section ({sectionsWithIndicators.length} berisi data)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Total Weighted</div>
            <div className="text-xl font-bold" style={{ color: MODULE_COLORS[moduleName] }}>
              {safeToFixed(totalWeighted, 2)}
            </div>
          </div>

          {/* Tombol Expand/Collapse dengan Maximize/Minimize */}
          <button
            onClick={onToggleExpand}
            className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${isExpanded ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            title={isExpanded ? 'Collapse Table' : 'Expand Table'}
          >
            {isExpanded ? (
              <>
                <Minimize2 size={18} />
                <span className="text-sm font-medium">Collapse</span>
              </>
            ) : (
              <>
                <Maximize2 size={18} />
                <span className="text-sm font-medium">Preview Data</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabel - Tampilkan hanya jika expanded */}
      {isExpanded ? (
        <div className="bg-white rounded-2xl shadow overflow-hidden animate-fadeIn">
          <div className="relative h-[350px]">
            <div className="absolute inset-0 overflow-x-auto overflow-y-auto">
              <table className="min-w-[1450px] text-sm border border-gray-300 border-collapse">
                <thead>
                  <tr className="bg-[#1f4e79] text-white">
                    <th className="border border-black px-3 py-2 text-left" rowSpan={2} style={{ width: 60 }}>
                      No
                    </th>
                    <th className="border border-black px-3 py-2 text-left" rowSpan={2} style={{ width: 80 }}>
                      Bobot
                    </th>
                    <th className="border border-black px-3 py-2 text-left" colSpan={3}>
                      Parameter atau Indikator
                    </th>
                    <th className="border border-black px-3 py-2 text-center" rowSpan={2} style={{ width: 90 }}>
                      Bobot Indikator
                    </th>
                    <th className="border border-black px-3 py-2 text-left" rowSpan={2} style={{ minWidth: 220 }}>
                      Sumber Risiko
                    </th>
                    <th className="border border-black px-3 py-2 text-left" rowSpan={2} style={{ minWidth: 240 }}>
                      Dampak
                    </th>
                    <th className="border border-black px-3 py-2 bg-[#b7d7a8] text-center text-black" rowSpan={2}>
                      Low
                    </th>
                    <th className="border border-black px-3 py-2 bg-[#c9daf8] text-left text-black" rowSpan={2}>
                      Low to Moderate
                    </th>
                    <th className="border border-black px-3 py-2 bg-[#fff2cc] text-left text-black" rowSpan={2}>
                      Moderate
                    </th>
                    <th className="border border-black px-3 py-2 bg-[#f9cb9c] text-left text-black" rowSpan={2}>
                      Moderate to High
                    </th>
                    <th className="border border-black px-3 py-2 bg-[#e06666] text-center" rowSpan={2}>
                      High
                    </th>
                    <th className="border border-black px-3 py-2 bg-[#2e75b6]" rowSpan={2} style={{ width: 100 }}>
                      Hasil
                    </th>
                    <th className="border border-black px-3 py-2 bg-[#2e75b6]" rowSpan={2} style={{ width: 70 }}>
                      Peringkat
                    </th>
                    <th className="border border-black px-3 py-2 bg-[#2e75b6] text-white" rowSpan={2} style={{ width: 90 }}>
                      Weighted
                    </th>
                    <th className="border border-black px-3 py-2 text-center" rowSpan={2} style={{ width: 80 }}>
                      Aksi
                    </th>
                  </tr>
                  <tr className="bg-[#1f4e79] text-white">
                    <th className="border border-black px-3 py-2 text-left" style={{ minWidth: 260 }}>
                      Section
                    </th>
                    <th className="border border-black px-3 py-2 text-left" style={{ width: 70 }}>
                      Sub No
                    </th>
                    <th className="border border-black px-3 py-2 text-left" style={{ minWidth: 360 }}>
                      Indikator
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {sections.map((s) => {
                    const inds = s.indicators || [];

                    if (inds.length === 0) {
                      // PERBAIKAN: Tampilkan section meskipun tidak punya indikator
                      return (
                        <tr key={s.id} className="bg-[#e9f5e1]">
                          <td className="border px-3 py-3 text-center">{s.no}</td>
                          <td className="border px-3 py-3 text-center">{s.bobotSection}%</td>
                          <td className="border px-3 py-3" colSpan={15}>
                            {s.parameter} – Belum ada indikator
                          </td>
                        </tr>
                      );
                    }

                    // Urutkan indicators berdasarkan subNo
                    const sortedIndicators = [...inds].sort((a, b) => {
                      // Parsing subNo untuk sorting numerik yang benar
                      const parseSubNo = (subNo) => {
                        if (!subNo) return 0;
                        const parts = subNo.split('.').map((part) => {
                          const num = parseFloat(part);
                          return isNaN(num) ? 0 : num;
                        });
                        return parts.reduce((acc, part, index) => {
                          return acc + part / Math.pow(100, index);
                        }, 0);
                      };
                      return parseSubNo(a.subNo) - parseSubNo(b.subNo);
                    });

                    // Hitung rowSpan per section - SAMA SEPERTI LIKUIDITASTABS
                    const sectionRowSpan = sortedIndicators.reduce((sum, it) => {
                      const rowCount = it.mode === 'TEKS' ? 1 : it.mode === 'RASIO' ? 3 : 2;
                      return sum + rowCount;
                    }, 0);

                    return (
                      <React.Fragment key={s.id}>
                        {sortedIndicators.map((it, idx) => {
                          const firstOfSection = idx === 0;
                          const hasilDisplay = formatHasil(it);
                          const weightedDisplay = formatWeighted(it.weighted);

                          return (
                            <React.Fragment key={it.id}>
                              {/* ── baris utama indikator ── */}
                              <tr>
                                {firstOfSection && (
                                  <>
                                    <td rowSpan={sectionRowSpan} className="border px-3 py-3 align-top bg-[#d9eefb] text-center font-semibold">
                                      {s.no}
                                    </td>
                                    <td rowSpan={sectionRowSpan} className="border px-3 py-3 align-top bg-[#d9eefb] text-center">
                                      {s.bobotSection}%
                                    </td>
                                    <td rowSpan={sectionRowSpan} className="border px-3 py-3 align-top bg-[#d9eefb]">
                                      {s.parameter}
                                    </td>
                                  </>
                                )}

                                <td className="border px-3 py-3 text-center align-top bg-[#d9eefb]">{it.subNo}</td>
                                <td className="border px-3 py-3 align-top bg-[#d9eefb]">
                                  <div className="font-medium whitespace-pre-wrap">{it.indikator}</div>
                                </td>

                                <td className="border px-3 py-3 text-center align-top bg-[#d9eefb]">{it.bobotIndikator}%</td>
                                <td className="border px-3 py-3 align-top bg-[#d9eefb] whitespace-pre-wrap">{it.sumberRisiko || '-'}</td>
                                <td className="border px-3 py-3 align-top bg-[#d9eefb] whitespace-pre-wrap">{it.dampak || '-'}</td>

                                {/* Kolom-kolom Risk Level - SAMA SEPERTI LIKUIDITASTABS */}
                                <td className="border px-3 py-3 text-center bg-green-700/10 whitespace-pre-wrap">{it.low || '-'}</td>
                                <td className="border px-3 py-3 text-center bg-green-700/10 whitespace-pre-wrap">{it.lowToModerate || '-'}</td>
                                <td className="border px-3 py-3 text-center bg-green-700/10 whitespace-pre-wrap">{it.moderate || '-'}</td>
                                <td className="border px-3 py-3 text-center bg-green-700/10 whitespace-pre-wrap">{it.moderateToHigh || '-'}</td>
                                <td className="border px-3 py-3 text-center bg-green-700/10 whitespace-pre-wrap">{it.high || '-'}</td>

                                <td className="border px-3 py-3 text-right bg-gray-400/20 whitespace-pre-wrap">{hasilDisplay}</td>

                                <td className="border px-3 py-3 text-center">
                                  <div style={{ minWidth: 36, minHeight: 24 }} className="inline-block rounded bg-yellow-300 px-2">
                                    {it.peringkat}
                                  </div>
                                </td>

                                <td className="border px-3 py-3 text-right bg-gray-400/20">{weightedDisplay}</td>

                                <td className="border px-3 py-3 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <button onClick={() => onViewIndicator(it)} className="px-2 py-1 rounded border hover:bg-gray-100" title="Lihat Detail">
                                      <Eye size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>

                              {/* ── baris penyebut (untuk semua mode kecuali TEKS) ── */}
                              {/* PENTING: Di likuiditastabs.jsx, baris penyebut muncul SEBELUM pembilang untuk RASIO */}
                              {it.mode !== 'TEKS' && (
                                <tr className="bg-white">
                                  {/* Sub No */}
                                  <td className="border px-3 py-2 text-center"></td>

                                  {/* Indikator (penyebut label di SINI) */}
                                  <td className="border px-3 py-2">
                                    <div className="text-sm text-gray-700 italic">{it.penyebutLabel || '-'}</div>
                                  </td>

                                  {/* Bobot Indikator */}
                                  <td className="border px-3 py-2"></td>

                                  {/* Sumber Risiko */}
                                  <td className="border px-3 py-2"></td>

                                  {/* Dampak */}
                                  <td className="border px-3 py-2"></td>

                                  {/* Risk Level */}
                                  <td className="border px-3 py-2"></td>
                                  <td className="border px-3 py-2"></td>
                                  <td className="border px-3 py-2"></td>
                                  <td className="border px-3 py-2"></td>
                                  <td className="border px-3 py-2"></td>

                                  {/* Hasil */}
                                  <td className="border px-3 py-2 bg-[#c6d9a7] text-right">{it.penyebutValue !== null && it.penyebutValue !== undefined ? fmtNumber(it.penyebutValue) : ''}</td>

                                  {/* Peringkat */}
                                  <td className="border px-3 py-2"></td>

                                  {/* Weighted */}
                                  <td className="border px-3 py-2"></td>

                                  {/* Aksi */}
                                  <td className="border px-3 py-2"></td>
                                </tr>
                              )}

                              {/* ── baris pembilang (hanya untuk RASIO) ── */}
                              {/* PENTING: Di likuiditastabs.jsx, baris pembilang muncul SETELAH penyebut untuk RASIO */}
                              {it.mode === 'RASIO' && (
                                <tr className="bg-white">
                                  {/* Sub No */}
                                  <td className="border px-3 py-2 text-center"></td>

                                  {/* Indikator (pembilang label di SINI) */}
                                  <td className="border px-3 py-2">
                                    <div className="text-sm text-gray-700 italic">{it.pembilangLabel || '-'}</div>
                                  </td>

                                  {/* Bobot Indikator */}
                                  <td className="border px-3 py-2"></td>

                                  {/* Sumber Risiko */}
                                  <td className="border px-3 py-2"></td>

                                  {/* Dampak */}
                                  <td className="border px-3 py-2"></td>

                                  {/* Risk Level */}
                                  <td className="border px-3 py-2"></td>
                                  <td className="border px-3 py-2"></td>
                                  <td className="border px-3 py-2"></td>
                                  <td className="border px-3 py-2"></td>
                                  <td className="border px-3 py-2"></td>

                                  {/* Hasil */}
                                  <td className="border px-3 py-2 bg-[#c6d9a7] text-right">{it.pembilangValue !== null && it.pembilangValue !== undefined ? fmtNumber(it.pembilangValue) : ''}</td>

                                  {/* Peringkat */}
                                  <td className="border px-3 py-2"></td>

                                  {/* Weighted */}
                                  <td className="border px-3 py-2"></td>

                                  {/* Aksi */}
                                  <td className="border px-3 py-2"></td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </tbody>

                <tfoot>
                  <tr>
                    {/* Kolom 1-13 (No sampai High) kosong */}
                    <td className="border border-gray-400" colSpan={13}></td>

                    {/* Summary (Hasil + Peringkat) */}
                    <td className="border border-gray-400 text-white font-semibold text-center bg-[#0b3861]" colSpan={2}>
                      Summary
                    </td>

                    {/* Total Weighted */}
                    <td className="border border-gray-400 text-white font-semibold text-center bg-[#8fce00]">{safeToFixed(totalWeighted, 2)}</td>

                    {/* Kolom Aksi (kosong) */}
                    <td className="border border-gray-400"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      ) : (
        // Tampilan Compact (hanya summary) - Ketika collapsed
        <div className="bg-white border border-gray-200 rounded-xl p-4 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Total Section</p>
              <p className="text-lg font-bold mt-1">{totalSections}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Total Indicators</p>
              <p className="text-lg font-bold mt-1">{moduleData.length}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Avg Weighted</p>
              <p className="text-lg font-bold mt-1">{moduleData.length > 0 ? safeToFixed(totalWeighted / moduleData.length, 2) : '0.00'}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Avg Rating</p>
              <p className="text-lg font-bold mt-1">{moduleData.length > 0 ? safeToFixed(averageRating, 1) : '0.0'}</p>
            </div>
          </div>

          {/* Preview section dan indikator */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">Preview Section & Indikator:</p>
            <div className="space-y-3">
              {sections.slice(0, 3).map((section, index) => (
                <div key={section.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium text-gray-800">Section {section.no}:</span>
                      <span className="text-sm text-gray-600 ml-2">{section.parameter}</span>
                    </div>
                    <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">{section.indicators.length} indikator</span>
                  </div>
                  {section.indicators.length > 0 ? (
                    <div className="space-y-1">
                      {section.indicators.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex-1">
                            <p className="text-sm font-medium truncate">
                              {item.subNo} - {item.indikator?.substring(0, 40)}...
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">R: {item.peringkat}</span>
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">W: {formatWeighted(item.weighted)}</span>
                          </div>
                        </div>
                      ))}
                      {section.indicators.length > 2 && <div className="text-xs text-gray-500 text-center">+ {section.indicators.length - 2} indikator lainnya...</div>}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 italic text-center py-2">Belum ada indikator</div>
                  )}
                </div>
              ))}
              {sections.length > 3 && <div className="text-sm text-gray-500 text-center">+ {sections.length - 3} section lainnya...</div>}
            </div>
          </div>

          {/* Tombol untuk expand */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button onClick={onToggleExpand} className="w-full px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
              <Maximize2 size={16} />
              <span className="font-medium">
                Preview Full Data ({totalSections} section, {moduleData.length} indikator)
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Komponen Modal Statistics
const StatisticsModal = ({ isOpen, onClose, statistics }) => {
  if (!isOpen || !statistics) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Statistik Repository</h2>
              <p className="text-gray-600 mt-1">Ringkasan data dari semua modul</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">Total Modul</p>
                  <p className="text-2xl font-bold text-blue-800 mt-1">{statistics.totalModules || 0}</p>
                </div>
                <div className="text-blue-600">
                  <BarChart3 size={24} />
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">Total Indikator</p>
                  <p className="text-2xl font-bold text-green-800 mt-1">{statistics.totalIndicators || 0}</p>
                </div>
                <div className="text-green-600">
                  <BarChart3 size={24} />
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700">Total Weighted</p>
                  <p className="text-2xl font-bold text-purple-800 mt-1">{safeToFixed(statistics.totalWeighted, 2)}</p>
                </div>
                <div className="text-purple-600">
                  <BarChart3 size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Validation Status */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Validasi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Tervalidasi</span>
                  <span className="text-lg font-bold text-green-600">{statistics.validationStatus?.validated || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${((statistics.validationStatus?.validated || 0) / (statistics.totalIndicators || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div className="bg-white border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Belum Divalidasi</span>
                  <span className="text-lg font-bold text-yellow-600">{statistics.validationStatus?.notValidated || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{
                      width: `${((statistics.validationStatus?.notValidated || 0) / (statistics.totalIndicators || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* By Module Breakdown */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribusi per Modul</h3>
            <div className="space-y-3">
              {(statistics.byModule || []).map((mod, index) => (
                <div key={index} className="bg-white border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: MODULE_COLORS[mod.module] || '#6B7280' }} />
                      <span className="font-medium text-gray-800">{mod.module}</span>
                    </div>
                    <span className="text-sm text-gray-600">{mod.count || 0} indikator</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Total Weighted: {safeToFixed(mod.totalWeighted, 2)}</span>
                    <span className="text-gray-500">Rata-rata: {safeToFixed(mod.averageWeighted, 2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Komponen Modal Detail Indicator
const IndicatorDetailModal = ({ indicator, onClose }) => {
  if (!indicator) return null;

  // Format weighted dengan aman
  const weightedDisplay = formatWeighted(indicator.weighted);

  // Format hasil dengan aman
  const hasilDisplay = () => {
    if (indicator.mode === 'TEKS') {
      return indicator.hasilText || '';
    }

    if (indicator.hasil != null && !isNaN(Number(indicator.hasil))) {
      const numHasil = Number(indicator.hasil);
      if (indicator.isPercent) {
        return `${safeToFixed(numHasil * 100, 2)}%`;
      } else {
        return safeToFixed(numHasil, 4);
      }
    }

    return indicator.hasil || '';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Detail Indikator</h2>
              <div className="flex items-center gap-2 mt-1">
                <ModuleBadge module={indicator.moduleType} />
                <span className="text-sm text-gray-600">
                  {indicator.year} {indicator.quarter} • {indicator.subNo}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Indikator</h3>
              <p className="text-gray-800 font-medium whitespace-pre-wrap">{indicator.indikator}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Module</h3>
                <p className="text-gray-800">{MODULE_NAMES[indicator.moduleType]}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Bobot Indikator</h3>
                <p className="text-gray-800">{indicator.bobotIndikator}%</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Section</h3>
                <p className="text-gray-800">{indicator.parameter}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Mode Perhitungan</h3>
                <p className="text-gray-800">{indicator.mode}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Sumber Risiko</h3>
              <p className="text-gray-800 whitespace-pre-wrap">{indicator.sumberRisiko || '-'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Dampak</h3>
              <p className="text-gray-800 whitespace-pre-wrap">{indicator.dampak || '-'}</p>
            </div>

            {/* Risk Levels Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Level Risiko</h3>
              <div className="grid grid-cols-5 gap-2">
                <div className="border rounded-lg p-2 bg-green-50">
                  <div className="text-xs font-medium text-gray-700 mb-1">Low</div>
                  <div className="text-sm whitespace-pre-wrap">{indicator.low || '-'}</div>
                </div>
                <div className="border rounded-lg p-2 bg-blue-50">
                  <div className="text-xs font-medium text-gray-700 mb-1">Low to Moderate</div>
                  <div className="text-sm whitespace-pre-wrap">{indicator.lowToModerate || '-'}</div>
                </div>
                <div className="border rounded-lg p-2 bg-yellow-50">
                  <div className="text-xs font-medium text-gray-700 mb-1">Moderate</div>
                  <div className="text-sm whitespace-pre-wrap">{indicator.moderate || '-'}</div>
                </div>
                <div className="border rounded-lg p-2 bg-orange-50">
                  <div className="text-xs font-medium text-gray-700 mb-1">Moderate to High</div>
                  <div className="text-sm whitespace-pre-wrap">{indicator.moderateToHigh || '-'}</div>
                </div>
                <div className="border rounded-lg p-2 bg-red-50">
                  <div className="text-xs font-medium text-gray-700 mb-1">High</div>
                  <div className="text-sm whitespace-pre-wrap">{indicator.high || '-'}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Peringkat</h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">{indicator.peringkat}</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Weighted</h3>
                <p className="text-gray-800 font-bold">{weightedDisplay}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Hasil</h3>
                <p className="text-gray-800 font-bold">{hasilDisplay()}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Keterangan</h3>
              <p className="text-gray-800 whitespace-pre-wrap">{indicator.keterangan || '-'}</p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Dibuat Pada</h3>
                  <p className="text-gray-800">
                    {indicator.createdAt
                      ? new Date(indicator.createdAt).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '-'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Diperbarui Pada</h3>
                  <p className="text-gray-800">
                    {indicator.updatedAt
                      ? new Date(indicator.updatedAt).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Komponen Utama
// Komponen Utama
export const RiskProfileRepository = () => {
  // State
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewQuarter, setViewQuarter] = useState('Q1');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModules, setSelectedModules] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showStatisticsModal, setShowStatisticsModal] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [expandedModule, setExpandedModule] = useState(null);

  // Gunakan custom hook untuk API
  const {
    data,
    loading,
    error,
    filters,
    pagination,
    modules,
    periods,
    statistics, // <-- statistics dari hook
    fetchRepositoryData,
    fetchStatistics, // <-- fungsi untuk fetch statistics
    exportData,
    setYearFilter,
    setQuarterFilter,
    setModuleTypesFilter,
    setSearchFilter,
    resetFilters,
    setPageSize,
  } = useRiskProfileRepository({
    initialFilters: {
      year: new Date().getFullYear(),
      quarter: 'Q1',
    },
    initialPagination: {
      page: 1,
      limit: 100,
    },
    autoFetch: true,
  });

  // Group data by module
  const groupedByModule = useMemo(() => {
    const grouped = {};

    // Jika tidak ada modul yang dipilih, tampilkan semua modul sesuai urutan
    const modulesToShow = selectedModules.length > 0 ? selectedModules.sort((a, b) => MODULE_ORDER.indexOf(a) - MODULE_ORDER.indexOf(b)) : MODULE_ORDER;

    // Inisialisasi semua modul
    modulesToShow.forEach((module) => {
      grouped[module] = [];
    });

    // Filter data berdasarkan search query (jika ada)
    let filteredData = data || [];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filteredData = (data || []).filter(
        (item) =>
          (item.indikator && item.indikator.toLowerCase().includes(q)) ||
          (item.subNo && item.subNo.toLowerCase().includes(q)) ||
          (item.sumberRisiko && item.sumberRisiko.toLowerCase().includes(q)) ||
          (item.dampak && item.dampak.toLowerCase().includes(q)) ||
          (item.parameter && item.parameter.toLowerCase().includes(q)) ||
          (item.low && item.low.toLowerCase().includes(q)) ||
          (item.lowToModerate && item.lowToModerate.toLowerCase().includes(q)) ||
          (item.moderate && item.moderate.toLowerCase().includes(q)) ||
          (item.moderateToHigh && item.moderateToHigh.toLowerCase().includes(q)) ||
          (item.high && item.high.toLowerCase().includes(q)),
      );
    }

    // Group by module
    filteredData.forEach((item) => {
      if (grouped[item.moduleType]) {
        grouped[item.moduleType].push(item);
      }
    });

    return grouped;
  }, [data, searchQuery, selectedModules]);

  // Hitung total weighted
  const totalWeighted = useMemo(() => {
    return (data || []).reduce((total, item) => total + (Number(item.weighted) || 0), 0);
  }, [data]);

  // Hitung module dengan data - DIUBAH untuk mempertahankan urutan
  const modulesWithData = useMemo(() => {
    return MODULE_ORDER.filter((module) => groupedByModule[module] && groupedByModule[module].length > 0);
  }, [groupedByModule]);

  // Handler untuk filter
  const handleYearChange = useCallback(
    (year) => {
      setViewYear(year);
      setYearFilter(year);
      // Reset expanded module ketika tahun berubah
      setExpandedModule(null);
    },
    [setYearFilter],
  );

  const handleQuarterChange = useCallback(
    (quarter) => {
      setViewQuarter(quarter);
      setQuarterFilter(quarter);
      // Reset expanded module ketika quarter berubah
      setExpandedModule(null);
    },
    [setQuarterFilter],
  );

  const handleModuleToggle = useCallback(
    (module) => {
      const newModules = selectedModules.includes(module) ? selectedModules.filter((m) => m !== module) : [...selectedModules, module];

      setSelectedModules(newModules);
      setModuleTypesFilter(newModules.length > 0 ? newModules : undefined);
      // Reset expanded module ketika filter berubah
      setExpandedModule(null);
    },
    [selectedModules, setModuleTypesFilter],
  );

  const handleSelectAll = useCallback(() => {
    setSelectedModules(MODULE_ORDER);
    setModuleTypesFilter(MODULE_ORDER);
    // Reset expanded module ketika select all
    setExpandedModule(null);
  }, [setModuleTypesFilter]);

  const handleClearAll = useCallback(() => {
    setSelectedModules([]);
    setModuleTypesFilter(undefined);
    // Reset expanded module ketika clear all
    setExpandedModule(null);
  }, [setModuleTypesFilter]);

  const handleSearch = useCallback(
    (query) => {
      setSearchQuery(query);
      setSearchFilter(query);
      // Reset expanded module ketika search berubah
      setExpandedModule(null);
    },
    [setSearchFilter],
  );

  const handleExport = useCallback(async () => {
    try {
      await exportData();
    } catch (err) {
      console.error('Export failed:', err);
    }
  }, [exportData]);

  // PERBAIKAN: Update handler untuk fetch statistics
  const handleViewStatistics = useCallback(async () => {
    try {
      // Panggil fetchStatistics dari hook
      await fetchStatistics(viewYear, viewQuarter);
      // Setelah berhasil fetch, tampilkan modal
      setShowStatisticsModal(true);
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
      // Fallback: hitung dari data yang ada
      const calculatedStats = calculateStatisticsFromData();
      // Gunakan statistics yang sudah ada di state hook
      // atau buat state lokal untuk fallback statistics
    }
  }, [fetchStatistics, viewYear, viewQuarter]);

  // Helper untuk menghitung statistics dari data yang ada (fallback)
  const calculateStatisticsFromData = useCallback(() => {
    if (!data || data.length === 0) {
      return {
        totalModules: 0,
        totalIndicators: 0,
        totalWeighted: 0,
        byModule: [],
        byQuarter: [],
        validationStatus: { validated: 0, notValidated: 0 },
      };
    }

    // Hitung total weighted
    const totalWeighted = data.reduce((sum, item) => sum + (Number(item.weighted) || 0), 0);

    // Hitung per module
    const byModule = MODULE_ORDER.map((moduleName) => {
      const moduleData = groupedByModule[moduleName] || [];
      const moduleWeighted = moduleData.reduce((sum, item) => sum + (Number(item.weighted) || 0), 0);

      return {
        module: moduleName,
        count: moduleData.length,
        totalWeighted: moduleWeighted,
        averageWeighted: moduleData.length > 0 ? moduleWeighted / moduleData.length : 0,
      };
    }).filter((mod) => mod.count > 0);

    // Hitung by quarter
    const byQuarterMap = {};
    data.forEach((item) => {
      const key = `${item.year}-${item.quarter}`;
      if (!byQuarterMap[key]) {
        byQuarterMap[key] = {
          quarter: item.quarter,
          count: 0,
          totalWeighted: 0,
        };
      }
      byQuarterMap[key].count++;
      byQuarterMap[key].totalWeighted += Number(item.weighted) || 0;
    });

    const byQuarter = Object.values(byQuarterMap);

    // Hitung validation status
    const validationStatus = {
      validated: data.filter((item) => item.isValidated === true).length,
      notValidated: data.filter((item) => !item.isValidated || item.isValidated === false).length,
    };

    return {
      totalModules: modulesWithData.length,
      totalIndicators: data.length,
      totalWeighted,
      byModule,
      byQuarter,
      validationStatus,
    };
  }, [data, groupedByModule, modulesWithData]);

  // Handler untuk expand/collapse module
  const handleToggleModuleExpand = useCallback((moduleName) => {
    setExpandedModule((prev) => {
      if (prev === moduleName) {
        return null;
      }
      return moduleName;
    });
  }, []);

  // Handler untuk expand modul pertama
  const handleExpandFirstModule = useCallback(() => {
    if (modulesWithData.length > 0) {
      setExpandedModule(modulesWithData[0]);
    }
  }, [modulesWithData]);

  // Handler untuk melihat detail indikator
  const handleViewIndicator = useCallback((indicator) => {
    setSelectedIndicator(indicator);
  }, []);

  // Handler untuk refresh dengan semua data
  const handleRefreshAllData = useCallback(async () => {
    try {
      console.log('Refreshing all data...');
      setPageSize(0); // Pastikan limit = 0 untuk ambil semua data
      await fetchRepositoryData();
    } catch (err) {
      console.error('Failed to refresh data:', err);
    }
  }, [fetchRepositoryData, setPageSize]);

  return (
    <div className="space-y-6">
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
        `}
      </style>

      {/* HEADER dengan warna sama seperti RAS */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg text-white p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Risk Profile Repository</h1>
              <p className="text-blue-100 text-sm">Konsolidasi data dari semua modul risiko</p>
            </div>
          </div>

          {/* Info Periode */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <div className="text-sm text-blue-100">Periode Saat Ini</div>
            <div className="text-lg font-bold">
              {viewYear} {viewQuarter}
            </div>
          </div>
        </div>

        {/* Filter dan Action Section */}
        <div className="flex flex-wrap items-center gap-4 mt-6">
          {/* Tahun dan Quarter */}
          <div className="flex items-center gap-4">
            {/* Tahun */}
            <div className="flex flex-col gap-1.5 min-w-[120px]">
              <label className="text-xs font-medium text-white/90">Tahun</label>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-400/10 rounded-lg blur-sm" />
                <YearInput
                  value={viewYear}
                  onChange={handleYearChange}
                  disabled={loading}
                  className="relative bg-white border border-white/30 rounded-lg px-3 py-2 text-gray-900 font-medium text-center focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all w-full"
                />
              </div>
            </div>

            {/* Triwulan */}
            <div className="flex flex-col gap-1.5 min-w-[120px]">
              <label className="text-xs font-medium text-white/90">Triwulan</label>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 rounded-lg blur-sm" />
                <QuarterSelect
                  value={viewQuarter}
                  onChange={handleQuarterChange}
                  disabled={loading}
                  className="relative bg-white border border-white/30 rounded-lg px-3 py-2 text-gray-900 font-medium text-center focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all w-full"
                />
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative group flex-1 max-w-md">
            <input
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Cari no/sub/indikator/keterangan…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/70 focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all h-[46px]"
              disabled={loading}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleRefreshAllData}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold hover:bg-white/30 transition-all shadow-lg h-[46px] min-w-[120px] justify-center"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
              <span>Refresh</span>
            </button>

            {/* <button
              onClick={handleExport}
              disabled={loading || (data || []).length === 0}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-white text-blue-600 font-semibold hover:bg-gray-100 transition-all shadow-lg h-[46px] min-w-[120px] justify-center"
            >
              <Download className="w-5 h-5" />
              <span>Export</span>
            </button> */}

            <button
              onClick={() => setShowFilterModal(true)}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-emerald-500/80 text-white font-semibold hover:bg-emerald-600 transition-all shadow-lg h-[46px] min-w-[120px] justify-center border border-emerald-400/50"
            >
              <Filter className="w-5 h-5" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </header>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
          <button onClick={() => window.location.reload()} className="text-red-700 hover:text-red-900">
            Refresh
          </button>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Memuat data repository...
        </div>
      )}

      {/* Module Filter */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Filter size={16} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filter Modul:</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowFilterModal(true)} className="text-sm text-blue-600 hover:text-blue-800">
              Buka Filter Modal
            </button>
            {/* <button onClick={handleViewStatistics} disabled={loading || (data || []).length === 0} className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 disabled:opacity-50">
              <BarChart3 size={14} />
              Lihat Statistik
            </button> */}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {MODULE_ORDER.map((key) => (
            <button
              key={key}
              onClick={() => handleModuleToggle(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedModules.includes(key) ? 'text-white ring-2 ring-offset-1' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
              style={
                selectedModules.includes(key)
                  ? {
                      backgroundColor: MODULE_COLORS[key],
                      borderColor: MODULE_COLORS[key],
                      ringColor: MODULE_COLORS[key],
                    }
                  : {}
              }
              disabled={loading}
            >
              {MODULE_NAMES[key]}
              {selectedModules.includes(key) && <span className="ml-1">✓</span>}
            </button>
          ))}
          {selectedModules.length > 0 && (
            <button onClick={handleClearAll} className="px-3 py-1.5 rounded-full text-xs font-medium bg-white border text-gray-600 hover:bg-gray-50" disabled={loading}>
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Modul</p>
              <p className="text-2xl font-bold mt-1">{modulesWithData.length}</p>
            </div>
            <div className="text-blue-600 bg-blue-50 p-2 rounded-lg">📊</div>
          </div>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Indikator</p>
              <p className="text-2xl font-bold mt-1">{(data || []).length}</p>
            </div>
            <div className="text-green-600 bg-green-50 p-2 rounded-lg">📈</div>
          </div>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Weighted</p>
              <p className="text-2xl font-bold mt-1">{safeToFixed(totalWeighted, 2)}</p>
            </div>
            <div className="text-purple-600 bg-purple-50 p-2 rounded-lg">⚖️</div>
          </div>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Periode</p>
              <p className="text-2xl font-bold mt-1">
                {viewYear} {viewQuarter}
              </p>
            </div>
            <div className="text-orange-600 bg-orange-50 p-2 rounded-lg">📅</div>
          </div>
        </div>
      </div>

      {/* Info Expanded Module */}
      {expandedModule && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Maximize2 size={16} className="text-blue-600" />
            <span className="text-blue-800 font-medium">
              Sedang preview:{' '}
              <span className="font-bold" style={{ color: MODULE_COLORS[expandedModule] }}>
                {MODULE_NAMES[expandedModule]}
              </span>
            </span>
          </div>
          <button onClick={() => setExpandedModule(null)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Close Preview
          </button>
        </div>
      )}

      {/* TABEL-TABEL UNTUK SETIAP MODUL */}
      <section className="space-y-6">
        {!loading && (data || []).length === 0 ? (
          <EmptyState searchQuery={searchQuery} selectedModules={selectedModules} year={viewYear} quarter={viewQuarter} onResetFilters={resetFilters} onExpandFirst={handleExpandFirstModule} />
        ) : (
          modulesWithData.map((moduleName) => (
            <ModuleTable
              key={moduleName}
              moduleName={moduleName}
              moduleData={groupedByModule[moduleName]}
              year={viewYear}
              quarter={viewQuarter}
              onViewIndicator={handleViewIndicator}
              isExpanded={expandedModule === moduleName}
              onToggleExpand={() => handleToggleModuleExpand(moduleName)}
            />
          ))
        )}
      </section>

      {/* Filter Modal */}
      <FilterModal isOpen={showFilterModal} onClose={() => setShowFilterModal(false)} selectedModules={selectedModules} onToggleModule={handleModuleToggle} onSelectAll={handleSelectAll} onClearAll={handleClearAll} />

      {/* Statistics Modal */}
      {/* Gunakan statistics dari hook atau fallback yang dihitung */}
      <StatisticsModal
        isOpen={showStatisticsModal}
        onClose={() => {
          setShowStatisticsModal(false);
          // Tidak perlu reset statistics karena sudah ada di state hook
        }}
        statistics={statistics || calculateStatisticsFromData()}
      />

      {/* Indicator Detail Modal */}
      <IndicatorDetailModal indicator={selectedIndicator} onClose={() => setSelectedIndicator(null)} />
    </div>
  );
};

// Export sebagai default
export default RiskProfileRepository;
