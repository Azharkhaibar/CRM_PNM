import { InvestasiService } from './new-investasi.service';
import { CreateInvestasiDto } from './dto/create-new-investasi.dto';
import { UpdateInvestasiDto } from './dto/update-new-investasi.dto';
import { CreateSectionDto } from './dto/create-investasi-section.dto';
import { UpdateInvestasiSectionDto } from './dto/update-new-investasi.dto';
import { Quarter } from './entities/new-investasi.entity';
export declare class NewInvestasiController {
    private readonly investasiService;
    constructor(investasiService: InvestasiService);
    getSections(): Promise<import("./entities/new-investasi-section.entity").InvestasiSection[]>;
    getSection(id: string): Promise<import("./entities/new-investasi-section.entity").InvestasiSection>;
    createSection(data: CreateSectionDto): Promise<import("./entities/new-investasi-section.entity").InvestasiSection>;
    updateSection(id: string, data: UpdateInvestasiSectionDto): Promise<import("./entities/new-investasi-section.entity").InvestasiSection>;
    deleteSection(id: string): Promise<void>;
    getInvestasiByPeriod(year: string, quarter: Quarter): Promise<import("./entities/new-investasi.entity").Investasi[]>;
    getSummary(year: string, quarter: Quarter): Promise<any>;
    getInvestasi(id: string): Promise<import("./entities/new-investasi.entity").Investasi>;
    createInvestasi(data: CreateInvestasiDto): Promise<import("./entities/new-investasi.entity").Investasi>;
    updateInvestasi(id: string, data: UpdateInvestasiDto): Promise<import("./entities/new-investasi.entity").Investasi>;
    deleteInvestasi(id: string): Promise<void>;
}
