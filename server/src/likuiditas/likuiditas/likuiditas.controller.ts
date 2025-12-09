import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { LikuiditasService } from './likuiditas.service';
import {
  CreateSectionLikuiditasDto,
  CreateIndikatorLikuiditasDto,
} from './dto/create-likuiditas.dto';
// import {
//   UpdateSectionLikuiditasDto,
//   UpdateIndikatorLikuiditasDto,
// } from './dto/update-likuiditas.dto';
import {
  UpdateSectionLikuiditasDto,
  UpdateIndikatorLikuiditasDto,
} from './dto/update-likuidita.dto';
import { Quarter } from './entities/likuiditas.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Likuiditas') // Tag untuk grouping di Swagger
@Controller('likuiditas')
export class LikuiditasController {
  constructor(private readonly likuiditasService: LikuiditasService) {}

  // ===================== SECTION ENDPOINTS =====================
  @Post('sections')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new section' })
  @ApiBody({ type: CreateSectionLikuiditasDto })
  @ApiResponse({ status: 201, description: 'Section created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createSection(@Body() createSectionDto: CreateSectionLikuiditasDto) {
    return await this.likuiditasService.createSection(createSectionDto);
  }

  @Put('sections/:id')
  @ApiOperation({ summary: 'Update section by ID' })
  @ApiParam({ name: 'id', description: 'Section ID' })
  @ApiBody({ type: UpdateSectionLikuiditasDto })
  @ApiResponse({ status: 200, description: 'Section updated successfully' })
  @ApiResponse({ status: 404, description: 'Section not found' })
  async updateSection(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSectionDto: UpdateSectionLikuiditasDto,
  ) {
    return await this.likuiditasService.updateSection(id, updateSectionDto);
  }

  @Delete('sections/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete section by ID' })
  @ApiParam({ name: 'id', description: 'Section ID' })
  @ApiResponse({ status: 204, description: 'Section deleted successfully' })
  @ApiResponse({ status: 404, description: 'Section not found' })
  async deleteSection(@Param('id', ParseIntPipe) id: number) {
    await this.likuiditasService.deleteSection(id);
    return { message: 'Section berhasil dihapus' };
  }

  @Get('sections')
  @ApiOperation({ summary: 'Get sections by period' })
  @ApiQuery({ name: 'year', type: Number, example: 2024 })
  @ApiQuery({ name: 'quarter', enum: ['Q1', 'Q2', 'Q3', 'Q4'], example: 'Q1' })
  @ApiResponse({ status: 200, description: 'List of sections' })
  async getSectionsByPeriod(
    @Query('year', ParseIntPipe) year: number,
    @Query('quarter') quarter: Quarter,
  ) {
    return await this.likuiditasService.getSectionsByPeriod(year, quarter);
  }

  // ===================== INDICATOR ENDPOINTS =====================
  @Post('indikators')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new indicator' })
  @ApiBody({ type: CreateIndikatorLikuiditasDto })
  @ApiResponse({ status: 201, description: 'Indicator created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Section not found' })
  async createIndikator(
    @Body() createIndikatorDto: CreateIndikatorLikuiditasDto,
  ) {
    return await this.likuiditasService.createIndikator(createIndikatorDto);
  }

  @Put('indikators/:id')
  @ApiOperation({ summary: 'Update indicator by ID' })
  @ApiParam({ name: 'id', description: 'Indicator ID' })
  @ApiBody({ type: UpdateIndikatorLikuiditasDto })
  @ApiResponse({ status: 200, description: 'Indicator updated successfully' })
  @ApiResponse({ status: 404, description: 'Indicator not found' })
  async updateIndikator(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIndikatorDto: UpdateIndikatorLikuiditasDto,
  ) {
    return await this.likuiditasService.updateIndikator(id, updateIndikatorDto);
  }

  @Delete('indikators/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete indicator by ID' })
  @ApiParam({ name: 'id', description: 'Indicator ID' })
  @ApiResponse({ status: 204, description: 'Indicator deleted successfully' })
  @ApiResponse({ status: 404, description: 'Indicator not found' })
  async deleteIndikator(@Param('id', ParseIntPipe) id: number) {
    await this.likuiditasService.deleteIndikator(id);
    return { message: 'Indikator berhasil dihapus' };
  }

  @Get('indikators/:id')
  @ApiOperation({ summary: 'Get indicator by ID' })
  @ApiParam({ name: 'id', description: 'Indicator ID' })
  @ApiResponse({ status: 200, description: 'Indicator details' })
  @ApiResponse({ status: 404, description: 'Indicator not found' })
  async getIndikatorById(@Param('id', ParseIntPipe) id: number) {
    return await this.likuiditasService.getIndikatorById(id);
  }

  // ===================== SUMMARY ENDPOINTS =====================
  @Get('summary')
  @ApiOperation({ summary: 'Get summary by period' })
  @ApiQuery({ name: 'year', type: Number, example: 2024 })
  @ApiQuery({ name: 'quarter', enum: ['Q1', 'Q2', 'Q3', 'Q4'], example: 'Q1' })
  @ApiResponse({ status: 200, description: 'Summary data' })
  async getSummaryByPeriod(
    @Query('year', ParseIntPipe) year: number,
    @Query('quarter') quarter: Quarter,
  ) {
    return await this.likuiditasService.getSummaryByPeriod(year, quarter);
  }
}
