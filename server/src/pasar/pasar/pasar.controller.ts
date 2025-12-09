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
import { PasarService } from './pasar.service';
import { CreateSectionDto } from './dto/create-pasar-section.dto';
import { CreateIndikatorDto } from './dto/create-pasar-indikator.dto';
import { UpdatePasarSectionDto } from './dto/update-pasar-section.dto';
import { UpdateIndikatorDto } from './dto/update-pasar.dto';

@Controller('pasar')
export class PasarController {
  constructor(private readonly pasarService: PasarService) {}

  // ==================== SECTION ENDPOINTS ====================

  @Post('sections')
  createSection(@Body() createSectionDto: CreateSectionDto) {
    return this.pasarService.createSection(createSectionDto);
  }

  @Get('sections')
  findAllSections() {
    return this.pasarService.getSections();
  }

  @Get('sections/period')
  getSectionsByPeriod(
    @Query('tahun') tahun: string,
    @Query('triwulan') triwulan: string,
  ) {
    return this.pasarService.getSectionsByPeriod(parseInt(tahun), triwulan);
  }

  @Get('sections/:id')
  getSectionById(@Param('id', ParseIntPipe) id: number) {
    return this.pasarService.getSectionById(id);
  }

  @Patch('sections/:id')
  updateSection(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSectionDto: UpdatePasarSectionDto,
  ) {
    return this.pasarService.updateSection(id, updateSectionDto);
  }

  @Delete('sections/:id')
  async removeSection(@Param('id', ParseIntPipe) id: number) {
    await this.pasarService.deleteSection(id);
    return { message: `Section ${id} berhasil dihapus` };
  }

  // ==================== INDIKATOR ENDPOINTS ====================

  @Post('indikators')
  createIndikator(@Body() createIndikatorDto: CreateIndikatorDto) {
    return this.pasarService.createIndikator(createIndikatorDto);
  }

  @Get('indikators')
  getIndikators(@Query('sectionId') sectionId?: string) {
    if (sectionId) {
      return this.pasarService.getIndikatorsBySection(parseInt(sectionId));
    }
    return this.pasarService.getAllIndikators();
  }

  @Get('indikators/:id')
  getIndikatorById(@Param('id', ParseIntPipe) id: number) {
    return this.pasarService.getIndikatorById(id);
  }

  @Patch('indikators/:id')
  updateIndikator(
    // HANYA SATU METHOD INI, HAPUS YANG LAIN
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIndikatorDto: UpdateIndikatorDto,
  ) {
    return this.pasarService.updateIndikator(id, updateIndikatorDto);
  }

  @Delete('indikators/:id')
  async removeIndikator(@Param('id', ParseIntPipe) id: number) {
    await this.pasarService.deleteIndikator(id);
    return { message: `Indikator ${id} berhasil dihapus` };
  }

  // ==================== DASHBOARD ENDPOINTS ====================

  @Get('dashboard/summary')
  getOverallSummary(
    @Query('tahun') tahun: string,
    @Query('triwulan') triwulan: string,
  ) {
    return this.pasarService.getOverallSummary(parseInt(tahun), triwulan);
  }
}
