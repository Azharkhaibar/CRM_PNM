import { Quarter } from '../entities/operasional-section.entity';
export declare class CreateOperasionalSectionDto {
    no: string;
    parameter: string;
    bobotSection?: number;
    description?: string;
    sortOrder?: number;
    year: number;
    quarter: Quarter;
    isActive?: boolean;
}
