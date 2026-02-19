import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KonsentrasiProdukKpmrService } from './konsentrasi-produk-kpmr.service';
import { CreateKonsentrasiProdukKpmrDto } from './dto/create-konsentrasi-produk-kpmr.dto';
import { UpdateKonsentrasiProdukKpmrDto } from './dto/update-konsentrasi-produk-kpmr.dto';

@Controller('konsentrasi-produk-kpmr')
export class KonsentrasiProdukKpmrController {
  constructor(private readonly konsentrasiProdukKpmrService: KonsentrasiProdukKpmrService) {}

  @Post()
  create(@Body() createKonsentrasiProdukKpmrDto: CreateKonsentrasiProdukKpmrDto) {
    return this.konsentrasiProdukKpmrService.create(createKonsentrasiProdukKpmrDto);
  }

  @Get()
  findAll() {
    return this.konsentrasiProdukKpmrService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.konsentrasiProdukKpmrService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKonsentrasiProdukKpmrDto: UpdateKonsentrasiProdukKpmrDto) {
    return this.konsentrasiProdukKpmrService.update(+id, updateKonsentrasiProdukKpmrDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.konsentrasiProdukKpmrService.remove(+id);
  }
}
