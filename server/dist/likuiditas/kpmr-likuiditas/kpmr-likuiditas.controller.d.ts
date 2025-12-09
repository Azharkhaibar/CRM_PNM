import { KpmrLikuiditasService, GroupedKpmrResponse, KpmrListResponse } from './kpmr-likuiditas.service';
import { CreateKpmrLikuiditasDto } from './dto/create-kpmr-likuidita.dto';
import { UpdateKpmrLikuiditasDto } from './dto/update-kpmr-likuiditas.dto';
import { KpmrLikuiditasQueryDto } from './dto/kpmr-likuiditas-query.dto';
export declare class KpmrLikuiditasController {
    private readonly kpmrLikuiditasService;
    constructor(kpmrLikuiditasService: KpmrLikuiditasService);
    create(createDto: CreateKpmrLikuiditasDto): Promise<import("./entities/kpmr-likuidita.entity").KpmrLikuiditas>;
    findAll(query: KpmrLikuiditasQueryDto): Promise<KpmrListResponse>;
    getGroupedData(year: number, quarter: string): Promise<GroupedKpmrResponse>;
    findOne(id: number): Promise<import("./entities/kpmr-likuidita.entity").KpmrLikuiditas>;
    update(id: number, updateDto: UpdateKpmrLikuiditasDto): Promise<import("./entities/kpmr-likuidita.entity").KpmrLikuiditas>;
    remove(id: number): Promise<void>;
    findByPeriod(year: number, quarter: string): Promise<import("./entities/kpmr-likuidita.entity").KpmrLikuiditas[]>;
    exportData(year: number, quarter: string): Promise<import("./kpmr-likuiditas.service").KpmrExportData>;
}
