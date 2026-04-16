import { Repository } from 'typeorm';
import { KPMRDefinition } from './entities/kpmr-investasi-definisi.entity';
import { KPMRScore } from './entities/kpmr-investasi-skor.entity';
import { KPMRAspect } from './entities/kpmr-investasi-aspek.entity';
import { KPMRQuestion } from './entities/kpmr-investasi-pertanyaan.entity';
import { CreateKPMRAspectDto, UpdateKPMRAspectDto, CreateKPMRQuestionDto, UpdateKPMRQuestionDto, CreateKPMRDefinitionDto, UpdateKPMRDefinitionDto, CreateKPMRScoreDto, UpdateKPMRScoreDto } from './dto/kpmr-investasi.dto';
export declare class KPMRService {
    private readonly definitionRepo;
    private readonly scoreRepo;
    private readonly aspectRepo;
    private readonly questionRepo;
    private readonly logger;
    constructor(definitionRepo: Repository<KPMRDefinition>, scoreRepo: Repository<KPMRScore>, aspectRepo: Repository<KPMRAspect>, questionRepo: Repository<KPMRQuestion>);
    private validateQuarter;
    validateDefinitionExists(definitionId: number): Promise<KPMRDefinition>;
    createAspect(createDto: CreateKPMRAspectDto): Promise<KPMRAspect>;
    findAllAspects(year?: number): Promise<KPMRAspect[]>;
    findAspectById(id: number): Promise<KPMRAspect>;
    updateAspect(id: number, updateDto: UpdateKPMRAspectDto): Promise<KPMRAspect>;
    deleteAspect(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createQuestion(createDto: CreateKPMRQuestionDto): Promise<KPMRQuestion>;
    findAllQuestions(year?: number): Promise<KPMRQuestion[]>;
    findQuestionsByAspect(aspekNo: string, year?: number): Promise<KPMRQuestion[]>;
    findQuestionById(id: number): Promise<KPMRQuestion>;
    updateQuestion(id: number, updateDto: UpdateKPMRQuestionDto): Promise<KPMRQuestion>;
    deleteQuestion(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createOrUpdateDefinition(createDto: CreateKPMRDefinitionDto, createdBy?: string): Promise<KPMRDefinition>;
    findAllDefinitions(): Promise<KPMRDefinition[]>;
    findDefinitionsByYear(year: number): Promise<KPMRDefinition[]>;
    findDefinitionById(id: number): Promise<KPMRDefinition>;
    updateDefinition(id: number, updateDto: UpdateKPMRDefinitionDto, updatedBy?: string): Promise<KPMRDefinition>;
    deleteDefinition(definitionId: number, year: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createOrUpdateScore(createDto: CreateKPMRScoreDto, createdBy?: string): Promise<KPMRScore>;
    findAllScores(): Promise<KPMRScore[]>;
    findScoresByPeriod(year: number, quarter?: string): Promise<KPMRScore[]>;
    findScoresByDefinition(definitionId: number): Promise<KPMRScore[]>;
    findScoreById(id: number): Promise<KPMRScore>;
    updateScore(id: number, updateDto: UpdateKPMRScoreDto, updatedBy?: string): Promise<KPMRScore>;
    deleteScore(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteScoreByTarget(definitionId: number, year: number, quarter: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getKPMRFullData(year: number): Promise<any>;
    searchKPMR(year?: number, query?: string, aspekNo?: string): Promise<KPMRDefinition[]>;
    getAvailableYears(): Promise<number[]>;
    getPeriods(): Promise<Array<{
        year: number;
        quarter: string;
    }>>;
}
