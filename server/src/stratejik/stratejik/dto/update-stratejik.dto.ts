import { PartialType } from '@nestjs/swagger';
import { CreateStratejikDto } from './create-stratejik.dto';


export class UpdateStratejikDto extends PartialType(CreateStratejikDto) {}
