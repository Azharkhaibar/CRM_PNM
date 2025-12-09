import { Repository } from 'typeorm';
import { Operational, Quarter } from './entities/operasional.entity';
import { SectionOperational } from './entities/operasional-section.entity';
import { CreateSectionOperationalDto, CreateIndikatorOperationalDto } from './dto/create-operasional.dto';
import { UpdateSectionOperationalDto, UpdateIndikatorOperationalDto } from './dto/update-operasional.dto';
export declare class OperationalService {
    private readonly operationalRepository;
    private readonly sectionRepository;
    constructor(operationalRepository: Repository<Operational>, sectionRepository: Repository<SectionOperational>);
    createSection(createSectionDto: CreateSectionOperationalDto): Promise<SectionOperational>;
    updateSection(id: number, updateSectionDto: UpdateSectionOperationalDto): Promise<SectionOperational>;
    deleteSection(id: number): Promise<void>;
    getSectionsByPeriod(year: number, quarter: Quarter): Promise<{
        indikators: Operational[];
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
    createIndikator(createIndikatorDto: CreateIndikatorOperationalDto): Promise<Operational>;
    updateIndikator(id: number, updateIndikatorDto: UpdateIndikatorOperationalDto): Promise<Operational>;
    deleteIndikator(id: number): Promise<void>;
    private calculateHasil;
    private calculateWeighted;
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
    getIndikatorById(id: number): Promise<Operational>;
    getSectionById(id: number): Promise<SectionOperational>;
}
