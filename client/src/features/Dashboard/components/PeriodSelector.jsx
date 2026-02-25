import React, { useMemo } from 'react';
import { Calendar } from 'lucide-react';

const REKAP1_FINAL_KEY = "rekap1_final_summary_v1";

/**
 * Component dropdown untuk memilih Tahun dan Triwulan
 * @param {object} props
 * @param {number} props.year - Tahun yang dipilih
 * @param {function} props.setYear - Function untuk set tahun
 * @param {string} props.quarter - Quarter yang dipilih (Q1, Q2, Q3, Q4)
 * @param {function} props.setQuarter - Function untuk set quarter
 */
export default function PeriodSelector({ year, setYear, quarter, setQuarter }) {
    // Get available years from localStorage
    const availableYears = useMemo(() => {
        try {
            const raw = localStorage.getItem(REKAP1_FINAL_KEY) || "{}";
            const parsed = JSON.parse(raw);
            const years = Object.keys(parsed).map(Number).sort((a, b) => a - b);
            // If no data, return default range
            return years.length > 0 ? years : [2023, 2024, 2025, 2026, 2027, 2028];
        } catch {
            return [2023, 2024, 2025, 2026, 2027, 2028];
        }
    }, []);

    const quarters = [
        { value: 'Q1', label: 'Triwulan 1 (Jan-Mar)' },
        { value: 'Q2', label: 'Triwulan 2 (Apr-Jun)' },
        { value: 'Q3', label: 'Triwulan 3 (Jul-Sep)' },
        { value: 'Q4', label: 'Triwulan 4 (Oct-Des)' },
    ];

    return (
        <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
            <Calendar className="w-4 h-4 text-white opacity-90" />
            
            {/* Year Selector */}
            <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="bg-transparent text-white text-sm font-semibold focus:outline-none cursor-pointer"
            >
                {availableYears.map((y) => (
                    <option key={y} value={y} className="text-slate-900">
                        {y}
                    </option>
                ))}
            </select>

            {/* Quarter Selector */}
            <select
                value={quarter}
                onChange={(e) => setQuarter(e.target.value)}
                className="bg-transparent text-white text-sm font-semibold focus:outline-none cursor-pointer"
            >
                {quarters.map((q) => (
                    <option key={q.value} value={q.value} className="text-slate-900">
                        {q.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
