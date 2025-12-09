import { CreateKpmrKepatuhanDto } from './dto/create-kpmr-kepatuhan.dto';
import { UpdateKpmrKepatuhanDto } from './dto/update-kpmr-kepatuhan.dto';
export declare class KpmrKepatuhanService {
    create(createKpmrKepatuhanDto: CreateKpmrKepatuhanDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateKpmrKepatuhanDto: UpdateKpmrKepatuhanDto): string;
    remove(id: number): string;
}
