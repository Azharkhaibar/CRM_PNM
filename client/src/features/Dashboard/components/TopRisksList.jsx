import React from 'react';
import { formatNumber, getRiskLevel, getRiskColor } from '../hooks/useDashboardData';

/**
 * Component untuk menampilkan 3 risiko dengan skor tertinggi
 * Menggunakan data real dari useRiskSubRiskData
 * 
 * @param {object} props
 * @param {array} props.riskData - Array data risiko dengan skorRisiko dan label
 */
export default function TopRisksList({ riskData = [] }) {
    // Ambil top 3 risiko dengan skor tertinggi
    // Data sudah di-sort oleh hook berdasarkan skorRisiko
    const topRisks = React.useMemo(() => {
        if (!riskData || !Array.isArray(riskData) || riskData.length === 0) {
            return [];
        }

        const sorted = [...riskData].sort((a, b) => b.skorRisiko - a.skorRisiko);
        const top3 = sorted.slice(0, 3);
        
        console.log('[TopRisksList] Total risks:', riskData.length);
        console.log('[TopRisksList] Top 3 risks:', top3.map(r => ({
            label: r.label,
            skorRisiko: r.skorRisiko.toFixed(2),
            summary: r.summary.toFixed(2)
        })));
        
        return top3;
    }, [riskData]);

    if (!topRisks || topRisks.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-slate-700 mb-4">
                    🎯 RISIKO TERTINGGI
                </h3>
                <p className="text-slate-500 text-sm">Belum ada data risiko</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-slate-700 mb-6">
                🎯 RISIKO TERTINGGI
            </h3>
            <div className="space-y-4">
                {topRisks.map((risk, index) => {
                    const level = getRiskLevel(risk.skorRisiko);
                    const color = getRiskColor(level);

                    return (
                        <div
                            key={risk.type}
                            className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors border border-gray-100"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-base font-bold">
                                    {index + 1}
                                </div>
                                <span className="text-lg font-semibold text-slate-900">
                                    {risk.label}
                                </span>
                            </div>
                            <div
                                className="px-5 py-2 rounded-full text-xl font-bold"
                                style={{ 
                                    backgroundColor: color.bg,
                                    color: color.text
                                }}
                                title={`Peringkat ${level}`}
                            >
                                {formatNumber(risk.skorRisiko, 2)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
