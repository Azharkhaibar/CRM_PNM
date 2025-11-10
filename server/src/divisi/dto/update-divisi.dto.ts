import { PartialType } from '@nestjs/mapped-types';
import { CreateDivisiDto } from './create-divisi.dto';

export class UpdateDivisiDto extends PartialType(CreateDivisiDto) {}
