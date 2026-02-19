import { StrategisOjkService } from './strategis-ojk.service';
import { CreateStrategisOjkDto } from './dto/create-strategis-ojk.dto';
import { UpdateStrategisOjkDto } from './dto/update-strategis-ojk.dto';
export declare class StrategisOjkController {
    private readonly strategisOjkService;
    constructor(strategisOjkService: StrategisOjkService);
    create(createStrategisOjkDto: CreateStrategisOjkDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateStrategisOjkDto: UpdateStrategisOjkDto): string;
    remove(id: string): string;
}
