import { StrategisKpmrOjkService } from './strategis-kpmr-ojk.service';
import { CreateStrategisKpmrOjkDto } from './dto/create-strategis-kpmr-ojk.dto';
import { UpdateStrategisKpmrOjkDto } from './dto/update-strategis-kpmr-ojk.dto';
export declare class StrategisKpmrOjkController {
    private readonly strategisKpmrOjkService;
    constructor(strategisKpmrOjkService: StrategisKpmrOjkService);
    create(createStrategisKpmrOjkDto: CreateStrategisKpmrOjkDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateStrategisKpmrOjkDto: UpdateStrategisKpmrOjkDto): string;
    remove(id: string): string;
}
