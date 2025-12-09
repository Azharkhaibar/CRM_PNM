// services/kpmrPasar.service.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5530/api/v1/kpmr-pasar';

// Interfaces berdasarkan entity KPMR Pasar
export interface KpmrPasar {
  id_kpmr_pasar: number;
  year: number;
  quarter: string;
  aspekNo?: string;
  aspekBobot?: number;
  aspekTitle?: string;
  sectionNo?: string;
  indikator?: string;
  sectionSkor?: number;
  strong?: string;
  satisfactory?: string;
  fair?: string;
  marginal?: string;
  unsatisfactory?: string;
  evidence?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GroupedAspek {
  aspekNo?: string;
  aspekTitle?: string;
  aspekBobot?: number;
  items: KpmrPasar[];
  average_skor: string;
  total_items: number;
}

export interface PeriodResult {
  year: number;
  quarter: string;
  total_records?: number;
}

// Interface untuk response dari backend
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// DTOs untuk create/update operations
export interface CreateKpmrPasarDto {
  year: number;
  quarter: string;
  aspekNo?: string;
  aspekBobot?: number;
  aspekTitle?: string;
  sectionNo?: string;
  indikator?: string;
  sectionSkor?: number;
  strong?: string;
  satisfactory?: string;
  fair?: string;
  marginal?: string;
  unsatisfactory?: string;
  evidence?: string;
}

export interface UpdateKpmrPasarDto extends Partial<CreateKpmrPasarDto> {}

// Filter interfaces
export interface PeriodFilter {
  year: number;
  quarter: string;
}

export interface SearchFilter {
  query?: string;
  year?: number;
  quarter?: string;
  aspekNo?: string;
  sectionNo?: string;
}

// Utility function untuk handle error
const handleServiceError = (error: any, defaultMessage: string): never => {
  console.error('KPMR Pasar Service Error:', {
    message: defaultMessage,
    error: error.response?.data || error.message,
    url: error.config?.url,
    method: error.config?.method,
  });

  if (axios.isAxiosError(error)) {
    if (error.response?.status === 404) {
      throw new Error(`Endpoint tidak ditemukan: ${error.config?.url}`);
    }
    if (error.response?.status === 500) {
      throw new Error(`Server error: ${error.response?.data?.message || defaultMessage}`);
    }
    if (error.response?.status === 400) {
      throw new Error(`Data tidak valid: ${error.response?.data?.message || defaultMessage}`);
    }
    if (error.response?.status === 409) {
      throw new Error(`Data duplikat: ${error.response?.data?.message || defaultMessage}`);
    }
    const message = error.response?.data?.message || defaultMessage;
    throw new Error(message);
  }
  throw new Error(defaultMessage);
};

// Helper function untuk transform form data ke DTO
export const transformFormToDto = (formData: any): CreateKpmrPasarDto => {
  return {
    year: formData.year,
    quarter: formData.quarter,
    aspekNo: formData.aspekNo || undefined,
    aspekBobot: formData.aspekBobot ? Number(formData.aspekBobot) : undefined,
    aspekTitle: formData.aspekTitle || undefined,
    sectionNo: formData.sectionNo || undefined,
    indikator: formData.sectionTitle || undefined, // Map sectionTitle ke indikator
    sectionSkor: formData.sectionSkor ? Number(formData.sectionSkor) : undefined,
    strong: formData.level1 || undefined,
    satisfactory: formData.level2 || undefined,
    fair: formData.level3 || undefined,
    marginal: formData.level4 || undefined,
    unsatisfactory: formData.level5 || undefined,
    evidence: formData.evidence || undefined,
  };
};

// Service class untuk KPMR Pasar
class KpmrPasarService {
  private readonly baseURL = API_BASE_URL;

  // ==================== CRUD METHODS ====================

  async getAll(): Promise<KpmrPasar[]> {
    try {
      const response = await axios.get<ApiResponse<KpmrPasar[]>>(`${API_BASE_URL}`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Gagal mengambil data');
      }
      return response.data.data || [];
    } catch (error) {
      throw handleServiceError(error, 'Gagal mengambil data KPMR Pasar');
    }
  }

  async getByPeriod(year: number, quarter: string): Promise<GroupedAspek[]> {
    try {
      console.log('Fetching data for period:', year, quarter);
      const response = await axios.get<ApiResponse<GroupedAspek[]>>(`${API_BASE_URL}?year=${year}&quarter=${quarter}`);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Gagal mengambil data periode');
      }

      console.log('Response data:', response.data);
      return response.data.data || [];
    } catch (error) {
      throw handleServiceError(error, 'Gagal mengambil data KPMR Pasar berdasarkan periode');
    }
  }

  async getById(id: number): Promise<KpmrPasar> {
    try {
      const response = await axios.get<ApiResponse<KpmrPasar>>(`${API_BASE_URL}/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Data tidak ditemukan');
      }
      if (!response.data.data) {
        throw new Error('Data tidak ditemukan');
      }
      return response.data.data;
    } catch (error) {
      throw handleServiceError(error, `Gagal mengambil KPMR Pasar ${id}`);
    }
  }

  async create(dto: CreateKpmrPasarDto): Promise<KpmrPasar> {
    try {
      console.log('Creating KPMR Pasar with data:', dto);
      const response = await axios.post<ApiResponse<KpmrPasar>>(`${API_BASE_URL}`, dto);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Gagal membuat data');
      }
      if (!response.data.data) {
        throw new Error('Data tidak berhasil dibuat');
      }

      console.log('Create response:', response.data);
      return response.data.data;
    } catch (error) {
      throw handleServiceError(error, 'Gagal membuat KPMR Pasar');
    }
  }

  async update(id: number, dto: UpdateKpmrPasarDto): Promise<KpmrPasar> {
    try {
      console.log('Updating KPMR Pasar:', id, dto);
      const response = await axios.patch<ApiResponse<KpmrPasar>>(`${API_BASE_URL}/${id}`, dto);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Gagal mengupdate data');
      }
      if (!response.data.data) {
        throw new Error('Data tidak berhasil diupdate');
      }

      return response.data.data;
    } catch (error) {
      throw handleServiceError(error, `Gagal mengupdate KPMR Pasar ${id}`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      console.log('Deleting KPMR Pasar:', id);
      const response = await axios.delete(`${API_BASE_URL}/${id}`);

      if (response.status !== 204) {
        throw new Error('Gagal menghapus data');
      }
    } catch (error) {
      throw handleServiceError(error, `Gagal menghapus KPMR Pasar ${id}`);
    }
  }

  // ==================== SPECIAL METHODS ====================

  async getPeriods(): Promise<PeriodResult[]> {
    try {
      const response = await axios.get<ApiResponse<PeriodResult[]>>(`${API_BASE_URL}/periods`);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Gagal mengambil daftar periode');
      }

      return response.data.data || [];
    } catch (error) {
      throw handleServiceError(error, 'Gagal mengambil daftar periode');
    }
  }

  async getTotalAverage(year: number, quarter: string): Promise<number> {
    try {
      const response = await axios.get<ApiResponse<{ average: number }>>(`${API_BASE_URL}/average/total?year=${year}&quarter=${quarter}`);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Gagal mengambil rata-rata');
      }

      return response.data.data?.average || 0;
    } catch (error) {
      throw handleServiceError(error, 'Gagal mengambil rata-rata total');
    }
  }

  async searchByCriteria(criteria: SearchFilter): Promise<KpmrPasar[]> {
    try {
      const params = new URLSearchParams();
      if (criteria.year) params.append('year', criteria.year.toString());
      if (criteria.quarter) params.append('quarter', criteria.quarter);
      if (criteria.aspekNo) params.append('aspekNo', criteria.aspekNo);
      if (criteria.sectionNo) params.append('sectionNo', criteria.sectionNo);

      const response = await axios.get<ApiResponse<KpmrPasar[]>>(`${API_BASE_URL}/search/criteria?${params.toString()}`);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Gagal mencari data');
      }

      return response.data.data || [];
    } catch (error) {
      throw handleServiceError(error, 'Gagal mencari data');
    }
  }

  // ==================== COMPREHENSIVE DATA FETCHING ====================

  async getComprehensiveData(filter: PeriodFilter): Promise<{
    groupedData: GroupedAspek[];
    totalAverage: number;
    periods: PeriodResult[];
  }> {
    try {
      const [groupedData, totalAverage, periods] = await Promise.all([this.getByPeriod(filter.year, filter.quarter), this.getTotalAverage(filter.year, filter.quarter), this.getPeriods()]);

      return {
        groupedData,
        totalAverage,
        periods,
      };
    } catch (error) {
      throw handleServiceError(error, 'Gagal mengambil data komprehensif');
    }
  }

  // ==================== UTILITY METHODS ====================

  validateQuarter(quarter: string): boolean {
    return ['Q1', 'Q2', 'Q3', 'Q4'].includes(quarter);
  }

  validateYear(year: number): boolean {
    const currentYear = new Date().getFullYear();
    return year >= 2000 && year <= currentYear + 5;
  }

  calculateSectionAverage(sections: KpmrPasar[]): number {
    const validScores = sections.map((section) => section.sectionSkor).filter((score): score is number => typeof score === 'number' && !isNaN(score));

    if (validScores.length === 0) return 0;

    const average = validScores.reduce((sum, score) => sum + score, 0) / validScores.length;
    return Number(average.toFixed(2));
  }

  // Method untuk transform form data ke DTO
  transformToDto(formData: any): CreateKpmrPasarDto {
    return transformFormToDto(formData);
  }
}

// Export singleton instance
export const kpmrPasarService = new KpmrPasarService();

// Export class untuk testing atau extension
export default KpmrPasarService;
