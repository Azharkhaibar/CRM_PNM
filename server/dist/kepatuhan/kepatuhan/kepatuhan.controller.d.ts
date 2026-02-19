import { KepatuhanService } from './kepatuhan.service';
import { CreateKepatuhanSectionDto } from './dto/create-kepatuhan-section.dto';
import { UpdateKepatuhanSectionDto } from './dto/update-kepatuhan-section.dto';
import { CreateKepatuhanDto } from './dto/create-kepatuhan.dto';
import { UpdateKepatuhanDto } from './dto/update-kepatuhan.dto';
import { Quarter } from './entities/kepatuhan.entity';
export declare class KepatuhanController {
    private readonly kepatuhanService;
    constructor(kepatuhanService: KepatuhanService);
    createSection(createDto: CreateKepatuhanSectionDto): Promise<import("./entities/kepatuhan-section.entity").KepatuhanSection>;
    getSections(isActive?: boolean): Promise<import("./entities/kepatuhan-section.entity").KepatuhanSection[]>;
    getSection(id: number): Promise<import("./entities/kepatuhan-section.entity").KepatuhanSection>;
    updateSection(id: number, updateDto: UpdateKepatuhanSectionDto): Promise<import("./entities/kepatuhan-section.entity").KepatuhanSection>;
    deleteSection(id: number): Promise<void>;
    getSectionsWithIndicatorsByPeriod(year: number, quarter: Quarter): Promise<any>;
    createIndikator(createDto: CreateKepatuhanDto): Promise<import("./entities/kepatuhan.entity").Kepatuhan>;
    getAllIndikators(): Promise<import("./entities/kepatuhan.entity").Kepatuhan[]>;
    getIndikatorsByPeriod(year: number, quarter: Quarter): Promise<import("./entities/kepatuhan.entity").Kepatuhan[]>;
    searchIndikators(query?: string, year?: number, quarter?: Quarter): Promise<import("./entities/kepatuhan.entity").Kepatuhan[]>;
    getIndikator(id: number): Promise<import("./entities/kepatuhan.entity").Kepatuhan>;
    updateIndikator(id: number, updateDto: UpdateKepatuhanDto): Promise<import("./entities/kepatuhan.entity").Kepatuhan>;
    deleteIndikator(id: number): Promise<void>;
    getTotalWeighted(year: number, quarter: Quarter): Promise<{
        total: number;
    }>;
    getSectionsByPeriod(year: number, quarter: Quarter): Promise<import("./entities/kepatuhan-section.entity").KepatuhanSection[]>;
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
    duplicateIndikator(id: number, year: number, quarter: Quarter): Promise<import("./entities/kepatuhan.entity").Kepatuhan>;
}
