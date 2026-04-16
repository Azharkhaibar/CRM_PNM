import { Repository, DataSource } from 'typeorm';
import { ReputasiOjk } from './entities/reputasi-ojk.entity';
import { ReputasiParameter } from './entities/reputasi-paramater.entity';
import { ReputasiNilai } from './entities/reputasi-nilai.entity';
import { ReputasiReference } from './entities/reputasi-inherent-references.entity';
import { CreateReputasiOjkDto, CreateParameterDto, CreateNilaiDto, UpdateNilaiDto, UpdateParameterDto, UpdateReputasiOjkDto, UpdateSummaryDto, ReorderNilaiDto, ReorderParametersDto, JudulType } from './dto/reputasi-inherent.dto';
export declare class ReputasiOjkService {
    private reputasiRepository;
    private parameterRepository;
    private nilaiRepository;
    private referenceRepository;
    private dataSource;
    private readonly logger;
    constructor(reputasiRepository: Repository<ReputasiOjk>, parameterRepository: Repository<ReputasiParameter>, nilaiRepository: Repository<ReputasiNilai>, referenceRepository: Repository<ReputasiReference>, dataSource: DataSource);
    create(createDto: CreateReputasiOjkDto, userId: string): Promise<ReputasiOjk>;
    findActive(): Promise<ReputasiOjk | null>;
    findByYearQuarter(year: number, quarter: number): Promise<ReputasiOjk | null>;
    getAll(): Promise<ReputasiOjk[]>;
    update(id: number, updateDto: UpdateReputasiOjkDto, userId: string): Promise<ReputasiOjk>;
    updateSummary(id: number, summaryDto: UpdateSummaryDto, userId: string): Promise<ReputasiOjk>;
    updateActiveStatus(id: number, isActive: boolean, userId: string): Promise<ReputasiOjk>;
    remove(id: number): Promise<{
        message: string;
        id: number;
    }>;
    addParameter(reputasiId: number, createParamDto: CreateParameterDto, userId: string): Promise<ReputasiParameter>;
    updateParameter(reputasiId: number, parameterId: number, updateParamDto: UpdateParameterDto, userId: string): Promise<ReputasiParameter>;
    reorderParameters(reputasiId: number, reorderDto: ReorderParametersDto): Promise<{
        message: string;
    }>;
    copyParameter(reputasiId: number, parameterId: number, userId: string): Promise<ReputasiParameter>;
    removeParameter(reputasiId: number, parameterId: number, userId: string): Promise<{
        message: string;
        parameterId: number;
    }>;
    addNilai(reputasiId: number, parameterId: number, createNilaiDto: CreateNilaiDto, userId: string): Promise<{
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
        riskindikator: import("./dto/reputasi-inherent.dto").RiskindikatorDto;
        parameterId: number;
        orderIndex: number;
    } & ReputasiNilai>;
    updateNilai(reputasiId: number, parameterId: number, nilaiId: number, updateNilaiDto: UpdateNilaiDto, userId: string): Promise<ReputasiNilai>;
    reorderNilai(parameterId: number, reorderDto: ReorderNilaiDto): Promise<{
        message: string;
    }>;
    copyNilai(reputasiId: number, parameterId: number, nilaiId: number, userId: string): Promise<{
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
    } & ReputasiNilai>;
    removeNilai(reputasiId: number, parameterId: number, nilaiId: number, userId: string): Promise<{
        message: string;
        nilaiId: number;
    }>;
    getReferences(type?: string): Promise<ReputasiReference[]>;
    validateModelTerstruktur(reputasiId: number): Promise<{
        isValid: boolean;
        warnings: string[];
        errors: string[];
    }>;
    exportToExcel(reputasiId: number): Promise<{
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
    } & ReputasiOjk>;
}
