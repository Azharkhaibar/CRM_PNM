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
import { ReputasiService } from './reputasi.service';
import { CreateReputasiDto } from './dto/create-reputasi.dto';
import { UpdateReputasiDto } from './dto/update-reputasi.dto';
import { CreateReputasiSectionDto } from './dto/create-reputasi-section.dto';
import { UpdateReputasiSectionDto } from './dto/update-reputasi-section.dto';
import { Quarter } from './entities/reputasi.entity';

@Controller('reputasi')
export class ReputasiController {
  constructor(private readonly reputasiService: ReputasiService) {}

  // ========== REPUTASI ENDPOINTS ==========
  @Post()
  create(@Body() createReputasiDto: CreateReputasiDto) {
    return this.reputasiService.create(createReputasiDto);
  }

  @Get()
  findAll(@Query('year') year?: number, @Query('quarter') quarter?: Quarter) {
    if (year && quarter) {
      return this.reputasiService.findByPeriod(year, quarter);
    }
    if (year) {
      return this.reputasiService.findByYear(year);
    }
    return this.reputasiService.findAll();
  }

  @Get('summary')
  getSummary(
    @Query('year', ParseIntPipe) year: number,
    @Query('quarter') quarter: Quarter,
  ) {
    return this.reputasiService.getSummary(year, quarter);
  }

  @Get('score')
  getReputasiScore(
    @Query('year', ParseIntPipe) year: number,
    @Query('quarter') quarter: Quarter,
  ) {
    return this.reputasiService.getReputasiScore(year, quarter);
  }

  @Get('risk-distribution')
  getRiskDistribution(
    @Query('year', ParseIntPipe) year: number,
    @Query('quarter') quarter: Quarter,
  ) {
    return this.reputasiService.getRiskLevelDistribution(year, quarter);
  }

  @Get('section/:sectionId')
  findBySection(
    @Param('sectionId', ParseIntPipe) sectionId: number,
    @Query('year') year?: number,
    @Query('quarter') quarter?: Quarter,
  ) {
    return this.reputasiService.findBySection(sectionId, year, quarter);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reputasiService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReputasiDto: UpdateReputasiDto,
  ) {
    return this.reputasiService.update(id, updateReputasiDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reputasiService.remove(id);
  }

  @Delete('period')
  deletePeriod(
    @Query('year', ParseIntPipe) year: number,
    @Query('quarter') quarter: Quarter,
  ) {
    return this.reputasiService.deleteByPeriod(year, quarter);
  }

  @Post('bulk')
  bulkCreate(@Body() createReputasiDtos: CreateReputasiDto[]) {
    return this.reputasiService.bulkCreate(createReputasiDtos);
  }

  // ========== SECTION ENDPOINTS ==========
  @Post('sections')
  createSection(@Body() createSectionDto: CreateReputasiSectionDto) {
    return this.reputasiService.createSection(createSectionDto);
  }

  @Get('sections/all')
  findAllSections() {
    return this.reputasiService.findAllSection();
  }

  @Get('sections/:id')
  findSectionById(@Param('id', ParseIntPipe) id: number) {
    return this.reputasiService.findSectionById(id);
  }

  @Patch('sections/:id')
  updateSection(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSectionDto: UpdateReputasiSectionDto,
  ) {
    return this.reputasiService.updateSection(id, updateSectionDto);
  }

  @Delete('sections/:id')
  deleteSection(@Param('id', ParseIntPipe) id: number) {
    return this.reputasiService.deleteSection(id);
  }
}
