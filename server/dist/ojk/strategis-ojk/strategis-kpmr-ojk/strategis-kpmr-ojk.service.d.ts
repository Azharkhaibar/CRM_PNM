import { CreateStrategisKpmrOjkDto } from './dto/create-strategis-kpmr-ojk.dto';
import { UpdateStrategisKpmrOjkDto } from './dto/update-strategis-kpmr-ojk.dto';
export declare class StrategisKpmrOjkService {
    create(createStrategisKpmrOjkDto: CreateStrategisKpmrOjkDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateStrategisKpmrOjkDto: UpdateStrategisKpmrOjkDto): string;
    remove(id: number): string;
}
