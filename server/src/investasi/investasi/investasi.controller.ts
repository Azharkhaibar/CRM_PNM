import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { InvestasiService } from './investasi.service';
import { CreateInvestasiDto } from './dto/create-investasi.dto';
import { UpdateInvestasiDto } from './dto/update-investasi.dto';

@Controller('investasi')
export class InvestasiController {
  constructor(private readonly investasiService: InvestasiService) {}
  @Post()
  async create(@Body() dto: CreateInvestasiDto) {
    return await this.investasiService.create(dto);
  }

  @Get()
  async findAll() {
    return await this.investasiService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.investasiService.findOne(id);
  }
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInvestasiDto,
  ) {
    return await this.investasiService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.investasiService.remove(id);
  }
}
