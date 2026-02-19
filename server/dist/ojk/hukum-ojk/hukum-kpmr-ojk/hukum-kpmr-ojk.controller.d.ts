import { HukumKpmrOjkService } from './hukum-kpmr-ojk.service';
import { CreateHukumKpmrOjkDto } from './dto/create-hukum-kpmr-ojk.dto';
import { UpdateHukumKpmrOjkDto } from './dto/update-hukum-kpmr-ojk.dto';
export declare class HukumKpmrOjkController {
    private readonly hukumKpmrOjkService;
    constructor(hukumKpmrOjkService: HukumKpmrOjkService);
    create(createHukumKpmrOjkDto: CreateHukumKpmrOjkDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateHukumKpmrOjkDto: UpdateHukumKpmrOjkDto): string;
    remove(id: string): string;
}
