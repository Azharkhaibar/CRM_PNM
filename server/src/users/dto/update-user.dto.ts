import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Role, Gender } from '../enum/userEnum';

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
}
