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
import { KpmrInvestasiService } from './kpmr-investasi.service';
import { CreateKpmrInvestasiDto } from './dto/create-kpmr-investasi.dto';
import { UpdateKpmrInvestasiDto } from './dto/update-kpmr-investasi.dto';
@Controller('kpmr-investasi')
export class KpmrInvestasiController {
  constructor(private readonly kpmrInvestasiService: KpmrInvestasiService) {}

  @Post()
  create(@Body() createKpmrInvestasiDto: CreateKpmrInvestasiDto) {
    return this.kpmrInvestasiService.create(createKpmrInvestasiDto);
  }

  @Get()
  findAll(
    @Query('year') year?: string,
    @Query('quarter') quarter?: string,
    @Query('aspek_no') aspek_no?: string,
    @Query('query') query?: string,
  ) {
    // Jika ada parameter query, gunakan filter
    if (year || quarter || aspek_no || query) {
      return this.kpmrInvestasiService.findByFilters({
        year: year ? parseInt(year) : undefined,
        quarter,
        aspek_no,
        query,
      });
    }

    // Jika tidak ada parameter, return semua data
    return this.kpmrInvestasiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.kpmrInvestasiService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateKpmrInvestasiDto: UpdateKpmrInvestasiDto,
  ) {
    return this.kpmrInvestasiService.update(id, updateKpmrInvestasiDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.kpmrInvestasiService.remove(id);
  }

  // Endpoint khusus untuk period
  @Get('period/:year/:quarter')
  findByPeriod(
    @Param('year', ParseIntPipe) year: number,
    @Param('quarter') quarter: string,
  ) {
    return this.kpmrInvestasiService.findByPeriod(year, quarter);
  }
}
