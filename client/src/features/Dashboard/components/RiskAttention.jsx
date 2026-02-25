import React from 'react';
import { formatRiskCategories } from '../hooks/useRiskSubRiskData';

/**
 * Component untuk menampilkan 3 risiko yang perlu diperhatikan
 * Menggunakan format compact dengan emoji kotak warna
 * Contoh: "2🔴 3🟠 1🟡" = 2 High, 3 Moderate to High, 1 Moderate
 * 
 * KRITERIA: Menampilkan 3 risiko dengan jumlah HIGH (🔴) terbanyak
 * Jika sama, gunakan Moderate-High (🟠) sebagai tiebreaker
 * 
 * @param {object} props
 * @param {array} props.riskData - Array data risiko dengan categories
 */
export default function RiskAttention({ riskData = [] }) {
    // Ambil 3 risiko dengan High (🔴) terbanyak
    const attentionRisks = React.useMemo(() => {
        if (!riskData || riskData.length === 0) return [];
        
        // Sort berdasarkan:
        // 1. High (🔴) terbanyak - prioritas utama
        // 2. Moderate-High (🟠) terbanyak - tiebreaker
        // 3. Moderate (🟡) terbanyak - tiebreaker kedua
        const sorted = [...riskData].sort((a, b) => {
            // Primary: High count
            if (b.categories.high !== a.categories.high) {
                return b.categories.high - a.categories.high;
            }
            // Secondary: Moderate-High count
            if (b.categories.moderateHigh !== a.categories.moderateHigh) {
                return b.categories.moderateHigh - a.categories.moderateHigh;
            }
            // Tertiary: Moderate count
            if (b.categories.moderate !== a.categories.moderate) {
                return b.categories.moderate - a.categories.moderate;
            }
            // Fallback: skor risiko tertinggi
            return b.skorRisiko - a.skorRisiko;
        });
        
        const top3 = sorted.slice(0, 3);
        
        console.log('[RiskAttention] Sorted by High count:', top3.map(r => ({
            label: r.label,
            high: r.categories.high,
            moderateHigh: r.categories.moderateHigh,
            moderate: r.categories.moderate,
            format: formatRiskCategories(r.categories)
        })));
        
        return top3;
    }, [riskData]);

    if (attentionRisks.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-slate-700 mb-4">
                    ⚠️ RISIKO PERLU PERHATIAN
                </h3>
                <p className="text-slate-500 text-sm">Belum ada data risiko</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-slate-700 mb-6">
                ⚠️ RISIKO PERLU PERHATIAN
            </h3>
            <div className="space-y-4">
                {attentionRisks.map((risk, index) => (
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
                        <div className="text-2xl font-bold text-slate-700">
                            {formatRiskCategories(risk.categories)}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-6 mt-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🔴</span>
                    <span className="font-medium">High (5)</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xl">🟠</span>
                    <span className="font-medium">Mod-High (4)</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xl">🟡</span>
                    <span className="font-medium">Moderate (3)</span>
                </div>
            </div>
        </div>
    );
}
