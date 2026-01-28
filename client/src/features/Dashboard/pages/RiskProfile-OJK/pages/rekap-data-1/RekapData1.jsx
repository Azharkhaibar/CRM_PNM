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
  { label: "Low", value: "low", color: "#2ECC71", min: 0, max: 1.49 },
  { label: "Low To Moderate", value: "lowToModerate", color: "#A3E635", min: 1.50, max: 2.49 },
  { label: "Moderate", value: "moderate", color: "#FACC15", min: 2.50, max: 3.49 },
  { label: "Moderate To High", value: "moderateToHigh", color: "#F97316", min: 3.50, max: 4.49 },
  { label: "High", value: "high", color: "#FF0000", min: 4.50, max: 5 },
];

// KPMR Risk Indicators (yang baru)
const KPMR_RISK_INDICATORS = [
  { label: "Strong", value: "strong", color: "#2ECC71", min: 0, max: 1.49 },
  { label: "Satisfactory", value: "satisfactory", color: "#A3E635", min: 1.50, max: 2.49 },
  { label: "Fair", value: "fair", color: "#FACC15", min: 2.50, max: 3.49 },
  { label: "Marginal", value: "marginal", color: "#F97316", min: 3.50, max: 4.49 },
  { label: "Unsatisfactory", value: "unsatisfactory", color: "#FF0000", min: 4.50, max: 5 },
];


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


const getRiskIndicator = (score, type = "inherent") => {
  if (score === undefined || score === null) {
    return type === "kpmr" 
      ? KPMR_RISK_INDICATORS[KPMR_RISK_INDICATORS.length - 1] 
      : INHERENT_RISK_INDICATORS[INHERENT_RISK_INDICATORS.length - 1];
  }
  
  const indicators = type === "kpmr" ? KPMR_RISK_INDICATORS : INHERENT_RISK_INDICATORS;
  
  for (const indicator of indicators) {
    if (score >= indicator.min && score <= indicator.max) {
      return indicator;
    }
  }
  
  return type === "kpmr" 
    ? KPMR_RISK_INDICATORS[KPMR_RISK_INDICATORS.length - 1] 
    : INHERENT_RISK_INDICATORS[INHERENT_RISK_INDICATORS.length - 1];
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
      if (category.id === "operasional" || category.id === "strategis-regulatory") {
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
    // ... logika yang sama seperti sebelumnya untuk body table
    const bvt = 100; 
    let bhz;
    if (bhzValues[item.id] !== undefined) {
      bhz = bhzValues[item.id];
    } else {
      bhz = (item.id === "operasional" || item.id === "strategis-regulatory") ? 20 : 10;
    }
    
    const inherentSummary = item.inherentSummary || 0; 
    const kpmrSummary = item.kpmrSummary || 0; 
    
    const inherentSkor = inherentSummary * (bvt / 100);
    const kpmrSkor = kpmrSummary;
    const kompositSkor = (inherentSkor + kpmrSkor) / 2;
    
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
    };
  });
}, [filteredData, bhzValues]);

const peringkatKomposit = useMemo(() => {
  if (summaryPerHalaman.length === 0) { 
    return {
      inherentValue: 0,
      kpmrValue: 0,
      ptkValue: 0,
    };
  }

  let totalInherentValue = 0;
  let totalKpmrValue = 0;

  // Hitung dari semua data, bukan yang sudah difilter
  summaryPerHalaman.forEach((item) => {
    const bvt = 100;
    const bhz = bhzValues[item.id] !== undefined 
      ? bhzValues[item.id] 
      : (item.id === "operasional" || item.id === "strategis-regulatory") 
        ? 20 
        : 10;
    
    const inherentSkor = (item.inherentSummary || 0) * (bvt / 100);
    const kpmrSkor = item.kpmrSummary || 0;
    
    const inherentValueForFooter = inherentSkor * (bhz / 100);
    const kpmrValueForFooter = kpmrSkor * (bhz / 100);
    
    totalInherentValue += inherentValueForFooter;
    totalKpmrValue += kpmrValueForFooter;
  });

  const ptkValue = (totalInherentValue + totalKpmrValue) / 2;

  return {
    inherentValue: totalInherentValue,
    kpmrValue: totalKpmrValue,
    ptkValue: ptkValue,
  };
}, [summaryPerHalaman, bhzValues]);

const footerDisplay = useMemo(() => {
  const inherentDisplay = peringkatKomposit.inherentValue;
  const kpmrDisplay = peringkatKomposit.kpmrValue;
  const ptkDisplay = peringkatKomposit.ptkValue;

  return {
    inherentDisplay: inherentDisplay,
    kpmrDisplay: kpmrDisplay,
    ptkDisplay: ptkDisplay,
    inherentIndicator: getRiskIndicator(inherentDisplay, "inherent"),
    kpmrIndicator: getRiskIndicator(kpmrDisplay, "kpmr"),
    ptkIndicator: getRiskIndicator(ptkDisplay, "inherent"),
  };
}, [peringkatKomposit]);

  const handleBhzChange = (id, value) => {
    setBhzValues(prev => ({
      ...prev,
      [id]: Math.min(100, Math.max(0, Number(value) || 0))
    }));
  };

  const ScoreCell = ({ value, indicator, whiteText = false }) => {
    const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
    const formattedValue = safeValue.toFixed(2);
    const safeIndicator = indicator || getRiskIndicator(safeValue, "inherent");
    
    return (
      <div className="flex flex-col items-center justify-center space-y-2">
        {/* Nilai angka */}
        <div className={`text-xl font-bold min-w-[80px] text-center ${whiteText ? 'text-white' : 'text-gray-800'}`}>
          {formattedValue}
        </div>
        
        {/* Indikator */}
        <div 
          className={`rounded-full px-4 py-2 font-bold text-base w-[240px] flex items-center justify-center whitespace-nowrap ${whiteText ? 'text-black' : (safeIndicator.value === "high" || safeIndicator.value === "unsatisfactory" ? "text-black" : "text-black")}`}
          style={{ 
            backgroundColor: safeIndicator.color,
          }}
        >
          {safeIndicator.label}
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
    <div className={`w-20 h-20 rounded-lg flex items-center justify-center shadow ${getIndicatorColor(getIndicatorNumber(footerDisplay?.inherentDisplay || 0))}`}>
      <span className="text-2xl font-bold text-black">
        {getIndicatorNumber(footerDisplay?.inherentDisplay || 0)}
      </span>
    </div>

    {/* Konten tengah */}
    <div className="flex-1 text-center">
      <p className="text-lg font-semibold border-b border-black inline-block px-3 pb-1">
        Komposit Inherent : {" "}
        {(Number(footerDisplay?.inherentDisplay) || 0).toFixed(2)}
      </p>
      <p className="text-lg font-bold mt-1">
        {footerDisplay?.inherentIndicator?.label}
      </p>
    </div>
  </div>

  {/* CARD 2 */}
  <div className="bg-white shadow-md border border-gray-300 w-[50%] p-6 rounded-xl flex items-center gap-5">
    {/* Kotak angka kiri dengan indikator dinamis */}
    <div className={`w-20 h-20 rounded-lg flex items-center justify-center shadow ${getIndicatorColor(getIndicatorNumber(footerDisplay?.kpmrDisplay || 0))}`}>
      <span className="text-2xl font-bold text-black">
        {getIndicatorNumber(footerDisplay?.kpmrDisplay || 0)}
      </span>
    </div>

    <div className="flex-1 text-center">
      <p className="text-lg font-semibold border-b border-black inline-block px-3 pb-1">
        KPMR Komposit : {" "}
        {(Number(footerDisplay?.kpmrDisplay) || 0).toFixed(2)}
      </p>
      <p className="text-lg font-bold mt-1">
        {footerDisplay?.kpmrIndicator?.label}
      </p>
    </div>
  </div>

  {/* CARD 3 */}
  <div className="bg-white shadow-md border border-gray-300 w-[50%] p-6 rounded-xl flex items-center gap-5">
    {/* Kotak angka kiri dengan indikator dinamis */}
    <div className={`w-20 h-20 rounded-lg flex items-center justify-center shadow ${getIndicatorColor(getIndicatorNumber(footerDisplay?.ptkDisplay || 0))}`}>
      <span className="text-2xl font-bold text-black">
        {getIndicatorNumber(footerDisplay?.ptkDisplay || 0)}
      </span>
    </div>

    <div className="flex-1 text-center">
      <p className="text-lg font-semibold border-b border-black inline-block px-3 pb-1">
        Komposit : {" "}
        {(Number(footerDisplay?.ptkDisplay) || 0).toFixed(2)}
      </p>
      <p className="text-lg font-bold mt-1">
        {footerDisplay?.ptkIndicator?.label}
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
    {tableData.map((item) => (
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
          />
        </div>

        {/* KPMR */}
        <div className="col-span-2 flex items-center justify-center">
          <ScoreCell 
            value={item.kpmrSkor} 
            indicator={item.kpmrIndicator} 
          />
        </div>

        {/* Peringkat Tingkat Komposit */}
        <div className="col-span-2 flex items-center justify-center">
          <ScoreCell 
            value={item.kompositSkor} 
            indicator={item.kompositIndicator} 
          />
        </div>
      </div>
    ))}
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
      <div className="col-span-2 mr-8  flex items-center justify-center">
        <ScoreCell 
          value={footerDisplay.inherentDisplay} 
          indicator={footerDisplay.inherentIndicator}
          whiteText={true} 
        />
      </div>
      
      {/* KPMR Footer */}
      <div className="col-span-2 mr-8  flex items-center justify-center">
        <ScoreCell 
          value={footerDisplay.kpmrDisplay} 
          indicator={footerDisplay.kpmrIndicator}
          whiteText={true}  
        />
      </div>
      
      {/* PTK Footer */}
      <div className="col-span-2 mr-8 flex items-center justify-center">
        <ScoreCell 
          value={footerDisplay.ptkDisplay} 
          indicator={footerDisplay.ptkIndicator}
          whiteText={true}
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