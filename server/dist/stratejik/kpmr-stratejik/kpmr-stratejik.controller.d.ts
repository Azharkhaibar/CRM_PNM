import { KpmrStratejikService } from './kpmr-stratejik.service';
import { CreateKpmrStratejikDto } from './dto/create-kpmr-stratejik.dto';
import { UpdateKpmrStratejikDto } from './dto/update-kpmr-stratejik.dto';
export declare class KpmrStratejikController {
    private readonly kpmrStratejikService;
    constructor(kpmrStratejikService: KpmrStratejikService);
    create(createKpmrStratejikDto: CreateKpmrStratejikDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateKpmrStratejikDto: UpdateKpmrStratejikDto): string;
    remove(id: string): string;
}
