import { Quarter, Likuiditas } from './likuiditas.entity';
export declare class LikuiditasSection {
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
    createdBy: string | null;
    updatedBy: string | null;
    likuiditasIndicators: Likuiditas[];
}
