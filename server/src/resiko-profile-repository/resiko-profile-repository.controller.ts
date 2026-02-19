// src/resiko-profile-repository/resiko-profile-repository.controller.ts
import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Param,
  BadRequestException,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ResikoProfileRepositoryService } from './resiko-profile-repository.service';
// import {
//   RepositoryFilters,
//   PaginationOptions,
//   RepositoryResponse,
//   RepositoryStatistics,
// } from './interfaces/resiko-profile-repository.interface';
import {
  RepositoryFilters,
  PaginationOptions,
  RepositoryResponse,
  RepositoryStatistics,
} from './interfaces/risk-profile-repository.interface';
import {
  ModuleType,
  Quarter,
} from './entities/resiko-profile-repository.entity';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('Risk Profile Repository')
@Controller('risk-profile-repository')
@UseInterceptors(ClassSerializerInterceptor)
export class ResikoProfileRepositoryController {
  constructor(
    private readonly resikoProfileRepositoryService: ResikoProfileRepositoryService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all repository data with filtering' })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'quarter', required: false, enum: Quarter })
  @ApiQuery({
    name: 'moduleTypes',
    required: false,
    isArray: true,
    enum: ModuleType,
  })
  @ApiQuery({ name: 'searchQuery', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number, default: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 100 })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  @ApiResponse({
    status: 200,
    description: 'Repository data retrieved successfully',
  })
  async getRepositoryData(
    @Query('year') year?: number,
    @Query('quarter') quarter?: Quarter,
    @Query('moduleTypes') moduleTypes?: ModuleType[],
    @Query('searchQuery') searchQuery?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 100,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ): Promise<RepositoryResponse> {
    const filters: RepositoryFilters = {
      year: year ? Number(year) : undefined,
      quarter,
      moduleTypes: moduleTypes
        ? Array.isArray(moduleTypes)
          ? moduleTypes
          : [moduleTypes]
        : undefined,
      searchQuery,
    };

    const pagination: PaginationOptions = {
      page: Number(page),
      limit: Number(limit),
      sortBy,
      sortOrder,
    };

    return this.resikoProfileRepositoryService.getRepositoryData(
      filters,
      pagination,
    );
  }

  @Get('module/:module')
  @ApiOperation({ summary: 'Get repository data by specific module' })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'quarter', required: false, enum: Quarter })
  @ApiQuery({ name: 'searchQuery', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number, default: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 100 })
  @ApiResponse({
    status: 200,
    description: 'Module data retrieved successfully',
  })
  async getRepositoryDataByModule(
    @Param('module') module: ModuleType,
    @Query('year') year?: number,
    @Query('quarter') quarter?: Quarter,
    @Query('searchQuery') searchQuery?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 100,
  ): Promise<RepositoryResponse> {
    // Validate module type
    if (!Object.values(ModuleType).includes(module)) {
      throw new BadRequestException(`Invalid module type: ${module}`);
    }

    const filters: RepositoryFilters = {
      year: year ? Number(year) : undefined,
      quarter,
      searchQuery,
    };

    const pagination: PaginationOptions = {
      page: Number(page),
      limit: Number(limit),
    };

    return this.resikoProfileRepositoryService.getRepositoryDataByModule(
      module,
      filters,
      pagination,
    );
  }

  @Get('search')
  @ApiOperation({ summary: 'Search across all modules' })
  @ApiQuery({ name: 'query', required: true, type: String })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'quarter', required: false, enum: Quarter })
  @ApiQuery({
    name: 'moduleTypes',
    required: false,
    isArray: true,
    enum: ModuleType,
  })
  @ApiQuery({ name: 'page', required: false, type: Number, default: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 100 })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully',
  })
  async searchRepositoryData(
    @Query('query') query: string,
    @Query('year') year?: number,
    @Query('quarter') quarter?: Quarter,
    @Query('moduleTypes') moduleTypes?: ModuleType[],
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 100,
  ): Promise<RepositoryResponse> {
    if (!query || query.trim().length === 0) {
      throw new BadRequestException('Search query is required');
    }

    const filters: RepositoryFilters = {
      year: year ? Number(year) : undefined,
      quarter,
      moduleTypes: moduleTypes
        ? Array.isArray(moduleTypes)
          ? moduleTypes
          : [moduleTypes]
        : undefined,
    };

    const pagination: PaginationOptions = {
      page: Number(page),
      limit: Number(limit),
    };

    return this.resikoProfileRepositoryService.searchRepositoryData(
      query,
      filters,
      pagination,
    );
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get repository statistics for a period' })
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiQuery({ name: 'quarter', required: true, enum: Quarter })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getRepositoryStatistics(
    @Query('year') year: number,
    @Query('quarter') quarter: Quarter,
  ): Promise<RepositoryStatistics> {
    if (!year) {
      throw new BadRequestException('Year is required');
    }
    if (!quarter || !Object.values(Quarter).includes(quarter)) {
      throw new BadRequestException('Valid quarter is required');
    }

    return this.resikoProfileRepositoryService.getRepositoryStatistics(
      Number(year),
      quarter,
    );
  }

  // Update controller export endpoint
  @Get('export')
  @ApiOperation({ summary: 'Export repository data (CSV only)' })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'quarter', required: false, enum: Quarter })
  @ApiQuery({
    name: 'moduleTypes',
    required: false,
    isArray: true,
    enum: ModuleType,
  })
  @ApiResponse({
    status: 200,
    description: 'Export file generated successfully',
  })
  async exportRepositoryData(
    @Query('year') year?: number,
    @Query('quarter') quarter?: Quarter,
    @Query('moduleTypes') moduleTypes?: ModuleType[],
  ) {
    const filters: RepositoryFilters = {
      year: year ? Number(year) : undefined,
      quarter,
      moduleTypes: moduleTypes
        ? Array.isArray(moduleTypes)
          ? moduleTypes
          : [moduleTypes]
        : undefined,
    };

    const buffer =
      await this.resikoProfileRepositoryService.exportRepositoryData(
        filters,
        'csv',
      );

    const filename = `Risk_Profile_Repository_${year || 'all'}_${quarter || 'all'}_${new Date().toISOString().split('T')[0]}.csv`;

    return {
      buffer,
      contentType: 'text/csv',
      filename,
    };
  }

  @Get('modules')
  @ApiOperation({ summary: 'Get list of available modules' })
  @ApiResponse({
    status: 200,
    description: 'Module list retrieved successfully',
  })
  getAvailableModules() {
    return {
      modules: Object.values(ModuleType).map((module) => ({
        code: module,
        name: this.getModuleName(module),
        color: this.getModuleColor(module),
      })),
    };
  }

  @Get('periods')
  @ApiOperation({ summary: 'Get available periods in repository' })
  @ApiResponse({ status: 200, description: 'Periods retrieved successfully' })
  async getAvailablePeriods() {
    return this.resikoProfileRepositoryService.getAvailablePeriods();
  }

  // Helper methods
  private getModuleName(module: ModuleType): string {
    const moduleNames = {
      [ModuleType.KEPATUHAN]: 'Kepatuhan',
      [ModuleType.REPUTASI]: 'Reputasi',
      [ModuleType.INVESTASI]: 'Investasi',
      [ModuleType.LIKUIDITAS]: 'Likuiditas',
      [ModuleType.OPERASIONAL]: 'Operasional',
      [ModuleType.STRATEGIK]: 'Strategik',
      [ModuleType.HUKUM]: 'Hukum',
      [ModuleType.PASAR]: 'Pasar',
      // [ModuleType.STRATEGIS]: 'Strategis',
      // [ModuleType.KEUANGAN]: 'Keuangan',
      // [ModuleType.TEKNOLOGI]: 'Teknologi',
    };
    return moduleNames[module] || module;
  }

  private getModuleColor(module: ModuleType): string {
    const moduleColors = {
      [ModuleType.KEPATUHAN]: '#0068B3',
      [ModuleType.REPUTASI]: '#00A3DA',
      [ModuleType.INVESTASI]: '#33C2B5',
      [ModuleType.LIKUIDITAS]: '#FF6B6B',
      [ModuleType.OPERASIONAL]: '#FFA726',
      [ModuleType.STRATEGIK]: '#9C27B0',
      [ModuleType.HUKUM]: '#4CAF50',
      [ModuleType.PASAR]: '#607D8B',
    };
    return moduleColors[module] || '#6B7280';
  }
}
