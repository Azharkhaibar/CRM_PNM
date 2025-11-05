import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  @IsNotEmpty()
  userID: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
