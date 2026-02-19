// src/features/Dashboard/pages/RiskProfile/pages/Reputasi/controllers/reputasi.controller.ts
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
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ReputasiService } from './reputasi.service';
import { CreateReputasiSectionDto } from './dto/create-reputasi-section.dto';
import { UpdateReputasiSectionDto } from './dto/update-reputasi-section.dto';
import { Quarter } from './entities/reputasi.entity';
import { CreateReputasiDto } from './dto/create-reputasi.dto';
import { UpdateReputasiDto } from './dto/update-reputasi.dto';
// import { ReputasiService } from './services/reputasi.service';
// import { CreateReputasiSectionDto } from './dto/create-reputasi-section.dto';
// import { UpdateReputasiSectionDto } from './dto/update-reputasi-section.dto';
// import { CreateReputasiDto } from './dto/create-reputasi.dto';
// import { UpdateReputasiDto } from './dto/update-reputasi.dto';
// import { Quarter } from './entities/reputasi.entity';

@ApiTags('Reputasi')
@Controller('reputasi')
export class ReputasiController {
  constructor(private readonly reputasiService: ReputasiService) {}

  // ========== SECTION ENDPOINTS ==========

  @Post('sections')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new reputasi section' })
  async createSection(@Body() createDto: CreateReputasiSectionDto) {
    return await this.reputasiService.createSection(createDto);
  }

  @Get('sections')
  @ApiOperation({ summary: 'Get all reputasi sections' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  async getSections(@Query('isActive') isActive?: boolean) {
    return await this.reputasiService.findAllSections(isActive);
  }

  @Get('sections/:id')
  @ApiOperation({ summary: 'Get reputasi section by ID' })
  async getSection(@Param('id', ParseIntPipe) id: number) {
    return await this.reputasiService.findSectionById(id);
  }

  @Put('sections/:id')
  @ApiOperation({ summary: 'Update reputasi section' })
  async updateSection(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateReputasiSectionDto,
  ) {
    return await this.reputasiService.updateSection(id, updateDto);
  }

  @Delete('sections/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete reputasi section' })
  async deleteSection(@Param('id', ParseIntPipe) id: number) {
    await this.reputasiService.deleteSection(id);
  }

  @Get('indikators/sections-by-period')
  @ApiOperation({ summary: 'Get sections with indicators by period' })
  async getSectionsWithIndicatorsByPeriod(
    @Query('year', new ParseIntPipe()) year: number,
    @Query('quarter') quarter: Quarter,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.reputasiService.getSectionsWithIndicatorsByPeriod(
      year,
      quarter,
    );
  }

  // ========== INDIKATOR ENDPOINTS ==========

  @Post('indikators')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new reputasi indikator' })
  async createIndikator(@Body() createDto: CreateReputasiDto) {
    return await this.reputasiService.createIndikator(createDto);
  }

  @Get('indikators')
  @ApiOperation({ summary: 'Get all reputasi indikators' })
  async getAllIndikators() {
    return await this.reputasiService.findAllIndikators();
  }

  @Get('indikators/period')
  @ApiOperation({ summary: 'Get reputasi indikators by period' })
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiQuery({ name: 'quarter', required: true, enum: Quarter })
  async getIndikatorsByPeriod(
    @Query('year', ParseIntPipe) year: number,
    @Query('quarter') quarter: Quarter,
  ) {
    return await this.reputasiService.findIndikatorsByPeriod(year, quarter);
  }

  @Get('indikators/search')
  @ApiOperation({ summary: 'Search reputasi indikators' })
  @ApiQuery({ name: 'query', required: false })
  @ApiQuery({ name: 'year', required: false })
  @ApiQuery({ name: 'quarter', required: false, enum: Quarter })
  async searchIndikators(
    @Query('query') query?: string,
    @Query('year') year?: number,
    @Query('quarter') quarter?: Quarter,
  ) {
    return await this.reputasiService.searchIndikators(query, year, quarter);
  }

  @Get('indikators/:id')
  @ApiOperation({ summary: 'Get reputasi indikator by ID' })
  async getIndikator(@Param('id', ParseIntPipe) id: number) {
    return await this.reputasiService.findIndikatorById(id);
  }

  @Put('indikators/:id')
  @ApiOperation({ summary: 'Update reputasi indikator' })
  async updateIndikator(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateReputasiDto,
  ) {
    return await this.reputasiService.updateIndikator(id, updateDto);
  }

  @Delete('indikators/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete reputasi indikator' })
  async deleteIndikator(@Param('id', ParseIntPipe) id: number) {
    await this.reputasiService.deleteIndikator(id);
  }

  @Get('total-weighted')
  @ApiOperation({ summary: 'Get total weighted by period' })
  @ApiQuery({ name: 'year', required: true })
  @ApiQuery({ name: 'quarter', required: true, enum: Quarter })
  async getTotalWeighted(
    @Query('year', ParseIntPipe) year: number,
    @Query('quarter') quarter: Quarter,
  ) {
    const total = await this.reputasiService.getTotalWeightedByPeriod(
      year,
      quarter,
    );
    return { total };
  }

  @Get('sections/period')
  @ApiOperation({ summary: 'Get reputasi sections by period' })
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiQuery({ name: 'quarter', required: true, enum: Quarter })
  async getSectionsByPeriod(
    @Query('year', ParseIntPipe) year: number,
    @Query('quarter') quarter: Quarter,
  ) {
    return await this.reputasiService.findSectionsByPeriod(year, quarter);
  }

  @Get('periods')
  @ApiOperation({
    summary: 'Get available periods',
    description: 'Get list of distinct years and quarters that have data',
  })
  async getAvailablePeriods() {
    try {
      const periods = await this.reputasiService.getPeriods();
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
      const periods = await this.reputasiService.getPeriods();

      const periodsWithCounts = await Promise.all(
        periods.map(async (period) => {
          const count = await this.reputasiService.getIndikatorCountByPeriod(
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
    return await this.reputasiService.duplicateIndikatorToNewPeriod(
      id,
      year,
      quarter,
    );
  }
}
