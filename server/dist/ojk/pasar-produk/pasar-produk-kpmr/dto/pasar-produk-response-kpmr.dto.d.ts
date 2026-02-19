export declare class KpmrPertanyaanPasarResponseDto {
    id: number;
    nomor?: string;
    pertanyaan: string;
    skor?: {
        Q1?: number | null;
        Q2?: number | null;
        Q3?: number | null;
        Q4?: number | null;
    };
    indicator?: {
        strong?: string;
        satisfactory?: string;
        fair?: string;
        marginal?: string;
        unsatisfactory?: string;
    };
    evidence?: string;
    catatan?: string;
    aspekId: number;
    orderIndex: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class KpmrAspekPasarResponseDto {
    id: number;
    nomor?: string;
    judul: string;
    bobot: number;
    deskripsi?: string;
    kpmrOjkId: number;
    orderIndex: number;
    averageScore?: number;
    rating?: string;
    updatedBy?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    pertanyaanList?: KpmrPertanyaanPasarResponseDto[];
}
export declare class KpmrPasarOjkResponseDto {
    id: number;
    year: number;
    quarter: number;
    isActive: boolean;
    summary?: {
        totalScore?: number;
        averageScore?: number;
        rating?: string;
        computedAt?: Date;
    };
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    updatedBy?: string;
    version: string;
    isLocked: boolean;
    lockedAt?: Date;
    lockedBy?: string;
    notes?: string;
    aspekList?: KpmrAspekPasarResponseDto[];
}
