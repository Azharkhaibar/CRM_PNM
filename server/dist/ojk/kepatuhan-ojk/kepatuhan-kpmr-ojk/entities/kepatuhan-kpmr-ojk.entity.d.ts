import { KpmrAspekKepatuhan } from './kepatuhan-kpmr-aspek.entity';
export declare class KpmrKepatuhanOjk {
    id: number;
    year: number;
    quarter: number;
    isActive: boolean;
    aspekList?: KpmrAspekKepatuhan[];
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
