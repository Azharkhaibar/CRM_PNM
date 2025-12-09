import { ReputasiService } from './reputasi.service';
import { CreateReputasiDto } from './dto/create-reputasi.dto';
import { UpdateReputasiDto } from './dto/update-reputasi.dto';
import { CreateReputasiSectionDto } from './dto/create-reputasi-section.dto';
import { UpdateReputasiSectionDto } from './dto/update-reputasi-section.dto';
import { Quarter } from './entities/reputasi.entity';
export declare class ReputasiController {
    private readonly reputasiService;
    constructor(reputasiService: ReputasiService);
    create(createReputasiDto: CreateReputasiDto): Promise<import("./entities/reputasi.entity").Reputasi>;
    findAll(year?: number, quarter?: Quarter): Promise<import("./entities/reputasi.entity").Reputasi[]>;
    getSummary(year: number, quarter: Quarter): Promise<{
        year: number;
        quarter: Quarter;
        totalItems: number;
        totalWeighted: number;
        sections: unknown[];
        items: import("./entities/reputasi.entity").Reputasi[];
    }>;
    getReputasiScore(year: number, quarter: Quarter): Promise<number>;
    getRiskDistribution(year: number, quarter: Quarter): Promise<{
        year: number;
        quarter: Quarter;
        distribution: {
            low: number;
            lowToModerate: number;
            moderate: number;
            moderateToHigh: number;
            high: number;
        };
        totalItems: number;
    }>;
    findBySection(sectionId: number, year?: number, quarter?: Quarter): Promise<import("./entities/reputasi.entity").Reputasi[]>;
    findOne(id: number): Promise<import("./entities/reputasi.entity").Reputasi>;
    update(id: number, updateReputasiDto: UpdateReputasiDto): Promise<import("./entities/reputasi.entity").Reputasi>;
    remove(id: number): Promise<void>;
    deletePeriod(year: number, quarter: Quarter): Promise<number>;
    bulkCreate(createReputasiDtos: CreateReputasiDto[]): Promise<import("./entities/reputasi.entity").Reputasi[]>;
    createSection(createSectionDto: CreateReputasiSectionDto): Promise<import("./entities/reputasi-section.entity").ReputasiSection>;
    findAllSections(): Promise<import("./entities/reputasi-section.entity").ReputasiSection[]>;
    findSectionById(id: number): Promise<import("./entities/reputasi-section.entity").ReputasiSection>;
    updateSection(id: number, updateSectionDto: UpdateReputasiSectionDto): Promise<import("./entities/reputasi-section.entity").ReputasiSection>;
    deleteSection(id: number): Promise<void>;
}
