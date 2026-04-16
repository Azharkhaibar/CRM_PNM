import { Repository, DataSource } from 'typeorm';
import { StrategisOjk } from './entities/strategis-ojk.entity';
import { StrategisParameter } from './entities/strategis-paramater.entity';
import { StrategisNilai } from './entities/strategis-nilai.entity';
import { StrategisReference } from './entities/strategis-inherent-references.entity';
import { CreateStrategisOjkDto, CreateParameterDto, CreateNilaiDto, UpdateNilaiDto, UpdateParameterDto, UpdateStrategisOjkDto, UpdateSummaryDto, ReorderNilaiDto, ReorderParametersDto, JudulType } from './dto/strategis-inherent.dto';
export declare class StrategisOjkService {
    private strategisRepository;
    private parameterRepository;
    private nilaiRepository;
    private referenceRepository;
    private dataSource;
    private readonly logger;
    constructor(strategisRepository: Repository<StrategisOjk>, parameterRepository: Repository<StrategisParameter>, nilaiRepository: Repository<StrategisNilai>, referenceRepository: Repository<StrategisReference>, dataSource: DataSource);
    create(createDto: CreateStrategisOjkDto, userId: string): Promise<StrategisOjk>;
    findActive(): Promise<StrategisOjk | null>;
    findByYearQuarter(year: number, quarter: number): Promise<StrategisOjk | null>;
    getAll(): Promise<StrategisOjk[]>;
    update(id: number, updateDto: UpdateStrategisOjkDto, userId: string): Promise<StrategisOjk>;
    updateSummary(id: number, summaryDto: UpdateSummaryDto, userId: string): Promise<StrategisOjk>;
    updateActiveStatus(id: number, isActive: boolean, userId: string): Promise<StrategisOjk>;
    remove(id: number): Promise<{
        message: string;
        id: number;
    }>;
    addParameter(strategisId: number, createParamDto: CreateParameterDto, userId: string): Promise<StrategisParameter>;
    updateParameter(strategisId: number, parameterId: number, updateParamDto: UpdateParameterDto, userId: string): Promise<StrategisParameter>;
    reorderParameters(strategisId: number, reorderDto: ReorderParametersDto): Promise<{
        message: string;
    }>;
    copyParameter(strategisId: number, parameterId: number, userId: string): Promise<StrategisParameter>;
    removeParameter(strategisId: number, parameterId: number, userId: string): Promise<{
        message: string;
        parameterId: number;
    }>;
    addNilai(strategisId: number, parameterId: number, createNilaiDto: CreateNilaiDto, userId: string): Promise<{
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
        riskindikator: import("./dto/strategis-inherent.dto").RiskindikatorDto;
        parameterId: number;
        orderIndex: number;
    } & StrategisNilai>;
    updateNilai(strategisId: number, parameterId: number, nilaiId: number, updateNilaiDto: UpdateNilaiDto, userId: string): Promise<StrategisNilai>;
    reorderNilai(parameterId: number, reorderDto: ReorderNilaiDto): Promise<{
        message: string;
    }>;
    copyNilai(strategisId: number, parameterId: number, nilaiId: number, userId: string): Promise<{
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
    } & StrategisNilai>;
    removeNilai(strategisId: number, parameterId: number, nilaiId: number, userId: string): Promise<{
        message: string;
        nilaiId: number;
    }>;
    getReferences(type?: string): Promise<StrategisReference[]>;
    validateModelTerstruktur(strategisId: number): Promise<{
        isValid: boolean;
        warnings: string[];
        errors: string[];
    }>;
    exportToExcel(strategisId: number): Promise<{
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
    } & StrategisOjk>;
}
