import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import Header from '../../../../components/ui/header';
import RiskTabs from '../../../../components/ui/risk-tabs';
import ReputasiInherent from './reputasi-inherent';
import ReputasiKpmrPage from './reputasi-kpmr';
import { useHeaderStore } from '../../../../store/header';
import { exportInherent } from '../../../../utils/export/export-inherent';
import { loadInherent, saveInherent, saveDerived, notifyRiskUpdated } from '../../../../utils/storage/risk-storage-nilai';
import computeDerived from '../../../../utils/compute/compute-derived';
import { normalizeInherentRows } from '../utils/normalize/normalize-inherent-rows';
import useKpmrReputasi from '../hooks/kpmr/reputasi-kpmr.hook';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ========== UTILITY FUNCTIONS ==========
const getInherentSignature = (rows = []) => {
  return JSON.stringify(
    rows.map((p) => ({
      id: p.id,
      nomor: p.nomor,
      judul: p.judul,
      bobot: p.bobot,
      aspekId: p.aspekId,
      pertanyaan: (p.pertanyaanList || []).map((n) => ({
        id: n.id,
        nomor: n.nomor,
        pertanyaan: n.pertanyaan,
        skor: n.skor,
        indicator: n.indicator,
        evidence: n.evidence,
        catatan: n.catatan,
      })),
    })),
  );
};

function computeInherentSnapshot(rows = []) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return { summary: 0, meta: { formula: 'No data' } };
  }

  let totalWeighted = 0;
  rows.forEach((aspek) => {
    if (!Array.isArray(aspek.pertanyaanList)) return;
    aspek.pertanyaanList.forEach((pertanyaan) => {
      const derived = computeDerived(pertanyaan, aspek);
      if (Number.isFinite(derived?.weighted)) {
        totalWeighted += derived.weighted;
      }
    });
  });

  return {
    summary: Number(totalWeighted.toFixed(2)),
    meta: { formula: 'SUM(all derived.weighted)' },
  };
}

// ========== FORMAT KPMR ROWS ==========
const formatKpmrRowsFromBackend = (aspekList = []) => {
  if (!Array.isArray(aspekList)) return [];

  return aspekList.map((aspek) => ({
    id: aspek.id?.toString() || '',
    nomor: aspek.nomor || '',
    judul: aspek.judul || '',
    bobot: aspek.bobot?.toString().replace('.00', '') || '0',
    deskripsi: aspek.deskripsi || '',
    orderIndex: aspek.orderIndex || 0,
    averageScore: aspek.averageScore,
    rating: aspek.rating,
    updatedBy: aspek.updatedBy,
    notes: aspek.notes,
    pertanyaanList: Array.isArray(aspek.pertanyaanList)
      ? aspek.pertanyaanList.map((q) => ({
          id: q.id?.toString() || '',
          nomor: q.nomor || '',
          pertanyaan: q.pertanyaan || '',
          skor: q.skor || { Q1: undefined, Q2: undefined, Q3: undefined, Q4: undefined },
          indicator: q.indicator || {
            strong: '',
            satisfactory: '',
            fair: '',
            marginal: '',
            unsatisfactory: '',
          },
          evidence: q.evidence || '',
          catatan: q.catatan || '',
          orderIndex: q.orderIndex || 0,
        }))
      : [],
  }));
};

export default function ReputasiOJK() {
  const { year, activeQuarter, search, exportRequestId, resetExport } = useHeaderStore();
  const CATEGORY_ID = 'reputasi';

  // ========== STATE MANAGEMENT ==========
  const [activeTab, setActiveTab] = useState('inherent');
  const [inherentRows, setInherentRows] = useState([]);
  const [kpmrRows, setKpmrRows] = useState([]);
  const [kpmrId, setKpmrId] = useState(null);
  const [isDataReady, setIsDataReady] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [lastSavedSignature, setLastSavedSignature] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isKpmrLoading, setIsKpmrLoading] = useState(false);
  const [kpmrLoadError, setKpmrLoadError] = useState(null);
  const [isCreatingKpmr, setIsCreatingKpmr] = useState(false);

  // ✅ SATU SOURCE OF TRUTH: Data KPMR per TAHUN
  const [kpmrDataLoaded, setKpmrDataLoaded] = useState(false);

  // ✅ Track tahun yang sudah dimuat (bukan quarter)
  const [loadedYear, setLoadedYear] = useState(null);

  // ========== REFS ==========
  const didMountRef = useRef(false);
  const initialRowsRef = useRef([]);
  const saveTimeoutRef = useRef(null);
  const isLoadingKpmrRef = useRef(false);
  const initialLoadAttemptedRef = useRef(false);
  const createKpmrAttemptedRef = useRef(false);

  // ========== HOOK KPMR ==========
  const { kpmr, loading: kpmrHookLoading, error: kpmrHookError, loadKpmrByYearQuarter, refreshKpmrData, createKpmr, addAspek } = useKpmrReputasi();

  // ========== SYNC HOOK LOADING STATE ==========
  useEffect(() => {
    setIsKpmrLoading(kpmrHookLoading);
  }, [kpmrHookLoading]);

  // ========== SYNC HOOK ERROR ==========
  useEffect(() => {
    if (kpmrHookError) {
      const is404 = kpmrHookError.includes('tidak ditemukan') || kpmrHookError.includes('404');
      if (!is404) {
        console.error('❌ KPMR Hook Error:', kpmrHookError);
        setKpmrLoadError(kpmrHookError.message || 'Gagal memuat KPMR');
      } else {
        setKpmrLoadError(null);
      }
    } else {
      setKpmrLoadError(null);
    }
  }, [kpmrHookError]);

  // ========== FUNGSI UNTUK MEMBUAT KPMR BARU ==========
  const createNewKpmr = useCallback(async () => {
    if (!year) return null;
    if (isCreatingKpmr) return null;
    if (createKpmrAttemptedRef.current) return null;

    setIsCreatingKpmr(true);
    createKpmrAttemptedRef.current = true;

    try {
      console.log(`🆕 [Reputasi] Creating new KPMR for year ${year}`);

      // Gunakan quarter 1 untuk create
      const targetQuarter = 1;
      const data = await createKpmr(year, targetQuarter);

      if (data) {
        console.log(`✅ [Reputasi] KPMR created: ID ${data.id}`);
        setKpmrDataLoaded(true);
        setKpmrLoadError(null);
        setLoadedYear(year);
        setKpmrId(data.id);

        // Format rows
        const formattedRows = formatKpmrRowsFromBackend(data.aspekList || []);
        setKpmrRows(formattedRows);

        return data;
      }

      return null;
    } catch (error) {
      console.error('❌ [Reputasi] Error creating KPMR:', error);
      return null;
    } finally {
      setIsCreatingKpmr(false);
    }
  }, [year, createKpmr]);

  // ========== LOAD KPMR DATA - PERBAIKAN UTAMA ==========
  useEffect(() => {
    if (!year) return;

    // ✅ CEK: Jika tahun sama dan sudah dimuat, JANGAN LOAD ULANG
    if (loadedYear === year && kpmrDataLoaded) {
      console.log(`✅ [Reputasi] Data untuk tahun ${year} sudah dimuat, skip reload`);
      return;
    }

    // Cegah concurrent loading
    if (isLoadingKpmrRef.current) return;

    const loadKpmrData = async () => {
      isLoadingKpmrRef.current = true;
      setIsKpmrLoading(true);
      setKpmrLoadError(null);

      try {
        const targetQuarter = 1;
        console.log(`📡 [Reputasi] Loading KPMR for year ${year} Q${targetQuarter}`);

        const data = await loadKpmrByYearQuarter(year, targetQuarter);

        if (data) {
          console.log(`✅ [Reputasi] KPMR loaded: ID ${data.id}`);
          setKpmrDataLoaded(true);
          setKpmrLoadError(null);
          setLoadedYear(year);
          setKpmrId(data.id);

          const formattedRows = formatKpmrRowsFromBackend(data.aspekList || []);
          setKpmrRows(formattedRows);
        } else {
          console.log(`ℹ️ [Reputasi] KPMR not found for year ${year}`);
          setKpmrRows([]);
          setKpmrId(null);
          setKpmrDataLoaded(true);
          setLoadedYear(year);
          setKpmrLoadError(null);
        }
      } catch (error) {
        if (error?.response?.status === 404) {
          console.log(`ℹ️ [Reputasi] KPMR not found for year ${year} (404)`);
          setKpmrRows([]);
          setKpmrId(null);
          setKpmrDataLoaded(true);
          setLoadedYear(year);
          setKpmrLoadError(null);
        } else {
          console.error('❌ [Reputasi] KPMR load error:', error);
          setKpmrLoadError('Gagal memuat data KPMR. Silakan coba lagi.');
          setKpmrRows([]);
          setKpmrId(null);
          setKpmrDataLoaded(true);
        }
      } finally {
        setIsKpmrLoading(false);
        isLoadingKpmrRef.current = false;
      }
    };

    loadKpmrData();

    // ✅ DEPENDENCY: HANYA year yang berubah
  }, [year]); // HAPUS loadKpmrByYearQuarter dari dependency

  // ========== SYNC KPMR DATA DARI HOOK - PERBAIKAN ==========
  useEffect(() => {
    if (!kpmr?.id) return;

    // ✅ CEK: Jika ID sama dan rows sudah sesuai, JANGAN update
    if (kpmrId === kpmr.id) {
      const formattedRows = formatKpmrRowsFromBackend(kpmr.aspekList || []);
      const currentRowsJson = JSON.stringify(kpmrRows);
      const newRowsJson = JSON.stringify(formattedRows);

      if (currentRowsJson === newRowsJson) {
        return; // ✅ Tidak ada perubahan, skip
      }
    }

    // Update ID jika berbeda
    if (kpmrId !== kpmr.id) {
      console.log(`🆔 [Reputasi] kpmrId berubah: ${kpmrId} -> ${kpmr.id}`);
      setKpmrId(kpmr.id);
    }

    // Update rows
    const formattedRows = formatKpmrRowsFromBackend(kpmr.aspekList || []);
    setKpmrRows(formattedRows);

    // ✅ HAPUS DEPENDENCY yg tidak perlu
  }, [kpmr]); // HAPUS kpmrId dan kpmrRows dari dependency

  // ========== HANDLE REFRESH ==========
  const handleKpmrRefresh = useCallback(async () => {
    if (!kpmrId) {
      console.log('⚠️ [Reputasi] Cannot refresh: kpmrId is null');
      return [];
    }

    console.log('🔄 [Reputasi] handleKpmrRefresh dipanggil');
    try {
      const refreshedRows = await refreshKpmrData();
      if (refreshedRows && refreshedRows.length > 0) {
        setKpmrRows(formatKpmrRowsFromBackend(refreshedRows));
      }
      return refreshedRows;
    } catch (error) {
      console.error('❌ [Reputasi] Error refreshing:', error);
      return [];
    }
  }, [kpmrId, refreshKpmrData]);

  // ========== STABILKAN KPMR PAGE ==========
  const kpmrPage = useMemo(() => {
    console.log(`🏗️ [Reputasi] Membangun KPMR Page untuk tahun ${year} dengan ID: ${kpmrId || 'null'}`);

    return <ReputasiKpmrPage key={`kpmr-page-${year}`} rows={kpmrRows} setRows={setKpmrRows} search={search} kpmrId={kpmrId} onRefreshData={handleKpmrRefresh} onCreateKpmr={createNewKpmr} />;
  }, [kpmrRows, search, kpmrId, year, createNewKpmr]);

  // ========== PROCESS KPMR DATA FROM HOOK ==========
  useEffect(() => {
    if (!kpmr?.id) return;

    if (kpmrId !== kpmr.id) {
      console.log(`🆔 [Reputasi] kpmrId berubah: ${kpmrId} -> ${kpmr.id}`);
      setKpmrId(kpmr.id);
    }

    const formattedRows = formatKpmrRowsFromBackend(kpmr.aspekList || []);
    const currentRowsJson = JSON.stringify(kpmrRows);
    const newRowsJson = JSON.stringify(formattedRows);

    if (currentRowsJson !== newRowsJson) {
      console.log(`📝 [Reputasi] Update rows: ${kpmrRows.length} -> ${formattedRows.length}`);
      setKpmrRows(formattedRows);
    }
  }, [kpmr]);

  // ========== LOAD INHERENT DATA ==========
  useEffect(() => {
    console.log('🚀 [Reputasi] LOADING INHERENT DATA', { year, quarter: activeQuarter });

    setIsDataReady(false);
    setInitialLoadDone(false);

    const inh = loadInherent({
      categoryId: CATEGORY_ID,
      year,
      quarter: activeQuarter,
    });

    const normalizedInh = inh && inh.length > 0 ? normalizeInherentRows(inh) : [];
    initialRowsRef.current = normalizedInh;
    setLastSavedSignature(getInherentSignature(normalizedInh));
    setInherentRows(normalizedInh);

    setIsDataReady(true);
    setInitialLoadDone(true);
    console.log('✅ [Reputasi] Inherent data loaded:', normalizedInh.length, 'rows');
  }, [year, activeQuarter]);

  // ========== SAVE INHERENT FUNCTION ==========
  const saveInherentData = useCallback(() => {
    if (!isDataReady || !initialLoadDone || inherentRows.length === 0) {
      return false;
    }

    const currentSignature = getInherentSignature(inherentRows);

    if (currentSignature === lastSavedSignature && !isSaving) {
      return true;
    }

    setIsSaving(true);

    try {
      saveInherent({
        categoryId: CATEGORY_ID,
        year,
        quarter: activeQuarter,
        rows: inherentRows,
      });

      const snapshot = computeInherentSnapshot(inherentRows);

      const derivedValues = inherentRows.flatMap((aspek) => (aspek.pertanyaanList || []).map((pertanyaan) => computeDerived(pertanyaan, aspek)));

      saveDerived({
        categoryId: CATEGORY_ID,
        year,
        quarter: activeQuarter,
        snapshot: snapshot,
        values: derivedValues,
      });

      notifyRiskUpdated();

      setLastSavedSignature(currentSignature);

      return true;
    } catch (error) {
      console.error('❌ Gagal menyimpan inherent:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [inherentRows, isDataReady, year, activeQuarter, initialLoadDone, lastSavedSignature, isSaving]);

  // ========== AUTO-SAVE INHERENT ==========
  useEffect(() => {
    if (!isDataReady || !initialLoadDone) return;
    if (activeTab !== 'inherent') return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      const currentSignature = getInherentSignature(inherentRows);

      if (currentSignature !== lastSavedSignature) {
        saveInherentData();
      }
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [inherentRows, activeTab, isDataReady, initialLoadDone, lastSavedSignature, saveInherentData]);

  // ========== BEFORE UNLOAD HANDLER ==========
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;

      const handleBeforeUnload = (e) => {
        if (activeTab === 'inherent' && inherentRows.length > 0) {
          const currentSignature = getInherentSignature(inherentRows);
          if (currentSignature !== lastSavedSignature) {
            e.preventDefault();
            e.returnValue = 'Ada perubahan yang belum disimpan. Yakin ingin keluar?';
            saveInherentData();
            return e.returnValue;
          }
        }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [activeTab, inherentRows, lastSavedSignature, saveInherentData]);

  // ========== EXPORT HANDLER ==========
  useEffect(() => {
    if (!exportRequestId || !isDataReady) return;

    if (activeTab === 'inherent') {
      exportInherent({
        rows: inherentRows,
        year,
        quarter: activeQuarter,
        categoryLabel: 'Reputasi',
      });
    }

    resetExport();
  }, [exportRequestId, isDataReady, activeTab, inherentRows, year, activeQuarter, resetExport]);

  // ========== TAB CHANGE HANDLER ==========
  const handleTabChange = useCallback(
    (tab) => {
      if (activeTab === 'inherent' && inherentRows.length > 0) {
        const currentSignature = getInherentSignature(inherentRows);
        if (currentSignature !== lastSavedSignature) {
          saveInherentData();
        }
      }

      setActiveTab(tab);
    },
    [activeTab, inherentRows, lastSavedSignature, saveInherentData],
  );

  // ========== RENDER LOGIC ==========

  if (!year) {
    return (
      <div className="w-full space-y-4">
        <Header title="Risk Profile – Reputasi" />
        <RiskTabs
          value={activeTab}
          onChange={handleTabChange}
          tabs={[
            { value: 'inherent', label: 'Inherent Risk' },
            { value: 'kpmr', label: 'KPMR' },
          ]}
        />
        <div className="w-full">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-6 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-lg font-semibold">⚠️ Tahun Tidak Tersedia</div>
            </div>
            <div className="text-sm">Silakan pilih tahun terlebih dahulu.</div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'inherent' && !isDataReady) {
    return (
      <div className="w-full space-y-4">
        <Header title="Risk Profile – Reputasi" />
        <RiskTabs
          value={activeTab}
          onChange={handleTabChange}
          tabs={[
            { value: 'inherent', label: 'Inherent Risk' },
            { value: 'kpmr', label: 'KPMR' },
          ]}
        />
        <div className="w-full">
          <div className="bg-blue-700 text-white px-4 py-8 rounded-lg border border-slate-700">
            <div className="flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin" />
              <div className="text-lg font-semibold">Memuat Data Inherent Risk...</div>
              <div className="text-sm text-blue-200">
                {year} Q{activeQuarter}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'kpmr' && isKpmrLoading && loadedYear !== year) {
    return (
      <div className="w-full space-y-4">
        <Header title="Risk Profile – Reputasi" />
        <RiskTabs
          value={activeTab}
          onChange={handleTabChange}
          tabs={[
            { value: 'inherent', label: 'Inherent Risk' },
            { value: 'kpmr', label: 'KPMR' },
          ]}
        />
        <div className="w-full">
          <div className="bg-blue-700 text-white px-4 py-8 rounded-lg border border-slate-700">
            <div className="flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin" />
              <div className="text-lg font-semibold">Memuat Data KPMR...</div>
              <div className="text-sm text-blue-200">Tahun {year}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'kpmr' && kpmrLoadError) {
    return (
      <div className="w-full space-y-4">
        <Header title="Risk Profile – Reputasi" />
        <RiskTabs
          value={activeTab}
          onChange={handleTabChange}
          tabs={[
            { value: 'inherent', label: 'Inherent Risk' },
            { value: 'kpmr', label: 'KPMR' },
          ]}
        />
        <div className="w-full">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-6 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-lg font-semibold">❌ Gagal Memuat KPMR</div>
            </div>
            <div className="text-sm mb-4">{kpmrLoadError}</div>
            <Button
              onClick={() => {
                setKpmrDataLoaded(false);
                setKpmrLoadError(null);
                setLoadedYear(null);
                initialLoadAttemptedRef.current = false;
              }}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Coba Lagi
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ RENDER NORMAL
  return (
    <div className="w-full space-y-4">
      <Header title="Risk Profile – Reputasi" />

      <RiskTabs
        value={activeTab}
        onChange={handleTabChange}
        tabs={[
          { value: 'inherent', label: 'Inherent Risk' },
          { value: 'kpmr', label: 'KPMR' },
        ]}
      />

      <div className="w-full">
        {activeTab === 'inherent' && <ReputasiInherent rows={inherentRows} setRows={setInherentRows} search={search} active onSaveData={saveInherentData} />}

        {activeTab === 'kpmr' && (
          <div className="w-full">
            {/* INFO BANNER */}
            {kpmrId && kpmrRows.length > 0 && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">✅ KPMR Dimuat</div>
                </div>
                <div className="text-sm mt-1">
                  KPMR tahun {year} berhasil dimuat dengan {kpmrRows.length} aspek.
                </div>
              </div>
            )}

            {kpmrId && kpmrRows.length === 0 && !kpmrLoadError && (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-4">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">ℹ️ Data KPMR Kosong</div>
                </div>
                <div className="text-sm mt-1">KPMR tahun {year} sudah dibuat, tapi belum ada aspek. Silakan tambahkan aspek menggunakan panel di bawah.</div>
              </div>
            )}

            {!kpmrId && !kpmrLoadError && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-4">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">🆕 KPMR Belum Dibuat</div>
                </div>
                <div className="text-sm mt-1">KPMR untuk tahun {year} belum dibuat. KPMR akan otomatis dibuat saat Anda menambahkan aspek pertama.</div>
              </div>
            )}

            {/* KPMR PAGE */}
            {kpmrPage}
          </div>
        )}
      </div>
    </div>
  );
}


