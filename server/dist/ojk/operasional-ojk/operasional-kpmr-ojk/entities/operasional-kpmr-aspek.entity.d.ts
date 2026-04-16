import { KpmrOperasionalOjk } from './operasional-kpmr-ojk.entity';
import { KpmrPertanyaanOperasional } from './operasional-kpmr-pertanyaan.entity';
export declare class KpmrAspekOperasional {
    id: number;
    nomor?: string;
    judul: string;
    bobot: number;
    deskripsi?: string;
    kpmrOjkId: number;
    kpmrOjk: KpmrOperasionalOjk;
    pertanyaanList?: KpmrPertanyaanOperasional[];
    createdAt: Date;
    updatedAt: Date;
    orderIndex: number;
    averageScore?: number;
    rating?: string;
    updatedBy?: string;
    notes?: string;
}
