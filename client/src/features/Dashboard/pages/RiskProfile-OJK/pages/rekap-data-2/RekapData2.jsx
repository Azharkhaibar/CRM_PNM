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
  // Strong (1), Satisfactory (2), Fair (3), Marginal (4), Unsatisfactory (5)
  [1, 1, 2, 3, 3],     // Low (1)
  [1, 2, 2, 3, 4],     // Low to Moderate (2) - DIUBAH
  [2, 2, 3, 4, 4],     // Moderate (3)
  [2, 3, 4, 4, 5],     // Moderate to High (4)
  [3, 3, 4, 5, 5],     // High (5)
];


const getIndicatorNumber = (score) => {
  if (score === undefined || score === null || isNaN(score)) {
    return 5; 
  }
  
  if (score >= 0 && score <= 1.5) return 1;      // Low
  if (score > 1.5 && score <= 2.5) return 2;     // Low To Moderate
  if (score > 2.5 && score <= 3.5) return 3;     // Moderate
  if (score > 3.5 && score <= 4.5) return 4;     // Moderate To High
  return 5;                                       // High
};

// Fungsi untuk mendapatkan indikator berdasarkan nilai matriks
const getMatrixIndicator = (matrixValue) => {
  if (matrixValue <= 1.5) return { label: "Low", color: "#2ECC71", value: matrixValue, score: 1 };
  if (matrixValue <= 2.5) return { label: "Low to Moderate", color: "#A3E635", value: matrixValue, score: 2 };
  if (matrixValue <= 3.5) return { label: "Moderate", color: "#FACC15", value: matrixValue, score: 3 };
  if (matrixValue <= 4.5) return { label: "Moderate to High", color: "#F97316", value: matrixValue, score: 4 };
  return { label: "High", color: "#FF0000", value: matrixValue, score: 5 };
};

// Fungsi untuk mendapatkan risk indicator berdasarkan skor dan tipe
const getRiskIndicator = (score, type = "inherent") => {
  if (score === undefined || score === null) {
    return type === "kpmr" 
      ? { ...KPMR_RISK_INDICATORS[KPMR_RISK_INDICATORS.length - 1], score: 5 } 
      : { ...INHERENT_RISK_INDICATORS[INHERENT_RISK_INDICATORS.length - 1], score: 5 };
  }
  
  const indicators = type === "kpmr" ? KPMR_RISK_INDICATORS : INHERENT_RISK_INDICATORS;
  
  for (const indicator of indicators) {
    if (score >= indicator.min && score <= indicator.max) {
      return indicator; // indicator sudah memiliki property score
    }
  }
  
  return type === "kpmr" 
    ? { ...KPMR_RISK_INDICATORS[KPMR_RISK_INDICATORS.length - 1], score: 5 } 
    : { ...INHERENT_RISK_INDICATORS[INHERENT_RISK_INDICATORS.length - 1], score: 5 };
};

// Fungsi untuk mendapatkan nilai dari matriks risiko
const getMatrixValue = (inherentScore, kpmrScore) => {
  const inherentIndex = Math.floor(Math.min(Math.max(inherentScore, 1), 5)) - 1;
  const kpmrIndex = Math.floor(Math.min(Math.max(kpmrScore, 1), 5)) - 1;
  
  if (inherentIndex >= 0 && inherentIndex < RISK_MATRIX.length && 
      kpmrIndex >= 0 && kpmrIndex < RISK_MATRIX[0].length) {
    return RISK_MATRIX[inherentIndex][kpmrIndex];
  }
  
  return 3;
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

export default function RekapData2() {
  const { search } = useHeaderStore();
  const summaryPerHalaman = useGlobalSummaryAdapter();

  // Filter data berdasarkan search
  const filteredData = useMemo(() => {
    if (!search) return summaryPerHalaman;
    const s = search.toLowerCase();
    return summaryPerHalaman.filter((h) =>
      h.nama.toLowerCase().includes(s)
    );
  }, [search, summaryPerHalaman]);

  // Fungsi untuk menghitung data setiap baris
  const tableData = useMemo(() => {
    return filteredData.map((item) => {
      const inherentSummary = item.inherentSummary || 0; 
      const kpmrSummary = item.kpmrSummary || 0; 
      
      // Risk indicators untuk masing-masing kolom
      const inherentIndicator = getRiskIndicator(inherentSummary, "inherent");
      const kpmrIndicator = getRiskIndicator(kpmrSummary, "kpmr");
      
      // Hitung nilai dari matriks risiko
      const matrixValue = getMatrixValue(inherentIndicator.score, kpmrIndicator.score);
      const matrixIndicator = getMatrixIndicator(matrixValue);
      
      return {
        ...item,
        inherentSummary,    
        kpmrSummary,      
        inherentIndicator,
        kpmrIndicator,
        matrixValue,
        matrixIndicator,
      };
    });
  }, [filteredData]);

  const peringkatKomposit = useMemo(() => {
    if (summaryPerHalaman.length === 0) { 
      return {
        inherentValue: 0,
        kpmrValue: 0,
        matrixValue: 0,
      };
    }

    let totalInherentValue = 0;
    let totalKpmrValue = 0;
    let totalMatrixValue = 0;
    let count = 0;

    // Hitung dari semua data, bukan yang sudah difilter
    summaryPerHalaman.forEach((item) => {
      const inherentSummary = item.inherentSummary || 0;
      const kpmrSummary = item.kpmrSummary || 0;
      
      const inherentIndicator = getRiskIndicator(inherentSummary, "inherent");
      const kpmrIndicator = getRiskIndicator(kpmrSummary, "kpmr");
      
      const matrixValue = getMatrixValue(inherentIndicator.score, kpmrIndicator.score);
      
      totalInherentValue += inherentSummary;
      totalKpmrValue += kpmrSummary;
      totalMatrixValue += matrixValue;
      count++;
    });

    const avgInherent = totalInherentValue / count;
    const avgKpmr = totalKpmrValue / count;
    const avgMatrix = totalMatrixValue / count;

    return {
      inherentValue: avgInherent,
      kpmrValue: avgKpmr,
      matrixValue: avgMatrix,
    };
  }, [summaryPerHalaman]); 

  const footerDisplay = useMemo(() => {
    const inherentDisplay = peringkatKomposit.inherentValue;
    const kpmrDisplay = peringkatKomposit.kpmrValue;
    const matrixDisplay = peringkatKomposit.matrixValue;

    const inherentIndicator = getRiskIndicator(inherentDisplay, "inherent");
    const kpmrIndicator = getRiskIndicator(kpmrDisplay, "kpmr");
    const matrixIndicator = getMatrixIndicator(matrixDisplay);

    return {
      inherentDisplay: inherentDisplay,
      kpmrDisplay: kpmrDisplay,
      matrixDisplay: matrixDisplay,
      inherentIndicator,
      kpmrIndicator,
      matrixIndicator,
      inherentScoreForMatrix: Math.floor(Math.min(Math.max(inherentIndicator.score, 1), 5)),
      kpmrScoreForMatrix: Math.floor(Math.min(Math.max(kpmrIndicator.score, 1), 5)),
    };
  }, [peringkatKomposit]);

const IndicatorCell = ({ indicator, size = "normal" }) => {
  const safeIndicator = indicator || getRiskIndicator(0, "inherent");
  const widthClass = size === "normal" ? "w-[220px]" : "w-[120px]";
  const textClass = size === "small" ? "text-sm" : "text-base";
  const paddingClass = size === "small" ? "px-3 py-2" : "px-4 py-2.5";

  const score = safeIndicator.score || 5;
  
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Indikator */}
      <div 
        className={`rounded-full ${paddingClass} font-bold ${textClass} ${widthClass} flex items-center justify-center whitespace-nowrap min-h-[40px] ${score >= 4 ? "text-black" : "text-black"}`}
        style={{ 
          backgroundColor: safeIndicator.color,
        }}
      >
        {score}
      </div>
    </div>
  );
};

const FooterIndicatorCell = ({ indicator, size = "normal" }) => {
  const safeIndicator = indicator || getRiskIndicator(0, "inherent");
  const widthClass = size === "large" ? "w-[120px]" : "w-[220px]";
  const textClass = size === "small" ? "text-sm" : "text-base";
  const paddingClass = size === "small" ? "px-3 py-2" : "px-4 py-2.5";
  
  // Ambil score dari indicator (1-5)
  const score = safeIndicator.score || 5;
  
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Indikator */}
      <div 
        className={`rounded-full ${paddingClass} font-bold ${textClass} ${widthClass} flex items-center justify-center whitespace-nowrap text-black min-h-[40px]`}
        style={{ 
          backgroundColor: safeIndicator.color,
        }}
      >
        {score}
      </div>
    </div>
  );
};

  // Komponen Matriks Risiko
  const RiskMatrix = ({ inherentScore, kpmrScore }) => {
    const inherentIndex = inherentScore - 1;
    const kpmrIndex = kpmrScore - 1;
    
    return (
      <div className="bg-white rounded-lg shadow border p-4 h-full">
        <div className="text-center mb-2">
          <h3 className="font-bold text-gray-700 text-lg ">Table Matrix Inherent Dan KPMR</h3>
        </div>
        
        <div className="">
        <div>
            <h1 className="text-center">Kualitas Penerapan Manajemen Risiko</h1>
        </div>
        
         <div className="flex mb-4">
         <div   style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            transform: 'rotate(180deg)',
          }}>
            <h1 className="text-center">Inherent Risiko</h1>
        </div>
             <table className="w-full border-collapse table-fixed">
              <colgroup>
                <col style={{ width: "20%" }} /> 
                <col style={{ width: "23%" }} />
                <col style={{ width: "23%" }} />
                <col style={{ width: "23%"}} />
                <col style={{ width: "23%" }} />
                <col style={{ width: "23%" }} />
              </colgroup>
          
            <thead>
            

              <tr>
                <th className="border border-black p-2 bg-blue-800 text-sm font-medium w-16"></th>
                <th className="border border-black p-2 bg-blue-800 text-white text-center text-sm font-medium">Strong<br/>
                (1)</th>
                <th className="border border-black p-2 bg-blue-800 text-white text-center text-[13px] font-bold">Satisfactory<br/>
                (2)</th>
                <th className="border border-black p-2 bg-blue-800 text-white text-center text-sm font-medium">Fair<br/>
                (3)</th>
                <th className="border border-black p-2 bg-blue-800 text-white text-center text-sm font-medium">Marginal<br/>
                (4)</th>
                <th className="border border-black py-2 bg-blue-800 text-white text-center text-[12px] font-bold">Unsatisfactory<br/>
                (5)</th>
              </tr>

            </thead>
            <tbody>
            
            
              {RISK_MATRIX.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="border border-black  h-[70px] bg-blue-800 text-white font-medium text-center text-sm">
                    {rowIndex === 0 && "Low (1)"}
                    {rowIndex === 1 && "Low to Moderate (2)"}
                    {rowIndex === 2 && "Moderate (3)"}
                    {rowIndex === 3 && "Moderate to High (4)"}
                    {rowIndex === 4 && "High (5)"}
                  </td>
                  {row.map((cell, cellIndex) => {
                    const isActive = rowIndex === inherentIndex && cellIndex === kpmrIndex;
                    const cellIndicator = getMatrixIndicator(cell);
                    
                    return (
                        
                      <td 
                        key={cellIndex} 
                        className={`border border-black p-3 text-center font-bold text-lg relative ${isActive ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
                        style={{ backgroundColor: cellIndicator.color }}
                      >
                        {cell}
                        {isActive && (
                          <div className="absolute top-2 right-7 w-13 h-13 rounded-full border-4 border-black bg-transparent" >

                            
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
          <div className="flex items-center gap-2">
            <div className=" flex items-center justify-center">
              <Circle className="h-5 w-5 stroke-4"/>
            </div>
            <span className="text-base font-semibold text-gray-950">
              Posisi risiko saat ini (Inherent: {footerDisplay.inherentScoreForMatrix}, KPMR: {footerDisplay.kpmrScoreForMatrix})
            </span>
          </div>
          <div className="text-lg ml-7 font-semibold text-gray-950">
            <span className="font-semibold ">Hasil Matriks:</span> {footerDisplay.matrixIndicator.label} ({footerDisplay.matrixDisplay.toFixed(1)})
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen p-4">
      <Header title="Rekap Data 2" />

      {/* Layout utama dengan grid */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 mt-6">
        
        {/* Tabel  */}
        <div className="lg:col-span-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Tabel Header - SEMUA COL-SPAN 3 */}
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

            {/* Tabel Body dengan scroll */}
            <div className="divide-y max-h-[450px] overflow-y-auto">

              {tableData.map((item) => (
                <div key={item.id} className="grid grid-cols-12 p-3 hover:bg-gray-50 transition-colors">
                  {/* Jenis Risiko dengan Icon */}
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

                  {/* Inherent */}
                  <div className="col-span-3 flex items-center justify-center">
                    <IndicatorCell indicator={item.inherentIndicator}  />
                  </div>

                  {/* KPMR */}
                  <div className="col-span-3 flex items-center justify-center">
                    <IndicatorCell indicator={item.kpmrIndicator}  />
                  </div>

                  {/* Peringkat Tingkat Komposit */}
                  <div className="col-span-3 flex items-center justify-center">
                    <IndicatorCell indicator={item.matrixIndicator}  />
                  </div>
                </div>
              ))}
            </div>

            {/* Tabel Footer */}
             <div className="bg-blue-900 border-t">
              <div className="grid grid-cols-12 p-3 text-white font-bold">
                <div className="col-span-3 text-white flex items-center ml-5 text-lg">
                  Skor Profil Risiko  
                </div>
                
                {/* Inherent Footer */}
                <div className="col-span-3 -ml-3 flex items-center justify-center">
                  <FooterIndicatorCell indicator={footerDisplay.inherentIndicator} size="normal"/>
                </div>
                
                {/* KPMR Footer */}
                <div className="col-span-3 -ml-5 flex items-center justify-center">
                  <FooterIndicatorCell indicator={footerDisplay.kpmrIndicator} />
                </div>
                
                {/* PTK Footer */}
                <div className="col-span-3 -ml-8 flex items-center justify-center">
                  <FooterIndicatorCell indicator={footerDisplay.matrixIndicator} />
                </div>
              </div>
            </div>
           
          </div>
        </div>

        {/* Matriks Risiko */}
        <div className="lg:col-span-4">
          <RiskMatrix 
            inherentScore={footerDisplay.inherentScoreForMatrix} 
            kpmrScore={footerDisplay.kpmrScoreForMatrix} 
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
          </div>
        </div>
      </div>
    </div>
  );
}