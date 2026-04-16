// src/features/Dashboard/pages/RiskProfile/pages/Pasar/hooks/KPMR/kpmr-pasar.hook.ts
import { useState, useEffect, useCallback } from 'react';
import {
  kpmrPasarApiService,
  KPMRPasarAspect,
  KPMRPasarQuestion,
  KPMRPasarDefinition,
  KPMRPasarScore,
  KPMRPasarFullDataResponse,
  CreateKPMRPasarAspectData,
  UpdateKPMRPasarAspectData,
  CreateKPMRPasarQuestionData,
  UpdateKPMRPasarQuestionData,
  CreateKPMRPasarDefinitionData,
  UpdateKPMRPasarDefinitionData,
  CreateKPMRPasarScoreData,
  UpdateKPMRPasarScoreData,
  Period,
  DeleteResponse,
  transformFullDataToGroups,
} from '../../service/kpmr-pasar/kpmr-pasar.service';

// ===================== INTERFACES =====================

export interface KPMRPasarFilters {
  year?: number;
  quarter?: string;
  aspekNo?: string;
  query?: string;
}

export interface KPMRPasarGroup {
  aspekNo: string;
  aspekTitle: string;
  aspekBobot: number;
  sections: Array<{
    sectionNo: string;
    sectionTitle: string;
    definitionId: number;
    level1: string | null;
    level2: string | null;
    level3: string | null;
    level4: string | null;
    level5: string | null;
    evidence: string | null;
    quarters: Record<
      string,
      {
        sectionSkor: number | null;
        id: number;
      }
    >;
  }>;
  quarterAverages: Record<string, number | null>;
}

export interface UseKpmrPasarReturn {
  // ========== STATE ==========
  aspects: KPMRPasarAspect[];
  questions: KPMRPasarQuestion[];
  definitions: KPMRPasarDefinition[];
  scores: KPMRPasarScore[];
  fullData: KPMRPasarFullDataResponse | null;
  groups: KPMRPasarGroup[];
  periods: Period[];
  years: number[];
  viewYear: number;
  viewQuarter: string;
  query: string;
  loading: boolean;
  error: string | null;

  // ========== STATE SETTERS ==========
  setViewYear: (year: number) => void;
  setViewQuarter: (quarter: string) => void;
  setQuery: (query: string) => void;
  clearError: () => void;

  // ========== DATA OPERATIONS ==========
  fetchAllData: (year?: number) => Promise<void>;
  fetchAspects: (year?: number) => Promise<void>;
  fetchQuestions: (year?: number) => Promise<void>;
  fetchDefinitions: (year?: number) => Promise<void>;
  fetchScores: (year?: number, quarter?: string) => Promise<void>;
  fetchFullData: (year: number) => Promise<void>;
  fetchPeriods: () => Promise<void>;
  fetchYears: () => Promise<void>;
  search: (year?: number, query?: string, aspekNo?: string) => Promise<KPMRPasarDefinition[]>;

  // ========== ASPECT CRUD ==========
  createAspect: (data: CreateKPMRPasarAspectData) => Promise<KPMRPasarAspect>;
  updateAspect: (id: number, data: UpdateKPMRPasarAspectData) => Promise<KPMRPasarAspect>;
  deleteAspect: (id: number) => Promise<DeleteResponse>;

  // ========== QUESTION CRUD ==========
  createQuestion: (data: CreateKPMRPasarQuestionData) => Promise<KPMRPasarQuestion>;
  updateQuestion: (id: number, data: UpdateKPMRPasarQuestionData) => Promise<KPMRPasarQuestion>;
  deleteQuestion: (id: number) => Promise<DeleteResponse>;

  // ========== DEFINITION CRUD ==========
  createOrUpdateDefinition: (data: CreateKPMRPasarDefinitionData) => Promise<KPMRPasarDefinition>;
  updateDefinition: (id: number, data: UpdateKPMRPasarDefinitionData) => Promise<KPMRPasarDefinition>;
  deleteDefinition: (definitionId: number, year: number) => Promise<DeleteResponse>;

  // ========== SCORE CRUD ==========
  createOrUpdateScore: (data: CreateKPMRPasarScoreData) => Promise<KPMRPasarScore>;
  updateScore: (id: number, data: UpdateKPMRPasarScoreData) => Promise<KPMRPasarScore>;
  deleteScore: (id: number) => Promise<DeleteResponse>;
  deleteScoreByTarget: (definitionId: number, year: number, quarter: string) => Promise<DeleteResponse>;

  // ========== UTILITIES ==========
  refetch: () => Promise<void>;
  resetState: () => void;
}

interface UseKpmrPasarOptions {
  initialYear?: number;
  initialQuarter?: string;
  autoLoad?: boolean;
}

// ===================== HOOK =====================

export const useKpmrPasar = (options?: UseKpmrPasarOptions): UseKpmrPasarReturn => {
  const { initialYear = new Date().getFullYear(), initialQuarter = 'Q1', autoLoad = true } = options || {};

  // ========== STATE ==========
  const [viewYear, setViewYear] = useState<number>(initialYear);
  const [viewQuarter, setViewQuarter] = useState<string>(initialQuarter);
  const [query, setQuery] = useState<string>('');
  const [aspects, setAspects] = useState<KPMRPasarAspect[]>([]);
  const [questions, setQuestions] = useState<KPMRPasarQuestion[]>([]);
  const [definitions, setDefinitions] = useState<KPMRPasarDefinition[]>([]);
  const [scores, setScores] = useState<KPMRPasarScore[]>([]);
  const [fullData, setFullData] = useState<KPMRPasarFullDataResponse | null>(null);
  const [groups, setGroups] = useState<KPMRPasarGroup[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ========== UTILITIES ==========
  const clearError = useCallback(() => setError(null), []);

  const resetState = useCallback(() => {
    setAspects([]);
    setQuestions([]);
    setDefinitions([]);
    setScores([]);
    setFullData(null);
    setGroups([]);
    setPeriods([]);
    setYears([]);
    setError(null);
  }, []);

  const handleError = useCallback((err: any, operation: string) => {
    console.error(`❌ Error during ${operation}:`, err);
    let errorMessage = 'Terjadi kesalahan';
    if (err instanceof Error) errorMessage = err.message;
    else if (typeof err === 'string') errorMessage = err;
    else if (err?.response?.data?.message) errorMessage = err.response.data.message;
    setError(errorMessage);
    throw err;
  }, []);

  const withLoading = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    try {
      setLoading(true);
      return await fn();
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== DATA FETCHING ==========
  const fetchAspects = useCallback(
    async (year?: number): Promise<void> => {
      try {
        const data = await withLoading(() => kpmrPasarApiService.getAllAspects(year));
        setAspects(data);
      } catch (err) {
        handleError(err, 'memuat aspek');
      }
    },
    [handleError, withLoading],
  );

  const fetchQuestions = useCallback(
    async (year?: number): Promise<void> => {
      try {
        const data = await withLoading(() => kpmrPasarApiService.getAllQuestions(year));
        setQuestions(data);
      } catch (err) {
        handleError(err, 'memuat pertanyaan');
      }
    },
    [handleError, withLoading],
  );

  const fetchDefinitions = useCallback(
    async (year?: number): Promise<void> => {
      try {
        const targetYear = year || viewYear;
        const data = await withLoading(() => kpmrPasarApiService.getDefinitionsByYear(targetYear));
        setDefinitions(data);
      } catch (err) {
        handleError(err, 'memuat definisi');
      }
    },
    [viewYear, handleError, withLoading],
  );

  const fetchScores = useCallback(
    async (year?: number, quarter?: string): Promise<void> => {
      try {
        const targetYear = year || viewYear;
        const data = await withLoading(() => kpmrPasarApiService.getScoresByPeriod(targetYear, quarter));
        setScores(data);
      } catch (err) {
        handleError(err, 'memuat skor');
      }
    },
    [viewYear, handleError, withLoading],
  );

  const fetchFullData = useCallback(async (year: number): Promise<void> => {
    if (!year || isNaN(year)) return;
    try {
      setLoading(true);
      const data = await kpmrPasarApiService.getFullData(year);
      setFullData(data);
      const transformedGroups = transformFullDataToGroups(data);
      setGroups(transformedGroups);
    } catch (err) {
      console.error(`❌ Error fetching data for year ${year}:`, err);
      setError(err?.response?.data?.message || err.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPeriods = useCallback(async (): Promise<void> => {
    try {
      const data = await withLoading(() => kpmrPasarApiService.getPeriods());
      setPeriods(data);
    } catch (err) {
      handleError(err, 'memuat periode');
    }
  }, [handleError, withLoading]);

  const fetchYears = useCallback(async (): Promise<void> => {
    try {
      const data = await withLoading(() => kpmrPasarApiService.getAvailableYears());
      setYears(data);
    } catch (err) {
      handleError(err, 'memuat tahun');
    }
  }, [handleError, withLoading]);

  const fetchAllData = useCallback(
    async (year?: number): Promise<void> => {
      try {
        await withLoading(async () => {
          const targetYear = year || viewYear;
          await Promise.all([fetchAspects(targetYear), fetchQuestions(targetYear), fetchDefinitions(targetYear), fetchScores(targetYear), fetchFullData(targetYear), fetchPeriods(), fetchYears()]);
        });
      } catch (err) {
        handleError(err, 'memuat semua data');
      }
    },
    [viewYear, fetchAspects, fetchQuestions, fetchDefinitions, fetchScores, fetchFullData, fetchPeriods, fetchYears, handleError, withLoading],
  );

  const search = useCallback(
    async (year?: number, searchQuery?: string, aspekNo?: string): Promise<KPMRPasarDefinition[]> => {
      try {
        return await withLoading(() => kpmrPasarApiService.searchKPMR(year, searchQuery || query, aspekNo));
      } catch (err) {
        handleError(err, 'mencari data');
        return [];
      }
    },
    [query, handleError, withLoading],
  );

  // ========== INITIAL LOAD ==========
  const loadInitialData = useCallback(async () => {
    try {
      await withLoading(async () => {
        await Promise.all([fetchAspects(), fetchQuestions(), fetchPeriods(), fetchYears()]);
      });
    } catch (err) {
      handleError(err, 'memuat data awal');
    }
  }, [fetchAspects, fetchQuestions, fetchPeriods, fetchYears, handleError, withLoading]);

  useEffect(() => {
    if (autoLoad) loadInitialData();
  }, [autoLoad, loadInitialData]);

  useEffect(() => {
    if (autoLoad && viewYear) fetchFullData(viewYear);
  }, [autoLoad, viewYear, fetchFullData]);

  // ========== ASPECT CRUD ==========
  const createAspect = useCallback(
    async (data: CreateKPMRPasarAspectData): Promise<KPMRPasarAspect> => {
      try {
        const newAspect = await withLoading(() => kpmrPasarApiService.createAspect(data));
        setAspects((prev) => [...prev, newAspect]);
        return newAspect;
      } catch (err) {
        throw handleError(err, 'membuat aspek');
      }
    },
    [handleError, withLoading],
  );

  const updateAspect = useCallback(
    async (id: number, data: UpdateKPMRPasarAspectData): Promise<KPMRPasarAspect> => {
      try {
        const updatedAspect = await withLoading(() => kpmrPasarApiService.updateAspect(id, data));
        setAspects((prev) => prev.map((a) => (a.id === id ? updatedAspect : a)));
        return updatedAspect;
      } catch (err) {
        throw handleError(err, `mengupdate aspek ${id}`);
      }
    },
    [handleError, withLoading],
  );

  // HARD DELETE - Hanya ini yang digunakan
  const deleteAspect = useCallback(
    async (id: number): Promise<DeleteResponse> => {
      try {
        const result = await withLoading(() => kpmrPasarApiService.deleteAspect(id));
        if (result.success) {
          setAspects((prev) => prev.filter((a) => a.id !== id));
          await fetchFullData(viewYear);
        }
        return result;
      } catch (err) {
        throw handleError(err, `menghapus aspek ${id}`);
      }
    },
    [handleError, withLoading, fetchFullData, viewYear],
  );

  // ========== QUESTION CRUD ==========
  const createQuestion = useCallback(
    async (data: CreateKPMRPasarQuestionData): Promise<KPMRPasarQuestion> => {
      try {
        const newQuestion = await withLoading(() => kpmrPasarApiService.createQuestion(data));
        setQuestions((prev) => [...prev, newQuestion]);
        return newQuestion;
      } catch (err) {
        throw handleError(err, 'membuat pertanyaan');
      }
    },
    [handleError, withLoading],
  );

  const updateQuestion = useCallback(
    async (id: number, data: UpdateKPMRPasarQuestionData): Promise<KPMRPasarQuestion> => {
      try {
        const updatedQuestion = await withLoading(() => kpmrPasarApiService.updateQuestion(id, data));
        setQuestions((prev) => prev.map((q) => (q.id === id ? updatedQuestion : q)));
        return updatedQuestion;
      } catch (err) {
        throw handleError(err, `mengupdate pertanyaan ${id}`);
      }
    },
    [handleError, withLoading],
  );

  // HARD DELETE - Hanya ini yang digunakan
  const deleteQuestion = useCallback(
    async (id: number): Promise<DeleteResponse> => {
      try {
        console.log(`🗑️ Hook: Deleting question ${id}`);
        const result = await withLoading(() => kpmrPasarApiService.deleteQuestion(id));
        console.log(`✅ Hook: Delete result:`, result);

        if (result.success) {
          setQuestions((prev) => prev.filter((q) => q.id !== id));
          // Refresh full data setelah delete
          await fetchFullData(viewYear);
          await fetchDefinitions(viewYear);
          await fetchQuestions(viewYear);
        }
        return result;
      } catch (err) {
        console.error(`❌ Hook: Error deleting question ${id}:`, err);
        throw handleError(err, `menghapus pertanyaan ${id}`);
      }
    },
    [handleError, withLoading, fetchFullData, viewYear, fetchDefinitions, fetchQuestions],
  );

  // ========== DEFINITION CRUD ==========
  const createOrUpdateDefinition = useCallback(
    async (data: CreateKPMRPasarDefinitionData): Promise<KPMRPasarDefinition> => {
      try {
        const definition = await withLoading(() => kpmrPasarApiService.createOrUpdateDefinition(data));
        await fetchDefinitions(data.year);
        await fetchFullData(data.year);
        return definition;
      } catch (err) {
        throw handleError(err, 'membuat/mengupdate definisi');
      }
    },
    [fetchDefinitions, fetchFullData, handleError, withLoading],
  );

  const updateDefinition = useCallback(
    async (id: number, data: UpdateKPMRPasarDefinitionData): Promise<KPMRPasarDefinition> => {
      try {
        const cleanData: UpdateKPMRPasarDefinitionData = {};
        if (data.aspekTitle !== undefined) cleanData.aspekTitle = data.aspekTitle;
        if (data.aspekBobot !== undefined) cleanData.aspekBobot = data.aspekBobot;
        if (data.sectionTitle !== undefined) cleanData.sectionTitle = data.sectionTitle;
        if (data.level1 !== undefined) cleanData.level1 = data.level1;
        if (data.level2 !== undefined) cleanData.level2 = data.level2;
        if (data.level3 !== undefined) cleanData.level3 = data.level3;
        if (data.level4 !== undefined) cleanData.level4 = data.level4;
        if (data.level5 !== undefined) cleanData.level5 = data.level5;
        if (data.evidence !== undefined) cleanData.evidence = data.evidence;

        const updatedDefinition = await withLoading(() => kpmrPasarApiService.updateDefinition(id, cleanData));
        if (updatedDefinition?.year) {
          await fetchDefinitions(updatedDefinition.year);
          await fetchFullData(updatedDefinition.year);
        }
        return updatedDefinition;
      } catch (err) {
        throw handleError(err, `mengupdate definisi ${id}`);
      }
    },
    [fetchDefinitions, fetchFullData, handleError, withLoading],
  );

  const deleteDefinition = useCallback(
    async (definitionId: number, year: number): Promise<DeleteResponse> => {
      try {
        console.log(`🗑️ Hard deleting definition ${definitionId} for year ${year}`);
        const response = await withLoading(() => kpmrPasarApiService.deleteDefinitionPermanent(definitionId, year));
        console.log('✅ Delete response:', response);

        await fetchFullData(year);
        await fetchDefinitions(year);
        await fetchScores(year);

        return response;
      } catch (err: any) {
        console.error(`❌ Error deleting definition ${definitionId}:`, err);
        const errorMessage = err?.response?.data?.message || err?.message || 'Gagal menghapus data';
        setError(errorMessage);
        throw err;
      }
    },
    [fetchFullData, fetchDefinitions, fetchScores, withLoading],
  );

  // ========== SCORE CRUD ==========
  const createOrUpdateScore = useCallback(
    async (data: CreateKPMRPasarScoreData): Promise<KPMRPasarScore> => {
      try {
        const score = await withLoading(() => kpmrPasarApiService.createOrUpdateScore(data));
        await fetchScores(data.year);
        await fetchFullData(data.year);
        return score;
      } catch (err) {
        throw handleError(err, 'membuat/mengupdate skor');
      }
    },
    [fetchScores, fetchFullData, handleError, withLoading],
  );

  const updateScore = useCallback(
    async (id: number, data: UpdateKPMRPasarScoreData): Promise<KPMRPasarScore> => {
      try {
        const updatedScore = await withLoading(() => kpmrPasarApiService.updateScore(id, data));
        await fetchScores(updatedScore.year);
        await fetchFullData(updatedScore.year);
        return updatedScore;
      } catch (err) {
        throw handleError(err, `mengupdate skor ${id}`);
      }
    },
    [fetchScores, fetchFullData, handleError, withLoading],
  );

  const deleteScore = useCallback(
    async (id: number): Promise<DeleteResponse> => {
      try {
        const result = await withLoading(() => kpmrPasarApiService.deleteScore(id));
        await fetchScores(viewYear);
        await fetchFullData(viewYear);
        return result;
      } catch (err) {
        throw handleError(err, `menghapus skor ${id}`);
      }
    },
    [viewYear, fetchScores, fetchFullData, handleError, withLoading],
  );

  const deleteScoreByTarget = useCallback(
    async (definitionId: number, year: number, quarter: string): Promise<DeleteResponse> => {
      try {
        const response = await withLoading(() => kpmrPasarApiService.deleteScoreByTarget(definitionId, year, quarter));
        await fetchScores(year);
        await fetchFullData(year);
        return response;
      } catch (err) {
        throw handleError(err, `menghapus skor ${definitionId}-${year}-${quarter}`);
      }
    },
    [fetchScores, fetchFullData, handleError, withLoading],
  );

  const refetch = useCallback(async (): Promise<void> => {
    await fetchAllData(viewYear);
  }, [viewYear, fetchAllData]);

  // ========== RETURN ==========
  return {
    aspects,
    questions,
    definitions,
    scores,
    fullData,
    groups,
    periods,
    years,
    viewYear,
    viewQuarter,
    query,
    loading,
    error,
    setViewYear,
    setViewQuarter,
    setQuery,
    clearError,
    fetchAllData,
    fetchAspects,
    fetchQuestions,
    fetchDefinitions,
    fetchScores,
    fetchFullData,
    fetchPeriods,
    fetchYears,
    search,
    createAspect,
    updateAspect,
    deleteAspect,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    createOrUpdateDefinition,
    updateDefinition,
    deleteDefinition,
    createOrUpdateScore,
    updateScore,
    deleteScore,
    deleteScoreByTarget,
    refetch,
    resetState,
  };
};
