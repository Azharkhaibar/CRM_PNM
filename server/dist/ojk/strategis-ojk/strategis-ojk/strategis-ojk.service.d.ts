import { CreateStrategisOjkDto } from './dto/create-strategis-ojk.dto';
import { UpdateStrategisOjkDto } from './dto/update-strategis-ojk.dto';
export declare class StrategisOjkService {
    create(createStrategisOjkDto: CreateStrategisOjkDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateStrategisOjkDto: UpdateStrategisOjkDto): string;
    remove(id: number): string;
}
