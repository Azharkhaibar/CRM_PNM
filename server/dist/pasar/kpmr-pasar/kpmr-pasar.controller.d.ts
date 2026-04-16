import { KPMRPasarService } from './kpmr-pasar.service';
import { CreateKPMRPasarAspectDto, UpdateKPMRPasarAspectDto, CreateKPMRPasarQuestionDto, UpdateKPMRPasarQuestionDto, CreateKPMRPasarDefinitionDto, UpdateKPMRPasarDefinitionDto, CreateKPMRPasarScoreDto, UpdateKPMRPasarScoreDto } from './dto/kpmr-pasar.dto';
export declare class KPMRPasarController {
    private readonly kpmrPasarService;
    constructor(kpmrPasarService: KPMRPasarService);
    createAspect(createDto: CreateKPMRPasarAspectDto): Promise<import("./entities/kpmr-pasar-aspek.entity").KPMRPasarAspect>;
    getAllAspects(year?: string): Promise<import("./entities/kpmr-pasar-aspek.entity").KPMRPasarAspect[]>;
    getAspect(id: number): Promise<import("./entities/kpmr-pasar-aspek.entity").KPMRPasarAspect>;
    updateAspect(id: number, updateDto: UpdateKPMRPasarAspectDto): Promise<import("./entities/kpmr-pasar-aspek.entity").KPMRPasarAspect>;
    deleteAspect(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createQuestion(createDto: CreateKPMRPasarQuestionDto): Promise<import("./entities/kpmr-pasar-pertanyaan.entity").KPMRPasarQuestion>;
    getAllQuestions(year?: string): Promise<import("./entities/kpmr-pasar-pertanyaan.entity").KPMRPasarQuestion[]>;
    getQuestionsByAspect(aspekNo: string, year?: string): Promise<import("./entities/kpmr-pasar-pertanyaan.entity").KPMRPasarQuestion[]>;
    getQuestion(id: number): Promise<import("./entities/kpmr-pasar-pertanyaan.entity").KPMRPasarQuestion>;
    updateQuestion(id: number, updateDto: UpdateKPMRPasarQuestionDto): Promise<import("./entities/kpmr-pasar-pertanyaan.entity").KPMRPasarQuestion>;
    deleteQuestion(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createOrUpdateDefinition(createDto: CreateKPMRPasarDefinitionDto): Promise<import("./entities/kpmr-pasar-definisi.entity").KPMRPasarDefinition>;
    getAllDefinitions(): Promise<import("./entities/kpmr-pasar-definisi.entity").KPMRPasarDefinition[]>;
    getDefinitionsByYear(year: string): Promise<import("./entities/kpmr-pasar-definisi.entity").KPMRPasarDefinition[]>;
    getDefinition(id: number): Promise<import("./entities/kpmr-pasar-definisi.entity").KPMRPasarDefinition>;
    updateDefinition(id: number, updateDto: UpdateKPMRPasarDefinitionDto): Promise<import("./entities/kpmr-pasar-definisi.entity").KPMRPasarDefinition>;
    deleteDefinitionPermanent(definitionId: number, year: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createOrUpdateScore(createDto: CreateKPMRPasarScoreDto): Promise<import("./entities/kpmr-pasar-skor.entity").KPMRPasarScore>;
    getAllScores(): Promise<import("./entities/kpmr-pasar-skor.entity").KPMRPasarScore[]>;
    getScoresByPeriod(year: string, quarter?: string): Promise<import("./entities/kpmr-pasar-skor.entity").KPMRPasarScore[]>;
    getScoresByDefinition(definitionId: number): Promise<import("./entities/kpmr-pasar-skor.entity").KPMRPasarScore[]>;
    getScore(id: number): Promise<import("./entities/kpmr-pasar-skor.entity").KPMRPasarScore>;
    updateScore(id: number, updateDto: UpdateKPMRPasarScoreDto): Promise<import("./entities/kpmr-pasar-skor.entity").KPMRPasarScore>;
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
    getFullData(year: string): Promise<any>;
    searchKPMR(year?: string, query?: string, aspekNo?: string): Promise<import("./entities/kpmr-pasar-definisi.entity").KPMRPasarDefinition[]>;
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
