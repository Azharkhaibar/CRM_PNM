// src/services/stratejik.service.ts
import { CalculationMode, Quarter } from '../../types/stratejik.types';
import { api_stratejik } from '../api.services';
// import { Stratejik, StratejikSection, CreateStratejikSectionDto, UpdateStratejikSectionDto, CreateStratejikDto, UpdateStratejikDto } from '../types/stratejik';

import { Stratejik, StratejikSection, CreateStratejikDto, CreateStratejikSectionDto, UpdateStratejikDto, UpdateStratejikSectionDto, SummaryResponse } from '../../types/stratejik.types';
export interface SummaryResponse {
  year: number;
  quarter: Quarter;
  totalSections: number;
  totalIndicators: number;
  totalWeighted: number;
  averageRank: number;
  sections: Array<{
    sectionId: number;
    sectionName: string;
    totalIndicators: number;
    totalWeighted: number;
  }>;
}

export interface StructuredStratejik {
  section: StratejikSection;
  indicators: Stratejik[];
  totalWeighted: number;
}

class StratejikService {
  async getSections(): Promise<StratejikSection[]> {
    try {
      console.log('📥 [SERVICE] Fetching sections...');
      const response = await api_stratejik.get<StratejikSection[]>('/stratejik/sections/all');
      console.log('✅ [SERVICE] Sections fetched:', response.data.length);
      return response.data;
    } catch (error: any) {
      console.error('❌ [SERVICE] Error fetching sections:', error);
      throw error;
    }
  }

  async createSection(data: CreateStratejikSectionDto): Promise<StratejikSection> {
    try {
      console.log('📤 [SERVICE] Creating section:', data);
      const response = await api_stratejik.post<StratejikSection>('/stratejik/sections', data);
      console.log('✅ [SERVICE] Section created:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [SERVICE] Error creating section:', error);
      throw error;
    }
  }

  async updateSection(id: number, data: UpdateStratejikSectionDto): Promise<StratejikSection> {
    try {
      console.log('📤 [SERVICE] Updating section:', { id, data });
      const response = await api_stratejik.patch<StratejikSection>(`/stratejik/sections/${id}`, data);
      console.log('✅ [SERVICE] Section updated:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [SERVICE] Error updating section:', error);
      throw error;
    }
  }

  async deleteSection(id: number): Promise<void> {
    try {
      console.log('🗑️ [SERVICE] Deleting section:', id);
      await api_stratejik.delete(`/stratejik/sections/${id}`);
      console.log('✅ [SERVICE] Section deleted');
    } catch (error: any) {
      console.error('❌ [SERVICE] Error deleting section:', error);
      throw error;
    }
  }

  async getStratejik(year?: number, quarter?: Quarter): Promise<Stratejik[]> {
    try {
      console.log('📥 [SERVICE] Fetching stratejik data...', { year, quarter });
      const params: any = {};
      if (year) params.year = year;
      if (quarter) params.quarter = quarter;

      const response = await api_stratejik.get<Stratejik[]>('/stratejik', { params });
      console.log('✅ [SERVICE] Stratejik data fetched:', response.data.length);
      return response.data;
    } catch (error: any) {
      console.error('❌ [SERVICE] Error fetching stratejik:', error);
      throw error;
    }
  }

  async getStratejikByPeriod(year: number, quarter: Quarter): Promise<Stratejik[]> {
    try {
      console.log('📥 [SERVICE] Fetching stratejik by period...', { year, quarter });
      const response = await api_stratejik.get<Stratejik[]>('/stratejik', {
        params: { year, quarter },
      });
      console.log('✅ [SERVICE] Stratejik by period fetched:', response.data.length);
      return response.data;
    } catch (error: any) {
      console.error('❌ [SERVICE] Error fetching stratejik by period:', error);
      throw error;
    }
  }

  async getStratejikBySection(sectionId: number, year?: number, quarter?: Quarter): Promise<Stratejik[]> {
    try {
      console.log('📥 [SERVICE] Fetching stratejik by section...', { sectionId, year, quarter });
      const params: any = {};
      if (year) params.year = year;
      if (quarter) params.quarter = quarter;

      const response = await api_stratejik.get<Stratejik[]>(`/stratejik/section/${sectionId}`, { params });
      console.log('✅ [SERVICE] Stratejik by section fetched:', response.data.length);
      return response.data;
    } catch (error: any) {
      console.error('❌ [SERVICE] Error fetching stratejik by section:', error);
      throw error;
    }
  }

  async getStratejikStructured(year?: number, quarter?: Quarter): Promise<StructuredStratejik[]> {
    try {
      const stratejikList = await this.getStratejik(year, quarter);
      return this.groupBySection(stratejikList);
    } catch (error: any) {
      console.error('❌ [SERVICE] Error getting structured stratejik:', error);
      throw error;
    }
  }

  async getStratejikSummary(year: number, quarter: Quarter): Promise<SummaryResponse> {
    try {
      console.log('📥 [SERVICE] Fetching stratejik summary...', { year, quarter });
      const response = await api_stratejik.get<SummaryResponse>('/stratejik/summary', {
        params: { year, quarter },
      });
      console.log('✅ [SERVICE] Stratejik summary fetched');
      return response.data;
    } catch (error: any) {
      console.error('❌ [SERVICE] Error fetching stratejik summary:', error);
      throw error;
    }
  }

  async getStratejikById(id: number): Promise<Stratejik> {
    try {
      console.log('📥 [SERVICE] Fetching stratejik by ID:', id);
      const response = await api_stratejik.get<Stratejik>(`/stratejik/${id}`);
      console.log('✅ [SERVICE] Stratejik by ID fetched:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [SERVICE] Error fetching stratejik by ID:', error);
      throw error;
    }
  }

  async createStratejik(data: CreateStratejikDto): Promise<Stratejik> {
    try {
      console.log('📤 [SERVICE] Creating stratejik:', data);
      const response = await api_stratejik.post<Stratejik>('/stratejik', data);
      console.log('✅ [SERVICE] Stratejik created:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [SERVICE] Error creating stratejik:', error);
      throw error;
    }
  }

  async updateStratejik(id: number, data: UpdateStratejikDto): Promise<Stratejik> {
    try {
      console.log('📤 [SERVICE] Updating stratejik:', { id, data });
      const response = await api_stratejik.patch<Stratejik>(`/stratejik/${id}`, data);
      console.log('✅ [SERVICE] Stratejik updated:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [SERVICE] Error updating stratejik:', error);
      throw error;
    }
  }

  async deleteStratejik(id: number): Promise<void> {
    try {
      console.log('🗑️ [SERVICE] Deleting stratejik:', id);
      await api_stratejik.delete(`/stratejik/${id}`);
      console.log('✅ [SERVICE] Stratejik deleted');
    } catch (error: any) {
      console.error('❌ [SERVICE] Error deleting stratejik:', error);
      throw error;
    }
  }

  async bulkCreateStratejik(data: CreateStratejikDto[]): Promise<Stratejik[]> {
    try {
      console.log('📤 [SERVICE] Bulk creating stratejik:', data.length);
      const response = await api_stratejik.post<Stratejik[]>('/stratejik/bulk', data);
      console.log('✅ [SERVICE] Bulk stratejik created:', response.data.length);
      return response.data;
    } catch (error: any) {
      console.error('❌ [SERVICE] Error bulk creating stratejik:', error);
      throw error;
    }
  }

  formatStratejikData(formData: any, section: StratejikSection): CreateStratejikDto {
    console.log('🔧 [SERVICE] Formatting stratejik data:', { formData, section });

    // Validasi input
    if (!section || !section.id) {
      throw new Error('Section data tidak valid');
    }

    const bobotSection = Number(section.bobotSection) || 0;
    const bobotIndikator = Number(formData.bobotIndikator) || 0;
    const peringkat = Number(formData.peringkat) || 1;
    const weighted = this.calculateWeighted(bobotSection, bobotIndikator, peringkat);

    const mode = (formData.mode || 'RASIO') as CalculationMode;

    // Handle mode TEKS dengan benar
    let hasil = null;
    let hasilText = null;

    if (mode === 'TEKS') {
      hasilText = formData.hasilText || null;
      hasil = hasilText; // Untuk mode TEKS, hasil = hasilText
    } else {
      const pembilangValue = formData.pembilangValue !== undefined ? Number(formData.pembilangValue) : null;
      const penyebutValue = formData.penyebutValue !== undefined ? Number(formData.penyebutValue) : null;
      hasil = this.calculateHasil(mode, pembilangValue, penyebutValue, formData.formula, formData.isPercent);
    }

    const formattedData: CreateStratejikDto = {
      year: Number(formData.year) || new Date().getFullYear(),
      quarter: formData.quarter as Quarter,
      sectionId: section.id,
      no: section.no,
      sectionLabel: section.parameter,
      bobotSection: bobotSection,
      subNo: formData.subNo?.toString() || '',
      indikator: formData.indikator?.toString() || '',
      bobotIndikator: bobotIndikator,
      sumberRisiko: formData.sumberRisiko || null,
      dampak: formData.dampak || null,
      low: formData.low || null,
      lowToModerate: formData.lowToModerate || null,
      moderate: formData.moderate || null,
      moderateToHigh: formData.moderateToHigh || null,
      high: formData.high || null,
      mode: mode,
      pembilangLabel: formData.pembilangLabel || null,
      pembilangValue: mode !== 'TEKS' ? (formData.pembilangValue !== undefined ? Number(formData.pembilangValue) : null) : null,
      penyebutLabel: formData.penyebutLabel || null,
      penyebutValue: mode !== 'TEKS' ? (formData.penyebutValue !== undefined ? Number(formData.penyebutValue) : null) : null,
      formula: mode === 'RASIO' ? formData.formula || null : null,
      isPercent: mode === 'RASIO' ? Boolean(formData.isPercent || false) : false,
      hasil: hasil,
      hasilText: hasilText,
      peringkat: peringkat,
      weighted: weighted,
      keterangan: formData.keterangan || null,
    };

    console.log('✅ [SERVICE] Formatted data:', formattedData);
    return formattedData;
  }

  calculateHasil(mode: CalculationMode, pembilangValue: number | null, penyebutValue: number | null, formula?: string | null, isPercent?: boolean): string | null {
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
          .replace(/\bpembilang\b/gi, pemb.toString())
          .replace(/\bpenyebut\b/gi, peny.toString())
          .replace(/\bpemb\b/g, pemb.toString())
          .replace(/\bpeny\b/g, peny.toString());

        const result = Function(`"use strict"; return (${expr})`)();

        if (isFinite(result) && !isNaN(result)) {
          if (isPercent) {
            return (result * 100).toFixed(2);
          }
          return Number.isInteger(result) ? result.toString() : result.toFixed(4);
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
    const weighted = (bobotSection * bobotIndikator * peringkat) / 10000;
    return parseFloat(weighted.toFixed(4));
  }

  groupBySection(strategikList: Stratejik[]): StructuredStratejik[] {
    const sectionsMap = new Map<number, StructuredStratejik>();

    strategikList.forEach((item) => {
      const sectionId = item.sectionId;

      if (!sectionsMap.has(sectionId)) {
        sectionsMap.set(sectionId, {
          section: item.section || {
            id: sectionId,
            no: item.no,
            bobotSection: item.bobotSection,
            parameter: item.sectionLabel,
            description: '',
            createdAt: new Date(),
            updatedAt: new Date(),
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
    console.error('❌ [SERVICE] Handling error:', error);

    if (error.response) {
      const { data, status } = error.response;

      if (status === 400) {
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
        return 'Bad Request: Data tidak valid';
      }

      if (status === 500) {
        return 'Server error: Internal server error. Please try again later.';
      }

      return `Server error: ${status}`;
    } else if (error.request) {
      return 'Network error: No response from server. Please check your connection.';
    } else {
      return error.message || 'Unknown error occurred';
    }
  }
}

export const stratejikService = new StratejikService();
