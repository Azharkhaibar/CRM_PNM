// Buat interface untuk response API
export interface StratejikResponse {
  id: number;
  year: number;
  quarter: string;
  sectionId: number;
  no: string;
  sectionLabel: string;
  bobotSection: number;
  subNo: string;
  indikator: string;
  bobotIndikator: number;
  sumberRisiko: string;
  dampak: string;
  low: string;
  lowToModerate: string;
  moderate: string;
  moderateToHigh: string;
  high: string;
  mode: 'RASIO' | 'NILAI_TUNGGAL' | 'TEKS';
  pembilangLabel: string;
  pembilangValue: number;
  penyebutLabel: string;
  penyebutValue: number;
  formula: string;
  isPercent: boolean;
  hasil: string;
  hasilText: string;
  peringkat: number;
  weighted: number;
  keterangan: string;
  createdAt: string;
  updatedAt: string;
}

export interface SectionResponse {
  id: number;
  no: string;
  bobotSection: number;
  parameter: string;
  description: string;
  indicators: StratejikResponse[];
}
