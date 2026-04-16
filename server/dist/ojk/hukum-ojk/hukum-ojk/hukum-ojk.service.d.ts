import { Repository, DataSource } from 'typeorm';
import { HukumOjk } from './entities/hukum-ojk.entity';
import { HukumParameter } from './entities/hukum-paramater.entity';
import { HukumNilai } from './entities/hukum-nilai.entity';
import { InherentReferenceHukum } from './entities/hukum-inherent-references.entity';
import { CreateHukumInherentDto, UpdateHukumInherentDto, CreateParameterDto, UpdateParameterDto, CreateNilaiDto, UpdateNilaiDto, ReorderParametersDto, ReorderNilaiDto, UpdateSummaryDto, JudulType } from './dto/hukum-inherent.dto';
export declare class HukumOjkService {
    private inherentRepository;
    private parameterRepository;
    private nilaiRepository;
    private referenceRepository;
    private dataSource;
    private readonly logger;
    constructor(inherentRepository: Repository<HukumOjk>, parameterRepository: Repository<HukumParameter>, nilaiRepository: Repository<HukumNilai>, referenceRepository: Repository<InherentReferenceHukum>, dataSource: DataSource);
    create(createDto: CreateHukumInherentDto, userId: string): Promise<HukumOjk>;
    findActive(): Promise<HukumOjk | null>;
    findByYearQuarter(year: number, quarter: number): Promise<HukumOjk | null>;
    getAll(): Promise<HukumOjk[]>;
    update(id: number, updateDto: UpdateHukumInherentDto, userId: string): Promise<HukumOjk>;
    updateSummary(id: number, summaryDto: UpdateSummaryDto, userId: string): Promise<HukumOjk>;
    updateActiveStatus(id: number, isActive: boolean, userId: string): Promise<HukumOjk>;
    remove(id: number): Promise<{
        message: string;
        id: number;
    }>;
    addParameter(inherentId: number, createParamDto: CreateParameterDto, userId: string): Promise<HukumParameter>;
    updateParameter(inherentId: number, parameterId: number, updateParamDto: UpdateParameterDto, userId: string): Promise<HukumParameter>;
    reorderParameters(inherentId: number, reorderDto: ReorderParametersDto): Promise<{
        message: string;
    }>;
    copyParameter(inherentId: number, parameterId: number, userId: string): Promise<HukumParameter>;
    removeParameter(inherentId: number, parameterId: number, userId: string): Promise<{
        message: string;
        parameterId: number;
    }>;
    addNilai(inherentId: number, parameterId: number, createNilaiDto: CreateNilaiDto, userId: string): Promise<{
        nomor: string;
        judul: {
            type: JudulType;
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
    } & HukumNilai>;
    updateNilai(inherentId: number, parameterId: number, nilaiId: number, updateNilaiDto: UpdateNilaiDto, userId: string): Promise<HukumNilai>;
    reorderNilai(parameterId: number, reorderDto: ReorderNilaiDto): Promise<{
        message: string;
    }>;
    copyNilai(inherentId: number, parameterId: number, nilaiId: number, userId: string): Promise<{
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
    } & HukumNilai>;
    removeNilai(inherentId: number, parameterId: number, nilaiId: number, userId: string): Promise<{
        message: string;
        nilaiId: number;
    }>;
    getReferences(type?: string): Promise<InherentReferenceHukum[]>;
    validateModelTerstruktur(inherentId: number): Promise<{
        isValid: boolean;
        warnings: string[];
        errors: string[];
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
    importFromExcel(importData: any, userId: string): Promise<{
        year: any;
        quarter: any;
        summary: any;
        isActive: boolean;
        createdBy: string;
        updatedBy: string;
    } & HukumOjk>;
}
