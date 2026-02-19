import { Repository } from 'typeorm';
import { KepatuhanSection } from './entities/kepatuhan-section.entity';
import { Kepatuhan, Quarter } from './entities/kepatuhan.entity';
import { CreateKepatuhanSectionDto } from './dto/create-kepatuhan-section.dto';
import { UpdateKepatuhanSectionDto } from './dto/update-kepatuhan-section.dto';
import { CreateKepatuhanDto } from './dto/create-kepatuhan.dto';
import { UpdateKepatuhanDto } from './dto/update-kepatuhan.dto';
export declare class KepatuhanService {
    private readonly kepatuhanSectionRepository;
    private readonly kepatuhanRepository;
    constructor(kepatuhanSectionRepository: Repository<KepatuhanSection>, kepatuhanRepository: Repository<Kepatuhan>);
    createSection(createDto: CreateKepatuhanSectionDto, createdBy?: string): Promise<KepatuhanSection>;
    findAllSections(isActive?: boolean): Promise<KepatuhanSection[]>;
    findSectionById(id: number): Promise<KepatuhanSection>;
    findSectionsByPeriod(year: number, quarter: Quarter): Promise<KepatuhanSection[]>;
    updateSection(id: number, updateDto: UpdateKepatuhanSectionDto, updatedBy?: string): Promise<KepatuhanSection>;
    deleteSection(id: number): Promise<void>;
    createIndikator(createDto: CreateKepatuhanDto, createdBy?: string): Promise<Kepatuhan>;
    findIndikatorsByPeriod(year: number, quarter: Quarter): Promise<Kepatuhan[]>;
    findAllIndikators(): Promise<Kepatuhan[]>;
    findIndikatorById(id: number): Promise<Kepatuhan>;
    updateIndikator(id: number, updateDto: UpdateKepatuhanDto, updatedBy?: string): Promise<Kepatuhan>;
    deleteIndikator(id: number): Promise<void>;
    searchIndikators(query?: string, year?: number, quarter?: Quarter): Promise<Kepatuhan[]>;
    getTotalWeightedByPeriod(year: number, quarter: Quarter): Promise<number>;
    private validateModeSpecificFields;
    private calculateWeighted;
    duplicateIndikatorToNewPeriod(sourceId: number, targetYear: number, targetQuarter: Quarter, createdBy?: string): Promise<Kepatuhan>;
    getIndikatorCountByPeriod(year: number, quarter: Quarter): Promise<number>;
    getSectionsWithIndicatorsByPeriod(year: number, quarter: Quarter): Promise<any>;
    getPeriods(): Promise<Array<{
        year: number;
        quarter: Quarter;
    }>>;
}
