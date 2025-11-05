import { Expose } from 'class-transformer';

export class GetAuthDto {
  @Expose()
  auth_id: number;

  @Expose()
  email: string;

  @Expose()
  hash_password: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Expose()
  deleted_at: Date;
}
