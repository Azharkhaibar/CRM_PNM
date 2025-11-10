import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDivisiDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
