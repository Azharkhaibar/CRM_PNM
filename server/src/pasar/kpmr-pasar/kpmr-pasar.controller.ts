// src/features/Dashboard/pages/RiskProfile/pages/Pasar/controllers/kpmr-pasar.controller.ts
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
import { KPMRPasarService } from './kpmr-pasar.service';
import {
  CreateKPMRPasarAspectDto,
  UpdateKPMRPasarAspectDto,
  CreateKPMRPasarQuestionDto,
  UpdateKPMRPasarQuestionDto,
  CreateKPMRPasarDefinitionDto,
  UpdateKPMRPasarDefinitionDto,
  CreateKPMRPasarScoreDto,
  UpdateKPMRPasarScoreDto,
} from './dto/kpmr-pasar.dto';

@ApiTags('KPMR Pasar')
@Controller('kpmr-pasar')
export class KPMRPasarController {
  constructor(private readonly kpmrPasarService: KPMRPasarService) {}

  // ========== ASPECT ENDPOINTS ==========
  @Post('aspects')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new KPMR Pasar aspect' })
  async createAspect(@Body() createDto: CreateKPMRPasarAspectDto) {
    return await this.kpmrPasarService.createAspect(createDto);
  }

  @Get('aspects')
  @ApiOperation({ summary: 'Get all KPMR Pasar aspects' })
  @ApiQuery({ name: 'year', required: false })
  async getAllAspects(@Query('year') year?: string) {
    const yearNum = year ? parseInt(year, 10) : undefined;
    return await this.kpmrPasarService.findAllAspects(yearNum);
  }

  @Get('aspects/:id')
  @ApiOperation({ summary: 'Get KPMR Pasar aspect by ID' })
  async getAspect(@Param('id', ParseIntPipe) id: number) {
    return await this.kpmrPasarService.findAspectById(id);
  }

  @Put('aspects/:id')
  @ApiOperation({ summary: 'Update KPMR Pasar aspect' })
  async updateAspect(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateKPMRPasarAspectDto,
  ) {
    return await this.kpmrPasarService.updateAspect(id, updateDto);
  }

  @Delete('aspects/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Permanently delete KPMR Pasar aspect' })
  async deleteAspect(@Param('id', ParseIntPipe) id: number) {
    return await this.kpmrPasarService.deleteAspect(id);
  }

  // ========== QUESTION ENDPOINTS ==========
  @Post('questions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new KPMR Pasar question' })
  async createQuestion(@Body() createDto: CreateKPMRPasarQuestionDto) {
    return await this.kpmrPasarService.createQuestion(createDto);
  }

  @Get('questions')
  @ApiOperation({ summary: 'Get all KPMR Pasar questions' })
  @ApiQuery({ name: 'year', required: false })
  async getAllQuestions(@Query('year') year?: string) {
    const yearNum = year ? parseInt(year, 10) : undefined;
    return await this.kpmrPasarService.findAllQuestions(yearNum);
  }

  @Get('questions/aspect/:aspekNo')
  @ApiOperation({ summary: 'Get questions by aspect' })
  @ApiQuery({ name: 'year', required: false })
  async getQuestionsByAspect(
    @Param('aspekNo') aspekNo: string,
    @Query('year') year?: string,
  ) {
    const yearNum = year ? parseInt(year, 10) : undefined;
    return await this.kpmrPasarService.findQuestionsByAspect(aspekNo, yearNum);
  }

  @Get('questions/:id')
  @ApiOperation({ summary: 'Get question by ID' })
  async getQuestion(@Param('id', ParseIntPipe) id: number) {
    return await this.kpmrPasarService.findQuestionById(id);
  }

  @Put('questions/:id')
  @ApiOperation({ summary: 'Update KPMR Pasar question' })
  async updateQuestion(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateKPMRPasarQuestionDto,
  ) {
    return await this.kpmrPasarService.updateQuestion(id, updateDto);
  }

  @Delete('questions/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Permanently delete KPMR Pasar question' })
  async deleteQuestion(@Param('id', ParseIntPipe) id: number) {
    return await this.kpmrPasarService.deleteQuestion(id);
  }

  // ========== DEFINITION ENDPOINTS ==========
  @Post('definitions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create or update KPMR Pasar definition' })
  async createOrUpdateDefinition(
    @Body() createDto: CreateKPMRPasarDefinitionDto,
  ) {
    return await this.kpmrPasarService.createOrUpdateDefinition(createDto);
  }

  @Get('definitions')
  @ApiOperation({ summary: 'Get all KPMR Pasar definitions' })
  async getAllDefinitions() {
    return await this.kpmrPasarService.findAllDefinitions();
  }

  @Get('definitions/year/:year')
  @ApiOperation({ summary: 'Get definitions by year' })
  async getDefinitionsByYear(@Param('year') year: string) {
    return await this.kpmrPasarService.findDefinitionsByYear(
      parseInt(year, 10),
    );
  }

  @Get('definitions/:id')
  @ApiOperation({ summary: 'Get definition by ID' })
  async getDefinition(@Param('id', ParseIntPipe) id: number) {
    return await this.kpmrPasarService.findDefinitionById(id);
  }

  @Put('definitions/:id')
  @ApiOperation({ summary: 'Update definition' })
  async updateDefinition(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateKPMRPasarDefinitionDto,
  ) {
    return await this.kpmrPasarService.updateDefinition(id, updateDto);
  }

  @Delete('definition/:definitionId/:year')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Permanently delete definition with scores' })
  async deleteDefinitionPermanent(
    @Param('definitionId', ParseIntPipe) definitionId: number,
    @Param('year', ParseIntPipe) year: number,
  ) {
    console.log('🗑️ DELETE DEFINITION REQUEST:', { definitionId, year });
    const result = await this.kpmrPasarService.deleteDefinition(
      definitionId,
      year,
    );
    return result;
  }

  // ========== SCORE ENDPOINTS ==========
  @Post('scores')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create or update KPMR Pasar score' })
  async createOrUpdateScore(@Body() createDto: CreateKPMRPasarScoreDto) {
    return await this.kpmrPasarService.createOrUpdateScore(createDto);
  }

  @Get('scores')
  @ApiOperation({ summary: 'Get all scores' })
  async getAllScores() {
    return await this.kpmrPasarService.findAllScores();
  }

  @Get('scores/period')
  @ApiOperation({ summary: 'Get scores by period' })
  @ApiQuery({ name: 'year', required: true })
  @ApiQuery({ name: 'quarter', required: false })
  async getScoresByPeriod(
    @Query('year') year: string,
    @Query('quarter') quarter?: string,
  ) {
    return await this.kpmrPasarService.findScoresByPeriod(
      parseInt(year, 10),
      quarter,
    );
  }

  @Get('scores/definition/:definitionId')
  @ApiOperation({ summary: 'Get scores by definition' })
  async getScoresByDefinition(
    @Param('definitionId', ParseIntPipe) definitionId: number,
  ) {
    return await this.kpmrPasarService.findScoresByDefinition(definitionId);
  }

  @Get('scores/:id')
  @ApiOperation({ summary: 'Get score by ID' })
  async getScore(@Param('id', ParseIntPipe) id: number) {
    return await this.kpmrPasarService.findScoreById(id);
  }

  @Put('scores/:id')
  @ApiOperation({ summary: 'Update score' })
  async updateScore(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateKPMRPasarScoreDto,
  ) {
    return await this.kpmrPasarService.updateScore(id, updateDto);
  }

  @Delete('scores/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Permanently delete score' })
  async deleteScore(@Param('id', ParseIntPipe) id: number) {
    return await this.kpmrPasarService.deleteScore(id);
  }

  @Post('scores/target/delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Permanently delete score by target' })
  async deleteScoreByTarget(
    @Body() body: { definitionId: number; year: number; quarter: string },
  ) {
    return await this.kpmrPasarService.deleteScoreByTarget(
      body.definitionId,
      body.year,
      body.quarter,
    );
  }

  // ========== COMPLEX QUERIES ==========
  @Get('full-data/:year')
  @ApiOperation({ summary: 'Get complete KPMR Pasar data with grouping' })
  async getFullData(@Param('year') year: string) {
    return await this.kpmrPasarService.getKPMRFullData(parseInt(year, 10));
  }

  @Get('search')
  @ApiOperation({ summary: 'Search KPMR Pasar data' })
  @ApiQuery({ name: 'year', required: false })
  @ApiQuery({ name: 'query', required: false })
  @ApiQuery({ name: 'aspekNo', required: false })
  async searchKPMR(
    @Query('year') year?: string,
    @Query('query') query?: string,
    @Query('aspekNo') aspekNo?: string,
  ) {
    const yearNum = year ? parseInt(year, 10) : undefined;
    return await this.kpmrPasarService.searchKPMR(yearNum, query, aspekNo);
  }

  @Get('years')
  @ApiOperation({ summary: 'Get available years' })
  async getAvailableYears() {
    const years = await this.kpmrPasarService.getAvailableYears();
    return { success: true, data: years };
  }

  @Get('periods')
  @ApiOperation({ summary: 'Get available periods' })
  async getPeriods() {
    const periods = await this.kpmrPasarService.getPeriods();
    return { success: true, data: periods };
  }
}
