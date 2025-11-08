import { Expose } from 'class-transformer';

export class GetAuthDto {
  @Expose()
  auth_id: number;

  @Expose()
  userID: string;

  @Expose()
  hash_password: string;

  @Expose()
  refresh_token?: string;

  @Expose()
  reset_password_token?: string;
}
