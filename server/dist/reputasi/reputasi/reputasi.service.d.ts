import { Repository } from 'typeorm';
import { CreateReputasiDto } from './dto/create-reputasi.dto';
import { UpdateReputasiDto } from './dto/update-reputasi.dto';
import { Reputasi, Quarter } from './entities/reputasi.entity';
import { ReputasiSection } from './entities/reputasi-section.entity';
import { CreateReputasiSectionDto } from './dto/create-reputasi-section.dto';
import { UpdateReputasiSectionDto } from './dto/update-reputasi-section.dto';
export declare class ReputasiService {
    private reputasiRepo;
    private sectionRepo;
    constructor(reputasiRepo: Repository<Reputasi>, sectionRepo: Repository<ReputasiSection>);
    createSection(data: CreateReputasiSectionDto): Promise<ReputasiSection>;
    findAllSection(): Promise<ReputasiSection[]>;
    findSectionById(id: number): Promise<ReputasiSection>;
    updateSection(id: number, data: UpdateReputasiSectionDto): Promise<ReputasiSection>;
    deleteSection(id: number): Promise<void>;
    findAll(): Promise<Reputasi[]>;
    findOne(id: number): Promise<Reputasi>;
    remove(id: number): Promise<void>;
    findByPeriod(year: number, quarter: Quarter): Promise<Reputasi[]>;
    findById(id: number): Promise<Reputasi>;
    private calculateHasil;
    private calculateWeight;
    create(data: CreateReputasiDto): Promise<Reputasi>;
    update(id: number, data: UpdateReputasiDto): Promise<Reputasi>;
    delete(id: number): Promise<void>;
    bulkCreate(data: CreateReputasiDto[]): Promise<Reputasi[]>;
    findByYear(year: number): Promise<Reputasi[]>;
    getSummary(year: number, quarter: Quarter): Promise<{
        year: number;
        quarter: Quarter;
        totalItems: number;
        totalWeighted: number;
        sections: unknown[];
        items: Reputasi[];
    }>;
    findBySection(sectionId: number, year?: number, quarter?: Quarter): Promise<Reputasi[]>;
    deleteByPeriod(year: number, quarter: Quarter): Promise<number>;
    getReputasiScore(year: number, quarter: Quarter): Promise<number>;
    getRiskLevelDistribution(year: number, quarter: Quarter): Promise<{
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
}
