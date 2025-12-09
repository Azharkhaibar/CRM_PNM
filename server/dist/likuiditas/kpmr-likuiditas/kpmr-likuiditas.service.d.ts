import { Repository } from 'typeorm';
import { KpmrLikuiditas } from './entities/kpmr-likuidita.entity';
import { CreateKpmrLikuiditasDto } from './dto/create-kpmr-likuidita.dto';
import { UpdateKpmrLikuiditasDto } from './dto/update-kpmr-likuiditas.dto';
import { KpmrLikuiditasQueryDto } from './dto/kpmr-likuiditas-query.dto';
export interface KpmrGroup {
    aspekNo: string;
    aspekTitle: string;
    aspekBobot: number;
    items: KpmrLikuiditas[];
    skorAverage: number;
}
export interface GroupedKpmrResponse {
    data: KpmrLikuiditas[];
    groups: KpmrGroup[];
    overallAverage: number;
}
export interface KpmrListResponse {
    data: KpmrLikuiditas[];
    total: number;
}
export interface KpmrExportData {
    year: number;
    quarter: string;
    rows: KpmrLikuiditas[];
    groups: KpmrGroup[];
    overallAverage: number;
    exportDate: string;
}
export interface KpmrWhereClause {
    year?: number;
    quarter?: string;
    aspekNo?: string;
    indikator?: any;
}
export declare class KpmrLikuiditasService {
    private readonly kpmrLikuiditasRepo;
    constructor(kpmrLikuiditasRepo: Repository<KpmrLikuiditas>);
    create(createDto: CreateKpmrLikuiditasDto): Promise<KpmrLikuiditas>;
    findAll(query: KpmrLikuiditasQueryDto): Promise<KpmrListResponse>;
    findOne(id_kpmr_likuiditas: number): Promise<KpmrLikuiditas>;
    update(id_kpmr_likuiditas: number, updateDto: UpdateKpmrLikuiditasDto): Promise<KpmrLikuiditas>;
    remove(id_kpmr_likuiditas: number): Promise<void>;
    findByPeriod(year: number, quarter: string): Promise<KpmrLikuiditas[]>;
    getGroupedData(year: number, quarter: string): Promise<GroupedKpmrResponse>;
    getExportData(year: number, quarter: string): Promise<KpmrExportData>;
}
