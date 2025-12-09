import { IsNumber, IsString, IsEnum, IsInstance, IsIn } from 'class-validator';

export class UserStatusDto {
  @IsNumber()
  userId: number;

  @IsString()
  userName: string;

  @IsIn(['online', 'offline'])
  status: 'online' | 'offline';
}
