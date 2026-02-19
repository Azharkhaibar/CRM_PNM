import { RasService } from './ras.service';
import { CreateRasDto } from './dto/create-ra.dto';
import { UpdateRasDto } from './dto/update-ra.dto';
import { UpdateMonthlyValuesDto } from './dto/update-monthly-values.dto';
import { FilterRasDto } from './dto/filter-ras.dto';
import { ImportRasDto } from './dto/import-ras.dto';
export declare class RasController {
    private readonly rasService;
    constructor(rasService: RasService);
    create(createRasDto: CreateRasDto): Promise<import("./entities/ras.entity").RasData>;
    findAll(filterDto: FilterRasDto): Promise<import("./entities/ras.entity").RasData[]>;
    getCategories(): Promise<string[]>;
    getYearlyData(year: number): Promise<import("./entities/ras.entity").RasData[]>;
    getYearlyStats(year: number): Promise<any[]>;
    getMonthlyData(year: number, month?: string): Promise<import("./entities/ras.entity").RasData[]>;
    getFollowUpItems(year: number, month: number): Promise<import("./entities/ras.entity").RasData[]>;
    exportMonthlyData(year: number, months: string): Promise<any[]>;
    findOne(id: number): Promise<import("./entities/ras.entity").RasData>;
    update(id: number, updateRasDto: UpdateRasDto): Promise<import("./entities/ras.entity").RasData>;
    updateMonthlyValues(id: number, updateMonthlyValuesDto: UpdateMonthlyValuesDto): Promise<import("./entities/ras.entity").RasData>;
    updateTindakLanjut(id: number, tindakLanjut: UpdateRasDto['tindakLanjut']): Promise<import("./entities/ras.entity").RasData>;
    remove(id: number): Promise<void>;
    importData(importRasDto: ImportRasDto): Promise<import("./entities/ras.entity").RasData[]>;
}
