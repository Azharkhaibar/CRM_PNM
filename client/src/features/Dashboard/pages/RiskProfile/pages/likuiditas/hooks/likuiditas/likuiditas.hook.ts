import { useState, useCallback } from 'react';
import axios from 'axios';
import { Quarter, likuiditasService, CreateIndikatorLikuiditasDto, CreateSectionLikuiditasDto, UpdateIndikatorLikuiditasDto, UpdateSectionLikuiditasDto } from '../../service/likuiditas/likuiditas.service';

export const useLikuiditas = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ===================== SECTION OPERATIONS =====================
  const getSectionsByPeriod = useCallback(async (year: number, quarter: Quarter) => {
    setLoading(true);
    setError(null);

    try {
      // Gunakan service yang sudah ada
      return await likuiditasService.getSectionsByPeriod(year, quarter);
    } catch (err: any) {
      const errorMsg = likuiditasService.handleError(err) || 'Gagal mengambil data sections';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSection = useCallback(async (sectionData: CreateSectionLikuiditasDto) => {
    setLoading(true);
    setError(null);

    try {
      // Gunakan service yang sudah ada
      return await likuiditasService.createSection(sectionData);
    } catch (err: any) {
      const errorMsg = likuiditasService.handleError(err) || 'Gagal membuat section';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSection = useCallback(async (id: number, updateData: UpdateSectionLikuiditasDto) => {
    setLoading(true);
    setError(null);

    try {
      // Gunakan service yang sudah ada
      return await likuiditasService.updateSection(id, updateData);
    } catch (err: any) {
      const errorMsg = likuiditasService.handleError(err) || 'Gagal mengupdate section';
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
      // Gunakan service yang sudah ada
      await likuiditasService.deleteSection(id);
      return true;
    } catch (err: any) {
      const errorMsg = likuiditasService.handleError(err) || 'Gagal menghapus section';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ===================== INDICATOR OPERATIONS =====================
  const createIndikator = useCallback(async (indikatorData: CreateIndikatorLikuiditasDto) => {
    setLoading(true);
    setError(null);

    try {
      // **PERBAIKAN: Hapus field yang dihitung otomatis sebelum kirim ke service**
      const cleanData = { ...indikatorData } as any;

      // Field yang dihitung otomatis oleh backend
      delete cleanData.weighted;
      delete cleanData.hasil;

      console.log('📤 [HOOK] Clean indikator data for create:', cleanData);

      return await likuiditasService.createIndikator(cleanData);
    } catch (err: any) {
      const errorMsg = likuiditasService.handleError(err) || 'Gagal membuat indikator';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateIndikator = useCallback(async (id: number, updateData: any) => {
    setLoading(true);
    setError(null);

    console.log('📤 [HOOK updateIndikator] RAW Data diterima:', { id, updateData });

    try {
      // **PERBAIKAN: Mapping field dari frontend ke backend dengan benar**
      const mappedData: UpdateIndikatorLikuiditasDto = {
        // **PERBAIKAN 1: Field nama indikator harus 'namaIndikator'**
        namaIndikator: updateData.indikator || updateData.namaIndikator || '',

        // **PERBAIKAN 2: Field lainnya mapping dengan benar**
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

        // Thresholds
        low: updateData.low || null,
        lowToModerate: updateData.lowToModerate || updateData.low_to_moderate || null,
        moderate: updateData.moderate || null,
        moderateToHigh: updateData.moderateToHigh || updateData.moderate_to_high || null,
        high: updateData.high || null,

        // Additional fields
        isPercent: Boolean(updateData.isPercent),
        mode: updateData.mode || 'RASIO',
        formula: updateData.formula || null,
      };

      console.log('📤 [HOOK updateIndikator] Mapped data untuk API:', mappedData);

      // **PERBAIKAN 3: Jangan hapus field, biarkan backend yang handle**
      // Jangan delete cleanData.weighted, cleanData.hasil
      // Biarkan backend yang mengelola field calculated

      const response = await likuiditasService.updateIndikator(id, mappedData);

      console.log('✅ [HOOK updateIndikator] Response dari service:', response);

      return response;
    } catch (err: any) {
      console.error('❌ [HOOK updateIndikator] Error detail:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config,
      });

      let errorMsg = 'Gagal mengupdate indikator';

      // **PERBAIKAN 4: Error handling yang lebih baik**
      if (err.response) {
        // Server responded with error
        errorMsg = err.response.data?.message || err.response.data?.error || `Server error: ${err.response.status}`;
      } else if (err.request) {
        // Request dibuat tapi tidak ada response
        errorMsg = 'Tidak ada response dari server. Cek koneksi jaringan.';
      } else {
        // Error saat setup request
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
      await likuiditasService.deleteIndikator(id);
      return true;
    } catch (err: any) {
      const errorMsg = likuiditasService.handleError(err) || 'Gagal menghapus indikator';
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
      return await likuiditasService.getSummaryByPeriod(year, quarter);
    } catch (err: any) {
      const errorMsg = likuiditasService.handleError(err) || 'Gagal mengambil summary';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ===================== UTILITY FUNCTIONS =====================
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    loading,
    error,

    // Section Operations
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

    // Utility
    clearError,
  };
};
