import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StrategisKpmrOjkService } from './strategis-kpmr-ojk.service';
import { CreateStrategisKpmrOjkDto } from './dto/create-strategis-kpmr-ojk.dto';
import { UpdateStrategisKpmrOjkDto } from './dto/update-strategis-kpmr-ojk.dto';

@Controller('strategis-kpmr-ojk')
export class StrategisKpmrOjkController {
  constructor(private readonly strategisKpmrOjkService: StrategisKpmrOjkService) {}

  @Post()
  create(@Body() createStrategisKpmrOjkDto: CreateStrategisKpmrOjkDto) {
    return this.strategisKpmrOjkService.create(createStrategisKpmrOjkDto);
  }

  @Get()
  findAll() {
    return this.strategisKpmrOjkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.strategisKpmrOjkService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStrategisKpmrOjkDto: UpdateStrategisKpmrOjkDto) {
    return this.strategisKpmrOjkService.update(+id, updateStrategisKpmrOjkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.strategisKpmrOjkService.remove(+id);
  }
}
