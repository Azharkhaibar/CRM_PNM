export declare class CreateRasDto {
    year: number;
    riskCategory: string;
    no?: number;
    parameter: string;
    statement?: string;
    formulasi?: string;
    riskStance: string;
    unitType: string;
    dataTypeExplanation?: string;
    notes?: string;
    rkapTarget?: string;
    rasLimit?: string;
    hasNumeratorDenominator: boolean;
    numeratorLabel?: string;
    denominatorLabel?: string;
    monthlyValues?: Record<number, {
        num?: number | null;
        den?: number | null;
        man?: number | null;
    }>;
    groupId?: string;
    tindakLanjut?: any;
}
