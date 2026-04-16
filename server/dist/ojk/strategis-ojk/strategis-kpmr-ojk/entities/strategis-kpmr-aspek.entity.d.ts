import { KpmrStrategisOjk } from './strategis-kpmr-ojk.entity';
import { KpmrPertanyaanStrategis } from './strategis-kpmr-pertanyaan.entity';
export declare class KpmrAspekStrategis {
    id: number;
    nomor?: string;
    judul: string;
    bobot: number;
    deskripsi?: string;
    kpmrStrategisId: number;
    kpmrStrategis: KpmrStrategisOjk;
    pertanyaanList?: KpmrPertanyaanStrategis[];
    createdAt: Date;
    updatedAt: Date;
    orderIndex: number;
    averageScore?: number;
    rating?: string;
    updatedBy?: string;
    notes?: string;
}
