import { KpmrAspekHukum } from './hukum-kpmr-aspek.entity';
export declare class KpmrHukum {
    id: number;
    year: number;
    quarter: number;
    isActive: boolean;
    aspekList?: KpmrAspekHukum[];
    summary?: {
        totalScore?: number;
        averageScore?: number;
        rating?: string;
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
