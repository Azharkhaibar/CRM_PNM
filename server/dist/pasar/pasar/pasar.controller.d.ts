import { PasarService } from './pasar.service';
import { CreateSectionDto } from './dto/create-pasar-section.dto';
import { CreateIndikatorDto } from './dto/create-pasar-indikator.dto';
import { UpdatePasarSectionDto } from './dto/update-pasar-section.dto';
import { UpdateIndikatorDto } from './dto/update-pasar.dto';
export declare class PasarController {
    private readonly pasarService;
    constructor(pasarService: PasarService);
    createSection(createSectionDto: CreateSectionDto): Promise<import("./entities/section.entity").SectionPasar>;
    findAllSections(): Promise<import("./entities/section.entity").SectionPasar[]>;
    getSectionsByPeriod(tahun: string, triwulan: string): Promise<import("./entities/section.entity").SectionPasar[]>;
    getSectionById(id: number): Promise<import("./entities/section.entity").SectionPasar>;
    updateSection(id: number, updateSectionDto: UpdatePasarSectionDto): Promise<import("./entities/section.entity").SectionPasar>;
    removeSection(id: number): Promise<{
        message: string;
    }>;
    createIndikator(createIndikatorDto: CreateIndikatorDto): Promise<import("./entities/indikator.entity").IndikatorPasar>;
    getIndikators(sectionId?: string): Promise<import("./entities/indikator.entity").IndikatorPasar[]>;
    getIndikatorById(id: number): Promise<import("./entities/indikator.entity").IndikatorPasar>;
    updateIndikator(id: number, updateIndikatorDto: UpdateIndikatorDto): Promise<import("./entities/indikator.entity").IndikatorPasar>;
    removeIndikator(id: number): Promise<{
        message: string;
    }>;
    getOverallSummary(tahun: string, triwulan: string): Promise<any>;
}
