import { IndikatorPasar } from './indikator.entity';
export declare class SectionPasar {
    id: number;
    no_sec: string;
    nama_section: string;
    bobot_par: number;
    tahun: number;
    triwulan: string;
    indikators: IndikatorPasar[];
    total_weighted: number;
    created_at: Date;
    updated_at: Date;
}
