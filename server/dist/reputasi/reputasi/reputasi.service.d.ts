import { Repository } from 'typeorm';
import { ReputasiSection } from './entities/reputasi-section.entity';
import { Reputasi, Quarter } from './entities/reputasi.entity';
import { CreateReputasiSectionDto } from './dto/create-reputasi-section.dto';
import { UpdateReputasiSectionDto } from './dto/update-reputasi-section.dto';
import { CreateReputasiDto } from './dto/create-reputasi.dto';
import { UpdateReputasiDto } from './dto/update-reputasi.dto';
export declare class ReputasiService {
    private readonly reputasiSectionRepository;
    private readonly reputasiRepository;
    constructor(reputasiSectionRepository: Repository<ReputasiSection>, reputasiRepository: Repository<Reputasi>);
    createSection(createDto: CreateReputasiSectionDto, createdBy?: string): Promise<ReputasiSection>;
    findAllSections(isActive?: boolean): Promise<ReputasiSection[]>;
    findSectionById(id: number): Promise<ReputasiSection>;
    findSectionsByPeriod(year: number, quarter: Quarter): Promise<ReputasiSection[]>;
    updateSection(id: number, updateDto: UpdateReputasiSectionDto, updatedBy?: string): Promise<ReputasiSection>;
    deleteSection(id: number): Promise<void>;
    createIndikator(createDto: CreateReputasiDto, createdBy?: string): Promise<Reputasi>;
    findIndikatorsByPeriod(year: number, quarter: Quarter): Promise<Reputasi[]>;
    findAllIndikators(): Promise<Reputasi[]>;
    findIndikatorById(id: number): Promise<Reputasi>;
    updateIndikator(id: number, updateDto: UpdateReputasiDto, updatedBy?: string): Promise<Reputasi>;
    deleteIndikator(id: number): Promise<void>;
    searchIndikators(query?: string, year?: number, quarter?: Quarter): Promise<Reputasi[]>;
    getTotalWeightedByPeriod(year: number, quarter: Quarter): Promise<number>;
    private validateModeSpecificFields;
    private calculateWeighted;
    duplicateIndikatorToNewPeriod(sourceId: number, targetYear: number, targetQuarter: Quarter, createdBy?: string): Promise<Reputasi>;
    getIndikatorCountByPeriod(year: number, quarter: Quarter): Promise<number>;
    getSectionsWithIndicatorsByPeriod(year: number, quarter: Quarter): Promise<any>;
    getPeriods(): Promise<Array<{
        year: number;
        quarter: Quarter;
    }>>;
}
