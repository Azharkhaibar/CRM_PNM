import React, { useMemo, useEffect } from 'react';
import { useHeaderStore } from '../pages/RiskProfile-OJK/store/headerStore';
import { useOjkData } from '../hooks/useOjkData';
import { ChevronDown } from 'lucide-react';

export default function OjkSection() {
    const { year, activeQuarter, setYear, setActiveQuarter } = useHeaderStore();
    const { 
        kompositA, 
        kompositB, 
        total, 
        kompositAIndicator,
        kompositBIndicator,
        totalIndicator, 
        risks, 
        loading, 
        error 
    } = useOjkData(year, activeQuarter);

    // DEBUG: Lihat struktur data risks yang sebenarnya
    useEffect(() => {
        console.log('Original risks from hook:', risks);
        if (risks.length > 0) {
            console.log('First risk structure:', JSON.stringify(risks[0], null, 2));
            console.log('First risk inherentIndicatorCounts:', risks[0].inherentIndicatorCounts);
        }
    }, [risks]);

    const quarterLabels = {
        q1: 'Maret',
        q2: 'Juni',
        q3: 'September',
        q4: 'Desember'
    };

    const quarterOptions = [
        { value: 'q1', label: 'Q1 - Maret' },
        { value: 'q2', label: 'Q2 - Juni' },
        { value: 'q3', label: 'Q3 - September' },
        { value: 'q4', label: 'Q4 - Desember' }
    ];

    const yearOptions = [];
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 10; i++) {
        yearOptions.push(currentYear - i);
    }

    const quarterLabel = quarterLabels[activeQuarter?.toLowerCase()] || activeQuarter;

    // Fungsi untuk mendapatkan class indikator berdasarkan score
    const getIndicatorClass = (score) => {
        const colors = {
            1: "bg-[#4F6228] text-white",
            2: "bg-[#92D050] text-black",
            3: "bg-[#FFFF00] text-black",
            4: "bg-[#FFC000] text-black",
            5: "bg-[#FF0000] text-white"
        };
        return colors[score] || "bg-gray-400 text-white";
    };

    // Langsung gunakan inherentIndicatorCounts yang sudah ada
    const topRisksByScore = useMemo(() => {
        const result = [...risks]
            .sort((a, b) => b.inherent - a.inherent)
            .slice(0, 3);
        console.log('topRisksByScore:', result);
        return result;
    }, [risks]);

    // Fungsi untuk mendapatkan level tertinggi
    const getHighestLevel = (risk) => {
        const counts = risk.inherentIndicatorCounts || {};
        if (counts.high > 0) return { level: 'high', count: counts.high, color: '#FF0000', text: '#FFFFFF' };
        if (counts.moderateToHigh > 0) return { level: 'moderateToHigh', count: counts.moderateToHigh, color: '#FFC000', text: '#000000' };
        if (counts.moderate > 0) return { level: 'moderate', count: counts.moderate, color: '#FFFF00', text: '#000000' };
        if (counts.lowToModerate > 0) return { level: 'lowToModerate', count: counts.lowToModerate, color: '#92D050', text: '#000000' };
        if (counts.low > 0) return { level: 'low', count: counts.low, color: '#4F6228', text: '#FFFFFF' };
        return { level: 'none', count: 0, color: '#6B7280', text: '#FFFFFF' };
    };

    const getPriority = (level) => {
        const map = { high: 5, moderateToHigh: 4, moderate: 3, lowToModerate: 2, low: 1, none: 0 };
        return map[level] || 0;
    };

    // Hitung top 3 risiko perlu diperhatikan
    const topRisksByAttention = useMemo(() => {
        const mapped = risks.map(risk => {
            const highest = getHighestLevel(risk);
            return { 
                ...risk, 
                attentionLevel: highest.level, 
                attentionCount: highest.count, 
                attentionColor: highest.color, 
                attentionText: highest.text 
            };
        });
        
        console.log('Mapped risks with attention:', mapped);
        console.log('InherentIndicatorCounts for each risk:', risks.map(r => r.inherentIndicatorCounts));
        
        const sorted = [...mapped]
            .sort((a, b) => {
                const priorityA = getPriority(a.attentionLevel);
                const priorityB = getPriority(b.attentionLevel);
                if (priorityA !== priorityB) return priorityB - priorityA;
                return b.attentionCount - a.attentionCount;
            });
            
        const result = sorted.slice(0, 3);
        console.log('topRisksByAttention final:', result);
        
        return result;
    }, [risks]);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="relative rounded-xl overflow-hidden mb-4 shadow-sm bg-gradient-to-r from-blue-600 to-indigo-600">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_0%,white,transparent_40%),radial-gradient(circle_at_80%_100%,white,transparent_35%)]" />
                    <div className="relative px-4 py-5 sm:px-5 sm:py-6">
                        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white drop-shadow-sm">
                            🏛️ OJK 
                        </h1>
                        <p className="mt-1 text-white/90 text-xs">
                            Peringkat Risiko komposit untuk OJK
                        </p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-8 text-center">
                    <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="relative rounded-xl overflow-hidden mb-4 shadow-sm bg-gradient-to-r from-blue-600 to-indigo-600">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_0%,white,transparent_40%),radial-gradient(circle_at_80%_100%,white,transparent_35%)]" />
                    <div className="relative px-4 py-5 sm:px-5 sm:py-6">
                        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white drop-shadow-sm">
                            🏛️ OJK 
                        </h1>
                        <p className="mt-1 text-white/90 text-xs">
                            Peringkat Risiko komposit untuk OJK
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-8 text-center">
                    <div className="mb-4">
                        <svg className="mx-auto h-16 w-16 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error Memuat Data</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    if (!loading && risks.length === 0) {
        return (
            <div className="space-y-6">
                <div className="relative rounded-xl overflow-hidden mb-4 shadow-sm bg-gradient-to-r from-blue-600 to-indigo-600">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_0%,white,transparent_40%),radial-gradient(circle_at_80%_100%,white,transparent_35%)]" />
                    <div className="relative px-4 py-5 sm:px-5 sm:py-6">
                        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white drop-shadow-sm">
                            🏛️ OJK 
                        </h1>
                        <p className="mt-1 text-white/90 text-xs">
                            Peringkat Risiko komposit untuk OJK
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-8 text-center">
                    <div className="mb-4">
                        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Data OJK Tidak Tersedia</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Belum ada data untuk periode {quarterLabel} {year}. Silakan input data di halaman Risk Profile terlebih dahulu.
                    </p>
                </div>
            </div>
        );
    }

    console.log('Rendering with topRisksByAttention:', topRisksByAttention);

    return (
        <div className="space-y-6">
            {/* Header Section OJK dengan Dropdown */}
            <div className="relative rounded-xl overflow-hidden shadow-sm bg-gradient-to-r from-blue-600 to-indigo-600">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_0%,white,transparent_40%),radial-gradient(circle_at_80%_100%,white,transparent_35%)]" />
                
                <div className="relative px-4 py-5 sm:px-5 sm:py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white drop-shadow-sm">
                                🏛️ OJK 
                            </h1>
                            <p className="mt-1 text-white/90 text-xs">
                                Peringkat Risiko komposit untuk OJK - {quarterLabel} {year}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative">
                                <select
                                    value={year}
                                    onChange={(e) => setYear(parseInt(e.target.value))}
                                    className="appearance-none bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg pl-4 pr-10 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/30 cursor-pointer hover:bg-white/20 transition-colors"
                                >
                                    {yearOptions.map((y) => (
                                        <option key={y} value={y} className="text-gray-900">
                                            {y}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70 pointer-events-none" />
                            </div>

                            <div className="relative">
                                <select
                                    value={activeQuarter}
                                    onChange={(e) => setActiveQuarter(e.target.value)}
                                    className="appearance-none bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg pl-4 pr-10 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/30 cursor-pointer hover:bg-white/20 transition-colors min-w-[140px]"
                                >
                                    {quarterOptions.map((q) => (
                                        <option key={q.value} value={q.value} className="text-gray-900">
                                            {q.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Komposit Inherent Card */}
                <div className="bg-white shadow-md border border-gray-300 p-6 rounded-xl flex items-center gap-5">
                    <div className={`w-20 h-20 rounded-lg flex items-center justify-center shadow ${getIndicatorClass(kompositAIndicator?.score || 0)}`}>
                        <span className="text-2xl font-bold">
                            {kompositAIndicator?.score || 0}
                        </span>
                    </div>
                    <div className="flex-1 text-center">
                        <p className="text-lg font-semibold border-b border-black inline-block px-3 pb-1">
                            Komposit Inherent
                        </p>
                        <p className="text-2xl font-bold mt-1">
                            {kompositA?.toFixed(2) || '0.00'}
                        </p>
                        <p className="text-sm font-medium mt-1" style={{ color: kompositAIndicator?.color }}>
                            {kompositAIndicator?.label || 'Data Tidak Ditemukan'}
                        </p>
                    </div>
                </div>

                {/* Komposit KPMR Card */}
                <div className="bg-white shadow-md border border-gray-300 p-6 rounded-xl flex items-center gap-5">
                    <div className={`w-20 h-20 rounded-lg flex items-center justify-center shadow ${getIndicatorClass(kompositBIndicator?.score || 0)}`}>
                        <span className="text-2xl font-bold">
                            {kompositBIndicator?.score || 0}
                        </span>
                    </div>
                    <div className="flex-1 text-center">
                        <p className="text-lg font-semibold border-b border-black inline-block px-3 pb-1">
                            Komposit KPMR
                        </p>
                        <p className="text-2xl font-bold mt-1">
                            {kompositB?.toFixed(2) || '0.00'}
                        </p>
                        <p className="text-sm font-medium mt-1" style={{ color: kompositBIndicator?.color }}>
                            {kompositBIndicator?.label || 'Data Tidak Ditemukan'}
                        </p>
                    </div>
                </div>

                {/* Peringkat Komposit Card */}
                <div className="bg-white shadow-md border border-gray-300 p-6 rounded-xl flex items-center gap-5">
                    <div className={`w-20 h-20 rounded-lg flex items-center justify-center shadow ${getIndicatorClass(totalIndicator?.score || 0)}`}>
                        <span className="text-2xl font-bold">
                            {totalIndicator?.score || 0}
                        </span>
                    </div>
                    <div className="flex-1 text-center">
                        <p className="text-lg font-semibold border-b border-black inline-block px-3 pb-1">
                            Peringkat Komposit
                        </p>
                        <p className="text-2xl font-bold mt-1">
                            {total?.toFixed(2) || '0.00'}
                        </p>
                        <p className="text-sm font-medium mt-1" style={{ color: totalIndicator?.color }}>
                            {totalIndicator?.label || 'Data Tidak Ditemukan'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Dua Tabel: Risiko Tertinggi dan Perlu Diperhatikan */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tabel Risiko Tertinggi (berdasarkan skor) */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                    <h3 className="text-lg font-semibold mb-3">🔥 Risiko Tertinggi</h3>
                    {topRisksByScore.length > 0 ? (
                        <div className="space-y-2">
                            {topRisksByScore.map((risk, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium">{risk.label}</span>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="px-2 py-2 rounded-lg text-md font-bold shadow"
                                            style={{
                                                backgroundColor: risk.inherentIndicator?.color,
                                                color: risk.inherentIndicator?.text
                                            }}
                                        >
                                            {risk.inherent.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">Tidak ada data</p>
                    )}
                </div>

{/* Tabel Risiko Perlu Diperhatikan */}
<div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
    <h3 className="text-lg font-semibold mb-3">⚠️ Risiko Perlu Diperhatikan</h3>
    {topRisksByAttention.length > 0 ? (
        <div className="space-y-2">
            {topRisksByAttention.map((risk, idx) => {
                // Coba berbagai kemungkinan nama properti
                const counts = risk.inherentIndicatorCounts || 
                              risk.indicatorCounts || 
                              risk.counts || 
                              risk.nilaiList?.reduce((acc, item) => {
                                  const level = item.riskindikator?.high ? 'high' : 
                                               item.riskindikator?.moderateToHigh ? 'moderateToHigh' :
                                               item.riskindikator?.moderate ? 'moderate' : null;
                                  if (level) acc[level] = (acc[level] || 0) + 1;
                                  return acc;
                              }, {}) || {};
                
                // Hitung ulang dari nilaiList jika perlu
                if (risk.nilaiList && Object.keys(counts).length === 0) {
                    risk.nilaiList.forEach(nilai => {
                        if (nilai.riskindikator?.high) counts.high = (counts.high || 0) + 1;
                        if (nilai.riskindikator?.moderateToHigh) counts.moderateToHigh = (counts.moderateToHigh || 0) + 1;
                        if (nilai.riskindikator?.moderate) counts.moderate = (counts.moderate || 0) + 1;
                    });
                }
                
                console.log(`Risk ${risk.label} counts after resolution:`, counts);
                
                // Hanya tampilkan level high, moderateToHigh, dan moderate
                const levels = [];
                if (counts.high > 0) levels.push({ level: 'HIGH', color: '#FF0000', text: '#FFFFFF', count: counts.high });
                if (counts.moderateToHigh > 0) levels.push({ level: 'MODERATE TO HIGH', color: '#FFC000', text: '#000000', count: counts.moderateToHigh });
                if (counts.moderate > 0) levels.push({ level: 'MODERATE', color: '#FFFF00', text: '#000000', count: counts.moderate });

                return (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{risk.label}</span>
                        <div className="flex items-center gap-2">
                            {levels.length > 0 ? (
                                levels.map((level, i) => (
                                    <div
                                        key={i}
                                        className="px-2 py-1 rounded flex items-center justify-center text-sm font-bold min-w-[40px]"
                                        style={{ backgroundColor: level.color, color: level.text }}
                                        title={`${level.level}: ${level.count} indikator`}
                                    >
                                        {level.count}
                                    </div>
                                ))
                            ) : (
                                <span className="text-xs text-gray-400">Tidak ada risiko tinggi</span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    ) : (
        <p className="text-gray-500 text-center py-4">Tidak ada data</p>
    )}
</div>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                    📌 <strong>Informasi Data:</strong> Menampilkan data dari {risks.length} jenis risiko untuk periode {quarterLabel} {year}.
                </p>
            </div>
        </div>
    );
}