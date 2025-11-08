import { Repository } from 'typeorm';
import { Pasar } from './entities/pasar.entity';
import { CreatePasarDto } from './dto/create-pasar.dto';
import { UpdatePasarDto } from './dto/update-pasar.dto';
export declare class PasarService {
    private readonly pasarRepository;
    constructor(pasarRepository: Repository<Pasar>);
    create(dto: CreatePasarDto): Promise<Pasar>;
    findAll(): Promise<Pasar[]>;
    findOne(id: number): Promise<Pasar>;
    update(id: number, dto: UpdatePasarDto): Promise<Pasar>;
    remove(id: number): Promise<{
        message: string;
    }>;
    getPasarSummary(): Promise<Partial<Pasar>[]>;
}
