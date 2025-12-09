// services/kpmr-likuiditas.service.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5530/api/v1/kpmr-likuiditas';

// Interfaces berdasarkan entity KPMR Likuiditas
export interface KpmrLikuiditas {
  id_kpmr_likuiditas: number;
  year: number;
  quarter: string;
  aspekNo?: string | null;
  aspekBobot?: number | null;
  aspekTitle?: string | null;
  sectionNo?: string | null;
  indikator?: string | null;
  sectionSkor?: number | null;
  strong?: string | null;
  satisfactory?: string | null;
  fair?: string | null;
  marginal?: string | null;
  unsatisfactory?: string | null;
  evidence?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface KpmrGroup {
  aspekNo: string;
  aspekTitle: string;
  aspekBobot: number;
  items: KpmrLikuiditas[];
  skorAverage: number;
}

export interface GroupedKpmrResponse {
  data: KpmrLikuiditas[];
  groups: KpmrGroup[];
  overallAverage: number;
}

export interface KpmrListResponse {
  data: KpmrLikuiditas[];
  total: number;
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
export interface CreateKpmrLikuiditasDto {
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

export interface UpdateKpmrLikuiditasDto extends Partial<CreateKpmrLikuiditasDto> {}

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
  console.error('KPMR Likuiditas Service Error:', {
    message: defaultMessage,
    error: error.response?.data || error.message,
    url: error.config?.url || 'URL tidak tersedia',
    method: error.config?.method || 'METHOD tidak tersedia',
    status: error.response?.status,
    statusText: error.response?.statusText,
  });

  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.data?.error || defaultMessage;
      throw new Error(message);
    } else if (error.request) {
      // Request made but no response received
      throw new Error('Tidak ada response dari server. Periksa koneksi jaringan.');
    }
  }

  throw new Error(defaultMessage);
};

export const transformFormToDto = (formData: any): CreateKpmrLikuiditasDto => {
  console.log('🔄 [TRANSFORM DTO] Original form data:', {
    indikator: formData.indikator,
    sectionTitle: formData.sectionTitle,
    allFields: Object.keys(formData),
  });

  const dto = {
    year: formData.year,
    quarter: formData.quarter,
    aspekNo: formData.aspekNo || undefined,
    aspekBobot: formData.aspekBobot ? Number(formData.aspekBobot) : undefined,
    aspekTitle: formData.aspekTitle || undefined,
    sectionNo: formData.sectionNo || undefined,
    // ✅ PERBAIKAN: gunakan indikator langsung, bukan sectionTitle
    indikator: formData.indikator || undefined, // INI YANG HARUS DIPERBAIKI
    sectionSkor: formData.sectionSkor ? Number(formData.sectionSkor) : undefined,
    strong: formData.level1 || undefined,
    satisfactory: formData.level2 || undefined,
    fair: formData.level3 || undefined,
    marginal: formData.level4 || undefined,
    unsatisfactory: formData.level5 || undefined,
    evidence: formData.evidence || undefined,
  };

  console.log('✅ [TRANSFORM DTO] Result DTO:', {
    hasIndikator: !!dto.indikator,
    indikatorValue: dto.indikator,
    dtoSummary: {
      aspek: `${dto.aspekNo} - ${dto.aspekTitle}`,
      section: dto.sectionNo,
      indikator_length: dto.indikator?.length,
    },
  });

  return dto;
};

// Service class untuk KPMR Likuiditas
class KpmrLikuiditasService {
  // ==================== CRUD METHODS ====================

  async getAll(): Promise<KpmrLikuiditas[]> {
    try {
      // Backend langsung return array, tanpa wrapper ApiResponse
      const response = await axios.get<KpmrLikuiditas[]>(`${API_BASE_URL}`);
      return response.data || [];
    } catch (error) {
      throw handleServiceError(error, 'Gagal mengambil data KPMR Likuiditas');
    }
  }

  async getByPeriod(year: number, quarter: string): Promise<KpmrLikuiditas[]> {
    try {
      console.log('Fetching data for period:', year, quarter);
      // Backend langsung return array
      const response = await axios.get<KpmrLikuiditas[]>(`${API_BASE_URL}/period/${year}/${quarter}`);
      console.log('Response data:', response.data);
      return response.data || [];
    } catch (error) {
      throw handleServiceError(error, 'Gagal mengambil data KPMR Likuiditas berdasarkan periode');
    }
  }

  async getGroupedByPeriod(year: number, quarter: string): Promise<GroupedKpmrResponse> {
    try {
      console.log('Fetching grouped data for period:', year, quarter);

      // PERBAIKAN UTAMA: Backend langsung return GroupedKpmrResponse, tanpa wrapper ApiResponse
      const response = await axios.get<GroupedKpmrResponse>(`${API_BASE_URL}/grouped`, {
        params: { year, quarter }, // Gunakan params object, bukan query string manual
      });

      console.log('Grouped data response:', response.data);
      return response.data || { data: [], groups: [], overallAverage: 0 };
    } catch (error) {
      throw handleServiceError(error, 'Gagal mengambil data grouped KPMR Likuiditas');
    }
  }

  async getById(id: number): Promise<KpmrLikuiditas> {
    try {
      // Backend langsung return object KpmrLikuiditas
      const response = await axios.get<KpmrLikuiditas>(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw handleServiceError(error, `Gagal mengambil KPMR Likuiditas ${id}`);
    }
  }

  async create(dto: CreateKpmrLikuiditasDto): Promise<KpmrLikuiditas> {
    try {
      console.log('Creating KPMR Likuiditas with data:', dto);
      // Backend langsung return object KpmrLikuiditas
      const response = await axios.post<KpmrLikuiditas>(`${API_BASE_URL}`, dto);
      console.log('Create response:', response.data);
      return response.data;
    } catch (error) {
      throw handleServiceError(error, 'Gagal membuat KPMR Likuiditas');
    }
  }

  async update(id: number, dto: UpdateKpmrLikuiditasDto): Promise<KpmrLikuiditas> {
    try {
      console.log('Updating KPMR Likuiditas:', id, dto);
      // Backend langsung return object KpmrLikuiditas
      const response = await axios.patch<KpmrLikuiditas>(`${API_BASE_URL}/${id}`, dto);
      return response.data;
    } catch (error) {
      throw handleServiceError(error, `Gagal mengupdate KPMR Likuiditas ${id}`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      console.log('Deleting KPMR Likuiditas:', id);
      await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
      throw handleServiceError(error, `Gagal menghapus KPMR Likuiditas ${id}`);
    }
  }

  // ==================== SPECIAL METHODS ====================

  async getPeriods(): Promise<PeriodResult[]> {
    try {
      // Backend langsung return array PeriodResult
      const response = await axios.get<PeriodResult[]>(`${API_BASE_URL}/periods`);
      return response.data || [];
    } catch (error) {
      throw handleServiceError(error, 'Gagal mengambil daftar periode');
    }
  }

  async getTotalAverage(year: number, quarter: string): Promise<number> {
    try {
      const groupedData = await this.getGroupedByPeriod(year, quarter);
      return groupedData.overallAverage || 0;
    } catch (error) {
      throw handleServiceError(error, 'Gagal mengambil rata-rata total');
    }
  }

  async searchByCriteria(criteria: SearchFilter): Promise<KpmrLikuiditas[]> {
    try {
      const params = new URLSearchParams();
      if (criteria.year) params.append('year', criteria.year.toString());
      if (criteria.quarter) params.append('quarter', criteria.quarter);
      if (criteria.aspekNo) params.append('aspekNo', criteria.aspekNo);
      if (criteria.sectionNo) params.append('sectionNo', criteria.sectionNo);
      if (criteria.query) params.append('search', criteria.query);

      // Backend langsung return KpmrListResponse
      const response = await axios.get<KpmrListResponse>(`${API_BASE_URL}?${params.toString()}`);
      return response.data.data || [];
    } catch (error) {
      throw handleServiceError(error, 'Gagal mencari data');
    }
  }

  async getExportData(year: number, quarter: string): Promise<GroupedKpmrResponse> {
    try {
      // Backend langsung return GroupedKpmrResponse
      const response = await axios.get<GroupedKpmrResponse>(`${API_BASE_URL}/export/${year}/${quarter}`);
      return response.data || { data: [], groups: [], overallAverage: 0 };
    } catch (error) {
      throw handleServiceError(error, 'Gagal mengambil data export');
    }
  }

  // ==================== COMPREHENSIVE DATA FETCHING ====================

  async getComprehensiveData(filter: PeriodFilter): Promise<{
    groupedData: GroupedKpmrResponse;
    totalAverage: number;
    periods: PeriodResult[];
  }> {
    try {
      const [groupedData, periods] = await Promise.all([this.getGroupedByPeriod(filter.year, filter.quarter), this.getPeriods()]);

      return {
        groupedData,
        totalAverage: groupedData.overallAverage,
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

  calculateSectionAverage(sections: KpmrLikuiditas[]): number {
    const validScores = sections.map((section) => section.sectionSkor).filter((score): score is number => typeof score === 'number' && !isNaN(score));

    if (validScores.length === 0) return 0;

    const average = validScores.reduce((sum, score) => sum + score, 0) / validScores.length;
    return Number(average.toFixed(2));
  }

  // Method untuk transform form data ke DTO
  transformToDto(formData: any): CreateKpmrLikuiditasDto {
    return transformFormToDto(formData);
  }

  // Method untuk validasi data sebelum submit
  validateData(data: CreateKpmrLikuiditasDto): string | null {
    if (!data.year || !data.quarter) {
      return 'Year dan Quarter harus diisi';
    }

    if (!this.validateQuarter(data.quarter)) {
      return 'Quarter harus Q1, Q2, Q3, atau Q4';
    }

    if (!this.validateYear(data.year)) {
      return 'Year tidak valid';
    }

    if (data.sectionSkor && (data.sectionSkor < 1 || data.sectionSkor > 5)) {
      return 'Section Skor harus antara 1-5';
    }

    if (data.aspekBobot && (data.aspekBobot < 0 || data.aspekBobot > 100)) {
      return 'Bobot Aspek harus antara 0-100';
    }

    return null;
  }
}

// Export singleton instance
export const kpmrLikuiditasService = new KpmrLikuiditasService();

// Export class untuk testing atau extension
export default KpmrLikuiditasService;
