import { KPMRLikuiditasService } from './kpmr-likuiditas.service';
import { CreateKPMRLikuiditasAspectDto, UpdateKPMRLikuiditasAspectDto, CreateKPMRLikuiditasQuestionDto, UpdateKPMRLikuiditasQuestionDto, CreateKPMRLikuiditasDefinitionDto, UpdateKPMRLikuiditasDefinitionDto, CreateKPMRLikuiditasScoreDto, UpdateKPMRLikuiditasScoreDto } from './dto/kpmr-likuiditas.dto';
export declare class KPMRLikuiditasController {
    private readonly kpmrLikuiditasService;
    constructor(kpmrLikuiditasService: KPMRLikuiditasService);
    createAspect(createDto: CreateKPMRLikuiditasAspectDto): Promise<import("./entities/kpmr-likuiditas-aspek.entity").KPMRLikuiditasAspect>;
    getAllAspects(year?: string): Promise<import("./entities/kpmr-likuiditas-aspek.entity").KPMRLikuiditasAspect[]>;
    getAspect(id: number): Promise<import("./entities/kpmr-likuiditas-aspek.entity").KPMRLikuiditasAspect>;
    updateAspect(id: number, updateDto: UpdateKPMRLikuiditasAspectDto): Promise<import("./entities/kpmr-likuiditas-aspek.entity").KPMRLikuiditasAspect>;
    deleteAspect(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createQuestion(createDto: CreateKPMRLikuiditasQuestionDto): Promise<import("./entities/kpmr-likuiditas-pertanyaan.entity").KPMRLikuiditasQuestion>;
    getAllQuestions(year?: string): Promise<import("./entities/kpmr-likuiditas-pertanyaan.entity").KPMRLikuiditasQuestion[]>;
    getQuestionsByAspect(aspekNo: string, year?: string): Promise<import("./entities/kpmr-likuiditas-pertanyaan.entity").KPMRLikuiditasQuestion[]>;
    getQuestion(id: number): Promise<import("./entities/kpmr-likuiditas-pertanyaan.entity").KPMRLikuiditasQuestion>;
    updateQuestion(id: number, updateDto: UpdateKPMRLikuiditasQuestionDto): Promise<import("./entities/kpmr-likuiditas-pertanyaan.entity").KPMRLikuiditasQuestion>;
    deleteQuestion(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createOrUpdateDefinition(createDto: CreateKPMRLikuiditasDefinitionDto): Promise<import("./entities/kpmr-likuiditas-definisi.entity").KPMRLikuiditasDefinition>;
    getAllDefinitions(): Promise<import("./entities/kpmr-likuiditas-definisi.entity").KPMRLikuiditasDefinition[]>;
    getDefinitionsByYear(year: number): Promise<import("./entities/kpmr-likuiditas-definisi.entity").KPMRLikuiditasDefinition[]>;
    getDefinition(id: number): Promise<import("./entities/kpmr-likuiditas-definisi.entity").KPMRLikuiditasDefinition>;
    updateDefinition(id: number, updateDto: UpdateKPMRLikuiditasDefinitionDto): Promise<import("./entities/kpmr-likuiditas-definisi.entity").KPMRLikuiditasDefinition>;
    deleteDefinitionPermanent(definitionId: number, year: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createOrUpdateScore(createDto: CreateKPMRLikuiditasScoreDto): Promise<import("./entities/kpmr-likuiditas-skor.entity").KPMRLikuiditasScore>;
    getAllScores(): Promise<import("./entities/kpmr-likuiditas-skor.entity").KPMRLikuiditasScore[]>;
    getScoresByPeriod(year: string, quarter?: string): Promise<import("./entities/kpmr-likuiditas-skor.entity").KPMRLikuiditasScore[]>;
    getScoresByDefinition(definitionId: number): Promise<import("./entities/kpmr-likuiditas-skor.entity").KPMRLikuiditasScore[]>;
    getScore(id: number): Promise<import("./entities/kpmr-likuiditas-skor.entity").KPMRLikuiditasScore>;
    updateScore(id: number, updateDto: UpdateKPMRLikuiditasScoreDto): Promise<import("./entities/kpmr-likuiditas-skor.entity").KPMRLikuiditasScore>;
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
    searchKPMR(year?: string, query?: string, aspekNo?: string): Promise<import("./entities/kpmr-likuiditas-definisi.entity").KPMRLikuiditasDefinition[]>;
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
