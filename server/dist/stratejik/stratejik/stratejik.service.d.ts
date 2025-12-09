import { CreateStratejikDto } from './dto/create-stratejik.dto';
import { UpdateStratejikDto } from './dto/update-stratejik.dto';
import { Repository } from 'typeorm';
import { Stratejik, Quarter } from './entities/stratejik.entity';
import { StratejikSection } from './entities/stratejik-section.entity';
import { CreateStratejikSectionDto } from './dto/create-stratejik-section.dto';
import { UpdateStratejikSectionDto } from './dto/update-stratejik-section.dto';
export declare class StratejikService {
    private stratejikRepo;
    private sectionRepo;
    constructor(stratejikRepo: Repository<Stratejik>, sectionRepo: Repository<StratejikSection>);
    createSection(data: CreateStratejikSectionDto): Promise<StratejikSection>;
    findAllSection(): Promise<StratejikSection[]>;
    findSectionById(id: number): Promise<StratejikSection>;
    updateSection(id: number, data: UpdateStratejikSectionDto): Promise<StratejikSection>;
    deleteSection(id: number): Promise<void>;
    findAll(): Promise<Stratejik[]>;
    findOne(id: number): Promise<Stratejik>;
    remove(id: number): Promise<void>;
    findByPeriod(year: number, quarter: Quarter): Promise<Stratejik[]>;
    findById(id: number): Promise<Stratejik>;
    private calculateHasil;
    private calculateWeight;
    create(data: CreateStratejikDto): Promise<Stratejik>;
    update(id: number, data: UpdateStratejikDto): Promise<Stratejik>;
    delete(id: number): Promise<void>;
    bulkCreate(data: CreateStratejikDto[]): Promise<Stratejik[]>;
    findByYear(year: number): Promise<Stratejik[]>;
    getSummary(year: number, quarter: Quarter): Promise<{
        year: number;
        quarter: Quarter;
        totalItems: number;
        totalWeighted: number;
        sections: unknown[];
        items: Stratejik[];
    }>;
    findBySection(sectionId: number, year?: number, quarter?: Quarter): Promise<Stratejik[]>;
}
