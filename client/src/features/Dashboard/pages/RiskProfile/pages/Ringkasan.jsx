// Ringkasan.jsx
import React, { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { YearInput, QuarterSelect } from "../../../components/Inputs";
import { getCurrentYear, getCurrentQuarter } from "../utils/time";
import { formatHasil } from "../utils/riskCalculator";
import { exportRingkasanToExcel } from "../utils/exportRingkasan";

// ===================== KONFIGURASI =====================
const RISK_ORDER = [
    "investasi",
    "pasar", 
    "likuiditas",
    "operasional",
    "hukum",
    "stratejik",
    "kepatuhan",
    "reputasi",
];
 

const RISK_CODE = {
    investasi: "INV",
    pasar: "PAS",
    likuiditas: "LIK",
    operasional: "OPR",
    hukum: "HKM",
    stratejik: "STR",
    kepatuhan: "KPT",
    reputasi: "REP",
};

const RISK_LABEL = {
    1: "Low",
    2: "Low to Moderate",
    3: "Moderate",
    4: "Moderate to High",
    5: "High",
};

const RISK_COLOR = {
    1: "#2e7d32", // Dark Green - Low Risk (same as Rekap2)
    2: "#92D050", // Light Green - Low to Moderate Risk (same as Rekap2)
    3: "#ffff00", // Yellow - Moderate Risk (same as Rekap2)
    4: "#ffc000", // Orange - Moderate to High Risk (same as Rekap2)
    5: "#ff0000", // Red - High Risk (same as Rekap2)
};

const QUARTER_TO_MONTH = {
    Q1: "Mar",
    Q2: "Jun",
    Q3: "Sep",
    Q4: "Dec",
};


// ===================== HELPERS =====================
const capitalize = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);

// Smart styling function for risk levels
const getRiskStyle = (value) => {
    const riskLevel = Number(value);
    if (isNaN(riskLevel) || riskLevel < 1 || riskLevel > 5) {
        return {
            backgroundColor: "#f3f4f6",
            color: "#6b7280",
            className: "bg-gray-100 text-gray-500"
        };
    }

    const colorMap = {
        1: { bg: "#2e7d32", text: "white", className: "bg-[#2e7d32] text-white" },  // Dark Green (same as Rekap2)
        2: { bg: "#92D050", text: "white", className: "bg-[#92D050] text-white" },   // Light Green (same as Rekap2)
        3: { bg: "#FFFF00", text: "gray-800", className: "bg-[#ffff00] text-gray-800" },   // Yellow (same as Rekap2)
        4: { bg: "#ffc000", text: "gray-900", className: "bg-[#ffc000] text-gray-900" },  // Orange (same as Rekap2)
        5: { bg: "#ff0000", text: "white", className: "bg-[#ff0000] text-white" }     // Red (same as Rekap2)
    };

    return {
        backgroundColor: colorMap[riskLevel].bg,
        color: colorMap[riskLevel].text,
        className: colorMap[riskLevel].className
    };
};

const buildRiskIndex = ({ riskFormId, sectionNo, indikatorIndex, subNo }) => {
    const code = RISK_CODE[riskFormId] || "UNK";
    // For Pasar, use format: R.PAS.{sectionNo}.{indikatorIndex} without subNo
    if (riskFormId === "pasar") {
        return `R.${code}.${sectionNo}.${indikatorIndex}`;
    }
    // For Hukum and Kepatuhan, use special format: R.{CODE}.{sectionNo}.{subNo}
    // Fall back to indikatorIndex if subNo is not available (for backward compatibility)
    if (riskFormId === "hukum" || riskFormId === "kepatuhan") {
        const index = subNo || indikatorIndex;
        return `R.${code}.${sectionNo}.${index}`;
    }
    return `R.${code}.${sectionNo}.${indikatorIndex}`;
};

// ===================== COMPONENT =====================
export default function Ringkasan() {
    const [viewYear, setViewYear] = useState(getCurrentYear());
    const [viewQuarter, setViewQuarter] = useState(getCurrentQuarter());

    // ===================== LOAD DATA =====================
    const investasiRows = useMemo(() => {
        try {
            const raw = localStorage.getItem("rekap_investasi");
            const rows = raw ? JSON.parse(raw) : [];
            return rows.filter(
                (r) => r.year === viewYear && r.quarter === viewQuarter
            );
        } catch {
            return [];
        }
    }, [viewYear, viewQuarter]);

    const pasarRows = useMemo(() => {
        try {
            const raw = localStorage.getItem("rekap_pasar");
            const rows = raw ? JSON.parse(raw) : [];
            return rows.filter(
                (r) => r.year === viewYear &&
                    r.quarter === viewQuarter &&
                    !r.isSectionOnly  // ← TAMBAHKAN INI: Skip section-only rows
            );
        } catch {
            return [];
        }
    }, [viewYear, viewQuarter]);

    const likuiditasRows = useMemo(() => {
        try {
            const raw = localStorage.getItem("rekap_likuiditas");
            const rows = raw ? JSON.parse(raw) : [];
            return rows.filter(
                (r) => r.year === viewYear && r.quarter === viewQuarter
            );
        } catch {
            return [];
        }
    }, [viewYear, viewQuarter]);

    const operasionalRows = useMemo(() => {
        try {
            const raw = localStorage.getItem("rekap_operasional");
            const rows = raw ? JSON.parse(raw) : [];
            return rows.filter(
                (r) => r.year === viewYear && r.quarter === viewQuarter
            );
        } catch {
            return [];
        }
    }, [viewYear, viewQuarter]);

    const hukumRows = useMemo(() => {
        try {
            const raw = localStorage.getItem("rekap_hukum");
            const rows = raw ? JSON.parse(raw) : [];
            return rows.filter(
                (r) => r.year === viewYear && r.quarter === viewQuarter
            );
        } catch {
            return [];
        }
    }, [viewYear, viewQuarter]);

    const stratejikRows = useMemo(() => {
        try {
            const raw = localStorage.getItem("rekap_stratejik");
            const rows = raw ? JSON.parse(raw) : [];
            return rows.filter(
                (r) => r.year === viewYear && r.quarter === viewQuarter
            );
        } catch {
            return [];
        }
    }, [viewYear, viewQuarter]);

    const kepatuhanRows = useMemo(() => {
        try {
            const raw = localStorage.getItem("rekap_kepatuhan");
            const rows = raw ? JSON.parse(raw) : [];
            return rows.filter(
                (r) => r.year === viewYear && r.quarter === viewQuarter
            );
        } catch {
            return [];
        }
    }, [viewYear, viewQuarter]);

    const reputasiRows = useMemo(() => {
        try {
            const raw = localStorage.getItem("rekap_reputasi");
            const rows = raw ? JSON.parse(raw) : [];
            return rows.filter(
                (r) => r.year === viewYear && r.quarter === viewQuarter
            );
        } catch {
            return [];
        }
    }, [viewYear, viewQuarter]);

    // ===================== GROUP BY SECTION =====================
    const allData = useMemo(() => {
        // All rekap_* data already has correct field names (sectionNo, subNo, sectionLabel, etc.)
        // Using spread operator (...) copies all fields directly without manual mapping needed
        const investasiData = investasiRows.map(r => ({ ...r, riskType: "investasi" }));
        const pasarData = pasarRows.map(r => ({ ...r, riskType: "pasar" }));
        const likuiditasData = likuiditasRows.map(r => ({ ...r, riskType: "likuiditas" }));
        const operasionalData = operasionalRows.map(r => ({ ...r, riskType: "operasional" }));
        const hukumData = hukumRows.map(r => ({ ...r, riskType: "hukum" }));
        const stratejikData = stratejikRows.map(r => ({ ...r, riskType: "stratejik" }));
        const kepatuhanData = kepatuhanRows.map(r => ({ ...r, riskType: "kepatuhan" }));
        const reputasiData = reputasiRows.map(r => ({ ...r, riskType: "reputasi" }));

        return [...investasiData, ...pasarData, ...likuiditasData, ...operasionalData, ...hukumData, ...stratejikData, ...kepatuhanData, ...reputasiData];
    }, [investasiRows, pasarRows, likuiditasRows, operasionalRows, hukumRows, stratejikRows, kepatuhanRows, reputasiRows]);

    const grouped = useMemo(() => {
        const map = new Map();

        allData.forEach((r) => {
            const key = `${r.riskType}|${r.sectionNo}|${r.sectionLabel}|${r.bobotSection}`;
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(r);
        });

        return Array.from(map.entries()).map(([k, items]) => {
            const [riskType, sectionNo, sectionLabel, bobotSection] = k.split("|");
            return {
                riskType,
                sectionNo,
                sectionLabel,
                bobotSection,
                items,
            };
        });
    }, [allData]);

    // Calculate totals per risk type
    const riskTypeTotals = useMemo(() => {
        const totals = {};
        allData.forEach((r) => {
            totals[r.riskType] = (totals[r.riskType] || 0) + 1;
        });
        return totals;
    }, [allData]);

    const periodLabel = `${QUARTER_TO_MONTH[viewQuarter]}-${String(viewYear).slice(2)}`;

    // Handler untuk export Excel
    const handleExportExcel = () => {
        exportRingkasanToExcel(groupedByRiskType, riskTypeRowSpans, viewYear, viewQuarter);
    };

    // Group data by risk type for rendering
    const groupedByRiskType = useMemo(() => {
        const result = {};
        RISK_ORDER.forEach(riskType => {
            result[riskType] = grouped.filter(g => g.riskType === riskType);
        });
        return result;
    }, [grouped]);

    // Calculate row spans
    const riskTypeRowSpans = useMemo(() => {
        const spans = {};
        RISK_ORDER.forEach(riskType => {
            spans[riskType] = groupedByRiskType[riskType].reduce((total, g) => total + g.items.length, 0);
        });
        return spans;
    }, [groupedByRiskType]);

    // Risk type labels
    const RISK_TYPE_LABELS = {
        investasi: "Risiko Investasi",
        pasar: "Risiko Pasar",
        likuiditas: "Risiko Likuiditas",
        operasional: "Risiko Operasional",
        hukum: "Risiko Hukum",
        stratejik: "Risiko Stratejik",
        kepatuhan: "Risiko Kepatuhan",
        reputasi: "Risiko Reputasi"
    };

    // ===================== RENDER =====================
    return (
        <div className="p-6">
            {/* HEADER */}
            <div className="relative rounded-2xl overflow-hidden mb-6 shadow-sm bg-gradient-to-r from-[#0076C6]/90 via-[#00A3DA]/90 to-[#33C2B5]/90">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_0%,white,transparent_40%),radial-gradient(circle_at_80%_100%,white,transparent_35%)]" />
              <div className="relative px-6 py-7 sm:px-8 sm:py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
                    Risk Summary – Risk Assessment
                  </h1>
                  <p className="mt-1 text-white/90 text-sm">
                    Ringkasan hasil pengukuran tingkat risiko per periode.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleExportExcel}
                    className="flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20 transition-all duration-200 group"
                    title="Export to Excel"
                  >
                    <Download className="w-4 h-4 text-white opacity-90 group-hover:scale-110 transition-transform" />
                    <span className="text-white text-sm font-semibold">Export</span>
                  </button>
                </div>
              </div>
              <div className="relative px-6 pb-7 sm:px-8 sm:pb-8">
                <div className="flex gap-3">
                  <YearInput value={viewYear} onChange={setViewYear} labelClassName="text-white" />
                  <QuarterSelect value={viewQuarter} onChange={setViewQuarter} labelClassName="text-white" />
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
                <table className="w-full text-sm border-separate border-spacing-0">
                    <thead className="sticky top-0 z-10">
                        {/* BARIS 1 */}
                        <tr className="bg-[#1e3a8a] text-white">
                            <th rowSpan={3} className="w-[90px] border-b-2 border-gray-300 px-4 py-2">No</th>
                            <th rowSpan={3} className="w-[160px] border-b-2 border-gray-300 px-4 py-2 text-left">Jenis Risiko</th>
                            <th rowSpan={3} className=" w-[90px] border-b-2 border-gray-300 px-4 py-2">Bobot</th>
                            <th rowSpan={3} className="w-[240px] border-b-2 border-gray-300 px-4 py-2 text-left">Group Parameter</th>
                            <th rowSpan={3} className="border-b-2 border-gray-300 px-4 py-2">Indeks</th>
                            <th rowSpan={3} className="w-[420px] border-b-2 border-gray-300 px-4 py-2 text-left">
                                Parameter / Risiko Inheren
                            </th>

                            {/* HEADER KANAN */}
                            <th colSpan={4} className="border-b-2 border-gray-300 px-4 py-2">
                                Hasil Risk Assessment
                            </th>
                        </tr>

                        {/* BARIS 2 */}
                        <tr className="bg-[#1e3a8a] text-white">
                            <th colSpan={4} className="border-b-2 border-gray-300 px-4 py-2">
                                {periodLabel} {/* contoh: Jun-25 */}
                            </th>
                        </tr>

                        {/* BARIS 3 */}
                        <tr className="bg-[#1e3a8a] text-white">
                            <th className="border-b-2 border-gray-300 px-4 py-2">Bobot</th>
                            <th className="border-b-2 border-gray-300 px-4 py-2">Hasil Assessment</th>
                            <th className="border-b-2 border-gray-300 px-4 py-2">Risk Level</th>
                            <th className="border-b-2 border-gray-300 px-4 py-2">Risk Level</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {grouped.length === 0 && (
                            <tr>
                                <td colSpan={10} className="border border-gray-200 px-4 py-8 text-center text-gray-500 bg-gray-50">
                                    <div className="text-sm font-medium">Tidak ada data tersedia untuk periode ini</div>
                                </td>
                            </tr>
                        )}

                        {RISK_ORDER.map((riskType, riskIndex) => {
                            const riskTypeGroups = grouped.filter(g => g.riskType === riskType);
                            const riskTypeTotal = riskTypeTotals[riskType] || 0;

                            // Skip Pasar if no data available
                            if (riskType === "pasar" && riskTypeGroups.length === 0) {
                                return null;
                            }
                            
                            const riskTypeName = RISK_TYPE_LABELS[riskType] || `Risiko ${capitalize(riskType)}`;
                            
                            return (
                                <React.Fragment key={riskType}>
                                    {riskTypeGroups.map((g, gi) => {
                                        return g.items.map((r, ri) => {
                                            const isFirstGroup = gi === 0;
                                            const isFirstItem = ri === 0;
                                            const riskNumber = riskIndex + 1;
                                            
                                            // Special handling for index calculation
                                            let indikatorIndex;
                                            if (riskType === "pasar") {
                                                // For Pasar, calculate position starting from 1 (no subNo)
                                                indikatorIndex = ri + 1;
                                            } else if (riskType === "hukum") {
                                                // For Hukum, use the actual subNo from data if available, otherwise calculate position
                                                indikatorIndex = r.subNo || ri + 1;
                                            } else if (riskType === "stratejik" || riskType === "kepatuhan" || riskType === "reputasi") {
                                                indikatorIndex = ri + 1;
                                            } else {
                                                indikatorIndex = ri + 1;
                                            }
                                            
                                            // Special handling for hasil display
                                            let hasilDisplay = "";
                                            if (riskType === "stratejik" && r.mode === "TEKS") {
                                                hasilDisplay = r.hasilText;
                                            } else if (riskType === "hukum") {
                                                if (r.hasilText) {
                                                    hasilDisplay = r.hasilText;
                                                } else if (r.hasil !== null && r.hasil !== undefined) {
                                                    if (r.isPercent) {
                                                        hasilDisplay = `${(Number(r.hasil) * 100).toFixed(2)}%`;
                                                    } else {
                                                        hasilDisplay = formatHasil(r.hasil, false, 4);
                                                    }
                                                }
                                            } else if (riskType === "pasar") {
                                                // For Risiko Pasar, handle hasil display based on isPercent flag
                                                if (r.hasil !== null && r.hasil !== undefined) {
                                                    if (r.isPercent) {
                                                        hasilDisplay = `${(Number(r.hasil) * 100).toFixed(2)}%`;
                                                    } else {
                                                        hasilDisplay = formatHasil(r.hasil, false, 4);
                                                    }
                                                }
                                            } else if (riskType === "kepatuhan") {
                                                // For Kepatuhan, handle hasil display based on mode
                                                if (r.mode === "TEKS" && r.hasilText) {
                                                    hasilDisplay = r.hasilText;
                                                } else if (r.hasil !== null && r.hasil !== undefined && r.hasil !== "") {
                                                    if (r.isPercent) {
                                                        hasilDisplay = `${(Number(r.hasil) * 100).toFixed(2)}%`;
                                                    } else {
                                                        hasilDisplay = formatHasil(r.hasil, false, 4);
                                                    }
                                                }
                                            } else {
                                                if (r.isPercent) {
                                                    hasilDisplay = `${(Number(r.hasil) * 100).toFixed(2)}%`;
                                                } else {
                                                    hasilDisplay = formatHasil(r.hasil, false, 4);
                                                }
                                            }
                                            
                                            // Special handling for bobotIndikator display
                                            let bobotIndikatorDisplay = "";
                                            if ((riskType === "hukum" || riskType === "stratejik" || riskType === "kepatuhan" || riskType === "reputasi" || riskType === "pasar") && r.bobotIndikator) {
                                                bobotIndikatorDisplay = `${r.bobotIndikator}%`;
                                            } else if (r.bobotIndikator) {
                                                bobotIndikatorDisplay = `${r.bobotIndikator}%`;
                                            }
                                            
                                            return (
                                                <tr key={`${riskType}-${gi}-${ri}`} className="hover:bg-gray-50 transition-colors duration-150">
                                                    {/* NO + JENIS RISIKO (SEKALI SAJA PER RISK TYPE) */}
                                                    {isFirstGroup && isFirstItem && (
                                                        <>
                                                            <td
                                                                rowSpan={riskTypeTotal}
                                                                className="border border-gray-200 px-4 py-3 text-center font-bold bg-white"
                                                            >
                                                                {riskNumber}
                                                            </td>
                                                            <td
                                                                rowSpan={riskTypeTotal}
                                                                className="border border-gray-200 px-4 py-3 font-semibold bg-white"
                                                            >
                                                                {riskTypeName}
                                                            </td>
                                                        </>
                                                    )}

                                                    {/* BOBOT SECTION + GROUP PARAMETER (PER SECTION) */}
                                                    {isFirstItem && (
                                                        <>
                                                            <td
                                                                rowSpan={g.items.length}
                                                                className="border border-gray-200 px-4 py-3 text-center bg-white"
                                                            >
                                                                {g.bobotSection ? `${g.bobotSection}%` : "0%"}
                                                            </td>
                                                            <td
                                                                rowSpan={g.items.length}
                                                                className="border border-gray-200 px-4 py-3 bg-white"
                                                            >
                                                                {g.sectionLabel}
                                                            </td>
                                                        </>
                                                    )}

                                                    {/* INDEKS */}
                                                    <td className="border border-gray-200 px-4 py-3 text-center font-mono text-sm bg-white">
                                                        {buildRiskIndex({
                                                            riskFormId: riskType,
                                                            sectionNo: g.sectionNo,
                                                            indikatorIndex: indikatorIndex,
                                                            subNo: indikatorIndex
                                                        })}
                                                    </td>

                                                    {/* PARAMETER */}
                                                    <td className="border border-gray-200 px-4 py-3 bg-white text-sm">{r.indikator}</td>

                                                    {/* BOBOT INDIKATOR */}
                                                    <td className="border border-gray-200 px-4 py-3 text-center bg-white text-sm">
                                                        {bobotIndikatorDisplay}
                                                    </td>

                                                    {/* HASIL */}
                                                    <td className="border border-gray-200 px-4 py-3 text-right bg-white text-sm">
                                                        {hasilDisplay}
                                                    </td>

                                                    {/* RISK LEVEL - Using DRY principle with getRiskStyle */}
                                                    {(() => {
                                                        const riskStyle = getRiskStyle(r.peringkat);
                                                        const hasValidPeringkat = !isNaN(Number(r.peringkat)) && Number(r.peringkat) >= 1 && Number(r.peringkat) <= 5;
                                                        
                                                        if (riskType === "kepatuhan") {
                                                            // For Kepatuhan, show risk level if peringkat is valid
                                                            if (hasValidPeringkat) {
                                                                return (
                                                                    <>
                                                                        <td className="border border-gray-200 px-4 py-3 text-center font-bold text-sm">
                                                                            <div 
                                                                                className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${riskStyle.className}`}
                                                                            >
                                                                                {r.peringkat}
                                                                            </div>
                                                                        </td>
                                                                        <td className="border border-gray-200 px-4 py-3 text-center font-semibold text-sm">
                                                                            <div 
                                                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${riskStyle.className}`}
                                                                            >
                                                                                {RISK_LABEL[r.peringkat]}
                                                                            </div>
                                                                        </td>
                                                                    </>
                                                                );
                                                            } else {
                                                                // Show empty cells for Kepatuhan if no valid peringkat
                                                                return (
                                                                    <>
                                                                        <td className="border border-gray-200 px-4 py-3 text-center bg-white text-sm"></td>
                                                                        <td className="border border-gray-200 px-4 py-3 text-center bg-white text-sm"></td>
                                                                    </>
                                                                );
                                                            }
                                                        } else {
                                                            // For other risk types
                                                            return (
                                                                <>
                                                                    <td className="border border-gray-200 px-4 py-3 text-center font-bold text-sm">
                                                                        <div 
                                                                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${riskStyle.className}`}
                                                                        >
                                                                            {r.peringkat}
                                                                        </div>
                                                                    </td>
                                                                    <td className="border border-gray-200 px-4 py-3 text-center font-semibold text-sm">
                                                                        <div 
                                                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${riskStyle.className}`}
                                                                        >
                                                                            {RISK_LABEL[r.peringkat]}
                                                                        </div>
                                                                    </td>
                                                                </>
                                                            );
                                                        }
                                                    })()}
                                                </tr>
                                            );
                                        });
                                    })}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
