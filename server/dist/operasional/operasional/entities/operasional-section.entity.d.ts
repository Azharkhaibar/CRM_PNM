import { Quarter, Operasional } from './operasional.entity';
export declare class OperasionalSection {
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
    operasionalIndicators: Operasional[];
}
