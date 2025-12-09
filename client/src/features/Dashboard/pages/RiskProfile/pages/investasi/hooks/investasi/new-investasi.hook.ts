// hooks/useInvestasi.ts
import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { investasiService, sectionService } from '../../service/new-investasi.service'; // ✅ Path yang benar

import { Investasi, InvestasiSection, CreateInvestasiDto, UpdateInvestasiDto, CreateInvestasiSectionDto, UpdateInvestasiSectionDto, Quarter } from '../../types/investasi.types';

// Query keys
export const investasiKeys = {
  all: ['investasi'] as const,
  lists: () => [...investasiKeys.all, 'list'] as const,
  list: (filters: { year?: number; quarter?: Quarter } = {}) => [...investasiKeys.lists(), filters] as const,
  details: () => [...investasiKeys.all, 'detail'] as const,
  detail: (id: number) => [...investasiKeys.details(), id] as const,
  search: (query: string) => [...investasiKeys.all, 'search', query] as const,
  totalWeighted: (year: number, quarter: Quarter) => [...investasiKeys.all, 'total-weighted', year, quarter] as const,
};

export const sectionKeys = {
  all: ['sections'] as const,
  lists: () => [...sectionKeys.all, 'list'] as const,
  list: () => [...sectionKeys.lists()] as const,
  details: () => [...sectionKeys.all, 'detail'] as const,
  detail: (id: number) => [...sectionKeys.details(), id] as const,
  byNo: (no: string) => [...sectionKeys.details(), 'no', no] as const,
};

// Investasi Hooks
export const useInvestasi = (id: number, options?: UseQueryOptions<Investasi, Error>) => {
  return useQuery<Investasi, Error>({
    queryKey: investasiKeys.detail(id),
    queryFn: () => investasiService.findOne(id),
    enabled: !!id,
    ...options,
  });
};

export const useInvestasiList = (options?: UseQueryOptions<Investasi[], Error>) => {
  return useQuery<Investasi[], Error>({
    queryKey: investasiKeys.lists(),
    queryFn: investasiService.findAll,
    ...options,
  });
};

export const useInvestasiByPeriod = (year: number, quarter: Quarter, options?: UseQueryOptions<Investasi[], Error>) => {
  return useQuery<Investasi[], Error>({
    queryKey: investasiKeys.list({ year, quarter }),
    queryFn: () => investasiService.findByPeriod(year, quarter),
    enabled: !!year && !!quarter,
    ...options,
  });
};

export const useSearchInvestasi = (query: string, options?: UseQueryOptions<Investasi[], Error>) => {
  return useQuery<Investasi[], Error>({
    queryKey: investasiKeys.search(query),
    queryFn: () => investasiService.search(query),
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export const useTotalWeighted = (year: number, quarter: Quarter, options?: UseQueryOptions<number, Error>) => {
  return useQuery<number, Error>({
    queryKey: investasiKeys.totalWeighted(year, quarter),
    queryFn: () => investasiService.getTotalWeighted(year, quarter),
    enabled: !!year && !!quarter,
    ...options,
  });
};

export const useCreateInvestasi = () => {
  const queryClient = useQueryClient();

  return useMutation<Investasi, Error, CreateInvestasiDto>({
    mutationFn: investasiService.create,
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: investasiKeys.all });
    },
  });
};

export const useUpdateInvestasi = () => {
  const queryClient = useQueryClient();

  return useMutation<Investasi, Error, { id: number; data: UpdateInvestasiDto }>({
    mutationFn: ({ id, data }) => investasiService.update(id, data),
    onSuccess: (data, variables) => {
      // Update specific investasi cache
      queryClient.setQueryData(investasiKeys.detail(variables.id), data);
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: investasiKeys.all });
    },
  });
};

export const useDeleteInvestasi = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: investasiService.remove,
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: investasiKeys.detail(id) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: investasiKeys.all });
    },
  });
};

// Section Hooks
export const useSections = (options?: UseQueryOptions<InvestasiSection[], Error>) => {
  return useQuery<InvestasiSection[], Error>({
    queryKey: sectionKeys.list(),
    queryFn: sectionService.findAll,
    staleTime: 5 * 60 * 1000, // Cache 5 menit
    ...options,
  });
};

export const useSection = (id: number, options?: UseQueryOptions<InvestasiSection, Error>) => {
  return useQuery<InvestasiSection, Error>({
    queryKey: sectionKeys.detail(id),
    queryFn: () => sectionService.findById(id),
    enabled: !!id,
    ...options,
  });
};

export const useSectionByNo = (no: string, options?: UseQueryOptions<InvestasiSection, Error>) => {
  return useQuery<InvestasiSection, Error>({
    queryKey: sectionKeys.byNo(no),
    queryFn: () => sectionService.findByNo(no),
    enabled: !!no,
    ...options,
  });
};

export const useCreateSection = () => {
  const queryClient = useQueryClient();

  return useMutation<InvestasiSection, Error, CreateInvestasiSectionDto>({
    mutationFn: sectionService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sectionKeys.all });
    },
  });
};

export const useUpdateSection = () => {
  const queryClient = useQueryClient();

  return useMutation<InvestasiSection, Error, { id: number; data: UpdateInvestasiSectionDto }>({
    mutationFn: ({ id, data }) => sectionService.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(sectionKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: sectionKeys.all });
    },
  });
};

export const useDeleteSection = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: sectionService.remove,
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: sectionKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: sectionKeys.all });
    },
  });
};

// Combined hooks for common operations
export const useInvestasiData = (year?: number, quarter?: Quarter) => {
  const { data: sections, isLoading: sectionsLoading, error: sectionsError } = useSections();
  const { data: investasiList, isLoading: investasiLoading, error: investasiError } = useInvestasiByPeriod(year || new Date().getFullYear(), quarter || Quarter.Q1);

  return {
    sections,
    investasiList,
    isLoading: sectionsLoading || investasiLoading,
    error: sectionsError || investasiError,
  };
};
