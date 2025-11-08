import { PasarService } from './pasar.service';
import { CreatePasarDto } from './dto/create-pasar.dto';
import { UpdatePasarDto } from './dto/update-pasar.dto';
import { GetPasarDto } from './dto/get-pasar.dto';
export declare class PasarController {
    private readonly pasarService;
    constructor(pasarService: PasarService);
    create(dto: CreatePasarDto): Promise<GetPasarDto>;
    findAll(): Promise<GetPasarDto[]>;
    getSummary(): Promise<Partial<import("./entities/pasar.entity").Pasar>[]>;
    findOne(id: string): Promise<GetPasarDto>;
    update(id: string, dto: UpdatePasarDto): Promise<GetPasarDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
