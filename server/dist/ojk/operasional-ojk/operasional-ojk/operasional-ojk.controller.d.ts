import { OperasionalService } from './operasional-ojk.service';
import { CreateOperasionalDto, UpdateOperasionalDto, CreateParameterDto, UpdateParameterDto, CreateNilaiDto, UpdateNilaiDto, ReorderParametersDto, ReorderNilaiDto, UpdateSummaryDto, ImportExportDto } from './dto/operasional-inherent.dto';
export declare class OperasionalController {
    private readonly operasionalService;
    constructor(operasionalService: OperasionalService);
    findAll(year?: number, quarter?: number): Promise<import("./entities/operasional-ojk.entity").Operasional | import("./entities/operasional-ojk.entity").Operasional[]>;
    getActive(): Promise<import("./entities/operasional-ojk.entity").Operasional>;
    findOne(id: number): Promise<import("./entities/operasional-ojk.entity").Operasional>;
    create(createDto: CreateOperasionalDto, req: any): Promise<import("./entities/operasional-ojk.entity").Operasional>;
    update(id: number, updateDto: UpdateOperasionalDto, req: any): Promise<import("./entities/operasional-ojk.entity").Operasional>;
    updateSummary(id: number, summaryDto: UpdateSummaryDto, req: any): Promise<import("./entities/operasional-ojk.entity").Operasional>;
    updateActiveStatus(id: number, isActive: boolean, req: any): Promise<import("./entities/operasional-ojk.entity").Operasional>;
    remove(id: number): Promise<{
        message: string;
        id: number;
    }>;
    getParameters(operasionalId: number): Promise<import("./entities/operasional-produk-parameter.entity").OperasionalParameter[]>;
    addParameter(operasionalId: number, createParamDto: CreateParameterDto, req: any): Promise<import("./entities/operasional-produk-parameter.entity").OperasionalParameter>;
    updateParameter(operasionalId: number, parameterId: number, updateParamDto: UpdateParameterDto, req: any): Promise<import("./entities/operasional-produk-parameter.entity").OperasionalParameter>;
    reorderParameters(operasionalId: number, reorderDto: ReorderParametersDto): Promise<{
        message: string;
    }>;
    copyParameter(operasionalId: number, parameterId: number, req: any): Promise<import("./entities/operasional-produk-parameter.entity").OperasionalParameter>;
    removeParameter(operasionalId: number, parameterId: number, req: any): Promise<{
        message: string;
        parameterId: number;
    }>;
    getNilai(operasionalId: number, parameterId: number): Promise<import("./entities/operasional-produk-nilai.entity").OperasionalNilai[]>;
    addNilai(operasionalId: number, parameterId: number, createNilaiDto: CreateNilaiDto, req: any): Promise<{
        nomor: string;
        judul: {
            type: import("./dto/operasional-inherent.dto").JudulType;
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
        riskindikator: import("./dto/operasional-inherent.dto").RiskindikatorDto;
        parameterId: number;
        orderIndex: number;
    } & import("./entities/operasional-produk-nilai.entity").OperasionalNilai>;
    updateNilai(operasionalId: number, parameterId: number, nilaiId: number, updateNilaiDto: UpdateNilaiDto, req: any): Promise<import("./entities/operasional-produk-nilai.entity").OperasionalNilai>;
    reorderNilai(operasionalId: number, parameterId: number, reorderDto: ReorderNilaiDto): Promise<{
        message: string;
    }>;
    copyNilai(operasionalId: number, parameterId: number, nilaiId: number, req: any): Promise<{
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
    } & import("./entities/operasional-produk-nilai.entity").OperasionalNilai>;
    removeNilai(operasionalId: number, parameterId: number, nilaiId: number, req: any): Promise<{
        message: string;
        nilaiId: number;
    }>;
    exportToExcel(operasionalId: number): Promise<{
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
    } & import("./entities/operasional-ojk.entity").Operasional>;
    getReferences(type?: string): Promise<import("./entities/operasional-inherent-references.entity").OperasionalReference[]>;
    validateModelTerstruktur(operasionalId: number): Promise<{
        isValid: boolean;
        warnings: string[];
        errors: string[];
    }>;
    checkExists(year: number, quarter: number): Promise<{
        exists: boolean;
        data: import("./entities/operasional-ojk.entity").Operasional | null;
    }>;
    private getOperasionalByIdOrThrow;
}
