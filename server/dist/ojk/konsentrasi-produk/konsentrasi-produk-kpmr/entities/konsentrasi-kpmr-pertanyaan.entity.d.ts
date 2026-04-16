import { KpmrAspekKonsentrasi } from './konsentrasi-kpmr-aspek.entity';
export declare class KpmrPertanyaanKonsentrasi {
    id: number;
    nomor?: string;
    pertanyaan: string;
    skor?: {
        Q1?: number;
        Q2?: number;
        Q3?: number;
        Q4?: number;
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
    aspek: KpmrAspekKonsentrasi;
    createdAt: Date;
    updatedAt: Date;
    orderIndex: number;
}
