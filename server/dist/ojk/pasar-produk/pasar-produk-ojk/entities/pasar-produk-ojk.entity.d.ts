import { PasarParameter } from './pasar-produk-parameter.entity';
export declare class PasarProdukOjk {
    id: number;
    year: number;
    quarter: number;
    isActive: boolean;
    parameters?: PasarParameter[];
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
