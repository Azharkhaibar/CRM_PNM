import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { RefreshCcw } from "lucide-react";

// Pindahkan konstanta ke luar komponen untuk menghindari redefinisi
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
    { value: "etf", label: "ETF" },
  ],
  underlying: [
    { value: "", label: "Semua Underlying" },
    { value: "obligasi", label: "Obligasi" },
    { value: "indeks", label: "Indeks" },
    { value: "etf", label: "ETF" },
    { value: "eba", label: "EBA" },
    { value: "dinfra", label: "DINFRA" },
  ],
};

export default function FilterKategori({ filter, setFilter }) {
  const [showUnderlyingDropdown, setShowUnderlyingDropdown] = useState(false);
  const underlyingDropdownRef = useRef(null);

  // Gunakan useCallback untuk mencegah re-creating function setiap render
  const handleFilterChange = useCallback((key, value) => {
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
  }, [setFilter]);

  // Handle multi-select untuk underlying dengan useCallback
  const handleUnderlyingToggle = useCallback((value) => {
    setFilter(prev => {
      const current = Array.isArray(prev.underlying) ? prev.underlying : [];
      const newUnderlying = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      
      return { ...prev, underlying: newUnderlying };
    });
  }, [setFilter]);

  // Untuk display text - gunakan useMemo untuk menghindari perhitungan ulang
  const getUnderlyingDisplayText = useMemo(() => {
    if (!filter.underlying || filter.underlying.length === 0) {
      return "Semua Underlying";
    }
    
    const labels = filter.underlying.map(value => 
      KATEGORI_OPTIONS.underlying.find(o => o.value === value)?.label || value
    );
    
    return labels.join(", ");
  }, [filter.underlying]);

  // Reset filter dengan useCallback
  const handleResetFilter = useCallback(() => {
    setFilter({ 
      model: "", 
      prinsip: "", 
      jenis: "", 
      underlying: []
    });
  }, [setFilter]);

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

  // Optimasi: Hitung info filter aktif sekali saja
  const activeFilterInfo = useMemo(() => {
    const parts = [];
    
    if (filter.model) {
      parts.push(`Model: ${KATEGORI_OPTIONS.model.find(o => o.value === filter.model)?.label}`);
    }
    
    if (filter.prinsip && filter.model !== "tanpa_model") {
      parts.push(`Prinsip: ${KATEGORI_OPTIONS.prinsip.find(o => o.value === filter.prinsip)?.label}`);
    }
    
    if (filter.jenis) {
      parts.push(`Jenis: ${KATEGORI_OPTIONS.jenis.find(o => o.value === filter.jenis)?.label}`);
    }
    
    if (Array.isArray(filter.underlying) && filter.underlying.length > 0 && 
        filter.model === "terstruktur") {
      parts.push(`Underlying: ${filter.underlying.map(v => 
        KATEGORI_OPTIONS.underlying.find(o => o.value === v)?.label || v
      ).join(", ")}`);
    }
    
    return parts;
  }, [filter]);

  return (
    <div className="w-full bg-blue-50 p-4 rounded-lg border border-blue-200">
      <h3 className="font-semibold mb-3 text-blue-800">Filter Kategori</h3>
      <div className="flex flex-wrap gap-4">
        {/* Model Produk */}
        <div className="min-w-[180px]">
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
          <div className="min-w-[180px]">
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
          <div className="min-w-[180px]">
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
          <div className="min-w-[200px] relative" ref={underlyingDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Aset Dasar
            </label>
            <div className="relative">
              <button
                type="button"
                className="w-full border border-gray-950 rounded-md px-3 py-2 text-sm bg-white text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => setShowUnderlyingDropdown(!showUnderlyingDropdown)}
              >
                <span className="truncate">
                  {getUnderlyingDisplayText}
                </span>
                <span className="ml-2">▾</span>
              </button>
              
              {showUnderlyingDropdown && (
                <div className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                  <div className="p-2 border-b">
                    <button
                      type="button"
                      className="w-full text-left px-2 py-1 text-xs text-blue-800 hover:bg-blue-50 rounded"
                      onClick={() => {
                        setFilter(prev => ({ ...prev, underlying: [] }));
                        setShowUnderlyingDropdown(false);
                      }}
                    >
                      Clear All
                    </button>
                  </div>
                  
                  {KATEGORI_OPTIONS.underlying
                    .filter(opt => opt.value !== "")
                    .map((opt) => {
                      const isSelected = filter.underlying?.includes(opt.value);
                      
                      return (
                        <div
                          key={opt.value}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                          onClick={() => handleUnderlyingToggle(opt.value)}
                        >
                          <input
                            type="checkbox"
                            className="accent-blue-800"
                            checked={isSelected}
                            readOnly
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
            className="px-4 py-2 flex items-center bg-blue-800 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors active:scale-95"
            onClick={handleResetFilter}
          >
            <RefreshCcw className="h-4 w-4 mr-2"/>Reset Filter
          </button>
        </div>
      </div>
      
      {/* Info Filter Aktif */}
      {activeFilterInfo.length > 0 && (
        <div className="mt-3 text-sm text-gray-800">
          Filter aktif: {activeFilterInfo.join(", ")}
        </div>
      )}
    </div>
  );
}

// Optional: Tambahkan prop types untuk validasi
FilterKategori.defaultProps = {
  filter: {
    model: "",
    prinsip: "",
    jenis: "",
    underlying: []
  }
};