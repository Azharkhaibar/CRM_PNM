// src/ojk/rekap/utils/api/rekapApiService.ts
import axios, { AxiosInstance } from 'axios';

const API_BASE_URL: string = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5530/api/v1';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ [Rekap API] Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  },
);

export interface RekapQueryParams {
  year?: number;
  quarter?: number;
  categories?: string[];
  search?: string;
  model?: string;
  prinsip?: string;
  jenis?: string;
  underlying?: string[];
}

export interface UpdateNilaiValueData {
  categoryId: string;
  paramId: number;
  itemId: number;
  value?: string | number | null;
  valuePembilang?: string | number | null;
  valuePenyebut?: string | number | null;
}

export interface RekapApiResponse<T = any> {
  success: boolean;
  data: T;
  totalCategories?: number;
  totalParameters?: number;
  message?: string;
}

export const rekapApiService = {
  async getAllRekapData(params: RekapQueryParams = {}): Promise<RekapApiResponse<Record<string, any[]>>> {
    try {
      const queryParams = new URLSearchParams();

      if (params.year) queryParams.append('year', String(params.year));
      if (params.quarter) queryParams.append('quarter', String(params.quarter));
      if (params.search) queryParams.append('search', params.search);
      if (params.model) queryParams.append('model', params.model);
      if (params.prinsip) queryParams.append('prinsip', params.prinsip);
      if (params.jenis) queryParams.append('jenis', params.jenis);

      if (params.categories && params.categories.length > 0) {
        queryParams.append('categories', params.categories.join(','));
      }

      if (params.underlying && params.underlying.length > 0) {
        queryParams.append('underlying', params.underlying.join(','));
      }

      const url = `/rekap?${queryParams.toString()}`;
      console.log(`📡 [Rekap API] Fetching: ${url}`);

      const response = await apiClient.get<RekapApiResponse<Record<string, any[]>>>(url);
      console.log(`✅ [Rekap API] Response received:`, {
        success: response.data?.success,
        totalCategories: response.data?.totalCategories,
        totalParameters: response.data?.totalParameters,
      });

      return response.data;
    } catch (error) {
      console.error('❌ [Rekap API] Error fetching rekap data:', error);
      throw error;
    }
  },

  async getCategoryData(categoryId: string, params: Pick<RekapQueryParams, 'year' | 'quarter'> = {}): Promise<RekapApiResponse<any[]>> {
    try {
      const queryParams = new URLSearchParams();
      if (params.year) queryParams.append('year', String(params.year));
      if (params.quarter) queryParams.append('quarter', String(params.quarter));

      const url = `/rekap/${categoryId}?${queryParams.toString()}`;
      console.log(`📡 [Rekap API] Fetching category: ${url}`);

      const response = await apiClient.get<RekapApiResponse<any[]>>(url);
      return response.data;
    } catch (error) {
      console.error(`❌ [Rekap API] Error fetching category ${categoryId}:`, error);
      throw error;
    }
  },

  async updateNilaiValue(data: UpdateNilaiValueData): Promise<RekapApiResponse> {
    try {
      console.log(`📝 [Rekap API] Updating nilai:`, data);

      const response = await apiClient.put<RekapApiResponse>('/rekap/nilai', data);
      console.log(`✅ [Rekap API] Nilai updated:`, response.data);

      return response.data;
    } catch (error) {
      console.error('❌ [Rekap API] Error updating nilai:', error);
      throw error;
    }
  },

  async getAvailableCategories(): Promise<RekapApiResponse<{ id: string; label: string }[]>> {
    try {
      const response = await apiClient.get<RekapApiResponse<{ id: string; label: string }[]>>('/rekap/meta/categories');
      return response.data;
    } catch (error) {
      console.error('❌ [Rekap API] Error fetching categories:', error);
      throw error;
    }
  },

  async clonePeriodData(payload: {
    sourceYear: number;
    sourceQuarter: number;
    targetYear: number;
    targetQuarter: number;
    overrideExisting: boolean;
    categories?: string[];
  }): Promise<RekapApiResponse> {
    try {
      console.log(`📡 [Rekap API] Cloning period data:`, payload);
      const response = await apiClient.post<RekapApiResponse>('/rekap/clone', payload);
      console.log(`✅ [Rekap API] Clone completed:`, response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [Rekap API] Error cloning period data:', error);
      throw error;
    }
  },

  async undoClonePeriodData(payload: {
    targetYear: number;
    targetQuarter: number;
    categories?: string[];
  }): Promise<RekapApiResponse> {
    try {
      console.log(`📡 [Rekap API] Undoing clone:`, payload);
      const response = await apiClient.post<RekapApiResponse>('/rekap/undo-clone', payload);
      console.log(`✅ [Rekap API] Undo clone completed:`, response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [Rekap API] Error undoing clone:', error);
      throw error;
    }
  },

  async cloneKpmrPeriodData(payload: {
    sourceYear: number;
    targetYear: number;
    overrideExisting: boolean;
    categories?: string[];
  }): Promise<RekapApiResponse> {
    try {
      console.log(`📡 [Rekap API] Cloning KPMR data:`, payload);
      const response = await apiClient.post<RekapApiResponse>('/rekap/clone-kpmr', payload);
      console.log(`✅ [Rekap API] KPMR Clone completed:`, response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [Rekap API] Error cloning KPMR data:', error);
      throw error;
    }
  },

  async undoCloneKpmrPeriodData(payload: {
    targetYear: number;
    categories?: string[];
  }): Promise<RekapApiResponse> {
    try {
      console.log(`📡 [Rekap API] Undoing KPMR clone:`, payload);
      const response = await apiClient.post<RekapApiResponse>('/rekap/undo-clone-kpmr', payload);
      console.log(`✅ [Rekap API] KPMR Undo clone completed:`, response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [Rekap API] Error undoing KPMR clone:', error);
      throw error;
    }
  },

  async resetKpmrPeriodData(year: number, category: string): Promise<RekapApiResponse> {
    try {
      console.log(`📡 [Rekap API] Resetting KPMR data:`, { year, category });
      const response = await apiClient.delete<RekapApiResponse>('/rekap/reset-kpmr', {
        params: { year, category },
      });
      console.log(`✅ [Rekap API] KPMR Reset completed:`, response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [Rekap API] Error resetting KPMR data:', error);
      throw error;
    }
  },

  async importExcel(formData: FormData): Promise<any> {
    try {
      console.log(`📡 [Rekap API] Importing Excel...`);
      const response = await apiClient.post('/rekap/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('❌ [Rekap API] Error importing Excel:', error);
      throw error;
    }
  },
};

export default rekapApiService;

