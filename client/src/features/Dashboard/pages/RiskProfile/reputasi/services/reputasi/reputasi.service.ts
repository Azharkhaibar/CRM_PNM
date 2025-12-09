import apiReputasi from '../api.service';
import {
  Reputasi,
  ReputasiSection,
  CreateReputasiDto,
  CreateReputasiSectionDto,
  UpdateReputasiDto,
  UpdateReputasiSectionDto,
  Quarter,
  CalculationMode,
  ReputasiSummary,
  StructuredReputasi,
  ReputasiFormData,
} from '../../types/reputasi.types';

class ReputasiService {
  // ========== SECTION METHODS ==========
  async getSections(): Promise<ReputasiSection[]> {
    try {
      const response = await apiReputasi.get<ReputasiSection[]>('/sections/all');
      return response.data.filter((section) => !section.isDeleted);
    } catch (error) {
      console.warn('Gagal mengambil sections reputasi, menggunakan array kosong:', error);
      return [];
    }
  }

  async createSection(data: CreateReputasiSectionDto): Promise<ReputasiSection> {
    const response = await apiReputasi.post<ReputasiSection>('/sections', data);
    return response.data;
  }

  async updateSection(id: number, data: UpdateReputasiSectionDto): Promise<ReputasiSection> {
    const response = await apiReputasi.patch<ReputasiSection>(`/sections/${id}`, data);
    return response.data;
  }

  async deleteSection(id: number): Promise<void> {
    try {
      try {
        await apiReputasi.delete(`/sections/${id}`);
        console.log(`✅ Section reputasi ${id} berhasil dihapus dari database`);
        return;
      } catch (hardDeleteError: any) {
        console.log(`⚠️ Hard delete gagal untuk section reputasi ${id}, mencoba soft delete...`);
        await apiReputasi.patch(`/sections/${id}/soft-delete`);
        console.log(`✅ Section reputasi ${id} soft deleted (isDeleted: true)`);
      }
    } catch (error: any) {
      console.error(`❌ Gagal menghapus section reputasi ${id}:`, error);

      if (error.response?.status === 400) {
        throw new Error('Tidak dapat menghapus section reputasi karena masih memiliki data indikator.');
      } else if (error.response?.status === 404) {
        throw new Error('Section reputasi tidak ditemukan di database.');
      } else {
        throw new Error('Gagal menghapus section reputasi: ' + (error.message || 'Unknown error'));
      }
    }
  }

  async getSectionById(id: number): Promise<ReputasiSection | null> {
    try {
      const response = await apiReputasi.get<ReputasiSection>(`/sections/${id}`);
      return response.data;
    } catch (error) {
      console.warn(`Gagal mengambil section reputasi ${id}:`, error);
      return null;
    }
  }

  // ========== REPUTASI METHODS ==========
  async getReputasi(year?: number, quarter?: Quarter): Promise<Reputasi[]> {
    try {
      const params: any = {};
      if (year) params.year = year;
      if (quarter) params.quarter = quarter;

      const response = await apiReputasi.get<Reputasi[]>('/', { params });
      return response.data;
    } catch (error) {
      console.warn('Gagal mengambil data reputasi, menggunakan array kosong:', error);
      return [];
    }
  }

  async getReputasiByPeriod(year: number, quarter: Quarter): Promise<Reputasi[]> {
    try {
      const response = await apiReputasi.get<Reputasi[]>('/', {
        params: { year, quarter },
      });
      return response.data;
    } catch (error) {
      console.warn(`Gagal mengambil data reputasi untuk ${year} ${quarter}, menggunakan array kosong:`, error);
      return [];
    }
  }

  async getReputasiBySection(sectionId: number, year?: number, quarter?: Quarter): Promise<Reputasi[]> {
    try {
      const params: any = {};
      if (year) params.year = year;
      if (quarter) params.quarter = quarter;

      const response = await apiReputasi.get<Reputasi[]>(`/section/${sectionId}`, { params });
      return response.data;
    } catch (error) {
      console.warn(`Gagal mengambil data reputasi untuk section ${sectionId}, menggunakan array kosong:`, error);
      return [];
    }
  }

  async getReputasiStructured(year?: number, quarter?: Quarter): Promise<StructuredReputasi[]> {
    try {
      const reputasiList = await this.getReputasi(year, quarter);
      return this.groupBySection(reputasiList);
    } catch (error) {
      console.warn('Gagal mendapatkan data reputasi terstruktur, menggunakan array kosong:', error);
      return [];
    }
  }

  async getReputasiSummary(year: number, quarter: Quarter): Promise<ReputasiSummary | null> {
    try {
      const response = await apiReputasi.get<ReputasiSummary>('/summary', {
        params: { year, quarter },
      });
      return response.data;
    } catch (error) {
      console.warn(`Gagal mengambil summary untuk ${year} ${quarter}:`, error);
      return null;
    }
  }

  async getReputasiScore(year: number, quarter: Quarter): Promise<number> {
    try {
      const response = await apiReputasi.get<number>('/score', {
        params: { year, quarter },
      });
      return response.data;
    } catch (error) {
      console.warn(`Gagal mengambil skor reputasi untuk ${year} ${quarter}:`, error);
      return 0;
    }
  }

  async getRiskLevelDistribution(year: number, quarter: Quarter): Promise<any> {
    try {
      const response = await apiReputasi.get('/risk-distribution', {
        params: { year, quarter },
      });
      return response.data;
    } catch (error) {
      console.warn(`Gagal mengambil distribusi level risiko untuk ${year} ${quarter}:`, error);
      return null;
    }
  }

  async getReputasiById(id: number): Promise<Reputasi | null> {
    try {
      const response = await apiReputasi.get<Reputasi>(`/${id}`);
      return response.data;
    } catch (error) {
      console.warn(`Gagal mengambil data reputasi ${id}:`, error);
      return null;
    }
  }

  async createReputasi(data: CreateReputasiDto): Promise<Reputasi> {
    try {
      const response = await apiReputasi.post<Reputasi>('/', data);
      return response.data;
    } catch (error: any) {
      console.error('Gagal membuat data reputasi:', error);

      if (error.response?.status === 400) {
        throw new Error(`Indikator reputasi "${data.subNo}" sudah ada untuk periode ${data.year} ${data.quarter}`);
      }

      throw error;
    }
  }

  async updateReputasi(id: number, data: UpdateReputasiDto): Promise<Reputasi> {
    const response = await apiReputasi.patch<Reputasi>(`/${id}`, data);
    return response.data;
  }

  async deleteReputasi(id: number): Promise<void> {
    try {
      await apiReputasi.delete(`/${id}`);
      console.log(`✅ Indikator reputasi ${id} berhasil dihapus`);
    } catch (error: any) {
      console.error(`❌ Gagal menghapus indikator reputasi ${id}:`, error);

      if (error.response?.status === 404) {
        throw new Error('Indikator reputasi tidak ditemukan di database.');
      }
      throw error;
    }
  }

  async deleteByPeriod(year: number, quarter: Quarter): Promise<void> {
    try {
      await apiReputasi.delete('/period', {
        params: { year, quarter },
      });
    } catch (error) {
      console.warn(`Gagal menghapus periode ${year} ${quarter}:`, error);
      throw error;
    }
  }

  // ========== UTILITY METHODS ==========
  formatReputasiData(formData: ReputasiFormData, section: ReputasiSection): CreateReputasiDto {
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

        const result = new Function(`return (${expr})`)();

        if (isFinite(result) && !isNaN(result)) {
          if (isPercent) {
            return (result * 100).toFixed(2);
          }
          return Number.isInteger(result) ? result.toString() : result.toFixed(4);
        }
      } catch (error) {
        console.warn('Formula tidak valid:', formula, error);
        return null;
      }
    }

    // Default formula: pemb / peny (sesuai dengan reputasi)
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

  groupBySection(reputasiList: Reputasi[]): StructuredReputasi[] {
    const sectionsMap = new Map<number, StructuredReputasi>();

    reputasiList.forEach((item) => {
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

  transformFrontendData(sections: any[], year: number, quarter: Quarter): CreateReputasiDto[] {
    const reputasiData: CreateReputasiDto[] = [];

    console.log('🔄 Mentransform data frontend reputasi:', sections);

    sections.forEach((section) => {
      let sectionId: number;

      if (typeof section.id === 'string' && section.id.startsWith('s-')) {
        sectionId = parseInt(section.id.replace('s-', ''));
      } else if (typeof section.id === 'number') {
        sectionId = section.id;
      } else {
        console.warn(`⚠️ Format ID section tidak valid: ${section.id}`);
        return;
      }

      if (isNaN(sectionId) || sectionId <= 0) {
        console.warn(`⚠️ ID section tidak valid (NaN atau <=0): ${sectionId} dari ${section.id}`);
        return;
      }

      console.log(`📋 Memproses section ${sectionId}:`, section);

      if (!section.no || !section.parameter) {
        console.warn(`⚠️ Section ${sectionId} tidak memiliki field yang diperlukan:`, section);
        return;
      }

      section.indicators.forEach((indicator: any) => {
        console.log(`📝 Memproses indikator:`, indicator);

        if (!indicator.subNo || !indicator.indikator) {
          console.warn(`⚠️ Indikator tidak memiliki field yang diperlukan:`, indicator);
          return;
        }

        const weighted = this.calculateWeighted(section.bobotSection || 0, indicator.bobotIndikator || 0, indicator.peringkat || 1);
        const hasil = this.calculateHasil(indicator.mode || 'RASIO', indicator.pembilangValue || null, indicator.penyebutValue || null, indicator.formula || null, indicator.isPercent || false);

        const reputasiItem: CreateReputasiDto = {
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

        console.log(`✅ Item reputasi siap:`, reputasiItem);
        reputasiData.push(reputasiItem);
      });
    });

    console.log(`📦 Total item untuk disimpan: ${reputasiData.length}`);
    return reputasiData;
  }

  generateDefaultSections(): ReputasiSection[] {
    return [
      {
        id: 1,
        no: '5.1',
        bobotSection: 50,
        parameter: 'Perjanjian pengelolaan produk',
        description: '',
        category: 'Reputasi Risk',
        sortOrder: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDeleted: false,
      },
    ];
  }
}

export const reputasiService = new ReputasiService();
