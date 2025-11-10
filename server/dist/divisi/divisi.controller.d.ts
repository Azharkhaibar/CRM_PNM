import { DivisiService } from './divisi.service';
import { CreateDivisiDto } from './dto/create-divisi.dto';
import { UpdateDivisiDto } from './dto/update-divisi.dto';
export declare class DivisiController {
    private readonly divisiService;
    constructor(divisiService: DivisiService);
    create(createDivisiDto: CreateDivisiDto): Promise<import("./entities/divisi.entity").Divisi>;
    findAll(): Promise<import("./entities/divisi.entity").Divisi[]>;
    findOne(id: string): Promise<import("./entities/divisi.entity").Divisi>;
    update(id: string, updateDivisiDto: UpdateDivisiDto): Promise<import("./entities/divisi.entity").Divisi>;
    remove(id: string): Promise<void>;
}
