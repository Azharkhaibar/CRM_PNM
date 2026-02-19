import { KreditProdukOjkService } from './kredit-produk-ojk.service';
import { CreateKreditProdukDto, CreateParameterDto, CreateNilaiDto, UpdateKreditProdukDto, UpdateParameterDto, UpdateNilaiDto, ReorderNilaiDto, ReorderParametersDto, UpdateSummaryDto, ImportExportDto } from './dto/kredit-produk-inherent.dto';
export declare class KreditProdukOjkController {
    private readonly kreditService;
    constructor(kreditService: KreditProdukOjkService);
    findAll(year?: number, quarter?: number): Promise<import("./entities/kredit-produk-ojk.entity").KreditProdukOjk | import("./entities/kredit-produk-ojk.entity").KreditProdukOjk[]>;
    getActive(): Promise<import("./entities/kredit-produk-ojk.entity").KreditProdukOjk>;
    findOne(id: number): Promise<import("./entities/kredit-produk-ojk.entity").KreditProdukOjk>;
    create(createDto: CreateKreditProdukDto, req: any): Promise<import("./entities/kredit-produk-ojk.entity").KreditProdukOjk>;
    update(id: number, updateDto: UpdateKreditProdukDto, req: any): Promise<import("./entities/kredit-produk-ojk.entity").KreditProdukOjk>;
    updateSummary(id: number, summaryDto: UpdateSummaryDto, req: any): Promise<import("./entities/kredit-produk-ojk.entity").KreditProdukOjk>;
    updateActiveStatus(id: number, isActive: boolean, req: any): Promise<import("./entities/kredit-produk-ojk.entity").KreditProdukOjk>;
    remove(id: number): Promise<{
        message: string;
        id: number;
    }>;
    getParameters(kreditId: number): Promise<import("./entities/kredit-produk-parameter.entity").KreditParameter[]>;
    addParameter(kreditId: number, createParamDto: CreateParameterDto, req: any): Promise<import("./entities/kredit-produk-parameter.entity").KreditParameter>;
    updateParameter(kreditId: number, parameterId: number, updateParamDto: UpdateParameterDto, req: any): Promise<import("./entities/kredit-produk-parameter.entity").KreditParameter>;
    reorderParameters(kreditId: number, reorderDto: ReorderParametersDto): Promise<{
        message: string;
    }>;
    copyParameter(kreditId: number, parameterId: number, req: any): Promise<import("./entities/kredit-produk-parameter.entity").KreditParameter>;
    removeParameter(kreditId: number, parameterId: number, req: any): Promise<{
        message: string;
        parameterId: number;
    }>;
    getNilai(kreditId: number, parameterId: number): Promise<import("./entities/kredit-produk-nilai.entity").KreditNilai[]>;
    addNilai(kreditId: number, parameterId: number, createNilaiDto: CreateNilaiDto, req: any): Promise<{
        nomor: string;
        judul: {
            type: import("./dto/kredit-produk-inherent.dto").JudulType;
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
        riskindikator: import("./dto/kredit-produk-inherent.dto").RiskindikatorDto;
        parameterId: number;
        orderIndex: number;
    } & import("./entities/kredit-produk-nilai.entity").KreditNilai>;
    updateNilai(kreditId: number, parameterId: number, nilaiId: number, updateNilaiDto: UpdateNilaiDto, req: any): Promise<import("./entities/kredit-produk-nilai.entity").KreditNilai>;
    reorderNilai(kreditId: number, parameterId: number, reorderDto: ReorderNilaiDto): Promise<{
        message: string;
    }>;
    copyNilai(kreditId: number, parameterId: number, nilaiId: number, req: any): Promise<{
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
    } & import("./entities/kredit-produk-nilai.entity").KreditNilai>;
    removeNilai(kreditId: number, parameterId: number, nilaiId: number, req: any): Promise<{
        message: string;
        nilaiId: number;
    }>;
    exportToExcel(kreditId: number): Promise<{
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
    } & import("./entities/kredit-produk-ojk.entity").KreditProdukOjk>;
    getReferences(type?: string): Promise<import("./entities/kredit-inherent-references.entity").InherentReferenceKredit[]>;
    validateModel(kreditId: number): Promise<{
        isValid: boolean;
        warnings: string[];
        errors: string[];
    }>;
    checkExists(year: number, quarter: number): Promise<{
        exists: boolean;
        data: import("./entities/kredit-produk-ojk.entity").KreditProdukOjk | null;
    }>;
    private getKreditByIdOrThrow;
    private getKreditByIdDirect;
}
