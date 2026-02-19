import { PartialType } from '@nestjs/swagger';
import { CreatePasarDto } from './create-pasar-indikator.dto';
export class UpdatePasarDto extends PartialType(CreatePasarDto) {}
