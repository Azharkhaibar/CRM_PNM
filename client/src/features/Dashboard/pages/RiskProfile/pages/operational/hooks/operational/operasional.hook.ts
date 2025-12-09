// hooks/operasional/useOperasional.ts
import { useState, useCallback } from 'react';
// import {
//   Quarter,
//   operasionalService,
//   CreateIndikatorOperationalDto,
//   CreateSectionOperationalDto,
//   UpdateIndikatorOperationalDto,
//   UpdateSectionOperationalDto,
//   SectionOperational,
//   Operational,
// } from '../../services/operasional/operasional.service';
import {
  Quarter,
  operasionalService,
  CreateIndikatorOperationalDto,
  CreateSectionOperationalDto,
  UpdateIndikatorOperationalDto,
  UpdateSectionOperationalDto,
  SectionOperational,
  Operational,
} from '../../services/operational/operasional.service';
export const useOperasional = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllSections = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      return await operasionalService.getAllSections();
    } catch (err: any) {
      const errorMsg = operasionalService.handleError(err) || 'Gagal mengambil semua data sections';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ===================== SECTION OPERATIONS =====================
  const getSectionsByPeriod = useCallback(async (year: number, quarter: Quarter) => {
    setLoading(true);
    setError(null);

    try {
      return await operasionalService.getSectionsByPeriod(year, quarter);
    } catch (err: any) {
      const errorMsg = operasionalService.handleError(err) || 'Gagal mengambil data sections operasional';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSection = useCallback(async (sectionData: CreateSectionOperationalDto) => {
    setLoading(true);
    setError(null);

    try {
      return await operasionalService.createSection(sectionData);
    } catch (err: any) {
      const errorMsg = operasionalService.handleError(err) || 'Gagal membuat section operasional';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSection = useCallback(async (id: number, updateData: UpdateSectionOperationalDto) => {
    setLoading(true);
    setError(null);

    try {
      return await operasionalService.updateSection(id, updateData);
    } catch (err: any) {
      const errorMsg = operasionalService.handleError(err) || 'Gagal mengupdate section operasional';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSection = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await operasionalService.deleteSection(id);
      return true;
    } catch (err: any) {
      const errorMsg = operasionalService.handleError(err) || 'Gagal menghapus section operasional';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ===================== INDICATOR OPERATIONS =====================
  const createIndikator = useCallback(async (indikatorData: CreateIndikatorOperationalDto) => {
    setLoading(true);
    setError(null);

    try {
      // Hapus field yang dihitung otomatis sebelum kirim ke service
      const cleanData = { ...indikatorData } as any;

      // Field yang dihitung otomatis oleh backend
      delete cleanData.weighted;
      delete cleanData.hasil;

      console.log('📤 [OPERASIONAL HOOK] Clean indikator data for create:', cleanData);

      return await operasionalService.createIndikator(cleanData);
    } catch (err: any) {
      const errorMsg = operasionalService.handleError(err) || 'Gagal membuat indikator operasional';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateIndikator = useCallback(async (id: number, updateData: any) => {
    setLoading(true);
    setError(null);

    console.log('📤 [OPERASIONAL HOOK updateIndikator] RAW Data diterima:', { id, updateData });

    try {
      // Mapping field dari frontend ke backend dengan benar
      const mappedData: UpdateIndikatorOperationalDto = {
        // Field indikator
        indikator: updateData.indikator || '',

        // Field lainnya mapping dengan benar
        subNo: updateData.subNo || updateData.sub_no || null,
        bobotIndikator: parseFloat(updateData.bobotIndikator || updateData.bobot_indikator || 0),
        peringkat: parseInt(updateData.peringkat || 1),
        keterangan: updateData.keterangan || null,

        // Data perhitungan
        sumberRisiko: updateData.sumberRisiko || updateData.sumber_risiko || null,
        dampak: updateData.dampak || null,
        pembilangLabel: updateData.pembilangLabel || updateData.pembilang_label || null,
        pembilangValue: updateData.pembilangValue !== undefined && updateData.pembilangValue !== '' ? parseFloat(updateData.pembilangValue) : null,
        penyebutLabel: updateData.penyebutLabel || updateData.penyebut_label || null,
        penyebutValue: updateData.penyebutValue !== undefined && updateData.penyebutValue !== '' ? parseFloat(updateData.penyebutValue) : null,

        // Additional fields
        isPercent: Boolean(updateData.isPercent),
        mode: updateData.mode || 'RASIO',
        formula: updateData.formula || null,
        hasil: updateData.hasil !== undefined ? parseFloat(updateData.hasil) : undefined,
        weighted: updateData.weighted !== undefined ? parseFloat(updateData.weighted) : undefined,
      };

      console.log('📤 [OPERASIONAL HOOK updateIndikator] Mapped data untuk API:', mappedData);

      const response = await operasionalService.updateIndikator(id, mappedData);

      console.log('✅ [OPERASIONAL HOOK updateIndikator] Response dari service:', response);

      return response;
    } catch (err: any) {
      console.error('❌ [OPERASIONAL HOOK updateIndikator] Error detail:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config,
      });

      let errorMsg = 'Gagal mengupdate indikator operasional';

      if (err.response) {
        errorMsg = err.response.data?.message || err.response.data?.error || `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMsg = 'Tidak ada response dari server. Cek koneksi jaringan.';
      } else {
        errorMsg = err.message || 'Error konfigurasi request';
      }

      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteIndikator = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await operasionalService.deleteIndikator(id);
      return true;
    } catch (err: any) {
      const errorMsg = operasionalService.handleError(err) || 'Gagal menghapus indikator operasional';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ===================== SUMMARY OPERATIONS =====================
  const getSummaryByPeriod = useCallback(async (year: number, quarter: Quarter) => {
    setLoading(true);
    setError(null);

    try {
      return await operasionalService.getSummaryByPeriod(year, quarter);
    } catch (err: any) {
      const errorMsg = operasionalService.handleError(err) || 'Gagal mengambil summary operasional';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ===================== UTILITY FUNCTIONS =====================
  const getStructuredData = useCallback(async (year?: number, quarter?: Quarter) => {
    setLoading(true);
    setError(null);

    try {
      return await operasionalService.getOperationalStructured(year, quarter);
    } catch (err: any) {
      const errorMsg = operasionalService.handleError(err) || 'Gagal mengambil data terstruktur';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateHasil = useCallback((mode: string, pembilangValue: number | null, penyebutValue: number | null, formula?: string | null, isPercent?: boolean): number | null => {
    return operasionalService.calculateHasil(mode, pembilangValue, penyebutValue, formula, isPercent);
  }, []);

  const calculateWeighted = useCallback((bobotSection: number, bobotIndikator: number, peringkat: number): number => {
    return operasionalService.calculateWeighted(bobotSection, bobotIndikator, peringkat);
  }, []);

  const formatHasilDisplay = useCallback((hasil: number | null, isPercent: boolean, mode: string): string => {
    return operasionalService.formatHasilDisplay(hasil, isPercent, mode);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    loading,
    error,

    // Section Operations
    getAllSections,
    getSectionsByPeriod,
    createSection,
    updateSection,
    deleteSection,

    // Indicator Operations
    createIndikator,
    updateIndikator,
    deleteIndikator,

    // Summary Operations
    getSummaryByPeriod,
    getStructuredData,

    // Utility Functions
    calculateHasil,
    calculateWeighted,
    formatHasilDisplay,
    clearError,
  };
};

// Export custom hook
export default useOperasional;
