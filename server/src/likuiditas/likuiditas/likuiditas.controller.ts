// src/features/Dashboard/pages/RiskProfile/pages/Strategik/controllers/strategik.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { LikuiditasService } from './likuiditas.service';
import { CreateLikuiditasSectionDto } from './dto/create-likuiditas-section.dto';
import { UpdateLikuiditasSectionDto } from './dto/update-likuiditas-section.dto';
import { Quarter } from './entities/likuiditas.entity';
import { CreateLikuiditasDto } from './dto/create-likuiditas.dto';
import { UpdateLikuiditasDto } from './dto/update-likuiditas.dto';
// import { StrategikService } from '../services/strategik.service';
// import { CreateStrategikSectionDto } from '../dto/create-strategik-section.dto';
// import { UpdateStrategikSectionDto } from '../dto/update-strategik-section.dto';
// import { CreateStrategikDto } from '../dto/create-strategik.dto';
// import { UpdateStrategikDto } from '../dto/update-strategik.dto';
// import { Quarter } from '../../../../entities/strategik/stratejik.entity';

// import { StrategikService } from './stratejik.service';
// import { CreateStrategikSectionDto } from './dto/create-stratejik-section.dto';
// import { UpdateStrategikSectionDto } from './dto/update-stratejik-section.dto';
// import { CreateStrategikDto } from './dto/create-stratejik.dto';
// import { UpdateStrategikDto } from './dto/update-stratejik.dto';
// import { Quarter } from './entities/stratejik.entity';
// src/features/Dashboard/pages/RiskProfile/pages/Strategik/controllers/strategik.controller.ts

// ... imports ...

@ApiTags('Likuiditas')
@Controller('likuiditas')
export class LikuiditasController {
  constructor(private readonly likuiditasService: LikuiditasService) {}

  // ========== SECTION ENDPOINTS ==========

  @Post('sections')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new strategik section' })
  async createSection(@Body() createDto: CreateLikuiditasSectionDto) {
    return await this.likuiditasService.createSection(createDto);
  }

  @Get('sections')
  @ApiOperation({ summary: 'Get all strategik sections' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  async getSections(@Query('isActive') isActive?: boolean) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.likuiditasService.findAllSections(isActive);
  }

  @Get('sections/:id')
  @ApiOperation({ summary: 'Get strategik section by ID' })
  async getSection(@Param('id', ParseIntPipe) id: number) {
    return await this.likuiditasService.findSectionById(id); // Method ini harus ada di service
  }

  @Put('sections/:id')
  @ApiOperation({ summary: 'Update strategik section' })
  async updateSection(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateLikuiditasSectionDto,
  ) {
    return await this.likuiditasService.updateSection(id, updateDto);
  }

  @Delete('sections/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete strategik section' })
  async deleteSection(@Param('id', ParseIntPipe) id: number) {
    await this.likuiditasService.deleteSection(id);
  }

  @Get('indikators/sections-by-period')
  @ApiOperation({ summary: 'Get sections with indicators by period' })
  async getSectionsWithIndicatorsByPeriod(
    @Query('year', new ParseIntPipe()) year: number,
    @Query('quarter') quarter: Quarter,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.likuiditasService.getSectionsWithIndicatorsByPeriod(
      year,
      quarter,
    );
  }

  // ========== INDIKATOR ENDPOINTS ==========

  @Post('indikators')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new strategik indikator' })
  async createIndikator(@Body() createDto: CreateLikuiditasDto) {
    return await this.likuiditasService.createIndikator(createDto);
  }

  @Get('indikators')
  @ApiOperation({ summary: 'Get all strategik indikators' })
  async getAllIndikators() {
    return await this.likuiditasService.findAllIndikators();
  }

  @Get('indikators/period')
  @ApiOperation({ summary: 'Get strategik indikators by period' })
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiQuery({ name: 'quarter', required: true, enum: Quarter })
  async getIndikatorsByPeriod(
    @Query('year', ParseIntPipe) year: number,
    @Query('quarter') quarter: Quarter,
  ) {
    return await this.likuiditasService.findIndikatorsByPeriod(year, quarter);
  }

  @Get('indikators/search')
  @ApiOperation({ summary: 'Search strategik indikators' })
  @ApiQuery({ name: 'query', required: false })
  @ApiQuery({ name: 'year', required: false })
  @ApiQuery({ name: 'quarter', required: false, enum: Quarter })
  async searchIndikators(
    @Query('query') query?: string,
    @Query('year') year?: number,
    @Query('quarter') quarter?: Quarter,
  ) {
    return await this.likuiditasService.searchIndikators(query, year, quarter);
  }

  @Get('indikators/:id')
  @ApiOperation({ summary: 'Get strategik indikator by ID' })
  async getIndikator(@Param('id', ParseIntPipe) id: number) {
    return await this.likuiditasService.findIndikatorById(id);
  }

  @Put('indikators/:id')
  @ApiOperation({ summary: 'Update strategik indikator' })
  async updateIndikator(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateLikuiditasDto,
  ) {
    return await this.likuiditasService.updateIndikator(id, updateDto);
  }

  @Delete('indikators/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete strategik indikator' })
  async deleteIndikator(@Param('id', ParseIntPipe) id: number) {
    await this.likuiditasService.deleteIndikator(id);
  }

  @Get('total-weighted')
  @ApiOperation({ summary: 'Get total weighted by period' })
  @ApiQuery({ name: 'year', required: true })
  @ApiQuery({ name: 'quarter', required: true, enum: Quarter })
  async getTotalWeighted(
    @Query('year', ParseIntPipe) year: number,
    @Query('quarter') quarter: Quarter,
  ) {
    const total = await this.likuiditasService.getTotalWeightedByPeriod(
      year,
      quarter,
    );
    return { total };
  }

  // PERBAIKAN: Hanya ada satu method getSectionsByPeriod
  @Get('sections/period')
  @ApiOperation({ summary: 'Get strategik sections by period' })
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiQuery({ name: 'quarter', required: true, enum: Quarter })
  async getSectionsByPeriod(
    @Query('year', ParseIntPipe) year: number,
    @Query('quarter') quarter: Quarter,
  ) {
    return await this.likuiditasService.findSectionsByPeriod(year, quarter);
  }

  @Get('periods')
  @ApiOperation({
    summary: 'Get available periods',
    description: 'Get list of distinct years and quarters that have data',
  })
  async getAvailablePeriods() {
    try {
      const periods = await this.likuiditasService.getPeriods();
      return {
        success: true,
        data: periods,
        count: periods.length,
      };
    } catch (error) {
      console.error('Error in getAvailablePeriods:', error);
      throw error;
    }
  }

  @Get('all-periods')
  @ApiOperation({
    summary: 'Get all periods with count',
    description: 'Get periods with indicator counts',
  })
  async getAllPeriods() {
    try {
      const periods = await this.likuiditasService.getPeriods();

      // Hitung jumlah indikator per periode
      const periodsWithCounts = await Promise.all(
        periods.map(async (period) => {
          const count = await this.likuiditasService.getIndikatorCountByPeriod(
            period.year,
            period.quarter,
          );
          return {
            ...period,
            indicatorCount: count,
          };
        }),
      );

      return {
        success: true,
        data: periodsWithCounts,
        count: periodsWithCounts.length,
      };
    } catch (error) {
      console.error('Error in getAllPeriods:', error);
      throw error;
    }
  }

  @Post('indikators/:id/duplicate')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Duplicate indikator to new period' })
  async duplicateIndikator(
    @Param('id', ParseIntPipe) id: number,
    @Query('year', ParseIntPipe) year: number,
    @Query('quarter') quarter: Quarter,
  ) {
    return await this.likuiditasService.duplicateIndikatorToNewPeriod(
      id,
      year,
      quarter,
    );
  }
}
