import { Stratejik } from './stratejik.entity';
export declare class StratejikSection {
    id: number;
    no: string;
    bobotSection: number;
    parameter: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    stratejik: Stratejik[];
}
