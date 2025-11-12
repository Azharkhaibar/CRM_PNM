import { KpmrInvestasiService } from './kpmr-investasi.service';
import { CreateKpmrInvestasiDto } from './dto/create-kpmr-investasi.dto';
import { UpdateKpmrInvestasiDto } from './dto/update-kpmr-investasi.dto';
export declare class KpmrInvestasiController {
    private readonly service;
    private readonly logger;
    constructor(service: KpmrInvestasiService);
    create(dto: CreateKpmrInvestasiDto): Promise<import("./entities/kpmr-investasi.entity").KpmrInvestasi>;
    findAll(year?: string, quarter?: string, aspekNo?: string, query?: string): Promise<import("./entities/kpmr-investasi.entity").KpmrInvestasi[]>;
    findOne(id: number): Promise<import("./entities/kpmr-investasi.entity").KpmrInvestasi>;
    update(id: number, dto: UpdateKpmrInvestasiDto): Promise<import("./entities/kpmr-investasi.entity").KpmrInvestasi>;
    remove(id: number): Promise<void>;
    findByPeriod(year: number, quarter: string): Promise<import("./entities/kpmr-investasi.entity").KpmrInvestasi[]>;
}
