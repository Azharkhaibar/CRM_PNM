import { KonsentrasiProdukOjkService } from './konsentrasi-produk-ojk.service';
import { CreateKonsentrasiProdukInherentDto, UpdateKonsentrasiProdukInherentDto, CreateParameterDto, UpdateParameterDto, CreateNilaiDto, UpdateNilaiDto, ReorderParametersDto, ReorderNilaiDto, UpdateSummaryDto, ImportExportDto } from './dto/konsentrasi-produk-inherent.dto';
export declare class KonsentrasiProdukOjkController {
    private readonly inherentService;
    constructor(inherentService: KonsentrasiProdukOjkService);
    findAll(year?: number, quarter?: number): Promise<import("./entities/konsentrasi-produk-ojk.entity").KonsentrasiProdukOjk | import("./entities/konsentrasi-produk-ojk.entity").KonsentrasiProdukOjk[]>;
    getActive(): Promise<import("./entities/konsentrasi-produk-ojk.entity").KonsentrasiProdukOjk>;
    findOne(id: number): Promise<import("./entities/konsentrasi-produk-ojk.entity").KonsentrasiProdukOjk>;
    create(createDto: CreateKonsentrasiProdukInherentDto, req: any): Promise<import("./entities/konsentrasi-produk-ojk.entity").KonsentrasiProdukOjk>;
    update(id: number, updateDto: UpdateKonsentrasiProdukInherentDto, req: any): Promise<import("./entities/konsentrasi-produk-ojk.entity").KonsentrasiProdukOjk>;
    updateSummary(id: number, summaryDto: UpdateSummaryDto, req: any): Promise<import("./entities/konsentrasi-produk-ojk.entity").KonsentrasiProdukOjk>;
    updateActiveStatus(id: number, isActive: boolean, req: any): Promise<import("./entities/konsentrasi-produk-ojk.entity").KonsentrasiProdukOjk>;
    remove(id: number): Promise<{
        message: string;
        id: number;
    }>;
    getParameters(inherentId: number): Promise<import("./entities/konsentrasi-produk-paramter.entity").KonsentrasiParameter[]>;
    addParameter(inherentId: number, createParamDto: CreateParameterDto, req: any): Promise<import("./entities/konsentrasi-produk-paramter.entity").KonsentrasiParameter>;
    updateParameter(inherentId: number, parameterId: number, updateParamDto: UpdateParameterDto, req: any): Promise<import("./entities/konsentrasi-produk-paramter.entity").KonsentrasiParameter>;
    reorderParameters(inherentId: number, reorderDto: ReorderParametersDto): Promise<{
        message: string;
    }>;
    copyParameter(inherentId: number, parameterId: number, req: any): Promise<import("./entities/konsentrasi-produk-paramter.entity").KonsentrasiParameter>;
    removeParameter(inherentId: number, parameterId: number, req: any): Promise<{
        message: string;
        parameterId: number;
    }>;
    getNilai(inherentId: number, parameterId: number): Promise<import("./entities/konsentrasi-produk-nilai.entity").KonsentrasiNilai[]>;
    addNilai(inherentId: number, parameterId: number, createNilaiDto: CreateNilaiDto, req: any): Promise<{
        nomor: string;
        judul: {
            type: import("./dto/konsentrasi-produk-inherent.dto").JudulType;
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
        riskindikator: import("./dto/konsentrasi-produk-inherent.dto").RiskindikatorDto;
        parameterId: number;
        orderIndex: number;
    } & import("./entities/konsentrasi-produk-nilai.entity").KonsentrasiNilai>;
    updateNilai(inherentId: number, parameterId: number, nilaiId: number, updateNilaiDto: UpdateNilaiDto, req: any): Promise<import("./entities/konsentrasi-produk-nilai.entity").KonsentrasiNilai>;
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
    } & import("./entities/konsentrasi-produk-nilai.entity").KonsentrasiNilai>;
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
    } & import("./entities/konsentrasi-produk-ojk.entity").KonsentrasiProdukOjk>;
    getReferences(type?: string): Promise<import("./entities/konsentrasi-inherent-references.entity").InherentReferenceKonsentrasi[]>;
    checkExists(year: number, quarter: number): Promise<{
        exists: boolean;
        data: import("./entities/konsentrasi-produk-ojk.entity").KonsentrasiProdukOjk | null;
    }>;
    private getInherentByIdOrThrow;
    private getInherentByIdDirect;
}
