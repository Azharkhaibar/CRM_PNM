import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KreditProdukKpmrService } from './kredit-produk-kpmr.service';
import { CreateKreditProdukKpmrDto } from './dto/create-kredit-produk-kpmr.dto';
import { UpdateKreditProdukKpmrDto } from './dto/update-kredit-produk-kpmr.dto';

@Controller('kredit-produk-kpmr')
export class KreditProdukKpmrController {
  constructor(private readonly kreditProdukKpmrService: KreditProdukKpmrService) {}

  @Post()
  create(@Body() createKreditProdukKpmrDto: CreateKreditProdukKpmrDto) {
    return this.kreditProdukKpmrService.create(createKreditProdukKpmrDto);
  }

  @Get()
  findAll() {
    return this.kreditProdukKpmrService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kreditProdukKpmrService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKreditProdukKpmrDto: UpdateKreditProdukKpmrDto) {
    return this.kreditProdukKpmrService.update(+id, updateKreditProdukKpmrDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kreditProdukKpmrService.remove(+id);
  }
}
