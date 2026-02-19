import { CreateHukumKpmrOjkDto } from './dto/create-hukum-kpmr-ojk.dto';
import { UpdateHukumKpmrOjkDto } from './dto/update-hukum-kpmr-ojk.dto';
export declare class HukumKpmrOjkService {
    create(createHukumKpmrOjkDto: CreateHukumKpmrOjkDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateHukumKpmrOjkDto: UpdateHukumKpmrOjkDto): string;
    remove(id: number): string;
}
