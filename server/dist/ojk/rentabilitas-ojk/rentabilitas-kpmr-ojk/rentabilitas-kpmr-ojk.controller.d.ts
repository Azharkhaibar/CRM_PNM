import { RentabilitasKpmrOjkService } from './rentabilitas-kpmr-ojk.service';
import { CreateRentabilitasKpmrOjkDto } from './dto/create-rentabilitas-kpmr-ojk.dto';
import { UpdateRentabilitasKpmrOjkDto } from './dto/update-rentabilitas-kpmr-ojk.dto';
export declare class RentabilitasKpmrOjkController {
    private readonly rentabilitasKpmrOjkService;
    constructor(rentabilitasKpmrOjkService: RentabilitasKpmrOjkService);
    create(createRentabilitasKpmrOjkDto: CreateRentabilitasKpmrOjkDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateRentabilitasKpmrOjkDto: UpdateRentabilitasKpmrOjkDto): string;
    remove(id: string): string;
}
