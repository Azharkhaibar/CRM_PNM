import React from 'react';
import { formatNumber, getRiskLevel, getRiskLabel, getRiskColor } from '../hooks/useDashboardData';

/**
 * Component untuk menampilkan 3 KPI Cards: Komposit A, B, dan Final
 * @param {object} props
 * @param {number} props.kompositA - Skor Komposit A (Inheren)
 * @param {number} props.kompositB - Skor Komposit B (KPMR)
 * @param {number} props.total - Skor Komposit Final
 */
export default function DashboardSummary({ kompositA, kompositB, total }) {
    const levelA = getRiskLevel(kompositA);
    const levelB = getRiskLevel(kompositB);
    const levelTotal = getRiskLevel(total);

    const colorA = getRiskColor(levelA);
    const colorB = getRiskColor(levelB);
    const colorTotal = getRiskColor(levelTotal);

    const Card = ({ title, subtitle, value, level, color, badge }) => (
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-extrabold tracking-wide text-slate-500 uppercase">
                        {title}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
                        {badge}
                    </div>
                </div>

                {/* Content */}
                <div className="flex items-center gap-4">
                    {/* Level Box */}
                    <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: color.bg }}
                    >
                        {level}
                    </div>

                    {/* Score */}
                    <div className="flex-1">
                        <div className="text-2xl font-bold text-slate-900">
                            {formatNumber(value, 2)}
                        </div>
                        <div className="text-base font-bold text-slate-500">
                            {getRiskLabel(value)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
                title="Inherent Risk"
                subtitle="Risiko Inheren"
                value={kompositA}
                level={levelA}
                color={colorA}
                badge="A"
            />
            <Card
                title="KPMR"
                subtitle="Kualitas Penerapan Manajemen Risiko"
                value={kompositB}
                level={levelB}
                color={colorB}
                badge="B"
            />
            <Card
                title="Peringkat Komposit"
                subtitle="Final"
                value={total}
                level={levelTotal}
                color={colorTotal}
                badge="F"
            />
        </div>
    );
}
