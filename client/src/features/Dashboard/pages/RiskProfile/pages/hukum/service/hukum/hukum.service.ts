// src/services/hukum/hukum.service.ts

import apiHukum from './api.service';

import { Hukum, HukumSection, CreateHukumDto, CreateHukumSectionDto, UpdateHukumDto, UpdateHukumSectionDto, Quarter, CalculationMode, HukumSummary, StructuredHukum, HukumFormData } from '../../types/hukum.types';

class HukumService {
  // ========== SECTION METHODS ==========
  async getSections(): Promise<HukumSection[]> {
    try {
      console.log('🔍 Fetching sections from backend...');
      const response = await apiHukum.get<HukumSection[]>('/sections/all');

      // Debug log
      console.log('📥 Sections from backend:', response.data);

      // Return langsung, biarkan hook yang handle filtering
      return response.data || [];
    } catch (error: any) {
      console.error('❌ Failed to fetch hukum sections:', error);

      // Return empty array, TIDAK default sections
      return [];
    }
  }

  async createSection(data: CreateHukumSectionDto): Promise<HukumSection> {
    const response = await apiHukum.post<HukumSection>('/sections', data);
    return response.data;
  }

  async updateSection(id: number, data: UpdateHukumSectionDto): Promise<HukumSection> {
    const response = await apiHukum.patch<HukumSection>(`/sections/${id}`, data);
    return response.data;
  }

  async deleteSection(id: number): Promise<void> {
    try {
      console.log(`🔍 Deleting hukum section ${id}`);

      // Langsung hapus tanpa cek indikator dulu (backend akan handle constraint)
      await apiHukum.delete(`/sections/${id}`);
      console.log(`✅ Hukum Section ${id} deleted successfully`);
    } catch (error: any) {
      console.error(`❌ Failed to delete hukum section ${id}:`, error);

      // Handle specific backend errors
      if (error.response?.status === 400) {
        const message = error.response.data?.message || '';
        if (message.includes('indikator') || message.includes('data')) {
          throw new Error('Tidak dapat menghapus section karena masih memiliki data indikator.');
        }
        throw new Error(message || 'Data tidak valid');
      } else if (error.response?.status === 404) {
        throw new Error('Section tidak ditemukan di database.');
      } else if (error.response?.status === 500) {
        console.error('Server error details:', error.response.data);
        throw new Error('Server error: ' + (error.response.data?.message || 'Internal server error'));
      } else {
        throw new Error('Gagal menghapus section: ' + (error.message || 'Unknown error'));
      }
    }
  }

  async getSectionById(id: number): Promise<HukumSection | null> {
    try {
      console.log(`🔍 Fetching hukum section ${id}`);
      const response = await apiHukum.get<HukumSection>(`/sections/${id}`);

      // Filter out deleted sections
      if (response.data.isDeleted) {
        console.warn(`⚠️ Section ${id} is marked as deleted`);
        return null;
      }

      return response.data;
    } catch (error: any) {
      // Handle 404 specifically
      if (error.response?.status === 404) {
        console.warn(`Section ${id} not found`);
        return null;
      }

      // Handle 500 errors
      if (error.response?.status === 500) {
        console.error(`Server error when fetching section ${id}:`, error.response.data);
        throw new Error('Server error when fetching section');
      }

      console.warn(`Failed to fetch hukum section ${id}:`, error);
      return null;
    }
  }

  // ========== HUKUM METHODS ==========
  async getHukum(year?: number, quarter?: Quarter): Promise<Hukum[]> {
    try {
      const params: any = {};
      if (year) params.year = year;
      if (quarter) params.quarter = quarter;

      const response = await apiHukum.get<Hukum[]>('/', { params });
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch hukum, using empty array:', error);
      return [];
    }
  }

  async getHukumByPeriod(year: number, quarter: Quarter): Promise<Hukum[]> {
    try {
      const response = await apiHukum.get<Hukum[]>('/', {
        params: { year, quarter },
      });
      return response.data;
    } catch (error) {
      console.warn(`Failed to fetch hukum for ${year} ${quarter}, using empty array:`, error);
      return [];
    }
  }

  async getHukumBySection(sectionId: number, year?: number, quarter?: Quarter): Promise<Hukum[]> {
    try {
      const params: any = {};
      if (year) params.year = year;
      if (quarter) params.quarter = quarter;

      const response = await apiHukum.get<Hukum[]>(`/section/${sectionId}`, { params });
      return response.data;
    } catch (error) {
      console.warn(`Failed to fetch hukum for section ${sectionId}, using empty array:`, error);
      return [];
    }
  }

  async getHukumStructured(year?: number, quarter?: Quarter): Promise<StructuredHukum[]> {
    try {
      const hukumList = await this.getHukum(year, quarter);
      return this.groupBySection(hukumList);
    } catch (error) {
      console.warn('Failed to get structured hukum, using empty array:', error);
      return [];
    }
  }

  async getHukumSummary(year: number, quarter: Quarter): Promise<HukumSummary | null> {
    try {
      const response = await apiHukum.get<HukumSummary>('/summary', {
        params: { year, quarter },
      });
      return response.data;
    } catch (error) {
      console.warn(`Failed to fetch summary for ${year} ${quarter}:`, error);
      return null;
    }
  }

  async getHukumById(id: number): Promise<Hukum | null> {
    try {
      const response = await apiHukum.get<Hukum>(`/${id}`);
      return response.data;
    } catch (error) {
      console.warn(`Failed to fetch hukum ${id}:`, error);
      return null;
    }
  }

  async createHukum(data: CreateHukumDto): Promise<Hukum> {
    try {
      const response = await apiHukum.post<Hukum>('/', data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create hukum:', error);

      if (error.response?.status === 400) {
        throw new Error(`Indikator "${data.subNo}" sudah ada untuk periode ${data.year} ${data.quarter}`);
      }

      throw error;
    }
  }

  async updateHukum(id: number, data: UpdateHukumDto): Promise<Hukum> {
    const response = await apiHukum.patch<Hukum>(`/${id}`, data);
    return response.data;
  }

  async deleteHukum(id: number): Promise<void> {
    try {
      await apiHukum.delete(`/${id}`);
      console.log(`✅ Hukum indicator ${id} deleted`);
    } catch (error: any) {
      console.error(`❌ Failed to delete hukum ${id}:`, error);

      if (error.response?.status === 404) {
        throw new Error('Indikator tidak ditemukan di database.');
      }
      throw error;
    }
  }

  async deleteByPeriod(year: number, quarter: Quarter): Promise<void> {
    try {
      await apiHukum.delete('/period', {
        params: { year, quarter },
      });
    } catch (error) {
      console.warn(`Failed to delete period ${year} ${quarter}:`, error);
      throw error;
    }
  }

  // ========== UTILITY METHODS ==========
  formatHukumData(formData: HukumFormData, section: HukumSection): CreateHukumDto {
    const bobotSection = section.bobotSection;
    const bobotIndikator = Number(formData.bobotIndikator || 0);
    const peringkat = Number(formData.peringkat || 1);
    const weighted = this.calculateWeighted(bobotSection, bobotIndikator, peringkat);

    const mode = formData.mode || 'RASIO';
    const pembilangValue = formData.pembilangValue !== undefined ? Number(formData.pembilangValue) : null;
    const penyebutValue = formData.penyebutValue !== undefined ? Number(formData.penyebutValue) : null;
    const hasil = this.calculateHasil(mode, pembilangValue, penyebutValue, formData.formula, formData.isPercent);

    return {
      year: Number(formData.year),
      quarter: formData.quarter,
      sectionId: section.id,
      subNo: formData.subNo,
      indikator: formData.indikator || '',
      bobotIndikator: bobotIndikator,
      sumberRisiko: formData.sumberRisiko || null,
      dampak: formData.dampak || null,
      low: formData.low || null,
      lowToModerate: formData.lowToModerate || null,
      moderate: formData.moderate || null,
      moderateToHigh: formData.moderateToHigh || null,
      high: formData.high || null,
      mode: mode as CalculationMode,
      pembilangLabel: formData.pembilangLabel || null,
      pembilangValue: pembilangValue,
      penyebutLabel: formData.penyebutLabel || null,
      penyebutValue: penyebutValue,
      formula: formData.formula || null,
      isPercent: Boolean(formData.isPercent || false),
      hasil: hasil,
      hasilText: formData.hasilText || null,
      peringkat: peringkat,
      weighted: weighted,
      keterangan: formData.keterangan || null,
    };
  }

  calculateHasil(mode: CalculationMode, pembilangValue: number | null, penyebutValue: number | null, formula?: string | null, isPercent?: boolean): string | null {
    if (mode === 'TEKS') {
      return null;
    }

    const pemb = pembilangValue || 0;
    const peny = penyebutValue || 0;

    if (mode === 'NILAI_TUNGGAL') {
      if (peny === 0) return null;
      return peny.toString();
    }

    if (formula && formula.trim() !== '') {
      try {
        const expr = formula
          .replace(/\bpembilang\b/gi, pemb.toString())
          .replace(/\bpenyebut\b/gi, peny.toString())
          .replace(/\bpemb\b/g, pemb.toString())
          .replace(/\bpeny\b/g, peny.toString());

        // Safe evaluation
        const result = new Function(`return (${expr})`)();

        if (isFinite(result) && !isNaN(result)) {
          if (isPercent) {
            return (result * 100).toFixed(2);
          }
          return Number.isInteger(result) ? result.toString() : result.toFixed(4);
        }
      } catch (error) {
        console.warn('Invalid formula:', formula, error);
        return null;
      }
    }

    // Default formula: pemb / peny (sesuai Hukum)
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
    const weighted = (bobotSection * bobotIndikator * peringkat) / 10000;
    return parseFloat(weighted.toFixed(4));
  }

  groupBySection(hukumList: Hukum[]): StructuredHukum[] {
    const sectionsMap = new Map<number, StructuredHukum>();

    hukumList.forEach((item) => {
      const sectionId = item.sectionId;

      if (!sectionsMap.has(sectionId)) {
        sectionsMap.set(sectionId, {
          section: item.section || {
            id: sectionId,
            no: item.no || '',
            bobotSection: item.bobotSection || 0,
            parameter: item.sectionLabel || '',
            description: '',
            category: null,
            sortOrder: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isDeleted: false,
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

  handleError(error: any): string {
    if (error.response) {
      const { data, status } = error.response;

      console.error(`Backend error ${status}:`, data);

      // Handle 500 errors with more specific messages
      if (status === 500) {
        if (data?.message?.includes('section')) {
          return data.message;
        }
        return 'Server sedang mengalami masalah. Silakan coba lagi nanti atau hubungi administrator.';
      }

      if (status === 404) {
        if (error.config?.url?.includes('sections')) {
          return 'Section tidak ditemukan di database.';
        }
        return 'Endpoint tidak ditemukan. Mohon periksa koneksi API.';
      }

      if (status === 400) {
        if (data?.message) {
          return typeof data.message === 'string' ? data.message : 'Data yang dikirim tidak valid.';
        }
        return 'Data tidak valid. Silakan periksa input Anda.';
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

      return `Server error (${status}): ${data || 'Unknown error'}`;
    } else if (error.request) {
      console.error('Network error:', error.request);
      return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
    } else {
      // Jika error memiliki message langsung
      if (error.message) {
        return error.message;
      }
      console.error('Unknown error:', error);
      return 'Terjadi kesalahan yang tidak diketahui';
    }
  }

  // Helper untuk transform data frontend ke format backend
  transformFrontendData(sections: any[], year: number, quarter: Quarter): CreateHukumDto[] {
    const hukumData: CreateHukumDto[] = [];

    console.log('🔄 Transforming frontend data for hukum:', sections);

    sections.forEach((section) => {
      let sectionId: number;

      if (typeof section.id === 'string' && section.id.startsWith('s-')) {
        sectionId = parseInt(section.id.replace('s-', ''));
      } else if (typeof section.id === 'number') {
        sectionId = section.id;
      } else {
        console.warn(`⚠️ Invalid section ID format: ${section.id}`);
        return;
      }

      if (isNaN(sectionId) || sectionId <= 0) {
        console.warn(`⚠️ Invalid section ID (NaN or <=0): ${sectionId} from ${section.id}`);
        return;
      }

      console.log(`📋 Processing hukum section ${sectionId}:`, section);

      if (!section.no || !section.parameter) {
        console.warn(`⚠️ Section ${sectionId} missing required fields:`, section);
        return;
      }

      section.indicators.forEach((indicator: any) => {
        console.log(`📝 Processing hukum indicator:`, indicator);

        if (!indicator.subNo || !indicator.indikator) {
          console.warn(`⚠️ Indicator missing required fields:`, indicator);
          return;
        }

        const weighted = this.calculateWeighted(section.bobotSection || 0, indicator.bobotIndikator || 0, indicator.peringkat || 1);

        const hasil = this.calculateHasil(indicator.mode || 'RASIO', indicator.pembilangValue || null, indicator.penyebutValue || null, indicator.formula || null, indicator.isPercent || false);

        const hukumItem: CreateHukumDto = {
          year,
          quarter,
          sectionId: sectionId,
          subNo: indicator.subNo || '',
          indikator: indicator.indikator || '',
          bobotIndikator: indicator.bobotIndikator || 0,
          sumberRisiko: indicator.sumberRisiko || null,
          dampak: indicator.dampak || null,
          low: indicator.low || null,
          lowToModerate: indicator.lowToModerate || null,
          moderate: indicator.moderate || null,
          moderateToHigh: indicator.moderateToHigh || null,
          high: indicator.high || null,
          mode: indicator.mode || 'RASIO',
          pembilangLabel: indicator.pembilangLabel || null,
          pembilangValue: indicator.pembilangValue || null,
          penyebutLabel: indicator.penyebutLabel || null,
          penyebutValue: indicator.penyebutValue || null,
          formula: indicator.formula || null,
          isPercent: indicator.isPercent || false,
          hasil: hasil,
          hasilText: indicator.hasilText || null,
          peringkat: indicator.peringkat || 1,
          weighted: weighted,
          keterangan: indicator.keterangan || null,
        };

        console.log(`✅ Prepared hukum item:`, hukumItem);
        hukumData.push(hukumItem);
      });
    });

    console.log(`📦 Total hukum items to save: ${hukumData.length}`);
    return hukumData;
  }

  // Generate default sections untuk hukum
}

export const hukumService = new HukumService();
