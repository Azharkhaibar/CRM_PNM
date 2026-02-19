import { CreateReputasiKpmrOjkDto } from './dto/create-reputasi-kpmr-ojk.dto';
import { UpdateReputasiKpmrOjkDto } from './dto/update-reputasi-kpmr-ojk.dto';
export declare class ReputasiKpmrOjkService {
    create(createReputasiKpmrOjkDto: CreateReputasiKpmrOjkDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateReputasiKpmrOjkDto: UpdateReputasiKpmrOjkDto): string;
    remove(id: number): string;
}
