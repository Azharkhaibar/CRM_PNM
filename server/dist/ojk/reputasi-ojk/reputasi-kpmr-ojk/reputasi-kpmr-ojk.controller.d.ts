import { ReputasiKpmrOjkService } from './reputasi-kpmr-ojk.service';
import { CreateReputasiKpmrOjkDto } from './dto/create-reputasi-kpmr-ojk.dto';
import { UpdateReputasiKpmrOjkDto } from './dto/update-reputasi-kpmr-ojk.dto';
export declare class ReputasiKpmrOjkController {
    private readonly reputasiKpmrOjkService;
    constructor(reputasiKpmrOjkService: ReputasiKpmrOjkService);
    create(createReputasiKpmrOjkDto: CreateReputasiKpmrOjkDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateReputasiKpmrOjkDto: UpdateReputasiKpmrOjkDto): string;
    remove(id: string): string;
}
