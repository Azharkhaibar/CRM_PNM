import { LikuiditasService } from './likuiditas.service';
import { CreateLikuiditasSectionDto } from './dto/create-likuiditas-section.dto';
import { UpdateLikuiditasSectionDto } from './dto/update-likuiditas-section.dto';
import { Quarter } from './entities/likuiditas.entity';
import { CreateLikuiditasDto } from './dto/create-likuiditas.dto';
import { UpdateLikuiditasDto } from './dto/update-likuiditas.dto';
export declare class LikuiditasController {
    private readonly likuiditasService;
    constructor(likuiditasService: LikuiditasService);
    createSection(createDto: CreateLikuiditasSectionDto): Promise<import("./entities/section-likuiditas.entity").LikuiditasSection>;
    getSections(isActive?: boolean): Promise<import("./entities/section-likuiditas.entity").LikuiditasSection[]>;
    getSection(id: number): Promise<import("./entities/section-likuiditas.entity").LikuiditasSection>;
    updateSection(id: number, updateDto: UpdateLikuiditasSectionDto): Promise<import("./entities/section-likuiditas.entity").LikuiditasSection>;
    deleteSection(id: number): Promise<void>;
    getSectionsWithIndicatorsByPeriod(year: number, quarter: Quarter): Promise<any>;
    createIndikator(createDto: CreateLikuiditasDto): Promise<import("./entities/likuiditas.entity").Likuiditas>;
    getAllIndikators(): Promise<import("./entities/likuiditas.entity").Likuiditas[]>;
    getIndikatorsByPeriod(year: number, quarter: Quarter): Promise<import("./entities/likuiditas.entity").Likuiditas[]>;
    searchIndikators(query?: string, year?: number, quarter?: Quarter): Promise<import("./entities/likuiditas.entity").Likuiditas[]>;
    getIndikator(id: number): Promise<import("./entities/likuiditas.entity").Likuiditas>;
    updateIndikator(id: number, updateDto: UpdateLikuiditasDto): Promise<import("./entities/likuiditas.entity").Likuiditas>;
    deleteIndikator(id: number): Promise<void>;
    getTotalWeighted(year: number, quarter: Quarter): Promise<{
        total: number;
    }>;
    getSectionsByPeriod(year: number, quarter: Quarter): Promise<import("./entities/section-likuiditas.entity").LikuiditasSection[]>;
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
    duplicateIndikator(id: number, year: number, quarter: Quarter): Promise<import("./entities/likuiditas.entity").Likuiditas>;
}
