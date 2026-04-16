import { InvestasiService } from './new-investasi.service';
import { CreateInvestasiSectionDto } from './dto/create-investasi-section.dto';
import { UpdateInvestasiSectionDto } from './dto/update-new-investasi-section.dto';
import { CreateInvestasiDto } from './dto/create-new-investasi.dto';
import { UpdateInvestasiDto } from './dto/update-new-investasi.dto';
import { Quarter } from './entities/new-investasi.entity';
export declare class InvestasiController {
    private readonly investasiService;
    constructor(investasiService: InvestasiService);
    createSection(createDto: CreateInvestasiSectionDto): Promise<import("./entities/new-investasi-section.entity").InvestasiSection>;
    getSections(isActive?: boolean): Promise<import("./entities/new-investasi-section.entity").InvestasiSection[]>;
    getSection(id: number): Promise<import("./entities/new-investasi-section.entity").InvestasiSection>;
    getSectionsByPeriod(year: number, quarter: Quarter): Promise<import("./entities/new-investasi-section.entity").InvestasiSection[]>;
    updateSection(id: number, updateDto: UpdateInvestasiSectionDto): Promise<import("./entities/new-investasi-section.entity").InvestasiSection>;
    deleteSection(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createIndikator(createDto: CreateInvestasiDto): Promise<import("./entities/new-investasi.entity").Investasi>;
    getAllIndikators(): Promise<import("./entities/new-investasi.entity").Investasi[]>;
    getIndikatorsByPeriod(year: number, quarter: Quarter): Promise<import("./entities/new-investasi.entity").Investasi[]>;
    searchIndikators(query?: string, year?: number, quarter?: Quarter): Promise<import("./entities/new-investasi.entity").Investasi[]>;
    getIndikator(id: number): Promise<import("./entities/new-investasi.entity").Investasi>;
    updateIndikator(id: number, updateDto: UpdateInvestasiDto): Promise<import("./entities/new-investasi.entity").Investasi>;
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
    duplicateIndikator(id: number, year: number, quarter: Quarter): Promise<import("./entities/new-investasi.entity").Investasi>;
}
