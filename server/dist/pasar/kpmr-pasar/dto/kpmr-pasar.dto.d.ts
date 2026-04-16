export declare class CreateKPMRPasarAspectDto {
    year: number;
    aspekNo: string;
    aspekTitle: string;
    aspekBobot: number;
}
export declare class UpdateKPMRPasarAspectDto {
    aspekNo?: string;
    aspekTitle?: string;
    aspekBobot?: number;
}
export declare class CreateKPMRPasarQuestionDto {
    year: number;
    aspekNo: string;
    sectionNo: string;
    sectionTitle: string;
}
export declare class UpdateKPMRPasarQuestionDto {
    aspekNo?: string;
    sectionNo?: string;
    sectionTitle?: string;
}
export declare class CreateKPMRPasarDefinitionDto {
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
export declare class UpdateKPMRPasarDefinitionDto {
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
export declare class CreateKPMRPasarScoreDto {
    definitionId: number;
    year: number;
    quarter: string;
    sectionSkor?: number;
}
export declare class UpdateKPMRPasarScoreDto {
    definitionId?: number;
    year?: number;
    quarter?: string;
    sectionSkor?: number;
}
