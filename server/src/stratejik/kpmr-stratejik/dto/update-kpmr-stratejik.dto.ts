import { PartialType } from '@nestjs/swagger';
import { CreateKpmrStratejikDto } from './create-kpmr-stratejik.dto';

export class UpdateKpmrStratejikDto extends PartialType(CreateKpmrStratejikDto) {}
