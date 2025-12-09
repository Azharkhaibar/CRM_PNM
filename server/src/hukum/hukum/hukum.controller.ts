// src/hukum/hukum.controller.ts
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
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { HukumService } from './hukum.service';
import { CreateHukumDto } from './dto/create-hukum.dto';
import { UpdateHukumDto } from './dto/update-hukum.dto';
import { CreateHukumSectionDto } from './dto/create-hukum-section.dto';
import { UpdateHukumSectionDto } from './dto/update-hukum-section.dto';
import { Quarter } from './entities/hukum.entity';

@Controller('hukum')
export class HukumController {
  constructor(private readonly hukumService: HukumService) {}

  // ========== HUKUM ENDPOINTS ==========
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createHukumDto: CreateHukumDto) {
    return this.hukumService.create(createHukumDto);
  }

  @Get()
  findAll(@Query('year') year?: number, @Query('quarter') quarter?: Quarter) {
    if (year && quarter) {
      return this.hukumService.findByPeriod(year, quarter);
    }
    if (year) {
      return this.hukumService.findByYear(year);
    }
    return this.hukumService.findAll();
  }

  @Get('structured')
  getStructuredData(
    @Query('year', ParseIntPipe) year: number,
    @Query('quarter') quarter: Quarter,
  ) {
    return this.hukumService.getStructuredData(year, quarter);
  }

  @Get('summary')
  getSummary(
    @Query('year', ParseIntPipe) year: number,
    @Query('quarter') quarter: Quarter,
  ) {
    return this.hukumService.getSummary(year, quarter);
  }

  @Get('section/:sectionId')
  findBySection(
    @Param('sectionId', ParseIntPipe) sectionId: number,
    @Query('year') year?: number,
    @Query('quarter') quarter?: Quarter,
  ) {
    return this.hukumService.findBySection(sectionId, year, quarter);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.hukumService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHukumDto: UpdateHukumDto,
  ) {
    return this.hukumService.update(id, updateHukumDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.hukumService.remove(id);
  }

  @Delete('period')
  deletePeriod(
    @Query('year', ParseIntPipe) year: number,
    @Query('quarter') quarter: Quarter,
  ) {
    return this.hukumService.deleteByPeriod(year, quarter);
  }

  @Post('bulk')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  bulkCreate(@Body() createHukumDtos: CreateHukumDto[]) {
    return this.hukumService.bulkCreate(createHukumDtos);
  }

  // ========== SECTION ENDPOINTS ==========
  @Post('sections')
  @UsePipes(new ValidationPipe({ transform: true }))
  createSection(@Body() createSectionDto: CreateHukumSectionDto) {
    return this.hukumService.createSection(createSectionDto);
  }

  @Get('sections/all')
  findAllSections() {
    return this.hukumService.findAllSection();
  }

  @Get('sections/:id')
  findSectionById(@Param('id', ParseIntPipe) id: number) {
    return this.hukumService.findSectionById(id);
  }

  @Patch('sections/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  updateSection(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSectionDto: UpdateHukumSectionDto,
  ) {
    return this.hukumService.updateSection(id, updateSectionDto);
  }

  @Delete('sections/:id')
  deleteSection(@Param('id', ParseIntPipe) id: number) {
    return this.hukumService.deleteSection(id);
  }
}
