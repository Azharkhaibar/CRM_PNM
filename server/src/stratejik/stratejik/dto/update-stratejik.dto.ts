import { PartialType } from '@nestjs/swagger';
import { CreateStrategikDto } from './create-stratejik.dto';

export class UpdateStrategikDto extends PartialType(CreateStrategikDto) {}
