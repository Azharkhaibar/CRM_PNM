import { LikuiditasProdukOjkService } from './likuiditas-produk-ojk.service';
import { CreateLikuiditasProdukInherentDto, UpdateLikuiditasProdukInherentDto, CreateLikuiditasParameterDto, UpdateLikuiditasParameterDto, CreateLikuiditasNilaiDto, UpdateLikuiditasNilaiDto, ReorderLikuiditasNilaiDto, ReorderLikuiditasParametersDto, UpdateLikuiditasSummaryDto, LikuiditasImportExportDto } from './dto/likuditas-produk-inherent.dto';
export declare class LikuiditasProdukOjkController {
    private readonly inherentService;
    constructor(inherentService: LikuiditasProdukOjkService);
    findAll(year?: number, quarter?: number): Promise<import("./entities/likuiditas-produk-ojk.entity").LikuiditasProdukOjk | import("./entities/likuiditas-produk-ojk.entity").LikuiditasProdukOjk[]>;
    getActive(): Promise<import("./entities/likuiditas-produk-ojk.entity").LikuiditasProdukOjk>;
    findOne(id: number): Promise<import("./entities/likuiditas-produk-ojk.entity").LikuiditasProdukOjk>;
    create(createDto: CreateLikuiditasProdukInherentDto, req: any): Promise<import("./entities/likuiditas-produk-ojk.entity").LikuiditasProdukOjk>;
    update(id: number, updateDto: UpdateLikuiditasProdukInherentDto, req: any): Promise<import("./entities/likuiditas-produk-ojk.entity").LikuiditasProdukOjk>;
    updateSummary(id: number, summaryDto: UpdateLikuiditasSummaryDto, req: any): Promise<import("./entities/likuiditas-produk-ojk.entity").LikuiditasProdukOjk>;
    updateActiveStatus(id: number, isActive: boolean, req: any): Promise<import("./entities/likuiditas-produk-ojk.entity").LikuiditasProdukOjk>;
    remove(id: number): Promise<{
        message: string;
        id: number;
    }>;
    getParameters(inherentId: number): Promise<import("./entities/likuiditas-parameter.entity").LikuiditasParameter[]>;
    addParameter(inherentId: number, createParamDto: CreateLikuiditasParameterDto, req: any): Promise<import("./entities/likuiditas-parameter.entity").LikuiditasParameter>;
    updateParameter(inherentId: number, parameterId: number, updateParamDto: UpdateLikuiditasParameterDto, req: any): Promise<import("./entities/likuiditas-parameter.entity").LikuiditasParameter>;
    reorderParameters(inherentId: number, reorderDto: ReorderLikuiditasParametersDto): Promise<{
        message: string;
    }>;
    copyParameter(inherentId: number, parameterId: number, req: any): Promise<import("./entities/likuiditas-parameter.entity").LikuiditasParameter>;
    removeParameter(inherentId: number, parameterId: number, req: any): Promise<{
        message: string;
        parameterId: number;
    }>;
    getNilai(inherentId: number, parameterId: number): Promise<import("./entities/likuditas-nilai.entity").LikuiditasNilai[]>;
    addNilai(inherentId: number, parameterId: number, createNilaiDto: CreateLikuiditasNilaiDto, req: any): Promise<{
        nomor: string;
        judul: {
            type: import("./dto/likuditas-produk-inherent.dto").LikuiditasJudulType;
            text: string;
            value: string | number | null;
            pembilang: string;
            valuePembilang: string | number | null;
            penyebut: string;
            valuePenyebut: string | number | null;
            formula: string;
            percent: boolean;
        };
        bobot: number;
        portofolio: string;
        keterangan: string;
        riskindikator: import("./dto/likuditas-produk-inherent.dto").LikuiditasRiskindikatorDto;
        parameterId: number;
        orderIndex: number;
    } & import("./entities/likuditas-nilai.entity").LikuiditasNilai>;
    updateNilai(inherentId: number, parameterId: number, nilaiId: number, updateNilaiDto: UpdateLikuiditasNilaiDto, req: any): Promise<import("./entities/likuditas-nilai.entity").LikuiditasNilai>;
    reorderNilai(inherentId: number, parameterId: number, reorderDto: ReorderLikuiditasNilaiDto): Promise<{
        message: string;
    }>;
    copyNilai(inherentId: number, parameterId: number, nilaiId: number, req: any): Promise<{
        nomor: string | undefined;
        judul: {
            text: string;
            type?: string;
            value?: string | number | null;
            pembilang?: string;
            valuePembilang?: string | number | null;
            penyebut?: string;
            valuePenyebut?: string | number | null;
            formula?: string;
            percent?: boolean;
        };
        bobot: number;
        portofolio: string | undefined;
        keterangan: string | undefined;
        riskindikator: {
            low?: string;
            lowToModerate?: string;
            moderate?: string;
            moderateToHigh?: string;
            high?: string;
        } | undefined;
        parameterId: number;
        orderIndex: number;
    } & import("./entities/likuditas-nilai.entity").LikuiditasNilai>;
    removeNilai(inherentId: number, parameterId: number, nilaiId: number, req: any): Promise<{
        message: string;
        nilaiId: number;
    }>;
    exportToExcel(inherentId: number): Promise<{
        metadata: {
            year: number;
            quarter: number;
            exportedAt: string;
            totalParameters: number;
            totalNilai: number;
        };
        parameters: {
            id: number;
            nomor: string | undefined;
            judul: string;
            bobot: number;
            kategori: {
                model?: string;
                prinsip?: string;
                jenis?: string;
                underlying?: string[];
            } | undefined;
            orderIndex: number;
            nilaiList: {
                id: number;
                nomor: string | undefined;
                judul: {
                    type?: string;
                    text?: string;
                    value?: string | number | null;
                    pembilang?: string;
                    valuePembilang?: string | number | null;
                    penyebut?: string;
                    valuePenyebut?: string | number | null;
                    formula?: string;
                    percent?: boolean;
                } | undefined;
                bobot: number;
                portofolio: string | undefined;
                keterangan: string | undefined;
                riskindikator: {
                    low?: string;
                    lowToModerate?: string;
                    moderate?: string;
                    moderateToHigh?: string;
                    high?: string;
                } | undefined;
                orderIndex: number;
            }[];
        }[];
    }>;
    importFromExcel(importData: LikuiditasImportExportDto, req: any): Promise<{
        year: any;
        quarter: any;
        summary: any;
        isActive: boolean;
        createdBy: string;
        updatedBy: string;
    } & import("./entities/likuiditas-produk-ojk.entity").LikuiditasProdukOjk>;
    getReferences(type?: string): Promise<import("./entities/likuditas-inherent-refrences.entity").InherentReferenceLikuiditas[]>;
    checkExists(year: number, quarter: number): Promise<{
        exists: boolean;
        data: import("./entities/likuiditas-produk-ojk.entity").LikuiditasProdukOjk | null;
    }>;
    validateKomprehensif(id: number): Promise<{
        isValid: boolean;
        warnings: string[];
        errors: string[];
    }>;
    getStatistics(id: number): Promise<{
        totalQuestions: number;
        aspekCount: number;
        averageScore: number;
        rating: string;
    }>;
    private getInherentByIdOrThrow;
    private getInherentByIdDirect;
}
