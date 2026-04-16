import { HukumOjk } from './hukum-ojk.entity';
import { HukumNilai } from './hukum-nilai.entity';
export declare class HukumParameter {
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
    hukumOjkId: number;
    hukumOjk: HukumOjk;
    nilaiList?: HukumNilai[];
    createdAt: Date;
    updatedAt: Date;
    orderIndex: number;
}
