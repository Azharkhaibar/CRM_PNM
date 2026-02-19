import { InvestasiService } from './new-investasi.service';
import { CreateStrategikSectionDto } from 'src/stratejik/stratejik/dto/create-stratejik-section.dto';
import { UpdateStrategikSectionDto } from 'src/stratejik/stratejik/dto/update-stratejik-section.dto';
import { Quarter } from './entities/new-investasi.entity';
import { CreateStrategikDto } from 'src/stratejik/stratejik/dto/create-stratejik.dto';
import { UpdateStrategikDto } from 'src/stratejik/stratejik/dto/update-stratejik.dto';
export declare class InvestasiController {
    private readonly investasiService;
    constructor(investasiService: InvestasiService);
    createSection(createDto: CreateStrategikSectionDto): Promise<import("./entities/new-investasi-section.entity").InvestasiSection>;
    getSections(isActive?: boolean): Promise<import("./entities/new-investasi-section.entity").InvestasiSection[]>;
    getSection(id: number): Promise<import("./entities/new-investasi-section.entity").InvestasiSection>;
    updateSection(id: number, updateDto: UpdateStrategikSectionDto): Promise<import("./entities/new-investasi-section.entity").InvestasiSection>;
    deleteSection(id: number): Promise<void>;
    getSectionsWithIndicatorsByPeriod(year: number, quarter: Quarter): Promise<any>;
    createIndikator(createDto: CreateStrategikDto): Promise<import("./entities/new-investasi.entity").Investasi>;
    getAllIndikators(): Promise<import("./entities/new-investasi.entity").Investasi[]>;
    getIndikatorsByPeriod(year: number, quarter: Quarter): Promise<import("./entities/new-investasi.entity").Investasi[]>;
    searchIndikators(query?: string, year?: number, quarter?: Quarter): Promise<import("./entities/new-investasi.entity").Investasi[]>;
    getIndikator(id: number): Promise<import("./entities/new-investasi.entity").Investasi>;
    updateIndikator(id: number, updateDto: UpdateStrategikDto): Promise<import("./entities/new-investasi.entity").Investasi>;
    deleteIndikator(id: number): Promise<void>;
    getTotalWeighted(year: number, quarter: Quarter): Promise<{
        total: number;
    }>;
    getSectionsByPeriod(year: number, quarter: Quarter): Promise<import("./entities/new-investasi-section.entity").InvestasiSection[]>;
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
    duplicateIndikator(id: number, year: number, quarter: Quarter): Promise<import("./entities/new-investasi.entity").Investasi>;
}
