import { useState, useCallback, useEffect } from 'react';
import { reputasiService } from '../../services/reputasi/reputasi.service';
import { Reputasi, ReputasiSection, CreateReputasiDto, CreateReputasiSectionDto, UpdateReputasiDto, UpdateReputasiSectionDto, Quarter, ReputasiSummary, StructuredReputasi } from '../../types/reputasi.types';

export const useReputasi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ========== SECTION METHODS ==========
  const getSections = useCallback(async (): Promise<ReputasiSection[]> => {
    setLoading(true);
    setError(null);
    try {
      const sections = await reputasiService.getSections();

      if (!sections || sections.length === 0) {
        console.log('Tidak ada sections dari backend, menggunakan default sections');
        return reputasiService.generateDefaultSections();
      }

      return sections;
    } catch (err: any) {
      const errorMessage = reputasiService.handleError(err);
      console.warn('Error mengambil sections, menggunakan defaults:', errorMessage);
      return reputasiService.generateDefaultSections();
    } finally {
      setLoading(false);
    }
  }, []);

  const createSection = useCallback(async (data: CreateReputasiSectionDto): Promise<ReputasiSection> => {
    setLoading(true);
    setError(null);
    try {
      const section = await reputasiService.createSection(data);
      return section;
    } catch (err: any) {
      const errorMessage = reputasiService.handleError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSection = useCallback(async (id: number, data: UpdateReputasiSectionDto): Promise<ReputasiSection> => {
    setLoading(true);
    setError(null);
    try {
      const section = await reputasiService.updateSection(id, data);
      return section;
    } catch (err: any) {
      const errorMessage = reputasiService.handleError(err);
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
      await reputasiService.deleteSection(id);
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal menghapus section reputasi';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getSectionById = useCallback(async (id: number): Promise<ReputasiSection | null> => {
    setLoading(true);
    setError(null);
    try {
      return await reputasiService.getSectionById(id);
    } catch (err: any) {
      const errorMessage = reputasiService.handleError(err);
      console.warn(`Error mengambil section reputasi ${id}:`, errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== REPUTASI METHODS ==========
  const getReputasi = useCallback(async (year?: number, quarter?: Quarter): Promise<Reputasi[]> => {
    setLoading(true);
    setError(null);
    try {
      return await reputasiService.getReputasi(year, quarter);
    } catch (err: any) {
      const errorMessage = reputasiService.handleError(err);
      console.warn('Error mengambil data reputasi:', errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getReputasiByPeriod = useCallback(async (year: number, quarter: Quarter): Promise<Reputasi[]> => {
    setLoading(true);
    setError(null);
    try {
      return await reputasiService.getReputasiByPeriod(year, quarter);
    } catch (err: any) {
      const errorMessage = reputasiService.handleError(err);
      console.warn(`Error mengambil data reputasi untuk ${year} ${quarter}:`, errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getReputasiBySection = useCallback(async (sectionId: number, year?: number, quarter?: Quarter): Promise<Reputasi[]> => {
    setLoading(true);
    setError(null);
    try {
      return await reputasiService.getReputasiBySection(sectionId, year, quarter);
    } catch (err: any) {
      const errorMessage = reputasiService.handleError(err);
      console.warn(`Error mengambil data reputasi untuk section ${sectionId}:`, errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getReputasiStructured = useCallback(async (year?: number, quarter?: Quarter): Promise<StructuredReputasi[]> => {
    setLoading(true);
    setError(null);
    try {
      return await reputasiService.getReputasiStructured(year, quarter);
    } catch (err: any) {
      const errorMessage = reputasiService.handleError(err);
      console.warn('Error mendapatkan data reputasi terstruktur:', errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getReputasiSummary = useCallback(async (year: number, quarter: Quarter): Promise<ReputasiSummary | null> => {
    setLoading(true);
    setError(null);
    try {
      return await reputasiService.getReputasiSummary(year, quarter);
    } catch (err: any) {
      const errorMessage = reputasiService.handleError(err);
      console.warn(`Error mengambil summary untuk ${year} ${quarter}:`, errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getReputasiScore = useCallback(async (year: number, quarter: Quarter): Promise<number> => {
    setLoading(true);
    setError(null);
    try {
      return await reputasiService.getReputasiScore(year, quarter);
    } catch (err: any) {
      const errorMessage = reputasiService.handleError(err);
      console.warn(`Error mengambil skor reputasi untuk ${year} ${quarter}:`, errorMessage);
      return 0;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRiskLevelDistribution = useCallback(async (year: number, quarter: Quarter): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      return await reputasiService.getRiskLevelDistribution(year, quarter);
    } catch (err: any) {
      const errorMessage = reputasiService.handleError(err);
      console.warn(`Error mengambil distribusi level risiko untuk ${year} ${quarter}:`, errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getReputasiById = useCallback(async (id: number): Promise<Reputasi | null> => {
    setLoading(true);
    setError(null);
    try {
      return await reputasiService.getReputasiById(id);
    } catch (err: any) {
      const errorMessage = reputasiService.handleError(err);
      console.warn(`Error mengambil data reputasi ${id}:`, errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createReputasi = useCallback(async (data: CreateReputasiDto): Promise<Reputasi> => {
    setLoading(true);
    setError(null);
    try {
      return await reputasiService.createReputasi(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal membuat indikator reputasi';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateReputasi = useCallback(async (id: number, data: UpdateReputasiDto): Promise<Reputasi> => {
    setLoading(true);
    setError(null);
    try {
      return await reputasiService.updateReputasi(id, data);
    } catch (err: any) {
      const errorMessage = reputasiService.handleError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteReputasi = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await reputasiService.deleteReputasi(id);
    } catch (err: any) {
      const errorMessage = reputasiService.handleError(err);
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
      await reputasiService.deleteByPeriod(year, quarter);
    } catch (err: any) {
      const errorMessage = reputasiService.handleError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveReputasiData = useCallback(async (year: number, quarter: Quarter, sections: any[]): Promise<Reputasi[]> => {
    setLoading(true);
    setError(null);
    try {
      if (!sections || sections.length === 0) {
        throw new Error('Tidak ada data reputasi untuk disimpan');
      }

      const results: Reputasi[] = [];

      for (const section of sections) {
        const sectionId = parseInt(section.id.replace('s-', ''));

        for (const indicator of section.indicators) {
          const reputasiItem: CreateReputasiDto = {
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
            const result = await reputasiService.createReputasi(reputasiItem);
            results.push(result);
          } catch (error: any) {
            console.error(`Gagal menyimpan indikator reputasi ${indicator.subNo}:`, error);
          }
        }
      }

      return results;
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal menyimpan data reputasi';
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

    // Reputasi methods
    getReputasi,
    getReputasiByPeriod,
    getReputasiBySection,
    getReputasiStructured,
    getReputasiSummary,
    getReputasiScore,
    getRiskLevelDistribution,
    getReputasiById,
    createReputasi,
    updateReputasi,
    deleteReputasi,
    deleteByPeriod,
    saveReputasiData,

    // Utility
    clearError,
  };
};

// Hook untuk data management yang lebih sederhana
export const useReputasiData = (year?: number, quarter?: Quarter) => {
  const [data, setData] = useState<{
    reputasi: Reputasi[];
    sections: ReputasiSection[];
    summary: ReputasiSummary | null;
    structured: StructuredReputasi[];
    score: number;
    riskDistribution: any | null;
  }>({
    reputasi: [],
    sections: [],
    summary: null,
    structured: [],
    score: 0,
    riskDistribution: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!year || !quarter) return;

    setLoading(true);
    setError(null);
    try {
      const [sectionsResult, reputasiResult, summaryResult, scoreResult, riskResult] = await Promise.allSettled([
        reputasiService.getSections(),
        reputasiService.getReputasiByPeriod(year, quarter),
        reputasiService.getReputasiSummary(year, quarter),
        reputasiService.getReputasiScore(year, quarter),
        reputasiService.getRiskLevelDistribution(year, quarter),
      ]);

      // Handle sections
      let sections: ReputasiSection[] = [];
      if (sectionsResult.status === 'fulfilled') {
        sections = sectionsResult.value;
      } else {
        console.warn('Gagal load sections reputasi:', sectionsResult.reason);
        sections = reputasiService.generateDefaultSections();
      }

      // Handle reputasi data
      let reputasi: Reputasi[] = [];
      if (reputasiResult.status === 'fulfilled') {
        reputasi = reputasiResult.value;
      } else {
        console.warn(`Gagal load data reputasi untuk ${year} ${quarter}:`, reputasiResult.reason);
      }

      // Handle summary
      let summary: ReputasiSummary | null = null;
      if (summaryResult.status === 'fulfilled') {
        summary = summaryResult.value;
      } else {
        console.warn(`Gagal load summary untuk ${year} ${quarter}:`, summaryResult.reason);
      }

      // Handle score
      let score = 0;
      if (scoreResult.status === 'fulfilled') {
        score = scoreResult.value;
      } else {
        console.warn(`Gagal load skor reputasi untuk ${year} ${quarter}:`, scoreResult.reason);
      }

      // Handle risk distribution
      let riskDistribution = null;
      if (riskResult.status === 'fulfilled') {
        riskDistribution = riskResult.value;
      } else {
        console.warn(`Gagal load distribusi risiko untuk ${year} ${quarter}:`, riskResult.reason);
      }

      const structured = reputasiService.groupBySection(reputasi);

      setData({
        sections,
        reputasi,
        summary,
        structured,
        score,
        riskDistribution,
      });
    } catch (err: any) {
      const errorMessage = reputasiService.handleError(err);
      setError(errorMessage);
      console.error('Error loading reputasi data:', errorMessage);

      // Set minimal data untuk UI tetap bekerja
      setData({
        sections: reputasiService.generateDefaultSections(),
        reputasi: [],
        summary: null,
        structured: [],
        score: 0,
        riskDistribution: null,
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
