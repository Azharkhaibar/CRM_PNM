import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
// Import yang BENAR:
import { OperationalService } from './operasional.service';
import {
  CreateSectionOperationalDto,
  CreateIndikatorOperationalDto,
} from './dto/create-operasional.dto';
import {
  UpdateSectionOperationalDto,
  UpdateIndikatorOperationalDto,
} from './dto/update-operasional.dto';
import { Quarter } from './entities/operasional.entity';

@ApiTags('operasional')
@Controller('operasional')
export class OperasionalController {
  // Nama controller bisa OperasionalController
  constructor(private readonly operationalService: OperationalService) {} // Gunakan OperationalService

  // ===================== SECTION ENDPOINTS =====================
  @Post('sections')
  @ApiOperation({ summary: 'Create new operational section' })
  createSection(@Body() createSectionDto: CreateSectionOperationalDto) {
    return this.operationalService.createSection(createSectionDto);
  }

  @Patch('sections/:id')
  @ApiOperation({ summary: 'Update operational section' })
  updateSection(
    @Param('id') id: string,
    @Body() updateSectionDto: UpdateSectionOperationalDto,
  ) {
    return this.operationalService.updateSection(+id, updateSectionDto);
  }

  @Delete('sections/:id')
  @ApiOperation({ summary: 'Delete operational section' })
  deleteSection(@Param('id') id: string) {
    return this.operationalService.deleteSection(+id);
  }

  @Get('sections')
  @ApiOperation({ summary: 'Get operational sections by period' })
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiQuery({ name: 'quarter', required: true, enum: Quarter })
  getSectionsByPeriod(
    @Query('year') year: number,
    @Query('quarter') quarter: Quarter,
  ) {
    return this.operationalService.getSectionsByPeriod(year, quarter);
  }

  @Get('sections/:id')
  @ApiOperation({ summary: 'Get operational section by ID' })
  getSectionById(@Param('id') id: string) {
    return this.operationalService.getSectionById(+id);
  }

  // ===================== INDICATOR ENDPOINTS =====================
  @Post('indicators')
  @ApiOperation({ summary: 'Create new operational indicator' })
  createIndikator(@Body() createIndikatorDto: CreateIndikatorOperationalDto) {
    return this.operationalService.createIndikator(createIndikatorDto);
  }

  @Patch('indicators/:id')
  @ApiOperation({ summary: 'Update operational indicator' })
  updateIndikator(
    @Param('id') id: string,
    @Body() updateIndikatorDto: UpdateIndikatorOperationalDto,
  ) {
    return this.operationalService.updateIndikator(+id, updateIndikatorDto);
  }

  @Delete('indicators/:id')
  @ApiOperation({ summary: 'Delete operational indicator' })
  deleteIndikator(@Param('id') id: string) {
    return this.operationalService.deleteIndikator(+id);
  }

  @Get('indicators/:id')
  @ApiOperation({ summary: 'Get operational indicator by ID' })
  getIndikatorById(@Param('id') id: string) {
    return this.operationalService.getIndikatorById(+id);
  }

  // ===================== SUMMARY & UTILITY =====================
  @Get('summary')
  @ApiOperation({ summary: 'Get operational summary by period' })
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiQuery({ name: 'quarter', required: true, enum: Quarter })
  getSummaryByPeriod(
    @Query('year') year: number,
    @Query('quarter') quarter: Quarter,
  ) {
    return this.operationalService.getSummaryByPeriod(year, quarter);
  }
}
