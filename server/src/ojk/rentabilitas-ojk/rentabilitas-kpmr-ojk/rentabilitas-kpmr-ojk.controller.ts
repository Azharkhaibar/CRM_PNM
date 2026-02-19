import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RentabilitasKpmrOjkService } from './rentabilitas-kpmr-ojk.service';
import { CreateRentabilitasKpmrOjkDto } from './dto/create-rentabilitas-kpmr-ojk.dto';
import { UpdateRentabilitasKpmrOjkDto } from './dto/update-rentabilitas-kpmr-ojk.dto';

@Controller('rentabilitas-kpmr-ojk')
export class RentabilitasKpmrOjkController {
  constructor(private readonly rentabilitasKpmrOjkService: RentabilitasKpmrOjkService) {}

  @Post()
  create(@Body() createRentabilitasKpmrOjkDto: CreateRentabilitasKpmrOjkDto) {
    return this.rentabilitasKpmrOjkService.create(createRentabilitasKpmrOjkDto);
  }

  @Get()
  findAll() {
    return this.rentabilitasKpmrOjkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rentabilitasKpmrOjkService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRentabilitasKpmrOjkDto: UpdateRentabilitasKpmrOjkDto) {
    return this.rentabilitasKpmrOjkService.update(+id, updateRentabilitasKpmrOjkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rentabilitasKpmrOjkService.remove(+id);
  }
}
