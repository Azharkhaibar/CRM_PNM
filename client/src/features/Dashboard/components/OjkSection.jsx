import React from 'react';
import DashboardSummary from './DashboardSummary';
import TopRisksList from './TopRisksList';
import RiskAttention from './RiskAttention';

/**
 * Component untuk section OJK (template statis untuk sementara)
 * Data dummy akan diganti dengan data real ketika fitur OJK sudah ditambahkan
 */
export default function OjkSection() {
    // Data dummy untuk template OJK
    const dummyData = {
        kompositA: 2.10,
        kompositB: 1.85,
        total: 1.98,
        risks: [
            { label: 'Reputasi', inherent: 2.80, kpmr: 2.40 },
            { label: 'Operasional', inherent: 2.50, kpmr: 2.20 },
            { label: 'Pasar', inherent: 2.30, kpmr: 2.00 },
            { label: 'Likuiditas', inherent: 2.10, kpmr: 1.90 },
            { label: 'Investasi', inherent: 1.80, kpmr: 1.60 },
            { label: 'Hukum', inherent: 1.50, kpmr: 1.40 },
            { label: 'Stratejik', inherent: 1.70, kpmr: 1.50 },
            { label: 'Kepatuhan', inherent: 1.60, kpmr: 1.45 },
        ],
    };

    return (
        <div className="space-y-6">
            {/* Header Section OJK */}
            <div className="relative rounded-xl overflow-hidden mb-4 shadow-sm bg-gradient-to-r from-[#1a4d8f]/90 via-[#2d6fb5]/90 to-[#1a4d8f]/90">
                {/* overlay cahaya */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_0%,white,transparent_40%),radial-gradient-gradient(circle_at_80%_100%,white,transparent_35%)]" />

                <div className="relative px-4 py-5 sm:px-5 sm:py-6">
                    <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white drop-shadow-sm">
                        🏛️ OJK (BANK INDONESIA)
                    </h1>
                    <p className="mt-1 text-white/90 text-xs">
                        Peringkat Risiko untuk Kepatuhan OJK
                    </p>
                </div>
            </div>

            {/* KPI Cards */}
            <DashboardSummary
                kompositA={dummyData.kompositA}
                kompositB={dummyData.kompositB}
                total={dummyData.total}
            />

            {/* Top Risks dan Attention Risks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopRisksList risks={dummyData.risks} />
                <RiskAttention risks={dummyData.risks} />
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                    📌 <strong>Catatan:</strong> Data OJK ini adalah template statis. 
                    Data real akan ditampilkan ketika fitur OJK sudah ditambahkan.
                </p>
            </div>
        </div>
    );
}
