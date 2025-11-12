import { IsNumber, IsString, IsEnum } from 'class-validator';

export class UserStatusDto {
  @IsNumber() userId: number;
  @IsString() userName: string;
  @IsEnum(['online', 'offline']) status: 'online' | 'offline';
}
