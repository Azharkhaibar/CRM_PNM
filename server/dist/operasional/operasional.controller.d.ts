import { OperasionalService } from './operasional.service';
import { CreateOperasionalDto } from './dto/create-operasional.dto';
import { UpdateOperasionalDto } from './dto/update-operasional.dto';
export declare class OperasionalController {
    private readonly operasionalService;
    constructor(operasionalService: OperasionalService);
    create(createOperasionalDto: CreateOperasionalDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateOperasionalDto: UpdateOperasionalDto): string;
    remove(id: string): string;
}
