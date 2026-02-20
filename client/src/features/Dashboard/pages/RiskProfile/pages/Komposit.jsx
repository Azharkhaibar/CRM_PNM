import React, { useMemo, useState } from "react";
import { HelpCircle, ChevronDown, ChevronRight, Download } from "lucide-react";
import { Calendar } from "lucide-react";
import { exportKompositToExcel } from "../utils/exportKomposit";


/* ===================== BRAND ===================== */
const PNM_BRAND = {
    primary: "#0068B3",
};

/* ===================== STORAGE KEYS ===================== */
const REKAP1_FINAL_KEY = "rekap1_final_summary_v1";
const BHZ_STORAGE_KEY = "rekap1_bhz_config_v1";
const VALIDATION_ERRORS_KEY = "komposit_validation_errors_v1";

/* ===================== HELPERS ===================== */
const DEFAULT_YEAR = 2025;
const DEFAULT_QUARTER = "Q4";

const fmt = (n, decimals = 2) => {
    if (!Number.isFinite(n)) return "0.00";
    return Number(n).toFixed(decimals);
};

const round1 = (n) => {
    return Math.round(n * 10) / 10;
};

/* ===================== KUALITAS LABELS ===================== */
const getKualitasInherenLabel = (skor) => {
    if (skor < 1.5) return "Low";
    if (skor < 2.5) return "Low to Moderate";
    if (skor < 3.5) return "Moderate";
    if (skor < 4.5) return "Moderate to High";
    return "High";
};

const getKualitasKPMRLabel = (skor) => {
    if (skor < 1.5) return "Strong";
    if (skor < 2.5) return "Satisfactory";
    if (skor < 3.5) return "Fair";
    if (skor < 4.5) return "Marginal";
    return "Unsatisfactory";
};

/* ===================== LEVEL COLOR CONFIG ===================== */
const LEVEL_BG_COLOR = {
    1: 'bg-[#2e7d32]',  // hijau tua
    2: 'bg-[#92D050]',  // hijau cerah
    3: 'bg-[#ffff00]',  // kuning
    4: 'bg-[#ffc000]',  // oranye
    5: 'bg-[#ff0000]',  // merah
};

const LEVEL_TEXT_COLOR = {
    1: 'text-white',
    2: 'text-slate-900',
    3: 'text-slate-900',
    4: 'text-slate-900',
    5: 'text-white',
};


const skorToLevel = (skor) => {
    if (skor < 1.5) return 1;
    if (skor < 2.5) return 2;
    if (skor < 3.5) return 3;
    if (skor < 4.5) return 4;
    return 5;
};


/* ===================== STATUS COLOR & BADGE HELPERS ===================== */
const getStatusColor = (skor) => {
    const level = skorToLevel(skor);

    return {
        level,
        bg: LEVEL_BG_COLOR[level],
        text: LEVEL_TEXT_COLOR[level],
    };
};


/* ===================== BADGE COMPONENT ===================== */
const StatusBadge = ({ skor, type = 'inheren', children }) => {
    const colors = getStatusColor(skor, type);
    return (
        <div className={`${colors.bg} ${colors.text} rounded-full px-3 py-2.5 text-sm font-bold shadow-inner flex items-center justify-center min-w-[120px] w-full`}>
            {children}
        </div>
    );
};

/* ===================== LOAD BHz CONFIG ===================== */
const loadBhzConfig = (year, quarter) => {
    try {
        const raw = localStorage.getItem(BHZ_STORAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        return parsed?.[year]?.[quarter] || {};
    } catch {
        return {};
    }
};

/* ===================== MAIN ===================== */
export default function Komposit() {
    const [year, setYear] = useState(DEFAULT_YEAR);
    const [quarter, setQuarter] = useState(DEFAULT_QUARTER);

    /* ===================== LOAD DATA ===================== */
    const data = useMemo(() => {
        try {
            // Load Rekap1 data
            const raw = JSON.parse(localStorage.getItem(REKAP1_FINAL_KEY) || "{}");
            const periodData = raw?.[year]?.[quarter];

            if (!periodData) return null;

            // Load BHz config
            const bhzConfig = loadBhzConfig(year, quarter);

            const { kompositA, kompositB, risks } = periodData;

            // Build rows dengan BHz
            const rows = risks.map(r => {
                const bhzKey = r.label.toLowerCase();
                const bhz = bhzConfig[bhzKey] || 0;

                return {
                    label: r.label,
                    bhz: bhz,
                    inherent: r.inherent,
                    kpmr: r.kpmr,
                };
            });

            return {
                rows: rows || [],
                kompositA,
                kompositB,
            };
        } catch (err) {
            console.error("[KOMPOSIT] Error loading data:", err);
            return null;
        }
    }, [year, quarter]);

    const { rows = [], kompositA = null, kompositB = null } = data || {};

    /* ===================== CALCULATE COMBINED TABLE ===================== */
    const combinedTable = useMemo(() => {
        return rows.map(r => {
            // Inheren calculations
            const skorInherenBulat = round1(r.inherent);
            const nilaiInheren = skorInherenBulat * (r.bhz / 100);
            
            // KPMR calculations
            const skorKpmrBulat = round1(r.kpmr);
            const nilaiKpmr = skorKpmrBulat * (r.bhz / 100);

            return {
                label: r.label,
                bhz: r.bhz,
                // Inheren data
                inheren: {
                    kualitas: getKualitasInherenLabel(r.inherent),
                    skor: skorInherenBulat,
                    nilai: nilaiInheren,
                },
                // KPMR data
                kpmr: {
                    kualitas: getKualitasKPMRLabel(r.kpmr),
                    skor: skorKpmrBulat,
                    nilai: nilaiKpmr,
                },
            };
        });
    }, [rows]);

    // Calculate totals
    const totals = useMemo(() => {
        const totalBhz = combinedTable.reduce((sum, r) => sum + r.bhz, 0);
        const totalNilaiInheren = combinedTable.reduce((sum, r) => sum + r.inheren.nilai, 0);
        const totalNilaiKpmr = combinedTable.reduce((sum, r) => sum + r.kpmr.nilai, 0);

        return {
            bhz: totalBhz,
            nilaiInheren: totalNilaiInheren,
            nilaiKpmr: totalNilaiKpmr,
        };
    }, [combinedTable]);

    /* ===================== RENDER ===================== */
    if (!data) {
        return (
            <div className="p-6 text-gray-500">
                Data belum tersedia untuk periode ini.
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* ================= HEADER ================= */}
            <div className="relative rounded-xl overflow-hidden mb-4 shadow-sm bg-gradient-to-r from-[#0076C6]/90 via-[#00A3DA]/90 to-[#33C2B5]/90">
                {/* overlay cahaya */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_0%,white,transparent_40%),radial-gradient(circle_at_80%_100%,white,transparent_35%)]" />

                <div className="relative px-4 py-5 sm:px-5 sm:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Title */}
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white drop-shadow-sm">
                            Peringkat Komposit
                        </h1>
                        <p className="mt-1 text-white/90 text-xs">
                            Risiko Inheren & Kualitas Penerapan Manajemen Risiko
                        </p>
                    </div>

                    {/* Actions Container */}
                    <div className="flex items-center gap-3">
                        {/* Filter pill — SAMA DENGAN REKAP1 & REKAP2 */}
                        <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                            <Calendar className="w-4 h-4 text-white opacity-90" />

                        <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            className="w-20 bg-transparent text-white placeholder-white/60 text-sm font-semibold focus:outline-none"
                        />

                        <select
                            value={quarter}
                            onChange={(e) => setQuarter(e.target.value)}
                            className="bg-transparent text-white text-sm font-semibold focus:outline-none cursor-pointer"
                        >
                            <option className="text-slate-900" value="Q1">Q1</option>
                            <option className="text-slate-900" value="Q2">Q2</option>
                            <option className="text-slate-900" value="Q3">Q3</option>
                            <option className="text-slate-900" value="Q4">Q4</option>
                        </select>
                        </div>

                        {/* Export Button */}
                        <button
                            onClick={() => exportKompositToExcel(combinedTable, totals, year, quarter)}
                            disabled={!data || combinedTable.length === 0}
                            className="flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Export</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ================= SCORECARD SUMMARY ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Risiko Inheren Card */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="p-5">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-extrabold tracking-wide text-slate-500 uppercase">
                            Inherent Risk
                        </span>
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
                            A
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex items-center gap-4">
                        {/* Level Box */}
                        <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg
        ${getStatusColor(totals.nilaiInheren).bg}`}
                        >
                            {skorToLevel(totals.nilaiInheren)}
                        </div>

                        {/* Score */}
                        <div className="flex-1">
                            <div className="text-2xl font-bold text-slate-900">
                                {fmt(totals.nilaiInheren, 2)}
                            </div>
                            <div className="text-base font-bold text-slate-500">
                                {getKualitasInherenLabel(totals.nilaiInheren)}
                            </div>
                        </div>
                    </div>
                    </div>
                </div>


                {/* KPMR Card */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="p-5">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-extrabold tracking-wide text-slate-500 uppercase">
                            KPMR
                        </span>
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
                            B
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex items-center gap-4">
                        {/* Level Box */}
                        <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg
        ${getStatusColor(totals.nilaiKpmr).bg}`}
                        >
                            {skorToLevel(totals.nilaiKpmr)}
                        </div>

                        {/* Score */}
                        <div className="flex-1">
                            <div className="text-2xl font-bold text-slate-900">
                                {fmt(totals.nilaiKpmr, 2)}
                            </div>
                            <div className="text-base font-bold text-slate-500">
                                {getKualitasKPMRLabel(totals.nilaiKpmr)}
                            </div>
                        </div>
                    </div>
                    </div>
                </div>

            </div>

            {/* ================= COMBINED TABLE ================= */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gradient-to-r from-[#0076C6] via-[#005A9E] to-[#003F7D] text-white">
                            <tr>
                                <th rowSpan={2} className="w-[160px] px-2 py-3 text-left font-bold uppercase tracking-wide border-r border-gray-600">RISIKO</th>
                                <th rowSpan={2} className="px-3 py-3 text-center font-bold uppercase tracking-wide border-r border-gray-600">BHZ (%)</th>
                                <th colSpan={3} className="px-3 py-3 text-center font-bold uppercase tracking-wide border-r border-gray-600">INHEREN</th>
                                <th colSpan={3} className="px-3 py-3 text-center font-bold uppercase tracking-wide">KPMR</th>
                            </tr>
                            <tr className="bg-gradient-to-r from-[#0076C6] via-[#005A9E] to-[#003F7D] text-white">
                                <th className="px-3 py-2 text-center font-bold uppercase tracking-wide border-r border-gray-600 border-t border-gray-500">SCORE</th>
                                <th className="px-3 py-2 text-center font-bold uppercase tracking-wide border-r border-gray-600 border-t border-gray-500">STATUS</th>
                                <th className="px-3 py-2 text-center font-bold uppercase tracking-wide border-r border-gray-600 border-t border-gray-500">NILAI</th>
                                <th className="px-3 py-2 text-center font-bold uppercase tracking-wide border-r border-gray-500 border-t border-gray-500">SCORE</th>
                                <th className="px-3 py-2 text-center font-bold uppercase tracking-wide border-r border-gray-500 border-t border-gray-500">STATUS</th>
                                <th className="px-3 py-2 text-center font-bold uppercase tracking-wide border-t border-gray-500">NILAI</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {combinedTable.map((r, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                    <td className="w-[160px] px-2 py-3 font-bold text-xl text-gray-900 border-r border-gray-200">{r.label}</td>
                                    <td className="px-3 py-3 text-center text-lg text-gray-700 border-r border-gray-200">{r.bhz}</td>
                                    <td className="px-3 py-3 text-center border-r border-gray-200">
                                        <span className="font-bold text-lg text-gray-900">{fmt(r.inheren.skor, 1)}</span>
                                    </td>
                                    <td className="px-3 py-3 text-center border-r border-gray-200">
                                        <StatusBadge skor={r.inheren.skor} type="inheren">
                                            {r.inheren.kualitas}
                                        </StatusBadge>
                                    </td>
                                    <td className="px-3 py-3 text-center bg-blue-50 text-lg text-blue-900 font-medium border-r border-gray-200">
                                        {fmt(r.inheren.nilai, 2)}
                                    </td>
                                    <td className="px-3 py-3 text-center border-r border-gray-200">
                                        <span className="font-bold text-lg text-gray-900">{fmt(r.kpmr.skor, 1)}</span>
                                    </td>
                                    <td className="px-3 py-3 text-center border-r border-gray-200">
                                        <StatusBadge skor={r.kpmr.skor} type="kpmr">
                                            {r.kpmr.kualitas}
                                        </StatusBadge>
                                    </td>
                                    <td className="px-3 py-3 text-center bg-blue-50 text-lg text-blue-900 font-medium">
                                        {fmt(r.kpmr.nilai, 2)}
                                    </td>
                                </tr>
                            ))}

                            {/* Total Row */}
                            <tr className="
  relative
  backdrop-blur-[16px]
  backdrop-saturate-180
  bg-[rgba(190,190,190,0.75)]
  rounded-[12px]
  border border-[rgba(209,213,219,0.3)]
  shadow-lg
  border-t-2 border-gray-300
  my-4
">
                                <td className="
    px-4 py-4 
    uppercase tracking-wide 
    border-r border-gray-300/60
    font-extrabold text-gray-900
  ">
                                    <div className="flex items-center gap-2">
                                        <span className="text-base">PERINGKAT KOMPOSIT</span>
                                    </div>
                                </td>

                                <td className="px-4 py-4 text-center border-r border-gray-300/60">
                                    <span className="
      font-bold text-gray-900 text-lg
      backdrop-blur-[4px]
      bg-white/30
      px-3 py-1
      rounded-lg
      border border-white/40
    ">
                                        {totals.bhz}
                                    </span>
                                </td>

                                <td className="px-4 py-4 text-center border-r border-gray-300/60">
                                    <span className="
      font-bold text-lg text-gray-900
      backdrop-blur-[4px]
      bg-white/30
      px-4 py-2
      rounded-lg
      border border-white/40
    ">
                                        {fmt(totals.nilaiInheren, 2)}
                                    </span>
                                </td>

                                <td className="px-4 py-4 text-center border-r border-gray-300/60">
                                    <StatusBadge skor={totals.nilaiInheren} type="inheren">
                                        {getKualitasInherenLabel(totals.nilaiInheren)}
                                    </StatusBadge>
                                </td>

                                <td className="
    px-4 py-4 text-center 
    border-r border-gray-300/60
    bg-blue-100/80
    text-lg text-blue-900 font-bold
    backdrop-blur-[4px]
    border border-white/40
    rounded-lg
    mx-1
  ">
                                    {fmt(totals.nilaiInheren, 2)}
                                </td>

                                <td className="px-4 py-4 text-center border-r border-gray-300/60">
                                    <span className="
      font-bold text-lg text-gray-900
      backdrop-blur-[4px]
      bg-white/30
      px-4 py-2
      rounded-lg
      border border-white/40
    ">
                                        {fmt(totals.nilaiKpmr, 2)}
                                    </span>
                                </td>

                                <td className="px-3 py-3 text-center border-r border-gray-200">
                                    <StatusBadge skor={totals.nilaiKpmr} type="kpmr">
                                        {getKualitasKPMRLabel(totals.nilaiKpmr)}
                                    </StatusBadge>
                                </td>

                                <td className="
    px-3 py-3 text-center
    bg-blue-50
    text-lg text-blue-900 font-medium
  ">
                                    {fmt(totals.nilaiKpmr, 2)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ================= DEBUG INFO ================= */}
            <details className="bg-gray-50 rounded-lg p-4 text-xs">
                <summary className="cursor-pointer font-semibold mb-2">Debug Info</summary>
                <pre className="overflow-auto">
                    {`Combined Table:
Total BHz: ${totals.bhz}
Total Nilai Inheren: ${fmt(totals.nilaiInheren, 2)}
Total Nilai KPMR: ${fmt(totals.nilaiKpmr, 2)}
Kualitas Inheren: ${getKualitasInherenLabel(totals.nilaiInheren)}
Kualitas KPMR: ${getKualitasKPMRLabel(totals.nilaiKpmr)}

Raw Data:
${JSON.stringify({ kompositA, kompositB, rowCount: rows.length, totals }, null, 2)}`}
                </pre>
            </details>
        </div>
    );
}