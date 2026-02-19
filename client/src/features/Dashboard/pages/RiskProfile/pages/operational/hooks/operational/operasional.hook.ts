// src/features/Dashboard/pages/RiskProfile/pages/Operasional/hooks/useOperasional.ts

import { useCallback, useEffect, useState } from 'react';
// import {
//   Quarter,
//   computeHasil,
//   computeWeightedAuto,
//   CreateOperasionalData,
//   CreateOperasionalSectionData,
//   Period,
//   OperasionalIndikator,
//   OperasionalSection,
//   transformIndicatorToBackend,
//   UpdateOperasionalData,
//   UpdateOperasionalSectionData,
//   transformSectionToBackend,
//   transformIndicatorToFrontend,
//   operasionalApiService,
// } from '../services/operasional.service';

import {
  Quarter,
  computeHasil,
  computeWeightedAuto,
  CreateOperasionalData,
  CreateOperasionalSectionData,
  Period,
  OperasionalIndikator,
  OperasionalSection,
  transformIndicatorToBackend,
  transformIndicatorToFrontend,
  transformSectionToBackend,
  UpdateOperasionalData,
  UpdateOperasionalSectionData,
  operasionalApiService,
} from '../../services/operational/operasional.service';

// EMPTY TEMPLATES
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

interface UseOperasionalOptions {
  initialYear?: number;
  initialQuarter?: Quarter;
  autoLoad?: boolean;
}

interface UseOperasionalReturn {
  // STATE
  sections: OperasionalSection[];
  indikators: OperasionalIndikator[];
  sectionsWithIndicators: Array<OperasionalSection & { indicators: OperasionalIndikator[] }>;
  periods: Period[];
  viewYear: number;
  viewQuarter: Quarter;
  query: string;
  loading: boolean;
  error: string | null;
  totalWeighted: number;

  // ACTIONS
  setViewYear: (year: number) => void;
  setViewQuarter: (quarter: Quarter) => void;
  setQuery: (query: string) => void;
  clearError: () => void;

  // DATA OPERATIONS
  getSections: (isActive?: boolean) => Promise<void>;
  getAllIndikators: () => Promise<void>;
  getIndikatorsByPeriod: (year: number, quarter: Quarter) => Promise<OperasionalIndikator[]>;
  getSectionsWithIndicatorsByPeriod: (year: number, quarter: Quarter) => Promise<Array<OperasionalSection & { indicators: OperasionalIndikator[] }>>;
  getPeriods: () => Promise<void>;
  searchIndikators: (query?: string, year?: number, quarter?: Quarter) => Promise<OperasionalIndikator[]>;
  getAllSections: (isActive?: boolean) => Promise<OperasionalSection[]>;

  // CRUD OPERATIONS
  createSection: (data: CreateOperasionalSectionData) => Promise<OperasionalSection>;
  getSectionById: (id: number) => Promise<OperasionalSection>;
  updateSection: (id: number, data: UpdateOperasionalSectionData) => Promise<OperasionalSection>;
  deleteSection: (id: number) => Promise<void>;
  createIndikator: (data: CreateOperasionalData) => Promise<OperasionalIndikator>;
  getIndikatorById: (id: number) => Promise<OperasionalIndikator>;
  updateIndikator: (id: number, data: UpdateOperasionalData) => Promise<OperasionalIndikator>;
  deleteIndikator: (id: number) => Promise<void>;

  // HELPER OPERATIONS
  getTotalWeightedByPeriod: (year: number, quarter: Quarter) => Promise<number>;
  calculateTotalWeighted: () => Promise<void>;
  duplicateIndikator: (sourceId: number, targetYear: number, targetQuarter: Quarter) => Promise<OperasionalIndikator>;

  // TRANSFORMATIONS
  transformToBackend: typeof transformIndicatorToBackend;
  transformToFrontend: typeof transformIndicatorToFrontend;
  transformSectionToBackend: typeof transformSectionToBackend;
  computeHasil: typeof computeHasil;
  computeWeightedAuto: typeof computeWeightedAuto;

  // TEMPLATES
  emptyIndicator: typeof emptyIndicator;
  emptySection: typeof emptySection;
}

export const useOperasional = (options?: UseOperasionalOptions): UseOperasionalReturn => {
  const { initialYear = new Date().getFullYear(), initialQuarter = 'Q1' as Quarter, autoLoad = true } = options || {};

  // STATE
  const [viewYear, setViewYear] = useState<number>(initialYear);
  const [viewQuarter, setViewQuarter] = useState<Quarter>(initialQuarter);
  const [query, setQuery] = useState<string>('');

  const [sections, setSections] = useState<OperasionalSection[]>([]);
  const [indikators, setIndikators] = useState<OperasionalIndikator[]>([]);
  const [sectionsWithIndicators, setSectionsWithIndicators] = useState<Array<OperasionalSection & { indicators: OperasionalIndikator[] }>>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [totalWeighted, setTotalWeighted] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // EFFECTS
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

  // UTILITIES
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((err: any, operation: string) => {
    console.error(`Error during ${operation}:`, err);
    const errorMessage = err.message || `Gagal melakukan ${operation}`;
    setError(errorMessage);
    throw err;
  }, []);

  // DATA LOADING
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

  // SECTION OPERATIONS
  const getSections = useCallback(
    async (isActive?: boolean) => {
      try {
        setLoading(true);
        const data = await operasionalApiService.getAllSections(isActive);
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
    async (isActive?: boolean): Promise<OperasionalSection[]> => {
      try {
        setLoading(true);
        const data = await operasionalApiService.getAllSections(isActive);
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
    async (id: number): Promise<OperasionalSection> => {
      try {
        setLoading(true);
        const data = await operasionalApiService.getSectionById(id);
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
    async (data: CreateOperasionalSectionData): Promise<OperasionalSection> => {
      try {
        setLoading(true);
        const newSection = await operasionalApiService.createSection(data);
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
    async (id: number, data: UpdateOperasionalSectionData): Promise<OperasionalSection> => {
      try {
        setLoading(true);
        const updatedSection = await operasionalApiService.updateSection(id, data);
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
        await operasionalApiService.deleteSection(id);
        setSections((prev) => prev.filter((section) => section.id !== id));
        setSectionsWithIndicators((prev) => prev.filter((section) => section.id !== id));
      } catch (err) {
        throw handleError(err, `menghapus section dengan ID ${id}`);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  // INDIKATOR OPERATIONS
  const getAllIndikators = useCallback(async () => {
    try {
      setLoading(true);
      const data = await operasionalApiService.getAllIndikators();
      setIndikators(data);
      return data;
    } catch (err) {
      throw handleError(err, 'mengambil semua indikator');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const getIndikatorsByPeriod = useCallback(
    async (year: number, quarter: Quarter): Promise<OperasionalIndikator[]> => {
      try {
        setLoading(true);
        const data = await operasionalApiService.getIndikatorsByPeriod(year, quarter);
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
    async (year: number, quarter: Quarter): Promise<Array<OperasionalSection & { indicators: OperasionalIndikator[] }>> => {
      try {
        setLoading(true);
        const response = await operasionalApiService.getSectionsWithIndicatorsByPeriod(year, quarter);

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
    async (searchQuery?: string, year?: number, quarter?: Quarter): Promise<OperasionalIndikator[]> => {
      try {
        setLoading(true);
        const data = await operasionalApiService.searchIndikators(searchQuery, year, quarter);
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
    async (id: number): Promise<OperasionalIndikator> => {
      try {
        setLoading(true);
        const data = await operasionalApiService.getIndikatorById(id);
        return data;
      } catch (err) {
        throw handleError(err, `mengambil indikator dengan ID ${id}`);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const createIndikator = useCallback(async (data: CreateOperasionalData): Promise<OperasionalIndikator> => {
    try {
      setLoading(true);
      const newIndikator = await operasionalApiService.createIndikator(data);

      setIndikators((prev) => [...prev, newIndikator]);

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

  const updateIndikator = useCallback(async (id: number, data: UpdateOperasionalData): Promise<OperasionalIndikator> => {
    try {
      setLoading(true);
      const updatedIndikator = await operasionalApiService.updateIndikator(id, data);

      setIndikators((prev) => prev.map((indikator) => (indikator.id === id ? updatedIndikator : indikator)));

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
      await operasionalApiService.deleteIndikator(id);

      setIndikators((prev) => prev.filter((indikator) => indikator.id !== id));

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

  // HELPER OPERATIONS
  const getTotalWeightedByPeriod = useCallback(
    async (year: number, quarter: Quarter): Promise<number> => {
      try {
        setLoading(true);
        const total = await operasionalApiService.getTotalWeightedByPeriod(year, quarter);
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
      const data = await operasionalApiService.getAvailablePeriods();
      setPeriods(data);
      return data;
    } catch (err) {
      throw handleError(err, 'mengambil periode tersedia');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const duplicateIndikator = useCallback(async (sourceId: number, targetYear: number, targetQuarter: Quarter): Promise<OperasionalIndikator> => {
    try {
      setLoading(true);
      const newIndikator = await operasionalApiService.duplicateIndikator(sourceId, targetYear, targetQuarter);

      setIndikators((prev) => [...prev, newIndikator]);

      return newIndikator;
    } catch (err) {
      throw handleError(err, 'menduplikasi indikator');
    } finally {
      setLoading(false);
    }
  }, []);

  // RETURN
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
