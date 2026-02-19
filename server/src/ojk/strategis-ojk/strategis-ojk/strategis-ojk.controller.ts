import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StrategisOjkService } from './strategis-ojk.service';
import { CreateStrategisOjkDto } from './dto/create-strategis-ojk.dto';
import { UpdateStrategisOjkDto } from './dto/update-strategis-ojk.dto';

@Controller('strategis-ojk')
export class StrategisOjkController {
  constructor(private readonly strategisOjkService: StrategisOjkService) {}

  @Post()
  create(@Body() createStrategisOjkDto: CreateStrategisOjkDto) {
    return this.strategisOjkService.create(createStrategisOjkDto);
  }

  @Get()
  findAll() {
    return this.strategisOjkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.strategisOjkService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStrategisOjkDto: UpdateStrategisOjkDto) {
    return this.strategisOjkService.update(+id, updateStrategisOjkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.strategisOjkService.remove(+id);
  }
}
