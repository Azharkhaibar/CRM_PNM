// types/pasar.types.ts
export interface SectionPasar {
  id: number;
  no_sec: string;
  nama_section: string;
  bobot_par: number;
  tahun: number;
  triwulan: string;
  indikators?: IndikatorPasar[];
  total_weighted?: number;
  created_at?: string;
  updated_at?: string;
}

export interface IndikatorPasar {
  id: number;
  sectionId: number;
  nama_indikator: string;
  bobot_indikator: number;
  sumber_risiko: string;
  dampak: string;
  pembilang_label: string | null;
  pembilang_value: number | null;
  penyebut_label: string | null;
  penyebut_value: number | null;
  low: string;
  low_to_moderate: string;
  moderate: string;
  moderate_to_high: string;
  high: string;
  peringkat: number;
  weighted: number;
  hasil: number;
  keterangan: string | null;
  mode: string;
  formula: string | null;
  is_percent: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SummaryResponse {
  total_weighted: number;
  total_sections: number;
  total_indicators: number;
  risk_level?: string;
}

export interface CreateSectionDto {
  no_sec: string;
  nama_section: string;
  bobot_par: number;
  tahun: number;
  triwulan: string;
}

export interface UpdateSectionDto {
  no_sec?: string;
  nama_section?: string;
  bobot_par?: number;
  tahun?: number;
  triwulan?: string;
}

export interface CreateIndikatorDto {
  sectionId: number;
  nama_indikator: string;
  bobot_indikator: number;
  sumber_risiko: string;
  dampak: string;
  pembilang_label?: string | null;
  pembilang_value?: number | null;
  penyebut_label?: string | null;
  penyebut_value?: number | null;
  low: string;
  low_to_moderate: string;
  moderate: string;
  moderate_to_high: string;
  high: string;
  peringkat: number;
  weighted?: number;
  hasil?: number;
  keterangan?: string | null;
  mode?: string;
  formula?: string | null;
  is_percent?: boolean;
}

export interface UpdateIndikatorDto {
  nama_indikator?: string;
  bobot_indikator?: number;
  sumber_risiko?: string;
  dampak?: string;
  pembilang_label?: string | null;
  pembilang_value?: number | null;
  penyebut_label?: string | null;
  penyebut_value?: number | null;
  low?: string;
  low_to_moderate?: string;
  moderate?: string;
  moderate_to_high?: string;
  high?: string;
  peringkat?: number;
  weighted?: number;
  hasil?: number;
  keterangan?: string | null;
  mode?: string;
  formula?: string | null;
  is_percent?: boolean;
}

export interface SectionFormData {
  id: number | null;
  no_sec: string;
  nama_section: string;
  bobot_par: number;
  tahun: number;
  triwulan: string;
}

export interface IndikatorFormData {
  id: number | null;
  nama_indikator: string;
  bobot_indikator: number;
  sumber_risiko: string;
  dampak: string;
  pembilang_label: string;
  pembilang_value: string | number;
  penyebut_label: string;
  penyebut_value: string | number;
  low: string;
  low_to_moderate: string;
  moderate: string;
  moderate_to_high: string;
  high: string;
  peringkat: number;
  weighted: number;
  hasil: number;
  keterangan: string;
  mode: string;
  formula: string;
  is_percent: boolean;
  sectionId: number | null;
}

export interface GroupedSection {
  section: SectionPasar;
  indikators: IndikatorPasar[];
  total_weighted: number;
}

export interface FormattedIndikatorData {
  indikator: string;
  bobotIndikator: number;
  sumberRisiko: string;
  dampak: string;
  pembilangLabel: string | null;
  pembilangValue: number | null;
  penyebutLabel: string | null;
  penyebutValue: number | null;
  low: string;
  lowToModerate: string;
  moderate: string;
  moderateToHigh: string;
  high: string;
  peringkat: number;
  weighted: number;
  hasil: number;
  keterangan: string | null;
}

export interface ExportData {
  year: number;
  quarter: string;
  sectionNo: string;
  sectionLabel: string;
  bobotSection: number;
  rows: FormattedIndikatorData[];
}
