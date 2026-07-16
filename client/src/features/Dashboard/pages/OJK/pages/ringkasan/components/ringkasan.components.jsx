// src/features/Dashboard/pages/Ringkasan/components/index.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { useHeaderStore } from '../../../store/header';
import { CATEGORIES, KATEGORI_OPTIONS } from '../contants/ringkasan.contants.js';
import { getRiskColor, getRiskIndicator, formatNumber, formatPercent } from '../utils/ringkasan.utils.js';

// ==================== DRAG SCROLL HOOK ====================
function useDragScroll() {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      const rect = container.getBoundingClientRect();
      const isInside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (isInside && container.scrollWidth > container.clientWidth) {
        e.preventDefault();
        container.scrollLeft += e.deltaY * 2;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    scrollRef.current.style.cursor = 'grabbing';
    scrollRef.current.style.userSelect = 'none';
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e) => {
      if (!scrollRef.current) return;
      e.preventDefault();
      const x = e.pageX - scrollRef.current.offsetLeft;
      scrollRef.current.scrollLeft = scrollLeft - (x - startX) * 2;
    };
    const handleMouseUp = () => {
      setIsDragging(false)
      if (scrollRef.current) {
        scrollRef.current.style.cursor = 'grab';
        scrollRef.current.style.removeProperty('user-select');
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startX, scrollLeft]);

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      if (scrollRef.current) {
        scrollRef.current.style.cursor = 'grab';
        scrollRef.current.style.removeProperty('user-select');
      }
    }
  };

  return { scrollRef, handleMouseDown, handleMouseLeave };
}

// ==================== KATEGORI FILTER ====================
export function KategoriFilter({ filter, setFilter }) {
  const { updateFilter, toggleUnderlying, resetFilter } = setFilter;
  const [showUnderlyingDropdown, setShowUnderlyingDropdown] = useState(false);
  const underlyingDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (underlyingDropdownRef.current && !underlyingDropdownRef.current.contains(event.target)) {
        setShowUnderlyingDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getUnderlyingDisplayText = () => {
    if (!filter.underlying || filter.underlying.length === 0) return 'Semua Underlying';
    return filter.underlying.map((v) => KATEGORI_OPTIONS.underlying.find((o) => o.value === v)?.label || v).join(', ');
  };

  return (
    <div className="w-full bg-blue-50 p-4 rounded-lg border border-blue-200">
      <h3 className="font-semibold mb-3 text-blue-800">Filter Kategori</h3>
      <div className="flex flex-wrap gap-4">
        <SelectFilter label="Model Produk" options={KATEGORI_OPTIONS.model} value={filter.model} onChange={(e) => updateFilter('model', e.target.value)} />
        {filter.model && filter.model !== 'tanpa_model' && <SelectFilter label="Prinsip" options={KATEGORI_OPTIONS.prinsip} value={filter.prinsip} onChange={(e) => updateFilter('prinsip', e.target.value)} />}
        {filter.model === 'open_end' && <SelectFilter label="Jenis Reksa Dana" options={KATEGORI_OPTIONS.jenis} value={filter.jenis} onChange={(e) => updateFilter('jenis', e.target.value)} />}
        {filter.model === 'terstruktur' && (
          <MultiSelectFilter
            label="Aset Dasar"
            options={KATEGORI_OPTIONS.underlying.filter((o) => o.value !== '')}
            selected={filter.underlying || []}
            onToggle={toggleUnderlying}
            onReset={() => updateFilter('underlying', [])}
            show={showUnderlyingDropdown}
            setShow={setShowUnderlyingDropdown}
            displayText={getUnderlyingDisplayText()}
            ref={underlyingDropdownRef}
          />
        )}
        <div className="flex items-end">
          <button onClick={resetFilter} className="px-4 py-2 flex items-center bg-blue-800 text-white rounded-md text-sm font-medium hover:bg-blue-700">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Reset Filter
          </button>
        </div>
      </div>
    </div>
  );
}

const SelectFilter = ({ label, options, value, onChange }) => (
  <div className="min-w-[500px]">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white" value={value} onChange={onChange}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const MultiSelectFilter = React.forwardRef(({ label, options, selected, onToggle, onReset, show, setShow, displayText }, ref) => (
  <div className="min-w-[500px] relative" ref={ref}>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <button type="button" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-left flex justify-between items-center" onClick={() => setShow(!show)}>
      <span className="truncate">{displayText}</span>
      <span className="ml-2">▾</span>
    </button>
    {show && (
      <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
        <div className="p-2 border-b">
          <button
            type="button"
            className="w-full text-left px-2 py-1 text-xs text-blue-800 hover:bg-blue-50 rounded"
            onClick={() => {
              onReset();
              setShow(false);
            }}
          >
            Select All
          </button>
        </div>
        {options.map((opt) => (
          <div key={opt.value} className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 cursor-pointer" onClick={() => onToggle(opt.value)}>
            <input type="checkbox" className="accent-blue-800" checked={selected.includes(opt.value)} readOnly />
            <span className="text-sm">{opt.label}</span>
          </div>
        ))}
      </div>
    )}
  </div>
));
MultiSelectFilter.displayName = 'MultiSelectFilter';

// ==================== CATEGORY SELECTOR ====================
export function CategorySelector({ selectedPages, toggleAll, togglePage }) {
  const { scrollRef, handleMouseDown, handleMouseLeave } = useDragScroll();

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">Kategori Halaman</h3>
        <button onClick={toggleAll} className="px-3 py-1.5 text-xs bg-sky-700 text-white rounded-md hover:bg-sky-900">
          {selectedPages.length === CATEGORIES.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>
      <div className="bg-gradient-to-r from-blue-700 to-sky-600 p-2 rounded-lg">
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2 cursor-grab scrollbar-thin" onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave}>
          {CATEGORIES.map((c) => {
            const Icon = c.Icon;
            const active = selectedPages.includes(c.id);
            return (
              <Button key={c.id} onClick={() => togglePage(c.id)} className={active ? 'bg-blue-900 text-white flex-shrink-0' : 'bg-white text-black flex-shrink-0'}>
                <Icon className="w-4 h-4 mr-2" />
                {c.label}
              </Button>
            );
          })}
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-600">
        {selectedPages.length} dari {CATEGORIES.length} kategori terpilih
      </div>
    </div>
  );
}

// ==================== SUMMARY TABLE (DIPERBAIKI) ====================
export function SummaryTable({ summaryData, isLoading }) {
  const { search } = useHeaderStore();
  const searchLower = (search || '').toLowerCase().trim();

  // Pre-compute semua row + rowSpan sebelum render
  const allRows = React.useMemo(() => {
    if (isLoading || summaryData.length === 0) return [];

    const rows = [];
    const filteredPages = [];

    summaryData.forEach((pageData) => {
      const { no, categoryLabel, categoryCode, rows: pageRows } = pageData;
      if (!Array.isArray(pageRows) || pageRows.length === 0) {
        const isCategoryMatch = !searchLower || categoryLabel.toLowerCase().includes(searchLower);
        if (isCategoryMatch) {
          filteredPages.push({
            no,
            categoryLabel,
            categoryCode,
            params: []
          });
        }
        return;
      }

      const filteredParams = [];
      pageRows.forEach((param, paramIndex) => {
        const paramName = param.judul || 'Parameter';
        const paramNumber = param.nomor || (paramIndex + 1).toString();

        const isParamMatch = !searchLower ||
          categoryLabel.toLowerCase().includes(searchLower) ||
          paramName.toLowerCase().includes(searchLower) ||
          `R.${categoryCode}.${paramNumber}`.toLowerCase().includes(searchLower);

        let filteredNilaiList = [];
        if (!searchLower) {
          filteredNilaiList = param.nilaiList || [];
        } else {
          if (isParamMatch) {
            filteredNilaiList = param.nilaiList || [];
          } else if (Array.isArray(param.nilaiList)) {
            filteredNilaiList = param.nilaiList.filter((item) => {
              const indicatorText = (item?.judul?.text || '').toLowerCase();
              const itemIndexStr = `R.${categoryCode}.${item?.nomor || paramNumber}`.toLowerCase();
              return indicatorText.includes(searchLower) || itemIndexStr.includes(searchLower);
            });
          }
        }

        const shouldInclude = !searchLower || isParamMatch || filteredNilaiList.length > 0;
        if (shouldInclude) {
          filteredParams.push({
            param,
            paramName,
            paramNumber,
            nilaiList: filteredNilaiList
          });
        }
      });

      if (filteredParams.length > 0 || (!searchLower && filteredParams.length === 0)) {
        filteredPages.push({
          no,
          categoryLabel,
          categoryCode,
          params: filteredParams
        });
      }
    });

    filteredPages.forEach((pageData) => {
      const { no, categoryLabel, categoryCode, params } = pageData;

      if (params.length === 0) {
        rows.push({ type: 'no-data', categoryLabel });
        return;
      }

      // Calculate total category rowSpan
      let totalCategoryRowSpan = 0;
      params.forEach((p) => {
        const count = p.nilaiList.length;
        totalCategoryRowSpan += count === 0 ? 1 : count;
      });

      let isFirstParamInCategory = true;

      params.forEach((p) => {
        const { param, paramName, paramNumber, nilaiList } = p;
        const nilaiCount = nilaiList.length;

        if (nilaiCount === 0) {
          rows.push({
            type: 'empty-param',
            no,
            categoryLabel,
            totalCategoryRowSpan,
            isFirstParamInCategory,
            param,
            paramName,
            indeks: `R.${categoryCode}.${paramNumber}`,
          });
          isFirstParamInCategory = false;
          return;
        }

        nilaiList.forEach((item, itemIndex) => {
          const derived = item?.derived || {};
          const hasilAssessment = derived.hasilDisplay ?? derived.weighted ?? 0;
          const riskLevel = derived.riskLevel ?? derived.weighted ?? 0;

          rows.push({
            type: 'data',
            no,
            categoryLabel,
            totalCategoryRowSpan,
            isFirstParamInCategory: isFirstParamInCategory && itemIndex === 0,
            isFirstItemInParam: itemIndex === 0,
            param,
            paramName,
            nilaiCount,
            item,
            itemIndex,
            indeks: `R.${categoryCode}.${item?.nomor || paramNumber}`,
            hasilAssessment,
            riskLevel,
          });
          isFirstParamInCategory = false;
        });
      });
    });

    return rows;
  }, [summaryData, isLoading, searchLower]);

  // Render
  if (isLoading) {
    return (
      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 shadow-sm animate-pulse">
        <table className="w-full border-collapse text-sm bg-white">
          <TableHeader />
          <tbody>
            <tr>
              <td colSpan={10} className="px-4 py-12 text-center text-slate-500 font-medium">
                Memuat data ringkasan...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (summaryData.length === 0) {
    return (
      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full border-collapse text-sm bg-white">
          <TableHeader />
          <tbody>
            <tr>
              <td colSpan={10} className="px-4 py-12 text-center text-slate-500 font-medium">
                Pilih kategori halaman untuk menampilkan data ringkasan
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
      <table className="w-full border-collapse text-sm bg-white">
        <TableHeader />
        <tbody>
          {allRows.length === 0 ? (
            <tr>
              <td colSpan={10} className="px-4 py-12 text-center text-slate-500 font-medium border border-slate-200">
                {searchLower ? `Tidak ditemukan hasil pencarian untuk: "${search}"` : 'Data tidak ditemukan'}
              </td>
            </tr>
          ) : (
            allRows.map((row, idx) => {
              if (row.type === 'no-data') {
                return (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td colSpan={10} className="px-4 py-6 text-center text-red-500 font-medium border border-slate-200">
                      Data tidak ditemukan untuk Risiko {row.categoryLabel}
                    </td>
                  </tr>
                );
              }

              if (row.type === 'empty-param') {
                return (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    {row.isFirstParamInCategory && (
                      <td rowSpan={row.totalCategoryRowSpan} className="border border-slate-200 px-3 py-3 text-center bg-slate-50/90 text-slate-800 font-semibold text-sm align-top shadow-sm">
                        {row.no}
                      </td>
                    )}
                    {row.isFirstParamInCategory && (
                      <td rowSpan={row.totalCategoryRowSpan} className="border border-slate-200 px-3 py-3 bg-slate-50/90 text-slate-800 font-semibold text-sm align-top shadow-sm">
                        Risiko {row.categoryLabel}
                      </td>
                    )}
                    <td className="border border-slate-200 px-3 py-3 text-center bg-white text-slate-600 text-sm align-top">{formatPercent(row.param.bobot)}</td>
                    <td className="border border-slate-200 px-3 py-3 bg-white text-slate-700 text-sm font-medium align-top">{row.paramName}</td>
                    <td className="border border-slate-200 px-3 py-3 text-center font-mono text-xs text-slate-600 bg-white">{row.indeks}</td>
                    <td className="border border-slate-200 px-3 py-3 bg-white text-slate-400 text-sm italic">Belum ada indikator</td>
                    <td className="border border-slate-200 px-3 py-3 text-center font-mono text-xs text-slate-400 bg-white">-</td>
                    <td className="border border-slate-200 px-3 py-3 text-center font-mono text-xs text-slate-400 bg-white">-</td>
                    <td className="border border-slate-200 px-3 py-3 text-center font-mono text-xs text-slate-400 bg-white">-</td>
                    <td className="border border-slate-200 px-3 py-3 text-center bg-white">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-400">
                        N/A
                      </span>
                    </td>
                  </tr>
                );
              }

              // Data row
              const { no, categoryLabel, totalCategoryRowSpan, isFirstParamInCategory, isFirstItemInParam, param, paramName, nilaiCount, item, indeks, hasilAssessment, riskLevel } = row;

              return (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  {isFirstParamInCategory && (
                    <td rowSpan={totalCategoryRowSpan} className="border border-slate-200 px-3 py-3 text-center bg-slate-50/90 text-slate-800 font-semibold text-sm align-top shadow-sm">
                      {no}
                    </td>
                  )}
                  {isFirstParamInCategory && (
                    <td rowSpan={totalCategoryRowSpan} className="border border-slate-200 px-3 py-3 bg-slate-50/90 text-slate-800 font-semibold text-sm align-top shadow-sm">
                      Risiko {categoryLabel}
                    </td>
                  )}
                  {isFirstItemInParam && (
                    <td rowSpan={nilaiCount} className="border border-slate-200 px-3 py-3 text-center bg-white text-slate-600 text-sm align-top">
                      {formatPercent(param.bobot)}
                    </td>
                  )}
                  {isFirstItemInParam && (
                    <td rowSpan={nilaiCount} className="border border-slate-200 px-3 py-3 bg-white text-slate-700 text-sm font-medium align-top">
                      {paramName}
                    </td>
                  )}
                  <td className="border border-slate-200 px-3 py-3 text-center font-mono text-xs text-slate-600 bg-white">{indeks}</td>
                  <td className="border border-slate-200 px-3 py-3 bg-white text-slate-800 text-sm break-words max-w-[400px]">{item?.judul?.text || '-'}</td>
                  <td className="border border-slate-200 px-3 py-3 text-center font-mono text-xs text-slate-600 bg-white">{formatPercent(item.bobot)}</td>
                  <td className="border border-slate-200 px-3 py-3 text-center font-mono font-semibold text-slate-800 bg-white">{formatNumber(hasilAssessment)}</td>
                  <td className="border border-slate-200 px-3 py-3 text-center font-mono font-bold text-slate-900 bg-white">{formatNumber(riskLevel)}</td>
                  <td className="border border-slate-200 px-3 py-3 text-center bg-white">
                    <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${getRiskColor(riskLevel)}`}>
                      {getRiskIndicator(riskLevel)}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

// ==================== TABLE HEADER (DIPISAH) ====================
function TableHeader() {
  const { activeQuarter } = useHeaderStore();
  return (
    <thead>
      <tr className="bg-gradient-to-r from-blue-900 to-sky-900 text-white">
        <th rowSpan={3} className="border border-slate-700/50 px-3 py-3 text-center font-semibold text-xs uppercase tracking-wider min-w-[50px]">
          No
        </th>
        <th rowSpan={3} className="border border-slate-700/50 px-3 py-3 text-left font-semibold text-xs uppercase tracking-wider min-w-[120px]">
          Jenis Resiko
        </th>
        <th rowSpan={3} className="border border-slate-700/50 px-3 py-3 text-center font-semibold text-xs uppercase tracking-wider min-w-[60px]">
          Bobot
        </th>
        <th rowSpan={3} className="border border-slate-700/50 px-3 py-3 text-left font-semibold text-xs uppercase tracking-wider min-w-[220px]">
          Parameter
        </th>
        <th rowSpan={3} className="border border-slate-700/50 px-3 py-3 text-center font-semibold text-xs uppercase tracking-wider min-w-[90px]">
          Indeks
        </th>
        <th rowSpan={3} className="border border-slate-700/50 px-3 py-3 text-left font-semibold text-xs uppercase tracking-wider min-w-[280px]">
          Indikator/Risiko Inheren
        </th>
        <th colSpan={4} className="border border-slate-700/50 px-3 py-2 bg-slate-800 text-white text-center font-semibold text-xs uppercase tracking-wider">
          Hasil Risk Assessment
        </th>
      </tr>
      <tr className="bg-slate-850 text-white">
        <th colSpan={4} className="border border-slate-700/50 px-3 py-2 bg-slate-800 text-white text-center font-semibold text-xs tracking-wider">
          Active Quarter: {activeQuarter || '-'}
        </th>
      </tr>
      <tr className="bg-slate-800 text-slate-200">
        <th className="border border-slate-700/50 px-3 py-2 text-center font-semibold text-xs uppercase tracking-wider min-w-[50px]">Bobot</th>
        <th className="border border-slate-700/50 px-3 py-2 text-center font-semibold text-xs uppercase tracking-wider min-w-[90px]">Hasil Assessment</th>
        <th className="border border-slate-700/50 px-3 py-2 text-center font-semibold text-xs uppercase tracking-wider min-w-[90px]">Risk Level</th>
        <th className="border border-slate-700/50 px-3 py-2 text-center font-semibold text-xs uppercase tracking-wider min-w-[110px]">Risk Indicator</th>
      </tr>
    </thead>
  );
}

