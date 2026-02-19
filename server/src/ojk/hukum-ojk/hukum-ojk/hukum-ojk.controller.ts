import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HukumOjkService } from './hukum-ojk.service';
import { CreateHukumOjkDto } from './dto/create-hukum-ojk.dto';
import { UpdateHukumOjkDto } from './dto/update-hukum-ojk.dto';

@Controller('hukum-ojk')
export class HukumOjkController {
  constructor(private readonly hukumOjkService: HukumOjkService) {}

  @Post()
  create(@Body() createHukumOjkDto: CreateHukumOjkDto) {
    return this.hukumOjkService.create(createHukumOjkDto);
  }

  @Get()
  findAll() {
    return this.hukumOjkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hukumOjkService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHukumOjkDto: UpdateHukumOjkDto) {
    return this.hukumOjkService.update(+id, updateHukumOjkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hukumOjkService.remove(+id);
  }
}
