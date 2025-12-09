import { KpmrPasarService, GroupedAspek, PeriodResult } from './kpmr-pasar.service';
import { CreateKpmrPasarDto } from './dto/create-kpmr-pasar.dto';
import { UpdateKpmrPasarDto } from './dto/update-kpmr-pasar.dto';
import { KpmrPasarResponseDto } from './dto/response-kpmr-pasar.dto';
import { KpmrPasar } from './entities/kpmr-pasar.entity';
export declare class KpmrPasarController {
    private readonly kpmrPasarService;
    private readonly logger;
    constructor(kpmrPasarService: KpmrPasarService);
    create(createKpmrPasarDto: CreateKpmrPasarDto): Promise<KpmrPasarResponseDto<KpmrPasar>>;
    findAllByPeriod(year: number, quarter: string): Promise<KpmrPasarResponseDto<GroupedAspek[]>>;
    findAll(): Promise<KpmrPasarResponseDto<KpmrPasar[]>>;
    getPeriods(): Promise<KpmrPasarResponseDto<PeriodResult[]>>;
    findOne(id: number): Promise<KpmrPasarResponseDto<KpmrPasar>>;
    getTotalAverage(year: number, quarter: string): Promise<KpmrPasarResponseDto<{
        average: number;
    }>>;
    update(id: number, updateKpmrPasarDto: UpdateKpmrPasarDto): Promise<KpmrPasarResponseDto<KpmrPasar>>;
    remove(id: number): Promise<void>;
    searchByCriteria(year?: string, quarter?: string, aspekNo?: string, sectionNo?: string): Promise<KpmrPasarResponseDto<KpmrPasar[]>>;
}
