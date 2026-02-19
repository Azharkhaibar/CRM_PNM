import { LikuiditasSection } from './entities/section-likuiditas.entity';
import { Repository } from 'typeorm';
import { Likuiditas, Quarter } from './entities/likuiditas.entity';
import { CreateLikuiditasSectionDto } from './dto/create-likuiditas-section.dto';
import { UpdateLikuiditasSectionDto } from './dto/update-likuiditas-section.dto';
import { CreateLikuiditasDto } from './dto/create-likuiditas.dto';
import { UpdateLikuiditasDto } from './dto/update-likuiditas.dto';
export declare class LikuiditasService {
    private readonly likuiditasSectionRepository;
    private readonly likuiditasRepository;
    constructor(likuiditasSectionRepository: Repository<LikuiditasSection>, likuiditasRepository: Repository<Likuiditas>);
    createSection(createDto: CreateLikuiditasSectionDto, createdBy?: string): Promise<LikuiditasSection>;
    findAllSections(isActive?: boolean): Promise<LikuiditasSection[]>;
    findSectionById(id: number): Promise<LikuiditasSection>;
    findSectionsByPeriod(year: number, quarter: Quarter): Promise<LikuiditasSection[]>;
    updateSection(id: number, updateDto: UpdateLikuiditasSectionDto, updatedBy?: string): Promise<LikuiditasSection>;
    deleteSection(id: number): Promise<void>;
    createIndikator(createDto: CreateLikuiditasDto, createdBy?: string): Promise<Likuiditas>;
    findIndikatorsByPeriod(year: number, quarter: Quarter): Promise<Likuiditas[]>;
    findAllIndikators(): Promise<Likuiditas[]>;
    findIndikatorById(id: number): Promise<Likuiditas>;
    updateIndikator(id: number, updateDto: UpdateLikuiditasDto, updatedBy?: string): Promise<Likuiditas>;
    deleteIndikator(id: number): Promise<void>;
    searchIndikators(query?: string, year?: number, quarter?: Quarter): Promise<Likuiditas[]>;
    getTotalWeightedByPeriod(year: number, quarter: Quarter): Promise<number>;
    private validateModeSpecificFields;
    private calculateWeighted;
    duplicateIndikatorToNewPeriod(sourceId: number, targetYear: number, targetQuarter: Quarter, createdBy?: string): Promise<Likuiditas>;
    getIndikatorCountByPeriod(year: number, quarter: Quarter): Promise<number>;
    getSectionsWithIndicatorsByPeriod(year: number, quarter: Quarter): Promise<any>;
    getPeriods(): Promise<Array<{
        year: number;
        quarter: Quarter;
    }>>;
}
