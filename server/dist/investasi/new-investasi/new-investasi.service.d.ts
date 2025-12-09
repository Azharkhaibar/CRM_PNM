import { Repository } from 'typeorm';
import { Investasi, Quarter } from './entities/new-investasi.entity';
import { InvestasiSection } from './entities/new-investasi-section.entity';
import { CreateInvestasiDto } from './dto/create-new-investasi.dto';
import { UpdateInvestasiDto } from './dto/update-new-investasi.dto';
import { CreateSectionDto } from './dto/create-investasi-section.dto';
import { UpdateInvestasiSectionDto } from './dto/update-new-investasi.dto';
export declare class InvestasiService {
    private investasiRepo;
    private sectionRepo;
    constructor(investasiRepo: Repository<Investasi>, sectionRepo: Repository<InvestasiSection>);
    findAllSections(): Promise<InvestasiSection[]>;
    findSectionById(id: number): Promise<InvestasiSection>;
    createSection(data: CreateSectionDto): Promise<InvestasiSection>;
    updateSection(id: number, data: UpdateInvestasiSectionDto): Promise<InvestasiSection>;
    deleteSection(id: number): Promise<void>;
    findByPeriod(year: number, quarter: Quarter): Promise<Investasi[]>;
    findById(id: number): Promise<Investasi>;
    create(data: CreateInvestasiDto): Promise<Investasi>;
    update(id: number, data: UpdateInvestasiDto): Promise<Investasi>;
    delete(id: number): Promise<void>;
    getSummary(year: number, quarter: Quarter): Promise<any>;
    private calculateHasil;
    private calculateWeighted;
}
