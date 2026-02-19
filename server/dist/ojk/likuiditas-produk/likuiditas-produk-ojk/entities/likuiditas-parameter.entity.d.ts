import { LikuiditasProdukOjk } from './likuiditas-produk-ojk.entity';
import { LikuiditasNilai } from './likuditas-nilai.entity';
export declare class LikuiditasParameter {
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
    likuiditasProdukOjkId: number;
    likuiditasProdukOjk: LikuiditasProdukOjk;
    nilaiList?: LikuiditasNilai[];
    createdAt: Date;
    updatedAt: Date;
    orderIndex: number;
}
