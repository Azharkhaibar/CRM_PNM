import React, { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import { loadInherent } from "../../utils/storage/riskStorageNilai";
import { computeDerived } from "@/features/Dashboard/pages/RiskProfile-OJK/utils/compute/computeDerived";

/* ======================================================================
   CONSTANT & CONFIGURATION
====================================================================== */

const CATEGORIES = [
  { id: "pasar-produk", label: "Pasar Produk", code: "PSR", Icon: StoreIcon },
  { id: "likuiditas-produk", label: "Likuiditas Produk", code: "LKD", Icon: HandCoins },
  { id: "kredit-produk", label: "Kredit Produk", code: "KRD", Icon: BanknoteArrowUp },
  { id: "konsentrasi-produk", label: "Konsentrasi Produk", code: "KTS", Icon: BrainCircuit },
  { id: "operasional", label: "Operasional", code: "OPS", Icon: Cog },
  { id: "hukum-regulatory", label: "Hukum", code: "HKM", Icon: Scale },
  { id: "kepatuhan-regulatory", label: "Kepatuhan", code: "KTH", Icon: ClipboardCheck },
  { id: "reputasi-regulatory", label: "Reputasi", code: "RTS", Icon: CircleStar },
  { id: "strategis-regulatory", label: "Strategis", code: "STG", Icon: BrainCog },
  { id: "investasi-regulatory", label: "Investasi", code: "INV", Icon: Handshake },
  { id: "rentabilitas-regulatory", label: "Rentabilitas", code: "RNT", Icon: TrendingUpDown },
  { id: "permodalan-regulatory", label: "Permodalan", code: "PMDL", Icon: Sprout },
  { id: "tatakelola-regulatory", label: "Tata Kelola", code: "TKL", Icon: Earth },
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

/* ======================================================================
   UTILITY FUNCTIONS
====================================================================== */

// Fungsi untuk mendapatkan warna berdasarkan risk level
const getRiskColor = (level) => {
  if (level >= 0 && level < 2) return "bg-[#2ECC71] text-white"; // Hijau
  if (level >= 2 && level < 3) return "bg-[#A3E635] text-black"; // Hijau muda
  if (level >= 3 && level < 4) return "bg-[#FACC15] text-black"; // Kuning
  if (level >= 4 && level < 5) return "bg-[#F97316] text-black"; // Oranye
  if (level >= 5) return "bg-[#FF0000] text-white"; // Merah
  return "bg-gray-200 text-gray-700";
};

// Fungsi untuk mendapatkan risk indicator berdasarkan risk level
const getRiskIndicator = (level) => {
  if (level >= 0 && level < 2) return "Low";
  if (level >= 2 && level < 3) return "Low To Moderate";
  if (level >= 3 && level < 4) return "Moderate";
  if (level >= 4 && level < 5) return "Moderate To High";
  if (level >= 5) return "High";
  return "N/A";
};

// Fungsi untuk format angka
const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  
  // Jika sudah string (mungkin sudah diformat), return langsung
  if (typeof value === 'string') {
    return value;
  }
  
  const num = Number(value);
  if (isNaN(num)) return "-";
  
  // Tentukan apakah perlu desimal
  const hasDecimal = num % 1 !== 0;
  return hasDecimal ? num.toFixed(2) : num.toString();
};

// Fungsi untuk format persen
const formatPercent = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  
  const num = Number(value);
  if (isNaN(num)) return "-";
  
  return `${num}%`;
};

// Fungsi untuk menghitung total weighted dari data
const calculateTotalWeighted = (data) => {
  if (!Array.isArray(data)) return 0;
  
  let totalWeighted = 0;
  let count = 0;
  
  data.forEach((param) => {
    if (param && param.nilaiList && Array.isArray(param.nilaiList)) {
      param.nilaiList.forEach((item) => {
        if (item && item.derived && item.derived.weighted !== undefined && !isNaN(item.derived.weighted)) {
          totalWeighted += item.derived.weighted;
          count++;
        }
      });
    }
  });
  
  return count > 0 ? totalWeighted / count : 0;
};

// Fungsi untuk normalisasi dan menghitung derived values seperti di halaman lain
const normalizeAndComputeDerived = (rows) => {
  if (!Array.isArray(rows)) return [];
  
  return rows.map((param) => {
    if (!param) return null;
    
    // Normalize parameter
    const normalizedParam = {
      ...param,
      id: param.id || crypto.randomUUID(),
      bobot: Number(param.bobot) || 0,
      kategori: param.kategori || {
        model: "",
        prinsip: "",
        jenis: "",
        underlying: [],
      },
    };
    
    // PERBAIKAN: Normalize kategori untuk memastikan konsistensi
    if (!normalizedParam.kategori || typeof normalizedParam.kategori !== 'object') {
      normalizedParam.kategori = {
        model: "",
        prinsip: "",
        jenis: "",
        underlying: [],
      };
    }
    
    // Pastikan model ada (bisa "tanpa_model")
    if (!normalizedParam.kategori.model) {
      normalizedParam.kategori.model = "";
    }
    
    // Pastikan underlying adalah array
    if (!Array.isArray(normalizedParam.kategori.underlying)) {
      normalizedParam.kategori.underlying = [];
    }
    
    // Normalize dan hitung derived untuk setiap nilai
    if (Array.isArray(param.nilaiList)) {
      normalizedParam.nilaiList = param.nilaiList.map((item) => {
        if (!item) return null;
        
        const judul = item?.judul || {};
        
        const normalizedItem = {
          ...item,
          id: item?.id || crypto.randomUUID(),
          bobot: Number(item?.bobot) || 0,
          portofolio: item?.portofolio || 0,
          judul: {
            ...judul,
            text: judul?.text || judul?.label || "",
            pembilang: judul?.pembilang || "",
            penyebut: judul?.penyebut || "",
            type: judul?.type || "Tanpa Faktor",
            value: judul?.value !== undefined ? judul.value : judul?.valuePembilang,
            valuePembilang: judul?.valuePembilang !== undefined ? judul.valuePembilang : "",
            valuePenyebut: judul?.valuePenyebut !== undefined ? judul.valuePenyebut : "",
          },
        };
        
        // Hitung derived values seperti di halaman lain
        normalizedItem.derived = computeDerived(normalizedItem, normalizedParam);
        
        return normalizedItem;
      }).filter(Boolean);
    } else {
      normalizedParam.nilaiList = [];
    }
    
    return normalizedParam;
  }).filter(Boolean);
};

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
   MAIN COMPONENT
====================================================================== */

export default function Ringkasan() {
  const { year, activeQuarter, search } = useHeaderStore();
  
  // Select semua kategori saat pertama kali
  const [selectedPages, setSelectedPages] = useState(() => 
    CATEGORIES.map(category => category.id)
  );
  
  const [kategoriFilter, setKategoriFilter] = useState({
    model: "",
    prinsip: "",
    jenis: "",
    underlying: [],
  });
  
  const [summaryData, setSummaryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const kategoriScrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  /* ====================== SCROLL HANDLING ====================== */

  useEffect(() => {
    const container = kategoriScrollRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      const rect = container.getBoundingClientRect();
      const isInside = 
        e.clientX >= rect.left && 
        e.clientX <= rect.right && 
        e.clientY >= rect.top && 
        e.clientY <= rect.bottom;

      if (isInside && container.scrollWidth > container.clientWidth) {
        e.preventDefault();
        container.scrollLeft += e.deltaY * 2;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

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
    const walk = (x - startX) * 2;
    kategoriScrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (kategoriScrollRef.current) {
      kategoriScrollRef.current.style.cursor = 'grab';
      kategoriScrollRef.current.style.removeProperty('user-select');
    }
  };

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

  /* ====================== FUNGSI UNTUK KONTROL KATEGORI ====================== */

  // Fungsi untuk select semua kategori
  const selectAllPages = () => {
    setSelectedPages(CATEGORIES.map(category => category.id));
  };

  // Fungsi untuk deselect semua kategori
  const deselectAllPages = () => {
    setSelectedPages([]);
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
    setSelectedPages((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  /* ====================== LOAD DATA ====================== */

  useEffect(() => {
    const loadSummaryData = async () => {
      if (selectedPages.length === 0) {
        setSummaryData([]);
        return;
      }

      setIsLoading(true);
      const data = [];

      // Untuk setiap halaman yang dipilih
      selectedPages.forEach((categoryId, pageIndex) => {
        try {
          // Load data dari localStorage
          let rows = loadInherent({
            categoryId,
            year,
            quarter: activeQuarter,
          });

          // PERUBAHAN PENTING: Normalize dan hitung derived values seperti di halaman lain
          rows = normalizeAndComputeDerived(rows);

          // PERUBAHAN: Jika tidak ada data sama sekali, tetap masukkan dengan rows kosong
          // agar bisa ditampilkan "data tidak ditemukan"
          if (!Array.isArray(rows) || rows.length === 0) {
            data.push({
              no: pageIndex + 1,
              categoryId,
              categoryLabel: CATEGORIES.find(c => c.id === categoryId)?.label || categoryId,
              categoryCode: CATEGORIES.find(c => c.id === categoryId)?.code || "UNK",
              rows: [],
              totalWeighted: 0,
              hasData: false // Flag untuk menandai tidak ada data
            });
            return;
          }

          // Filter data berdasarkan kategori filter
          const filteredRows = rows.filter((param) => {
            const kategori = param.kategori || {};
            let shouldInclude = true;
            
            // Filter model - PERBAIKAN: include "tanpa_model"
            if (kategoriFilter.model && kategori.model !== kategoriFilter.model) {
              shouldInclude = false;
            }
            
            // Filter prinsip - PERBAIKAN: untuk "tanpa_model", prinsip tidak perlu diperiksa
            if (kategoriFilter.prinsip && kategori.model !== "tanpa_model") {
              if (kategori.prinsip !== kategoriFilter.prinsip) {
                shouldInclude = false;
              }
            }
            
            // Filter jenis - hanya untuk "open_end"
            if (kategoriFilter.jenis && kategori.model === "open_end") {
              if (kategori.jenis !== kategoriFilter.jenis) {
                shouldInclude = false;
              }
            }
            
            // Filter underlying - hanya untuk "terstruktur"
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
              } else if (kategori.model !== "tanpa_model") {
                // Untuk model non-terstruktur, skip jika ada filter underlying
                shouldInclude = false;
              }
            }
            
            return shouldInclude;
          });

          // Jika setelah filter tidak ada data
          if (filteredRows.length === 0) {
            data.push({
              no: pageIndex + 1,
              categoryId,
              categoryLabel: CATEGORIES.find(c => c.id === categoryId)?.label || categoryId,
              categoryCode: CATEGORIES.find(c => c.id === categoryId)?.code || "UNK",
              rows: [],
              totalWeighted: 0,
              hasData: false
            });
            return;
          }

          // Hitung total weighted
          const totalWeighted = calculateTotalWeighted(filteredRows);

          data.push({
            no: pageIndex + 1,
            categoryId,
            categoryLabel: CATEGORIES.find(c => c.id === categoryId)?.label || categoryId,
            categoryCode: CATEGORIES.find(c => c.id === categoryId)?.code || "UNK",
            rows: filteredRows,
            totalWeighted,
            hasData: true
          });

        } catch (error) {
          console.error(`Error loading data for ${categoryId}:`, error);
          data.push({
            no: pageIndex + 1,
            categoryId,
            categoryLabel: CATEGORIES.find(c => c.id === categoryId)?.label || categoryId,
            categoryCode: CATEGORIES.find(c => c.id === categoryId)?.code || "UNK",
            rows: [],
            totalWeighted: 0,
            hasData: false,
            error: error.message
          });
        }
      });

      setSummaryData(data);
      setIsLoading(false);
    };

    loadSummaryData();
  }, [selectedPages, year, activeQuarter, kategoriFilter]);

/* ====================== RENDER DATA ROWS ====================== */
const renderDataRows = () => {
  if (isLoading) {
    return (
      <tr>
        <td colSpan={11} className="border border-gray-950 px-4 py-8 text-center">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
            <span className="ml-3">Memuat data...</span>
          </div>
        </td>
      </tr>
    );
  }

  // Jika tidak ada halaman yang dipilih
  if (selectedPages.length === 0) {
    return (
      <tr>
        <td colSpan={11} className="border border-gray-950 px-2 py-4 text-center text-gray-500">
          Pilih kategori halaman untuk menampilkan data ringkasan
        </td>
      </tr>
    );
  }

  const allRows = [];
  const searchLower = search.toLowerCase().trim();

  summaryData.forEach((pageData, pageIndex) => {
    const { no, categoryLabel, categoryCode, rows } = pageData;

    // PERUBAHAN: Jika tidak ada data untuk halaman ini, tampilkan "data tidak ditemukan"
    if (!Array.isArray(rows) || rows.length === 0) {
      allRows.push(
        <tr key={`${categoryCode}-no-data`}>
          <td colSpan={11} className="border border-gray-950 px-2 py-4 text-center text-gray-500">
            <div className="flex items-center justify-center text-red-500">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Data tidak ditemukan untuk Risiko {categoryLabel}
            </div>
          </td>
        </tr>
      );
      return;
    }

    // Hitung total rowspan untuk halaman ini
    let totalRowSpanForPage = 0;
    let hasSearchResults = false; // Untuk tracking apakah ada data yang sesuai dengan search

    rows.forEach((param) => {
      if (param.nilaiList && Array.isArray(param.nilaiList) && param.nilaiList.length > 0) {
        // Filter berdasarkan search jika ada
        const parameterName = param.judul || "Parameter";
        const parameterNumber = param.nomor || "1";
        
        if (searchLower) {
          param.nilaiList.forEach(item => {
            const indikatorInheren = item?.judul?.text || "-";
            // Gunakan nomor dari nilai jika ada
            const nilaiNomor = item?.nomor || parameterNumber;
            const indeks = `R.${categoryCode}.${nilaiNomor}`;
            
            if (indikatorInheren.toLowerCase().includes(searchLower) ||
                parameterName.toLowerCase().includes(searchLower) ||
                categoryLabel.toLowerCase().includes(searchLower) ||
                indeks.toLowerCase().includes(searchLower)) {
              hasSearchResults = true;
              totalRowSpanForPage++;
            }
          });
        } else {
          totalRowSpanForPage += param.nilaiList.length;
          hasSearchResults = true;
        }
      } else {
        totalRowSpanForPage += 1; // Setidaknya 1 baris untuk parameter tanpa nilaiList
        hasSearchResults = true;
      }
    });

    // Jika ada search dan tidak ada hasil untuk halaman ini, skip halaman ini
    if (searchLower && !hasSearchResults) {
      return;
    }

    // Flag untuk menandai baris pertama dalam halaman
    let isFirstRowInPage = true;

    // Untuk setiap parameter dalam halaman
    rows.forEach((param, paramIndex) => {
      const parameterName = param.judul || "Parameter";
      const parameterNumber = param.nomor || (paramIndex + 1).toString();
      
      // Jika tidak ada nilaiList
      if (!param.nilaiList || !Array.isArray(param.nilaiList) || param.nilaiList.length === 0) {
        // Gunakan nomor parameter untuk indeks
        const indeks = `R.${categoryCode}.${parameterNumber}`;
        
        const shouldDisplay = !searchLower || 
          parameterName.toLowerCase().includes(searchLower) ||
          categoryLabel.toLowerCase().includes(searchLower) ||
          indeks.toLowerCase().includes(searchLower);
        
        if (!shouldDisplay) return;
        
        allRows.push(
          <tr key={`${categoryCode}-${paramIndex}-empty`}>
            {/* No - hanya di baris pertama halaman */}
            {isFirstRowInPage && (
              <td rowSpan={totalRowSpanForPage} className="border border-gray-950 px-2 py-2 text-center bg-[#E8F5FA] align-top">
                {no}
              </td>
            )}
            
            {/* Jenis Risiko - hanya di baris pertama halaman */}
            {isFirstRowInPage && (
              <td rowSpan={totalRowSpanForPage} className="border border-gray-950 px-2 py-2 bg-[#E8F5FA] align-top">
                Risiko {categoryLabel}
              </td>
            )}
            
            <td className="border border-gray-950 px-2 py-2 text-center bg-[#E8F5FA]">
              {formatPercent(param.bobot)}
            </td>
            <td className="border border-gray-950 px-2 py-2 bg-[#E8F5FA]">
              {parameterName}
            </td>
            <td className="border border-gray-950 px-2 py-2 text-center font-mono bg-[#E8F5FA]">
              {indeks}
            </td>
            <td className="border border-gray-950 px-2 py-2 text-center bg-[#E8F5FA]">-</td>
            <td className="border border-gray-950 px-2 py-2 text-center">-</td>
            <td className="border border-gray-950 px-2 py-2 text-center">-</td>
            <td className="border border-gray-950 px-2 py-2 text-center">-</td>
            <td className="border border-gray-950 px-2 py-2 text-center">-</td>
          </tr>
        );
        
        isFirstRowInPage = false;
        return;
      }

      // Untuk setiap nilai dalam parameter
      let itemAddedInParam = false; // Track jika ada item yang ditambahkan untuk parameter ini
      
      param.nilaiList.forEach((item, itemIndex) => {
        const derived = item?.derived || {};
        
        // PERUBAHAN PENTING: Ambil hasil assessment dari derived.hasilDisplay
        const hasilAssessment = derived.hasilDisplay !== undefined ? derived.hasilDisplay : 
                              (derived.weighted !== undefined ? derived.weighted : 0);
        
        // Untuk riskLevel gunakan yang sudah dihitung di derived
        const riskLevel = derived.riskLevel !== undefined ? derived.riskLevel : 
                         (derived.weighted !== undefined ? derived.weighted : 0);
        
        const riskIndicator = getRiskIndicator(riskLevel);
        const riskColor = getRiskColor(riskLevel);
        
        // Hanya ambil j.text untuk Indikator/Risiko Inheren
        const indikatorInheren = item?.judul?.text || "-";
        
        // PERUBAHAN: Gunakan nomor dari nilai jika ada, jika tidak gunakan nomor parameter
        const nilaiNomor = item?.nomor || parameterNumber;
        const indeks = `R.${categoryCode}.${nilaiNomor}`;
        
        // Filter item berdasarkan search
        if (searchLower) {
          if (!indikatorInheren.toLowerCase().includes(searchLower) &&
              !parameterName.toLowerCase().includes(searchLower) &&
              !categoryLabel.toLowerCase().includes(searchLower) &&
              !indeks.toLowerCase().includes(searchLower)) {
            return; // Skip jika tidak cocok
          }
        }
        
        allRows.push(
          <tr key={`${categoryCode}-${paramIndex}-${itemIndex}`}>
            {/* No - hanya di baris pertama halaman */}
            {isFirstRowInPage && itemIndex === 0 && (
              <td rowSpan={totalRowSpanForPage} className="border border-gray-950 px-2 py-2 text-center bg-[#E8F5FA] align-top">
                {no}
              </td>
            )}
            
            {/* Jenis Risiko - hanya di baris pertama halaman */}
            {isFirstRowInPage && itemIndex === 0 && (
              <td rowSpan={totalRowSpanForPage} className="border border-gray-950 px-2 py-2 bg-[#E8F5FA] align-top">
                Risiko {categoryLabel}
              </td>
            )}
            
            {/* Bobot Parameter - hanya di nilai pertama setiap parameter */}
            {itemIndex === 0 && (
              <td rowSpan={param.nilaiList.length} className="border border-gray-950 px-2 py-2 text-center bg-[#E8F5FA] align-top">
                {formatPercent(param.bobot)}
              </td>
            )}
            
            {/* Nama Parameter - hanya di nilai pertama setiap parameter */}
            {itemIndex === 0 && (
              <td rowSpan={param.nilaiList.length} className="border border-gray-950 px-2 py-2 bg-[#E8F5FA] align-top">
                {parameterName}
              </td>
            )}
            
            {/* PERUBAHAN: Indeks - sekarang ditampilkan per item dan menggunakan nomor nilai */}
            <td className="border border-gray-950 px-2 py-2 text-center font-mono bg-[#E8F5FA]">
              {indeks}
            </td>
            
            {/* KOLOM INDIKATOR/RISIKO INHEREN */}
            <td className="border border-gray-950 px-2 py-2 bg-[#E8F5FA] break-words max-w-[500px]">
              {indikatorInheren}
            </td>
            
            <td className="border border-gray-950 px-2 py-2 text-center">
              {formatPercent(item.bobot)}
            </td>
            
            {/* PERUBAHAN: Hasil Assessment - ambil dari derived.hasilDisplay */}
            <td className="border border-gray-950 px-2 py-2 text-center font-bold">
              {formatNumber(hasilAssessment)}
            </td>
            
            <td className={`border border-gray-950 px-2 py-2 text-center font-bold ${riskColor}`}>
              {formatNumber(riskLevel)}
            </td>
            <td className={`border border-gray-950 px-2 py-2 text-center font-bold ${riskColor}`}>
              {riskIndicator}
            </td>
          </tr>
        );
        
        itemAddedInParam = true;
      });
      
      // Setelah memproses semua nilai dalam parameter, update flag
      if (itemAddedInParam) {
        isFirstRowInPage = false;
      }
    });
  });

  // Jika tidak ada data sama sekali yang ditampilkan
  if (allRows.length === 0) {
    return (
      <tr>
        <td colSpan={11} className="border border-gray-950 px-2 py-4 text-center text-gray-500">
          <div className="flex items-center justify-center text-red-500">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {searchLower ? `Tidak ditemukan data untuk pencarian: "${search}"` : "Data tidak ditemukan untuk kategori yang dipilih"}
          </div>
        </td>
      </tr>
    );
  }

  return allRows;
};

  /* ====================== RENDER ====================== */

  return (
    <div className="space-y-4">
      <Header title="Ringkasan Risk Assessment" />

      <div className="bg-white rounded-lg p-4 shadow space-y-4">
        {/* CATEGORY SELECTION */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Kategori Halaman</h3>
            <div className="flex gap-2">
              
              <button
                onClick={toggleAllPages}
                className="px-3 py-1.5 text-xs bg-sky-700 text-white rounded-md hover:bg-sky-900 transition-colors"
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
          />
        )}

        {/* SUMMARY TABLE */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-950 text-sm">
            <thead className="[&>tr>th]:sticky [&>tr>th]:top-0 ">
              <tr>
                {/* No - Lebar sangat kecil */}
                <th rowSpan={3} className="border border-gray-950 px-2 py-2 bg-blue-800 text-white min-w-[50px] max-w-[80px]">
                  No
                </th>
                
                {/* Jenis Resiko - Lebar sedang */}
                <th rowSpan={3} className="border border-gray-950 px-2 py-2 bg-blue-800 text-white min-w-[110px] max-w-[150px]">
                  Jenis Resiko
                </th>
                
                {/* Bobot - Lebar kecil */}
                <th rowSpan={3} className="border border-gray-950 px-2 py-2 bg-blue-800 text-white min-w-[30px] max-w-[120px]">
                  Bobot
                </th>
                
                {/* Parameter - Lebar besar */}
                <th rowSpan={3} className="border border-gray-950 px-2 py-2 bg-blue-800 text-white min-w-[250px] max-w-[200px]">
                  Parameter
                </th>
                
                {/* PERUBAHAN: Indeks - format baru R.{categoryCode}.noparameter */}
                <th rowSpan={3} className="border border-gray-950 px-2 py-2 bg-blue-800 text-white min-w-[100px] max-w-[200px]">
                  Indeks
                </th>
                
                {/* PERUBAHAN: Indikator/Risiko Inheren - diambil dari nilai di local storage */}
                <th rowSpan={3} className="border border-gray-950 px-2 py-2 bg-blue-800 text-white min-w-[250px] max-w-[250px]">
                  Indikator/Risiko Inheren
                </th>
                
                {/* Hasil Risk Assessment - Header Utama */}
                <th colSpan={4} className="border border-gray-950 px-2 py-2 bg-slate-800 text-white">
                  Hasil Risk Assessment
                </th>
              </tr>
              
              <tr>
                <th colSpan={4} className="border border-gray-950 px-2 py-2 bg-slate-800 text-white">
                  Active Quarter {activeQuarter?.toUpperCase()}
                </th>
              </tr>
              
              <tr>
                <th className="border border-gray-950 px-2 py-2 bg-slate-800 text-white min-w-[40px] max-w-[150px]">
                  Bobot
                </th>
                <th className="border border-gray-950 px-2 py-2 bg-slate-800 text-white min-w-[80px] max-w-[180px]">
                  Hasil Assessment
                </th>
                <th className="border border-gray-950 px-2 py-2 bg-slate-800 text-white min-w-[80px] max-w-[150px]">
                  Risk Level
                </th>
                <th className="border border-gray-950 px-2 py-2 bg-slate-800 text-white min-w-[80px] max-w-[250px]">
                  Risk Indicator
                </th>
              </tr>
            </thead>
            <tbody>
              {renderDataRows()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}