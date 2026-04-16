kpmr-investasi.controller

// src/features/Dashboard/pages/RiskProfile/pages/Investasi/controllers/kpmr.controller.ts
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
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { KPMRService } from './kpmr-investasi.service';
import {
  CreateKPMRAspectDto,
  UpdateKPMRAspectDto,
  CreateKPMRQuestionDto,
  UpdateKPMRQuestionDto,
  CreateKPMRDefinitionDto,
  UpdateKPMRDefinitionDto,
  CreateKPMRScoreDto,
  UpdateKPMRScoreDto,
} from './dto/kpmr-investasi.dto';

@ApiTags('KPMR Investasi')
@Controller('kpmr-investasi')
export class KPMRController {
  constructor(private readonly kpmrService: KPMRService) {}

  // ========== ASPECT ENDPOINTS ==========
  @Post('aspects')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new KPMR aspect' })
  async createAspect(@Body() createDto: CreateKPMRAspectDto) {
    return await this.kpmrService.createAspect(createDto);
  }

  @Get('aspects')
  @ApiOperation({ summary: 'Get all KPMR aspects' })
  async getAllAspects() {
    return await this.kpmrService.findAllAspects();
  }

  @Get('aspects/:id')
  @ApiOperation({ summary: 'Get KPMR aspect by ID' })
  async getAspect(@Param('id', ParseIntPipe) id: number) {
    return await this.kpmrService.findAspectById(id);
  }

  @Put('aspects/:id')
  @ApiOperation({ summary: 'Update KPMR aspect' })
  async updateAspect(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateKPMRAspectDto,
  ) {
    return await this.kpmrService.updateAspect(id, updateDto);
  }

  @Delete('aspects/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete KPMR aspect' })
  async deleteAspect(@Param('id', ParseIntPipe) id: number) {
    return await this.kpmrService.deleteAspect(id);
  }

  // ========== QUESTION ENDPOINTS ==========
  @Post('questions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new KPMR question' })
  async createQuestion(@Body() createDto: CreateKPMRQuestionDto) {
    return await this.kpmrService.createQuestion(createDto);
  }

  @Get('questions')
  @ApiOperation({ summary: 'Get all KPMR questions' })
  async getAllQuestions() {
    return await this.kpmrService.findAllQuestions();
  }

  @Get('questions/aspect/:aspekNo')
  @ApiOperation({ summary: 'Get questions by aspect' })
  async getQuestionsByAspect(@Param('aspekNo') aspekNo: string) {
    return await this.kpmrService.findQuestionsByAspect(aspekNo);
  }

  @Get('questions/:id')
  @ApiOperation({ summary: 'Get question by ID' })
  async getQuestion(@Param('id', ParseIntPipe) id: number) {
    return await this.kpmrService.findQuestionById(id);
  }

  @Put('questions/:id')
  @ApiOperation({ summary: 'Update KPMR question' })
  async updateQuestion(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateKPMRQuestionDto,
  ) {
    return await this.kpmrService.updateQuestion(id, updateDto);
  }

  @Delete('questions/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete KPMR question' })
  async deleteQuestion(@Param('id', ParseIntPipe) id: number) {
    return await this.kpmrService.deleteQuestion(id);
  }

  // ========== DEFINITION ENDPOINTS ==========
  @Post('definitions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create or update KPMR definition' })
  async createOrUpdateDefinition(@Body() createDto: CreateKPMRDefinitionDto) {
    return await this.kpmrService.createOrUpdateDefinition(createDto);
  }

  @Get('definitions')
  @ApiOperation({ summary: 'Get all KPMR definitions' })
  async getAllDefinitions() {
    return await this.kpmrService.findAllDefinitions();
  }

  @Get('definitions/year/:year')
  @ApiOperation({ summary: 'Get definitions by year' })
  async getDefinitionsByYear(@Param('year', ParseIntPipe) year: number) {
    return await this.kpmrService.findDefinitionsByYear(year);
  }

  @Get('definitions/:id')
  @ApiOperation({ summary: 'Get definition by ID' })
  async getDefinition(@Param('id', ParseIntPipe) id: number) {
    return await this.kpmrService.findDefinitionById(id);
  }

  @Put('definitions/:id')
  @ApiOperation({ summary: 'Update definition' })
  async updateDefinition(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateKPMRDefinitionDto,
  ) {
    return await this.kpmrService.updateDefinition(id, updateDto);
  }

  @Delete('definitions/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete definition' })
  async deleteDefinition(@Param('id', ParseIntPipe) id: number) {
    return await this.kpmrService.deleteDefinition(id);
  }

  // ========== SCORE ENDPOINTS ==========
  @Post('scores')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create or update KPMR score' })
  async createOrUpdateScore(@Body() createDto: CreateKPMRScoreDto) {
    return await this.kpmrService.createOrUpdateScore(createDto);
  }

  @Get('scores')
  @ApiOperation({ summary: 'Get all scores' })
  async getAllScores() {
    return await this.kpmrService.findAllScores();
  }

  @Get('scores/period')
  @ApiOperation({ summary: 'Get scores by period' })
  @ApiQuery({ name: 'year', required: true })
  @ApiQuery({ name: 'quarter', required: false })
  async getScoresByPeriod(
    @Query('year', ParseIntPipe) year: number,
    @Query('quarter') quarter?: string,
  ) {
    return await this.kpmrService.findScoresByPeriod(year, quarter);
  }

  @Get('scores/definition/:definitionId')
  @ApiOperation({ summary: 'Get scores by definition' })
  async getScoresByDefinition(
    @Param('definitionId', ParseIntPipe) definitionId: number,
  ) {
    return await this.kpmrService.findScoresByDefinition(definitionId);
  }

  @Get('scores/:id')
  @ApiOperation({ summary: 'Get score by ID' })
  async getScore(@Param('id', ParseIntPipe) id: number) {
    return await this.kpmrService.findScoreById(id);
  }

  @Put('scores/:id')
  @ApiOperation({ summary: 'Update score' })
  async updateScore(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateKPMRScoreDto,
  ) {
    return await this.kpmrService.updateScore(id, updateDto);
  }

  @Delete('scores/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete score by ID' })
  async deleteScore(@Param('id', ParseIntPipe) id: number) {
    return await this.kpmrService.deleteScore(id);
  }

  @Delete('scores/target')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete score by definition, year, and quarter' })
  @ApiQuery({ name: 'definitionId', required: true })
  @ApiQuery({ name: 'year', required: true })
  @ApiQuery({ name: 'quarter', required: true })
  async deleteScoreByTarget(
    @Query('definitionId', ParseIntPipe) definitionId: number,
    @Query('year', ParseIntPipe) year: number,
    @Query('quarter') quarter: string,
  ) {
    return await this.kpmrService.deleteScoreByTarget(
      definitionId,
      year,
      quarter,
    );
  }

  // ========== COMPLEX QUERIES ==========
  @Get('full-data/:year')
  @ApiOperation({ summary: 'Get complete KPMR data with grouping' })
  async getFullData(@Param('year', ParseIntPipe) year: number) {
    return await this.kpmrService.getKPMRFullData(year);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search KPMR data' })
  @ApiQuery({ name: 'year', required: false })
  @ApiQuery({ name: 'query', required: false })
  @ApiQuery({ name: 'aspekNo', required: false })
  async searchKPMR(
    @Query('year', ParseIntPipe) year?: number,
    @Query('query') query?: string,
    @Query('aspekNo') aspekNo?: string,
  ) {
    return await this.kpmrService.searchKPMR(year, query, aspekNo);
  }

  @Get('years')
  @ApiOperation({ summary: 'Get available years' })
  async getAvailableYears() {
    const years = await this.kpmrService.getAvailableYears();
    return { success: true, data: years };
  }

  @Get('periods')
  @ApiOperation({ summary: 'Get available periods' })
  async getPeriods() {
    const periods = await this.kpmrService.getPeriods();
    return { success: true, data: periods };
  }
}

kpmr-investasi.service

// src/features/Dashboard/pages/RiskProfile/pages/Investasi/controllers/kpmr.controller.ts
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
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { KPMRService } from './kpmr-investasi.service';
import {
  CreateKPMRAspectDto,
  UpdateKPMRAspectDto,
  CreateKPMRQuestionDto,
  UpdateKPMRQuestionDto,
  CreateKPMRDefinitionDto,
  UpdateKPMRDefinitionDto,
  CreateKPMRScoreDto,
  UpdateKPMRScoreDto,
} from './dto/kpmr-investasi.dto';

@ApiTags('KPMR Investasi')
@Controller('kpmr-investasi')
export class KPMRController {
  constructor(private readonly kpmrService: KPMRService) {}

  // ========== ASPECT ENDPOINTS ==========
  @Post('aspects')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new KPMR aspect' })
  async createAspect(@Body() createDto: CreateKPMRAspectDto) {
    return await this.kpmrService.createAspect(createDto);
  }

  @Get('aspects')
  @ApiOperation({ summary: 'Get all KPMR aspects' })
  async getAllAspects() {
    return await this.kpmrService.findAllAspects();
  }

  @Get('aspects/:id')
  @ApiOperation({ summary: 'Get KPMR aspect by ID' })
  async getAspect(@Param('id', ParseIntPipe) id: number) {
    return await this.kpmrService.findAspectById(id);
  }

  @Put('aspects/:id')
  @ApiOperation({ summary: 'Update KPMR aspect' })
  async updateAspect(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateKPMRAspectDto,
  ) {
    return await this.kpmrService.updateAspect(id, updateDto);
  }

  @Delete('aspects/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete KPMR aspect' })
  async deleteAspect(@Param('id', ParseIntPipe) id: number) {
    return await this.kpmrService.deleteAspect(id);
  }

  // ========== QUESTION ENDPOINTS ==========
  @Post('questions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new KPMR question' })
  async createQuestion(@Body() createDto: CreateKPMRQuestionDto) {
    return await this.kpmrService.createQuestion(createDto);
  }

  @Get('questions')
  @ApiOperation({ summary: 'Get all KPMR questions' })
  async getAllQuestions() {
    return await this.kpmrService.findAllQuestions();
  }

  @Get('questions/aspect/:aspekNo')
  @ApiOperation({ summary: 'Get questions by aspect' })
  async getQuestionsByAspect(@Param('aspekNo') aspekNo: string) {
    return await this.kpmrService.findQuestionsByAspect(aspekNo);
  }

  @Get('questions/:id')
  @ApiOperation({ summary: 'Get question by ID' })
  async getQuestion(@Param('id', ParseIntPipe) id: number) {
    return await this.kpmrService.findQuestionById(id);
  }

  @Put('questions/:id')
  @ApiOperation({ summary: 'Update KPMR question' })
  async updateQuestion(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateKPMRQuestionDto,
  ) {
    return await this.kpmrService.updateQuestion(id, updateDto);
  }

  @Delete('questions/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete KPMR question' })
  async deleteQuestion(@Param('id', ParseIntPipe) id: number) {
    return await this.kpmrService.deleteQuestion(id);
  }

  // ========== DEFINITION ENDPOINTS ==========
  @Post('definitions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create or update KPMR definition' })
  async createOrUpdateDefinition(@Body() createDto: CreateKPMRDefinitionDto) {
    return await this.kpmrService.createOrUpdateDefinition(createDto);
  }

  @Get('definitions')
  @ApiOperation({ summary: 'Get all KPMR definitions' })
  async getAllDefinitions() {
    return await this.kpmrService.findAllDefinitions();
  }

  @Get('definitions/year/:year')
  @ApiOperation({ summary: 'Get definitions by year' })
  async getDefinitionsByYear(@Param('year', ParseIntPipe) year: number) {
    return await this.kpmrService.findDefinitionsByYear(year);
  }

  @Get('definitions/:id')
  @ApiOperation({ summary: 'Get definition by ID' })
  async getDefinition(@Param('id', ParseIntPipe) id: number) {
    return await this.kpmrService.findDefinitionById(id);
  }

  @Put('definitions/:id')
  @ApiOperation({ summary: 'Update definition' })
  async updateDefinition(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateKPMRDefinitionDto,
  ) {
    return await this.kpmrService.updateDefinition(id, updateDto);
  }

  @Delete('definitions/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete definition' })
  async deleteDefinition(@Param('id', ParseIntPipe) id: number) {
    return await this.kpmrService.deleteDefinition(id);
  }

  // ========== SCORE ENDPOINTS ==========
  @Post('scores')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create or update KPMR score' })
  async createOrUpdateScore(@Body() createDto: CreateKPMRScoreDto) {
    return await this.kpmrService.createOrUpdateScore(createDto);
  }

  @Get('scores')
  @ApiOperation({ summary: 'Get all scores' })
  async getAllScores() {
    return await this.kpmrService.findAllScores();
  }

  @Get('scores/period')
  @ApiOperation({ summary: 'Get scores by period' })
  @ApiQuery({ name: 'year', required: true })
  @ApiQuery({ name: 'quarter', required: false })
  async getScoresByPeriod(
    @Query('year', ParseIntPipe) year: number,
    @Query('quarter') quarter?: string,
  ) {
    return await this.kpmrService.findScoresByPeriod(year, quarter);
  }

  @Get('scores/definition/:definitionId')
  @ApiOperation({ summary: 'Get scores by definition' })
  async getScoresByDefinition(
    @Param('definitionId', ParseIntPipe) definitionId: number,
  ) {
    return await this.kpmrService.findScoresByDefinition(definitionId);
  }

  @Get('scores/:id')
  @ApiOperation({ summary: 'Get score by ID' })
  async getScore(@Param('id', ParseIntPipe) id: number) {
    return await this.kpmrService.findScoreById(id);
  }

  @Put('scores/:id')
  @ApiOperation({ summary: 'Update score' })
  async updateScore(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateKPMRScoreDto,
  ) {
    return await this.kpmrService.updateScore(id, updateDto);
  }

  @Delete('scores/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete score by ID' })
  async deleteScore(@Param('id', ParseIntPipe) id: number) {
    return await this.kpmrService.deleteScore(id);
  }

  @Delete('scores/target')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete score by definition, year, and quarter' })
  @ApiQuery({ name: 'definitionId', required: true })
  @ApiQuery({ name: 'year', required: true })
  @ApiQuery({ name: 'quarter', required: true })
  async deleteScoreByTarget(
    @Query('definitionId', ParseIntPipe) definitionId: number,
    @Query('year', ParseIntPipe) year: number,
    @Query('quarter') quarter: string,
  ) {
    return await this.kpmrService.deleteScoreByTarget(
      definitionId,
      year,
      quarter,
    );
  }

  // ========== COMPLEX QUERIES ==========
  @Get('full-data/:year')
  @ApiOperation({ summary: 'Get complete KPMR data with grouping' })
  async getFullData(@Param('year', ParseIntPipe) year: number) {
    return await this.kpmrService.getKPMRFullData(year);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search KPMR data' })
  @ApiQuery({ name: 'year', required: false })
  @ApiQuery({ name: 'query', required: false })
  @ApiQuery({ name: 'aspekNo', required: false })
  async searchKPMR(
    @Query('year', ParseIntPipe) year?: number,
    @Query('query') query?: string,
    @Query('aspekNo') aspekNo?: string,
  ) {
    return await this.kpmrService.searchKPMR(year, query, aspekNo);
  }

  @Get('years')
  @ApiOperation({ summary: 'Get available years' })
  async getAvailableYears() {
    const years = await this.kpmrService.getAvailableYears();
    return { success: true, data: years };
  }

  @Get('periods')
  @ApiOperation({ summary: 'Get available periods' })
  async getPeriods() {
    const periods = await this.kpmrService.getPeriods();
    return { success: true, data: periods };
  }
}


kpmr-investasi.dto

// src/features/Dashboard/pages/RiskProfile/pages/Investasi/dto/kpmr.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Max,
  Length,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ============================================================================
// KPMR ASPECT DTO (Master Aspek)
// ============================================================================
export class CreateKPMRAspectDto {
  @ApiProperty({ example: 'Aspek 1', description: 'Nomor aspek' })
  @IsNotEmpty({ message: 'Nomor aspek tidak boleh kosong' })
  @IsString({ message: 'Nomor aspek harus berupa string' })
  @Length(1, 50, { message: 'Nomor aspek maksimal 50 karakter' })
  aspekNo: string;

  @ApiProperty({ example: 'Tata Kelola Risiko', description: 'Judul aspek' })
  @IsNotEmpty({ message: 'Judul aspek tidak boleh kosong' })
  @IsString({ message: 'Judul aspek harus berupa string' })
  @Length(1, 255, { message: 'Judul aspek maksimal 255 karakter' })
  aspekTitle: string;

  @ApiProperty({ example: 30, description: 'Bobot aspek dalam persen' })
  @IsNotEmpty({ message: 'Bobot aspek tidak boleh kosong' })
  @IsNumber({}, { message: 'Bobot aspek harus berupa angka' })
  @Min(0, { message: 'Bobot aspek minimal 0' })
  @Max(100, { message: 'Bobot aspek maksimal 100' })
  @Type(() => Number)
  aspekBobot: number;
}

export class UpdateKPMRAspectDto {
  @ApiPropertyOptional({ example: 'Aspek 1' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  aspekNo?: string;

  @ApiPropertyOptional({ example: 'Tata Kelola Risiko' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  aspekTitle?: string;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  aspekBobot?: number;
}

// ============================================================================
// KPMR QUESTION DTO (Master Pertanyaan)
// ============================================================================
export class CreateKPMRQuestionDto {
  @ApiProperty({
    example: 'Aspek 1',
    description: 'Nomor aspek yang memiliki pertanyaan ini',
  })
  @IsNotEmpty({ message: 'Nomor aspek tidak boleh kosong' })
  @IsString({ message: 'Nomor aspek harus berupa string' })
  @Length(1, 50, { message: 'Nomor aspek maksimal 50 karakter' })
  aspekNo: string;

  @ApiProperty({ example: '1', description: 'Nomor section/pertanyaan' })
  @IsNotEmpty({ message: 'Nomor section tidak boleh kosong' })
  @IsString({ message: 'Nomor section harus berupa string' })
  @Length(1, 50, { message: 'Nomor section maksimal 50 karakter' })
  sectionNo: string;

  @ApiProperty({
    example: 'Bagaimana perumusan tingkat risiko yang akan diambil?',
    description: 'Teks pertanyaan section',
  })
  @IsNotEmpty({ message: 'Judul pertanyaan tidak boleh kosong' })
  @IsString({ message: 'Judul pertanyaan harus berupa string' })
  sectionTitle: string;
}

export class UpdateKPMRQuestionDto {
  @ApiPropertyOptional({ example: 'Aspek 1' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  aspekNo?: string;

  @ApiPropertyOptional({ example: '1' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  sectionNo?: string;

  @ApiPropertyOptional({
    example: 'Bagaimana perumusan tingkat risiko yang akan diambil?',
  })
  @IsOptional()
  @IsString()
  sectionTitle?: string;
}

// ============================================================================
// KPMR DEFINITION DTO (Year-Level: Aspek + Section + Level 1-5 + Evidence)
// ============================================================================
export class CreateKPMRDefinitionDto {
  @ApiProperty({ example: 2024, description: 'Tahun data' })
  @IsNotEmpty({ message: 'Tahun tidak boleh kosong' })
  @IsInt({ message: 'Tahun harus berupa angka bulat' })
  @Min(2000, { message: 'Tahun minimal 2000' })
  @Max(2100, { message: 'Tahun maksimal 2100' })
  @Type(() => Number)
  year: number;

  @ApiProperty({ example: 'Aspek 1', description: 'Nomor aspek' })
  @IsNotEmpty({ message: 'Nomor aspek tidak boleh kosong' })
  @IsString({ message: 'Nomor aspek harus berupa string' })
  @Length(1, 50, { message: 'Nomor aspek maksimal 50 karakter' })
  aspekNo: string;

  @ApiProperty({ example: 'Tata Kelola Risiko', description: 'Judul aspek' })
  @IsNotEmpty({ message: 'Judul aspek tidak boleh kosong' })
  @IsString({ message: 'Judul aspek harus berupa string' })
  @Length(1, 255, { message: 'Judul aspek maksimal 255 karakter' })
  aspekTitle: string;

  @ApiProperty({ example: 30, description: 'Bobot aspek dalam persen' })
  @IsNotEmpty({ message: 'Bobot aspek tidak boleh kosong' })
  @IsNumber({}, { message: 'Bobot aspek harus berupa angka' })
  @Min(0, { message: 'Bobot aspek minimal 0' })
  @Max(100, { message: 'Bobot aspek maksimal 100' })
  @Type(() => Number)
  aspekBobot: number;

  @ApiProperty({ example: '1', description: 'Nomor section/pertanyaan' })
  @IsNotEmpty({ message: 'Nomor section tidak boleh kosong' })
  @IsString({ message: 'Nomor section harus berupa string' })
  @Length(1, 50, { message: 'Nomor section maksimal 50 karakter' })
  sectionNo: string;

  @ApiProperty({
    example: 'Bagaimana perumusan tingkat risiko yang akan diambil?',
    description: 'Teks pertanyaan section',
  })
  @IsNotEmpty({ message: 'Judul section tidak boleh kosong' })
  @IsString({ message: 'Judul section harus berupa string' })
  sectionTitle: string;

  @ApiPropertyOptional({ example: 'Deskripsi untuk level 1 (Strong)' })
  @IsOptional()
  @IsString()
  level1?: string;

  @ApiPropertyOptional({ example: 'Deskripsi untuk level 2 (Satisfactory)' })
  @IsOptional()
  @IsString()
  level2?: string;

  @ApiPropertyOptional({ example: 'Deskripsi untuk level 3 (Fair)' })
  @IsOptional()
  @IsString()
  level3?: string;

  @ApiPropertyOptional({ example: 'Deskripsi untuk level 4 (Marginal)' })
  @IsOptional()
  @IsString()
  level4?: string;

  @ApiPropertyOptional({ example: 'Deskripsi untuk level 5 (Unsatisfactory)' })
  @IsOptional()
  @IsString()
  level5?: string;

  @ApiPropertyOptional({ example: 'Dokumen pendukung, kebijakan, dll' })
  @IsOptional()
  @IsString()
  evidence?: string;
}

export class UpdateKPMRDefinitionDto {
  @ApiPropertyOptional({ example: 2024 })
  @IsOptional()
  @IsInt()
  @Min(2000)
  @Max(2100)
  @Type(() => Number)
  year?: number;

  @ApiPropertyOptional({ example: 'Aspek 1' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  aspekNo?: string;

  @ApiPropertyOptional({ example: 'Tata Kelola Risiko' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  aspekTitle?: string;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  aspekBobot?: number;

  @ApiPropertyOptional({ example: '1' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  sectionNo?: string;

  @ApiPropertyOptional({
    example: 'Bagaimana perumusan tingkat risiko yang akan diambil?',
  })
  @IsOptional()
  @IsString()
  sectionTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  level1?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  level2?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  level3?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  level4?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  level5?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  evidence?: string;
}

// ============================================================================
// KPMR SCORE DTO (Quarter-Level: Skor per triwulan)
// ============================================================================
export class CreateKPMRScoreDto {
  @ApiProperty({ description: 'ID definisi' })
  @IsNotEmpty({ message: 'Definition ID tidak boleh kosong' })
  @IsInt({ message: 'Definition ID harus berupa angka' })
  @Type(() => Number)
  definitionId: number;

  @ApiProperty({ example: 2024, description: 'Tahun data' })
  @IsNotEmpty({ message: 'Tahun tidak boleh kosong' })
  @IsInt({ message: 'Tahun harus berupa angka bulat' })
  @Min(2000, { message: 'Tahun minimal 2000' })
  @Max(2100, { message: 'Tahun maksimal 2100' })
  @Type(() => Number)
  year: number;

  @ApiProperty({ example: 'Q1', description: 'Triwulan (Q1, Q2, Q3, Q4)' })
  @IsNotEmpty({ message: 'Quarter tidak boleh kosong' })
  @IsString({ message: 'Quarter harus berupa string' })
  quarter: string;

  @ApiPropertyOptional({
    example: 85,
    description: 'Skor untuk triwulan ini (0-100)',
  })
  @IsOptional()
  @IsNumber({}, { message: 'Section skor harus berupa angka' })
  @Min(0, { message: 'Skor minimal 0' })
  @Max(100, { message: 'Skor maksimal 100' })
  @Type(() => Number)
  sectionSkor?: number;
}

export class UpdateKPMRScoreDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  definitionId?: number;

  @ApiPropertyOptional({ example: 2024 })
  @IsOptional()
  @IsInt()
  @Min(2000)
  @Max(2100)
  @Type(() => Number)
  year?: number;

  @ApiPropertyOptional({ example: 'Q1' })
  @IsOptional()
  @IsString()
  quarter?: string;

  @ApiPropertyOptional({ example: 85 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  sectionSkor?: number;
}

// ============================================================================
// RESPONSE DTOs
// ============================================================================
export class KPMRScoreWithDefinitionDto {
  id: number;
  definitionId: number;
  year: number;
  quarter: string;
  sectionSkor: number | null;

  // Data dari definition
  aspekNo: string;
  aspekTitle: string;
  aspekBobot: number;
  sectionNo: string;
  sectionTitle: string;
  level1: string | null;
  level2: string | null;
  level3: string | null;
  level4: string | null;
  level5: string | null;
  evidence: string | null;
}

export class KPMRFullDataResponse {
  success: boolean;
  year: number;
  aspects: Array<{
    aspekNo: string;
    aspekTitle: string;
    aspekBobot: number;
    sections: Array<{
      definitionId: number;
      sectionNo: string;
      sectionTitle: string;
      level1: string | null;
      level2: string | null;
      level3: string | null;
      level4: string | null;
      level5: string | null;
      evidence: string | null;
      scores: Record<
        string,
        {
          sectionSkor: number | null;
          id: number;
        }
      >;
    }>;
    quarterAverages: Record<string, number | null>;
  }>;
  overallAverages: Record<string, number | null>;
}

export class PeriodResponse {
  year: number;
  quarter: string;
}

export class YearsResponse {
  success: boolean;
  data: number[];
}

export class PeriodsResponse {
  success: boolean;
  data: PeriodResponse[];
}

export class DeleteResponse {
  success: boolean;
  message: string;
}


entity

aspek

// src/features/Dashboard/pages/RiskProfile/pages/Investasi/entities/kpmr-aspect.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('kpmr_investasi_aspek_holding')
export class KPMRAspect {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, name: 'aspek_no' })
  aspekNo: string;

  @Column({ type: 'varchar', length: 255, name: 'aspek_title' })
  aspekTitle: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'aspek_bobot' })
  aspekBobot: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;
}


definisi

// src/features/Dashboard/pages/RiskProfile/pages/Investasi/entities/kpmr-definition.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { KPMRScore } from './kpmr-investasi-skor.entity';

@Entity('kpmr_investasi_definisi_holding')
@Index('IDX_KPMR_DEF_YEAR_ASPECT', ['year', 'aspekNo', 'sectionNo'], {
  unique: true,
})
export class KPMRDefinition {
  @PrimaryGeneratedColumn()
  id: number;

  // ========== PERIODE (Year-Level) ==========
  @Column({ type: 'int' })
  year: number;

  // ========== ASPEK (Group) ==========
  @Column({ type: 'varchar', length: 50, name: 'aspek_no' })
  aspekNo: string;

  @Column({ type: 'varchar', length: 255, name: 'aspek_title' })
  aspekTitle: string;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    name: 'aspek_bobot',
    default: 0,
  })
  aspekBobot: number;

  // ========== SECTION ==========
  @Column({ type: 'varchar', length: 50, name: 'section_no' })
  sectionNo: string;

  @Column({ type: 'text', name: 'section_title' })
  sectionTitle: string;

  // ========== LEVEL DESCRIPTIONS (1-5) ==========
  @Column({ type: 'text', nullable: true, name: 'level_1' })
  level1: string | null;

  @Column({ type: 'text', nullable: true, name: 'level_2' })
  level2: string | null;

  @Column({ type: 'text', nullable: true, name: 'level_3' })
  level3: string | null;

  @Column({ type: 'text', nullable: true, name: 'level_4' })
  level4: string | null;

  @Column({ type: 'text', nullable: true, name: 'level_5' })
  level5: string | null;

  // ========== EVIDENCE ==========
  @Column({ type: 'text', nullable: true })
  evidence: string | null;

  // ========== AUDIT TRAIL ==========
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'created_by', type: 'varchar', length: 100, nullable: true })
  createdBy: string | null;

  @Column({ name: 'updated_by', type: 'varchar', length: 100, nullable: true })
  updatedBy: string | null;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @Column({ name: 'deleted_by', type: 'varchar', length: 100, nullable: true })
  deletedBy: string | null;

  // Relasi ke scores
  @OneToMany(() => KPMRScore, (score) => score.definition)
  scores: KPMRScore[];
}

pertanyaan

// src/features/Dashboard/pages/RiskProfile/pages/Investasi/entities/kpmr-question.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('kpmr_investasi_pertanyaan_holding')
@Index('IDX_KPMR_QUESTION_ASPECT', ['aspekNo'])
export class KPMRQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, name: 'aspek_no' })
  aspekNo: string;

  @Column({ type: 'varchar', length: 50, name: 'section_no' })
  sectionNo: string;

  @Column({ type: 'text', name: 'section_title' })
  sectionTitle: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;
}

skor

// src/features/Dashboard/pages/RiskProfile/pages/Investasi/entities/kpmr-score.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { KPMRDefinition } from './kpmr-investasi-definisi.entity';

@Entity('kpmr_investasi_skor_holding')
@Index('IDX_KPMR_SCORE_DEF_QUARTER', ['definitionId', 'year', 'quarter'], {
  unique: true,
})
export class KPMRScore {
  @PrimaryGeneratedColumn()
  id: number;

  // ========== RELASI KE DEFINITION ==========
  @Column({ name: 'definition_id' })
  definitionId: number;

  @ManyToOne(() => KPMRDefinition, (definition) => definition.scores, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'definition_id' })
  definition: KPMRDefinition;

  // ========== PERIODE (denormalized) ==========
  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'varchar', length: 10 })
  quarter: string; // Q1, Q2, Q3, Q4

  // ========== QUARTER-LEVEL SCORE ==========
  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    name: 'section_skor',
  })
  sectionSkor: number | null;

  // ========== AUDIT TRAIL ==========
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'created_by', type: 'varchar', length: 100, nullable: true })
  createdBy: string | null;

  @Column({ name: 'updated_by', type: 'varchar', length: 100, nullable: true })
  updatedBy: string | null;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;
}