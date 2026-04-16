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
import { LikuiditasService } from './likuiditas.service';
import { CreateLikuiditasSectionDto } from './dto/create-likuiditas-section.dto';
import { UpdateLikuiditasSectionDto } from './dto/update-likuiditas-section.dto';
import { CreateLikuiditasDto } from './dto/create-likuiditas.dto';
import { UpdateLikuiditasDto } from './dto/update-likuiditas.dto';
import { Quarter } from './entities/likuiditas.entity';

@ApiTags('Likuiditas')
@Controller('likuiditas')
export class LikuiditasController {
  constructor(private readonly likuiditasService: LikuiditasService) {}

  // ========== SECTION ENDPOINTS ==========

  @Post('sections')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new likuiditas section' })
  @ApiResponse({ status: 201, description: 'Section created successfully' })
  @ApiResponse({ status: 409, description: 'Section already exists' })
  async createSection(@Body() createDto: CreateLikuiditasSectionDto) {
    return await this.likuiditasService.createSection(createDto);
  }

  @Get('sections')
  @ApiOperation({ summary: 'Get all likuiditas sections' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  async getSections(@Query('isActive') isActive?: boolean) {
    return await this.likuiditasService.findAllSections(isActive);
  }

  @Get('sections/:id')
  @ApiOperation({ summary: 'Get likuiditas section by ID' })
  async getSection(@Param('id', ParseIntPipe) id: number) {
    return await this.likuiditasService.findSectionById(id);
  }

  @Get('sections/period')
  @ApiOperation({ summary: 'Get likuiditas sections by period' })
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiQuery({ name: 'quarter', required: true, enum: Quarter })
  async getSectionsByPeriod(
    @Query('year', ParseIntPipe) year: number,
    @Query('quarter') quarter: Quarter,
  ) {
    return await this.likuiditasService.findSectionsByPeriod(year, quarter);
  }

  @Put('sections/:id')
  @ApiOperation({ summary: 'Update likuiditas section' })
  async updateSection(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateLikuiditasSectionDto,
  ) {
    return await this.likuiditasService.updateSection(id, updateDto);
  }

  @Delete('sections/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete likuiditas section' })
  async deleteSection(@Param('id', ParseIntPipe) id: number) {
    return await this.likuiditasService.deleteSection(id);
  }

  // ========== INDIKATOR ENDPOINTS ==========

  @Post('indikators')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new likuiditas indikator' })
  @ApiResponse({ status: 201, description: 'Indikator created successfully' })
  @ApiResponse({ status: 409, description: 'Indikator already exists' })
  async createIndikator(@Body() createDto: CreateLikuiditasDto) {
    return await this.likuiditasService.createIndikator(createDto);
  }

  @Get('indikators')
  @ApiOperation({ summary: 'Get all likuiditas indikators' })
  async getAllIndikators() {
    return await this.likuiditasService.findAllIndikators();
  }

  @Get('indikators/period')
  @ApiOperation({ summary: 'Get likuiditas indikators by period' })
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiQuery({ name: 'quarter', required: true, enum: Quarter })
  async getIndikatorsByPeriod(
    @Query('year', ParseIntPipe) year: number,
    @Query('quarter') quarter: Quarter,
  ) {
    return await this.likuiditasService.findIndikatorsByPeriod(year, quarter);
  }

  @Get('indikators/search')
  @ApiOperation({ summary: 'Search likuiditas indikators' })
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
  @ApiOperation({ summary: 'Get likuiditas indikator by ID' })
  async getIndikator(@Param('id', ParseIntPipe) id: number) {
    return await this.likuiditasService.findIndikatorById(id);
  }

  @Put('indikators/:id')
  @ApiOperation({ summary: 'Update likuiditas indikator' })
  async updateIndikator(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateLikuiditasDto,
  ) {
    return await this.likuiditasService.updateIndikator(id, updateDto);
  }

  @Delete('indikators/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete likuiditas indikator' })
  async deleteIndikator(@Param('id', ParseIntPipe) id: number) {
    return await this.likuiditasService.deleteIndikator(id);
  }

  // ========== COMPLEX QUERIES ENDPOINTS ==========

  @Get('data/with-indicators')
  @ApiOperation({
    summary: 'Get sections with their indicators for a period',
    description:
      'Returns sections with nested indicators for a specific year and quarter',
  })
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiQuery({ name: 'quarter', required: true, enum: Quarter })
  async getSectionsWithIndicatorsByPeriod(
    @Query('year', ParseIntPipe) year: number,
    @Query('quarter') quarter: Quarter,
  ) {
    return await this.likuiditasService.getSectionsWithIndicatorsByPeriod(
      year,
      quarter,
    );
  }

  @Get('total-weighted')
  @ApiOperation({ summary: 'Get total weighted value by period' })
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiQuery({ name: 'quarter', required: true, enum: Quarter })
  async getTotalWeighted(
    @Query('year', ParseIntPipe) year: number,
    @Query('quarter') quarter: Quarter,
  ) {
    const total = await this.likuiditasService.getTotalWeightedByPeriod(
      year,
      quarter,
    );
    return {
      success: true,
      year,
      quarter,
      total,
    };
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

  @Get('periods/with-counts')
  @ApiOperation({
    summary: 'Get all periods with indicator counts',
    description: 'Get periods with indicator counts for each period',
  })
  async getAllPeriodsWithCounts() {
    try {
      const periods = await this.likuiditasService.getPeriods();

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
      console.error('Error in getAllPeriodsWithCounts:', error);
      throw error;
    }
  }

  @Get('indikators/count')
  @ApiOperation({ summary: 'Get indikator count by period' })
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiQuery({ name: 'quarter', required: true, enum: Quarter })
  async getIndikatorCount(
    @Query('year', ParseIntPipe) year: number,
    @Query('quarter') quarter: Quarter,
  ) {
    const count = await this.likuiditasService.getIndikatorCountByPeriod(
      year,
      quarter,
    );
    return {
      success: true,
      year,
      quarter,
      count,
    };
  }

  // ========== DUPLICATION ENDPOINT ==========
  @Post('indikators/:id/duplicate')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Duplicate indikator to new period',
    description: 'Copy an existing indikator to a different period',
  })
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
