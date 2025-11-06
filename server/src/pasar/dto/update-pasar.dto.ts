import { PartialType } from '@nestjs/swagger';
import { CreatePasarDto } from './create-pasar.dto';

export class UpdatePasarDto extends PartialType(CreatePasarDto) {}
