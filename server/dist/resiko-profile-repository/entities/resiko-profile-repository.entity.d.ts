export declare enum ModuleType {
    KEPATUHAN = "KEPATUHAN",
    REPUTASI = "REPUTASI",
    INVESTASI = "INVESTASI",
    LIKUIDITAS = "LIKUIDITAS",
    OPERASIONAL = "OPERASIONAL",
    STRATEGIK = "STRATEGIK",
    HUKUM = "HUKUM",
    PASAR = "PASAR"
}
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
export declare class RiskProfileRepositoryView {
    moduleType: ModuleType;
    id: number;
    year: number;
    quarter: Quarter;
    sectionId: number;
    no: string;
    sectionLabel: string;
    bobotSection: number;
    parameter: string;
    sectionDescription: string | null;
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
    createdAt: Date;
    updatedAt: Date;
}
