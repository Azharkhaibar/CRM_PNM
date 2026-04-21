// src/ojk/permodalan-produk/hooks/inherent/permodalan.hook.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '../../components/use-toast';
import permodalanService from '../../services/inherent/permodalan.service';
import { PermodalanOjkEntity, ParameterEntity, NilaiEntity, CreateParameterDto, UpdateParameterDto, CreateNilaiDto, UpdateNilaiDto } from '../../services/inherent/permodalan.service';

interface UsePermodalanInherentReturn {
  // State
  permodalan: PermodalanOjkEntity | null;
  parameters: ParameterEntity[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  currentPermodalanId: number | null;

  // Data operations
  loadByYearQuarter: (year: number, quarter: number) => Promise<void>;
  refreshData: () => Promise<ParameterEntity[]>;
  createPermodalan: (year: number, quarter: number) => Promise<PermodalanOjkEntity | null>;

  // Parameter operations
  addParameter: (permodalanId: number, parameterData: CreateParameterDto) => Promise<ParameterEntity>;
  updateParameter: (parameterId: number, parameterData: UpdateParameterDto) => Promise<ParameterEntity>;
  deleteParameter: (parameterId: number) => Promise<void>;
  copyParameter: (permodalanId: number, parameterId: number) => Promise<void>;
  reorderParameters: (permodalanId: number, parameterIds: number[]) => Promise<void>;

  // Nilai operations
  addNilai: (permodalanId: number, parameterId: number, nilaiData: CreateNilaiDto) => Promise<NilaiEntity>;
  updateNilai: (nilaiId: number, nilaiData: UpdateNilaiDto) => Promise<NilaiEntity>;
  deleteNilai: (nilaiId: number) => Promise<void>;
  copyNilai: (permodalanId: number, parameterId: number, nilaiId: number) => Promise<void>;
  reorderNilai: (permodalanId: number, parameterId: number, nilaiIds: number[]) => Promise<void>;

  // Utility
  getParametersByPermodalanId: (permodalanId: number) => ParameterEntity[];
  getNilaiByParameterId: (parameterId: number) => NilaiEntity[];

  // Status
  hasData: boolean;
  isReady: boolean;
  hasError: boolean;
}

export function usePermodalanInherent(): UsePermodalanInherentReturn {
  const { toast } = useToast();

  const [permodalan, setPermodalan] = useState<PermodalanOjkEntity | null>(null);
  const [parameters, setParameters] = useState<ParameterEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPermodalanId, setCurrentPermodalanId] = useState<number | null>(null);

  const loadingRef = useRef(false);
  const mountedRef = useRef(true);
  const lastLoadedYearRef = useRef<{ year: number; quarter: number } | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      loadingRef.current = false;
    };
  }, []);

  const safeSet = <T,>(setter: (v: T) => void, value: T) => {
    if (mountedRef.current) setter(value);
  };

  // ========== LOAD DATA ==========
  const loadByYearQuarter = useCallback(
    async (targetYear: number, targetQuarter: number) => {
      if (lastLoadedYearRef.current?.year === targetYear && lastLoadedYearRef.current?.quarter === targetQuarter && permodalan !== null) {
        console.log(`✅ [Hook] Data inherent untuk ${targetYear} Q${targetQuarter} sudah dimuat`);
        return;
      }

      if (loadingRef.current) {
        console.log('⏳ [Hook] Loading already in progress...');
        return;
      }

      loadingRef.current = true;
      safeSet(setLoading, true);
      safeSet(setError, null);

      try {
        console.log(`📥 [Hook] Loading inherent data for ${targetYear} Q${targetQuarter}`);

        const data = await permodalanService.loadOrCreate(targetYear, targetQuarter);

        if (!mountedRef.current) return;

        safeSet(setPermodalan, data);
        safeSet(setCurrentPermodalanId, data.id);

        const params = Array.isArray(data.parameters) ? data.parameters : [];
        safeSet(setParameters, params);

        lastLoadedYearRef.current = { year: targetYear, quarter: targetQuarter };

        console.log(`✅ [Hook] Loaded ${params.length} parameters`);
      } catch (err: any) {
        if (!mountedRef.current) return;

        const errorMsg = err.message || 'Gagal memuat data inherent';
        safeSet(setError, errorMsg);
        toast({
          title: 'Error',
          description: errorMsg,
          variant: 'destructive',
        });
      } finally {
        loadingRef.current = false;
        safeSet(setLoading, false);
      }
    },
    [toast, permodalan],
  );

  // ========== CREATE PERMODALAN ==========
  const createPermodalan = useCallback(
    async (year: number, quarter: number): Promise<PermodalanOjkEntity | null> => {
      if (loadingRef.current) {
        console.log('⏳ [Hook] Create already in progress...');
        return null;
      }

      loadingRef.current = true;
      safeSet(setSaving, true);
      safeSet(setError, null);

      try {
        const yearNum = Number(year);
        const quarterNum = Number(quarter);

        if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
          throw new Error(`Tahun tidak valid: ${year}`);
        }

        if (isNaN(quarterNum) || quarterNum < 1 || quarterNum > 4) {
          throw new Error(`Quarter tidak valid: ${quarter}`);
        }

        const payload = {
          year: yearNum,
          quarter: quarterNum,
          isActive: true,
          version: '1.0.0',
          createdBy: 'system',
        };

        console.log('📦 [Hook] Creating inherent data:', payload);

        const data = await permodalanService.create(payload);

        if (!mountedRef.current) return null;

        if (!data || !data.id) {
          throw new Error('Data tidak valid setelah dibuat');
        }

        safeSet(setPermodalan, data);
        safeSet(setCurrentPermodalanId, data.id);

        const params = Array.isArray(data.parameters) ? data.parameters : [];
        safeSet(setParameters, params);

        lastLoadedYearRef.current = { year: yearNum, quarter: quarterNum };

        toast({
          title: 'Berhasil',
          description: `Data inherent untuk tahun ${yearNum} Q${quarterNum} berhasil dibuat`,
        });

        return data;
      } catch (err: any) {
        if (!mountedRef.current) return null;

        const errorMsg = err.message || 'Gagal membuat data inherent';
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

  // ========== REFRESH DATA ==========
  const refreshData = useCallback(async (): Promise<ParameterEntity[]> => {
    if (!permodalan?.id) return [];

    if (loadingRef.current) {
      console.log('⏳ [Hook] Refresh already in progress...');
      return parameters;
    }

    loadingRef.current = true;
    safeSet(setLoading, true);

    try {
      const freshData = await permodalanService.getById(permodalan.id);

      if (!mountedRef.current) return [];

      safeSet(setPermodalan, freshData);

      const params = Array.isArray(freshData.parameters) ? freshData.parameters : [];
      safeSet(setParameters, params);

      return params;
    } catch (error: any) {
      if (mountedRef.current) {
        toast({
          title: 'Error',
          description: error.message || 'Gagal memperbarui data',
          variant: 'destructive',
        });
      }
      return parameters;
    } finally {
      loadingRef.current = false;
      safeSet(setLoading, false);
    }
  }, [permodalan?.id, parameters, toast]);

  // ========== PARAMETER OPERATIONS ==========
  const addParameter = useCallback(
    async (permodalanId: number, parameterData: CreateParameterDto): Promise<ParameterEntity> => {
      if (saving) throw new Error('Already saving');

      safeSet(setSaving, true);
      safeSet(setError, null);

      try {
        if (!permodalanId) throw new Error('ID Permodalan tidak boleh kosong');
        if (!parameterData.judul?.trim()) throw new Error('Judul parameter tidak boleh kosong');

        const bobotNum = Number(parameterData.bobot);
        if (isNaN(bobotNum) || bobotNum < 0 || bobotNum > 100) {
          throw new Error('Bobot harus antara 0 dan 100');
        }

        const payload: CreateParameterDto = {
          nomor: parameterData.nomor || '',
          judul: parameterData.judul.trim(),
          bobot: bobotNum,
          kategori: parameterData.kategori || {},
          orderIndex: parameterData.orderIndex || 0,
        };

        console.log('📦 [Hook] Adding parameter:', payload);

        const updatedPermodalan = await permodalanService.addParameter(permodalanId, payload);

        if (!mountedRef.current) throw new Error('Component unmounted');

        safeSet(setPermodalan, updatedPermodalan);

        const params = Array.isArray(updatedPermodalan.parameters) ? updatedPermodalan.parameters : [];
        safeSet(setParameters, params);

        const newParameter = params.find((p) => p.judul === payload.judul && p.bobot === payload.bobot);

        toast({
          title: 'Berhasil',
          description: 'Parameter berhasil ditambahkan',
        });

        return newParameter || params[params.length - 1];
      } catch (err: any) {
        const errorMsg = err.message || 'Gagal menambahkan parameter';
        safeSet(setError, errorMsg);
        toast({
          title: 'Error',
          description: errorMsg,
          variant: 'destructive',
        });
        throw err;
      } finally {
        safeSet(setSaving, false);
      }
    },
    [saving, toast],
  );

  const updateParameter = useCallback(
    async (parameterId: number, parameterData: UpdateParameterDto): Promise<ParameterEntity> => {
      if (saving) throw new Error('Already saving');
      if (!permodalan?.id) throw new Error('Tidak ada data permodalan yang dipilih');

      safeSet(setSaving, true);
      safeSet(setError, null);

      try {
        if (parameterData.judul !== undefined && !parameterData.judul.trim()) {
          throw new Error('Judul parameter tidak boleh kosong');
        }

        if (parameterData.bobot !== undefined) {
          const bobotNum = Number(parameterData.bobot);
          if (isNaN(bobotNum) || bobotNum < 0 || bobotNum > 100) {
            throw new Error('Bobot harus antara 0 dan 100');
          }
          parameterData.bobot = bobotNum;
        }

        const updatedPermodalan = await permodalanService.updateParameter(permodalan.id, parameterId, parameterData);

        if (!mountedRef.current) throw new Error('Component unmounted');

        safeSet(setPermodalan, updatedPermodalan);

        const params = Array.isArray(updatedPermodalan.parameters) ? updatedPermodalan.parameters : [];
        safeSet(setParameters, params);

        const updatedParameter = params.find((p) => p.id === parameterId);
        if (!updatedParameter) throw new Error('Parameter tidak ditemukan setelah update');

        toast({
          title: 'Berhasil',
          description: 'Parameter berhasil diperbarui',
        });

        return updatedParameter;
      } catch (err: any) {
        const errorMsg = err.message || 'Gagal mengupdate parameter';
        safeSet(setError, errorMsg);
        toast({
          title: 'Error',
          description: errorMsg,
          variant: 'destructive',
        });
        throw err;
      } finally {
        safeSet(setSaving, false);
      }
    },
    [saving, permodalan?.id, toast],
  );

  const deleteParameter = useCallback(
    async (parameterId: number): Promise<void> => {
      if (!window.confirm('Hapus parameter ini? Semua nilai di dalamnya juga akan terhapus.')) return;
      if (saving) throw new Error('Already saving');
      if (!permodalan?.id) throw new Error('Tidak ada data permodalan yang dipilih');

      safeSet(setSaving, true);
      safeSet(setError, null);

      try {
        const updatedPermodalan = await permodalanService.removeParameter(permodalan.id, parameterId);

        if (!mountedRef.current) return;

        safeSet(setPermodalan, updatedPermodalan);

        const params = Array.isArray(updatedPermodalan.parameters) ? updatedPermodalan.parameters : [];
        safeSet(setParameters, params);

        toast({
          title: 'Berhasil',
          description: 'Parameter berhasil dihapus',
        });
      } catch (err: any) {
        const errorMsg = err.message || 'Gagal menghapus parameter';
        safeSet(setError, errorMsg);
        toast({
          title: 'Error',
          description: errorMsg,
          variant: 'destructive',
        });
        throw err;
      } finally {
        safeSet(setSaving, false);
      }
    },
    [saving, permodalan?.id, toast],
  );

  const copyParameter = useCallback(
    async (permodalanId: number, parameterId: number): Promise<void> => {
      if (saving) throw new Error('Already saving');

      safeSet(setSaving, true);
      safeSet(setError, null);

      try {
        const updatedPermodalan = await permodalanService.copyParameter(permodalanId, parameterId);

        if (!mountedRef.current) return;

        safeSet(setPermodalan, updatedPermodalan);

        const params = Array.isArray(updatedPermodalan.parameters) ? updatedPermodalan.parameters : [];
        safeSet(setParameters, params);

        toast({
          title: 'Berhasil',
          description: 'Parameter berhasil disalin',
        });
      } catch (err: any) {
        const errorMsg = err.message || 'Gagal menyalin parameter';
        safeSet(setError, errorMsg);
        toast({
          title: 'Error',
          description: errorMsg,
          variant: 'destructive',
        });
        throw err;
      } finally {
        safeSet(setSaving, false);
      }
    },
    [saving, toast],
  );

  const reorderParameters = useCallback(
    async (permodalanId: number, parameterIds: number[]): Promise<void> => {
      if (saving) throw new Error('Already saving');

      safeSet(setSaving, true);
      safeSet(setError, null);

      try {
        await permodalanService.reorderParameters(permodalanId, parameterIds);

        await refreshData();

        toast({
          title: 'Berhasil',
          description: 'Urutan parameter berhasil diubah',
        });
      } catch (err: any) {
        const errorMsg = err.message || 'Gagal mengubah urutan parameter';
        safeSet(setError, errorMsg);
        toast({
          title: 'Error',
          description: errorMsg,
          variant: 'destructive',
        });
        throw err;
      } finally {
        safeSet(setSaving, false);
      }
    },
    [saving, refreshData, toast],
  );

  // ========== NILAI OPERATIONS ==========
  const addNilai = useCallback(
    async (permodalanId: number, parameterId: number, nilaiData: CreateNilaiDto): Promise<NilaiEntity> => {
      if (saving) throw new Error('Already saving');

      safeSet(setSaving, true);
      safeSet(setError, null);

      try {
        const bobotNum = Number(nilaiData.bobot);
        if (isNaN(bobotNum) || bobotNum < 0 || bobotNum > 100) {
          throw new Error('Bobot harus antara 0 dan 100');
        }

        const payload: CreateNilaiDto = {
          nomor: nilaiData.nomor || '',
          judul: nilaiData.judul || { text: '' },
          bobot: bobotNum,
          portofolio: nilaiData.portofolio || '',
          keterangan: nilaiData.keterangan || '',
          riskindikator: nilaiData.riskindikator || {},
          orderIndex: nilaiData.orderIndex || 0,
        };

        const updatedPermodalan = await permodalanService.addNilai(permodalanId, parameterId, payload);

        if (!mountedRef.current) throw new Error('Component unmounted');

        safeSet(setPermodalan, updatedPermodalan);

        const params = Array.isArray(updatedPermodalan.parameters) ? updatedPermodalan.parameters : [];
        safeSet(setParameters, params);

        const updatedParameter = params.find((p) => p.id === parameterId);
        const newNilai = updatedParameter?.nilaiList?.slice(-1)[0];

        toast({
          title: 'Berhasil',
          description: 'Nilai berhasil ditambahkan',
        });

        return newNilai || ({ id: 0 } as NilaiEntity);
      } catch (err: any) {
        const errorMsg = err.message || 'Gagal menambahkan nilai';
        safeSet(setError, errorMsg);
        toast({
          title: 'Error',
          description: errorMsg,
          variant: 'destructive',
        });
        throw err;
      } finally {
        safeSet(setSaving, false);
      }
    },
    [saving, toast],
  );

  const updateNilai = useCallback(
    async (nilaiId: number, nilaiData: UpdateNilaiDto): Promise<NilaiEntity> => {
      if (saving) throw new Error('Already saving');
      if (!permodalan?.id) throw new Error('Tidak ada data permodalan yang dipilih');

      safeSet(setSaving, true);
      safeSet(setError, null);

      try {
        if (nilaiData.bobot !== undefined) {
          const bobotNum = Number(nilaiData.bobot);
          if (isNaN(bobotNum) || bobotNum < 0 || bobotNum > 100) {
            throw new Error('Bobot harus antara 0 dan 100');
          }
          nilaiData.bobot = bobotNum;
        }

        let targetParameterId: number | null = null;
        for (const param of parameters) {
          if (param.nilaiList?.some((n) => n.id === nilaiId)) {
            targetParameterId = param.id;
            break;
          }
        }

        if (!targetParameterId) {
          throw new Error(`Nilai dengan ID ${nilaiId} tidak ditemukan`);
        }

        const updatedPermodalan = await permodalanService.updateNilai(permodalan.id, targetParameterId, nilaiId, nilaiData);

        if (!mountedRef.current) throw new Error('Component unmounted');

        safeSet(setPermodalan, updatedPermodalan);

        const params = Array.isArray(updatedPermodalan.parameters) ? updatedPermodalan.parameters : [];
        safeSet(setParameters, params);

        const updatedParameter = params.find((p) => p.id === targetParameterId);
        const updatedNilai = updatedParameter?.nilaiList?.find((n) => n.id === nilaiId);

        if (!updatedNilai) throw new Error('Nilai tidak ditemukan setelah update');

        toast({
          title: 'Berhasil',
          description: 'Nilai berhasil diperbarui',
        });

        return updatedNilai;
      } catch (err: any) {
        const errorMsg = err.message || 'Gagal mengupdate nilai';
        safeSet(setError, errorMsg);
        toast({
          title: 'Error',
          description: errorMsg,
          variant: 'destructive',
        });
        throw err;
      } finally {
        safeSet(setSaving, false);
      }
    },
    [saving, permodalan?.id, parameters, toast],
  );

  const deleteNilai = useCallback(
    async (nilaiId: number): Promise<void> => {
      if (!window.confirm('Hapus nilai ini?')) return;
      if (saving) throw new Error('Already saving');
      if (!permodalan?.id) throw new Error('Tidak ada data permodalan yang dipilih');

      safeSet(setSaving, true);
      safeSet(setError, null);

      try {
        let targetParameterId: number | null = null;
        for (const param of parameters) {
          if (param.nilaiList?.some((n) => n.id === nilaiId)) {
            targetParameterId = param.id;
            break;
          }
        }

        if (!targetParameterId) {
          throw new Error(`Nilai dengan ID ${nilaiId} tidak ditemukan`);
        }

        const updatedPermodalan = await permodalanService.removeNilai(permodalan.id, targetParameterId, nilaiId);

        if (!mountedRef.current) return;

        safeSet(setPermodalan, updatedPermodalan);

        const params = Array.isArray(updatedPermodalan.parameters) ? updatedPermodalan.parameters : [];
        safeSet(setParameters, params);

        toast({
          title: 'Berhasil',
          description: 'Nilai berhasil dihapus',
        });
      } catch (err: any) {
        const errorMsg = err.message || 'Gagal menghapus nilai';
        safeSet(setError, errorMsg);
        toast({
          title: 'Error',
          description: errorMsg,
          variant: 'destructive',
        });
        throw err;
      } finally {
        safeSet(setSaving, false);
      }
    },
    [saving, permodalan?.id, parameters, toast],
  );

  const copyNilai = useCallback(
    async (permodalanId: number, parameterId: number, nilaiId: number): Promise<void> => {
      if (saving) throw new Error('Already saving');

      safeSet(setSaving, true);
      safeSet(setError, null);

      try {
        const updatedPermodalan = await permodalanService.copyNilai(permodalanId, parameterId, nilaiId);

        if (!mountedRef.current) return;

        safeSet(setPermodalan, updatedPermodalan);

        const params = Array.isArray(updatedPermodalan.parameters) ? updatedPermodalan.parameters : [];
        safeSet(setParameters, params);

        toast({
          title: 'Berhasil',
          description: 'Nilai berhasil disalin',
        });
      } catch (err: any) {
        const errorMsg = err.message || 'Gagal menyalin nilai';
        safeSet(setError, errorMsg);
        toast({
          title: 'Error',
          description: errorMsg,
          variant: 'destructive',
        });
        throw err;
      } finally {
        safeSet(setSaving, false);
      }
    },
    [saving, toast],
  );

  const reorderNilai = useCallback(
    async (permodalanId: number, parameterId: number, nilaiIds: number[]): Promise<void> => {
      if (saving) throw new Error('Already saving');

      safeSet(setSaving, true);
      safeSet(setError, null);

      try {
        await permodalanService.reorderNilai(permodalanId, parameterId, nilaiIds);

        await refreshData();

        toast({
          title: 'Berhasil',
          description: 'Urutan nilai berhasil diubah',
        });
      } catch (err: any) {
        const errorMsg = err.message || 'Gagal mengubah urutan nilai';
        safeSet(setError, errorMsg);
        toast({
          title: 'Error',
          description: errorMsg,
          variant: 'destructive',
        });
        throw err;
      } finally {
        safeSet(setSaving, false);
      }
    },
    [saving, refreshData, toast],
  );

  // ========== UTILITY ==========
  const getParametersByPermodalanId = useCallback(
    (permodalanId: number): ParameterEntity[] => {
      if (permodalan?.id === permodalanId) {
        return parameters;
      }
      return [];
    },
    [permodalan?.id, parameters],
  );

  const getNilaiByParameterId = useCallback(
    (parameterId: number): NilaiEntity[] => {
      const parameter = parameters.find((p) => p.id === parameterId);
      return parameter?.nilaiList || [];
    },
    [parameters],
  );

  return {
    permodalan,
    parameters,
    loading,
    saving,
    error,
    currentPermodalanId,

    loadByYearQuarter,
    refreshData,
    createPermodalan,

    addParameter,
    updateParameter,
    deleteParameter,
    copyParameter,
    reorderParameters,

    addNilai,
    updateNilai,
    deleteNilai,
    copyNilai,
    reorderNilai,

    getParametersByPermodalanId,
    getNilaiByParameterId,

    hasData: parameters.length > 0 && permodalan !== null,
    isReady: !loading && !saving && permodalan !== null,
    hasError: error !== null,
  };
}

export default usePermodalanInherent;

