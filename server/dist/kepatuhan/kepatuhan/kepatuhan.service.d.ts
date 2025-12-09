import { CreateKepatuhanDto } from './dto/create-kepatuhan.dto';
import { UpdateKepatuhanDto } from './dto/update-kepatuhan.dto';
import { Repository } from 'typeorm';
import { Kepatuhan, Quarter } from './entities/kepatuhan.entity';
import { KepatuhanSection } from './entities/kepatuhan-section.entity';
import { CreateKepatuhanSectionDto } from './dto/create-kepatuhan-section.dto';
import { UpdateKepatuhanSectionDto } from './dto/update-kepatuhan-section.dto';
export declare class KepatuhanService {
    private kepatuhanRepo;
    private sectionRepo;
    constructor(kepatuhanRepo: Repository<Kepatuhan>, sectionRepo: Repository<KepatuhanSection>);
    createSection(data: CreateKepatuhanSectionDto): Promise<KepatuhanSection>;
    findAllSection(): Promise<KepatuhanSection[]>;
    findSectionById(id: number): Promise<KepatuhanSection>;
    updateSection(id: number, data: UpdateKepatuhanSectionDto): Promise<KepatuhanSection>;
    deleteSection(id: number): Promise<void>;
    findAll(): Promise<Kepatuhan[]>;
    findOne(id: number): Promise<Kepatuhan>;
    remove(id: number): Promise<void>;
    findByPeriod(year: number, quarter: Quarter): Promise<Kepatuhan[]>;
    findById(id: number): Promise<Kepatuhan>;
    private calculateHasil;
    private calculateWeight;
    create(data: CreateKepatuhanDto): Promise<Kepatuhan>;
    update(id: number, data: UpdateKepatuhanDto): Promise<Kepatuhan>;
    delete(id: number): Promise<void>;
    bulkCreate(data: CreateKepatuhanDto[]): Promise<Kepatuhan[]>;
    findByYear(year: number): Promise<Kepatuhan[]>;
    getSummary(year: number, quarter: Quarter): Promise<{
        year: number;
        quarter: Quarter;
        totalItems: number;
        totalWeighted: number;
        sections: unknown[];
        items: Kepatuhan[];
    }>;
    findBySection(sectionId: number, year?: number, quarter?: Quarter): Promise<Kepatuhan[]>;
    deleteByPeriod(year: number, quarter: Quarter): Promise<number>;
}
