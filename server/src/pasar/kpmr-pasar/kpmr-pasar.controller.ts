// src/kpmr-pasar/kpmr-pasar.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import {
  KpmrPasarService,
  GroupedAspek,
  PeriodResult,
} from './kpmr-pasar.service';
import { CreateKpmrPasarDto } from './dto/create-kpmr-pasar.dto';
import { UpdateKpmrPasarDto } from './dto/update-kpmr-pasar.dto';
import { KpmrPasarResponseDto } from './dto/response-kpmr-pasar.dto';
import { KpmrPasar } from './entities/kpmr-pasar.entity';

@Controller('kpmr-pasar')
export class KpmrPasarController {
  private readonly logger = new Logger(KpmrPasarController.name);
  constructor(private readonly kpmrPasarService: KpmrPasarService) {}

  @Post()
  async create(
    @Body() createKpmrPasarDto: CreateKpmrPasarDto,
  ): Promise<KpmrPasarResponseDto<KpmrPasar>> {
    this.logger.log('Creating KPMR Pasar:', createKpmrPasarDto);
    const data = await this.kpmrPasarService.create(createKpmrPasarDto);
    return KpmrPasarResponseDto.success(
      data,
      'Data KPMR Pasar berhasil dibuat',
    );
  }

  @Get()
  async findAllByPeriod(
    @Query('year', ParseIntPipe) year: number,
    @Query('quarter') quarter: string,
  ): Promise<KpmrPasarResponseDto<GroupedAspek[]>> {
    this.logger.log(`Fetching data for period: ${year} ${quarter}`);

    if (!['Q1', 'Q2', 'Q3', 'Q4'].includes(quarter)) {
      throw new BadRequestException('Quarter harus Q1, Q2, Q3, atau Q4');
    }

    const data = await this.kpmrPasarService.findGroupedByAspek(year, quarter);
    return KpmrPasarResponseDto.success(data);
  }

  // Tambahkan endpoint GET all untuk kompatibilitas
  @Get('all')
  async findAll(): Promise<KpmrPasarResponseDto<KpmrPasar[]>> {
    const data = await this.kpmrPasarService.findAllByPeriod(
      new Date().getFullYear(),
      'Q1',
    );
    return KpmrPasarResponseDto.success(data);
  }

  @Get('periods')
  async getPeriods(): Promise<KpmrPasarResponseDto<PeriodResult[]>> {
    const data = await this.kpmrPasarService.getPeriods();
    return KpmrPasarResponseDto.success(data);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<KpmrPasarResponseDto<KpmrPasar>> {
    const data = await this.kpmrPasarService.findOne(id);
    return KpmrPasarResponseDto.success(data);
  }

  @Get('average/total')
  async getTotalAverage(
    @Query('year', ParseIntPipe) year: number,
    @Query('quarter') quarter: string,
  ): Promise<KpmrPasarResponseDto<{ average: number }>> {
    if (!['Q1', 'Q2', 'Q3', 'Q4'].includes(quarter)) {
      throw new BadRequestException('Quarter harus Q1, Q2, Q3, atau Q4');
    }

    const average = await this.kpmrPasarService.getTotalAverage(year, quarter);
    return KpmrPasarResponseDto.success({ average });
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateKpmrPasarDto: UpdateKpmrPasarDto,
  ): Promise<KpmrPasarResponseDto<KpmrPasar>> {
    this.logger.log(`Updating KPMR Pasar ${id}:`, updateKpmrPasarDto);
    const data = await this.kpmrPasarService.update(id, updateKpmrPasarDto);
    return KpmrPasarResponseDto.success(
      data,
      'Data KPMR Pasar berhasil diupdate',
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    this.logger.log(`Deleting KPMR Pasar: ${id}`);
    await this.kpmrPasarService.remove(id);
  }

  // Tambahkan endpoint search untuk kompatibilitas
  @Get('search/criteria')
  async searchByCriteria(
    @Query('year') year?: string,
    @Query('quarter') quarter?: string,
    @Query('aspekNo') aspekNo?: string,
    @Query('sectionNo') sectionNo?: string,
  ): Promise<KpmrPasarResponseDto<KpmrPasar[]>> {
    const data = await this.kpmrPasarService.findByCriteria({
      year: year ? parseInt(year) : undefined,
      quarter,
      aspekNo,
      sectionNo,
    });
    return KpmrPasarResponseDto.success(data);
  }
}
