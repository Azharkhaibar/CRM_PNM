import { IsNumber, IsString, IsIn } from 'class-validator';

export class UserStatusDto {
  @IsNumber()
  userId: number;

  @IsString()
  userName: string;

  @IsIn(['online', 'offline'])
  status: 'online' | 'offline';
}
