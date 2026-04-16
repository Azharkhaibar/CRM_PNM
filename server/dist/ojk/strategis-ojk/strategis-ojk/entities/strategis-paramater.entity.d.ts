import { StrategisOjk } from './strategis-ojk.entity';
import { StrategisNilai } from './strategis-nilai.entity';
export declare class StrategisParameter {
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
    strategisOjkId: number;
    strategisOjk: StrategisOjk;
    nilaiList?: StrategisNilai[];
    createdAt: Date;
    updatedAt: Date;
    orderIndex: number;
}
