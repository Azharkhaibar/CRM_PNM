import { CreateHukumDto } from './dto/create-hukum.dto';
import { UpdateHukumDto } from './dto/update-hukum.dto';
import { Repository } from 'typeorm';
import { Hukum, Quarter } from './entities/hukum.entity';
import { HukumSection } from './entities/hukum-section.entity';
import { CreateHukumSectionDto } from './dto/create-hukum-section.dto';
import { UpdateHukumSectionDto } from './dto/update-hukum-section.dto';
export declare class HukumService {
    private hukumRepo;
    private sectionRepo;
    constructor(hukumRepo: Repository<Hukum>, sectionRepo: Repository<HukumSection>);
    private validateModeSpecificFields;
    private calculateWeighted;
    duplicateIndikatorToNewPeriod(sourceId: number, targetYear: number, targetQuarter: Quarter, createdBy?: string): Promise<Hukum>;
    createSection(createDto: CreateHukumSectionDto, createdBy?: string): Promise<HukumSection>;
    findAllSections(isActive?: boolean): Promise<HukumSection[]>;
    findSectionById(id: number): Promise<HukumSection>;
    findSectionsByPeriod(year: number, quarter: Quarter): Promise<HukumSection[]>;
    updateSection(id: number, updateDto: UpdateHukumSectionDto, updatedBy?: string): Promise<HukumSection>;
    deleteSection(id: number): Promise<void>;
    findIndikatorsByPeriod(year: number, quarter: Quarter): Promise<Hukum[]>;
    findAllIndikators(): Promise<Hukum[]>;
    findIndikatorById(id: number): Promise<Hukum>;
    findByYear(year: number): Promise<Hukum[]>;
    private calculateHasil;
    createIndikator(createDto: CreateHukumDto, createdBy?: string): Promise<Hukum>;
    updateIndikator(id: number, updateDto: UpdateHukumDto, updatedBy?: string): Promise<Hukum>;
    deleteIndikator(id: number): Promise<void>;
    searchIndikators(query?: string, year?: number, quarter?: Quarter): Promise<Hukum[]>;
    getTotalWeightedByPeriod(year: number, quarter: Quarter): Promise<number>;
    getIndikatorCountByPeriod(year: number, quarter: Quarter): Promise<number>;
    getSectionsWithIndicatorsByPeriod(year: number, quarter: Quarter): Promise<any>;
    deleteByPeriod(year: number, quarter: Quarter): Promise<number>;
    getPeriods(): Promise<Array<{
        year: number;
        quarter: Quarter;
    }>>;
}
