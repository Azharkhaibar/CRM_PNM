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
  { id: "operasional", label: "Operasional", Icon: Cog },
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


// Fungsi untuk format persentase
function formatPercent(value) {
  if (value == null || isNaN(value)) return "-";
  return `${Number(value).toFixed(2)}%`;
}

// Fungsi untuk mengambil item list 
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
      // Filter berdasarkan kategori
      const kategori = param.kategori || {};
      let shouldInclude = true;

      // Filter model
      if (filterKategori.model && kategori.model !== filterKategori.model) {
        shouldInclude = false;
      }
      
      // Filter prinsip (tidak berlaku untuk "tanpa_model")
      if (filterKategori.prinsip && kategori.model !== "tanpa_model") {
        if (kategori.prinsip !== filterKategori.prinsip) {
          shouldInclude = false;
        }
      }
      
      // Filter jenis (hanya untuk open_end)
      if (filterKategori.jenis && kategori.model === "open_end") {
        if (kategori.jenis !== filterKategori.jenis) {
          shouldInclude = false;
        }
      }
      
      // Filter underlying (hanya untuk terstruktur) - MULTI SELECT
      if (Array.isArray(filterKategori.underlying) && 
          filterKategori.underlying.length > 0 && 
          kategori.model === "terstruktur") {
        
        const paramUnderlying = Array.isArray(kategori.underlying) ? kategori.underlying : [];
        
        // Cek apakah ada overlap antara filter dan parameter
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

/* ======================================================================
   NORMALIZER - DENGAN COMPUTE DERIVED
====================================================================== */

// Normalize individual item dengan menghitung derived values
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

  // Hitung derived values saat normalisasi
  normalizedItem.derived = computeDerived(normalizedItem, param);

  return normalizedItem;
}

function normalizeInherentRowsWithDerived(rows) {
  if (!Array.isArray(rows)) return [];

  return rows
    .map((r) => {
      if (!r) return null;

      // HANYA ambil nilaiList, abaikan indicatorList
      const hasNilaiList = Array.isArray(r.nilaiList);

      const normalizedRow = {
        ...r,
        id: r.id || crypto.randomUUID(),
        bobot: Number(r.bobot ?? 0),
        // Pastikan kategori ada
        kategori: r.kategori || {
          model: "",
          prinsip: "",
          jenis: "",
          underlying: [],
        },
        // Hanya nilaiList yang diproses
        nilaiList: hasNilaiList
          ? r.nilaiList.map((item) => (item ? normalizeItemWithDerived(item, r) : null)).filter(Boolean)
          : [],
        // indicatorList diabaikan
        indicatorList: []
      };

      return normalizedRow;
    })
    .filter(Boolean);
}

/* ======================================================================
   KATEGORI FILTER COMPONENT 
====================================================================== */

function KategoriFilter({ filter, setFilter }) {
  const [showUnderlyingDropdown, setShowUnderlyingDropdown] = useState(false);
  const underlyingDropdownRef = useRef(null);

  const handleFilterChange = (key, value) => {
    setFilter(prev => {
      const newFilter = { ...prev, [key]: value };
      
      // Reset dependent filters
      if (key === "model") {
        // Untuk "tanpa_model", reset semua filter lain
        if (value === "tanpa_model") {
          return { 
            ...newFilter,
            prinsip: "",
            jenis: "",
            underlying: []
          };
        }
        // Untuk model lain, reset jenis dan underlying
        return { 
          ...newFilter,
          jenis: "",
          underlying: [],
        };
      }
      
      return newFilter;
    });
  };

  // Handle multi-select untuk underlying
  const handleUnderlyingToggle = (value) => {
    setFilter(prev => {
      const current = Array.isArray(prev.underlying) ? prev.underlying : [];
      const newUnderlying = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      
      return { ...prev, underlying: newUnderlying };
    });
  };

  // Untuk display text
  const getUnderlyingDisplayText = () => {
    if (!filter.underlying || filter.underlying.length === 0) {
      return "Semua Underlying";
    }
    
    const labels = filter.underlying.map(value => 
      KATEGORI_OPTIONS.underlying.find(o => o.value === value)?.label || value
    );
    
    return labels.join(", ");
  };

  // Close dropdown ketika klik di luar
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
      <h3 className="font-semibold mb-3 text-blue-800">Filter Kategori</h3>
      <div className="flex flex-wrap gap-4">
        {/* Model Produk */}
        <div className="min-w-[500px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model Produk
          </label>
          <select
            className="w-full border border-gray-950 rounded-md px-3 py-2 text-sm bg-white"
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

        {/* Prinsip - Hanya tampil jika bukan "tanpa_model" */}
        {filter.model !== "tanpa_model" && (
          <div className="min-w-[500px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prinsip
            </label>
            <select
              className="w-full border border-gray-950 rounded-md px-3 py-2 text-sm bg-white"
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

        {/* Jenis Reksa Dana (hanya untuk Open-End) */}
        {filter.model === "open_end" && (
          <div className="min-w-[500px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jenis Reksa Dana
            </label>
            <select
              className="w-full border border-gray-950 rounded-md px-3 py-2 text-sm bg-white"
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

        {/* Aset Dasar (hanya untuk Terstruktur) - MULTI SELECT */}
        {filter.model === "terstruktur" && (
          <div className="min-w-[500px] relative" ref={underlyingDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Aset Dasar
            </label>
            <div className="relative">
              <button
                type="button"
                className="w-full border border-gray-950 rounded-md px-3 py-2 text-sm bg-white text-left flex justify-between items-center"
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
                      className="w-full text-left px-2 py-1 text-xs text-blue-800 hover:bg-blue-50 rounded"
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

        {/* Tombol Reset */}
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
      
      {/* Info Filter Aktif */}
      {(filter.model || (filter.model !== "tanpa_model" && filter.prinsip) || filter.jenis || 
        (Array.isArray(filter.underlying) && filter.underlying.length > 0 && filter.model === "terstruktur")) && (
        <div className="mt-3 text-sm text-gray-800">
          Filter aktif: 
          {[
            filter.model && `Model: ${KATEGORI_OPTIONS.model.find(o => o.value === filter.model)?.label}`,
            // Tampilkan prinsip hanya jika bukan "tanpa_model"
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

/* ======================================================================
   SIMPLE TABLE
====================================================================== */

function SimpleTable({ rows, onUpdateRawValue, filterKategori }) {
  // Filter rows berdasarkan kategori
  const filteredRows = useMemo(() => {
    if (!filterKategori.model && !filterKategori.prinsip && 
        !filterKategori.jenis && 
        (!Array.isArray(filterKategori.underlying) || filterKategori.underlying.length === 0)) {
      return rows;
    }

    return rows.filter((param) => {
      const kategori = param.kategori || {};
      let shouldInclude = true;
      
      // Filter model
      if (filterKategori.model && kategori.model !== filterKategori.model) {
        shouldInclude = false;
      }
      
      // Filter prinsip (tidak berlaku untuk "tanpa_model")
      if (filterKategori.prinsip && kategori.model !== "tanpa_model") {
        if (kategori.prinsip !== filterKategori.prinsip) {
          shouldInclude = false;
        }
      }
      
      // Filter jenis - HANYA berlaku jika model adalah open_end
      if (filterKategori.jenis) {
        // Jika model adalah open_end, filter berdasarkan jenis
        if (kategori.model === "open_end") {
          if (kategori.jenis !== filterKategori.jenis) {
            shouldInclude = false;
          }
        }
        // Jika model adalah terstruktur atau tanpa_model, jenis selalu kosong, jangan filter berdasarkan jenis
      }
      
      // Filter underlying - HANYA berlaku jika model adalah terstruktur - MULTI SELECT
      if (Array.isArray(filterKategori.underlying) && 
          filterKategori.underlying.length > 0) {
        
        if (kategori.model === "terstruktur") {
          const paramUnderlying = Array.isArray(kategori.underlying) ? kategori.underlying : [];
          
          // Cek apakah ada overlap antara filter dan parameter
          const hasOverlap = filterKategori.underlying.some(value => 
            paramUnderlying.includes(value)
          );
          
          if (!hasOverlap) {
            shouldInclude = false;
          }
        }
        // Jika model adalah open_end atau tanpa_model, underlying tidak relevan
      }
      
      return shouldInclude;
    });
  }, [rows, filterKategori]);

  // Early return jika tidak ada data setelah filter
  if (!Array.isArray(filteredRows) || filteredRows.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 border rounded-xl">
        {rows.length > 0 ? "Tidak ada data yang sesuai dengan filter kategori" : "Tidak ada data"}
      </div>
    );
  }

  // Proses data untuk render
  const flatRows = [];

  filteredRows.forEach((param) => {
    if (!param || !param.id) return;

    // HANYA nilaiList
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
      
      // Tentukan subKinds berdasarkan type
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

  // Fungsi untuk menentukan apakah nilai adalah angka
  const isNumeric = (value) => {
    if (value === null || value === undefined || value === "") return false;
    return !isNaN(value) && !isNaN(parseFloat(value));
  };

  // Render table
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

            // Tentukan value untuk input berdasarkan jenis
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

            // GUNAKAN hasilDisplay dari derived untuk row utama
            let hasilText = "-";
            if (kind === "main") {
              const hasilDisplay = item.derived?.hasilDisplay;
              // hasilText bisa string atau number
              hasilText = hasilDisplay !== undefined && hasilDisplay !== null ? String(hasilDisplay) : "-";
            } else {
              hasilText = inputValue || "-";
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

                <td className="border border-black px-2 py-2">
                  {/* LOGIKA RENDER BERDASARKAN JENIS DAN BARIS */}
                  {kind === "main" ? (
                    // BARIS UTAMA (main)
                    itemType === "Tanpa Faktor" ? (
                      // TANPA FAKTOR di baris utama: Hasil di atas, Input di bawah
                      <div className="space-y-1">
                        <div className="font-semibold text-gray-950 text-center">
                          {hasilText}
                        </div>
                        <input
                          type="text"
                          className="w-full bg-transparent text-center outline-none text-base border border-black rounded"
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
                            
                            const num = parseFloat(value);
                            const isNumeric = !isNaN(num) && !isNaN(parseFloat(value));
                            
                            if (isNumeric) {
                              onUpdateRawValue({
                                categoryId: _categoryId,
                                paramId: param.id,
                                itemId: item.id,
                                field: fieldName,
                                value: num,
                              });
                            } else {
                              onUpdateRawValue({
                                categoryId: _categoryId,
                                paramId: param.id,
                                itemId: item.id,
                                field: fieldName,
                                value: value,
                              });
                            }
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
                      // SATU FAKTOR atau DUA FAKTOR di baris utama: Hanya tampilkan hasil
                      <div className="font-semibold text-gray-950 text-center">
                        {hasilText}
                      </div>
                    )
                  ) : (
                    // BARIS BUKAN UTAMA (single, frac-top, frac-bottom): Hanya input
                    <div className="space-y-1">
                      <input
                        type="text"
                        className="w-full bg-transparent text-center outline-none text-base border rounded"
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
                          
                          const num = parseFloat(value);
                          const isNumeric = !isNaN(num) && !isNaN(parseFloat(value));
                          
                          if (isNumeric) {
                            onUpdateRawValue({
                              categoryId: _categoryId,
                              paramId: param.id,
                              itemId: item.id,
                              field: fieldName,
                              value: num,
                            });
                          } else {
                            onUpdateRawValue({
                              categoryId: _categoryId,
                              paramId: param.id,
                              itemId: item.id,
                              field: fieldName,
                              value: value,
                            });
                          }
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

/* ======================================================================
   MAIN PAGE
====================================================================== */

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

  const pageSize = 7;

  const kategoriScrollRef = useRef(null);
  const paginationRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  /* ====================== FUNGSI UNTUK KONTROL KATEGORI ====================== */

  // Fungsi untuk select semua kategori
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

  // Fungsi untuk deselect semua kategori
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

  // Fungsi untuk toggle semua kategori
  const toggleAllPages = () => {
    if (selectedPages.length === CATEGORIES.length) {
      deselectAllPages();
    } else {
      selectAllPages();
    }
  };

  // Fungsi untuk toggle kategori individual
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

  /* ====================== SCROLL HANDLING ====================== */

  // Handle mouse wheel untuk scroll horizontal
  useEffect(() => {
    const container = kategoriScrollRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      // Cek jika cursor ada di dalam container
      const rect = container.getBoundingClientRect();
      const isInside = 
        e.clientX >= rect.left && 
        e.clientX <= rect.right && 
        e.clientY >= rect.top && 
        e.clientY <= rect.bottom;

      if (isInside && container.scrollWidth > container.clientWidth) {
        e.preventDefault();
        container.scrollLeft += e.deltaY * 2; // Faktor kecepatan scroll
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Handle mouse drag untuk scroll
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - kategoriScrollRef.current.offsetLeft);
    setScrollLeft(kategoriScrollRef.current.scrollLeft);
    kategoriScrollRef.current.style.cursor = 'grabbing';
    kategoriScrollRef.current.style.userSelect = 'none';
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !kategoriScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - kategoriScrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Faktor kecepatan drag
    kategoriScrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (kategoriScrollRef.current) {
      kategoriScrollRef.current.style.cursor = 'grab';
      kategoriScrollRef.current.style.removeProperty('user-select');
    }
  };

  // Cleanup event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  /* ====================== LOAD DATA ====================== */

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

  /* ====================== HANDLE UPDATE RAW VALUE ====================== */

  const handleUpdateRawValue = ({ categoryId, paramId, itemId, field, value }) => {
    setDataMap((prev) => {
      const next = structuredClone(prev);
      const rows = next[categoryId];
      if (!rows) return prev;

      const p = rows.find((x) => x.id === paramId);
      if (!p) return prev;

      // HANYA nilaiList
      const itemList = Array.isArray(p.nilaiList) ? p.nilaiList : [];
      const item = itemList.find((x) => x.id === itemId);

      if (!item) return prev;

      // Update raw data berdasarkan field
      // Menerima string atau number
      if (field === "value") {
        item.judul.value = value;
        // Untuk Tanpa Faktor, valuePembilang juga diupdate agar konsisten
        item.judul.valuePembilang = value;
      } else if (field === "valuePembilang") {
        item.judul.valuePembilang = value;
      } else if (field === "valuePenyebut") {
        item.judul.valuePenyebut = value;
      }

      // Hitung ulang derived values
      item.derived = computeDerived(item, p);

      // Set flag untuk perubahan yang belum disimpan
      setHasUnsavedChanges(true);

      console.log("🚀 Updated raw value and computed derived:", {
        categoryId,
        paramId,
        itemId,
        field,
        value,
        valueType: typeof value,
        derived: item.derived,
        itemJudul: item.judul,
      });

      return next;
    });
  };

  /* ====================== SAVE ALL CHANGES ====================== */

  const handleSaveAllChanges = () => {
    // Simpan semua data yang telah diubah
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

    // Notifikasi semua halaman untuk sync
    notifyRiskUpdated();

    // Reset flag perubahan
    setHasUnsavedChanges(false);

    // Tampilkan notifikasi sukses (opsional)
    alert("Data berhasil disimpan!");
  };

  /* ====================== HANDLE FILTER CHANGE ====================== */

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

  /* ====================== REAL-TIME SYNC ====================== */

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

  /* ====================== FLATTEN DENGAN FILTER - DIPERBARUI ====================== */

  const flattenedRows = useMemo(() => {
    const res = [];
    CATEGORIES.forEach((cat) => {
      if (!selectedPages.includes(cat.id)) return;
      (dataMap[cat.id] || []).forEach((param) => {
        // Filter berdasarkan search
        if (search) {
          const s = search.toLowerCase();
          const hit =
            (param.judul || "").toLowerCase().includes(s) ||
            String(param.nomor || "").includes(s);
          if (!hit) return;
        }

        // Filter berdasarkan kategori
        const kategori = param.kategori || {};
        let shouldInclude = true;
        
        // Filter model
        if (kategoriFilter.model && kategori.model !== kategoriFilter.model) {
          shouldInclude = false;
        }
        
        // Filter prinsip (tidak berlaku untuk "tanpa_model")
        if (kategoriFilter.prinsip && kategori.model !== "tanpa_model") {
          if (kategori.prinsip !== kategoriFilter.prinsip) {
            shouldInclude = false;
          }
        }
        
        // Filter jenis - HANYA berlaku jika model adalah open_end
        if (kategoriFilter.jenis) {
          // Jika model adalah open_end, filter berdasarkan jenis
          if (kategori.model === "open_end") {
            if (kategori.jenis !== kategoriFilter.jenis) {
              shouldInclude = false;
            }
          }
          // Jika model adalah terstruktur atau tanpa_model, jenis selalu kosong, jangan filter berdasarkan jenis
        }
        
        // Filter underlying - HANYA berlaku jika model adalah terstruktur - MULTI SELECT
        if (Array.isArray(kategoriFilter.underlying) && 
            kategoriFilter.underlying.length > 0) {
          
          if (kategori.model === "terstruktur") {
            const paramUnderlying = Array.isArray(kategori.underlying) ? kategori.underlying : [];
            
            // Cek apakah ada overlap antara filter dan parameter
            const hasOverlap = kategoriFilter.underlying.some(value => 
              paramUnderlying.includes(value)
            );
            
            if (!hasOverlap) {
              shouldInclude = false;
            }
          }
          // Jika model adalah open_end atau tanpa_model, underlying tidak relevan
        }

        if (!shouldInclude) return;

        // Hanya tambah jika ada nilaiList
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

  /* ====================== PAGINATION ====================== */

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(flattenedRows.length / pageSize));

  const pagedRows = flattenedRows.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Hitung global summary dengan filter
  const globalSummary = calculateGlobalSummary(dataMap, selectedPages, kategoriFilter);

  // Fungsi untuk scroll pagination
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

  /* ====================== MODAL HANDLERS ====================== */

  const handleModalSave = () => {
    // Simpan data terlebih dahulu
    handleSaveAllChanges();
    
    // Jalankan pending action
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    
    setShowUnsaveModal(false);
  };

  const handleModalDontSave = () => {
    // Jalankan pending action tanpa save
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

  /* ====================== UI ====================== */

  return (
    <div className="space-y-4">
      <Header title="Rekap Data" />

      <div className="bg-white rounded-lg p-4 shadow space-y-4">
        {/* CATEGORY SELECTION */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Kategori Halaman</h3>
            <div className="flex gap-2">
              <button
                onClick={toggleAllPages}
                className="px-3 py-1.5 text-xs bg-blue-900 text-white rounded-md hover:bg-gray-500 transition-colors"
              >
                {selectedPages.length === CATEGORIES.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-700 to-sky-600 p-2 rounded-lg">
            <div className="max-w-[1560px] mx-auto">
              <div 
                ref={kategoriScrollRef}
                className="flex gap-4 overflow-x-auto pb-2 cursor-grab scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-200"
                style={{ 
                  scrollBehavior: 'smooth',
                  WebkitOverflowScrolling: 'touch'
                }}
                onMouseDown={handleMouseDown}
                onMouseLeave={() => {
                  if (isDragging) {
                    setIsDragging(false);
                    if (kategoriScrollRef.current) {
                      kategoriScrollRef.current.style.cursor = 'grab';
                    }
                  }
                }}
              >
                {CATEGORIES.map((c) => {
                  const Icon = c.Icon;
                  const active = selectedPages.includes(c.id);
                  return (
                    <Button
                      key={c.id}
                      onClick={() => togglePage(c.id)}
                      className={
                        active
                          ? "bg-blue-900 text-white flex-shrink-0 hover:bg-gray-300 hover:text-black"
                          : "bg-white text-black flex-shrink-0 hover:bg-blue-900 hover:text-white"
                      }
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {c.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Info jumlah yang terpilih */}
          <div className="mt-2 text-sm text-gray-600">
            {selectedPages.length} dari {CATEGORIES.length} kategori terpilih
          </div>
        </div>

        {/* KATEGORI FILTER */}
        {selectedPages.length > 0 && (
          <KategoriFilter 
            filter={kategoriFilter} 
            setFilter={setKategoriFilter}
            onFilterChange={handleFilterChange}
          />
        )}

        {/* SAVE BUTTON */}
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

        {/* SIMPLE TABLE */}
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

        {/* PAGINATION - STYLE SEPERTI DI INHERENT */}
        {flattenedRows.length > pageSize && (
          <div className="mt-3 flex justify-center items-center gap-4">
            {/* BUTTON < */}
            {totalPages > 7 && (
              <button
                type="button"
                onClick={scrollPaginationLeft}
                className="h-10 w-10 flex items-center justify-center rounded-md border bg-white text-blue-600 font-bold hover:bg-blue-500 hover:text-white"
              >
                <ArrowBigLeftDash className="w-4 h-4" />
              </button>
            )}

            {/* PAGINATION LIST */}
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

            {/* BUTTON > */}
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

      {/* UNSAVED CHANGES MODAL */}
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