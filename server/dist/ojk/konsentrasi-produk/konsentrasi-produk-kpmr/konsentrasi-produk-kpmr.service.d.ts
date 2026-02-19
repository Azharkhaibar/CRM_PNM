import { CreateKonsentrasiProdukKpmrDto } from './dto/create-konsentrasi-produk-kpmr.dto';
import { UpdateKonsentrasiProdukKpmrDto } from './dto/update-konsentrasi-produk-kpmr.dto';
export declare class KonsentrasiProdukKpmrService {
    create(createKonsentrasiProdukKpmrDto: CreateKonsentrasiProdukKpmrDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateKonsentrasiProdukKpmrDto: UpdateKonsentrasiProdukKpmrDto): string;
    remove(id: number): string;
}
