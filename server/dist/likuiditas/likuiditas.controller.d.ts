import { LikuiditasService } from './likuiditas.service';
import { CreateLikuiditasDto } from './dto/create-likuidita.dto';
import { UpdateLikuiditasDto } from './dto/update-likuidita.dto';
export declare class LikuiditasController {
    private readonly likuiditasService;
    constructor(likuiditasService: LikuiditasService);
    create(createLikuiditaDto: CreateLikuiditasDto): Promise<import("./entities/likuidita.entity").Likuiditas>;
    findAll(): Promise<import("./entities/likuidita.entity").Likuiditas[]>;
    findOne(id: string): Promise<import("./entities/likuidita.entity").Likuiditas>;
    update(id: string, updateLikuiditaDto: UpdateLikuiditasDto): Promise<import("./entities/likuidita.entity").Likuiditas>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
