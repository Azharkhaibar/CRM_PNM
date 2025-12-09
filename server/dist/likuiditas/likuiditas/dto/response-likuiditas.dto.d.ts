import { CalculationMode, Quarter } from '../entities/likuiditas.entity';
export declare class SectionLikuiditasResponseDto {
    id: number;
    no: string;
    parameter: string;
    bobotSection: number;
    description?: string | null;
    year?: number;
    quarter?: Quarter;
    createdAt: Date;
    updatedAt: Date;
    indikators?: LikuiditasResponseDto[];
}
export declare class LikuiditasResponseDto {
    id: number;
    year: number;
    quarter: Quarter;
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
    createdAt: Date;
    updatedAt: Date;
    section?: SectionLikuiditasResponseDto;
}
