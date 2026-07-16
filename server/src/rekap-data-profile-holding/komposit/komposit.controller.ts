import { Controller, Get, Query } from '@nestjs/common';
import { KompositService } from './komposit.service';

@Controller('komposit')
export class KompositController {
  constructor(private readonly kompositService: KompositService) {}

  @Get('summary')
  async getKompositSummary(
    @Query('year') year: string,
    @Query('quarter') quarter: string,
  ) {
    return this.kompositService.getKompositSummary(+year, quarter);
  }
}

