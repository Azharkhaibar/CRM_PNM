export declare enum Triwulan {
    Q1 = "Q1",
    Q2 = "Q2",
    Q3 = "Q3",
    Q4 = "Q4"
}
export declare enum IndikatorMode {
    RASIO = "RASIO",
    NILAI_TUNGGAL = "NILAI_TUNGGAL"
}
export declare class SectionResponseDto {
    id: number;
    no_sec: string;
    nama_section: string;
    bobot_par: number;
    tahun: number;
    triwulan: Triwulan;
    total_weighted: number;
    created_at: Date;
    updated_at: Date;
}
export declare class IndikatorResponseDto {
    id: number;
    sectionId: number;
    nama_indikator: string;
    bobot_indikator: number;
    pembilang_label: string | null;
    pembilang_value: number | null;
    penyebut_label: string | null;
    penyebut_value: number | null;
    sumber_risiko: string;
    dampak: string;
    low: string;
    low_to_moderate: string;
    moderate: string;
    moderate_to_high: string;
    high: string;
    hasil: number;
    peringkat: number;
    weighted: number;
    keterangan: string | null;
    mode: IndikatorMode;
    formula: string | null;
    is_percent: boolean;
    created_at: Date;
    updated_at: Date;
}
export declare class SectionWithIndikatorsResponseDto {
    id: number;
    no_sec: string;
    nama_section: string;
    bobot_par: number;
    tahun: number;
    triwulan: Triwulan;
    total_weighted: number;
    created_at: Date;
    updated_at: Date;
    indikators: IndikatorResponseDto[];
}
export declare class DashboardSummaryResponseDto {
    tahun: number;
    triwulan: Triwulan;
    total_sections: number;
    total_indicators: number;
    total_weighted: number;
    average_hasil: number;
    average_hasil_percent: string;
}
