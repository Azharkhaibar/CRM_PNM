import { PartialType } from '@nestjs/mapped-types';
import { CreateRasDto } from './create-ra.dto';

export class UpdateRasDto extends PartialType(CreateRasDto) {}
