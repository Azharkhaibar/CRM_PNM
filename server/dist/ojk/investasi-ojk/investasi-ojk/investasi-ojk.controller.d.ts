import { InvestasiOjkService } from './investasi-ojk.service';
import { CreateInvestasiOjkDto } from './dto/create-investasi-ojk.dto';
import { UpdateInvestasiOjkDto } from './dto/update-investasi-ojk.dto';
export declare class InvestasiOjkController {
    private readonly investasiOjkService;
    constructor(investasiOjkService: InvestasiOjkService);
    create(createInvestasiOjkDto: CreateInvestasiOjkDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateInvestasiOjkDto: UpdateInvestasiOjkDto): string;
    remove(id: string): string;
}
