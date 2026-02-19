import { PasarService } from './pasar.service';
import { CreatePasarSectionDto } from './dto/create-pasar-section.dto';
import { UpdatePasarSectionDto } from './dto/update-pasar-section.dto';
import { CreatePasarDto } from './dto/create-pasar-indikator.dto';
import { UpdatePasarDto } from './dto/update-pasar.dto';
import { Quarter } from './entities/indikator.entity';
export declare class PasarController {
    private readonly pasarService;
    constructor(pasarService: PasarService);
    createSection(createDto: CreatePasarSectionDto): Promise<import("./entities/section.entity").PasarSection>;
    getSections(isActive?: boolean): Promise<import("./entities/section.entity").PasarSection[]>;
    getSection(id: number): Promise<import("./entities/section.entity").PasarSection>;
    updateSection(id: number, updateDto: UpdatePasarSectionDto): Promise<import("./entities/section.entity").PasarSection>;
    deleteSection(id: number): Promise<void>;
    getSectionsWithIndicatorsByPeriod(year: number, quarter: Quarter): Promise<any>;
    createIndikator(createDto: CreatePasarDto): Promise<import("./entities/indikator.entity").Pasar>;
    getAllIndikators(): Promise<import("./entities/indikator.entity").Pasar[]>;
    getIndikatorsByPeriod(year: number, quarter: Quarter): Promise<import("./entities/indikator.entity").Pasar[]>;
    searchIndikators(query?: string, year?: number, quarter?: Quarter): Promise<import("./entities/indikator.entity").Pasar[]>;
    getIndikator(id: number): Promise<import("./entities/indikator.entity").Pasar>;
    updateIndikator(id: number, updateDto: UpdatePasarDto): Promise<import("./entities/indikator.entity").Pasar>;
    deleteIndikator(id: number): Promise<void>;
    getTotalWeighted(year: number, quarter: Quarter): Promise<{
        total: number;
    }>;
    getSectionsByPeriod(year: number, quarter: Quarter): Promise<import("./entities/section.entity").PasarSection[]>;
    getAvailablePeriods(): Promise<{
        success: boolean;
        data: {
            year: number;
            quarter: Quarter;
        }[];
        count: number;
    }>;
    getAllPeriods(): Promise<{
        success: boolean;
        data: {
            indicatorCount: number;
            year: number;
            quarter: Quarter;
        }[];
        count: number;
    }>;
    duplicateIndikator(id: number, year: number, quarter: Quarter): Promise<import("./entities/indikator.entity").Pasar>;
}
