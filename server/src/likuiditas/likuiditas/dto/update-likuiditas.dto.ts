import { PartialType } from '@nestjs/swagger';
import { CreateLikuiditasDto } from './create-likuiditas.dto';
export class UpdateLikuiditasDto extends PartialType(CreateLikuiditasDto) {}
