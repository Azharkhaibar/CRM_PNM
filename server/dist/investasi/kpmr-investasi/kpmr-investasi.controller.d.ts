import { KpmrInvestasiService } from './kpmr-investasi.service';
import { CreateKpmrInvestasiDto } from './dto/create-kpmr-investasi.dto';
import { UpdateKpmrInvestasiDto } from './dto/update-kpmr-investasi.dto';
export declare class KpmrInvestasiController {
    private readonly kpmrInvestasiService;
    constructor(kpmrInvestasiService: KpmrInvestasiService);
    create(createKpmrInvestasiDto: CreateKpmrInvestasiDto): Promise<import("./entities/kpmr-investasi.entity").KpmrInvestasi>;
    findAll(year?: string, quarter?: string, aspek_no?: string, query?: string): Promise<import("./entities/kpmr-investasi.entity").KpmrInvestasi[]>;
    findOne(id: number): Promise<import("./entities/kpmr-investasi.entity").KpmrInvestasi>;
    update(id: number, updateKpmrInvestasiDto: UpdateKpmrInvestasiDto): Promise<import("./entities/kpmr-investasi.entity").KpmrInvestasi>;
    remove(id: number): Promise<void>;
    findByPeriod(year: number, quarter: string): Promise<import("./entities/kpmr-investasi.entity").KpmrInvestasi[]>;
}
