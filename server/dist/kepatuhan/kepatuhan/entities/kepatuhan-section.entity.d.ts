import { Kepatuhan, Quarter } from './kepatuhan.entity';
export declare class KepatuhanSection {
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
    kepatuhanIndicators: Kepatuhan[];
}
