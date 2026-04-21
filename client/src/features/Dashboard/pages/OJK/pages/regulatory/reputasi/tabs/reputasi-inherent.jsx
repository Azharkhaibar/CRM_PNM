// src/ojk/reputasi-produk/reputasi-produk-ojk/reputasi-produk-ojk.service.tsx
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useHeaderStore } from '../../../../store/header';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Copy, TriangleAlert, X, FileWarning, ArrowBigLeftDash, ArrowBigRightDash, ChevronDown, ChevronUp, Edit, Save, Loader2, Search } from 'lucide-react';

import computeDerived from '../../../../utils/compute/compute-derived';
import { useDropdownPortal } from '../components/usedropdownportal';
import PopUpDelete from '../../../../components/popup-delete';
import useReputasiInherent from '../hooks/inherent/reputasi.hook';

const log = {
  info: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] INFO: ${message}`, data || '');
  },
  error: (message, error = null) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ERROR: ${message}`, error || '');
  },
  warn: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] WARN: ${message}`, data || '');
  },
  debug: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.debug(`[${timestamp}] DEBUG: ${message}`, data || '');
  },
  loading: (message) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ⏳ LOADING: ${message}`);
  },
  success: (message) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ✅ SUCCESS: ${message}`);
  },
};

// Komponen utama wrapper dengan integrasi backend
export default function ReputasiInherentWrapper() {
  const [search, setSearch] = useState('');
  const year = useHeaderStore((s) => s.year);
  const quarter = useHeaderStore((s) => s.activeQuarter);
  const [active, setActive] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // PERBAIKAN: State lokal untuk optimistic updates
  const [localRows, setLocalRows] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // PERBAIKAN: Gunakan useReputasiInherent, bukan useReputasiIntegration
  const { reputasi, parameters, loading, saving, error, currentReputasiId, loadByYearQuarter, refreshData, addParameter, updateParameter, deleteParameter, copyParameter, addNilai, updateNilai, deleteNilai, copyNilai } =
    useReputasiInherent();

  // PERBAIKAN: Konversi parameters ke rows (aspek)
  const rows = useMemo(() => {
    return Array.isArray(parameters) ? parameters : [];
  }, [parameters]);

  // PERBAIKAN: Sinkronkan parameters ke localRows
  useEffect(() => {
    setLocalRows(Array.isArray(parameters) ? parameters : []);
  }, [parameters]);

  // PERBAIKAN: Data reputasi untuk info
  const currentReputasiData = reputasi;

  // PERBAIKAN: Fungsi setRows untuk kompatibilitas (tidak benar-benar digunakan)
  const setRows = useCallback((newRows) => {
    console.log('setRows called, but data is managed by hook');
    // PERBAIKAN: Update localRows juga
    setLocalRows(newRows);
  }, []);

  // PERBAIKAN: Fungsi refresh dengan state
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
      log.success('Data refreshed');
    } catch (err) {
      log.error('Refresh failed:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshData]);

  useEffect(() => {
    log.debug('State changed', {
      year,
      quarter,
      isInitialLoading,
      rowsCount: localRows?.length || 0,
      loading,
      currentReputasiId,
      currentReputasiData: currentReputasiData ? `ID: ${currentReputasiData.id}` : 'null',
      error,
    });
  }, [year, quarter, isInitialLoading, localRows, loading, currentReputasiId, currentReputasiData, error]);

  // PERBAIKAN: Load data saat mount atau year/quarter berubah
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!year || !quarter || quarter < 1 || quarter > 4) {
        log.warn('Invalid year or quarter:', { year, quarter });
        if (mounted) {
          setIsInitialLoading(false);
        }
        return;
      }

      setIsInitialLoading(true);
      try {
        log.info(`Loading data for ${year}-Q${quarter}`);
        await loadByYearQuarter(year, quarter);
        log.success(`Data loaded successfully for ${year}-Q${quarter}`);
      } catch (err) {
        log.error('Error loading data:', err);
        if (!mounted) return;
      } finally {
        if (mounted) {
          setIsInitialLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [year, quarter, loadByYearQuarter]);

  // PERBAIKAN: Filter rows dengan validasi
  const filteredRows = useMemo(() => {
    const safeRows = Array.isArray(localRows) ? localRows : [];

    if (!search) return safeRows;

    const s = search.toLowerCase();
    return safeRows.filter((row) => {
      if (!row) return false;
      return (row.judul && row.judul.toLowerCase().includes(s)) || (row.nomor && row.nomor.toString().includes(s));
    });
  }, [localRows, search]);

  // PERBAIKAN: Backend handlers dengan fungsi yang benar dari hook
  const backendHandlers = useMemo(
    () => ({
      addAspek: async (createAspekDto) => {
        try {
          log.info('Adding aspek:', createAspekDto);
          if (!currentReputasiId) {
            throw new Error('Tidak ada data reputasi yang dipilih');
          }

          // PERBAIKAN: Optimistic update - tambahkan ke UI segera
          const tempId = `temp-${Date.now()}`;
          const tempAspek = {
            id: tempId,
            ...createAspekDto,
            pertanyaanList: [],
            isTemp: true,
            createdAt: new Date().toISOString(),
          };

          setLocalRows((prev) => [...prev, tempAspek]);

          // Panggil API
          await addParameter(currentReputasiId, createAspekDto);

          // PERBAIKAN: Refresh untuk dapat ID asli
          await handleRefresh();

          log.success('Aspek added successfully');
          return { success: true, tempId };
        } catch (err) {
          log.error('Error adding aspek:', err);

          // PERBAIKAN: Rollback dengan menghapus temporary item
          setLocalRows((prev) => prev.filter((row) => !row.isTemp));

          return {
            success: false,
            error: '❌ Gagal menambahkan aspek: ' + (err.message || 'Coba lagi nanti'),
          };
        }
      },

      updateAspek: async (aspekId, updateAspekDto) => {
        try {
          log.info('Updating aspek:', { aspekId, updateAspekDto });

          // PERBAIKAN: Simpan data asli untuk rollback
          const originalRows = [...localRows];

          // PERBAIKAN: Optimistic update
          setLocalRows((prev) => prev.map((row) => (row.id === aspekId ? { ...row, ...updateAspekDto, isUpdating: true } : row)));

          await updateParameter(aspekId, updateAspekDto);
          await handleRefresh();

          log.success('Aspek updated successfully');
          return { success: true };
        } catch (err) {
          log.error('Error updating aspek:', err);

          // PERBAIKAN: Rollback dengan refresh
          await handleRefresh();

          return {
            success: false,
            error: '❌ Gagal mengupdate aspek: ' + err.message,
          };
        }
      },

      deleteAspek: async (aspekId) => {
        try {
          log.info('Deleting aspek:', aspekId);

          // PERBAIKAN: Optimistic update - hapus dari UI segera
          const deletedRow = localRows.find((r) => r.id === aspekId);
          setLocalRows((prev) => prev.filter((row) => row.id !== aspekId));

          await deleteParameter(aspekId);
          await handleRefresh();

          log.success('Aspek deleted successfully');
          return { success: true };
        } catch (err) {
          log.error('Error deleting aspek:', err);

          // PERBAIKAN: Rollback dengan refresh
          await handleRefresh();

          return {
            success: false,
            error: '❌ Gagal menghapus aspek: ' + err.message,
          };
        }
      },

      addPertanyaan: async (aspekId, createPertanyaanDto) => {
        try {
          log.info('Adding pertanyaan:', { aspekId, createPertanyaanDto });
          if (!currentReputasiId) {
            throw new Error('Tidak ada data reputasi yang dipilih');
          }

          // PERBAIKAN: Optimistic update
          const tempId = `temp-${Date.now()}`;
          const tempPertanyaan = {
            id: tempId,
            ...createPertanyaanDto,
            isTemp: true,
          };

          setLocalRows((prev) =>
            prev.map((row) =>
              row.id === aspekId
                ? {
                    ...row,
                    pertanyaanList: [...(row.pertanyaanList || []), tempPertanyaan],
                  }
                : row,
            ),
          );

          await addNilai(currentReputasiId, aspekId, createPertanyaanDto);
          await handleRefresh();

          log.success('Pertanyaan added successfully');
          return { success: true, tempId };
        } catch (err) {
          log.error('Error adding pertanyaan:', err);

          // PERBAIKAN: Rollback dengan refresh
          await handleRefresh();

          return {
            success: false,
            error: '❌ Gagal menambahkan pertanyaan: ' + err.message,
          };
        }
      },

      updatePertanyaan: async (aspekId, pertanyaanId, updatePertanyaanDto) => {
        try {
          log.info('Updating pertanyaan:', { aspekId, pertanyaanId, updatePertanyaanDto });

          // PERBAIKAN: Optimistic update
          setLocalRows((prev) =>
            prev.map((row) =>
              row.id === aspekId
                ? {
                    ...row,
                    pertanyaanList: (row.pertanyaanList || []).map((p) => (p.id === pertanyaanId ? { ...p, ...updatePertanyaanDto, isUpdating: true } : p)),
                  }
                : row,
            ),
          );

          await updateNilai(pertanyaanId, updatePertanyaanDto);
          await handleRefresh();

          log.success('Pertanyaan updated successfully');
          return { success: true };
        } catch (err) {
          log.error('Error updating pertanyaan:', err);

          // PERBAIKAN: Rollback dengan refresh
          await handleRefresh();

          return {
            success: false,
            error: '❌ Gagal mengupdate pertanyaan: ' + err.message,
          };
        }
      },

      deletePertanyaan: async (aspekId, pertanyaanId) => {
        try {
          log.info('Deleting pertanyaan:', { aspekId, pertanyaanId });

          // PERBAIKAN: Optimistic update
          setLocalRows((prev) =>
            prev.map((row) =>
              row.id === aspekId
                ? {
                    ...row,
                    pertanyaanList: (row.pertanyaanList || []).filter((p) => p.id !== pertanyaanId),
                  }
                : row,
            ),
          );

          await deleteNilai(pertanyaanId);
          await handleRefresh();

          log.success('Pertanyaan deleted successfully');
          return { success: true };
        } catch (err) {
          log.error('Error deleting pertanyaan:', err);

          // PERBAIKAN: Rollback dengan refresh
          await handleRefresh();

          return {
            success: false,
            error: '❌ Gagal menghapus pertanyaan: ' + err.message,
          };
        }
      },

      copyAspek: async (aspekId) => {
        try {
          log.info('Copying aspek:', aspekId);
          if (!currentReputasiId) {
            throw new Error('Tidak ada data reputasi yang dipilih');
          }

          await copyParameter(currentReputasiId, aspekId);
          await handleRefresh();

          log.success('Aspek copied successfully');
          return { success: true };
        } catch (err) {
          log.error('Error copying aspek:', err);
          return {
            success: false,
            error: '❌ Gagal menyalin aspek: ' + err.message,
          };
        }
      },

      copyPertanyaan: async (aspekId, pertanyaanId) => {
        try {
          log.info('Copying pertanyaan:', { aspekId, pertanyaanId });
          if (!currentReputasiId) {
            throw new Error('Tidak ada data reputasi yang dipilih');
          }

          await copyNilai(currentReputasiId, aspekId, pertanyaanId);
          await handleRefresh();

          log.success('Pertanyaan copied successfully');
          return { success: true };
        } catch (err) {
          log.error('Error copying pertanyaan:', err);
          return {
            success: false,
            error: '❌ Gagal menyalin pertanyaan: ' + err.message,
          };
        }
      },

      getAspekById: (aspekId) => {
        return localRows.find((p) => p.id === aspekId) || null;
      },

      refreshData: async () => {
        try {
          log.info('Refreshing data...');
          await refreshData();
          log.success('Data refreshed successfully');
          return { success: true };
        } catch (err) {
          log.error('Error refreshing data:', err);
          return {
            success: false,
            error: '❌ Gagal refresh data: ' + err.message,
          };
        }
      },

      changeQuarter: async (newYear, newQuarter) => {
        try {
          log.info(`Changing quarter to ${newYear}-Q${newQuarter}`);
          await loadByYearQuarter(newYear, newQuarter);
          log.success('Quarter changed successfully');
          return { success: true };
        } catch (err) {
          log.error('Error changing quarter:', err);
          return {
            success: false,
            error: '❌ Gagal berpindah quarter: ' + err.message,
          };
        }
      },

      formatAspekJudul: (aspek) => {
        return aspek?.judul || '';
      },

      formatPertanyaan: (nilai) => {
        return nilai?.judul?.text || '';
      },

      formatBobot: (aspek) => {
        return aspek?.bobot || 0;
      },
    }),
    [currentReputasiId, localRows, addParameter, updateParameter, deleteParameter, addNilai, updateNilai, deleteNilai, copyParameter, copyNilai, handleRefresh, loadByYearQuarter],
  );

  // Loading state
  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Memuat data dari database...</p>
          <p className="text-sm text-gray-500 mt-2">
            Tahun: {year} | Quarter: {quarter}
          </p>
          {error && <p className="text-sm text-red-500 mt-2">Error: {error}</p>}
        </div>
      </div>
    );
  }

  // Error state
  const safeRows = Array.isArray(localRows) ? localRows : [];
  if (error && safeRows.length === 0) {
    log.error('Rendering error state', { error });
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <div className="flex items-center">
          <div className="text-red-500 mr-3">
            <TriangleAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-red-800">Error Memuat Data</h3>
            <p className="text-red-700">{error}</p>
            <div className="mt-2 space-y-2">
              <button
                onClick={() => {
                  log.info('Retry loading data');
                  setIsInitialLoading(true);
                  backendHandlers.changeQuarter(year, quarter).finally(() => setIsInitialLoading(false));
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Coba Lagi
              </button>
              <button
                onClick={() => {
                  log.info('Reset loading state');
                  setIsInitialLoading(false);
                }}
                className="ml-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header dengan kontrol */}
      <div className="bg-white rounded-lg border shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Reputasi - Inherent Risk</h1>
            <p className="text-gray-600">
              Tahun: <span className="font-semibold">{year}</span> | Quarter: <span className="font-semibold">Q{quarter}</span>
              {currentReputasiId && <span className="ml-4 text-xs bg-gray-100 px-2 py-1 rounded">ID: {String(currentReputasiId).substring(0, 8)}...</span>}
            </p>
            {reputasi?.isLocked && (
              <p className="text-sm text-amber-600 mt-1">
                <TriangleAlert className="w-4 h-4 inline mr-1" />
                Data terkunci pada {new Date(reputasi.lockedAt).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Search Input */}
            <div className="relative">
              <Input type="text" placeholder="Cari aspek..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 w-64" />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
            </div>

            {/* Status Toggle */}
            <Button onClick={() => setActive(!active)} variant={active ? 'default' : 'outline'} className={active ? 'bg-blue-600 hover:bg-blue-700' : ''}>
              {active ? 'Aktif' : 'Nonaktif'}
            </Button>

            {/* Refresh Button */}
            <Button onClick={() => backendHandlers.refreshData()} variant="outline" className="flex items-center gap-2" disabled={loading || saving || isRefreshing}>
              {loading || saving || isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Refresh
            </Button>
          </div>
        </div>

        {/* Info Panel */}
        <div className="rounded-lg p-3 bg-blue-50 border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="text-blue-500">
              <TriangleAlert className="w-5 h-5" />
            </div>

            <div className="text-sm text-blue-800">
              <span className="font-semibold">Auto-update aktif.</span> Semua perubahan langsung tampil tanpa refresh manual.
              <span className="font-semibold ml-2">Total {safeRows.length} aspek</span>
              {reputasi?.summary?.totalWeighted && (
                <span className="ml-2">
                  | Total Weighted: <span className="font-bold">{reputasi.summary.totalWeighted.toFixed(2)}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Komponen utama */}
      <ReputasiInherent rows={safeRows} setRows={setRows} search={search} active={active} backendHandlers={backendHandlers} isLoading={loading || saving || isRefreshing} isLocked={reputasi?.isLocked || false} />
    </div>
  );
}

// Komponen utama
function ReputasiInherent({ rows, setRows, search, active, backendHandlers, isLoading, isLocked = false }) {
  const { activeQuarter } = useHeaderStore();

  // PERBAIKAN: Validasi rows
  const safeRows = useMemo(() => {
    return Array.isArray(rows) ? rows : [];
  }, [rows]);

  // PERBAIKAN: Filter rows dengan validasi
  const filteredRows = useMemo(() => {
    if (safeRows.length === 0) {
      return [];
    }

    if (!search) return safeRows;

    const s = search.toLowerCase();
    return safeRows.filter((row) => {
      if (!row) return false;
      return (row.judul && row.judul.toLowerCase().includes(s)) || (row.nomor && row.nomor.toString().includes(s));
    });
  }, [safeRows, search]);

  return (
    <div className="w-full space-y-6">
      <AspekPanel rows={safeRows} setRows={setRows} active={active} backendHandlers={backendHandlers} isLoading={isLoading || isLocked} isLocked={isLocked} />
      <TableInherent rows={filteredRows} activeQuarter={activeQuarter} />
    </div>
  );
}

// AspekPanel dengan integrasi backend
function AspekPanel({ rows, setRows, active, backendHandlers, isLoading: globalLoading, isLocked = false }) {
  const [activeAspekIndex, setActiveAspekIndex] = useState(null);
  const [activePertanyaanIndex, setActivePertanyaanIndex] = useState(0);
  const [showAspekForm, setShowAspekForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [originalAspek, setOriginalAspek] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteContext, setDeleteContext] = useState({
    type: '', // 'aspek' atau 'pertanyaan'
    aspekIndex: null,
    pertanyaanIndex: null,
  });

  const [draftAspek, setDraftAspek] = useState(() => ({
    nomor: '',
    judul: '',
    bobot: 0,
    deskripsi: '',
  }));

  const [openAspekList, setOpenAspekList] = useState(false);
  const dropdownBtnRef = useRef(null);
  const [dropdownRect, setDropdownRect] = useState(null);
  const dropdownListRef = useRef(null);

  // PERBAIKAN: Validasi rows
  const safeRows = useMemo(() => {
    return Array.isArray(rows) ? rows : [];
  }, [rows]);

  // PERBAIKAN: Reset active selection ketika rows berubah
  useEffect(() => {
    if (safeRows.length === 0) {
      setActiveAspekIndex(null);
      setActivePertanyaanIndex(0);
      setEditMode(false);
      setOriginalAspek(null);
      setDraftAspek({
        nomor: '',
        judul: '',
        bobot: '',
        deskripsi: '',
      });
    }
  }, [safeRows]);

  useEffect(() => {
    if (!openAspekList || !dropdownBtnRef.current) return;

    const updatePosition = () => {
      const rect = dropdownBtnRef.current.getBoundingClientRect();
      setDropdownRect({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    };

    updatePosition();

    const handleScroll = () => updatePosition();
    const handleResize = () => updatePosition();

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [openAspekList]);

  useDropdownPortal({
    open: openAspekList,
    setOpen: setOpenAspekList,
    triggerRef: dropdownBtnRef,
    containerRef: dropdownListRef,
  });

  useEffect(() => {
    if (!active) setOpenAspekList(false);
  }, [active]);

  // PERBAIKAN: Safe active aspek index
  const safeActiveAspekIndex = useMemo(() => {
    if (activeAspekIndex !== null && activeAspekIndex >= 0 && activeAspekIndex < safeRows.length) {
      return activeAspekIndex;
    }
    return null;
  }, [activeAspekIndex, safeRows]);

  const safeActiveAspek = useMemo(() => {
    if (safeActiveAspekIndex !== null && safeRows[safeActiveAspekIndex]) {
      return safeRows[safeActiveAspekIndex];
    }
    return null;
  }, [safeRows, safeActiveAspekIndex]);

  useEffect(() => {
    if (safeActiveAspekIndex !== null) {
      setEditMode(false);
      setOriginalAspek(null);
    }
  }, [safeActiveAspekIndex]);

  const aspek = editMode ? draftAspek : (safeActiveAspek ?? draftAspek);

  useEffect(() => {
    setActivePertanyaanIndex(0);
  }, [safeActiveAspekIndex]);

  useEffect(() => {
    if (safeActiveAspek && !editMode) {
      const newDraft = {
        nomor: safeActiveAspek.nomor ?? '',
        judul: safeActiveAspek.judul ?? '',
        bobot: safeActiveAspek.bobot ?? '',
        deskripsi: safeActiveAspek.deskripsi ?? '',
      };

      setDraftAspek((prev) => (JSON.stringify(prev) === JSON.stringify(newDraft) ? prev : newDraft));
    } else if (!safeActiveAspek && !editMode) {
      setDraftAspek({
        nomor: '',
        judul: '',
        bobot: '',
        deskripsi: '',
      });
      setEditMode(false);
      setOriginalAspek(null);
    }
  }, [safeActiveAspek, editMode]);

  const handleChangeAspek = useCallback((key, value) => {
    setDraftAspek((p) => ({ ...p, [key]: value }));
  }, []);

  const handleEditAspek = useCallback(() => {
    if (safeActiveAspekIndex === null) return;

    const aspek = safeRows[safeActiveAspekIndex];

    const aspekCopy = {
      ...aspek,
      pertanyaanList: aspek.pertanyaanList
        ? aspek.pertanyaanList.map((pertanyaan) => ({
            ...pertanyaan,
            skor: pertanyaan.skor ? { ...pertanyaan.skor } : {},
            indicator: pertanyaan.indicator ? { ...pertanyaan.indicator } : {},
          }))
        : [],
    };

    setOriginalAspek(aspekCopy);

    setDraftAspek({
      nomor: aspek.nomor ?? '',
      judul: aspek.judul ?? '',
      bobot: aspek.bobot ?? '',
      deskripsi: aspek.deskripsi ?? '',
    });

    setEditMode(true);
  }, [safeActiveAspekIndex, safeRows]);

  const handleUpdateAspek = useCallback(async () => {
    if (safeActiveAspekIndex === null) return;

    const bobotNum = Number(draftAspek.bobot);
    if (isNaN(bobotNum) || bobotNum < 0 || bobotNum > 100) {
      alert('Bobot harus antara 0 dan 100.');
      return;
    }

    const judul = draftAspek.judul?.trim();
    if (!judul) {
      alert('Judul aspek tidak boleh kosong.');
      return;
    }

    setLoading(true);
    try {
      const updateAspekDto = {
        nomor: draftAspek.nomor || '',
        judul: judul,
        bobot: bobotNum,
        deskripsi: draftAspek.deskripsi || '',
      };

      console.log('🟢 [COMPONENT] Update payload:', JSON.stringify(updateAspekDto, null, 2));

      if (backendHandlers?.updateAspek && safeRows[safeActiveAspekIndex].id) {
        const result = await backendHandlers.updateAspek(safeRows[safeActiveAspekIndex].id, updateAspekDto);

        if (!result.success) {
          throw new Error(result.error || 'Gagal update ke backend');
        }
      }

      // Update local state (meskipun sebenarnya data dikelola oleh hook)
      const updatedRows = safeRows.map((row, idx) =>
        idx === safeActiveAspekIndex
          ? {
              ...row,
              nomor: draftAspek.nomor || '',
              judul: judul,
              bobot: bobotNum,
              deskripsi: draftAspek.deskripsi || '',
            }
          : row,
      );

      setRows(updatedRows);
      setEditMode(false);
      setOriginalAspek(null);
      setLoading(false);
    } catch (error) {
      console.error('🔴 [COMPONENT] Error updating:', error);

      let errorMessage = error.message || 'Gagal mengupdate aspek';

      if (error.response || error.result?.response) {
        const response = error.response || error.result.response;
        if (response.data?.errors) {
          const errorDetails = response.data.errors.map((err) => `${err.field || 'unknown'}: ${err.message}`).join('\n');
          errorMessage = `Validasi gagal:\n${errorDetails}`;
        } else if (response.data?.message) {
          errorMessage = response.data.message;
        }
      }

      alert(`❌ Error: ${errorMessage}`);
      setLoading(false);
    }
  }, [draftAspek, safeActiveAspekIndex, safeRows, setRows, backendHandlers]);

  const handleAddNewAspek = useCallback(async () => {
    const bobotNum = Number(draftAspek.bobot);

    console.log('🔵 [COMPONENT] handleAddNewAspek - draftAspek:', draftAspek);

    if (isNaN(bobotNum) || bobotNum < 0 || bobotNum > 100) {
      alert('Bobot harus antara 0 dan 100.');
      return;
    }

    const judul = draftAspek.judul?.trim();
    if (!judul) {
      alert('Judul aspek tidak boleh kosong.');
      return;
    }

    setLoading(true);
    try {
      const createAspekDto = {
        nomor: draftAspek.nomor || '',
        judul: judul,
        bobot: bobotNum,
        deskripsi: draftAspek.deskripsi || '',
      };

      console.log('🚀 [DEBUG] Final payload untuk backend:', JSON.stringify(createAspekDto, null, 2));

      const result = await backendHandlers.addAspek(createAspekDto);

      if (!result.success) {
        console.error('🔴 [COMPONENT] Backend error response:', result);

        let errorMessage = 'Validasi gagal';

        if (result.error) {
          errorMessage = result.error.replace('❌ Gagal menambahkan aspek: ', '');
        } else if (result.response) {
          const backendResponse = result.response;

          if (backendResponse.errors) {
            const errorDetails = backendResponse.errors.map((err, idx) => `${idx + 1}. ${err.field || 'unknown'}: ${err.message || 'validation error'}`).join('\n');
            errorMessage = `Validasi gagal:\n${errorDetails}`;
          } else if (backendResponse.message) {
            errorMessage = backendResponse.message;
          } else if (backendResponse.details) {
            errorMessage = backendResponse.details;
          } else if (typeof backendResponse === 'string') {
            errorMessage = backendResponse;
          }
        }

        throw new Error(errorMessage);
      }

      console.log('✅ [COMPONENT] Aspek berhasil ditambahkan');

      setDraftAspek({
        nomor: '',
        judul: '',
        bobot: '',
        deskripsi: '',
      });

      setLoading(false);
    } catch (error) {
      console.error('🔴 [COMPONENT] Error in handleAddNewAspek:', error);

      let errorMessage = error.message || 'Gagal menambahkan aspek';

      alert(`❌ Error: ${errorMessage}`);
      setLoading(false);
    }
  }, [draftAspek, backendHandlers]);

  const handleCancelEdit = useCallback(() => {
    if (originalAspek && safeActiveAspekIndex !== null) {
      setRows((prev) => {
        const prevRows = Array.isArray(prev) ? prev : [];
        return prevRows.map((row, idx) => (idx === safeActiveAspekIndex ? originalAspek : row));
      });
    }

    setEditMode(false);
    setOriginalAspek(null);
    setDraftAspek({
      nomor: '',
      judul: '',
      bobot: '',
      deskripsi: '',
    });
  }, [originalAspek, safeActiveAspekIndex, setRows]);

  const handleCopyAspek = useCallback(async () => {
    if (safeActiveAspekIndex === null) return;

    const source = safeRows[safeActiveAspekIndex];

    setLoading(true);
    try {
      if (backendHandlers?.copyAspek && source.id) {
        const result = await backendHandlers.copyAspek(source.id);
        if (!result.success) {
          throw new Error(result.error || 'Gagal copy ke backend');
        }

        setLoading(false);
        return;
      }

      // Fallback jika tidak ada backend handler
      const copiedAspek = {
        ...source,
        id: `copy-${Date.now()}`,
        nomor: `${source.nomor}`,
        judul: `${source.judul} (Copy)`,
        bobot: source.bobot,
        deskripsi: source.deskripsi || '',
        pertanyaanList: (source.pertanyaanList || []).map((p) => ({
          ...structuredClone(p),
          id: `copy-pertanyaan-${Date.now()}-${Math.random()}`,
        })),
      };

      setRows((prev) => {
        const prevRows = Array.isArray(prev) ? prev : [];
        const next = [...prevRows, copiedAspek];
        setActiveAspekIndex(next.length - 1);
        setActivePertanyaanIndex(0);
        setEditMode(false);
        setOriginalAspek(null);
        return next;
      });

      setLoading(false);
    } catch (error) {
      alert(error.message || 'Gagal menyalin aspek');
      setLoading(false);
    }
  }, [safeActiveAspekIndex, safeRows, setRows, backendHandlers]);

  const handleDeleteAspek = useCallback(() => {
    if (safeActiveAspekIndex === null) return;

    const aspek = safeRows[safeActiveAspekIndex];

    setItemToDelete({
      name: aspek.judul || 'aspek ini',
      nomor: aspek.nomor || '-',
      judul: aspek.judul || 'Tidak ada judul',
    });
    setDeleteContext({
      type: 'aspek',
      aspekIndex: safeActiveAspekIndex,
      pertanyaanIndex: null,
    });
    setDeleteDialogOpen(true);
  }, [safeActiveAspekIndex, safeRows]);

  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete || !deleteContext.type) return;

    setLoading(true);

    if (deleteContext.type === 'aspek') {
      const { aspekIndex } = deleteContext;

      if (aspekIndex === null) {
        setLoading(false);
        setDeleteDialogOpen(false);
        return;
      }

      const aspekToDelete = safeRows[aspekIndex];

      if (backendHandlers?.deleteAspek && aspekToDelete.id) {
        try {
          const result = await backendHandlers.deleteAspek(aspekToDelete.id);
          if (!result.success) {
            throw new Error(result.error || 'Gagal delete dari backend');
          }
        } catch (error) {
          alert(error.message || '❌ Gagal menghapus dari database');
          setLoading(false);
          setDeleteDialogOpen(false);
          return;
        }
      }

      const updatedRows = safeRows.filter((_, idx) => idx !== aspekIndex);
      setRows(updatedRows);

      const nextIndex = updatedRows.length > 0 ? 0 : null;
      setActiveAspekIndex(nextIndex);
      setActivePertanyaanIndex(0);
      setEditMode(false);
      setOriginalAspek(null);

      setDeleteDialogOpen(false);
      setItemToDelete(null);
      setDeleteContext({ type: '', aspekIndex: null, pertanyaanIndex: null });

      setLoading(false);
    } else if (deleteContext.type === 'pertanyaan') {
      const { aspekIndex, pertanyaanIndex } = deleteContext;

      if (aspekIndex === null || pertanyaanIndex === null) {
        setLoading(false);
        setDeleteDialogOpen(false);
        return;
      }

      const aspek = safeRows[aspekIndex];
      const pertanyaanToDelete = aspek.pertanyaanList?.[pertanyaanIndex];

      if (backendHandlers?.deletePertanyaan && aspek.id && pertanyaanToDelete?.id) {
        try {
          const result = await backendHandlers.deletePertanyaan(aspek.id, pertanyaanToDelete.id);
          if (!result.success) {
            throw new Error(result.error || 'Gagal delete pertanyaan dari database');
          }
        } catch (error) {
          alert(error.message || '❌ Gagal menghapus pertanyaan dari database');
          setLoading(false);
          setDeleteDialogOpen(false);
          return;
        }
      }

      const updatedRows = safeRows.map((row, ri) => {
        if (ri !== aspekIndex) return row;

        const updatedPertanyaanList = (row.pertanyaanList || []).filter((_, pi) => pi !== pertanyaanIndex);

        return {
          ...row,
          pertanyaanList: updatedPertanyaanList,
        };
      });

      setRows(updatedRows);

      const nextIndex = Math.max(0, pertanyaanIndex - 1);
      setActivePertanyaanIndex(nextIndex);

      setDeleteDialogOpen(false);
      setItemToDelete(null);
      setDeleteContext({ type: '', aspekIndex: null, pertanyaanIndex: null });

      setLoading(false);
    }
  }, [itemToDelete, deleteContext, safeRows, setRows, backendHandlers]);

  // PERBAIKAN: Format label dengan indikator loading
  const formatLabel = useCallback((row) => {
    if (!row) return 'Data tidak valid';

    // Tambahkan indikator untuk item temporary atau updating
    const isTemp = row.isTemp ? '⏳ ' : '';
    const isUpdating = row.isUpdating ? '🔄 ' : '';

    return `${isTemp || isUpdating}${row.nomor || '-'} – ${row.judul || 'Tanpa Judul'} (Bobot: ${row.bobot || 0}%)${row.deskripsi ? ' | ' + row.deskripsi : ''}`;
  }, []);

  const handleClearSelection = useCallback(() => {
    setActiveAspekIndex(null);
    setActivePertanyaanIndex(0);
    setEditMode(false);
    setOriginalAspek(null);
    setDraftAspek({
      nomor: '',
      judul: '',
      bobot: '',
      deskripsi: '',
    });
    setOpenAspekList(false);
  }, []);

  const handleOpenPertanyaanDeleteDialog = useCallback(
    (pertanyaan, pertanyaanIndex) => {
      setItemToDelete({
        name: pertanyaan.pertanyaan || 'pertanyaan ini',
        nomor: pertanyaan.nomor || '-',
        judul: pertanyaan.pertanyaan || 'Tidak ada judul',
      });
      setDeleteContext({
        type: 'pertanyaan',
        aspekIndex: safeActiveAspekIndex,
        pertanyaanIndex: pertanyaanIndex,
      });
      setDeleteDialogOpen(true);
    },
    [safeActiveAspekIndex],
  );

  const isDisabled = loading || globalLoading || isLocked;

  return (
    <div className="w-full space-y-3">
      <div className="bg-gradient-to-r from-blue-700 to-sky-600 text-white px-4 py-3 rounded-lg border border-slate-700">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">
            <h2 className="">Aspek (Tersinkron dengan Database)</h2>
            {isLocked && (
              <div className="text-xs bg-amber-600 text-white px-2 py-1 rounded mt-1 inline-flex items-center">
                <TriangleAlert className="w-3 h-3 mr-1" />
                Data terkunci - hanya bisa melihat
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isDisabled && (
              <div className="text-xs bg-slate-700 text-slate-200 px-2 py-1 rounded flex items-center">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Memproses...
              </div>
            )}

            <Button size="sm" variant="outline" onClick={() => setShowAspekForm(!showAspekForm)} className="bg-slate-700 text-slate-200 hover:bg-slate-600 text-sm px-3 border-slate-600" disabled={isDisabled}>
              {showAspekForm ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Sembunyikan
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Tampilkan
                </>
              )}
            </Button>

            {safeActiveAspekIndex !== null && !editMode && !isLocked && (
              <Button size="icon" onClick={handleEditAspek} className="bg-blue-600 hover:bg-blue-700" disabled={isDisabled} title="Edit Aspek">
                <Edit className="w-4 h-4" />
              </Button>
            )}

            {editMode && !isLocked && (
              <Button size="icon" onClick={handleCancelEdit} className="bg-gray-600 hover:bg-gray-700" disabled={isDisabled} title="Batal Edit">
                <X className="w-4 h-4" />
              </Button>
            )}

            {!isLocked && (
              <>
                <Button
                  size="icon"
                  onClick={editMode ? handleUpdateAspek : handleAddNewAspek}
                  className={editMode ? 'bg-green-600 hover:bg-green-700' : 'bg-emerald-600 hover:bg-emerald-700'}
                  disabled={isDisabled}
                  title={editMode ? 'Update Aspek' : 'Tambah Aspek'}
                >
                  {editMode ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </Button>

                <Button size="icon" onClick={handleCopyAspek} disabled={safeActiveAspekIndex === null || isDisabled} className="bg-amber-600 hover:bg-amber-700" title="Salin Aspek">
                  <Copy className="w-4 h-4" />
                </Button>

                <Button size="icon" onClick={handleDeleteAspek} disabled={safeActiveAspekIndex === null || isDisabled} className="bg-rose-600 hover:bg-rose-700" title="Hapus Aspek">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {showAspekForm && (
          <>
            <div className="w-full bg-slate-200 rounded p-0.5 mt-2" />

            <div className="w-full flex gap-2 my-3">
              <div className="w-[10%]">
                <label className="font-semibold text-sm ml-2 text-slate-200">No</label>
                <Input
                  placeholder="1."
                  value={aspek.nomor}
                  onChange={(e) => handleChangeAspek('nomor', e.target.value)}
                  className="bg-white text-slate-950 border-slate-300"
                  disabled={isDisabled || (safeActiveAspekIndex !== null && !editMode) || isLocked}
                />
              </div>

              <div className="w-[10%]">
                <label className="font-semibold text-sm ml-2 text-slate-200">Bobot</label>
                <Input
                  placeholder="max 100%"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={aspek.bobot}
                  onChange={(e) => handleChangeAspek('bobot', e.target.value)}
                  className="bg-white text-slate-950 border-slate-300"
                  disabled={isDisabled || (safeActiveAspekIndex !== null && !editMode) || isLocked}
                />
              </div>

              <div className="w-[60%]">
                <label className="font-semibold text-sm ml-2 text-slate-200">Aspek</label>
                <Input
                  placeholder="Nama aspek"
                  value={aspek.judul}
                  disabled={isDisabled || (safeActiveAspekIndex !== null && !editMode) || isLocked}
                  onChange={(e) => handleChangeAspek('judul', e.target.value)}
                  className={`bg-white text-slate-950 border-slate-300 ${isDisabled || (safeActiveAspekIndex !== null && !editMode) || isLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
                  required
                />
              </div>

              <div className="w-[20%]">
                <label className="font-semibold text-sm ml-2 text-slate-200">Deskripsi</label>
                <Input
                  placeholder="Deskripsi aspek"
                  value={aspek.deskripsi}
                  onChange={(e) => handleChangeAspek('deskripsi', e.target.value)}
                  className="bg-white text-slate-950 border-slate-300"
                  disabled={isDisabled || (safeActiveAspekIndex !== null && !editMode) || isLocked}
                />
              </div>
            </div>

            <button
              ref={dropdownBtnRef}
              onClick={() => setOpenAspekList((v) => !v)}
              className="w-full mt-3 bg-white text-sm text-slate-800 px-3 py-2 rounded-md flex justify-between border border-slate-300 hover:bg-slate-50"
              disabled={isDisabled}
            >
              <span className="truncate">{safeActiveAspek ? formatLabel(safeActiveAspek) : 'Pilih atau Tambah Aspek Baru'}</span>
              <span>▾</span>
            </button>

            {openAspekList &&
              dropdownRect &&
              safeRows.length > 0 &&
              createPortal(
                <div
                  ref={dropdownListRef}
                  className="fixed bg-white text-slate-800 rounded-md shadow-lg max-h-[220px] overflow-auto z-[9999] border border-slate-200"
                  style={{
                    top: dropdownRect.top,
                    left: dropdownRect.left,
                    width: dropdownRect.width,
                  }}
                >
                  <button
                    onClick={() => {
                      handleClearSelection();
                      setOpenAspekList(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 border-b border-slate-200"
                  >
                    ← Kosongkan Pilihan
                  </button>

                  {safeRows.map((row, idx) => (
                    <button
                      key={row?.id ?? idx}
                      onClick={() => {
                        setActiveAspekIndex(idx);
                        setOpenAspekList(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-slate-50 ${idx === safeActiveAspekIndex ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700'} ${row.isTemp ? 'opacity-70 italic' : ''}`}
                    >
                      {formatLabel(row)}
                      {row.isTemp && <span className="ml-2 text-xs text-gray-500">(menyimpan...)</span>}
                      {row.isUpdating && <span className="ml-2 text-xs text-gray-500">(mengupdate...)</span>}
                    </button>
                  ))}
                </div>,
                document.body,
              )}
          </>
        )}
      </div>

      {!showAspekForm && <div className="w-full" />}

      {safeActiveAspek && (
        <PertanyaanPanel
          aspek={safeActiveAspek}
          pertanyaanList={safeActiveAspek.pertanyaanList}
          activePertanyaanIndex={activePertanyaanIndex}
          setActivePertanyaanIndex={setActivePertanyaanIndex}
          loading={isDisabled}
          aspekIndex={safeActiveAspekIndex}
          setRows={setRows}
          rows={safeRows}
          onOpenDeleteDialog={handleOpenPertanyaanDeleteDialog}
          backendHandlers={backendHandlers}
          isLocked={isLocked}
        />
      )}

      <PopUpDelete
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={`Hapus ${deleteContext.type === 'aspek' ? 'Aspek' : 'Pertanyaan'}`}
        description={`Apakah Anda yakin ingin menghapus ${deleteContext.type === 'aspek' ? 'aspek' : 'pertanyaan'} ini? Tindakan ini tidak dapat dibatalkan.`}
        itemName={itemToDelete?.name || ''}
        itemNomor={itemToDelete?.nomor || ''}
        itemJudul={itemToDelete?.judul || ''}
        itemType={deleteContext.type === 'aspek' ? 'aspek' : 'pertanyaan'}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setItemToDelete(null);
          setDeleteContext({ type: '', aspekIndex: null, pertanyaanIndex: null });
        }}
        confirmText="Hapus"
        cancelText="Batal"
        isLoading={loading}
      />
    </div>
  );
}

// PertanyaanPanel
function PertanyaanPanel({ aspek, pertanyaanList = [], activePertanyaanIndex, setActivePertanyaanIndex, loading = false, aspekIndex, setRows, rows, onOpenDeleteDialog, backendHandlers, isLocked = false }) {
  // PERBAIKAN: Validasi pertanyaanList
  const safePertanyaanList = useMemo(() => {
    return Array.isArray(pertanyaanList) ? pertanyaanList : [];
  }, [pertanyaanList]);

  const hasPertanyaan = safePertanyaanList.length > 0;

  const [showForm, setShowForm] = useState(true);
  const [formulaOpen, setFormulaOpen] = useState(false);
  const [tempFormula, setTempFormula] = useState('');
  const [tempPercent, setTempPercent] = useState(false);

  const [editModePertanyaan, setEditModePertanyaan] = useState(false);
  const [originalPertanyaan, setOriginalPertanyaan] = useState(null);
  const [draftPertanyaan, setDraftPertanyaan] = useState(() => createEmptyDraftPertanyaan());

  const [isSaving, setIsSaving] = useState(false);

  const [openPertanyaanList, setOpenPertanyaanList] = useState(false);
  const dropdownPertanyaanBtnRef = useRef(null);
  const [dropdownPertanyaanRect, setDropdownPertanyaanRect] = useState(null);
  const dropdownPertanyaanListRef = useRef(null);

  // PERBAIKAN: Reset state ketika aspek berubah
  useEffect(() => {
    setEditModePertanyaan(false);
    setOriginalPertanyaan(null);
    setActivePertanyaanIndex(0);
    setDraftPertanyaan(createEmptyDraftPertanyaan());
  }, [aspek?.id, setActivePertanyaanIndex]);

  useEffect(() => {
    if (!openPertanyaanList || !dropdownPertanyaanBtnRef.current) return;

    const updatePosition = () => {
      const rect = dropdownPertanyaanBtnRef.current.getBoundingClientRect();
      setDropdownPertanyaanRect({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    };

    updatePosition();

    const handleScroll = () => updatePosition();
    const handleResize = () => updatePosition();

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [openPertanyaanList]);

  useDropdownPortal({
    open: openPertanyaanList,
    setOpen: setOpenPertanyaanList,
    triggerRef: dropdownPertanyaanBtnRef,
    containerRef: dropdownPertanyaanListRef,
  });

  // PERBAIKAN: Safe active index
  const safeActiveIndex = useMemo(() => {
    if (hasPertanyaan && activePertanyaanIndex >= 0 && activePertanyaanIndex < safePertanyaanList.length) {
      return activePertanyaanIndex;
    }
    return -1;
  }, [hasPertanyaan, activePertanyaanIndex, safePertanyaanList]);

  // PERBAIKAN: Update draft berdasarkan pertanyaan aktif
  useEffect(() => {
    if (!editModePertanyaan) {
      if (safeActiveIndex >= 0 && safePertanyaanList[safeActiveIndex]) {
        setDraftPertanyaan({ ...safePertanyaanList[safeActiveIndex] });
      } else {
        setDraftPertanyaan(createEmptyDraftPertanyaan());
      }
    }
  }, [safeActiveIndex, safePertanyaanList, editModePertanyaan]);

  // PERBAIKAN: Reset jika tidak ada pertanyaan
  useEffect(() => {
    if (!hasPertanyaan && activePertanyaanIndex !== -1) {
      setActivePertanyaanIndex(-1);
    }
  }, [hasPertanyaan, activePertanyaanIndex, setActivePertanyaanIndex]);

  function createEmptyDraftPertanyaan() {
    return {
      nomor: '',
      pertanyaan: '',
      skor: {
        Q1: undefined,
        Q2: undefined,
        Q3: undefined,
        Q4: undefined,
      },
      indicator: {
        strong: '',
        satisfactory: '',
        fair: '',
        marginal: '',
        unsatisfactory: '',
      },
      evidence: '',
      catatan: '',
    };
  }

  const getCurrentPertanyaan = () => {
    if (editModePertanyaan) {
      return draftPertanyaan;
    }

    if (safeActiveIndex >= 0 && hasPertanyaan && safePertanyaanList[safeActiveIndex]) {
      return safePertanyaanList[safeActiveIndex];
    }

    return draftPertanyaan;
  };

  const currentPertanyaan = getCurrentPertanyaan();

  // PERBAIKAN: Format label dengan indikator loading
  const formatPertanyaanLabel = useCallback((pertanyaan, index) => {
    if (!pertanyaan) return 'Pilih atau Tambah Pertanyaan Baru';

    const nomor = pertanyaan.nomor || index + 1;
    const text = pertanyaan.pertanyaan || 'Tanpa Pertanyaan';
    const copyText = pertanyaan.pertanyaan?.includes('(Copy)') ? ' (Copy)' : '';
    const isTemp = pertanyaan.isTemp ? '⏳ ' : '';
    const isUpdating = pertanyaan.isUpdating ? '🔄 ' : '';

    return `${isTemp || isUpdating}${nomor} – ${text}${copyText}`;
  }, []);

  const openFormula = () => {
    setFormulaOpen(false);
  };

  const saveFormula = () => {
    setFormulaOpen(false);
  };

  const handleChangePertanyaanField = useCallback(
    (path, value) => {
      const keys = path.split('.');
      const updatedDraft = { ...draftPertanyaan };

      let current = updatedDraft;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key]) current[key] = {};
        current = current[key];
      }

      const lastKey = keys[keys.length - 1];
      current[lastKey] = value;

      setDraftPertanyaan(updatedDraft);

      if (editModePertanyaan) {
        setDraftPertanyaan(updatedDraft);
      }
    },
    [draftPertanyaan, editModePertanyaan],
  );

  const handleChangeSkor = useCallback(
    (quarter, value) => {
      const updatedDraft = {
        ...draftPertanyaan,
        skor: {
          ...draftPertanyaan.skor,
          [quarter]: value === '' ? undefined : Number(value),
        },
      };

      setDraftPertanyaan(updatedDraft);
    },
    [draftPertanyaan],
  );

  const handleChangeIndicator = useCallback(
    (key, value) => {
      const updatedDraft = {
        ...draftPertanyaan,
        indicator: {
          ...draftPertanyaan.indicator,
          [key]: value,
        },
      };

      setDraftPertanyaan(updatedDraft);
    },
    [draftPertanyaan],
  );

  const handleAddPertanyaan = useCallback(async () => {
    if (aspekIndex === null) return;

    console.log('🟢 [PertanyaanPanel] handleAddPertanyaan called');

    if (!draftPertanyaan.pertanyaan?.trim()) {
      alert('Pertanyaan tidak boleh kosong!');
      return;
    }

    setIsSaving(true);

    try {
      const createPertanyaanDto = {
        nomor: draftPertanyaan.nomor || '',
        pertanyaan: draftPertanyaan.pertanyaan.trim(),
        skor: draftPertanyaan.skor || {},
        indicator: {
          strong: draftPertanyaan.indicator?.strong || '',
          satisfactory: draftPertanyaan.indicator?.satisfactory || '',
          fair: draftPertanyaan.indicator?.fair || '',
          marginal: draftPertanyaan.indicator?.marginal || '',
          unsatisfactory: draftPertanyaan.indicator?.unsatisfactory || '',
        },
        evidence: draftPertanyaan.evidence || '',
        catatan: draftPertanyaan.catatan || '',
      };

      console.log('🟢 [PertanyaanPanel] Adding pertanyaan DTO:', createPertanyaanDto);

      if (backendHandlers?.addPertanyaan && aspek.id && !isLocked) {
        const result = await backendHandlers.addPertanyaan(aspek.id, createPertanyaanDto);
        if (!result.success) {
          throw new Error(result.error || 'Gagal menambahkan pertanyaan ke database');
        }

        console.log('✅ [PertanyaanPanel] Pertanyaan berhasil ditambahkan ke database');
      } else {
        console.log('🟡 [PertanyaanPanel] Using local state fallback');
        setRows((prev) => {
          const prevRows = Array.isArray(prev) ? prev : [];
          return prevRows.map((row, ri) =>
            ri === aspekIndex
              ? {
                  ...row,
                  pertanyaanList: [...(row.pertanyaanList || []), draftPertanyaan],
                }
              : row,
          );
        });
      }

      setDraftPertanyaan(createEmptyDraftPertanyaan());

      const newIndex = safePertanyaanList.length;
      setActivePertanyaanIndex(newIndex);

      setEditModePertanyaan(false);
      setOriginalPertanyaan(null);

      console.log('✅ [PertanyaanPanel] Pertanyaan berhasil ditambahkan');
    } catch (error) {
      console.error('🔴 [PertanyaanPanel] Error adding pertanyaan:', error);
      alert(error.message || '❌ Gagal menambahkan pertanyaan');
    } finally {
      setIsSaving(false);
    }
  }, [aspekIndex, draftPertanyaan, backendHandlers, aspek.id, isLocked, setRows, safePertanyaanList]);

  const handleEditPertanyaan = useCallback(() => {
    if (safeActiveIndex >= 0 && safePertanyaanList[safeActiveIndex]) {
      console.log('✏️ [PertanyaanPanel] Entering edit mode for pertanyaan:', safePertanyaanList[safeActiveIndex].id);

      const original = safePertanyaanList[safeActiveIndex];
      setOriginalPertanyaan(structuredClone(original));
      setDraftPertanyaan(structuredClone(original));
      setEditModePertanyaan(true);
    }
  }, [safeActiveIndex, safePertanyaanList]);

  const handleUpdatePertanyaan = useCallback(async () => {
    console.log('💾 [PertanyaanPanel] handleUpdatePertanyaan called');

    if (safeActiveIndex === -1) {
      console.log('📝 [PertanyaanPanel] Safe active index -1, calling handleAddPertanyaan');
      await handleAddPertanyaan();
      return;
    }

    if (!draftPertanyaan || aspekIndex === null) {
      console.warn('⚠️ [PertanyaanPanel] No draft pertanyaan or aspekIndex');
      return;
    }

    if (!draftPertanyaan.pertanyaan?.trim()) {
      alert('Pertanyaan tidak boleh kosong!');
      return;
    }

    setIsSaving(true);

    try {
      console.log('🟢 [PertanyaanPanel] Updating pertanyaan:', {
        aspekId: aspek.id,
        pertanyaanId: safePertanyaanList[safeActiveIndex]?.id,
        draftPertanyaan,
      });

      if (backendHandlers?.updatePertanyaan && aspek.id && safePertanyaanList[safeActiveIndex]?.id && !isLocked) {
        const updatePertanyaanDto = { ...draftPertanyaan };
        delete updatePertanyaanDto.id;

        console.log('🟢 [PertanyaanPanel] Sending update to backend:', updatePertanyaanDto);

        const result = await backendHandlers.updatePertanyaan(aspek.id, safePertanyaanList[safeActiveIndex].id, updatePertanyaanDto);

        if (!result.success) {
          throw new Error(result.error || 'Gagal mengupdate pertanyaan ke database');
        }

        console.log('✅ [PertanyaanPanel] Backend update successful');
      } else {
        console.log('🟡 [PertanyaanPanel] Using local state update');
        setRows((prev) => {
          const prevRows = Array.isArray(prev) ? prev : [];
          return prevRows.map((row, ri) => {
            if (ri !== aspekIndex) return row;

            return {
              ...row,
              pertanyaanList: (row.pertanyaanList || []).map((p, pi) => (pi === safeActiveIndex ? draftPertanyaan : p)),
            };
          });
        });
      }

      setEditModePertanyaan(false);
      setOriginalPertanyaan(null);

      console.log('✅ [PertanyaanPanel] Pertanyaan berhasil diupdate');
    } catch (error) {
      console.error('🔴 [PertanyaanPanel] Error updating pertanyaan:', error);
      alert(error.message || '❌ Gagal mengupdate pertanyaan');
    } finally {
      setIsSaving(false);
    }
  }, [safeActiveIndex, draftPertanyaan, aspekIndex, handleAddPertanyaan, backendHandlers, isLocked, aspek.id, safePertanyaanList, setRows]);

  const handleCancelEditPertanyaan = useCallback(() => {
    console.log('❌ [PertanyaanPanel] Canceling edit');

    if (originalPertanyaan) {
      setDraftPertanyaan(originalPertanyaan);

      if (aspekIndex !== null && safeActiveIndex >= 0) {
        setRows((prev) => {
          const prevRows = Array.isArray(prev) ? prev : [];
          return prevRows.map((row, ri) => {
            if (ri !== aspekIndex) return row;

            return {
              ...row,
              pertanyaanList: (row.pertanyaanList || []).map((p, pi) => (pi === safeActiveIndex ? originalPertanyaan : p)),
            };
          });
        });
      }
    } else {
      if (safeActiveIndex >= 0 && hasPertanyaan && safePertanyaanList[safeActiveIndex]) {
        setDraftPertanyaan(safePertanyaanList[safeActiveIndex]);
      } else {
        setDraftPertanyaan(createEmptyDraftPertanyaan());
      }
    }

    setEditModePertanyaan(false);
    setOriginalPertanyaan(null);

    console.log('🔄 [PertanyaanPanel] Edit cancelled');
  }, [originalPertanyaan, aspekIndex, safeActiveIndex, hasPertanyaan, safePertanyaanList, setRows]);

  const handleCopyPertanyaan = useCallback(async () => {
    if (aspekIndex === null || !currentPertanyaan || safeActiveIndex === -1) return;

    console.log('📋 [PertanyaanPanel] Copying pertanyaan');

    const copiedPertanyaan = {
      ...structuredClone(currentPertanyaan),
      id: `copy-pertanyaan-${Date.now()}`,
      pertanyaan: `${currentPertanyaan.pertanyaan || 'Pertanyaan'} (Copy)`,
    };

    setRows((prev) => {
      const prevRows = Array.isArray(prev) ? prev : [];
      return prevRows.map((row, ri) =>
        ri === aspekIndex
          ? {
              ...row,
              pertanyaanList: [...(row.pertanyaanList || []), copiedPertanyaan],
            }
          : row,
      );
    });

    const newIndex = safePertanyaanList.length;
    setActivePertanyaanIndex(newIndex);

    setEditModePertanyaan(false);
    setOriginalPertanyaan(null);

    console.log('✅ [PertanyaanPanel] Pertanyaan berhasil disalin');
  }, [aspekIndex, currentPertanyaan, safeActiveIndex, setRows, safePertanyaanList]);

  const handleDeletePertanyaan = useCallback(() => {
    if (aspekIndex === null || !currentPertanyaan || safeActiveIndex === -1) return;

    if (onOpenDeleteDialog) {
      onOpenDeleteDialog(currentPertanyaan, safeActiveIndex);
    }
  }, [aspekIndex, currentPertanyaan, safeActiveIndex, onOpenDeleteDialog]);

  const handleSelectPertanyaan = (index) => {
    console.log('🔍 [PertanyaanPanel] Selecting pertanyaan index:', index);

    if (!editModePertanyaan) {
      setActivePertanyaanIndex(index);
      setOpenPertanyaanList(false);
    } else {
      const confirmed = window.confirm('Anda sedang dalam mode edit. Pilih pertanyaan lain akan membatalkan perubahan. Lanjutkan?');

      if (confirmed) {
        setEditModePertanyaan(false);
        setOriginalPertanyaan(null);
        setActivePertanyaanIndex(index);
        setOpenPertanyaanList(false);
      }
    }
  };

  const handleClearPertanyaanSelection = useCallback(() => {
    console.log('🗑️ [PertanyaanPanel] Clearing pertanyaan selection');

    if (editModePertanyaan) {
      const confirmed = window.confirm('Anda sedang dalam mode edit. Kosongkan pilihan akan membatalkan perubahan. Lanjutkan?');

      if (!confirmed) return;
    }

    setActivePertanyaanIndex(-1);
    setEditModePertanyaan(false);
    setOriginalPertanyaan(null);
    setDraftPertanyaan(createEmptyDraftPertanyaan());
    setOpenPertanyaanList(false);
  }, [editModePertanyaan]);

  const isEditDisabled = loading || isLocked || isSaving;
  const isInputDisabled = isEditDisabled || (safeActiveIndex >= 0 && !editModePertanyaan);

  console.log('🔍 [PertanyaanPanel] Debug:', {
    safeActiveIndex,
    editModePertanyaan,
    isEditDisabled,
    isInputDisabled,
    hasPertanyaan,
    pertanyaanCount: safePertanyaanList.length,
    currentPertanyaanId: currentPertanyaan?.id,
  });

  return (
    <div className="w-full relative">
      {/* Modal formula */}
      {formulaOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg w-[420px] p-4 space-y-3 text-slate-800 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="font-bold text-lg">Atur Skor</div>
              <Button onClick={() => setFormulaOpen(false)} disabled={loading || isLocked} variant="ghost" size="icon">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-end gap-2">
              <div className="flex flex-col flex-1">
                <label className="text-sm font-semibold mb-1">Skor</label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  step="0.01"
                  value={tempFormula}
                  onChange={(e) => setTempFormula(e.target.value)}
                  placeholder="Skor 1-5"
                  className="bg-slate-50 hover:bg-slate-100 text-slate-950 border-slate-300"
                  disabled={loading || isLocked}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" className="bg-white text-slate-800 border-slate-300 hover:bg-slate-50" onClick={() => setFormulaOpen(false)} disabled={loading || isLocked}>
                Batal
              </Button>
              <Button className="bg-blue-900 text-white hover:bg-blue-900" onClick={saveFormula} disabled={loading || isLocked}>
                Simpan
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header panel */}
      <div className="w-full bg-gradient-to-r from-blue-700 to-sky-600 text-white px-4 pt-4 pb-3 border-t border-slate-700 flex items-center justify-between gap-4 rounded-t-lg">
        <div className="text-lg font-bold">Pertanyaan Form (Tersinkron dengan Database)</div>

        {isLocked && (
          <div className="text-xs bg-amber-600 text-white px-2 py-1 rounded inline-flex items-center">
            <TriangleAlert className="w-3 h-3 mr-1" />
            Data terkunci - hanya bisa melihat
          </div>
        )}

        {editModePertanyaan && !isLocked && (
          <div className="text-xs bg-yellow-600 text-white px-2 py-1 rounded inline-flex items-center">
            <TriangleAlert className="w-3 h-3 mr-1" />
            Mode Edit Aktif
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button size="sm" variant="outline" onClick={() => setShowForm(!showForm)} className="bg-slate-700 text-slate-200 hover:bg-slate-600 text-sm px-3 border-slate-600" disabled={loading}>
            {showForm ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Sembunyikan
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 " />
                Tampilkan
              </>
            )}
          </Button>

          {safeActiveIndex >= 0 && hasPertanyaan && !editModePertanyaan && !isLocked && (
            <Button size="icon" onClick={handleEditPertanyaan} className="bg-blue-600 hover:bg-blue-700" disabled={loading || isSaving} title="Edit Pertanyaan">
              <Edit className="w-4 h-4" />
            </Button>
          )}

          {editModePertanyaan && !isLocked && (
            <Button size="icon" onClick={handleCancelEditPertanyaan} className="bg-gray-600 hover:bg-gray-700" disabled={loading || isSaving} title="Batal Edit">
              <X className="w-4 h-4" />
            </Button>
          )}

          {!isLocked && (
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                className="h-8 w-8 rounded-full bg-emerald-600 hover:bg-emerald-700"
                onClick={editModePertanyaan ? handleUpdatePertanyaan : handleAddPertanyaan}
                title={editModePertanyaan ? 'Update Pertanyaan' : safeActiveIndex === -1 ? 'Tambah Pertanyaan' : 'Tambah Pertanyaan Baru'}
                disabled={loading || isSaving}
              >
                {editModePertanyaan ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </Button>

              <Button size="icon" className="h-8 w-8 rounded-full bg-amber-600 hover:bg-amber-700" onClick={handleCopyPertanyaan} disabled={safeActiveIndex === -1 || loading || isSaving} title="Salin Pertanyaan">
                <Copy className="w-4 h-4" />
              </Button>

              <Button size="icon" className="h-8 w-8 rounded-full bg-rose-600 hover:bg-rose-700" onClick={handleDeletePertanyaan} disabled={safeActiveIndex === -1 || loading || isSaving} title="Hapus Pertanyaan">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Form input pertanyaan */}
      {showForm && (
        <div className="w-full bg-gradient-to-r from-blue-700 to-sky-600 text-white px-4 pb-4 border border-slate-700 space-y-4 rounded-b-lg">
          <div className="w-full bg-slate-200 rounded-lg p-0.5 mt-2" />

          <div className="space-y-2">
            <div className="flex flex-col">
              <label className="font-semibold text-sm ml-1 mb-1 text-slate-200">Pilih Pertanyaan</label>
              <button
                ref={dropdownPertanyaanBtnRef}
                onClick={() => setOpenPertanyaanList((v) => !v)}
                className="w-full bg-white text-slate-800 text-sm rounded px-3 py-2 flex justify-between items-center border border-slate-300 hover:bg-slate-50"
                disabled={loading || isSaving}
              >
                <span className="truncate">
                  {safeActiveIndex >= 0 && hasPertanyaan && safePertanyaanList[safeActiveIndex] ? formatPertanyaanLabel(safePertanyaanList[safeActiveIndex], safeActiveIndex) : 'Pilih atau Tambah Pertanyaan Baru'}
                </span>
                <span>▾</span>
              </button>
            </div>

            {openPertanyaanList &&
              dropdownPertanyaanRect &&
              safePertanyaanList.length > 0 &&
              createPortal(
                <div
                  ref={dropdownPertanyaanListRef}
                  className="fixed bg-white text-slate-800 rounded-md shadow-lg max-h-[220px] overflow-auto z-[9999] border border-slate-200"
                  style={{
                    top: dropdownPertanyaanRect.top,
                    left: dropdownPertanyaanRect.left,
                    width: dropdownPertanyaanRect.width,
                  }}
                >
                  <button
                    onClick={() => {
                      handleClearPertanyaanSelection();
                      setOpenPertanyaanList(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 border-b border-slate-200"
                  >
                    ← Kosongkan Pilihan (Buat Baru)
                  </button>

                  {safePertanyaanList.map((pertanyaan, idx) => (
                    <button
                      key={pertanyaan?.id ?? idx}
                      onClick={() => handleSelectPertanyaan(idx)}
                      className={`w-full text-left px-3 py-2 hover:bg-slate-50 ${idx === safeActiveIndex ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700'} ${pertanyaan.isTemp ? 'opacity-70 italic' : ''}`}
                    >
                      {formatPertanyaanLabel(pertanyaan, idx)}
                      {pertanyaan.isTemp && <span className="ml-2 text-xs text-gray-500">(menyimpan...)</span>}
                      {pertanyaan.isUpdating && <span className="ml-2 text-xs text-gray-500">(mengupdate...)</span>}
                    </button>
                  ))}
                </div>,
                document.body,
              )}
          </div>

          {(safeActiveIndex >= 0 || safeActiveIndex === -1) && (
            <>
              {!isLocked && (
                <div className="flex justify-end">
                  <Button size="sm" className="bg-slate-100 text-slate-800 font-semibold hover:bg-slate-200 border border-slate-300" onClick={openFormula} disabled={loading || isSaving}>
                    Atur Skor
                  </Button>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold text-sm text-slate-200">Pertanyaan</label>
                <Input
                  className="text-slate-800 border-slate-300 bg-white"
                  value={draftPertanyaan.pertanyaan || ''}
                  onChange={(e) => handleChangePertanyaanField('pertanyaan', e.target.value)}
                  disabled={isInputDisabled}
                  placeholder="Masukan pertanyaan"
                />
              </div>

              <div className="w-full flex gap-2 text-slate-800">
                <div className="w-[10%]">
                  <label className="font-semibold text-sm text-slate-200">Nomor</label>
                  <Input className="h-8 bg-white text-sm border-slate-300" value={draftPertanyaan.nomor ?? ''} onChange={(e) => handleChangePertanyaanField('nomor', e.target.value)} disabled={isInputDisabled} placeholder="1.1." />
                </div>

                <div className="w-[12%]">
                  <label className="font-semibold text-sm text-slate-200">Skor Q1</label>
                  <Input
                    className="h-8 bg-white text-sm border-slate-300"
                    value={draftPertanyaan.skor?.Q1 ?? ''}
                    onChange={(e) => handleChangeSkor('Q1', e.target.value)}
                    type="number"
                    min="1"
                    max="5"
                    step="0.01"
                    disabled={isInputDisabled}
                    placeholder="1-5"
                  />
                </div>

                <div className="w-[12%]">
                  <label className="font-semibold text-sm text-slate-200">Skor Q2</label>
                  <Input
                    className="h-8 bg-white text-sm border-slate-300"
                    value={draftPertanyaan.skor?.Q2 ?? ''}
                    onChange={(e) => handleChangeSkor('Q2', e.target.value)}
                    type="number"
                    min="1"
                    max="5"
                    step="0.01"
                    disabled={isInputDisabled}
                    placeholder="1-5"
                  />
                </div>

                <div className="w-[12%]">
                  <label className="font-semibold text-sm text-slate-200">Skor Q3</label>
                  <Input
                    className="h-8 bg-white text-sm border-slate-300"
                    value={draftPertanyaan.skor?.Q3 ?? ''}
                    onChange={(e) => handleChangeSkor('Q3', e.target.value)}
                    type="number"
                    min="1"
                    max="5"
                    step="0.01"
                    disabled={isInputDisabled}
                    placeholder="1-5"
                  />
                </div>

                <div className="w-[12%]">
                  <label className="font-semibold text-sm text-slate-200">Skor Q4</label>
                  <Input
                    className="h-8 bg-white text-sm border-slate-300"
                    value={draftPertanyaan.skor?.Q4 ?? ''}
                    onChange={(e) => handleChangeSkor('Q4', e.target.value)}
                    type="number"
                    min="1"
                    max="5"
                    step="0.01"
                    disabled={isInputDisabled}
                    placeholder="1-5"
                  />
                </div>

                <div className="w-[42%]">
                  <label className="font-semibold text-sm text-slate-200">Evidence</label>
                  <Input
                    className="h-8 bg-white text-sm border-slate-300"
                    value={draftPertanyaan.evidence ?? ''}
                    onChange={(e) => handleChangePertanyaanField('evidence', e.target.value)}
                    disabled={isInputDisabled}
                    placeholder="Bukti pendukung"
                  />
                </div>
              </div>

              <div className="mt-3">
                <div className="text-sm font-semibold py-2 text-slate-200">Indicator Level</div>

                <div className="grid grid-cols-5 gap-2">
                  {[
                    ['Strong', 'strong', '#2ECC71'],
                    ['Satisfactory', 'satisfactory', '#A3E635'],
                    ['Fair', 'fair', '#FACC15'],
                    ['Marginal', 'marginal', '#F97316'],
                    ['Unsatisfactory', 'unsatisfactory', '#EF4444'],
                  ].map(([label, key, color]) => (
                    <IndicatorItem
                      key={key}
                      label={label}
                      color={color}
                      value={draftPertanyaan.indicator?.[key] ?? ''}
                      onChange={(v) => handleChangeIndicator(key, v)}
                      loading={loading || isSaving}
                      editMode={editModePertanyaan || safeActiveIndex === -1}
                      isLocked={isLocked}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-2 text-slate-800">
                <label className="text-slate-200 font-semibold text-sm">Catatan</label>
                <Textarea
                  className="min-h-[40px] text-sm bg-white border-slate-300"
                  value={draftPertanyaan.catatan ?? ''}
                  onChange={(e) => handleChangePertanyaanField('catatan', e.target.value)}
                  disabled={isInputDisabled}
                  placeholder="masukan catatan"
                />
              </div>
            </>
          )}
        </div>
      )}

      {!showForm && hasPertanyaan && <div className="w-full" />}
    </div>
  );
}

// Komponen untuk input indicator level
function IndicatorItem({ label, value, onChange, color, loading = false, editMode = false, isLocked = false }) {
  return (
    <div className="rounded-lg px-3 py-3 flex flex-col gap-2 border border-slate-300 shadow-sm" style={{ backgroundColor: color }}>
      <div className="text-sm font-bold uppercase text-black text-center">{label}</div>
      <div className="bg-white/90 rounded border border-slate-300">
        <Textarea
          className="min-h-[60px] text-xs bg-transparent text-slate-800 resize-none text-center p-2"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading || !editMode || isLocked}
          placeholder="masukan deskripsi"
        />
      </div>
    </div>
  );
}

// TableInherent
function TableInherent({ rows = [], activeQuarter }) {
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const paginationRef = useRef(null);

  const minZoom = 75;
  const maxZoom = 120;
  const stepZoom = 5;
  const pageSize = 7;

  // PERBAIKAN: Validasi rows
  const safeRows = useMemo(() => {
    return Array.isArray(rows) ? rows : [];
  }, [rows]);

  const compareAspekNumbers = (a, b) => {
    if (!a || !b) return 0;

    const parseNumber = (str) => {
      if (!str) return [0, 0];
      const cleanStr = str.replace(/\.$/, '');
      const parts = cleanStr.split('.').map(Number);
      return [parts[0] || 0, parts[1] || 0];
    };

    const [aMain, aSub] = parseNumber(a.nomor);
    const [bMain, bSub] = parseNumber(b.nomor);

    if (aMain !== bMain) {
      return aMain - bMain;
    }
    return aSub - bSub;
  };

  // Sort rows berdasarkan nomor aspek
  const sortedRows = useMemo(() => {
    if (safeRows.length === 0) return [];

    const rowsCopy = [...safeRows];
    return rowsCopy.sort((a, b) => {
      if (!a?.nomor && !b?.nomor) return 0;
      if (!a?.nomor) return 1;
      if (!b?.nomor) return -1;
      return compareAspekNumbers(a, b);
    });
  }, [safeRows]);

  const getSummaryBgByValue = (total) => {
    if (!Number.isFinite(total)) return '';

    if (total <= 1) return 'bg-green-400 text-black';
    if (total <= 2) return 'bg-lime-300 text-black';
    if (total <= 3) return 'bg-yellow-400 text-black';
    if (total <= 4) return 'bg-orange-400 text-black';
    return 'bg-red-500 text-white';
  };

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));

  const scrollLeft = () => {
    paginationRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    paginationRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  };

  const pagedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedRows.slice(start, end);
  }, [sortedRows, currentPage]);

  const globalSummary = useMemo(() => {
    const totalWeighted = sortedRows.reduce((sumAspek, aspek) => {
      const pertanyaanList = Array.isArray(aspek.pertanyaanList) ? aspek.pertanyaanList : [];
      const derived = pertanyaanList.map((pq) => computeDerived(pq, aspek));
      return sumAspek + derived.reduce((s, d) => (Number.isFinite(d?.weighted) ? s + d.weighted : s), 0);
    }, 0);

    return {
      totalWeighted,
      summaryBg: getSummaryBgByValue(totalWeighted),
    };
  }, [sortedRows]);

  const handleZoomIn = () => setZoom((z) => Math.min(maxZoom, z + stepZoom));
  const handleZoomOut = () => setZoom((z) => Math.max(minZoom, z - stepZoom));
  const handleSliderChange = (e) => setZoom(Number(e.target.value));
  const handlePageClick = (page) => setCurrentPage(page);

  const rankBgMap = {
    1: 'bg-green-400 text-black',
    2: 'bg-lime-300 text-black',
    3: 'bg-yellow-400 text-black',
    4: 'bg-orange-400 text-black',
    5: 'bg-red-500 text-white',
  };

  const formatPercent = (val) => {
    if (val === null || val === undefined || val === '') return '-';
    const n = Number(val);
    if (Number.isNaN(n)) return String(val);

    const percent = Math.abs(n) <= 1 ? n * 100 : n;

    const rounded = Math.abs(percent - Math.round(percent)) < 1e-9 ? Math.round(percent) : percent.toFixed(2);

    return `${rounded}%`;
  };

  if (sortedRows.length === 0) {
    return (
      <div className="flex items-center justify-center border rounded-xl p-8 text-gray-500 bg-gray-50">
        <div className="text-center">
          <FileWarning className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Tidak Ada Data</h3>
          <p className="text-sm">Silakan tambah aspek untuk Quarter {activeQuarter}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2 pr-2">
        <div>
          <h1 className="text-2xl font-semibold">Data Reputasi - Inherent</h1>
          <div className="text-sm text-gray-600">
            Quarter Aktif: <span className="font-bold bg-blue-100 px-2 py-1 rounded"> Q{String(activeQuarter)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={handleZoomOut} className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-900 text-white text-xl font-bold shadow">
            −
          </button>
          <div className="flex flex-col items-center">
            <span className="text-xs font-medium mb-1">{zoom}%</span>
            <input type="range" min={minZoom} max={maxZoom} step={stepZoom} value={zoom} onChange={handleSliderChange} className="w-40 accent-slate-700" />
          </div>
          <button type="button" onClick={handleZoomIn} className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-900 text-white text-xl font-bold shadow">
            +
          </button>
        </div>
      </div>

      <div className="w-full overflow-auto border shadow">
        <div style={{ zoom: `${zoom}%` }}>
          <table className="min-w-max text-sm table-fixed">
            <thead>
              <tr>
                <th className="border border-black px-2 py-2 bg-blue-900 text-white w-10">No</th>
                <th className="border border-black px-2 py-2 bg-blue-900 text-white w-16">Bobot</th>
                <th className="border border-black px-2 py-2 bg-blue-900 text-white w-42">Aspek</th>

                <th className="border border-black px-2 py-2 bg-blue-900 text-white w-10">No</th>
                <th className="border border-black px-2 py-2 bg-blue-900 text-white w-64">Pertanyaan</th>

                <th className="border border-black py-2 bg-[#2ECC71] text-white w-32">Strong</th>
                <th className="border border-black py-2 bg-[#A3E635] text-black w-32">Satisfactory</th>
                <th className="border border-black py-2 bg-[#FACC15] text-black w-32">Fair</th>
                <th className="border border-black px-2 py-2 bg-[#F97316] text-black w-32">Marginal</th>
                <th className="border border-black px-2 py-2 bg-[#FF0000] text-white w-32">Unsatisfactory</th>

                <th className="border border-black px-2 py-2 bg-blue-950 text-white w-32">Hasil</th>
                <th className="border border-black px-2 py-2 bg-blue-950 text-white w-32">Peringkat</th>
                <th className="border border-black px-2 py-2 bg-blue-950 text-white w-32">Weighted</th>
                <th className="border border-black px-2 py-2 bg-blue-900 text-white w-64">Catatan</th>
                <th className="border border-black px-2 py-2 bg-blue-900 text-white w-64">Evidence</th>
              </tr>
            </thead>

            <tbody>
              {pagedRows.map((aspek, pi) => {
                const pertanyaanList = Array.isArray(aspek.pertanyaanList) ? aspek.pertanyaanList : [];

                if (pertanyaanList.length === 0) {
                  return (
                    <tr key={`empty-${pi}`}>
                      <td className="border px-2 py-2 align-top bg-[#E8F5FA]">{aspek.nomor || '-'}</td>
                      <td className="border px-2 py-2 align-top bg-[#E8F5FA]">{formatPercent(aspek.bobot)}</td>
                      <td className="border px-2 py-2 align-top bg-[#E8F5FA] break-words max-w-[200px]">{aspek.judul || '-'}</td>
                      <td colSpan={12} className="border px-2 py-2 text-center text-gray-400 bg-white">
                        Belum ada pertanyaan
                      </td>
                    </tr>
                  );
                }

                const sortedPertanyaanList = [...pertanyaanList].sort((a, b) => {
                  if (!a.nomor && !b.nomor) return 0;
                  if (!a.nomor) return 1;
                  if (!b.nomor) return -1;

                  const parsePertanyaanNumber = (str) => {
                    const cleanStr = str.replace(/\.$/, '');
                    const parts = cleanStr.split('.').map(Number);
                    return [parts[0] || 0, parts[1] || 0];
                  };

                  const [aMain, aSub] = parsePertanyaanNumber(a.nomor);
                  const [bMain, bSub] = parsePertanyaanNumber(b.nomor);

                  if (aMain !== bMain) return aMain - bMain;
                  return aSub - bSub;
                });

                const derivedByIndex = sortedPertanyaanList.map((pq) => computeDerived(pq, aspek));

                return sortedPertanyaanList.map((pertanyaan, pi) => {
                  const derived = derivedByIndex[pi] || {};
                  const { hasilDisplay, peringkat, weightedDisplay } = derived;

                  return (
                    <tr key={`${aspek.id}-${pertanyaan.id}`}>
                      {pi === 0 && (
                        <>
                          <td rowSpan={sortedPertanyaanList.length} className="border px-2 py-2 align-middle bg-[#E8F5FA] text-center">
                            {aspek.nomor || '-'}
                          </td>
                          <td rowSpan={sortedPertanyaanList.length} className="border px-2 py-2 align-middle bg-[#E8F5FA] text-center">
                            {formatPercent(aspek.bobot)}
                          </td>
                          <td rowSpan={sortedPertanyaanList.length} className="border px-2 py-2 align-middle bg-[#E8F5FA] break-words max-w-[200px]">
                            {aspek.judul || '-'}
                          </td>
                        </>
                      )}

                      <td className="border px-2 py-2 text-center bg-[#E8F5FA]">{pertanyaan.nomor || '-'}</td>
                      <td className="border px-2 py-2 bg-[#E8F5FA] break-words max-w-[180px]">{pertanyaan.pertanyaan || '-'}</td>

                      <td className="border px-2 py-2 text-center bg-white break-words max-w-[130px]">{pertanyaan.indicator?.strong || '-'}</td>
                      <td className="border px-2 py-2 text-center bg-white break-words max-w-[130px]">{pertanyaan.indicator?.satisfactory || '-'}</td>
                      <td className="border px-2 py-2 text-center bg-white break-words max-w-[130px]">{pertanyaan.indicator?.fair || '-'}</td>
                      <td className="border px-2 py-2 text-center bg-white break-words max-w-[130px]">{pertanyaan.indicator?.marginal || '-'}</td>
                      <td className="border px-2 py-2 text-center bg-white break-words max-w-[130px]">{pertanyaan.indicator?.unsatisfactory || '-'}</td>

                      <td className="border px-2 py-2 text-center bg-white break-words max-w-[130px]">{hasilDisplay || '-'}</td>
                      <td className={`border px-2 py-2 text-center font-semibold ${peringkat ? rankBgMap[peringkat] : ''}`}>{Number.isFinite(peringkat) ? peringkat : '-'}</td>
                      <td className="border px-2 py-2 text-center bg-white">{weightedDisplay || ''}</td>
                      <td className="border px-2 py-2 text-center bg-white break-words max-w-[200px]">{pertanyaan.catatan ?? ''}</td>
                      <td className="border px-2 py-2 text-center bg-white break-words max-w-[200px]">{pertanyaan.evidence ?? ''}</td>
                    </tr>
                  );
                });
              })}

              <tr>
                <td colSpan={11} className="border-0 bg-white"></td>
                <td colSpan={2} className="border border-black px-2 py-2 text-center font-semibold text-white bg-blue-900">
                  Summary
                </td>
                <td className={`border px-2 py-2 text-center font-semibold ${globalSummary.summaryBg}`}>{Number.isFinite(globalSummary.totalWeighted) ? globalSummary.totalWeighted.toFixed(2) : '-'}</td>
                <td colSpan={2} className="border-0 bg-white"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-3 flex justify-center items-center gap-2">
        {totalPages > 7 && (
          <button type="button" onClick={scrollLeft} className="h-8 w-8 flex items-center justify-center rounded-md border bg-white text-blue-600 font-bold hover:bg-blue-500 hover:text-white">
            <ArrowBigLeftDash />
          </button>
        )}

        <div
          className="max-w-[420px] overflow-x-hidden"
          onWheel={(e) => {
            e.preventDefault();

            const container = paginationRef.current;
            if (container) {
              container.scrollLeft += e.deltaY * 2;
            }
          }}
          style={{ cursor: 'grab' }}
          onMouseEnter={() => {
            document.body.style.overflowY = 'hidden';
          }}
          onMouseLeave={() => {
            document.body.style.overflowY = 'auto';
          }}
        >
          <div ref={paginationRef} className="flex gap-2 px-2 py-1 overflow-x-auto scroll-smooth">
            {Array.from({ length: totalPages }, (_, i) => {
              const page = i + 1;
              const isActive = page === currentPage;

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => handlePageClick(page)}
                  className={
                    'min-w-8 h-8 px-3 flex items-center justify-center rounded-md border text-sm font-semibold transition-colors duration-150 shrink-0 hover:bg-blue-600 hover:text-white ' +
                    (isActive ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-300 text-blue-600')
                  }
                >
                  {page}
                </button>
              );
            })}
          </div>
        </div>

        {totalPages > 7 && (
          <button type="button" onClick={scrollRight} className="h-8 w-8 flex items-center justify-center rounded-md border bg-white text-blue-600 font-bold hover:bg-blue-500 hover:text-white">
            <ArrowBigRightDash />
          </button>
        )}
      </div>
    </div>
  );
}


