import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PasarService } from './pasar.service';
import { CreatePasarDto } from './dto/create-pasar.dto';
import { UpdatePasarDto } from './dto/update-pasar.dto';
import { plainToInstance } from 'class-transformer';
import { GetPasarDto } from './dto/get-pasar.dto';

@Controller('pasar')
export class PasarController {
  constructor(private readonly pasarService: PasarService) {}

  @Post()
  async create(@Body() dto: CreatePasarDto) {
    const data = await this.pasarService.create(dto);

    return plainToInstance(GetPasarDto, data, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  async findAll() {
    const data = await this.pasarService.findAll();

    return plainToInstance(GetPasarDto, data, {
      excludeExtraneousValues: true,
    });
  }

  @Get('summary')
  async getSummary() {
    return this.pasarService.getPasarSummary();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.pasarService.findOne(+id);

    return plainToInstance(GetPasarDto, data, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePasarDto) {
    const data = await this.pasarService.update(+id, dto);

    return plainToInstance(GetPasarDto, data, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.pasarService.remove(+id);
  }
}
