import React, { useMemo, useState } from "react";
import { Shield, ShieldCheck, ShieldAlert, Download } from "lucide-react";

// Import custom components
import HeaderWithFilter from '../components/HeaderWithFilter';
import SummaryCard from '../components/SummaryCard';
import RiskTable from '../components/RiskTable';
import RiskMatrix from '../components/RiskMatrix';
import AlertBox from '../components/AlertBox';
import { GlassEffectProvider } from '../../../../../shared/components/GlassEffectContext';

// Import export function (ExcelJS version: supports ring indicator in matrix)
import { exportRekap2ToExcel } from '../utils/exportRekap2Exceljs';

/* ===================== BRAND ===================== */
const PNM_BRAND = {
  primary: "#0068B3",
};

const RISK_MASTER = [
  "Investasi",
  "Pasar",
  "Likuiditas",
  "Operasional",
  "Hukum",
  "Strategis",
  "Kepatuhan",
  "Reputasi",
];

/* ===================== STORAGE KEY ===================== */
const REKAP1_FINAL_KEY = "rekap1_final_summary_v1";

/* ===================== HELPERS ===================== */
const DEFAULT_YEAR = 2025;
const DEFAULT_QUARTER = "Q4";
/* ===================== KONVERSI SKOR KE LEVEL ===================== */

// Berdasarkan Gambar 3: Tabel Peringkat
const skorToLevel = (skor) => {
  if (skor < 1.5) return 1;
  if (skor < 2.5) return 2;
  if (skor < 3.5) return 3;
  if (skor < 4.5) return 4;
  return 5;
};

/* ---------- LABEL HELPERS ---------- */
const riskLabel = (level) => {
  if (level === 1) return "Low";
  if (level === 2) return "Low to Moderate";
  if (level === 3) return "Moderate";
  if (level === 4) return "Moderate to High";
  return "High";
};

const kpmrLabel = (level) => {
  if (level === 1) return "Strong";
  if (level === 2) return "Satisfactory";
  if (level === 3) return "Fair";
  if (level === 4) return "Marginal";
  return "Unsatisfactory";
};

/* ===================== MAIN ===================== */
export default function Rekap2() {
  const [year, setYear] = useState(DEFAULT_YEAR);
  const [quarter, setQuarter] = useState(DEFAULT_QUARTER);  

  /* ===================== LOAD & TRANSFORM DATA ===================== */
  const data = useMemo(() => {
    try {
      const raw = JSON.parse(
        localStorage.getItem(REKAP1_FINAL_KEY) || "{}"
      );

      const periodData = raw?.[year]?.[quarter];

      // ====== DEFAULT EMPTY STATE ======
      if (!periodData || !Array.isArray(periodData.risks)) {
        const emptyRows = RISK_MASTER.map(label => ({
          label,
          inherent: 0,
          kpmr: 0,
          net: 0,
        }));

        return {
          rows: emptyRows,
          skorProfil: {
            inherent: 0,
            kpmr: 0,
            net: 0,
          },
          isEmpty: true,
        };
      }

      // ====== NORMAL DATA ======
      const { risks } = periodData;

      const rows = RISK_MASTER.map(label => {
        const found = risks.find(r => r.label === label);

        if (!found) {
          return { label, inherent: 0, kpmr: 0, net: 0 };
        }

        const inherentScore = Number(found.inherent || 0);
        const kpmrScore = Number(found.kpmr || 0);
        const netScore = (inherentScore + kpmrScore) / 2;

        return {
          label,
          // simpan skor asli (penting untuk debug & konsistensi)
          inherentScore,
          kpmrScore,
          netScore,
          // level hanya turunan dari skor
          inherent: skorToLevel(inherentScore),
          kpmr: skorToLevel(kpmrScore),
          net: skorToLevel(netScore),
        };
      });

      const avgInherent =
        risks.reduce((s, r) => s + r.inherent, 0) / risks.length;
      const avgKpmr =
        risks.reduce((s, r) => s + r.kpmr, 0) / risks.length;
      const avgNet = (avgInherent + avgKpmr) / 2;

      return {
        rows,
        skorProfil: {
          inherent: skorToLevel(avgInherent),
          kpmr: skorToLevel(avgKpmr),
          net: skorToLevel(avgNet),
        },
        isEmpty: false,
      };
    } catch (err) {
      console.error("[REKAP2] Error loading data:", err);
      return null;
    }
  }, [year, quarter]);

  if (!data) {
    return (
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</p>
            <p className="text-sm text-gray-600">Unable to load risk profile data. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  const { rows, skorProfil } = data;

  /* ===================== RENDER ===================== */
  return (
    <GlassEffectProvider>
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* ================= HEADER WITH FILTER ================= */}
      <HeaderWithFilter
        title="Rekap 2"
        subtitle="Profil Risiko Perusahaan"
        year={year}
        setYear={setYear}
        quarter={quarter}
        setQuarter={setQuarter}
      />

      {/* ================= EXPORT BUTTON ================= */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => exportRekap2ToExcel(data, quarter, year)}
          disabled={data.isEmpty}
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold
            transition-all duration-200 shadow-md hover:shadow-lg
            ${data.isEmpty
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600'
            }
          `}
        >
          <Download className="w-4 h-4" />
          <span>Export Excel</span>
        </button>
      </div>

      {/* ================= ALERT BOX ================= */}
      {data.isEmpty && (
        <AlertBox
          title="Data Belum Tersedia"
          message="Data Rekap 1 belum tersedia untuk periode ini. Nilai ditampilkan sebagai default."
        />
      )}

      {/* ================= MAIN CONTENT: TABLE + (MATRIX + LEGEND) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: TABLE + SUMMARY CARDS (7 columns) */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
          {/* TABLE */}
          <div className="min-h-[500px]">
            <RiskTable
              data={rows}
              skorProfil={skorProfil}
              quarter={quarter}
              year={year}
            />
          </div>

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[180px]">
            <SummaryCard
              title="Inherent Risk"
              score={skorProfil.inherent}
              level={skorProfil.inherent}
              label={riskLabel(skorProfil.inherent)}
              icon={<Shield className="h-5 w-5" />}
            />
            <SummaryCard
              title="KPMR"
              score={skorProfil.kpmr}
              level={skorProfil.kpmr}
              label={kpmrLabel(skorProfil.kpmr)}
              icon={<ShieldCheck className="h-5 w-5" />}
            />
            <SummaryCard
              title="Net Risk"
              score={skorProfil.net}
              level={skorProfil.net}
              label={riskLabel(skorProfil.net)}
              icon={<ShieldAlert className="h-5 w-5" />}
            />
          </div>
        </div>

        {/* RIGHT: MATRIX + LEGEND (5 columns) */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          {/* RISK MATRIX */}
          <div className="flex-1">
            <RiskMatrix
              inherentLevel={skorProfil.inherent}
              kpmrLevel={skorProfil.kpmr}
              showLegend={false}
              className="h-full"
            />
          </div>

          {/* RISK LEVEL LEGEND */}
          <div className="h-45 bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-xl border border-white border-opacity-20 overflow-hidden">
            <div className="bg-[#0070C0] text-white p-3">
              <h3 className="text-sm font-bold tracking-tight uppercase text-[10px]">
                Risk Level Legend
              </h3>
            </div>
            <div className="p-3">
              <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                  <div className="flex items-center gap-2">
                  <div className="w-14 h-8 bg-[#2e7d32] rounded-[22px] flex items-center justify-center shadow-md flex-shrink-0">
                    <span className="text-white font-black text-xl">1</span>
                  </div>
                  <span className="text-xs font-bold text-gray-700">Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-14 h-8 bg-[#92D050] rounded-[22px] flex items-center justify-center shadow-md flex-shrink-0">
                    <span className="text-white font-black text-xl">2</span>
                  </div>
                  <span className="text-xs font-bold text-gray-700">Low to Moderate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-14 h-8 bg-[#ffff00] rounded-[22px] flex items-center justify-center shadow-md flex-shrink-0">
                    <span className="text-gray-800 font-black text-xl">3</span>
                  </div>
                  <span className="text-xs font-bold text-gray-700">Moderate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-14 h-8 bg-[#ffc000] rounded-[22px] flex items-center justify-center shadow-md flex-shrink-0">
                    <span className="text-gray-900 font-black text-xl">4</span>
                  </div>
                  <span className="text-xs font-bold text-gray-700">Moderate to High</span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <div className="w-14 h-8 bg-[#ff0000] rounded-[22px] flex items-center justify-center shadow-md flex-shrink-0">
                    <span className="text-white font-black text-xl">5</span>
                  </div>
                  <span className="text-xs font-bold text-gray-700">High</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= DEBUG INFO ================= */}
      <details className="mt-6 bg-gray-100 rounded-lg p-4 text-xs">
        <summary className="cursor-pointer font-semibold mb-2">Debug Info</summary>
        <pre className="overflow-auto">
          {JSON.stringify({ rows, skorProfil }, null, 2)}
        </pre>
      </details>
    </div>
    </GlassEffectProvider>
  );
}
