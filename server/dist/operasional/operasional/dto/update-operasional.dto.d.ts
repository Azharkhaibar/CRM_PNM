import { Quarter } from '../entities/operasional.entity';
export declare class UpdateSectionOperationalDto {
    no?: string;
    parameter?: string;
    bobotSection?: number;
    year?: number;
    quarter?: Quarter;
}
export declare class UpdateIndikatorOperationalDto {
    sectionId?: number;
    year?: number;
    quarter?: Quarter;
    subNo?: string;
    indikator?: string;
    bobotIndikator?: number;
    sumberRisiko?: string;
    dampak?: string;
    mode?: 'RASIO' | 'NILAI_TUNGGAL';
    pembilangLabel?: string;
    pembilangValue?: number;
    penyebutLabel?: string;
    penyebutValue?: number;
    formula?: string;
    isPercent?: boolean;
    hasil?: number;
    peringkat?: number;
    weighted?: number;
    keterangan?: string;
}
