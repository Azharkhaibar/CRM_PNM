import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  IsBoolean,
  Min,
  Max,
  IsIn,
} from 'class-validator';

export class KpmrPasarQueryDto {
  @ApiPropertyOptional({ description: 'Tahun filter', example: 2024 })
  @IsInt()
  @Min(2000)
  @Max(2100)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  year?: number;

  @ApiPropertyOptional({ description: 'Quarter filter (1-4)', example: 1 })
  @IsInt()
  @Min(1)
  @Max(4)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  quarter?: number;

  @ApiPropertyOptional({ description: 'Filter aktif/tidak', example: true })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Filter terkunci/tidak', example: false })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isLocked?: boolean;

  @ApiPropertyOptional({ description: 'Search keyword', example: 'governance' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', example: 10 })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Sort by field', example: 'createdAt' })
  @IsString()
  @IsOptional()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['ASC', 'DESC'],
    example: 'DESC',
  })
  @IsString()
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

export class KpmrPasarStatsQueryDto {
  @ApiPropertyOptional({ description: 'Tahun filter', example: 2024 })
  @IsInt()
  @Min(2000)
  @Max(2100)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  year?: number;

  @ApiPropertyOptional({ description: 'Quarter filter (1-4)', example: 1 })
  @IsInt()
  @Min(1)
  @Max(4)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  quarter?: number;
}
