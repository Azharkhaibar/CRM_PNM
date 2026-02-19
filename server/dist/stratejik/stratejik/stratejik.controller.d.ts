import { StrategikService } from './stratejik.service';
import { CreateStrategikSectionDto } from './dto/create-stratejik-section.dto';
import { UpdateStrategikSectionDto } from './dto/update-stratejik-section.dto';
import { CreateStrategikDto } from './dto/create-stratejik.dto';
import { UpdateStrategikDto } from './dto/update-stratejik.dto';
import { Quarter } from './entities/stratejik.entity';
export declare class StrategikController {
    private readonly strategikService;
    constructor(strategikService: StrategikService);
    createSection(createDto: CreateStrategikSectionDto): Promise<import("./entities/stratejik-section.entity").StrategikSection>;
    getSections(isActive?: boolean): Promise<import("./entities/stratejik-section.entity").StrategikSection[]>;
    getSection(id: number): Promise<import("./entities/stratejik-section.entity").StrategikSection>;
    updateSection(id: number, updateDto: UpdateStrategikSectionDto): Promise<import("./entities/stratejik-section.entity").StrategikSection>;
    deleteSection(id: number): Promise<void>;
    getSectionsWithIndicatorsByPeriod(year: number, quarter: Quarter): Promise<any>;
    createIndikator(createDto: CreateStrategikDto): Promise<import("./entities/stratejik.entity").Strategik>;
    getAllIndikators(): Promise<import("./entities/stratejik.entity").Strategik[]>;
    getIndikatorsByPeriod(year: number, quarter: Quarter): Promise<import("./entities/stratejik.entity").Strategik[]>;
    searchIndikators(query?: string, year?: number, quarter?: Quarter): Promise<import("./entities/stratejik.entity").Strategik[]>;
    getIndikator(id: number): Promise<import("./entities/stratejik.entity").Strategik>;
    updateIndikator(id: number, updateDto: UpdateStrategikDto): Promise<import("./entities/stratejik.entity").Strategik>;
    deleteIndikator(id: number): Promise<void>;
    getTotalWeighted(year: number, quarter: Quarter): Promise<{
        total: number;
    }>;
    getSectionsByPeriod(year: number, quarter: Quarter): Promise<import("./entities/stratejik-section.entity").StrategikSection[]>;
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
    duplicateIndikator(id: number, year: number, quarter: Quarter): Promise<import("./entities/stratejik.entity").Strategik>;
}
