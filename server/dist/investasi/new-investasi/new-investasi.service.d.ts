import { Repository } from 'typeorm';
import { InvestasiSection } from './entities/new-investasi-section.entity';
import { Investasi, Quarter } from './entities/new-investasi.entity';
import { CreateInvestasiDto } from './dto/create-new-investasi.dto';
import { UpdateInvestasiSectionDto } from './dto/update-new-investasi-section.dto';
import { UpdateInvestasiDto } from './dto/update-new-investasi.dto';
import { CreateInvestasiSectionDto } from './dto/create-investasi-section.dto';
export declare class InvestasiService {
    private readonly investasiSectionRepository;
    private readonly investasiRepository;
    constructor(investasiSectionRepository: Repository<InvestasiSection>, investasiRepository: Repository<Investasi>);
    createSection(createDto: CreateInvestasiSectionDto, createdBy?: string): Promise<InvestasiSection>;
    findAllSections(isActive?: boolean): Promise<InvestasiSection[]>;
    findSectionById(id: number): Promise<InvestasiSection>;
    findSectionsByPeriod(year: number, quarter: Quarter): Promise<InvestasiSection[]>;
    updateSection(id: number, updateDto: UpdateInvestasiSectionDto, updatedBy?: string): Promise<InvestasiSection>;
    deleteSection(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createIndikator(createDto: CreateInvestasiDto, createdBy?: string): Promise<Investasi>;
    findIndikatorsByPeriod(year: number, quarter: Quarter): Promise<Investasi[]>;
    findAllIndikators(): Promise<Investasi[]>;
    findIndikatorById(id: number): Promise<Investasi>;
    updateIndikator(id: number, updateDto: UpdateInvestasiDto, updatedBy?: string): Promise<Investasi>;
    deleteIndikator(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    searchIndikators(query?: string, year?: number, quarter?: Quarter): Promise<Investasi[]>;
    getTotalWeightedByPeriod(year: number, quarter: Quarter): Promise<number>;
    private validateModeSpecificFields;
    private calculateWeighted;
    duplicateIndikatorToNewPeriod(sourceId: number, targetYear: number, targetQuarter: Quarter, createdBy?: string): Promise<Investasi>;
    getIndikatorCountByPeriod(year: number, quarter: Quarter): Promise<number>;
    getSectionsWithIndicatorsByPeriod(year: number, quarter: Quarter): Promise<any>;
    getPeriods(): Promise<Array<{
        year: number;
        quarter: Quarter;
    }>>;
}
