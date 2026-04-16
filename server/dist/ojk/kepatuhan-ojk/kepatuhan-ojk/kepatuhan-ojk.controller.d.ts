import { KepatuhanOjkService } from './kepatuhan-ojk.service';
import { CreateKepatuhanDto, UpdateKepatuhanDto, CreateParameterDto, UpdateParameterDto, CreateNilaiDto, UpdateNilaiDto, ReorderParametersDto, ReorderNilaiDto, UpdateSummaryDto, ImportExportDto } from './dto/kepatuhan-inherent.dto';
export declare class KepatuhanOjkController {
    private readonly kepatuhanService;
    constructor(kepatuhanService: KepatuhanOjkService);
    findAll(year?: number, quarter?: number): Promise<import("./entities/kepatuhan-ojk.entity").KepatuhanOjk | import("./entities/kepatuhan-ojk.entity").KepatuhanOjk[]>;
    getActive(): Promise<import("./entities/kepatuhan-ojk.entity").KepatuhanOjk>;
    findOne(id: number): Promise<import("./entities/kepatuhan-ojk.entity").KepatuhanOjk>;
    create(createDto: CreateKepatuhanDto, req: any): Promise<import("./entities/kepatuhan-ojk.entity").KepatuhanOjk>;
    update(id: number, updateDto: UpdateKepatuhanDto, req: any): Promise<import("./entities/kepatuhan-ojk.entity").KepatuhanOjk>;
    updateSummary(id: number, summaryDto: UpdateSummaryDto, req: any): Promise<import("./entities/kepatuhan-ojk.entity").KepatuhanOjk>;
    updateActiveStatus(id: number, isActive: boolean, req: any): Promise<import("./entities/kepatuhan-ojk.entity").KepatuhanOjk>;
    remove(id: number): Promise<{
        message: string;
        id: number;
    }>;
    getParameters(kepatuhanId: number): Promise<import("./entities/kepatuhan-paramater.entity").KepatuhanParameter[]>;
    addParameter(kepatuhanId: number, createParamDto: CreateParameterDto, req: any): Promise<import("./entities/kepatuhan-paramater.entity").KepatuhanParameter>;
    updateParameter(kepatuhanId: number, parameterId: number, updateParamDto: UpdateParameterDto, req: any): Promise<import("./entities/kepatuhan-paramater.entity").KepatuhanParameter>;
    reorderParameters(kepatuhanId: number, reorderDto: ReorderParametersDto): Promise<{
        message: string;
    }>;
    copyParameter(kepatuhanId: number, parameterId: number, req: any): Promise<import("./entities/kepatuhan-paramater.entity").KepatuhanParameter>;
    removeParameter(kepatuhanId: number, parameterId: number, req: any): Promise<{
        message: string;
        parameterId: number;
    }>;
    getNilai(kepatuhanId: number, parameterId: number): Promise<import("./entities/kepatuhan-nilai.entity").KepatuhanNilai[]>;
    addNilai(kepatuhanId: number, parameterId: number, createNilaiDto: CreateNilaiDto, req: any): Promise<{
        nomor: string;
        judul: {
            type: import("./dto/kepatuhan-inherent.dto").JudulType;
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
        riskindikator: import("./dto/kepatuhan-inherent.dto").RiskindikatorDto;
        parameterId: number;
        orderIndex: number;
    } & import("./entities/kepatuhan-nilai.entity").KepatuhanNilai>;
    updateNilai(kepatuhanId: number, parameterId: number, nilaiId: number, updateNilaiDto: UpdateNilaiDto, req: any): Promise<import("./entities/kepatuhan-nilai.entity").KepatuhanNilai>;
    reorderNilai(kepatuhanId: number, parameterId: number, reorderDto: ReorderNilaiDto): Promise<{
        message: string;
    }>;
    copyNilai(kepatuhanId: number, parameterId: number, nilaiId: number, req: any): Promise<{
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
    } & import("./entities/kepatuhan-nilai.entity").KepatuhanNilai>;
    removeNilai(kepatuhanId: number, parameterId: number, nilaiId: number, req: any): Promise<{
        message: string;
        nilaiId: number;
    }>;
    exportToExcel(kepatuhanId: number): Promise<{
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
    } & import("./entities/kepatuhan-ojk.entity").KepatuhanOjk>;
    getReferences(type?: string): Promise<import("./entities/kepatuhan-inherent-references.entity").KepatuhanReference[]>;
    checkExists(year: number, quarter: number): Promise<{
        exists: boolean;
        data: import("./entities/kepatuhan-ojk.entity").KepatuhanOjk | null;
    }>;
    private getKepatuhanByIdOrThrow;
    private getKepatuhanByIdDirect;
}
