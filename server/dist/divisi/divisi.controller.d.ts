import { DivisiService } from './divisi.service';
import { CreateDivisiDto } from './dto/create-divisi.dto';
import { UpdateDivisiDto } from './dto/update-divisi.dto';
export declare class DivisiController {
    private readonly divisiService;
    constructor(divisiService: DivisiService);
    create(createDivisiDto: CreateDivisiDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateDivisiDto: UpdateDivisiDto): string;
    remove(id: string): string;
}
