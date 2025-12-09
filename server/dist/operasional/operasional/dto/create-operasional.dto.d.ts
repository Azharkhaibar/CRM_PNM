export declare class CreateOperasionalDto {
}
import { Quarter } from '../entities/operasional.entity';
export declare class CreateSectionOperationalDto {
    no: string;
    bobotSection: number;
    parameter: string;
    year: number;
    quarter: Quarter;
}
export declare class CreateIndikatorOperationalDto {
    sectionId: number;
    subNo: string;
    indikator: string;
    bobotIndikator: number;
    sumberRisiko?: string | null;
    dampak?: string | null;
    mode: 'RASIO' | 'NILAI_TUNGGAL';
    pembilangLabel?: string | null;
    pembilangValue?: number | null;
    penyebutLabel?: string | null;
    penyebutValue?: number | null;
    formula?: string | null;
    isPercent?: boolean;
    hasil?: number | null;
    peringkat?: number;
    weighted?: number;
    keterangan?: string | null;
    year: number;
    quarter: Quarter;
}
