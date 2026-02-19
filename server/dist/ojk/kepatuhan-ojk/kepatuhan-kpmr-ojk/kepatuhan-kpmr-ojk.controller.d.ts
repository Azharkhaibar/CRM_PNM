import { KepatuhanKpmrOjkService } from './kepatuhan-kpmr-ojk.service';
import { CreateKepatuhanKpmrOjkDto } from './dto/create-kepatuhan-kpmr-ojk.dto';
import { UpdateKepatuhanKpmrOjkDto } from './dto/update-kepatuhan-kpmr-ojk.dto';
export declare class KepatuhanKpmrOjkController {
    private readonly kepatuhanKpmrOjkService;
    constructor(kepatuhanKpmrOjkService: KepatuhanKpmrOjkService);
    create(createKepatuhanKpmrOjkDto: CreateKepatuhanKpmrOjkDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateKepatuhanKpmrOjkDto: UpdateKepatuhanKpmrOjkDto): string;
    remove(id: string): string;
}
