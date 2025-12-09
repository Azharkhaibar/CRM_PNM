// services/likuiditas.service.ts
import api from '../api.services';

// Types - definisikan langsung di sini untuk menghindari import circular
export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4';
export type CalculationMode = 'RASIO' | 'NILAI_TUNGGAL' | 'TEKS';

// Interfaces - SESUAI dengan entity backend
export interface SectionLikuiditas {
  id: number;
  year: number;
  quarter: Quarter;
  no: string;
  bobotSection: number;
  parameter: string;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
  deletedAt?: Date | null;
  indikators?: Likuiditas[]; // Perhatikan nama field: indikators (dengan 's')
}

export interface Likuiditas {
  id: number;
  year: number;
  quarter: Quarter;
  sectionId: number;
  section?: SectionLikuiditas;
  subNo: string;
  namaIndikator: string;
  bobotIndikator: number;
  sumberRisiko?: string | null;
  dampak?: string | null;
  low?: string | null;
  lowToModerate?: string | null;
  moderate?: string | null;
  moderateToHigh?: string | null;
  high?: string | null;
  mode: CalculationMode;
  pembilangLabel?: string | null;
  pembilangValue?: number | null;
  penyebutLabel?: string | null;
  penyebutValue?: number | null;
  formula?: string | null;
  isPercent: boolean;
  hasil?: string | null;
  hasilText?: string | null;
  peringkat: number;
  weighted: number; // Diisi otomatis oleh backend
  keterangan?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
  deletedAt?: Date | null;
}

// DTOs - SESUAI dengan backend
export interface CreateSectionLikuiditasDto {
  no: string;
  bobotSection: number;
  parameter: string;
  description?: string | null;
  year: number;
  quarter: string; // Kirim sebagai string, backend akan konversi ke enum
}

export interface UpdateSectionLikuiditasDto extends Partial<CreateSectionLikuiditasDto> {}

export interface CreateIndikatorLikuiditasDto {
  sectionId: number;
  year: number;
  quarter: string; // Kirim sebagai string
  subNo: string;
  namaIndikator: string;
  bobotIndikator: number;
  sumberRisiko?: string | null;
  dampak?: string | null;
  low?: string | null;
  lowToModerate?: string | null;
  moderate?: string | null;
  moderateToHigh?: string | null;
  high?: string | null;
  mode: CalculationMode;
  pembilangLabel?: string | null;
  pembilangValue?: number | null;
  penyebutLabel?: string | null;
  penyebutValue?: number | null;
  formula?: string | null;
  isPercent?: boolean;
  hasil?: string | null;
  hasilText?: string | null;
  peringkat?: number; // Opsional, akan dihitung otomatis jika tidak disediakan
  keterangan?: string | null;
}

export interface UpdateIndikatorLikuiditasDto extends Partial<CreateIndikatorLikuiditasDto> {}

// Response types
export interface SummaryResponse {
  year: number;
  quarter: Quarter;
  totalSections: number;
  totalWeighted: number;
  sections: Array<{
    id: number;
    no: string;
    parameter: string;
    bobotSection: number;
    totalIndicators: number;
    totalWeighted: number;
  }>;
}

export interface StructuredLikuiditas {
  section: SectionLikuiditas;
  indicators: Likuiditas[];
  totalWeighted: number;
}

class LikuiditasService {
  // ==================== SECTION METHODS ====================

  async getSections(): Promise<SectionLikuiditas[]> {
    const response = await api.get<SectionLikuiditas[]>('/likuiditas/sections');
    return response.data;
  }

  async getSectionsByPeriod(year: number, quarter: string): Promise<SectionLikuiditas[]> {
    // PERBAIKAN: Sesuaikan dengan endpoint backend
    const response = await api.get<SectionLikuiditas[]>('/likuiditas/sections', {
      params: { year, quarter },
    });
    return response.data;
  }

  async getSectionById(id: number): Promise<SectionLikuiditas> {
    const response = await api.get<SectionLikuiditas>(`/likuiditas/sections/${id}`);
    return response.data;
  }

  async createSection(data: CreateSectionLikuiditasDto): Promise<SectionLikuiditas> {
    // PERBAIKAN: Pastikan quarter dikirim sebagai string
    const payload = {
      ...data,
      quarter: data.quarter as string, // Cast ke string
    };
    const response = await api.post<SectionLikuiditas>('/likuiditas/sections', payload);
    return response.data;
  }

  async updateSection(id: number, data: UpdateSectionLikuiditasDto): Promise<SectionLikuiditas> {
    const payload = {
      ...data,
      quarter: data.quarter as string, // Cast ke string jika ada
    };
    const response = await api.put<SectionLikuiditas>(`/likuiditas/sections/${id}`, payload);
    return response.data;
  }

  async deleteSection(id: number): Promise<void> {
    await api.delete(`/likuiditas/sections/${id}`);
  }

  // ==================== INDIKATOR METHODS ====================

  async getIndikators(): Promise<Likuiditas[]> {
    const response = await api.get<Likuiditas[]>('/likuiditas/indikators');
    return response.data;
  }

  async getIndikatorsBySection(sectionId: number): Promise<Likuiditas[]> {
    const response = await api.get<Likuiditas[]>(`/likuiditas/indikators/by-section/${sectionId}`);
    return response.data;
  }

  async getIndikatorsByPeriod(year: number, quarter: string): Promise<Likuiditas[]> {
    const response = await api.get<Likuiditas[]>('/likuiditas/indikators/by-period', {
      params: { year, quarter },
    });
    return response.data;
  }

  async getIndikatorById(id: number): Promise<Likuiditas> {
    // PERBAIKAN: Gunakan endpoint yang benar
    const response = await api.get<Likuiditas>(`/likuiditas/indikators/${id}`);
    return response.data;
  }

  async createIndikator(data: CreateIndikatorLikuiditasDto): Promise<Likuiditas> {
    // PERBAIKAN: Hapus field yang dihitung otomatis
    const payload = { ...data };

    // Jangan kirim field yang

    // Pastikan quarter string
    payload.quarter = payload.quarter as string;

    console.log('📤 [SERVICE] Payload untuk create indikator:', payload);

    const response = await api.post<Likuiditas>('/likuiditas/indikators', payload);
    return response.data;
  }

  async updateIndikator(id: number, data: UpdateIndikatorLikuiditasDto): Promise<Likuiditas> {
    // PERBAIKAN: Gunakan endpoint yang benar
    const payload = { ...data };

    // Jangan kirim field yang dihitung otomatis
    delete (payload as any).weighted;

    // Pastikan quarter string jika ada
    if (payload.quarter) {
      payload.quarter = payload.quarter as string;
    }

    console.log('📤 [SERVICE updateIndikator] START - ID:', id, 'Data:', payload);

    try {
      // PERBAIKAN: Gunakan endpoint yang benar sesuai controller
      const response = await api.put<Likuiditas>(`/likuiditas/indikators/${id}`, payload);

      console.log('✅ [SERVICE updateIndikator] SUCCESS - Response:', {
        status: response.status,
        data: response.data,
        namaIndikator: response.data.namaIndikator,
        updatedAt: response.data.updatedAt,
      });

      return response.data;
    } catch (error: any) {
      console.error('❌ [SERVICE updateIndikator] ERROR:', {
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
  // **PERBAIKAN: Tambah fungsi untuk cek indikator**
  async checkIndikatorExists(id: number): Promise<boolean> {
    try {
      await this.getIndikatorById(id);
      return true;
    } catch {
      return false;
    }
  }

  async deleteIndikator(id: number): Promise<void> {
    // PERBAIKAN: Gunakan endpoint yang benar
    await api.delete(`/likuiditas/indikators/${id}`);
  }

  // ==================== SUMMARY METHODS ====================

  async getSummaryByPeriod(year: number, quarter: string): Promise<any> {
    // PERBAIKAN: Sesuaikan dengan endpoint backend
    const response = await api.get<any>('/likuiditas/summary', {
      params: { year, quarter },
    });
    return response.data;
  }
  // async getSectionsByYear(year: number): Promise<SectionLikuiditas[]> {
  //   const response = await api.get<SectionLikuiditas[]>(`/likuiditas/summary/by-year/${year}`);
  //   return response.data;
  // }

  async getSectionSummary(sectionId: number): Promise<any> {
    const response = await api.get(`/likuiditas/sections/${sectionId}/summary`);
    return response.data;
  }

  // ==================== UTILITY METHODS ====================

  formatIndikatorData(formData: any, section: SectionLikuiditas): CreateIndikatorLikuiditasDto {
    // HITUNG PERINGKAT jika tidak disediakan
    const peringkat =
      formData.peringkat ||
      this.calculatePeringkatFromHasil(formData.hasil, {
        low: formData.low,
        lowToModerate: formData.lowToModerate,
        moderate: formData.moderate,
        moderateToHigh: formData.moderateToHigh,
        high: formData.high,
      });

    return {
      sectionId: section.id,
      year: Number(formData.year) || section.year,
      quarter: formData.quarter || section.quarter,
      subNo: formData.subNo || '',
      namaIndikator: formData.namaIndikator || '',
      bobotIndikator: Number(formData.bobotIndikator || 0),
      sumberRisiko: formData.sumberRisiko || null,
      dampak: formData.dampak || null,
      low: formData.low || null,
      lowToModerate: formData.lowToModerate || null,
      moderate: formData.moderate || null,
      moderateToHigh: formData.moderateToHigh || null,
      high: formData.high || null,
      mode: (formData.mode || 'RASIO') as CalculationMode,
      pembilangLabel: formData.pembilangLabel || null,
      pembilangValue: formData.pembilangValue !== undefined ? Number(formData.pembilangValue) : null,
      penyebutLabel: formData.penyebutLabel || null,
      penyebutValue: formData.penyebutValue !== undefined ? Number(formData.penyebutValue) : null,
      formula: formData.formula || null,
      isPercent: Boolean(formData.isPercent || false),
      hasil: formData.hasil || null,
      hasilText: formData.hasilText || null,
      peringkat: peringkat,
      keterangan: formData.keterangan || null,
    };
  }

  calculateHasil(mode: string, pembilangValue: number | null, penyebutValue: number | null, formula?: string | null, isPercent?: boolean): string | null {
    if (mode === 'TEKS') {
      return null;
    }

    const pemb = pembilangValue || 0;
    const peny = penyebutValue || 0;

    if (mode === 'NILAI_TUNGGAL') {
      return peny.toString();
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
            return (result * 100).toFixed(2);
          }
          return result.toString();
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
      return (result * 100).toFixed(2);
    }
    return result.toFixed(4);
  }

  calculateWeighted(bobotSection: number, bobotIndikator: number, peringkat: number): number {
    // Ini hanya untuk preview di frontend, bukan untuk dikirim ke backend
    const weighted = (bobotSection * bobotIndikator * peringkat) / 10000;
    return parseFloat(weighted.toFixed(4));
  }

  calculatePeringkatFromHasil(
    hasil: string | null,
    thresholds: {
      low?: string | null;
      lowToModerate?: string | null;
      moderate?: string | null;
      moderateToHigh?: string | null;
      high?: string | null;
    }
  ): number {
    if (!hasil) return 1;

    try {
      const hasilNum = parseFloat(hasil);

      // Konversi thresholds ke angka
      const low = thresholds.low ? parseFloat(thresholds.low) : null;
      const lowToModerate = thresholds.lowToModerate ? parseFloat(thresholds.lowToModerate) : null;
      const moderate = thresholds.moderate ? parseFloat(thresholds.moderate) : null;
      const moderateToHigh = thresholds.moderateToHigh ? parseFloat(thresholds.moderateToHigh) : null;
      const high = thresholds.high ? parseFloat(thresholds.high) : null;

      // Logika peringkat: semakin tinggi hasil, semakin rendah peringkat (1-5)
      if (high !== null && hasilNum >= high) return 5;
      if (moderateToHigh !== null && hasilNum >= moderateToHigh) return 4;
      if (moderate !== null && hasilNum >= moderate) return 3;
      if (lowToModerate !== null && hasilNum >= lowToModerate) return 2;
      if (low !== null && hasilNum >= low) return 1;

      return 1; // default
    } catch (error) {
      console.warn('Error calculating peringkat:', error);
      return 1;
    }
  }

  determineRiskLevel(
    hasil: string | null,
    thresholds: {
      low?: string | null;
      lowToModerate?: string | null;
      moderate?: string | null;
      moderateToHigh?: string | null;
      high?: string | null;
    }
  ): string {
    if (!hasil) return 'unknown';

    try {
      const hasilNum = parseFloat(hasil);

      // Konversi thresholds ke angka
      const low = thresholds.low ? parseFloat(thresholds.low) : null;
      const lowToModerate = thresholds.lowToModerate ? parseFloat(thresholds.lowToModerate) : null;
      const moderate = thresholds.moderate ? parseFloat(thresholds.moderate) : null;
      const moderateToHigh = thresholds.moderateToHigh ? parseFloat(thresholds.moderateToHigh) : null;
      const high = thresholds.high ? parseFloat(thresholds.high) : null;

      if (high !== null && hasilNum >= high) return 'high';
      if (moderateToHigh !== null && hasilNum >= moderateToHigh) return 'moderate_to_high';
      if (moderate !== null && hasilNum >= moderate) return 'moderate';
      if (lowToModerate !== null && hasilNum >= lowToModerate) return 'low_to_moderate';
      if (low !== null && hasilNum >= low) return 'low';

      return 'unknown';
    } catch (error) {
      console.warn('Error determining risk level:', error);
      return 'unknown';
    }
  }

  groupBySection(likuiditasList: Likuiditas[]): StructuredLikuiditas[] {
    const sectionsMap = new Map<number, StructuredLikuiditas>();

    likuiditasList.forEach((item) => {
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
            description: '',
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

  async getLikuiditasStructured(year?: number, quarter?: string): Promise<StructuredLikuiditas[]> {
    let url = '/likuiditas/indikators';
    const params: any = {};

    if (year) params.year = year;
    if (quarter) params.quarter = quarter;

    const response = await api.get<Likuiditas[]>(url, { params });
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
export const likuiditasService = new LikuiditasService();

// Optional: Export class juga jika diperlukan
export default LikuiditasService;
