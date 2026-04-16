import { Repository, DataSource } from 'typeorm';
import { RentabilitasProdukOjk } from './entities/rentabilitas-ojk.entity';
import { RentabilitasParameter } from './entities/rentabilitas-parameter.entity';
import { RentabilitasNilai } from './entities/rentabilitas-nilai.entity';
import { InherentReferenceRentabilitas } from './entities/rentabilitas-inherent-references.entity';
import { CreateRentabilitasInherentDto, UpdateRentabilitasInherentDto, CreateParameterDto, UpdateParameterDto, CreateNilaiDto, UpdateNilaiDto, ReorderParametersDto, ReorderNilaiDto, UpdateSummaryDto, JudulType } from './dto/rentabilitas-inherent.dto';
export declare class RentabilitasProdukOjkService {
    private inherentRepository;
    private parameterRepository;
    private nilaiRepository;
    private referenceRepository;
    private dataSource;
    private readonly logger;
    constructor(inherentRepository: Repository<RentabilitasProdukOjk>, parameterRepository: Repository<RentabilitasParameter>, nilaiRepository: Repository<RentabilitasNilai>, referenceRepository: Repository<InherentReferenceRentabilitas>, dataSource: DataSource);
    create(createDto: CreateRentabilitasInherentDto, userId: string): Promise<RentabilitasProdukOjk>;
    findActive(): Promise<RentabilitasProdukOjk | null>;
    findByYearQuarter(year: number, quarter: number): Promise<RentabilitasProdukOjk | null>;
    getAll(): Promise<RentabilitasProdukOjk[]>;
    update(id: number, updateDto: UpdateRentabilitasInherentDto, userId: string): Promise<RentabilitasProdukOjk>;
    updateSummary(id: number, summaryDto: UpdateSummaryDto, userId: string): Promise<RentabilitasProdukOjk>;
    updateActiveStatus(id: number, isActive: boolean, userId: string): Promise<RentabilitasProdukOjk>;
    remove(id: number): Promise<{
        message: string;
        id: number;
    }>;
    addParameter(inherentId: number, createParamDto: CreateParameterDto, userId: string): Promise<RentabilitasParameter>;
    updateParameter(inherentId: number, parameterId: number, updateParamDto: UpdateParameterDto, userId: string): Promise<RentabilitasParameter>;
    reorderParameters(inherentId: number, reorderDto: ReorderParametersDto): Promise<{
        message: string;
    }>;
    copyParameter(inherentId: number, parameterId: number, userId: string): Promise<RentabilitasParameter>;
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
        riskindikator: import("./dto/rentabilitas-inherent.dto").RiskindikatorDto;
        parameterId: number;
        orderIndex: number;
    } & RentabilitasNilai>;
    updateNilai(inherentId: number, parameterId: number, nilaiId: number, updateNilaiDto: UpdateNilaiDto, userId: string): Promise<RentabilitasNilai>;
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
    } & RentabilitasNilai>;
    removeNilai(inherentId: number, parameterId: number, nilaiId: number, userId: string): Promise<{
        message: string;
        nilaiId: number;
    }>;
    getReferences(type?: string): Promise<InherentReferenceRentabilitas[]>;
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
    } & RentabilitasProdukOjk>;
}
