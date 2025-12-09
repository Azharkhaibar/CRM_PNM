// service/pasar/pasar.service.ts - Perbaikan error handling
import axios, { AxiosError } from 'axios';
import { SectionPasar, IndikatorPasar, SummaryResponse, CreateSectionDto, UpdateSectionDto, CreateIndikatorDto, UpdateIndikatorDto, GroupedSection, FormattedIndikatorData, ExportData } from '../types/pasar.types';

const API_BASE_URL = 'http://localhost:5530/api/v1/pasar';

// Interceptor untuk debug request/response
const api_pasar = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Increase timeout
});

// Request interceptor untuk logging
api_pasar.interceptors.request.use(
  (config) => {
    console.log('📤 Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      params: config.params,
    });
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor untuk logging
api_pasar.interceptors.response.use(
  (response) => {
    console.log('📥 Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('❌ Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export class PasarService {
  // ==================== SECTION METHODS ====================

  async getSections(): Promise<SectionPasar[]> {
    try {
      const response = await api_pasar.get<SectionPasar[]>('/sections');
      return response.data;
    } catch (error) {
      console.error('Error in getSections:', error);
      throw error;
    }
  }

  async getSectionsByPeriod(tahun: number, triwulan: string): Promise<SectionPasar[]> {
    try {
      const response = await api_pasar.get<SectionPasar[]>('/sections/period', {
        params: { tahun, triwulan },
      });
      return response.data;
    } catch (error) {
      console.error('Error in getSectionsByPeriod:', error);
      throw error;
    }
  }

  async getSectionById(id: number): Promise<SectionPasar> {
    try {
      const response = await api_pasar.get<SectionPasar>(`/sections/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in getSectionById:', error);
      throw error;
    }
  }

  async createSection(data: CreateSectionDto): Promise<SectionPasar> {
    try {
      console.log('Creating section with data:', data);
      const response = await api_pasar.post<SectionPasar>('/sections', data);
      return response.data;
    } catch (error) {
      console.error('Error in createSection:', error);
      throw error;
    }
  }

  async updateSection(id: number, data: UpdateSectionDto): Promise<SectionPasar> {
    try {
      const response = await api_pasar.patch<SectionPasar>(`/sections/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error in updateSection:', error);
      throw error;
    }
  }

  async deleteSection(id: number): Promise<void> {
    try {
      await api_pasar.delete(`/sections/${id}`);
    } catch (error) {
      console.error('Error in deleteSection:', error);
      throw error;
    }
  }

  // ==================== INDIKATOR METHODS ====================

  async getAllIndikators(): Promise<IndikatorPasar[]> {
    try {
      const response = await api_pasar.get<IndikatorPasar[]>('/indikators');
      return response.data;
    } catch (error) {
      console.error('Error in getAllIndikators:', error);
      throw error;
    }
  }

  async getIndikatorsBySection(sectionId: number): Promise<IndikatorPasar[]> {
    try {
      const response = await api_pasar.get<IndikatorPasar[]>('/indikators/section', {
        params: { sectionId },
      });
      return response.data;
    } catch (error) {
      console.error('Error in getIndikatorsBySection:', error);
      throw error;
    }
  }

  async getIndikatorById(id: number): Promise<IndikatorPasar> {
    try {
      const response = await api_pasar.get<IndikatorPasar>(`/indikators/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in getIndikatorById:', error);
      throw error;
    }
  }

  async createIndikator(data: CreateIndikatorDto): Promise<IndikatorPasar> {
    try {
      console.log('Creating indikator with data:', JSON.stringify(data, null, 2));

      // Clean data: remove undefined and null values
      const cleanData = this.cleanDataForRequest(data);
      console.log('Cleaned data for request:', JSON.stringify(cleanData, null, 2));

      const response = await api_pasar.post<IndikatorPasar>('/indikators', cleanData);
      return response.data;
    } catch (error) {
      console.error('Error in createIndikator:', error);
      throw error;
    }
  }

  async updateIndikator(id: number, data: UpdateIndikatorDto): Promise<IndikatorPasar> {
    try {
      // Clean data: remove undefined and null values
      const cleanData = this.cleanDataForRequest(data);

      const response = await api_pasar.patch<IndikatorPasar>(`/indikators/${id}`, cleanData);
      return response.data;
    } catch (error) {
      console.error('Error in updateIndikator:', error);
      throw error;
    }
  }

  async deleteIndikator(id: number): Promise<void> {
    try {
      await api_pasar.delete(`/indikators/${id}`);
    } catch (error) {
      console.error('Error in deleteIndikator:', error);
      throw error;
    }
  }

  async searchIndikators(query: string): Promise<IndikatorPasar[]> {
    try {
      const response = await api_pasar.get<IndikatorPasar[]>('/indikators/search', {
        params: { query },
      });
      return response.data;
    } catch (error) {
      console.error('Error in searchIndikators:', error);
      throw error;
    }
  }

  // ==================== DASHBOARD & SUMMARY METHODS ====================

  async getOverallSummary(tahun: number, triwulan: string): Promise<SummaryResponse> {
    try {
      const response = await api_pasar.get<SummaryResponse>('/dashboard/summary', {
        params: { tahun, triwulan },
      });
      return response.data;
    } catch (error) {
      console.error('Error in getOverallSummary:', error);
      throw error;
    }
  }

  // ==================== UTILITY METHODS ====================

  calculateHasil(pembilang: number, penyebut: number): number {
    if (!penyebut || penyebut === 0) return 0;
    return Number((pembilang / penyebut).toFixed(6));
  }

  calculateWeighted(bobotSection: number, bobotIndikator: number, peringkat: number): number {
    return Number(((bobotSection * bobotIndikator * peringkat) / 10000).toFixed(2));
  }

  determineRiskLevel(hasil: number): string {
    const percent = hasil * 100;
    if (percent <= 1) return 'low';
    if (percent <= 2) return 'low_to_moderate';
    if (percent <= 3) return 'moderate';
    if (percent <= 4) return 'moderate_to_high';
    return 'high';
  }

  // Helper untuk membersihkan data sebelum dikirim ke API
  cleanDataForRequest(data: any): any {
    const cleanData: any = {};

    Object.keys(data).forEach((key) => {
      const value = data[key];

      // Skip undefined values
      if (value === undefined) {
        return;
      }

      // Convert empty strings to null for optional fields
      if (value === '' && this.isOptionalField(key)) {
        cleanData[key] = null;
      }
      // Keep other values as is
      else {
        cleanData[key] = value;
      }
    });

    return cleanData;
  }

  // Helper untuk menentukan field yang optional
  private isOptionalField(field: string): boolean {
    const optionalFields = ['pembilang_label', 'pembilang_value', 'penyebut_label', 'penyebut_value', 'keterangan', 'formula'];
    return optionalFields.includes(field);
  }

  // Helper untuk handle error dengan detail
  handleError(error: any): string {
    console.error('🔄 Full error details:', {
      error,
      response: error.response,
      request: error.request,
      message: error.message,
    });

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{
        message?: string | string[] | any;
        errors?: any[];
        statusCode?: number;
        error?: string;
      }>;

      if (axiosError.response) {
        const { data, status, statusText } = axiosError.response;

        console.log('🔍 Server Response:', {
          status,
          statusText,
          data,
        });

        // Handle validation errors
        if (status === 400) {
          if (data?.message) {
            // Handle array of validation errors
            if (Array.isArray(data.message)) {
              return data.message
                .map((item: any) => {
                  if (typeof item === 'string') return item;
                  if (item.constraints) {
                    const field = item.property || 'field';
                    const errors = Object.values(item.constraints).join(', ');
                    return `${field}: ${errors}`;
                  }
                  return JSON.stringify(item);
                })
                .join('\n');
            }
            // Handle string message
            if (typeof data.message === 'string') {
              return data.message;
            }
            // Handle object message
            if (typeof data.message === 'object') {
              return JSON.stringify(data.message);
            }
          }

          // Handle errors array
          if (data?.errors && Array.isArray(data.errors)) {
            return data.errors.map((err: any) => `${err.field || 'field'}: ${err.message}`).join('\n');
          }

          return `Validation failed: ${statusText || 'Bad Request'}`;
        }

        // Handle 500 errors
        if (status >= 500) {
          return `Server error: ${statusText || 'Internal Server Error'}`;
        }

        // Handle other errors
        return `Error ${status}: ${statusText || 'Unknown error'}`;
      }

      // Handle network errors
      if (axiosError.request) {
        return 'Network error: Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
      }
    }

    // Handle other types of errors
    return error.message || 'Terjadi kesalahan yang tidak diketahui';
  }

  // Format data untuk transformasi
  formatIndikatorData(formData: any, sectionId: number): CreateIndikatorDto {
    const cleanData: CreateIndikatorDto = {
      sectionId: sectionId,
      nama_indikator: formData.nama_indikator?.trim() || '',
      bobot_indikator: Number(formData.bobot_indikator || 0),
      sumber_risiko: formData.sumber_risiko?.trim() || '',
      dampak: formData.dampak?.trim() || '',
      low: formData.low?.trim() || '',
      low_to_moderate: formData.low_to_moderate?.trim() || '',
      moderate: formData.moderate?.trim() || '',
      moderate_to_high: formData.moderate_to_high?.trim() || '',
      high: formData.high?.trim() || '',
      peringkat: Number(formData.peringkat || 1),
      mode: formData.mode || 'RASIO',
      is_percent: Boolean(formData.is_percent || false),
    };

    // Optional fields - only include if they have values
    if (formData.pembilang_label?.trim()) {
      cleanData.pembilang_label = formData.pembilang_label.trim();
    }

    if (formData.pembilang_value !== undefined && formData.pembilang_value !== null && formData.pembilang_value !== '') {
      cleanData.pembilang_value = Number(formData.pembilang_value);
    }

    if (formData.penyebut_label?.trim()) {
      cleanData.penyebut_label = formData.penyebut_label.trim();
    }

    if (formData.penyebut_value !== undefined && formData.penyebut_value !== null && formData.penyebut_value !== '') {
      cleanData.penyebut_value = Number(formData.penyebut_value);
    }

    if (formData.keterangan?.trim()) {
      cleanData.keterangan = formData.keterangan.trim();
    }

    if (formData.formula?.trim()) {
      cleanData.formula = formData.formula.trim();
    }

    return cleanData;
  }

  // Group data untuk display
  groupBySection(sections: SectionPasar[]): GroupedSection[] {
    return sections.map((section) => ({
      section,
      indikators: section.indikators || [],
      total_weighted: section.total_weighted || 0,
    }));
  }

  // Format untuk export
  formatForExport(sections: SectionPasar[], year: number, quarter: string): ExportData[] {
    return sections.map((section) => ({
      year,
      quarter,
      sectionNo: section.no_sec,
      sectionLabel: section.nama_section,
      bobotSection: section.bobot_par,
      rows: (section.indikators || []).map(
        (indikator): FormattedIndikatorData => ({
          indikator: indikator.nama_indikator,
          bobotIndikator: indikator.bobot_indikator,
          sumberRisiko: indikator.sumber_risiko,
          dampak: indikator.dampak,
          pembilangLabel: indikator.pembilang_label,
          pembilangValue: indikator.pembilang_value,
          penyebutLabel: indikator.penyebut_label,
          penyebutValue: indikator.penyebut_value,
          low: indikator.low,
          lowToModerate: indikator.low_to_moderate,
          moderate: indikator.moderate,
          moderateToHigh: indikator.moderate_to_high,
          high: indikator.high,
          peringkat: indikator.peringkat,
          weighted: indikator.weighted,
          hasil: indikator.hasil,
          keterangan: indikator.keterangan,
        })
      ),
    }));
  }
}

export const pasarService = new PasarService();
export default PasarService;
