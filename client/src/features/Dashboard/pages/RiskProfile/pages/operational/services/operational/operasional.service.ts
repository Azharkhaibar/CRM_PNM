// services/operasional/operasional.service.ts
import api from '../api.service';

// Types - sesuai dengan entity backend operasional
export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4';
export type CalculationMode = 'RASIO' | 'NILAI_TUNGGAL';

// Interfaces - SESUAI dengan entity backend operasional
export interface SectionOperational {
  id: number;
  year: number;
  quarter: Quarter;
  no: string;
  bobotSection: number;
  parameter: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
  deletedAt?: Date | null;
  indikators?: Operational[]; // Perhatikan nama field: indikators (dengan 's')
}

export interface Operational {
  id: number;
  year: number;
  quarter: Quarter;
  sectionId: number;
  section?: SectionOperational;
  subNo: string;
  indikator: string; // PERBEDAAN: 'indikator' bukan 'namaIndikator'
  bobotIndikator: number;
  sumberRisiko?: string | null;
  dampak?: string | null;
  mode: CalculationMode;
  pembilangLabel?: string | null;
  pembilangValue?: number | null;
  penyebutLabel?: string | null;
  penyebutValue?: number | null;
  formula?: string | null;
  isPercent: boolean;
  hasil?: number | null; // PERBEDAAN: number bukan string
  peringkat: number;
  weighted: number; // Diisi otomatis oleh backend
  keterangan?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
  deletedAt?: Date | null;
}

// DTOs - SESUAI dengan backend operasional
export interface CreateSectionOperationalDto {
  no: string;
  bobotSection: number;
  parameter: string;
  year: number;
  quarter: string; // Kirim sebagai string, backend akan konversi ke enum
}

export interface UpdateSectionOperationalDto extends Partial<CreateSectionOperationalDto> {}

export interface CreateIndikatorOperationalDto {
  sectionId: number;
  year: number;
  quarter: string; // Kirim sebagai string
  subNo: string;
  indikator: string; // PERBEDAAN: 'indikator' bukan 'namaIndikator'
  bobotIndikator: number;
  sumberRisiko?: string | null;
  dampak?: string | null;
  mode: CalculationMode;
  pembilangLabel?: string | null;
  pembilangValue?: number | null;
  penyebutLabel?: string | null;
  penyebutValue?: number | null;
  formula?: string | null;
  isPercent?: boolean;
  hasil?: number | null; // PERBEDAAN: number bukan string
  peringkat?: number; // Opsional, akan dihitung otomatis jika tidak disediakan
  keterangan?: string | null;
}

export interface UpdateIndikatorOperationalDto extends Partial<CreateIndikatorOperationalDto> {}

// Response types
export interface SummaryResponse {
  year: number;
  quarter: Quarter;
  totalWeighted: number;
  sectionCount: number;
  sections: Array<{
    sectionId: number;
    sectionNo: string;
    sectionName: string;
    bobotSection: number;
    totalWeighted: number;
    indicatorCount: number;
  }>;
}

export interface StructuredOperational {
  section: SectionOperational;
  indicators: Operational[];
  totalWeighted: number;
}

class OperasionalService {
  // ==================== SECTION METHODS ====================

  async getSectionsByPeriod(year: number, quarter: string): Promise<SectionOperational[]> {
    const response = await api.get<SectionOperational[]>('/operasional/sections', {
      params: { year, quarter },
    });
    return response.data;
  }

  async getAllSections(): Promise<SectionOperational[]> {
    try {
      console.log('📤 [OPERASIONAL SERVICE] Getting all sections...');
      const response = await api.get<SectionOperational[]>('/operasional/sections/all');
      console.log('✅ [OPERASIONAL SERVICE] Successfully retrieved all sections:', response.data?.length || 0, 'sections');
      return response.data || [];
    } catch (error: any) {
      console.error('❌ [OPERASIONAL SERVICE] Error getting all sections:', error);

      // Fallback: coba endpoint yang sudah ada tanpa parameter
      try {
        console.log('🔄 [OPERASIONAL SERVICE] Trying fallback method...');
        const response = await api.get<SectionOperational[]>('/operasional/sections');
        console.log('✅ [OPERASIONAL SERVICE] Fallback successful:', response.data?.length || 0, 'sections');
        return response.data || [];
      } catch (fallbackError) {
        console.error('❌ [OPERASIONAL SERVICE] Fallback also failed:', fallbackError);
        throw error; // Lempar error asli
      }
    }
  }

  async getSectionById(id: number): Promise<SectionOperational> {
    const response = await api.get<SectionOperational>(`/operasional/sections/${id}`);
    return response.data;
  }

  async createSection(data: CreateSectionOperationalDto): Promise<SectionOperational> {
    const payload = {
      ...data,
      quarter: data.quarter as string,
    };
    const response = await api.post<SectionOperational>('/operasional/sections', payload);
    return response.data;
  }

  async updateSection(id: number, data: UpdateSectionOperationalDto): Promise<SectionOperational> {
    const payload = {
      ...data,
      quarter: data.quarter as string,
    };
    const response = await api.patch<SectionOperational>(`/operasional/sections/${id}`, payload);
    return response.data;
  }

  async deleteSection(id: number): Promise<void> {
    await api.delete(`/operasional/sections/${id}`);
  }

  // ==================== INDIKATOR METHODS ====================

  async getIndikatorsBySection(sectionId: number): Promise<Operational[]> {
    const response = await api.get<Operational[]>(`/operasional/sections/${sectionId}/indicators`);
    return response.data;
  }

  async getIndikatorsByPeriod(year: number, quarter: string): Promise<Operational[]> {
    const response = await api.get<Operational[]>('/operasional/indicators', {
      params: { year, quarter },
    });
    return response.data;
  }

  async getIndikatorById(id: number): Promise<Operational> {
    const response = await api.get<Operational>(`/operasional/indicators/${id}`);
    return response.data;
  }

  async createIndikator(data: CreateIndikatorOperationalDto): Promise<Operational> {
    const payload = { ...data };
    payload.quarter = payload.quarter as string;

    console.log('📤 [OPERASIONAL SERVICE] Payload untuk create indikator:', payload);

    const response = await api.post<Operational>('/operasional/indicators', payload);
    return response.data;
  }

  async updateIndikator(id: number, data: UpdateIndikatorOperationalDto): Promise<Operational> {
    const payload = { ...data };

    if (payload.quarter) {
      payload.quarter = payload.quarter as string;
    }

    console.log('📤 [OPERASIONAL SERVICE updateIndikator] START - ID:', id, 'Data:', payload);

    try {
      const response = await api.patch<Operational>(`/operasional/indicators/${id}`, payload);

      console.log('✅ [OPERASIONAL SERVICE updateIndikator] SUCCESS - Response:', {
        status: response.status,
        data: response.data,
        indikator: response.data.indikator,
        updatedAt: response.data.updatedAt,
      });

      return response.data;
    } catch (error: any) {
      console.error('❌ [OPERASIONAL SERVICE updateIndikator] ERROR:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
        },
      });
      throw error;
    }
  }

  async checkIndikatorExists(id: number): Promise<boolean> {
    try {
      await this.getIndikatorById(id);
      return true;
    } catch {
      return false;
    }
  }

  async deleteIndikator(id: number): Promise<void> {
    await api.delete(`/operasional/indicators/${id}`);
  }

  // ==================== SUMMARY METHODS ====================

  async getSummaryByPeriod(year: number, quarter: string): Promise<SummaryResponse> {
    const response = await api.get<SummaryResponse>('/operasional/summary', {
      params: { year, quarter },
    });
    return response.data;
  }

  async getSectionSummary(sectionId: number): Promise<any> {
    const response = await api.get(`/operasional/sections/${sectionId}/summary`);
    return response.data;
  }

  // ==================== UTILITY METHODS ====================

  formatIndikatorData(formData: any, section: SectionOperational): CreateIndikatorOperationalDto {
    return {
      sectionId: section.id,
      year: Number(formData.year) || section.year,
      quarter: formData.quarter || section.quarter,
      subNo: formData.subNo || '',
      indikator: formData.indikator || '',
      bobotIndikator: Number(formData.bobotIndikator || 0),
      sumberRisiko: formData.sumberRisiko || null,
      dampak: formData.dampak || null,
      mode: (formData.mode || 'RASIO') as CalculationMode,
      pembilangLabel: formData.pembilangLabel || null,
      pembilangValue: formData.pembilangValue !== undefined ? Number(formData.pembilangValue) : null,
      penyebutLabel: formData.penyebutLabel || null,
      penyebutValue: formData.penyebutValue !== undefined ? Number(formData.penyebutValue) : null,
      formula: formData.formula || null,
      isPercent: Boolean(formData.isPercent || false),
      hasil: formData.hasil !== undefined ? Number(formData.hasil) : null,
      peringkat: formData.peringkat || 1,
      keterangan: formData.keterangan || null,
    };
  }

  calculateHasil(mode: string, pembilangValue: number | null, penyebutValue: number | null, formula?: string | null, isPercent?: boolean): number | null {
    const pemb = pembilangValue || 0;
    const peny = penyebutValue || 0;

    if (mode === 'NILAI_TUNGGAL') {
      return peny;
    }

    if (formula && formula.trim() !== '') {
      try {
        const expr = formula
          .replace(/\bpembilang\b/gi, 'pemb')
          .replace(/\bpenyebut\b/gi, 'peny')
          .replace(/\bpemb\b/g, 'pemb')
          .replace(/\bpeny\b/g, 'peny');

        const fn = new Function('pemb', 'peny', `return (${expr});`);
        const result = fn(pemb, peny);

        if (isFinite(result) && !isNaN(result)) {
          if (isPercent) {
            return result * 100;
          }
          return result;
        }
      } catch (error) {
        console.warn('Invalid formula:', formula, error);
      }
    }

    if (peny === 0) {
      return null;
    }

    const result = pemb / peny;
    if (isPercent) {
      return result * 100;
    }
    return result;
  }

  calculateWeighted(bobotSection: number, bobotIndikator: number, peringkat: number): number {
    const weighted = (bobotSection * bobotIndikator * peringkat) / 10000;
    return parseFloat(weighted.toFixed(4));
  }

  formatHasilDisplay(hasil: number | null, isPercent: boolean, mode: string): string {
    if (hasil === null || hasil === undefined) return '';

    if (mode === 'NILAI_TUNGGAL') {
      // Format untuk nilai tunggal (biasanya integer)
      return Math.round(hasil).toString();
    }

    if (isPercent) {
      return `${hasil.toFixed(2)}%`;
    }

    // Format untuk rasio (4 angka desimal)
    return hasil.toFixed(4);
  }

  groupBySection(operationalList: Operational[]): StructuredOperational[] {
    const sectionsMap = new Map<number, StructuredOperational>();

    operationalList.forEach((item) => {
      const sectionId = item.sectionId;

      if (!sectionsMap.has(sectionId)) {
        sectionsMap.set(sectionId, {
          section: item.section || {
            id: sectionId,
            year: item.year,
            quarter: item.quarter,
            no: '',
            bobotSection: 0,
            parameter: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            isDeleted: false,
            indikators: [],
          },
          indicators: [],
          totalWeighted: 0,
        });
      }

      const sectionData = sectionsMap.get(sectionId)!;
      sectionData.indicators.push(item);
      sectionData.totalWeighted += item.weighted || 0;
    });

    return Array.from(sectionsMap.values());
  }

  async getOperationalStructured(year?: number, quarter?: string): Promise<StructuredOperational[]> {
    let url = '/operasional/indicators';
    const params: any = {};

    if (year) params.year = year;
    if (quarter) params.quarter = quarter;

    const response = await api.get<Operational[]>(url, { params });
    return this.groupBySection(response.data);
  }

  handleError(error: any): string {
    if (error.response) {
      const { data, status } = error.response;

      if (status === 500) {
        return 'Server error: Internal server error. Please try again later.';
      }

      if (data?.message) {
        if (Array.isArray(data.message)) {
          return data.message
            .map((item: any) => {
              if (item.constraints) {
                const field = item.property || 'field';
                const errors = Object.values(item.constraints).join(', ');
                return `${field}: ${errors}`;
              }
              return typeof item === 'string' ? item : JSON.stringify(item);
            })
            .join('\n');
        }
        return typeof data.message === 'string' ? data.message : JSON.stringify(data.message);
      }

      return `Server error: ${status}`;
    } else if (error.request) {
      return 'Network error: No response from server. Please check your connection.';
    } else {
      return error.message || 'Unknown error occurred';
    }
  }
}

// Export singleton instance
export const operasionalService = new OperasionalService();

// Optional: Export class juga jika diperlukan
export default OperasionalService;
