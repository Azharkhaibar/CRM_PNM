import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InvestasiKpmrOjkService } from './investasi-kpmr-ojk.service';
import { CreateInvestasiKpmrOjkDto } from './dto/create-investasi-kpmr-ojk.dto';
import { UpdateInvestasiKpmrOjkDto } from './dto/update-investasi-kpmr-ojk.dto';

@Controller('investasi-kpmr-ojk')
export class InvestasiKpmrOjkController {
  constructor(private readonly investasiKpmrOjkService: InvestasiKpmrOjkService) {}

  @Post()
  create(@Body() createInvestasiKpmrOjkDto: CreateInvestasiKpmrOjkDto) {
    return this.investasiKpmrOjkService.create(createInvestasiKpmrOjkDto);
  }

  @Get()
  findAll() {
    return this.investasiKpmrOjkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.investasiKpmrOjkService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvestasiKpmrOjkDto: UpdateInvestasiKpmrOjkDto) {
    return this.investasiKpmrOjkService.update(+id, updateInvestasiKpmrOjkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.investasiKpmrOjkService.remove(+id);
  }
}
