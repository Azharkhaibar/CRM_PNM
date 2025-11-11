import { CreateInvestasiDto } from './dto/create-investasi.dto';
import { UpdateInvestasiDto } from './dto/update-investasi.dto';
import { Investasi } from './entities/investasi.entity';
import { Repository } from 'typeorm';
export declare class InvestasiService {
    private readonly investRepository;
    constructor(investRepository: Repository<Investasi>);
    create(dto: CreateInvestasiDto): Promise<Investasi>;
    findAll(): Promise<Investasi[]>;
    findOne(id: number): Promise<Investasi>;
    update(id: number, dto: UpdateInvestasiDto): Promise<Investasi>;
    remove(id: number): Promise<{
        message: string;
    }>;
    getInvestDataField(): Promise<Partial<Investasi>[]>;
}
