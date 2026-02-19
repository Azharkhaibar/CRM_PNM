import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OperasionalKpmrOjkService } from './operasional-kpmr-ojk.service';
import { CreateOperasionalKpmrOjkDto } from './dto/create-operasional-kpmr-ojk.dto';
import { UpdateOperasionalKpmrOjkDto } from './dto/update-operasional-kpmr-ojk.dto';

@Controller('operasional-kpmr-ojk')
export class OperasionalKpmrOjkController {
  constructor(private readonly operasionalKpmrOjkService: OperasionalKpmrOjkService) {}

  @Post()
  create(@Body() createOperasionalKpmrOjkDto: CreateOperasionalKpmrOjkDto) {
    return this.operasionalKpmrOjkService.create(createOperasionalKpmrOjkDto);
  }

  @Get()
  findAll() {
    return this.operasionalKpmrOjkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.operasionalKpmrOjkService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOperasionalKpmrOjkDto: UpdateOperasionalKpmrOjkDto) {
    return this.operasionalKpmrOjkService.update(+id, updateOperasionalKpmrOjkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.operasionalKpmrOjkService.remove(+id);
  }
}
