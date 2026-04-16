import { KepatuhanOjk } from './kepatuhan-ojk.entity';
import { KepatuhanNilai } from './kepatuhan-nilai.entity';
export declare class KepatuhanParameter {
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
    kepatuhanId: number;
    kepatuhan: KepatuhanOjk;
    nilaiList?: KepatuhanNilai[];
    createdAt: Date;
    updatedAt: Date;
    orderIndex: number;
}
