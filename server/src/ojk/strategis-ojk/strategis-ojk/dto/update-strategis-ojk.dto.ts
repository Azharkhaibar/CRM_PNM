import { PartialType } from '@nestjs/swagger';
import { CreateStrategisOjkDto } from './create-strategis-ojk.dto';

export class UpdateStrategisOjkDto extends PartialType(CreateStrategisOjkDto) {}
