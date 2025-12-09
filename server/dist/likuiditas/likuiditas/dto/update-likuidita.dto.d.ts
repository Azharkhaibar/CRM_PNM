import { Quarter } from '../entities/likuiditas.entity';
export declare class UpdateSectionLikuiditasDto {
    no?: string;
    parameter?: string;
    bobotSection?: number;
    description?: string;
    year?: number;
    quarter?: Quarter;
}
export declare class UpdateIndikatorLikuiditasDto {
    sectionId?: number;
    year?: number;
    quarter?: Quarter;
    subNo?: string;
    namaIndikator?: string;
    bobotIndikator?: number;
    sumberRisiko?: string;
    dampak?: string;
    low?: string;
    lowToModerate?: string;
    moderate?: string;
    moderateToHigh?: string;
    high?: string;
    mode?: 'RASIO' | 'NILAI_TUNGGAL' | 'TEKS';
    pembilangLabel?: string;
    pembilangValue?: number;
    penyebutLabel?: string;
    penyebutValue?: number;
    formula?: string;
    isPercent?: boolean;
    hasil?: string;
    hasilText?: string;
    peringkat?: number;
    weighted?: number;
    keterangan?: string;
}
