// src/hooks/kepatuhan/kepatuhan.hook.ts
import { useState, useCallback, useEffect } from 'react';
import { kepatuhanService } from '../../services/kepatuhan/kepatuhan.service';
// import { Kepatuhan, KepatuhanSection, CreateKepatuhanSectionDto, UpdateKepatuhanSectionDto, CreateKepatuhanDto, UpdateKepatuhanDto, Quarter, KepatuhanSummary, StructuredKepatuhan } from '../types/kepatuhan.types';
import { Kepatuhan, KepatuhanSection, CreateKepatuhanDto, CreateKepatuhanSectionDto, UpdateKepatuhanDto, UpdateKepatuhanSectionDto, Quarter, KepatuhanSummary, StructuredKepatuhan } from '../../types/kepatuhan.types';

export const useKepatuhan = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ========== SECTION METHODS ==========
  const getSections = useCallback(async (): Promise<KepatuhanSection[]> => {
    setLoading(true);
    setError(null);
    try {
      const sections = await kepatuhanService.getSections();

      // Jika backend kosong atau error, gunakan default sections
      if (!sections || sections.length === 0) {
        console.log('No sections from backend, using default sections');
        return kepatuhanService.generateDefaultSections();
      }

      return sections;
    } catch (err: any) {
      const errorMessage = kepatuhanService.handleError(err);
      console.warn('Error fetching sections, using defaults:', errorMessage);

      // Return default sections instead of throwing error
      return kepatuhanService.generateDefaultSections();
    } finally {
      setLoading(false);
    }
  }, []);

  const createSection = useCallback(async (data: CreateKepatuhanSectionDto): Promise<KepatuhanSection> => {
    setLoading(true);
    setError(null);
    try {
      const section = await kepatuhanService.createSection(data);
      return section;
    } catch (err: any) {
      const errorMessage = kepatuhanService.handleError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSection = useCallback(async (id: number, data: UpdateKepatuhanSectionDto): Promise<KepatuhanSection> => {
    setLoading(true);
    setError(null);
    try {
      const section = await kepatuhanService.updateSection(id, data);
      return section;
    } catch (err: any) {
      const errorMessage = kepatuhanService.handleError(err);
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
      await kepatuhanService.deleteSection(id);
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal menghapus section';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getSectionById = useCallback(async (id: number): Promise<KepatuhanSection | null> => {
    setLoading(true);
    setError(null);
    try {
      return await kepatuhanService.getSectionById(id);
    } catch (err: any) {
      const errorMessage = kepatuhanService.handleError(err);
      console.warn(`Error fetching section ${id}:`, errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== KEPATUHAN METHODS ==========
  const getKepatuhan = useCallback(async (year?: number, quarter?: Quarter): Promise<Kepatuhan[]> => {
    setLoading(true);
    setError(null);
    try {
      return await kepatuhanService.getKepatuhan(year, quarter);
    } catch (err: any) {
      const errorMessage = kepatuhanService.handleError(err);
      console.warn('Error fetching kepatuhan:', errorMessage);
      return []; // Return empty array instead of throwing
    } finally {
      setLoading(false);
    }
  }, []);

  const getKepatuhanByPeriod = useCallback(async (year: number, quarter: Quarter): Promise<Kepatuhan[]> => {
    setLoading(true);
    setError(null);
    try {
      return await kepatuhanService.getKepatuhanByPeriod(year, quarter);
    } catch (err: any) {
      const errorMessage = kepatuhanService.handleError(err);
      console.warn(`Error fetching kepatuhan for ${year} ${quarter}:`, errorMessage);
      return []; // Return empty array for graceful fallback
    } finally {
      setLoading(false);
    }
  }, []);

  const getKepatuhanBySection = useCallback(async (sectionId: number, year?: number, quarter?: Quarter): Promise<Kepatuhan[]> => {
    setLoading(true);
    setError(null);
    try {
      return await kepatuhanService.getKepatuhanBySection(sectionId, year, quarter);
    } catch (err: any) {
      const errorMessage = kepatuhanService.handleError(err);
      console.warn(`Error fetching kepatuhan for section ${sectionId}:`, errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getKepatuhanStructured = useCallback(async (year?: number, quarter?: Quarter): Promise<StructuredKepatuhan[]> => {
    setLoading(true);
    setError(null);
    try {
      return await kepatuhanService.getKepatuhanStructured(year, quarter);
    } catch (err: any) {
      const errorMessage = kepatuhanService.handleError(err);
      console.warn('Error getting structured kepatuhan:', errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getKepatuhanSummary = useCallback(async (year: number, quarter: Quarter): Promise<KepatuhanSummary | null> => {
    setLoading(true);
    setError(null);
    try {
      return await kepatuhanService.getKepatuhanSummary(year, quarter);
    } catch (err: any) {
      const errorMessage = kepatuhanService.handleError(err);
      console.warn(`Error fetching summary for ${year} ${quarter}:`, errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getKepatuhanById = useCallback(async (id: number): Promise<Kepatuhan | null> => {
    setLoading(true);
    setError(null);
    try {
      return await kepatuhanService.getKepatuhanById(id);
    } catch (err: any) {
      const errorMessage = kepatuhanService.handleError(err);
      console.warn(`Error fetching kepatuhan ${id}:`, errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createKepatuhan = useCallback(async (data: CreateKepatuhanDto): Promise<Kepatuhan> => {
    setLoading(true);
    setError(null);
    try {
      return await kepatuhanService.createKepatuhan(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal membuat indikator';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateKepatuhan = useCallback(async (id: number, data: UpdateKepatuhanDto): Promise<Kepatuhan> => {
    setLoading(true);
    setError(null);
    try {
      return await kepatuhanService.updateKepatuhan(id, data);
    } catch (err: any) {
      const errorMessage = kepatuhanService.handleError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteKepatuhan = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await kepatuhanService.deleteKepatuhan(id);
    } catch (err: any) {
      const errorMessage = kepatuhanService.handleError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  //   const bulkCreateKepatuhan = useCallback(async (data: CreateKepatuhanDto[]): Promise<Kepatuhan[]> => {
  //     setLoading(true);
  //     setError(null);
  //     try {
  //       return await kepatuhanService.bulkCreateKepatuhan(data);
  //     } catch (err: any) {
  //       const errorMessage = kepatuhanService.handleError(err);
  //       setError(errorMessage);
  //       throw new Error(errorMessage);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }, []);

  const deleteByPeriod = useCallback(async (year: number, quarter: Quarter): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await kepatuhanService.deleteByPeriod(year, quarter);
    } catch (err: any) {
      const errorMessage = kepatuhanService.handleError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper untuk save data dari frontend form
  const saveKepatuhanData = useCallback(async (year: number, quarter: Quarter, sections: any[]): Promise<Kepatuhan[]> => {
    setLoading(true);
    setError(null);
    try {
      if (!sections || sections.length === 0) {
        throw new Error('Tidak ada data untuk disimpan');
      }

      const results: Kepatuhan[] = [];

      // Loop setiap indikator dan simpan satu per satu
      for (const section of sections) {
        const sectionId = parseInt(section.id.replace('s-', ''));

        for (const indicator of section.indicators) {
          const kepatuhanItem: CreateKepatuhanDto = {
            year,
            quarter,
            sectionId: sectionId,
            no: section.no,
            sectionLabel: section.parameter,
            bobotSection: section.bobotSection,
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
            const result = await kepatuhanService.createKepatuhan(kepatuhanItem);
            results.push(result);
          } catch (error: any) {
            console.error(`Gagal menyimpan indikator ${indicator.subNo}:`, error);
            // Continue dengan indikator berikutnya
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
    createKepatuhan,

    // Kepatuhan methods
    getKepatuhan,
    getKepatuhanByPeriod,
    getKepatuhanBySection,
    getKepatuhanStructured,
    getKepatuhanSummary,
    getKepatuhanById,
    createKepatuhan,
    updateKepatuhan,
    deleteKepatuhan,
    // bulkCreateKepatuhan,
    deleteByPeriod,
    saveKepatuhanData,

    // Utility
    clearError,
  };
};  

// Hook untuk data management yang lebih sederhana
export const useKepatuhanData = (year?: number, quarter?: Quarter) => {
  const [data, setData] = useState<{
    kepatuhan: Kepatuhan[];
    sections: KepatuhanSection[];
    summary: KepatuhanSummary | null;
    structured: StructuredKepatuhan[];
  }>({
    kepatuhan: [],
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
      // Gunakan Promise.allSettled untuk handle error per endpoint
      const [sectionsResult, kepatuhanResult, summaryResult] = await Promise.allSettled([kepatuhanService.getSections(), kepatuhanService.getKepatuhanByPeriod(year, quarter), kepatuhanService.getKepatuhanSummary(year, quarter)]);

      // Handle sections
      let sections: KepatuhanSection[] = [];
      if (sectionsResult.status === 'fulfilled') {
        sections = sectionsResult.value;
      } else {
        console.warn('Failed to load sections:', sectionsResult.reason);
        sections = kepatuhanService.generateDefaultSections();
      }

      // Handle kepatuhan data
      let kepatuhan: Kepatuhan[] = [];
      if (kepatuhanResult.status === 'fulfilled') {
        kepatuhan = kepatuhanResult.value;
      } else {
        console.warn(`Failed to load kepatuhan for ${year} ${quarter}:`, kepatuhanResult.reason);
      }

      // Handle summary
      let summary: KepatuhanSummary | null = null;
      if (summaryResult.status === 'fulfilled') {
        summary = summaryResult.value;
      } else {
        console.warn(`Failed to load summary for ${year} ${quarter}:`, summaryResult.reason);
      }

      const structured = kepatuhanService.groupBySection(kepatuhan);

      setData({
        sections,
        kepatuhan,
        summary,
        structured,
      });
    } catch (err: any) {
      const errorMessage = kepatuhanService.handleError(err);
      setError(errorMessage);
      console.error('Error loading kepatuhan data:', errorMessage);

      // Set minimal data for UI to still work
      setData({
        sections: kepatuhanService.generateDefaultSections(),
        kepatuhan: [],
        summary: null,
        structured: [],
      });
    } finally {
      setLoading(false);
    }
  }, [year, quarter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    refetch: loadData,
  };
};
