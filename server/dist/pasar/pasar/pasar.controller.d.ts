import { PasarService } from './pasar.service';
import { CreatePasarSectionDto } from './dto/create-pasar-section.dto';
import { UpdatePasarSectionDto } from './dto/update-pasar-section.dto';
import { CreatePasarDto } from './dto/create-pasar.dto';
import { UpdatePasarDto } from './dto/update-pasar.dto';
import { Quarter } from './entities/pasar.entity';
export declare class PasarController {
    private readonly pasarService;
    constructor(pasarService: PasarService);
    createSection(createDto: CreatePasarSectionDto): Promise<import("./entities/pasar-section.entity").PasarSection>;
    getSections(isActive?: boolean): Promise<import("./entities/pasar-section.entity").PasarSection[]>;
    getSection(id: number): Promise<import("./entities/pasar-section.entity").PasarSection>;
    getSectionsByPeriod(year: number, quarter: Quarter): Promise<import("./entities/pasar-section.entity").PasarSection[]>;
    updateSection(id: number, updateDto: UpdatePasarSectionDto): Promise<import("./entities/pasar-section.entity").PasarSection>;
    deleteSection(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createIndikator(createDto: CreatePasarDto): Promise<import("./entities/pasar.entity").Pasar>;
    getAllIndikators(): Promise<import("./entities/pasar.entity").Pasar[]>;
    getIndikatorsByPeriod(year: number, quarter: Quarter): Promise<import("./entities/pasar.entity").Pasar[]>;
    searchIndikators(query?: string, year?: number, quarter?: Quarter): Promise<import("./entities/pasar.entity").Pasar[]>;
    getIndikator(id: number): Promise<import("./entities/pasar.entity").Pasar>;
    updateIndikator(id: number, updateDto: UpdatePasarDto): Promise<import("./entities/pasar.entity").Pasar>;
    deleteIndikator(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    getSectionsWithIndicatorsByPeriod(year: number, quarter: Quarter): Promise<any>;
    getTotalWeighted(year: number, quarter: Quarter): Promise<{
        success: boolean;
        year: number;
        quarter: Quarter;
        total: number;
    }>;
    getAvailablePeriods(): Promise<{
        success: boolean;
        data: {
            year: number;
            quarter: Quarter;
        }[];
        count: number;
    }>;
    getAllPeriodsWithCounts(): Promise<{
        success: boolean;
        data: {
            indicatorCount: number;
            year: number;
            quarter: Quarter;
        }[];
        count: number;
    }>;
    getIndikatorCount(year: number, quarter: Quarter): Promise<{
        success: boolean;
        year: number;
        quarter: Quarter;
        count: number;
    }>;
    duplicateIndikator(id: number, year: number, quarter: Quarter): Promise<import("./entities/pasar.entity").Pasar>;
}
