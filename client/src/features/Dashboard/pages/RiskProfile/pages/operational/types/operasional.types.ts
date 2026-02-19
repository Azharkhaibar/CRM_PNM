// src/types/operasional.types.ts

export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export type CalculationMode = 'RASIO' | 'NILAI_TUNGGAL' | 'TEKS';

export interface OperasionalSection {
  id: number;
  no: string;
  bobotSection: number;
  parameter: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  year: number;
  quarter: Quarter;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export interface OperasionalIndikator {
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
  section?: OperasionalSection;
}

export interface CreateOperasionalSectionData {
  no: string;
  parameter: string;
  bobotSection?: number;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
  year: number;
  quarter: Quarter;
}

export interface UpdateOperasionalSectionData {
  no?: string;
  parameter?: string;
  bobotSection?: number;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
  year?: number;
  quarter?: Quarter;
}

export interface CreateOperasionalData {
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

export interface UpdateOperasionalData {
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

export interface SectionWithIndicators {
  id: number;
  no: string;
  parameter: string;
  bobotSection: number;
  year: number;
  quarter: Quarter;
  indicators: OperasionalIndikator[];
}

export interface SummaryResponse {
  year: number;
  quarter: Quarter;
  totalItems: number;
  totalWeighted: number;
  sections: Array<{
    section: OperasionalSection;
    items: OperasionalIndikator[];
    totalWeighted: number;
  }>;
  items: OperasionalIndikator[];
}