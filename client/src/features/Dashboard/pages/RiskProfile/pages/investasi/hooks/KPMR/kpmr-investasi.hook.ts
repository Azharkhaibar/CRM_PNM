import { useState, useEffect, useCallback } from 'react';
// import { kpmrInvestasiService, KpmrInvestasi, CreateKpmrInvestasiDto, UpdateKpmrInvestasiDto } from '../services/kpmrInvestasiService';
import { kpmrInvestasiService, KpmrInvestasi, CreateKpmrInvestasiDto, UpdateKpmrInvestasiDto } from '../../service/kpmr-investasi.service.';
interface Filters {
  year?: number;
  quarter?: string;
  aspek_no?: string;
  query?: string;
}

export const useKpmrInvestasi = (filters?: Filters) => {
  const [data, setData] = useState<KpmrInvestasi[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await kpmrInvestasiService.getAll(filters);
      setData(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createKpmr = async (payload: CreateKpmrInvestasiDto) => {
    try {
      setLoading(true);
      const newItem = await kpmrInvestasiService.create(payload);
      setData((prev) => [...prev, newItem]);
    } catch (err: any) {
      setError(err.message || 'Gagal menambahkan data');
    } finally {
      setLoading(false);
    }
  };

  const updateKpmr = async (id: number, payload: UpdateKpmrInvestasiDto) => {
    try {
      setLoading(true);
      const updated = await kpmrInvestasiService.update(id, payload);
      setData((prev) => prev.map((item) => (item.id_kpmr_investasi === id ? updated : item)));
    } catch (err: any) {
      setError(err.message || 'Gagal memperbarui data');
    } finally {
      setLoading(false);
    }
  };

  const deleteKpmr = async (id: number) => {
    try {
      setLoading(true);
      await kpmrInvestasiService.remove(id);
      setData((prev) => prev.filter((item) => item.id_kpmr_investasi !== id));
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus data');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, createKpmr, updateKpmr, deleteKpmr, refetch: fetchData };

  console.log('Backend data:', data);
  console.log('Filters:', filters);
  console.log('Loading:', loading, 'Error:', error);
};
