import { IsNumber, IsString } from 'class-validator';

export class UserStatusDto {
  @IsNumber()
  user_id: number;

  @IsString()
  userName: string;

  @IsString()
  status: string;
}
