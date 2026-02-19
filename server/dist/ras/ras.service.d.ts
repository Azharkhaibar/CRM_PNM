import { Repository } from 'typeorm';
import { RasData } from './entities/ras.entity';
import { CreateRasDto } from './dto/create-ra.dto';
import { UpdateRasDto } from './dto/update-ra.dto';
import { UpdateMonthlyValuesDto } from './dto/update-monthly-values.dto';
import { FilterRasDto } from './dto/filter-ras.dto';
import { ImportRasDto } from './dto/import-ras.dto';
export declare class RasService {
    private readonly rasRepository;
    private readonly logger;
    constructor(rasRepository: Repository<RasData>);
    create(createRasDto: CreateRasDto): Promise<RasData>;
    findAll(filterDto?: FilterRasDto): Promise<RasData[]>;
    findByYearAndMonth(year: number, month?: number): Promise<RasData[]>;
    getRiskCategories(): Promise<string[]>;
    findOne(id: number): Promise<RasData>;
    update(id: number, updateRasDto: UpdateRasDto): Promise<RasData>;
    updateMonthlyValues(id: number, updateMonthlyValuesDto: UpdateMonthlyValuesDto): Promise<RasData>;
    updateTindakLanjut(id: number, tindakLanjut: any): Promise<RasData>;
    remove(id: number): Promise<void>;
    getYearlyStats(year: number): Promise<any[]>;
    importData(importRasDto: ImportRasDto): Promise<RasData[]>;
    exportMonthlyData(year: number, months: number[]): Promise<any[]>;
    getItemsNeedingFollowUp(year: number, month: number): Promise<RasData[]>;
    private getHistoricalItem;
    private calculateStats;
    private calculateActualValue;
    private normalizeUnitValue;
    private parseNumber;
    healthCheck(): Promise<{
        status: string;
        message: string;
        timestamp: string;
    }>;
}
