import { KpmrHukum } from './hukum-kpmr-ojk.entity';
import { KpmrPertanyaanHukum } from './hukum-kpmr-pertanyaan.entity';
export declare class KpmrAspekHukum {
    id: number;
    nomor?: string;
    judul: string;
    bobot: number;
    deskripsi?: string;
    kpmrId: number;
    kpmr: KpmrHukum;
    pertanyaanList?: KpmrPertanyaanHukum[];
    createdAt: Date;
    updatedAt: Date;
    orderIndex: number;
    averageScore?: number;
    rating?: string;
    updatedBy?: string;
    notes?: string;
}
