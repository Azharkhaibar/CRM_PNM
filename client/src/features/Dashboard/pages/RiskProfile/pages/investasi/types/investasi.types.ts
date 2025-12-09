// types/investasi.ts
export enum CalculationMode {
  RASIO = 'RASIO',
  NILAI_TUNGGAL = 'NILAI_TUNGGAL',
}

export enum Quarter {
  Q1 = 'Q1',
  Q2 = 'Q2',
  Q3 = 'Q3',
  Q4 = 'Q4',
}

// Section Interface
export interface InvestasiSection {
  id: number;
  no: string;
  bobotSection: number;
  parameter: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
}

// Investasi Interface
export interface Investasi {
  id: number;
  year: number;
  quarter: Quarter;

  // Section relation
  sectionId: number;
  section?: InvestasiSection;

  // Section data (denormalized)
  no: string;
  sectionLabel: string;
  bobotSection: number;

  // Indikator data
  subNo: string;
  indikator: string;
  bobotIndikator: number;

  // Risk information
  sumberRisiko?: string;
  dampak?: string;

  // Risk thresholds
  low: string;
  lowToModerate: string;
  moderate: string;
  moderateToHigh: string;
  high: string;

  // Calculation components
  mode: CalculationMode;
  numeratorLabel?: string;
  numeratorValue?: number;
  denominatorLabel: string;
  denominatorValue: number;
  formula?: string;
  isPercent: boolean;

  // Results
  hasil?: number;
  peringkat: number;
  weighted: number;
  keterangan?: string;

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
  deletedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

// DTOs for API calls
export interface CreateSectionDto {
  no: string;
  bobotSection: number;
  parameter: string;
  description?: string;
}

export interface UpdateSectionDto extends Partial<CreateSectionDto> {}

export interface CreateInvestasiDto {
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
  mode?: CalculationMode;
  numeratorLabel?: string;
  numeratorValue?: number;
  denominatorLabel: string;
  denominatorValue: number;
  formula?: string;
  isPercent?: boolean;
  hasil?: number;
  peringkat: number;
  weighted: number;
  keterangan?: string;
}

export interface UpdateInvestasiDto extends Partial<CreateInvestasiDto> {}

// Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface SummaryResponse {
  year: number;
  quarter: Quarter;
  totalIndicators: number;
  totalSections: number;
  totalWeighted: number;
  averageRating: number;
}
