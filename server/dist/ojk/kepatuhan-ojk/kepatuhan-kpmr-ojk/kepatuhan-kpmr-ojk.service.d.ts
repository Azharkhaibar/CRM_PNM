import { CreateKepatuhanKpmrOjkDto } from './dto/create-kepatuhan-kpmr-ojk.dto';
import { UpdateKepatuhanKpmrOjkDto } from './dto/update-kepatuhan-kpmr-ojk.dto';
export declare class KepatuhanKpmrOjkService {
    create(createKepatuhanKpmrOjkDto: CreateKepatuhanKpmrOjkDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateKepatuhanKpmrOjkDto: UpdateKepatuhanKpmrOjkDto): string;
    remove(id: number): string;
}
