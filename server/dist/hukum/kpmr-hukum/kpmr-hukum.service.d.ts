import { CreateKpmrHukumDto } from './dto/create-kpmr-hukum.dto';
import { UpdateKpmrHukumDto } from './dto/update-kpmr-hukum.dto';
export declare class KpmrHukumService {
    create(createKpmrHukumDto: CreateKpmrHukumDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateKpmrHukumDto: UpdateKpmrHukumDto): string;
    remove(id: number): string;
}
