import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Role, Gender } from '../enum/userEnum';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'UserID wajib diisi' })
  userID: string;

  @IsString()
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;

  @IsEnum(Role, { message: 'Role tidak valid' })
  role: Role;

  @IsEnum(Gender, { message: 'Gender tidak valid' })
  gender: Gender;
}
