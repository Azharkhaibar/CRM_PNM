// hook/inherent/kredit-produk.hook.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import kreditProdukService, { CreateKreditNilaiDto, CreateKreditParameterDto, KreditProdukOjkEntity, UpdateKreditNilaiDto, UpdateKreditParameterDto } from '../../service/inherent/kredit-produk.service';

export const useKreditProdukIntegration = (initialYear?: number, initialQuarter?: number) => {
  // State untuk data yang sedang aktif
  const [rows, setRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentKreditId, setCurrentKreditId] = useState<number | null>(null);
  const [currentKreditData, setCurrentKreditData] = useState<KreditProdukOjkEntity | null>(null);
  const [year, setYear] = useState<number | null>(initialYear ?? null);
  const [quarter, setQuarter] = useState<number | null>(initialQuarter ?? null);

  // State untuk track quarter yang sedang aktif
  const [activePeriodKey, setActivePeriodKey] = useState<string>('');

  // Cache untuk menyimpan data per year-quarter
  const cacheRef = useRef<
    Map<
      string,
      {
        rows: any[];
        kreditId: number | null;
        entity: KreditProdukOjkEntity | null;
        timestamp: number;
      }
    >
  >(new Map());

  // State untuk tracking loading per year-quarter
  const loadingQueueRef = useRef<Set<string>>(new Set());
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cacheRef.current.clear();
      loadingQueueRef.current.clear();
    };
  }, []);

  const safeSet = <T>(setter: (v: T) => void, value: T) => {
    if (mountedRef.current) setter(value);
  };

  // ==============================
  // FUNGSI BARU: getOrCreateData
  // ==============================

  /**
   * Fungsi utama untuk mendapatkan atau membuat data
   * Menggunakan findOrCreate dari service
   */
  const getOrCreateData = useCallback(async (targetYear: number, targetQuarter: number, forceReload = false) => {
    console.log(`[KreditHook] getOrCreateData: ${targetYear}-Q${targetQuarter}, force: ${forceReload}`);

    const cacheKey = getCacheKey(targetYear, targetQuarter);

    // Skip jika sudah loading
    if (loadingQueueRef.current.has(cacheKey) && !forceReload) {
      console.log(`[KreditHook] Load already in progress for ${cacheKey}`);
      return null;
    }

    loadingQueueRef.current.add(cacheKey);

    try {
      // Gunakan findOrCreate dari service
      const result = await kreditProdukService.findOrCreate(targetYear, targetQuarter);

      if (!result.success) {
        throw new Error(result.message);
      }

      if (!result.data) {
        throw new Error('Data tidak ditemukan dan gagal dibuat');
      }

      // Format data untuk frontend
      const formattedRows = kreditProdukService.formatToFrontend(result.data);

      // Update cache
      updateCache(targetYear, targetQuarter, {
        rows: formattedRows,
        kreditId: result.data.id,
        entity: result.data,
      });

      return {
        rows: formattedRows,
        kreditId: result.data.id,
        entity: result.data,
        isNew: result.isNew,
      };
    } catch (error: any) {
      console.error(`[KreditHook] Error in getOrCreateData for ${cacheKey}:`, error);
      throw error;
    } finally {
      loadingQueueRef.current.delete(cacheKey);
    }
  }, []);

  /* =======================
     HELPER: Cache management
  ======================= */

  const getCacheKey = useCallback((y: number, q: number) => {
    return `${y}-Q${q}`;
  }, []);

  const getCurrentCacheKey = useCallback(() => {
    if (!year || !quarter) return null;
    return getCacheKey(year, quarter);
  }, [year, quarter, getCacheKey]);

  const updateCache = useCallback(
    (y: number, q: number, data: { rows: any[]; kreditId: number | null; entity: KreditProdukOjkEntity | null }) => {
      const key = getCacheKey(y, q);
      const cacheEntry = {
        rows: data.rows,
        kreditId: data.kreditId,
        entity: data.entity,
        timestamp: Date.now(),
      };
      cacheRef.current.set(key, cacheEntry);
      console.log(`[KreditHook] Cache updated for ${key}:`, {
        rowsCount: data.rows.length,
        kreditId: data.kreditId,
        hasEntity: !!data.entity,
      });
    },
    [getCacheKey],
  );

  const getFromCache = useCallback(
    (y: number, q: number) => {
      const key = getCacheKey(y, q);
      const cached = cacheRef.current.get(key);
      if (cached) {
        console.log(`[KreditHook] Cache hit for ${key}:`, {
          rowsCount: cached.rows.length,
          age: Date.now() - cached.timestamp,
        });
      } else {
        console.log(`[KreditHook] Cache miss for ${key}`);
      }
      return cached;
    },
    [getCacheKey],
  );

  const clearCache = useCallback(
    (y?: number, q?: number) => {
      if (y !== undefined && q !== undefined) {
        const key = getCacheKey(y, q);
        const deleted = cacheRef.current.delete(key);
        console.log(`[KreditHook] Cache cleared for ${key}: ${deleted ? 'success' : 'not found'}`);
      } else {
        const size = cacheRef.current.size;
        cacheRef.current.clear();
        console.log(`[KreditHook] All cache cleared (${size} entries)`);
      }
    },
    [getCacheKey],
  );

  /* =======================
     VALIDATION HELPERS
  ======================= */

  const validateKategori = useCallback((kategori: any): { isValid: boolean; error?: string } => {
    if (!kategori) {
      return { isValid: false, error: 'Kategori tidak boleh kosong' };
    }

    const { model, prinsip, jenis, underlying } = kategori;

    const validModels = ['konvensional', 'syariah', 'kombinasi', 'lainnya'];
    if (!model || !validModels.includes(model)) {
      return { isValid: false, error: `Model harus salah satu dari: ${validModels.join(', ')}` };
    }

    if (model === 'lainnya') {
      if (prinsip || jenis || (Array.isArray(underlying) && underlying.length > 0)) {
        return { isValid: false, error: 'Untuk model "lainnya", prinsip, jenis, dan aset dasar harus kosong' };
      }
      return { isValid: true };
    }

    const validPrinsip = ['syariah', 'konvensional'];
    if (!prinsip || !validPrinsip.includes(prinsip)) {
      return { isValid: false, error: `Prinsip harus salah satu dari: ${validPrinsip.join(', ')}` };
    }

    if (model === 'konvensional') {
      const validJenis = ['kpr', 'kpa', 'multiguna', 'modal_kerja', 'investasi', 'kkb', 'lainnya'];
      if (!jenis || !validJenis.includes(jenis)) {
        return { isValid: false, error: `Jenis kredit harus salah satu dari: ${validJenis.join(', ')}` };
      }
      if (prinsip !== 'konvensional') {
        return { isValid: false, error: 'Untuk model "konvensional", prinsip harus "konvensional"' };
      }
      if (Array.isArray(underlying) && underlying.length > 0) {
        return { isValid: false, error: 'Untuk model "konvensional", aset dasar harus kosong' };
      }
    }

    if (model === 'syariah') {
      const validJenis = ['kpr', 'kpa', 'multiguna', 'modal_kerja', 'investasi', 'kkb', 'lainnya'];
      if (!jenis || !validJenis.includes(jenis)) {
        return { isValid: false, error: `Jenis kredit harus salah satu dari: ${validJenis.join(', ')}` };
      }
      if (prinsip !== 'syariah') {
        return { isValid: false, error: 'Untuk model "syariah", prinsip harus "syariah"' };
      }
      if (Array.isArray(underlying) && underlying.length > 0) {
        return { isValid: false, error: 'Untuk model "syariah", aset dasar harus kosong' };
      }
    }

    if (model === 'kombinasi') {
      if (!prinsip || !validPrinsip.includes(prinsip)) {
        return { isValid: false, error: `Prinsip harus salah satu dari: ${validPrinsip.join(', ')}` };
      }
      if (jenis) {
        return { isValid: false, error: 'Untuk model "kombinasi", jenis harus kosong' };
      }
      if (Array.isArray(underlying)) {
        const validUnderlying = ['kpr', 'kpa', 'multiguna', 'modal_kerja', 'investasi', 'kkb'];
        const invalidValues = underlying.filter((v: string) => !validUnderlying.includes(v));
        if (invalidValues.length > 0) {
          return { isValid: false, error: `Aset dasar tidak valid: ${invalidValues.join(', ')}` };
        }
      }
    }

    return { isValid: true };
  }, []);

  const validateParameterJudul = useCallback((judul: any): { isValid: boolean; error?: string } => {
    if (!judul || typeof judul !== 'string' || judul.trim() === '') {
      return { isValid: false, error: 'Judul parameter tidak boleh kosong' };
    }
    return { isValid: true };
  }, []);

  const validateBobot = useCallback((bobot: any): { isValid: boolean; error?: string; value: number } => {
    const num = Number(bobot);
    if (isNaN(num)) {
      return { isValid: false, error: 'Bobot harus berupa angka', value: 0 };
    }
    if (num < 0 || num > 100) {
      return { isValid: false, error: 'Bobot harus antara 0 dan 100', value: num };
    }
    return { isValid: true, value: num };
  }, []);

  /* =======================
     FORMATTING HELPERS
  ======================= */

  const formatParameterJudul = useCallback(
    (judul: any): string => {
      const validation = validateParameterJudul(judul);
      if (!validation.isValid) {
        throw new Error(validation.error || 'Judul tidak valid');
      }
      return kreditProdukService.formatParameterJudul(judul);
    },
    [validateParameterJudul],
  );

  const formatNilaiJudul = useCallback((judul: any): CreateKreditNilaiDto['judul'] => {
    return kreditProdukService.formatNilaiJudul(judul);
  }, []);

  const formatBobot = useCallback(
    (bobot: any): number => {
      const validation = validateBobot(bobot);
      if (!validation.isValid) {
        return 0;
      }
      return validation.value;
    },
    [validateBobot],
  );

  const formatKategori = useCallback(
    (kategori: any) => {
      if (!kategori) {
        return {
          model: '',
          prinsip: '',
          jenis: '',
          underlying: [],
        };
      }

      if (typeof kategori === 'object') {
        const cleanKategori = {
          model: kategori.model || '',
          prinsip: kategori.prinsip || '',
          jenis: kategori.jenis || '',
          underlying: Array.isArray(kategori.underlying) ? kategori.underlying.filter(Boolean) : [],
        };

        const validation = validateKategori(cleanKategori);
        if (!validation.isValid && cleanKategori.model) {
          console.warn('[KreditHook] Invalid kategori:', validation.error);
        }

        return cleanKategori;
      }

      return {
        model: '',
        prinsip: '',
        jenis: '',
        underlying: [],
      };
    },
    [validateKategori],
  );

  /* =======================
     LOAD DATA per Year-Quarter - PERBAIKAN UTAMA
  ======================= */

  const loadData = useCallback(
    async (loadYear: number, loadQuarter: number, forceReload = false) => {
      const cacheKey = getCacheKey(loadYear, loadQuarter);
      console.log(`[KreditHook] loadData called for ${cacheKey}, forceReload: ${forceReload}`);

      if (!loadYear || !loadQuarter || loadQuarter < 1 || loadQuarter > 4) {
        const errorMsg = 'Year dan quarter harus valid';
        console.warn(`[KreditHook] ${errorMsg}: Year=${loadYear}, Quarter=${loadQuarter}`);

        // Reset state jika year/quarter tidak valid
        if (year === loadYear && quarter === loadQuarter) {
          safeSet(setRows, []);
          safeSet(setError, errorMsg);
          safeSet(setActivePeriodKey, '');
        }
        return [];
      }

      // Cegah multiple loading untuk year-quarter yang sama
      if (loadingQueueRef.current.has(cacheKey) && !forceReload) {
        console.log(`[KreditHook] Load already in progress for ${cacheKey}, skipping...`);
        const cached = getFromCache(loadYear, loadQuarter);
        return cached?.rows || [];
      }

      loadingQueueRef.current.add(cacheKey);

      // PERBAIKAN PENTING: Only update state if this is the active period
      const isActivePeriod = year === loadYear && quarter === loadQuarter;
      if (isActivePeriod) {
        safeSet(setRows, []);
        safeSet(setCurrentKreditId, null);
        safeSet(setCurrentKreditData, null);
        safeSet(setError, null);
      }

      safeSet(setIsLoading, true);

      // Cek cache jika tidak force reload
      if (!forceReload) {
        const cached = getFromCache(loadYear, loadQuarter);
        if (cached) {
          console.log(`[KreditHook] Loading from cache: ${cacheKey}`);

          // Update state hanya jika ini adalah period yang aktif
          if (isActivePeriod) {
            safeSet(setRows, cached.rows);
            safeSet(setCurrentKreditId, cached.kreditId);
            safeSet(setCurrentKreditData, cached.entity);
            safeSet(setYear, loadYear);
            safeSet(setQuarter, loadQuarter);
            safeSet(setActivePeriodKey, cacheKey);
            safeSet(setIsLoading, false);
          }

          loadingQueueRef.current.delete(cacheKey);
          console.log(`[KreditHook] Cache loaded: ${cached.rows.length} rows`);
          return cached.rows;
        }
      }

      try {
        console.log(`[KreditHook] Loading data for ${cacheKey} from API`);

        // Gunakan getOrCreateData yang baru
        const data = await getOrCreateData(loadYear, loadQuarter, forceReload);

        if (!data) {
          throw new Error('Gagal memuat atau membuat data');
        }

        // Update cache untuk year-quarter ini
        updateCache(loadYear, loadQuarter, {
          rows: data.rows,
          kreditId: data.kreditId,
          entity: data.entity,
        });

        // Update state hanya jika ini adalah period yang aktif
        if (isActivePeriod) {
          safeSet(setRows, data.rows);
          safeSet(setCurrentKreditId, data.kreditId);
          safeSet(setCurrentKreditData, data.entity);
          safeSet(setYear, loadYear);
          safeSet(setQuarter, loadQuarter);
          safeSet(setActivePeriodKey, cacheKey);
          safeSet(setIsLoading, false);
        }

        console.log(`[KreditHook] Data loaded successfully for ${cacheKey}: ID=${data.kreditId || 'N/A'}, Parameters=${data.rows.length}, isNew=${data.isNew}`);
        loadingQueueRef.current.delete(cacheKey);

        return data.rows;
      } catch (e: any) {
        console.error(`[KreditHook] Error loading data for ${cacheKey}:`, e);

        const errorMsg = e.response?.data?.message || e.message || 'Gagal memuat data';

        // Update error state hanya jika ini adalah period yang aktif
        if (isActivePeriod) {
          safeSet(setError, errorMsg);
          safeSet(setRows, []);
          safeSet(setCurrentKreditId, null);
          safeSet(setCurrentKreditData, null);
          safeSet(setIsLoading, false);
        }

        loadingQueueRef.current.delete(cacheKey);
        throw e;
      }
    },
    [year, quarter, getCacheKey, getFromCache, updateCache, getOrCreateData],
  );

  /* =======================
     CHANGE YEAR-QUARTER - PERBAIKAN UTAMA
  ======================= */

  const changeYearQuarter = useCallback(
    async (newYear: number, newQuarter: number) => {
      console.log(`[KreditHook] Changing from ${year}-Q${quarter} to ${newYear}-Q${newQuarter}`);

      // Validasi input
      if (!newYear || !newQuarter || newQuarter < 1 || newQuarter > 4) {
        const errorMsg = 'Year dan quarter harus valid';
        safeSet(setError, errorMsg);
        throw new Error(errorMsg);
      }

      const newCacheKey = getCacheKey(newYear, newQuarter);
      console.log(`[KreditHook] New cache key: ${newCacheKey}`);

      // PERBAIKAN PENTING: Reset state untuk periode baru
      safeSet(setRows, []);
      safeSet(setCurrentKreditId, null);
      safeSet(setCurrentKreditData, null);
      safeSet(setYear, newYear);
      safeSet(setQuarter, newQuarter);
      safeSet(setActivePeriodKey, newCacheKey);
      safeSet(setError, null);
      safeSet(setIsLoading, true);

      try {
        // Load data untuk year-quarter yang baru
        const data = await loadData(newYear, newQuarter, false);

        console.log(`[KreditHook] Successfully changed to ${newYear}-Q${newQuarter}:`, {
          parameters: data.length,
          cacheKey: newCacheKey,
        });

        return data;
      } catch (error) {
        console.error('[KreditHook] Error changing year-quarter:', error);
        safeSet(setError, 'Gagal memuat data untuk periode baru');
        safeSet(setIsLoading, false);
        throw error;
      }
    },
    [year, quarter, loadData, getCacheKey],
  );

  /* =======================
     HELPER: Validasi dan update cache untuk operasi CRUD
  ======================= */

  const validateAndGetCurrentContext = useCallback(() => {
    if (!currentKreditId) {
      throw new Error('Data belum dimuat. Silakan load data terlebih dahulu.');
    }
    if (!year || !quarter) {
      throw new Error('Year dan quarter tidak valid untuk operasi ini');
    }

    return { kreditId: currentKreditId, year, quarter };
  }, [currentKreditId, year, quarter]);

  const updateCacheAfterOperation = useCallback(
    async (targetYear?: number, targetQuarter?: number) => {
      const effectiveYear = targetYear ?? year;
      const effectiveQuarter = targetQuarter ?? quarter;

      if (!effectiveYear || !effectiveQuarter) {
        console.warn('[KreditHook] Cannot update cache: year or quarter is null');
        return [];
      }

      try {
        console.log(`[KreditHook] Updating cache for ${effectiveYear}-Q${effectiveQuarter}`);

        // Gunakan getOrCreateData untuk mendapatkan data terbaru
        const data = await getOrCreateData(effectiveYear, effectiveQuarter, true);

        if (!data) {
          throw new Error('Gagal memperbarui cache');
        }

        // Update cache
        updateCache(effectiveYear, effectiveQuarter, {
          rows: data.rows,
          kreditId: data.kreditId,
          entity: data.entity,
        });

        // Update state jika ini adalah period yang aktif
        if (year === effectiveYear && quarter === effectiveQuarter) {
          safeSet(setRows, data.rows);
          safeSet(setCurrentKreditData, data.entity);
          if (data.kreditId) {
            safeSet(setCurrentKreditId, data.kreditId);
          }
        }

        console.log(`[KreditHook] Cache updated for ${effectiveYear}-Q${effectiveQuarter}: ${data.rows.length} parameters`);
        return data.rows;
      } catch (error) {
        console.error(`[KreditHook] Error updating cache for ${effectiveYear}-Q${effectiveQuarter}:`, error);
        throw error;
      }
    },
    [year, quarter, getOrCreateData, updateCache],
  );

  /* =======================
     PARAMETER OPERATIONS - DIPERBAIKI
  ======================= */

  const handleAddParameter = useCallback(
    async (dto: Partial<CreateKreditParameterDto>) => {
      const context = validateAndGetCurrentContext();
      console.log('[KreditHook] handleAddParameter called:', context);

      safeSet(setIsLoading, true);
      safeSet(setError, null);

      try {
        const cleanPayload: CreateKreditParameterDto = {
          nomor: dto.nomor?.toString().trim() || '',
          judul: dto.judul?.toString().trim() || '',
          bobot: formatBobot(dto.bobot),
          kategori: formatKategori(dto.kategori),
        };

        // Validasi
        const judulValidation = validateParameterJudul(cleanPayload.judul);
        if (!judulValidation.isValid) {
          throw new Error(judulValidation.error);
        }

        const bobotValidation = validateBobot(cleanPayload.bobot);
        if (!bobotValidation.isValid) {
          throw new Error(bobotValidation.error);
        }

        const kategoriValidation = validateKategori(cleanPayload.kategori);
        if (!kategoriValidation.isValid) {
          throw new Error(kategoriValidation.error);
        }

        // Clean kategori untuk backend
        const { model, prinsip, jenis, underlying } = cleanPayload.kategori;
        const cleanKategori: any = {
          model,
          underlying: Array.isArray(underlying) ? underlying : [],
        };

        if (model === 'lainnya') {
          cleanKategori.prinsip = undefined;
          cleanKategori.jenis = undefined;
        } else {
          cleanKategori.prinsip = prinsip || undefined;
          if (model === 'konvensional' || model === 'syariah') {
            cleanKategori.jenis = jenis || undefined;
          } else if (model === 'kombinasi') {
            cleanKategori.jenis = undefined;
          }
        }

        const finalPayload: CreateKreditParameterDto = {
          ...cleanPayload,
          kategori: cleanKategori,
        };

        console.log('[KreditHook] Add parameter payload:', JSON.stringify(finalPayload, null, 2));

        // Gunakan loadOrCreateData dari service untuk memastikan data ada
        await kreditProdukService.loadOrCreateData(context.year, context.quarter);

        // Tambahkan parameter
        await kreditProdukService.addParameter(context.kreditId, finalPayload);

        // Update cache untuk year-quarter ini
        await updateCacheAfterOperation(context.year, context.quarter);

        console.log('[KreditHook] Parameter added successfully');
        safeSet(setIsLoading, false);

        return true;
      } catch (e: any) {
        console.error('[KreditHook] Error adding parameter:', e);

        let errorMessage = 'Gagal menambahkan parameter';
        if (e.response?.data) {
          const errorData = e.response.data;
          if (errorData.message && Array.isArray(errorData.message)) {
            const validationErrors = errorData.message
              .map((err: any) => {
                const field = err.property || 'unknown';
                const constraints = err.constraints || {};
                const messages = Object.values(constraints).join(', ');
                return `${field}: ${messages}`;
              })
              .join('\n');
            errorMessage = `Validasi gagal:\n${validationErrors}`;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } else if (e.message) {
          errorMessage = e.message;
        }

        safeSet(setError, errorMessage);
        safeSet(setIsLoading, false);
        throw new Error(errorMessage);
      }
    },
    [validateAndGetCurrentContext, formatBobot, formatKategori, validateParameterJudul, validateBobot, validateKategori, updateCacheAfterOperation],
  );

  // =======================
  // TAMBAHKAN FUNGSI handleUpdateParameter
  // =======================

  const handleUpdateParameter = useCallback(
    async (parameterId: string, dto: UpdateKreditParameterDto) => {
      const context = validateAndGetCurrentContext();
      console.log('[KreditHook] handleUpdateParameter called:', { context, parameterId });

      safeSet(setIsLoading, true);
      safeSet(setError, null);

      try {
        const payload: UpdateKreditParameterDto = {};

        if (dto.nomor !== undefined) payload.nomor = dto.nomor;
        if (dto.judul !== undefined) {
          const validation = validateParameterJudul(dto.judul);
          if (!validation.isValid) {
            throw new Error(validation.error);
          }
          payload.judul = kreditProdukService.formatParameterJudul(dto.judul);
        }
        if (dto.bobot !== undefined) {
          const validation = validateBobot(dto.bobot);
          if (!validation.isValid) {
            throw new Error(validation.error);
          }
          payload.bobot = validation.value;
        }
        if (dto.kategori !== undefined) {
          const cleanKategori = formatKategori(dto.kategori);
          const validation = validateKategori(cleanKategori);
          if (!validation.isValid) {
            throw new Error(validation.error);
          }

          const { model, prinsip, jenis, underlying } = cleanKategori;
          const formattedKategori: any = {
            model,
          };

          if (model === 'lainnya') {
            formattedKategori.prinsip = undefined;
            formattedKategori.jenis = undefined;
            formattedKategori.underlying = [];
          } else {
            formattedKategori.prinsip = prinsip || undefined;
            if (model === 'konvensional' || model === 'syariah') {
              formattedKategori.jenis = jenis || undefined;
              formattedKategori.underlying = [];
            } else if (model === 'kombinasi') {
              formattedKategori.jenis = undefined;
              formattedKategori.underlying = Array.isArray(underlying) ? underlying : [];
            }
          }

          payload.kategori = formattedKategori;
        }
        if (dto.orderIndex !== undefined) payload.orderIndex = dto.orderIndex;

        const parameterIdNum = parseInt(parameterId, 10);
        if (isNaN(parameterIdNum)) {
          throw new Error(`Parameter ID tidak valid: ${parameterId}`);
        }

        console.log('[KreditHook] Update parameter payload:', JSON.stringify(payload, null, 2));

        await kreditProdukService.updateParameter(context.kreditId, parameterIdNum, payload);

        // Update cache untuk year-quarter ini
        await updateCacheAfterOperation(context.year, context.quarter);

        console.log(`[KreditHook] Parameter ${parameterId} updated successfully`);
        safeSet(setIsLoading, false);

        return true;
      } catch (e: any) {
        console.error('[KreditHook] Error updating parameter:', e);

        let errorMsg = 'Gagal mengupdate parameter';
        if (e.response?.data) {
          const errorData = e.response.data;
          if (Array.isArray(errorData.errors)) {
            const errorDetails = errorData.errors.map((err) => `${err.field || 'unknown'}: ${err.message}`).join('\n');
            errorMsg = `Validasi gagal:\n${errorDetails}`;
          } else if (errorData.message) {
            errorMsg = errorData.message;
          }
        } else if (e.message) {
          errorMsg = e.message;
        }

        safeSet(setError, errorMsg);
        safeSet(setIsLoading, false);
        throw new Error(errorMsg);
      }
    },
    [validateAndGetCurrentContext, validateParameterJudul, validateBobot, formatKategori, validateKategori, updateCacheAfterOperation],
  );

  // =======================
  // TAMBAHKAN FUNGSI handleCopyParameter
  // =======================

  const handleCopyParameter = useCallback(
    async (parameterId: string) => {
      const context = validateAndGetCurrentContext();
      console.log(`[KreditHook] handleCopyParameter called: ${parameterId}`, context);

      safeSet(setIsLoading, true);
      safeSet(setError, null);

      try {
        const parameterIdNum = parseInt(parameterId, 10);
        if (isNaN(parameterIdNum)) {
          throw new Error(`Parameter ID tidak valid: ${parameterId}`);
        }

        await kreditProdukService.copyParameter(context.kreditId, parameterIdNum);

        // Update cache untuk year-quarter ini
        await updateCacheAfterOperation(context.year, context.quarter);

        console.log(`[KreditHook] Parameter ${parameterId} copied successfully`);
        safeSet(setIsLoading, false);

        return true;
      } catch (e: any) {
        console.error('[KreditHook] Error copying parameter:', e);
        const errorMsg = e.response?.data?.message || e.message || 'Gagal menyalin parameter';
        safeSet(setError, errorMsg);
        safeSet(setIsLoading, false);
        throw e;
      }
    },
    [validateAndGetCurrentContext, updateCacheAfterOperation],
  );

  // =======================
  // TAMBAHKAN FUNGSI handleDeleteParameter
  // =======================

  const handleDeleteParameter = useCallback(
    async (parameterId: string) => {
      const context = validateAndGetCurrentContext();
      console.log(`[KreditHook] handleDeleteParameter called: ${parameterId}`, context);

      safeSet(setIsLoading, true);
      safeSet(setError, null);

      try {
        const parameterIdNum = parseInt(parameterId, 10);
        if (isNaN(parameterIdNum)) {
          throw new Error(`Parameter ID tidak valid: ${parameterId}`);
        }

        await kreditProdukService.removeParameter(context.kreditId, parameterIdNum);

        // Update cache untuk year-quarter ini
        await updateCacheAfterOperation(context.year, context.quarter);

        console.log(`[KreditHook] Parameter ${parameterId} deleted successfully`);
        safeSet(setIsLoading, false);

        return true;
      } catch (e: any) {
        console.error('[KreditHook] Error deleting parameter:', e);
        const errorMsg = e.response?.data?.message || e.message || 'Gagal menghapus parameter';
        safeSet(setError, errorMsg);
        safeSet(setIsLoading, false);
        throw e;
      }
    },
    [validateAndGetCurrentContext, updateCacheAfterOperation],
  );

  /* =======================
     NILAI OPERATIONS - DIPERBAIKI
  ======================= */

  // =======================
  // TAMBAHKAN FUNGSI handleAddNilai
  // =======================

  const handleAddNilai = useCallback(
    async (parameterId: string, dto: CreateKreditNilaiDto) => {
      const context = validateAndGetCurrentContext();
      console.log(`[KreditHook] handleAddNilai called:`, { context, parameterId });

      safeSet(setIsLoading, true);
      safeSet(setError, null);

      try {
        const parameterIdNum = parseInt(parameterId, 10);
        if (isNaN(parameterIdNum)) {
          throw new Error(`Parameter ID tidak valid: ${parameterId}`);
        }

        if (!dto.judul?.text || dto.judul.text.trim() === '') {
          throw new Error('Judul nilai tidak boleh kosong');
        }

        const bobotValidation = validateBobot(dto.bobot);
        if (!bobotValidation.isValid) {
          throw new Error(bobotValidation.error || 'Bobot tidak valid');
        }

        const payload: CreateKreditNilaiDto = {
          ...dto,
          bobot: bobotValidation.value,
          judul: formatNilaiJudul(dto.judul),
        };

        console.log('[KreditHook] Add nilai payload:', payload);

        // Gunakan loadOrCreateData dari service untuk memastikan data ada
        await kreditProdukService.loadOrCreateData(context.year, context.quarter);

        // Tambahkan nilai
        await kreditProdukService.addNilai(context.kreditId, parameterIdNum, payload);

        // Update cache untuk year-quarter ini
        await updateCacheAfterOperation(context.year, context.quarter);

        console.log(`[KreditHook] Nilai added to parameter ${parameterId} successfully`);
        safeSet(setIsLoading, false);

        return true;
      } catch (e: any) {
        console.error('[KreditHook] Error adding nilai:', e);
        const errorMsg = e.response?.data?.message || e.message || 'Gagal menambahkan nilai';
        safeSet(setError, errorMsg);
        safeSet(setIsLoading, false);
        throw e;
      }
    },
    [validateAndGetCurrentContext, validateBobot, formatNilaiJudul, updateCacheAfterOperation],
  );

  // =======================
  // TAMBAHKAN FUNGSI handleUpdateNilai
  // =======================

  const handleUpdateNilai = useCallback(
    async (parameterId: string, nilaiId: string, dto: UpdateKreditNilaiDto) => {
      const context = validateAndGetCurrentContext();
      console.log(`[KreditHook] handleUpdateNilai called:`, { context, parameterId, nilaiId });

      safeSet(setIsLoading, true);
      safeSet(setError, null);

      try {
        const parameterIdNum = parseInt(parameterId, 10);
        const nilaiIdNum = parseInt(nilaiId, 10);

        if (isNaN(parameterIdNum) || isNaN(nilaiIdNum)) {
          throw new Error(`ID tidak valid: parameterId=${parameterId}, nilaiId=${nilaiId}`);
        }

        const payload: UpdateKreditNilaiDto = { ...dto };

        if (dto.judul !== undefined) {
          payload.judul = formatNilaiJudul(dto.judul);
        }

        if (dto.bobot !== undefined) {
          payload.bobot = formatBobot(dto.bobot);
        }

        console.log('[KreditHook] Update nilai payload:', payload);

        await kreditProdukService.updateNilai(context.kreditId, parameterIdNum, nilaiIdNum, payload);

        // Update cache untuk year-quarter ini
        await updateCacheAfterOperation(context.year, context.quarter);

        console.log(`[KreditHook] Nilai ${nilaiId} updated successfully`);
        safeSet(setIsLoading, false);

        return true;
      } catch (e: any) {
        console.error('[KreditHook] Error updating nilai:', e);
        const errorMsg = e.response?.data?.message || e.message || 'Gagal mengupdate nilai';
        safeSet(setError, errorMsg);
        safeSet(setIsLoading, false);
        throw e;
      }
    },
    [validateAndGetCurrentContext, formatNilaiJudul, formatBobot, updateCacheAfterOperation],
  );

  // =======================
  // TAMBAHKAN FUNGSI handleCopyNilai
  // =======================

  const handleCopyNilai = useCallback(
    async (parameterId: string, nilaiId: string) => {
      const context = validateAndGetCurrentContext();
      console.log(`[KreditHook] handleCopyNilai called:`, { context, parameterId, nilaiId });

      safeSet(setIsLoading, true);
      safeSet(setError, null);

      try {
        const parameterIdNum = parseInt(parameterId, 10);
        const nilaiIdNum = parseInt(nilaiId, 10);

        if (isNaN(parameterIdNum) || isNaN(nilaiIdNum)) {
          throw new Error(`ID tidak valid: parameterId=${parameterId}, nilaiId=${nilaiId}`);
        }

        await kreditProdukService.copyNilai(context.kreditId, parameterIdNum, nilaiIdNum);

        // Update cache untuk year-quarter ini
        await updateCacheAfterOperation(context.year, context.quarter);

        console.log(`[KreditHook] Nilai ${nilaiId} copied successfully`);
        safeSet(setIsLoading, false);

        return true;
      } catch (e: any) {
        console.error('[KreditHook] Error copying nilai:', e);
        const errorMsg = e.response?.data?.message || e.message || 'Gagal menyalin nilai';
        safeSet(setError, errorMsg);
        safeSet(setIsLoading, false);
        throw e;
      }
    },
    [validateAndGetCurrentContext, updateCacheAfterOperation],
  );

  // =======================
  // TAMBAHKAN FUNGSI handleDeleteNilai
  // =======================

  const handleDeleteNilai = useCallback(
    async (parameterId: string, nilaiId: string) => {
      const context = validateAndGetCurrentContext();
      console.log(`[KreditHook] handleDeleteNilai called:`, { context, parameterId, nilaiId });

      safeSet(setIsLoading, true);
      safeSet(setError, null);

      try {
        const parameterIdNum = parseInt(parameterId, 10);
        const nilaiIdNum = parseInt(nilaiId, 10);

        if (isNaN(parameterIdNum) || isNaN(nilaiIdNum)) {
          throw new Error(`ID tidak valid: parameterId=${parameterId}, nilaiId=${nilaiId}`);
        }

        await kreditProdukService.removeNilai(context.kreditId, parameterIdNum, nilaiIdNum);

        // Update cache untuk year-quarter ini
        await updateCacheAfterOperation(context.year, context.quarter);

        console.log(`[KreditHook] Nilai ${nilaiId} deleted successfully`);
        safeSet(setIsLoading, false);

        return true;
      } catch (e: any) {
        console.error('[KreditHook] Error deleting nilai:', e);
        const errorMsg = e.response?.data?.message || e.message || 'Gagal menghapus nilai';
        safeSet(setError, errorMsg);
        safeSet(setIsLoading, false);
        throw e;
      }
    },
    [validateAndGetCurrentContext, updateCacheAfterOperation],
  );

  // =======================
  // TAMBAHKAN FUNGSI handleReorderParameters (jika diperlukan)
  // =======================

  const handleReorderParameters = useCallback(
    async (parameterIds: string[]) => {
      const context = validateAndGetCurrentContext();
      console.log(`[KreditHook] handleReorderParameters called:`, { context, parameterIds });

      safeSet(setIsLoading, true);
      safeSet(setError, null);

      try {
        const parameterIdsNum = parameterIds.map((id) => parseInt(id, 10)).filter((id) => !isNaN(id));

        if (parameterIdsNum.length !== parameterIds.length) {
          throw new Error('Beberapa ID parameter tidak valid');
        }

        await kreditProdukService.reorderParameters(context.kreditId, parameterIdsNum);

        // Update cache untuk year-quarter ini
        await updateCacheAfterOperation(context.year, context.quarter);

        console.log(`[KreditHook] Parameters reordered successfully`);
        safeSet(setIsLoading, false);

        return true;
      } catch (e: any) {
        console.error('[KreditHook] Error reordering parameters:', e);
        const errorMsg = e.response?.data?.message || e.message || 'Gagal mengurutkan parameter';
        safeSet(setError, errorMsg);
        safeSet(setIsLoading, false);
        throw e;
      }
    },
    [validateAndGetCurrentContext, updateCacheAfterOperation],
  );

  // =======================
  // TAMBAHKAN FUNGSI handleReorderNilai (jika diperlukan)
  // =======================

  const handleReorderNilai = useCallback(
    async (parameterId: string, nilaiIds: string[]) => {
      const context = validateAndGetCurrentContext();
      console.log(`[KreditHook] handleReorderNilai called:`, { context, parameterId, nilaiIds });

      safeSet(setIsLoading, true);
      safeSet(setError, null);

      try {
        const parameterIdNum = parseInt(parameterId, 10);
        if (isNaN(parameterIdNum)) {
          throw new Error(`Parameter ID tidak valid: ${parameterId}`);
        }

        const nilaiIdsNum = nilaiIds.map((id) => parseInt(id, 10)).filter((id) => !isNaN(id));

        if (nilaiIdsNum.length !== nilaiIds.length) {
          throw new Error('Beberapa ID nilai tidak valid');
        }

        await kreditProdukService.reorderNilai(context.kreditId, parameterIdNum, nilaiIdsNum);

        // Update cache untuk year-quarter ini
        await updateCacheAfterOperation(context.year, context.quarter);

        console.log(`[KreditHook] Nilai reordered successfully for parameter ${parameterId}`);
        safeSet(setIsLoading, false);

        return true;
      } catch (e: any) {
        console.error('[KreditHook] Error reordering nilai:', e);
        const errorMsg = e.response?.data?.message || e.message || 'Gagal mengurutkan nilai';
        safeSet(setError, errorMsg);
        safeSet(setIsLoading, false);
        throw e;
      }
    },
    [validateAndGetCurrentContext, updateCacheAfterOperation],
  );

  // =======================
  // TAMBAHKAN FUNGSI getParameterById
  // =======================

  const getParameterById = useCallback(
    (parameterId: string) => {
      if (!Array.isArray(rows)) {
        console.warn('[KreditHook] rows is not an array in getParameterById');
        return undefined;
      }
      return rows.find((p) => p.id === parameterId);
    },
    [rows],
  );

  /* =======================
     UTILITY FUNCTIONS - DIPERBAIKI
  ======================= */

  const reloadData = useCallback(
    async (reloadYear?: number, reloadQuarter?: number) => {
      const targetYear = reloadYear ?? year;
      const targetQuarter = reloadQuarter ?? quarter;

      if (!targetYear || !targetQuarter) {
        throw new Error('Year dan quarter diperlukan untuk reload data');
      }

      console.log(`[KreditHook] Reloading data for ${targetYear}-Q${targetQuarter}`);

      // Clear cache untuk year-quarter ini
      clearCache(targetYear, targetQuarter);

      // Jika ini adalah period yang aktif, update state
      if (year === targetYear && quarter === targetQuarter) {
        safeSet(setRows, []);
        safeSet(setCurrentKreditId, null);
        safeSet(setCurrentKreditData, null);
        safeSet(setError, null);
        safeSet(setIsLoading, true);
      }

      return loadData(targetYear, targetQuarter, true);
    },
    [year, quarter, loadData, clearCache],
  );

  const reset = useCallback(() => {
    console.log('[KreditHook] Resetting hook state');

    safeSet(setRows, []);
    safeSet(setIsLoading, false);
    safeSet(setError, null);
    safeSet(setCurrentKreditId, null);
    safeSet(setCurrentKreditData, null);
    safeSet(setYear, null);
    safeSet(setQuarter, null);
    safeSet(setActivePeriodKey, '');

    clearCache();
    loadingQueueRef.current.clear();
  }, [clearCache]);

  const clearError = useCallback(() => {
    console.log('[KreditHook] Clearing error');
    safeSet(setError, null);
  }, []);

  const safeSetRows = useCallback((newRows: any) => {
    console.log('[KreditHook] Setting new rows:', {
      inputType: typeof newRows,
      isArray: Array.isArray(newRows),
      length: Array.isArray(newRows) ? newRows.length : 'N/A',
    });

    const safeRows = Array.isArray(newRows) ? newRows : [];
    safeSet(setRows, safeRows);
  }, []);

  /* =======================
     AUTO-LOAD EFFECT - DIPERBAIKI
  ======================= */

  useEffect(() => {
    const initLoad = async () => {
      if (initialYear && initialQuarter) {
        console.log(`[KreditHook] Auto-loading data for ${initialYear}-Q${initialQuarter}`);
        try {
          await loadData(initialYear, initialQuarter, true);
        } catch (error) {
          console.error('[KreditHook] Auto-load failed:', error);
          safeSet(setRows, []);
        }
      } else {
        console.log('[KreditHook] No initialYear/initialQuarter provided, skipping auto-load');
      }
    };

    const timer = setTimeout(() => {
      if (mountedRef.current) {
        initLoad();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [initialYear, initialQuarter, loadData]);

  /* =======================
     RETURN VALUES - DITAMBAHKAN SEMUA FUNGSI
  ======================= */

  return {
    // State
    rows: Array.isArray(rows) ? rows : [],
    isLoading,
    error,
    currentKreditId,
    currentKreditData,
    year,
    quarter,
    activePeriodKey,

    // Data operations
    loadData,
    changeYearQuarter,
    reloadData,
    reset,
    clearError,

    // Parameter operations
    handleAddParameter,
    handleUpdateParameter,
    handleCopyParameter,
    handleDeleteParameter,

    // Nilai operations
    handleAddNilai,
    handleUpdateNilai,
    handleCopyNilai,
    handleDeleteNilai,

    // Reorder operations
    handleReorderParameters,
    handleReorderNilai,

    // Helper functions
    getParameterById,
    setRows: safeSetRows,

    // Formatting helpers
    formatParameterJudul,
    formatNilaiJudul,
    formatBobot,
    formatKategori,

    // Validation helpers
    validateKategori,
    validateParameterJudul,
    validateBobot,

    // Cache management
    clearCache,
    getCacheInfo: () => ({
      size: cacheRef.current.size,
      keys: Array.from(cacheRef.current.keys()),
      currentKey: getCurrentCacheKey(),
      loadingQueue: Array.from(loadingQueueRef.current),
    }),

    // Status helpers
    hasData: Array.isArray(rows) && rows.length > 0,
    isReady: currentKreditId !== null && !isLoading,
    hasError: error !== null,

    // Debug info
    cacheSize: cacheRef.current.size,

    // New helper functions
    getOrCreateData,
  };
};

export default useKreditProdukIntegration;
