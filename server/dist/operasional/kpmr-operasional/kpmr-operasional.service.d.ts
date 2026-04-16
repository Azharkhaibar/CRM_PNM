import { Repository } from 'typeorm';
import { KPMROperasionalDefinition } from './entities/kpmr-operasional-definisi.entity';
import { KPMROperasionalScore } from './entities/kpmr-operasional-skor.entity';
import { KPMROperasionalAspect } from './entities/kpmr-operasional-aspek.entity';
import { KPMROperasionalQuestion } from './entities/kpmr-operasional-pertanyaan.entity';
import { CreateKPMROperasionalAspectDto, UpdateKPMROperasionalAspectDto, CreateKPMROperasionalQuestionDto, UpdateKPMROperasionalQuestionDto, CreateKPMROperasionalDefinitionDto, UpdateKPMROperasionalDefinitionDto, CreateKPMROperasionalScoreDto, UpdateKPMROperasionalScoreDto } from './dto/kpmr-operasional.dto';
export declare class KPMROperasionalService {
    private readonly definitionRepo;
    private readonly scoreRepo;
    private readonly aspectRepo;
    private readonly questionRepo;
    private readonly logger;
    constructor(definitionRepo: Repository<KPMROperasionalDefinition>, scoreRepo: Repository<KPMROperasionalScore>, aspectRepo: Repository<KPMROperasionalAspect>, questionRepo: Repository<KPMROperasionalQuestion>);
    private validateQuarter;
    validateDefinitionExists(definitionId: number): Promise<KPMROperasionalDefinition>;
    createAspect(createDto: CreateKPMROperasionalAspectDto): Promise<KPMROperasionalAspect>;
    findAllAspects(year?: number): Promise<KPMROperasionalAspect[]>;
    findAspectById(id: number): Promise<KPMROperasionalAspect>;
    updateAspect(id: number, updateDto: UpdateKPMROperasionalAspectDto): Promise<KPMROperasionalAspect>;
    deleteAspect(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createQuestion(createDto: CreateKPMROperasionalQuestionDto): Promise<KPMROperasionalQuestion>;
    findAllQuestions(year?: number): Promise<KPMROperasionalQuestion[]>;
    findQuestionsByAspect(aspekNo: string, year?: number): Promise<KPMROperasionalQuestion[]>;
    findQuestionById(id: number): Promise<KPMROperasionalQuestion>;
    updateQuestion(id: number, updateDto: UpdateKPMROperasionalQuestionDto): Promise<KPMROperasionalQuestion>;
    deleteQuestion(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createOrUpdateDefinition(createDto: CreateKPMROperasionalDefinitionDto, createdBy?: string): Promise<KPMROperasionalDefinition>;
    findAllDefinitions(): Promise<KPMROperasionalDefinition[]>;
    findDefinitionsByYear(year: number): Promise<KPMROperasionalDefinition[]>;
    findDefinitionById(id: number): Promise<KPMROperasionalDefinition>;
    updateDefinition(id: number, updateDto: UpdateKPMROperasionalDefinitionDto, updatedBy?: string): Promise<KPMROperasionalDefinition>;
    deleteDefinition(definitionId: number, year: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createOrUpdateScore(createDto: CreateKPMROperasionalScoreDto, createdBy?: string): Promise<KPMROperasionalScore>;
    findAllScores(): Promise<KPMROperasionalScore[]>;
    findScoresByPeriod(year: number, quarter?: string): Promise<KPMROperasionalScore[]>;
    findScoresByDefinition(definitionId: number): Promise<KPMROperasionalScore[]>;
    findScoreById(id: number): Promise<KPMROperasionalScore>;
    updateScore(id: number, updateDto: UpdateKPMROperasionalScoreDto, updatedBy?: string): Promise<KPMROperasionalScore>;
    deleteScore(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteScoreByTarget(definitionId: number, year: number, quarter: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getKPMRFullData(year: number): Promise<any>;
    searchKPMR(year?: number, query?: string, aspekNo?: string): Promise<KPMROperasionalDefinition[]>;
    getAvailableYears(): Promise<number[]>;
    getPeriods(): Promise<Array<{
        year: number;
        quarter: string;
    }>>;
}
