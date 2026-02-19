// src/types/kepatuhan.types.ts

// Pastikan ini adalah string literal types yang benar
export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export type CalculationMode = 'RASIO' | 'NILAI_TUNGGAL' | 'TEKS';

export interface KepatuhanSection {
  id: number;
  no: string;
  bobotSection: number;
  parameter: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  // TAMBAHKAN YEAR DAN QUARTER
  year: number;
  quarter: Quarter;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export interface CreateKepatuhanSectionData {
  no: string;
  parameter: string;
  bobotSection?: number;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
  // TAMBAHKAN YEAR DAN QUARTER
  year: number;
  quarter: Quarter;
}

export interface UpdateKepatuhanSectionData {
  no?: string;
  parameter?: string;
  bobotSection?: number;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
  // OPSIONAL: untuk update bisa tambah year dan quarter
  year?: number;
  quarter?: Quarter;
}

export interface KepatuhanIndikator {
  id: number;
  year: number;
  quarter: Quarter;
  sectionId: number;
  no: string;
  sectionLabel: string;
  bobotSection: number;
  subNo: string;
  indikator: string;
  bobotIndikator: number;
  sumberRisiko: string | null;
  dampak: string | null;
  low: string | null;
  lowToModerate: string | null;
  moderate: string | null;
  moderateToHigh: string | null;
  high: string | null;
  mode: CalculationMode;
  formula: string | null;
  isPercent: boolean;
  pembilangLabel: string | null;
  pembilangValue: number | null;
  penyebutLabel: string | null;
  penyebutValue: number | null;
  hasil: number | null;
  hasilText: string | null;
  peringkat: number;
  weighted: number;
  keterangan: string | null;
  isValidated: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  section?: KepatuhanSection;
}

export interface CreateKepatuhanData {
  year: number;
  quarter: Quarter;
  sectionId: number;
  no: string;
  sectionLabel: string;
  bobotSection: number;
  subNo: string;
  indikator: string;
  bobotIndikator: number;
  sumberRisiko?: string;
  dampak?: string;
  low?: string;
  lowToModerate?: string;
  moderate?: string;
  moderateToHigh?: string;
  high?: string;
  mode: CalculationMode;
  formula?: string;
  isPercent?: boolean;
  pembilangLabel?: string;
  pembilangValue?: number;
  penyebutLabel?: string;
  penyebutValue?: number;
  hasil?: number;
  hasilText?: string;
  peringkat: number;
  weighted: number;
  keterangan?: string;
  createdBy?: string;
}

export interface UpdateKepatuhanData {
  year?: number;
  quarter?: Quarter;
  sectionId?: number;
  no?: string;
  sectionLabel?: string;
  bobotSection?: number;
  subNo?: string;
  indikator?: string;
  bobotIndikator?: number;
  sumberRisiko?: string;
  dampak?: string;
  low?: string;
  lowToModerate?: string;
  moderate?: string;
  moderateToHigh?: string;
  high?: string;
  mode?: CalculationMode;
  formula?: string;
  isPercent?: boolean;
  pembilangLabel?: string;
  pembilangValue?: number;
  penyebutLabel?: string;
  penyebutValue?: number;
  hasil?: number;
  hasilText?: string;
  peringkat?: number;
  weighted?: number;
  keterangan?: string;
}

export interface TotalWeightedResponse {
  total: number;
}

export interface Period {
  year: number;
  quarter: Quarter;
}

// Tambahkan interface yang dibutuhkan oleh hook
export interface SectionWithIndicators {
  id: number;
  no: string;
  parameter: string;
  bobotSection: number;
  year: number;
  quarter: Quarter;
  indicators: KepatuhanIndikator[];
}

export interface SummaryResponse {
  year: number;
  quarter: Quarter;
  totalItems: number;
  totalWeighted: number;
  sections: Array<{
    section: KepatuhanSection;
    items: KepatuhanIndikator[];
    totalWeighted: number;
  }>;
  items: KepatuhanIndikator[];
}

export const transformSectionToBackend = (sectionData: any, year: number, quarter: Quarter): CreateKepatuhanSectionData => {
  return {
    no: String(sectionData.no),
    bobotSection: Number(sectionData.bobotSection || 0),
    parameter: sectionData.parameter,
    description: sectionData.description || undefined,
    sortOrder: sectionData.sortOrder || 0,
    isActive: sectionData.isActive ?? true,
    // TAMBAHKAN YEAR DAN QUARTER
    year: year,
    quarter: quarter,
  };
};
