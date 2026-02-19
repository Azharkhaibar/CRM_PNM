import { PasarProdukOjk } from './pasar-produk-ojk.entity';
import { PasarNilai } from './pasar-produk-nilai.entity';
export declare class PasarParameter {
    id: number;
    nomor?: string;
    judul: string;
    bobot: number;
    kategori?: {
        model?: string;
        prinsip?: string;
        jenis?: string;
        underlying?: string[];
    };
    pasarProdukOjkId: number;
    pasarProdukOjk: PasarProdukOjk;
    nilaiList?: PasarNilai[];
    createdAt: Date;
    updatedAt: Date;
    orderIndex: number;
}
