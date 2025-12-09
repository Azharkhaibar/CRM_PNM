// src/kpmr-likuiditas/kpmr-likuiditas.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  DefaultValuePipe,
  BadRequestException,
} from '@nestjs/common';
import {
  KpmrLikuiditasService,
  GroupedKpmrResponse,
  KpmrListResponse,
} from './kpmr-likuiditas.service';
import { CreateKpmrLikuiditasDto } from './dto/create-kpmr-likuidita.dto';
import { UpdateKpmrLikuiditasDto } from './dto/update-kpmr-likuiditas.dto';
import { KpmrLikuiditasQueryDto } from './dto/kpmr-likuiditas-query.dto';

@Controller('kpmr-likuiditas')
export class KpmrLikuiditasController {
  constructor(private readonly kpmrLikuiditasService: KpmrLikuiditasService) {}

  @Post()
  async create(@Body() createDto: CreateKpmrLikuiditasDto) {
    return await this.kpmrLikuiditasService.create(createDto);
  }

  @Get()
  async findAll(
    @Query() query: KpmrLikuiditasQueryDto,
  ): Promise<KpmrListResponse> {
    return await this.kpmrLikuiditasService.findAll(query);
  }

  @Get('grouped')
  async getGroupedData(
    @Query('year', new DefaultValuePipe(new Date().getFullYear()), ParseIntPipe)
    year: number,
    @Query('quarter', new DefaultValuePipe('Q1'))
    quarter: string,
  ): Promise<GroupedKpmrResponse> {
    // Validasi quarter
    if (!['Q1', 'Q2', 'Q3', 'Q4'].includes(quarter)) {
      throw new BadRequestException('Quarter harus Q1, Q2, Q3, atau Q4');
    }
    return await this.kpmrLikuiditasService.getGroupedData(year, quarter);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.kpmrLikuiditasService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateKpmrLikuiditasDto,
  ) {
    return await this.kpmrLikuiditasService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.kpmrLikuiditasService.remove(id);
  }

  @Get('period/:year/:quarter')
  async findByPeriod(
    @Param('year', ParseIntPipe) year: number,
    @Param('quarter') quarter: string,
  ) {
    // Validasi quarter
    if (!['Q1', 'Q2', 'Q3', 'Q4'].includes(quarter)) {
      throw new BadRequestException('Quarter harus Q1, Q2, Q3, atau Q4');
    }
    return await this.kpmrLikuiditasService.findByPeriod(year, quarter);
  }

  @Get('export/:year/:quarter')
  async exportData(
    @Param('year', ParseIntPipe) year: number,
    @Param('quarter') quarter: string,
  ) {
    // Validasi quarter
    if (!['Q1', 'Q2', 'Q3', 'Q4'].includes(quarter)) {
      throw new BadRequestException('Quarter harus Q1, Q2, Q3, atau Q4');
    }
    return await this.kpmrLikuiditasService.getExportData(year, quarter);
  }
}
