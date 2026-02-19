export declare enum LikuiditasKategoriModel {
    TANPA_MODEL = "tanpa_model",
    STANDAR = "standar",
    KOMPREHENSIF = "komprehensif"
}
export declare enum LikuiditasKategoriUnderlying {
    KEWAJIBAN = "kewajiban",
    ASET_LANCAR = "aset_lancar",
    ARUS_KAS = "arus_kas",
    RASIO = "rasio"
}
export declare enum LikuiditasKategoriPrinsip {
    SYARIAH = "syariah",
    KONVENSIONAL = "konvensional"
}
export declare enum LikuiditasKategoriJenis {
    JANGKA_PENDEK = "jangka_pendek",
    JANGKA_MENENGAH = "jangka_menengah",
    JANGKA_PANJANG = "jangka_panjang"
}
export declare enum LikuiditasJudulType {
    TANPA_FAKTOR = "Tanpa Faktor",
    SATU_FAKTOR = "Satu Faktor",
    DUA_FAKTOR = "Dua Faktor"
}
export declare class LikuiditasKategoriDto {
    model?: string;
    prinsip?: string;
    jenis?: string;
    underlying?: string[];
}
export declare class LikuiditasJudulDto {
    type?: LikuiditasJudulType;
    text?: string;
    value?: string | number | null;
    pembilang?: string;
    valuePembilang?: string | number | null;
    penyebut?: string;
    valuePenyebut?: string | number | null;
    formula?: string;
    percent?: boolean;
}
export declare class LikuiditasRiskindikatorDto {
    low?: string;
    lowToModerate?: string;
    moderate?: string;
    moderateToHigh?: string;
    high?: string;
}
export declare class CreateLikuiditasProdukInherentDto {
    year: number;
    quarter: number;
    isActive?: boolean;
    createdBy?: string;
    version?: string;
}
export declare class UpdateLikuiditasProdukInherentDto {
    year?: number;
    quarter?: number;
    isActive?: boolean;
    summary?: {
        totalWeighted?: number;
        summaryBg?: string;
        computedAt?: Date;
    };
    isLocked?: boolean;
    lockedBy?: string;
    lockedAt?: Date;
    notes?: string;
    updatedBy?: string;
}
export declare class CreateLikuiditasParameterDto {
    nomor?: string;
    judul: string;
    bobot: number;
    kategori?: LikuiditasKategoriDto;
    orderIndex?: number;
}
export declare class UpdateLikuiditasParameterDto {
    nomor?: string;
    judul?: string;
    bobot?: number;
    kategori?: LikuiditasKategoriDto;
    orderIndex?: number;
}
export declare class CreateLikuiditasNilaiDto {
    nomor?: string;
    judul: LikuiditasJudulDto;
    bobot: number;
    portofolio?: string;
    keterangan?: string;
    riskindikator?: LikuiditasRiskindikatorDto;
    orderIndex?: number;
}
export declare class UpdateLikuiditasNilaiDto {
    nomor?: string;
    judul?: LikuiditasJudulDto;
    bobot?: number;
    portofolio?: string;
    keterangan?: string;
    riskindikator?: LikuiditasRiskindikatorDto;
    orderIndex?: number;
}
export declare class ReorderLikuiditasParametersDto {
    parameterIds: number[];
}
export declare class ReorderLikuiditasNilaiDto {
    nilaiIds: number[];
}
export declare class UpdateLikuiditasSummaryDto {
    totalWeighted?: number;
    summaryBg?: string;
    computedAt?: Date;
}
export declare class LikuiditasExportImportMetadataDto {
    year: number;
    quarter: number;
    exportedAt?: string;
    totalParameters?: number;
    totalNilai?: number;
}
export declare class LikuiditasExportParameterDto {
    id?: number;
    nomor?: string;
    judul: string;
    bobot: number;
    kategori?: LikuiditasKategoriDto;
    orderIndex?: number;
    nilaiList?: LikuiditasExportNilaiDto[];
}
export declare class LikuiditasExportNilaiDto {
    id?: number;
    nomor?: string;
    judul: LikuiditasJudulDto;
    bobot: number;
    portofolio?: string;
    keterangan?: string;
    riskindikator?: LikuiditasRiskindikatorDto;
    orderIndex?: number;
}
export declare class LikuiditasImportExportDto {
    metadata: LikuiditasExportImportMetadataDto;
    parameters: LikuiditasExportParameterDto[];
}
