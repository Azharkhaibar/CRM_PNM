import { Quarter } from '../entities/likuiditas.entity';
export declare class CreateSectionLikuiditasDto {
    no: string;
    bobotSection: number;
    parameter: string;
    description?: string | null;
    year: number;
    quarter: Quarter;
}
export declare class CreateIndikatorLikuiditasDto {
    sectionId: number;
    subNo: string;
    namaIndikator: string;
    bobotIndikator: number;
    sumberRisiko?: string | null;
    dampak?: string | null;
    low?: string | null;
    lowToModerate?: string | null;
    moderate?: string | null;
    moderateToHigh?: string | null;
    high?: string | null;
    mode: 'RASIO' | 'NILAI_TUNGGAL' | 'TEKS';
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
    year: number;
    quarter: Quarter;
}
