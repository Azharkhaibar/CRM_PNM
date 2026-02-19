import { HukumOjkService } from './hukum-ojk.service';
import { CreateHukumOjkDto } from './dto/create-hukum-ojk.dto';
import { UpdateHukumOjkDto } from './dto/update-hukum-ojk.dto';
export declare class HukumOjkController {
    private readonly hukumOjkService;
    constructor(hukumOjkService: HukumOjkService);
    create(createHukumOjkDto: CreateHukumOjkDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateHukumOjkDto: UpdateHukumOjkDto): string;
    remove(id: string): string;
}
