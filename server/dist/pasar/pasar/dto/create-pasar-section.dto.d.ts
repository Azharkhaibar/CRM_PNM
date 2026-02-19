import { Quarter } from '../entities/indikator.entity';
export declare class CreatePasarSectionDto {
    no: string;
    parameter: string;
    bobotSection?: number;
    description?: string;
    sortOrder?: number;
    year: number;
    quarter: Quarter;
    isActive?: boolean;
}
