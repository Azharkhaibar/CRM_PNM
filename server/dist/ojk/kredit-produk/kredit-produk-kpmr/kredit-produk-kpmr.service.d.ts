import { CreateKreditProdukKpmrDto } from './dto/create-kredit-produk-kpmr.dto';
import { UpdateKreditProdukKpmrDto } from './dto/update-kredit-produk-kpmr.dto';
export declare class KreditProdukKpmrService {
    create(createKreditProdukKpmrDto: CreateKreditProdukKpmrDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateKreditProdukKpmrDto: UpdateKreditProdukKpmrDto): string;
    remove(id: number): string;
}
