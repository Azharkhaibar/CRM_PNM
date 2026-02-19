import { CreateKepatuhanOjkDto } from './dto/create-kepatuhan-ojk.dto';
import { UpdateKepatuhanOjkDto } from './dto/update-kepatuhan-ojk.dto';
export declare class KepatuhanOjkService {
    create(createKepatuhanOjkDto: CreateKepatuhanOjkDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateKepatuhanOjkDto: UpdateKepatuhanOjkDto): string;
    remove(id: number): string;
}
