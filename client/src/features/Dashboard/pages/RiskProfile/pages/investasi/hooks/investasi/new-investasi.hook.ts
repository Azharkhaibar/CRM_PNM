// src/features/Dashboard/pages/RiskProfile/pages/Investasi/hooks/useInvestasi.ts
import { useCallback, useEffect, useState } from 'react';
// import {
//   Quarter,
//   computeHasil,
//   computeWeightedAuto,
//   CreateInvestasiData,
//   CreateInvestasiSectionData,
//   Period,
//   InvestasiIndikator,
//   InvestasiSection,
//   transformIndicatorToBackend,
//   UpdateInvestasiData,
//   UpdateInvestasiSectionData,
//   transformSectionToBackend,
//   transformIndicatorToFrontend,
//   investasiApiService,
// } from '../services/investasi.service';

import { Quarter, computeHasil, computeWeightedAuto, CreateInvestasiData, CreateInvestasiSectionData, Period, InvestasiIndikator, InvestasiSection, investasiApiService, transformIndicatorToBackend, transformIndicatorToFrontend, transformSectionToBackend, UpdateInvestasiData, UpdateInvestasiSectionData} from '../../service/new-investasi.service';

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

interface UseInvestasiOptions {
  initialYear?: number;
  initialQuarter?: Quarter;
  autoLoad?: boolean;
}

interface UseInvestasiReturn {
  // ========== STATE ==========
  // Data
  sections: InvestasiSection[];
  indikators: InvestasiIndikator[];
  sectionsWithIndicators: Array<InvestasiSection & { indicators: InvestasiIndikator[] }>;
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
  getIndikatorsByPeriod: (year: number, quarter: Quarter) => Promise<InvestasiIndikator[]>;
  getSectionsWithIndicatorsByPeriod: (year: number, quarter: Quarter) => Promise<Array<InvestasiSection & { indicators: InvestasiIndikator[] }>>;
  getPeriods: () => Promise<void>;
  searchIndikators: (query?: string, year?: number, quarter?: Quarter) => Promise<InvestasiIndikator[]>;
  getAllSections: (isActive?: boolean) => Promise<InvestasiSection[]>;

  // ========== CRUD OPERATIONS ==========
  // Section CRUD
  createSection: (data: CreateInvestasiSectionData) => Promise<InvestasiSection>;
  getSectionById: (id: number) => Promise<InvestasiSection>;
  updateSection: (id: number, data: UpdateInvestasiSectionData) => Promise<InvestasiSection>;
  deleteSection: (id: number) => Promise<void>;

  // Indikator CRUD
  createIndikator: (data: CreateInvestasiData) => Promise<InvestasiIndikator>;
  getIndikatorById: (id: number) => Promise<InvestasiIndikator>;
  updateIndikator: (id: number, data: UpdateInvestasiData) => Promise<InvestasiIndikator>;
  deleteIndikator: (id: number) => Promise<void>;

  // ========== HELPER OPERATIONS ==========
  // Calculations
  getTotalWeightedByPeriod: (year: number, quarter: Quarter) => Promise<number>;
  calculateTotalWeighted: () => Promise<void>;
  duplicateIndikator: (sourceId: number, targetYear: number, targetQuarter: Quarter) => Promise<InvestasiIndikator>;

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

export const useInvestasi = (options?: UseInvestasiOptions): UseInvestasiReturn => {
  const { initialYear = new Date().getFullYear(), initialQuarter = 'Q1' as Quarter, autoLoad = true } = options || {};

  // ========== STATE ==========
  const [viewYear, setViewYear] = useState<number>(initialYear);
  const [viewQuarter, setViewQuarter] = useState<Quarter>(initialQuarter);
  const [query, setQuery] = useState<string>('');

  const [sections, setSections] = useState<InvestasiSection[]>([]);
  const [indikators, setIndikators] = useState<InvestasiIndikator[]>([]);
  const [sectionsWithIndicators, setSectionsWithIndicators] = useState<Array<InvestasiSection & { indicators: InvestasiIndikator[] }>>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [totalWeighted, setTotalWeighted] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);
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
    console.error(`Error during ${operation}:`, err);
    const errorMessage = err.message || `Gagal melakukan ${operation}`;
    setError(errorMessage);
    throw err; // Lempar error agar bisa ditangkap di component
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
        const data = await investasiApiService.getAllSections(isActive);
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

  const getAllSections = useCallback(
    async (isActive?: boolean): Promise<InvestasiSection[]> => {
      try {
        setLoading(true);
        const data = await investasiApiService.getAllSections(isActive);
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
    async (id: number): Promise<InvestasiSection> => {
      try {
        setLoading(true);
        const data = await investasiApiService.getSectionById(id);
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
    async (data: CreateInvestasiSectionData): Promise<InvestasiSection> => {
      try {
        setLoading(true);
        const newSection = await investasiApiService.createSection(data);
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
    async (id: number, data: UpdateInvestasiSectionData): Promise<InvestasiSection> => {
      try {
        setLoading(true);
        const updatedSection = await investasiApiService.updateSection(id, data);
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
        await investasiApiService.deleteSection(id);
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
      const data = await investasiApiService.getAllIndikators();
      setIndikators(data);
      return data;
    } catch (err) {
      throw handleError(err, 'mengambil semua indikator');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const getIndikatorsByPeriod = useCallback(
    async (year: number, quarter: Quarter): Promise<InvestasiIndikator[]> => {
      try {
        setLoading(true);
        const data = await investasiApiService.getIndikatorsByPeriod(year, quarter);
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
    async (year: number, quarter: Quarter): Promise<Array<InvestasiSection & { indicators: InvestasiIndikator[] }>> => {
      try {
        setLoading(true);
        const response = await investasiApiService.getSectionsWithIndicatorsByPeriod(year, quarter);

        // Handle response structure
        let data = [];
        if (response && typeof response === 'object') {
          if (Array.isArray(response.sections)) {
            data = response.sections;
          } else if (Array.isArray(response)) {
            data = response;
          } else if (response.data && Array.isArray(response.data.sections)) {
            data = response.data.sections;
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
    async (searchQuery?: string, year?: number, quarter?: Quarter): Promise<InvestasiIndikator[]> => {
      try {
        setLoading(true);
        const data = await investasiApiService.searchIndikators(searchQuery, year, quarter);
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
    async (id: number): Promise<InvestasiIndikator> => {
      try {
        setLoading(true);
        const data = await investasiApiService.getIndikatorById(id);
        return data;
      } catch (err) {
        throw handleError(err, `mengambil indikator dengan ID ${id}`);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const createIndikator = useCallback(async (data: CreateInvestasiData): Promise<InvestasiIndikator> => {
    try {
      setLoading(true);
      const newIndikator = await investasiApiService.createIndikator(data);

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

  const updateIndikator = useCallback(async (id: number, data: UpdateInvestasiData): Promise<InvestasiIndikator> => {
    try {
      setLoading(true);
      const updatedIndikator = await investasiApiService.updateIndikator(id, data);

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
      await investasiApiService.deleteIndikator(id);

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
        const total = await investasiApiService.getTotalWeightedByPeriod(year, quarter);
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
      const data = await investasiApiService.getAvailablePeriods();
      setPeriods(data);
      return data;
    } catch (err) {
      throw handleError(err, 'mengambil periode tersedia');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const duplicateIndikator = useCallback(async (sourceId: number, targetYear: number, targetQuarter: Quarter): Promise<InvestasiIndikator> => {
    try {
      setLoading(true);
      const newIndikator = await investasiApiService.duplicateIndikator(sourceId, targetYear, targetQuarter);

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
