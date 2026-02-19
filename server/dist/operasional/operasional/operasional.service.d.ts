import { Repository } from 'typeorm';
import { OperasionalSection, Quarter } from './entities/operasional-section.entity';
import { Operasional } from './entities/operasional.entity';
import { CreateOperasionalSectionDto } from './dto/create-operasional-section.dto';
import { UpdateOperasionalSectionDto } from './dto/update-operasional-section.dto';
import { CreateOperasionalDto } from './dto/create-operasional.dto';
import { UpdateOperasionalDto } from './dto/update-operasional.dto';
export declare class OperasionalService {
    private readonly operasionalSectionRepository;
    private readonly operasionalRepository;
    constructor(operasionalSectionRepository: Repository<OperasionalSection>, operasionalRepository: Repository<Operasional>);
    createSection(createDto: CreateOperasionalSectionDto, createdBy?: string): Promise<OperasionalSection>;
    findAllSections(isActive?: boolean): Promise<OperasionalSection[]>;
    findSectionById(id: number): Promise<OperasionalSection>;
    findSectionsByPeriod(year: number, quarter: Quarter): Promise<OperasionalSection[]>;
    updateSection(id: number, updateDto: UpdateOperasionalSectionDto, updatedBy?: string): Promise<OperasionalSection>;
    deleteSection(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createIndikator(createDto: CreateOperasionalDto, createdBy?: string): Promise<Operasional>;
    findIndikatorsByPeriod(year: number, quarter: Quarter): Promise<Operasional[]>;
    findAllIndikators(): Promise<Operasional[]>;
    findIndikatorById(id: number): Promise<Operasional>;
    updateIndikator(id: number, updateDto: UpdateOperasionalDto, updatedBy?: string): Promise<Operasional>;
    deleteIndikator(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    searchIndikators(query?: string, year?: number, quarter?: Quarter): Promise<Operasional[]>;
    getTotalWeightedByPeriod(year: number, quarter: Quarter): Promise<number>;
    private validateModeSpecificFields;
    private calculateWeighted;
    duplicateIndikatorToNewPeriod(sourceId: number, targetYear: number, targetQuarter: Quarter, createdBy?: string): Promise<Operasional>;
    getIndikatorCountByPeriod(year: number, quarter: Quarter): Promise<number>;
    getSectionsWithIndicatorsByPeriod(year: number, quarter: Quarter): Promise<any>;
    getPeriods(): Promise<Array<{
        year: number;
        quarter: Quarter;
    }>>;
}
