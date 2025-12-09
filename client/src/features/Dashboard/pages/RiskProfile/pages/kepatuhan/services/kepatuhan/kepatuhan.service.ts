// src/services/kepatuhan/kepatuhan.service.ts
import apiKepatuhan from '../api-kepatuhan.service';
import {
  Kepatuhan,
  KepatuhanSection,
  CreateKepatuhanDto,
  CreateKepatuhanSectionDto,
  UpdateKepatuhanDto,
  UpdateKepatuhanSectionDto,
  Quarter,
  CalculationMode,
  KepatuhanSummary,
  StructuredKepatuhan,
  KepatuhanFormData,
} from '../../types/kepatuhan.types';

class KepatuhanService {
  // ========== SECTION METHODS ==========
  async getSections(): Promise<KepatuhanSection[]> {
    try {
      const response = await apiKepatuhan.get<KepatuhanSection[]>('/sections/all');
      return response.data.filter((section) => !section.isDeleted);
    } catch (error) {
      console.warn('Failed to fetch sections, using empty array:', error);
      return []; // Return empty array instead of throwing
    }
  }

  async createSection(data: CreateKepatuhanSectionDto): Promise<KepatuhanSection> {
    const response = await apiKepatuhan.post<KepatuhanSection>('/sections', data);
    return response.data;
  }

  async updateSection(id: number, data: UpdateKepatuhanSectionDto): Promise<KepatuhanSection> {
    const response = await apiKepatuhan.patch<KepatuhanSection>(`/sections/${id}`, data);
    return response.data;
  }

  async deleteSection(id: number): Promise<void> {
    try {
      // Coba HARD DELETE dulu (benar-benar hapus dari database)
      try {
        await apiKepatuhan.delete(`/sections/${id}`);
        console.log(`✅ Section ${id} hard deleted from database`);
        return;
      } catch (hardDeleteError: any) {
        console.log(`⚠️ Hard delete failed for section ${id}, trying soft delete...`);

        // Jika hard delete gagal (karena ada constraint), coba soft delete
        await apiKepatuhan.patch(`/sections/${id}/soft-delete`);
        console.log(`✅ Section ${id} soft deleted (isDeleted: true)`);
      }
    } catch (error: any) {
      console.error(`❌ Failed to delete section ${id}:`, error);

      // Beri pesan error yang jelas
      if (error.response?.status === 400) {
        throw new Error('Tidak dapat menghapus section karena masih memiliki data indikator.');
      } else if (error.response?.status === 404) {
        throw new Error('Section tidak ditemukan di database.');
      } else {
        throw new Error('Gagal menghapus section: ' + (error.message || 'Unknown error'));
      }
    }
  }

  async getSectionById(id: number): Promise<KepatuhanSection | null> {
    try {
      const response = await apiKepatuhan.get<KepatuhanSection>(`/sections/${id}`);
      return response.data;
    } catch (error) {
      console.warn(`Failed to fetch section ${id}:`, error);
      return null;
    }
  }

  // ========== KEPATUHAN METHODS ==========
  async getKepatuhan(year?: number, quarter?: Quarter): Promise<Kepatuhan[]> {
    try {
      const params: any = {};
      if (year) params.year = year;
      if (quarter) params.quarter = quarter;

      const response = await apiKepatuhan.get<Kepatuhan[]>('/', { params });
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch kepatuhan, using empty array:', error);
      return [];
    }
  }

  async getKepatuhanByPeriod(year: number, quarter: Quarter): Promise<Kepatuhan[]> {
    try {
      const response = await apiKepatuhan.get<Kepatuhan[]>('/', {
        params: { year, quarter },
      });
      return response.data;
    } catch (error) {
      console.warn(`Failed to fetch kepatuhan for ${year} ${quarter}, using empty array:`, error);
      return [];
    }
  }

  async getKepatuhanBySection(sectionId: number, year?: number, quarter?: Quarter): Promise<Kepatuhan[]> {
    try {
      const params: any = {};
      if (year) params.year = year;
      if (quarter) params.quarter = quarter;

      const response = await apiKepatuhan.get<Kepatuhan[]>(`/section/${sectionId}`, { params });
      return response.data;
    } catch (error) {
      console.warn(`Failed to fetch kepatuhan for section ${sectionId}, using empty array:`, error);
      return [];
    }
  }

  async getKepatuhanStructured(year?: number, quarter?: Quarter): Promise<StructuredKepatuhan[]> {
    try {
      const kepatuhanList = await this.getKepatuhan(year, quarter);
      return this.groupBySection(kepatuhanList);
    } catch (error) {
      console.warn('Failed to get structured kepatuhan, using empty array:', error);
      return [];
    }
  }

  async getKepatuhanSummary(year: number, quarter: Quarter): Promise<KepatuhanSummary | null> {
    try {
      const response = await apiKepatuhan.get<KepatuhanSummary>('/summary', {
        params: { year, quarter },
      });
      return response.data;
    } catch (error) {
      console.warn(`Failed to fetch summary for ${year} ${quarter}:`, error);
      return null;
    }
  }

  async getKepatuhanById(id: number): Promise<Kepatuhan | null> {
    try {
      const response = await apiKepatuhan.get<Kepatuhan>(`/${id}`);
      return response.data;
    } catch (error) {
      console.warn(`Failed to fetch kepatuhan ${id}:`, error);
      return null;
    }
  }

  async createKepatuhan(data: CreateKepatuhanDto): Promise<Kepatuhan> {
    try {
      const response = await apiKepatuhan.post<Kepatuhan>('/', data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create kepatuhan:', error);

      // Simple error handling
      if (error.response?.status === 400) {
        throw new Error(`Indikator "${data.subNo}" sudah ada untuk periode ${data.year} ${data.quarter}`);
      }

      throw error;
    }
  }

  async updateKepatuhan(id: number, data: UpdateKepatuhanDto): Promise<Kepatuhan> {
    const response = await apiKepatuhan.patch<Kepatuhan>(`/${id}`, data);
    return response.data;
  }

  async deleteKepatuhan(id: number): Promise<void> {
    try {
      await apiKepatuhan.delete(`/${id}`);
      console.log(`✅ Kepatuhan indicator ${id} deleted`);
    } catch (error: any) {
      console.error(`❌ Failed to delete kepatuhan ${id}:`, error);

      if (error.response?.status === 404) {
        throw new Error('Indikator tidak ditemukan di database.');
      }
      throw error;
    }
  }

  //   async bulkCreateKepatuhan(data: CreateKepatuhanDto[]): Promise<Kepatuhan[]> {
  //     try {
  //       console.log('📦 Sending bulk create request:', data.length, 'items');
  //       const response = await apiKepatuhan.post<Kepatuhan[]>('/bulk', data);
  //       console.log('✅ Bulk create successful:', response.data.length, 'items created');
  //       return response.data;
  //     } catch (error: any) {
  //       console.error('❌ Failed to bulk create kepatuhan:', error);

  //       // Handle specific error from backend
  //       if (error.response?.status === 400) {
  //         const errorData = error.response.data;
  //         const errorMessage = errorData?.message || '';

  //         if (errorMessage.includes('sudah ada') || errorMessage.includes('already exists') || errorMessage.includes('duplicate')) {
  //           // Extract details from error message
  //           let detailedMessage = errorMessage;

  //           // Try to extract subNo from error message
  //           const subNoMatch = errorMessage.match(/subNo\s+([\d.]+)/);
  //           const periodMatch = errorMessage.match(/periode\s+(\d+)\s+(Q[1-4])/i);

  //           if (subNoMatch && periodMatch) {
  //             const subNo = subNoMatch[1];
  //             const year = periodMatch[1];
  //             const quarter = periodMatch[2];
  //             detailedMessage = `Indikator dengan kode "${subNo}" sudah ada untuk periode ${year} ${quarter}.`;
  //           }

  //           throw new Error(detailedMessage);
  //         }

  //         // Handle validation errors
  //         if (errorData?.errors) {
  //           const validationErrors = Object.values(errorData.errors).flat().join(', ');
  //           throw new Error(`Validasi gagal: ${validationErrors}`);
  //         }

  //         throw new Error(errorMessage || 'Gagal menyimpan data (Bad Request)');
  //       }

  //       throw error;
  //     }
  //   }

  async deleteByPeriod(year: number, quarter: Quarter): Promise<void> {
    try {
      await apiKepatuhan.delete('/period', {
        params: { year, quarter },
      });
    } catch (error) {
      console.warn(`Failed to delete period ${year} ${quarter}:`, error);
      throw error;
    }
  }

  // ========== UTILITY METHODS ==========
  formatKepatuhanData(formData: KepatuhanFormData, section: KepatuhanSection): CreateKepatuhanDto {
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
      no: section.no,
      sectionLabel: section.parameter,
      bobotSection: bobotSection,
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

    // Default formula: peny / pemb (sesuai Kepatuhan)
    if (pemb === 0) {
      return null;
    }

    const result = peny / pemb;
    if (isPercent) {
      return (result * 100).toFixed(2);
    }
    return result.toFixed(4);
  }

  calculateWeighted(bobotSection: number, bobotIndikator: number, peringkat: number): number {
    const weighted = (bobotSection * bobotIndikator * peringkat) / 10000;
    return parseFloat(weighted.toFixed(4));
  }

  groupBySection(kepatuhanList: Kepatuhan[]): StructuredKepatuhan[] {
    const sectionsMap = new Map<number, StructuredKepatuhan>();

    kepatuhanList.forEach((item) => {
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

      if (status === 500) {
        console.error('Server 500 error:', data);
        return 'Server sedang mengalami masalah. Silakan coba lagi nanti atau hubungi administrator.';
      }

      if (status === 404) {
        return 'Endpoint tidak ditemukan. Mohon periksa koneksi API.';
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
      console.error('Unknown error:', error.message);
      return error.message || 'Terjadi kesalahan yang tidak diketahui';
    }
  }

  // Helper untuk transform data frontend ke format backend
  transformFrontendData(sections: any[], year: number, quarter: Quarter): CreateKepatuhanDto[] {
    const kepatuhanData: CreateKepatuhanDto[] = [];

    console.log('🔄 Transforming frontend data:', sections);

    sections.forEach((section) => {
      // Ekstrak backend ID dari format "s-1" -> 1
      let sectionId: number;

      if (typeof section.id === 'string' && section.id.startsWith('s-')) {
        sectionId = parseInt(section.id.replace('s-', ''));
      } else if (typeof section.id === 'number') {
        sectionId = section.id;
      } else {
        console.warn(`⚠️ Invalid section ID format: ${section.id}`);
        return; // Skip section ini
      }

      if (isNaN(sectionId) || sectionId <= 0) {
        console.warn(`⚠️ Invalid section ID (NaN or <=0): ${sectionId} from ${section.id}`);
        return;
      }

      console.log(`📋 Processing section ${sectionId}:`, section);

      // Validasi section data
      if (!section.no || !section.parameter) {
        console.warn(`⚠️ Section ${sectionId} missing required fields:`, section);
        return;
      }

      section.indicators.forEach((indicator: any) => {
        console.log(`📝 Processing indicator:`, indicator);

        // Validasi indicator data
        if (!indicator.subNo || !indicator.indikator) {
          console.warn(`⚠️ Indicator missing required fields:`, indicator);
          return;
        }

        // Hitung weighted
        const weighted = this.calculateWeighted(section.bobotSection || 0, indicator.bobotIndikator || 0, indicator.peringkat || 1);

        // Hitung hasil
        const hasil = this.calculateHasil(indicator.mode || 'RASIO', indicator.pembilangValue || null, indicator.penyebutValue || null, indicator.formula || null, indicator.isPercent || false);

        const kepatuhanItem: CreateKepatuhanDto = {
          year,
          quarter,
          sectionId: sectionId,
          no: section.no || '',
          sectionLabel: section.parameter || '',
          bobotSection: section.bobotSection || 0,
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

        console.log(`✅ Prepared kepatuhan item:`, kepatuhanItem);
        kepatuhanData.push(kepatuhanItem);
      });
    });

    console.log(`📦 Total items to save: ${kepatuhanData.length}`);
    return kepatuhanData;
  }

  // Generate default sections jika backend kosong
  generateDefaultSections(): KepatuhanSection[] {
    return [
      {
        id: 1,
        no: '7.1',
        bobotSection: 50,
        parameter: 'Jenis dan signifikansi pelanggaran yang dilakukan',
        description: '',
        category: 'Compliance Risk',
        sortOrder: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDeleted: false,
      },
    ];
  }
}

export const kepatuhanService = new KepatuhanService();
