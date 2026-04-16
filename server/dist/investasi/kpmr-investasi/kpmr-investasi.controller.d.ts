import { KPMRService } from './kpmr-investasi.service';
import { CreateKPMRAspectDto, UpdateKPMRAspectDto, CreateKPMRQuestionDto, UpdateKPMRQuestionDto, CreateKPMRDefinitionDto, UpdateKPMRDefinitionDto, CreateKPMRScoreDto, UpdateKPMRScoreDto } from './dto/kpmr-investasi.dto';
export declare class KPMRController {
    private readonly kpmrService;
    constructor(kpmrService: KPMRService);
    createAspect(createDto: CreateKPMRAspectDto): Promise<import("./entities/kpmr-investasi-aspek.entity").KPMRAspect>;
    getAllAspects(year?: number): Promise<import("./entities/kpmr-investasi-aspek.entity").KPMRAspect[]>;
    getAspect(id: number): Promise<import("./entities/kpmr-investasi-aspek.entity").KPMRAspect>;
    updateAspect(id: number, updateDto: UpdateKPMRAspectDto): Promise<import("./entities/kpmr-investasi-aspek.entity").KPMRAspect>;
    deleteAspect(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createQuestion(createDto: CreateKPMRQuestionDto): Promise<import("./entities/kpmr-investasi-pertanyaan.entity").KPMRQuestion>;
    getAllQuestions(year?: number): Promise<import("./entities/kpmr-investasi-pertanyaan.entity").KPMRQuestion[]>;
    getQuestionsByAspect(aspekNo: string, year?: number): Promise<import("./entities/kpmr-investasi-pertanyaan.entity").KPMRQuestion[]>;
    getQuestion(id: number): Promise<import("./entities/kpmr-investasi-pertanyaan.entity").KPMRQuestion>;
    updateQuestion(id: number, updateDto: UpdateKPMRQuestionDto): Promise<import("./entities/kpmr-investasi-pertanyaan.entity").KPMRQuestion>;
    deleteQuestion(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createOrUpdateDefinition(createDto: CreateKPMRDefinitionDto): Promise<import("./entities/kpmr-investasi-definisi.entity").KPMRDefinition>;
    getAllDefinitions(): Promise<import("./entities/kpmr-investasi-definisi.entity").KPMRDefinition[]>;
    getDefinitionsByYear(year: number): Promise<import("./entities/kpmr-investasi-definisi.entity").KPMRDefinition[]>;
    getDefinition(id: number): Promise<import("./entities/kpmr-investasi-definisi.entity").KPMRDefinition>;
    updateDefinition(id: number, updateDto: UpdateKPMRDefinitionDto): Promise<import("./entities/kpmr-investasi-definisi.entity").KPMRDefinition>;
    deleteDefinitionPermanent(definitionId: number, year: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createOrUpdateScore(createDto: CreateKPMRScoreDto): Promise<import("./entities/kpmr-investasi-skor.entity").KPMRScore>;
    getAllScores(): Promise<import("./entities/kpmr-investasi-skor.entity").KPMRScore[]>;
    getScoresByPeriod(year: number, quarter?: string): Promise<import("./entities/kpmr-investasi-skor.entity").KPMRScore[]>;
    getScoresByDefinition(definitionId: number): Promise<import("./entities/kpmr-investasi-skor.entity").KPMRScore[]>;
    getScore(id: number): Promise<import("./entities/kpmr-investasi-skor.entity").KPMRScore>;
    updateScore(id: number, updateDto: UpdateKPMRScoreDto): Promise<import("./entities/kpmr-investasi-skor.entity").KPMRScore>;
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
    searchKPMR(year?: number, query?: string, aspekNo?: string): Promise<import("./entities/kpmr-investasi-definisi.entity").KPMRDefinition[]>;
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
