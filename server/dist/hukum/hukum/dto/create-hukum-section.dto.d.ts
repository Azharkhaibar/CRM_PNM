import { Quarter } from '../entities/hukum.entity';
export declare class CreateHukumSectionDto {
    no: string;
    parameter: string;
    bobotSection?: number;
    description?: string;
    sortOrder?: number;
    year: number;
    quarter: Quarter;
    isActive?: boolean;
}
