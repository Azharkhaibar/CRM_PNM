import React, { useMemo, useState, useEffect } from "react";
import Header from "../../components/header/Header";
import { useHeaderStore } from "../../store/headerStore";
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
  Grid3x3,
  Circle,
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
  { label: "High", value: "high", color: "#FF0000", min: 4.50, max: 5, score: 5 },
];

const KPMR_RISK_INDICATORS = [
  { label: "Strong", value: "strong", color: "#2ECC71", min: 0, max: 1.49, score: 1 },
  { label: "Satisfactory", value: "satisfactory", color: "#A3E635", min: 1.50, max: 2.49, score: 2 },
  { label: "Fair", value: "fair", color: "#FACC15", min: 2.50, max: 3.49, score: 3 },
  { label: "Marginal", value: "marginal", color: "#F97316", min: 3.50, max: 4.49, score: 4 },
  { label: "Unsatisfactory", value: "unsatisfactory", color: "#FF0000", min: 4.50, max: 5, score: 5 },
];

const RISK_MATRIX = [
  // KPMR: Strong(1), Satisfactory(2), Fair(3), Marginal(4), Unsatisfactory(5)
  [1, 1, 2, 3, 3],     // Inherent: Low (1)
  [1, 2, 2, 3, 4],     // Inherent: Low to Moderate (2)
  [2, 2, 3, 4, 4],     // Inherent: Moderate (3)
  [2, 3, 4, 4, 5],     // Inherent: Moderate to High (4)
  [3, 3, 4, 5, 5],     // Inherent: High (5)
];

// Fungsi untuk mendapatkan skor (1-5) berdasarkan nilai (0-5)
const getScoreFromValue = (value) => {
  if (value === undefined || value === null || isNaN(value) || value === 0) {
    return 0;
  }
  
  if (value >= 0 && value <= 1.49) return 1;      // Low / Strong
  if (value > 1.49 && value <= 2.49) return 2;    // Low To Moderate / Satisfactory
  if (value > 2.49 && value <= 3.49) return 3;    // Moderate / Fair
  if (value > 3.49 && value <= 4.49) return 4;    // Moderate To High / Marginal
  if (value > 4.49 && value <= 5) return 5;       // High / Unsatisfactory
  return 0;
};

// Fungsi untuk mendapatkan NET RISK INDICATOR
const getNetRiskIndicator = (value, hasInherentData, hasKpmrData) => {
  // Jika tidak ada data inherent DAN tidak ada data kpmr
  if (!hasInherentData && !hasKpmrData) {
    return { 
      label: "Data tidak Ditemukan", 
      color: "#9CA3AF", 
      value: 0, 
      score: 0, 
      isNoData: true,
      isPartialData: false
    };
  }
  
  // Jika hanya ada satu data (inherent ATAU kpmr)
  if ((hasInherentData && !hasKpmrData) || (!hasInherentData && hasKpmrData)) {
    return { 
      label: "Data belum Lengkap", 
      color: "#D1D5DB", // Abu-abu yang lebih terang
      value: 0, 
      score: 0, 
      isNoData: false,
      isPartialData: true
    };
  }
  
  // Jika kedua data ada
  if (value === undefined || value === null || isNaN(value) || value === 0) {
    return { 
      label: "Low", // Default jika ada data tapi value 0
      color: "#2ECC71", 
      value: 0, 
      score: 1, 
      isNoData: false,
      isPartialData: false
    };
  }
  
  // Tentukan indikator berdasarkan nilai
  if (value >= 0 && value <= 1.49) return { 
    label: "Low", 
    color: "#2ECC71", 
    value: value, 
    score: 1, 
    isNoData: false,
    isPartialData: false
  };
  if (value > 1.49 && value <= 2.49) return { 
    label: "Low to Moderate", 
    color: "#A3E635", 
    value: value, 
    score: 2, 
    isNoData: false,
    isPartialData: false
  };
  if (value > 2.49 && value <= 3.49) return { 
    label: "Moderate", 
    color: "#FACC15", 
    value: value, 
    score: 3, 
    isNoData: false,
    isPartialData: false
  };
  if (value > 3.49 && value <= 4.49) return { 
    label: "Moderate to High", 
    color: "#F97316", 
    value: value, 
    score: 4, 
    isNoData: false,
    isPartialData: false
  };
  if (value > 4.49 && value <= 5) return { 
    label: "High", 
    color: "#FF0000", 
    value: value, 
    score: 5, 
    isNoData: false,
    isPartialData: false
  };
  
  return { 
    label: "Data belum Lengkap", 
    color: "#D1D5DB", 
    value: 0, 
    score: 0, 
    isNoData: false,
    isPartialData: true
  };
};

// Fungsi untuk mendapatkan risk indicator berdasarkan skor dan tipe
const getRiskIndicator = (score, type = "inherent", hasData = true) => {
  if (!hasData || score === undefined || score === null || score === 0) {
    return {
      label: "Data tidak Ditemukan",
      value: "no-data",
      color: "#9CA3AF",
      min: 0,
      max: 0,
      score: 0,
      isNoData: true,
      isPartialData: false
    };
  }
  
  const indicators = type === "kpmr" ? KPMR_RISK_INDICATORS : INHERENT_RISK_INDICATORS;
  
  for (const indicator of indicators) {
    if (score >= indicator.min && score <= indicator.max) {
      return { 
        ...indicator, 
        value: Number(score),
        isNoData: false,
        isPartialData: false
      };
    }
  }
  
  const defaultIndicator = type === "kpmr" 
    ? KPMR_RISK_INDICATORS[KPMR_RISK_INDICATORS.length - 1] 
    : INHERENT_RISK_INDICATORS[INHERENT_RISK_INDICATORS.length - 1];
  
  return { 
    ...defaultIndicator, 
    value: Number(score),
    isNoData: false,
    isPartialData: false
  };
};

// Fungsi untuk mendapatkan nilai NET RISK dari matriks
const getNetRiskFromMatrix = (inherentValue, kpmrValue, hasInherentData, hasKpmrData) => {
  // Jika tidak ada kedua data
  if (!hasInherentData && !hasKpmrData) {
    return 0;
  }
  
  // Jika hanya ada satu data
  if ((hasInherentData && !hasKpmrData) || (!hasInherentData && hasKpmrData)) {
    return 0; // Return 0 untuk partial data
  }
  
  // Konversi nilai ke score (1-5) berdasarkan range
  const inherentScore = getScoreFromValue(inherentValue);
  const kpmrScore = getScoreFromValue(kpmrValue);
  
  // Jika salah satu score 0, kembalikan 0
  if (inherentScore === 0 || kpmrScore === 0) {
    return 0;
  }
  
  const inherentIndex = inherentScore - 1;
  const kpmrIndex = kpmrScore - 1;
  
  if (inherentIndex >= 0 && inherentIndex < RISK_MATRIX.length && 
      kpmrIndex >= 0 && kpmrIndex < RISK_MATRIX[0].length) {
    const matrixScore = RISK_MATRIX[inherentIndex][kpmrIndex];
    
    switch(matrixScore) {
      case 1: return 0.75;
      case 2: return 2.0;
      case 3: return 3.0;
      case 4: return 4.0;
      case 5: return 4.75;
      default: return 0;
    }
  }
  
  return 0;
};

function useGlobalSummaryAdapter() {
  const { year, activeQuarter } = useHeaderStore();
  const [summaryData, setSummaryData] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      const data = [];

      CATEGORIES.forEach((category) => {
        const derivedData = loadDerived({
          categoryId: category.id,
          year,
          quarter: activeQuarter,
        });

        const inherentSummary = typeof derivedData?.summary === "number" ? derivedData.summary : 0;
        const hasInherentData = inherentSummary !== 0;

        const kpmrRows = loadKpmr({
          categoryId: category.id,
          year,
        });

        let kpmrSummary = 0;
        let hasKpmrData = false;

        if (Array.isArray(kpmrRows) && kpmrRows.length > 0) {
          let total = 0;
          let count = 0;

          kpmrRows.forEach((aspek) => {
            aspek.pertanyaanList?.forEach((p) => {
              const v = p.skor?.[activeQuarter] ?? p.skor?.[activeQuarter.toUpperCase()];
              const num = Number(v);
              if (!isNaN(num) && num >= 1 && num <= 5) {
                total += num;
                count++;
                hasKpmrData = true;
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
          hasInherentData,
          hasKpmrData,
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

export default function RekapData2() {
  const { search } = useHeaderStore();
  const summaryPerHalaman = useGlobalSummaryAdapter();

  const filteredData = useMemo(() => {
    if (!search) return summaryPerHalaman;
    const s = search.toLowerCase();
    return summaryPerHalaman.filter((h) =>
      h.nama.toLowerCase().includes(s)
    );
  }, [search, summaryPerHalaman]);

  const tableData = useMemo(() => {
    return filteredData.map((item) => {
      const inherentSummary = item.inherentSummary || 0; 
      const kpmrSummary = item.kpmrSummary || 0; 
      const hasInherentData = item.hasInherentData;
      const hasKpmrData = item.hasKpmrData;
      
      const inherentIndicator = getRiskIndicator(inherentSummary, "inherent", hasInherentData);
      const kpmrIndicator = getRiskIndicator(kpmrSummary, "kpmr", hasKpmrData);
      
      const netRiskValue = getNetRiskFromMatrix(inherentSummary, kpmrSummary, hasInherentData, hasKpmrData);
      const netRiskIndicator = getNetRiskIndicator(netRiskValue, hasInherentData, hasKpmrData);
      
      return {
        ...item,
        inherentSummary,    
        kpmrSummary,      
        inherentIndicator,
        kpmrIndicator,
        netRiskValue,
        netRiskIndicator,
      };
    });
  }, [filteredData]);

  const peringkatKomposit = useMemo(() => {
    if (summaryPerHalaman.length === 0) { 
      return {
        inherentAvg: 0,
        kpmrAvg: 0,
        netRiskAvg: 0,
        inherentCount: 0,
        kpmrCount: 0,
        netRiskCount: 0,
        totalInherentData: 0,
        totalKpmrData: 0,
      };
    }

    let totalInherent = 0;
    let totalKpmr = 0;
    let totalNetRisk = 0;
    let inherentCount = 0;
    let kpmrCount = 0;
    let netRiskCount = 0;
    let totalInherentData = 0;
    let totalKpmrData = 0;

    summaryPerHalaman.forEach((item) => {
      const inherentSummary = item.inherentSummary || 0;
      const kpmrSummary = item.kpmrSummary || 0;
      const hasInherentData = item.hasInherentData;
      const hasKpmrData = item.hasKpmrData;
      
      const netRiskValue = getNetRiskFromMatrix(inherentSummary, kpmrSummary, hasInherentData, hasKpmrData);
      
      if (hasInherentData) {
        totalInherent += inherentSummary;
        inherentCount++;
        totalInherentData++;
      }
      
      if (hasKpmrData) {
        totalKpmr += kpmrSummary;
        kpmrCount++;
        totalKpmrData++;
      }
      
      if (netRiskValue > 0 && hasInherentData && hasKpmrData) {
        totalNetRisk += netRiskValue;
        netRiskCount++;
      }
    });

    const inherentAvg = inherentCount > 0 ? totalInherent / inherentCount : 0;
    const kpmrAvg = kpmrCount > 0 ? totalKpmr / kpmrCount : 0;
    const netRiskAvg = netRiskCount > 0 ? totalNetRisk / netRiskCount : 0;

    return {
      inherentAvg,
      kpmrAvg,
      netRiskAvg,
      inherentCount,
      kpmrCount,
      netRiskCount,
      totalInherentData,
      totalKpmrData,
    };
  }, [summaryPerHalaman]); 

  const footerDisplay = useMemo(() => {
    const inherentAvg = peringkatKomposit.inherentAvg;
    const kpmrAvg = peringkatKomposit.kpmrAvg;
    const netRiskAvg = peringkatKomposit.netRiskAvg;
    
    const hasInherentData = peringkatKomposit.totalInherentData > 0;
    const hasKpmrData = peringkatKomposit.totalKpmrData > 0;

    const inherentIndicator = getRiskIndicator(inherentAvg, "inherent", hasInherentData);
    const kpmrIndicator = getRiskIndicator(kpmrAvg, "kpmr", hasKpmrData);
    
    const netRiskFromMatrix = getNetRiskFromMatrix(inherentAvg, kpmrAvg, hasInherentData, hasKpmrData);
    const netRiskIndicator = getNetRiskIndicator(netRiskFromMatrix, hasInherentData, hasKpmrData);

    const inherentScoreForMatrix = inherentAvg > 0 ? getScoreFromValue(inherentAvg) : 0;
    const kpmrScoreForMatrix = kpmrAvg > 0 ? getScoreFromValue(kpmrAvg) : 0;

    return {
      inherentAvg,
      kpmrAvg,
      netRiskAvg: netRiskFromMatrix,
      inherentIndicator,
      kpmrIndicator,
      netRiskIndicator,
      inherentScoreForMatrix,
      kpmrScoreForMatrix,
      hasInherentData,
      hasKpmrData,
      hasNetRiskData: netRiskFromMatrix > 0,
    };
  }, [peringkatKomposit]);

  const IndicatorCell = ({ indicator, size = "normal" }) => {
  const safeIndicator = indicator || getRiskIndicator(0, "inherent", false);
  const textClass = size === "small" ? "text-sm" : "text-base";
  const paddingClass = size === "small" ? "px-3 py-2" : "px-4 py-2.5";
  
  const value = typeof safeIndicator.value === 'number' ? safeIndicator.value : 0;
  
  let displayText = "";
  if (safeIndicator.isPartialData) {
    displayText = "Data belum Lengkap";
  } else if (safeIndicator.isNoData) {
    displayText = "Data tidak Ditemukan";
  } else {
    // Ubah dari toFixed(1) menjadi pembulatan tanpa desimal
    displayText = Math.round(value);
  }
  
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div 
        className={`rounded-full ${paddingClass} font-bold ${textClass} w-full flex items-center justify-center whitespace-nowrap min-h-[40px] text-center ${
          safeIndicator.isNoData || safeIndicator.isPartialData ? "text-gray-700" : "text-black"
        }`}
        style={{ 
          backgroundColor: safeIndicator.color,
        }}
      >
        {displayText}
      </div>
    </div>
  );
};

const FooterIndicatorCell = ({ indicator, size = "normal" }) => {
  const safeIndicator = indicator || getRiskIndicator(0, "inherent", false);
  const textClass = size === "small" ? "text-sm" : "text-base";
  const paddingClass = size === "small" ? "px-3 py-2" : "px-4 py-2.5";
  
  const value = typeof safeIndicator.value === 'number' ? safeIndicator.value : 0;
  
  let displayText = "";
  if (safeIndicator.isPartialData) {
    displayText = "Data belum Lengkap";
  } else if (safeIndicator.isNoData) {
    displayText = "Data tidak Ditemukan";
  } else {
    // Ubah dari toFixed(1) menjadi pembulatan tanpa desimal
    displayText = Math.round(value);
  }
  
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div 
        className={`rounded-full ${paddingClass} font-bold ${textClass} w-full flex items-center justify-center whitespace-nowrap min-h-[40px] text-center ${
          safeIndicator.isNoData || safeIndicator.isPartialData ? "text-gray-700" : "text-black"
        }`}
        style={{ 
          backgroundColor: safeIndicator.color,
        }}
      >
        {displayText}
      </div>
    </div>
  );
};

  const RiskMatrix = ({ inherentScore, kpmrScore, hasInherentData, hasKpmrData }) => {
    const inherentIndex = inherentScore - 1;
    const kpmrIndex = kpmrScore - 1;
    const showPosition = hasInherentData && hasKpmrData;
    
    return (
      <div className="bg-white rounded-lg shadow border p-4 h-full">
        <div className="text-center mb-2">
          <h3 className="font-bold text-gray-700 text-lg">Tabel Peringkat Risiko</h3>
        </div>
        
        <div>
          <div>
            <h1 className="text-center">Kualitas Penerapan Manajemen Risiko</h1>
          </div>
          
          <div className="flex mb-4">
            <div style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)',
            }}>
              <h1 className="text-center">Inherent Risiko</h1>
            </div>
            <table className="w-full border-collapse table-fixed">
              <colgroup>
                <col style={{ width: "23%" }} /> 
                <col style={{ width: "23%" }} />
                <col style={{ width: "23%" }} />
                <col style={{ width: "23%"}} />
                <col style={{ width: "23%" }} />
                <col style={{ width: "23%" }} />
              </colgroup>
          
              <thead>
                <tr>
                  <th className="border border-black p-2 bg-blue-800 text-sm font-medium w-16"></th>
                  <th className="border border-black p-2 bg-blue-800 text-white text-center text-sm font-medium">Strong<br/>(1)</th>
                  <th className="border border-black p-2 bg-blue-800 text-white text-center text-[13px] font-bold">Satisfactory<br/>(2)</th>
                  <th className="border border-black p-2 bg-blue-800 text-white text-center text-sm font-medium">Fair<br/>(3)</th>
                  <th className="border border-black p-2 bg-blue-800 text-white text-center text-sm font-medium">Marginal<br/>(4)</th>
                  <th className="border border-black py-2 bg-blue-800 text-white text-center text-[12px] font-bold">Unsatisfactory<br/>(5)</th>
                </tr>
              </thead>
              <tbody>
                {RISK_MATRIX.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="border border-black h-[90px] bg-blue-800 text-white font-medium text-center text-sm">
                      <div className="w-full">
                        {rowIndex === 0 && "Low (1)"}
                        {rowIndex === 1 && "Low to Moderate (2)"}
                        {rowIndex === 2 && "Moderate (3)"}
                        {rowIndex === 3 && "Moderate to High (4)"}
                        {rowIndex === 4 && "High (5)"}
                      </div>
                    </td>
                    {row.map((cell, cellIndex) => {
                      const isActive = showPosition && rowIndex === inherentIndex && cellIndex === kpmrIndex;
                      let cellValue;
                      switch(cell) {
                        case 1: cellValue = 0.75; break;
                        case 2: cellValue = 2.0; break;
                        case 3: cellValue = 3.0; break;
                        case 4: cellValue = 4.0; break;
                        case 5: cellValue = 4.75; break;
                        default: cellValue = 3.0;
                      }
                      const cellIndicator = getNetRiskIndicator(cellValue, true, true);
                      
                      return (
                        <td 
                          key={cellIndex} 
                          className={`border border-black p-3 text-center font-bold text-lg relative ${isActive ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
                          style={{ backgroundColor: cellIndicator.color }}
                        >
                          {cell}
                          {isActive && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-15 h-15 rounded-full border-4 border-black bg-transparent"></div>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="space-y-2">
          {showPosition ? (
            <>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center">
                  <Circle className="h-5 w-5 stroke-4"/>
                </div>
                <span className="text-base font-semibold text-gray-950">
                  Posisi risiko saat ini (Inherent: {inherentScore}, KPMR: {kpmrScore})
                </span>
              </div>
              <div className="text-lg ml-7 font-semibold text-gray-950">
                <span className="font-semibold">Hasil Matriks:</span> {footerDisplay.netRiskIndicator.label} ({footerDisplay.netRiskAvg.toFixed(1)})
              </div>
            </>
          ) : (
            <div className="text-lg font-semibold text-gray-950 text-center p-4 bg-gray-100 rounded-lg">
              Data tidak cukup untuk menampilkan posisi risiko
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen p-4">
      <Header title="Rekap Data 2" />

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 mt-6">
        
        <div className="lg:col-span-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-blue-700 text-white">
              <div className="grid grid-cols-12 p-4 font-bold text-lg">
                <div className="col-span-3 flex items-center gap-2">
                  <span>JENIS RISIKO</span>
                </div>
                <div className="col-span-3 text-center">INHERENT</div>
                <div className="col-span-3 text-center">KPMR</div>
                <div className="col-span-3 text-center">NET RISK</div>
              </div>
            </div>

            <div className="divide-y max-h-[550px] overflow-y-auto">
              {tableData.map((item) => (
                <div key={item.id} className="grid grid-cols-12 p-3 gap-1 hover:bg-gray-50 transition-colors">
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      {item.Icon ? (
                        <item.Icon className="w-5 h-5 text-blue-600" />
                      ) : (
                        <FileText className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <span className="font-bold text-gray-800 text-lg">{item.nama}</span>
                  </div>

                  <div className="col-span-3 flex items-center justify-center">
                    <IndicatorCell indicator={item.inherentIndicator} />
                  </div>

                  <div className="col-span-3 flex items-center justify-center">
                    <IndicatorCell indicator={item.kpmrIndicator} />
                  </div>

                  <div className="col-span-3 flex items-center justify-center">
                    <IndicatorCell indicator={item.netRiskIndicator} />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-900 border-t">
              <div className="grid grid-cols-12 p-3 gap-9 text-white font-bold">
                <div className="col-span-3 text-white flex items-center ml-5 text-lg">
                  Skor Profil Risiko  
                </div>
                
                <div className="col-span-3 -ml-3 -mr-2 flex items-center justify-center">
                  <FooterIndicatorCell indicator={footerDisplay.inherentIndicator} size="normal"/>
                </div>
                
                <div className="col-span-3 -ml-6 mr-1 flex items-center justify-center">
                  <FooterIndicatorCell indicator={footerDisplay.kpmrIndicator} />
                </div>
                
                <div className="col-span-3 -ml-9 mr-4 flex items-center justify-center">
                  <FooterIndicatorCell indicator={footerDisplay.netRiskIndicator} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <RiskMatrix 
            inherentScore={footerDisplay.inherentScoreForMatrix} 
            kpmrScore={footerDisplay.kpmrScoreForMatrix}
            hasInherentData={footerDisplay.hasInherentData}
            hasKpmrData={footerDisplay.hasKpmrData}
          />
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
                  {i.label} ({i.min.toFixed(2)}–{i.max.toFixed(2)})
                </span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 text-base font-semibold">
            </div>
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
                  {i.label} ({i.min.toFixed(2)}–{i.max.toFixed(2)})
                </span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 text-base font-semibold">
              
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-base font-semibold text-gray-950">
              NET RISK :
            </span>
            {INHERENT_RISK_INDICATORS.map((i, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-base font-semibold">
                <span
                  className="w-5 h-5 rounded border"
                  style={{ backgroundColor: i.color }}
                />
                <span className="text-gray-950">
                  {i.label} ({i.min.toFixed(2)}–{i.max.toFixed(2)})
                </span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 text-base font-semibold">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}