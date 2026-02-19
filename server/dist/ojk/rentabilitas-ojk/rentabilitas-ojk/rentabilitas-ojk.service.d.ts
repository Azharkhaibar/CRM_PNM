import { CreateRentabilitasOjkDto } from './dto/create-rentabilitas-ojk.dto';
import { UpdateRentabilitasOjkDto } from './dto/update-rentabilitas-ojk.dto';
export declare class RentabilitasOjkService {
    create(createRentabilitasOjkDto: CreateRentabilitasOjkDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateRentabilitasOjkDto: UpdateRentabilitasOjkDto): string;
    remove(id: number): string;
}
