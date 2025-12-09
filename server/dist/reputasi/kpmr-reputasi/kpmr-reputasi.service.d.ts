import { CreateKpmrReputasiDto } from './dto/create-kpmr-reputasi.dto';
import { UpdateKpmrReputasiDto } from './dto/update-kpmr-reputasi.dto';
export declare class KpmrReputasiService {
    create(createKpmrReputasiDto: CreateKpmrReputasiDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateKpmrReputasiDto: UpdateKpmrReputasiDto): string;
    remove(id: number): string;
}
