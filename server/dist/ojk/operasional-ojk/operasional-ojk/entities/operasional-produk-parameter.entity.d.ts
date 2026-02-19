import { Operasional } from './operasional-ojk.entity';
import { OperasionalNilai } from './operasional-produk-nilai.entity';
export declare class OperasionalParameter {
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
    operasionalId: number;
    operasional: Operasional;
    nilaiList?: OperasionalNilai[];
    createdAt: Date;
    updatedAt: Date;
    orderIndex: number;
}
