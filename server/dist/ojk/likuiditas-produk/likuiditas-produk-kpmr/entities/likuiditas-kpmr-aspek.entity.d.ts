import { KpmrLikuiditas } from './likuiditas-produk-ojk.entity';
import { KpmrPertanyaanLikuiditas } from './likuiditas-kpmr-pertanyaan.entity';
export declare class KpmrAspekLikuiditas {
    id: number;
    nomor?: string;
    judul: string;
    bobot: number;
    deskripsi?: string;
    kpmrOjkId: number;
    kpmrOjk: KpmrLikuiditas;
    pertanyaanList?: KpmrPertanyaanLikuiditas[];
    createdAt: Date;
    updatedAt: Date;
    orderIndex: number;
    averageScore?: number;
    rating?: string;
    updatedBy?: string;
    notes?: string;
}
