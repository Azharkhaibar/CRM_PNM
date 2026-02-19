import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RentabilitasOjkService } from './rentabilitas-ojk.service';
import { CreateRentabilitasOjkDto } from './dto/create-rentabilitas-ojk.dto';
import { UpdateRentabilitasOjkDto } from './dto/update-rentabilitas-ojk.dto';

@Controller('rentabilitas-ojk')
export class RentabilitasOjkController {
  constructor(private readonly rentabilitasOjkService: RentabilitasOjkService) {}

  @Post()
  create(@Body() createRentabilitasOjkDto: CreateRentabilitasOjkDto) {
    return this.rentabilitasOjkService.create(createRentabilitasOjkDto);
  }

  @Get()
  findAll() {
    return this.rentabilitasOjkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rentabilitasOjkService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRentabilitasOjkDto: UpdateRentabilitasOjkDto) {
    return this.rentabilitasOjkService.update(+id, updateRentabilitasOjkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rentabilitasOjkService.remove(+id);
  }
}
