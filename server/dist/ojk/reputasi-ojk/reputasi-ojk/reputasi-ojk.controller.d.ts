import { ReputasiOjkService } from './reputasi-ojk.service';
import { CreateReputasiOjkDto } from './dto/create-reputasi-ojk.dto';
import { UpdateReputasiOjkDto } from './dto/update-reputasi-ojk.dto';
export declare class ReputasiOjkController {
    private readonly reputasiOjkService;
    constructor(reputasiOjkService: ReputasiOjkService);
    create(createReputasiOjkDto: CreateReputasiOjkDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateReputasiOjkDto: UpdateReputasiOjkDto): string;
    remove(id: string): string;
}
