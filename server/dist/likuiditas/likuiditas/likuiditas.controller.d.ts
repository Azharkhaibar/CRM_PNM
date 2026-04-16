import { LikuiditasService } from './likuiditas.service';
import { CreateLikuiditasSectionDto } from './dto/create-likuiditas-section.dto';
import { UpdateLikuiditasSectionDto } from './dto/update-likuiditas-section.dto';
import { CreateLikuiditasDto } from './dto/create-likuiditas.dto';
import { UpdateLikuiditasDto } from './dto/update-likuiditas.dto';
import { Quarter } from './entities/likuiditas.entity';
export declare class LikuiditasController {
    private readonly likuiditasService;
    constructor(likuiditasService: LikuiditasService);
    createSection(createDto: CreateLikuiditasSectionDto): Promise<import("./entities/likuiditas-section.entity").LikuiditasSection>;
    getSections(isActive?: boolean): Promise<import("./entities/likuiditas-section.entity").LikuiditasSection[]>;
    getSection(id: number): Promise<import("./entities/likuiditas-section.entity").LikuiditasSection>;
    getSectionsByPeriod(year: number, quarter: Quarter): Promise<import("./entities/likuiditas-section.entity").LikuiditasSection[]>;
    updateSection(id: number, updateDto: UpdateLikuiditasSectionDto): Promise<import("./entities/likuiditas-section.entity").LikuiditasSection>;
    deleteSection(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createIndikator(createDto: CreateLikuiditasDto): Promise<import("./entities/likuiditas.entity").Likuiditas>;
    getAllIndikators(): Promise<import("./entities/likuiditas.entity").Likuiditas[]>;
    getIndikatorsByPeriod(year: number, quarter: Quarter): Promise<import("./entities/likuiditas.entity").Likuiditas[]>;
    searchIndikators(query?: string, year?: number, quarter?: Quarter): Promise<import("./entities/likuiditas.entity").Likuiditas[]>;
    getIndikator(id: number): Promise<import("./entities/likuiditas.entity").Likuiditas>;
    updateIndikator(id: number, updateDto: UpdateLikuiditasDto): Promise<import("./entities/likuiditas.entity").Likuiditas>;
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
    duplicateIndikator(id: number, year: number, quarter: Quarter): Promise<import("./entities/likuiditas.entity").Likuiditas>;
}
