import { RentabilitasOjkService } from './rentabilitas-ojk.service';
import { CreateRentabilitasOjkDto } from './dto/create-rentabilitas-ojk.dto';
import { UpdateRentabilitasOjkDto } from './dto/update-rentabilitas-ojk.dto';
export declare class RentabilitasOjkController {
    private readonly rentabilitasOjkService;
    constructor(rentabilitasOjkService: RentabilitasOjkService);
    create(createRentabilitasOjkDto: CreateRentabilitasOjkDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateRentabilitasOjkDto: UpdateRentabilitasOjkDto): string;
    remove(id: string): string;
}
