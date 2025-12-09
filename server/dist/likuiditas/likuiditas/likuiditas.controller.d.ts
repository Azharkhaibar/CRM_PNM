import { LikuiditasService } from './likuiditas.service';
import { CreateSectionLikuiditasDto, CreateIndikatorLikuiditasDto } from './dto/create-likuiditas.dto';
import { UpdateSectionLikuiditasDto, UpdateIndikatorLikuiditasDto } from './dto/update-likuidita.dto';
import { Quarter } from './entities/likuiditas.entity';
export declare class LikuiditasController {
    private readonly likuiditasService;
    constructor(likuiditasService: LikuiditasService);
    createSection(createSectionDto: CreateSectionLikuiditasDto): Promise<import("./entities/section-likuiditas.entity").SectionLikuiditas>;
    updateSection(id: number, updateSectionDto: UpdateSectionLikuiditasDto): Promise<import("./entities/section-likuiditas.entity").SectionLikuiditas>;
    deleteSection(id: number): Promise<{
        message: string;
    }>;
    getSectionsByPeriod(year: number, quarter: Quarter): Promise<import("./entities/section-likuiditas.entity").SectionLikuiditas[]>;
    createIndikator(createIndikatorDto: CreateIndikatorLikuiditasDto): Promise<import("./entities/likuiditas.entity").Likuiditas>;
    updateIndikator(id: number, updateIndikatorDto: UpdateIndikatorLikuiditasDto): Promise<import("./entities/likuiditas.entity").Likuiditas>;
    deleteIndikator(id: number): Promise<{
        message: string;
    }>;
    getIndikatorById(id: number): Promise<import("./entities/likuiditas.entity").Likuiditas>;
    getSummaryByPeriod(year: number, quarter: Quarter): Promise<any>;
}
