// hooks/likuiditas-produk/useLikuiditasProdukIntegration.ts
import { useState, useCallback, useRef, useEffect } from 'react';
// import likuiditasProdukService, { CreateLikuiditasNilaiDto, CreateLikuiditasParameterDto, LikuiditasProdukOjkEntity, UpdateLikuiditasNilaiDto, UpdateLikuiditasParameterDto } from '../../service/likuiditas-produk/likuiditas-produk.service';

import likuiditasProdukService, { LikuiditasProdukOjkEntity, UpdateLikuiditasNilaiDto, UpdateLikuiditasParameterDto, CreateLikuiditasNilaiDto, CreateLikuiditasParameterDto } from '../../service/inherent/likuiditas-produk.service';

export const useLikuiditasProdukIntegration = (initialYear?: number, initialQuarter?: number) => {
  // State untuk data yang sedang aktif
  const [rows, setRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentInherentId, setCurrentInherentId] = useState<number | null>(null);
  const [currentInherentData, setCurrentInherentData] = useState<LikuiditasProdukOjkEntity | null>(null);
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
        inherentId: number | null;
        entity: LikuiditasProdukOjkEntity | null;
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
    console.log(`[Hook] getOrCreateData: ${targetYear}-Q${targetQuarter}, force: ${forceReload}`);

    const cacheKey = getCacheKey(targetYear, targetQuarter);

    // Skip jika sudah loading
    if (loadingQueueRef.current.has(cacheKey) && !forceReload) {
      console.log(`[Hook] Load already in progress for ${cacheKey}`);
      return null;
    }

    loadingQueueRef.current.add(cacheKey);

    try {
      // Gunakan findOrCreate dari service
      const result = await likuiditasProdukService.findOrCreate(targetYear, targetQuarter);

      if (!result.success) {
        throw new Error(result.message);
      }

      if (!result.data) {
        throw new Error('Data tidak ditemukan dan gagal dibuat');
      }

      // Format data untuk frontend
      const formattedRows = likuiditasProdukService.formatToFrontend(result.data);

      // Update cache
      updateCache(targetYear, targetQuarter, {
        rows: formattedRows,
        inherentId: result.data.id,
        entity: result.data,
      });

      return {
        rows: formattedRows,
        inherentId: result.data.id,
        entity: result.data,
        isNew: result.isNew,
      };
    } catch (error: any) {
      console.error(`[Hook] Error in getOrCreateData for ${cacheKey}:`, error);
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
    (y: number, q: number, data: { rows: any[]; inherentId: number | null; entity: LikuiditasProdukOjkEntity | null }) => {
      const key = getCacheKey(y, q);
      const cacheEntry = {
        rows: data.rows,
        inherentId: data.inherentId,
        entity: data.entity,
        timestamp: Date.now(),
      };
      cacheRef.current.set(key, cacheEntry);
      console.log(`[Hook] Cache updated for ${key}:`, {
        rowsCount: data.rows.length,
        inherentId: data.inherentId,
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
        console.log(`[Hook] Cache hit for ${key}:`, {
          rowsCount: cached.rows.length,
          age: Date.now() - cached.timestamp,
        });
      } else {
        console.log(`[Hook] Cache miss for ${key}`);
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
        console.log(`[Hook] Cache cleared for ${key}: ${deleted ? 'success' : 'not found'}`);
      } else {
        const size = cacheRef.current.size;
        cacheRef.current.clear();
        console.log(`[Hook] All cache cleared (${size} entries)`);
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

    const validModels = ['tanpa_model', 'standar', 'komprehensif'];
    if (!model || !validModels.includes(model)) {
      return { isValid: false, error: `Model harus salah satu dari: ${validModels.join(', ')}` };
    }

    if (model === 'tanpa_model') {
      if (prinsip || jenis || (Array.isArray(underlying) && underlying.length > 0)) {
        return { isValid: false, error: 'Untuk model "tanpa_model", prinsip, jenis, dan underlying harus kosong' };
      }
      return { isValid: true };
    }

    const validPrinsip = ['syariah', 'konvensional'];
    if (!prinsip || !validPrinsip.includes(prinsip)) {
      return { isValid: false, error: `Prinsip harus salah satu dari: ${validPrinsip.join(', ')}` };
    }

    if (model === 'standar') {
      const validJenis = ['jangka_pendek', 'jangka_menengah', 'jangka_panjang'];
      if (!jenis || !validJenis.includes(jenis)) {
        return { isValid: false, error: `Jenis harus salah satu dari: ${validJenis.join(', ')}` };
      }
      if (Array.isArray(underlying) && underlying.length > 0) {
        return { isValid: false, error: 'Untuk model "standar", underlying harus kosong' };
      }
    }

    if (model === 'komprehensif') {
      if (jenis) {
        return { isValid: false, error: 'Untuk model "komprehensif", jenis harus kosong' };
      }
      if (Array.isArray(underlying)) {
        const validUnderlying = ['kewajiban', 'aset_lancar', 'arus_kas', 'rasio'];
        const invalidValues = underlying.filter((v: string) => !validUnderlying.includes(v));
        if (invalidValues.length > 0) {
          return { isValid: false, error: `Underlying tidak valid: ${invalidValues.join(', ')}` };
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
      return likuiditasProdukService.formatParameterJudul(judul);
    },
    [validateParameterJudul],
  );

  const formatNilaiJudul = useCallback((judul: any): CreateLikuiditasNilaiDto['judul'] => {
    return likuiditasProdukService.formatNilaiJudul(judul);
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
          console.warn('[Hook] Invalid kategori:', validation.error);
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
      console.log(`[Hook] loadData called for ${cacheKey}, forceReload: ${forceReload}`);

      if (!loadYear || !loadQuarter || loadQuarter < 1 || loadQuarter > 4) {
        const errorMsg = 'Year dan quarter harus valid';
        console.warn(`[Hook] ${errorMsg}: Year=${loadYear}, Quarter=${loadQuarter}`);

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
        console.log(`[Hook] Load already in progress for ${cacheKey}, skipping...`);
        const cached = getFromCache(loadYear, loadQuarter);
        return cached?.rows || [];
      }

      loadingQueueRef.current.add(cacheKey);

      // PERBAIKAN PENTING: Only update state if this is the active period
      const isActivePeriod = year === loadYear && quarter === loadQuarter;
      if (isActivePeriod) {
        safeSet(setRows, []);
        safeSet(setCurrentInherentId, null);
        safeSet(setCurrentInherentData, null);
        safeSet(setError, null);
      }

      safeSet(setIsLoading, true);

      // Cek cache jika tidak force reload
      if (!forceReload) {
        const cached = getFromCache(loadYear, loadQuarter);
        if (cached) {
          console.log(`[Hook] Loading from cache: ${cacheKey}`);

          // Update state hanya jika ini adalah period yang aktif
          if (isActivePeriod) {
            safeSet(setRows, cached.rows);
            safeSet(setCurrentInherentId, cached.inherentId);
            safeSet(setCurrentInherentData, cached.entity);
            safeSet(setYear, loadYear);
            safeSet(setQuarter, loadQuarter);
            safeSet(setActivePeriodKey, cacheKey);
            safeSet(setIsLoading, false);
          }

          loadingQueueRef.current.delete(cacheKey);
          console.log(`[Hook] Cache loaded: ${cached.rows.length} rows`);
          return cached.rows;
        }
      }

      try {
        console.log(`[Hook] Loading data for ${cacheKey} from API`);

        // Gunakan getOrCreateData yang baru
        const data = await getOrCreateData(loadYear, loadQuarter, forceReload);

        if (!data) {
          throw new Error('Gagal memuat atau membuat data');
        }

        // Update cache untuk year-quarter ini
        updateCache(loadYear, loadQuarter, {
          rows: data.rows,
          inherentId: data.inherentId,
          entity: data.entity,
        });

        // Update state hanya jika ini adalah period yang aktif
        if (isActivePeriod) {
          safeSet(setRows, data.rows);
          safeSet(setCurrentInherentId, data.inherentId);
          safeSet(setCurrentInherentData, data.entity);
          safeSet(setYear, loadYear);
          safeSet(setQuarter, loadQuarter);
          safeSet(setActivePeriodKey, cacheKey);
          safeSet(setIsLoading, false);
        }

        console.log(`[Hook] Data loaded successfully for ${cacheKey}: ID=${data.inherentId || 'N/A'}, Parameters=${data.rows.length}, isNew=${data.isNew}`);
        loadingQueueRef.current.delete(cacheKey);

        return data.rows;
      } catch (e: any) {
        console.error(`[Hook] Error loading data for ${cacheKey}:`, e);

        const errorMsg = e.response?.data?.message || e.message || 'Gagal memuat data';

        // Update error state hanya jika ini adalah period yang aktif
        if (isActivePeriod) {
          safeSet(setError, errorMsg);
          safeSet(setRows, []);
          safeSet(setCurrentInherentId, null);
          safeSet(setCurrentInherentData, null);
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
      console.log(`[Hook] Changing from ${year}-Q${quarter} to ${newYear}-Q${newQuarter}`);

      // Validasi input
      if (!newYear || !newQuarter || newQuarter < 1 || newQuarter > 4) {
        const errorMsg = 'Year dan quarter harus valid';
        safeSet(setError, errorMsg);
        throw new Error(errorMsg);
      }

      const newCacheKey = getCacheKey(newYear, newQuarter);
      console.log(`[Hook] New cache key: ${newCacheKey}`);

      // PERBAIKAN PENTING: Reset state untuk periode baru
      safeSet(setRows, []);
      safeSet(setCurrentInherentId, null);
      safeSet(setCurrentInherentData, null);
      safeSet(setYear, newYear);
      safeSet(setQuarter, newQuarter);
      safeSet(setActivePeriodKey, newCacheKey);
      safeSet(setError, null);
      safeSet(setIsLoading, true);

      try {
        // Load data untuk year-quarter yang baru
        const data = await loadData(newYear, newQuarter, false);

        console.log(`[Hook] Successfully changed to ${newYear}-Q${newQuarter}:`, {
          parameters: data.length,
          cacheKey: newCacheKey,
        });

        return data;
      } catch (error) {
        console.error('[Hook] Error changing year-quarter:', error);
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
    if (!currentInherentId) {
      throw new Error('Data belum dimuat. Silakan load data terlebih dahulu.');
    }
    if (!year || !quarter) {
      throw new Error('Year dan quarter tidak valid untuk operasi ini');
    }

    return { inherentId: currentInherentId, year, quarter };
  }, [currentInherentId, year, quarter]);

  const updateCacheAfterOperation = useCallback(
    async (targetYear?: number, targetQuarter?: number) => {
      const effectiveYear = targetYear ?? year;
      const effectiveQuarter = targetQuarter ?? quarter;

      if (!effectiveYear || !effectiveQuarter) {
        console.warn('[Hook] Cannot update cache: year or quarter is null');
        return [];
      }

      try {
        console.log(`[Hook] Updating cache for ${effectiveYear}-Q${effectiveQuarter}`);

        // Gunakan getOrCreateData untuk mendapatkan data terbaru
        const data = await getOrCreateData(effectiveYear, effectiveQuarter, true);

        if (!data) {
          throw new Error('Gagal memperbarui cache');
        }

        // Update cache
        updateCache(effectiveYear, effectiveQuarter, {
          rows: data.rows,
          inherentId: data.inherentId,
          entity: data.entity,
        });

        // Update state jika ini adalah period yang aktif
        if (year === effectiveYear && quarter === effectiveQuarter) {
          safeSet(setRows, data.rows);
          safeSet(setCurrentInherentData, data.entity);
          if (data.inherentId) {
            safeSet(setCurrentInherentId, data.inherentId);
          }
        }

        console.log(`[Hook] Cache updated for ${effectiveYear}-Q${effectiveQuarter}: ${data.rows.length} parameters`);
        return data.rows;
      } catch (error) {
        console.error(`[Hook] Error updating cache for ${effectiveYear}-Q${effectiveQuarter}:`, error);
        throw error;
      }
    },
    [year, quarter, getOrCreateData, updateCache],
  );

  /* =======================
     PARAMETER OPERATIONS - DIPERBAIKI
  ======================= */

  const handleAddParameter = useCallback(
    async (dto: Partial<CreateLikuiditasParameterDto>) => {
      const context = validateAndGetCurrentContext();
      console.log('[Hook] handleAddParameter called:', context);

      safeSet(setIsLoading, true);
      safeSet(setError, null);

      try {
        const cleanPayload: CreateLikuiditasParameterDto = {
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

        if (model === 'tanpa_model') {
          cleanKategori.prinsip = null;
          cleanKategori.jenis = null;
        } else {
          cleanKategori.prinsip = prinsip || null;
          if (model === 'standar') {
            cleanKategori.jenis = jenis || null;
          } else if (model === 'komprehensif') {
            cleanKategori.jenis = null;
          }
        }

        const finalPayload: CreateLikuiditasParameterDto = {
          ...cleanPayload,
          kategori: cleanKategori,
        };

        console.log('[Hook] Add parameter payload:', JSON.stringify(finalPayload, null, 2));

        // Gunakan loadOrCreateData dari service untuk memastikan data ada
        await likuiditasProdukService.loadOrCreateData(context.year, context.quarter);

        // Tambahkan parameter
        await likuiditasProdukService.addParameter(context.inherentId, finalPayload);

        // Update cache untuk year-quarter ini
        await updateCacheAfterOperation(context.year, context.quarter);

        console.log('[Hook] Parameter added successfully');
        safeSet(setIsLoading, false);

        return true;
      } catch (e: any) {
        console.error('[Hook] Error adding parameter:', e);

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
    async (parameterId: string, dto: UpdateLikuiditasParameterDto) => {
      const context = validateAndGetCurrentContext();
      console.log('[Hook] handleUpdateParameter called:', { context, parameterId });

      safeSet(setIsLoading, true);
      safeSet(setError, null);

      try {
        const payload: UpdateLikuiditasParameterDto = {};

        if (dto.nomor !== undefined) payload.nomor = dto.nomor;
        if (dto.judul !== undefined) {
          const validation = validateParameterJudul(dto.judul);
          if (!validation.isValid) {
            throw new Error(validation.error);
          }
          payload.judul = likuiditasProdukService.formatParameterJudul(dto.judul);
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

          const formattedKategori = {
            model: cleanKategori.model,
            prinsip: cleanKategori.model !== 'tanpa_model' ? cleanKategori.prinsip : undefined,
            jenis: cleanKategori.model === 'standar' ? cleanKategori.jenis : undefined,
            underlying: cleanKategori.model === 'komprehensif' ? (Array.isArray(cleanKategori.underlying) ? cleanKategori.underlying : []) : [],
          };

          payload.kategori = formattedKategori;
        }
        if (dto.orderIndex !== undefined) payload.orderIndex = dto.orderIndex;

        const parameterIdNum = parseInt(parameterId, 10);
        if (isNaN(parameterIdNum)) {
          throw new Error(`Parameter ID tidak valid: ${parameterId}`);
        }

        console.log('[Hook] Update parameter payload:', JSON.stringify(payload, null, 2));

        await likuiditasProdukService.updateParameter(context.inherentId, parameterIdNum, payload);

        // Update cache untuk year-quarter ini
        await updateCacheAfterOperation(context.year, context.quarter);

        console.log(`[Hook] Parameter ${parameterId} updated successfully`);
        safeSet(setIsLoading, false);

        return true;
      } catch (e: any) {
        console.error('[Hook] Error updating parameter:', e);

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
      console.log(`[Hook] handleCopyParameter called: ${parameterId}`, context);

      safeSet(setIsLoading, true);
      safeSet(setError, null);

      try {
        const parameterIdNum = parseInt(parameterId, 10);
        if (isNaN(parameterIdNum)) {
          throw new Error(`Parameter ID tidak valid: ${parameterId}`);
        }

        await likuiditasProdukService.copyParameter(context.inherentId, parameterIdNum);

        // Update cache untuk year-quarter ini
        await updateCacheAfterOperation(context.year, context.quarter);

        console.log(`[Hook] Parameter ${parameterId} copied successfully`);
        safeSet(setIsLoading, false);

        return true;
      } catch (e: any) {
        console.error('[Hook] Error copying parameter:', e);
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
      console.log(`[Hook] handleDeleteParameter called: ${parameterId}`, context);

      safeSet(setIsLoading, true);
      safeSet(setError, null);

      try {
        const parameterIdNum = parseInt(parameterId, 10);
        if (isNaN(parameterIdNum)) {
          throw new Error(`Parameter ID tidak valid: ${parameterId}`);
        }

        await likuiditasProdukService.removeParameter(context.inherentId, parameterIdNum);

        // Update cache untuk year-quarter ini
        await updateCacheAfterOperation(context.year, context.quarter);

        console.log(`[Hook] Parameter ${parameterId} deleted successfully`);
        safeSet(setIsLoading, false);

        return true;
      } catch (e: any) {
        console.error('[Hook] Error deleting parameter:', e);
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
    async (parameterId: string, dto: CreateLikuiditasNilaiDto) => {
      const context = validateAndGetCurrentContext();
      console.log(`[Hook] handleAddNilai called:`, { context, parameterId });

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

        const payload: CreateLikuiditasNilaiDto = {
          ...dto,
          bobot: bobotValidation.value,
          judul: formatNilaiJudul(dto.judul),
        };

        console.log('[Hook] Add nilai payload:', payload);

        // Gunakan loadOrCreateData dari service untuk memastikan data ada
        await likuiditasProdukService.loadOrCreateData(context.year, context.quarter);

        // Tambahkan nilai
        await likuiditasProdukService.addNilai(context.inherentId, parameterIdNum, payload);

        // Update cache untuk year-quarter ini
        await updateCacheAfterOperation(context.year, context.quarter);

        console.log(`[Hook] Nilai added to parameter ${parameterId} successfully`);
        safeSet(setIsLoading, false);

        return true;
      } catch (e: any) {
        console.error('[Hook] Error adding nilai:', e);
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
    async (parameterId: string, nilaiId: string, dto: UpdateLikuiditasNilaiDto) => {
      const context = validateAndGetCurrentContext();
      console.log(`[Hook] handleUpdateNilai called:`, { context, parameterId, nilaiId });

      safeSet(setIsLoading, true);
      safeSet(setError, null);

      try {
        const parameterIdNum = parseInt(parameterId, 10);
        const nilaiIdNum = parseInt(nilaiId, 10);

        if (isNaN(parameterIdNum) || isNaN(nilaiIdNum)) {
          throw new Error(`ID tidak valid: parameterId=${parameterId}, nilaiId=${nilaiId}`);
        }

        const payload: UpdateLikuiditasNilaiDto = { ...dto };

        if (dto.judul !== undefined) {
          payload.judul = formatNilaiJudul(dto.judul);
        }

        if (dto.bobot !== undefined) {
          payload.bobot = formatBobot(dto.bobot);
        }

        console.log('[Hook] Update nilai payload:', payload);

        await likuiditasProdukService.updateNilai(context.inherentId, parameterIdNum, nilaiIdNum, payload);

        // Update cache untuk year-quarter ini
        await updateCacheAfterOperation(context.year, context.quarter);

        console.log(`[Hook] Nilai ${nilaiId} updated successfully`);
        safeSet(setIsLoading, false);

        return true;
      } catch (e: any) {
        console.error('[Hook] Error updating nilai:', e);
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
      console.log(`[Hook] handleCopyNilai called:`, { context, parameterId, nilaiId });

      safeSet(setIsLoading, true);
      safeSet(setError, null);

      try {
        const parameterIdNum = parseInt(parameterId, 10);
        const nilaiIdNum = parseInt(nilaiId, 10);

        if (isNaN(parameterIdNum) || isNaN(nilaiIdNum)) {
          throw new Error(`ID tidak valid: parameterId=${parameterId}, nilaiId=${nilaiId}`);
        }

        await likuiditasProdukService.copyNilai(context.inherentId, parameterIdNum, nilaiIdNum);

        // Update cache untuk year-quarter ini
        await updateCacheAfterOperation(context.year, context.quarter);

        console.log(`[Hook] Nilai ${nilaiId} copied successfully`);
        safeSet(setIsLoading, false);

        return true;
      } catch (e: any) {
        console.error('[Hook] Error copying nilai:', e);
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
      console.log(`[Hook] handleDeleteNilai called:`, { context, parameterId, nilaiId });

      safeSet(setIsLoading, true);
      safeSet(setError, null);

      try {
        const parameterIdNum = parseInt(parameterId, 10);
        const nilaiIdNum = parseInt(nilaiId, 10);

        if (isNaN(parameterIdNum) || isNaN(nilaiIdNum)) {
          throw new Error(`ID tidak valid: parameterId=${parameterId}, nilaiId=${nilaiId}`);
        }

        await likuiditasProdukService.removeNilai(context.inherentId, parameterIdNum, nilaiIdNum);

        // Update cache untuk year-quarter ini
        await updateCacheAfterOperation(context.year, context.quarter);

        console.log(`[Hook] Nilai ${nilaiId} deleted successfully`);
        safeSet(setIsLoading, false);

        return true;
      } catch (e: any) {
        console.error('[Hook] Error deleting nilai:', e);
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
      console.log(`[Hook] handleReorderParameters called:`, { context, parameterIds });

      safeSet(setIsLoading, true);
      safeSet(setError, null);

      try {
        const parameterIdsNum = parameterIds.map((id) => parseInt(id, 10)).filter((id) => !isNaN(id));

        if (parameterIdsNum.length !== parameterIds.length) {
          throw new Error('Beberapa ID parameter tidak valid');
        }

        await likuiditasProdukService.reorderParameters(context.inherentId, parameterIdsNum);

        // Update cache untuk year-quarter ini
        await updateCacheAfterOperation(context.year, context.quarter);

        console.log(`[Hook] Parameters reordered successfully`);
        safeSet(setIsLoading, false);

        return true;
      } catch (e: any) {
        console.error('[Hook] Error reordering parameters:', e);
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
      console.log(`[Hook] handleReorderNilai called:`, { context, parameterId, nilaiIds });

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

        await likuiditasProdukService.reorderNilai(context.inherentId, parameterIdNum, nilaiIdsNum);

        // Update cache untuk year-quarter ini
        await updateCacheAfterOperation(context.year, context.quarter);

        console.log(`[Hook] Nilai reordered successfully for parameter ${parameterId}`);
        safeSet(setIsLoading, false);

        return true;
      } catch (e: any) {
        console.error('[Hook] Error reordering nilai:', e);
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
        console.warn('[Hook] rows is not an array in getParameterById');
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

      console.log(`[Hook] Reloading data for ${targetYear}-Q${targetQuarter}`);

      // Clear cache untuk year-quarter ini
      clearCache(targetYear, targetQuarter);

      // Jika ini adalah period yang aktif, update state
      if (year === targetYear && quarter === targetQuarter) {
        safeSet(setRows, []);
        safeSet(setCurrentInherentId, null);
        safeSet(setCurrentInherentData, null);
        safeSet(setError, null);
        safeSet(setIsLoading, true);
      }

      return loadData(targetYear, targetQuarter, true);
    },
    [year, quarter, loadData, clearCache],
  );

  const reset = useCallback(() => {
    console.log('[Hook] Resetting hook state');

    safeSet(setRows, []);
    safeSet(setIsLoading, false);
    safeSet(setError, null);
    safeSet(setCurrentInherentId, null);
    safeSet(setCurrentInherentData, null);
    safeSet(setYear, null);
    safeSet(setQuarter, null);
    safeSet(setActivePeriodKey, '');

    clearCache();
    loadingQueueRef.current.clear();
  }, [clearCache]);

  const clearError = useCallback(() => {
    console.log('[Hook] Clearing error');
    safeSet(setError, null);
  }, []);

  const safeSetRows = useCallback((newRows: any) => {
    console.log('[Hook] Setting new rows:', {
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
        console.log(`[Hook] Auto-loading data for ${initialYear}-Q${initialQuarter}`);
        try {
          await loadData(initialYear, initialQuarter, true);
        } catch (error) {
          console.error('[Hook] Auto-load failed:', error);
          safeSet(setRows, []);
        }
      } else {
        console.log('[Hook] No initialYear/initialQuarter provided, skipping auto-load');
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
    currentInherentId,
    currentInherentData,
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
    handleUpdateParameter, // DITAMBAHKAN
    handleCopyParameter, // DITAMBAHKAN
    handleDeleteParameter, // DITAMBAHKAN

    // Nilai operations
    handleAddNilai, // DITAMBAHKAN
    handleUpdateNilai, // DITAMBAHKAN
    handleCopyNilai, // DITAMBAHKAN
    handleDeleteNilai, // DITAMBAHKAN

    // Reorder operations
    handleReorderParameters, // DITAMBAHKAN
    handleReorderNilai, // DITAMBAHKAN

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
    isReady: currentInherentId !== null && !isLoading,
    hasError: error !== null,

    // Debug info
    cacheSize: cacheRef.current.size,

    // New helper functions
    getOrCreateData,
  };
};

export default useLikuiditasProdukIntegration;
