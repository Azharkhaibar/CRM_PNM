// import { useState, useEffect, useCallback, useMemo } from 'react';
// import { InvestasiService, CreateInvestasiDto, UpdateInvestasiDto, Investasi } from '../../service/investasi.service';

// interface FilterInvest {
//   year?: number;
//   quarter?: string;
//   query?: string;
//   parameter_no?: number;
// }

// export const useInvestasi = (filters?: FilterInvest) => {
//   const [loading, setLoading] = useState(false);
//   const [investasiDt, setInvestasiDt] = useState<Investasi[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   const stableFilters = useMemo(() => {
//     return filters
//       ? {
//           year: filters.year,
//           quarter: filters.quarter,
//           query: filters.query,
//           parameter_no: filters.parameter_no,
//         }
//       : undefined;
//   }, [filters?.year, filters?.quarter, filters?.query, filters?.parameter_no]);

//   const fetchInvestDt = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       console.log('Fetching data with filters:', stableFilters);

//       const result = await InvestasiService.getAllInvestasi(stableFilters);
//       console.log('Fetched data:', result);

//       setInvestasiDt(Array.isArray(result) ? result : []);
//     } catch (err: any) {
//       console.error('Error in fetchInvestDt:', err);
//       const errorMessage = err.response?.data?.message || err.message || 'Gagal memuat data investasi';
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   }, [stableFilters]);

//   useEffect(() => {
//     fetchInvestDt();
//   }, [fetchInvestDt]);

//   const createInvestasi = async (payload: CreateInvestasiDto): Promise<void> => {
//     try {
//       setLoading(true);
//       setError(null);
//       console.log('Creating investasi with payload:', payload);

//       const newItem = await InvestasiService.createInvestasi(payload);
//       console.log('Created item:', newItem);

//       setInvestasiDt((prev) => [...prev, newItem]);
//     } catch (err: any) {
//       console.error('Error in createInvestasi:', err);

//       let errorMessage = 'Gagal menambah investasi';

//       if (err.response?.data) {
//         const errorData = err.response.data;
//         console.log('Raw error data from server:', errorData);
//         if (Array.isArray(errorData.message)) {

//           const validationErrors = errorData.message.map((errorObj: any) => {
//             if (errorObj.constraints) {
//               return Object.values(errorObj.constraints).join(', ');
//             }
//             if (errorObj.property) {
//               return `Field '${errorObj.property}' ${errorObj.value === null ? 'tidak boleh null' : 'nilai tidak valid'}`;
//             }
//             return 'Validasi gagal';
//           });
//           errorMessage = validationErrors.join('; ');
//         }
//         else if (typeof errorData === 'string') {
//           errorMessage = errorData;
//         } else if (errorData.message && typeof errorData.message === 'string') {
//           errorMessage = errorData.message;
//         } else if (errorData.error) {
//           errorMessage = errorData.error;
//         } else {
//           try {
//             errorMessage = JSON.stringify(errorData);
//           } catch {
//             errorMessage = 'Terjadi kesalahan yang tidak diketahui';
//           }
//         }
//       } else if (err.message) {
//         errorMessage = err.message;
//       }

//       console.log('Final error message:', errorMessage);
//       setError(errorMessage);
//       throw new Error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateInvestasi = async (id: number, payload: UpdateInvestasiDto): Promise<void> => {
//     try {
//       setLoading(true);
//       setError(null);
//       console.log('Updating investasi:', id, payload);

//       const updatedItem = await InvestasiService.updateInvestasi(id, payload);
//       console.log('Updated item:', updatedItem);

//       setInvestasiDt((prev) => prev.map((i) => (i.id_investasi === id ? updatedItem : i)));
//     } catch (err: any) {
//       console.error('Error in updateInvestasi:', err);
//       let errorMessage = 'Gagal mengupdate investasi';
//       if (err.response?.data) {
//         const errorData = err.response.data;
//         if (Array.isArray(errorData.message)) {
//           const validationErrors = errorData.message.map((errorObj: any) => {
//             if (errorObj.constraints) {
//               return Object.values(errorObj.constraints).join(', ');
//             }
//             if (errorObj.property) {
//               return `Field '${errorObj.property}' ${errorObj.value === null ? 'tidak boleh null' : 'nilai tidak valid'}`;
//             }
//             return 'Validasi gagal';
//           });
//           errorMessage = validationErrors.join('; ');
//         } else {
//           errorMessage = err.response?.data?.message || err.message || 'Gagal mengupdate investasi';
//         }
//       }

//       setError(errorMessage);
//       throw new Error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteInvestasiDt = async (id: number): Promise<void> => {
//     try {
//       setLoading(true);
//       setError(null);
//       console.log('Deleting investasi:', id);

//       await InvestasiService.removeInvestasi(id);
//       console.log('Deleted successfully');

//       setInvestasiDt((prev) => prev.filter((i) => i.id_investasi !== id));
//     } catch (err: any) {
//       console.error('Error in deleteInvestasiDt:', err);
//       const errorMessage = err.response?.data?.message || err.message || 'Gagal menghapus data';
//       setError(errorMessage);
//       throw new Error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     loading,
//     investasiDt,
//     error,
//     fetchInvestDt,
//     createInvestasi,
//     updateInvestasi,
//     deleteInvestasiDt,
//   };
// };

// hooks/investasi/new-investasi.hook.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { investasiService } from '../../service/new-investasi.service';
import { Investasi, InvestasiSection, CreateSectionDto, UpdateSectionDto, CreateInvestasiDto, UpdateInvestasiDto, Quarter } from '../../types/investasi';

// ===================== SECTION HOOKS =====================
export function useSections() {
  return useQuery({
    queryKey: ['investasi-sections'],
    queryFn: () => investasiService.getSections(),
    retry: 2, // Retry 2 kali jika gagal
    onError: (error) => {
      console.error('Error fetching sections:', error);
    },
  });
}

export function useCreateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSectionDto) => investasiService.createSection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investasi-sections'] });
    },
    onError: (error) => {
      console.error('Error creating section:', error);
    },
  });
}

export function useUpdateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSectionDto }) => investasiService.updateSection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investasi-sections'] });
    },
  });
}

export function useDeleteSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => investasiService.deleteSection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investasi-sections'] });
    },
  });
}

// ===================== INVESTASI HOOKS =====================
export function useInvestasiByPeriod(year: number, quarter: Quarter) {
  return useQuery({
    queryKey: ['investasi', year, quarter],
    queryFn: () => investasiService.getInvestasiByPeriod(year, quarter),
    enabled: !!year && !!quarter, // Hanya fetch jika year dan quarter ada
    retry: 1, // Retry 1 kali jika gagal
    onError: (error) => {
      console.error(`Error fetching investasi for ${year}-${quarter}:`, error);
    },
  });
}

export function useCreateInvestasi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInvestasiDto) => investasiService.createInvestasi(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['investasi', variables.year, variables.quarter],
      });
    },
    onError: (error) => {
      console.error('Error creating investasi:', error);
    },
  });
}

export function useUpdateInvestasi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateInvestasiDto }) => investasiService.updateInvestasi(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['investasi', data.year, data.quarter],
      });
    },
  });
}

export function useDeleteInvestasi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => investasiService.deleteInvestasi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investasi'] });
    },
  });
}
