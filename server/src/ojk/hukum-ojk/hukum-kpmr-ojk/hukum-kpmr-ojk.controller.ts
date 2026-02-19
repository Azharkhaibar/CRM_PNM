import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HukumKpmrOjkService } from './hukum-kpmr-ojk.service';
import { CreateHukumKpmrOjkDto } from './dto/create-hukum-kpmr-ojk.dto';
import { UpdateHukumKpmrOjkDto } from './dto/update-hukum-kpmr-ojk.dto';

@Controller('hukum-kpmr-ojk')
export class HukumKpmrOjkController {
  constructor(private readonly hukumKpmrOjkService: HukumKpmrOjkService) {}

  @Post()
  create(@Body() createHukumKpmrOjkDto: CreateHukumKpmrOjkDto) {
    return this.hukumKpmrOjkService.create(createHukumKpmrOjkDto);
  }

  @Get()
  findAll() {
    return this.hukumKpmrOjkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hukumKpmrOjkService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHukumKpmrOjkDto: UpdateHukumKpmrOjkDto) {
    return this.hukumKpmrOjkService.update(+id, updateHukumKpmrOjkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hukumKpmrOjkService.remove(+id);
  }
}
