import { KpmrKreditService } from './kredit-produk-kpmr.service';
import { CreateKpmrKreditOjkDto, CreateKpmrAspekKreditDto, CreateKpmrPertanyaanKreditDto, UpdateKpmrAspekKreditDto, UpdateKpmrKreditOjkDto, UpdateKpmrPertanyaanKreditDto, UpdateSkorDto, UpdateSummaryDto, BulkUpdateSkorDto, ReorderAspekDto, ReorderPertanyaanDto, FrontendAspekResponseDto, FrontendKpmrResponseDto, FrontendPertanyaanResponseDto } from './dto/kredit-produk.dto';
export declare class KpmrKreditController {
    private readonly kpmrService;
    constructor(kpmrService: KpmrKreditService);
    create(createDto: CreateKpmrKreditOjkDto, req: any): Promise<FrontendKpmrResponseDto>;
    findAll(year?: string, quarter?: string, isActive?: string, isLocked?: string, search?: string, withRelations?: string): Promise<FrontendKpmrResponseDto[]>;
    getActive(): Promise<FrontendKpmrResponseDto | null>;
    findByYearQuarter(year: string, quarter: string): Promise<FrontendKpmrResponseDto>;
    findOne(id: string): Promise<FrontendKpmrResponseDto>;
    update(id: string, updateDto: UpdateKpmrKreditOjkDto): Promise<FrontendKpmrResponseDto>;
    remove(id: string): Promise<void>;
    lockKpmr(id: string, lockedBy: string): Promise<FrontendKpmrResponseDto>;
    unlockKpmr(id: string, unlockedBy?: string): Promise<FrontendKpmrResponseDto>;
    duplicate(id: string, year: number, quarter: number, createdBy?: string, copyScores?: boolean): Promise<FrontendKpmrResponseDto>;
    getSummary(id: string): Promise<UpdateSummaryDto>;
    updateSummary(id: string, updateDto: UpdateSummaryDto): Promise<UpdateSummaryDto>;
    createAspek(kpmrId: string, createDto: CreateKpmrAspekKreditDto): Promise<FrontendAspekResponseDto>;
    updateAspek(id: string, updateDto: UpdateKpmrAspekKreditDto): Promise<FrontendAspekResponseDto>;
    removeAspek(id: string): Promise<void>;
    reorderAspek(kpmrId: string, reorderDto: ReorderAspekDto): Promise<void>;
    createPertanyaan(aspekId: string, createDto: CreateKpmrPertanyaanKreditDto): Promise<FrontendPertanyaanResponseDto>;
    updatePertanyaan(id: string, updateDto: UpdateKpmrPertanyaanKreditDto): Promise<FrontendPertanyaanResponseDto>;
    findAllAspek(kpmrId: string): Promise<FrontendAspekResponseDto[]>;
    findOneAspek(id: string): Promise<FrontendAspekResponseDto>;
    updateSkor(id: string, updateSkorDto: UpdateSkorDto): Promise<FrontendPertanyaanResponseDto>;
    bulkUpdateSkor(bulkDto: BulkUpdateSkorDto): Promise<void>;
    removePertanyaan(id: string): Promise<void>;
    reorderPertanyaan(aspekId: string, reorderDto: ReorderPertanyaanDto): Promise<void>;
    validateKpmr(id: string): Promise<{
        isValid: boolean;
        errors: string[];
        warnings: string[];
    }>;
    getStatistics(id: string): Promise<any>;
}
