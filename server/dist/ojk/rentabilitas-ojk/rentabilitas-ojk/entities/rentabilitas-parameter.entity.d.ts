import { RentabilitasNilai } from './rentabilitas-nilai.entity';
import { RentabilitasProdukOjk } from './rentabilitas-ojk.entity';
export declare class RentabilitasParameter {
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
    rentabilitasProdukOjkId: number;
    rentabilitasProdukOjk: RentabilitasProdukOjk;
    nilaiList?: RentabilitasNilai[];
    createdAt: Date;
    updatedAt: Date;
    orderIndex: number;
}
