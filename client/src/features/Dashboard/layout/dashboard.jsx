import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '../../../shared/components/Darkmodecontext';
import { useDashboardData, getLastAvailablePeriod } from '../hooks/useDashboardData';
import { useRiskSubRiskData } from '../hooks/useRiskSubRiskData';
import DashboardSummary from '../components/DashboardSummary';
import TopRisksList from '../components/TopRisksList';
import RiskAttention from '../components/RiskAttention';
import OjkSection from '../components/OjkSection';
import RecentActivity from '../components/RecentActivity';
import PeriodSelector from '../components/PeriodSelector';
import { Download } from 'lucide-react';

export default function Dashboard() {
    const { darkMode } = useDarkMode();
    
    // Initialize with last available period
    const lastPeriod = useMemo(() => getLastAvailablePeriod(), []);
    const [year, setYear] = useState(lastPeriod.year);
    const [quarter, setQuarter] = useState(lastPeriod.quarter);
    
    // Tab state: 'holding' or 'ojk'
    const [activeTab, setActiveTab] = useState('holding');

    // Load data dari localStorage
    const holdingData = useDashboardData(year, quarter);

    // Load sub-risk data dari semua jenis risiko
    const { riskData, loading, error } = useRiskSubRiskData(year, quarter);

    const welcomeCardStyle = {
        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
        color: 'white',
        padding: '1.5rem',
        borderRadius: '1rem',
        marginBottom: '1.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    };

    const tabButtonStyle = (isActive) => ({
        padding: '0.75rem 2rem',
        borderRadius: '0.75rem 0.75rem 0 0',
        fontWeight: '600',
        fontSize: '1rem',
        backgroundColor: isActive 
            ? (darkMode ? '#1e40af' : '#2563eb') 
            : (darkMode ? '#374151' : '#e5e7eb'),
        color: isActive 
            ? 'white' 
            : (darkMode ? '#9ca3af' : '#6b7280'),
        border: `1px solid ${isActive ? 'transparent' : (darkMode ? '#4b5563' : '#d1d5db')}`,
        borderBottom: isActive ? 'none' : `1px solid ${darkMode ? '#4b5563' : '#d1d5db'}`,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        marginBottom: '-1px',
        position: 'relative',
        top: '1px',
    });

    return (
        <div className={`p-6 min-h-screen ${darkMode ? 'dark-mode-bg' : 'bg-gray-50'}`}>
            {/* Welcome Card */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={welcomeCardStyle}
            >
                <h2 className="text-2xl font-semibold">Welcome Back 👋</h2>
                <p className="text-blue-100 mt-1">
                    Senang melihat Anda kembali. Semoga hari Anda produktif!
                </p>
            </motion.div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('holding')}
                    style={tabButtonStyle(activeTab === 'holding')}
                    className="hover:shadow-md"
                >
                    🏢 HOLDING
                </button>
                <button
                    onClick={() => setActiveTab('ojk')}
                    style={tabButtonStyle(activeTab === 'ojk')}
                    className="hover:shadow-md"
                >
                    🏛️ OJK 
                </button>
            </div>

            {/* Content based on active tab */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'holding' ? (
                        <div className="mb-8">
                            {/* Section Header */}
                            <div className="relative rounded-xl overflow-hidden mb-4 shadow-sm bg-gradient-to-r from-[#0076C6]/90 via-[#00A3DA]/90 to-[#33C2B5]/90">
                                {/* overlay cahaya */}
                                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_0%,white,transparent_40%),radial-gradient(circle_at_80%_100%,white,transparent_35%)]" />

                                <div className="relative px-4 py-5 sm:px-5 sm:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    {/* Title */}
                                    <div>
                                        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white drop-shadow-sm">
                                            🏢 HOLDING
                                        </h1>
                                        <p className="mt-1 text-white/90 text-xs">
                                            Peringkat Risiko Komposit
                                        </p>
                                    </div>

                                    {/* Actions Container */}
                                    <div className="flex items-center gap-3">
                                        {/* Period Selector */}
                                        <PeriodSelector
                                            year={year}
                                            setYear={setYear}
                                            quarter={quarter}
                                            setQuarter={setQuarter}
                                        />
                                    </div>
                                </div>
                            </div>

                            {holdingData ? (
                                <>
                                    {/* KPI Cards */}
                                    <DashboardSummary
                                        kompositA={holdingData.kompositA}
                                        kompositB={holdingData.kompositB}
                                        total={holdingData.total}
                                    />

                                    {/* Top Risks dan Attention Risks */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                                        <TopRisksList riskData={riskData} />
                                        <RiskAttention riskData={riskData} />
                                    </div>
                                </>
                            ) : (
                                <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 text-center">
                                    <p className="text-slate-500">
                                        Belum ada data untuk periode {year} {quarter}. 
                                        Silakan input data di halaman Risk Profile terlebih dahulu.
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="mb-8">
                            <OjkSection />
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* ===================== RECENT ACTIVITY ===================== */}
            <RecentActivity />
        </div>
    );
}
