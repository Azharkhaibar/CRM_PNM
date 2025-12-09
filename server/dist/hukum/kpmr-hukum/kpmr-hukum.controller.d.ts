import { KpmrHukumService } from './kpmr-hukum.service';
import { CreateKpmrHukumDto } from './dto/create-kpmr-hukum.dto';
import { UpdateKpmrHukumDto } from './dto/update-kpmr-hukum.dto';
export declare class KpmrHukumController {
    private readonly kpmrHukumService;
    constructor(kpmrHukumService: KpmrHukumService);
    create(createKpmrHukumDto: CreateKpmrHukumDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateKpmrHukumDto: UpdateKpmrHukumDto): string;
    remove(id: string): string;
}
