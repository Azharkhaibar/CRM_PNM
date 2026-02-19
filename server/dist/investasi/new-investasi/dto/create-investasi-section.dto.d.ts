import { Quarter } from '../entities/new-investasi.entity';
export declare class CreateInvestasiSectionDto {
    no: string;
    parameter: string;
    bobotSection?: number;
    description?: string;
    sortOrder?: number;
    year: number;
    quarter: Quarter;
    isActive?: boolean;
}
