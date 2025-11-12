import { Repository } from 'typeorm';
import { KpmrInvestasi } from './entities/kpmr-investasi.entity';
import { CreateKpmrInvestasiDto } from './dto/create-kpmr-investasi.dto';
import { UpdateKpmrInvestasiDto } from './dto/update-kpmr-investasi.dto';
export declare class KpmrInvestasiService {
    private readonly kpmrInvestRepository;
    private readonly logger;
    constructor(kpmrInvestRepository: Repository<KpmrInvestasi>);
    create(createKpmrInvestasiDto: CreateKpmrInvestasiDto): Promise<KpmrInvestasi>;
    findAll(): Promise<KpmrInvestasi[]>;
    findOne(id: number): Promise<KpmrInvestasi>;
    update(id: number, dto: UpdateKpmrInvestasiDto): Promise<KpmrInvestasi>;
    remove(id: number): Promise<void>;
    findByPeriod(year: number, quarter: string): Promise<KpmrInvestasi[]>;
    findByFilters(filters: {
        year?: number;
        quarter?: string;
        aspekNo?: string;
        query?: string;
    }): Promise<KpmrInvestasi[]>;
}
