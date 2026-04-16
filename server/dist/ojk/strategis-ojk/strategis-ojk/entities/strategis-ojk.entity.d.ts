import { StrategisParameter } from './strategis-paramater.entity';
export declare class StrategisOjk {
    id: number;
    year: number;
    quarter: number;
    isActive: boolean;
    parameters?: StrategisParameter[];
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
