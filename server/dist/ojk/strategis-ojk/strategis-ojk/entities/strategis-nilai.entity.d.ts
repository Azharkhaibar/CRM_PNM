import { StrategisParameter } from './strategis-paramater.entity';
export declare class StrategisNilai {
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
    parameter: StrategisParameter;
    createdAt: Date;
    updatedAt: Date;
    orderIndex: number;
}
