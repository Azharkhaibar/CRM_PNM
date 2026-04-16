import { KreditProdukOjkService } from './kredit-produk-ojk.service';
import { CreateKreditProdukInherentDto, UpdateKreditProdukInherentDto, CreateParameterDto, UpdateParameterDto, CreateNilaiDto, UpdateNilaiDto, ReorderParametersDto, ReorderNilaiDto, UpdateSummaryDto, ImportExportDto } from './dto/kredit-produk-inherent.dto';
export declare class KreditProdukOjkController {
    private readonly inherentService;
    constructor(inherentService: KreditProdukOjkService);
    findAll(year?: number, quarter?: number): Promise<import("./entities/kredit-produk-ojk.entity").KreditProdukOjk | import("./entities/kredit-produk-ojk.entity").KreditProdukOjk[]>;
    getActive(): Promise<import("./entities/kredit-produk-ojk.entity").KreditProdukOjk>;
    findOne(id: number): Promise<import("./entities/kredit-produk-ojk.entity").KreditProdukOjk>;
    create(createDto: CreateKreditProdukInherentDto, req: any): Promise<import("./entities/kredit-produk-ojk.entity").KreditProdukOjk>;
    update(id: number, updateDto: UpdateKreditProdukInherentDto, req: any): Promise<import("./entities/kredit-produk-ojk.entity").KreditProdukOjk>;
    updateSummary(id: number, summaryDto: UpdateSummaryDto, req: any): Promise<import("./entities/kredit-produk-ojk.entity").KreditProdukOjk>;
    updateActiveStatus(id: number, isActive: boolean, req: any): Promise<import("./entities/kredit-produk-ojk.entity").KreditProdukOjk>;
    remove(id: number): Promise<{
        message: string;
        id: number;
    }>;
    getParameters(inherentId: number): Promise<import("./entities/kredit-produk-parameter.entity").KreditParameter[]>;
    addParameter(inherentId: number, createParamDto: CreateParameterDto, req: any): Promise<import("./entities/kredit-produk-parameter.entity").KreditParameter>;
    updateParameter(inherentId: number, parameterId: number, updateParamDto: UpdateParameterDto, req: any): Promise<import("./entities/kredit-produk-parameter.entity").KreditParameter>;
    reorderParameters(inherentId: number, reorderDto: ReorderParametersDto): Promise<{
        message: string;
    }>;
    copyParameter(inherentId: number, parameterId: number, req: any): Promise<import("./entities/kredit-produk-parameter.entity").KreditParameter>;
    removeParameter(inherentId: number, parameterId: number, req: any): Promise<{
        message: string;
        parameterId: number;
    }>;
    getNilai(inherentId: number, parameterId: number): Promise<import("./entities/kredit-produk-nilai.entity").KreditNilai[]>;
    addNilai(inherentId: number, parameterId: number, createNilaiDto: CreateNilaiDto, req: any): Promise<{
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
    updateNilai(inherentId: number, parameterId: number, nilaiId: number, updateNilaiDto: UpdateNilaiDto, req: any): Promise<import("./entities/kredit-produk-nilai.entity").KreditNilai>;
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
    } & import("./entities/kredit-produk-nilai.entity").KreditNilai>;
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
    } & import("./entities/kredit-produk-ojk.entity").KreditProdukOjk>;
    getReferences(type?: string): Promise<import("./entities/kredit-inherent-references.entity").InherentReferenceKredit[]>;
    checkExists(year: number, quarter: number): Promise<{
        exists: boolean;
        data: import("./entities/kredit-produk-ojk.entity").KreditProdukOjk | null;
    }>;
    private getInherentByIdOrThrow;
    private getInherentByIdDirect;
}
