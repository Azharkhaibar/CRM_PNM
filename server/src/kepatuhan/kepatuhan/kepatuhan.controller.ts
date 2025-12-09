// src/kepatuhan/kepatuhan.controller.ts
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
import { KepatuhanService } from './kepatuhan.service';
import { CreateKepatuhanDto } from './dto/create-kepatuhan.dto';
import { UpdateKepatuhanDto } from './dto/update-kepatuhan.dto';
import { CreateKepatuhanSectionDto } from './dto/create-kepatuhan-section.dto';
import { UpdateKepatuhanSectionDto } from './dto/update-kepatuhan-section.dto';
import { Quarter } from './entities/kepatuhan.entity';

@Controller('kepatuhan')
export class KepatuhanController {
  constructor(private readonly kepatuhanService: KepatuhanService) {}

  // ========== KEPATUHAN ENDPOINTS ==========
  @Post()
  create(@Body() createKepatuhanDto: CreateKepatuhanDto) {
    return this.kepatuhanService.create(createKepatuhanDto);
  }

  @Get()
  findAll(@Query('year') year?: number, @Query('quarter') quarter?: Quarter) {
    if (year && quarter) {
      return this.kepatuhanService.findByPeriod(year, quarter);
    }
    if (year) {
      return this.kepatuhanService.findByYear(year);
    }
    return this.kepatuhanService.findAll();
  }

  @Get('summary')
  getSummary(
    @Query('year', ParseIntPipe) year: number,
    @Query('quarter') quarter: Quarter,
  ) {
    return this.kepatuhanService.getSummary(year, quarter);
  }

  @Get('section/:sectionId')
  findBySection(
    @Param('sectionId', ParseIntPipe) sectionId: number,
    @Query('year') year?: number,
    @Query('quarter') quarter?: Quarter,
  ) {
    return this.kepatuhanService.findBySection(sectionId, year, quarter);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.kepatuhanService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateKepatuhanDto: UpdateKepatuhanDto,
  ) {
    return this.kepatuhanService.update(id, updateKepatuhanDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.kepatuhanService.remove(id);
  }

  @Delete('period')
  deletePeriod(
    @Query('year', ParseIntPipe) year: number,
    @Query('quarter') quarter: Quarter,
  ) {
    return this.kepatuhanService.deleteByPeriod(year, quarter);
  }

  @Post('bulk')
  bulkCreate(@Body() createKepatuhanDtos: CreateKepatuhanDto[]) {
    return this.kepatuhanService.bulkCreate(createKepatuhanDtos);
  }

  // ========== SECTION ENDPOINTS ==========
  @Post('sections')
  createSection(@Body() createSectionDto: CreateKepatuhanSectionDto) {
    return this.kepatuhanService.createSection(createSectionDto);
  }

  @Get('sections/all')
  findAllSections() {
    return this.kepatuhanService.findAllSection();
  }

  @Get('sections/:id')
  findSectionById(@Param('id', ParseIntPipe) id: number) {
    return this.kepatuhanService.findSectionById(id);
  }

  @Patch('sections/:id')
  updateSection(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSectionDto: UpdateKepatuhanSectionDto,
  ) {
    return this.kepatuhanService.updateSection(id, updateSectionDto);
  }

  @Delete('sections/:id')
  deleteSection(@Param('id', ParseIntPipe) id: number) {
    return this.kepatuhanService.deleteSection(id);
  }
}
