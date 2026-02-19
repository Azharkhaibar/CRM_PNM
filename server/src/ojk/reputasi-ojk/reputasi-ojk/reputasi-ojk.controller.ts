import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReputasiOjkService } from './reputasi-ojk.service';
import { CreateReputasiOjkDto } from './dto/create-reputasi-ojk.dto';
import { UpdateReputasiOjkDto } from './dto/update-reputasi-ojk.dto';

@Controller('reputasi-ojk')
export class ReputasiOjkController {
  constructor(private readonly reputasiOjkService: ReputasiOjkService) {}

  @Post()
  create(@Body() createReputasiOjkDto: CreateReputasiOjkDto) {
    return this.reputasiOjkService.create(createReputasiOjkDto);
  }

  @Get()
  findAll() {
    return this.reputasiOjkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reputasiOjkService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReputasiOjkDto: UpdateReputasiOjkDto) {
    return this.reputasiOjkService.update(+id, updateReputasiOjkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reputasiOjkService.remove(+id);
  }
}
