// src/hooks/hukum/hukum.hook.ts
import { useState, useCallback, useEffect } from 'react';
import { hukumService } from '../../service/hukum/hukum.service';
import { Hukum, HukumSection, CreateHukumDto, CreateHukumSectionDto, UpdateHukumDto, UpdateHukumSectionDto, Quarter, HukumSummary, StructuredHukum } from '../../types/hukum.types';

export const useHukum = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ========== SECTION METHODS ==========
  const getSections = useCallback(async (): Promise<HukumSection[]> => {
    setLoading(true);
    setError(null);
    try {
      const sections = await hukumService.getSections();

      // Debug
      console.log('📊 Sections from service:', sections);

      // Jika kosong, return empty array
      if (!sections || sections.length === 0) {
        console.log('📭 No sections found in database');
        return [];
      }

      // Filter yang tidak di-delete
      const activeSections = sections.filter((section) => !section.isDeleted);

      console.log(`✅ Found ${activeSections.length} active sections`);
      return activeSections;
    } catch (err: any) {
      const errorMessage = hukumService.handleError(err);
      console.error('❌ Error in getSections hook:', errorMessage);

      // Return empty, JANGAN default
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createSection = useCallback(async (data: CreateHukumSectionDto): Promise<HukumSection> => {
    setLoading(true);
    setError(null);
    try {
      const section = await hukumService.createSection(data);
      return section;
    } catch (err: any) {
      const errorMessage = hukumService.handleError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSection = useCallback(async (id: number, data: UpdateHukumSectionDto): Promise<HukumSection> => {
    setLoading(true);
    setError(null);
    try {
      const section = await hukumService.updateSection(id, data);
      return section;
    } catch (err: any) {
      const errorMessage = hukumService.handleError(err);
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
      await hukumService.deleteSection(id);
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal menghapus section';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getSectionById = useCallback(async (id: number): Promise<HukumSection | null> => {
    setLoading(true);
    setError(null);
    try {
      return await hukumService.getSectionById(id);
    } catch (err: any) {
      const errorMessage = hukumService.handleError(err);
      console.warn(`Error fetching hukum section ${id}:`, errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== HUKUM METHODS ==========
  const getHukum = useCallback(async (year?: number, quarter?: Quarter): Promise<Hukum[]> => {
    setLoading(true);
    setError(null);
    try {
      return await hukumService.getHukum(year, quarter);
    } catch (err: any) {
      const errorMessage = hukumService.handleError(err);
      console.warn('Error fetching hukum:', errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getHukumByPeriod = useCallback(async (year: number, quarter: Quarter): Promise<Hukum[]> => {
    setLoading(true);
    setError(null);
    try {
      return await hukumService.getHukumByPeriod(year, quarter);
    } catch (err: any) {
      const errorMessage = hukumService.handleError(err);
      console.warn(`Error fetching hukum for ${year} ${quarter}:`, errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getHukumBySection = useCallback(async (sectionId: number, year?: number, quarter?: Quarter): Promise<Hukum[]> => {
    setLoading(true);
    setError(null);
    try {
      return await hukumService.getHukumBySection(sectionId, year, quarter);
    } catch (err: any) {
      const errorMessage = hukumService.handleError(err);
      console.warn(`Error fetching hukum for section ${sectionId}:`, errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getHukumStructured = useCallback(async (year?: number, quarter?: Quarter): Promise<StructuredHukum[]> => {
    setLoading(true);
    setError(null);
    try {
      return await hukumService.getHukumStructured(year, quarter);
    } catch (err: any) {
      const errorMessage = hukumService.handleError(err);
      console.warn('Error getting structured hukum:', errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getHukumSummary = useCallback(async (year: number, quarter: Quarter): Promise<HukumSummary | null> => {
    setLoading(true);
    setError(null);
    try {
      return await hukumService.getHukumSummary(year, quarter);
    } catch (err: any) {
      const errorMessage = hukumService.handleError(err);
      console.warn(`Error fetching summary for ${year} ${quarter}:`, errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getHukumById = useCallback(async (id: number): Promise<Hukum | null> => {
    setLoading(true);
    setError(null);
    try {
      return await hukumService.getHukumById(id);
    } catch (err: any) {
      const errorMessage = hukumService.handleError(err);
      console.warn(`Error fetching hukum ${id}:`, errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createHukum = useCallback(async (data: CreateHukumDto): Promise<Hukum> => {
    setLoading(true);
    setError(null);
    try {
      return await hukumService.createHukum(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal membuat indikator';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateHukum = useCallback(async (id: number, data: UpdateHukumDto): Promise<Hukum> => {
    setLoading(true);
    setError(null);
    try {
      return await hukumService.updateHukum(id, data);
    } catch (err: any) {
      const errorMessage = hukumService.handleError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteHukum = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await hukumService.deleteHukum(id);
    } catch (err: any) {
      const errorMessage = hukumService.handleError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteByPeriod = useCallback(async (year: number, quarter: Quarter): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await hukumService.deleteByPeriod(year, quarter);
    } catch (err: any) {
      const errorMessage = hukumService.handleError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper untuk save data dari frontend form
  const saveHukumData = useCallback(async (year: number, quarter: Quarter, sections: any[]): Promise<Hukum[]> => {
    setLoading(true);
    setError(null);
    try {
      if (!sections || sections.length === 0) {
        throw new Error('Tidak ada data untuk disimpan');
      }

      const results: Hukum[] = [];

      for (const section of sections) {
        const sectionId = parseInt(section.id.replace('s-', ''));

        for (const indicator of section.indicators) {
          const hukumItem: CreateHukumDto = {
            year,
            quarter,
            sectionId: sectionId,
            subNo: indicator.subNo,
            indikator: indicator.indikator,
            bobotIndikator: indicator.bobotIndikator || 0,
            sumberRisiko: indicator.sumberRisiko || null,
            dampak: indicator.dampak || null,
            low: indicator.low || null,
            lowToModerate: indicator.lowToModerate || null,
            moderate: indicator.moderate || null,
            moderateToHigh: indicator.moderateToHigh || null,
            high: indicator.high || null,
            mode: indicator.mode || 'RASIO',
            pembilangLabel: indicator.pembilangLabel || null,
            pembilangValue: indicator.pembilangValue || null,
            penyebutLabel: indicator.penyebutLabel || null,
            penyebutValue: indicator.penyebutValue || null,
            formula: indicator.formula || null,
            isPercent: indicator.isPercent || false,
            hasil: indicator.hasil || null,
            hasilText: indicator.hasilText || null,
            peringkat: indicator.peringkat || 1,
            weighted: indicator.weighted || 0,
            keterangan: indicator.keterangan || null,
          };

          try {
            const result = await hukumService.createHukum(hukumItem);
            results.push(result);
          } catch (error: any) {
            console.error(`Gagal menyimpan indikator ${indicator.subNo}:`, error);
          }
        }
      }

      return results;
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal menyimpan data';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    loading,
    error,

    // Section methods
    getSections,
    createSection,
    updateSection,
    deleteSection,
    getSectionById,

    // Hukum methods
    getHukum,
    getHukumByPeriod,
    getHukumBySection,
    getHukumStructured,
    getHukumSummary,
    getHukumById,
    createHukum,
    updateHukum,
    deleteHukum,
    deleteByPeriod,
    saveHukumData,

    // Utility
    clearError,
  };
};

// Hook untuk data management yang lebih sederhana
export const useHukumData = (year?: number, quarter?: Quarter) => {
  const [data, setData] = useState<{
    hukum: Hukum[];
    sections: HukumSection[];
    summary: HukumSummary | null;
    structured: StructuredHukum[];
  }>({
    hukum: [],
    sections: [],
    summary: null,
    structured: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!year || !quarter) return;

    setLoading(true);
    setError(null);
    try {
      const [sectionsResult, hukumResult, summaryResult] = await Promise.allSettled([hukumService.getSections(), hukumService.getHukumByPeriod(year, quarter), hukumService.getHukumSummary(year, quarter)]);

      let sections: HukumSection[] = [];
      if (sectionsResult.status === 'fulfilled') {
        sections = sectionsResult.value;
        console.log('📊 Sections loaded:', sections.length);
      } else {
        console.warn('Failed to load hukum sections:', sectionsResult.reason);
        sections = []; // ← EMPTY, bukan default
      }

      let hukum: Hukum[] = [];
      if (hukumResult.status === 'fulfilled') {
        hukum = hukumResult.value;
      } else {
        console.warn(`Failed to load hukum for ${year} ${quarter}:`, hukumResult.reason);
      }

      let summary: HukumSummary | null = null;
      if (summaryResult.status === 'fulfilled') {
        summary = summaryResult.value;
      } else {
        console.warn(`Failed to load summary for ${year} ${quarter}:`, summaryResult.reason);
      }

      const structured = hukumService.groupBySection(hukum);

      setData({
        sections, // ← Bisa empty array
        hukum,
        summary,
        structured,
      });
    } catch (err: any) {
      const errorMessage = hukumService.handleError(err);
      setError(errorMessage);
      console.error('Error loading hukum data:', errorMessage);

      // Set empty data, bukan default
      setData({
        sections: [], // ← EMPTY
        hukum: [],
        summary: null,
        structured: [],
      });
    } finally {
      setLoading(false);
    }
  }, [year, quarter]);

  return {
    data,
    loading,
    error,
    refetch: loadData,
  };
};
