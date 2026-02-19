import { PartialType } from '@nestjs/swagger';
import { CreateRentabilitasKpmrOjkDto } from './create-rentabilitas-kpmr-ojk.dto';

export class UpdateRentabilitasKpmrOjkDto extends PartialType(CreateRentabilitasKpmrOjkDto) {}
