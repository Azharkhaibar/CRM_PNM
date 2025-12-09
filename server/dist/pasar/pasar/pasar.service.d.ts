import { CreateSectionDto } from './dto/create-pasar-section.dto';
import { UpdatePasarSectionDto } from './dto/update-pasar-section.dto';
import { CreateIndikatorDto } from './dto/create-pasar-indikator.dto';
import { UpdateIndikatorDto } from './dto/update-pasar.dto';
import { Repository } from 'typeorm';
import { SectionPasar } from './entities/section.entity';
import { IndikatorPasar } from './entities/indikator.entity';
export declare class PasarService {
    private sectionRepository;
    private indikatorRepository;
    private readonly logger;
    constructor(sectionRepository: Repository<SectionPasar>, indikatorRepository: Repository<IndikatorPasar>);
    getSections(): Promise<SectionPasar[]>;
    getSectionsByPeriod(tahun: number, triwulan: string): Promise<SectionPasar[]>;
    getSectionById(id: number): Promise<SectionPasar>;
    createSection(data: CreateSectionDto): Promise<SectionPasar>;
    updateSection(id: number, data: UpdatePasarSectionDto): Promise<SectionPasar>;
    deleteSection(id: number): Promise<void>;
    getAllIndikators(): Promise<IndikatorPasar[]>;
    getIndikatorsBySection(sectionId: number): Promise<IndikatorPasar[]>;
    getIndikatorById(id: number): Promise<IndikatorPasar>;
    createIndikator(data: any): Promise<IndikatorPasar>;
    updateIndikator(id: number, data: UpdateIndikatorDto): Promise<IndikatorPasar>;
    deleteIndikator(id: number): Promise<void>;
    getOverallSummary(tahun: number, triwulan: string): Promise<any>;
    private updateSectionTotalWeighted;
    private calculateHasil;
    private calculateWeighted;
    private determineOverallRiskLevel;
    searchIndikators(query: string): Promise<IndikatorPasar[]>;
    getAvailablePeriods(): Promise<{
        year: number;
        quarter: string;
    }[]>;
    createSectionWithIndikators(section: CreateSectionDto, indikators: CreateIndikatorDto[]): Promise<SectionPasar>;
}
