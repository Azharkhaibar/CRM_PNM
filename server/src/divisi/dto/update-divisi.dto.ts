import { PartialType } from '@nestjs/swagger';
import { CreateDivisiDto } from './create-divisi.dto';

export class UpdateDivisiDto extends PartialType(CreateDivisiDto) {}
