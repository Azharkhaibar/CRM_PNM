import { ReputasiParameter } from './reputasi-paramater.entity';
export declare class ReputasiNilai {
    id: number;
    nomor?: string;
    judul?: {
        type?: string;
        text?: string;
        value?: string | number | null;
        pembilang?: string;
        valuePembilang?: string | number | null;
        penyebut?: string;
        valuePenyebut?: string | number | null;
        formula?: string;
        percent?: boolean;
    };
    bobot: number;
    portofolio?: string;
    keterangan?: string;
    riskindikator?: {
        low?: string;
        lowToModerate?: string;
        moderate?: string;
        moderateToHigh?: string;
        high?: string;
    };
    parameterId: number;
    parameter: ReputasiParameter;
    createdAt: Date;
    updatedAt: Date;
    orderIndex: number;
}
