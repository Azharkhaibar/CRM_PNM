import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateStratejikSectionDto {
  @IsString()
  @IsNotEmpty()
  no: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  bobotSection: number;

  @IsString()
  @IsNotEmpty()
  parameter: string;

  @IsString()
  @IsOptional()
  description?: string;
}
