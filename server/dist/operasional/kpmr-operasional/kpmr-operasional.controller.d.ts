import { KpmrOperasionalService } from './kpmr-operasional.service';
import { CreateKpmrOperasionalDto } from './dto/create-kpmr-operasional.dto';
import { UpdateKpmrOperasionalDto } from './dto/update-kpmr-operasional.dto';
export declare class KpmrOperasionalController {
    private readonly kpmrOperasionalService;
    constructor(kpmrOperasionalService: KpmrOperasionalService);
    create(createKpmrOperasionalDto: CreateKpmrOperasionalDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateKpmrOperasionalDto: UpdateKpmrOperasionalDto): string;
    remove(id: string): string;
}
