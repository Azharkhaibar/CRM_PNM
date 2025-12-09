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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { InvestasiService } from './new-investasi.service';
import { CreateInvestasiDto } from './dto/create-new-investasi.dto';

import { UpdateInvestasiDto } from './dto/update-new-investasi.dto';
import { CreateSectionDto } from './dto/create-investasi-section.dto';
import { UpdateInvestasiSectionDto } from './dto/update-new-investasi.dto';
import { Quarter } from './entities/new-investasi.entity';

@Controller('investasi')
export class NewInvestasiController {
  constructor(private readonly investasiService: InvestasiService) {}

  // ===================== SECTION ENDPOINTS =====================
  @Get('sections')
  async getSections() {
    return await this.investasiService.findAllSections();
  }

  @Get('sections/:id')
  async getSection(@Param('id') id: string) {
    return await this.investasiService.findSectionById(parseInt(id));
  }

  @Post('sections')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createSection(@Body() data: CreateSectionDto) {
    return await this.investasiService.createSection(data);
  }

  @Put('sections/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateSection(
    @Param('id') id: string,
    @Body() data: UpdateInvestasiSectionDto,
  ) {
    return await this.investasiService.updateSection(parseInt(id), data);
  }

  @Delete('sections/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSection(@Param('id') id: string) {
    await this.investasiService.deleteSection(parseInt(id));
  }

  // ===================== INVESTASI ENDPOINTS =====================
  @Get()
  async getInvestasiByPeriod(
    @Query('year') year: string,
    @Query('quarter') quarter: Quarter,
  ) {
    return await this.investasiService.findByPeriod(parseInt(year), quarter);
  }

  @Get('summary')
  async getSummary(
    @Query('year') year: string,
    @Query('quarter') quarter: Quarter,
  ) {
    return await this.investasiService.getSummary(parseInt(year), quarter);
  }

  @Get(':id')
  async getInvestasi(@Param('id') id: string) {
    return await this.investasiService.findById(parseInt(id));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createInvestasi(@Body() data: CreateInvestasiDto) {
    return await this.investasiService.create(data);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateInvestasi(
    @Param('id') id: string,
    @Body() data: UpdateInvestasiDto,
  ) {
    return await this.investasiService.update(parseInt(id), data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteInvestasi(@Param('id') id: string) {
    await this.investasiService.delete(parseInt(id));
  }
}
