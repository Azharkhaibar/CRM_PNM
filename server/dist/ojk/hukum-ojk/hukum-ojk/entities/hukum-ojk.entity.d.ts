import { HukumParameter } from './hukum-paramater.entity';
export declare class HukumOjk {
    id: number;
    year: number;
    quarter: number;
    isActive: boolean;
    parameters?: HukumParameter[];
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
