import { CreateOperasionalKpmrOjkDto } from './dto/create-operasional-kpmr-ojk.dto';
import { UpdateOperasionalKpmrOjkDto } from './dto/update-operasional-kpmr-ojk.dto';
export declare class OperasionalKpmrOjkService {
    create(createOperasionalKpmrOjkDto: CreateOperasionalKpmrOjkDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateOperasionalKpmrOjkDto: UpdateOperasionalKpmrOjkDto): string;
    remove(id: number): string;
}
