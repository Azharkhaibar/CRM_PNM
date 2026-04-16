import { Repository } from 'typeorm';
import { LikuiditasSection } from './entities/likuiditas-section.entity';
import { Likuiditas, Quarter } from './entities/likuiditas.entity';
import { CreateLikuiditasDto } from './dto/create-likuiditas.dto';
import { UpdateLikuiditasSectionDto } from './dto/update-likuiditas-section.dto';
import { UpdateLikuiditasDto } from './dto/update-likuiditas.dto';
import { CreateLikuiditasSectionDto } from './dto/create-likuiditas-section.dto';
export declare class LikuiditasService {
    private readonly likuiditasSectionRepository;
    private readonly likuiditasRepository;
    constructor(likuiditasSectionRepository: Repository<LikuiditasSection>, likuiditasRepository: Repository<Likuiditas>);
    createSection(createDto: CreateLikuiditasSectionDto, createdBy?: string): Promise<LikuiditasSection>;
    findAllSections(isActive?: boolean): Promise<LikuiditasSection[]>;
    findSectionById(id: number): Promise<LikuiditasSection>;
    findSectionsByPeriod(year: number, quarter: Quarter): Promise<LikuiditasSection[]>;
    updateSection(id: number, updateDto: UpdateLikuiditasSectionDto, updatedBy?: string): Promise<LikuiditasSection>;
    deleteSection(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createIndikator(createDto: CreateLikuiditasDto, createdBy?: string): Promise<Likuiditas>;
    findIndikatorsByPeriod(year: number, quarter: Quarter): Promise<Likuiditas[]>;
    findAllIndikators(): Promise<Likuiditas[]>;
    findIndikatorById(id: number): Promise<Likuiditas>;
    updateIndikator(id: number, updateDto: UpdateLikuiditasDto, updatedBy?: string): Promise<Likuiditas>;
    deleteIndikator(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    searchIndikators(query?: string, year?: number, quarter?: Quarter): Promise<Likuiditas[]>;
    getTotalWeightedByPeriod(year: number, quarter: Quarter): Promise<number>;
    getSectionsWithIndicatorsByPeriod(year: number, quarter: Quarter): Promise<any>;
    getPeriods(): Promise<Array<{
        year: number;
        quarter: Quarter;
    }>>;
    getIndikatorCountByPeriod(year: number, quarter: Quarter): Promise<number>;
    duplicateIndikatorToNewPeriod(sourceId: number, targetYear: number, targetQuarter: Quarter, createdBy?: string): Promise<Likuiditas>;
    private validateModeSpecificFields;
    private calculateWeighted;
}
