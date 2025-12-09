import { OperationalService } from './operasional.service';
import { CreateSectionOperationalDto, CreateIndikatorOperationalDto } from './dto/create-operasional.dto';
import { UpdateSectionOperationalDto, UpdateIndikatorOperationalDto } from './dto/update-operasional.dto';
import { Quarter } from './entities/operasional.entity';
export declare class OperasionalController {
    private readonly operationalService;
    constructor(operationalService: OperationalService);
    createSection(createSectionDto: CreateSectionOperationalDto): Promise<import("./entities/operasional-section.entity").SectionOperational>;
    updateSection(id: string, updateSectionDto: UpdateSectionOperationalDto): Promise<import("./entities/operasional-section.entity").SectionOperational>;
    deleteSection(id: string): Promise<void>;
    getSectionsByPeriod(year: number, quarter: Quarter): Promise<{
        indikators: import("./entities/operasional.entity").Operational[];
        id: number;
        year: number;
        quarter: Quarter;
        no: string;
        bobotSection: number;
        parameter: string;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        deletedAt: Date | null;
    }[]>;
    getSectionById(id: string): Promise<import("./entities/operasional-section.entity").SectionOperational>;
    createIndikator(createIndikatorDto: CreateIndikatorOperationalDto): Promise<import("./entities/operasional.entity").Operational>;
    updateIndikator(id: string, updateIndikatorDto: UpdateIndikatorOperationalDto): Promise<import("./entities/operasional.entity").Operational>;
    deleteIndikator(id: string): Promise<void>;
    getIndikatorById(id: string): Promise<import("./entities/operasional.entity").Operational>;
    getSummaryByPeriod(year: number, quarter: Quarter): Promise<{
        year: number;
        quarter: Quarter;
        totalWeighted: number;
        sectionCount: number;
        sections: {
            sectionId: number;
            sectionNo: string;
            sectionName: string;
            bobotSection: number;
            totalWeighted: number;
            indicatorCount: number;
        }[];
    }>;
}
