import { KreditParameter } from './kredit-produk-parameter.entity';
export declare class KreditProdukOjk {
    id: number;
    year: number;
    quarter: number;
    isActive: boolean;
    parameters?: KreditParameter[];
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
