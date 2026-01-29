import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import Header from "../../components/header/Header";
import { useHeaderStore } from "../../store/headerStore";
import { Button } from "@/components/ui/button";
import {
  StoreIcon,
  HandCoins,
  BanknoteArrowUp,
  BrainCircuit,
  Scale,
  Cog,
  ClipboardCheck,
  CircleStar,
  BrainCog,
  Handshake,
  Sprout,
  TrendingUpDown,
  Earth,
  RefreshCcw,
  ArrowBigLeftDash,
  ArrowBigRightDash,
  Save,
} from "lucide-react";
import {
  loadInherent,
  saveInherent,
  notifyRiskUpdated,
} from "../../utils/storage/riskStorageNilai";
import { computeDerived } from "../../utils/compute/computeDerived";
import UnsaveChangesModal from "../../components/PopUp/UnsaveChangesModal";

const CATEGORIES = [
  { id: "pasar-produk", label: "Pasar Produk", Icon: StoreIcon },
  { id: "likuiditas-produk", label: "Likuiditas Produk", Icon: HandCoins },
  { id: "kredit-produk", label: "Kredit Produk", Icon: BanknoteArrowUp },
  { id: "konsentrasi-produk", label: "Konsentrasi Produk", Icon: BrainCircuit },
  { id: "operasional-regulatory", label: "Operasional", Icon: Cog },
  { id: "hukum-regulatory", label: "Hukum", Icon: Scale },
  { id: "kepatuhan-regulatory", label: "Kepatuhan", Icon: ClipboardCheck },
  { id: "reputasi-regulatory", label: "Reputasi", Icon: CircleStar },
  { id: "strategis-regulatory", label: "Strategis", Icon: BrainCog },
  { id: "investasi-regulatory", label: "Investasi", Icon: Handshake },
  { id: "rentabilitas-regulatory", label: "Rentabilitas", Icon: TrendingUpDown },
  { id: "permodalan-regulatory", label: "Permodalan", Icon: Sprout },
  { id: "tatakelola-regulatory", label: "Tata Kelola", Icon: Earth },
];

const KATEGORI_OPTIONS = {
  model: [
    { value: "", label: "Semua Model" },
    { value: "tanpa_model", label: "Tanpa Model" }, 
    { value: "open_end", label: "Open-End" },
    { value: "terstruktur", label: "Terstruktur" },
  ],
  prinsip: [
    { value: "", label: "Semua Prinsip" },
    { value: "syariah", label: "Syariah" },
    { value: "konvensional", label: "Konvensional" },
  ],
  jenis: [
    { value: "", label: "Semua Jenis" },
    { value: "pasar_uang", label: "Pasar Uang" },
    { value: "pendapatan_tetap", label: "Pendapatan Tetap" },
    { value: "campuran", label: "Campuran" },
    { value: "saham", label: "Saham" },
    { value: "indeks", label: "Indeks" },
    { value: "terproteksi", label: "Terproteksi" },
  ],
  underlying: [
    { value: "", label: "Semua Underlying" },
    { value:"indeks", label: "Indeks"},
    { value: "eba", label: "Efek Beragun Aset(EBA)" },
    { value: "dinfra", label: "DinFra" },
    { value: "obligasi", label: "Obligasi" },
  ],
};

function formatPercent(value) {
  if (value == null || isNaN(value)) return "-";
  return `${Number(value).toFixed(2)}%`;
}

function getItemList(param) {
  if (Array.isArray(param.nilaiList)) return param.nilaiList;
  return [];
}

function calculateGlobalSummary(dataMap, selectedPages, filterKategori = {}) {
  let totalWeighted = 0;
  let count = 0;

  Object.keys(dataMap).forEach((catId) => {
    if (!selectedPages.includes(catId)) return;

    const rows = dataMap[catId] || [];
    rows.forEach((param) => {
      const kategori = param.kategori || {};
      let shouldInclude = true;

      if (filterKategori.model && kategori.model !== filterKategori.model) {
        shouldInclude = false;
      }
      
      if (filterKategori.prinsip && kategori.model !== "tanpa_model") {
        if (kategori.prinsip !== filterKategori.prinsip) {
          shouldInclude = false;
        }
      }
      
      if (filterKategori.jenis && kategori.model === "open_end") {
        if (kategori.jenis !== filterKategori.jenis) {
          shouldInclude = false;
        }
      }
      
      if (Array.isArray(filterKategori.underlying) && 
          filterKategori.underlying.length > 0 && 
          kategori.model === "terstruktur") {
        
        const paramUnderlying = Array.isArray(kategori.underlying) ? kategori.underlying : [];
        
        const hasOverlap = filterKategori.underlying.some(value => 
          paramUnderlying.includes(value)
        );
        
        if (!hasOverlap) {
          shouldInclude = false;
        }
      }

      if (!shouldInclude) return;

      const itemList = getItemList(param); 
      itemList.forEach((item) => {
        const derived = item.derived;
        if (derived && derived.weighted && !isNaN(derived.weighted)) {
          totalWeighted += derived.weighted;
          count++;
        }
      });
    });
  });

  const avgWeighted = count > 0 ? totalWeighted / count : 0;

  let summaryBg = "";
  if (avgWeighted >= 0 && avgWeighted < 2) summaryBg = "bg-[#2ECC71] text-white";
  else if (avgWeighted >= 2 && avgWeighted < 3) summaryBg = "bg-[#A3E635] text-black";
  else if (avgWeighted >= 3 && avgWeighted < 4) summaryBg = "bg-[#FACC15] text-black";
  else if (avgWeighted >= 4 && avgWeighted < 5) summaryBg = "bg-[#F97316] text-black";
  else if (avgWeighted >= 5) summaryBg = "bg-[#FF0000] text-white";

  return {
    totalWeighted: avgWeighted,
    summaryBg,
    count,
  };
}

function normalizeItemWithDerived(item, param) {
  if (!item) return null;

  const judul = item?.judul || {};

  const normalizedItem = {
    ...item,
    id: item?.id ?? crypto.randomUUID(),
    bobot: Number(item?.bobot ?? 0),
    judul: {
      ...judul,
      text: judul?.text ?? judul?.label ?? "",
      pembilang: judul?.pembilang ?? "",
      penyebut: judul?.penyebut ?? "",
      type: judul?.type || "",
      value: judul?.value ?? judul?.valuePembilang ?? "", 
      valuePembilang: judul?.valuePembilang ?? "",
      valuePenyebut: judul?.valuePenyebut ?? "",
    },
    riskindikator: item?.riskindikator ?? judul?.riskindikator ?? "",
    targetrisiko: item?.targetrisiko ?? judul?.targetrisiko ?? "",
    riskkategori: item?.riskkategori ?? judul?.riskkategori ?? "",
  };

  normalizedItem.derived = computeDerived(normalizedItem, param);

  return normalizedItem;
}

function normalizeInherentRowsWithDerived(rows) {
  if (!Array.isArray(rows)) return [];

  return rows
    .map((r) => {
      if (!r) return null;

      const hasNilaiList = Array.isArray(r.nilaiList);

      const normalizedRow = {
        ...r,
        id: r.id || crypto.randomUUID(),
        bobot: Number(r.bobot ?? 0),
        kategori: r.kategori || {
          model: "",
          prinsip: "",
          jenis: "",
          underlying: [],
        },
        nilaiList: hasNilaiList
          ? r.nilaiList.map((item) => (item ? normalizeItemWithDerived(item, r) : null)).filter(Boolean)
          : [],
        indicatorList: []
      };

      return normalizedRow;
    })
    .filter(Boolean);
}

function KategoriFilter({ filter, setFilter }) {
  const [showUnderlyingDropdown, setShowUnderlyingDropdown] = useState(false);
  const underlyingDropdownRef = useRef(null);

  const handleFilterChange = (key, value) => {
    setFilter(prev => {
      const newFilter = { ...prev, [key]: value };
      
      if (key === "model") {
        if (value === "tanpa_model") {
          return { 
            ...newFilter,
            prinsip: "",
            jenis: "",
            underlying: []
          };
        }
        return { 
          ...newFilter,
          jenis: "",
          underlying: [],
        };
      }
      
      return newFilter;
    });
  };

  const handleUnderlyingToggle = (value) => {
    setFilter(prev => {
      const current = Array.isArray(prev.underlying) ? prev.underlying : [];
      const newUnderlying = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      
      return { ...prev, underlying: newUnderlying };
    });
  };

  const getUnderlyingDisplayText = () => {
    if (!filter.underlying || filter.underlying.length === 0) {
      return "Semua Underlying";
    }
    
    const labels = filter.underlying.map(value => 
      KATEGORI_OPTIONS.underlying.find(o => o.value === value)?.label || value
    );
    
    return labels.join(", ");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (underlyingDropdownRef.current && !underlyingDropdownRef.current.contains(event.target)) {
        setShowUnderlyingDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full bg-blue-50 p-4 rounded-lg border border-blue-200">
      <h3 className="font-bold text-lg tracking-wide mb-3 text-blue-800">Filter Kategori</h3>
      <div className="grid grid-cols-7  gap-4">
        <div className="col-span-2">
          <label className="block text-base ml-2 font-semibold tracking-wide text-gray-700 mb-1">
            Model Produk
          </label>
          <select
            className="w-full border border-gray-950 rounded-md px-3 py-2 text-base bg-white"
            value={filter.model}
            onChange={(e) => handleFilterChange("model", e.target.value)}
          >
            {KATEGORI_OPTIONS.model.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {filter.model !== "tanpa_model" && (
          <div className="col-span-2">
            <label className="block text-base ml-2 font-semibold tracking-wide text-gray-700 mb-1">
              Prinsip
            </label>
            <select
              className="w-full border border-gray-950 rounded-md px-3 py-2 text-base bg-white"
              value={filter.prinsip}
              onChange={(e) => handleFilterChange("prinsip", e.target.value)}
            >
              {KATEGORI_OPTIONS.prinsip.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {filter.model === "open_end" && (
          <div className="col-span-2">
            <label className="block text-base ml-2 tracking-wide font-semibold text-gray-700 mb-1">
              Jenis Reksa Dana
            </label>
            <select
              className="w-full border border-gray-950 rounded-md px-3 py-2 text-base bg-white"
              value={filter.jenis}
              onChange={(e) => handleFilterChange("jenis", e.target.value)}
            >
              {KATEGORI_OPTIONS.jenis.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {filter.model === "terstruktur" && (
          <div className="col-span-2 relative" ref={underlyingDropdownRef}>
            <label className="block text-base ml-2 font-semibold tracking-wide text-gray-700 mb-1">
              Aset Dasar
            </label>
            <div className="relative">
              <button
                type="button"
                className="w-full border border-gray-950 rounded-md px-3 py-1.5 text-base bg-white text-left flex justify-between items-center"
                onClick={() => setShowUnderlyingDropdown(!showUnderlyingDropdown)}
              >
                <span className="truncate">
                  {getUnderlyingDisplayText()}
                </span>
                <span className="ml-2">▾</span>
              </button>
              
              {showUnderlyingDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                  <div className="p-2 border-b">
                    <button
                      type="button"
                      className="w-full text-left px-2 py-1 text-base font-semibold text-blue-800 hover:bg-blue-50 rounded"
                      onClick={() => {
                        setFilter(prev => ({ ...prev, underlying: [] }));
                        setShowUnderlyingDropdown(false);
                      }}
                    >
                     Select All
                    </button>
                  </div>
                  
                  {KATEGORI_OPTIONS.underlying
                    .filter(opt => opt.value !== "")
                    .map((opt) => {
                      const isSelected = filter.underlying?.includes(opt.value);
                      
                      return (
                        <div
                          key={opt.value}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 cursor-pointer"
                          onClick={() => handleUnderlyingToggle(opt.value)}
                        >
                          <input
                            type="checkbox"
                            className="accent-blue-800"
                            checked={isSelected}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleUnderlyingToggle(opt.value);
                            }}
                          />
                          <span className="text-sm">{opt.label}</span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-end">
          <button
            type="button"
            className="px-4 py-2 flex items-center bg-blue-800 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            onClick={() => setFilter({ 
              model: "", 
              prinsip: "", 
              jenis: "", 
              underlying: []
            })}
          >
            <RefreshCcw className="h-4 w-4 mr-2"/>Reset Filter
          </button>
        </div>
      </div>
      
      {(filter.model || (filter.model !== "tanpa_model" && filter.prinsip) || filter.jenis || 
        (Array.isArray(filter.underlying) && filter.underlying.length > 0 && filter.model === "terstruktur")) && (
        <div className="mt-3 text-base font-semibold text-gray-800">
          Filter aktif :<br/>
          {[
            filter.model && `Model: ${KATEGORI_OPTIONS.model.find(o => o.value === filter.model)?.label}`,
            filter.prinsip && filter.model !== "tanpa_model" && 
              `Prinsip: ${KATEGORI_OPTIONS.prinsip.find(o => o.value === filter.prinsip)?.label}`,
            filter.jenis && `Jenis: ${KATEGORI_OPTIONS.jenis.find(o => o.value === filter.jenis)?.label}`,
            Array.isArray(filter.underlying) && filter.underlying.length > 0 && 
              filter.model === "terstruktur" &&
              `Underlying: ${filter.underlying.map(v => 
                KATEGORI_OPTIONS.underlying.find(o => o.value === v)?.label || v
              ).join(", ")}`,
          ]
            .filter(Boolean)
            .join(", ")}
        </div>
      )}
    </div>
  );
}

const processInputValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      return String(value);
    }
    return value;
  }
  
  const strValue = String(value).trim();
  
  if (/[eE]/.test(strValue) || strValue.toLowerCase().includes('infinity')) {
    return strValue;
  }
  
  return strValue;
};

const formatDisplayValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "";
  }
  
  const strValue = String(value);
  
  if (strValue.toLowerCase().includes('infinity')) {
    return "∞";
  }
  
  if (/[eE]/.test(strValue)) {
    const match = strValue.match(/^([+-]?\d*\.?\d+)[eE]([+-]?\d+)$/);
    if (match) {
      const base = match[1];
      const exponent = parseInt(match[2], 10);
      
      if (exponent > 10) {
        return `${base} × 10^${exponent}`;
      }
    }
  }
  return strValue;
};

function CustomTextarea({ 
  value, 
  onChange, 
  placeholder, 
  className = "", 
  rows = 2,
  ...props 
}) {
  const textareaRef = useRef(null);
  
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);
  
  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full bg-white text-center outline-none text-base border border-black rounded resize-none overflow-y-auto ${className}`}
      style={{ 
        minHeight: '40px',
        maxHeight: '150px'
      }}
      {...props}
    />
  );
}

function SimpleTable({ rows, onUpdateRawValue, filterKategori }) {
  const filteredRows = useMemo(() => {
    if (!filterKategori.model && !filterKategori.prinsip && 
        !filterKategori.jenis && 
        (!Array.isArray(filterKategori.underlying) || filterKategori.underlying.length === 0)) {
      return rows;
    }

    return rows.filter((param) => {
      const kategori = param.kategori || {};
      let shouldInclude = true;
      
      if (filterKategori.model && kategori.model !== filterKategori.model) {
        shouldInclude = false;
      }
      
      if (filterKategori.prinsip && kategori.model !== "tanpa_model") {
        if (kategori.prinsip !== filterKategori.prinsip) {
          shouldInclude = false;
        }
      }
      
      if (filterKategori.jenis) {
        if (kategori.model === "open_end") {
          if (kategori.jenis !== filterKategori.jenis) {
            shouldInclude = false;
          }
        }
      }
      
      if (Array.isArray(filterKategori.underlying) && 
          filterKategori.underlying.length > 0) {
        
        if (kategori.model === "terstruktur") {
          const paramUnderlying = Array.isArray(kategori.underlying) ? kategori.underlying : [];
          
          const hasOverlap = filterKategori.underlying.some(value => 
            paramUnderlying.includes(value)
          );
          
          if (!hasOverlap) {
            shouldInclude = false;
          }
        }
      }
      
      return shouldInclude;
    });
  }, [rows, filterKategori]);

  if (!Array.isArray(filteredRows) || filteredRows.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 border rounded-xl">
        {rows.length > 0 ? "Tidak ada data yang sesuai dengan filter kategori" : "Tidak ada data"}
      </div>
    );
  }

  const flatRows = [];

  filteredRows.forEach((param) => {
    if (!param || !param.id) return;

    const itemList = Array.isArray(param.nilaiList) ? param.nilaiList : [];

    if (itemList.length === 0) {
      flatRows.push({
        type: "empty",
        param,
        _categoryId: param._categoryId,
        _categoryLabel: param._categoryLabel,
      });
      return;
    }

    itemList.forEach((item) => {
      if (!item || !item.id) return;

      const itemType = item.judul?.type || "Tanpa Faktor";
      
      let subKinds = ["main"];
      
      if (itemType === "Satu Faktor") {
        subKinds = ["main", "single"];
      } else if (itemType === "Dua Faktor") {
        subKinds = ["main", "frac-top", "frac-bottom"];
      }

      subKinds.forEach((kind) => {
        flatRows.push({
          kind,
          isMain: kind === "main",
          param,
          item,
          _categoryId: param._categoryId,
          _categoryLabel: param._categoryLabel,
          itemType: itemType,
        });
      });
    });
  });

  if (flatRows.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 border rounded-xl">
        Tidak ada data untuk ditampilkan
      </div>
    );
  }

  const categoryRowSpan = {};
  const paramRowSpan = {};

  flatRows.forEach((r) => {
    if (!r._categoryId || !r.param || !r.param.id) return;
    categoryRowSpan[r._categoryId] = (categoryRowSpan[r._categoryId] || 0) + 1;
    paramRowSpan[r.param.id] = (paramRowSpan[r.param.id] || 0) + 1;
  });

  const renderedCategory = {};
  const renderedParam = {};

  return (
    <div className="w-full overflow-auto border shadow">
      <table className="table-fixed text-sm w-full ">
        <thead>
          <tr>
            <th className="border border-black px-2 py-2 bg-blue-900 text-white w-10">
              Jenis Risiko
            </th>
            <th className="border border-black px-2 py-2 bg-blue-900 text-white w-48">
              Parameter
            </th>
            <th className="border border-black px-2 py-2 bg-blue-900 text-white w-64">
              Nilai atau Indicator
            </th>
            <th className="border border-black px-2 py-2 bg-blue-900 text-white w-32">
              Hasil
            </th>
          </tr>
        </thead>

        <tbody>
          {flatRows.map((row, idx) => {
            const { param, item, kind, isMain, _categoryId, _categoryLabel, itemType } = row;

            if (!param || !item) return null;

            const showCategory = !renderedCategory[_categoryId];
            const showParam = isMain && !renderedParam[param.id];

            if (showCategory) renderedCategory[_categoryId] = true;
            if (showParam) renderedParam[param.id] = true;

            let itemText = "-";
            if (kind === "main") itemText = item?.judul?.text ?? "-";
            if (kind === "single" || kind === "frac-top")
              itemText = item?.judul?.pembilang ?? "-";
            if (kind === "frac-bottom") itemText = item?.judul?.penyebut ?? "-";

            let inputValue = "";
            let fieldName = "";
            
            if (itemType === "Tanpa Faktor" && kind === "main") {
              const currentValue = item.judul?.value ?? item.judul?.valuePembilang;
              inputValue = currentValue !== null && currentValue !== undefined ? String(currentValue) : "";
              fieldName = "value";
            } else if (itemType === "Satu Faktor" && kind === "single") {
              const currentValue = item.judul?.valuePembilang;
              inputValue = currentValue !== null && currentValue !== undefined ? String(currentValue) : "";
              fieldName = "valuePembilang";
            } else if (itemType === "Dua Faktor" && kind === "frac-top") {
              const currentValue = item.judul?.valuePembilang;
              inputValue = currentValue !== null && currentValue !== undefined ? String(currentValue) : "";
              fieldName = "valuePembilang";
            } else if (itemType === "Dua Faktor" && kind === "frac-bottom") {
              const currentValue = item.judul?.valuePenyebut;
              inputValue = currentValue !== null && currentValue !== undefined ? String(currentValue) : "";
              fieldName = "valuePenyebut";
            }

            let hasilText = "-";
            if (kind === "main") {
              const hasilDisplay = item.derived?.hasilDisplay;
              hasilText = hasilDisplay !== undefined && hasilDisplay !== null ? 
                formatDisplayValue(hasilDisplay) : "-";
            } else {
              hasilText = formatDisplayValue(inputValue) || "-";
            }

            const nilaiTextClass = isMain
              ? "text-base font-bold"
              : "text-base ";
            const hasilTextClass = isMain
              ? "text-base font-semibold"
              : "text-sm";

            const editKey = `${item.id}:${kind}`;

            return (
              <tr key={`${idx}-${editKey}`}>
                {showCategory && (
                  <td
                    rowSpan={categoryRowSpan[_categoryId]}
                    className="align-middle text-center p-2 bg-[#E8F5FA] font-semibold border-2 border-black tracking-widest"
                    style={{
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      transform: 'rotate(180deg)',
                    }}
                  >
                    <div className="flex items-center text-lg justify-center h-full">
                      {_categoryLabel}
                    </div>
                  </td>
                )}

                {showParam && (
                  <td
                    rowSpan={paramRowSpan[param.id]}
                    className="border border-black px-2 align-middle text-lg text-center bg-[#E8F5FA] font-semibold"
                    style={{ verticalAlign: 'middle' }}
                  >
                    {param.judul || "-"}
                  </td>
                )}

                <td className={`border border-black p-0 ${isMain ? 'bg-[#E8F5FA]' : ''}`}>
                  <div className="w-full h-full flex items-center">
                    <div className={nilaiTextClass}>
                      <div className="px-2 w-full">{itemText}</div>
                    </div>
                  </div>
                </td>

                <td className="border border-black bg-[#E8F5FA] px-2 py-2">
                  {kind === "main" ? (
                    itemType === "Tanpa Faktor" ? (
                      <div className="space-y-1">
                        <div className="font-semibold text-lg text-gray-950 text-center break-words">
                          {hasilText}
                        </div>
                        <CustomTextarea
                          value={inputValue}
                          onChange={(e) => {
                            const value = e.target.value;
                            
                            if (value === "") {
                              onUpdateRawValue({
                                categoryId: _categoryId,
                                paramId: param.id,
                                itemId: item.id,
                                field: fieldName,
                                value: null,
                              });
                              return;
                            }
                            
                            const processedValue = processInputValue(value);
                            
                            onUpdateRawValue({
                              categoryId: _categoryId,
                              paramId: param.id,
                              itemId: item.id,
                              field: fieldName,
                              value: processedValue,
                            });
                          }}
                          onBlur={(e) => {
                            if (e.target.value === "") {
                              onUpdateRawValue({
                                categoryId: _categoryId,
                                paramId: param.id,
                                itemId: item.id,
                                field: fieldName,
                                value: null,
                              });
                            }
                          }}
                          placeholder="Masukkan nilai"
                        />
                      </div>
                    ) : (
                      <div className="font-semibold text-gray-950 text-center break-words">
                        {hasilText}
                      </div>
                    )
                  ) : (
                    <div className="space-y-1">
                      <CustomTextarea
                        value={inputValue}
                        onChange={(e) => {
                          const value = e.target.value;
                          
                          if (value === "") {
                            onUpdateRawValue({
                              categoryId: _categoryId,
                              paramId: param.id,
                              itemId: item.id,
                              field: fieldName,
                              value: null,
                            });
                            return;
                          }
                          
                          const processedValue = processInputValue(value);
                          
                          onUpdateRawValue({
                            categoryId: _categoryId,
                            paramId: param.id,
                            itemId: item.id,
                            field: fieldName,
                            value: processedValue,
                          });
                        }}
                        onBlur={(e) => {
                          if (e.target.value === "") {
                            onUpdateRawValue({
                              categoryId: _categoryId,
                              paramId: param.id,
                              itemId: item.id,
                              field: fieldName,
                              value: null,
                            });
                          }
                        }}
                        placeholder="Masukkan nilai"
                      />
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function RekapData() {
  const { year, activeQuarter, search } = useHeaderStore();

  const [selectedPages, setSelectedPages] = useState([]);
  const [dataMap, setDataMap] = useState({});
  const [kategoriFilter, setKategoriFilter] = useState({
    model: "",
    prinsip: "",
    jenis: "",
    underlying: [],
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsaveModal, setShowUnsaveModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const pageSize = 7;

  const paginationRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);

  const selectAllPages = () => {
    if (hasUnsavedChanges) {
      setPendingAction(() => () => {
        setSelectedPages(CATEGORIES.map(category => category.id));
        setHasUnsavedChanges(false);
      });
      setShowUnsaveModal(true);
    } else {
      setSelectedPages(CATEGORIES.map(category => category.id));
    }
  };

  const deselectAllPages = () => {
    if (hasUnsavedChanges) {
      setPendingAction(() => () => {
        setSelectedPages([]);
        setHasUnsavedChanges(false);
      });
      setShowUnsaveModal(true);
    } else {
      setSelectedPages([]);
    }
  };

  const toggleAllPages = () => {
    if (selectedPages.length === CATEGORIES.length) {
      deselectAllPages();
    } else {
      selectAllPages();
    }
  };

  const togglePage = (id) => {
    if (hasUnsavedChanges) {
      setPendingAction(() => () => {
        setSelectedPages((prev) => {
          if (prev.includes(id)) {
            return prev.filter((x) => x !== id);
          } else {
            return [...prev, id];
          }
        });
        setHasUnsavedChanges(false);
      });
      setShowUnsaveModal(true);
    } else {
      setSelectedPages((prev) => {
        if (prev.includes(id)) {
          return prev.filter((x) => x !== id);
        } else {
          return [...prev, id];
        }
      });
    }
  };

  useEffect(() => {
    const next = {};

    selectedPages.forEach((catId) => {
      try {
        const rows = loadInherent({
          categoryId: catId,
          year,
          quarter: activeQuarter,
        });

        next[catId] = normalizeInherentRowsWithDerived(rows);
      } catch (e) {
        console.error("Rekap load error:", e);
        next[catId] = [];
      }
    });

    setDataMap(next);
    setHasUnsavedChanges(false);
  }, [selectedPages, year, activeQuarter]);

  const handleUpdateRawValue = ({ categoryId, paramId, itemId, field, value }) => {
    setDataMap((prev) => {
      const next = structuredClone(prev);
      const rows = next[categoryId];
      if (!rows) return prev;

      const p = rows.find((x) => x.id === paramId);
      if (!p) return prev;

      const itemList = Array.isArray(p.nilaiList) ? p.nilaiList : [];
      const item = itemList.find((x) => x.id === itemId);

      if (!item) return prev;

      if (field === "value") {
        item.judul.value = value;
        item.judul.valuePembilang = value;
      } else if (field === "valuePembilang") {
        item.judul.valuePembilang = value;
      } else if (field === "valuePenyebut") {
        item.judul.valuePenyebut = value;
      }

      item.derived = computeDerived(item, p);

      setHasUnsavedChanges(true);

      return next;
    });
  };

  const handleSaveAllChanges = () => {
    Object.keys(dataMap).forEach((catId) => {
      try {
        saveInherent({
          categoryId: catId,
          year,
          quarter: activeQuarter,
          rows: dataMap[catId],
        });
      } catch (e) {
        console.error("Error saving data for category", catId, e);
      }
    });

    notifyRiskUpdated();

    setHasUnsavedChanges(false);

    setSuccessMessage("Data berhasil disimpan!");
    setShowSuccessNotification(true);
    
    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 3000);
  };

  const handleFilterChange = (newFilter) => {
    if (hasUnsavedChanges) {
      setPendingAction(() => () => {
        setKategoriFilter(newFilter);
        setHasUnsavedChanges(false);
      });
      setShowUnsaveModal(true);
    } else {
      setKategoriFilter(newFilter);
    }
  };

  useEffect(() => {
    const handleRealTimeSync = () => {
      const next = {};

      selectedPages.forEach((catId) => {
        try {
          const rows = loadInherent({
            categoryId: catId,
            year,
            quarter: activeQuarter,
          });

          next[catId] = normalizeInherentRowsWithDerived(rows);
        } catch (e) {
          console.error("Real-time sync error:", e);
          next[catId] = [];
        }
      });

      setDataMap(next);
      setHasUnsavedChanges(false);
    };

    window.addEventListener("risk-data-updated", handleRealTimeSync);

    return () => {
      window.removeEventListener("risk-data-updated", handleRealTimeSync);
    };
  }, [selectedPages, year, activeQuarter]);

  const flattenedRows = useMemo(() => {
    const res = [];
    CATEGORIES.forEach((cat) => {
      if (!selectedPages.includes(cat.id)) return;
      (dataMap[cat.id] || []).forEach((param) => {
        if (search) {
          const s = search.toLowerCase();
          const hit =
            (param.judul || "").toLowerCase().includes(s) ||
            String(param.nomor || "").includes(s);
          if (!hit) return;
        }

        const kategori = param.kategori || {};
        let shouldInclude = true;
        
        if (kategoriFilter.model && kategori.model !== kategoriFilter.model) {
          shouldInclude = false;
        }
        
        if (kategoriFilter.prinsip && kategori.model !== "tanpa_model") {
          if (kategori.prinsip !== kategoriFilter.prinsip) {
            shouldInclude = false;
          }
        }
        
        if (kategoriFilter.jenis) {
          if (kategori.model === "open_end") {
            if (kategori.jenis !== kategoriFilter.jenis) {
              shouldInclude = false;
            }
          }
        }
        
        if (Array.isArray(kategoriFilter.underlying) && 
            kategoriFilter.underlying.length > 0) {
          
          if (kategori.model === "terstruktur") {
            const paramUnderlying = Array.isArray(kategori.underlying) ? kategori.underlying : [];
            
            const hasOverlap = kategoriFilter.underlying.some(value => 
              paramUnderlying.includes(value)
            );
            
            if (!hasOverlap) {
              shouldInclude = false;
            }
          }
        }

        if (!shouldInclude) return;

        if (Array.isArray(param.nilaiList) && param.nilaiList.length > 0) {
          res.push({
            ...param,
            _categoryId: cat.id,
            _categoryLabel: cat.label,
          });
        }
      });
    });
    return res;
  }, [selectedPages, dataMap, search, kategoriFilter]);

  const totalPages = Math.max(1, Math.ceil(flattenedRows.length / pageSize));

  const pagedRows = flattenedRows.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const globalSummary = calculateGlobalSummary(dataMap, selectedPages, kategoriFilter);

  const scrollPaginationLeft = () => {
    paginationRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollPaginationRight = () => {
    paginationRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  const handlePageClick = (page) => {
    if (hasUnsavedChanges) {
      setPendingAction(() => () => {
        setCurrentPage(page);
        setHasUnsavedChanges(false);
      });
      setShowUnsaveModal(true);
    } else {
      setCurrentPage(page);
    }
  };

  const handleModalSave = () => {
    handleSaveAllChanges();
    
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    
    setShowUnsaveModal(false);
  };

  const handleModalDontSave = () => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    
    setShowUnsaveModal(false);
    setHasUnsavedChanges(false);
  };

  const handleModalClose = () => {
    setShowUnsaveModal(false);
    setPendingAction(null);
  };

  const SuccessNotification = () => {
    if (!showSuccessNotification) return null;

    return (
      <div className="fixed top-4 right-4 z-50 animate-fade-in">
        <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 max-w-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setShowSuccessNotification(false)}
                className="inline-flex text-green-400 hover:text-green-600 focus:outline-none"
              >
                <span className="sr-only">Close</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Header title="Rekap Data" />

      <SuccessNotification />

      <div className="bg-white rounded-lg p-4 shadow space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-2xl tracking-wider">Kategori Halaman</h3>
            <div className="flex gap-2">
              <button
                onClick={toggleAllPages}
                className="px-3 py-1.5 text-xs bg-sky-700 text-white rounded-md hover:bg-sky-900 transition-colors"
              >
                {selectedPages.length === CATEGORIES.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-lg">
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map((c) => {
                const Icon = c.Icon;
                const active = selectedPages.includes(c.id);
                return (
                  <Button
                    key={c.id}
                    onClick={() => togglePage(c.id)}
                    className={
                      active
                        ? "bg-blue-900 font-semibold text-white flex-shrink-0 hover:bg-gray-300 hover:text-black"
                        : "bg-white text-black font-semibold flex-shrink-0 hover:bg-blue-900 hover:text-white"
                    }
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {c.label}
                  </Button>
                );
              })}
            </div>
          </div>
          
          <div className="mt-2 text-md font-medium ml-2 text-gray-600">
            {selectedPages.length} dari {CATEGORIES.length} kategori terpilih
          </div>
        </div>

        {selectedPages.length > 0 && (
          <KategoriFilter 
            filter={kategoriFilter} 
            setFilter={setKategoriFilter}
            onFilterChange={handleFilterChange}
          />
        )}

        <div className="flex justify-end gap-2">
          {hasUnsavedChanges && (
            <div className="flex items-center mr-4 text-yellow-600 text-sm">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Ada perubahan yang belum disimpan
            </div>
          )}
          
          <Button
            onClick={handleSaveAllChanges}
            className={`flex items-center gap-2 ${hasUnsavedChanges ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"} text-white`}
            disabled={!hasUnsavedChanges}
          >
            <Save className="w-4 h-4" />
            Simpan Perubahan
          </Button>
        </div>

        {selectedPages.length === 0 ? (
          <div className="border rounded-xl p-6 text-center text-gray-500">
            Pilih kategori halaman terlebih dahulu
          </div>
        ) : (
          <SimpleTable 
            rows={pagedRows} 
            onUpdateRawValue={handleUpdateRawValue} 
            filterKategori={kategoriFilter}
            key={`simple-table-${JSON.stringify(pagedRows.map(r => r.id))}`}
          />
        )}

        {flattenedRows.length > pageSize && (
          <div className="mt-3 flex justify-center items-center gap-4">
            {totalPages > 7 && (
              <button
                type="button"
                onClick={scrollPaginationLeft}
                className="h-10 w-10 flex items-center justify-center rounded-md border bg-white text-blue-600 font-bold hover:bg-blue-500 hover:text-white"
              >
                <ArrowBigLeftDash className="w-4 h-4" />
              </button>
            )}

            <div className="max-w-[420px] overflow-x-hidden">
              <div
                ref={paginationRef}
                className="flex gap-2 px-2 py-1 overflow-x-auto scroll-smooth"
              >
                {Array.from({ length: totalPages }, (_, i) => {
                  const page = i + 1;
                  const isActive = page === currentPage;

                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => handlePageClick(page)}
                      className={
                        "min-w-8 h-8 px-3 flex items-center justify-center rounded-md border text-sm font-semibold transition-colors duration-150 shrink-0 hover:bg-blue-600 hover:text-white " +
                        (isActive
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "bg-white border-gray-300 text-blue-600")
                      }
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
            </div>

            {totalPages > 7 && (
              <button
                type="button"
                onClick={scrollPaginationRight}
                className="h-10 w-10 flex items-center justify-center rounded-md border bg-white text-blue-600 font-bold hover:bg-blue-500 hover:text-white"
              >
                <ArrowBigRightDash className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      <UnsaveChangesModal
        isOpen={showUnsaveModal}
        onClose={handleModalClose}
        onSave={handleModalSave}
        onDontSave={handleModalDontSave}
        title="Ada Perubahan yang Belum Disimpan"
        message="Anda memiliki perubahan yang belum disimpan. Apa yang ingin Anda lakukan?"
        saveText="Simpan dan Lanjutkan"
        dontSaveText="Lanjutkan Tanpa Simpan"
        cancelText="Batal"
      />
    </div>
  );
}