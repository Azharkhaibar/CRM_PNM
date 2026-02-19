import { KepatuhanOjkService } from './kepatuhan-ojk.service';
import { CreateKepatuhanOjkDto } from './dto/create-kepatuhan-ojk.dto';
import { UpdateKepatuhanOjkDto } from './dto/update-kepatuhan-ojk.dto';
export declare class KepatuhanOjkController {
    private readonly kepatuhanOjkService;
    constructor(kepatuhanOjkService: KepatuhanOjkService);
    create(createKepatuhanOjkDto: CreateKepatuhanOjkDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateKepatuhanOjkDto: UpdateKepatuhanOjkDto): string;
    remove(id: string): string;
}
