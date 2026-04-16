import { PartialType } from '@nestjs/mapped-types';
import { CreateLikuiditasDto } from './create-likuiditas.dto';

export class UpdateLikuiditasDto extends PartialType(CreateLikuiditasDto) {}
