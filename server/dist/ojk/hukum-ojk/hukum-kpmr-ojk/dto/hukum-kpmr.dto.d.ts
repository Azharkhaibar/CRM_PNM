export declare enum QuarterEnum {
    Q1 = "Q1",
    Q2 = "Q2",
    Q3 = "Q3",
    Q4 = "Q4"
}
export declare enum RatingEnum {
    STRONG = "Strong",
    SATISFACTORY = "Satisfactory",
    FAIR = "Fair",
    MARGINAL = "Marginal",
    UNSATISFACTORY = "Unsatisfactory"
}
export declare class KpmrSkorDto {
    Q1?: number;
    Q2?: number;
    Q3?: number;
    Q4?: number;
}
export declare class KpmrIndicatorDto {
    strong?: string;
    satisfactory?: string;
    fair?: string;
    marginal?: string;
    unsatisfactory?: string;
}
export declare class KpmrSummaryDto {
    totalScore?: number;
    averageScore?: number;
    rating?: RatingEnum;
    computedAt?: Date;
}
export declare class CreateKpmrHukumDto {
    year: number;
    quarter: number;
    isActive?: boolean;
    createdBy?: string;
    version?: string;
    notes?: string;
    summary?: KpmrSummaryDto;
    aspekList?: CreateKpmrAspekHukumDto[];
}
export declare class UpdateKpmrHukumDto {
    year?: number;
    quarter?: number;
    isActive?: boolean;
    summary?: KpmrSummaryDto;
    isLocked?: boolean;
    lockedBy?: string;
    lockedAt?: Date;
    notes?: string;
    updatedBy?: string;
}
export declare class CreateKpmrAspekHukumDto {
    nomor?: string;
    judul: string;
    bobot: number;
    deskripsi?: string;
    kpmrId?: number;
    orderIndex?: number;
    averageScore?: number;
    rating?: RatingEnum;
    updatedBy?: string;
    notes?: string;
    pertanyaanList?: CreateKpmrPertanyaanHukumDto[];
}
export declare class UpdateKpmrAspekHukumDto {
    nomor?: string;
    judul?: string;
    bobot?: number;
    deskripsi?: string;
    orderIndex?: number;
    averageScore?: number;
    rating?: RatingEnum;
    updatedBy?: string;
    notes?: string;
}
export declare class CreateKpmrPertanyaanHukumDto {
    nomor?: string;
    pertanyaan: string;
    skor?: KpmrSkorDto;
    indicator?: KpmrIndicatorDto;
    evidence?: string;
    catatan?: string;
    aspekId?: number;
    orderIndex?: number;
}
export declare class UpdateKpmrPertanyaanHukumDto {
    nomor?: string;
    pertanyaan?: string;
    skor?: KpmrSkorDto;
    indicator?: KpmrIndicatorDto;
    evidence?: string;
    catatan?: string;
    orderIndex?: number;
}
export declare class FrontendKpmrResponseDto {
    id: string;
    year: number;
    quarter: number;
    isActive?: boolean;
    isLocked?: boolean;
    version?: string;
    notes?: string;
    summary?: KpmrSummaryDto;
    aspekList?: FrontendAspekResponseDto[];
}
export declare class FrontendAspekResponseDto {
    id: string;
    nomor?: string;
    judul: string;
    bobot: string;
    deskripsi?: string;
    orderIndex?: number;
    averageScore?: number;
    rating?: RatingEnum;
    pertanyaanList?: FrontendPertanyaanResponseDto[];
}
export declare class FrontendPertanyaanResponseDto {
    id: string;
    nomor?: string;
    pertanyaan: string;
    skor?: {
        Q1?: number;
        Q2?: number;
        Q3?: number;
        Q4?: number;
    };
    indicator?: KpmrIndicatorDto;
    evidence?: string;
    catatan?: string;
    orderIndex?: number;
}
export declare class ReorderAspekDto {
    aspekIds: number[];
}
export declare class ReorderPertanyaanDto {
    pertanyaanIds: number[];
}
export declare class UpdateSkorDto {
    quarter: string;
    skor: number;
    updatedBy?: string;
}
export declare class SkorUpdateItemDto {
    pertanyaanId: number;
    quarter: string;
    skor: number;
}
export declare class BulkUpdateSkorDto {
    updates: SkorUpdateItemDto[];
}
export declare class UpdateSummaryDto {
    totalScore?: number;
    averageScore?: number;
    rating?: RatingEnum;
    computedAt?: Date;
}
