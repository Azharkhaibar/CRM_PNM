import { CreateOperasionalDto } from './dto/create-operasional.dto';
import { UpdateOperasionalDto } from './dto/update-operasional.dto';
export declare class OperasionalService {
    create(createOperasionalDto: CreateOperasionalDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateOperasionalDto: UpdateOperasionalDto): string;
    remove(id: number): string;
}
