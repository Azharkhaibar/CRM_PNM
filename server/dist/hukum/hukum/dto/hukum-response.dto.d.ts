export interface HukumResponse {
    id: number;
    year: number;
    quarter: string;
    sectionId: number;
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
    mode: 'RASIO' | 'NILAI_TUNGGAL' | 'TEKS';
    pembilangLabel: string | null;
    pembilangValue: number | null;
    penyebutLabel: string | null;
    penyebutValue: number | null;
    formula: string | null;
    isPercent: boolean;
    hasil: string | null;
    hasilText: string | null;
    peringkat: number;
    weighted: number;
    keterangan: string | null;
    createdAt: string;
    updatedAt: string;
    createdBy: string | null;
    updatedBy: string | null;
    section?: {
        id: number;
        no: string;
        bobotSection: number;
        parameter: string;
        description: string | null;
    };
}
export interface HukumSectionResponse {
    id: number;
    no: string;
    bobotSection: number;
    parameter: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
}
export interface SectionWithIndicatorsResponse {
    id: number;
    no: string;
    bobotSection: number;
    parameter: string;
    description: string | null;
    indicators: HukumResponse[];
}
export interface HukumSummaryResponse {
    year: number;
    quarter: string;
    totalItems: number;
    totalWeighted: number;
    sections: Array<{
        section: HukumSectionResponse;
        items: HukumResponse[];
        totalWeighted: number;
    }>;
}
export interface HukumStatisticsResponse {
    totalRecords: number;
    totalSections: number;
    availableYears: number[];
}
export declare class HukumResponseDto {
    success: boolean;
    message: string;
    data?: HukumResponse | HukumResponse[] | HukumSummaryResponse | HukumStatisticsResponse;
    meta?: {
        total?: number;
        page?: number;
        limit?: number;
        totalPages?: number;
    };
    constructor(success: boolean, message: string, data?: any, meta?: any);
    static success(message: string, data?: any, meta?: any): HukumResponseDto;
    static error(message: string): HukumResponseDto;
}
