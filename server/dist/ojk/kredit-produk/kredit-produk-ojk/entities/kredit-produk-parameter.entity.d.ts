import { KreditProdukOjk } from './kredit-produk-ojk.entity';
import { KreditNilai } from './kredit-produk-nilai.entity';
export declare class KreditParameter {
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
    kreditProdukOjkId: number;
    kreditProdukOjk: KreditProdukOjk;
    nilaiList?: KreditNilai[];
    createdAt: Date;
    updatedAt: Date;
    orderIndex: number;
}
