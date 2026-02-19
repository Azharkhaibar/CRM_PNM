import { CreateHukumOjkDto } from './dto/create-hukum-ojk.dto';
import { UpdateHukumOjkDto } from './dto/update-hukum-ojk.dto';
export declare class HukumOjkService {
    create(createHukumOjkDto: CreateHukumOjkDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateHukumOjkDto: UpdateHukumOjkDto): string;
    remove(id: number): string;
}
