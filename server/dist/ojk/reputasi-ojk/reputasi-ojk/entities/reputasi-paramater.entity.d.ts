import { ReputasiOjk } from './reputasi-ojk.entity';
import { ReputasiNilai } from './reputasi-nilai.entity';
export declare class ReputasiParameter {
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
    reputasiOjkId: number;
    reputasiOjk: ReputasiOjk;
    nilaiList?: ReputasiNilai[];
    createdAt: Date;
    updatedAt: Date;
    orderIndex: number;
}
