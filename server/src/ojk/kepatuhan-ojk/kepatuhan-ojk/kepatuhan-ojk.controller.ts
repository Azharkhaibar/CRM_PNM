import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KepatuhanOjkService } from './kepatuhan-ojk.service';
import { CreateKepatuhanOjkDto } from './dto/create-kepatuhan-ojk.dto';
import { UpdateKepatuhanOjkDto } from './dto/update-kepatuhan-ojk.dto';

@Controller('kepatuhan-ojk')
export class KepatuhanOjkController {
  constructor(private readonly kepatuhanOjkService: KepatuhanOjkService) {}

  @Post()
  create(@Body() createKepatuhanOjkDto: CreateKepatuhanOjkDto) {
    return this.kepatuhanOjkService.create(createKepatuhanOjkDto);
  }

  @Get()
  findAll() {
    return this.kepatuhanOjkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kepatuhanOjkService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKepatuhanOjkDto: UpdateKepatuhanOjkDto) {
    return this.kepatuhanOjkService.update(+id, updateKepatuhanOjkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kepatuhanOjkService.remove(+id);
  }
}
