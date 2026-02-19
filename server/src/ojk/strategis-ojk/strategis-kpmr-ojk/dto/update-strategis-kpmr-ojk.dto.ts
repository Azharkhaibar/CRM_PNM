import { PartialType } from '@nestjs/swagger';
import { CreateStrategisKpmrOjkDto } from './create-strategis-kpmr-ojk.dto';

export class UpdateStrategisKpmrOjkDto extends PartialType(CreateStrategisKpmrOjkDto) {}
