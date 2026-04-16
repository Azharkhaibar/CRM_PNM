import { HukumOjkService } from './hukum-ojk.service';
import { CreateHukumInherentDto, UpdateHukumInherentDto, CreateParameterDto, UpdateParameterDto, CreateNilaiDto, UpdateNilaiDto, ReorderParametersDto, ReorderNilaiDto, UpdateSummaryDto, ImportExportDto } from './dto/hukum-inherent.dto';
export declare class HukumOjkController {
    private readonly inherentService;
    constructor(inherentService: HukumOjkService);
    findAll(year?: number, quarter?: number): Promise<import("./entities/hukum-ojk.entity").HukumOjk | import("./entities/hukum-ojk.entity").HukumOjk[]>;
    getActive(): Promise<import("./entities/hukum-ojk.entity").HukumOjk>;
    findOne(id: number): Promise<import("./entities/hukum-ojk.entity").HukumOjk>;
    create(createDto: CreateHukumInherentDto, req: any): Promise<import("./entities/hukum-ojk.entity").HukumOjk>;
    update(id: number, updateDto: UpdateHukumInherentDto, req: any): Promise<import("./entities/hukum-ojk.entity").HukumOjk>;
    updateSummary(id: number, summaryDto: UpdateSummaryDto, req: any): Promise<import("./entities/hukum-ojk.entity").HukumOjk>;
    updateActiveStatus(id: number, isActive: boolean, req: any): Promise<import("./entities/hukum-ojk.entity").HukumOjk>;
    remove(id: number): Promise<{
        message: string;
        id: number;
    }>;
    getParameters(inherentId: number): Promise<import("./entities/hukum-paramater.entity").HukumParameter[]>;
    addParameter(inherentId: number, createParamDto: CreateParameterDto, req: any): Promise<import("./entities/hukum-paramater.entity").HukumParameter>;
    updateParameter(inherentId: number, parameterId: number, updateParamDto: UpdateParameterDto, req: any): Promise<import("./entities/hukum-paramater.entity").HukumParameter>;
    reorderParameters(inherentId: number, reorderDto: ReorderParametersDto): Promise<{
        message: string;
    }>;
    copyParameter(inherentId: number, parameterId: number, req: any): Promise<import("./entities/hukum-paramater.entity").HukumParameter>;
    removeParameter(inherentId: number, parameterId: number, req: any): Promise<{
        message: string;
        parameterId: number;
    }>;
    getNilai(inherentId: number, parameterId: number): Promise<import("./entities/hukum-nilai.entity").HukumNilai[]>;
    addNilai(inherentId: number, parameterId: number, createNilaiDto: CreateNilaiDto, req: any): Promise<{
        nomor: string;
        judul: {
            type: import("./dto/hukum-inherent.dto").JudulType;
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
        riskindikator: import("./dto/hukum-inherent.dto").RiskindikatorDto;
        parameterId: number;
        orderIndex: number;
    } & import("./entities/hukum-nilai.entity").HukumNilai>;
    updateNilai(inherentId: number, parameterId: number, nilaiId: number, updateNilaiDto: UpdateNilaiDto, req: any): Promise<import("./entities/hukum-nilai.entity").HukumNilai>;
    reorderNilai(inherentId: number, parameterId: number, reorderDto: ReorderNilaiDto): Promise<{
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
    } & import("./entities/hukum-nilai.entity").HukumNilai>;
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
    importFromExcel(importData: ImportExportDto, req: any): Promise<{
        year: any;
        quarter: any;
        summary: any;
        isActive: boolean;
        createdBy: string;
        updatedBy: string;
    } & import("./entities/hukum-ojk.entity").HukumOjk>;
    getReferences(type?: string): Promise<import("./entities/hukum-inherent-references.entity").InherentReferenceHukum[]>;
    checkExists(year: number, quarter: number): Promise<{
        exists: boolean;
        data: import("./entities/hukum-ojk.entity").HukumOjk | null;
    }>;
    private getInherentByIdOrThrow;
    private getInherentByIdDirect;
}
