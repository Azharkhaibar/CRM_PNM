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
export declare class CreateStrategisOjkDto {
    year: number;
    quarter: number;
    isActive?: boolean;
    createdBy?: string;
    version?: string;
}
export declare class UpdateStrategisOjkDto {
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
export declare class CreateParameterDto {
    nomor?: string;
    judul: string;
    bobot: number;
    kategori?: KategoriDto;
    orderIndex?: number;
}
export declare class UpdateParameterDto {
    nomor?: string;
    judul?: string;
    bobot?: number;
    kategori?: KategoriDto;
    orderIndex?: number;
}
export declare class CreateNilaiDto {
    nomor?: string;
    judul: JudulDto;
    bobot: number;
    portofolio?: string;
    keterangan?: string;
    riskindikator?: RiskindikatorDto;
    orderIndex?: number;
}
export declare class UpdateNilaiDto {
    nomor?: string;
    judul?: JudulDto;
    bobot?: number;
    portofolio?: string;
    keterangan?: string;
    riskindikator?: RiskindikatorDto;
    orderIndex?: number;
}
export declare class ReorderParametersDto {
    parameterIds: number[];
}
export declare class ReorderNilaiDto {
    nilaiIds: number[];
}
export declare class UpdateSummaryDto {
    totalWeighted?: number;
    summaryBg?: string;
    computedAt?: Date;
}
export declare class ExportImportMetadataDto {
    year: number;
    quarter: number;
    exportedAt?: string;
    totalParameters?: number;
    totalNilai?: number;
}
export declare class ExportParameterDto {
    id?: number;
    nomor?: string;
    judul: string;
    bobot: number;
    kategori?: KategoriDto;
    orderIndex?: number;
    nilaiList?: ExportNilaiDto[];
}
export declare class ExportNilaiDto {
    id?: number;
    nomor?: string;
    judul: JudulDto;
    bobot: number;
    portofolio?: string;
    keterangan?: string;
    riskindikator?: RiskindikatorDto;
    orderIndex?: number;
}
export declare class ImportExportDto {
    metadata: ExportImportMetadataDto;
    parameters: ExportParameterDto[];
}
