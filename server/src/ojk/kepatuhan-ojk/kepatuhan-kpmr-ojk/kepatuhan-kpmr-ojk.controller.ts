import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KepatuhanKpmrOjkService } from './kepatuhan-kpmr-ojk.service';
import { CreateKepatuhanKpmrOjkDto } from './dto/create-kepatuhan-kpmr-ojk.dto';
import { UpdateKepatuhanKpmrOjkDto } from './dto/update-kepatuhan-kpmr-ojk.dto';

@Controller('kepatuhan-kpmr-ojk')
export class KepatuhanKpmrOjkController {
  constructor(private readonly kepatuhanKpmrOjkService: KepatuhanKpmrOjkService) {}

  @Post()
  create(@Body() createKepatuhanKpmrOjkDto: CreateKepatuhanKpmrOjkDto) {
    return this.kepatuhanKpmrOjkService.create(createKepatuhanKpmrOjkDto);
  }

  @Get()
  findAll() {
    return this.kepatuhanKpmrOjkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kepatuhanKpmrOjkService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKepatuhanKpmrOjkDto: UpdateKepatuhanKpmrOjkDto) {
    return this.kepatuhanKpmrOjkService.update(+id, updateKepatuhanKpmrOjkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kepatuhanKpmrOjkService.remove(+id);
  }
}
