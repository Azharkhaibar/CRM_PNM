import { CreateKpmrStratejikDto } from './dto/create-kpmr-stratejik.dto';
import { UpdateKpmrStratejikDto } from './dto/update-kpmr-stratejik.dto';
export declare class KpmrStratejikService {
    create(createKpmrStratejikDto: CreateKpmrStratejikDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateKpmrStratejikDto: UpdateKpmrStratejikDto): string;
    remove(id: number): string;
}
