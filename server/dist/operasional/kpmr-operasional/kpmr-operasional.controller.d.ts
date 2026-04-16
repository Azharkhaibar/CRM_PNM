import { KPMROperasionalService } from './kpmr-operasional.service';
import { CreateKPMROperasionalAspectDto, UpdateKPMROperasionalAspectDto, CreateKPMROperasionalQuestionDto, UpdateKPMROperasionalQuestionDto, CreateKPMROperasionalDefinitionDto, UpdateKPMROperasionalDefinitionDto, CreateKPMROperasionalScoreDto, UpdateKPMROperasionalScoreDto } from './dto/kpmr-operasional.dto';
export declare class KPMROperasionalController {
    private readonly kpmrOperasionalService;
    constructor(kpmrOperasionalService: KPMROperasionalService);
    createAspect(createDto: CreateKPMROperasionalAspectDto): Promise<import("./entities/kpmr-operasional-aspek.entity").KPMROperasionalAspect>;
    getAllAspects(year?: number): Promise<import("./entities/kpmr-operasional-aspek.entity").KPMROperasionalAspect[]>;
    getAspect(id: number): Promise<import("./entities/kpmr-operasional-aspek.entity").KPMROperasionalAspect>;
    updateAspect(id: number, updateDto: UpdateKPMROperasionalAspectDto): Promise<import("./entities/kpmr-operasional-aspek.entity").KPMROperasionalAspect>;
    deleteAspect(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createQuestion(createDto: CreateKPMROperasionalQuestionDto): Promise<import("./entities/kpmr-operasional-pertanyaan.entity").KPMROperasionalQuestion>;
    getAllQuestions(year?: number): Promise<import("./entities/kpmr-operasional-pertanyaan.entity").KPMROperasionalQuestion[]>;
    getQuestionsByAspect(aspekNo: string, year?: number): Promise<import("./entities/kpmr-operasional-pertanyaan.entity").KPMROperasionalQuestion[]>;
    getQuestion(id: number): Promise<import("./entities/kpmr-operasional-pertanyaan.entity").KPMROperasionalQuestion>;
    updateQuestion(id: number, updateDto: UpdateKPMROperasionalQuestionDto): Promise<import("./entities/kpmr-operasional-pertanyaan.entity").KPMROperasionalQuestion>;
    deleteQuestion(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createOrUpdateDefinition(createDto: CreateKPMROperasionalDefinitionDto): Promise<import("./entities/kpmr-operasional-definisi.entity").KPMROperasionalDefinition>;
    getAllDefinitions(): Promise<import("./entities/kpmr-operasional-definisi.entity").KPMROperasionalDefinition[]>;
    getDefinitionsByYear(year: number): Promise<import("./entities/kpmr-operasional-definisi.entity").KPMROperasionalDefinition[]>;
    getDefinition(id: number): Promise<import("./entities/kpmr-operasional-definisi.entity").KPMROperasionalDefinition>;
    updateDefinition(id: number, updateDto: UpdateKPMROperasionalDefinitionDto): Promise<import("./entities/kpmr-operasional-definisi.entity").KPMROperasionalDefinition>;
    deleteDefinitionPermanent(definitionId: number, year: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createOrUpdateScore(createDto: CreateKPMROperasionalScoreDto): Promise<import("./entities/kpmr-operasional-skor.entity").KPMROperasionalScore>;
    getAllScores(): Promise<import("./entities/kpmr-operasional-skor.entity").KPMROperasionalScore[]>;
    getScoresByPeriod(year: number, quarter?: string): Promise<import("./entities/kpmr-operasional-skor.entity").KPMROperasionalScore[]>;
    getScoresByDefinition(definitionId: number): Promise<import("./entities/kpmr-operasional-skor.entity").KPMROperasionalScore[]>;
    getScore(id: number): Promise<import("./entities/kpmr-operasional-skor.entity").KPMROperasionalScore>;
    updateScore(id: number, updateDto: UpdateKPMROperasionalScoreDto): Promise<import("./entities/kpmr-operasional-skor.entity").KPMROperasionalScore>;
    deleteScore(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteScoreByTarget(body: {
        definitionId: number;
        year: number;
        quarter: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    getFullData(year: number): Promise<any>;
    searchKPMR(year?: number, query?: string, aspekNo?: string): Promise<import("./entities/kpmr-operasional-definisi.entity").KPMROperasionalDefinition[]>;
    getAvailableYears(): Promise<{
        success: boolean;
        data: number[];
    }>;
    getPeriods(): Promise<{
        success: boolean;
        data: {
            year: number;
            quarter: string;
        }[];
    }>;
}
