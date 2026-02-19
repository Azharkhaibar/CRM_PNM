// src/modules/ras/ras.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { RasService } from './ras.service';
import { CreateRasDto } from './dto/create-ra.dto';
import { UpdateRasDto } from './dto/update-ra.dto';
import { UpdateMonthlyValuesDto } from './dto/update-monthly-values.dto';
import { FilterRasDto } from './dto/filter-ras.dto';
import { ImportRasDto } from './dto/import-ras.dto';

@Controller('ras')
export class RasController {
  constructor(private readonly rasService: RasService) {}

  @Post()
  create(@Body() createRasDto: CreateRasDto) {
    return this.rasService.create(createRasDto);
  }

  @Get()
  findAll(@Query() filterDto: FilterRasDto) {
    return this.rasService.findAll(filterDto);
  }

  @Get('categories')
  getCategories() {
    return this.rasService.getRiskCategories();
  }

  @Get('yearly/:year')
  getYearlyData(@Param('year', ParseIntPipe) year: number) {
    return this.rasService.findByYearAndMonth(year);
  }

  @Get('yearly-stats/:year')
  getYearlyStats(@Param('year', ParseIntPipe) year: number) {
    return this.rasService.getYearlyStats(year);
  }

  @Get('monthly/:year')
  getMonthlyData(
    @Param('year', ParseIntPipe) year: number,
    @Query('month') month?: string,
  ) {
    const monthNumber = month ? parseInt(month, 10) : undefined;
    return this.rasService.findByYearAndMonth(year, monthNumber);
  }

  @Get('follow-up/:year/:month')
  getFollowUpItems(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
  ) {
    return this.rasService.getItemsNeedingFollowUp(year, month);
  }

  @Get('export/monthly/:year')
  exportMonthlyData(
    @Param('year', ParseIntPipe) year: number,
    @Query('months') months: string,
  ) {
    const monthArray = months.split(',').map((m) => parseInt(m, 10));
    return this.rasService.exportMonthlyData(year, monthArray);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRasDto: UpdateRasDto,
  ) {
    return this.rasService.update(id, updateRasDto);
  }

  @Patch(':id/monthly-values')
  updateMonthlyValues(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMonthlyValuesDto: UpdateMonthlyValuesDto,
  ) {
    return this.rasService.updateMonthlyValues(id, updateMonthlyValuesDto);
  }

  @Patch(':id/tindak-lanjut')
  updateTindakLanjut(
    @Param('id', ParseIntPipe) id: number,
    @Body() tindakLanjut: UpdateRasDto['tindakLanjut'],
  ) {
    return this.rasService.updateTindakLanjut(id, tindakLanjut);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rasService.remove(id);
  }

  @Post('import')
  importData(@Body() importRasDto: ImportRasDto) {
    return this.rasService.importData(importRasDto);
  }
}
