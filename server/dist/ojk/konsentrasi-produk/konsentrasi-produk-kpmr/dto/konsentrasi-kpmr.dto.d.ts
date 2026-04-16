export declare enum KategoriModel {
    TANPA_MODEL = "tanpa_model",
    OPEN_END = "open_end",
    TERSTRUKTUR = "terstruktur"
}
export declare enum KategoriUnderlying {
    INDEKS = "indeks",
    EBA = "eba",
    DINFRA = "dinfra",
    OBLIGASI = "obligasi"
}
export declare enum KategoriPrinsip {
    SYARIAH = "syariah",
    KONVENSIONAL = "konvensional"
}
export declare enum KategoriJenis {
    PASAR_UANG = "pasar_uang",
    PENDAPATAN_TETAP = "pendapatan_tetap",
    CAMPURAN = "campuran",
    SAHAM = "saham",
    INDEKS = "indeks",
    TERPROTEKSI = "terproteksi"
}
export declare enum JudulType {
    TANPA_FAKTOR = "Tanpa Faktor",
    SATU_FAKTOR = "Satu Faktor",
    DUA_FAKTOR = "Dua Faktor"
}
export declare enum KpmrQuarterEnum {
    Q1 = "Q1",
    Q2 = "Q2",
    Q3 = "Q3",
    Q4 = "Q4"
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
export declare class CreateKpmrKonsentrasiOjkDto {
    year: number;
    quarter: number;
    isActive?: boolean;
    createdBy?: string;
    version?: string;
    notes?: string;
    summary?: any;
    aspekList?: CreateKpmrAspekKonsentrasiDto[];
}
export declare class CreateKpmrAspekKonsentrasiDto {
    nomor?: string;
    judul: string;
    bobot: number;
    deskripsi?: string;
    kpmrOjkId?: number;
    orderIndex?: number;
    pertanyaanList?: CreateKpmrPertanyaanKonsentrasiDto[];
}
export declare class CreateKpmrPertanyaanKonsentrasiDto {
    nomor?: string;
    pertanyaan: string;
    skor?: KpmrSkorDto;
    indicator?: KpmrIndicatorDto;
    evidence?: string;
    catatan?: string;
    aspekId?: number;
    orderIndex?: number;
}
export declare class UpdateKpmrKonsentrasiOjkDto {
    year?: number;
    quarter?: number;
    isActive?: boolean;
    isLocked?: boolean;
    lockedBy?: string;
    lockedAt?: Date;
    notes?: string;
    summary?: any;
    updatedBy?: string;
}
export declare class UpdateKpmrAspekKonsentrasiDto {
    nomor?: string;
    judul?: string;
    bobot?: number;
    deskripsi?: string;
    orderIndex?: number;
    updatedBy?: string;
    notes?: string;
}
export declare class UpdateKpmrPertanyaanKonsentrasiDto {
    nomor?: string;
    pertanyaan?: string;
    skor?: KpmrSkorDto;
    indicator?: KpmrIndicatorDto;
    evidence?: string;
    catatan?: string;
    orderIndex?: number;
}
export declare class UpdateSkorDto {
    quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
    skor: number;
    updatedBy?: string;
}
export declare class BulkUpdateItemDto {
    pertanyaanId: number;
    quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
    skor: number;
}
export declare class BulkUpdateSkorDto {
    updates: BulkUpdateItemDto[];
}
export declare class ReorderAspekDto {
    aspekIds: number[];
}
export declare class ReorderPertanyaanDto {
    pertanyaanIds: number[];
}
export declare class UpdateSummaryDto {
    totalScore?: number;
    averageScore?: number;
    rating?: string;
    computedAt?: Date;
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
    indicator?: {
        strong: string;
        satisfactory: string;
        fair: string;
        marginal: string;
        unsatisfactory: string;
    };
    evidence?: string;
    catatan?: string;
    orderIndex?: number;
}
export declare class FrontendAspekResponseDto {
    id: string;
    nomor?: string;
    judul: string;
    bobot: string;
    deskripsi?: string;
    orderIndex?: number;
    averageScore?: number;
    rating?: string;
    updatedBy?: string;
    notes?: string;
    pertanyaanList?: FrontendPertanyaanResponseDto[];
}
export declare class FrontendKpmrResponseDto {
    id: string;
    year: number;
    quarter: number;
    isActive?: boolean;
    isLocked?: boolean;
    version?: string;
    notes?: string;
    summary?: any;
    aspekList?: FrontendAspekResponseDto[];
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class KategoriDto {
    model?: string;
    prinsip?: string;
    jenis?: string;
    underlying?: string[];
}
export declare class JudulDto {
    type?: JudulType;
    text?: string;
    value?: string | number | null;
    pembilang?: string;
    valuePembilang?: string | number | null;
    penyebut?: string;
    valuePenyebut?: string | number | null;
    formula?: string;
    percent?: boolean;
}
export declare class RiskindikatorDto {
    low?: string;
    lowToModerate?: string;
    moderate?: string;
    moderateToHigh?: string;
    high?: string;
}
