import { Quarter } from '../entities/reputasi.entity';
export declare class CreateReputasiSectionDto {
    no: string;
    parameter: string;
    bobotSection?: number;
    description?: string;
    sortOrder?: number;
    year: number;
    quarter: Quarter;
    isActive?: boolean;
}
