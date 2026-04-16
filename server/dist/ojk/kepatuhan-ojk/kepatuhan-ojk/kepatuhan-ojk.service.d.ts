import { Repository, DataSource } from 'typeorm';
import { KepatuhanOjk } from './entities/kepatuhan-ojk.entity';
import { KepatuhanParameter } from './entities/kepatuhan-paramater.entity';
import { KepatuhanNilai } from './entities/kepatuhan-nilai.entity';
import { KepatuhanReference } from './entities/kepatuhan-inherent-references.entity';
import { CreateKepatuhanDto, CreateNilaiDto, CreateParameterDto, UpdateKepatuhanDto, UpdateNilaiDto, UpdateParameterDto, UpdateSummaryDto, ReorderNilaiDto, ReorderParametersDto, JudulType } from './dto/kepatuhan-inherent.dto';
export declare class KepatuhanOjkService {
    private kepatuhanRepository;
    private parameterRepository;
    private nilaiRepository;
    private referenceRepository;
    private dataSource;
    private readonly logger;
    constructor(kepatuhanRepository: Repository<KepatuhanOjk>, parameterRepository: Repository<KepatuhanParameter>, nilaiRepository: Repository<KepatuhanNilai>, referenceRepository: Repository<KepatuhanReference>, dataSource: DataSource);
    create(createDto: CreateKepatuhanDto, userId: string): Promise<KepatuhanOjk>;
    findActive(): Promise<KepatuhanOjk | null>;
    findByYearQuarter(year: number, quarter: number): Promise<KepatuhanOjk | null>;
    getAll(): Promise<KepatuhanOjk[]>;
    update(id: number, updateDto: UpdateKepatuhanDto, userId: string): Promise<KepatuhanOjk>;
    updateSummary(id: number, summaryDto: UpdateSummaryDto, userId: string): Promise<KepatuhanOjk>;
    updateActiveStatus(id: number, isActive: boolean, userId: string): Promise<KepatuhanOjk>;
    remove(id: number): Promise<{
        message: string;
        id: number;
    }>;
    addParameter(kepatuhanId: number, createParamDto: CreateParameterDto, userId: string): Promise<KepatuhanParameter>;
    updateParameter(kepatuhanId: number, parameterId: number, updateParamDto: UpdateParameterDto, userId: string): Promise<KepatuhanParameter>;
    reorderParameters(kepatuhanId: number, reorderDto: ReorderParametersDto): Promise<{
        message: string;
    }>;
    copyParameter(kepatuhanId: number, parameterId: number, userId: string): Promise<KepatuhanParameter>;
    removeParameter(kepatuhanId: number, parameterId: number, userId: string): Promise<{
        message: string;
        parameterId: number;
    }>;
    addNilai(kepatuhanId: number, parameterId: number, createNilaiDto: CreateNilaiDto, userId: string): Promise<{
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
        riskindikator: import("./dto/kepatuhan-inherent.dto").RiskindikatorDto;
        parameterId: number;
        orderIndex: number;
    } & KepatuhanNilai>;
    updateNilai(kepatuhanId: number, parameterId: number, nilaiId: number, updateNilaiDto: UpdateNilaiDto, userId: string): Promise<KepatuhanNilai>;
    reorderNilai(parameterId: number, reorderDto: ReorderNilaiDto): Promise<{
        message: string;
    }>;
    copyNilai(kepatuhanId: number, parameterId: number, nilaiId: number, userId: string): Promise<{
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
    } & KepatuhanNilai>;
    removeNilai(kepatuhanId: number, parameterId: number, nilaiId: number, userId: string): Promise<{
        message: string;
        nilaiId: number;
    }>;
    getReferences(type?: string): Promise<KepatuhanReference[]>;
    validateModelTerstruktur(kepatuhanId: number): Promise<{
        isValid: boolean;
        warnings: string[];
        errors: string[];
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
    importFromExcel(importData: any, userId: string): Promise<{
        year: any;
        quarter: any;
        summary: any;
        isActive: boolean;
        createdBy: string;
        updatedBy: string;
    } & KepatuhanOjk>;
}
