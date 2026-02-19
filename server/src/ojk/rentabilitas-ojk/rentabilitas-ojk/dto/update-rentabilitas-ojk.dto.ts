import { PartialType } from '@nestjs/swagger';
import { CreateRentabilitasOjkDto } from './create-rentabilitas-ojk.dto';

export class UpdateRentabilitasOjkDto extends PartialType(CreateRentabilitasOjkDto) {}
