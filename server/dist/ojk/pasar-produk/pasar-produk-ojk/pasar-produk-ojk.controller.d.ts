import { PasarProdukOjkService } from './pasar-produk-ojk.service';
import { CreatePasarProdukInherentDto, UpdatePasarProdukInherentDto, CreateParameterDto, UpdateParameterDto, CreateNilaiDto, UpdateNilaiDto, ReorderParametersDto, ReorderNilaiDto, UpdateSummaryDto, ImportExportDto } from './dto/pasar-produk-inherent.dto';
export declare class PasarProdukOjkController {
    private readonly inherentService;
    constructor(inherentService: PasarProdukOjkService);
    findAll(year?: number, quarter?: number): Promise<import("./entities/pasar-produk-ojk.entity").PasarProdukOjk | import("./entities/pasar-produk-ojk.entity").PasarProdukOjk[]>;
    getActive(): Promise<import("./entities/pasar-produk-ojk.entity").PasarProdukOjk>;
    findOne(id: number): Promise<import("./entities/pasar-produk-ojk.entity").PasarProdukOjk>;
    create(createDto: CreatePasarProdukInherentDto, req: any): Promise<import("./entities/pasar-produk-ojk.entity").PasarProdukOjk>;
    update(id: number, updateDto: UpdatePasarProdukInherentDto, req: any): Promise<import("./entities/pasar-produk-ojk.entity").PasarProdukOjk>;
    updateSummary(id: number, summaryDto: UpdateSummaryDto, req: any): Promise<import("./entities/pasar-produk-ojk.entity").PasarProdukOjk>;
    updateActiveStatus(id: number, isActive: boolean, req: any): Promise<import("./entities/pasar-produk-ojk.entity").PasarProdukOjk>;
    remove(id: number): Promise<{
        message: string;
        id: number;
    }>;
    getParameters(inherentId: number): Promise<import("./entities/pasar-produk-parameter.entity").PasarParameter[]>;
    addParameter(inherentId: number, createParamDto: CreateParameterDto, req: any): Promise<import("./entities/pasar-produk-parameter.entity").PasarParameter>;
    updateParameter(inherentId: number, parameterId: number, updateParamDto: UpdateParameterDto, req: any): Promise<import("./entities/pasar-produk-parameter.entity").PasarParameter>;
    reorderParameters(inherentId: number, reorderDto: ReorderParametersDto): Promise<{
        message: string;
    }>;
    copyParameter(inherentId: number, parameterId: number, req: any): Promise<import("./entities/pasar-produk-parameter.entity").PasarParameter>;
    removeParameter(inherentId: number, parameterId: number, req: any): Promise<{
        message: string;
        parameterId: number;
    }>;
    getNilai(inherentId: number, parameterId: number): Promise<import("./entities/pasar-produk-nilai.entity").PasarNilai[]>;
    addNilai(inherentId: number, parameterId: number, createNilaiDto: CreateNilaiDto, req: any): Promise<{
        nomor: string;
        judul: {
            type: import("./dto/pasar-produk-inherent.dto").JudulType;
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
        riskindikator: import("./dto/pasar-produk-inherent.dto").RiskindikatorDto;
        parameterId: number;
        orderIndex: number;
    } & import("./entities/pasar-produk-nilai.entity").PasarNilai>;
    updateNilai(inherentId: number, parameterId: number, nilaiId: number, updateNilaiDto: UpdateNilaiDto, req: any): Promise<import("./entities/pasar-produk-nilai.entity").PasarNilai>;
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
    } & import("./entities/pasar-produk-nilai.entity").PasarNilai>;
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
    } & import("./entities/pasar-produk-ojk.entity").PasarProdukOjk>;
    getReferences(type?: string): Promise<import("./entities/pasar-inherent-refetences.entity").InherentReferencePasar[]>;
    checkExists(year: number, quarter: number): Promise<{
        exists: boolean;
        data: import("./entities/pasar-produk-ojk.entity").PasarProdukOjk | null;
    }>;
    private getInherentByIdOrThrow;
    private getInherentByIdDirect;
}
