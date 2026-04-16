import { Repository } from 'typeorm';
import { KPMRLikuiditasDefinition } from './entities/kpmr-likuiditas-definisi.entity';
import { KPMRLikuiditasScore } from './entities/kpmr-likuiditas-skor.entity';
import { KPMRLikuiditasAspect } from './entities/kpmr-likuiditas-aspek.entity';
import { KPMRLikuiditasQuestion } from './entities/kpmr-likuiditas-pertanyaan.entity';
import { CreateKPMRLikuiditasAspectDto, UpdateKPMRLikuiditasAspectDto, CreateKPMRLikuiditasQuestionDto, UpdateKPMRLikuiditasQuestionDto, CreateKPMRLikuiditasDefinitionDto, UpdateKPMRLikuiditasDefinitionDto, CreateKPMRLikuiditasScoreDto, UpdateKPMRLikuiditasScoreDto } from './dto/kpmr-likuiditas.dto';
export declare class KPMRLikuiditasService {
    private readonly definitionRepo;
    private readonly scoreRepo;
    private readonly aspectRepo;
    private readonly questionRepo;
    private readonly logger;
    constructor(definitionRepo: Repository<KPMRLikuiditasDefinition>, scoreRepo: Repository<KPMRLikuiditasScore>, aspectRepo: Repository<KPMRLikuiditasAspect>, questionRepo: Repository<KPMRLikuiditasQuestion>);
    private validateQuarter;
    validateDefinitionExists(definitionId: number): Promise<KPMRLikuiditasDefinition>;
    createAspect(createDto: CreateKPMRLikuiditasAspectDto): Promise<KPMRLikuiditasAspect>;
    findAllAspects(year?: number): Promise<KPMRLikuiditasAspect[]>;
    findAspectById(id: number): Promise<KPMRLikuiditasAspect>;
    updateAspect(id: number, updateDto: UpdateKPMRLikuiditasAspectDto): Promise<KPMRLikuiditasAspect>;
    deleteAspect(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createQuestion(createDto: CreateKPMRLikuiditasQuestionDto): Promise<KPMRLikuiditasQuestion>;
    findAllQuestions(year?: number): Promise<KPMRLikuiditasQuestion[]>;
    findQuestionsByAspect(aspekNo: string, year?: number): Promise<KPMRLikuiditasQuestion[]>;
    findQuestionById(id: number): Promise<KPMRLikuiditasQuestion>;
    updateQuestion(id: number, updateDto: UpdateKPMRLikuiditasQuestionDto): Promise<KPMRLikuiditasQuestion>;
    deleteQuestion(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createOrUpdateDefinition(createDto: CreateKPMRLikuiditasDefinitionDto, createdBy?: string): Promise<KPMRLikuiditasDefinition>;
    findAllDefinitions(): Promise<KPMRLikuiditasDefinition[]>;
    findDefinitionsByYear(year: number): Promise<KPMRLikuiditasDefinition[]>;
    findDefinitionById(id: number): Promise<KPMRLikuiditasDefinition>;
    updateDefinition(id: number, updateDto: UpdateKPMRLikuiditasDefinitionDto, updatedBy?: string): Promise<KPMRLikuiditasDefinition>;
    deleteDefinition(definitionId: number, year: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createOrUpdateScore(createDto: CreateKPMRLikuiditasScoreDto, createdBy?: string): Promise<KPMRLikuiditasScore>;
    findAllScores(): Promise<KPMRLikuiditasScore[]>;
    findScoresByPeriod(year: number, quarter?: string): Promise<KPMRLikuiditasScore[]>;
    findScoresByDefinition(definitionId: number): Promise<KPMRLikuiditasScore[]>;
    findScoreById(id: number): Promise<KPMRLikuiditasScore>;
    updateScore(id: number, updateDto: UpdateKPMRLikuiditasScoreDto, updatedBy?: string): Promise<KPMRLikuiditasScore>;
    deleteScore(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteScoreByTarget(definitionId: number, year: number, quarter: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getKPMRFullData(year: number): Promise<any>;
    searchKPMR(year?: number, query?: string, aspekNo?: string): Promise<KPMRLikuiditasDefinition[]>;
    getAvailableYears(): Promise<number[]>;
    getPeriods(): Promise<Array<{
        year: number;
        quarter: string;
    }>>;
}
