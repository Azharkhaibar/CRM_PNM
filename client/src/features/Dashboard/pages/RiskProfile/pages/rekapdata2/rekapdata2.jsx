// RekapData2.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { Shield, ShieldCheck, ShieldAlert, Download } from 'lucide-react';
import { useRekapData2Dashboard } from './hooks/rekapdata2.hook';
import {
  RekapData2ExportDialog,
  HeaderWithFilter,
  SummaryCard,
  RiskTable,
  RiskMatrix,
  AlertBox,
} from './components/rekapdata2.component';
import { RISK_LABEL } from './utils/rekapdata2.utils';
import { exportRekap2ToExcel } from './utils/exportExcelRekap2';

// Helper skor ke level
const skorToLevel = (skor) => {
  if (skor < 1.5) return 1;
  if (skor < 2.5) return 2;
  if (skor < 3.5) return 3;
  if (skor < 4.5) return 4;
  return 5;
};

// Label untuk KPMR
const kpmrLabel = (level) => {
  if (!level || level === 0) return '-';
  if (level === 1) return 'Strong';
  if (level === 2) return 'Satisfactory';
  if (level === 3) return 'Fair';
  if (level === 4) return 'Marginal';
  return 'Unsatisfactory';
};

export default function RekapData2() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [quarter, setQuarter] = useState('Q4');

  // API Hooks
  const { dashboardData, loading: dashboardLoading, refresh: refreshDashboard, error } = useRekapData2Dashboard(year, quarter);

  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormatOptions, setExportFormatOptions] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rekapData2ExportFormat');
      return saved ? JSON.parse(saved) : { hasilFormat: 'smart', pemisahFormat: 'indonesia' };
    }
    return { hasilFormat: 'smart', pemisahFormat: 'indonesia' };
  });

  // ===================== AUTO REFRESH DASHBOARD =====================
  useEffect(() => {
    if (year && quarter) {
      refreshDashboard();
    }
  }, [year, quarter, refreshDashboard]);

  // ===================== HANDLE EXPORT =====================
  const handleExport = () => setExportDialogOpen(true);

  const handleConfirmExport = useCallback(() => {
    setExportDialogOpen(false);
    exportRekap2ToExcel({
      year,
      quarter,
      dashboardData,
      formatOptions: exportFormatOptions,
    });
  }, [year, quarter, dashboardData, exportFormatOptions]);

  // ===================== LOADING STATE =====================
  if (dashboardLoading) {
    return (
      <div className="p-6 bg-[#f3f6f8] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  // ===================== ERROR STATE =====================
  if (error) {
    return (
      <div className="p-6 bg-[#f3f6f8] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={refreshDashboard} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // ===================== RENDER =====================
  return (
    <div className="p-6 bg-[#f3f6f8] min-h-screen font-['Plus_Jakarta_Sans',system-ui,sans-serif]">
      <HeaderWithFilter title="Rekap Data 2" subtitle="Profil Risiko Perusahaan" year={year} setYear={setYear} quarter={quarter} setQuarter={setQuarter} />

      <div className="flex justify-end mb-4">
        <button
          onClick={handleExport}
          disabled={!dashboardData || !dashboardData.rows || dashboardData.rows.length === 0}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-md ${
            (!dashboardData || !dashboardData.rows || dashboardData.rows.length === 0) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Export Excel</span>
        </button>
      </div>

      {dashboardData.isEmpty && <AlertBox title="Data Belum Tersedia" message="Data Rekap 1 belum tersedia untuk periode ini. Nilai ditampilkan sebagai default." type="warning" />}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
          <div className="min-h-[400px]">
            <RiskTable data={dashboardData.rows} skorProfil={dashboardData.skorProfil} quarter={quarter} year={year} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SummaryCard
              title="Inherent Risk"
              score={dashboardData.skorProfil.inherent}
              level={dashboardData.skorProfil.inherent}
              label={RISK_LABEL[dashboardData.skorProfil.inherent] || '-'}
              icon={<Shield className="h-5 w-5" />}
            />
            <SummaryCard title="KPMR" score={dashboardData.skorProfil.kpmr} level={dashboardData.skorProfil.kpmr} label={kpmrLabel(dashboardData.skorProfil.kpmr)} icon={<ShieldCheck className="h-5 w-5" />} />
            <SummaryCard title="Net Risk" score={dashboardData.skorProfil.net} level={dashboardData.skorProfil.net} label={RISK_LABEL[dashboardData.skorProfil.net] || '-'} icon={<ShieldAlert className="h-5 w-5" />} />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          <RiskMatrix inherentLevel={dashboardData.skorProfil.inherent} kpmrLevel={dashboardData.skorProfil.kpmr} showLegend={false} className="h-full" year={year} quarter={quarter} />

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-[#1e3a8a] text-white px-5 py-3">
              <h3 className="text-sm font-bold tracking-tight uppercase">Risk Level Legend</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-8 bg-[#2e7d32] rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-black text-lg">1</span>
                  </div>
                  <span className="text-xs font-bold text-gray-700">Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-8 bg-[#92D050] rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-black text-lg">2</span>
                  </div>
                  <span className="text-xs font-bold text-gray-700">Low to Moderate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-8 bg-[#ffff00] rounded-full flex items-center justify-center shadow-md">
                    <span className="text-gray-800 font-black text-lg">3</span>
                  </div>
                  <span className="text-xs font-bold text-gray-700">Moderate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-8 bg-[#ffc000] rounded-full flex items-center justify-center shadow-md">
                    <span className="text-gray-900 font-black text-lg">4</span>
                  </div>
                  <span className="text-xs font-bold text-gray-700">Moderate to High</span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <div className="w-12 h-8 bg-[#ff0000] rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-black text-lg">5</span>
                  </div>
                  <span className="text-xs font-bold text-gray-700">High</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {exportDialogOpen && <RekapData2ExportDialog options={exportFormatOptions} setOptions={setExportFormatOptions} onConfirm={handleConfirmExport} onCancel={() => setExportDialogOpen(false)} />}
    </div>
  );
}
