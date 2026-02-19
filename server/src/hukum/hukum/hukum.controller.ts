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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { HukumService } from './hukum.service';
import { CreateHukumSectionDto } from './dto/create-hukum-section.dto';
import { UpdateHukumSectionDto } from './dto/update-hukum-section.dto';
import { Quarter } from './entities/hukum.entity';
import { UpdateHukumDto } from './dto/update-hukum.dto';
import { CreateHukumDto } from './dto/create-hukum.dto';
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

@ApiTags('Hukum')
@Controller('hukum')
export class HukumController {
  constructor(private readonly hukumService: HukumService) {}

  // ========== SECTION ENDPOINTS ==========

  @Post('sections')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new strategik section' })
  async createSection(@Body() createDto: CreateHukumSectionDto) {
    return await this.hukumService.createSection(createDto);
  }

  @Get('sections')
  @ApiOperation({ summary: 'Get all strategik sections' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  async getSections(@Query('isActive') isActive?: boolean) {
    return await this.hukumService.findAllSections(isActive);
  }

  @Get('sections/:id')
  @ApiOperation({ summary: 'Get strategik section by ID' })
  async getSection(@Param('id', ParseIntPipe) id: number) {
    return await this.hukumService.findSectionById(id); // Method ini harus ada di service
  }

  @Put('sections/:id')
  @ApiOperation({ summary: 'Update strategik section' })
  async updateSection(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateHukumSectionDto,
  ) {
    return await this.hukumService.updateSection(id, updateDto);
  }

  @Delete('sections/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete strategik section' })
  async deleteSection(@Param('id', ParseIntPipe) id: number) {
    await this.hukumService.deleteSection(id);
  }

  @Get('indikators/sections-by-period')
  @ApiOperation({ summary: 'Get sections with indicators by period' })
  async getSectionsWithIndicatorsByPeriod(
    @Query('year', new ParseIntPipe()) year: number,
    @Query('quarter') quarter: Quarter,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.hukumService.getSectionsWithIndicatorsByPeriod(
      year,
      quarter,
    );
  }

  // ========== INDIKATOR ENDPOINTS ==========

  @Post('indikators')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new strategik indikator' })
  async createIndikator(@Body() createDto: CreateHukumDto) {
    return await this.hukumService.createIndikator(createDto);
  }

  @Get('indikators')
  @ApiOperation({ summary: 'Get all strategik indikators' })
  async getAllIndikators() {
    return await this.hukumService.findAllIndikators();
  }

  @Get('indikators/period')
  @ApiOperation({ summary: 'Get strategik indikators by period' })
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiQuery({ name: 'quarter', required: true, enum: Quarter })
  async getIndikatorsByPeriod(
    @Query('year', ParseIntPipe) year: number,
    @Query('quarter') quarter: Quarter,
  ) {
    return await this.hukumService.findIndikatorsByPeriod(year, quarter);
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
    return await this.hukumService.searchIndikators(query, year, quarter);
  }

  @Get('indikators/:id')
  @ApiOperation({ summary: 'Get strategik indikator by ID' })
  async getIndikator(@Param('id', ParseIntPipe) id: number) {
    return await this.hukumService.findIndikatorById(id);
  }

  @Put('indikators/:id')
  @ApiOperation({ summary: 'Update strategik indikator' })
  async updateIndikator(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateHukumDto,
  ) {
    return await this.hukumService.updateIndikator(id, updateDto);
  }

  @Delete('indikators/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete strategik indikator' })
  async deleteIndikator(@Param('id', ParseIntPipe) id: number) {
    await this.hukumService.deleteIndikator(id);
  }

  @Get('total-weighted')
  @ApiOperation({ summary: 'Get total weighted by period' })
  @ApiQuery({ name: 'year', required: true })
  @ApiQuery({ name: 'quarter', required: true, enum: Quarter })
  async getTotalWeighted(
    @Query('year', ParseIntPipe) year: number,
    @Query('quarter') quarter: Quarter,
  ) {
    const total = await this.hukumService.getTotalWeightedByPeriod(
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
    return await this.hukumService.findSectionsByPeriod(year, quarter);
  }

  @Get('periods')
  @ApiOperation({
    summary: 'Get available periods',
    description: 'Get list of distinct years and quarters that have data',
  })
  async getAvailablePeriods() {
    try {
      const periods = await this.hukumService.getPeriods();
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
      const periods = await this.hukumService.getPeriods();

      // Hitung jumlah indikator per periode
      const periodsWithCounts = await Promise.all(
        periods.map(async (period) => {
          const count = await this.hukumService.getIndikatorCountByPeriod(
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
    return await this.hukumService.duplicateIndikatorToNewPeriod(
      id,
      year,
      quarter,
    );
  }
}
