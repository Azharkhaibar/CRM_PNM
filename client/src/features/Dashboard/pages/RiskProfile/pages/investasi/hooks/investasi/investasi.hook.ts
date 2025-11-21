import { useState, useEffect, useCallback, useMemo } from 'react';
import { InvestasiService, CreateInvestasiDto, UpdateInvestasiDto, Investasi } from '../../service/investasi.service';

interface FilterInvest {
  year?: number;
  quarter?: string;
  query?: string;
  parameter_no?: number;
}

export const useInvestasi = (filters?: FilterInvest) => {
  const [loading, setLoading] = useState(false);
  const [investasiDt, setInvestasiDt] = useState<Investasi[]>([]);
  const [error, setError] = useState<string | null>(null);

  const stableFilters = useMemo(() => {
    return filters
      ? {
          year: filters.year,
          quarter: filters.quarter,
          query: filters.query,
          parameter_no: filters.parameter_no,
        }
      : undefined;
  }, [filters?.year, filters?.quarter, filters?.query, filters?.parameter_no]);

  const fetchInvestDt = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching data with filters:', stableFilters);

      const result = await InvestasiService.getAllInvestasi(stableFilters);
      console.log('Fetched data:', result);

      setInvestasiDt(Array.isArray(result) ? result : []);
    } catch (err: any) {
      console.error('Error in fetchInvestDt:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Gagal memuat data investasi';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [stableFilters]);

  useEffect(() => {
    fetchInvestDt();
  }, [fetchInvestDt]);

  const createInvestasi = async (payload: CreateInvestasiDto): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      console.log('Creating investasi with payload:', payload);

      const newItem = await InvestasiService.createInvestasi(payload);
      console.log('Created item:', newItem);

      setInvestasiDt((prev) => [...prev, newItem]);
    } catch (err: any) {
      console.error('Error in createInvestasi:', err);

      let errorMessage = 'Gagal menambah investasi';

      if (err.response?.data) {
        const errorData = err.response.data;
        console.log('Raw error data from server:', errorData);
        if (Array.isArray(errorData.message)) {
         
          const validationErrors = errorData.message.map((errorObj: any) => {
            if (errorObj.constraints) {
              return Object.values(errorObj.constraints).join(', ');
            }
            if (errorObj.property) {
              return `Field '${errorObj.property}' ${errorObj.value === null ? 'tidak boleh null' : 'nilai tidak valid'}`;
            }
            return 'Validasi gagal';
          });
          errorMessage = validationErrors.join('; ');
        }
        else if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.message && typeof errorData.message === 'string') {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else {
          try {
            errorMessage = JSON.stringify(errorData);
          } catch {
            errorMessage = 'Terjadi kesalahan yang tidak diketahui';
          }
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      console.log('Final error message:', errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateInvestasi = async (id: number, payload: UpdateInvestasiDto): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      console.log('Updating investasi:', id, payload);

      const updatedItem = await InvestasiService.updateInvestasi(id, payload);
      console.log('Updated item:', updatedItem);

      setInvestasiDt((prev) => prev.map((i) => (i.id_investasi === id ? updatedItem : i)));
    } catch (err: any) {
      console.error('Error in updateInvestasi:', err);
      let errorMessage = 'Gagal mengupdate investasi';
      if (err.response?.data) {
        const errorData = err.response.data;
        if (Array.isArray(errorData.message)) {
          const validationErrors = errorData.message.map((errorObj: any) => {
            if (errorObj.constraints) {
              return Object.values(errorObj.constraints).join(', ');
            }
            if (errorObj.property) {
              return `Field '${errorObj.property}' ${errorObj.value === null ? 'tidak boleh null' : 'nilai tidak valid'}`;
            }
            return 'Validasi gagal';
          });
          errorMessage = validationErrors.join('; ');
        } else {
          errorMessage = err.response?.data?.message || err.message || 'Gagal mengupdate investasi';
        }
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteInvestasiDt = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      console.log('Deleting investasi:', id);

      await InvestasiService.removeInvestasi(id);
      console.log('Deleted successfully');

      setInvestasiDt((prev) => prev.filter((i) => i.id_investasi !== id));
    } catch (err: any) {
      console.error('Error in deleteInvestasiDt:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Gagal menghapus data';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    investasiDt,
    error,
    fetchInvestDt,
    createInvestasi,
    updateInvestasi,
    deleteInvestasiDt,
  };
};
