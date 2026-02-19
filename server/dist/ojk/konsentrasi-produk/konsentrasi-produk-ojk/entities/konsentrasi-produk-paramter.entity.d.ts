import { KonsentrasiProdukOjk } from './konsentrasi-produk-ojk.entity';
import { KonsentrasiNilai } from './konsentrasi-produk-nilai.entity';
export declare class KonsentrasiParameter {
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
    konsentrasiProdukOjkId: number;
    konsentrasiProdukOjk: KonsentrasiProdukOjk;
    nilaiList?: KonsentrasiNilai[];
    createdAt: Date;
    updatedAt: Date;
    orderIndex: number;
}
