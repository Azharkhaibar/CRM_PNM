import { HukumService } from './hukum.service';
import { CreateHukumSectionDto } from './dto/create-hukum-section.dto';
import { UpdateHukumSectionDto } from './dto/update-hukum-section.dto';
import { Quarter } from './entities/hukum.entity';
import { UpdateHukumDto } from './dto/update-hukum.dto';
import { CreateHukumDto } from './dto/create-hukum.dto';
export declare class HukumController {
    private readonly hukumService;
    constructor(hukumService: HukumService);
    createSection(createDto: CreateHukumSectionDto): Promise<import("./entities/hukum-section.entity").HukumSection>;
    getSections(isActive?: boolean): Promise<import("./entities/hukum-section.entity").HukumSection[]>;
    getSection(id: number): Promise<import("./entities/hukum-section.entity").HukumSection>;
    updateSection(id: number, updateDto: UpdateHukumSectionDto): Promise<import("./entities/hukum-section.entity").HukumSection>;
    deleteSection(id: number): Promise<void>;
    getSectionsWithIndicatorsByPeriod(year: number, quarter: Quarter): Promise<any>;
    createIndikator(createDto: CreateHukumDto): Promise<import("./entities/hukum.entity").Hukum>;
    getAllIndikators(): Promise<import("./entities/hukum.entity").Hukum[]>;
    getIndikatorsByPeriod(year: number, quarter: Quarter): Promise<import("./entities/hukum.entity").Hukum[]>;
    searchIndikators(query?: string, year?: number, quarter?: Quarter): Promise<import("./entities/hukum.entity").Hukum[]>;
    getIndikator(id: number): Promise<import("./entities/hukum.entity").Hukum>;
    updateIndikator(id: number, updateDto: UpdateHukumDto): Promise<import("./entities/hukum.entity").Hukum>;
    deleteIndikator(id: number): Promise<void>;
    getTotalWeighted(year: number, quarter: Quarter): Promise<{
        total: number;
    }>;
    getSectionsByPeriod(year: number, quarter: Quarter): Promise<import("./entities/hukum-section.entity").HukumSection[]>;
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
    duplicateIndikator(id: number, year: number, quarter: Quarter): Promise<import("./entities/hukum.entity").Hukum>;
}
