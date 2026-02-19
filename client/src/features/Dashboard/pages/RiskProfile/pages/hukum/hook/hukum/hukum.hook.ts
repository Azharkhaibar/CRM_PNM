// src/features/Dashboard/pages/RiskProfile/pages/Strategik/hooks/useStrategik.ts

import { useCallback, useEffect, useState } from 'react';
import {
  Quarter,
  computeHasil,
  computeWeightedAuto,
  CreateHukumSectionData,
  CreateHukumData,
  Period,
  HukumIndikator,
  HukumSection,
  transformIndicatorToBackend,
  transformIndicatorToFrontend,
  transformSectionToBackend,
  UpdateHukumData,
  UpdateHukumSectionData,
  hukumApiService,
} from '../../service/hukum/hukum.service';

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

interface UseHukumOptions {
  initialYear?: number;
  initialQuarter?: Quarter;
  autoLoad?: boolean;
}

interface UseHukumReturn {
  // ========== STATE ==========
  // Data
  sections: HukumSection[];
  indikators: HukumIndikator[];
  sectionsWithIndicators: Array<HukumSection & { indicators: HukumIndikator[] }>;
  periods: Period[];

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
  getIndikatorsByPeriod: (year: number, quarter: Quarter) => Promise<HukumIndikator[]>;
  getSectionsWithIndicatorsByPeriod: (year: number, quarter: Quarter) => Promise<Array<HukumSection & { indicators: HukumIndikator[] }>>;
  getPeriods: () => Promise<void>;
  searchIndikators: (query?: string, year?: number, quarter?: Quarter) => Promise<HukumIndikator[]>;
  getAllSections: (isActive?: boolean) => Promise<HukumSection[]>;

  // ========== CRUD OPERATIONS ==========
  // Section CRUD
  createSection: (data: CreateHukumSectionData) => Promise<HukumSection>;
  getSectionById: (id: number) => Promise<HukumSection>;
  updateSection: (id: number, data: UpdateHukumSectionData) => Promise<HukumSection>;
  deleteSection: (id: number) => Promise<void>;

  // Indikator CRUD
  createIndikator: (data: CreateHukumData) => Promise<HukumIndikator>;
  getIndikatorById: (id: number) => Promise<HukumIndikator>;
  updateIndikator: (id: number, data: UpdateHukumData) => Promise<HukumIndikator>;
  deleteIndikator: (id: number) => Promise<void>;

  // ========== HELPER OPERATIONS ==========
  // Calculations
  getTotalWeightedByPeriod: (year: number, quarter: Quarter) => Promise<number>;
  calculateTotalWeighted: () => Promise<void>;
  duplicateIndikator: (sourceId: number, targetYear: number, targetQuarter: Quarter) => Promise<HukumIndikator>;

  // Transformations
  transformToBackend: typeof transformIndicatorToBackend;
  transformToFrontend: typeof transformIndicatorToFrontend;
  transformSectionToBackend: typeof transformSectionToBackend;
  computeHasil: typeof computeHasil;
  computeWeightedAuto: typeof computeWeightedAuto;

  // Templates
  emptyIndicator: typeof emptyIndicator;
  emptySection: typeof emptySection;
}

export const useHukum = (options?: UseHukumOptions): UseHukumReturn => {
  const { initialYear = new Date().getFullYear(), initialQuarter = 'Q1' as Quarter, autoLoad = true } = options || {};

  // ========== STATE ==========
  const [viewYear, setViewYear] = useState<number>(initialYear);
  const [viewQuarter, setViewQuarter] = useState<Quarter>(initialQuarter);
  const [query, setQuery] = useState<string>('');

  const [sections, setSections] = useState<HukumSection[]>([]);
  const [indikators, setIndikators] = useState<HukumIndikator[]>([]);
  const [sectionsWithIndicators, setSectionsWithIndicators] = useState<Array<HukumSection & { indicators: HukumIndikator[] }>>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [totalWeighted, setTotalWeighted] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ========== UTILITIES ==========
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((err: any, operation: string) => {
    console.error(`Error during ${operation}:`, err);
    const errorMessage = err.message || `Gagal melakukan ${operation}`;
    setError(errorMessage);
    throw err;
  }, []);

  // ========== DATA LOADING ==========
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

  useEffect(() => {
    if (autoLoad) {
      loadInitialData();
    }
  }, []);

  useEffect(() => {
    if (autoLoad && viewYear && viewQuarter) {
      loadDataByPeriod();
    }
  }, [viewYear, viewQuarter, autoLoad]);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([getSections(), getPeriods(), loadDataByPeriod()]);
    } catch (err) {
      handleError(err, 'memuat data awal');
    } finally {
      setLoading(false);
    }
  }, [viewYear, viewQuarter, loadDataByPeriod]);

  // ========== SECTION OPERATIONS ==========
  const getSections = useCallback(
    async (isActive?: boolean) => {
      try {
        setLoading(true);
        const data = await hukumApiService.getAllSections(isActive);
        setSections(data);
      } catch (err) {
        throw handleError(err, 'mengambil sections');
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const getAllSections = useCallback(
    async (isActive?: boolean): Promise<HukumSection[]> => {
      try {
        setLoading(true);
        const data = await hukumApiService.getAllSections(isActive);
        return data;
      } catch (err) {
        throw handleError(err, 'mengambil semua sections');
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const getSectionById = useCallback(
    async (id: number): Promise<HukumSection> => {
      try {
        setLoading(true);
        const data = await hukumApiService.getSectionById(id);
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
    async (data: CreateHukumSectionData): Promise<HukumSection> => {
      try {
        setLoading(true);
        const newSection = await hukumApiService.createSection(data);

        // Update sections state
        setSections((prev) => [...prev, newSection]);

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
    async (id: number, data: UpdateHukumSectionData): Promise<HukumSection> => {
      try {
        setLoading(true);
        const updatedSection = await hukumApiService.updateSection(id, data);

        // Update sections state
        setSections((prev) => prev.map((section) => (section.id === id ? updatedSection : section)));

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
        await hukumApiService.deleteSection(id);

        // Remove from sections state
        setSections((prev) => prev.filter((section) => section.id !== id));

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
      const data = await hukumApiService.getAllIndikators();
      setIndikators(data);
    } catch (err) {
      throw handleError(err, 'mengambil semua indikator');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const getIndikatorsByPeriod = useCallback(
    async (year: number, quarter: Quarter): Promise<HukumIndikator[]> => {
      try {
        setLoading(true);
        const data = await hukumApiService.getIndikatorsByPeriod(year, quarter);
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
    async (year: number, quarter: Quarter): Promise<Array<HukumSection & { indicators: HukumIndikator[] }>> => {
      try {
        setLoading(true);
        const response = await hukumApiService.getSectionsWithIndicatorsByPeriod(year, quarter);

        let data: Array<HukumSection & { indicators: HukumIndikator[] }> = [];

        if (response && typeof response === 'object') {
          if (Array.isArray(response.sections)) {
            data = response.sections;
          } else if (Array.isArray(response)) {
            data = response;
          } else if (response.data?.sections && Array.isArray(response.data.sections)) {
            data = response.data.sections;
          } else if (response.sections && Array.isArray(response.sections)) {
            data = response.sections;
          }
        }

        setSectionsWithIndicators(data);
        return data;
      } catch (err) {
        throw handleError(err, `mengambil sections dengan indikator periode ${year}-${quarter}`);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const searchIndikators = useCallback(
    async (searchQuery?: string, year?: number, quarter?: Quarter): Promise<HukumIndikator[]> => {
      try {
        setLoading(true);
        const data = await hukumApiService.searchIndikators(searchQuery, year, quarter);
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
    async (id: number): Promise<HukumIndikator> => {
      try {
        setLoading(true);
        const data = await hukumApiService.getIndikatorById(id);
        return data;
      } catch (err) {
        throw handleError(err, `mengambil indikator dengan ID ${id}`);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const createIndikator = useCallback(async (data: CreateHukumData): Promise<HukumIndikator> => {
    try {
      setLoading(true);
      const newIndikator = await hukumApiService.createIndikator(data);

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

  const updateIndikator = useCallback(async (id: number, data: UpdateHukumData): Promise<HukumIndikator> => {
    try {
      setLoading(true);
      const updatedIndikator = await hukumApiService.updateIndikator(id, data);

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
      await hukumApiService.deleteIndikator(id);

      // Update indikators list
      setIndikators((prev) => prev.filter((indikator) => indikator.id !== id));

      // Update sections with indicators
      setSectionsWithIndicators((prev) =>
        prev.map((section) => ({
          ...section,
          indicators: section.indicators.filter((indikator) => indikator.id !== id),
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
        const total = await hukumApiService.getTotalWeightedByPeriod(year, quarter);
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
      const data = await hukumApiService.getAvailablePeriods();
      setPeriods(data);
    } catch (err) {
      throw handleError(err, 'mengambil periode tersedia');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const duplicateIndikator = useCallback(async (sourceId: number, targetYear: number, targetQuarter: Quarter): Promise<HukumIndikator> => {
    try {
      setLoading(true);
      const newIndikator = await hukumApiService.duplicateIndikator(sourceId, targetYear, targetQuarter);

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
    viewYear,
    viewQuarter,
    query,
    loading,
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
