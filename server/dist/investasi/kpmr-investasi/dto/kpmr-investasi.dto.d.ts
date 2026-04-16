export declare class CreateKPMRAspectDto {
    year: number;
    aspekNo: string;
    aspekTitle: string;
    aspekBobot: number;
}
export declare class UpdateKPMRAspectDto {
    aspekNo?: string;
    aspekTitle?: string;
    aspekBobot?: number;
}
export declare class CreateKPMRQuestionDto {
    year: number;
    aspekNo: string;
    sectionNo: string;
    sectionTitle: string;
}
export declare class UpdateKPMRQuestionDto {
    aspekNo?: string;
    sectionNo?: string;
    sectionTitle?: string;
}
export declare class CreateKPMRDefinitionDto {
    year: number;
    aspekNo: string;
    aspekTitle: string;
    aspekBobot: number;
    sectionNo: string;
    sectionTitle: string;
    level1?: string;
    level2?: string;
    level3?: string;
    level4?: string;
    level5?: string;
    evidence?: string;
}
export declare class UpdateKPMRDefinitionDto {
    year?: number;
    aspekNo?: string;
    aspekTitle?: string;
    aspekBobot?: number;
    sectionNo?: string;
    sectionTitle?: string;
    level1?: string;
    level2?: string;
    level3?: string;
    level4?: string;
    level5?: string;
    evidence?: string;
}
export declare class CreateKPMRScoreDto {
    definitionId: number;
    year: number;
    quarter: string;
    sectionSkor?: number;
}
export declare class UpdateKPMRScoreDto {
    definitionId?: number;
    year?: number;
    quarter?: string;
    sectionSkor?: number;
}
