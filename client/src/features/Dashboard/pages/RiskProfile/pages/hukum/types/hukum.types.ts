// src/types/hukum.types.ts

export enum CalculationMode {
  RASIO = 'RASIO',
  NILAI_TUNGGAL = 'NILAI_TUNGGAL',
  TEKS = 'TEKS',
}

export enum Quarter {
  Q1 = 'Q1',
  Q2 = 'Q2',
  Q3 = 'Q3',
  Q4 = 'Q4',
}

// ========== SECTION TYPES ==========
export interface HukumSection {
  id: number;
  no: string;
  bobotSection: number;
  parameter: string;
  description: string | null;
  category: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface CreateHukumSectionDto {
  no: string;
  bobotSection: number;
  parameter: string;
  description?: string;
  category?: string;
  sortOrder?: number;
}

export interface UpdateHukumSectionDto extends Partial<CreateHukumSectionDto> {}

// ========== HUKUM TYPES ==========
export interface Hukum {
  id: number;

  // PERIODE
  year: number;
  quarter: Quarter;

  // RELASI SECTION
  sectionId: number;
  section: HukumSection;

  // DATA SECTION
  no: string;
  sectionLabel: string;
  bobotSection: number;

  // DATA INDIKATOR
  subNo: string;
  indikator: string;
  bobotIndikator: number;

  // ANALISIS RISIKO
  sumberRisiko: string | null;
  dampak: string | null;

  // LEVEL RISIKO
  low: string | null;
  lowToModerate: string | null;
  moderate: string | null;
  moderateToHigh: string | null;
  high: string | null;

  // METODE PERHITUNGAN
  mode: CalculationMode;
  formula: string | null;
  isPercent: boolean;

  // FAKTOR PERHITUNGAN
  pembilangLabel: string | null;
  pembilangValue: number | null;
  penyebutLabel: string | null;
  penyebutValue: number | null;

  // HASIL
  hasil: string | null;
  hasilText: string | null;

  // SKOR DAN BOBOT
  peringkat: number;
  weighted: number;
  keterangan: string | null;

  // AUDIT TRAIL
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;
}

export interface CreateHukumDto {
  year: number;
  quarter: Quarter;
  sectionId: number;
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
  hasil?: string;
  hasilText?: string;
  peringkat: number;
  weighted?: number;
  keterangan?: string;
}

export interface UpdateHukumDto extends Partial<CreateHukumDto> {}

// ========== STRUCTURED DATA TYPES ==========
export interface StructuredHukum {
  section: HukumSection;
  indicators: Hukum[];
  totalWeighted: number;
}

export interface HukumSummary {
  year: number;
  quarter: Quarter;
  totalItems: number;
  totalWeighted: number;
  sections: Array<{
    section: HukumSection;
    items: Hukum[];
    totalWeighted: number;
  }>;
  items: Hukum[];
}

// ========== FORM DATA TYPE ==========
export interface HukumFormData {
  year: number;
  quarter: Quarter;
  sectionId?: number;
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
  hasil?: string;
  hasilText?: string;
  peringkat: number;
  keterangan?: string;
}
