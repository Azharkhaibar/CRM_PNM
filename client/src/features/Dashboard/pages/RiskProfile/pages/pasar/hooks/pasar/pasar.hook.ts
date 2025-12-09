// hooks/pasar/pasar.hook.ts
import { useState, useCallback, useEffect } from 'react';
import { pasarService } from '../../service/pasar/pasar.service';
// import { SectionPasar, IndikatorPasar, SummaryResponse, CreateSectionDto, UpdateSectionDto, CreateIndikatorDto, UpdateIndikatorDto, SectionFormData, IndikatorFormData, GroupedSection } from '../types/pasar.types';

import { SectionPasar, IndikatorPasar, SummaryResponse, CreateIndikatorDto, CreateSectionDto, UpdateIndikatorDto, UpdateSectionDto, SectionFormData, IndikatorFormData, GroupedSection } from '../../types/pasar.types';

// Hook utama untuk semua operasi pasar
export const usePasar = (initialYear?: number, initialQuarter?: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sections, setSections] = useState<SectionPasar[]>([]);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);

  // Load data berdasarkan periode
  const loadData = useCallback(async (tahun?: number, triwulan?: string) => {
    if (!tahun || !triwulan) return;

    setLoading(true);
    setError(null);
    try {
      const [fetchedSections, fetchedSummary] = await Promise.all([pasarService.getSectionsByPeriod(tahun, triwulan), pasarService.getOverallSummary(tahun, triwulan)]);

      setSections(fetchedSections);
      setSummary(fetchedSummary);
    } catch (err: any) {
      const errorMessage = pasarService.handleError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data initial jika ada parameter
  useEffect(() => {
    if (initialYear && initialQuarter) {
      loadData(initialYear, initialQuarter);
    }
  }, [initialYear, initialQuarter, loadData]);

  // ==================== SECTION METHODS ====================

  const getSections = useCallback(async (): Promise<SectionPasar[]> => {
    setLoading(true);
    setError(null);
    try {
      const sectionsData = await pasarService.getSections();
      setSections(sectionsData);
      return sectionsData;
    } catch (err: any) {
      const errorMessage = pasarService.handleError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getSectionsByPeriod = useCallback(async (tahun: number, triwulan: string): Promise<SectionPasar[]> => {
    setLoading(true);
    setError(null);
    try {
      const sectionsData = await pasarService.getSectionsByPeriod(tahun, triwulan);
      setSections(sectionsData);
      return sectionsData;
    } catch (err: any) {
      const errorMessage = pasarService.handleError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getSectionById = useCallback(async (id: number): Promise<SectionPasar> => {
    setLoading(true);
    setError(null);
    try {
      return await pasarService.getSectionById(id);
    } catch (err: any) {
      const errorMessage = pasarService.handleError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSection = useCallback(async (data: CreateSectionDto, options?: { onSuccess?: () => void; onError?: (error: any) => void }): Promise<SectionPasar> => {
    setLoading(true);
    setError(null);
    try {
      const section = await pasarService.createSection(data);

      // Update local state
      setSections((prev) => [...prev, section]);

      // Reload summary jika perlu
      if (section.tahun && section.triwulan) {
        const newSummary = await pasarService.getOverallSummary(section.tahun, section.triwulan);
        setSummary(newSummary);
      }

      options?.onSuccess?.();
      return section;
    } catch (err: any) {
      const errorMessage = pasarService.handleError(err);
      setError(errorMessage);
      options?.onError?.(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSection = useCallback(async (id: number, data: UpdateSectionDto, options?: { onSuccess?: () => void; onError?: (error: any) => void }): Promise<SectionPasar> => {
    setLoading(true);
    setError(null);
    try {
      const updatedSection = await pasarService.updateSection(id, data);

      // Update local state
      setSections((prev) => prev.map((s) => (s.id === id ? updatedSection : s)));

      options?.onSuccess?.();
      return updatedSection;
    } catch (err: any) {
      const errorMessage = pasarService.handleError(err);
      setError(errorMessage);
      options?.onError?.(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSection = useCallback(async (id: number, options?: { onSuccess?: () => void; onError?: (error: any) => void }): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await pasarService.deleteSection(id);

      // Update local state
      setSections((prev) => prev.filter((s) => s.id !== id));

      options?.onSuccess?.();
    } catch (err: any) {
      const errorMessage = pasarService.handleError(err);
      setError(errorMessage);
      options?.onError?.(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== INDIKATOR METHODS ====================

  const getIndikatorsBySection = useCallback(async (sectionId: number): Promise<IndikatorPasar[]> => {
    setLoading(true);
    setError(null);
    try {
      return await pasarService.getIndikatorsBySection(sectionId);
    } catch (err: any) {
      const errorMessage = pasarService.handleError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getIndikatorById = useCallback(async (id: number): Promise<IndikatorPasar> => {
    setLoading(true);
    setError(null);
    try {
      return await pasarService.getIndikatorById(id);
    } catch (err: any) {
      const errorMessage = pasarService.handleError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createIndikator = useCallback(
    async (data: CreateIndikatorDto, options?: { onSuccess?: () => void; onError?: (error: any) => void }): Promise<IndikatorPasar> => {
      setLoading(true);
      setError(null);
      try {
        const indikator = await pasarService.createIndikator(data);

        // Update local state - add indikator to its section
        setSections((prev) =>
          prev.map((section) => {
            if (section.id === data.sectionId) {
              return {
                ...section,
                indikators: [...(section.indikators || []), indikator],
              };
            }
            return section;
          })
        );

        // Update summary
        if (initialYear && initialQuarter) {
          const newSummary = await pasarService.getOverallSummary(initialYear, initialQuarter);
          setSummary(newSummary);
        }

        options?.onSuccess?.();
        return indikator;
      } catch (err: any) {
        const errorMessage = pasarService.handleError(err);
        setError(errorMessage);
        options?.onError?.(err);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [initialYear, initialQuarter]
  );

  const updateIndikator = useCallback(
    async (id: number, data: UpdateIndikatorDto, options?: { onSuccess?: () => void; onError?: (error: any) => void }): Promise<IndikatorPasar> => {
      setLoading(true);
      setError(null);
      try {
        // DEBUG: Cek parameter
        console.log('🔍 updateIndikator called with:', { id, idType: typeof id, data });

        // PERBAIKAN: Pastikan id adalah number
        const numericId = Number(id);
        if (isNaN(numericId)) {
          throw new Error(`ID indikator tidak valid: ${id}`);
        }

        // Validasi data
        const validatedData = validateIndikatorData(data);

        console.log('📤 Sending update for indikator ID:', numericId);
        console.log('📤 Data yang dikirim:', validatedData);

        const updatedIndikator = await pasarService.updateIndikator(numericId, validatedData);

        // ... rest of the code ...
      } catch (err: any) {
        console.error('❌ Error in updateIndikator hook:', err);
        const errorMessage = pasarService.handleError(err);
        setError(errorMessage);
        options?.onError?.(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [sections]
  );

  const deleteIndikator = useCallback(
    async (id: number, options?: { onSuccess?: () => void; onError?: (error: any) => void }): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await pasarService.deleteIndikator(id);

        // Update local state - remove indikator from sections
        setSections((prev) =>
          prev.map((section) => {
            if (section.indikators) {
              const filteredIndikators = section.indikators.filter((ind) => ind.id !== id);
              return { ...section, indikators: filteredIndikators };
            }
            return section;
          })
        );

        // Update summary
        if (initialYear && initialQuarter) {
          const newSummary = await pasarService.getOverallSummary(initialYear, initialQuarter);
          setSummary(newSummary);
        }

        options?.onSuccess?.();
      } catch (err: any) {
        const errorMessage = pasarService.handleError(err);
        setError(errorMessage);
        options?.onError?.(err);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [initialYear, initialQuarter]
  );

  const searchIndikators = useCallback(async (query: string): Promise<IndikatorPasar[]> => {
    setLoading(true);
    setError(null);
    try {
      return await pasarService.searchIndikators(query);
    } catch (err: any) {
      const errorMessage = pasarService.handleError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== DASHBOARD METHODS ====================

  const getOverallSummary = useCallback(async (tahun: number, triwulan: string): Promise<SummaryResponse> => {
    setLoading(true);
    setError(null);
    try {
      const summaryData = await pasarService.getOverallSummary(tahun, triwulan);
      setSummary(summaryData);
      return summaryData;
    } catch (err: any) {
      const errorMessage = pasarService.handleError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== BULK OPERATIONS ====================

  const createSectionWithIndikators = useCallback(async (section: CreateSectionDto, indikators: CreateIndikatorDto[], options?: { onSuccess?: () => void; onError?: (error: any) => void }): Promise<SectionPasar> => {
    setLoading(true);
    setError(null);
    try {
      const newSection = await pasarService.createSectionWithIndikators(section, indikators);

      // Update local state
      setSections((prev) => [...prev, newSection]);

      // Update summary
      if (section.tahun && section.triwulan) {
        const newSummary = await pasarService.getOverallSummary(section.tahun, section.triwulan);
        setSummary(newSummary);
      }

      options?.onSuccess?.();
      return newSection;
    } catch (err: any) {
      const errorMessage = pasarService.handleError(err);
      setError(errorMessage);
      options?.onError?.(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== UTILITY METHODS ====================

  const formatIndikatorData = useCallback((formData: any, sectionId: number): CreateIndikatorDto => {
    return pasarService.formatIndikatorData(formData, sectionId);
  }, []);

  const groupBySection = useCallback((sectionsToGroup: SectionPasar[]): GroupedSection[] => {
    return pasarService.groupBySection(sectionsToGroup);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    loading,
    error,
    sections,
    summary,

    // Data loading
    loadData,
    refetch: () => loadData(initialYear, initialQuarter),

    // Section methods
    getSections,
    getSectionsByPeriod,
    getSectionById,
    createSection,
    updateSection,
    deleteSection,

    // Indikator methods
    getIndikatorsBySection,
    getIndikatorById,
    createIndikator,
    updateIndikator,
    deleteIndikator,
    searchIndikators,

    // Dashboard methods
    getOverallSummary,

    // Bulk operations
    createSectionWithIndikators,

    // Utility methods
    formatIndikatorData,
    groupBySection: () => groupBySection(sections),

    // Helper functions
    clearError,
    calculateHasil: pasarService.calculateHasil,
    calculateWeighted: pasarService.calculateWeighted,
    determineRiskLevel: pasarService.determineRiskLevel,
  };
};

// Hook untuk CRUD operations yang lebih sederhana
export const usePasarCRUD = (initialYear?: number, initialQuarter?: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sections, setSections] = useState<SectionPasar[]>([]);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);

  // Load data berdasarkan periode
  const loadData = useCallback(async (tahun?: number, triwulan?: string) => {
    if (!tahun || !triwulan) return;

    setLoading(true);
    setError(null);
    try {
      const [fetchedSections, fetchedSummary] = await Promise.all([pasarService.getSectionsByPeriod(tahun, triwulan), pasarService.getOverallSummary(tahun, triwulan)]);

      setSections(fetchedSections);
      setSummary(fetchedSummary);
    } catch (err: any) {
      const errorMessage = pasarService.handleError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data initial jika ada parameter
  useEffect(() => {
    if (initialYear && initialQuarter) {
      loadData(initialYear, initialQuarter);
    }
  }, [initialYear, initialQuarter, loadData]);

  // ==================== VALIDATION HELPER ====================

  const validateSectionData = (data) => {
    const errors = [];

    // **Validasi minimal saja**
    if (!data.no_sec || data.no_sec.trim() === '') {
      errors.push('No Section harus diisi');
    }

    if (!data.nama_section || data.nama_section.trim() === '') {
      errors.push('Nama Section harus diisi');
    }

    // **Hapus validasi ketat untuk bobot, biarkan backend handle**
    // const bobotPar = Number(data.bobot_par);
    // if (isNaN(bobotPar) || bobotPar < 0.01 || bobotPar > 100) {
    //   errors.push('Bobot Section harus antara 0.01 dan 100');
    // }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    // Return data dalam SNAKE_CASE
    return {
      no_sec: data.no_sec.trim(),
      nama_section: data.nama_section.trim(),
      bobot_par: Number(data.bobot_par) || 0, // Konversi sederhana
      tahun: Number(data.tahun) || new Date().getFullYear(),
      triwulan: data.triwulan || 'Q1',
    };
  };

  const validateIndikatorData = (data: CreateIndikatorDto | UpdateIndikatorDto) => {
    const errors: string[] = [];

    // **PERBAIKAN: HAPUS SEMUA VALIDASI, BIARKAN BACKEND YANG HANDLE**
    // Komen semua validasi atau hapus sepenuhnya

    /*
  // HAPUS VALIDASI INI:
  if (!data.nama_indikator || data.nama_indikator.trim() === '') {
    errors.push('Nama Indikator harus diisi');
  }
  */

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    // Clean data untuk dikirim ke backend - HANYA format conversion
    const cleanData: any = {
      ...data,
      // Pastikan string fields di-trim
      nama_indikator: data.nama_indikator?.trim() || '',
      sumber_risiko: data.sumber_risiko?.trim() || '',
      dampak: data.dampak?.trim() || '',
      pembilang_label: data.pembilang_label?.trim() || undefined,
      penyebut_label: data.penyebut_label?.trim() || undefined,
      low: data.low?.trim() || '',
      low_to_moderate: data.low_to_moderate?.trim() || '',
      moderate: data.moderate?.trim() || '',
      moderate_to_high: data.moderate_to_high?.trim() || '',
      high: data.high?.trim() || '',
      keterangan: data.keterangan?.trim() || undefined,
      formula: data.formula?.trim() || undefined,

      // Konversi numerik
      bobot_indikator: Number(data.bobot_indikator) || 0,
      peringkat: Number(data.peringkat) || 1,
      is_percent: Boolean(data.is_percent),

      // Handle optional numeric values
      ...(data.pembilang_value !== undefined && data.pembilang_value !== null && data.pembilang_value !== '' ? { pembilang_value: Number(data.pembilang_value) } : {}),

      ...(data.penyebut_value !== undefined && data.penyebut_value !== null && data.penyebut_value !== '' ? { penyebut_value: Number(data.penyebut_value) } : {}),
    };

    return cleanData;
  };

  // ==================== SECTION METHODS ====================

  const createSection = useCallback(
    async (data: CreateSectionDto, options?: { onSuccess?: () => void; onError?: (error: any) => void }): Promise<SectionPasar> => {
      setLoading(true);
      setError(null);
      try {
        // Validasi data
        const validatedData = validateSectionData(data);

        // Tambahkan tahun dan triwulan jika tidak ada
        const completeData = {
          ...validatedData,
          tahun: data.tahun || initialYear || new Date().getFullYear(),
          triwulan: data.triwulan || initialQuarter || 'Q1',
        };

        const section = await pasarService.createSection(completeData);

        // Update local state
        setSections((prev) => [...prev, section]);

        // Reload summary jika perlu
        if (section.tahun && section.triwulan) {
          const newSummary = await pasarService.getOverallSummary(section.tahun, section.triwulan);
          setSummary(newSummary);
        }

        // Reload data untuk sync dengan backend
        await loadData(initialYear, initialQuarter);

        options?.onSuccess?.();
        return section;
      } catch (err: any) {
        const errorMessage = pasarService.handleError(err);
        setError(errorMessage);
        options?.onError?.(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [initialYear, initialQuarter, loadData]
  );

  const updateSection = useCallback(async (id: number, data: UpdateSectionDto, options?: { onSuccess?: () => void; onError?: (error: any) => void }): Promise<SectionPasar> => {
    setLoading(true);
    setError(null);
    try {
      // Validasi data
      const validatedData = validateSectionData(data);

      const updatedSection = await pasarService.updateSection(id, validatedData);

      // Update local state
      setSections((prev) => prev.map((s) => (s.id === id ? updatedSection : s)));

      options?.onSuccess?.();
      return updatedSection;
    } catch (err: any) {
      const errorMessage = pasarService.handleError(err);
      setError(errorMessage);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSection = useCallback(
    async (id: number, options?: { onSuccess?: () => void; onError?: (error: any) => void }): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await pasarService.deleteSection(id);

        // Update local state
        setSections((prev) => prev.filter((s) => s.id !== id));

        // Reload summary
        if (initialYear && initialQuarter) {
          const newSummary = await pasarService.getOverallSummary(initialYear, initialQuarter);
          setSummary(newSummary);
        }

        options?.onSuccess?.();
      } catch (err: any) {
        const errorMessage = pasarService.handleError(err);
        setError(errorMessage);
        options?.onError?.(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [initialYear, initialQuarter]
  );

  // ==================== INDIKATOR METHODS ====================

  const createIndikator = useCallback(
    async (data: CreateIndikatorDto, options?: { onSuccess?: () => void; onError?: (error: any) => void }): Promise<IndikatorPasar> => {
      setLoading(true);
      setError(null);
      try {
        // Validasi data
        const validatedData = validateIndikatorData(data);

        // Hitung hasil dan weighted sebelum dikirim
        const pembilang = validatedData.pembilang_value || 0;
        const penyebut = validatedData.penyebut_value || 0;
        const mode = validatedData.mode || 'RASIO';

        let hasil = 0;
        if (mode === 'NILAI_TUNGGAL') {
          hasil = penyebut;
        } else if (mode === 'RASIO' && penyebut !== 0) {
          hasil = pembilang / penyebut;
        }

        if (validatedData.formula && validatedData.formula.trim() !== '') {
          try {
            const expr = validatedData.formula.replace(/\bpemb\b/g, pembilang.toString()).replace(/\bpeny\b/g, penyebut.toString());
            const fn = new Function(`return (${expr});`);
            hasil = fn();
          } catch (e) {
            console.warn('Invalid formula:', e);
          }
        }

        // Cari section untuk mendapatkan bobot_par
        const section = sections.find((s) => s.id === data.sectionId);
        const bobotSection = section?.bobot_par || 0;
        const bobotIndikator = validatedData.bobot_indikator || 0;
        const peringkat = validatedData.peringkat || 1;

        const weighted = (bobotSection * bobotIndikator * peringkat) / 10000;

        // Tambahkan hasil dan weighted ke data
        const completeData = {
          ...validatedData,
          hasil: Number(hasil.toFixed(6)),
          weighted: Number(weighted.toFixed(2)),
        };

        const indikator = await pasarService.createIndikator(completeData);

        // Update local state - add indikator to its section
        setSections((prev) =>
          prev.map((section) => {
            if (section.id === data.sectionId) {
              return {
                ...section,
                indikators: [...(section.indikators || []), indikator],
              };
            }
            return section;
          })
        );

        // Update summary
        if (initialYear && initialQuarter) {
          const newSummary = await pasarService.getOverallSummary(initialYear, initialQuarter);
          setSummary(newSummary);
        }

        options?.onSuccess?.();
        return indikator;
      } catch (err: any) {
        const errorMessage = pasarService.handleError(err);
        setError(errorMessage);
        options?.onError?.(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [initialYear, initialQuarter, sections]
  );

  const updateIndikator = useCallback(
    async (id: number, data: UpdateIndikatorDto, options?: { onSuccess?: () => void; onError?: (error: any) => void }): Promise<IndikatorPasar> => {
      setLoading(true);
      setError(null);
      try {
        // Validasi data
        const validatedData = validateIndikatorData(data);

        // Hitung hasil dan weighted
        const pembilang = validatedData.pembilang_value || 0;
        const penyebut = validatedData.penyebut_value || 0;
        const mode = validatedData.mode || 'RASIO';

        let hasil = 0;
        if (mode === 'NILAI_TUNGGAL') {
          hasil = penyebut;
        } else if (mode === 'RASIO' && penyebut !== 0) {
          hasil = pembilang / penyebut;
        }

        if (validatedData.formula && validatedData.formula.trim() !== '') {
          try {
            const expr = validatedData.formula.replace(/\bpemb\b/g, pembilang.toString()).replace(/\bpeny\b/g, penyebut.toString());
            const fn = new Function(`return (${expr});`);
            hasil = fn();
          } catch (e) {
            console.warn('Invalid formula:', e);
          }
        }

        // Cari section dan indikator untuk mendapatkan bobot section
        const section = sections.find((s) => s.indikators?.some((ind) => ind.id === id));
        const bobotSection = section?.bobot_par || 0;
        const bobotIndikator = validatedData.bobot_indikator || 0;
        const peringkat = validatedData.peringkat || 1;

        const weighted = (bobotSection * bobotIndikator * peringkat) / 10000;

        // Tambahkan hasil dan weighted ke data
        const completeData = {
          ...validatedData,
          hasil: Number(hasil.toFixed(6)),
          weighted: Number(weighted.toFixed(2)),
        };

        const updatedIndikator = await pasarService.updateIndikator(id, completeData);

        // Update local state
        setSections((prev) =>
          prev.map((section) => {
            if (section.indikators) {
              const updatedIndikators = section.indikators.map((ind) => (ind.id === id ? updatedIndikator : ind));
              return { ...section, indikators: updatedIndikators };
            }
            return section;
          })
        );

        options?.onSuccess?.();
        return updatedIndikator;
      } catch (err: any) {
        const errorMessage = pasarService.handleError(err);
        setError(errorMessage);
        options?.onError?.(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [sections]
  );

  const deleteIndikator = useCallback(
    async (id: number, options?: { onSuccess?: () => void; onError?: (error: any) => void }): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await pasarService.deleteIndikator(id);

        // Update local state - remove indikator from sections
        setSections((prev) =>
          prev.map((section) => {
            if (section.indikators) {
              const filteredIndikators = section.indikators.filter((ind) => ind.id !== id);
              return { ...section, indikators: filteredIndikators };
            }
            return section;
          })
        );

        // Update summary
        if (initialYear && initialQuarter) {
          const newSummary = await pasarService.getOverallSummary(initialYear, initialQuarter);
          setSummary(newSummary);
        }

        options?.onSuccess?.();
      } catch (err: any) {
        const errorMessage = pasarService.handleError(err);
        setError(errorMessage);
        options?.onError?.(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [initialYear, initialQuarter]
  );

  // ==================== READ METHODS ====================

  const getSectionById = useCallback(async (id: number): Promise<SectionPasar> => {
    setLoading(true);
    setError(null);
    try {
      return await pasarService.getSectionById(id);
    } catch (err: any) {
      const errorMessage = pasarService.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getIndikatorById = useCallback(async (id: number): Promise<IndikatorPasar> => {
    setLoading(true);
    setError(null);
    try {
      return await pasarService.getIndikatorById(id);
    } catch (err: any) {
      const errorMessage = pasarService.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getIndikatorsBySection = useCallback(async (sectionId: number): Promise<IndikatorPasar[]> => {
    setLoading(true);
    setError(null);
    try {
      return await pasarService.getIndikatorsBySection(sectionId);
    } catch (err: any) {
      const errorMessage = pasarService.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== UTILITY METHODS ====================

  const formatIndikatorData = useCallback((formData: any, sectionId: number): CreateIndikatorDto => {
    return pasarService.formatIndikatorData(formData, sectionId);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refetch = useCallback(() => {
    if (initialYear && initialQuarter) {
      return loadData(initialYear, initialQuarter);
    }
  }, [initialYear, initialQuarter, loadData]);

  return {
    // State
    loading,
    error,
    sections,
    summary,

    // CRUD Operations
    createSection,
    createIndikator,
    updateSection,
    updateIndikator,
    deleteSection,
    deleteIndikator,

    // Read Operations
    getSectionById,
    getIndikatorById,
    getIndikatorsBySection,

    // Utility
    clearError,
    formatIndikatorData,
    refetch,

    // Validation helpers (untuk debugging)
    validateSectionData,
    validateIndikatorData,
  };
};
function validateIndikatorData(data: UpdateIndikatorDto) {
  throw new Error('Function not implemented.');
}

