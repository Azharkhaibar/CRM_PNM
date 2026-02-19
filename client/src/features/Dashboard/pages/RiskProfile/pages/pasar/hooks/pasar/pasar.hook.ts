// src/features/Dashboard/pages/RiskProfile/pages/Pasar/hooks/usePasar.ts
import { useCallback, useEffect, useState } from 'react';
// import {
//   Quarter,
//   computeHasil,
//   computeWeightedAuto,
//   CreatePasarData,
//   CreatePasarSectionData,
//   Period,
//   PasarIndikator,
//   PasarSection,
//   transformIndicatorToBackend,
//   UpdatePasarData,
//   UpdatePasarSectionData,
//   transformSectionToBackend,
//   transformIndicatorToFrontend,
//   pasarApiService,
//   SectionsWithIndicatorsResponse,
// } from '../services/pasar.service';

import {
  Quarter,
  computeHasil,
  computeWeightedAuto,
  CreatePasarData,
  CreatePasarSectionData,
  Period,
  PasarIndikator,
  PasarSection,
  transformIndicatorToBackend,
  transformSectionToBackend,
  transformIndicatorToFrontend,
  pasarApiService,
  SectionsWithIndicatorsResponse,
  UpdatePasarData,
  UpdatePasarSectionData,
} from '../../../pasar/service/pasar/pasar.service';

// EMPTY TEMPLATES - TAMBAHKAN YEAR DAN QUARTER
export const emptyIndicator = {
  id: null,
  subNo: '',
  indikator: '',
  mode: 'RASIO' as const,
  formula: '',
  isPercent: false,
  bobotIndikator: 0,
  sumberRisiko: '',
  dampak: '',
  pembilangLabel: '',
  pembilangValue: '',
  penyebutLabel: '',
  penyebutValue: '',
  peringkat: 1,
  weighted: '',
  hasil: '',
  hasilText: '',
  keterangan: '',
  low: '',
  lowToModerate: '',
  moderate: '',
  moderateToHigh: '',
  high: '',
  sectionId: null,
  year: new Date().getFullYear(),
  quarter: 'Q1' as Quarter,
};

export const emptySection = {
  id: null,
  no: '',
  bobotSection: 100,
  parameter: '',
  description: '',
  sortOrder: 0,
  isActive: true,
  year: new Date().getFullYear(),
  quarter: 'Q1' as Quarter,
};

interface UsePasarOptions {
  initialYear?: number;
  initialQuarter?: Quarter;
  autoLoad?: boolean;
}

interface UsePasarReturn {
  // ========== STATE ==========
  // Data
  sections: PasarSection[];
  indikators: PasarIndikator[];
  sectionsWithIndicators: Array<
    PasarSection & {
      indicators: PasarIndikator[];
      totalWeighted?: number;
      indicatorCount: number;
      hasIndicators: boolean;
    }
  >;
  periods: Period[];
  allSections: PasarSection[];

  // UI State
  viewYear: number;
  viewQuarter: Quarter;
  query: string;
  loading: boolean;
  error: string | null;
  totalWeighted: number;

  // ========== ACTIONS ==========
  // State setters
  setViewYear: (year: number) => void;
  setViewQuarter: (quarter: Quarter) => void;
  setQuery: (query: string) => void;
  clearError: () => void;

  // ========== DATA OPERATIONS ==========
  // Load data
  getSections: (isActive?: boolean) => Promise<void>;
  getAllIndikators: () => Promise<void>;
  getIndikatorsByPeriod: (year: number, quarter: Quarter) => Promise<PasarIndikator[]>;
  getSectionsWithIndicatorsByPeriod: (year: number, quarter: Quarter) => Promise<Array<PasarSection & { indicators: PasarIndikator[] }>>;
  getPeriods: () => Promise<void>;
  searchIndikators: (query?: string, year?: number, quarter?: Quarter) => Promise<PasarIndikator[]>;
  getAllSections: (isActive?: boolean) => Promise<PasarSection[]>;

  // ========== CRUD OPERATIONS ==========
  // Section CRUD
  createSection: (data: CreatePasarSectionData) => Promise<PasarSection>;
  getSectionById: (id: number) => Promise<PasarSection>;
  updateSection: (id: number, data: UpdatePasarSectionData) => Promise<PasarSection>;
  deleteSection: (id: number) => Promise<void>;

  // Indikator CRUD
  createIndikator: (data: CreatePasarData) => Promise<PasarIndikator>;
  getIndikatorById: (id: number) => Promise<PasarIndikator>;
  updateIndikator: (id: number, data: UpdatePasarData) => Promise<PasarIndikator>;
  deleteIndikator: (id: number) => Promise<void>;

  // ========== HELPER OPERATIONS ==========
  // Calculations
  getTotalWeightedByPeriod: (year: number, quarter: Quarter) => Promise<number>;
  calculateTotalWeighted: () => Promise<void>;
  duplicateIndikator: (sourceId: number, targetYear: number, targetQuarter: Quarter) => Promise<PasarIndikator>;

  // Transformations
  transformToBackend: typeof transformIndicatorToBackend;
  transformToFrontend: typeof transformIndicatorToFrontend;
  transformSectionToBackend: typeof transformSectionToBackend;
  computeHasil: typeof computeHasil;
  computeWeightedAuto: typeof computeWeightedAuto;

  // Templates
  emptyIndicator: typeof emptyIndicator;
  emptySection: typeof emptySection;

  // Additional states
  loadingAllSections: boolean;
  getSectionsByPeriod: (year: number, quarter: Quarter) => Promise<PasarSection[]>;
}

export const usePasar = (options?: UsePasarOptions): UsePasarReturn => {
  const { initialYear = new Date().getFullYear(), initialQuarter = 'Q1' as Quarter, autoLoad = true } = options || {};

  // ========== STATE ==========
  const [viewYear, setViewYear] = useState<number>(initialYear);
  const [viewQuarter, setViewQuarter] = useState<Quarter>(initialQuarter);
  const [query, setQuery] = useState<string>('');

  const [sections, setSections] = useState<PasarSection[]>([]);
  const [indikators, setIndikators] = useState<PasarIndikator[]>([]);
  const [sectionsWithIndicators, setSectionsWithIndicators] = useState<
    Array<
      PasarSection & {
        indicators: PasarIndikator[];
        totalWeighted?: number;
        indicatorCount: number;
        hasIndicators: boolean;
      }
    >
  >([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [allSections, setAllSections] = useState<PasarSection[]>([]);
  const [totalWeighted, setTotalWeighted] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingAllSections, setLoadingAllSections] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ========== EFFECTS ==========
  useEffect(() => {
    if (autoLoad) {
      loadInitialData();
    }
  }, []);

  useEffect(() => {
    if (autoLoad && viewYear && viewQuarter) {
      loadDataByPeriod();
    }
  }, [viewYear, viewQuarter]);

  // ========== UTILITIES ==========
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((err: any, operation: string) => {
    console.error(`[PASAR HOOK] Error during ${operation}:`, err);
    const errorMessage = err.message || `Gagal melakukan ${operation}`;
    setError(errorMessage);
    throw err;
  }, []);

  // ========== DATA LOADING ==========
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([getSections(), getPeriods(), loadDataByPeriod()]);
    } catch (err) {
      handleError(err, 'memuat data awal');
    } finally {
      setLoading(false);
    }
  }, [viewYear, viewQuarter]);

  const loadDataByPeriod = useCallback(async () => {
    try {
      setLoading(true);
      await getSectionsWithIndicatorsByPeriod(viewYear, viewQuarter);
      await calculateTotalWeighted();
    } catch (err) {
      handleError(err, 'memuat data periode');
    } finally {
      setLoading(false);
    }
  }, [viewYear, viewQuarter]);

  // ========== SECTION OPERATIONS ==========
  const getSections = useCallback(
    async (isActive?: boolean) => {
      try {
        setLoading(true);
        const data = await pasarApiService.getAllSections(isActive);
        setSections(data);
        return data;
      } catch (err) {
        throw handleError(err, 'mengambil sections');
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const getSectionsByPeriod = useCallback(
    async (year: number, quarter: Quarter): Promise<PasarSection[]> => {
      try {
        setLoading(true);
        const data = await pasarApiService.getSectionsByPeriod(year, quarter);
        return data;
      } catch (err) {
        throw handleError(err, `mengambil sections periode ${year}-${quarter}`);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const getAllSections = useCallback(
    async (isActive?: boolean): Promise<PasarSection[]> => {
      try {
        setLoadingAllSections(true);
        const data = await pasarApiService.getAllSections(isActive);
        setAllSections(data);
        return data;
      } catch (err) {
        throw handleError(err, 'mengambil semua sections');
      } finally {
        setLoadingAllSections(false);
      }
    },
    [handleError]
  );

  const getSectionById = useCallback(
    async (id: number): Promise<PasarSection> => {
      try {
        setLoading(true);
        const data = await pasarApiService.getSectionById(id);
        return data;
      } catch (err) {
        throw handleError(err, `mengambil section dengan ID ${id}`);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const createSection = useCallback(
    async (data: CreatePasarSectionData): Promise<PasarSection> => {
      try {
        setLoading(true);
        console.log('[PASAR HOOK] Creating section with data:', data);
        const newSection = await pasarApiService.createSection(data);

        // Update sections state
        setSections((prev) => [...prev, newSection]);
        setAllSections((prev) => [...prev, newSection]);

        return newSection;
      } catch (err) {
        throw handleError(err, 'membuat section');
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const updateSection = useCallback(
    async (id: number, data: UpdatePasarSectionData): Promise<PasarSection> => {
      try {
        setLoading(true);
        const updatedSection = await pasarApiService.updateSection(id, data);

        // Update sections state
        setSections((prev) => prev.map((section) => (section.id === id ? updatedSection : section)));
        setAllSections((prev) => prev.map((section) => (section.id === id ? updatedSection : section)));

        // Update sections with indicators
        setSectionsWithIndicators((prev) =>
          prev.map((section) =>
            section.id === id
              ? {
                  ...section,
                  no: updatedSection.no,
                  parameter: updatedSection.parameter,
                  bobotSection: updatedSection.bobotSection,
                }
              : section
          )
        );

        return updatedSection;
      } catch (err) {
        throw handleError(err, `mengupdate section dengan ID ${id}`);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const deleteSection = useCallback(
    async (id: number): Promise<void> => {
      try {
        setLoading(true);
        await pasarApiService.deleteSection(id);

        // Update sections state
        setSections((prev) => prev.filter((section) => section.id !== id));
        setAllSections((prev) => prev.filter((section) => section.id !== id));

        // Remove from sections with indicators
        setSectionsWithIndicators((prev) => prev.filter((section) => section.id !== id));
      } catch (err) {
        throw handleError(err, `menghapus section dengan ID ${id}`);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  // ========== INDIKATOR OPERATIONS ==========
  const getAllIndikators = useCallback(async () => {
    try {
      setLoading(true);
      const data = await pasarApiService.getAllIndikators();
      setIndikators(data);
      return data;
    } catch (err) {
      throw handleError(err, 'mengambil semua indikator');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const getIndikatorsByPeriod = useCallback(
    async (year: number, quarter: Quarter): Promise<PasarIndikator[]> => {
      try {
        setLoading(true);
        const data = await pasarApiService.getIndikatorsByPeriod(year, quarter);
        setIndikators(data);
        return data;
      } catch (err) {
        throw handleError(err, `mengambil indikator periode ${year}-${quarter}`);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const getSectionsWithIndicatorsByPeriod = useCallback(
    async (year: number, quarter: Quarter) => {
      try {
        setLoading(true);
        const response: SectionsWithIndicatorsResponse = await pasarApiService.getSectionsWithIndicatorsByPeriod(year, quarter);

        console.log('[PASAR HOOK] Sections with indicators response:', response);

        // Extract sections from response
        let sectionsData = [];
        if (response && response.sections) {
          sectionsData = response.sections;
        } else if (response && response.sectionsWithIndicators) {
          sectionsData = response.sectionsWithIndicators;
        }

        setSectionsWithIndicators(sectionsData);
        setTotalWeighted(response.overallTotalWeighted || 0);

        return sectionsData;
      } catch (err) {
        throw handleError(err, `mengambil sections dengan indikator periode ${year}-${quarter}`);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const searchIndikators = useCallback(
    async (searchQuery?: string, year?: number, quarter?: Quarter): Promise<PasarIndikator[]> => {
      try {
        setLoading(true);
        const data = await pasarApiService.searchIndikators(searchQuery, year, quarter);
        return data;
      } catch (err) {
        throw handleError(err, 'mencari indikator');
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const getIndikatorById = useCallback(
    async (id: number): Promise<PasarIndikator> => {
      try {
        setLoading(true);
        const data = await pasarApiService.getIndikatorById(id);
        return data;
      } catch (err) {
        throw handleError(err, `mengambil indikator dengan ID ${id}`);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const createIndikator = useCallback(async (data: CreatePasarData): Promise<PasarIndikator> => {
    try {
      setLoading(true);
      console.log('[PASAR HOOK] Creating indikator with data:', data);
      const newIndikator = await pasarApiService.createIndikator(data);

      // Update indikators list
      setIndikators((prev) => [...prev, newIndikator]);

      // Update sections with indicators
      setSectionsWithIndicators((prev) => {
        const sectionIndex = prev.findIndex((s) => s.id === data.sectionId);
        if (sectionIndex !== -1) {
          const updated = [...prev];
          updated[sectionIndex] = {
            ...updated[sectionIndex],
            indicators: [...updated[sectionIndex].indicators, newIndikator],
            indicatorCount: updated[sectionIndex].indicatorCount + 1,
          };
          return updated;
        }
        return prev;
      });

      return newIndikator;
    } catch (err) {
      throw handleError(err, 'membuat indikator');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateIndikator = useCallback(async (id: number, data: UpdatePasarData): Promise<PasarIndikator> => {
    try {
      setLoading(true);
      const updatedIndikator = await pasarApiService.updateIndikator(id, data);

      // Update indikators list
      setIndikators((prev) => prev.map((indikator) => (indikator.id === id ? updatedIndikator : indikator)));

      // Update sections with indicators
      setSectionsWithIndicators((prev) =>
        prev.map((section) => {
          const updatedIndicators = section.indicators.map((indikator) => (indikator.id === id ? updatedIndikator : indikator));
          return { ...section, indicators: updatedIndicators };
        })
      );

      return updatedIndikator;
    } catch (err) {
      throw handleError(err, `mengupdate indikator dengan ID ${id}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteIndikator = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      await pasarApiService.deleteIndikator(id);

      // Update indikators list
      setIndikators((prev) => prev.filter((indikator) => indikator.id !== id));

      // Update sections with indicators
      setSectionsWithIndicators((prev) =>
        prev.map((section) => ({
          ...section,
          indicators: section.indicators.filter((indikator: { id: number }) => indikator.id !== id),
          indicatorCount: section.indicators.filter((indikator: { id: number }) => indikator.id !== id).length,
        }))
      );
    } catch (err) {
      throw handleError(err, `menghapus indikator dengan ID ${id}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== HELPER OPERATIONS ==========
  const getTotalWeightedByPeriod = useCallback(
    async (year: number, quarter: Quarter): Promise<number> => {
      try {
        setLoading(true);
        const total = await pasarApiService.getTotalWeightedByPeriod(year, quarter);
        return total;
      } catch (err) {
        throw handleError(err, `menghitung total weighted periode ${year}-${quarter}`);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const calculateTotalWeighted = useCallback(async () => {
    try {
      const total = await getTotalWeightedByPeriod(viewYear, viewQuarter);
      setTotalWeighted(total);
    } catch (err) {
      setTotalWeighted(0);
      handleError(err, `menghitung total weighted periode ${viewYear}-${viewQuarter}`);
    }
  }, [viewYear, viewQuarter, getTotalWeightedByPeriod, handleError]);

  const getPeriods = useCallback(async () => {
    try {
      setLoading(true);
      const data = await pasarApiService.getAvailablePeriods();
      setPeriods(data);
      return data;
    } catch (err) {
      throw handleError(err, 'mengambil periode tersedia');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const duplicateIndikator = useCallback(async (sourceId: number, targetYear: number, targetQuarter: Quarter): Promise<PasarIndikator> => {
    try {
      setLoading(true);
      const newIndikator = await pasarApiService.duplicateIndikator(sourceId, targetYear, targetQuarter);

      // Add to indikators list
      setIndikators((prev) => [...prev, newIndikator]);

      return newIndikator;
    } catch (err) {
      throw handleError(err, 'menduplikasi indikator');
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== RETURN ==========
  return {
    // State
    sections,
    indikators,
    sectionsWithIndicators,
    periods,
    allSections,
    viewYear,
    viewQuarter,
    query,
    loading,
    loadingAllSections,
    error,
    totalWeighted,

    // Actions
    setViewYear,
    setViewQuarter,
    setQuery,
    clearError,

    // Data operations
    getSections,
    getAllIndikators,
    getIndikatorsByPeriod,
    getSectionsWithIndicatorsByPeriod,
    getPeriods,
    searchIndikators,
    getAllSections,
    getSectionsByPeriod,

    // CRUD operations
    createSection,
    getSectionById,
    updateSection,
    deleteSection,
    createIndikator,
    getIndikatorById,
    updateIndikator,
    deleteIndikator,

    // Helper operations
    getTotalWeightedByPeriod,
    calculateTotalWeighted,
    duplicateIndikator,

    // Transformations
    transformToBackend: transformIndicatorToBackend,
    transformToFrontend: transformIndicatorToFrontend,
    transformSectionToBackend,
    computeHasil,
    computeWeightedAuto,

    // Templates
    emptyIndicator,
    emptySection,
  };
};
