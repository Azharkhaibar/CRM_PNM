import { RekapData2Service } from './rekap-data-2.service';
import { CreateRekapData2Dto } from './dto/create-rekap-data-2.dto';
import { UpdateRekapData2Dto } from './dto/update-rekap-data-2.dto';
export declare class RekapData2Controller {
    private readonly rekapData2Service;
    constructor(rekapData2Service: RekapData2Service);
    create(createRekapData2Dto: CreateRekapData2Dto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateRekapData2Dto: UpdateRekapData2Dto): string;
    remove(id: string): string;
}
