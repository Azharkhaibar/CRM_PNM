import { KpmrPasarOjk } from './pasar-produk-ojk.entity';
import { KpmrPertanyaanPasar } from './pasar-produk-kpmr-pertanyaan.entity';
export declare class KpmrAspekPasar {
    id: number;
    nomor?: string;
    judul: string;
    bobot: number;
    deskripsi?: string;
    kpmrOjkId: number;
    kpmrOjk: KpmrPasarOjk;
    pertanyaanList?: KpmrPertanyaanPasar[];
    createdAt: Date;
    updatedAt: Date;
    orderIndex: number;
    averageScore?: number;
    rating?: string;
    updatedBy?: string;
    notes?: string;
}
