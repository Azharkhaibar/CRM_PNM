import { Expose, Type } from 'class-transformer';
import { GetAuthResponseDto } from 'src/auth/dto/get-auth-response.dto';

export class GetUserDto {
  @Expose()
  user_id: number;

  @Expose()
  username: string;

  @Expose()
  gender: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Expose()
  deleted_at: Date;

  @Expose()
  @Type(() => GetAuthResponseDto)
  auth: GetAuthResponseDto;
}
