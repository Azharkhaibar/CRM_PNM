import { CreateRekapData1Dto } from './dto/create-rekap-data-1.dto';
import { UpdateRekapData1Dto } from './dto/update-rekap-data-1.dto';
export declare class RekapData1Service {
    create(createRekapData1Dto: CreateRekapData1Dto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateRekapData1Dto: UpdateRekapData1Dto): string;
    remove(id: number): string;
}
