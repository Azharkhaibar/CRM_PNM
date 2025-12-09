import { StratejikService } from './stratejik.service';
import { CreateStratejikDto } from './dto/create-stratejik.dto';
import { UpdateStratejikDto } from './dto/update-stratejik.dto';
import { CreateStratejikSectionDto } from './dto/create-stratejik-section.dto';
import { UpdateStratejikSectionDto } from './dto/update-stratejik-section.dto';
import { Quarter } from './entities/stratejik.entity';
export declare class StratejikController {
    private readonly stratejikService;
    constructor(stratejikService: StratejikService);
    create(createStratejikDto: CreateStratejikDto): Promise<import("./entities/stratejik.entity").Stratejik>;
    findAll(year?: number, quarter?: Quarter): Promise<import("./entities/stratejik.entity").Stratejik[]>;
    getSummary(year: number, quarter: Quarter): Promise<{
        year: number;
        quarter: Quarter;
        totalItems: number;
        totalWeighted: number;
        sections: unknown[];
        items: import("./entities/stratejik.entity").Stratejik[];
    }>;
    findBySection(sectionId: number, year?: number, quarter?: Quarter): Promise<import("./entities/stratejik.entity").Stratejik[]>;
    findOne(id: number): Promise<import("./entities/stratejik.entity").Stratejik>;
    update(id: number, updateStratejikDto: UpdateStratejikDto): Promise<import("./entities/stratejik.entity").Stratejik>;
    remove(id: number): Promise<void>;
    bulkCreate(createStratejikDtos: CreateStratejikDto[]): Promise<import("./entities/stratejik.entity").Stratejik[]>;
    createSection(createSectionDto: CreateStratejikSectionDto): Promise<import("./entities/stratejik-section.entity").StratejikSection>;
    findAllSections(): Promise<import("./entities/stratejik-section.entity").StratejikSection[]>;
    findSectionById(id: number): Promise<import("./entities/stratejik-section.entity").StratejikSection>;
    updateSection(id: number, updateSectionDto: UpdateStratejikSectionDto): Promise<import("./entities/stratejik-section.entity").StratejikSection>;
    deleteSection(id: number): Promise<void>;
}
