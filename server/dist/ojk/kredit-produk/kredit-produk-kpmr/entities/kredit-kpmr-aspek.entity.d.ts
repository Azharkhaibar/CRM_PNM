import { KpmrKreditOjk } from './kredit-produk-kpmr.entity';
import { KpmrPertanyaanKredit } from './kredit-kpmr-pertanyaan.entity';
export declare class KpmrAspekKredit {
    id: number;
    nomor?: string;
    judul: string;
    bobot: number;
    deskripsi?: string;
    kpmrKreditId: number;
    kpmrKredit: KpmrKreditOjk;
    pertanyaanList?: KpmrPertanyaanKredit[];
    createdAt: Date;
    updatedAt: Date;
    orderIndex: number;
    averageScore?: number;
    rating?: string;
    updatedBy?: string;
    notes?: string;
}
