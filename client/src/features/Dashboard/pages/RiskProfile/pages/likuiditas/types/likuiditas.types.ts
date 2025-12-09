// types/operasional.types.ts
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

export interface SectionOperational {
  id: number;
  year: number;
  quarter: Quarter;
  no: string;
  bobotSection: number;
  parameter: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
  deletedAt?: Date | null;
  indikators?: Operational[];
}

export interface Operational {
  id: number;
  year: number;
  quarter: Quarter;
  sectionId: number;
  section: SectionOperational;
  subNo: string;
  indikator: string; // PERBEDAAN: 'indikator' bukan 'namaIndikator'
  bobotIndikator: number;
  sumberRisiko?: string | null;
  dampak?: string | null;
  mode: CalculationMode;
  pembilangLabel?: string | null;
  pembilangValue?: number | null;
  penyebutLabel?: string | null;
  penyebutValue?: number | null;
  formula?: string | null;
  isPercent: boolean;
  hasil?: number | null; // PERBEDAAN: number bukan string
  peringkat: number;
  weighted: number;
  keterangan?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
  deletedAt?: Date | null;
}

// Type untuk form frontend (sesuai dengan operational-tab.jsx)
export interface OperationalFormData {
  id?: string | null;
  subNo: string;
  indikator: string;
  mode: CalculationMode;
  formula: string;
  isPercent: boolean;
  bobotIndikator: number;
  sumberRisiko: string;
  dampak: string;
  pembilangLabel: string;
  pembilangValue: string | number;
  penyebutLabel: string;
  penyebutValue: string | number;
  peringkat: number;
  weighted: string | number;
  hasil: string | number;
  keterangan: string;
}

export interface SectionFormData {
  id?: string | null;
  no: string;
  bobotSection: number;
  parameter: string;
}
