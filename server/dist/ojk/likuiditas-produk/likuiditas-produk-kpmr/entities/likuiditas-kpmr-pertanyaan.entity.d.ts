import { KpmrAspekLikuiditas } from './likuiditas-kpmr-aspek.entity';
export declare class KpmrPertanyaanLikuiditas {
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
    aspek: KpmrAspekLikuiditas;
    createdAt: Date;
    updatedAt: Date;
    orderIndex: number;
}
