import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OperasionalService } from './operasional.service';
import { CreateOperasionalDto } from './dto/create-operasional.dto';
import { UpdateOperasionalDto } from './dto/update-operasional.dto';

@Controller('operasional')
export class OperasionalController {
  constructor(private readonly operasionalService: OperasionalService) {}

  @Post()
  create(@Body() createOperasionalDto: CreateOperasionalDto) {
    return this.operasionalService.create(createOperasionalDto);
  }

  @Get()
  findAll() {
    return this.operasionalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.operasionalService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOperasionalDto: UpdateOperasionalDto) {
    return this.operasionalService.update(+id, updateOperasionalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.operasionalService.remove(+id);
  }
}
