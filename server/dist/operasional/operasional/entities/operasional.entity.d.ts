import { SectionOperational } from './operasional-section.entity';
export declare enum Quarter {
    Q1 = "Q1",
    Q2 = "Q2",
    Q3 = "Q3",
    Q4 = "Q4"
}
export declare enum CalculationMode {
    RASIO = "RASIO",
    NILAI_TUNGGAL = "NILAI_TUNGGAL"
}
export declare class Operational {
    id: number;
    year: number;
    quarter: Quarter;
    sectionId: number;
    section: SectionOperational;
    subNo: string;
    indikator: string;
    bobotIndikator: number;
    sumberRisiko: string | null;
    dampak: string | null;
    mode: CalculationMode;
    pembilangLabel: string | null;
    pembilangValue: number | null;
    penyebutLabel: string | null;
    penyebutValue: number | null;
    formula: string | null;
    isPercent: boolean;
    hasil: number | null;
    peringkat: number;
    weighted: number;
    keterangan: string | null;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    deletedAt: Date | null;
}
