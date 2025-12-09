import { KpmrKepatuhanService } from './kpmr-kepatuhan.service';
import { CreateKpmrKepatuhanDto } from './dto/create-kpmr-kepatuhan.dto';
import { UpdateKpmrKepatuhanDto } from './dto/update-kpmr-kepatuhan.dto';
export declare class KpmrKepatuhanController {
    private readonly kpmrKepatuhanService;
    constructor(kpmrKepatuhanService: KpmrKepatuhanService);
    create(createKpmrKepatuhanDto: CreateKpmrKepatuhanDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateKpmrKepatuhanDto: UpdateKpmrKepatuhanDto): string;
    remove(id: string): string;
}
