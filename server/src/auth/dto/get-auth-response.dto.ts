import { Expose } from 'class-transformer';

export class GetAuthResponseDto {
  @Expose()
  email?: string;
}

export interface RequestUser {
  sub: number;
  userID: string;
  role: string;
}
