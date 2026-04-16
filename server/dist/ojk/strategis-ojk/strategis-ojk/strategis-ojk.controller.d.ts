import { StrategisOjkService } from './strategis-ojk.service';
import { CreateStrategisOjkDto, CreateNilaiDto, CreateParameterDto, UpdateNilaiDto, UpdateStrategisOjkDto, UpdateParameterDto, UpdateSummaryDto, ReorderNilaiDto, ReorderParametersDto, ImportExportDto } from './dto/strategis-inherent.dto';
export declare class StrategisOjkController {
    private readonly strategisService;
    constructor(strategisService: StrategisOjkService);
    findAll(year?: number, quarter?: number): Promise<import("./entities/strategis-ojk.entity").StrategisOjk | import("./entities/strategis-ojk.entity").StrategisOjk[]>;
    getActive(): Promise<import("./entities/strategis-ojk.entity").StrategisOjk>;
    findOne(id: number): Promise<import("./entities/strategis-ojk.entity").StrategisOjk>;
    create(createDto: CreateStrategisOjkDto, req: any): Promise<import("./entities/strategis-ojk.entity").StrategisOjk>;
    update(id: number, updateDto: UpdateStrategisOjkDto, req: any): Promise<import("./entities/strategis-ojk.entity").StrategisOjk>;
    updateSummary(id: number, summaryDto: UpdateSummaryDto, req: any): Promise<import("./entities/strategis-ojk.entity").StrategisOjk>;
    updateActiveStatus(id: number, isActive: boolean, req: any): Promise<import("./entities/strategis-ojk.entity").StrategisOjk>;
    remove(id: number): Promise<{
        message: string;
        id: number;
    }>;
    getParameters(strategisId: number): Promise<import("./entities/strategis-paramater.entity").StrategisParameter[]>;
    addParameter(strategisId: number, createParamDto: CreateParameterDto, req: any): Promise<import("./entities/strategis-paramater.entity").StrategisParameter>;
    updateParameter(strategisId: number, parameterId: number, updateParamDto: UpdateParameterDto, req: any): Promise<import("./entities/strategis-paramater.entity").StrategisParameter>;
    reorderParameters(strategisId: number, reorderDto: ReorderParametersDto): Promise<{
        message: string;
    }>;
    copyParameter(strategisId: number, parameterId: number, req: any): Promise<import("./entities/strategis-paramater.entity").StrategisParameter>;
    removeParameter(strategisId: number, parameterId: number, req: any): Promise<{
        message: string;
        parameterId: number;
    }>;
    getNilai(strategisId: number, parameterId: number): Promise<import("./entities/strategis-nilai.entity").StrategisNilai[]>;
    addNilai(strategisId: number, parameterId: number, createNilaiDto: CreateNilaiDto, req: any): Promise<{
        nomor: string;
        judul: {
            type: import("./dto/strategis-inherent.dto").JudulType;
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
        riskindikator: import("./dto/strategis-inherent.dto").RiskindikatorDto;
        parameterId: number;
        orderIndex: number;
    } & import("./entities/strategis-nilai.entity").StrategisNilai>;
    updateNilai(strategisId: number, parameterId: number, nilaiId: number, updateNilaiDto: UpdateNilaiDto, req: any): Promise<import("./entities/strategis-nilai.entity").StrategisNilai>;
    reorderNilai(strategisId: number, parameterId: number, reorderDto: ReorderNilaiDto): Promise<{
        message: string;
    }>;
    copyNilai(strategisId: number, parameterId: number, nilaiId: number, req: any): Promise<{
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
    } & import("./entities/strategis-nilai.entity").StrategisNilai>;
    removeNilai(strategisId: number, parameterId: number, nilaiId: number, req: any): Promise<{
        message: string;
        nilaiId: number;
    }>;
    exportToExcel(strategisId: number): Promise<{
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
    } & import("./entities/strategis-ojk.entity").StrategisOjk>;
    getReferences(type?: string): Promise<import("./entities/strategis-inherent-references.entity").StrategisReference[]>;
    checkExists(year: number, quarter: number): Promise<{
        exists: boolean;
        data: import("./entities/strategis-ojk.entity").StrategisOjk | null;
    }>;
    private getStrategisByIdOrThrow;
    private getStrategisByIdDirect;
}
