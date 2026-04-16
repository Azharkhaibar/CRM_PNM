import { Repository, DataSource } from 'typeorm';
import { LikuiditasProdukOjk } from './entities/likuiditas-produk-ojk.entity';
import { LikuiditasParameter } from './entities/likuiditas-parameter.entity';
import { LikuiditasNilai } from './entities/likuditas-nilai.entity';
import { InherentReferenceLikuiditas } from './entities/likuditas-inherent-refrences.entity';
import { CreateLikuiditasProdukInherentDto, UpdateLikuiditasProdukInherentDto, CreateParameterDto, UpdateParameterDto, CreateNilaiDto, UpdateNilaiDto, ReorderParametersDto, ReorderNilaiDto, UpdateSummaryDto, JudulType } from './dto/likuditas-produk-inherent.dto';
export declare class LikuiditasProdukOjkService {
    private inherentRepository;
    private parameterRepository;
    private nilaiRepository;
    private referenceRepository;
    private dataSource;
    private readonly logger;
    constructor(inherentRepository: Repository<LikuiditasProdukOjk>, parameterRepository: Repository<LikuiditasParameter>, nilaiRepository: Repository<LikuiditasNilai>, referenceRepository: Repository<InherentReferenceLikuiditas>, dataSource: DataSource);
    create(createDto: CreateLikuiditasProdukInherentDto, userId: string): Promise<LikuiditasProdukOjk>;
    findActive(): Promise<LikuiditasProdukOjk | null>;
    findByYearQuarter(year: number, quarter: number): Promise<LikuiditasProdukOjk | null>;
    getAll(): Promise<LikuiditasProdukOjk[]>;
    update(id: number, updateDto: UpdateLikuiditasProdukInherentDto, userId: string): Promise<LikuiditasProdukOjk>;
    updateSummary(id: number, summaryDto: UpdateSummaryDto, userId: string): Promise<LikuiditasProdukOjk>;
    updateActiveStatus(id: number, isActive: boolean, userId: string): Promise<LikuiditasProdukOjk>;
    remove(id: number): Promise<{
        message: string;
        id: number;
    }>;
    addParameter(inherentId: number, createParamDto: CreateParameterDto, userId: string): Promise<LikuiditasParameter>;
    updateParameter(inherentId: number, parameterId: number, updateParamDto: UpdateParameterDto, userId: string): Promise<LikuiditasParameter>;
    reorderParameters(inherentId: number, reorderDto: ReorderParametersDto): Promise<{
        message: string;
    }>;
    copyParameter(inherentId: number, parameterId: number, userId: string): Promise<LikuiditasParameter>;
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
        riskindikator: import("./dto/likuditas-produk-inherent.dto").RiskindikatorDto;
        parameterId: number;
        orderIndex: number;
    } & LikuiditasNilai>;
    updateNilai(inherentId: number, parameterId: number, nilaiId: number, updateNilaiDto: UpdateNilaiDto, userId: string): Promise<LikuiditasNilai>;
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
    } & LikuiditasNilai>;
    removeNilai(inherentId: number, parameterId: number, nilaiId: number, userId: string): Promise<{
        message: string;
        nilaiId: number;
    }>;
    getReferences(type?: string): Promise<InherentReferenceLikuiditas[]>;
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
    } & LikuiditasProdukOjk>;
}
