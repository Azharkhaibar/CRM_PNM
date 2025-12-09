// src/types/kepatuhan.ts
export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export type CalculationMode = 'RASIO' | 'NILAI_TUNGGAL' | 'TEKS';

export interface KepatuhanSection {
  id: number;
  no: string; // Contoh: "7.1"
  bobotSection: number;
  parameter: string;
  description?: string | null;
  category?: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface Kepatuhan {
  id: number;
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

  // Risk analysis
  sumberRisiko: string | null;
  dampak: string | null;

  // Risk levels
  low: string | null;
  lowToModerate: string | null;
  moderate: string | null;
  moderateToHigh: string | null;
  high: string | null;

  // Calculation mode
  mode: CalculationMode;
  formula: string | null;
  isPercent: boolean;

  // Calculation factors
  pembilangLabel: string | null;
  pembilangValue: number | null;
  penyebutLabel: string | null;
  penyebutValue: number | null;

  // Results
  hasil: string | null;
  hasilText: string | null;

  // Scores
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
  deletedBy: string | null;

  // Relation
  section?: KepatuhanSection;
}

// DTOs
export interface CreateKepatuhanDto {
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

export interface UpdateKepatuhanDto extends Partial<CreateKepatuhanDto> {}

export interface CreateKepatuhanSectionDto {
  no: string;
  bobotSection: number;
  parameter: string;
  description?: string | null;
  category?: string | null;
  sortOrder?: number;
}

export interface UpdateKepatuhanSectionDto extends Partial<CreateKepatuhanSectionDto> {}

// Response types
export interface KepatuhanSummary {
  year: number;
  quarter: Quarter;
  totalItems: number;
  totalWeighted: number;
  sections: Array<{
    section: KepatuhanSection;
    items: Kepatuhan[];
    totalWeighted: number;
  }>;
  items: Kepatuhan[];
}

export interface StructuredKepatuhan {
  section: KepatuhanSection;
  indicators: Kepatuhan[];
  totalWeighted: number;
}

// Form data type for frontend
export interface KepatuhanFormData {
  year: number;
  quarter: Quarter;
  sectionId: number;
  subNo: string;
  indikator: string;
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
  peringkat: number;
  keterangan?: string | null;
}
