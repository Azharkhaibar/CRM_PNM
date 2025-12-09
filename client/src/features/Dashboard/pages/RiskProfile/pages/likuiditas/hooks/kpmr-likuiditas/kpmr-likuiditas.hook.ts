// hooks/kpmr-likuiditas.hooks.ts
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { kpmrLikuiditasService, KpmrLikuiditas, CreateKpmrLikuiditasDto, UpdateKpmrLikuiditasDto, PeriodFilter, SearchFilter, GroupedKpmrResponse, PeriodResult } from '../../service/kpmr-likuiditas/kpmr-likuiditas.service';

// Query keys
export const kpmrLikuiditasQueryKeys = {
  all: ['kpmr-likuiditas'] as const,
  lists: () => [...kpmrLikuiditasQueryKeys.all, 'list'] as const,
  list: (filters?: Partial<PeriodFilter & SearchFilter>) => [...kpmrLikuiditasQueryKeys.lists(), filters] as const,
  details: () => [...kpmrLikuiditasQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...kpmrLikuiditasQueryKeys.details(), id] as const,
  periods: () => [...kpmrLikuiditasQueryKeys.all, 'periods'] as const,
  groupedByPeriod: (year: number, quarter: string) => [...kpmrLikuiditasQueryKeys.all, 'grouped', { year, quarter }] as const,
  totalAverage: (year: number, quarter: string) => [...kpmrLikuiditasQueryKeys.all, 'average', { year, quarter }] as const,
  search: (criteria: SearchFilter) => [...kpmrLikuiditasQueryKeys.all, 'search', criteria] as const,
  comprehensive: (filter: PeriodFilter) => [...kpmrLikuiditasQueryKeys.all, 'comprehensive', filter] as const,
  export: (year: number, quarter: string) => [...kpmrLikuiditasQueryKeys.all, 'export', { year, quarter }] as const,
};

// ==================== QUERY HOOKS ====================

export const useKpmrLikuiditasList = (filter?: Partial<PeriodFilter & SearchFilter>) => {
  return useQuery({
    queryKey: kpmrLikuiditasQueryKeys.list(filter),
    queryFn: () => {
      if (filter?.year && filter?.quarter) {
        return kpmrLikuiditasService.getByPeriod(filter.year, filter.quarter);
      }
      return kpmrLikuiditasService.getAll();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useKpmrLikuiditasByPeriod = (year: number, quarter: string) => {
  return useQuery({
    queryKey: kpmrLikuiditasQueryKeys.groupedByPeriod(year, quarter),
    queryFn: () => kpmrLikuiditasService.getGroupedByPeriod(year, quarter),
    enabled: !!year && !!quarter && kpmrLikuiditasService.validateQuarter(quarter),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useKpmrLikuiditas = (id: number | null) => {
  return useQuery({
    queryKey: kpmrLikuiditasQueryKeys.detail(id!),
    queryFn: () => kpmrLikuiditasService.getById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useKpmrLikuiditasPeriods = () => {
  return useQuery({
    queryKey: kpmrLikuiditasQueryKeys.periods(),
    queryFn: () => kpmrLikuiditasService.getPeriods(),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

export const useKpmrLikuiditasTotalAverage = (year: number, quarter: string) => {
  return useQuery({
    queryKey: kpmrLikuiditasQueryKeys.totalAverage(year, quarter),
    queryFn: () => kpmrLikuiditasService.getTotalAverage(year, quarter),
    enabled: !!year && !!quarter && kpmrLikuiditasService.validateQuarter(quarter),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useKpmrLikuiditasSearch = (criteria: SearchFilter) => {
  return useQuery({
    queryKey: kpmrLikuiditasQueryKeys.search(criteria),
    queryFn: () => kpmrLikuiditasService.searchByCriteria(criteria),
    enabled: !!(criteria.year && criteria.quarter) || !!criteria.query,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useKpmrLikuiditasComprehensive = (filter: PeriodFilter) => {
  return useQuery({
    queryKey: kpmrLikuiditasQueryKeys.comprehensive(filter),
    queryFn: () => kpmrLikuiditasService.getComprehensiveData(filter),
    enabled: !!filter.year && !!filter.quarter && kpmrLikuiditasService.validateQuarter(filter.quarter),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useKpmrLikuiditasExport = (year: number, quarter: string) => {
  return useQuery({
    queryKey: kpmrLikuiditasQueryKeys.export(year, quarter),
    queryFn: () => kpmrLikuiditasService.getExportData(year, quarter),
    enabled: !!year && !!quarter && kpmrLikuiditasService.validateQuarter(quarter),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// ==================== MUTATION HOOKS ====================

export const useCreateKpmrLikuiditas = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: kpmrLikuiditasService.create,
    onSuccess: (newData: KpmrLikuiditas) => {
      // Invalidate queries berdasarkan periode data baru
      const periodKey = kpmrLikuiditasQueryKeys.groupedByPeriod(newData.year, newData.quarter);

      queryClient.invalidateQueries({
        queryKey: kpmrLikuiditasQueryKeys.list(),
      });

      queryClient.invalidateQueries({
        queryKey: periodKey,
      });

      queryClient.invalidateQueries({
        queryKey: kpmrLikuiditasQueryKeys.totalAverage(newData.year, newData.quarter),
      });

      // Invalidate comprehensive queries
      queryClient.invalidateQueries({
        queryKey: kpmrLikuiditasQueryKeys.comprehensive({
          year: newData.year,
          quarter: newData.quarter,
        }),
      });
    },
    onError: (error: Error) => {
      console.error('Error creating KPMR Likuiditas:', error);
    },
  });
};

export const useUpdateKpmrLikuiditas = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateKpmrLikuiditasDto }) => kpmrLikuiditasService.update(id, data),
    onSuccess: (updatedData: KpmrLikuiditas) => {
      // Update cache untuk data tertentu
      queryClient.setQueryData(kpmrLikuiditasQueryKeys.detail(updatedData.id_kpmr_likuiditas), updatedData);

      // Invalidate list queries
      queryClient.invalidateQueries({
        queryKey: kpmrLikuiditasQueryKeys.list(),
      });

      // Invalidate queries berdasarkan periode
      if (updatedData.year && updatedData.quarter) {
        queryClient.invalidateQueries({
          queryKey: kpmrLikuiditasQueryKeys.groupedByPeriod(updatedData.year, updatedData.quarter),
        });

        queryClient.invalidateQueries({
          queryKey: kpmrLikuiditasQueryKeys.totalAverage(updatedData.year, updatedData.quarter),
        });

        queryClient.invalidateQueries({
          queryKey: kpmrLikuiditasQueryKeys.comprehensive({
            year: updatedData.year,
            quarter: updatedData.quarter,
          }),
        });
      }
    },
    onError: (error: Error) => {
      console.error('Error updating KPMR Likuiditas:', error);
    },
  });
};

export const useDeleteKpmrLikuiditas = (year: number, quarter: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => kpmrLikuiditasService.delete(id),

    // ✅ OPTIMISTIC UPDATE: Hapus dari cache sebelum request
    onMutate: async (id) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: kpmrLikuiditasQueryKeys.all });

      // Snapshot previous values untuk rollback jika error
      const previousQueries = {
        list: queryClient.getQueryData(kpmrLikuiditasQueryKeys.list()),
        grouped: queryClient.getQueryData(kpmrLikuiditasQueryKeys.groupedByPeriod(year, quarter)),
      };

      // Optimistically remove from all caches
      queryClient.setQueriesData({ queryKey: kpmrLikuiditasQueryKeys.all }, (old: any) => {
        if (!old) return old;

        // Handle grouped data
        if (old.groups && Array.isArray(old.groups)) {
          return {
            ...old,
            data: old.data?.filter((item: KpmrLikuiditas) => item.id_kpmr_likuiditas !== id) || [],
            groups: old.groups
              .map((group: any) => ({
                ...group,
                items: group.items.filter((item: KpmrLikuiditas) => item.id_kpmr_likuiditas !== id),
              }))
              .filter((group: any) => group.items.length > 0), // Hapus group kosong
          };
        }

        // Handle array data
        if (Array.isArray(old)) {
          return old.filter((item: KpmrLikuiditas) => item.id_kpmr_likuiditas !== id);
        }

        return old;
      });

      return { previousQueries };
    },

    onError: (error, id, context) => {
      // ✅ ROLLBACK ON ERROR: Kembalikan data sebelumnya
      if (context?.previousQueries) {
        queryClient.setQueryData(kpmrLikuiditasQueryKeys.list(), context.previousQueries.list);
        queryClient.setQueryData(kpmrLikuiditasQueryKeys.groupedByPeriod(year, quarter), context.previousQueries.grouped);
      }

      console.error('Error deleting KPMR Likuiditas:', error);
    },

    onSettled: () => {
      // ✅ INVALIDATE UNTUK SYNC: Pastikan data sync dengan server
      queryClient.invalidateQueries({
        queryKey: kpmrLikuiditasQueryKeys.all,
      });
    },
  });
};

// ==================== OPTIMISTIC MUTATION HOOKS ====================

export const useOptimisticCreateKpmrLikuiditas = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: kpmrLikuiditasService.create,
    onMutate: async (newData: CreateKpmrLikuiditasDto) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({
        queryKey: kpmrLikuiditasQueryKeys.list(),
      });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(kpmrLikuiditasQueryKeys.list());

      // Optimistically update cache dengan temporary ID
      const tempData: KpmrLikuiditas = {
        ...newData,
        id_kpmr_likuiditas: Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as KpmrLikuiditas;

      queryClient.setQueryData(kpmrLikuiditasQueryKeys.list(), (old: any) => {
        if (Array.isArray(old)) {
          return [...old, tempData];
        }
        return [tempData];
      });

      return { previousData };
    },
    onError: (error: Error, newData: CreateKpmrLikuiditasDto, context: any) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(kpmrLikuiditasQueryKeys.list(), context.previousData);
      }
    },
    onSettled: () => {
      // Invalidate untuk mendapatkan data real dari server
      queryClient.invalidateQueries({
        queryKey: kpmrLikuiditasQueryKeys.list(),
      });
    },
  });
};

// ==================== DATA MANAGEMENT HOOK ====================

export const useKpmrLikuiditasDataManagement = (filter: PeriodFilter) => {
  const groupedQuery = useKpmrLikuiditasByPeriod(filter.year, filter.quarter);
  const averageQuery = useKpmrLikuiditasTotalAverage(filter.year, filter.quarter);
  const periodsQuery = useKpmrLikuiditasPeriods();

  const createMutation = useCreateKpmrLikuiditas();
  const updateMutation = useUpdateKpmrLikuiditas();
  const deleteMutation = useDeleteKpmrLikuiditas(filter.year, filter.quarter); // ✅ Pass parameters here

  const isLoading = groupedQuery.isLoading || averageQuery.isLoading || periodsQuery.isLoading;
  const isFetching = groupedQuery.isFetching || averageQuery.isFetching || periodsQuery.isFetching;
  const error = groupedQuery.error || averageQuery.error || periodsQuery.error;

  return {
    // Data
    groupedData: groupedQuery.data || { data: [], groups: [], overallAverage: 0 },
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

export const useKpmrLikuiditasCalculations = () => {
  const calculateAspekAverage = (items: KpmrLikuiditas[]): number => {
    const validScores = items.map((item) => item.sectionSkor).filter((score): score is number => typeof score === 'number' && !isNaN(score));

    if (validScores.length === 0) return 0;

    const average = validScores.reduce((sum, score) => sum + score, 0) / validScores.length;
    return Number(average.toFixed(2));
  };

  const calculateOverallAverage = (groupedData: GroupedKpmrResponse): number => {
    return groupedData.overallAverage || 0;
  };

  const validateFormData = (data: any): string | null => {
    return kpmrLikuiditasService.validateData(kpmrLikuiditasService.transformToDto(data));
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

  const getRiskColor = (skor: number): string => {
    if (skor >= 4.5) return '#10B981'; // green
    if (skor >= 3.5) return '#34D399'; // light green
    if (skor >= 2.5) return '#FBBF24'; // yellow
    if (skor >= 1.5) return '#F87171'; // red
    return '#DC2626'; // dark red
  };

  return {
    calculateAspekAverage,
    calculateOverallAverage,
    validateFormData,
    calculateWeightedScore,
    getRiskLevel,
    getRiskColor,
  };
};

// ==================== FORM MANAGEMENT HOOK ====================

export const useKpmrLikuiditasForm = (initialData?: Partial<CreateKpmrLikuiditasDto>) => {
  const [formData, setFormData] = React.useState<CreateKpmrLikuiditasDto>({
    year: new Date().getFullYear(),
    quarter: 'Q1',
    aspekNo: '',
    aspekBobot: 0,
    aspekTitle: '',
    sectionNo: '',
    indikator: '',
    sectionSkor: undefined,
    strong: '',
    satisfactory: '',
    fair: '',
    marginal: '',
    unsatisfactory: '',
    evidence: '',
    ...initialData,
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const updateField = (field: keyof CreateKpmrLikuiditasDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const validationError = kpmrLikuiditasService.validateData(formData);

    if (validationError) {
      newErrors._form = validationError;
    }

    if (!formData.aspekNo) {
      newErrors.aspekNo = 'Aspek No harus diisi';
    }

    if (!formData.aspekTitle) {
      newErrors.aspekTitle = 'Judul Aspek harus diisi';
    }

    if (!formData.sectionNo) {
      newErrors.sectionNo = 'Section No harus diisi';
    }

    if (!formData.indikator) {
      newErrors.indikator = 'Indikator harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setFormData({
      year: new Date().getFullYear(),
      quarter: 'Q1',
      aspekNo: '',
      aspekBobot: 0,
      aspekTitle: '',
      sectionNo: '',
      indikator: '',
      sectionSkor: undefined,
      strong: '',
      satisfactory: '',
      fair: '',
      marginal: '',
      unsatisfactory: '',
      evidence: '',
      ...initialData,
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    updateField,
    validate,
    reset,
    setFormData,
  };
};
