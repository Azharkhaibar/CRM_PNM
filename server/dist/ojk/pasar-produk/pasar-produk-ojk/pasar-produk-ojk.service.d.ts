import { Repository, DataSource } from 'typeorm';
import { PasarProdukOjk } from './entities/pasar-produk-ojk.entity';
import { PasarParameter } from './entities/pasar-produk-parameter.entity';
import { PasarNilai } from './entities/pasar-produk-nilai.entity';
import { InherentReferencePasar } from './entities/pasar-inherent-refetences.entity';
import { CreatePasarProdukInherentDto, UpdatePasarProdukInherentDto, CreateParameterDto, UpdateParameterDto, CreateNilaiDto, UpdateNilaiDto, ReorderParametersDto, ReorderNilaiDto, UpdateSummaryDto, JudulType } from './dto/pasar-produk-inherent.dto';
export declare class PasarProdukOjkService {
    private inherentRepository;
    private parameterRepository;
    private nilaiRepository;
    private referenceRepository;
    private dataSource;
    private readonly logger;
    constructor(inherentRepository: Repository<PasarProdukOjk>, parameterRepository: Repository<PasarParameter>, nilaiRepository: Repository<PasarNilai>, referenceRepository: Repository<InherentReferencePasar>, dataSource: DataSource);
    create(createDto: CreatePasarProdukInherentDto, userId: string): Promise<PasarProdukOjk>;
    findActive(): Promise<PasarProdukOjk | null>;
    findByYearQuarter(year: number, quarter: number): Promise<PasarProdukOjk | null>;
    getAll(): Promise<PasarProdukOjk[]>;
    update(id: number, updateDto: UpdatePasarProdukInherentDto, userId: string): Promise<PasarProdukOjk>;
    updateSummary(id: number, summaryDto: UpdateSummaryDto, userId: string): Promise<PasarProdukOjk>;
    updateActiveStatus(id: number, isActive: boolean, userId: string): Promise<PasarProdukOjk>;
    remove(id: number): Promise<{
        message: string;
        id: number;
    }>;
    addParameter(inherentId: number, createParamDto: CreateParameterDto, userId: string): Promise<PasarParameter>;
    updateParameter(inherentId: number, parameterId: number, updateParamDto: UpdateParameterDto, userId: string): Promise<PasarParameter>;
    reorderParameters(inherentId: number, reorderDto: ReorderParametersDto): Promise<{
        message: string;
    }>;
    copyParameter(inherentId: number, parameterId: number, userId: string): Promise<PasarParameter>;
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
        riskindikator: import("./dto/pasar-produk-inherent.dto").RiskindikatorDto;
        parameterId: number;
        orderIndex: number;
    } & PasarNilai>;
    updateNilai(inherentId: number, parameterId: number, nilaiId: number, updateNilaiDto: UpdateNilaiDto, userId: string): Promise<PasarNilai>;
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
    } & PasarNilai>;
    removeNilai(inherentId: number, parameterId: number, nilaiId: number, userId: string): Promise<{
        message: string;
        nilaiId: number;
    }>;
    getReferences(type?: string): Promise<InherentReferencePasar[]>;
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
    } & PasarProdukOjk>;
}
