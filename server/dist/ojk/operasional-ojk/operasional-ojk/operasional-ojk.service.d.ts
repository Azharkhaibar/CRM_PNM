import { Repository, DataSource } from 'typeorm';
import { Operasional } from './entities/operasional-ojk.entity';
import { OperasionalParameter } from './entities/operasional-produk-parameter.entity';
import { OperasionalNilai } from './entities/operasional-produk-nilai.entity';
import { OperasionalReference } from './entities/operasional-inherent-references.entity';
import { CreateOperasionalDto, CreateParameterDto, CreateNilaiDto, UpdateOperasionalDto, UpdateParameterDto, UpdateNilaiDto, ReorderNilaiDto, ReorderParametersDto, UpdateSummaryDto, JudulType } from './dto/operasional-inherent.dto';
export declare class OperasionalService {
    private operasionalRepository;
    private parameterRepository;
    private nilaiRepository;
    private referenceRepository;
    private dataSource;
    private readonly logger;
    constructor(operasionalRepository: Repository<Operasional>, parameterRepository: Repository<OperasionalParameter>, nilaiRepository: Repository<OperasionalNilai>, referenceRepository: Repository<OperasionalReference>, dataSource: DataSource);
    create(createDto: CreateOperasionalDto, userId: string): Promise<Operasional>;
    findActive(): Promise<Operasional | null>;
    findByYearQuarter(year: number, quarter: number): Promise<Operasional | null>;
    findById(id: number): Promise<Operasional | null>;
    getAll(): Promise<Operasional[]>;
    update(id: number, updateDto: UpdateOperasionalDto, userId: string): Promise<Operasional>;
    updateSummary(id: number, summaryDto: UpdateSummaryDto, userId: string): Promise<Operasional>;
    updateActiveStatus(id: number, isActive: boolean, userId: string): Promise<Operasional>;
    remove(id: number): Promise<{
        message: string;
        id: number;
    }>;
    addParameter(operasionalId: number, createParamDto: CreateParameterDto, userId: string): Promise<OperasionalParameter>;
    updateParameter(operasionalId: number, parameterId: number, updateParamDto: UpdateParameterDto, userId: string): Promise<OperasionalParameter>;
    reorderParameters(operasionalId: number, reorderDto: ReorderParametersDto): Promise<{
        message: string;
    }>;
    copyParameter(operasionalId: number, parameterId: number, userId: string): Promise<OperasionalParameter>;
    removeParameter(operasionalId: number, parameterId: number, userId: string): Promise<{
        message: string;
        parameterId: number;
    }>;
    addNilai(operasionalId: number, parameterId: number, createNilaiDto: CreateNilaiDto, userId: string): Promise<{
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
        riskindikator: import("./dto/operasional-inherent.dto").RiskindikatorDto;
        parameterId: number;
        orderIndex: number;
    } & OperasionalNilai>;
    updateNilai(operasionalId: number, parameterId: number, nilaiId: number, updateNilaiDto: UpdateNilaiDto, userId: string): Promise<OperasionalNilai>;
    reorderNilai(parameterId: number, reorderDto: ReorderNilaiDto): Promise<{
        message: string;
    }>;
    copyNilai(operasionalId: number, parameterId: number, nilaiId: number, userId: string): Promise<{
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
    } & OperasionalNilai>;
    removeNilai(operasionalId: number, parameterId: number, nilaiId: number, userId: string): Promise<{
        message: string;
        nilaiId: number;
    }>;
    getReferences(type?: string): Promise<OperasionalReference[]>;
    validateModelTerstruktur(operasionalId: number): Promise<{
        isValid: boolean;
        warnings: string[];
        errors: string[];
    }>;
    exportToExcel(operasionalId: number): Promise<{
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
    } & Operasional>;
}
