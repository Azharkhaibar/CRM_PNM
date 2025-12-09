// stratejik.controller.ts
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
  BadRequestException,
} from '@nestjs/common';
import { StratejikService } from './stratejik.service';
import { CreateStratejikDto } from './dto/create-stratejik.dto';
import { UpdateStratejikDto } from './dto/update-stratejik.dto';
import { CreateStratejikSectionDto } from './dto/create-stratejik-section.dto';
import { UpdateStratejikSectionDto } from './dto/update-stratejik-section.dto';
import { Quarter } from './entities/stratejik.entity';

@Controller('stratejik')
export class StratejikController {
  constructor(private readonly stratejikService: StratejikService) {}

  @Post()
  create(@Body() createStratejikDto: CreateStratejikDto) {
    return this.stratejikService.create(createStratejikDto);
  }

  @Get()
  findAll(@Query('year') year?: number, @Query('quarter') quarter?: Quarter) {
    if (year && quarter) {
      return this.stratejikService.findByPeriod(year, quarter);
    }
    if (year) {
      return this.stratejikService.findByYear(year);
    }
    return this.stratejikService.findAll();
  }

  // stratejik.controller.ts
  @Get('summary')
  getSummary(
    @Query('year', new ParseIntPipe({ errorHttpStatusCode: 400 })) year: number,
    @Query('quarter', new ValidationPipe({ transform: true })) quarter: Quarter,
  ) {
    // Validasi quarter
    if (!Object.values(Quarter).includes(quarter)) {
      throw new BadRequestException(
        'Quarter tidak valid. Gunakan Q1, Q2, Q3, atau Q4',
      );
    }

    return this.stratejikService.getSummary(year, quarter);
  }

  @Get('section/:sectionId')
  findBySection(
    @Param('sectionId', ParseIntPipe) sectionId: number,
    @Query('year') year?: number,
    @Query('quarter') quarter?: Quarter,
  ) {
    return this.stratejikService.findBySection(sectionId, year, quarter);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.stratejikService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStratejikDto: UpdateStratejikDto,
  ) {
    return this.stratejikService.update(id, updateStratejikDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.stratejikService.remove(id);
  }

  @Post('bulk')
  bulkCreate(@Body() createStratejikDtos: CreateStratejikDto[]) {
    return this.stratejikService.bulkCreate(createStratejikDtos);
  }

  @Post('sections')
  createSection(@Body() createSectionDto: CreateStratejikSectionDto) {
    return this.stratejikService.createSection(createSectionDto);
  }

  @Get('sections/all')
  findAllSections() {
    return this.stratejikService.findAllSection();
  }

  @Get('sections/:id')
  findSectionById(@Param('id', ParseIntPipe) id: number) {
    return this.stratejikService.findSectionById(id);
  }

  @Patch('sections/:id')
  updateSection(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSectionDto: UpdateStratejikSectionDto,
  ) {
    return this.stratejikService.updateSection(id, updateSectionDto);
  }

  @Delete('sections/:id')
  deleteSection(@Param('id', ParseIntPipe) id: number) {
    return this.stratejikService.deleteSection(id);
  }
}
