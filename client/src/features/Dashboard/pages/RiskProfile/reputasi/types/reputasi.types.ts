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

export interface ReputasiSection {
  id: number;
  no: string; // Contoh: "5.1"
  bobotSection: number;
  parameter: string; // Contoh: "Perjanjian pengelolaan produk"
  description?: string;
  category?: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface Reputasi {
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
  isPercent: boolean;
  hasil?: string | null;
  hasilText?: string | null;
  peringkat: number;
  weighted: number;
  keterangan?: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  section?: ReputasiSection;
}

export interface CreateReputasiSectionDto {
  no: string;
  bobotSection: number;
  parameter: string;
  description?: string;
  category?: string;
  sortOrder?: number;
}

export interface UpdateReputasiSectionDto {
  no?: string;
  bobotSection?: number;
  parameter?: string;
  description?: string;
  category?: string;
  sortOrder?: number;
}

export interface CreateReputasiDto {
  year: number;
  quarter: Quarter;
  sectionId: number;
  no: string;
  sectionLabel: string;
  bobotSection: number;
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
  mode?: CalculationMode;
  pembilangLabel?: string | null;
  pembilangValue?: number | null;
  penyebutLabel?: string | null;
  penyebutValue?: number | null;
  formula?: string | null;
  isPercent?: boolean;
  hasil?: string | null;
  hasilText?: string | null;
  peringkat: number;
  weighted?: number;
  keterangan?: string | null;
}

export interface UpdateReputasiDto {
  year?: number;
  quarter?: Quarter;
  sectionId?: number;
  no?: string;
  sectionLabel?: string;
  bobotSection?: number;
  subNo?: string;
  indikator?: string;
  bobotIndikator?: number;
  sumberRisiko?: string | null;
  dampak?: string | null;
  low?: string | null;
  lowToModerate?: string | null;
  moderate?: string | null;
  moderateToHigh?: string | null;
  high?: string | null;
  mode?: CalculationMode;
  pembilangLabel?: string | null;
  pembilangValue?: number | null;
  penyebutLabel?: string | null;
  penyebutValue?: number | null;
  formula?: string | null;
  isPercent?: boolean;
  hasil?: string | null;
  hasilText?: string | null;
  peringkat?: number;
  weighted?: number;
  keterangan?: string | null;
}

export interface ReputasiSummary {
  year: number;
  quarter: Quarter;
  totalItems: number;
  totalWeighted: number;
  sections: any[];
  items: Reputasi[];
}

export interface StructuredReputasi {
  section: ReputasiSection;
  indicators: Reputasi[];
  totalWeighted: number;
}

export interface ReputasiFormData {
  year: number;
  quarter: Quarter;
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
  pembilangLabel?: string;
  pembilangValue?: number;
  penyebutLabel?: string;
  penyebutValue?: number;
  formula?: string;
  isPercent?: boolean;
  hasilText?: string;
  peringkat: number;
  keterangan?: string;
}
