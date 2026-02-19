import { Repository } from 'typeorm';
import { PasarSection } from './entities/section.entity';
import { Pasar, Quarter } from './entities/indikator.entity';
import { CreatePasarSectionDto } from './dto/create-pasar-section.dto';
import { UpdatePasarSectionDto } from './dto/update-pasar-section.dto';
import { CreatePasarDto } from './dto/create-pasar-indikator.dto';
import { UpdatePasarDto } from './dto/update-pasar.dto';
export declare class PasarService {
    private readonly pasarSectionRepository;
    private readonly pasarRepository;
    constructor(pasarSectionRepository: Repository<PasarSection>, pasarRepository: Repository<Pasar>);
    createSection(createDto: CreatePasarSectionDto, createdBy?: string): Promise<PasarSection>;
    findAllSections(isActive?: boolean): Promise<PasarSection[]>;
    findSectionById(id: number): Promise<PasarSection>;
    findSectionsByPeriod(year: number, quarter: Quarter): Promise<PasarSection[]>;
    updateSection(id: number, updateDto: UpdatePasarSectionDto, updatedBy?: string): Promise<PasarSection>;
    deleteSection(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createIndikator(createDto: CreatePasarDto, createdBy?: string): Promise<Pasar>;
    findIndikatorsByPeriod(year: number, quarter: Quarter): Promise<Pasar[]>;
    findAllIndikators(): Promise<Pasar[]>;
    findIndikatorById(id: number): Promise<Pasar>;
    updateIndikator(id: number, updateDto: UpdatePasarDto, updatedBy?: string): Promise<Pasar>;
    deleteIndikator(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    searchIndikators(query?: string, year?: number, quarter?: Quarter): Promise<Pasar[]>;
    getTotalWeightedByPeriod(year: number, quarter: Quarter): Promise<number>;
    private validateModeSpecificFields;
    private calculateWeighted;
    duplicateIndikatorToNewPeriod(sourceId: number, targetYear: number, targetQuarter: Quarter, createdBy?: string): Promise<Pasar>;
    getIndikatorCountByPeriod(year: number, quarter: Quarter): Promise<number>;
    getSectionsWithIndicatorsByPeriod(year: number, quarter: Quarter): Promise<any>;
    getPeriods(): Promise<Array<{
        year: number;
        quarter: Quarter;
    }>>;
}
