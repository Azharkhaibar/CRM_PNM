import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KpmrReputasiService } from './kpmr-reputasi.service';
import { CreateKpmrReputasiDto } from './dto/create-kpmr-reputasi.dto';
import { UpdateKpmrReputasiDto } from './dto/update-kpmr-reputasi.dto';

@Controller('kpmr-reputasi')
export class KpmrReputasiController {
  constructor(private readonly kpmrReputasiService: KpmrReputasiService) {}

  @Post()
  create(@Body() createKpmrReputasiDto: CreateKpmrReputasiDto) {
    return this.kpmrReputasiService.create(createKpmrReputasiDto);
  }

  @Get()
  findAll() {
    return this.kpmrReputasiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kpmrReputasiService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKpmrReputasiDto: UpdateKpmrReputasiDto) {
    return this.kpmrReputasiService.update(+id, updateKpmrReputasiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kpmrReputasiService.remove(+id);
  }
}
