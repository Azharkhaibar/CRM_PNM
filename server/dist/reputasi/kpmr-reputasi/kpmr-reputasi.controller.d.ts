import { KpmrReputasiService } from './kpmr-reputasi.service';
import { CreateKpmrReputasiDto } from './dto/create-kpmr-reputasi.dto';
import { UpdateKpmrReputasiDto } from './dto/update-kpmr-reputasi.dto';
export declare class KpmrReputasiController {
    private readonly kpmrReputasiService;
    constructor(kpmrReputasiService: KpmrReputasiService);
    create(createKpmrReputasiDto: CreateKpmrReputasiDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateKpmrReputasiDto: UpdateKpmrReputasiDto): string;
    remove(id: string): string;
}
