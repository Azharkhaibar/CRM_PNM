// // services/investasi.service.ts
// import api from './api';
// import { Investasi, InvestasiSection, CreateSectionDto, UpdateSectionDto, CreateInvestasiDto, UpdateInvestasiDto, Quarter, SummaryResponse, ApiResponse } from '../types/investasi';
// import { CalculationMode } from '../types/investasi.types';

// class InvestasiService {
//   // ===================== SECTION METHODS =====================

//   /**
//    * Get all sections
//    */
//   async getSections(): Promise<InvestasiSection[]> {
//     try {
//       const response = await api.get<InvestasiSection[]>('/investasi/sections');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching sections:', error);
//       throw this.handleError(error);
//     }
//   }

//   /**
//    * Get section by ID
//    */
//   async getSection(id: number): Promise<InvestasiSection> {
//     try {
//       const response = await api.get<InvestasiSection>(`/investasi/sections/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Error fetching section ${id}:`, error);
//       throw this.handleError(error);
//     }
//   }

//   /**
//    * Create new section
//    */
//   async createSection(data: CreateSectionDto): Promise<InvestasiSection> {
//     try {
//       const response = await api.post<InvestasiSection>('/investasi/sections', data);
//       return response.data;
//     } catch (error) {
//       console.error('Error creating section:', error);
//       throw this.handleError(error);
//     }
//   }

//   /**
//    * Update section
//    */
//   async updateSection(id: number, data: UpdateSectionDto): Promise<InvestasiSection> {
//     try {
//       const response = await api.put<InvestasiSection>(`/investasi/sections/${id}`, data);
//       return response.data;
//     } catch (error) {
//       console.error(`Error updating section ${id}:`, error);
//       throw this.handleError(error);
//     }
//   }

//   /**
//    * Delete section
//    */
//   async deleteSection(id: number): Promise<void> {
//     try {
//       await api.delete(`/investasi/sections/${id}`);
//     } catch (error) {
//       console.error(`Error deleting section ${id}:`, error);
//       throw this.handleError(error);
//     }
//   }

//   // ===================== INVESTASI METHODS =====================

//   /**
//    * Get investasi by period
//    */
//   async getInvestasiByPeriod(year: number, quarter: Quarter): Promise<Investasi[]> {
//     try {
//       const response = await api.get<Investasi[]>('/investasi', {
//         params: { year, quarter },
//       });
//       return response.data;
//     } catch (error) {
//       console.error(`Error fetching investasi for ${year}-${quarter}:`, error);
//       throw this.handleError(error);
//     }
//   }

//   /**
//    * Get investasi summary
//    */
//   async getSummary(year: number, quarter: Quarter): Promise<SummaryResponse> {
//     try {
//       const response = await api.get<SummaryResponse>('/investasi/summary', {
//         params: { year, quarter },
//       });
//       return response.data;
//     } catch (error) {
//       console.error(`Error fetching summary for ${year}-${quarter}:`, error);
//       throw this.handleError(error);
//     }
//   }

//   /**
//    * Get investasi by ID
//    */
//   async getInvestasi(id: number): Promise<Investasi> {
//     try {
//       const response = await api.get<Investasi>(`/investasi/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Error fetching investasi ${id}:`, error);
//       throw this.handleError(error);
//     }
//   }

//   /**
//    * Create new investasi
//    */
//   async createInvestasi(data: CreateInvestasiDto): Promise<Investasi> {
//     try {
//       const response = await api.post<Investasi>('/investasi', data);
//       return response.data;
//     } catch (error) {
//       console.error('Error creating investasi:', error);
//       throw this.handleError(error);
//     }
//   }

//   /**
//    * Update investasi
//    */
//   async updateInvestasi(id: number, data: UpdateInvestasiDto): Promise<Investasi> {
//     try {
//       const response = await api.put<Investasi>(`/investasi/${id}`, data);
//       return response.data;
//     } catch (error) {
//       console.error(`Error updating investasi ${id}:`, error);
//       throw this.handleError(error);
//     }
//   }

//   /**
//    * Delete investasi
//    */
//   async deleteInvestasi(id: number): Promise<void> {
//     try {
//       await api.delete(`/investasi/${id}`);
//     } catch (error) {
//       console.error(`Error deleting investasi ${id}:`, error);
//       throw this.handleError(error);
//     }
//   }

//   // ===================== HELPER METHODS =====================

//   /**
//    * Calculate hasil (client-side)
//    */
//   calculateHasil(data: { mode: CalculationMode; numeratorValue?: number; denominatorValue: number; formula?: string; isPercent?: boolean }): number {
//     const { mode, numeratorValue = 0, denominatorValue, formula, isPercent = false } = data;

//     if (mode === CalculationMode.NILAI_TUNGGAL) {
//       return denominatorValue;
//     }

//     if (!denominatorValue || denominatorValue === 0) {
//       return 0;
//     }

//     // Custom formula
//     if (formula && formula.trim() !== '') {
//       try {
//         const fn = new Function('pemb', 'peny', `return (${formula});`);
//         const result = fn(numeratorValue, denominatorValue);

//         if (!isFinite(result) || isNaN(result)) {
//           throw new Error('Invalid formula result');
//         }

//         return isPercent ? result * 100 : result;
//       } catch (error) {
//         console.warn('Formula error:', error);
//         return 0;
//       }
//     }

//     // Default ratio
//     const result = numeratorValue / denominatorValue;
//     return isPercent ? result * 100 : result;
//   }

//   /**
//    * Calculate weighted (client-side)
//    */
//   calculateWeighted(bobotSection: number, bobotIndikator: number, peringkat: number): number {
//     const weighted = (bobotSection * bobotIndikator * peringkat) / 10000;
//     return parseFloat(weighted.toFixed(4));
//   }

//   /**
//    * Format data for API submission
//    */
//   formatInvestasiData(formData: any, section: InvestasiSection): CreateInvestasiDto {
//     const hasil = this.calculateHasil({
//       mode: formData.mode,
//       numeratorValue: formData.numeratorValue,
//       denominatorValue: formData.denominatorValue,
//       formula: formData.formula,
//       isPercent: formData.isPercent,
//     });

//     const weighted = this.calculateWeighted(section.bobotSection, formData.bobotIndikator, formData.peringkat);

//     return {
//       year: formData.year,
//       quarter: formData.quarter,
//       sectionId: section.id,
//       no: section.no,
//       sectionLabel: section.parameter,
//       bobotSection: section.bobotSection,
//       subNo: formData.subNo,
//       indikator: formData.indikator,
//       bobotIndikator: formData.bobotIndikator,
//       sumberRisiko: formData.sumberRisiko,
//       dampak: formData.dampak,
//       low: formData.low || 'x ≤ 1%',
//       lowToModerate: formData.lowToModerate || '1% < x ≤ 2%',
//       moderate: formData.moderate || '2% < x ≤ 3%',
//       moderateToHigh: formData.moderateToHigh || '3% < x ≤ 4%',
//       high: formData.high || 'x > 4%',
//       mode: formData.mode || CalculationMode.RASIO,
//       numeratorLabel: formData.numeratorLabel,
//       numeratorValue: formData.numeratorValue,
//       denominatorLabel: formData.denominatorLabel,
//       denominatorValue: formData.denominatorValue,
//       formula: formData.formula,
//       isPercent: formData.isPercent || false,
//       hasil,
//       peringkat: formData.peringkat,
//       weighted,
//       keterangan: formData.keterangan,
//     };
//   }

//   /**
//    * Error handler
//    */
//   private handleError(error: any): Error {
//     if (error.response) {
//       // Server responded with error
//       const { data, status } = error.response;

//       if (data?.message) {
//         if (Array.isArray(data.message)) {
//           // Validation errors
//           const messages = data.message
//             .map((item: any) => {
//               if (item.constraints) {
//                 return Object.values(item.constraints).join(', ');
//               }
//               return JSON.stringify(item);
//             })
//             .join('\n');
//           return new Error(messages);
//         }
//         return new Error(data.message);
//       }

//       return new Error(`Server error: ${status}`);
//     } else if (error.request) {
//       // No response received
//       return new Error('Network error: No response from server');
//     } else {
//       // Request setup error
//       return new Error(error.message || 'Unknown error');
//     }
//   }
// }

// export const investasiService = new InvestasiService();

// services/investasi.service.ts
import api from './api.service';
import { Investasi, InvestasiSection, CreateSectionDto, UpdateSectionDto, CreateInvestasiDto, UpdateInvestasiDto, Quarter } from '../types/investasi';

class InvestasiService {
  // ===================== SECTION METHODS =====================

  async getSections(): Promise<InvestasiSection[]> {
    // PERBAIKAN: Jangan kirim parameter apapun untuk endpoint GET sections
    const response = await api.get<InvestasiSection[]>('/investasi/sections');
    return response.data;
  }

  async createSection(data: CreateSectionDto): Promise<InvestasiSection> {
    const response = await api.post<InvestasiSection>('/investasi/sections', data);
    return response.data;
  }

  async updateSection(id: number, data: UpdateSectionDto): Promise<InvestasiSection> {
    const response = await api.put<InvestasiSection>(`/investasi/sections/${id}`, data);
    return response.data;
  }

  async deleteSection(id: number): Promise<void> {
    await api.delete(`/investasi/sections/${id}`);
  }

  // ===================== INVESTASI METHODS =====================

  async getInvestasiByPeriod(year: number, quarter: Quarter): Promise<Investasi[]> {
    // PERBAIKAN: Pastikan parameter dikirim dengan benar
    const response = await api.get<Investasi[]>('/investasi', {
      params: {
        year: year.toString(), // Konversi ke string
        quarter: quarter,
      },
    });
    return response.data;
  }

  async getInvestasi(id: number): Promise<Investasi> {
    const response = await api.get<Investasi>(`/investasi/${id}`);
    return response.data;
  }

  async createInvestasi(data: CreateInvestasiDto): Promise<Investasi> {
    const response = await api.post<Investasi>('/investasi', data);
    return response.data;
  }

  async updateInvestasi(id: number, data: UpdateInvestasiDto): Promise<Investasi> {
    const response = await api.put<Investasi>(`/investasi/${id}`, data);
    return response.data;
  }

  async deleteInvestasi(id: number): Promise<void> {
    await api.delete(`/investasi/${id}`);
  }

  // ===================== HELPER METHODS =====================

  formatInvestasiData(formData: any, section: InvestasiSection): CreateInvestasiDto {
    // PERBAIKAN: Tambahkan field sectionId yang missing
    return {
      year: Number(formData.year),
      quarter: formData.quarter,
      sectionId: section.id, // ✅ TAMBAHKAN INI
      no: section.no,
      sectionLabel: section.parameter,
      bobotSection: section.bobotSection,
      subNo: formData.subNo,
      indikator: formData.indikator || '',
      bobotIndikator: Number(formData.bobotIndikator || 0),
      sumberRisiko: formData.sumberRisiko || '',
      dampak: formData.dampak || '',
      low: formData.low || 'x ≤ 1%',
      lowToModerate: formData.lowToModerate || '1% < x ≤ 2%',
      moderate: formData.moderate || '2% < x ≤ 3%',
      moderateToHigh: formData.moderateToHigh || '3% < x ≤ 4%',
      high: formData.high || 'x > 4%',
      mode: formData.mode || 'RASIO',
      numeratorLabel: formData.numeratorLabel || '',
      numeratorValue: formData.mode === 'NILAI_TUNGGAL' ? 0 : Number(formData.numeratorValue || 0),
      denominatorLabel: formData.denominatorLabel || '',
      denominatorValue: Number(formData.denominatorValue || 0),
      formula: formData.formula || '',
      isPercent: Boolean(formData.isPercent),
      peringkat: Number(formData.peringkat || 1),
      weighted: Number(formData.weighted || 0),
      keterangan: formData.keterangan || '',
    };
  }

  calculateWeighted(bobotSection: number, bobotIndikator: number, peringkat: number): number {
    const weighted = (bobotSection * bobotIndikator * peringkat) / 10000;
    return parseFloat(weighted.toFixed(4));
  }

  // Error handler
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
                const field = item.property;
                const errors = Object.values(item.constraints).join(', ');
                return `${field}: ${errors}`;
              }
              return JSON.stringify(item);
            })
            .join('\n');
        }
        return data.message;
      }

      return `Server error: ${status}`;
    } else if (error.request) {
      return 'Network error: No response from server. Please check your connection.';
    } else {
      return error.message || 'Unknown error';
    }
  }
}

export const investasiService = new InvestasiService();
