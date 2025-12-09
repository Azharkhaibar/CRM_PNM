import { HukumService } from './hukum.service';
import { CreateHukumDto } from './dto/create-hukum.dto';
import { UpdateHukumDto } from './dto/update-hukum.dto';
import { CreateHukumSectionDto } from './dto/create-hukum-section.dto';
import { UpdateHukumSectionDto } from './dto/update-hukum-section.dto';
import { Quarter } from './entities/hukum.entity';
export declare class HukumController {
    private readonly hukumService;
    constructor(hukumService: HukumService);
    create(createHukumDto: CreateHukumDto): Promise<import("./entities/hukum.entity").Hukum>;
    findAll(year?: number, quarter?: Quarter): Promise<import("./entities/hukum.entity").Hukum[]>;
    getStructuredData(year: number, quarter: Quarter): Promise<unknown[]>;
    getSummary(year: number, quarter: Quarter): Promise<{
        year: number;
        quarter: Quarter;
        totalItems: number;
        totalWeighted: number;
        sections: unknown[];
        items: import("./entities/hukum.entity").Hukum[];
    }>;
    findBySection(sectionId: number, year?: number, quarter?: Quarter): Promise<import("./entities/hukum.entity").Hukum[]>;
    findOne(id: number): Promise<import("./entities/hukum.entity").Hukum>;
    update(id: number, updateHukumDto: UpdateHukumDto): Promise<import("./entities/hukum.entity").Hukum>;
    remove(id: number): Promise<void>;
    deletePeriod(year: number, quarter: Quarter): Promise<number>;
    bulkCreate(createHukumDtos: CreateHukumDto[]): Promise<import("./entities/hukum.entity").Hukum[]>;
    createSection(createSectionDto: CreateHukumSectionDto): Promise<import("./entities/hukum-section.entity").HukumSection>;
    findAllSections(): Promise<import("./entities/hukum-section.entity").HukumSection[]>;
    findSectionById(id: number): Promise<import("./entities/hukum-section.entity").HukumSection>;
    updateSection(id: number, updateSectionDto: UpdateHukumSectionDto): Promise<import("./entities/hukum-section.entity").HukumSection>;
    deleteSection(id: number): Promise<void>;
}
