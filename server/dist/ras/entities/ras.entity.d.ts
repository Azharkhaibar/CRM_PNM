export type RiskStance = 'Tidak Toleran' | 'Konservatif' | 'Moderat' | 'Strategis';
export type UnitType = 'PERCENTAGE' | 'RUPIAH' | 'X' | 'REAL' | 'HOUR';
export declare const RiskStanceOptions: readonly ["Tidak Toleran", "Konservatif", "Moderat", "Strategis"];
export declare const UnitTypeOptions: readonly ["PERCENTAGE", "RUPIAH", "X", "REAL", "HOUR"];
export declare enum TindakLanjutStatus {
    ON_PROGRESS = "On Progress",
    DONE = "Done"
}
export type MonthlyValue = {
    num?: number | null;
    den?: number | null;
    man?: number | null;
    calculatedValue?: number | null;
};
export type TindakLanjut = {
    korektifOwner?: string;
    antisipasiOwner?: string;
    korektifSupport?: string;
    antisipasiSupport?: string;
    statusKorektifOwner?: TindakLanjutStatus;
    targetKorektifOwner?: string;
    statusAntisipasiOwner?: TindakLanjutStatus;
    targetAntisipasiOwner?: string;
    statusKorektifSupport?: TindakLanjutStatus;
    targetKorektifSupport?: string;
    statusAntisipasiSupport?: TindakLanjutStatus;
    targetAntisipasiSupport?: string;
};
export declare class RasData {
    id: number;
    year: number;
    groupId: string;
    riskCategory: string;
    no: number;
    parameter: string;
    statement: string;
    formulasi: string;
    riskStance: string;
    unitType: string;
    dataTypeExplanation: string;
    notes: string;
    rkapTarget: string;
    rasLimit: string;
    hasNumeratorDenominator: boolean;
    numeratorLabel: string;
    denominatorLabel: string;
    monthlyValues: Record<number, MonthlyValue>;
    tindakLanjut: TindakLanjut;
    createdAt: Date;
    updatedAt: Date;
}
