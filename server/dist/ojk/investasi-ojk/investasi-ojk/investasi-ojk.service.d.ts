import { CreateInvestasiOjkDto } from './dto/create-investasi-ojk.dto';
import { UpdateInvestasiOjkDto } from './dto/update-investasi-ojk.dto';
export declare class InvestasiOjkService {
    create(createInvestasiOjkDto: CreateInvestasiOjkDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateInvestasiOjkDto: UpdateInvestasiOjkDto): string;
    remove(id: number): string;
}
