import { Repository } from 'typeorm';
import { KpmrPasar } from './entities/kpmr-pasar.entity';
import { CreateKpmrPasarDto } from './dto/create-kpmr-pasar.dto';
import { UpdateKpmrPasarDto } from './dto/update-kpmr-pasar.dto';
export interface GroupedAspek {
    aspekNo?: string;
    aspekTitle?: string;
    aspekBobot?: number;
    items: KpmrPasar[];
    average_skor: string;
    total_items: number;
}
export interface PeriodResult {
    year: number;
    quarter: string;
}
export declare class KpmrPasarService {
    private readonly kpmrPasarRepo;
    constructor(kpmrPasarRepo: Repository<KpmrPasar>);
    create(createDto: CreateKpmrPasarDto): Promise<KpmrPasar>;
    findAllByPeriod(year: number, quarter: string): Promise<KpmrPasar[]>;
    findGroupedByAspek(year: number, quarter: string): Promise<GroupedAspek[]>;
    findOne(id: number): Promise<KpmrPasar>;
    update(id: number, updateDto: UpdateKpmrPasarDto): Promise<KpmrPasar>;
    remove(id: number): Promise<void>;
    getTotalAverage(year: number, quarter: string): Promise<number>;
    checkDuplicate(year: number, quarter: string, aspekNo?: string, sectionNo?: string): Promise<boolean>;
    getPeriods(): Promise<PeriodResult[]>;
    findByCriteria(criteria: {
        year?: number;
        quarter?: string;
        aspekNo?: string;
        sectionNo?: string;
    }): Promise<KpmrPasar[]>;
}
