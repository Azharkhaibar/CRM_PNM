import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KpmrStratejikService } from './kpmr-stratejik.service';
import { CreateKpmrStratejikDto } from './dto/create-kpmr-stratejik.dto';
import { UpdateKpmrStratejikDto } from './dto/update-kpmr-stratejik.dto';

@Controller('kpmr-stratejik')
export class KpmrStratejikController {
  constructor(private readonly kpmrStratejikService: KpmrStratejikService) {}

  @Post()
  create(@Body() createKpmrStratejikDto: CreateKpmrStratejikDto) {
    return this.kpmrStratejikService.create(createKpmrStratejikDto);
  }

  @Get()
  findAll() {
    return this.kpmrStratejikService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kpmrStratejikService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKpmrStratejikDto: UpdateKpmrStratejikDto) {
    return this.kpmrStratejikService.update(+id, updateKpmrStratejikDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kpmrStratejikService.remove(+id);
  }
}
