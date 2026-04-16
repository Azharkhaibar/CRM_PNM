import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '../../components/use-toast';
import kpmrPasarApiService, {
  FrontendKpmrResponse,
  FrontendAspekResponse,
  FrontendPertanyaanResponse,
  CreateKpmrAspekPasarDto,
  CreateKpmrPertanyaanPasarDto,
  UpdateKpmrAspekPasarDto,
  UpdateKpmrPertanyaanPasarDto,
  UpdateSkorDto,
  CreateKpmrPasarOjkDto, // ✅ TAMBAHKAN IMPORT INI
} from '../../service/kpmr/pasar-produk-kpmr.service';

interface UseKpmrPasarReturn {
  // State
  kpmr: FrontendKpmrResponse | null;
  rows: FrontendAspekResponse[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  currentKpmrId: number | string | null;

  // Data operations
  loadKpmrByYearQuarter: (year: number, quarter: number) => Promise<void>;
  refreshKpmrData: () => Promise<FrontendAspekResponse[]>;
  createKpmr: (year: number, quarter: number) => Promise<FrontendKpmrResponse | null>; // ✅ TAMBAHKAN

  // Aspek operations
  addAspek: (kpmrId: number | string, aspekData: CreateKpmrAspekPasarDto) => Promise<FrontendAspekResponse>;
  updateAspek: (id: number | string, aspekData: UpdateKpmrAspekPasarDto) => Promise<FrontendAspekResponse>;
  deleteAspek: (id: number | string) => Promise<void>;

  // Pertanyaan operations
  addPertanyaan: (aspekId: number | string, pertanyaanData: CreateKpmrPertanyaanPasarDto) => Promise<FrontendPertanyaanResponse>;
  updatePertanyaan: (id: number | string, pertanyaanData: UpdateKpmrPertanyaanPasarDto) => Promise<FrontendPertanyaanResponse>;
  deletePertanyaan: (id: number | string) => Promise<void>;
  updateSkor: (id: number | string, quarter: string, skor: number) => Promise<FrontendPertanyaanResponse>;

  // Utility
  cleanId: (id: string | number) => number;

  // Status
  hasData: boolean;
  isReady: boolean;
  hasError: boolean;
}

export function useKpmrPasar(): UseKpmrPasarReturn {
  const { toast } = useToast();

  const [kpmr, setKpmr] = useState<FrontendKpmrResponse | null>(null);
  const [rows, setRows] = useState<FrontendAspekResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentKpmrId, setCurrentKpmrId] = useState<number | string | null>(null);

  const loadingRef = useRef(false);
  const mountedRef = useRef(true);
  const lastLoadedYearRef = useRef<{ year: number; quarter: number } | null>(null); // ✅ TAMBAHKAN

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      loadingRef.current = false;
    };
  }, []);

  const safeSet = <T>(setter: (v: T) => void, value: T) => {
    if (mountedRef.current) setter(value);
  };

  const cleanId = useCallback((id: string | number): number => {
    return kpmrPasarApiService.cleanId(id);
  }, []);

  // ========== LOAD KPMR - PERBAIKAN ==========
  const loadKpmrByYearQuarter = useCallback(
    async (targetYear: number, targetQuarter: number) => {
      // ✅ CEK: Jika sudah pernah load dengan parameter yang sama, return
      if (lastLoadedYearRef.current?.year === targetYear && lastLoadedYearRef.current?.quarter === targetQuarter && kpmr !== null) {
        console.log(`✅ [Hook] Data untuk ${targetYear} Q${targetQuarter} sudah dimuat`);
        return kpmr;
      }

      if (loadingRef.current) {
        console.log('⏳ [Hook] Loading already in progress...');
        return;
      }

      loadingRef.current = true;
      safeSet(setLoading, true);
      safeSet(setError, null);

      try {
        const data = await kpmrPasarApiService.getKpmrByYearQuarter(targetYear, targetQuarter, true);

        if (!mountedRef.current) return;

        safeSet(setKpmr, data);
        safeSet(setCurrentKpmrId, data.id);
        const frontendRows = kpmrPasarApiService.convertToFrontendFormat(data);
        safeSet(setRows, frontendRows);

        // ✅ Simpan parameter yang sudah dimuat
        lastLoadedYearRef.current = { year: targetYear, quarter: targetQuarter };

        return data;
      } catch (err: any) {
        if (!mountedRef.current) return;

        // Jika 404, bukan error
        if (err?.response?.status === 404) {
          console.log(`ℹ️ KPMR not found for ${targetYear} Q${targetQuarter}`);
          safeSet(setKpmr, null);
          safeSet(setCurrentKpmrId, null);
          safeSet(setRows, []);
          lastLoadedYearRef.current = { year: targetYear, quarter: targetQuarter }; // ✅ Tetap simpan
        } else {
          const errorMsg = err.message || 'Gagal memuat KPMR';
          safeSet(setError, errorMsg);
          toast({ title: 'Error', description: errorMsg, variant: 'destructive' });
        }
      } finally {
        loadingRef.current = false;
        safeSet(setLoading, false);
      }
    },
    [toast, kpmr], // ✅ TAMBAHKAN kpmr
  );

  // ========== CREATE KPMR ==========
  const createKpmr = useCallback(
    async (year: number, quarter: number): Promise<FrontendKpmrResponse | null> => {
      if (loadingRef.current) {
        console.log('⏳ [Hook] Create already in progress...');
        return null;
      }

      loadingRef.current = true;
      safeSet(setSaving, true);
      safeSet(setError, null);

      try {
        console.log(`🆕 [Hook] Creating KPMR for year ${year} Q${quarter}`);

        const quarterMap: Record<number, string> = {
          1: 'Q1',
          2: 'Q2',
          3: 'Q3',
          4: 'Q4',
        };

        const payload: CreateKpmrLikuiditasOjkDto = {
          year,
          quarter: quarterMap[quarter] || `Q${quarter}`,
          isActive: true,
          version: '1.0',
          aspekList: [],
        };

        console.log('📦 [Hook] Sending payload:', payload);

        const data = await kpmrLikuiditasApiService.createKpmr(payload);

        if (!mountedRef.current) return null;

        // ✅ CEK APAKAH DATA VALID
        if (!data || !data.id) {
          throw new Error('Data KPMR tidak valid setelah dibuat');
        }

        safeSet(setKpmr, data);
        safeSet(setCurrentKpmrId, data.id);
        const frontendRows = kpmrLikuiditasApiService.convertToFrontendFormat(data);
        safeSet(setRows, frontendRows);

        lastLoadedYearRef.current = { year, quarter };

        toast({
          title: 'Berhasil',
          description: `KPMR untuk tahun ${year} Q${quarter} berhasil dibuat`,
        });

        return data;
      } catch (err: any) {
        if (!mountedRef.current) return null;

        console.error('❌ [Hook] Create KPMR error:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });

        const errorMsg = err.response?.data?.message || err.message || 'Gagal membuat KPMR';
        safeSet(setError, errorMsg);
        toast({
          title: 'Error',
          description: errorMsg,
          variant: 'destructive',
        });
        return null;
      } finally {
        loadingRef.current = false;
        safeSet(setSaving, false);
      }
    },
    [toast],
  );

  // ========== REFRESH KPMR - PERBAIKAN ==========
  const refreshKpmrData = useCallback(async (): Promise<FrontendAspekResponse[]> => {
    if (!kpmr?.id) return [];

    if (loadingRef.current) {
      console.log('⏳ [Hook] Refresh already in progress...');
      return rows;
    }

    loadingRef.current = true;
    safeSet(setLoading, true);

    try {
      const cleanIdNum = cleanId(kpmr.id);
      const freshData = await kpmrPasarApiService.getKpmrWithRelations(cleanIdNum);

      if (!mountedRef.current) return [];

      safeSet(setKpmr, freshData);
      const frontendRows = kpmrPasarApiService.convertToFrontendFormat(freshData);
      safeSet(setRows, frontendRows);

      return frontendRows;
    } catch (error: any) {
      if (mountedRef.current) {
        toast({
          title: 'Error',
          description: error.message || 'Gagal memperbarui data',
          variant: 'destructive',
        });
      }
      return rows;
    } finally {
      loadingRef.current = false;
      safeSet(setLoading, false);
    }
  }, [kpmr?.id, cleanId, toast, rows]);

  // ========== ASPEK OPERATIONS ==========
  const addAspek = useCallback(
    async (kpmrId: number | string, aspekData: CreateKpmrAspekPasarDto): Promise<FrontendAspekResponse> => {
      if (loadingRef.current) throw new Error('Already saving');

      loadingRef.current = true;
      safeSet(setSaving, true);
      safeSet(setError, null);

      try {
        if (!kpmrId) throw new Error('ID KPMR tidak boleh kosong');

        const cleanKpmrId = cleanId(kpmrId);
        if (isNaN(cleanKpmrId) || cleanKpmrId <= 0) {
          throw new Error(`ID KPMR tidak valid: ${kpmrId}`);
        }

        if (!aspekData.judul?.trim()) throw new Error('Judul aspek tidak boleh kosong');

        const bobotNum = Number(aspekData.bobot);
        if (isNaN(bobotNum) || bobotNum < 0 || bobotNum > 100) {
          throw new Error('Bobot harus antara 0 dan 100');
        }

        const payload: CreateKpmrAspekPasarDto = {
          nomor: aspekData.nomor || '-',
          judul: aspekData.judul.trim(),
          bobot: bobotNum,
          deskripsi: aspekData.deskripsi || '',
          orderIndex: aspekData.orderIndex || 0,
          pertanyaanList: aspekData.pertanyaanList || [],
        };

        const newAspek = await kpmrPasarApiService.createAspek(cleanKpmrId, payload);

        if (!mountedRef.current) return newAspek;

        toast({ title: 'Berhasil', description: 'Aspek berhasil ditambahkan', variant: 'default' });
        return newAspek;
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || err.message || 'Gagal menambahkan aspek';
        safeSet(setError, errorMsg);
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' });
        throw err;
      } finally {
        loadingRef.current = false;
        safeSet(setSaving, false);
      }
    },
    [toast, cleanId],
  );

  const updateAspek = useCallback(
    async (id: number | string, aspekData: UpdateKpmrAspekPasarDto): Promise<FrontendAspekResponse> => {
      if (loadingRef.current) throw new Error('Already saving');

      loadingRef.current = true;
      safeSet(setSaving, true);
      safeSet(setError, null);

      try {
        const cleanIdNum = cleanId(id);

        if (aspekData.judul !== undefined && !aspekData.judul.trim()) {
          throw new Error('Judul aspek tidak boleh kosong');
        }

        if (aspekData.bobot !== undefined) {
          const bobotNum = Number(aspekData.bobot);
          if (isNaN(bobotNum) || bobotNum < 0 || bobotNum > 100) {
            throw new Error('Bobot harus antara 0 dan 100');
          }
          aspekData.bobot = bobotNum;
        }

        const updatedAspek = await kpmrPasarApiService.updateAspek(cleanIdNum, aspekData);

        if (!mountedRef.current) return updatedAspek;

        toast({ title: 'Berhasil', description: 'Aspek berhasil diperbarui', variant: 'default' });
        return updatedAspek;
      } catch (err: any) {
        const errorMsg = err.message || 'Gagal mengupdate aspek';
        safeSet(setError, errorMsg);
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' });
        throw err;
      } finally {
        loadingRef.current = false;
        safeSet(setSaving, false);
      }
    },
    [toast, cleanId],
  );

  const deleteAspek = useCallback(
    async (id: number | string): Promise<void> => {
      if (!window.confirm('Hapus aspek ini?')) return;
      if (loadingRef.current) throw new Error('Already saving');

      loadingRef.current = true;
      safeSet(setSaving, true);
      safeSet(setError, null);

      try {
        const cleanIdNum = cleanId(id);
        await kpmrPasarApiService.deleteAspek(cleanIdNum);

        if (!mountedRef.current) return;

        toast({ title: 'Berhasil', description: 'Aspek berhasil dihapus', variant: 'default' });
      } catch (err: any) {
        const errorMsg = err.message || 'Gagal menghapus aspek';
        safeSet(setError, errorMsg);
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' });
        throw err;
      } finally {
        loadingRef.current = false;
        safeSet(setSaving, false);
      }
    },
    [toast, cleanId],
  );

  // ========== PERTANYAAN OPERATIONS ==========
  const addPertanyaan = useCallback(
    async (aspekId: number | string, pertanyaanData: CreateKpmrPertanyaanPasarDto): Promise<FrontendPertanyaanResponse> => {
      if (loadingRef.current) throw new Error('Already saving');

      loadingRef.current = true;
      safeSet(setSaving, true);
      safeSet(setError, null);

      try {
        const cleanAspekId = cleanId(aspekId);

        if (!pertanyaanData.pertanyaan?.trim()) {
          throw new Error('Pertanyaan tidak boleh kosong');
        }

        const payload: CreateKpmrPertanyaanPasarDto = {
          nomor: pertanyaanData.nomor || '',
          pertanyaan: pertanyaanData.pertanyaan.trim(),
          skor: pertanyaanData.skor || {},
          indicator: {
            strong: pertanyaanData.indicator?.strong || '',
            satisfactory: pertanyaanData.indicator?.satisfactory || '',
            fair: pertanyaanData.indicator?.fair || '',
            marginal: pertanyaanData.indicator?.marginal || '',
            unsatisfactory: pertanyaanData.indicator?.unsatisfactory || '',
          },
          evidence: pertanyaanData.evidence || '',
          catatan: pertanyaanData.catatan || '',
          orderIndex: pertanyaanData.orderIndex || 0,
        };

        const newPertanyaan = await kpmrPasarApiService.createPertanyaan(cleanAspekId, payload);

        if (!mountedRef.current) return newPertanyaan;

        toast({ title: 'Berhasil', description: 'Pertanyaan berhasil ditambahkan', variant: 'default' });
        return newPertanyaan;
      } catch (err: any) {
        const errorMsg = err.message || 'Gagal menambahkan pertanyaan';
        safeSet(setError, errorMsg);
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' });
        throw err;
      } finally {
        loadingRef.current = false;
        safeSet(setSaving, false);
      }
    },
    [toast, cleanId],
  );

  const updatePertanyaan = useCallback(
    async (id: number | string, pertanyaanData: UpdateKpmrPertanyaanPasarDto): Promise<FrontendPertanyaanResponse> => {
      if (loadingRef.current) throw new Error('Already saving');

      loadingRef.current = true;
      safeSet(setSaving, true);
      safeSet(setError, null);

      try {
        const cleanIdNum = cleanId(id);

        if (pertanyaanData.pertanyaan !== undefined && !pertanyaanData.pertanyaan.trim()) {
          throw new Error('Pertanyaan tidak boleh kosong');
        }

        const updatedPertanyaan = await kpmrPasarApiService.updatePertanyaan(cleanIdNum, pertanyaanData);

        if (!mountedRef.current) return updatedPertanyaan;

        toast({ title: 'Berhasil', description: 'Pertanyaan berhasil diperbarui', variant: 'default' });
        return updatedPertanyaan;
      } catch (err: any) {
        const errorMsg = err.message || 'Gagal mengupdate pertanyaan';
        safeSet(setError, errorMsg);
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' });
        throw err;
      } finally {
        loadingRef.current = false;
        safeSet(setSaving, false);
      }
    },
    [toast, cleanId],
  );

  const deletePertanyaan = useCallback(
    async (id: number | string): Promise<void> => {
      if (!window.confirm('Hapus pertanyaan ini?')) return;
      if (loadingRef.current) throw new Error('Already saving');

      loadingRef.current = true;
      safeSet(setSaving, true);
      safeSet(setError, null);

      try {
        const cleanIdNum = cleanId(id);
        await kpmrPasarApiService.deletePertanyaan(cleanIdNum);

        if (!mountedRef.current) return;

        toast({ title: 'Berhasil', description: 'Pertanyaan berhasil dihapus', variant: 'default' });
      } catch (err: any) {
        const errorMsg = err.message || 'Gagal menghapus pertanyaan';
        safeSet(setError, errorMsg);
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' });
        throw err;
      } finally {
        loadingRef.current = false;
        safeSet(setSaving, false);
      }
    },
    [toast, cleanId],
  );

  const updateSkor = useCallback(
    async (id: number | string, quarter: string, skor: number): Promise<FrontendPertanyaanResponse> => {
      if (loadingRef.current) throw new Error('Already saving');

      loadingRef.current = true;
      safeSet(setSaving, true);
      safeSet(setError, null);

      try {
        const cleanIdNum = cleanId(id);
        const updateSkorDto: UpdateSkorDto = {
          quarter: quarter as 'Q1' | 'Q2' | 'Q3' | 'Q4',
          skor: skor,
        };
        const updatedPertanyaan = await kpmrPasarApiService.updateSkor(cleanIdNum, updateSkorDto);

        if (!mountedRef.current) return updatedPertanyaan;

        toast({ title: 'Berhasil', description: 'Skor berhasil diperbarui', variant: 'default' });
        return updatedPertanyaan;
      } catch (err: any) {
        const errorMsg = err.message || 'Gagal mengupdate skor';
        safeSet(setError, errorMsg);
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' });
        throw err;
      } finally {
        loadingRef.current = false;
        safeSet(setSaving, false);
      }
    },
    [toast, cleanId],
  );

  return {
    // State
    kpmr,
    rows,
    loading,
    saving,
    error,
    currentKpmrId,

    // Data operations
    loadKpmrByYearQuarter,
    refreshKpmrData,
    createKpmr, // ✅ TAMBAHKAN INI!

    // Aspek operations
    addAspek,
    updateAspek,
    deleteAspek,

    // Pertanyaan operations
    addPertanyaan,
    updatePertanyaan,
    deletePertanyaan,
    updateSkor,

    // Utility
    cleanId,

    // Status
    hasData: rows.length > 0 && kpmr !== null,
    isReady: !loading && !saving && kpmr !== null,
    hasError: error !== null,
  };
}

export default useKpmrPasar;
