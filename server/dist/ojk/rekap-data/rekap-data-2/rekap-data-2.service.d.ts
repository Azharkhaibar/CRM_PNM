import { CreateRekapData2Dto } from './dto/create-rekap-data-2.dto';
import { UpdateRekapData2Dto } from './dto/update-rekap-data-2.dto';
export declare class RekapData2Service {
    create(createRekapData2Dto: CreateRekapData2Dto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateRekapData2Dto: UpdateRekapData2Dto): string;
    remove(id: number): string;
}
