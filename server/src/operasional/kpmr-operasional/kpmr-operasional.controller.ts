import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KpmrOperasionalService } from './kpmr-operasional.service';
import { CreateKpmrOperasionalDto } from './dto/create-kpmr-operasional.dto';
import { UpdateKpmrOperasionalDto } from './dto/update-kpmr-operasional.dto';

@Controller('kpmr-operasional')
export class KpmrOperasionalController {
  constructor(private readonly kpmrOperasionalService: KpmrOperasionalService) {}

  @Post()
  create(@Body() createKpmrOperasionalDto: CreateKpmrOperasionalDto) {
    return this.kpmrOperasionalService.create(createKpmrOperasionalDto);
  }

  @Get()
  findAll() {
    return this.kpmrOperasionalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kpmrOperasionalService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKpmrOperasionalDto: UpdateKpmrOperasionalDto) {
    return this.kpmrOperasionalService.update(+id, updateKpmrOperasionalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kpmrOperasionalService.remove(+id);
  }
}
