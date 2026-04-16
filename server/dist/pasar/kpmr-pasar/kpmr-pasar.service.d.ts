import { Repository } from 'typeorm';
import { KPMRPasarDefinition } from './entities/kpmr-pasar-definisi.entity';
import { KPMRPasarScore } from './entities/kpmr-pasar-skor.entity';
import { KPMRPasarAspect } from './entities/kpmr-pasar-aspek.entity';
import { KPMRPasarQuestion } from './entities/kpmr-pasar-pertanyaan.entity';
import { CreateKPMRPasarAspectDto, UpdateKPMRPasarAspectDto, CreateKPMRPasarQuestionDto, UpdateKPMRPasarQuestionDto, CreateKPMRPasarDefinitionDto, UpdateKPMRPasarDefinitionDto, CreateKPMRPasarScoreDto, UpdateKPMRPasarScoreDto } from './dto/kpmr-pasar.dto';
export declare class KPMRPasarService {
    private readonly definitionRepo;
    private readonly scoreRepo;
    private readonly aspectRepo;
    private readonly questionRepo;
    private readonly logger;
    constructor(definitionRepo: Repository<KPMRPasarDefinition>, scoreRepo: Repository<KPMRPasarScore>, aspectRepo: Repository<KPMRPasarAspect>, questionRepo: Repository<KPMRPasarQuestion>);
    private validateQuarter;
    validateDefinitionExists(definitionId: number): Promise<KPMRPasarDefinition>;
    createAspect(createDto: CreateKPMRPasarAspectDto): Promise<KPMRPasarAspect>;
    findAllAspects(year?: number): Promise<KPMRPasarAspect[]>;
    findAspectById(id: number): Promise<KPMRPasarAspect>;
    updateAspect(id: number, updateDto: UpdateKPMRPasarAspectDto): Promise<KPMRPasarAspect>;
    deleteAspect(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createQuestion(createDto: CreateKPMRPasarQuestionDto): Promise<KPMRPasarQuestion>;
    findAllQuestions(year?: number): Promise<KPMRPasarQuestion[]>;
    findQuestionsByAspect(aspekNo: string, year?: number): Promise<KPMRPasarQuestion[]>;
    findQuestionById(id: number): Promise<KPMRPasarQuestion>;
    updateQuestion(id: number, updateDto: UpdateKPMRPasarQuestionDto): Promise<KPMRPasarQuestion>;
    deleteQuestion(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createOrUpdateDefinition(createDto: CreateKPMRPasarDefinitionDto, createdBy?: string): Promise<KPMRPasarDefinition>;
    findAllDefinitions(): Promise<KPMRPasarDefinition[]>;
    findDefinitionsByYear(year: number): Promise<KPMRPasarDefinition[]>;
    findDefinitionById(id: number): Promise<KPMRPasarDefinition>;
    updateDefinition(id: number, updateDto: UpdateKPMRPasarDefinitionDto, updatedBy?: string): Promise<KPMRPasarDefinition>;
    deleteDefinition(definitionId: number, year: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createOrUpdateScore(createDto: CreateKPMRPasarScoreDto, createdBy?: string): Promise<KPMRPasarScore>;
    findAllScores(): Promise<KPMRPasarScore[]>;
    findScoresByPeriod(year: number, quarter?: string): Promise<KPMRPasarScore[]>;
    findScoresByDefinition(definitionId: number): Promise<KPMRPasarScore[]>;
    findScoreById(id: number): Promise<KPMRPasarScore>;
    updateScore(id: number, updateDto: UpdateKPMRPasarScoreDto, updatedBy?: string): Promise<KPMRPasarScore>;
    deleteScore(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteScoreByTarget(definitionId: number, year: number, quarter: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getKPMRFullData(year: number): Promise<any>;
    searchKPMR(year?: number, query?: string, aspekNo?: string): Promise<KPMRPasarDefinition[]>;
    getAvailableYears(): Promise<number[]>;
    getPeriods(): Promise<Array<{
        year: number;
        quarter: string;
    }>>;
}
