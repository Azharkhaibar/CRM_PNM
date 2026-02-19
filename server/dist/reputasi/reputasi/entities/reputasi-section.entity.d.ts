import { Quarter, Reputasi } from './reputasi.entity';
export declare class ReputasiSection {
    id: number;
    year: number;
    quarter: Quarter;
    no: string;
    bobotSection: number;
    parameter: string;
    description: string | null;
    sortOrder: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    reputasiIndicators: Reputasi[];
}
