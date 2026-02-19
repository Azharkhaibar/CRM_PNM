import { ReputasiService } from './reputasi.service';
import { CreateReputasiSectionDto } from './dto/create-reputasi-section.dto';
import { UpdateReputasiSectionDto } from './dto/update-reputasi-section.dto';
import { Quarter } from './entities/reputasi.entity';
import { CreateReputasiDto } from './dto/create-reputasi.dto';
import { UpdateReputasiDto } from './dto/update-reputasi.dto';
export declare class ReputasiController {
    private readonly reputasiService;
    constructor(reputasiService: ReputasiService);
    createSection(createDto: CreateReputasiSectionDto): Promise<import("./entities/reputasi-section.entity").ReputasiSection>;
    getSections(isActive?: boolean): Promise<import("./entities/reputasi-section.entity").ReputasiSection[]>;
    getSection(id: number): Promise<import("./entities/reputasi-section.entity").ReputasiSection>;
    updateSection(id: number, updateDto: UpdateReputasiSectionDto): Promise<import("./entities/reputasi-section.entity").ReputasiSection>;
    deleteSection(id: number): Promise<void>;
    getSectionsWithIndicatorsByPeriod(year: number, quarter: Quarter): Promise<any>;
    createIndikator(createDto: CreateReputasiDto): Promise<import("./entities/reputasi.entity").Reputasi>;
    getAllIndikators(): Promise<import("./entities/reputasi.entity").Reputasi[]>;
    getIndikatorsByPeriod(year: number, quarter: Quarter): Promise<import("./entities/reputasi.entity").Reputasi[]>;
    searchIndikators(query?: string, year?: number, quarter?: Quarter): Promise<import("./entities/reputasi.entity").Reputasi[]>;
    getIndikator(id: number): Promise<import("./entities/reputasi.entity").Reputasi>;
    updateIndikator(id: number, updateDto: UpdateReputasiDto): Promise<import("./entities/reputasi.entity").Reputasi>;
    deleteIndikator(id: number): Promise<void>;
    getTotalWeighted(year: number, quarter: Quarter): Promise<{
        total: number;
    }>;
    getSectionsByPeriod(year: number, quarter: Quarter): Promise<import("./entities/reputasi-section.entity").ReputasiSection[]>;
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
    duplicateIndikator(id: number, year: number, quarter: Quarter): Promise<import("./entities/reputasi.entity").Reputasi>;
}
