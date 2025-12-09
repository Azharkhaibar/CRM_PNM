import { InvestasiSection } from './new-investasi-section.entity';
export declare enum CalculationMode {
    RASIO = "RASIO",
    NILAI_TUNGGAL = "NILAI_TUNGGAL"
}
export declare enum Quarter {
    Q1 = "Q1",
    Q2 = "Q2",
    Q3 = "Q3",
    Q4 = "Q4"
}
export declare class Investasi {
    id: number;
    year: number;
    quarter: Quarter;
    sectionId: number;
    section: InvestasiSection;
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
    mode: CalculationMode;
    numeratorLabel: string;
    numeratorValue: number;
    denominatorLabel: string;
    denominatorValue: number;
    formula: string;
    isPercent: boolean;
    hasil: number;
    peringkat: number;
    weighted: number;
    keterangan: string;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    deletedAt: Date;
    createdBy: string;
    updatedBy: string;
}
