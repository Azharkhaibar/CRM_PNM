import { CreateInvestasiKpmrOjkDto } from './dto/create-investasi-kpmr-ojk.dto';
import { UpdateInvestasiKpmrOjkDto } from './dto/update-investasi-kpmr-ojk.dto';
export declare class InvestasiKpmrOjkService {
    create(createInvestasiKpmrOjkDto: CreateInvestasiKpmrOjkDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateInvestasiKpmrOjkDto: UpdateInvestasiKpmrOjkDto): string;
    remove(id: number): string;
}
