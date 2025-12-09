import { Likuiditas, Quarter } from './likuiditas.entity';
export declare class SectionLikuiditas {
    id: number;
    year: number;
    quarter: Quarter;
    no: string;
    bobotSection: number;
    parameter: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    deletedAt: Date | null;
    indikators: Likuiditas[];
}
