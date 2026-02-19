import { OperasionalKpmrOjkService } from './operasional-kpmr-ojk.service';
import { CreateOperasionalKpmrOjkDto } from './dto/create-operasional-kpmr-ojk.dto';
import { UpdateOperasionalKpmrOjkDto } from './dto/update-operasional-kpmr-ojk.dto';
export declare class OperasionalKpmrOjkController {
    private readonly operasionalKpmrOjkService;
    constructor(operasionalKpmrOjkService: OperasionalKpmrOjkService);
    create(createOperasionalKpmrOjkDto: CreateOperasionalKpmrOjkDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateOperasionalKpmrOjkDto: UpdateOperasionalKpmrOjkDto): string;
    remove(id: string): string;
}
