import { CreateReputasiOjkDto } from './dto/create-reputasi-ojk.dto';
import { UpdateReputasiOjkDto } from './dto/update-reputasi-ojk.dto';
export declare class ReputasiOjkService {
    create(createReputasiOjkDto: CreateReputasiOjkDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateReputasiOjkDto: UpdateReputasiOjkDto): string;
    remove(id: number): string;
}
