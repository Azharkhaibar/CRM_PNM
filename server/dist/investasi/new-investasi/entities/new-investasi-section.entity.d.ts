import { Quarter, Investasi } from './new-investasi.entity';
export declare class InvestasiSection {
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
    investasiIndicators: Investasi[];
}
