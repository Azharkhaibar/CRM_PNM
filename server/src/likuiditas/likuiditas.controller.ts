import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LikuiditasService } from './likuiditas.service';
import { CreateLikuiditasDto } from './dto/create-likuidita.dto';
import { UpdateLikuiditasDto } from './dto/update-likuidita.dto';

@Controller('likuiditas')
export class LikuiditasController {
  constructor(private readonly likuiditasService: LikuiditasService) {}

  @Post()
  create(@Body() createLikuiditaDto: CreateLikuiditasDto) {
    return this.likuiditasService.create(createLikuiditaDto);
  }

  @Get()
  findAll() {
    return this.likuiditasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.likuiditasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLikuiditaDto: UpdateLikuiditasDto) {
    return this.likuiditasService.update(+id, updateLikuiditaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.likuiditasService.remove(+id);
  }
}
