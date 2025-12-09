// src/types/stratejik.types.ts

// Pastikan ini adalah string literal types yang benar
export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export type CalculationMode = 'RASIO' | 'NILAI_TUNGGAL' | 'TEKS';

export interface StratejikSection {
  id: number;
  no: string;
  bobotSection: number;
  parameter: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface Stratejik {
  id: number;
  year: number;
  quarter: Quarter;
  sectionId: number;

  // Section info
  no: string;
  sectionLabel: string;
  bobotSection: number;

  // Indicator info
  subNo: string; // Backend akan map ke no_indikator
  indikator: string;
  bobotIndikator: number; // Backend akan map ke bobot_indikator

  // Risk
  sumberRisiko: string | null; // Backend akan map ke sumber_resiko
  dampak: string | null;

  // Risk categories
  low: string | null;
  lowToModerate: string | null; // Backend akan map ke low_to_moderate
  moderate: string | null;
  moderateToHigh: string | null; // Backend akan map ke moderate_to_high
  high: string | null;

  // Calculation
  mode: CalculationMode;
  pembilangLabel: string | null; // Backend akan map ke nama_pembilang
  pembilangValue: number | null; // Backend akan map ke total_pembilang
  penyebutLabel: string | null; // Backend akan map ke nama_penyebut
  penyebutValue: number | null; // Backend akan map ke total_penyebut
  formula: string | null;
  isPercent: boolean;
  hasil: string | null;
  hasilText: string | null; // Backend akan map ke hasil_text

  // Results
  peringkat: number;
  weighted: number;
  keterangan: string | null;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;

  // Auditing
  createdBy: string | null;
  updatedBy: string | null;

  // Relation
  section?: StratejikSection;
}

// DTO untuk membuat Stratejik
export interface CreateStratejikDto {
  year: number;
  quarter: Quarter;
  sectionId: number;

  // Section info
  no: string;
  sectionLabel: string;
  bobotSection: number;

  // Indicator info
  subNo: string;
  indikator: string;
  bobotIndikator: number;

  // Risk
  sumberRisiko?: string | null;
  dampak?: string | null;

  // Risk categories
  low?: string | null;
  lowToModerate?: string | null;
  moderate?: string | null;
  moderateToHigh?: string | null;
  high?: string | null;

  // Calculation
  mode?: CalculationMode;
  pembilangLabel?: string | null;
  pembilangValue?: number | null;
  penyebutLabel?: string | null;
  penyebutValue?: number | null;
  formula?: string | null;
  isPercent?: boolean;
  hasil?: string | null;
  hasilText?: string | null;

  // Results
  peringkat: number;
  weighted?: number;
  keterangan?: string | null;
}

export interface UpdateStratejikDto extends Partial<CreateStratejikDto> {}

export interface CreateStratejikSectionDto {
  no: string;
  bobotSection: number;
  parameter: string;
  description?: string | null;
}

export interface UpdateStratejikSectionDto extends Partial<CreateStratejikSectionDto> {}

// Tambahkan interface yang dibutuhkan oleh hook
export interface SectionWithIndicators {
  id: number;
  no: string;
  parameter: string;
  bobotSection: number;
  year: number;
  quarter: Quarter;
  indicators: Stratejik[];
}

export interface SummaryResponse {
  year: number;
  quarter: Quarter;
  totalItems: number;
  totalWeighted: number;
  sections: Array<{
    section: StratejikSection;
    items: Stratejik[];
    totalWeighted: number;
  }>;
  items: Stratejik[];
}
