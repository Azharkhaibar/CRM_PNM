import { KpmrKonsentrasiOjk } from './konsentrasi-produk-kpmr.entity';
import { KpmrPertanyaanKonsentrasi } from './konsentrasi-kpmr-pertanyaan.entity';
export declare class KpmrAspekKonsentrasi {
    id: number;
    nomor?: string;
    judul: string;
    bobot: number;
    deskripsi?: string;
    kpmrOjkId: number;
    kpmrOjk: KpmrKonsentrasiOjk;
    pertanyaanList?: KpmrPertanyaanKonsentrasi[];
    createdAt: Date;
    updatedAt: Date;
    orderIndex: number;
    averageScore?: number;
    rating?: string;
    updatedBy?: string;
    notes?: string;
}
