import { Quarter } from '../entities/likuiditas.entity';
export declare class CreateLikuiditasSectionDto {
    no: string;
    parameter: string;
    bobotSection?: number;
    description?: string;
    sortOrder?: number;
    year: number;
    quarter: Quarter;
    isActive?: boolean;
}
