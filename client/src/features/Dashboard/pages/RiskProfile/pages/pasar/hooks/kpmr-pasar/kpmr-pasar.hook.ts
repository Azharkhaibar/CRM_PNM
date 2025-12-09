// hooks/kpmrPasar.hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GroupedAspek, kpmrPasarService, PeriodResult, CreateKpmrPasarDto, UpdateKpmrPasarDto, PeriodFilter, SearchFilter, KpmrPasar } from '../../service/kpmr-pasar/kpmr-pasar.service';

// Query keys
export const kpmrPasarQueryKeys = {
  all: ['kpmr-pasar'] as const,
  lists: () => [...kpmrPasarQueryKeys.all, 'list'] as const,
  list: (filters?: Partial<PeriodFilter & SearchFilter>) => [...kpmrPasarQueryKeys.lists(), filters] as const,
  details: () => [...kpmrPasarQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...kpmrPasarQueryKeys.details(), id] as const,
  periods: () => [...kpmrPasarQueryKeys.all, 'periods'] as const,
  groupedByPeriod: (year: number, quarter: string) => [...kpmrPasarQueryKeys.all, 'grouped', { year, quarter }] as const,
  totalAverage: (year: number, quarter: string) => [...kpmrPasarQueryKeys.all, 'average', { year, quarter }] as const,
  search: (criteria: SearchFilter) => [...kpmrPasarQueryKeys.all, 'search', criteria] as const,
  comprehensive: (filter: PeriodFilter) => [...kpmrPasarQueryKeys.all, 'comprehensive', filter] as const,
};

// ==================== QUERY HOOKS ====================

export const useKpmrPasarList = (filter?: Partial<PeriodFilter & SearchFilter>) => {
  return useQuery({
    queryKey: kpmrPasarQueryKeys.list(filter),
    queryFn: () => {
      if (filter?.year && filter?.quarter) {
        return kpmrPasarService.getByPeriod(filter.year, filter.quarter);
      }
      return kpmrPasarService.getAll();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useKpmrPasarByPeriod = (year: number, quarter: string) => {
  return useQuery({
    queryKey: kpmrPasarQueryKeys.groupedByPeriod(year, quarter),
    queryFn: () => kpmrPasarService.getByPeriod(year, quarter),
    enabled: !!year && !!quarter && kpmrPasarService.validateQuarter(quarter),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useKpmrPasar = (id: number | null) => {
  return useQuery({
    queryKey: kpmrPasarQueryKeys.detail(id!),
    queryFn: () => kpmrPasarService.getById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useKpmrPasarPeriods = () => {
  return useQuery({
    queryKey: kpmrPasarQueryKeys.periods(),
    queryFn: () => kpmrPasarService.getPeriods(),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

export const useKpmrPasarTotalAverage = (year: number, quarter: string) => {
  return useQuery({
    queryKey: kpmrPasarQueryKeys.totalAverage(year, quarter),
    queryFn: () => kpmrPasarService.getTotalAverage(year, quarter),
    enabled: !!year && !!quarter && kpmrPasarService.validateQuarter(quarter),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useKpmrPasarSearch = (criteria: SearchFilter) => {
  return useQuery({
    queryKey: kpmrPasarQueryKeys.search(criteria),
    queryFn: () => kpmrPasarService.searchByCriteria(criteria),
    enabled: !!(criteria.year && criteria.quarter) || !!criteria.query,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useKpmrPasarComprehensive = (filter: PeriodFilter) => {
  return useQuery({
    queryKey: kpmrPasarQueryKeys.comprehensive(filter),
    queryFn: () => kpmrPasarService.getComprehensiveData(filter),
    enabled: !!filter.year && !!filter.quarter && kpmrPasarService.validateQuarter(filter.quarter),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// ==================== MUTATION HOOKS ====================

export const useCreateKpmrPasar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: kpmrPasarService.create,
    onSuccess: (newData: KpmrPasar) => {
      // Invalidate queries berdasarkan periode data baru
      const periodKey = kpmrPasarQueryKeys.groupedByPeriod(newData.year, newData.quarter);

      queryClient.invalidateQueries({
        queryKey: kpmrPasarQueryKeys.list(),
      });

      queryClient.invalidateQueries({
        queryKey: periodKey,
      });

      queryClient.invalidateQueries({
        queryKey: kpmrPasarQueryKeys.totalAverage(newData.year, newData.quarter),
      });

      // Invalidate comprehensive queries
      queryClient.invalidateQueries({
        queryKey: kpmrPasarQueryKeys.comprehensive({ year: newData.year, quarter: newData.quarter }),
      });
    },
    onError: (error: Error) => {
      console.error('Error creating KPMR Pasar:', error);
    },
  });
};

export const useUpdateKpmrPasar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateKpmrPasarDto }) => kpmrPasarService.update(id, data),
    onSuccess: (updatedData: KpmrPasar) => {
      // Update cache untuk data tertentu
      queryClient.setQueryData(kpmrPasarQueryKeys.detail(updatedData.id_kpmr_pasar), updatedData);

      // Invalidate list queries
      queryClient.invalidateQueries({
        queryKey: kpmrPasarQueryKeys.list(),
      });

      // Invalidate queries berdasarkan periode
      if (updatedData.year && updatedData.quarter) {
        queryClient.invalidateQueries({
          queryKey: kpmrPasarQueryKeys.groupedByPeriod(updatedData.year, updatedData.quarter),
        });

        queryClient.invalidateQueries({
          queryKey: kpmrPasarQueryKeys.totalAverage(updatedData.year, updatedData.quarter),
        });

        queryClient.invalidateQueries({
          queryKey: kpmrPasarQueryKeys.comprehensive({ year: updatedData.year, quarter: updatedData.quarter }),
        });
      }
    },
    onError: (error: Error) => {
      console.error('Error updating KPMR Pasar:', error);
    },
  });
};

export const useDeleteKpmrPasar = (year: number, quarter: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => kpmrPasarService.delete(id),

    // ✅ OPTIMISTIC UPDATE: Hapus dari cache sebelum request
    onMutate: async (id) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: kpmrPasarQueryKeys.all });

      // Snapshot previous values untuk rollback jika error
      const previousQueries = {
        list: queryClient.getQueryData(kpmrPasarQueryKeys.list()),
        grouped: queryClient.getQueryData(kpmrPasarQueryKeys.groupedByPeriod(year, quarter)),
        comprehensive: queryClient.getQueryData(kpmrPasarQueryKeys.comprehensive({ year, quarter })),
      };

      // Optimistically remove from all caches
      queryClient.setQueriesData({ queryKey: kpmrPasarQueryKeys.all }, (old: any) => {
        if (!old) return old;

        // Handle grouped data (array of GroupedAspek)
        if (Array.isArray(old) && old.length > 0 && old[0].items) {
          return old
            .map((group: GroupedAspek) => ({
              ...group,
              items: group.items.filter((item: KpmrPasar) => item.id_kpmr_pasar !== id),
            }))
            .filter((group: GroupedAspek) => group.items.length > 0); // Hapus group kosong
        }

        // Handle flat array data
        if (Array.isArray(old)) {
          return old.filter((item: KpmrPasar) => item.id_kpmr_pasar !== id);
        }

        return old;
      });

      // Juga update query data untuk groupedByPeriod secara spesifik
      queryClient.setQueriesData({ queryKey: kpmrPasarQueryKeys.groupedByPeriod(year, quarter) }, (old: any) => {
        if (!old) return old;

        // Handle grouped data (array of GroupedAspek)
        if (Array.isArray(old) && old.length > 0 && old[0].items) {
          return old
            .map((group: GroupedAspek) => ({
              ...group,
              items: group.items.filter((item: KpmrPasar) => item.id_kpmr_pasar !== id),
            }))
            .filter((group: GroupedAspek) => group.items.length > 0); // Hapus group kosong
        }

        // Handle flat array data
        if (Array.isArray(old)) {
          return old.filter((item: KpmrPasar) => item.id_kpmr_pasar !== id);
        }

        return old;
      });

      return { previousQueries };
    },

    onError: (error, id, context) => {
      // ✅ ROLLBACK ON ERROR: Kembalikan data sebelumnya
      if (context?.previousQueries) {
        queryClient.setQueryData(kpmrPasarQueryKeys.list(), context.previousQueries.list);
        queryClient.setQueryData(kpmrPasarQueryKeys.groupedByPeriod(year, quarter), context.previousQueries.grouped);
        queryClient.setQueryData(kpmrPasarQueryKeys.comprehensive({ year, quarter }), context.previousQueries.comprehensive);
      }

      console.error('Error deleting KPMR Pasar:', error);
    },

    onSettled: () => {
      // ✅ INVALIDATE UNTUK SYNC: Pastikan data sync dengan server
      queryClient.invalidateQueries({
        queryKey: kpmrPasarQueryKeys.all,
      });
    },
  });
};

// ==================== OPTIMISTIC MUTATION HOOKS ====================

export const useOptimisticCreateKpmrPasar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: kpmrPasarService.create,
    onMutate: async (newData: CreateKpmrPasarDto) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({
        queryKey: kpmrPasarQueryKeys.list(),
      });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(kpmrPasarQueryKeys.list());

      // Optimistically update cache dengan temporary ID
      const tempData: KpmrPasar = {
        ...newData,
        id_kpmr_pasar: Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as KpmrPasar;

      queryClient.setQueryData(kpmrPasarQueryKeys.list(), (old: any) => {
        if (Array.isArray(old)) {
          return [...old, tempData];
        }
        return [tempData];
      });

      return { previousData };
    },
    onError: (error: Error, newData: CreateKpmrPasarDto, context: any) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(kpmrPasarQueryKeys.list(), context.previousData);
      }
    },
    onSettled: () => {
      // Invalidate untuk mendapatkan data real dari server
      queryClient.invalidateQueries({
        queryKey: kpmrPasarQueryKeys.list(),
      });
    },
  });
};

// ==================== DATA MANAGEMENT HOOK ====================

export const useKpmrPasarDataManagement = (filter: PeriodFilter) => {
  const groupedQuery = useKpmrPasarByPeriod(filter.year, filter.quarter);
  const averageQuery = useKpmrPasarTotalAverage(filter.year, filter.quarter);
  const periodsQuery = useKpmrPasarPeriods();

  const createMutation = useCreateKpmrPasar();
  const updateMutation = useUpdateKpmrPasar();
  const deleteMutation = useDeleteKpmrPasar(filter.year, filter.quarter); // ✅ Pass parameters here

  const isLoading = groupedQuery.isLoading || averageQuery.isLoading || periodsQuery.isLoading;
  const isFetching = groupedQuery.isFetching || averageQuery.isFetching || periodsQuery.isFetching;
  const error = groupedQuery.error || averageQuery.error || periodsQuery.error;

  return {
    // Data
    groupedData: groupedQuery.data || [],
    totalAverage: averageQuery.data || 0,
    periods: periodsQuery.data || [],

    // Status
    isLoading,
    isFetching,
    error,

    // Query status
    groupedQuery,
    averageQuery,
    periodsQuery,

    // Mutations
    create: createMutation.mutate,
    update: updateMutation.mutate,
    remove: deleteMutation.mutate,

    // Mutation status
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Mutation objects
    createMutation,
    updateMutation,
    deleteMutation,

    // Refresh
    refetch: () => {
      groupedQuery.refetch();
      averageQuery.refetch();
      periodsQuery.refetch();
    },
  };
};

// ==================== UTILITY HOOKS ====================

export const useKpmrPasarCalculations = () => {
  const calculateAspekAverage = (items: KpmrPasar[]): string => {
    const validScores = items.map((item) => item.sectionSkor).filter((score): score is number => typeof score === 'number' && !isNaN(score));

    if (validScores.length === 0) return '0.00';

    const average = validScores.reduce((sum, score) => sum + score, 0) / validScores.length;
    return average.toFixed(2);
  };

  const calculateOverallAverage = (groupedData: GroupedAspek[]): number => {
    const averages = groupedData.map((group) => parseFloat(group.average_skor)).filter((avg) => !isNaN(avg));

    if (averages.length === 0) return 0;

    const overallAverage = averages.reduce((sum, avg) => sum + avg, 0) / averages.length;
    return Number(overallAverage.toFixed(2));
  };

  const validateFormData = (data: any): string | null => {
    if (!data.year || !data.quarter) {
      return 'Year dan Quarter harus diisi';
    }

    if (!kpmrPasarService.validateQuarter(data.quarter)) {
      return 'Quarter harus Q1, Q2, Q3, atau Q4';
    }

    if (!kpmrPasarService.validateYear(data.year)) {
      return 'Year tidak valid';
    }

    if (data.sectionSkor && (data.sectionSkor < 1 || data.sectionSkor > 5)) {
      return 'Section Skor harus antara 1-5';
    }

    return null;
  };

  const calculateWeightedScore = (bobot: number, skor: number): number => {
    return (bobot * skor) / 100;
  };

  const getRiskLevel = (skor: number): string => {
    if (skor >= 4.5) return 'Excellent';
    if (skor >= 3.5) return 'Good';
    if (skor >= 2.5) return 'Fair';
    if (skor >= 1.5) return 'Poor';
    return 'Very Poor';
  };

  return {
    calculateAspekAverage,
    calculateOverallAverage,
    validateFormData,
    calculateWeightedScore,
    getRiskLevel,
  };
};
