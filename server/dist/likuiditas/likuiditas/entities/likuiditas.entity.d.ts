import { SectionLikuiditas } from './section-likuiditas.entity';
export declare enum Quarter {
    Q1 = "Q1",
    Q2 = "Q2",
    Q3 = "Q3",
    Q4 = "Q4"
}
export declare enum CalculationMode {
    RASIO = "RASIO",
    NILAI_TUNGGAL = "NILAI_TUNGGAL",
    TEKS = "TEKS"
}
export declare class Likuiditas {
    id: number;
    year: number;
    quarter: Quarter;
    sectionId: number;
    section: SectionLikuiditas;
    subNo: string;
    namaIndikator: string;
    bobotIndikator: number;
    sumberRisiko: string | null;
    dampak: string | null;
    low: string | null;
    lowToModerate: string | null;
    moderate: string | null;
    moderateToHigh: string | null;
    high: string | null;
    mode: CalculationMode;
    pembilangLabel: string | null;
    pembilangValue: number | null;
    penyebutLabel: string | null;
    penyebutValue: number | null;
    formula: string | null;
    isPercent: boolean;
    hasil: string | null;
    hasilText: string | null;
    peringkat: number;
    weighted: number;
    keterangan: string | null;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    deletedAt: Date | null;
}
