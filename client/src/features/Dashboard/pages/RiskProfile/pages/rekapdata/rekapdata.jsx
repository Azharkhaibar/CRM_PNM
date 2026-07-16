// rekapdata.jsx
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Copy } from 'lucide-react';

// Hooks
import { useRekapDataState, useRekapDataFilters, useRekapDataPersist } from './hooks/rekap-data.hook';
import { useAuditLog } from '../../../audit-log/hooks/audit-log.hooks';
import { rekapDataAPI } from './services/rekap-data-api';

// Components
import { RekapDataHeader, RekapDataFilterPills, RekapDataSectionFilter, RekapDataQuarterFilter, RekapDataTriwulanTable, RekapDataTahunanTable, RekapDataExportDialog } from './components/rekap-data.components';

// Utils
import { RISK_SOURCES, PNM_BRAND, QUARTER_LABEL, makeRowKey, computeHasilFromValues, normalizeRow } from './utils/rekap-data.utils';

// External utils
import { calculatePeringkat, calculatePeringkatFromText, isNumericRiskLevels } from './utils/riskcalculator';

import { exportRekapDataToExcel } from './utils/exportrekapdata';

export default function RekapData() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [quarter, setQuarter] = useState('Q4');
  const [activeTab, setActiveTab] = useState('triwulan');
  const fileInputRef = useRef(null);

  // Audit log hook
  const { logCreate, logDelete } = useAuditLog();

  const getCurrentUser = () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser && storedUser.user_id) return { id: storedUser.user_id, name: storedUser.userID || storedUser.username || 'Unknown', role: storedUser.role || 'User' };
    } catch (e) { console.warn('Cannot parse user from localStorage:', e); }
    return { id: null, name: 'System', role: 'System' };
  };

  // State from API
  const rowsState = useRekapDataState(year, quarter, activeTab);
  const filters = useRekapDataFilters();
  const { reloadSections, updateRowAPI, importExcelAPI, cleanupDuplicatesAPI, clonePeriodAPI, saving } = useRekapDataPersist(rowsState.setters, rowsState.refresh);

  // Export dialog
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormatOptions, setExportFormatOptions] = useState(() => {
    // Export format tetap pakai localStorage karena hanya UI preference
    const saved = localStorage.getItem('rekapDataExportFormat');
    return saved ? JSON.parse(saved) : { hasilFormat: 'smart', pemisahFormat: 'indonesia' };
  });

  // Clone dialog states
  const [cloneDialogOpen, setCloneDialogOpen] = useState(false);
  const [cloneSourceYear, setCloneSourceYear] = useState(year);
  const [cloneSourceQuarter, setCloneSourceQuarter] = useState(quarter);
  const [cloneTargetYear, setCloneTargetYear] = useState(year);
  const [cloneTargetQuarter, setCloneTargetQuarter] = useState('Q1');
  const [cloneOverrideExisting, setCloneOverrideExisting] = useState(false);
  const [cloneSelectedSources, setCloneSelectedSources] = useState(RISK_SOURCES);
  const [cloning, setCloning] = useState(false);

  // Auto-set clone target period dynamically based on current period
  useEffect(() => {
    setCloneSourceYear(year);
    setCloneSourceQuarter(quarter);
    if (quarter === 'Q4') {
      setCloneTargetYear(year + 1);
      setCloneTargetQuarter('Q1');
    } else {
      setCloneTargetYear(year);
      const qNum = parseInt(quarter.replace('Q', ''), 10);
      setCloneTargetQuarter(`Q${qNum + 1}`);
    }
  }, [year, quarter]);

  // Import state
  const [importing, setImporting] = useState(false);

  const periodeLabel = `${QUARTER_LABEL[quarter] || ''} ${year}`;

  // Destructure rows
  const { investasiRows, pasarRows, likuiditasRows, operasionalRows, hukumRows, stratejikRows, kepatuhanRows, reputasiRows, operasionalSections, hukumSections, stratejikSections, kepatuhanSections, reputasiSections, loading, error } =
    rowsState;

  // Combined Groups
  const combinedGroups = useMemo(() => {
    let list = [
      ...investasiRows.map((r) => normalizeRow(r, 'INVESTASI', year, quarter)),
      ...pasarRows.map((r) => normalizeRow(r, 'PASAR', year, quarter)),
      ...likuiditasRows.map((r) => normalizeRow(r, 'LIKUIDITAS', year, quarter)),
      ...operasionalRows.map((r) => normalizeRow(r, 'OPERASIONAL', year, quarter)),
      ...hukumRows.map((r) => normalizeRow(r, 'HUKUM', year, quarter)),
      ...stratejikRows.map((r) => normalizeRow(r, 'STRATEJIK', year, quarter)),
      ...kepatuhanRows.map((r) => normalizeRow(r, 'KEPATUHAN', year, quarter)),
      ...reputasiRows.map((r) => normalizeRow(r, 'REPUTASI', year, quarter)),
    ];

    list = list.filter((row) => row.year === year && row.quarter === quarter);

    const seen = new Map();
    list = list.filter((row) => {
      const key = `${row.source}-${row.sectionLabel}-${row.indikator}`;
      if (seen.has(key)) {
        const existing = seen.get(key);
        const existingScore = (existing.numeratorValue ? 2 : 0) + (existing.denominatorValue ? 1 : 0);
        const currentScore = (row.numeratorValue ? 2 : 0) + (row.denominatorValue ? 1 : 0);
        if (currentScore > existingScore) {
          seen.set(key, row);
          return true;
        }
        return false;
      }
      seen.set(key, row);
      return true;
    });

    list = Array.from(seen.values());

    if (filters.query.trim()) {
      const q = filters.query.toLowerCase();
      list = list.filter((r) => (r.sectionLabel || '').toLowerCase().includes(q) || (r.indikator || '').toLowerCase().includes(q));
    }

    list.sort((a, b) => {
      if (a.source !== b.source) return a.source.localeCompare(b.source);
      const n = String(a.no || '').localeCompare(String(b.no || ''), undefined, { numeric: true });
      if (n !== 0) return n;
      return String(a.subNo || '').localeCompare(String(b.subNo || ''), undefined, { numeric: true });
    });

    return list.map((row) => ({
      id: makeRowKey({ ...row, source: row.source }),
      source: row.source,
      no: row.no,
      sectionName: row.sectionLabel,
      indikatorLabel: row.indikator,
      mainRow: row,
    }));
  }, [investasiRows, pasarRows, likuiditasRows, operasionalRows, hukumRows, stratejikRows, kepatuhanRows, reputasiRows, year, quarter, filters.query]);

  // Annual Groups
  const annualGroups = useMemo(() => {
    const normalizeAll = (r, source) => normalizeRow(r, source, year, quarter);

    let allData = [
      ...investasiRows.map((r) => normalizeAll(r, 'INVESTASI')),
      ...pasarRows.map((r) => normalizeAll(r, 'PASAR')),
      ...likuiditasRows.map((r) => normalizeAll(r, 'LIKUIDITAS')),
      ...operasionalRows.map((r) => normalizeAll(r, 'OPERASIONAL')),
      ...hukumRows.map((r) => normalizeAll(r, 'HUKUM')),
      ...stratejikRows.map((r) => normalizeAll(r, 'STRATEJIK')),
      ...kepatuhanRows.map((r) => normalizeAll(r, 'KEPATUHAN')),
      ...reputasiRows.map((r) => normalizeAll(r, 'REPUTASI')),
    ];

    allData = allData.filter((row) => row.year === year);

    const indicatorMap = {};
    allData.forEach((row) => {
      const key = `${row.source}|${row.sectionLabel}|${row.indikator}|${row.no}|${row.subNo}`;
      if (!indicatorMap[key]) {
        indicatorMap[key] = {
          source: row.source,
          sectionName: row.sectionLabel,
          indikatorLabel: row.indikator,
          no: row.no,
          subNo: row.subNo,
          quarters: {},
        };
      }
      indicatorMap[key].quarters[row.quarter] = row;
    });

    let result = Object.values(indicatorMap);
    result = result.filter((item) => filters.selectedSources.includes(item.source));
    result = result.filter((item) => !filters.selectedSections[item.source]?.length || filters.selectedSections[item.source].includes(item.sectionName));

    result.sort((a, b) => {
      if (a.source !== b.source) return RISK_SOURCES.indexOf(a.source) - RISK_SOURCES.indexOf(b.source);
      const noCompare = String(a.no || '').localeCompare(String(b.no || ''), undefined, { numeric: true });
      if (noCompare !== 0) return noCompare;
      return String(a.subNo || '').localeCompare(String(b.subNo || ''), undefined, { numeric: true });
    });

    return result;
  }, [investasiRows, pasarRows, likuiditasRows, operasionalRows, hukumRows, stratejikRows, kepatuhanRows, reputasiRows, year, filters.selectedSources, filters.selectedSections]);

  // Visible Groups
  const visibleGroups = useMemo(() => {
    return combinedGroups.filter((g) => filters.selectedSources.includes(g.source)).filter((g) => !filters.selectedSections[g.source]?.length || filters.selectedSections[g.source].includes(g.sectionName));
  }, [combinedGroups, filters.selectedSources, filters.selectedSections]);

  // Section Options
  const sectionOptionsBySource = useMemo(() => {
    const map = {};
    combinedGroups.forEach((g) => {
      if (!filters.selectedSources.includes(g.source)) return;
      map[g.source] = map[g.source] || new Set();
      map[g.source].add(g.sectionName);
    });
    return Object.fromEntries(Object.entries(map).map(([k, v]) => [k, Array.from(v)]));
  }, [combinedGroups, filters.selectedSources]);

  // Handle Change Value (VIA API)
  const handleChangeValue = async (rowKey, field, raw) => {
    const parts = rowKey.split('|');
    const [src] = parts;

    const isPasar = src === 'PASAR';
    const isLikuiditas = src === 'LIKUIDITAS';
    const isOperasional = src === 'OPERASIONAL';
    const isHukum = src === 'HUKUM';
    const isStratejik = src === 'STRATEJIK';
    const isKepatuhan = src === 'KEPATUHAN';
    const isReputasi = src === 'REPUTASI';

    const sourceKey = isPasar ? 'PASAR' : isLikuiditas ? 'LIKUIDITAS' : isOperasional ? 'OPERASIONAL' : isHukum ? 'HUKUM' : isStratejik ? 'STRATEJIK' : isKepatuhan ? 'KEPATUHAN' : isReputasi ? 'REPUTASI' : 'INVESTASI';

    try {
      // Optimistic update
      const setter = rowsState.setters[sourceKey];
      if (setter) {
        setter((prev) => {
          return prev.map((r) => {
            const candidateKey = makeRowKey({ ...r, source: sourceKey });
            if (candidateKey !== rowKey) return r;

            const updatedRow = { ...r, [field]: raw };
            if (field === 'numeratorValue') updatedRow.pembilangValue = raw;
            if (field === 'denominatorValue') updatedRow.penyebutValue = raw;

            if (field === 'hasilText' && updatedRow.mode === 'TEKS') {
              const riskLevels = {
                low: updatedRow.low || '',
                lowToModerate: updatedRow.lowToModerate || '',
                moderate: updatedRow.moderate || '',
                moderateToHigh: updatedRow.moderateToHigh || '',
                high: updatedRow.high || '',
              };
              updatedRow.peringkat = isNumericRiskLevels(riskLevels) ? calculatePeringkat(parseFloat(raw) / 100, riskLevels, true) : calculatePeringkatFromText(raw, riskLevels);
            }

            const hasilBaru = computeHasilFromValues({
              ...updatedRow,
              numeratorValue: updatedRow.numeratorValue ?? updatedRow.pembilangValue,
              denominatorValue: updatedRow.denominatorValue ?? updatedRow.penyebutValue,
            });

            const newPeringkat =
              updatedRow.mode === 'TEKS'
                ? updatedRow.peringkat
                : calculatePeringkat(
                    hasilBaru,
                    {
                      low: updatedRow.low || '',
                      lowToModerate: updatedRow.lowToModerate || '',
                      moderate: updatedRow.moderate || '',
                      moderateToHigh: updatedRow.moderateToHigh || '',
                      high: updatedRow.high || '',
                    },
                    updatedRow.isPercent || false,
                  );

            return { ...updatedRow, hasil: hasilBaru === '' ? '' : hasilBaru, peringkat: newPeringkat };
          });
        });
      }

      // Send to API
      await updateRowAPI(sourceKey, rowKey, field, raw, year, quarter);
    } catch (err) {
      console.error('Error updating row:', err);
      alert('Gagal menyimpan perubahan, me-refresh data...');
      rowsState.refresh();
    }
  };

  // Clone handlers
  const handleCloneClick = () => {
    setCloneSelectedSources(RISK_SOURCES);
    setCloneDialogOpen(true);
  };
  const handleCloneConfirm = async () => {
    if (cloneSourceYear === cloneTargetYear && cloneSourceQuarter === cloneTargetQuarter) {
      alert('Periode asal dan periode tujuan tidak boleh sama.');
      return;
    }
    if (cloneSelectedSources.length === 0) {
      alert('Wajib memilih minimal 1 modul untuk disalin.');
      return;
    }

    setCloning(true);
    try {
      const result = await clonePeriodAPI({
        sourceYear: cloneSourceYear,
        sourceQuarter: cloneSourceQuarter,
        targetYear: cloneTargetYear,
        targetQuarter: cloneTargetQuarter,
        overrideExisting: cloneOverrideExisting,
        sources: cloneSelectedSources,
      });

      // Panggil audit log
      logCreate(
        'SYSTEM',
        `Kloning data Profil Risiko Holding dari periode ${cloneSourceYear} ${cloneSourceQuarter} ke ${cloneTargetYear} ${cloneTargetQuarter} (Override: ${cloneOverrideExisting ? 'Ya' : 'Tidak'}, Modul: ${cloneSelectedSources.join(', ')})`,
        {
          isSuccess: true,
          metadata: {
            sourceYear: cloneSourceYear,
            sourceQuarter: cloneSourceQuarter,
            targetYear: cloneTargetYear,
            targetQuarter: cloneTargetQuarter,
            overrideExisting: cloneOverrideExisting,
            sources: cloneSelectedSources,
            sectionsCloned: result.sectionsCloned,
            indicatorsCloned: result.indicatorsCloned,
          }
        }
      );

      alert(`✅ Berhasil menduplikasi ${result.indicatorsCloned} data indikator dan ${result.sectionsCloned} data section ke periode ${cloneTargetYear} ${cloneTargetQuarter}!`);
      
      // Arahkan periode ke target agar user langsung melihat hasilnya
      setYear(cloneTargetYear);
      setQuarter(cloneTargetQuarter);
      
      setCloneDialogOpen(false);
    } catch (err) {
      console.error(err);
      alert(`❌ Gagal menduplikasi data: ${err.message || 'Terjadi kesalahan'}`);
    } finally {
      setCloning(false);
    }
  };

  // Reload on year/quarter change
  useEffect(() => {
    reloadSections();
  }, [year, quarter, reloadSections]);

  // Export handlers
  const handleExport = () => setExportDialogOpen(true);
  const handleExportConfirm = () => {
    const dataToExport =
      activeTab === 'tahunan'
        ? annualGroups
        : visibleGroups.map((g) => ({
            ...g,
            quarters: { [g.mainRow?.quarter]: g.mainRow },
            mainRow: g.mainRow || {},
            mode: g.mainRow?.mode || 'RASIO',
          }));
    exportRekapDataToExcel(dataToExport, year, quarter, activeTab, exportFormatOptions, filters.selectedQuarters);
    setExportDialogOpen(false);
  };

  // Import handlers (VIA API)
  const handleImportClick = () => fileInputRef.current?.click();
  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const result = await importExcelAPI(file, year, quarter);
      alert(`✅ Berhasil mengimpor ${result.totalImported} data!`);
    } catch (err) {
      console.error('Import error:', err);
      alert(`❌ Error: ${err.message || 'Gagal mengimpor file Excel.'}`);
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  // Reset Period Data (VIA API)
  const handleCleanup = async () => {
    if (!confirm(`Apakah Anda yakin ingin me-reset (menghapus) semua data profil risiko untuk periode ${year} ${quarter}? Semua data indikator dan section pada periode ini akan dihapus secara permanen.`)) return;

    try {
      // Loop over all sources and delete them
      await Promise.all(
        RISK_SOURCES.map(source => rekapDataAPI.resetPeriodData(year, quarter, source))
      );
      
      // Refresh the view
      await rowsState.refresh();
      
      alert(`✅ Data rekap untuk periode ${year} ${quarter} berhasil di-reset.`);
      
      // Audit Log
      try {
        const user = getCurrentUser();
        await logDelete('SYSTEM', `Reset data rekap untuk periode ${year} ${quarter}`, {
          userId: user.id || user.userId,
          isSuccess: true,
          metadata: { year, quarter },
        });
      } catch (logErr) {
        console.warn('Audit log gagal (reset period data):', logErr);
      }
    } catch (err) {
      console.error('Reset error:', err);
      alert(`❌ Error: ${err.message || 'Gagal me-reset data.'}`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6 bg-[#f3f6f8] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-[#f3f6f8] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={rowsState.refresh} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#f3f6f8] min-h-screen font-['Plus_Jakarta_Sans',system-ui,sans-serif]">
      <div className={`relative rounded-2xl overflow-hidden mb-6 shadow-sm ${PNM_BRAND.gradient}`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_0%,white,transparent_40%),radial-gradient(circle_at_80%_100%,white,transparent_35%)]" />
        <div className="relative px-6 py-7">
          <h1 className="text-2xl font-extrabold text-white">Rekap Data</h1>
          <p className="mt-1 text-white/90 text-sm">Rekap Data Profil Risiko</p>
        </div>
      </div>

      <div className="mb-6">
        <nav className="flex space-x-8">
          <button onClick={() => setActiveTab('triwulan')} className={`py-3 px-1 border-b-2 font-medium ${activeTab === 'triwulan' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600'}`}>
            Triwulan
          </button>
          <button onClick={() => setActiveTab('tahunan')} className={`py-3 px-1 border-b-2 font-medium ${activeTab === 'tahunan' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600'}`}>
            Tahunan
          </button>
        </nav>
      </div>

      <RekapDataHeader
        year={year}
        setYear={setYear}
        quarter={quarter}
        setQuarter={setQuarter}
        query={filters.query}
        setQuery={filters.setQuery}
        onExport={handleExport}
        onImport={handleImportClick}
        importing={importing || saving}
        mode={activeTab}
        onCleanup={handleCleanup}
        onClone={handleCloneClick}
      />

      <RekapDataFilterPills selectedSources={filters.selectedSources} onToggleSource={filters.toggleSource} periodeLabel={periodeLabel} sources={RISK_SOURCES} />

      {activeTab === 'triwulan' && (
        <RekapDataSectionFilter
          sectionOptionsBySource={sectionOptionsBySource}
          selectedSections={filters.selectedSections}
          onToggleSection={filters.toggleSection}
          sectionFilterOpen={filters.sectionFilterOpen}
          setSectionFilterOpen={filters.setSectionFilterOpen}
          onResetSections={filters.resetSections}
        />
      )}

      {activeTab === 'tahunan' && <RekapDataQuarterFilter selectedQuarters={filters.selectedQuarters} onToggleQuarter={filters.toggleQuarter} />}

      {activeTab === 'triwulan' ? (
        <RekapDataTriwulanTable visibleGroups={visibleGroups} year={year} quarter={quarter} periodeLabel={periodeLabel} handleChangeValue={handleChangeValue} />
      ) : (
        <RekapDataTahunanTable annualGroups={annualGroups} year={year} filters={filters} handleChangeValue={handleChangeValue} />
      )}

      {exportDialogOpen && <RekapDataExportDialog options={exportFormatOptions} setOptions={setExportFormatOptions} onConfirm={handleExportConfirm} onCancel={() => setExportDialogOpen(false)} />}

      {cloneDialogOpen && (
        <RekapDataCloneDialog
          isOpen={cloneDialogOpen}
          onClose={() => setCloneDialogOpen(false)}
          onConfirm={handleCloneConfirm}
          sourceYear={cloneSourceYear}
          setSourceYear={setCloneSourceYear}
          sourceQuarter={cloneSourceQuarter}
          setSourceQuarter={setCloneSourceQuarter}
          targetYear={cloneTargetYear}
          setTargetYear={setCloneTargetYear}
          targetQuarter={cloneTargetQuarter}
          setTargetQuarter={setCloneTargetQuarter}
          overrideExisting={cloneOverrideExisting}
          setOverrideExisting={setCloneOverrideExisting}
          selectedSources={cloneSelectedSources}
          setSelectedSources={setCloneSelectedSources}
          loading={cloning}
        />
      )}

      <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleImportFile} style={{ display: 'none' }} />
    </div>
  );
}

// ===================== RekapDataCloneDialog (PREMIUM UI) =====================
const RekapDataCloneDialog = ({
  isOpen,
  onClose,
  onConfirm,
  sourceYear,
  setSourceYear,
  sourceQuarter,
  setSourceQuarter,
  targetYear,
  setTargetYear,
  targetQuarter,
  setTargetQuarter,
  overrideExisting,
  setOverrideExisting,
  selectedSources,
  setSelectedSources,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 border border-gray-100 animate-fadeIn">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
            <Copy size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Salin Data Periode</h2>
            <p className="text-xs text-gray-500 mt-0.5">Duplikasi parameter dan data ke periode lain</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Periode Asal */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Periode Asal (Sumber)</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-400 font-medium">Tahun</span>
                <input
                  type="number"
                  className="rounded-xl px-3 py-2 border text-sm font-medium focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                  value={sourceYear}
                  onChange={(e) => setSourceYear(Number(e.target.value))}
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-400 font-medium">Triwulan</span>
                <select
                  className="rounded-xl px-3 py-2 border text-sm font-medium focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none bg-white"
                  value={sourceQuarter}
                  onChange={(e) => setSourceQuarter(e.target.value)}
                  disabled={loading}
                >
                  <option value="Q1">Q1 (Jan–Mar)</option>
                  <option value="Q2">Q2 (Apr–Jun)</option>
                  <option value="Q3">Q3 (Jul–Sep)</option>
                  <option value="Q4">Q4 (Okt–Des)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Divider Arrow */}
          <div className="flex justify-center my-1">
            <div className="p-1 rounded-full bg-gray-50 border border-gray-100 text-gray-400 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-down"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
            </div>
          </div>

          {/* Periode Tujuan */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Periode Tujuan (Target)</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-400 font-medium">Tahun</span>
                <input
                  type="number"
                  className="rounded-xl px-3 py-2 border text-sm font-medium focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                  value={targetYear}
                  onChange={(e) => setTargetYear(Number(e.target.value))}
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-400 font-medium">Triwulan</span>
                <select
                  className="rounded-xl px-3 py-2 border text-sm font-medium focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none bg-white"
                  value={targetQuarter}
                  onChange={(e) => setTargetQuarter(e.target.value)}
                  disabled={loading}
                >
                  <option value="Q1">Q1 (Jan–Mar)</option>
                  <option value="Q2">Q2 (Apr–Jun)</option>
                  <option value="Q3">Q3 (Jul–Sep)</option>
                  <option value="Q4">Q4 (Okt–Des)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pilih Modul Checkboxes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Pilih Modul (Risiko)</label>
              <button
                type="button"
                onClick={() => {
                  if (selectedSources.length === RISK_SOURCES.length) {
                    setSelectedSources([]);
                  } else {
                    setSelectedSources(RISK_SOURCES);
                  }
                }}
                className="text-[11px] font-bold text-purple-600 hover:text-purple-700 transition-colors"
                disabled={loading}
              >
                {selectedSources.length === RISK_SOURCES.length ? 'Kosongkan Semua' : 'Pilih Semua'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100 max-h-[160px] overflow-y-auto">
              {RISK_SOURCES.map((src) => {
                const isChecked = selectedSources.includes(src);
                return (
                  <div key={src} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`module-${src}`}
                      className="h-3.5 w-3.5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                      checked={isChecked}
                      onChange={() => {
                        if (isChecked) {
                          setSelectedSources(selectedSources.filter((item) => item !== src));
                        } else {
                          setSelectedSources([...selectedSources, src]);
                        }
                      }}
                      disabled={loading}
                    />
                    <label
                      htmlFor={`module-${src}`}
                      className="text-xs text-gray-700 font-medium select-none cursor-pointer hover:text-gray-900 transition-colors"
                    >
                      {src.charAt(0).toUpperCase() + src.slice(1).toLowerCase()}
                    </label>
                  </div>
                );
              })}
            </div>
            {selectedSources.length === 0 && (
              <p className="text-[10px] text-red-500 mt-1 font-semibold">
                * Wajib memilih minimal 1 modul untuk disalin.
              </p>
            )}
          </div>

          {/* Checkbox Overwrite */}
          <div className="p-3 bg-amber-50/50 border border-amber-100/70 rounded-xl flex items-start gap-2.5 mt-2">
            <input
              type="checkbox"
              id="overrideCheckbox"
              className="mt-0.5 h-3.5 w-3.5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              checked={overrideExisting}
              onChange={(e) => setOverrideExisting(e.target.checked)}
              disabled={loading}
            />
            <label htmlFor="overrideCheckbox" className="text-[11px] text-amber-800 font-medium select-none cursor-pointer leading-normal">
              Tulis ulang data yang ada (Overwrite)
              <span className="block text-[9px] text-amber-600/75 font-normal mt-0.5">Peringatan: Data yang sudah ada di periode tujuan akan digantikan seluruhnya.</span>
            </label>
          </div>
        </div>

        <div className="flex gap-2.5 justify-end mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold transition-colors focus:outline-none"
            disabled={loading}
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-xs rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center gap-1.5 shadow-sm hover:shadow transition-all focus:outline-none"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-0.5 mr-1 h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Menyalin...
              </>
            ) : (
              'Salin Sekarang'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
