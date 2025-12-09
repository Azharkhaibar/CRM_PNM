import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KpmrKepatuhanService } from './kpmr-kepatuhan.service';
import { CreateKpmrKepatuhanDto } from './dto/create-kpmr-kepatuhan.dto';
import { UpdateKpmrKepatuhanDto } from './dto/update-kpmr-kepatuhan.dto';

@Controller('kpmr-kepatuhan')
export class KpmrKepatuhanController {
  constructor(private readonly kpmrKepatuhanService: KpmrKepatuhanService) {}

  @Post()
  create(@Body() createKpmrKepatuhanDto: CreateKpmrKepatuhanDto) {
    return this.kpmrKepatuhanService.create(createKpmrKepatuhanDto);
  }

  @Get()
  findAll() {
    return this.kpmrKepatuhanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kpmrKepatuhanService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKpmrKepatuhanDto: UpdateKpmrKepatuhanDto) {
    return this.kpmrKepatuhanService.update(+id, updateKpmrKepatuhanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kpmrKepatuhanService.remove(+id);
  }
}
