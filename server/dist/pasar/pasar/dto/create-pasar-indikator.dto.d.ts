export declare class CreateIndikatorDto {
    sectionId: number;
    nama_indikator: string;
    bobot_indikator: number;
    sumber_risiko: string;
    dampak: string;
    low: string;
    low_to_moderate: string;
    moderate: string;
    moderate_to_high: string;
    high: string;
    peringkat: number;
    keterangan?: string | null;
    mode?: string;
    formula?: string | null;
    is_percent?: boolean;
    pembilang_label?: string | null;
    pembilang_value?: number | null;
    penyebut_label?: string | null;
    penyebut_value?: number | null;
}
