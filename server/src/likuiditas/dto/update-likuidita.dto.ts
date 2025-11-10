import { PartialType } from '@nestjs/mapped-types';
import { CreateLikuiditasDto } from './create-likuidita.dto';

export class UpdateLikuiditasDto extends PartialType(CreateLikuiditasDto) {}
