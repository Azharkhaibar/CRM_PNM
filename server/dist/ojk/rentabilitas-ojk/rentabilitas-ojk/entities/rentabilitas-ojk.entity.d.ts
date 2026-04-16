import { RentabilitasParameter } from './rentabilitas-parameter.entity';
export declare class RentabilitasProdukOjk {
    id: number;
    year: number;
    quarter: number;
    isActive: boolean;
    parameters?: RentabilitasParameter[];
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
