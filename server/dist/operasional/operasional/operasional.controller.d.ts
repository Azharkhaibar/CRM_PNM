import { OperasionalService } from './operasional.service';
import { UpdateOperasionalSectionDto } from './dto/update-operasional-section.dto';
import { CreateOperasionalSectionDto } from './dto/create-operasional-section.dto';
import { CreateOperasionalDto } from './dto/create-operasional.dto';
import { UpdateOperasionalDto } from './dto/update-operasional.dto';
import { Quarter } from './entities/operasional-section.entity';
export declare class OperasionalController {
    private readonly operasionalService;
    constructor(operasionalService: OperasionalService);
    createSection(createDto: CreateOperasionalSectionDto): Promise<import("./entities/operasional-section.entity").OperasionalSection>;
    getSections(isActive?: boolean): Promise<import("./entities/operasional-section.entity").OperasionalSection[]>;
    getSection(id: number): Promise<import("./entities/operasional-section.entity").OperasionalSection>;
    updateSection(id: number, updateDto: UpdateOperasionalSectionDto): Promise<import("./entities/operasional-section.entity").OperasionalSection>;
    deleteSection(id: number): Promise<void>;
    getSectionsWithIndicatorsByPeriod(year: number, quarter: Quarter): Promise<any>;
    createIndikator(createDto: CreateOperasionalDto): Promise<import("./entities/operasional.entity").Operasional>;
    getAllIndikators(): Promise<import("./entities/operasional.entity").Operasional[]>;
    getIndikatorsByPeriod(year: number, quarter: Quarter): Promise<import("./entities/operasional.entity").Operasional[]>;
    searchIndikators(query?: string, year?: number, quarter?: Quarter): Promise<import("./entities/operasional.entity").Operasional[]>;
    getIndikator(id: number): Promise<import("./entities/operasional.entity").Operasional>;
    updateIndikator(id: number, updateDto: UpdateOperasionalDto): Promise<import("./entities/operasional.entity").Operasional>;
    deleteIndikator(id: number): Promise<void>;
    getTotalWeighted(year: number, quarter: Quarter): Promise<{
        total: number;
    }>;
    getSectionsByPeriod(year: number, quarter: Quarter): Promise<import("./entities/operasional-section.entity").OperasionalSection[]>;
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
    duplicateIndikator(id: number, year: number, quarter: Quarter): Promise<import("./entities/operasional.entity").Operasional>;
}
