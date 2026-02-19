import { KreditProdukKpmrService } from './kredit-produk-kpmr.service';
import { CreateKreditProdukKpmrDto } from './dto/create-kredit-produk-kpmr.dto';
import { UpdateKreditProdukKpmrDto } from './dto/update-kredit-produk-kpmr.dto';
export declare class KreditProdukKpmrController {
    private readonly kreditProdukKpmrService;
    constructor(kreditProdukKpmrService: KreditProdukKpmrService);
    create(createKreditProdukKpmrDto: CreateKreditProdukKpmrDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateKreditProdukKpmrDto: UpdateKreditProdukKpmrDto): string;
    remove(id: string): string;
}
