import { CreateKpmrInvestasiDto } from './dto/create-kpmr-investasi.dto';
import { UpdateKpmrInvestasiDto } from './dto/update-kpmr-investasi.dto';
import { Repository } from 'typeorm';
import { KpmrInvestasi } from './entities/kpmr-investasi.entity';
export declare class KpmrInvestasiService {
    private readonly kpmrInvestRepository;
    constructor(kpmrInvestRepository: Repository<KpmrInvestasi>);
    create(createKpmrInvestasiDto: CreateKpmrInvestasiDto): Promise<KpmrInvestasi>;
    findAll(): Promise<KpmrInvestasi[]>;
    findOne(id: number): Promise<KpmrInvestasi>;
    findByPeriod(year: number, quarter: string): Promise<KpmrInvestasi[]>;
    update(id: number, updateKpmrInvestasiDto: UpdateKpmrInvestasiDto): Promise<KpmrInvestasi>;
    remove(id: number): Promise<void>;
    findByFilters(filters: {
        year?: number;
        quarter?: string;
        aspek_no?: string;
        query?: string;
    }): Promise<KpmrInvestasi[]>;
}
