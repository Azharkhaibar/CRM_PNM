import { CreateRentabilitasKpmrOjkDto } from './dto/create-rentabilitas-kpmr-ojk.dto';
import { UpdateRentabilitasKpmrOjkDto } from './dto/update-rentabilitas-kpmr-ojk.dto';
export declare class RentabilitasKpmrOjkService {
    create(createRentabilitasKpmrOjkDto: CreateRentabilitasKpmrOjkDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateRentabilitasKpmrOjkDto: UpdateRentabilitasKpmrOjkDto): string;
    remove(id: number): string;
}
