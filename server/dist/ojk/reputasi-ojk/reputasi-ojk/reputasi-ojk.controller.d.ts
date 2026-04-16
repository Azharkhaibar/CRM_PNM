import { ReputasiOjkService } from './reputasi-ojk.service';
import { CreateReputasiOjkDto, CreateNilaiDto, CreateParameterDto, UpdateNilaiDto, UpdateParameterDto, UpdateReputasiOjkDto, UpdateSummaryDto, ReorderNilaiDto, ReorderParametersDto, ImportExportDto } from './dto/reputasi-inherent.dto';
export declare class ReputasiOjkController {
    private readonly reputasiService;
    constructor(reputasiService: ReputasiOjkService);
    findAll(year?: number, quarter?: number): Promise<import("./entities/reputasi-ojk.entity").ReputasiOjk | import("./entities/reputasi-ojk.entity").ReputasiOjk[]>;
    getActive(): Promise<import("./entities/reputasi-ojk.entity").ReputasiOjk>;
    findOne(id: number): Promise<import("./entities/reputasi-ojk.entity").ReputasiOjk>;
    create(createDto: CreateReputasiOjkDto, req: any): Promise<import("./entities/reputasi-ojk.entity").ReputasiOjk>;
    update(id: number, updateDto: UpdateReputasiOjkDto, req: any): Promise<import("./entities/reputasi-ojk.entity").ReputasiOjk>;
    updateSummary(id: number, summaryDto: UpdateSummaryDto, req: any): Promise<import("./entities/reputasi-ojk.entity").ReputasiOjk>;
    updateActiveStatus(id: number, isActive: boolean, req: any): Promise<import("./entities/reputasi-ojk.entity").ReputasiOjk>;
    remove(id: number): Promise<{
        message: string;
        id: number;
    }>;
    getParameters(reputasiId: number): Promise<import("./entities/reputasi-paramater.entity").ReputasiParameter[]>;
    addParameter(reputasiId: number, createParamDto: CreateParameterDto, req: any): Promise<import("./entities/reputasi-paramater.entity").ReputasiParameter>;
    updateParameter(reputasiId: number, parameterId: number, updateParamDto: UpdateParameterDto, req: any): Promise<import("./entities/reputasi-paramater.entity").ReputasiParameter>;
    reorderParameters(reputasiId: number, reorderDto: ReorderParametersDto): Promise<{
        message: string;
    }>;
    copyParameter(reputasiId: number, parameterId: number, req: any): Promise<import("./entities/reputasi-paramater.entity").ReputasiParameter>;
    removeParameter(reputasiId: number, parameterId: number, req: any): Promise<{
        message: string;
        parameterId: number;
    }>;
    getNilai(reputasiId: number, parameterId: number): Promise<import("./entities/reputasi-nilai.entity").ReputasiNilai[]>;
    addNilai(reputasiId: number, parameterId: number, createNilaiDto: CreateNilaiDto, req: any): Promise<{
        nomor: string;
        judul: {
            type: import("./dto/reputasi-inherent.dto").JudulType;
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
        riskindikator: import("./dto/reputasi-inherent.dto").RiskindikatorDto;
        parameterId: number;
        orderIndex: number;
    } & import("./entities/reputasi-nilai.entity").ReputasiNilai>;
    updateNilai(reputasiId: number, parameterId: number, nilaiId: number, updateNilaiDto: UpdateNilaiDto, req: any): Promise<import("./entities/reputasi-nilai.entity").ReputasiNilai>;
    reorderNilai(reputasiId: number, parameterId: number, reorderDto: ReorderNilaiDto): Promise<{
        message: string;
    }>;
    copyNilai(reputasiId: number, parameterId: number, nilaiId: number, req: any): Promise<{
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
    } & import("./entities/reputasi-nilai.entity").ReputasiNilai>;
    removeNilai(reputasiId: number, parameterId: number, nilaiId: number, req: any): Promise<{
        message: string;
        nilaiId: number;
    }>;
    exportToExcel(reputasiId: number): Promise<{
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
    importFromExcel(importData: ImportExportDto, req: any): Promise<{
        year: any;
        quarter: any;
        summary: any;
        isActive: boolean;
        createdBy: string;
        updatedBy: string;
    } & import("./entities/reputasi-ojk.entity").ReputasiOjk>;
    getReferences(type?: string): Promise<import("./entities/reputasi-inherent-references.entity").ReputasiReference[]>;
    checkExists(year: number, quarter: number): Promise<{
        exists: boolean;
        data: import("./entities/reputasi-ojk.entity").ReputasiOjk | null;
    }>;
    private getReputasiByIdOrThrow;
    private getReputasiByIdDirect;
}
