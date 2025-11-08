import { Repository } from 'typeorm';
import { Likuiditas } from './entities/likuidita.entity';
import { CreateLikuiditasDto } from './dto/create-likuidita.dto';
import { UpdateLikuiditasDto } from './dto/update-likuidita.dto';
export declare class LikuiditasService {
    private readonly likuiditasRepo;
    constructor(likuiditasRepo: Repository<Likuiditas>);
    private calculateWeighted;
    create(dto: CreateLikuiditasDto): Promise<Likuiditas>;
    findAll(): Promise<Likuiditas[]>;
    findOne(id: number): Promise<Likuiditas>;
    update(id: number, dto: UpdateLikuiditasDto): Promise<Likuiditas>;
    remove(id: number): Promise<{
        message: string;
    }>;
    summary(): Promise<Partial<Likuiditas>[]>;
}
