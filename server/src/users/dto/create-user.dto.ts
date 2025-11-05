import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Gender } from '../enum/userEnum';
import { Transform, Type } from 'class-transformer';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';

const mapToEnum =
  <T extends Record<string, string | number>>(enumObj: T) =>
  ({ value }: { value: unknown }): T[keyof T] | undefined => {
    if (typeof value !== 'string' && typeof value !== 'number') {
      return undefined;
    }

    const str = String(value).trim().toLowerCase();
    const entry = Object.values(enumObj).find(
      (v) => String(v).toLowerCase() === str,
    );

    return entry as T[keyof T] | undefined;
  };

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @Transform(mapToEnum(Gender), { toClassOnly: true })
  @IsEnum(Gender, { message: 'Invalid Gender' })
  gender: Gender;

  @ValidateNested()
  @Type(() => CreateAuthDto)
  auth: CreateAuthDto;
}
