import { SectionPasar } from './section.entity';
export declare class IndikatorPasar {
    id: number;
    section: SectionPasar;
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
    hasil: number | null;
    peringkat: number;
    weighted: number;
    keterangan: string | null;
    mode: string;
    formula: string | null;
    is_percent: boolean;
    created_at: Date;
    updated_at: Date;
}
