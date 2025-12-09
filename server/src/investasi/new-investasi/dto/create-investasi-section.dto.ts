import {
  IsNumber,
  IsString,
  IsOptional,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { CreateInvestasiDto } from './create-new-investasi.dto';

export class CreateSectionDto {
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
