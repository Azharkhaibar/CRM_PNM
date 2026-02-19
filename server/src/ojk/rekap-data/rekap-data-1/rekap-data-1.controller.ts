import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RekapData1Service } from './rekap-data-1.service';
import { CreateRekapData1Dto } from './dto/create-rekap-data-1.dto';
import { UpdateRekapData1Dto } from './dto/update-rekap-data-1.dto';

@Controller('rekap-data-1')
export class RekapData1Controller {
  constructor(private readonly rekapData1Service: RekapData1Service) {}

  @Post()
  create(@Body() createRekapData1Dto: CreateRekapData1Dto) {
    return this.rekapData1Service.create(createRekapData1Dto);
  }

  @Get()
  findAll() {
    return this.rekapData1Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rekapData1Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRekapData1Dto: UpdateRekapData1Dto) {
    return this.rekapData1Service.update(+id, updateRekapData1Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rekapData1Service.remove(+id);
  }
}
