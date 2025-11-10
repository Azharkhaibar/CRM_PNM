import { CreateDivisiDto } from './dto/create-divisi.dto';
import { UpdateDivisiDto } from './dto/update-divisi.dto';
export declare class DivisiService {
    create(createDivisiDto: CreateDivisiDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateDivisiDto: UpdateDivisiDto): string;
    remove(id: number): string;
}
