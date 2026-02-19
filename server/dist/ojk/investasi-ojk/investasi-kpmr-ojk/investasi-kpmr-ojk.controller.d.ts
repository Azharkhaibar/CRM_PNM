import { InvestasiKpmrOjkService } from './investasi-kpmr-ojk.service';
import { CreateInvestasiKpmrOjkDto } from './dto/create-investasi-kpmr-ojk.dto';
import { UpdateInvestasiKpmrOjkDto } from './dto/update-investasi-kpmr-ojk.dto';
export declare class InvestasiKpmrOjkController {
    private readonly investasiKpmrOjkService;
    constructor(investasiKpmrOjkService: InvestasiKpmrOjkService);
    create(createInvestasiKpmrOjkDto: CreateInvestasiKpmrOjkDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateInvestasiKpmrOjkDto: UpdateInvestasiKpmrOjkDto): string;
    remove(id: string): string;
}
