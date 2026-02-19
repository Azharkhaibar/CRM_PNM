import { KonsentrasiProdukKpmrService } from './konsentrasi-produk-kpmr.service';
import { CreateKonsentrasiProdukKpmrDto } from './dto/create-konsentrasi-produk-kpmr.dto';
import { UpdateKonsentrasiProdukKpmrDto } from './dto/update-konsentrasi-produk-kpmr.dto';
export declare class KonsentrasiProdukKpmrController {
    private readonly konsentrasiProdukKpmrService;
    constructor(konsentrasiProdukKpmrService: KonsentrasiProdukKpmrService);
    create(createKonsentrasiProdukKpmrDto: CreateKonsentrasiProdukKpmrDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateKonsentrasiProdukKpmrDto: UpdateKonsentrasiProdukKpmrDto): string;
    remove(id: string): string;
}
