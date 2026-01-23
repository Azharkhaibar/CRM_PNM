// PeringkatKomposit.jsx
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

// Fungsi untuk mendapatkan angka indikator berdasarkan skor
const getIndicatorNumber = (score) => {
  if (score === undefined || score === null || isNaN(score)) {
    return 5; // Default ke angka 5 jika tidak valid
  }
  
  if (score >= 0 && score <= 1.5) return 1;      // Low/Strong
  if (score > 1.5 && score <= 2.5) return 2;     // Low To Moderate/Satisfactory
  if (score > 2.5 && score <= 3.5) return 3;     // Moderate/Fair
  if (score > 3.5 && score <= 4.5) return 4;     // Moderate To High/Marginal
  return 5;                                       // High/Unsatisfactory
};

// INHERENT Risk Indicators - dengan score property
const INHERENT_RISK_INDICATORS = [
  { label: "Low", value: "low", color: "#2ECC71", min: 0, max: 1.5, score: 1 },
  { label: "Low To Moderate", value: "lowToModerate", color: "#A3E635", min: 1.51, max: 2.5, score: 2 },
  { label: "Moderate", value: "moderate", color: "#FACC15", min: 2.51, max: 3.5, score: 3 },
  { label: "Moderate To High", value: "moderateToHigh", color: "#F97316", min: 3.51, max: 4.5, score: 4 },
  { label: "High", value: "high", color: "#FF0000", min: 4.51, max: 5, score: 5 },
];

// KPMR Risk Indicators - dengan score property
const KPMR_RISK_INDICATORS = [
  { label: "Strong", value: "strong", color: "#2ECC71", min: 0, max: 1.5, score: 1 },
  { label: "Satisfactory", value: "satisfactory", color: "#A3E635", min: 1.51, max: 2.5, score: 2 },
  { label: "Fair", value: "fair", color: "#FACC15", min: 2.51, max: 3.5, score: 3 },
  { label: "Marginal", value: "marginal", color: "#F97316", min: 3.51, max: 4.5, score: 4 },
  { label: "Unsatisfactory", value: "unsatisfactory", color: "#FF0000", min: 4.51, max: 5, score: 5 },
];

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
      return indicator;
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

        const inherentSummary = typeof derivedData?.summary === "number"
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
              const v = p.skor?.[activeQuarter] ?? p.skor?.[activeQuarter.toUpperCase()];
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
    return () => window.removeEventListener("risk-data-updated", handleUpdate);
  }, [year, activeQuarter]);

  return summaryData;
}

export default function PeringkatKomposit() {
  const { search } = useHeaderStore();
  const summaryPerHalaman = useGlobalSummaryAdapter();

  const [bhzValues, setBhzValues] = useState(() => {
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
      const bvt = 100;
      let bhz;
      
      if (bhzValues[item.id] !== undefined) {
        bhz = bhzValues[item.id];
      } else {
        bhz = (item.id === "operasional" || item.id === "strategis-regulatory") ? 20 : 10;
      }
      
      const inherentSummary = item.inherentSummary || 0;
      const kpmrSummary = item.kpmrSummary || 0;
      
      // Inherent Skor = Summary inherent × BVt(100%)
      const inherentSkor = inherentSummary * (bvt / 100);
      
      // KPMR Skor = Summary kpmr
      const kpmrSkor = kpmrSummary;
      
      // Nilai = Skor × (BHz / 100)
      const inherentNilai = inherentSkor * (bhz / 100);
      const kpmrNilai = kpmrSkor * (bhz / 100);
      
      // Risk indicators
      const inherentIndicator = getRiskIndicator(inherentSkor, "inherent");
      const kpmrIndicator = getRiskIndicator(kpmrSkor, "kpmr");
      
      return {
        ...item,
        bvt,
        bhz,
        inherentSummary,
        kpmrSummary,
        inherentSkor,
        kpmrSkor,
        inherentNilai,
        kpmrNilai,
        inherentIndicator,
        kpmrIndicator,
      };
    });
  }, [filteredData, bhzValues]);

  // Hitung total dan rata-rata untuk footer
  const footerData = useMemo(() => {
    if (tableData.length === 0) {
      return {
        totalBhz: 0,
        avgInherentNilai: 0,
        avgKpmrNilai: 0,
        IndicatoravgInherentNilai: getRiskIndicator(0, "inherent"),
        IndicatoravgkpmrNilai: getRiskIndicator(0, "kpmr"),
        // Tetap simpan yang lama untuk kompatibilitas
        inherentIndicator: getRiskIndicator(0, "inherent"),
        kpmrIndicator: getRiskIndicator(0, "kpmr"),
      };
    }

    // Total BHz
    const totalBhz = tableData.reduce((sum, item) => sum + item.bhz, 0);
    
    // Rata-rata nilai
    const totalInherentNilai = tableData.reduce((sum, item) => sum + item.inherentNilai, 0);
    const totalKpmrNilai = tableData.reduce((sum, item) => sum + item.kpmrNilai, 0);
    
    const avgInherentNilai = totalInherentNilai / tableData.length;
    const avgKpmrNilai = totalKpmrNilai / tableData.length;
    
    // Hitung indicator berdasarkan nilai rata-rata
    const IndicatoravgInherentNilai = getRiskIndicator(avgInherentNilai, "inherent");
    const IndicatoravgkpmrNilai = getRiskIndicator(avgKpmrNilai, "kpmr");
    
    return {
      totalBhz,
      avgInherentNilai,
      avgKpmrNilai,
      IndicatoravgInherentNilai,
      IndicatoravgkpmrNilai,
      // Tetap simpan yang lama untuk kompatibilitas
      inherentIndicator: IndicatoravgInherentNilai,
      kpmrIndicator: IndicatoravgkpmrNilai,
    };
  }, [tableData]);

  const handleBhzChange = (id, value) => {
    setBhzValues(prev => ({
      ...prev,
      [id]: Math.min(100, Math.max(0, Number(value) || 0))
    }));
  };

  const IndicatorCell = ({ indicator, whiteText = false }) => {
    const safeIndicator = indicator || getRiskIndicator(0, "inherent");
    const score = safeIndicator.score || 5;
    
    return (
      <div 
        className={`rounded-full px-3 py-2 font-bold text-lg w-full flex items-center justify-center whitespace-nowrap min-h-[40px] ${whiteText ? 'text-white' : (score >= 4 ? "text-white" : "text-black")}`}
        style={{ 
          backgroundColor: safeIndicator.color,
        }}
      >
        {score}
      </div>
    );
  };

  const ScoreCell = ({ value, whiteText = false }) => {
    const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
    const formattedValue = safeValue.toFixed(2);
    
    return (
      <div className={`font-semibold text-center ${whiteText ? 'text-white' : 'text-gray-800'}`}>
        {formattedValue}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen p-4">
      <Header title="Komposit" />

      {/* Tabel Container */}
      <div className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Tabel Header - SEDERHANA 1 BARIS */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="grid grid-cols-16 p-4 font-bold text-lg relative">
            {/* Garis pemisah antara INHERENT dan KPMR */}
            <div className="absolute left-[calc((4/16)*100%)] top-0 bottom-0 w-[2px] bg-white/50 z-20"></div>
            
            {/* Kolom 1: Jenis Risiko */}
            <div className="col-span-4 flex items-center justify-center  border-blue-500">
              <div className="flex gap-2 items-center">
                <FileText className="w-5 h-5 mb-1" />
                <span>Jenis Risiko</span>
              </div>
            </div>
            
            <div className="absolute left-[calc((5.9/16)*100%)] top-0 bottom-0 w-[2px] bg-white/50 z-20"></div>
            
            {/* Kolom 2: BHz */}
            <div className="col-span-2 flex items-center justify-center  border-blue-500">
              <span>BHz</span>
            </div>
            
            {/* Kolom 3-5: INHERENT */}
            <div className="col-span-5 flex items-center justify-center  border-blue-500">
              <span>INHERENT</span>
            </div>

             <div className="absolute left-[calc((10.8/16)*100%)] top-0 bottom-0 w-[2px] bg-white/50 z-20"></div>
            
            {/* Kolom 6-8: KPMR */}
            <div className="col-span-5 flex items-center justify-center">
              <span>KUALITAS PENERAPAN MANAJEMEN RISIKO</span>
            </div>
          </div>
          
          {/* Baris 2: Sub-header untuk kolom-kolom detail */}
          <div className="sticky top-[64px] z-9 grid grid-cols-16 p-2 text-sm bg-blue-700 relative">
            {/* Garis pemisah antara INHERENT dan KPMR */}
            <div className="absolute left-[calc((4/16)*100%)] top-0 bottom-0 w-[2px] bg-white/50 z-20"></div>
            
            {/* Kolom 1-2: Kosong untuk Jenis Risiko dan BHz */}
            <div className="col-span-4"></div>
            <div className="absolute left-[calc((5.9/16)*100%)] top-0 bottom-0 w-[2px] bg-white/50 z-20"></div>
            <div className="col-span-2"></div>
            
            {/* Kolom 3-5: INHERENT Sub-header */}
            <div className="col-span-3 text-center border-r border-blue-400">
              Indicator
            </div>
            <div className="col-span-1 text-center border-r border-blue-400">
              Skor
            </div>
            <div className="col-span-1 text-center border-blue-400">
              Nilai
            </div>

            <div className="absolute left-[calc((10.8/16)*100%)] top-0 bottom-0 w-[2px] bg-white/50 z-20"></div>
            
            {/* Kolom 6-8: KPMR Sub-header */}
            <div className="col-span-3 text-center border-r border-blue-400">
              Indicator
            </div>
            <div className="col-span-1 text-center border-r border-blue-400">
              Skor
            </div>
            <div className="col-span-1 text-center">
              Nilai
            </div>
          </div>
        </div>

        {/* Tabel Body dengan scroll */}
        <div className="max-h-[calc(80vh-280px)] overflow-y-auto">
          <div className="divide-y relative">
            {/* Garis pemisah vertikal utama - full height */}
            <div className="absolute left-[calc((4/16)*100%)] top-0 bottom-0 w-[2px] bg-gray-300 z-10"></div>
            
            {tableData.map((item) => (
              <div key={item.id} className="grid grid-cols-16 p-3 hover:bg-gray-50 transition-colors items-center relative">
                {/* Kolom 1: Jenis Risiko dengan Icon */}
                <div className="col-span-4 flex items-center gap-4 pl-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    {item.Icon ? (
                      <item.Icon className="w-5 h-5 text-blue-600" />
                    ) : (
                      <FileText className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <span className="font-bold text-gray-800">{item.nama}</span>
                </div>

                    <div className="absolute left-[calc((5.9/16)*100%)] top-0 bottom-0 w-[2px] bg-gray-300 z-10"></div>

                {/* Kolom 2: BHz (Editable) */}
                <div className="col-span-2 flex items-center justify-center">
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={item.bhz}
                      onChange={(e) => handleBhzChange(item.id, e.target.value)}
                      className="w-16 text-center bg-white border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                    <span className="absolute right-2 top-1.5 text-gray-500 text-sm">%</span>
                  </div>
                </div>

                <div className="absolute left-[calc((10.9/16)*100%)] top-0 bottom-0 w-[2px] bg-gray-300 z-10"></div>

                {/* Kolom 3-5: INHERENT SECTION */}
                {/* Kolom 3: Indicator */}
                <div className="col-span-3 flex items-center justify-center px-1">
                  <IndicatorCell indicator={item.inherentIndicator} />
                </div>
                
                {/* Kolom 4: Skor */}
                <div className="col-span-1 flex items-center justify-center">
                  <ScoreCell value={item.inherentSkor} />
                </div>
                
                {/* Kolom 5: Nilai (Inherent Skor × BHz) */}
                <div className="col-span-1 flex items-center justify-center">
                  <ScoreCell value={item.inherentNilai} />
                </div>

                {/* Kolom 6-8: KPMR SECTION */}
                {/* Kolom 6: Indicator */}
                <div className="col-span-3 flex items-center justify-center px-1">
                  <IndicatorCell indicator={item.kpmrIndicator} />
                </div>
                
                {/* Kolom 7: Skor */}
                <div className="col-span-1 flex items-center justify-center">
                  <ScoreCell value={item.kpmrSkor} />
                </div>
                
                {/* Kolom 8: Nilai (KPMR Skor × BHz) */}
                <div className="col-span-1 flex items-center justify-center">
                  <ScoreCell value={item.kpmrNilai} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabel Footer - PERINGKAT KOMPOSIT */}
        <div className="sticky bottom-0 z-10 bg-blue-900 border-t relative">
          {/* Garis pemisah antara INHERENT dan KPMR di footer */}
          
          <div className="grid grid-cols-16 p-3 text-white font-bold items-center">
            {/* Kolom 1: Jenis Risiko */}
            <div className="col-span-4 text-white flex items-center justify-center pl-4 text-lg">
              Peringkat Komposit
            </div>

            <div className="absolute left-[calc((4/16)*100%)] top-0 bottom-0 w-[2px] bg-white/50 z-20"></div>
            
            {/* Kolom 2: BHz Total */}
            <div className="col-span-2 text-center text-lg">
              {footerData.totalBhz}%
            </div>

            <div className="absolute left-[calc((5.9/16)*100%)] top-0 bottom-0 w-[2px] bg-white/50 z-20"></div>
            
            {/* Kolom 3-5: INHERENT SECTION */}
            {/* Kolom 3: Indicator */}
            <div className="col-span-3 flex items-center justify-center">
              <IndicatorCell indicator={footerData.IndicatoravgInherentNilai}  />
            </div>

            <div className="col-span-1 flex items-center justify-end">
              <h4>Avg Nilai :</h4>
            </div>
            
            {/* Kolom 4: Skor (avg nilai) */}
            <div className="col-span-1 flex items-center justify-center">
              <div className="flex flex-col items-center justify-center space-y-1">
                <div className="font-bold text-white">
                  {footerData.avgInherentNilai.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="absolute left-[calc((10.8/16)*100%)] top-0 bottom-0 w-[2px] bg-white/50 z-20"></div>
  
            {/* Kolom 6-8: KPMR SECTION */}
            {/* Kolom 6: Indicator */}
            <div className="col-span-3 flex items-center justify-center">
              <IndicatorCell indicator={footerData.IndicatoravgkpmrNilai}  />
            </div>

            <div className="col-span-1 flex items-center justify-end">
              <h4>Avg Nilai :</h4>
            </div>
            
            {/* Kolom 7: Skor - AVG nilai */}
             <div className="col-span-1 flex items-center justify-center">
              <div className="flex flex-col items-center justify-center space-y-1">
                <div className="font-bold text-white">
                  {footerData.avgKpmrNilai.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-3">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-gray-700">
              Inherent:
            </span>
            {INHERENT_RISK_INDICATORS.map((i, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-xs">
                <span
                  className="w-3 h-3 rounded border"
                  style={{ backgroundColor: i.color }}
                />
                <span className="text-gray-600">
                  {i.label} ({i.min.toFixed(2)}–{i.max.toFixed(2)})
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-gray-700">
              KPMR:
            </span>
            {KPMR_RISK_INDICATORS.map((i, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-xs">
                <span
                  className="w-3 h-3 rounded border"
                  style={{ backgroundColor: i.color }}
                />
                <span className="text-gray-600">
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