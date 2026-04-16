import { KpmrKepatuhanOjk } from './kepatuhan-kpmr-ojk.entity';
import { KpmrPertanyaanKepatuhan } from './kepatuhan-kpmr-pertanyaan.entity';
export declare class KpmrAspekKepatuhan {
    id: number;
    nomor?: string;
    judul: string;
    bobot: number;
    deskripsi?: string;
    kpmrKepatuhanId: number;
    kpmrKepatuhan: KpmrKepatuhanOjk;
    pertanyaanList?: KpmrPertanyaanKepatuhan[];
    createdAt: Date;
    updatedAt: Date;
    orderIndex: number;
    averageScore?: number;
    rating?: string;
    updatedBy?: string;
    notes?: string;
}
