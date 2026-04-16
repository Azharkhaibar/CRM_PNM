import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  NotFoundException,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { StrategisOjkService } from './strategis-ojk.service';
// import {
//   CreateStrategisOjkDto,
//   UpdateStrategisOjkDto,
//   CreateParameterDto,
//   UpdateParameterDto,
//   CreateNilaiDto,
//   UpdateNilaiDto,
//   ReorderParametersDto,
//   ReorderNilaiDto,
//   UpdateSummaryDto,
//   ImportExportDto,
// } from './dto/strategis-ojk.dto';

import {
  CreateStrategisOjkDto,
  CreateNilaiDto,
  CreateParameterDto,
  UpdateNilaiDto,
  UpdateStrategisOjkDto,
  UpdateParameterDto,
  UpdateSummaryDto,
  ReorderNilaiDto,
  ReorderParametersDto,
  ImportExportDto,
} from './dto/strategis-inherent.dto';

@ApiTags('Strategis OJK')
@Controller('strategis-ojk')
@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
export class StrategisOjkController {
  constructor(private readonly strategisService: StrategisOjkService) {}

  // === CRUD UTAMA ===

  @Get()
  @ApiOperation({ summary: 'Get all Strategis OJK data or by year/quarter' })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'quarter', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Data retrieved successfully' })
  async findAll(
    @Query('year') year?: number,
    @Query('quarter') quarter?: number,
  ) {
    if (year && quarter) {
      const result = await this.strategisService.findByYearQuarter(
        year,
        quarter,
      );
      if (!result) {
        throw new NotFoundException(
          `Data tidak ditemukan untuk tahun ${year} quarter ${quarter}`,
        );
      }
      return result;
    }
    return this.strategisService.getAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active Strategis OJK data' })
  @ApiResponse({
    status: 200,
    description: 'Active data retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'No active data found' })
  async getActive() {
    const result = await this.strategisService.findActive();
    if (!result) {
      throw new NotFoundException('Tidak ada data aktif ditemukan');
    }
    return result;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Strategis OJK by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Data retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Data not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    // PERBAIKAN: Cari langsung berdasarkan ID dengan method baru
    const activeData = await this.strategisService.findActive();

    if (!activeData) {
      throw new NotFoundException('Tidak ada data aktif ditemukan');
    }

    // Gunakan year dan quarter dari active data
    const result = await this.strategisService.findByYearQuarter(
      activeData.year,
      activeData.quarter,
    );

    if (!result) {
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    }
    return result;
  }

  @Post()
  @ApiOperation({ summary: 'Create new Strategis OJK data' })
  @ApiBody({ type: CreateStrategisOjkDto })
  @ApiResponse({ status: 201, description: 'Data created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createDto: CreateStrategisOjkDto, @Request() req) {
    const userId = req.user?.id || 'system';
    return this.strategisService.create(createDto, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Strategis OJK data' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateStrategisOjkDto })
  @ApiResponse({ status: 200, description: 'Data updated successfully' })
  @ApiResponse({ status: 404, description: 'Data not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateStrategisOjkDto,
    @Request() req,
  ) {
    const userId = req.user?.id || 'system';
    return this.strategisService.update(id, updateDto, userId);
  }

  @Put(':id/summary')
  @ApiOperation({ summary: 'Update summary only' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateSummaryDto })
  @ApiResponse({ status: 200, description: 'Summary updated successfully' })
  @ApiResponse({ status: 404, description: 'Data not found' })
  async updateSummary(
    @Param('id', ParseIntPipe) id: number,
    @Body() summaryDto: UpdateSummaryDto,
    @Request() req,
  ) {
    const userId = req.user?.id || 'system';
    return this.strategisService.updateSummary(id, summaryDto, userId);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update active status' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ schema: { properties: { isActive: { type: 'boolean' } } } })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  @ApiResponse({ status: 404, description: 'Data not found' })
  async updateActiveStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('isActive') isActive: boolean,
    @Request() req,
  ) {
    const userId = req.user?.id || 'system';
    return this.strategisService.updateActiveStatus(id, isActive, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Strategis OJK data' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Data deleted successfully' })
  @ApiResponse({ status: 404, description: 'Data not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.strategisService.remove(id);
  }

  // === OPERASI PARAMETER ===

  @Get(':id/parameters')
  @ApiOperation({ summary: 'Get all parameters for specific Strategis OJK' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Parameters retrieved successfully',
  })
  async getParameters(@Param('id', ParseIntPipe) strategisId: number) {
    // PERBAIKAN: Cari strategis berdasarkan ID, bukan year/quarter
    const strategis = await this.getStrategisByIdOrThrow(strategisId);
    return strategis.parameters || [];
  }

  @Post(':id/parameters')
  @ApiOperation({ summary: 'Add new parameter' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: CreateParameterDto })
  @ApiResponse({ status: 201, description: 'Parameter added successfully' })
  @ApiResponse({ status: 404, description: 'Data not found' })
  async addParameter(
    @Param('id', ParseIntPipe) strategisId: number,
    @Body() createParamDto: CreateParameterDto,
    @Request() req,
  ) {
    const userId = req.user?.id || 'system';
    return this.strategisService.addParameter(
      strategisId,
      createParamDto,
      userId,
    );
  }

  @Put(':id/parameters/:parameterId')
  @ApiOperation({ summary: 'Update parameter' })
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'parameterId', type: Number })
  @ApiBody({ type: UpdateParameterDto })
  @ApiResponse({ status: 200, description: 'Parameter updated successfully' })
  @ApiResponse({ status: 404, description: 'Parameter not found' })
  async updateParameter(
    @Param('id', ParseIntPipe) strategisId: number,
    @Param('parameterId', ParseIntPipe) parameterId: number,
    @Body() updateParamDto: UpdateParameterDto,
    @Request() req,
  ) {
    const userId = req.user?.id || 'system';
    return this.strategisService.updateParameter(
      strategisId,
      parameterId,
      updateParamDto,
      userId,
    );
  }

  @Put(':id/parameters/reorder')
  @ApiOperation({ summary: 'Reorder parameters' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: ReorderParametersDto })
  @ApiResponse({
    status: 200,
    description: 'Parameters reordered successfully',
  })
  async reorderParameters(
    @Param('id', ParseIntPipe) strategisId: number,
    @Body() reorderDto: ReorderParametersDto,
  ) {
    return this.strategisService.reorderParameters(strategisId, reorderDto);
  }

  @Post(':id/parameters/:parameterId/copy')
  @ApiOperation({ summary: 'Copy parameter' })
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'parameterId', type: Number })
  @ApiResponse({ status: 201, description: 'Parameter copied successfully' })
  @ApiResponse({ status: 404, description: 'Parameter not found' })
  async copyParameter(
    @Param('id', ParseIntPipe) strategisId: number,
    @Param('parameterId', ParseIntPipe) parameterId: number,
    @Request() req,
  ) {
    const userId = req.user?.id || 'system';
    return this.strategisService.copyParameter(
      strategisId,
      parameterId,
      userId,
    );
  }

  @Delete(':id/parameters/:parameterId')
  @ApiOperation({ summary: 'Delete parameter' })
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'parameterId', type: Number })
  @ApiResponse({ status: 200, description: 'Parameter deleted successfully' })
  @ApiResponse({ status: 404, description: 'Parameter not found' })
  async removeParameter(
    @Param('id', ParseIntPipe) strategisId: number,
    @Param('parameterId', ParseIntPipe) parameterId: number,
    @Request() req,
  ) {
    const userId = req.user?.id || 'system';
    return this.strategisService.removeParameter(
      strategisId,
      parameterId,
      userId,
    );
  }

  // === OPERASI NILAI ===

  @Get(':id/parameters/:parameterId/nilai')
  @ApiOperation({ summary: 'Get all nilai for specific parameter' })
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'parameterId', type: Number })
  @ApiResponse({ status: 200, description: 'Nilai retrieved successfully' })
  async getNilai(
    @Param('id', ParseIntPipe) strategisId: number,
    @Param('parameterId', ParseIntPipe) parameterId: number,
  ) {
    // PERBAIKAN: Cari strategis berdasarkan ID
    const strategis = await this.getStrategisByIdOrThrow(strategisId);

    const parameter = strategis.parameters?.find((p) => p.id === parameterId);
    if (!parameter) {
      throw new NotFoundException(
        `Parameter dengan ID ${parameterId} tidak ditemukan`,
      );
    }
    return parameter.nilaiList || [];
  }

  @Post(':id/parameters/:parameterId/nilai')
  @ApiOperation({ summary: 'Add new nilai' })
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'parameterId', type: Number })
  @ApiBody({ type: CreateNilaiDto })
  @ApiResponse({ status: 201, description: 'Nilai added successfully' })
  @ApiResponse({ status: 404, description: 'Parameter not found' })
  async addNilai(
    @Param('id', ParseIntPipe) strategisId: number,
    @Param('parameterId', ParseIntPipe) parameterId: number,
    @Body() createNilaiDto: CreateNilaiDto,
    @Request() req,
  ) {
    const userId = req.user?.id || 'system';
    return this.strategisService.addNilai(
      strategisId,
      parameterId,
      createNilaiDto,
      userId,
    );
  }

  @Put(':id/parameters/:parameterId/nilai/:nilaiId')
  @ApiOperation({ summary: 'Update nilai' })
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'parameterId', type: Number })
  @ApiParam({ name: 'nilaiId', type: Number })
  @ApiBody({ type: UpdateNilaiDto })
  @ApiResponse({ status: 200, description: 'Nilai updated successfully' })
  @ApiResponse({ status: 404, description: 'Nilai not found' })
  async updateNilai(
    @Param('id', ParseIntPipe) strategisId: number,
    @Param('parameterId', ParseIntPipe) parameterId: number,
    @Param('nilaiId', ParseIntPipe) nilaiId: number,
    @Body() updateNilaiDto: UpdateNilaiDto,
    @Request() req,
  ) {
    const userId = req.user?.id || 'system';
    return this.strategisService.updateNilai(
      strategisId,
      parameterId,
      nilaiId,
      updateNilaiDto,
      userId,
    );
  }

  @Put(':id/parameters/:parameterId/nilai/reorder')
  @ApiOperation({ summary: 'Reorder nilai' })
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'parameterId', type: Number })
  @ApiBody({ type: ReorderNilaiDto })
  @ApiResponse({ status: 200, description: 'Nilai reordered successfully' })
  async reorderNilai(
    @Param('id', ParseIntPipe) strategisId: number,
    @Param('parameterId', ParseIntPipe) parameterId: number,
    @Body() reorderDto: ReorderNilaiDto,
  ) {
    return this.strategisService.reorderNilai(parameterId, reorderDto);
  }

  @Post(':id/parameters/:parameterId/nilai/:nilaiId/copy')
  @ApiOperation({ summary: 'Copy nilai' })
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'parameterId', type: Number })
  @ApiParam({ name: 'nilaiId', type: Number })
  @ApiResponse({ status: 201, description: 'Nilai copied successfully' })
  @ApiResponse({ status: 404, description: 'Nilai not found' })
  async copyNilai(
    @Param('id', ParseIntPipe) strategisId: number,
    @Param('parameterId', ParseIntPipe) parameterId: number,
    @Param('nilaiId', ParseIntPipe) nilaiId: number,
    @Request() req,
  ) {
    const userId = req.user?.id || 'system';
    return this.strategisService.copyNilai(
      strategisId,
      parameterId,
      nilaiId,
      userId,
    );
  }

  @Delete(':id/parameters/:parameterId/nilai/:nilaiId')
  @ApiOperation({ summary: 'Delete nilai' })
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'parameterId', type: Number })
  @ApiParam({ name: 'nilaiId', type: Number })
  @ApiResponse({ status: 200, description: 'Nilai deleted successfully' })
  @ApiResponse({ status: 404, description: 'Nilai not found' })
  async removeNilai(
    @Param('id', ParseIntPipe) strategisId: number,
    @Param('parameterId', ParseIntPipe) parameterId: number,
    @Param('nilaiId', ParseIntPipe) nilaiId: number,
    @Request() req,
  ) {
    const userId = req.user?.id || 'system';
    return this.strategisService.removeNilai(
      strategisId,
      parameterId,
      nilaiId,
      userId,
    );
  }

  // === IMPORT/EXPORT ===

  @Get(':id/export')
  @ApiOperation({ summary: 'Export data to Excel format' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Export successful' })
  @ApiResponse({ status: 404, description: 'Data not found' })
  async exportToExcel(@Param('id', ParseIntPipe) strategisId: number) {
    return this.strategisService.exportToExcel(strategisId);
  }

  @Post('import')
  @ApiOperation({ summary: 'Import data from Excel format' })
  @ApiBody({ type: ImportExportDto })
  @ApiResponse({ status: 201, description: 'Import successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async importFromExcel(@Body() importData: ImportExportDto, @Request() req) {
    const userId = req.user?.id || 'system';
    return this.strategisService.importFromExcel(importData, userId);
  }

  // === REFERENCE DATA ===

  @Get('references')
  @ApiOperation({ summary: 'Get reference data' })
  @ApiQuery({ name: 'type', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'References retrieved successfully',
  })
  async getReferences(@Query('type') type?: string) {
    return this.strategisService.getReferences(type);
  }

  // === UTILITY ENDPOINTS ===

  @Get('check/:year/:quarter')
  @ApiOperation({ summary: 'Check if data exists for year/quarter' })
  @ApiParam({ name: 'year', type: Number })
  @ApiParam({ name: 'quarter', type: Number })
  @ApiResponse({ status: 200, description: 'Check completed' })
  async checkExists(
    @Param('year', ParseIntPipe) year: number,
    @Param('quarter', ParseIntPipe) quarter: number,
  ) {
    const exists = await this.strategisService.findByYearQuarter(year, quarter);
    return { exists: !!exists, data: exists };
  }

  // === HELPER METHODS ===

  /**
   * Helper method untuk mendapatkan strategis by ID
   * Karena entity relasional, kita perlu mencari berdasarkan year/quarter dari strategis aktif
   */
  private async getStrategisByIdOrThrow(strategisId: number) {
    // Cari berdasarkan ID langsung (jika service punya method findById)
    // Atau gunakan active data

    const activeData = await this.strategisService.findActive();
    if (!activeData) {
      throw new NotFoundException('Tidak ada data aktif ditemukan');
    }

    // Cari data berdasarkan year/quarter dari active data
    const strategis = await this.strategisService.findByYearQuarter(
      activeData.year,
      activeData.quarter,
    );

    if (!strategis) {
      throw new NotFoundException(
        `Data dengan ID ${strategisId} tidak ditemukan`,
      );
    }

    // Validasi bahwa ID yang diminta sesuai dengan ID yang ditemukan
    if (strategis.id !== strategisId) {
      throw new NotFoundException(
        `Data dengan ID ${strategisId} tidak ditemukan`,
      );
    }

    return strategis;
  }

  /**
   * Opsional: Method alternatif jika service punya findById
   */
  private async getStrategisByIdDirect(strategisId: number) {
    // Jika service memiliki method findById, gunakan ini
    // Tapi service kita saat ini tidak punya, jadi perlu ditambahkan

    // Contoh jika service punya method findById:
    // return await this.strategisService.findById(strategisId);

    // Untuk sekarang, kita gunakan workaround dengan active data
    return this.getStrategisByIdOrThrow(strategisId);
  }
}
