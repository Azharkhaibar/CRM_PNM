import { CalculationMode, Quarter } from '../entities/hukum.entity';
export declare class CreateHukumDto {
    year: number;
    quarter: Quarter;
    sectionId: number;
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
    mode: CalculationMode;
    formula?: string;
    isPercent?: boolean;
    pembilangLabel?: string;
    pembilangValue?: number;
    penyebutLabel?: string;
    penyebutValue?: number;
    hasil?: string;
    hasilText?: string;
    peringkat: number;
    weighted?: number;
    keterangan?: string;
}
