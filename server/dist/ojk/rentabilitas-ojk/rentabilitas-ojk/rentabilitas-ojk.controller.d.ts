import { RentabilitasProdukOjkService } from './rentabilitas-ojk.service';
import { CreateRentabilitasInherentDto, UpdateRentabilitasInherentDto, CreateParameterDto, UpdateParameterDto, CreateNilaiDto, UpdateNilaiDto, ReorderParametersDto, ReorderNilaiDto, UpdateSummaryDto, ImportExportDto } from './dto/rentabilitas-inherent.dto';
export declare class RentabilitasProdukOjkController {
    private readonly inherentService;
    constructor(inherentService: RentabilitasProdukOjkService);
    findAll(year?: number, quarter?: number): Promise<import("./entities/rentabilitas-ojk.entity").RentabilitasProdukOjk | import("./entities/rentabilitas-ojk.entity").RentabilitasProdukOjk[]>;
    getActive(): Promise<import("./entities/rentabilitas-ojk.entity").RentabilitasProdukOjk>;
    findOne(id: number): Promise<import("./entities/rentabilitas-ojk.entity").RentabilitasProdukOjk>;
    create(createDto: CreateRentabilitasInherentDto, req: any): Promise<import("./entities/rentabilitas-ojk.entity").RentabilitasProdukOjk>;
    update(id: number, updateDto: UpdateRentabilitasInherentDto, req: any): Promise<import("./entities/rentabilitas-ojk.entity").RentabilitasProdukOjk>;
    updateSummary(id: number, summaryDto: UpdateSummaryDto, req: any): Promise<import("./entities/rentabilitas-ojk.entity").RentabilitasProdukOjk>;
    updateActiveStatus(id: number, isActive: boolean, req: any): Promise<import("./entities/rentabilitas-ojk.entity").RentabilitasProdukOjk>;
    remove(id: number): Promise<{
        message: string;
        id: number;
    }>;
    getParameters(inherentId: number): Promise<import("./entities/rentabilitas-parameter.entity").RentabilitasParameter[]>;
    addParameter(inherentId: number, createParamDto: CreateParameterDto, req: any): Promise<import("./entities/rentabilitas-parameter.entity").RentabilitasParameter>;
    updateParameter(inherentId: number, parameterId: number, updateParamDto: UpdateParameterDto, req: any): Promise<import("./entities/rentabilitas-parameter.entity").RentabilitasParameter>;
    reorderParameters(inherentId: number, reorderDto: ReorderParametersDto): Promise<{
        message: string;
    }>;
    copyParameter(inherentId: number, parameterId: number, req: any): Promise<import("./entities/rentabilitas-parameter.entity").RentabilitasParameter>;
    removeParameter(inherentId: number, parameterId: number, req: any): Promise<{
        message: string;
        parameterId: number;
    }>;
    getNilai(inherentId: number, parameterId: number): Promise<import("./entities/rentabilitas-nilai.entity").RentabilitasNilai[]>;
    addNilai(inherentId: number, parameterId: number, createNilaiDto: CreateNilaiDto, req: any): Promise<{
        nomor: string;
        judul: {
            type: import("./dto/rentabilitas-inherent.dto").JudulType;
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
        riskindikator: import("./dto/rentabilitas-inherent.dto").RiskindikatorDto;
        parameterId: number;
        orderIndex: number;
    } & import("./entities/rentabilitas-nilai.entity").RentabilitasNilai>;
    updateNilai(inherentId: number, parameterId: number, nilaiId: number, updateNilaiDto: UpdateNilaiDto, req: any): Promise<import("./entities/rentabilitas-nilai.entity").RentabilitasNilai>;
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
    } & import("./entities/rentabilitas-nilai.entity").RentabilitasNilai>;
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
    } & import("./entities/rentabilitas-ojk.entity").RentabilitasProdukOjk>;
    getReferences(type?: string): Promise<import("./entities/rentabilitas-inherent-references.entity").InherentReferenceRentabilitas[]>;
    checkExists(year: number, quarter: number): Promise<{
        exists: boolean;
        data: import("./entities/rentabilitas-ojk.entity").RentabilitasProdukOjk | null;
    }>;
    private getInherentByIdOrThrow;
    private getInherentByIdDirect;
}
