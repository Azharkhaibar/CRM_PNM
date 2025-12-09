import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KpmrHukumService } from './kpmr-hukum.service';
import { CreateKpmrHukumDto } from './dto/create-kpmr-hukum.dto';
import { UpdateKpmrHukumDto } from './dto/update-kpmr-hukum.dto';

@Controller('kpmr-hukum')
export class KpmrHukumController {
  constructor(private readonly kpmrHukumService: KpmrHukumService) {}

  @Post()
  create(@Body() createKpmrHukumDto: CreateKpmrHukumDto) {
    return this.kpmrHukumService.create(createKpmrHukumDto);
  }

  @Get()
  findAll() {
    return this.kpmrHukumService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kpmrHukumService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKpmrHukumDto: UpdateKpmrHukumDto) {
    return this.kpmrHukumService.update(+id, updateKpmrHukumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kpmrHukumService.remove(+id);
  }
}
