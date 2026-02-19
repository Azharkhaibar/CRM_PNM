import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import Header from "../../components/header/Header";
import { useHeaderStore } from "../../store/headerStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Notification from "../../components/notification/Notification";
import * as ExcelJS from "exceljs";
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

// ==================== KONSTANTA ====================
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
    { value: "indeks", label: "Indeks" },
    { value: "eba", label: "Efek Beragun Aset(EBA)" },
    { value: "dinfra", label: "DinFra" },
    { value: "obligasi", label: "Obligasi" },
  ],
};

// ==================== FUNGSI PEMBANTU ====================
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

      if (filterKategori.model && filterKategori.model !== "" && kategori.model !== filterKategori.model) {
        shouldInclude = false;
      }
      if (filterKategori.prinsip && filterKategori.prinsip !== "" && kategori.model !== "tanpa_model") {
        if (kategori.prinsip !== filterKategori.prinsip) shouldInclude = false;
      }
      if (filterKategori.jenis && filterKategori.jenis !== "" && kategori.model === "open_end") {
        if (kategori.jenis !== filterKategori.jenis) shouldInclude = false;
      }
      if (Array.isArray(filterKategori.underlying) && filterKategori.underlying.length > 0 && kategori.model === "terstruktur") {
        const paramUnderlying = Array.isArray(kategori.underlying) ? kategori.underlying : [];
        const hasOverlap = filterKategori.underlying.some(value => paramUnderlying.includes(value));
        if (!hasOverlap) shouldInclude = false;
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
  else if (avgWeighted >= 2 && avgWeighted < 3) summaryBg = "bg-[#92D050] text-black";
  else if (avgWeighted >= 3 && avgWeighted < 4) summaryBg = "bg-[#FACC15] text-black";
  else if (avgWeighted >= 4 && avgWeighted < 5) summaryBg = "bg-[#F97316] text-black";
  else if (avgWeighted >= 5) summaryBg = "bg-[#FF0000] text-white";

  return { totalWeighted: avgWeighted, summaryBg, count };
}

function normalizeItemWithDerived(item, param, quarter = null) {
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

function normalizeInherentRowsWithDerived(rows, quarter = null) {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((r) => {
      if (!r) return null;
      const hasNilaiList = Array.isArray(r.nilaiList);
      const normalizedRow = {
        ...r,
        id: r.id || crypto.randomUUID(),
        bobot: Number(r.bobot ?? 0),
        kategori: r.kategori || { model: "", prinsip: "", jenis: "", underlying: [] },
        nilaiList: hasNilaiList
          ? r.nilaiList.map((item) => (item ? normalizeItemWithDerived(item, r, quarter) : null)).filter(Boolean)
          : [],
        indicatorList: []
      };
      return normalizedRow;
    })
    .filter(Boolean);
}

// ==================== KOMPONEN FILTER KATEGORI ====================
function KategoriFilter({ filter, setFilter, onFilterChange }) {
  const [showUnderlyingDropdown, setShowUnderlyingDropdown] = useState(false);
  const underlyingDropdownRef = useRef(null);

  const handleFilterChange = (key, value) => {
    const newFilter = { ...filter, [key]: value };
    if (key === "model") {
      if (value === "tanpa_model") {
        onFilterChange({ ...newFilter, prinsip: "", jenis: "", underlying: [] });
        return;
      }
      onFilterChange({ ...newFilter, jenis: "", underlying: [] });
      return;
    }
    onFilterChange(newFilter);
  };

  const handleUnderlyingToggle = (value) => {
    const current = Array.isArray(filter.underlying) ? filter.underlying : [];
    const newUnderlying = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onFilterChange({ ...filter, underlying: newUnderlying });
  };

  const getUnderlyingDisplayText = () => {
    if (!filter.underlying || filter.underlying.length === 0) return "Semua Underlying";
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-blue-50 p-4 rounded-lg border border-blue-200">
      <h3 className="font-semibold text-2xl tracking-wide mb-3 text-blue-800">Filter Kategori</h3>
      <div className="grid grid-cols-7 gap-4">
        <div className="col-span-2">
          <label className="block text-base ml-2 font-semibold tracking-wide text-gray-700 mb-1">Model Produk</label>
          <select
            className="w-full border border-gray-950 rounded-md px-3 py-2 text-base bg-white"
            value={filter.model}
            onChange={(e) => handleFilterChange("model", e.target.value)}
          >
            {KATEGORI_OPTIONS.model.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {filter.model && filter.model !== "tanpa_model" && (
          <div className="col-span-2">
            <label className="block text-base ml-2 font-semibold tracking-wide text-gray-700 mb-1">Prinsip</label>
            <select
              className="w-full border border-gray-950 rounded-md px-3 py-2 text-base bg-white"
              value={filter.prinsip}
              onChange={(e) => handleFilterChange("prinsip", e.target.value)}
            >
              {KATEGORI_OPTIONS.prinsip.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}

        {filter.model === "open_end" && (
          <div className="col-span-2">
            <label className="block text-base ml-2 tracking-wide font-semibold text-gray-700 mb-1">Jenis Reksa Dana</label>
            <select
              className="w-full border border-gray-950 rounded-md px-3 py-2 text-base bg-white"
              value={filter.jenis}
              onChange={(e) => handleFilterChange("jenis", e.target.value)}
            >
              {KATEGORI_OPTIONS.jenis.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}

        {filter.model === "terstruktur" && (
          <div className="col-span-2 relative" ref={underlyingDropdownRef}>
            <label className="block text-base ml-2 font-semibold tracking-wide text-gray-700 mb-1">Aset Dasar</label>
            <div className="relative">
              <button
                type="button"
                className="w-full border border-gray-950 rounded-md px-3 py-1.5 text-base bg-white text-left flex justify-between items-center"
                onClick={() => setShowUnderlyingDropdown(!showUnderlyingDropdown)}
              >
                <span className="truncate">{getUnderlyingDisplayText()}</span>
                <span className="ml-2">▾</span>
              </button>
              {showUnderlyingDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                  <div className="p-2 border-b">
                    <button
                      type="button"
                      className="w-full text-left px-2 py-1 text-base font-semibold text-blue-800 hover:bg-blue-50 rounded"
                      onClick={() => { onFilterChange({ ...filter, underlying: [] }); setShowUnderlyingDropdown(false); }}
                    >
                      Select All
                    </button>
                  </div>
                  {KATEGORI_OPTIONS.underlying.filter(opt => opt.value !== "").map((opt) => {
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
                          onChange={(e) => { e.stopPropagation(); handleUnderlyingToggle(opt.value); }}
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
            onClick={() => onFilterChange({ model: "", prinsip: "", jenis: "", underlying: [] })}
          >
            <RefreshCcw className="h-4 w-4 mr-2"/>Reset Filter
          </button>
        </div>
      </div>

      {(filter.model || filter.prinsip || filter.jenis || (Array.isArray(filter.underlying) && filter.underlying.length > 0)) && (
        <div className="mt-3 text-base font-semibold text-gray-800">
          Filter aktif :<br/>
          {[
            filter.model && `Model: ${KATEGORI_OPTIONS.model.find(o => o.value === filter.model)?.label}`,
            filter.prinsip && filter.model !== "tanpa_model" && `Prinsip: ${KATEGORI_OPTIONS.prinsip.find(o => o.value === filter.prinsip)?.label}`,
            filter.jenis && `Jenis: ${KATEGORI_OPTIONS.jenis.find(o => o.value === filter.jenis)?.label}`,
            Array.isArray(filter.underlying) && filter.underlying.length > 0 && filter.model === "terstruktur" &&
              `Underlying: ${filter.underlying.map(v => KATEGORI_OPTIONS.underlying.find(o => o.value === v)?.label || v).join(", ")}`,
          ].filter(Boolean).join(", ")}
        </div>
      )}
    </div>
  );
}

// ==================== FUNGSI FORMAT NILAI ====================
const processInputValue = (value) => {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return String(value);
    return value;
  }
  const strValue = String(value).trim();
  if (/[eE]/.test(strValue) || strValue.toLowerCase().includes('infinity')) return strValue;
  return strValue;
};

const formatDisplayValue = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const strValue = String(value);
  if (strValue.toLowerCase().includes('infinity')) return "∞";
  if (/[eE]/.test(strValue)) {
    const match = strValue.match(/^([+-]?\d*\.?\d+)[eE]([+-]?\d+)$/);
    if (match) {
      const base = match[1];
      const exponent = parseInt(match[2], 10);
      if (exponent > 10) return `${base} × 10^${exponent}`;
    }
  }
  return strValue;
};

const getHasilForQuarter = (item, quarter) => {
  if (!item) return "-";
  const derived = item.derived || {};
  return derived.hasilDisplay !== undefined && derived.hasilDisplay !== null ?
    formatDisplayValue(derived.hasilDisplay) : "-";
};

// ==================== KOMPONEN TABEL SEDERHANA ====================
function SimpleTable({ rows, onUpdateRawValue, filterKategori, activeQuarter }) {
  const [zoom, setZoom] = useState(100);
  const minZoom = 100;
  const maxZoom = 125;
  const stepZoom = 5;

  const handleZoomIn = () => setZoom((z) => Math.min(maxZoom, z + stepZoom));
  const handleZoomOut = () => setZoom((z) => Math.max(minZoom, z - stepZoom));
  const handleSliderChange = (e) => setZoom(Number(e.target.value));

  const filteredRows = useMemo(() => {
    if (!filterKategori.model && !filterKategori.prinsip && !filterKategori.jenis &&
        (!Array.isArray(filterKategori.underlying) || filterKategori.underlying.length === 0)) {
      return rows;
    }
    return rows.filter((param) => {
      const kategori = param.kategori || {};
      let shouldInclude = true;
      if (filterKategori.model && filterKategori.model !== "" && kategori.model !== filterKategori.model) shouldInclude = false;
      if (filterKategori.prinsip && filterKategori.prinsip !== "" && kategori.model !== "tanpa_model") {
        if (kategori.prinsip !== filterKategori.prinsip) shouldInclude = false;
      }
      if (filterKategori.jenis && filterKategori.jenis !== "") {
        if (kategori.model === "open_end") {
          if (kategori.jenis !== filterKategori.jenis) shouldInclude = false;
        } else shouldInclude = false;
      }
      if (Array.isArray(filterKategori.underlying) && filterKategori.underlying.length > 0) {
        if (kategori.model === "terstruktur") {
          const paramUnderlying = Array.isArray(kategori.underlying) ? kategori.underlying : [];
          const hasOverlap = filterKategori.underlying.some(value => paramUnderlying.includes(value));
          if (!hasOverlap) shouldInclude = false;
        } else shouldInclude = false;
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

  const tableData = [];
  filteredRows.forEach((param) => {
    if (!param || !param.id) return;
    const itemList = Array.isArray(param.nilaiList) ? param.nilaiList : [];
    if (itemList.length === 0) {
      tableData.push({ type: "empty", param, _categoryId: param._categoryId, _categoryLabel: param._categoryLabel, rowSpan: 1 });
      return;
    }
    itemList.forEach((item, itemIndex) => {
      if (!item || !item.id) return;
      const itemType = item.judul?.type || "Tanpa Faktor";
      if (itemType === "Tanpa Faktor") {
        tableData.push({ type: "tanpa-faktor", kind: "full", param, item, _categoryId: param._categoryId, _categoryLabel: param._categoryLabel, itemType, rowSpan: 1, isFirstRow: true, itemIndex });
      } else if (itemType === "Satu Faktor") {
        tableData.push({ type: "satu-faktor", kind: "hasil", param, item, _categoryId: param._categoryId, _categoryLabel: param._categoryLabel, itemType, rowSpan: 1, isFirstRow: true, itemIndex });
        tableData.push({ type: "satu-faktor", kind: "input", param, item, _categoryId: param._categoryId, _categoryLabel: param._categoryLabel, itemType, rowSpan: 1, isFirstRow: false, itemIndex });
      } else if (itemType === "Dua Faktor") {
        tableData.push({ type: "dua-faktor", kind: "hasil", param, item, _categoryId: param._categoryId, _categoryLabel: param._categoryLabel, itemType, rowSpan: 1, isFirstRow: true, itemIndex });
        tableData.push({ type: "dua-faktor", kind: "pembilang", param, item, _categoryId: param._categoryId, _categoryLabel: param._categoryLabel, itemType, rowSpan: 1, isFirstRow: false, itemIndex });
        tableData.push({ type: "dua-faktor", kind: "penyebut", param, item, _categoryId: param._categoryId, _categoryLabel: param._categoryLabel, itemType, rowSpan: 1, isFirstRow: false, itemIndex });
      }
    });
  });

  if (tableData.length === 0) {
    return <div className="p-6 text-center text-gray-500 border rounded-xl">Tidak ada data untuk ditampilkan</div>;
  }

  const categoryRowSpan = {};
  const paramRowSpan = {};
  tableData.forEach((row) => {
    if (!row._categoryId || !row.param || !row.param.id) return;
    categoryRowSpan[row._categoryId] = (categoryRowSpan[row._categoryId] || 0) + 1;
    if (row.isFirstRow) {
      let itemRows = 1;
      if (row.itemType === "Satu Faktor") itemRows = 2;
      if (row.itemType === "Dua Faktor") itemRows = 3;
      paramRowSpan[row.param.id] = (paramRowSpan[row.param.id] || 0) + itemRows;
    }
  });

  const renderedCategory = {};
  const renderedParam = {};
  const quarterFromHeader = activeQuarter?.toUpperCase() || "Q1";

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2 pr-2">
        <div>
          <h1 className="text-2xl font-semibold">Rekap Data - Hasil Perhitungan</h1>
          <div className="text-sm text-gray-600">
            Quarter Aktif: <span className="font-bold bg-blue-100 px-2 py-1 rounded">{quarterFromHeader}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleZoomOut} className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-900 text-white text-xl font-bold shadow hover:bg-blue-800">−</button>
            <div className="flex flex-col items-center">
              <span className="text-xs font-medium mb-1">{zoom}%</span>
              <input type="range" min={minZoom} max={maxZoom} step={stepZoom} value={zoom} onChange={handleSliderChange} className="w-40 accent-slate-700" />
            </div>
            <button type="button" onClick={handleZoomIn} className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-900 text-white text-xl font-bold shadow hover:bg-blue-800">+</button>
          </div>
        </div>
      </div>

      <div className="w-full overflow-auto border shadow">
        <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left", display: "block", width: "100%" }}>
          <table className="table-fixed text-sm w-full border-collapse">
            <colgroup>
              <col style={{ width: "10%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "30%" }} />
              <col style={{ width: "40%" }} />
            </colgroup>
            <thead>
              <tr>
                <th className="border border-black px-2 py-2 bg-blue-900 text-white text-center">Jenis Risiko</th>
                <th className="border border-black px-2 py-2 bg-blue-900 text-white text-center">Parameter</th>
                <th className="border border-black px-2 py-2 bg-blue-900 text-white text-center">Nilai atau Indikator</th>
                <th className="border border-black px-2 py-2 bg-blue-900 text-white text-center">Hasil {quarterFromHeader}</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, idx) => {
                const { param, item, kind, _categoryId, _categoryLabel, itemType, isFirstRow } = row;
                if (!param || !item) return null;
                const showCategory = !renderedCategory[_categoryId];
                const showParam = isFirstRow && !renderedParam[param.id];
                if (showCategory) renderedCategory[_categoryId] = true;
                if (showParam) renderedParam[param.id] = true;

                let itemText = "-";
                if (itemType === "Tanpa Faktor") itemText = item?.judul?.text ?? "-";
                else if (itemType === "Satu Faktor") {
                  if (kind === "hasil") itemText = item?.judul?.text ?? "-";
                  else if (kind === "input") itemText = item?.judul?.pembilang ?? "-";
                } else if (itemType === "Dua Faktor") {
                  if (kind === "hasil") itemText = item?.judul?.text ?? "-";
                  else if (kind === "pembilang") itemText = item?.judul?.pembilang ?? "-";
                  else if (kind === "penyebut") itemText = item?.judul?.penyebut ?? "-";
                }

                let inputValue = "";
                let fieldName = "";
                if (itemType === "Tanpa Faktor") {
                  const currentValue = item.judul?.value ?? item.judul?.valuePembilang;
                  inputValue = currentValue !== null && currentValue !== undefined ? String(currentValue) : "";
                  fieldName = "value";
                } else if (itemType === "Satu Faktor" && kind === "input") {
                  const currentValue = item.judul?.valuePembilang;
                  inputValue = currentValue !== null && currentValue !== undefined ? String(currentValue) : "";
                  fieldName = "valuePembilang";
                } else if (itemType === "Dua Faktor") {
                  if (kind === "pembilang") {
                    const currentValue = item.judul?.valuePembilang;
                    inputValue = currentValue !== null && currentValue !== undefined ? String(currentValue) : "";
                    fieldName = "valuePembilang";
                  } else if (kind === "penyebut") {
                    const currentValue = item.judul?.valuePenyebut;
                    inputValue = currentValue !== null && currentValue !== undefined ? String(currentValue) : "";
                    fieldName = "valuePenyebut";
                  }
                }

                const nilaiBgClass = isFirstRow ? 'bg-[#E8F5FA]' : 'bg-white';
                const nilaiTextClass = isFirstRow ? "text-base font-semibold" : "text-base";
                const isInputRow = kind === "input" || kind === "pembilang" || kind === "penyebut" || (itemType === "Tanpa Faktor" && kind === "full");
                const hasilText = getHasilForQuarter(item, quarterFromHeader);

                return (
                  <tr key={`${idx}-${param.id}-${item.id}-${kind}`}>
                    {showCategory && (
                      <td
                        rowSpan={categoryRowSpan[_categoryId]}
                        className="align-middle text-center p-2 bg-[#E8F5FA] font-semibold border-3 border-black tracking-widest lg:tracking-widest"
                        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
                      >
                        <div className="flex items-center text-lg justify-center h-full">{_categoryLabel}</div>
                      </td>
                    )}
                    {showParam && (
                      <td
                        rowSpan={paramRowSpan[param.id]}
                        className="border border-black px-2 align-middle text-lg bg-[#E8F5FA] font-semibold"
                        style={{ verticalAlign: 'middle' }}
                      >
                        {param.judul || "-"}
                      </td>
                    )}
                    <td className={`border border-black px-2 py-3 ${nilaiBgClass}`}>
                      <div className={nilaiTextClass}>{itemText}</div>
                    </td>
                    <td className={`border border-black px-2 py-2 ${isInputRow ? 'bg-white' : 'bg-[#E8F5FA]'}`}>
                      {isInputRow ? (
                        <div className="flex flex-col">
                          <div className="flex-1 p-1">
                            <Input
                              value={inputValue}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === "") {
                                  onUpdateRawValue({ categoryId: _categoryId, paramId: param.id, itemId: item.id, field: fieldName, value: null, quarter: activeQuarter });
                                  return;
                                }
                                const processedValue = processInputValue(value);
                                onUpdateRawValue({ categoryId: _categoryId, paramId: param.id, itemId: item.id, field: fieldName, value: processedValue, quarter: activeQuarter });
                              }}
                              onBlur={(e) => {
                                if (e.target.value === "") {
                                  onUpdateRawValue({ categoryId: _categoryId, paramId: param.id, itemId: item.id, field: fieldName, value: null, quarter: activeQuarter });
                                }
                              }}
                              placeholder="Masukkan nilai"
                              className="text-center text-base w-full"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className={`flex items-center justify-center text-base font-semibold text-center break-words ${isInputRow ? '' : 'h-full'}`}>
                          {hasilText}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==================== KOMPONEN MODAL IMPORT REKAP ====================
function ImportModalRekap({
  isOpen,
  onClose,
  onImportSuccess,
  year,
  quarter,
  selectedCategories,
  dataMap,
  categoryList
}) {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setPreviewData(null);
      setShowConfirmModal(false);
      setShowPreviewModal(false);
      setError(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const findCategoryIdByLabel = useCallback((label) => {
    if (!label) return null;
    const category = categoryList.find(c =>
      c.label.toLowerCase().trim() === label.toLowerCase().trim()
    );
    return category?.id || null;
  }, [categoryList]);

  // PREVIEW: Baca file Excel dan proses secara SEQUENTIAL
  const handlePreview = async () => {
    if (!file) {
      setError('Silakan pilih file terlebih dahulu');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);

      // Tentukan sheet sesuai quarter aktif
      const quarterMap = {
        q1: `Maret - ${year}`,
        q2: `Juni - ${year}`,
        q3: `September - ${year}`,
        q4: `Desember - ${year}`,
      };
      const targetSheetName = quarterMap[quarter?.toLowerCase()] || `${quarter} - ${year}`;
      let worksheet = workbook.worksheets.find(ws => ws.name.includes(targetSheetName));
      if (!worksheet) worksheet = workbook.worksheets[0];
      if (!worksheet) throw new Error('Tidak ada worksheet');

      // Cari baris header (kolom D = "Jenis Risiko")
      let headerRow = null;
      for (let i = 1; i <= 10; i++) {
        const row = worksheet.getRow(i);
        if (row.getCell(4).value?.toString().includes('Jenis Risiko')) {
          headerRow = i;
          break;
        }
      }
      if (!headerRow) throw new Error('Header "Jenis Risiko" tidak ditemukan');

      const updates = [];
      const errors = [];
      let totalRows = 0;
      let matchedRows = 0;

      // Kelompokkan baris per kategori dan parameter (urutan sesuai Excel)
      const rowsByCategoryAndParam = {};

      for (let r = headerRow + 1; r <= worksheet.rowCount; r++) {
        const row = worksheet.getRow(r);
        const jenisRisiko = row.getCell(4).value?.toString()?.trim();
        const parameter = row.getCell(5).value?.toString()?.trim();
        const nilaiIndikator = row.getCell(6).value?.toString()?.trim(); // tidak dipakai dalam sequential
        let hasil = row.getCell(7).value;

        if (!jenisRisiko && !parameter && !nilaiIndikator) continue;
        totalRows++;

        // Ambil nilai hasil (handle formula)
        if (hasil && typeof hasil === 'object' && hasil.result) {
          hasil = hasil.result;
        }
        const hasilStr = hasil !== null && hasil !== undefined ? String(hasil) : '';

        const categoryId = findCategoryIdByLabel(jenisRisiko);
        if (!categoryId || !selectedCategories.includes(categoryId)) {
          errors.push(`Baris ${r}: Kategori "${jenisRisiko}" tidak dipilih atau tidak valid`);
          continue;
        }

        const key = `${categoryId}||${parameter}`;
        if (!rowsByCategoryAndParam[key]) {
          rowsByCategoryAndParam[key] = [];
        }
        rowsByCategoryAndParam[key].push({
          rowNumber: r,
          hasilStr,
          nilaiIndikator,
        });
      }

      // Proses setiap grup (kategori + parameter) secara SEQUENTIAL
      Object.entries(rowsByCategoryAndParam).forEach(([key, excelRows]) => {
        const [categoryId, paramName] = key.split('||');
        const categoryRows = dataMap[categoryId] || [];
        const param = categoryRows.find(p =>
          p.judul?.toString().trim().toLowerCase() === paramName?.toLowerCase()
        );
        if (!param) {
          excelRows.forEach(row => {
            errors.push(`Baris ${row.rowNumber}: Parameter "${paramName}" tidak ditemukan di kategori "${categoryId}"`);
          });
          return;
        }

        const itemList = param.nilaiList || [];
        let expectedTotalRows = 0;
        itemList.forEach(item => {
          const type = item.judul?.type || 'Tanpa Faktor';
          if (type === 'Tanpa Faktor') expectedTotalRows += 1;
          else if (type === 'Satu Faktor') expectedTotalRows += 2;
          else if (type === 'Dua Faktor') expectedTotalRows += 3;
        });

        // Cek kesesuaian jumlah baris
        if (excelRows.length !== expectedTotalRows) {
          errors.push(`Parameter "${paramName}": jumlah baris di Excel (${excelRows.length}) tidak sesuai dengan sistem (${expectedTotalRows})`);
          return;
        }

        let rowIndex = 0;
        itemList.forEach(item => {
          const type = item.judul?.type || 'Tanpa Faktor';
          const itemId = item.id;

          if (type === 'Tanpa Faktor') {
            // 1 baris: update value
            const excelRow = excelRows[rowIndex];
            updates.push({
              categoryId,
              paramId: param.id,
              itemId,
              field: 'value',
              newValue: excelRow.hasilStr,
            });
            matchedRows++;
            rowIndex += 1;
          }
          else if (type === 'Satu Faktor') {
            // Baris 1: judul nilai (tidak diupdate)
            // Baris 2: pembilang -> update valuePembilang
            const pembilangRow = excelRows[rowIndex + 1];
            updates.push({
              categoryId,
              paramId: param.id,
              itemId,
              field: 'valuePembilang',
              newValue: pembilangRow.hasilStr,
            });
            matchedRows++;
            rowIndex += 2;
          }
          else if (type === 'Dua Faktor') {
            // Baris 1: judul nilai (tidak diupdate)
            // Baris 2: pembilang -> update valuePembilang
            // Baris 3: penyebut  -> update valuePenyebut
            const pembilangRow = excelRows[rowIndex + 1];
            updates.push({
              categoryId,
              paramId: param.id,
              itemId,
              field: 'valuePembilang',
              newValue: pembilangRow.hasilStr,
            });
            matchedRows++;

            const penyebutRow = excelRows[rowIndex + 2];
            updates.push({
              categoryId,
              paramId: param.id,
              itemId,
              field: 'valuePenyebut',
              newValue: penyebutRow.hasilStr,
            });
            matchedRows++;

            rowIndex += 3;
          }
        });
      });

      const result = {
        success: true,
        updates,
        stats: { totalRows, matchedRows, errors: errors.length },
        errors,
      };
      setPreviewData(result);
      setShowPreviewModal(true);
    } catch (err) {
      setError(`Gagal membaca file: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = () => {
    if (!previewData) {
      setError('Silakan preview file terlebih dahulu');
      return;
    }
    setShowPreviewModal(false);
    setShowConfirmModal(true);
  };

  const confirmImport = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);

    try {
      if (onImportSuccess && previewData) {
        await onImportSuccess(previewData.updates);
      }
      setNotificationMessage('Data berhasil diimpor!');
      setShowSuccessNotification(true);
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

  // RENDER UI MODAL (SAMA PERSIS, TIDAK BERUBAH)
  return (
    <>
      {/* MODAL UTAMA */}
      <div className="fixed inset-0 bg-white/5 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Import Data Rekap</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Tahun: {year} | Quarter: {quarter?.toUpperCase()}
              </p>
            </div>

            {/* DROPZONE / FILE INPUT */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {file ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-800 truncate max-w-xs">{file.name}</p>
                      <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <button onClick={handleRemoveFile} className="text-red-500 hover:text-red-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-600 mb-2">Drag & drop file Excel atau</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                    id="rekap-file-input"
                  />
                  <label htmlFor="rekap-file-input" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
                    Pilih File
                  </label>
                  <p className="text-xs text-gray-500 mt-3">Hanya file Excel (.xlsx) hasil export Rekap Data</p>
                </>
              )}
            </div>

            {/* PESAN ERROR */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
            )}

            {/* PREVIEW SUKSES */}
            {previewData && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                <p className="font-medium">File siap diimpor!</p>
                <p className="text-sm mt-1">
                  Baris diproses: {previewData.stats.totalRows} |
                  Akan diupdate: {previewData.stats.matchedRows} |
                  Error: {previewData.stats.errors}
                </p>
                {previewData.errors.length > 0 && (
                  <details className="mt-2 text-xs">
                    <summary className="cursor-pointer text-red-600">Lihat {previewData.errors.length} error</summary>
                    <div className="mt-1 max-h-32 overflow-y-auto bg-red-100 p-2 rounded">
                      {previewData.errors.slice(0, 5).map((err, i) => (
                        <div key={i} className="py-1 border-b border-red-200 last:border-0">{err}</div>
                      ))}
                      {previewData.errors.length > 5 && <div className="py-1">...dan {previewData.errors.length - 5} lainnya</div>}
                    </div>
                  </details>
                )}
              </div>
            )}

            {/* TOMBOL AKSI */}
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
                  onClick={handleImport}
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
            </div>
          </div>
        </div>
      </div>

      {/* MODAL PREVIEW */}
      {showPreviewModal && previewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Preview Import</h3>
            <div className="mb-6 space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-700">Ringkasan:</p>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between"><span className="text-gray-600">Total baris diproses:</span><span className="font-medium">{previewData.stats.totalRows}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Akan diupdate:</span><span className="font-medium text-green-600">{previewData.stats.matchedRows}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Error:</span><span className="font-medium text-red-600">{previewData.stats.errors}</span></div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Data akan diimpor ke <strong>{quarter?.toUpperCase()} {year}</strong> untuk {selectedCategories.length} kategori terpilih.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowPreviewModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Kembali</button>
              <button onClick={handleImport} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Lanjutkan Import</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI */}
      {showConfirmModal && previewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Konfirmasi Import</h3>
              <p className="text-gray-600">Apakah Anda yakin ingin mengimpor {previewData.stats.matchedRows} perubahan?</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 font-medium">Perhatian:</p>
              <ul className="text-sm text-red-600 mt-1 space-y-1">
                <li>• Data yang ada akan ditimpa</li>
                <li>• Tindakan ini tidak dapat dibatalkan</li>
                <li>• Perubahan akan langsung disimpan</li>
              </ul>
            </div>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowConfirmModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Batal</button>
              <button onClick={confirmImport} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Ya, Import Data</button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFIKASI SUKSES */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 z-[70] animate-fade-in">
          <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium">{notificationMessage}</p>
              <p className="text-sm">Data telah berhasil diupdate.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ==================== KOMPONEN UTAMA REKAP DATA ====================
export default function RekapData() {
  const { year, activeQuarter, search } = useHeaderStore();

  // State untuk notification
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });

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
  const [showImportModal, setShowImportModal] = useState(false);

  const pageSize = 7;
  const paginationRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fungsi untuk menampilkan notifikasi
  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3000);
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, show: false }));
  }, []);

  // Handler untuk tombol import
  const handleImport = () => {
    if (selectedPages.length === 0) {
      showNotification('Pilih kategori terlebih dahulu sebelum import', 'warning');
      return;
    }
    setShowImportModal(true);
  };

  // Handler setelah import sukses
  const handleImportSuccess = async (updates) => {
    if (!updates || updates.length === 0) {
      showNotification('Tidak ada data yang diupdate', 'info');
      return;
    }

    setDataMap(prev => {
      const next = structuredClone(prev);
      updates.forEach(update => {
        const { categoryId, paramId, itemId, field, newValue } = update;
        const rows = next[categoryId];
        if (!rows) return;
        const param = rows.find(p => p.id === paramId);
        if (!param) return;
        const item = param.nilaiList?.find(i => i.id === itemId);
        if (!item) return;
        if (field === 'value') {
          item.judul.value = newValue;
          item.judul.valuePembilang = newValue;
        } else if (field === 'valuePembilang') {
          item.judul.valuePembilang = newValue;
        } else if (field === 'valuePenyebut') {
          item.judul.valuePenyebut = newValue;
        }
        item.derived = computeDerived(item, param);
      });

      // Simpan ke localStorage SETELAH state diperbarui
      Object.keys(next).forEach(catId => {
        if (selectedPages.includes(catId)) {
          try {
            saveInherent({
              categoryId: catId,
              year,
              quarter: activeQuarter,
              rows: next[catId],
            });
          } catch (e) {
            console.error(`Error saving ${catId}:`, e);
          }
        }
      });

      notifyRiskUpdated();
      setHasUnsavedChanges(false);
      showNotification(`Berhasil mengupdate ${updates.length} nilai`, 'success');

      return next;
    });
  };

  const selectAllPages = () => {
    if (hasUnsavedChanges) {
      setPendingAction(() => () => { setSelectedPages(CATEGORIES.map(category => category.id)); setHasUnsavedChanges(false); });
      setShowUnsaveModal(true);
    } else setSelectedPages(CATEGORIES.map(category => category.id));
  };

  const deselectAllPages = () => {
    if (hasUnsavedChanges) {
      setPendingAction(() => { setSelectedPages([]); setHasUnsavedChanges(false); });
      setShowUnsaveModal(true);
    } else setSelectedPages([]);
  };

  const toggleAllPages = () => {
    if (selectedPages.length === CATEGORIES.length) deselectAllPages();
    else selectAllPages();
  };

  const togglePage = (id) => {
    if (hasUnsavedChanges) {
      setPendingAction(() => () => {
        setSelectedPages((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
        setHasUnsavedChanges(false);
      });
      setShowUnsaveModal(true);
    } else {
      setSelectedPages((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
    }
  };

  useEffect(() => {
    const next = {};
    selectedPages.forEach((catId) => {
      try {
        const rows = loadInherent({ categoryId: catId, year, quarter: activeQuarter });
        next[catId] = normalizeInherentRowsWithDerived(rows);
      } catch (e) {
        console.error("Rekap load error:", e);
        next[catId] = [];
      }
    });
    setDataMap(next);
    setHasUnsavedChanges(false);
  }, [selectedPages, year, activeQuarter]);

  const handleUpdateRawValue = ({ categoryId, paramId, itemId, field, value, quarter = null }) => {
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
        saveInherent({ categoryId: catId, year, quarter: activeQuarter, rows: dataMap[catId] });
      } catch (e) { console.error("Error saving data for category", catId, e); }
    });
    notifyRiskUpdated();
    setHasUnsavedChanges(false);
    showNotification("Data berhasil disimpan!", "success");
  };

  const handleFilterChange = (newFilter) => {
    if (hasUnsavedChanges) {
      setPendingAction(() => () => { setKategoriFilter(newFilter); setHasUnsavedChanges(false); });
      setShowUnsaveModal(true);
    } else setKategoriFilter(newFilter);
  };

  useEffect(() => {
    const handleRealTimeSync = () => {
      const next = {};
      selectedPages.forEach((catId) => {
        try {
          const rows = loadInherent({ categoryId: catId, year, quarter: activeQuarter });
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
    return () => window.removeEventListener("risk-data-updated", handleRealTimeSync);
  }, [selectedPages, year, activeQuarter]);

  const flattenedRows = useMemo(() => {
    const res = [];
    CATEGORIES.forEach((cat) => {
      if (!selectedPages.includes(cat.id)) return;
      (dataMap[cat.id] || []).forEach((param) => {
        if (search) {
          const s = search.toLowerCase();
          const hit = (param.judul || "").toLowerCase().includes(s) || String(param.nomor || "").includes(s);
          if (!hit) return;
        }
        const kategori = param.kategori || {};
        let shouldInclude = true;
        if (kategoriFilter.model && kategoriFilter.model !== "" && kategori.model !== kategoriFilter.model) shouldInclude = false;
        if (kategoriFilter.prinsip && kategoriFilter.prinsip !== "" && kategori.model !== "tanpa_model") {
          if (kategori.prinsip !== kategoriFilter.prinsip) shouldInclude = false;
        }
        if (kategoriFilter.jenis && kategoriFilter.jenis !== "") {
          if (kategori.model === "open_end") {
            if (kategori.jenis !== kategoriFilter.jenis) shouldInclude = false;
          } else shouldInclude = false;
        }
        if (Array.isArray(kategoriFilter.underlying) && kategoriFilter.underlying.length > 0) {
          if (kategori.model === "terstruktur") {
            const paramUnderlying = Array.isArray(kategori.underlying) ? kategori.underlying : [];
            const hasOverlap = kategoriFilter.underlying.some(value => paramUnderlying.includes(value));
            if (!hasOverlap) shouldInclude = false;
          } else shouldInclude = false;
        }
        if (!shouldInclude) return;
        if (Array.isArray(param.nilaiList) && param.nilaiList.length > 0) {
          res.push({ ...param, _categoryId: cat.id, _categoryLabel: cat.label });
        }
      });
    });
    return res;
  }, [selectedPages, dataMap, search, kategoriFilter]);

  const totalPages = Math.max(1, Math.ceil(flattenedRows.length / pageSize));
  const pagedRows = flattenedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const globalSummary = calculateGlobalSummary(dataMap, selectedPages, kategoriFilter);

  const scrollPaginationLeft = () => paginationRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  const scrollPaginationRight = () => paginationRef.current?.scrollBy({ left: 200, behavior: "smooth" });

  const handlePageClick = (page) => {
    if (hasUnsavedChanges) {
      setPendingAction(() => () => { setCurrentPage(page); setHasUnsavedChanges(false); });
      setShowUnsaveModal(true);
    } else setCurrentPage(page);
  };

  const handleModalSave = () => {
    handleSaveAllChanges();
    if (pendingAction) { pendingAction(); setPendingAction(null); }
    setShowUnsaveModal(false);
  };

  const handleModalDontSave = () => {
    if (pendingAction) { pendingAction(); setPendingAction(null); }
    setShowUnsaveModal(false);
    setHasUnsavedChanges(false);
  };

  const handleModalClose = () => {
    setShowUnsaveModal(false);
    setPendingAction(null);
  };

const handleExportToExcel = async () => {
  try {
    if (!selectedPages.length) {
      showNotification("Pilih kategori terlebih dahulu", "warning");
      return;
    }

    // Kuartal dan nama bulan
    const quarters = ['q1', 'q2', 'q3', 'q4'];
    const monthNames = {
      q1: 'Maret',
      q2: 'Juni',
      q3: 'September',
      q4: 'Desember'
    };

    // Load data untuk semua kuartal
    const dataByQuarter = {};
    for (const q of quarters) {
      const dataMap = {};
      for (const catId of selectedPages) {
        try {
          const rows = loadInherent({ categoryId: catId, year, quarter: q });
          dataMap[catId] = normalizeInherentRowsWithDerived(rows);
        } catch (e) {
          console.error(`Error loading ${catId} for ${q}:`, e);
          dataMap[catId] = [];
        }
      }
      dataByQuarter[q] = dataMap;
    }

    // Gunakan data Q1 sebagai kerangka
    const baseDataMap = dataByQuarter.q1;

    // Buat flattenedRows dari baseDataMap dengan filter yang sama
    const baseFlattened = [];
    CATEGORIES.forEach(cat => {
      if (!selectedPages.includes(cat.id)) return;
      (baseDataMap[cat.id] || []).forEach(param => {
        if (search) {
          const s = search.toLowerCase();
          const hit = (param.judul || "").toLowerCase().includes(s) || String(param.nomor || "").includes(s);
          if (!hit) return;
        }
        // Filter kategori
        const kategori = param.kategori || {};
        let shouldInclude = true;
        if (kategoriFilter.model && kategoriFilter.model !== "" && kategori.model !== kategoriFilter.model) shouldInclude = false;
        if (kategoriFilter.prinsip && kategoriFilter.prinsip !== "" && kategori.model !== "tanpa_model") {
          if (kategori.prinsip !== kategoriFilter.prinsip) shouldInclude = false;
        }
        if (kategoriFilter.jenis && kategoriFilter.jenis !== "") {
          if (kategori.model === "open_end") {
            if (kategori.jenis !== kategoriFilter.jenis) shouldInclude = false;
          } else shouldInclude = false;
        }
        if (Array.isArray(kategoriFilter.underlying) && kategoriFilter.underlying.length > 0) {
          if (kategori.model === "terstruktur") {
            const paramUnderlying = Array.isArray(kategori.underlying) ? kategori.underlying : [];
            const hasOverlap = kategoriFilter.underlying.some(value => paramUnderlying.includes(value));
            if (!hasOverlap) shouldInclude = false;
          } else shouldInclude = false;
        }
        if (!shouldInclude) return;
        if (Array.isArray(param.nilaiList) && param.nilaiList.length > 0) {
          baseFlattened.push({ ...param, _categoryId: cat.id, _categoryLabel: cat.label });
        }
      });
    });

    if (baseFlattened.length === 0) {
      showNotification("Tidak ada data untuk diekspor", "warning");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Rekap Data ${year}`);

    // Warna background
    const judulColor = "DAEEF3";
    const putihColor = "FFFFFF";

    // Baris judul (A1:G1)
    worksheet.addRow([`Rekap Data - ${year}`]);
    // Baris info (A2:G2)
    const tanggalExport = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/');
    worksheet.addRow([`Tahun: ${year} | Tanggal Export: ${tanggalExport}`]);
    worksheet.addRow([]); // baris kosong (A3:G3)

    // Header tabel (baris 4)
    const headerRow = worksheet.addRow([
      "Jenis Risiko",
      "Parameter",
      "Nilai atau Indikator",
      `Hasil ${monthNames.q1} - ${year}`,
      `Hasil ${monthNames.q2} - ${year}`,
      `Hasil ${monthNames.q3} - ${year}`,
      `Hasil ${monthNames.q4} - ${year}`
    ]);

    // Styling header (baris 4) - background biru hanya di A4:G4
    headerRow.font = { bold: true, color: { argb: "FFFFFF" }, name: 'Calibri', size: 11 };
headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
  if (colNumber >= 1 && colNumber <= 7) {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "1E3A8A" }
    };
  }
});
    headerRow.alignment = { horizontal: "center", vertical: "middle" };

    // Lebar kolom
    worksheet.columns = [
      { width: 25 },
      { width: 35 },
      { width: 40 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 }
    ];

    // Rentang baris untuk merge
    const categoryRanges = {};
    const paramRanges = {};

    let currentRow = 4; // header di baris 4, data mulai baris 5

    baseFlattened.forEach(param => {
      const categoryId = param._categoryId;
      const categoryLabel = param._categoryLabel;
      const paramId = param.id;
      const paramJudul = param.judul || "-";
      const itemList = param.nilaiList || [];

      if (!categoryRanges[categoryId]) {
        categoryRanges[categoryId] = { startRow: currentRow + 1, endRow: currentRow + 1 };
      }
      if (!paramRanges[paramId]) {
        paramRanges[paramId] = { startRow: currentRow + 1, endRow: currentRow + 1 };
      }

      itemList.forEach(item => {
        if (!item) return;
        const type = item.judul?.type || "Tanpa Faktor";

        const getQuarterly = (field) => {
          const res = {};
          quarters.forEach(q => {
            const dataMap = dataByQuarter[q];
            const catRows = dataMap[categoryId] || [];
            const paramObj = catRows.find(p => p.id === paramId);
            if (paramObj) {
              const itemObj = paramObj.nilaiList?.find(i => i.id === item.id);
              if (itemObj) {
                if (field === 'hasil') {
                  res[q] = getHasilForQuarter(itemObj, q);
                } else if (field === 'pembilang') {
                  res[q] = itemObj.judul?.valuePembilang != null ? String(itemObj.judul.valuePembilang) : "";
                } else if (field === 'penyebut') {
                  res[q] = itemObj.judul?.valuePenyebut != null ? String(itemObj.judul.valuePenyebut) : "";
                }
              } else {
                res[q] = "";
              }
            } else {
              res[q] = "";
            }
          });
          return res;
        };

        if (type === "Tanpa Faktor") {
          const hasil = getQuarterly('hasil');
          const row = worksheet.addRow([
            "", "", item.judul?.text || "",
            hasil.q1, hasil.q2, hasil.q3, hasil.q4
          ]);
          // Set background judul untuk semua sel di baris ini
          row.eachCell({ includeEmpty: true }, cell => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: judulColor }
            };
            cell.font = {
              bold : true,
            };
          });
          currentRow++;
        } else if (type === "Satu Faktor") {
          // Baris judul
          const hasilJudul = getQuarterly('hasil');
          const rowJudul = worksheet.addRow([
            "", "", item.judul?.text || "",
            hasilJudul.q1, hasilJudul.q2, hasilJudul.q3, hasilJudul.q4
          ]);
          rowJudul.eachCell({ includeEmpty: true }, cell => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: judulColor }
            };
            cell.font = {
              bold : true,
            };
          });
          currentRow++;

          // Baris pembilang
          const hasilPembilang = getQuarterly('pembilang');
          const rowPembilang = worksheet.addRow([
            "", "", item.judul?.pembilang || "Pembilang",
            hasilPembilang.q1, hasilPembilang.q2, hasilPembilang.q3, hasilPembilang.q4
          ]);
          rowPembilang.eachCell({ includeEmpty: true }, cell => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: putihColor }
            };
          });
          currentRow++;
        } else if (type === "Dua Faktor") {
          // Baris judul
          const hasilJudul = getQuarterly('hasil');
          const rowJudul = worksheet.addRow([
            "", "", item.judul?.text || "",
            hasilJudul.q1, hasilJudul.q2, hasilJudul.q3, hasilJudul.q4
          ]);
          rowJudul.eachCell({ includeEmpty: true }, cell => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: judulColor }
            };
             cell.font = {
              bold : true,
            };
          });
          currentRow++;

          // Baris pembilang
          const hasilPembilang = getQuarterly('pembilang');
          const rowPembilang = worksheet.addRow([
            "", "", item.judul?.pembilang || "Pembilang",
            hasilPembilang.q1, hasilPembilang.q2, hasilPembilang.q3, hasilPembilang.q4
          ]);
          rowPembilang.eachCell({ includeEmpty: true }, cell => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: putihColor }
            };
          });
          currentRow++;

          // Baris penyebut
          const hasilPenyebut = getQuarterly('penyebut');
          const rowPenyebut = worksheet.addRow([
            "", "", item.judul?.penyebut || "Penyebut",
            hasilPenyebut.q1, hasilPenyebut.q2, hasilPenyebut.q3, hasilPenyebut.q4
          ]);
          rowPenyebut.eachCell({ includeEmpty: true }, cell => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: putihColor }
            };
          });
          currentRow++;
        }
      });

      categoryRanges[categoryId].endRow = currentRow;
      paramRanges[paramId].endRow = currentRow;
    });

    // Merge untuk kolom Jenis Risiko (A) dan set fill judul
Object.entries(categoryRanges).forEach(([catId, range]) => {
    const startRow = range.startRow;
    const endRow = range.endRow;

    if (startRow < endRow) {
        worksheet.mergeCells(`A${startRow}:A${endRow}`);
    }

    const cell = worksheet.getCell(`A${startRow}`);
    const category = baseFlattened.find(p => p._categoryId === catId);
    cell.value = category?._categoryLabel || '';

    // Set alignment tanpa wrapText
    cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        textRotation: 90
    };
    cell.font = { bold: true };
    cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: judulColor }
    };

    // Atur lebar kolom dan tinggi baris
    worksheet.getColumn('A').width = 20;
    worksheet.getRow(startRow).height = 80;
});

    // Merge untuk kolom Parameter (B) dan set fill judul
    Object.entries(paramRanges).forEach(([paramId, range]) => {
      if (range.startRow < range.endRow) {
        worksheet.mergeCells(`B${range.startRow}:B${range.endRow}`);
      }
      const cell = worksheet.getCell(`B${range.startRow}`);
      const param = baseFlattened.find(p => p.id === paramId);
      cell.value = param?.judul || "-";
      cell.alignment = { vertical: 'middle', horizontal: 'left' };
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: judulColor }
      };
    });

    // Merge judul (A1:G1 dan A2:G2)
    worksheet.mergeCells('A1:G1');
    worksheet.mergeCells('A2:G2');

    // Styling judul
    [1].forEach(rowNum => {
      const row = worksheet.getRow(rowNum);
      row.font = { bold: true, name: 'Calibri', size: 14 };
      row.alignment = { horizontal: 'left' };
    });

    [2].forEach(rowNum => {
      const row = worksheet.getRow(rowNum);
      row.font = { name: 'Calibri', size: 14 };
      row.alignment = { horizontal: 'left' };
    });

    // Border dan alignment untuk seluruh area data (baris 5 sampai terakhir)
    for (let r = 5; r <= currentRow; r++) {
      const row = worksheet.getRow(r);
      for (let c = 1; c <= 7; c++) {
        const cell = row.getCell(c);
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.alignment = {
          vertical: 'middle',
          wrapText: true,
          horizontal: c >= 4 ? 'center' : 'left' // kolom D, E, F, G (indeks 4-7) rata tengah
        };
      }
    }

    // Generate file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Rekap_Data_${year}_Semua_Quarter.xlsx`;
    link.click();
    URL.revokeObjectURL(link.href);

    showNotification("Data berhasil diekspor", "success");
  } catch (error) {
    console.error("Export error:", error);
    showNotification("Gagal mengekspor data", "error");
  }
};

  return (
    <div className="space-y-4">
      <Header
        title="Rekap Data"
        onExportClick={handleExportToExcel}
        onImportClick={handleImport}
      />

      <Notification
        isVisible={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
      />

      {/* Modal Import */}
      {showImportModal && (
        <ImportModalRekap
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImportSuccess={handleImportSuccess}
          year={year}
          quarter={activeQuarter}
          selectedCategories={selectedPages}
          dataMap={dataMap}
          categoryList={CATEGORIES}
        />
      )}

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

        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
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
              className={`flex items-center gap-2 ${hasUnsavedChanges ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"} text-white`}
              disabled={!hasUnsavedChanges}
            >
              <Save className="w-4 h-4" />
              Simpan Perubahan
            </Button>
          </div>
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
            activeQuarter={activeQuarter}
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