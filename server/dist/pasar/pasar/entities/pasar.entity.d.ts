import { PasarSection } from './pasar-section.entity';
export declare enum CalculationMode {
    RASIO = "RASIO",
    NILAI_TUNGGAL = "NILAI_TUNGGAL",
    TEKS = "TEKS"
}
export declare enum Quarter {
    Q1 = "Q1",
    Q2 = "Q2",
    Q3 = "Q3",
    Q4 = "Q4"
}
export declare class Pasar {
    id: number;
    year: number;
    quarter: Quarter;
    sectionId: number;
    section: PasarSection;
    no: string;
    sectionLabel: string;
    bobotSection: number;
    subNo: string;
    indikator: string;
    bobotIndikator: number;
    sumberRisiko: string | null;
    dampak: string | null;
    low: string | null;
    lowToModerate: string | null;
    moderate: string | null;
    moderateToHigh: string | null;
    high: string | null;
    mode: CalculationMode;
    formula: string | null;
    isPercent: boolean;
    pembilangLabel: string | null;
    pembilangValue: number | null;
    penyebutLabel: string | null;
    penyebutValue: number | null;
    hasil: number | null;
    hasilText: string | null;
    peringkat: number;
    weighted: number;
    keterangan: string | null;
    isValidated: boolean;
    validatedAt: Date | null;
    validatedBy: string | null;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    deletedAt: Date | null;
    createdBy: string | null;
    updatedBy: string | null;
    deletedBy: string | null;
    version: number;
    revisionNotes: string | null;
}
