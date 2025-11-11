import { InvestasiService } from './investasi.service';
import { CreateInvestasiDto } from './dto/create-investasi.dto';
import { UpdateInvestasiDto } from './dto/update-investasi.dto';
export declare class InvestasiController {
    private readonly investasiService;
    constructor(investasiService: InvestasiService);
    create(dto: CreateInvestasiDto): Promise<import("./entities/investasi.entity").Investasi>;
    findAll(): Promise<import("./entities/investasi.entity").Investasi[]>;
    findOne(id: number): Promise<import("./entities/investasi.entity").Investasi>;
    update(id: number, dto: UpdateInvestasiDto): Promise<import("./entities/investasi.entity").Investasi>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
