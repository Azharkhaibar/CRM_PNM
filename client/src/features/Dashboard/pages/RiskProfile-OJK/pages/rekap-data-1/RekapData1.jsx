import React, { useMemo, useState, useEffect } from "react";
import Header from "../../components/header/Header";
import { useHeaderStore } from "../../store/headerStore";
import { Input } from "@/components/ui/input";
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
  FileText,
} from "lucide-react";
import {
  loadKpmr,
  loadDerived,
} from "../../utils/storage/riskStorageNilai";

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


const INHERENT_RISK_INDICATORS = [
  { label: "Low", value: "low", color: "#2ECC71", min: 0, max: 1.49, score: 1 },
  { label: "Low To Moderate", value: "lowToModerate", color: "#A3E635", min: 1.50, max: 2.49, score: 2 },
  { label: "Moderate", value: "moderate", color: "#FACC15", min: 2.50, max: 3.49, score: 3 },
  { label: "Moderate To High", value: "moderateToHigh", color: "#F97316", min: 3.50, max: 4.49, score: 4 },
  { label: "High", value: "high", color: "#FF0000", min: 4.50, max: Infinity, score: 5 },
];

// KPMR Risk Indicators (yang baru)
const KPMR_RISK_INDICATORS = [
  { label: "Strong", value: "strong", color: "#2ECC71", min: 0, max: 1.49, score: 1 },
  { label: "Satisfactory", value: "satisfactory", color: "#A3E635", min: 1.50, max: 2.49, score: 2 },
  { label: "Fair", value: "fair", color: "#FACC15", min: 2.50, max: 3.49, score: 3 },
  { label: "Marginal", value: "marginal", color: "#F97316", min: 3.50, max: 4.49, score: 4 },
  { label: "Unsatisfactory", value: "unsatisfactory", color: "#FF0000", min: 4.50, max: Infinity, score: 5 },
];

// INDIKATOR KHUSUS UNTUK PTK (PERINGKAT TINGKAT KOMPOSIT) - HANYA UNTUK FOOTER
const PTK_INDICATORS = [
  { label: "Peringkat 1", value: "peringkat1", color: "#2ECC71", min: 0, max: 1.49, score: 1 },
  { label: "Peringkat 2", value: "peringkat2", color: "#A3E635", min: 1.50, max: 2.49, score: 2 },
  { label: "Peringkat 3", value: "peringkat3", color: "#FACC15", min: 2.50, max: 3.49, score: 3 },
  { label: "Peringkat 4", value: "peringkat4", color: "#F97316", min: 3.50, max: 4.49, score: 4 },
  { label: "Peringkat 5", value: "peringkat5", color: "#FF0000", min: 4.50, max: Infinity, score: 5 },
];

// Fungsi untuk mengecek apakah data tersedia
const checkDataAvailability = (inherentSummary, kpmrSummary) => {
  const hasInherent = inherentSummary !== undefined && inherentSummary !== null && inherentSummary > 0;
  const hasKpmr = kpmrSummary !== undefined && kpmrSummary !== null && kpmrSummary > 0;
  
  if (!hasInherent && !hasKpmr) {
    return "no-data";
  } else if ((hasInherent && !hasKpmr) || (!hasInherent && hasKpmr)) {
    return "partial-data";
  }
  return "complete-data";
};

const getIndicatorNumber = (score, isDataAvailable = true) => {
  if (!isDataAvailable) {
    return 0; 
  }
  
  if (score === undefined || score === null || isNaN(score)) {
    return 5; // Default ke angka 5 jika tidak valid
  }
  
  if (score >= 0 && score <= 1.49) return 1;      // Low
  if (score > 1.5 && score <= 2.49) return 2;     // Low To Moderate
  if (score > 2.5 && score <= 3.49) return 3;     // Moderate
  if (score > 3.5 && score <= 4.49) return 4;     // Moderate To High
  return 5;                                       // High
};

// Fungsi untuk mendapatkan warna berdasarkan angka indikator
const getIndicatorColor = (number) => {
  switch(number) {
    case 0: return "bg-gray-300";     
    case 1: return "bg-green-500";    
    case 2: return "bg-lime-500";     
    case 3: return "bg-yellow-500";   
    case 4: return "bg-orange-500";   
    case 5: return "bg-red-500";      
    default: return "bg-gray-500";    
  }
};

// Fungsi untuk mendapatkan indikator PTK khusus (hanya peringkat 1-5)
const getPtkIndicator = (score) => {
  if (score === undefined || score === null || isNaN(score)) {
    return { ...PTK_INDICATORS[PTK_INDICATORS.length - 1], score: 5 };
  }
  
  // Batasi maksimal score ke 5 untuk perhitungan PTK
  const boundedScore = Math.min(score, 5);
  
  for (const indicator of PTK_INDICATORS) {
    if (boundedScore >= indicator.min && boundedScore <= indicator.max) {
      return { ...indicator, score: indicator.score };
    }
  }
  
  // Jika lebih dari 5, tetap beri peringkat 5
  return { ...PTK_INDICATORS[PTK_INDICATORS.length - 1], score: 5 };
};

const getRiskIndicator = (score, type = "inherent") => {
  if (score === undefined || score === null) {
    return type === "kpmr" 
      ? { ...KPMR_RISK_INDICATORS[KPMR_RISK_INDICATORS.length - 1], score: 5 } 
      : { ...INHERENT_RISK_INDICATORS[INHERENT_RISK_INDICATORS.length - 1], score: 5 };
  }
  
  const indicators = type === "kpmr" ? KPMR_RISK_INDICATORS : INHERENT_RISK_INDICATORS;
  
  for (const indicator of indicators) {
    if (score >= indicator.min && score <= indicator.max) {
      return { ...indicator, score: indicator.score || 5 };
    }
  }
  
  return type === "kpmr" 
    ? { ...KPMR_RISK_INDICATORS[KPMR_RISK_INDICATORS.length - 1], score: 5 } 
    : { ...INHERENT_RISK_INDICATORS[INHERENT_RISK_INDICATORS.length - 1], score: 5 };
};


function useGlobalSummaryAdapter() {
  const { year, activeQuarter } = useHeaderStore();
  const [summaryData, setSummaryData] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      const data = [];

      CATEGORIES.forEach((category) => {
        // ================= INHERENT =================
        const derivedData = loadDerived({
          categoryId: category.id,
          year,
          quarter: activeQuarter,
        });

          console.log(`Derived data for ${category.id}:`, derivedData);

        const inherentSummary =
          typeof derivedData?.summary === "number"
            ? derivedData.summary
            : 0;

        // ================= KPMR =================
        const kpmrRows = loadKpmr({
          categoryId: category.id,
          year,
        });

        let kpmrSummary = 0;

        if (Array.isArray(kpmrRows) && kpmrRows.length > 0) {
          let total = 0;
          let count = 0;

          kpmrRows.forEach((aspek) => {
            aspek.pertanyaanList?.forEach((p) => {
              const v =
                p.skor?.[activeQuarter] ??
                p.skor?.[activeQuarter.toUpperCase()];
              const num = Number(v);
              if (!isNaN(num) && num >= 1 && num <= 5) {
                total += num;
                count++;
              }
            });
          });

          if (count > 0) kpmrSummary = total / count;
        }

        data.push({
          id: category.id,
          nama: category.label,
          Icon: category.Icon,
          inherentSummary, 
          kpmrSummary,     
        });
      });

      setSummaryData(data);
    };

    fetchData();

    const handleUpdate = () => fetchData();
    window.addEventListener("risk-data-updated", handleUpdate);
    return () =>
      window.removeEventListener("risk-data-updated", handleUpdate);
  }, [year, activeQuarter]);

  return summaryData;
}


export default function RekapData1() {
  const { search } = useHeaderStore();
  const summaryPerHalaman = useGlobalSummaryAdapter();

  const [bhzValues, setBhzValues] = useState(() => {
    // Inisialisasi nilai default
    const defaults = {};
    
    CATEGORIES.forEach((category) => {
      if (category.id === "operasional-regulatory" || category.id === "strategis-regulatory") {
        defaults[category.id] = 20;
      } else {
        defaults[category.id] = 10; 
      }
    });
    
    return defaults;
  });

  // Debug: Tampilkan data yang diterima
  useEffect(() => {
    console.log("[RekapData1] Summary data received:", summaryPerHalaman);
  }, [summaryPerHalaman]);

  // Filter data berdasarkan search
  const filteredData = useMemo(() => {
    if (!search) return summaryPerHalaman;
    const s = search.toLowerCase();
    return summaryPerHalaman.filter((h) =>
      h.nama.toLowerCase().includes(s)
    );
  }, [search, summaryPerHalaman]);

const tableData = useMemo(() => {
  return filteredData.map((item) => {
    const bvt = 100; 
    let bhz;
    if (bhzValues[item.id] !== undefined) {
      bhz = bhzValues[item.id];
    } else {
      bhz = (item.id === "operasional-regulatory" || item.id === "strategis-regulatory") ? 20 : 10;
    }
    
    const inherentSummary = item.inherentSummary || 0; 
    const kpmrSummary = item.kpmrSummary || 0; 
    
    const inherentSkor = inherentSummary * (bvt / 100);
    const kpmrSkor = kpmrSummary;
    
    // Cek ketersediaan data
    const dataStatus = checkDataAvailability(inherentSummary, kpmrSummary);
    
    // Hitung komposit hanya jika data lengkap
    let kompositSkor = 0;
    if (dataStatus === "complete-data") {
      kompositSkor = (inherentSkor + kpmrSkor) / 2;
    } else if (dataStatus === "partial-data") {
      kompositSkor = inherentSummary > 0 ? inherentSkor : kpmrSkor;
    }
    
    const inherentValueForFooter = inherentSkor * (bhz / 100);
    const kpmrValueForFooter = kpmrSkor * (bhz / 100);
    
    const inherentIndicator = getRiskIndicator(inherentSkor, "inherent");
    const kpmrIndicator = getRiskIndicator(kpmrSkor, "kpmr");
    const kompositIndicator = getRiskIndicator(kompositSkor, "inherent");
    
    return {
      ...item,
      bvt,
      bhz,
      inherentSummary,    
      kpmrSummary,      
      inherentSkor,       
      kpmrSkor,        
      kompositSkor,      
      inherentValueForFooter,
      kpmrValueForFooter,     
      inherentIndicator,
      kpmrIndicator,
      kompositIndicator,
      dataStatus, // Tambahkan status data
    };
  });
}, [filteredData, bhzValues]);

const peringkatKomposit = useMemo(() => {
  if (summaryPerHalaman.length === 0) { 
    return {
      inherentValue: 0,
      kpmrValue: 0,
      ptkValue: 0,
      totalCategories: 0,
      categoriesWithInherentData: 0,
      categoriesWithKpmrData: 0,
      categoriesWithAnyData: 0,
      hasInherentData: false,
      hasKpmrData: false,
    };
  }

  let totalInherentValue = 0;
  let totalKpmrValue = 0;
  let categoriesWithInherentData = 0;
  let categoriesWithKpmrData = 0;
  let categoriesWithAnyData = 0;

  // Hitung semua kategori yang memiliki data (TIDAK hanya 3 kategori tertentu)
  summaryPerHalaman.forEach((item) => {
    const bvt = 100;
    const bhz = bhzValues[item.id] !== undefined 
      ? bhzValues[item.id] 
      : (item.id === "operasional-regulatory" || item.id === "strategis-regulatory") 
        ? 20 
        : 10;
    
    const inherentSkor = (item.inherentSummary || 0) * (bvt / 100);
    const kpmrSkor = item.kpmrSummary || 0;
    
    // Hanya tambahkan ke total jika ada data
    if (item.inherentSummary > 0) {
      const inherentValueForFooter = inherentSkor * (bhz / 100);
      totalInherentValue += inherentValueForFooter;
      categoriesWithInherentData++;
      categoriesWithAnyData++;
    }
    
    if (item.kpmrSummary > 0) {
      const kpmrValueForFooter = kpmrSkor * (bhz / 100);
      totalKpmrValue += kpmrValueForFooter;
      categoriesWithKpmrData++;
      categoriesWithAnyData++;
    }
  });

  // PTK hanya dihitung jika ada data inherent DAN KPMR
  let ptkValue = 0;
  if (categoriesWithInherentData > 0 && categoriesWithKpmrData > 0) {
    ptkValue = (totalInherentValue + totalKpmrValue) / 2;
  }

  return {
    inherentValue: totalInherentValue,
    kpmrValue: totalKpmrValue,
    ptkValue: ptkValue,
    totalCategories: summaryPerHalaman.length,
    categoriesWithInherentData,
    categoriesWithKpmrData,
    categoriesWithAnyData,
    hasInherentData: categoriesWithInherentData > 0,
    hasKpmrData: categoriesWithKpmrData > 0,
    hasCompleteData: categoriesWithInherentData > 0 && categoriesWithKpmrData > 0,
    hasPartialData: (categoriesWithInherentData > 0 && categoriesWithKpmrData === 0) || 
                    (categoriesWithInherentData === 0 && categoriesWithKpmrData > 0),
    hasNoData: categoriesWithAnyData === 0,
  };
}, [summaryPerHalaman, bhzValues]);

const footerDisplay = useMemo(() => {
  const inherentDisplay = peringkatKomposit.inherentValue;
  const kpmrDisplay = peringkatKomposit.kpmrValue;
  const ptkDisplay = peringkatKomposit.ptkValue;

  // Gunakan indikator PTK khusus untuk ptkIndicator
  const ptkIndicator = getPtkIndicator(ptkDisplay);

  return {
    inherentDisplay: inherentDisplay,
    kpmrDisplay: kpmrDisplay,
    ptkDisplay: ptkDisplay,
    inherentIndicator: getRiskIndicator(inherentDisplay, "inherent"),
    kpmrIndicator: getRiskIndicator(kpmrDisplay, "kpmr"),
    ptkIndicator: ptkIndicator, // Menggunakan indikator PTK khusus
    hasInherentData: peringkatKomposit.hasInherentData,
    hasKpmrData: peringkatKomposit.hasKpmrData,
    hasCompleteData: peringkatKomposit.hasCompleteData,
    hasPartialData: peringkatKomposit.hasPartialData,
    hasNoData: peringkatKomposit.hasNoData,
    categoriesWithInherentData: peringkatKomposit.categoriesWithInherentData,
    categoriesWithKpmrData: peringkatKomposit.categoriesWithKpmrData,
  };
}, [peringkatKomposit]);

  const handleBhzChange = (id, value) => {
    setBhzValues(prev => ({
      ...prev,
      [id]: Math.min(100, Math.max(0, Number(value) || 0))
    }));
  };

  // Komponen ScoreCell untuk Inherent dan KPMR
  const ScoreCell = ({ value, indicator, hasData = true, type = "inherent" }) => {
    const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
    
    // Jika tidak ada data, tampilkan indikator abu-abu gelap
    if (!hasData) {
      return (
        <div className="w-full flex mx-0.5 flex-col items-center justify-center space-y-1">
          {/* Nilai angka di atas indikator */}
          <div className="text-lg font-bold text-gray-800">
            0.00
          </div>
          
          {/* Indikator abu-abu gelap untuk data tidak ditemukan */}
          <div 
            className="rounded-full px-3 py-2 font-bold text-md w-full flex items-center justify-center whitespace-nowrap min-h-[40px] bg-gray-400 text-gray-700"
          >
            Data Tidak Ditemukan
          </div>
        </div>
      );
    }
    
    // Jika ada data
    const safeIndicator = indicator || getRiskIndicator(safeValue, type);
    const score = safeIndicator.score || 5;
    
    return (
      <div className="w-full flex mx-0.5 flex-col items-center justify-center space-y-1">
        {/* Nilai angka di atas indikator */}
        <div className="text-lg font-bold text-gray-800">
          {safeValue.toFixed(2)}
        </div>
        
        {/* Indikator warna normal */}
        <div 
          className={`rounded-full px-3 py-2 font-bold text-md w-full flex items-center justify-center whitespace-nowrap min-h-[40px] text-black`}
          style={{ 
            backgroundColor: safeIndicator.color,
          }}
        >
          {safeIndicator.label}
        </div>
      </div>
    );
  };

  // Komponen khusus untuk Komposit dengan penanganan data tidak lengkap
  const KompositScoreCell = ({ inherentValue, kpmrValue, inherentIndicator, kpmrIndicator, dataStatus }) => {
    const safeInherentValue = typeof inherentValue === 'number' && !isNaN(inherentValue) ? inherentValue : 0;
    const safeKpmrValue = typeof kpmrValue === 'number' && !isNaN(kpmrValue) ? kpmrValue : 0;
    
    // Jika tidak ada data sama sekali
    if (dataStatus === "no-data") {
      return (
        <div className="w-full flex mx-0.5 flex-col items-center justify-center space-y-1">
          <div className="text-lg font-bold text-gray-800">
            0.00
          </div>
          <div 
            className="rounded-full px-3 py-2 font-bold text-md w-full flex items-center justify-center whitespace-nowrap min-h-[40px] bg-gray-400 text-gray-700"
          >
            Data Tidak Ditemukan
          </div>
        </div>
      );
    }
    
    // Jika data parsial (hanya salah satu)
    if (dataStatus === "partial-data") {
      // Gunakan nilai yang tersedia
      const availableValue = inherentValue > 0 ? inherentValue : kpmrValue;
      
      return (
        <div className="w-full flex mx-0.5 flex-col items-center justify-center space-y-1">
          <div className="text-lg font-bold text-gray-800">
            {availableValue.toFixed(2)}
          </div>
          <div 
            className="rounded-full px-3 py-2 font-bold text-md w-full flex items-center justify-center whitespace-nowrap min-h-[40px] bg-gray-200 text-gray-600"
          >
            Data Belum Lengkap
          </div>
        </div>
      );
    }
    
    // Data lengkap, hitung komposit
    const kompositValue = (safeInherentValue + safeKpmrValue) / 2;
    const kompositIndicator = getRiskIndicator(kompositValue, "inherent");
    
    return (
      <div className="w-full flex mx-0.5 flex-col items-center justify-center space-y-1">
        <div className="text-lg font-bold text-gray-800">
          {kompositValue.toFixed(2)}
        </div>
        <div 
          className={`rounded-full px-3 py-2 font-bold text-md w-full flex items-center justify-center whitespace-nowrap min-h-[40px] text-black`}
          style={{ 
            backgroundColor: kompositIndicator.color,
          }}
        >
          {kompositIndicator.label}
        </div>
      </div>
    );
  };

  // Komponen khusus untuk PTK Footer dengan indikator PTK
  const PtkFooterCell = ({ value, indicator, whiteText = false, hasData = true, isPartial = false }) => {
    const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
    
    // Jika tidak ada data sama sekali
    if (!hasData) {
      return (
        <div className="w-full flex flex-col items-center justify-center space-y-1">
          <div className={`text-lg font-bold ${whiteText ? 'text-white' : 'text-gray-800'}`}>
            0.00
          </div>
          <div 
            className="rounded-full px-3 py-2 font-bold text-md w-full flex items-center justify-center whitespace-nowrap min-h-[40px] bg-gray-400 text-white"
          >
            Data Tidak Ditemukan
          </div>
        </div>
      );
    }
    
    // Jika data parsial
    if (isPartial) {
      return (
        <div className="w-full flex flex-col items-center justify-center space-y-1">
          <div className={`text-lg font-bold ${whiteText ? 'text-white' : 'text-gray-800'}`}>
            {safeValue.toFixed(2)}
          </div>
          <div 
            className="rounded-full px-3 py-2 font-bold text-md w-full flex items-center justify-center whitespace-nowrap min-h-[40px] bg-gray-200 text-gray-600"
          >
            Data Belum Lengkap
          </div>
        </div>
      );
    }
    
    // Gunakan indikator PTK khusus
    const ptkIndicator = getPtkIndicator(safeValue);
    const score = ptkIndicator.score || 5;
    
    return (
      <div className="w-full flex flex-col items-center justify-center space-y-1">
        <div className={`text-lg font-bold ${whiteText ? 'text-white' : 'text-gray-800'}`}>
          {safeValue.toFixed(2)}
        </div>
        <div 
          className={`rounded-full px-3 py-2 font-bold text-md w-full flex items-center justify-center whitespace-nowrap text-black min-h-[40px]`}
          style={{ 
            backgroundColor: ptkIndicator.color,
          }}
        >
          {score}
        </div>
      </div>
    );
  };

  // Komponen untuk footer inherent dan KPMR
  const FooterScoreCell = ({ value, indicator, whiteText = false, hasData = true }) => {
    const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
    
    // Jika tidak ada data
    if (!hasData) {
      return (
        <div className="w-full flex flex-col items-center justify-center space-y-1">
          <div className={`text-lg font-bold ${whiteText ? 'text-white' : 'text-gray-800'}`}>
            0.00
          </div>
          <div 
            className="rounded-full px-3 py-2 font-bold text-md w-full flex items-center justify-center whitespace-nowrap min-h-[40px] bg-gray-400 text-white"
          >
            Data Tidak Ditemukan
          </div>
        </div>
      );
    }
    
    const safeIndicator = indicator || getRiskIndicator(safeValue, "inherent");
    const score = safeIndicator.score || 5;
    
    return (
      <div className="w-full flex flex-col items-center justify-center space-y-1">
        <div className={`text-lg font-bold ${whiteText ? 'text-white' : 'text-gray-800'}`}>
          {safeValue.toFixed(2)}
        </div>
        <div 
          className={`rounded-full px-3 py-2 font-bold text-md w-full flex items-center justify-center whitespace-nowrap text-black min-h-[40px]`}
          style={{ 
            backgroundColor: safeIndicator.color,
          }}
        >
          {score}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen p-4">
      <Header title="Rekap Data 1" />

   <div className="mt-4 gap-4 w-full flex">
  {/* CARD 1 */}
  <div className="bg-white shadow-md border border-gray-300 w-[50%] p-6 rounded-xl flex items-center gap-5">
    {/* Kotak angka kiri dengan indikator dinamis */}
    <div className={`w-20 h-20 rounded-lg flex items-center justify-center shadow ${getIndicatorColor(getIndicatorNumber(footerDisplay?.inherentDisplay || 0, footerDisplay?.hasInherentData))}`}>
      <span className="text-2xl font-bold text-black">
        {getIndicatorNumber(footerDisplay?.inherentDisplay || 0, footerDisplay?.hasInherentData)}
      </span>
    </div>

    {/* Konten tengah */}
    <div className="flex-1 text-center">
      <p className="text-lg font-semibold border-b border-black inline-block px-3 pb-1">
        Komposit Inherent : {" "}
        {(Number(footerDisplay?.inherentDisplay) || 0).toFixed(2)}
      </p>
      <p className="text-lg font-bold mt-1">
        {footerDisplay?.hasInherentData ? footerDisplay?.inherentIndicator?.label : "Data Tidak Ditemukan"}
      </p>
      <p className="text-sm text-gray-500 mt-1">
        {footerDisplay?.categoriesWithInherentData} data dari total 13 data
      </p>
    </div>
  </div>

  {/* CARD 2 */}
  <div className="bg-white shadow-md border border-gray-300 w-[50%] p-6 rounded-xl flex items-center gap-5">
    {/* Kotak angka kiri dengan indikator dinamis */}
    <div className={`w-20 h-20 rounded-lg flex items-center justify-center shadow ${getIndicatorColor(getIndicatorNumber(footerDisplay?.kpmrDisplay || 0, footerDisplay?.hasKpmrData))}`}>
      <span className="text-2xl font-bold text-black">
        {getIndicatorNumber(footerDisplay?.kpmrDisplay || 0, footerDisplay?.hasKpmrData)}
      </span>
    </div>

    <div className="flex-1 text-center">
      <p className="text-lg font-semibold border-b border-black inline-block px-3 pb-1">
        KPMR Komposit : {" "}
        {(Number(footerDisplay?.kpmrDisplay) || 0).toFixed(2)}
      </p>
      <p className="text-lg font-bold mt-1">
        {footerDisplay?.hasKpmrData ? footerDisplay?.kpmrIndicator?.label : "Data Tidak Ditemukan"}
      </p>
      <p className="text-sm text-gray-500 mt-1">
        {footerDisplay?.categoriesWithKpmrData} data dari total 13 data
      </p>
    </div>
  </div>

  {/* CARD 3 - MENGGUNAKAN INDIKATOR PTK KHUSUS */}
  <div className="bg-white shadow-md border border-gray-300 w-[50%] p-6 rounded-xl flex items-center gap-5">
    {/* Kotak angka kiri dengan indikator dinamis */}
    <div className={`w-20 h-20 rounded-lg flex items-center justify-center shadow ${footerDisplay?.hasNoData ? "bg-gray-400" : footerDisplay?.hasPartialData ? "bg-gray-200" : getIndicatorColor(footerDisplay?.ptkIndicator?.score || 5)}`}>
      <span className="text-2xl font-bold text-black">
        {footerDisplay?.hasCompleteData ? (footerDisplay?.ptkIndicator?.score || 5) : 0}
      </span>
    </div>

    <div className="flex-1 text-center">
      <p className="text-lg font-semibold border-b border-black inline-block px-3 pb-1">
        Komposit : {" "}
        {(Number(footerDisplay?.ptkDisplay) || 0).toFixed(2)}
      </p>
      <p className="text-lg font-bold mt-1">
        {footerDisplay?.hasNoData ? "Data Tidak Ditemukan" : 
         footerDisplay?.hasPartialData ? "Data Belum Lengkap" : 
         (footerDisplay?.ptkIndicator?.label || "Peringkat 5")}
      </p>
      <p className="text-sm text-gray-500 mt-1">
        {footerDisplay?.hasCompleteData ? "Data lengkap" : 
         footerDisplay?.hasPartialData ? "Data parsial" : 
         "Tidak ada data"}
      </p>
    </div>
  </div>
</div>


{/* Tabel Container */}
<div className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden">
  {/* Tabel Header */}
  <div className="bg-blue-700 text-white">
    <div className="grid grid-cols-12 p-4 font-bold text-lg">
      <div className="col-span-2 ml-13 flex items-center gap-2">
        <span>JENIS RISIKO</span>
      </div>
      <div className="col-span-2 mr-3 text-center">BVt</div>
      <div className="col-span-2 mr-4 text-center">BHz</div>
      <div className="col-span-2 mr-5 text-center">INHERENT</div>
      <div className="col-span-2 mr-6 text-center">KPMR</div>
      <div className="col-span-2 mr-10 text-center">Peringkat Tingkat Komposit</div>
    </div>
  </div>

  {/* Tabel Body */}
  <div className="divide-y max-h-[450px] overflow-y-auto">
    {tableData.map((item) => {
      const hasInherentData = item.inherentSummary > 0;
      const hasKpmrData = item.kpmrSummary > 0;
      const dataStatus = checkDataAvailability(item.inherentSummary, item.kpmrSummary);
      
      return (
        <div key={item.id} className="grid grid-cols-12 p-4 hover:bg-gray-50 transition-colors">
          {/* Jenis Risiko dengan Icon */}
          <div className="col-span-2 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              {item.Icon ? (
                <item.Icon className="w-5 h-5 text-blue-600" />
              ) : (
                <FileText className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <span className="font-bold text-lg tracking-wide text-gray-800">{item.nama}</span>
          </div>

          {/* BVt (Fixed) */}
          <div className="col-span-2 flex items-center justify-center">
            <div className="bg-gray-100 rounded-lg px-4 py-2 font-semibold text-gray-700 min-w-[80px] text-center">
              {item.bvt}%
            </div>
          </div>

          {/* BHz (Editable) */}
          <div className="col-span-2 flex items-center justify-center">
            <div className="relative">
              <Input
                type="number"
                min="0"
                max="100"
                value={item.bhz}
                onChange={(e) => handleBhzChange(item.id, e.target.value)}
                className="w-24 text-center bg-white border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-2 text-gray-500">%</span>
            </div>
          </div>

          {/* Inherent */}
          <div className="col-span-2 flex items-center justify-center">
            <ScoreCell 
              value={item.inherentSkor} 
              indicator={item.inherentIndicator}
              hasData={hasInherentData}
              type="inherent"
            />
          </div>

          {/* KPMR */}
          <div className="col-span-2 flex items-center justify-center">
            <ScoreCell 
              value={item.kpmrSkor} 
              indicator={item.kpmrIndicator}
              hasData={hasKpmrData}
              type="kpmr"
            />
          </div>

          {/* Peringkat Tingkat Komposit */}
          <div className="col-span-2 flex items-center justify-center">
            <KompositScoreCell 
              inherentValue={item.inherentSkor}
              kpmrValue={item.kpmrSkor}
              inherentIndicator={item.inherentIndicator}
              kpmrIndicator={item.kpmrIndicator}
              dataStatus={dataStatus}
            />
          </div>
        </div>
      );
    })}
  </div>

  {/* Tabel Footer */}
  <div className="bg-blue-900 border-t">
    <div className="grid grid-cols-12 p-4 text-white font-bold">
      <div className="col-span-2"></div>
      <div className="col-span-2 text-white flex tracking-wider items-center text-2xl">
        Peringkat Komposit
      </div>
      <div className="col-span-1 text-center text-gray-500 flex items-center justify-center"></div>
      <div className="col-span-1 text-center text-gray-500 flex items-center justify-center"></div>
      
      {/* Inherent Footer */}
      <div className="col-span-2 mr-4 -ml-1  flex items-center justify-center">
        <FooterScoreCell 
          value={footerDisplay.inherentDisplay} 
          indicator={footerDisplay.inherentIndicator}
          whiteText={true}
          hasData={footerDisplay.hasInherentData}
        />
      </div>
      
      {/* KPMR Footer */}
      <div className="col-span-2 mr-4 -ml-2  flex items-center justify-center">
        <FooterScoreCell 
          value={footerDisplay.kpmrDisplay} 
          indicator={footerDisplay.kpmrIndicator}
          whiteText={true}
          hasData={footerDisplay.hasKpmrData}
        />
      </div>
      
      {/* PTK Footer - MENGGUNAKAN KOMPONEN PTK KHUSUS */}
      <div className="col-span-2 mr-4 -ml-3 flex items-center justify-center">
        <PtkFooterCell 
          value={footerDisplay.ptkDisplay} 
          indicator={footerDisplay.ptkIndicator}
          whiteText={true}
          hasData={footerDisplay.hasInherentData || footerDisplay.hasKpmrData}
          isPartial={footerDisplay.hasPartialData}
        />
      </div>
    </div>
  </div>
</div>


      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-3">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-base font-semibold text-gray-950">
              INHERENT :
            </span>
            {INHERENT_RISK_INDICATORS.map((i, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-base font-semibold">
                <span
                  className="w-5 h-5 rounded border"
                  style={{ backgroundColor: i.color }}
                />
                <span className="text-gray-950">
                  {i.label} ({i.min.toFixed(2)} – {(i.max === Infinity ? "5" : i.max.toFixed(2))})  
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <span className="text-base font-semibold text-gray-950">
              KPMR :
            </span>
            {KPMR_RISK_INDICATORS.map((i, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-base font-semibold">
                <span
                  className="w-5 h-5 rounded border"
                  style={{ backgroundColor: i.color }}
                />
                <span className="text-gray-950">
                  {i.label} ({i.min.toFixed(2)} – {(i.max === Infinity ? "5" : i.max.toFixed(2))})
                </span>
              </div>
            ))}
          </div>

          {/* LEGENDA PTK (PERINGKAT TINGKAT KOMPOSIT) */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className="text-base font-semibold text-gray-950">
              PERINGKAT TINGKAT KOMPOSIT :
            </span>
            {PTK_INDICATORS.map((i, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-base font-semibold">
                <span
                  className="w-5 h-5 rounded border"
                  style={{ backgroundColor: i.color }}
                />
                <span className="text-gray-950">
                  {i.label} ({i.min.toFixed(2)} – {(i.max === Infinity ? "5" : i.max.toFixed(2))})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      
    </div>
  );
}