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
  Logger,
} from '@nestjs/common';
import { KpmrInvestasiService } from './kpmr-investasi.service';
import { CreateKpmrInvestasiDto } from './dto/create-kpmr-investasi.dto';
import { UpdateKpmrInvestasiDto } from './dto/update-kpmr-investasi.dto';

@Controller('kpmr-investasi')
export class KpmrInvestasiController {
  private readonly logger = new Logger(KpmrInvestasiController.name);
  constructor(private readonly service: KpmrInvestasiService) {}

  @Post()
  create(@Body() dto: CreateKpmrInvestasiDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query('year') year?: string,
    @Query('quarter') quarter?: string,
    @Query('aspekNo') aspekNo?: string,
    @Query('query') query?: string,
  ) {
    if (year || quarter || aspekNo || query) {
      return this.service.findByFilters({
        year: year ? parseInt(year) : undefined,
        quarter,
        aspekNo,
        query,
      });
    }
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateKpmrInvestasiDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Get('period/:year/:quarter')
  findByPeriod(
    @Param('year', ParseIntPipe) year: number,
    @Param('quarter') quarter: string,
  ) {
    return this.service.findByPeriod(year, quarter);
  }
}
