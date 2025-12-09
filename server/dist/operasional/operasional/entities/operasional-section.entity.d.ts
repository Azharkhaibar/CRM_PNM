import { Operational, Quarter } from './operasional.entity';
export declare class SectionOperational {
    id: number;
    year: number;
    quarter: Quarter;
    no: string;
    bobotSection: number;
    parameter: string;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    deletedAt: Date | null;
    indikators: Operational[];
}
