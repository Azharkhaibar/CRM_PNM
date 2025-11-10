import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Role, Gender } from '../enum/userEnum';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Role tidak valid' })
  role?: Role;

  @IsOptional()
  @IsEnum(Gender, { message: 'Gender tidak valid' })
  gender?: Gender;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  divisiId?: number | null;
}
