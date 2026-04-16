export declare class CreateKPMRLikuiditasAspectDto {
    year: number;
    aspekNo: string;
    aspekTitle: string;
    aspekBobot: number;
}
export declare class UpdateKPMRLikuiditasAspectDto {
    aspekNo?: string;
    aspekTitle?: string;
    aspekBobot?: number;
}
export declare class CreateKPMRLikuiditasQuestionDto {
    year: number;
    aspekNo: string;
    sectionNo: string;
    sectionTitle: string;
}
export declare class UpdateKPMRLikuiditasQuestionDto {
    aspekNo?: string;
    sectionNo?: string;
    sectionTitle?: string;
}
export declare class CreateKPMRLikuiditasDefinitionDto {
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
export declare class UpdateKPMRLikuiditasDefinitionDto {
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
export declare class CreateKPMRLikuiditasScoreDto {
    definitionId: number;
    year: number;
    quarter: string;
    sectionSkor?: number;
}
export declare class UpdateKPMRLikuiditasScoreDto {
    definitionId?: number;
    year?: number;
    quarter?: string;
    sectionSkor?: number;
}
