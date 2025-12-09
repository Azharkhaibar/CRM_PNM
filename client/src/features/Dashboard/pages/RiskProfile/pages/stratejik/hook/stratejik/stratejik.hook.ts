// hooks/stratejik.hook.ts
import { useState, useCallback } from 'react';
import { stratejikService } from '../../service/stratejik/stratejik.services';
import {
  Stratejik,
  StratejikSection,
  CreateStratejikDto,
  CreateStratejikSectionDto,
  UpdateStratejikDto,
  UpdateStratejikSectionDto,
  Quarter,
  SectionWithIndicators, // TAMBAHKAN INI
} from '../../types/stratejik.types';

// Helper untuk validasi Quarter
const isValidQuarter = (quarter: string): quarter is Quarter => {
  return ['Q1', 'Q2', 'Q3', 'Q4'].includes(quarter);
};

export const useStrategik = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============ SECTION METHODS ============
  const getAllSections = useCallback(async (): Promise<StratejikSection[]> => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 [HOOK] Getting all sections...');
      const sections = await stratejikService.getSections();
      console.log('✅ [HOOK] All sections received:', sections.length);
      return sections;
    } catch (err: any) {
      console.error('❌ [HOOK] Error getting all sections:', err);
      const errorMessage = stratejikService.handleError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getSectionsByPeriod = useCallback(async (year: number, quarter: Quarter): Promise<SectionWithIndicators[]> => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 [HOOK] Getting sections by period...', { year, quarter });

      if (!year || !quarter) {
        throw new Error('Tahun dan quarter harus diisi');
      }

      // Validasi quarter
      if (!isValidQuarter(quarter)) {
        throw new Error('Quarter tidak valid. Gunakan Q1, Q2, Q3, atau Q4');
      }

      // Mengambil data stratejik berdasarkan periode
      const stratejikData = await stratejikService.getStratejikByPeriod(year, quarter);

      // Mengelompokkan data berdasarkan section
      const sectionsMap = new Map<number, SectionWithIndicators>();

      stratejikData.forEach((item) => {
        const sectionId = item.sectionId;

        if (!sectionsMap.has(sectionId)) {
          sectionsMap.set(sectionId, {
            id: sectionId,
            no: item.no || '',
            parameter: item.sectionLabel || '',
            bobotSection: item.bobotSection || 0,
            year: item.year,
            quarter: item.quarter,
            indicators: [],
          });
        }

        const section = sectionsMap.get(sectionId)!;
        section.indicators.push(item);
      });

      // Convert map to array dan sort by section no
      const sections = Array.from(sectionsMap.values()).sort((a, b) => {
        return a.no.localeCompare(b.no, undefined, { numeric: true });
      });

      console.log('✅ [HOOK] Sections by period received:', sections.length);
      return sections;
    } catch (err: any) {
      console.error('❌ [HOOK] Error getting sections by period:', err);
      const errorMessage = stratejikService.handleError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSection = useCallback(async (data: CreateStratejikSectionDto): Promise<StratejikSection> => {
    setLoading(true);
    setError(null);
    try {
      console.log('📤 [HOOK] Creating section:', data);

      // Validasi data section
      if (!data.no || !data.parameter) {
        throw new Error('No dan parameter section harus diisi');
      }

      console.log('✅ [HOOK] Data validated, sending to service...');
      const section = await stratejikService.createSection(data);
      console.log('✅ [HOOK] Section created:', section);
      return section;
    } catch (err: any) {
      console.error('❌ [HOOK] Error creating section:', err);
      const errorMessage = stratejikService.handleError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSection = useCallback(async (id: number, data: UpdateStratejikSectionDto): Promise<StratejikSection> => {
    setLoading(true);
    setError(null);
    try {
      console.log('📤 [HOOK] Updating section:', { id, data });
      const section = await stratejikService.updateSection(id, data);
      console.log('✅ [HOOK] Section updated:', section);
      return section;
    } catch (err: any) {
      console.error('❌ [HOOK] Error updating section:', err);
      const errorMessage = stratejikService.handleError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSection = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      console.log('🗑️ [HOOK] Deleting section:', id);
      await stratejikService.deleteSection(id);
      console.log('✅ [HOOK] Section deleted');
    } catch (err: any) {
      console.error('❌ [HOOK] Error deleting section:', err);
      const errorMessage = stratejikService.handleError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============ INDICATOR METHODS ============
  const createIndikator = useCallback(async (data: CreateStratejikDto): Promise<Stratejik> => {
    console.log('📤 [HOOK] Creating indicator with data:', data);

    setLoading(true);
    setError(null);
    try {
      // Validasi data wajib
      if (!data.sectionId) {
        throw new Error('Section ID harus diisi');
      }
      if (!data.year) {
        throw new Error('Tahun harus diisi');
      }
      if (!data.quarter || !isValidQuarter(data.quarter)) {
        throw new Error('Quarter harus diisi dengan nilai Q1, Q2, Q3, atau Q4');
      }
      if (!data.subNo) {
        throw new Error('Sub No harus diisi');
      }
      if (!data.indikator) {
        throw new Error('Indikator harus diisi');
      }

      console.log('✅ [HOOK] Data validated, sending to service...');
      const indikator = await stratejikService.createStratejik(data);
      console.log('✅ [HOOK] Indicator created successfully:', indikator);
      return indikator;
    } catch (err: any) {
      console.error('❌ [HOOK] Error creating indicator:', err);

      // Handle error dengan lebih baik
      let errorMessage = 'Gagal membuat indikator';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateIndikator = useCallback(async (id: number, data: UpdateStratejikDto): Promise<Stratejik> => {
    console.log('📤 [HOOK] Updating indicator:', { id, data });

    setLoading(true);
    setError(null);
    try {
      // Validasi data
      if (!data.indikator) {
        throw new Error('Nama indikator harus diisi');
      }

      console.log('✅ [HOOK] Sending update to service...');
      const indikator = await stratejikService.updateStratejik(id, data);
      console.log('✅ [HOOK] Indicator updated successfully:', indikator);
      return indikator;
    } catch (err: any) {
      console.error('❌ [HOOK] Error updating indicator:', err);

      let errorMessage = 'Gagal mengupdate indikator';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteIndikator = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      console.log('🗑️ [HOOK] Deleting indicator:', id);
      await stratejikService.deleteStratejik(id);
      console.log('✅ [HOOK] Indicator deleted');
    } catch (err: any) {
      console.error('❌ [HOOK] Error deleting indicator:', err);
      const errorMessage = stratejikService.handleError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper untuk transform data dari frontend ke backend
  const transformIndicatorToBackend = useCallback((indicatorData: any, year: number, quarter: Quarter, sectionId: number, sectionData: any): CreateStratejikDto => {
    console.log('🔄 [HOOK] Transforming indicator data:', { indicatorData, year, quarter, sectionId, sectionData });

    // Pastikan quarter valid
    if (!isValidQuarter(quarter)) {
      throw new Error(`Quarter tidak valid: ${quarter}`);
    }

    const safeTrim = (value: any) => {
      if (value === undefined || value === null || value === '') {
        return null;
      }
      const trimmed = String(value).trim();
      return trimmed === '' ? null : trimmed;
    };

    const safeNumber = (value: any) => {
      if (value === undefined || value === null || value === '') {
        return null;
      }
      const num = Number(value);
      return isNaN(num) ? null : num;
    };

    // Format data menggunakan service
    const formattedData = stratejikService.formatStratejikData(
      {
        ...indicatorData,
        year: Number(year),
        quarter: quarter,
        sectionId: sectionId,
        no: sectionData?.no || '',
        sectionLabel: sectionData?.parameter || '',
        bobotSection: sectionData?.bobotSection || 0,
      },
      {
        id: sectionId,
        no: sectionData?.no || '',
        bobotSection: sectionData?.bobotSection || 0,
        parameter: sectionData?.parameter || '',
      } as StratejikSection
    );

    console.log('✅ [HOOK] Transformed data:', formattedData);
    return formattedData;
  }, []);

  return {
    loading,
    error,

    // Section methods
    getAllSections,
    getSectionsByPeriod,
    createSection,
    updateSection,
    deleteSection,

    // Indicator methods
    createIndikator,
    updateIndikator,
    deleteIndikator,

    // Helper methods
    transformIndicatorToBackend,

    // Utility
    clearError: () => setError(null),
  };
};
