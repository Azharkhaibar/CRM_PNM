import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RekapData2Service } from './rekap-data-2.service';
import { CreateRekapData2Dto } from './dto/create-rekap-data-2.dto';
import { UpdateRekapData2Dto } from './dto/update-rekap-data-2.dto';

@Controller('rekap-data-2')
export class RekapData2Controller {
  constructor(private readonly rekapData2Service: RekapData2Service) {}

  @Post()
  create(@Body() createRekapData2Dto: CreateRekapData2Dto) {
    return this.rekapData2Service.create(createRekapData2Dto);
  }

  @Get()
  findAll() {
    return this.rekapData2Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rekapData2Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRekapData2Dto: UpdateRekapData2Dto) {
    return this.rekapData2Service.update(+id, updateRekapData2Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rekapData2Service.remove(+id);
  }
}
