import { Quarter } from 'src/likuiditas/likuiditas/entities/likuiditas.entity';
import { Likuiditas } from 'src/likuiditas/likuiditas/entities/likuiditas.entity';
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
    likuiditasIndicators: Likuiditas[];
}
