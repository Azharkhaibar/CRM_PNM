import { KepatuhanService } from './kepatuhan.service';
import { CreateKepatuhanDto } from './dto/create-kepatuhan.dto';
import { UpdateKepatuhanDto } from './dto/update-kepatuhan.dto';
import { CreateKepatuhanSectionDto } from './dto/create-kepatuhan-section.dto';
import { UpdateKepatuhanSectionDto } from './dto/update-kepatuhan-section.dto';
import { Quarter } from './entities/kepatuhan.entity';
export declare class KepatuhanController {
    private readonly kepatuhanService;
    constructor(kepatuhanService: KepatuhanService);
    create(createKepatuhanDto: CreateKepatuhanDto): Promise<import("./entities/kepatuhan.entity").Kepatuhan>;
    findAll(year?: number, quarter?: Quarter): Promise<import("./entities/kepatuhan.entity").Kepatuhan[]>;
    getSummary(year: number, quarter: Quarter): Promise<{
        year: number;
        quarter: Quarter;
        totalItems: number;
        totalWeighted: number;
        sections: unknown[];
        items: import("./entities/kepatuhan.entity").Kepatuhan[];
    }>;
    findBySection(sectionId: number, year?: number, quarter?: Quarter): Promise<import("./entities/kepatuhan.entity").Kepatuhan[]>;
    findOne(id: number): Promise<import("./entities/kepatuhan.entity").Kepatuhan>;
    update(id: number, updateKepatuhanDto: UpdateKepatuhanDto): Promise<import("./entities/kepatuhan.entity").Kepatuhan>;
    remove(id: number): Promise<void>;
    deletePeriod(year: number, quarter: Quarter): Promise<number>;
    bulkCreate(createKepatuhanDtos: CreateKepatuhanDto[]): Promise<import("./entities/kepatuhan.entity").Kepatuhan[]>;
    createSection(createSectionDto: CreateKepatuhanSectionDto): Promise<import("./entities/kepatuhan-section.entity").KepatuhanSection>;
    findAllSections(): Promise<import("./entities/kepatuhan-section.entity").KepatuhanSection[]>;
    findSectionById(id: number): Promise<import("./entities/kepatuhan-section.entity").KepatuhanSection>;
    updateSection(id: number, updateSectionDto: UpdateKepatuhanSectionDto): Promise<import("./entities/kepatuhan-section.entity").KepatuhanSection>;
    deleteSection(id: number): Promise<void>;
}
