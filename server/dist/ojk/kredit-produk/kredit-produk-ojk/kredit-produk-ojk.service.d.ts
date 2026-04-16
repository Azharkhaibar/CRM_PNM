import { Repository, DataSource } from 'typeorm';
import { KreditProdukOjk } from './entities/kredit-produk-ojk.entity';
import { KreditParameter } from './entities/kredit-produk-parameter.entity';
import { KreditNilai } from './entities/kredit-produk-nilai.entity';
import { InherentReferenceKredit } from './entities/kredit-inherent-references.entity';
import { CreateKreditProdukInherentDto, UpdateKreditProdukInherentDto, CreateParameterDto, UpdateParameterDto, CreateNilaiDto, UpdateNilaiDto, ReorderParametersDto, ReorderNilaiDto, UpdateSummaryDto, JudulType } from './dto/kredit-produk-inherent.dto';
export declare class KreditProdukOjkService {
    private inherentRepository;
    private parameterRepository;
    private nilaiRepository;
    private referenceRepository;
    private dataSource;
    private readonly logger;
    constructor(inherentRepository: Repository<KreditProdukOjk>, parameterRepository: Repository<KreditParameter>, nilaiRepository: Repository<KreditNilai>, referenceRepository: Repository<InherentReferenceKredit>, dataSource: DataSource);
    create(createDto: CreateKreditProdukInherentDto, userId: string): Promise<KreditProdukOjk>;
    findActive(): Promise<KreditProdukOjk | null>;
    findByYearQuarter(year: number, quarter: number): Promise<KreditProdukOjk | null>;
    getAll(): Promise<KreditProdukOjk[]>;
    update(id: number, updateDto: UpdateKreditProdukInherentDto, userId: string): Promise<KreditProdukOjk>;
    updateSummary(id: number, summaryDto: UpdateSummaryDto, userId: string): Promise<KreditProdukOjk>;
    updateActiveStatus(id: number, isActive: boolean, userId: string): Promise<KreditProdukOjk>;
    remove(id: number): Promise<{
        message: string;
        id: number;
    }>;
    addParameter(inherentId: number, createParamDto: CreateParameterDto, userId: string): Promise<KreditParameter>;
    updateParameter(inherentId: number, parameterId: number, updateParamDto: UpdateParameterDto, userId: string): Promise<KreditParameter>;
    reorderParameters(inherentId: number, reorderDto: ReorderParametersDto): Promise<{
        message: string;
    }>;
    copyParameter(inherentId: number, parameterId: number, userId: string): Promise<KreditParameter>;
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
        riskindikator: import("./dto/kredit-produk-inherent.dto").RiskindikatorDto;
        parameterId: number;
        orderIndex: number;
    } & KreditNilai>;
    updateNilai(inherentId: number, parameterId: number, nilaiId: number, updateNilaiDto: UpdateNilaiDto, userId: string): Promise<KreditNilai>;
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
    } & KreditNilai>;
    removeNilai(inherentId: number, parameterId: number, nilaiId: number, userId: string): Promise<{
        message: string;
        nilaiId: number;
    }>;
    getReferences(type?: string): Promise<InherentReferenceKredit[]>;
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
    } & KreditProdukOjk>;
}
