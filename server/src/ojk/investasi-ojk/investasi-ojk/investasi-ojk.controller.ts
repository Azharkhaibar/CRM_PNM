import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InvestasiOjkService } from './investasi-ojk.service';
import { CreateInvestasiOjkDto } from './dto/create-investasi-ojk.dto';
import { UpdateInvestasiOjkDto } from './dto/update-investasi-ojk.dto';

@Controller('investasi-ojk')
export class InvestasiOjkController {
  constructor(private readonly investasiOjkService: InvestasiOjkService) {}

  @Post()
  create(@Body() createInvestasiOjkDto: CreateInvestasiOjkDto) {
    return this.investasiOjkService.create(createInvestasiOjkDto);
  }

  @Get()
  findAll() {
    return this.investasiOjkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.investasiOjkService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvestasiOjkDto: UpdateInvestasiOjkDto) {
    return this.investasiOjkService.update(+id, updateInvestasiOjkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.investasiOjkService.remove(+id);
  }
}
