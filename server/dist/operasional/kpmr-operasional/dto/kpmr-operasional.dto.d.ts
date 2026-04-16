export declare class CreateKPMROperasionalAspectDto {
    year: number;
    aspekNo: string;
    aspekTitle: string;
    aspekBobot: number;
}
export declare class UpdateKPMROperasionalAspectDto {
    aspekNo?: string;
    aspekTitle?: string;
    aspekBobot?: number;
}
export declare class CreateKPMROperasionalQuestionDto {
    year: number;
    aspekNo: string;
    sectionNo: string;
    sectionTitle: string;
}
export declare class UpdateKPMROperasionalQuestionDto {
    aspekNo?: string;
    sectionNo?: string;
    sectionTitle?: string;
}
export declare class CreateKPMROperasionalDefinitionDto {
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
export declare class UpdateKPMROperasionalDefinitionDto {
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
export declare class CreateKPMROperasionalScoreDto {
    definitionId: number;
    year: number;
    quarter: string;
    sectionSkor?: number;
}
export declare class UpdateKPMROperasionalScoreDto {
    definitionId?: number;
    year?: number;
    quarter?: string;
    sectionSkor?: number;
}
