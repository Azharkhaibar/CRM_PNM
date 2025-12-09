import { CreateKpmrOperasionalDto } from './dto/create-kpmr-operasional.dto';
import { UpdateKpmrOperasionalDto } from './dto/update-kpmr-operasional.dto';
export declare class KpmrOperasionalService {
    create(createKpmrOperasionalDto: CreateKpmrOperasionalDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateKpmrOperasionalDto: UpdateKpmrOperasionalDto): string;
    remove(id: number): string;
}
