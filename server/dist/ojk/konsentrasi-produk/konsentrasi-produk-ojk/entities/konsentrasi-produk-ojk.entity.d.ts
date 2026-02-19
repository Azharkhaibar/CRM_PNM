import { KonsentrasiParameter } from './konsentrasi-produk-paramter.entity';
export declare class KonsentrasiProdukOjk {
    id: number;
    year: number;
    quarter: number;
    isActive: boolean;
    parameters?: KonsentrasiParameter[];
    summary?: {
        totalWeighted?: number;
        summaryBg?: string;
        computedAt?: Date;
    };
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    updatedBy?: string;
    version?: string;
    isLocked?: boolean;
    lockedAt?: Date;
    lockedBy?: string;
    notes?: string;
}
