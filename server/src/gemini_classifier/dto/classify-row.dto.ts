import { IsArray } from 'class-validator';

export class ClassifyRowDto {
  @IsArray()
  row: string[];
}
