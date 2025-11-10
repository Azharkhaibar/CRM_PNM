import { Repository } from 'typeorm';
import { Divisi } from './entities/divisi.entity';
import { CreateDivisiDto } from './dto/create-divisi.dto';
import { UpdateDivisiDto } from './dto/update-divisi.dto';
export declare class DivisiService {
    private readonly divisiRepository;
    constructor(divisiRepository: Repository<Divisi>);
    findAll(): Promise<Divisi[]>;
    findOne(divisi_id: number): Promise<Divisi>;
    create(createDivisiDto: CreateDivisiDto): Promise<Divisi>;
    update(divisi_id: number, updateDivisiDto: UpdateDivisiDto): Promise<Divisi>;
    remove(divisi_id: number): Promise<void>;
}
