import { RekapData1Service } from './rekap-data-1.service';
import { CreateRekapData1Dto } from './dto/create-rekap-data-1.dto';
import { UpdateRekapData1Dto } from './dto/update-rekap-data-1.dto';
export declare class RekapData1Controller {
    private readonly rekapData1Service;
    constructor(rekapData1Service: RekapData1Service);
    create(createRekapData1Dto: CreateRekapData1Dto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateRekapData1Dto: UpdateRekapData1Dto): string;
    remove(id: string): string;
}
