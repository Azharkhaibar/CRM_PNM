import { KpmrReputasiOjk } from './reputasi-kpmr-ojk.entity';
import { KpmrPertanyaanReputasi } from './reputasi-kpmr-pertanyaan.entity';
export declare class KpmrAspekReputasi {
    id: number;
    nomor?: string;
    judul: string;
    bobot: number;
    deskripsi?: string;
    kpmrReputasiId: number;
    kpmrReputasi: KpmrReputasiOjk;
    pertanyaanList?: KpmrPertanyaanReputasi[];
    createdAt: Date;
    updatedAt: Date;
    orderIndex: number;
    averageScore?: number;
    rating?: string;
    updatedBy?: string;
    notes?: string;
}
