import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReputasiKpmrOjkService } from './reputasi-kpmr-ojk.service';
import { CreateReputasiKpmrOjkDto } from './dto/create-reputasi-kpmr-ojk.dto';
import { UpdateReputasiKpmrOjkDto } from './dto/update-reputasi-kpmr-ojk.dto';

@Controller('reputasi-kpmr-ojk')
export class ReputasiKpmrOjkController {
  constructor(private readonly reputasiKpmrOjkService: ReputasiKpmrOjkService) {}

  @Post()
  create(@Body() createReputasiKpmrOjkDto: CreateReputasiKpmrOjkDto) {
    return this.reputasiKpmrOjkService.create(createReputasiKpmrOjkDto);
  }

  @Get()
  findAll() {
    return this.reputasiKpmrOjkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reputasiKpmrOjkService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReputasiKpmrOjkDto: UpdateReputasiKpmrOjkDto) {
    return this.reputasiKpmrOjkService.update(+id, updateReputasiKpmrOjkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reputasiKpmrOjkService.remove(+id);
  }
}
