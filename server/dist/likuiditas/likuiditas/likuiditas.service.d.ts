import { Repository } from 'typeorm';
import { Likuiditas, Quarter } from './entities/likuiditas.entity';
import { SectionLikuiditas } from './entities/section-likuiditas.entity';
import { CreateSectionLikuiditasDto, CreateIndikatorLikuiditasDto } from './dto/create-likuiditas.dto';
import { UpdateSectionLikuiditasDto, UpdateIndikatorLikuiditasDto } from './dto/update-likuidita.dto';
export declare class LikuiditasService {
    private readonly likuiditasRepository;
    private readonly sectionRepository;
    constructor(likuiditasRepository: Repository<Likuiditas>, sectionRepository: Repository<SectionLikuiditas>);
    createSection(createSectionDto: CreateSectionLikuiditasDto): Promise<SectionLikuiditas>;
    updateSection(id: number, updateSectionDto: UpdateSectionLikuiditasDto): Promise<SectionLikuiditas>;
    deleteSection(id: number): Promise<void>;
    getSectionsByPeriod(year: number, quarter: Quarter): Promise<SectionLikuiditas[]>;
    createIndikator(createIndikatorDto: CreateIndikatorLikuiditasDto): Promise<Likuiditas>;
    updateIndikator(id: number, updateIndikatorDto: UpdateIndikatorLikuiditasDto): Promise<Likuiditas>;
    deleteIndikator(id: number): Promise<void>;
    private calculateHasil;
    private calculateWeighted;
    getSummaryByPeriod(year: number, quarter: Quarter): Promise<any>;
    getIndikatorById(id: number): Promise<Likuiditas>;
}
