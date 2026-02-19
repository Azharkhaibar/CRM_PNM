import { Repository } from 'typeorm';
import { StrategikSection } from './entities/stratejik-section.entity';
import { Strategik, Quarter } from './entities/stratejik.entity';
import { CreateStrategikSectionDto } from './dto/create-stratejik-section.dto';
import { UpdateStrategikSectionDto } from './dto/update-stratejik-section.dto';
import { CreateStrategikDto } from './dto/create-stratejik.dto';
import { UpdateStrategikDto } from './dto/update-stratejik.dto';
export declare class StrategikService {
    private readonly strategikSectionRepository;
    private readonly strategikRepository;
    constructor(strategikSectionRepository: Repository<StrategikSection>, strategikRepository: Repository<Strategik>);
    createSection(createDto: CreateStrategikSectionDto, createdBy?: string): Promise<StrategikSection>;
    findAllSections(isActive?: boolean): Promise<StrategikSection[]>;
    findSectionById(id: number): Promise<StrategikSection>;
    findSectionsByPeriod(year: number, quarter: Quarter): Promise<StrategikSection[]>;
    updateSection(id: number, updateDto: UpdateStrategikSectionDto, updatedBy?: string): Promise<StrategikSection>;
    deleteSection(id: number): Promise<void>;
    createIndikator(createDto: CreateStrategikDto, createdBy?: string): Promise<Strategik>;
    findIndikatorsByPeriod(year: number, quarter: Quarter): Promise<Strategik[]>;
    findAllIndikators(): Promise<Strategik[]>;
    findIndikatorById(id: number): Promise<Strategik>;
    updateIndikator(id: number, updateDto: UpdateStrategikDto, updatedBy?: string): Promise<Strategik>;
    deleteIndikator(id: number): Promise<void>;
    searchIndikators(query?: string, year?: number, quarter?: Quarter): Promise<Strategik[]>;
    getTotalWeightedByPeriod(year: number, quarter: Quarter): Promise<number>;
    private validateModeSpecificFields;
    private calculateWeighted;
    duplicateIndikatorToNewPeriod(sourceId: number, targetYear: number, targetQuarter: Quarter, createdBy?: string): Promise<Strategik>;
    getIndikatorCountByPeriod(year: number, quarter: Quarter): Promise<number>;
    getSectionsWithIndicatorsByPeriod(year: number, quarter: Quarter): Promise<any>;
    getPeriods(): Promise<Array<{
        year: number;
        quarter: Quarter;
    }>>;
}
